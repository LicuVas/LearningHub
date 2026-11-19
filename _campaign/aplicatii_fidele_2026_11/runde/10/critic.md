# Criticul rece, runda 10, etapa B (Excel, al cincilea val): cele 4 GRAV din runda 9 + unghiul GEST_TASTATURA + regresul Word

**Cine:** critic rece, fără notele constructorilor. Din `runde/10/` am citit doar `gata_pentru_critic.md`; din `runde/9/` doar `critic.md` și, ca model, `critic_probe/h.py`, `p1.py`, `p2.py`, `p5.py`, `w9.py`. N-am deschis `diferente.md`, `de_verificat.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `regres*`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. Citirile COM ale constructorului (`runde/10/probe/com_r10_b.json`, `com_r10_c.json`) le-am folosit doar ca date brute. Concluziile vin din gesturile și măsurătorile mele.

**Ce am rulat** (totul în `runde/10/critic_probe/`):
- Server static legat de `127.0.0.1`, pe un port liber, pornit și oprit în fiecare script, servind worktree-ul. Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`h.py`, copiat din runda 9). Deschiderea: `LH.aplicatii.deschide('excel', {loc, continut, focus:true})`, cu tabelele lecțiilor (B2:B7 = 9, 7, 8, 10, 6, 8 din `com_r8`; B2:C4 = 9, 7 / 8, 10 / 6, 5 din `bara_stare#selectie_numere`; CARTI și LUNI din m2-l11; tabelul Nume / Clasa / Punctaj din m2-l10).
- Gesturi reale:
  - `page.keyboard`: Enter, Tab, Shift+Tab, Shift+Enter, Esc, săgeți, Shift+săgeți, Ctrl+săgeți, Ctrl+Shift+săgeți, Ctrl+Home/End, Ctrl+Shift+Home, F2, F12, Delete, Backspace, Alt, Alt+literă, Alt+=, Ctrl+Shift+%, Ctrl+C/X/V/Z/Y/S/A;
  - tastatura românească prin CDP (`Input.dispatchKeyEvent` cu `key: "ă"`), tastatura telefonului prin CDP (`Input.insertText`, apoi Enter);
  - `page.mouse` (clic, tragere pe grilă și pe grafic, rotiță);
  - `page.touchscreen.tap` și tragerea cu degetul prin CDP (`Input.dispatchTouchEvent`) la 375×667.
- Probele: `p1.py` (E5, A2, A1 la 1366×768), `p2.py` (E5 reluat; A1 pe telefon și în fereastra mică 1093×526), `p3.py` (telefon: LUNI + graficul + C5), `p4.py` (unghiul tastaturii + asistentul §6.3 pe telefon), `p5.py` (bara de stare în fereastra mică și pe telefon), `p6.py` (tastele peste celulele vărsate), `p7.py` (Alt+Y / Alt+N, Alt, N, C, Esc ×3, tastarea în celulă pe telefon), `p8.py` (X10). Ieșirile: `p*.json`. Capturile: `p1_a1_mouse.png`, `p1_a2_bara.png`, `p2_*_inserat.png`, `p3_*_inserat.png`, `p4_tel_indiciu.png`, `p5_*_bara.png`, decupajul `c_tel_luni_grafic.png`.
- După fiecare gest am citit: `stare('excel')`, textul celulei cu algoritmul O4 (`h.py › ecran`), bara de formule, modul din bara de stare, focusul, `window.__lhAplicatieEv`, mesajele `[data-lh-nesimulat]`, literele KeyTips și dreptunghiurile (`getBoundingClientRect`, față de rădăcină și față de ecran).
- Referința am citit-o doar cu Python, pe chei (`ref_dump.py`): `bara_stare`, `bara_stare#selectie_numere`, `zona_document`, `dialog.eroare_formula`, `dialog.ChartChangeType`, `lista.ChartTypeColumnInsertGallery`, `acoperire_r7.fapte` (`e_sum_lipit`, `h_grafic`, `i_bara_stare`). `dpi_factor` = 1.0, `fereastra` = [1366, 768].
- **Excel real, invizibil**, cu instanța mea (`com_r10k.py`, `com_r10k2.py`, `com_r10k3.py` → `com_r10k*.json`):
  - `DispatchEx`, `Visible=False`, `DisplayAlerts=False`, registru nou nesalvat (niciun fișier scris), build 16.0 20326;
  - de fiecare dată Excel a ieșit la `Quit` (`pid_ramas_dupa_quit: false`): fără oprire forțată, fără intrări noi de recuperare;
  - Excel-ul omului și PowerPoint nu le-am atins.
