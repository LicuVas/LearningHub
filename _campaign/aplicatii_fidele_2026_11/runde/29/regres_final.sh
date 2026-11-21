#!/bin/bash
# Runda 29: regresul pe codul FINAL (după micșorarea ferestrelor pe telefon)
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde/29
F=$R/regres/regres_final.txt
: > $F
python $R/proba_grav.py --iesire $R/proba_grav_dupa.json > $R/proba_grav_dupa.log 2>&1; echo "r29 proba_grav ultima=$(tail -1 $R/proba_grav_dupa.log)" >> $F
LH_VECHI=1 python $R/proba_grav.py --iesire $R/proba_grav_vechi.json > $R/proba_grav_vechi.log 2>&1; echo "r29 proba_grav LH_VECHI ultima=$(tail -1 $R/proba_grav_vechi.log)" >> $F
python $D/runde/25/proba_grav.py --iesire $R/regres/25_final.json > $R/regres/25_final.log 2>&1; echo "25/proba_grav ultima=$(tail -1 $R/regres/25_final.log)" >> $F
python $D/runde/21/proba_grav.py --iesire $R/regres/21_final.json > $R/regres/21_final.log 2>&1; echo "21/proba_grav ultima=$(tail -1 $R/regres/21_final.log)" >> $F
LH_IESIRE=$R/probe_iesiri/o4_final2 timeout 1800 python $D/oracole/oracol_comportament.py --scenarii $D/scenarii/excel > $R/probe_iesiri/o4_excel_final2.log 2>&1
echo "O4 excel ultima=$(tail -1 $R/probe_iesiri/o4_excel_final2.log) | $(grep '^Rezultat' $R/probe_iesiri/o4_excel_final2.log)" >> $F
echo GATA >> $F
