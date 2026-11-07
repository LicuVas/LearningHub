## Pasul 1: La ce folosește

La sfârșitul semestrului, profesorul face media fiecărui elev. Cu formulele din lecția 7, pentru cinci note ar scrie `=(B2+B3+B4+B5+B6)/5`. Pentru douăzeci de note, formula ar fi foarte lungă și ușor de greșit.

Excel are calcule gata făcute, cu nume. Le spunem **funcții**. Media celor cinci note se scrie scurt: `=AVERAGE(B2:B6)`.

Azi înveți patru funcții: suma, media, cea mai mare și cea mai mică valoare.

[Imagine]

Sub imagine: Notele a cinci elevi, în Excel. Sub ele, patru funcții au calculat suma, media, cea mai mare și cea mai mică notă. Sus, în bara de formule, e funcția care a calculat media.

## Pasul 2: Ce este o funcție

O funcție este un calcul gata făcut, care are un nume. Tu scrii numele și spui cu ce numere să lucreze.

O funcție se scrie așa: semnul `=`, numele funcției, apoi, între paranteze, o zonă de celule (lecția 4). Ce scrii între paranteze se numește **argument**.

Exemplu: `=SUM(B2:B6)` adună toate numerele din zona B2:B6, adică din B2, B3, B4, B5 și B6. SUM vine din engleză și înseamnă „sumă”. Nu lași spații între nume și paranteză.

**Uite cum:**

[Imagine]

Sub imagine: În B7 scrie =SUM(B2:B6). După Enter, B7 arată 42, iar bara de formule arată funcția.

`=SUM(B2:B6)` face același calcul ca `=B2+B3+B4+B5+B6`, dar e mai scurtă și nu sari nicio celulă. Dacă uiți paranteza de la sfârșit, Excel o pune singur la Enter.

Cât scrii, sub celulă apare o bulă: `SUM(number1; [number2]; …)`. Ea arată că poți pune mai multe argumente. Pe setările românești ale Windows-ului le desparți cu `;`, pe unele calculatoare cu `,`.

**Explică-mi altfel:**

E ca atunci când îi spui unui coleg: „adună notele din catalog, de la Ana până la Elena”, în loc să-i dictezi fiecare notă. Numele funcției spune CE să facă. Zona dintre paranteze spune DE UNDE să ia numerele.

### Încearcă (pasul 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B7** scrie funcția `=SUM(B2:B6)` și apasă Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma.

Verificarea automată (verifica): {"formule": {"B7": "=SUM(B2:B6)"}, "functie": {"B7": "SUM"}}

Indiciu (apare după prima greșeală): Clic pe B7. Scrie semnul =, apoi SUM, paranteza (, zona B2:B6 și paranteza ). Apoi apasă Enter.

Explicația de după răspuns: B7 arată 42: SUM a adunat notele 9, 8, 10, 7 și 8.

### Încă un exercițiu (pasul 2, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Clasa a strâns maculatură patru zile la rând: kilogramele sunt în **B2:B5**. În **B6** scrie funcția care adună toate kilogramele.

Foaia de la început: A1 = Ziua; B1 = Kilograme; A2 = Luni; B2 = 12; A3 = Marți; B3 = 15; A4 = Miercuri; B4 = 9; A5 = Joi; B5 = 14; A6 = Total.

Verificarea automată (verifica): {"formule": {"B6": "=SUM(B2:B5)"}, "functie": {"B6": "SUM"}}

Indiciu (apare după prima greșeală): Funcția care adună e SUM. Între paranteze pui zona cu kilogramele: de la B2 la B5.

Explicația de după răspuns: =SUM(B2:B5) dă 50 de kilograme.

### Încă un exercițiu (pasul 2, varianta 2)

În formula `=SUM(C2:C9)`, care este argumentul?

Variante:

- C2:C9 (corect)

- SUM

- =

- Parantezele

Indiciu (apare după prima greșeală): Argumentul e ce scrii între paranteze.

Explicația de după răspuns: Argumentul e zona C2:C9, adică ce stă între paranteze. SUM e numele funcției.

## Pasul 3: Patru funcții: SUM, AVERAGE, MAX, MIN

Patru funcții îți ajung pentru multe tabele:

- `SUM`: suma numerelor din zonă;

