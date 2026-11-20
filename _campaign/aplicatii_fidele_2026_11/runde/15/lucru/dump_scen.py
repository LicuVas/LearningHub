import json, glob, os
D = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11"
o = []
for f in sorted(glob.glob(D + "/scenarii/explorer/*.json")):
    s = json.load(open(f, encoding="utf-8"))
    sid = os.path.basename(f)[:-5]
    r = json.load(open(D + "/referinte/scenarii_real/" + sid + ".json", encoding="utf-8"))
    o.append(f"\n##### {sid}  mod={s.get('mod')}  chei_top={list(s.keys())}")
    o.append("start: " + json.dumps(s.get("start"), ensure_ascii=False))
    o.append("pasi: " + json.dumps(s.get("pasi"), ensure_ascii=False))
    o.append("stare_citita: " + json.dumps(s.get("stare_citita"), ensure_ascii=False))
    o.append("REAL chei=" + str(list(r.keys())) + " stare: " + json.dumps(r.get("stare"), ensure_ascii=False))
open(D + "/runde/15/lucru/scenarii_explorer.txt", "w", encoding="utf-8").write("\n".join(o))
s = json.load(open(D + "/scenarii/explorer/explorer_folder_nou.json", encoding="utf-8"))
print(json.dumps({k: v for k, v in s.items() if k not in ("start", "pasi")}, ensure_ascii=False)[:2500])
