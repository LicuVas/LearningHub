# Runda 17, ținta (scrisă de orchestrator în `runde/supliment_B_excel_runda17.md`; GRAV-urile criticului 10 au întâietate)

## Numerele care au ales-o (pornirea, măsurate azi)
- O4 doar pe `scenarii/excel` (64 de scenarii, `probe_iesiri/o4_excel_pornire.log`): **44** = 32 din cele 11 scenarii ale acoperirii 14 (toate 11 pică) + 12 mai vechi (autocompletare, autofit, numere, separator, sortare, tragere — neatinse aici).
- O3 pe Excel (acoperirea 14 §6): +284 pe cele 4 liste nedesenate (99 + 78 + 57 + 50).
- `proba_grav.py` la pornire: 16 din 18 verificări picate (X10 ×10, A1 ×2, T1 ×4).
- Lecția: `lectii/viii/m2-l11` (graficele), singura care cere Line + Data Labels.

## Ordinea (paguba pentru elev)
1. X10 — galeria Line, Add Chart Element, Data Labels ▸ (Line ≠ Clustered Column), cheile `tip_grafic` / `serii_grafic` / `categorii_grafic` / `etichete_date`, mouse + taste.
2. Vărsarea — `#SPILL!`, `=B2:B6`, `&`, comparațiile, Ctrl+săgeți peste celulele vărsate, Ctrl+↓ / Ctrl+→ până la marginea foii, Ctrl+A.
3. A1 — tragerea cu degetul pe telefon.
4. T1 — ținta textului de pe telefon cu graficul / titlul ales.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/excel.js` (copia de dinainte: `runde/17/inainte/excel.js`);
- `aplicatii/date/excel.json` — DOAR prin `aplicatii/_unelte/genereaza_excel.py` (regenerat din referința înghețată; copia: `runde/17/inainte/excel.json`);
- `D/de_verificat.md`, `D/de_aprobat.md` — doar blocul `RUNDA17-EXCEL`;
- `D/runde/17/*`.
Fișiere comune: niciunul planificat (T1 prin getter în `excel.js`, A1 prin stil pe element în `excel.js`). Dacă unul devine necesar, intră în raport › „Fișiere comune atinse”.
