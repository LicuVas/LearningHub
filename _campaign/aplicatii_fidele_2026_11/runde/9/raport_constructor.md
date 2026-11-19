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


---

# Constructorul 2 (19.11.2026, după `c0eaf3e1`): X10 graficele; E5 amânat

## Numerele
- Proba X10 (`proba_grav.py --doar X10`, 26 de verificări, gesturi reale de mouse și tastatură, headless, doar 127.0.0.1):
  **înainte 15 picate din 15** (proba se oprea: nu exista niciun grafic) → **după 0 picate din 26**.
  Toată proba rundei (`proba_grav_c2.json`): **71 de verificări, 1 picată** (E5, neatins). E1 9/9, E2 7/7, K1 8/8, E4 10/10,
  E3 9/9, X10 26/26.
- Oracolele, `--doar O4,O5,O9` după ultima scriere sub `aplicatii/` (`masurare_partial_c2.log`, copia `masurare_partial_c2.json`):
  O4 50 → **50**, O5 113 → **113**, O9 34 → **34**; lacăt ok; regres niciunul. Neschimbate: niciun scenariu O4 și nicio țintă
  O5 / O9 nu trece prin grafice.
- Pasul 7 (`masoara.py --runda 9 --paralel 3 --compara runde/9/masurare_pornire.json`, pornit după ultima scriere sub
  `aplicatii/`, singur pe mașină; `masurare_pas7_c2.log`; `masurare.json` = copia `masurare_pas7_c2.json`): O1 61 → **61**, O2 13392 → **13392**, O3 21586 → **21586**, O4 50 → **50**, O5 113 → **113**, O7 343 → **343**, O8 102 → **102**, O9 34 → **34**, porți 41 → **41** (toate pe cum_fac; test_joc 0, controale_taiate 0, fereastra_mica 0, date_personale 0, word2007_j2 0); lacăt ok. **O6 a ieșit NECONCLUDENT** (depășit timpul: 1802 s; la pornire dura 1770 s din limita de 1800). Reluat SINGUR (`--doar O6`, `masurare_o6_c2.log` / `masurare_o6_c2.json`): **O6 = 0** în 1445 s, „regres: niciunul”. Deci nicio creștere; scăderi nici ele (O2/O3 nu văd biblioteca în etapa B, iar scenariile O4 / țintele O5, O9 nu trec prin grafice). `ingheata.py --verifica` = 0.
- Regresul (`sh runde/9/regres.sh regres_c2` → `regres_c2_rezumat.txt`): Excel `8/proba_grav` 0, `7/proba_grav_cont` 0,
  `6/proba_excel` 0, `7/proba_grav` 2 (D14), `7/proba_grav_cont2` 3 (D18) — rândurile PICAT identice cu `regres_c1_*` (diff gol);
  Word `5/proba_grav` 0, `4/proba_grav` 0, `4/proba_telefon` 0, `3/proba_grav` 0, `2/proba_grav` 0.

