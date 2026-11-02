#!/bin/bash
# Porțile VI/23 după reparația T făcută de dirijor (02.11.2026). Ieșirile în _proba/t_dirijor/.
L=/c/00/Projects/LearningHub/lectii/vi/m4-l23
P=$L/_proba
D=$P/t_dirijor
R=/c/00/Projects/LearningHub
V=$R/_campaign/revizuire_completa_2026_09/verificare_lectii
echo "start $(date +%H:%M:%S)" > $D/lant.txt
grep -a -c "Corect" $D/j3_T_out.txt | sed 's/^/j3_T Corect: /' >> $D/lant.txt
timeout 2400 python $P/proba_reparatii.py t2_3 > $D/proba_reparatii.txt 2>&1; echo "proba_reparatii exit=$? ultima=$(tail -1 $D/proba_reparatii.txt)" >> $D/lant.txt
timeout 1800 python $P/parcurge.py > $D/parcurge.txt 2>&1; echo "parcurge exit=$? ultima=$(tail -1 $D/parcurge.txt)" >> $D/lant.txt
timeout 1500 python $R/jocuri/_motor/test_joc.py --dir $R/lectii/vi m4-l23 > $D/test_joc.txt 2>&1; echo "test_joc exit=$? $(grep -a -o '\[TRECUT\]\|\[PICAT\]' $D/test_joc.txt | head -1)" >> $D/lant.txt
timeout 900 python $V/verifica_lectie.py $L/index.html --fara-t1 > $D/verifica.txt 2>&1; echo "verifica_lectie exit=$? ultima=$(tail -1 $D/verifica.txt)" >> $D/lant.txt
timeout 600 python C:/00/AI_0/tools/learninghub_date_personale.py > $D/date_personale.txt 2>&1; echo "date_personale exit=$? ultima=$(tail -1 $D/date_personale.txt)" >> $D/lant.txt
echo "nu e in catalog: $(python C:/00/AI_0/tools/activitate.py lista 2>/dev/null | grep -c 'nu e în catalog')" >> $D/lant.txt
echo "gata $(date +%H:%M:%S)" >> $D/lant.txt