- Regresul Word (`w10.py`): aceleași gesturi pe `aplicatii/` de la `5d542c04` (`git archive` într-o copie din %TEMP%, ștearsă la final) și pe worktree.
- Probele vechi (cu `--iesire` în dosarul meu): `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav.py`, `proba_grav_cont.py`, `proba_grav_cont2.py`, `runde/6/proba_excel.py`, plus `runde/10/proba_grav.py` (`reg_*.json/txt`, `reg_sumar.txt`).
- Greșeli de probă ale mele, refăcute: în `p1.py` am deschis o dată tabelul fără cheia `celule` (rezultatele „0” de la `e5_15`, `e5_16`, `e5_17` sunt nule; refăcute corect în `p2.py`); în `p2.py` am atins centrul graficului când era deja derulat sub panglică (rezultatele `5_backspace`, `6_delete` sunt nule; refăcute în `p3.py`); în `p6.py`, după Ctrl+↓, clicurile au căzut pe grila derulată (reluat cu Ctrl+Home înainte de fiecare clic).

**Diff-ul rundei** (`git diff 5d542c04 770587e5 -- aplicatii`: doar `aplicatii/excel.js`, +182 / −25):
- **E5:** `opMat` / `liber` / `ancore` / `varsat` / `toateVarsate` (`excel.js` ~322-401); `valoare` dă celulei goale valoarea vărsată; `evalua` face aritmetica element cu element; `I.stare` și `deseneazaGrila` arată celulele vărsate.
- **A2:** `rezumatSelectie` (~826-869), chemat din `actualizeazaBare`; ascunde Display Settings.
- **A1:** `insereazaGrafic` pune graficul în mijlocul zonei vizibile a grilei (`excel.js:2632`); `kg()` păstrează mărimea graficului 480×288 și pe telefon; `mutaGrafic` mută în px de grilă și mărește în px de grafic.
- **MINOR-uri ale criticului 9:**
  - `tastaGrafic` pune ținta tastei `grafic:N` / `grafic:N/titlu` (`excel.js:2765`);
  - `deseneazaNiveluri` dă `camp:Then by` pe nivelurile 2+;
  - `scaraGrafic` lasă loc deasupra maximului.

## A. Cele 4 GRAV din runda 9

### X10 (graficele, m2-l11: Insert Line or Area Chart, Add Chart Element › Data Labels): **DESCHIS** (neatins, cum spune `gata_pentru_critic.md:9`)
- Insert › Insert Line or Area Chart ▾ → `{gest: meniu_derulant, actiune: nesimulat}`, „În aplicația reală, „Insert Line or Area Chart” funcționează; aici nu e simulată.” (`p8.json › 1_line_area`).
- Chart Design › Add Chart Element → același mesaj (`3_add_element`). Etichetele de date nu se pot pune, iar cerința lecției rămâne cea din runda 9 (`lectii/viii/m2-l11/index.html:251-252`).
- **Graficele nu s-au stricat:**
  - inserarea pe LUNI, cu serii 8A / 8B și categoriile septembrie…decembrie (`2_inserat`);
  - Switch Row/Column (`4_switch`);
  - Change Chart Type › Line › OK → `tip: Line`, cu 4 linii SVG desenate (`5_line`);
  - Ctrl+Z → Clustered Column (`6_ctrlz`);
  - titlul, Delete, Ctrl+Z (`p1.json › a1_6`, `a1_7`); erori în pagină: 0.

### E5 (Yes în „We found a typo…” → vărsare): **ÎNCHIS**
- **Gestul:** D2, „=SUM(B2:B7)B2:B6”, Enter → fereastra `dialog.eroare_formula`, cu focusul pe Yes și bara în „Enter” (`p1.json › e5_0`; referința: `e_sum_lipit.focus = Yes`, `mod_cu_fereastra: "Cell Mode Enter"`).
- **Enter (Yes):** `{gest: tasta_enter, actiune: confirmare, tinta: fereastra:Yes}` (`e5_1`):
  - starea: D2 = 432 cu formula „=SUM(B2:B7)*B2:B6”; D3:D6 = 336, 384, 480, 288, **fără formulă**;
  - ecranul (algoritmul O4): „432”, „336”, „384”, „480”, „288”;
  - celula activă D3, bara în „Ready”;
  - referința `com_r8.json`: `2_D2_D7_text` = 432, 336, 384, 480, 288, ""; `2_D3_formula2` = ""; `2_D2_spill` = true.
