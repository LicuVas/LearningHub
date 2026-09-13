# Plan reparatie — cls8 / m1-excel-fundamente / lectia7-sortare (13.09.2026)

Surse: F_evaluari/cls8/lectia7-sortare/05_evaluare.md + log.json (10 findings), 04_mediu.md.
Q_verdict_blocante.json: nicio intrare pentru cls8-l7. P_hibrid / O_orb: nu exista pentru lectie. M: toate intrebarile "propriu" (nicio mutare). K: Ex.2/Ex.3 "suspect" = fals-pozitiv (confirmat de evaluare si recitit).

| id | semnalare | decizie | cum |
|:--|:--|:--|:--|
| cls8-l7-01 | tabelul-model atom 4 cu randuri rupte | **aplic** | reconstruit cu construieste.py -> model_sortare.xlsx, recalculat LibreOffice (H_randeaza) -> Elena 9, Maria 8, Carla 7 (8A), Dan 10, Andrei 6, Bogdan 5 (8B); plus fraza "trebuie sa obtii exact acest tabel" cu datele sursa |
| nou-01 | BONUS Incearca: C2:C7 scrise dupa sortarea Z-A de la pasul 3 -> clasele se lipesc de alti elevi (Dan 8A, Elena 8B...) si modelul nu se mai potriveste | **aplic** | simulat in construieste.py (bonus_fara_undo vs bonus_cu_undo); adaug "inchide dialogul, Ctrl+Z de doua ori" |
| cls8-l7-02 | Ex.2 "A1 = Nr" scrie peste nume | **aplic** | pas de inserare coloana: clic dreapta pe A -> Inserare (Insert); verificat cu openpyxl insert_cols (ex2_cu_inserare.txt: B2=Maria, antet Nr/Elev/Nota/Clasa, sortare identica cu rezolvarea) |
| cls8-l7-03 | criteriul (4) Ex.3 contrazis de Microsoft (Undo dupa salvare) | **aplic** | enunt "a salvat si a inchis", schita + criteriul (4) corectate; sursa surse/undo_en.txt "You can undo changes, even after you have saved" |
| nou-02 | atom 5, randul Ctrl+Z: "Functioneaza doar daca nu ai facut alte modificari dupa sortare" — contrazis de Microsoft (100 de actiuni) si de Ex.1 (Ctrl+Z de doua ori) | **aplic** | aceeasi sursa undo_en.txt |
| cls8-l7-04 | capcana doar povestita | **aplic partial** | adaug in caseta de avertizare faptul verificat (suma ramane 45, 6/6 elevi cu nota altcuiva -> verifica un rand cunoscut). **Sar** pasul practic nou: lectia deja nu incape in ora (cls8-l7-07) — decizie de structura la profesor |
| cls8-l7-05 | comenzi doar in engleza | **aplic** | din GLOSAR_UI CONFIRMAT: Date (Data), Sortare și filtrare / Sortare & filtrare (Sort & Filter), Sortare (Sort), Adăugare nivel (Add Level), De la cel mai mare la cel mai mic (Largest to Smallest), Extindeți selecția (Expand the selection), Continuați cu selecția curentă, Datele mele au anteturi, Pornire (Home), Inserare (Insert), Formule, Aspect pagină, Anulare (Undo). Necuprinse in glosar (Sort by, Then by, Order, A to Z, Editing, Custom List): raman in engleza cu nota |
| cls8-l7-06 | nume cu diacritice / ordine regionala | **sar** | schimba datele tabelului in toata lectia (toate rezolvarile) si depinde de un necunoscut (setarea regionala din laborator; Excel nepornit) — decizie la profesor |
| cls8-l7-07 | nu incape in 50 min | **sar** | comasare exercitii / tema = decizie de structura |
| cls8-l7-08 | lipsa diacritice | **sar** | val separat de diacritice (conventia 5) |
| cls8-l7-09 | navigarea "Proiect final" vs planul anului | **sar** | ordinea lectiilor/renumerotarea = decizie de structura; atinge si alte fisiere |
| cls8-l7-10 | "Antetul ramane mereu pe primul rand" | **aplic** | "de obicei" + Ctrl+Z si bifa Datele mele au anteturi (My data has headers); sursa surse/sort_en.txt "By default ... Occasionally, you may need to turn the heading on or off" |
| salvare (conv. 3) | — | nu se aplica | nicio sarcina a lectiei nu cere salvarea unui fisier |
| separator (conv. 2) | — | nu se aplica | lectia nu are formule cu mai multe argumente (04_mediu.md) |
