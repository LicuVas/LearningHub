# Inventarul de paritate — Excel, partea B (excel-b), 21.11.2026
Sortare, grafice, decizia IF și erorile formulei, proiectul (lanțul), proba cu punctaj, motorul Excel al jocurilor (tip-excel.js), lecția 4 (copiere / ștergere) și jocurile de formatare.
**135 funcții: DA 71, PARȚIAL 26, NU 38.** Din cele NU, 7 sunt stratul de exercițiu (teste, punctaj, variante), care ține de lecție, nu de aplicație. Funcțiile de bază din tip-excel.js sunt marcate „dublura posibila cu excel-a”.
Proba în poligon (headless, doar 127.0.0.1): `probe_excel-b/proba_b.py`, rezultatul în `probe_excel-b/proba_b.json`.

## NU (fără stratul de exercițiu) — întâi cele cerute de exerciții
- **excel-b-F005** (Sortare) Sortarea mută formulele cu rândul lor, cu adresele potrivite rândului nou (=B2*C2 dus pe rândul 4 devine =B4*C4). — cerută: lectii/viii/m2-l12:376-380 (proiect: D2:D6 =B*C, apoi sortat descrescător după D, cu A,B,C legate)
- **excel-b-F043** (Grafice) Etichetele de date pe graficul cu bare și pe cel radial. — cerută: lectii/viii/m2-l13:336 (pie cu etichete:true)
- **excel-b-F116** (Copiere, mutare, ștergere (lecția 4)) Pictograma Ștergere (Delete) din grupul Celule scoate imediat: rânduri / coloane întregi sau celulele (în sus / la stânga după forma zonei). — cerută: lectii/viii/m1-l04:617, :639 (scoate tot rândul)
- **excel-b-F117** (Copiere, mutare, ștergere (lecția 4)) Lista Delete ▾: Ștergere celule…, Ștergere rânduri foaie, Ștergere coloane foaie. — cerută: lectii/viii/m1-l04:591 (scoate coloana Absențe)
- **excel-b-F118** (Copiere, mutare, ștergere (lecția 4)) Fereastra Ștergere (Delete): Deplasare celule la stânga / în sus, Rând întreg, Coloană întreagă. — cerută: lectii/viii/m1-l04:594 (Shift cells up, OK)
- **excel-b-F013** (Sortare) Mută nivelul ales mai sus / mai jos (▲ Move Up / ▼ Move Down).
- **excel-b-F017** (Sortare) Mesajul de eroare la aceeași coloană pe două niveluri („… is being sorted by values more than once”).
- **excel-b-F020** (Sortare) Pornire (Home) › Editare › Sortare și filtrare (Sort & Filter): meniul cu Sort A to Z, Sort Z to A, Custom Sort….
- **excel-b-F038** (Grafice) Al doilea clic pe titlu pune cursorul în text: ce scrii se adaugă acolo, Enter face rând nou, Esc lasă textul.
- **excel-b-F039** (Grafice) Dublu-clic pe titlu deschide panoul Format Chart Title (✕ îl închide, titlul rămâne ales).
- **excel-b-F041** (Grafice) Add Chart Element › Chart Title: None / Above Chart / Centered Overlay.
- **excel-b-F044** (Grafice) Add Chart Element › Legend: None / Right / Top / Left / Bottom.
- **excel-b-F045** (Grafice) Butonul + de lângă grafic (Chart Elements) cu bifele Titlu, Etichete de date, Legendă.
- **excel-b-F046** (Grafice) Clicul alege o parte a graficului (seria, legenda, axa, etichetele, zona de desen) și Delete șterge doar partea aleasă.
- **excel-b-F063** (Decizie (IF) și erorile formulei) Ghilimelele întoarse “ ” (puse de telefon): Excel primește formula și arată #NAME?.
- **excel-b-F064** (Decizie (IF) și erorile formulei) Semnele de la matematică ≥ ≤ ≠: Excel primește formula și arată #NAME?.
- **excel-b-F074** (Decizie (IF) și erorile formulei) Paranteza uitată la sfârșit se pune singură la Enter.
- **excel-b-F076** (Decizie (IF) și erorile formulei) Pe ecranele cu atingere, butoane pentru semnele formulei " ; < > = (puse în bara fx).
- **excel-b-F086** (Foaia de bază (motorul jocurilor)) Bula de sub bara fx arată părțile funcției (number1; [number2]…), cu partea curentă îngroșată.
- **excel-b-F091** (Foaia de bază (motorul jocurilor)) Ctrl+Enter scrie același lucru în toată zona selectată.
- **excel-b-F096** (Foaia de bază (motorul jocurilor)) Butoanele „Setările calculatorului”: RO (; și 12,5) / EN (, și 12.5), formulele scrise își schimbă separatorul.
- **excel-b-F097** (Foaia de bază (motorul jocurilor)) „📋 Copiază tabelul”: toată foaia în clipboard (text + tabel, formulele cu ;), ca s-o lipești în Excel sau Google Sheets.
- **excel-b-F100** (Foaia de bază (motorul jocurilor)) Procentul scris (50%) devine 0,5.
- **excel-b-F105** (Formatare) Culoarea textului (roșu, albastru, verde, Automat).
- **excel-b-F110** (Formatare) Mai multe / mai puține zecimale (Increase / Decrease Decimal).
- **excel-b-F111** (Formatare) „Fără formatare”: scoate umplerea, centrarea și bordurile din selecție.
- **excel-b-F121** (Copiere, mutare, ștergere (lecția 4)) Enter după copiere lipește și oprește copierea.
- **excel-b-F122** (Copiere, mutare, ștergere (lecția 4)) Golirea (Delete) și ștergerea de rânduri opresc copierea (dispare chenarul punctat).
- **excel-b-F124** (Copiere, mutare, ștergere (lecția 4)) Ctrl+- șterge (rândurile / coloanele selectate sau fereastra Ștergere).
- **excel-b-F125** (Copiere, mutare, ștergere (lecția 4)) Shift+Spațiu selectează rândul, Ctrl+Spațiu coloana.
- **excel-b-F126** (Copiere, mutare, ștergere (lecția 4)) Tasta Meniu / Shift+F10 deschide meniul de clic dreapta.

