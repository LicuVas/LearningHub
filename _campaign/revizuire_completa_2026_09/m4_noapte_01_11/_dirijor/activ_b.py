import json, sys, io, os, glob
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
base = r"C:\00\Projects\Info_Gimnaziu_2026\data"
d = json.load(open(base + r"\activitati_lectii_V_VI.json", encoding="utf-8"))
for t, v in d.items():
    if t.startswith("Datele: de intrare") or t.startswith("Evaluare sumativă: structuri repetitive") or t.startswith("Expresii"):
        print("###", t); print(json.dumps(v, ensure_ascii=False)); print()
# teste de unitate existente
for root in [r"C:\00\Projects\Info_Gimnaziu_2026\livrari", r"C:\00\Projects\Info_Gimnaziu_2026\materiale", r"C:\00\Projects\Info_Gimnaziu_2026\instrumente"]:
    for p in glob.glob(root + r"\**\*", recursive=True):
        n = os.path.basename(p).lower()
        if ("test" in n or "barem" in n) and ("vi" in n or "u3" in n):
            print("fisier:", p)
print("gata")
