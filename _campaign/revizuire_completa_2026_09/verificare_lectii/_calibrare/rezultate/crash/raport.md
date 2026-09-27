# Verificarea lecției crash

- lecția: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\control\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 18:33 · durata: 0.2 min · cost `claude -p`: 0.0 USD

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

**Blochează publicarea:** 1
- T0 s-a oprit cu o eroare: PermissionError: [Errno 32] The process cannot access the file because it is being used by another process

(detaliile treptei T0 lipsesc: KeyError: 'glosar')

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 PICAT 1 · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 1 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\crash\raport.md)
1
