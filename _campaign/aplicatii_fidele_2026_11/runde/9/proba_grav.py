# -*- coding: utf-8 -*-
"""Runda 9 (B-excel): proba celor 7 GRAV ale criticului 8 (E1, E2, K1, E4, E3, X10, E5), cu GESTURI REALE pe poligonul
bibliotecii (Playwright headless, mouse + tastatură, doar 127.0.0.1). Refolosește serverul, ruta și clasa S din
runde/7/proba_grav.py.

Referințele (înghețate): uia_excel.json › acoperire_r7.fapte (c_autosum.mod_dupa_sigma / mod_dupa_average = „Cell Mode
Point”; e_sum_lipit.mod_dupa_inchidere = „Cell Mode Edit”; h_grafic), dialog.FileSaveAs (Save „Alt+s”), dialog.SortDialog,
dialog.SortWarning, lista.ChartTypeColumnInsertGallery, panglica_context.Ctx_ChartDesign / Ctx_Format;
api_biblioteca.md §4 `activat` (ENTER = „IDOK or control identifier of the default push button”);
runde/8/critic_probe/com_r8.json (=SUM(B2:B7)*B2:B6 → D2:D6 = 432, 336, 384, 480, 288, HasSpill).

Rulare:  python proba_grav.py [--iesire <fisier.json>] [--doar E1,E2]
Rădăcina servită: LH_SERVIT (un dosar care conține `aplicatii/`), altfel worktree-ul. Ultima linie = verificări picate."""
import argparse, importlib.util, json, os, sys
AICI = os.path.dirname(os.path.abspath(__file__))
_sp = importlib.util.spec_from_file_location("pg7", os.path.join(AICI, "..", "7", "proba_grav.py"))
PG = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(PG)
S, verif, REZ = PG.S, PG.verif, PG.REZ
from playwright.sync_api import sync_playwright

APP = '[data-lh-aplicatie] '
def tasta(s, k, t=200): s.pg.keyboard.press(k); s.pg.wait_for_timeout(t)
def scrie_taste(s, text): s.pg.keyboard.type(text); s.pg.wait_for_timeout(150)
def nev(s): return s.ev("()=>(window.__lhAplicatieEv||[]).length")
def evd(s, n0): return s.ev("n=>(window.__lhAplicatieEv||[]).slice(n).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta,activat:e.activat||null}))", n0)
def ae(s): return s.ev("()=>{const a=document.activeElement;if(!a)return null;const t=a.closest('[data-lh-tinta]');const c=a.closest('[data-lh-tip]');return {tag:a.tagName,tinta:t?(t.getAttribute('data-lh-tinta')+(t.getAttribute('data-lh-id')?':'+t.getAttribute('data-lh-id'):'')):null,et:(a.closest('[data-lh-eticheta]')||{getAttribute:()=>null}).getAttribute('data-lh-eticheta'),tip:c?c.getAttribute('data-lh-tip'):null,nivel:(a.closest('[data-lh-nivel]')||{getAttribute:()=>null}).getAttribute('data-lh-nivel'),camp:(a.closest('[data-lh-camp]')||{getAttribute:()=>null}).getAttribute('data-lh-camp'),inDialog:!!a.closest('[data-lh-suprafata^=\"dialog.\"]')}}")
def bara_mod(s): return s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-eticheta^=\"Cell Mode\"]')].find(e=>e.getClientRects().length);return e?e.textContent.trim():null}")
def keytips(s): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-keytip')].filter(e=>e.getClientRects().length).map(e=>e.textContent)")
def fereastra(s, cheie): return s.ev("k=>!![...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"'+k+'\"]')].find(e=>e.getClientRects().length)", cheie)
def oricefereastra(s): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog.\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-suprafata'))")
def fila(s, id_): s.clic_sel(APP + '[data-lh-tip="TabItem"][data-lh-id-mso="%s"]' % id_)
def edit(s):
    st = s.stare()
    return {k: st.get(k) for k in ("ramane_in_editare", "editare", "selectie") if k in st}
def ecran(s, a):
    """textul de pe ecran al celulei, cu algoritmul O4 (oracole/sim_runner.js › textEcran)."""
    return s.ev("""a=>{const el=document.querySelector('[data-lh-aplicatie] [data-lh-zona] [data-lh-tinta="celula"][data-lh-id="'+a+'"]')||document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula:'+a+'"]');if(!el)return null;
  let out='';const w=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode(n){
    if(n.nodeType===3){const p=n.parentElement;return p&&getComputedStyle(p).visibility==='visible'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}
    if(n.getAttribute('aria-hidden')==='true'||getComputedStyle(n).display==='none')return NodeFilter.FILTER_REJECT;
    return /^(INPUT|TEXTAREA|BR)$/.test(n.tagName)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});
  for(let n=w.nextNode();n;n=w.nextNode()){if(n.nodeType===3)out+=n.data;else if(n.tagName==='BR')out+=String.fromCharCode(10);else out+=String(n.value==null?'':n.value)}
  return out}""", a)
def txt(s, a): return (s.cel(a) or {}).get("text")
def zona(s, a, b):
    s.clic(a); s.pg.keyboard.down("Shift"); s.clic(b); s.pg.keyboard.up("Shift")

