# Pentru cine reface lecțiile: ce spun lecțiile greșit sau pe jumătate (10.10.2026)

Locurile unde **lecția însăși** spune ceva FALS sau PARȚIAL adevărat, care ar încurca un elev în aplicația reală
(Windows 11 + Office 365, română sau engleză). Sunt luate din verificarea pe sursele oficiale
(`_verificare/afirmatii_surse.json`). Fișele „Cum fac…?” sunt deja reparate (`_verificare/reparatii_surse.json`);
lecțiile NU au fost atinse.

## De reparat în lecții (8)

1. **VII/3** (`lectii/vii/m1-l03/`), pasul **p2**, exercițiul „Încearcă” 2. **FALS.**
   - Lecția spune: „⊞ Start, Word, apoi pe pagina de început alege dala Diplomă” și „Pe pagina de început ai ales șablonul: documentul nou vine gata aranjat.”
   - Sursa oficială spune: un clic pe șablon deschide doar o previzualizare mare („For a closer look at any template, click it to open a large preview.”); documentul vine la dublu-clic („double-click a template image”) sau cu butonul Creare (Create) din previzualizare.
   - Adrese: https://support.microsoft.com/en-us/office/basic-tasks-in-word-87b3243c-b0bf-4a29-82aa-09a681999fdc · https://support.microsoft.com/en-us/word/training/create-a-document-in-word

2. **VII/3** (`lectii/vii/m1-l03/`), pasul **p2**, exercițiul „Încearcă” 2, cerința. **PARȚIAL.**
   - Lecția spune: „Pornește-l din meniul Start (butonul ⊞ Start, jos, apoi Word)”.
   - Sursa oficială spune: apeși Start și **scrii** numele aplicației, apoi o alegi din rezultate („Choose Start, and start typing the name of the application, like Word or Excel.”). Word nu e mereu fixat în meniul Start, deci elevul poate să nu-l vadă.
   - Adrese: https://support.microsoft.com/en-us/office/can-t-find-office-applications-in-windows-10-907ce545-6ae8-459b-8d9d-de6764a635d6 · https://support.microsoft.com/en-us/windows/find-your-office-apps-in-windows-76a91bce-ba92-b406-7213-0f4c4fe0d51c

3. **V/8** (`lectii/v/m2-l08/`), pasul **p4** (textul și ajutorul de la „Încearcă” 1). **PARȚIAL.**
   - Lecția spune: „Pe Windows 11 e primul din grupul de butoane din mijlocul barei.”
   - Sursa oficială spune: „By default, the taskbar is centered in Windows 11.” Bara se poate alinia la stânga, și atunci Start e în colțul din stânga jos, ca pe Windows 10.
   - Adresă: https://support.microsoft.com/en-us/windows/customize-the-taskbar-in-windows-0657a50f-0cc7-dbfd-ae6b-05020b195b07

4. **V/8** (`lectii/v/m2-l08/`), pasul **p5** (textul și „de ce” de la „Încearcă” 3). **PARȚIAL.**
   - Lecția spune: „Închidere (X): închide fereastra și oprește aplicația.” / „X (Închidere) oprește aplicația.”
   - Sursa oficială spune doar că X închide **fereastra** („Clicking Close has the effect of canceling or closing the window.”). Aplicația se oprește numai dacă avea o singură fereastră (Paint); una cu mai multe ferestre (două documente Word, două ferestre Edge) rămâne pornită, iar unele aplicații rămân în zona de notificare.
   - Adresă: https://learn.microsoft.com/en-us/windows/win32/uxguide/win-window-mgt

5. **V/8** (`lectii/v/m2-l08/`), pasul **p6** (textul și pasul în aplicația adevărată, punctul 6). **PARȚIAL.**
   - Lecția spune: „treci la altă fereastră: clic pe bara ei de titlu sau pe pictograma ei din bara de activități. Ea vine deasupra”.
   - Sursa oficială spune: când aplicația are mai multe ferestre (butoanele sunt combinate implicit), clicul pe pictogramă îți arată ferestrele ei („Select the button to see a list of the windows that are open”) și alegi una.
   - Adrese: https://support.microsoft.com/en-us/windows/customize-the-taskbar-in-windows-0657a50f-0cc7-dbfd-ae6b-05020b195b07 · https://learn.microsoft.com/en-us/windows/win32/uxguide/winenv-taskbar

