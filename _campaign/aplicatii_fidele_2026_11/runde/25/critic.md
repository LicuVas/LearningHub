# Criticul rece, runda 25 (B-excel#2, a treia rundă): G17-1, G17-2, R21-2 + MINOR 1-3 + unghiul GEST_TASTATURA + regresul

**Cine:** critic rece al benzii Excel. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/25/critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md`, `runde/supliment_B_excel_runda25.md`, `runde/21/critic.md`. Ce spune constructorul l-am verificat cu gesturile mele. Probele lui (`proba_grav.py`, `proba/gest_tastatura.py`) nu le-am folosit, doar `gest_tastatura.json` l-am citit, ca să văd ce a jucat.

**Ce am rulat** (totul în `runde/25/critic_probe/`):
- Hamul `hc.py`, copiat din `runde/21/critic_probe/hc.py` (doar calea schimbată): server static legat de `127.0.0.1`, port liber, oprit la finalul fiecărui script; Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost.
- Gesturi reale: `page.keyboard`, `page.mouse` (clic, rotiță verticală și orizontală, cursorul barei tras), `page.touchscreen.tap`, degetul prin CDP (`Input.dispatchTouchEvent`), tastele compuse prin CDP (`Input.dispatchKeyEvent`, `Input.imeSetComposition`, `Input.insertText`).
- `aplicatii/excel.js` de pe disc = `runde/25/excel_js_dupa.js` (identic, `cmp`) = HEAD-ul `b5549790`. Diferența față de `inainte/excel.js` e în `excel_js_acum.diff`. Codul comun schimbat în ciclul C (`aplicatii.js`, r23 `keydown` în câmpuri + r24 asistentul + r26 tasta Windows) e în `aplicatii_js_cicluC.diff`.
- Fără ecranul utilizatorului, fără git care scrie, fără `masoara.py` / `porti.py`. O4 rulat direct, cu `LH_IESIRE=critic_probe/iesiri`. Erori în pagină: 0 în toate probele.

## A. GRAV-urile vechi (niciunul deschis la pornire) și R21-2 / MINOR 1-3

### G17-1 (grila albă după Ctrl+↓ până la capăt): **rămâne ÎNCHIS** (`pA.py › G1.1-4`, `pA.json`, `pA_1_ctrl_jos.png`)
- A1:A7, B7, C7 pline, clic pe A7, Ctrl+↓ → A1048576 în stare și în Name Box, `{sageti, mutare, celula:A1048576}`. Pe ecran: rândurile 1048552…1048576 în șir, fără goluri, celula activă întreagă jos (y 453), la stânga barei. Focusul e în `TEXTAREA.lh-ap-intrare`.
- „5” + Enter → `{tastare, scriere}`, `{tasta_enter, confirmare}`, ținta `celula:A1048576`; A1048576 = 5 în stare și „5” pe ecran (algoritmul O4).
- Ctrl+↑ → A7, Ctrl+Home → A1 (vederea de la rândul 1), fiecare cu evenimentul lui. Ctrl+→ din C7 → XFD7 întreagă, marginea dreaptă la 1345 = marginea barei verticale.

### G17-2 (degetul care derulează grila mută celula activă): **rămâne ÎNCHIS** (`pA.json › G2`, telefon 375×667)
- Atingere pe A1 → `{clic, selectare_celula, celula:A1}`. Degetul pe C7 tras stânga-sus: `scrollLeft` 154, **0 evenimente**, A1 rămâne.
- Degetul tras de 8 ori în fereastra de la capăt (A1048576): rândurile coboară câte 4-5, în șir, fără goluri (`gaps`, `nonc`, `nealin` goale), 0 evenimente, A1048576 rămâne.
- (Atingerea mea pe „C9” a căzut pe fila foii `Sheet1`: C9 era sub grila vizibilă, pentru că am sărit derularea verticală pe care o făcea proba 21. E greșeala probei, nu a aplicației.)

### R21-2 + MINOR 1-3 (fereastra de 150 de rânduri): **ÎNCHISE pe proba mea** (`pA.json › G1.5-14`, `pA_9_sus_165.png`, `pA_12_fasia.png`)
| ce am jucat | ce a ieșit | criticul 21 |
|---|---|---|
| rotița în sus din A1048576, 70 de pași de 600 px (`5_roata_sus_capat`) | 1048552 → 1046347, **31-32 de rânduri la fiecare pas**, niciun pas pe loc, nicio abatere (`gaps` / `nonc` / `nealin` goale la toți cei 70); 70 de evenimente `{rotita, derulare}`; A1048576 rămâne aleasă | se oprea la 1048427 |
| cursorul barei tras de jos până sus, în 10 pași (`6_cursor_tras_sus`) | cursorul are 17 px și stă jos (y 681 pe pista 237-698); vederea trece prin 941689, 834827 … 86789 și ajunge la **rândul 1**, fiecare oprire în șir | se oprea la 1048427 |
| din A2600 (Name Box), rotița în sus (`8_A2600_sus`) | 2576 → **1** în 83 de pași, cel mult 32 de rânduri pe pas, nicio stagnare, nicio abatere | nu urca peste 2500 |
| ↑ ținut din A1048576, 165 de apăsări (`9_sus`) | după a 24-a apăsare celula activă stă sus (y 0) și vederea urcă **câte un rând**: la 148, 149, 150, 151, 152 vederea începe la 1048428, …427, …426, …425, …424; niciun salt până la 165 | la a 150-a sărea 25 de rânduri, celula jos (MINOR 1) |
| PgDn din A1995, de 6 ori (`10_pgdn_A1995`) | A2018, 2041, 2064, 2087, 2110, 2133: **pas constant 23**, celula jos (y 453), vederea +23 la fiecare; câte un `{tasta_pagina, mutare}` | +47 / 0 / +22 / +47 (MINOR 2) |
| rotița în jos până la capăt (`12_fasia`) | ultimul rând 1048576 lipit de marginea de jos: `jos_gol` 0, `scrollHeight` 2850 (nu 2866) | 16 px albi (MINOR 3) |
| bara trasă la mijloc, apoi clic pe celula de sub mouse (`7_clic_dupa_bara`) | celula de sub mouse (C524287, y 198) e aleasă, vederea nu se mișcă (524276 înainte și după); ↓ → C524288, fără salt | — |
| rotița 10 pași în sus din A1048576, apoi „7” + Enter (`13_tastare_dupa_roata`) | la tastă vederea se întoarce la celula activă (1048552…1048576, A1048576 întreagă); A1048576 = 7 în stare și pe ecran | — |
| XFD7, rotița orizontală spre stânga, 30 de pași (`14_orizontal`) | coloanele curg XEA → WUJ, fără goluri (`cgaps` 0) | — |

- Grila normală (fără fereastră): Ctrl+Home → vederea la rândul 1; din A1, PgDn → A24, A47, A70 (aceeași grilă ca înainte, `11_pgdn_A1`).
- Ce am văzut în plus, fără referință (la D): PgDn din A1 lasă vederea la rândul 1 cu celula jos (R25-5); PgUp din A2133 (celula jos) întâi aduce celula sus fără să miște vederea, apoi urcă vederea câte 23 de rânduri.

## B. Unghiul GEST_TASTATURA pe Excel

**Metoda** (`pB.py`, `pB2.py`, `pB3.py`, `pC.py`, `pD.py`; rezumatele în `pB_rez.txt`, `pB2_rez.txt`, `pB3_rez.txt`, `pC_rez.txt`, `pD_rez.txt`):
- Am luat întâi tastele pe care le cer lecțiile Excel (numărate în `lectii/viii/m1-*`, `m2-l08…l13`): Enter 104, Ctrl+Z 36, Tab 24, Ctrl+S 17, F12 16, Delete 16, Ctrl+V 11, Esc 9, Ctrl+C 7, AltGr 7, Ctrl+U 6, Ctrl+X 5, Ctrl+N 5, Ctrl+W 3, Ctrl+PageDown 2, Ctrl+PageUp 1, Ctrl+F1 1, plus Spațiu și ghilimeaua cu tasta moartă (m2-l09:158). F2, F4, Alt+=, Ctrl+;, Ctrl+Shift+L, Alt+↓, Ctrl+1, KeyTips și Ctrl+Home / End **nu apar în nicio lecție Excel**. Acolo o abatere nu poate fi GRAV de drum.
- La fiecare gest: evenimentele (`__lhAplicatieEv`), starea, ecranul (algoritmul O4), bara de formule, modul din bara de stare (`Cell Mode`), focusul.
- Două greșeli de probă, refăcute:
  - în `pB.py`, Alt+= pe o coloană golită de pașii de dinainte a dat `=SUM()` + Enter → fereastra de eroare, iar tot ce urma s-a jucat în fereastră. Refăcut în `pB2.py`, pe un tabel curat;
  - în `pB2.py`, clicul pe B2 ieșit din ecran (după Ctrl+Shift+→ până la XFD) a căzut în afara paginii și a luat focusul. Refăcut în `pB3.py`, cu Ctrl+Home întâi.

### Ce merge (eveniment §4, stare, ecran)
| gestul | ce a ieșit | dovada |
|---|---|---|
| Enter / Tab / Shift+Enter / Shift+Tab fără selecție | Tab, Tab, Enter → A2 (înapoi în coloana de pornire, ca `excel-tab-apoi-enter`); Shift+Tab, Shift+Enter înapoi; câte un `tasta_tab` / `tasta_enter`, ținta celulei de sosire | `pB.json › B3_*` |
| Enter / Tab în zona A1:B2 | Enter: A2 → B1 → B2 → A1 (pe coloane, în zonă); Tab → B1; zona rămâne A1:B2 | `B3_in_zona_A1B2` |
| AltGr pentru `>` și `<` (m2-l09:110), trimise ca pe Windows: Ctrl+Alt + textul (`Input.dispatchKeyEvent`, modifiers 3) | intră în formulă; `=IF(B2>=5;"Promovat";"Corigent")` → C2 „Promovat” pe ecran; `=IF(B3<5;…)` → „Corigent” | `B2_dupa_altgr`, `B2_enter`, `B2_altgr_mic` |
| ghilimeaua cu tasta moartă (m2-l09:158): `"` compus, apoi „a” → „ä”; Backspace; `"` + Spațiu → `"` | bara: `…;ä`, apoi `…;"`; formula se termină corect | `B2_dupa_moarta_a`, `B2_dupa_moarta_spatiu` |
| cuvânt compus de tastatură (IME): „Corigență” în A4 | un singur `tastare`, A4 = „Corigență” în stare și pe ecran | `B2_ime_A4` |
| Ctrl+Z pe drumurile lecțiilor | Delete pe B2:C4 + Ctrl+Z → notele revin (m1-l04); „7.5” → 07.mai cu `dd.mmm`, Ctrl+Z → celula goală **și fără format**, apoi „7,5” → 7,5 (m1-l05); „5 bucăți” → C2 `#VALUE!`, Ctrl+Z → A2 = 10, C2 = 1200 (m1-l07); sortarea A→Z + Ctrl+Z → tabelul la loc (m2-l10); Ctrl+X / V + Ctrl+Z → B2 înapoi, formula `=A2*B2` refăcută; două Ctrl+Z la rând, apoi Ctrl+Y | `pC.json › 1-6` |
| Ctrl+C / Esc / Ctrl+V, Ctrl+X / Ctrl+V, Delete pe zonă, Ctrl+U | `copiere`, `anulare_copiere`, `lipire`, `golire`, `subliniat` (A2 subliniat pe ecran) | `B3_*` |
| clic pe Bold în panglică, apoi „x” + Enter | „x” intră în C2, focusul în grilă | `B3_bold_apoi_tastare` |
| Name Box (r23 a schimbat `keydown` în câmpuri): Ctrl+A, F4, „C3”, Enter, apoi „8” + Enter | fiecare tastă are evenimentul ei (`camp:Name Box`); Enter → `salt_la_adresa`, focusul înapoi în grilă, C3 = 8 | `B5_*` |
| F2 / ← / F2 / Esc; Backspace / Esc | modul Edit → mutare_cursor → Enter → Ready, A1 neschimbat; Backspace golește editarea, Esc o reface | `B6_*` |
| F4 în `=A1`, de 4 ori | `=$A$1`, `=A$1`, `=$A1`, `=A1`, câte un `adresa_fixa` | `B6_f4_x4` |
| Alt+= sub B2:B6 | `=SUM(B2:B6)` în modul Point, Enter → 40 pe ecran | `pB2.json › B6_*` |
| Ctrl+↓ / Ctrl+↑ / Ctrl+Shift+↓ / Ctrl+Shift+→ / Shift+↓ / Ctrl+A / Ctrl+End / Ctrl+Home | B7 → B1048576 → B7 → B1; B2:B7; B2:XFD7 (vederea la XFD); B2:B4; A1:B7 apoi toată foaia; B7; A1 | `pB2.json`, `pB3.json` |
| KeyTips: Alt / H / 1; Alt, H, U, S; Alt, A; Alt, N; Esc, Esc | literele filelor, apoi ale Home-ului; 1 → Bold pe A1 (700); U → lista AutoSum cu literele S, A, C, M, I, F; S → `=SUM(B2:B7)`; Esc urcă un nivel, al doilea iese | `pB3.json › B8_*` |
| Format Cells (meniul celulei), Esc, „3” + Enter | fereastra se închide, „3” intră în A2 | `B9_*` |
| Ctrl+Shift+L | mesajul central „Ctrl+Shift+L … nu e simulată”, `{ctrl_shift_l, nesimulat}` | `pB2.json › B7_ctrl_shift_l` |