## FĂCUT (cu dovada observată)
- **X10 graficele** — `aplicatii/excel.js`, secțiunea „graficele” + legăturile; `aplicatii/aplicatii.css`, coada „graficele”:
  - Insert › Insert Column or Bar Chart ▾ = lista din `uia_excel.json › lista.ChartTypeColumnInsertGallery`: 13 rânduri + More
    Column Charts..., în ordinea din referință, cu titlurile grupurilor (2-D Column, 3-D Column, 2-D Bar, 3-D Bar) și pictograme
    desenate; locul listei [597, 110, 227, 416] față de referință [596, 106.4, 227.2, 416]. Alt, N, C o deschide; ↓ / Enter merg
    în listă (KeyTips cedează săgețile când e deschisă o listă).
  - Clustered Column / Clustered Bar inserează graficul pe zona aleasă (o singură celulă = zona curentă); seriile pe coloane când
    valorile au mai multe rânduri decât coloane, altfel pe rânduri; numele doar din text (capcana anilor din m2-l11); titlul =
    numele seriei unice sau „Chart Title”. Celelalte rânduri (Stacked, 3-D, More Column Charts...) = mesajul central (R12).
  - După inserare: filele „… Help, Chart Design, Format, Sheet1” = `h_grafic.file_dupa`, Chart Design aleasă (Style 1 în
    panglică), `grafic_activ` true. Clic pe o celulă = graficul nu mai e ales, filele dispar; clic pe grafic = ales din nou.
  - Chart Design › Change Chart Type... = `dialog.ChartChangeType` pe fila All Charts: Column (subtipurile din referință),
    Bar (subtipurile 2-D / 3-D Bar din lista ▾), Line, Pie; OK schimbă tipul. Switch Row/Column comută seriile cu categoriile.
    Cu graficul ales, Insert › alt tip îi schimbă tipul (m2-l11).
  - Titlul: un clic, scrii (textul apare în bara de formule), Enter → titlul nou; Delete șterge graficul (sau titlul ales);
    tragerea de margine mută graficul, mânerele îl măresc; graficul e legat de tabel (B3 = 10 → bara arată 10); Ctrl+Z pe toate.
  - `stare().grafice` = [{tip, zona, titlu, serii, categorii, valori, legenda, pozitie}], `grafic_activ`, `grafic_element_ales`;
    evenimente §4 cu ținte canonice (`meniu:Clustered Column`, `grafic:1`, `fereastra:Pie`…) și acțiuni `inserare_grafic`,
    `schimbare_tip_grafic`, `comutare_rand_coloana`, `alegere_grafic`, `titlu_grafic`, `mutare_grafic`, `redimensionare_grafic`,
    `stergere_grafic`.
  - Plasa oracolelor `I.deschideSuprafata`: `lista.ChartTypeColumnInsertGallery` și `panglica_context.*` (inserează un grafic
    dacă foaia n-are).
  - Dovada: `proba_grav_c2.json` (X10 26/26); capturi headless verificate de mine: lista, graficul cu Chart Design, fereastra
    Change Chart Type pe Bar.

## NEFĂCUT
- **E5** (Yes în „We found a typo…” → vărsare pe D2:D6) — neînceput: cere rezultat-zonă în motorul de calcul și celule vărsate
  în stare, pe ecran, la recalcul și la Ctrl+Z; nu încape curat lângă grafice. Deblocator: runda 10 (planul în `stare_autor.md`).
- Laboratorul m2-l11, pașii 3 (Insert Line or Area Chart ▾) și 6 (Add Chart Element › Data Labels): rămân pe mesajul central,
  listele lor nu sunt în referință. Deblocator: o rundă `acoperire` cu R9-6. În poligon, linia se obține prin Clustered Column
  + Change Chart Type › Line.

## NESIGUR
- [NEVERIFICAT], în `de_verificat.md` R9-2…R9-6 și `diferente.md` D9-D14: fila aleasă după ieșirea din grafic (Home), Insert ›
  alt tip cu graficul ales (schimbă tipul, după lecție), locul / mărimea / legenda / titlul graficului nou, subtipurile Line / Pie
  din Change Chart Type, listele Line / Pie / Add Chart Element, încadrarea colorată a sursei în tabel.
- Desenul graficului e simplu (SVG: bare, linii, felii, axe, legendă), fără pretenție de pixel: referința nu dă pixelii lui.
- Butoanele Chart Design n-au pictograme (lipsesc din `date/excel.json`, ca înainte): se văd doar etichetele.

## Fișiere schimbate (constructorul 2)
`aplicatii/excel.js` (+~380), `aplicatii/aplicatii.css` (+20, la capăt); `runde/9/proba_grav.py` (X10 extinsă: 26 de verificări),
notele `runde/9/*` (`stare_autor.md`, `diferente.md`, `gata_pentru_critic.md`, acest raport), `de_verificat.md` (+R9-2…R9-6).
