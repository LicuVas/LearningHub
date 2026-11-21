#!/usr/bin/env bash
# Runda 24 (Word): regresul după reparații. NU rulează masoara.py (pasul 7 = orchestratorul).
# Etalonul: runde/20/regres_rezumat.txt (16→0, 5→1, 4→0, telefon→0, 3→0, 2→0) și runde/20/proba_grav_dupa.log.
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/24
export PYTHONDONTWRITEBYTECODE=1
: > $O/regres_rezumat.txt
mkdir -p $O/probe_iesiri/O8
for f in 20/proba_grav.py 16/proba_grav.py 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py; do
  n=$(echo $f | tr '/' '_')
  if [ "$f" = "4/proba_telefon.py" ]; then
    timeout 900 python -X utf8 -B $R/$f > $O/probe_iesiri/regres_$n.log 2>&1
  else
    timeout 900 python -X utf8 -B $R/$f --iesire $O/probe_iesiri/regres_$n.json > $O/probe_iesiri/regres_$n.log 2>&1
  fi
  echo "$f: ultima=$(tail -1 $O/probe_iesiri/regres_$n.log | cut -c1-200)" >> $O/regres_rezumat.txt
done
LH_IESIRE=$O/probe_iesiri/O8 timeout 600 python -X utf8 -B $D/oracole/oracol_comenzi_moarte.py > $O/probe_iesiri/O8/iesire.log 2>&1
echo "O8 (toate aplicațiile): ultima=$(tail -1 $O/probe_iesiri/O8/iesire.log)" >> $O/regres_rezumat.txt
echo REGRES_GATA >> $O/regres_rezumat.txt
