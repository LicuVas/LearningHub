#!/bin/bash
# Porțile V/27 după corecturile de documentație O, P făcute de dirijor (02.11.2026). Doar comentarii / surse.md: codul simulatorului neschimbat.
L=/c/00/Projects/LearningHub/lectii/v/m4-l27
P=$L/_proba
R=/c/00/Projects/LearningHub
VL=$R/_campaign/revizuire_completa_2026_09/verificare_lectii
O=$P/t2d_lant.txt
echo "start $(date +%H:%M:%S)" > $O
timeout -k 15 1500 python $R/jocuri/_motor/test_joc.py --dir $R/lectii/v m4-l27 > $P/t2d_test_joc.txt 2>&1; echo "test_joc exit=$? $(grep -a -o '\[TRECUT\]\|\[PICAT\]' $P/t2d_test_joc.txt | head -1)" >> $O
timeout -k 15 900 python $VL/verifica_lectie.py $L/index.html --fara-t1 > $P/t2d_verifica.txt 2>&1; echo "verifica_lectie exit=$? ultima=$(tail -1 $P/t2d_verifica.txt)" >> $O
timeout -k 15 600 python C:/00/AI_0/tools/learninghub_date_personale.py > $P/t2d_date_personale.txt 2>&1; echo "date_personale exit=$? ultima=$(tail -1 $P/t2d_date_personale.txt)" >> $O
echo "gata $(date +%H:%M:%S)" >> $O
