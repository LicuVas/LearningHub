# K — Rezolvari model care nu se potrivesc cu cerinta (scanare pe tot LearningHub)

Masuratoare mecanica: overlap de cuvinte de continut (fara diacritice, lowercase, >=4 litere,
fara stopwords RO) intre rezolvarea pliata ("Vezi rezolvarea") si cerinta propriului exercitiu,
plus test de "cel mai bun match" fata de celelalte exercitii de pe aceeasi pagina.
Script: `K_scan.py`. Calibrare: `K_calibrate.py`. Rezultat brut: `K_rezultat.csv`.

## Calibrare (obligatorie inainte de prag)
11 perechi CORECTE, citite manual, din 4 lectii din foldere diferite (mat-info/cls9, tic/cls5,
tic/cls6, tic/cls7) + cele 3 perechi CUNOSCUTE gresite (tic/cls8/m1-excel-fundamente/lectia1-interfata.html):

- min(overlap la cele 11 CORECTE) = **8.3%** (mat-info lectia1-intro-algoritmi, ex3 — exercitiu deschis "alege tu activitatea", rezolvarea nu repeta cuvintele cerintei, e legitim)
- max(overlap la cele 3 GRESITE) = **6.7%**
- **Prag ales: overlap < 8% => suspect** (in golul dintre 6.7 si 8.3), plus semnalul de shuffle
  (overlap propriu < overlap fata de alt exercitiu de pe pagina) — acest semnal a prins toate
  cele 3 perechi gresite din calibrare si nicio pereche buna.

## Totaluri
- Pagini de lectie scanate (fara `.bak_*`, fara `quizuri/`): **719**
- Pagini cu exercitii+rezolvare pliata: **542**
- Perechi cerinta<->rezolvare analizate: **1669**
- Perechi **suspecte**: **100** (6.0% din total)
- Pagini cu cel putin o pereche suspecta: **75** din 542 (13.8%)

## Pe folder (pagini / perechi / suspecte / pagini cu suspect)
| Folder | Pagini | Perechi | Suspecte | Pagini cu suspect |
|---|---:|---:|---:|---:|
| liceu/artistic | 54 | 163 | 5 | 5 |
| liceu/mat-info | 83 | 251 | 24 | 18 |
| liceu/militar | 21 | 63 | 0 | 0 |
| liceu/pedagogic | 21 | 63 | 1 | 1 |
| liceu/stiinte | 23 | 69 | 1 | 1 |
| liceu/tehnologic | 65 | 197 | 3 | 3 |
| liceu/umanist | 21 | 63 | 3 | 1 |
| profesional/maistri | 16 | 48 | 1 | 1 |
| profesional/sanitar | 30 | 93 | 3 | 2 |
| tic/cls5 | 55 | 170 | 15 | 14 |
| tic/cls6 | 32 | 109 | 10 | 10 |
| tic/cls7 | 67 | 215 | 25 | 13 |
| tic/cls8 | 54 | 165 | 9 | 6 |

Cele mai afectate (proportional): tic/cls6 (10/32 pagini = 31%), tic/cls7 (13/67 = 19%),
liceu/mat-info (18/83 = 22%).

## Lectiile M1 (cerute explicit)
- **cls5/m1-sisteme** (6 lectii): 1 suspect izolat — `lectia4-ergonomie.html` ex1 (9.2%, sub prag dar aproape); restul curat.
- **cls6/m1-prezentari** (6 lectii): 2 suspecte izolate — `lectia3-text-imagini.html` ex2 si `lectia4-animatii.html` ex1; restul curat (inclusiv lectia1, 4 exercitii, toate ok).
- **cls7/m1-word-fundamente** (6 lectii): **0 suspecte** — toate cele 18 perechi ok (overlap 19%-86%).
- **cls8/m1-excel-fundamente** (7 lectii): cel mai afectat modul M1 — `lectia1-interfata.html` (3/3 exercitii suspecte, cazul cunoscut/confirmat) si `lectia7-sortare.html` (2/3 suspecte: ex2 34.6%, ex3 12.5%); restul lectiilor (2,3,4,5,6) curate.

