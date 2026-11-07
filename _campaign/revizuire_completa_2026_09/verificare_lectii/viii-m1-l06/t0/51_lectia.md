## Pasul 1: La ce folosește

Diriginta pune la avizier lista pentru excursie. În Excel, lista arată ca în prima imagine: numele sunt tăiate, datele se văd ca `######`, iar titlul stă în A1, lipit de stânga, nu deasupra tabelului. Nimic nu s-a pierdut: Excel are toate datele, doar că tabelul se citește greu.

**Formatarea** schimbă cum arată tabelul, nu ce conține: cât de late sunt coloanele, locul textului în celulă, liniile, culorile și forma numerelor. Azi faci din prima imagine a doua.

[Imagine]

Sub imagine: Înainte: nume tăiate, date ascunse sub ######.

[Imagine]

Sub imagine: După: aceleași date, ușor de citit.

## Pasul 2: Lățimea coloanei și înălțimea rândului

Fiecare coloană are o **lățime** și fiecare rând o **înălțime**. Dacă o dată nu încape, Excel arată `####`: valoarea e acolo, doar că nu are loc. Un număr se rotunjește întâi (75,5 poate apărea 76; bara de formule arată tot 75,5) și arată `####` abia când nici așa nu încape. Un text prea lung se taie când celula din dreapta e plină.

Ca să lățești coloana C, duci mouse-ul sus, pe linia dintre literele C și D, până apare săgeata dublă ↔, și tragi spre dreapta. Dacă dai **dublu-clic** pe linie, coloana se potrivește singură după cel mai lung conținut al ei.

**Uite cum:**

[Imagine]

Sub imagine: Dublu-clic pe linia dintre C și D: datele se văd. Numele din A așteaptă același gest, pe linia dintre A și B.

Înălțimea rândului o schimbi la fel: tragi în jos de linia de sub numărul lui.

Din panglică: clic pe litera coloanei (o selectezi toată), apoi **Pornire (Home)** › grupul **Celule (Cells)** › **Format** › **AutoFit Column Width** (Potrivire automată). Excel potrivește după celulele selectate; de aceea selectezi toată coloana. **Column Width…** (Lățime coloană…) îți cere un număr.

[Imagine]

Sub imagine: Butonul **Format**, în grupul Celule (Cells).

[Imagine]

Sub imagine: Lista lui: înălțimea rândului și lățimea coloanei.

Vezi filmele pas cu pas: Cum lărgești o coloană ↗ · Lățimea potrivită automat (mai repede) ↗ (se deschid într-o filă nouă; apoi te întorci la fila lecției).

**Explică-mi altfel:**

Gândește-te la o poză prea mare pentru ramă: poza e întreagă, doar rama e mică și o ascunde. Nu refaci poza, mărești rama. La fel, nu rescrii data: lățești coloana.

### Încearcă (pasul 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Datele din coloana **C** se văd ca ####. Lățește coloana C, ca să se vadă datele: trage spre dreapta de linia dintre literele **C** și **D**, sau dă dublu-clic pe ea.

Foaia de la început: A1 = Elev; B1 = Suma; C1 = Data plății; A2 = Ana; B2 = 150; C2 = 28.09.2026; A3 = Bogdan; B3 = 75.5; C3 = 01.10.2026; A4 = Cristi; B4 = 120; C4 = 05.10.2026.

Verificarea automată (verifica): {"forma": {"faraDiez": "C2:C4", "valori": true}}

Indiciu (apare după prima greșeală): Linia e sus, între literele C și D. Pe telefon: atingi litera C, apoi tragi de cercul verde ⇔ de pe marginea ei (sau îl atingi de două ori, repede).

Explicația de după răspuns: Coloana e acum destul de lată: datele se văd, iar valorile au rămas aceleași.

### Încă un exercițiu (pasul 2, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Numele din coloana **A** sunt tăiate. Potrivește coloana A după cel mai lung nume: dublu-clic pe linia dintre literele **A** și **B**.

Foaia de la început: A1 = Elev; B1 = Clasa; A2 = Alexandra Popescu; B2 = 8A; A3 = Bogdan Ionescu; B3 = 8B; A4 = Cristina Munteanu; B4 = 8A.

Verificarea automată (verifica): {"forma": {"vizibil": "A2:A4", "valori": true}}

Indiciu (apare după prima greșeală): Dublu-clic pe linia de sus dintre A și B. Pe telefon: atingi litera A, apoi atingi de două ori cercul verde ⇔.