- `AVERAGE`: **media aritmetică**, adică suma numerelor împărțită la câte numere sunt;

- `MAX`: cel mai mare număr din zonă;

- `MIN`: cel mai mic număr din zonă.

Numele funcțiilor sunt în engleză și în Excel-ul în limba română. `=SUMA(B2:B6)` dă `#NAME?`, ca orice cuvânt pe care Excel nu-l cunoaște (lecția 7). Poți scrie și cu litere mici: la Enter, Excel le face mari.

**Uite cum:**

Pe notele 9, 8, 10, 7 și 8, din B2:B6:

- `=SUM(B2:B6)` arată 42;

- `=AVERAGE(B2:B6)` arată 8,4, adică 42 împărțit la 5;

- `=MAX(B2:B6)` arată 10, iar `=MIN(B2:B6)` arată 7.

[Imagine]

Sub imagine: Cu numele românesc, =SUMA(B2:B6), Excel arată #NAME?.

Vezi filmul pas cu pas: Media cu funcția AVERAGE ↗ (se deschide într-o filă nouă; apoi te întorci la fila lecției).

**Explică-mi altfel:**

Gândește-te la un concurs de aruncări la coș: SUM spune câte coșuri a înscris toată echipa, AVERAGE câte a înscris în medie fiecare jucător, MAX cele mai multe coșuri ale unui jucător, iar MIN cele mai puține.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B8** scrie funcția care arată cea mai mare notă din B2:B6 și apasă Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma; B7 = =SUM(B2:B6); A8 = Cea mai mare; A9 = Cea mai mică.

Verificarea automată (verifica): {"formule": {"B8": "=MAX(B2:B6)"}, "functie": {"B8": "MAX"}}

Indiciu (apare după prima greșeală): Cea mai mare valoare o dă funcția MAX. Zona e B2:B6: fără suma din B7.

Explicația de după răspuns: =MAX(B2:B6) arată 10, nota Carlei.

### Încă un exercițiu (pasul 3, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B9** scrie funcția care arată cea mai mică notă din B2:B6.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma; B7 = =SUM(B2:B6); A8 = Cea mai mare; B8 = =MAX(B2:B6); A9 = Cea mai mică.

Verificarea automată (verifica): {"formule": {"B9": "=MIN(B2:B6)"}, "functie": {"B9": "MIN"}}

Indiciu (apare după prima greșeală): Cea mai mică valoare o dă funcția MIN.

Explicația de după răspuns: =MIN(B2:B6) arată 7, nota lui Dan.

### Încă un exercițiu (pasul 3, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Temperaturile de la ora 8, cinci zile la rând, sunt în **B2:B6**. În **B7** scrie funcția care arată temperatura medie.

Foaia de la început: A1 = Ziua; B1 = Grade; A2 = Luni; B2 = 4; A3 = Marți; B3 = 6; A4 = Miercuri; B4 = 5; A5 = Joi; B5 = 3; A6 = Vineri; B6 = 7; A7 = Media.

Verificarea automată (verifica): {"formule": {"B7": "=AVERAGE(B2:B6)"}, "functie": {"B7": "AVERAGE"}}

Indiciu (apare după prima greșeală): Media aritmetică o dă funcția AVERAGE.

Explicația de după răspuns: =AVERAGE(B2:B6) arată 5: suma 25, împărțită la 5.

### Încă un exercițiu (pasul 3, varianta 3)

(Adevărat sau fals?)

În Excel-ul în limba română, media se scrie `=MEDIE(B2:B6)`.

Răspuns: Fals

Indiciu (apare după prima greșeală): În ce limbă sunt numele funcțiilor?

Explicația de după răspuns: Fals. Numele funcțiilor rămân în engleză: `=AVERAGE(B2:B6)`. Cu MEDIE, Excel arată #NAME?.

## Pasul 4: Celulele goale, textul și zeroul

Funcțiile iau din zonă **doar numerele**. Sar peste celulele goale și peste text, de exemplu „absent”. De aceea `AVERAGE` împarte la câte numere sunt în zonă, nu la câte celule are zona.

Atenție la 0: e un număr, deci intră în medie și o scade. Dacă un elev a lipsit, îi lași celula goală, nu scrii 0.

