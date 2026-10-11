# Contract — tura de noapte 10→11.10.2026: restul modulului II la V, VI, VII

**Cererea (verbatim, 10.10.2026 23:21, prin dispecer):** „as vrea sa pornesti o consola care sa lucreeze la learninghub - sa adauge restul lectiilor pe modulul II la toate clasele unde lipsesc”

**Aprobarea:** Vasile doarme. Conform briefului dispecerului (`C:\00\AI_0\data\fleet\brief_lectii_M2_2026-10-10.md`), contractul se scrie aici și lucrarea pornește; îl vede dimineață. Deciziile care sunt ale lui se parchează în `DIMINEATA_11_10.md`.

**Proba realității:** dimineață (și la ora din săptămâna 06.11–25.12), elevul de a V-a, a VI-a sau a VII-a deschide pe telefon sau în laborator `learninghub-8z6.pages.dev/lectii/<clasa>/`, intră în lecția zilei, o parcurge SINGUR (la Tupilați VI și VII au oră simultană), exersează în pagină, face partea „la calculatorul din laborator” fără să strice nimic pe calculatorul comun și ia diploma. Profesorul vede activitatea în panou, fără elevi de probă.

| R | Ce | Cine verifică | Gata = |
|---|---|---|---|
| R1 | Cele 18 lecții lipsă (V/10-15, VI/10-15, VII/10-15) scrise și publicate LIVE prin lanțul campaniei | judecători independenți (pereche opus + sonnet la judecata 1, verdictul final pe **opus**) + `publica_lectie.py` + poarta „conținut LIVE = fișierul comis” | pe fiecare lecție: ultimul `_verificare\judecatorN.md` = 0 GRAV / 0 MAJOR (opus); `publica_lectie.py` ultima linie 0; `stare.py --modul M2` la V, VI, VII = 8/8 PUBLICAT. Ce nu ajunge până dimineață rămâne „în lucru”, cu pasul următor scris. |
| R2 | Faptele despre aplicații probate în aplicația REALĂ (Office pe setări RO, Windows, browserul, aplicația audio-video) | judecătorul, ca arbitru | `afirmatii.json`: fiecare afirmație are proba; ce nu se poate proba e în `nesigur` și scris prudent |
| R3 | Nimic străin publicat | dirijorul, cu `git show --stat` pe fiecare commit al meu | commiturile mele conțin DOAR căile lecțiilor + `_sim` noi + plan/index/hub; zero fișiere ale `ai-0-b7` / `ai-0-3d` / `curriculum\school_year_2026_2027.json`; niciun push înaintea acordului lor |
| R4 | Componentele comune neatinse (`motor.js`, `prezenta.js`, `rezultat-elev.js`, simulatoarele altor lecții) | `git diff --stat` pe ele în commiturile mele | 0 linii |
| R5 | Calculatorul profesorului rămâne cum era (regula 25) + nimic spre panou (regula 24) | dirijorul la final | `curata_mru_office.py --sterge` → 0 rămase; niciun proces pornit de agenți rămas; `activitate.py lista` → 0 elevi „nu e în catalog” noi |
| R6 | Nicio dată personală în ce se publică (regula 27) | `learninghub_date_personale.py` (poartă în `publica_lectie.py`) | ultima linie 0 la fiecare publicare |
| R7 | Raportul de dimineață + jurnalul + fișa de memorie | — | `DIMINEATA_11_10.md` (FĂCUT cu dovada live / NEFĂCUT cu deblocatorul / NESIGUR + deciziile lui), intrare în `04_ORCHESTRARE.md`, strat datat în `project_learninghub_revizuire_completa` |

**Ce NU intră:** VIII (complet), modulele 3-5, reparațiile componentelor comune din `08_RELUARE.md` §9, jocurile.

**Cât durează (estimare):** o lecție = ~1-2 h autor + 2-4 treceri de judecată de 20-40 min. Cu 6-8 autori în paralel, primele publicări pe la 02:30-03:30 (după ce `ai-0-b7` își publică commiturile, ~00:30). Toate 18 într-o noapte e puțin probabil: lanțurile VII (11→15) și VI (13→15) sunt secvențiale, fiindcă lecțiile următoare extind simulatorul celei dinainte. Raportul spune exact câte au ajuns live.
