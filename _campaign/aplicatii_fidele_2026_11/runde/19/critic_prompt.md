# Criticul rece, runda 19 (valul B-explorer, a doua rundă; ciclul paralel B), unghiul GEST_TASTATURA — scris de orchestrator, 21.11.2026

N = 19. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/19/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează File Explorer din Windows 11:
  - codul: `explorer.js`, `date/explorer.json` (generat din `referinte/uia_explorer.json`), profilul `explorer_windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=explorer`, cu parametrii din `D/runde/19/gata_pentru_critic.md`.
- **Lecțiile** care îl cer sunt v/m2-l09…l12, v/m2-l15, v/m5-l31, v/m5-l36 și vi/m3-l18. Ele folosesc încă simulatoarele vechi, așa că drumurile le joci pe poligon, cu conținutul lecției.
- **Criticul 15** (`D/runde/15/critic.md`, unghiul aspect) a găsit 2 GRAV:
  - E1 (`:116`): mesajul „aici nu e simulată” e șters de redesenare;
  - E2 (`:140`): redenumirea pe telefon.
- **Runda 19 le-a reparat.** E1 s-a reparat în codul COMUN `aplicatii.js`, pentru toate aplicațiile. Raportul constructorului e `D/runde/19/raport_constructor.md`; ținta e `D/runde/supliment_B_explorer_runda19.md`.
- **În paralel cu runda 19** au lucrat Word (r20), Excel (r21) și Windows (r22), în același worktree. Regresul pe codul comun te privește doar pentru schimbările acestei runde.

## Ce spune constructorul (de judecat, nu de crezut)
- **`19/proba_grav.py`** are 94 de verificări, pe gesturi reale: 42 picau pe codul de dinainte, acum pică 0. Cele 18 scenarii Explorer trec toate.
- **E1:**
  - `aplicatii.js` › `nesimulat` (rândurile 220-249; vechiul 229 e acum 233): mesajul rămâne sub rădăcina aplicației și e pus înapoi după redesenare;
  - pe 10 gesturi e vizibil la +40, +400 și +1500 ms, rezistă la a doua redesenare și pleacă după ~5 s.
- **E2:** redenumirea merge la 360 și 390 px: folder nou, „Redenumire” din bară, F2, Enter sau atingere în afară, Esc.
  - A reparat și un defect găsit pe drum: clicul în casetă punea la loc numele vechi.
  - Dovedit doar în Chromium headless.
- **gest_tastatura:**
  - Alt+Enter = Proprietăți cu mesaj, ca în referință (înainte intra în folder);
  - Ctrl+Shift+C = mesajul „Copiere ca o cale”;
  - tastele fără referință au rămas cum erau: R19-1 … R19-7 în `de_verificat.md`.
- **Regresul mesajului central:** Word, Excel, PowerPoint și Windows trec câte 2 din 2, la fel înainte și după (ele nu-și rescriu rădăcina). O4 (47 de scenarii), O5 și O9 au ieșit identice pe copia de dinainte și pe cea de după.
- **Fișiere comune atinse:** doar `aplicatii.js` › `nesimulat`. În rest, doar `explorer.js`.
- **Nefăcut:** MINOR-urile de aspect din critic 15 și Proprietăți simulat.
- **De judecat:** „pus înapoi după redesenare” înseamnă că mesajul clipește sau dispare un cadru? Se suprapune cu un al doilea mesaj? Rămâne în urmă când aplicația se închide sau când se deschide alta? Fereastra Windows (r22) s-a schimbat în paralel; încearcă mesajul și acolo, inclusiv pe fereastra goală Paint / Calculator.

## Sarcina
1. **A. E1 și E2.** Pe fiecare joci gestul criticului 15, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - **E1:** cele 9 gesturi nesimulate din `15/critic.md`. Mesajul apare, rămâne vizibil cât cere `api_biblioteca.md`, are `data-lh-nesimulat`, apoi dispare curat (nu rămâne lipit, nu acoperă clicul următor).
   - **E2:** pe telefon (`page.touchscreen`, 360-390 px): Nou › Folder → nume → Enter / atingere în afară; Redenumire din bara de comenzi; F2.
2. **B. Unghiul GEST_TASTATURA pe Explorer**, pe drumurile lecțiilor:
   - săgețile în conținut; Enter; Backspace / Alt+← / Alt+→ / Alt+↑;
   - F2, Delete, Shift+Delete, Ctrl+C / X / V / Z / A, Ctrl+Shift+N;
   - F4 / Ctrl+L / Alt+D pe bara de adrese, Ctrl+E / Ctrl+F pe căutare, F5;
   - Tab / Shift+Tab între zone; meniul contextual cu Shift+F10 sau tasta Meniu; Esc în meniuri și în redenumire.
   Pe fiecare: evenimentul §4, starea, ecranul, asistentul §6.3. Ce nu are referință = [FARA_REFERINTA], nu GRAV.
3. **C. Regresul:**
   - închisele și „Ce a trecut” din `15/critic.md`, pe eșantion (fereastra + meniurile la ±2 px, cele 18 scenarii);
   - **mesajul central pe TOATE aplicațiile** (Word, Excel, PowerPoint, Windows): câte 2 gesturi nesimulate fiecare, fiindcă E1 a schimbat codul comun;
   - fereastra mică (1366×657 la 125%) și telefonul, pe 2 drumuri.
4. **D.** Ca în reguli.
