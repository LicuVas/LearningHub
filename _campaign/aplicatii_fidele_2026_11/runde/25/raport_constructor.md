# Runda 25 (B-excel#2, unghiul gest_tastatura) — raportul constructorului, 21.11.2026

## Numerele (pornire → final)
| măsura | pornire | final | dovada |
|---|---:|---:|---|
| `proba_grav.py` (F1-F9 fereastra, M5-M6, N1 grila normală, E1 erori) | **9 picate din 13** | **0 picate din 13** | `proba_grav_inainte.log` → `proba_grav_dupa.log`; același cod vechi servit din `inainte/` (`LH_VECHI=1`): tot 9 (`proba_grav_vechi.log`) |
| O4 pe `scenarii/excel` (64) | 57 ok · 12 unități (9 diferențe în 4 scenarii + 1 neexecutabil + 2 fără real) | **59 ok · 12 unități** (2 + 8 + 2) | `probe_iesiri/o4_excel_pornire.log` → `probe_iesiri/o4_excel_final.log` |
| regres Excel: r21 (G17-1/G17-2), r17, r10, r9, r8, r6 | 0 · 0 · 0 · 0 · 0 · 0 (criticul 21) | **0 · 0 · 0 · 0 · 0 · 0** | `regres/regres_rezumat.txt`, `regres/*.log` |
| gesturi de tastatură fără niciun eveniment | — | 2 din 54 (Ctrl+;, Ctrl+1: cod comun) | `proba/gest_tastatura.json › _fara_eveniment` |

**De ce O4 rămâne la 12 unități deși trec 2 scenarii în plus:** `excel-sortare-doua-niveluri` era neexecutabil (1 unitate); acum se joacă până la capăt și dă 8 diferențe, pentru că REZULTATUL REAL e greșit (R25-1, mai jos). Fără ținta nouă `camp:Order#2` (o linie în `deseneazaNiveluri`), O4 ar fi 59 ok · **5 unități** (`probe_iesiri/o4_excel_lucru2.log`). Am păstrat-o: simulatorul face ce cere pasul („Largest to Smallest”). Hotărârea e a orchestratorului.

Pasul 7 complet (`masoara.py`) și O3 / O5 / O8 / O9 sunt ale orchestratorului.

## R21-2 + MINOR 1-3 (fereastra de 150 de rânduri) — FĂCUTE (pe proba mea; închiderea o dă criticul)
- **Ce era** (reprodus pe codul de azi, `proba_grav_inainte.json`): rotița se oprea la 1048427 (F2), din A2600 nu urca deloc peste 2500 (F4), „Line up” de la marginea ferestrei nu urca (F5), cursorul barei tras sus se oprea la 1048427 (F6), ↑ peste margine sărea 25 de rânduri cu celula jos (F7), PgDn din A1995 sărea +47 / 0 / +22 / +47 (F8), sub 1048576 rămâneau 16 px albi (F9).
- **Ce am făcut (`aplicatii/excel.js`):**
  - `deseneazaGrila`: când originea ferestrei se schimbă, `scrollTop = OY_vechi + scrollTop − OY_nou` (la fel pe coloane), deci rândurile de pe ecran nu sar. Asta singură închide MINOR 1 și 2;
  - vederea mutată de derulare `VR` / `VC` (`intindere`): ține cât timp celula activă nu se mută în afara ei; `alege` și tastarea (`porneste`) o anulează, iar vederea se întoarce la celula activă;
  - `margineFereastra` (pe `scroll`): aproape de marginea ferestrei, fereastra se redesenează cu vederea la mijloc. Doar în fereastră (R0 / C0 > 0 sau vedere mutată): grila normală rămâne exact cea veche (N1);
  - cursorul barei: locul și întinderea în toată foaia (`OY + scrollTop`, `OY + scrollHeight`), tras peste marginea ferestrei → `laLoc` mută fereastra; la A1048576 cursorul are 17 px, tras sus → rândul 1;
  - `derulare` (Line up / down, Page …) mută întâi fereastra;
  - MINOR 3: `corpIn.style.overflowY/X = 'clip'` doar când fereastra atinge rândul 1048576 / coloana XFD.
