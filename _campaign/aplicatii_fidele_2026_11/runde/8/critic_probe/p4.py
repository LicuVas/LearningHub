# -*- coding: utf-8 -*-
"""Critic r8 p4: K1 + K2 (tastatura in Sort, Sort Warning, Column Width, Save As, Format Cells; Enter = activat; asistentul §6.3) si sortarea (niveluri, gol, Cancel, Ctrl+Z)."""
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
def col(c):
    x = s.stare()["celule"]
    return [(x.get(c + str(i)) or {}).get("text") for i in range(1, 8)]
def sortul():
    return s.ev("""()=>{const d=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^="dialog.SortDialog"]');if(!d)return null;
      return [...d.querySelectorAll('[data-lh-nivel]')].map(n=>[...n.querySelectorAll('[data-lh-tip="ComboBox"]')].map(c=>(c.textContent||'').trim().slice(0,20)))}""")
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"dialog": x.get("dialog"), "dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s), "sel": x.get("selectie")}
    if extra: out[nume].update(extra)
def opensort():
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Data"], [data-lh-aplicatie] [data-lh-tinta="fila:Data"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(350)
def tab_pana(text, n=14):
    for i in range(n):
        f = focus(s)[1]
        if "ComboBox" in str(f) and text in str(f): return True
        K.press("Tab"); s.page.wait_for_timeout(60)
    return False
try:
    deschide_cu(s, {"celule": TAB, "selectie": "B3"})
    clic_cel(s, "B3"); s.page.wait_for_timeout(650); ev_reset(s)
    opensort(); pas("s0_deschis", {"niv": sortul()})
    seq = []
    for i in range(9):
        K.press("Tab"); s.page.wait_for_timeout(70); seq.append(focus(s)[1])
    out["s1_tab_seq"] = seq
    K.press("Escape"); s.page.wait_for_timeout(150); opensort()
    tab_pana("Sort by"); out["s2_focus_sortby"] = focus(s)
    K.press("Alt+ArrowDown"); s.page.wait_for_timeout(200); out["s2_lista"] = s.ev(LISTA)
    K.press("ArrowDown"); K.press("ArrowDown"); s.page.wait_for_timeout(100); K.press("Enter"); s.page.wait_for_timeout(200)
    pas("s3_ales_clasa", {"niv": sortul()})
    K.press("Alt+a"); s.page.wait_for_timeout(250); pas("s4_alt_a", {"niv": sortul()})
    tab_pana("Then by"); out["s5_focus_thenby"] = focus(s)
    K.press("Alt+ArrowDown"); s.page.wait_for_timeout(150); out["s5_lista"] = s.ev(LISTA)
    K.press("ArrowDown"); K.press("ArrowDown"); K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(150)
    K.press("Tab"); K.press("Tab"); s.page.wait_for_timeout(100); out["s6_focus_order"] = focus(s)
    K.press("Alt+ArrowDown"); s.page.wait_for_timeout(150); out["s6_lista"] = s.ev(LISTA)
    K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(150); pas("s7_niveluri", {"niv": sortul()})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("s8_enter_sort", {"A": col("A"), "B": col("B"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("s9_ctrl_z", {"A": col("A"), "C": col("C")})
    # nivel gol
    clic_cel(s, "B3"); s.page.wait_for_timeout(650); opensort()
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Add Level"]'); s.page.wait_for_timeout(200)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("g1_nivel_gol_enter", {"niv": sortul()}); s.shot("p4_nivel_gol.png")
    K.press("Enter"); s.page.wait_for_timeout(250); pas("g2_ok_eroare", {"niv": sortul()})
    K.press("Escape"); s.page.wait_for_timeout(200); pas("g3_esc_sort", {"A": col("A")})
    # Sort Warning
    clic_cel(s, "C2"); s.page.wait_for_timeout(650)
    for i in range(5): K.press("Shift+ArrowDown")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300); pas("w0_avertisment")
    out["w0_radio"] = s.ev(RADIO)
    K.press("Alt+c"); s.page.wait_for_timeout(150); out["w1_radio_alt_c"] = s.ev(RADIO); pas("w1_alt_c")
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("w2_enter_continue", {"A": col("A"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("w3_ctrl_z", {"A": col("A"), "C": col("C")})
    clic_cel(s, "C2"); s.page.wait_for_timeout(650); K.press("Shift+ArrowDown"); K.press("Shift+ArrowDown")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    K.press("Tab"); K.press("Tab"); K.press("Tab"); s.page.wait_for_timeout(100); out["w4_focus_dupa_3tab"] = focus(s)
    K.press("Escape"); s.page.wait_for_timeout(200); pas("w4_esc", {"C": col("C")})
    # fara antet
    clic_cel(s, "B3"); s.page.wait_for_timeout(650); opensort()
    K.press("Alt+h"); s.page.wait_for_timeout(200)
    out["h1_bifa"] = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"CheckBox\"]');return e?[e.getAttribute('data-lh-eticheta'),e.getAttribute('aria-checked')]:null}")
    pas("h1_alt_h", {"niv": sortul()})
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="0"] [data-lh-tip="ComboBox"]'); s.page.wait_for_timeout(200)
    out["h2_lista_fara_antet"] = s.ev(LISTA)
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(200)
    # Column Width + asistent
    clic_cel(s, "C3"); s.page.wait_for_timeout(650)
    s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'fereastra:OK',indiciu:'Apasa OK'},{tinta:'fereastra:OK',indiciu:'Apasa OK'}],dupaGreseli:2,dupaSecunde:300})}")
    for i in range(2):
        clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="C"], [data-lh-aplicatie] [data-lh-tinta="antet_coloana:C"]', button="right"); s.page.wait_for_timeout(250)
        clic_el(s, '[data-lh-aplicatie] [data-lh-tip="MenuItem"][data-lh-eticheta="Column Width..."]'); s.page.wait_for_timeout(300)
        if i == 0:
            K.type("20"); K.press("Tab"); s.page.wait_for_timeout(80); f1 = focus(s); K.press("Shift+Tab"); s.page.wait_for_timeout(80); out["cw_tab"] = [f1, focus(s)]
        else:
            K.type("12")
        ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(250); pas("cw_enter_%d" % i, {"latimi": s.stare().get("latimi_coloane")})
    out["cw_asistent_pas"] = s.ev("()=>window.__as.pas()")
    out["cw_indicii"] = s.ev("()=>[...document.querySelectorAll('[data-lh-indiciu]')].map(e=>e.getAttribute('data-lh-pentru'))")
    s.ev("()=>window.__as.opreste()")
    # Save As (F12)
    K.press("F12"); s.page.wait_for_timeout(300); K.press("Tab"); K.press("Tab"); s.page.wait_for_timeout(80); out["sa_focus_2tab"] = focus(s)
    K.press("Alt+n"); s.page.wait_for_timeout(100); out["sa_alt_n"] = focus(s)
    K.type("Lucrare"); ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300); pas("sa_alt_s", {"nume": s.stare().get("nume_fisier")})
    # Format Cells
    clic_cel(s, "B3", button="right"); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tip="MenuItem"][data-lh-eticheta="Format Cells..."]'); s.page.wait_for_timeout(300)
    seq = []
    for i in range(5):
        K.press("Tab"); s.page.wait_for_timeout(60); seq.append(focus(s)[1])
    out["fc_tab_seq"] = seq; pas("fc_deschis")
    K.press("Enter"); s.page.wait_for_timeout(250); pas("fc_enter")
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
