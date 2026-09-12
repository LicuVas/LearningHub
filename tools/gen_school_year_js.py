#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Scrie assets/js/school-year.js din curriculum/school_year_<an>.json.

De ce exista: situl e static, iar un `fetch` al fisierului JSON ar introduce o
cursa (pagina se randeaza inainte sa vina raspunsul) si ar depinde de calea
relativa a fiecarei pagini. Un fisier .js incarcat normal nu are niciuna din
problemele astea. Ca sa nu avem doua adevaruri, fisierul .js se GENEREAZA din
JSON si NU se editeaza de mana - poarta campaniei verifica sa fie la fel.

Rulare:  python C:/00/Projects/LearningHub/tools/gen_school_year_js.py
"""
import glob
import json
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "assets", "js", "school-year.js")


def cel_mai_nou_an():
    """Fisierul de structura cu anul cel mai mare — asa, un an nou intra singur."""
    cale = os.path.join(ROOT, "curriculum", "school_year_*.json")
    fisiere = sorted(glob.glob(cale))
    if not fisiere:
        print("EROARE: nu exista niciun curriculum/school_year_*.json", file=sys.stderr)
        sys.exit(2)
    return fisiere[-1]


def main():
    src = cel_mai_nou_an()
    with open(src, encoding="utf-8") as fh:
        an = json.load(fh)

    date = {
        "school_year": an["school_year"],
        "courses": an["courses"],
        "modules": [
            {
                "index": m["module_index"],
                "name": m["name"],
                "start": m["courses_start"],
                "end": m["courses_end"],
                "vacation_after": m.get("vacation_after"),
            }
            for m in an["modules"]
        ],
        "cycle_end_dates": an.get("cycle_end_dates", {}),
        "source": an["source"].get("order_name", ""),
    }

    js = (
        "/* GENERAT AUTOMAT de tools/gen_school_year_js.py — NU EDITA DE MANA.\n"
        "   Sursa: curriculum/" + os.path.basename(src) + "\n"
        "   Un an scolar nou = pui fisierul JSON in curriculum/ si rulezi generatorul.\n"
        "   Fara asta, orice text despre „acum\" imbatraneste in tacere. */\n"
        "window.SCHOOL_YEAR = " + json.dumps(date, ensure_ascii=False, indent=2) + ";\n\n"
        + CORP
    )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(js)

    print(f"scris: {os.path.relpath(OUT, ROOT)}  (an {date['school_year']}, "
          f"{len(date['modules'])} module, sursa {os.path.basename(src)})")
    return 0


CORP = r"""
/* Functiile de care are nevoie orice pagina care vrea sa spuna „ce e ACUM". */
window.SchoolYear = {
  _parse: function (s) {
    var p = String(s).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  },

  /* Modulul in care ne aflam azi, sau null daca e vacanta / in afara anului. */
  current: function (now) {
    now = now || new Date();
    var azi = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var mods = (window.SCHOOL_YEAR || {}).modules || [];
    for (var i = 0; i < mods.length; i++) {
      var s = this._parse(mods[i].start), e = this._parse(mods[i].end);
      if (azi >= s && azi <= e) return mods[i];
    }
    return null;
  },

  /* Vacanta in care ne aflam azi, sau null. */
  currentVacation: function (now) {
    now = now || new Date();
    var azi = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var mods = (window.SCHOOL_YEAR || {}).modules || [];
    for (var i = 0; i < mods.length; i++) {
      var v = mods[i].vacation_after;
      if (!v) continue;
      if (azi >= this._parse(v.start) && azi <= this._parse(v.end)) return v;
    }
    return null;
  },

  /* „7 septembrie – 23 octombrie 2026" */
  range: function (mod) {
    if (!mod) return '';
    var L = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie',
             'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    var s = this._parse(mod.start), e = this._parse(mod.end);
    var st = s.getDate() + ' ' + L[s.getMonth()] + (s.getFullYear() !== e.getFullYear()
                ? ' ' + s.getFullYear() : '');
    return st + ' \u2013 ' + e.getDate() + ' ' + L[e.getMonth()] + ' ' + e.getFullYear();
  },

  /* Cate saptamani de SCOALA are un interval: saptamanile de luni din el, plus
     saptamana partiala daca modulul nu incepe intr-o luni. */
  _weeksIn: function (s, e) {
    var n = 0, d = new Date(s.getTime());
    var zi = (d.getDay() + 6) % 7;            // 0 = luni
    if (zi !== 0) { n += 1; d.setDate(d.getDate() + (7 - zi)); }
    while (d <= e) { n += 1; d.setDate(d.getDate() + 7); }
    return n;
  },

  /* A cata saptamana de CURSURI e azi (1-based), sau null in vacanta.
     Vacantele NU se numara — altfel 15 noiembrie ar iesi „saptamana 10"
     in loc de 9, fiindca ar include si vacanta de toamna. */
  weekNumber: function (now) {
    var mod = this.current(now);
    if (!mod) return null;
    now = now || new Date();
    var azi = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var mods = (window.SCHOOL_YEAR || {}).modules || [];
    var cumul = 0;
    for (var i = 0; i < mods.length; i++) {
      var s = this._parse(mods[i].start), e = this._parse(mods[i].end);
      if (mods[i].index === mod.index) {
        return cumul + this._weeksIn(s, azi);
      }
      cumul += this._weeksIn(s, e);
    }
    return null;
  },

  /* Propozitia cinstita despre ziua de azi. Nu inventeaza niciodata o materie. */
  sentence: function (now) {
    var mod = this.current(now);
    if (mod) {
      return { stare: 'cursuri', titlu: mod.name, detaliu: this.range(mod) };
    }
    var vac = this.currentVacation(now);
    if (vac) {
      return { stare: 'vacanta', titlu: vac.name, detaliu: '' };
    }
    return { stare: 'necunoscut', titlu: '', detaliu: '' };
  }
};
"""


if __name__ == "__main__":
    sys.exit(main())