### GRAV G25-1 (nou; codul e din runda 6): drumul m1-l03 cu foile nu se poate duce la capăt — Delete, Move or Copy, Tab Color și tragerea filei nu fac nimic (`pD.py`, `pD.json`, `pD_1_delete.png`)
L-am găsit pe drumul Ctrl+Z. Lecția întreabă dacă Ctrl+Z aduce înapoi o foaie ștearsă (m1-l03:239). Proba Ctrl+Z n-a avut ce să anuleze, pentru că foaia nu se poate șterge deloc.
- **Gesturile** (registrul din `incearca` m1-l03:247-248, cu foile Septembrie, Ciornă, Noiembrie, Octombrie):
  1. clic dreapta pe fila Ciornă › Delete;
  2. Home › Delete ▾;
  3. clic dreapta pe Octombrie › Move or Copy... › Noiembrie › OK;
  4. clic dreapta › Tab Color;
  5. fila Octombrie trasă cu mouse-ul între Septembrie și Ciornă;
  6. registru cu o singură foaie › clic dreapta › Delete.
- **Ce face simulatorul:**
  1. Delete → `{clic, nesimulat, meniu:Delete}` și mesajul central „În aplicația reală, „Delete” funcționează; aici nu e simulată.” Foile rămân 4;
  2. Home › Delete ▾ → același mesaj (`meniu_derulant:Home/Cells/Delete`);
  3. Move or Copy deschide `dialog.SheetMoveOrCopy`, dar lista Before sheet arată **„Sheet1”, „(move to end)”**, adică rândurile capturii, nu foile registrului. Noiembrie nu se poate alege, iar OK → `{clic, nesimulat, fereastra:OK}`, cu mesajul central „Move or Copy”;
  4. Tab Color → mesajul central;
  5. tragerea filei → `{selectie, selectare, fila_foii:Octombrie}`, ordinea neschimbată, **fără niciun mesaj**;
  6. singura foaie › Delete → tot mesajul „nu e simulată”, nu refuzul lui Excel.