O formulă cu + se oprește la un text: `=B2+B3` dă `#VALUE!` (lecția 7). `=SUM(B2:B6)` sare peste text și adună restul.

**Uite cum:**

[Imagine]

Sub imagine: B3 goală: media celor 4 note, 34 împărțit la 4, adică 8,5.

[Imagine]

Sub imagine: Cu 0 în B3: 34 împărțit la 5, adică 6,8.

Dacă în zonă nu e niciun număr, `AVERAGE` arată `#DIV/0!`, iar `SUM`, `MAX` și `MIN` arată 0. O notă scrisă 7.5 devine dată (lecția 5). Pentru funcții, data e tot un număr, unul foarte mare, deci media iese greșită: un număr uriaș sau chiar o dată. Scrie 7,5.

**Explică-mi altfel:**

La catalog: dacă ai lipsit la un test, profesorul nu-ți trece nota 0. Lasă căsuța goală și face media din notele pe care le ai.

### Încearcă (pasul 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Carla a lipsit, deci **B4** e goală. Ghicește întâi: ce arată `=AVERAGE(B2:B6)` în B7? Apoi scrie funcția în B7 și alege răspunsul.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Media.

Variante:

- 8 (corect)

- 6,4

- 32

- #DIV/0!

Indiciu (apare după prima greșeală): Celula goală nu intră în medie. Adună cele 4 note și împarte la 4.

Explicația de după răspuns: Media e 8: 9 + 8 + 7 + 8 fac 32, împărțit la 4 note. 6,4 ar ieși dacă ai împărți la 5.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B3** e scris 0, dar Bogdan de fapt a lipsit. Repară foaia, ca media din B7 să nu-l mai socotească pe Bogdan.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 0; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Media; B7 = =AVERAGE(B2:B6).

Verificarea automată (verifica): {"gol": ["B3"], "formule": {"B7": "=AVERAGE(B2:B6)"}}

Indiciu (apare după prima greșeală): Clic pe B3 și apasă Delete: celula rămâne goală. Pe telefon: atingi B3, atingi bara de formule, ștergi 0 și apeși ↵. Funcția din B7 o lași cum e.

Explicația de după răspuns: Cu B3 goală, media e 8,5: 34 împărțit la cele 4 note. Cu 0 era 6,8.

### Încă un exercițiu (pasul 4, varianta 2)

În zona B2:B6 sunt: 9, textul „scutit”, 6, 5 și 6. Ce arată `=AVERAGE(B2:B6)`?

Variante:

- 6,5 (corect)

- 5,2

- #VALUE!

- 26

Indiciu (apare după prima greșeală): Textul nu intră în medie. Câte numere rămân?

Explicația de după răspuns: Rămân 4 numere: 9 + 6 + 5 + 6 fac 26, împărțit la 4 dă 6,5. 5,2 ar ieși dacă ai împărți la 5. Funcția sare peste text, deci nu apare #VALUE!.

## Pasul 5: Butonul Σ: Însumare automată (AutoSum)

Butonul **Însumare automată (AutoSum)**, cu semnul Σ, scrie funcția în locul tău. E pe fila **Pornire (Home)**, în dreapta, în grupul **Editare (Editing)**, și pe fila **Formule (Formulas)**, la început.

Faci clic în celula de sub numere, apoi pe Σ. Excel scrie `=SUM(` și o zonă aleasă de el, încadrată cu linie punctată. Săgeata **▾** de lângă Σ deschide o listă: **Medie (Average)**, **Max**, **Min**.

**Înainte de Enter, citește zona.** Excel urcă peste numere până la primul text sau prima celulă goală. La Medie, Max și Min prinde și un total de deasupra. Dacă zona e greșită, scrii zona bună peste ea.

**Uite cum:**

[Imagine]

Sub imagine: Clic pe B7, apoi pe Σ: zona B2:B6 e bună. Apeși Enter și apare 42.

[Imagine]

Sub imagine: Săgeata ▾ de lângă Σ: Sum, Average, Max, Min…

[Imagine]

Sub imagine: În B8, ▾ › Average propune B2:B7: a prins și suma din B7!

[Imagine]

Sub imagine: Scrii B2:B6 peste zonă, apoi Enter: media e 8,4.

