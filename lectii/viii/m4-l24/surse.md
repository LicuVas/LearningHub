# VIII/24 — „Operații cu șiruri: citire, afișare, parcurgere” — surse, decizii, probe

**Nu e publicată, nu e în depozit (fără commit).** Autor: agentul VIII/24, valul 7, noaptea 09→10.11.2026 (03:00-03:50). **Reparată după judecata 1 (R1, autor proaspăt, 10.11.2026, 05:20-05:57): §13 și `_verificare\registru_j1.md`.** Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\viii_l24.md`.

## 1. Ancora (documentele profesorului au prioritate)

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Info_Gimnaziu_2026\planificari\Calendar_ore_VIII.md` r. 40 („16.03.2027 \| 24 \| M4 \| Operații cu șiruri: citire, afișare, parcurgere \| predare”), `data\unitati.json` (VIII-U3, nr. 24), `lectii\plan.json` (cale `lectii/viii/m4-l24/`, cheie `lectie_viii_m4_l24`, data 19.03.2027) | întocmai. Diferența de dată (16.03 în `Calendar_ore_VIII.md`, 19.03 în `plan.json`) nu e a lecției: urmez `plan.json` |
| Unitatea | `unitati.json` + `planificari\Proiectul_unitatii_VIII-U3.md` (fișierul există cu numele ăsta): „Șiruri de valori. De la algoritm la program”, CS.2.1, CS.2.2, CS.3.3, 11 ore; ora 24: predare, „teorie, exercitii” | `unitateTitlu` întocmai; `competente:['CS.2.2','CS.3.3']` (programe care prelucrează șiruri; implementarea în mediul de programare) |
| Conținutul | `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`: „Operații cu șiruri de valori: citire, afişare, parcurgere” | `continuturi` ÎNTOCMAI, cu „ş”-ul cu sedilă al sursei (U+015F; poarta cere textul identic, contradicția K6 a ghidului). În `ancoraText` (text văzut) e scris cu ș cu virgulă |
| Activitatea profesorului | `data\activitati_lectii_VII_VIII.json`, „Operații cu șiruri: citire, afișare, parcurgere”: „Primul program cu șir: citire, afișare, apoi afișare în ordine inversă. Urmărirea pe hârtie a valorii indicelui la fiecare pas, înainte de rulare.” Resursa: „laborator, fișă de urmărire a indicelui” | scheletul: P5 (citire + afișare), P6 (inversul), atelierul (tot programul), laboratorul (Code::Blocks). „Urmărirea pe hârtie… înainte de rulare” = tabelul i / condiția / se afișează din „Uite cum” (P4, P6), exercițiile cu tabel (P4, P6, P5 încă 1; Î1 cere tabelul pe hârtie), „întâi pe hârtie, apoi aici” în enunțuri și „Al doilea rând îl ai pe hârtie” la atelier. „Fișa de urmărire” = caietul + extensia `urmarire-indice.js` |
| Analogia profesorului | `data\analogii.json`, VIII-U3: vestiarul cu ușițe numerotate; „unde se rupe”: „în program [numerotarea] începe de la 0, deci al 40-lea element are indicele 39” și ieșirea din șir („nu dă eroare, dă rezultat greșit”); demonstrația: „Zece elevi în linie, numerotați cu bilete de la 0” | P0 (40 de note, vestiarul — fotografia lecției 23), P5 „Explică-mi altfel” (vestiarul cu ușițele de la 0), P4 „Explică-mi altfel” (elevii cu bilete de la 0), P5 (v[n] fără valoare: simulatorul se oprește, Code::Blocks afișează un număr oarecare) |
| Activitățile din programă (CS.2.2 / CS.3.3) | „construirea unei secvențe algoritmice pentru introducerea unui șir de valori utilizând operația de citire în cadrul unei structuri repetitive”; „editarea codului sursă…”; „executarea și testarea unui program care prelucrează un șir de valori” | toate trei: P5, atelierul, laboratorul |
| Materialul de antrenament | `materiale\antrenament\clasa_VIII.md`, „Operatii cu siruri de valori: citire, parcurgere, afisare” (probleme kilonova.ro) | NU luat: cere cont pe un sit extern și C++ deja știut; de decis de profesor (§9) |
| Jocul vechi | `jocuri\siruri-viii` (C++: `int v[100]`, `v[i]`, indici de la 0) | doar forma `int v[100]` și numele `v`; textul și exercițiile sunt noi |

