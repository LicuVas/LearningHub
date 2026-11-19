# Supliment la promptul rundei 9 (valul B-excel, runda a 4-a de reparații) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/9/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Excel e în biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/`. Runda 8 e COMISĂ local pe `fidelitate-aplicatii`
  (1c73a5fe), nepublicată, deci `git restore` pe fișierele tale te duce înapoi la starea de după runda 8.
- Runda 8 a avut 2 constructori (`runde/8/raport_constructor.md`, `runde/8/stare_autor.md`). Criticul 8 (`runde/8/critic.md`,
  unghiul stare_finala_erori) a închis X5, X8, K2, K3, K4, K5, K6. **GRAV 7** deschise: K1 (rest), X10 (graficele) și
  cinci noi, E1-E5.
- Referințele din Excel REAL aduse de runda `acoperire` (`runde/7/acoperire_excel.md`) sunt în `referinte/uia_excel.json`
  (cheile noi sub `suprafete` + faptele în `acoperire_r7.fapte`) și în `referinte/scenarii_real/`.
- Oracolele O2 și O3 NU văd biblioteca în etapa B: randează doar paginile din `inventar.json`, iar niciuna nu încarcă
  `aplicatii/` (lămurit în runda 8). Progresul tău se vede pe O4, O5, O9 și pe proba ta.
- Word are 8 GRAV deschise din valul lui (`runde/5/critic.md`). NU le repari aici, dar Word nu are voie să se strice.
- Excel real îl folosești doar prin `win32com.client.DispatchEx`, invizibil, cu `DisplayAlerts=False` și fișiere cu nume
  unice în %TEMP%. NICIODATĂ `Dispatch` / `GetObject` / `GetActiveObject`, niciodată `taskkill /IM EXCEL.EXE`; închizi
  doar PID-ul instanței tale (îl iei din `app.Hwnd`). Utilizatorul își poate deschide oricând Excel-ul lui.

## Ținta rundei 9 = cele 7 GRAV din `runde/8/critic.md`, în ordinea asta
Primele cinci sunt mici și criticul le-a dat cauza cu fișier:rând. Le faci întâi, una câte una, cu proba după fiecare.
1. **E1** — după un Alt+literă care închide o fereastră (Alt+S în Save As, Alt+S în Sort Warning), panglica NU mai intră
   singură în modul KeyTips:
   - cauza (critic 8, `:110-113`): ascultătorul ferestrelor oprește litera cu `stopImmediatePropagation` (`excel.js:2696`),
     `altSingur` rămâne `true`, iar la ridicarea lui Alt fereastra e deja închisă (`excel.js:2817`);
   - regula: KeyTips apar doar la Alt apăsat și eliberat SINGUR. Orice altă tastă apăsată cât Alt e ținut, inclusiv una
     consumată de fereastră, anulează `altSingur`;
   - proba: F12 + „Lucrare” + Alt+S, apoi „abc” → „abc” ajunge în celula activă; Sort Warning + Alt+S, apoi „7” → 7 în celulă.
     Fără mesajul fals „Undo … nu e simulată”.
2. **E2** — Enter cu focusul pe o casetă de bifat sau pe un buton radio apasă butonul IMPLICIT al ferestrei (OK / Sort...),
   nu comută caseta:
   - cauza: `excel.js:2043` (`esteButon` include CheckBox și RadioButton) și `excel.js:2117`;
   - regula: §4 `activat` (ENTER = „IDOK or control identifier of the default push button”). Space comută caseta, Enter nu;
   - proba: Sort, Alt+H (debifat), Enter → sortează fără antet, fereastra se închide; Sort Warning, Alt+C, Enter → sortează
     doar selecția.
3. **K1 (rest)** — după o alegere pe al doilea nivel din Sort (Then by sau Order-ul lui), focusul NU iese din fereastră:
   - cauza (critic 8, `:49-52`): `deseneazaNiveluri()` (`excel.js:1526`, chemat din `:1589`) redesenează rândurile nivelurilor
     2+ și nu pune focusul înapoi;
   - regula: focusul rămâne pe controlul tocmai folosit, sau pe echivalentul lui după redesenare;
   - proba: drumul m2-l10:63 („Două criterii… Add Level… Then by… Largest to Smallest… OK”), numai cu tastatura și apoi
     numai cu mouse-ul. Enter la final sortează și emite eveniment §4.
