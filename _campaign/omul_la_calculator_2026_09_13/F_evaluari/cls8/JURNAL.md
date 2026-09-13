# Jurnalul clasei a VIII-a — M1 Excel

## lectia1-interfata
- **Rezolvările pliate trebuie citite lângă cerință, la fiecare exercițiu.** Aici toate trei sunt ale altor exerciții (buget cu discount, erori de formule, PEMDAS), introduse de lotul automat `21b141a` (05.09.2026). Scriptul `lectia1-interfata/u3_potrivire.py` se poate refolosi (schimbă calea lecției).
- **Perechea atom–întrebare, nu doar cheia:** 5 din 9 întrebări cer ce se predă mai târziu; cheile în sine sunt corecte.
- **Blocurile „Copiaza” se lipesc efectiv în foaie** (`u1_lipire_starter.py`): cel de aici are etichete de adresă și niciun Tab.
- **Numele românești ale interfeței Excel sunt deja descărcate** din Microsoft Support ro-ro, text brut, în `lectia1-interfata/surse/` (Foaie1, Redenumire, Pornire, Inserare, Formule, Date, caseta Nume) — refolosește-le, nu le re-afirma din memorie.
- Timp: 61,7 min (nu încape; la ritm dublu 34,8). Lecția 1 cuprinde orele 2+3+4 din plan — la lecția 2 (tipuri de date = ora 5) verifică dacă se repetă, și zecimalele cu punct (8.67) pe setare românească.

## lectia2-date
- **Se repetă „o lecție = mai multe ore”:** aici orele 5+6 (tipuri de date + formatare); dovada proprie în `lectia2-date/01_citit_inapoi.md` și calculul porții.
- **Scurtăturile se verifică tastă cu tastă pe sursa Microsoft:** tabelul de aliniere avea Ctrl+L/E/R ale Word-ului (în Excel: Creare tabel / Umplere instant), iar Backspace era descris greșit. Citatele brute: `lectia2-date/surse/shortcuts_en.txt`, `shortcuts_ro.txt` (+ `surse_cauta.py`, refolosibil).
- **Punct zecimal + dată zz/ll/aaaa = conflict pe ORICE setare** (ro-RO: 8.5 nu e număr; en-US: 15/06/2026 nu e dată) — `lectia2-date/u4_cultura.txt`. La lectia3-formule caută același tipar și valori cu unitate în celulă („3.50 lei”, „5 buc”), care fac formulele să dea eroare.
- **Blocul „tabel gata” fără Tab se repetă** (Ex. 1), cu foaia `Lipire` proprie: COUNT = 0. Rezolvările pliate de data asta **se potrivesc** cu cerințele — defectul din L1 nu e generalizat pe modul.
- Randarea LibreOffice pe acest PC (ro-RO) arată ce vede elevul pe Windows în română: `8,50`, `1.234,50`, `###` la dată în coloană îngustă — merită randat PDF la fiecare exercițiu.