Sub un total, Σ (Sumă) propune doar totalul, de exemplu `=SUM(B7)`: și atunci scrii zona bună peste ea. Pe telefon, butonul Σ se vede mai ușor pe fila **Formule (Formulas)**: e al doilea buton.

Vezi filmul pas cu pas: Suma cu un singur buton ↗ (se deschide într-o filă nouă; apoi te întorci la fila lecției).

**Explică-mi altfel:**

Σ e ca un coleg grăbit care îți întinde foaia gata scrisă. Te ajută, dar tu citești ce a scris înainte să semnezi: dacă a adunat și rândul cu totalul, corectezi.

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Clic pe **B7**, apoi pe butonul **Σ** (Însumare automată / AutoSum). Citește zona propusă și apasă Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma.

Verificarea automată (verifica): {"formule": {"B7": "=SUM(B2:B6)"}, "functie": {"B7": "SUM"}, "gest": ["autosum"]}

Indiciu (apare după prima greșeală): Σ e pe fila Formule (Formulas), la început, sau pe fila Pornire (Home), în dreapta: apasă pe semnul Σ, nu pe săgeată. Zona propusă, B2:B6, e bună: apasă Enter.

Explicația de după răspuns: Σ a scris =SUM(B2:B6), iar B7 arată 42.

### Încă un exercițiu (pasul 5, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În B7 e deja suma. Clic pe **B8**, apoi pe săgeata **▾** de lângă Σ și alege **Medie (Average)**. Verifică zona propusă, repar-o dacă trebuie și apasă Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 8; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma; B7 = =SUM(B2:B6); A8 = Media.

Verificarea automată (verifica): {"formule": {"B8": "=AVERAGE(B2:B6)"}, "functie": {"B8": "AVERAGE"}, "gest": ["autosum"]}

Indiciu (apare după prima greșeală): Excel propune B2:B7, cu tot cu suma din B7. Scrie B2:B6 peste zona propusă, apoi apasă Enter.

Explicația de după răspuns: Media notelor e 8,4. Cu zona propusă, B2:B7, ar fi ieșit 14, pentru că intra și suma 42.

### Încă un exercițiu (pasul 5, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Bogdan n-a dat testul, deci **B3** e goală. Clic pe **B7**, apoi pe **Σ**. Verifică zona propusă, repar-o dacă trebuie, ca suma să cuprindă toate notele din B2:B6, și apasă Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; A4 = Carla; B4 = 10; A5 = Dan; B5 = 7; A6 = Elena; B6 = 8; A7 = Suma.

Verificarea automată (verifica): {"formule": {"B7": "=SUM(B2:B6)"}, "functie": {"B7": "SUM"}, "gest": ["autosum"]}

Indiciu (apare după prima greșeală): Excel urcă doar până la celula goală, deci propune B4:B6. Scrie B2:B6 peste zona propusă și apasă Enter.

Explicația de după răspuns: Suma e 34. Zona propusă, B4:B6, ar fi lăsat-o pe dinafară pe Ana.

## Pasul 6: Copiezi funcția: zona se mută cu ea

În E2 e media Anei: `=AVERAGE(B2:D2)`. Pentru ceilalți elevi nu scrii funcția din nou: o copiezi.

Alegi E2. În colțul din dreapta-jos al celulei e un pătrățel, **mânerul de umplere** (fill handle; în ajutorul Office în română: instrumentul de umplere). Îl apuci cu mouse-ul și tragi în jos, până la E6.

Zona din funcție se mută odată cu rândul: în E3 ajunge `=AVERAGE(B3:D3)`, media lui Bogdan, în E4 `=AVERAGE(B4:D4)` și tot așa. Spre dreapta merge la fel: `=SUM(B2:B6)` din B7, trasă până în C7, devine `=SUM(C2:C6)`.

**Uite cum:**

[Imagine]

Sub imagine: Mânerul de umplere: pătrățelul din colțul din dreapta-jos al celulei alese.

[Imagine]

Sub imagine: După tragere, E4 are =AVERAGE(B4:D4): media Carlei, 6.

Poți copia mai multe funcții deodată: selectezi B7:B10, iar pătrățelul e în colțul lui B10; îl tragi și se copiază toate. Pe telefon, pune degetul pe pătrățelul verde din colț și trage. Verifică apoi o celulă copiată: alege-o și citește zona din bara de formule.

