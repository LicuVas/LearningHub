# -*- coding: utf-8 -*-
"""Ham comun al criticului runda 6: server 127.0.0.1 pe port liber + Playwright headless cu ruta care abandoneaza tot ce nu e local."""
import functools, http.server, json, os, threading
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
WT = "C:/00/Projects/LearningHub_fidel"
P = WT + "/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe/"
def server():
    class T(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=WT))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]
def ruta(r):
    h = urlparse(r.request.url).hostname
    return r.continue_() if h in ("127.0.0.1", "localhost") else r.abort()
RECT = """s=>{const r=document.querySelector('[data-lh-aplicatie]');const R=r.getBoundingClientRect();
 return [...r.querySelectorAll(s)].filter(e=>e.getClientRects().length).map(e=>{const b=e.getBoundingClientRect();return [Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height),(e.getAttribute('data-lh-eticheta')||e.getAttribute('aria-label')||e.textContent||'').trim().slice(0,40)]})}"""
class Sesiune:
    def __init__(self, w=1366, h=768, mobil=False):
        self.srv, self.base = server()
        self.pw = sync_playwright().start()
        self.br = self.pw.chromium.launch(headless=True)
        kw = dict(viewport={"width": w, "height": h})
        if mobil: kw.update(is_mobile=True, has_touch=True, device_scale_factor=3)
        self.ctx = self.br.new_context(**kw)
        self.ctx.route("**/*", ruta)
        self.page = self.ctx.new_page()
        self.erori = []
        self.page.on("pageerror", lambda e: self.erori.append(str(e)))
    def deschide(self, app="excel", extra=""):
        self.page.goto(self.base + "/aplicatii/poligon.html?aplicatie=" + app + extra)
        self.page.wait_for_selector('[data-lh-aplicatie="%s"]' % app, timeout=15000)
        self.page.wait_for_timeout(800)
    def rect(self, sel): return self.page.evaluate(RECT, sel)
    def stare(self, app="excel"): return self.page.evaluate("a=>LH.aplicatii.stare(a)", app)
    def ev(self, js, arg=None): return self.page.evaluate(js, arg) if arg is not None else self.page.evaluate(js)
    def shot(self, nume, **k): self.page.screenshot(path=P + nume, **k)
    def gata(self):
        self.ctx.close(); self.br.close(); self.pw.stop(); self.srv.shutdown()
CEL = """a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+a+'"]');if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}"""
VEZI = """a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+a+'"]');if(!e)return null;
 const t=e.querySelector('.lh-ap-x-t');const cs=getComputedStyle(e);const b=e.getBoundingClientRect();const tb=t?t.getBoundingClientRect():null;
 return {text:t?t.textContent:'',jc:cs.justifyContent,cell:[Math.round(b.x),Math.round(b.width)],txt:tb?[Math.round(tb.x),Math.round(tb.width)]:null,sw:t?t.scrollWidth:0,cw:t?t.clientWidth:0,cls:e.className}}"""
def clic_cel(s, a, **k):
    x, y = s.ev(CEL, a); s.page.mouse.click(x, y, **k); s.page.wait_for_timeout(120)
def scrie(s, a, text, tasta="Enter"):
    clic_cel(s, a); s.page.keyboard.type(text); s.page.keyboard.press(tasta); s.page.wait_for_timeout(150)
def vezi(s, a): return s.ev(VEZI, a)
def ultimele_ev(s, n=3): return s.ev("n=>(window.__lhAplicatieEv||[]).slice(-n).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta,activat:e.activat}))", n)
def mesaj(s): return s.ev("()=>[...document.querySelectorAll('[data-lh-nesimulat]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim().slice(0,200))")
def deschide_cu(s, continut, app="excel", extra=None):
    s.page.goto(s.base + "/aplicatii/poligon.html")
    s.page.wait_for_function("()=>window.LH&&LH.aplicatii&&LH.aplicatii.deschide")
    opt = {"continut": continut, "focus": True}
    if extra: opt.update(extra)
    s.page.evaluate("([a,o])=>LH.aplicatii.deschide(a,Object.assign({loc:document.querySelector('[data-lh-aplicatie-loc]')},o))", [app, opt])
    s.page.wait_for_selector('[data-lh-aplicatie="%s"]' % app, timeout=15000); s.page.wait_for_timeout(700)
def clic_el(s, sel, **k):
    b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
    if not b: return False
    s.page.mouse.click(b[0], b[1], **k); s.page.wait_for_timeout(250); return True
def gol_mesaj(s): s.ev("()=>document.querySelectorAll('[data-lh-nesimulat]').forEach(e=>e.remove())")
