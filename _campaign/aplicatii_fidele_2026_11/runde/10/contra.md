# Runda 10 · B-excel · contra (pasul 4)

**Pentru plan.** Toate cele trei GRAV au acum un număr real în spate: locul graficului e o formulă potrivită la 0,1 pt pe 9
ferestre COM; rezumatul e luat din referința UIA; vărsarea din `com_r8.json`. Toate trei se pot juca numai din tastatură
(Alt, N, C, ↓, Enter; Shift+săgeți; formula, Enter, Enter = Yes), deci unghiul criticului 10 (gest_tastatura) le prinde.

**Împotriva planului.** Suplimentul cere explicit „H11 cu cel mult o celulă abatere” la 1366×768 și „în fereastra mică graficul
întreg”. Planul dă G5 și un grafic tăiat jos în fereastra mică. Un critic care citește doar `com_r9.json` va vedea „H11” și va
spune GRAV. În plus, pe telefon graficul nu mai e mărit ca grila (1,7×), deci acoperă mai puține celule decât pe calculator.

**Adevărul incomod.** Locul în fereastra VIZIBILĂ e dedus: COM nu poate deschide fereastra cu panglică invizibil, iar formula a
fost măsurată pe ferestre fără panglică. Dacă Excel vizibil calculează locul altfel (de exemplu față de toată fereastra, nu de
zona grilei), G5 e greșit și H11 ar putea fi mai aproape. Asta lămurește doar R10-1, pe PC-ul real.

**Hotărârea.** Merg pe formulă, fiindcă e singura legătură măsurată între fereastră și loc. „H11” și „graficul întreg în
fereastra mică” sunt contrazise de aceleași măsurători (`com_r10_b`: TopLeftCell se schimbă cu fereastra, G10…I12;
`com_r10_c`: top 0, mărimea nu scade). Le scriu ca D-A1-1 și D-A1-2 în `diferente.md`, cu citatul, și le spun în raport, ca
orchestratorul să le vadă înaintea criticului.