Vezi filmul pas cu pas: Copiezi formula în jos ↗ (se deschide într-o filă nouă; apoi te întorci la fila lecției).

**Explică-mi altfel:**

E ca o rețetă scrisă „ia notele de pe rândul tău”. Fiecare elev o citește pe rândul lui, deci fiecare primește media lui, deși rețeta e aceeași.

### Încearcă (pasul 6)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **E2** e media Anei. Alege E2 și trage mânerul de umplere în jos, până la **E6**.

Foaia de la început: A1 = Elev; B1 = Test 1; C1 = Test 2; D1 = Test 3; A2 = Ana; B2 = 9; C2 = 7; D2 = 8; A3 = Bogdan; B3 = 10; C3 = 9; D3 = 8; A4 = Carla; B4 = 6; C4 = 7; D4 = 5; A5 = Dan; B5 = 8; C5 = 9; D5 = 10; A6 = Elena; B6 = 7; C6 = 7; D6 = 10; E1 = Media; E2 = =AVERAGE(B2:D2).

Verificarea automată (verifica): {"formule": {"E2": "=AVERAGE(B2:D2)"}, "umplut": {"E2": ["E3", "E4", "E5", "E6"]}, "gest": ["umple"]}

Indiciu (apare după prima greșeală): Clic pe E2. Apucă pătrățelul din colțul lui din dreapta-jos și trage în jos, până la E6. Pe telefon, pune degetul pe pătrățelul verde din colț și trage în jos.

Explicația de după răspuns: Fiecare rând are media lui: 8, 9, 6, 9 și 8.

### Încă un exercițiu (pasul 6, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În E2 e `=AVERAGE(B2:D2)`. Trage mânerul de umplere până la E6, apoi alege **E5** și citește bara de formule. Ce funcție a ajuns acolo?

Foaia de la început: A1 = Elev; B1 = Test 1; C1 = Test 2; D1 = Test 3; A2 = Ana; B2 = 9; C2 = 7; D2 = 8; A3 = Bogdan; B3 = 10; C3 = 9; D3 = 8; A4 = Carla; B4 = 6; C4 = 7; D4 = 5; A5 = Dan; B5 = 8; C5 = 9; D5 = 10; A6 = Elena; B6 = 7; C6 = 7; D6 = 10; E1 = Media; E2 = =AVERAGE(B2:D2).

Variante:

- =AVERAGE(B5:D5) (corect)

- =AVERAGE(B2:D2)

- =AVERAGE(B2:D5)

- =AVERAGE(E2:E5)

Indiciu (apare după prima greșeală): Din rândul 2 în rândul 5: zona coboară cu trei rânduri.

Explicația de după răspuns: Zona a coborât odată cu rândul: în E5 e =AVERAGE(B5:D5), media lui Dan, 9.

### Încă un exercițiu (pasul 6, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B7** e cea mai mare notă de la Test 1. Trage mânerul de umplere al lui B7 spre dreapta, până la **D7**, ca să afli cea mai mare notă și la celelalte teste.

Foaia de la început: A1 = Elev; B1 = Test 1; C1 = Test 2; D1 = Test 3; A2 = Ana; B2 = 9; C2 = 7; D2 = 8; A3 = Bogdan; B3 = 10; C3 = 9; D3 = 8; A4 = Carla; B4 = 6; C4 = 7; D4 = 5; A5 = Dan; B5 = 8; C5 = 9; D5 = 10; A6 = Elena; B6 = 7; C6 = 7; D6 = 10; A7 = Cea mai mare; B7 = =MAX(B2:B6).

Verificarea automată (verifica): {"formule": {"B7": "=MAX(B2:B6)"}, "umplut": {"B7": ["C7", "D7"]}, "gest": ["umple"]}

Indiciu (apare după prima greșeală): Clic pe B7, apucă pătrățelul din colț și trage spre dreapta, până la D7.

Explicația de după răspuns: C7 are =MAX(C2:C6), adică 9, iar D7 are =MAX(D2:D6), adică 10.

## Atelier: Atelier: cheltuielile săptămânii

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Atelier: cheltuielile săptămânii

