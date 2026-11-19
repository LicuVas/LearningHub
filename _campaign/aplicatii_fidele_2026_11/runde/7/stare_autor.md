# Runda 7 · constructorul · STAREA (nota de predare pentru un constructor proaspăt)

## Unde e lucrul
- Măsurarea de pornire: `masoara.py --runda 7 --paralel 3`, pornită 04:53, ieșirea în `runde/7/masoara_pornire.log`
  + `runde/7/masurare.json`. NU se scrie nimic sub `aplicatii/` până nu se termină (apoi o copiezi în
  `runde/7/masurare_pornire.json`).
- Codul nou stă ÎNTÂI în copie: `%TEMP%/…/scratchpad/stage/aplicatii/` (copia lui `aplicatii/` + schimbările).
  Copia neatinsă (pentru proba „înainte”): `%TEMP%/…/scratchpad/stage0/aplicatii/`.
  Proba pe copie: `LH_SERVIT=<…/stage> python runde/7/proba_grav.py`.
- Pașii 2-4 scriși: `cadru.md`, `tinta.md`, `contra.md`. Proba: `runde/7/proba_grav.py`; „înainte” pe worktree:
  `proba_grav_inainte.json` (22 picate din 28 la X9/X5/X6).

## GRAV-urile (ordinea din supliment)
1. X9 — GATA în copie (proba 0 picate): `root mousedown preventDefault` în excel.js (ca word.js:2074) → focusul
   rămâne în caseta de intrare; clicul pe celulă îl readuce; factorul de telefon `tel()` = 1,7 la ≤ 480 px (celula
   108,8 × 32,3 px), calculatorul rămâne 64 × 19. Dispare și selecția albastră a browserului la tragere.
2. X5 — GATA în copie: `M.edit.ales` (textul ales) + `M.edit.propus` (chenarul punctat `.lh-ap-x-propus`); Σ alege
   zona; tastarea / Backspace / clicul / tragerea o înlocuiesc; Enter primește. Lista ▾ a lui Σ: FĂRĂ referință
   (uia_excel.json n-o are) → de_verificat (de scris: R7-1).
