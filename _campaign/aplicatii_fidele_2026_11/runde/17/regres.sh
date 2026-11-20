#!/bin/bash
# Runda 17: regresul probelor Excel vechi (aceleași ca la criticul 10, critic_probe/reg_sumar.txt), ieșirile în runde/17/regres/
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde/17/regres
: > $R/regres_rezumat.txt
for p in 10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav.py 7/proba_grav_cont.py 7/proba_grav_cont2.py 6/proba_excel.py; do
  n=$(echo $p | tr '/' '_')
  if grep -q -- "--iesire" $D/runde/$p; then python $D/runde/$p --iesire $R/$n.json > $R/$n.log 2>&1; else python $D/runde/$p > $R/$n.log 2>&1; fi
  echo "$p exit=$? ultima=$(tail -1 $R/$n.log)" >> $R/regres_rezumat.txt
done
