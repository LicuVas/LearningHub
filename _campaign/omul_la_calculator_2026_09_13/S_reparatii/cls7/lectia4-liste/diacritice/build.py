"""Construieste out_NN.txt din in_NN.txt + spec_*.txt.
Format spec: 'NR|linia noua fara indentare', NR = numarul GLOBAL al liniei in original.html
(spec_NN.txt poate contine orice linii; bucata se deduce din NR: bucata = (NR-1)//120 + 1).
Indentarea originala se pastreaza; linia noua trebuie sa fie identica cu originalul dupa eliminarea diacriticelor.
La final lipeste out_* in nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia4-liste\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
chunks = {}
for inp in sorted(D.glob("in_*.txt")):
    nn = int(inp.stem[3:])
    chunks[nn] = inp.read_bytes().decode("utf-8").split("\n")
bad = changed = 0
seen = set()
for spec in sorted(D.glob("spec_*.txt")):
    for raw in spec.read_bytes().decode("utf-8").split("\n"):
        raw = raw.rstrip("\r")
        if not raw.strip():
            continue
        nr, txt = raw.split("|", 1)
        g = int(nr)
        nn = (g - 1) // 120 + 1
        i = (g - 1) % 120
        lines = chunks[nn]
        old = lines[i]
        ind = old[: len(old) - len(old.lstrip(" \t"))]
        trail = old[len(old.rstrip(" \t\r")):]
        new = ind + txt.rstrip(" \t\r") + trail
        if new.translate(HARTA) != old.translate(HARTA):
            bad += 1
            print(f"[{g}] NU corespunde\n  old: {old.strip()[:300]!r}\n  new: {txt[:300]!r}")
            continue
        if new == old:
            print(f"[{g}] fara schimbare")
        if g in seen:
            print(f"[{g}] dublura in spec")
        seen.add(g)
        lines[i] = new
        changed += 1
parts = []
for nn in sorted(chunks):
    out = "\n".join(chunks[nn])
    (D / f"out_{nn:02d}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii schimbate:", changed, "linii gresite:", bad)
sys.exit(1 if bad else 0)