SORT = '[data-lh-suprafata="dialog.SortDialog"] '
def combo(niv, camp): return APP + SORT + '[data-lh-nivel="%d"] [data-lh-camp="%s"]' % (niv, camp)
def element_lista(et): return APP + '.lh-ap-x-lista-el[data-lh-eticheta="%s"]' % et
def tab_pana_la(s, niv, camp, max_=16):
    for _ in range(max_):
        a = ae(s) or {}
        if a.get("tip") == "ComboBox" and a.get("nivel") == str(niv) and a.get("camp") == camp: return True
        tasta(s, "Tab", 100)
    a = ae(s) or {}
    return a.get("tip") == "ComboBox" and a.get("nivel") == str(niv) and a.get("camp") == camp
def alege_din_lista_tastatura(s, et):
    tasta(s, "Alt+ArrowDown")
    for _ in range(6):
        ales = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-lista-el.lh-ap-ales');return e?e.getAttribute('data-lh-eticheta'):null}")
        if ales == et: break
        tasta(s, "ArrowDown", 100)
    tasta(s, "Enter")
CLASA = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "8A", "C2": 92, "A3": "Ioana", "B3": "8B", "C3": 95,
         "A4": "Bogdan", "B4": "8A", "C4": 88, "A5": "Irina", "B5": "8B", "C5": 64, "A6": "Darius", "B6": "8A", "C6": 95,
         "A7": "Radu", "B7": "8B", "C7": 78}
ASTEPTAT_K1 = ["Darius", "Ana", "Bogdan", "Ioana", "Radu", "Irina"]
def nume_col(s): return [txt(s, "A%d" % i) for i in range(2, 8)]
NOTE6 = {"B%d" % (i + 2): v for i, v in enumerate([9, 7, 8, 10, 6, 8])}

