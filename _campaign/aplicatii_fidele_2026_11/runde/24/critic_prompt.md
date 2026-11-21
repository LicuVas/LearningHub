# Criticul rece, runda 24 (valul B-word redeschis `B-word#2`, a treia rundă; ciclul paralel C), unghiul ASPECT — scris de orchestrator, 21.11.2026

N = 24. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/24/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Word:
  - codul: `word.js`, `date/word.json`, profilurile `word365` / `word2007`;
  - fidel cu Word 365 real și cu ferestrele Windows de salvare / deschidere;
  - poligonul: `aplicatii/poligon.html?aplicatie=word`, cu parametrii din `D/runde/24/gata_pentru_critic.md`.
- **Lecția principală** a drumurilor cu fișiere e `lectii/vii/m1-l03/index.html`.
- **Criticul 20** (`D/runde/20/critic.md`) a dat GRAV 0. Constatările lui pentru orchestrator, despre asistentul comun (`:99-110`), au fost date rundei 24.
- **Runda 24 a schimbat:**
  - asistentul comun (`L.asistent`: Tab / `mutare_focus` nu bifează pasul și nu e greșeală; §6.3 din api; A24-1 în `de_aprobat.md`);
  - MINOR-urile Word (Alt+F4 în ferestre, mesajul de eroare după salvarea reușită, fereastra mică);
  - aspectul.
  Raportul constructorului e `D/runde/24/raport_constructor.md`; ținta e `D/runde/supliment_B_word_runda24.md`.
- **În paralel** au schimbat cod comun:
  - r23 Explorer: `keydown` / `preventDefault` în câmpuri, api §1;
  - r26 Windows: `gestTasta`, tasta Windows.
  Regresul lor la Word îl notezi, fără să-l atribui rundei 24.

## Ce spune constructorul (de judecat, nu de crezut)
- **`24/proba_grav.py`:** 13 verificări picate din 19 la pornire, acum 0.
- **Asistentul** (`aplicatii.js` › `L.asistent`, rândurile cu `doarFocus`, ~`:663-672`; §6.3 din api):
  - Tab / Shift+Tab care doar mută focusul nu bifează pasul și nu e greșeală;
  - un pas cu `asteapta` hotărăște singur, ca înainte;
  - Save se bifează doar la salvarea adevărată, la Word și la PowerPoint;
  - O9: 13 înainte, 13 după, aceleași cazuri.
- **O4 `word-*`:** 13 → 13. Constructorul spune că cele două rânduri nu se pot repara cinstit în `word.js`:
  - `clic-pune-cursorul`: o asimetrie a hamului de măsură, sub un pixel;
  - `imagine-inserare`: cere „This Device” dintr-un meniu închis;
  - le-a trecut ca R24-1, R24-2. Judecă afirmația dacă poți, cu proba ta.
- **MINOR-uri făcute în `word.js`:**
  - Alt+F4 închide fereastra ca Cancel (cu sursă Microsoft);
  - mesajul de eroare dispare la salvarea reușită;
  - pe fereastra mică, Save / Cancel și rândul PDF încap în ecran, iar Tab aduce butonul în vedere;
  - la 1366×768 dreptunghiurile au rămas ale referinței.
- **Aspectul la 1366×768:** 5 ferestre și 4 file, la ±2 px.
- **Regresul Word:** proba 20 a coborât de la 3 la 2 (rămâne Save bifat la salvarea refuzată: regulă nouă în asistent, pentru orchestrator); probele 16, 4, telefon, 3, 2 dau 0.
- **Nefăcut:** „already exists” cu întrebarea de înlocuire (fără referință, R24-4).

## Sarcina
1. **A. GRAV vechi:** niciunul deschis.
   - Verifici pe eșantion că K1 (critic 16 / 20) rămâne închis: Tab în cele 5 ferestre, drumul PDF doar cu tastele.
   - **Asistentul schimbat:**
     - drumul PDF cu tastele nu mai cheamă bula după pași buni;
     - pasul Save se bifează doar la salvarea adevărată;
     - pe Word, Excel, PowerPoint, Explorer, Windows, o greșeală adevărată (clic în gol) tot cheamă indiciul după 2.
2. **B. Unghiul ASPECT pe Word**, față de referințe (`referinte/uia_word.json`, scenariile `word-*`):
   - fereastra și panglica pe filele din lecții (Home, Insert, Layout, View);
   - Backstage;
   - Save As / Open / Save this file / Save your changes, la ±2 px acolo unde referința are dreptunghiuri;
   - fonturile și pictogramele;
   - laptopul la 125 % (1366×657), telefonul (360-390 px) și tabla SMART (1920×1080).
3. **C. Regresul:**
   - cele 8 închise în r16 și K1, pe eșantion;
   - scenariile `word-*` (O4);
   - PowerPoint, Tab în fereastră (asistentul comun);
   - Excel, Explorer și Windows pornesc, cu un asistent pe 1 drum fiecare.
4. **D.** Ca în reguli.
