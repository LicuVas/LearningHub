# Criticul rece, runda 7, etapa B (Excel, al doilea val): cele 10 GRAV din runda 6 + unghiul gest_tastatura + regresul Word

**Cine:** critic rece, fără notele constructorilor. Din `runde/7/` am citit doar `gata_pentru_critic.md`; din `runde/6/` doar `critic.md` și citirile lui din Excel real (`critic_probe/com_r6*.json`). N-am citit `diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `regres.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. N-am rulat probele constructorilor: concluziile vin din gesturile și măsurătorile mele.

**Ce am rulat** (totul în `runde/7/critic_probe/`):
- Server static legat de `127.0.0.1`, port liber, pornit și oprit în fiecare script, servind worktree-ul. Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`h.py`). Pagina `aplicatii/poligon.html?aplicatie=excel` și `LH.aplicatii.deschide('excel', {loc, continut, focus:true})` cu tabelul de sortare al lecțiilor (Nume / Clasa / Punctaj).
- Gesturi reale: `page.keyboard` (Enter, Tab, Shift+Tab, Esc, F2, F4, F12, Ctrl+Z/Y/C/X/V/N/W/S/1/PageDown, Ctrl+Shift+%, Ctrl+săgeți, Ctrl+Home/End, Shift+săgeți, Ctrl+Shift+săgeți, Delete, Alt, Alt+literă, Alt+=, Alt+↓, Alt+Enter), `page.mouse`, `page.touchscreen` la 375×667. Tastele românești prin CDP: `Input.dispatchKeyEvent` cu `key:'ș'` (tastatura Romanian Standard), AltGr (Ctrl+Alt), `Input.imeSetComposition` + `Input.insertText`.
- După fiecare gest: `stare('excel')`, textul celulei de pe ecran, `document.activeElement`, `window.__lhAplicatieEv` (gest, acțiune, țintă, `activat`), mesajele `[data-lh-nesimulat]`, plus un asistent §6.3 pornit de mine (`LH.aplicatii.asistent`).
- Referința citită doar cu Python, pe chei (`uia.py` → `uia_taste.txt`: toate `tasta_acces` / `scurtatura` din `uia_excel.json`; `uia_dialog.SortDialog.txt`, `uia_dialog.SortWarning.txt`).
- **Excel real, invizibil** (`com_r7k.py` → `com_r7k.json`): `DispatchEx`, `Visible=False`, `DisplayAlerts=False`, registru nou nesalvat (fără fișiere), taste trimise cu `PostMessage` doar ferestrei `EXCEL7` a instanței mele, apoi `Range.Formula` / `Range.Text`. Două rulări; amândouă au cerut oprire forțată (`taskkill /PID` doar pe PID-ul instanței mele, citit din `Hwnd`). După prima am șters singura intrare `Resiliency\DocumentRecovery` scrisă în timpul vieții instanței mele (înregistrarea „APP-EXCEL”, fără fișier); după a doua n-a apărut nicio intrare nouă. Alt proces Excel nu rula; PowerPoint nu l-am atins.
- Regresul Word (`w1.py`): aceleași gesturi pe `aplicatii/` din HEAD (`git archive` într-o copie din %TEMP%, ștearsă la final) și pe worktree-ul de acum, 1366×768 și 375×667; capturi comparate pixel cu pixel, dreptunghiurile tuturor `[data-lh-tip]`, `stare('word')` și evenimentele.

**Diff-ul rundei (necomis):** 2 fișiere, +859 / −66 rânduri.
- `aplicatii/excel.js` (acum 2384 de rânduri): ### și lățirea coloanei la numerele tastate, textul care curge peste vecinele goale, Σ cu zona aleasă și chenar punctat, numele de funcții cu diacritice, linia dintre litere (tragere, dublu clic), Column Width, Fill Color, Borders ▾, Percent Style, Wrap Text, Sort cu niveluri + Sort Warning, registrele (Ctrl+N / Ctrl+W / File › New / Close, Excel gol), redenumirea filei, panoul Save As, bara Acces rapid, banda de jos cu barele desenate.
- `aplicatii/aplicatii.css` (+53): doar clase `lh-ap-x-*` și `.lh-ap-excel …` (nicio regulă nouă pentru Word).