# ------------------------------------------------------------------ E1: Alt+literă care închide fereastra nu pornește KeyTips
def e1(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(CLASA), "selectie": "E2"})
    s.clic("E2"); tasta(s, "F12")
    verif("E1", "F12 deschide Save As", fereastra(s, "dialog.FileSaveAs"), oricefereastra(s))
    scrie_taste(s, "Lucrare"); n0 = nev(s); tasta(s, "Alt+s")
    e = evd(s, n0); kt = keytips(s)
    verif("E1", "Save As, „Lucrare” + Alt+S: salvează Lucrare.xlsx, fereastra se închide, fără literele KeyTips pe panglică și fără eveniment arata_taste_acces",
          s.stare().get("nume_fisier") == "Lucrare.xlsx" and not oricefereastra(s) and not kt and not any(x["actiune"] == "arata_taste_acces" for x in e),
          {"nume": s.stare().get("nume_fisier"), "kt": kt, "ev": e})
    n0 = nev(s); scrie_taste(s, "abc"); tasta(s, "Enter")
    verif("E1", "… apoi „abc” + Enter → „abc” în E2, fila rămâne Home, fără mesaj central",
          txt(s, "E2") == "abc" and ecran(s, "E2") == "abc" and not s.mesaj(), {"E2": s.cel("E2"), "mesaj": s.mesaj(), "ev": evd(s, n0)})
    # Sort Warning + Alt+S
    zona(s, "C2", "C3"); fila(s, "TabData")
    s.clic_sel(APP + '[data-lh-id-mso="SortAscendingExcel"]')
    verif("E1", "C2:C3 + Sort A to Z → Sort Warning", fereastra(s, "dialog.SortWarning"), oricefereastra(s))
    n0 = nev(s); tasta(s, "Alt+s")
    e = evd(s, n0); kt = keytips(s)
    verif("E1", "Sort Warning, Alt+S: sortează (rânduri întregi: A2 = Ana, A3 = Ioana rămân, C2:C3 = 92, 95) și NU pornește KeyTips",
          not oricefereastra(s) and not kt and not any(x["actiune"] == "arata_taste_acces" for x in e), {"kt": kt, "ev": e, "A2": txt(s, "A2"), "C2": txt(s, "C2")})
    act = (s.stare().get("selectie") or {}).get("activa")
    scrie_taste(s, "7"); tasta(s, "Enter")
    verif("E1", "… apoi „7” + Enter → 7 în celula activă (%s), fără mesajul fals „Undo … nu e simulată”" % act,
          txt(s, act) == "7" and not any("Undo" in m for m in s.mesaj()), {act: s.cel(act), "mesaj": s.mesaj()})
    # Alt singur arată în continuare literele (K6 nu se strică)
    s.clic("F2"); n0 = nev(s); tasta(s, "Alt"); kt = keytips(s)
    verif("E1", "Alt apăsat și eliberat SINGUR arată în continuare literele filelor (H, N, A)", "H" in kt and "N" in kt and "A" in kt, kt)
    tasta(s, "Escape")
    # Alt ținut + literă fără potrivire în fereastră: nici atunci KeyTips
    tasta(s, "F12"); n0 = nev(s); tasta(s, "Alt+q"); kt = keytips(s)
    verif("E1", "Save As, Alt+Q (fără control): fereastra rămâne, fără KeyTips", fereastra(s, "dialog.FileSaveAs") and not kt, {"kt": kt, "ev": evd(s, n0)})
    tasta(s, "Escape")
    verif("E1", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ E2: Enter pe casetă de bifat / buton radio = butonul implicit
def e2(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Bogdan", "B2": "8B", "C2": 95, "A3": "Ana", "B3": "8A", "C3": 60}, "selectie": "A2"})
    s.clic("A2"); fila(s, "TabData"); s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]')
    s.clic_sel(combo(0, "coloana")); s.clic_sel(element_lista("Nume"))
    tasta(s, "Alt+h")
    bifa = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortDialog\"] [data-lh-tip=\"CheckBox\"][data-lh-eticheta=\"My data has headers\"]');return e?e.getAttribute('aria-checked'):null}")
    a = ae(s)
    verif("E2", "Sort, Sort by = Nume, Alt+H: My data has headers debifat, focusul pe casetă", bifa == "false" and (a or {}).get("tip") == "CheckBox", {"bifa": bifa, "ae": a})
    n0 = nev(s); tasta(s, "Enter"); e = evd(s, n0)
    verif("E2", "… Enter apasă OK: fereastra se închide și se sortează FĂRĂ antet (A1:A3 = Ana, Bogdan, Nume)",
          not oricefereastra(s) and [txt(s, "A1"), txt(s, "A2"), txt(s, "A3")] == ["Ana", "Bogdan", "Nume"], {"fer": oricefereastra(s), "A": [txt(s, "A1"), txt(s, "A2"), txt(s, "A3")], "ev": e})
    verif("E2", "… evenimentul tasta_enter are activat = fereastra:OK (nu „bifare”)", any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:OK" for x in e), e)
    tasta(s, "Control+z")
    # Space comută în continuare caseta
    s.clic("A2"); s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]')
    tasta(s, "Alt+h"); b1 = s.ev("()=>document.querySelector('[data-lh-aplicatie] [data-lh-tip=\"CheckBox\"][data-lh-eticheta=\"My data has headers\"]').getAttribute('aria-checked')")
    tasta(s, "Space"); b2 = s.ev("()=>document.querySelector('[data-lh-aplicatie] [data-lh-tip=\"CheckBox\"][data-lh-eticheta=\"My data has headers\"]').getAttribute('aria-checked')")
    verif("E2", "Space pe casetă o comută (Alt+H → false, Space → true), fereastra rămâne", b1 == "false" and b2 == "true" and fereastra(s, "dialog.SortDialog"), [b1, b2])
    tasta(s, "Escape")
    # Sort Warning: Alt+C + Enter = Sort... doar pe selecție
    s.clic("A1"); tasta(s, "Escape")
    zona(s, "C2", "C3"); s.clic_sel(APP + '[data-lh-id-mso="SortAscendingExcel"]')
    tasta(s, "Alt+c")
    rad = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('aria-checked'))")
    n0 = nev(s); tasta(s, "Enter"); e = evd(s, n0)
    verif("E2", "Sort Warning, Alt+C, Enter: Sort... sortează DOAR selecția (C2:C3 = 60, 95; A2 rămâne Bogdan), fereastra se închide",
          rad == ["false", "true"] and not oricefereastra(s) and [txt(s, "C2"), txt(s, "C3"), txt(s, "A2")] == ["60", "95", "Bogdan"],
          {"rad": rad, "fer": oricefereastra(s), "C": [txt(s, "C2"), txt(s, "C3")], "A2": txt(s, "A2"), "ev": e})
    verif("E2", "… evenimentul tasta_enter are activat = fereastra:Sort...", any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:Sort..." for x in e), e)
    verif("E2", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ K1: focusul rămâne în Sort după alegerea pe nivelul 2
def k1(pw, base):
    for fel in ("tastatura", "mouse"):
        s = S(pw, base)
        s.deschide({"celule": dict(CLASA), "selectie": "B3"})
        s.clic("B3"); fila(s, "TabData"); s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]')
        if fel == "tastatura":
            tab_pana_la(s, 0, "coloana"); alege_din_lista_tastatura(s, "Clasa")
            tasta(s, "Alt+a")
            ok1 = tab_pana_la(s, 1, "coloana")
            alege_din_lista_tastatura(s, "Punctaj"); a1 = ae(s)
            ok2 = tab_pana_la(s, 1, "ordine")
            alege_din_lista_tastatura(s, "Largest to Smallest"); a2 = ae(s)
        else:
            s.clic_sel(combo(0, "coloana")); s.clic_sel(element_lista("Clasa"))
            s.clic_sel(APP + SORT + '[data-lh-tip="Button"][data-lh-eticheta="Add Level"]')
            ok1 = s.clic_sel(combo(1, "coloana")); s.clic_sel(element_lista("Punctaj")); a1 = ae(s)
            ok2 = s.clic_sel(combo(1, "ordine")); s.clic_sel(element_lista("Largest to Smallest")); a2 = ae(s)
        verif("K1", "%s: după Then by = Punctaj focusul rămâne în Sort, pe caseta Then by (nivelul 1)" % fel,
              ok1 and (a1 or {}).get("inDialog") and (a1 or {}).get("nivel") == "1" and (a1 or {}).get("camp") == "coloana", a1)
        verif("K1", "%s: după Order = Largest to Smallest focusul rămâne în Sort, pe caseta Order (nivelul 1)" % fel,
              ok2 and (a2 or {}).get("inDialog") and (a2 or {}).get("nivel") == "1" and (a2 or {}).get("camp") == "ordine", a2)
        n0 = nev(s); tasta(s, "Enter"); e = evd(s, n0)
        verif("K1", "%s: Enter sortează (Darius, Ana, Bogdan, Ioana, Radu, Irina — m2-l10:63-64), închide Sort și emite tasta_enter cu activat fereastra:OK" % fel,
              not oricefereastra(s) and nume_col(s) == ASTEPTAT_K1 and any(x["gest"] == "tasta_enter" and x["activat"] == "fereastra:OK" for x in e),
              {"fer": oricefereastra(s), "nume": nume_col(s), "ev": e})
        verif("K1", "%s: fără erori în pagină" % fel, not s.erori, s.erori[:3])
        s.gata()

# ------------------------------------------------------------------ E4: No / Esc în „We found a typo” → modul Edit
def e4(pw, base):
    for fel in ("No", "Escape"):
        s = S(pw, base)
        s.deschide({"celule": dict(NOTE6), "selectie": "D2"})
        s.clic("D2"); scrie_taste(s, "=SUM(B2:B7)B2:B6"); tasta(s, "Enter")
        verif("E4", "%s: „=SUM(B2:B7)B2:B6” + Enter → fereastra „We found a typo…”" % fel, fereastra(s, "dialog.eroare_formula"), oricefereastra(s))
        if fel == "No": s.clic_sel(APP + '[data-lh-suprafata="dialog.eroare_formula"] [data-lh-tip="Button"][data-lh-eticheta="No"]')
        else: tasta(s, "Escape")
        m = bara_mod(s)
        verif("E4", "%s: fereastra se închide, celula rămâne în editare, bara de stare = Edit (e_sum_lipit.mod_dupa_inchidere „Cell Mode Edit”)" % fel,
              not oricefereastra(s) and m == "Edit", {"mod": m, "fer": oricefereastra(s)})
        n0 = nev(s)
        for _ in range(5): tasta(s, "ArrowLeft", 100)
        e = evd(s, n0)
        verif("E4", "%s: ← ×5 mută cursorul în formulă, fereastra NU reapare" % fel,
              not oricefereastra(s) and all(x["actiune"] == "mutare_cursor" for x in e) and len(e) == 5, {"fer": oricefereastra(s), "ev": e})
        scrie_taste(s, "*"); fx = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');return e?(e.querySelector('input')||e).value||e.textContent:null}")
        tasta(s, "Enter")
        c = s.cel("D2") or {}
        verif("E4", "%s: „*” + Enter → D2 primește „=SUM(B2:B7)*B2:B6”, fără fereastră" % fel,
              c.get("formula") == "=SUM(B2:B7)*B2:B6" and not oricefereastra(s), {"D2": c, "fx": fx, "fer": oricefereastra(s)})
        verif("E4", "%s: fără erori în pagină" % fel, not s.erori, s.erori[:3])
        s.gata()

# ------------------------------------------------------------------ E3: după Σ / ▾ Average / Alt+= modul e Point
SIGMA = APP + '[data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="AutoSum"]'
SIGMA_V = APP + '[data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="AutoSumMenu_Dropdown"]'
def e3(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE6), "selectie": "B8"})
    s.clic("B8"); fila(s, "TabHome"); s.clic_sel(SIGMA)
    m = bara_mod(s); c0 = s.cel("B8")
    verif("E3", "B8, Σ → „=SUM(B2:B7)” în editare, bara de stare = Point (c_autosum.mod_dupa_sigma)", m == "Point", {"mod": m, "B8": c0})
    tasta(s, "Enter")
    verif("E3", "… Enter → B8 = 48, selecția coboară în B9", txt(s, "B8") == "48" and (s.stare().get("selectie") or {}).get("activa") == "B9", {"B8": s.cel("B8"), "sel": s.stare().get("selectie")})
    s.clic("B8"); tasta(s, "Delete"); s.clic_sel(SIGMA); n0 = nev(s); tasta(s, "ArrowDown"); e = evd(s, n0)
    st = s.stare()
    verif("E3", "Σ, apoi ↓: formula NU e primită (B8 rămâne în editare, selecția nu coboară), bara = Point, evenimentul = referinta",
          (st.get("selectie") or {}).get("activa") == "B8" and bara_mod(s) == "Point" and any(x["actiune"] == "referinta" for x in e) and txt(s, "B8") != "48",
          {"sel": st.get("selectie"), "mod": bara_mod(s), "ev": e, "B8": s.cel("B8")})
    tasta(s, "Escape")
    s.clic("B8"); s.clic_sel(SIGMA); scrie_taste(s, "B2:B6"); tasta(s, "Enter")
    verif("E3", "Σ, apoi „B2:B6” scris peste zona propusă (m2-l08:181) + Enter → =SUM(B2:B6) = 40",
          (s.cel("B8") or {}).get("formula") == "=SUM(B2:B6)" and txt(s, "B8") == "40", s.cel("B8"))
    s.clic("B8"); tasta(s, "Delete"); s.clic_sel(SIGMA_V)
    s.clic_sel(APP + '[data-lh-suprafata="lista.AutoSum"] [data-lh-tip="MenuItem"][data-lh-eticheta="Average"]')
    m = bara_mod(s)
    verif("E3", "▾ › Average → bara de stare = Point (c_autosum.mod_dupa_average)", m == "Point", m)
    tasta(s, "Enter")
    verif("E3", "… Enter → B8 = 8", txt(s, "B8") == "8", s.cel("B8"))
    s.clic("B8"); tasta(s, "Delete"); tasta(s, "Alt+Equal"); m = bara_mod(s)
    verif("E3", "Alt+= → bara de stare = Point", m == "Point", m)
    tasta(s, "Enter")
    verif("E3", "… Enter → B8 = 48", txt(s, "B8") == "48", s.cel("B8"))
    verif("E3", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ E5: Yes în „We found a typo” → formula care se varsă
def e5(pw, base):
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE6), "selectie": "D2"})
    s.clic("D2"); scrie_taste(s, "=SUM(B2:B7)B2:B6"); tasta(s, "Enter")
    s.clic_sel(APP + '[data-lh-suprafata="dialog.eroare_formula"] [data-lh-tip="Button"][data-lh-eticheta="Yes"]')
    tx = [txt(s, "D%d" % i) for i in range(2, 7)]
    ec = [ecran(s, "D%d" % i) for i in range(2, 7)]
    verif("E5", "Yes → D2 = „=SUM(B2:B7)*B2:B6”, D2:D6 = 432, 336, 384, 480, 288 în stare și pe ecran (com_r8.json, HasSpill)",
          tx == ["432", "336", "384", "480", "288"] and ec == tx and (s.cel("D2") or {}).get("formula") == "=SUM(B2:B7)*B2:B6", {"stare": tx, "ecran": ec, "D2": s.cel("D2")})
    verif("E5", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X10: graficele (m2-l11)
GR = APP + '[data-lh-tinta="grafic"]'
def file_vizibile(s): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"TabItem\"]')].filter(e=>e.getClientRects().length&&!e.closest('[data-lh-suprafata^=\"dialog.\"]')).map(e=>e.getAttribute('data-lh-eticheta'))")
def fila_aleasa(s): return s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"TabItem\"][aria-selected=\"true\"]')].find(e=>e.getClientRects().length&&!e.closest('[data-lh-suprafata^=\"dialog.\"]'));return e?e.getAttribute('data-lh-eticheta'):null}")
def graf_rect(s, i=1): return s.ev("i=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta=\"grafic\"][data-lh-id=\"'+i+'\"]')].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}", i)
def graf_ecran(s, i=1):
    """ce se vede în grafic: titlul, legenda, numele de pe axa categoriilor, câte bare / linii / felii, mânerele"""
    return s.ev("""i=>{const g=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta="grafic"][data-lh-id="'+i+'"]')].find(e=>e.getClientRects().length);if(!g)return null;
      const t=q=>[...g.querySelectorAll(q)].map(e=>e.textContent.trim());
      const ti=g.querySelector('[data-lh-tinta$="/titlu"]');
      return {titlu:ti&&ti.getClientRects().length?ti.textContent:null,legenda:t('.lh-ap-x-gr-leg-text'),categorii:t('.lh-ap-x-gr-cat'),
        bare:g.querySelectorAll('rect.lh-ap-x-gr-bara').length,linii:g.querySelectorAll('polyline.lh-ap-x-gr-linie').length,felii:g.querySelectorAll('path.lh-ap-x-gr-felie').length,
        valori:[...g.querySelectorAll('[data-lh-valoare]')].map(e=>+e.getAttribute('data-lh-valoare')),manere:[...g.querySelectorAll('.lh-ap-x-gr-maner')].filter(e=>e.getClientRects().length).length}}""", i)
