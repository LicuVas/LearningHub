# Criticul rece, runda 17 (B-excel#2): cele 3 GRAV din runda 10 + unghiul STARE_FINALA_ERORI + regresul

**Cine:** critic rece al benzii Excel. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/17/critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md`, `runde/supliment_B_excel_runda17.md`, `runde/10/critic.md`, `runde/14/acoperire_excel.md` (§1-§4) și `api_biblioteca.md` §4-§6. Ce spune constructorul l-am verificat cu gesturile mele; n-am folosit probele lui (`proba_grav.py`, `proba/h17.py`).

**Ce am rulat** (totul în `runde/17/critic_probe/`):
- Ham `hc.py` (copiat din `runde/10/critic_probe/h.py`): server static legat de `127.0.0.1`, port liber, pornit și oprit în fiecare script; Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost. Deschiderea: `LH.aplicatii.deschide('excel', {continut, focus:true})`, cu tabelele lecției m2-l11 (atelierul A1:D5, LUNI A1:C5, CARTI A1:B6).
- Gesturi reale: `page.mouse` (clic, tragere pe grilă și pe grafic), `page.keyboard` (Alt, litere, săgeți, Ctrl+săgeți, Ctrl+Z/Y/A/Home, Delete, Backspace, Esc, Enter), `page.touchscreen.tap` și tragerea cu degetul prin CDP (`Input.dispatchTouchEvent`) la 375×667; tastatura telefonului prin `Input.insertText` și compunerea IME prin `Input.imeSetComposition` („ă”, „ț”).
- Probele: `p1.py` (X10 cu mouse-ul și cu tastele, Clustered Column, laboratorul m2-l11), `p2.py` / `p2b.py` / `p2c.py` (telefon: A1 și T1; `p2.py` are și calculatorul, ca martor), `p3.py` (unghiul, 7 greșeli), `p5.py` (degetul pe grilă, Ctrl+săgeți, vărsarea reluată, fereastra mică), `p6.py` (ieșirea din blocaj, regresul pe telefon). Ieșirile: `p*.json`, rezumatele `p*_rez*.txt`, capturile `p*.png`.
- „Înainte de rundă”: în `p5.py`, `excel.js` și `date/excel.json` din `runde/17/inainte/` servite prin `ctx.route(...).fulfill`, fără să ating fișierele.
- Referința am citit-o doar cu Python, pe chei: `ref_dump.py` / `ref_dump2.py` → `ref_liste.txt` (cele 4 liste noi din `uia_excel.json` › `suprafete`, plus `acoperire_r14.fapte` `x_line`, `y_data_labels_line`, `z_data_labels_coloana`).
- O4 rulat direct pe `scenarii/excel` cu `LH_IESIRE=critic_probe/iesiri` (`o4_excel.log`): **57/64**, cele 11 scenarii ale acoperirii 14 trec toate; rămân aceleași 7 scenarii vechi (autocompletare-tab, autofit, numere-afisare, separator-virgula, sortare-doua-niveluri, tragere ×2), cum spune constructorul.
- Fără Excel real, fără ecranul utilizatorului, fără git care scrie, fără `masoara.py` / `porti.py`. Erori în pagină: 0 în toate probele.
- Greșeli de probă ale mele, refăcute: în `p2.py`, pe telefon, am atins titlul când era în afara ecranului (graficul tras spre dreapta), deci rezultatele `6_*`, `7_ast` pe telefon sunt nule (refăcute în `p2c.py`); în `p3.py › b4`, două clicuri pe D5 la ~0,4 s au fost un dublu clic (editare), deci `6_golire_D5`, `7_ctrl_jos_D2`, `8_ctrl_a_D3` sunt nule (refăcute în `p5.py › S`, cu pauze).

## A. Cele 3 GRAV din runda 10

### X10 (graficele, m2-l11: Insert Line or Area Chart, Add Chart Element › Data Labels): **ÎNCHIS**
- **Galeria Line** (atelierul, A1:D5 tras cu mouse-ul; Insert › Insert Line or Area Chart ▾; `p1.json › mouse_line.1_lista`), față de `uia_excel.json › lista.ChartTypeLineInsertGallery`, rând cu rând:
  - grupurile 2-D Line, 3-D Line, 2-D Area, 3-D Area și grupul fără nume, în ordinea referinței;
  - rândurile: Line, Stacked Line, 100% Stacked Line, Line with Markers, Stacked Line with Markers, 100% Stacked Line with Markers · 3-D Line · Area, Stacked Area, 100% Stacked Area · 3-D Area, 3-D Stacked Area, 3-D 100% Stacked Area · More Line Charts... — aceleași nume, aceeași ordine, aceeași așezare (5 pe rând, 56×56);
  - tasta de acces: doar More Line Charts... are „Alt, N, N 1, M”, ca în referință (rândurile galeriei n-au, nici în referință);
  - evenimentul: `{meniu_derulant, meniu_derulant, meniu_derulant:Insert/Charts/Insert Line or Area Chart}`.
- **Line** → `tip_grafic: Line`, `serii_grafic: [miercuri, joi, vineri]`, `categorii_grafic: [8A, 8B, 8C, 8D]`, `etichete_date` toate `null`, titlul „Chart Title”, filele Chart Design (aleasă) + Format (`2_graf`, `2_file`). Referința `acoperire_r14.fapte.x_line`: ChartType Line, seriile miercuri/joi/vineri, categoriile 8A…8D, fără etichete. La fel.
- **Add Chart Element ▾** (`3_lista`) față de `lista.AddChartElementMenu`: Axes, Axis Titles, Chart Title, Data Labels, Data Table, Error Bars, Gridlines, Legend, Lines, Trendline, Up/Down Bars; tastele Alt, J C, A, X / A / C / D / B / E / G / L / T; Lines și Up/Down Bars fără tastă și gri (`aria-disabled`). Ca în referință.
- **Data Labels ▸ la Line** (`4_sub`) față de `…#Data Labels`: None, Center, Left, Right, Above, Below, Data Callout + More Data Label Options...; tastele ALT+N, C, L, R, A, w, u și „Alt, J C, A, D, M”. Ca în referință.
- **Data Labels ▸ la Clustered Column** (CARTI, `coloane.2_sub_col`) față de `…#Data Labels#Clustered Column`: None, Center, Inside End, Inside Base, Outside End, Data Callout + More...; tastele N, C, E, B, O, u. Lista Line nu apare la coloane (`2_sub_line: null`). Ca în referință.
- **Starea finală față de scenariile reale:**
  - Right → `etichete_date` {miercuri, joi, vineri: Right}, iar pe ecran 12 etichete SVG cu valorile tabelului (45, 50, 38, 55 / 60, 42, 66, 48 / 90, 80, 72, 70) (`5_graf`, `5_desen`); referința `y_data_labels_line`: Right pe toate cele 3 serii;
  - Outside End pe coloane → {Cărți citite: Outside End}, etichetele 6, 4, 9, 3, 7 (`coloane.3_*`); referința `z_data_labels_coloana`: Outside End.
  - Ctrl+Z scoate etichetele (stare și ecran), Ctrl+Y le pune la loc (`6_ctrlz`, `7_ctrly`).
