# Criticul rece, runda 9, etapa B (Excel, al patrulea val): cele 7 GRAV din runda 8 + unghiul ASPECT + regresul Word

**Cine:** critic rece, fără notele constructorilor. Din `runde/9/` am citit doar `gata_pentru_critic.md`; din `runde/8/` doar `critic.md` și ca model `critic_probe/h.py`, `p6.py`, `p7.py`, `p9.py`, `w8.py`. N-am deschis `diferente.md`, `de_verificat.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `regres*`, `acoperire_excel.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. Concluziile vin din gesturile și măsurătorile mele.

**Ce am rulat** (totul în `runde/9/critic_probe/`):
- Server static legat de `127.0.0.1`, port liber, pornit și oprit în fiecare script, servind worktree-ul. Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`h.py`, copiat din runda 8). Deschiderea: `LH.aplicatii.deschide('excel', {loc, continut, focus:true})` cu tabelele lecțiilor (Nume / Clasa / Punctaj din m2-l10; B2:B7 = 9, 7, 8, 10, 6, 8; CARTI și LUNI din m2-l11).
- Gesturi reale: `page.keyboard` (Enter, Tab, Esc, săgeți, Alt+↓, Alt, Alt+literă, Alt ținut + S, Alt+=, F12, Ctrl+S/W/N/Z, Delete, Backspace, End), `page.mouse` (clic, dublu clic, tragere pe grilă, pe grafic și pe mânerul lui, rotiță orizontală), `page.touchscreen.tap` la 375×667. Probele: `p1.py` … `p8.py`, `com_r9.py`, `w9.py`; ieșirile `*.json` / `*_rez.txt`; capturile `p2_*.png`, `p3_*.png`, `p4_*.png`, `p5_*.png` și decupajele `c_*.png`.
- După fiecare gest: `stare('excel')` (inclusiv `grafice`, `grafic_activ`, `grafic_element_ales`), textul celulei cu algoritmul O4 (`h.py › ecran`), modul din bara de stare, focusul, `window.__lhAplicatieEv`, mesajele `[data-lh-nesimulat]`, literele KeyTips, dreptunghiurile (`getBoundingClientRect` față de rădăcină; rădăcina = 0, 0, 1366×768).
- Referința citită doar cu Python, pe chei (`ref_dump.py` → `ref_lista_col.txt`, `ref_chart_ctx.txt`, `ref_insert.txt`, `ref_dialoguri.txt`). `dpi_factor` = 1.0, `fereastra` = [1366, 768]. Decalajul simulatorului față de referință, măsurat pe fila Home: +1, +1 (Home la 60, 50 față de 59, 49); pe panglică +2, +2.
- **Excel real, invizibil** (`com_r9.py` → `com_r9.json`): `DispatchEx`, `Visible=False`, `DisplayAlerts=False`, registru nou nesalvat (niciun fișier scris), build 16.0.20326. Graficul implicit (`Shapes.AddChart2(201, 51)`) pe tabelele CARTI și LUNI, apoi Pie, Line, `PlotBy` comutat. Excel a ieșit la `Quit` (`pid_ramas_dupa_quit: false`), deci fără oprire forțată și fără intrări noi de recuperare. Excel-ul omului nu l-am atins; PowerPoint nu.
- Regresul Word (`w9.py`): aceleași gesturi pe `aplicatii/` de la `30dbbe30` (`git archive` într-o copie din %TEMP%, ștearsă la final) și pe worktree. La fel `p8.py` pentru Ctrl+W în Excel.
- Probele vechi rulate: `runde/8/proba_grav.py`, `runde/7/proba_grav.py`, `proba_grav_cont.py`, `proba_grav_cont2.py`, `runde/6/proba_excel.py`, cu ieșirile în `critic_probe/reg_*.json/txt`.
- O greșeală de probă a mea: în `p2.py`, „clic pe D12 / D10 ca să las graficul neales” a nimerit chiar graficul (graficul acoperă D2:K15). Deselectarea am măsurat-o din nou în `p3.py` (clic pe A10).

