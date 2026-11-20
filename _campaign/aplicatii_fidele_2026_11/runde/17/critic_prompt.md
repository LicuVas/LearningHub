# Criticul rece, runda 17 (valul B-excel redeschis), unghiul STARE_FINALA_ERORI — scris de orchestrator, 20.11.2026

N = 17. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/17/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Excel (`excel.js`, `date/excel.json`), fidel cu Excel 365 real.
  - Poligonul e `aplicatii/poligon.html?aplicatie=excel`; parametrii de conținut sunt în `D/runde/17/gata_pentru_critic.md`.
- **Lecția-țintă** a rundei e `lectii/viii/m2-l11/index.html` (graficele). Lecțiile folosesc încă simulatoarele vechi, așa că drumurile le joci pe poligon, cu conținutul lecției.
- **Valul Excel s-a oprit în runda 10** cu 3 GRAV (`D/runde/10/critic.md`): X10 (`:34`), A1 (`:64`), T1 (`:129`).
  - Runda `acoperire` 14 a capturat din Excel real ce lipsea pentru X10 (`D/runde/14/acoperire_excel.md`):
    - galeria Insert Line or Area Chart;
    - Add Chart Element;
    - Data Labels (lista diferă la Line și la Clustered Column);
    - vărsarea, `#SPILL!`, Ctrl+săgeți.
  - Referințele: `referinte/uia_excel.json › acoperire_r14` și listele `lista.ChartTypeLineInsertGallery`, `lista.AddChartElementMenu…`, plus 11 scenarii `scenarii/excel/` + `referinte/scenarii_real/`.
- **Runda 17 le-a reparat.** Raportul constructorului e `D/runde/17/raport_constructor.md`, iar ținta e în `D/runde/supliment_B_excel_runda17.md`.

## Ce spune constructorul (de judecat, nu de crezut)
- **X10, A1, T1:** închise.
  - `runde/17/proba_grav.py`: 16 din 18 verificări picau la pornire, 0 pică la final.
  - T1 e reparat în `excel.js`: ținta textului de pe telefon se calculează în Excel, fără cod comun.
  - A1: ștergerea graficului pe telefon a rămas deschisă, fără referință (R17-1).
- **Cele 11 scenarii noi trec** (la pornire nu trecea niciunul). O4 pe Excel a coborât de la 44 la 12; cele 12 rămase ar fi căderile vechi.
- **Deschise de el:**
  - R17-1…R17-3 (Backspace / Cut cu graficul ales; etichetele la Bar / Pie; etichetele după Change Chart Type);
  - A17-1: după Ctrl+↓ / Ctrl+→, grila nu se lungește până la A1048576 / XFD. Adresa e corectă în stare și în Name Box, dar celula nu se vede.
- **Pe asistent:** cu asistentul criticului 10, indiciul apare după a doua literă la fel pe telefon și pe calculator, „fiindcă §6.3 numără literele ca greșeli”. Judecă asta pe textul §6.3 din `D/api_biblioteca.md` și pe ce cere lecția.

## Sarcina
1. **A. Cele 3 GRAV vechi** (X10, A1, T1). La X10 joci drumul lecției m2-l11 de la capăt la capăt, cu mouse-ul ȘI cu tastele (Alt, N, …; Alt, J C, A, D, …), apoi compari:
   - lista galeriei și submeniul Data Labels cu referința, rând cu rând (nume, ordine, taste de acces);
   - starea finală (tipul graficului, etichetele pe serie) cu scenariile reale.
   La A1 și T1 lucrezi pe telefon (375×667, atingeri și tastatura care compune).
2. **B. Unghiul STARE_FINALA_ERORI pe Excel.** Greșelile tipice ale elevului pe drumurile m2-l11 și din scenariile noi:
   - alege alt tip de grafic, apoi Ctrl+Z;
   - pune etichetele, apoi le scoate cu None;
   - Esc la jumătatea unei galerii;
   - formula vărsată peste o celulă plină (`#SPILL!`), apoi golirea celulei;
   - Ctrl+↓ până la capăt și înapoi;
   - Delete pe grafic, apoi Ctrl+Z.
   După fiecare: starea finală (`stare()`) = ecranul = Excel real (scenariile), evenimentele §4, asistentul §6.3, mesajul „nesimulat” acolo unde nu e simulat.
3. **C. Regresul:**
   - X1-X9, K1-K6, E1-E5, A2 (închise în rundele 6-10, `D/runde/10/critic.md:98-125`), pe eșantion;
   - Excel pe fereastra mică (1366×657 la 125%) și pe telefon, pe 2-3 drumuri.
4. **D.** Ca în reguli.
