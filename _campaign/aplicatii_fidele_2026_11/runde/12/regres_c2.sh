#!/usr/bin/env bash
# Constructorul 2 al rundei 12: regresul complet din supliment (după bucata 6), fără măsurare (pasul 7 se rulează singur, după).
# Ieșirile în runde/12/c2_regres_*.log; rezumatul în runde/12/c2_regres_rezumat.txt.
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/12
: > $O/c2_regres_rezumat.txt
for f in 11/proba_powerpoint.py 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py \
         10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav_cont.py 6/proba_excel.py 7/proba_grav.py 7/proba_grav_cont2.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 $R/$f > $O/c2_regres_$n.log 2>&1
  echo "$f: exit=$? ultima=$(tail -1 $O/c2_regres_$n.log | cut -c1-200)" >> $O/c2_regres_rezumat.txt
done
echo GATA >> $O/c2_regres_rezumat.txt