**Diff-ul rundei** (`git diff 30dbbe30 -- aplicatii`: 2 fișiere, +436 / −5; ambii constructori comiși local, `c0eaf3e1` și `78a6cb20`):
- `aplicatii/excel.js` (acum ~3240 de rânduri):
  - K1: `focusNivel` (`excel.js:1602`) readuce focusul pe caseta echivalentă după redesenarea nivelurilor;
  - E1: `altSingur = false` când o literă e consumată de fereastră (`excel.js:3094`);
  - E2: Enter apasă controlul cu focus doar dacă e `Button` (`excel.js:2188`);
  - E3: după Σ cu zonă propusă, modul Point (`excel.js:1452`);
  - E4: `inchideDialog` trece celula în Edit după „We found a typo…” închisă fără Yes (`excel.js:2003`);
  - X10: secțiunea „graficele” (`excel.js` ~2326-2633): lista ▾ din referință, inserarea, filele contextuale, Change Chart Type, Switch Row/Column, titlul, mutarea, mărirea, Delete, `stare().grafice`, KeyTips cu lista deschisă.
- `aplicatii/aplicatii.css` (+20): doar regulile `.lh-ap-x-gr-*` și două reguli pe `lista.ChartTypeColumnInsertGallery` / `dialog.ChartChangeType`.

## A. Cele 7 GRAV din runda 8

### K1 (focusul după o alegere pe nivelul 2 din Sort): **ÎNCHIS**
- **Cu tastatura** (`p1.json`, aceleași gesturi ca proba criticului 8):
  - Sort by = Clasa, Alt+A, Then by (nivelul 1) = Punctaj → focusul rămâne `["ComboBox", "Then by", "1"]` (`k1_3_thenby`);
  - Order (nivelul 1) = Largest to Smallest → focusul `["ComboBox", "Order", "1"]` (`k1_4_order`);
  - Enter → `{gest: tasta_enter, actiune: sortare, tinta: camp:Order, activat: fereastra:OK}`, fereastra se închide, tabelul e sortat: Elena 95, Ana 88, Carmen 60, Bogdan 95, Dan 78, Florin 60 (`k1_5_enter`).
- **Cu mouse-ul:** Then by ales cu clic → focusul pe `Then by`, nivelul 1 (`k1m_1`); Order ales → Enter sortează la fel, cu `activat: fereastra:OK` (`k1m_3_enter`).
- **Trei niveluri:** alegere pe nivelul 2, apoi Esc → `tasta_esc / anulare`, fereastra închisă, tabelul nesortat (`k1x_4_esc`). Înainte, aici nu venea niciun eveniment.
- Drumul m2-l10:63 („Add Level… Then by… Largest to Smallest… OK”) merge acum cu tastatura și cu mouse-ul.

### X10 (graficele, m2-l11): **DESCHIS** (reparat în mare parte)
- **Reparat** (`p2.json`, `p3.json`, `p5.json`):
  - Insert › Insert Column or Bar Chart ▾ deschide lista din referință: 4 grupuri (2-D Column, 3-D Column, 2-D Bar, 3-D Bar), 17 rânduri, More Column Charts...; dreptunghiul [597, 110, 227,2, 416] față de `lista.ChartTypeColumnInsertGallery` [596, 106,4, 227,2, 416]; rândurile 56×56 la aceleași poziții, cu decalajul panglicii (`p2.json › lista`).
  - Clustered Column → `inserare_grafic`; graficul are 480×288 px. Referința: `panglica_context.Ctx_Format › Shape Width „12,7 cm”`, `Shape Height „7,62 cm”` (= 480×288 px la 100%); Excel real: `w_pt 360, h_pt 216` (`com_r9.json › carti`).
  - Filele după Help: Chart Design (aleasă), Format, ca `acoperire_r7.fapte.h_grafic.file_dupa`. Name Box = „Chart 1”, ca `com_r9.json › carti.nume`.
  - Chart Design: grupurile Chart Layouts / Chart Styles / Data / Type / Location la locurile din `panglica_context.Ctx_ChartDesign`, cu decalajul +2, +2 (`p2.json › ctx_design`).
  - Change Chart Type: fereastra [360, 85, 648, 607] față de [359, 84, 648, 607]; deschisă pe All Charts, lista din stânga cu 19 tipuri, rândul de 7 subtipuri Column, OK / Cancel la 835 / 919, 653 față de 833 / 917, 651 (`p2.json › cct`). Pie, Line, Column cu OK sau Enter → `stare().grafice[0].tip` se schimbă, iar ecranul desenează felii / linie / bare (`pie_gr`, `line_gr`).
  - Switch Row/Column pe LUNI: seriile devin lunile, jos 8A și 8B (`switch_st`), ca în Excel real (`com_r9.json › luni_switch`: serii septembrie…decembrie, categorii 8A, 8B).
  - Titlul: un clic, „Cărți” + Enter → titlul „Cărți” pe ecran și în stare (`titlu_gr`, `titlu_st`). Mutarea (+100, +60) și mărirea din colțul dreapta-jos (+60, +40) se văd și în `pozitie` (`mutare`, `marire`). B4 = 20 → bara crește (`legat`). Delete șterge graficul și filele contextuale, iar Ctrl+Z îl readuce (`delete`, `ctrlz`).
  - KeyTips: Alt arată JC și JA pe cele două file (`kt_alt`); Alt, J, C, C deschide Change Chart Type. Referința: `Ctx_ChartDesign` „Alt, J C”, `Change Chart Type...` „Alt, J C, C”.
