# -*- coding: utf-8 -*-
"""Critic r8 p6: (A) focusul dupa alegerea din lista Order a ferestrei Sort (tastatura si mouse); (B) Sort Warning cu tastatura;
(C) tastele DUPA un Alt+litera care inchide fereastra (Sort Warning Alt+S, Save As Alt+S). Fiecare caz pe un registru proaspat."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60,
       "A5": "Dan", "B5": "VIII B", "C5": 78, "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
LISTA = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-lista-el')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()+(e.classList.contains('lh-ap-ales')?'*':''))"
RADIO = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('data-lh-eticheta')+':'+e.getAttribute('aria-checked'))"
FOC = "()=>{const a=document.activeElement;const t=a&&a.closest('[data-lh-tip]');const n=a&&a.closest('[data-lh-nivel]');return t?[t.getAttribute('data-lh-tip'),t.getAttribute('data-lh-eticheta'),n?n.getAttribute('data-lh-nivel'):null]:[a&&a.tagName]}"
VAL = """()=>{const d=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^="dialog.SortDialog"]');if(!d)return null;
 return [...d.querySelectorAll('[data-lh-nivel]')].map(n=>[...n.querySelectorAll('[data-lh-tip="ComboBox"]')].map(c=>{const v=c.querySelector('.lh-ap-x-sort-val,[data-lh-valoare],.lh-ap-text');return (c.getAttribute('data-lh-valoare')||(v?v.textContent:'')||'').trim()}))}"""
def col(c):
    x = s.stare()["celule"]
    return [(x.get(c + str(i)) or {}).get("text") for i in range(1, 8)]
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"dialog": x.get("dialog"), "dlg": dialog_vizibil(s), "focus": s.ev(FOC), "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s), "keytips": keytips(s)[:6]}
    if extra: out[nume].update(extra)
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def opensort():
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(350)
def tab_pana(eticheta, nivel, n=16):
    for i in range(n):
        f = s.ev(FOC)
        if len(f) == 3 and f[0] == "ComboBox" and f[1] == eticheta and f[2] == str(nivel): return True
        K.press("Tab"); s.page.wait_for_timeout(50)
    return False
def proaspat(sel="B3"):
    deschide_cu(s, {"celule": TAB, "selectie": sel}); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
try:
    # A1: Order nivelul 0, tastatura: Alt+↓, ↓, Enter
    proaspat(); opensort(); tab_pana("Sort by", 0); K.press("Alt+ArrowDown"); K.press("ArrowDown"); K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(200)
    pas("A1a_sortby_clasa", {"val": s.ev(VAL)})
    tab_pana("Order", 0); K.press("Alt+ArrowDown"); s.page.wait_for_timeout(100); K.press("ArrowDown"); K.press("ArrowDown"); s.page.wait_for_timeout(80)
    out["A1b_lista"] = s.ev(LISTA)
    K.press("Enter"); s.page.wait_for_timeout(200); pas("A1c_order_ales", {"val": s.ev(VAL)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("A1d_enter", {"A": col("A"), "B": col("B")})
    K.press("Tab"); s.page.wait_for_timeout(100); pas("A1e_tab_dupa", {})
    # A2: Order nivelul 0 cu mouse-ul, apoi Enter
    proaspat(); opensort()
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="0"] [data-lh-tip="ComboBox"][data-lh-eticheta="Sort by"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(3)'); s.page.wait_for_timeout(200)
    pas("A2a_sortby_mouse", {"val": s.ev(VAL)})
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="0"] [data-lh-tip="ComboBox"][data-lh-eticheta="Order"]'); s.page.wait_for_timeout(200)
    out["A2b_lista"] = s.ev(LISTA)
    items = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-lista-el')].filter(e=>e.getClientRects().length).length")
    s.ev("()=>{}")
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(2)'); s.page.wait_for_timeout(200)
    pas("A2c_order_mouse", {"val": s.ev(VAL)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("A2d_enter", {"A": col("A"), "C": col("C")})
    # B: Sort Warning cu tastatura
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    s.page.wait_for_timeout(100); fila("Data")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    pas("B0", {"radio": s.ev(RADIO)})
    K.press("Alt+c"); s.page.wait_for_timeout(150); pas("B1_alt_c", {"radio": s.ev(RADIO)})
    K.press("ArrowUp"); s.page.wait_for_timeout(150); pas("B2_sus", {"radio": s.ev(RADIO)})
    K.press("ArrowDown"); s.page.wait_for_timeout(150); pas("B3_jos", {"radio": s.ev(RADIO)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("B4_enter_continue", {"A": col("A"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("B5_ctrl_z", {"A": col("A"), "C": col("C")})
    # C1: Sort Warning + Alt+S, apoi tastez 7
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300); pas("C1a_alt_s", {"A": col("A"), "C": col("C")})
    K.type("7"); s.page.wait_for_timeout(200); x = s.stare()
    pas("C1b_tastez_7", {"C2": x["celule"].get("C2"), "edit": x.get("ramane_in_editare")})
    # C2: Save As + Alt+S, apoi tastez abc
    proaspat("E2")
    K.press("F12"); s.page.wait_for_timeout(300); K.type("Lucrare"); ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300)
    pas("C2a_alt_s", {"nume": s.stare().get("nume_fisier")})
    K.type("abc"); s.page.wait_for_timeout(200); x = s.stare()
    pas("C2b_tastez_abc", {"E2": x["celule"].get("E2"), "edit": x.get("ramane_in_editare"), "filaHome": s.ev("()=>!!document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"panglica.TabHome\"]')&&getComputedStyle(document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"panglica.TabHome\"]')).display")})
    s.shot("p6_dupa_alt_s_abc.png")
    # C3: Column Width + Alt+C (caseta) apoi Enter, apoi tastez 5
    proaspat("C3")
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="C"], [data-lh-aplicatie] [data-lh-tinta="antet_coloana:C"]', button="right"); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tip="MenuItem"][data-lh-eticheta="Column Width..."]'); s.page.wait_for_timeout(300)
    K.press("Tab"); K.press("Alt+c"); s.page.wait_for_timeout(100); K.type("15"); K.press("Enter"); s.page.wait_for_timeout(250)
    clic_cel(s, "E5"); s.page.wait_for_timeout(650); K.type("5"); K.press("Enter"); s.page.wait_for_timeout(200); x = s.stare()
    pas("C3_dupa_cw", {"E5": x["celule"].get("E5"), "lat": x.get("latimi_coloane")})
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p6.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
