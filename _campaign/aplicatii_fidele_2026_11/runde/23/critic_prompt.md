# Criticul rece, runda 23 (valul B-explorer, a treia rundă; ciclul paralel C), unghiul STARE_FINALA_ERORI — scris de orchestrator, 21.11.2026

N = 23. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/23/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează File Explorer din Windows 11:
  - codul: `explorer.js`, `date/explorer.json` (generat din `referinte/uia_explorer.json`), profilul `explorer_windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=explorer`, cu parametrii din `D/runde/23/gata_pentru_critic.md`.
- **Lecțiile** sunt v/m2-l09…l12, m2-l15, m5-l31, m5-l36 și vi/m3-l18. Drumurile le joci pe poligon, cu conținutul lecției.
- **Criticul 19** (`D/runde/19/critic.md`) a închis E1 și E2 și a găsit două GRAV noi:
  - N1 (`:113`): pe fereastra mică, mesajul central iese sub marginea ecranului;
  - N2 (`:137`): în câmpurile de text, scurtăturile ajung la browser (`aplicatii.js:407`, cod COMUN).
- **Runda 23 le-a reparat** și a adăugat montarea Explorer-ului într-o fereastră străină (A22-1, documentată în api §1). Raportul constructorului e `D/runde/23/raport_constructor.md`; ținta e `D/runde/supliment_B_explorer_runda23.md`.
- **În paralel** au schimbat cod comun:
  - r24 Word: `L.asistent`, §6.3;
  - r26 Windows: `gestTasta`, §4, tasta Windows.
  Regresul comun te privește pentru N2. Pentru celelalte îl notezi, fără să-l atribui rundei 23.

## Ce spune constructorul (de judecat, nu de crezut)
(se completează de orchestrator când banda termină)

## Sarcina
1. **A. N1 și N2.** Pe fiecare joci gestul criticului 19, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - **La N2**, în fiecare câmp:
     - Ctrl+A / C / V / X / Z / Y, Shift+săgeți, Home / End, Backspace / Delete, Ctrl+← / → rămân ale câmpului;
     - F5, Ctrl+R, Alt+←, Ctrl+P, Ctrl+L, F6, F10 se opresc (`defaultPrevented`).
   - **Regresul N2 pe celelalte aplicații** (cod comun):
     - File name din Save As / Open (Word);
     - editarea în celulă și Name Box (Excel);
     - textul din diapozitiv (PowerPoint);
     - caseta din Start (Windows);
     - tastarea, diacriticele și textul de pe telefon (`input`).
2. **B. Unghiul STARE_FINALA_ERORI pe Explorer.** Greșelile tipice:
   - redenumirea cu un nume existent;
   - semnele interzise;
   - Esc în redenumire;
   - Nou › Folder de două ori;
   - Delete, apoi Ctrl+Z;
   - Ctrl+X, apoi Ctrl+V în același folder;
   - Ctrl+V gol;
   - Backspace la rădăcină;
   - căutarea fără rezultat.
   După fiecare: `stare()` = ecranul = referința (scenariile `explorer_*`), evenimentul §4, asistentul §6.3. Ce nu are referință = [FARA_REFERINTA].
3. **C. Montarea (A22-1):**
   - opțiunea documentată în api §1 face ce scrie: fără bara de titlu, evenimentele oprite în rădăcina ei, `stare()` cu titlul, rezistă la redesenarea gazdei;
   - Explorer-ul deschis normal arată și se poartă exact ca înainte (fereastra și meniurile la ±2 px, cele 18 scenarii).
4. **D. Regresul:**
   - închisele și „Ce a trecut” din `19/critic.md`, pe eșantion;
   - fereastra mică și telefonul, pe 2 drumuri.
5. **E.** Ca în reguli.
