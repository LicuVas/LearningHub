# Runda 8 · etapa B · Excel · ȚINTA (pasul 3)

## Numerele care aleg ținta
- Pornirea (`runde/8/masurare_pornire.json` = măsurarea de după acoperire): O1 61, O2 13392, O3 21586, O4 69, O5 113,
  O6 0, O7 343, O8 102, O9 34; porți 41 (toate pe cum_fac); lacăt ok.
- GRAV-urile criticului 7 au întâietate (prompt §3): **9 deschise**, în ordinea suplimentului (paguba pentru elev întâi):
  K3, K5, K4, X5, X8, K2, K1, K6, X10 (graficele, ultimele).
- Excel: (O3+O4+O8) × lecții cel mai mare după Word (18 din 60 de pagini în `inventar.json`). Partea Excel din O3 adusă de
  acoperire: +1249 pe 17 suprafețe noi (`acoperire_excel.md` §6); din O4: 34 diferențe Excel, dintre care K5 6, K4 1,
  K6 1, X8 5, R6-1 4, R6-2 4, Sort 1 neexecutabil.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/excel.js` (tot ce ține de Excel)
- `aplicatii/date/excel.json` (regenerat cu `aplicatii/_unelte/genereaza_excel.py` din `uia_excel.json` de acum; fără
  editare de mână) și, dacă trebuie, `aplicatii/_unelte/genereaza_excel.py`
- `aplicatii/aplicatii.css` (doar clase `lh-ap-x-*` / `.lh-ap-excel`)
- `aplicatii/aplicatii.js`: DOAR un cârlig opțional (ținta tastei citită înainte de gest, cerută de Excel; Word nu-l
  folosește, deci evenimentele Word rămân identice) — pentru K2
- notele: `runde/8/*`, `de_verificat.md`, `de_aprobat.md`
Neatinse: `word.js`, `date/word.json`, `panglica.js`, lecțiile, jocurile, `jocuri/_motor/`, referințele, scenariile,
oracolele, `api_biblioteca.md`, `repere.lock`.

## Granița de predare
După fiecare GRAV probat: `stare_autor.md`. La ~200k de context: pasul 7 pe ce e gata și PREDARE.
