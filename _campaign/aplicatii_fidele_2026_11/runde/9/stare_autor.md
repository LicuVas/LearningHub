# Runda 9 · B-excel · starea constructorului 1

Pornirea: `runde/9/masurare_pornire.json` (O4 50, O5 113, O9 34; porți 41). Proba: `runde/9/proba_grav.py` (E1, E2, K1, E4, E3,
E5, X10). Înainte (cod neatins, `proba_grav_inainte.json`): 25 picate din 48.

## Gata și probat
- **E1** `excel.js`, ascultătorul Alt+literă din ferestre: pune `altSingur = false` înainte de `stopImmediatePropagation`
  (litera consumată de fereastră anulează „Alt singur”). Proba E1: 9/9 (Save As Alt+S + „abc”, Sort Warning Alt+S + „7”,
  Alt singur arată în continuare literele, Alt+Q fără control).
- **E2** `excel.js › tastaDialog`: Enter apasă controlul cu focusul doar dacă e `Button`; pe CheckBox / RadioButton apasă
  butonul implicit (`butonImplicit()`); Space neschimbat. Proba E2: 7/7.
- **K1** `excel.js › deseneazaNiveluri`: ține minte nivelul + caseta cu focusul (rândurile 2+), le refocusează după redesenare
  (`focusNivel`); alegerea din listă refocusează caseta ei; clicul pe o casetă din rândurile 2+ o focusează. Proba K1: 8/8
  (tastatura și mouse-ul, drumul m2-l10:63, Enter sortează cu `activat: fereastra:OK`).

- **E4** `excel.js › inchideDialog`: la închiderea lui `dialog.eroare_formula` fără Yes (No / Esc / Închidere), `M.edit.mod =
  'Edit'` (+ punct/pk/ales golite) și bara redesenată. `_2` / `_3` neatinse (R8-14). Proba E4: 10/10 (No și Esc: bara „Edit”,
  ← ×5 = `mutare_cursor` fără fereastră, „*” + Enter primește „=SUM(B2:B7)*B2:B6”).
- **E3** `excel.js › autoSum`: cu zona propusă, `M.edit.punct = true` și `pk` = zona (pornit din celula editată); în ramura
  Point a săgeților, `ales` se golește când `pk` înlocuiește zona. Proba E3: 9/9 (Σ, ▾ Average, Alt+= → „Point”; Enter → 48 / 8;
  Σ + ↓ → „=SUM(B9)” în editare, `referinta`; Σ + „B2:B6” → 40). Ce scrie exact săgeata după Σ = [NEVERIFICAT] (R9-1).

## Urmează (constructorul 2): X10 (graficele), apoi E5
Proba e scrisă: `proba_grav.py --doar X10` (2 verificări + erori; azi pică amândouă) și `--doar E5` (1 verificare). Extinde
proba X10 ÎNAINTE de cod (Change Chart Type, evenimentele §4, `stare().grafice`, Ctrl+Z, drumul m2-l11).

**X10 — unde e ce (Grep făcut, nimic scris):**
- butonul: `excel.js` `I.la.clic` › `switch` pe idMso (~`:2290`: `case 'AutoSumMenu_Dropdown': return listaRef('lista.AutoSum', elx)`);
  `ChartTypeColumnInsertGallery` (ta „Alt, N, C”, `date/excel.json › file › TabInsert`) cade azi în mesajul central.
- lista: `listaRef(cheie, anc)` (`excel.js:~1895`) desenează `lista.*` din `date/excel.json › suprafete`; rândurile = `meniu:<etichetă>`
  (`I.stare`/ținte la `:542`); ramura de alegere a rândului: `:~2462` (`if (lista === 'lista.AutoSum') …`). Plasa oracolelor:
  `I.deschideSuprafata` › harta `anc` (`:~2862`) — adaugă `'lista.ChartTypeColumnInsertGallery': 'ChartTypeColumnInsertGallery'`.
- filele contextuale: `date/excel.json › context.grafic` = [`panglica_context.Ctx_ChartDesign` „Chart Design”,
  `panglica_context.Ctx_Format` „Format”]; `cheieFila` (`excel.js:729`) știe deja de `panglica_context.*`; `deseneazaFile`
  (`:722`) și `activeazaFila` (`:739`) NU le desenează. Modelul de copiat: `word.js:594` (`contextActiv`), `:712-737`
  (filele `[data-lh-context]` adăugate în rândul filelor), `:948-951` (ieșirea din context → TabHome).
- referința: `uia_excel.json › acoperire_r7.fapte.h_grafic` (inserat „Clustered Column”; file după: „… Help, Chart Design,
  Format”; fila aleasă Chart Design, primul grup „Style 1”; `grafice_pe_foaie` 1; `grafic_activ` true);
  `dialog.ChartChangeType` (+ `#All Charts`) pentru Change Chart Type.
- lecția: `lectii/viii/m2-l11` (citește-i pașii înainte de cod).
- ATENȚIE la O4/O5: nicio cheie nouă în `suprafete.json` (înghețat); folosește doar cheile deja în `date/excel.json`.

**E5** (doar dacă încape curat): `confirma()` / motorul de calcul dau azi `#VALUE!` pentru `=SUM(B2:B7)*B2:B6`; real = vărsare
D2:D6 (432, 336, 384, 480, 288; `runde/8/critic_probe/com_r8.json`, `HasSpill: true`). Cere un rezultat-zonă în calcul +
celule „vărsate” în `stare().celule` și pe ecran + recalcul + Ctrl+Z. Dacă nu încape, rămâne pentru runda 10.

**MINOR găsit pe drum (neatins, fără referință):** Alt, 2 (Undo din Acces rapid) alege rândul „More Options” al split-butonului
(`meniu_derulant:Quick Access Toolbar/Undo`) → mesajul central „Undo … nu e simulată”. Același mecanism dă corect Alt, H, U →
lista AutoSum (K6). Ce face Alt, 2 în Excel real (Undo sau lista istoricului) nu e în referință.

## Numerele la predare (constructorul 1, după ultima scriere sub `aplicatii/`)
- Proba: `proba_grav_dupa.json` = 48 de verificări, 3 picate (X10 2, E5 1); E1 9/9, E2 7/7, K1 8/8, E4 10/10, E3 9/9.
- `masoara.py --runda 9 --doar O4,O5,O9 --compara runde/9/masurare_pornire.json` (`masurare_partial_c1.log`): O4 50, O5 113,
  O9 34 = ca la pornire; lacăt ok; regres niciunul. ATENȚIE: `runde/9/masurare.json` e acum această măsurare PARȚIALĂ (copia
  `masurare_partial_c1.json`); pasul 7 complet se compară cu `masurare_pornire.json`.
- Regresul (`regres.sh regres_c1` → `regres_c1_rezumat.txt`): Excel 8/0, 7cont/0, 6/0, 7/2 (D14), 7cont2/3 (D18) — identice cu
  runda 8; Word 5, 4, 4-telefon, 3, 2 = 0. `ingheata.py --verifica` = 0.
- Rularea regresului: `sh runde/9/regres.sh <prefix>` (secvențial, ~15 min).

## Fișiere atinse
`aplicatii/excel.js` (doar). Copia de siguranță = HEAD `30dbbe30` (`git restore aplicatii/excel.js`).