- **Tastele** (`taste_line.pasi`): A1, Shift+→ ×3, Shift+↓ ×4 → A1:D5; Alt (`arata_taste_acces`), N (`fila:Insert`), N (`prefix_tasta_acces`, se văd NS, N1), 1 (lista deschisă, se vede doar „M”), ↓ (Line aleasă), Enter (`inserare_grafic`, `activat: meniu:Line`) → Line; apoi Alt, J (prefix: JI, JC, JA), C (`fila:Chart Design`), A (lista), D (submeniul, cu literele N C L R A W U M), R (`etichete_date`, `tinta: meniu:Right`) → Right pe toate seriile. Câte un eveniment pe fiecare tastă. La coloane, Alt, J, C, A, D, O → Outside End (`coloane.5_taste_O`).
- **Laboratorul m2-l11 pe calculator** (LUNI; `laborator`, `p3.json › b6`): A1:C5 tras → Line, seriile 8A, 8B, categoriile lunile; Right (8 etichete); tragerea de margine → `tragere / mutare_grafic`, graficul de la x 415 la 715; sub C5 e celula; C5 = 30 → pe ecran „30”, iar eticheta 8B din decembrie arată 30; Chart Design › Change Chart Type... › Column › OK → Clustered Column, titlul și etichetele rămân; înapoi Line, la fel (pasul 69 al lecției). În `p1.py` pasul 69 a picat din vina mea (am căutat butonul „Change Chart Type”, eticheta reală e „Change Chart Type...”); reluat în `p3.py › b6` cu `data-lh-id-mso="ChartChangeType"`.
- Ce nu se vede din referință (tastele în galerie după Alt, N, N 1; etichetele după Change Chart Type) e la [FARA_REFERINTA] 3 și 4.

