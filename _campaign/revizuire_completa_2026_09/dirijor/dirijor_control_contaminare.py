# Proba pozitiva a portii de contaminare: planteaza o bucata secreta, ruleaza poarta, sterge bucata.
import json
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
cheie = json.loads(Path(r"C:/00/Projects/LearningHub_banc/mutanti/partea_2/cheie.json").read_text(encoding="utf-8"))
texte = [m["de_ce_incalca_randul"] for m in cheie if len(m.get("de_ce_incalca_randul") or "") > 90]
tinta = Path(r"C:/00/Projects/LearningHub/_masina/_test_contaminare.md")
try:
    tinta.write_text("nota: " + texte[0][5:85], encoding="utf-8")
    r = subprocess.run([sys.executable, r"C:/00/Projects/LearningHub_banc/banc_contaminare.py"],
                       capture_output=True, text=True, encoding="utf-8", timeout=900)
    ultima = r.stdout.strip().splitlines()[-1]
    print("cu bucata plantata, ultima linie:", ultima)
finally:
    tinta.unlink(missing_ok=True)
print("fisier plantat sters:", not tinta.exists())
