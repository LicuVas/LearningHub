# Verificarea lecției viii-m1-l04

- lecția: `C:\00\Projects\LearningHub\lectii\viii\m1-l04\index.html`
- clasa a VIII-a, lecția 4 din plan: „Adresa de celulă. Selectare, copiere, mutare, ștergere” (M1, VIII-U1)
- nivelul din pagină: „Adresa de celulă. Selectare, copiere, mutare, ștergere” · lectii declarate: [4]
- rulat: 2026-09-27 18:31 · durata: 0.3 min · cost `claude -p`: 1.391 USD (generator 0.226 + cititori 1.165)

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

## T1 — plimbarea (cititori cu carte închisă; rulare refolosită)

**Blochează publicarea:** nimic

- numărul kitului e 4; numărul liniei e 0 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «copierea» — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»; «mutarea» — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»; «selectarea» — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»; «ștergerea» — «Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.»

Rulări: seed 7 → 4 (1.1653 USD)
Canar: «Aici Lipire (Paste) e gri: încă nu era nimic copiat.» → «Aici Lipire (Paste) e albastru: încă nu era nimic copiat.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | Butonul Lipire (Paste) e albastru când încă nu era nimic copiat. |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Lecția 4 vorbește despre selectare, copiere, mutare și ștergere. Nu conține nicio parte despre 'tabel pivot dinamic'. |
| S-1 | Pasul 2 | FACUT | H20. Regula formatului: litera coloanei, lipita de numarul randului. Coloana H si randul 20 dau H20, niciodata 20H sau cu tireata. |
| S-2 | Pasul 3 | FACUT | Apeși pe D2, ții apăsat și tragi până la F6; abia acolo dai drumul. Caseta de nume arată D2 (adresa celulei active, de unde ai pornit). Zona D2:F6 are 15 celul… |
| S-3 | Pasul 4 | FACUT | 1. Apeși pe B2, ții apăsat și tragi până la C3, apoi dai drumul - selectezi zona. 2. Apeși Ctrl+C: ții apăsată tasta Ctrl din stânga-jos și apeși o dată C. În … |
| S-4 | Pasul 6 | FACUT | Ctrl+X |
| S-5 | Pasul 7 | FACUT | Clic pe D6 (selectezi), apeși tasta Delete. D7 rămâne neschimbată ('nimic nu urcă'). Dacă apeși Ctrl+Z (sau butonul Anulare), textul din D6 revine, fiindcă com… |
| S-6 | Pasul 8 | FACUT | 1. Clic dreapta pe numărul rândului 7, în stânga (pe cifra din stânga, nu pe o celulă). 2. Aleq din meniu comanda Ștergere (Delete). 3. Rândul dispare, iar rân… |
| S-7 | Atelier | FACUT | 1) Clic dreapta pe cifra 5 (rândul Marker), apoi Ștergere (Delete) din meniu; rândul dispare și Elena urcă pe rândul 4. 2) Selectez A1:C4 trăgând de la A1 la C… |
| S-8 | Provocarea (Acum în aplicația adevărată) | FACUT | Elevul de pe rândul 4 urcă pe rândul 3 în ambele tabele (A și G). Comanda folosită: clic dreapta pe numărul rândului 3, apoi Ștergere (Delete). Regula: rândul … |
| S-9 | toată lecția, de la Pasul 1 la Verificare | FACUT | Am parcurs lecția pas cu pas de la Pasul 1 la Verificare. Fiecare pas are instrucțiuni clare, observații vizuale și explicații ale efectelor. Pasul 1 e doar in… |
| S-10 | toată lecția | FACUT | Am învățat să lucrez cu celule în Excel folosind adrese precise. Adresa celulei se scrie cu litera coloanei apoi numărul rândului, de exemplu C4, și caseta de … |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 TRECUT · T1 TRECUT
BLOCHEAZĂ PUBLICAREA: 0 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\viii-m1-l04\raport.md)
0
