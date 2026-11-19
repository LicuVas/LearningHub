# Runda 9 · etapa B · Excel · TABELUL DIFERENȚELOR (pasul 5)

Coloane: suprafață · ce face aplicația reală (citat din referința înghețată) · ce face simulatorul la pornire (fișier:rând,
din `30dbbe30`) · gravitate · reparația (rândul de după, în worktree). U = `referinte/uia_excel.json`,
SR = `referinte/scenarii_real/`, API = `api_biblioteca.md`.

| # | suprafață | aplicația reală (citat) | simulatorul la pornire | grav. | reparația |
|---|---|---|---|---|---|
| D1 | E1 Alt+literă care închide o fereastră | U › `dialog.FileSaveAs`: Save „Alt+s” (cu „+”, tastă ținută); filele panglicii „Alt, H” (cu virgulă, șir de taste). API §4: KeyTips = „tastele care doar arată literele (Alt)” | `excel.js:2693-2696`: ascultătorul ferestrei oprește litera cu `stopImmediatePropagation`, `altSingur` rămâne `true`; la ridicarea lui Alt, fereastra e închisă și KeyTips pornesc (`:2812-2820`) → „abc” = fila Data + Subtotal | GRAV | `excel.js:2726-2728`: `altSingur = false` înainte de oprire |
| D2 | E2 Enter pe CheckBox / RadioButton | API §4 `activat`: ENTER = „IDOK or control identifier of the default push button” (learn.microsoft.com, dlgbox-programming-considerations) | `excel.js:2043` (`esteButon` include CheckBox, RadioButton) + `:2117` → Enter comută caseta / alege butonul, fereastra rămâne | GRAV | `excel.js:2144-2147`: la Enter doar `Button` se apasă singur; altfel `butonImplicit()` (OK / Sort...) |
| D3 | K1 focusul după alegerea pe nivelul 2 din Sort | U › `acoperire_r7.fapte`: Sort se deschide cu focusul pe OK; regula Windows: focusul rămâne pe controlul folosit (fereastra nu-l pierde) | `excel.js:1526` șterge rândurile 2+ (chemat din `:1589`, `:1596`) fără să pună focusul înapoi → BODY, Enter fără eveniment | GRAV | `excel.js:1530-1534` + `:1560-1565` (`focusNivel`), `:1605`, `:1614` |
| D4 | E4 No / Esc în „We found a typo…” | U › `acoperire_r7.fapte.e_sum_lipit.mod_dupa_inchidere`: „Cell Mode Edit” | `excel.js:1946` / `:2140-2152`: înapoi în editare cu modul „Enter”; ← = `formula_neprimita`, fereastra reapare | GRAV | `excel.js:1963-1973` (`inchideDialog`): modul Edit doar pentru `dialog.eroare_formula` |
| D5 | E3 modul după Σ / ▾ Average / Alt+= | U › `acoperire_r7.fapte.c_autosum`: `mod_dupa_sigma` = `mod_dupa_average` = „Cell Mode Point”; SR `excel-point-egal-sus.json` (în Point, săgeata scrie o referință) | `excel.js:1408`: `porneste(…, 'Enter', …)`; bara „Enter”; ↓ primește formula (B8 = 48, B9) | GRAV | `excel.js:1409-1412`: `punct = true`, `pk` = zona propusă; `:2631` golește `ales` când săgeata înlocuiește zona |
| D6 | E3 ce scrie săgeata în Point după Σ | [NEVERIFICAT] — referința dă doar modul | după reparație: B8, Σ, ↓ → „=SUM(B9)” (mecanismul K5, pornit din celula editată) | — | nimic; R9-1 în `de_verificat.md` |
| D7 | X10 graficele | U › `lista.ChartTypeColumnInsertGallery`, `panglica_context.Ctx_ChartDesign` / `Ctx_Format`, `dialog.ChartChangeType`, `acoperire_r7.fapte.h_grafic` | mesajul central „Insert Column or Bar Chart … nu e simulată” | GRAV | NEFĂCUT de constructorul 1 (predare) |
| D8 | E5 Yes în typo | `runde/8/critic_probe/com_r8.json`: `=SUM(B2:B7)*B2:B6` → D2:D6 = 432, 336, 384, 480, 288, `HasSpill: true` | D2 = `#VALUE!` | GRAV | NEFĂCUT de constructorul 1 (predare) |

## Probe vechi contrazise de referință (regresul constructorului 1, `regres_c1_rezumat.txt`)
Nicio probă nouă contrazisă în runda 9. Rămân cele două cazuri deja explicate în runda 8, cu aceleași verificări picate ca în
`runde/8/regres_c2_*.log` (comparate rând cu rând):
- `7/proba_grav.py` = 2, ambele X6 „=SUM(B2:B4)B2” (proba cere mesajul central; referința `dialog.eroare_formula` dă fereastra
  „We found a typo…”) — `runde/8/diferente.md` › D14;
- `7/proba_grav_cont2.py` = 3, toate X8 (Ctrl+W pe registru modificat: proba cere mesajul central; referința
  `scenarii_real/excel-ctrl-w-modificat.json` dă fereastra „Save your changes to this file?”) — `runde/8/diferente.md` › D18.
