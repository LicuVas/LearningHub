# Reparații text în lecții (11.10.2026)

Script: `aplica.py` (același dosar), `str.replace` exact, fiecare text găsit o singură dată. Fără commit.
Lecții atinse: VII/3, V/8, VI/4, VI/6, VII/6, VII/9 (fiecare `index.html` + `afirmatii.json`).

## 1-2. VII/3 (`lectii/vii/m1-l03/index.html`), p2, Încearcă 2
- q: „Pornește-l din meniul Start (butonul ⊞ Start, jos, apoi Word) și fă…” → „Apasă ⊞ Start și alege Word (în Word-ul adevărat scrii „word” după Start și alegi Word din rezultate, fiindcă nu e mereu fixat în meniu). Apoi fă un document nou din șablonul Diplomă.”
- cum (Start): + „În Word-ul adevărat: Start, scrii „word”, alegi Word din rezultate.”
- cum (șablon): „dă clic pe șablonul Diplomă” → „alege șablonul Diplomă, nu Blank document. În Word-ul adevărat, un clic pe șablon îl arată doar mai mare: documentul vine cu dublu-clic pe șablon sau cu butonul Creare (Create).”
- ajutor: + „În Word-ul adevărat: dublu-clic pe dală sau, după un clic, butonul Creare (Create).”
- why: „Pe pagina de început ai ales șablonul: documentul nou vine gata aranjat.” + „În Word-ul adevărat, un clic pe șablon îl arată doar mai mare; documentul vine cu dublu-clic sau cu butonul Creare (Create).”
- Sursa: support.microsoft.com basic-tasks-in-word-87b3243c-…; training/create-a-document-in-word; find-your-office-apps-in-windows-76a91bce-…; can-t-find-office-applications-in-windows-10-907ce545-…
- afirmatii.json: A45, A46 noi („sursa: documentația Microsoft, neprobat în aplicație”).
- NU REPARAT: simulatorul (`lectii/_sim/wordfisier.js`, dala `data-wf` + `docNouGol`) face documentul la UN clic pe dală, iar meniul Start al simulatorului listează Word direct (nu are căutare cu scris). De reparat separat. Textul spune acum ce face Word-ul real.

## 3-5. V/8 (`lectii/v/m2-l08/index.html`)
- p4 text: „Pe Windows 11 e primul din grupul de butoane din mijlocul barei. Pe Windows 10 e în colțul din stânga jos.” → „Pe Windows 11 bara e de obicei centrată, iar Start e primul din grupul de butoane din mijlocul ei. Dacă bara e aliniată la stânga (ca pe Windows 10), Start e în colțul din stânga jos.”
- p4 ajutor Încearcă 1: „…la începutul grupului din mijloc. În meniu, caută Paint.” → „…la începutul grupului din mijloc (dacă bara e aliniată la stânga, în colțul din stânga jos). În meniu, caută Paint.”
- p5 text: „Închidere (X): închide fereastra și oprește aplicația.” → „Închidere (X): închide fereastra. Dacă era singura fereastră a aplicației (ca la Paint), se oprește și aplicația; dacă aplicația mai are alte ferestre, ea rămâne pornită.”
- p5 ajutor/why Încearcă 3: „Care buton închide fereastra și oprește aplicația?” → „Care buton închide fereastra?”; „X (Închidere) oprește aplicația.” → „X (Închidere) închide fereastra; fiind singura fereastră a aplicației, o oprește și pe ea.”
- ajutor (alt loc): „X închide și oprește aplicația.” → „X închide fereastra (și oprește aplicația, dacă era singura ei fereastră).”
- p6 text: + „Dacă aplicația are mai multe ferestre, clicul pe pictogramă le arată pe toate, iar tu alegi una. Fereastra aleasă vine deasupra: …”
- p6 aplicația adevărată, punctul 6: „sau pe pictograma lui din bara de activități. Nu pe foaia albă.” → „… (dacă aplicația are mai multe ferestre, clicul pe pictogramă le arată pe toate și alegi una). Nu pe foaia albă.”
- Surse: customize-the-taskbar-in-windows-0657a50f-…; learn.microsoft.com/en-us/windows/win32/uxguide/win-window-mgt și winenv-taskbar.
- afirmatii.json: A08 și A17 actualizate; A27, A28 noi.

## 6. VI/4 (`lectii/vi/m1-l04/index.html`)
- p5: „apeși butonul, dai un clic pe diapozitiv și tastezi.” → „apeși butonul, apoi dai un clic pe diapozitiv sau tragi cu mouse-ul (ca să desenezi caseta) și tastezi.”
- p5: „alegi forma, apoi dai un clic pe diapozitiv.” → „alegi forma, apoi dai un clic pe diapozitiv sau tragi cu mouse-ul.”
- aplicația adevărată, punctul 4: „un cerc (Oval) → un clic pe diapozitiv.” → „… → un clic pe diapozitiv sau tragi cu mouse-ul.”
- Sursa: support.microsoft.com/en-us/powerpoint/add-text-to-a-slide și /add-shapes. afirmatii.json: A18 actualizată (neprobat în aplicație). Exercițiile din simulator (un clic) neschimbate.

## 7. VI/6 (`lectii/vi/m1-l06/index.html`), p5
- „Reset Background (Resetare fundal) pune înapoi fundalul temei.” → „Reset Background (Resetare fundal) renunță la fundalul pe care l-ai ales, dacă n-ai apăsat încă Apply to All (Aplicare la toate).”
- Sursa: support.microsoft.com/en-us/powerpoint/use-eyedropper-to-match-colors-on-your-slide. afirmatii.json: A24 actualizată (neprobat).

## 8. VII/6 și VII/9
- VII/6 p6: „(merge și cu punct: 1.25 cm)” → „(aici, în fereastra Paragraf, merge și cu punct: 1.25 cm)”. afirmatii.json: A36 nou.
- VII/9, punctul 3: „Dacă Word nu primește virgula (0,5), scrie cu punct (0.5).” → „Scrie numerele cu virgulă (0,5): pe un calculator cu setări românești, cu punct (0.5) Word spune „This is not a valid measurement.”.”
- VII/9, punctul 4: „Într-o casetă a rămas ceva lângă număr: … deci scrii direct numărul.” → „Într-o casetă a rămas ceva lângă număr sau ai scris cu punct (0.5) în loc de virgulă (0,5): … deci scrii direct numărul, cu virgulă.”
- Sursa: learn.microsoft.com/en-us/office/vba/api/word.wdinternationalindex + proba A17/A28. afirmatii.json: A28 actualizată.

## Porți (ieșiri: `joc_*.txt`, `ver_*.txt`, `date_personale.txt` în acest dosar)
| Lecție | test_joc | verifica_lectie (ultima linie) |
|---|---|---|
| vii/m1-l03 | TRECUT | 0 |
| v/m2-l08 | TRECUT | 0 |
| vi/m1-l04 | TRECUT | 1 (T0: „imagini importate” fără definiție în 51_lectia.md; termen din programă, nu din textele de mai sus; nereparat) |
| vi/m1-l06 | TRECUT | 0 |
| vii/m1-l06 | TRECUT | 0 |
| vii/m2-l09 | TRECUT | 0 |
| learninghub_date_personale.py | | 0 |
