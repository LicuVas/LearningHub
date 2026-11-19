# -*- coding: utf-8 -*-
"""Critic r10 p8: X10 pe scurt - Insert Line or Area Chart ▾ si Chart Design › Add Chart Element (tot mesajul central?);
graficele nu s-au stricat: Change Chart Type › Line › OK, Switch Row/Column pe LUNI, Ctrl+Z."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
LUNI = {"A1": "Luna", "B1": "8A", "C1": "8B", "A2": "septembrie", "B2": 12, "C2": 9, "A3": "octombrie", "B3": 18, "C3": 14, "A4": "noiembrie", "B4": 25, "C4": 20, "A5": "decembrie", "B5": 15, "C5": 22}
s = Sesiune(); K = s.page.keyboard
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def g(): return [(x["tip"], x["serii"], x["categorii"], x.get("pozitie")) for x in s.stare().get("grafice") or []]
try:
    deschide_cu(s, {"celule": LUNI, "selectie": "A1"}); clic_cel(s, "A1"); fila("Insert"); ev_reset(s)
    clic_el(s, '[data-lh-aplicatie] [data-lh-eticheta="Insert Line or Area Chart"], [data-lh-aplicatie] [data-lh-id-mso="ChartTypeLineInsertGallery"]')
    out["1_line_area"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
    gol_mesaj(s); K.press("Escape")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["2_inserat"] = g()
    ev_reset(s); clic_el(s, '[data-lh-aplicatie] [data-lh-eticheta="Add Chart Element"], [data-lh-aplicatie] [data-lh-id-mso="ChartAddElementMenu"]')
    out["3_add_element"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
    gol_mesaj(s)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartSwitchRowColumn"], [data-lh-aplicatie] [data-lh-eticheta="Switch Row/Column"]'); s.page.wait_for_timeout(300)
    out["4_switch"] = g()
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]'); s.page.wait_for_timeout(350)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Line"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]'); s.page.wait_for_timeout(300)
    out["5_line"] = {"g": g(), "ev": ultimele_ev(s, 1), "svg_linii": s.ev("()=>document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic polyline, [data-lh-aplicatie] .lh-ap-x-grafic path').length")}
    K.press("Control+z"); s.page.wait_for_timeout(250); out["6_ctrlz"] = g()
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p8.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
