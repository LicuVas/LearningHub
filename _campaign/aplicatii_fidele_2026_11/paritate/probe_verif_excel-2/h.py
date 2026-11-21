"""Ham-ul verificatorului excel-2: server local, Playwright headless, rețea tăiată în afară de 127.0.0.1/localhost."""
import subprocess, sys, time, json, socket, io, os
from playwright.sync_api import sync_playwright
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = 'C:/00/Projects/LearningHub_fidel'

def port_liber():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

class H:
    def __enter__(self):
        self.port = port_liber()
        self.srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(self.port), '--bind', '127.0.0.1', '--directory', ROOT],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1.0)
        self.pw = sync_playwright().start()
        self.br = self.pw.chromium.launch(headless=True)
        self.ctx = self.br.new_context(viewport={'width': 1400, 'height': 900})
        def ruta(route):
            u = route.request.url
            if u.startswith('http://127.0.0.1') or u.startswith('http://localhost') or u.startswith('data:') or u.startswith('blob:'):
                route.continue_()
            else:
                route.abort()
        self.ctx.route('**/*', ruta)
        self.pg = self.ctx.new_page()
        self.erori = []
        self.pg.on('pageerror', lambda e: self.erori.append(str(e)))
        self.pg.goto(f'http://127.0.0.1:{self.port}/aplicatii/poligon.html?aplicatie=excel')
        self.pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.radacini().length>0", timeout=15000)
        time.sleep(0.5)
        return self
    def __exit__(self, *a):
        try: self.br.close(); self.pw.stop()
        finally:
            self.srv.terminate(); self.srv.wait(5)
    def deschide(self, celule, selectie='A1', **extra):
        c = {'celule': celule, 'selectie': selectie}; c.update(extra)
        self.pg.evaluate("c=>LH.aplicatii.deschide('excel',{continut:c,focus:true,scenariu:true})", c)
        time.sleep(0.6)
    def ev(self, js, arg=None):
        return self.pg.evaluate(js, arg)
    def cutie(self, tinta):
        return self.pg.evaluate("t=>{const e=LH.aplicatii.element('excel',t);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}", tinta)
    def clic(self, tinta, dublu=False, dreapta=False, dx=None):
        b = self.cutie(tinta)
        if not b: raise RuntimeError('fara tinta ' + tinta)
        x = b['x'] + (b['w'] / 2 if dx is None else dx); y = b['y'] + b['h'] / 2
        if dublu: self.pg.mouse.dblclick(x, y)
        else: self.pg.mouse.click(x, y, button='right' if dreapta else 'left')
        time.sleep(0.25)
    def taste(self, *ks):
        for k in ks: self.pg.keyboard.press(k); time.sleep(0.08)
    def scrie(self, t):
        self.pg.keyboard.type(t, delay=20); time.sleep(0.1)
    def stare(self):
        return self.pg.evaluate("LH.aplicatii.stare('excel')")
    def evenimente(self, n=5):
        return self.pg.evaluate("n=>(window.__lhAplicatieEv||[]).slice(-n).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta}))", n)
    def mesaje(self):
        return self.pg.evaluate("[...document.querySelectorAll('[data-lh-nesimulat]')].map(x=>x.textContent.trim().slice(0,300))")
    def ecran(self, a):
        return self.pg.evaluate("a=>{const e=LH.aplicatii.element('excel','celula:'+a);if(!e)return null;const cs=getComputedStyle(e);return {text:e.innerText,cls:e.className,align:cs.textAlign,color:cs.color,html:e.innerHTML.slice(0,400)}}", a)
