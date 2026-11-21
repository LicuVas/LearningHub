# Criticul rece, runda 28 (valul B-word redeschis `B-word#3`; ciclul paralel D), unghiul GEST_TASTATURA — scris de orchestrator, 21.11.2026

N = 28. Regulile sunt în `D/runde/_paralel/REGULI_CRITIC.md`: citește-le întâi, întregi. Ieșirea e `D/runde/28/critic.md`.

## Ce e lucrarea
- **Biblioteca** `C:/00/Projects/LearningHub_fidel/aplicatii/` simulează Word:
  - codul: `word.js`, `date/word.json`, profilurile `word365` / `word2007`;
  - fidel cu Word 365 real și cu ferestrele Windows de salvare / deschidere;
  - poligonul: `aplicatii/poligon.html?aplicatie=word`, cu parametrii din `D/runde/28/gata_pentru_critic.md`.
- **Lecția principală** a drumurilor cu fișiere e `lectii/vii/m1-l03/index.html`.
- **Criticii 20 și 24** au dat GRAV 0.
- **Runda 28 a schimbat:**
  - asistentul comun (`aplicatii.js` › `L.asistent`), trei reguli: un eveniment `nesimulat` / refuzat nu face pasul; Alt+↓ care deschide lista într-o fereastră nu e greșeală; tastarea într-un câmp de text nu e greșeală când pasul nu o așteaptă. Textul pentru api §6.3 e propus în `D/runde/28/api_propunere.md` (api-ul e înghețat; nu-l număra ca lipsă de documentare);
  - MINOR 2 (lista Save as type pe laptopul la 125 %) și MINOR 1 (Font / Font Size +3 px) ale criticului 24;
  - unghiul gest_tastatura.
  Raportul constructorului e `D/runde/28/raport_constructor.md`; ținta e `D/runde/supliment_B_word_runda28.md`.
- **În paralel** au schimbat cod comun:
  - r30 Windows: `gestTasta` (orice tastă cu Windows ținut = `win_<tastă>`, doar în aplicația cu `I.tastaWindows`), `leagaGesturi` › `pointerdown`, `L.deschideSuprafata`, `I.emite`.
  Regresul lor la Word îl notezi, fără să-l atribui rundei 28.

## Ce spune constructorul (de judecat, nu de crezut)
- **`28/proba_grav.py`:** 17 verificări picate din 36 la pornire, acum 0. „Înainte” servește `word.js` și `aplicatii.js` vechi lângă fișierele de azi ale celorlalte benzi; la Windows amestecul strică verificarea Enter, deci „înainte”-ul Windows e din prima lui rulare (log suprascris).
- **O4 `word-*`: 10 → 8**, fără rânduri noi; `word-decupare-lipire` dă tot 0.
  - meniul Pictures ▾: „This Device...”, „Stock Images...”, „Online Pictures...”, sub titlul „Insert Picture From”, ca în Word real; KeyTips Alt, N, P, D deschid Insert Picture;
  - spațiul automat la lipire („Ana are mere. mere”), doar în profilul `word365`.
- **Asistentul (`L.asistent` și constantele de lângă el, azi ~`:657-726`):**
  - salvarea refuzată („already exists”, nume interzis) nu mai face pasul;
  - Alt+↓ care doar deschide / închide o listă nu e greșeală;
  - tastarea într-un câmp al interfeței (File name, caseta din Start) nu e greșeală; tastarea în document și clicul în gol tot sunt;
  - clicul pe un buton gri tot face pasul (O9 PowerPoint E și G îl folosesc; A28-2).
  - Regresul: două greșeli adevărate tot cheamă indiciul pe 5 aplicații; drumul K2 („Windows, pai, Enter”) merge fără indiciu; O9 13 → 13, aceleași cazuri; probele 24 / 20 / 16 dau 0 (20: 2 → 0).
- **MINOR 2 / MINOR 1 (critic 24):** lista Save as type se micșorează cu fereastra la 125 %; Font / Font Size la ±2 px.
- **Unghiul:** Ctrl+Backspace / Ctrl+Delete șterg un cuvânt (ștergeau o literă), Ctrl+↑ / ↓ mută pe paragraf (mutau un rând), după pagina Microsoft „Keyboard shortcuts in Word”.
- **De aprobat / de verificat:** A28-1 (tastarea în câmp nu e greșeală), A28-2 (clicul pe buton gri face pasul); R28-1…R28-4 (spațiul la lipire în alte poziții și Word 2007, titlul „Insert Picture From”, granițele cuvântului / paragrafului, PgDn în document scurt).
- **Nefăcut:** PgUp / PgDn derulează fără să mute cursorul (R28-4); MINOR 3, 6, 7 din critic 24; O8 nemăsurat.

## Sarcina
1. **A. GRAV vechi:** niciunul deschis.
   - Verifici pe eșantion că K1 (critic 16 / 20) rămâne închis: Tab în cele 5 ferestre, drumul PDF doar cu tastele.
   - **Asistentul schimbat**, pe Word, Excel, PowerPoint, Explorer și Windows:
     - salvarea refuzată (nume interzis, „already exists” + Save pe `m1-l03:157`) nu bifează pasul Save;
     - Alt+↓ în Save as type nu cheamă bula;
     - tastarea în caseta din Start (Windows, „pai”) și în File name nu e numărată greșeală, iar drumul „Windows, pai, Enter” ajunge la capăt fără indiciu;
     - o greșeală adevărată (clic în gol) tot cheamă indiciul după 2;
     - un pas cu `asteapta` hotărăște singur.
2. **B. Unghiul GEST_TASTATURA pe Word**, pe drumurile lecțiilor:
   - săgețile, Ctrl / Shift / Ctrl+Shift + săgeți, Home / End, Ctrl+Home / End, PgUp / PgDn;
   - Enter, Tab, Backspace, Delete, Ctrl+Backspace;
   - Ctrl+Z / Y / C / X / V / A / B / I / U / S, F12, Ctrl+O, Ctrl+N;
   - KeyTips (Alt, literele) pe comenzile din lecții, Esc în KeyTips;
   - tastele în ferestrele de fișiere (Tab, Alt+literă, Alt+↓, Enter, Esc).
   Pe fiecare: evenimentul §4, starea, ecranul, comparate cu scenariile `word-*`, cu referințele și, unde ai voie, cu Word real (DispatchEx invizibil, PID-ul tău; WINWORD-ul deschis înainte de tine e al omului). Ce nu are referință = [FARA_REFERINTA].
3. **C. Regresul:**
   - cele 8 închise în r16, K1 și MINOR-urile făcute în r24, pe eșantion;
   - scenariile `word-*` (O4);
   - laptopul la 125 % (1366×657), telefonul (360-390 px) și tabla SMART (1920×1080), pe 2 ferestre;
   - Ctrl+literă pe Word: aceleași evenimente ca înainte de schimbarea din `gestTasta`.
4. **D.** Ca în reguli.
