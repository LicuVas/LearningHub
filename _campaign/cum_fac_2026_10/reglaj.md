# Reglajul căutării „Cum fac…?” pe setul de dezvoltare (10.10.2026)

Reglorul: am făcut căutarea să înțeleagă mai bine cum întreabă copiii. N-am citit nimic din `_ascuns/`.
N-am atins fișele, glosarul (`termeni.json`), `index.html`, lecțiile sau motorul lecțiilor. N-am făcut commit.

Fișiere schimbate: `cum-fac/cautare.js` (4 mecanisme noi, toate pornite și oprite din `reglaj`), `cum-fac/_sursa/sensuri.json`
(dicționarul și `reglaj`), `cum-fac/date.js` (refăcut cu `build.mjs`), `cum-fac/_teste/set_dezvoltare.json` (3 corecturi).
Fișiere noi: `cum-fac/_teste/set_dezvoltare_corecturi.json`, `cum-fac/_teste/set_reglor_lung.json` (proba mea cu fraze
lungi, vezi mai jos).

## Cum am lucrat
- Setul de dezvoltare (219 întrebări: 194 din materie + 25 din afara ei) l-am împărțit fix: **A = indicii pari**,
  **B = indicii impari** (97 + 13 și 97 + 12). Am citit și am reglat DOAR pe A. Pe B am citit doar cifrele, ca să văd
  dacă reglajul ține și pe întrebări pe care nu le-am văzut. Nu m-am uitat la ratările din B.
- Au mai stat de pază: `set_inginer_real.json` (nu are voie să scadă), exemplele profesorului (8/8) și o probă a mea
  de 40 de fraze lungi (24 din materie, 16 din afara ei, între care unele „capcană”, cu cuvinte din materie: „cum salvez
  un nivel în Minecraft”, „cum copiez la test”), scrisă doar din titlurile catalogului.
- Fiecare valoare din `reglaj` am ales-o pe A + setul inginerului + proba mea, la mijlocul zonei în care A e cel mai bun;
  B l-am măsurat după.
- Am păstrat o schimbare numai dacă ridica A fără să strice nimic. Am verificat apoi fiecare schimbare și invers: am
  scos-o din varianta finală și am văzut ce se pierde (tabelul de mai jos).

## Cifrele

Locul 1 = fișa bună e prima. Primele 3 = fișa bună e printre primele trei. „Din afara materiei” = câte întrebări
din afara materiei primesc „n-am găsit”.

| | înainte (setul original) | după (setul original) | după (setul corectat) |
|---|---|---|---|
| **A**: locul 1 | 77/97 = 79,4% | 92/97 = 94,8% | 94/97 = 96,9% |
| **A**: primele 3 | 86/97 = 88,7% | 97/97 = 100% | 97/97 = 100% |
| **A**: din afara materiei | 12/13 | 12/13 | 12/13 |
| **B**: locul 1 | 82/97 = 84,5% | 89/97 = 91,8% | 89/97 = 91,8% |
| **B**: primele 3 | 89/97 = 91,8% | 92/97 = 94,8% | 92/97 = 94,8% |
| **B**: din afara materiei | 11/12 | 11/12 | 11/12 |
| **Tot setul**: locul 1 (ținta ≥ 88%) | 159/194 = 82,0% | 181/194 = 93,3% | **183/194 = 94,3%** |
| **Tot setul**: primele 3 (ținta ≥ 96%) | 175/194 = 90,2% | 189/194 = 97,4% | **189/194 = 97,4%** |
| **Tot setul**: din afara materiei (ținta ≥ 23/25) | 23/25 | 23/25 | **23/25** |

Cu setul corectat, motorul vechi dă 160/194 (82,5%) pe locul 1 și 175/194 (90,2%) în primele 3. Deci cele 3 corecturi
explică doar +1 pe locul 1. Restul vine din reglaj.

Pe tipuri (tot setul, primele 3 / locul 1 / câte sunt):

| tip | înainte | după (setul corectat) |
|---|---|---|
| greseala_tastare | 25 / 22 / 30 | 30 / 29 / 30 |
| efect | 35 / 32 / 41 | 41 / 39 / 41 |
| vorbe_de_acasa | 19 / 17 / 21 | 21 / 20 / 21 |
| fara_diacritice | 54 / 51 / 55 | 55 / 54 / 55 |
| engleza | 20 / 19 / 21 | 20 / 20 / 21 |
| scurt | 18 / 14 / 18 | 18 / 17 / 18 |
| **lung** | 4 / 4 / 8 | **4 / 4 / 8** (neschimbat; vezi „Ce a rămas”) |
| in_afara | 23 / 25 | 23 / 25 |