## lectia3-formule
- **Blocurile „Copiaza” au Tab aici** (toate 3, `lectia3-formule/u1_iesire.json`): defectul din L1-L2 nu e al modulului, e al lotului — verifica la fiecare lectie, nu presupune.
- **Numerele de control din indicii se recalculeaza, nu se citesc:** indiciul Incearca spune 78, Excel da 77 (`lectia3-formule/u5_reproducere.txt`). Rezolvarile pliate se potrivesc cu cerintele, dar **explicatiile** din ele se verifica tragand si varianta gresita (fara $: #VALUE! + 1575, nu „celule goale”).
- **Se repeta „o lectie = mai multe ore”**, dovada proprie: ora 7 (operatori) + SUM din ora 8 + referinte absolute (`lectia3-formule/01_citit_inapoi.md`, programa separa formulele de functii). La lectia4-functii: ce ramane de predat, daca SUM a fost deja folosit.
- **Se repeta punctul zecimal** (=3.5*10, „media 7.50”) — `lectia3-formule/randat_xlsx/ex1_medie.pdf` arata 7,5 pe ro-RO. Nou: termenul „drag handle” nu exista in Excel (fill handle / instrumentul de umplere, `lectia3-formule/surse/umplere_*.txt`) si faptele din lumea reala (TVA 19% → 21% din 01.08.2025, `surse/tva_L141_2025.txt`) cer sursa datata.

## lectia4-functii
- **Lectiile 4-7 nu se tin acum:** ora 8 (functii) = 03.11 Izvoare / 06.11 Brauner, ora 9 (decizie) = 10.11 / 13.11 — Modulul 2 al scolii; lectia 4 = orele 8 + 9, dovada proprie in `lectia4-functii/01_citit_inapoi.md` (se repeta „o lectie = mai multe ore”, 63 min calculat de poarta).
- **Nou: adresele de celula din text nu se potrivesc cu foaia** („B4 din 10”, „B7 din 4” — in foaie B5, B8; B7 literal da media 7,75, nu 8). Se verifica cu `=MATCH(...)` in foaia construita (`lectia4-functii/u5_reproducere.py`), nu numarand din cap. Rezolvarile pliate si cheile sunt din nou corecte — defectul e in pasii „schimba X si observa”.
- **Separatorul de lista apare pentru prima data la elev** (IF, `MIN(B2, B5, B8)`), numai cu virgula; `B_context_real.md` §4b numara `;` in lectie — azi nu mai exista niciunul (grep), deci inventarul e vechi: recitește HTML-ul, nu inventarul.
- **Se repeta zecimala cu punct** (20.71 vs 20,71429 randat ro-RO, `lectia4-functii/randat_xlsx/ex2_meteo.pdf`) — a treia lectie la rand: e al modulului. Nou la nume: „Function Wizard” (0 aparitii la Microsoft; „Inserare funcție”) si „Home -> Number” (ro-ro „Mărire zecimală”), surse brute in `lectia4-functii/surse/` (SUM/MIN/MAX/AVERAGE/COUNT/COUNTA/IF ro-ro, refolosibile).

## lectia5-grafice
- **Schemele de grafice desenate in CSS se masoara, nu se citesc:** in atomul 6 barele au `height: 89%` intr-un parinte fara inaltime = 0 px, deci „Anatomia unui grafic Column” nu are coloane pe ecran (`lectia5-grafice/u5_bare_anatomie.py`, refolosibil). Cauta `.chart-bar` si in lectia6-proiect.
- **Se repeta zecimala cu punct (a patra lectie), dar aici strica produsul, nu doar afisarea:** „7.2” pe ro-RO = data 07.02 sau text, graficul iese cu bare de ~46000 sau fara bare (`lectia5-grafice/randat_xlsx/lipire_roRO.pdf`, `lipire_text.pdf`).
- **Nou, de specialist: exercitiul contrazice regula lectiei** — Incearca face Pie din medii pe materii (felii 18-23 % dintr-o suma fara sens), regula corecta apare abia in atomi si nu inchide pasul. Randeaza fiecare grafic cerut; lipsesc si „axa de la 0” si avertismentul la 3D (`lectia5-grafice/surse/gss_charts.txt`).
- **Traducerile din paranteza sunt inventate** („Grafice”, „Inserare”, „Circular”; in ro-ro: diagrame, Inserati, structura radiala — `lectia5-grafice/surse/create_ro.txt`, `tipuri_ro.txt`). Lectia 5 = o singura ora (ora 11, 24/27.11), dar tot nu incape (~72 min calculat de poarta).

## lectia6-proiect
- **Separatorul „amestecat” din B_context_real §4b nu exista:** cele 5 `;` sunt din entitatea HTML `&gt;` (`>=`); dupa `html.unescape` raman 0 `;` si 6 virgule (`lectia6-proiect/u1_iesire.json`). Numara separatorul pe text decodat, nu pe HTML brut. Problema reala ramane: numai virgula, fara nota ro-RO.
- **Rezolvarile pliate se CONSTRUIESC cu structura enuntului, nu se citesc:** la Ex. 1 `=AVERAGE(B4:F4)` pare bun, dar cu Nr./Nume/5 materii da 14/15 medii gresite fara nicio eroare (`lectia6-proiect/u5_reproducere.txt`). Pana la L5 rezolvarile erau corecte — nu mai presupune.
- **Nou: norma de domeniu din afara Excel-ului.** Un „catalog” trebuie sa respecte ROFUIP (promovat = minim 5 la fiecare materie, art. 115; note intregi 1-10, art. 106) — `lectia6-proiect/surse/rofuip_2024_art115.txt`. Proiectul nu are barem si produce fisiere identice pe clasa; la Izvoare ora 12 e comasata in tema acasa (`Calendar_ore_VIII.md` r. 11-13).
- **Se repeta punctul zecimal (a cincea lectie)** — dovada proprie: „7.50” pe ro-RO nu e numar, tot catalogul da #DIV/0! (`lectia6-proiect/recalculat/lipire_roRO_text.xlsx`); si axa de la 0 (Ex. 2 porneste la 7,35, `randat_xlsx/ex2_buletin_p1.png`). Carry-forward L5: `.chart-bar` = 0 in L6 (`u2_chart_bar_grep.txt`). Poarta: 91 min.

## lectia7-sortare
- **Se repetă „rezolvarea are altă structură decât enunțul” (L6), cu dovadă proprie:** Ex. 2 cere „coloana A1 = Nr” peste coloana cu nume; făcut literal, tabelul rămâne cu 0 nume (`lectia7-sortare/produs_elev/ex2_literal_A1_Nr.xlsx`). Rezolvarea arată o coloană inserată, operație nepredată în M1 (grep: 0 apariții în L1-L7, `u5_reproducere.txt`).
- **Nou: tabelele-model „rezultat” se regenerează din datele lecției.** Tabelul de sortare pe două niveluri din atomul 4 are 5 din 6 rânduri greșite (Dan 8A, Andrei 7, Carla 6) — tocmai desperecherea pe care o predă lecția (`u5_reproducere.txt` §A). Scanarea K pe Ex. 2/Ex. 3 = fals-pozitivă (potrivire manuală în `04_a_doua_cale.json`).
- **La sortare, totalul nu e a doua cale:** capcana „doar coloana B” dă 6/6 perechi rupte și aceeași sumă 45 (recalculat LibreOffice) — verifică perechi (un rând cunoscut), nu sume. Criteriul de notare al Ex. 3 contrazice Microsoft („You can undo changes, even after you have saved”, `surse/undo_en.txt`): criteriile exercițiilor scrise se verifică și ele.
- **Zecimala cu punct NU se repetă aici** (note întregi); se repetă meniurile doar în engleză (`surse/sort_ro.txt`: Date, Sortare & filtrare, Adăugare nivel, Extindeți selecția — Microsoft are chiar două traduceri ale grupului). Nou pe U4: ordinea alfabetică depinde de setarea regională (sursă brută) — colația Windows ro-RO vs en-US mută Ș/Ț/Î (`u4_colatie.json`); lecția n-are niciun nume cu diacritice. Poarta: 56,7 min (ritm dublu 32,4).

## Concluzia modulului
- **Rezolvările, tabelele-model și indiciile nu sunt de încredere fără să fie construite:** L1 (rezolvări ale altor exerciții), L3 (78 vs 77), L4 (adrese greșite), L6 (media greșită pe 14/15), L7 (tabel-model rupt, coloana Nr peste nume). Reparația: fiecare exercițiu din M1 rulat într-un xlsx generat, iar tabelele din atomi și rezolvări să fie generate din acel fișier, nu scrise de mână.
- **Un singur mediu declarat pe modul și ținut peste tot:** numele comenzilor ro + en, o dată, zecimala cu virgulă pe setarea română (L2-L6), separatorul de funcții pe ambele variante și o notă despre setarea regională (afectează numere, date și ordinea alfabetică).
- **Ordinea fișierelor după planul anului:** sortarea (ora 10) înaintea graficelor și a proiectului; lecțiile 1-4 acoperă fiecare câte 2-3 ore din plan. Numerotarea și navigarea trebuie refăcute după `Calendar_ore_VIII.md`, iar lecțiile 4-7 se țin în noiembrie-decembrie.
- **Timpul:** toate lecțiile evaluate ies peste 50 de minute la ritmul provizoriu (56-91 min). Tiparul „Încearcă + 6-10 atomi + 3 exerciții” trebuie tăiat: un exercițiu în oră, restul temă.
- **Planul A pentru Izvoare lipsește în tot modulul:** nicio lecție nu are variantă pe hârtie; pentru L7 e ușor de făcut cu cartonașe, pentru L1-L6 trebuie fișe cu tabele tipărite.
- **Diacriticele lipsesc în toate cele 7** (spec :401 le cere), iar la L7 asta ascunde chiar subiectul: ordinea alfabetică românească.