- **Alt+Y** (referința: Yes „ALT+Y”) dă aceeași vărsare; **Alt+N** (No „ALT+N”) → bara „Edit”, formula rămâne în celulă (`p7.json › 1_alt_y`, `2_alt_n`).
- **Recalculul:** B2 = 10 → D2:D6 = 490, 343, 392, 490, 294, pe ecran și în stare (`e5_3`); 49 × (10, 7, 8, 10, 6) e corect.
- **Ctrl+Z / Ctrl+Y:** primul Ctrl+Z întoarce B2 = 9 (D = 432…); al doilea golește toată vărsarea; Ctrl+Y o readuce întreagă (`e5_4` … `e5_6`).
- **Scris peste o celulă vărsată:**
  - D4 = 5 → D2 = `#VALUE!`, D4 = 5, celelalte goale; Ctrl+Z readuce vărsarea (`e5_7`, `e5_8`);
  - eticheta erorii e greșită față de Excel (vezi [FARA_REFERINTA] 1).
- **Delete pe D3 vărsată:** nimic nu se schimbă (`e5_9`).
- **F2 pe D3:** editare goală; Enter fără nimic tastat readuce vărsarea, deci nu se face o celulă goală (`e5_10`, `e5_11`). F2 + „1” + Enter → D3 = 1, D2 = `#VALUE!` (`e5_12`).
- **Delete pe D2 (ancora):** golește toată vărsarea (`e5_14`).
- **Zona ocupată dinainte** (D4 = „x”): după Yes, D2 = `#VALUE!` (`p2.json › e5_ocupat`). [FARA_REFERINTA] 1.
- **Alt+= sub vărsare** (D7): „=SUM(D2:D6)” → 1920 (`p6.json › 4_*`); COM: `D8 =SUM(D2:D6)` = 1920 (`com_r10k3.json`).
- Pasul din runda 9 e reparat: Yes nu mai dă `#VALUE!`, ci valorile și starea din Excel real. Ce nu e în referință (eticheta `#SPILL!`, tastele peste celulele vărsate) e la [FARA_REFERINTA] 1-3, cu dovada COM.

### A1 (locul graficului nou): **DESCHIS** (reparat pe calculator și în fereastra mică; pe telefon lecția se blochează)
- **Regula aleasă se potrivește cu Excel real.** Am refăcut calculul pe datele brute `com_r10_b.json` / `com_r10_c.json` (9 ferestre):
  - left = (UsableWidth − 360)/2 − 10,2 pt, cel puțin 0: 1136,4 → 378,0; 997,8 → 308,7; 793,2 → 206,4; 573,6 → 96,6; 273,6 → 0;
  - top = (UsableHeight − 216)/2 − 7,2 pt, cel puțin 0: 541,8 → 155,7; 495 → 132,3; 313,2 → 41,4; 369 → 69,3; 168,6 / 219 → 0;
  - toate se potrivesc cu `left_pt` / `top_pt` citite de Excel;
  - pe referința de la 1366×768 (`zona_document`: panoul grilei [1, 220, 1364, 525], bara verticală la x = 1346, bara orizontală la y = 720), regula dă coloana G și rândul 5 (~420 px de la A, ~86 px de la rândul 1), oricum aș socoti antetele.
- **1366×768:**
  - cu mouse-ul și cu tastele (Alt, N, C, ↓, Enter), graficul e la `pozitie {x: 415, y: 81, w: 480, h: 288}`, cu colțul stânga-sus în **G5**, întreg vizibil (`p1.json › a1_0_mouse`, `a1_3_enter`);
  - mărimea rămâne cea din referință (Ctx_Format 12,7 × 7,62 cm).