### Conținutul → unde e predat, exersat, verificat (S8)

| Partea | Pas (predat) | Exersat (obligatoriu) | Verificat (întrebări) |
|---|---|---|---|
| citirea (cin; șirul citit cu for) | P3 „Variabila și citirea”, P5 „Tabloul: șirul în program” | P3 Încearcă (cin dat, cout scris), P5 Încearcă (scrii citirea + afișarea) | Î5 (citirea cu i <= n) |
| afișarea (cout, endl, " ") | P2 „Programul și afișarea”, P5 | P2 Încearcă, P5 Încearcă, atelierul (endl între rânduri) | Î4 (endl în corp) |
| parcurgerea (for, indicele de la 0, în ambele sensuri) | P4 „Repetiția for și indicele”, P5, P6 „Afișarea în ordine inversă” | P4 Încearcă (tabelul), P6 Încearcă (tabelul inversului), atelierul (scrii inversul) | Î1 (pornire de la 1), Î2 (indicele ultimului), Î3 (capetele inversului) |

## 2. Granița (fișierul `granite\viii_l24.md`)

Predau tot ce trebuie pentru primul program cu șir (contractul, I4: la a VIII-a nu presupun C++). NU predau: numărarea cu proprietate și `if` (VIII/25), suma / produsul (26), minim / maxim (27), „pentru toate / cel puțin un” (28), rularea pas cu pas (31: `pasCuPas:false` peste tot), `while`, `"\n"`, `int v[n]`. VII/24 (scrisă deodată): aceleași texte despre Code::Blocks și simulator (citit `granite\vii_l24.md` la 03:27; preluat de acolo, cu sursa: fila **Build messages** a panoului **Logs & others**, probată de VII/24 la 03:22). Numele fișierului diferă intenționat (VII: `_primul.cpp`, VIII: `_lectia24.cpp`).

## 3. Ce presupune lecția (din lecțiile publicate) — bife

- ✔ șirul, elementul, poziția numărată de la 1, lungimea — VIII/23, pașii 2-4 (publicată). Puntea spusă în P5: „Elementul de pe poziția 1 de la lecția 23 e v[0]”; cuvântul „indice” vine din VIII/23 („poziția … sau indicele”), aici redefinit pentru C++ („aici numărul dintre parantezele drepte”), fără `<mark>` (nu e termen nou).
- ✔ temperaturile 3, -1, 0, 5 (primele patru din șirul lecției 23) — datele-exemplu.
- ✔ Ctrl+C / Ctrl+V — VIII/4 (Clipboard); **Ctrl+A nu e în VIII/4** (R1, judecata 1 M: grep pe pagină): îl explică laboratorul pe loc („selectezi tot”). Folosite doar la laborator, cu drumul de rezervă „Scrie-l” (cu tabelul semnelor).
- Nimic despre C++ de la anul trecut (I4).

## 4. Decizii (luate de autor sau de dirijor; profesorul le poate schimba)

