# Criticul rece, runda 8, etapa B (Excel, al treilea val): cele 9 GRAV din runda 7 + unghiul stare_finala_erori + regresul Word

**Cine:** critic rece, fără notele constructorilor. Din `runde/8/` am citit doar `gata_pentru_critic.md`; din `runde/7/` doar `critic.md` și citirea lui din Excel real (`critic_probe/com_r7k.*`, ca model de probă). N-am citit `diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `regres.md`, `acoperire_excel.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. N-am rulat probele constructorilor: concluziile vin din gesturile și măsurătorile mele.

**Ce am rulat** (totul în `runde/8/critic_probe/`):
- Server static legat de `127.0.0.1`, port liber, pornit și oprit în fiecare script, servind worktree-ul. Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`h.py`, copiat din runda 7). `LH.aplicatii.deschide('excel', {loc, continut, focus:true})` cu tabelele lecțiilor (Nume / Clasa / Punctaj din m2-l10; B2:B7 = 9, 7, 8, 10, 6, 8 din referința erorilor).
- Gesturi reale: `page.keyboard` (Enter, Tab, Shift+Tab, Esc, săgeți, Alt+↓, Alt, Alt+literă, Alt+=, Ctrl+Shift+5, Ctrl+S/W/N/Z/Y/C/V/A, F12, Delete), `page.mouse` (clic, clic dreapta, dublu clic, tragere), `insert_text` pentru „„da””. Probele: `p1.py` … `p11.py`, ieșirile `p*.json` / `p*_rez.txt`, capturile `p*.png`.
- După fiecare gest: `stare('excel')`, textul celulei citit cu algoritmul O4 (`oracole/sim_runner.js › textEcran`, copiat în `h.py › ecran`), modul din bara de stare („Cell Mode”), focusul, `window.__lhAplicatieEv`, mesajele `[data-lh-nesimulat]`, literele KeyTips de pe ecran și un asistent §6.3 pornit de mine.
- Referința citită doar cu Python, pe chei (`ref_fapte.txt`: `uia_excel.json › acoperire_r7.fapte`; `scenarii_real/excel-*.json`).
- **Excel real, invizibil** (`com_r8.py` → `com_r8.json`): `DispatchEx`, `Visible=False`, `DisplayAlerts=False`, un singur fișier de probă cu nume unic în %TEMP% (șters la final), nicio fereastră de dialog provocată. A cerut oprire forțată (`taskkill /PID` doar pe PID-ul instanței mele, citit din `Hwnd`). În `Resiliency\DocumentRecovery` n-a apărut nicio intrare nouă (cele două existente sunt din iulie și septembrie, ale altor sesiuni; n-am șters nimic). Alt proces Excel nu rula înainte și nici după; PowerPoint nu l-am atins.
- Regresul Word (`w8.py`): aceleași gesturi pe `aplicatii/` de la `4b53a65a` (`git archive` într-o copie din %TEMP%, ștearsă la final) și pe worktree-ul de acum.
- `p4.py` și `p5.py` au lăsat ferestre deschise între cazuri (greșeala mea de probă); concluziile despre Sort și Sort Warning le-am tras din `p6.py` / `p7.py`, unde fiecare caz pornește pe un registru proaspăt.

**Diff-ul rundei** (`git diff 4b53a65a -- aplicatii`: 4 fișiere, +514 / −43; constructorul 1 comis local în `d0ab48fd`, constructorul 2 necomis, doar în `excel.js`):
- `aplicatii/excel.js` (acum 2847 de rânduri): AVEDEV, modul Point la săgeți, ferestrele de eroare a formulei (typo / virgulă / prea puține argumente), lista ▾ Σ și lista Borders desenate din referință, tastele cu meniul deschis, tastatura în ferestre (focus la deschidere, Tab, Alt+↓, Alt+literă, Enter = `activat`), eroarea „All sort criteria…”, „Save this file”, „Save your changes to this file?”, starea „modificat” a registrului nou, KeyTips (copiate din `word.js`), Alt+=, Ctrl+Shift+%.
- `aplicatii/aplicatii.js` (+7): cârligul `I.tintaTasta` (ținta tastei citită de aplicație înainte să se închidă fereastra); Word nu-l folosește.
- `aplicatii/aplicatii.css` (+9): regulile Borders vechi primesc `:not(.lh-ap-x-ref)`, plus 2 reguli pentru listele din referință.
- `aplicatii/date/excel.json`: regenerat (sha-ul referinței nou).

