"""O6 — ORACOLUL SARCINILOR (cerința R8 din contract.md): „verificarea sarcinilor nu se schimbă la mutare”.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/oracol_sarcini.py
        [--radacina <copie a sitului>]   (sau LH_RADACINA; implicit worktree-ul LearningHub_fidel)
        [--pagini <subșir> ...]          (o felie din referință; sau LH_PAGINI = chei exacte cu virgulă,
                                          LH_DOAR_PAGINI = subșiruri cu virgulă; implicit toate paginile)
        [--doar-corect]                  (compară doar corect/greșit, nu și mesajul; implicit: tot verdictul)
        [--lucratori N] [--iesire <detalii.json>]   (sau LH_IESIRE = folderul detaliilor)
Respectă oracole/CONVENTIE_RADACINA.md.

Ce face: citește referinte/verdicte_vechi.json (verdictele simulatoarelor VECHI, scrise de sarcini_lib/construieste.py)
și REJOACĂ aceiași pași, pe situl de acum, cu ACELAȘI cod de joc (sarcini_lib/joaca.py): pentru fiecare exercițiu —
soluția, greșeala 1, greșeala 2, exact cum spune `plan` din referință (implicit: rezolva() / gresit() ale simulatorului /
Verifică fără nicio acțiune; înlocuitorii partial / vecin / alta_varianta sunt descriși în sarcini_lib/joaca.py) — pe
pagini proaspete, rețea blocată (doar 127.0.0.1), port liber. Exercițiul e regăsit după enunț (q), nu doar după poziție,
ca o lecție mutată pe bibliotecă să-și păstreze exercițiile chiar dacă li se schimbă ordinea în configurație.
CE TREBUIE SĂ PĂSTREZE BIBLIOTECA NOUĂ ca reluarea să fie posibilă: motorul (jocuri/_motor/motor.js, JocMotor.test.*),
iar fiecare tip de exercițiu mutat: rezolva() și gresit() care citesc ACELEAȘI câmpuri din configurația lecției
(Q.rezolvare/solutie/sol/verifica, Q.gresit/tipic, Q.o/ok, Q.zone/ok), plus #fb pentru verdict. Lipsa lor = diferență.

Numără (ultima linie = un singur întreg):
  + 1 pentru fiecare verdict DIFERIT (exercițiu × încercare): corect/greșit, mesajul din #fb (spații normalizate) sau
      scorul (+N XP) altfel decât în referință; și o încercare care era jucabilă și acum nu mai e (sau invers);
  + 1 pentru fiecare exercițiu DISPĂRUT (pagina lipsește sau enunțul nu mai e în configurația ei).
Exercițiile nejucabile în referință se rejoacă și ele: trebuie să rămână nejucabile (altfel = diferență).
Zgomot (CONVENTIE_RADACINA.md, regula 6): fiecare încercare găsită diferită se REJOACĂ o dată, pe o pagină proaspătă;
se numără doar dacă diferă și a doua oară. Cele care s-au potrivit la a doua jucare sunt „instabile”: nu intră în număr,
dar apar pe un rând înaintea penultimei linii și în detalii (un simulator instabil e de urmărit, nu de ascuns).
Cod de ieșire: 0 = niciuna, 1 = există; orice prăbușire (referință lipsă, browser care nu pornește) = cod 3, fără întreg.
Detaliile (fiecare diferență cu vechi/nou): JSON-ul a cărui cale e pe penultima linie: LH_IESIRE/oracol_sarcini.json;
fără LH_IESIRE, lângă oracol (oracole/oracol_sarcini.json) când se măsoară worktree-ul, altfel în %TEMP% (o copie din
%TEMP% are în cale numele contului Windows, care nu are voie în _campaign/).
Durata: ~20-25 min pentru toate cele ~2430 de încercări (6 procese, 12 nuclee); cu --pagini, ~1 min pe pagină.
"""
import argparse
import collections
import hashlib
import json
import os
import sys
import tempfile
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
# fără __pycache__ în oracole/ (tot dosarul e înghețat în repere.lock); și pentru procesele lucrătoare
sys.dont_write_bytecode = True
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.path.insert(0, str(AICI / "sarcini_lib"))
import joaca  # noqa: E402  (citește LH_RADACINA: joaca.radacina())

