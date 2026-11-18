# -*- coding: utf-8 -*-
"""Măsurarea unei runde: lacătul reperelor + O1-O9 + porțile, într-un singur număr (16.11.2026, „Aplicațiile fidele”).

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/masoara.py --runda N
    python .../masoara.py --runda N --doar O1,O7,porti       # doar unele (măsurare PARȚIALĂ: nu ține loc de măsurarea rundei)
    python .../masoara.py --runda N --paralel 3              # câte oracole deodată (implicit 1)
    python .../masoara.py --runda N --timeout O6=3600,porti=7200

Pașii:
 1. repere.lock (dacă există) contra sha256 de pe disc (ingheata.verifica). Rupt -> NU măsor: masurare.json + -1.
    Absent -> măsor, dar scriu „lacăt absent” (Etapa 0, înainte de înghețare).
 2. Fiecare oracol O1-O9 și porti.py, cu timp maxim; contractul (porti.citeste_numar): ultima linie = UN întreg, ultimele 3
    rânduri nevide, cod 0/1 potrivit cu numărul. Altfel = NECONCLUDENT (oracol lipsă, depășire, prăbușire, ieșire stricată).
    Mediul: LH_IESIRE = runde/N/iesiri/<O#>/ (detaliile fiecărui oracol), LH_RADACINA trecut mai departe doar dacă e setat.
 3. repere.lock verificat DIN NOU la sfârșit (un oracol care scrie în oracole/ altceva decât <oracol>.json rupe lacătul).
 4. runde/N/masurare.json (măsurarea precedentă din aceeași rundă se păstrează ca masurare_<k>.json).
 5. REGRESUL, n cu n (17.11.2026, reparația 6): fiecare O1-O9 și FIECARE poartă (`porti.pe_poarta`, din porti.json) comparate
    cu măsurarea de referință: `--compara <masurare.json>`, altfel măsurarea precedentă din aceeași rundă (masurare_<k>.json,
    de obicei pasul 1 al rundei), altfel runde/N-1/masurare.json. Orice n care crește se scrie („REGRES: porti.cum_fac 41 -> 80”)
    și intră în masurare.json la `regres`; numărul de pe ultima linie NU se schimbă (decide opreste.py, din jurnal).
`pentru_jurnal.porti` = {poarta: n} (-1 = neconcludentă) — exact ce se scrie în jurnal.jsonl la porti_inainte/porti_dupa.
Ultima linie = suma problemelor (O1-O9 + suma problemelor porților), sau -1 dacă un oracol sau o poartă e NECONCLUDENTĂ ori
lacătul e rupt. Cod 0 = suma 0, 1 = suma > 0, 2 = -1.
"""
import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI))
import porti as P  # noqa: E402  (unelte comune: ruleaza, citeste_numar, curat_tot)

ORACOLE = {
    "O1": ("oracol_central.py", "R1 un singur loc"),
    "O2": ("oracol_identic.py", "R2 aceeași interfață în toate paginile"),
    "O3": ("oracol_ui.py", "R4a interfața față de referința reală"),
    "O4": ("oracol_comportament.py", "R5 comportamentul față de scenariile reale"),
    "O5": ("oracol_evenimente.py", "R6 evenimente pe fiecare gest"),
    "O6": ("oracol_sarcini.py", "R8 verdictele exercițiilor"),
    "O7": ("oracol_text_ui.py", "R11 textul lecțiilor rămâne adevărat"),
    "O8": ("oracol_comenzi_moarte.py", "R12 fără butoane moarte"),
    "O9": ("oracol_asistare.py", "R7 asistarea"),
}
TIMEOUT = {**{k: 1800 for k in ORACOLE}, "porti": 5400}


