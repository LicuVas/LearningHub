# -*- coding: utf-8 -*-
"""Hamul (copie din runde/12/h.py): server static pe 127.0.0.1 (port liber), Chromium headless, tot ce nu e 127.0.0.1/localhost abandonat.
Folosire: from h import Ham; with Ham() as H: pg = H.ppt(continut) ..."""
import functools, http.server, json, threading, os
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

WT = Path('C:/00/Projects/LearningHub_fidel')
AICI = Path(__file__).resolve().parent


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Ham:
    def __init__(self, radacina=WT, viewport=(1366, 768), scale=1, mobil=False):
        self.radacina, self.viewport, self.scale, self.mobil = radacina, viewport, scale, mobil
        self.plecate, self.erori = [], []

    def __enter__(self):
        self.srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Tacut, directory=str(self.radacina)))
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        self.baza = 'http://127.0.0.1:%d' % self.srv.server_address[1]
        self.p = sync_playwright().start()
        self.br = self.p.chromium.launch(headless=True)
        kw = dict(viewport={'width': self.viewport[0], 'height': self.viewport[1]}, device_scale_factor=self.scale)
        if self.mobil:
            kw.update(is_mobile=True, has_touch=True)
        self.ctx = self.br.new_context(**kw)

        def ruta(r):
            if urlsplit(r.request.url).hostname not in ('127.0.0.1', 'localhost'):
                self.plecate.append(r.request.url)
                return r.abort()
            return r.continue_()
        self.ctx.route('**/*', ruta)
        return self

    def __exit__(self, *a):
        try:
            self.br.close()
            self.p.stop()
        finally:
            self.srv.shutdown()

    def pagina(self, url):
        pg = self.ctx.new_page()
        pg.on('pageerror', lambda e: self.erori.append(str(e)[:300]))
        pg.goto(self.baza + url, wait_until='load')
        return pg

    def app(self, aplicatie='powerpoint', continut=None, url='/aplicatii/poligon.html'):
        pg = self.pagina(url)
        pg.wait_for_function('window.LH && LH.aplicatii && LH.aplicatii.gata')
        pg.evaluate("([a,c])=>LH.aplicatii.deschide(a,{continut:c,focus:true}).then(()=>{window.__m=(window.__lhAplicatieEv||[]).length})",
                    [aplicatie, continut])
        pg.wait_for_timeout(300)
        return pg


def st(pg, app='powerpoint'):
    return pg.evaluate("a=>LH.aplicatii.stare(a)", app)


def ev(pg):
    return pg.evaluate("""(()=>{const E=window.__lhAplicatieEv||[];const o=E.slice(window.__m||0).map(e=>({g:e.gest,a:e.actiune,t:e.tinta,act:e.activat,
      dif:JSON.stringify(e.inainte)!==JSON.stringify(e.dupa)}));window.__m=E.length;return o})()""")


def el(pg, t, app='powerpoint'):
    h = pg.evaluate_handle("([a,t])=>LH.aplicatii.element(a,t)", [app, t])
    return h.as_element()


def centru(pg, t, app='powerpoint'):
    return pg.evaluate("""([a,t])=>{const e=LH.aplicatii.element(a,t);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]}""", [app, t])


def clic(pg, t, app='powerpoint', button='left', dx=0.5, dy=0.5):
    r = pg.evaluate("""([a,t])=>{const e=LH.aplicatii.element(a,t);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}""", [app, t])
    if not r:
        return False
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy, button=button)
    pg.wait_for_timeout(60)
    return True


def nesimulat(pg):
    return pg.evaluate("(()=>{const m=[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].filter(x=>x.offsetParent);return m.map(x=>x.getAttribute('data-lh-nesimulat')+' | '+x.textContent.slice(0,120))})()")


def scrie(rez, fisier):
    with open(AICI / fisier, 'w', encoding='utf-8') as f:
        json.dump(rez, f, ensure_ascii=False, indent=1)
