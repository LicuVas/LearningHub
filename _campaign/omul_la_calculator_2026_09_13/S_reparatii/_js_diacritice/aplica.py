# -*- coding: utf-8 -*-
"""Aplica spec.tsv (fisier, linie, vechi, nou) pe assets/js. Fiecare 'vechi' trebuie sa apara EXACT o data pe linie
si strip(nou) == vechi. Scrie schimbari_aplicate.tsv. Idempotent: daca 'nou' e deja pe linie, sare."""
import io, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
JS = r"C:\00\Projects\LearningHub\assets\js"
MAP = str.maketrans("ăâîșțĂÂÎȘȚ", "aaistAAIST")

rows = []
for n, raw in enumerate(io.open(os.path.join(HERE, 'spec.tsv'), encoding='utf-8').read().split('\n'), 1):
    if not raw.strip():
        continue
    p = raw.split('\t')
    if len(p) != 4:
        sys.exit(f"spec linia {n}: {len(p)} coloane")
    rows.append((p[0], int(p[1]), p[2], p[3]))

err = 0
by_file = {}
for f, ln, old, new in rows:
    if old.translate(MAP) != old or new.translate(MAP) != old:
        print(f"SPEC GRESIT {f}:{ln}: nou fara diacritice != vechi  [{old}] [{new}]"); err += 1
    by_file.setdefault(f, []).append((ln, old, new))
if err:
    sys.exit(1)

log = []
for f, items in by_file.items():
    path = os.path.join(JS, f)
    data = io.open(path, encoding='utf-8', newline='').read()
    lines = data.split('\n')
    for ln, old, new in items:
        L = lines[ln - 1]
        if L.count(old) == 1:
            lines[ln - 1] = L.replace(old, new)
            log.append(f"{f}:{ln}\t{old}\t{new}")
        elif old not in L and new in L:
            log.append(f"{f}:{ln}\t{old}\t{new}\t(deja)")
        else:
            print(f"NU SE POTRIVESTE {f}:{ln} count={L.count(old)}: {L.strip()[:160]}"); err += 1
    if not err:
        io.open(path, 'w', encoding='utf-8', newline='').write('\n'.join(lines))
io.open(os.path.join(HERE, 'schimbari_aplicate.tsv'), 'w', encoding='utf-8').write('\n'.join(log) + '\n')
print(f"aplicate: {len(log)} in {len(by_file)} fisiere; erori: {err}")
sys.exit(1 if err else 0)
