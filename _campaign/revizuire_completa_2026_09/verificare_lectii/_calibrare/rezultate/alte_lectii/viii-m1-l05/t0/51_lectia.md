## Pasul 1: La ce folosește

Diriginta ține în Excel lista pentru excursia clasei: numele elevilor, suma plătită de fiecare, data plății și codul biletului, de exemplu 007.

Excel nu vede ce vezi tu. El vede un **tip de date**: număr, text sau dată calendaristică. Cu numerele poate face calcule, iar datele le știe din calendar. Dacă scrii nota 7,5 cu punct, adică 7.5, Excel o ia drept data de 7 mai.

Azi înveți să scrii fiecare tip așa încât Excel să-l recunoască și să vezi ce a înțeles.

[Imagine]

Legenda imaginii: Un catalog adevărat din Excel: numele stau la stânga, notele (și 9,5 sau 7,5, scrise cu virgulă) stau la dreapta. Nimeni nu le-a aliniat de mână: Excel a recunoscut singur ce e fiecare.

## Pasul 2: Trei tipuri de date

În fiecare celulă, Excel ține un singur lucru, de un anumit tip:

- **numeric** (număr): 12, -4, 7,5. Cu numerele, Excel poate face calcule;

- **text**: Ana, 7B, 12 elevi. Cuvinte sau cifre amestecate cu litere. Excel doar le arată;

- **dată calendaristică**: 05.10.2026. Scrii ziua, luna și anul, despărțite prin puncte. Excel știe că e o zi din calendar.

**Atenție:** „7B” și „12 elevi” încep cu cifre, dar au și litere, deci sunt text.

**Uite cum:**

[Foaie desenată: coloanele A–D, rândurile 1–2; celule completate: A1 = Elev, B1 = Clasa, C1 = Suma, D1 = Data plății, A2 = Ana, B2 = 8B, C2 = 150, D2 = 28.09.2026]

Rândul Anei din lista excursiei: „Ana” și „8B” sunt text, 150 e număr, 28.09.2026 e dată calendaristică. Observă unde s-a așezat fiecare; afli de ce la pasul următor.

**Explică-mi altfel:**

Gândește-te la un formular de înscriere: la „Vârsta” scrii un număr, la „Numele” scrii litere, la „Data nașterii” scrii o dată. Excel face la fel: fiecare celulă ține un lucru de un anumit fel.

### Încearcă (pasul 2)

Ce tip de date e fiecare valoare, scrisă singură într-o celulă?

Categorii: Număr; Text; Dată calendaristică

- -4 → Număr

- Ana → Text

- 05.10.2026 → Dată calendaristică

- 12 elevi → Text

Indiciu (apare după prima greșeală): Are și litere? Atunci e text, chiar dacă începe cu o cifră. Zi, lună, an cu puncte? E dată.

Explicația de după răspuns: -4 e număr; „Ana” și „12 elevi” sunt text; 05.10.2026 e dată calendaristică.

### Încă un exercițiu (pasul 2, varianta 1)

Ce tip de date e fiecare valoare, scrisă singură într-o celulă?

Categorii: Număr; Text; Dată calendaristică

- 7,5 → Număr

- 7B → Text

- 01.12.2026 → Dată calendaristică

- clasa a VIII-a → Text

- 250 → Număr

Indiciu (apare după prima greșeală): Cifre amestecate cu litere sunt text.

Explicația de după răspuns: 7,5 și 250 sunt numere; „7B” și „clasa a VIII-a” sunt text; 01.12.2026 e dată calendaristică.

### Încă un exercițiu (pasul 2, varianta 2)

Cu care dintre acestea poate Excel să facă un calcul?

Variante:

- -4 (corect)

- 3 mere

- 7B

- Ana

Indiciu (apare după prima greșeală): Caută valoarea care e doar un număr.

Explicația de după răspuns: -4 e număr. „3 mere”, „7B” și „Ana” sunt text: Excel doar le arată.

## Pasul 3: Alinierea îți arată tipul

Cum afli ce a înțeles Excel? Te uiți unde s-a așezat conținutul în celulă, după Enter. Dacă nu ai aliniat tu nimic, Excel pune:

- **numerele și datele la dreapta**;

- **textul la stânga**.

De ce și datele la dreapta? Pentru Excel, o dată e tot un număr: numărul zilei în calendarul lui. De exemplu, 05.10.2026 e, pentru el, ziua 46300.

[Imagine]

Legenda imaginii: În Excel: numărul 250 și data 15.09.2026 stau la dreapta, textul „Ana” stă la stânga.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–3; celule completate: A1 = 12, A2 = Ana, A3 = 05.10.2026]

