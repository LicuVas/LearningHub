# Criticul rece, runda 21 (B-excel#2, a doua rundă): G17-1, G17-2 + unghiul ASPECT + regresul

**Cine:** critic rece al benzii Excel. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/21/critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md`, `runde/17/critic.md`. Ce spune constructorul l-am verificat cu gesturile mele; probele lui (`proba_grav.py`, `proba/h21.py`) nu le-am folosit.

**Ce am rulat** (totul în `runde/21/critic_probe/`):
- Hamul `hc.py`, copiat din `runde/17/critic_probe/hc.py`: server static legat de `127.0.0.1`, port liber, oprit la finalul fiecărui script; Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost. I-am adăugat `GRILA` (rândurile vizibile, golurile dintre ele, numerele care nu se țin în șir, celulele nealiniate cu antetul, numerele tăiate), `ACT` (unde e celula activă, întreagă sau nu, față de bara verticală) și `roata` (rotița, prin `page.mouse.wheel`).
- Gesturi reale: `page.keyboard`, `page.mouse` (clic, rotiță, cursorul barei tras), `page.touchscreen.tap`, degetul prin CDP (`Input.dispatchTouchEvent`), tastatura telefonului prin `Input.insertText`.
- `excel.js` de pe disc = `inainte/excel.js` + exact `excel_js.diff` (16 bucăți, diff-ul meu `excel_js_acum.diff` e identic). Diferența din `aplicatii.js` față de HEAD (`aplicatii_js_git.diff`) e doar mesajul central al benzii Explorer (`:217-248`).
- Referința am citit-o doar cu Python, pe chei: `ref_dump.py` → `ref_baza.txt`, `ref_zona.txt` (și celelalte `ref_*.txt` de la B).
- Fără Excel real, fără ecranul utilizatorului, fără git care scrie, fără `masoara.py` / `porti.py`. Erori în pagină: 0 în toate probele.
- Greșeli de probă ale mele, refăcute: în `pA.py`, atingerea lungă „pe B3” a căzut pe antetul coloanei B, pentru că grila era derulată cu 105 px; am refăcut-o în `pA2.py › c`, cu grila la 0,0. În `pA.py › 11`, 102 apăsări pe ↑ n-au ajuns la marginea ferestrei (150 de rânduri); am refăcut-o în `pA2.py › a`, cu 152 de apăsări.

## A. GRAV-urile vechi

### G17-1 (grila albă după Ctrl+↓ până la capăt; valoarea tastată acolo nu se vedea; tastele moarte): **ÎNCHIS**
- **Gestul criticului 17** (`pA.json › G1`; capturile `pA_1_ctrl_jos.png`, `pA_3_enter.png`, `pA_5_ctrl_dreapta.png`): A1:A7, B7, C7 pline, clic pe A7, Ctrl+↓:
  - starea și Name Box: A1048576, ca în scenariul `excel-ctrl-jos-ultimul-rand`;
  - pe ecran se văd rândurile 1048552…1048576, fără goluri și în șir. Celula activă e întreagă, jos (y 451 în grilă), încadrată. Evenimentul `{sageti, mutare, celula:A1048576}`. Focusul e în `TEXTAREA.lh-ap-intrare`, în aplicație;
  - „5”: `{tastare, scriere, celula:A1048576}`, bara de formule „5”. Enter: `{tasta_enter, confirmare, celula:A1048576}`. În stare A1048576 = 5, iar **pe ecran „5”** (`ecran()`, algoritmul O4). Focusul rămâne în celulă. În DOM sunt 3.900 de celule, nu 78.000;
  - Ctrl+↑ → A7, Ctrl+↓ → A1048576, ↑ → A1048575, Ctrl+Home → A1. Fiecare gest are evenimentul lui, cu ținta celulei de sosire.
- **Gestul vecin:**
  - **Ctrl+End** cu A1048576 = 5 → C1048576 (ultimul rând folosit × ultima coloană folosită), `{tasta_home_end, mutare, celula:C1048576}`, celula întreagă pe ecran;
  - **Ctrl+→ din C7** → XFD7, întreagă, cu marginea dreaptă la 1345 = marginea stângă a barei verticale (`la_stanga_barei: true`). Coloanele XEJ…XFD se văd în șir. Ctrl+← → C7;
  - **pe telefon** (375×667, `pA.json › G2.9`): Ctrl+↓ → A1048576 se vede, în 9 rânduri, antetul de 104 px, fără numere tăiate.
- **Rotița și bara de derulare în fereastră** (ce cere orchestratorul la aspect):
  - rotița în sus, din A1048576, în pași de 600 px (`7_roata_sus`): 1048520 → 1048489 → 1048457 → 1048427. La fiecare pas, rândurile sunt în șir, fără goluri între ele, iar celulele sunt aliniate cu antetele (`gaps`, `nonc`, `nealin` goale). Evenimentul e `{rotita, derulare}`, iar selecția nu se schimbă;
  - cursorul barei verticale, tras în 8 pași de jos până sus (`9_cursor_tras_sus`): la fel, continuu, fără goluri și fără rânduri dublate.
  - **Dar derularea se oprește la rândul 1048427** (marginea ferestrei). Și „Line up” de acolo nu mai urcă (`10_line_up_in_capat`: 1048427 → 1048427, cu evenimentul `derulare`). Asta e R21-2 al constructorului, la [FARA_REFERINTA] 1.
- **Ce rămâne, fără să blocheze** (la D): ↑ peste marginea ferestrei sare 25 de rânduri (MINOR 1); PgDn în fereastră sare inegal (MINOR 2); fâșia albă de 16 px sub rândul 1048576 (MINOR 3).

### G17-2 (degetul care derulează grila mută celula activă fără eveniment): **ÎNCHIS**
- **Gestul criticului 17** (`pA.json › G2`, telefon 375×667, tabelul LUNI): atingere pe A1 → `{clic, selectare_celula, celula:A1}`. Apoi degetul pus pe C7 și tras spre stânga-sus: grila se derulează (scrollLeft 0 → 154), **celula activă rămâne A1, iar evenimentele sunt 0**.
- **Gesturile vecine:**
  - degetul pe B7, tras în sus: derulare (scrollTop 105), A1 rămâne, 0 evenimente;
  - atingere pe C9 după derulare → `{clic, selectare_celula, celula:C9}`;
  - **atingere lungă** pe B3 (900 ms, fără mișcare, `pA2.json › tel`): cât ține degetul, 0 evenimente și selecția neschimbată. La ridicare, `{clic, selectare_celula, celula:B3}`. Nu apare niciun meniu;
  - atingere pe B3, „10” (`insertText`) + Enter → B3 = 10 în stare și pe ecran, cu ținta `celula:B3`, apoi B4.
- „Apasă pe A1, ține apăsat și trage până la C5” (m2-l11:62), cu degetul, simplu sau după o apăsare lungă de 900 ms (`6_*`, `7_*`): grila e deja la 0,0, deci nu se derulează. Nimic nu se schimbă și nu se emite nimic. Lipsa unui gest de selecție cu degetul e R21-4 / [FARA_REFERINTA] 5 de la criticul 17, la [FARA_REFERINTA] 2.

### §6.3 (asistentul, `aplicatii.js`): neatins, cum spune constructorul
- Funcția asistentului (`aplicatii.js:637-677` de azi) e identică cu `inainte/aplicatii.js:620-660`. Mesajul central al benzii Explorer a mutat-o cu 17 rânduri mai jos. `:644`: dacă pasul are `asteapta`, numai `asteapta` decide pasul.
- Deci comportamentul e cel descris de criticul 17 (indiciul după a doua literă scrisă corect). Hotărârea e A21-1 din `de_aprobat.md`. Nu-l număr GRAV.

## B. Unghiul ASPECT pe Excel

**Metoda** (`pB.py`, `pB2.py`, `pB4.py`):
- La 1366×768, fiecare nod al referinței care are nume și dreptunghi (`uia_excel.json › suprafete`) l-am pus în pereche cu elementul vizibil al simulatorului care are același `data-lh-eticheta` / `aria-label`. Am luat, cu prioritate, unul cu același `data-lh-tip`, cel mai apropiat. Abaterea e socotită față de rădăcina aplicației.
- Ferestrele le-am comparat RELATIV la colțul lor, pentru că referința le are în alt loc pe ecran (Format Cells la x = −27, pe jumătate în afara ferestrei).
- Rezumatul e în `pB_rez.txt`, perechile în `pB*.json`.

### Ce se potrivește la ±2 px (fără constatări)
| suprafața | noduri | la ±2 px | ce rămâne |
|---|---:|---:|---|
| `bara_titlu` (Acces rapid, titlul, Search, butoanele ferestrei) | 16 | 16 | — |
| `file_panglicii` | 14 | 14 | — |
| `bara_stare` (Ready … Zoom 100 %) | 16 | 16 | — |
| `bara_stare#selectie_numere` (B2:B7 = 5…10) | 18 | 13 | Average 7,5 [860,2] / Count 6 [934,6] / Sum 45 [989,8] față de [859,2] / [933,6] / [988,8]: +1 px. Celelalte 5 sunt captura r7 cu altă lățime a butonului Accessibility (150,4 față de 161 din `bara_stare`) |
| `panglica.TabInsert` / `TabFormulas` / `TabData` | 45 / 38 / 47 | toate | — |
| `panglica.TabHome` | 88 | 82 | cele 6 casete combinate: MINOR 4 |
| `panglica_context.Ctx_ChartDesign` (după Line) | 34 | 26 | lipsesc Style 9…16, rândul al doilea, nevăzut, al galeriei (y 149 + 56 > marginea panglicii, 179); pe ecran nu se văd nici în Excel |
| `zona_document` (Name Box, Formula Bar, antetele A…U și 1…25, filele foilor, barele) | 70 | 59 | grila +2 px pe y și −3 px pe înălțime (MINOR 5); numele butoanelor barelor (MINOR 6) |
| Format Cells, filele Number / Alignment / Font (`pB2.json › fc_*`) | 30 / 33 / 57 | toate | fereastra stă la [1, 260], nu la [−27, 331]: e adusă în ecran, iar mărimea e 554×509, ca în referință |
| Insert Function (Formulas › Insert Function..., `pB4.json › 1_if`) | 26 | 26 | fereastra la [287, 287] față de [286, 286]. Și fx din bara de formule o deschide (`clic / fereastra`) |