- **Rămâne:** două comenzi de pe drumul lecției m2-l11 dau doar mesajul central:
  - Insert › Insert Line or Area Chart ▾ → `{actiune: nesimulat}`, „În aplicația reală, „Insert Line or Area Chart” funcționează; aici nu e simulată.” (`p2.json › ins_line`);
  - Chart Design › Add Chart Element → „În aplicația reală, „Add Chart Element” funcționează; aici nu e simulată.” (`add_elem`). Deci Data Labels nu se pot pune, iar `stare().grafice` nu are nicio cheie pentru etichete.
- **De ce lecția nu se poate duce la capăt:** atelierul lecției (exercițiu în foaie, nu pe PC) cere „5. Pornește etichetele de date”, cu testul `{ce:'Etichetele de date arată sumele', grafic:{etichete:true}}` (`lectii/viii/m2-l11/index.html:251`). Ajutorul lui: „Inserare (Insert) › butonul cu linie ▾ › Line … Etichetele: Add Chart Element › Data Labels › Right” (`:252`). Exercițiile de la `:226` și `:234` au și ele etichete (`et:'ext'`). Linia se poate obține ocolit (Change Chart Type › Line), dar etichetele, deloc.
- **Argumentul constructorului nu ține:**
  - R12 cere mesajul central pentru „o comandă afișată și nesimulată”;
  - `api_biblioteca.md` §3 adaugă: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate”, iar O8 le numără MOARTE;
  - R4 (a): „o suprafață fără referință contează ca diferență, nu ca 0”. Lipsa listei din referință cere o rundă `acoperire` (lista `ChartTypeLineInsertGallery` și submeniul Add Chart Element › Data Labels), nu închide pasul.
- Ce e desenat se potrivește cu referința acolo unde referința există (mai sus). Diferențele de desen (axa, galeria Quick Styles, previzualizarea din Change Chart Type) sunt la MINOR și [FARA_REFERINTA]; locul la inserare e la GRAV A1.

### E1 (Alt+literă care închide fereastra → KeyTips): **ÎNCHIS**
- Save As: F12, „Lucrare”, Alt+S → un singur eveniment, `{tasta_acces, salvare, dialog_salvare:Save}`, `nume_fisier: Lucrare.xlsx`, fără litere KeyTips (`p1b.json › dupa_alt_s`). „ab” → `scriere`, `celula:E2` (`dupa_ab`); „abc” → E2 = „abc”, în editare (`p1.json › e1_2_abc`).
- Alt ținut + S, apoi eliberat: la fel (`e1_7`, `e1_8`: E3 = „x”).
- Sort Warning + Alt+S: sortează, fără KeyTips; „7” → C2 = „7”, în editare (`e1_3`, `e1_4`). Mesajul fals „Undo … nu e simulată” nu mai apare.
- Mecanismul vechi merge: Alt singur → literele 1, 2, 3, Q, F, H, N, JI… (`e1_5`); Alt, H, 1 → A1 aldin (`e1_6`).

### E2 (Enter pe casetă de bifat / buton radio): **ÎNCHIS**
- Sort, Sort by = Nume, Alt+H (My data has headers debifat; Sort by devine „Column A”), Enter → `{gest: tasta_enter, actiune: sortare, tinta: fereastra:My data has headers, activat: fereastra:OK}`. Fereastra se închide și se sortează fără antet: A = Ana, Bogdan, Carmen, Dan, Elena, Florin, Nume (`p1.json › e2_3_enter`). Space comută în continuare caseta (`e2_5_space_bifa: "true"`).
- Sort Warning, Alt+C (focus pe butonul radio), Enter → `activat: fereastra:Sort...`. Se sortează doar coloana C (95, 95, 88, 78, 60, 60), iar A rămâne Ana, Bogdan… (`e2_7`). Regula din §4 („ENTER → IDOK or … default push button”) e respectată.

