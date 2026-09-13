# 03 — Jurnalul sarcinii (U1, U11, U7)

## Constrângerile elevului pe care l-am jucat (U11)
Elev de a VII-a, 13 ani, prima oră de Word din an (15.09 la Izvoare / 18.09 la Brauner). Nu știe engleza de meniu („Show Below the Ribbon”, „Heading 1”), nu știe ce e „Quick Access Toolbar”, nu știe unde e „Desktop”-ul pe un PC de laborator cu cont comun. Citește încet (ritmul provizoriu al porții: 115 cuvinte/minut, 60 de caractere/minut tastate). Are 50 de minute din care ~8 se duc pe pornire. Nu vede rezolvările (sunt pliate) cât lucrează.

## Ce am făcut, pe rând
1. **Cele 11 întrebări** — H_vede a răspuns corect la toate, fiecare a deblocat pasul următor (`parcurgere.json`). Cheia din sursă = varianta apăsată în pagină la 11 din 11 (`u3_cheie_quiz.json`). 22 de clicuri doar ca să treci prin teorie.
2. **Exercițiul 1** — am scris documentul cu `python-docx`, A4: titlul „Fisa mea de observatie - Interfata Word” (exact cum îl dă lecția, **fără diacritice** — elevul care copiază textul lecției învață să scrie fără ș/ț) + 3 propoziții Bold/Italic/Underline. Salvat `produs_elev/Exercitiu1_Interfata.docx`, redeschis într-un proces nou (`07_redeschis.json`: 4 paragrafe, pagina 210×297 mm). **„Pe Desktop” nu se poate simula**: nu știu ce e Desktop-ul pe PC-urile din sala 1 TIC.
   - *Blocaj probabil (ipoteză AI):* elevul caută fila „Home” într-un Word în română, unde se numește „Pornire”.
3. **Exercițiul 2** — tot în program (bara de acces rapid, mutarea ei, Ctrl+F1). Am căutat fiecare comandă în documentația Microsoft ro-ro și en-us (`03_pasi.json` pașii 6-8). Toate există. Dar: (a) în română se cheamă „Adăugare la bara de instrumente Acces rapid” și „Afișare dedesubtul Panglicii”; (b) rezoluția pliată dă ca exemple de „click dreapta pe un buton din Ribbon” pe **Quick Print** și **Print Preview**, iar atomul 8 al aceleiași lecții spune că Quick Print **nu apare direct în Ribbon** — elevul care urmează indiciul caută un buton care nu e acolo; (c) în unele versiuni Microsoft 365 bara de acces rapid e ascunsă până o afișezi („Afișare bară de instrumente Acces rapid”) — pas care lipsește din lecție. Răspunsul scris în casetă: 237 de caractere (`Ex2_raspuns_caseta.txt`).
4. **Exercițiul 3** — `Tema_Word.docx` (5 propoziții, 50 de cuvinte) → PDF prin LibreOffice (`randat_docx/Tema_Word.pdf`, 1 pagină, aceleași 50 de cuvinte). Al doilea document: text copiat identic, două Heading 1 + un Heading 2, explicația Print Layout vs Outline. PDF-ul LibreOffice are exact aceleași 3 semne de carte pe nivelurile 1/2/1 → structura de titluri e reală, nu doar bold-ul mare.
   - *Blocaj probabil:* „adaugă două titluri și un subtitlu” nu spune **unde** — deasupra textului? între propoziții? Am ales eu; un elev de 13 ani ridică mâna.
   - *Blocaj probabil:* criteriul spune „Minimum 4 fisiere”, dar listează 3 fișiere + „notita” (care poate fi în casetă, nu fișier).
   - *Blocaj probabil:* „Fa un screenshot” — nicio indicație cum (Win+Shift+S? unde se salvează?).
   - Numele vederii „Outline” în română nu l-am găsit pe o pagină Microsoft ro-ro citită (`gasit: neclar`).
5. **Timpul** (`u12_sensibilitate.txt`): 78 de clicuri + 1.194 de caractere tastate doar în exerciții ≈ 40 de minute; citirea celor 4.655 de cuvinte ≈ 40 de minute; +8 pornire = **≈ 89 de minute**. Numai teoria + întrebările ≈ 45 de minute. Chiar la ritm dublu abia încape (48 min), fără nicio întrebare pusă profesorului.

## Unde se blochează un începător (rezumat)
Ora se blochează **înainte** de Word: elevul citește 11 pași de teorie despre o fereastră pe care nu o vede (0 imagini în lecție) și ajunge la exerciții când ora s-a terminat. În Word, blocajele sunt numele englezești, bara de acces rapid ascunsă și indiciul cu Quick Print.
