# Runda `acoperire` pe Excel, redeschisă după runda 14 (20.11.2026)

Scopul: deblocatorul GRAV-ului **X10** (`runde/10/raport.md` › Deblocatorii; `runde/10/critic.md:34`): galeria Insert Line or Area Chart ▾ și Add Chart Element › Data Labels, plus faptele R10-3 (a, c), R10-5 și R10-6 din `de_verificat.md`. Aplicațiile simulate (`aplicatii/`), lecțiile, jocurile și oracolele NU s-au atins. S-au adăugat doar referințe, scenarii și 7 rânduri în contractul bibliotecii.

Toate datele vin din Excel-ul real de pe PC (16.0.20326.20318), într-o instanță NOUĂ a mea (`EXCEL.EXE /x`) pe desktopul ascuns: `LHRefOffice` pentru capturi, `LHScenarii` pentru scenarii. Generatorul-soră: `referinte/acoperire_excel_r14.py`.

## 1. Numerele: înainte → după

Înainte = `runde/14/masurare_pas7_r14.json`: copia identică (`cmp`) a lui `runde/14/masurare.json`, pasul 7 al rundei 14, de la 17:23.
După = `runde/14/acoperire_excel/masurare.json` (18:44-19:21, singură pe mașină, `--compara masurare_pas7_r14.json --timeout O6=3600`; jurnal `runde/14/acoperire_excel/masurare_dupa_acoperire.log`). `runde/14/masurare.json` a fost pus înapoi din copie: pasul 7 a rămas neschimbat.

| | înainte | după | de ce |
|---|---:|---:|---|
| O1 central | 61 | 61 | — |
| O2 identic | 13392 | 13392 | — |
| O3 interfață | 26855 | **27139** | +284 = exact suma celor 4 suprafețe noi din `uia_excel.json` (vezi §6) |
| O4 comportament | 32 | **64** | +32 = exact unitățile celor 11 scenarii noi (diferențe 15 → 40, chei neexecutabile 4 → 11; vezi §6) |
| O5 evenimente | 82 | 82 | — |
| O6 sarcini | 0 | 0 | — (1005 s, sub limita de 3600 s) |
| O7 text UI | 341 | 341 | — |
| O8 comenzi moarte | 102 | 102 | — |
| O9 asistare | 27 | 27 | — |
| porți | 41 | 41 | toate pe `cum_fac` (41); `date_personale` 0, restul 0, ca înainte |

Lacăt: ok la început și la sfârșit. Neconcludente: 0. Suma măsurată: 40933 → 41249 (+316 = 284 + 32). Durata: 2192 s.
`masoara.py` scrie „REGRES față de 14/masurare_pas7_r14.json: O3 26855 -> 27139; O4 32 -> 64” și iese cu codul 1. Nu e un regres al simulatorului: `aplicatii/` nu s-a schimbat. Creșterea vine din referința mai bogată: oracolul vede acum lucruri pe care înainte nu le putea cere.

## 2. Mutanții și oracolele
Niciun oracol atins. O3 citește singur `referinte/uia_*.json`, iar O4 citește singur `scenarii/**` + `referinte/scenarii_real/`. Bancul de mutanți nu trebuie rulat din nou (ca la runda `acoperire` după runda 7, `runde/7/acoperire_excel.md` §2).

