# Criticul rece, runda 20 (valul B-word redeschis `B-word#2`, a doua rundă; ciclul paralel B), unghiul STARE_FINALA_ERORI — scris de orchestrator, 21.11.2026

N = 20. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/20/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Word:
  - codul: `word.js`, `date/word.json`, profilurile `word365` / `word2007`;
  - fidel cu Word 365 real și cu ferestrele Windows de salvare / deschidere;
  - poligonul: `aplicatii/poligon.html?aplicatie=word`, cu parametrii din `D/runde/20/gata_pentru_critic.md`.
- **Lecția principală** a drumurilor cu fișiere e `lectii/vii/m1-l03/index.html` (Save As, Open, PDF, atelierul). Drumurile le joci pe poligon, cu conținutul lecției.
- **Criticul 16** (`D/runde/16/critic.md`, unghiul gest_tastatura):
  - a închis cele 8 GRAV vechi;
  - a găsit K1 (`:65`): Tab și Shift+Tab scot focusul din ferestrele modale, iar drumul PDF făcut cu tastele salvează un .docx.
- **Runda 20 a reparat K1**: Word folosește cârligul comun din `aplicatii.js`, ca PowerPoint. Raportul constructorului e `D/runde/20/raport_constructor.md`; ținta e `D/runde/supliment_B_word_runda20.md`.
- **În paralel** au lucrat Explorer (r19, a schimbat mesajul central din `aplicatii.js`), Excel (r21) și Windows (r22).

## Ce spune constructorul (de judecat, nu de crezut)
- **`20/proba_grav.py`:** înainte picau 20 din 33 de verificări, acum pică 3. Toate 3 sunt în asistentul COMUN (`aplicatii.js:628`, pasul „Save” se bifează când Tab doar trece peste Save), niciuna în Word. Asistentul comun nu e treaba rundei 20. Îl confirmi și îl treci ca constatare pentru orchestrator; nu-l număra GRAV al lui Word.
- **K1 ÎNCHIS:**
  - Tab și Shift+Tab nu mai ies din niciuna dintre cele 5 ferestre;
  - Word cheamă `I.tabFereastra(dialog.el, shift)` din cârligul comun, fără să-l schimbe (fără `I.la.fereastra()`, ca să nu dubleze Alt + litera);
  - drumul PDF cu Tab salvează `Pop_Mihai_7A_orar.pdf`, fără .docx și fără rândul gol; drumul `m1-l03:189-192` cu Tab dă .docx și .pdf.
- **stare_finala_erori:**
  - Enter / Space apasă butonul pe care e focusul (înainte, Tab până la Cancel + Enter salva);
  - Esc în „Save your changes…” = „Cancel”, ca la clic;
  - restul drumurilor țineau deja.
- **Tot în `word.js`, MINOR-uri:** Alt+↑, F5, Alt+← / →, Alt+L. Rândurile fără referință sunt R20-1…R20-4 în `de_verificat.md`.
- **Fișiere comune atinse: niciunul.**
- **Regresul Word:**
  - O4 `word-*` = 13, aceleași rânduri;
  - proba 16 dă 0; proba 5 dă 1 (aceeași care pica și la finalul rundei 16); probele 4, telefon, 3, 2 dau 0;
  - O8 = 102 (o dată 103, la Paint m3-l20, apoi 102).
- **Nefăcut:** lista „Vizualizare elemente” nu se atinge cu Tab (ar cere schimbarea cârligului comun); fereastra mică; R16-1…R16-5.

## Sarcina
1. **A. K1.** Joci gestul criticului 16 în fiecare fereastră: Save As, Open, „Save this file”, „Save your changes”.
   - Apoi drumul PDF din m1-l03 (`:192`, `:195`, `:269`), făcut DOAR cu tastatura, până la capăt.
   - Scrii ÎNCHIS sau DESCHIS. Ordinea Tab o compari cu `referinte/uia_word.json`; dacă ai voie conform regulilor, și cu Word real (DispatchEx invizibil, doar PID-ul tău).
2. **B. Unghiul STARE_FINALA_ERORI pe Word**: greșelile tipice ale elevului pe drumurile cu fișiere și formatare.
   - salvare cu nume greșit, apoi corectare;
   - Cancel în Save As, apoi Ctrl+S;
   - Open pe fișierul greșit, apoi Ctrl+W › Don't Save;
   - Ctrl+Z / Ctrl+Y după tastare și după formatare;
   - Esc în fiecare fereastră; salvarea peste un fișier existent; închiderea cu modificări nesalvate.
   După fiecare: `stare()` = ecranul = Word real (scenariile `word-*`, probele COM din `D/runde/5/critic_probe/`), evenimentele §4, asistentul §6.3.
3. **C. Regresul:**
   - cele 8 închise din runda 16, pe eșantion;
   - Word pe fereastra mică (1366×657 la 125%: butonul Save și lista Save as type) și pe telefon, pe 2 drumuri;
   - fiindcă Word a adoptat cârligul comun: PowerPoint, Tab în ferestre, 1 drum;
   - mesajul central la Word (2 gesturi nesimulate), după schimbarea comună din r19.
4. **D.** Ca în reguli.
