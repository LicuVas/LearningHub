## Pasul 1: Zona de celule

O **zonă** e un dreptunghi de celule. O scrii cu adresa colțului din **stânga-sus**, **două puncte**, apoi adresa colțului din **dreapta-jos**: `B2:D4`.

Câte celule are o zonă? Numeri coloanele (B, C, D = 3), numeri rândurile (2, 3, 4 = 3) și le înmulțești: 3 × 3 = **9** celule.

**Uite cum:**

[Foaie desenată: coloanele A–E, rândurile 1–5; toate celulele goale; celule colorate: B2, C2, D2, B3, C3, D3, B4, C4, D4]

Zona B2:D4: colțul stânga-sus B2, colțul dreapta-jos D4. 3 coloane × 3 rânduri = 9 celule.

**Explică-mi altfel:**

E ca atunci când spui „de la banca a doua la banca a patra, rândurile B până la D”: dai doar cele două colțuri, iar tot ce e între ele intră în zonă.

### Încearcă (pasul 1)

Câte celule are zona A1:B3?

Variante:

- 6 (corect)

- 5

- 3

- 9

Indiciu (apare după prima greșeală): Coloanele A, B = 2. Rândurile 1, 2, 3 = 3. Înmulțește.

Explicația de după răspuns: 2 coloane × 3 rânduri = 6 celule.

### Încă un exercițiu (pasul 1, varianta 1)

Cum scrii zona cu colțurile A1 (stânga-sus) și C2 (dreapta-jos)?

Variante:

- A1:C2 (corect)

- A1-C2

- A1;C2

- A1+C2

Indiciu (apare după prima greșeală): Între colțuri stau două puncte.

Explicația de după răspuns: Zona se scrie cu două puncte între colțuri: A1:C2.

### Încă un exercițiu (pasul 1, varianta 2)

Selectează zona **B2:C4**: apasă pe un colț, apoi pe colțul opus.

(Grilă de 5 coloane × 6 rânduri; alegi o zonă cu clic.)

Răspuns: B2:C4

Indiciu (apare după prima greșeală): Colțul stânga-sus e B2, colțul dreapta-jos e C4.

Explicația de după răspuns: B2:C4 are colțurile B2 (stânga-sus) și C4 (dreapta-jos).

## Pasul 2: Cum selectezi

- **Clic** pe o celulă = o alegi.

- O **zonă**: apeși pe primul colț și, cu butonul mouse-ului ținut apăsat, **tragi** până la colțul opus. Sau: clic pe primul colț, apoi Shift+clic pe colțul opus.

- În Excel, clic pe **litera** unei coloane selectează toată coloana; clic pe **numărul** unui rând selectează tot rândul.

Zona selectată se colorează. Celula din care ai pornit rămâne albă: ea e **celula activă**, iar caseta de nume arată adresa ei.

**Uite cum:**

Selectezi `B2:C4`: apeși pe B2, ții apăsat, tragi până la C4, ridici degetul. B2 rămâne albă, restul zonei e colorat, iar caseta de nume arată B2.

### Încearcă (pasul 2)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Selectează în foaie zona **B2:C4** (notele primilor trei elevi), trăgând de la B2 la C4.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 8; A3 = Bogdan; B3 = 5; C3 = 7; A4 = Cristi; B4 = 10; C4 = 9; A5 = Dana; B5 = 6; C5 = 6; A6 = Elena; B6 = 8; C6 = 10.

Verificarea automată (verifica): {"zona": "B2:C4"}

Indiciu (apare după prima greșeală): Apasă pe B2 și, fără să ridici degetul, trage până la C4. Sau clic pe B2 și Shift+clic pe C4.

Explicația de după răspuns: Zona B2:C4: două coloane de note, trei elevi.

### Încă un exercițiu (pasul 2, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Selectează de la **B2** până la **C4**. Ce arată caseta de nume **după** ce ridici degetul de pe mouse?

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 8; A3 = Bogdan; B3 = 5; C3 = 7; A4 = Cristi; B4 = 10; C4 = 9; A5 = Dana; B5 = 6; C5 = 6; A6 = Elena; B6 = 8; C6 = 10.

Variante:

- B2 (corect)

- B2:C4

- C4

- Nota 1

Indiciu (apare după prima greșeală): Caseta de nume arată adresa celulei active, cea din care ai pornit.

Explicația de după răspuns: După selectare, caseta de nume arată celula activă, B2.

## Pasul 3: Copierea: Ctrl+C, apoi Ctrl+V