## A. Cele 10 GRAV din runda 6

### X1 (numerele tăiate la jumătatea unei cifre): **ÎNCHIS**
- `x1.json`: `=25/3` → `stare().text = "8,333333"`, pe ecran tot „8,333333”, `scrollWidth = clientWidth = 56` (nu se mai taie nimic). `=10/3*1000000` într-o coloană de 64 px → „3333333”.
- `r1.json`: `12.03.2026` tastat într-o coloană de 64 px → **„########”** (lecția m1-l06:111: „Dacă o dată nu încape, Excel arată `####`”). `k4.json`: coloana C de 1 caracter → `88` arată „#”.
- Un număr tastat lățește coloana (`1234567890` și `123456789012` → „1,23457E+11”, coloana A = 84 px). Regula vine din Excel real prin gest: `scenarii_real/excel-zero-in-fata.json` (numărul tastat rămâne întreg); rezultatele formulelor nu lățesc (com_r6.json „8,333333”).

### X2 (textul lung nu trecea peste vecina goală): **ÎNCHIS**
- `x1.json`: „Situația notelor la informatică” în A16, cu vecinele goale → 177 px vizibili (tot textul); în A17, cu „x” în B17 → 78 px, adică se taie la marginea celulei. Ca în `com_r6_pdf.png` (E2 trece peste F2-G2; E3 se taie lângă „x”).

### X3 (Save cu lupă, Undo/Redo cu pătrat gol): **ÎNCHIS**
- `x3_qat.png`: dischetă, ↶ ▾, ↷ ▾ (gri), ▾. Desenele: Save `M3 5c0-1.1.9-2 2-2h8.38…` (nu lupa `M8.5 3a5.5…`), Undo `M5 2.5…`, Redo `M15 2.5…`. Locurile: x = 44 / 73 / 112 față de `uia_excel.json › acces_rapid` 43 / 72 / 111.

### X4 (banda de sub foaie așezată altfel): **ÎNCHIS**
- `x4_jos.png`, `x9.json › X4`, cu barele lui Chrome vizibile (Chromium fără `--hide-scrollbars`): filele `[1,712,804,32]` (referința `[1,713,805,32]`), bara orizontală `[838,719,507,17]` (referința `[838,720,508,17]`), pe același rând cu filele; bara verticală `[1345,222,17,493]` (referința `[1346,220,17,496]`). Grila nu mai are bare Chrome. Rămâne bara subțire a lui Chrome peste bara de stare: e mai veche și e la fel în Word (MINOR).

### X5 (Σ: zona propusă nealeasă; ▾ › Average): **DESCHIS** (reparat pe jumătate)
- **Reparat** (`x1.json › X5`, `x5_autosum.png`): Σ pe B5 → `=SUM(B2:B4)`, B2:B4 albastru în celulă, chenar punctat `lh-ap-x-propus` de 57 px (3 rânduri). Scriu „B2:B3” → `=SUM(B2:B3)`, Enter → 16.
- **Rămâne:** săgeata ▾ de lângă Σ → doar mesajul „În aplicația reală, „AutoSum” funcționează; aici nu e simulată.” (`x1.json › X5_sageata`, evenimentul `meniu_derulant … actiune: nesimulat`). Lecția m2-l08:63 cere tocmai pasul ăsta: „apasă săgeata ▾ de lângă Σ și alege Medie (Average). Excel scrie =AVERAGE(B2:B7)”; captura lecției (`autosum-lista.webp`) arată lista „Sum, Average, Count Numbers, Max, Min, More Functions”. După §3, pe drumul lecției mesajul nu e o ieșire.

### X6 (`=DACĂ(…)` bloca celula): **ÎNCHIS**
- `x1.json › X6`: `=DACĂ(B3<9;10;20)` → `#NAME?` (în stare și pe ecran), celula iese din editare; `=IF(B4<9;10;20)` → 10. Ca în `com_r6b.json`.