Celelalte probe, rulate la final:
- `evalueaza.mjs set_dezvoltare.json`: ultima linie **7** (2 din afara materiei + 5 care nu intră în primele 3).
- `evalueaza.mjs exemplele_profesorului.json`: 8/8 pe locul 1, ultima linie **0**. `set_r5.json`: 8/8, **0**.
- `evalueaza.mjs set_inginer_real.json`: 77/81 pe locul 1, 81/81 în primele 3, 19/20 din afara materiei,
  **la fel ca înainte** (ultima linie 1, aceeași ratare: „cum desenez un cal”).
- Proba mea cu fraze lungi: locul 1 de la 7/24 la **19/24**, primele 3 de la 8/24 la **21/24**, din afara materiei
  **16/16** și înainte, și după.
- Timpul: în node, în medie 2,5 ms pe întrebare, maxim 12–15 ms (măsurat de 3 ori; pe calculatorul încărcat am văzut
  și 78 ms o dată, iar motorul vechi a avut și el 65 și 226 ms în aceleași condiții). În pagină
  (`proba_browser.py`): de la tastare la rezultate maxim 3,8 ms, la 300 de fișe maxim 6,2 ms.
- `proba_browser.py`: ultima linie **0** (toate verificările trec, 0 cereri externe, 0 erori JS).
  `build.mjs` și `build.mjs --verifica`: **0**.

## Ce am schimbat și de ce

### 1. Motorul (`cautare.js`, versiunea 1.1): patru mecanisme, fiecare cu o cheie în `reglaj`
Dacă o cheie lipsește din `sensuri.json`, mecanismul ei rămâne oprit sau slab (valorile implicite din cod), deci
motorul vechi se poate reface doar din `reglaj`.

| mecanism | cheia (valoarea aleasă) | de ce | ce se pierde fără el (A / B, locul 1 · primele 3) |
|---|---|---|---|
| **Cuvântul rar citit ca greșeală.** Un cuvânt care apare în cel mult 4 fișe și nu e în dicționar se potrivește și cu cel mai apropiat cuvânt de cel puțin 3 ori mai des, cu factorul greșelii. | `rar_df` 4, `rar_ori` 3 | Autorii au pus greșeli de tastare în formulări („colona”, „salvz”, „documetn”, „foia”, „selctia”). Când copilul face aceeași greșeală, motorul vechi găsea doar fișa care o avea scrisă, nu și fișa bună. Am ales pragul 4 la mijlocul zonei 3–6, în care A dă același rezultat. | A −4 · −3 / **B −2 · −2** |
| **Identitatea fișei.** Un bonus după cât de aproape e întrebarea de titlu sau de întrebarea-tip (Dice, deci titlul scurt și la obiect câștigă). | `pondere_identitate` 0,2 | Fișele cu o formulare „de margine” (de exemplu „media notelor” în fișa cu parantezele) treceau înaintea fișei care chiar face gestul. Pe A, zona bună e 0,15–0,2; pe 0,1–0,25, B rămâne la fel. | A −4 · 0 / **B −2 · 0** |
| **Numele aplicației scris în fișă = „programul”.** Când o fișă scrie „PowerPoint rămâne deschis”, cuvintele „programul” sau „aplicația” din întrebare o găsesc. | `grup_nume_aplicatie` "program" (+ grupul `program`) | „închid prezentarea dar nu programul”: cuvântul „programul” nu se potrivea cu nimic, deși fișa vorbește chiar despre program. | A −1 · −1 / B 0 |
| **Pragul pentru frazele lungi.** Dacă primul rezultat potrivește pe câmpurile tari cel puțin 3 cuvinte, „am găsit” cere doar 0,35 din întrebare, în loc de 0,65. | `lung_potrivite` 3, `prag_lung` 0,35 | O frază lungă are și cuvinte de context („colegul”, „acum”, „pe tablă”), care scad acoperirea. Pe proba mea de fraze lungi, 16 din 24 primeau „n-am găsit”, deși fișa bună era prima propunere. În toate seturile pe care le-am putut citi (A, setul inginerului, proba mea: 49 de întrebări din afara materiei), primul rezultat al unei întrebări din afara materiei potrivește pe câmpurile tari cel mult 2 cuvinte (0 cuvinte la 8, 1 la 28, 2 la 13). | A 0 / B 0 / **proba lungă −13 · −14** |