## A. Cele 9 GRAV din runda 7

### X5 (Σ: ▾ › Average): **ÎNCHIS**
- Lista ▾ (`p1.json › X5_randuri`): Sum, Average, Count Numbers, Max, Min, More Functions..., adică rândurile din `acoperire_r7.fapte.randuri.lista.AutoSum` (fără primele două, „Sum” și „More Options”, care sunt butonul și antetul listei).
- Drumul lecției m2-l08:63 („apasă săgeata ▾ de lângă Σ și alege Medie (Average). Excel scrie =AVERAGE(B2:B7)”): `p9.json › s3_average` B8 = „=AVERAGE(B2:B7)” în editare, Enter → **8** (`s4`). Referința: `c_autosum.B8_formula "=AVERAGE(B2:B7)"`, `B8_text "8"`.
- Cu tastatura: Alt, H, U, A → același rezultat (`p1.json › X5_alt_h_u_a`, evenimente `tasta_acces` cu ținta `meniu:Average`); ▾ + ↓ ↓ + Enter → Average, cu `activat: meniu:Average`. Ctrl+Z golește celula.
- Ce rămâne nereparat pe Σ e altceva decât X5: modul din bara de stare (GRAV E3).

### X8 (Ctrl+S / Ctrl+W pe registru nou / modificat): **ÎNCHIS**
- Ctrl+S pe registru nou → fereastra „Save this file”, cu focusul în File name = „Book1” (`p3.json › 1_ctrl_s_nou`). Referința: `a_ctrl_s_registru_nou` (`cheie dialog.save_this_file`, `backstage null`, focus `Edit File name`). Butonul Save din Acces rapid → aceeași fereastră (`1c_qat_save`).
- „Tema_mea” + Enter → `nume_fisier: Tema_mea.xlsx`, titlul „Tema_mea - Excel”, cu `activat: dialog_salvare:Save` (`2_save_enter`). More options… → pagina Backstage „Save As” (`8_more_options` = `more_options.backstage "Save As"`).
- Ctrl+W pe registrul modificat → `dialog: {titlu: "", intrebare: "Save your changes to this file?", butoane: [More options…, Save, Don't Save, Cancel], apasat: null}`, `registru_activ: Book1` (`5b_ctrl_w`), identic cu `scenarii_real/excel-ctrl-w-modificat.json`. Răspunsurile:
  - Esc și Cancel lasă registrul deschis (`3b`, `3c`; referința `registre_dupa_cancel: 1`);
  - Don't Save închide registrul și rămâne Excel gol (`5e`);
  - Save salvează cu numele din casetă, apoi închide (`7b`).
- File › Close pe un registru modificat duce la aceeași întrebare (`7_file_close_modificat`), deci exercițiul m1-l03:182 („Ctrl+W, apoi Save în fereastra care apare”) se poate face și în Chrome, unde Ctrl+W închide fila.
- Ctrl+N → Book2, Book3 (`6`, `6b`). Ctrl+W pe un registru nemodificat îl închide fără întrebare (`6c`).
- Rămân, fără referință: întrebarea pentru un registru deja salvat și lista Choose a Location ▾ (vezi [FARA_REFERINTA] 1 și 8). Lecția se poate duce la capăt, pentru că locul propus e „Documents”, ca în referință (`a_ctrl_s_registru_nou.texte`).

