# Runda 7 · etapa B · Excel · unghiul gest_tastatura — raportul constructorului (pașii 1-7, PREDARE după 6 din 10 GRAV)

## Numerele (`masurare_pornire.json` → `masurare.json`; lacătul reperelor ok la ambele)
| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți | suma |
|---|---|---|---|---|---|---|---|---|---|---|---|
| înainte | 61 | 13392 | 20337 | 43 | 113 | 0 | 353 | 102 | 34 | 41 (cum_fac) | 34476 |
| după | 61 | 13392 | 20337 | 43 | 113 | 0 | 353 | 102 | 34 | 41 (cum_fac) | 34476 |
Regres: niciunul („n cu n pe O1-O9 și pe fiecare poartă”, `masurare_dupa.log`). Oracolele nu se mișcă: O2/O3/O7/O8
citesc lecțiile, care încarcă încă simulatoarele vechi (etapa C); O4 Excel rămâne 36/41 la fel ca realul (aceleași 5
„RĂU” vechi: 4 fără real + `excel-salvare-ca`), O5 113, O9 34.
Proba GRAV-urilor (`proba_grav.py`, gesturi reale): **44/57 picate înainte** (copia neatinsă) → **0/57 după** (worktree).

## FĂCUT (cu dovada)
- **X9 telefon / tastatura care compune**: `excel.js` oprește `mousedown` pe grilă/panglică (ca `word.js:2074`), clicul pe
  celulă readuce focusul; la ≤ 480 px grila e de 1,7 ori mai mare (celula 108,8×32,3 px), pe calculator rămâne 64×19.
  Proba: atingere + `Input.insertText "7,5"` → D3 = 7,5; compunerea „Ana” → D4; pe calculator „Mădălina”, „ș”+„i” = „și”;
  fără selecția albastră la tragere (12/12).
- **X5 Σ**: zona propusă e ALEASĂ (`M.edit.ales`, `.lh-ap-x-ed-sel`) și încadrată punctat (`.lh-ap-x-propus`); tastarea,
  Backspace, clicul și tragerea o înlocuiesc. Proba: Σ pe B8 → „B2:B7” ales, chenar 64×114 dashed; „B2:B6” + Enter → 40;
  Σ + tragere B2→B4 + Enter → 24; Σ + Enter → primit (9/9).
- **X6 #NAME?**: numele de funcții acceptă diacritice; `=DACĂ(B3<9;10;20)` → `#NAME?`, `=dacă(…)` → `=DACĂ(…)` (ca
  `com_r6b.json`); formula respinsă de Excel nu mai blochează tăcut: mesajul central „Excel nu primește formula…” (8/8).
- **X1 numerele**: `inLatime()` — rotunjire, apoi notație științifică, apoi „#”, după lățimea coloanei (calibrat pe
  `com_r6.json`); `stare().text` = ecranul; numărul TASTAT lățește coloana (`excel-zero-in-fata`), formula nu. Proba: 12
  valori reale identice în stare și pe ecran, fără cifră tăiată + „741234567” + „=25/3” (15/15).
- **X2 textul lung**: trece peste vecinele goale, se oprește la prima plină (`flex-shrink:0`) (4/4).
- **X7 (parțial) lățimea coloanei**: linia dintre litere cu ↔, tragerea (+40 px → C = 104, Ctrl+Z o întoarce, coloana D
  nu se mai selectează), dublul clic potrivește, Column Width… arată „8,11” și pune „20” (C = 150 px) (9/9).
- Regres: `runde/6/proba_excel.py` 0/20; Word `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`,
  `2/proba_grav` = 0 (`regres_*.log`); `word2007_j2` = 0 în porți. `word.js`, `aplicatii.js`, `panglica.js` neatinse.
- Notele: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D14), `de_verificat.md › RUNDA7-EXCEL` (R7-1 … R7-7),
  `gata_pentru_critic.md`, `stare_autor.md`.