def importa_ingheata():
    """ingheata.py din dosarul lucrării (unealta); verifica(d) primește dosarul de verificat."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("ingheata", AICI.parent / "ingheata.py")
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def un_oracol(cheie, fisier, timeout, iesiri, extra_env):
    iesire = iesiri / cheie
    iesire.mkdir(parents=True, exist_ok=True)
    r = {"fisier": fisier.name, "timeout_s": timeout}
    if not fisier.exists():
        r.update(stare="NECONCLUDENT", motiv="oracolul lipsește", valoare=None, timp_s=0, cod=None)
        return cheie, r
    env = {"LH_IESIRE": str(iesire), **extra_env}
    if cheie == "porti":
        (iesire / "porti.json").unlink(missing_ok=True)   # n pe poartă se citește DOAR din rularea asta, nu dintr-una veche
    cod, text, timp = P.ruleaza([sys.executable, str(fisier)], timeout, env=env, jurnal=iesire / "iesire.log")
    n, motiv, ultima = P.citeste_numar(text, cod, strict_cod=True)
    randuri = [x for x in text.replace("\r\n", "\n").split("\n") if x.strip()]
    r.update(cod=cod, timp_s=timp, ultima_linie=ultima[:200], coada=[x[:300] for x in randuri[-5:]],
             cale_detalii=randuri[-2].strip()[:300] if len(randuri) >= 2 else "", jurnal=str(iesire / "iesire.log"))
    if len(randuri) >= 3:
        r["rand_informativ"] = randuri[-3].strip()[:300]   # ex. procentul de comenzi simulate la O8
    if n is None:
        r.update(stare="NECONCLUDENT", motiv=motiv, valoare=None)
    else:
        r.update(stare="MASURAT", valoare=n)
    if cheie == "porti":
        r["pe_poarta"] = porti_pe_poarta(iesire / "porti.json")
    return cheie, r


def porti_pe_poarta(f):
    """{poarta: n | None} din porti.json (scris de porti.py în LH_IESIRE); None dacă fișierul lipsește sau e vechi (fără pe_poarta)"""
    try:
        d = json.loads(Path(f).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    pp = d.get("pe_poarta")
    return {k: (v if isinstance(v, int) and not isinstance(v, bool) else None) for k, v in pp.items()} if isinstance(pp, dict) else None


def valori_comparabile(m):
    """dintr-un masurare.json: {"O1": n, ..., "porti.<poarta>": n} — doar valorile măsurate (n >= 0)"""
    out = {}
    for k, r in (m.get("oracole") or {}).items():
        if r.get("stare") == "MASURAT" and isinstance(r.get("valoare"), int) and r["valoare"] >= 0:
            out[k] = r["valoare"]
    p = m.get("porti") or {}
    if isinstance(p.get("pe_poarta"), dict):
        for k, v in p["pe_poarta"].items():
            if isinstance(v, int) and v >= 0:
                out[f"porti.{k}"] = v
    elif p.get("stare") == "MASURAT" and isinstance(p.get("valoare"), int):
        out["porti"] = p["valoare"]          # măsurare veche, fără n pe poartă: se compară doar totalul
    return out


def compara(prec, acum):
    """creșterile n -> n' (n' > n) pe cheile măsurate în AMÂNDOUĂ; plus cheile măsurate înainte și neconcludente acum"""
    a, b = valori_comparabile(prec), valori_comparabile(acum)
    if "porti" in a and "porti" not in b:      # referință veche (doar total) contra măsurare nouă (pe poartă): total cu total
        b["porti"] = sum(v for k, v in b.items() if k.startswith("porti."))
    cresteri = [{"cheie": k, "inainte": a[k], "dupa": b[k]} for k in a if k in b and b[k] > a[k]]
    # „pierdute” = măsurate în referință, ÎNCERCATE acum, dar fără număr (neconcludente); o măsurare parțială nu pierde nimic
    incercate = set(acum.get("oracole") or {})
    p = acum.get("porti")
    if p:
        pp = p.get("pe_poarta")
        incercate |= {"porti"} | ({f"porti.{k}" for k in pp} if isinstance(pp, dict) else {k for k in a if k.startswith("porti.")})
    pierdute = [k for k in a if k not in b and k in incercate]
    return cresteri, pierdute


def regres_fata_de(a, runda_dir, d, prec_aceeasi_runda, rez):
    ref = referinta_comparatie(a, runda_dir, d, prec_aceeasi_runda)
    if ref is None:
        return {"referinta": None, "cresteri": [], "pierdute": [],
                "nota": "nicio măsurare de referință: nici una precedentă în rundă, nici runde/N-1/masurare.json, nici --compara"}
    try:
        prec = json.loads(Path(ref).read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        return {"referinta": str(ref), "cresteri": [], "pierdute": [], "nota": f"referința nu se poate citi: {e}"}
    cresteri, pierdute = compara(prec, rez)
    return {"referinta": str(ref), "cresteri": cresteri, "pierdute": pierdute}


def text_regres(g):
    if not g.get("referinta"):
        return f"regres: — ({g.get('nota')})"
    ref = Path(g["referinta"])
    nume = f"{ref.parent.name}/{ref.name}"
    if g.get("nota"):
        return f"regres față de {nume}: — ({g['nota']})"
    parti = [f"{c['cheie']} {c['inainte']} -> {c['dupa']}" for c in g["cresteri"]]
    parti += [f"{k} măsurat înainte, NECONCLUDENT acum" for k in g["pierdute"]]
    if not parti:
        return f"regres față de {nume}: niciunul (n cu n pe O1-O9 și pe fiecare poartă)"
    return f"REGRES față de {nume}: " + "; ".join(parti)


def referinta_comparatie(a, runda_dir, d, prec_aceeasi_runda):
    if a.compara:
        return Path(a.compara).resolve()
    if prec_aceeasi_runda and prec_aceeasi_runda.exists():
        return prec_aceeasi_runda
    try:
        f = d / "runde" / str(int(a.runda) - 1) / "masurare.json"
        return f if f.exists() else None
    except ValueError:
        return None


def main():
    ap = argparse.ArgumentParser(description="Măsoară o rundă: lacăt + O1-O9 + porți.")
    ap.add_argument("--runda", required=True, help="numărul rundei (sau 'baza' pentru linia de bază)")
    ap.add_argument("--doar", help="O1,...,O9,porti cu virgulă (măsurare parțială)")
    ap.add_argument("--paralel", type=int, default=1)
    ap.add_argument("--timeout", help="ex. O6=3600,porti=7200 (secunde)")
    ap.add_argument("--chiar-daca-rupt", action="store_true", help="măsoară și cu lacătul rupt (diagnostic; rezultatul rămâne -1)")
    ap.add_argument("--dosar", help="alt dosar al lucrării (probe pe copii); implicit părintele lui oracole/")
    ap.add_argument("--compara", help="masurare.json de referință pentru regres (n cu n); implicit măsurarea precedentă a rundei, "
                                      "altfel runde/N-1/masurare.json")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    d = Path(a.dosar).resolve() if a.dosar else AICI.parent
    od = d / "oracole"
    ing = importa_ingheata()
    timeout = dict(TIMEOUT)
    if a.timeout:
        for x in a.timeout.split(","):
            k, v = x.split("=")
            timeout[k.strip()] = int(v)
    chei = [x.strip() for x in a.doar.split(",")] if a.doar else list(ORACOLE) + ["porti"]
    rele = [k for k in chei if k not in ORACOLE and k != "porti"]
    if rele:
        print(f"chei necunoscute: {rele} (există O1-O9 și porti)")
        print(-1)
        return 2
    runda_dir = d / "runde" / str(a.runda)
    runda_dir.mkdir(parents=True, exist_ok=True)
    iesiri = runda_dir / "iesiri"
    extra_env = {"LH_RADACINA": os.environ["LH_RADACINA"]} if os.environ.get("LH_RADACINA") else {}
    t0 = time.time()
    rez = {"runda": a.runda, "generat": time.strftime("%Y-%m-%d %H:%M:%S"), "situl": extra_env.get("LH_RADACINA") or str(d.parents[1]),
           "partial": bool(a.doar), "chei": chei, "oracole": {}, "porti": None}

    lac0 = ing.verifica(d)
    rez["repere_lock"] = {"inceput": lac0}
    rupt = lac0["stare"] == "rupt"
    if rupt:
        print(f"repere.lock RUPT la început ({len(lac0['abateri'])} abateri): " +
              "; ".join(f"{x['fel']} {x['cale']}" for x in lac0["abateri"][:8]))
    elif lac0["stare"] == "absent":
        print("repere.lock absent: reperele nu sunt încă înghețate (Etapa 0) — măsor, dar măsurarea nu e pe repere înghețate")

    if not rupt or a.chiar_daca_rupt:
        lucru = []
        for k in chei:
            f = (od / ORACOLE[k][0]) if k in ORACOLE else (od / "porti.py")
            lucru.append((k, f, timeout[k]))
        with ThreadPoolExecutor(max_workers=max(1, a.paralel)) as ex:
            gata = list(ex.map(lambda x: un_oracol(x[0], x[1], x[2], iesiri, extra_env), lucru))
        for k, r in gata:
            if k == "porti":
                rez["porti"] = r
            else:
                rez["oracole"][k] = {**r, "cerinta": ORACOLE[k][1]}
        lac1 = ing.verifica(d)
        rez["repere_lock"]["sfarsit"] = lac1
        if lac1["stare"] == "rupt":
            noi = [x for x in lac1["abateri"] if x not in lac0["abateri"]]
            if noi:
                print("repere.lock RUPT în timpul măsurării (un oracol a scris în zona înghețată? vezi CONVENTIE_RADACINA.md): " +
                      "; ".join(f"{x['fel']} {x['cale']}" for x in noi[:8]))
            rupt = True

    toate = list(rez["oracole"].items()) + ([("porti", rez["porti"])] if rez["porti"] else [])
    neconcludente = [k for k, r in toate if r["stare"] != "MASURAT"]
    suma = sum(r["valoare"] for _, r in toate if r["stare"] == "MASURAT")
    rezultat = -1 if (rupt or neconcludente or (not toate)) else suma
    rez.update(suma_masurata=suma, neconcludente=neconcludente, rezultat=rezultat, durata_s=round(time.time() - t0, 1),
               lacat=("rupt" if rupt else lac0["stare"]))
    rez["valori"] = {k: (r["valoare"] if r["stare"] == "MASURAT" else -1) for k, r in toate}
    # exact câmpurile pe care le citește opreste.py din jurnal.jsonl (oracole_dupa / porti_dupa / repere_lock_ok);
    # porțile ca {poarta: n} (-1 = neconcludentă), ca opreste.py să compare n cu n pe fiecare poartă
    pp = (rez["porti"] or {}).get("pe_poarta")
    porti_jurnal = {k: (-1 if v is None else v) for k, v in pp.items()} if isinstance(pp, dict) else rez["valori"].get("porti")
    rez["pentru_jurnal"] = {"oracole": {k: rez["valori"][k] for k in ORACOLE if k in rez["valori"]},
                            "porti": porti_jurnal, "repere_lock_ok": (not rupt) and lac0["stare"] == "ok"}

    tinta = runda_dir / "masurare.json"
    prec_runda = None
    if tinta.exists():
        k = 1
        while (runda_dir / f"masurare_{k}.json").exists():
            k += 1
        prec_runda = runda_dir / f"masurare_{k}.json"
        tinta.rename(prec_runda)
        rez["masurare_precedenta"] = prec_runda.name
    rez["regres"] = regres_fata_de(a, runda_dir, d, prec_runda, rez)
    tinta.write_text(json.dumps(P.curat_tot(rez), ensure_ascii=False, indent=1), encoding="utf-8")

    for k, r in toate:
        eticheta = ORACOLE[k][0] if k in ORACOLE else "porti.py"
        val = r["valoare"] if r["stare"] == "MASURAT" else "NECONCLUDENT"
        print(f"{k:6} {eticheta:26} {str(val):>13}  {r.get('timp_s', 0):8.1f} s" + (f"  · {r['motiv']}" if r.get("motiv") else ""))
        if k == "porti" and isinstance(r.get("pe_poarta"), dict):
            print("       pe poartă: " + ", ".join(f"{x}={'NECONCLUDENT' if v is None else v}" for x, v in r["pe_poarta"].items()))
    print(f"lacăt: {rez['lacat']} · neconcludente: {len(neconcludente)} · suma măsurată: {suma} · {rez['durata_s']} s"
          + (" · PARȚIAL" if a.doar else ""))
    print(text_regres(rez["regres"]))
    print(P.curat(str(tinta)))
    print(rezultat)
    return 0 if rezultat == 0 else (1 if rezultat > 0 else 2)


if __name__ == "__main__":
    sys.exit(main())