## 3. Fișiere schimbate și înghețate
- NOU `referinte/acoperire_excel_r14.py`: generator-soră al lui `acoperire_excel_r7.py` (îi folosește clasele și ajutoarele). Comenzi: `stare`, `capturi`, `scrie`, `scrie_scenarii`, `scenarii`, `verifica`. Pornește Excel doar pe desktopul ascuns și refuză desktopul vizibil. O sesiune Excel nu pornește nimic nou după 8 minute.
- `referinte/uia_excel.json`: 4 chei noi sub `suprafete` + blocul `acoperire_r14` (fapte prin COM, procese, rulări). Doar adăugiri: `git diff` = 1562 de rânduri adăugate, 0 șterse.
- `referinte/scenarii_real/`: 11 rezultate noi, toate cu `mod_probat: true`.
- `scenarii/excel/`: cele 11 scenarii noi (`rulat_de: referinte/acoperire_excel_r14.py`).
- `api_biblioteca.md` §5 excel: cheile `tip_grafic`, `serii_grafic`, `categorii_grafic`, `etichete_date` și valoarea unei celule cu eroare (`valoare` = „#SPILL!”, numele erorii, ca în celulă).
- `de_verificat.md` (în afara zonei înghețate): R10-5, R10-6 bifate; R10-3 lămurit parțial (§5).
- `repere.lock`: reînghețat cu `ingheata.py --acoperire "B-excel redeschis dupa runda 14: X10 (Line chart, Data Labels) + R10-3/5/6"` (424 de fișiere), apoi `ingheata.py --verifica` = 0. `acoperire_excel_r14.py verifica` = 0.

Dovezile brute stau în `runde/14/acoperire_excel/`: `capturi_excel_brut.json`, `capturi_rulare1.log`, `capturi_rulare2.log`, `scenarii_rulare1.log`, `scenarii_excel_jurnal.json`, `suprafete_noi_arbore.txt`, `o4_scenarii_noi.txt`, `stare_masina_inainte.json`, `stare_masina_dupa.json`, `stare_autor.md`. Fără căi `C:/Users` și fără nume de cont în ele (verificat cu grep și de `verifica`).

## 4. Capturile, cu căile
Jurnalele: `capturi_rulare1.log` (x, y, v; 71 s) și `capturi_rulare2.log` (z, reluat; 71 s).
- **X10 · galeria Insert › Insert Line or Area Chart ▾** (A1:D5 aleasă, tabelul atelierului din m2-l11): grupurile 2-D Line (Line, Stacked Line, 100% Stacked Line, Line with Markers, Stacked Line with Markers, 100% Stacked Line with Markers), 3-D Line (3-D Line), 2-D Area (Area, Stacked Area, 100% Stacked Area), 3-D Area (3-D Area, 3-D Stacked Area, 3-D 100% Stacked Area), apoi „More Line Charts...” (tasta Alt, N, N 1, M). Rândurile galeriei n-au taste de acces în UI Automation (la fel ca galeria Column din runda 7). Cheia: `lista.ChartTypeLineInsertGallery`.
- **Line pe tabelul atelierului** (prin COM, `acoperire_r14.fapte.x_line`): ChartType 4 = Line, seriile pe coloane (`PlotBy` = xlColumns): **seriile = miercuri, joi, vineri, categoriile = 8A…8D**, titlul „Chart Title”, legenda jos (Bottom), fără etichete. După inserare apar filele Chart Design + Format, cu Chart Design aleasă. Asta confirmă lecția (`m2-l11:252`: „Excel face din zile seriile”, deci e nevoie de Switch Row/Column).
- **X10 · Chart Design › Add Chart Element ▾**: Axes, Axis Titles, Chart Title, Data Labels, Data Table, Error Bars, Gridlines, Legend, Lines, Trendline, Up/Down Bars, cu tastele Alt, J C, A, X / A / C / D / B / E / G / L / T (Lines și Up/Down Bars fără tastă). Cheia: `lista.AddChartElementMenu`.
- **X10 · submeniul Data Labels ▸ pe graficul Line**: None, Center, Left, Right, Above, Below, Data Callout, apoi More Data Label Options... (Alt, J C, A, D, M). Cheia: `lista.AddChartElementMenu#Data Labels`. **Right** → toate cele 3 serii au etichete (`HasDataLabels`), poziția -4152 = Right, `ShowValue` = true (`fapte.y_data_labels_line`).
- **Submeniul Data Labels ▸ pe un grafic Clustered Column** (tabelul din pasul 5 al lecției, A1:B6): None, Center, Inside End, Inside Base, Outside End, Data Callout, More Data Label Options... E altă listă decât la Line. Cheia: `lista.AddChartElementMenu#Data Labels#Clustered Column`. **Outside End** → poziția 2 = Outside End (`fapte.z_data_labels_coloana`). Lista confirmă legenda figurii din lecție (`m2-l11:220`).
- **Vărsarea, prin COM** (`fapte.v_varsare_com`): `=SUM(B2:B7)*B2:B6` cu D4 ocupată → D2 „#SPILL!” (codul CVErr 2045), `HasSpill` = false; după golirea lui D4 → D2:D6 = 432, 336, 384, 480, 288, `SpillingToRange` = D2:D6, D3 fără formulă, `SpillParent` = D2. `Range.Formula` = `Range.Formula2` = textul tastat (fără „@”), deci cheia `formula` din `celule` rămâne cea din runda 7. `=B2:B6`, `=B2:B6&"x"`, `=B2:B6>8` se varsă toate. `End(xlDown)` din D2 = D6, `End(xlUp)` din D7 = D6, `CurrentRegion` al lui D3 = D2:D6; `End(xlDown)` din A7 = A1048576, `End(xlToRight)` din C7 = XFD7.

**Scenariile** (jurnal `scenarii_rulare1.log` + `scenarii_excel_jurnal.json`; sesiunea 458 s): toate cele 6 canale au trecut proba pozitivă și pe cea de control în aceeași rulare, inclusiv canalul nou `taste_ctrl_sageti` (Ctrl+↓ din A1 → A5, Ctrl+Shift+↓ → A1:A5; controlul: ↓ fără Ctrl → A2).

| scenariul | gestul real | rezultatul real |
|---|---|---|
| `excel-grafic-line-galerie` | A1:D5 aleasă, Insert › Insert Line or Area Chart ▾ › Line (UIA) | Line; seriile miercuri, joi, vineri; categoriile 8A…8D |
| `excel-grafic-line-data-labels-right` | + Chart Design › Add Chart Element ▾ › Data Labels ▸ › Right | Line; Right pe toate cele 3 serii |
| `excel-grafic-coloane-data-labels-outside-end` | A1:B6, Clustered Column, Add Chart Element › Data Labels › Outside End | Clustered Column; Outside End pe „Cărți citite” |
| `excel-varsare-zona-ocupata` | D4 = „x”; în D2 tastat `=SUM(B2:B7)*B2:B6`, Enter | D2 = #SPILL!, D3 activă |
| `excel-varsare-simpla` | D2 `=B2:B6`, Tab, `=B2:B6&"x"`, Tab, `=B2:B6>8`, Enter | D2:D6, E2:E6, F2:F6 vărsate; D3 activă |
| `excel-varsare-ctrl-jos` | formula, Enter, ↑, Ctrl+↓ | D6 |
| `excel-varsare-ctrl-shift-jos` | formula, Enter, ↑, Ctrl+Shift+↓ | D2:D6, D2 activă |
| `excel-varsare-ctrl-sus-din-d7` | formula, Enter, ↓ ×4, Ctrl+↑ | D6 |
| `excel-varsare-ctrl-a` | formula, Enter (D3), Ctrl+A | D2:D6, D3 activă |
| `excel-ctrl-jos-ultimul-rand` | A1:A7 pline, din A7 Ctrl+↓ | A1048576 |
| `excel-ctrl-dreapta-ultima-coloana` | A7:C7 pline, din C7 Ctrl+→ | XFD7 |

## 5. Rânduri din `de_verificat.md` închise
- **R10-5** bifat: cele patru gesturi, cu scenariile lor.
- **R10-6** bifat: A1048576 și XFD7.
- **R10-3** lămurit PARȚIAL (a, c), cu dovada scrisă în rând; nebifat, pentru că (b), (d) și (e) rămân deschise.

## 6. Ce vede oracolul acum (unitățile noi, explicate)
**O3 (+284), din `runde/14/iesiri/O3/oracol_ui.json` → `pe_suprafata`**: toate punctele noi sunt pe cele 4 suprafețe noi, pe care simulatorul încă nu le desenează (`lipsa` pe fiecare rând + `suprafata_lipsa`):

| suprafața | puncte |
|---|---:|
| lista.ChartTypeLineInsertGallery | 99 |
| lista.AddChartElementMenu | 78 |
| lista.AddChartElementMenu#Data Labels | 57 |
| lista.AddChartElementMenu#Data Labels#Clustered Column | 50 |

**O4 (+32), din `runde/14/iesiri/O4/oracol_comportament.json`** (detaliile în `runde/14/acoperire_excel/o4_scenarii_noi.txt`); celelalte scenarii au aceleași numere ca înainte:
- `excel-grafic-line-galerie` (3), `excel-grafic-line-data-labels-right` (2): **neexecutabile la pasul 1**, „ținta meniu:Line nu e pe ecran”. Galeria Line din simulator nu se deschide → **X10**.
- `excel-grafic-coloane-data-labels-outside-end` (2): neexecutabil la pasul 3, „ținta meniu:Data Labels nu e pe ecran”. Add Chart Element nu are listă în simulator → **X10**.
- `excel-varsare-zona-ocupata` (1): simulatorul dă `#VALUE!` în D2, real `#SPILL!` → R10-3 (a).
- `excel-varsare-simpla` (14): `=B2:B6` nu se varsă (D3:D6 lipsă). `=B2:B6&"x"` și `=B2:B6>8` dau `#VALUE!` în E2 / F2 (real: 9x / TRUE) și nu se varsă (E3:E6, F3:F6 lipsă) → R10-3 (c).
- `excel-varsare-ctrl-jos` (2: D40 față de D6), `excel-varsare-ctrl-shift-jos` (1: D2:D40 față de D2:D6), `excel-varsare-ctrl-sus-din-d7` (2: D2 față de D6), `excel-varsare-ctrl-a` (1: toată foaia față de D2:D6) → R10-5.
- `excel-ctrl-jos-ultimul-rand` (2: A40 față de A1048576), `excel-ctrl-dreapta-ultima-coloana` (2: Z7 față de XFD7) → R10-6.

Asta înseamnă că X10 are acum referință și oracol: O3 vede listele, O4 vede gesturile. Constructorul următoarei runde Excel vede scăderea când le face. La fel, vărsarea și Ctrl+săgeți au oracol care numără.

## 7. Ce a rămas [NEVERIFICAT]
- R10-3 (b): chenarul vărsării, bara de formule pe D3 și Delete pe D3. Nu se văd prin COM, iar pe desktopul ascuns nu le-am citit.
- R10-3 (d), (e): nejucate în runda asta.
- Butonul **+ (Chart Elements)** de lângă grafic, pe care lecția îl pomenește la `m2-l11:221`: necapturat.
- Gestul real de mouse pe galerie, într-un Excel vizibil: Line și rândurile de meniu au fost alese prin UI Automation (Expand / Invoke), ca la galeria Column din runda 7. Clicul de mouse adevărat n-a fost jucat.
- R10-1, R10-2, R10-4, R10-7, R10-8, R10-9: în afara listei rundei.

## 8. Starea mașinii (înainte → după) și ce a mai ieșit pe drum
- **Excel**: 0 procese EXCEL.EXE înainte de fiecare pornire (`tasklist`). Cele 3 sesiuni (71 s, 71 s, 458 s) au închis normal propria instanță (`Quit`, cod 0). PID-ul meu nu a rămas, deci 0 procese după.
- **WINWORD** (PID-ul omului) și **POWERPNT** (blocat de la o rundă trecută): aceleași PID-uri înainte și după, neatinse. PowerPoint nu s-a pornit.
- **Clipboard**: n-am apăsat Ctrl+C. Numărul de secvență al clipboard-ului (`GetClipboardSequenceNumber`): 1030 → 1030, deci clipboard-ul nu s-a schimbat.
- **Recent**: nimic salvat, deci nimic de curățat. Office Excel User MRU 91 → 91 valori, ComDlg32 584 → 584, Resiliency 3 → 3, fișiere `lh_xl_r14_*` în %TEMP% 0 → 0 (`stare_masina_inainte.json` / `stare_masina_dupa.json`; doar numere, fără nume).
- **Pe drum**: în prima rulare a capturilor, o fereastră a galeriei Column a dispărut chiar în timp ce o închideam (COMError în `ElementFromHandle`). Am pus închiderea într-o buclă cu reîncercare (`inchide_sigur`) și am reluat doar captura z.
- **Ieșirile pasului 7**: `masoara.py --runda 14` scrie peste `runde/14/iesiri/`, care nu e în git. Înainte ca O3-O9 să termine, am copiat `runde/14/iesiri/` în `runde/14/acoperire_excel/iesiri_pas7_copie/` (213 fișiere). Doar cele 3 `iesire.log` de la O1-O3 erau deja rescrise. JSON-urile pasului 7 sunt toate în copie.

ACOPERIRE_GATA
