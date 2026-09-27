# Verificarea lecției a_termen-t1

- lecția: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\a_termen\vii\m1-l04\index.html`
- clasa a VII-a, lecția 4 din plan: „Obiecte într-un document: text, imagini, tabele” (M1, VII-U1)
- nivelul din pagină: „Obiecte într-un document: text, imagini, tabele” · lectii declarate: [4]
- rulat: 2026-09-27 18:02 · durata: 9.0 min · cost `claude -p`: 1.272 USD (generator 0.167 + cititori 1.105)

## Rezumat

| Treapta | Ce verifică | Rezultat | Blochează |
|---|---|---|---|
| S0 | poarta motorului (test_joc.py) | TRECUT | 0 |
| S1 | identitate exercițiu–verificare | TRECUT | 0 |
| S2 | practică: aplicare/execuție vs. recunoaștere | TRECUT | 0 |
| T0 | oracol_novice (determinist) | PICAT | 2 |
| T1 | plimbarea (cititori cu carte închisă, haiku) | TRECUT | 0 |

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

**Blochează publicarea:** 2
- [nedefinit nicăieri] aliniere — folosit în 51_lectia.md: «nou, **Clasa a VII-a**, cu aceeași aliniere și aceeași indentare ca ti», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului))
- [nedefinit nicăieri] indentare — folosit în 51_lectia.md: «**, cu aceeași aliniere și aceeași indentare ca titlul. Atinge titlul», dar nu am găsit o definiție (X este…, numim X…, **X**, titlu) (termenul vine din: lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului))

- avertisment: densitate fără verdict @ 50_antet.md: doar 3 propoziții (< 10); oracolul spunea: media 28 cuvinte/propoziție (prag 22); 67% propoziții peste 25 cuvinte (prag 30%)
- 4 texte alternative de poze scoase din verificare (nu sunt instrucțiuni; le găsești în `t0/imagini_alt.txt`)

Glosarul generat (termen → de unde vine): obiecte într-un document ← programa lecției: Obiecte într-un document: text, imagini, tabele; obiect ← marcat în pași (<mark>); cursorul ← marcat în pași (<mark>); paragrafe ← marcat în pași (<mark>); insera ← marcat în pași (<mark>); tabel ← marcat în pași (<mark>); celulă ← marcat în pași (<mark>); grilă ← marcat în pași (<mark>); formatare ← lecția viitoare 6 („Formatarea textului și a paragrafului”); dimensiune pagină ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune font ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); dimensiune imagine ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); format tabel ← lecția viitoare 7 („Formatarea imaginii, a tabelului și a paginii”); gestionarea unei aplicații audio ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); audio-video ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea și redarea sunetelor ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); înregistrarea ← lecția viitoare 12 („Gestionarea proiectului audio-video. Înregistrarea și redarea sunetelor”); selecția ← lecția viitoare 13 („Selecția secvențelor: ștergere, copiere, mutare. Mixarea semnalului audio”); suprapunere ← lecția viitoare 15 („Generice: suprapunerea textului peste scene”); accesare/conectare în aplicația colaborativă ← lecția viitoare 18 („Ce este o aplicație colaborativă. Accesare și conectare”); date numerice ← lecția viitoare 23 („Analiza enunțului unei probleme: date de intrare, date de ieșire, operații”); rulare ← lecția viitoare 24 („Mediul de programare: editare, rulare, depanare. Structura unui program”); lipire specială ← lecția viitoare 5 („Operații de editare: copiere, mutare, ștergere”; definiție în materialele cursului); aliniere ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); indentare ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între rânduri ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); spațiere între paragrafe ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului); margini paginii ← lecția viitoare 6 („Formatarea textului și a paragrafului”; definiție în materialele cursului)

Programa legată de lecție: Obiecte într-un document: text, imagini, tabele

Situl .md și configul: `t0/` · ieșirea completă: `t0_oracol.txt`.

## T1 — plimbarea (cititori cu carte închisă, haiku)

**Blochează publicarea:** nimic

- avertisment: obiective de PERFORMANȚĂ (nu se notează din teach-back; le verifică exercițiile/atelierul (S) și aplicația reală (R)): Introduce text, o imagine din calculator și un tabel într-un document, folosind aplicația de tehnoredactare (CS.1.1). | Elaborează un document util unei situații cotidiene (de exemplu un referat) combinând text, imagine și tabel (CS.3.1).
- avertisment: obiective din programă pe care lecția de azi NU le predă (de verificat în plan, nu blochează): Formatarea documentului (dimensiune font, aliniere, spațiere între rânduri/paragrafe, margini) ține tot de CS.1.1, dar …
- avertisment: 1 sarcini NESIGUR (fără dovadă validă sau eroare de rulare): S-4
- numărul kitului e 1; numărul liniei e 0 (diferența e explicată în avertismente și în „blocaje în antet”); blocaje citate doar din antet/„La ce folosește”: «obiecte» — «Afli din ce **obiecte** e făcut un document Word — text, imagini, tabele — și le pui chiar tu»
- generator: încercarea 1: cod 0, 107.7 s, JSON valid

Rulări: seed 7 → 1 (1.1055 USD)
Canar: «Un paragraf e bucata de text care se termină acolo unde ai apăsat tasta Enter (tasta mare…» → «Un paragraf e bucata de text care se termină acolo unde ai apăsat tasta Enter (tasta mare…» · momeală: «tabel pivot dinamic»

| Sarcină | Țintă | Verdict | Răspuns / motiv |
|---|---|---|---|
| CANAR-1 | (canar/momeală) | FACUT | sageata ↑ |
| MOMEALA-1 | (canar/momeală) | NU_GASESC | Termenul "tabel pivot dinamic" nu apare în lecția 4. Lecția tratează doar tabele simple: rânduri, coloane și celule în care se scrie. |
| S-1 | Pasul 2 | FACUT | tabel |
| S-2 | Pasul 3 | FACUT | Dai clic la capătul paragrafului, după ultima literă; apeși Enter: cursorul coboară pe un rând nou, gol; abia acum tastezi Mâine plouă. |
| S-3 | Pasul 4 | FACUT | 1. Clic la capătul paragrafului „Am vizitat muzeul.", apoi Enter. 2. Apeși pe fila Inserare (Insert), apoi pe butonul Imagini (Pictures). 3. Alegi Acest dispoz… |
| S-4 | Pasul 5 | NESIGUR | Cu regula din lecție: coloane = 3 (trei informații: Numele, Vârsta, Sportul preferat); rânduri = 5 + 1 = 6 (cinci colegi plus rândul pentru numele coloanelor). |
| S-5 | Pasul 6 | FACUT | 1. Unde apeși: Pe fila Inserare apeși Tabel. 2. Ce mărime alegi pe grilă: 3x2 (3 coloane, 2 rânduri). 3. Cu ce tastă treci: tasta Tab. |
| S-6 | Atelierul | FACUT | Pentru a obține ordinea text-poza-text-tabel, execuți în ordinea recomandată de lecție: 1. Tastezi paragraful Citesc cartea..., 2. Atinge paragraful, Enter, ta… |
| S-7 | Acum în aplicația adevărată | FACUT | 1. Clic la capătul ultimei propoziții. 2. Apasă Enter. 3. Pe fila Inserare apeși Imagini. 4. Alegi Acest dispozitiv.... 5. Dai clic pe fișierul caine.png, apoi… |
| S-8 | Pasul 3 și Pasul 5 | FACUT | În Pasul 3 la text, rând înseamnă o linie a documentului care apare după apăsarea tastei Enter - paragraful nou pe care coboară cursorul. În Pasul 5 la tabel, … |
| S-9 | toată lecția | FACUT | Am parcurs lecția de la Pasul 1 la Verificare. La fiecare pas știu ce să încerc, observ acțiunile descrise și înțeleg efectele promise. Pasul 1 explică scopul;… |
| S-TB1 | toată lecția | FACUT | Un document Word este format din trei tipuri de obiecte: text, imagini și tabele. Textul este ceea ce tastezi, imaginea este o fotografie sau un desen pe care … |
| S-TB2 | toată lecția | FACUT | Un document Word se face din trei feluri de obiecte: textul cu literele pe care le tastezi, imaginea care nu se editează și tabelul cu căsuțe. Cursorul, linia … |

Sarcinile, obiectivele (din programă), concepțiile greșite și profilul: `t1/sit/plimbare/`; verdictele: `t1/verdicte_seed*/`.

## Ce NU verifică linia asta

- R (aplicația reală): `afirmatii.json` → `python arbitru_office.py <afirmatii.json> --aplicatie excel|word|powerpoint`, rulat de dirijor.
- J (judecătorul Opus pe regulile 1-9) și capturile (`capturi_lipsa.json`, regula 4) — separat.

TREPTE: S0 TRECUT · S1 TRECUT · S2 TRECUT · T0 PICAT 2 · T1 TRECUT
BLOCHEAZĂ PUBLICAREA: 2 (raport: C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\_calibrare\rezultate\a_termen-t1\raport.md)
2
