# Supliment la promptul rundei 8 (valul B-excel, runda a 3-a) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/8/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Excel e în biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/`. Runda 7 e COMISĂ local pe `fidelitate-aplicatii`,
  nepublicată, așa că `git restore` pe fișierele tale funcționează la pasul 7. Runda 7 a avut 3 constructori la rând
  (raportul: `runde/7/raport_constructor.md`; regulile vechi le găsești acolo, nu le reface).
- Criticul rundei 7 (`runde/7/critic.md`, unghiul gest_tastatura) a închis X1, X2, X3, X4, X6, X7, X9. **GRAV 9** deschise:
  X5, X8, X10 (doar graficele) și K1-K6.
- După runda 7 a rulat o rundă `acoperire` pe Excel (`runde/7/acoperire_excel.md`), care a adus referințe din Excel REAL:
  - în `referinte/uia_excel.json › suprafete`: `dialog.save_this_file`, `dialog.save_your_changes_to_this_file`,
    `lista.AutoSum`, `dialog.SortDialog#Add Level`, `lista.SortDialog_*`, `dialog.SortDialog_eroare_nivel_gol`,
    `dialog.eroare_formula` / `_2` / `_3`, `lista.CellFillColorPicker`, `lista.Borders`, `lista.ChartTypeColumnInsertGallery`,
    `bara_stare#selectie_numere`, `lista.FileSaveAs_navigare`;
  - faptele în `uia_excel.json › acoperire_r7.fapte`;
  - 12 scenarii noi în `scenarii/excel/` + `referinte/scenarii_real/`: `excel-point-*`, `excel-av-tab`, `excel-aver-tab`,
    `excel-alt-egal`, `excel-ctrl-w-modificat`, `excel-ctrl-n`, `excel-column-width-enter`, `excel-sortare-doua-niveluri`,
    `excel-numere-afisare`, `excel-autofit-latime`, `excel-wrap-de-doua-ori`; plus `excel-salvare-ca`, rescris.

  Oracolul O4 le joacă acum pe bibliotecă: o parte din ce era „mesaj central” sau „din memorie” se vede acum ca diferență.
- Word are 8 GRAV deschise din valul lui (`runde/5/critic.md`). NU le repari aici, dar Word nu are voie să se strice.
- Excel real îl folosești doar prin `win32com.client.DispatchEx`, invizibil, cu `DisplayAlerts=False` și fișiere cu nume
  unice în %TEMP%. NICIODATĂ `Dispatch` / `GetObject` / `GetActiveObject`, niciodată `taskkill /IM EXCEL.EXE`; închizi
  doar PID-ul instanței tale (îl iei din `app.Hwnd`). Utilizatorul își poate deschide oricând Excel-ul lui.

## Ținta rundei 8 = cele 9 GRAV din `runde/7/critic.md`, în ordinea asta (paguba pentru elev întâi)
1. **K3** — cu meniul de clic dreapta sau cu o listă (Borders ▾, Fill ▾, AutoSum ▾) deschise, tastele NU ajung în foaie:
   - săgețile mută alegerea în meniu, Enter alege, Esc închide;
   - literele de acces din `uia_excel.json › meniu_contextual.*` (Cut T, Copy C, Delete… D, Format Cells… F; pe filă:
     Rename R…) aleg comanda;
   - orice altă tastă e fără efect, cu eveniment. Ca în `word.js`, dacă Word o face deja (Grep întâi).
2. **K5** — modul Point: în editarea unei formule, după `=`, `+`, `-`, `*`, `/`, `(`, `;`, săgeata scrie adresa celulei
   vecine și o mută la apăsări repetate. Enter primește formula. Bara de stare arată „Point”. Referința:
   `scenarii_real/excel-point-egal-sus.json` și `excel-point-plus-dreapta.json`. Mesajul fals „Excel nu primește formula”
   dispare de pe drumul ăsta. Ferestrele reale de eroare a formulei (`dialog.eroare_formula*`) înlocuiesc mesajul central
   acolo unde referința le are.
