"""Ruleaza poarta de diacritice (--git) pe toate cele 25 de lectii M1. Exit 0 = toate trec."""
import subprocess
import sys
from pathlib import Path

S = Path(__file__).resolve().parent
MOD = {"cls5": "m1-sisteme", "cls6": "m1-prezentari", "cls7": "m1-word-fundamente", "cls8": "m1-excel-fundamente"}
SITE = Path(r"C:\00\Projects\LearningHub")
bad = n = 0
for cls, mod in MOD.items():
    for f in sorted((SITE / "content" / "tic" / cls / mod).glob("lectia*.html")):
        rel = f"content/tic/{cls}/{mod}/{f.name}"
        r = subprocess.run([sys.executable, str(S / "D_poarta_diacritice.py"), "--git", rel], capture_output=True, text=True, encoding="utf-8", errors="replace")
        n += 1
        last = [x for x in r.stdout.strip().splitlines() if x.strip()]
        dens = next((x for x in last if x.startswith("diacritice")), "?")
        print(f"{'OK  ' if r.returncode == 0 else 'PICA'} {rel:62} {dens}")
        if r.returncode:
            bad += 1
            print("   " + "\n   ".join(last[-6:]))
print(f"\n{n - bad}/{n} trec")
sys.exit(1 if bad else 0)
