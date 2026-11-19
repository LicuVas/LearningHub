# Criticul rece, runda 6, etapa B (Excel, primul val): unghiul aspect + drumurile lecțiilor VIII + regresul Word

**Cine:** critic rece, fără notele constructorului. Din `runde/6/` am citit doar `gata_pentru_critic.md`. N-am citit `diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. N-am rulat `proba_excel.py`: concluziile vin din gesturile și măsurătorile mele.

**Ce am rulat** (totul în `runde/6/critic_probe/`):
- Server static legat de `127.0.0.1`, port liber (pornit și oprit în fiecare script), servind worktree-ul; Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`h.py`). Pagina `aplicatii/poligon.html?aplicatie=excel` (foaia de probă) și `LH.aplicatii.deschide('excel', {loc, continut, focus:true})` cu conținut de lecție (`celule`, `selectie`, `foi`).
- Gesturi reale: `page.mouse` (clic, dublu clic, clic dreapta, tragere pe celule, pe pătrățelul de umplere, pe linia dintre antete), `page.keyboard` (tastare, Enter, Esc, F2, F12, Ctrl+S/W/O/N/Z), `page.touchscreen` + atingeri CDP la 375×667, tastatura care compune prin CDP (`Input.imeSetComposition` / `Input.insertText`).
- Măsurători: `getBoundingClientRect` față de rădăcină, comparate cu `rect_css` din `referinte/uia_excel.json` (citit doar cu Python, pe chei: `uia_rez.py` → `uia_zona.txt`, `uia_home.txt`; referința e la **100% DPI, factor 1,0, cadrul 1366×768 css** — `dpi_factor: 1.0`, `fereastra: [1366, 768]`), `getComputedStyle`, `scrollWidth/clientWidth`, `window.getSelection()`, `document.activeElement`; după fiecare gest `stare('excel')`, textul celulelor de pe ecran, `window.__lhAplicatieEv`, mesajele `[data-lh-nesimulat]`. Capturi `x_*.png` … `t_*.png`.
- O rulare cu bare de derulare vizibile (`p3.py`: Chromium headless fără `--hide-scrollbars`, adică cum le desenează Chrome pe Windows) → `x_cu_derulare.png`.
- **Excel real, de două ori, invizibil** (`com_r6.py` → `com_r6.json` + `com_r6_pdf.png`; `com_r6b.py` → `com_r6b.json`): `DispatchEx`, `Visible=False`, `DisplayAlerts=False`, registru nou, `FormulaLocal` + `Range.Text` (textul afișat), un PDF exportat într-un dosar unic din %TEMP% (șters). Ambele instanțe au ieșit singure la `Quit` (fără oprire forțată); n-am atins Excel-ul utilizatorului, nici PowerPoint.
- Regresul Word (`p15.py`): aceleași gesturi pe `aplicatii/` din HEAD (bc56ca36, exportat cu `git archive` într-o copie din %TEMP%, ștearsă la final) și pe worktree-ul de acum; capturi comparate pixel cu pixel + dreptunghiurile tuturor `[data-lh-tip]`.

**Diff-ul rundei (necomis):** 4 fișiere noi + 3 modificate.
- noi: `aplicatii/excel.js` (1644 rânduri: modelul foii, formulele, grila, editarea, umplerea, comenzile, gesturile), `aplicatii/date/excel.json` (generat din `uia_excel.json`), `aplicatii/_unelte/genereaza_excel.py`, `aplicatii/profiluri/excel365.json`;
- `aplicatii/aplicatii.js` (+1/−1): `SURSE_APP.excel`;
- `aplicatii/aplicatii.css` (+73): blocul „Excel (runda 6)”, clase `lh-ap-x-*` și `.lh-ap-excel`;
- `aplicatii/poligon.html` (+2/−2): conținutul de probă (Elev, Nota 1, Nota 2, Media; D2 activă).

## A. Unghiul aspect (Excel): constatări

### GRAV X1: numerele se TAIE la jumătatea unei cifre; Excel le rotunjește sau arată ####
- **Simulatorul** (`p5.py` → `p5.txt`, captura `z_celule.png`, coloana A cu lățimea implicită de 64 px):
  - `=25/3`: `stare().celule.A10.text = "8,333333333"`; pe ecran încap 57 px din 78 (`clientWidth 57`, `scrollWidth 78`), deci se vede „8,333333” plus o bucată de cifră;
  - `1234567890`: pe ecran se vede **„12345678”**, alt număr;
  - `123456789012`: se vede **„1,23457E-”** (din „E+11” rămâne un minus);
  - `12.03.2026`: se vede **„12.03.202”**;
  - `=2/3*100`: se vede „66,66666”.
- **Excel real** (`com_r6.json`, `Range.Text`, coloană de lățime implicită): `=25/3` → **„8,333333”**, `=1/3` → „0,333333”, `=2/3*100` → **„66,66667”**, `1234567890` → „1,23E+09”, `123456789012` → „1,23E+11”, `12.03.2026` → **„########”**. Într-o coloană îngustă: `75,5` → „76”, `=25/3` → „8,3”, `1234` → „###” (`com_r6_pdf.png`). La constantele tastate de mână, Excel poate lăți singur coloana; la rezultatele formulelor nu o lățește. În niciun caz nu taie o cifră.
- **Lecția** spune exact asta: m1-l06/index.html:111 „Dacă o dată nu încape, Excel arată `####`: valoarea e acolo, doar că nu are loc. Un număr se rotunjește întâi (75,5 poate apărea 76…) și arată `####` abia când nici așa nu încape”.
- **§5:** `text` trebuie să fie „ce se vede în celulă”. Aici `stare()` spune „8,333333333”, pe ecran e un text tăiat, iar Excel ar arăta „8,333333”.
- **De unde vine:** `excel.js:43-52` (`general()`) dă 10-11 cifre fără să țină cont de lățimea coloanei; `aplicatii.css:234` `.lh-ap-x-t{overflow:hidden;text-overflow:clip}` taie restul. Elevul care calculează o medie de trei note (8, 8, 9) vede o cifră tăiată, iar la lecția 6 nu vede niciodată ####.