Explicația de după răspuns: Coloana A s-a potrivit după „Cristina Munteanu”, cel mai lung nume. Acum niciun nume nu mai e tăiat.

### Încă un exercițiu (pasul 2, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Fă rândul **1** mai înalt, cam de două ori: trage în jos de linia de sub numărul **1**, din stânga foii (ca la coloane, dar pe numerele rândurilor).

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Dan; B3 = 10.

Verificarea automată (verifica): {"forma": {"inaltime": {"1": {"min": 25}}}}

Indiciu (apare după prima greșeală): Linia e între numerele 1 și 2, în stânga foii. Pe telefon: atingi numărul 1, apoi tragi în jos cercul verde ⇕.

Explicația de după răspuns: Rândul 1 e mai înalt. Capul de tabel are acum loc, iar restul rândurilor au rămas la fel.

### Încă un exercițiu (pasul 2, varianta 3)

În celula C3 vezi ######. Ce înseamnă?

Variante:

- Data e acolo, dar coloana e prea îngustă (corect)

- Data s-a șters din celulă

- Data a fost scrisă greșit

- Excel nu știe ce e în celulă

Indiciu (apare după prima greșeală): Recitește ce spune pasul despre ####.

Explicația de după răspuns: ####: valoarea e în celulă, dar nu încape. Lățești coloana și o vezi.

## Pasul 3: Alinierea: unde stă conținutul în celulă

**Alinierea conținutului** este locul în care stă conținutul în celulă. De la lecția 5 știi că Excel pune singur numerele la dreapta și textul la stânga. Tu îl muți cu butoanele din fila **Pornire (Home)**, grupul **Aliniere (Alignment)**. Pe ele sunt liniuțe așezate cum va sta textul:

- rândul de jos: **Aliniere la stânga (Align Left)**, **Centrare (Center)**, **Aliniere la dreapta (Align Right)**;

- rândul de sus: sus, **la mijloc (Middle Align)**, jos. Se vede când rândul e înalt.

Întâi selectezi celulele, apoi apeși butonul. Al doilea clic pe același buton scoate alinierea.

[Imagine]

Sub imagine: Grupul **Aliniere (Alignment)**: sus-jos în rândul de sus, stânga-centru-dreapta în rândul de jos.

**Uite cum:**

[Imagine]

Sub imagine: Într-un rând înalt: „Sus” (Top Align), „La mijloc” (Middle Align), „Jos” (cum pune Excel singur).

**Explică-mi altfel:**

E ca atunci când scrii pe o etichetă: poți scrie lipit de marginea din stânga, la mijloc sau spre dreapta. Eticheta e aceeași, doar locul scrisului se schimbă.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Centrează codurile biletelor din **B2:B4**: selectează zona, apoi **Pornire (Home)** › **Centrare (Center)**.

Foaia de la început: A1 = Elev; B1 = Cod bilet; A2 = Ana; B2 = '001; A3 = Bogdan; B3 = '002; A4 = Cristi; B4 = '003.

Verificarea automată (verifica): {"forma": {"al": {"B2:B4": "center"}}}

Indiciu (apare după prima greșeală): Tragi de la B2 la B4, apoi butonul din mijloc, rândul de jos al grupului Aliniere (Alignment).

Explicația de după răspuns: Codurile stau acum la mijlocul celulelor, pe toată zona B2:B4.

### Încă un exercițiu (pasul 3, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Capul de tabel **B1:C1** stă la stânga, iar sumele de sub el stau la dreapta. Aliniază **B1:C1** la dreapta, deasupra numerelor.

Foaia de la început: A1 = Elev; B1 = Suma; C1 = Rest; A2 = Ana; B2 = 150; C2 = 0; A3 = Bogdan; B3 = 75.5; C3 = 74.5.

Verificarea automată (verifica): {"forma": {"al": {"B1:C1": "right"}}}

Indiciu (apare după prima greșeală): Selectezi B1:C1, apoi Aliniere la dreapta (Align Right), ultimul buton din rândul de jos.

Explicația de după răspuns: „Suma” și „Rest” stau acum deasupra numerelor lor, la dreapta.

### Încă un exercițiu (pasul 3, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Rândul 1 e înalt, iar titlul din **A1** stă jos, lipit de linie. Mută-l la mijlocul rândului: **Aliniere la mijloc (Middle Align)**.