### A1 (graficul nou pe telefon acoperă tabelul fără ieșire): **ÎNCHIS** (pe drumul m2-l11)
- **Telefon 375×667, atingeri** (`p2b.json`, `p2b_1_tras_la_margine.png`):
  - graficul nou stă tot la `pozitie` 0, 0 și acoperă C5 (`1_inserat`), cum alege constructorul (locul din Excel pe o zonă mică, `com_r10_c.json`, verificat de criticul 10);
  - **tragerea de margine cu degetul merge până la capăt:** din x = 65 până la marginea ecranului (368) → graficul trece de la x 45 la x 348 pe ecran (`pozitie.x` 0 → 178), cu un eveniment `{tragere, mutare_grafic, grafic:1}`; pointerii: `pointerdown`, 16 × `pointermove`, `pointerup`, fără `pointercancel` (`p2.json › tel.2_tragere`);
  - după tragere, sub centrul lui C5 e celula; atingere + „30” (tastatura telefonului) + Enter → C5 = 30, pe ecran „30”, cu evenimentele `selectare_celula` / `scriere` pe `celula:C5` (`3_C5`, `p2c.json › 1_dupa_C5`);
  - Chart Design › Add Chart Element › Data Labels › Right se fac din atingeri și pun Right pe ambele serii, cu 8 etichete (`p2.json › tel.3_right`); eticheta „30” după C5 am văzut-o pe calculator (`p1.json › laborator.4_desen`), nu și pe telefon (la `p2.py` C5 era încă acoperită de tragerea mea prea scurtă);
  - listele Insert Line și Add Chart Element › Data Labels încap în 375 px și rândurile se ating (`p2.json › tel.1_lista_in_ecran`, `3_sub`, `3_sub_right`).
- Ce rămâne, fără să blocheze drumul: după o singură tragere până la marginea ecranului, cifrele din coloana C (aliniate la dreapta) stau încă sub marginea graficului (MINOR 4); ștergerea graficului fără tasta Delete ([FARA_REFERINTA] 1). Pe telefon, un grafic greșit se scoate cu Undo din bara de acces rapid (3 atingeri: etichetele, mutarea, inserarea; `p2.json › tel.8_undo_atingeri`).

