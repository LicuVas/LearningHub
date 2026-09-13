# Lecția 3 „Formule de bază în Excel” (clasa a VIII-a) — ce am găsit, pentru Vasile

**Pe scurt:** lecția e cea mai bună din modul până acum la partea practică — tabelele se lipesc corect în Excel, rezolvările se potrivesc cu exercițiile și toate calculele din exerciții ies. Are însă o greșeală care îi încurcă pe elevi chiar la primul exercițiu, două explicații care nu se potrivesc cu ce vede elevul și o cifră de lege depășită. Se ține la Izvoare pe **20.10** și la Brauner pe **23.10.2026**, ultima oră înainte de vacanță.

## Cele trei lucruri care schimbă ora
1. **Ajutorul de la primul exercițiu spune 78, iar Excel dă 77.** Elevul scrie `=SUM(E2:E4)`, vede 77 (27+21+29), deschide „Blocat la pasul 5?” și citește „ar trebui să fie 78”. Cel care a lucrat bine crede că a greșit. Am refăcut calculul în trei feluri (LibreOffice, Python, tabelul din lecție) — 77. Reparația e o cifră. Dovada: `u5_reproducere.txt`.
2. **Explicația pentru „de ce $B$1” nu e ce vede elevul.** Rezolvarea spune că fără `$` formula ar merge pe „celule goale”. În tabelul elevului, rândul 2 e antetul: apare **#VALUE!**, iar rândul următor dă **1575 lei la mâncare** — un număr greșit care arată normal. Asta e de fapt lecția bună („verifici a doua și a treia celulă”), dar lecția n-o spune. Dovada: `recalculat/ex2_excursie.xlsx`, foaia `Fara_dolar`.
3. **Ora are mai mult decât ora 7 din plan.** Planul și programa despart „formule cu operatori” (ora 7) de „funcții: sumă…” (ora 8). Lecția folosește `SUM` de la primul exercițiu și mai adaugă referințele absolute și tasta F4. Poarta calculează că nu încape în 50 de minute (la ritm dublu încape). Propunere: azi `=B2+C2+D2` și atomii 1-5; `$B$1` și Ex. 2 la începutul orei 8.

## Alte lucruri de reparat
- **TVA 19%** în exemplul cu referința absolută. Cota standard e **21% din 1 august 2025** (Legea 141/2025, am citit textul legii de pe site-ul ANAF). Lecția chiar pomenește „de la 19% la 21%” în altă parte.
- **„Drag handle”** — cuvântul nu există în Excel. În engleză e „fill handle” (mânerul de umplere), în română „instrumentul de umplere”. Elevul care îl caută nu îl găsește.
- **„Excel nu calculează de la stânga la dreapta”** — Microsoft spune exact invers (de la stânga la dreapta, pe niveluri de prioritate), iar exemplul lecției `=10-3+2 = 9` e chiar un calcul de la stânga la dreapta.
- **Zecimale cu punct** („media 7.50”, `=3.5*10`). Pe Windows în română zecimala e virgula; și oricum Excel afișează „7,5”, nu „7,50”, fără format cu 2 zecimale. Depinde de setarea din laborator, pe care nu o știm.
- **F4** e prezentat ca „B1 → $B$1 → B1”; tasta trece și prin două variante mixte (B$1, $B1). Mărunt.
- Întrebările de la atomi 2 și 4 cer ce se predă mai târziu; atomul despre ordinea operațiilor n-are întrebare despre ordinea operațiilor. Fără diacritice (0 la 1000).

## Ce merge bine
- Cele trei tabele „Copiază” au Tab între coloane — lipite în Excel se așază pe coloane (la lecțiile 1 și 2 nu era așa).
- Toate rezultatele din rezolvări ies: 30 / 7,5 la Ex. 1; 6580 și 5875 lei la Ex. 2; 18,67 vs 8 la Ex. 3.
- Provocarea cu reducerea din E1 e un exercițiu bun de descoperire (fără `$` reducerea „dispare” în tăcere).

## Întrebări pentru dumneavoastră
- La Izvoare: există un calculator cu videoproiector ca să arătați tragerea formulei? Pe hârtie merg atomii 1-3 și 5, tabelul final și Ex. 3.
- Elevii salvează catalogul? Lecția 4 (după vacanță) lucrează tot pe note și medii.
- La oră, notați unde s-au blocat (77/78, „drag handle”, 9,666667, #VALUE!, punctul zecimal, F4) — blocajele mele sunt presupuneri.
