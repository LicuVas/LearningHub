"""Oracolul buclei „plimbarea novicelui pe jocuri” (26.09.2026): un singur număr pentru /bucla.

  1. _tests/oracol_jocuri.py   — structura pe pași + verificările statice ale porții + proba de sertare
  2. _tests/prereq_jocuri.py   — exerciții care cer cod/taste nepredate, ordinea între jocuri, harta la zi
Fiecare componentă își tipărește numărul pe ultima linie; o componentă prăbușită (fără număr) valorează 1,
ca bucla să nu creadă că e curat. Ultimele trei rânduri sunt pline; ultimul e DOAR totalul.
"""
import subprocess
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

T = Path(__file__).resolve().parent
total = 0
for nume in ("oracol_jocuri.py", "prereq_jocuri.py"):
    r = subprocess.run([sys.executable, str(T / nume)], capture_output=True, text=True, encoding="utf-8", errors="replace")
    linii = [l for l in (r.stdout or "").splitlines() if l.strip()]
    try:
        n = int(linii[-1].strip())
        for l in linii[:-1]:
            if l.startswith(("  - ", "== ", "A ", "B ", "TOTAL", "  PICAT")) and "(semnal" not in l:
                print(f"[{nume}] {l.strip()}")
    except (ValueError, IndexError):
        n = 1
        print(f"[{nume}] PRĂBUȘIT (fără număr pe ultima linie): {(r.stderr or '').strip()[-300:]}")
    print(f"[{nume}] = {n}")
    total += n
print(f"TOTAL probleme: {total}")
print(total)