### T1 (pe telefon, literele din titlul graficului aveau ținta `celula:A1`): **ÎNCHIS**
- **Gestul** (`p2c.json`): după laboratorul de pe telefon, adus titlul în ecran cu săgeata barei de derulare (2 atingeri, `derulare:Line right`), atins titlul → `{clic, alegere_titlu_grafic, grafic:1/titlu}`.
- Literele „C” (insertText), „ă” (compus IME), „r”, „ț” (compus), „i” → câte UN eveniment pe literă, `{tastare, scriere, grafic:1/titlu}`; bara de formule „Cărți”; Enter → `{tasta_enter, titlu_grafic, grafic:1/titlu}`, titlul desenat „Cărți” (`5_*`, `6_enter`).
- Cu graficul ales, „7” → `{tastare, fara_efect, grafic:1}` (`p2b.json › 8_grafic_7`); Backspace pe titlul în lucru → `{tasta_backspace, stergere_inapoi, grafic:1/titlu}` (`9_backspace_titlu`).
- **Paritatea:** cu asistentul criticului 10 (pasul 2 cu `asteapta: actiune === 'titlu_grafic'`), indiciul apare după a doua literă și pe telefon (`p2c.json › 5_ă`), și pe calculator (`p2.json › pc.6_a`); Enter face pasul în ambele. Diferența telefon ≠ calculator, care era GRAV-ul, nu mai există.
- **Indiciul după a doua literă nu e al Excel-ului.** `aplicatii.js:627-628`: când pasul are `asteapta`, contează doar `asteapta` (ținta nu mai face pasul), deci literele cu ținta pasului sunt greșeli. Textul §6.3 spune altfel: pasul e făcut de un eveniment „cu `tinta` = ținta canonică a pasului, cu `activat` …, **sau** `asteapta(ev)` = true”. După text, prima literă ar face pasul 2 (prea devreme, dar fără indiciu fals). Lecția m2-l11 nu pornește niciun asistent (`asistent` apare de 0 ori) și verifică titlul pe stare. Deci nu e GRAV de Excel; e o nepotrivire contract ↔ cod comun, la D („Pentru orchestrator”).

## B. Unghiul STARE_FINALA_ERORI: greșelile tipice, după fiecare starea = ecranul = Excel real

### Ce trece (pe scurt; detaliile în `p3.json`, `p5.json`)
- **Alt tip, apoi Ctrl+Z** (`b1_alt_tip`):
  - Clustered Column în loc de Line, Ctrl+Z → niciun grafic (stare și ecran), selecția A1:C5 rămâne; Ctrl+Y îl readuce;
  - cu Line ales, Insert › Clustered Column îi schimbă tipul (`schimbare_tip_grafic`), Ctrl+Z → Line, 2 linii desenate;
  - Stacked Line, Area, More Line Charts... → mesajul „În aplicația reală, „…” funcționează; aici nu e simulată.”, cu `actiune: nesimulat`, starea neschimbată.
- **Etichetele Right, apoi None** (`b2_none`): `etichete_date` toate `null`, 0 etichete desenate; Ctrl+Z → Right și 8 etichete; None pe un grafic fără etichete → eveniment, nimic schimbat; More Data Label Options... → mesajul „nesimulat”.
- **Esc la jumătatea unei galerii** (`b3_esc`): galeria Line închisă, niciun grafic, focusul în grilă, ↓ mută celula; Esc în submeniul Data Labels îl închide doar pe el (rămâne Add Chart Element), al doilea Esc închide lista. Alt, N, N, 1, Esc → înapoi la literele filei Insert, apoi la file, apoi ieșire. Abaterea din șirul cu submeniul e la [FARA_REFERINTA] 2.
- **`#SPILL!` și golirea celulei** (`p5.json › S`, `p3.json › b4.1-4`): D4 = „x”, D2 `=SUM(B2:B7)*B2:B6` → D2 „#SPILL!” în stare și pe ecran, D3 activă (scenariul `excel-varsare-zona-ocupata`); Delete pe D4 → D2:D6 = 432, 336, 384, 480, 288 (stare = ecran = `acoperire_r14.fapte.v_varsare_com`); Ctrl+Z → iar „x” și „#SPILL!”; Ctrl+Y → vărsarea. Scris 5 peste D5 vărsată → `#SPILL!`; Delete pe D5 → vărsarea revine. Pe vărsare: Ctrl+↓ din D2 → D6, Ctrl+A în D3 → D2:D6 (ca scenariile). Backspace + Enter pe D4 (tastatura telefonului n-are Delete) golește și el.
- **Delete pe grafic, apoi Ctrl+Z** (`b6_delete`): graficul cu titlul „Carti”, etichetele Right și mutat la x 715 → Delete `{tasta_delete, stergere_grafic, grafic:1}`, niciun grafic; Ctrl+Z → același grafic: Line, titlul, etichetele, locul. Titlul ales + Delete → doar titlul dispare (`grafic:1/titlu`, lecția m2-l11:140); Ctrl+Z îl readuce.
- **Asistentul §6.3 pe o greșeală tipică** (`b7_asistent`; pașii: butonul Insert Line, apoi Line): galeria Column = greșeala 1, fără indiciu; Esc = greșeala 2 → indiciul pe butonul Insert Line; apoi pașii 1, 2 făcuți, indiciul dispare.

