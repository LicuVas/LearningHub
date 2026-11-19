# -*- coding: utf-8 -*-
"""Runda 8 (B-excel): proba celor 9 GRAV ale criticului 7 (K3, K5, K4, X5, X8, K2, K1, K6, X10), cu GESTURI REALE pe
poligonul bibliotecii (Playwright headless, mouse + tastatură). Refolosește serverul, ruta și clasa S din runde/7/proba_grav.py.

Referințele (înghețate): uia_excel.json › meniu_contextual.*, lista.AutoSum, lista.Borders, dialog.save_this_file,
dialog.save_your_changes_to_this_file, dialog.eroare_formula*, dialog.SortDialog, dialog.SortWarning, dialog.ColumnWidth,
dialog.FileSaveAs, panglica.TabHome (ta); scenarii_real/excel-point-*, excel-av-tab, excel-aver-tab, excel-alt-egal,
excel-ctrl-w-modificat, excel-separator-virgula, excel-autocompletare-tab.

Rulare:  python proba_grav.py [--iesire <fisier.json>] [--doar K3,K5]
Rădăcina servită: LH_SERVIT (un dosar care conține `aplicatii/`), altfel worktree-ul. Ultima linie = verificări picate."""
import argparse, json, os, sys
AICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AICI, "..", "7"))
import proba_grav as PG
from proba_grav import S, verif, REZ
from playwright.sync_api import sync_playwright

APP = '[data-lh-aplicatie] '
def tasta(s, k, t=200): s.pg.keyboard.press(k); s.pg.wait_for_timeout(t)
def nev(s): return s.ev("()=>(window.__lhAplicatieEv||[]).length")
def evd(s, n0): return s.ev("n=>(window.__lhAplicatieEv||[]).slice(n).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta,activat:e.activat||null}))", n0)
def meniu_deschis(s): return s.ev("()=>!![...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-meniu,[data-lh-aplicatie] [data-lh-suprafata^=\"lista.\"],[data-lh-aplicatie] [data-lh-suprafata^=\"meniu\"]')].find(e=>e.getClientRects().length)")
def dreapta(s, a): x = s.rect(a); s.pg.mouse.click(x[0], x[1], button="right"); s.pg.wait_for_timeout(200)
def ae(s): return s.ev("()=>{const a=document.activeElement;if(!a)return null;const t=a.closest('[data-lh-tinta]');return {tag:a.tagName,tinta:t?(t.getAttribute('data-lh-tinta')+(t.getAttribute('data-lh-id')?':'+t.getAttribute('data-lh-id'):'')):null,et:(a.closest('[data-lh-eticheta]')||{getAttribute:()=>null}).getAttribute('data-lh-eticheta')}}")
def edit_text(s): return s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"] .lh-ap-x-fx-text, [data-lh-aplicatie] .lh-ap-x-fx');return e?e.textContent:null}")
def bara_mod(s): return s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-eticheta^=\"Cell Mode\"]')].find(e=>e.getClientRects().length);return e?e.textContent.trim():null}")
def fila(s, id_):
    s.clic_sel(APP + '[data-lh-tip="TabItem"][data-lh-id-mso="%s"]' % id_)
NOTE = {"B2": 9, "B3": 7, "B4": 8}

