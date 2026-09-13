# Plan reparatie — cls8 / lectia1-interfata (13.09.2026)

Surse citite: S_CONVENTII.md, GLOSAR_UI.md (Excel + Office), F_evaluari/cls8/lectia1-interfata/05_evaluare.md, log.json (9 findings), 04_mediu.md,
Q_verdict_blocante.json (cls8-l1-01 -> gravitate corectata „important”, verdict adevarat), M_rezultat.csv (randurile lectiei), K_rezultat.csv (3 exercitii „suspect” — confirmat pe lectie, nu alarma falsa).
P_hibrid / O_orb nu au folder pentru aceasta lectie.

| id | semnalare | decizie | cum |
|:--|:--|:--|:--|
| cls8-l1-01 | cele 3 „Vezi rezolvarea” sunt ale altor exercitii | **aplic** (prioritar) | rezolvari rescrise din cerinte; construite in `xlsx/` cu openpyxl (`construieste.py`), recalculate cu `H_randeaza.py xlsx`; Ex1 = catalog A1:C4, foaia Catalog, B2/C4, Ctrl+End C4; Ex2 = M25, 50 celule, foile Navigare+Test, Ctrl+End M25 / A3; Ex3 = raspunsuri-model la cele 4 intrebari (exemplul AVERAGE -> 8,67 si AB12 = coloana 28 recalculate) |
| cls8-l1-01b | Ex1 afiseaza „Raspuns asteptat” chiar in cerinta | **aplic** | mutat in rezolvare; in cerinta ramane indemnul de verificare |
| cls8-l1-02 | 5/9 intrebari intreaba materie de la alt atom (M: atomii 1, 3, 4, 5, 6) | **aplic** | C7 -> atomul 3; B2:D6 (15 celule) -> atomul 4; Z100 in Caseta Nume -> atomul 6; stergerea foii -> atomul 9 (a doua intrebare); intrebari noi la atomul 1 (ce fel de program) si 5 (pe ce fila e sortarea); intrebarea E2/AVERAGE de la atomul 6 dublura a celei de la atomul 7 -> scoasa |
| cls8-l1-03 | lectia nu incape in 50 min / contine 3 ore din planificare | **sar** | decizie de structura (spargerea lectiei, ora din plan) — ramane la profesor |
| cls8-l1-04 | nume de meniu doar in engleza | **aplic** | forma „Romana (English)” din glosarul CONFIRMAT: Pornire, Inserare, Formule, Date, Caseta Nume, bara de formule, Redenumire, Ștergere, Foaie nouă; Foaie1 din `surse/redenumire_ro.txt`; Move or Copy nu e in glosar -> engleza + nota; fraza LibreOffice -> sar (laborator necunoscut, nu am sursa pe numele din Calc) |
| cls8-l1-05 | fara diacritice | **sar** | val separat, cu poarta proprie (conventia 5) |
| cls8-l1-06 | butonul „Copiaza” copiaza text cu etichete, nu tabel | **aplic** | blocul devine tabelul insusi, cu Tab intre coloane; lipirea modelata in `xlsx/lipire_bloc_nou.xlsx` (A1:D6, COUNT=15) |
| cls8-l1-07 | catalogul nu se salveaza nicaieri | **aplic** partial | pas de salvare cu nume + loc (conventia 3) la Incearca, Ex1, Ex2; alternativa fara cont (LibreOffice / caiet) -> sar: depinde de laborator, decizie a profesorului |
| cls8-l1-08 | nicio imagine a ferestrei, varianta pe hartie | **sar** | imagini / fisa A4 = decizie de structura (conventia 5) |
| cls8-l1-09 | Ex2: „+” da Foaie2 nu Test; Ctrl+End cu doua raspunsuri | **aplic** | pas explicit de redenumire; verificarea spune pe ce foaie apesi Ctrl+End |
| nou-date | Ex2 cere numele a 3 colegi | **aplic** | nume inventate (conventia 4) |
| nou-zecimale | 8.25 / 9.25 fara varianta cu virgula | **aplic** | o singura nota „(sau 8.25, dupa calculator)” la atomul 7 (conventia 2); intrebarile raman neatinse |
| nou-undo | „nu poti da Undo” la stergerea foii | **sar** (neverificat) | nu apare in paginile Microsoft descarcate (nici foi_en/ro, nici pagina Anulare); nu il infirm si nu il schimb — semnalat ca NESIGUR |