def clic_grafic(s, i=1):
    r = graf_rect(s, i)
    if not r: return False
    s.pg.mouse.click(r[0] + 6, r[1] + r[3] - 6); s.pg.wait_for_timeout(200); return True
def lista_x10(s): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] [data-lh-tip=\"ListItem\"],[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] [data-lh-tip=\"MenuItem\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))")
def ev_gest(s, n0): return evd(s, n0)
LISTA_REF = ["Clustered Column", "Stacked Column", "100% Stacked Column", "3-D Clustered Column", "3-D Stacked Column",
             "3-D 100% Stacked Column", "3-D Column", "Clustered Bar", "Stacked Bar", "100% Stacked Bar", "3-D Clustered Bar",
             "3-D Stacked Bar", "3-D 100% Stacked Bar", "More Column Charts..."]
FILE_DUPA = ["Home", "Insert", "Draw", "Page Layout", "Formulas", "Data", "Review", "View", "Help", "Chart Design", "Format", "Sheet1"]   # uia_excel.json › acoperire_r7.fapte.h_grafic.file_dupa
NOTE3 = {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": 9, "A3": "Bogdan", "B3": 7, "A4": "Dan", "B4": 8}
LUNI = {"A1": "Luna", "B1": "8A", "C1": "8B", "A2": "septembrie", "B2": 12, "C2": 9, "A3": "octombrie", "B3": 18, "C3": 14,
        "A4": "noiembrie", "B4": 25, "C4": 20, "A5": "decembrie", "B5": 15, "C5": 22}
def gr0(s): return (s.stare().get("grafice") or [None])[0]
def dlg_ctt(s): return fereastra(s, "dialog.ChartChangeType")
def ctt_alege(s, tip):
    s.clic_sel(APP + '[data-lh-suprafata="dialog.ChartChangeType"] [data-lh-tip="ListItem"][data-lh-eticheta="%s"]' % tip)
def ctt_eticheta(s): return s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.ChartChangeType\"] .lh-ap-x-ctt-nume');return e&&e.getClientRects().length?e.textContent.trim():null}")
def ok_ctt(s): s.clic_sel(APP + '[data-lh-suprafata="dialog.ChartChangeType"] [data-lh-tip="Button"][data-lh-eticheta="OK"]')
def deschide_lista(s): return s.clic_sel(APP + '[data-lh-id-mso="ChartTypeColumnInsertGallery"]')
def rand_lista(s, et): return s.clic_sel(APP + '[data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-tip="ListItem"][data-lh-eticheta="%s"]' % et)

