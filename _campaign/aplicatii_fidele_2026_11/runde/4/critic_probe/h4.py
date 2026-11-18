# -*- coding: utf-8 -*-
"""Ajutoarele criticului rece, runda 4 (unghiul gest_tastatura): server static pe 127.0.0.1 (port liber), Chromium
headless, ruta care abandonează tot ce nu e 127.0.0.1/localhost (regula 24). Gesturi reale (keyboard/mouse/touchscreen)
+ CDP pentru tastatura care compune. Nimic pe ecranul omului, nimic spre servere vii."""
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


def deschide(pg, continut, asistent=None, profil=None):
    pg.evaluate("""async ([c, a, p]) => {
        if (window.__asist && window.__asist.opreste) { try { window.__asist.opreste(); } catch (e) {} }
        window.__asist = null;
        const o = {continut: c, focus: true}; if (p) o.profil = p;
        await LH.aplicatii.deschide('word', o);
        if (window.__lhAplicatieEv) window.__lhAplicatieEv.length = 0;
        if (a) window.__asist = LH.aplicatii.asistent('word', a); }""", [continut, asistent, profil])
    pg.wait_for_timeout(300)


JS_OBS = r"""() => {
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const s = LH.aplicatii.stare('word');
  const a = document.activeElement;
  const tx = a && a.closest ? a.closest('[data-lh-tinta]') : null;
  const ev = (window.__lhAplicatieEv || []).map(e => [e.gest, e.actiune, e.tinta, e.activat || ''].join('|'));
  const msg = [...R.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.textContent.trim());
  const dlg = [...R.querySelectorAll('.lh-ap-strat-dialog [data-lh-suprafata]')].map(d => d.getAttribute('data-lh-suprafata')).filter(x => /^dialog/.test(x));
  const lista = R.querySelector('.lh-ap-lista-ref');
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const ecran = [...R.querySelectorAll('[data-lh-zona] [data-lh-tinta="text"]')].filter(vis).map(p => p.innerText.replace(/\n$/, ''));
  const fsz = R.querySelector('[data-lh-id-mso="FontSize"] input');
  const tip = R.querySelector('[data-lh-tinta="camp:tip_fisier"] input');
  const nf = R.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
  const kt = [...R.querySelectorAll('.lh-ap-keytip')].filter(vis).map(k => k.textContent);
  const tb = R.querySelector('[data-lh-suprafata="bara_titlu"]');
  return {text: s.text, ecran, sel: s.selectie, nume: s.nume_fisier, folder: s.folder_fisier, salvate: s.fisiere_salvate,
          fisiere: (s.fisiere || []).map(f => f.folder + '/' + f.nume + ':' + JSON.stringify(f.text)),
          recente: (s.recente || []).map(f => f.nume), dialog: s.dialog, docs: s.documente_deschise,
          titlu: s.titlu_fereastra, bs: s.pagina_backstage, tip_afisat: s.tip_salvare_afisat, dialog_salvare: s.dialog_salvare,
          focus: a ? (a.tagName + (a.getAttribute('aria-label') ? '[' + a.getAttribute('aria-label') + ']' : '') + (tx ? ' @' + (tx.getAttribute('data-lh-tinta') + (tx.getAttribute('data-lh-id') ? ':' + tx.getAttribute('data-lh-id') : '')) : '') + (a.hasAttribute && a.hasAttribute('data-lh-intrare-document') ? ' (DOC)' : '') + (R.contains(a) ? '' : ' (IN AFARA aplicatiei)')) : null,
          ev, msg, dlg, lista: lista ? {rol: lista.getAttribute('role'), randuri: [...lista.querySelectorAll('[data-lh-tip="ListItem"]')].length, ales: (lista.querySelector('.lh-ap-ales') || {}).textContent || null} : null,
          font_box: fsz ? fsz.value : null, tip_box: tip && vis(tip) ? tip.value : null, nume_box: nf && vis(nf) ? nf.value : null,
          keytips: kt, pas: window.__asist ? window.__asist.pas() : null,
          indicii: [...document.querySelectorAll('[data-lh-indiciu]')].map(x => x.getAttribute('data-lh-pentru')),
          fmt: (s.formatare_pe_caractere || []).map(b => b.text + '@' + b.marime + (b.bold ? 'B' : ''))};
}"""


def obs(pg):
    return pg.evaluate(JS_OBS)


def evs(pg):
    return pg.evaluate("() => (window.__lhAplicatieEv || []).map(e => [e.gest, e.actiune, e.tinta, e.activat || ''].join('|'))")


def golev(pg):
    pg.evaluate("() => { if (window.__lhAplicatieEv) window.__lhAplicatieEv.length = 0; }")


def cdp_compune(pg, cdp, bucati, final=None):
    for b in bucati:
        cdp.send("Input.imeSetComposition", {"text": b, "selectionStart": len(b), "selectionEnd": len(b)})
        pg.wait_for_timeout(40)
    if final is not None:
        cdp.send("Input.insertText", {"text": final})
        pg.wait_for_timeout(40)


def centru(pg, sel):
    return pg.evaluate("s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, b.width, b.height]; }", sel)


def clic(pg, sel, dx=0.5, dy=0.5):
    r = pg.evaluate("s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", sel)
    if not r:
        return False
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy)
    pg.wait_for_timeout(150)
    return True


def salveaza(obj, cale):
    with open(cale, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)


def rect(pg, tinta):
    return pg.evaluate("t => { const e = LH.aplicatii.element('word', t); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", tinta)


def ct(pg, tinta, dx=0.5, dy=0.5):
    r = rect(pg, tinta)
    if not r:
        return 'LIPSA ' + tinta
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy)
    pg.wait_for_timeout(200)
    return r


def tap(pg, tinta):
    r = rect(pg, tinta)
    if not r:
        return 'LIPSA ' + tinta
    pg.touchscreen.tap(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(250)
    return r


JS_EV = "() => (window.__lhAplicatieEv || []).map(e => [e.ts % 100000, e.gest, e.actiune, e.tinta, e.activat || ''].join('|'))"


def evt(pg):
    return pg.evaluate(JS_EV)