- **Fereastra mică 1093×526:**
  - graficul e la x = 279, y = 0, adică lipit sus, și se vede 480 × 228 px din 288 (`p2.json › mica.0_inserat`);
  - Excel face la fel când zona e mai joasă decât graficul (`com_r10_c.json`: `top_pt` 0 la UsableHeight 168,6 și 219);
  - titlul, mutarea (`tragere / mutare_grafic`), derularea cu rotița și mărirea din colțul dreapta-jos (520 × 318) merg (`mica.2_mutare`, `3_dupa_derulare`, `4_marire`).
- **Telefon 375×667, cu atingeri:**
  - graficul nou se vede acum: 329 × 260 px din 480 × 288, cu titlul și trei cerculețe (`p2.json › tel.0_inserat`);
  - dar stă la x = 0, y = 0 (`pozitie`), adică **peste tot tabelul**: la LUNI acoperă A1:E9 (`c_tel_luni_grafic.png`).
- **Ce rămâne (de ce e DESCHIS):** pe telefon elevul nu mai poate duce m2-l11 la capăt (`p3.json › tel`).
  - **Nu-l poate muta cu degetul:**
    - tragerea de margine se oprește după ~15 px: pointerii sunt `pointerdown`, un `pointermove`, apoi nimic (`1_tragere.pointer`);
    - `pozitie.x` trece din 0 în 10 **fără niciun eveniment** (`ev: []`), deci se încalcă R6 / §4 („un eveniment pe fiecare gest fizic”);
    - nicio regulă `touch-action` nu acoperă graficul (`aplicatii.css`: `touch-action:none` doar la r. 256 și 316), iar `aplicatii.js:311-339` n-ascultă `pointercancel`;
    - lecția cere: „Dacă graficul acoperă tabelul, trage-l de marginea lui albă spre dreapta” (`m2-l11/index.html:64`).
  - **Nu poate atinge C5:**
    - pasul „Clic pe <b>C5</b>, scrie <b>30</b> și apasă Enter” (`m2-l11/index.html:67`): sub centrul lui C5 e `grafic:1` (`0_sub_C5`);
    - atingerea alege graficul, „30” dă `fara_efect`, iar C5 rămâne 22 (`2_C5_30`).
  - **Nu-l poate șterge:**
    - Backspace (tastatura telefonului n-are Delete) → `tasta_backspace / fara_efect`;
    - Home › Cut cu graficul ales → `decupare` pe celule, graficul rămâne (`3_backspace`, `3_cut`);
    - lecția: „Pe telefon, în loc de tasta Delete, atingi butonul Delete de sub grafic” (`m2-l11/index.html:140`), dar biblioteca n-are un asemenea buton.
- **Concluzia pe A1:**
  - locul e corect pe calculator și în fereastra mică;
  - pe telefon, contractul I1 („biblioteca merge la 360-390 px”) și drumul m2-l11 sunt tot încălcate: înainte graficul cădea în afara ecranului, acum acoperă tabelul fără ieșire.
  - Ca să se închidă: graficul trebuie să se poată muta, mări și șterge cu degetul, cu evenimentul lui, sau, pe telefon, să nu acopere tabelul.

### A2 (rezumatul selecției în bara de stare): **ÎNCHIS**
- B2, apoi Shift+→, Shift+↓, Shift+↓ → B2:C4 (`p1.json › a2_1`). Butoanele, față de `bara_stare#selectie_numere`:
  - **„Average 7,5”** [860,2; 746,4; 74,4; 20,8] față de [859,2; 746,4; 74,4; 20,8];
  - **„Count 6”** [934,6; …; 55,2] față de [933,6; …; 55,2];
  - **„Sum 45”** [989,8; …; 53,6] față de [988,8; …; 53,6];
  - decalajul de +1 px e același ca la tot cadrul (runda 9: Home la 60 față de 59);
  - **Display Settings dispare**, iar fără selecție revine la [926, 746, 116, 21] (referința: [925, 746, 116, 21]) (`a2_0`, `a2_7`); captura `p1_a2_bara.png`.
- Aceleași valori:
  - cu mouse-ul (`a2_6`) și cu Ctrl+Shift+End din B2 (`a2_8`);
  - pe celulele vărsate D2:D6, cu Shift+↓ ×4: „Average 384 · Count 5 · Sum 1920” (`p6.json › 3b`).