Foaia de la început: A1 = Note; A2 = Ana; B2 = 9.

Verificarea automată (verifica): {"forma": {"va": {"A1": "middle"}}}

Indiciu (apare după prima greșeală): E butonul din mijloc, pe rândul de sus al grupului Aliniere (Alignment).

Explicația de după răspuns: Titlul stă acum la jumătatea înălțimii rândului.

### Încă un exercițiu (pasul 3, varianta 3)

(Adevărat sau fals?)

Apeși o dată pe Centrare (Center) și celula se centrează. Dacă mai apeși o dată pe același buton, celula rămâne centrată.

Răspuns: Fals

Indiciu (apare după prima greșeală): Recitește ultima propoziție a pasului.

Explicația de după răspuns: Fals. Al doilea clic scoate alinierea: celula revine la cea pusă de Excel (numărul la dreapta, textul la stânga).

## Pasul 4: Titlul peste tabel și textul lung

Titlul stă în A1, dar trebuie să fie deasupra întregului tabel. Selectezi A1:D1 și apeși **Îmbinare și centrare (Merge & Center)**: cele patru celule devin una, cu titlul la mijloc. Dacă zona are mai multe valori, Excel păstrează doar prima, cea din stânga-sus, și le șterge pe celelalte, după ce te avertizează.

Un text lung îl așezi pe mai multe rânduri, în aceeași celulă, cu **Încadrare text (Wrap Text)**: rândul crește singur.

Îmbină titlul înainte să potrivești coloana A: dublu-clicul ține cont de tot ce e în coloană, deci și de titlul lung din A1.

**Uite cum:**

[Imagine]

Sub imagine: Merge & Center pe A1:D1: o singură celulă, cât tot tabelul (chenarul verde), cu titlul la mijloc.

[Imagine]

Sub imagine: Avertismentul: „îmbinarea păstrează doar valoarea din stânga-sus”. Cancel (Revocare) = nu se îmbină nimic.

[Imagine]

Sub imagine: Wrap Text pe A15: observația stă pe trei rânduri, în aceeași celulă.

**Explică-mi altfel:**

E ca la un afiș făcut din patru foi lipite una lângă alta: titlul se scrie o singură dată, pe mijlocul tuturor. Pe afiș nu mai rămâne loc pentru alt text, de aceea Excel șterge ce mai era în celelalte celule.

### Încearcă (pasul 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Pune titlul deasupra întregului tabel: selectează **A1:D1**, apoi **Merge & Center** (Îmbinare și centrare).

Foaia de la început: A1 = Excursia clasei a VIII-a; A2 = Elev; B2 = Suma; C2 = Data plății; D2 = Cod bilet; A3 = Ana; B3 = 150; C3 = 28.09.2026; D3 = '001.

Verificarea automată (verifica): {"forma": {"imbinat": "A1:D1", "centrat": true, "valori": true}}

Indiciu (apare după prima greșeală): Tragi de la A1 la D1 (tot rândul tabelului), apoi butonul Merge & Center din grupul Aliniere (Alignment).

Explicația de după răspuns: A1:D1 e acum o singură celulă, cu titlul la mijloc, deasupra celor patru coloane.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **B2** e o observație lungă, care trece peste celula din dreapta. Așaz-o pe mai multe rânduri, în aceeași celulă: selectează B2 și apasă **Wrap Text** (Încadrare text).

Foaia de la început: A1 = Elev; B1 = Observație; A2 = Ana; B2 = Plătește restul în octombrie, la dirigintă; A3 = Bogdan; B3 = Plătit.

Verificarea automată (verifica): {"forma": {"wrap": {"B2": true}}}

Indiciu (apare după prima greșeală): Butonul Wrap Text e în grupul Aliniere (Alignment), sus, în dreapta.

Explicația de după răspuns: Observația stă acum pe mai multe rânduri în B2, iar rândul 2 s-a înălțat singur.

### Încă un exercițiu (pasul 4, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **A1** e titlul, iar în **C1** a rămas din greșeală un x. Îmbină **A1:C1** cu **Merge & Center**. Ce se întâmplă cu x?

Foaia de la început: A1 = Excursia clasei; C1 = x; A2 = Elev; B2 = Suma; C2 = Data.

Variante:

- Excel te avertizează, iar după OK x dispare (corect)

- x se mută în rândul 2, sub titlu