### Grila, selecția, umplerea (capturile `pB4_selectie.png`, `pB4_umplere.png`, `pA_*.png`)
- Celula activă are chenar verde, cu pătrățelul de umplere jos-dreapta. Selecția B2:C4 are chenar verde, nuanța de fundal, iar celula activă rămâne albă. Antetele B, C și 2-4 sunt gri `rgb(210,210,210)`, cu text verde `rgb(16,124,65)` aldin. Fill Color → B2 galben `rgb(255,255,0)`.
- Pe referință nu sunt culori (UI Automation), deci culorile nu le judec. Pe ecran arată ca Excel 365.
- **Fereastra de 150 de rânduri, la derulare** (întrebarea orchestratorului; `pA.json › G1.7-9`, `pA2.json`):
  - cu rotița, cu cursorul barei tras și cu „Line up” / „Line down”, grila e continuă: niciun gol între rânduri, niciun rând dublat sau sărit. Celulele sunt aliniate cu antetele la fiecare pas;
  - abaterile sunt la margini, nu în interior:
    - derularea se oprește la marginea ferestrei ([FARA_REFERINTA] 1);
    - ↑ peste margine sare 25 de rânduri (MINOR 1);
    - PgDn intră în fereastră cu un salt (MINOR 2);
    - sub ultimul rând al foii rămâne o fâșie albă de 16 px (MINOR 3).
