# M — Intrebari decalate fata de atomul lor (masurare mecanica)

Script: `M_scan.py` (parsare cu `html.parser.HTMLParser`, NU regex — vezi bug-ul de mai jos).
Iesire bruta: `M_rezultat.csv` (un rand per intrebare: fisier, idx atom, sub-intrebare, eticheta, scoruri).

## Bug gasit in timpul constructiei scriptului

`data-quiz` e un ARRAY JSON care poate avea **1..N intrebari pe acelasi atom** (nu doar una).
Scripturile vechi de evaluare (`u3_potrivire.py` pe cls8, altele similare) citeau doar `[0]` —
pe `cls6/m1-prezentari/lectia2-slide-uri.html`, atomul 1 are 2 intrebari in acelasi `data-quiz`
("Ctrl+M pentru slide nou" SI "Ce este Slide Master?"), iar a doua e ratata de `[0]`. Corectat in
`M_scan.py`: se citesc toate intrebarile din array; fiecare devine un rand separat (`idx`, `sub`).

## Calibrare (10 perechi citite manual, 3 lectii + cele 2 cunoscute)

Metoda de scor: cuvinte de continut (fara diacritice, fara 50 stopwords RO, radacina = primele
6 litere) comune intre (intrebare+raspuns corect+indiciu) si textul vizibil al fiecarui atom.

- **cls5/m1-sisteme/lectia1-calculator.html** (lectie presupusa buna): 9/10 intrebari `propriu`,
  scoruri propriu 6-11 vs. vecini 0-5 — separare clara.
- **cls7/m1-word-fundamente/lectia1-interfata-word.html**: 11/11 `propriu` — separare clara.
- **cls8/m1-excel-fundamente/lectia1-interfata.html** (cunoscut stricat): scriptul a scos
  `propriu` = atomii {2,7,8,9} — **identic** cu setul gasit manual in `u3_potrivire.py`
  (`predat_in_atomul_propriu: true` la exact aceiasi 4 atomi din 9). Atomul 1 (adresa celulei)
  are scor propriu 0 vs. scor 9 la atomul 3 unde termenul chiar apare.
- **cls6/m1-prezentari/lectia2-slide-uri.html** (cunoscut stricat, "doar 1 din 10 se potriveste"):
  scriptul a scos `propriu` = **1/10** — potrivire exacta cu observatia umana din
  `F_evaluari/cls6/lectia2-slide-uri/u3_iesire.json` (`intrebari_despre_atomul_propriu: 1`).

**Prag ales:** `scor_max < 2` => `slab` (doar 9 din 3551 intrebari, 0,3% — cazuri rare unde
continutul e prea scurt/tehnic pentru cuvinte de 4+ litere). Pentru restul, eticheta = atomul cu
scor maxim (printre TOTI atomii lectiei, cu preferinta pentru cel mai apropiat la egalitate).

**Verdictul de pagina a fost SCHIMBAT fata de formularea literala din cerinta** ("decalat" =
majoritate `decalat_inainte`/`decalat_inapoi`). Motiv, vazut la calibrare: pe ambele lectii
cu adevar-de-teren cunoscut, cea mai mare parte a defectului cade in categoria `altul` (cel mai
bun atom e la 2+ pozitii distanta, nu neaparat vecinul imediat) — regula literala ar fi ratat
AMBELE cazuri cunoscute (cls8: doar 2/9 stricte; cls6: doar 2/10 stricte, desi 9/10 sunt gresite).
Semnalul care separa curat lectiile bune (90-100% propriu) de cele stricate (8-57% propriu) e
**ponderea `propriu`**. Regula folosita: **pagina = "decalat" daca `propriu` <= 50%** din
intrebarile ei. Asta e o decizie de calibrare, nu cerinta literala — semnalata explicit aici.

## Totaluri

- Lectii scanate: **525** din 531 gasite (6 nu au atomi cu `data-quiz` — pagini de tip index/recap
  fara structura de atomi; 1 fisier avea un `id="atom-repr"` netipic, gestionat cu index secvential).
