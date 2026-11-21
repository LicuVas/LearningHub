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
(se completează la finalul benzii)

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
