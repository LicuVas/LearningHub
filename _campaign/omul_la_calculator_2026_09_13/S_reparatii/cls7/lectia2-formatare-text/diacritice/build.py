"""Construieste out_NN.txt din in_NN.txt + spec_NN.txt (linii 'NR|text nou fara indentare').
NR = numarul liniei in bucata. Fiecare linie noua trebuie sa fie identica cu originalul dupa eliminarea diacriticelor."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia2-formatare-text\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
bad = 0
changed = 0
parts = []
for inp in sorted(D.glob("in_*.txt")):
    nn = inp.stem[3:]
    lines = inp.read_bytes().decode("utf-8").split("\n")
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").split("\n"):
            raw = raw.rstrip("\r")
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1
            old = lines[i]
            cr = "\r" if old.endswith("\r") else ""
            body = old[:-1] if cr else old
            ind = body[: len(body) - len(body.lstrip(" \t"))]
            new = ind + txt + cr
            if new.translate(HARTA) != old.translate(HARTA) or any(ch in "ăâîșțĂÂÎȘȚ" and nc != ch for ch, nc in zip(old, new)):
                bad += 1
                a, b = new.translate(HARTA), old.translate(HARTA)
                k = next((j for j in range(min(len(a), len(b))) if a[j] != b[j]), min(len(a), len(b)))
                print(f"[{nn}:{nr}] NU corespunde la col {k}\n  old: {b[max(0,k-40):k+40]!r}\n  new: {a[max(0,k-40):k+40]!r}")
                continue
            if new == old:
                print(f"[{nn}:{nr}] fara schimbare")
            lines[i] = new
            changed += 1
    out = "\n".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii schimbate:", changed, "linii gresite:", bad)
sys.exit(1 if bad else 0)
