## Pasul 1: La ce folosește

Diriginta ține catalogul clasei într-un tabel Excel, ca cel de mai jos. Des are de făcut schimbări:

- vrea același tabel și pentru semestrul al doilea;

- vrea o coloană mutată în alt loc;

- un elev s-a mutat la altă școală, deci rândul lui trebuie scos.

Dacă ar scrie totul din nou, celulă cu celulă, ar pierde mult timp și ar greși. Cu **selectarea**, **copierea**, **mutarea** și **ștergerea** termină în câteva secunde. Azi le înveți pe toate, pe rând.

[Imagine]

Legenda imaginii: Un tabel adevărat din Excel: catalogul unei clase, cu elevii pe rânduri și notele pe coloane.

## Pasul 2: Adresa celulei și caseta de nume

Din lecția 2 știi: coloanele au **litere** (A, B, C…), iar rândurile au **numere** (1, 2, 3…). Căsuța de la întâlnirea lor e o **celulă**.

**Adresa** celulei = litera coloanei, lipită de numărul rândului: `C4` e în coloana C, rândul 4. Niciodată `4C`.

Adresa spune exact **unde** e ceva. Când faci clic pe o celulă, Excel îi scrie adresa în **caseta de nume** (Name Box), în stânga, deasupra coloanei A.

[Imagine]

Legenda imaginii: Clic pe nota 7 a lui Bogdan: caseta de nume arată **B3** (coloana B, rândul 3). Bara de formule (Formula Bar) arată ce e scris în celulă: 7.

**Uite cum:**

[Foaie desenată: coloanele A–C, rândurile 1–6; celule completate: A1 = Elev, B1 = Nota 1, C1 = Nota 2, A2 = Ana, B2 = 9, C2 = 10, A3 = Bogdan, B3 = 7, C3 = 8, A4 = Cristi, B4 = 10, C4 = 6, A5 = Dana, B5 = 6, C5 = 9, A6 = Elena, B6 = 8, C6 = 7; celule colorate: C4]

Nota 2 a lui Cristi: coloana C, rândul 4. Adresa ei e **C4**.

**Explică-mi altfel:**

E ca la jocul **Vaporașe**: „C4” înseamnă coloana C, rândul 4. Întâi litera, apoi numărul.

### Încearcă (pasul 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În foaia de mai jos, fă clic pe celula cu **Nota 2** a **Danei**. Apoi uită-te în caseta de nume: ce adresă are?

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"sel": "C5"}

Indiciu (apare după prima greșeală): Caută întâi rândul Danei (numărul din stânga), apoi coloana „Nota 2” (litera de sus).

Explicația de după răspuns: Dana e pe rândul 5, iar „Nota 2” e în coloana C: adresa e **C5**. Exact asta scrie în caseta de nume.

### Încă un exercițiu (pasul 2, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Fă clic pe celula în care scrie **Bogdan**. Ce adresă apare în caseta de nume?

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Variante:

- A3 (corect)

- 3A

- Bogdan

- B3

Indiciu (apare după prima greșeală): Numele stau în coloana A. Pe ce rând e Bogdan?

Explicația de după răspuns: Bogdan e în coloana A, rândul 3: adresa e A3. Caseta de nume arată adresa, nu ce scrie în celulă.

### Încă un exercițiu (pasul 2, varianta 2)

Care e adresa celulei din coloana D și rândul 12?

Variante:

- D12 (corect)

- 12D

- D-12

- L4

Indiciu (apare după prima greșeală): Întâi litera coloanei, apoi numărul rândului, lipite.

Explicația de după răspuns: Litera coloanei, apoi numărul rândului: D12. „L4” ar fi coloana L, rândul 4.

## Pasul 3: Selectezi o celulă sau o zonă

Înainte să copiezi, să muți sau să ștergi, îi arăți lui Excel pe ce lucrezi: **selectezi**. O celulă: clic pe ea.

Un dreptunghi de celule e o **zonă** (range). Apeși pe un colț, **ții apăsat**, **tragi** până la colțul opus și abia acolo dai drumul. Două clicuri separate NU fac zona: al doilea alege doar celula lui.

Zona se scrie cu două colțuri opuse și **două puncte**: `A1:B3` = de la A1 la B3, 2 coloane × 3 rânduri = 6 celule.

