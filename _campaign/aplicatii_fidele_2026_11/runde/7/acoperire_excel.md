# Runda `acoperire` pe Excel, după runda 7 (19.11.2026)

Scopul: să aducă din Excel-ul real referințele care lipseau pentru GRAV-urile deschise de criticul 7 (X5, X8, X10, K1-K6) și pentru întrebările din `de_verificat.md`. Aplicațiile simulate (`aplicatii/`), lecțiile și oracolele NU s-au atins în runda asta. S-au adăugat doar referințe și scenarii.

Au lucrat: agentul de acoperire (capturi + scenarii, predare în `runde/7/acoperire/stare_autor.md`), apoi orchestratorul (verificarea datelor personale, bifele din `de_verificat.md`, reînghețarea, măsurarea, raportul ăsta).

## 1. Numerele: înainte → după

Înainte = `runde/7/masurare_final_r7.json` (măsurarea curată de la sfârșitul rundei 7, 08:38-09:37).
După = `runde/7/masurare.json` (10:46-11:45, singură pe mașină, `--compara masurare_final_r7.json`, jurnal în `runde/7/acoperire/masurare_dupa_acoperire.log`).

| | înainte | după | de ce |
|---|---:|---:|---|
| O1 central | 61 | 61 | — |
| O2 identic | 13392 | 13392 | — |
| O3 interfață | 20337 | **21586** | +1249 = exact suma celor 17 suprafețe noi din `uia_excel.json` (vezi §6) |
| O4 comportament | 43 | **69** | +26 = scenariile noi cu rezultat real (vezi §6) |
| O5 evenimente | 113 | 113 | — |
| O6 sarcini | 0 | 0 | — |
| O7 text UI | 353 | **343** | −10: `comanda_inexistenta` 74 → 64. Lecțiile pomenesc comenzi care acum sunt în referință (lista Σ, galeriile Borders / Fill Color) |
| O8 comenzi moarte | 102 | 102 | — |
| O9 asistare | 34 | 34 | — |
| porți | 41 | 41 | toate pe `cum_fac` (41), restul 0, la fel ca înainte |

Lacăt: ok. Neconcludente: 0. Suma măsurată: 35741.
`masoara.py` scrie „REGRES față de 7/masurare_final_r7.json: O3 20337 -> 21586; O4 43 -> 69”. Nu e regres al simulatorului, pentru că `aplicatii/` nu s-a schimbat de la 07:17. Creșterea vine din referința mai bogată: oracolul vede acum lucruri pe care înainte nu le putea cere. Rândul din jurnal e marcat `acoperire: true`, deci `opreste.py` nu-l numără ca regres.

## 2. Mutanții și oracolele
Niciun oracol atins. O3 citește singur `referinte/uia_*.json`, iar O4 citește singur `scenarii/**` + `referinte/scenarii_real/`. Bancul de mutanți nu trebuie rulat din nou (la fel ca la runda `acoperire` Word, `runde/3/acoperire_word.md`).

## 3. Fișiere schimbate și înghețate
- NOU `referinte/acoperire_excel_r7.py`: generator-soră. Comenzi: `capturi`, `scrie`, `scrie_scenarii`, `scenarii`, `verifica`. Pornește Excel doar invizibil (`EXCEL.EXE /x` pe desktopul ascuns) și refuză desktopul vizibil.
- `referinte/uia_excel.json`: 17 chei noi sub `suprafete` + blocul `acoperire_r7` (fapte, NEVERIFICAT, rulări, elemente personale scoase).
- `referinte/scenarii_real/`: 12 rezultate noi + 3 refăcute (`excel-autocompletare-tab`, `excel-separator-virgula`, `excel-salvare-ca`). Toate 15 au `mod_probat: true`.
- `scenarii/excel/`: cele 12 scenarii noi + cele 3 schimbate. `excel-salvare-ca` e rescris pe drumul File › Save As › Browse.
- `api_biblioteca.md` §5 excel: cheile noi de stare (`fereastra_mesaj`, `ramane_in_editare`, `dialog`, `registru_activ`, `latimi_coloane`, `inaltimi_randuri`, `format_celule.incadrare`).
- `de_verificat.md`: 18 rânduri bifate, fiecare cu dovada (§5).
- `repere.lock`: reînghețat cu `ingheata.py --acoperire` (351 de fișiere), `ingheata.py --verifica` = 0. `acoperire_excel_r7.py verifica` = 0, `dump_uia_office.py verifica` = 0.