- Ctrl+Shift+↓ din B2 → B2:B4, „Average 7,666666667 · Count 3 · Sum 23” (`a2_2`).
- Evenimentul Shift+săgeată: `{gest: sageti, actiune: extindere_selectie, tinta: celula:B2}`, deci nu e greșeală pentru §6.3.
- Cazurile din afara referinței sunt la [FARA_REFERINTA] 6.

### Regresul celor închise înainte (X1-X9, K1-K6, E1-E4)
- **Fără picări:** `runde/9/proba_grav.py`, `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/10/proba_grav.py`; `runde/6/proba_excel.py`: 20 de cazuri, 0 picate (`reg_sumar.txt`).
- **`runde/7/proba_grav.py`: 2 picate, ambele la X6**, aceleași ca în runda 9, cerute de o probă mai veche decât referința:
  - „mesaj vizibil” acolo unde referința cere fereastra „We found a typo…” (`e_sum_lipit`);
  - „Esc iese din editare” acolo unde referința cere trecerea în Edit (`mod_dupa_inchidere: "Cell Mode Edit"`).
- **`runde/7/proba_grav_cont2.py`: 3 picate la X8**, aceleași ca în runda 9: proba cere mesajul central la Ctrl+W pe un registru modificat, iar referința (`b_ctrl_w_modificat`) cere fereastra „Save your changes…”, care apare.
- Comportamentele astea nu s-au schimbat în rundă (diff-ul nu atinge Ctrl+W și typo-ul No / Esc). Nu e regres.
- **Cu gesturile mele:**
  - E1: Alt+Y / Alt+N închid fereastra fără KeyTips (`p7.json`);
  - E2-E4: Enter pe Yes = `activat: fereastra:Yes`; Esc / No → Edit;
  - E3: Alt+= → Point, Enter → 1920;
  - K1: Sort, Alt+A, Tab până la Then by, Esc → `tinta: camp:Then by` (`p4.json › 1_*`);
  - K6: Alt → 1, 2, 3, Q, F, H, N…; Alt, N, C, Esc, Esc, Esc urcă lista → fila Insert → filele → ieșire (`p7.json › 3_*`).
- Erori în pagină: 0 în toate probele.

## B. Unghiul GEST_TASTATURA (Excel): constatări noi

### GRAV T1: pe telefon, literele tastate în titlul graficului au ținta `celula:A1`, iar asistentul §6.3 arată indiciul în timp ce elevul scrie corect
- **Gestul** (`p4.json › 9_asistent_tel`, 375×667):
  - am inserat graficul cu atingeri și am pornit un asistent cu pașii `[{tinta:'grafic:1/titlu'}, {tinta:'grafic:1/titlu', asteapta: actiune === 'titlu_grafic'}]`, `dupaGreseli: 2`;
  - am atins titlul → pasul 1 e făcut (`pas: 1`, fără indiciu);
  - am tastat „C”, „ă”, „r” cu tastatura telefonului (`Input.insertText`) → trei evenimente `{gest: tastare, actiune: scriere, tinta: celula:A1}`;
  - titlul în lucru e „Căr” (bara de formule), deci literele chiar intră în titlu;
  - după a doua literă apare **indiciul „Scrie titlul si apasa Enter” pe `grafic:1/titlu`**, deși elevul face exact pasul (captura `p4_tel_indiciu.png`);
  - Enter → `tinta: grafic:1/titlu`, `titlu_grafic`, `pas: 2`.
- **Aceeași ținta greșită apare cu graficul ales** (nu titlul): atingere pe grafic, „30” → `{tastare, fara_efect, tinta: celula:A1}` (`p3.json › tel.2_C5_30`).
- **Pe calculator e corect:** aceleași litere dau `tinta: grafic:1/titlu` (`p2.json › mica.1_titlu`), iar cu graficul ales, săgețile / litera / Enter / Esc dau `grafic:1` (`p1.json › a1_4`).
- **Controlul:** pe telefon, tastarea într-o celulă dă ținta celulei (`p7.json › 4_tel_celula`: `celula:C2`). Defectul e doar pe drumul titlului / graficului.
- **Cauza:**
  - textul venit fără `keydown` (telefon, IME) se emite cu `I.zonaTinta`: `aplicatii.js:399` („emite(I, 'tastare', act || 'fara_efect', I.zonaTinta, ina)”) și `:438` (ștergerile);
  - reparația rundei (`tastaGrafic` pune `I.tintaTasta`, `excel.js:2765`) acoperă doar drumul `keydown`, iar `I.la.text` (`excel.js:3227-3229`) scrie în titlu fără să schimbe ținta.
