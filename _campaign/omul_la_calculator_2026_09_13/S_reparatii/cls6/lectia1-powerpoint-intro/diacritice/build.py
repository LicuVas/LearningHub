"""Imparte original.html in in_NN.txt (120 linii), apoi construieste out_NN.txt din spec_NN.txt.
spec: linii 'NR|text nou fara indentare', NR = numarul GLOBAL de linie din original.html.
Fiecare linie noua, fara diacritice, trebuie sa fie identica cu originalul. La final lipeste out_* in nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia1-powerpoint-intro\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
N = 120

orig = (D / "original.html").read_bytes().decode("utf-8").splitlines(keepends=True)
chunks = [orig[i:i + N] for i in range(0, len(orig), N)]
bad = 0
parts = []
for k, ch in enumerate(chunks, 1):
    nn = f"{k:02d}"
    (D / f"in_{nn}.txt").write_bytes("".join(ch).encode("utf-8"))
    lines = list(ch)
    off = (k - 1) * N
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").split("\n"):
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1 - off
            if not (0 <= i < len(lines)):
                bad += 1
                print(f"[{nn}:{nr}] linie in afara bucatii")
                continue
            old = lines[i]
            body = old.rstrip("\r\n")
            eol = old[len(body):]
            ind = body[: len(body) - len(body.lstrip(" \t"))]
            new = ind + txt.rstrip("\r")
            if new.translate(HARTA) != body.translate(HARTA) or any(c not in 'ăâîșțĂÂÎȘȚ' and c!=o for c,o in zip(new, body)) or len(new)!=len(body):
                bad += 1
                print(f"[{nn}:{nr}] NU corespunde\n  old: {body.strip()[:300]!r}\n  new: {txt[:300]!r}")
                continue
            lines[i] = new + eol
    out = "".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("bucati:", len(chunks), "linii gresite:", bad)
sys.exit(1 if bad else 0)
