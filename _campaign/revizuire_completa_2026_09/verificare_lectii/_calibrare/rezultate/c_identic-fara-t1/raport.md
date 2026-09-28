# Verificarea lecției c_identic-fara-t1

- lecția: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\c_identic\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 19:22 · durata: 0.3 min · cost `claude -p`: 0.0 USD

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | PICAT | 0 |
| S1 | identitate exercițiu–verificare | PICAT | 1 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | TRECUT | 0 |
| T1 | plimbarea | NERULAT | 0 |

## S0 — poarta motorului (test_joc.py)

**Blochează publicarea:** nimic

Prinse de test_joc ca identice (numărate la S1): N1Î1: întrebarea de verificare e IDENTICĂ cu un exercițiu din pași/atelier (se trece din memorie; fă o variantă-soră: același concept, alte date/context)

- (așteptat) 1 niveluri (obișnuit 5-8)

Ieșirea completă: `s0_test_joc.txt`.

## S1 — identitate exercițiu–verificare

**Blochează publicarea:** 1
- Î1 = P2 Încă un exercițiu 1: «Vrei ca un coleg să vadă cum arată barajul de la Bicaz. Ce obiect pui în document?» (același text (după normalizare) și același răspuns/aceleași variante)

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

## T1 — plimbarea

Nerulat: --fara-t1

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 PICAT 0 · S1 PICAT 1 · S2 TRECUT · T0 TRECUT · T1 NERULAT
BLOCHEAZĂ PUBLICAREA: 1 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\c_identic-fara-t1\raport.md)
1
