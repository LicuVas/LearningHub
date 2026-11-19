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

## Constructorul 2 (pe d0ab48fd)
- **X8 GATA** (`proba_grav.py --doar X8` = 0 picate, `proba_grav_c2_x8.log`; O4 pe `excel-ctrl-w-modificat` 5 → 0, rulat pe un dosar
  de scenarii din %TEMP%). Cod: `SALVARE_NOUA` / `INTREBARE_INCHIDERE`, `dialogStare()` + `butoaneJos()`, `M.mod` din startul
  cu celule (`registru_saved_inainte = false`), `inchideRegistru` → fereastra, `inchideRegistruAcum`, `raspunsInchidere`,
  `salveaza()` → `dialog.save_this_file`, OPT.tinta/editabil pe cele două chei. Două verificări din proba lui x8 rescrise după
  referință (File › Save = pagina Save As, D16; Save în întrebare = din caseta ei, D17). Regres `7/proba_grav_cont2` = 3 picate,
  toate D18 (probă veche contrazisă de referință).

- **K6 GATA** (`proba_grav.py --doar K6` = 0 picate, `proba_grav_c2_k6.log`). Cod în `excel.js`, lângă plasa oracolelor: `kt`,
  `ktTinte`, `ktArata`, `ktLitera` copiate din `word.js:1985-2071` (Word neatins), plus `scurtaturaPanglica` (Alt+= → `autoSum()`,
  eveniment `tasta_acces` cu ținta Sum; Ctrl+Shift+% → `procent()`, eveniment `ctrl_shift_5`); Esc în modul KeyTips închide și
  lista deschisă de o tastă (Alt, H, U).

- **Regresul constructorului 2** (`regres_c2_rezumat.txt`): Word 2-5 + telefon = 0; Excel `6/proba_excel` 0, `7/proba_grav_cont` 0,
  `8/proba_grav` 0/65; `7/proba_grav` 2 (D14, ca la constructorul 1); `7/proba_grav_cont2` 3 (D18, toate X8, explicate de referință).
- **Pasul 7 FĂCUT** după ultima scriere sub `aplicatii/` (K6), singur pe mașină: `masurare_c2.log` → `masurare.json`: O1 61,
  O2 13392, O3 21586, **O4 50** (pornire 69, constructorul 1 56), O5 113, O6 0, O7 343, O8 102, O9 34, porți 41 (cum_fac; test_joc
  0, controale_taiate 0); lacăt ok, regres niciunul; `ingheata.py --verifica` = 0. Un constructor 3 pornește de la acest `masurare.json`. Măsurarea
  parțială de dinainte (O4 56 → 50) a mutat `masurare.json` al constructorului 1; copia lui: `masurare_constructor1.json`.

### Întrebarea O3: de ce listele Σ și Borders n-au scăzut O3 (21586 → 21586)
**Răspuns: oracolul nu vede deloc biblioteca. Nu e o greșeală în simulator și nici în numele suprafeței.** O3 (și O2) randează
doar paginile din `inventar.json` (60 de pagini: lecții și jocuri), iar niciuna nu încarcă `aplicatii/aplicatii.js`; poligonul
`aplicatii/poligon.html` nu e în inventar. Dovezi:
1. randarea pe care a folosit-o O3 în măsurarea constructorului 1 (`oracole/_iesiri/randare_f665709fad68106e.json`, 12:29): 323 de
   instanțe Excel pe 18 pagini, toate din simulatoarele vechi (`jocuri/excel-pas-cu-pas-viii` 79, `jocuri/excel-viii` 49,
   `lectii/viii/m1-l02` 16…); NICIO pagină cu `aplicatii/`, NICIO cheie `lista.*` sau `dialog.save*` în vreo instanță Excel;
2. `grep -rl "aplicatii/aplicatii.js" lectii jocuri --include=*.html` = nimic;
3. `runde/8/iesiri/O3/oracol_ui.json › pe_suprafata`: `excel.lista.AutoSum` 43 puncte, `randari: 0`; `excel.lista.Borders` 134,
   `randari: 0` — identic cu `runde/7/iesiri/O3/oracol_ui.json` (suprafață nedesenată de nicio pagină = toate unitățile lipsă);
