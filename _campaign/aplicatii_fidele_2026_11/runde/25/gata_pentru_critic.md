# Runda 25 (B-excel#2, gest_tastatura) — gata pentru criticul rece

- **Ținta** (`runde/supliment_B_excel_runda25.md`): R21-2 + MINOR 1-3 (fereastra de 150 de rânduri), O4 pe 4 scenarii + cel neexecutabil, MINOR 5-6, unghiul gest_tastatura.
- **Schimbat:** doar `aplicatii/excel.js` (`excel_js.diff`, 20 de bucăți; copia de dinainte: `inainte/excel.js`). Fișiere comune atinse: niciunul.
- **Proba constructorului:** `proba_grav.py` 9 → 0 picate din 13 (codul vechi servit cu `LH_VECHI=1`: 9). O4 `scenarii/excel`: 57 → 59 ok, 12 → 12 unități (sortarea se joacă acum, dar referința ei e greșită: R25-1; fără ținta `camp:Order#2` ar fi 5). Regres r21 / r17 / r10 / r9 / r8 / r6: 0 picate.
- **Unde să lovească criticul** (gest_tastatura): rotița / bara / ↑ / PgDn peste marginea ferestrei, la A1048576 și XFD7 (vederea mutată `VR/VC` + `margineFereastra` + `laLoc`); tastarea după derulare (vederea se întoarce la celulă); grila normală (nu trebuie să se fi schimbat); Ctrl+PgDn pe ultima foaie (R25-7, nereparat); Ctrl+; și Ctrl+1 fără eveniment (cod comun).
- **Raportul:** `raport_constructor.md`; diferențele: `diferente.md`; de verificat: `D/de_verificat.md › RUNDA25-EXCEL`.

GATA_PENTRU_CRITIC
