# Runda 6 · pentru critic — unde e ce (Excel în biblioteca centrală)

## Fișierele (worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`, necomise)
- `aplicatii/excel.js` (nou) — modulul Excel: modelul foii, grila, editarea, formulele, umplerea, comenzile, gesturile.
- `aplicatii/date/excel.json` (nou, GENERAT) — din `referinte/uia_excel.json` de `aplicatii/_unelte/genereaza_excel.py`
  (`--verifica` → 0). Cheia `zona` = geometria foii din `zona_document`.
- `aplicatii/_unelte/genereaza_excel.py` (nou) — refolosește `genereaza_word.py` (neatins; `genereaza_word.py --verifica` → 0).
- `aplicatii/profiluri/excel365.json` (nou).
- `aplicatii/aplicatii.js` — o linie: `SURSE_APP.excel`.
- `aplicatii/aplicatii.css` — bloc nou la capăt („Excel (runda 6)”), clase `lh-ap-x-*` și `.lh-ap-excel`.
- `aplicatii/poligon.html` — conținutul de probă pentru `?aplicatie=excel`.
Neatinse: `word.js`, `panglica.js`, `stare.js`, `date/word.json`, lecțiile, jocurile, `jocuri/_motor/`, oracolele, referințele.

## Cum se deschide
Server local pe worktree (de ex. `python -m http.server 8000 --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel`),
apoi `http://127.0.0.1:8000/aplicatii/poligon.html?aplicatie=excel` — Excel cu o foaie mică de clasa a VIII-a (Elev, Nota 1,
Nota 2, Media; celula activă D2). Din cod: `LH.aplicatii.deschide('excel', {loc, continut, focus: true})`.

## Parametrii de conținut (`continut`, api_biblioteca.md §7.1)
- `celule: {A1: 4, B1: "text", C1: "=A1*2"}` — numere, texte, formule (forma engleză din COM, sau cea românească cu „;”);
- `selectie: "A1"` | `"A1:C1"` | `"A1,C3"`;
- `format: {B1: {bold: true, italic, underline, aliniere: "stanga|centru|dreapta", imbinat: "A1:C1", format_numar}}`;
- `foi: [{nume, celule, format}]` (mai multe foi; implicit una, „Sheet1” din referință) și `nume` (registru deja salvat).

## Starea (`LH.aplicatii.stare('excel')`)
`celule {A1: {valoare, text, formula?}}` (celula în editare: `{valoare, text, editare: true}` — textul de pe ecran),
`format_celule`, `selectie {activa, zona}`, `nume_fisier`, `fereastra_mesaj` (null), `ramane_in_editare`, plus `foi`,
`foaie_activa`, `dialog`, `pagina_backstage`, `titlu_fereastra`.

## Probe
- `runde/6/proba_excel.py` (aspect față de `zona_document` + gesturi reale; ultima linie = picate): înainte 2/2 picate
  (Excel nu se deschidea), după 0/20.
- O4 doar pe Excel: `LH_IESIRE=<dosar temporar> python oracole/oracol_comportament.py --scenarii scenarii/excel`.
- Regresul Word: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`,
  `runde/2/proba_grav.py` (`runde/6/regres_*.log`).
