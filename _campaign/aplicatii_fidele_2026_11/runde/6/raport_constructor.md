# Runda 6 · etapa B · Excel · unghiul aspect — raportul constructorului (pașii 1-7)

## Numerele (întregi, `masurare_pornire.json` → `masurare.json`; lacătul reperelor ok la ambele)
| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți | suma |
|---|---|---|---|---|---|---|---|---|---|---|---|
| înainte | 61 | 13392 | 20337 | 101 | 154 | 0 | 353 | 102 | 41 | 41 (cum_fac) | 34582 |
| după | 61 | 13392 | 20337 | **43** | **113** | 0 | 353 | 102 | **34** | 41 (cum_fac) | **34476** |
Regres: niciunul („n cu n pe O1-O9 și pe fiecare poartă”, `masurare_dupa.log`). Neconcludente: 0. Pornirea = finalul rundei 5.

Partea Excel (`iesiri/O4`, `O5`, `O9`):
- O4: 41 de scenarii Excel — 36 la fel ca Excel real, 0 diferențe, 0 „ecran ≠ stare”; 1 neexecutabil
  (`excel-salvare-ca`), 4 fără rezultat real probat (`excel-autocompletare-tab`, `excel-separator-virgula`,
  `excel-tragere-zona`, `excel-tragere-umplere-gest` — toate se joacă, dar realul lipsește). Partea Excel: 63 → 5.
- O5: 41 din 42 de gesturi Excel cu eveniment valid; picat doar `excel.tragere` (42 → 1).
- O9: Excel 7 din 8 (A-E, G, H); picat F (nicio lecție Excel nu încarcă biblioteca — etapa C) (8 → 1).
- O2/O3/O7/O8 nu se mișcă: se măsoară pe lecții, care încarcă încă simulatoarele vechi (tinta.md).

## FĂCUT (cu dovada)
- Excel în bibliotecă, generat din referință: `aplicatii/_unelte/genereaza_excel.py` → `aplicatii/date/excel.json`
  (46 de suprafețe, ~2363 noduri; `--verifica` = 0; `genereaza_word.py --verifica` = 0, deci `word.json` neschimbat).
- `aplicatii/excel.js`: grila cu `celula:<A1>` pe fiecare celulă, editarea în `input` în celulă, formulele pe românește
  („;”, „,”) cu forma engleză în stare, AutoSum, umplerea, Ctrl+D/R, copiere/decupare/lipire, sortarea cu antet, Merge &
  Center, Ctrl+Z/Y, F2/F4, Name Box, bara de formule, filele foilor (Add Sheet), Backstage, F12 → Save As, meniurile de
  clic dreapta, Acces rapid, bara de stare (Ready/Enter/Edit/Point, zoom). Dovada: O4 36/41 (mai sus).
- Aspectul zonei foii față de `uia_excel.json › zona_document`: `proba_excel.py` — 9/9 poziții în 8 px (Name Box,
  Formula Bar, A, C, 1, 5, Select All, Sheet1, Add Sheet), bara de stare „Ready”/„100 %”, titlul „Book1 - Excel”, ordinea
  filelor, Acces rapid Save/Undo/Redo. Înainte: Excel nu se deschidea (`proba_excel_inainte.json`, 2/2 picate); după:
  **0 din 20 picate** (`proba_excel_dupa.json`).
- Regresul Word pe worktree: `runde/5/proba_grav` 0, `runde/4/proba_grav` 0, `runde/4/proba_telefon` 0,
  `runde/3/proba_grav` 0, `runde/2/proba_grav` 0 (`regres_*.log`); `word2007_j2` = 0 în porți.
- Notele: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D27), `de_verificat.md › RUNDA6-EXCEL` (R6-1 … R6-7),
  `gata_pentru_critic.md`, `stare_autor.md`.

## Fișierele create / schimbate (necomise)
Noi: `aplicatii/excel.js`, `aplicatii/date/excel.json`, `aplicatii/_unelte/genereaza_excel.py`,
`aplicatii/profiluri/excel365.json`. Schimbate: `aplicatii/aplicatii.js` (1 linie), `aplicatii/aplicatii.css` (+73 de rânduri
la capăt, doar Excel), `aplicatii/poligon.html` (conținutul de probă Excel). Plus `runde/6/*` și `de_verificat.md`.

## NEFĂCUT (cu deblocatorul)
- `excel-salvare-ca` rămâne neexecutabil: pasul cere `mso:FileTab` + `mso:FileSaveAs`, idMso-uri care nu sunt pe ecranul
  real (File = `FileTabButton`; Save As din Backstage n-are idMso). Deblocare: scenariul rescris într-o rundă `acoperire`
  (R6-5). Drumul real (File › Save As › Browse, F12) funcționează și e probat în `proba_excel.py`.
- O5 `excel.tragere`: oracolul trage din mijlocul primei celule, unde Excel real selectează (nu mută). Mutarea zonei trăgând
  de chenar nu e simulată. Deblocare: mutarea prin chenar + o `demonstratie` / o regulă a oracolului pentru Excel.
- O9 F, O1, O2, O3, O8 pentru Excel: cer mutarea lecțiilor (etapa C).
- Tastele de acces (KeyTips) în Excel: nesimulate în runda asta (niciun gest O5 nu le cere).

## NESIGUR
- [NEVERIFICAT] ce face Excel la o formulă greșită (R6-1, R6-2), lunile scurte în afară de „mai” (R6-3), Ctrl+S pe registru
  nou (R6-4), Average/Count/Sum în bara de stare (R6-6), lățimea formatului General (R6-7).
- Celula în editare apare în stare cu `editare: true` și textul tastat (ca ecranul să fie starea, §3); citirea reală se
  face după Esc, deci pe cele două scenarii fără real nu se poate compara.
- Aspectul panglicii/Backstage-ului Excel nu are oracol pe poligon (O3 citește doar lecțiile): l-a desenat motorul comun
  din referință, dar nu l-a măsurat nimeni pe poligon.
