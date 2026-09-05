# -*- coding: utf-8 -*-
"""Cate lectii n-au inca CASETA de aprofundare, si in ce module stau.
Aceeasi reteta ca scan_ramase.py, dar pentru T7."""
import os, sys, json, io, collections
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import depth_io as D
R = r"C:\00\Projects\LearningHub"

# Nu scanez discul la intamplare: ma tin de lista deja CURATATA din wf_t7.js.
# Scanarea bruta dadea 637 de pagini, adica si pagini care nu-s lectii - caseta
# "Vrei mai mult?" n-are ce cauta pe ele.
import re
wf = io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_t7.js"),
             encoding="utf-8").read()
CURATE = re.findall(r'"(content/[^"]+\.html)"', wf.split("const TOATE_RAW")[1].split("]")[0])
print("lista curatata din wf_t7.js:", len(CURATE), "lectii")

fara, cu = [], 0
for rel in CURATE:
    if True:
        p = os.path.join(R, rel.replace("/", os.sep))
        if not os.path.exists(p):
            print("  LIPSA pe disc:", rel)
            continue
        try:
            d = D.dump(p)
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        if d.get("are_caseta"):
            cu += 1
        else:
            fara.append(os.path.relpath(p, R).replace("\\", "/"))

mod = collections.Counter("/".join(c.split("/")[:-1]) for c in fara)
print("lectii CU caseta:", cu, "| FARA:", len(fara), "| module distincte:", len(mod))

PLAFON = 6  # lectii pe lot: caseta e scurta, dar e continut nou per lectie
loturi = []
for m in sorted(mod):
    lect = [c for c in fara if c.rsplit("/", 1)[0] == m]
    for i in range(0, len(lect), PLAFON):
        loturi.append({"modul": m, "lectii": lect[i:i + PLAFON]})
for i, x in enumerate(loturi):
    x["id"] = i
print("loturi:", len(loturi), "| max lectii/lot:", max((len(x["lectii"]) for x in loturi), default=0))
io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "loturi_t7b.json"),
        "w", encoding="utf-8").write(json.dumps(loturi, ensure_ascii=False, indent=1))
print("top module:")
for k, v in mod.most_common(8):
    print("  %3d  %s" % (v, k))
