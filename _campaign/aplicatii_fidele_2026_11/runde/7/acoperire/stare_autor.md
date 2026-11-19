# Runda `acoperire` pe Excel după runda 7 — STAREA (predare către un agent proaspăt, 19.11.2026 ~10:55)

Sarcina: `runde/7/acoperire_prompt.md` (citește-l întreg). D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.
Nimic comis. `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/` NEatinse. Niciun oracol atins → bancul de mutanți nu se
declanșează (ca la runda Word: O3 citește singur `referinte/uia_*.json`, O4 citește singur `scenarii/**` + `scenarii_real/`).

## Făcut (pe disc, verificat)
- NOU `referinte/acoperire_excel_r7.py` (generator-soră; `capturi [--doar=f]`, `scrie`, `scrie_scenarii`,
  `scenarii [--id=a,b]`, `verifica`). Refuză desktopul vizibil; Excel doar `EXCEL.EXE /x` pe LHRefOffice / LHScenarii.
- `referinte/uia_excel.json`: 17 chei noi + blocul `acoperire_r7` (fapte, NEVERIFICAT, rulări). Copia de dinainte:
  `runde/7/acoperire/uia_excel_inainte.json.bak` (NU e livrabil; se poate șterge). `dump_uia_office.py verifica` = 0,
  `acoperire_excel_r7.py verifica` = 0. Capturile brute: `runde/7/acoperire/capturi_excel_brut.json` (3 rulări: rulare1/2/3.log).
- Chei noi: dialog.save_this_file, dialog.save_your_changes_to_this_file, lista.AutoSum, lista.SortDialog_SortBy,
  lista.SortDialog_Order (Sort by gol), lista.SortDialog_SortOn, lista.SortDialog_SortBy_fara_antet,
  dialog.SortDialog#Add Level, dialog.SortDialog_eroare_nivel_gol, dialog.eroare_formula (_2, _3),
  lista.CellFillColorPicker, lista.Borders, lista.ChartTypeColumnInsertGallery, bara_stare#selectie_numere,
  lista.FileSaveAs_navigare (19 elemente personale scoase).
- Scenarii: 12 NOI în `scenarii/excel/` (rulat_de = referinte/acoperire_excel_r7.py) + 3 vechi marcate rulat_de
  (excel-autocompletare-tab, excel-separator-virgula, excel-salvare-ca — acesta RESCRIS pe drumul File › Save As › Browse).
  Rezultate reale (`referinte/scenarii_real/`), rularea 1: 14/15 cu mod_probat true (probele: model_obiect, tastare, taste,
  mouse, panglica, taste_alt — toate trecute; taste_alt: cu Alt ținut „=SUM(B2:B4)”, fără Alt „=”).
- `api_biblioteca.md` §5 excel: cheile noi (fereastra_mesaj, ramane_in_editare, dialog, registru_activ, latimi_coloane,
  inaltimi_randuri, format_celule.incadrare).

## Faptele capturate (Excel real, 16.0.20326.20318)
- R6-4/X8: Ctrl+S pe registru nou = fereastra Office „Save this file” (NUIDialog): File name (focusul), Choose a Location
  (Documents / OneDrive - Personal), More options… (→ pagina File › Save As), Save, Cancel. Ca la Word.
- R7-15/X8: Ctrl+W pe registru modificat = „Save your changes to this file?”: More options…, Save, Don't Save, Cancel;
  Cancel → registrul rămâne.
- R7-1/X5: lista ▾ Σ (Home = Formulas, identică): Sum, Average, Count Numbers, Max, Min, More Functions...; Average pe B8
  (B2:B7 numere) → =AVERAGE(B2:B7), 8. R7-7: după Average și după Σ, bara de stare = „Cell Mode Point”.
- R7-11: după Add Level, rândul 2 = DataItem/ComboBox „Then by”. R7-12: Sort On = Cell Values, Cell Color, Font Color,
  Conditional Formatting Icon; fără antet: Column A/B/C; Order cu Sort by gol: A to Z, Z to A, Custom List...
  Focus la deschiderea Sort = butonul OK. R7-14: OK cu nivel gol → „Microsoft Excel: All sort criteria must have a column
  or row specified.  Check the selected sort criteria and try again.” [OK].
- R7-2: =SUM(B2:B7)B2:B6 → „We found a typo… correct it to: =SUM(B2:B7)*B2:B6 … accept?” [Yes (focus), No].
  R6-1: =SUM(A1,A2) → „There's a problem with this formula…” [OK]. =SU+Tab+A1:A3) → „You've entered too few arguments
  for this function.” [OK].
