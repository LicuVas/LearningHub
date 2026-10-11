#!/bin/sh
# Măsoară motorul pe toate seturile de REGLAJ + exemplele profesorului + feedback-ul lui (fără setul ascuns).
# Rulare: sh toate_seturile.sh > fisier.txt
C=C:/00/Projects/LearningHub/cum-fac
for f in $C/_teste/exemplele_profesorului.json $C/_teste/set_feedback_profesor.json $C/_teste/set_dezvoltare.json $C/_teste/set_dezvoltare_2.json $C/_teste/set_inginer_real.json; do
  [ -f "$f" ] || continue
  echo "== $(basename $f)"
  node $C/_teste/evalueaza.mjs $f 2>&1 | grep -E "^(locul 1|din afara)"
done
