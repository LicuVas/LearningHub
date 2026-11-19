#!/bin/sh
# Regresul rundei 10 (Excel + Word), secvențial; fiecare probă: log în runde/10/regres_<eticheta>.log, rezumat în regres_rezumat.txt
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
P=${1:-regres}
: > $D/runde/10/${P}_rezumat.txt
for x in "9/proba_grav.py" "8/proba_grav.py" "7/proba_grav_cont.py" "6/proba_excel.py" "7/proba_grav.py" "7/proba_grav_cont2.py" "5/proba_grav.py" "4/proba_grav.py" "4/proba_telefon.py" "3/proba_grav.py" "2/proba_grav.py"; do
  e=$(echo $x | tr '/' '_')
  if grep -q -- "--iesire" $D/runde/$x; then python $D/runde/$x --iesire $D/runde/10/${P}_$e.json > $D/runde/10/${P}_$e.log 2>&1
  else python $D/runde/$x > $D/runde/10/${P}_$e.log 2>&1; fi
  echo "$x -> $(tail -1 $D/runde/10/${P}_$e.log)" >> $D/runde/10/${P}_rezumat.txt
done
echo GATA >> $D/runde/10/${P}_rezumat.txt
