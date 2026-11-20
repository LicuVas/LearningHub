# Runda 17 (B-excel#2), predarea către criticul rece — 20.11.2026

- **Unghiul:** stare_finala_erori. **Ținta:** X10, A1, T1 din `runde/10/critic.md` (:34, :64, :129) + cele 11 scenarii ale acoperirii 14 (`runde/14/acoperire_excel.md` §4).
- **Fișiere schimbate de rundă:** `aplicatii/excel.js`, `aplicatii/date/excel.json` (regenerat cu `genereaza_excel.py`, `--verifica` = 0), `de_verificat.md` și `de_aprobat.md` (doar blocul `RUNDA17-EXCEL`). Copiile de dinainte: `runde/17/inainte/`.
- **Fișiere comune:** niciunul atins (`aplicatii.js`, `poligon.html`, `word.js` din `git diff` sunt ale altor benzi).
- **Numere:** `proba_grav.py` 16 → 0 picate din 18; O4 pe `scenarii/excel` 44 → 12 (cele 11 scenarii noi: 0 → 11 trec; restul de 12 = aceleași rânduri vechi); probele Excel vechi = aceleași rezultate ca la criticul 10.
- **Referințele de citit:** `referinte/uia_excel.json` › `lista.ChartTypeLineInsertGallery`, `lista.AddChartElementMenu`, `lista.AddChartElementMenu#Data Labels`, `…#Data Labels#Clustered Column`, `acoperire_r14.fapte` (`x_line`, `y_data_labels_line`, `z_data_labels_coloana`, `v_varsare_com`); `referinte/scenarii_real/excel-grafic-*`, `excel-varsare-*`, `excel-ctrl-*`; `runde/10/probe/com_r10_c.json` (locul graficului pe o zonă mică).
- **Lecția atinsă indirect:** `lectii/viii/m2-l11` (neschimbată).
- **Deschise, fără referință:** R17-1 (Backspace / Cut cu graficul ales), R17-2 (Data Labels la Bar / Pie), R17-3 (etichetele după Change Chart Type); A17-1 (grila nu se lungește până la A1048576 / XFD) de aprobat.
- **Pasul 7 complet** (`masoara.py`, O3 / O5 / O8 / O9): al orchestratorului.

GATA_PENTRU_CRITIC