Ai scris 12 în A1, Ana în A2 și 05.10.2026 în A3: 12 și data s-au dus la dreapta, Ana la stânga.

**Explică-mi altfel:**

Alinierea e ca eticheta de pe un borcan: fără să-l deschizi, știi ce e înăuntru. Te uiți de care margine s-a lipit conținutul și afli ce tip a înțeles Excel.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B2** numărul **12**, în **B3** cuvântul **Ana** și în **B4** data **05.10.2026**. După fiecare apeși Enter. Uită-te unde se așază fiecare.

Foaia de la început: A1 = Ce scrii; B1 = În celulă; A2 = număr; A3 = text; A4 = dată.

Verificarea automată (verifica): {"tip": {"B2": {"numar": 12}, "B3": {"text": "Ana"}, "B4": {"data": "05.10.2026"}}}

Indiciu (apare după prima greșeală): Clic pe B2, scrie 12 și apasă Enter: ajungi singur în B3. Data se scrie cu puncte între zi, lună și an.

Explicația de după răspuns: 12 și data stau la dreapta, „Ana” stă la stânga: Excel le-a recunoscut pe toate trei.

### Încă un exercițiu (pasul 3, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie **7B** în **A1** și apasă Enter. Unde s-a așezat?

Variante:

- La stânga, pentru că e text (corect)

- La dreapta, pentru că e număr

- La mijlocul celulei

- A dispărut din celulă

Indiciu (apare după prima greșeală): Încearcă în foaie. Are și litere?

Explicația de după răspuns: „7B” are o literă, deci e text și stă la stânga.

### Încă un exercițiu (pasul 3, varianta 2)

(Adevărat sau fals?)

Data 05.10.2026, recunoscută de Excel, stă la stânga celulei, ca textul.

Răspuns: Fals

Indiciu (apare după prima greșeală): Recitește prima regulă din listă.

Explicația de după răspuns: Fals. Datele stau la dreapta, ca numerele: pentru Excel, o dată e tot un număr.

## Pasul 4: Zecimalele se scriu cu virgulă

Pe un calculator cu **setări românești**, zecimalele se scriu cu **virgulă**: `7,5`. Excel îl înțelege ca număr și îl pune la dreapta.

Cu punct nu merge. La noi, punctul e semnul din date (05.10.2026), așa că Excel face din `7.5` data de 7 mai: în celulă apare `07.mai`. Stă tot la dreapta, dar nu mai e nota ta!

Pe calculatoarele cu setări englezești e invers: zecimala se scrie cu punct. Foaia din pagină are setări românești.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–3; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 7,5, A3 = Bogdan, B3 = 07.mai]

În B2 s-a scris 7,5 (cu virgulă): e nota. În B3 s-a scris 7.5 (cu punct): a devenit data de 7 mai.

La fel pățesc `9.5`, care devine `09.mai`, și `6.75`, care devine `iun.75`, adică iunie 1975.

**Explică-mi altfel:**

Pe bonul de la magazin scrie 7,50 lei, cu virgulă. Excel-ul cu setări românești citește numerele la fel ca noi: virgula desparte zecimalele.

### Încearcă (pasul 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie notele: **9,5** în **B2** (Ana) și **7,5** în **B3** (Bogdan).

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; A3 = Bogdan.

Verificarea automată (verifica): {"tip": {"B2": {"numar": 9.5}, "B3": {"numar": 7.5}}}

Indiciu (apare după prima greșeală): Zecimala se scrie cu virgulă: 9,5 și 7,5. Dacă a apărut o dată, apasă Ctrl+Z și scrie din nou.

Explicația de după răspuns: Cu virgulă, 9,5 și 7,5 sunt numere: stau la dreapta și Excel poate calcula cu ele.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B2** **7.5**, cu punct, și apasă Enter. Ce apare în celulă?

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana.

Variante:

- 07.mai, la dreapta (corect)

- 7,5, la dreapta

- 7.5, la stânga

- Nimic, celula rămâne goală

Indiciu (apare după prima greșeală): Încearcă în foaie. Pe setări românești, punctul e semnul din date.

Explicația de după răspuns: Pe setări românești, punctul desparte ziua de lună: 7.5 devine data de 7 mai. Nota se scrie 7,5.

### Încă un exercițiu (pasul 4, varianta 2)

Pe un calculator cu setări românești, cum scrii nota opt și jumătate?

Variante:

- 8,5 (corect)

