# Verificarea lecției vii-m1-l04

- lecția: `C:\00\Projects\LearningHub\lectii\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 19:23 · durata: 0.2 min · cost `claude -p`: 1.173 USD (generator 0.149 + cititori 1.025)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | TRECUT | 0 |
| T1 | plimbarea (cititori cu carte închisă; rulare refolosită) | TRECUT | 0 |

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

## T1 — plimbarea (cititori cu carte închisă; rulare refolosită)

**Blochează publicarea:** nimic

- numărul kitului e 2; numărul liniei e 0 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «obiect» — «Afli din ce obiecte e făcut un document Word»; «obiecte» — «Afli din ce **obiecte** e făcut un document Word — text, imagini, tabele — și le pui chiar tu:»

Rulări: seed 7 → 2 (1.0246 USD)
Canar: «Tasta ⌫ (Backspace) șterge litera din stânga cursorului.» → «Tasta ⌫ (Backspace) șterge litera din dreapta cursorului.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | dreapta |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Termenul 'tabel pivot dinamic' nu apare în lecția 4 despre obiecte într-un document. |
| S-1 | Pasul 2 | FACUT | (a) imagine — cititorul trebuie să vadă cum arată; (b) tabel — date așezate ordonat în căsuțe; (c) text — o explicație |
| S-2 | Pasul 3 | FACUT | Pași pentru a adăuga „Luăm rucsacul." sub „Mergem la munte.": (1) Dai clic la capătul rândului „Mergem la munte.", după punctul final — cursorul se poziționeaz… |
| S-3 | Pasul 4 | FACUT | Pașii pentru a pune poza 'gradina-zoo.jpg' pe un rând al ei sub paragraful 'Am vizitat grădina zoologică.': (1) Clic la capătul paragrafului, apoi Enter - 'Fac… |
| S-4 | Pasul 5 | FACUT | Tabelul cu 5 colegi și 3 informații (Numele, Vârsta, Sportul preferat) are 3 coloane, 6 rânduri și 18 celule. Regula din lecție: coloane = câte informații ai d… |
| S-5 | Pasul 6 | FACUT | Pentru a insera tabelul: (1) dai clic la capătul rândului 'Meniu zilei:' (2) pe fila Inserare (Insert) apeși Tabel (Table) (3) pe grilă treci cu mouse-ul și da… |
| S-6 | Atelierul | FACUT | Referat 'Cartea mea preferată': (1) Textul paragrafului 'Cartea mea preferată este...' se tastează direct în document după deschidere. (2) Pentru imaginea cope… |
| S-7 | Acum în aplicația adevărată | FACUT | Pentru TEXT (titlu și 2-3 propoziții): tastez titlul și fiecare propoziție, apeșând Enter după fiecare pentru a crea paragrafe noi. Regula: 'Un paragraf e buca… |
| S-8 | toată lecția | FACUT | Am parcurs lecția de la Pasul 1 la Verificare. Pentru fiecare pas am identificat dacă cunosc cerința, pot observa acțiunea (în aplicația simulată sau logică) ș… |
| S-TB1 | toată lecția | FACUT | Un document Word e făcut din obiecte diferite: text pe care îl tastezi tu, imagini pe care le privești, și tabele cu căsuțe în rânduri și coloane. Alegi imagin… |
| S-TB2 | toată lecția | FACUT | Un document Word are trei feluri de obiecte: textul scris, imaginile și tabelele. Textul e împărțit în paragrafe, separate atunci când apesi tasta Enter. Curso… |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 TRECUT
BLOCHEAZĂ PUBLICAREA: 0 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\vii-m1-l04\raport.md)
0
