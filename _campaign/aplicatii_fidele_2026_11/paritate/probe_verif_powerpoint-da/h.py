# Harness comun al verificatorului powerpoint-da (copie a ideii, scrisă din nou): server local pe 127.0.0.1, Chromium headless, tot ce nu e local = abandonat.
import json, socket, subprocess, sys, time, io, contextlib
from playwright.sync_api import sync_playwright

ROOT = 'C:/00/Projects/LearningHub_fidel'
OUT = ROOT + '/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_powerpoint-da'
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def port_liber():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p


@contextlib.contextmanager
def sesiune():
    port = port_liber()
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1', '--directory', ROOT],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.0)
    blocate = []
    try:
        with sync_playwright() as pw:
            br = pw.chromium.launch(headless=True)
            ctx = br.new_context(viewport={'width': 1400, 'height': 900})

            def ruta(route):
                u = route.request.url
                if u.startswith('http://127.0.0.1') or u.startswith('http://localhost') or u.startswith('data:') or u.startswith('blob:'):
                    route.continue_()
                else:
                    blocate.append(u); route.abort()
            ctx.route('**/*', ruta)
            yield ctx, port, blocate
            br.close()
    finally:
        srv.terminate(); srv.wait(5)


class App:
    def __init__(self, ctx, port, app, continut=None, profil=None):
        self.app = app
        self.pg = ctx.new_page()
        self.erori = []
        self.pg.on('pageerror', lambda e: self.erori.append(str(e)))
        self.pg.goto('http://127.0.0.1:%d/aplicatii/poligon.html?aplicatie=%s' % (port, app))
        self.pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.radacini && LH.aplicatii.radacini().length > 0", timeout=15000)
        if continut is not None or profil:
            self.pg.evaluate("([a,c,p]) => LH.aplicatii.deschide(a, {continut: c, profil: p || undefined, focus: true})", [app, continut, profil])
            self.pg.wait_for_timeout(400)
        self.pg.wait_for_timeout(300)
        self.ev0()

    def ev0(self):
        self.pg.evaluate("window.__verifN = (window.__lhAplicatieEv || []).length")

    def ev(self):
        return self.pg.evaluate("() => { const L = window.__lhAplicatieEv || []; const r = L.slice(window.__verifN || 0).map(x => { const d = x.detail || x; return {gest: d.gest, actiune: d.actiune, tinta: d.tinta, activat: d.activat}; }); window.__verifN = L.length; return r; }")

    def stare(self, *chei):
        s = self.pg.evaluate("a => LH.aplicatii.stare(a)", self.app)
        return {k: s.get(k) for k in chei} if chei else s

    def exista(self, tinta):
        return self.pg.evaluate("([a,t]) => !!LH.aplicatii.element(a, t)", [self.app, tinta])

    def bbox(self, tinta):
        return self.pg.evaluate("([a,t]) => { const e = LH.aplicatii.element(a, t); if (!e) return null; e.scrollIntoView({block:'nearest'}); const r = e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }", [self.app, tinta])

    def clic(self, tinta, dx=0.5, dy=0.5, mod=None, dublu=False, asteapta=250):
        b = self.bbox(tinta)
        if not b:
            raise RuntimeError('ținta lipsește: ' + tinta)
        x, y = b['x'] + b['w'] * dx, b['y'] + b['h'] * dy
        if mod:
            self.pg.keyboard.down(mod)
        if dublu:
            self.pg.mouse.dblclick(x, y)
        else:
            self.pg.mouse.click(x, y)
        if mod:
            self.pg.keyboard.up(mod)
        self.pg.wait_for_timeout(asteapta)

    def taste(self, *k, asteapta=150):
        for x in k:
            self.pg.keyboard.press(x); self.pg.wait_for_timeout(asteapta)

    def scrie(self, t, asteapta=200):
        self.pg.keyboard.type(t, delay=20); self.pg.wait_for_timeout(asteapta)

    def tinte(self, filtru=''):
        return [t for t in self.pg.evaluate("a => LH.aplicatii.tinte(a)", self.app) if filtru in t]

    def text_rad(self, sel):
        return self.pg.evaluate("([a,s]) => [...LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === a).querySelectorAll(s)].map(e => (e.innerText||e.textContent||'').trim()).slice(0,60)", [self.app, sel])

    def mesaje(self):
        return self.pg.evaluate("a => [...LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === a).querySelectorAll('[data-lh-nesimulat]')].map(e => e.getAttribute('data-lh-nesimulat') + ' || ' + (e.textContent||'').trim().slice(0,160))", self.app)

    def poza(self, nume):
        self.pg.screenshot(path=OUT + '/' + nume + '.png')


def rezultat(nume, d):
    with open(OUT + '/' + nume + '.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
