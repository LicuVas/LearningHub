#!/usr/bin/env bash
# Runda 14: proba rundei (inainte e3300ec9 / dupa worktree) + regresul din supliment. Pasul 7 NU se rulează aici.
# Probele PowerPoint 13 / 12 / 11 rulează din copii în %TEMP% (scriu lângă ele, nu peste ieșirile comise).
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
WT=C:/00/Projects/LearningHub_fidel
R=$D/runde
O=$R/14
git -C $WT status --short -- _campaign/aplicatii_fidele_2026_11/runde > $O/regres_status_inainte.txt
T=$(python -c "import tempfile;print(tempfile.mkdtemp(prefix='lh_r14_regres_'))")
mkdir -p $T/r13 $T/r12 $T/r11
cp $R/13/proba_grav.py $R/13/h.py $T/r13/; cp $R/12/proba_grav.py $R/12/h.py $T/r12/; cp $R/11/proba_powerpoint.py $T/r11/
: > $O/regres_rezumat.txt
timeout 2400 python -X utf8 $O/proba_grav.py ambele > $O/proba_grav.log 2>&1
echo "14/proba_grav.py ambele: exit=$? $(grep -E '^(INAINTE|DUPA) picate' $O/proba_grav.log | cut -c1-60 | tr '\n' ' ') ultima=$(tail -1 $O/proba_grav.log)" >> $O/regres_rezumat.txt
timeout 1800 python -X utf8 $T/r13/proba_grav.py > $O/regres_13_proba_grav.log 2>&1
echo "13/proba_grav.py (copie): exit=$? $(tail -2 $O/regres_13_proba_grav.log | tr '\n' ' ')" >> $O/regres_rezumat.txt
timeout 1200 python -X utf8 $T/r12/proba_grav.py > $O/regres_12_proba_grav.log 2>&1
echo "12/proba_grav.py (copie): exit=$? ultima=$(tail -1 $O/regres_12_proba_grav.log | cut -c1-200) picate: $(grep '^PICĂ' $O/regres_12_proba_grav.log | cut -c1-160 | tr '\n' ';')" >> $O/regres_rezumat.txt
timeout 900 python -X utf8 $T/r11/proba_powerpoint.py > $O/regres_11_proba_powerpoint.log 2>&1
echo "11/proba_powerpoint.py (copie): exit=$? ultima=$(tail -1 $O/regres_11_proba_powerpoint.log | cut -c1-200)" >> $O/regres_rezumat.txt
for f in 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py \
         10/proba_grav.py 9/proba_grav.py 8/proba_grav.py 7/proba_grav_cont.py 6/proba_excel.py 7/proba_grav.py 7/proba_grav_cont2.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 $R/$f > $O/regres_$n.log 2>&1
  echo "$f: exit=$? ultima=$(tail -1 $O/regres_$n.log | cut -c1-200)" >> $O/regres_rezumat.txt
done
rm -rf $T
git -C $WT status --short -- _campaign/aplicatii_fidele_2026_11/runde > $O/regres_status_dupa.txt
echo REGRES_GATA >> $O/regres_rezumat.txt
