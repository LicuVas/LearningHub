# Runda 25 — cadrul (înainte de reparație)

## Suprafața
Grila Excel (`aplicatii/excel.js`): fereastra de 150 de rânduri / 30 de coloane de la marginile foii, barele de derulare, plus 4 scenarii O4 (`excel-numere-afisare`, `excel-autofit-latime`, `excel-autocompletare-tab`, `excel-separator-virgula`) și `excel-sortare-doua-niveluri` (neexecutabil). Unghiul rundei: `gest_tastatura`.

## Presupuneri (de verificat, nu de crezut)
1. Saltul de 25 de rânduri la ↑ și pasul inegal la PgDn au aceeași cauză ca oprirea rotiței: când fereastra își schimbă originea, `scrollTop` rămâne în px ai ferestrei vechi (`excel.js:1035-1038`, `:1230-1231`). Dacă păstrez poziția vizuală (`scrollTop += OY_vechi − OY_nou`), toate trei dispar. Probat: F7/F8 pică azi exact cum spune criticul 21.
2. Rotița și bara nu pot ieși din fereastră pentru că fereastra e legată DOAR de celula activă (`intindere`). Trebuie o „vedere” mutată de derulare, care ține cât timp celula activă nu se mișcă afară din ea.
3. Diferențele O4 de la `autocompletare-tab` / `separator-virgula` nu sunt ale simulatorului: realul citește celulele DUPĂ „Esc în mesaj și Esc în celulă” (descrierea scenariului), simulatorul fără ele. Dacă simulatorul, cu Esc + Esc, dă exact celulele reale, reparația ține de scenariu (zona înghețată), nu de `excel.js`.
4. „1,4e-7” e un defect al lui `general()` (`excel.js:46-49`: pragul 1e-9 lasă `String(1.4e-7)`), iar lățirea coloanei la tastare (`:1422-1427`) exclude formulele pe baza unei capturi COM (`com_r6`), pe când scenariul real e tastat (`gest_real`).

## Citiri ale lui „fidel” aici
- **aspect:** grila și barele la ±2 px de `uia_excel.json › zona_document`, cu numele bucăților din referință;
- **gest:** rotița / bara / săgețile / PgDn duc vederea continuu, câte un rând / un ecran, până la marginile foii, ca pe grila normală;
- **stare finală:** textul afișat și lățimile coloanelor după tastare, ca în `scenarii_real/*.json`.

**Aleasă: gestul + starea finală.** Unghiul rundei e `gest_tastatura`, iar ținta 1 e un gest (rotița, ↑, PgDn) care azi blochează elevul la fundul foii. Aspectul pierde pentru că abaterile lui sunt 2-3 px (MINOR 5-6): le fac doar unde nu ating codul comun.