- **Ce cere lecția și ce face aplicația reală:**
  - m1-l03:238: „Comanda Ștergere (Delete) șterge foaia. Dacă are ceva scris, Excel întreabă întâi”, cu captura din Excel `confirma-stergerea.webp` („Microsoft Excel will permanently delete this sheet…”, Delete / Cancel);
  - :240: „îi tragi fila cu mouse-ul între alte două file. Sau: clic dreapta › Mutare sau copiere › Before sheet › OK”, cu captura `mutare-sau-copiere.webp`, unde lista are foile registrului;
  - exercițiile: :247 „Șterge foaia Ciornă. Apoi mută Octombrie înaintea lui Noiembrie”; :255 „Fă o copie a foii Septembrie… redenumește copia”; :220 „Colorează fila Octombrie cu verde”; :266 „Registrul are o singură foaie… Încearcă s-o ștergi. Ce se întâmplă?”; atelierul :288 (șterge Ciornă, copiază Runda 1, colorează Runda 3); :306, :321;
  - în referință comenzile există: `uia_excel.json › meniu_contextual.fila_foii` (Insert…, Delete, Rename, Move or Copy…, Tab Color, Hide…) și `dialog.SheetMoveOrCopy`.
- **De ce e GRAV:** elevul nu poate duce la capăt pasul 5 al lecției m1-l03, nici exercițiile :220, :247, :255, :266 și atelierul :288. E aceeași scară ca la X5 / X8 (criticii 6-7): o comandă de pe drumul lecției care dă doar mesajul central e GRAV (R12: „Orice comandă folosită de o lecție… funcționează”). Tragerea filei nici nu dă mesajul, deci tace. La :266, „nu e simulată” îl duce pe elev la un răspuns greșit.
- **Cauza în cod:**
  - `aplicatii/excel.js:3317`: meniul filei tratează doar Move or Copy (deschide fereastra) și Rename, iar restul cade pe `I.nesimulat(v)`;
  - OK-ul din `dialog.SheetMoveOrCopy` nu are efect, iar lista e cea înghețată;
  - `fila_foii` nu face nimic la tragere.
  - E la fel în `inainte/excel.js:3208` și vine din runda 6 (`git log -S`: `cb86fbc3`), deci nu e adus de runda 25.
