#!/bin/bash
# Porțile V/26 după reparațiile U, V, W făcute de dirijor (02.11.2026). Copiile probelor J2 în _proba/ (aceeași adâncime ca _verificare).
L=/c/00/Projects/LearningHub/lectii/v/m4-l26
P=$L/_proba
V=$L/_verificare
R=/c/00/Projects/LearningHub
VL=$R/_campaign/revizuire_completa_2026_09/verificare_lectii
O=$P/t2d_lant.txt
cp $V/j2_server.py $V/j2_drumuri.py $V/j2_ghicitor.py $P/
echo "start $(date +%H:%M:%S)" > $O
timeout 900 python $P/j2_ghicitor.py > $P/t2d_ghicitor_run.txt 2>&1; echo "j2_ghicitor exit=$? ultima=$(tail -1 $P/j2_ghicitor_out.txt)" >> $O
timeout 1800 python $P/j2_drumuri.py > $P/t2d_drumuri_run.txt 2>&1; echo "j2_drumuri exit=$? ultima=$(tail -1 $P/j2_drumuri_out.txt)" >> $O
grep -a "30 minus 6" $P/j2_drumuri_out.txt | head -4 >> $O
timeout 2400 python $P/proba_reparatii.py 3 > $P/t2d_proba_reparatii.txt 2>&1; echo "proba_reparatii exit=$? ultima=$(tail -1 $P/t2d_proba_reparatii.txt)" >> $O
timeout 1800 python $P/parcurge.py t2d > $P/t2d_parcurge.txt 2>&1; echo "parcurge exit=$? ultima=$(tail -1 $P/t2d_parcurge.txt)" >> $O
timeout 1500 python $R/jocuri/_motor/test_joc.py --dir $R/lectii/v m4-l26 > $P/t2d_test_joc.txt 2>&1; echo "test_joc exit=$? $(grep -a -o '\[TRECUT\]\|\[PICAT\]' $P/t2d_test_joc.txt | head -1)" >> $O
timeout 900 python $VL/verifica_lectie.py $L/index.html --fara-t1 > $P/t2d_verifica.txt 2>&1; echo "verifica_lectie exit=$? ultima=$(tail -1 $P/t2d_verifica.txt)" >> $O
timeout 600 python C:/00/AI_0/tools/learninghub_date_personale.py > $P/t2d_date_personale.txt 2>&1; echo "date_personale exit=$? ultima=$(tail -1 $P/t2d_date_personale.txt)" >> $O
echo "nu e in catalog: $(python C:/00/AI_0/tools/activitate.py lista 2>/dev/null | grep -c 'nu e în catalog')" >> $O
echo "gata $(date +%H:%M:%S)" >> $O