### GRAV X2: textul lung NU trece peste celula vecină goală
- **Simulatorul** (`p6.py`, `x_curgere.png`): în A1 e „Situația notelor la informatică”, iar B1:F1 sunt goale. Pe ecran se vede doar „Situația n”. Măsurat: span-ul are 57 px din 177. Clasa `lh-ap-x-curge` e pusă și `--lh-ap-x-max = 1664px`, dar span-ul e element flex cu `flex-shrink: 1` într-o celulă de 64 px (`excel.js:619-624`, `aplicatii.css:232-233,239`), deci se strânge la lățimea celulei.
- **Excel real** (`com_r6_pdf.png`, același registru exportat): în E2 textul întreg trece peste F2 și G2 (goale); în E3, cu „x” în F3, se taie la „Situatia no”. La fel, „Elevii clasei a VIII-a B” din A14 trece peste B14.
- **Lecția:** m1-l06/index.html:111 „Un text prea lung se taie când celula din dreapta e plină”; :177 „În B2 e o observație lungă, care trece peste celula din dreapta”.
- Orice titlu scris în A1, cum fac toate lecțiile cu tabele, apare tăiat. Elevul ar învăța că Excel taie textul chiar și când alături nu e nimic.

### GRAV X3: bara Acces rapid: Save are LUPA, iar Undo și Redo au un pătrat gol
- **Referința:** `uia_excel.json › bara_titlu › ToolBar 'Quick Access Toolbar' [43,1,135,48]`: `Button 'Save'` (FileSave, Ctrl+S) `[43,10,28,29]`, `SplitButton 'Undo' [72,10,38,29]`, `SplitButton 'Redo' [111,10,38,29]`, `MenuItem 'Customize Quick Access Toolbar' [150,9,28,31]`. README_referinte: în Excel bara e AFIȘATĂ (în Word e ascunsă), deci Excel e prima aplicație din bibliotecă la care se vede.
- **Simulatorul** (`z_qat.png`, `p16.py`): Save și Customize Quick Access Toolbar sunt desenate cu desenul `M8.5 3a5.5 5.5 0 0 1 4.38 8.82l3.65 3.65…`, adică `GLIFE.cauta`, lupa (`panglica.js:24`). Desenul îl alege `panglica.js:240`: orice buton din bara de titlu care nu e Minimize, Maximize, Close sau Help primește `cauta`. Undo și Redo au un pătrat gol + ▾.
- **Lecția:** m1-l06/index.html:95 „Ctrl+Z sau butonul **Anulare (Undo)** ↶ anulează ultima operație”. Pe simulator nu există niciun ↶. Elevul învață că salvarea e lupa (în Excel, lupa e căutarea, la 507-875 px pe aceeași bară).

