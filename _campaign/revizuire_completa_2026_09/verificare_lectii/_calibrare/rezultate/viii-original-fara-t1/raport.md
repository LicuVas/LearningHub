# Verificarea lecției viii-original-fara-t1

- lecția: `C:\00\Projects\LearningHub\lectii\viii\m1-l04\index.html`
- clasa a VIII-a, lecția 4 din plan: „Adresa de celulă. Selectare, copiere, mutare, ștergere” (M1, VIII-U1)
- nivelul din pagină: „Adresa de celulă. Selectare, copiere, mutare, ștergere” · lectii declarate: [4]
- rulat: 2026-09-27 18:32 · durata: 0.4 min · cost `claude -p`: 0.0 USD

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

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **8 din 8 (100%)** · cu „Încă un exercițiu” (doar raportat): 23 din 25 · pe tipuri: excelx 21, choice 4

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | excelx | execuție | da |  |
| P2 Încă un exercițiu 1 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P2 Încă un exercițiu 2 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 0% |
| P3 Încearcă | excelx | execuție | da |  |
| P3 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P3 Încă un exercițiu 2 | excelx | execuție | nu |  |
| P3 Încă un exercițiu 3 | choice | aplicare | nu | răspunsul e scris dinainte în proporție de 0% |
| P3 Încă un exercițiu 4 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P4 Încearcă | excelx | execuție | da |  |
| P4 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P4 Încă un exercițiu 2 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P5 Încearcă | excelx | execuție | da |  |
| P5 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P6 Încearcă | excelx | execuție | da |  |
| P6 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P6 Încă un exercițiu 2 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P6 Încă un exercițiu 3 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P7 Încearcă | excelx | execuție | da |  |
| P7 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P7 Încă un exercițiu 2 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| P8 Încearcă | excelx | execuție | da |  |
| P8 Încă un exercițiu 1 | excelx | execuție | nu |  |
| P8 Încă un exercițiu 2 | excelx | execuție | nu | simulator, dar răspunsul e o alegere dintre variante |
| Atelier | excelx | execuție | da |  |
| Atelier încă unul 1 | excelx | execuție | nu |  |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** nimic

- avertisment: densitate fără verdict @ 50_antet.md: doar 6 propoziții (< 10); oracolul spunea: 50% propoziții peste 25 cuvinte (prag 30%)
- 4 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): selectare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); copiere ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); mutare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); ștergere ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); editare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); foaie de calcul ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); coloană ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); rând ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); celulă ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); adresă de celulă ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); registru ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); selectarea ← marcat în pași (<mark>); copierea ← marcat în pași (<mark>); mutarea ← marcat în pași (<mark>); ștergerea ← marcat în pași (<mark>); Adresa ← marcat în pași (<mark>); caseta de nume ← marcat în pași (<mark>); selectezi ← marcat în pași (<mark>); zonă ← marcat în pași (<mark>); celula activă ← marcat în pași (<mark>); dată calendaristică ← lecția viitoare 5 („Tipuri de date: numeric, text, dată calendaristică”); aliniere conținut ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); borduri ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); culori de umplere ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); stiluri predefinite ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); formule ← lecția viitoare 7 („Formule de calcul cu operatori aritmetici”); medie aritmetică ← lecția viitoare 8 („Funcții: sumă, maxim, minim, medie aritmetică”); funcții ← lecția viitoare 8 („Funcții: sumă, maxim, minim, medie aritmetică”); sortarea ← lecția viitoare 10 („Sortarea datelor după unul sau mai multe criterii”); grafice ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); serii de date ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); securitate cibernetică ← lecția viitoare 20 („Securitate cibernetică: ce nu public niciodată pe web”); parcurgere ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); șiruri ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); numărare ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); verificare a unei proprietăți ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); algoritmi ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”)

Programa legată de lecție: Operații de editare (selectare, copiere, mutare, ștergere) | Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă)

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 0 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\viii-original-fara-t1\raport.md)
0