- R7-8 / R7-9: galeriile Fill Color (No Fill, Theme Colors…) și Borders (Bottom…More Borders...) — în referință.
- X10: galeria Insert Column or Bar Chart (Clustered Column … More Column Charts...); după inserare: filele contextuale
  Chart Design + Format, Chart Design aleasă, graficul activ.
- R6-6: B2:C4 numere → bara de stare „Average 7,5” (x 859), „Count 6” (x 934), „Sum 45” (x 989), înaintea vederilor.
- K5: =+↑+Enter → =B4; =B2++→+Enter → =B2+E2. K4: =AV+Tab → =AVEDEV(B2:B4) 0,666667; =AVER+Tab → =AVERAGE. K6: Alt+= →
  =SUM(B2:B4). R6-2: =SU+Tab → too few arguments (rămâne în editare). Column Width „20”+Enter → C = 150 px.
  Ctrl+N → Book2. R7-3/R7-4: =1/30000 → „3,33333E-05”, =1/7000000 → „1,42857E-07” (restul în scenarii_real/excel-numere-afisare).
  R7-6: AutoFit pe „Situația notelor la informatică” → A = 186 px. R7-10: Wrap Text de două ori → fără încadrare, rândul standard.
  Sortarea pe două niveluri: scenarii_real/excel-sortare-doua-niveluri.json.
- [NEVERIFICAT]: Order după alegerea unei coloane cu numere/text (R7-12; lista nu s-a schimbat); Excel fără registru
  (R7-16; Ctrl+W pe ultimul registru nu l-a închis în 20 s); lista de completare =AV / =SU (nicio fereastră vizibilă);
  R7-17 doar parțial (implicitele Desktop/Acasă/Galerie/Acest PC/Rețea, ordinea pe un profil curat necunoscută); R7-18
  (redenumirea) nefăcut; R7-5, R7-13, R7-19, R6-3 nefăcute.
- Excel a dispărut singur la sfârșitul fiecărei rulări de capturi după pasul z (SDI: fereastra XLMAIN invalidă la închidere).
  Nicio instanță rămasă (tasklist gol). Intrările din `Resiliency\DocumentRecovery` (122CE5 din 05.07, 4147402 din 28.09)
  sunt VECHI, nu ale mele → neatinse.

## Gata la predare (10:58)
- Reluate `excel-ctrl-w-modificat` și `excel-salvare-ca` (10:40): ctrl-w → dialog {titlu "", intrebare „Save your changes
  to this file?”, butoane [More options…, Save, Don't Save, Cancel], apasat null}, registru_activ Book1, probat; salvare-ca
  → nume_fisier „Note.xlsx”, probat, fără căi C:/Users. Total: 15/15 scenarii cu mod_probat true.
  `acoperire_excel_r7.py verifica` = 0; `dump_uia_office.py verifica` = 0; nicio instanță Excel rămasă.
- NU s-a rulat încă nimic pe bibliotecă (nici O3/O4 direct, nici masoara.py) — numerele „după” lipsesc.

## Rămas de făcut (în ordinea asta)
1. `D/de_verificat.md`: bifează `[x]` cu calea dovezii: R6-1, R6-4, R7-1, R7-2, R7-7, R7-11, R7-14, R7-15, R7-8, R7-9,
   R6-6, R7-10, R6-2 (Tab = SUBSTITUTE → too few arguments; lista însăși NEVERIFICAT), R7-3/R7-4 (doar numerele probate),
   R7-6 (186 px), R6-5 (dacă salvare-ca a ieșit probat). Lasă R7-12 (parțial), R7-16, R7-17, R7-18, R7-5, R7-13, R7-19, R6-3.
2. Măsurarea, SINGURĂ pe mașină: `python D/oracole/masoara.py --runda 7 --paralel 3` (~1 h; porțile ~53 min).
   Înainte = `runde/7/masurare_final_r7.json` (O1 61, O2 13392, O3 20337, O4 43, O5 113, O6 0, O7 353, O8 102, O9 34, porți 41).
3. `python D/ingheata.py --acoperire "B-excel dupa runda 7: capturi UIA reale (Save this file, Save your changes, AutoSum, Sort, eroarea formulei, galerii, grafice, bara de stare) + scenarii noi"`, apoi `python D/ingheata.py --verifica` = 0.
   (Ordinea din prompt: reînghețarea ÎNAINTE de măsurare dacă `masoara.py` refuză lacătul rupt — vezi runda Word.)
4. `D/runde/7/acoperire_excel.md` (forma din prompt; ultima linie ACOPERIRE_GATA / ACOPERIRE_PARTIALA).
   Verdictul propus: ACOPERIRE_PARTIALA (R7-12 numere, R7-16, completarea, R7-17/18 rămase).