3. X6 — GATA în copie: jetoanele numelor de funcții acceptă diacritice (=DACĂ → #NAME?); `confirma()` cu formula
   respinsă arată mesajul central „Excel nu primește formula…” (fereastra reală nu e în referință → de_verificat R7-2).
4. X1 — GATA în copie: `inLatime(v, fn, u)` (u = (3·w−16)/22 cifre; calibrat pe com_r6.json, 12/12 puncte), `stare().text`
   = ecranul; lățimile pe foaie (`f.lat`, `f.latSet`, CONȚINUT opțional `latimi: {C: 90}`); numărul TASTAT lățește
   coloana (`latNecesar`); marginile textului 2 px (`.lh-ap-excel .lh-ap-x-c`). Stare nouă: `latimi_coloane`.
5. X2 — GATA în copie: `.lh-ap-x-curge .lh-ap-x-t{flex-shrink:0}`.
6. X7 — PARȚIAL în copie: linia dintre litere (`antet_coloana_margine:<X>`, col-resize), tragerea (Ctrl+Z), dublul clic
   (`potriveste`), Column Width… (câmp „8,11”, Enter/OK), clicul dreapta pe literă alege coloana. NEFĂCUT: Fill Color,
   Borders ▾ › All Borders, Percent Style, Wrap Text (încă mesajul central).
7. X10, X8, X3, X4 — neîncepute.
- Proba pe copie: `proba_grav.py` 57/57 ok (pg_stage4); `runde/6/proba_excel.py` pe copie 0/20 picate.
- Note scrise: `diferente.md` (D1-D14), `de_verificat.md › RUNDA7-EXCEL` (R7-1 … R7-7).

## Fișierele rundei (ADUSE în worktree la 05:25, necomise)
`aplicatii/excel.js`, `aplicatii/aplicatii.css` (bloc nou la capăt „runda 7”). Restul neatins.

## 05:25 — pornirea măsurată, codul adus, probele pe worktree
- Pornirea (`masurare_pornire.json`): O1 61, O2 13392, O3 20337, O4 43, O5 113, O6 0, O7 353, O8 102, O9 34, porți 41
  (cum_fac); lacăt ok; suma 34476 = finalul rundei 6.
- Pe copie: O4 Excel 36/41 la fel ca realul (aceleași 5 „RĂU” vechi), O5 113 (neschimbat).
- Pe worktree: `proba_grav.py` 0/57 picate (înainte, pe copia neatinsă: 44/57); `runde/6/proba_excel.py` 0/20; regresul
  Word `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 (`regres_*.log`).
- Pasul 7 pornit ~05:27: `masoara.py --runda 7 --paralel 3 --compara runde/7/masurare_pornire.json` → `masurare_dupa.log`.
  Orice creștere → `git restore aplicatii/excel.js aplicatii/aplicatii.css` + `regres.md`.
- URMEAZĂ pentru constructorul următor: X7 rest (Fill Color, Borders ▾, %, Wrap Text — Wrap cere înălțimi de rând),
  X10 (Sort cu niveluri, grafice), X8 (Ctrl+N/W, redenumirea filei, panoul Save As), X3 (pictogramele Acces rapid),
  X4 (banda de sub foaie). Lucrează tot într-o copie din %TEMP% până se termină măsurarea de pornire a rundei lui.

**06:02: pașii 1-7 TERMINAȚI pentru X9, X5, X6, X1, X2, X7 (parțial).** Măsurarea de după: suma 34476 → 34476, niciun
regres, lacăt ok. `raport_constructor.md` și `gata_pentru_critic.md` scrise. Fără commit, fără push. PREDARE: următorul
constructor ia X7 rest → X10 → X8 → X3 → X4 (după criticul rundei 7, dacă orchestratorul îl pornește întâi).

## Continuarea (constructorul 2) — 06:04 →
- Pornirea lui: `masurare_pornire_cont.json` = copia lui `masurare.json` de la 06:01 (suma 34476, lacăt ok).
- Copia de siguranță a fișierelor de dinainte (cu reparațiile constructorului 1, necomise): `%TEMP%/…/scratchpad/cont0/aplicatii/`
  (`excel.js`, `aplicatii.css`) + copia întreagă `%TEMP%/…/scratchpad/cont0full/aplicatii/` (pentru proba „înainte”, `LH_SERVIT`).
  La regres te întorci la ea, NU la `git restore` (ar șterge și X9/X5/X6/X1/X2/X7 parțial).
- Dovezi din Excel real: `com_r7c.py` → `com_r7c.json` (borduri, %, Fill, Wrap Text, sortarea pe 2 niveluri, Book2/Book3/Book4).
- Proba nouă: `proba_grav_cont.py` (X7r 17 cazuri + X10s 11 cazuri); înainte (worktree, 06:2x): **19/28 picate**.
- **X7 rest — GATA (17/17)**: Fill Color (galben, FFFF00), Borders ▾ (lista S11 + `GetLabelMso`, 13 efecte pe muchii comune,
  butonul = Bottom Border), Percent Style (`0%`), Wrap Text (comutator; rândurile au acum înălțimi variabile: `geomRand`/`PY`/
  `randLa`/`yRand`/`hRand` în `excel.js`); mesajul de la săgeata „More Options” numește butonul (Fill Color).
  Regres Excel după X7: `proba_grav.py` 0/57, `runde/6/proba_excel.py` 0/20.
- Note: `diferente.md` D15-D23, `de_verificat.md` R7-8 … R7-10.
- URMEAZĂ: **X10 Sort** — cazurile sunt deja în `proba_grav_cont.py › x10s` (11; înainte: 6 picate). Fereastra Sort se desenează
  din `dialog.SortDialog` (excel.js › `deschideDialog` / `arataFilaDialog`); de făcut: nivelurile (rândul „Sort Field” din DataGrid
  înlocuit cu rânduri proprii `[data-lh-nivel=N]`, câmpurile `[data-lh-camp=coloana|ordine]`, lista `.lh-ap-x-lista-combo`), Add
  Level („Then by” — eticheta NU e în referință: citat Microsoft necesar sau `de_verificat`), OK = sortarea pe niveluri
  (`com_r7c › sortare_doua_niveluri`), Sort Warning la butoanele A→Z/Z→A când e aleasă doar o coloană a unui tabel (Expand /
  Continue, `dialog.SortWarning`). Apoi X8 → X3 → X4 → graficele.

**PREDARE (constructorul 2), după X7 rest.** Pasul 7 terminat: `masurare_dupa_cont.log` — suma 34476 → 34476, lacăt ok, niciun regres
(`masurare.json` = măsurarea de după). Proba „după”: `proba_grav_cont_dupa.json` (X7r 0/17, X10s 6/11 — neatins). Regres Excel
0/57 + 0/20, Word 0 la toate cinci. `raport_constructor.md › Continuarea` și `gata_pentru_critic.md` scrise. Fără commit, fără push.
Următorul constructor: X10 (Sort cu niveluri + Sort Warning, apoi graficele) → X8 → X3 → X4. Pornirea lui de măsurare = `masurare.json`
de acum (copiată întâi într-un fișier al lui); copia de siguranță o face din worktree înainte de prima scriere.

## Continuarea (constructorul 3) — 07:0x →
- Pornirea lui: `masurare_pornire_cont2.json` = copia lui `masurare.json` de la 06:54 (suma 34476, lacăt ok).
- Copia de siguranță (cu reparațiile constructorilor 1 și 2, necomise): `%TEMP%/…/scratchpad/c3safe/aplicatii/` (`excel.js`,
  `aplicatii.css`) + copia întreagă `%TEMP%/…/scratchpad/c3full/aplicatii/` (proba „înainte” cu `LH_SERVIT`). La regres: copia, NU `git restore`.
- Proba nouă: `proba_grav_cont2.py` (X8, X3, X4); înainte, pe worktree, înaintea primei scrieri: **16 picate** (`proba_grav_cont2_inainte.json`).
- **X10 Sort — GATA (11/11, `proba_grav_cont_lucru3.json`)**: `excel.js › areAntet, sorteazaZona (niveluri), cereAvertizare, sorteaza,
  dialogSortare, pregatesteSort, deseneazaNiveluri, deschideListaSort, clicSortare, sortDinDialog, pregatesteAvertizare, sortDinAvertizare`;
  rândul „Sort Field” din referință = nivelul 0, Add Level îl clonează (+22 px), listele `.lh-ap-x-lista-combo`; Sort Warning la butoane
  și la Data › Sort când e aleasă doar o parte din coloanele tabelului. CSS: bloc „runda 7 · constructorul 3” la capătul `aplicatii.css`.
  Note: `diferente.md` D24-D26, `de_verificat.md` R7-11 … R7-14 („Then by” e din lecție, nu din referință).
- URMEAZĂ: X8 (Ctrl+N / Ctrl+W, redenumirea filei, panoul Save As) → X3 (pictogramele: Fluent MIT `save`, `arrow_undo`, `arrow_redo`
  de pe unpkg @fluentui/svg-icons@1.1.343, aceeași versiune ca `_cercetare/office_comenzi/icoane_build.py`) → X4 (barele de derulare
  desenate după `zona_document`) → graficele.
- **X8 — GATA (`proba_grav_cont2.py --doar X8`: 0 picate)**: `excel.js › REG, registruNou, inchideRegistru, arataGol (.lh-ap-x-gol),
  pornesteRedenumire / terminaRedenumire (.lh-ap-x-ff-in), marcheazaFolder` + panoul din stânga Save As în `arataFilaDialog`;
  `H` și `BOOK` sunt acum `let` (fiecare registru cu istoricul lui); `M.mod` = modificări nesalvate; `stare()`: `registru_activ`,
  `registre`. Filele nu se mai redesenează la schimbarea foii active (doar marcajul), ca dublul clic să nimerească fila.
  Ctrl+S pe registru nou: NEATINS (de_verificat R6-4 DE ACOPERIT). Note: D27-D31, R7-15 … R7-18.
- **X3 — GATA (`--doar X3`: 0 picate)**: `ICO_QAT` (Fluent save / arrow_undo / arrow_redo) în `date.icoane`, ▾ (chevron_down) la
  Customize Quick Access Toolbar. Note: D32.
- URMEAZĂ: X4 (barele de derulare după `uia_excel.json › zona_document`), apoi graficele; apoi regresul și pasul 7.
- **X4 — GATA (`--doar X4`: 0 picate)**: `excel.js › baraDerulare, aseazaBanda, aseazaCursoare, derulare` (după `paneReg.append`),
  `fel === 'derulare'` în `I.la.clic`; CSS „X4” la capătul `aplicatii.css`. Note: D33-D34, R7-19.
- HOTĂRÂRE: graficele (X10, m2-l11) NU le încep în contextul ăsta (~150k; ele cer inserarea graficului + filele contextuale
  Chart Design / Format din `panglica_context.*` + `dialog.ChartChangeType`). Urmează regresul, pasul 7, PREDARE.

**PREDARE (constructorul 3), după X10 Sort, X8, X3, X4.** Pasul 7: `masurare_dupa_cont2.log` — O1-O9 neschimbate, lacăt ok;
`controale_taiate` 0 → 1 = eroare de măsurare (clic expirat pe `vi/m2-l14`, pagină fără `aplicatii/`), re-rulată pe toate lecțiile = 0
(`regres.md`). `masurare.json` = măsurarea de după (suma 34477, din cauza erorii). Proba „după”: `proba_grav_cont2_dupa.json` 0/26,
`proba_grav_cont_dupa3.json` 0/28; regres Excel 0/57 + 0/20, Word 0 la toate cinci. Fără commit, fără push.
Următorul constructor: **graficele X10 (m2-l11)** — Insert › Insert Column or Bar Chart, filele contextuale `panglica_context.Ctx_ChartDesign`
/ `Ctx_Format`, `dialog.ChartChangeType`; pornirea lui de măsurare = `masurare.json` de acum (de preferat o măsurare nouă, fără eroarea
trecătoare); copia de siguranță din worktree înainte de prima scriere. Ctrl+S pe registru nou rămâne DE ACOPERIT (R6-4).
