"""Imparte original.html in in_NN.txt (~105 linii), aplica spec.txt (NR global|text fara indentare),
verifica fiecare linie (fara diacritice == original), scrie out_NN.txt si nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia6-proiect\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
orig = (D / "original.html").read_bytes().decode("utf-8").split("\n")
lines = list(orig)
bad = 0
seen = set()
for raw in (D / "spec.txt").read_bytes().decode("utf-8").split("\n"):
    if not raw.strip():
        continue
    nr, txt = raw.split("|", 1)
    i = int(nr) - 1
    if i in seen:
        print("dublura", nr); bad += 1
    seen.add(i)
    old = orig[i]
    ind = old[: len(old) - len(old.lstrip(" \t"))]
    new = ind + txt
    if new.translate(HARTA) != old.translate(HARTA):
        bad += 1
        a, b = new.translate(HARTA), old.translate(HARTA)
        k = next((j for j in range(min(len(a), len(b))) if a[j] != b[j]), min(len(a), len(b)))
        print(f"[{nr}] NU corespunde la col {k}\n  old: {b[max(0,k-40):k+40]!r}\n  new: {a[max(0,k-40):k+40]!r}")
        continue
    if new == old:
        print(f"[{nr}] fara schimbare")
    lines[i] = new
N = 105
chunks = [(s, min(s + N, len(orig))) for s in range(0, len(orig), N)]
outs = []
for n, (s, e) in enumerate(chunks, 1):
    sep = "\n" if e < len(orig) else ""
    (D / f"in_{n:02d}.txt").write_bytes(("\n".join(orig[s:e]) + sep).encode("utf-8"))
    o = "\n".join(lines[s:e]) + sep
    (D / f"out_{n:02d}.txt").write_bytes(o.encode("utf-8"))
    outs.append(o)
(D / "nou.html").write_bytes("".join(outs).encode("utf-8"))
print("linii gresite:", bad, "| linii schimbate:", sum(1 for a, b in zip(orig, lines) if a != b))
sys.exit(1 if bad else 0)
