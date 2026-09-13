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
