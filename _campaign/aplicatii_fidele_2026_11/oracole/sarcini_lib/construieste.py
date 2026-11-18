"""Construiește referinte/verdicte_vechi.json: verdictele simulatoarelor VECHI (Etapa 0, R8, O6).

    python construieste.py                       # toate paginile din inventar.json -> referinte/verdicte_vechi.json
    python construieste.py --pagini lectii/v/m2-l08 --iesire <fișier>   # o felie, în alt fișier
    python construieste.py --lucratori 8

Fiecare exercițiu simulat din inventar.json (cheia `exercitii` a fiecărei pagini) e jucat de 3 ori, pe pagini proaspete
(vezi joaca.py): o dată cu soluția, de două ori greșit (gresit1 = gresit() al simulatorului; gresit2 = Verifică fără nicio
acțiune, iar unde gresit() lasă simulatorul exact ca la deschidere — aceeași amprentă — gresit2 = rezolvarea fără ultimul
pas, dacă exercițiul are o listă de pași; altfel rămâne „gol” și exercițiul e numărat la „o singură greșeală distinctă”).
Ce se scrie (forma cerută de contract, plus chei de lucru):
  {pagina: {exercitiu: {"solutie": verdict, "gresit1": {"pasi", "verdict"}, "gresit2": {"pasi", "verdict"},
                        "plan": {"solutie": "rezolva", "gresit1": "gresit", "gresit2": "gol"|"partial"},
                        "cale", "tip", "q", "pasi_solutie", ...}}}
  verdict = {"corect": true|false|null, "mesaj": "<textul din #fb>", "scor": "+10 XP …"|null}
  exercițiu nejucabil = {"nejucabil": "<motiv>", "cale", "tip", "q"}; o încercare nejucabilă = {"nejucabil": "<motiv>"}.
Ultima linie: numărul de exerciții nejucabile (0 = toate jucate). Rezumatul complet e sub cheia "_despre".
"""
import argparse
import collections
import datetime
import json
import os
import sys
from pathlib import Path

sys.dont_write_bytecode = True                 # fără __pycache__ în oracole/ (înghețat în repere.lock)
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.path.insert(0, str(Path(__file__).resolve().parent))
import joaca  # noqa: E402


