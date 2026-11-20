# Criticul rece, runda 21 (valul B-excel redeschis `B-excel#2`, a doua rundă; ciclul paralel B), unghiul ASPECT — scris de orchestrator, 21.11.2026

N = 21. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/21/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Excel 365:
  - codul: `excel.js`, `date/excel.json`, profilul `excel365`;
  - poligonul: `aplicatii/poligon.html?aplicatie=excel`, cu parametrii din `D/runde/21/gata_pentru_critic.md`.
- **Lecțiile Excel** sunt în `lectii/` (de ex. m2-l11, graficele). Drumurile le joci pe poligon, cu conținutul lecției.
- **Criticul 17** (`D/runde/17/critic.md`, unghiul stare_finala_erori):
  - a închis X10, A1, T1;
  - a găsit G17-1 (`:64`): grila albă după Ctrl+↓;
  - a găsit G17-2 (`:82`): degetul care derulează grila mută celula activă fără eveniment.
- **Runda 21 le-a reparat**, plus problema asistentului §6.3 (`aplicatii.js:627-628`), dacă §6.3 era limpede. Raportul constructorului e `D/runde/21/raport_constructor.md`; ținta e `D/runde/supliment_B_excel_runda21.md`.
- **În paralel** au lucrat Explorer (r19, mesajul central în `aplicatii.js`), Word (r20) și Windows (r22).

## Ce spune constructorul (de judecat, nu de crezut)
- **Ambele se reproduceau pe codul de azi.** În `21/proba_grav.py` picau 13; acum pică 0 din 21. Le-a reparat doar în `excel.js`.
- **G17-1:**
  - grila desenează o fereastră de 150 de rânduri / 30 de coloane în jurul celulei active, cu numerele adevărate ale rândurilor (3.900 de celule în DOM, nu 78.000);
  - la A1048576 se văd 24 de rânduri, iar valoarea tastată apare pe ecran;
  - focusul rămâne în celulă, iar Ctrl+↑ / Ctrl+Home / ↑ emit din nou;
  - XFD7 se vede întreagă.
- **G17-2:** degetul tras pe grilă doar derulează, fără schimbare de stare. Atingerea scurtă alege celula și emite `clic / selectare_celula`.
- **§6.3 neatins:** textul e ambiguu pentru un pas cu și `tinta`, și `asteapta`. Ambele citiri sunt în `D/de_aprobat.md` la A21-1, pentru Vasile. Nu-l număra GRAV; confirmă doar ce face codul azi.
- **Fișiere comune atinse: niciunul.** Diferența din `aplicatii.js` e a benzii Explorer (r19).
- **Regresul Excel:** O4 57/64 înainte și după (aceleași 12 unități). Probele vechi: 0·0·0·0·2·0·3·0, ca la runda 17.
- **Fără referință** (`de_verificat.md`, R21-1…R21-4):
  - lățimea antetului la 7 cifre;
  - rotița peste fereastră (urcă doar 150 de rânduri);
  - Ctrl+Shift+↓ după ultimul bloc;
  - degetul pe grilă pe ecran tactil.
- **Nefăcut:** MINOR 2 (listele la +3/+4 px; constructorul zice că deplasarea vine de la butonul din panglică, care e cod comun).
- **De judecat la aspect:** fereastra de 150 de rânduri se vede ca o grilă continuă la derularea cu rotița și cu bara de derulare (fără salturi, fără goluri, fără rânduri dublate)?

## Sarcina
1. **A. G17-1 și G17-2.** Joci gestul criticului 17, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - **G17-1:** Ctrl+↓ / Ctrl+→ / Ctrl+End până la marginea foii, tastare acolo, Ctrl+Home înapoi, derularea cu rotița departe și înapoi.
   - **G17-2:** pe telefon (`page.touchscreen`), derulare cu degetul pe grilă, atingere scurtă pe celulă, atingere lungă.
   - Dacă s-a reparat §6.3 în `aplicatii.js`: comportamentul asistentului pe toate aplicațiile, pe eșantion.
2. **B. Unghiul ASPECT pe Excel**, față de referințele capturate (`referinte/`, scenariile `excel-*`):
   - grila (anteturi, linii, celula activă, selecția, umplerea);
   - panglica pe tab-urile din lecții (Home, Insert, Formulas, Data);
   - bara de formule, Name Box, tab-urile foilor, bara de stare;
   - graficele din m2-l11 (Line, Column, Data Labels);
   - ferestrele (Format Cells, Insert Function), măsurate la ±2 px acolo unde referința are dreptunghiuri.
   Și pe laptopul de 125% (1366×657), pe telefon (360-390 px) și pe tabla SMART (1920×1080).
3. **C. Regresul:**
   - X10, A1, T1 și „Ce a trecut” din `17/critic.md`, pe eșantion;
   - dacă banda a atins `aplicatii.js`: derularea cu degetul și mesajul central pe Word, PowerPoint, Explorer, Windows (1 drum fiecare).
4. **D.** Ca în reguli.