Copierea face un **duplicat**: originalul rămâne unde era.

- selectezi celulele;

- Ctrl+C: în jurul lor apare o margine punctată care „se mișcă”;

- clic pe celula unde vrei să înceapă copia (colțul stânga-sus al locului nou);

- Ctrl+V: lipești.

Marginea punctată dispare cu Esc.

[Imagine: Zona B2:D4 selectată în Excel, cu marginea punctată animată care apare după Ctrl+C]

Legenda imaginii: Zona `B2:D4` după Ctrl+C: marginea punctată din jur „se mișcă” pe ecran.

### Încearcă (pasul 3)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Copiază tabelul **A1:B2** începând din **D1**: selectează A1:B2, Ctrl+C, clic pe D1, Ctrl+V.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9.

Verificarea automată (verifica): {"valori": {"D1": "Elev", "E1": "Nota", "D2": "Ana", "E2": 9, "A1": "Elev", "B2": 9}, "gest": ["copiere"]}

Indiciu (apare după prima greșeală): Locul nou îl dai printr-o singură celulă: colțul stânga-sus, D1.

Explicația de după răspuns: Copia începe din D1 și ocupă tot D1:E2. Originalul A1:B2 a rămas.

### Încă un exercițiu (pasul 3, varianta 1)

După Ctrl+C și Ctrl+V, ce se întâmplă cu celulele de unde ai copiat?

Variante:

- Rămân la locul lor, neschimbate (corect)

- Dispar

- Se golesc

- Se mută în locul nou

Indiciu (apare după prima greșeală): Copierea face un duplicat.

Explicația de după răspuns: La copiere originalul rămâne. Doar la mutare pleacă de unde era.

## Pasul 4: Mutarea: Ctrl+X, apoi Ctrl+V

La **mutare**, datele pleacă de unde erau și ajung în locul nou. Pașii sunt ca la copiere, doar că începi cu Ctrl+X (decupare).

Tastele C, X și V stau alături pe tastatură: copiez, decupez, lipesc.

Cum alegi:

- vrei datele în **două** locuri → **copiezi** (Ctrl+C);

- vrei datele în **alt** loc → **muți** (Ctrl+X).

**Uite cum:**

Înainte: numele sunt în A1:A2. Selectezi A1:A2, Ctrl+X, clic pe C1, Ctrl+V.

[Foaie desenată: coloanele A–C, rândurile 1–2; celule completate: A1 = Ana, A2 = Bogdan; celule colorate: A1, A2]

Înainte

[Foaie desenată: coloanele A–C, rândurile 1–2; celule completate: C1 = Ana, C2 = Bogdan; celule colorate: C1, C2]

După: coloana A e goală, numele sunt în C1:C2.

**Explică-mi altfel:**

Copierea e ca o **fotocopie**: originalul rămâne la tine. Mutarea e ca atunci când îți muți **ghiozdanul** de pe o bancă pe alta: pe prima bancă nu mai e.

### Încearcă (pasul 4)

Vrei ca tabelul să nu mai stea în A1:C5, ci în E1:G5. Cu ce începi, după ce l-ai selectat?

Variante:

- Ctrl+X (corect)

- Ctrl+C

- Delete

- Ctrl+Z

Indiciu (apare după prima greșeală): Tabelul trebuie să plece din A1:C5.

Explicația de după răspuns: Mutarea începe cu Ctrl+X. Cu Ctrl+C l-ai avea de două ori, iar Delete doar îl golește.

### Încă un exercițiu (pasul 4, varianta 1)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Mută notele din **A1:A3** în **C1:C3**: selectezi A1:A3, Ctrl+X, clic pe C1, Ctrl+V.

Foaia de la început: A1 = Nota; A2 = 9; A3 = 7.

Verificarea automată (verifica): {"valori": {"C1": "Nota", "C2": 9, "C3": 7}, "gol": ["A1", "A2", "A3"]}

Indiciu (apare după prima greșeală): Mutarea începe cu X, nu cu C: coloana A trebuie să rămână goală.

Explicația de după răspuns: După mutare, datele sunt doar în C1:C3; coloana A a rămas goală.

## Pasul 5: Ștergerea și Anularea

Delete **golește** celulele selectate: conținutul dispare, dar celulele rămân la locul lor, goale. Nimic nu urcă și nimic nu se mută.

Ai greșit ceva? Ctrl+Z **anulează** ultima operație. O apeși de mai multe ori ca să mergi mai înapoi. Același lucru face butonul **Anulare (Undo)**, cu săgeata întoarsă ↶.

