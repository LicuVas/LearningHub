# Runda 25 — ținta

Ținta e dată de orchestrator (`runde/supliment_B_excel_runda25.md`), nu aleasă de mine din (O3+O4+O8) × lecții.

## Numerele care au ales-o (măsurate la pornire)
- `proba_grav.py` pe codul de azi: **9 picate din 13** (F2 rotița, F4 rotița până la rândul 1, F5 „Line up”, F6 cursorul barei, F7 ↑, F8 PgDn, F9 fâșia de 16 px, M5 grila +2 px, M6 numele barelor) — `proba_grav_inainte.log`.
- O4 pe `scenarii/excel` (64): **57 ok, 12 unități**: 9 diferențe în 4 scenarii + 1 neexecutabil + 2 fără real (`probe_iesiri/o4_excel_pornire.log`).
- Criticul 21: GRAV 0, GRAV_VECHI 0 → runda nu are voie să aducă GRAV nou.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/excel.js` (copia: `inainte/excel.js`);
- `aplicatii/date/excel.json` (copia: `inainte/excel.json`) — doar dacă e nevoie;
- `D/de_verificat.md`, `D/de_aprobat.md`: doar blocul `RUNDA25-EXCEL` (copiile în `inainte/`);
- `D/runde/25/*`.

NU: `aplicatii.js` (r23/r24/r26), `aplicatii.css`, `panglica.js`, `stare.js`, zona înghețată, lecțiile.
