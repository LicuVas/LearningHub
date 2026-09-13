"""Construieste out_NN.txt din in_NN.txt + spec_NN.txt (linii 'NR|text nou fara indentare').
Indentarea originala se pastreaza; fiecare linie noua trebuie sa fie identica cu originalul fara diacritice.
La final lipeste out_* in nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia4-ergonomie\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
bad = 0
parts = []
for inp in sorted(D.glob("in_*.txt")):
    nn = inp.stem[3:]
    lines = inp.read_bytes().decode("utf-8").split("\n")
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").split("\n"):
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1
            old = lines[i]
            ind = old[: len(old) - len(old.lstrip(" \t"))]
            new = ind + txt
            if new.translate(HARTA) != old.translate(HARTA):
                bad += 1
                print(f"[{nn}:{nr}] NU corespunde\n  old: {old.strip()[:200]!r}\n  new: {txt[:200]!r}")
                continue
            lines[i] = new
    out = "\n".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii gresite:", bad)
sys.exit(1 if bad else 0)
