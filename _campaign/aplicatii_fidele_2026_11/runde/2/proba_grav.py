# -*- coding: utf-8 -*-
r"""Proba celor 6 GRAV din runde/1/critic.md, pe poligon (runda 2, constructorul).

Server static pe worktree, legat de 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e
127.0.0.1/localhost (regula 24). Gesturi reale: page.keyboard / page.mouse; telefonul = CDP Input.imeSetComposition +
Input.insertText (ca la critic). Citește stare(), ecranul și window.__lhAplicatieEv.
    python .../runde/2/proba_grav.py [--iesire <fisier.json>]
Ultima linie = numărul de cazuri picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import os
import functools
import http.server
import json
import sys
import threading
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

WT = os.environ.get("LH_WT") or r"C:/00/Projects/LearningHub_fidel"   # LH_WT = o copie (probe în timpul măsurării)
PAUZA = 60


def server():
    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass
    h = functools.partial(Tacut, directory=WT)
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def doar_local(route):
    if urlparse(route.request.url).hostname in ("127.0.0.1", "localhost"):
        route.continue_()
    else:
        route.abort()


def deschide(pg, paragrafe, de_la=None, pana_la=None, asistent=None):
    cont = {"paragrafe": paragrafe}
    if de_la is not None:
        cont["selectie"] = {"de_la": de_la, "pana_la": pana_la if pana_la is not None else de_la}
    pg.evaluate("""async ([c, a]) => { window.__lhAplicatieEv && (window.__lhAplicatieEv.length = 0);
        document.querySelectorAll('[data-lh-indiciu]').forEach(x => x.remove());
        await LH.aplicatii.deschide('word', {continut: c, focus: true});
        if (a) window.__asist = LH.aplicatii.asistent('word', a); }""", [cont, asistent])
    pg.wait_for_timeout(250)


def stare(pg):
    return pg.evaluate("LH.aplicatii.stare('word')")


def ev(pg):
    return pg.evaluate("(window.__lhAplicatieEv || []).map(e => ({gest: e.gest, actiune: e.actiune, tinta: e.tinta}))")


def taste(pg, *k):
    for x in k:
        pg.keyboard.press(x)
        pg.wait_for_timeout(PAUZA)
    pg.wait_for_timeout(150)


def scrie(pg, t):
    pg.keyboard.type(t, delay=20)
    pg.wait_for_timeout(150)


def vizibil(pg, sel):
    return pg.evaluate("s => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect();"
                       " return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }", sel)


def activ(pg):
    return pg.evaluate("(() => { const a = document.activeElement; return a ? (a.tagName + '|' + (a.getAttribute('aria-label') || '')"
                       " + '|' + (a.hasAttribute('data-lh-intrare-document') ? 'document' : '')) : null; })()")


def marime_la(st, bucata):
    for b in st.get("formatare_pe_caractere") or []:
        if b.get("text") == bucata:
            return b.get("marime")
    return None


def caz(rez, nume, ok, **detalii):
    rez.append(dict(caz=nume, ok=bool(ok), **detalii))


def ruleaza():
    rez = []
    s = server()
    port = s.server_address[1]
    with sync_playwright() as p:
        br = p.chromium.launch(headless=True)
        ctx = br.new_context(viewport={"width": 1366, "height": 768})
        ctx.route("**/*", doar_local)
        pg = ctx.new_page()
        pg.goto("http://127.0.0.1:%d/aplicatii/poligon.html" % port)
        pg.wait_for_function("window.LH && LH.aplicatii")
        cdp = ctx.new_cdp_session(pg)

        # ---- GRAV 1: tastatura care compune (Gboard/Samsung): compunere a, an, ana → insertText ana → insertText " "
        deschide(pg, [""], 0)
        for cuv, sep in (("ana", " "), ("are", " "), ("mere", None)):
            for i in range(1, len(cuv) + 1):
                cdp.send("Input.imeSetComposition", {"text": cuv[:i], "selectionStart": i, "selectionEnd": i})
                pg.wait_for_timeout(30)
            cdp.send("Input.insertText", {"text": cuv})
            pg.wait_for_timeout(30)
            if sep:
                cdp.send("Input.insertText", {"text": sep})
                pg.wait_for_timeout(30)
        pg.wait_for_timeout(200)
        st = stare(pg)
        ecran = pg.evaluate("[...document.querySelectorAll('[data-lh-zona] [data-lh-tinta=\"text\"]')].map(e => e.textContent)")
        caz(rez, "G1 compunere telefon: ana are mere", st["text"] == ["Ana are mere"] and ecran[:1] == ["Ana are mere"],
            text=st["text"], ecran=ecran, tastari=sum(1 for e in ev(pg) if e["gest"] == "tastare"))

        # ---- GRAV 6: telefon fără compunere, bucăți insertText → majuscula automată ca în Word
        deschide(pg, [""], 0)
        for b in ("ana", " ", "are", " ", "mere.", " ", "el", " "):
            cdp.send("Input.insertText", {"text": b})
            pg.wait_for_timeout(30)
        pg.wait_for_timeout(150)
        st = stare(pg)
        caz(rez, "G6 telefon insertText: majuscula automata", st["text"] == ["Ana are mere. El "], text=st["text"])
        deschide(pg, [""], 0)
        scrie(pg, "ana are mere. el are pere.")
        st = stare(pg)
        caz(rez, "G6b tastatura fizica (regres)", st["text"] == ["Ana are mere. El are pere."], text=st["text"])

        # ---- GRAV 2a: Alt, F, A → pagina Save As, documentul neatins
        deschide(pg, ["Ana are mere"], 12)
        taste(pg, "Alt", "f", "a")
        st = stare(pg)
        sa = vizibil(pg, '[data-lh-suprafata="backstage.Save As"]')
        caz(rez, "G2a Alt,F,A: Save As, text neatins", st["text"] == ["Ana are mere"] and sa, text=st["text"], pagina_save_as=sa)
        # Alt, F, A, O → Browse → fereastra Save As (referința: Browse = "Alt, F, A, O")
        taste(pg, "o")
        fa = vizibil(pg, '[data-lh-suprafata="dialog.FileSaveAs"]')
        caz(rez, "G2a' Alt,F,A,O: fereastra Save As", fa and stare(pg)["text"] == ["Ana are mere"], fereastra=fa)

        # ---- GRAV 2b: clic pe File, apoi xyz + Backspace, Esc
        deschide(pg, ["Ana are mere"], 12)
        pg.click('[data-lh-tinta="fila:File"]')
        pg.wait_for_timeout(150)
        scrie(pg, "xyz")
        taste(pg, "Backspace")
        t1 = stare(pg)["text"]
        taste(pg, "Escape")
        t2 = stare(pg)["text"]
        bs = vizibil(pg, '[data-lh-suprafata="backstage.nav"]')
        scrie(pg, "z")
        t3 = stare(pg)["text"]
        caz(rez, "G2b File + tastare: text neatins; Esc inchide; apoi tastarea merge", t1 == ["Ana are mere"] and t2 == ["Ana are mere"]
            and not bs and t3 == ["Ana are merez"], cu_backstage=t1, dupa_esc=t2, backstage_deschis=bs, dupa_z=t3)

        # ---- GRAV 2c: Ctrl+D (Font), qw + Backspace → documentul neatins; Esc → înapoi în document
        deschide(pg, ["Ana are mere"], 12)
        taste(pg, "Control+d")
        fd = vizibil(pg, '[data-lh-suprafata="dialog.FontDialog"]')
        scrie(pg, "qw")
        taste(pg, "Backspace")
        t1 = stare(pg)["text"]
        taste(pg, "Escape")
        scrie(pg, "z")
        t2 = stare(pg)["text"]
        caz(rez, "G2c Ctrl+D + tastare: text neatins", fd and t1 == ["Ana are mere"] and t2 == ["Ana are merez"],
            fereastra_font=fd, cu_fereastra=t1, dupa_esc_z=t2, focus=activ(pg))

        # ---- GRAV 3a: selectez „are”, clic în Font Size, Ctrl+A, 14, Enter
        deschide(pg, ["Ana are mere"], 4, 7)
        pg.click('[data-lh-id-mso="FontSize"] input')
        pg.wait_for_timeout(100)
        taste(pg, "Control+a")
        scrie(pg, "14")
        taste(pg, "Enter")
        st = stare(pg)
        mesaj = pg.evaluate("[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(e => e.textContent)")
        caz(rez, "G3a Font Size tastat 14 + Enter", marime_la(st, "are") == 14 and st["text"] == ["Ana are mere"] and not mesaj
            and (activ(pg) or "").endswith("document"), marime=marime_la(st, "are"), text=st["text"], mesaj=mesaj, focus=activ(pg))

        # ---- GRAV 3b: Alt, H, F, S → focusul în casetă; 20 + Enter
        deschide(pg, ["Ana are mere"], 4, 7)
        taste(pg, "Alt", "h", "f", "s")
        f1 = activ(pg)
        scrie(pg, "20")
        taste(pg, "Enter")
        st = stare(pg)
        caz(rez, "G3b Alt,H,F,S + 20 + Enter", (f1 or "").startswith("INPUT|Font Size") and marime_la(st, "are") == 20
            and st["text"] == ["Ana are mere"], focus_dupa_FS=f1, marime=marime_la(st, "are"), text=st["text"],
            formatare=st.get("formatare_pe_caractere"))

        # ---- GRAV 4: Ctrl+S pe document nou → „Save this file”, nume, Enter
        deschide(pg, ["Poezie"], 6)
        taste(pg, "Control+s")
        st = stare(pg)
        ds = st.get("dialog_salvare") or {}
        mesaj = pg.evaluate("[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(e => e.textContent)")
        scrie(pg, "Marin_Ioana_7B_poezie")
        taste(pg, "Enter")
        st2 = stare(pg)
        taste(pg, "Control+s")
        e_last = ev(pg)[-1]
        caz(rez, "G4 Ctrl+S document nou: Save this file", ds.get("titlu") == "Save this file" and not mesaj
            and st2["nume_fisier"] == "Marin_Ioana_7B_poezie.docx" and e_last["actiune"] == "salvare",
            dialog=ds, mesaj=mesaj, fisier=st2["nume_fisier"], ctrl_s_a_doua=e_last)

        # ---- GRAV 5: Alt, H, 1 + un clic greșit → fără dublu_clic, fără indiciu (dupaGreseli 2)
        deschide(pg, ["Ana are mere"], 4, 7, {"pasi": [{"tinta": "mso:Bold"}, {"tinta": "mso:Italic"}], "dupaGreseli": 2})
        taste(pg, "Alt", "h", "1")
        z = pg.evaluate("(() => { const r = document.querySelector('[data-lh-zona]').getBoundingClientRect();"
                        " return [r.left + r.width / 2, r.top + r.height - 40]; })()")
        pg.mouse.click(z[0], z[1])
        pg.wait_for_timeout(300)
        e = ev(pg)
        bula = pg.evaluate("[...document.querySelectorAll('[data-lh-indiciu]')].map(b => b.getAttribute('data-lh-pentru'))")
        bold = marime_la(stare(pg), "are")
        fmt = [b for b in stare(pg)["formatare_pe_caractere"] if b["text"] == "are"]
        caz(rez, "G5 Alt,H,1 + un clic: fara dublu_clic, fara indiciu", not any(x["gest"] == "dublu_clic" for x in e)
            and not bula and fmt and fmt[0]["bold"] and any(x["gest"] == "tasta_acces" for x in e),
            evenimente=e, indiciu=bula, aldin=bool(fmt and fmt[0]["bold"]))
        deschide(pg, ["Ana are mere"], 4, 7)
        taste(pg, "Alt", "h", "a", "c")
        e = ev(pg)
        caz(rez, "G5b Alt,H,A,C: centru, fara dublu_clic", not any(x["gest"] == "dublu_clic" for x in e)
            and stare(pg)["aliniere_paragrafe"][:1] == ["centru"], evenimente=e, aliniere=stare(pg)["aliniere_paragrafe"])
        br.close()
    s.shutdown()
    return rez


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire")
    a = ap.parse_args()
    rez = ruleaza()
    if a.iesire:
        with open(a.iesire, "w", encoding="utf-8") as f:
            json.dump(rez, f, ensure_ascii=False, indent=1)
    for r in rez:
        print(("OK   " if r["ok"] else "PICA ") + r["caz"])
    n = sum(1 for r in rez if not r["ok"])
    print(n)
    sys.exit(0 if n == 0 else 1)


if __name__ == "__main__":
    main()