4. **E4** — după No sau Esc în „We found a typo…”, celula trece în modul **Edit** (`acoperire_r7.fapte.e_sum_lipit.
   mod_dupa_inchidere: "Cell Mode Edit"`), iar ← / → mută cursorul în formulă:
   - cauza: `raspunsEroare` (`excel.js:2140-2152`) întoarce în editare fără să schimbe modul;
   - proba: D2, `=SUM(B2:B7)B2:B6` + Enter, No, ← de 6 ori, „*” + Enter → fereastra NU reapare la săgeți.
   - La „There's a problem with this formula” și „too few arguments” referința spune altceva (Ready după Esc) decât lecțiile
     (după OK rămâi în formulă). NU schimbi acolo; e întrebarea R8-14 din `de_verificat.md`.
5. **E3** — după Σ și după ▾ › Average (și Alt+=), celula e în modul **Point** (`acoperire_r7.fapte.c_autosum.mod_dupa_sigma`
   / `mod_dupa_average`: „Cell Mode Point”):
   - cauza: `excel.js:1408` (`porneste(…, 'Enter', …)` în `autoSum`); bara arată Point doar cu `M.edit.punct` (`excel.js:983`);
   - în Point, o săgeată schimbă zona propusă (ca la K5), nu primește formula;
   - proba: B8 sub B2:B7, Σ → bara „Point”; ↓ nu primește formula; Enter → 48.
6. **X10 graficele (m2-l11)** — lecția întreagă stă pe ele. Acum Insert › Insert Column or Bar Chart dă mesajul central:
   - Insert › Insert Column or Bar Chart ▾ după `lista.ChartTypeColumnInsertGallery` (rândurile și ordinea din referință);
   - inserarea graficului din lecție pe datele alese (Clustered Column întâi);
   - după inserare: filele contextuale `panglica_context.Ctx_ChartDesign` / `Ctx_Format`, cu Chart Design aleasă, iar graficul
     e activ (`acoperire_r7.fapte.h_grafic`);
   - Change Chart Type după `dialog.ChartChangeType`, cât cere lecția;
   - stare §5 (graficele din foaie: tip, zona de date, titlul) + evenimente §4.

   Desenul graficului: simplu (bare din date, titlu, axe, legendă), fără să pretinzi fidelitate de pixel unde referința nu o
   dă. Criticul rundei 9 are unghiul **aspect**: o să compare cu referința ce se vede (lista, filele contextuale, dreptunghiurile
   din `uia_excel.json`). Drumul lecției m2-l11 trebuie să se poată duce la capăt.
7. **E5** — Yes în „We found a typo…” dă `#VALUE!`. În Excel real, `=SUM(B2:B7)*B2:B6` se varsă pe D2:D6 (432, 336, 384,
   480, 288; `runde/8/critic_probe/com_r8.json`, `HasSpill: true`). Repari doar dacă încape curat: o formulă cu zonă care se
   varsă pe rândurile de sub ea, cu `stare()` = ecranul. Dacă nu încape, rămâne pentru runda următoare, scris în `stare_autor.md`.

**Ce NU inventezi** (rămân în `de_verificat.md`): R7-12, R7-16, lista vizibilă de completare a funcțiilor, R7-17, R7-18,
R7-5, R7-13, R7-19, R6-3, R8-1…R8-19. Constatările [FARA_REFERINTA] ale criticului 8 sunt deja trecute acolo ca R8-12…R8-19.

