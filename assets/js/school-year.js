/* GENERAT AUTOMAT de tools/gen_school_year_js.py — NU EDITA DE MANA.
   Sursa: curriculum/school_year_2026_2027.json
   Un an scolar nou = pui fisierul JSON in curriculum/ si rulezi generatorul.
   Fara asta, orice text despre „acum" imbatraneste in tacere. */
window.SCHOOL_YEAR = {
  "school_year": "2026-2027",
  "courses": {
    "start_date": "2026-09-07",
    "end_date": "2027-06-25",
    "total_weeks": 37
  },
  "modules": [
    {
      "index": 1,
      "name": "Modulul 1",
      "start": "2026-09-07",
      "end": "2026-10-23",
      "vacation_after": {
        "name": "Vacanta de toamna",
        "start": "2026-10-26",
        "end": "2026-10-30"
      }
    },
    {
      "index": 2,
      "name": "Modulul 2",
      "start": "2026-11-02",
      "end": "2026-12-22",
      "vacation_after": {
        "name": "Vacanta de iarna",
        "start": "2026-12-23",
        "end": "2027-01-08"
      }
    },
    {
      "index": 3,
      "name": "Modulul 3",
      "start": "2027-01-11",
      "end": "2027-02-19",
      "vacation_after": {
        "name": "Vacanta mobila",
        "start": "2027-02-22",
        "end": "2027-02-26",
        "rule": "Hotarata de C.A. al I.S.J. Neamt (16.03.2026). In alte judete poate fi alta saptamana."
      }
    },
    {
      "index": 4,
      "name": "Modulul 4",
      "start": "2027-03-01",
      "end": "2027-04-23",
      "vacation_after": {
        "name": "Vacanta de primavara",
        "start": "2027-04-26",
        "end": "2027-04-29"
      }
    },
    {
      "index": 5,
      "name": "Modulul 5",
      "start": "2027-05-05",
      "end": "2027-06-18",
      "vacation_after": {
        "name": "Vacanta de vara",
        "start": "2027-06-21",
        "end": "2027-09-06",
        "note": "Pana la inceputul anului scolar 2027-2028."
      }
    }
  ],
  "cycle_end_dates": {
    "note": "Clasele NU termina toate in aceeasi zi. Numarul de saptamani difera pe ciclu.",
    "gimnaziu_v_vi_vii": {
      "weeks": 36,
      "last_day": "2027-06-18"
    },
    "clasa_viii": {
      "weeks": 35,
      "last_day": "2027-06-11"
    },
    "liceu_tehnologic_x_xi": {
      "weeks": 37,
      "last_day": "2027-06-25"
    },
    "clasa_xii_zi": {
      "weeks": 34,
      "last_day": "2027-06-04"
    }
  },
  "source": "O.M.E. nr. 3.194/2026 privind structura anului scolar 2026-2027"
};


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
