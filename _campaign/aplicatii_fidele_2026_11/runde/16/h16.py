# -*- coding: utf-8 -*-
"""Ajutoarele rundei 16 (Word, constructorul): server static pe 127.0.0.1, port liber; Chromium headless; ruta abandonează
tot ce nu e 127.0.0.1/localhost (regula 24). Gesturi reale (page.keyboard / page.mouse). Nimic pe ecranul omului.
Aceeași formă ca runde/4/critic_probe/h4.py și runde/5/critic_probe/h5.py (copiate aici, ca să nu scriu __pycache__ în
dosarele altor runde)."""
import functools
import http.server
import json
import threading
from urllib.parse import urlparse

WT = r"C:/00/Projects/LearningHub_fidel"


def server(radacina=WT):
    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass

        def end_headers(self):
            self.send_header("Cache-Control", "no-store")
            super().end_headers()
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=radacina))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def doar_local(route):
    if urlparse(route.request.url).hostname in ("127.0.0.1", "localhost"):
        route.continue_()
    else:
        route.abort()


def context(b, latime=1366, inaltime=768):
    ctx = b.new_context(viewport={"width": latime, "height": inaltime}, device_scale_factor=1)
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


VIZ = "const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };"

JS_OBS = r"""() => { %s
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const s = LH.aplicatii.stare('word');
  const msg = [...R.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.textContent.trim());
  const dlg = [...R.querySelectorAll('.lh-ap-strat-dialog [data-lh-suprafata]')].map(d => d.getAttribute('data-lh-suprafata')).filter(x => /^dialog/.test(x));
  const nf = [...R.querySelectorAll('[data-lh-tinta="camp:nume_fisier"] input')].find(vis);
  const fsz = R.querySelector('[data-lh-id-mso="FontSize"] input');
  return {text: s.text, nume: s.nume_fisier, folder: s.folder_fisier, salvate: s.fisiere_salvate,
          fisiere: (s.fisiere || []).map(f => f.folder + '/' + f.nume + ':' + JSON.stringify(f.text)),
          docs: s.documente_deschise, titlu: s.titlu_fereastra, bs: s.pagina_backstage, dialog_salvare: s.dialog_salvare,
          msg, dlg, nume_box: nf ? nf.value : null, font_box: fsz ? fsz.value : null,
          pas: window.__asist ? window.__asist.pas() : null,
          indicii: [...document.querySelectorAll('[data-lh-indiciu]')].filter(vis).map(x => x.getAttribute('data-lh-pentru')),
          fmt: (s.formatare_pe_caractere || []).map(b => b.text + '@' + b.marime + (b.bold ? 'B' : ''))};
}""" % VIZ

JS_DLG = r"""() => { %s
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const d = R.querySelector('.lh-ap-strat-dialog [data-lh-suprafata^="dialog"]');
  if (!d) return null;
  const adrEl = d.querySelector('[data-lh-eticheta^="Adres"]');
  const adr_eticheta = adrEl ? adrEl.getAttribute('data-lh-eticheta') : null;
  const adr_ecran = adrEl ? [...adrEl.querySelectorAll('[data-lh-tip="SplitButton"]')].filter(vis).map(y => y.innerText.trim()).filter(Boolean) : [];
  const nav_ales = [...d.querySelectorAll('.lh-ap-nav-rand')].filter(x => vis(x) && x.hasAttribute('data-lh-selectat')).map(x => x.innerText.trim());
  const lista = [...d.querySelectorAll('[data-lh-tip="List"][data-lh-eticheta="Vizualizare elemente"] [data-lh-tip="ListItem"]')].filter(vis)
     .map(x => ({text: x.innerText.trim(), tinta: x.getAttribute('data-lh-tinta') || '', ales: x.hasAttribute('data-lh-selectat')}));
  const nf = d.querySelector('[data-lh-tinta="camp:nume_fisier"] input');
  return {sup: d.getAttribute('data-lh-suprafata'), adr_eticheta, adr_ecran, nav_ales, lista, nume_box: nf ? nf.value : null};
}""" % VIZ


def obs(pg):
    return pg.evaluate(JS_OBS)


def dlg(pg):
    return pg.evaluate(JS_DLG)


def evs(pg):
    return pg.evaluate("() => (window.__lhAplicatieEv || []).map(e => [e.gest, e.actiune, e.tinta, e.activat || ''].join('|'))")


def golev(pg):
    pg.evaluate("() => { if (window.__lhAplicatieEv) window.__lhAplicatieEv.length = 0; }")


def rect(pg, tinta):
    return pg.evaluate("t => { const e = LH.aplicatii.element('word', t); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", tinta)


def ct(pg, tinta, dx=0.5, dy=0.5):
    r = rect(pg, tinta)
    if not r:
        return None
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy)
    pg.wait_for_timeout(200)
    return r


def dublu(pg, tinta):
    r = rect(pg, tinta)
    if not r:
        return None
    pg.mouse.dblclick(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(300)
    return r


def clic_sel(pg, sel, dx=0.5, dy=0.5):
    r = pg.evaluate("s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", sel)
    if not r:
        return None
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy)
    pg.wait_for_timeout(200)
    return r


def tasta(pg, k, n=1, asteapta=150):
    for _ in range(n):
        pg.keyboard.press(k)
        pg.wait_for_timeout(40)
    pg.wait_for_timeout(asteapta)


def scrie(pg, text):
    pg.keyboard.type(text)
    pg.wait_for_timeout(150)


def tinte(pg):
    return pg.evaluate("() => LH.aplicatii.tinte('word')")


def salveaza(obj, cale):
    with open(cale, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1, default=str)


ORAR = ['Orarul meu', 'Luni: română, matematică, TIC']
ORAR_ANA = {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar', 'text': ORAR}
CLUB = ['Clubul de lectură – fișa de înscriere', 'Ne întâlnim joi, după ore, în biblioteca școlii.', 'Numele meu:']
FIS3 = [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA, {'folder': 'Desktop', 'nume': 'tema', 'text': ['Tema']}]