Celula de unde ai pornit rămâne albă: e **celula activă**. Caseta de nume arată adresa ei.

**Uite cum:**

[Foaie desenată: coloanele A–C, rândurile 1–6; celule completate: A1 = Elev, B1 = Nota 1, C1 = Nota 2, A2 = Ana, B2 = 9, C2 = 10, A3 = Bogdan, B3 = 7, C3 = 8, A4 = Cristi, B4 = 10, C4 = 6, A5 = Dana, B5 = 6, C5 = 9, A6 = Elena, B6 = 8, C6 = 7; celule colorate: C2, B3, C3, B4, C4]

Zona B2:C4, trasă de la B2: 6 celule; B2 e celula activă.

**Explică-mi altfel:**

E ca atunci când încadrezi cu creionul un dreptunghi pe o foaie de matematică: îți ajung două colțuri opuse ca să știi exact ce pătrățele intră. Zona `A1:B3` spune doar colțurile; tot ce e între ele intră.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Selectează zona **A2:B4**, trăgând de la A2 la B4.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"zona": "A2:B4"}

Indiciu (apare după prima greșeală): Apasă pe A2, ține apăsat și trage până la B4; abia acolo dă drumul.

Explicația de după răspuns: A2:B4 = numele și Nota 1 ale lui Ana, Bogdan și Cristi: 2 coloane × 3 rânduri = 6 celule. Ai văzut? Cât trăgeai, caseta de nume arăta mărimea zonei: 3R x 2C (3 rânduri, 2 coloane).

### Încă un exercițiu (pasul 3, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Selectează toate notele lui **Cristi**, **Dana** și **Elena**, din ambele coloane de note.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"zona": "B4:C6"}

Indiciu (apare după prima greșeală): Colțul stânga-sus e prima notă a lui Cristi, colțul dreapta-jos e a doua notă a Elenei.

Explicația de după răspuns: Zona e B4:C6: coloanele B și C, rândurile 4, 5 și 6.

### Încă un exercițiu (pasul 3, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Altă cale, fără tragere (bună pe laptop): fă clic pe **A1**, apoi ține apăsată tasta Shift (pe ea scrie Shift sau are o săgeată groasă ⇧; stă în stânga tastaturii, pe al doilea rând de jos) și fă clic pe **C6**. Așa selectezi tot tabelul, **A1:C6**.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"zona": "A1:C6"}

Indiciu (apare după prima greșeală): Clic simplu pe A1. Apoi ții apăsată tasta Shift și faci clic pe C6.

Explicația de după răspuns: Cu Shift+clic, zona merge de la celula activă (A1) până la celula pe care ai făcut clic (C6).

### Încă un exercițiu (pasul 3, varianta 3)

Câte celule are zona **C2:E5**?

Variante:

- 12 (corect)

- 9

- 8

- 15

Indiciu (apare după prima greșeală): Numără coloanele (C, D, E), numără rândurile (2, 3, 4, 5), apoi înmulțește.

Explicația de după răspuns: 3 coloane × 4 rânduri = 12 celule.

### Încă un exercițiu (pasul 3, varianta 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Pornește din **C5** și trage până la **A3** (de jos în sus, spre stânga). Ce arată caseta de nume **după** ce dai drumul?

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Variante:

- C5 (corect)

- A3

- A3:C5

- 9

Indiciu (apare după prima greșeală): Caseta de nume arată adresa celulei active. Din ce celulă ai pornit?

Explicația de după răspuns: Celula activă e cea din care ai pornit, C5, chiar dacă zona se scrie A3:C5.

## Pasul 4: Copierea: Copiere (Copy), apoi Lipire (Paste)

**Copierea** face un duplicat: datele apar în locul nou, iar originalul rămâne unde era.

- Selectezi celulele.

- Apeși Ctrl+C, comanda **Copiere (Copy)**: ții apăsată tasta Ctrl, din stânga-jos, și apeși o dată C. În jurul zonei apare o margine punctată care „se mișcă”.

- Faci clic pe colțul **stânga-sus** al locului nou. O singură celulă ajunge.

- Apeși Ctrl+V, comanda **Lipire (Paste)**.

Ce era deja acolo se **înlocuiește**, fără întrebare. La final, Esc oprește marginea punctată.

[Imagine]

