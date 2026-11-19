# -*- coding: utf-8 -*-
"""Critic r9 p6: E4 - dupa No in „We found a typo…”, sageata ← muta cu adevarat cursorul? (← x5, scriu „*”, Enter)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
s = Sesiune(); K = s.page.keyboard
DATE = {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
try:
    deschide_cu(s, {"celule": DATE, "selectie": "D2"}); clic_cel(s, "D2"); s.page.wait_for_timeout(650)
    K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="No"]'); s.page.wait_for_timeout(200)
    for i in range(5): K.press("ArrowLeft")
    K.type("*"); s.page.wait_for_timeout(150); out["dupa_stele"] = ecran(s, "D2")
    K.press("Enter"); s.page.wait_for_timeout(300)
    x = s.stare()["celule"]; out["D2"] = x.get("D2"); out["dlg"] = dialog_vizibil(s); out["ev"] = ultimele_ev(s, 2); out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p6.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1); s.gata()