### X10 (grafice): **DESCHIS**
- Neatins în rundă (`gata_pentru_critic.md`: „NEatins: X10”). Insert › Insert Column or Bar Chart → „În aplicația reală, „Insert Column or Bar Chart” funcționează; aici nu e simulată.” (`p8.json › x10_grafic`). Lecția m2-l11 stă pe această comandă. Referința există acum (`acoperire_r7.fapte.h_grafic`: Clustered Column, filele Chart Design / Format).

### K1 (tastatura în ferestre): **DESCHIS** (reparat în mare parte)
- **Reparat:**
  - Sort se deschide cu focusul pe OK (`p6.json › s0`; referința `d_sort.focus_la_deschidere: OK`). Tab trece prin Cancel, Add Level, Delete Level, Copy Level, Options..., My data has headers, Sort by, Sort On, Order (`p4.json › s1_tab_seq`).
  - Alt+↓ pe Sort by deschide lista (Nume, Clasa, Punctaj), ↓ ↓ + Enter alege Clasa (`p6.json › A1a`, `activat: lista_sortare:Clasa`). Alt+A adaugă nivel (`p7.json › a2`), iar Alt+H debifează My data has headers, cu lista Column A / B / C (`p4.json › h1`, `h2`), ca în `randuri.lista.SortDialog_SortBy_fara_antet`.
  - Sort Warning: Alt+C, ↑ și ↓ mută alegerea (`p6.json › B1`–`B3`).
  - Column Width: Tab → OK, Shift+Tab → înapoi în casetă (`p4.json › cw_tab`).
  - Save As: Alt+N → File name, Alt+S salvează (`p4.json › sa_alt_n`, `sa_alt_s`).
- **Rămâne:** după o alegere pe nivelul al doilea (Then by sau Order-ul lui), focusul cade din fereastră pe `BODY`, și cu tastatura (`p7.json › a3_thenby1`, `a4_order1`) și cu mouse-ul (`a8`, `a9`).
  - Urmarea: Enter nu mai face nimic și **nu emite niciun eveniment** (`a5_enter`: `ev: []`, Sort rămâne deschisă, tabelul nesortat; la fel după mouse, `a10_enter`). Esc, Ctrl+Z și Alt+S la fel (`p5.json › s5`–`sa2`: `ev: []`). Abia un Tab, lăsat browserului, readuce focusul și Enter sortează (`a6`, `a7`).
  - Cauza: `excel.js:1526`. `deseneazaNiveluri()` șterge și redesenează rândurile `.lh-ap-x-nivel-copie` (nivelurile 2+) după fiecare alegere (`excel.js:1589`) și nu pune focusul înapoi. Nivelul 0 nu e redesenat, de aceea acolo merge (`p6.json › A1c`, `A1d`: Enter sortează).
  - E drumul lecției m2-l10:63 („Două criterii… Add Level… Then by… Largest to Smallest… OK”) și încalcă §4 („Un eveniment pe fiecare gest fizic al elevului”).

### K2 (Enter în fereastră: `activat`, ținta, asistentul): **ÎNCHIS**
- Column Width: „20” + Enter → `{gest: tasta_enter, tinta: camp:latime_coloana, activat: fereastra:OK}`, lățimea C = 150. Asistentul `{pasi: [fereastra:OK, fereastra:OK], dupaGreseli: 2}`, făcut de două ori cu Enter, ajunge la `pas() = 2`, fără niciun indiciu (`p4.json › cw_enter_0/1`, `cw_asistent_pas`, `cw_indicii: []`).
- Sort, Enter → `activat: fereastra:OK` (`p6.json › A1d`). Sort Warning, Enter la deschidere → `activat: fereastra:Sort...`, rândurile întregi se mută (`p8.json › sw_enter`: A2 = Bogdan). Ținta Enter-ului e acum focusul din momentul tastei (`camp:Order`, `camp:latime_coloana`).
- Rămâne: Enter cu focusul pe o casetă de bifat sau un buton radio (GRAV E2, nou în rundă), plus două ținte `fereastra_app:excel` (MINOR).