- Intrebari (quiz-uri) totale: **3.551**
- `propriu`: 2.922 (**82,3%**)
- `altul` (cel mai bun match e alt atom, nu vecinul): 334 (9,4%)
- `decalat_inapoi` (best = i-1): 153 (4,3%)
- `decalat_inainte` (best = i+1, cazul nociv — elevul nu poate sti inca): 133 (3,7%)
- `slab` (nicio suprapunere utila): 9 (0,3%)
- **Total "shiftat" (altul+inapoi+inainte): 620 / 3.551 = 17,5%**
- **Pagini cu verdict DECALAT (propriu <=50%): 73 / 525 = 13,9%**

## Pagini decalate, grupate pe folder

- `tic/cls8`: 22 pagini (module: `extra-databases`, `extra-structuri-date`, `extra-subprograme`,
  **`m1-excel-fundamente`** 4/6, `m2-formule-functii`, `m3-grafice-web`, `m5-proiecte-final`)
- `tic/cls6`: 18 pagini (**`m1-prezentari`** 5/6, `m2-animatii-scratch`, `m3-algoritmi-reprezentare`,
  `m4-comunicare`, `m5-proiecte-recap`)
- `tic/cls5`: 15 pagini (`m1-sisteme` 2/6, `m2-grafice-internet`, **`m3-algoritmi`** 5/6, `m4-scratch`,
  `m5-proiect`)
- `tic/cls7`: 7 pagini (`extra-baze-date`, `extra-proiect-web`, `extra-web`, `m3-algoritmi-schema`,
  `m4-colaborare`) — **`m1-word-fundamente` = 0 pagini decalate** (vezi mai jos)
- `liceu/mat-info`: 4, `liceu/tehnologic`: 4, `liceu/artistic`: 1
- `profesional/sanitar`: 1, `profesional/maistri`: 1

(lista completa fisier-cu-fisier: `M_rezultat.csv`, coloana `label` grupata pe `fisier`)

## Cele 4 module M1 (cerute explicit)

| Modul | Lectii OK (propriu>50%) | Lectii DECALAT | Detaliu decalat (propriu/total) |
|---|---|---|---|
| `cls5/m1-sisteme` | 4/6 | 2 | lectia4-ergonomie 3/6, lectia6-proiect 3/6 |
| `cls6/m1-prezentari` | 1/6 | **5** | lectia1 2/10, lectia2 1/10, lectia3 1/12, lectia4 3/10, lectia5 3/10 (doar lectia6-proiect e curata: 15/16) |
| `cls7/m1-word-fundamente` | 6/6 | **0** | — toate 6 lectii 100% propriu (63/63 intrebari) |
| `cls8/m1-excel-fundamente` | 3/7 | 4 | lectia1 4/9, lectia2 3/7, lectia4 4/9, lectia5 4/9 (lectia3-formule e la limita: 4/7=57%, NU decalat; lectia6/7 100%) |

**Verdict M1:** `cls6/m1-prezentari` e cel mai stricat modul din tot situl (5 din 6 lectii),
`cls8/m1-excel-fundamente` la fel de grav pe lectiile de continut (4 din primele 5), `cls5/m1-sisteme`
usor afectat (2/6, scoruri joase — vezi verificarea vizuala mai jos), `cls7/m1-word-fundamente`
complet curat.

## Indiciu git blame (3 pagini stricate)

`git log --format="%h %ad %s" --date=short -- <fisier> | head -5` (fara `-L`, cum a cerut sarcina):

- **cls6/lectia2-slide-uri.html**, **cls6/lectia3-text-imagini.html**, **cls8/lectia1-interfata.html**
  au TOATE in istoric commit-ul **`6792ee9` (2026-09-04) "feat(chestionare): pornesc cele 2400 de
  chestionare tacute din 417 pagini"** — singurul commit comun, de volum mare (2400 chestionare/417
  pagini), compatibil ca sursa a atributelor `data-quiz` pe scara larga.
- Dupa el, cls6 a mai primit `a589242`/`583f4e9` (2026-09-04, "reechilibrare completa 1941 intrebari"
  / "chestionarele nu se mai ghicesc") — ajustari de raspuns-CORECT, nu de aliniere-atom (defectul
  de decalaj a supravietuit acestor treceri).