### E3 (Point după Σ): **ÎNCHIS**
- B8 sub B2:B7, Σ → „=SUM(B2:B7)” în editare, bara de stare **„Point”** (`p1.json › e3_1_sigma`); ▾ › Average → „Point” (`e3_4`), Enter → 8 (`e3_5`); Alt+= → „Point”, Enter → 48 (`e3_6`, `e3_7`). Referința: `acoperire_r7.fapte.c_autosum.mod_dupa_sigma / mod_dupa_average: "Cell Mode Point"`.
- ↓ după Σ nu mai primește formula: celula rămâne în editare, cu „=SUM(B9)”, în Point (`e3_2_jos`). Ce scrie exact săgeata nu e în referință ([FARA_REFERINTA] 2).

### E4 (typo → No / Esc → Edit): **ÎNCHIS**
- „=SUM(B2:B7)B2:B6” + Enter → fereastra, cu focusul pe Yes. No → bara „Edit” (`p1.json › e4_1_no`); ← → `mutare_cursor`, fără fereastră (`e4_2`).
- Cursorul chiar se mută: ← de 5 ori, „*” → „=SUM(B2:B7)*B2:B6” (`p6.json › dupa_stele`). Corectura cu End + 5 × Backspace + Enter → D2 = 48 (`e4_3`, `e4_4`).
- Esc pe fereastră → „Edit”, ← mută cursorul, al doilea Esc golește celula (`e4_5`–`e4_7`). Referința: `e_sum_lipit.mod_dupa_inchidere: "Cell Mode Edit"`.

### E5 (Yes în „We found a typo…” → vărsare): **DESCHIS**
- Neatinsă în rundă. Yes (Enter) → D2 = **`#VALUE!`**, D3:D6 goale (`p1.json › e5_yes`; la fel `p6.json › D2` după corectura manuală spre aceeași formulă).
- Excel real, același build: D2:D6 = 432, 336, 384, 480, 288, `HasSpill: true` (`runde/8/critic_probe/com_r8.json`).

### Regresul celor închise înainte (X1-X9, K2-K6)
- `runde/8/proba_grav.py`: **0** picate. `runde/6/proba_excel.py`: 20 de cazuri, **0** picate. `runde/7/proba_grav_cont.py`: **0** (`reg_*.txt`).
- `runde/7/proba_grav.py`: **2 picate**, ambele la X6, ambele cerute de o probă mai veche decât referința:
  - „formula respinsă (=SUM(B2:B4)B2) → mesaj vizibil”: acum apare fereastra „We found a typo…”, cum cere `e_sum_lipit`;
  - „Esc iese din editare”: după fereastră, Esc trece în Edit (`mod_dupa_inchidere: "Cell Mode Edit"`), iar al doilea Esc iese (`p1.json › e4_7`). Comportamentul e cel din referință.
- `runde/7/proba_grav_cont2.py`: **3 picate**, la X8:
  - proba cere mesajul central la Ctrl+W pe un registru modificat; referința (`b_ctrl_w_modificat`) cere fereastra „Save your changes…”, care apare;
  - celelalte două rânduri pică pentru că fereastra a rămas deschisă.
  - `p8.py`: Ctrl+W pe registrul de pornire dă aceeași fereastră la `30dbbe30` și acum, deci nu e regres.
- K6 rămâne bun: Alt, Alt+H+1, Alt+= (`p1.json › e1_5`, `e1_6`, `e3_6`). Erori în pagină: 0 în toate probele.

## B. Unghiul aspect (Excel): constatări noi

