#!/usr/bin/env bash
# Runda 13, constructorul 2: proba rundei (worktree + pornirea 7ab108fe) + regresul din supliment. Pasul 7 NU se rulează aici.
# runde/12/proba_grav.py rulează dintr-o copie în %TEMP% (scrie lângă ea, nu peste ieșirile comise ale rundei 12).
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/13
T=$(python -c "import tempfile;print(tempfile.mkdtemp(prefix='lh_r13c2_r12copie_'))")
cp $R/12/proba_grav.py $R/12/h.py $T/
: > $O/regres_rezumat_c2.txt
timeout 1800 python -X utf8 $O/proba_grav.py > $O/proba_c2_dupa.log 2>&1
echo "13/proba_grav.py (worktree): exit=$? $(tail -2 $O/proba_c2_dupa.log | tr '\n' ' ')" >> $O/regres_rezumat_c2.txt
timeout 1800 python -X utf8 $O/proba_grav.py --inainte > $O/proba_c2_inainte.log 2>&1
echo "13/proba_grav.py --inainte (7ab108fe): exit=$? $(tail -2 $O/proba_c2_inainte.log | tr '\n' ' ')" >> $O/regres_rezumat_c2.txt
timeout 1200 python -X utf8 $T/proba_grav.py > $O/regres_c2_12_proba_grav.log 2>&1
echo "12/proba_grav.py (copie în %TEMP%): exit=$? ultima=$(tail -1 $O/regres_c2_12_proba_grav.log | cut -c1-200) picate: $(grep '^PICĂ' $O/regres_c2_12_proba_grav.log | cut -c1-120 | tr '\n' ';')" >> $O/regres_rezumat_c2.txt
for f in 11/proba_powerpoint.py 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py \
         10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav_cont.py 6/proba_excel.py 7/proba_grav.py 7/proba_grav_cont2.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 $R/$f > $O/regres_c2_$n.log 2>&1
  echo "$f: exit=$? ultima=$(tail -1 $O/regres_c2_$n.log | cut -c1-200)" >> $O/regres_rezumat_c2.txt
done
echo REGRES_GATA >> $O/regres_rezumat_c2.txt