1. **C++ cu Code::Blocks (hotărârea dirijorului, contractul m5_noapte_08_11, decizia 1 — NECONFIRMATĂ încă de profesor).** Simulatorul `lectii\_sim\cpp-mic.js` încărcat nemodificat (sha1 `a1196f49522e061e50fa91ffdb7428c7bbdbdace`, același la început și la sfârșit).
2. **Indicele de la 0** (C++; analogia profesorului: „al 40-lea element are indicele 39”). Lecția 23 a lăsat-o explicit pentru lecția 24 („Pentru lecția următoare”). Pozițiile de la 1 rămân în vorbire („poziția 1 de la lecția 23 e v[0]”).
3. **Acoladele mereu la for**, chiar cu o singură instrucțiune (punctul 2 din GATA; poarta 7, D7-3 / D7-4): „Fiecare { are o } a ei. Fără acolade, corpul e o singură instrucțiune.” (P4; R1: + „chiar după ultima instrucțiune din corp”, „După for (…) nu pui ;” și metoda acoladei lipsă, D7-4) + exercițiul cu steluța (P4, încă 2) + Î4 (`}` după `cout << endl;`: alt rezultat, aceleași date).
4. **`int v[100];`** (cel mult 100 de elemente), nu `int v[n]` (g++ îl primește ca extensie, dar nu e C++ standard).
5. **„Pas cu pas” ascuns** (`pasCuPas:false`): rularea pas cu pas e lecția VIII/31; activitatea cere urmărirea pe HÂRTIE.
6. **Laboratorul copiază programul de la atelier** (Ctrl+A, Ctrl+C, Ctrl+V, apoi Ctrl+S înainte de F9 — R1), cu drumul „Nu se lipește? Scrie-l.” și tabelul semnelor pe tastatură (ca la VII/24, plus `[ ]`): tastarea celor ~330 de semne ar costa elevului lent ~6 minute pe care ora nu le are (§8).
7. **Textele programelor fără diacritice** („Buna ziua!”, „Lectia 24”), cu motivul spus (GATA, „Diacriticele din texte”).
8. Datele inventate: temperaturile 3, -1, 0, 5 (de la lecția 23), alte șiruri mici; un singur nume în pagină, `Popescu_Ana_8A_lectia24.cpp` (exemplul de nume de fișier al seriei VIII, ca la VIII/23).

**Variante respinse:** tabel de urmărire cu rânduri adăugate de elev (prea multe gesturi pe telefon; rândurile sunt date, oprirea se cere separat); atelier cu toate cele trei repetiții scrise de la zero (~12 minute la elevul lent: a rămas „Încă un exercițiu”); Î1 ca tabel în pagină (1,5 minute în plus: e alegere, cu tabelul pe hârtie); `"\n"` (GATA, punctul 3: `endl`); capturile Code::Blocks ale VII/24 (nepublicate încă; le folosesc pe ale componentei).

## 5. Faptele (afirmatii.json, după R1: 43 — 24 PROBAT, 7 PROBAT_PAGINA, 4 PROBAT_COMPONENTA, 2 PROBAT_ALTA_LECTIE, 6 NESIGUR)

- Fiecare program din pagină și fiecare greșeală tipică: compilat și rulat cu **g++ 16.1** (`-std=c++17 -O0`, arbitrul simulatorului) și **g++ 6.3** (`C:\MinGW`, compilatorul Code::Blocks de aici), apoi în simulator (`_proba\proba_programe.py` → `programe_rezultat.json`): **45 de rulări identice** octet cu octet; cele 5 diferite sunt exact greșelile despre care C++ nu spune ce iese (element fără valoare, `cout << v`): simulatorul se oprește cu mesaj, g++ 16.1 afișează alt număr la fiecare rulare, g++ 6.3 afișează `6`; `i++` la invers: g++ 16.1 se oprește cu `0xC0000005` fără să afișeze, **g++ 6.3 afișează întâi ~10.000 de numere (9.969), apoi se oprește cu `0xC0000005`** (R1, `_proba\r1_ipp_invers.py`; textul vechi spunea „ambele se opresc”), simulatorul la v[4].
- Oracolul independent `_proba\oracol_gpp.py` (configurația extrasă din pagină): rezolvarea fiecărui exercițiu C++ trece toate testele cu ambele compilatoare, programul greșit pică, programul de pornire nu trece deja; tabelele de urmărire așteptate de extensie = ce face g++ cu antetul for-ului din pagină → **0 probleme**.
- NESIGUR (scris prudent în pagină): fereastra de la rulare din Code::Blocks („de obicei neagră”) și închiderea ei cu ✕ (și când programul mai așteaptă un număr, A38), fereastra „Save file as…” cu numele existent, lipirea în Code::Blocks, Fn+F9, locul pictogramei Code::Blocks în laborator.
- R1: fila **Build messages** cu eroarea se vede acum în pagină (copia identică a capturii VII/24, `img\cb-eroare-pv.webp`, A26-A27); tabelul tastelor e probat cu ToUnicodeEx (A39).

