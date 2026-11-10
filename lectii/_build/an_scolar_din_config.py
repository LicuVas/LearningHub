# -*- coding: utf-8 -*-
"""Scrie lectii/an_scolar.json din configurația OFICIALĂ a anului școlar (10.11.2026).

Sursa (singura, nu se copiază de mână): C:/Dropbox/Scoala/Materiale_predare/Informatica/Planificari/Calendar_2026-2027/
school_calendar_config.py — modulele (make_modules), vacanțele (make_vacations), zilele libere (FREE), după adresa
I.S.J. Neamț 2543/19.03.2026 (fișa canonică: python tools/truth.py where "structura anului scolar").
E aceeași sursă din care iese calendarul colorat (Calendar 2627.xlsx / Calendar_2026-2027_Brauner.html).

Ce scrie (îl citește /jurnal/, „Lecțiile mele” pe module):
  module:     [{nr: "I", m: "M1", de_la, pana_la}]   — Modulul V se închide la 18 iun. (V-VII); restul ciclurilor: sfarsit
  saptamani:  [{s: 1, luni, de_la, pana_la, modul}]   — S1..S36 = săptămânile de școală (cele de vacanță nu se numără);
              de_la / pana_la = prima și ultima zi DE ȘCOALĂ din săptămână (fără vacanță, zile libere, weekend),
              ex. S15 = 21–22 dec. (vacanța de iarnă din 23), S30 = 5–7 mai.
Folosire:  python an_scolar_din_config.py            # scrie
           python an_scolar_din_config.py --verifica # doar compară cu fișierul existent
Ultima linie = numărul de probleme (0 = la zi)."""
import importlib.util
import json
import sys
from datetime import date, timedelta
from pathlib import Path

CFG_PY = Path(r"C:\Dropbox\Scoala\Materiale_predare\Informatica\Planificari\Calendar_2026-2027\school_calendar_config.py")
OUT = Path(__file__).resolve().parents[1] / "an_scolar.json"


def incarca_cfg():
    spec = importlib.util.spec_from_file_location("school_calendar_config", CFG_PY)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def zi_de_scoala(d, C, vac):
    return d.weekday() < 5 and d not in C.FREE and not any(a <= d <= b for a, b in vac)


def construieste():
    C = incarca_cfg()
    module = C.make_modules(C.COUNTY_SCHI_START, C.LAST_DAY_DEFAULT)
    vac = C.make_vacations(C.COUNTY_SCHI_START, C.LAST_DAY_DEFAULT)
    sapt, s, luni = [], 0, C.START_MONDAY
    ultima = max(e for _, _, e in module)
    while luni <= ultima:
        zile = [luni + timedelta(days=i) for i in range(5)]
        mod = next((n for n, a, b in module if any(a <= d <= b for d in zile)), None)
        scoala = [d for d in zile if zi_de_scoala(d, C, vac) and any(a <= d <= b for _, a, b in module)]
        if mod and scoala:
            s += 1
            sapt.append({"s": s, "luni": luni.isoformat(), "de_la": scoala[0].isoformat(), "pana_la": scoala[-1].isoformat(), "modul": mod})
        luni += timedelta(days=7)
    return {
        "an": "2026-2027",
        "sursa": "school_calendar_config.py (I.S.J. Neamț 2543/19.03.2026); generat de lectii/_build/an_scolar_din_config.py",
        "module": [{"nr": n, "m": "M%d" % (i + 1), "de_la": a.isoformat(), "pana_la": b.isoformat()} for i, (n, a, b) in enumerate(module)],
        # ultima zi de cursuri pe ciclu (Modulul V se închide aici): gimnaziu_V_VII, clasa_VIII, liceu_tehnologic_X_XI, clasa_XII_zi
        "sfarsit": {k: v[1].isoformat() for k, v in C.CYCLES.items()},
        "saptamani": sapt,
    }


def main():
    nou = construieste()
    text = json.dumps(nou, ensure_ascii=False, indent=1) + "\n"
    probleme = 0
    if "--verifica" in sys.argv:
        vechi = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if vechi != text:
            probleme += 1
            print("PROBLEMĂ an_scolar.json nu corespunde configurației (rulează fără --verifica)")
    else:
        OUT.write_text(text, encoding="utf-8", newline="\n")
        print(f"scris {OUT}")
    s = nou["saptamani"]
    print(f"module: {', '.join(m['nr'] + ' ' + m['de_la'] + '…' + m['pana_la'] for m in nou['module'])}")
    print(f"săptămâni de școală: S1..S{s[-1]['s']} · sfârșitul pe ciclu: {nou['sfarsit']}")
    print(probleme)


if __name__ == "__main__":
    main()