- Excel nu te lasă să îmbini celulele

- x rămâne lângă titlu, în celula îmbinată

Indiciu (apare după prima greșeală): Încearcă în foaie și citește fereastra care apare.

Explicația de după răspuns: Zona are două valori. Excel te avertizează că păstrează doar valoarea din stânga-sus; după OK, x se șterge. Cu Ctrl+Z (↶) îl aduci înapoi.

### Încă un exercițiu (pasul 4, varianta 3)

Selectezi A1:C1. Doar A1 are ceva scris: titlul. Apeși Merge & Center. Apare avertismentul?

Variante:

- Nu: e o singură valoare, deci nu se pierde nimic (corect)

- Da: apare la orice îmbinare de celule

- Da, dar doar dacă titlul e foarte lung

- Nu, fiindcă Excel nu îmbină celule goale

Indiciu (apare după prima greșeală): Când te avertizează Excel? Ce s-ar pierde aici?

Explicația de după răspuns: Avertismentul apare doar când zona are mai multe valori. Aici e numai titlul, deci Excel îmbină fără să întrebe.

## Pasul 5: Borduri, culoare de umplere și stiluri

Liniile gri ale foii nu apar la tipărire. Liniile tabelului le pui tu, cu **Borduri (Borders)**: butonul cu un pătrățel punctat, în grupul Font, rândul de jos. Săgeata ▾ din dreapta lui deschide lista, iar **Toate bordurile (All Borders)** trage o linie în jurul fiecărei celule selectate. Un clic pe pictogramă pune o singură bordură: la început, pe cea de jos.

**Culoare de umplere (Fill Color)**, butonul cu găleată de lângă el, colorează fundalul celulei. **B** (Bold, aldin) îngroașă literele. Împreună scot în evidență capul de tabel.

[Imagine]

Sub imagine: În grupul **Font**: Borders (Borduri) și Fill Color (Culoare de umplere). Săgeata ▾ din dreapta fiecăruia deschide lista.

**Uite cum:**

[Imagine]

Sub imagine: Lista **Borders**: **All Borders** pune linii pe toate laturile fiecărei celule.

Capul de tabel: selectezi A2:D2, apeși B și găleata. Tot tabelul: selectezi A2:D6, apoi Borders ▾ › All Borders.

Un **stil predefinit** e o formatare gata făcută, pusă dintr-un clic: Pornire (Home) › **Stiluri celule (Cell Styles)**, de exemplu **Title** pentru un titlu sau **Good** (verde) pentru un rezultat bun.

[Imagine]

Sub imagine: Galeria **Cell Styles**: stiluri gata făcute, între ele **Title** și **Good**.

Vezi filmul pas cu pas: Scris îngroșat cu Ctrl+B ↗ (se deschide într-o filă nouă; apoi te întorci la fila lecției).

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Pune linii pe tot tabelul **A1:C4**: selectează-l, apoi săgeata ▾ de lângă **Borders** (Borduri) › **All Borders** (Toate bordurile).

Foaia de la început: A1 = Elev; B1 = Suma; C1 = Cod; A2 = Ana; B2 = 150; C2 = '001; A3 = Bogdan; B3 = 75.5; C3 = '002; A4 = Cristi; B4 = 120; C4 = '003.

Verificarea automată (verifica): {"forma": {"borduri": {"A1:C4": "toate"}}}

Indiciu (apare după prima greșeală): Tragi de la A1 la C4. Butonul Borders e în grupul Font; lista se deschide de la săgeata lui.

Explicația de după răspuns: Fiecare celulă din A1:C4 are acum linii pe toate laturile, iar pe hârtie tabelul arată ca un tabel.

### Încă un exercițiu (pasul 5, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scoate în evidență capul de tabel **A1:C1**: fă-l aldin (**B**) și pune-i o culoare de umplere (găleata **Fill Color**).

Foaia de la început: A1 = Echipa; B1 = Puncte; C1 = Loc; A2 = Roboții; B2 = 87; C2 = 1; A3 = Inventatorii; B3 = 79; C3 = 2.

Verificarea automată (verifica): {"forma": {"b": {"A1:C1": true}, "fill": {"A1:C1": true}}}

Indiciu (apare după prima greșeală): Selectezi A1:C1, apoi B și găleata. Săgeata ▾ de lângă găleată deschide celelalte culori.

Explicația de după răspuns: Capul de tabel e aldin și colorat: se deosebește dintr-o privire de date.