- **Antetul rândurilor la 7 cifre:** are 61 px pe calculator și 104 px pe telefon. Niciun număr nu e tăiat (`taiate: []` peste tot). Lățimea din Excel nu e capturată (R21-1).

### Graficele m2-l11 (`pB2.json › grafic_*`, `pB2_line_2_crop.png`, `pB2_coloane_2_crop.png`)
- **Line** (atelierul A1:D5): 480×288, titlul „Chart Title”, legenda jos (miercuri, joi, vineri), axa 0-100, categoriile 8A…8D. Referința `acoperire_r14.fapte.x_line`: `are_titlu`, „Chart Title”, `legenda: Bottom`. La fel.
- **Data Labels › Right:** 12 etichete, la dreapta punctelor, cu valorile tabelului (45 la x 98 față de punctul 8A de la x ≈ 86). Referința `y_data_labels_line`: Right pe cele 3 serii. La fel.
- **Clustered Column** (CARTI): titlul „Cărți citite”, fără legendă. Referința `z_data_labels_coloana`: titlul „Cărți citite”, `are_legenda: false`. **Outside End:** 6, 4, 9, 3, 7 deasupra coloanelor. La fel.

### Pe ecrane (`pB3.py`, `pB4.py`)
- **Laptop 125% (1366×657 = 1093×526 css):**
  - Name Box, bara de formule, grila (12 rânduri, A…Q), filele foilor și barele sunt pe ecran; pagina nu depășește lățimea;
  - panglica trece de 1093 (grupul Editing la 1047-1204), dar partea de sus (`.lh-ap-sus`, `overflow-x: auto`) se derulează: Shift+rotița o mută cu 275 px, iar Editing ajunge în ecran și se atinge (`pB4.json › laptop125`);
  - bara de titlu (butoanele ferestrei) și bara de stare (Normal / Page Layout / zoom) au 1364 px, deci trec de marginea ecranului. Asta e vechi, notat de criticul 10 la [FARA_REFERINTA];
  - fereastra de la capăt merge: A1048576 întreagă, 12 rânduri; XFD7 întreagă, la stânga barei.