# ------------------------------------------------------------------ K3: meniuri și liste deschise
def k3(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE, C2=5, C3=6), "selectie": "A1"})
    dreapta(s, "B2"); n0 = nev(s)
    tasta(s, "c")
    st = s.stare(); e = evd(s, n0)
    verif("K3", "meniul de clic dreapta pe B2, litera C (Copy, ta „C”): meniul se închide, B2 rămâne 9, nu intră în editare",
          not meniu_deschis(s) and (s.cel("B2") or {}).get("text") == "9" and not st.get("ramane_in_editare"), {"B2": s.cel("B2"), "edit": st.get("ramane_in_editare"), "ev": e})
    s.clic("D5"); tasta(s, "Control+v")
    verif("K3", "… și a copiat: Ctrl+V pe D5 → 9", (s.cel("D5") or {}).get("text") == "9", s.cel("D5"))
    verif("K3", "litera C emite un eveniment cu ținta comenzii Copy", any((x.get("tinta") or "").endswith("Copy") or (x.get("activat") or "").endswith("Copy") for x in e), e)
    dreapta(s, "C2"); n0 = nev(s)
    tasta(s, "Delete")
    verif("K3", "Delete cu meniul deschis pe C2: C2 rămâne 5 (tasta nu ajunge în foaie), cu eveniment",
          (s.cel("C2") or {}).get("text") == "5" and len(evd(s, n0)) >= 1, {"C2": s.cel("C2"), "ev": evd(s, n0)})
    tasta(s, "Escape")
    verif("K3", "Esc închide meniul", not meniu_deschis(s), None)
    s.clic("B3"); dreapta(s, "B3"); n0 = nev(s)
    tasta(s, "ArrowDown"); tasta(s, "ArrowDown")
    ales = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-ales');return e?e.getAttribute('data-lh-eticheta'):null}")
    tasta(s, "Enter")
    e = evd(s, n0); sel = s.stare().get("selectie") or {}
    verif("K3", "↓ ↓ în meniu alege Copy (al doilea rând), celula activă rămâne B3", ales == "Copy" and sel.get("activa") == "B3", {"ales": ales, "sel": sel})
    verif("K3", "Enter apasă rândul ales: meniul se închide, evenimentul are activat = meniu:Copy",
          not meniu_deschis(s) and any(x.get("gest") == "tasta_enter" and x.get("activat") == "meniu:Copy" for x in e), e)
    s.clic("E6"); tasta(s, "Control+v")
    verif("K3", "… Ctrl+V pe E6 → 7 (a copiat B3)", (s.cel("E6") or {}).get("text") == "7", s.cel("E6"))
    # fila foii: litera R = Rename
    b = s.ev(PG_R, APP + '[data-lh-tinta="fila_foii"][data-lh-id="Sheet1"]')
    s.pg.mouse.click(b[0] + b[2] / 2, b[1] + b[3] / 2, button="right"); s.pg.wait_for_timeout(200)
    tasta(s, "r"); s.pg.keyboard.type("Note"); tasta(s, "Enter")
    st = s.stare()
    verif("K3", "meniul filei, litera R (Rename): redenumire; „Note” + Enter → foaia Note, celula activă neatinsă",
          st.get("foi") == ["Note"] and not any(v.get("text") in ("r", "rNote", "Note") for v in (st.get("celule") or {}).values()), {"foi": st.get("foi"), "celule": st.get("celule")})
    # lista Borders ▾: ↓ + Enter alege o bordură, nu mută celula
    s.clic("A1")
    fila(s, "TabHome")
    ok = s.clic_sel(APP + '[data-lh-id-mso="BordersGallery_Dropdown"], ' + APP + '[data-lh-eticheta="Borders"] [data-lh-tinta^="meniu_derulant"]')
    n0 = nev(s)
    tasta(s, "ArrowDown"); tasta(s, "Enter")
    st = s.stare()
    verif("K3", "Borders ▾, ↓, Enter: A1 primește Bottom Border, celula activă rămâne A1",
          ok and ((st.get("format_celule") or {}).get("A1") or {}).get("borduri", {}).get("jos") and (st.get("selectie") or {}).get("activa") == "A1",
          {"ok": ok, "fmt": (st.get("format_celule") or {}).get("A1"), "sel": st.get("selectie"), "ev": evd(s, n0)})
    verif("K3", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

PG_R = "s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height]}"

# ------------------------------------------------------------------ K5: modul Point + ferestrele de eroare
def k5(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE, E2=4), "selectie": "B5"})
    s.clic("B5"); s.pg.keyboard.type("="); tasta(s, "ArrowUp")
    st = s.stare()
    verif("K5", "B5: „=” + ↑ → în editare scrie „=B4”, bara de stare „Point”, fără mesaj",
          st.get("ramane_in_editare") and not s.mesaj() and bara_mod(s) == "Point", {"mod": bara_mod(s), "mesaj": s.mesaj(), "edit": st.get("ramane_in_editare")})
    tasta(s, "ArrowUp"); tasta(s, "ArrowDown")
    tasta(s, "Enter")
    st = s.stare()
    verif("K5", "↑ ↓ (înapoi la B4), Enter → B5 = „=B4” = 8, activa B6 (scenarii_real/excel-point-egal-sus.json)",
          (s.cel("B5") or {}).get("formula") == "=B4" and (s.cel("B5") or {}).get("text") == "8" and (st.get("selectie") or {}).get("activa") == "B6", {"B5": s.cel("B5"), "sel": st.get("selectie")})
    s.clic("D2"); s.pg.keyboard.type("=B2+"); tasta(s, "ArrowRight"); tasta(s, "Enter")
    st = s.stare()
    verif("K5", "D2: „=B2+” + → + Enter → „=B2+E2” = 13, activa D3 (excel-point-plus-dreapta.json)",
          (s.cel("D2") or {}).get("formula") == "=B2+E2" and (s.cel("D2") or {}).get("text") == "13" and (st.get("selectie") or {}).get("activa") == "D3", {"D2": s.cel("D2"), "sel": st.get("selectie")})
    s.clic("F2"); s.pg.keyboard.type("=SUM("); tasta(s, "ArrowLeft"); tasta(s, "ArrowLeft"); s.pg.keyboard.type(";"); tasta(s, "ArrowLeft"); s.pg.keyboard.type(")"); tasta(s, "Enter")
    verif("K5", "F2: „=SUM(” ← ← „;” ← „)” → „=SUM(D2;E2)”", (s.cel("F2") or {}).get("formula") == "=SUM(D2,E2)", s.cel("F2"))
    # ferestrele de eroare (dialog.eroare_formula_2 / _3), în locul mesajului central
    s.clic("G2"); s.pg.keyboard.type("=SUM(B2,B3)"); tasta(s, "Enter")
    st = s.stare(); fm = st.get("fereastra_mesaj") or {}
    verif("K5", "„=SUM(B2,B3)” + Enter → fereastra „There's a problem with this formula.” (OK), rămâne în editare, fără mesaj central",
          (fm.get("texte") or ["", ""])[-1].startswith("There's a problem with this formula.") and fm.get("butoane") == ["OK"] and st.get("ramane_in_editare") and not s.mesaj(),
          {"fm": fm, "edit": st.get("ramane_in_editare"), "mesaj": s.mesaj()})
    n0 = nev(s); tasta(s, "Enter")
    st = s.stare(); e = evd(s, n0)
    verif("K5", "Enter apasă OK: fereastra se închide, celula rămâne în editare (Esc o golește)",
          not s.ev("()=>!!document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog.eroare_formula\"]')") and st.get("ramane_in_editare") and any(x.get("activat") == "fereastra:OK" for x in e), {"edit": st.get("ramane_in_editare"), "ev": e})
    tasta(s, "Escape")
    s.clic("A10"); s.pg.keyboard.type("=SU"); tasta(s, "Tab"); s.pg.keyboard.type("B2:B4)"); tasta(s, "Enter")
    fm = s.stare().get("fereastra_mesaj") or {}
    verif("K5", "„=SU” + Tab + „B2:B4)” + Enter → fereastra „You've entered too few arguments for this function.” (excel-autocompletare-tab.json)",
          (fm.get("texte") or ["", ""])[-1] == "You've entered too few arguments for this function." and s.stare().get("ramane_in_editare"), fm)
    tasta(s, "Escape"); tasta(s, "Escape")
    verif("K5", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ K4: =AV + Tab
def k4(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE), "selectie": "C6"})
    s.clic("C6"); s.pg.keyboard.type("=AV"); tasta(s, "Tab"); s.pg.keyboard.type("B2:B4)"); tasta(s, "Enter")
    c = s.cel("C6") or {}
    verif("K4", "C6: „=AV” + Tab + „B2:B4)” + Enter → „=AVEDEV(B2:B4)” = 0,666667 (scenarii_real/excel-av-tab.json)",
          c.get("formula") == "=AVEDEV(B2:B4)" and c.get("text") == "0,666667" and not (s.stare().get("fereastra_mesaj")), c)
    s.clic("C7"); s.pg.keyboard.type("=AVER"); tasta(s, "Tab"); s.pg.keyboard.type("B2:B4)"); tasta(s, "Enter")
    c = s.cel("C7") or {}
    verif("K4", "C7: „=AVER” + Tab → „=AVERAGE(B2:B4)” = 8 (excel-aver-tab.json)", c.get("formula") == "=AVERAGE(B2:B4)" and c.get("text") == "8", c)
    s.scrie("C8", "=AVEDEV(B2;B3;B4)")
    verif("K4", "AVEDEV scris de mână, cu „;”: 0,666667", (s.cel("C8") or {}).get("text") == "0,666667", s.cel("C8"))
    verif("K4", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X5: lista ▾ a lui Σ
SIGMA_V = APP + '[data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="AutoSumMenu_Dropdown"]'
def x5(pw, base):
    s = S(pw, base)
    col = {"B%d" % (i + 2): v for i, v in enumerate([9, 7, 8, 10, 6, 5])}
    s.deschide({"celule": col, "selectie": "B8"})
    for fn, nume, rez in (("AVERAGE", "Average", "7,5"), ("COUNT", "Count Numbers", "6"), ("MAX", "Max", "10"), ("MIN", "Min", "5"), ("SUM", "Sum", "45")):
        s.clic("B8"); tasta(s, "Delete")
        fila(s, "TabHome")
        ok = s.clic_sel(SIGMA_V)
        vis = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.AutoSum\"] [data-lh-tip=\"MenuItem\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))")
        if fn == "AVERAGE":
            verif("X5", "▾ de lângă Σ: lista Sum, Average, Count Numbers, Max, Min, More Functions... (uia_excel.json › lista.AutoSum)",
                  ok and vis == ["Sum", "Average", "Count Numbers", "Max", "Min", "More Functions..."], {"ok": ok, "vis": vis, "mesaj": s.mesaj()})
        s.clic_sel(APP + '[data-lh-suprafata="lista.AutoSum"] [data-lh-tip="MenuItem"][data-lh-eticheta="%s"]' % nume)
        prop = s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-propus')")
        tasta(s, "Enter")
        c = s.cel("B8") or {}
        verif("X5", "%s pe B8 → „=%s(B2:B7)” = %s, cu zona propusă încadrată" % (nume, fn, rez), c.get("formula") == "=%s(B2:B7)" % fn and c.get("text") == rez and prop and not s.mesaj(), {"B8": c, "propus": prop, "mesaj": s.mesaj()})
    # Formulas › AutoSum ▾: aceeași listă
    s.clic("C8")
    fila(s, "TabFormulas")
    ok = s.clic_sel(APP + '[data-lh-suprafata="panglica.TabFormulas"] [data-lh-id-mso="AutoSumMenu_Dropdown"]')
    vis = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.AutoSum\"] [data-lh-tip=\"MenuItem\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))")
    verif("X5", "Formulas › AutoSum ▾: aceeași listă", ok and vis == ["Sum", "Average", "Count Numbers", "Max", "Min", "More Functions..."], {"ok": ok, "vis": vis})
    tasta(s, "Escape")
    verif("X5", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X8: Save this file / Save your changes
def fereastra(s, cheie): return s.ev("k=>!![...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"'+k+'\"]')].find(e=>e.getClientRects().length)", cheie)
def x8(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A2"})
    s.scrie("A2", "5")
    tasta(s, "Control+s")
    a = ae(s)
    verif("X8", "Ctrl+S pe registru nou → fereastra „Save this file” (uia_excel.json › dialog.save_this_file), focusul în File name",
          fereastra(s, "dialog.save_this_file") and a and a.get("tag") == "INPUT" and (a.get("tinta") or "").startswith("camp:nume_fisier") and not s.mesaj(), {"ae": a, "mesaj": s.mesaj()})
    s.pg.keyboard.press("Control+a"); s.pg.keyboard.type("Tema mea"); tasta(s, "Enter")
    st = s.stare()
    verif("X8", "„Tema mea” + Enter → salvat ca „Tema mea.xlsx”, fereastra închisă, titlul „Tema mea - Excel”",
          st.get("nume_fisier") == "Tema mea.xlsx" and not fereastra(s, "dialog.save_this_file") and (st.get("titlu_fereastra") or "").startswith("Tema mea"), {"nume": st.get("nume_fisier"), "titlu": st.get("titlu_fereastra")})
    s.gata()
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A2"})
    s.clic_sel(APP + '[data-lh-tinta^="acces_rapid:Save"]')
    verif("X8", "butonul Save din Acces rapid pe registru nou → „Save this file”", fereastra(s, "dialog.save_this_file"), s.mesaj())
    s.clic_sel(APP + '[data-lh-suprafata="dialog.save_this_file"] [data-lh-eticheta="More options…"]')
    verif("X8", "More options… → File › Save As (Backstage)", s.stare().get("pagina_backstage") == "Save As" and not fereastra(s, "dialog.save_this_file"), s.stare().get("pagina_backstage"))
    tasta(s, "Escape")
    s.clic_sel(APP + '[data-lh-tinta="fila:File"]')
    s.clic_sel(APP + '[data-lh-suprafata="backstage.nav"] [data-lh-eticheta="Save"]')
    # constructorul 2: File › Save din Backstage NU e în referința Excel (acoperire_r7.fapte are doar Ctrl+S); rămâne ca în
    # Word (word.js:1698: pagina File › Save As) — diferente.md D16, de_verificat R8-10
    verif("X8", "File › Save pe registru nou → pagina File › Save As (ca word.js:1698; fără referință Excel: de_verificat R8-10)",
          s.stare().get("pagina_backstage") == "Save As" and not fereastra(s, "dialog.save_this_file"), {"pag": s.stare().get("pagina_backstage")})
    tasta(s, "Escape"); tasta(s, "Control+s")
    s.clic_sel(APP + '[data-lh-suprafata="dialog.save_this_file"] [data-lh-eticheta="Cancel"]')
    verif("X8", "Cancel închide fereastra, registrul rămâne nesalvat", not fereastra(s, "dialog.save_this_file") and s.stare().get("nume_fisier") is None, s.stare().get("nume_fisier"))
    s.gata()
    # Ctrl+W pe registru modificat (scenarii_real/excel-ctrl-w-modificat.json)
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A2"})
    s.scrie("A2", "7")
    tasta(s, "Control+w")
    st = s.stare()
    verif("X8", "Ctrl+W pe registru modificat → dialog {titlu:'', intrebare:'Save your changes to this file?', butoane:[More options…, Save, Don't Save, Cancel], apasat:null}, registru_activ Book1",
          st.get("dialog") == {"titlu": "", "intrebare": "Save your changes to this file?", "butoane": ["More options…", "Save", "Don't Save", "Cancel"], "apasat": None} and st.get("registru_activ") == "Book1" and not s.mesaj(),
          {"dialog": st.get("dialog"), "activ": st.get("registru_activ"), "mesaj": s.mesaj()})
    s.clic_sel(APP + '[data-lh-suprafata="dialog.save_your_changes_to_this_file"] [data-lh-eticheta="Cancel"]')
    st = s.stare()
    verif("X8", "Cancel: registrul rămâne deschis, cu A2 = 7", st.get("registru_activ") == "Book1" and (s.cel("A2") or {}).get("text") == "7" and not fereastra(s, "dialog.save_your_changes_to_this_file"), {"activ": st.get("registru_activ")})
    s.clic_sel(APP + '[data-lh-tinta="fila:File"]')
    s.clic_sel(APP + '[data-lh-suprafata="backstage.nav"] [data-lh-eticheta="Close"]')
    verif("X8", "File › Close pe registru modificat → aceeași fereastră", fereastra(s, "dialog.save_your_changes_to_this_file"), s.mesaj())
    # constructorul 2: fereastra întrebării ARE caseta ei File name (uia_excel.json › dialog.save_your_changes_to_this_file ›
    # Edit „File name” v „Book1”; acoperire_r7.fapte.b_ctrl_w_modificat.focus = File name), deci Save salvează din ea, fără
    # a doua fereastră (ca word.js:1715) — diferente.md D17, de_verificat R8-11
    a = ae(s); nf = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.save_your_changes_to_this_file\"] [data-lh-tinta=\"camp:nume_fisier\"] input');return e?e.value:null}")
    verif("X8", "fereastra întrebării: focusul în caseta ei File name, cu „Book1” (uia_excel.json › Edit File name v Book1)",
          (a or {}).get("tinta", "").startswith("camp:nume_fisier") and nf == "Book1", {"ae": a, "nf": nf})
    s.pg.keyboard.press("Control+a"); s.pg.keyboard.type("Lista"); n0 = nev(s)
    s.clic_sel(APP + '[data-lh-suprafata="dialog.save_your_changes_to_this_file"] [data-lh-eticheta="Save"]')
    st = s.stare(); e = evd(s, n0)
    verif("X8", "„Lista” + Save → salvat și închis (acțiunea salvare_si_inchidere): Excel gol (registru_activ null), fără altă fereastră",
          st.get("registru_activ", "x") is None and not fereastra(s, "dialog.save_this_file") and any(x.get("actiune") == "salvare_si_inchidere" for x in e),
          {"activ": st.get("registru_activ", "x"), "mesaj": s.mesaj(), "ev": e})
    tasta(s, "Control+n"); s.scrie("A1", "x"); tasta(s, "Control+w")
    s.clic_sel(APP + '[data-lh-suprafata="dialog.save_your_changes_to_this_file"] [data-lh-eticheta="Don\'t Save"]')
    verif("X8", "Don't Save → registrul se închide nesalvat", s.stare().get("registru_activ", "x") is None, s.stare().get("registru_activ", "x"))
    verif("X8", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ K2: Enter în ferestre = butonul implicit, cu activat
def k2(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 60, "A3": "Bogdan", "B3": "VIII B", "C3": 95}, "selectie": "C1"})
    s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'fereastra:OK',indiciu:'Apasă OK'},{tinta:'fereastra:OK',indiciu:'Apasă OK'}],dupaGreseli:2})}")
    b = s.ev(PG_R, APP + '[data-lh-tinta="antet_coloana"][data-lh-id="C"]')
    s.pg.mouse.click(b[0] + b[2] / 2, b[1] + b[3] / 2, button="right"); s.pg.wait_for_timeout(200)
    s.clic_sel(APP + '[data-lh-tip="MenuItem"][data-lh-eticheta="Column Width..."]')
    s.pg.keyboard.type("20"); n0 = nev(s); tasta(s, "Enter")
    e = evd(s, n0)
    verif("K2", "Column Width, „20” + Enter: evenimentul tasta_enter are activat = fereastra:OK și ținta = camp:latime_coloana",
          any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:OK" and x["tinta"] == "camp:latime_coloana" for x in e), e)
    fila(s, "TabData"); s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]')
    n0 = nev(s); tasta(s, "Enter")
    e = evd(s, n0)
    verif("K2", "Sort, Enter: activat = fereastra:OK, ținta = focusul (OK), nu „camp:Sort by”",
          any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:OK" and x["tinta"] != "camp:Sort by" for x in e), e)
    verif("K2", "asistentul §6.3: doi pași „fereastra:OK” făcuți cu Enter → pas() = 2, fără indiciu",
          s.ev("()=>window.__as.pas()") == 2 and not s.ev("()=>document.querySelector('[data-lh-indiciu]')"), {"pas": s.ev("()=>window.__as.pas()")})
    gol = fereastra(s, "dialog.SortDialog_eroare_nivel_gol")
    n0 = nev(s); tasta(s, "Enter"); e = evd(s, n0)
    verif("K2", "Sort cu „Sort by” gol: OK deschide fereastra „All sort criteria must have…” (dialog.SortDialog_eroare_nivel_gol); Enter o închide (activat fereastra:OK), Sort rămâne",
          gol and not fereastra(s, "dialog.SortDialog_eroare_nivel_gol") and fereastra(s, "dialog.SortDialog") and any(x["activat"] == "fereastra:OK" for x in e), {"gol": gol, "ev": e})
    tasta(s, "Escape")
    s.clic("C2"); s.pg.keyboard.down("Shift"); s.clic("C3"); s.pg.keyboard.up("Shift")
    s.clic_sel(APP + '[data-lh-id-mso="SortAscendingExcel"]')
    n0 = nev(s); tasta(s, "Enter")
    e = evd(s, n0)
    verif("K2", "Sort Warning, Enter: activat = fereastra:Sort..., ținta nu e celula din spate",
          any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:Sort..." and not (x["tinta"] or "").startswith("celula") for x in e), e)
    verif("K2", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ K1: tastatura în ferestre
def k1(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 60, "A3": "Bogdan", "B3": "VIII B", "C3": 95}, "selectie": "A1"})
    fila(s, "TabData"); s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]')
    a = ae(s)
    verif("K1", "Sort: la deschidere focusul e pe OK (uia_excel.json › acoperire_r7.fapte)", a and a.get("et") == "OK", a)
    vazute = []
    for i in range(8):
        tasta(s, "Tab", 120); x = ae(s); vazute.append((x or {}).get("et") if (x or {}).get("tag") != "DIV" or (x or {}).get("et") else "DIV-gol")
    verif("K1", "Tab ×8 în Sort: focusul rămâne în fereastră, pe controale cu nume (niciun DIV gol)", "DIV-gol" not in vazute and None not in vazute, vazute)
    n0 = nev(s); tasta(s, "Alt+a")
    nv = s.ev("()=>document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortDialog\"] [data-lh-nivel]').length")
    e = evd(s, n0)
    verif("K1", "Alt+A (Add Level) adaugă un nivel și emite tasta_acces", nv == 2 and any(x["gest"] == "tasta_acces" for x in e), {"niveluri": nv, "ev": e})
    tasta(s, "Escape")
    s.clic("C2"); s.pg.keyboard.down("Shift"); s.clic("C3"); s.pg.keyboard.up("Shift"); s.clic_sel(APP + '[data-lh-id-mso="SortAscendingExcel"]')
    tasta(s, "Alt+c")
    rad = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('aria-checked'))")
    verif("K1", "Sort Warning: Alt+C alege „Continue with the current selection”", rad == ["false", "true"], rad)
    tasta(s, "ArrowUp")
    rad = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('aria-checked'))")
    verif("K1", "Sort Warning: ↑ mută alegerea pe „Expand the selection”", rad == ["true", "false"], rad)
    tasta(s, "Escape")
    b = s.ev(PG_R, APP + '[data-lh-tinta="antet_coloana"][data-lh-id="C"]')
    s.pg.mouse.click(b[0] + b[2] / 2, b[1] + b[3] / 2, button="right"); s.pg.wait_for_timeout(200)
    s.clic_sel(APP + '[data-lh-tip="MenuItem"][data-lh-eticheta="Column Width..."]')
    tasta(s, "Tab"); a1 = ae(s); tasta(s, "Shift+Tab"); a2 = ae(s); tasta(s, "Tab"); tasta(s, "Alt+c"); a3 = ae(s)
    verif("K1", "Column Width: Tab → OK, Shift+Tab → caseta, Alt+C → caseta", (a1 or {}).get("et") == "OK" and (a2 or {}).get("tinta") == "camp:latime_coloana" and (a3 or {}).get("tinta") == "camp:latime_coloana", [a1, a2, a3])
    tasta(s, "Escape")
    tasta(s, "F12"); s.pg.keyboard.type("Tabel"); tasta(s, "Tab"); a1 = ae(s); tasta(s, "Alt+n"); a2 = ae(s)
    verif("K1", "Save As: Tab din File name → alt control cu nume; Alt+N → înapoi în File name", a1 and (a1.get("et") or a1.get("tinta")) and (a2 or {}).get("tinta") == "camp:nume_fisier", [a1, a2])
    tasta(s, "Alt+s")
    verif("K1", "Save As: Alt+S salvează", s.stare().get("nume_fisier") == "Tabel.xlsx", s.stare().get("nume_fisier"))
    verif("K1", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ K6: tastele de acces ale panglicii
def k6(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE, A1="Elev", C3=0.25), "selectie": "A1"})
    s.clic("A1"); n0 = nev(s); tasta(s, "Alt")
    kt = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-keytip')].map(e=>e.textContent)")
    verif("K6", "Alt arată literele filelor (H pentru Home, N pentru Insert, A pentru Data), cu eveniment", "H" in kt and "N" in kt and "A" in kt and len(evd(s, n0)) >= 1, {"kt": kt, "ev": evd(s, n0)})
    tasta(s, "h"); tasta(s, "1")
    st = s.stare()
    verif("K6", "Alt, H, 1 → Bold pe A1; A1 nu intră în editare și rămâne „Elev”", ((st.get("format_celule") or {}).get("A1") or {}).get("bold") and (s.cel("A1") or {}).get("text") == "Elev" and not st.get("ramane_in_editare"),
          {"fmt": (st.get("format_celule") or {}).get("A1"), "A1": s.cel("A1")})
    s.clic("B5"); n0 = nev(s); tasta(s, "Alt+Equal")
    e = evd(s, n0); tasta(s, "Enter")
    verif("K6", "Alt+= pe B5 → „=SUM(B2:B4)” = 24 (scenarii_real/excel-alt-egal.json), cu eveniment", (s.cel("B5") or {}).get("formula") == "=SUM(B2:B4)" and (s.cel("B5") or {}).get("text") == "24" and len(e) >= 1, {"B5": s.cel("B5"), "ev": e})
    s.clic("C3"); n0 = nev(s); tasta(s, "Control+Shift+Digit5")
    e = evd(s, n0)
    verif("K6", "Ctrl+Shift+% pe C3 (0,25) → „25%”, cu eveniment", (s.cel("C3") or {}).get("text") == "25%" and len(e) >= 1, {"C3": s.cel("C3"), "ev": e})
    s.clic("B2"); tasta(s, "Alt"); tasta(s, "h"); tasta(s, "u")
    vis = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.AutoSum\"] [data-lh-tip=\"MenuItem\"]')].filter(e=>e.getClientRects().length).length")
    verif("K6", "Alt, H, U deschide lista AutoSum (ta „Alt, H, U”)", vis == 6, vis)
    tasta(s, "Escape"); tasta(s, "Escape")
    verif("K6", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

PROBE = {"K3": k3, "K5": k5, "K4": k4, "X5": x5, "X8": x8, "K2": k2, "K1": k1, "K6": k6}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=os.path.join(AICI, "proba_grav.json"))
    ap.add_argument("--doar", default="")
    a = ap.parse_args()
    doar = [x.strip() for x in a.doar.split(",") if x.strip()] or list(PROBE)
    srv, base = PG.server()
    with sync_playwright() as pw:
        for k in doar:
            try: PROBE[k](pw, base)
            except Exception as e: verif(k, "proba a căzut", False, repr(e)[:300])
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    json.dump({"radacina": "LH_SERVIT" if os.environ.get("LH_SERVIT") else "worktree", "verificari": REZ, "picate": len(picate)},
              open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in REZ: print(("ok   " if r["ok"] else "PICAT") + " " + r["grav"] + " " + r["verificare"][:110] + ("" if r["ok"] else "  <- " + json.dumps(r["detaliu"], ensure_ascii=False)[:200]))
    print(len(picate))

if __name__ == "__main__":
    main()
