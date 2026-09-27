# Verificarea lecției viii-m1-l04-proba

- lecția: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_proba\viii\m1-l04-proba\index.html`
- clasa a VIII-a, lecția 4 din plan: „Adresa de celulă. Selectare, copiere, mutare, ștergere” (M1, VIII-U1)
- nivelul din pagină: „Selectare, copiere, mutare, ștergere” · lectii declarate: [4]
- rulat: 2026-09-27 16:41 · durata: 9.4 min · cost `claude -p`: 1.193 USD (generator 0.215 + cititori 0.978)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | PICAT | 1 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | PICAT | 2 |
| T1 | plimbarea (cititori cu carte închisă, haiku) | PICAT | 3 |

## S0 — poarta motorului (test_joc.py)

**Blochează publicarea:** nimic

- (așteptat) 1 niveluri (obișnuit 5-8)

Ieșirea completă: `s0_test_joc.txt`.

## S1 — identitate exercițiu–verificare

**Blochează publicarea:** 1
- Î2 = P1 Încă un exercițiu 2: «Selectează zona B2:C4: apasă pe un colț, apoi pe colțul opus.» (același text (după normalizare) și același răspuns/aceleași variante)

test_joc compară JSON-ul brut (prinde doar copia exactă); S1 compară după normalizare.

## S2 — practică: aplicare/execuție vs. recunoaștere

**Blochează publicarea:** nimic

Execuție/aplicare: **8 din 15 (53%)** · pe tipuri: choice 4, pick 1, excel 8, tf 1, match 1

| Loc | Tip | Fel | Notă |
|---|---|---|---|
| P1 Încearcă | choice | recunoaștere |  |
| P1 Încă un exercițiu 1 | choice | recunoaștere |  |
| P1 Încă un exercițiu 2 | pick | recunoaștere |  |
| P2 Încearcă | excel | execuție |  |
| P2 Încă un exercițiu 1 | excel | execuție | simulator, dar răspunsul e o alegere dintre variante |
| P3 Încearcă | excel | execuție |  |
| P3 Încă un exercițiu 1 | choice | recunoaștere |  |
| P4 Încearcă | choice | recunoaștere |  |
| P4 Încă un exercițiu 1 | excel | execuție |  |
| P5 Încearcă | excel | execuție |  |
| P5 Încă un exercițiu 1 | tf | recunoaștere |  |
| P5 Încă un exercițiu 2 | match | recunoaștere |  |
| Atelier | excel | execuție |  |
| Atelier încă unul 1 | excel | execuție |  |
| Atelier încă unul 2 | excel | execuție |  |


clasificare pe tip (recunoaștere = choice/tf/match/order/classify/pick/hunt; execuție = simulator).

## T0 — oracol_novice (determinist)

**Blochează publicarea:** 2
- [nedefinit nicăieri] borduri — folosit în 51_lectia.md: «e (Fill Color). Selectează A1:F4 → Borduri (Borders) → Toate bordurile», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”))
- [nedefinit nicăieri] sortarea — folosit în 51_lectia.md: «o celulă din tabel → Date (Data) → Sortare (Sort) → Sortare după Creșt», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 10 („Sortarea datelor după unul sau mai multe criterii”))

Glosarul generat (termen → de unde vine): selectare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); copiere ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); mutare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); ștergere ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); editare ← programa lecției: Operații de editare (selectare, copiere, mutare, ștergere); foaie de calcul ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); coloană ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); rând ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); celulă ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); adresă de celulă ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); registru ← programa lecției: Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă); zonă ← marcat în pași (<mark>); celula activă ← marcat în pași (<mark>); anulează ← marcat în pași (<mark>); dată calendaristică ← lecția viitoare 5 („Tipuri de date: numeric, text, dată calendaristică”); formatare ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); aliniere conținut ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); borduri ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); culori de umplere ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); stiluri predefinite ← lecția viitoare 6 („Formatarea rândurilor, a coloanelor și a celulelor”); formule ← lecția viitoare 7 („Formule de calcul cu operatori aritmetici”); medie aritmetică ← lecția viitoare 7 („Formule de calcul cu operatori aritmetici”); funcții ← lecția viitoare 8 („Funcții: sumă, maxim, minim, medie aritmetică”); sortarea ← lecția viitoare 10 („Sortarea datelor după unul sau mai multe criterii”); grafice ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); serii de date ← lecția viitoare 11 („Grafice: tipuri de grafice și serii de date”); editor ← lecția viitoare 14 („Cum e făcută o pagină web. Interfața editorului de pagini web”); antet ← lecția viitoare 15 („Elemente de structură: antet, titlu, corp”); securitate cibernetică ← lecția viitoare 20 („Securitate cibernetică: ce nu public niciodată pe web”); securitate ← lecția viitoare 20 („Securitate cibernetică: ce nu public niciodată pe web”); parcurgere ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); șiruri ← lecția viitoare 24 („Operații cu șiruri: citire, afișare, parcurgere”); numărare ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); verificare a unei proprietăți ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”); algoritmi ← lecția viitoare 25 („Algoritmul de numărare a elementelor cu o proprietate”)

Programa legată de lecție: Operații de editare (selectare, copiere, mutare, ștergere) | Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă)

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea (cititori cu carte închisă, haiku)

**Blochează publicarea:** 3
- S-3 [Pasul 3 (Copierea)] NEFACUT: Textul nu precizează cum CONFIRMI (ce se vede pe ecran) unii pași. Pașii sunt: selectează A1:B2, Ctrl+C (confirmație: marginea punctată apare), clic pe F5, Ctrl+V, zona originală rămâne neschimbată. Dar lipsă: cum confirmi că ai clicat corect pe F5? Cum confirmi că Ctrl+V a funcționat vizual? — citat: «Copierea face un duplicat: originalul rămâne unde era.»
- blocaj «anulează» (×1): termen folosit înainte de explicație — «Ștergerea și Anularea»
- blocaj «ștergere» (×1): termen folosit înainte de explicație — «Ștergerea și Anularea»

- avertisment: 2 sarcini NESIGUR (fără dovadă validă sau eroare de rulare): S-7, S-8
- generator: încercarea 1: cod 0, 256.5 s, JSON valid

Rulări: seed 7 → 3 (0.9775 USD)
Canar: «Marginea punctată dispare cu Esc.» → «Marginea punctată dispare cu F5.» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | F5 |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Lecția 4 nu conține o secțiune despre 'tabel pivot dinamic'. |
| S-1 | Pasul 1 (Zona de celule) | FACUT | Zona E3:G6 are 12 celule. Am obținut numărul numărând coloanele (E, F, G = 3) și rândurile (3, 4, 5, 6 = 4), apoi înmulțind: 3 × 4 = 12. |
| S-2 | Pasul 2 (Cum selectezi) | FACUT | Pe D3 apeși, ții apăsat și tragi până la F5. Caseta de nume arată D3. (Alternativ: clic pe D3, apoi Shift+clic pe F5 - caseta arată tot D3) |
| S-3 | Pasul 3 (Copierea) | NEFACUT | Textul nu precizează cum CONFIRMI (ce se vede pe ecran) unii pași. Pașii sunt: selectează A1:B2, Ctrl+C (confirmație: marginea punctată apare), clic pe F5, Ctr… |
| S-4 | Pasul 4 (Mutarea) | FACUT | Pașii în ordine: 1. Selectez C1:C3, 2. Apas Ctrl+X, 3. Clic pe H1, 4. Apas Ctrl+V. Aleg mutarea pentru că 'datele pleacă de unde erau și ajung în locul nou' - … |
| S-5 | Pasul 5 (Ștergerea și Anularea) | FACUT | (b) le golește și le lasă pe loc |
| S-6 | Atelierul (Reorganizează tabelul) | FACUT | 1. Selectezi zona A1:B3: "apeși pe primul colț și, cu butonul mouse-ului ținut apăsat, **tragi** până la colțul opus". Confirmă: zona se colorează și caseta de… |
| S-7 | Provocarea (Acum în aplicația adevărată) | NESIGUR | Lecția nu explică cum se scrie o formulă de diferență pentru altă pereche de coloane (spune doar D2-B2 ca exemplu). De asemenea, nu definește „mânerul de umpli… |
| S-8 | Toată lecția, de la Pasul 1 la Verificare | NESIGUR | Lecția nu poate fi parcursă complet de un elev nou. Pasul 1, exercițiul 3 (varianta 2) cere selectare într-o simulare, dar nu spune ce efect se observ pe ecran… |
| S-9 | Toată lecția (rezumat) | FACUT | O zonă e un dreptunghi de celule pe care îl scrii cu adresa colțului din stânga-sus, două puncte, și adresa colțului din dreapta-jos. Pentru a selecta o zonă, … |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 PICAT 1 · S2 TRECUT · T0 PICAT 2 · T1 PICAT 3
BLOCHEAZĂ PUBLICAREA: 6 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\viii-m1-l04-proba\raport.md)
6
