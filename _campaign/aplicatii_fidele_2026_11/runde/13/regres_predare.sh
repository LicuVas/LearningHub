#!/usr/bin/env bash
# Runda 13, predarea: regresul din supliment + măsurarea parțială (O3,O4,O5,O8,O9). Pasul 7 complet NU se rulează aici.
# runde/12/proba_grav.py rulează dintr-o copie în %TEMP% (scrie lângă ea, nu peste ieșirile comise ale rundei 12).
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/13
T=$(python -c "import tempfile;print(tempfile.mkdtemp(prefix='lh_r13_r12copie_'))")
cp $R/12/proba_grav.py $R/12/h.py $T/
: > $O/regres_rezumat.txt
timeout 1200 python -X utf8 $T/proba_grav.py > $O/regres_12_proba_grav.log 2>&1
echo "12/proba_grav.py (copie în %TEMP%): exit=$? ultima=$(tail -1 $O/regres_12_proba_grav.log | cut -c1-200)" >> $O/regres_rezumat.txt
for f in 11/proba_powerpoint.py 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py \
         10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav_cont.py 6/proba_excel.py 7/proba_grav.py 7/proba_grav_cont2.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 $R/$f > $O/regres_$n.log 2>&1
  echo "$f: exit=$? ultima=$(tail -1 $O/regres_$n.log | cut -c1-200)" >> $O/regres_rezumat.txt
done
echo REGRES_GATA >> $O/regres_rezumat.txt
python -X utf8 $D/oracole/masoara.py --runda 13 --doar O3,O4,O5,O8,O9 --compara $O/masurare_pornire.json > $O/masurare_partiala.log 2>&1
echo "masurare partiala: exit=$? $(tail -3 $O/masurare_partiala.log | tr '\n' ' ' | cut -c1-400)" >> $O/regres_rezumat.txt
echo GATA >> $O/regres_rezumat.txt
