# 03 — Jurnalul sarcinii (U1, U11, U12, U7) — cls8 / lectia6-proiect

## Ce am construit (U1)
Script: `u1_construieste.py` (datele luate din blocul „Copiaza” al HTML-ului, nu tastate de mine). Recalculare și randare: `H_randeaza.py xlsx` și `pdf`
pentru fiecare fișier (`randare_xlsx_*.txt`, `randare_pdf_*.txt`, `recalculat/`, `randat_xlsx/`).

| Fișier | Ce e | Rezultat observat |
|:--|:--|:--|
| `produs_elev/catalog_incearca.xlsx` | pașii 1-6 + BONUS | 26 de formule; G4 7,75 · G5 8,25 · G13 8,375; C15 7,55; COUNTIF 7; antet de pagină în PDF; PDF pe 2 pagini |
| `produs_elev/lipire_roRO_text.xlsx` | ipoteza: pe Windows în română notele „7.50” rămân text | toate mediile #DIV/0!, COUNTIF 0 |
| `produs_elev/ex1_catalog15_corect.xlsx` | Ex. 1 construit corect (Media în H, 5 materii C:G) | H4 = 6,4 |
| `produs_elev/ex1_dupa_rezolvare.xlsx` | Ex. 1 cum scrie rezolvarea pliată: `=AVERAGE(B4:F4)` | H4 = 6,125; 14 din 15 medii greșite (lipsește materia 5) |
| `produs_elev/ex2_buletin.xlsx` | Ex. 2 | 1 pagină, antet; axa graficului pornește la 7,35 |
| `produs_elev/ex2_rand15_intreg.xlsx` | Ex. 2, elevul ia tot rândul 15 | apare și bara „Media” |

Redeschis într-un proces nou (U7): `u7_redeschide.py` → `07_redeschis.json` (formule, formatare, grafic, orientare, antet, pagini).

## Povestea pașilor, ca elev de 14 ani
1. **Deschid și salvez.** Lecția spune „Salveaza fisierul ca Catalog_Clasa8.xlsx” — nu spune unde. Pe un PC de laborator (poate cu restaurare la repornire) nu știu dacă îl mai găsesc la ora de evaluare, o săptămână mai târziu. „Excel Online” cere cont Microsoft.
2. **Titlul și Merge & Center.** Pe Office în română butonul se cheamă „Îmbinare & centru” (`surse/imbinare_ro.txt`). Lecția nu dă traducerea. Titlul are „2024-2025” — copiez un an greșit fără să observ.
3. **Lipesc blocul.** Blocul are Tab-uri, deci se așază pe coloane. Dacă Windows-ul e în română, „7.50” nu e număr (`u4_cultura.txt`): notele rămân text, iar la pasul 3 văd `#DIV/0!` peste tot. Caseta „Nu merge formula AVERAGE?” mă trimite la „Convert to Number”; pe o setare în română, „7.50” nu arată ca un număr, deci nu știu dacă apare triunghiul verde — **ipoteză**, se vede doar în laborator.
4. **Formulele.** Cu datele lipite corect, formulele merg: am verificat rândurile 4, 5 și 13, nu doar primul, plus tragerea spre dreapta pe rândurile 15-17 (`04_a_doua_cale.json`).
5. **Formatarea.** „Toate notele” = C4:F13; mediile rămân cu 3 zecimale (8,625). Antetul „Matematica” se taie (lectia nu spune de lățimea coloanei).
6. **Graficul.** Ctrl + a doua zonă e un gest nou și fragil (dacă scap Ctrl, pierd prima selecție). Numele „Column Chart → 2-D Clustered Column” nu există pe interfața în română („Coloană grupată”).
7. **Tipărirea.** Page Layout / antet de pagină nu apar în nicio oră din planul VIII-U1 și nici în programă (`u4_programa_iesire.txt`). În Excel pentru web marginile nu se pot seta (`surse/margini_ro.txt`). Previzualizarea arată 2 pagini, graficul tăiat.
8. **Ex. 1.** Deschid rezolvarea după ce m-am blocat: „A1:F1 antet: Nr., Nume elev, Materia 1...Materia 5, apoi coloanele G=Media” — 7 titluri în 6 celule; `G4: =AVERAGE(B4:F4)` ia coloana cu numele și sare peste materia a 5-a. Dacă o copiez, media e greșită și nu primesc nicio eroare (AVERAGE ignoră textul).
9. **Ex. 2.** Graficul pe materii arată diferențe uriașe între 7,45 și 7,60 pentru că axa nu pornește de la 0.

## Notarea după baremul lecției
**Lecția nu are barem.** Nu există puncte, criterii sau o grilă (Grep „barem|puncte|grila|criteri” în HTML: 0 potriviri relevante; doar la Ex. 3 „Se evalueaza: raspuns de 2-3 propozitii”).
Planul școlii cere la ora 12 `fisa_proiect, grila_proiect` (`Proiectul_unitatii_VIII-U1.md`), iar sistemul de evaluare spune „o notă, pe grilă anunțată dinainte”. Grila generală există (`Info_Gimnaziu_2026/instrumente/Grila_produs.md`).
Am notat produsul meu `catalog_incearca.xlsx` în două feluri:
- **Lista pașilor din lecție (6 + bonus):** 7/7 făcute, verificate pe fișier (`07_redeschis.json`).
- **Grila școlii (nivelul = cel mai mic dintre criteriile 1-4):** 1 Cerința — Consolidat; 2 Corectitudine — Consolidat; 3 Organizarea — **De bază** („structură dată de profesor”: lecția dictează fiecare celulă); 4 Explicația — nu se poate nota din fișier. ⇒ **nivel De bază**, oricât de corect ar fi.
**Pe o clasă întreagă:** toți elevii lipesc aceleași date și urmează aceleași celule ⇒ fișiere aproape identice, nimic de diferențiat; iar lecția nu are un mod de a strânge fișierele (casetele „Salveaza raspunsul” primesc doar text). Singura parte care se poate nota pe niveluri e Ex. 1 (catalog propriu, 15×5) — tocmai acolo rezolvarea pliată e greșită.

## Constrângerile elevului simulat (U11)
Nu știe: engleza meniurilor, că separatorul zecimal depinde de Windows, ce e „Page Layout”, ce e COUNTIF. Nu vede: rezolvările pliate până nu apasă. Are: o oră de 50 de minute, poate un PC împărțit, fără stick. La Izvoare: fără calculator — proiectul devine temă acasă (calendarul comasează ora 12).
**Blocaje-ipoteză (de verificat la oră, nu fapte):** notele lipite ca text (#DIV/0!); pierderea selecției la Ctrl; nu găsește „Merge & Center”/„Page Layout” pe interfața română; nu știe unde a salvat; copiază formula greșită din rezolvarea Ex. 1.
