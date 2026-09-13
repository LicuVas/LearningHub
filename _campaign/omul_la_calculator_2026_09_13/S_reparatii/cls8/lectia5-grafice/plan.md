# Plan reparatie — cls8 / lectia5-grafice (13.09.2026)

Surse citite: S_CONVENTII.md, GLOSAR_UI.md (Excel CONFIRMAT + VARIANTE), F_evaluari/cls8/lectia5-grafice/05_evaluare.md, log.json (9 findings), 04_mediu.md, surse/gss_charts.txt, surse/create_ro.txt, u5_bare_anatomie.txt, M_rezultat.csv (9 randuri), K_rezultat.csv (3 randuri, toate „ok”). Q_verdict_blocante.json: 0 intrari pe lectie. P_hibrid / O_orb: nu exista pentru lectie.

| Semnalare | Decizie | Cum |
|:--|:--|:--|
| cls8-l5-01 Pie pe mediile pe materii in Incearca | **aplic** | pasul 5: Pie → Bar (barele culcate); pasul 6 inchide explorarea: de ce nu Pie (mediile nu sunt parti dintr-un intreg). Recalculat: Pie pe medii ar da 17,5–22,6 % (s_cifre.json); Column/Bar/Line construite si randate (randat_xlsx/s_incearca_nou.pdf). |
| cls8-l5-02 schema „Anatomia” cu bare de 0 px | **aplic** | stil local in pagina (atributele `style` ale barelor): inaltimi in px pe axa 0-10 (nota × 9 px), toate 5 materiile (adaugat Istorie 7,5), o singura culoare = o singura serie (legenda „Nota medie”). CSS-ul comun neatins. Masurat in Chromium: 65/61/73/68/57 px (s_bare_dupa.txt). |
| cls8-l5-03 note cu punct (7.2) | **aplic** | conventia 2: blocurile de copiat cu virgula + o singura nota „(sau 7.2, dupa calculator)” cu simptomele; eticheta din schema si rezolvarea Ex. 1 cu virgula + mentiunea punctului. |
| cls8-l5-04 traduceri inventate | **aplic** | „tab-ul Insert (Inserare) → Charts (Grafice)” → „fila Inserare/Inserați (Insert) → grupul Charts (nota)”; Chart Design / Add Chart Element / Chart Title din glosarul CONFIRMAT; „Circular/Coloana/Bara orizontala/Linie” (VARIANTE = improvizate) scoase, tipurile raman in engleza cu descriere + nota despre pictograme; „diagrama” explicat o data (atom 1). „Selectare date” nu e in glosar → engleza + nota. |
| cls8-l5-05 axa de la 0 si 3D | **aplic** | atom 6: caseta „axa Y porneste de la 0” cu cifrele lectiei (axa de la 6 → raport bare 7,0; diferenta reala 22,2 %) + citatul GSS; atom 8: 3D „exista, dar evita-l” + citatul GSS. |
| cls8-l5-06 timpul (~72 min) | **sar** | decizie de structura (ce ramane in ora 11 / acasa / ora 12) — la profesor. |
| cls8-l5-07 fara diacritice | **sar** | val separat de diacritice (conventia 5). |
| cls8-l5-08 Provocarea „5 elevi” vs 3 | **aplic** | „pentru cei 3 elevi: Ana, Mihai, Maria”; si indiciul intrebarii din atomul 4 („pentru 5 elevi” → 3). |
| cls8-l5-09 litera dubla la variante (A + „c)”) | **sar** | prefixele „a)/b)” stau in toate cele 9 chestionare si in toate lectiile; remediul propus e in motor (scoaterea prefixului la amestecare) — nu ating motorul JS; decizie comuna pe site. |
| M rand idx 1 „decalat_inainte” (Line pe 12 luni, pusa la atomul 1) | **aplic** | intrebarea mutata la atomul 2 (care preda Line), fara „(Linie)/(Circular)/(Coloana)”; atomul 1 primeste o intrebare pe continutul lui (avantajul graficului fata de tabel). |
| M randuri 3,5,7,9 „altul” | **nu aplic (alarma falsa)** | fiecare se poate raspunde din textul de dinainte: atom 3 ← Incearca pasul 2 (selectezi intai datele); atom 5 ← atom 2 (Pie max 5-6 felii); atom 7 ← atom 5 (titlurile dau legenda); atom 9 ← propriul text. |
| K randuri 1-3 | **nimic de facut** | verdict „ok” la toate. |
| Salvare (conventia 3) | **aplic** | Incearca pasul 7 si Ex. 1 punctul 5: nume + loc. |
| Izvoare fara laborator: imagine cu cele 3 grafice | **sar** | adaugare de imagini = decizie de structura. |