### GRAV A1: graficul nou nu apare unde îl pune Excel; pe telefon cade în întregime în afara ecranului, iar în fereastra mică i se taie partea de jos
- **Simulatorul** îl pune lângă tabel, sărind o coloană, pe rândul 2: `const x = xCol(q.c1 + 2) / z(), y = yRand(q.r0 + 1) / z();` (`excel.js:2485`; comentariul spune „locul și mărimea exacte = de_verificat R9-4”). La CARTI (A1:B6), graficul e la D2 (`stare().grafice[0].pozitie {x:192, y:19}`).
- **Excel real** (`com_r9.json › carti`, același build): graficul implicit stă **în mijlocul ferestrei vizibile**:
  - `left_pt 378, top_pt 155,7`, `TopLeftCell $H$11`;
  - fereastra are `UsableWidth 1152, UsableHeight 565,8`, `VisibleRange $A$1:$X$37`;
  - la LUNI și la A1 singură, același loc.
  - Rezerva: e `Shapes.AddChart2` prin COM, nu clicul pe galerie; Excel așază la fel graficul nou, dar gestul însuși nu l-am putut juca invizibil.
  - Lecția însăși se pregătește pentru asta: laboratorul m2-l11 spune „Dacă graficul acoperă tabelul, trage-l de marginea lui albă spre dreapta”. Pe simulator, graficul nu acoperă niciodată tabelul.
- **Telefon 375×667, cu atingeri** (`p5.json › tel`):
  - lista ▾ încape ([147, 146, 227, 416], niciun rând în afara ecranului);
  - după Clustered Column, graficul e la **[372, 349, 816, 490]**: începe la marginea dreaptă a unui ecran de 375 px și e de 2,2 ori mai lat decât ecranul.
  - Pe ecran se văd doar Name Box = „Chart 1” și fila Chart Design (`p5_tel_grafic.png`, `c_tel_grafic.png`). Graficul, cerculețele și titlul nu se văd.
- **Fereastra mică 1093×526** (1366×657 la 125%): graficul e la [219, 261, 480, 288] și se termină la y = 549, adică 23 px sub ecran. Se taie legenda și numele de jos (`p5.json › mica.grafic`).
- **De ce e GRAV:**
  - Contractul I1: „biblioteca merge la 360-390 px și la 1366×657 cu zoom 125%”.
  - Lecția: „Graficul apare lângă tabel, ales: are cerculețe pe margini” (`m2-l11/index.html:136`). Pe telefon, elevul atinge Clustered Column și nu vede nimic apărând. Dacă atinge din nou, cu graficul ales, nu mai face niciun grafic: îi schimbă doar tipul (`insereazaGrafic`, ramura `schimbare_tip_grafic`).
  - Pe PC, graficul îi apare în mijlocul ecranului și poate acoperi tabelul. Pe simulator, n-a văzut niciodată asta.

### GRAV A2: bara de stare nu arată Average / Count / Sum pentru numerele alese; rămâne „Display Settings”
- **Gestul** (`p4.json`): B2:C4 = 9, 7 / 8, 10 / 6, 5 (exact datele referinței), aleasă cu Shift+săgeți (`a_sel: B2:C4`). Bara: Ready · Macro Recording · Accessibility: Good to go · **Display Settings** · Normal · Page Layout · Page Break Preview · zoom (`a_bara`; captura `p4_bara.png`). Aceleași elemente ca fără selecție (`p3.json › bara`).
- **Referința** `bara_stare#selectie_numere` („B2:C4 aleasă … numerele 9, 7 / 8, 10 / 6, 5”):
  - `Button "Average 7,5" [859.2, 746.4, 74.4, 20.8]`, `Button "Count 6" [933.6, …]`, `Button "Sum 45" [988.8, …]`;
  - butonul Display Settings nu mai apare (el e doar în `bara_stare`, fără selecție, la [925, 746]).
- **Codul:** `excel.js` nu are nicio ramură pentru rezumatul selecției (Grep „Average ” / „Count ” / „selectie_numere”: doar `SIGMA_FN`, `excel.js:1429`). Lipsa e mai veche decât runda, dar referința există și e înghețată.
- **De ce e GRAV:**
  - Contractul definește „fidel = aceleași elemente vizibile, în aceeași ordine și în același loc, cu aceleași etichete” (glosar; R4).
  - Pe PC, elevul care alege numerele vede jos suma și media, cu virgulă zecimală („7,5”). Pe simulator vede un buton care nu există în acea stare.
  - Nicio lecție a clasei a VIII-a pe care am căutat-o nu se sprijină pe asta (Grep în m1-l02 … m2-l13), deci nu blochează o lecție. E însă o diferență de ecran dovedită cu referința, pe suprafața cerută de unghi.

