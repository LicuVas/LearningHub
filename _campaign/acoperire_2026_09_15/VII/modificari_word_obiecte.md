# Modificări în word-obiecte-vii („Misiunea Machetă”) — evaluator independent, 15.09.2026

Copia de dinainte: `word-obiecte-vii.index.html.inainte` (în acest folder). Sursele Microsoft sunt salvate ca text brut în `surse\` (curl, nu WebFetch).

## Greșeli dovedite, reparate
| id | Gravitate | Ce era | Ce e acum | Dovada |
|---|---|---|---|---|
| S01 | important | Încadrarea „Aliniat la text” (pagina N2, match, classify, butonul din simulator) | „În linie cu textul” | `surse\wrap.txt`: „În linie cu textul plasează imaginea într-un paragraf, ca și cum ar fi un text” (support.microsoft.com/ro-ro, articolul bdbbe1fe) |
| S02 | important | Orientarea „peisaj, numită în unele versiuni «vedere»”; butonul „Peisaj (vedere)”; categoria „Peisaj”; varianta „Peisaj, fiindcă…”; provocarea diplomei | „vedere, cum îi spune Word în română, adică «peisaj»”; butonul „Vedere (peisaj)”; categoria „Vedere” | titlul articolului Microsoft ro „Modificarea orientării paginii la vedere sau portret” (apare în `surse\wrap.txt` și `surse\tabel.txt`, cuprinsul „Pagini și aspecte”) |
| S03 | important | Fila paginii dată doar în engleză („Layout”) | „pe fila **Aspect** (în engleză, Layout)” | `surse\scurt.txt`: „Deschideți fila Aspect pentru a lucra cu marginile, orientarea, indentarea și spațierea paginii.” |
| S04 | important | „Antetul” însemna și rândul de antet al tabelului (N3, N4) și antetul paginii (N6). La N4, varianta „repeți antetul pe fiecare pagină” se putea citi ca antet de pagină | N4: „repeți rândul de antet…”, „Rândul de antet repetat…” (celelalte variante lungite ca forma să nu trădeze răspunsul); N6: „Nu le confunda cu rândul de antet al unui tabel.” | citit: același cuvânt, două obiecte diferite, în același joc |
| S05 | minor | Nivelul final spunea că specificația are „pagina, fontul, imaginea, tabelul”, dar nu avea niciun punct despre font | punct nou: „numele premiantului cu 28 pt, aldin, centrat” + item la classify „Numele premiantului scris cu 14 pt” → Nu respectă | citit: contradicție internă; acum acoperă și „dimensiune font” din programă |
| S06 | minor | „deschizi previzualizarea cu Ctrl+P” | „apeși Ctrl+P (imprimare) și te uiți în previzualizare” | `surse\scurt.txt`: Ctrl+P = „Imprimați documentul.” |

## Adăugate (acoperire + poartă)
- `gresit(Q, body)` pentru simulatorul `pagina`: pornește de la o foaie corectă și face greșeala tipică (uită rândul de antet/titlu la numărat; lasă foaia pe portret; margini egale la o lucrare de îndosariat; sigla „Pătrat”). Alege prima greșeală pe care verificarea chiar o respinge. `rezolva` folosește acum aceeași funcție `aplica`.
- Declarațiile `lectii` + `continuturi` pe fiecare nivel (constanta `PROG`, textul exact din curriculum.json). `lectii` din configurație: „3, 4, 7, 8, 9”.

## Semnalate, NEreparate (de decis de profesor)
- S07 (minor): la classify-ul din N2, „Fotografie lată cât pagina” și „Hartă mare, cu text deasupra și dedesubt” au cheia „Sus și jos”. În Word, o imagine „În linie cu textul”, singură pe paragraful ei, arată la fel. După modelul predat pe pagină, cheia e bună, dar un copil care a lucrat în Word poate alege altfel.
- S08 (minor): „Inserare (în unele versiuni, «Inserați»)”. Articolele Microsoft ro de azi scriu „Inserare”, iar protocolul notează „Inserați” ca verificat. Formularea prudentă acoperă ambele, așa că am lăsat-o.
- S09 (minor, neverificat): numele românești pentru „Merge Cells” și „Repeat Header Rows” nu sunt date în joc (formulare prudentă). Nu le-am găsit pe o sursă primară.
- S10 (minor): marginile „de obicei 2–2,5 cm” sunt o regulă practică. Valoarea implicită din Word depinde de șablon și nu am verificat-o.

## Verificat fără probleme
- Toate cheile (35 de întrebări): o singură variantă bună la fiecare; calculele ies (4×5=20; 21−3−2=16; 6×3,5=21; 4×5,5=22; 29,7−3−3=23,7).
- Simulatorul `pagina`, jucat ca un copil (`joaca_pagina.py`, rezultat în `joaca_pagina_rezultat_word-obiecte-vii.json`): 19 cazuri × 2 telefoane = 38/38 corecte. Respinge: antetul uitat la numărat, lipsa antetului, rândul gol, coloană pe elev, rândul îmbinat uitat, foaia portret, margini egale, stânga mai mică, 3,5 cm, sigla Pătrat, margini de 1 cm. Acceptă soluțiile bune la care ajungi pe alt drum (vedere 3/2,5; margini 3/3 la diplomă). După a doua greșeală apare „Arată-mi răspunsul”. Zero erori JS; lățimea paginii e 320 pe iPhone SE și 412 pe Pixel 7.
- Ctrl+O/N/S/W, Ctrl+Enter (sfârșit de pagină), F12 (caseta Salvare ca), „Inserare > Tabel”, filele de tabel „Proiectare tabel” / „Aspect tabel”: `surse\scurt.txt`, `surse\tabel.txt`.
