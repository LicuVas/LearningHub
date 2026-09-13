"""python build.py split  -> in_NN.txt (120 linii/bucata, fara taieri)
python build.py         -> out_NN.txt din in_NN.txt + spec_NN.txt (linii 'NR|text nou fara indentare', NR = linia GLOBALA)
Indentarea originala se pastreaza; fiecare linie noua trebuie sa fie identica cu originalul dupa scoaterea diacriticelor.
La final lipeste out_* in nou.html."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia3-software\diacritice")
N = 120
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})

if len(sys.argv) > 1 and sys.argv[1] == "split":
    lines = (D / "original.html").read_bytes().decode("utf-8").splitlines(keepends=True)
    for k in range(0, len(lines), N):
        (D / f"in_{k // N + 1:02d}.txt").write_bytes("".join(lines[k:k + N]).encode("utf-8"))
    print("bucati:", (len(lines) + N - 1) // N, "linii:", len(lines))
    sys.exit(0)

bad = 0
changed = 0
parts = []
for inp in sorted(D.glob("in_*.txt")):
    nn = inp.stem[3:]
    start = (int(nn) - 1) * N
    lines = inp.read_bytes().decode("utf-8").splitlines(keepends=True)
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").split("\n"):
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1 - start
            if not 0 <= i < len(lines):
                bad += 1
                print(f"[{nn}:{nr}] linia nu e in bucata")
                continue
            old = lines[i]
            body = old.rstrip("\n")
            ind = body[: len(body) - len(body.lstrip(" \t"))]
            new = ind + txt.rstrip("\r") + "\n"
            # linia poate avea deja diacritice (ex. "Ștergere"): pozitie cu pozitie, doar a->ă etc. e permis
            if len(new) != len(old) or any(a != b and b.translate(HARTA) != a for a, b in zip(old, new)):
                bad += 1
                print(f"[{nn}:{nr}] NU corespunde\n  old: {body.strip()[:300]!r}\n  new: {txt[:300]!r}")
                continue
            if new != old:
                changed += 1
            lines[i] = new
    out = "".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii schimbate:", changed, "linii gresite:", bad)
sys.exit(1 if bad else 0)