Foaia de mai jos se poartă ca Excel-ul pe setări românești, cu panglica lui. Deasupra ei sunt **testele**. Fiecare se bifează singur când partea lui e gata, chiar dacă se schimbă numerele din tabel. Poți scrie funcțiile sau poți folosi butonul Σ; cu Σ, citește zona înainte de Enter. Ai greșit? Ctrl+Z sau ↶. La final apasă **Verifică**.

Ana și Radu și-au scris cât au cheltuit în fiecare zi, în lei. **1.** În **B7** pune suma cheltuielilor Anei. **2.** În **B8** pune cea mai mare cheltuială a ei, iar în **B9** pe cea mai mică. **3.** În **B10** pune media pe zi, doar din zilele B2:B6. **4.** Selectează **B7:B10** și trage mânerul de umplere spre dreapta, până în coloana **C**, ca să ai aceleași calcule pentru Radu.

Foaia de la început: A1 = Ziua; B1 = Ana; C1 = Radu; A2 = Luni; B2 = 12; C2 = 10; A3 = Marți; B3 = 8.5; C3 = 7; A4 = Miercuri; B4 = 15; C4 = 9; A5 = Joi; B5 = 6; C5 = 14; A6 = Vineri; B6 = 10; C6 = 5; A7 = Suma; A8 = Cea mai mare; A9 = Cea mai mică; A10 = Media.

Teste care se bifează: B7 adună cheltuielile Anei, cu SUM; B8 arată cea mai mare cheltuială (MAX), iar B9 cea mai mică (MIN); B10 arată media pe zi (AVERAGE), doar din B2:B6; C7:C10 au aceleași calcule pentru Radu, copiate cu mânerul de umplere

Verificarea automată (verifica): {"formule": {"B7": "=SUM(B2:B6)", "B8": "=MAX(B2:B6)", "B9": "=MIN(B2:B6)", "B10": "=AVERAGE(B2:B6)"}, "umplut": {"B7": ["C7"], "B8": ["C8"], "B9": ["C9"], "B10": ["C10"]}, "gest": ["umple"], "functie": {"B7": "SUM", "B8": "MAX", "B9": "MIN", "B10": "AVERAGE"}}

Indiciu (apare după prima greșeală): În B7 scrii =SUM(B2:B6), în B8 =MAX(B2:B6), în B9 =MIN(B2:B6), iar în B10 =AVERAGE(B2:B6). Dacă folosești Σ ▾, zona propusă prinde și rândurile de deasupra, deci scrii B2:B6 peste ea. Apoi selectezi B7:B10 și tragi pătrățelul din colțul lui B10 până în coloana C.

Explicația de după răspuns: Ana a cheltuit 51,5 lei: cel mult 15 și cel puțin 6 lei pe zi, în medie 10,3. Radu: 45 de lei, între 5 și 14, în medie 9. Schimbă o sumă și urmărește cum se refac toate.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Temperaturile de la ora 8, cinci zile la rând, sunt în **B2:B6**, unele sub zero. **1.** În **B7** pune cea mai mică temperatură. **2.** În **B8** pune cea mai mare. **3.** În **B9** pune media.

Foaia de la început: A1 = Ziua; B1 = Grade; A2 = Luni; B2 = -3; A3 = Marți; B3 = 2; A4 = Miercuri; B4 = 5; A5 = Joi; B5 = -1; A6 = Vineri; B6 = 0; A7 = Cea mai mică; A8 = Cea mai mare; A9 = Media.

Teste care se bifează: B7 arată cea mai mică temperatură (MIN); B8 arată cea mai mare temperatură (MAX); B9 arată media (AVERAGE), doar din B2:B6

Verificarea automată (verifica): {"formule": {"B7": "=MIN(B2:B6)", "B8": "=MAX(B2:B6)", "B9": "=AVERAGE(B2:B6)"}, "functie": {"B7": "MIN", "B8": "MAX", "B9": "AVERAGE"}}

Indiciu (apare după prima greșeală): =MIN(B2:B6), =MAX(B2:B6), =AVERAGE(B2:B6). Zeroul de vineri e un număr, deci intră în medie.

Explicația de după răspuns: Cea mai mică e -3, cea mai mare 5, iar media 0,6: suma 3, împărțită la 5 zile. Zeroul a intrat în medie.