- **Proba** (`proba_grav_dupa.json`): F2 = 12 crestături, câte 31-32 de rânduri fiecare, fără goluri, până la 1048173; F4 = din A2600 până la rândul 1; F5 = 129 de rânduri cu 130 de clicuri (primul clic doar aliniază rândul văzut pe jumătate, ca în codul vechi); F6 = rândul 1; F7 = câte un rând, celula sus; F8 = pas constant de 23 de rânduri, celula jos; F9 = `jos_gol` 0; N1 = grila normală neschimbată.

## O4 — pe scenarii
| scenariul | pornire | final | ce am făcut |
|---|---|---|---|
| `excel-numere-afisare` | 6 diferențe | **OK** | `general()`: științific sub 0,0001 (pragul vechi 1e-9 lăsa „1,4e-7” din `String()`); lățirea la tastare și pentru rezultatul științific al unei formule; lățimea = 7 px × caractere + 9 (`latTastat`, din cele 4 lățimi reale) |
| `excel-autofit-latime` | 184 / 186 | **OK** | `potriveste`: textul măsurat la 15 px (11 pt rotunjit la pixel) + 5 |
| `excel-sortare-doua-niveluri` | neexecutabil (pasul 3, `meniu:Clasa`) | se execută; 8 diferențe = referința greșită | lista Sort: ținta `meniu:<nume>` (ca la celelalte liste, `excel.js:675`); rândurile 2+: `camp:Order#2`, `camp:Sort On#2` |
| `excel-autocompletare-tab` | 1 diferență | 1 diferență (voit) | nimic: realul citește celulele DUPĂ Esc + Esc; cu Esc + Esc simulatorul dă exact realul (`proba/gest_tastatura.json › _protocol_esc_esc`: mesaj, `ramane_in_editare` și celule = real) |
| `excel-separator-virgula` | 1 diferență | 1 diferență (voit) | la fel |
| `excel-tragere-*` (2) | fără real | fără real | nu sunt ale mele (gesturi vizibile pe Excel real) |

## MINOR 5-6 — FĂCUTE
- **MINOR 5:** zona foii urcă 2 px (`zonaSup.style.marginTop = '-2px'`; rândul de sus comun are 180 px, dar în referință panglica se termină la 179). Acum: Grid [1, 220, …, 492], Vertical [1345, 220, 17, 495], „1” la y 240, Name Box la [11, 188] (referința: 220 / 493, 220 / 496, 240, [10, 188]). Lățimea elementului „Grid” (1364, sub bara verticală, nevăzută) n-am atins-o.
- **MINOR 6:** bara orizontală are „Column left / Column right”, iar pista are butoanele „Page up / Page down” (verticală) și „Page left / Page right” (orizontală), cele de lungime 0 ascunse, ca în `zona_document`. Țintele evenimentelor devin `derulare:Column left`, `derulare:Page down` (nimic din lecții, scenarii sau `suprafete.json` nu folosea numele vechi).

## Unghiul gest_tastatura (`proba/gest_tastatura.py`, 54 de gesturi)
- **Merg, cu evenimentul și ținta bune:** săgețile, Ctrl+săgeți, Shift+săgeți, Ctrl+Shift+↓, Ctrl+Home / End, Ctrl+A (×2), Enter / Tab / Shift+Enter / Shift+Tab cu și fără selecție (în A1:B2 se rotesc în zonă), F2, Esc, Delete, Ctrl+Z / Y, Ctrl+C / X / V, F4 în formulă (`=$B$2`), Alt+= (`=SUM(...)`), KeyTips Alt → H, Ctrl+Shift+L (mesajul central „nesimulat”). Erori în pagină: 0.
- **Fără eveniment:** Ctrl+; (nici data) și Ctrl+1 → `gestTasta` din `aplicatii.js` (cod comun) → „Pentru orchestrator”.
- **Găsite, fără referință (în `de_verificat.md`, nereparate):**
  - **Ctrl+PgDn pe ultima foaie** mută celula activă 23 de rânduri (`{tasta_pagina, mutare, celula:A24}`); lecția viii/m1-l03:197 spune „te lasă pe loc” → **R25-7, candidatul cel mai serios pentru runda următoare**;
  - PgDn din A1 lasă vederea pe loc (R25-5); Alt+PgDn / Alt+PgUp fac ca PgDn / PgUp, nu un ecran la dreapta / stânga (R25-6); Alt+↓ într-o celulă coboară o celulă (R25-8); Ctrl+A ×2 dă „A:XFD” (R25-9);
  - acțiunea lui Ctrl+Shift+↓ e `mutare`, a lui Shift+↓ `extindere_selectie` (nume diferite pentru aceeași familie; MĂRUNT).

