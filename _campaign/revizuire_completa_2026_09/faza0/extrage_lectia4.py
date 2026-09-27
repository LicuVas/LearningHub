# Extrage lectia nr. 4 (si vecinii 3, 5) din unitati.json, pe clase V-VIII.
import json, sys
sys.stdout.reconfigure(encoding="utf-8")
P = r"C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json"
d = json.load(open(P, encoding="utf-8"))
out = {}
for cls, c in d["clase"].items():
    for u in c["unitati"]:
        for l in u["lectii"]:
            if l["nr"] in (3, 4, 5):
                print(cls, "| unit", u["id"], "|", u["titlu"])
                print("   ", json.dumps(l, ensure_ascii=False))
                if l["nr"] == 4:
                    ukeys = {k: v for k, v in u.items() if k not in ("lectii",)}
                    print("    UNIT KEYS:", json.dumps(ukeys, ensure_ascii=False)[:900])
                    out[cls] = {"unitate": ukeys, "lectie": l}
json.dump(out, open(r"C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/faza0/_lectia4_unitati.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