**Uite cum:**

[Foaie desenată: coloanele A–C, rândurile 1–2; celule completate: A1 = Elev, B1 = Nota, A2 = Ana, B2 = 9, C2 = greșit; celule colorate: C2]

Alegi C2 și apeși Delete: C2 rămâne pe loc, doar goală.

### Încearcă (pasul 5)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

În **C3** a rămas un cuvânt scris din greșeală. Golește celula: alege-o și apasă Delete.

Foaia de la început: A1 = Elev; B1 = Nota; A3 = Bogdan; B3 = 8; C3 = greșit.

Verificarea automată (verifica): {"gol": ["C3"]}

Indiciu (apare după prima greșeală): Clic pe C3, apoi tasta Delete (sau Del).

Explicația de după răspuns: Delete golește celulele alese, fără să le mute pe celelalte.

### Încă un exercițiu (pasul 5, varianta 1)

(Adevărat sau fals?)

După Delete, celulele dispar din foaie, iar cele de dedesubt urcă în locul lor.

Răspuns: Fals

Indiciu (apare după prima greșeală): Recitește prima propoziție a pasului.

Explicația de după răspuns: Fals. Delete doar golește conținutul. Celulele rămân la locul lor, goale.

### Încă un exercițiu (pasul 5, varianta 2)

Potrivește tasta cu ce face.

De potrivit:

- Ctrl+C ↔ Copiază selecția

- Ctrl+X ↔ Decupează selecția, ca s-o muți

- Ctrl+V ↔ Lipește în locul nou

- Delete ↔ Golește celulele selectate

- Ctrl+Z ↔ Anulează ultima operație

Indiciu (apare după prima greșeală): C, X, V stau alături: copiez, decupez, lipesc.

Explicația de după răspuns: C, X și V stau alături pe tastatură: copiez, decupez, lipesc.

## Atelier: Reorganizează tabelul

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Reorganizează tabelul

Tabelul de mai jos are nevoie de ordine. **Sarcina:** fă o copie a tabelului A1:B3 care să înceapă în **A5** (pentru semestrul al doilea) și golește celula **D1**, scrisă din greșeală. Folosește Ctrl+C, Ctrl+V și Delete, ca în Excel.

Copiază A1:B3 începând din A5 și golește D1.

Foaia de la început: A1 = Elev; B1 = Nota; A2 = Ana; B2 = 9; A3 = Bogdan; B3 = 7; D1 = de șters.

Verificarea automată (verifica): {"valori": {"A1": "Elev", "A5": "Elev", "B5": "Nota", "A6": "Ana", "B6": 9, "A7": "Bogdan", "B7": 7}, "gol": ["D1"], "gest": ["copiere"]}

Indiciu (apare după prima greșeală): Selectezi A1:B3 trăgând, Ctrl+C, clic pe A5, Ctrl+V. Apoi clic pe D1 și Delete.

Explicația de după răspuns: Copia a ocupat A5:B7, originalul a rămas, iar D1 e goală.

### Atelier — încă unul (1)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Încă unul: mută tabelul **A1:B2** ca să înceapă din **C3**. În A1:B2 nu trebuie să mai rămână nimic.

Foaia de la început: A1 = Produs; B1 = Preț; A2 = Caiet; B2 = 5.

Verificarea automată (verifica): {"valori": {"C3": "Produs", "D3": "Preț", "C4": "Caiet", "D4": 5}, "gol": ["A1", "B1", "A2", "B2"]}

Indiciu (apare după prima greșeală): Mutare = Ctrl+X, clic pe C3, Ctrl+V.

Explicația de după răspuns: Mutarea a golit locul vechi și a pus tabelul în C3:D4.

### Atelier — încă unul (2)

(Exercițiu în aplicația simulată din pagină — tipul „excel”.)

Încă unul: golește toate notele lui Bogdan, **B3:C3**, dintr-o dată: selectează zona și apasă Delete.

Foaia de la început: A1 = Elev; B1 = Nota 1; C1 = Nota 2; A2 = Ana; B2 = 9; C2 = 8; A3 = Bogdan; B3 = 5; C3 = 7; A4 = Cristi; B4 = 10; C4 = 9; A5 = Dana; B5 = 6; C5 = 6; A6 = Elena; B6 = 8; C6 = 10.

Verificarea automată (verifica): {"gol": ["B3", "C3"]}

Indiciu (apare după prima greșeală): Tragi de la B3 la C3, apoi Delete.