6. **VI/4** (`lectii/vi/m1-l04/`), pasul **p5** (textul) și pasul în aplicația adevărată, punctul 4. **PARȚIAL.**
   - Lecția spune: „Casetă text (Text Box): apeși butonul, dai un clic pe diapozitiv și tastezi. Forme (Shapes): alegi forma, apoi dai un clic pe diapozitiv.”
   - Sursa oficială pentru Windows spune „click and drag”: „On the slide, click and drag to draw the text box” și „click and drag to draw the shape”. Varianta cu un singur clic e scrisă oficial doar pentru Mac și e NETESTATĂ și în lecție (`lectii/vi/m1-l04/afirmatii.json`, A18). De probat în PowerPoint; până atunci, lecția ar trebui să spună și „sau trage”.
   - Adrese: https://support.microsoft.com/en-us/powerpoint/add-text-to-a-slide · https://support.microsoft.com/en-us/powerpoint/add-shapes

7. **VI/6** (`lectii/vi/m1-l06/`), pasul **p5** (textul). **PARȚIAL.**
   - Lecția spune: „Reset Background (Resetare fundal) pune înapoi fundalul temei.”, chiar după ce predă Apply to All (Aplicare la toate).
   - Sursa oficială spune doar că Reset Background renunță la fundalul schimbat („If you've changed your mind and don't want to apply the color, at the bottom of the Format Background pane, select Reset Background.”), nu că readuce fundalul temei. După Apply to All, fundalul nou e pus pe toate diapozitivele, iar Reset Background probabil nu mai readuce fundalul temei (de probat). E NETESTAT și în lecție (`lectii/vi/m1-l06/afirmatii.json`, A24). Lecția ar trebui să spună „dacă n-ai apăsat Apply to All”.
   - Adresă: https://support.microsoft.com/en-us/powerpoint/use-eyedropper-to-match-colors-on-your-slide

8. **VII/6 față de VII/9: punctul la zecimale în Word.** **PARȚIAL (neconcordanță între lecții).**
   - **VII/6** (`lectii/vii/m1-l06/`), pasul **p6**: „la By scrii 1,25 cm (merge și cu punct: 1.25 cm)”. E adevărat, dar **doar în fereastra Paragraf (Paragraph)**: probat, „1,25 cm” și „1.25 cm” dau amândouă 1,25 cm (`lectii/vii/m1-l06/afirmatii.json`, A20).
   - **VII/9** (`lectii/vii/m2-l09/`), pasul în aplicația adevărată, punctul 3: „Dacă Word nu primește virgula (0,5), scrie cu punct (0.5).” și punctul 4: „Apare „This is not a valid measurement.”? Într-o casetă a rămas ceva lângă număr”. Probat: la margini (Page Setup), pe un Windows cu setări românești, „0.5” cu punct dă chiar „This is not a valid measurement.” (`lectii/vii/m2-l09/afirmatii.json`, A28; virgula merge, A17).
   - Cum încurcă: elevul care a învățat în VII/6 că „merge și cu punct” scrie 0.5 la margini, primește mesajul și, după VII/9, caută degeaba „ceva rămas lângă număr”. VII/6 ar trebui să spună „aici, în fereastra Paragraf”, iar VII/9 că mesajul vine **și** de la punct pe setări românești.
   - Sursa oficială: separatorul zecimal vine din setările regionale ale calculatorului („wdDecimalSeparator: Returns the decimal separator (. in U.S. English).”), https://learn.microsoft.com/en-us/office/vba/api/word.wdinternationalindex

## De probat în aplicație (fără sursă oficială, dar îndoielnic)

- **VIII/12** (`lectii/viii/m2-l12/`), pasul în aplicația adevărată, punctul 8: „Nu trage și peste rândul 6, cel gol: … la radial, cercul iese gol.” După sursa oficială, o celulă goală apare în grafic ca **gol** („empty cells or null values are displayed as gaps”), adică o felie lipsă, nu un cerc gol. Adresă: https://support.microsoft.com/en-us/office/display-empty-cells-null-n-a-values-and-hidden-worksheet-data-in-a-chart-a1ee6f0c-192f-4248-abeb-9ca49cb92274
