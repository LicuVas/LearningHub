## Pasul 1: La ce folosește

La casa de marcat, bonul se face singur. Pentru fiecare produs, casa înmulțește cantitatea cu prețul, apoi adună totul. Nimeni nu socotește de mână.

Excel poate face la fel. Tu scrii o singură dată regula de calcul, adică o **formulă**. Excel face socoteala și arată rezultatul. Când schimbi un număr, Excel reface singur calculul.

Azi scrii formule care adună, scad, înmulțesc și împart.

[Imagine]

Sub imagine: Un bon mic, în Excel. În D2 se vede rezultatul, 28. Sus, în bara de formule, e regula care l-a calculat. La sfârșitul lecției o scrii singur.

## Pasul 2: Datele: fiecare număr în celula lui

Clasa cumpără 5 mingi, de câte 120 de lei. Înainte de calcul, scrii datele într-o foaie nouă.

Pe rândul 1 pui numele coloanelor: în **A1** scrii **Cantitate**, în **B1** **Preț**, în **C1** **Total**. Pe rândul 2 pui numerele: în **A2** doar **5**, în **B2** doar **120**. După fiecare apeși Enter.

**Regula:** o celulă ține un singur lucru. Cuvântul are celula lui (aici, deasupra), iar numărul stă singur în celula lui. Așa Excel îl vede ca număr (îl așază la dreapta, ca în lecția 5) și poate calcula cu el.

[Imagine]

Sub imagine: Datele în Excel: 5 și 120 stau la dreapta, deci sunt numere.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–2; celule completate: A1 = Cantitate: 5]

Greșit: totul într-o singură celulă. Excel vede un text, la stânga, și nu poate calcula cu el.

[Foaie desenată: coloanele A–B, rândurile 1–2; celule completate: A1 = Cantitate, A2 = 5]

Bine: cuvântul în A1, numărul în A2. 5 e număr și stă la dreapta.

**Explică-mi altfel:**

Gândește-te la catalogul clasei. Sus, pe coloană, e tipărit „Nota”. În căsuță, profesorul scrie doar nota, ca număr, fără cuvinte. Așa se pot face apoi mediile.

### Încearcă (pasul 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Clasa mai cumpără 4 caiete, de câte 7 lei. Scrie aceste date pe rândul 3, fiecare număr sub numele coloanei lui. După fiecare apeși Enter.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5; B2 = 120.

Verificarea automată (verifica): {"tip": {"A3": {"numar": 4}, "B3": {"numar": 7}}}

Indiciu (apare după prima greșeală): Cantitatea, 4, merge în A3, sub Cantitate. Prețul, 7, merge în B3, sub Preț. Scrii doar cifrele, fără cuvinte.

Explicația de după răspuns: 4 și 7 stau la dreapta: sunt numere, fiecare sub numele coloanei lui. Cu ele Excel poate calcula.

### Încă un exercițiu (pasul 2, varianta 1)

Cum scrii cantitatea, ca Excel să poată calcula cu ea?

Variante:

- Cantitate în A1 și 5 în A2 (corect)

- Cantitate: 5, totul în A1

- 5 bucăți în A2, sub Cantitate

- cinci, cu litere, în A2

Indiciu (apare după prima greșeală): O celulă ține un singur lucru. Unde stă numărul?

Explicația de după răspuns: Numărul stă singur în celula lui. „Cantitate: 5”, „5 bucăți” și „cinci” sunt text: Excel nu poate calcula cu ele.

## Pasul 3: Prima formulă: semnul = și adresele

O **formulă** începe mereu cu semnul `=`. Așa știe Excel că trebuie să calculeze. Începi mereu cu `=`: fără el, A2*B2 rămâne scris ca text.

După `=` scrii adresele celulelor cu numere și, între ele, semnul calculului. Semnele de calcul se numesc **operatori**:

- `+` adunare, `-` scădere;

- `*` înmulțire (steluța, nu litera x);

- `/` împărțire (bara, nu două puncte: în Excel, `:` face o zonă, ca B2:C4).

Apeși Enter și în celulă apare rezultatul. Formula o vezi sus, în bara de formule (Formula Bar), când alegi din nou celula.

**Uite cum:**

