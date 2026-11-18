# -*- coding: utf-8 -*-
"""Ajutoarele criticului rece, runda 3: server static pe 127.0.0.1 (port liber), Chromium headless,
ruta care abandonează tot ce nu e 127.0.0.1/localhost (regula 24). Gesturi reale + CDP pentru tastatura care compune."""
import functools, http.server, json, threading
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

WT = r"C:/00/Projects/LearningHub_fidel"


def server():
    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=WT))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def doar_local(route):
    if urlparse(route.request.url).hostname in ("127.0.0.1", "localhost"):
        route.continue_()
    else:
        route.abort()


def context(b, latime=1366, inaltime=768, touch=False):
    ctx = b.new_context(viewport={"width": latime, "height": inaltime}, has_touch=touch, is_mobile=touch,
                        device_scale_factor=1)
    ctx.route("**/*", doar_local)
    return ctx


def pagina(ctx, port, url="aplicatii/poligon.html"):
    pg = ctx.new_page()
    pg.goto(f"http://127.0.0.1:{port}/{url}")
    pg.wait_for_function("window.LH && LH.aplicatii")
    return pg


def deschide(pg, paragrafe, de_la=None, pana_la=None, asistent=None, profil=None, extra=None):
    cont = {"paragrafe": paragrafe}
    if de_la is not None:
        cont["selectie"] = {"de_la": de_la, "pana_la": pana_la if pana_la is not None else de_la}
    if extra:
        cont.update(extra)
    pg.evaluate("""async ([c, a, p]) => {
        if (window.__asist && window.__asist.opreste) { try { window.__asist.opreste(); } catch (e) {} }
        window.__asist = null;
        const o = {continut: c, focus: true}; if (p) o.profil = p;
        await LH.aplicatii.deschide('word', o);
        if (window.__lhAplicatieEv) window.__lhAplicatieEv.length = 0;
        if (a) window.__asist = LH.aplicatii.asistent('word', a); }""", [cont, asistent, profil])
    pg.wait_for_timeout(250)


JS_OBS = """() => {
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const s = LH.aplicatii.stare('word');
  const a = document.activeElement;
  const tb = [...R.querySelectorAll('[data-lh-suprafata="bara_titlu"] [data-lh-tip="Button"]')].filter(b => / - /.test(b.textContent));
  const ev = (window.__lhAplicatieEv || []).map(e => [e.gest, e.actiune, e.tinta, e.activat || null].join('|'));
  const msg = [...R.querySelectorAll('[data-lh-nesimulat]')].map(m => m.textContent.trim());
  const dlg = [...R.querySelectorAll('[data-lh-suprafata^="dialog"]')].map(d => d.getAttribute('data-lh-suprafata'));
  const bs = !!R.querySelector('.lh-ap-strat-backstage');
  const ecran = [...R.querySelectorAll('[data-lh-zona] [data-lh-tinta="text"]')].map(p => p.innerText.replace(/\\n$/, ''));
  return {text: s.text, ecran, nume: s.nume_fisier, folder: s.folder_fisier, salvate: s.fisiere_salvate,
          dialog_salvare: s.dialog_salvare, titlu: tb.map(b => b.textContent.trim()),
          focus: a ? (a.tagName + ' ' + (a.className || '') + ' ' + (a.getAttribute('aria-label') || '')).trim() : null,
          ev, msg, dlg, backstage: bs, pas: window.__asist ? window.__asist.pas() : null,
          indicii: [...document.querySelectorAll('[data-lh-indiciu]')].map(x => x.getAttribute('data-lh-pentru')),
          fmt: s.formatare_pe_caractere};
}"""


def obs(pg):
    return pg.evaluate(JS_OBS)


def cdp_compune(pg, cdp, bucati, final=None):
    for b in bucati:
        cdp.send("Input.imeSetComposition", {"text": b, "selectionStart": len(b), "selectionEnd": len(b)})
        pg.wait_for_timeout(40)
    if final is not None:
        cdp.send("Input.insertText", {"text": final})
        pg.wait_for_timeout(40)


def centru(pg, sel):
    r = pg.evaluate("s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, b.width, b.height]; }", sel)
    return r


def salveaza(obj, cale):
    with open(cale, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