Legenda imaginii: Zona B2:D4 după comanda Copiere (Copy): marginea punctată din jur „se mișcă” pe ecran.

**Uite cum:**

Copiezi A1:B2 în D1:

[Foaie desenată: coloanele A–E, rândurile 1–2; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 9; celule colorate: B1, A2, B2]

Înainte: tabelul e în A1:B2.

[Foaie desenată: coloanele A–E, rândurile 1–2; celule completate: A1 = Elev, B1 = Nota, D1 = Elev, E1 = Nota, A2 = Ana, B2 = 9, D2 = Ana, E2 = 9; celule colorate: E1, D2, E2]

După: copia e în D1:E2, originalul a rămas.

**Explică-mi altfel:**

Copierea e ca o **fotocopie**: foaia ta rămâne la tine, iar colegul primește una la fel. Dacă o pui peste altă foaie din dosar, aceea nu se mai vede.

### Încearcă (pasul 4)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Copiază tabelul **A1:B3** ca să înceapă în **D1**, cu Ctrl+C și Ctrl+V. Pe telefon, fără tastatură: butoanele Copy și Paste din stânga panglicii.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 7.

Verificarea automată (verifica): {"valori": {"D1": "Elev", "E1": "Nota", "D2": "Ana", "E2": 9, "D3": "Bogdan", "E3": 7, "A1": "Elev", "A3": "Bogdan", "B3": 7}}

Indiciu (apare după prima greșeală): Selectezi A1:B3 trăgând, Ctrl+C, clic pe D1, Ctrl+V. Originalul din A1:B3 trebuie să rămână.

Explicația de după răspuns: Copia ocupă D1:E3, iar originalul A1:B3 a rămas pe loc.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În coloana C e o echipă scrisă greșit (**Mihai** și **Ioana**). Copiază numele din **A2:A4** peste ea, începând din **C2**.

Foaia de la început: A1 = Elev; A2 = Ana; A3 = Bogdan; A4 = Cristi; C1 = Echipa; C2 = Mihai; C3 = Ioana.

Verificarea automată (verifica): {"valori": {"C2": "Ana", "C3": "Bogdan", "C4": "Cristi", "A2": "Ana", "A4": "Cristi", "C1": "Echipa"}}

Indiciu (apare după prima greșeală): Selectezi A2:A4, Ctrl+C, clic pe C2, Ctrl+V.

Explicația de după răspuns: Mihai și Ioana au fost înlocuiți fără nicio întrebare: lipirea scrie peste ce era în locul nou.

### Încă un exercițiu (pasul 4, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Copiază **A1:B2** și lipește în **D1**. Apoi fă clic pe **D4** și mai apasă o dată Ctrl+V. Ce se întâmplă?

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9.

Variante:

- Tabelul apare încă o dată, din D4 (corect)

- Nu se mai lipește nimic

- Tabelul dispare din A1:B2

- Apare un mesaj de eroare

Indiciu (apare după prima greșeală): Încearcă în foaie și uită-te la marginea punctată după prima lipire.

Explicația de după răspuns: După Copiere (Copy), marginea punctată rămâne și poți lipi de câte ori vrei, până apeși Esc.

## Pasul 5: Aceleași comenzi, cu mouse-ul

Copiere și Lipire nu sunt doar taste. Le găsești și cu mouse-ul, în două locuri:

- **Clic dreapta**: apeși butonul din dreapta al mouse-ului pe zona selectată și apare un meniu. Alegi **Copiere (Copy)**. În locul nou, clic dreapta și, sub „Opțiuni lipire (Paste Options)”, prima pictogramă, planșeta: **Lipire (Paste)**.

- **Panglica**: fila **Pornire (Home)**, primul grup din stânga, **Memorie temporară (Clipboard)**. Pentru lipire apeși pe planșetă; cuvântul „Paste ▾” de sub ea deschide doar o listă.

De aici scriem pe scurt cu semnul **›**, care înseamnă „apoi alegi”: clic dreapta › Copiere = faci clic dreapta, apoi alegi Copiere din meniu.

[Imagine]

Legenda imaginii: Fila Pornire (Home), grupul Memorie temporară (Clipboard). Aici Lipire (Paste) e gri: încă nu era nimic copiat.

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Copiază **A1:B2** ca să înceapă în **D1**, **doar cu mouse-ul**: meniul de clic dreapta sau butoanele din fila Pornire (Home). Fără Ctrl+C / Ctrl+V.

