# -*- coding: utf-8 -*-
"""Construieste argumentele pentru un val (wave.js), DOAR cu ce mai lipseste.

  python make_args.py lic10            -> JSON pe stdout (doar lectiile care nu trec poarta)
  python make_args.py lic10 --all      -> tot lotul, chiar daca e deja gata
  python make_args.py lic10 --count    -> cate fisiere ar intra in val

Asta e mecanismul de reluare: dupa o intrerupere (quota, cadere, reboot),
rulezi din nou aceeasi comanda si valul contine numai restul de facut.
"""
import json, io, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import status as S

# Cine invata, cu ce fel de exemple. Asta face diferenta dintre o lectie de manual si una folosibila.
PROFIL = {
    "lic10": {
        "label": "Liceu clasa a X-a (T.I.C., filiera tehnologica)",
        "gradeName": "Clasa a X-a",
        "audienceShort": "T.I.C. Clasa a X-a",
        "audience": "elevi de clasa a X-a la liceu tehnologic (electric/TEEA, mecanica, prelucrarea lemnului), o singura ora de T.I.C. pe saptamana",
        "flavor": ("Exemplele se iau din atelier si din viata unei firme mici: fise de consum, devize, "
                   "evidente de materiale, planuri de productie, oferte. Elevii nu sunt informaticieni; "
                   "obiectivul este sa stie sa faca lucrul respectiv pe calculator, nu sa il descrie."),
    },
    "lic11": {
        "label": "Liceu clasa a XI-a (T.I.C., competentele individuale 1 si 2)",
        "gradeName": "Clasa a XI-a",
        "audienceShort": "T.I.C. Clasa a XI-a",
        "audience": ("elevi de clasa a XI-a la liceu tehnologic (protectia mediului, mecanica, silvicultura), "
                     "o singura ora de T.I.C. pe saptamana"),
        "flavor": ("Exemplele se iau din specificul calificarii: masuratori de mediu, evidente silvice, "
                   "fise de lucru din atelier, documente de firma. Accentul cade pe informatia utila la locul de munca "
                   "si pe prelucrarea ei in foaia de calcul."),
    },
    "lic12": {
        "label": "Liceu clasa a XII-a (T.I.C., competentele individuale 3 si 4)",
        "gradeName": "Clasa a XII-a",
        "audienceShort": "T.I.C. Clasa a XII-a",
        "audience": ("elevi de clasa a XII-a la liceu tehnologic (prelucrarea lemnului, protectia mediului, silvicultura), "
                     "care dau la bacalaureat proba de evaluare a competentelor digitale"),
        "flavor": ("Exemplele sunt site-uri si proiecte reale mici, pe specificul calificarii. "
                   "Unde subiectul se atinge de proba de competente digitale de la bacalaureat, spune explicit ce se cere acolo."),
    },
    "maistri": {
        "label": "Scoala de maistri, an I - Maistru electromecanic auto (Utilizarea tehnicii de calcul)",
        "gradeName": "Maistri, anul I",
        "audienceShort": "Scoala de Maistri, Anul I",
        "audience": ("adulti, elevi in anul I la scoala de maistri, calificarea maistru electromecanic auto; "
                     "multi lucreaza deja in atelier si vor sa foloseasca imediat ce invata"),
        "flavor": ("Fiecare exemplu vine din atelierul auto: devize de reparatie, consumuri, evidenta pieselor si a "
                   "furnizorilor, fise de constatare, cataloage si scheme electrice, coduri de eroare de diagnoza. "
                   "Vorbeste cu ei ca oameni care au meseria in maini, dar nu au lucrat mult pe calculator. "
                   "Fara limbaj scolaresc si fara infantilizare."),
    },
    "sanitar1": {
        "label": "Postliceal sanitar, anul I - medicina generala",
        "gradeName": "Postliceal, Anul I",
        "audienceShort": "Postliceal Sanitar, Anul I",
        "audience": ("adulti, elevi in anul I la scoala postliceala sanitara, calificarea asistent medical generalist"),
        "flavor": ("Exemplele sunt din activitatea medicala: evidenta parametrilor vitali, tratamente, stocuri de materiale "
                   "sanitare, evidenta pacientilor, documente medicale. Protectia datelor pacientilor apare oriunde e relevanta, "
                   "nu doar in lectia dedicata. Nu da sfaturi clinice si nu descrie tratamente - lectia e despre calculator, "
                   "contextul e medical."),
    },
    "sanitar2": {
        "label": "Postliceal sanitar, anul II - farmacie",
        "gradeName": "Postliceal, Anul II",
        "audienceShort": "Postliceal Sanitar, Anul II",
        "audience": ("adulti, elevi in anul II la scoala postliceala sanitara, calificarea asistent medical de farmacie"),
        "flavor": ("Exemplele sunt din farmacie: gestiune si stocuri, loturi si termene de valabilitate, adaos comercial si "
                   "pret cu amanuntul, nomenclator de produse, comenzi catre depozit, retrageri de lot. Nu da sfaturi "
                   "farmacologice si nu recomanda medicamente - lectia e despre calculator, contextul e farmaceutic."),
    },
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in PROFIL:
        print("Grupe: " + ", ".join(PROFIL.keys()), file=sys.stderr)
        return 2
    g = sys.argv[1]
    take_all = "--all" in sys.argv
    plan = S.load_plan()
    repo = plan["repo"]
    prof = PROFIL[g]

    mods = []
    n_lessons = 0
    for M in plan["modules"]:
        if M["group"] != g:
            continue
        idx_ok, _ = S.check_index(repo, M)
        lessons = []
        for L in M["lessons"]:
            ok, _ = S.check_lesson(repo, L)
            if take_all or not ok:
                lessons.append(L)
        if not lessons and idx_ok and not take_all:
            continue
        mm = {k: M[k] for k in ("cls", "module", "title", "icon", "desc", "indexPath")}
        mm["gradeName"] = prof["gradeName"]
        mm["audienceShort"] = prof["audienceShort"]
        mm["lessons"] = lessons
        mods.append(mm)
        n_lessons += len(lessons)

    out = {"label": prof["label"], "audience": prof["audience"], "flavor": prof["flavor"], "modules": mods}
    if "--count" in sys.argv:
        print("%s: %d module in val, %d lectii de construit" % (g, len(mods), n_lessons))
        return 0
    json.dump(out, sys.stdout, ensure_ascii=False)
    return 0


if __name__ == "__main__":
    sys.exit(main())
