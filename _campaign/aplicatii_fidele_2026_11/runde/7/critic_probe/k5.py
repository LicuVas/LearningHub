# -*- coding: utf-8 -*-
"""Critic r7: lista functiilor + Tab in simulator (=AV, =AVER, =SU) si =AVEDEV; acelasi registru ca in com_r7k.py (B2:B4 = 9, 7, 8)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
def cel(a): return s.ev("a=>LH.aplicatii.stare('excel').celule[a]||null", a)
try:
    deschide_cu(s, {"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "C6"})
    for a, pref in [("C6", "=AV"), ("C7", "=AVER"), ("C8", "=SU")]:
        clic_cel(s, a); s.page.wait_for_timeout(650); K.type(pref); K.press("Tab"); K.type("B2:B4)"); K.press("Enter"); s.page.wait_for_timeout(150)
        out[a + " " + pref + "+Tab"] = cel(a)
    clic_cel(s, "C9"); s.page.wait_for_timeout(650); K.type("=AVEDEV(B2:B4)"); K.press("Enter"); out["C9 =AVEDEV(B2:B4)"] = cel("C9")
    out["ev"] = ultimele_ev(s, 2)
finally:
    json.dump(out, open(P + "k5.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps(out, ensure_ascii=False))
    s.gata()
