# Criticul rece, runda 27 (valul B-explorer redeschis `B-explorer#2`; ciclul paralel D), unghiul ASPECT — scris de orchestrator, 21.11.2026

N = 27. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/27/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează File Explorer din Windows 11:
  - codul: `explorer.js`, `date/explorer.json` (generat din `referinte/uia_explorer.json`), profilul `explorer_windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=explorer`, cu parametrii din `D/runde/27/gata_pentru_critic.md`.
- **Lecțiile** sunt v/m2-l09…l12, m2-l15, m5-l31, m5-l36 și vi/m3-l18.
- **Criticul 23** (`D/runde/23/critic.md`, unghiul stare_finala_erori) a dat GRAV 0. Predarea lui: MINOR 4 (redesenarea gazdei salvează numele neterminat), MINOR 1 (meniurile mai înalte decât fereastra), MINOR 2 (Ctrl+Z în căutare).
- **Runda 27** le-a lucrat, apoi unghiul aspect. Raportul constructorului e `D/runde/27/raport_constructor.md`; ținta e `D/runde/supliment_B_explorer_runda27.md`.
- **În paralel** au schimbat cod comun:
  - r28 Word: `L.asistent` (§6.3);
  - r30 Windows: `gestTasta`, `leagaGesturi` › `pointerdown`, `L.deschideSuprafata`, `I.emite`, și legarea Explorer-ului montat în fereastra shell-ului.
  Ce vezi la Explorer din cauza lor notezi cu ora, fără să atribui rundei 27. Montarea în Windows o judecă criticul 30; tu verifici doar că Explorer-ul deschis normal și opțiunea `incadrat: true` pe o gazdă proprie se poartă ca la criticul 23.

## Ce spune constructorul (de judecat, nu de crezut)
(se completează la finalul benzii)

## Sarcina
1. **A. GRAV vechi:** niciunul deschis. Verifici pe eșantion că N1, N2 și G23-1 rămân închise.
   - **MINOR 4, 1, 2:** gestul criticului 23, apoi un gest vecin. Scrii ÎNCHIS sau DESCHIS, cu proba ta.
2. **B. Unghiul ASPECT pe Explorer**, față de `referinte/uia_explorer.json` și scenariile `explorer_*`:
   - fereastra, bara de comenzi, panoul de navigare, lista în vederile din lecții, bara de stare;
   - meniurile Nou, Sortare, Vizualizare și meniul contextual, la ±2 px acolo unde referința are dreptunghiuri;
   - fonturile și pictogramele;
   - laptopul la 125 % (1366×657), telefonul (360-390 px) și tabla SMART (1920×1080).
   Ce nu are referință = [FARA_REFERINTA].
3. **C. Regresul:**
   - „Ce a trecut” din `23/critic.md`, pe eșantion;
   - cele 18 scenarii Explorer (O4);
   - opțiunea `incadrat: true` pe o gazdă proprie (`23/critic_probe/c_mont.py`);
   - asistentul pe 1 drum (schimbat de r28).
4. **D.** Ca în reguli.