### 2. Cuvinte de umplutură noi (`umplutura`)
„faca, facand, facute, facea” (forme ale lui „a face”, deja umplutură la alte forme); „dea, da, dati” (ca „dau”,
„dai”); „dar, insa, ci” (conjuncții); „dupa”; „inseamna” („ce înseamnă X”). Expresiile cu ele rămân, fiindcă
expresiile se recunosc înainte să iasă umplutura: „după punct”, „apoi după”, „după virgulă”.
De ce: în „să facă mai întâi adunarea” și „să-mi dea media”, „facă” și „dea” erau cuvinte necunoscute cu greutate mare
și împingeau fișa bună sub prag. Fără ele: A −1 · −1, **B −1 · −1**.

### 3. Aplicațiile (`aplicatii`)
- „docx”, „xlsx”, „pptx” au trecut de la `nume` la `indicii`. Ca nume, ieșeau din căutare, iar întrebările DESPRE
  extensie („ce înseamnă .docx după numele fișierului”) rămâneau fără cuvântul principal. Ca indicii, arată în
  continuare aplicația, dar se și caută.
- „tabel”, „tabelul” au ieșit din indiciile Excel. Un tabel se face la fel de des în Word și în PowerPoint, deci
  întrebarea „tabel” trimitea greșit numai la Excel.
- Web: „pagina de internet”, „pagini de internet”, „pagină de internet”, „site de internet” sunt acum nume ale
  aplicației.
- Fără aceste trei schimbări: A −3 · −1, **B −1 · −1**.

### 4. Grupuri de sensuri (`grupuri`)
Grupuri noi:
- `aparitie`: să apară, apare, să se vadă, se vede, vizibil, afișez, show, display.
- `nota_scolara` (Excel): notă, note, notele, notelor. Rădăcina lasă „note” și „notelor” diferite.
- `de_la_curent` (PowerPoint): „de la slide-ul ăsta”, „diapozitivul curent”, „de aici încolo”, „current slide”…
- `program`: program, programul, aplicația, app.
- `crescator`: crescător, de la A la Z, A to Z, de la mic la mare, alfabetic…
- `descrescator`: perechea lui, păstrată pentru simetrie.

Grupuri extinse:
- `ordine`: în față, mai în față, în spate, mai la început, primul, ultimul.
- `extensie`: după numele fișierului, după nume, la coada numelui, literele de după punct.
- `adaugare`: pus, pusă, puse, pune, băgat. „am pus o poză” e foarte des în frazele copiilor, iar „pus” nu are
  rădăcina lui „pun”.
- Formele pe care rădăcina nu le prinde: `cautare` + găsit, găsită; `inchidere` + oprit, oprită; `rotire` + întors,
  întoarsă; `restaurare` + aduc înapoi.

Efect: fiecare grup nou (în afară de `descrescator`) ridică A cu +1 pe locul 1, la fel extinderile `ordine` și
`extensie` (+1 · +1); pe B, luate una câte una, nu se văd. „pus”, „pune” aduc pe proba
lungă +1 · +1 și, împreună cu „ci”, B +1 · +1. Formele pe care rădăcina nu le prinde au efect 0 pe seturile de azi.
Le-am păstrat pentru că sunt exact golul care a contat la „pus”.

### 5. Ce am încercat și am lăsat deoparte (măsurat, fără câștig)
- Toate ponderile și factorii din `reglaj` (`pondere_fraza`, `sens`, `alta_aplicatie_*`, ponderile pașilor, ale
  formulărilor, ale termenilor): valorile inginerului sunt deja cele mai bune pe A. Nu le-am mișcat.
- Pragul „am găsit” (0,5–0,7): pe A, între 0,55 și 0,7 iese la fel; la 0,6 sau mai jos, setul inginerului pierde o
  întrebare din afara materiei. A rămas 0,65.
- „Cheia scurtă” (rădăcina fără vocala de la coadă: nota ~ notele): efect 0. Am scos-o din cod.
- O expresie din întrebare care se potrivește și pe cuvintele ei, luate separat: strică locul 1. Am scos-o.
- Mai multă umplutură pentru frazele lungi („zice, știu, nimic, deloc, cumva”): efect 0. N-am pus-o.
- Grupurile „deformare” (strâmb, turtit) și „aprindere” (aprind, aprins): efect 0. N-am lăsat grupuri fără dovadă.
- „documente” scos din indiciile Word: efect 0. N-am schimbat.
- Bonusul de identitate măsurat pe acoperire, nu pe Dice: B nu crește. L-am înlocuit cu Dice.