### Încă un exercițiu (pasul 5, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Pune pe titlul din **A1** stilul **Title**: **Pornire (Home)** › **Cell Styles** (Stiluri celule) › Title.

Foaia de la început: A1 = Rezultatele concursului; A2 = Echipa; B2 = Puncte; A3 = Roboții; B3 = 87.

Verificarea automată (verifica): {"forma": {"stil": {"A1": "Title"}}}

Indiciu (apare după prima greșeală): Cell Styles e în grupul Stiluri (Styles). Title e în partea „Titles and Headings”.

Explicația de după răspuns: Stilul Title a pus dintr-un clic literele mari și culoarea titlului. Rândul 1 s-a înălțat singur.

### Încă un exercițiu (pasul 5, varianta 3)

(Adevărat sau fals?)

Liniile gri pe care le vezi pe foaie apar și pe hârtie, când tipărești tabelul.

Răspuns: Fals

Indiciu (apare după prima greșeală): Recitește prima propoziție a pasului.

Explicația de după răspuns: Fals. Liniile gri ale foii nu se tipăresc. Pe hârtie apar doar bordurile, puse de tine.

## Pasul 6: Forma numerelor: zecimale, procent, dată

Grupul **Număr (Number)** schimbă forma în care se vede un număr, nu numărul:

- **Mărire zecimale (Increase Decimal)** și **Micșorare zecimale (Decrease Decimal)**: 7,5 se vede 7,50 sau 8;

- **%** (Percent Style): 0,25 se vede 25%;

- lista **Format număr (Number Format)** › **Long Date**: data 05.10.2026 se vede „luni, 5 octombrie 2026”.

Valoarea din spate rămâne aceeași și o vezi în bara de formule. Dacă celula arată 7,13, iar bara de formule arată 7,125, Excel calculează cu 7,125. Un număr căruia i-ai ales zecimalele nu se mai rotunjește ca să încapă: dacă nu are loc, arată ####.

[Imagine]

Sub imagine: Grupul **Număr (Number)**: lista de formate sus; jos %, apoi Increase Decimal (săgeata albastră spre stânga, cu .00) și Decrease Decimal (săgeata spre dreapta, cu .0).

**Uite cum:**

[Imagine]

Sub imagine: B1 arată 7,13, dar bara de formule arată valoarea: 7,125.

[Imagine]

Sub imagine: B2 arată 13%, dar valoarea e 12,5%, adică 0,125.

[Imagine]

Sub imagine: Lista **Number Format** îți arată dinainte cum va arăta numărul.

**Explică-mi altfel:**

E ca ora de pe ceas: „14:30” și „două și jumătate” spun aceeași oră, scrisă altfel. Formatul schimbă doar cum e scris numărul, nu cât e.

### Încearcă (pasul 6)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Sumele din **B2:B4** trebuie să se vadă cu două zecimale, ca 150,00. Selectează B2:B4 și apasă **Increase Decimal** (Mărire zecimale) până se văd două zecimale.

Foaia de la început: A1 = Elev; B1 = Suma; A2 = Ana; B2 = 150; A3 = Bogdan; B3 = 75.5; A4 = Cristi; B4 = 120.

Verificarea automată (verifica): {"forma": {"format": {"B2:B4": {"zecimale": 2}}, "valori": true}}

Indiciu (apare după prima greșeală): Increase Decimal e în grupul Număr (Number), rândul de jos, al patrulea buton: săgeata albastră spre stânga, cu 0 deasupra și .00 dedesubt. Merge și lista Number Format › Number.

Explicația de după răspuns: Sumele se văd acum 150,00, 75,50 și 120,00. În bara de formule, valorile sunt tot 150, 75,5 și 120.

### Încă un exercițiu (pasul 6, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **C2:C4** sunt reducerile de preț: 0,1, 0,25 și 0,5. Arată-le ca procente, cu butonul **%** (Percent Style).

Foaia de la început: A1 = Produs; B1 = Preț; C1 = Reducere; A2 = Caiet; B2 = 8; C2 = 0.1; A3 = Stilou; B3 = 25; C3 = 0.25; A4 = Rucsac; B4 = 120; C4 = 0.5.

Verificarea automată (verifica): {"forma": {"format": {"C2:C4": {"procent": 0}}, "valori": true}}

Indiciu (apare după prima greșeală): Selectezi C2:C4, apoi butonul % din grupul Număr (Number).

