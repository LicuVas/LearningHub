# -*- coding: utf-8 -*-
"""Critic r10 p6: tastele peste celulele VARSATE (E5): Ctrl+↓ / Ctrl+↑ / Ctrl+Shift+↓ (si bara de stare), Alt+= sub ele,
Ctrl+A din D3. Excel real: com_r10k3.json (End xlDown din D2 = D6, End xlUp din D7 = D6, CurrentRegion D3 = D2:D6)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
DATE = {"B1": "Nr", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
FX = "()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');if(!e)return null;const i=e.matches('input,textarea')?e:e.querySelector('input,textarea');return i?i.value:e.textContent}"
BARA = """()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata="bara_stare"] [data-lh-tinta^="bara_stare:"]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').map(e=>e.getAttribute('data-lh-eticheta'))"""
s = Sesiune(); K = s.page.keyboard
def sel(): return s.stare().get("selectie")
def acasa():
    K.press("Escape"); K.press("Control+Home"); s.page.wait_for_timeout(200)
def k(*t, w=150):
    for x in t: K.press(x); s.page.wait_for_timeout(w)
try:
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    clic_cel(s, "D2"); K.type("=SUM(B2:B7)B2:B6"); k("Enter", w=300); k("Enter", w=300)
    out["0_varsat"] = {a: (s.stare()["celule"].get(a) or {}).get("text") for a in ["D2", "D3", "D6", "D7"]}
    clic_cel(s, "D2"); k("Control+ArrowDown"); out["1_ctrl_jos_din_D2"] = sel()
    acasa(); clic_cel(s, "D7"); k("Control+ArrowUp"); out["2_ctrl_sus_din_D7"] = sel()
    acasa(); clic_cel(s, "D2"); k("Control+Shift+ArrowDown"); out["3_ctrl_shift_jos"] = {"sel": sel(), "bara": s.ev(BARA)}
    acasa(); clic_cel(s, "D2"); k("Shift+ArrowDown", "Shift+ArrowDown", "Shift+ArrowDown", "Shift+ArrowDown"); out["3b_shift_D2D6"] = {"sel": sel(), "bara": s.ev(BARA)}
    acasa(); clic_cel(s, "D7"); ev_reset(s); k("Alt+Equal", w=250); out["4_alt_egal_D7"] = {"fx": s.ev(FX), "ev": ultimele_ev(s, 1)}
    k("Enter", w=250); out["4_enter"] = s.stare()["celule"].get("D7")
    k("Control+z")
    acasa(); clic_cel(s, "D3"); k("Control+a"); out["5_ctrl_a_D3"] = sel()
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p6.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