### GRAV G17-1 (NOU, adus de rundă): după Ctrl+↓ până la capăt, grila rămâne goală; cu o valoare tastată acolo, ea e în stare, nu pe ecran, iar tastele nu mai fac nimic
- **Gestul** (`p5.json › C_nou`, `p6.json › a`; capturile `p5_ctrl_jos_nou.png`, `p5_ctrl_jos_tastat_nou.png`, `p6_blocat.png`): A1:A7 pline, clic pe A7, Ctrl+↓ (scenariul `excel-ctrl-jos-ultimul-rand`; greșeala „Ctrl+↓ până la capăt” din unghi).
- **Ce face simulatorul:**
  - starea și Name Box: A1048576 (ca scenariul);
  - **ecranul: grila e albă, fără niciun rând**: nici celule, nici numerele rândurilor, doar literele coloanelor (`p5_ctrl_jos_nou.png`); celula activă nu e în DOM; evenimentul are ținta `celula:A7` (de unde a plecat), nu celula activă;
  - fără tastare, Ctrl+↑ întoarce în A7 și Ctrl+Home în A1, cu evenimentele lor (`2_sus`, `3_home`);
  - **cu „5” + Enter acolo** (elevul nu vede unde e și scrie): `stare.celule.A1048576 = {valoare: 5, text: "5"}`, dar pe ecran nu e nicăieri (`ecran: null`, `7_enter`); tastarea are ținta `celula:A7`; Enter are ținta `fereastra_app:excel`, iar focusul ajunge pe `BODY`, în afara aplicației;
  - **apoi Ctrl+↑, Ctrl+Home și ↑ nu emit niciun eveniment și nu mută nimic** (`8_*`: `ev: []`, celula activă tot A1048576); grila rămâne albă și nu are nicio celulă de atins (`p6.json › a.1_blocat.randuri_vazute: []`, `p6_blocat.png`);
  - după Enter se desenează 3000 × 26 = 78.000 de celule (`ultim: [78000, "Z3000"]`), deci și pagina se îngreunează.
- **Ce face aplicația reală:** scenariile `excel-ctrl-jos-ultimul-rand` (A1048576) și `excel-ctrl-dreapta-ultima-coloana` (XFD7); `acoperire_r14.fapte.v_varsare_com`: `End(xlDown)` din A7 = A1048576. În Excel, celula activă e un dreptunghi de pe foaie, cu rândurile din jurul ei; `referinte/uia_excel.json › zona_document` are mereu numerele rândurilor și celulele. Grila albă, fără rânduri, nu există în referință.
- **De ce e GRAV:**
  - §3 / §5 („Ce spune `stare()` la `text` / `celule` trebuie să fie ȘI pe ecran”): A1048576 = 5 e în stare și nu pe ecran;
  - §4 („un eveniment pe fiecare gest fizic”; „la taste: ținta focusului”): Ctrl+↑ / Ctrl+Home / ↑ nu emit nimic, iar tastarea și Ctrl+↓ au ținta celulei de plecare;
  - elevul care a apăsat Ctrl+↓ din greșeală vede o foaie goală, iar dacă scrie și apasă Enter, rămâne blocat: tastele nu-l mai întorc;
  - **e regres al rundei 17:** cu `excel.js` dinainte, aceleași gesturi se opreau la A40 / Z7, cu celula pe ecran, evenimentele cu ținta corectă și ieșirea cu Ctrl+↑ / Ctrl+Home (`p5.json › C_vechi`).