def x10(pw, base):
    # 1. lista ▾ din referință + inserarea Clustered Column (gesturi de mouse)
    s = S(pw, base)
    s.deschide({"celule": dict(NOTE3), "selectie": "A1"})
    zona(s, "A1", "B4"); fila(s, "TabInsert"); n0 = nev(s)
    ok = deschide_lista(s)
    vis = lista_x10(s)
    verif("X10", "Insert › Insert Column or Bar Chart ▾ deschide lista din referință (13 rânduri + More Column Charts..., în ordinea din uia_excel.json), fără mesaj central",
          ok and vis == LISTA_REF and not s.mesaj(), {"ok": ok, "vis": vis, "mesaj": s.mesaj()})
    grupuri = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] .lh-ap-x-gr-grup')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim())")
    ico = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] [data-lh-tip=\"ListItem\"] svg')].filter(e=>e.getClientRects().length).length")
    verif("X10", "lista arată titlurile grupurilor 2-D Column, 3-D Column, 2-D Bar, 3-D Bar și o pictogramă pe fiecare din cele 13 rânduri",
          grupuri == ["2-D Column", "3-D Column", "2-D Bar", "3-D Bar"] and ico == 13, {"grupuri": grupuri, "pictograme": ico})
    rand_lista(s, "Clustered Column")
    st = s.stare(); gr = st.get("grafice") or []
    g = gr[0] if gr else {}
    verif("X10", "Clustered Column → un grafic în stare: tip, zona A1:B4, titlul „Nota”, seria Nota, categoriile Ana, Bogdan, Dan, valorile 9, 7, 8",
          len(gr) == 1 and g.get("tip") == "Clustered Column" and g.get("zona") == "A1:B4" and g.get("titlu") == "Nota" and g.get("serii") == ["Nota"]
          and g.get("categorii") == ["Ana", "Bogdan", "Dan"] and g.get("valori") == [[9, 7, 8]], gr)
    ec = graf_ecran(s)
    verif("X10", "ecranul = starea: titlul Nota, 3 bare cu valorile 9, 7, 8, jos Ana, Bogdan, Dan; graficul ales (8 mânere pe margini)",
          ec and ec["titlu"] == "Nota" and ec["bare"] == 3 and ec["valori"] == [9, 7, 8] and ec["categorii"] == ["Ana", "Bogdan", "Dan"] and ec["manere"] == 8, ec)
    fv = file_vizibile(s)
    verif("X10", "după inserare: filele … Help, Chart Design, Format (h_grafic.file_dupa), Chart Design aleasă cu Style 1 în panglică, grafic_activ",
          fv == FILE_DUPA and fila_aleasa(s) == "Chart Design" and st.get("grafic_activ") is True
          and s.ev("()=>!![...document.querySelectorAll('[data-lh-aplicatie] [data-lh-eticheta=\"Style 1\"]')].find(e=>e.getClientRects().length)"),
          {"file": fv, "aleasa": fila_aleasa(s), "activ": st.get("grafic_activ")})
    e = ev_gest(s, n0)
    verif("X10", "evenimente §4: lista deschisă (meniu_derulant) și inserarea pe meniu:Clustered Column (inserare_grafic)",
          any(x["actiune"] == "meniu_derulant" for x in e) and any(x["tinta"] == "meniu:Clustered Column" and x["actiune"] == "inserare_grafic" for x in e), e)
    # 2. clic pe o celulă → graficul nu mai e ales; clic pe marginea lui albă → ales din nou
    s.clic("B12")
    st = s.stare(); fv = file_vizibile(s)
    verif("X10", "clic pe o celulă: graficul nu mai e ales, filele Chart Design / Format dispar, mânerele dispar",
          st.get("grafic_activ") is False and "Chart Design" not in fv and fila_aleasa(s) not in ("Chart Design", "Format") and (graf_ecran(s) or {}).get("manere") == 0,
          {"file": fv, "aleasa": fila_aleasa(s), "ec": graf_ecran(s)})
    n0 = nev(s); clic_grafic(s)
    st = s.stare(); fv = file_vizibile(s)
    verif("X10", "clic pe marginea graficului: ales din nou (eveniment pe ținta grafic:1), filele Chart Design și Format înapoi",
          st.get("grafic_activ") is True and "Chart Design" in fv and any(x["tinta"] == "grafic:1" for x in ev_gest(s, n0)), {"file": fv, "ev": ev_gest(s, n0)})
    # 3. Change Chart Type: Pie, OK; Ctrl+Z înapoi
    fila(s, "Ctx_ChartDesign"); n0 = nev(s)
    s.clic_sel(APP + '[data-lh-id-mso="ChartChangeType"]')
    verif("X10", "Chart Design › Change Chart Type... deschide fereastra (fila All Charts aleasă, Column ales, în dreapta Clustered Column)",
          dlg_ctt(s) and ctt_eticheta(s) == "Clustered Column" and s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.ChartChangeType\"] [data-lh-tip=\"TabItem\"][aria-selected=\"true\"]');return e&&e.getAttribute('data-lh-eticheta')}") == "All Charts",
          {"dlg": oricefereastra(s), "et": ctt_eticheta(s)})
    ctt_alege(s, "Pie")
    verif("X10", "Pie în stânga: în dreapta numele „Pie”, fără mesaj central", ctt_eticheta(s) == "Pie" and not s.mesaj(), {"et": ctt_eticheta(s), "mesaj": s.mesaj()})
    ok_ctt(s)
    g = gr0(s) or {}; ec = graf_ecran(s) or {}
    verif("X10", "OK → graficul e Pie (3 felii, legenda Ana, Bogdan, Dan), fereastra închisă, eveniment schimbare_tip_grafic",
          g.get("tip") == "Pie" and ec.get("felii") == 3 and ec.get("legenda") == ["Ana", "Bogdan", "Dan"] and not dlg_ctt(s)
          and any(x["actiune"] == "schimbare_tip_grafic" for x in ev_gest(s, n0)), {"g": g, "ec": ec})
    tasta(s, "Control+z")
    verif("X10", "Ctrl+Z → graficul redevine Clustered Column", (gr0(s) or {}).get("tip") == "Clustered Column", gr0(s))
    # 4. titlul: un clic, scrii, Enter
    s.clic_sel(GR + ' [data-lh-tinta="grafic:1/titlu"]'); scrie_taste(s, "Note bune"); tasta(s, "Enter")
    verif("X10", "un clic pe titlu, „Note bune” + Enter → titlul nou în stare și pe ecran, nicio celulă scrisă",
          (gr0(s) or {}).get("titlu") == "Note bune" and (graf_ecran(s) or {}).get("titlu") == "Note bune" and not any(txt(s, a) == "Note bune" for a in ("B12", "A1")),
          {"g": gr0(s), "ec": graf_ecran(s)})
    # 5. graficul e legat de tabel
    s.clic("B3"); scrie_taste(s, "10"); tasta(s, "Enter")
    verif("X10", "B3 = 10 → bara lui Bogdan arată 10 (graficul legat de tabel)", (graf_ecran(s) or {}).get("valori") == [9, 10, 8] and (gr0(s) or {}).get("valori") == [[9, 10, 8]], graf_ecran(s))
    # 6. mutarea și mărirea cu mouse-ul
    r = graf_rect(s)
    clic_grafic(s)
    s.pg.mouse.move(r[0] + 6, r[1] + r[3] - 6); s.pg.mouse.down(); s.pg.mouse.move(r[0] + 60, r[1] + r[3] + 30, steps=6); s.pg.mouse.up(); s.pg.wait_for_timeout(200)
    r2 = graf_rect(s)
    verif("X10", "tragerea de margine mută graficul (54 px la dreapta, 36 în jos), mărimea rămâne", bool(r2) and abs(r2[0] - r[0] - 54) <= 2 and abs(r2[1] - r[1] - 36) <= 2 and abs(r2[2] - r[2]) <= 1, {"r": r, "r2": r2})
    m = s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta=\"grafic:1/maner\"][data-lh-colt=\"jd\"]')].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    if m:
        s.pg.mouse.move(m[0], m[1]); s.pg.mouse.down(); s.pg.mouse.move(m[0] + 80, m[1] + 40, steps=6); s.pg.mouse.up(); s.pg.wait_for_timeout(200)
    r3 = graf_rect(s)
    verif("X10", "tragerea de cerculețul din dreapta-jos mărește graficul (+80 × +40)", bool(m and r3 and r2) and abs(r3[2] - r2[2] - 80) <= 2 and abs(r3[3] - r2[3] - 40) <= 2, {"m": m, "r2": r2, "r3": r3})
    # 7. Delete cu graficul ales îl șterge; Ctrl+Z îl readuce
    clic_grafic(s); n0 = nev(s); tasta(s, "Delete")
    verif("X10", "Delete cu graficul ales → graficul dispare (stare și ecran), eveniment stergere_grafic", s.stare().get("grafice") == [] and not graf_rect(s)
          and any(x["actiune"] == "stergere_grafic" for x in ev_gest(s, n0)), s.stare().get("grafice"))
    tasta(s, "Control+z")
    verif("X10", "Ctrl+Z → graficul revine", len(s.stare().get("grafice") or []) == 1 and bool(graf_rect(s)), s.stare().get("grafice"))
    verif("X10", "fără erori în pagină (partea 1)", not s.erori, s.erori[:3])
    s.gata()

    # 8. două serii (LUNI, laboratorul m2-l11): Switch Row/Column, Line prin Change Chart Type, Clustered Bar din listă cu graficul ales
    s = S(pw, base)
    s.deschide({"celule": dict(LUNI), "selectie": "A1"})
    zona(s, "A1", "C5"); fila(s, "TabInsert")
    deschide_lista(s); rand_lista(s, "Clustered Column")
    g = gr0(s) or {}; ec = graf_ecran(s) or {}
    verif("X10", "A1:C5 → seriile 8A, 8B (valorile pe 4 rânduri, 2 coloane), categoriile lunile, titlul Chart Title, legenda 8A, 8B, 8 bare",
          g.get("serii") == ["8A", "8B"] and g.get("categorii") == ["septembrie", "octombrie", "noiembrie", "decembrie"] and g.get("titlu") == "Chart Title"
          and ec.get("legenda") == ["8A", "8B"] and ec.get("bare") == 8, {"g": g, "ec": ec})
    n0 = nev(s); s.clic_sel(APP + '[data-lh-id-mso="ChartSwitchRowColumn"]')
    g = gr0(s) or {}; ec = graf_ecran(s) or {}
    verif("X10", "Switch Row/Column → seriile sunt lunile, categoriile 8A, 8B; titlul rămâne; eveniment comutare_rand_coloana",
          g.get("serii") == ["septembrie", "octombrie", "noiembrie", "decembrie"] and g.get("categorii") == ["8A", "8B"] and g.get("titlu") == "Chart Title"
          and ec.get("legenda") == g.get("serii") and any(x["actiune"] == "comutare_rand_coloana" for x in ev_gest(s, n0)), {"g": g, "ec": ec})
    s.clic_sel(APP + '[data-lh-id-mso="ChartSwitchRowColumn"]')
    s.clic_sel(APP + '[data-lh-id-mso="ChartChangeType"]'); ctt_alege(s, "Line")
    et = ctt_eticheta(s); ok_ctt(s)
    g = gr0(s) or {}; ec = graf_ecran(s) or {}
    verif("X10", "Change Chart Type › Line › OK → tipul Line, două linii, legenda 8A, 8B", et == "Line" and g.get("tip") == "Line" and ec.get("linii") == 2 and ec.get("legenda") == ["8A", "8B"], {"et": et, "g": g, "ec": ec})
    fila(s, "TabInsert"); deschide_lista(s); rand_lista(s, "Clustered Bar")
    gr = s.stare().get("grafice") or []
    verif("X10", "cu graficul ales, Insert › Clustered Bar îi schimbă tipul (m2-l11: „nu face încă un grafic”)", len(gr) == 1 and gr[0].get("tip") == "Clustered Bar" and (graf_ecran(s) or {}).get("bare") == 8, gr)
    # 9. tastatura: Alt, N, C → lista; ↓ + Enter → Clustered Column pe zona aleasă
    s.clic("H20"); zona(s, "A1", "B5"); tasta(s, "Alt"); tasta(s, "n"); tasta(s, "c")
    vis = lista_x10(s)
    tasta(s, "ArrowDown"); tasta(s, "Enter")
    gr = s.stare().get("grafice") or []
    verif("X10", "tastatura: Alt, N, C deschide lista; ↓ + Enter inserează Clustered Column pe A1:B5 (al doilea grafic)",
          vis == LISTA_REF and len(gr) == 2 and gr[1].get("tip") == "Clustered Column" and gr[1].get("zona") == "A1:B5", {"vis": vis, "gr": gr})
    # 10. un rând nesimulat dă mesajul central, nu un grafic fals
    s.clic("H20"); fila(s, "TabInsert"); deschide_lista(s); rand_lista(s, "3-D Column")
    verif("X10", "3-D Column (nesimulat) → mesajul central, niciun grafic nou", bool(s.mesaj()) and len(s.stare().get("grafice") or []) == 2, {"mesaj": s.mesaj()})
    verif("X10", "fără erori în pagină (partea 2)", not s.erori, s.erori[:3])
    s.gata()

PROBE = {"E1": e1, "E2": e2, "K1": k1, "E4": e4, "E3": e3, "E5": e5, "X10": x10}

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
    for r in REZ: print(("ok   " if r["ok"] else "PICAT") + " " + r["grav"] + " " + r["verificare"][:110] + ("" if r["ok"] else "  <- " + json.dumps(r["detaliu"], ensure_ascii=False)[:260]))
    print(len(picate))

if __name__ == "__main__":
    main()
