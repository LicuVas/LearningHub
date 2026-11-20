#!/usr/bin/env bash
# Constructorul 1 al rundei 12, la predare: proba înainte (HEAD), regresul PowerPoint/Word/Excel, măsurarea parțială.
# Ieșirile în runde/12/predare_*.log; la final rezumatul în runde/12/predare_rezumat.txt.
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/12
: > $O/predare_rezumat.txt
python -X utf8 $O/proba_grav.py --inainte > $O/predare_proba_inainte.log 2>&1
echo "proba_grav --inainte: $(tail -1 $O/predare_proba_inainte.log)" >> $O/predare_rezumat.txt
for f in 11/proba_powerpoint.py 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py \
         10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav_cont.py 6/proba_excel.py 7/proba_grav.py 7/proba_grav_cont2.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 $R/$f > $O/predare_regres_$n.log 2>&1
  echo "$f: exit=$? ultima=$(tail -1 $O/predare_regres_$n.log | cut -c1-200)" >> $O/predare_rezumat.txt
done
timeout 3000 python -X utf8 $D/oracole/masoara.py --runda 12 --doar O3,O4,O5,O8,O9 --compara $O/masurare_pornire.json > $O/predare_masoara.log 2>&1
echo "masoara --doar O3,O4,O5,O8,O9: exit=$?" >> $O/predare_rezumat.txt
tail -25 $O/predare_masoara.log >> $O/predare_rezumat.txt
echo GATA >> $O/predare_rezumat.txt