Explicația de după răspuns: Reducerile se văd acum 10%, 25% și 50%. Valorile din spate sunt tot 0,1, 0,25 și 0,5.

### Încă un exercițiu (pasul 6, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Data excursiei din **B1** să se vadă lung, cu ziua săptămânii: lista **Number Format** (Format număr) › **Long Date**.

Foaia de la început: A1 = Excursia; B1 = 09.10.2026.

Verificarea automată (verifica): {"forma": {"format": {"B1": {"data": "lunga"}}, "faraDiez": "B1", "valori": true}}

Indiciu (apare după prima greșeală): Clic pe B1, apoi lista de sus din grupul Număr (Number). Long Date e a șasea în listă.

Explicația de după răspuns: B1 arată acum „vineri, 9 octombrie 2026”, iar Excel a lățit singur coloana ca să încapă.

### Încă un exercițiu (pasul 6, varianta 3)

Celula arată 8, iar bara de formule arată 7,5. Cu ce număr face Excel calculele?

Variante:

- Cu 7,5 (corect)

- Cu 8

- Cu 7,50

- Cu 7

Indiciu (apare după prima greșeală): Ce vezi în bara de formule?

Explicația de după răspuns: Cu 7,5. Celula doar arată numărul rotunjit (Decrease Decimal); valoarea din spate e 7,5.

## Atelier: Atelier: lista excursiei, gata de pus la avizier

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Atelier: lista excursiei, gata de pus la avizier

Foaia de mai jos se poartă ca Excel-ul, cu fila **Pornire (Home)** a panglicii. Deasupra ei sunt **testele**: fiecare se bifează singur când partea lui e gata. Ai greșit? Ctrl+Z sau ↶. La final apasă **Verifică**.

Coloanele le potrivești la urmă: după ce se lățesc, tabelul nu mai încape pe ecranul unui telefon și trebuie să derulezi foaia.

[Imagine]

Sub imagine: Așa iese dacă potrivești coloana A înainte să îmbini titlul: A se lățește după titlu. Îmbină întâi titlul.

Fă din lista brută tabelul din imaginea „După”. **1.** Îmbină și centrează titlul peste **A1:D1**. **2.** Capul de tabel **A2:D2**: aldin și o culoare de umplere. **3.** Borduri pe toate laturile, pe **A2:D6**. **4.** Sumele **B3:B6** cu două zecimale. **5.** La urmă, potrivește coloanele **A** și **C**, ca numele și datele să se vadă întregi.

Foaia de la început: A1 = Excursia clasei a VIII-a la Cheile Bicazului; A2 = Elev; B2 = Suma; C2 = Data plății; D2 = Cod bilet; A3 = Ana Popescu; B3 = 150; C3 = 28.09.2026; D3 = '001; A4 = Bogdan Ionescu; B4 = 75.5; C4 = 01.10.2026; D4 = '002; A5 = Cristina Munteanu; B5 = 120; C5 = 05.10.2026; D5 = '003; A6 = Dan Vasilescu; B6 = 150; C6 = 06.10.2026; D6 = '004.

Teste care se bifează: Titlul e îmbinat și centrat peste A1:D1; Capul de tabel A2:D2 e aldin și colorat; Tot tabelul A2:D6 are borduri pe toate laturile; Sumele din B3:B6 se văd cu două zecimale; Numele din coloana A se văd întregi; Datele din coloana C se văd, fără ####

Verificarea automată (verifica): {"forma": {"valori": true, "imbinat": "A1:D1", "centrat": true, "b": {"A2:D2": true}, "fill": {"A2:D2": true}, "borduri": {"A2:D6": "toate"}, "format": {"B3:B6": {"zecimale": 2}}, "vizibil": "A3:A6", "faraDiez": "C3:C6"}}

Indiciu (apare după prima greșeală): Titlul întâi (altfel dublu-clicul pe coloana A o lățește după titlu). Apoi A2:D2 → B și găleata. A2:D6 → Borders ▾ › All Borders. B3:B6 → Increase Decimal de două ori. La urmă, dublu-clic pe liniile dintre A și B, C și D (pe telefon: atingi litera, apoi de două ori cercul verde ⇔).

