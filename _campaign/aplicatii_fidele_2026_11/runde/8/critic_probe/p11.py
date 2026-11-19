# -*- coding: utf-8 -*-
"""Critic r8 p11: regresul celor inchise in r7 atinse de runda (X7: lista Borders desenata acum din referinta; X1, X6)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
try:
    deschide_cu(s, {"celule": {"B2": 9, "B3": 7, "C2": 1, "C3": 2}, "selectie": "B2"})
    clic_cel(s, "B2"); s.page.wait_for_timeout(650); K.press("Shift+ArrowDown"); K.press("Shift+ArrowRight")
    fila("Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]'); s.page.wait_for_timeout(250)
    out["randuri"] = s.ev("()=>{const m=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"lista.Borders\"]');return m?[...m.querySelectorAll('[data-lh-tip=\"MenuItem\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta')):null}")
    s.shot("p11_borders.png")
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.Borders"] [data-lh-eticheta="All Borders"]'); s.page.wait_for_timeout(200)
    x = s.stare(); out["all_borders"] = {a: (x.get("format_celule", {}).get(a) or {}).get("borduri") for a in ["B2", "C3"]}; out["ev_all"] = ultimele_ev(s, 1)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]'); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.Borders"] [data-lh-eticheta="More Borders..."]'); s.page.wait_for_timeout(250)
    out["more_borders"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s), "dlg": dialog_vizibil(s)}
    K.press("Escape")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="CellFillColorPicker"]'); s.page.wait_for_timeout(200)
    out["fill"] = (s.stare().get("format_celule", {}).get("B2") or {}).get("umplere")
    clic_cel(s, "D2"); s.page.wait_for_timeout(650); K.type("=25/3"); K.press("Enter"); s.page.wait_for_timeout(150)
    clic_cel(s, "D3"); s.page.wait_for_timeout(650); K.type("=DACĂ(B3<9;10;20)"); K.press("Enter"); s.page.wait_for_timeout(150)
    x = s.stare(); out["x1_x6"] = {a: x["celule"].get(a) for a in ["D2", "D3"]}; out["ecran"] = {a: ecran(s, a) for a in ["D2", "D3"]}
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p11.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
