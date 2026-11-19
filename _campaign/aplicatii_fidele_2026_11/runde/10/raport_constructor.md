# Runda 10 · B-excel · raportul constructorului (un singur constructor)

## Numerele (pornire → pasul 7)
O1 61 → 61 · O2 13392 → 13392 · O3 21586 → 21586 · O4 50 → 50 · O5 113 → 113 · O6 0 → 0 · O7 343 → 343 · O8 102 → 102 ·
O9 34 → 34 · porți 41 → 41 (toate cum_fac) · lacăt ok · `ingheata.py --verifica` = 0.
- Pasul 7 (`masurare_pas7.log`, pornit după ultima scriere sub `aplicatii/`, singur): toate ca la pornire; O6 NECONCLUDENT pe timp
  (1801 s). L-am reluat imediat, singur (`masurare_o6.log` / `masurare_o6.json`): O6 = 0, fără regres. `masurare.json` =
  `masurare_pas7.json` (pus înapoi după `--doar`).
- La măsurarea parțială (`masurare_partial_c1.log`), O4 a dat 51: scenariul Word `word-ctrl-z-abc` a picat cu „pregătirea a
  eșuat: Failed to fetch” (`o4_partial_c1_failed_to_fetch.json`). Reluat singur (`masurare_o4_reluat.log`): 50, iar la pasul 7
  tot 50. A fost o încărcare picată, nu comportament (runda atinge doar `excel.js`).
- Numerele oracolelor nu se mișcă, fiindcă nicio suprafață reparată nu e numărată de ele (`tinta.md`). Dovada e proba.

## Proba rundei (`proba_grav.py`, gesturi reale, fiecare GRAV și cu un drum numai din tastatură)
Înainte (cod neatins): 19 picate (`proba_grav_inainte.json`); M2 și M3 pe copia HEAD: 4 picate (`proba_grav_inainte_m2m3.json`).
După: **0 picate din 32** (`proba_grav_dupa.json`).

## FĂCUT
- **A1, locul graficului nou** (`excel.js › insereazaGrafic`, `kg()`, `desenGrafic`, `mutaGrafic`): Excel real măsurat din nou
  prin COM invizibil (`probe/com_r10_b.json`, `com_r10_c.json`, 9 ferestre, potrivire la 0,1 pt):
  - `left = (UsableWidth − 360)/2 − 10,2 pt` și `top = (UsableHeight − 216)/2 − 7,2 pt`, cel puțin 0;
  - mărimea rămâne 360 × 216.
  Formula e aplicată pe zona vizibilă a grilei, plus derularea:
  - 1366×768 → G5;
  - fereastra mică → lipit sus și tăiat jos, ca Excel; se vede întreg după derulare;
  - telefon → lipit stânga-sus, 480 × 288 la zoomul registrului: colțul și titlul pe ecran.
  Proba A1: 11/11 (mouse, Alt, N, C, ↓, Enter, atingeri, rotița). Regres X10 din runda 9: 0.
- **A2, rezumatul selecției** (`rezumatSelectie`): Average 7,5 · Count 6 · Sum 45 la 860,2 / 934,6 / 989,8 (referința 859,2 /
  933,6 / 988,8, plus decalajul +1 al întregii bare), lățimile din referință, Display Settings ascuns. Se reface la selecție
  (Shift+săgeți, mouse) și la valoare (Delete → dispare; Ctrl+Z → revine). Proba A2: 7/7.
- **E5, vărsarea** (`opMat`, `varsat`, `toateVarsate`, `valoare`, ecranul, `I.stare`):
  - Enter (= Yes) sau clic pe Yes → D2:D6 = 432, 336, 384, 480, 288, în stare și pe ecran;
  - formula doar în D2;
  - recalcul cu B2 = 10;
  - primul Ctrl+Z → înapoi, al doilea → toată vărsarea dispare;
  - `=B2:B6*2` scris direct se varsă.
  Proba E5: 8/8. `runde/9/proba_grav.py` trece acum întreg (0, inclusiv E5).
- **MINOR-urile criticului 9:**
  - ținta tastelor cu graficul ales (`grafic:1`, `grafic:1/titlu`): 2/2;
  - Esc pe Then by → `camp:Then by`: 2/2;
  - axa valorilor 0–10/1, 0–25/5, 0–30/5, ca în `com_r9.json`: 2/2.
- **Regres** (`regres_c1_rezumat.txt`):
  - Excel: 9/0, 8/0, 7cont/0, 6/0, 7/2, 7cont2/3. Căderile acceptate sunt aceleași rânduri ca în runda 9 (D14, D18; `diff` gol);
  - Word: 5, 4, 4-telefon, 3, 2 = 0.

## NEFĂCUT
- Din punctul 4: Quick Styles (pătratul gol, Style 1 neales) și ▾ după „More Column Charts...”. Motiv: loc; nimic nu le blochează.
- **X10** (Insert Line, Add Chart Element › Data Labels): nu era în rundă. Deblocator: o rundă `acoperire` (`de_verificat.md` R9-6).

## NESIGUR (de citit înaintea criticului)
- **D-A1-1:** suplimentul cerea H11 ± 1 la 1366×768; formula dă **G5**. H11 vine dintr-o fereastră COM cu 754 px de grilă.
  `com_r10_b` arată că locul se mută cu zona utilă (G10 / H11 / I12). Pe Excel vizibil cu panglică e dedus, nu măsurat → R10-1.
- **D-A1-2:** suplimentul cerea „în fereastra mică graficul întreg”. Excel nu micșorează graficul (`com_r10_c`), deci și aici e
  tăiat jos 60 px până la derulare.
- **R10-2:** rezumatul pentru o celulă, text, goluri, erori, grafic ales. **R10-3:** vărsarea blocată (#VALUE! în loc de #SPILL!),
  `=B2:B6` simplu, D3 în bara de formule. **R10-4:** regula axei, potrivită pe 3 cazuri.
- §5 n-are cheie pentru bara de stare: rezumatul e doar pe ecran (D-A2-3); `api_biblioteca.md` n-a fost atins.

## Fișiere
`aplicatii/excel.js` (+182 / −25), singurul sub `aplicatii/`. Note: `runde/10/` (cadru, tinta, contra, diferente, stare_autor,
gata_pentru_critic, proba_grav.py, regres.sh, lot_c1.sh, probe/com_r10*), `de_verificat.md` (R10-1…R10-4). Fără commit, fără push.
Excel real: doar `DispatchEx` invizibil, PID-ul meu, ieșit singur la `Quit` de 3 ori (`tasklist` gol după fiecare).
