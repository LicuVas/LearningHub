# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului jucat (U11)
Elev de 14 ani, clasa a VIII-a, noiembrie 2026. Știe să scrie în celule, formule simple și SUM/AVERAGE (lecțiile 1-4). **Nu știe:** să insereze o coloană (nepredat în M1, `u5_reproducere.txt` §B), ce e o „selecție parțială”, că sortarea depinde de setarea Windows-ului. **Nu vede:** rezolvările pliate cât lucrează; interfața poate fi în română („Date”, „Sortare”), lecția îi dă doar numele englezești. **Timp:** 50 de minute, din care ~8 pornire. La Izvoare: probabil fără calculator.

## Pașii, făcuți efectiv (openpyxl + sortare în Python pe rânduri întregi, recalculat de LibreOffice)
1. **Încearcă / Ex. 1.** Tabelul Elev/Nota cu cele 6 nume. A→Z pe Elev → Andrei … Maria; Z→A pe Nota → Dan 10 primul. Ambele egale cu răspunsurile lecției, perechile păstrate (`produs_elev/ex1_sortat.xlsx`, `u1_iesire.json`). Suma notelor 45 înainte și după. **Loc de blocaj:** pe o coloană cu numere, butonul nu se cheamă „Z→A”, ci „Sortare de la cel mai mare la cel mai mic” (surse/sort_ro.txt) — elevul caută un buton cu literele Z și A.
2. **Ctrl+Z de două ori.** Nu se poate executa fără Excel; documentația confirmă Undo după sortare. Rămâne pas `interfata`.
3. **Capcana clasică, făcută intenționat.** Selectez doar coloana B și aleg „Continue with the current selection”: toți cei 6 elevi primesc nota altcuiva (Maria 10, Dan 5), iar **suma rămâne 45** (`produs_elev/capcana_doar_coloana_B.xlsx`, recalculat de LibreOffice). Deci verificarea „totalul e același” nu prinde ruperea; doar comparația pe perechi o prinde. Lecția descrie capcana într-o casetă (atomul 3) și o întreabă în scris la Ex. 3, dar **nu o pune pe mâna elevului** — nimeni nu vede cum arată un catalog rupt.
4. **Bonus / Ex. 2, două niveluri.** Clasa A-Z, apoi Nota descrescător → Elena 9, Maria 8, Carla 7 (8A); Dan 10, Andrei 6, Bogdan 5 (8B) = rezolvarea pliată. Apoi Nr crescător → ordinea inițială. Corect.
5. **Ex. 2, pasul 2 citit literal: „Adauga coloana A1 = Nr si in A2:A7 scrie numerele 1-6”.** În A stau deja numele. Elevul care face ce scrie tastează „Nr” peste „Elev” și 1-6 peste nume; după sortare tabelul are **0 nume** și întrebarea „Ce elevi sunt in primele randuri?” nu mai are răspuns (`produs_elev/ex2_literal_A1_Nr.xlsx`, randat în `randat_xlsx/ex2_literal_A1_Nr_p1.png`). Rezolvarea pliată arată „Nr, Elev, Nota, Clasa” — adică o coloană **inserată**, operație care nu apare în nicio lecție M1 de clasa a VIII-a. Ordinea pașilor agravează: coloana Clasa e pusă în C întâi, iar la inserare ea se mută în D.
6. **Atomul 4 comparat cu ce obține elevul.** Elevul face bonusul și compară cu tabelul „Rezultat: Clasa (A-Z) + Nota (Z-A)” din lecție: acolo Dan e în 8A cu 10, Andrei are 7, Carla 6 în 8B. Pe datele lecției 5 din 6 rânduri diferă (`u5_reproducere.txt` §A). Elevul corect crede că a greșit; elevul atent observă că lecția despre „nu desperechea datele” are chiar ea date desperecheate.
7. **Ex. 3 (în scris).** Q1: am construit Produs/Preț/Stoc cu Valoare `=B2*C2`, sortat după Stoc crescător: formulele rămân pe rândul lor, valorile LibreOffice = Python (381). Stocul minim are egalitate (Rigla și Guma, 7) — schița lecției o anticipează, bine. Q4 („a sortat și a salvat”): criteriul de evaluare (4) spune că după salvare doar coloana Index ajută; Microsoft: „You can undo changes, even after you have saved”. Un elev care răspunde „Ctrl+Z, dacă fișierul e încă deschis” e depunctat pentru un răspuns corect.
8. **„Vrei mai mult?” — Custom List** (Listă particularizată în ro-ro): opțional, neexecutat (nu se poate crea lista fără Excel).

## Blocaje-ipoteză (AI, nu observate — de notat la oră)
- nu găsește „Data” / „Sort & Filter” pe interfața în română;
- scrie „Nr” peste numele din coloana A la Ex. 2;
- compară cu tabelul din atomul 4 și „corectează” notele ca să semene;
- apasă „Continue with the current selection” fără să citească avertismentul (e în engleză/română, ~40 de cuvinte);
- refolosește tabelul din Încearcă (deja sortat + coloana Clasa) la Ex. 1 și nu mai obține ordinea inițială cu Ctrl+Z.

## Unde se salvează
Lecția nu cere salvarea și nu spune unde; Ex. 3 Q4 presupune că elevul înțelege diferența dintre „salvat” și „închis”, nepredată.