## C. Regresul Word: **NU strică**
`w9.py`, aceleași gesturi pe `aplicatii/` de la `30dbbe30` și pe worktree, la 1366×768, plus compunerea „Ană” prin CDP la 375×667:
- deschidere;
- „Mădălina are 5 mere” + Enter;
- Alt; Alt, H, 1;
- F12 + „Tema_mea” + Enter;
- „x” + Ctrl+W („Save your changes to this file?”), Esc;
- lista Font Size;
- Ctrl+F12;
- Ctrl+Z de două ori.

Rezultatul:
- 12 din 13 capturi sunt identice pixel cu pixel. Singura diferență („10_ctrl_z2”) e dreptunghiul de 1×18 px de la x = 496: cursorul care clipește, ca în rundele 7 și 8. Ambele capturi de telefon sunt identice.
- Dreptunghiurile tuturor `[data-lh-tip]` sunt identice (136 / 235 / 153 / 157 / 215 noduri).
- `stare('word')` e identică: text, „Tema_mea.docx”, `dialog`, formatarea. Lista evenimentelor e identică. Erori în pagină: 0.
- CSS-ul nou e legat numai de `.lh-ap-x-gr-*`, `.lh-ap-x-meniu[data-lh-suprafata="lista.ChartTypeColumnInsertGallery"]` și `[data-lh-suprafata="dialog.ChartChangeType"]`.
- Copia din %TEMP% a fost ștearsă.

## [FARA_REFERINTA] (nu le număr GRAV)
1. **Locul graficului la inserare.** Referința nu-l dă (`h_grafic` n-are dreptunghi). L-am dovedit prin COM (vezi GRAV A1). Restul desenului e pe referință sau pe COM: mărimea (Ctx_Format), titlul din antet și legenda (COM).
2. **Ce scrie săgeata după Σ:** ↓ → „=SUM(B9)” (`p1.json › e3_2`). Referința dă doar modul Point.
3. **Change Chart Type, Pie și Line:** fără rândul de subtipuri și cu o singură previzualizare mică, desenată ca pictogramă (`p2_cct_pie.png`). Referința are rândul doar pentru Column și două previzualizări de 225×138 (`dialog.ChartChangeType`). Rândul Bar e luat din lista ▾ (`GR_SUB_BAR`), deci din altă suprafață a referinței.
4. **Pictogramele graficelor:**
   - butoanele mari din Chart Design (Add Chart Element, Quick Layout, Change Colors, Switch Row/Column, Select Data, Change Chart Type, Move Chart) n-au pictogramă, doar text (`c_ribbon_design.png`);
   - în Insert › Charts, Insert Line / Pie / Hierarchy… au un pătrat gol (`p2_lista.png`);
   - lecția descrie butoanele după desen („butonul cu o linie mică și săgeata ▾”). UIA nu dă pictograme, iar contractul (I7) cere icoanele Fluent.
5. **Dublu clic pe titlu** = același lucru ca un clic: titlul ales, nu cursor în text (`p2.json › dublu_titlu_ev`, `dublu_titlu_X`). Lecția (pasul cu titlul) spune: „Dacă ai dat două clicuri, în titlu clipește cursorul și ce scrii se adaugă la titlul vechi”.
6. **După deselectare**, panglica trece pe Home (`p3.json › a_neales`), deși înainte de inserare fila aleasă era Insert. Nu e în referință.
7. **Galeria Insert cu un grafic ales** îi schimbă tipul, nu face un grafic nou (`insereazaGrafic`). Scris din memorie.
8. **KeyTips de grup** (ZL, ZS, ZD, ZT, ZO) arătate pe Chart Design la lățime întreagă (`p2.json › kt_jc`). Referința nu capturează KeyTips afișate.
9. **Esc, Enter sau o literă cu graficul ales** (nu titlul) → `fara_efect` (`tastaGrafic`, `excel.js:2614`). Necapturat.
10. **Alt, N, C, apoi ↓** alege Clustered Column, primul rând (`kt_nc_enter`). Focusul inițial în galerie nu e în referință.

## MINOR
- **Axa valorilor diferă de Excel** (dovedit prin COM, `com_r9.json`):
  - CARTI: Excel 0–10 din 1 în 1, simulatorul 0–10 din 2 în 2;
  - după B4 = 20: Excel 0–25, simulatorul 0–20, cu bara lipită de linia de sus;
  - LUNI: Excel 0–30, simulatorul 0–25.
  - Cauza: `scaraGrafic` (`excel.js:2363`) nu lasă loc deasupra maximului. Lecția nu citește axa.