3. **K4** — completarea funcțiilor: `=AV` + Tab → `=AVEDEV(`, `=AVER` + Tab → `=AVERAGE(` (`excel-av-tab`,
   `excel-aver-tab`). AVEDEV trebuie să existe și să calculeze ca Excel (0,666667 pe 9, 7, 8). Ordinea listei de completare
   NU e capturată: alegerea primei funcții o iei doar din scenariile reale, nu inventezi lista vizibilă.
4. **X5** — lista ▾ de lângă Σ după `lista.AutoSum`: Sum, Average, Count Numbers, Max, Min, More Functions.... Average
   pe B8 → `=AVERAGE(B2:B7)` cu zona aleasă, ca la Σ (lecția m2-l08:63). Count Numbers, Max și Min la fel. More
   Functions... = mesajul central. Lista de pe Formulas e identică (faptele acoperirii).
5. **X8** — m1-l03:
   - Ctrl+S, butonul Save din Acces rapid și File › Save pe un registru NOU deschid `dialog.save_this_file`, ca la Word.
     Word are deja fereastra: refolosește codul ei, dacă e în partea comună, fără să schimbi Word. More options… duce la
     File › Save As.
   - Ctrl+W și File › Close pe un registru modificat deschid `dialog.save_your_changes_to_this_file` (More options…, Save,
     Don't Save, Cancel; `excel-ctrl-w-modificat`). Save salvează (prin Save this file dacă e nou) și închide, Don't Save
     închide, Cancel lasă registrul.
   - În Chrome pe calculator, Ctrl+W / Ctrl+N nu ajung la pagină: drumul File › Close / File › New trebuie să dea exact
     aceleași ferestre.
6. **K2** — Enter într-o fereastră apasă butonul ei implicit și emite `activat` = ținta butonului (`fereastra:OK`…),
   cu ținta = focusul din momentul tastei (§4), pentru TOATE ferestrele Excel: Column Width, Sort, Sort Warning, Format
   Cells, Save As, Save this file, Save your changes și ferestrele de eroare. Proba: asistentul §6.3 cu pasul
   `{tinta: 'fereastra:OK'}` trece la Enter exact ca la clic (`runde/7/critic.md:80-95`).
7. **K1** — tastatura în ferestre, după referință:
   - focusul la deschidere: în Sort e pe butonul OK (faptele acoperirii);
   - Tab / Shift+Tab prin controalele ferestrei, în ordinea din referință, fără să iasă pe un `DIV` gol;
   - Alt+↓ deschide lista casetei, săgețile o parcurg;
   - Alt+literă după `AccessKey` din `uia_excel.json` (Sort: Add Level Alt+A…; Sort Warning: Alt+E / Alt+C / Alt+S;
     Column Width: Alt+C; Save As: Alt+N / Alt+T / Alt+S);
   - Alt+literă emite eveniment §4 (`tasta_acces`).
8. **K6** — tastele de acces ale panglicii în Excel (Alt, apoi literele din `uia_excel.json`; `date/excel.json` le are deja):
   - același mecanism ca în Word (`word.js:2034-2042` și partea comună din `aplicatii.js`), fără să schimbi ce face Word;
   - Alt+= = AutoSum (`excel-alt-egal`), Ctrl+Shift+% = Percent Style;
   - fiecare gest emite eveniment.
9. **X10 graficele (m2-l11)** — ULTIMELE:
   - Insert › Insert Column or Bar Chart ▾ după `lista.ChartTypeColumnInsertGallery`;
   - inserarea graficului din lecție pe datele alese;
   - filele contextuale `panglica_context.Ctx_ChartDesign` / `Ctx_Format`, cu Chart Design aleasă;
   - Change Chart Type după `dialog.ChartChangeType`, cât cere lecția.

   Desenul graficului: simplu (bare din date, titlu, axe), fără să pretinzi fidelitate de pixel unde referința nu o dă.
   Ce nu încape → `stare_autor.md` la zi.

**Ce NU inventezi** (rămân [NEVERIFICAT] în `de_verificat.md`):
- lista Order după alegerea unei coloane (R7-12);
- Excel fără niciun registru (R7-16);
- lista vizibilă de completare a funcțiilor;
- R7-17, R7-18, R7-5, R7-13, R7-19, R6-3.

Constatările [FARA_REFERINTA] din `runde/7/critic.md` (Ctrl+PageDown, Alt+Enter, Ctrl+1, Ctrl+C/X/V în editare, Backstage
fără registru) le treci în `de_verificat.md`, dacă nu sunt deja.

## Ce citești întâi
1. `D/contract.md` · `D/api_biblioteca.md` (§3, §4 cu `activat` și `tasta_acces`, §5 excel cu cheile noi, §6.3).
2. `runde/7/critic.md` (tot) · `runde/7/acoperire_excel.md` · `runde/7/raport_constructor.md`.
3. Apoi codul din `aplicatii/`, cu Grep înainte de Read:
   - `excel.js` are ~3300 de rânduri: îl citești pe bucăți;
   - `word.js` doar unde refolosești (KeyTips, Save this file, Save your changes);
   - `uia_excel.json` și `date/excel.json` NU se citesc întregi, ci prin Python, pe chei.

## Măsurarea
- **Pasul 1 e deja făcut:** pornirea ta e măsurarea de după acoperire, `runde/7/masurare.json` (măsurată 19.11.2026 10:46-11:45, singură pe mașină: O1 61, O2 13392, O3 21586, O4 69, O5 113, O6 0, O7 343, O8 102, O9 34, porți 41 (toate pe cum_fac), lacăt ok, neconcludente 0; explicația unităților noi O3/O4 e în `runde/7/acoperire_excel.md` §6). Înainte de orice,
  o copiezi în `runde/8/masurare_pornire.json` și NU mai rulezi o măsurare de pornire. Poți scrie sub `aplicatii/` de la început.
- Între pași rulezi parțial: `--doar O4,O5,O9`. O4 are acum scenariile acoperirii, deci e oracolul care îți arată progresul.
- **Pasul 7:** `python D/oracole/masoara.py --runda 8 --paralel 3 --compara runde/8/masurare_pornire.json`, pornit DUPĂ ultima
  ta scriere sub `aplicatii/`, SINGUR pe mașină (fără probe în paralel: azi un clic care a expirat a dat o poartă falsă).
  Orice oracol sau poartă crește → `git restore` pe fișierele tale.
- **Proba ta:** `runde/8/proba_grav.py` — gesturi reale pe cele 9 GRAV, înainte și după, ieșirile în json.
- **Regresul, la 0 picate:**
  - Excel: `runde/7/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/7/proba_grav_cont2.py`, `runde/6/proba_excel.py`;
  - Word: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.

  Dacă o probă veche verifica un comportament pe care referința nouă îl contrazice, de exemplu mesajul central acolo unde
  acum e fereastra reală, nu „repari” proba ca să treacă. Scrii în raport cazul, citatul din referință și ce ai schimbat.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (`C:/Users/...`): scrii „%TEMP%”.

## Ce NU faci (le face orchestratorul)
- Nu faci pasul 8 (criticul) și nici pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii:
  - `runde/8/raport_constructor.md`: numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, și pentru
    fiecare GRAV: cum l-ai reparat, proba, rezultatul;
  - `runde/8/gata_pentru_critic.md`: doar unde e ce și cum se deschide poligonul.
- Fără commit, fără push.
- Atingi doar `aplicatii/`, plus notele tale în `runde/8/`, `de_verificat.md`, `de_aprobat.md`. Lecțiile, jocurile,
  `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU)
Toți constructorii au trecut de 290k; runda 7 a avut nevoie de 3.
- După FIECARE GRAV terminat și probat, actualizezi `runde/8/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere,
  ce măsurătoare rulează, unde e copia de siguranță. Oricând te oprești, un constructor proaspăt continuă de acolo.
- La ~200k de context te oprești la prima graniță curată de după: rulezi pasul 7 pe ce e gata și raportezi „PREDARE”.
  E normal să predai după 3-4 GRAV.
- Ieșirile mari de Bash le scrii în fișier și aduci în context doar coada.
