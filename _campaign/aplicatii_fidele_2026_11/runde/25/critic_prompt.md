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
(se completează de orchestrator când banda termină)

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
