# Verificarea lecției vii-m1-l05

- lecția: `C:\00\Projects\LearningHub\lectii\vii\m1-l05\index.html`
- clasa a VII-a, lecția 5 din plan: „Operații de editare: copiere, mutare, ștergere” (M1, VII-U1)
- nivelul din pagină: „Operații de editare: copiere, mutare, ștergere” · lectii declarate: [5]
- rulat: 2026-09-27 17:57 · durata: 0.2 min · cost `claude -p`: 0.0 USD

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | PICAT | 1 |
| T1 | plimbarea | NERULAT | 0 |

## S0 — poarta motorului (test_joc.py)

**Blochează publicarea:** nimic

- (așteptat) 1 niveluri (obișnuit 5-8)

Ieșirea completă: `s0_test_joc.txt`.

## S1 — identitate exercițiu–verificare

**Blochează publicarea:** nimic

test_joc compară JSON-ul brut (prinde doar copia exactă); S1 compară după normalizare.

## S2 — practică: aplicare/execuție vs. recunoaștere

**Blochează publicarea:** nimic

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **6 din 6 (100%)** · cu „Încă un exercițiu” (doar raportat): 16 din 17 · pe tipuri: wordobj 11, choice 4, tf 1, order 1

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | wordobj | execuție | da |  |
| P2 Încă un exercițiu 1 | wordobj | execuție | nu |  |
| P2 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 20% |
| P3 Încearcă | wordobj | execuție | da |  |
| P3 Încă un exercițiu 1 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 0% |
| P3 Încă un exercițiu 2 | wordobj | execuție | nu |  |
| P4 Încearcă | wordobj | execuție | da |  |
| P4 Încă un exercițiu 1 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 57% |
| P4 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 67% |
| P5 Încearcă | wordobj | execuție | da |  |
| P5 Încă un exercițiu 1 | order | aplicare | nu | răspunsul e scris dinainte în proporție de 75% |
| P5 Încă un exercițiu 2 | wordobj | execuție | nu |  |
| P6 Încearcă | wordobj | execuție | da |  |
| P6 Încă un exercițiu 1 | wordobj | execuție | nu |  |
| P6 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 40% |
| Atelier | wordobj | execuție | da |  |
| Atelier încă unul 1 | wordobj | execuție | nu |  |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** 1
- [folosit înainte de definiție] anulează — prima folosire în 51_lectia.md: «; - un **clic** simplu în alt loc anulează selecția. În simulator, p»; definiția abia în 51_lectia.md (termenul vine din: marcat în pași (<mark>))

- avertisment: densitate fără verdict @ 50_antet.md: doar 5 propoziții (< 10); oracolul spunea: 40% propoziții peste 25 cuvinte (prag 30%)
- 1 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): copiere ← programa lecției: Operații de editare într-un document: copiere, mutare, ștergere; mutare ← programa lecției: Operații de editare într-un document: copiere, mutare, ștergere; ștergere ← programa lecției: Operații de editare într-un document: copiere, mutare, ștergere; editare ← programa lecției: Operații de editare într-un document: copiere, mutare, ștergere; selectezi ← marcat în pași (<mark>); anulează ← marcat în pași (<mark>); copia ← marcat în pași (<mark>); clipboard ← marcat în pași (<mark>); muta ← marcat în pași (<mark>); formatare ← lecția viitoare 6 („Formatarea textului și a paragrafului”); dimensiune pagină ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune font ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune imagine ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); format tabel ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); gestionarea unei aplicații audio ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); audio-video ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea și redarea sunetelor ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); suprapunere ← lecția viitoare 15 („Generice: suprapunerea textului peste scene”); accesare/conectare în aplicația colaborativă ← lecția viitoare 18 („Ce este o aplicație colaborativă. Accesare și conectare”); date numerice ← lecția viitoare 23 („Analiza enunțului unei probleme: date de intrare, date de ieșire, operații”); rulare ← lecția viitoare 24 („Mediul de programare: editare, rulare, depanare. Structura unui program”); aliniere ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); indentare ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între rânduri ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între paragrafe ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); margini paginii ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului)

Programa legată de lecție: Operații de editare într-un document: copiere, mutare, ștergere

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 PICAT 1 · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 1 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\alte_lectii\vii-m1-l05\raport.md)
1