### K3 (tastele cu meniul deschis): **ÎNCHIS**
- `p8.json`:
  - litera C în meniul celulei B2 → Copy (`activat: meniu:Copy`, chenar punctat), meniul se închide, B2 rămâne „VIII A” (`k3_1_c`);
  - Delete cu meniul deschis → `fara_efect`, C2 rămâne 88 (`k3_2`);
  - ↓ ↓ → Cut, Copy (`k3_3`), iar selecția rămâne C2;
  - R în meniul filei → Rename, cu caseta de redenumire (`k3_4`);
  - Borders ▾ + ↓ ↓ + Enter → Top Border pe C2, selecția neschimbată (`k3_5`).
- Literele vin din referință (`meniu_contextual.*`).

### K4 (`=AV` + Tab): **ÎNCHIS**
- `p1.json › K4_av_tab`: C6 = „=AVEDEV(B2:B4)”, text „0,666667” (pe ecran la fel), cum cere `scenarii_real/excel-av-tab.json`. `=AVER` + Tab → „=AVERAGE(B2:B4)” = 8 (`K4_aver_tab`, ca `excel-aver-tab.json`).

### K5 (modul Point): **ÎNCHIS**
- `p1.json`:
  - B5: „=” + ↑ → „=B4”, cu „Point” în bara de stare; încă două ↑ → „=B2”; Enter → 9, selecția B6;
  - D2: „=B2+” + → + Enter → „=B2+E2” = 13, ca `excel-point-egal-sus.json` / `excel-point-plus-dreapta.json`;
  - „=B2” + ↓ primește formula și coboară (`excel-sageata-confirma`);
  - Point urmat de „*2” → „=B2+E3*2”.
- Nu mai apare mesajul fals.

### K6 (KeyTips, Alt+=, Ctrl+Shift+%): **ÎNCHIS**
- `p1.json`:
  - Alt → literele filelor (1, 2, 3, Q, F, H, N, JI, P, M, A, R, W, Y…), cu `tasta_acces / arata_taste_acces`;
  - H → literele filei Home; 1 → A1 Bold (`format_celule.A1.bold: true`), iar Ctrl+Z îl scoate;
  - Alt, H, Esc, x → „x” nu ajunge în celulă (`fara_efect`).
- Alt+= sub B2:B4 → „=SUM(B2:B4)”, Enter → 24, selecția B6 (`K6_alt_egal_enter` = `scenarii_real/excel-alt-egal.json`); evenimentul `tasta_acces` are ținta `panglica:Home/Editing/AutoSum`.
- Ctrl+Shift+% pe B3 → „700%”, iar Ctrl+Z → „7”. Alt, H, P → „700%”.
- Copierea mecanismului a adus însă un efect nou: GRAV E1.

**Regresul celor închise înainte:** nu am găsit.
- X1: `=25/3` → „8,333333”.
- X6: `=DACĂ(…)` → `#NAME?` (`p11.json`).
- X7: lista Borders, desenată acum din referință, are aceleași 19 rânduri ca `randuri.lista.Borders`. All Borders pune cele patru margini pe B2:C3, Fill Color pune FFFF00 (`p11.json`); Wrap Text și Ctrl+Z merg (`p10.json`).
- Ctrl+Z / Ctrl+Y după sortare, umplere cu mânerul, Wrap Text, Delete pe zonă, lipire, Alt+= + Enter; Esc în editare (`p10.json`). Peste tot ecranul = starea (`ecran_diferit: {}`).

## B. Unghiul stare_finala_erori (Excel): constatări noi

### GRAV E1: după un Alt+literă care închide fereastra (Save As Alt+S, Sort Warning Alt+S), panglica intră singură în modul KeyTips, iar ce tastează elevul după aceea nu mai ajunge în celulă
- **Gestul** (`p6.json › C2a`, `C2b`): E2 activă, F12, „Lucrare”, Alt+S. Fișierul se salvează (`nume_fisier: Lucrare.xlsx`), dar apare și evenimentul `tasta_acces / arata_taste_acces`, iar pe panglică sunt literele 1, 2, 3, Q, F, H…
- Elevul tastează „abc”:
  - „a” → fila **Data** (`fila:Data`);
  - „b” → `panglica:Data/Outline/Subtotal`, cu mesajul central „În aplicația reală, „Subtotal” funcționează; aici nu e simulată.”;
  - abia „c” ajunge în E2 (`E2 = "c"`, în editare). Captura: `p6_dupa_alt_s_abc.png`.