Captura brută (`capturi_excel_brut.json`) NU e în proiect. Conținea folderele fixate ale utilizatorului din panoul de navigare Save As. Am mutat-o în afara worktree-ului, iar în `uia_excel.json` lista de navigare are cele 19 elemente personale scoase (`lista.FileSaveAs_navigare` păstrează doar implicitele Windows). În fișierele livrate: 0 căi `C:/Users`, 0 nume personale (verificat cu grep pe diff înainte de commit).

## 4. Capturile, cu căile
Excel real 16.0.20326.20318, instanță nouă și invizibilă, pe desktopul ascuns. Jurnalele: `runde/7/acoperire/capturi_rulare1..3.log`, `scenarii_rulare1..2.log`, `scenarii_excel_jurnal.json`.
- **X8 / R6-4**: Ctrl+S pe registru nou → fereastra Office „Save this file” (File name cu focusul, Choose a Location, More options…, Save, Cancel). E aceeași fereastră ca la Word. Cheia: `dialog.save_this_file`.
- **X8 / R7-15**: Ctrl+W pe registru modificat → „Save your changes to this file?” cu More options…, Save, Don't Save, Cancel. Cancel lasă registrul deschis. Cheia: `dialog.save_your_changes_to_this_file`; scenariul: `excel-ctrl-w-modificat`.
- **X5 / R7-1**: lista ▾ de lângă Σ: Sum, Average, Count Numbers, Max, Min, More Functions... Average pe B8 → `=AVERAGE(B2:B7)`. Cheia: `lista.AutoSum`. R7-7: după Σ, bara de stare arată „Point”.
- **K1 / R7-11 / R7-12 / R7-14**: fereastra Sort după Add Level (rândul „Then by”), listele Sort by / Sort On / Order, Sort by fără antet (Column A/B/C), eroarea la nivel gol („All sort criteria must have a column or row specified…”). La deschidere, focusul e pe OK. Cheile: `dialog.SortDialog#Add Level`, `lista.SortDialog_*`, `dialog.SortDialog_eroare_nivel_gol`; scenariul: `excel-sortare-doua-niveluri`.
- **R7-2 / R6-1 / R6-2**: ferestrele de eroare a formulei: „We found a typo…” (Yes cu focusul, No), „There's a problem with this formula…”, „You've entered too few arguments for this function.” Cheile: `dialog.eroare_formula`, `_2`, `_3`.
- **K3 / R7-8 / R7-9**: galeriile Fill Color și Borders. Cheile: `lista.CellFillColorPicker`, `lista.Borders`.
- **X10**: galeria Insert Column or Bar Chart. După inserare apar filele Chart Design + Format, cu Chart Design aleasă. Cheia: `lista.ChartTypeColumnInsertGallery`.
- **R6-6**: bara de stare pe o zonă cu numere: „Average 7,5”, „Count 6”, „Sum 45”, înaintea butoanelor de vizualizare. Cheia: `bara_stare#selectie_numere`.
- **K5**: `=` + ↑ + Enter → `=B4`; `=B2+` + → + Enter → `=B2+E2` (modul Point). Scenariile: `excel-point-egal-sus`, `excel-point-plus-dreapta`.
- **K4**: `=AV` + Tab → `=AVEDEV(B2:B4)` 0,666667; `=AVER` + Tab → AVERAGE. Scenariile: `excel-av-tab`, `excel-aver-tab`.
- **K6**: Alt+= → `=SUM(B2:B4)`. Scenariul: `excel-alt-egal`.
- Altele: Column Width „20” + Enter → 150 px (`excel-column-width-enter`); Ctrl+N → Book2 (`excel-ctrl-n`); `=1/30000` → „3,33333E-05” și `=1/7000000` → „1,42857E-07” (`excel-numere-afisare`); AutoFit → 186 px (`excel-autofit-latime`); Wrap Text de două ori → fără încadrare (`excel-wrap-de-doua-ori`).

## 5. Rânduri din `de_verificat.md` închise
Bifate cu „Lămurit în runda `acoperire` Excel (19.11.2026)” și dovada:
- R6-1, R6-2 (parțial: lista de completare rămâne NEVERIFICAT), R6-4 (ambele rânduri), R6-5, R6-6;
- R7-1, R7-2, R7-3, R7-4, R7-6, R7-7, R7-8, R7-9, R7-10, R7-11, R7-14, R7-15.

Rămân deschise: R7-12 (parțial), R7-16, R7-17, R7-18, R7-5, R7-13, R7-19, R6-3.

