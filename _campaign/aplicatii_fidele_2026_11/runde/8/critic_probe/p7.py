# -*- coding: utf-8 -*-
"""Critic r8 p7: (a) focusul pierdut dupa alegerea din lista pe nivelul 2 (Add Level) al ferestrei Sort; (b) Sort Warning Alt+S, apoi
elevul tasteaza „2” (cifra Undo din Acces rapid); (c) Alt+H (My data has headers) urmat de Enter in Sort."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60,
       "A5": "Dan", "B5": "VIII B", "C5": 78, "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
LISTA = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-lista-el')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()+(e.classList.contains('lh-ap-ales')?'*':''))"
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
        if len(f) == 3 and f[0] == "ComboBox" and f[1] == eticheta and f[2] == str(nivel): return i
        K.press("Tab"); s.page.wait_for_timeout(50)
    return -1
def alege(eticheta, nivel, jos):
    i = tab_pana(eticheta, nivel); K.press("Alt+ArrowDown"); s.page.wait_for_timeout(120)
    for _ in range(jos): K.press("ArrowDown")
    K.press("Enter"); s.page.wait_for_timeout(200)
    return {"taburi": i, "focus_dupa": s.ev(FOC), "val": s.ev(VAL)}
def proaspat(sel="B3"):
    deschide_cu(s, {"celule": TAB, "selectie": sel}); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
try:
    # (a)
    proaspat(); opensort()
    out["a1_sortby0"] = alege("Sort by", 0, 2)
    K.press("Alt+a"); s.page.wait_for_timeout(250); out["a2_dupa_alt_a"] = s.ev(FOC)
    out["a3_thenby1"] = alege("Then by", 1, 3)
    out["a4_order1"] = alege("Order", 1, 2)
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("a5_enter", {"A": col("A"), "B": col("B"), "C": col("C")})
    K.press("Tab"); s.page.wait_for_timeout(100); pas("a6_tab", {})
    K.press("Enter"); s.page.wait_for_timeout(300); pas("a7_enter_dupa_tab", {"A": col("A"), "C": col("C")})
    # (a') acelasi drum cu mouse-ul pe nivelul 2, apoi Enter
    proaspat(); opensort()
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="0"] [data-lh-tip="ComboBox"][data-lh-eticheta="Sort by"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(2)')
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Add Level"]')
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="1"] [data-lh-tip="ComboBox"][data-lh-eticheta="Then by"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(3)')
    out["a8_focus_dupa_thenby_mouse"] = s.ev(FOC)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-nivel="1"] [data-lh-tip="ComboBox"][data-lh-eticheta="Order"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-el:nth-child(2)')
    pas("a9_order1_mouse", {"val": s.ev(VAL)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300); pas("a10_enter", {"A": col("A"), "C": col("C")})
    # (b)
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    K.press("Alt+s"); s.page.wait_for_timeout(300); pas("b1_alt_s", {"A": col("A"), "C": col("C")})
    K.type("2"); s.page.wait_for_timeout(300); pas("b2_tastez_2", {"A": col("A"), "C": col("C"), "C2": s.stare()["celule"].get("C2")})
    # (c)
    proaspat(); opensort()
    out["c1_sortby0"] = alege("Sort by", 0, 1)
    K.press("Alt+h"); s.page.wait_for_timeout(150)
    out["c2_bifa"] = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"CheckBox\"]');return e?e.getAttribute('aria-checked'):null}")
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
    pas("c3_enter", {"bifa": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"CheckBox\"]');return e?e.getAttribute('aria-checked'):null}"), "A": col("A")})
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p7.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
