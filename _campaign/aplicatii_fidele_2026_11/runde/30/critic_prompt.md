# Criticul rece, runda 30 (valul B-windows redeschis `B-windows#2`; ciclul paralel D), unghiul ASPECT — scris de orchestrator, 21.11.2026

N = 30. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/30/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează shell-ul Windows 11:
  - bara de activități, Start (cu „Toate” și căutarea), meniul desktopului, și de acum Explorer-ul bibliotecii montat într-o fereastră a shell-ului;
  - codul: `windows.js`, `date/windows.json` (generat de `_unelte/genereaza_windows.py` din `referinte/uia_windows.json`), profilul `windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=windows`, cu parametrii din `D/runde/30/gata_pentru_critic.md`.
- **Criticul 26** (`D/runde/26/critic.md`) a lăsat 3 GRAV:
  - W4 (`:66`, vechi, parțial): Explorer-ul nu se montează din bara de activități;
  - N1 (`:99`): focusul cade pe `<body>` după redenumirea pe desktop;
  - N2 (`:120`): Windows + Spațiu deschide Start și tace.
- **Runda 30 le-a lucrat:**
  - N1 în `windows.js`;
  - N2 în codul COMUN `gestTasta` (orice tastă cu Windows ținut = `win_<tastă>`, doar cu `I.tastaWindows`);
  - W4: A23-1 P1 + P2 (cod comun: `leagaGesturi` › `pointerdown`, `L.deschideSuprafata`), apoi legarea montării în `windows.js`;
  - poate A26-2 (`I.emite` cu `extra`, Start la ridicarea tastei).
  Textul pentru api (§1, §4) e propus în `D/runde/30/api_propunere.md` (api-ul e înghețat; nu-l număra ca lipsă de documentare). Raportul constructorului e `D/runde/30/raport_constructor.md`; ținta e `D/runde/supliment_B_windows_runda30.md`.
- **În paralel** au schimbat cod comun:
  - r28: asistentul (`L.asistent`: tastarea în câmp nu mai e greșeală, deci și în caseta din Start);
  - r27: `explorer.js` (MINOR 4, redesenarea gazdei în timpul redenumirii).
  Ce vezi la Windows din cauza lor notezi, fără să atribui rundei 30.

## Ce spune constructorul (de judecat, nu de crezut)
- **`30/proba_grav.py --minor4`:** la pornire 51 de verificări picate din 69, la final 0 din 123.
- **N1 ÎNCHIS** (9 → 0 / 19): după Enter, Esc sau nume gol focusul rămâne în aplicație, iar pictograma selectată; Delete → Coș, F2 → redenumire, tasta Windows → Start.
- **N2 ÎNCHIS** (31 → 0 / 38): Windows + Spațiu, 1, punct, virgulă, Tab, ↑ dau câte un gest `win_*`, mesajul („Windows + Spațiu” etc.) și Start închis.
- **W4 ÎNCHIS** (4 → 0 / 28; telefon 2 → 0 / 8):
  - A23-1 P1 + P2 aplicate; dosarul galben, Windows + E și „Explorer” din Start deschid Explorer-ul bibliotecii montat într-o fereastră a shell-ului;
  - titlul urmează folderul; minimizarea, readucerea, închiderea și redesenarea gazdei păstrează starea și focusul; redenumirea în timpul redesenării trece (r27 a scris `MINOR4_GATA`);
  - a doua deschidere aduce în față fereastra existentă, deși Windows real deschide una nouă (A30-1);
  - pe telefon (360 / 390), dosarul galben apare doar după o glisare a barei (R30-6).
  - Nereparat, cod comun din afara zonelor lui: cât Explorer-ul e montat, lista de ținte a Windows-ului include și țintele Explorer-ului. Judecă dacă încurcă asistentul sau evenimentele.
- **A26-2 făcut** (3 → 0 / 5): Start se deschide la ridicarea tastei Windows; la Windows + E nu mai clipește.
- **MINOR start_fundal** făcut; **pe drum, în `windows.js`:** după ~15 activări Start se deschidea sub ferestre; maximizarea ieșea 1-2 px sub bară (S3).
- **`aplicatii.js`, doar zonele lui:** `I.emite` (:121), `deschideSuprafata` (:187-188), `WIN_COD` + `tastaWin` + începutul lui `gestTasta` (:269-298), `pointerdown` (:350-353); diff în `runde/30/diff_aplicatii_js_runda30.txt`.
- **Regresul:** Ctrl / Meta + tastă, clic, clic dreapta: 0 diferențe pe Word, Excel, PowerPoint, Explorer (39 de evenimente fiecare); O4 42 / 42 înainte și după; probele r22 0 / 50, r18 0 / 37; r26 4 / 84 (2 voite: Windows + E deschide acum Explorer-ul; 2 = A26-1).
- **De aprobat / de verificat:** A30-1; R30-1…R30-6.

## Sarcina
1. **A. W4, N1, N2.** Joci gestul criticului 26, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - **La W4:** clicul pe dosarul galben din bară și Windows + E deschid Explorer-ul bibliotecii într-o fereastră a shell-ului; fereastra se minimizează, se readuce, se maximizează și se închide ca celelalte; clicurile din Explorer nu ajung la gazdă (niciun eveniment cu aplicația „windows” pentru un clic în Explorer); redenumirea în Explorer rezistă la redesenarea gazdei; drumul lecțiilor „clic pe dosarul galben → Explorer → folderul …” se duce la capăt.
   - **Regresul schimbărilor comune:** Ctrl+tastă pe Word, Excel, PowerPoint și Explorer dă exact aceleași evenimente ca înainte; Explorer-ul deschis normal arată și se poartă ca înainte; un clic pe o aplicație nemontată se poartă ca înainte.
2. **B. Unghiul ASPECT pe shell**, față de `referinte/uia_windows.json`:
   - bara de activități, Start (Fixate, „Toate”, căutarea), meniul desktopului, fereastra Explorer montată;
   - la 1366×768, la ±2 px acolo unde referința are dreptunghiuri; fonturile și pictogramele;
   - laptopul la 125 % (1093×526), telefonul (360 / 390) și tabla SMART (1920×1080).
   Ce nu are referință = [FARA_REFERINTA]. Programele PC-ului de referință (aplicațiile fixate, utilitarele) sunt o decizie deschisă a lui Vasile („conținutul calculatorului”): le notezi, nu le numeri GRAV.
3. **C. Regresul:**
   - K1, K2, K3, W1, W2, W3, W5 și „Ce a trecut” din `26/critic.md`, pe eșantion;
   - asistentul pe drumul „Windows, pai, Enter” și pe un drum cu clicuri.
4. **D.** Ca în reguli. Datele personale: nimic din calculatorul omului în ieșiri.