- **Sort Warning** + Alt+S (`p6.json › C1a`, `C1b`; `p7.json › b1`, `b2`):
  - sortarea se face, apoi apar literele KeyTips;
  - „7” e înghițit (C2 rămâne 95, fără editare);
  - „2” apasă litera lui Undo din Acces rapid și dă mesajul **„În aplicația reală, „Undo” funcționează; aici nu e simulată.”** Mesajul e fals: Undo e simulat (Ctrl+Z merge, `p10.json`).
- **De ce e greșit:**
  - Codul spune singur că literele apar la „Alt apăsat și eliberat” (`excel.js:2714-2715`; variabila `altSingur`). §4 le leagă de „tastele care doar arată literele (Alt)”, adică Alt apăsat singur.
  - Referința scrie diferit tasta-combinație și șirul KeyTips: în `uia_excel.json › dialog.FileSaveAs`, Save are „Alt+s”, cu „+”, adică Alt ținut apăsat împreună cu S; filele panglicii au „Alt, H”, cu virgulă, adică întâi Alt, apoi H.
  - După Alt+S, Excel salvează și atât.
- **De unde vine:**
  - ascultătorul ferestrelor pentru Alt+literă (`excel.js:2693-2712`) oprește tasta cu `e.stopImmediatePropagation()` (`excel.js:2696`);
  - de aceea ascultătorul KeyTips (`excel.js:2796`) nu vede litera și `altSingur`, pus pe `true` la apăsarea lui Alt (`excel.js:2797`), rămâne `true`;
  - la ridicarea lui Alt, fereastra e deja închisă, deci verificarea `if (dialog || backstage) return;` (`excel.js:2817`) nu mai oprește nimic și KeyTips pornesc (`excel.js:2818-2820`).
- **Urmarea:**
  - drumul cu tastatura reparat pentru K1 (Alt+S în Save As) strică tastarea de după;
  - elevul își vede literele transformate în schimbări de filă și în mesaje false, iar asistentul §6.3 le numără greșeli (`tasta_acces` cu `actiune: fila / nesimulat` nu e printre excepții).

### GRAV E2: Enter cu focusul pe o casetă de bifat sau pe un buton radio o comută, în loc să apese butonul implicit; fereastra rămâne deschisă
- **Gestul:**
  - Sort, Sort by = Nume, Alt+H (My data has headers debifat, `aria-checked: false`), Enter → caseta **se bifează la loc** (`bifa: "true"`), Sort rămâne deschisă, nu se sortează nimic (`p7.json › c3_enter`: `{gest: tasta_enter, actiune: bifare, activat: fereastra:My data has headers}`);
  - Sort Warning, Alt+C (Continue with the current selection, focusul pe butonul radio), Enter → `actiune: alegere`, fereastra rămâne și nu se sortează (`p6.json › B4_enter_continue`).
- **Regula:** §4, `activat`: „Enter într-o fereastră apasă butonul ei implicit … learn.microsoft.com/…/dlgbox-programming-considerations (ENTER → „IDOK or control identifier of the default push button”)”. O casetă de bifat sau un buton radio nu e „push button”. Cu focusul pe ele, Enter apasă OK / Sort....
- **De unde vine:** `excel.js:2043` (`esteButon` = Button | **CheckBox | RadioButton**) și `excel.js:2117` (`const b = esteButon(ctl) ? ctl : butonImplicit();`). Codul e nou în rundă (`tastaDialog`).
- **Urmarea pe lecție:** m2-l10:62-63 („Lasă aleasă prima variantă, Expand the selection, și apasă Sort”; „My data has headers” bifat / debifat).
  - Elevul care alege cu tastatura și apasă Enter rămâne cu fereastra deschisă.
  - În Sort, Enter îi anulează pe ascuns alegerea de la caseta de bifat. Pe PC, același Enter sortează fără antet.

