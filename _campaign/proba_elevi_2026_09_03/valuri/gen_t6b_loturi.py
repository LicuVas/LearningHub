# -*- coding: utf-8 -*-
import json, collections, os
REPO = r"C:\00\Projects\LearningHub"
L = json.load(open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/ramase_rezolvari.json"), encoding="utf-8"))
mod = collections.OrderedDict()
for l in L:
    mod.setdefault("/".join(l["cale"].split("/")[:-1]), []).append(l)
PLAFON = 18
loturi = []
for m, lect in mod.items():
    cur, n = [], 0
    for l in lect:
        if cur and n + l["n"] > PLAFON:
            loturi.append({"modul": m, "lectii": cur, "n": n}); cur, n = [], 0
        cur.append(l["cale"]); n += l["n"]
    if cur:
        loturi.append({"modul": m, "lectii": cur, "n": n})
for i, x in enumerate(loturi): x["id"] = i
print("loturi:", len(loturi), "| exercitii:", sum(x["n"] for x in loturi),
      "| max/lot:", max(x["n"] for x in loturi), "| lectii max/lot:", max(len(x["lectii"]) for x in loturi))
nonlectia = [c for x in loturi for c in x["lectii"] if not os.path.basename(c).startswith("lectia")]
print("fisiere care NU se numesc lectia*:", len(nonlectia), nonlectia[:6])
json.dump(loturi, open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/valuri/loturi_t6b.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