În **C2** scrii `=A2*B2`. Cât scrii, Excel încadrează în culori celulele A2 și B2. Apeși Enter: în C2 apare **600**. Clic din nou pe C2: bara de formule arată `=A2*B2`.

[Imagine]

Sub imagine: Cât scrii formula, A2 și B2 sunt încadrate în culori.

[Imagine]

Sub imagine: După Enter: în celulă e rezultatul, 600; în bara de formule e formula.

Steluța e Shift+8 sau tasta * din dreapta, lângă cifre. Bara / e tasta din stânga lui Shift din dreapta. Pe telefon, alege steluța `*` și bara `/` dintre simboluri. Dacă alegi totuși × sau ÷, Excel 365 le schimbă singur.

Vezi filmul pas cu pas: Cum scrii o formulă ↗ (se deschide într-o filă nouă; apoi te întorci la fila lecției).

**Explică-mi altfel:**

Formula e ca o rețetă. Rețeta nu spune „600 de lei”, ci „cantitatea înmulțită cu prețul”. Excel citește rețeta, se uită în A2 și în B2 și face socoteala.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **C2** scrie formula `=A2*B2` și apasă Enter. Apoi clic din nou pe C2 și uită-te în bara de formule.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5; B2 = 120.

Verificarea automată (verifica): {"formule": {"C2": "=A2*B2"}}

Indiciu (apare după prima greșeală): Clic pe C2. Scrie întâi semnul =, apoi A2, steluța * (Shift + 8) și B2. Apoi apasă Enter.

Explicația de după răspuns: În C2 se vede 600, iar bara de formule arată =A2*B2: Excel a înmulțit ce e în A2 cu ce e în B2.

### Încă un exercițiu (pasul 3, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Pe rândul 3 sunt 4 caiete, de câte 7 lei. Scrie în **C3** formula care calculează cât costă caietele.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5; B2 = 120; C2 = =A2*B2; A3 = 4; B3 = 7.

Verificarea automată (verifica): {"formule": {"C3": "=A3*B3"}}

Indiciu (apare după prima greșeală): Ca în C2, dar cu adresele de pe rândul 3.

Explicația de după răspuns: =A3*B3 dă 28: 4 caiete ori 7 lei.

### Încă un exercițiu (pasul 3, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Ana are 45 de lei, în A2, iar Bogdan are 30 de lei, în B2. Scrie în **C2** formula care arată câți lei au împreună.

Foaia de la început: A1 = Ana; B1 = Bogdan; C1 = Împreună; A2 = 45; B2 = 30.

Verificarea automată (verifica): {"formule": {"C2": "=A2+B2"}}

Indiciu (apare după prima greșeală): Împreună înseamnă adunare: semnul +.

Explicația de după răspuns: =A2+B2 dă 75 de lei.

### Încă un exercițiu (pasul 3, varianta 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

O pizza costă 60 de lei, în A2, și o plătesc 4 prieteni, în B2. Scrie în **C2** formula care arată cât dă fiecare.

Foaia de la început: A1 = Pizza; B1 = Prieteni; C1 = De fiecare; A2 = 60; B2 = 4.

Verificarea automată (verifica): {"formule": {"C2": "=A2/B2"}}

Indiciu (apare după prima greșeală): Împarți prețul la numărul de prieteni: semnul /.

Explicația de după răspuns: =A2/B2 dă 15 lei de fiecare.

## Pasul 4: Schimbi un număr, rezultatul se schimbă singur

Formula `=A2*B2` nu ține minte numerele 5 și 120. Ține minte **adresele**: „înmulțește ce e în A2 cu ce e în B2”. Când schimbi un număr din A2 sau din B2, Excel reface singur calculul.

Dacă scrii `=5*120`, rezultatul e tot 600, dar nu se mai schimbă: numerele sunt scrise în formulă, nu luate din celule. De aceea, numerele din tabel le iei mereu prin adresele lor.

**Ghicește înainte să încerci:** dacă în A2 scrii 10 în loc de 5, ce apare în C2?

**Uite cum:**

Aici s-a schimbat prețul: în B2 s-a scris 100 în loc de 120. Formula din C2 a rămas aceeași, `=A2*B2`, iar rezultatul s-a refăcut singur: 5 ori 100 fac 500.

[Imagine]