### X7 (lățimea coloanei; Fill Color, Borders, %, Wrap Text): **ÎNCHIS**
- `x1.json › X7_latime`: pe linia dintre C și D cursorul e `col-resize`; tragere +40 px → C = 104 px, selecția nu se schimbă (evenimentul `tragere … latime_coloana`, ținta `antet_coloana_margine:C`); dublu clic pe linia dintre A și B → A se potrivește textului (184 px, `potrivire_latime`).
- Column Width din meniul antetului: caseta are focusul cu valoarea aleasă; „20” + Enter → lățimea se schimbă (`k3.json › cw_tab_enter`).
- `x1.json › X7_format`: Fill Color → `umplere: FFFF00`, Percent Style → B2 = „900%” (com_r7c: 9 → 900%), Wrap Text → `incadrare: true`, Borders ▾ › All Borders → toate cele patru margini. Niciun mesaj central.

### X8 (Ctrl+S / Ctrl+W / Ctrl+N / redenumirea): **DESCHIS** (reparat pe jumătate)
- **Reparat:** Ctrl+N → Book2 (`k1.json`); Ctrl+W pe un registru salvat sau nemodificat → se închide; pe ultimul → Excel gol, `registru_activ: null` (`k4.json`); File › New › Blank workbook și File › Close merg cu mouse-ul (`k4.json`); dublu clic pe filă → caseta de redenumire, „Notă” + Enter → foaia „Notă”, Esc renunță (`k3.json`); Ctrl+S › Browse duce la fereastra Save As, unde Documente + nume + Enter salvează (`k4.json › ctrl_s_browse`).
- **Rămâne 1:** Ctrl+S pe un registru nou → pagina Backstage „Save As”, fără casetă File name (`x1.json › X8_ctrl_s`, `x8_ctrl_s.png`). Lecția m1-l03:58 („La File name scrie numele tău… La Choose a Location… Apoi Save”) și captura ei din Excel 365 (:95-97, „fereastra Save this file”) arată altă fereastră. `uia_excel.json` n-are suprafața (0 apariții; în `uia_word.json` există `dialog.save_this_file`). Simulatorul nu dă mesajul central, ci arată o suprafață fără referință. R4: „o suprafață fără referință contează ca diferență”.
- **Rămâne 2:** Ctrl+W pe un registru modificat → mesajul „Close (Ctrl+W) … nu e simulată” (`k1.json`, `excel.js:1713`). Exercițiul din m1-l03 cere exact asta: „Butonul Ctrl+W, apoi Save în fereastra care apare” (:182, cu `rezolvare: [['inchide','da'], …]`), iar captura de la :172 arată fereastra. Mesajul respectă R12, dar cu el exercițiul nu se poate face cum e scris.
- În Chrome pe calculator, Ctrl+W și Ctrl+N nu ajung la pagină: Ctrl+W închide fila lecției. Drumul prin File › Close / New merge, dar lecția spune Ctrl+W (m1-l03:59). Vechile lecții aveau butoane („butonul Ctrl+N de sub titlu”, m1-l03:110); biblioteca nu are.

### X9 (telefonul): **ÎNCHIS**
- `x9b.json`: atingerea lui B3 → focusul în `TEXTAREA.lh-ap-intrare`; `insertText "7,5"` → B3 în editare, Enter → `7,5`. Compunerea „Ana” și „Mădălina” ajung întregi (`x9.json`), Backspace-ul tastaturii golește celula. Celulele au 109×32 px (pragul I1: 32). Pe calculator, compunerea „ș” + „i” în modul Ready → „și” (`k2.json`).

### X10 (Sort pe mai multe criterii; grafice): **DESCHIS**
- **Reparat** (`k4.json › X10_sort_niveluri`, `k4_sort_niveluri.png`): Sort by Clasa, Add Level, Then by Punctaj › Largest to Smallest, OK → VIII A: 95, 88, 60; VIII B: 95, 78, 60. Sort Warning apare la C2:C7 + Sort Z to A, iar Enter (Expand the selection) mută rândurile întregi (`k3.json › avert_enter`: A2 = Bogdan, C2 = 95).
- **Rămâne:** Insert › Insert Column or Bar Chart → „În aplicația reală, „Insert Column or Bar Chart” funcționează; aici nu e simulată.” (`k4.json › X10_grafic`). Lecția m2-l11 („Grafice”) stă toată pe această comandă.