## Corecturile de set (`cum-fac/_teste/set_dezvoltare_corecturi.json`, aplicate în `set_dezvoltare.json`)
Am corectat doar cazuri clare și doar în A (B nu l-am citit). N-am scos nicio fișă acceptată; doar am adăugat:
1. „wrap text”: + `word-incadrare-text-imagine`. „Wrap Text” (Încadrare text) e și butonul din Word pentru textul de
   lângă poză. Întrebarea nu numește aplicația.
2. „pun un font frumos pe titlu”: + `word-schimbare-font`. Schimbarea fontului e gestul evident („litere mai
   frumoase”); setul accepta doar fontul temei din PowerPoint.
3. „notele de sub slide”: + `powerpoint-note-scrii`. Întrebarea n-are verb, iar „Scrii în zona de note” e tot fișa zonei
   de note de sub diapozitiv.

## Ce a rămas ratat și de ce
Pe A (după corecturi):
- „închid wodrul”: fișa bună e a 2-a, la egalitate aproape perfectă. Fișa „Închizi documentul” are chiar formularea
  „inchid wordul”, deci cele două fișe se potrivesc la fel. Ambiguitate reală: un copil spune „închid wordul” și când
  închide doar documentul.
- „a apărut o pagină goală la sfârșit”: fișa bună e a 3-a. Fișa web „Închizi etichetele în ordine” are formulările
  „pagina goală…” și „…la sfârșit”, deci explică mai multe cuvinte. Am lăsat-o: orice grup care ar lega „la sfârșit” de
  „în plus” ar fi făcut pentru întrebarea asta.
- „pun un font frumos pe titlu”: fișa bună e a 2-a. „Stil de celulă” (Excel) are formularea „cum fac titlul frumos”.
- „cum conectez imprimanta” (din afara materiei) primește un rezultat: „conectez” e citit ca greșeală pentru
  „corectez” (o literă diferită), iar „imprimanta” e chiar în materie (tipărire). Ar trebui o listă de cuvinte reale
  din afara materiei, care să nu fie „corectate”. N-am făcut-o: ar fi fost o listă ghicită.

Pe B: 8 pe locul 1 și 5 în afara primelor 3. După cifre, **4 din cele 5 sunt întrebări lungi**: tipul `lung` a rămas
4/8 pe tot setul, iar cele 3 lungi din A trec. Pragul pentru frazele lungi a ridicat proba mea de la 8/24 la 21/24, dar
pe întrebările lungi din B n-a mișcat nimic. Deci acolo ratarea are altă cauză decât „n-am găsit” cu fișa bună printre
propuneri. Cauza n-am căutat-o: ar fi însemnat să reglez pe B.
Propunere pentru dirijor: un agent proaspăt se uită la cele 4 întrebări lungi din B, iar ce repară acolo se judecă pe
setul ascuns, nu pe B.

Riscuri pentru setul ascuns:
- Pragul pentru frazele lungi (0,35 la ≥ 3 cuvinte potrivite) e cel mai „curajos” reglaj. Dacă setul ascuns are întrebări
  lungi din afara materiei care conțin 3 cuvinte din materie, unele pot primi un rezultat în loc de „n-am găsit”. Pe
  cele 49 de întrebări din afara materiei pe care le-am putut citi, n-a apărut niciuna.
- „Cuvântul rar citit ca greșeală” poate citi greșit un cuvânt adevărat, dar rar: în proba mea, „sare” a fost citit
  „save”, „anume” a fost citit „nume”. Asta adaugă potriviri slabe (factorul 0,8) și scade greutatea cuvântului, dar nu
  a stricat nicio întrebare măsurată.

Transparență: la măsurarea timpului, scriptul meu a tipărit textul celor mai lente 4–5 întrebări din set, deci și câteva
din B (fără rezultate). Le-am văzut după ce reglajul era deja gata și nu le-am folosit.

## Cum se reproduce
```
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_dezvoltare.json --detalii
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/exemplele_profesorului.json
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_inginer_real.json
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_reglor_lung.json
python C:/00/Projects/LearningHub/cum-fac/_teste/proba_browser.py
```
Jumătățile A și B: A = întrebările cu indicele 0, 2, 4… din `set_dezvoltare.json`; B = 1, 3, 5….
