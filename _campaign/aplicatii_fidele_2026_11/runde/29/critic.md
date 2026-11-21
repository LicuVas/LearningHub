# Criticul rece, runda 29 (B-excel#3, ciclul D): G25-1 + unghiul STARE_FINALA_ERORI + regresul

**Cine:** critic rece al benzii Excel. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/29/critic_prompt.md` (și secțiunea „Ce spune constructorul”, completată după pornirea mea), `gata_pentru_critic.md`, `diferente.md`, `raport_constructor.md`, `runde/25/critic.md`. Afirmațiile constructorului le-am judecat cu gesturile mele; probele lui nu le-am rulat (am citit doar `proba/k2_*.txt`).

**Cum am probat** (totul în `runde/29/critic_probe/`):
- Hamul `hc.py`, copiat din `runde/25/critic_probe/hc.py` (doar calea schimbată): server static legat de `127.0.0.1`, port liber, oprit la final; Playwright Chromium **headless**, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost. Gesturi reale: `page.mouse`, `page.keyboard`, atingeri prin CDP (`Input.dispatchTouchEvent`).
- Variantele de cod le-am servit **prin rută**, fără să ating discul: `aplicatii.js` de la pornirea ciclului (`git show 24fd4eb5`, = `runde/28/inainte` = `runde/30/inainte`, același md5) și `runde/29/inainte/excel.js`.
- Excel real: o singură instanță nouă, invizibilă (`DispatchEx`, `DisplayAlerts=0`, PID-ul meu 10704, închis la final; EXCEL 11152 neatins, verificat cu `tasklist` înainte și după), fără niciun fișier salvat: `excel_real.py` → `excel_real.json`. PowerPoint nu l-am pornit.
- Codul măsurat: `aplicatii/excel.js` md5 `0bba7dc0…` = `runde/29/excel_js_dupa.js` (neschimbat între 07:48 și 08:06); `aplicatii/aplicatii.js` md5 `cf18b57d…` (neschimbat între 07:46 și 08:06; conține schimbările r28 și r30, nu ale rundei 29). `panglica.js`, `aplicatii.css` = copiile din `runde/28/inainte/` (același md5).
- Fără ecranul omului, fără git care scrie, fără `masoara.py` / `porti.py`. O4 rulat direct, cu `LH_IESIRE=critic_probe/iesiri`. Erori în pagină: 0 în toate probele.

## A. GRAV-urile vechi

### G25-1 (foile din viii/m1-l03): **ÎNCHIS** pe calculator (`pA.py` → `pA.json`, `pA_rez.txt`, capturile `pA_*.png`)
Am jucat gesturile criticului 25 (`25/critic.md:70-77`) pe registrul din `incearca` m1-l03:247-248 (Septembrie, Ciornă cu „de șters”, Noiembrie, Octombrie; Ciornă activă), apoi exercițiile lecției:

| drumul | ce a ieșit (stare = ecran) | evenimentul |
|---|---|---|
| :247 clic dreapta pe Ciornă › Delete | întrebarea „Microsoft Excel will permanently delete this sheet. / Do you want to continue?”, Delete cu focusul, Cancel; `dialog` și `fereastra_mesaj` în stare; foile rămân 4 | `{clic, intrebare_stergere, meniu:Delete}` |
| … Esc | fereastra se închide, Ciornă rămâne, `dialog` null | `{tasta_esc, anulare, fereastra:Delete}` |
| … din nou Delete, apoi Enter | Ciornă dispare; filele de pe ecran = `foi` = Septembrie, Noiembrie, Octombrie; activă Noiembrie | `{tasta_enter, stergere_foaie, fereastra:Delete, activat:fereastra:Delete}` |
| Ctrl+Z după ștergere (:239, :312) | foaia NU revine | `{ctrl_z, fara_efect}` |
| Octombrie › Move or Copy... › Noiembrie › OK | lista = foile registrului + „(move to end)”; după OK: Septembrie, Octombrie, Noiembrie (testele :249 trec) | `alegere`, apoi `{clic, mutare_foaie, fereastra:OK}` |
| Home › Delete ▾ › Delete Sheet, apoi clic pe Delete | aceeași întrebare, apoi foaia dispare | `{clic, intrebare_stergere, meniu:Delete Sheet}`, `{clic, stergere_foaie, fereastra:Delete}` |
| fila Octombrie trasă pe jumătatea stângă a filei Noiembrie | Septembrie, Octombrie, Noiembrie, Octombrie activă | UN eveniment `{tragere, mutare_foaie, fila_foii:Octombrie}` |
| :255 Septembrie › Move or Copy › (move to end) › Create a copy › OK, apoi dublu clic pe copie › „Decembrie” | „Septembrie (2)” la sfârșit, activă, A2 = Ana; apoi Septembrie, Octombrie, Noiembrie, Decembrie | `bifare`, `copiere_foaie`, `redenumire_foaie` |
| :220 Octombrie › Tab Color › Green | `culori_file {Octombrie: #00B050}`; activă: albă cu dunga verde; neactivă: plină de verde (rgb 0,176,80), ca `file-colorate.webp` | `submeniu`, `{clic, culoare_fila, meniu:Green}` |
| :266 singura foaie › Delete (și Home › Delete ▾ › Delete Sheet) | fereastra de refuz „A workbook must contain at least one visible worksheet…” (OK); Enter / ✕ o închid; foaia rămâne | `refuz_stergere`, `inchidere` / `anulare` |
| :321 Sheet2 goală › Delete | dispare fără întrebare | `{clic, stergere_foaie, meniu:Delete}` |
| atelierul :288 | Ciornă ștearsă (cu întrebarea), „Runda 1 (2)” înaintea lui Runda 3, redenumită Runda 2 (B2 = Ana), Runda 3 roșie `#FF0000`; testele lecției trec | câte unul pe gest |
| :306 Marți trasă înaintea lui Miercuri; Luni › Yellow | Luni, Marți, Miercuri; `{Luni: #FFFF00}` | `mutare_foaie`, `culoare_fila` |
| vecine: Ctrl + tragere la sfârșit; Move or Copy › Cancel; Delete pe o filă neactivă (clic dreapta o activează); Tab Color › No Color; Ctrl+PageDown ×6 / Ctrl+PageUp ×4 (`pK.json`) | copia „Septembrie (2)”; nimic schimbat; se șterge fila apăsată; culoarea dispare; Octombrie → Decembrie, apoi pe loc (`fara_efect` ×3), înapoi până la Septembrie, apoi pe loc; fiecare foaie își păstrează celula activă | câte unul pe gest |

- **Textele, față de Excel real** (`excel_real.json`, instanța mea invizibilă, build 20326): refuzul la singura foaie are exact textul lui Excel („A workbook must contain at least one visible worksheet. … you must first insert a new sheet or unhide a sheet that is already hidden.”); „That name is already taken. Try a different one.” e exact textul lui Excel, și pentru „septembrie” lângă „Septembrie”. Deci R29-2 și textul din R29-7 sunt confirmate de Excel real (prin COM, nu fereastra din interfață).
- **Fereastra de confirmare, față de `confirma-stergerea.webp`:** textul pe două rânduri, triunghiul, Delete / Cancel jos-dreapta, mărimea (456×214 față de 469×229 în captură) se potrivesc. Diferă culorile și bara de sus (la MINOR 1): fond gri, nu alb; „Microsoft Excel” scris și în bara de titlu (captura o are goală, D15 al constructorului); Delete are doar rama focusului, nu e butonul verde plin. Nu blochează și nu induce în eroare.
- **Telefonul** nu intră în închidere: pe 360-390 px filele 2-4 nu se pot atinge deloc (GRAV nou G29-2, la B). Nu e o greșeală a hamului, cum scrie constructorul („hamul nu nimerește fila”): fila e ascunsă.

### G17-1, G17-2, R21-2 (eșantion): **rămân ÎNCHISE**
- `21/proba_grav.py` (G17-1 / G17-2) → 0 picate (`reg/21_proba_grav.py.log`); `25/proba_grav.py` → 0.
- Proba criticului 25 (`25/critic_probe/pA.py`: Ctrl+↓ până la capăt, degetul pe grilă, rotița / cursorul barei / ↑ / PgDn peste marginea ferestrei de 150 de rânduri), rejucată întocmai (`c25_pA.py` → `c25_pA.json`): **441 de frunze, 0 diferite** față de `25/critic_probe/pA.json` (`c25_pA_dif.txt`).

## B. Unghiul STARE_FINALA_ERORI pe Excel (`pS.py` → `pS.json`, `pS_rez.txt`; `pR.py` → `pR.json`; `pT*.py`)

### Ce merge (stare = ecran, eveniment, unde e cazul referința)
| greșeala | ce a ieșit |
|---|---|
| foaia ștearsă din greșeală + Ctrl+Z | foaia nu revine (`fara_efect`), ca m1-l03:239; o tastare nouă după ștergere se anulează normal (B5 = 7 → gol) |
| „=SUMM(A1:A3)” + Enter; „=SUMA(A1:A3)” (m2-l08:132) | `#NAME?` în stare și pe ecran; Ctrl+Z → celula goală |
| „=SUM(A1” + Esc | celula rămâne goală, ieșit din editare (`tasta_esc, anulare`) |
| „=SUM(A1:A3)A1” + Enter | fereastra din referință `dialog.eroare_formula` („We found a typo…”, cu formula elevului `=SUM(A1:A3)*A1`), Enter = Yes → 60 |
| Delete (tasta) pe rândul 2 întreg + Ctrl+Z | rândul se golește, apoi revine (A2 Ana, B2 9), zona `2:2` rămâne aleasă |
| lipirea A1:A3 peste B1:B3 + Ctrl+Z | B = 1, 2, 3, apoi 10, 20, 30 la loc |
| sortarea doar a coloanei B dintr-un tabel | `dialog.SortWarning` din referință; Enter (Expand) sortează tot tabelul (Ion 5, Dan 7, Ana 9); Ctrl+Z îl pune la loc |
| redenumirea Noiembrie → „septembrie” (m1-l03:226) | fereastra „That name is already taken…” (textul lui Excel real), `{tasta_enter, nume_existent}`; Enter / OK → fila e iar în redenumire, cu textul ales; Esc → Noiembrie; tastarea următoare intră în grilă |

### GRAV G29-1 (nou; codul e vechi): drumul m1-l04 „Scoți un rând sau o coloană” nu se poate face în bibliotecă (`pR.py` → `pR.json`)
- **Gesturile** (lecția viii/m1-l04, pasul 8, :581-597; tabelul NOTE din `incearca` :587):
  1. clic dreapta pe numărul rândului 3 › Delete (:581, :587);
  2. clic dreapta pe litera B › Delete (:582, :593);
  3. „pe telefon, fără meniu”: clic pe numărul rândului 3, apoi pictograma Delete din Home › Cells (:583);
  4. rândul 3 ales › Home › Delete ▾ › Delete Sheet Rows (lista adusă de runda 29);
  5. capcana :594: clic dreapta pe C3 › Delete... › Shift cells up › OK.
- **Ce face simulatorul:** la toate cinci, mesajul central „În aplicația reală, „Delete” funcționează; aici nu e simulată.” (la 3: „Delete Cells...”, la 4: „Delete Sheet Rows”), cu `{…, nesimulat, …}`. Tabelul rămâne neschimbat (A3 = Bogdan, A6 = Elena, B1 = Nota).
- **Ce cere lecția și ce face aplicația reală:** :581 „Clic dreapta pe numărul rândului › Ștergere (Delete): rândul dispare, iar rândurile de dedesubt urcă cu unul”; :582 „Coloanele din dreapta ei vin spre stânga”; :597 „„Ștergere…” scoate celula C3 și urcă celulele de sub ea”. În referință comenzile există: `meniu_contextual.antet_rand` / `antet_coloana` › „Delete”, Home › Cells › SplitButton „Delete”, `dialog.CellsDelete` (cu OK).
- **De ce e GRAV:** aceeași scară ca G25-1 și X5 / X8: o comandă de pe drumul lecției care dă doar mesajul central (R12: „Orice comandă folosită de o lecție… funcționează”). Elevul nu poate face exercițiile :587, :591, :594. E exact greșeala tipică a unghiului („Delete pe un rând întreg”): tasta Delete golește corect rândul, dar scoaterea lui, pe care lecția o deosebește explicit de golire (:581 „trebuie scos din tabel, nu doar golit”; capcana :584), lipsește.
- **Cauza în cod:** `aplicatii/excel.js:3625` (`return I.nesimulat(v)` pentru „Delete” din meniurile antetelor), `:3600` (Delete Sheet Rows / Columns din lista nouă), apăsarea pictogramei Delete (`apasa`, ramura implicită `:2999` `return I.nesimulat(nume)`, cu numele „Delete Cells...”), `implicitDialog` `:2907-2909` (OK în `dialog.CellsDelete` → mesajul central).
- **Nu e adus de runda 29:** pe `runde/29/inainte/excel.js` (servit prin rută) gesturile 1, 2, 3, 5 dau același mesaj (`pR.json › inainte_r29`); la 4 lista nu exista. Runda 29 a adăugat rândurile „Delete Sheet Rows / Columns” fără efect (D5 din `diferente.md` o spune).

### GRAV G29-2 (nou; codul e vechi): pe telefon (360-390 px) se poate atinge doar prima filă; nici „+” nu se poate apăsa (`pT2.py` → `pT2.json`, `pT3.py` → `pT3.json`, `pT_file_telefon_crop.png`)
- **Gesturile:** registrul m1-l03:247 (4 foi) la 375×667, 360×740, 390×844; atingere pe Ciornă; atingere pe butoanele < > de lângă file; degetul tras pe șirul filelor. Apoi m1-l03:206 (o foaie): atingere pe + (New sheet).
- **Ce face simulatorul:**
  - șirul filelor are 260 px și `overflow: hidden`; peste Ciornă (x 240-322) stă despărțitorul (`lh-ap-x-desp`, x 262), iar Noiembrie (323) și Octombrie (441) sunt în afara lui (la 390 px, Noiembrie e sub `lh-ap-x-banda`). Pe ecran se vede doar Septembrie;
  - atingerea pe Ciornă → `{clic, clic, fereastra_app:excel}`, foaia activă rămâne Septembrie; degetul ținut 900 ms nu deschide meniul filei;
  - butoanele Scroll Left / Scroll Right sunt gri (`aria-disabled="true"`) și dau `{clic, indisponibil}`; degetul tras pe file nu mișcă nimic (0 evenimente);
  - cu o singură foaie, + stă la x 271-303, sub despărțitor: atingerea lui nimerește bara orizontală, `{clic, derulare, derulare:Column left}`, și nu face foaia nouă.
  - Pe calculator (1366 și laptop 125 %), toate cele 4 file se văd și se ating (`pT2.json › desktop1366`, `laptop125`).
- **Ce cere lecția:** m1-l03 e scrisă și pentru telefon: :202 „clic dreapta pe filă (… pe telefon ții degetul apăsat)”, :211 „Dublu clic pe fila nouă (pe telefon, atingi fila de două ori repede)”, :225, :252. Contractul I1: „biblioteca merge la 360-390 px”.
- **De ce e GRAV:** încalcă I1 pe drumul lecției: pe telefon elevul nu poate face nici primul exercițiu al pasului 4 (:206, foaie nouă cu +), nici :220, :247, :255, :306, :321, atelierul :288. Butoanele < > există în desen, dar sunt moarte, iar ce e în spatele despărțitorului nu se poate aduce în ecran.
- **Cauza în cod:** `aplicatii/excel.js:873-877` (`aseazaBanda`: filele primesc cel mult 260 px pe ecrane înguste, fără derulare), `aplicatii.css:306` (`.lh-ap-x-file-foi{overflow:hidden}`), `excel.js:1416` (Scroll Left / Right desenate gri, din captura cu o singură foaie, unde nu era nimic de derulat). Filele sunt și mai late pe telefon (Septembrie 126 px, față de 85).
- **Nu e adus de runda 29:** pe `inainte/excel.js` măsurătorile sunt identice (`pT2.json › tel375_inainte`). L-a ascuns G25-1: până acum nimic din drumul foilor nu mergea nici pe calculator.

### Ce n-am putut dovedi pe telefon
Meniul filei la degetul ținut (prin CDP nu vine `contextmenu`, nici pe prima filă). Prin clic dreapta (cum îl dă Chrome pe Android) meniul se deschide pe prima filă; refuzul la singura foaie (371×165) și, pe calculator, întrebarea, Move or Copy și paleta încap întregi (la 1920×1080 toate trei `intreaga: true`, `pT.json › smart`).

## C. Regresul

- **Probele vechi** (`reg/regres_critic.sh` → `reg/reg_sumar.txt`, cu `--iesire` în `reg/`, 07:56-08:01): `21/proba_grav.py` **0**, `25/proba_grav.py` **0**, `8/proba_grav.py` **1** (K2, mai jos).
- **Probele criticului 25 rejucate întocmai** (`reg/c17_p1`, `c17_p2b`, `c17_p2c_col`, `c17_p6`, `pB`, `pB3`), comparate frunză cu frunză cu ieșirile lui (`reg/dif25.py` → `reg/dif25.txt`):

  | proba | ce acoperă | frunze | diferite |
  |---|---|---:|---:|
  | `p1` | X10: galeria Line, Add Chart Element, Data Labels, Ctrl+Z / Y, KeyTips, laboratorul m2-l11 | 1007 | **0** |
  | `p2b` | A1 pe telefon: tragerea graficului, C5 = 30, titlul | 126 | **0** |
  | `p2c_col` | T1 pe telefon: literele (și IME) în titlul graficului | 96 | **0** |
  | `p6` | ieșirea din fereastră + telefonul | 78 | **0** |
  | `pB` | aspectul la 1366×768 pe 12 suprafețe (grila, Home, bara de formule, filele foilor, bara de stare, Insert, Formulas, Data, Format Cells, Insert Function) | 702 | **0**; `pB_rez.txt` 98 / 98 rânduri identice |
  | `pB3` | laptop 125 %, telefon 360 / 390, tabla SMART 1920×1080 | 728 | **0** |

  Deci „Ce a trecut” al criticului 25 (X10, A1, T1, aspectul, telefonul, SMART) e neschimbat. Filele noi (culoarea, `stilFila`) nu mută nimic pe un registru fără culori.
- **O4 direct pe `scenarii/excel`** (`o4_excel.log`, 07:48, codul de mai sus): **64 / 66 la fel ca aplicația reală, 0 diferențe, 0 chei necitite, 0 ecran ≠ stare**; cele 2 = `excel-tragere-umplere-gest` și `excel-tragere-zona`, fără rezultat real probat (ca la constructor). Niciun scenariu pierdut.
- **Regresul din proba 8 (K2: „asistentul §6.3: doi pași „fereastra:OK” făcuți cu Enter → pas() = 2”, pică cu `{"pas": 1}`) vine din banda r28, nu din r29 și nu din r30** (`k2.py` → `k2.json`). Același gest, pe patru variante de `aplicatii.js` servite prin rută:

  | `aplicatii.js` | pas după Enter în Sort cu „Sort by” gol |
  |---|---:|
  | de pe disc (r28 + r30) | **1** (indiciul „Apasă OK” apare) |
  | de la pornirea ciclului (`24fd4eb5`) | 2 |
  | de pe disc, fără `!refuz &&` (doar condiția r28 scoasă; r30 rămâne) | 2 |
  | de pe disc, cu `REFUZ` fără `'eroare_sortare'` | 2 |
  | de pe disc, controlul: Sort CU coloana „Punctaj”, Enter | 2 (`sortare`, `activat: fereastra:OK`) |

  - Al doilea Enter din K2 apasă OK într-un Sort fără coloană: Excel refuză („All sort criteria must have a column specified”), iar evenimentul e `{tasta_enter, eroare_sortare, fereastra:OK, activat:fereastra:OK}`. Regula nouă a r28 (`aplicatii.js:664` `const REFUZ = new Set(['nesimulat', 'nume_interzis', 'eroare_sortare'])`, `:715`, `:717` `bun = !doarFocus && !refuz && (…)`) spune că un refuz nu face pasul.
  - `excel.js` nu contează: constructorul a arătat același rezultat cu `excel.js` de la pornire (`proba/k2_*.txt`), iar eu am arătat că, pe același `excel.js`, doar condiția r28 schimbă rezultatul. Partea de bază a lui K2 (Enter → `activat` face pasul) merge: primul pas trece, iar Enter într-un Sort care sortează face pasul 2.
  - Regula r28 e propusă în `runde/28/api_propunere.md`, dar **nu e în `api_biblioteca.md`** (0 apariții „refuz”). §6.3 înghețat spune încă „Pasul curent e făcut când vine un eveniment … cu `activat` = ținta canonică a pasului”. Iar r28 n-a rulat `8/proba_grav.py` (`runde/28/regres.sh` rulează doar `28/proba_grav.py`).
  - Ce e de hotărât (orchestratorul): aprobi propunerea r28 și schimbi K2 din proba 8 (al doilea pas pe un Enter care nu e refuzat), sau scoți `eroare_sortare` din `REFUZ`. Pentru Excel nu e GRAV: după regula r28, comportamentul e cel cerut.
- **Codul comun:** runda 29 a schimbat doar `excel.js`. `aplicatii.js` diferă de pornirea ciclului doar prin r28 (asistentul) și r30 (`I.emite` + `extra`, `L.deschideSuprafata(cheie, ceruta)`, tasta Windows, `pointerdown` într-o aplicație montată în alta). Efectul lor asupra Excel-ului: K2 de mai sus (r28). Clicurile, tragerile, meniurile și tastele din probele mele merg, deci schimbarea r30 din `pointerdown` nu atinge Excel-ul (07:46-08:06). Regresul Word / PowerPoint / Explorer / Windows nu e cerut de banda Excel.

## D. [FARA_REFERINTA], MINOR, ce a trecut, predarea

### [FARA_REFERINTA] (nu le număr GRAV)
1. **„=SUM(A1:A3” + Enter** → rămâne în editare, iar mesajul central spune „În aplicația reală apare o fereastră de eroare (aici nu e simulată)” (`pS.json › S3/5`, `excel.js:1630`). **Lecția spune altceva:** m2-l08:108 „Dacă uiți paranteza de la sfârșit, Excel o pune singur la Enter.” Mesajul bibliotecii îl contrazice pe elev. Nu e în referința înghețată (R29-8); `surse_microsoft.md` nu spune nimic despre paranteze. De capturat primul.
2. **„=A1+” + Enter** → același mesaj central. În Excel apare o fereastră de eroare, dar textul ei nu e capturat.
3. **Numele foii gol, cu „:” sau prea lung:** gol și „Nov:26” revin tăcut la numele vechi; 35 de litere sunt tăiate la 31 (`pS.json › S2`). Excel real, prin COM (proprietatea Name): „You typed an invalid name for a sheet or chart. Make sure that: … does not exceed 31 characters … does not contain … : \ / ? * [ or ] … did not leave the name blank.”, iar „History” → „History is a reserved name.” (`excel_real.json`). Ce arată interfața la redenumirea pe filă nu e capturat (R29-7); regulile sunt în lecție (:201).
4. **Move or Copy:** rândul ales la deschidere = foaia activă (R29-4).
5. **Ctrl+Z după Tab Color:** culoarea dispare, dar foaia activă trece înapoi pe foaia colorată (`pA.json › A220_culoare/5`).
6. **Delete pe filă în timpul editării unei celule:** textul tastat („abc” în C1) intră în celulă, apoi vine întrebarea (`pA.json › vecine/7`). În Excel, în modul Edit, meniul filei nu e capturat.
7. **Golirea istoricului la mutare și copiere** (R29-3) și **paleta Tab Color** (R29-5): în paletă se văd „High-contrast only”, pătrățelele, „No Color”, „More Colors...”, dar nu și titlurile „Theme Colors” / „Standard Colors”. Grupurile cu aceste nume sunt în `lista.CellFillColorPicker` din referință, dar biblioteca le desenează goale. Ajutorul :225 îl trimite pe elev la „rândul Standard Colors”; verdele bun are totuși eticheta „Green” la trecerea mouse-ului.

### MINOR
1. **Fereastra de ștergere față de `confirma-stergerea.webp`:** fond gri, nu alb; „Microsoft Excel” și în bara de titlu (D15); Delete nu e butonul verde plin al capturii (`pA_1_intrebare.png`). Rama e comună ferestrelor „Microsoft Excel” desenate de bibliotecă.
2. **`nume_existent` nu e în `REFUZ` al r28** (`aplicatii.js:664`), deși intenția r28 e „„… already exists” … nu face pasul”. Efect mic azi: ținta Enter-ului din redenumire e fila (`fila_foii:Noiembrie`), pe care o bifează oricum clicurile dinainte (`pS.json › S1/7`). E de aliniat între benzi.
3. **Move or Copy** la 1366×768 depășește cu 1 px marginea de jos a aplicației (r = 1007, 366, 320, 403). Locul vine din referință; la 1920×1080 e întreagă.
4. MINOR 2-4 ale criticului 25 și 4, 7 ale criticului 21 rămân (neatinse, cod comun sau sub prag).

### Ce a trecut
- **G25-1 pe calculator:** ștergerea (cu întrebare, fără, refuzul), Ctrl+Z fără efect, Home › Delete ▾ › Delete Sheet, Move or Copy cu lista foilor și Create a copy, tragerea (și cu Ctrl), Tab Color, No Color, atelierul :288, :306, :321. Fiecare gest dă un eveniment, iar filele de pe ecran = `foi` / `foaie_activa` / `culori_file`.
- **Ctrl+PageDown / PageUp (R25-7):** foaia vecină, pe loc la capete. **MINOR 1 al criticului 25:** Alt în Format Cells și în întrebare → `arata_taste_acces`; Alt+D în întrebare = Delete.
- **Unghiul:** #NAME?, Esc, „We found a typo”, Delete + Ctrl+Z pe rând, lipirea + Ctrl+Z, Sort Warning + Ctrl+Z, numele luat (textul lui Excel real).
- **Regresul:** G17-1 / G17-2 / R21-2 identice cu criticul 25; X10, A1, T1, aspectul, telefonul și SMART cu 0 frunze diferite; probele 21 / 25 dau 0; O4 64 / 66, 0 diferențe.

### Pentru orchestrator (cod comun / contract, nu banda Excel)
- **K2 din proba 8 = regula r28** (`aplicatii.js:664`, `:715`, `:717`), dovedită mai sus. Hotărârea: aprobi `runde/28/api_propunere.md` și schimbi `8/proba_grav.py` › K2, sau scoți `eroare_sortare` din `REFUZ`. Probele vechi ale altor aplicații ar trebui rulate la orice schimbare în `L.asistent`.
- **Esc pe o fereastră bifează pasul butonului care are focusul** (`pR.json › esc_focus`): pas `fereastra:Delete`, întrebarea ștergerii, Esc (= Cancel, foaia rămâne) → `{tasta_esc, anulare, fereastra:Delete}` și **pas 1**. La fel în Sort (vechi): Esc cu focusul pe OK → `fereastra:OK`, pas 1. E litera §4 („la taste: ținta focusului”) + §6.3, dar contrazice scopul lor, la fel ca Tab-ul reparat în runda 24 (`mutare_focus`). Propunerea: `anulare` (sau `tasta_esc` fără `activat`) nu face pasul.
- **Oarba oracolelor:** O-comenzile moarte n-au prins nici m1-l04 › pasul 8 (G29-1), iar `oracol_controale_taiate.py` nu vede filele ascunse în șirul cu `overflow: hidden` (G29-2).

### Predarea pentru runda următoare
1. **G29-2 întâi** (telefonul, I1): Scroll Left / Right vii când filele nu încap (derulează șirul, ca în Excel); fila activă adusă în ecran; + mereu atingibil (sau șirul filelor mai lat pe telefon, cu despărțitorul mai la dreapta). Proba: `pT2.py`, `pT3.py`, apoi m1-l03:206 și :247 cu atingeri.
2. **G29-1** (m1-l04 pasul 8): Delete din meniurile antetelor (rândurile de dedesubt urcă / coloanele vin spre stânga), pictograma Delete din Home › Cells pe rând / coloană aleasă, Delete Sheet Rows / Columns, `dialog.CellsDelete` › OK (Shift cells up / left, Entire row / column), cu Ctrl+Z. Proba: `pR.py` + testele `verifica` din m1-l04:588, :592, :596.
3. **Referințe de capturat** (rundă `acoperire`): „=SUM(A1:A3” + Enter și „=A1+” + Enter (R29-8); redenumirea pe filă cu nume gol / „:” / 32 de litere (R29-7); întrebarea ștergerii și refuzul în interfață (culorile, R29-1/2); Move or Copy la deschidere (R29-4); paleta Tab Color (R29-5); Undo după Tab Color; filele pe o fereastră îngustă (butoanele < >).
4. MINOR 1 (fondul alb, bara de titlu goală, Delete verde) odată cu rama comună (D15).

GRAV_VECHI_DESCHISE: 0
GRAV: 2
