"""Construieste out_NN.txt din in_NN.txt + spec_NN.txt (linii 'NR|text nou fara indentare', NR = numar de linie in bucata).
Indentarea si capatul de linie originale se pastreaza; linia noua, fara diacritice, trebuie sa fie identica cu originalul.
La final lipeste out_* in nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia2-slide-uri\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
bad = 0
schimbate = 0
parts = []
for inp in sorted(D.glob("in_*.txt")):
    nn = inp.stem[3:]
    lines = inp.read_bytes().decode("utf-8").splitlines(keepends=True)
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").splitlines():
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1
            old = lines[i]
            body = old.rstrip("\r\n")
            eol = old[len(body):]
            ind = body[: len(body) - len(body.lstrip(" \t"))]
            new = ind + txt
            # originalul are deja unele diacritice: comparam ambele fara diacritice, si nu avem voie sa pierdem vreuna existenta
            pierdute = len(new) == len(body) and any(o != n for o, n in zip(body, new) if o in "ăâîșțĂÂÎȘȚ")
            if new.translate(HARTA) != body.translate(HARTA) or pierdute:
                bad += 1
                print(f"[{nn}:{nr}] NU corespunde\n  old: {body.strip()[:200]!r}\n  new: {txt[:200]!r}")
                continue
            if new != body:
                schimbate += 1
            lines[i] = new + eol
    out = "".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii schimbate:", schimbate, "| linii gresite:", bad)
sys.exit(1 if bad else 0)