- 8.5

- 8 și 5

- 8/5

Indiciu (apare după prima greșeală): Cu ce semn se scriu zecimalele pe setări românești?

Explicația de după răspuns: Cu virgulă: 8,5. Scrisă cu punct sau cu bară, Excel face din ea o dată: 08.mai.

## Pasul 5: Ai greșit tipul? Ctrl+Z, imediat

Ai scris 7.5 și a apărut 07.mai? Nu scrie 7,5 peste! Celula a primit de la Excel **forma de dată** și o păstrează: 7,5 scris peste apare ca `07.ian`. Nici Delete nu scoate forma: golește doar conținutul.

Soluția: apasă imediat Ctrl+Z sau butonul **Anulare (Undo)** ↶. Dispar și data, și forma ei. Apoi scrii din nou, cu virgulă.

Ai scris deja peste? Apasă Ctrl+Z de mai multe ori, până se golește celula.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–2; celule completate: A1 = Nota, A2 = 07.ian; celule colorate: A2]

Greșit: după 07.mai, ai scris 7,5 peste. Celula a păstrat forma de dată și arată 07.ian.

[Foaie desenată: coloanele A–B, rândurile 1–2; celule completate: A1 = Nota, A2 = 7,5; celule colorate: A2]

Bine: Ctrl+Z imediat după 07.mai, apoi 7,5. Acum e nota 7,5.

**Explică-mi altfel:**

E ca un borcan pe care scrie „Miere”. Dacă torni lapte în el, eticheta tot „Miere” spune. Ctrl+Z e ca și cum ai lua înapoi și ce ai turnat, și eticheta: borcanul e iar gol, fără etichetă.

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Fă greșeala și repar-o. **1.** Scrie în **B2** **7.5** (cu punct) și Enter: apare 07.mai. **2.** Apasă Ctrl+Z (sau ↶). **3.** Clic pe B2, scrie **7,5** și Enter.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana.

Verificarea automată (verifica): {"tip": {"B2": {"numar": 7.5}}}

Indiciu (apare după prima greșeală): Dacă în B2 scrie 07.ian, celula a păstrat forma de dată: apasă Ctrl+Z (sau ↶) până se golește, apoi scrie 7,5.

Explicația de după răspuns: Ctrl+Z a scos și data, și forma ei. Acum 7,5 e numărul 7,5, la dreapta.

### Încă un exercițiu (pasul 5, varianta 1)

(Adevărat sau fals?)

Excel a făcut din 7.5 data 07.mai. Apeși Delete pe celulă și scrii 7,5: acum în celulă apare 7,5.

Răspuns: Fals

Indiciu (apare după prima greșeală): Recitește ce face Delete cu forma de dată.

Explicația de după răspuns: Fals. Delete golește doar conținutul. Forma de dată rămâne, iar 7,5 apare ca 07.ian. Ctrl+Z, imediat după greșeală, scoate și forma.

### Încă un exercițiu (pasul 5, varianta 2)

Ai scris 6.75 și a apărut iun.75. Ce faci ca să ai numărul 6,75?

Variante:

- Apeși imediat Ctrl+Z, apoi scrii 6,75 (corect)

- Scrii 6,75 peste iun.75

- Apeși Delete, apoi scrii 6,75

- Scrii 6.75 încă o dată

Indiciu (apare după prima greșeală): Care comandă scoate și valoarea, și forma?

Explicația de după răspuns: Ctrl+Z scoate și data, și forma ei. Scris peste, 6,75 ar apărea ca ian.00; la fel și după Delete.

## Pasul 6: Numere care rămân text: apostroful

Unele numere nu sunt de socotit: codul biletului, 007, sau un număr de telefon care începe cu 0. Scrise simplu, Excel le face numere și pierde zerourile din față: 007 devine 7.

Ca să rămână exact cum le scrii, începi cu un **apostrof**: `'007`. Semnul ' e pe tasta din stânga lui Enter, aceeași cu ghilimelele. În celulă apostroful nu se vede, doar în bara de formule (Formula Bar).

Celula arată 007 la stânga, ca textul, cu un **triunghi verde** în colțul din stânga-sus: Excel te anunță că ai un număr păstrat ca text. Aici chiar asta vrei.

[Imagine]

Legenda imaginii: Așa arată în Excel un număr păstrat ca text: 250 stă la stânga și are triunghiul verde în colț.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–3; celule completate: A1 = Cod bilet, A2 = 7, A3 = 007]

În A2 s-a scris 007: a rămas 7, la dreapta. În A3 s-a scris '007: se vede 007, la stânga, cu triunghiul verde în colț.