- **Cauza în cod:** `excel.js:1005-1015` (`intindere`): peste ultimele date + 2000 de rânduri grila nu se mai lungește, dar celula activă și derularea merg la rândul 1.048.576 (celula din colțul grilei e la `top` −19.922.214 px, `p5.json › C_nou.8_Control+ArrowUp.cel`); `excel.js:1320-1336` (Ctrl+săgeți până la marginea foii). Constructorul a scris doar jumătatea fără tastare, ca A17-1 „de aprobat” (`de_aprobat.md`): „celula nu se vede”. Grila albă, valoarea nevăzută și tastele moarte nu sunt scrise acolo.
- La Ctrl+→ din C7 → XFD7 (`4_dreapta`): la fel, celula nu e în DOM, iar evenimentul are ținta `celula:C7`; Ctrl+← întoarce în C7.

### GRAV G17-2 (VECHI în cod, găsit acum pe drumul T1 de pe telefon): degetul care derulează grila mută celula activă fără niciun eveniment
- **Gestul** (`p5.json › T_nou`): telefon, LUNI, atingere pe A1 (eveniment), apoi degetul pus pe C7 și tras spre stânga-sus (derularea grilei, cum face elevul ca să vadă titlul graficului mutat spre dreapta).
- **Ce face simulatorul:** grila se derulează (A1 la x = −109), **celula activă devine C7, cu zero evenimente** (`ev: []`). La fel în `p2c.json › 2_deget_grila` (C6 → B7, `ev: []`) și în `p2.json › tel.0_sel_tragere`: „apasă pe A1, ține apăsat și trage până la C5” (m2-l11:62) derulează în loc să selecteze (A1, fără eveniment).
- **Ce face aplicația reală:** nu e capturat pe ecran tactil; constatarea stă pe contract, nu pe referință.
- **De ce e GRAV:** §4 / R6: „Un eveniment pe fiecare gest fizic al elevului”, cu `inainte` / `dupa` (§5); aici `stare().selectie` se schimbă fără niciun eveniment, deci lecția și asistentul nu văd gestul. Criticul 10 a socotit tot așa „`pozitie.x` trece din 0 în 10 fără niciun eveniment” (A1).
- **Nu e regres al rundei:** identic cu `excel.js` dinainte (`p5.json › T_vechi`).
- **Cauza:** apăsarea pe grilă alege celula imediat (`excel.js` › `I.la.jos`, ~2951-2960), iar evenimentul se emite la `pointerup` (`aplicatii.js:285-349`), care nu mai vine: grila n-are `touch-action` (în `aplicatii.css` doar `:256` mânerul și `:316` bara), deci browserul preia derularea și trimite `pointercancel`, pe care `aplicatii.js` nu-l ascultă (cum notase criticul 10 la `:311-339`).

## C. Regresul
- **Probele vechi, pe eșantion** (rulate cu `--iesire` în dosarul meu; `reg_sumar.txt`, `reg_*.txt/json`): `runde/10/proba_grav.py` (A1, A2, E5, M1-M3: 32 ok), `runde/9/proba_grav.py` (X10 Column, Change Chart Type, Switch, E5: 71 ok), `runde/8/proba_grav.py` (K1-K6: 65 ok), `runde/7/proba_grav_cont.py` (X7-X10 Sort: 28 ok), `runde/6/proba_excel.py` (20 ok). **0 picate.** `7/proba_grav.py` și `7/proba_grav_cont2.py` nu le-am rulat (căderile lor X6 ×2 / X8 ×3 sunt cerute de probe mai vechi decât referința, `runde/10/critic.md:107-111`).
- **Cu gesturile mele, pe drumurile lecțiilor:** vărsarea E5 (`p5.json › S`), Change Chart Type / Switch / titlul / Delete pe titlu (`p3.json › b6`), Clustered Column din galerie (`b1`), Esc în liste și KeyTips K6 (`b3.5_taste`), Shift+săgeți (`p1.json › taste_line.sel`): ca în runda 10.
- **Fereastra mică 1366×657 la 125% (1093×526 css)** (`p5.json › M`, `p5_mica_galerie.png`, `p5_mica_data_labels.png`): galeria Line [602, 57 → 886, 525] încape în fereastră, „More Line Charts...” se atinge (jos la 524 din 526); graficul nou la x 279, y 0 (ca la criticul 10); submeniul Data Labels [163, 153 → 367, 524], toate cele 8 rânduri se ating cu clicul; Right → 8 etichete.
- **Telefonul pe încă 2 drumuri** (`p6.json › b_tel`, `p6_tel_coloane_outside_end.png`): atingere pe B3, „10” + Enter → B3 = 10 pe ecran și în stare, ținta `celula:B3`, apoi B4; Clustered Column + Add Chart Element › Data Labels › Outside End din atingeri → lista coloanelor, 5 etichete (6, 10, 9, 3, 7).
- **Cod comun:** banda n-are copii decât pentru `excel.js`, `excel.json`, `de_verificat.md`, `de_aprobat.md` (`runde/17/inainte/`), iar `git status -- aplicatii/` e curat (totul e în punctul de control `59af7e74`). Nu văd o schimbare a benzii Excel în cod comun, deci regresul Word / PowerPoint nu l-am cerut. Benzile paralele (r15 Explorer, r16 Word, r18 Windows) nu le-am judecat.
- **Regres găsit:** G17-1 (Ctrl+↓ / Ctrl+→ după ultimul bloc), adus de rundă: înainte se oprea la A40 / Z7, fără blocaj.

