# Verificarea lecției a_termen-t1

- lecția: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\a_termen\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 18:20 · durata: 10.5 min · cost `claude -p`: 1.332 USD (generator 0.162 + cititori 1.17)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | PICAT | 2 |
| T1 | plimbarea (cititori cu carte închisă, haiku) | PICAT | 1 |

## S0 — poarta motorului (test_joc.py)

**Blochează publicarea:** nimic

- (așteptat) 1 niveluri (obișnuit 5-8)

Ieșirea completă: `s0_test_joc.txt`.

## S1 — identitate exercițiu–verificare

**Blochează publicarea:** nimic

test_joc compară JSON-ul brut (prinde doar copia exactă); S1 compară după normalizare.

## S2 — practică: aplicare/execuție vs. recunoaștere

**Blochează publicarea:** nimic

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **5 din 6 (83%)** · cu „Încă un exercițiu” (doar raportat): 13 din 17 · pe tipuri: classify 2, choice 6, wordobj 8, tf 1

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | classify | recunoaștere | da | răspunsul e scris dinainte în proporție de 87% |
| P2 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P2 Încă un exercițiu 2 | classify | aplicare | nu | răspunsul e scris dinainte în proporție de 45% |
| P3 Încearcă | wordobj | execuție | da |  |
| P3 Încă un exercițiu 1 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 60% |
| P3 Încă un exercițiu 2 | wordobj | execuție | nu |  |
| P4 Încearcă | wordobj | execuție | da |  |
| P4 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P4 Încă un exercițiu 2 | wordobj | execuție | nu |  |
| P5 Încearcă | choice | aplicare | da | răspunsul e scris dinainte în proporție de 75% |
| P5 Încă un exercițiu 1 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 50% |
| P5 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 0% |
| P6 Încearcă | wordobj | execuție | da |  |
| P6 Încă un exercițiu 1 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 75% |
| P6 Încă un exercițiu 2 | wordobj | execuție | nu |  |
| Atelier | wordobj | execuție | da |  |
| Atelier încă unul 1 | wordobj | execuție | nu |  |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** 2
- [nedefinit nicăieri] aliniere — folosit în 51_lectia.md: «nou, **Clasa a VII-a**, cu aceeași aliniere și aceeași indentare ca ti», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului))
- [nedefinit nicăieri] indentare — folosit în 51_lectia.md: «**, cu aceeași aliniere și aceeași indentare ca titlul. Atinge titlul», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului))

- avertisment: densitate fără verdict @ 50_antet.md: doar 3 propoziții (< 10); oracolul spunea: media 28 cuvinte/propoziție (prag 22); 67% propoziții peste 25 cuvinte (prag 30%)
- 4 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): obiecte într-un document ← programa lecției: Obiecte într-un document: text, imagini, tabele; obiect ← marcat în pași (<mark>); cursorul ← marcat în pași (<mark>); paragrafe ← marcat în pași (<mark>); insera ← marcat în pași (<mark>); tabel ← marcat în pași (<mark>); celulă ← marcat în pași (<mark>); grilă ← marcat în pași (<mark>); formatare ← lecția viitoare 6 („Formatarea textului și a paragrafului”); dimensiune pagină ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune font ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune imagine ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); format tabel ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); gestionarea unei aplicații audio ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); audio-video ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea și redarea sunetelor ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); selecția ← lecția viitoare 13 („Selecția secvențelor: ștergere, copiere, mutare. Mixarea semnalului audio”); suprapunere ← lecția viitoare 15 („Generice: suprapunerea textului peste scene”); accesare/conectare în aplicația colaborativă ← lecția viitoare 18 („Ce este o aplicație colaborativă. Accesare și conectare”); date numerice ← lecția viitoare 23 („Analiza enunțului unei probleme: date de intrare, date de ieșire, operații”); rulare ← lecția viitoare 24 („Mediul de programare: editare, rulare, depanare. Structura unui program”); lipire specială ← lecția viitoare 5 („Operații de editare: copiere, mutare, ștergere”; definiție în materialele cursului); aliniere ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); indentare ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între rânduri ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între paragrafe ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); margini paginii ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului)

Programa legată de lecție: Obiecte într-un document: text, imagini, tabele

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea (cititori cu carte închisă, haiku)

