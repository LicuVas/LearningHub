"""Construieste nou.html din original.html + spec_*.txt.

Format spec (numere de linie GLOBALE, 1-based):
  N|textul nou al liniei (fara indentare - se reia indentarea originala)
  N~vechi=>nou            (inlocuire de subsir in linia N; se pot pune mai multe)
Fiecare linie noua, dupa scoaterea diacriticelor, trebuie sa fie identica cu originalul.
"""
import glob
import re
import sys
from pathlib import Path

D = Path(__file__).parent
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T"})

orig = (D / "original.html").read_bytes().decode("utf-8")
lines = orig.split("\n")

# in_NN.txt (bucati de 120 linii)
CH = 120
for k in range(0, len(lines), CH):
    (D / f"in_{k // CH + 1:02d}.txt").write_text("\n".join(lines[k:k + CH]), encoding="utf-8")

new = list(lines)
errs = 0
for sp in sorted(glob.glob(str(D / "spec_*.txt"))):
    for raw in Path(sp).read_text(encoding="utf-8").split("\n"):
        if not raw.strip() or raw.startswith("#"):
            continue
        m = re.match(r"^(\d+)([|~])(.*)$", raw)
        if not m:
            print("format gresit:", sp, raw[:80]); errs += 1; continue
        n, op, rest = int(m.group(1)), m.group(2), m.group(3)
        cur = new[n - 1]
        if op == "|":
            ind = re.match(r"^\s*", lines[n - 1]).group(0)
            cand = ind + rest
        else:
            old, _, nw = rest.partition("=>")
            if cur.count(old) != 1:
                print(f"{sp} L{n}: subsirul apare de {cur.count(old)} ori: {old!r}"); errs += 1; continue
            cand = cur.replace(old, nw)
        if cand.translate(HARTA) != lines[n - 1].translate(HARTA):
            a, b = cand.translate(HARTA), lines[n - 1].translate(HARTA)
            i = next((j for j in range(min(len(a), len(b))) if a[j] != b[j]), min(len(a), len(b)))
            print(f"{sp} L{n}: DIFERA la col {i}:\n  nou: {a[max(0,i-40):i+40]!r}\n  ref: {b[max(0,i-40):i+40]!r}")
            errs += 1
            continue
        new[n - 1] = cand

for k in range(0, len(new), CH):
    (D / f"out_{k // CH + 1:02d}.txt").write_text("\n".join(new[k:k + CH]), encoding="utf-8")
(D / "nou.html").write_text("\n".join(new), encoding="utf-8", newline="")
print("erori:", errs)
sys.exit(1 if errs else 0)
