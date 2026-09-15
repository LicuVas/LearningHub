# Evaluare independentă: „Antrenament: Excel” (VIII-U1), 15.09.2026

Jocul: `C:\00\Projects\LearningHub\jocuri\excel-antrenament-viii\index.html`. E singurul fișier modificat. Copia de dinainte: `_backup_index_inainte.html`.

Dovezile:
- `recalcul.py` / `recalcul.txt`: fiecare cifră recalculată în Python, 0 greșeli;
- `formule.js` / `formule_inainte.txt` / `formule_dupa.txt`: formulele jucate cu motorul real (`evaluate` din `tip-foaie.js`) și cu aceeași verificare ca `problems()`;
- `joaca.py` / `joaca.txt`: tragerea reală și 12 foi tastate în bara fx, pe iPhone SE;
- `forma.py` / `forma_dupa.txt`: scurgerea răspunsului prin lungimea variantei;
- `bazine_inainte.json` / `bazine.json`: bazinele înainte și după;
- `surse\*.txt`: paginile Microsoft descărcate cu curl;
- `tva_art291.*`, `tva_data.*`: codul fiscal de pe disc.

## Sursele
- **Cota TVA.** Baza canonică dată de `truth.py where "cod fiscal TVA"` e dosarul contabil (`dosare\contabil\README.md`), cu corpusul `knowledge\fiscal_corpus\`. Am citit Codul fiscal consolidat ANAF: `primary_law\cod_fiscal_consolidat_anaf.html`, descărcat pe 10.08.2026, text extras în `_cache\...363a7dc60e711bde.txt`. Antetul lui: „Legea nr. 227/2015 … ultima actualizare: OUG nr. 38/2026”.
  - **Art. 291 alin. (1):** cota standard „este 21%”.
  - **Art. 291 alin. (2):** „Cota redusă de 11%” se aplică, la lit. b), pentru alimente, cu excepțiile prevăzute: alcoolul, băuturile NC 2202 și alimentele cu zahăr adăugat de cel puțin 10 g/100 g.
  - Deci caiet și pix = 21%, iar laptele simplu = 11%. **Jocul e corect.**
  - **Data aplicării:** textul de pe disc arată că modificarea vine din **Legea nr. 141/2025**. Singura dată de lângă art. 291 e din art. III al acestei legi, care folosește perioada „1 august 2025 – 31 iulie 2026” (regimul tranzitoriu de 9% pentru locuințe). Pe disc NU apare explicit „21% se aplică de la…”. Data de **1 august 2025** e cea cunoscută public pentru 19%→21% și 9%/5%→11%, dar în corpus o susține doar indirect, prin art. III. De confirmat cu contabilul dacă întrebarea ajunge în materiale tipărite.
- **Microsoft, ro-ro, cu curl + extragerea textului.** Toate paginile de mai jos sunt bune, fără 404:
  - `average.txt`: „Dacă o zonă sau o celulă de referință conține text, valori logice sau celule goale, acele valori sunt ignorate”;
  - `min.txt`: „Celulele goale, valorile logice sau textele din matrice sau referință se ignoră”;
  - `diferenta_date.txt`: „06.05.2016 minus 01.05.2016 este egal cu 5 zile”;
  - `date.txt`: „Excel stochează datele ca numere seriale secvențiale astfel încât să poată fi utilizate în calcule”;
  - `selectare.txt`: „Pentru a selecta rânduri sau coloane care nu sunt adiacente, țineți apăsat Ctrl și selectați numerele de rând sau de coloană”;
  - `tipuri_diagrame.txt`: bare „atunci când: Etichetele axelor sunt lungi”;
  - `anulare.txt`: „Unele acțiuni nu pot fi anulate”, dar pagina NU dă ștergerea foii ca exemplu.
- **Surse deja salvate** (`acoperire_2026_09_15\eval_VIII\surse\`):
  - `scurtaturi.txt`: Ctrl+Page down/up, F12 = Salvare ca, Ctrl+W, Ctrl+Shift+Home/End, **Ctrl+E = Umplere instant**;
  - `sortare.txt`: fila Date → Sortare și filtrare, „De la A la Z”, „Adăugare nivel”, antetul exclus implicit.
  - `borduri.txt` și `stil_celula.txt` sunt pagini de eroare. Nu le-am folosit.
- **Ștergerea foii nu se anulează cu Ctrl+Z:** n-am găsit-o pe o pagină Microsoft (pagina „Inserarea sau ștergerea unei foi” n-a putut fi găsită cu curl, căutarea e blocată). O confirmă lecția LearningHub (`lectii_text.txt`: „ștergerea unei foi e definitivă: Anulare (Undo), adică Ctrl+Z, nu o aduce înapoi”). **Formulată prudent** (vezi #8).

## Trecerea 1: fondul celor 51 de întrebări
- **Nicio cheie greșită, niciun calcul greșit.** Recalculat independent:
  - TVA adăugat: 2,10 / 0,55 / 0,84 și 12,10 / 5,55 / 4,84;
  - TVA inclus: 12,10×21:121 = 2,10; 5,55×11:111 = 0,55; 4,84×21:121 = 0,84; total 3,49;
  - greșeala tipică, TVA din total: 2,541;
  - temperaturi: 21 / 9 / 12 / 108:7 = 15,43; notele 9,6,9 → 18 față de 8; zile 10→25.09 = 15;
  - IF în IF la 92/71/45 și la praguri; consum 7/6/8; buget 6000:40 = 150, cu 39 de elevi 153,85;
  - sortare Sara–Vlad–Irina–Toma; axa de la 7,8 → raport 3.
- Fiecare întrebare are o singură variantă bună. Fiecare `why` explică de ce.

## Formulele din `foaie`
Referința e acceptată la toate cele 8 foi. Soluțiile corecte scrise altfel sunt acceptate peste tot:
- litere mici;
- `SUM(B3;D3)` în loc de +;
- `=B2*(1+C2/100)`;
- `=B2-B2/(1+C2/100)`;
- IF de jos în sus, cu virgulă;
- `=SUM(B2:B8)/7`.

Greșelile de copil prinse de la început:
- rezultatul scris de mână;
- cota 21 scrisă de mână;
- TVA-ul din totalul care îl include deja: `=B2*C2/100` dă 2,54 și e respins;
- paranteza lipsă;
- > în loc de >= la IF în IF (variantele 85/84/60/59);
- < în loc de <= la buget (fix 150);
- kilometri : litri.

**Trei greșeli tipice treceau** (`formule_inainte.txt`):

| # | Gravitate | Foaia | Greșeala acceptată | De ce | Reparat |
|---|---|---|---|---|---|
| 1 | important | Consolidat, temperaturi | `=MAX(B2:B7)`, `=MIN(B2:B7)`, `=MAX(B3:B8)`, `=MIN(B3:B8)` (zona fără luni sau fără duminică) | Nici datele, nici varianta automată nu au extremul pe B2 sau pe B8 | `variants:[{B2:30,B8:-3},{B2:-3,B8:30}]`. Acum toate 4 sunt respinse |
| 2 | important | De bază, viteza | `D4 =B4/C2` (timpul de pe alt rând) | C2 = C4 = 60, iar varianta automată adaugă +3 la ambele | `variants:[{B2:450,C2:50,B3:180,C3:30,B4:6,C4:120}]`. Respinsă |
| 3 | minor | Consolidat, banii de buzunar | `=IF(B2<=200;…)` (bugetul scris de mână) | Bugetul e 200 peste tot | variantă nouă, cu buget 120/100/300. Respinsă |

Joc real pe iPhone SE, tastat în bara fx: 12 scenarii pe 7 foi, **12/12 cum trebuie** (5 corecte scrise altfel acceptate, 7 greșeli respinse).

## Scurgerea prin formă
Varianta bună era strict cea mai lungă în 6 din 25 de choice. Două cazuri se vedeau clar:

| # | Gravitate | Unde | Reparat |
|---|---|---|---|
| 4 | minor | De bază, „5 lei”: 41 de caractere față de 34 | „„5 lei” are litere, deci e text” (31) |
| 5 | minor | Consolidat, lățimea B–D: 57 față de 51 | „Selectezi literele B–D, apoi tragi marginea uneia” (50) |

Rămân 4 cazuri cu +1…+3 caractere. Nu se văd, le-am lăsat.

## Potrivirea cu descriptorul
**2 întrebări erau în runda greșită** (ambele în Avansat, unde descriptorul cere context nou și specificații):

| # | Gravitate | Întrebarea | Mutată |
|---|---|---|---|
| 6 | important | choice „Regula clubului: de la nota 7 în sus → >=” (o singură idee, context familiar) | în Consolidat |
| 7 | important | tf „corectezi nota în tabel, graficul se schimbă singur” (un adevărat/fals cu o idee) | în Consolidat, `lectii:[11]` (grafice), fără „La proba practică” din enunț |

La limită, lăsate pe loc:
- Consolidat, Ctrl+clic pe B și D: rechemare de tastă, dar în sarcina „colorezi două coloane”. Am încercat mutarea în De bază, dar lăsa lecția 4 din Consolidat cu o singură întrebare (avertisment la poartă), așa că am întors-o;
- De bază, Ctrl+E = Umplere instant: e o capcană utilă, dar nu e în conținuturile programei;
- Avansat, AVERAGE cu text și MIN cu celulă goală: sunt capcane de cunoaștere mai mult decât context nou;
- Consolidat, „De la A la Z”: rechemare.

## Fapte formulate prudent
| # | Gravitate | Ce | Reparat |
|---|---|---|---|
| 8 | important, neverificat pe Microsoft | tf „ștergi foaia, Ctrl+Z o aduce înapoi” = fals, iar `why` spunea „De aceea Excel te întreabă înainte” (Excel cere confirmare doar dacă foaia are date) | enunțul cere acum „Excel-ul instalat pe calculator”. `why` trimite la lecția despre foi + „încearcă o dată pe o foaie de probă”, fără afirmația despre confirmare |
| 9 | minor | „pe un calculator setat în engleză se scrie întâi luna” (engleza britanică pune ziua întâi) | „pe unele setări, de exemplu engleza americană” |
| 10 | minor | „La grafice cu coloane axa valorilor pornește de la 0” se putea citi ca un comportament al Excel | „e bine ca axa valorilor să pornească de la 0” |
| 11 | minor | vânătoarea din Avansat: „Greșelile de formă … le semnalează Excel”. Formula `7000-B6` fără = nu e semnalată, rămâne text | „se văd repede în celulă: apare textul formulei, o eroare sau un rezultat ciudat” |
| 12 | minor | indiciul vânătorii din Avansat enumera exact cele 4 tipuri de greșeli (=, /, engleză, comparație) | indiciu general: „Citește fiecare formulă cum ar citi-o Excel: ce calculează de fapt și ce cere rândul ei?” |

## Dublurile
- Scriptul (`intrebari_unitate.py VIII-U1 --verifica`): **0 perechi**, înainte și după.
- Citit cu ochii, față de `excel-viii`:
  - **#13, reparat:** Avansat, AVERAGE cu nota scrisă ca text, folosea **aceleași note 10, 8, 6 → 8** ca `excel-viii` N6 („6, 8 și 10 → 8”). Copilul putea răspunde din memorie. Notele sunt acum 9, 7, 5 și nota-text 3 → 7 (cu 3 ca număr: 6). Variantele: 7 / 6 / 5 / o eroare.
  - Dubluri parțiale, lăsate profesorului (fiecare adaugă ceva real):
    - Avansat order „Punctaj ↓, apoi Timp ↑ → rândurile” față de `excel-viii` N7 order „Clasa A→Z, Nota ↓ → rândurile”: aceeași schemă, dar amestecă sensurile;
    - Consolidat, foaia temperaturilor (MAX/MIN/AVERAGE) față de `excel-viii` N6, foaia situației școlare: aceeași schemă, plus diferența;
    - De bază order „mutare cu Ctrl+X” față de `excel-viii` N2 „cu ce începi mutarea → Ctrl+X”;
    - Consolidat tf „Delete păstrează bordurile” față de `excel-viii` N2 tf „după Delete celulele nu dispar”;
    - Consolidat „50 > 50 → pierdere” față de `excel-viii` N6 „4,50 >= 5 → corigent”.
- Între rundele jocului, parțiale, lăsate:
  - De bază „=(B2+C2)/2” față de Consolidat „=B2+B3+B4/3 NU e media”: aceeași idee (parantezele la medie);
  - Consolidat „50>50” față de Consolidat „clubul >=” (după mutare): aceeași idee (egalitatea la prag). Tragerea ia o întrebare pe lecție, deci rar ies împreună;
  - Consolidat „coloane pentru cheltuieli” față de Avansat classify „voturile → coloane”;
  - Avansat order sortare față de Avansat „biblioteca: Autor, apoi An”.

## Tragerea reală (iPhone SE, fără toateIntrebarile, runde TERMINATE; `joaca.txt`)
- **Bazinele după reparații:** De bază 16 (6 trase), Consolidat 22 (6), Avansat 13 (5). Toate au ≥ 2×cate.
- **Reluarea după o rundă terminată:** 0 întrebări repetate în toate 3 rundele. La a treia jucare ciclul reîncepe: 16 < 18 și 13 < 15, deci repetițiile sunt normale.
- **Echilibrul pe lecții:** De bază atinge toate 6 lecțiile la prima și la a doua tragere. Consolidat atinge 6 din 8 (cate = 6). Avansat 5 din 7.
- Abandonul nu consumă întrebări.
- Pagina are 320 px pe un ecran de 320 px. 0 erori JS.

## Declarațiile rundelor
Verificate întrebare cu întrebare după `lectii` și conținut. **Adevărate:**
- De bază: [2–7] și cele 8 conținuturi;
- Consolidat: [4–11] și cele 9 conținuturi, inclusiv „Serii de date” (pick B1:B8) și rândurile/coloanele (lățimea B–D, numele tăiat);
- Avansat: [7–13] și formule, funcții, sortare, grafice;
- textele rundelor, `intro` și diploma nu afirmă nimic neadevărat.

## Porțile, la final (`poarta.txt`)
- `test_joc.py excel-antrenament-viii` → **[TRECUT]** (102 întrebări jucate, 66,9 diacritice la 1000 de litere). Avertismente: N3, lecțiile 9 și 13 au câte o singură întrebare în bazin, după mutările #6 și #7.
- `acoperire.py` → **0 goluri, 0 probleme**. VIII-U1 nu are niciun ❌ în ACOPERIRE.md.
- `intrebari_unitate.py VIII-U1 --verifica` → **0 perechi**.

## Pentru motor (`_motor\tip-foaie.js`, nu l-am atins)
1. `=B2*C2%` e o formulă validă în Excel, dar simulatorul răspunde „Excel nu înțelege semnul %”. **Mesajul e fals pentru copil.** E probabil exact la foaia facturii, unde cota e „în procente”.
2. `=B2*0,21`, cu virgulă zecimală (cum se scrie în Excel pe setări românești), e respinsă cu „Semnul ; sau , se folosește doar în interiorul unei funcții”. Numai `0.21` trece.
3. Textele din IF se compară cu diacritice: „in buget” / „depasit” e respins („dă in buget, trebuia în buget”). În Excel, textul ar fi fost acceptat de profesor. Pe telefon, î/ș se tastează greu.
4. Varianta automată (+3/+6/+9 după poziția celulei) nu mută extremele și nu desparte celulele egale. Fiecare foaie trebuie să-și aleagă singură `variants` pentru greșelile de zonă și de rând (vezi #1 și #2). Merită o regulă în README §7.

## Rămâne de decis de profesor
- **TVA:** confirmarea datei de aplicare 1.08.2025 pentru 21%/11% cu contabilul. Pe disc, data apare doar indirect, prin art. III din L. 141/2025.
- **Ștergerea foii și Ctrl+Z:** de verificat o dată pe Excel-ul din laborator. N-am găsit o pagină Microsoft care să spună asta.
- **Avansat, lecțiile 9 și 13** au câte o întrebare după mutări, deci la reluare dispar. Trebuie scrise 1-2 întrebări noi de context nou (IF pe specificație; proba practică)?
- Dublurile parțiale de mai sus: se păstrează ca repetiție sau se înlocuiesc?
- Cele 4 întrebări la limită de descriptor.
- Cele 3 limite ale simulatorului (%, virgula zecimală, diacriticele): se repară în motor?
