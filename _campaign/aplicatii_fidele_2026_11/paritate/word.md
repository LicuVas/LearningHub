# Paritate WORD — simulatoarele vechi (proba) față de biblioteca nouă

Commitul de pe proba: `0dcd4ffb`. Biblioteca: `aplicatii/word.js` (+ `aplicatii.js`, `panglica.js`, `date/word.json`). 12 pagini, 157 de exerciții.

**106 funcții**: **40 DA**, **25 PARȚIAL**, **41 NU**. Dintre ele, 71 sunt verificate de exerciții (26 NU și 17 PARȚIAL printre ele).

Pe scurt: biblioteca face bine editarea, selectarea, clipboardul, anularea, B / I / U, mărimea, alinierea, tabelul simplu și salvarea / deschiderea / închiderea. Lipsesc aproape tot ce predau lecțiile 6–9 dincolo de B / I / U și aliniere: fontul, culoarea, retragerile și spațierile, semnele ¶, stilul și opțiunile tabelului, mărimea și încadrarea pozei, marginile scrise, mărimea foii, previzualizarea, modurile de vizualizare, rigla, bara Acces rapid. Ferestrele Font, Paragraph și Page Setup se deschid, dar OK nu aplică nimic.

## NU — cerute de exerciții
- **word-F033** Schimbă fontul (lista Font sau numele scris în casetă) (Formatare text) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:154, 'wordteh' din lectii/vii/m2-l08/index.html:243, 'wordfmt' din lectii/vii/m2-l09/index.html:413
- **word-F036** Culoarea literelor (Font Color: butonul pune culoarea lui, ▾ culorile standard și Automatic) (Formatare text) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:146, 'wordfmt' din lectii/vii/m1-l06/index.html:271, 'wordfmt' din lectii/vii/m2-l09/index.html:413
- **word-F039** Mărește / micșorează retragerea din stânga (Increase / Decrease Indent, Ctrl+M / Ctrl+Shift+M), câte 1,25 cm (Formatare paragraf) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:234, 'wordfmt' din lectii/vii/m1-l06/index.html:296
- **word-F040** Tab la începutul unui paragraf cu text pune alineat (1,25 cm); ⌫ la început îl scoate (Formatare paragraf) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:234, 'wordfmt' din lectii/vii/m1-l06/index.html:296
- **word-F041** Fereastra Paragraph: retragerea din stânga / dreapta și Special (First line / Hanging, By) (Formatare paragraf) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:234, 'probafmt' din lectii/vii/m2-l10/index.html:375
- **word-F043** Spațierea dintre rânduri (Line and Paragraph Spacing ▾ 1.0 – 3.0, fereastra Paragraph, Ctrl+1 / 2 / 5) (Formatare paragraf) — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:234, 'wordfmt' din lectii/vii/m1-l06/index.html:244, 'wordfmt' din lectii/vii/m1-l06/index.html:271
- **word-F045** Arată / ascunde semnele ¶ și · (butonul ¶ Show/Hide) (Formatare paragraf) — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:191, 'wordui' din lectii/vii/m1-l02/index.html:198, 'wordui' din lectii/vii/m1-l02/index.html:244
- **word-F053** Alege stilul tabelului din galeria Table Design (Table Grid, Grid Table 4 - Accent 1…) (Tabel) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:178, 'wordpag' din lectii/vii/m1-l07/index.html:186, 'wordpag' din lectii/vii/m1-l07/index.html:290
- **word-F054** Bifele Table Style Options: Header Row, Banded Rows, First Column (și rândul de antet din jocuri) (Tabel) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:178, 'wordpag' din lectii/vii/m1-l07/index.html:253, 'probapag' din lectii/vii/m2-l10/index.html:364
- **word-F055** Lățimea unei coloane, trăgând de linia dintre coloane (Tabel) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:206, 'wordpag' din lectii/vii/m1-l07/index.html:214
- **word-F056** AutoFit: Contents / Window / Fixed Column Width (Tabel) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:206
- **word-F059** Îmbină celulele primului rând (Merge Cells) (Tabel) — cerută în: jocuri/word-antrenament-vii/index.html:112
- **word-F062** Mărește / micșorează poza trăgând de mânerul din colț (păstrează proporția) (Imagine) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:120, 'wordpag' din lectii/vii/m1-l07/index.html:128, 'wordpag' din lectii/vii/m2-l09/index.html:477
- **word-F064** Scrie înălțimea sau lățimea pozei în casetele Shape Height / Shape Width (cu blocarea proporției) (Imagine) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:120, 'wordpag' din lectii/vii/m2-l09/index.html:423
- **word-F065** Încadrarea pozei în text (Wrap Text: In Line, Square, Tight, Through, Top and Bottom, Behind Text, In Front of Text) (Imagine) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:151, 'wordpag' din lectii/vii/m1-l07/index.html:159, 'wordpag' din lectii/vii/m1-l07/index.html:285
- **word-F070** Margini scrise de mână: Custom Margins… / Page Setup › Margins (sus, jos, stânga, dreapta, orientarea; refuză marginile prea mari) (Pagină) — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:242, 'wordpag' din lectii/vii/m1-l07/index.html:272, 'wordhartie' din lectii/vii/m2-l09/index.html:352
- **word-F071** Mărimea foii din lista Size (Letter, Legal, A4, A5, B5, plicuri, A6…) (Pagină) — cerută în: 'wordhartie' din lectii/vii/m2-l09/index.html:380, 'wordhartie' din lectii/vii/m2-l09/index.html:490
- **word-F072** Mărime de foaie personalizată (More Paper Sizes… → Page Setup › Paper: Width, Height, Paper size, Custom size) (Pagină) — cerută în: 'wordhartie' din lectii/vii/m2-l09/index.html:380, 'wordhartie' din lectii/vii/m2-l09/index.html:388
- **word-F075** Document nou dintr-un șablon (Diplomă, Fluturaș, Referat școlar cu fotografie) (Fișiere) — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:135
- **word-F090** Pornește Word din meniul Start; pagina de început (Blank document, șabloane, Recent; Esc = document nou) (Fișiere) — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:135, 'wordfis' din lectii/vii/m1-l03/index.html:223
- **word-F092** Vizualizarea protejată (fișier venit de pe internet): nu poți scrie și nici salva; Enable Editing o oprește (Fișiere) — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:239, 'wordfis' din lectii/vii/m1-l03/index.html:260
- **word-F093** Read Mode: tastarea nu scrie; meniul View › Edit Document; Esc te întoarce în Print Layout (Vizualizare) — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:248
- **word-F094** Web Layout și Print Layout (fila View sau bara de stare) (Vizualizare) — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:248
- **word-F098** Arată / ascunde riglele (View › Ruler) (Vizualizare) — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:152
- **word-F099** Arată / ascunde bara Acces rapid (săgeata ⌄ Ribbon Display Options › Show / Hide Quick Access Toolbar) (Fereastra) — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:218, 'wordui' din lectii/vii/m1-l02/index.html:244, 'wordui' din lectii/vii/m1-l02/index.html:260
- **word-F100** Butoanele Undo și Redo / Repeat din bara Acces rapid (numele: Can't Repeat / Repeat Typing / Redo Typing) (Fereastra) — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:218

## PARȚIAL — cerute de exerciții
- **word-F006** Șterge textul selectat (Delete / ⌫) și potrivește spațiile ca Word (Smart cut) (Editare text) — lipsește: Biblioteca scoate doar spațiul dublu rămas între două cuvinte. Vechiul (138 de cazuri probate în Word) scoate și spațiul rămas înaintea punctuației („mere .” → „mere.”) și pe cel rămas la începutul paragrafului. — cerută în: 'wordobj' din lectii/vii/m1-l05/index.html:141, 'wordobj' din lectii/vii/m1-l05/index.html:165
- **word-F020** Lipește (Ctrl+V, Home › Paste, clic dreapta › Paste); peste o selecție o înlocuiește; păstrează formatarea copiată (Clipboard) — lipsește: Din meniul de clic dreapta biblioteca lipește doar prin „Keep Text Only” (fără formatare, word.js:1758); celelalte opțiuni de lipire dau mesajul central. Vechiul are în meniu „Paste” cu formatarea copiată. — cerută în: 'wordobj' din lectii/vii/m1-l05/index.html:190, 'wordobj' din lectii/vii/m1-l05/index.html:219
- **word-F021** La lipire Word potrivește singur spațiile la ambele capete (Smart paste) (Clipboard) — lipsește: Biblioteca pune doar spațiul dinaintea textului lipit. Vechiul mai pune spațiul de DUPĂ textul lipit lângă o literă, scoate spațiul de la începutul textului lipit la început de paragraf / după spațiu și pe cel de la capăt înaintea punctuației. — cerută în: 'wordobj' din lectii/vii/m1-l05/index.html:190, 'wordobj' din lectii/vii/m1-l05/index.html:219
- **word-F028** Aldin: pornește / oprește aldinul textului selectat (Formatare text) — lipsește: Pe o selecție amestecată vechiul hotărăște după PRIMUL caracter („vin” aldin + „eri” normal → tot normal; probat prin COM); biblioteca pune formatarea dacă nu e deja pe tot textul. — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:118, 'wordfmt' din lectii/vii/m1-l06/index.html:180, 'wordteh' din lectii/vii/m2-l08/index.html:212
- **word-F029** Cursiv: pornește / oprește cursivul textului selectat (Formatare text) — lipsește: Pe o selecție amestecată vechiul hotărăște după PRIMUL caracter („vin” aldin + „eri” normal → tot normal; probat prin COM); biblioteca pune formatarea dacă nu e deja pe tot textul. — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:126, 'wordfmt' din lectii/vii/m1-l06/index.html:271, 'wordfmt' din lectii/vii/m2-l09/index.html:457
- **word-F030** Subliniat: pornește / oprește sublinierea textului selectat (Formatare text) — lipsește: Pe o selecție amestecată vechiul hotărăște după PRIMUL caracter („vin” aldin + „eri” normal → tot normal; probat prin COM); biblioteca pune formatarea dacă nu e deja pe tot textul. — cerută în: 'wordfmt' din lectii/vii/m1-l06/index.html:126, 'wordfmt' din lectii/vii/m1-l06/index.html:172, 'wordfmt' din lectii/vii/m1-l06/index.html:252
- **word-F046** Pune un stil din galeria Styles pe paragraf (Normal, No Spacing, Heading 1, Heading 2, Title) (Stiluri) — lipsește: Stilul schimbă doar mărimea (word.js:16; Heading 1 = 16, Heading 2 = 13, vechi 20 / 16 cu Calibri Light și albastru #2F5496), nu fontul, culoarea și spațiile; nu scoate formatarea pusă de mână și alinierea (vechiul da, probat); pe o bucată selectată dintr-un paragraf (stil legat: Heading 1/2, Title) biblioteca schimbă tot paragraful. — cerută în: 'wordstil' din lectii/vii/m2-l08/index.html:252
- **word-F058** Adaugă sau scoate rânduri și coloane din tabel (Tabel) — lipsește: Nu se poate adăuga un rând / o coloană în alt loc și nu se poate șterge un rând / o coloană (Table Layout n-are comenzi). — cerută în: jocuri/word-antrenament-vii/index.html:112, jocuri/word-obiecte-vii/index.html:119
- **word-F060** Inserează o poză din calculator (Insert › Pictures › This Device…: folderele Imagini / Descărcări, alegi fișierul, Insert sau dublu-clic) (Imagine) — lipsește: Poza se desenează la începutul paragrafului, nu la cursor (word.js:858), e un dreptunghi fără desenul fișierului și nu rămâne selectată; în fereastră apar doar fișierele date în conținut (`fisiere`), nu un folder Imagini cu poze gata puse. — cerută în: 'wordobj' din lectii/vii/m1-l04/index.html:570, 'wordobj' din lectii/vii/m1-l04/index.html:580, 'probaobj' din lectii/vii/m2-l10/index.html:350
- **word-F068** Orientarea foii (Layout › Orientation: Portrait / Landscape); marginile se rotesc cu foaia (Pagină) — lipsește: Marginile nu se rotesc cu foaia (word.js:574-586 schimbă doar lățimea și înălțimea); vechiul: sus 2, jos 1,5, stânga 3, dreapta 1 → pe vedere sus 3, jos 1, stânga 1,5, dreapta 2 (probat). — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:234, 'wordpag' din lectii/vii/m1-l07/index.html:297, 'wordhartie' din lectii/vii/m2-l09/index.html:352
- **word-F069** Margini gata făcute: Normal, Narrow, Moderate, Wide, Mirrored (și ultima setare personalizată) (Pagină) — lipsește: Lipsesc Normal, Moderate, Wide, Mirrored și „Last Custom Setting”. — cerută în: 'wordpag' din lectii/vii/m1-l07/index.html:297
- **word-F080** Fișierul există deja: „The file … already exists” cu Replace existing file / alt nume / Cancel (la PDF: OK / Cancel) (Fișiere) — lipsește: Nu apare întrebarea lui Word (vine mesajul central „… already exists”), deci nici Replace (înlocuirea fișierului) nu se poate face. — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:166, 'wordfis' din lectii/vii/m1-l03/index.html:260, 'wordfis' din lectii/vii/m1-l03/index.html:296
- **word-F087** Treci de la un document deschis la altul (butoanele ferestrelor de pe bara de activități) (Fișiere) — lipsește: Nu există bara de activități / lista ferestrelor; documentele din spate (M.altele) nu se pot alege direct. — cerută în: 'wordfis' din lectii/vii/m1-l03/index.html:260
- **word-F102** Lansatorul ↘ din colțul unui grup deschide fereastra grupului (Fereastra) — lipsește: Doar lansatoarele cu fereastră în date (Font, Paragraph, Page Setup) deschid ceva; Clipboard, Styles și restul dau mesajul central. Vechiul (wordobj-interfata) deschidea fereastra oricărui grup (goală, cu titlul). — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:145
- **word-F103** Clic pe o parte a ferestrei (bara de titlu, panglica, rigla, pagina, bara de defilare, bara de stare) (Fereastra) — lipsește: Rigla lipsește (nu se poate da clic pe ea). — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:120
- **word-F104** Numărul de cuvinte din bara de stare („N words”; cu text selectat „X of N words”) (Fereastra) — lipsește: Cu text selectat nu arată „X of N words”. — cerută în: 'wordui' din lectii/vii/m1-l02/index.html:244
- **word-F105** Previzualizarea înainte de tipărire (Ctrl+P sau File › Print): paginile cum ies pe hârtie, fără ¶, „1 of 2”, ◀ ▶ între pagini, mărire (Tipărire) — lipsește: Previzualizarea nu arată documentul elevului și nici câte pagini are („ of 1” fix din date); Ctrl+P dă mesajul central (word.js:2016); ◀ ▶ nu schimbă pagina. — cerută în: 'wordteh' din lectii/vii/m2-l08/index.html:259, 'wordteh' din lectii/vii/m2-l08/index.html:279, 'wordteh' din lectii/vii/m2-l08/index.html:293

## NU — necerute de exerciții
- **word-F015** Ctrl+clic selectează propoziția (Selectare)
- **word-F023** Ctrl+tragere copiază textul selectat (originalul rămâne) (Clipboard)
- **word-F037** Ctrl+Space scoate formatarea caracterelor (Formatare text)
- **word-F042** Spațiul înainte / după paragraf (fereastra Paragraph › Spacing Before / After) (Formatare paragraf)
- **word-F044** Ctrl+Q scoate formatarea paragrafului (Formatare paragraf)
- **word-F052** Enter într-o celulă face un rând nou în celulă (celula devine mai înaltă) (Tabel)
- **word-F057** View Gridlines: arată liniile tabelului care n-au chenar (Tabel)
- **word-F063** Trage de mânerul de pe latură: se schimbă o singură dimensiune (Imagine)
- **word-F066** Enter cu poza selectată o coboară pe rândul următor (Imagine)
- **word-F067** Șterge poza selectată (⌫ sau Delete); ⌫ lângă poză NU o șterge (Imagine)
- **word-F073** Word refuză o măsură greșită sau marginile prea mari, cu mesajul lui („This is not a valid measurement.”, „The top/bottom margins are too large…”) (Pagină)
- **word-F079** Salvează ca .odt / .rtf (la .odt Word întreabă de format; lucrezi apoi în fișierul nou) (Fișiere)
- **word-F088** File › Close închide documentul (Fișiere)
- **word-F091** Deschide un document din File Explorer (dublu-clic pe .docx; un PDF nu se deschide în Word) (Fișiere)
- **word-F097** Zoom 100 % (butonul 100% / procentul) (Vizualizare)

## PARȚIAL — necerute de exerciții
- **word-F007** Tastarea peste o selecție o înlocuiește (după dublu-clic, spațiul de după cuvânt rămâne) (Editare text) — lipsește: Peste un cuvânt ales cu dublu-clic biblioteca șterge și spațiul de după el; vechiul (wordobj-interfata, probat de judecător) îl păstrează: „Plecăm joi la bunici.”.
- **word-F017** Ctrl+A selectează tot documentul (în celulă: textul celulei) (Selectare) — lipsește: Cu cursorul într-o celulă vechiul selectează textul celulei; biblioteca iese din celulă și selectează tot documentul (M.cel = null).
- **word-F026** Ctrl+Y fără nimic de refăcut repetă ultima acțiune (tastarea, ⌫, Delete, Enter, o comandă) (Anulare) — lipsește: Nu repetă ⌫, Delete și Enter: M.ultima se golește la orice operație care nu e tastare (word.js:214). Vechiul le repetă (probat în Word).
- **word-F027** Anularea pe operații ca în Word: ⌫ în mijlocul tastării o rupe în două; fiecare ⌫ / Delete e câte o operație (Anulare) — lipsește: Biblioteca grupează ⌫-urile (și Delete-urile) la rând într-o singură anulare; vechiul: 3 × ⌫ = 3 × Ctrl+Z (probat în Word 16).
- **word-F035** Grow Font / Shrink Font (A↑ / A↓) și Ctrl+Shift+> / Ctrl+Shift+< (Formatare text) — lipsește: Peste 72 nu mai crește (vechi: 80, 90…) și sub 8 nu mai scade (vechi: 7, 6… până la 1); Ctrl+Shift+> / < nu sunt prinse (aplicatii.js:300: gestul cu Ctrl+Shift cere o literă).
- **word-F061** Selectează poza cu un clic (chenar, 8 mânere, butonul Layout Options, fila Picture Format) (Imagine) — lipsește: Nu desenează chenarul, mânerele și butonul Layout Options; poza nu e „selectată” în model (Delete / Enter nu se aplică ei).
- **word-F089** File › Save (pe un document salvat salvează pe loc, pe unul nou duce la Save As) (Fișiere) — lipsește: Pe un document deja salvat nu salvează pe loc.
- **word-F096** Zoom trăgând glisorul din bara de stare (Vizualizare) — lipsește: Glisorul nu se trage (doar clic).

## Profilurile word365 / word2007
Funcțiile care merg doar în word365: Ctrl+O / Browse / fereastra Open, Ctrl+W și ✕ cu întrebarea de salvare, „Save this file” la Ctrl+S, potrivirea spațiilor la lipire. În word2007 Ctrl+Z anulează literă cu literă (ca în laborator). Detaliile: câmpul `nota` din word.json.

## Ce n-am apucat / ce e nesigur
- B / I / U pe o selecție amestecată: vechiul (după primul caracter, „probat prin COM”) și biblioteca (pune dacă nu e pe tot) se contrazic; de lămurit cu Word real, cu clicul pe buton, nu prin COM.
- Anularea ⌫-urilor: vechiul (fiecare ⌫ = o anulare, probat) față de bibliotecă (le grupează); de lămurit cu Word real.
- Pornirea lui Word din Start și deschiderea din File Explorer: n-am citit windows.js / explorer.js; poate le leagă de Word.
- Verdictele vin din citirea codului (word.js, aplicatii.js, date/word.json). Proba headless în poligon (probe_word/proba_poligon.py, 21.11) a confirmat 4 dintre ele: Bold merge (controlul), iar ¶ Show All, Font Color și Increase Indent dau doar mesajul central, fără efect în stare(). La celelalte NU-uri căutarea e scrisă la fiecare funcție.
- Exercițiile din jocuri (word-antrenament-vii, word-obiecte-vii) folosesc un simulator ABSTRACT de pagină (butoane, nu panglica Word); funcțiile lor sunt trecute la funcțiile Word corespunzătoare.
- Panglica veche (`panglica-word.json`, 3832 de rânduri) am citit-o doar prin `ui-panglica.js` (cum se leagă butoanele); butoanele „doar afișate” sunt trecute pe grupuri, nu unul câte unul.

GATA_PARITATE word total=106 da=40 partial=25 nu=41
