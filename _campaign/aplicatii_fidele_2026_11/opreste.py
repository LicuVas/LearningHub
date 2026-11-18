# -*- coding: utf-8 -*-
"""Oprirea mecanică a buclei „Aplicațiile fidele” (contract R10; prompt_runda.md, <oprire>). Decide scriptul, nu agentul.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/opreste.py
    python .../opreste.py --fara-prompt          # doar decizia (nu scrie runde/N+1/prompt.md)
    python .../opreste.py --json                 # și decizia ca JSON (pe un rând, înaintea ultimei linii)
    python .../opreste.py --jurnal <f> --dosar <d> --consum-nivel VERDE    # probe (opreste_sim.py)

Citește D/jurnal.jsonl (un rând pe rundă, scris la pasul 10 al rundei): {runda, etapa, aplicatia, unghi, oracole_inainte,
oracole_dupa, porti_inainte, porti_dupa, tinta, reparat, critic_grav_deschise, publicat_nonce, repere_lock_ok} (+ opțional `val`).
  oracole_dupa          {"O1": n, ..., "O9": n} (sau listă de 9 în ordinea O1..O9); -1/null = neconcludent
  porti_dupa            {poarta: n} (n = PROBLEMELE porții, din masurare.json › pentru_jurnal.porti) sau un întreg (suma lor;
                        formă veche, se compară doar totalul); -1/null = neconcludent
  porti_inainte, oracole_inainte   aceleași forme, măsurate la pasul 1 al rundei (pentru REGRES)
  acoperire             opțional, true = rundă `acoperire` (contract, Etapa 0: are voie să crească numerele) — fără REGRES
  critic_grav_deschise  întreg sau listă (GRAV-urile criticului încă deschise după runda asta)
  repere_lock_ok        true/false
  val                   opțional; altfel valul = (etapa, aplicatia) consecutive
Reguli, în ordinea priorității (toate cele care se aplică sunt scrise; prima dă tipul):
  1. JURNAL_STRICAT  un rând nu e JSON                                                   -> OPRESTE
  2. LACAT_RUPT      ultima rundă: repere_lock_ok != true                                -> OPRESTE
  3. NECONCLUDENT    ultima rundă: lipsește un O1-O9 sau porțile, ori valoarea e -1/null; sau o poartă din porti_inainte /
                     din runda precedentă lipsește din porti_dupa -> OPRESTE (blocaj: oracolele sunt înghețate, o rundă de
                     reparație nu le poate repara; o poartă scoasă din jurnal nu „trece”)
  4. REGRES          ultima rundă (dacă nu e `acoperire`): n cu n (17.11.2026, verificare_etapa0.md 3.h, reparația 6) —
                     oricare poartă crește față de porti_inainte SAU față de porti_dupa al rundei precedente (ex. cum_fac
                     41 -> 80: o poartă deja roșie se poate înrăutăți), ori oricare O1-O9 crește față de oracole_inainte
                     (pasul 7 din prompt_runda.md cerea s-o dai înapoi)                  -> OPRESTE
  5. CONVERGENTA     ultima rundă: O1-O9 = 0 și porți = 0, ȘI ultimele 3 runde: 0 GRAV deschise, pe 3 unghiuri diferite
                     -> OPRESTE (urmează T1: Workflow `reprompt`)
  6. PLATOU          ultimele 3 runde: aceleași numere O1-O9 (și nu toate 0) -> OPRESTE (raportezi platoul, nu „gata”)
  7. LIMITA_VAL      6 runde în valul curent                                             -> OPRESTE
  8. BUGET           `python C:/00/AI_0/tools/consum.py --json` -> nivel ROSU            -> OPRESTE
     (consum.py: ultima linie e procentul ferestrei de 5 ore sau -1 când lipsește; NU e nivelul — de aceea citesc „nivel”
     din --json; nivel necunoscut = nu opresc, dar scriu)
  altfel CONTINUA -> scrie D/runde/N+1/prompt.md prin pregateste_runda.py (etapa și aplicația valului curent).
Ieșire: rezumatul, „DECIZIE: X (TIP)”, „MOTIV: …”, iar pe ULTIMA linie doar CONTINUA sau OPRESTE.
Cod 0 = CONTINUA, 1 = OPRESTE, 3 = eroare a scriptului (atunci ultima linie e tot OPRESTE).
"""
import argparse
import json
import os
import subprocess
import sys
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
ORDINE_O = [f"O{i}" for i in range(1, 10)]
UNGHIURI = {"aspect", "gest_tastatura", "stare_finala_erori"}
LIMITA_VAL = 6
CONSUM = Path("C:/00/AI_0/tools/consum.py")
PRIORITATE = ["JURNAL_STRICAT", "LACAT_RUPT", "NECONCLUDENT", "REGRES", "CONVERGENTA", "PLATOU", "LIMITA_VAL", "BUGET"]