Sub imagine: După ce în B2 s-a scris 100: C2 arată 500, iar în bara de formule e tot =A2*B2.

**Explică-mi altfel:**

Formula lucrează ca un poștaș. Poștașul are adresa, nu numele: duce scrisoarea la apartamentul 2 din blocul A, oricine ar locui acolo acum. Formula merge la adresa A2 și ia numărul care e acolo acum.

### Încearcă (pasul 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Foaia are deja formula `=A2*B2` în C2. Ghicește întâi: dacă în **A2** scrii **10**, ce arată C2? Apoi încearcă în foaie și alege răspunsul.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5; B2 = 120; C2 = =A2*B2.

Variante:

- 1200 (corect)

- 600

- 10

- Nimic: formula trebuie scrisă din nou

Indiciu (apare după prima greșeală): Formula ia ce e acum în A2: 10 ori 120.

Explicația de după răspuns: C2 arată 1200: formula a luat noul număr din A2 și a refăcut singură calculul.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Prețul unei mingi a crescut la **150** de lei. Schimbă prețul din **B2**, fără să atingi formula din C2.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5; B2 = 120; C2 = =A2*B2.

Verificarea automată (verifica): {"tip": {"B2": {"numar": 150}}, "formule": {"C2": "=A2*B2"}}

Indiciu (apare după prima greșeală): Clic pe B2, scrie 150 și apasă Enter. Formula din C2 o lași cum e.

Explicația de după răspuns: C2 arată acum 750, adică 5 ori 150, fără să fi scris formula din nou.

### Încă un exercițiu (pasul 4, varianta 2)

(Adevărat sau fals?)

În C2 este formula `=5*120`. Schimbi A2 din 5 în 10, iar C2 arată 1200.

Răspuns: Fals

Indiciu (apare după prima greșeală): Formula aceasta ia numerele din celule sau le are scrise în ea?

Explicația de după răspuns: Fals. În `=5*120` numerele sunt scrise în formulă, deci C2 rămâne 600. Cu `=A2*B2` ar fi arătat 1200.

## Pasul 5: Ordinea operațiilor și parantezele

Când o formulă are mai multe semne, Excel face întâi înmulțirile și împărțirile (`*` și `/`). Abia apoi face adunările și scăderile (`+` și `-`). Înmulțirea și împărțirea sunt de același fel; adunarea și scăderea, la fel. Între semne de același fel, Excel merge de la stânga la dreapta. E ordinea de la matematică.

Vrei altă ordine? Pui **paranteze**: ce e între paranteze se calculează primul.

Exemplu: media notelor 9, din A2, și 8, din B2, adică suma lor împărțită la 2. `=A2+B2/2` dă 13, pentru că Excel împarte întâi 8 la 2. Corect e `=(A2+B2)/2`, care dă 8,5.

**Uite cum:**

[Imagine]

Sub imagine: În C2, fără paranteze: 13. În D2, cu paranteze: 8,5, media corectă.

Pe rând: la `=A2+B2/2`, întâi 8 împărțit la 2 fac 4, apoi 9 plus 4 fac 13. La `=(A2+B2)/2`, întâi 9 plus 8 fac 17, apoi 17 împărțit la 2 fac 8,5.

De la stânga la dreapta: la `=10-4-3`, 10 minus 4 fac 6, apoi 6 minus 3 fac 3. La `=20/4*2`, 20 împărțit la 4 fac 5, apoi 5 ori 2 fac 10.

**Explică-mi altfel:**

E ca la ora de matematică: (9 + 8) : 2 înseamnă „adun întâi, apoi împart”, iar 9 + 8 : 2 înseamnă 9 + 4. Excel face la fel; doar că la el împărțirea se scrie cu /.

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Ana are notele 9, în A2, și 10, în B2. Scrie în **C2** formula pentru media lor: suma celor două note, împărțită la 2.

Foaia de la început: A1 = Nota 1; B1 = Nota 2; C1 = Media; A2 = 9; B2 = 10.

Verificarea automată (verifica): {"formule": {"C2": "=(A2+B2)/2"}}

Indiciu (apare după prima greșeală): Adunarea trebuie făcută prima, deci o pui între paranteze. Apoi împarți la 2.

Explicația de după răspuns: =(A2+B2)/2 dă 9,5: întâi 9 plus 10 fac 19, apoi 19 împărțit la 2.