**Regresul celor închise / trecute în runda 6:** nu am găsit. Merg în continuare m1-l07 (`=(E2+F2)/2` → 8,5; „5 bucăți” → `#VALUE!`), umplerea G2→G4, IF, Merge & Center, Bold, „+” (Sheet2), Name Box (D3 + Enter), F12 + nume + Enter (`r1.json`, `k2.json`, `k4.json`).

## B. Unghiul gest_tastatura (Excel): constatări noi

### GRAV K1: ferestrele noi ale rundei nu primesc tastatura (Sort, Sort Warning; Tab scoate focusul din Column Width și Save As)
- **Referința** (`uia_excel.json`, extras în `uia_taste.txt` și `uia_dialog.*.txt`):
  - `dialog.SortDialog`: Add Level `ALT+A`, Delete Level `ALT+D`, Copy Level `ALT+C`, Options `ALT+O`, My data has headers `ALT+h`; la fiecare ComboBox (Sort by / Sort On / Order) butonul Open are `Alt+Down Arrow`;
  - `dialog.SortWarning`: Sort... `Alt+S`, Expand the selection `Alt+E`, Continue with the current selection `Alt+C`;
  - `dialog.ColumnWidth`: caseta `ALT+C`;
  - `dialog.FileSaveAs`: File name `ALT+n`, Save as type `ALT+t`, Save `Alt+s`.
- **Simulatorul** (`k3.json`, `k4.json`):
  - **Sort:** la deschidere focusul e pe cutia ferestrei (`DIV|Sort`), iar înăuntru nu e niciun element focusabil (lista e goală). Alt+↓ nu deschide lista (`alt_sageti … fara_efect`). Săgețile nu fac nimic. Tab ×4: focusul rămâne pe cutie. Alt+A nu adaugă nivel (`niveluri: 1`) și **nu emite niciun eveniment**. Enter cu Sort by gol → mesajul central (`tasta_enter … nesimulat`).
  - **Sort Warning:** la fel. Săgeata ↓ și Alt+C nu schimbă butonul radio (`["true","false"]` rămâne), Tab nu mișcă focusul. Doar Enter (implicitul) și Esc merg.
  - **Column Width:** după „20”, Tab mută focusul pe un `DIV` fără nume, iar Shift+Tab nu-l mai întoarce în casetă.
  - **Save As (F12):** după nume, Tab → `DIV` fără nume. Alt+N nu întoarce focusul în File name, Alt+S nu salvează (`nume: null`, fereastra rămâne deschisă).
  - **Format Cells:** focusul pe cutie, nimic focusabil.
- **De unde vine:**
  - `excel.js:2240-2244`: cu o fereastră deschisă și focusul în afara unei casete, orice tastă în afară de Esc și Enter → `fara_efect`;
  - `excel.js:1829`: ferestrele fără File name primesc `tabindex=-1` pe cutie;
  - `aplicatii.js:249`: `Alt+literă` → `gestTasta` întoarce `null`, deci nici un eveniment §4 („Un eveniment pe fiecare gest fizic al elevului”).
- **Urmarea:** elevul învață că în ferestrele Excel tastatura nu merge (Tab, Alt+↓, literele subliniate). Pe PC, Tab și Alt+↓ sunt drumul obișnuit prin Sort și Save As.

### GRAV K2: Enter într-o fereastră (Column Width, Sort, Sort Warning) n-are `activat` și are ținta greșită, iar asistentul §6.3 îl ia drept greșeală
- **Contractul:** §4 `activat`: „Enter într-o fereastră apasă butonul ei implicit … `activat`”; „O lecție care așteaptă un buton îl recunoaște din `tinta` SAU din `activat` (§6.3 face la fel)”. Tot §4: la taste, ținta = focusul din momentul tastei.
- **Simulatorul** (`k4.json`):
  - clicul pe OK în Column Width → `tinta: "fereastra:OK"`;
  - Enter (focusul în casetă) face același lucru, lățimea se schimbă, dar evenimentul e `{gest: tasta_enter, tinta: "camp:latime_coloana", activat: null}`.