- **De ce a scăpat 24 de runde:** O-comenzile moarte (`oracol_comenzi_moarte.json`) n-au niciun rând din `registru-foi` / viii/m1-l03 (0 apariții), iar criticii au judecat m1-l03 doar pe Ctrl+S / W / N și pe redenumire (X8).

### Ctrl+PageDown / Ctrl+PageUp (întrebarea orchestratorului, R25-7): **[FARA_REFERINTA], nu GRAV**, dar mai larg decât spune constructorul (`pB.json › B1_*`, `pB2.json › B1_*`, `pB_B1_ctrl_pgdn_x6.png`)
- **Constructorul a jucat doar un registru cu o foaie.** Pe registrul din m1-l03:230 (4 foi, prima activă), Ctrl+PageDown de 6 ori **nu schimbă niciodată foaia**: rămâne Septembrie, iar celula activă coboară A24, A47, …, A139. Sunt 6 evenimente `{tasta_pagina, mutare}`. Pe ultima foaie (Decembrie, aleasă cu clic), Ctrl+PageDown → A24, iar Ctrl+PageUp de 3 ori → A1, tot pe Decembrie. Clicul pe filă schimbă foaia (`fila_foii`).
- **Cauza:** `excel.js:3517` tratează PageDown / PageUp fără să se uite la Ctrl. E vechi: criticul 7 îl găsise la `excel.js:2323` (`de_verificat.md › R8-5`).
- **De ce nu e GRAV:**
  1. referința înghețată n-are scurtătura: nici scenariu, nici `surse_microsoft.md`. Lecția nu e referință capturată, iar criticul 7 l-a pus tot la [FARA_REFERINTA];
  2. în Chrome pe calculator, Ctrl+PageDown / PageUp le ia browserul (fila următoare). Asta o spun simulatorul lecției (`registru-foi.js:657`: „tastele … Ctrl+PageUp, Ctrl+PageDown … le ia browserul … De aceea le apeși din butoanele de mai sus”) și criticul 7. Eu n-am putut-o proba headless. Deci elevul de la calculator nici n-ar ajunge la ce face `excel.js`. Exercițiul :230 cere „(butonul de sub titlu)”, iar biblioteca n-are rândul de butoane „Tastele lui Excel”: aceea e o hotărâre de montare, nu de Excel;
  3. drumul principal din :197, „clic pe fila ei”, merge.