def citeste_jurnal(f):
    randuri, stricate = [], []
    if f.exists():
        for i, linie in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            if not linie.strip():
                continue
            try:
                o = json.loads(linie)
                if not isinstance(o, dict):
                    raise ValueError("nu e obiect")
                randuri.append(o)
            except (json.JSONDecodeError, ValueError) as e:
                stricate.append(f"linia {i}: {e}")
    return randuri, stricate


def norm_oracole(v):
    """{O1..O9: int|None}; cheile lipsă rămân lipsă"""
    if isinstance(v, list) and len(v) == 9:
        v = dict(zip(ORDINE_O, v))
    if not isinstance(v, dict):
        return {}
    return {k: v[k] for k in ORDINE_O if k in v}


def valoare_ok(x):
    return isinstance(x, int) and not isinstance(x, bool) and x >= 0


def porti_numar(v):
    """suma problemelor porților (0 = toate curate); None = lipsă sau o poartă neconcludentă.
    17.11.2026: suma lui n, nu numărul porților nenule — o poartă deja roșie trebuie să se poată înrăutăți (3.h)."""
    if isinstance(v, dict):
        if not v or not all(valoare_ok(x) for x in v.values()):
            return None
        return sum(v.values())
    return v if valoare_ok(v) else None


def porti_pe_poarta(v):
    """{poarta: n} dacă porțile sunt pe poartă și toate măsurate; {"(total)": n} pentru forma veche (întreg); None altfel"""
    if isinstance(v, dict):
        return dict(v) if v and all(valoare_ok(x) for x in v.values()) else None
    return {"(total)": v} if valoare_ok(v) else None


def cresteri_porti(ref, acum):
    """porțile al căror n crește de la ref la acum, n cu n; o formă veche (întreg) se compară doar ca total"""
    a, b = porti_pe_poarta(ref), porti_pe_poarta(acum)
    if a is None or b is None:
        return []
    if "(total)" in a or "(total)" in b:
        ta, tb = sum(a.values()), sum(b.values())
        return [("porți (total)", ta, tb)] if tb > ta else []
    return [(k, a[k], b[k]) for k in a if k in b and b[k] > a[k]]


def porti_disparute(ref, acum):
    """porțile prezente (pe poartă) în ref și absente din acum: o poartă scoasă din jurnal nu se socotește trecută"""
    if isinstance(ref, dict) and isinstance(acum, dict):
        return [k for k in ref if k not in acum]
    return []


def regres(randuri):
    """REGRES pe ultima rundă (n cu n): porțile față de porti_inainte și față de runda precedentă; O1-O9 față de oracole_inainte"""
    u = randuri[-1]
    if u.get("acoperire"):
        return []
    rel = []
    for k, x, y in cresteri_porti(u.get("porti_inainte"), u.get("porti_dupa")):
        rel.append(f"poarta {k}: {x} -> {y} în runda {u.get('runda')} (porti_inainte -> porti_dupa)")
    if len(randuri) >= 2:
        p = randuri[-2]
        for k, x, y in cresteri_porti(p.get("porti_dupa"), u.get("porti_dupa")):
            rel.append(f"poarta {k}: {x} -> {y} de la runda {p.get('runda')} la runda {u.get('runda')}")
    oi, od = norm_oracole(u.get("oracole_inainte")), norm_oracole(u.get("oracole_dupa"))
    for k in ORDINE_O:
        if k in oi and k in od and valoare_ok(oi[k]) and valoare_ok(od[k]) and od[k] > oi[k]:
            rel.append(f"{k}: {oi[k]} -> {od[k]} în runda {u.get('runda')} (oracole_inainte -> oracole_dupa)")
    return rel


def grav_numar(v):
    if isinstance(v, list):
        return len(v)
    return v if valoare_ok(v) else None


def cheie_val(r):
    return r.get("val") if r.get("val") is not None else (r.get("etapa"), r.get("aplicatia"))


