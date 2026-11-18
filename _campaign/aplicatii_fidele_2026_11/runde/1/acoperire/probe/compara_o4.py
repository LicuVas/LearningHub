# -*- coding: utf-8 -*-
"""Dovada 2: O4 nou vs. iesiri_pornire (Explorer + alte aplicatii) si iesiri (Word, dupa biblioteca)."""
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
D = Path(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11")
PORNIRE = D / "runde/1/iesiri_pornire/O4/oracol_comportament.json"
DUPA = D / "runde/1/iesiri/O4/oracol_comportament.json"
NOU = Path(sys.argv[1]) if len(sys.argv) > 1 else D / "runde/1/acoperire/iesiri/O4/oracol_comportament.json"


def incarca(f):
    r = json.loads(f.read_text(encoding="utf-8"))
    return r, {s["id"]: s for s in r["scenarii"]}


def semn(s):
    """ce conteaza la numarare: verdict, pondere (chei necitite), diferentele (cheie+valori), ecranul, neexecutabil la fara_real"""
    return {"verdict": s.get("verdict"), "pondere": s.get("pondere"),
            "diferente": sorted(json.dumps(d, sort_keys=True, ensure_ascii=False) for d in s.get("diferente", [])),
            "ecran": sorted(json.dumps(d, sort_keys=True, ensure_ascii=False) for d in s.get("ecran", [])),
            "neexec_la_fara_real": bool(s.get("neexecutabil"))}


rp, P = incarca(PORNIRE)
rd, A = incarca(DUPA)
rn, N = incarca(NOU)
print("numere pornire:", rp["numere"])
print("numere dupa   :", rd["numere"])
print("numere NOU    :", rn["numere"])
assert set(P) == set(A) == set(N), "seturi de scenarii diferite"
rau = 0
pe_app = {}
for sid in sorted(N):
    app = N[sid].get("aplicatie")
    ref, sursa = (A[sid], "dupa") if app == "word" else (P[sid], "pornire")
    ok = semn(N[sid]) == semn(ref)
    pe_app.setdefault((app, sursa), [0, 0])
    pe_app[(app, sursa)][0 if ok else 1] += 1
    if not ok:
        rau += 1
        print("DIFERA", sid, app, "fata de", sursa)
        print("   ref:", semn(ref), "| motor/pagina:", ref.get("motor"), ref.get("pagina"), (ref.get("eroare") or "")[:160])
        print("   nou:", semn(N[sid]), "| motor/pagina:", N[sid].get("motor"), N[sid].get("pagina"), (N[sid].get("eroare") or "")[:160])
for (app, sursa), (ok, ko) in sorted(pe_app.items(), key=str):
    print(f"  {app:10} comparat cu {sursa:7}: {ok} identice, {ko} diferite")
from collections import Counter
print("verdicte Explorer NOU:", dict(Counter(N[s]["verdict"] for s in N if N[s].get("aplicatie") == "explorer")),
      "· motoare:", dict(Counter(N[s].get("motor") for s in N if N[s].get("aplicatie") == "explorer")))
print("verdicte Word NOU:", dict(Counter(N[s]["verdict"] for s in N if N[s].get("aplicatie") == "word")))
# totalul asteptat calculat din scenariile de referinta (Explorer+altele din pornire, Word din dupa)
nd = nep = nf = nec = 0
for sid in N:
    s = A[sid] if N[sid].get("aplicatie") == "word" else P[sid]
    if s.get("verdict") == "diferente":
        nd += len(s.get("diferente", []))
    if s.get("verdict") == "neexecutabil" or (s.get("verdict") == "fara_real" and s.get("neexecutabil")):
        nep += s.get("pondere", 1)
    if s.get("verdict") == "fara_real":
        nf += 1
    nec += len(s.get("ecran", []))
print(f"total ASTEPTAT (Explorer+altele ca la pornire, Word ca dupa) = {nd}+{nep}+{nf}+{nec} = {nd + nep + nf + nec}; NOU = {rn['numere']['total']}")
print("scenarii care difera de referinta lor:", rau)
print(rau)
