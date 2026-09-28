# Dirijorul: trece lecțiile date pe „publicat” (cu insigna „verificat parțial”) în lectii/plan.json.
# Folosire: python dirijor_publica.py v/m1-l04 vi/m1-l04 ...
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
PLAN = Path(r"C:/00/Projects/LearningHub/lectii/plan.json")
d = json.loads(PLAN.read_text(encoding="utf-8"))
cerute = {f"lectii/{a.strip('/')}/" for a in sys.argv[1:]}
gasite = set()
for slug, clasa in d["clase"].items():
    for mo in clasa["module"]:
        for le in mo["lectii"]:
            if le["cale"] in cerute:
                le["stare"] = "publicat"
                le["insigna"] = "verificat parțial"
                gasite.add(le["cale"])
                print("publicat:", le["cale"], "—", le["titlu"])
PLAN.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
lipsa = cerute - gasite
print("negăsite:", sorted(lipsa))
print(len(lipsa))