4. `jurnal.jsonl`: O3 și O2 n-au scăzut în NICIO rundă B (Word 1-5, Excel 6-7); au crescut doar la rundele `acoperire` (referințe noi).
Plasa ar funcționa dacă o pagină ar avea biblioteca: `structura_lib.py:1604-1622` cheamă `window.LHAplicatii.deschideSuprafata(k)`
pentru fiecare cheie necitită, `aplicatii.js:591` pune `W.LHAplicatii = L`, iar `excel.js › I.deschideSuprafata` deschide
`lista.AutoSum` / `lista.Borders` (probat în K3). Deci O3 pe Excel va începe să se miște abia în etapa C, când o lecție/un joc
trece pe bibliotecă. **Constatare pentru orchestrator (oracolul nu l-am atins):** în etapa B, O3/O2 nu pot măsura munca
constructorului; progresul se vede doar în O4/O5/O9 și în probe.

## Rămâne (în ordinea suplimentului)
1. ~~**X8**~~ (gata, vezi mai sus) — `dialog.save_this_file` (Ctrl+S / Save din Acces rapid / File › Save pe registru nou; propune „Book1” fără extensie,
   `uia_excel.json` › Edit File name `v: Book1`; More options… → File › Save As) și `dialog.save_your_changes_to_this_file`
   (Ctrl+W / File › Close pe registru modificat: stare `dialog {titlu:'', intrebare, butoane, apasat}` ca word.js:1038;
   Save / Don't Save / Cancel ca word.js:1708-1712). De făcut: `OPT.tinta` (Edit File name → `camp:nume_fisier`, Save →
   `dialog_salvare:Save`) + `OPT.editabil` pentru cele două chei; `salveaza()` (excel.js, „Ctrl+S pe un registru nesalvat”);
   `inchideRegistru()` (`if (M.mod) return I.nesimulat(...)`); ramura `backstage` › Save din `I.la.clic`; `stare().dialog`.
   Proba e scrisă: `proba_grav.py › x8` (11 verificări, toate picate la pornire). ATENȚIE: `runde/7/proba_grav_cont2.py › X8`
   verifică mesajul central la Ctrl+W pe registru modificat → va pica după reparație; e cazul „probă veche contrazisă de
   referință” (se scrie în raport, nu se repară proba).
2. ~~**K6**~~ (gata, vezi mai sus) — KeyTips (portează `word.js:1981-2071`: `kt`, `ktTinte`, `ktArata`, `ktLitera`; literele din `__nod.ta` al nodurilor
   din `date/excel.json`), Alt+= = `autoSum()` cu eveniment (gestTasta întoarce null pentru Alt+caracter → ascultător capture
   propriu care emite cu `I.emite`), Ctrl+Shift+% = `procent()` (la fel). Proba scrisă: `proba_grav.py › k6` (5 verificări).
   Alt, H, U trebuie să deschidă `lista.AutoSum` (MenuItem „More Options” `ta: Alt, H, U`).
3. **X10 graficele** — neîncepute de niciun constructor (constructorul 2 s-a oprit înainte, ca să încapă măsurarea în context).
   Fără probă scrisă și fără scenariu O4; O3 nu le va vedea (vezi întrebarea O3). Ce e deja în `date/excel.json`:
   `lista.ChartTypeColumnInsertGallery` (Menu › 4 grupuri 2-D/3-D Column/Bar cu 14 ListItem + MenuItem „More Column Charts...”),
   `context.grafic` = [`panglica_context.Ctx_ChartDesign` „Chart Design”, `panglica_context.Ctx_Format` „Format”],
   `dialog.ChartChangeType` (+ `#All Charts`). Faptul real: `uia_excel.json › acoperire_r7.fapte.h_grafic` = inserat „Clustered
   Column”, file după: „… Help, Chart Design, Format”, fila aleasă Chart Design (primul grup „Style 1”), `grafice_pe_foaie` 1,
   `grafic_activ` true. Plan: `listaRef('lista.ChartTypeColumnInsertGallery', ancora)` din butonul Insert Column or Bar Chart
   (idMso-ul lui: Grep în `date/excel.json › panglica.TabInsert`), ListItem → grafic pe zona aleasă (strat peste grilă, bare din
   valori, titlu, axe), filele contextuale vizibile cât graficul e ales, Chart Design aleasă; Change Chart Type = `deschideDialog`.
   Lecția: `lectii/viii/m2-l11`. Întâi proba (`proba_grav.py › x10`), apoi codul.
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
