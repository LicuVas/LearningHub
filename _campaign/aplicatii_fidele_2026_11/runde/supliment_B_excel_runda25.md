# Supliment la promptul rundei 25 (valul B-excel redeschis `B-excel#2`, a treia rundă; ciclul paralel C) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/25/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul C, benzile sunt:
- r23 Explorer;
- r24 Word;
- r25 Excel;
- r26 Windows.

## Unde suntem
- **Criticul rece 21** (`runde/21/critic.md`, unghiul aspect) a dat **GRAV 0 și GRAV_VECHI_DESCHISE 0**: G17-1 și G17-2 sunt închise.
- **Convergența** cere 3 runde la rând fără GRAV, pe 3 unghiuri diferite. Runda asta e a doua, pe unghiul `gest_tastatura`. Deci prioritatea e să NU aduci un GRAV nou: fiecare schimbare are regresul ei.
- **Pornirea** e `runde/25/masurare_pornire.json`.
- **Codul comun:** nu atingi `aplicatii.js` în runda asta. Îl schimbă alte trei benzi, pe zone separate (r23 `keydown`, r24 `L.asistent`, r26 `gestTasta`). Ce găsești acolo treci în raport, la „Pentru orchestrator”.

## Ținta rundei 25, în ordinea asta
1. **R21-2 + MINOR 1-3 din `21/critic.md`** (aceeași cauză: fereastra de 150 de rânduri):
   - **rotița și bara de derulare:** când ating marginea ferestrei, fereastra se mută și `scrollTop` trece pe noua origine (`scrollTop += OY_vechi − OY_nou`), ca rândurile de pe ecran să nu sară. De la A1048576, rotița urcă până la rândul 1;
   - **↑ și PgUp / PgDn peste marginea ferestrei:** derulează ca pe grila normală (câte un rând la ↑; un ecran la PgDn, constant), fără saltul de 25 / 47 de rânduri (`excel.js:1035-1038`, `:1230-1231`, `:3407`);
   - **fâșia albă de 16 px sub rândul 1048576:** pătrățelul de umplere nu mai lungește grila.
2. **O4: diferențele măsurate față de Excel real.** În măsurarea comună de la finalul ciclului B (`runde/22/iesiri/O4/oracol_comportament.json`), scenariile Excel cu diferențe sunt:
   - `excel-autocompletare-tab`;
   - `excel-autofit-latime`;
   - `excel-numere-afisare`;
   - `excel-separator-virgula`.
   Se adaugă `excel-sortare-doua-niveluri` (neexecutabil).
   - Le repari în `excel.js` / `date/excel.json`, după rezultatul real înregistrat în scenariu, nu după bănuială. Probezi cu O4 doar pe `excel-*` (`LH_IESIRE` în dosarul rundei).
   - Fiecare scenariu reparat = o diferență în minus la măsurarea comună. Așa se dovedește progresul. Altfel, regula de platou oprește valul (aceleași O1-O9 trei runde la rând).
   - Cele „fără real probat” (`excel-tragere-*`) cer gesturi vizibile pe Excel real, deci NU sunt ale tale: rămân în `de_verificat.md`.
3. **MINOR 5-6:**
   - grila cu 2 px mai jos și 3 px mai scurtă față de referință;
   - numele bucăților barelor de derulare („Column left / right”, „Page down / right”) din referință.
   Doar ce e în `excel.js` / `date/excel.json`. MINOR 4 (casetele +3 px) și 7 (zonele sub 32 px) sunt în cod comun, deci nu le atingi.
4. **Unghiul gest_tastatura**, pe drumurile lecțiilor Excel:
   - săgețile; Ctrl+săgeți; Shift+săgeți; Ctrl+Shift+săgeți;
   - Enter / Tab / Shift+Enter / Shift+Tab, în selecție și fără;
   - F2 și Esc în editare; Delete; Ctrl+Z / Y; Ctrl+C / X / V; Ctrl+A; Ctrl+Home / End; PgUp / PgDn; Alt+PgDn;
   - F4 în formulă ($); Alt+= (AutoSum); Ctrl+; (data); Ctrl+Shift+L; Alt+↓ în lista de filtre;
   - KeyTips: Alt, H, … pe comenzile din lecții;
   - Ctrl+1. Dacă nu se emite niciun eveniment din cauza codului comun (`gestTasta`), îl treci la „Pentru orchestrator”, nu-l repari.
   La fiecare: evenimentul §4, starea, ecranul, comparate cu scenariile `excel-*` și cu referințele. Ce nu are referință: rând `R25-…`.
5. **Apoi**, cât îți ajunge contextul, R21-1, R21-3, R21-4, doar acolo unde găsești referință.

## Gata înseamnă
- `runde/25/proba_grav.py`: verificările picate la pornire și câte pică la final.
- Regresul Excel:
  - G17-1 / G17-2 (`runde/21/proba_grav.py`);
  - probele vechi (10, 9, 8, 6);
  - O4 pe scenariile `excel-*` (57/64 la pornire), fără să scadă niciunul.
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”. Ar trebui să fie niciunul.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` la ~200k de context.