- **Asistentul** `asistent('excel', {pasi: [{tinta: 'fereastra:OK'}, …], dupaGreseli: 2})`:
  - după două ferestre închise corect cu Enter, `pas()` rămâne 0, iar indiciul „Apasă OK” apare pe `fereastra:OK` (`indicii: ["fereastra:OK"]`);
  - același pas, făcut cu clic pe OK → `pas() = 1`.
  - Deci elevul care lucrează cu tastatura primește indiciul de greșeală după ce a făcut corect.
- **Ținta greșită:**
  - Sort, Enter → `tinta: "camp:Sort by"`, `activat: null` (`k3.json › sort_enter_ok`);
  - Sort Warning, Enter → `tinta: "celula:C2"`, adică celula din spatele ferestrei (`avert_enter`);
  - Column Width după Tab, Enter → `tinta: "celula:C1"`.
- **De unde vine:**
  - `excel.js:2235`: `activat` e pus doar pentru `dialog.FileSaveAs`;
  - `aplicatii.js:376`: în afara casetelor, ținta se citește DUPĂ ce fereastra s-a închis.

### GRAV K3: cu un meniu sau o listă deschisă, tastele ajung în foaia din spate
- **Referința:** meniul de clic dreapta are litere de acces (`uia_excel.json › meniu_contextual.celula`: Cut `T`, Copy `C`, Paste Special... `S`, Delete... `D`, Sort `O`, Format Cells... `F`; `meniu_contextual.fila_foii`: Rename `R`, Delete `D`, Move or Copy... `M`).
- **Simulatorul** (`r1.json`, `k3.json`):
  - **Litera C** cu meniul deschis pe B2 → B2 intră în editare cu „c” (valoarea 9 e înlocuită), meniul rămâne pe ecran, nu se copiază nimic (`clip: 0`).
  - **Litera R** în meniul filei → „r” scris în celula activă, meniul rămâne deschis.
  - **Delete** cu meniul deschis pe C2 → C2 golită (`tasta_delete … golire`), meniul tot deschis (`r1_meniu_delete.png`).
  - **Săgețile + Enter** cu meniul deschis → celula activă coboară B3 → B6, meniul rămâne.
  - **Lista Borders ▾:** ↓ + Enter mută celula activă (A1 → A3), nu alege nicio bordură (`borders_sageti`).
- **De unde vine:** `excel.js:2245`: cu meniul deschis e tratată doar Esc, restul cade în codul foii.
- **Urmarea:** elevul care apasă litera unei comenzi (sau ↓ + Enter) își strică datele, iar meniul rămâne deschis peste ele.

### GRAV K4: `=AV` + Tab dă AVERAGE; în Excel dă AVEDEV, exact greșeala de care avertizează lecția
- **Lecția** m2-l08:66, în pasul 5 din „Dacă nu-ți iese”: „Atenție: dacă tastezi doar =AV și apeși Tab, Excel alege AVEDEV, altă funcție. Ea dă alt număr, fără nicio eroare.”
- **Excel real** (`com_r7k.json`, aceleași date B2:B4 = 9, 7, 8):
  - `=AV` + Tab + `B2:B4)` + Enter → `Formula: "=AVEDEV(B2:B4)"`, `Text: "0,666667"`;
  - `=AVER` + Tab → `=AVERAGE(B2:B4)` → 8.
- **Simulatorul** (`k5.json`): `=AV` + Tab → `=AVERAGE(B2:B4)` → **8**. Lista funcțiilor nu are AVEDEV (`excel.js:164-171`: `FN` fără AVEDEV; `completare()` ia prima din `NUME_FN`, `excel.js:1154-1166`).
- **Urmarea:** pe simulator, scurtătura greșită „merge”. Elevul învață contrariul lecției și, pe PC, primește 0,67 în loc de 8, fără nicio eroare.

### GRAV K5: „=” + săgeată dă un mesaj fals de eroare; Excel scrie adresa celulei (modul Point)
- **Excel real** (`com_r7k.json`):
  - B5: `=` + ↑ + Enter → `Formula: "=B4"`;
  - D2: `=B2+` + → + Enter → `Formula: "=B2+E2"`, `Text: "13"`.