## 6. Simulatoarele

- `lectii\_sim\cpp-mic.js` — încărcat, nemodificat (sha1 de mai sus). Tipul prin `CppMic.tipuri`.
- **Extensie nouă: `lectii\_sim\urmarire-indice.js`** (proprietar VIII/24): fișa de urmărire a indicelui. API (capul fișierului): `UrmarireIndice.render / rezolva / gresit (Q, body, api)`, tipul `'urmarire-indice'`; `Q`: `cod`, `v` (sau `n`), `start`, `cond` (`<`, `<=`, `>`, `>=`), `limita`, `condText`, `pas` (+1 / −1), `afis` (`'v'` / `'i'`), `coloana`; testele `i`, `o`, `stop` (primul care pică numește greșeala; la v[i] luat cu poziția de la 1, mesajul o spune); `UrmarireIndice.pasi(Q)` (calculul, nu scris de mână), `UrmarireIndice.tablou(valori)` (căsuțele cu v[0], v[1]… pentru „Uite cum”). Nimic salvat, nimic trimis; casete ≥ 44 px, font 16 px, `inputmode="text"`. Proba: `_proba\proba_extensie.js` → 0 (forme bune: −1, „minus 1”, „i = -1”; greșeli tipice; un mutant prins).
- **R1 (10.11.2026, judecata 1, E / E1 / E2; API-ul și numele testelor neschimbate, nota datată și în capul fișierului):** „v[3]” singur (numele, nu valoarea) primește „scrie numărul pe care îl afișează programul, adică valoarea lui v[3] din date, nu numele lui” (înainte era citit ca 3 → mesajul repeta ce scrisese elevul); „n-1” / „n - 1” / „n+1” se calculează cu n din date (înainte „n-1” era citit −1 → același mesaj de două ori); la pasul 1, când pornirea din for conține n, mesajul o arată („n - 1”) și dă n din date; „Ia-o de la capăt” golește numai la a doua apăsare (prima: „Sigur? Apasă din nou: se golește tot tabelul”), butonul la 16 px sub caseta opririi. Probe: `_proba\proba_r1.js` (E), `_proba\proba_r1_ui.py` (E, E2, la 390 și 1280), `proba_extensie.js` → 0, copia probei sonnet `s_ext_cazuri_copie.js` (32 de forme: 2 diferențe față de `inainte_r1`, ambele dorite: „v[3]” → element, „‑1” cu cratimă nedespărțitoare → −1).

## 7. Probe și porți (rulate ULTIMELE, după ultima schimbare a paginii; R1, 10.11.2026, 05:47-05:56)