- **Telefon 360×640 și 390×844 (tactil, dpr 3):**
  - panglica se derulează lateral cu degetul (249 px), cum cere regula I1.4;
  - celulele au 32,3 px; antetul rândurilor are 44 px, iar la A1048576 are 104 px; rândurile sunt în șir, fără numere tăiate;
  - A1048576 și XFD7 sunt întregi;
  - zonele de atins < 32 px: 19, toate în codul comun / vechi (MINOR 7).
- **Tabla SMART 1920×1080:** grila și bara de formule se întind până la 1920, dar **bara de titlu, panglica și bara de stare rămân la 1364 px**. Grila desenează doar A…Z, iar dreapta ei (≈ 1690-1899) rămâne albă, fără coloane și fără linii. Aplicația are 768 px înălțime, deci sub ea rămân 312 px goi (`pB3_smart_1.png`). Nu e capturat la 1920, deci e la [FARA_REFERINTA] 3. Codul care desenează minimum 26 de coloane e mai vechi decât runda (`inainte/excel.js:1014`).

### GRAV noi pe unghiul aspect: **niciunul**
Toate abaterile găsite sunt fie sub prag (MINOR), fie fără referință la mărimea / gestul respectiv ([FARA_REFERINTA]). Niciuna nu oprește un drum din lecție.

## C. Regresul