FELURI = ["solutie", "gresit1", "gresit2"]
CHEI = ("corect", "mesaj", "scor")


def verdict_ref(e, fel):
    """Verdictul de referință al unei încercări: ('ok', verdict) sau ('nejucabil', motiv)."""
    if "nejucabil" in e:
        return ("nejucabil", e["nejucabil"])
    x = e.get(fel)
    if fel == "solutie":
        return ("ok", x)
    if x is None or "nejucabil" in x:
        return ("nejucabil", (x or {}).get("nejucabil", "lipsă din referință"))
    return ("ok", x["verdict"])


def verdict_nou(r):
    if r is None:
        return ("nejucabil", "nejucat")
    if "disparut" in r:
        return ("disparut", r["disparut"])
    if "nejucabil" in r:
        return ("nejucabil", r["nejucabil"])
    return ("ok", r["verdict"])


def la_fel(a, b, doar_corect):
    if a[0] != b[0]:
        return False
    if a[0] == "nejucabil":
        # același FEL de motiv (fără textul volatil al erorii): „simulatorul nu are gresit()” rămâne același lucru
        return a[1].split(":")[0] == b[1].split(":")[0]
    chei = ("corect",) if doar_corect else CHEI
    return all((a[1] or {}).get(k) == (b[1] or {}).get(k) for k in chei)


