"""U3: cheia chestionarelor din data-quiz (calea 1) vs raspunsul ales de parcurgerea H_vede (calea 2)
vs raspunsul pe care il da un om din continut (calea 3, scris de mana in RASPUNS_OM)."""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
SRC = Path(r"C:/00/Projects/LearningHub/content/tic/cls5/m1-sisteme/lectia1-calculator.html")
s = SRC.read_text(encoding="utf-8")
qs = re.findall(r"data-quiz='([^']*)'", s) + re.findall(r'data-quiz="([^"]*)"', s)
items = []
for q in qs:
    d = json.loads(html.unescape(q))
    items += d if isinstance(d, list) else [d]

parc = json.loads((L / "parcurgere.json").read_text(encoding="utf-8"))
ales = {}
for p in parc:
    for r in p.get("raspunsuri", []):
        ales[r["intrebare"].strip()] = r["raspuns"].split("\n", 1)[-1].strip()

# calea 3: ce raspunde un om care stie materia (fara sa se uite la cheie)
RASPUNS_OM = [
    "masina electronica",       # 1
    "Cuvintele pe care le tastezi",  # 2
    "Input - Processing - Output",   # 3
    "bec LED",                  # 4
    "portabil",                 # 5
    "Tastatura",                # 6
    "ENIAC",                    # 7 (dar „primul" e discutabil - Colossus 1943-44)
    "Transistorul",             # 8
    "bit < byte",               # 9
    "1024 bytes",               # 10
]
out = []
for i, it in enumerate(items):
    opts = it.get("options", [])
    c = it.get("correct")
    idx = "abcd".index(c) if isinstance(c, str) else int(c)
    cheie = opts[idx]
    q = it["question"].strip()
    lung = max(range(len(opts)), key=lambda k: len(opts[k]))
    out.append({
        "nr": i + 1, "intrebare": q, "cheie_json": cheie,
        "ales_de_parcurgere": ales.get(q, "(negasit)"),
        "om": RASPUNS_OM[i],
        "cheie_eq_parcurgere": ales.get(q, "").lower() == cheie.lower(),
        "om_in_cheie": RASPUNS_OM[i].lower() in cheie.lower(),
        "cheia_e_cea_mai_lunga": lung == idx and len(set(len(o) for o in opts)) > 1,
    })
(L / "u3_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("intrebari:", len(out))
print("cheie == parcurgere:", sum(o["cheie_eq_parcurgere"] for o in out))
print("raspunsul omului in cheie:", sum(o["om_in_cheie"] for o in out))
print("cheia e cea mai lunga varianta:", [o["nr"] for o in out if o["cheia_e_cea_mai_lunga"]])