Explicația de după răspuns: Delete golește toată zona selectată deodată.

## Acum în aplicația adevărată

1. Deschide Excel și creează un registru nou (Ctrl+N, sau Fișier (File) → Nou (New) → registrul gol). Dublu-clic pe fila primei foi, jos, scrie **Plante** și apasă Enter.

2. Scrie tabelul: în A1 **Planta**, în B1:D1 **Săpt. 1**, **Săpt. 2**, **Săpt. 3**, iar pe rândurile 2-4 cele trei plante cu înălțimile lor. Verifică: toate numerele stau la dreapta.

3. În E1 scrie **Creștere**, în E2 `=D2-B2`, apoi trage de mânerul de umplere până în E4. Lasă rândul 5 gol, iar în E6 scrie `=MAX(E2:E4)` (în A6: „Creșterea maximă”).

4. În F1 scrie **Verdict**, iar în F2 `=IF(E2>=5;"crește bine";"nu crește")` (cu virgule în loc de ; dacă Excel ți le cere în bulă). Trage formula până în F4.

5. Clic într-o celulă din tabel → Date (Data) → Sortare (Sort) → Sortare după Creștere, de la cel mai mare la cel mai mic (Largest to Smallest) → OK. Verifică: fiecare plantă are tot înălțimile ei.

6. Selectează A1:F1 → Pornire (Home) → Aldin și o Culoare de umplere (Fill Color). Selectează A1:F4 → Borduri (Borders) → Toate bordurile (All Borders). Dublu-clic pe marginile coloanelor, ca să încapă tot.

7. Selectează A1:D4 → Inserare (Insert) → grafic linie (Line). Apasă pe titlul graficului și scrie **Creșterea plantelor**.

8. Salvează cu Ctrl+S (Fișier (File) → Salvare ca (Save As)) în folderul clasei, cu numele `Nume_Prenume_plante.xlsx`.

## Verificare

### Întrebarea 1

Vrei aceeași listă de nume și pe foaia a doua, dar să rămână și pe prima. Ce folosești?

Variante:

- Ctrl+C, apoi Ctrl+V (corect)

- Ctrl+X, apoi Ctrl+V

- Delete

- Ctrl+Z

Indiciu (apare după prima greșeală): Datele trebuie să fie în două locuri.

Explicația de după răspuns: Copierea lasă originalul pe loc. Mutarea (Ctrl+X) l-ar lua de pe prima foaie.

### Întrebarea 2

Selectează zona `B2:C4`: apasă pe un colț, apoi pe colțul opus.

(Grilă de 5 coloane × 6 rânduri; alegi o zonă cu clic.)

Răspuns: B2:C4

Explicația de după răspuns: B2:C4 are colțurile B2 (stânga-sus) și C4 (dreapta-jos).

### Întrebarea 3

Câte celule are zona `B2:D4`?

Variante:

- 6

- 8

- 9 (corect)

- 12

Indiciu (apare după prima greșeală): Numără coloanele, numără rândurile, înmulțește.

Explicația de după răspuns: 3 coloane (B, C, D) × 3 rânduri (2, 3, 4) = 9 celule.

### Întrebarea 4

Potrivește ce vrei să faci cu tastele potrivite.

De potrivit:

- Vrei datele în două locuri ↔ Ctrl+C, apoi Ctrl+V

- Vrei datele doar în locul nou ↔ Ctrl+X, apoi Ctrl+V

- Vrei celula goală, dar pe loc ↔ Delete

- Ai greșit ultima operație ↔ Ctrl+Z

Explicația de după răspuns: Copierea lasă originalul, mutarea îl ia din loc, Delete doar golește, iar Ctrl+Z anulează ultima operație.

### Întrebarea 5

(Adevărat sau fals?)

Alegi B3 și apeși Delete. Nota din B4 rămâne tot în B4, iar B3 rămâne goală.

Răspuns: Adevărat

Explicația de după răspuns: Adevărat. Delete golește doar celula aleasă; nimic nu urcă și nimic nu se mută.

### Întrebarea 6

Ai golit din greșeală tot tabelul. Ce apeși imediat?

Variante:

- Ctrl+Z (corect)

- Ctrl+S

- Delete

- Ctrl+V

Indiciu (apare după prima greșeală): Care tastă anulează ultima operație?

Explicația de după răspuns: Ctrl+Z anulează ștergerea și tabelul revine.

## Ce am învățat

interfață, registre și foi, editare, tipuri de date, formatare, formule, funcții, IF, sortare și grafice
