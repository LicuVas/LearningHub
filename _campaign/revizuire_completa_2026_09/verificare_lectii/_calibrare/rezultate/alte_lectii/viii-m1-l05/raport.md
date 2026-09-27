# Verificarea lecției viii-m1-l05

- lecția: `C:\00\Projects\LearningHub\lectii\viii\m1-l05\index.html`
- clasa a VIII-a, lecția 5 din plan: „Tipuri de date: numeric, text, dată calendaristică” (M1, VIII-U1)
- nivelul din pagină: „Tipuri de date: numeric, text, dată calendaristică” · lectii declarate: [5]
- rulat: 2026-09-27 17:56 · durata: 0.2 min · cost `claude -p`: 0.0 USD

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

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **5 din 6 (83%)** · cu „Încă un exercițiu” (doar raportat): 14 din 17 · pe tipuri: classify 2, choice 3, excelx 10, tf 2

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | classify | recunoaștere | da | răspunsul e scris dinainte în proporție de 88% |
| P2 Încă un exercițiu 1 | classify | aplicare | nu | răspunsul e scris dinainte în proporție de 70% |
| P2 Încă un exercițiu 2 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P3 Încearcă | excelx | execuție | da |  |
| P3 Încă un exercițiu 1 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P3 Încă un exercițiu 2 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 50% |
| P4 Încearcă | excelx | execuție | da |  |
| P4 Încă un exercițiu 1 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P4 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 50% |
| P5 Încearcă | excelx | execuție | da |  |
| P5 Încă un exercițiu 1 | tf | aplicare | nu | răspunsul e scris dinainte în proporție de 42% |
| P5 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 33% |
| P6 Încearcă | excelx | execuție | da |  |
| P6 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P6 Încă un exercițiu 2 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| Atelier | excelx | execuție | da |  |
| Atelier încă unul 1 | excelx | execuție | nu |  |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** 1
- [folosit înainte de definiție] virgulă — prima folosire în 51_lectia.md: «notele (și 9,5 sau 7,5, scrise cu virgulă) stau la dreapta. Nimeni nu»; definiția abia în 51_lectia.md (termenul vine din: marcat în pași (<mark>))

- 3 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): dată calendaristică ← programa lecției: Tipuri de date: numeric, text, dată calendaristică; tip de date ← marcat în pași (<mark>); numeric ← marcat în pași (<mark>); text ← marcat în pași (<mark>); virgulă ← marcat în pași (<mark>); apostrof ← marcat în pași (<mark>); aliniere conținut ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); borduri ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); culori de umplere ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); stiluri predefinite ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); formule ← lecția viitoare 7 („Formule de calcul cu operatori aritmetici”); medie aritmetică ← lecția viitoare 8 („Funcții: sumă, maxim, minim, medie aritmetică”); funcții ← lecția viitoare 8 („Funcții: sumă, maxim, minim, medie aritmetică”); sortarea ← lecția viitoare 10 („Sortarea datelor după unul sau mai multe criterii”); grafice ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); serii de date ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); securitate cibernetică ← lecția viitoare 20 („Securitate cibernetică: ce nu public niciodată pe web”); parcurgere ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); șiruri ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); numărare ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); verificare a unei proprietăți ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); algoritmi ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”)

Programa legată de lecție: Tipuri de date: numeric, text, dată calendaristică

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 PICAT 1 · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 1 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\alte_lectii\viii-m1-l05\raport.md)
1
