# -*- coding: utf-8 -*-
"""Generează / actualizează lectii/plan.json din calendarele orelor de la Brauner (secvența canonică a clasei).

    python C:/00/Projects/LearningHub/lectii/_build/plan_din_calendar.py            # scrie plan.json
    python C:/00/Projects/LearningHub/lectii/_build/plan_din_calendar.py --verifica # doar compară, nu scrie

Sursa: C:/00/Projects/Info_Gimnaziu_2026/planificari/Calendar_ore_<grupa>.md, tabelul
| Data | Săpt. | Modul | Tema lecției | Tipul orei |  (Săpt. = numărul lecției, 1..N).

Starea unei lecții (publicat | in_pregatire | in_lucru) NU se pierde la regenerare: dacă lecția (clasă + nr)
există deja în plan.json, starea ei rămâne. Lecțiile noi primesc: M1 -> in_pregatire, M2+ -> in_lucru.
Doar dirijorul trece o lecție pe „publicat” (în plan.json), apoi rulează build_lectii.py.

Ultimele trei linii tipărite sunt pline; ultima = DOAR numărul de probleme (rânduri care n-au putut fi citite,
numere de lecție care nu merg 1..N, plan.json diferit de calendar în modul --verifica).
"""
import json
import re
import sys
from pathlib import Path

LH = Path(__file__).resolve().parents[2]
PLAN = LH / "lectii" / "plan.json"
CAL_DIR = Path(r"C:\00\Projects\Info_Gimnaziu_2026\planificari")

CLASE = [
    # slug, roman, nivel, nume, fișierul calendarului, grupele de la Brauner
    ("v", "V", 5, "a V-a", "Calendar_ore_5AM_5M.md", "5AM/5M"),
    ("vi", "VI", 6, "a VI-a", "Calendar_ore_6A_6M.md", "6A/6M"),
    ("vii", "VII", 7, "a VII-a", "Calendar_ore_7_MA.md", "7MA"),
    ("viii", "VIII", 8, "a VIII-a", "Calendar_ore_8A_8M.md", "8A/8M"),
]
STARI = ("publicat", "in_pregatire", "in_lucru")
RAND = re.compile(r"^\|\s*(\d{2}\.\d{2}\.\d{4})\s*\|\s*(\d+)\s*\|\s*M(\d)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$")


def citeste_calendar(fisier, probleme):
    lectii = []
    for linie in (CAL_DIR / fisier).read_text(encoding="utf-8").splitlines():
        if not re.match(r"^\|\s*\d{2}\.\d{2}\.\d{4}", linie):
            continue
        m = RAND.match(linie)
        if not m:
            probleme.append(f"{fisier}: rând necitit: {linie[:90]}")
            continue
        data, nr, modul, titlu, tip = m.groups()
        lectii.append({"nr": int(nr), "modul": int(modul), "titlu": titlu, "tip": tip, "data": data})
    nr = [x["nr"] for x in lectii]
    if nr != list(range(1, len(nr) + 1)):
        probleme.append(f"{fisier}: numerele lecțiilor nu merg 1..{len(nr)}: {nr}")
    mod = [x["modul"] for x in lectii]
    if mod != sorted(mod):
        probleme.append(f"{fisier}: modulele nu sunt în ordine")
    return lectii


def construieste(vechi, probleme):
    stare_veche = {}
    insigna_veche = {}  # insigna („verificat parțial” / „verificat”) e tot a dirijorului; regenerarea o păstrează
    for c, info in (vechi.get("clase") or {}).items():
        for mo in info.get("module", []):
            for le in mo.get("lectii", []):
                stare_veche[(c, le.get("nr"))] = le.get("stare")
                if le.get("insigna"):
                    insigna_veche[(c, le.get("nr"))] = le["insigna"]
    clase = {}
    for slug, roman, nivel, nume, fisier, grupe in CLASE:
        lectii = citeste_calendar(fisier, probleme)
        module = []
        for k in sorted({x["modul"] for x in lectii}):
            din_modul = [x for x in lectii if x["modul"] == k]
            iesire = []
            for x in din_modul:
                implicit = "in_pregatire" if k == 1 else "in_lucru"
                st = stare_veche.get((slug, x["nr"]))
                iesire.append({
                    "nr": x["nr"],
                    "modul": f"M{k}",
                    "titlu": x["titlu"],
                    "tip": x["tip"],
                    "data": x["data"],
                    "cale": f"lectii/{slug}/m{k}-l{x['nr']:02d}/",
                    "cheie": f"lectie_{slug}_m{k}_l{x['nr']:02d}",
                    "stare": st if st in STARI else implicit,
                })
                if (slug, x["nr"]) in insigna_veche:
                    iesire[-1]["insigna"] = insigna_veche[(slug, x["nr"])]
            module.append({"modul": f"M{k}", "de_la": din_modul[0]["data"], "pana_la": din_modul[-1]["data"],
                           "lectii": iesire})
        clase[slug] = {"roman": roman, "nivel": nivel, "nume": nume, "grupe_brauner": grupe,
                       "calendar": str(CAL_DIR / fisier), "module": module}
    return {
        "despre": ("Planul secțiunii /lectii/ din LearningHub: toate lecțiile anului 2026-2027 la gimnaziu, pe module, "
                   "în ordinea din Calendar_ore (Brauner). Generat de lectii/_build/plan_din_calendar.py; paginile le "
                   "face lectii/_build/build_lectii.py. Starea: publicat = lecția e pe sit (DOAR dirijorul o pune); "
                   "in_pregatire = modulul curent, lecția se scrie; in_lucru = modulele următoare. Regenerarea păstrează starea."),
        "stari": list(STARI),
        "clase": clase,
    }


def fara_stare(plan):
    """plan.json fără câmpul stare, pentru comparația cu calendarul (starea e a dirijorului)."""
    p = json.loads(json.dumps(plan))
    for info in p.get("clase", {}).values():
        for mo in info.get("module", []):
            for le in mo.get("lectii", []):
                le.pop("stare", None)
                le.pop("insigna", None)
    return p


def main():
    verifica = "--verifica" in sys.argv[1:]
    probleme = []
    vechi = json.loads(PLAN.read_text(encoding="utf-8")) if PLAN.exists() else {}
    nou = construieste(vechi, probleme)
    total = sum(len(mo["lectii"]) for c in nou["clase"].values() for mo in c["module"])
    for p in probleme:
        print("  PROBLEMĂ", p)
    if verifica:
        if fara_stare(vechi) != fara_stare(nou):
            probleme.append("plan.json nu mai corespunde calendarelor (rulează fără --verifica)")
            print("  PROBLEMĂ plan.json nu mai corespunde calendarelor (rulează fără --verifica)")
        print(f"verificat: {total} lecții în calendare, plan.json {'la zi' if not probleme else 'NU e la zi'}")
    else:
        PLAN.parent.mkdir(parents=True, exist_ok=True)
        PLAN.write_text(json.dumps(nou, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
        print(f"scris: {PLAN}")
    pe_clase = " · ".join(f"{s}: {sum(len(mo['lectii']) for mo in c['module'])}" for s, c in nou["clase"].items())
    print(f"lecții pe clase: {pe_clase} · total {total}")
    print("probleme:")
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