Explicația de după răspuns: Lista se citește acum dintr-o privire: titlul deasupra, numele și datele întregi, capul de tabel evidențiat, linii pe tot tabelul, sumele cu două zecimale. Valorile au rămas aceleași.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Rezultatele concursului de robotică. **1.** Îmbină și centrează titlul peste **A1:C1**. **2.** Capul de tabel **A2:C2**: aldin și colorat. **3.** Borduri pe toate laturile, pe **A2:C5**. **4.** Reușita din **C3:C5** ca procent, cu butonul **%**. **5.** La urmă, potrivește coloana **A**.

Foaia de la început: A1 = Concursul de robotică: rezultate; A2 = Echipa; B2 = Puncte; C2 = Reușită; A3 = Roboții din Bicaz; B3 = 87; C3 = 0.87; A4 = Inventatorii; B4 = 79; C4 = 0.79; A5 = Mecanicii veseli; B5 = 92; C5 = 0.92.

Teste care se bifează: Titlul e îmbinat și centrat peste A1:C1; Capul de tabel A2:C2 e aldin și colorat; Tabelul A2:C5 are borduri pe toate laturile; Reușita din C3:C5 se vede ca procent; Numele echipelor se văd întregi

Verificarea automată (verifica): {"forma": {"valori": true, "imbinat": "A1:C1", "centrat": true, "b": {"A2:C2": true}, "fill": {"A2:C2": true}, "borduri": {"A2:C5": "toate"}, "format": {"C3:C5": {"procent": 0}}, "vizibil": "A3:A5"}}

Indiciu (apare după prima greșeală): Aceeași ordine ca la listă: titlul, capul de tabel, bordurile, procentul, iar la urmă coloana A.

Explicația de după răspuns: Tabelul concursului e gata: titlu deasupra, nume întregi, cap de tabel evidențiat, linii și procente.

## Acum în aplicația adevărată

1. Descarcă fișierul excursia_clasei.xlsx și deschide-l în Excel. Dacă sus apare o bandă galbenă cu butonul **Enable Editing** (Activare editare), apasă pe el: fișierele descărcate se deschid întâi doar pentru citit.

2. Uită-te la tabel: numele din coloana A sunt tăiate, iar datele din coloana C se văd ca `####`.

3. Îmbină titlul: selectează **A1:D1** și apasă **Merge & Center** (Îmbinare și centrare), în fila **Home** (Pornire).

4. Selectează capul de tabel **A2:D2**, apasă **B** (Bold) și găleata **Fill Color** (Culoare de umplere).

5. Selectează tot tabelul, **A2:D6**, apoi săgeata ▾ de lângă **Borders** (Borduri) › **All Borders** (Toate bordurile).

6. Selectează sumele **B3:B6** și apasă **Increase Decimal** (Mărire zecimale; săgeata albastră spre stânga, cu .00) până se văd două zecimale: **150,00**.

7. La urmă, potrivește coloanele: dă dublu-clic pe linia dintre literele **A** și **B**, sus, apoi pe linia dintre **C** și **D**. Acum numele și datele se văd întregi.Dacă nu-ți ieseAlege ce vezi pe ecran. Legăturile cu ↗ se deschid într-o filă nouă; apoi te întorci la fila lecției.

S-a colorat toată coloana A, dar lățimea nu s-a schimbat.**De ce:** Ai dat clic pe litera A, nu pe linia de lângă ea, sau cele două clicuri au fost prea rare. Un clic pe literă selectează toată coloana.

**Ce faci:**

1. Muți mouse-ul încet spre dreapta, pe linia dintre A și B, până cursorul devine săgeată dublă ↔.

2. Abia atunci dai două clicuri repezi.

Poza din Excel: așa arată ↗

Ai dat dublu-clic, dar numele din coloana A sunt tot tăiate.**De ce:** Ai dat dublu-clic pe linia dintre B și C, deci s-a potrivit coloana B, nu A.

**Ce faci:**

1. Duci mouse-ul pe linia dintre A și B (lângă litera A), până devine săgeată dublă ↔.

2. Dai acolo dublu-clic.

Poza din Excel: așa arată ↗

În celulă apar doar semne ##### în loc de dată (sau de număr).**De ce:** Coloana e prea îngustă pentru ce e în celulă. Excel nu taie o dată sau un număr, ca să nu-l citești greșit, ci arată #####.

**Ce faci:**

1. Duci mouse-ul sus, pe linia din dreapta literei coloanei, până devine săgeată dublă ↔.

2. Tragi spre dreapta (sau dai dublu-clic pe linie) până apare data întreagă.

