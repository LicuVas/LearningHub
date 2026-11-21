#!/bin/bash
# Runda 25: regresul Excel (G17-1/G17-2 = runde/21/proba_grav.py; probele vechi 17, 10, 9, 8, 6), O4 pe scenarii/excel, proba rundei
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde/25/regres
: > $R/regres_rezumat.txt
for p in 21/proba_grav.py 17/proba_grav.py 10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 6/proba_excel.py; do
  n=$(echo $p | tr '/' '_')
  timeout 900 python $D/runde/$p --iesire $R/$n.json > $R/$n.log 2>&1
  echo "$p exit=$? ultima=$(tail -1 $R/$n.log)" >> $R/regres_rezumat.txt
done
mkdir -p $D/runde/25/probe_iesiri/o4_final
LH_IESIRE=$D/runde/25/probe_iesiri/o4_final python $D/oracole/oracol_comportament.py --scenarii $D/scenarii/excel > $D/runde/25/probe_iesiri/o4_excel_final.log 2>&1
echo "O4 excel ultima=$(tail -1 $D/runde/25/probe_iesiri/o4_excel_final.log)" >> $R/regres_rezumat.txt
python $D/runde/25/proba_grav.py --iesire $D/runde/25/proba_grav_dupa.json > $D/runde/25/proba_grav_dupa.log 2>&1
echo "r25 proba_grav ultima=$(tail -1 $D/runde/25/proba_grav_dupa.log)" >> $R/regres_rezumat.txt
LH_VECHI=1 python $D/runde/25/proba_grav.py --iesire $D/runde/25/proba_grav_vechi.json > $D/runde/25/proba_grav_vechi.log 2>&1
echo "r25 proba_grav LH_VECHI ultima=$(tail -1 $D/runde/25/proba_grav_vechi.log)" >> $R/regres_rezumat.txt
