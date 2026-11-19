# -*- coding: utf-8 -*-
"""Critic r9 p1: cele 7 GRAV vechi fara grafice: K1 (focusul pe nivelul 2 din Sort), E1 (Alt+litera in fereastra -> KeyTips),
E2 (Enter pe caseta de bifat / buton radio), E3 (Point dupa Σ), E4 (typo No/Esc -> Edit), E5 (Yes -> vărsare)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60,
       "A5": "Dan", "B5": "VIII B", "C5": 78, "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
DATE = {"A1": 4, "A2": 5, "A3": 6, "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
FOC = "()=>{const a=document.activeElement;const t=a&&a.closest('[data-lh-tip]');const n=a&&a.closest('[data-lh-nivel]');return t?[t.getAttribute('data-lh-tip'),t.getAttribute('data-lh-eticheta'),n?n.getAttribute('data-lh-nivel'):null]:[a&&a.tagName]}"
VAL = """()=>{const d=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^="dialog.SortDialog"]');if(!d)return null;
 return [...d.querySelectorAll('[data-lh-nivel]')].filter(n=>n.getClientRects().length).map(n=>[...n.querySelectorAll('[data-lh-tip="ComboBox"]')].map(c=>{const v=c.querySelector('.lh-ap-x-sort-val,[data-lh-valoare],.lh-ap-text');return (c.getAttribute('data-lh-valoare')||(v?v.textContent:'')||'').trim()}))}"""
MOD = "()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}"
BIFA = "()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"CheckBox\"]');return e?e.getAttribute('aria-checked'):null}"
FX = "()=>{const e=document.querySelector('[data-lh-aplicatie] input[data-lh-tinta=\"bara_formule\"], [data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"] input, [data-lh-aplicatie] .lh-ap-x-fx input');return e?[e.value,e.selectionStart]:null}"
def col(c, n=8):
    x = s.stare()["celule"]
    return [(x.get(c + str(i)) or {}).get("text") for i in range(1, n)]
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"dialog": (x.get("dialog") or {}).get("titlu") if x.get("dialog") else None, "dlg": dialog_vizibil(s), "focus": s.ev(FOC), "ev": ultimele_ev(s, 4),
                 "mesaj": mesaj_tot(s), "keytips": keytips(s)[:8], "mod": s.ev(MOD), "edit": x.get("ramane_in_editare"), "sel": x.get("selectie")}
    if extra: out[nume].update(extra)
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def opensort():
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(350)
def tab_pana(eticheta, nivel, n=18):
    for i in range(n):
        f = s.ev(FOC)
        if len(f) == 3 and f[0] == "ComboBox" and f[1] == eticheta and f[2] == str(nivel): return i
        K.press("Tab"); s.page.wait_for_timeout(50)
    return -1
def alege(eticheta, nivel, jos):
    i = tab_pana(eticheta, nivel); K.press("Alt+ArrowDown"); s.page.wait_for_timeout(120)
    for _ in range(jos): K.press("ArrowDown")
    K.press("Enter"); s.page.wait_for_timeout(200)
    return {"taburi": i, "focus_dupa": s.ev(FOC), "val": s.ev(VAL)}
def proaspat(sel="B3", cont=TAB):
    deschide_cu(s, {"celule": cont, "selectie": sel}); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
try:
    # ---------- K1 tastatura: Sort by Clasa, Add Level, Then by Punctaj, Order Largest to Smallest, Enter
    proaspat(); opensort(); pas("k1_0_deschis", {"val": s.ev(VAL)})
    out["k1_1_sortby"] = alege("Sort by", 0, 2)
    K.press("Alt+a"); s.page.wait_for_timeout(250); out["k1_2_alt_a"] = s.ev(FOC)
    out["k1_3_thenby"] = alege("Then by", 1, 3)
    out["k1_4_order"] = alege("Order", 1, 2)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("k1_5_enter", {"A": col("A"), "B": col("B"), "C": col("C")})
    # K1 mouse
    proaspat(); opensort()
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="0"] [data-lh-tip="ComboBox"][data-lh-eticheta="Sort by"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(2)')
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Add Level"]')
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="1"] [data-lh-tip="ComboBox"][data-lh-eticheta="Then by"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(3)')
    out["k1m_1_focus_thenby"] = s.ev(FOC)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="1"] [data-lh-tip="ComboBox"][data-lh-eticheta="Order"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(2)')
    pas("k1m_2_order", {"val": s.ev(VAL)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("k1m_3_enter", {"A": col("A"), "C": col("C")})
    # K1: trei niveluri, alegere pe nivelul 3, apoi Esc (trebuie sa inchida fereastra, cu eveniment)
    proaspat(); opensort()
    out["k1x_1"] = alege("Sort by", 0, 2)
    K.press("Alt+a"); s.page.wait_for_timeout(200); out["k1x_2"] = alege("Then by", 1, 3)
    K.press("Alt+a"); s.page.wait_for_timeout(200); out["k1x_3"] = alege("Then by", 2, 1)
    ev_reset(s); K.press("Escape"); s.page.wait_for_timeout(250); pas("k1x_4_esc", {"A": col("A")})
    # ---------- E1: Save As + Alt+S, apoi abc
    proaspat("E2")
    K.press("F12"); s.page.wait_for_timeout(300); K.type("Lucrare"); ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300)
    pas("e1_1_alt_s", {"nume": s.stare().get("nume_fisier")})
    K.type("abc"); s.page.wait_for_timeout(200); pas("e1_2_abc", {"E2": s.stare()["celule"].get("E2")})
    K.press("Escape"); s.page.wait_for_timeout(150)
    # E1: Sort Warning + Alt+S, apoi 7
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300); pas("e1_3_sw_alt_s", {"A": col("A"), "C": col("C")})
    K.type("7"); s.page.wait_for_timeout(200); pas("e1_4_tastez_7", {"C2": s.stare()["celule"].get("C2")})
    K.press("Escape"); s.page.wait_for_timeout(150)
    # E1 regres: Alt singur arata literele; Alt, H, 1 = Bold
    proaspat("A1")
    K.press("Alt"); s.page.wait_for_timeout(250); pas("e1_5_alt_singur")
    K.press("h"); s.page.wait_for_timeout(200); K.press("1"); s.page.wait_for_timeout(250)
    pas("e1_6_alt_h_1", {"bold": (s.stare().get("format_celule") or {}).get("A1")})
    # E1 cu Alt+N in Save As (focus pe File name) si Alt+S dupa ce Alt a ramas tinut? (ordine: keydown Alt, keydown s, keyup s, keyup Alt)
    proaspat("E3")
    K.press("F12"); s.page.wait_for_timeout(300); K.type("Lucrare2")
    K.down("Alt"); K.press("s"); s.page.wait_for_timeout(100); K.up("Alt"); s.page.wait_for_timeout(250)
    pas("e1_7_alt_tinut_s", {"nume": s.stare().get("nume_fisier")})
    K.type("x"); s.page.wait_for_timeout(200); pas("e1_8_x", {"E3": s.stare()["celule"].get("E3")})
    K.press("Escape")
    # ---------- E2: Sort, Sort by Nume, Alt+H, Enter
    proaspat(); opensort()
    out["e2_1_sortby"] = alege("Sort by", 0, 1)
    K.press("Alt+h"); s.page.wait_for_timeout(150); out["e2_2_bifa"] = s.ev(BIFA); out["e2_2_val"] = s.ev(VAL); out["e2_2_focus"] = s.ev(FOC)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("e2_3_enter", {"A": col("A"), "B": col("B"), "C": col("C")})
    # E2: Space pe caseta (trebuie sa o comute)
    proaspat(); opensort()
    out["e2_4_sortby"] = alege("Sort by", 0, 1)
    K.press("Alt+h"); s.page.wait_for_timeout(150); K.press(" "); s.page.wait_for_timeout(150); out["e2_5_space_bifa"] = s.ev(BIFA)
    K.press("Escape"); s.page.wait_for_timeout(150)
    # E2: Sort Warning, Alt+C, Enter
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    K.press("Alt+c"); s.page.wait_for_timeout(150); out["e2_6_focus"] = s.ev(FOC)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("e2_7_enter_continue", {"A": col("A"), "C": col("C")})
    # ---------- E3: Σ -> Point; sageata jos; apoi Enter
    proaspat("B8", DATE); fila("Home")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSum"]'); s.page.wait_for_timeout(200); pas("e3_1_sigma", {"B8": s.stare()["celule"].get("B8"), "ecr": ecran(s, "B8")})
    K.press("ArrowDown"); s.page.wait_for_timeout(200); pas("e3_2_jos", {"B8": s.stare()["celule"].get("B8"), "ecr": ecran(s, "B8")})
    K.press("Escape"); s.page.wait_for_timeout(150); pas("e3_3_esc", {"B8": s.stare()["celule"].get("B8")})
    clic_cel(s, "B8"); s.page.wait_for_timeout(650)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSumMenu_Dropdown"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.AutoSum"] [data-lh-eticheta="Average"]'); s.page.wait_for_timeout(200); pas("e3_4_average", {"B8": s.stare()["celule"].get("B8"), "ecr": ecran(s, "B8")})
    K.press("Enter"); s.page.wait_for_timeout(200); pas("e3_5_enter", {"B8": s.stare()["celule"].get("B8")})
    # Σ + Enter direct (drumul lectiei m2-l08)
    clic_cel(s, "C8"); s.page.wait_for_timeout(650)
    K.press("Escape"); clic_cel(s, "B9"); s.page.wait_for_timeout(650)
    # Alt+= cu Point si apoi Enter
    proaspat("B8", DATE); K.press("Alt+="); s.page.wait_for_timeout(200); pas("e3_6_alt_egal", {"B8": s.stare()["celule"].get("B8")})
    K.press("Enter"); s.page.wait_for_timeout(200); pas("e3_7_enter", {"B8": s.stare()["celule"].get("B8")})
    # ---------- E4: typo -> No -> sageata; corectez; Esc
    proaspat("D2", DATE); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250); pas("e4_0_typo", {"D2": s.stare()["celule"].get("D2")})
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="No"]'); s.page.wait_for_timeout(200); pas("e4_1_no", {"ecr": ecran(s, "D2"), "fx": s.ev(FX)})
    K.press("ArrowLeft"); s.page.wait_for_timeout(200); pas("e4_2_stanga", {"ecr": ecran(s, "D2"), "fx": s.ev(FX)})
    K.press("End"); s.page.wait_for_timeout(100)
    for i in range(5): K.press("Backspace")
    s.page.wait_for_timeout(100); pas("e4_3_bksp", {"ecr": ecran(s, "D2")})
    K.press("Enter"); s.page.wait_for_timeout(250); pas("e4_4_enter", {"D2": s.stare()["celule"].get("D2")})
    proaspat("D3", DATE); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250)
    K.press("Escape"); s.page.wait_for_timeout(200); pas("e4_5_esc", {"ecr": ecran(s, "D3")})
    K.press("ArrowLeft"); s.page.wait_for_timeout(200); pas("e4_6_esc_stanga", {"ecr": ecran(s, "D3")})
    K.press("Escape"); s.page.wait_for_timeout(200); pas("e4_7_esc2", {"D3": s.stare()["celule"].get("D3")})
    # ---------- E5: Yes
    proaspat("D2", DATE); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250)
    K.press("Enter"); s.page.wait_for_timeout(250)
    x = s.stare()["celule"]; pas("e5_yes", {"D": {k: x.get(k) for k in ["D2", "D3", "D4", "D5", "D6"]}, "ecr": [ecran(s, "D%d" % i) for i in range(2, 7)]})
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
