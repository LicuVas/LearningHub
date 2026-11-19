# Runda 8 · B-excel · starea constructorului (predare)

## Gata și probat (`proba_grav.py`, gesturi reale, headless, doar 127.0.0.1)
Înainte (cod neatins, `proba_grav_inainte.json`): 49 picate din 64. Pe ce e gata acum: K3, K5, K4, X5, K2, K1 = 0 picate.
- **K3** meniuri/liste deschise: `tastaMeniu` (↓/↑ cu `lh-ap-ales`, Enter, Esc, litera `ta`, restul `fara_efect`); `listaRef`
  desenează `lista.AutoSum` și `lista.Borders` din `date/excel.json` (rândurile = `meniu:<etichetă>`; Borders își ia idMso-ul și
  pictograma din `BORD_LISTA`); plasa `deschideSuprafata('lista.AutoSum'|'lista.Borders')`.
- **K5** modul Point cu săgeata (`ed.pk` = referința scrisă de săgeată/clic; `insereaza`, Backspace, Delete, Home/End, F2 și
  tragerea o uită); ferestrele `dialog.eroare_formula` / `_2` / `_3` (`fereastraEroare`, `raspunsEroare`, `M.mesaj` =
  `fereastra_mesaj`); restul erorilor (ex. „=” singur) = mesajul central de dinainte.
- **K4** AVEDEV în `FN` + calculul; completarea = prima funcție alfabetică (dă exact `excel-av-tab` / `excel-aver-tab`).
- **X5** lista ▾ a lui Σ pe Home și Formulas; `autoSum(fn)` cu SUM/AVERAGE/COUNT/MAX/MIN; More Functions... = mesajul central.
- **K2 + K1** `tastaDialog` (Tab/Shift+Tab prin `controaleDialog`, Enter/Space prin `apasaInDialog` = același drum ca clicul +
  `activat`, ↑/↓ în grupul radio, Alt+↓ pe casetele Sort + lista lor), `FOCUS0` (Sort → OK, erorile → Yes/OK), Alt+literă
  (ascultător capture, ca word.js) cu `tasta_acces`; ferestre una peste alta (`dialog.sub`): Sort cu nivel gol →
  `dialog.SortDialog_eroare_nivel_gol`.
- Comun: `aplicatii.js` are cârligul opțional `I.tintaTasta` (ținta tastei citită de aplicație înainte de gest; doar Excel îl pune).
- `date/excel.json` regenerat din `uia_excel.json` de acum (17 suprafețe noi, nimic vechi schimbat; `--verifica` = 0).

## Rămâne (în ordinea suplimentului)
1. **X8** — `dialog.save_this_file` (Ctrl+S / Save din Acces rapid / File › Save pe registru nou; propune „Book1” fără extensie,
   `uia_excel.json` › Edit File name `v: Book1`; More options… → File › Save As) și `dialog.save_your_changes_to_this_file`
   (Ctrl+W / File › Close pe registru modificat: stare `dialog {titlu:'', intrebare, butoane, apasat}` ca word.js:1038;
   Save / Don't Save / Cancel ca word.js:1708-1712). De făcut: `OPT.tinta` (Edit File name → `camp:nume_fisier`, Save →
   `dialog_salvare:Save`) + `OPT.editabil` pentru cele două chei; `salveaza()` (excel.js, „Ctrl+S pe un registru nesalvat”);
   `inchideRegistru()` (`if (M.mod) return I.nesimulat(...)`); ramura `backstage` › Save din `I.la.clic`; `stare().dialog`.
   Proba e scrisă: `proba_grav.py › x8` (11 verificări, toate picate la pornire). ATENȚIE: `runde/7/proba_grav_cont2.py › X8`
   verifică mesajul central la Ctrl+W pe registru modificat → va pica după reparație; e cazul „probă veche contrazisă de
   referință” (se scrie în raport, nu se repară proba).
2. **K6** — KeyTips (portează `word.js:1981-2071`: `kt`, `ktTinte`, `ktArata`, `ktLitera`; literele din `__nod.ta` al nodurilor
   din `date/excel.json`), Alt+= = `autoSum()` cu eveniment (gestTasta întoarce null pentru Alt+caracter → ascultător capture
   propriu care emite cu `I.emite`), Ctrl+Shift+% = `procent()` (la fel). Proba scrisă: `proba_grav.py › k6` (5 verificări).
   Alt, H, U trebuie să deschidă `lista.AutoSum` (MenuItem „More Options” `ta: Alt, H, U`).
3. **X10 graficele** — neîncepute (galeria `lista.ChartTypeColumnInsertGallery`, filele `panglica_context.*`,
   `dialog.ChartChangeType`). Fără probă scrisă încă.
- O4 după runda 8 = 56 (diferențe Excel 34 → 21). Rămase pe Excel: `excel-ctrl-w-modificat` 5 (X8), `excel-alt-egal` 1 (K6),
  `excel-numere-afisare` 6 (R7-3/R7-4), `excel-autofit-latime` 1 (R7-6), și câte 1 pe `excel-autocompletare-tab` /
  `excel-separator-virgula`: în timpul editării, `stare().celule` are celula editată (`editare: true`), iar Excel real n-o are
  (`__LIPSA__`). Schimbarea convenției poate strica probele vechi care citesc editarea din `celule` — de cântărit.
- Opțional (O3, nu GRAV): galeria Fill Color ▾ (`lista.CellFillColorPicker`, 512 puncte O3) cu No Fill / Yellow; restul
  culorilor n-au RGB în referință.

## Fișiere atinse
`aplicatii/excel.js`, `aplicatii/aplicatii.js` (doar cârligul), `aplicatii/aplicatii.css` (Borders vechi `:not(.lh-ap-x-ref)` +
3 reguli noi la capăt), `aplicatii/date/excel.json` (regenerat). Copia de siguranță = HEAD `4b53a65a` (`git restore`).

## Regres
Excel: `7/proba_grav_cont` 0, `7/proba_grav_cont2` 0, `6/proba_excel` 0; `7/proba_grav` 2 = X6 „=SUM(B2:B4)B2” (proba veche
cere mesajul central; referința nouă `dialog.eroare_formula` dă fereastra „We found a typo…”; vezi `diferente.md` › D14).
Word: `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 fiecare (`regres_word.txt`).

## Măsurarea (pasul 7, făcută pe codul de mai sus)
`masurare.json`: O4 69 → 56, restul O1-O9 neschimbate; porțile 41 → 45 în măsurare (timeout-uri pe pagini fără `aplicatii/`),
re-rulate singure → 41 (`regres.md`). Un constructor care continuă: pornirea lui = `runde/8/masurare.json` + `regres.md`
(sau o copie `masurare_pornire_cont.json`). ATENȚIE: `oracole/porti.py` rulat direct rescrie `oracole/porti.json` (reper
înghețat) → copiază-l și pune-l la loc cu `git checkout`, apoi `ingheata.py --verifica`.