def alege_pagini(toate, a):
    exacte = [p.strip().replace("\\", "/") for p in os.environ.get("LH_PAGINI", "").split(",") if p.strip()]
    subsiruri = list(a.pagini or []) + [p.strip() for p in os.environ.get("LH_DOAR_PAGINI", "").split(",") if p.strip()]
    if not exacte and not subsiruri:
        return toate, []
    ales = {p: ex for p, ex in toate.items() if p in exacte or any(s in p for s in subsiruri)}
    return ales, exacte + subsiruri


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--radacina", default=None)
    ap.add_argument("--referinta", default=str(joaca.REFERINTA))
    ap.add_argument("--pagini", nargs="*")
    ap.add_argument("--doar-corect", action="store_true")
    # 6 procese: cu mai multe, pe 12 nuclee, temporizările simulatoarelor (DUPA_RANDARE/DUPA_ACTIUNE din joaca.py) devin la limită
    ap.add_argument("--lucratori", type=int, default=max(2, min(6, (os.cpu_count() or 4) - 2)))
    ap.add_argument("--iesire", default=None)
    a = ap.parse_args()

    rad = joaca.radacina(a.radacina)
    ref = json.loads(Path(a.referinta).read_text(encoding="utf-8"))   # lipsă/stricată = prăbușire (cod 3)
    pagini, filtru = alege_pagini({p: ex for p, ex in ref.items() if not p.startswith("_")}, a)
    if not pagini:
        raise RuntimeError("referința nu are pagini (sau filtrul de pagini nu prinde niciuna)")

    disparute, lista = [], []
    for p, ex in pagini.items():
        if not (rad / p).is_file():
            disparute += [{"pagina": p, "exercitiu": eid, "motiv": "pagina nu mai există"} for eid in ex]
            continue
        lista.append((p, [(eid, e["cale"], e.get("q"), dict(e.get("plan") or joaca.PLAN_IMPLICIT)) for eid, e in ex.items()]))

    t0 = time.time()
    brut = joaca.ruleaza(rad, lista, a.lucratori)

    def compara(brut_):
        dif, disp, mut, nr_ex_, nr_inc_ = [], [], [], 0, 0
        for p, ex in pagini.items():
            if not (rad / p).is_file():
                continue
            for eid, e in ex.items():
                nr_ex_ += 1
                r = brut_.get(p, {}).get(eid, {})
                noi = {fel: verdict_nou(r.get(fel)) for fel in FELURI}
                if any(v[0] == "disparut" for v in noi.values()):
                    motiv = next(v[1] for v in noi.values() if v[0] == "disparut")
                    disp.append({"pagina": p, "exercitiu": eid, "cale": e["cale"], "motiv": motiv})
                    continue
                nota = next((x.get("nota") for x in r.values() if isinstance(x, dict) and x.get("nota")), None)
                if nota:
                    mut.append({"pagina": p, "exercitiu": eid, "nota": nota})
                for fel in FELURI:
                    nr_inc_ += 1
                    vechi = verdict_ref(e, fel)
                    if not la_fel(vechi, noi[fel], a.doar_corect):
                        x = r.get(fel) or {}
                        dif.append({"pagina": p, "exercitiu": eid, "cale": e["cale"], "incercare": fel,
                                    "vechi": vechi[1], "nou": noi[fel][1], "pasi": x.get("pasi"), "erori_js": x.get("erori")})
        return dif, disp, mut, nr_ex_, nr_inc_

    diferente0, disparute1, mutate, nr_ex, nr_inc = compara(brut)
    disparute += disparute1

    # a doua jucare, doar pentru încercările găsite diferite (zgomotul temporizărilor nu are voie să dea „diferențe”)
    diferente, instabile = [], []
    if diferente0:
        plan_ref = {(p, eid): dict(e.get("plan") or joaca.PLAN_IMPLICIT) for p, ex in pagini.items() for eid, e in ex.items()}
        de_rejucat = collections.defaultdict(dict)
        for d in diferente0:
            p, eid = d["pagina"], d["exercitiu"]
            e = pagini[p][eid]
            item = de_rejucat[p].setdefault(eid, (eid, e["cale"], e.get("q"), {}))
            item[3][d["incercare"]] = plan_ref[(p, eid)][d["incercare"]]
        brut2 = joaca.ruleaza(rad, [(p, list(v.values())) for p, v in de_rejucat.items()], a.lucratori)
        for d in diferente0:
            r2 = (brut2.get(d["pagina"], {}).get(d["exercitiu"]) or {}).get(d["incercare"])
            vechi = verdict_ref(pagini[d["pagina"]][d["exercitiu"]], d["incercare"])
            if la_fel(vechi, verdict_nou(r2), a.doar_corect):
                instabile.append(dict(d, a_doua_jucare=verdict_nou(r2)[1]))
            else:
                diferente.append(dict(d, a_doua_jucare=verdict_nou(r2)[1]))
    pe_fel = collections.Counter(d["incercare"] for d in diferente)
    total = len(diferente) + len(disparute)

    if a.iesire:
        iesire = Path(a.iesire)
    elif os.environ.get("LH_IESIRE"):
        iesire = Path(os.environ["LH_IESIRE"]).resolve() / "oracol_sarcini.json"
    elif rad == joaca.WT_IMPLICIT.resolve():
        iesire = AICI / "oracol_sarcini.json"
    else:
        h = hashlib.sha1((str(rad) + "|" + "|".join(filtru)).encode()).hexdigest()[:8]
        iesire = Path(tempfile.gettempdir()) / f"oracol_sarcini_{h}.json"
    iesire.parent.mkdir(parents=True, exist_ok=True)
    rez = {"oracol": "O6 oracol_sarcini (R8)", "radacina": str(rad), "referinta": str(a.referinta),
           "pagini_filtru": filtru, "comparat": "doar corect" if a.doar_corect else "corect + mesaj + scor",
           "durata_s": round(time.time() - t0), "pagini": len(pagini), "exercitii_rejucate": nr_ex,
           "incercari_comparate": nr_inc, "diferente": len(diferente), "diferente_pe_incercare": dict(pe_fel),
           "instabile": len(instabile), "disparute": len(disparute), "total": total,
           "lista_diferente": diferente, "lista_disparute": disparute, "lista_instabile": instabile,
           "regasite_dupa_enunt_in_alt_loc": mutate}
    iesire.write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"O6 sarcini: {len(pagini)} pagini, {nr_ex} exerciții rejucate, {nr_inc} încercări comparate ({rez['comparat']})")
    print(f"verdicte diferite: {len(diferente)} {dict(pe_fel)} · exerciții dispărute: {len(disparute)} · "
          f"instabile (diferite doar la prima jucare, nenumărate): {len(instabile)} · durata {rez['durata_s']} s")
    print(str(iesire))   # penultima linie = calea detaliilor (CONVENTIE_RADACINA.md, regula 3)
    print(total)
    return 1 if total else 0


if __name__ == "__main__":
    try:
        cod = main()
    except Exception:  # noqa: BLE001 — prăbușirea NU e o măsurătoare: alt cod decât 0/1, fără întreg pe ultima linie
        traceback.print_exc()
        print("O6 PRĂBUȘIT - nu e o măsurătoare (vezi eroarea de mai sus)")
        sys.exit(3)
    sys.exit(cod)