### Încă un exercițiu (pasul 5, varianta 1)

În A2 e 10, iar în B2 e 4. Ce arată formula `=A2-B2*2`?

Variante:

- 2 (corect)

- 12

- 6

- 16

Indiciu (apare după prima greșeală): Întâi înmulțirea: 4 ori 2.

Explicația de după răspuns: Întâi 4 ori 2 fac 8, apoi 10 minus 8 fac 2. Rezultatul 12 ar ieși doar cu paranteze: `=(A2-B2)*2`.

### Încă un exercițiu (pasul 5, varianta 2)

În A2 e 12, în B2 e 3, iar în C2 e 2. Ce arată formula `=A2/B2*C2`?

Variante:

- 8 (corect)

- 2

- 18

- 6

Indiciu (apare după prima greșeală): Împărțirea și înmulțirea sunt de același fel. În ce ordine le face Excel?

Explicația de după răspuns: De la stânga la dreapta: 12 împărțit la 3 fac 4, apoi 4 ori 2 fac 8.

## Pasul 6: Când apare un cod de eroare

Uneori, în locul rezultatului apare un **cod de eroare**: Excel nu poate face calculul. Trei coduri și reparația lor:

- `#VALUE!`: o celulă din formulă are un text cu litere, de exemplu „5 bucăți”. Lași în ea doar numărul. Atenție: „150 lei” nu e text, e număr (lecția 5), deci merge.

- `#DIV/0!`: împarți la 0 sau la o celulă goală. Pentru Excel, celula goală valorează 0. Scrii numărul bun în locul lui 0 sau în celula goală.

- `#NAME?`: în formulă e un cuvânt necunoscut pentru Excel, de exemplu =A2xB2, cu x în loc de `*`. Schimbi x cu `*`.

Repari cauza, iar rezultatul apare singur.

**Uite cum:**

[Imagine]

Sub imagine: În A2 e textul „5 bucăți”, deci C2 arată #VALUE!. Scrii în A2 doar 5 și C2 arată 600.

[Imagine]

Sub imagine: B2 e goală, deci =A2/B2 arată #DIV/0!. Scrii 4 în B2 și apare 15.

Triunghiul verde din colțul lui C2 e semnul lui Excel că ceva nu e în regulă. L-ai mai văzut la lecția 5, la numerele păstrate ca text.

**Explică-mi altfel:**

Codul de eroare e ca un bec aprins la bordul mașinii: îți spune ce fel de problemă e. Nu-l acoperi, ci repari cauza: textul din celulă, celula goală sau semnul greșit.

### Încearcă (pasul 6)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

C2 arată `#VALUE!`. Găsește celula cu problema și repar-o, ca C2 să arate cât costă cele 5 mingi.

Foaia de la început: A1 = Cantitate; B1 = Preț; C1 = Total; A2 = 5 bucăți; B2 = 120; C2 = =A2*B2.

Verificarea automată (verifica): {"tip": {"A2": {"numar": 5}}, "formule": {"C2": "=A2*B2"}}

Indiciu (apare după prima greșeală): Uită-te în A2: are un text cu litere. Lasă în el doar numărul 5.

Explicația de după răspuns: Cu 5 în A2, formula a putut înmulți: C2 arată 600, fără să fi schimbat formula.

### Încă un exercițiu (pasul 6, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

C2 arată `#DIV/0!`. Pizza de 60 de lei o împart 4 prieteni. Repară foaia, ca C2 să arate cât dă fiecare.

Foaia de la început: A1 = Pizza; B1 = Prieteni; C1 = De fiecare; A2 = 60; C2 = =A2/B2.

Verificarea automată (verifica): {"tip": {"B2": {"numar": 4}}, "formule": {"C2": "=A2/B2"}}

Indiciu (apare după prima greșeală): B2 e goală, iar Excel nu poate împărți la o celulă goală. Scrie în ea numărul prietenilor.

Explicația de după răspuns: Cu 4 în B2, C2 arată 15.

### Încă un exercițiu (pasul 6, varianta 2)

În C2 ai scris `=A2xB2` și a apărut `#NAME?`. Ce schimbi?

Variante:

- Litera x cu steluța: =A2*B2 (corect)