- **Probele criticului 17, reluate întocmai pe codul de azi** (copiate în `critic_probe/reg/c17_*.py`; ieșirile `p1.json` … `p6.json` în `critic_probe/`). Comparația frunză cu frunză față de `runde/17/critic_probe/*.json` e în `reg/dif17.py` → `reg/dif17.txt`, `reg/dif17_b.txt`:

  | proba | ce acoperă | frunze diferite | care |
  |---|---|---:|---|
  | `p1` | X10 întreg: galeria Line rând cu rând, Add Chart Element, Data Labels la Line și la coloane, starea finală, Ctrl+Z / Y, tastele Alt, N, N, 1 … Alt, J, C, A, D, R, laboratorul m2-l11 | **0** din 595 | — |
  | `p2b` | A1 pe telefon: tragerea graficului până la margine, C5 = 30, titlul | **0** din 92 | — |
  | `p2c` | T1 pe telefon: literele (și compuse IME) în titlu au ținta `grafic:1/titlu` | 2 din 74 | `2_deget_grila`: degetul pe grilă lasă acum C6 (înainte devenea B7, fără eveniment) = reparația G17-2 |
  | `p3` | cele 7 greșeli ale unghiului (alt tip + Ctrl+Z, None, Esc, `#SPILL!`, Delete pe grafic, asistentul) | 44 din 771 | toate în `b5_ctrl_capat` (G17-1: celula în DOM, ținta bună, „5” pe ecran, tastele emit). Pasul `5_ctrl_dreapta` dă `mutare_cursor`, din vina probei 17: clicul pe C7 de la `:120` și cel de la `:122` cad la ~0,35 s unul de altul, deci fac dublu clic = editare. Gestul curat e în `pA.json › G1.5` (XFD7, `mutare`) |
  | `p5` | degetul pe grilă, Ctrl+săgeți, vărsarea reluată, fereastra mică | 38 din 248 | toate în `C_nou` (G17-1 reparat) și `T_nou` (A1 rămâne = G17-2 reparat). `S` (vărsarea) și `M` (galeria și Data Labels la 1093×526) neschimbate |
  | `p6` | ieșirea din blocaj + regresul pe telefon (B3 = 10, coloane + Outside End din atingeri) | 16 | toate în `a.*`: rândurile se văd, focusul în aplicație, clicul pe A1048552 și Ctrl+Home emit. `b_tel` identic |

- **Probele vechi** (`reg/regres_critic.sh` → `reg/reg_sumar.txt`, ieșirile cu `--iesire` în `reg/`): `10/proba_grav.py` 0, `9/proba_grav.py` 0, `8/proba_grav.py` 0, `6/proba_excel.py` 0 picate. (`7/proba_grav*.py` nu le-am rulat; căderile lor X6 / X8 sunt cerute de probe mai vechi decât referința, `runde/10/critic.md:107-111`.)
- **O4 direct pe `scenarii/excel`** (`LH_IESIRE=critic_probe/iesiri`, `o4_excel.log`): **57 / 64 ok, 12 unități**. Rămân aceleași 7 scenarii vechi: autocompletare-tab, autofit-latime, numere-afisare, separator-virgula, sortare-doua-niveluri, tragere ×2. Cifrele sunt ale constructorului și ale criticului 17.
- **Codul comun:** banda a schimbat doar `excel.js` (`excel_js_acum.diff` = `excel_js.diff`). Diferența din `aplicatii.js` (`aplicatii_js_git.diff`, `:217-248`) e mesajul central al benzii Explorer (r19). Deci regresul Word / PowerPoint / Explorer / Windows nu e cerut de banda Excel.
  - Am verificat doar efectul schimbării Explorer asupra Excel-ului (`pB4.json › pc.5_mesaj`): Stacked Line → mesajul „nesimulat” cu `{clic, nesimulat, meniu:Stacked Line}`. După o redesenare a grilei (Ctrl+↓ peste capăt) rămâne un singur mesaj, iar după 5 s dispare. Nu strică Excel-ul.
- **Regres găsit: niciunul.** Ce s-a schimbat față de runda 17 sunt exact cele două reparații.

## D. [FARA_REFERINTA], MINOR, ce a trecut, predarea

### [FARA_REFERINTA] (nu le număr GRAV)
1. **Rotița și bara de derulare nu ies din fereastra de 150 de rânduri (R21-2).**
   - Din A1048576, rotița în sus se oprește la rândul 1048427, iar cursorul barei, tras până sus, la fel. „Line up” de acolo nu mai urcă (`pA.json › G1.7`, `9`, `10`; `pA_10_line_up_capat.png`).
   - Cursorul stă sus pe pistă, ca la începutul foii, deși grila e la rândul 1.048.427.
   - Ieșirea există doar din taste: Ctrl+↑, Ctrl+Home, ↑ ținut, Name Box. Elevul care a apăsat din greșeală Ctrl+↓ și încearcă să urce cu mouse-ul rămâne la fundul foii. În Excel, bara acoperă toată foaia; nu e capturat.