- Ce trebuie reparat oricum (la D): Ctrl+PageDown / PageUp → foaia următoare / anterioară, pe loc la capete, cu evenimentul lui. Scenariul e cel din `de_verificat.md › R25-7`.

### GRAV noi pe unghiul gest_tastatura (strict): niciunul
Tastele pe care le cer lecțiile Excel merg cu eveniment, stare și ecran: Enter / Tab, AltGr, tasta moartă, IME, Ctrl+Z pe 5 drumuri, Ctrl+C / X / V, Delete, Esc, Ctrl+U, Name Box. Ce diferă (Ctrl+PageDown, Ctrl+F1, Alt+PgDn, Alt+↓, PgDn din A1, Alt într-o fereastră) n-are referință sau nu e pe un drum din lecție (la D). G25-1 e GRAV, dar e un drum de mouse, găsit pe drumul Ctrl+Z.

## C. Regresul

- **Probele criticului 21, reluate întocmai pe codul de azi.** Le-am copiat în `critic_probe/reg/` (`c17_p1`, `c17_p2b`, `c17_p2c`, `c17_p6`, `pB`, `pB2`, `pB3`), cu ieșirile tot acolo. Le-am comparat frunză cu frunză cu `runde/21/critic_probe/*.json`: `reg/dif21.py` → `reg/dif21.txt`.

  | proba | ce acoperă | frunze diferite | care |
  |---|---|---:|---|
  | `p1` | X10: galeria Line, Add Chart Element, Data Labels la Line și coloane, Ctrl+Z / Y, tastele Alt, N, N, 1 … Alt, J, C, A, D, R, laboratorul m2-l11 | 15 din 1007 | toate = `poz.y` al graficului 81 → 82 (grila urcată cu 2 px, MINOR 5) |
  | `p2b` | A1 pe telefon: tragerea graficului, C5 = 30, titlul | 13 din 126 | −2 px (MINOR 5) și ținta `derulare:Line left` → `derulare:Column left` (MINOR 6) |
  | `p2c` | T1 pe telefon: literele (și IME) în titlu au ținta `grafic:1/titlu` | 73 din 106 → **2** | proba 21 apasă `derulare:Line right`, care după MINOR 6 se numește `Column right`. Cu numele vechi, clicul a lipsit, titlul a rămas în afara ecranului și atingerea pe el n-a nimerit. Reluată cu `Column right` (`reg/c17_p2c_col.py` → `p2c_col.json`): rămân doar cele 2 ținte redenumite; literele „C, ă, r, ț, i” → `grafic:1/titlu`, titlul „Cărți”, la fel ca la criticul 21 |
  | `p6` | ieșirea din fereastră + regresul pe telefon | 1 din 78 | A1 cu 2 px mai sus |
  | `pB` | aspectul la 1366×768 pe 12 suprafețe | 76 din 726 | `zona_document`: **63 / 70 la ±2 px** (erau 59), pentru că grila stă acum la 220 și bucățile barelor au nume. Rămân: Grid lat 1364 (sub bară), Page down / Page right (mărimea cursorilor, MINOR 3 nou la D). Home 82 / 88 (cele 6 casete, MINOR 4), Insert / Formulas / Data / bara de titlu / filele / bara de stare toate la ±2 px. Format Cells și Insert Function: cu 2 px mai sus, ca toată zona |
  | `pB2` | Format Cells (Number / Alignment / Font), graficele m2-l11 | 8 din 645 | Format Cells 30 / 30, 33 / 33, 57 / 57 la ±2 px față de colțul ferestrei; graficele 1 px |
  | `pB3` | laptop 125%, telefon 360 / 390, tabla SMART 1920×1080 | 76 din 728 | −2 px peste tot; numele noi ale barelor în lista zonelor mici. La 125%, după Ctrl+↓, ultimul rând e lipit jos și cel de sus e tăiat cu 17 px (`sus_gol` −17, înainte 0 + fâșia albă); asta e efectul MINOR 3, la [FARA_REFERINTA] 6. SMART: la fel ca la criticul 21 ([FARA_REFERINTA] 3 al lui) |