- **De ce e GRAV:**
  - §4: „tinta: … la taste: ținta focusului”; reparația însăși spune că, „cu graficul sau titlul lui ales, focusul e graficul / titlul” (`excel.js`, comentariul de deasupra `tastaGrafic`);
  - §6.3: „Greșeală = orice alt eveniment al aplicației…” plus „După `dupaGreseli` greșeli la rând … `evidentiaza` + `indiciu`”;
  - pe telefon, elevul care scrie corect titlul primește indiciul ca și cum ar greși, iar profesorul vede în jurnal litere „scrise în A1”;
  - MINOR-ul criticului 9 („Ținta tastelor cu graficul ales e celula activă”) a fost reparat doar pe jumătate, iar pe telefon (contractul I1) rămâne.

## C. Regresul Word: **NU strică**
`w10.py`, aceleași gesturi pe `aplicatii/` de la `5d542c04` și pe worktree, la 1366×768, plus compunerea „Ană” prin CDP la 375×667:
- deschidere;
- „Mădălina are 5 mere” + Enter;
- Alt; Alt, H, 1;
- F12 + „Tema_mea” + Enter;
- „x” + Ctrl+W („Save your changes to this file?”), Esc;
- lista Font Size;
- Ctrl+F12;
- Ctrl+Z de două ori.

Rezultatul:
- **Capturile:** 11 din 13 identice pixel cu pixel. Diferă doar două dreptunghiuri subțiri: 2 × 16 px la x = 372 („3_alt_h_1”) și 1 × 18 px la x = 496 („10_ctrl_z2”). E cursorul care clipește, ca în rundele 7-9. Ambele capturi de telefon sunt identice.
- **Dreptunghiurile** tuturor `[data-lh-tip]` sunt identice (136 / 235 / 153 / 157 / 215 noduri).
- **`stare('word')`** e identică: text, „Tema_mea.docx”, `dialog` „Save your changes to this file?” cu cele 4 butoane, formatarea. Evenimentele sunt identice, iar erorile în pagină: 0.
- Diff-ul rundei nu atinge decât `aplicatii/excel.js`. Copia din %TEMP% a fost ștearsă.

## [FARA_REFERINTA] (nu le număr GRAV)
1. **`#VALUE!` în loc de `#SPILL!`** (dovedit prin COM, `com_r10k.json`).
   - Când zona vărsării e ocupată (D4 = „x”) sau elevul scrie peste o celulă vărsată (D4 = 5), simulatorul pune în D2 `#VALUE!` (`p2.json › e5_ocupat`, `p1.json › e5_7`, `e5_12`).
   - Excel real: `1_ocupat_D2_D7` = „#SPILL!”, „”, „x”; `2_dupa_D4_5` = „#SPILL!”, „”, „5”; golirea lui D4 readuce vărsarea (`2_dupa_golire_D4`).
   - Codul o spune singur: „ocupate = #VALUE! ca înainte (Excel real: #SPILL!, fără referință = de_verificat R10-3)” (`excel.js:313-315`).
   - Lecția m1-l07 învață că `#VALUE!` înseamnă „o celulă din formulă are un text cu litere”. Pe acest drum, eticheta l-ar duce pe elev la o cauză greșită.
   - Candidat clar pentru o rundă `acoperire` (de înghețat în referință).
2. **Vărsarea doar la aritmetică** (dovedit prin COM, `com_r10k.json`):
   - „=B2:B6” în F5: simulatorul dă F5 = 9, fără vărsare (`p2.json › e5_simplu_F5`); Excel varsă F5:F9 = 9, 7, 8, 10, 6, `HasSpill: true` (`3_F5_B2B6`);
   - „=B2:B6>8”: simulatorul dă `#VALUE!` (`e5_comp_H`); Excel varsă TRUE, FALSE, FALSE, TRUE, FALSE;
   - `=B2:B6&"a"`: Excel varsă „9a”…;
   - codul îl numește de_verificat R10-3 (`excel.js:334-338`). „=B2:B6*2” e corect: 18, 14, 16, 20, 12 (`e5_ori2` = COM `4_D2_ori2`).