2. **Selecția cu degetul pe telefon (R21-4, [FARA_REFERINTA] 5 al criticului 17).**
   - „Apasă pe A1, ține apăsat și trage până la C5” (m2-l11:62) nu face nimic: 0 evenimente, selecția neschimbată, nici după o apăsare lungă de 900 ms (`pA.json › G2.6-7`).
   - Atingerea lungă e un clic la ridicare, fără meniu (`pA2.json › tel`).
   - Drumul m2-l11 merge mai departe, pentru că Insert ia zona curentă A1:C5.
3. **Tabla SMART 1920×1080** (`pB3.json › smart`, `pB3_smart_1.png`):
   - bara de titlu (cu ✕ la x 1365), panglica și bara de stare au 1364 px, iar grila și bara de formule se întind la 1920;
   - grila desenează doar A…Z, deci la dreapta rămân ≈ 210 px albi, fără coloane și linii, până la bara verticală (1899);
   - aplicația are 768 px pe un ecran de 1080;
   - la 1366 referința are titlul, starea și coloanele pe toată lățimea ferestrei, dar la 1920 nu e nimic capturat. Minimul de 26 de coloane (`excel.js:1032`, `inainte/excel.js:1014`) și bara de 1364 sunt mai vechi decât runda.
4. **Unde se oprește vederea după un salt înapoi:**
   - Ctrl+↑ din A1048576 → A7, sus în vedere: rândurile 1-6 sunt deasupra (`4_0`);
   - Ctrl+← din XFD7 → C7, prima coloană din vedere: A și B sunt la stânga (`6_ctrl_stanga`);
   - Ctrl+Home le aduce pe toate. Unde așază Excel vederea nu e capturat.
5. **Ctrl+1 și Shift+F3** (`pB2.json › ctrl1`, `shiftf3`):
   - Ctrl+1 nu dă niciun eveniment, nicio fereastră și niciun mesaj: `gestTasta` din `aplicatii.js` (cod comun, vechi) nu-l socotește gest;
   - Shift+F3 dă `{tasta_f3, fara_efect}`, fără Insert Function;
   - în Excel, cele două scurtături deschid Format Cells și Insert Function. Nu sunt în lecții (m1-l06 lucrează din panglică), iar referința nu are scenariul scurtăturii. Partea „Ctrl+1 fără eveniment” e o întrebare de §4 pentru orchestrator, nu de Excel.
6. **R21-1:** antetul rândurilor are 61 px la 7 cifre (104 px pe telefon); lățimea din Excel nu e capturată. **R21-3** (Ctrl+Shift+↓ după ultimul bloc) nu l-am jucat.

### MINOR
1. **↑ peste marginea de sus a ferestrei sare 25 de rânduri** (`pA2.json › a`, `pA2_a_sus_dupa_salt.png`):
   - din A1048576, ↑ ține celula activă sus și derulează câte un rând (i = 148, 149: vederea începe la 1048428, apoi la 1048427, cu celula sus);
   - la a 150-a apăsare (A1048426, în afara ferestrei), vederea sare la 1048402…1048426, iar celula activă ajunge JOS (y 451). Următoarele ↑ o urcă în vedere fără derulare;
   - pe grila normală, ↑ derulează câte un rând.
   - Cauza: fereastra se mută la `a.r − 100` (`excel.js:1035-1038`), iar `scrollTop` nu se trece pe noua origine; `vedeCelula` (`:1230-1231`) aduce doar celula în vedere.