### GRAV E3: după Σ și după ▾ › Average, bara de stare arată „Enter”, nu „Point”; o săgeată primește formula
- **Gestul** (`p9.json`): B8 sub B2:B7, Σ → „=SUM(B2:B7)” în editare, **„Enter”** în bara de stare (`s1_sigma`). ▾ › Average → tot „Enter” (`s3_average`). ↓ după Σ → formula e primită: B8 = 48, selecția coboară în B9 (`s2_sigma_jos`, `actiune: confirmare`).
- **Referința:** `uia_excel.json › acoperire_r7.fapte.c_autosum`: `mod_dupa_sigma: "Cell Mode Point"`, `mod_dupa_average: "Cell Mode Point"`. În Point, o săgeată arată o celulă și scrie adresa ei, nu primește formula (`scenarii_real/excel-point-egal-sus.json`: „=” + ↑ → „=B4”; același mecanism e reparat pentru K5).
- **De unde vine:** `excel.js:1408` (`porneste(…, 'Enter', …)` în `autoSum`). Bara arată „Point” doar când `M.edit.punct` e adevărat (`excel.js:983`).
- **Urmarea:** pe drumul lecției m2-l08 (Σ), elevul care apasă ↓ în loc de Enter primește pe simulator suma corectă. Pe PC, formula i se schimbă. Bara de stare îi arată alt mod decât Excel.

### GRAV E4: după No / Esc în „We found a typo…”, Excel trece în modul Edit; simulatorul rămâne în „Enter”, iar săgeata ← redeschide fereastra
- **Gestul** (`p9.json › t1`, `t2`; `p2.json › b_typo_no`, `b_typo_esc`): D2, „=SUM(B2:B7)B2:B6” + Enter → fereastra typo (focusul pe Yes, ca în referință). No → înapoi în editare, cu **„Enter”** în bara de stare. ← (ca să mute cursorul și să corecteze) → `formula_neprimita`, iar fereastra „We found a typo…” apare din nou.
- **Referința:** `acoperire_r7.fapte.e_sum_lipit.mod_dupa_inchidere: "Cell Mode Edit"`. Fereastra a fost închisă cu Esc (= No; `referinte/acoperire_excel_r7.py:505-508`, `inchide_noi` din `acoperire_word_r3.py:196-217`). În modul Edit, ← mută cursorul în formulă: simulatorul face asta singur în Edit (`excel.js`, ramura `ed.mod === 'Edit'` → `mutare_cursor`).
- **De unde vine:** `raspunsEroare` (`excel.js:2140-2152`) întoarce în editare fără să schimbe modul.
- **Urmarea:** elevul nu-și poate corecta formula cu săgețile după fereastra de eroare. Fiecare săgeată îi redeschide fereastra.

### GRAV E5: Yes în „We found a typo…” → `#VALUE!`; în Excel real aceeași formulă dă 5 numere
- **Simulatorul** (`p2.json › b_typo_yes_enter`): D2 = „=SUM(B2:B7)*B2:B6” → **`#VALUE!`**, D3:D6 goale.
- **Excel real** (`com_r8.json`, același build 16.0.20326, aceleași date B2:B7 = 9, 7, 8, 10, 6, 8): `Formula2 = "=SUM(B2:B7)*B2:B6"` în D2 → D2:D6 = **432, 336, 384, 480, 288**, `HasSpill: true`. Formula e chiar cea pe care fereastra o propune (`e_sum_lipit.texte`). Am pus-o prin COM, nu cu Yes, deci ce face Yes rămâne o deducție, dar rezultatul formulei e citit.
- **Urmarea:** elevul vede o eroare acolo unde Excel arată rezultate. E un drum rar, dar fereastra e nouă în rundă și e pe unghi.

