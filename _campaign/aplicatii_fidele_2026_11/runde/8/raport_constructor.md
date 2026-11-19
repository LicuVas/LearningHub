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

---

# Constructorul 2 (continuă de la d0ab48fd; X8 și K6; X10 neînceput)

## Numerele
Pornirea rundei rămâne `masurare_pornire.json`; punctul intermediar = măsurarea constructorului 1 (copie: `masurare_constructor1.json`,
O4 56). Măsurarea parțială după X8 + K6 (`partial_c2_k6.log`, `--doar O4,O5,O9`): **O4 56 → 50**, O5 113 → 113, O9 34 → 34.
Măsurarea pasului 7 (`masurare_c2.log`, pornită după ultima scriere sub `aplicatii/`, singură pe mașină):

| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți | suma |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pornirea rundei (`masurare_pornire.json`) | 61 | 13392 | 21586 | 69 | 113 | 0 | 343 | 102 | 34 | 41 (cum_fac) | 35741 |
| constructorul 1 (`masurare_constructor1.json`) | 61 | 13392 | 21586 | 56 | 113 | 0 | 343 | 102 | 34 | 45 în măsurare (41 la re-rulare) | 35732 |
| **constructorul 2** (`masurare.json`, 14:39-15:45) | 61 | 13392 | 21586 | **50** | 113 | 0 | 343 | 102 | 34 | **41** (test_joc 0, controale_taiate 0, cum_fac 41, restul 0) | **35722** |

Lacăt: ok; neconcludente 0; „regres față de 8/masurare_pornire.json: niciunul (n cu n pe O1-O9 și pe fiecare poartă)”;
`ingheata.py --verifica` = 0 (351 fișiere, INTACT). De data asta porțile n-au avut timeout-uri (măsurarea a rulat singură, 66 min).
O4 50 = 56 − 5 (`excel-ctrl-w-modificat`) − 1 (`excel-alt-egal`).

Proba GRAV-urilor (`proba_grav.py`, toată): **0 picate din 65** (`proba_grav_c2_dupa.json`): K3 11/11, K5 8/8, K4 4/4, X5 8/8,
X8 13/13, K2 6/6, K1 9/9, K6 6/6. La predarea constructorului 1: 14 picate (X8 9, K6 5).

## Fiecare GRAV (constructorul 2)
- **X8 — reparat.** Ctrl+S și Save din Acces rapid pe un registru nou deschid „Save this file” (`uia_excel.json ›
  acoperire_r7.fapte.a_ctrl_s_registru_nou`: `dialog.save_this_file`, backstage null, focus în File name), cu „Book1” fără
  extensie în caseta File name (Edit File name `v: Book1`); Enter / Save salvează („Tema mea” → „Tema mea.xlsx”, titlul „Tema mea
  - Excel”), Cancel închide, More options… → pagina File › Save As (`more_options.backstage`). Ctrl+W și File › Close pe un
  registru modificat deschid „Save your changes to this file?”; `stare().dialog` = `{titlu: '', intrebare: 'Save your changes to
  this file?', butoane: [More options…, Save, Don't Save, Cancel], apasat: null}`, `registru_activ` Book1 (exact
  `scenarii_real/excel-ctrl-w-modificat.json`). Cancel lasă registrul, Don't Save îl închide nesalvat, Save salvează cu numele din
  caseta File name a ACESTEI ferestre și închide (D17). Conținutul pus la pornire într-un registru nou nesalvat contează ca
  modificare (`acoperire_r7.fapte.b_ctrl_w_modificat.registru_saved_inainte = false`); lecția poate da `modificat: false`, ca la
  Word. Cod: `excel.js` › `SALVARE_NOUA` / `INTREBARE_INCHIDERE`, `dialogStare`, `butoaneJos`, `M.mod` la pornire, `inchideRegistru`
  / `inchideRegistruAcum` / `raspunsInchidere`, `salveaza`, `implicitDialog`, `OPT.tinta` / `OPT.editabil`, ramura `fereastra` din
  `I.la.clic`. Proba: X8 13/13. O4: `excel-ctrl-w-modificat` 5 → 0.
- **K6 — reparat.** KeyTips ca în Word (codul din `word.js:1985-2071` copiat în `excel.js`, Word neatins): Alt arată literele
  filelor din referință (`file_panglicii › ta`: Home H, Insert N, Data A…), H trece pe Home și arată literele ei, 1 = Bold (A1 nu intră în editare),
  Alt, H, U deschide lista Σ ▾ și arată literele ei (`Alt, H, U, S`…); fiecare tastă emite `tasta_acces` (§4); Esc urcă un nivel și
  închide lista deschisă de o tastă. Alt+= = Σ (`panglica.TabHome › Sum`, AccessKey „Alt+=”): B5 → `=SUM(B2:B4)` = 24 după Enter,
  ca `scenarii_real/excel-alt-egal.json`; Ctrl+Shift+% = Percent Style (0,25 → 25%). Partea comună nu dă gest pentru Alt+caracter /
  Ctrl+Shift+cifră, deci Excel le prinde singur și emite `tasta_acces` (Sum) / `ctrl_shift_5` (Percent Style). Proba: K6 6/6.
  O4: `excel-alt-egal` 1 → 0.