**Blochează publicarea:** 1
- S-7 [Acum în aplicația adevărată] NEFACUT: Lecția recomandă explicit: "scrie întâi tot textul, apoi pune poza la urmă". Pentru sarcina care cere (poza între propoziții și text, apoi tabel), lecția nu descrie cum inserezi o imagine în mijlocul unui document și cum se comportă textul scris după inserare. — citat: «Sfat: scrie întâi tot textul, apoi pune poza la urmă, pe un rând gol făcut cu Enter între paragrafe. O poză adevărată e mare, ocupă tot rândul, iar după ea e greu să mai pui cursorul.»

- avertisment: obiective de PERFORMANȚĂ (nu se notează din teach-back; le verifică exercițiile/atelierul (S) și aplicația reală (R)): Elevul inserează într-un document de tip editor de texte o imagine dintr-un fișier salvat pe calculator, la locul potri… | Elevul inserează un tabel cu numărul corect de rânduri și coloane și completează celulele lui cu date (CS.1.1). | Elevul elaborează un document simplu (de exemplu un referat) care combină text, imagine și tabel, ca document util într…
- avertisment: 1 sarcini NESIGUR (fără dovadă validă sau eroare de rulare): S-1
- numărul kitului e 3; numărul liniei e 1 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «meniu» — «Meniul de la cantină are numele felurilor scrise cu litere, o poză cu mâncarea»; «obiecte» — «Afli din ce **obiecte** e făcut un document Word — text, imagini, tabele — și le pui chiar tu»
- generator: încercarea 1: cod 0, 120.3 s, JSON valid

Rulări: seed 7 → 3 (1.17 USD)
Canar: «Ai greșit o literă? Tasta ⌫ (Backspace) șterge litera din stânga cursorului.» → «Ai greșit o literă? Tasta ⌫ (Backspace) șterge litera din dreapta cursorului.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | din dreapta cursorului |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Expresia 'tabel pivot dinamic' nu apare în lecție. Lecția tratează obiecte într-un document (text, imagini, tabele simple), dar nu menționează tabele pivot sau… |
| S-1 | Pasul 2 | NESIGUR | Pentru notele a 5 colegi la 2 materii aleg tabel, pentru cum arată telescopul aleg imagine, pentru de ce îi place astronomia aleg text. Lecția spune: Alegi obi… |
| S-2 | Pasul 3 | FACUT | 1. Dai clic la capătul paragrafului "Astăzi e senin.", după ultima literă (punctul). 2. Apeși Enter (tasta mare cu săgeata ↵): cursorul coboară pe un rând nou,… |
| S-3 | Pasul 4 | FACUT | Pasul 1 - Ce faci ÎNAINTE: Atinge paragraful (clic la capătul lui) și apasă Enter pentru a face loc pe un rând nou. Pasul 2 - Ce apeși pe PANGLICĂ: Pe fila Ins… |
| S-4 | Pasul 5 | FACUT | 3 coloane (pentru Nume, Sportul preferat și Orașul natal), 8 rânduri (7 colegi + 1 rând pentru numele coloanelor), 24 celule în total (8 rânduri × 3 coloane). |
| S-5 | Pasul 6 | FACUT | 1. Apeși pe fila Inserare (Insert), apoi apeși Tabel (Table). 2. Se deschide o grilă de pătrățele; deasupra ei scrie mărimea 3x2 (3 coloane și 2 rânduri). Dai … |
| S-6 | Atelierul | FACUT | Pași în ordinea corectă: (1) Tastez 'Am o bicicletă roșie.' și apasă Enter — cursorul coboară pe rând gol. (2) Tastez 'Ce port cu mine:' și apasă Enter — curso… |
| S-7 | Acum în aplicația adevărată | NEFACUT | Lecția recomandă explicit: "scrie întâi tot textul, apoi pune poza la urmă". Pentru sarcina care cere (poza între propoziții și text, apoi tabel), lecția nu de… |
| S-8 | toată lecția | FACUT | Parcurs toată lecția pas cu pas, de la introducere la Verificare. Toți pașii sunt clari: Pasul 1 e o introducție despre obiecte, Pasul 2 explică clasificarea (… |
| S-TB1 | toată lecția | FACUT | Un document în Word e făcut din obiecte, iar fiecare bucată dintr-un document se numește obiect. Avem trei tipuri de obiecte: textul, care sunt literele pe car… |
| S-TB2 | toată lecția | FACUT | Fiecare bucată dintr-un document se numește obiect și sunt trei feluri: textul pe care-l tastezi, imaginea pe care o privești, și tabelul cu căsuțe pe rânduri … |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 PICAT 2 · T1 PICAT 1
BLOCHEAZĂ PUBLICAREA: 3 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\a_termen-t1\raport.md)
3
