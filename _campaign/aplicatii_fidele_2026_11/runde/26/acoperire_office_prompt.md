# Rundă `acoperire` pe Word + Excel: deblocatorii platoului O4 — scris de orchestrator, 21.11.2026

D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`. Worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`, pornire = HEAD.

## De ce există runda
- **Ciclurile paralele B și C** au închis GRAV-urile Word și Excel. Criticii 20 și 21 au dat GRAV 0. Dar oracolele O1-O9 au rămas pe aceleași numere trei cicluri la rând, iar regula PLATOU (`opreste.py`) oprește valurile.
- **O4 = 28** (`runde/26/iesiri/O4/oracol_comportament.json`, sau `runde/22/…` dacă 26 nu există). Constructorii rundelor 24 și 25 au arătat că o parte din ce numără O4 la Word și Excel sunt **referințe sau scenarii greșite, nu simulatorul**:
  - **`excel-sortare-doua-niveluri`:** rezultatul real a fost înregistrat greșit. `referinte/acoperire_excel_r7.py:1113` a sortat Punctaj crescător, deși pasul cere „Largest to Smallest” (`runde/25/raport_constructor.md`, `runde/25/diferente.md`).
  - **`excel-autocompletare-tab` și `excel-separator-virgula`:** realul citește celulele după Esc + Esc, iar scenariul simulat nu are pașii aceia. Cu Esc + Esc, simulatorul dă exact realul (`runde/25/raport_constructor.md`).
  - **`word-clic-pune-cursorul`:** asimetrie de sub un pixel între clicul real (0,5 px la stânga mijlocului cuvântului) și cel din O4, așezat exact la mijloc (`runde/24/raport_constructor.md`, R24-1).
  - **`word-imagine-inserare`:** cere „This Device”, care stă într-un meniu închis. O variantă a scenariului, jucată pe o copie, iese 1/1 la fel ca realul (`runde/24/…`, R24-2).
  - **Cele „fără real probat”** (13): `excel-tragere-umplere-gest`, `excel-tragere-zona`, `word-copiere-lipire`, `word-decupare-lipire`, `word-font-size-tastat`, `word-tragere-selectie`, `word2007-ctrl-z-*`, `powerpoint-*`. Unele se pot juca pe Office-ul tău de pe desktopul ascuns, cu gesturi reale.
- **Modelul, regulile și formatul:**
  - Excel: `D/runde/7/acoperire_prompt.md` + `D/runde/7/acoperire_excel.md` (generatorul `D/referinte/acoperire_excel_r7.py`);
  - Word: `D/runde/3/acoperire_prompt.md` + `D/runde/3/acoperire_word.md`;
  - cea mai nouă, care le urmează: `D/runde/14/acoperire_excel_prompt.md`.
  Citește-le întâi. Rămân toate în vigoare, cu schimbările de mai jos.

## Ce ai de acoperit, în ordinea asta
1. **`excel-sortare-doua-niveluri`:** reiei captura reală cu pasul corect („Largest to Smallest” pe al doilea nivel, exact cum îl cere scenariul), citind starea prin COM. Corectezi generatorul, nu doar JSON-ul.
2. **`excel-autocompletare-tab`, `excel-separator-virgula`:** scenariul simulat face aceiași pași ca realul (Esc + Esc înainte de citire), sau realul se recaptează fără Esc + Esc. Alegi varianta care respectă ce face elevul în lecție. Scrii de ce.
3. **`word-clic-pune-cursorul`:** punctul clicului din scenariu e lipsit de ambiguitate pe ambele părți (de ex. în interiorul unei litere, nu la mijlocul cuvântului). Recapturezi realul cu punctul nou.
4. **`word-imagine-inserare`:** pașii scenariului deschid meniul înainte de „This Device”, ca în Word real și ca în lecție.
5. **Cele „fără real probat”**, câte poți, doar Word 365 și Excel 365 pe desktopul ascuns `LHRefOffice`, cu gesturi reale (tragere, Ctrl+C / V / X, tastarea mărimii fontului). Ce nu se poate juca invizibil rămâne în `de_verificat.md`, pentru Vasile, NU în oracol ca „trecut”.
   - **POWERPOINT NU SE PORNEȘTE** (POWERPNT 19528 e blocat până la repornirea PC-ului).
   - Word 2007 nu există pe calculator, deci `word2007-*` rămân.
