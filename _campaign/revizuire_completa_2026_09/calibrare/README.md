# Calibrare RO/EN Office pentru LearningHub

**Scop:** să știm numele ROMÂNEȘTI oficiale ale elementelor din Excel/Word/PowerPoint folosite pe site, ca lecțiile să meargă la fel pe un calculator cu Office în română și pe unul cu Office în engleză.

- Prima versiune: 27.09.2026.
- **Reverificată pe conținut:** tot 27.09.2026, după verificarea independentă din `verificare/raport.md`.

## Pe scurt

**1. Excel-ul românesc NU traduce numele funcțiilor.** Panglica e tradusă (Pornire, Inserare, Aldin, Cursiv…), dar formula rămâne în engleză: `=SUM(`, `=AVERAGE(`, `=IF(`, `=COUNTIF(`, nu `=SUMA(`, `=MEDIE(`, `=DACA(`. Dovezi:

- paginile Microsoft ro-ro ale fiecărei funcții;
- un blog de profesor român cu interfața în română și funcțiile în engleză (vijolitic10);
- trei liste independente ale limbilor în care Excel traduce funcțiile, fără română (vezi `verificare/raport.md`).

`POTRIVIRE`, `VALOARE`, `ASTĂZI` din lista alfabetică Microsoft ro-ro sunt **traduceri automate greșite ale site-ului**, nu nume de funcții.

**2. Lecțiile de pe LearningHub greșesc azi masiv.** Folosesc `SUMA(`, `MEDIE(`, `DACA(`, `NUMARADACA(`, `SI(`, `SAU(`, `CURAT(`, `ROTUNJIRE(`. Un elev care scrie `=SUMA(A1:A10)` primește `#NAME?`.

**3. Butonul Σ se numește „Însumare automată”** (fila Pornire, grupul Editare). **«Sumă» e doar prima opțiune din lista lui.** Când dai clic, în celulă se scrie tot `=SUM(...)`. Nu confunda eticheta butonului cu numele formulei.

**4. Separatorul `;` și virgula zecimală vin din formatul regional al Windows-ului, NU din limba Office-ului.**

- Office în engleză pe un Windows cu format românesc → `;` și `,`.
- Office în română pe un Windows cu format american → `,` și `.`.
- În lecții se scrie „pe calculatoarele cu format regional românesc”.

## Ce s-a schimbat la reverificare

Validatorul vechi verifica doar **forma** (două adrese și un text) și dădea 0. Pe același fișier, **validatorul nou de conținut găsește 140 de intrări din 141 care nu trec**. Motivul: citatele erau descrieri („Titlu indexat Google…”, „Terminologie generala… confirmata”), nu text copiat din pagină.

Toate intrările au fost refăcute cu citate **cuvânt cu cuvânt**, luate din paginile descărcate. S-au corectat **32 de intrări**:

**Nume greșite sau formă greșită (18):**

| Element | Era | Acum | Stare |
|---|---|---|---|
| Print Area (Excel) | Zona de tiparire | **Zonă de imprimat** | NESIGUR (o singură pagină Microsoft) |
| AutoSum (Excel) | Suma (butonul Suma automata) | **Însumare automată** | CONFIRMAT |
| Clipboard (grup Excel și Word) | Memorie temporara | **Clipboard** | CONFIRMAT |
| Bold (Word) | Aldin / Ingrosat | **Aldin** („Îngroșat” = explicație pentru elevi, nu etichetă) | CONFIRMAT |
| MATCH, VALUE (funcții) | MATCH / POTRIVIRE, VALUE / VALOARE | **MATCH**, **VALUE** (fără nume RO) | CONFIRMAT |
| Slide Layout (PowerPoint) | Aspect (de diapozitiv) | **Aspect** | CONFIRMAT |
| Theme (PowerPoint) | Tema | **Teme** (grupul de pe fila Proiectare) | CONFIRMAT |
| Filter (Excel) | Filtrare | **Filtru** / Filtrare | NESIGUR (Microsoft se contrazice) |
| Styles (grup Excel) | Stiluri | Stiluri / Stil | NESIGUR |
| Sort & Filter | Sortare si filtrare | Sortare și filtrare / Sortare & filtrare | NESIGUR |
| Layout (fila Word) | Aspect | Aspect / Aspect pagină | NESIGUR |
| Font Color, Strikethrough, Clear Formatting (Word) | câte un singur nume | câte două variante găsite la Microsoft | NESIGUR |
| Format Shape (PowerPoint) | Format forma | Format formă / Formatare formă | NESIGUR |
| #NAME? | #NAME? („consecvent netradus”, afirmație falsă) | #NAME? / #NUME? | NESIGUR |

**Doar diacritice (14):** filă, comandă, Aspect pagină, Referințe, Tranziții, Animații, Număr, Formatare condiționată, Ilustrații, Urmărire, Culoare evidențiere text, Număr de pagină, Tranziție, De la început. Peste tot se folosesc ș și ț cu **virgulă** dedesubt, nu cu sedilă.

## Ce am acoperit acum