## D. [FARA_REFERINTA], MINOR, ce a trecut, predarea

### [FARA_REFERINTA] (nu le număr GRAV)
1. **Ștergerea graficului pe telefon (R17-1).** Cu graficul ales: Backspace → `fara_efect`; Home › Cut → `decupare` pe celule, graficul rămâne (`p2.json › tel.8_*`). Lecția (m2-l11:140) trimite la „butonul Delete de sub grafic”, care e al simulatorului vechi; biblioteca n-are așa ceva. În Excel, Cut cu graficul ales îl decupează (din memorie, necapturat). Ieșirea care merge azi: Undo din bara de acces rapid. Când lecția trece pe bibliotecă, textul de la :140 trebuie schimbat sau biblioteca trebuie să dea un gest de ștergere.
2. **Esc în șirul KeyTips cu submeniul Data Labels deschis** (`p3.json › b3_esc.4_taste`): Alt, J, C, A, D, apoi primul Esc închide AMBELE liste și nu mai arată nicio literă; al doilea Esc arată iar literele filei Chart Design; al treilea, filele; al patrulea iese. Cu mouse-ul, Esc închide doar submeniul (corect). Regula „Esc urcă un nivel” (K6, runda 10) ar cere ca primul Esc să lase Add Chart Element cu literele X, A, C, D… Referința n-are un Esc capturat pe un submeniu.
3. **Galeria Line deschisă din taste** (Alt, N, N 1): niciun rând ales până la ↓ (`taste_line.pasi[3]`). Referința n-are focusul din galerie (`acoperire_excel.md` §4: rândurile n-au taste de acces în UI Automation).
4. **Etichetele după Change Chart Type (R17-3):** Line cu Right → Column → `etichete_date` rămâne „Right” (nume care nu e în lista coloanelor), desenate (`p3.json › b6.6_column_ok`). Lecția spune „Titlul și etichetele rămân”; poziția pe care o alege Excel nu e capturată.
5. **Selecția cu degetul pe telefon:** m2-l11:62 („apasă pe A1, ține apăsat și trage până la C5”) derulează grila în loc să selecteze (`p2.json › tel.0_sel_tragere`: A1). Drumul merge mai departe pentru că Insert ia zona curentă A1:C5. Un exercițiu de felul m2-l11:154 („selectează doar A1:B4”) n-ar avea gest pe telefon (în afară de Name Box). Partea cu evenimentul lipsă e GRAV G17-2.