## Fișierele schimbate (necomise)
`aplicatii/excel.js` (+247 / −39 cu CSS-ul), `aplicatii/aplicatii.css` (bloc nou la capăt, doar clase `lh-ap-x-*` / `.lh-ap-excel`).
Stare nouă: `latimi_coloane`; conținut nou opțional: `latimi: {C: 90}`.

## NEFĂCUT (cu deblocatorul)
- X7 rest: Fill Color, Borders ▾ › All Borders, Percent Style, Wrap Text (Wrap cere înălțimi de rând variabile) — constructorul următor.
- X10 (Sort cu niveluri, grafice), X8 (Ctrl+N/W, redenumirea pe filă, panoul Save As), X3 (pictogramele Acces rapid),
  X4 (banda de sub foaie) — neîncepute; ordinea din supliment rămâne.
- Lista ▾ a lui Σ (Average): fără referință → R7-1 (o captură UI Automation într-o rundă `acoperire`).

## NESIGUR
- [NEVERIFICAT] fereastra de eroare a formulei (R7-2), cât lățește Excel coloana la numere tastate (R7-3), pragul
  notației științifice sub 0,0001 (R7-4), clic dreapta pe literă alege coloana (R7-5), lățimea exactă la potrivire (R7-6),
  modul din bara de stare după Σ (R7-7).
- Regula „ce încape” e calibrată pe 12 puncte COM la două lățimi; în afara lor e interpolare.
- Pe telefon, deschiderea tastaturii virtuale reale (nu CDP) nu e probată pe un dispozitiv.

---
## Continuarea (constructorul 2) — X7 rest, apoi PREDARE

### Numerele
- Măsurarea: pornirea = `masurare_pornire_cont.json` (copia lui `masurare.json` de la 06:01, suma 34476) → după = `masurare_dupa_cont.log`:
  O1 61→61, O2 13392→13392, O3 20337→20337, O4 43→43, O5 113→113, O6 0→0, O7 353→353, O8 102→102, O9 34→34, porți 41→41
  (doar cum_fac); suma 34476→34476; lacătul reperelor ok; neconcludente 0; „regres: niciunul”. Oracolele nu se mișcă: lecțiile
  încarcă încă simulatoarele vechi (etapa C), iar O4/O5/O9 nu au scenarii pe comenzile reparate aici.
- Proba nouă `proba_grav_cont.py` (gesturi reale): **19/28 picate înainte** (worktree, înainte de prima scriere) → **6/28 după**.
  X7r: 13/17 → **0/17**. X10s: 6/11 → 6/11 (neatins: sortarea pe niveluri e următorul GRAV).
