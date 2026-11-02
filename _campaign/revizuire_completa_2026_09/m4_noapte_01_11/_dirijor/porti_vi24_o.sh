#!/bin/bash
# Porțile VI/24 după reparația O făcută de dirijor (02.11.2026). Fiecare pas cu limită de timp; ieșirile în _proba/o_*.txt.
L=/c/00/Projects/LearningHub/lectii/vi/m4-l24
P=$L/_proba
R=/c/00/Projects/LearningHub
V=$R/_campaign/revizuire_completa_2026_09/verificare_lectii
echo "start $(date +%H:%M:%S)" > $P/o_lant.txt
timeout 300 node $P/test_nucleu.js > $P/o_test_nucleu.txt 2>&1; echo "test_nucleu exit=$? ultima=$(tail -1 $P/o_test_nucleu.txt)" >> $P/o_lant.txt
timeout 900 node $P/proba_mutanti.js > $P/o_mutanti.txt 2>&1; echo "proba_mutanti exit=$? ultima=$(tail -1 $P/o_mutanti.txt)" >> $P/o_lant.txt
timeout 1500 python $P/j2_gesturi_copie.py nou > $P/o_j2_gesturi_run.txt 2>&1; echo "j2_gesturi_copie exit=$? ultima=$(tail -1 $P/o_j2_gesturi_run.txt)" >> $P/o_lant.txt
timeout 1800 python $P/proba_reparatii.py > $P/o_proba_reparatii.txt 2>&1; echo "proba_reparatii exit=$? ultima=$(tail -1 $P/o_proba_reparatii.txt)" >> $P/o_lant.txt
timeout 1800 python $P/parcurge.py > $P/o_parcurge.txt 2>&1; echo "parcurge exit=$? ultima=$(tail -1 $P/o_parcurge.txt)" >> $P/o_lant.txt
timeout 1500 python $R/jocuri/_motor/test_joc.py --dir $R/lectii/vi m4-l24 > $P/o_test_joc.txt 2>&1; echo "test_joc exit=$? ultima=$(tail -1 $P/o_test_joc.txt | cut -c1-80)" >> $P/o_lant.txt
timeout 900 python $V/verifica_lectie.py $L/index.html --fara-t1 > $P/o_verifica.txt 2>&1; echo "verifica_lectie exit=$? ultima=$(tail -1 $P/o_verifica.txt)" >> $P/o_lant.txt
timeout 600 python C:/00/AI_0/tools/learninghub_date_personale.py > $P/o_date_personale.txt 2>&1; echo "date_personale exit=$? ultima=$(tail -1 $P/o_date_personale.txt)" >> $P/o_lant.txt
echo "gata $(date +%H:%M:%S)" >> $P/o_lant.txt
