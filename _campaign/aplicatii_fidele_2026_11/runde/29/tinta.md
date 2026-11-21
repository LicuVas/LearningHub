# Runda 29 — ținta

## Numerele care au ales-o
- Pornirea (`masurare_pornire.json`, măsurarea comună a ciclului C/r26): O1 61 · O2 13392 · O3 28919 · O4 15 · O5 35 · O6 0 · O7 341 · O8 102 · O9 13 · porți 41 (cum_fac). O4 pe `excel-*`: 59/64 ok (critic 25 › C).
- **GRAV-ul criticului din runda trecută are întâietate** (prompt pasul 3): G25-1 (`runde/25/critic.md:68`) — Delete, Move or Copy, Tab Color și tragerea filei nu fac nimic pe drumul m1-l03. O8 nu-l numără (oarba lui: `registru-foi` lipsește din `oracol_comenzi_moarte.json`, critic 25 › „Pentru orchestrator”), deci alegerea nu vine din (O3+O4+O8) × lecții, ci din supliment.
- Lecții care cer gesturile: viii/m1-l03 (pasul 4-5: 1 `incearca` + 6 exerciții + 2 ateliere + 3 întrebări finale cu foi). Jocurile/lecțiile cu `registru-foi.js` nu sunt mutate încă (etapa C).
- Proba de pornire: `runde/29/proba_grav.py` = **16 picate din 17** (`proba_grav_inainte.log`).

## Ordinea (supliment_B_excel_runda29.md)
1. G25-1: Delete pe filă (cu date → întrebarea; goală → direct; singura → refuzul), Home › Delete ▾ › Delete Sheet, Move or Copy (lista foilor, OK, Create a copy), tragerea filei (și cu Ctrl), Tab Color › Standard Colors, Ctrl+Z după ștergere.
2. Ctrl+PageDown / Ctrl+PageUp → foaia vecină, pe loc la capete (R25-7).
3. MINOR 1 critic 25: Alt într-o fereastră → `arata_taste_acces`.
4. Unghiul stare_finala_erori pe drumurile lecțiilor (formula greșită + Esc / Enter, Delete pe rând + Ctrl+Z, lipirea peste date + Ctrl+Z, redenumirea cu nume existent / gol).
5. MINOR-urile criticilor 25 / 21, cât ajunge contextul.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/excel.js`
- `_campaign/aplicatii_fidele_2026_11/runde/29/*` (artefactele, probele)
- `de_verificat.md` / `de_aprobat.md`: doar blocul `<!-- RUNDA29-EXCEL:START/END -->`.
- NU: `aplicatii/aplicatii.js`, `aplicatii.css`, `panglica.js` (comune), `date/excel.json` (generat de `genereaza_excel.py`; ferestrele desenate fără referință stau în `excel.js`, ca să nu le șteargă regenerarea), referințele, scenariile, `api_biblioteca.md` (textul nou → `api_propunere.md`).
