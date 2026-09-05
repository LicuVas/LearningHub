# -*- coding: utf-8 -*-
import os, sys, json, collections
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import practice_io as P
REPO = r"C:\00\Projects\LearningHub"
CONTENT = os.path.join(REPO, "content")
tot_ex = tot_fara = 0
lectii = []
for root, dirs, files in os.walk(CONTENT):
    for f in sorted(files):
        if not f.endswith(".html"):
            continue
        p = os.path.join(root, f)
        try:
            d = P.dump(p)
        except Exception as e:
            continue
        if not d:
            continue
        fara = [x for x in d if not x["are_rezolvare"]]
        tot_ex += len(d); tot_fara += len(fara)
        if fara:
            rel = os.path.relpath(p, REPO).replace("\\", "/")
            lectii.append({"cale": rel, "n": len(fara), "total": len(d)})
mod = collections.Counter()
for l in lectii:
    mod["/".join(l["cale"].split("/")[:-1])] += l["n"]
print("exercitii total:", tot_ex, "| fara rezolvare:", tot_fara)
print("lectii cu lipsuri:", len(lectii), "| module distincte:", len(mod))
json.dump(lectii, open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/ramase_rezolvari.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("top module:")
for k, v in mod.most_common(15):
    print("  %4d  %s" % (v, k))