- Regres Excel: `runde/7/proba_grav.py` 0/57 (`proba_grav_cont_regres.log`), `runde/6/proba_excel.py` 0/20 (`regres_cont_6_proba_excel.log`).
- Regres Word: `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 picate fiecare (`regres_cont_*.log`).

### Dovezile din Excel real (noi)
`runde/7/com_r7c.py` → `com_r7c.json` (DispatchEx, invizibil, `DisplayAlerts=False`, nimic salvat; instanța a ieșit singură la `Quit`):
etichetele listei Borders (`GetLabelMso`), efectul All Borders / Bottom Border / Outside / No Border pe celule, Percent Style
(„10%”, „25%”, „50%”, „900%”, „13%”), Fill Color (`Interior.Color 65535`), Wrap Text (rândul 14,4 → 72 pt = 5 rânduri; 57,6 pt = 4),
sortarea pe două niveluri (Clasa A→Z, apoi Punctaj descrescător), numele registrelor noi (Book2, Book3; după închiderea lui Book3 → Book4).

### Fiecare GRAV
- **X7 rest — FĂCUT** (`excel.js`: `umpleCuloare`, `procent`, `incadreaza`, `BORD_LISTA` / `borduri` / `meniuBorduri` / `bordStil`,
  `geomRand` / `PY` / `yRand` / `hRand` / `randLa`; `aplicatii.css`: blocul „runda 7, continuarea”):
  - Fill Color (butonul) pune galben FFFF00 (eticheta din referință „Fill Color RGB(255, 255, 0)”); Ctrl+Z îl scoate. Proba 3/3.
  - Fill Color ▾: galeria nu e în referință → mesajul central, care acum spune „Fill Color”, nu „More Options” (și la orice altă săgeată
    „More Options”: numele butonului ei). Proba 1/1.
  - Borders ▾: lista din S11 în ordinea Microsoft (Bottom Border … More Borders...), 13 comenzi cu efect pe muchii COMUNE între celule
    (ca Excel: No Border pe B2:B3 scoate și linia de jos a lui B1); butonul principal = Bottom Border. Draw Border, Erase Border, Line
    Color, Line Style, More Borders... → mesajul central. Proba 5/5 (All Borders, liniile negre pe ecran, No Border, Bottom Border).
  - Percent Style: formatul `0%`, valoarea rămâne. Proba 2/2.
  - Wrap Text: comutator; textul se așază pe rânduri, jos, iar rândul crește singur cu 19 px pe rând de text (B2 → 95 px, D5 → 76 px,
    ca 72 și 57,6 pt în Excel real); clicul pe rândurile de sub cel înalt nimerește celula bună; Ctrl+Z întoarce. Proba 6/6.
- **X10 (Sort cu niveluri, Sort Warning, graficele) — NEFĂCUT.** Cazurile de sortare sunt scrise (`proba_grav_cont.py › x10s`, 11;
  înainte 6 picate). Deblocatorul: un constructor proaspăt (planul în `stare_autor.md`). Eticheta „Then by” nu e în `uia_excel.json`
  (0 apariții) → are nevoie de citat Microsoft sau de un rând în `de_verificat.md`.
- **X8, X3, X4 — NEFĂCUTE** (neîncepute). Pentru X8: panoul din stânga al Save As e GOL și în `uia_excel.json` (elementele sunt
  „[element de listă, nesalvat]”); fereastra e cea comună Windows (`#32770`), la fel ca în `uia_word.json`, unde panoul are elemente.

### Fișierele (necomise)
`aplicatii/excel.js`, `aplicatii/aplicatii.css` (aceleași ca ale constructorului 1). Note: `diferente.md` D15-D23,
`de_verificat.md › RUNDA7-EXCEL` R7-8 … R7-10, `gata_pentru_critic.md`, `stare_autor.md`. Probe: `proba_grav_cont.py`,
`com_r7c.py` (+ ieșirile lor `*.json` / `*.log`).

### NESIGUR
- [NEVERIFICAT] galeria Fill Color ▾ (R7-8), aspectul listei Borders ▾ (R7-9: fără titlurile de grup, pictograme doar unde există),
  Wrap Text apăsat a doua oară (R7-10).
- Regula de încadrare (lățimea `w − 9` px, cuvinte întregi) e calibrată pe 2 texte la 64 px; un cuvânt mai lung decât coloana
  („octombrie,”) rămâne pe rândul lui, tăiat la marginea celulei — cum îl desenează Excel nu e probat.
- Combinația bordură + celulă îmbinată și bordurile pe coloane/rânduri întregi (se aplică doar în zona desenată a foii) nu sunt probate.

## Continuarea (constructorul 3) — X10 Sort, X8, X3, X4; graficele NU; PREDARE

### Numerele
- Pornirea: `masurare_pornire_cont2.json` (copia lui `masurare.json` de la 06:54): O1 61, O2 13392, O3 20337, O4 43, O5 113,
  O6 0, O7 353, O8 102, O9 34; porți: cum_fac 41, restul 0; suma 34476; lacătul reperelor ok.