- **Probele vechi** (`reg/regres_critic.sh` → `reg/reg_sumar.txt`, cu `--iesire` în `reg/`): `21/proba_grav.py` (G17-1 / G17-2) **0**, `10/proba_grav.py` 0, `9/proba_grav.py` 0, `8/proba_grav.py` 0, `6/proba_excel.py` 0 picate.
- **O4 direct pe `scenarii/excel`** (`LH_IESIRE=critic_probe/iesiri`, `o4_excel.log`): **59 / 64 ok, 12 unități**, exact cifrele constructorului:
  - `excel-autocompletare-tab` și `excel-separator-virgula`: câte 1 diferență, celula citită încă în editare, iar realul e „__LIPSA__” (R25-2, protocolul Esc + Esc);
  - `excel-sortare-doua-niveluri`: 8 diferențe;
  - `tragere ×2`: fără real.
  - Niciun scenariu care trecea înainte nu pică.
- **Sortarea pe două niveluri — judecata cerută:** **simulatorul face ce cere pasul**, deci cele 8 diferențe vin din referința greșită, nu sunt GRAV.
  - Pașii scenariului: `camp:Order#2` › `meniu:Largest to Smallest`. Descrierea lui spune „Key2 = C descendent”, iar `acoperire_excel_r7.py:1113` cheamă `Order2=2` (xlDescending) și își scrie singur „Punctaj descendent”.
  - `scenarii_real/excel-sortare-doua-niveluri.json › stare.celule` are însă Punctaj **crescător** în fiecare clasă: VIII A 60, 88, 95; VIII B 60, 78, 95. Rezultatul real nu se potrivește nici cu propriul apel.
  - Simulatorul dă VIII A 95, 88, 60 și VIII B 95, 78, 60, adică „Largest to Smallest”.
  - Referința trebuie refăcută (R25-1). N-am pornit Excel real pentru asta: textul pasului e destul.
- **Codul comun:** banda a schimbat doar `excel.js` (`excel_js_acum.diff` = `inainte/excel.js` → disc = `excel_js_dupa.js`). Ce e nou în `aplicatii.js` (`aplicatii_js_cicluC.diff`) poartă semnăturile r23 (`keydown` în câmpuri), r24 (asistentul, `mutare_focus`) și r26 (tasta Windows). Deci regresul Word / PowerPoint / Explorer / Windows nu e cerut de banda Excel.
  - Efectul codului comun asupra Excel-ului, verificat:
    - Name Box merge (B5);
    - editarea din celulă (`TEXTAREA` cu `data-lh-intrare-document`, deci nu „câmp”) nu e atinsă: F2 / F4 / AltGr / tasta moartă merg;
    - Ctrl+; și Ctrl+1 tot fără eveniment (r26 n-a schimbat partea asta din `gestTasta`).