### GRAV X4: banda de sub foaie e așezată altfel: bara de derulare orizontală stă deasupra filelor, iar la dreapta filelor e o fâșie albă
- **Referința** (`uia_excel.json › zona_document`): filele foilor `Tab 'Book1' [1,713,805,32]`, despărțitorul `Pane XLCTL [806,714,32,31]`, bara de derulare orizontală `[838,720,508,17]` **în dreapta filelor, pe același rând**, cea verticală `[1346,220,17,496]` (pornește de la rândul antetelor, y = 220).
- **Simulatorul:** filele `[1,712,805,32]`; la dreapta lor, de la x = 806 la 1366 și între y = 712 și 745, e alb (`z_jos_dr.png`). Cu barele de derulare pe care Chrome le desenează pe Windows (`p3.py`, `x_cu_derulare.png`): bara orizontală a grilei e la `[27,697,1323,15]`, **deasupra filelor**, pe toată lățimea, și acoperă rândul 25. Bara verticală e la `[1350,242,15,455]` și pornește de sub antete. În proba headless barele sunt ascunse (`--hide-scrollbars`), de aceea probele nu le văd.

## B. Drumurile lecțiilor (pe poligon, cu conținutul lecțiilor VIII)

Merg până la capăt: m1-l07 (formula `=(E2+F2)/2` → 8,5; „5 bucăți” → `#VALUE!`; Ctrl+Z → 10 și 1200), m2-l09 cu `=IF(B2<9;10;20)` → 10, m2-l10 cu o singură celulă + Data › Sort A to Z, umplerea formulei G2→G4, Σ + Enter → 42, Merge & Center, Bold, F12 + nume + Enter, foile Note / Excursie / Orar, „+”. Nu merg:

### GRAV X5: m2-l08: după Σ zona propusă nu e încadrată și nu e aleasă. „Scrii peste zona propusă” strică formula și blochează celula
- **Lecția:** m2-l08/index.html:181 „Faci clic în celula de sub numere, apoi pe Σ. Excel scrie `=SUM(` și o zonă aleasă de el, **încadrată cu linie punctată**”; :196 și :201 „Scrie B2:B6 **peste zona propusă**, apoi apasă Enter”; :63 „săgeata ▾ de lângă Σ și alege Medie (Average)”.
- **Simulatorul** (`p10.py`, `z_autosum_peste.png`): Σ pe B8 → `=SUM(B2:B7)` în editare. Cursorul stă la capăt (`selectionStart = selectionEnd = 11`), nu e selectat nimic, nicio linie punctată (`.lh-ap-x-clip` / `.lh-ap-x-umple` invizibile). Elevul scrie B2:B6 și obține `=SUM(B2:B7)B2:B6`. La Enter: `actiune: 'formula_neprimita'`, celula rămâne în editare, fără niciun mesaj. Cauza e `excel.js:971-972` (`porneste(…, zona ? t.length : …)`, cursorul la capăt). Formula așa e respinsă și de Excel real (`com_r6b.json`: `FormulaLocal` → excepția 0x800A03EC), doar că în Excel elevul n-ar ajunge la ea, pentru că zona e aleasă.
- Săgeata ▾ de lângă Σ → mesajul central „„More Options” … nu e simulată” (`b_autosum_lista.png`). Pasul cu Average nu se poate face.

