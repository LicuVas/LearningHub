#!/bin/sh
D=C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11
python $D/runde/10/proba_grav.py --iesire $D/runde/10/proba_grav_dupa.json > $D/runde/10/proba_grav_dupa.log 2>&1
sh $D/runde/10/regres.sh regres_c1
python $D/oracole/masoara.py --runda 10 --doar O4,O5,O9 --compara $D/runde/10/masurare_pornire.json > $D/runde/10/masurare_partial_c1.log 2>&1
cp $D/runde/10/masurare.json $D/runde/10/masurare_partial_c1.json
echo LOT_GATA >> $D/runde/10/masurare_partial_c1.log
