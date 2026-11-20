# Runda 17 (B-excel#2), starea constructorului — 20.11.2026

- Pasul zero: `proba_grav.py` pe codul de dinainte (copia `inainte/` servită dintr-un dosar temporar): 16 din 18 picate (`proba_grav_inainte.log`).
- O4 doar pe `scenarii/excel` la pornire: 44 (`probe_iesiri/o4_excel_pornire.log`); cele 11 scenarii ale acoperirii 14: 0 trec.
- X10: reparat în `excel.js` + `date/excel.json` regenerat (`genereaza_excel.py --verifica` = 0). Proba: X10.1-X10.10 ok.
- Vărsarea: `#SPILL!`, `=B2:B6`, `&`, comparațiile, Ctrl+săgeți, Ctrl+A. O4 Excel 44 → 12; 11/11 scenarii noi trec (`probe_iesiri/o4_excel_lucru1.log`).
- A1: tragerea cu degetul (touch-action + cutia actualizată pe loc). Proba A1.1, A1.2 ok.
- T1: getter `I.zonaTinta` în `excel.js`. Proba T1.1-T1.4 ok.
- Geometria listelor noi față de referință: `proba/geom.json` (colțul listei la +3 px, rândurile sub 8 px).
- Fișiere comune atinse: niciunul.
- Gata: regresul probelor vechi (aceleași rezultate ca la criticul 10), proba finală 0 din 18, raport_constructor.md + gata_pentru_critic.md scrise.
