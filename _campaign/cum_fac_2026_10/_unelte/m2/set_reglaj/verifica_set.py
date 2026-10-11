"""Verifica set_dezvoltare_m2.json: JSON valid, id-uri din catalog, fiecare fisa noua tintita 1-2 ori,
>=80 intrebari in materie, 40 in afara, nicio intrebare copiata din titlu. Ultima linie: numarul de probleme."""
import collections
import difflib
import json
import sys
import unicodedata
from pathlib import Path

LH = Path(r"C:\00\Projects\LearningHub")
SET = LH / "cum-fac" / "_teste" / "set_dezvoltare_m2.json"
CATALOG = LH / "cum-fac" / "_teste" / "catalog_titluri.json"
NOI = LH / "_campaign" / "cum_fac_2026_10" / "_unelte" / "m2" / "ids_noi.json"
NOI_EXTRA = ["windows-inchidere-meniu-start", "windows-inchidere-meniu-esc"]


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


probleme = []
try:
    setul = json.loads(SET.read_text(encoding="utf-8"))
except Exception as e:  # JSON invalid
    print("JSON INVALID:", e)
    print(1)
    sys.exit(1)

catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
titluri = {x["id"]: x["titlu"] for x in catalog}
noi = list(json.loads(NOI.read_text(encoding="utf-8"))) + NOI_EXTRA

if not isinstance(setul, list):
    probleme.append("setul nu e lista")
tinte = collections.Counter()
aparitii = collections.Counter()
tipuri = collections.Counter()
vazute = set()
in_materie = in_afara = 0
for i, r in enumerate(setul):
    if set(r) != {"q", "accept", "tip"}:
        probleme.append(f"#{i}: chei {sorted(r)}")
    q, acc, tip = r.get("q", ""), r.get("accept", []), r.get("tip", "")
    tipuri[tip] += 1
    if norm(q) in vazute:
        probleme.append(f"#{i}: intrebare dublata: {q}")
    vazute.add(norm(q))
    for a in acc:
        if a not in titluri:
            probleme.append(f"#{i}: id inexistent in catalog: {a}")
        aparitii[a] += 1
    if tip == "in_afara":
        in_afara += 1
        if acc:
            probleme.append(f"#{i}: in_afara cu accept nevid")
        continue
    if not acc:
        probleme.append(f"#{i}: in materie fara accept")
        continue
    if acc[0] in noi:
        in_materie += 1
        tinte[acc[0]] += 1
    else:
        probleme.append(f"#{i}: tinta (primul accept) nu e fisa noua: {acc[0]}")
    # nu copia titlurile: asemanare mare cu titlul oricarei fise acceptate
    for a in acc:
        if a in titluri:
            rap = difflib.SequenceMatcher(None, norm(q), norm(titluri[a])).ratio()
            if rap > 0.75:
                probleme.append(f"#{i}: prea aproape de titlu ({rap:.2f}): {q!r} ~ {titluri[a]!r}")

for fid in noi:
    if fid not in titluri:
        probleme.append(f"fisa noua lipsa din catalog: {fid}")
    if tinte[fid] < 1:
        probleme.append(f"fisa noua netintita: {fid}")
    if tinte[fid] > 2:
        probleme.append(f"fisa noua tintita de {tinte[fid]} ori: {fid}")
if in_materie < 80:
    probleme.append(f"doar {in_materie} intrebari in materie (< 80)")
if in_afara != 40:
    probleme.append(f"{in_afara} intrebari in afara (trebuie 40)")

print(f"intrebari total: {len(setul)}  in materie: {in_materie}  in afara: {in_afara}")
print(f"fise noi: {len(noi)}  tintite: {sum(1 for f in noi if tinte[f])}  "
      f"tintite de 2 ori: {sum(1 for f in noi if tinte[f] == 2)}  o data: {sum(1 for f in noi if tinte[f] == 1)}")
print(f"cu mai multe raspunsuri bune: {sum(1 for r in setul if len(r.get('accept', [])) > 1)}")
print("tipuri:", dict(tipuri))
for p in probleme:
    print("PROBLEMA:", p)
print(len(probleme))