## Ce citești întâi
1. `D/contract.md` · `D/api_biblioteca.md` (§3, §4 cu `activat` și `tasta_acces`, §5 excel, §6.3).
2. `runde/8/critic.md` (tot) · `runde/8/stare_autor.md` (secțiunea X10 are planul constructorului 2) · `runde/8/raport_constructor.md`.
3. Apoi codul din `aplicatii/`, cu Grep înainte de Read:
   - `excel.js` are ~2850 de rânduri, multe foarte lungi (~150 KB): îl citești pe bucăți;
   - `uia_excel.json` și `date/excel.json` NU se citesc întregi, ci prin Python, pe chei.

## Măsurarea
- **Pasul 1 e deja făcut:** pornirea ta e `runde/9/masurare_pornire.json` (= `runde/8/masurare.json`, măsurată 19.11.2026
  14:39-15:45, singură pe mașină, după ultima scriere a rundei 8: O1 61, O2 13392, O3 21586, O4 50, O5 113, O6 0, O7 343,
  O8 102, O9 34, porți 41, toate pe cum_fac; lacăt ok). NU rulezi o măsurare de pornire. Poți scrie sub `aplicatii/` de la început.
- Între pași rulezi parțial: `--doar O4,O5,O9`.
- **Pasul 7:** `python D/oracole/masoara.py --runda 9 --paralel 3 --compara D/runde/9/masurare_pornire.json`, pornit DUPĂ ultima
  ta scriere sub `aplicatii/`, SINGUR pe mașină. Cât rulează (~1 oră), NU rulezi nicio probă și niciun browser în paralel:
  în runda 8, o măsurare cu probe în paralel a durat 84 de minute și a dat porți false.
  Orice oracol sau poartă crește → `git restore` pe fișierele tale.
- `oracole/porti.py` NU-l rulezi direct: rescrie `oracole/porti.json`, care e reper înghețat. La final
  `python D/ingheata.py --verifica` = 0.
- **Proba ta:** `runde/9/proba_grav.py` — gesturi reale pe cele 7 GRAV, înainte și după, ieșirile în json.
- **Regresul, la 0 picate:**
  - Excel: `runde/8/proba_grav.py`, `runde/7/proba_grav_cont.py`, `runde/6/proba_excel.py`. La `runde/7/proba_grav.py` (X6) și
    `runde/7/proba_grav_cont2.py` (X8) sunt acceptate doar căderile deja explicate de referința nouă (`runde/8/diferente.md`
    D14, D18);
  - Word: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.

  Dacă o probă veche verifica un comportament pe care referința îl contrazice, nu „repari” proba ca să treacă. Scrii cazul
  în `runde/9/diferente.md`, cu citatul din referință.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (`C:/Users/...`): scrii „%TEMP%”.

## Ce NU faci (le face orchestratorul)
- Nu faci pasul 8 (criticul) și nici pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii:
  - `runde/9/raport_constructor.md`: numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, și pentru
    fiecare GRAV: cum l-ai reparat, proba, rezultatul;
  - `runde/9/gata_pentru_critic.md`: doar unde e ce și cum se deschide poligonul.
- Fără commit, fără push.
- Atingi doar `aplicatii/`, plus notele tale în `runde/9/`, `de_verificat.md`, `de_aprobat.md`. Lecțiile, jocurile,
  `jocuri/_motor/`, referințele, oracolele, scenariile și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU)
Toți constructorii au trecut de 290k; runda 8 a avut nevoie de 2, iar graficele n-au încăput în niciunul.
- După FIECARE GRAV terminat și probat, actualizezi `runde/9/stare_autor.md`: ce e gata, ce urmează, ce fișiere, ce numere.
  Oricând te oprești, un constructor proaspăt continuă de acolo.
- La ~200k de context te oprești la prima graniță curată de după și raportezi „PREDARE”. La predare NU rulezi pasul 7 (o oră
  de mașină): rulezi doar `--doar O4,O5,O9` + proba ta + regresul și scrii numerele în `stare_autor.md`. Pasul 7 complet îl
  rulează doar constructorul care termină runda.
  E normal ca primul constructor să facă E1, E2, K1, E4, E3 și să predea, iar graficele să le facă un constructor proaspăt.
- Ieșirile mari de Bash le scrii în fișier și aduci în context doar coada.