**Explică-mi altfel:**

Un număr de telefon nu se adună cu alt număr de telefon: e ca un nume, o etichetă. De aceea îl păstrezi ca text, cu toate cifrele lui.

### Încearcă (pasul 6)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B2** codul biletului Anei, **007**, așa încât să rămână cu zerourile din față.

Foaia de la început: A1 = Elev; B1 = Cod bilet; A2 = Ana.

Verificarea automată (verifica): {"tip": {"B2": {"text": "007"}}}

Indiciu (apare după prima greșeală): Începe cu apostroful: '007, apoi Enter.

Explicația de după răspuns: Cu apostrof, 007 rămâne text: se vede întreg, la stânga, cu triunghiul verde.

### Încă un exercițiu (pasul 6, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B2** codul de acces la sala de sport, **0042**, cu zerourile din față.

Foaia de la început: A1 = Sala; B1 = Cod; A2 = Sport.

Verificarea automată (verifica): {"tip": {"B2": {"text": "0042"}}}

Indiciu (apare după prima greșeală): Apostroful întâi: '0042.

Explicația de după răspuns: Cu apostrof, 0042 rămâne exact cum l-ai scris.

### Încă un exercițiu (pasul 6, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie **007** fără apostrof în **A1** și apasă Enter. Ce apare?

Variante:

- 7, la dreapta (corect)

- 007, la stânga

- 007, la dreapta

- Nimic, celula rămâne goală

Indiciu (apare după prima greșeală): Încearcă în foaie.

Explicația de după răspuns: Fără apostrof, Excel face din 007 numărul 7 și îl pune la dreapta: zerourile din față se pierd.

## Atelier: Atelier: lista pentru excursia clasei

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Atelier: lista pentru excursia clasei

Foaia de mai jos se poartă ca Excel-ul pe setări românești. Deasupra ei sunt **testele**: fiecare se bifează singur când ce ai scris are tipul potrivit. Ai greșit? Ctrl+Z sau ↶. La final apasă **Verifică**.

Completează lista. **1.** În **B2**, **B3** și **B4** scrie sumele plătite: **150**, **75,5** și **120**. **2.** În **C2**, **C3** și **C4** scrie datele plății: **28.09.2026**, **01.10.2026** și **05.10.2026**. **3.** În **D2**, **D3** și **D4** scrie codurile biletelor, **001**, **002** și **003**, cu zerourile din față.

Foaia de la început: A1 = Elev; B1 = Suma; C1 = Data plății; D1 = Cod bilet; A2 = Ana; A3 = Bogdan; A4 = Cristi.

Teste care se bifează: Sumele din coloana B sunt numere (stau la dreapta); Datele din coloana C sunt date calendaristice; Codurile din coloana D și-au păstrat zerourile

Verificarea automată (verifica): {"tip": {"B2": {"numar": 150}, "B3": {"numar": 75.5}, "B4": {"numar": 120}, "C2": {"data": "28.09.2026"}, "C3": {"data": "01.10.2026"}, "C4": {"data": "05.10.2026"}, "D2": {"text": "001"}, "D3": {"text": "002"}, "D4": {"text": "003"}}}

Indiciu (apare după prima greșeală): Sumele: doar cifrele, cu virgulă la 75,5. Datele: ziua, luna și anul, cu puncte între ele. Codurile: cu apostrof în față, de exemplu '001.

Explicația de după răspuns: Lista e gata: sumele sunt numere (cu ele Excel va putea face totalul), datele sunt zile din calendar, iar codurile au rămas exact cum le-ai scris.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Jurnalul fasolei de la biologie. **1.** În **B2** și **B3** scrie datele **12.10.2026** și **13.10.2026**. **2.** În **C2** și **C3** scrie înălțimea plantei, în centimetri: **3,5** și **4,25**. **3.** În **D2** scrie **a răsărit**.

Foaia de la început: A1 = Ziua; B1 = Data; C1 = Înălțime; D1 = Observație; A2 = 1; A3 = 2.

Teste care se bifează: Datele din coloana B sunt date calendaristice; Înălțimile din coloana C sunt numere cu zecimale; Observația din D2 e text

Verificarea automată (verifica): {"tip": {"B2": {"data": "12.10.2026"}, "B3": {"data": "13.10.2026"}, "C2": {"numar": 3.5}, "C3": {"numar": 4.25}, "D2": {"text": "a răsărit"}}}

Indiciu (apare după prima greșeală): Datele cu puncte, înălțimile cu virgulă: 3,5 și 4,25.

