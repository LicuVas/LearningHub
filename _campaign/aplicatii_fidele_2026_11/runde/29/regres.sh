#!/bin/bash
# Runda 29: regresul Excel — probele vechi (25, 21, 17, 10, 9, 8, 6), O4 pe scenarii/excel (LH_IESIRE propriu), proba rundei și probele criticului 25 (pD, pC)
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde/29/regres
: > $R/regres_rezumat.txt
for p in 25/proba_grav.py 21/proba_grav.py 17/proba_grav.py 10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 6/proba_excel.py; do
  n=$(echo $p | tr '/' '_')
  timeout 900 python $D/runde/$p --iesire $R/$n.json > $R/$n.log 2>&1
  echo "$p exit=$? ultima=$(tail -1 $R/$n.log)" >> $R/regres_rezumat.txt
done
LH_IESIRE=$D/runde/29/probe_iesiri/o4_final timeout 1800 python $D/oracole/oracol_comportament.py --scenarii $D/scenarii/excel > $D/runde/29/probe_iesiri/o4_excel_final.log 2>&1
echo "O4 excel ultima=$(tail -1 $D/runde/29/probe_iesiri/o4_excel_final.log)" >> $R/regres_rezumat.txt
python $D/runde/29/proba/pD.py > $R/pD.log 2>&1; echo "pD $(tail -1 $R/pD.log)" >> $R/regres_rezumat.txt
python $D/runde/29/proba/pC.py > $R/pC.log 2>&1; echo "pC $(tail -1 $R/pC.log)" >> $R/regres_rezumat.txt
echo GATA >> $R/regres_rezumat.txt