6. **Oracolele nu se ating** (ca în runda 7 §4). Se schimbă doar referințele, scenariile și generatoarele lor.

## Măsurarea, reînghețarea, ieșirea
- **Pornirea** e `D/runde/26/masurare.json`, măsurarea comună a ciclului C.
- **Măsurarea finală** o rulezi tu, SINGUR pe mașină, după ultima scriere în zona înghețată:
  1. copiezi `runde/26/masurare.json` în `runde/26/masurare_ciclu_C.json`;
  2. rulezi `python D/oracole/masoara.py --runda 26 --paralel 3 --compara D/runde/26/masurare_ciclu_C.json --timeout O6=3600`;
  3. rezultatul nou îl copiezi în `runde/26/acoperire_office/masurare.json`;
  4. pui înapoi copia ca `runde/26/masurare.json`. Măsurarea ciclului C trebuie să rămână neschimbată.
- **Reînghețarea:** `python D/ingheata.py --acoperire "dupa ciclul paralel C: deblocatorii platoului O4 Word/Excel (sortare, Esc+Esc, clic, This Device, fara real)"`, apoi `--verifica` = 0.
- **Dovezile brute, logurile și `stare_autor.md`** le pui în `D/runde/26/acoperire_office/`. Raportul îl scrii în `D/runde/26/acoperire_office.md`, cu secțiunile lui `runde/14/acoperire_excel.md`, plus un tabel „scenariu → înainte / după în O4”.
  - Ultima linie a raportului: `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA`, `NU_SE_POATE` sau `PREDARE`.

## Reguli (pe lângă cele din modele)
- **Office-ul omului nu se atinge.**
  - Înainte de fiecare pornire: `tasklist /FI "IMAGENAME eq EXCEL.EXE"` și `… WINWORD.EXE`.
  - Instanța ta e nouă: `DispatchEx` pe desktopul ascuns, `Visible` doar acolo, `DisplayAlerts=0`.
  - Închizi DOAR PID-ul tău. Niciodată `Dispatch` / `GetObject` / `GetActiveObject` / `taskkill /IM`.
  - WINWORD-ul deschis e al omului: nu-l atingi.
- **Nimic pe ecranul omului.** Nicio comandă git care scrie. Nimic în `aplicatii/` (codul bibliotecii nu e al acestei runde). Nicio cale cu numele utilizatorului Windows, nicio dată personală.
- **Contextul:** `stare_autor.md` la zi; la ~200k de context scrii `PREDARE` și te oprești. Ieșirile mari le pui pe disc.

## În plus: textul api din ciclul C (cerut de orchestrator, 21.11 04:10)
Benzile ciclului C (r23, r24, r26) au scris în `api_biblioteca.md` rânduri noi pentru codul pe care l-au schimbat:
- §1: montarea `incadrat: true`;
- §4: oprirea scurtăturilor în câmpuri și gestul `win_<literă>`;
- §6.3: `mutare_focus` nu bifează pasul și nu e greșeală.
Fișierul e în zona înghețată și a rupt lacătul. Orchestratorul a pus la loc versiunea înghețată, iar textul ciclului C e în `D/runde/26/api_biblioteca_ciclu_C.md`.
- Aplici în `api_biblioteca.md` exact diferențele dintre versiunea înghețată și `api_biblioteca_ciclu_C.md` (16 rânduri), după ce verifici că fiecare descrie ce face codul de azi.
- Apoi reînghețarea de mai sus le cuprinde și pe ele.
- Măsurarea ta finală arată dacă oracolele (O7 / O9 citesc api-ul) se mișcă din cauza lor. Fiecare diferență o explici în raport.