Foaia de la început: A1 = Produs; B1 = Preț; A2 = Caiet; B2 = 5.

Verificarea automată (verifica): {"valori": {"D1": "Produs", "E1": "Preț", "D2": "Caiet", "E2": 5, "A1": "Produs", "B2": 5}}

Indiciu (apare după prima greșeală): Selectezi A1:B2 trăgând, clic dreapta pe zonă › Copiere (Copy), apoi clic dreapta pe D1 › Lipire (Paste).

Explicația de după răspuns: Aceeași copiere, cu meniul: copia e în D1:E2, originalul a rămas.

### Încă un exercițiu (pasul 5, varianta 1)

Unde găsești butonul Copiere (Copy) în panglică?

Variante:

- Pornire (Home), Memorie temporară (corect)

- Inserare (Insert), la început

- În caseta de nume

- Pe fila foii, jos

Indiciu (apare după prima greșeală): E primul grup din stânga al primei file.

Explicația de după răspuns: Copiere, Decupare și Lipire stau împreună în grupul Memorie temporară (Clipboard) de pe fila Pornire (Home).

## Pasul 6: Mutarea: Decupare (Cut), apoi Lipire (Paste)

La **mutare**, datele pleacă din locul vechi și ajung în locul nou. Pașii sunt ca la copiere, doar că începi cu **Decupare (Cut)**: Ctrl+X (X seamănă cu o foarfecă), clic dreapta › Decupare (Cut) sau foarfeca din fila Pornire (Home).

Apoi clic pe colțul stânga-sus al locului nou și Lipire (Paste). Locul vechi rămâne gol, iar marginea punctată dispare singură: după o decupare lipești **o singură dată**.

Cum alegi: datele îți trebuie în **două** locuri? Copiezi. Le vrei în **alt** loc? Muți.

**Uite cum:**

[Foaie desenată: coloanele A–C, rândurile 1–2; celule completate: A1 = Ana, A2 = Bogdan; celule colorate: A2]

Înainte: numele în A1:A2.

[Foaie desenată: coloanele A–C, rândurile 1–2; celule completate: C1 = Ana, C2 = Bogdan; celule colorate: C2]

După mutare: coloana A e goală.

**Explică-mi altfel:**

Copierea e ca o **fotocopie**: originalul rămâne la tine. Mutarea e ca atunci când îți muți **ghiozdanul** de pe o bancă pe alta: pe prima bancă nu mai e.

### Încearcă (pasul 6)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Mută tabelul **A1:B2** ca să înceapă în **C3**. În A1:B2 nu trebuie să mai rămână nimic.

Foaia de la început: A1 = Produs; B1 = Preț; A2 = Caiet; B2 = 5.

Verificarea automată (verifica): {"valori": {"C3": "Produs", "D3": "Preț", "C4": "Caiet", "D4": 5}, "gol": ["A1", "B1", "A2", "B2"]}

Indiciu (apare după prima greșeală): Selectezi A1:B2, Decupare (Ctrl+X), clic pe C3, Lipire (Ctrl+V).

Explicația de după răspuns: Mutarea a pus tabelul în C3:D4 și a golit locul vechi.

### Încă un exercițiu (pasul 6, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Coloana cu note stă prea departe de nume. Mut-o din **D1:D4** în **B1:B4**.

Foaia de la început: A1 = Elev; A2 = Ana; A3 = Bogdan; A4 = Cristi; D1 = Nota; D2 = 9; D3 = 7; D4 = 10.

Verificarea automată (verifica): {"valori": {"B1": "Nota", "B2": 9, "B3": 7, "B4": 10, "A2": "Ana"}, "gol": ["D1", "D2", "D3", "D4"]}

Indiciu (apare după prima greșeală): Selectezi D1:D4, Decupare, clic pe B1, Lipire.

Explicația de după răspuns: Notele sunt acum în B1:B4, lângă nume, iar coloana D a rămas goală.

### Încă un exercițiu (pasul 6, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Decupează **A1:A2** și lipește în **C1**. Apoi fă clic pe **E1** și mai dă o dată Lipire (Paste). Ce se întâmplă?

