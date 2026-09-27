# Verificarea lecției v-m1-l05

- lecția: `C:\00\Projects\LearningHub\lectii\v\m1-l05\index.html`
- clasa a V-a, lecția 5 din plan: „Dispozitive de intrare, de ieșire și de intrare-ieșire” (M1, V-U1)
- nivelul din pagină: „Dispozitive de intrare, de ieșire și de intrare-ieșire” · lectii declarate: [5]
- rulat: 2026-09-27 17:55 · durata: 0.2 min · cost `claude -p`: 0.0 USD

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
- aproape identică (nu blochează; de refăcut ca variantă-soră): Î4 ~ P6 Încearcă (același text, alt răspuns, asemănare 1.0): «Ce dispozitiv folosești ca să faci fiecare treabă? Leagă.» / «Ce dispozitiv folosești ca să faci fiecare treabă? Leagă.»

## S2 — practică: aplicare/execuție vs. recunoaștere

**Blochează publicarea:** nimic

Aplicare/execuție pe „Încearcă” + atelier (regula 5, blochează sub 50%): **4 din 6 (67%)** · cu „Încă un exercițiu” (doar raportat): 9 din 17 · pe tipuri: choice 6, tf 4, classify 3, fotografie 2, match 1, order 1

| Loc | Tip | Fel | Numărat la regula 5 | Notă |
|---|---|---|---|---|
| P2 Încearcă | choice | aplicare | da | răspunsul e scris dinainte în proporție de 40% |
| P2 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P2 Încă un exercițiu 2 | tf | aplicare | nu | răspunsul e scris dinainte în proporție de 40% |
| P3 Încearcă | choice | aplicare | da | răspunsul e scris dinainte în proporție de 60% |
| P3 Încă un exercițiu 1 | classify | aplicare | nu | răspunsul e scris dinainte în proporție de 53% |
| P3 Încă un exercițiu 2 | tf | aplicare | nu | răspunsul e scris dinainte în proporție de 45% |
| P4 Încearcă | fotografie | execuție | da |  |
| P4 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P4 Încă un exercițiu 2 | tf | aplicare | nu | răspunsul e scris dinainte în proporție de 29% |
| P5 Încearcă | choice | recunoaștere | da | răspunsul e scris dinainte în proporție de 100% |
| P5 Încă un exercițiu 1 | tf | recunoaștere | nu | răspunsul e scris dinainte în proporție de 57% |
| P5 Încă un exercițiu 2 | classify | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P6 Încearcă | match | recunoaștere | da | răspunsul e scris dinainte în proporție de 88% |
| P6 Încă un exercițiu 1 | choice | recunoaștere | nu | răspunsul e scris dinainte în proporție de 100% |
| P6 Încă un exercițiu 2 | order | aplicare | nu | răspunsul e scris dinainte în proporție de 83% |
| Atelier | fotografie | execuție | da |  |
| Atelier încă unul 1 | classify | recunoaștere | nu | răspunsul e scris dinainte în proporție de 85% |


felul pe conținut (regula 5): execuție = simulator; recunoaștere = răspunsul corect e deja scris într-o propoziție din pașii de până atunci sau din explicațiile de dinainte; aplicare = altfel. Numărul care blochează e pe „Încearcă” + atelier; „Încă un exercițiu” e doar raportat.

## T0 — oracol_novice (determinist)

**Blochează publicarea:** nimic

- 24 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): dispozitive de intrare ← programa lecției: Dispozitive de intrare: exemple, rol, mod de utilizare; dispozitive ← programa lecției: Dispozitive de intrare: exemple, rol, mod de utilizare; dispozitive de ieșire ← programa lecției: Dispozitive de ieșire: exemple, rol, mod de utilizare; dispozitive de intrare-ieșire ← programa lecției: Dispozitive de intrare-ieșire: exemple, rol, mod de utilizare; dispozitiv de intrare ← marcat în pași (<mark>); dispozitiv de ieșire ← marcat în pași (<mark>); bit ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); byte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); kilobyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); megabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); gigabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); terabyte ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”); servicii ale rețelei Internet ← lecția viitoare 13 („Servicii ale rețelei Internet. La ce folosește fiecare”); drepturi de autor ← lecția viitoare 15 („Salvarea informațiilor de pe Internet. Drepturile de autor”); siguranța pe Internet ← lecția viitoare 16 („Siguranța pe Internet: pericole, reguli, credibilitatea surselor”); editor ← lecția viitoare 18 („Rolul unui editor grafic. Interfața. Creare, deschidere, salvare”); selectare ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); copiere ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); mutare ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); ștergere ← lecția viitoare 19 („Selectare, copiere, mutare, ștergere. Instrumente de desenare”); redimensionarea ← lecția viitoare 20 („Redimensionare, trunchiere, rotație, panoramare”); stiluri de umplere ← lecția viitoare 21 („Culori și stiluri de umplere. Culori personalizate”); inserarea și formatarea textului ← lecția viitoare 22 („Inserarea și formatarea textului. Realizez o felicitare / un afiș”); inserarea ← lecția viitoare 22 („Inserarea și formatarea textului. Realizez o felicitare / un afiș”); noțiunea de algoritm ← lecția viitoare 24 („Ce este un algoritm. Algoritmi din viața de zi cu zi”); algoritmilor ← lecția viitoare 24 („Ce este un algoritm. Algoritmi din viața de zi cu zi”); constante și variabile ← lecția viitoare 26 („Datele: de intrare, de ieșire, de manevră. Constante și variabile”); constante ← lecția viitoare 26 („Datele: de intrare, de ieșire, de manevră. Constante și variabile”); operatori aritmetici ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); relaționali ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); logici ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); evaluarea expresiilor ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); expresii ← lecția viitoare 27 („Expresii: operatori aritmetici, relaționali, logici. Evaluarea expresiilor”); liniară ← lecția viitoare 28 („Structura secvențială (liniară). Descriere în limbaj natural”); secvențială ← lecția viitoare 28 („Structura secvențială (liniară). Descriere în limbaj natural”); decizională ← lecția viitoare 29 („Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”); alternativă ← lecția viitoare 29 („Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”); octet ← lecția viitoare 6 („Dispozitive de stocare. Unități de măsură: bit, byte, KB, MB, GB, TB”; definiție în materialele cursului)

Programa legată de lecție: Dispozitive de intrare: exemple, rol, mod de utilizare | Dispozitive de ieșire: exemple, rol, mod de utilizare | Dispozitive de intrare-ieșire: exemple, rol, mod de utilizare

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 0 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\alte_lectii\v-m1-l05\raport.md)
0
