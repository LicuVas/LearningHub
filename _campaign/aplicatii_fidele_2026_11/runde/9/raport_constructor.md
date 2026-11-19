# Runda 9 · B-excel · raportul constructorului 1 (PREDARE după E1, E2, K1, E4, E3)

## Numerele
- Proba rundei (`runde/9/proba_grav.py`, gesturi reale, headless, doar 127.0.0.1): **înainte 25 picate din 48**
  (`proba_grav_inainte.json`) → **după, pe cele 5 GRAV reparate: 0 picate din 43** (`proba_grav_dupa.json`: 48 de verificări, 3 picate); rămân
  picate doar X10 (2) și E5 (1), neîncepute.
- Oracolele, măsurare parțială `--doar O4,O5,O9` după ultima scriere sub `aplicatii/` (`masurare_partial_c1.log`):
  O4 50 → **50**, O5 113 → **113**, O9 34 → **34** (lacăt ok, „regres: niciunul”; copia: `masurare_partial_c1.json`).
  Neschimbate, cum era de așteptat: scenariile O4 rămase (runda 8) nu trec prin gesturile reparate aici, iar O5/O9 nu au
  suprafețe noi. Restul (O1-O3, O6-O8, porțile) nemăsurate de mine:
  pasul 7 complet îl rulează constructorul care termină runda.
- Lacătul: `ingheata.py --verifica` = 0 (INTACT, 351 de fișiere).

## FĂCUT (cu dovada observată)
- **E1** — `excel.js:2726-2728`: ascultătorul Alt+literă din ferestre pune `altSingur = false` înainte de
  `stopImmediatePropagation`. Proba 9/9: F12 + „Lucrare” + Alt+S → salvat, fără KeyTips, „abc” + Enter → E2 = „abc”;
  Sort Warning + Alt+S → fără KeyTips, „7” + Enter → 7 în celula activă, fără mesajul „Undo … nu e simulată”; Alt singur arată
  în continuare literele.
- **E2** — `excel.js:2144-2147` (`tastaDialog`): la Enter se apasă singur doar un `Button`; pe casetă de bifat / buton radio
  se apasă `butonImplicit()`. Space neschimbat. Proba 7/7: Sort + Alt+H + Enter → sortat fără antet (A1:A3 = Ana, Bogdan, Nume),
  `activat: fereastra:OK`; Sort Warning + Alt+C + Enter → doar selecția (C2:C3 = 60, 95; A2 rămâne Bogdan),
  `activat: fereastra:Sort...`; Space comută caseta.
- **K1** — `excel.js:1530-1534`, `:1560-1565` (`focusNivel`), `:1605`, `:1614`: focusul de pe rândurile 2+ ale Sort trece pe
  caseta echivalentă după redesenare; alegerea din listă refocusează caseta ei. Proba 8/8, cu tastatura și cu mouse-ul, pe
  drumul m2-l10:63: focusul rămâne pe Then by / Order (nivelul 1), Enter sortează (Darius, Ana, Bogdan, Ioana, Radu, Irina),
  `activat: fereastra:OK`.
- **E4** — `excel.js:1963-1973` (`inchideDialog`): „We found a typo…” închisă fără Yes → modul Edit (citat:
  `acoperire_r7.fapte.e_sum_lipit.mod_dupa_inchidere` „Cell Mode Edit”). `_2` / `_3` neatinse (R8-14). Proba 10/10 (No și Esc):
  bara „Edit”, ← ×5 = `mutare_cursor` fără fereastră, „*” + Enter → D2 = „=SUM(B2:B7)*B2:B6”.
- **E3** — `excel.js:1409-1412` (`autoSum`: `punct = true`, `pk` = zona propusă) și `:2631` (`ales` golit când săgeata înlocuiește
  zona). Citat: `c_autosum.mod_dupa_sigma` / `mod_dupa_average` „Cell Mode Point”. Proba 9/9: Σ, ▾ › Average, Alt+= → bara
  „Point”; Enter → 48 / 8 / 48; Σ + ↓ → formula NU e primită (`referinta`, B8 în editare); Σ + „B2:B6” + Enter → 40.
- **Regresul** (`regres_c1_rezumat.txt`): Excel `8/proba_grav` 0, `7/proba_grav_cont` 0, `6/proba_excel` 0; `7/proba_grav` 2
  și `7/proba_grav_cont2` 3 = aceleași căderi ca în runda 8 (D14, D18, explicate de referință; `diferente.md`). Word
  `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`, `3/proba_grav`, `2/proba_grav` = 0 fiecare. `aplicatii.js` neatins.

## NEFĂCUT
- **X10 graficele** (m2-l11) — neîncepute; planul și locurile din cod sunt în `stare_autor.md`. Deblocator: un constructor
  proaspăt (context).
- **E5** (Yes în typo → vărsare D2:D6) — neînceput; cere rezultat-zonă în motorul de calcul. Deblocator: același constructor,
  după X10, dacă încape curat.
- Pasul 7 complet — nu se rulează la predare (suplimentul).

## NESIGUR
- **R9-1** [NEVERIFICAT], în `de_verificat.md`: ce scrie o săgeată în modul Point după Σ. Simulatorul: B8 + ↓ → „=SUM(B9)”
  (mecanismul K5, pornit din celula editată). Referința dă doar modul.
- MINOR fără referință (în `stare_autor.md`): Alt, 2 alege „More Options” al lui Undo din Acces rapid → mesajul central.

## Fișiere schimbate
`aplicatii/excel.js` (+36 / −3); notele `runde/9/*`; `de_verificat.md` (+R9-1).