- Numărul din A2

- Mai pui un = la început

- Golești B2

Indiciu (apare după prima greșeală): Ce cuvânt nu cunoaște Excel?

Explicația de după răspuns: Excel nu cunoaște „A2xB2”: înmulțirea se scrie cu steluța, `=A2*B2`.

## Atelier: Atelier: bugetul excursiei

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Atelier: bugetul excursiei

Foaia de mai jos se poartă ca Excel-ul pe setări românești. Deasupra ei sunt **testele**. Fiecare se bifează singur când formula ta calculează bine, chiar și dacă se schimbă numerele din tabel. Un rezultat scris de mână nu bifează testul. La final apasă **Verifică**.

Clasa merge în excursie: 25 de elevi, cu trenul, 40 de lei de elev, și la muzeu, 12 lei de elev. **1.** În **D2** și **D3** scrie formulele care calculează cât costă trenul și muzeul pentru toți elevii. **2.** În **D4** scrie formula care adună cele două costuri. **3.** În **D5** scrie formula care arată cât plătește fiecare elev: totalul din D4, împărțit la numărul de elevi din B2.

Foaia de la început: A1 = Plătim; B1 = Elevi; C1 = Preț; D1 = Total; A2 = Tren; B2 = 25; C2 = 40; A3 = Muzeu; B3 = 25; C3 = 12; A4 = Total; A5 = Fiecare.

Teste care se bifează: D2 și D3 înmulțesc elevii din B2 și B3 cu prețul din C2 și C3; D4 adună costul trenului din D2 cu al muzeului din D3; D5 împarte totalul din D4 la numărul de elevi din B2

Verificarea automată (verifica): {"formule": {"D2": "=B2*C2", "D3": "=B3*C3", "D4": "=D2+D3", "D5": "=D4/B2"}}

Indiciu (apare după prima greșeală): D2: elevii din B2 ori prețul din C2. D3: la fel, pe rândul 3. D4: D2 plus D3. D5: D4 împărțit la B2. Fiecare formulă începe cu =.

Explicația de după răspuns: Bugetul e gata: trenul costă 1000 de lei, muzeul 300, în total 1300, adică 52 de lei de fiecare elev. Schimbă un preț și vezi cum se refac toate.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Mediile a doi elevi. **1.** În **D2** scrie formula pentru media Anei. **2.** În **D3** scrie formula pentru media lui Radu. **3.** În **D4** scrie formula pentru media celor două medii, din D2 și D3.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; D1 = Media; A2 = Ana; B2 = 8; C2 = 9; A3 = Radu; B3 = 6; C3 = 9; A4 = Toți.

Teste care se bifează: D2 e media notelor Anei, din B2 și C2; D3 e media notelor lui Radu, din B3 și C3; D4 e media celor două medii, din D2 și D3

Verificarea automată (verifica): {"formule": {"D2": "=(B2+C2)/2", "D3": "=(B3+C3)/2", "D4": "=(D2+D3)/2"}}

Indiciu (apare după prima greșeală): Suma notelor între paranteze, apoi împărțit la 2: =(B2+C2)/2.

Explicația de după răspuns: Ana are 8,5, Radu are 7,5, iar media lor e 8.

## Acum în aplicația adevărată

1. Deschide Excel și fă un registru nou, gol (Ctrl+N).

2. În **A1** scrie **Cantitate**, în **B1** scrie **Preț**, în **C1** scrie **Total**. În **A2** scrie doar numărul **5**, iar în **B2** doar numărul **120**. După fiecare apeși Enter.

3. Clic pe **C2**, scrie `=A2*B2` și apasă Enter. În C2 trebuie să vezi **600**. Clic din nou pe C2: sus, în bara de formule, vezi `=A2*B2`.Dacă nu-ți ieseLegăturile cu ↗ se deschid într-o filă nouă; apoi te întorci la fila lecției.

Alte greșeli obișnuite la acest gest și ce faci la ele: în tutorialul „Cum scrii o formulă” ↗. Acolo formula este =B2*C2 și stă în D2; la tine formula este =A2*B2 și stă în C2.

4. Ghicește întâi, apoi verifică: clic pe **A2**, scrie **10** și apasă Enter. Fără să atingi formula, C2 trebuie să arate **1200**.