## Acum în aplicația adevărată

1. Descarcă fișierul lectia8_note.xlsx și deschide-l în Excel. Dacă sus apare o bandă galbenă cu butonul **Enable Editing** (Activare editare), apasă pe el: fișierele descărcate se deschid întâi doar pentru citit.

2. În tabel sunt notele a cinci elevi la trei teste. Clic pe **B7**, sub notele de la Test 1. Scrie `=SUM(B2:B6)` și apasă Enter. În B7 trebuie să vezi **40**.

3. Clic pe **B8**. Pe fila **Pornire (Home)**, în dreapta, apasă săgeata **▾** de lângă **Σ** și alege **Medie (Average)**. Excel scrie `=AVERAGE(B2:B7)`: a prins și suma din B7. Scrie **B2:B6** peste zona propusă și apasă Enter. În B8 trebuie să vezi **8**.Dacă nu-ți ieseAlege ce vezi pe ecran. Legăturile cu ↗ se deschid într-o filă nouă; apoi te întorci la fila lecției.

Sus se văd doar numele filelor (Fișier, Pornire, Inserare…; în engleză File, Home, Insert…), fără butoane, deci nu găsești Σ.**De ce:** Panglica e strânsă. Butoanele sunt tot acolo, doar ascunse.

**Ce faci:**

1. Apeși Ctrl+F1: Panglica se deschide la loc.

2. Sau dai dublu-clic pe numele filei Pornire (Home).

**Taste:** Ctrl+F1

Poza din Excel: așa arată ↗

4. În **B9** scrie `=MAX(B2:B6)`, iar în **B10** scrie `=MIN(B2:B6)`. După fiecare apeși Enter. Trebuie să vezi **10** și **6**.

5. Selectează **B7:B10**, trăgând peste ele. Apucă mânerul de umplere, pătrățelul verde din colțul din dreapta-jos al lui B10, și trage spre dreapta până în coloana **D**. Clic pe **D8**: trebuie să vezi **8,2**, iar în bara de formule `=AVERAGE(D2:D6)`.Dacă nu-ți ieseLegăturile cu ↗ se deschid într-o filă nouă; apoi te întorci la fila lecției.

Alte greșeli obișnuite la acest gest și ce faci la ele: în tutorialul „Copiezi formula în jos” ↗. Acolo formula se trage în jos, din D2; la tine tragi spre dreapta, din colțul lui B10.

6. În **E2** scrie `=AVERAGE(B2:D2)` și apasă Enter: media Anei, **8**. Clic din nou pe E2 și trage mânerul de umplere în jos, până la **E6**. Clic pe **E4**: trebuie să vezi **6**, iar în bara de formule `=AVERAGE(B4:D4)`.Dacă nu-ți ieseAlege ce vezi pe ecran. Legăturile cu ↗ se deschid într-o filă nouă; apoi te întorci la fila lecției.

În celulă apare #NAME? (eroare de nume).**De ce:** Numele funcției e scris greșit (AVEGARE în loc de AVERAGE). Excel nu cunoaște funcția.

**Ce faci:**

1. Dai clic pe celulă și te uiți sus, în bara de formule, la numele funcției.

2. Scrii formula din nou. Tastezi =AVER: Excel îți arată lista funcțiilor care încep așa, iar AVERAGE e prima și e deja aleasă.

3. Apeși Tab (sau dai dublu-clic pe AVERAGE în listă): Excel scrie singur =AVERAGE(.

4. Scrii aceeași zonă ca înainte (în poză B2:B4), închizi paranteza ) și apeși Enter.

5. Atenție: dacă tastezi doar =AV și apeși Tab, Excel alege AVEDEV, altă funcție. Ea dă alt număr, fără nicio eroare.

**Taste:** Tab · Enter

Poza din Excel: așa arată ↗

Alte greșeli obișnuite la acest gest și ce faci la ele: în tutorialul „Copiezi formula în jos” ↗. Acolo formula se trage în jos din D2; la tine, din E2 până la E6.

7. Fă proba: clic pe **C6**, nota Elenei la Test 2, scrie **10** și apasă Enter. Fără să atingi funcțiile, C7 trebuie să arate **42**, C8 **8,4**, C9 **10**, iar E6 **9**.