| Poarta | Rezultat |
|---|---|
| `jocuri\_motor\test_joc.py --dir lectii\viii m4-l24` | **TRECUT** (23 de întrebări jucate; avertismentul obișnuit: 1 nivel) |
| `verifica_lectie.py index.html --fara-t1` (ultima) | **0** (S0, S1, S2 6/6 aplicare, T0 0) |
| `_proba\parcurge.py` (Playwright, 390 cu atingere + 1280 cu mouse, rețeaua blocată, `ctx.close()`) | **147 de verificări, 0 picate, 0 erori în consolă, 0 cereri spre panou** (4 cereri oprite: fonturile Google); +2 față de autor (E2); atelierul are 7 teste |
| `_proba\proba_r1_ui.py nou` / `inainte` (reparațiile în pagina reală, 390 + 1280) | **0** / 23 picate din 46 |
| `_proba\proba_r1.js nou` / `inainte` (o verificare pe punct din registru, fără browser) | **0** / 47 picate din 72 |
| `_proba\durata_r1.py nou` / `inainte` (`j1_durata.py` al judecătorului opus, neschimbat) | lentul cu supapa **49,9** / 50,1 (fără supapă 57,3 / 57,5) |
| `_proba\durata.py` (metoda autorului, 110 cuv./min) | 50,5 (înainte 50,1: tabelul tastelor de la „Scrie-l”, 78 de cuvinte, numărat aici; tăieturile R1 au urmat metoda judecătorului) |
| `_proba\oracol_gpp.py` | **0** |
| `_proba\proba_extensie.js` | **0** |
| Copiile probelor judecătorilor (`_proba\j1_copii\`, `s_ext_cazuri_copie.js`) | `j1_progs.js`: 2 verdicte schimbate (citirile cu `<= n`: TRECE → PICĂ), restul identice; `j1_reparatie_D.js` 0 / 0; formele extensiei: 2 diferențe dorite |
| `learninghub_date_personale.py` | **0** |
| `activitate.py lista \| grep -c "nu e în catalog"` | **5** la început (05:21), **5** după toate probele (05:54); ieșirea nesalvată |
| `git status` pe `lectii\_sim\` și `jocuri\_motor\` | `cpp-mic.js` sha1 a1196f49… și `motor.js` e748784c… neschimbate; schimbat doar `urmarire-indice.js` (al lecției) |

Reguli verificate pe lecție: 1, 2, 3, 5, 7, 9 (simulatorul comun nemodificat; g++ arbitru), 10, 14, 20, 22, 23, 24, 25, 26, 27, 28, 29 (testul capetelor = ce se predă, GATA), 30, 31, 32, 33, 34.

## 8. Durata (elevul lent; `_proba\durata.py`, configurația din pagină) — cifrele autorului; **după R1, metoda judecătorului opus: §13**

Citit: **2.218 cuvinte / 110 = 20,2 min** (codul din `<pre>` numărat ca text). Gesturi: **30,0 min** — P2 2,0 · P3 2,3 · P4 (tabelul) 3,0 · P5 (două repetiții, ~95 de semne la 30 de semne/min pe telefon) 5,3 · P6 (tabelul inversului) 3,4 · atelier (endl + inversul, ~68 de semne, 2 rulări, 2 verificări) 4,4 · laborator (Code::Blocks deschis la P2; Empty file, Save as cu numele, copiere, F9 + date, Ctrl+S, închidere, căutat) 5,3 · întrebări 3,0 · navigare 1,2. **TOTAL ≈ 50 de minute (50,1), la limită: de cronometrat la clasă.** Dacă elevul tastează programul în Code::Blocks în loc să-l copieze: +6,3 min → „Când mai sunt 10 minute din oră” (scris în „Cum lucrezi” și în laborator) trimite întrebările la ora viitoare. La Dumbrava (doar telefoane) laboratorul se sare: ~42 de minute.

## 9. Pentru profesor

1. **Limbajul: C++ cu Code::Blocks** — hotărârea dirijorului din 08.11 (contractul, decizia 1), neconfirmată de dumneavoastră. Dacă alegeți altfel, pagina se reface (simulatorul, programele, laboratorul). **„Mai puțin ajutor, dar niciodată fals”** (hotărârea 2 a dirijorului, NECONFIRMATĂ de dumneavoastră): la greșelile de nume (`i` folosit după `for (…);`) și de acolade (`}` uitată), simulatorul nu propune reparația, ci o propoziție neutră, adevărată; pagina învață ce face elevul cu ea (pasul „Repetiția for”: „După for (…) nu pui ;” și „Lipsește o acoladă? … pune } după ele”). Dacă preferați mesaje care spun reparația, se schimbă componenta comună, nu lecția.
2. **Compilatorul din laboratoare:** Code::Blocks de pe calculatorul de lucru folosește g++ 6.3 (`C:\MinGW`). Programele lecției ies la fel cu 6.3 și cu 16.1; ce compilator e în laboratoarele școlilor nu știm.
3. **Indicele de la 0** (ca în analogia dumneavoastră). Pozițiile de la 1 (lecția 23) rămân în vorbire. Dacă preferați să numărați în program de la 1 (`for (int i = 1; i <= n; i++)`, `v[1]…v[n]`), se schimbă pașii 5-6, atelierul și Î1-Î3.
4. **Code::Blocks pe calculatoarele din laborator:** unde nu e instalat, laboratorul trimite la atelierul din pagină. Fereastra de la rulare și cea de salvare n-au putut fi văzute (capturi_lipsa.json). Pe tastatura „Statele Unite – internațională” (instalată pe calculatorul de lucru) ghilimeaua e tastă moartă: `" ";` tastat după tabelul de la „Nu se lipește? Scrie-l” iese `"";` (spațiul dispare, numerele se lipesc; probat cu ToUnicodeEx, `_verificare\j2_taste.py`); pe tastatura românească standard iese corect. Dacă în laborator e aranjamentul internațional, la „Scrie-l” elevul apasă spațiul de două ori după prima ghilimea.
5. **Antrenamentul kilonova.ro** (`materiale\antrenament\clasa_VIII.md`) nu e în pagină (cont pe un sit extern). Îl vreți ca temă, „Dacă mai ai timp”?
6. **Durata e la limită (R1, metoda judecătorului opus: 49,9 minute pentru elevul lent cu supapa; 57,3 fără ea).** Supapa e scrisă în „Cum lucrezi”: „Când mai sunt 12 minute din oră și n-ai ajuns la laborator: treci la el cu programul din atelier (nu se compilează? Ia-o de la capăt). Pe telefon, termini atelierul. Întrebările le faci ora viitoare.” (J2-2: cu ea, metoda judecătorului opus dă 49,97.) De cronometrat la clasă.
7. Data din plan: `plan.json` 19.03.2027, `Calendar_ore_VIII.md` 16.03.2027.

## 10. Pentru lecția următoare (VIII/25 „Algoritmul de numărare…”)

- Elevul știe: scheletul, `cout` / `cin` / `endl` / `" "`, `int`, variabila (cutia), `for` cu `i++` / `i--`, acoladele și corpul, `int v[100]`, indicele de la 0, citirea și afișarea unui șir, inversul, tabelul de urmărire pe hârtie. NU știe: `if`, contorul, `nr = nr + 1`, `while`.
- Pe calculator rămâne `Documente\Nume_Prenume_<clasa>_lectia24.cpp` (citire, afișare, invers), cu `.exe` și `.o` lângă el — bun de pornit pentru numărare.
- Extensia `urmarire-indice.js` se poate folosi așa cum e (API stabil, capul fișierului) sau extinde într-un fișier NOU (de exemplu o coloană pentru contor). Ce nu se schimbă: numele testelor (`i`, `o`, `stop`), forma lui Q, clasele `uix-`, id-ul de stil.
- GATA, punctele 10-11 (contorul declarat ÎNAINTE de repetiție; `i` din `for` se vede numai în `for`) sunt pentru VIII/25.

## 11. Pentru componenta comună (cpp-mic.js — nimic schimbat)

- Nicio nepotrivire găsită pe drumurile lecției. Observat: după o captură de ecran `full_page` în Playwright, emularea atingerii (`pointer: coarse`) se pierde și numerele de rând par de 24 px (sunt 32 px cu atingere): artefact al probei, nu al componentei (ghidul, III.3 F5).
- Numerele de rând au eticheta „Atinge un număr ca să pui un punct de oprire.” și când „Pas cu pas” e ascuns (`pasCuPas:false`): **probat la R1** (`_proba\proba_r1_ui.py`, 390 și 1280): atingerea / clicul pune punctul roșu (clasa `opr`), Rulează merge la fel, a doua atingere îl scoate. Lecția o spune acum la P2 („Un punct roșu apărut pe numărul unui rând îl scoți atingându-l din nou.”). Propunerea judecătorului 1 (L): fără „Pas cu pas”, numerele să nu fie butoane.
- **(R1, judecata 1, H)** Mesajul unui test `linii` strânge spațiile: ieșirea „5  0” (două spații) și cerința „5 0” arată la fel în mesaj; diferența se vede doar în consolă. Propunere: spațiile din ieșire arătate (·) sau `white-space: pre-wrap` pe citat. În lecție: indiciul atelierului spune „între ghilimele, un singur spațiu”.
- **(R1, judecata 1, A / D7-1)** `for (…);` urmat de `{` primește neutra NUME („nu cunoaște numele i”); o listă fixă ar recunoaște sigur `for (…);` + `{`. În lecție: P4 spune „După for (…) nu pui ;” și leagă de mesajul NUME.
- **(R1, judecata 1)** „Dă-i o valoare înainte să-l folosești” apare și când cauza e o acoladă pusă greșit sau un capăt de for (`i = n`); fără atribuire predată, sfatul nu se poate urma. Propunere: „…sau verifică până unde merge i și unde se închide corpul for-ului”. În lecție: metoda acoladelor (P4) și testul capetelor (P5, atelier) prind cazurile lecției înainte.

## 12. Atenție pentru judecător

- Durata, după R1: 49,9 minute la elevul lent cu supapa (metoda judecătorului opus, scriptul lui copiat neschimbat, §13): la limită, de cronometrat la clasă.
- `continuturi` are „ş” cu sedilă (cerut de poartă: textul identic din `curriculum.json`).
- Testele cu `potrivire:'linii'` (GATA: VIII/24 predă capetele buclei); numele testelor arată datele (GATA, punctul 5): un elev poate scrie rezultatele de mână; testul „cu un șir pe care nu-l vezi aici” are datele nenumite.
- ~~Citirea cu `i <= n` trece testele~~ — **R1 (judecata 1, D / L1):** testul capetelor (`codNu:'<=\\s*n\\s*;'`, al doilea, după „se compilează”) la P5, la atelier și la „Încă un exercițiu” al atelierului: citirea / afișarea cu `<= n` și `v[1..n]` cu `<= n` nu mai primesc „Corect”; `<= n - 1`, un singur for, forma fără spații, `v[i - 1]` de la n la 1 trec (GATA permite `codNu` aici: VIII/24 predă capetele).
- Î1 e alegere, cu tabelul cerut pe hârtie (nu se poate verifica tabelul din caiet).
- Code::Blocks: numele din meniuri vin din GATA (citite din meniul real), fila Build messages din proba VII/24; fereastra de la rulare și cea de salvare sunt NESIGURE, scrise prudent.
- Extensia nouă `urmarire-indice.js` e a lecției (fișier nou, nume liber verificat).

## 13. Reparațiile după judecata 1 (R1, 10.11.2026)

Registrul complet, punct cu punct, cu proba înainte → acum: `_verificare\registru_j1.md`. Copia dinainte: `_proba\inainte_r1\` (pagina, extensia, img, surse.md, profil.json, afirmatii.json, granița, parcurge.py).

- **Puncte: 18** (13 de la opus, A-M, 6 dintre ele dubluri cu sonnet: A = S2, B = S1, D = L1, E = E1, F = D1, G = I1; 5 doar de la sonnet: A1-A4, E2) — **reparate 18, respinse 0.**
- **Durata (hotărârea 6), metoda judecătorului opus** (`_verificare\j1_durata.py` copiat NESCHIMBAT în `_proba\durata_r1\<nou|inainte>\`, sha1 8ab7e39e; `_proba\durata_r1.py`): lentul (80 cuv./min, laborator PC) **57,5 → 57,3**; **cu supapa (întrebările ora viitoare) 50,1 → 49,9**; la 110 cuv./min 49,1 → 48,9; telefon fără laborator (Dumbrava) 50,8 → 50,3 (cu supapa 43,4 → 42,9). Cuvinte pe drumul obligatoriu 2.475 → 2.456. Adăugat: compilatorul, `;` după for, metoda acoladelor, `int a, b;`, de ce `int v[100]`, testul capetelor, telefonul (rândul lung, punctul roșu), tabelul tastelor, fereastra necunoscută, Ctrl+S, „mai așteaptă un număr”. Tăiat din CITIT (nu din ce se predă): fraza despre C++ / Code::Blocks din P1 (mutată, mai scurt, la P2 și la caseta de laborator), propoziții de legătură, rezumatele de după „Corect”, numele testelor, introducerea laboratorului, pasul „Dacă mai ai timp” al laboratorului, legendele capturilor, bara de semne repetată (rămâne la P3 Încearcă, prima scriere de semne).
- Porțile după ultima schimbare: §7.