5. În **A3** scrie **4**, iar în **B3** scrie **7**: 4 caiete, de câte 7 lei. În **C3** scrie singur formula care calculează cât costă caietele și apasă Enter. Trebuie să apară **28**.

6. Fă o greșeală, ca s-o recunoști: în **A2** scrie **5 bucăți** și apasă Enter. În C2 apare **#VALUE!**. Apasă Ctrl+Z: în A2 e din nou 10, iar C2 arată iar 1200.

7. Alături, un tabel mic de note: în **E1** scrie **Nota 1**, în **F1** **Nota 2**, în **G1** **Media**. În **E2** scrie **9**, în **F2** **8**, iar în **G2** formula `=(E2+F2)/2`; după fiecare apeși Enter. Trebuie să apară **8,5** (pe un calculator cu setări englezești apare 8.5).

8. Salvează cu Ctrl+S, cu numele, prenumele și clasa ta, de exemplu `Popescu_Ana_8A_lectia7.xlsx`.

## Verificare

### Întrebarea 1

În A4 e numărul de bilete, iar în B4 prețul unui bilet. Ce scrii în C4 ca să afli cât costă toate biletele?

Variante:

- =A4*B4 (corect)

- A4*B4

- =A4xB4

- =A4:B4

Indiciu (apare după prima greșeală): Formula începe cu =, iar înmulțirea are un semn anume.

Explicația de după răspuns: `=A4*B4`: începe cu =, iar înmulțirea se scrie cu *. Fără =, Excel ține A4*B4 ca text; cu x apare #NAME?; : face o zonă, nu calculează.

### Întrebarea 2

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Ai 50 de lei, în A2, și cumperi o carte de 18 lei, în B2. Scrie în **C2** formula care arată câți lei îți rămân.

Foaia de la început: A1 = Am; B1 = Cartea; C1 = Rămân; A2 = 50; B2 = 18.

Verificarea automată (verifica): {"formule": {"C2": "=A2-B2"}}

Indiciu (apare după prima greșeală): Din ce ai scazi prețul cărții: semnul -.

Explicația de după răspuns: `=A2-B2` dă 32 de lei.

### Întrebarea 3

În A2 e 6, în B2 e 4, iar în C2 e 2. Ce arată o celulă cu formula **=A2+B2*C2**?

Variante:

- 14 (corect)

- 20

- 12

- 8

Indiciu (apare după prima greșeală): Ce face Excel întâi: adunarea sau înmulțirea?

Explicația de după răspuns: Întâi 4 ori 2 fac 8, apoi 6 plus 8 fac 14. Ar fi 20 doar cu paranteze: `=(A2+B2)*C2`.

### Întrebarea 4

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Maria are trei note: 9, în A2, 7, în B2, și 8, în C2. Scrie în **D2** formula pentru media lor: suma celor trei note, împărțită la 3.

Foaia de la început: A1 = Nota 1; B1 = Nota 2; C1 = Nota 3; D1 = Media; A2 = 9; B2 = 7; C2 = 8.

Verificarea automată (verifica): {"formule": {"D2": "=(A2+B2+C2)/3"}}

Indiciu (apare după prima greșeală): Care operații trebuie făcute primele? Pune-le între paranteze.

Explicația de după răspuns: `=(A2+B2+C2)/3` dă 8: întâi suma, 24, apoi 24 împărțit la 3.

### Întrebarea 5

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

C2 arată `#VALUE!`. Repară foaia, ca C2 să arate cât costă cele 10 kilograme de mere, de câte 3 lei.

Foaia de la început: A1 = Kilograme; B1 = Preț; C1 = Total; A2 = 10 kg; B2 = 3; C2 = =A2*B2.

Verificarea automată (verifica): {"tip": {"A2": {"numar": 10}}, "formule": {"C2": "=A2*B2"}}

Indiciu (apare după prima greșeală): Care celulă are un text cu litere?

Explicația de după răspuns: Cu 10 în A2, fără „kg”, C2 arată 30.

## Ce am învățat

a scris formule care încep cu =, cu adresele celulelor și cu operatorii + - * /, a văzut cum se refac singure când se schimbă datele, a folosit parantezele ca să calculeze o medie și a reparat codurile de eroare #VALUE!, #DIV/0! și #NAME?