- **Galeria Quick Styles:**
  - un pătrat gol cu ▾ se vede între Style 4 și Style 5: e `span.lh-ap-gol` al rândului fără etichetă `ChartStylesGallery`, desenat sub rândurile transparente (`p4.json › b_punct`; `c_ribbon_design.png`);
  - Style 1 nu e marcat ca ales (`b_style1: aria-selected null`), deși `h_grafic.fila_aleasa` conține „Style 1”.
- **More Column Charts...** are un ▾ după text, ca un submeniu (`p2_lista.png`). Referința: un `MenuItem` simplu.
- **Change Chart Type nu încape în fereastra mică (1093×526) și pe telefon:**
  - OK la y = 569 în fereastra mică și la x = 476 pe telefon, ambele în afara ecranului (`p5.json › cct`);
  - stratul ferestrei se derulează (`overflow: auto`), iar OK se poate apăsa după derulare (`dupa_ok: Pie`); la fel ca Sort pe telefon;
  - Enter merge oricum.
- **Ținta tastelor cu graficul ales** e celula activă:
  - Delete pe grafic → `tinta: celula:B5`;
  - Enter pe titlu → `tinta: celula:A1`;
  - §4: „la taste: ținta focusului”. `actiune` e corectă (`stergere_grafic`, `titlu_grafic`), deci asistentul recunoaște pasul doar prin `asteapta`.
- **Change Chart Type:**
  - a doua previzualizare din referință e ascunsă (`excel.js:2548`);
  - după Pie, un subtip ascuns rămâne `aria-selected="true"` (`p2.json › cct_pie_ales`);
  - „Size box” e desenat ca un bloc gri închis (`p2_cct_pie.png`).
- **Esc în Sort cu focusul pe Then by** (nivelul 2) → `tinta: camp:Sort by` (`p1.json › k1x_4_esc`).

## Ce a trecut (văzut în `stare()`, pe ecran și în evenimente)
- **K1, E1, E2, E3, E4** (secțiunea A), cu tastatura și cu mouse-ul.
- **Lista ▾ Insert Column or Bar Chart:** dreptunghiul, ordinea, titlurile grupurilor, cele 17 rânduri și More Column Charts... la locurile din referință; încape și pe telefon și în fereastra mică.
- **Graficul**, verificat pe referință și pe Excel real:
  - mărimea 480×288 (Ctx_Format 12,7 × 7,62 cm; COM 360 × 216 pt);
  - titlul pus din antet la o serie („Cărți citite”, COM) și „Chart Title” la două serii (COM);
  - fără legendă la o serie, legenda jos la două serii (`legenda_pozitie -4107` = jos, COM);
  - seriile pe coloane la LUNI (COM), Switch Row/Column (COM);
  - barele proporționale cu valorile (22 px pe unitate la CARTI) și legate de tabel;
  - Pie cu legenda pe categorii;
  - Name Box „Chart 1”, cerculețele (8), chenarul.
- **Ecranul = starea pe grafice:** titlul, tipul, legenda, valorile barelor și poziția după mutare / mărire sunt aceleași pe ecran și în `stare().grafice` (`p2.json`).
- **Filele contextuale:** Chart Design și Format după Help, cu grupurile la locul din referință. Apar la alegere și dispar la clic pe o celulă (`p3.json › a_neales`). KeyTips JC / JA și „Alt, J C, C”.
- **Change Chart Type** la 1366×768: dreptunghiul, filele, lista din stânga, rândul Column, OK / Cancel, Enter = OK (`activat: fereastra:OK`).
- **Ferestrele rundelor 7-9 la 1366×768** (`p3.json`), toate la 1-3 px de `rect_css`, cu butoanele în ordinea din referință:
  - Sort [634, 359, 600, 275]; Sort Warning, cu x tras înapoi pe ecran (referința are x = −27);
  - „We found a typo…” [497, 265, 375, 247], focusul pe Yes;
  - „There's a problem with this formula” [497, 225, 375, 327];
  - Save this file și Save your changes [455, 229, 460, 319];
  - lista ▾ Σ [1051, 110, 150, 178].
- **Bara de stare:** Ready / Enter / Edit / Point corecte la Σ, Average, Alt+=, typo; elementele fără selecție la locul din `bara_stare`.
- **Word:** fără regres (secțiunea C).

GRAV_VECHI_DESCHISE: 2
GRAV: 4