def nivel_consum(fortat=None):
    if fortat:
        return fortat.upper(), "dat din linia de comandă"
    if os.environ.get("LH_CONSUM_NIVEL"):
        return os.environ["LH_CONSUM_NIVEL"].upper(), "din LH_CONSUM_NIVEL"
    try:
        r = subprocess.run([sys.executable, str(CONSUM), "--json"], capture_output=True, text=True, encoding="utf-8",
                           errors="replace", timeout=90)
        j = json.loads(r.stdout[r.stdout.index("{"):])
        return str(j.get("nivel", "NECUNOSCUT")).upper(), "consum.py --json"
    except Exception as e:  # noqa: BLE001
        return "NECUNOSCUT", f"consum.py n-a răspuns: {str(e)[:120]}"


def decide(randuri, stricate, nivel):
    """-> {decizie, tip, motiv, motive: [(tip, text)], runda_urmatoare, ultim}"""
    motive = []
    if stricate:
        motive.append(("JURNAL_STRICAT", "jurnal.jsonl are rânduri care nu sunt JSON: " + "; ".join(stricate[:3])))
    if not randuri:
        if motive:
            return fin(motive, None, 1)
        return {"decizie": "CONTINUA", "tip": "START", "motiv": "jurnalul nu are încă nicio rundă: urmează runda 1",
                "motive": [], "runda_urmatoare": 1, "ultim": None}
    u = randuri[-1]
    try:
        n_urm = int(u.get("runda")) + 1
    except (TypeError, ValueError):
        n_urm = len(randuri) + 1
    if u.get("repere_lock_ok") is not True:
        motive.append(("LACAT_RUPT", f"runda {u.get('runda')}: repere_lock_ok = {u.get('repere_lock_ok')!r} (reperele înghețate s-au "
                                     "schimbat sau n-au fost verificate) — măsurarea nu mai e pe repere înghețate"))
    od = norm_oracole(u.get("oracole_dupa"))
    lipsa = [k for k in ORDINE_O if k not in od]
    rele = [k for k in od if not valoare_ok(od[k])]
    pn = porti_numar(u.get("porti_dupa"))
    disparute = sorted(set(porti_disparute(u.get("porti_inainte"), u.get("porti_dupa"))
                           + (porti_disparute(randuri[-2].get("porti_dupa"), u.get("porti_dupa")) if len(randuri) >= 2 else [])))
    if lipsa or rele or pn is None or disparute:
        motive.append(("NECONCLUDENT", f"runda {u.get('runda')}: " + "; ".join(x for x in [
            f"lipsesc {', '.join(lipsa)}" if lipsa else "", f"neconcludente {', '.join(rele)}" if rele else "",
            "porțile lipsă/neconcludente" if pn is None else "",
            f"porți măsurate înainte și lipsă din porti_dupa: {', '.join(disparute)}" if disparute else ""] if x)
            + " — blocaj (oracolele sunt înghețate; nu se repară într-o rundă)"))
    rg = regres(randuri)
    if rg:
        motive.append(("REGRES", "n cu n, ceva a crescut: " + "; ".join(rg) + " — reparația se dă înapoi (prompt_runda.md, pasul 7); "
                                 "doar o rundă `acoperire` (suprafețe/scenarii noi, reînghețate după) are voie să crească numerele"))
    ultimele3 = randuri[-3:]
    if not lipsa and not rele and pn is not None and all(od[k] == 0 for k in ORDINE_O) and pn == 0:
        g3 = [grav_numar(r.get("critic_grav_deschise")) for r in ultimele3]
        u3 = [r.get("unghi") for r in ultimele3]
        if len(ultimele3) == 3 and all(g == 0 for g in g3) and len(set(u3)) == 3 and set(u3) <= UNGHIURI:
            motive.append(("CONVERGENTA", f"O1-O9 = 0 și porți = 0 după runda {u.get('runda')}; criticul fără GRAV în rundele "
                                          f"{', '.join(str(r.get('runda')) for r in ultimele3)}, pe unghiurile {', '.join(u3)} — urmează T1 (reprompt)"))
    if len(ultimele3) == 3:
        o3 = [norm_oracole(r.get("oracole_dupa")) for r in ultimele3]
        complete = all(len(o) == 9 and all(valoare_ok(x) for x in o.values()) for o in o3)
        if complete and o3[0] == o3[1] == o3[2] and sum(o3[0].values()) > 0:
            motive.append(("PLATOU", f"aceleași numere O1-O9 în rundele {', '.join(str(r.get('runda')) for r in ultimele3)}: "
                                     + ", ".join(f"{k}={o3[0][k]}" for k in ORDINE_O) + " — raportezi platoul și ce l-ar debloca"))
    v = cheie_val(u)
    in_val = 0
    for r in reversed(randuri):
        if cheie_val(r) != v:
            break
        in_val += 1
    if in_val >= LIMITA_VAL:
        motive.append(("LIMITA_VAL", f"{in_val} runde în valul curent {v} (limita: {LIMITA_VAL})"))
    if nivel == "ROSU":
        motive.append(("BUGET", "consum.py: nivel ROSU — doar finalizări și salvarea stării"))
    if motive:
        return fin(motive, u, n_urm)
    return {"decizie": "CONTINUA", "tip": "CONTINUA",
            "motiv": f"nicio regulă de oprire nu se aplică după runda {u.get('runda')} ({in_val}/{LIMITA_VAL} în val; consum {nivel})",
            "motive": [], "runda_urmatoare": n_urm, "ultim": u}