### MINOR
1. **Ținta tastelor cu graficul ales, când tasta nu trece prin `tastaGrafic`:** Ctrl+Z / Ctrl+Y și Alt (KeyTips) au `tinta: celula:A1` cât graficul e ales (`p1.json › mouse_line.6_ctrlz`, `taste_line.pasi[6]`; `p3.json › b6.2_ctrlz`). §4 cere ținta focusului (`grafic:1`). `tastaGrafic0` (`excel.js:2911-2923`) întoarce `null` pentru Ctrl+…, deci ținta rămâne a celulei.
2. **Locul listelor noi față de referință:** galeria Line la [603, 137] față de [599, 133]; Add Chart Element (panoul) la [26, 164] față de [22, 160]; Data Labels la [164, 250] față de [159, 245], la ambele tipuri. Abaterea e de +4 / +5 px, sub pragul de 8 px; mărimile sunt identice.
3. **Telefonul, A1:** după o tragere până la marginea ecranului, graficul începe la x 348, iar coloana C se termină la 372, deci cifrele din C (aliniate la dreapta) stau sub marginea lui (`p2b_1_tras_la_margine.png`). C5 se atinge; ca să vadă „tot tabelul” (m2-l11:64), elevul mai trage o dată (după o derulare) sau trage în jos.

### Ce a trecut
- X10 întreg, cu mouse-ul și cu tastele: listele = referința rând cu rând (nume, ordine, grupuri, taste de acces, rândurile gri), starea finală = cele 3 scenarii reale ale graficelor, Ctrl+Z/Y pe etichete, laboratorul m2-l11 până la pasul 69.
- A1: tragerea cu degetul merge până la capăt, cu evenimentul ei; C5 = 30 pe telefon.
- T1: ținta literelor (și compuse IME) pe telefon = `grafic:1/titlu` / `grafic:1`, ca pe calculator.
- Cele 6 greșeli ale unghiului, în afară de Ctrl+↓ până la capăt: starea = ecranul = scenariile, evenimentele la fiecare gest, mesajul „nesimulat” la Stacked Line / Area / More….
- O4 pe Excel: 57/64, cele 11 scenarii noi trec. Regresul: 0 picate pe 5 probe vechi; fereastra mică și telefonul, fără abateri.

### Pentru orchestrator (contract, nu Excel)
- **§6.3 și `asteapta`:** `aplicatii.js:627-628` face din `asteapta` singurul criteriu al pasului, deci literele cu ținta pasului sunt greșeli și indiciul vine în timp ce elevul scrie corect (pe telefon și pe calculator, `p2c.json › 5_ă`, `p2.json › pc.6_a`). Textul §6.3 spune „`tinta` …, `activat` …, **sau** `asteapta`”. Una din ele trebuie schimbată. Propunerea mea: când pasul are `asteapta`, evenimentele cu ținta pasului care nu-l termină (`scriere`, `stergere_inapoi`) nu sunt greșeli.

### Predarea pentru runda următoare
1. **G17-1 întâi** (regres, blochează elevul):
   - grila trebuie să arate rândurile din jurul celulei active și la A1048576 / XFD7, cum arată Excel (derularea „virtuală”: se desenează doar fereastra din jurul celulei active, nu toate rândurile până acolo);
   - sau, dacă A17-1 se aprobă, celula activă nu trebuie să plece din grila desenată fără să o tragă după ea;
   - tastarea / Enter acolo: focusul rămâne în aplicație, ținta = celula activă, Ctrl+↑ / Ctrl+Home întorc.
   - Proba: `p5.py › C_nou` (rândurile `6_tastat` … `8_ArrowUp`) și `p6.py › a`.
2. **G17-2:** pe telefon, apăsarea pe grilă să nu mute celula activă până nu se știe că e atingere (nu derulare), sau `pointercancel` să întoarcă selecția și să emită; proba: `p5.py › T_nou`. E în cod comun (`aplicatii.js`) cel puțin pe jumătate, deci regresul Word / PowerPoint pe telefon devine obligatoriu.
3. **Referințe de capturat** (o rundă `acoperire`): Esc pe submeniul Data Labels în modul KeyTips; Cut / Backspace cu graficul ales (R17-1); Data Labels la Bar / Pie (R17-2); poziția etichetelor după Change Chart Type Line → Column (R17-3); ecranul lui Excel după Ctrl+↓ până la A1048576 (ce rânduri se văd).
4. MINOR 1 (ținta lui Ctrl+Z / Alt cu graficul ales) e o linie în `tastaGrafic`.

GRAV_VECHI_DESCHISE: 0
GRAV: 2