Foaia de la început: A1 = Ana; A2 = Bogdan.

Variante:

- Nu se mai lipește nimic (corect)

- Numele apar și în E1:E2

- Numele se întorc în A1:A2

- Apare un mesaj de eroare

Indiciu (apare după prima greșeală): Încearcă în foaie. Ce s-a întâmplat cu marginea punctată după prima lipire?

Explicația de după răspuns: După o decupare lipești o singură dată: marginea punctată dispare, iar a doua Lipire (Paste) nu mai aduce nimic.

### Încă un exercițiu (pasul 6, varianta 3)

Vrei aceeași listă de nume și pe foaia „Semestrul 2”, dar să rămână și pe foaia „Semestrul 1”. Cu ce comandă începi, după ce ai selectat lista?

Variante:

- Copiere (Copy), Ctrl+C (corect)

- Decupare (Cut), Ctrl+X

- Lipire (Paste), Ctrl+V

Indiciu (apare după prima greșeală): Lista trebuie să fie în două locuri.

Explicația de după răspuns: Copierea lasă originalul pe loc. Decuparea ar lua lista de pe foaia „Semestrul 1”.

## Pasul 7: Golești celule și anulezi o greșeală

**Golești** celule: le selectezi și apeși tasta Delete (pe unele tastaturi scrie Del). Conținutul dispare, dar celulele rămân la locul lor, goale: nimic nu urcă. La fel face clic dreapta › **Golire conținut (Clear Contents)**.

Tasta Backspace (săgeata ← de deasupra lui Enter) șterge ce e în celula activă și te lasă să scrii în ea (Esc renunță). Pentru o zonă folosești Delete.

Ai greșit? Ctrl+Z sau butonul **Anulare (Undo)** ↶, sus în stânga, anulează ultima operație. Apeși de mai multe ori ca să mergi mai înapoi.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–4; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 9, A3 = Bogdan, A4 = Cristi, B4 = 10; celule colorate: B3]

Delete pe B3: B3 rămâne goală, nota lui Cristi stă tot în B4.

**Explică-mi altfel:**

Tasta Delete e ca guma pe o fișă: ștergi ce e scris, dar fișa rămâne la locul ei, în teanc.

### Încearcă (pasul 7)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

În **C3** a rămas o observație scrisă din greșeală. Golește celula, dar observația lui Cristi trebuie să rămână în **C4**.

Foaia de la început: A1 = Elev; B1 = Nota; C1 = Observații; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 7; C3 = de șters; A4 = Cristi; B4 = 10; C4 = premiul I.

Verificarea automată (verifica): {"gol": ["C3"], "valori": {"C4": "premiul I", "A4": "Cristi", "B3": 7}}

Indiciu (apare după prima greșeală): Clic pe C3 și tasta Delete (sau clic dreapta › Golire conținut).

Explicația de după răspuns: Delete golește doar C3. Nimic nu urcă: observația lui Cristi a rămas în C4.

### Încă un exercițiu (pasul 7, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Golește dintr-o dată notele lui **Bogdan**, **B3:C3**: selectează zona și apasă Delete.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"gol": ["B3", "C3"], "valori": {"A3": "Bogdan", "B4": 10}}

Indiciu (apare după prima greșeală): Tragi de la B3 la C3, apoi Delete.

Explicația de după răspuns: Delete golește toată zona selectată deodată; numele lui Bogdan și rândul de dedesubt au rămas pe loc.

### Încă un exercițiu (pasul 7, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Selectează **B2:C4** și apasă Delete. Apoi apasă Ctrl+Z. Ce se întâmplă cu notele?

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Variante:

- Revin exact cum erau (corect)

- Rămân șterse

- Se golește tot tabelul

- Revin, dar în altă coloană

Indiciu (apare după prima greșeală): Încearcă în foaie. Ctrl+Z anulează ultima operație.

Explicația de după răspuns: Ctrl+Z, adică Anulare (Undo), anulează ultima operație, golirea: notele revin la locul lor.

## Pasul 8: Scoți un rând sau o coloană din tabel

Un elev s-a mutat, iar rândul lui trebuie **scos** din tabel, nu doar golit. Clic dreapta pe **numărul** rândului, în stânga › **Ștergere (Delete)**: rândul dispare, iar rândurile de dedesubt urcă cu unul.

