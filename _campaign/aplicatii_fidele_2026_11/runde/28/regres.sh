#!/usr/bin/env bash
# Runda 28 (Word): regresul după reparații. NU rulează masoara.py (pasul 7 = orchestratorul).
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/28
export PYTHONDONTWRITEBYTECODE=1
: > $O/regres_rezumat.txt
timeout 900 python -X utf8 -B $O/proba_grav.py --iesire $O/proba_grav.json > $O/proba_grav_dupa.log 2>&1
echo "28/proba_grav.py: ultima=$(tail -1 $O/proba_grav_dupa.log)" >> $O/regres_rezumat.txt
for f in 24/proba_grav.py 20/proba_grav.py 16/proba_grav.py; do
  n=$(echo $f | tr '/' '_')
  timeout 900 python -X utf8 -B $R/$f --iesire $O/probe_iesiri/regres_$n.json > $O/probe_iesiri/regres_$n.log 2>&1
  echo "$f: ultima=$(tail -1 $O/probe_iesiri/regres_$n.log | cut -c1-200)" >> $O/regres_rezumat.txt
done
echo REGRES_GATA >> $O/regres_rezumat.txt
