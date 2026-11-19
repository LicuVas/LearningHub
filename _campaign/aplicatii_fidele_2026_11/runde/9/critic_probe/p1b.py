# -*- coding: utf-8 -*-
"""Critic r9 p1b: lista intreaga a evenimentelor la F12 + nume + Alt+S (E1), ca sa vad daca Alt+S emite un eveniment."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
s = Sesiune(); K = s.page.keyboard
ALL = "()=>(window.__lhAplicatieEv||[]).map(e=>[e.gest,e.actiune,e.tinta,e.activat||null])"
try:
    deschide_cu(s, {"celule": {"A1": 1}, "selectie": "E2"}); clic_cel(s, "E2"); s.page.wait_for_timeout(650)
    K.press("F12"); s.page.wait_for_timeout(300); K.type("Lucrare"); s.page.wait_for_timeout(600); ev_reset(s)
    K.press("Alt+s"); s.page.wait_for_timeout(600); out["dupa_alt_s"] = s.ev(ALL); out["nume"] = s.stare().get("nume_fisier")
    K.type("ab"); s.page.wait_for_timeout(300); out["dupa_ab"] = s.ev(ALL)
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p1b.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1); s.gata()