La fel pentru o coloană: clic dreapta pe **litera** ei, sus › **Ștergere (Delete)**. Coloanele din dreapta ei vin spre stânga.

Pe telefon, fără meniu: atingi numărul rândului, apoi pictograma **Ștergere (Delete)** din panglică, grupul Celule (Cells).

**Capcană:** clic dreapta pe o celulă › „Ștergere… (Delete…)” nu golește celula: o scoate și mută celulele vecine. Pentru golire rămâi la tasta Delete.

**Uite cum:**

[Foaie desenată: coloanele A–B, rândurile 1–5; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 9, A3 = Bogdan, B3 = 7, A4 = Cristi, B4 = 10, A5 = Dana, B5 = 6]

Înainte.

[Foaie desenată: coloanele A–B, rândurile 1–5; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 9, A3 = Cristi, B3 = 10, A4 = Dana, B4 = 6]

După ștergerea rândului 3: Cristi și Dana au urcat.

**Explică-mi altfel:**

E ca lista de pe ușa clasei: scoți numele unui elev plecat, iar numele de sub el urcă fiecare cu un loc și astupă golul.

### Încearcă (pasul 8)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

**Bogdan** s-a mutat la altă școală. Scoate tot rândul lui din tabel: clic dreapta pe numărul rândului lui, apoi **Ștergere (Delete)**.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"valori": {"A2": "Ana", "A3": "Cristi", "B3": 10, "C3": 6, "A4": "Dana", "B4": 6, "A5": "Elena", "C5": 7}, "gol": ["A6", "B6", "C6"]}

Indiciu (apare după prima greșeală): Bogdan e pe rândul 3. Clic dreapta pe cifra 3 din stânga, apoi Ștergere (Delete).

Explicația de după răspuns: Rândul 3 a dispărut, iar Cristi, Dana și Elena au urcat cu câte un rând. Rândul 6 a rămas gol.

### Încă un exercițiu (pasul 8, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Coloana **Absențe** nu mai trebuie. Scoate toată coloana ei, ca notele să vină în locul ei.

Foaia de la început: A1 = Elev; B1 = Absențe; C1 = Nota; A2 = Ana; B2 = 2; C2 = 9; A3 = Bogdan; B3 = 0; C3 = 7.

Verificarea automată (verifica): {"valori": {"A1": "Elev", "B1": "Nota", "B2": 9, "B3": 7}, "gol": ["C1", "C2", "C3"]}

Indiciu (apare după prima greșeală): Absențele sunt în coloana B. Clic dreapta pe litera B, sus, apoi Ștergere (Delete).

Explicația de după răspuns: Coloana B a dispărut, iar notele au venit din C în B.

### Încă un exercițiu (pasul 8, varianta 2)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Vezi capcana: clic dreapta pe **C3**, alege „Ștergere… (Delete…)”, lasă bifat „Deplasare celule în sus (Shift cells up)” și apasă **OK**. Ce se întâmplă cu observația „premiul I” din C4?

Foaia de la început: A1 = Elev; B1 = Nota; C1 = Observații; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 7; C3 = de șters; A4 = Cristi; B4 = 10; C4 = premiul I.

Variante:

- Urcă în C3, lângă Bogdan (corect)

- Rămâne în C4

- Dispare de tot

- Apare și în C3, și în C4

Indiciu (apare după prima greșeală): Fă-o în foaie: în fereastra Ștergere lași bifat „Deplasare celule în sus” și apeși OK. Apoi uită-te la coloana C.

Explicația de după răspuns: „Ștergere…” scoate celula C3 și urcă celulele de sub ea: observația lui Cristi ajunge greșit lângă Bogdan. Ctrl+Z o repune. Pentru golire: tasta Delete.

## Atelier: Atelier: pregătești catalogul pentru semestrul al doilea

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Atelier: pregătești catalogul pentru semestrul al doilea

Foaia de mai jos se poartă ca Excel-ul: merg tastele, clic dreapta (pe celule, pe numerele rândurilor și pe literele coloanelor) și fila **Pornire (Home)**. Deasupra foii sunt **testele**: fiecare se bifează singur când sarcina lui e gata. Între Copiere și Lipire nu da alte comenzi: o golire sau o ștergere oprește copierea, ca în Excel. Ai greșit? Ctrl+Z. La final apasă **Verifică**.