- După (pasul 7, pornit după ultima scriere sub `aplicatii/` de la 07:17:06): O1-O9 neschimbate (61, 13392, 20337, 43, 113, 0, 353, 102, 34), lacăt ok,
  neconcludente 0; porțile: `controale_taiate` 0 → 1 (suma 34477) = o eroare de măsurare (clic expirat pe `vi/m2-l14`, pagină care NU
  încarcă `aplicatii/`); re-rulată pe toate lecțiile cu codul meu: 0 → vezi `regres.md`. `masurare.json` = măsurarea de după.
- Proba GRAV-urilor, gesturi reale, headless, doar 127.0.0.1:
  - `proba_grav_cont.py › X10s` (Sort): înainte **6/11 picate** (`proba_grav_cont_dupa.json`, constructorul 2) → după **0/11**
    (`proba_grav_cont_dupa3.json`, împreună cu X7r 0/17).
  - `proba_grav_cont2.py` (X8 12 cazuri, X3 5, X4 9): înainte, pe worktree, înaintea primei mele scrieri: **16 picate**
    (`proba_grav_cont2_inainte.json`; X8 a căzut la jumătate, deci restul cazurilor X8 n-au rulat) → după **0/26** (`proba_grav_cont2_dupa.json`).
- Regresul (după ultima scriere): Excel `proba_grav.py` 0/57, `proba_grav_cont.py › X7r` 0/17, `runde/6/proba_excel.py` 0/20;
  Word `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 picate (`c3_regres_*.log`).

### Fiecare GRAV
- **X10 Sort (m2-l10) — reparat.** Fereastra Sort: rândul „Sort Field” din `uia_excel.json › dialog.SortDialog` e nivelul 0
  („Sort by”); Add Level îl clonează la +22 px („Then by”); Delete Level / Copy Level; listele Column / Sort On / Order
  (`.lh-ap-x-lista-combo`); „My data has headers” se bifează singură după antet și se poate schimba; OK sortează pe niveluri,
  rânduri întregi, Ctrl+Z întoarce. Rezultatul pe tabelul lecției = Excel real (`com_r7c.json › sortare_doua_niveluri`).
  Sort Warning (`dialog.SortWarning`): la butoanele A→Z / Z→A și la Data › Sort, când e aleasă doar o parte din coloanele
  tabelului; Expand = tot tabelul, Continue = doar selecția (capcana lecției m2-l10:62). Numele UIA nu se mai desenează
  peste valori. Proba: X10s 11/11.
- **X8 (m1-l03) — reparat, fără Ctrl+S.** Ctrl+N = Book2, Book3… (numerele nu se refolosesc, `com_r7c.json › registre_noi`), fiecare
  registru cu foile și istoricul lui Ctrl+Z; Ctrl+W închide registrul nemodificat (rămâne cel din spate; pe ultimul: Excel deschis,
  gol, titlul „Excel”, Ctrl+N deschide alt registru); cu modificări: mesajul central (fereastra „Save your changes” nu e în
  referința Excel). Același lucru din File › New › Blank workbook și File › Close (în Chrome pe calculator Ctrl+N / Ctrl+W sunt
  ale browserului). Dublu clic pe filă (sau clic dreapta › Rename) = caseta de redenumire pe filă; Enter / clic în altă parte =
  numele nou, Esc = renunți; textul nu mai ajunge în celulă. Save As (F12): panoul din stânga cu Acasă, Galerie, Documente,
  Acest PC, Rețea (fereastra comună Windows, numele din `uia_word.json › lista.FileSaveAs_navigare`), clicul alege rândul.
  **Ctrl+S pe registru nou: NEATINS** (fereastra Excel nu e capturată; `de_verificat` R6-4 „DE ACOPERIT”). Proba: X8 12/12.
- **X3 (Acces rapid) — reparat.** Save = discheta, Undo = ↶, Redo = ↷ (Fluent UI System Icons, MIT, `@fluentui/svg-icons@1.1.343`,
  aceeași versiune ca `_cercetare/office_comenzi/icoane_build.py`), Customize Quick Access Toolbar = ▾ (nu mai e lupa). Puse în
  `date.icoane` din `excel.js`, doar unde lipsesc (`date/excel.json › fara_icoana`). Proba: X3 5/5 (și Undo din bară anulează).
- **X4 (banda de sub foaie) — reparat.** Barele lui Chrome de pe grilă sunt ascunse; barele desenate stau unde le pune
  `uia_excel.json › zona_document`: orizontala [838,720,508,17] pe rândul filelor, la dreapta, verticala [1346,220,17,496] de la
  rândul literelor; despărțitorul [806,714,32,31]; fondul benzii nu mai e alb. Săgețile, pista și tragerea cursorului derulează
  grila. Pe telefon (390 px) aceeași proporție, filele cel puțin 260 px. Proba: X4 9/9 (măsurat ±3-4 px față de referință).
- **X10 grafice (m2-l11) — NEFĂCUT.** Neînceput: inserarea graficului, filele contextuale Chart Design / Format
  (`panglica_context.Ctx_ChartDesign`, `Ctx_Format`) și `dialog.ChartChangeType` cer un context proaspăt.
- X9, X5, X6, X1, X2, X7: neatinse; probele lor (57 + 17 + 20) au rămas la 0 picate.

### Fișierele (necomise)
- `aplicatii/excel.js` (sortarea pe niveluri și Sort Warning; registrele, Excel gol, redenumirea foii, panoul Save As; pictogramele
  Acces rapid; barele de derulare) și `aplicatii/aplicatii.css` (blocurile „runda 7 · constructorul 3”, „X8”, „X4” la capăt).
- Note: `runde/7/diferente.md` D24-D34, `de_verificat.md › RUNDA7-EXCEL` R7-11 … R7-19 + R6-4 DE ACOPERIT, `stare_autor.md`,
  `gata_pentru_critic.md`; probele `runde/7/proba_grav_cont2.py` (nouă) și ieșirile `proba_grav_cont2_*.json/.log`,
  `proba_grav_cont_dupa3.*`, `proba_grav_cont_lucru3.*`, `c3_regres_*`.
- Copia de siguranță de dinaintea primei mele scrieri: `%TEMP%/…/scratchpad/c3safe/aplicatii/` (la regres: copia, NU `git restore`).

### FĂCUT / NEFĂCUT / NESIGUR
- FĂCUT: X10 Sort (11/11), X8 fără Ctrl+S (12/12), X3 (5/5), X4 (9/9); regresul Excel și Word 0; pasul 7: oracolele neschimbate, poarta controale_taiate 1 = eroare de măsurare, re-rulată 0 (`regres.md`).
- NEFĂCUT: graficele X10 (m2-l11) — deblocator: un constructor proaspăt, cu `panglica_context.*` și `dialog.ChartChangeType`;
  Ctrl+S pe registru nou (X8) — deblocator: captura Excel într-o rundă `acoperire` (R6-4).
- NESIGUR (fără referință, scrise în `de_verificat.md`): „Then by”, ordinile „Smallest to Largest / Largest to Smallest / Z to A /
  Custom List...”, „Column A” (R7-11, R7-12, din lecția m2-l10:63); Sort Warning la butoane și poziția ei (R7-13); OK cu nivel gol
  (R7-14); „Save your changes” (R7-15); aspectul Excel-ului gol (R7-16); rândurile panoului Save As (R7-17); regulile numelui foii
  (R7-18); culorile barelor de derulare (R7-19). Ctrl+N / Ctrl+W în Chrome pe calculator nu ajung la pagină (doar prin File).
  Pasul 7 n-a fost reluat întreg după re-rularea porții (doar `controale_taiate`, pe toate lecțiile = 0); X10-X4 n-au mișcat
  niciun oracol (O3/O4/O5 rămân la fel: suprafețele noi nu sunt în scenariile lor).