8. Salvează o copie cu numele tău: apasă F12 (Salvare ca / Save As; pe unele laptopuri Fn+F12). În stânga alege **Documente (Documents)**, la **File name** scrie numele tău după modelul `Popescu_Ana_8A_lectia8` și apasă **Save** (Salvare). Dacă apare fereastra Confirm Save As („… already exists”), un coleg are deja un fișier cu numele ăsta: apasă **No**, adaugă o cifră la sfârșitul numelui (de exemplu `Popescu_Ana_8A_lectia8_2`) și apasă din nou **Save**.

## Verificare

### Întrebarea 1

Care formulă calculează media notelor din zona C2:C8?

Variante:

- =AVERAGE(C2:C8) (corect)

- =MEDIE(C2:C8)

- =AVERAGE(C2+C8)

- =SUM(C2:C8)/2

Indiciu (apare după prima greșeală): Numele funcției e în engleză, iar între paranteze stă zona.

Explicația de după răspuns: `=AVERAGE(C2:C8)`. MEDIE dă #NAME?; C2+C8 adună doar două note; suma împărțită la 2 nu e media a 7 note.

### Întrebarea 2

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Punctajele a cinci echipe la concurs sunt în **B2:B6**. În **B7** scrie funcția care arată cel mai mic punctaj.

Foaia de la început: A1 = Echipa; B1 = Puncte; A2 = Șoimii; B2 = 45; A3 = Lupii; B3 = 38; A4 = Vulturii; B4 = 52; A5 = Urșii; B5 = 41; A6 = Delfinii; B6 = 47; A7 = Cel mai mic.

Verificarea automată (verifica): {"formule": {"B7": "=MIN(B2:B6)"}, "functie": {"B7": "MIN"}}

Indiciu (apare după prima greșeală): Cea mai mică valoare: ce funcție?

Explicația de după răspuns: `=MIN(B2:B6)` arată 38, punctajul Lupilor.

### Întrebarea 3

În zona B2:B6 sunt: 6, o celulă goală, 9, 10 și 5. Ce arată `=AVERAGE(B2:B6)`?

Variante:

- 7,5 (corect)

- 6

- 30

- #DIV/0!

Indiciu (apare după prima greșeală): Celula goală nu intră în medie. Câte numere sunt?

Explicația de după răspuns: Sunt 4 numere: 6 + 9 + 10 + 5 fac 30, împărțit la 4 dă 7,5. 6 ar ieși dacă ai împărți la 5.

### Întrebarea 4

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În B7 e suma notelor. Pune în **B8** cea mai mare notă cu săgeata **▾** de lângă Σ › **Max**. Atenție la zona propusă.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ioana; B2 = 7; A3 = Mihai; B3 = 9; A4 = Sara; B4 = 6; A5 = Vlad; B5 = 10; A6 = Rareș; B6 = 8; A7 = Suma; B7 = =SUM(B2:B6); A8 = Cea mai mare.

Verificarea automată (verifica): {"formule": {"B8": "=MAX(B2:B6)"}, "functie": {"B8": "MAX"}, "gest": ["autosum"]}

Indiciu (apare după prima greșeală): Zona propusă prinde și suma din B7. Scrie B2:B6 peste ea, apoi Enter.

Explicația de după răspuns: Cea mai mare notă e 10. Cu zona propusă, B2:B7, ar fi ieșit 40: suma, nu o notă.

### Întrebarea 5

În B8 este formula **=SUM(B2:B7)**. Tragi mânerul de umplere al lui B8 spre dreapta, până la E8. Ce formulă e în E8?

Variante:

- =SUM(E2:E7) (corect)

- =SUM(B2:B7)

- =SUM(B2:E7)

- =SUM(E8:E8)

Indiciu (apare după prima greșeală): Spre dreapta, zona se mută odată cu coloana.

Explicația de după răspuns: Din coloana B în coloana E, zona se mută cu trei coloane: **=SUM(E2:E7)**. Rândurile rămân aceleași.

## Ce am învățat

a calculat suma, media, cea mai mare și cea mai mică valoare cu funcțiile SUM, AVERAGE, MAX și MIN, a folosit butonul Σ Însumare automată și lista lui, a verificat zona propusă înainte de Enter și a copiat funcțiile cu mânerul de umplere