3. **Tastele trec peste celulele vărsate ca peste celule goale** (dovedit prin COM, `com_r10k3.json`):
   - Ctrl+↓ din D2 → **D40**; Excel `D2.End(xlDown)` = **$D$6**;
   - Ctrl+↑ din D7 → **D2**; Excel `D7.End(xlUp)` = **$D$6**;
   - Ctrl+Shift+↓ din D2 → D2:D51; Excel → D2:D6;
   - Ctrl+A în D3 → **toată foaia**; Excel `D3.CurrentRegion` = **$D$2:$D$6** (`p6.json › 1_*`, `2_*`, `3_*`, `5_*`).
   - Cauza: `plin = … !!f.cel[…]` la `sari` (`excel.js:1278`) și la `zonaCurenta` (`excel.js:1595`) nu vede `varsat`. Din același motiv, un grafic inserat dintr-o celulă vărsată ar lua altă zonă.
4. **Ctrl+↓ / Ctrl+→ după ultimul bloc se opresc la marginea grilei desenate**, nu la marginea foii (dovedit prin COM, `com_r10k2.json`):
   - Ctrl+↓ din A7 → **A40**; Excel `A7.End(xlDown)` = **$A$1048576**;
   - Ctrl+→ din C4 → **Z4**; Excel `C7.End(xlToRight)` = **$XFD$7** (`p4.json › 3_ctrl_sageti`, `p5.json › ctrl_dreapta_C4`);
   - cauza: `max = { r: Math.max(ultim(f).r + 1, NR - 1), … }` (`excel.js:1279`);
   - lecția m1-l02 învață: „O foaie e uriașă: are 1.048.576 de rânduri și 16.384 de coloane… ultima coloană e XFD”. Nicio lecție a clasei a VIII-a nu cere Ctrl+săgeți (Grep), deci nu blochează un drum.
5. **Bara de formule pe o celulă vărsată** (D3 aleasă) e goală, iar F2 pe D3 deschide o editare goală (`p1.json › e5_2`, `e5_10`). În Excel, bara arată formula ancorei, estompată. E scris din memorie, nu dovedit.
6. **Rezumatul din bara de stare în afara referinței** (scris din memorie, nedovedit):
   - o celulă cu număr + una goală (C4:C5) → nimic, revine Display Settings (`a2_5`);
   - doar text (A1:C1) → „Count 3” (`a2_3`);
   - text + număr (A2:B2) → „Average 9 · Count 2 · Sum 9” (`a2_4`);
   - cu o eroare `#DIV/0!` → doar „Count 6” (`a2_9`);
   - media 23/3 scrisă „7,666666667” (`a2_2`);
   - **pe telefon**, rezumatul stă la x = 1152…1398 într-un ecran de 375 px, deci nu se vede fără derularea barei. **În fereastra mică**, Normal / Page Layout / zoom trec de x = 1093. Așezarea barei pe lățimea de 1364 e mai veche decât runda (`p5.json`).
7. **Graficul pe o grilă derulată** (rotița, apoi Insert) → mijlocul zonei vizibile (G20, `p1.json › a1_8`). În Excel, derularea invizibilă a fost refuzată (`com_r10_b.json › implicit_derulat_r20_c5`: ScrollRow 1), deci nu e dovedit.
8. **Tastele cu graficul ales** (scrise din memorie):
   - Ctrl+C / Ctrl+X lucrează pe celule (`{ctrl_x, decupare, tinta: celula:A1}`, furnicile apar), iar graficul rămâne (`p1.json › a1_5`). În Excel, ele copiază / decupează graficul;
   - Esc / Enter / săgeți / litere → `fara_efect`;
   - Backspace → `fara_efect`, și pe calculator (`p3.json › pc.3_backspace`);
   - Ctrl+Z după Delete readuce graficul neales (`a1_7`).
9. **Change Chart Type din taste** (Alt, J, C, C): Tab trece Recommended Charts → All Charts → OK; lista tipurilor din stânga și rândul subtipurilor nu primesc niciodată focusul, iar ↓ pe OK → `fara_efect` (`p4.json › 7_cct_taste`). Cu tastatura nu se poate alege Line sau Pie. Referința (`dialog.ChartChangeType`) dă elementele, nu ordinea Tab.
10. **Ctrl+Y** după ce Ctrl+Z a golit vărsarea readuce formula, dar celula activă devine B2, nu D2 (`p1.json › e5_6`). E scris din memorie.
11. **Decalajul −13,6 / −9,6 px** al regulii A1 se aplică pe `corp.clientWidth` / `clientHeight`. `corp` e doar zona celulelor, iar antetele sunt elemente separate (`excel.js:730-737`), pe când UsableWidth din COM pare să includă antetul rândurilor. Diferența e sub o celulă: la 1366×768, locul rămâne G5 în ambele socoteli.

