# -*- coding: utf-8 -*-
"""Injecteaza lista curata de lectii in sablonul workflow-ului de rescriere."""
import io, json, os

D = os.path.dirname(os.path.abspath(__file__))
LISTA = os.path.join(r"C:\00\Projects\LearningHub", "_campaign",
                     "proba_elevi_2026_09_03", "de_rescris_curat.json")

lectii = json.load(io.open(LISTA, encoding="utf-8"))
sab = io.open(os.path.join(D, "wf_rescriere_template.js"), encoding="utf-8").read()
assert "__LISTA__" in sab
js = sab.replace("__LISTA__", json.dumps(lectii, ensure_ascii=False))
io.open(os.path.join(D, "wf_rescriere.js"), "w", encoding="utf-8", newline="\n").write(js)
print("scris wf_rescriere.js: %d lectii, %.0f KB" % (len(lectii), len(js) / 1024))
