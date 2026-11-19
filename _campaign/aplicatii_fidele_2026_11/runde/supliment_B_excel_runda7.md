# Supliment la promptul rundei 7 (valul B-excel, runda a 2-a) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/7/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Excel e în biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` din runda 6, COMIS local pe `fidelitate-aplicatii`
  (cb86fbc3; nepublicat) — `git restore` pe fișierele tale funcționează la pasul 7. O4 101→43, O5 154→113, O9 41→34.
- Criticul rundei 6 (`runde/6/critic.md`, unghi aspect): **GRAV 10** (X1-X10). Regresul Word curat.
- Word are 8 GRAV deschise din valul lui (`runde/5/critic.md`): NU le repari aici; Word nu are voie să se strice.
- **Utilizatorul are propriul Excel deschis** (un registru al lui). Excel real doar prin `win32com.client.DispatchEx`, invizibil,
  DisplayAlerts=False, fișiere cu nume unice în %TEMP%; NICIODATĂ `Dispatch`/`GetObject`/`GetActiveObject`, niciodată
  `taskkill /IM EXCEL.EXE` — închizi doar PID-ul instanței tale.

## Ținta rundei 7 = cele 10 GRAV din `runde/6/critic.md`, în ordinea asta (cea mai mare pagubă pentru elev întâi)
1. **X9** — telefonul (360-390 px): după atingerea unei celule, tastatura telefonului trebuie să scrie în ea (focus într-un câmp
   care primește compunerea; proba prin CDP `Input.imeSetComposition`/`Input.insertText`, ca la Word, N3). Zonele de atins
   (I1, ≥ 32 px) doar acolo unde contractul o cere, fără să strici dimensiunile de pe desktop față de referință.
2. **X5** — Σ (AutoSum, m2-l08): zona propusă încadrată punctat și ALEASĂ (scrisul/tragerea elevului o înlocuiește), Enter
   confirmă; fără celulă blocată în editare. Săgeata ▾ de lângă Σ: lista din referință (Sum, Average, Count Numbers, Max, Min…)
   cu cel puțin Average funcțional (lecția), restul după referință sau mesajul central.
3. **X6** — o funcție necunoscută (`=DACĂ(…)`, m2-l09) intră în celulă și arată `#NAME?` ca Excel real (citește `com_r6*.json`
   din `runde/6/critic_probe/`); nicio formulă nu blochează celula în editare fără mesaj.
4. **X1** — afișarea numerelor în formatul General: rotunjire la lățimea coloanei (=25/3 → „8,333333”), numere prea lungi în
   notație științifică / rotunjite, datele prea late → „########”, ca în Excel real (verifici cu `Range.Text` prin COM, nu din memorie).
5. **X2** — textul lung trece peste celulele vecine goale din dreapta (și se oprește la prima nevidă).
6. **X7** — lățimea coloanei (m1-l06): tragerea liniei dintre antete (cursor ↔), dublu clic = potrivire automată, fereastra
   Column Width din `uia_excel.json › dialog.ColumnWidth`; Fill Color, Borders ▾, Percent Style, Wrap Text funcționale pe
   drumul lecției (galeriile/listele după referință, unde există; altfel mesajul central).
7. **X10** — Sort cu mai multe criterii (m2-l10) după `dialog.SortDialog` (Add Level, Sort by / Then by, Order, OK) și
   `dialog.SortWarning`; graficele (m2-l11) după `dialog.ChartChangeType`, `panglica_context.Ctx_ChartDesign`/`Ctx_Format`:
   cel puțin inserarea graficului din lecție și filele contextuale. Dacă graficele nu încap în runda asta, le lași ultimele,
   cu `stare_autor.md` la zi.
8. **X8** — m1-l03: Ctrl+N = registru nou (numele după regula Excel: Book2, Book3…), Ctrl+W = închidere (cu modificări:
   referința Excel pentru „Save your changes” NU există → mesajul central standard + rând în `de_verificat.md`); dublu clic
   pe fila foii = redenumire pe loc (textul NU ajunge în celulă); panoul din stânga al Save As după `dialog.FileSaveAs` din
   `uia_excel.json`. **Ctrl+S pe un registru nou**: ce fereastră deschide Excel-ul de pe PC NU e capturat (la Word e „Save
   this file”, dar asta nu e dovadă pentru Excel) → NU inventezi; lași cum e, cu rând în `de_verificat.md` („DE ACOPERIT”).
9. **X3** — Acces rapid: pictogramele Save / Undo / Redo (SVG Fluent, MIT: cele din `aplicatii/panglica.js`, sau din `jocuri/_motor/panglica-{excel,word}.js` — acestea doar
   citire, copiate în `aplicatii/`).
10. **X4** — banda de sub foaie: filele foilor, „+” și bara de derulare orizontală așezate ca în referință (dreptunghiurile din
    `uia_excel.json`, scara 1,0, cadrul 1366×768 css); nimic nu acoperă rândurile foii.
Constatările [FARA_REFERINTA] din `runde/6/critic.md` le treci în `de_verificat.md` dacă nu sunt deja; nu le „repari” din memorie.
Mesajul central (MINOR din critic): să numească comanda cum o vede elevul (eticheta din referință), nu numele intern UIA.

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` · `runde/6/critic.md` · `runde/6/raport_constructor.md` · `runde/6/diferente.md` ·
apoi codul din `aplicatii/` (Grep înainte de Read; `excel.js` are ~1650 de rânduri — pe bucăți; `date/excel.json` și
`referinte/uia_excel.json` NU se citesc întregi, ci prin Python, pe chei).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 7 --paralel 3` (~35-60 min). NU scrii NIMIC sub `aplicatii/`
  până nu s-a terminat (lucrezi într-o copie în %TEMP% și o aduci după, cum s-a făcut bine în runda 6). Pornirea așteptată =
  finalul rundei 6: O1 61, O2 13392, O3 20337, O4 43, O5 113, O6 0, O7 353, O8 102, O9 34, porți 41 (doar cum_fac).
- Între pași: `--doar O4,O5,O9`. Pasul 7: măsurarea întreagă, pornită DUPĂ ultima scriere sub `aplicatii/`; orice oracol sau
  poartă crește → `git restore` pe fișierele tale.
- Proba ta: `runde/7/proba_grav.py` (gesturi reale pe cele 10 GRAV, înainte și după, ieșirile în json) + `runde/6/proba_excel.py`
  ca regres + REGRESUL Word la 0 picate: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`,
  `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (C:/Users/...): scrii „%TEMP%”.

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/7/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, fiecare GRAV: reparat cum + proba + rezultatul) și
`runde/7/gata_pentru_critic.md` (doar unde e ce și cum se deschide poligonul). Fără commit, fără push. Atingi doar `aplicatii/`
(plus notele tale în `runde/7/`, `de_verificat.md`, `de_aprobat.md`). Lecțiile, jocurile, `jocuri/_motor/`, referințele,
oracolele și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU — rundele 1-6 au trecut toate de 300k; runda 6 a ajuns la 455k)
- După FIECARE GRAV terminat și probat, actualizezi `runde/7/stare_autor.md` (ce e gata, ce urmează, ce fișiere, ce numere, ce
  măsurătoare rulează) — așa oricând te oprești, un constructor proaspăt continuă.
- La ~200k de context te oprești la prima graniță curată de după și raportezi „PREDARE”. Zece GRAV nu încap bine într-un singur
  context: e normal să predai după 4-6. Un GRAV terminat bine valorează mai mult decât patru începute.
- Ieșirile mari de Bash în fișier, în context doar coada.