- **Regres găsit: niciunul.** Diferențele față de runda 21 sunt exact reparațiile rundei: −2 px (MINOR 5), numele barelor (MINOR 6), fereastra (R21-2, MINOR 1-3).

## D. [FARA_REFERINTA], MINOR, ce a trecut, predarea

### [FARA_REFERINTA] (nu le număr GRAV)
1. **Ctrl+PageDown / Ctrl+PageUp nu schimbă foaia niciodată** (R25-7 / R8-5, mai sus la B). Pe orice foaie, ele mută celula ±23 de rânduri.
2. **PgDn / PgUp** (R25-5):
   - din A1, PgDn → A24 jos, vederea rămâne la rândul 1; apoi pas constant 23;
   - din A2133 (celula jos), primul PgUp aduce celula sus fără să miște vederea (A2110, y 16), abia al doilea urcă vederea (`pA.json › 10`, `11`);
   - în Excel, PgDn / PgUp mută vederea cu un ecran și lasă celula în același loc pe ecran; nu e capturat.
3. **Alt+PgDn / Alt+PgUp = PgDn / PgUp** (A1 → A24, R25-6), **Alt+↓ coboară o celulă** (R25-8). Ctrl+A de două ori dă zona `A:XFD`, iar Name Box arată celula activă (B3), ca Excel (R25-9).
4. **Ctrl+F1 și dublul clic pe fila Home** (m2-l08:63, cardul „Dacă nu-ți iese: panglica e strânsă”):
   - `{tasta_f1, fara_efect}` și `{dublu_clic, fila:Home}`, iar panglica rămâne de 100 px (`pB2.json › B10_*`);
   - biblioteca nu strânge panglica niciodată, deci cardul lecției nu se poate repeta în ea;
   - în Excel, Ctrl+F1 pe panglica deschisă o strânge; starea strânsă nu e în referință.
5. **Ctrl+Y după anularea unei celule tastate:** valoarea revine în D1, dar celula activă devine D2 (`pB.json › B3_ctrl_y`, `pC.json › 4_ctrl_y`: E1 revine, activă E2). Unde rămâne selecția în Excel după Redo nu e capturat.
6. **AutoSum peste goluri:** pe coloana B cu B2 = 4 și B3:B6 goale, Alt+= în B7 dă `=SUM()`, iar Enter → `dialog.eroare_formula_3` (`pB.json › B6_*`). Ce zonă propune Excel peste goluri nu e capturat.
7. **Vederea la marginea foii:** la 1366×768 și la 125%, după Ctrl+↓ ultimul rând e lipit jos, iar rândul de sus e tăiat (−3 / −17 px). Cum aliniază Excel `ScrollRow` acolo nu e capturat (R21-1 / R25-10).
8. **Ctrl+PageDown pe desktop îl ia browserul:** biblioteca n-are butoanele „Tastele lui Excel” pe care le are `registru-foi.js` (Ctrl+N, Ctrl+S, F12, Ctrl+W, Ctrl+O, Ctrl+PageUp/Down, Ctrl+Z). Hotărârea e la montarea în lecții (Pentru orchestrator).

### MINOR
1. **Alt singur într-o fereastră nu emite nimic.** În Format Cells, Alt apăsat și eliberat → 0 evenimente (`pB3.json › B9_alt_in_dialog`). Cauza: `excel.js:3700` `if (dialog || backstage) return;` în `keyup`, iar `gestTasta` întoarce `null` pentru Alt. E o margine de §4 („un eveniment pe fiecare gest fizic”), veche și în afara lecțiilor. În Excel, Alt într-o fereastră subliniază literele de acces.
2. **Ctrl+Shift+↓ are acțiunea `mutare`, iar Shift+↓ are `extindere_selectie`** (constructorul): nume diferite pentru aceeași familie.
3. **Cursorii barelor sunt mai mici decât în referință** pe un registru gol: cel vertical are 286 px pe o pistă de 461, iar referința are Page down de la y 679, adică un cursor de ~440 px. Cel orizontal se termină la x 1235, față de 1305. Nu e de la runda 25: `pE.json` dă aceeași mărime cu `inainte/excel.js` (284 / 380 px); se vede în măsurare doar acum, pentru că bucățile pistei au nume (MINOR 6).
4. MINOR 4 (casetele combinate din Home +3 px) și MINOR 7 (zonele < 32 px pe telefon) ale criticului 21 rămân (cod comun). Grid are lățimea 1364, sub bara verticală, și nu se vede.