## MINOR
- **Esc în modul tastelor de acces** emite `{gest: tasta_acces, actiune: iesire_taste_acces}` (`p7.json › 3_alt_n_c_esc`; `excel.js:3366`, `:3375`), iar §4 spune: „Esc în modul tastelor de acces: `tasta_esc`”.
  - Pentru §6.3 nu schimbă nimic, fiindcă ambele se numără greșeală. Doar jurnalul profesorului poartă alt nume de gest.
  - E mai vechi decât runda.
- **Enter pe Yes**, cu focusul chiar pe Yes, pune `activat: fereastra:Yes`, deși §4 spune „`activat` = … butonul pe care TASTA l-a apăsat fără ca butonul să fie ținta focusului” (`p1.json › e5_1`). E redundant, fără efect pentru asistent.
- **Clic în bara de formule, apoi tastare:** focusul rămâne în caseta grilei, iar ținta literelor e `celula:F2`, nu bara de formule (`p4.json › 5_fx_tastare`). Rezultatul e corect: F2 = „=C2*2” = 176, apoi F3; Esc renunță.
- **Pe telefon, rezumatul din bara de stare nu se vede** fără derulare (vezi [FARA_REFERINTA] 6).

## Ce a trecut (văzut în `stare()`, pe ecran și în evenimente)
- **E5 și A2** (secțiunea A), cu tastele, cu mouse-ul și cu tastele de acces ale ferestrei (Alt+Y, Alt+N).
- **Locul graficului** la 1366×768 (G5) și în fereastra mică, după regula din COM; mărimea 480 × 288; Alt, N, C, ↓, Enter inserează la fel ca mouse-ul, cu `tasta_enter / inserare_grafic / meniu:Clustered Column`.
- **Ținta tastelor cu graficul ales, pe calculator:** `grafic:1` (Delete, săgeți, Enter, Esc) și `grafic:1/titlu` (literele, Enter) (`p1.json › a1_4`, `a1_6`).
- **Grila, cu tastele:**
  - Tab, Tab, Enter → înapoi în coloana de plecare (B2 → C2 → D2 → B3); Shift+Tab, Shift+Enter;
  - Enter / Tab / Shift+Enter în interiorul zonei B2:C4 (B3, B4, C2, B3, B2, zona păstrată);
  - Ctrl+↓ / Ctrl+↑ / Ctrl+→ în bloc, Ctrl+Home, Ctrl+End, Ctrl+Shift+Home → A1:C7 cu celula activă C7 (`p4.json › 2_*`, `3_*`).
- **Tastarea:**
  - diacriticele de pe tastatura românească („Mădălina”) și prin insertText („Țară”), pe ecran și în bara de formule;
  - bara de formule cu Enter / Esc;
  - Ctrl+Shift+% → 8800 %; Ctrl+C / Ctrl+V; Esc stinge furnicile (`p4.json › 4_*`, `5_*`, `6_*`).
- **Tastele de acces:** Alt arată JC / JA cu graficul ales; Alt, J → JI, JC, JA; Alt, J, C → literele Chart Design; Alt, J, C, C → Change Chart Type; Esc o închide cu graficul încă ales, iar Delete îl șterge (`p4.json › 7_*`).
- **Ferestrele:**
  - Ctrl+S pe registrul nou → `dialog.save_this_file`, cu focusul în File name („Book1”); F12 → Save As („Book1.xlsx”); Esc le închide (`8_*`);
  - Sort: Esc cu focusul pe Then by → `camp:Then by` (MINOR-ul criticului 9, reparat).
- **Graficele:** Switch Row/Column, Change Chart Type › Line, Ctrl+Z, titlul, mutarea și mărirea pe calculator.
- **Regresul:** probele vechi au aceleași rezultate ca în runda 9; Word e identic.

GRAV_VECHI_DESCHISE: 2
GRAV: 3
