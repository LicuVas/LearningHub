#!/bin/sh
# Rulează evalueaza.mjs pe seturile de reglaj (fără setul ascuns) cu un date.js dat; un rând pe set.
#   sh seturi.sh <date.js>
C=C:/00/Projects/LearningHub/cum-fac
for f in exemplele_profesorului set_feedback_profesor set_dezvoltare set_dezvoltare_2 set_dezvoltare_corecturi set_inginer_real set_r5 set_reglor_lung; do
  [ -f "$C/_teste/$f.json" ] || continue
  o=$(node $C/_teste/evalueaza.mjs $C/_teste/$f.json --date "$1" 2>&1)
  l1=$(echo "$o" | grep "^locul 1" | sed 's/ (prag.*//')
  af=$(echo "$o" | grep "^din afara" | sed 's/ (prag.*//; s/din afara materiei, „n-am găsit” corect/afară/')
  echo "$f | $l1 | $af | ratate $(echo "$o" | tail -1)"
done