### Ce a trecut
- **G17-1 / G17-2** rămân închise. `21/proba_grav.py` dă 0, iar gesturile mele dau același lucru ca la criticul 21.
- **R21-2 + MINOR 1-3:**
  - rotița, cursorul barei și degetul trec de marginea ferestrei de 150 de rânduri, până la rândul 1, fără goluri, salturi sau stagnări;
  - ↑ derulează câte un rând peste margine, iar PgDn are pas constant 23;
  - fâșia de 16 px a dispărut;
  - clicul după bara trasă alege celula de sub mouse, fără salt;
  - tastarea după derulare aduce vederea la celulă;
  - orizontal, din XFD7, coloanele curg fără goluri.
- **MINOR 5-6:** grila la y 220, iar zona documentului are 63 / 70 noduri la ±2 px. Barele au numele din referință, iar țintele evenimentelor le urmează.
- **Tastele lecțiilor Excel** (tabelul de la B): Enter / Tab în și fără selecție, AltGr, tasta moartă, IME, Ctrl+Z pe 5 drumuri de lecție (inclusiv „dispar și data, și forma ei”), Ctrl+C / X / V / U, Delete, Esc, F2, F4, Alt+=, KeyTips, Name Box. Fiecare gest are un singur eveniment, cu ținta bună. Erori în pagină: 0.
- **Regresul:** X10, A1, T1, p6 și aspectul (12 suprafețe, Format Cells, Insert Function, laptop 125%, telefon 360 / 390, SMART) sunt la fel ca la criticul 21, în afara celor −2 px și a numelor noi. Probele 21 / 10 / 9 / 8 / 6 dau 0. O4 dă 59 / 64, fără niciun scenariu pierdut.

### Pentru orchestrator (cod comun / contract / referințe, nu banda Excel)
- **Ctrl+; și Ctrl+1 fără niciun eveniment** (§4): `aplicatii.js:278-281` (`gestTasta`) întoarce `null` pentru Ctrl + semn / cifră. Nu sunt în lecții. E la fel ca la criticii 7, 17 și 21.
- **Oarba lui O-comenzi moarte:** `oracol_comenzi_moarte.json` nu cuprinde `registru-foi` (viii/m1-l03), de aceea G25-1 n-a fost numărat 24 de runde. Merită adăugat înainte de convergență.
- **R25-1** (referința sortării, de refăcut în rundă `acoperire`) și **R25-2** (protocolul Esc + Esc în scenarii): confirmate prin citire, nu sunt ale benzii.
- **Montarea în lecții:** Ctrl+PageDown / PageUp, Ctrl+N / W și F12 le ia browserul. Biblioteca are nevoie de un rând de butoane-taste, ca `registru-foi.js`, sau lecțiile trebuie să ceară clicul.

### Predarea pentru runda următoare
1. **G25-1 întâi** (`excel.js:3305-3320`, `dialog.SheetMoveOrCopy`, `fila_foii`):
   - Delete pe filă: o foaie goală dispare direct; una cu date cere întâi confirmarea din captura lecției `confirma-stergerea.webp`, care nu e în `uia_excel.json`, deci trebuie capturată; singura foaie e refuzată cu mesajul lui Excel (de capturat);
   - Move or Copy cu lista foilor registrului, „(move to end)” și Create a copy → „Septembrie (2)”;
   - tragerea filei mută foaia, iar Ctrl + tragere o copiază;
   - Tab Color › Standard Colors;
   - Ctrl+Z nu aduce foaia înapoi (m1-l03:239).
   - Proba: `pD.py` + `pC.py › 7`.
2. **Ctrl+PageDown / PageUp** → foaia vecină, pe loc la capete (scenariul R25-7). Reparația e de o linie lângă `excel.js:3517`.
3. **Referințe de capturat** (rundă `acoperire`):
   - fereastra de confirmare a ștergerii foii, refuzul la singura foaie, paleta Tab Color, Move or Copy cu 4 foi;
   - Ctrl+PageDown ×6 pe 4 foi și pe 1 foaie;
   - `ScrollRow` după PgDn / PgUp și după Ctrl+↓ (R25-5, R25-10);
   - Alt într-o fereastră;
   - AutoSum peste goluri;
   - panglica strânsă (Ctrl+F1);
   - sortarea pe două niveluri refăcută (R25-1).
4. MINOR 1 (Alt în fereastră → `arata_taste_acces`, ca în afara ferestrei) e o linie la `excel.js:3700`.

GRAV_VECHI_DESCHISE: 0
GRAV: 1
