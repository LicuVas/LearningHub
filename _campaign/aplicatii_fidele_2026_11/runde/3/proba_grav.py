# -*- coding: utf-8 -*-
r"""Proba celor 5 GRAV deschise din runde/2/critic.md (N1, N2, GRAV 3, N3, N4), pe poligon — runda 3, constructorul.

Server static pe worktree, legat de 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e
127.0.0.1/localhost (regula 24). Gesturi reale: page.keyboard / page.mouse / page.touchscreen; tastatura care compune
(telefon) = CDP Input.imeSetComposition + Input.insertText (ca la critic). Citește stare(), ecranul, focusul,
mesajele [data-lh-nesimulat] și window.__lhAplicatieEv.
    python .../runde/3/proba_grav.py [--iesire <fisier.json>]
Ultima linie = numărul de cazuri picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import functools
import http.server
import json
import os
import sys
import threading
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

WT = os.environ.get("LH_WT") or r"C:/00/Projects/LearningHub_fidel"
PAUZA = 60
NUME = "Marin_Ioana_7B_poezie"


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


def deschide(pg, paragrafe, de_la=None, pana_la=None, asistent=None):
    cont = {"paragrafe": paragrafe}
    if de_la is not None:
        cont["selectie"] = {"de_la": de_la, "pana_la": pana_la if pana_la is not None else de_la}
    pg.evaluate("""async ([c, a]) => { window.__lhAplicatieEv && (window.__lhAplicatieEv.length = 0);
        document.querySelectorAll('[data-lh-indiciu]').forEach(x => x.remove());
        if (window.__asist && window.__asist.opreste) { try { window.__asist.opreste(); } catch (e) {} }
        window.__asist = null; window.__laClic = null;
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
    pg.wait_for_timeout(100)


def scrie(pg, t):
    pg.keyboard.type(t, delay=15)
    pg.wait_for_timeout(100)


def titlu(pg):
    return pg.evaluate("""[...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-tinta^="bara_titlu:"][data-lh-tip="Button"]')]
        .map(b => (b.querySelector('.lh-ap-text') || b).textContent.replace(/\\s+/g, ' ').trim()).filter(t => / - /.test(t))""")


def mesaje(pg):
    return pg.evaluate("[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.textContent)")


def centru(pg, sel_js):
    return pg.evaluate("""s => { const e = (%s); if (!e) return null; e.scrollIntoView({block: 'nearest', inline: 'nearest'});
        const r = e.getBoundingClientRect(); return r.width > 0 ? [r.x + r.width / 2, r.y + r.height / 2] : null; }""" % sel_js, None)


def clic_pe(pg, sel_js):
    c = centru(pg, sel_js)
    if not c:
        return False
    pg.mouse.click(c[0], c[1])
    pg.wait_for_timeout(150)
    return True


def element_tinta(t):
    return "LH.aplicatii.element('word', %s)" % json.dumps(t)


def marime_la(st, bucata):
    for b in st.get("formatare_pe_caractere") or []:
        if b.get("text") == bucata:
            return b.get("marime")
    return None


def caz(rez, cheie_caz, ok, **detalii):
    rez.append(dict(caz=cheie_caz, ok=bool(ok), **detalii))
    print(("OK   " if ok else "PICA ") + cheie_caz, flush=True)


SAGEATA_FONT_SIZE = ("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-id-mso=\"FontSize\"] [data-lh-tip=\"Button\"]')]"
                     ".find(b => b.getBoundingClientRect().width > 0)")
CASETA_FONT_SIZE = "document.querySelector('[data-lh-aplicatie=\"word\"] [data-lh-id-mso=\"FontSize\"] input')"
SAGEATA_TIP = ("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-tip=\"ComboBox\"]')]"
               ".filter(c => /^Save as type/.test(c.getAttribute('data-lh-eticheta') || ''))"
               ".map(c => c.querySelector('[data-lh-tip=\"Button\"]')).find(b => b && b.getBoundingClientRect().width > 0)")


def cazuri_birou(pg, rez):
    poezie = ["Poezia mea", "Toamna vine."]
    # ---------------- N1: bara de titlu imediat după salvare, pe cele 4 drumuri
    for cheie, pornire, gata in (("n1_f12_enter", "F12", "enter"), ("n1_f12_clic", "F12", "clic"),
                                 ("n1_ctrls_enter", "Control+s", "enter"), ("n1_ctrls_clic", "Control+s", "clic")):
        deschide(pg, poezie, 0)
        taste(pg, pornire)
        taste(pg, "Control+a")
        scrie(pg, NUME)
        if gata == "enter":
            pg.keyboard.press("Enter")
        else:
            clic_pe(pg, element_tinta("dialog_salvare:Save"))
        pg.wait_for_timeout(80)
        t = titlu(pg)
        st = stare(pg)
        caz(rez, cheie, st.get("nume_fisier") == NUME + ".docx" and any(NUME in x for x in t) and not any("Document1" in x for x in t),
            titlu=t, nume=st.get("nume_fisier"))

    # ---------------- N2: Enter în File name = salvare (eveniment + asistent)
    asist = {"pasi": [{"tinta": "dialog_salvare:Save", "indiciu": "Apasă Save"}, {"tinta": "mso:Bold", "indiciu": "Apasă B"}],
             "dupaGreseli": 2, "dupaSecunde": 600}
    for cheie, pornire in (("n2_f12_enter", "F12"), ("n2_ctrls_enter", "Control+s")):
        deschide(pg, ["Orar", "Luni: romana"], 0, asistent=asist)
        taste(pg, pornire)
        taste(pg, "Control+a")
        scrie(pg, "Popescu_Ana_7A_orar")
        taste(pg, "Enter")
        e = ev(pg)
        ent = [x for x in e if x["gest"] == "tasta_enter"]
        pas = pg.evaluate("window.__asist ? window.__asist.pas() : null")
        bula = pg.evaluate("document.querySelectorAll('[data-lh-indiciu][data-lh-pentru=\"dialog_salvare:Save\"]').length")
        st = stare(pg)
        caz(rez, cheie, st.get("nume_fisier") == "Popescu_Ana_7A_orar.docx" and ent and ent[-1]["actiune"] == "salvare" and pas == 1 and bula == 0,
            enter=ent[-1:] if ent else None, pas=pas, bula=bula, nume=st.get("nume_fisier"))

    # ---------------- GRAV 3: săgeata ▾ a casetei Font Size nu tace; tastarea rămâne bună
    deschide(pg, ["Ana are mere"], 4, 7)
    m0 = len(mesaje(pg))
    clic_pe(pg, SAGEATA_FONT_SIZE)
    lista = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [role=menu] [data-lh-tinta^=\"meniu:\"]')].filter(x => x.getBoundingClientRect().width > 0).length")
    ms = mesaje(pg)
    caz(rez, "g3b_sageata_font_size", lista > 0 or any("Font Size" in m for m in ms), lista=lista, mesaje=ms, ev=ev(pg)[-1:])
    deschide(pg, ["Ana are mere"], 4, 7)
    clic_pe(pg, CASETA_FONT_SIZE)
    taste(pg, "Alt+ArrowDown")
    lista = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [role=menu] [data-lh-tinta^=\"meniu:\"]')].filter(x => x.getBoundingClientRect().width > 0).length")
    ms = mesaje(pg)
    caz(rez, "g3f_alt_jos_font_size", lista > 0 or any("Font Size" in m for m in ms), lista=lista, mesaje=ms)
    deschide(pg, ["Ana are mere"], 4, 7)
    clic_pe(pg, CASETA_FONT_SIZE)
    taste(pg, "Control+a")
    scrie(pg, "14")
    taste(pg, "Enter")
    st = stare(pg)
    caz(rez, "g3a_tastat_14_regres", marime_la(st, "are") == 14 and st["text"] == ["Ana are mere"], text=st["text"], marime=marime_la(st, "are"))

    # ---------------- N4: drumurile lecției m1-l03 (fișiere)
    deschide(pg, ["Orar", "Miercuri: desen"], 0)
    taste(pg, "Control+w")
    caz(rez, "n4_ctrl_w", not mesaje(pg), mesaje=mesaje(pg), ev=ev(pg)[-1:])
    deschide(pg, ["Orar"], 0)
    clic_pe(pg, element_tinta("bara_titlu:Close"))
    caz(rez, "n4_inchidere_x", not mesaje(pg), mesaje=mesaje(pg), ev=ev(pg)[-1:])
    deschide(pg, ["Orar"], 0)
    taste(pg, "Control+o")
    deschis = pg.evaluate("(() => { const s = document.querySelector('[data-lh-aplicatie=\"word\"] [data-lh-suprafata=\"backstage.Open\"]');"
                          " return !!(s && s.getBoundingClientRect().width > 0); })()")
    caz(rez, "n4_ctrl_o", deschis and not mesaje(pg), pagina_open=deschis, mesaje=mesaje(pg), ev=ev(pg)[-1:])
    deschide(pg, ["Orar"], 0)
    taste(pg, "F12")
    taste(pg, "Control+a")
    scrie(pg, "Popescu_Ana_7A_orar")
    taste(pg, "Enter")
    st = stare(pg)
    caz(rez, "n4_folder_in_stare", any(isinstance(v, str) and v in ("Documente", "Documents") for k, v in st.items() if "folder" in k),
        chei=sorted(st.keys()), nume=st.get("nume_fisier"))
    deschide(pg, ["Orar", "Marti: sport"], 0)
    taste(pg, "F12")
    taste(pg, "Control+a")
    scrie(pg, "Popescu_Ana_7A_orar")
    ok_s = clic_pe(pg, SAGEATA_TIP)
    ok_r = clic_pe(pg, element_tinta("meniu:PDF (*.pdf)"))
    ms = mesaje(pg)
    clic_pe(pg, element_tinta("dialog_salvare:Save"))
    st = stare(pg)
    blob = json.dumps(st, ensure_ascii=False)
    caz(rez, "n4_tip_pdf", ok_s and ok_r and "Popescu_Ana_7A_orar.pdf" in blob, sageata=ok_s, rand_pdf=ok_r, mesaje=ms,
        nume=st.get("nume_fisier"), salvari=st.get("fisiere_salvate"))


def cazuri_telefon(pg, cdp, rez):
    def compune(*bucati):
        for b in bucati:
            cdp.send("Input.imeSetComposition", {"text": b, "selectionStart": len(b), "selectionEnd": len(b)})
            pg.wait_for_timeout(40)

    def insert(t):
        cdp.send("Input.insertText", {"text": t})
        pg.wait_for_timeout(60)

    pg.evaluate("""() => { if (!document.getElementById('verif3')) { const b = document.createElement('button'); b.id = 'verif3';
        b.textContent = 'Verifică'; b.style.cssText = 'position:fixed;right:8px;bottom:8px;width:120px;height:48px;z-index:99999';
        b.addEventListener('click', () => { window.__laClic = LH.aplicatii.stare('word').text; }); document.body.appendChild(b); } }""")
    # GRAV 1 (regres): fără dublare
    deschide(pg, [""], 0)
    compune("a", "an", "ana")
    insert("ana")
    insert(" ")
    compune("a", "ar", "are")
    insert("are")
    pg.wait_for_timeout(150)
    st = stare(pg)
    caz(rez, "g1a_fara_dublare_regres", st["text"] == ["Ana are"], text=st["text"])
    # N3 (a): cuvântul în compunere, apoi atingere pe „Verifică” din afara aplicației
    deschide(pg, ["Numele: "], 8)
    compune("I", "Io", "Ion")
    c = centru(pg, "document.getElementById('verif3')")
    pg.touchscreen.tap(c[0], c[1])
    pg.wait_for_timeout(400)
    la = pg.evaluate("window.__laClic")
    st = stare(pg)
    caz(rez, "n3a_verifica_vede_cuvantul", la == ["Numele: Ion"] and st["text"] == ["Numele: Ion"], la_clic=la, dupa=st["text"])
    # N3 (b): cuvântul în compunere la capătul rândului 1, atingere în rândul 2, apoi spațiul
    for cheie, cu in (("n3b_atingere_alt_rand", "tap"), ("n3b_clic_alt_rand", "clic")):
        deschide(pg, ["Ana are ", "Doi"], 8)
        compune("m", "me", "mer", "mere")
        c = centru(pg, element_tinta("text:2"))
        if cu == "tap":
            pg.touchscreen.tap(c[0], c[1])
        else:
            pg.mouse.click(c[0], c[1])
        pg.wait_for_timeout(200)
        insert(" ")
        pg.wait_for_timeout(200)
        st = stare(pg)
        t = st["text"]
        # cuvântul rămâne la capătul rândului 1, iar atingerea a mutat cursorul în rândul 2 (spațiul ajunge acolo)
        caz(rez, cheie, len(t) == 2 and t[0] == "Ana are mere" and "mere" not in t[1] and t[1].replace(" ", "") == "Doi" and " " in t[1],
            text=t)
    # N3 (c): atingere pe panglică (Bold) cât compune — cuvântul intră în document, o singură dată
    deschide(pg, ["Numele: "], 8)
    compune("I", "Io", "Ion")
    c = centru(pg, element_tinta("mso:Bold"))
    pg.touchscreen.tap(c[0], c[1])
    pg.wait_for_timeout(300)
    insert(" ")
    pg.wait_for_timeout(200)
    st = stare(pg)
    caz(rez, "n3c_atingere_panglica", st["text"][0].startswith("Numele: Ion") and st["text"][0].count("Ion") == 1, text=st["text"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire")
    a = ap.parse_args()
    s = server()
    url = "http://127.0.0.1:%d/aplicatii/poligon.html" % s.server_address[1]
    rez = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        cx = b.new_context(viewport={"width": 1366, "height": 768})
        cx.route("**/*", doar_local)
        pg = cx.new_page()
        pg.goto(url)
        pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        pg.evaluate("LH.aplicatii.gata")
        cazuri_birou(pg, rez)
        cx.close()
        tx = b.new_context(viewport={"width": 390, "height": 800}, has_touch=True, is_mobile=True, device_scale_factor=2)
        tx.route("**/*", doar_local)
        pt = tx.new_page()
        pt.goto(url)
        pt.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        pt.evaluate("LH.aplicatii.gata")
        cdp = tx.new_cdp_session(pt)
        cazuri_telefon(pt, cdp, rez)
        tx.close()
        b.close()
    s.shutdown()
    picate = [r["caz"] for r in rez if not r["ok"]]
    if a.iesire:
        with open(a.iesire, "w", encoding="utf-8") as f:
            json.dump({"cazuri": rez, "picate": picate}, f, ensure_ascii=False, indent=1)
    print("picate:", picate)
    print(len(picate))
    return 1 if picate else 0


if __name__ == "__main__":
    sys.exit(main())