### GRAV X6: m2-l09: `=DACĂ(…)` nu dă `#NAME?`; celula rămâne blocată în editare, fără mesaj
- **Lecția:** m2-l09/index.html:155 „`=DACĂ(…)` dă `#NAME?`: funcția se numește IF”; :157 (captura: „C2 arată #NAME?, iar bara de formule arată =DACĂ(…)”); :171.
- **Excel real** (`com_r6b.json`): `=DACĂ(B3<9;10;20)` e primită, `Text = "#NAME?"` (și `=dacă(…)` devine `=DACĂ(…)`, tot `#NAME?`).
- **Simulatorul** (`p10.py`): D3 rămâne `{valoare: "=DACĂ(B3<9;10;20)", editare: true}`. Formulele scrise după aceea (D4, D5, D6) nu mai ajung nicăieri (`None`), iar elevul nu vede de ce. Cauza: numele de funcții se recunosc doar cu `[A-Za-z]` (`excel.js:106`, `:115`), deci „Ă” aruncă eroarea `caracter`. Greșeala pe care lecția o cere intenționat nu se poate reproduce, iar elevul rămâne blocat.

### GRAV X7: m1-l06: lățimea coloanei nu se poate schimba (clicul pe linia dintre litere SELECTEAZĂ coloana vecină); Fill Color, Borders ▾, % și Wrap Text dau doar mesajul
- **Lecția:** m1-l06/index.html:79 „dă dublu-clic pe linia dintre literele A și B”; :111 „duci mouse-ul sus, pe linia dintre literele C și D, până apare **săgeata dublă ↔**, și tragi spre dreapta”; :118 „Lățește coloana C”; :76 „găleata Fill Color”; :77 și :196 „Borders ▾ › All Borders”; :177 „Wrap Text”; :255 „ca procent, cu butonul %”.
- **Simulatorul** (`p8.py`, `p16.py`, `p17.py`):
  - pe linia dintre A și B cursorul e `s-resize`, la fel ca în mijlocul literei (nu ↔);
  - dublu clic pe linie → `selectare_coloana`, `antet_coloana:B`, iar A rămâne de 64 px;
  - tragere de +40 px pe linia dintre C și D → se selectează coloana D, C rămâne de 64 px (`b_l06_dupa.png`);
  - clic dreapta pe antet › Column Width… → fereastra se deschide, dar tastarea „20” = `fara_efect`, iar Enter = mesajul „Column Width … nu e simulată”;
  - Fill Color, Borders ▾, Percent Style, Wrap Text → mesajul central.
- Împreună cu X1 (fără ####), lecția 6 nu se poate face deloc. Mai mult, elevul învață ceva greșit: că un clic pe linia dintre litere alege coloana.

### GRAV X8: m1-l03: Ctrl+S deschide altă fereastră decât spune lecția; Ctrl+W și Ctrl+N tac; dublul clic pe filă scrie numele în celulă
- **Lecția:** m1-l03/index.html:58 „Salvează cu Ctrl+S. La File name scrie numele tău… La Choose a Location… alege Documente… Apoi Save”; :59 „Închide registrul cu Ctrl + W. Excel rămâne deschis, gol.”; :95-97 (captura din Excel 365: „fereastra **Save this file**, cu File name Book1 și .xlsx, Choose a Location cu Documents și butoanele More options, Save și Cancel”, „Ctrl+S pe un registru nou, în Excel 365”); :110 „butonul Ctrl+N”; :129 „În fereastră alegi folderul în stânga”; :285 „Redenumirea: dublu clic pe filă, scrii, Enter”.
- **Simulatorul** (`p11.py`):
  - Ctrl+S → `pagina_backstage: "Save As"` (`c_ctrl_s.png`): nu are casetă File name și nici Choose a Location;
  - Ctrl+W → mesajul „Close (Ctrl+W) … nu e simulată”; Ctrl+N → la fel;
  - dublu clic pe fila Sheet2, apoi „Note” + Enter: fila rămâne „Sheet2”, iar „Note” ajunge în celula A1 (evenimentul `tasta_enter … celula:A2`);
  - în fereastra Save As (F12) panoul din stânga și lista sunt goale (`c_f12.png`). Fereastra Save As a lui Word, din aceeași bibliotecă, arată Acasă / Galerie / Documente / Acest PC / Rețea (`w_nou_mozaic.png`).
- **Referința:** în `uia_excel.json` nu există suprafața „Save this file” (0 apariții; în `uia_word.json` există `dialog.save_this_file`, Ctrl+S pe document nou). R4: „o suprafață fără referință contează ca diferență”. Până atunci lecția (cu captura ei) e singura sursă și spune altceva decât arată simulatorul.

### GRAV X9: pe telefon nu se poate scrie în celule (tastatura telefonului nu ajunge), iar celulele au 19 px
- **Simulatorul** (`p13.py`, 375×667, atingere): după atingerea lui D3, `document.activeElement = DIV.lh-ap.lh-ap-excel`, adică niciun câmp de text. Tastatura telefonului nici nu are unde să se deschidă. Textul trimis cum îl trimite telefonul (`Input.insertText "7,5"`, compunerea „Ana”) se pierde: D3 rămâne gol, Enter trece la D4. Word, în aceeași pagină: după atingere focusul e în `TEXTAREA.lh-ap-intrare`, iar `insertText "zz"` ajunge în document.
- Pe calculator, cu tastatura care compune (`p14.py`): în modul Ready, „ș” compus + „i” → în celulă ajunge doar „i”; „Mădălina” trimis ca `insertText` → nimic. Merge numai după ce celula e deja în editare.
- Celulele au 64×19 px la 375 px (`p12.py`), sub pragul de 32 px pentru atingere (I1).
- **Contract** I1 („biblioteca merge la 360-390 px”): pe telefon nicio lecție de Excel nu se poate face.

### GRAV X10: m2-l10 (mai multe criterii) și m2-l11 (grafice) se opresc în mesajul central
- **api_biblioteca.md §3:** „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate.”
- **Simulatorul** (`p19.py`, `p17.py`):
  - Data › Sort… deschide fereastra Sort, dar Add Level → „nu e simulată”, iar OK → „„Sort” … nu e simulată” (tabelul rămâne nesortat). m2-l10 se numește „Sortarea datelor după unul sau mai multe criterii”.
  - Insert › Insert Column or Bar Chart → mesajul central. Toată lecția m2-l11 („Grafice”) stă pe asta.

## C. Regresul Word: **NU strică**
`p15.py`, aceleași gesturi pe `aplicatii/` din HEAD (bc56ca36) și pe worktree-ul de acum, la 1366×768: Word deschis, F12 (Save As), „abc” + Ctrl+W („Save your changes to this file?”, cu butoanele More options… / Save / Don't Save / Cancel), lista Font Size deschisă, Ctrl+F12 (Open). Plus Word deschis la 375×667. **Toate cele 6 capturi sunt identice pixel cu pixel** (`ImageChops.difference(...).getbbox() = None`), dreptunghiurile tuturor `[data-lh-tip]` sunt identice (136 / 235 / 153 / 157 / 214 noduri), iar `stare('word')` e aceeași. Fără erori în pagină. Blocul CSS nou e legat doar de `.lh-ap-excel` și `lh-ap-x-*`, iar `aplicatii.js` primește doar o intrare în `SURSE_APP`.

## [FARA_REFERINTA] (nu le număr GRAV)
- **Selecția albastră a browserului peste celule** după tragerea unei zone: `window.getSelection() = "9\n\n10\nBogdan\n7\n8\nDan\n8\n"`, iar `user-select: auto` pe `.lh-ap-x-c` (`x_zona.png`, `x_meniu.png`: „Bogdan”, „Dan”, 9, 10, 26 pe fond albastru). Excel nu are așa ceva. E cel mai vizibil defect fără referință; lecția m1-l06:95 cere chiar gestul („selectezi o zonă trăgând”).
- Zona selectată e colorată în verde (`rgba(16,124,65,.08)`); în Excel e gri. N-am captură reală.
- În timpul unei formule adresele nu se colorează și nu sunt încadrate (B2 albastru, C2 roșu…), iar bara de stare rămâne „Enter” după clicul pe o celulă (în Excel: „Point”) (`x_mod_point.png`).
- La o zonă cu numere selectată, bara de stare nu arată Average / Count / Sum. Referința a fost luată pe o celulă goală.
- Pictogramele: Percent Style = pătrat gol, Comma Style = „#”, Increase/Decrease Decimal = ↑ ↓ (`z_align_num.png`); în bara de stare Macro Recording și Page Break Preview = „•”; meniul de clic dreapta fără pictograme la Paste Special, Insert, Clear Contents, Sort, Format Cells… și cu un pătrat gol la Paste Options.
- Caseta Search fără lupă; titlul „Book1 - Excel” lipit de marginea de sus (y 2-18 din bara de 48 px).
- ✕ și ✓ de lângă fx au mereu același gri, și în editare (m1-l02:168: „lângă fx apar X și bifa”). Referința nu le are în arbore (`excel.js:485-487`).
- La tragerea pătrățelului de umplere, chenarul punctat cuprinde doar celulele noi, iar după umplere nu apare butonul Auto Fill Options.

## MINOR
- La 1366 px, `.lh-ap-sus` și `.lh-ap-jos` depășesc cu 2 px (`scrollWidth 1366`, `clientWidth 1364`). Cu barele de derulare ale lui Chrome pe Windows, o bară subțire acoperă numele grupurilor (Clipboard, Font, Alignment…) și bara de stare (`x_cu_derulare.png`). E la fel în Word (`p4.py`), deci e mai vechi decât runda asta.
- Mesajul central numește partea de UI Automation, nu comanda: „„More Options” funcționează” la Σ ▾ și la Borders ▾, „„Fill Color RGB(255, 255, 0)””. Elevul nu recunoaște comanda.
- Fereastra Save As: în bara de derulare orizontală scrie „Pagina din dreapta” (numele butonului din referință, desenat ca text), cursoarele barelor sunt blocuri gri închis, iar butoanele de navigare au pătrate goale (`c_f12.png`). Aceleași piese apar și în fereastra Open a lui Word (comune).
- Pe telefon, ▾ din panglică au 17-20 px, lansatoarele 21 px, iar elementele din bara de stare 28 px (la fel în Word, `p18.py`).

## Ce a trecut (văzut pe ecran și în `stare()`)
- **Așezarea față de referință** (diferențe de 0-2 px, sub toleranța de 8 px):
  - Name Box `[11,190,131,24]` față de `[10,188,131,24]`; bara de formule `[241,181,1123,41]` față de `[240,179,1125,41]`;
  - antetele 64×20, rândurile 26×19 de la y = 242 (referința: 240); colțul Select All 26×20;
  - filele foilor Scroll Left/Right `[17/49,713,32,32]` (gri, `activ:false` ca în referință), Sheet1 `[113,713,66,32]`, Add Sheet `[211,713,32,32]`;
  - bara de stare (Ready, Accessibility, Display Settings, Normal/Page Layout/Page Break Preview, zoom 100 %);
  - filele panglicii (Home…Help, fără Developer) și butoanele Acces rapid la ≤ 1 px; panglica Home identică ca grupuri și locuri cu `panglica.TabHome`, cu Bottom Align apăsat (`bifat=1` în referință); Calibri 11 (ca `Styles("Normal")` real).
- **Afișarea care se potrivește cu Excel real** (`com_r6.json`): `7,5` → „7,5” la dreapta; `7.5` → „07.mai”; `TRUE` centrat; `#DIV/0!`, `#NAME?`, `#VALUE!` centrate; `-3,25`; `3,0` → „3”; `=AVEGARE(…)` → `#NAME?`; titlul „Book1  -  Excel”.
- **Bara de stare:** Ready → Enter (tastare) → Edit (F2); bara de formule arată formula; Name Box sare la C4 (m1-l02).
- **Meniul de clic dreapta pe celulă** are rândurile din `meniu_contextual.celula`, în ordinea de acolo (Cut … Open Hyperlink gri), cu mini-bara deasupra. Clic dreapta pe filă → Insert…/Delete/Rename/Move or Copy…/… → fereastra Move or Copy.
- **Evenimentele:** câte unul pe gest, cu ținta canonică (`panglica:Home/Font/Bold`, `celula:B7`, `fila_foii:Sheet2`, `tasta_enter` cu `activat: dialog_salvare:Save` în Save As).
- **Word:** fără regres (secțiunea C).

GRAV_VECHI_DESCHISE: 0
GRAV: 10