def fin(motive, u, n_urm):
    motive.sort(key=lambda m: PRIORITATE.index(m[0]))
    return {"decizie": "OPRESTE", "tip": motive[0][0], "motiv": motive[0][1], "motive": motive, "runda_urmatoare": n_urm, "ultim": u}


def main():
    ap = argparse.ArgumentParser(description="CONTINUA / OPRESTE, din jurnal.jsonl")
    ap.add_argument("--jurnal")
    ap.add_argument("--dosar")
    ap.add_argument("--consum-nivel", help="VERDE|GALBEN|ROSU (probe); implicit consum.py --json")
    ap.add_argument("--fara-prompt", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    d = Path(a.dosar).resolve() if a.dosar else AICI
    jf = Path(a.jurnal).resolve() if a.jurnal else d / "jurnal.jsonl"
    randuri, stricate = citeste_jurnal(jf)
    nivel, sursa = nivel_consum(a.consum_nivel)
    r = decide(randuri, stricate, nivel)
    print(f"jurnal: {jf} · runde: {len(randuri)}" + (f" · stricate: {len(stricate)}" if stricate else ""))
    u = r.get("ultim")
    if u:
        od = norm_oracole(u.get("oracole_dupa"))
        print(f"ultima: runda {u.get('runda')} · etapa {u.get('etapa')} · {u.get('aplicatia')} · unghi {u.get('unghi')} · "
              + " ".join(f"{k}={od.get(k)}" for k in ORDINE_O) + f" · porți {u.get('porti_dupa')} · GRAV deschise "
              f"{grav_numar(u.get('critic_grav_deschise'))} · lacăt {u.get('repere_lock_ok')}")
    print(f"consum: {nivel} ({sursa})")
    print(f"DECIZIE: {r['decizie']} ({r['tip']})")
    print(f"MOTIV: {r['motiv']}")
    for t, m in r["motive"][1:]:
        print(f"  și: {t} — {m}")
    if r["decizie"] == "CONTINUA" and not a.fara_prompt:
        cmd = [sys.executable, str(AICI / "pregateste_runda.py"), str(r["runda_urmatoare"]), "--dosar", str(d)]
        if u is None:
            print("  (prima rundă: rulează pregateste_runda.py 1 --etapa <0|B|C|D> [--aplicatia ...] — etapa n-o știu din jurnal)")
        else:
            p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
            linii = [x for x in p.stdout.splitlines() if x.strip()]
            if p.returncode == 0 and len(linii) >= 2:
                print(f"  promptul rundei {r['runda_urmatoare']}: {linii[-2]}")
            else:
                print(f"  ATENȚIE: pregateste_runda.py n-a scris promptul (cod {p.returncode}): {' | '.join(linii[-2:])} {p.stderr[-200:]}")
    if a.json:
        print(json.dumps({k: v for k, v in r.items() if k != "ultim"}, ensure_ascii=False))
    print(r["decizie"])
    return 0 if r["decizie"] == "CONTINUA" else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except Exception:  # noqa: BLE001 — o eroare a decidentului oprește bucla, dar se vede ca eroare (cod 3)
        print("DECIZIE: OPRESTE (EROARE_OPRESTE)")
        print("MOTIV: opreste.py a căzut: " + traceback.format_exc()[-600:].replace("\n", " | "))
        print("OPRESTE")
        sys.exit(3)
