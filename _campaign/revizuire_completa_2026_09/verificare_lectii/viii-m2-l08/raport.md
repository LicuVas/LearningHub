# Verificarea lecției viii-m2-l08

- lecția: `C:\00\Projects\LearningHub_tutoriale\lectii\viii\m2-l08\index.html`
- clasa a VIII-a, lecția 8 din plan: „Funcții: sumă, maxim, minim, medie aritmetică” (M2, VIII-U1)
- nivelul din pagină: „Funcții: sumă, maxim, minim, medie aritmetică” · lectii declarate: [8]
- rulat: 2026-11-07 06:51 · durata: 0.1 min · cost `claude -p`: 0.0 USD

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | TRECUT | 0 |
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

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **6 din 6 (100%)** · cu „Încă un exercițiu” (doar raportat): 15 din 18 · pe tipuri: excelx 15, choice 2, tf 1

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | excelx | execuție | da |  |
| P2 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P2 Încă un exercițiu 2 | choice | recunoaștere | nu |  |
| P3 Încearcă | excelx | execuție | da |  |
| P3 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P3 Încă un exercițiu 2 | excelx | execuție | nu |  |
| P3 Încă un exercițiu 3 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 60% |
| P4 Încearcă | excelx | execuție | da | simulator, dar răspunsul e o alegere dintre variante |
| P4 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P4 Încă un exercițiu 2 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P5 Încearcă | excelx | execuție | da |  |
| P5 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P5 Încă un exercițiu 2 | excelx | execuție | nu |  |
| P6 Încearcă | excelx | execuție | da |  |
| P6 Încă un exercițiu 1 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P6 Încă un exercițiu 2 | excelx | execuție | nu |  |
| Atelier | excelx | execuție | da |  |
| Atelier încă unul 1 | excelx | execuție | nu |  |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** nimic

- avertisment: densitate fără verdict @ 50_antet.md: doar 6 propoziții (< 10); oracolul spunea: media 31 cuvinte/propoziție (prag 22); 50% propoziții peste 25 cuvinte (prag 30%)
- 11 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): medie aritmetică ← programa lecției: Funcții specifice aplicației de calcul tabelar pentru sumă, maxim, minim, medie aritmetică și decizie; funcții ← programa lecției: Funcții specifice aplicației de calcul tabelar pentru sumă, maxim, minim, medie aritmetică și decizie; argument ← marcat în pași (<mark>); media aritmetică ← marcat în pași (<mark>); mânerul de umplere ← marcat în pași (<mark>); sortarea ← lecția viitoare 10 („Sortarea datelor după unul sau mai multe criterii”); grafice ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); serii de date ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); securitate cibernetică ← lecția viitoare 20 („Securitate cibernetică: ce nu public niciodată pe web”); parcurgere ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); șiruri ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); numărare ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); verificare a unei proprietăți ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); algoritmi ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”)

Programa legată de lecție: Funcții specifice aplicației de calcul tabelar pentru sumă, maxim, minim, medie aritmetică și decizie

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 0 (raport: C:\00\Projects\LearningHub_tutoriale\_campaign\revizuire_completa_2026_09\verificare_lectii\viii-m2-l08\raport.md)
0
