"""split: python build.py split  -> in_NN.txt (~120 linii, fara a taia linii)
build: python build.py       -> out_NN.txt din in_NN.txt + spec_NN.txt ('NRGLOBAL|text nou fara indentare'), apoi nou.html.
Fiecare linie noua trebuie sa fie identica cu originalul dupa eliminarea diacriticelor."""
import sys
from pathlib import Path

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls5\lectia1-calculator\diacritice")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})
CH = 120

if len(sys.argv) > 1 and sys.argv[1] == "split":
    lines = (D / "original.html").read_bytes().decode("utf-8").splitlines(keepends=True)
    for k in range(0, len(lines), CH):
        (D / f"in_{k // CH + 1:02d}.txt").write_bytes("".join(lines[k:k + CH]).encode("utf-8"))
    print("bucati:", (len(lines) + CH - 1) // CH)
    sys.exit(0)

bad = 0
parts = []
for inp in sorted(D.glob("in_*.txt")):
    nn = inp.stem[3:]
    base = (int(nn) - 1) * CH
    lines = inp.read_bytes().decode("utf-8").splitlines(keepends=True)
    spec = D / f"spec_{nn}.txt"
    if spec.exists():
        for raw in spec.read_bytes().decode("utf-8").split("\n"):
            if not raw.strip():
                continue
            nr, txt = raw.split("|", 1)
            i = int(nr) - 1 - base
            old = lines[i]
            body = old.rstrip("\n")
            end = old[len(body):]
            ind = body[: len(body) - len(body.lstrip(" \t"))]
            new = ind + txt
            if new.translate(HARTA) != body.translate(HARTA) or "ş" in new or "ţ" in new:
                bad += 1
                print(f"[{nn}:{nr}] NU corespunde\n  old: {body.strip()[:300]!r}\n  new: {txt[:300]!r}")
                continue
            lines[i] = new + end
    out = "".join(lines)
    (D / f"out_{nn}.txt").write_bytes(out.encode("utf-8"))
    parts.append(out)
(D / "nou.html").write_bytes("".join(parts).encode("utf-8"))
print("linii gresite:", bad)
sys.exit(1 if bad else 0)