- **Simulatorul** (`r1.json`):
  - `=` + ↑ → celula rămâne „=”, cu mesajul central „Excel nu primește formula așa cum e scrisă. În aplicația reală apare o fereastră de eroare (aici nu e simulată). Corectează formula sau apasă Esc.” (`sageti … formula_neprimita`);
  - `=B2+` + → → la fel.
  - Cauza: `excel.js:2289-2291`: în modul Enter, săgeata încearcă să primească formula.
- **Urmarea:** mesajul afirmă despre Excel ceva fals (că refuză formula și deschide o fereastră de eroare). Elevul învață că formulele se fac doar cu clicul.

### GRAV K6: tastele de acces ale panglicii lipsesc în Excel: Alt, H, 1 scrie „h1” în celulă; Alt+= și Ctrl+Shift+% tac
- **Referința** (`uia_excel.json`, `uia_taste.txt`):
  - `file_panglicii`: Home `Alt, H`, Insert `Alt, N`, Data `Alt, A`…;
  - `panglica.TabHome`: Bold `Alt, H, 1` / `Ctrl+B`, AutoSum `Alt, H, U`, Sum `Alt+=` (și `panglica.TabFormulas`), Percent Style `Alt, H, P` / `Ctrl+Shift+%`, Wrap Text `Alt, H, W`;
  - `panglica.TabData`: Sort... `Alt, A, S S`.
  - §4 definește gestul `tasta_acces` (Alt + literele din referință).
- **Simulatorul** (`k1.json`):
  - Alt → nu apare nicio literă, niciun eveniment;
  - apoi H, 1 → A1 („Elev”) intră în editare cu **„h1”** (`tastare … scriere`);
  - Alt+= sub B2:B4 → nimic: B5 gol, fără editare, **niciun eveniment** (`ev: []`);
  - Ctrl+Shift+% pe C3 → nimic, fără eveniment, fără mesaj.
- **Word în aceeași bibliotecă le are:** `w1.json`, Alt, H, 1 pune Bold (`fmt: "x" bold: true`); `word.js:2034-2042`. Datele există și pentru Excel (`aplicatii/date/excel.json` conține „Alt, H” de 73 de ori), dar `excel.js` nu le folosește (0 apariții).
- **Urmarea:** încălcare §4 (gesturi fără eveniment). Gestul din referință (Alt, H, 1) strică celula activă. Alt+= e scurtătura Σ din referință și ajunge la pagină (`aplicatii.js:249` o aruncă: `gestTasta` întoarce `null` pentru Alt+orice caracter), deci elevul o încearcă degeaba.

