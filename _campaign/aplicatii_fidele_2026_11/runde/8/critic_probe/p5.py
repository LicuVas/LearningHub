# -*- coding: utf-8 -*-
"""Critic r8 p5: Sort doar cu tastatura (2 niveluri), Sort Warning (Alt+C / Alt+E / Enter / Ctrl+Z / Esc),
si ce se intampla cu tastele DUPA un Alt+litera care inchide fereastra (Save As Alt+S, Sort Warning Alt+S)."""
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
def col(c):
    x = s.stare()["celule"]
    return [(x.get(c + str(i)) or {}).get("text") for i in range(1, 8)]
def sortul():
    return s.ev("""()=>{const d=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^="dialog.SortDialog"]');if(!d)return null;
      return [...d.querySelectorAll('[data-lh-nivel]')].map(n=>[...n.querySelectorAll('[data-lh-tip="ComboBox"]')].map(c=>(c.textContent||'').trim().slice(0,20)))}""")
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"dialog": x.get("dialog"), "dlg": dialog_vizibil(s), "focus": s.ev(FOC), "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s), "keytips": keytips(s)[:6]}
    if extra: out[nume].update(extra)
def opensort():
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Data"], [data-lh-aplicatie] [data-lh-tinta="fila:Data"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(350)
def tab_pana(eticheta, nivel, n=16):
    for i in range(n):
        f = s.ev(FOC)
        if len(f) == 3 and f[0] == "ComboBox" and f[1] == eticheta and f[2] == str(nivel): return True
        K.press("Tab"); s.page.wait_for_timeout(50)
    return False
def alege(eticheta, nivel, jos):
    ok = tab_pana(eticheta, nivel)
    K.press("Alt+ArrowDown"); s.page.wait_for_timeout(150); l = s.ev(LISTA)
    for i in range(jos): K.press("ArrowDown")
    s.page.wait_for_timeout(80); l2 = s.ev(LISTA); K.press("Enter"); s.page.wait_for_timeout(150)
    return {"gasit": ok, "lista": l, "ales": l2}
try:
    deschide_cu(s, {"celule": TAB, "selectie": "B3"})
    clic_cel(s, "B3"); s.page.wait_for_timeout(650)
    opensort(); pas("s0", {"niv": sortul()})
    out["s1_sortby"] = alege("Sort by", 0, 2)
    pas("s1", {"niv": sortul()})
    out["s1b_order0"] = alege("Order", 0, 0)
    K.press("Alt+a"); s.page.wait_for_timeout(250); pas("s2_alt_a", {"niv": sortul()})
    out["s3_thenby"] = alege("Then by", 1, 3)
    out["s4_order1"] = alege("Order", 1, 2)
    pas("s4", {"niv": sortul()})
    # Enter: focusul e pe caseta Order (inchisa) -> OK implicit
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("s5_enter", {"A": col("A"), "B": col("B"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("s6_ctrl_z", {"A": col("A"), "C": col("C")})
    K.press("Control+y"); s.page.wait_for_timeout(200); pas("s7_ctrl_y", {"A": col("A"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200)
    # Sort Warning
    clic_cel(s, "C2"); s.page.wait_for_timeout(650)
    for i in range(5): K.press("Shift+ArrowDown")
    s.page.wait_for_timeout(100)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Data"], [data-lh-aplicatie] [data-lh-tinta="fila:Data"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    pas("w0", {"radio": s.ev(RADIO)})
    K.press("Alt+c"); s.page.wait_for_timeout(150); pas("w1_alt_c", {"radio": s.ev(RADIO)})
    K.press("ArrowUp"); s.page.wait_for_timeout(150); pas("w1b_sus", {"radio": s.ev(RADIO)})
    K.press("ArrowDown"); s.page.wait_for_timeout(150)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("w2_enter_continue", {"A": col("A"), "C": col("C")})
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("w3_ctrl_z", {"A": col("A"), "C": col("C")})
    # Sort Warning + Alt+S (butonul Sort...) apoi tastez "7" -> unde ajunge?
    clic_cel(s, "C2"); s.page.wait_for_timeout(650)
    for i in range(5): K.press("Shift+ArrowDown")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300); pas("w4_alt_s", {"A": col("A"), "C": col("C")})
    K.type("7"); s.page.wait_for_timeout(200); pas("w5_tastez_7", {"C2": s.stare()["celule"].get("C2"), "edit": s.stare().get("ramane_in_editare")})
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    K.press("Control+z"); s.page.wait_for_timeout(200)
    # Save As F12 + nume + Alt+S, apoi tastez "abc"
    clic_cel(s, "E2"); s.page.wait_for_timeout(650)
    K.press("F12"); s.page.wait_for_timeout(300); K.type("Lucrare"); ev_reset(s); K.press("Alt+s"); s.page.wait_for_timeout(300)
    pas("sa1_alt_s", {"nume": s.stare().get("nume_fisier")})
    K.type("abc"); s.page.wait_for_timeout(200)
    pas("sa2_tastez_abc", {"E2": s.stare()["celule"].get("E2"), "edit": s.stare().get("ramane_in_editare"), "fila": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila\"][aria-selected=\"true\"], [data-lh-aplicatie] [data-lh-tip=\"TabItem\"].lh-ap-activ');return e?e.getAttribute('data-lh-eticheta'):null}")})
    s.shot("p5_dupa_alt_s_abc.png")
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p5.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
