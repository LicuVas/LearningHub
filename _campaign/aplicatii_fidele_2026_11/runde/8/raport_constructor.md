# Runda 8 · etapa B · Excel — raportul constructorului (pașii 2-7; PREDARE după 6 din 9 GRAV)

## Numerele
Măsurarea (pasul 7): `masurare_pornire.json` → `masurare.json` (`masurare_dupa.log`, pornită după ultima scriere sub `aplicatii/`,
singură pe mașină):

| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți | suma |
|---|---|---|---|---|---|---|---|---|---|---|---|
| înainte | 61 | 13392 | 21586 | 69 | 113 | 0 | 343 | 102 | 34 | 41 (cum_fac) | 35741 |
| după | 61 | 13392 | 21586 | **56** | 113 | 0 | 343 | 102 | 34 | 45 → re-rulat 41 | 35732 |

Lacătul reperelor: ok (și `ingheata.py --verifica` = 0 după re-rulare). Neconcludente 0. O4: diferențele Excel 34 → 21
(`excel-av-tab`, `excel-point-egal-sus`, `excel-point-plus-dreapta` trec; `excel-autocompletare-tab` și `excel-separator-virgula`
4 → 1 fiecare: rămâne doar celula aflată în editare, pe care `stare().celule` o arată și Excel real nu). O3 nu se mișcă: listele
desenate acum sunt citite doar prin plasă, iar O3 rămâne ce era (de verificat de critic dacă plasa le citește).
Porțile: test_joc 0 → 2 și controale_taiate 0 → 2 în măsurare = clicuri / pornire de browser expirate sub `--paralel 3`, pe
pagini care nu încarcă `aplicatii/` (`recapitulare-v`, `recapitulare-vi`, `vii/m2-l09`); re-rulate singure → 0 și 0
(`regres.md`, `porti_reluate.log`). Deci, pe porți: 41 → 41.

Proba GRAV-urilor (`proba_grav.py`, gesturi reale, headless, doar 127.0.0.1): **49 picate din 64 înainte** (`proba_grav_inainte.json`,
cod neatins) → **14 picate din 66 după** (`proba_grav_dupa.json`). Cele 14 sunt toate pe X8 (9) și K6 (5), neîncepute.
Pe GRAV (picate înainte → după, din câte): K3 8→0/11, K5 7→0/8, K4 2→0/4, X5 7→0/8, K2 4→0/6 (a 6-a verificare, Sort cu nivel gol, adăugată după), K1 7→0/9; X8 9/13 și K6 5/6 neschimbate (neîncepute).

## Fiecare GRAV
- **K3 — reparat.** Cu un meniu de clic dreapta sau o listă ▾ deschise, tastele nu mai ajung în foaie: ↓/↑ mută alegerea,
  Enter apasă rândul (cu `activat` = ținta rândului), Esc închide, litera de acces din `uia_excel.json › meniu_contextual.*`
  (Copy „C”, Rename „R”…) apasă comanda, orice altă tastă = `fara_efect` cu eveniment. Listele Borders ▾ și Σ ▾ sunt desenate
  acum din referință (`lista.Borders`, `lista.AutoSum`). Proba: C pe B2 copiază (B2 rămâne 9), Delete nu golește C2, ↓ ↓ Enter
  = Copy, R pe filă = redenumire, Borders ▾ ↓ Enter = Bottom Border pe A1 (11/11).
- **K5 — reparat.** Modul Point: după `= + - * / ( ;` săgeata scrie adresa vecinei, apăsările următoare o mută, bara de stare
  arată „Point”, Enter primește formula (`=` ↑ Enter → `=B4` = 8, activa B6; `=B2+` → Enter → `=B2+E2` = 13, activa D3, ca
  `scenarii_real/excel-point-*`). Mesajul fals a dispărut de pe drumul ăsta. Ferestrele reale de eroare înlocuiesc mesajul
  central unde referința le are: `=SUM(B2,B3)` → „There's a problem with this formula.”, `=SU`+Tab+`B2:B4)` → „You've entered
  too few arguments…”, `=SUM(B2:B7)B2:B6` → „We found a typo…” cu formula corectată a elevului; `fereastra_mesaj` în stare (8/8).
