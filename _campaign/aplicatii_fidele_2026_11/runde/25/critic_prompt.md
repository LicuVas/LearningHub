# Criticul rece, runda 25 (valul B-excel redeschis `B-excel#2`, a treia rundă; ciclul paralel C), unghiul GEST_TASTATURA — scris de orchestrator, 21.11.2026

N = 25. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/25/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Excel 365:
  - codul: `excel.js`, `date/excel.json`, profilul `excel365`;
  - poligonul: `aplicatii/poligon.html?aplicatie=excel`, cu parametrii din `D/runde/25/gata_pentru_critic.md`.
- **Criticul 21** (`D/runde/21/critic.md`, unghiul aspect) a dat GRAV 0: G17-1 și G17-2 sunt închise.
- **Runda 25 a reparat** R21-2 și MINOR 1-3 (fereastra de 150 de rânduri: rotița, ↑, PgDn, fâșia de jos) și MINOR 5-6, apoi a lucrat pe unghiul gest_tastatura. Raportul constructorului e `D/runde/25/raport_constructor.md`; ținta e `D/runde/supliment_B_excel_runda25.md`.
- **În paralel** au schimbat cod comun:
  - r23: `keydown` / `preventDefault` în câmpuri, deci și în editarea din celulă și în Name Box;
  - r24: asistentul;
  - r26: `gestTasta`.
  Ce vezi la Excel din cauza lor notezi cu ora, fără să atribui rundei 25.

## Ce spune constructorul (de judecat, nu de crezut)
- **`25/proba_grav.py`:** 9 verificări picate din 13 la pornire, acum 0. A schimbat doar `excel.js`. Regresul Excel e 0: G17-1 / G17-2 (r21) și probele 17, 10, 9, 8, 6.
- **R21-2 / MINOR 1-3:**
  - rotița, bara și „Line up” trec de marginea ferestrei, până la rândul 1;
  - ↑ coboară vederea câte un rând, iar PgDn are pas constant (23 de rânduri);
  - fâșia de 16 px a dispărut;
  - grila normală e neschimbată.
- **MINOR 5-6:** grila stă la y 220, iar barele au numele din referință („Column left / right”, „Page up / down / left / right”).
- **O4 `excel-*`:** 57/64 → 59/64, dar unitățile rămân 12 → 12.
  - `numere-afisare` și `autofit-latime` trec acum.
  - `sortare-doua-niveluri` nu mai e neexecutabil (ținta nouă `camp:Order#2` în `deseneazaNiveluri`), dar dă 8 diferențe. Constructorul spune că rezultatul real înregistrat e greșit: `acoperire_excel_r7.py:1113` a sortat Punctaj crescător, deși pasul cere „Largest to Smallest”. Orchestratorul a păstrat ținta. Judecă dacă simulatorul face ce cere pasul.
  - `autocompletare-tab` și `separator-virgula` au câte o diferență, despre care constructorul spune că ține de scenariu (realul citește după Esc + Esc).
- **gest_tastatura (54 de gesturi):**
  - Ctrl+; și Ctrl+1 nu emit niciun eveniment (`gestTasta` comun, notat pentru orchestrator);
  - Ctrl+PgDn pe ultima foaie mută celula 23 de rânduri, deși `viii/m1-l03:197` spune „te lasă pe loc”. Judecă: e GRAV pe drumul lecției?
  - PgDn, Alt+PgDn, Alt+↓ și Ctrl+A de două ori diferă de Excel, dar n-au referință: R25-5…9.
- **Fișiere comune atinse: niciunul.**

## Sarcina
1. **A. GRAV vechi:** niciunul deschis.
   - Verifici pe eșantion că G17-1 și G17-2 rămân închise.
   - R21-2 / MINOR 1-3: de la A1048576, rotița urcă până la rândul 1 fără salturi, ↑ derulează câte un rând, PgDn e constant, fără fâșia albă.
2. **B. Unghiul GEST_TASTATURA pe Excel**, pe drumurile lecțiilor:
   - săgețile; Ctrl / Shift / Ctrl+Shift + săgeți;
   - Enter / Tab / Shift+Enter / Shift+Tab, în selecție și fără;
   - F2, Esc, Delete;
   - Ctrl+Z / Y / C / X / V / A, Ctrl+Home / End, PgUp / PgDn, Alt+PgDn;
   - F4 în formulă, Alt+=, Ctrl+;, Ctrl+Shift+L, Alt+↓ în filtre;
   - KeyTips pe comenzile din lecții;
   - Ctrl+1.
   Pe fiecare: evenimentul §4, starea, ecranul, comparate cu scenariile `excel-*`, cu referințele și, unde ai voie, cu Excel real (DispatchEx invizibil, PID-ul tău). Ce nu are referință = [FARA_REFERINTA].
3. **C. Regresul:**
   - X10, A1, T1 și „Ce a trecut” din `21/critic.md`, pe eșantion;
   - O4 `excel-*`;
   - aspectul la 1366×768 pe 3-4 suprafețe (grila, Home, bara de formule, Format Cells);
   - telefonul și tabla SMART.
4. **D.** Ca în reguli.
