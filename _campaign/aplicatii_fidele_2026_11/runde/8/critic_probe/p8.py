# -*- coding: utf-8 -*-
"""Critic r8 p8: K3 (taste cu meniul deschis), X10 (graficul), Sort Warning Enter la deschidere, starea „modificat” dupa
gesturi facute DUPA salvare (latime, Column Width, sortare, Wrap, umplere, redenumire), Ctrl+Z/Ctrl+Y pe gesturile unghiului."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60,
       "A5": "Dan", "B5": "VIII B", "C5": 78, "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
MENIU = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-meniu, [data-lh-aplicatie] [role=menu]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-suprafata')||e.className)"
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"dialog": x.get("dialog"), "ev": ultimele_ev(s, 2), "mesaj": mesaj_tot(s), "meniu": s.ev(MENIU), "clip": s.ev("()=>document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-clip, [data-lh-aplicatie] [class*=furnici]').length")}
    if extra: out[nume].update(extra)
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def proaspat(sel="B3", extra=None):
    c = {"celule": TAB, "selectie": sel}
    if extra: c.update(extra)
    deschide_cu(s, c); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
def salvat_apoi(nume, gest):
    """registru numit si salvat; un gest; apoi Ctrl+W: intreaba (modificat) sau inchide."""
    proaspat("B3", {"nume": "Clasa8A"})
    gest()
    s.page.wait_for_timeout(200); K.press("Escape"); s.page.wait_for_timeout(100)
    K.press("Control+w"); s.page.wait_for_timeout(300); x = s.stare()
    out["mod_" + nume] = {"dialog": (x.get("dialog") or {}).get("intrebare") or (x.get("dialog") or {}).get("titlu"), "registru_activ": x.get("registru_activ"), "ev": ultimele_ev(s, 2)}
try:
    # K3
    proaspat("B2")
    clic_cel(s, "B2", button="right"); s.page.wait_for_timeout(250); pas("k3_0_meniu")
    K.press("c"); s.page.wait_for_timeout(200); pas("k3_1_c", {"B2": s.stare()["celule"].get("B2")})
    K.press("Escape"); clic_cel(s, "C2", button="right"); s.page.wait_for_timeout(250)
    K.press("Delete"); s.page.wait_for_timeout(150); pas("k3_2_delete", {"C2": s.stare()["celule"].get("C2")})
    K.press("ArrowDown"); K.press("ArrowDown"); s.page.wait_for_timeout(100); pas("k3_3_sageti", {"sel": s.stare()["selectie"]})
    K.press("Escape"); s.page.wait_for_timeout(150)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila_foii"], [data-lh-aplicatie] [data-lh-tinta^="fila_foii:"]', button="right"); s.page.wait_for_timeout(250)
    K.press("r"); s.page.wait_for_timeout(250); pas("k3_4_r_fila", {"A1": s.stare()["celule"].get("A1"), "focus": focus(s)})
    K.press("Escape"); s.page.wait_for_timeout(150)
    fila("Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]'); s.page.wait_for_timeout(250)
    K.press("ArrowDown"); K.press("ArrowDown"); s.page.wait_for_timeout(80); K.press("Enter"); s.page.wait_for_timeout(200)
    pas("k3_5_borders", {"fmt_C2": s.stare().get("format_celule", {}).get("C2"), "sel": s.stare()["selectie"]})
    # X10
    proaspat("A1")
    fila("Insert"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    pas("x10_grafic")
    s.shot("p8_grafic.png")
    K.press("Escape")
    # Sort Warning Enter la deschidere
    proaspat("C2")
    for i in range(5): K.press("Shift+ArrowDown")
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    out["sw_focus_deschidere"] = focus(s)
    K.press("Enter"); s.page.wait_for_timeout(300); pas("sw_enter", {"A2": s.stare()["celule"].get("A2")})
    # „modificat” dupa gesturi pe un registru salvat
    def lat_trag():
        b = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_coloana\"][data-lh-id=\"C\"]')||document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_coloana:C\"]');const r=e.getBoundingClientRect();return [r.right-1,r.y+r.height/2]}")
        s.page.mouse.move(b[0], b[1]); s.page.mouse.down(); s.page.mouse.move(b[0] + 40, b[1], steps=5); s.page.mouse.up()
    salvat_apoi("latime_tragere", lat_trag)
    def cw():
        clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="C"], [data-lh-aplicatie] [data-lh-tinta="antet_coloana:C"]', button="right"); s.page.wait_for_timeout(250)
        clic_el(s, '[data-lh-aplicatie] [data-lh-tip="MenuItem"][data-lh-eticheta="Column Width..."]'); s.page.wait_for_timeout(250); K.type("20"); K.press("Enter")
    salvat_apoi("column_width", cw)
    def sortaz():
        fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortAscendingExcel"]')
    salvat_apoi("sortare", sortaz)
    def wrap():
        fila("Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="WrapText"]')
    salvat_apoi("wrap", wrap)
    def redenumire():
        clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila_foii"], [data-lh-aplicatie] [data-lh-tinta^="fila_foii:"]', click_count=2); s.page.wait_for_timeout(200); K.type("Note"); K.press("Enter")
    salvat_apoi("redenumire", redenumire)
    def nimic():
        pass
    salvat_apoi("nimic", nimic)
    def umplere():
        fila("Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="CellFillColorPicker"]')
    salvat_apoi("umplere", umplere)
    def foaie_noua():
        clic_el(s, '[data-lh-aplicatie] [data-lh-eticheta="New sheet"], [data-lh-aplicatie] [data-lh-tinta="fila_foii_noua"]')
    salvat_apoi("foaie_noua", foaie_noua)
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p8.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