## C. Regresul Word: **NU strică**
`w1.py`, aceleași gesturi pe `aplicatii/` din HEAD și pe worktree, 1366×768:
- deschidere;
- tastare „Mădălina are 5 mere” + Enter;
- Alt; Alt, H, 1;
- F12 + „Tema_mea” + Enter;
- „x” + Ctrl+W (fereastra „Save your changes to this file?” cu More options… / Save / Don't Save / Cancel);
- lista Font Size;
- Ctrl+F12 (Open);
- plus compunerea „Ană” la 375×667.

Rezultatul:
- 10 din 11 capturi sunt identice pixel cu pixel. Singura diferență („3_alt_h_1”) e un dreptunghi de 2×16 px la x = 372: e cursorul de text, care clipește (`aplicatii.css:102`, `animation: lh-ap-clipeste 1.06s`).
- Dreptunghiurile tuturor `[data-lh-tip]` sunt identice (136 / 235 / 153 / 157 / 215 noduri).
- `stare('word')` e identică (text, dialog, titlu „Tema_mea - Word”, Bold pe „x”), la fel lista evenimentelor (cu `activat: dialog_salvare:Save` la Enter în File name). Erori în pagină: 0.
- Diff-ul CSS e legat doar de `lh-ap-x-*` și `.lh-ap-excel`; `word.js`, `aplicatii.js`, `panglica.js`, `stare.js` sunt neatinse.

## [FARA_REFERINTA] (nu le număr GRAV)
- **Ctrl+PageDown / Ctrl+PageUp.** În simulator mută celula activă cu o pagină (A1 → A24, `tasta_pagina … mutare`), pentru că `excel.js:2323` ignoră Ctrl. Lecția m1-l03:197 spune că trec la foaia din dreapta / stânga, dar referința n-are scurtătura. În Chrome pe calculator, Ctrl+PageDown schimbă fila browserului, deci rar ajunge la pagină. Drumul lecției „clic pe fila ei” merge.
- **Alt+Enter în celulă.** Simulatorul primește celula și rămâne pe ea (`excel.js:2263`), iar tastarea de după o suprascrie (`k1.json`: „unu” Alt+Enter „doi” → A8 = „doi”). În Excel e rând nou în celulă. N-am putut proba: `PostMessage` nu transmite starea tastei Alt (proba Alt+= din `com_r7k.json › T5` a ieșit neconcludentă la fel).
- **Ctrl+1.** Nu dă niciun eveniment și n-are niciun efect (`aplicatii.js:243-246` întoarce `null` pentru cifre). Ctrl+1 nu e în referință, iar Chrome îl ia (fila 1).
- **Ctrl+C / X / V / B în timpul editării** → `fara_efect` (`excel.js:2298-2300`).
- **Excel fără registru:** în Backstage, Save, Save As, Print, Share, Export, Close sunt active (`k4.json › backstage_fara_registru`). Referința e luată cu un registru deschis.
- **Focusul inițial în Sort** (pe cutie, nu pe „Sort by”) și **lățimea pentru „20” în Column Width** (150 px, din 64 px = 8,11): nu sunt în referință; n-am verificat cu Excel real.

## MINOR
- Bara subțire a lui Chrome peste bara de stare (`x4_jos.png`, `.lh-ap-jos`, 11 px). Exista dinainte și e la fel în Word.
- §6.3 numără Tab-ul ca greșeală (nu e în lista `rotita`, `sageti`, `tasta_home_end`, `tasta_pagina`). Elevul care trece cu Tab prin celule sau prin ferestre adună greșeli. E regula API-ului, nu a lui Excel.
- `=SU` + Tab → `=SUBSTITUTE(`. Așa e și în Excel (lista e alfabetică), dar la Enter simulatorul dă mesajul central, nu fereastra „too few arguments”.

## Ce a trecut (văzut în `stare()`, pe ecran și în evenimente)
- **Enter / Tab în grilă** (m1-l02, `scenarii_real/excel-tab-apoi-enter.json`): Elev, Tab, Suma, Enter, Ana, Tab, 150, Enter → Enter se întoarce la coloana de start (F3). Shift+Tab și Shift+Enter merg înapoi.
- **Esc, F2, F4 de una și de două ori** (`=$B$2`, `=B$2`, ca în `excel-f4-*`), **săgeata primește conținutul** (`excel-sageata-confirma`).
- **Ctrl+Z / Ctrl+Y.** Ctrl+C cu chenar punctat, care dispare la Esc; Ctrl+X / Ctrl+V.
- **Navigarea:** Ctrl+săgeți (marginea blocului), Ctrl+Home, Ctrl+End, Home. Shift+→ Shift+↓ → A1:B2 (`excel-shift-sageti`). Ctrl+Shift+↓/→ → A1:C4. Ctrl+Shift+Home → A1:B3. Delete pe o zonă.
- **Diacriticele pe calculator:** tasta „ș” (`key:'ș'`), AltGr+s, „Mădălina” prin `insertText`, compunerea „și”. Pe telefon: „7,5”, „Ana”, „Mădălina”, Backspace (X9).
- **Bara de formule și Name Box:** clic în bara de formule + End + „5” → 85; Name Box „D3” + Enter → D3.
- **Ferestrele, cu mouse-ul și cu Enter / Esc:** Enter în File name salvează, cu `activat: dialog_salvare:Save`; Esc închide Sort, Column Width, Save As, Format Cells și întoarce focusul în grilă; după Sort, tastarea ajunge în celula activă. Redenumirea filei cu tastatura (Enter / Esc, diacritice).
- **Registrele în pagină:** Ctrl+N / Ctrl+W (în proba headless). Asistentul §6.3 pe drumul cu mouse-ul (clic pe OK → pasul făcut).
- **Word:** fără regres (secțiunea C).

GRAV_VECHI_DESCHISE: 3
GRAV: 9