## Fișiere comune atinse
**Niciunul.** `aplicatii.js`, `aplicatii.css`, `panglica.js`, `stare.js`, `poligon.html`, `setari.json`, `versiune.json`, `api_biblioteca.md` — neatinse. `git status` arată `aplicatii.js`, `explorer.js`, `windows.js`, `word.js` modificate: sunt ale benzilor r23 / r24 / r26. Probele mele Excel au rulat CU schimbările lor pe disc. Am schimbat doar `excel.js`, deci regresul pe Word / PowerPoint / Explorer / Windows nu e cerut de mine. `date/excel.json` neatins.

## Pentru orchestrator
1. **R25-1, referința sortării e greșită:** `referinte/acoperire_excel_r7.py:1113` (`Range.Sort(..., Order2=2, ...)` cu argumente numite) a dat Punctaj crescător (`scenarii_real/excel-sortare-doua-niveluri.json` C2…C7 = 60, 88, 95 / 60, 78, 95). Trebuie refăcută într-o rundă `acoperire`. Până atunci, linia `else if (i && e.hasAttribute('data-lh-tinta')) …` din `deseneazaNiveluri` hotărăște dacă scenariul numără 1 (neexecutabil) sau 8 (diferențe false).
2. **R25-2, protocolul Esc + Esc:** `excel-autocompletare-tab` / `excel-separator-virgula` nu se pot închide cinstit în `excel.js`. Scenariul trebuie să aibă pașii Esc (sau cheile citite în două momente).
3. **Cod comun (`aplicatii.js › gestTasta`):** Ctrl+; și Ctrl+1 nu emit niciun eveniment (§4). Neatins, cum cere suplimentul.
4. **R25-7 Ctrl+PgDn** e pe drumul lecției viii/m1-l03 (cu 4 foi). Merită scenariu + reparație în runda Excel următoare.

## Fișierele rundei
- `aplicatii/excel.js` (copia: `inainte/excel.js`; diff-ul: `excel_js.diff`, 20 de bucăți; `excel_js_dupa.js` = starea la regres);
- `D/de_verificat.md`: blocul `RUNDA25-EXCEL` (R25-1…R25-10; copia `inainte/de_verificat.md`); `de_aprobat.md` neatins;
- `runde/25/`: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `proba_grav.py` + `proba/hc25.py` (cu `LH_VECHI=1`), `proba/gest_tastatura.py`, `proba/masura_text.py`, `proba/rect_zona.py`, `regres.sh`, jurnalele.

## NEFĂCUT / NESIGUR
- **NEFĂCUT:** R21-1, R21-3, R21-4 (pasul 5 al suplimentului: n-am ajuns, n-au referință); R25-5…R25-9 (fără referință).
- **NESIGUR:**
  - comportamentul exact al lui Excel pentru bara de la A1048576 (R25-10). Am reparat continuitatea, nu am copiat un comportament capturat;
  - formula lățimii (7·n + 9) e probată pe 2 lungimi (R25-3), iar autofit-ul pe un singur text (R25-4);
  - O3 n-a fost rulat de mine: numele noi ale barelor și grila mutată cu 2 px ar trebui să scadă diferențele, dar nu e măsurat.
