# Runda 11 · pasul 3 · ȚINTA

Pornirea (`masurare_pornire.json`): O1 61 · O2 13392 · O3 21586 · O4 50 · O5 113 · O6 0 · O7 343 · O8 102 · O9 34 · porți 41.
Partea PowerPoint (runde/10/iesiri): O3 = 5037 puncte pe 41 de suprafețe (desenate de simulatoarele vechi din lecții; poligonul nu intră în O3 — la intrarea lui Excel, runda 6, O3 a rămas 20337); O4 = 17 scenarii neexecutabile + 1 fără rezultat real; O5 = 31 de gesturi RĂU; O9 = 8 cazuri RĂU (A-H).
În câte lecții apare (suprafete.json): backstage 10 pagini, clic_fila 11, tastare 11, clic_comanda_panglica 10.
Ținta (dată de supliment, are întâietate): aplicația PowerPoint în bibliotecă — (O4 17 + O5 31 + O9 7 din 8) = cel mai mare câștig posibil; F (lecția care ascultă) rămâne pentru etapa C.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/_unelte/genereaza_powerpoint.py` (nou) → `aplicatii/date/powerpoint.json` (generat)
- `aplicatii/powerpoint.js` (nou), `aplicatii/profiluri/powerpoint365.json` (nou)
- `aplicatii/aplicatii.js` (doar `SURSE_APP` += powerpoint), `aplicatii/aplicatii.css` (doar o secțiune nouă `.lh-ap-powerpoint`/`.lh-ap-p-*`)
- `aplicatii/poligon.html` (conținutul de probă pentru `?aplicatie=powerpoint`)
- notele: `runde/11/*`, `de_verificat.md` (R11-*), `de_aprobat.md`
Word (`word.js`, `genereaza_word.py`) și Excel (`excel.js`, `genereaza_excel.py`), `panglica.js`, `stare.js` NU se ating.