Explicația de după răspuns: Datele stau la dreapta ca zile din calendar, înălțimile sunt numere cu virgulă, iar observația e text, la stânga.

## Acum în aplicația adevărată

1. Deschide Excel și fă un registru nou, gol (Ctrl+N).

2. Clic pe **A1**, scrie **12** și apasă Enter. În **A2** scrie **Ana** și Enter. În **A3** scrie data de azi, cu puncte (de exemplu **05.10.2026**), și Enter. Uită-te: 12 și data stau la dreapta, Ana stă la stânga.

3. În **A4** scrie **7,5** (cu virgulă) și Enter. În **A5** scrie **7.5** (cu punct) și Enter. Pe setări românești, A4 arată nota 7,5, iar A5 arată **07.mai**, o dată. Dacă A5 arată tot 7.5, fără să devină dată, calculatorul are setări englezești: acolo zecimala se scrie cu punct.

4. Pe setări românești: apasă imediat Ctrl+Z, iar data din A5 dispare. Clic pe **A5**, scrie **7,5** și Enter: acum e nota 7,5.

5. În **A6** scrie **007**, iar în **A7** scrie **'007**, cu apostrof în față. Compară: A6 arată 7, la dreapta; A7 arată 007, la stânga, cu un triunghi verde în colț.

6. Salvează cu Ctrl+S, cu numele `Nume_Prenume_lectia5.xlsx`.

## Verificare

### Întrebarea 1

Într-o coloană cu note, o notă stă lipită la stânga, iar celelalte la dreapta. Ce înseamnă?

Variante:

- Excel o vede ca text, nu ca număr (corect)

- E cea mai mare notă din coloană

- E o dată calendaristică

- E o notă cu zecimale

Indiciu (apare după prima greșeală): Unde stau numerele și unde stă textul?

Explicația de după răspuns: Numerele stau la dreapta. O notă lipită la stânga e text: Excel nu va calcula cu ea.

### Întrebarea 2

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B3** înălțimea lui Bogdan, **1,62** metri, ca număr.

Foaia de la început: A1 = Elev; B1 = Înălțime; A2 = Ana; B2 = 1,55; A3 = Bogdan.

Verificarea automată (verifica): {"tip": {"B3": {"numar": 1.62}}}

Indiciu (apare după prima greșeală): Pe setări românești zecimala se scrie cu virgulă.

Explicația de după răspuns: 1,62 cu virgulă e număr și stă la dreapta, lângă 1,55.

### Întrebarea 3

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **C2** data concursului de robotică, **12 octombrie 2026**, așa încât Excel s-o recunoască drept dată.

Foaia de la început: A1 = Concurs; B1 = Oraș; C1 = Data; A2 = Robotică; B2 = Piatra Neamț.

Verificarea automată (verifica): {"tip": {"C2": {"data": "12.10.2026"}}}

Indiciu (apare după prima greșeală): Ziua, luna și anul, despărțite prin puncte.

Explicația de după răspuns: Scrisă cu puncte, 12.10.2026 e o dată calendaristică și stă la dreapta. Merge și „12 octombrie 2026”: Excel o recunoaște tot ca dată.

### Întrebarea 4

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Scrie în **B2** numărul de pe tricoul lui Cristi, **07**, ca să se vadă exact 07.

Foaia de la început: A1 = Jucător; B1 = Tricou; A2 = Cristi.

Verificarea automată (verifica): {"tip": {"B2": {"text": "07"}}}

Indiciu (apare după prima greșeală): Cum păstrezi zeroul din față?

Explicația de după răspuns: Cu apostrof, '07 rămâne text și se vede 07.

### Întrebarea 5

Ai scris 8.5, iar în celulă a apărut 08.mai. Ce faci ca să ai nota 8,5?

Variante:

- Apeși imediat Ctrl+Z, apoi scrii 8,5 (corect)

- Scrii 8,5 peste 08.mai

- Apeși Delete, apoi scrii 8,5

- Scrii 8.50 în loc de 8.5

Indiciu (apare după prima greșeală): Care comandă scoate și data, și forma ei?

Explicația de după răspuns: Ctrl+Z scoate și data, și forma de dată. Scris peste sau după Delete, 8,5 ar apărea tot ca dată: 08.ian.

## Ce am învățat

a deosebit numerele, textul și datele calendaristice după aliniere, a scris zecimale cu virgulă și date cu puncte, a reparat cu Ctrl+Z o notă care se făcuse dată și a păstrat zerourile unui cod cu apostroful