- **X10 graficele — NEFĂCUT** (neînceput; m-am oprit ca măsurarea și raportul să încapă sub ~200k de context). Planul, cu
  faptele din referință (`h_grafic`, cheile din `date/excel.json`), e în `stare_autor.md` › Rămâne › 3.

## Întrebarea O3 (de ce listele Σ și Borders n-au scăzut O3)
Oracolul O3 (și O2) randează doar cele 60 de pagini din `inventar.json`; niciuna nu încarcă `aplicatii/aplicatii.js`, iar
poligonul nu e în inventar. Randarea folosită în măsurarea constructorului 1 (`oracole/_iesiri/randare_f665709fad68106e.json`)
are 323 de instanțe Excel pe 18 pagini, toate din simulatoarele vechi, fără nicio cheie `lista.*` sau `dialog.save*`;
`excel.lista.AutoSum` (43 puncte) și `excel.lista.Borders` (134) au `randari: 0` și înainte, și după. În `jurnal.jsonl`, O2/O3 n-au
scăzut în nicio rundă B (Word 1-5, Excel 6-7). Nu e o greșeală în simulator: plasa oracolului (`structura_lib.py:1604-1622`)
ar citi listele, fiindcă `aplicatii.js:591` pune `window.LHAplicatii` și `excel.js › I.deschideSuprafata` le deschide. **Constatare
(oracolul neatins):** în etapa B, O3/O2 nu pot vedea munca pe bibliotecă; se vor mișca abia când o pagină din inventar trece pe
bibliotecă (etapa C). Detaliile, cu dovezile: `stare_autor.md` › „Întrebarea O3”.

## Regresul (constructorul 2, `regres_c2_rezumat.txt`)
- Word: `5/proba_grav` 0, `4/proba_grav` 0, `4/proba_telefon` 0, `3/proba_grav` 0, `2/proba_grav` 0.
- Excel: `6/proba_excel` 0, `7/proba_grav_cont` 0, `8/proba_grav` 0 (toate cele 65); `7/proba_grav` 2 (X6, D14 — de la constructorul
  1, neschimbat); `7/proba_grav_cont2` **3**, toate pe X8 și explicate de referința nouă (D18): mesajul central la Ctrl+W pe
  registru modificat (:51) e acum fereastra reală; startul `{A1: Ana}` al verificării „Ctrl+W pe singurul registru, nemodificat”
  (:61) e acum registru modificat (`registru_saved_inainte = false`), deci Excel întreabă, iar urmarea ei (:64, Ctrl+N din Excel
  gol) nu mai are Excel gol. Probele vechi NU sunt schimbate.

## Abateri de la supliment (cu citat; de judecat de critic)
- **D16** File › Save din Backstage pe registru nou: suplimentul cerea „Save this file”; referința Excel are doar Ctrl+S. Am lăsat
  pagina File › Save As (ca `word.js:1698`), [NEVERIFICAT] → `de_verificat` R8-10. Verificarea corespunzătoare din `proba_grav.py`
  (scrisă de constructorul 1 după supliment) e rescrisă pe pagina Save As, apoi Ctrl+S → Cancel.
- **D17** Save în „Save your changes…” pe registru nou: suplimentul scria „prin Save this file dacă e nou”; referința arată că
  fereastra are caseta ei File name (v „Book1”, cu focusul). Save salvează din ea, fără a doua fereastră (ca `word.js:1715`);
  după Save Excel real n-a fost capturat → `de_verificat` R8-11. Verificarea din `proba_grav.py` e rescrisă (focus + „Book1” în
  caseta ei, „Lista” + Save → `salvare_si_inchidere`, Excel gol).

## Fișierele schimbate de constructorul 2 (necomise)
`aplicatii/excel.js` (singurul fișier de cod). Note: `runde/8/proba_grav.py` (x8: două verificări rescrise, D16/D17),
`diferente.md` (D16-D18), `de_verificat.md › RUNDA8-EXCEL` (R8-10, R8-11), `stare_autor.md`, `gata_pentru_critic.md`, acest
raport; ieșirile `proba_grav_c2_*`, `regres_c2_*`, `partial_c2_k6.log`, `masurare_c2.log`, `masurare_constructor1.json`.

## NESIGUR (constructorul 2)
- D16 și D17 (mai sus): alegeri după referință și după Word, contra textului suplimentului.
- Numele gestului pentru Ctrl+Shift+% (`ctrl_shift_5`) nu e în `suprafete.json › gesturi` (lista are doar `ctrl_shift_<literă>`);
  Alt+= e emis ca `tasta_acces` (e AccessKey-ul lui Sum în referință).
- More options… din „Save your changes…” = mesajul central (efectul nu e capturat, R8-11).
- Rămase pe O4 (nu sunt GRAV-uri ale criticului 7): `excel-numere-afisare` 6, `excel-autofit-latime` 1, `excel-autocompletare-tab`
  1, `excel-separator-virgula` 1 (celula în editare apare în `stare().celule`).