- cls8/lectia1-interfata NU are un commit echivalent de "reechilibrare" dupa `6792ee9` — a primit doar
  `567b309` (2026-06-13, o corectie mai veche, INAINTE de generarea chestionarelor) si `21b141a`
  (rezolvari model, 2026-09-05) — nimeni nu a mai atins alinierea atom-intrebare de atunci.
- **Concluzie probabila:** `6792ee9` a introdus in bloc intrebarile (posibil generate per-lectie de
  un LLM fara sa vada explicit granita fiecarui atom), iar trecerile ulterioare au reparat doar
  raspunsul corect/dificultatea, nu si care atom preda termenul intrebat.

## Verificare cu ochiul (5 pagini random din lista "decalat", 2 intrebari fiecare = 10 verificari)

1. **liceu/mat-info/cls9/lectia4-intro-python.html** — atom1 ("Hello World") intreaba despre
   `print("a","b")` → predat la atom2 ("Functia print()"): **confirmat**. atom2 intreaba despre
   `input()` → predat la atom3 ("Functia input()"): **confirmat**.
2. **tic/cls5/m1-sisteme/lectia4-ergonomie.html** — atom4 ("Riscurile ignorarii") intreaba despre
   pozitia bratelor la tastat → e continutul atomului 2 ("Postura corecta"): **confirmat**. atom5
   ("Pauze active") intreaba un scenariu cu dureri de spate/ochi obositi, care REZUMA riscurile din
   atomul 4 dar testeaza direct consecinta lipsei de pauze (chiar tema atomului 5): **discutabil —
   numar la fals-pozitiv** (un om ar putea accepta intrebarea pe atomul ei propriu).
3. **tic/cls8/m3-grafice-web/lectia4-introducere-web.html** — atom1 ("Internet=retea") cere sa
   stii diferenta Internet/Web, termen definit abia in atom2: **confirmat**. atom6 ("Domeniu") are
   o intrebare despre HTML, aproape identica cu intrebarea proprie a atomului 7 ("Ce este HTML"):
   **confirmat, cazul cel mai clar din tot esantionul** (dublura aproape literala).
4. **profesional/sanitar/.../lectia1-tipuri-structura.html** — atom2 ("Tabelul Produse") intreaba
   ce camp e CHEIE PRIMARA, termen predat abia la atom5 ("Cheia primara"): **confirmat**. atom3
   ("Tabelul Furnizori") intreaba de ce CUI e TEXT nu NUMBER — e chiar despre campul CUI din
   Furnizori, deci tematic e a lui; scorul l-a pus totusi la atomul 6 (14 vs 13, diferenta de 1
   cuvant): **fals-pozitiv** (scor prea apropiat ca sa decida).
5. **tic/cls7/extra-web/lectia4-imagini.html** — atom2 ("src=sursa") intreaba despre atributul
   `alt`, predat abia la atom3 ("alt=text alternativ"): **confirmat**. atom6 ("Imagini clickabile")
   intreaba ce format de imagine (PNG) alegi pentru fundal transparent — e continutul atomului 5
   ("Ghid de formate"): **confirmat**.

**Rata fals-pozitiv observata: 2/10 = 20%**, si ambele cazuri au in comun un scor foarte apropiat
intre atomul propriu si cel castigator (13 vs 14; 5 vs 8 dar cu tema partajata) — semn ca marja
scorului conteaza, nu doar eticheta. Pe marje mari (diferenta >3-4 cuvinte), toate cele 8 verificari
au confirmat vizual eticheta automata, inclusiv 2 cazuri de dublura aproape literala intre intrebarea
gresit-plasata si intrebarea corecta a atomului tinta (cazul HTML de mai sus).

## Fisiere

- `M_scan.py` — scriptul de masurare (citire, fara scriere pe site)
- `M_calib_test.py` — scriptul folosit pentru calibrare (3 lectii + 2 cunoscute)
- `M_rezultat.csv` — un rand per intrebare
- `M_raport.md` — acest fisier
