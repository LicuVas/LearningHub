# -*- coding: utf-8 -*-
"""Injecteaza lista de lectii in sablonul workflow-ului T7."""
import io, json, os

D = os.path.dirname(os.path.abspath(__file__))
lista = json.load(io.open(os.path.join(D, "t7_lista.json"), encoding="utf-8"))
sab = io.open(os.path.join(D, "wf_t7_template.js"), encoding="utf-8").read()
assert "__LISTA__" in sab
js = sab.replace("__LISTA__", json.dumps(lista, ensure_ascii=False))
io.open(os.path.join(D, "wf_t7.js"), "w", encoding="utf-8", newline="\n").write(js)
print("scris wf_t7.js: %d lectii, %.0f KB" % (len(lista), len(js) / 1024))
