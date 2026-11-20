# Criticul rece, runda 22 (valul B-windows, a doua rundă; ciclul paralel B), unghiul GEST_TASTATURA — scris de orchestrator, 21.11.2026

N = 22. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/22/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează shell-ul Windows 11:
  - bara de activități, Start (cu „Toate”), meniul de clic dreapta de pe desktop;
  - codul: `windows.js`, `date/windows.json` (generat de `_unelte/genereaza_windows.py` din `referinte/uia_windows.json`), profilul `windows11`;
  - poligonul: `aplicatii/poligon.html?aplicatie=windows`, cu parametrii din `D/runde/22/gata_pentru_critic.md`.
- **Lecțiile** care cer shell-ul sunt cele din `18/critic.md`, de ex. `v/m2-l08`: Start, tastarea „pai”, „calc”.
- **Criticul 18** (`D/runde/18/critic.md`, unghiul aspect) a găsit 5 GRAV:
  - W1 (`:25`): meniul nou al desktopului;
  - W2 (`:45`): Start › Toate;
  - W3 (`:61`): tastarea cu Start deschis;
  - W4 (`:70`): Explorer pe bara de activități;
  - W5 (`:83`): telefonul.
- **Runda 22 le-a reparat.** Raportul constructorului e `D/runde/22/raport_constructor.md`; ținta e `D/runde/supliment_B_windows_runda22.md`.
- **În paralel** a lucrat Explorer (r19, mesajul central comun + `explorer.js`). W4 deschide Explorer-ul din bibliotecă doar dacă acesta expune montarea; altfel există o cerere A22-… în `D/de_aprobat.md`.

## Ce spune constructorul (de judecat, nu de crezut)
- **Toate 5 se reproduceau pe codul de azi.** În `22/proba_grav.py` picau 35 din 48 de verificări; acum pică 0 din 50. Proba r18 trece 37/37.
- **W1 ÎNCHIS:**
  - generatorul alege fereastra care cuprinde comenzile (`genereaza_windows.py:197-213`; `meniu_desktop.rect` = [0,0,304,385]);
  - fondul se calculează din marginile rândurilor (`windows.js:585-590`);
  - probat la 1536×864, 1366×768 lângă jos și 1093×526.
- **W4 NEÎNCHIS (parțial):** dosarul galben, numele la trecerea mouse-ului (0,5 s), iar clicul dă evenimentul + mesajul central. Clicul NU deschide Explorer-ul bibliotecii, pentru că `explorer.js` nu expune montarea (A22-1 în `de_aprobat.md`). Nu-l număra din nou ca GRAV nou; confirmă doar starea.
- **W3 ÎNCHIS:**
  - comportamentul e citat din pagina Microsoft „Use a screen reader to explore and navigate the Start menu in Windows” (`22/diferente.md` D9-D10; nu e încă în referințele înghețate);
  - „pai” → Paint, „calc” + Enter → Calculator, Sus / Jos, Backspace;
  - fără potrivire → mesajul central;
  - panoul de rezultate și ferestrele Paint / Calculator sunt simple: R22-1, R22-2, A22-3.
- **W2 ÎNCHIS:** 7 categorii, cu derularea de 545 px între capturi (`genereaza_windows.py:230-280`). Lista se derulează cu rotița, Tab / săgețile și degetul, până la `start.toate.jos` = 1283.
- **W5 ÎNCHIS:** la 360 și 390 px butoanele ferestrei stau în ecran, bara de titlu se glisează, Minimizare + butonul din bandă o readuce. Pe telefon Start stă fix în afara benzii (A22-2).
- **Fișiere comune atinse: niciunul.** A lucrat doar în `windows.js`, `genereaza_windows.py` și `date/windows.json`.
- **De judecat:** O3 de diagnostic pe Start a urcat de la 7 la 11. Constructorul spune că 3 categorii din „Toate” sunt derulate în afara listei capturate, iar una e „[utilizator]”. MINOR-urile din `18/critic.md` nu sunt făcute.
- **ATENȚIE:** banda Explorer (r19) poate fi încă în lucru pe `aplicatii.js` (mesajul central comun) cât lucrezi tu. Dacă mesajul central la Windows se poartă ciudat, notezi ce vezi și ora, fără să-l atribui rundei 22. Regresul comun al mesajului îl face criticul 19.

## Sarcina
1. **A. W1-W5.** Joci gestul criticului 18, apoi un gest vecin, și scrii ÎNCHIS sau DESCHIS, cu proba ta. W1 și W2 se măsoară față de `referinte/uia_windows.json` (±2 px, toate rândurile, toate cele 7 categorii).
2. **B. Unghiul GEST_TASTATURA pe shell**, pe drumurile lecțiilor:
   - tasta Windows și Ctrl+Esc; tastarea imediată după Start („pai”, „calc”, „word”) + Enter;
   - săgețile și Tab în Start și în Toate; Esc;
   - Win+E (Explorer); Win+D (desktopul);
   - Shift+F10 / tasta Meniu pe desktop, săgețile și Enter în meniul desktopului, inclusiv submeniul „Nou”;
   - Alt+Tab, dacă e cerut de lecții; Alt+F4 pe fereastră.
   Pe fiecare: evenimentul §4, starea, ecranul, asistentul §6.3, mesajul central unde nu e simulat (R12). Ce nu are referință = [FARA_REFERINTA], nu GRAV.
3. **C. Regresul:**
   - „Ce a trecut” din `18/critic.md`, pe eșantion;
   - mesajul central la Windows (2 gesturi nesimulate): îl notezi, dar nu-l atribui rundei 22 dacă r19 încă lucrează (vezi ATENȚIE);
   - telefonul și fereastra mică, pe 2 drumuri;
   - dacă W4 montează Explorer: un drum Explorer pornit din bară.
4. **D.** Ca în reguli. Datele personale: nimic din calculatorul omului (cont, rețea, programe fixate) în ieșiri.
