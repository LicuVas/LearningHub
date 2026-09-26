"""Oracolul site-ului pentru /bucla: numără problemele MECANIC, pe fațetele care se pot măsura repede (~4 min).

  A. lecțiile: problemele CRITICAL din tools/site_audit.py (JS stricat, index stricat, scripturi lipsă ...)
  B. jocurile: probele care joacă ca un elev (fiecare își tipărește pe ultima linie nr. de probleme)
       proba_varianta_text  - variantele „Exersează” se rezolvă din TEXT (bug 26.09)
       proba_exersare       - exersarea pe variante (serie, stăpânit, greșit respins)
       proba_inapoi         - „Pasul anterior” + Anulare/Refacere
Poarta completă a celor 26 de jocuri (test_joc.py --toate, >10 min) NU e aici; se rulează la final, separat.
Ultimele trei rânduri sunt toate pline, iar ultimul e DOAR numărul total.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

R = Path(__file__).resolve().parents[1]
PY = sys.executable
total = 0
linii = []

try:
    subprocess.run([PY, str(R / "tools" / "site_audit.py")], cwd=str(R), capture_output=True, timeout=300)
    rap = json.loads((R / "tools" / "audit_report.json").read_text(encoding="utf-8"))
    probs = rap.get("issues") if isinstance(rap, dict) else rap
    crit = [p for p in (probs or []) if str(p.get("severity", "")).upper() == "CRITICAL"]
    linii.append(f"A lectii (site_audit CRITICAL): {len(crit)}")
    total += len(crit)
except Exception as e:
    linii.append(f"A lectii: NU s-a putut masura ({e})")
    total += 1

for nume in ("proba_varianta_text", "proba_exersare", "proba_inapoi"):
    try:
        p = subprocess.run([PY, str(R / "jocuri" / "_motor" / f"{nume}.py")], cwd=str(R), capture_output=True,
                           timeout=900, encoding="utf-8", errors="replace")
        rand = [x for x in (p.stdout or "").strip().splitlines() if x.strip()]
        n = int(rand[-1]) if rand and re.fullmatch(r"-?\d+", rand[-1].strip()) else None
        if n is None:
            linii.append(f"B {nume}: NU a tiparit un numar (rc={p.returncode}) - socotit 1")
            n = 1
        else:
            linii.append(f"B {nume}: {n}")
        total += n
    except Exception as e:
        linii.append(f"B {nume}: a picat ({e}) - socotit 1")
        total += 1

print("\n".join(linii))
print(f"TOTAL probleme: {total}")
print(total)
