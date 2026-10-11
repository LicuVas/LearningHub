#!/bin/sh
# O rundă de probă, fără să atingă cum-fac/: sensuri_audio.py pe o COPIE a dicționarului de dinainte, date.js de probă
# (fără / cu fișele audio de probă), comparația întrebare cu întrebare față de „înainte” și setul audio de probă.
#   sh ruleaza.sh [folder cu fise_*.json audio, implicit fise_proba]
A=C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/aplicatie_audio
F=${1:-$A/fise_proba}
cp $A/sensuri_inainte.json $A/sensuri_proba.json
python $A/sensuri_audio.py --cale $A/sensuri_proba.json > /dev/null || exit 1
node $A/fa_date.mjs $A/date_inainte.js $A/sensuri_proba.json $A/date_proba_fara_audio.js > /dev/null
node $A/fa_date.mjs $A/date_inainte.js $A/sensuri_proba.json $A/date_proba_cu_audio.js $F/fise_*.json > /dev/null
node $A/detaliu.mjs $A/date_proba_fara_audio.js $A/det_nou_fara_audio.json > /dev/null
node $A/detaliu.mjs $A/date_proba_cu_audio.js $A/det_nou_cu_audio.json > /dev/null
echo "== fără fișe audio: schimbări de stare"; node $A/detaliu.mjs --compara $A/det_inainte.json $A/det_nou_fara_audio.json | grep -A2 "^[↓↑]"
echo "== cu fișele audio din $F: schimbări de stare"; node $A/detaliu.mjs --compara $A/det_inainte.json $A/det_nou_cu_audio.json | grep -A2 "^[↓↑]"
echo "== seturi (cu fișele audio)"; sh $A/seturi.sh $A/date_proba_cu_audio.js