def stare(v):
    c = (v or {}).get("corect")
    return "corect" if c else "gresit" if c is False else "fara_verdict"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pagini", nargs="*", help="subșiruri de cale (felii)")
    ap.add_argument("--iesire", default=str(joaca.REFERINTA))
    ap.add_argument("--radacina", default=None)
    ap.add_argument("--lucratori", type=int, default=8)
    ap.add_argument("--marime", type=int, default=12)
    a = ap.parse_args()
    rad = joaca.radacina(a.radacina)
    inv, lista = joaca.exercitii_inventar(a.pagini)
    t0 = datetime.datetime.now()
    log = lambda s: print(s, flush=True)  # noqa: E731

    # 1. cele 3 încercări obișnuite
    sarcini = [(p, [(eid, cale, None, dict(joaca.PLAN_IMPLICIT)) for eid, cale, _t in ex]) for p, _tp, _ap, ex in lista]
    brut = joaca.ruleaza(rad, sarcini, a.lucratori, a.marime, jurnal=log)

    # 2. unde o greșeală obișnuită nu spune nimic, încerc „fără ultimul pas”, apoi „vecinul”:
    #    a) gresit() lasă simulatorul exact ca „gol” (aceeași amprentă: lecția declară gresit:[]) -> se înlocuiește gresit2
    #    b) „gol” nu primește niciun verdict (fără buton Verifică)                                -> se înlocuiește gresit2
    #    c) gresit() lipsește sau aruncă eroare                                                    -> se înlocuiește gresit1
    de_inlocuit = []   # (pagina, id, cale, fel, motiv)
    for p, _tp, _ap, ex in lista:
        for eid, cale, _t in ex:
            r = brut.get(p, {}).get(eid, {})
            rs, r1, r2 = (r.get("solutie") or {}), (r.get("gresit1") or {}), (r.get("gresit2") or {})
            if "nejucabil" in rs:
                continue
            if "nejucabil" in r1:
                de_inlocuit.append((p, eid, cale, "gresit1", "gresit() lipsește sau dă eroare"))
            if r1.get("amprenta") and r1.get("amprenta") == r2.get("amprenta"):
                de_inlocuit.append((p, eid, cale, "gresit2", "gresit() lasă simulatorul ca la deschidere (= gol)"))
            elif "verdict" in r2 and r2["verdict"]["corect"] is None:
                de_inlocuit.append((p, eid, cale, "gresit2", "gol nu primește niciun verdict"))
    log(f"greșeli de înlocuit: {len(de_inlocuit)} -> încerc rezolvarea fără ultimul pas / a vecinului")
    pe_pag = collections.defaultdict(dict)
    for p, eid, cale, _f, _m in de_inlocuit:
        pe_pag[p][eid] = (eid, cale, None, {"partial": "partial", "vecin": "vecin", "alta_varianta": "alta_varianta"})
    brut_c = joaca.ruleaza(rad, [(p, list(v.values())) for p, v in pe_pag.items()], a.lucratori, a.marime, jurnal=log)
    inlocuiri = {}   # {(pagina, id, fel): (rezultat ales | None, motiv, ultimul încercat)}
    for p, eid, cale, fel, motiv in de_inlocuit:
        r, rc = brut[p][eid], brut_c.get(p, {}).get(eid, {})
        alt = "gresit2" if fel == "gresit1" else "gresit1"
        interzise = {(r.get("solutie") or {}).get("amprenta"), (r.get(alt) or {}).get("amprenta"), None}
        if fel == "gresit2":
            interzise.add((r.get("gresit2") or {}).get("amprenta"))   # trebuie să difere și de „gol”
        ales = None
        for f in ("partial", "vecin", "alta_varianta"):
            x = rc.get(f) or {"nejucabil": "nejucat"}
            if "nejucabil" in x or x["verdict"]["corect"] is None:
                continue
            # alta_varianta = alt buton apăsat (altă greșeală prin construcție), chiar dacă pagina arată la fel după ea
            if (f == "alta_varianta" and x["verdict"]["corect"] is False) or x.get("amprenta") not in interzise:
                ales = x
                break
        inlocuiri[(p, eid, fel)] = (ales, motiv, rc.get("vecin") or rc.get("partial") or {"nejucabil": "nejucat"})

    out, st, motive, distincte = {}, collections.Counter(), collections.Counter(), collections.Counter()
    for pagina, _tp, aplicatie, ex in lista:
        P = out.setdefault(pagina, {})
        for eid, cale, tip in ex:
            st["exercitii"] += 1
            r = brut.get(pagina, {}).get(eid, {})
            rs = r.get("solutie") or {"nejucabil": "nejucat"}
            q = next((x.get("q") for x in r.values() if isinstance(x, dict) and x.get("q")), None)
            if "nejucabil" in rs:
                P[eid] = {"nejucabil": rs["nejucabil"], "cale": cale, "tip": tip, "q": q}
                st["nejucabile"] += 1
                motive[rs["nejucabil"].split(":")[0]] += 1
                continue
            plan = dict(joaca.PLAN_IMPLICIT)
            alese = {"gresit1": r.get("gresit1"), "gresit2": r.get("gresit2")}
            note = {}
            for fel in ("gresit1", "gresit2"):
                if (pagina, eid, fel) not in inlocuiri:
                    continue
                ales, motiv, ultim = inlocuiri[(pagina, eid, fel)]
                if ales:
                    plan[fel] = ales["actiune"]
                    alese[fel] = ales
                    note[fel] = f"{motiv} -> {ales['actiune']}"
                    distincte[f"{fel} = {ales['actiune']} ({motiv})"] += 1
                else:
                    note[fel] = f"{motiv}; nici „fără ultimul pas”, nici „vecinul”, nici „altă variantă” nu dau altă stare cu verdict"
                    distincte[f"{fel} rămâne {plan[fel]}: {motiv}; fără înlocuitor"] += 1
            e = {"cale": cale, "tip": rs.get("tip", tip), "q": q, "aplicatie": aplicatie, "mod": rs.get("mod"),
                 "solutie": rs["verdict"], "pasi_solutie": rs["pasi"], "plan": plan}
            for fel in ("gresit1", "gresit2"):
                x = alese[fel] or {"nejucabil": "nejucat"}
                if "nejucabil" in x:
                    e[fel] = {"nejucabil": x["nejucabil"]}
                    st["incercari_nejucabile"] += 1
                    motive[f"{fel}: " + x["nejucabil"].split(":")[0]] += 1
                else:
                    e[fel] = {"pasi": x["pasi"], "verdict": x["verdict"]}
            if note:
                e["note_greseli"] = note
            a1, a2 = (alese["gresit1"] or {}).get("amprenta"), (alese["gresit2"] or {}).get("amprenta")
            if a1 and a1 == a2 and "alta_varianta" not in (plan["gresit1"], plan["gresit2"]):
                e["o_singura_greseala_distincta"] = True
                st["o_singura_greseala_distincta"] += 1
            r2 = alese["gresit2"]
            if (r.get("gresit1") or {}).get("amprenta") and r["gresit1"].get("amprenta") == rs.get("amprenta"):
                e["gresit1_aceeasi_stare_ca_solutia"] = True
                distincte["gresit1 = aceeași stare ca soluția"] += 1
            st["jucate"] += 1
            st[f"solutie_{stare(rs['verdict'])}"] += 1
            for fel in ("gresit1", "gresit2"):
                if "verdict" in e[fel]:
                    st[f"{fel}_{stare(e[fel]['verdict'])}"] += 1
            errs = sorted({m for x in (rs, r.get("gresit1") or {}, r2 or {}) for m in (x.get("erori") or [])})
            if errs:
                e["erori_js"] = errs[:3]
                st["exercitii_cu_erori_js"] += 1
            P[eid] = e
    for P in out.values():
        for e in P.values():
            for fel, implicit in (("gresit1", "gresit"), ("gresit2", "gol")):
                g = (e.get("plan") or {}).get(fel)
                if g and g != implicit:
                    st[f"{fel}_inlocuit_cu_{g}"] += 1

    dt = (datetime.datetime.now() - t0).total_seconds()
    despre = {
        "_ce": "Verdictele simulatoarelor VECHI pe fiecare exercițiu simulat din inventar.json (O6, R8, Etapa 0). "
               "Scris de oracole/sarcini_lib/construieste.py; rejucat de oracole/oracol_sarcini.py. NU se editează de mână.",
        "generat": t0.strftime("%Y-%m-%d %H:%M"),
        "radacina": str(rad),
        "commit_inventar": inv.get("commit"),
        "durata_s": round(dt),
        "cum": {
            "solutie": "JocMotor.test.rezolva() (rezolvarea declarată de simulator), apoi Verifică",
            "gresit1": "JocMotor.test.gresit() (greșeala tipică declarată de simulator: Q.gresit, Q.tipic & co.), apoi Verifică",
            "gresit2": "'gol': Verifică apăsat fără nicio acțiune (elevul care apasă repede), apoi Verifică",
            "inlocuiri": "plan.gresit1/gresit2 spune ce s-a jucat. O greșeală obișnuită care nu spune nimic e înlocuită cu "
                         "'partial' (rezolvarea fără ultimul pas) sau, dacă nu se poate, 'vecin' (rezolvarea celui mai apropiat "
                         "exercițiu de același tip: elevul repetă sarcina de dinainte), sau 'alta_varianta' (la exercițiile cu "
                         "variante: ultima variantă greșită), doar dacă dă altă stare și un verdict: "
                         "gresit2 când gresit() = gol (lecția declară gresit:[]) sau când gol nu primește verdict (fără buton "
                         "Verifică); gresit1 când gresit() lipsește/aruncă eroare. Motivul stă în note_greseli.",
            "pagina": "proaspătă la fiecare încercare (context nou, localStorage gol), 1366x768, Math.random cu sămânță fixă, "
                      "rețeaua spre altceva decât 127.0.0.1 abandonată, prezenta.js/site-credit.js neîncărcate, sendBeacon oprit",
            "verdict": "#fb .fb: clasa ok/bad -> corect true/false; fără #fb .fb -> corect null; mesaj = textul, spații normalizate",
            "perimetru": "exercițiile simulate din inventar.json (tipuri de aplicație); întrebările simple (choice/tf/order/...) "
                         "nu depind de simulatoare și nu intră",
        },
        "rezumat": {"pagini": len(out), **dict(st)},
        "nejucabile_motive": dict(motive),
        "greseli_distincte": dict(distincte),
    }
    final = {"_despre": despre}
    final.update(out)
    Path(a.iesire).parent.mkdir(parents=True, exist_ok=True)
    Path(a.iesire).write_text(json.dumps(final, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(despre["rezumat"], ensure_ascii=False))
    print(json.dumps(despre["nejucabile_motive"], ensure_ascii=False))
    print(json.dumps(despre["greseli_distincte"], ensure_ascii=False))
    print(a.iesire)
    print(st["nejucabile"])
    return 0 if not st["nejucabile"] else 1


if __name__ == "__main__":
    sys.exit(main())