2. **PgDn din grila normală în fereastră sare inegal** (`pA.json › G1.12`):
   - Name Box A1995 (celula jos, vederea 1971-1995);
   - PgDn → A2018 SUS, vederea 2018-2042 (+47 de rânduri);
   - PgDn → A2041 jos, vederea nu se mișcă;
   - PgDn → vederea +22;
   - PgDn → +47 iar.
   - PgUp e constant (celula sus). Cauza e aceeași ca la 1 (`excel.js:3407` + mutarea ferestrei). Fiecare gest are evenimentul lui, cu ținta bună.
3. **Fâșia albă de 16 px sub rândul 1048576** (`pA2_b_fasia_jos.png`):
   - după rotița până la capăt, sub ultimul rând rămân 16 px goi deasupra filelor foilor (`jos_gol: 16`);
   - pătrățelul de umplere (`lh-ap-x-maner`, top 2846 + 7) trece de înălțimea grilei desenate (2850), deci `scrollHeight` = 2866;
   - imediat după Ctrl+↓ nu se vede (scrollTop 2380), doar după rotiță sau bară.
4. **Casetele combinate din Home sunt cu +3 / +3 px:** Font [133, 96] față de [130, 93], Font Size, Number Format și săgețile lor „Open”. Celelalte 82 de noduri din Home sunt la ±2 px.
   - Pentru MINOR 2 al criticului 17 (`pB5.json`):
     - butonul Insert Line or Area Chart e la +2 / +2, iar galeria lui la +3 / +3;
     - Add Chart Element e la +2 / +2, iar lista lui la +3 / +3;
     - rândul Data Labels e la +4 / +4, iar submeniul lui la +4 / +4.
   - Explicația constructorului ține în mare: 2 din cei 3 px vin de la butonul desenat de panglică, iar 1 px vine de la listă.
5. **Grila e cu 2 px mai jos și 3 px mai scurtă:**
   - Grid [1, 222, …, 490] față de [1, 220, 1342, 493];
   - bara verticală [1345, 222, 17, 493] față de [1346, 220, 17, 496];
   - rândul 1 la y 242 față de 240.
   - În plus, elementul „Grid” trece pe sub bara verticală (lățimea 1364 față de 1342), ceea ce nu se vede pe ecran.
6. **Numele bucăților barelor de derulare:** orizontal „Line left / Line right”, față de „Column left / Column right” din referință. Pista n-are nume („Page down”, „Page right” lipsesc din simulator). Asta se vede doar în ținta evenimentelor (`derulare:Line left`, `derulare:pagina_h`), nu pe ecran.
7. **Telefonul: 19 zone de atins sub 32 px** (`pB3.json › tel360.mici`, la fel la 390). Toate sunt în codul vechi / comun, iar regula I1.4 cere ≥ 32:
   - săgețile „More Options” ale butoanelor despicate din Home, cele vizibile la 360 px (17-20 px lățime; după captură, Paste, Copy, Underline și Borders);
   - lansatorul Clipboard (21×21);
   - săgeata „Open” a casetelor (17×29);
   - caseta Name Box (104×18 în combo de 131×24);
   - fx (28×24);
   - butoanele barelor (17×17);
   - bara de stare (28 px înălțime);
   - marginea antetului de coloană (8×34).
8. MINOR 1 și 3 ale criticului 17 (ținta lui Ctrl+Z / Alt cu graficul ales; cifrele din C sub grafic pe telefon) rămân: `p1.json` și `p2b.json` reluate sunt identice cu ale lui.