## C. Regresul Word: **NU strică**
`w8.py`, aceleași gesturi pe `aplicatii/` de la `4b53a65a` și pe worktree, la 1366×768:
- deschidere;
- „Mădălina are 5 mere” + Enter;
- Alt; Alt, H, 1;
- F12 + „Tema_mea” + Enter;
- „x” + Ctrl+W (fereastra „Save your changes to this file?”), Esc;
- lista Font Size;
- Ctrl+F12 (Open);
- Ctrl+Z de două ori;
- plus compunerea „Ană” la 375×667.

Rezultatul:
- 12 din 13 capturi sunt identice pixel cu pixel. Singura diferență („3_alt_h_1”) e dreptunghiul de 2×16 px de la x = 372: cursorul care clipește, ca în runda 7.
- Dreptunghiurile tuturor `[data-lh-tip]` sunt identice (136 / 235 / 153 / 157 / 215 noduri).
- `stare('word')` e identică (text, titlu „Tema_mea - Word”, `dialog`, formatarea), la fel lista evenimentelor. Erori în pagină: 0.
- Cârligul nou din `aplicatii.js` (`I.tintaTasta`) e pus doar de Excel. CSS-ul nou e legat de `.lh-ap-x-*`.

## [FARA_REFERINTA] (nu le număr GRAV)
1. **„Save your changes to this file?” pentru un registru deja salvat** (`p3.json › 3_ctrl_w_modificat_numit`): aceeași fereastră, cu File name „Tema_mea”, Save as type și Choose a Location.
   - Referința e luată doar pe Book1 nesalvat (`b_ctrl_w_modificat.registru_saved_inainte: false`). Pentru un fișier salvat, fereastra e extrapolată (scrisă din memorie, nedovedită prin COM).
   - Exercițiul m1-l03:176-182 pornește tocmai de la un fișier salvat (Robotica_8A.xlsx). Save merge, deci exercițiul se termină.
2. **Ctrl+Z după salvare** lasă registrul „nemodificat”: Ctrl+W îl închide fără întrebare (`p3.json › 4b`, `4c`). Am încercat să probez în Excel real, dar `Application.Undo` după un `Save` prin COM a dat eroare (`com_r8.json › 1_undo`), deci proba nu spune nimic.
3. **OK / Esc în „There's a problem with this formula” și „too few arguments”:** simulatorul rămâne în editare, în modul „Enter”, iar ← redeschide fereastra (`p9.json › v2`). Referința se contrazice cu lecțiile:
   - referința: `e_sum_virgula` / `e_su_tab.mod_dupa_inchidere: "Cell Mode Ready"`, după Esc + WM_CLOSE;
   - lecțiile: m2-l09:61 și m2-l13:106 spun „apasă OK și pune virgulă”, adică după OK elevul rămâne în formulă.
   - Trebuie o captură închisă cu butonul OK.