| | intrări | CONFIRMAT | NESIGUR | NEGĂSIT |
|---|---|---|---|---|
| Funcții Excel | 47 | 45 | 1 (FIND) | 1 (CMMDC/CMMMC: nu e funcție Excel) |
| Mesaje de eroare | 7 | 5 | 2 (#VALUE!, #NAME?) | 0 |
| Panglica (file, grupuri, comenzi, termeni) | 87 | 65 | 22 | 0 |
| **Total** | **141** | **115** | **25** | **1** |

Față de prima versiune (127 / 13 / 1):

- **urcate la CONFIRMAT (11):** LOWER, MID, HLOOKUP, MATCH, TODAY, VALUE, MOD, ABS, #NULL!, fila Formule, Bold;
- **coborâte la NESIGUR (23):** acolo unde nu există două pagini care să numească elementul sau unde Microsoft se contrazice.

**Regula pentru CONFIRMAT:**

- două documente diferite care numesc elementul **în context de interfață** („fila X”, „grupul X”, „selectați X”), dintre care măcar unul Microsoft;
- niciun document Microsoft care să-i dea alt nume.

Paginile Microsoft ro-ro sunt parțial traduse automat, așa că o contradicție între ele duce la NESIGUR, nu se alege la întâmplare.

Pentru controalele comune din Office (Clipboard, Font, Teme, Decupare/Copiere, Salvare…), a doua sursă poate fi din altă aplicație Office. Asta e scris în „nota” fiecărei intrări.

## Cum se verifică acum

```bash
python cache_surse.py          # descarcă O DATĂ fiecare pagină-sursă în _cache/ (text vizibil); ultima linie = URL-uri fără text
python verifica_calibrare.py   # validatorul de CONȚINUT; ultima linie = numărul de intrări care nu trec (acum 0)
python verifica_forma.py       # validatorul vechi, doar de formă (păstrat pentru comparație)
```

`verifica_calibrare.py` lucrează numai din `_cache/`, deci fără internet, și verifică **mecanic**, la fiecare intrare CONFIRMAT:

- **(a)** numele RO exact apare în pagina-sursă și în citat (majusculele contează; se normalizează doar spațiile și ş/ţ cu sedilă); la funcții, măcar o sursă arată `NUME(` într-o formulă;
- **(b)** citatul e pe pagină, cuvânt cu cuvânt;
- **(c)** două documente diferite (după adresa finală: pagina cu GUID și cea „prietenoasă” sunt același document), măcar unul Microsoft sau o captură `captura:capturi/…`;
- **(d)** siturile care predau Office în engleză (itlearning.ro, pdfcoffee.com) nu contează; nici sursele care scriu numele doar ca traducere după cel englezesc („Print (Tipărire)”).

La NESIGUR verifică numai că citatele sunt reale.

**Proba validatorului:** un banc de 16 defecte introduse intenționat (citat inventat, nume fără diacritice, sedilă, itlearning, aceeași pagină de două ori, GUID + adresă prietenoasă, listă la CONFIRMAT, `SUMA`, glosă „Print (Tipărire)”…). Toate 16 sunt prinse.

## Fișiere

- `meniuri_ro_en.json`: cele 141 de intrări. Fiecare are sursele cu citat exact, starea, o notă, `corectat_din` (dacă s-a schimbat) și `ro` (un singur nume la CONFIRMAT, lista variantelor la NESIGUR).
- `cache_surse.py`, `_cache/`: paginile-sursă descărcate, adică cele 125 de adrese citate în dicționar (124 Microsoft + blogul vijolitic10) plus paginile cercetate și respinse, și `index.json` (adresă finală, stare HTTP, dată).
- `verifica_calibrare.py`: validatorul de conținut. `verifica_forma.py`: validatorul vechi.
- `de_confirmat_in_laborator.md`: 22 de verificări de câte ~10 secunde pe un calculator cu Office în română, ordonate după câte lecții le folosesc. Acoperă 24 din cele 25 de intrări NESIGUR; „Tranziție” nu e o etichetă distinctă.
- `arbitru_limba_ro.md`: pachetul de limbă română pentru Office-ul de pe acest PC (gratuit) și citirea automată a panglicii reale pe desktopul ascuns. Include riscul: Windows-ul e în română, deci engleza trebuie fixată în Office ÎNAINTE de instalare. Include și cum se anulează.
- `constante_lume.json`: TVA 21% / 11% de la 01.08.2025 (confirmat în `verificare/raport.md` pe Legea 141/2025) și lista `de_verificat`.
- `verificare/`: verificarea independentă care a declanșat reverificarea.

## Constanta din lume verificată: TVA

Două lecții folosesc încă **TVA 19%**:

- `content/liceu/artistic/cls10/m2-calcul-tabelar/lectia1-tabel-formule.html`;
- `…/lectia3-evidenta-buget.html.bak_container_20260903`.

Din **1 august 2025** cota standard e **21%**, iar cea redusă **11%** (Legea 141/2025, Monitorul Oficial nr. 699 din 25.07.2025). Mai există o cotă tranzitorie de 9% la locuințe, până la 30.09.2026, fără efect asupra lecțiilor.

## Ce trebuie făcut mai departe (recomandare, neexecutat aici)

1. **Prioritate mare:** în lecții, `SUMA`/`MEDIE`/`DACA`/`NUMARADACA`/`SI`/`SAU`/`CURAT`/`ROTUNJIRE` → `SUM`/`AVERAGE`/`IF`/`COUNTIF`/`AND`/`OR`/`TRIM`/`ROUND`. Se păstrează `;` și virgula zecimală, cu mențiunea „pe calculatoarele cu format regional românesc”.
2. Butonul Σ se numește „Însumare automată” peste tot; „Clipboard”, nu „Memorie temporară”; „Aldin”, nu „Îngroșat”.
3. Cele 2 lecții cu TVA 19% → 21%.
4. Intrările NESIGUR se lămuresc fie cu lista de laborator (5 minute), fie cu arbitrul automat din `arbitru_limba_ro.md`, după instalarea pachetului de limbă și cu acordul profesorului.
5. Pentru acoperirea completă a panglicii (~200 de butoane pe aplicație), arbitrul automat e calea cea mai ieftină: o rulare citește toată panglica reală.
