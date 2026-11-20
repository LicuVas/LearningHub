#!/bin/bash
# Runda 21: regresul probelor Excel vechi (aceleasi ca la runda 17 + proba rundei 17), iesirile in runde/21/regres/
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde/21/regres
: > $R/regres_rezumat.txt
for p in 17/proba_grav.py 10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav.py 7/proba_grav_cont.py 7/proba_grav_cont2.py 6/proba_excel.py; do
  n=$(echo $p | tr '/' '_')
  python $D/runde/$p --iesire $R/$n.json > $R/$n.log 2>&1
  echo "$p exit=$? ultima=$(tail -1 $R/$n.log)" >> $R/regres_rezumat.txt
done