Fă cele patru sarcini, în ce ordine vrei: **1.** Mută absențele din **F1:F6** în **D1:D6**, lângă note. **2.** Dana s-a mutat la altă școală: scoate tot rândul ei. **3.** Copiază lista de nume, **A1:A6**, în **E1**: acolo începe lista pentru semestrul al doilea. **4.** Golește celula în care scrie „ciornă”.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7; F1 = Absențe; F2 = 2; F3 = 0; F4 = 1; F5 = 3; F6 = 0; B8 = ciornă.

Teste care se bifează: Absențele stau în coloana D, lângă note, iar coloana F e goală; Rândul Danei e scos: Elena a urcat pe rândul 5; Lista de nume e copiată în E1, iar originalul a rămas în coloana A; Nicio celulă nu mai conține „ciornă”

Verificarea automată (verifica): {"valori": {"A1": "Elev", "A2": "Ana", "A3": "Bogdan", "A4": "Cristi", "A5": "Elena", "B2": 9, "B3": 7, "B4": 10, "B5": 8, "C2": 10, "C3": 8, "C4": 6, "C5": 7, "D1": "Absențe", "D2": 2, "D3": 0, "D4": 1, "D5": 0, "E1": "Elev", "E2": "Ana", "E3": "Bogdan", "E4": "Cristi", "E5": "Elena"}, "gol": ["A6", "B6", "C6", "D6", "E6", "F1", "F2", "F3", "F4", "F5", "F6", "B7", "B8"]}

Indiciu (apare după prima greșeală): Mutare: selectezi F1:F6, Ctrl+X, clic pe D1, Ctrl+V. Rândul Danei: clic dreapta pe numărul 5, apoi Ștergere (Delete). Copiere: A1:A6, Ctrl+C, clic pe E1, Ctrl+V. Ciorna: clic pe ea, apoi Delete.

Explicația de după răspuns: Catalogul e gata: absențele stau lângă note, Dana nu mai e în tabel, iar lista de nume pentru semestrul al doilea începe în E1.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Magazinul clasei. Rigla nu se mai vinde. **1.** Scoate tot rândul ei. **2.** Apoi copiază tabelul rămas, **A1:C3**, ca să înceapă în **A6**: e modelul pentru luna viitoare.

Foaia de la început: A1 = Produs; B1 = Preț; C1 = Stoc; A2 = Caiet; B2 = 5; C2 = 20; A3 = Riglă; B3 = 4; C3 = 0; A4 = Pix; B4 = 2; C4 = 35.

Teste care se bifează: Rândul riglei e scos, iar pixul a urcat pe rândul 3; Copia tabelului începe în A6; Originalul a rămas în A1:C3

Verificarea automată (verifica): {"valori": {"A1": "Produs", "A2": "Caiet", "A3": "Pix", "B3": 2, "C3": 35, "A6": "Produs", "B6": "Preț", "C6": "Stoc", "A7": "Caiet", "B7": 5, "C7": 20, "A8": "Pix", "B8": 2, "C8": 35}, "gol": ["A4", "B4", "C4"]}

Indiciu (apare după prima greșeală): Clic dreapta pe numărul 3 (rândul riglei), apoi Ștergere (Delete). Apoi selectezi A1:C3, Ctrl+C, clic pe A6, Ctrl+V.

Explicația de după răspuns: Întâi ai scos rândul riglei, apoi ai copiat tabelul rămas. Invers, copia ar fi avut și rigla.

## Acum în aplicația adevărată

1. Deschide Excel și fă un registru nou, gol (Ctrl+N).

2. Clic pe A1, scrie **Elev**, apasă Tab, scrie **Nota**, apasă Enter. În A2:A5 scrie patru nume inventate, iar în B2:B5 câte o notă.

3. Selectează **A1:B5** trăgând cu mouse-ul, dă **Copiere (Copy)** (Ctrl+C), clic pe **D1** și **Lipire (Paste)** (Ctrl+V). Apasă Esc ca să oprești marginea punctată.

4. Mută copia: selectează **D1:E5**, **Decupare (Cut)** (Ctrl+X), clic pe **G1**, **Lipire (Paste)**. Coloanele D și E rămân goale.

