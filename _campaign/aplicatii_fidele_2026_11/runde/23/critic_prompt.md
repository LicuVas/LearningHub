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
- **`23/proba_grav.py`:** 20 de verificări picate din 76 la pornire, acum 2. Cele 2 sunt partea comună a montării, cerută prin A23-1. Scenariile Explorer: 18/18.
- **N1 ÎNCHIS** (`explorer.js:49`): pe fereastra mică (1093×526 la 125 %), mesajul central e în ecran, deasupra a tot. La 1366×768 fereastra rămâne de 640 px.
- **N2 ÎNCHIS** (`aplicatii.js:415-426`; api §4 `:191-194`): în caseta de nume, adresă și căutare, F5, Ctrl+R, Alt+←, Ctrl+P etc. se opresc, iar tastele de editare merg ca înainte.
  - Regresul pe Word, Excel, PowerPoint și Windows: 89 de pași înainte / după.
  - 11 diferențe sunt așteptate (F12, Ctrl+S, Ctrl+P, F5, Ctrl+R, Alt+← în câmpuri sunt acum oprite). Atenție: F12 / Ctrl+S în File name din Save As trebuie să facă tot ce făceau în Word, nu doar să fie oprite. Verifică.
  - Scrisul, diacriticele și Ctrl+A / C / V / Z sunt identice.
- **GRAV nou, găsit și reparat de el** (`explorer.js:508-511`): redenumirea cu `\ / : * ? " < > |` strica starea („a/b” făcea fișierul să dispară). Acum numele rămâne și apare mesajul central.
- **Montarea (A22-1):** `deschide('explorer', {loc, incadrat: true})`:
  - fără bara de titlu și Coș, umple gazda;
  - evenimentele oprite în rădăcina ei;
  - `stare().titlu` („<folder> - Explorer”);
  - la redesenarea gazdei, gazda pune înapoi `radacina` și cheamă `focus()`;
  - documentată în §1 (`:38-41`).
  Rămân două probleme: gazda primește și ea clicurile, iar `deschideSuprafata` ia prima aplicație vie. Amândouă cer cod comun din afara zonei lui (patch în `23/propunere_comun_A22-1.md`, cererea A23-1, neaplicat). Nu le număra GRAV ale rundei 23; confirmă doar starea.
- **Fără referință:** R23-1…5 în `de_verificat.md`; A23-2 în `de_aprobat.md`.
- **Nefăcut:** MINOR-urile din criticii 19 / 15.

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
