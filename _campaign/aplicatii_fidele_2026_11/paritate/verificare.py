"""verificare.py — R4 din contract.md: verificarea independentă, pe orb, a inventarului de paritate.

  python verificare.py esantion     → scrie esantion_<grup>.json (FĂRĂ verdictele agenților) + _esantion_cheie.json
  python verificare.py compara      → citește verif_<grup>.json ale verificatorilor și compară cu verdictele agenților;
                                      scrie verificare_rezultat.json; ultima linie = numărul de dezacorduri (întreg)

Eșantionul: pe fiecare grup ~15 %, minim 8, stratificat pe verdict (cel puțin 2 din fiecare verdict prezent),
cu întâietate funcțiilor cerute de exerciții; aleator cu sămânță fixă (reproductibil).
Grupuri de verificatori: word+powerpoint, excel, explorer-windows, paint (la paint doar descrierea față de codul vechi).
"""
from __future__ import annotations

import json
import random
import sys
from pathlib import Path

P = Path(__file__).resolve().parent
GRUPURI = {"office-text": ["word", "powerpoint"], "excel": ["excel-a", "excel-b"],
           "explorer-windows": ["explorer-windows"], "paint": ["paint"],
           # a doua trecere (21.11 19:10): TOATE „DA”-urile Word / PowerPoint rămase, jucate (agenții le-au judecat din cod)
           "word-da": ["word"], "powerpoint-da": ["powerpoint"]}
ORB = ("id", "aplicatie", "functie", "grup", "gest", "vechi_dovada", "unde")


def incarca(et: str) -> list[dict]:
    f = P / f"{et}.json"
    if not f.is_file():
        return []
    d = json.loads(f.read_text(encoding="utf-8"))
    out = []
    for fn in d.get("functii", []):
        fn = dict(fn)
        fn.setdefault("aplicatie", d.get("aplicatie"))
        fn["biblioteca"] = str(fn.get("biblioteca", "")).upper().replace("Ț", "T")
        out.append(fn)
    return out


def esantion() -> None:
    rnd = random.Random(20261121)
    cheie = {}
    for g, ets in GRUPURI.items():
        toate = [fn for et in ets for fn in incarca(et)]
        if not toate:
            print(g, "— lipsă date")
            continue
        n = max(8, round(len(toate) * 0.15))
        ales: list[dict] = []
        pe_verdict: dict[str, list[dict]] = {}
        for fn in toate:
            pe_verdict.setdefault(fn["biblioteca"], []).append(fn)
        for v, lst in pe_verdict.items():
            lst.sort(key=lambda x: (not x.get("ceruta_de_exercitiu"), rnd.random()))
            ales += lst[:2]
        rest = [fn for fn in toate if fn not in ales]
        rest.sort(key=lambda x: (not x.get("ceruta_de_exercitiu"), rnd.random()))
        # jumătate din rest cerute de exerciții (dacă sunt), restul la întâmplare
        cerute = [x for x in rest if x.get("ceruta_de_exercitiu")]
        altele = [x for x in rest if not x.get("ceruta_de_exercitiu")]
        rnd.shuffle(cerute)
        rnd.shuffle(altele)
        nevoie = max(0, n - len(ales))
        jum = nevoie // 2
        ales += cerute[:jum] + altele[:nevoie - min(jum, len(cerute))]
        ales = ales[:max(n, len(ales))]
        orb = [{k: fn.get(k) for k in ORB} for fn in ales]
        (P / f"esantion_{g}.json").write_text(json.dumps(orb, ensure_ascii=False, indent=1), encoding="utf-8")
        for fn in ales:
            cheie[fn["id"]] = {"grup": g, "biblioteca": fn["biblioteca"], "biblioteca_dovada": fn.get("biblioteca_dovada"),
                               "lipsa": fn.get("lipsa")}
        print(f"{g}: {len(ales)} din {len(toate)}  " +
              " ".join(f"{v}={sum(1 for x in ales if x['biblioteca'] == v)}" for v in sorted(pe_verdict)))
    (P / "_esantion_cheie.json").write_text(json.dumps(cheie, ensure_ascii=False, indent=1), encoding="utf-8")


def esantion_da() -> None:
    """A doua trecere: toate funcțiile cu verdict DA din Word și PowerPoint care n-au fost în primul eșantion."""
    cheie = json.loads((P / "_esantion_cheie.json").read_text(encoding="utf-8"))
    for g, et in (("word-da", "word"), ("powerpoint-da", "powerpoint")):
        ales = [fn for fn in incarca(et) if fn["biblioteca"] == "DA" and fn["id"] not in cheie]
        (P / f"esantion_{g}.json").write_text(json.dumps([{k: fn.get(k) for k in ORB} for fn in ales],
                                                         ensure_ascii=False, indent=1), encoding="utf-8")
        for fn in ales:
            cheie[fn["id"]] = {"grup": g, "biblioteca": fn["biblioteca"], "biblioteca_dovada": fn.get("biblioteca_dovada"),
                               "lipsa": fn.get("lipsa")}
        print(g, len(ales))
    (P / "_esantion_cheie.json").write_text(json.dumps(cheie, ensure_ascii=False, indent=1), encoding="utf-8")


def compara() -> None:
    cheie = json.loads((P / "_esantion_cheie.json").read_text(encoding="utf-8"))
    rez, dez, lipsa = [], 0, 0
    for g in GRUPURI:
        f = P / f"verif_{g}.json"
        if not f.is_file():
            ids = [i for i, c in cheie.items() if c["grup"] == g]
            if ids:
                print(f"{g}: lipsește verif_{g}.json ({len(ids)} de funcții neverificate)")
                lipsa += len(ids)
            continue
        for v in json.loads(f.read_text(encoding="utf-8")):
            c = cheie.get(v.get("id"))
            if not c:
                continue
            vv = str(v.get("biblioteca", "")).upper().replace("Ț", "T")
            desc_ok = v.get("descriere_corecta", True)
            acord = (g == "paint" or vv == c["biblioteca"]) and desc_ok is not False
            if not acord:
                dez += 1
            rez.append({"id": v["id"], "grup": g, "agent": c["biblioteca"], "verificator": vv,
                        "descriere_corecta": desc_ok, "acord": acord, "cum": v.get("cum"),
                        "agent_dovada": c["biblioteca_dovada"], "verificator_dovada": v.get("dovada"),
                        "nota": v.get("nota")})
    vazute = {r["id"] for r in rez}
    nevazute = [i for i, c in cheie.items() if i not in vazute and (P / f"verif_{c['grup']}.json").is_file()]
    if nevazute:
        print(f"fără rând de la verificator: {len(nevazute)} ({', '.join(nevazute[:6])}…)")
        lipsa += len(nevazute)
    tot = len(rez)
    (P / "verificare_rezultat.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"verificate {tot}, acord {tot - dez} ({(100 * (tot - dez) / tot) if tot else 0:.0f} %), neverificate {lipsa}")
    for r in rez:
        if not r["acord"]:
            print(f"  - {r['id']}: agent {r['agent']} / verificator {r['verificator']}"
                  f"{'' if r['descriere_corecta'] is not False else ' / DESCRIERE GREȘITĂ'} — {str(r['nota'])[:140]}")
    print(dez + lipsa)


if __name__ == "__main__":
    {"esantion": esantion, "esantion_da": esantion_da, "compara": compara}[sys.argv[1]]()
