# Runda 10 · B-excel · ținta (pasul 3)

**Ținta e dată de GRAV-urile deschise ale criticului 9** (au întâietate) și de supliment: A1, A2, E5, în ordinea asta; apoi
MINOR-urile din punctul 4 (ținta tastelor cu graficul ales, Esc în Sort pe Then by, axa valorilor). X10 NU (supliment: cere o
rundă `acoperire`, deblocatorul e `de_verificat.md` R9-6).

Numerele de la pornire (`masurare_pornire.json`): O1 61, O2 13392, O3 21586, O4 50, O5 113, O6 0, O7 343, O8 102, O9 34;
porți 41 (toate cum_fac). Suprafețele țintei sunt toate în Excel. Plasa lui O3 nu deschide `bara_stare#selectie_numere` când
`bara_stare` e deja citită (`oracole/structura_lib.py:1611`), iar graficul nou și vărsarea n-au scenarii O4. Deci dovada e
proba `proba_grav.py`; pasul 7 arată doar dacă s-a stricat altceva.

Proba înainte (cod neatins): `proba_grav_inainte.json` = 19 picate (A1 6, A2 5, E5 6, M1 2, plus M2 cu o greșeală de probă,
reparată). M2 și M3 pe copia HEAD: `proba_grav_inainte_m2m3.json` = 4 picate.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/excel.js`
- notele din `runde/10/` (inclusiv `probe/`), `de_verificat.md` (secțiunea RUNDA10), `de_aprobat.md` (dacă e cazul)
