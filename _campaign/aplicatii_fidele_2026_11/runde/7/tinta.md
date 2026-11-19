# Runda 7 · etapa B · Excel — ȚINTA (pasul 3)

## Numerele care aleg ținta
- GRAV-urile deschise ale criticului 6 au întâietate (prompt §3): **GRAV 10** (X1-X10, `runde/6/critic.md`), în ordinea
  din `supliment_B_excel_runda7.md`: X9, X5, X6, X1, X2, X7, X10, X8, X3, X4.
- Oracolele la pornire (finalul rundei 6): O1 61, O2 13392, O3 20337, O4 43, O5 113, O6 0, O7 353, O8 102, O9 34;
  porți 41 (doar cum_fac). O2/O3/O7/O8 se măsoară pe lecții, care încă încarcă simulatoarele vechi (etapa C); deci
  runda asta nu le poate mișca. Partea Excel a lui O4 = 5, a lui O5 = 1, a lui O9 = 1 (`runde/6/raport_constructor.md`).
- Excel apare în 18 din 60 de pagini din `inventar.json` (aplicația cu cele mai multe lecții după Word): (O3+O4+O8) × lecții
  e cel mai mare pe Excel, iar GRAV-urile lui blochează drumurile a 5 lecții VIII (m1-l03, m1-l06, m2-l08, m2-l09,
  m2-l10/l11) și telefonul (I1).

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/excel.js` (modelul, grila, editarea, comenzile)
- `aplicatii/aplicatii.css` (doar blocul Excel, clase `lh-ap-x-*` / `.lh-ap-excel`, plus regula de telefon a Excel-ului)
- `aplicatii/panglica.js` (doar pictogramele Acces rapid, X3 — dacă se ajunge acolo)
- `aplicatii/date/excel.json` + `aplicatii/_unelte/genereaza_excel.py` (doar dacă o suprafață nouă din referință trebuie
  generată — X7/X10)
- notele: `runde/7/*`, `de_verificat.md`, `de_aprobat.md`
Neatinse: `word.js`, `date/word.json`, `aplicatii.js` (comun Word+Excel), lecțiile, jocurile, `jocuri/_motor/`,
referințele, oracolele, `api_biblioteca.md`.

## Ordinea și granița de predare
X9 → X5 → X6 → X1 → X2 → X7 → … ; după fiecare GRAV probat: `stare_autor.md`. La ~200k de context: PREDARE.
