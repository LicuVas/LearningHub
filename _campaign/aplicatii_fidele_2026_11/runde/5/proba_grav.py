# -*- coding: utf-8 -*-
r"""Proba celor 7 GRAV deschise din runde/4/critic.md (T6, N4, T4, T5, T1, T2, T3), pe poligon — runda 5, constructorul.

Aceleași reguli ca runde/4/proba_grav.py (ale cărui ajutoare le refolosește): server static pe 127.0.0.1, port liber;
Chromium headless; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24); gesturi reale (page.keyboard /
page.mouse). Ce cere fiecare caz e citat lângă el (referința înghețată, lecția m1-l03, contractul api_biblioteca.md).
    python .../runde/5/proba_grav.py [--iesire <fisier.json>]
Ultima linie = numărul de cazuri picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import importlib.util
import json
import os
import sys

from playwright.sync_api import sync_playwright

AICI = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("p4", os.path.join(AICI, "..", "4", "proba_grav.py"))
p4 = importlib.util.module_from_spec(_s)
_s.loader.exec_module(p4)
deschide, stare, taste, scrie, mesaje, clic_tinta, clic_sel, caz, marime_la = (
    p4.deschide, p4.stare, p4.taste, p4.scrie, p4.mesaje, p4.clic_tinta, p4.clic_sel, p4.caz, p4.marime_la)
VIZ, CASETA_FONT, tinte_vizibile, real = p4.VIZ, p4.CASETA_FONT, p4.tinte_vizibile, p4.real

ORAR_ANA = {"nume": "Popescu_Ana_7A_orar", "text": ["Orarul meu", "Luni: română, matematică, TIC"]}
CLUB = ["Clubul de lectură", "Numele meu:"]


def ev(pg):
    return pg.evaluate("(window.__lhAplicatieEv || []).map(e => [e.gest, e.actiune, e.tinta, e.activat || ''])")


def suprafete(pg):
    return pg.evaluate("""() => { %s return [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-suprafata^="dialog."]')]
        .filter(viz).map(e => e.getAttribute('data-lh-suprafata')); }""" % VIZ)


def etichete_dialog(pg):
    return pg.evaluate("""() => { %s return [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-suprafata^="dialog."] [data-lh-eticheta]')]
        .filter(viz).map(e => e.getAttribute('data-lh-eticheta')); }""" % VIZ)


def asistent(pg, pasi):
    pg.evaluate("p => { window.__as = LH.aplicatii.asistent('word', {pasi: p, dupaGreseli: 2, dupaSecunde: 30}); }", pasi)


def pas(pg):
    return pg.evaluate("window.__as ? window.__as.pas() : null")


def indicii(pg):
    return pg.evaluate("""() => { %s return [...document.querySelectorAll('[data-lh-indiciu]')].filter(viz).map(e => e.getAttribute('data-lh-pentru')); }""" % VIZ)


def nume_caseta(pg):
    return pg.evaluate("""() => { %s const i = [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-tinta="camp:nume_fisier"] input')].find(viz);
        return i ? i.value : null; }""" % VIZ)


def fisier(st, nume, folder="Documente"):
    for f in st.get("fisiere") or []:
        if f.get("nume") == nume and f.get("folder") == folder:
            return f
    return None


def inchide_fara_salvare(pg):
    taste(pg, "Control+w")
    clic_tinta(pg, "fereastra:Don't Save")


def cazuri(pg, rez):
    # ---------------- T6: Enter pe rândul unei liste = același pas ca clicul (api §4 „activat”, §6.3)
    deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    asistent(pg, [{"tinta": "meniu:20", "indiciu": "Alege 20"}])
    clic_sel(pg, CASETA_FONT)
    taste(pg, "Alt+ArrowDown", *["ArrowDown"] * 5, "Enter")
    pg.wait_for_timeout(150)
    st, e = stare(pg), ev(pg)
    ent = [x for x in e if x[0] == "tasta_enter"]
    caz(rez, "t6_font_size_tastatura_activat", marime_la(st, "are") == 20 and ent and ent[-1][3] == "meniu:20" and pas(pg) == 1
        and not indicii(pg), marime=marime_la(st, "are"), enter=ent, pas=pas(pg), indicii=indicii(pg))
    deschide(pg, {"paragrafe": ["Orar"]})
    asistent(pg, [{"tinta": "camp:tip_fisier"}, {"tinta": "meniu:PDF (*.pdf)"}, {"tinta": "dialog_salvare:Save"}])
    taste(pg, "F12", "Alt+t", "Alt+ArrowDown", *["ArrowDown"] * 6, "Enter")
    p_pdf = pas(pg)
    taste(pg, "Enter")
    pg.wait_for_timeout(150)
    st = stare(pg)
    caz(rez, "t6_save_as_type_tastatura_activat", p_pdf == 2 and pas(pg) == 3 and st.get("fisiere_salvate") == ["Orar.pdf"],
        pas_dupa_pdf=p_pdf, pas=pas(pg), fisiere=st.get("fisiere_salvate"), ev=ev(pg)[-4:])

    # ---------------- T4: Ctrl+F12 = fereastra Open (uia_word.json › acoperire_r3.fapte.d_ctrl_f12: titlu „Open”, #32770)
    deschide(pg, {"paragrafe": ["Ana"], "fisiere": [ORAR_ANA]})
    taste(pg, "Control+F12")
    sup, e = suprafete(pg), ev(pg)
    caz(rez, "t4_ctrl_f12_deschide_open", sup == ["dialog.open"] and e and e[-1][1] not in ("salvare_ca",), suprafete=sup, ev=e[-1:])
    # ---------------- N4: rândurile = fișierele folderului curent („Adresă: Documente”); clic + Open = documentul deschis
    randuri = [t for t in tinte_vizibile(pg, "lista:")]
    clic_tinta(pg, "lista:Popescu_Ana_7A_orar.docx")
    v = nume_caseta(pg)
    clic_tinta(pg, "fereastra:Open")
    st = stare(pg)
    caz(rez, "n4_open_rand_clic_open", "lista:Popescu_Ana_7A_orar.docx" in randuri and v == "Popescu_Ana_7A_orar"
        and st.get("nume_fisier") == "Popescu_Ana_7A_orar.docx" and st.get("text") == ORAR_ANA["text"] and not suprafete(pg),
        randuri=randuri, caseta=v, nume=st.get("nume_fisier"), text=st.get("text"), mesaje=mesaje(pg))
    # Browse din File › Open (dialog.open › deschis_prin: „Backstage › Open › Browse deschide aceeași fereastră”)
    deschide(pg, {"paragrafe": ["Ana"], "fisiere": [ORAR_ANA]})
    taste(pg, "Control+o")
    clic_tinta(pg, "backstage:Browse")
    sup = suprafete(pg)
    adr = p4.text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-suprafata='dialog.open'] [data-lh-tip='SplitButton'][data-lh-eticheta='Documente']")
    caz(rez, "n4_browse_deschide_open", sup == ["dialog.open"] and adr == "Documente", suprafete=sup, adresa=adr, mesaje=mesaje(pg))
    # m1-l03:240 (N1P6E1): „Ctrl+O › Browse, apoi Descărcări”, verificarea activ:{nume:'club-lectura',folder:'desc'}
    deschide(pg, {"paragrafe": [""], "fisiere": [{"folder": "Descărcări", "nume": "club-lectura", "text": CLUB}, ORAR_ANA]})
    taste(pg, "Control+o")
    clic_tinta(pg, "backstage:Browse")
    clic_tinta(pg, "arbore:Descărcări")
    r2 = tinte_vizibile(pg, "lista:")
    c = pg.evaluate("""() => { const e = LH.aplicatii.element('word', 'lista:club-lectura.docx'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }""")
    if c:
        pg.mouse.dblclick(c[0], c[1])
        pg.wait_for_timeout(200)
    st = stare(pg)
    caz(rez, "n4_240_descarcari_dublu_clic", r2 == ["lista:club-lectura.docx"] and st.get("nume_fisier") == "club-lectura.docx"
        and st.get("text") == CLUB and st.get("titlu_fereastra", "").startswith("club-lectura") and not suprafete(pg),
        randuri=r2, nume=st.get("nume_fisier"), text=st.get("text"), titlu=st.get("titlu_fereastra"), mesaje=mesaje(pg))
    # numele scris în File name + Enter = Open (butonul implicit: learn.microsoft.com … dlgbox-programming-considerations)
    deschide(pg, {"paragrafe": ["Ana"], "fisiere": [ORAR_ANA]})
    taste(pg, "Control+F12")
    scrie(pg, "Popescu_Ana_7A_orar")
    taste(pg, "Enter")
    st, e = stare(pg), ev(pg)
    caz(rez, "n4_open_nume_tastat_enter", st.get("nume_fisier") == "Popescu_Ana_7A_orar.docx" and any(x[3] == "fereastra:Open" for x in e),
        nume=st.get("nume_fisier"), ev=e[-2:])
    # Cancel: fereastra se închide, documentul rămâne
    taste(pg, "Control+F12")
    clic_tinta(pg, "fereastra:Cancel")
    st = stare(pg)
    caz(rez, "n4_open_cancel", not suprafete(pg) and st.get("nume_fisier") == "Popescu_Ana_7A_orar.docx", suprafete=suprafete(pg))

    # ---------------- T5: Word fără document (Ctrl+W › Don't Save = word-ctrl-w-nu-salva) → Ctrl+N / Blank document
    deschide(pg, {"paragrafe": ["Ana azi"]})
    inchide_fara_salvare(pg)
    d0 = stare(pg).get("documente_deschise")
    taste(pg, "Control+n")
    st = stare(pg)
    scrie(pg, "Bicaz")
    st2 = stare(pg)
    caz(rez, "t5_ctrl_n_document_nou", d0 == 0 and st.get("documente_deschise") == 1 and st2.get("text") == ["Bicaz"],
        inainte=d0, dupa=st.get("documente_deschise"), text=st2.get("text"), mesaje=mesaje(pg))
    deschide(pg, {"paragrafe": ["Ana azi"]})
    inchide_fara_salvare(pg)
    clic_tinta(pg, "fila:File")
    ok_b = clic_tinta(pg, "backstage:Blank document")
    st = stare(pg)
    caz(rez, "t5_blank_document", ok_b and st.get("documente_deschise") == 1 and st.get("pagina_backstage") is None,
        gasit=ok_b, docs=st.get("documente_deschise"), pagina=st.get("pagina_backstage"), mesaje=mesaje(pg))
    deschide(pg, {"paragrafe": ["Ana azi"]})
    inchide_fara_salvare(pg)
    tac = []
    for nume, gest in (("Bold", lambda: clic_tinta(pg, "mso:Bold")), ("F12", lambda: taste(pg, "F12")), ("Ctrl+B", lambda: taste(pg, "Control+b"))):
        pg.evaluate("document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => x.remove())")
        gest()
        if not mesaje(pg):
            tac.append(nume)
    caz(rez, "t5_fara_document_nu_tace", not tac, tac=tac)

    # ---------------- T1: F12 pe un document salvat propune numele fișierului (runde/4/critic.md:104, com_f12.json)
    deschide(pg, {"paragrafe": ["Orarul meu", "Luni: română", "Marți: sport"], "nume": "Popescu_Ana_7A_orar", "folder": "Documente",
                  "salvat": True, "modificat": True})
    taste(pg, "Control+s", "F12")
    v = nume_caseta(pg)
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    clic_sel(pg, "[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-tinta=\"dialog_salvare:Save\"]')].find(viz)")
    st = stare(pg)
    caz(rez, "t1_f12_salvat_propune_numele", v == "Popescu_Ana_7A_orar.docx" and "Popescu_Ana_7A_orar.pdf" in (st.get("fisiere_salvate") or [])
        and st.get("nume_fisier") == "Popescu_Ana_7A_orar.docx", caseta=v, fisiere=st.get("fisiere_salvate"), nume=st.get("nume_fisier"))

    # ---------------- T2: nume existent → nu se înlocuiește în tăcere (m1-l03:157-172, R12 „nu tace”)
    deschide(pg, {"paragrafe": ["Orarul meu", "Luni: sport, TIC, istorie"], "fisiere": [ORAR_ANA]})
    taste(pg, "F12", "Control+a")
    scrie(pg, "Popescu_Ana_7A_orar")
    taste(pg, "Enter")
    st, m, sup = stare(pg), mesaje(pg), suprafete(pg)
    f = fisier(st, "Popescu_Ana_7A_orar.docx")
    ok1 = f and f.get("text") == ORAR_ANA["text"] and m and sup == ["dialog.FileSaveAs"] and st.get("nume_fisier") is None
    taste(pg, "Control+a")
    scrie(pg, "Pop_Mihai_7A_orar")
    taste(pg, "Enter")
    st = stare(pg)
    f = fisier(st, "Popescu_Ana_7A_orar.docx")
    caz(rez, "t2_existent_nu_se_inlocuieste", ok1 and f and f.get("text") == ORAR_ANA["text"] and st.get("nume_fisier") == "Pop_Mihai_7A_orar.docx",
        mesaje=m, suprafete=sup, colega=f, nume=st.get("nume_fisier"))
    deschide(pg, {"paragrafe": ["Orar nou"], "fisiere": [{"nume": "Orar.pdf", "text": ["Orar vechi"]}]})
    taste(pg, "F12", "Control+a")
    scrie(pg, "Orar")
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    clic_sel(pg, "[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-tinta=\"dialog_salvare:Save\"]')].find(viz)")
    st = stare(pg)
    f = fisier(st, "Orar.pdf")
    caz(rez, "t2_pdf_existent_nu_se_inlocuieste", f and f.get("text") == ["Orar vechi"] and mesaje(pg), pdf=f, mesaje=mesaje(pg))

    # ---------------- T3: după PDF, fereastra = uia_word.json › dialog.FileSaveAs_pdf (Optimize for, Options..., Open file after publishing)
    deschide(pg, {"paragrafe": ["Orar"]})
    taste(pg, "F12")
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    sup, et = suprafete(pg), etichete_dialog(pg)
    vrut = ["Optimize for:", "Standard (publishing online and printing)", "Minimum size (publishing online)", "Options...", "Open file after publishing"]
    caz(rez, "t3_zona_pdf_din_referinta", sup == ["dialog.FileSaveAs_pdf"] and all(x in et for x in vrut) and "Save Thumbnail" not in et
        and p4.valoare_caseta_tip(pg) == "PDF (*.pdf)"
        and "Optimize for:" in (p4.text_vizibil(pg, "[data-lh-aplicatie='word'] [data-lh-suprafata='dialog.FileSaveAs_pdf']") or ""), suprafete=sup, lipsa=[x for x in vrut if x not in et], thumb="Save Thumbnail" in et)
    n0 = len(ev(pg))
    taste(pg, "Alt+e")
    bifa = pg.evaluate("""() => { const e = LH.aplicatii.element('word', 'fereastra:Open file after publishing'); return e ? e.getAttribute('aria-checked') : null; }""")
    taste(pg, "Alt+m")
    radio = pg.evaluate("""() => { const e = LH.aplicatii.element('word', 'fereastra:Minimum size (publishing online)'); return e ? e.getAttribute('aria-checked') : null; }""")
    pg.evaluate("document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x => x.remove())")
    taste(pg, "Alt+o")
    m = mesaje(pg)
    e = ev(pg)[n0:]
    caz(rez, "t3_taste_acces_pdf", bifa == "true" and radio == "true" and bool(m) and len([x for x in e if x[0] == "tasta_acces"]) >= 3,
        bifa=bifa, radio=radio, mesaje=m, ev=e)
    taste(pg, "Escape")
    taste(pg, "F12")
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    clic_sel(pg, "[...document.querySelectorAll('[data-lh-aplicatie=\"word\"] [data-lh-tinta=\"dialog_salvare:Save\"]')].find(viz)")
    st = stare(pg)
    r = real("word-salvare-pdf")
    caz(rez, "t3_save_pdf_scenariul_real", st.get("fisiere_salvate") == r["fisiere_salvate"] and st.get("nume_fisier") == r["nume_fisier"]
        and st.get("tip_salvare_afisat") == r["tip_salvare_afisat"], sim={k: st.get(k) for k in r}, real=r)
    deschide(pg, {"paragrafe": ["Orar"]})
    taste(pg, "F12")
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:PDF (*.pdf)")
    p4.deschide_lista_tip(pg)
    clic_tinta(pg, "meniu:Word Document (*.docx)")
    sup, et = suprafete(pg), etichete_dialog(pg)
    caz(rez, "t3_inapoi_la_docx", sup == ["dialog.FileSaveAs"] and "Save Thumbnail" in et and "Options..." not in et, suprafete=sup)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire")
    a = ap.parse_args()
    s = p4.server()
    url = "http://127.0.0.1:%d/aplicatii/poligon.html" % s.server_address[1]
    rez = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        cx = b.new_context(viewport={"width": 1366, "height": 768})
        cx.route("**/*", p4.doar_local)
        pg = cx.new_page()
        pg.goto(url)
        pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        try:
            cazuri(pg, rez)
        except Exception as e:
            caz(rez, "eroare_proba", False, eroare=str(e)[:400])
        cx.close()
        b.close()
    s.shutdown()
    picate = [r["caz"] for r in rez if not r["ok"]]
    if a.iesire:
        with open(a.iesire, "w", encoding="utf-8") as f:
            json.dump({"cazuri": rez, "picate": picate}, f, ensure_ascii=False, indent=1, default=str)
    print("picate:", picate)
    print(len(picate))
    return 1 if picate else 0


if __name__ == "__main__":
    sys.exit(main())
