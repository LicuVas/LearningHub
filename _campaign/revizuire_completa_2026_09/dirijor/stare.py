# Starea lecțiilor, calculată din plan.json + din dosarele de pe disc (nu din memorie).
# Folosire: python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py [--modul M2]
# Pentru fiecare lecție: PUBLICAT (plan.json) · ÎN LUCRU (dosar cu index.html, nepublicat) · — (nu e început)
# plus ultimul verdict de judecător găsit în _verificare\judecator*.json (grav/major).
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
L = Path(r"C:\00\Projects\LearningHub\lectii")
plan = json.loads((L / "plan.json").read_text(encoding="utf-8"))
doar = sys.argv[sys.argv.index("--modul") + 1] if "--modul" in sys.argv else None


def verdict(dosar):
    """Ultimul raport de judecător (judecatorN.md): ultima linie = numărul de GRAV (convenția din 06_BRIEF_JUDECATOR.md)."""
    md = sorted((dosar / "_verificare").glob("judecator*.md"), key=lambda p: p.stat().st_mtime)
    if not md:
        return "  [fără judecător încă]"
    linii = [x.strip() for x in md[-1].read_text(encoding="utf-8").splitlines() if x.strip()]
    return f"  [{md[-1].name}: GRAV {linii[-1] if linii else '?'}]"


tot = {"PUBLICAT": 0, "ÎN LUCRU": 0, "—": 0}
for cls, x in plan["clase"].items():
    for mod in x.get("module", []):
        mid = mod.get("modul", "")
        if doar and mid != doar:
            continue
        print(f"== clasa {cls.upper()} · {mid} ({mod.get('de_la','')} – {mod.get('pana_la','')})")
        for le in mod.get("lectii", []):
            nr = int(le.get("nr", 0))
            dosar = L / cls / f"{mid.lower()}-l{nr:02d}"
            if le.get("stare") == "publicat":
                st = "PUBLICAT"
            elif (dosar / "index.html").exists():
                st = "ÎN LUCRU"
            else:
                st = "—"
            tot[st] += 1
            v = verdict(dosar) if st == "ÎN LUCRU" else ""
            print(f"  {nr:>2} {st:9} {le.get('titlu','')[:70]}{v}")
print(f"TOTAL: publicat {tot['PUBLICAT']} · în lucru {tot['ÎN LUCRU']} · neîncepute {tot['—']}")