## Suspecte vs. commit 21b141a ("643 din 643 exercitii... rezolvare model")
- Suspecte pe fisiere ATINSE de 21b141a: **40**
- Suspecte pe fisiere NEATINSE de 21b141a: **60**
- Deci majoritatea perechilor suspecte (60%) sunt pe fisiere pe care acest commit nu le-a scris — fie rezolvari mai vechi (dinainte de val), fie scrise de f7bacc0 sau alt val, fie probleme preexistente. `lectia1-interfata.html` (cazul cunoscut) FACE parte din cele 40 atinse de 21b141a.

## 5 exemple suspecte, citite manual (seed=42, alegere aleatoare din cele 100)
1. **tic/cls7/m3-algoritmi-schema/lectia5-while.html ex1** (overlap 5.9%, shuffled=True) — cerinta: "afiseaza numerele de la n la 1"; rezolvarea: cod `while` care scade contorul de la n la 1 si afiseaza. **Verdict la citire: CORECT** (rezolva exact cerinta; overlap mic doar pentru ca e cod, nu proza) → **fals pozitiv**.
2. **liceu/mat-info/cls12/m-bac-prep/lectia4-recursivitate-master.html ex3** (overlap 8.8%, shuffled=True) — cerinta: analiza functiei recursive `f(n,s)` (BAC 2023); rezolvarea: traseaza exact apelurile lui `f(n,s)`, relatia de recurenta, varianta iterativa. **Verdict: CORECT** → **fals pozitiv**.
3. **liceu/artistic/cls9/m1-societate-digitala/lectia1-forme-comunicare.html ex1** (overlap 13.0%, shuffled=True) — cerinta: 5 situatii (a-e) de ales canalul de comunicare; rezolvarea trateaza exact aceleasi 5 situatii a-e (repetitia mutata, fisa de inscriere, programul concertului, discutia de o ora, intrebarea despre obiectiv). **Verdict: CORECT** → **fals pozitiv**.
4. **tic/cls8/m1-excel-fundamente/lectia1-interfata.html ex2** (overlap 6.7%, shuffled=True) — cerinta: navigare/selectare in Excel (Name Box, Ctrl+Home, Shift+Click, redenumire foi); rezolvarea: tabel Eroare/Cauza/Reparatie pentru formule gresite — **subiect complet diferit**. **Verdict: GRESIT** (cazul cunoscut) → adevarat pozitiv.
5. **liceu/umanist/cls10/m1-procesare-text/lectia2-stiluri-cuprins.html ex2** (overlap 1.8%, shuffled=False) — cerinta: cuprins automat Word (Heading 1/2, sectiune Next Page); rezolvarea: sortare/filtrare/formatare conditionala pe un tabel Excel cu 12 surse bibliografice — **subiect complet diferit (Word vs Excel)**. **Verdict: GRESIT** → adevarat pozitiv.

**Rata de fals-pozitiv pe esantionul de 5: 3/5 = 60%.**

## Interpretare (fara ornament)
Pragul lexical calibrat (< 8% sau shuffle) prinde perechile real amestecate (Excel<->Excel gresit,
Word<->Excel), dar da fals-pozitive frecvente pe: (a) exercitii de programare/cod, unde rezolvarea
e in cod/pseudocod si nu repeta cuvintele din enuntul in romana; (b) rezolvari tip "schita, nu
solutia gata facuta" care parafrazeaza deliberat cerinta ca sa nu dea raspunsul direct. Cu 60%
fals-pozitiv pe esantionul de 5, **lista de 100 de suspecti NU trebuie folosita ca lista finala de
reparat fara verificare manuala per caz** — e un semnal de triaj, nu o lista de decizie automata.
Semnalele cele mai de incredere raman cele cu overlap sub ~3% SI shuffled=True (ex: cls8 ex1/ex2/ex3,
umanist ex2) — acolo rata de fals-pozitiv observata a fost 0/2.