## 6. Ce vede oracolul acum (unitățile noi, explicate)
**O3 (+1249), din `runde/7/iesiri/O3/oracol_ui.json` → `pe_suprafata`**: toate cele 1249 de puncte noi sunt pe cele 17 suprafețe noi, pe care simulatorul încă nu le desenează (`lipsa` / `suprafata_lipsa`):

| suprafața | puncte |
|---|---:|
| lista.CellFillColorPicker | 512 |
| lista.Borders | 134 |
| lista.ChartTypeColumnInsertGallery | 99 |
| bara_stare#selectie_numere | 92 |
| dialog.SortDialog#Add Level | 92 |
| dialog.save_your_changes_to_this_file | 57 |
| dialog.save_this_file | 50 |
| lista.AutoSum | 43 |
| dialog.eroare_formula, _2, _3 | 36 + 36 + 29 |
| dialog.SortDialog_eroare_nivel_gol | 29 |
| lista.SortDialog_SortBy, _SortOn, _Order, _SortBy_fara_antet, lista.FileSaveAs_navigare | 5 × 8 |

Total: 1249. Restul suprafețelor Excel au aceleași puncte ca înainte (suma Excel: 7320).

**O4 (+26), din `runde/7/iesiri/O4/oracol_comportament.json`**: diferențe 34 (+27), chei neexecutabile 24 (+1), fără real probat 11 (−2).
- `excel-point-egal-sus` (3) și `excel-point-plus-dreapta` (3): simulatorul rămâne cu „=” în editare, dar real e `=B4` / `=B2+E2` și celula activă coboară → **K5**.
- `excel-av-tab` (1): `celule.C6` → **K4**.
- `excel-alt-egal` (1): B5 fără `=SUM(B2:B4)` → **K6**.
- `excel-ctrl-w-modificat` (5): lipsește fereastra „Save your changes to this file?” și `registru_activ` → **X8**.
- `excel-autocompletare-tab` (4): simulatorul scrie `=SUBSTITUTE(A1:A3)`, real apare „You've entered too few arguments for this function.” → R6-2.
- `excel-separator-virgula` (4): lipsește fereastra „There's a problem with this formula…” → R6-1.
- `excel-numere-afisare` (6): „3,33E-05” față de „3,33333E-05”, „1,4e-7” față de „1,42857E-07”, plus lățimile coloanelor → R7-3 / R7-4.
- `excel-autofit-latime` (1): lățimea coloanei A după AutoFit (real 186 px) → R7-6.
- `excel-sortare-doua-niveluri`: neexecutabil la pasul 3, pentru că în lista „Then by” nu apare coloana „Clasa” → **K1** / Sort.
- Trec deja: `excel-ctrl-n`, `excel-column-width-enter`, `excel-wrap-de-doua-ori`, `excel-aver-tab`, `excel-salvare-ca`.

Asta înseamnă că X8, K4, K5, K6, K1 (partea Sort) și R6-1 / R6-2 / R7-3 / R7-4 / R7-6 au acum un oracol care numără. Constructorul rundei 8 vede scăderea când le repară. X5 (lista Σ), X10 (galeria grafice) și K3 (galeriile Fill / Borders) se văd pe O3.

## 7. [NEVERIFICAT]
- Order după alegerea unei coloane cu numere sau text (R7-12): lista nu s-a schimbat în captură.
- Excel fără niciun registru deschis (R7-16): Ctrl+W pe ultimul registru nu l-a închis în 20 s.
- Lista de completare la `=AV` / `=SU`: nicio fereastră vizibilă în UIA.
- R7-17: doar parțial (implicitele Desktop / Acasă / Galerie / Acest PC / Rețea; ordinea pe un profil curat e necunoscută).
- R7-18 (redenumirea foii), R7-5, R7-13, R7-19, R6-3: nefăcute.
- Tastele de acces KeyTips (K6 Alt, H, 1) și tastatura în ferestre (K1 Tab / Esc / Alt+↓, K2 Enter): fără captură nouă în runda asta. Pentru ele, constructorul folosește `surse_microsoft.md` și ce e deja în `uia_excel.json`.

## 8. Ce a mai ieșit pe drum
- Excel-ul de captură s-a închis singur la sfârșitul fiecărei rulări (SDI: fereastra XLMAIN invalidă la închidere). Nicio instanță n-a rămas pornită. Intrările mai vechi din `Resiliency\DocumentRecovery` nu sunt ale noastre și au rămas neatinse.
- Agentul de acoperire a ajuns la limita de context înainte de pașii de final. Bifele, reînghețarea, măsurarea și raportul le-a făcut orchestratorul.

ACOPERIRE_PARTIALA