## PARȚIAL — întâi cele cerute de exerciții
- **excel-b-F007** (Sortare) Rândul de antet e ghicit ca în Excel: text peste număr, MAJUSCULE peste text obișnuit, sau scris altfel (aldin, cursiv, subliniat, umplere, culoare) decât rândul de dedesubt; o listă numai de texte nu are antet. Lipsește: regula MAJUSCULE peste text; diferența de cursiv / subliniat / umplere / culoare; aldinul în alte coloane decât prima; vechiul cere numărul chiar pe rândul 2 — cerută: lectii/viii/m2-l10:218 și :230 (teste antet:true)
- **excel-b-F028** (Grafice) Inserează un grafic radial (Pie) din Inserare › Insert Pie or Doughnut Chart. Lipsește: butonul Pie din fila Inserare (graficul nou radial); merge doar inserând alt tip și schimbându-l — cerută: lectii/viii/m2-l13:336 (tip pie, titlu, etichete)
- **excel-b-F032** (Grafice) Titlul și legenda puse singure: o serie cu nume → titlul = numele, fără legendă; mai multe serii → „Chart Title” + legenda jos; radialul → legenda cu categoriile. Lipsește: o singură serie FĂRĂ nume: vechiul pune legenda jos, biblioteca nu pune legendă — cerută: lectii/viii/m2-l11:231 (legenda:true cu două serii)
- **excel-b-F077** (Proiect (lanțul)) Lanțul pe aceeași foaie: formule → sortare → grafic; foaia, formatarea și graficul rămân de la un pas la altul. Lipsește: sortarea tabelului cu coloana de formule strică formulele (vezi funcția de sortare a formulelor), deci testul „sortat” al proiectului cade — cerută: lectii/viii/m2-l12:370 și :388 (t:'proiect', testele formule, sortat legat, grafic)
- **excel-b-F085** (Foaia de bază (motorul jocurilor)) Lista funcțiilor apare când scrii =SU…, cu descrierea; ↑↓ alegi, Tab completează „SUM(”. Lipsește: lista vizibilă cu descrieri și alegerea cu ↑↓ — cerută: jocuri/excel-viii (gest:['autocompletare'])
- **excel-b-F104** (Formatare) Culoarea de umplere a celulelor (galben, verde, albastru, portocaliu, Fără umplere). Lipsește: alte culori și „Fără umplere” (No Fill) — cerută: jocuri/excel-viii:430 (umplere pe A1:C1)
- **excel-b-F112** (Copiere, mutare, ștergere (lecția 4)) Clic dreapta pe celulă: Decupare, Copiere, Lipire, Ștergere…, Golire conținut (clic dreapta în zonă păstrează zona). Lipsește: ștergerea din fereastra Delete… — cerută: lectii/viii/m1-l04:531 (doarMouse: copiere din meniu)
- **excel-b-F113** (Copiere, mutare, ștergere (lecția 4)) Clic dreapta pe numărul rândului / litera coloanei: Decupare, Copiere, Lipire, Ștergere (rândul / coloana), Golire conținut. Lipsește: Ștergere (Delete) pe rânduri / coloane — cerută: lectii/viii/m1-l04:587 (clic dreapta pe numărul rândului › Ștergere)
- **excel-b-F008** (Sortare) Fereastra Sort Warning: la o singură coloană selectată, cu date alături, alegi Expand the selection (ales de la început) sau Continue with the current selection, apoi Sort / Cancel; Continue sortează doar selecția (rândurile se desperechează). Lipsește: biblioteca întreabă și când sunt selectate 2 coloane din 3 (Excel sortează atunci fără întrebare, probat în vechi): probe_excel-b/proba_b.json › doua_coloane_dialog = Sort Warning
- **excel-b-F015** (Sortare) Numele ordinii după tipul coloanei: A to Z / Smallest to Largest / Oldest to Newest (și invers). Lipsește: Oldest to Newest / Newest to Oldest pentru coloanele cu date calendaristice
- **excel-b-F021** (Sortare) Sortare dintr-o celulă goală fără date în jur: mesajul Excel „This can't be applied to the selected range…”. Lipsește: mesajul Excel; biblioteca spune că funcția nu e simulată
- **excel-b-F022** (Sortare) Butonul de sortare apăsat în timp ce scrii într-o celulă: vechiul cere întâi Enter, biblioteca confirmă scrierea și sortează. Lipsește: comportament diferit; niciunul nu e probat în Excel
- **excel-b-F036** (Grafice) La schimbarea tipului rămân titlul, legenda și etichetele; etichetele trec pe locul implicit al noului tip (coloane → linie: Right). Lipsește: locul implicit al noului tip (Right la linie, Outside End la coloane)
- **excel-b-F053** (Grafice) Axa cu numere ca în Excel (valori apropiate nu pornesc de la 0: 120…140 → 110…145; la bare cel mult 7 intervale). Lipsește: regula valorilor apropiate și cele 7 intervale la bare
- **excel-b-F062** (Decizie (IF) și erorile formulei) Ghilimelele românești „ ” în formulă: Excel nu primește formula (fereastra „There's a problem with this formula”). Lipsește: fereastra „There's a problem with this formula” și explicația (ghilimeaua dreaptă)
- **excel-b-F065** (Decizie (IF) și erorile formulei) Semnele scrise greșit =>, =<, ==, !=, „> =”: Excel propune corectura (fereastra „We found a typo…”), la No nu primește formula. Lipsește: fereastra „We found a typo…” cu corectura propusă (biblioteca o are doar pentru „)” lipită de o adresă, 1600-1604)
- **excel-b-F066** (Decizie (IF) și erorile formulei) Zecimala cu punct (4.5) pe setări românești: fereastra de problemă. Lipsește: fereastra „There's a problem with this formula”
- **excel-b-F068** (Decizie (IF) și erorile formulei) Prea multe părți în IF: fereastra „You've entered too many arguments for this function”. Lipsește: textul corect al ferestrei („too many arguments”)
- **excel-b-F070** (Decizie (IF) și erorile formulei) O parte goală între ; valorează 0 (=IF(B2<14;;20) → 0; =AVERAGE(B2;;B3) numără un 0). Lipsește: AVERAGE / SUM nu numără partea goală ca 0; afișarea rezultatului gol al lui IF neverificată
- **excel-b-F071** (Decizie (IF) și erorile formulei) Spațiu între IF și paranteză („IF (”): Excel propune corectura. Lipsește: fereastra de corectură (rezultatul e totuși cel de după Yes)
- **excel-b-F072** (Decizie (IF) și erorile formulei) Paranteză ) în plus sau închisă prea devreme: Excel propune corectura / fereastra de problemă. Lipsește: fereastra Excel pentru aceste cazuri
- **excel-b-F073** (Decizie (IF) și erorile formulei) Ghilimea fără pereche: Excel nu primește formula. Lipsește: fereastra Excel și explicația
- **excel-b-F109** (Formatare) Formatul numerelor: General / Număr / Monedă (lei) / Procent. Lipsește: Număr (Number) și Monedă (lei) din lista formatului
- **excel-b-F119** (Copiere, mutare, ștergere (lecția 4)) Golire (Clear) ▾ din Pornire: Golire totală, Golire conținut. Lipsește: lista Golire din panglică (Clear All, Clear Contents)
- **excel-b-F120** (Copiere, mutare, ștergere (lecția 4)) Lipirea pe o zonă de aceeași mărime sau pe un multiplu exact (copia se repetă). Lipsește: repetarea pe un multiplu exact al zonei copiate
- **excel-b-F128** (Copiere, mutare, ștergere (lecția 4)) Caseta de nume cu un text care nu e adresă: mesajul (în Excel ar deveni un NUME). Lipsește: mesajul (sau numele definit, ca în Excel)

## NU — stratul de exercițiu (lecție, nu aplicație)
- **excel-b-F129** (Strat de exercițiu (nu e aplicație)) Testele numite ale atelierului, bifate pe loc (sortare: antet / rânduri întregi / ordonat; grafic: oricare cerință; formule pe comportament; valori / gol / fara). — cerută: lectii/viii/m2-l10:217
- **excel-b-F130** (Strat de exercițiu (nu e aplicație)) Mesajele la „Verifică” care spun cauza (antet printre date, desperechere, zonă greșită a graficului, semnul greșit la limită). — cerută: lectii/viii/m2-l11:154 (mesajZona)
- **excel-b-F131** (Strat de exercițiu (nu e aplicație)) Proba cu punctaj (lecția 13): punctele la prima verificare, nota, nivelul, unde ai pierdut puncte, salvarea rezultatului, „Sunt alt elev”. — cerută: lectii/viii/m2-l13:294-347 (proba C2, B1, B2, A1, A2)
- **excel-b-F132** (Strat de exercițiu (nu e aplicație)) Itemul de alegere cu explicație („de ce?”) din probă. — cerută: lectii/viii/m2-l13:347 (probaalege A2)
- **excel-b-F134** (Strat de exercițiu (nu e aplicație)) Foaia liberă cu răspuns de ales („încearcă singur”). — cerută: lectii/viii/m1-l04:473 (o:[…], ok)
- **excel-b-F135** (Strat de exercițiu (nu e aplicație)) Verificarea gestului cerut (gest: clic-adresa, umple, f4, autocompletare, ctrl-d, copiere, sortare-dlg, autosum; doarMouse = din meniu/panglică). — cerută: jocuri/_fixtura-excel (gest:['ctrl-d'], ['f4','umple'], ['sortare-dlg'])
- **excel-b-F133** (Strat de exercițiu (nu e aplicație)) Exersează pe variante: foaia cu altă poziție, alte nume și numere; 3 corecte la rând = stăpânit.

## Cel mai grav
- **Sortarea strică formulele** (F005): biblioteca mută formula cu rândul, dar fără să-i schimbe adresele; după Z→A pe coloana Total, fiecare rând arată totalul altui rând (proba). Lecția 12 (proiectul) sortează exact un astfel de tabel.
- **Ștergerea de rânduri / coloane / celule (lecția 4)**: meniurile și fereastra Delete se deschid, dar nu șterg nimic.
- **Graficul radial din Inserare** și **etichetele pe bare / radial** lipsesc; proba lecției 13 cere un radial cu etichete.
- **Erorile formulei IF**: majoritatea sunt refuzate cu mesajul central „nu e simulat” în loc de ferestrele Excel; ghilimelele întoarse și ≥ sunt refuzate, deși Excel arată #NAME?; „prea multe argumente” apare ca „too few”; paranteza uitată nu se închide singură.

## Ce n-am apucat / nesigur
- jocuri/_motor/tip-foaie.js (motorul formulelor, JocFoaie.evaluate, și tipul „foaie”) e încărcat de toate paginile Excel, și ale mele, și ale lui excel-a; am trecut doar tipul „foaie” (o funcție) și numele românești ale funcțiilor; funcțiile de foaie de calcul (SUM, AVERAGE…) le lasă excel-a.
- lectii/_sim/excelx.js, excelx-formule.js, excelx-functii.js sunt încărcate de lecțiile mele (m2-l09…l13), dar sunt ale lui excel-a: nu le-am citit.
- Ergonomia pe telefon din excelx-sortare.js (panglica derulată singură la Sort & Filter, ținte de 34 px), excelx-grafic.js (butonul Delete sub grafic) și m1-l04 (tragerea fără redesenare, atingerea lungă = meniul) nu sunt trecute ca funcții; în bibliotecă atingerea lungă pe celulă nu am verificat-o.
- Neprobate în poligon (verdict doar din cod): afișarea lui IF cu o parte goală, caseta de nume cu un text care nu e adresă, procentul tastat (50%), Shift+clic pe antet, derularea selecției trase dincolo de margine.
- Funcția „sortarea în timp ce scrii”: niciuna dintre cele două purtări nu e probată în Excel real.
- Stratul de exercițiu (7 funcții, grupul „Strat de exercițiu”) e trecut NU fiindcă biblioteca nu-l are, dar locul lui e probabil în lecție/motor, nu în bibliotecă.

GATA_PARITATE excel-b total=135 da=71 partial=26 nu=38