### Ce a trecut
- **G17-1:** Ctrl+↓ / Ctrl+→ / Ctrl+End până la marginea foii arată celula activă întreagă și rândurile / coloanele din jur, în șir. Tastarea și Enter acolo pun valoarea în stare ȘI pe ecran, cu ținta celulei. Focusul rămâne în aplicație. Ctrl+↑ / ↑ / Ctrl+Home / Ctrl+← emit și întorc. Merge la fel pe 1366, 1093 (125%), 360, 390 și 1920. În DOM sunt 3.900 de celule, nu 78.000.
- **G17-2:** pe telefon, degetul tras pe grilă doar derulează, cu 0 evenimente. Atingerea scurtă și cea lungă aleg celula la ridicare, cu `clic / selectare_celula`. Tastatura telefonului scrie în celula atinsă.
- **Aspectul la 1366×768:** bara de titlu, filele, bara de stare (și cu numere), Home (în afară de 3 casete), Insert, Formulas, Data, Chart Design, Name Box, bara de formule, antetele A…U / 1…25, filele foilor sunt la ±2 px. Format Cells (Number, Alignment, Font) și Insert Function sunt la ±2 px față de colțul ferestrei.
- **Graficele m2-l11:** Line (titlu, legenda jos), Right, Clustered Column (titlul = seria, fără legendă), Outside End, ca faptele referinței.
- **Fereastra de 150 de rânduri:** continuă la rotiță, la bară și la săgețile barei, fără goluri, salturi sau rânduri dublate în interiorul ei.
- **Regresul:** X10, A1, T1 și cele 7 greșeli ale criticului 17 sunt identice, iar probele 10 / 9 / 8 / 6 au 0 picate. O4 dă 57 / 64, aceleași 7 scenarii. Mesajul central pe Excel e bun după schimbarea Explorer.
- **Panglica pe laptop 125% și pe telefon** se derulează lateral (I1.4), iar Editing ajunge în ecran.

### Pentru orchestrator (cod comun / contract, nu banda Excel)
- **§6.3 / A21-1:** neschimbat (`aplicatii.js:644`), de hotărât de Vasile.
- **Ctrl+1 fără niciun eveniment** (`gestTasta`, `aplicatii.js`): un gest fizic fără eveniment atinge §4 („un eveniment pe fiecare gest fizic”). E vechi și comun tuturor aplicațiilor; nu e pe un drum din lecție.
- **Zonele < 32 px pe telefon** (MINOR 7) sunt în panglică (`panglica.js`) și în barele desenate. Cine le măsoară e `lectii/_build/oracol_controale_taiate.py` (I1), pe care nu l-am rulat.

### Predarea pentru runda următoare
1. **R21-2 întâi** ([FARA_REFERINTA] 1, cu MINOR 1-2 din aceeași cauză):
   - când derularea (rotița, bara, „Line up / down”, degetul) atinge marginea ferestrei, fereastra trebuie să se mute, iar `scrollTop` să fie trecut pe noua origine (`scrollTop += OY_vechi − OY_nou`), ca rândurile de pe ecran să nu se miște;
   - aceeași trecere la ↑ / PgDn peste margine scoate saltul de 25 / 47 de rânduri;
   - cursorul barei ar trebui să arate locul în toată foaia, nu în fereastră.
   - Proba: `pA.py › 7-12` și `pA2.py › a`.
2. **MINOR 3:** înălțimea grilei desenate trebuie să cuprindă pătrățelul de umplere sau pătrățelul să nu iasă din ea (fâșia de 16 px).
3. **Referințe de capturat** (o rundă `acoperire`):
   - Excel la A1048576 / XFD7: ce rânduri se văd și lățimea antetului la 7 cifre (R21-1);
   - `ScrollRow` după rotița în sus din A1048576 (câte rânduri pe crestătură), după ↑ în rândul de sus și după PgDn;
   - poziția vederii după Ctrl+↑ / Ctrl+← înapoi la date;
   - Ctrl+1 și Shift+F3 ca scenarii;
   - Excel la 1920×1080 (câte coloane, bara de titlu / stare pe toată lățimea), pentru tabla SMART.
4. **Tabla SMART** ([FARA_REFERINTA] 3): de hotărât dacă aplicația se întinde (bara de titlu, panglica, bara de stare, coloanele până la bară) sau se oprește la 1366 pe ecranele late.
5. MINOR 4-6 sunt sub 4 px sau nu se văd. MINOR 1 al criticului 17 (ținta lui Ctrl+Z / Alt cu graficul ales) e tot o linie în `tastaGrafic`.

GRAV_VECHI_DESCHISE: 0
GRAV: 0