5. Clic pe o notă din coloana B și apasă Delete: celula rămâne goală. Apoi Ctrl+Z: nota revine.

6. Clic dreapta pe numărul rândului **3**, apoi **Ștergere (Delete)**: elevul de pe rândul 3 dispare din ambele tabele (A și G), iar cei de dedesubt urcă.

7. Salvează cu Ctrl+S, cu numele `Nume_Prenume_lectia4.xlsx`.

## Verificare

### Întrebarea 1

Care e adresa celulei din coloana F și rândul 9?

Variante:

- F9 (corect)

- 9F

- F-9

- I6

Indiciu (apare după prima greșeală): Întâi litera coloanei, apoi numărul rândului.

Explicația de după răspuns: Litera coloanei, apoi numărul rândului, lipite: F9.

### Întrebarea 2

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Selectează zona **A3:C5**: Bogdan, Cristi și Dana, cu toate notele lor.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"zona": "A3:C5"}

Indiciu (apare după prima greșeală): Apeși pe A3, ții apăsat și tragi până la C5.

Explicația de după răspuns: A3:C5 are colțurile A3 (stânga-sus) și C5 (dreapta-jos): 3 coloane × 3 rânduri = 9 celule.

### Întrebarea 3

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Copiază orarul, **A1:C3**, ca să înceapă în **A5**. Originalul rămâne pe loc.

Foaia de la început: A1 = Ora; B1 = Luni; C1 = Marți; A2 = Ora 1; B2 = TIC; C2 = Română; A3 = Ora 2; B3 = Mate; C3 = Engleză.

Verificarea automată (verifica): {"valori": {"A5": "Ora", "B5": "Luni", "C5": "Marți", "A6": "Ora 1", "B6": "TIC", "C6": "Română", "A7": "Ora 2", "B7": "Mate", "C7": "Engleză", "A1": "Ora", "C3": "Engleză"}}

Indiciu (apare după prima greșeală): Copiere, nu Decupare: originalul trebuie să rămână.

Explicația de după răspuns: Copia ocupă A5:C7, iar originalul A1:C3 a rămas.

### Întrebarea 4

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

Mută coloana cu absențe din **E1:E4** în **C1:C4**, lângă note.

Foaia de la început: A1 = Elev; B1 = Nota; E1 = Absențe; A2 = Ana; B2 = 9; E2 = 2; A3 = Bogdan; B3 = 7; E3 = 0; A4 = Cristi; B4 = 10; E4 = 1.

Verificarea automată (verifica): {"valori": {"C1": "Absențe", "C2": 2, "C3": 0, "C4": 1, "B2": 9}, "gol": ["E1", "E2", "E3", "E4"]}

Indiciu (apare după prima greșeală): Mutare = Decupare (Ctrl+X), clic pe C1, Lipire (Ctrl+V).

Explicația de după răspuns: Absențele sunt acum în C1:C4, iar coloana E a rămas goală.

### Întrebarea 5

(Exercițiu în aplicația simulată din pagină — tipul „excelx”.)

**1.** Cristi s-a mutat: scoate tot rândul lui. **2.** Golește Nota 2 a Anei, scrisă greșit, fără ca notele de sub ea să se miște.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 10; A3 = Bogdan; B3 = 7; C3 = 8; A4 = Cristi; B4 = 10; C4 = 6; A5 = Dana; B5 = 6; C5 = 9; A6 = Elena; B6 = 8; C6 = 7.

Verificarea automată (verifica): {"valori": {"A2": "Ana", "B2": 9, "A3": "Bogdan", "C3": 8, "A4": "Dana", "B4": 6, "C4": 9, "A5": "Elena", "B5": 8, "C5": 7}, "gol": ["C2", "A6", "B6", "C6"]}

Indiciu (apare după prima greșeală): Rândul lui Cristi: clic dreapta pe numărul lui, apoi Ștergere (Delete). Nota Anei: clic pe ea și tasta Delete.

Explicația de după răspuns: Dana și Elena au urcat în locul lui Cristi, iar Nota 2 a Anei e goală, fără să se fi mutat ceva.

## Ce am învățat

a găsit celule după adresă, a selectat zone ca A1:B3, a copiat și a mutat date, a golit celule cu Delete și a scos rânduri întregi dintr-un tabel, cu Ctrl+Z la îndemână
