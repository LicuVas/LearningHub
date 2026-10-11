"""Verifica set_ascuns_m2.json: JSON valid, forma {q, accept, tip}, id-urile din accept exista in catalog,
fiecare fisa NOUA e tinta (primul id din accept) de 1..3 ori, in_afara au accept gol, tipurile cunoscute,
fara intrebari duplicate si fara intrebare identica cu un titlu (normalizat, fara diacritice).
Ultima linie: numarul de probleme (0 = trece)."""
import json
import sys
import unicodedata
from collections import Counter
from pathlib import Path

BAZA = Path(r"C:\00\Projects\LearningHub\_campaign\cum_fac_2026_10")
SET = BAZA / "_ascuns" / "set_ascuns_m2.json"
CATALOG = BAZA / "catalog_titluri.json"
NOI = BAZA / "_unelte" / "m2" / "ids_noi.json"
TIPURI = {"fara_diacritice", "efect", "greseala_tastare", "vorbe_de_acasa", "engleza", "scurt", "lung", "in_afara"}


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return " ".join("".join(c if c.isalnum() else " " for c in s).split())


probleme = []
try:
    setul = json.loads(SET.read_bytes().decode("utf-8"))
except Exception as e:  # JSON invalid
    print("JSON INVALID:", e)
    print(1)
    sys.exit(1)

catalog = json.loads(CATALOG.read_bytes().decode("utf-8"))
ids_catalog = {x["id"] for x in catalog}
titluri = {norm(x["titlu"]) for x in catalog}
noi = json.loads(NOI.read_bytes().decode("utf-8"))

if not isinstance(setul, list):
    probleme.append("setul nu e lista")
    setul = []

tinte = Counter()
tipuri = Counter()
vazute = Counter()
for i, e in enumerate(setul):
    if not isinstance(e, dict) or set(e) != {"q", "accept", "tip"}:
        probleme.append(f"#{i}: forma gresita {e!r}")
        continue
    q, acc, tip = e["q"], e["accept"], e["tip"]
    if not isinstance(q, str) or not q.strip():
        probleme.append(f"#{i}: q gol")
    if not isinstance(acc, list):
        probleme.append(f"#{i}: accept nu e lista")
        continue
    if tip not in TIPURI:
        probleme.append(f"#{i}: tip necunoscut {tip}")
    tipuri[tip] += 1
    vazute[norm(q)] += 1
    if norm(q) in titluri:
        probleme.append(f"#{i}: intrebarea e chiar un titlu: {q}")
    if len(set(acc)) != len(acc):
        probleme.append(f"#{i}: id dublat in accept")
    for a in acc:
        if a not in ids_catalog:
            probleme.append(f"#{i}: id inexistent in catalog: {a}")
    if tip == "in_afara":
        if acc:
            probleme.append(f"#{i}: in_afara cu accept nevid")
    else:
        if not acc:
            probleme.append(f"#{i}: intrebare in materie fara accept")
        elif acc[0] not in noi:
            probleme.append(f"#{i}: tinta (primul id) nu e fisa noua: {acc[0]}")
        else:
            tinte[acc[0]] += 1

for q, n in vazute.items():
    if n > 1:
        probleme.append(f"intrebare duplicata x{n}: {q}")
for nid in noi:
    if nid not in ids_catalog:
        probleme.append(f"id nou lipsa din catalog: {nid}")
    n = tinte.get(nid, 0)
    if not 1 <= n <= 3:
        probleme.append(f"fisa noua tintita de {n} ori: {nid}")

in_materie = sum(v for k, v in tipuri.items() if k != "in_afara")
if in_materie < 90:
    probleme.append(f"doar {in_materie} intrebari in materie (<90)")
if tipuri["in_afara"] != 15:
    probleme.append(f"in_afara = {tipuri['in_afara']} (cerut 15)")

print("total:", len(setul), "| in materie:", in_materie, "| in_afara:", tipuri["in_afara"])
for k in sorted(tipuri, key=lambda k: -tipuri[k]):
    if k != "in_afara":
        print(f"  {k}: {tipuri[k]} ({100 * tipuri[k] / in_materie:.0f}%)")
print("fise noi tintite:", len(tinte), "din", len(noi), "| tinte/fisa:", dict(Counter(tinte.values())))
for p in probleme:
    print("PROBLEMA:", p)
print(len(probleme))
sys.exit(1 if probleme else 0)