- **K4 — reparat.** AVEDEV există și calculează (9, 7, 8 → 0,666667); `=AV`+Tab → `=AVEDEV(`, `=AVER`+Tab → `=AVERAGE(`. Lista
  vizibilă de completare NU e desenată (nu e capturată) (4/4).
- **X5 — reparat.** ▾ de lângă Σ (Home și Formulas) → Sum, Average, Count Numbers, Max, Min, More Functions...; fiecare scrie
  funcția cu zona propusă aleasă (Average pe B8 → `=AVERAGE(B2:B7)` = 7,5; COUNT 6, MAX 10, MIN 5, SUM 45); More Functions... =
  mesajul central (8/8).
- **K2 — reparat.** Enter într-o fereastră apasă butonul cu focusul, altfel butonul implicit (OK / Save / Sort... / Yes), pe
  ACELAȘI drum ca clicul, cu `activat` = ținta butonului; ținta evenimentului = focusul din momentul tastei (cârligul opțional
  `I.tintaTasta` din `aplicatii.js`, pus doar de Excel). Asistentul §6.3 cu doi pași `fereastra:OK` făcuți cu Enter → `pas() = 2`,
  fără indiciu. Sort cu „Sort by” gol → fereastra reală „All sort criteria must have…” peste Sort (6/6).
- **K1 — reparat.** Focusul la deschidere în Sort = OK (`acoperire_r7.fapte.d_sort`); Tab / Shift+Tab prin controalele
  ferestrei (ordinea arborelui UIA, niciun DIV gol); Alt+literă după `AccessKey` (Sort Alt+A adaugă nivel, Sort Warning Alt+C/E,
  Column Width Alt+C, Save As Alt+N / Alt+S) cu `tasta_acces`; ↑/↓ în grupul radio; Alt+↓ deschide lista casetei din Sort (9/9).
- **X8 — NEFĂCUT** (neînceput; planul și proba scrisă în `stare_autor.md`).
- **K6 — NEFĂCUT** (neînceput; planul în `stare_autor.md`).
- **X10 graficele — NEFĂCUT** (neînceput).

## Regresul
- Word: `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 picate fiecare (`regres_word.txt`).
- Excel: `7/proba_grav_cont` 0, `7/proba_grav_cont2` 0, `6/proba_excel` 0, `7/proba_grav` **2** — amândouă pe X6
  (`runde/7/proba_grav.py:167-171`): proba veche cere mesajul central la `=SUM(B2:B4)B2` și ieșirea din editare la primul Esc.
  Referința nouă (`uia_excel.json › dialog.eroare_formula`, deschis prin „D2: =SUM(B2:B7)B2:B6 + Enter”) arată fereastra „We found
  a typo… Do you want to accept this correction?” (Yes / No). Acum apare fereastra; primul Esc o închide (înapoi în editare),
  al doilea iese din editare. Proba veche NU e schimbată (`diferente.md` › D14).

## Fișierele schimbate (necomise)
`aplicatii/excel.js`, `aplicatii/aplicatii.js` (doar cârligul `I.tintaTasta`; Word nu-l pune, regresul Word = 0),
`aplicatii/aplicatii.css` (Borders vechi `:not(.lh-ap-x-ref)` + 3 reguli), `aplicatii/date/excel.json` (regenerat din
`uia_excel.json` de acum: 17 suprafețe noi, nicio suprafață veche schimbată; `genereaza_excel.py --verifica` = 0).
Note: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D15), `de_verificat.md › RUNDA8-EXCEL` (R8-1 … R8-9),
`stare_autor.md`, `gata_pentru_critic.md`, `proba_grav.py` + ieșirile.

## NESIGUR
- [NEVERIFICAT] ce face No în „We found a typo…” și unde ajunge celula după Yes (R8-1); dacă literele merg în meniul de clic
  dreapta cu caseta „Type to search” deasupra (R8-2); focusul și ordinea Tab în Sort Warning / Sort (R8-3, R8-4).
- Lista ▾ „More Functions...” rămâne mesaj central, cum cere suplimentul (referința are totuși `dialog.FunctionWizard`).
- Galeria Fill Color ▾ (`lista.CellFillColorPicker`) nu e desenată: Fill ▾ dă încă mesajul central (nu e GRAV; 512 puncte O3).