Poza din Excel: așa arată ↗

Coloana A s-a făcut foarte lată după dublu-clic? Înseamnă că titlul din A1 nu e încă îmbinat, iar dublu-clicul a potrivit coloana după el. Faci acum pasul 3 (îmbini titlul peste A1:D1), apoi dai din nou dublu-clic pe linia dintre A și B: coloana A se potrivește după nume.

8. Verifică singur valoarea din spate: clic pe **B4**. Celula arată **75,50**, iar bara de formule arată **75,5**. Formatarea n-a schimbat numărul.

9. Salvează o copie cu numele tău: **File** (Fișier) › **Save As** (Salvare ca), cu numele `Nume_Prenume_lectia6.xlsx`.

## Verificare

### Întrebarea 1

Celula C4 arată 4%, iar bara de formule arată 3,6%. Cu ce valoare calculează Excel?

Variante:

- Cu 3,6%, adică 0,036 (corect)

- Cu 4%, adică 0,04

- Cu 3%, fără zecimale

- Cu 36%, fără virgulă

Indiciu (apare după prima greșeală): Unde vezi valoarea din spate?

Explicația de după răspuns: Bara de formule arată valoarea: 3,6%, adică 0,036. Celula doar o arată rotunjită, 4%.

### Întrebarea 2

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Punctajele din coloana **B** se văd ca ####. Fă-le să se vadă, fără să le schimbi.

Foaia de la început: A1 = Echipa; B1 = Punctaj; A2 = Roboții; B2 = 1234.5; A3 = Mecanicii; B3 = 987.25; A4 = Inventatorii; B4 = 1502.

Verificarea automată (verifica): {"forma": {"faraDiez": "B2:B4", "format": {"B2:B4": {"zecimale": 2}}, "valori": true}}

Indiciu (apare după prima greșeală): Coloana e prea îngustă. Linia ei e sus, între literele B și C.

Explicația de după răspuns: Coloana B e acum destul de lată: punctajele se văd întregi, cu cele două zecimale, iar valorile sunt aceleași.

### Întrebarea 3

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Titlul din **A1** trebuie să stea deasupra întregului orar: îmbină și centrează **A1:C1**.

Foaia de la început: A1 = Orarul clubului de robotică; A2 = Ziua; B2 = Sala; C2 = Ora; A3 = Marți; B3 = Laboratorul TIC; C3 = 14.

Verificarea automată (verifica): {"forma": {"imbinat": "A1:C1", "centrat": true, "valori": true}}

Indiciu (apare după prima greșeală): Selectezi A1:C1, apoi Merge & Center.

Explicația de după răspuns: A1:C1 e o singură celulă, cu titlul la mijlocul orarului.

### Întrebarea 4

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Tabelul notelor: fă capul de tabel **A1:C1** aldin (**B**) și pune borduri pe toate laturile, pe tot tabelul **A1:C4**.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ioana; B2 = 9; C2 = 10; A3 = Mihai; B3 = 7; C3 = 8; A4 = Radu; B4 = 10; C4 = 9.

Verificarea automată (verifica): {"forma": {"b": {"A1:C1": true}, "borduri": {"A1:C4": "toate"}}}

Indiciu (apare după prima greșeală): Două selecții: A1:C1 → B; A1:C4 → Borders ▾ › All Borders.

Explicația de după răspuns: Capul de tabel e aldin, iar toate celulele au linii pe toate laturile.

### Întrebarea 5

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Prezența la cercul de lectură, în **B2:B4**, e scrisă ca 0,8, 0,95 și 1. Arat-o ca procent: 80%, 95%, 100%.

Foaia de la început: A1 = Săptămâna; B1 = Prezență; A2 = 1; B2 = 0.8; A3 = 2; B3 = 0.95; A4 = 3; B4 = 1.

Verificarea automată (verifica): {"forma": {"format": {"B2:B4": {"procent": 0}}, "valori": true}}

Indiciu (apare după prima greșeală): Butonul % din grupul Număr (Number).

Explicația de după răspuns: Prezența se vede acum 80%, 95% și 100%; valorile din spate au rămas 0,8, 0,95 și 1.

## Ce am învățat

a lățit coloane și a înălțat rânduri, a aliniat conținutul, a îmbinat un titlu, a așezat un text lung pe mai multe rânduri, a pus borduri, culori și stiluri și a schimbat forma numerelor fără să le schimbe valoarea
