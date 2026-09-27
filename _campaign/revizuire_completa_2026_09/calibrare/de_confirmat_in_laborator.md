# De confirmat în laborator (Office în limba română)

**De ce:** documentația Microsoft în română se contrazice sau spune un singur lucru despre aceste nume. Doar ecranul unui calculator cu Office în română le poate lămuri. Fiecare verificare durează cam 10 secunde, iar toată lista cam 5 minute.

**Înainte:** deschideți Excel. Dacă prima filă de sus se numește **„Pornire”** (nu „Home”), calculatorul e potrivit.

**Cum răspundeți:** încercuiți varianta pe care o vedeți sau scrieți numele exact, cu diacritice. Cel mai bine e o **poză cu telefonul**, care devine dovadă în dicționar.

Pentru numele butoanelor: țineți mouse-ul o secundă pe buton și citiți textul care apare. Numele grupului e scris mic, sub butoanele lui.

## Cele mai folosite

Ordinea e după numărul de lecții LearningHub care pomenesc elementul. Numărul e aproximativ: am căutat numele, în engleză sau în română, în cele 879 de pagini de lecție.

| # | Program | Ce faceți | A | B | Lecții |
|---|---|---|---|---|---|
| 1 | Word | Fila **Inserare**: cum se numesc butoanele pentru partea de sus și cea de jos a paginii? | „Antet” / „Subsol” | altceva: ____ | ~84 |
| 2 | Word | Citiți numele filelor de sus. Cum se numește fila cu Margini și Orientare? | „Aspect” | „Aspect pagină” | ~81 |
| 3 | Excel | Fila **Pornire**: în ce grup stă butonul „Formatare condiționată”? | „Stiluri” | „Stil” | ~68 |
| 4 | Excel | Fila **Aspect pagină**: butonul pentru marginile paginii | „Margini” | altceva: ____ | ~44 |
| 5 | Excel | Fila **Date**: butonul cu pâlnia | „Filtru” | „Filtrare” | ~43 |
| 6 | Word | Fila **Pornire**, grupul Font: mouse-ul pe markerul galben „ab” | „Culoare evidențiere text” | altceva: ____ | ~38 |
| 7 | Word | Același grup: mouse-ul pe „A” colorat | „Culoare font” | „Culoarea fontului” | ~15 |
| 8 | Excel | Într-o celulă scrieți `=SUMA(1;2)` și apăsați Enter. Ce eroare apare? | `#NAME?` | `#NUME?` | ~13 |
| 9 | Excel | Fila **Date**: numele grupului în care stau Sortare și Filtru | „Sortare și filtrare” | „Sortare & filtrare” | ~13 |
| 10 | Excel | Scrieți `=1+"a"` și apăsați Enter. Ce eroare apare? | `#VALUE!` | `#VALOARE!` | ~11 |

**Bonus Excel (5 secunde):** scrieți `=SUM(1;2)` și apăsați Enter.
- Dacă apare **3**, calculatorul are format regional românesc și lecțiile cu `;` merg.
- Dacă apare eroare, formatul regional e englezesc și acolo se scrie `=SUM(1,2)`.

Separatorul depinde de setările Windows-ului, nu de limba Office-ului.

## Dacă mai aveți 3 minute

| # | Program | Ce faceți | A | B | Lecții |
|---|---|---|---|---|---|
| 11 | Word | Fila **Pornire**: numele grupului cu Găsire / Înlocuire | „Editare” | altceva: ____ | ~6 |
| 12 | Word | Fila **Inserare**: numele grupului cu Imagini și Forme | „Ilustrații” | altceva: ____ | ~6 |
| 13 | Word | Fila **Revizuire**: numele grupului cu verificarea ortografiei | „Verificare” | altceva: ____ | ~5 |
| 14 | Word | Fila **Revizuire**: numele grupului cu „Comentariu nou” | „Comentarii” | altceva: ____ | ~5 |
| 15 | Word | Fila **Pornire**, grupul Font: mouse-ul pe „A” cu radieră | „Ștergeți întreaga formatare” | „Anulare formatare” | ~5 |
| 16 | Word | Același grup: mouse-ul pe „abc” tăiat | „Tăiat cu o linie” | „Tăiere text cu o linie” | ~4 |
| 17 | Excel | Fila **Aspect pagină**: butonul pentru zona care se imprimă | „Zonă de imprimat” | „Zonă de imprimare” | ~2 |
| 18 | PowerPoint | Inserați o formă și dați clic dreapta pe ea: ultima opțiune din meniu. Apoi fila nouă care apare sus. | meniul: „Formatare formă”; fila: „Format formă” | altceva: ____ | ~2 |
| 19 | Word | Fila **Inserare**: numele primului grup (Pagină copertă, Pagină goală) | „Pagini” | altceva: ____ | ~1 |
| 20 | PowerPoint | Fila **Expunere diapozitive**: al doilea buton, apoi butonul pentru prezentarea pe internet | „De la diapozitivul curent”, „Prezentare online” | altceva: ____ | ~1 |
| 21 | Excel | Scrieți `=FIND("b";"abc")` și apăsați Enter | `2` | `#NAME?` | ~1 |
| 22 | PowerPoint | Fila **Inserare**: butonul pentru albumul de fotografii | „Album foto” | altceva: ____ | 0 |

## După laborator

- Trimiteți răspunsurile sau pozele.
- Fiecare răspuns se salvează ca text în `calibrare/capturi/<nume>.txt`. În dicționar apare apoi ca sursă `captura:capturi/<nume>.txt`, iar `verifica_calibrare.py` o acceptă ca dovadă din aplicația reală.
- Intrarea respectivă trece la CONFIRMAT numai după ce validatorul dă din nou 0.
