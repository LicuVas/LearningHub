#!/usr/bin/env bash
# Runda 16 (Word): regresul Word după reparații. NU rulează masoara.py (pasul 7 = orchestratorul).
# - probele vechi ale lui Word (rundele 2-5 + telefonul) — la runda 14 toate dădeau 0 pe același word.js de dinainte;
# - O4 doar pe scenariile word-* (LH_IESIRE = runde/16/probe_iesiri, ca să nu scrie peste ieșirile comune);
# - O8 (static) cu LH_IESIRE.
# Fișier comun atins: niciunul → regresul Excel / PowerPoint nu e cerut (CICLU_PARALEL.md).
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
R=$D/runde
O=$R/16
export PYTHONDONTWRITEBYTECODE=1
: > $O/regres_rezumat.txt
for f in 5/proba_grav.py 4/proba_grav.py 4/proba_telefon.py 3/proba_grav.py 2/proba_grav.py; do
  n=$(echo $f | tr '/' '_')
  if [ "$f" = "4/proba_telefon.py" ]; then
    timeout 900 python -X utf8 -B $R/$f > $O/regres_$n.log 2>&1
  else
    timeout 900 python -X utf8 -B $R/$f --iesire $O/regres_$n.json > $O/regres_$n.log 2>&1
  fi
  echo "$f: ultima=$(tail -1 $O/regres_$n.log | cut -c1-200)" >> $O/regres_rezumat.txt
done
mkdir -p $O/probe_iesiri/O4w $O/probe_iesiri/O8
LH_IESIRE=$O/probe_iesiri/O4w timeout 1800 python -X utf8 -B $D/oracole/oracol_comportament.py --scenarii $D/scenarii/word > $O/probe_iesiri/O4w/iesire.log 2>&1
echo "O4 (doar word-*): ultima=$(tail -1 $O/probe_iesiri/O4w/iesire.log)" >> $O/regres_rezumat.txt
LH_IESIRE=$O/probe_iesiri/O8 timeout 600 python -X utf8 -B $D/oracole/oracol_comenzi_moarte.py > $O/probe_iesiri/O8/iesire.log 2>&1
echo "O8 (toate aplicațiile): ultima=$(tail -1 $O/probe_iesiri/O8/iesire.log)" >> $O/regres_rezumat.txt
echo REGRES_GATA >> $O/regres_rezumat.txt