4. **Paranteză lipsă, „=” singur, „=B2+” + Enter** → mesajul central „Excel nu primește formula așa cum e scrisă. În aplicația reală apare o fereastră de eroare…” (`p2.json › f_*`, `g_*`, `h_*`). Pentru „=SUM(B2:B4” mesajul afirmă despre Excel ceva neprobat (din memorie, Excel închide singur paranteza).
5. **Ghilimelele românești** `=IF(B2>=9;„da”;„nu”)` → mesajul central (`p2.json › e_ghilimele_ro`). Lecția m2-l09:61-62 și :154 descrie fereastra „There's a problem with this formula” și „apeși OK”. Referința are fereastra doar pentru virgulă. Lecția se poate termina: elevul corectează ghilimelele.
6. **Referința circulară** `=E5+1` în E5 → „1”, fără nicio fereastră (`p2.json › d_erori`). Din memorie, Excel avertizează și arată 0.
7. **Numele cu caractere interzise** „a/b?c” → salvat pe ascuns ca „abc.xlsx” (`p3.json › 11`). Codul e mai vechi (`salveazaDinDialog`).
8. **Choose a Location ▾** în „Save this file” → mesajul central (`p3.json › 9`). Rândurile listei nu sunt capturate. m1-l03:95 cere „alegi Documente”; locul propus e deja „Documents” (`a_ctrl_s_registru_nou.texte`), deci lecția se termină, dar capcana ei („locul propus de un coleg”) nu se poate arăta.
9. **Σ cu un singur număr în stânga** → „=AVERAGE(B5:B5)” (`p1.json › X5_sageti_enter`). Nu e probat cum scrie Excel zona de o celulă.

## MINOR
- **Esc în modul KeyTips** emite `gest: tasta_acces, actiune: iesire_taste_acces` (`p1.json › K6_alt_h_esc`). §4 spune: „Esc în modul tastelor de acces: `tasta_esc`”. Pentru asistent efectul e același (ambele sunt greșeli).
- **Alt, Q** → mesajul central numește comanda „cautare” (numele intern), nu eticheta din Excel (`p1.json › K6_alt_q`). Mesajele centrale rămân pe ecran și după gesturile următoare.
- **Ținta `fereastra_app:excel`** în loc de focus:
  - Enter pe OK în Sort cu un nivel gol (focusul pe OK, `p4.json › s8`);
  - Enter în Sort Warning la deschidere (`p8.json › sw_enter`).
  - `activat` e corect, deci asistentul recunoaște pasul.
- **Save cu numele gol:** Enter → `fara_efect`, dar cu `activat: dialog_salvare:Save` (`p3.json › 10`).
- **Ordinea Tab** în „Save your changes”: File name → Save as type → Choose a Location → More options… → Save → Don't Save → Cancel (`p3.json › 5c`). Nu e capturată în referință.
- **Format Cells, OK / Enter** → mesajul central (`p4.json › fc_enter`), ca înainte.

## Ce a trecut (văzut în `stare()`, pe ecran și în evenimente)
- **AVEDEV** (K4), **modul Point** la „=” și după operator (K5), **KeyTips** pe file, Home, lista Σ, cu Esc la jumătate (K6), **Alt+=** și **Ctrl+Shift+%**, toate cu Ctrl+Z.
- **Lista ▾ Σ** cu mouse-ul, cu săgețile și cu Alt, H, U, A (X5). **Lista Borders** desenată din referință (X7 rămâne închis).
- **Meniurile cu tastatura**: literele de acces, săgețile, Enter, Delete fără efect (K3).
- **Ferestrele de eroare** (texte, butoane, focus pe Yes / OK, ca în `e_sum_lipit` / `e_sum_virgula` / `e_su_tab`):
  - `fereastra_mesaj` = scenariile `excel-separator-virgula` și `excel-autocompletare-tab` (`butoane: ["OK"]`, `ramane_in_editare: true`);
  - Esc în celulă după fereastră o golește (`p2.json › a_virgula_esc_celula`);
  - `#DIV/0!`, `#VALUE!`, `#NAME?` pe ecran și în stare.
- **„All sort criteria must have a column or row specified…”** peste Sort, cu Esc care închide doar mesajul (`p4.json › g2`, `g3`).
- **Sortarea pe două niveluri** (Clasa A→Z, apoi Punctaj descrescător: Elena 95, Ana 88, Carmen 60, Bogdan 95, Dan 78, Florin 60), **fără antet** (Column A / B / C), **Sort Warning Expand** (rânduri întregi), Ctrl+Z / Ctrl+Y după sortare.
- **Salvarea și închiderea:**
  - Save this file, Save your changes (Save / Don't Save / Cancel / Esc), More options… → Backstage Save As;
  - Ctrl+N → Book2 / Book3, File › Close, Excel gol după ultimul registru;
  - starea „modificat” după lățime (tragere și Column Width), sortare, Wrap, umplere, redenumire (`p8.json › mod_*`).
- **Ecranul = starea** la toate celulele urmărite (`p10.json`). Erori în pagină: 0 în toate probele.
- **Word**: fără regres (secțiunea C).

GRAV_VECHI_DESCHISE: 2
GRAV: 7
