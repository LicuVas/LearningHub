# Runda 6 · ȚINTA (pasul 3)

## Numerele care au ales-o (din `runde/5/iesiri/`, finalul rundei 5)
| oracol | total | partea Excel | de unde |
|---|---|---|---|
| O3 | 20337 | 6071 puncte (48 de suprafețe Excel; 30 nedesenate în nicio pagină) | `O3/oracol_ui.json › pe_suprafata` |
| O4 | 101 | 63 (37 de scenarii neexecutabile = 59 de chei + 4 fără rezultat real) | `O4/oracol_comportament.json` |
| O8 | 102 | 1 | `O8/oracol_comenzi_moarte.json` |
| O5 | 154 | 42 (toate gesturile Excel: „excel nu e încă în bibliotecă”) | `O5/oracol_evenimente.json › pe_aplicatie` |
| O9 | 41 | 8 (A-E, G, H pe poligon + F pe lecții) | `O9/oracol_asistare.json` |

(O3+O4+O8) Excel = 6135, × 18 pagini cu Excel în `inventar.json` — cea mai mare suprafață rămasă. Ținta e fixată și de
supliment: prima rundă a valului B-excel = aplicația Excel în bibliotecă. Criticul rundei 5 are 8 GRAV pe Word: NU sunt
ținta rundei (supliment, „Unde suntem”).

## Ce se poate mișca în runda asta
O4 (scenariile Excel pe poligon), O5 (42 de gesturi), O9 (7 cazuri pe poligon). O2/O3/O7/O8 se măsoară pe lecții, care
încarcă încă simulatoarele vechi (mutarea = etapa C) — nu se mișcă. Lecțiile NU se ating.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/_unelte/genereaza_excel.py` (nou) — generatorul, refolosește funcțiile lui `genereaza_word.py` (neatins).
- `aplicatii/date/excel.json` (nou, GENERAT).
- `aplicatii/excel.js` (nou) — modelul foii, grila, editarea, formulele, umplerea, panglica/Backstage/meniuri/dialoguri.
- `aplicatii/profiluri/excel365.json` (nou).
- `aplicatii/aplicatii.js` — o singură linie: `SURSE_APP.excel`.
- `aplicatii/aplicatii.css` — un bloc nou la capăt, doar clase `lh-ap-x-*` (Word neatins).
- `aplicatii/poligon.html` — conținutul de probă pentru `?aplicatie=excel` (o foaie mică de clasa a VIII-a).
- Note: `runde/6/*`, `de_verificat.md`, `de_aprobat.md`.
Neatinse: `word.js`, `panglica.js`, `stare.js`, `date/word.json`, lecțiile, jocurile, `jocuri/_motor/`, referințele,
oracolele, `api_biblioteca.md`.
