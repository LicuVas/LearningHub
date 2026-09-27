# Verificarea lecției vii-m1-l04

- lecția: `C:\00\Projects\LearningHub\lectii\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 17:55 · durata: 7.4 min · cost `claude -p`: 1.222 USD (generator 0.129 + cititori 1.093)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | TRECUT | 0 |
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

**Blochează publicarea:** nimic

- avertisment: densitate fără verdict @ 50_antet.md: doar 3 propoziții (< 10); oracolul spunea: media 28 cuvinte/propoziție (prag 22); 67% propoziții peste 25 cuvinte (prag 30%)
- 4 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): obiecte într-un document ← programa lecției: Obiecte într-un document: text, imagini, tabele; obiect ← marcat în pași (<mark>); cursorul ← marcat în pași (<mark>); paragrafe ← marcat în pași (<mark>); insera ← marcat în pași (<mark>); tabel ← marcat în pași (<mark>); celulă ← marcat în pași (<mark>); grilă ← marcat în pași (<mark>); formatare ← lecția viitoare 6 („Formatarea textului și a paragrafului”); dimensiune pagină ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune font ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune imagine ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); format tabel ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); gestionarea unei aplicații audio ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); audio-video ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea și redarea sunetelor ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); selecția ← lecția viitoare 13 („Selecția secvențelor: ștergere, copiere, mutare. Mixarea semnalului audio”); suprapunere ← lecția viitoare 15 („Generice: suprapunerea textului peste scene”); accesare/conectare în aplicația colaborativă ← lecția viitoare 18 („Ce este o aplicație colaborativă. Accesare și conectare”); date numerice ← lecția viitoare 23 („Analiza enunțului unei probleme: date de intrare, date de ieșire, operații”); rulare ← lecția viitoare 24 („Mediul de programare: editare, rulare, depanare. Structura unui program”); lipire specială ← lecția viitoare 5 („Operații de editare: copiere, mutare, ștergere”; definiție în materialele cursului); aliniere ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); indentare ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între rânduri ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între paragrafe ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); margini paginii ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului)

Programa legată de lecție: Obiecte într-un document: text, imagini, tabele

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea (cititori cu carte închisă, haiku)

**Blochează publicarea:** 1
- teach-back LIPSA la 2 cititori: obiectivul din programă «Elevul poate spune cum decide ce obiect (text, imagine sau tabel) să folosească într-un document, după ce vrea să afle cititorul.»

- avertisment: obiective de PERFORMANȚĂ (nu se notează din teach-back; le verifică exercițiile/atelierul (S) și aplicația reală (R)): Elevul inserează într-un document text, o imagine din calculator și un tabel, la locul potrivit. | Elevul scrie date în celulele unui tabel, trecând de la o celulă la alta.
- avertisment: obiective din programă pe care lecția de azi NU le predă (de verificat în plan, nu blochează): Elevul formatează text, imagine sau tabel (dimensiune font, aliniere, margini) — nu se predă în lecția de azi, ci în le…
- avertisment: blocaj «grilă» pe propoziția care introduce termenul (îngroșat acolo), sarcina FACUT: introdus fără definiție explicită? — «Se deschide o **grilă** de pătrățele.»
- numărul kitului e 4; numărul liniei e 1 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «obiecte» — «din ce **obiecte** e făcut un document Word — text, imagini, tabele — și le pui chiar tu»
- generator: încercarea 1: cod 0, 74.9 s, JSON valid

Rulări: seed 7 → 4 (1.093 USD)
Canar: «Tasta ⌫ (Backspace) șterge litera din stânga cursorului.» → «Tasta ⌫ (Backspace) șterge litera din dreapta cursorului.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | Tasta ⌫ (Backspace) șterge litera din dreapta cursorului. |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Termenul 'tabel pivot dinamic' nu apare în lecție. |
| S-1 | Pasul 3 | FACUT | Apeși Enter, apoi tastezi Luăm cărți noi. |
| S-2 | Pasul 4 | FACUT | Faci loc: clic la capătul paragrafului, apoi Enter. Pe fila Inserare apeși Imagini. Se deschide un meniu; alegi Acest dispozitiv…. În fereastră alegi întâi fol… |
| S-3 | Pasul 6 | FACUT | Dai clic la capătul paragrafului «Notele mele:». Pe fila Inserare (Insert) apeși Tabel (Table). Se deschide o grilă de pătrățele. Treci cu mouse-ul peste grilă… |
| S-4 | Atelierul | FACUT | Pașii pentru referat: 1. Paragraful despre casă: tastezi text; este o explicație. 2. Imaginea casa.png: clic la capătul paragrafului, Enter, fila Inserare › Im… |
| S-5 | Acum în aplicația adevărată | FACUT | Dă clic la capătul ultimei propoziții și apasă Enter. Dă clic pe fila Inserare (Insert), apasă Imagini (Pictures), alegi din meniu Acest dispozitiv... (This De… |
| S-6 | Pasul 2 | FACUT | Alegi o imagine, pentru că nu scrii în ea, doar o privești. |
| S-7 | Pasul 5 | FACUT | Tabelul are 3 coloane și 6 rânduri. Coloane: Numele, Sportul, Vârsta (3 informații despre un sportiv). Rânduri: 5 sportivi plus 1 rând sus pentru numele coloan… |
| S-8 | Verificare | FACUT | poza se lipește la capătul textului, pe același rând |
| S-9 | toată lecția | FACUT | Parcurg lecția de la Pasul 1 la Verificare. Pentru fiecare pas, înțeleg ce trebuie să fac și efectul promis. Pașii 1, 2, 5 sunt teoretici cu exerciții alegere … |
| S-TB1 | toată lecția | FACUT | Documentul e făcut din trei obiecte: text (literele pe care le tastezi), imagine (o fotografie pe care nu scrii) și tabel (căsuțe pe rânduri și coloane). Curso… |
| S-TB2 | toată lecția | FACUT | Un document Word se face din obiecte — text pe care-l tastezi, imagini pe care le alegi din calculator și tabele cu căsuțe pentru date. Textul se împarte în pa… |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 PICAT 1
BLOCHEAZĂ PUBLICAREA: 1 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\vii-m1-l04\raport.md)
1
