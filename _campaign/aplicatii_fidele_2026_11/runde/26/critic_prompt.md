# Criticul rece, runda 26 (valul B-windows, a treia rundă; ciclul paralel C), unghiul STARE_FINALA_ERORI — scris de orchestrator, 21.11.2026

N = 26. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/26/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează shell-ul Windows 11:
  - bara de activități, Start (cu „Toate” și căutarea), meniul desktopului;
  - codul: `windows.js`, `date/windows.json` (generat de `_unelte/genereaza_windows.py` din `referinte/uia_windows.json`), profilul `windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=windows`, cu parametrii din `D/runde/26/gata_pentru_critic.md`.
- **Criticul 22** (`D/runde/22/critic.md`) a lăsat 4 GRAV deschise:
  - W4 (`:49`): parțial, așteaptă montarea Explorer-ului;
  - K1 (`:83`): Win+E deschide Start, fără mesaj;
  - K2 (`:100`): asistentul nu vede drumul cu tastatura;
  - K3 (`:119`): pe telefon, caseta din Start fără tastatura ecranului.
- **Runda 26 le-a reparat** pe K1-K3, iar K1 a schimbat codul COMUN `gestTasta` (tasta Windows). W4 rămâne parțial: montarea Explorer-ului vine din runda 23, iar legarea ei din ciclul următor. Raportul constructorului e `D/runde/26/raport_constructor.md`; ținta e `D/runde/supliment_B_windows_runda26.md`.
- **În paralel** au schimbat cod comun:
  - r23: `keydown` / `preventDefault` în câmpuri, deci și în caseta din Start;
  - r24: asistentul.
  Ce vezi la Windows din cauza lor notezi, fără să atribui rundei 26.

## Ce spune constructorul (de judecat, nu de crezut)
- **`26/proba_grav.py`:** 36 de verificări picate din 81 la pornire; la final, 3 din 84.
  - 2 sunt „Paint fără tastare” pe telefon: Paint nu e în referință (A26-1, decide Vasile).
  - 1 e o abatere de 2 px la fereastra maximizată, lăsată.
  - Proba r22 trece 50/50, proba r18 37/37. O5 = 35 și O9 = 13, ca la pornire.
- **K1 ÎNCHIS:**
  - Win+E dă `win_e` (nu `ctrl_e`) și mesajul central „Windows + E”, iar Start rămâne închis;
  - pe drum, Start se deschide o clipă, pentru că se deschide la apăsarea tastei Windows, nu la ridicare, ca să păstreze `activat`;
  - deschiderea la ridicare cere un rând în codul comun `I.emite(…, extra)`: A26-2. Judecă dacă clipirea e vizibilă și dacă încurcă drumul lecției.
- **K2 ÎNCHIS:** pe drumul „Windows, pai, Enter”, asistentul ajunge la `pas() = 2`, fără indiciu la final.
- **K3 ÎNCHIS pentru caseta din Start:** la 360 / 390 px atingerea pune focusul într-un câmp adevărat, iar textul de telefon ajunge în căutare. „Paint fără tastare” rămâne NEÎNCHIS (A26-1), deci nu-l numeri ca GRAV nou dacă A26-1 e încă deschis.
- **Schimbarea comună** (`aplicatii.js:266-275`, 8 rânduri în `gestTasta`; `api_biblioteca.md:170`, un rând în §4):
  - Win + literă = `win_<literă>`, doar în aplicația care declară `I.tastaWindows` (azi Windows) și nu pe Mac;
  - regresul pe Word, Excel, PowerPoint și Explorer: 0 diferențe la 24 de evenimente pe aplicație.
- **Fără referință:** R26-1…R26-3 în `de_verificat.md`.
- **Nefăcut:** MINOR-urile din criticii 22 / 18. W4 rămâne parțial.

## Sarcina
1. **A. W4, K1, K2, K3.** Joci gestul criticului 22, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta.
   - **La W4:** confirmi doar starea parțială. Nu-l numeri ca GRAV nou.
   - **Regresul schimbării din `gestTasta`:** Ctrl+litera pe Word, Excel, PowerPoint și Explorer dă exact aceleași evenimente ca înainte.
2. **B. Unghiul STARE_FINALA_ERORI pe shell.** Greșelile tipice:
   - Start, apoi Esc / clic în afară;
   - text greșit, apoi Backspace până la gol;
   - aplicație pornită din căutare, apoi minimizată, readusă, maximizată, închisă;
   - meniul desktopului cu Esc la jumătate;
   - Nou › Folder pe desktop, apoi Esc / nume gol;
   - două ferestre și închiderea celei din spate.
   După fiecare: `stare()` = ecranul = referința, evenimentul §4, asistentul §6.3, mesajul central unde nu e simulat. Ce nu are referință = [FARA_REFERINTA].
3. **C. Regresul:**
   - W1, W2, W3, W5 și „Ce a trecut” din `22/critic.md`, pe eșantion;
   - telefonul (360 / 390) și fereastra mică.
4. **D.** Ca în reguli. Datele personale: nimic din calculatorul omului în ieșiri.
