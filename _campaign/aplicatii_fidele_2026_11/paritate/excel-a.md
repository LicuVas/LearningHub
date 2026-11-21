# Paritate Excel, partea A (foaia, tipurile de date, editarea, interfața, formulele și funcțiile, formatarea, foile)

Vechiul = simulatoarele din lecțiile publicate pe proba (commitul 0dcd4ffb, `proba_src/`); noul = biblioteca `aplicatii/excel.js`.
Inventarul l-am făcut pe patru bucăți, apoi le-am unit: baza (excelx.js, excelx-interfata.js, tip-foaie.js, panglica, simulatoarele din pagini), formatarea (excelx-formatare.js), foile (registru-foi.js), formulele (excelx-formule.js, excelx-functii.js). Probele headless (poligonul, rețeaua blocată în afara 127.0.0.1) sunt în `probe_excel-a/`.

## Numerele

- **233 funcții**: **113 DA**, **39 PARȚIAL**, **81 NU**.
- Cerute de un exercițiu: 84 (DA 49, PARȚIAL 17, NU 18).
- Toate cele 31 de funcții de foaie de calcul din motorul vechi (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTBLANK, COUNTIF, SUMIF, AVERAGEIF, ROUND, ROUNDUP, ROUNDDOWN, INT, ABS, SQRT, POWER, MOD, LEN, UPPER, LOWER, TRIM, LEFT, RIGHT, MID, CONCATENATE, CONCAT, AND, OR, NOT, IF) dau în bibliotecă ACELAȘI rezultat pe aceleași date, inclusiv #DIV/0!, #NUM!, #VALUE!, #NAME? (61 de formule; singura diferență: ghilimelele „ ” — vechiul dă #NAME?, biblioteca nu primește formula; `probe_excel-a/proba_functii.json`).

## Cerute de exerciții și lipsă (NU) — 18

- `excel-a-F008` scrie o dată cu luna în cuvinte (12 octombrie 2026, oct 2026) și Excel o recunoaște drept dată — exercițiu: lectii/viii/m1-l05/index.html:233 (C2 data 12.10.2026: întrebarea dă data în cuvinte)  
  _aplicatii/excel.js:116-126; proba: „12 octombrie 2026” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F018` Golire totală (Clear All) golește conținutul și scoate forma celulei — exercițiu: lectii/viii/m1-l05/index.html:176 (repar-o cu Golire totală; soluția o cere)  
  _aplicatii/excel.js:2964-2999 apasa(): ClearMenu nu e în switch → I.nesimulat; proba: „Clear … nu e simulată” (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F032` șterge rânduri întregi (clic dreapta pe numărul rândului › Delete; rândurile de dedesubt urcă) — exercițiu: lectii/viii/m1-l04/index.html:587 (Bogdan scos din tabel)  
  _aplicatii/excel.js:3590-3620 'Delete' din meniul antetului cade pe I.nesimulat; proba: „Delete … nu e simulată”, A3 rămâne Bogdan (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F033` șterge coloane întregi (clic dreapta pe litera coloanei › Delete; coloanele din dreapta vin la stânga) — exercițiu: lectii/viii/m1-l04/index.html:591 (coloana Absențe)  
  _aplicatii/excel.js:3590-3620 același drum, I.nesimulat_
- `excel-a-F034` fereastra Ștergere (Delete…): Deplasare celule în sus (Shift cells up) — exercițiu: lectii/viii/m1-l04/index.html:594 (capcana: C3 cu Shift cells up)  
  _aplicatii/excel.js:3620 deschide dialog.CellsDelete, dar OK → implicitDialog() :2907-2908 I.nesimulat; proba: B2/B3 neschimbate (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F119` Aliniază conținutul pe verticală: sus / la mijloc / jos (implicit jos) — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:156-158 (va middle pe A1; rândul 1 por…  
  _căutat AlignTopExcel / AlignMiddleExcel / AlignBottomExcel / vertical: lipsesc; proba: „Middle Align … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › align_middle)_
- `excel-a-F125` Alege formatul numărului din lista Number Format (General, Number 0,00, Currency lei, Accounting, Short Date, Long Date… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:236-238 (format data lungă pe B1 + făr…  
  _căutat NumberFormatGallery / format_numar: apasa() nu-l are; afisat() știe doar General, 0, 0.00…, 0%, dd.mm.yyyy, dd.mmm (aplicatii/excel.js:56-68); proba: „Number Format … nu e simulată”…_
- `excel-a-F129` Adaugă o zecimală afișată (Increase Decimal), după zecimalele pe care le arată celula activă: 7,5 → 7,50 — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:227-229 (zecimale 2 pe B2:B4)  
  _căutat DecimalsIncrease / zecimale: lipsesc; proba: „Increase Decimal … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › dec_inc)_
- `excel-a-F131` Pune un stil de celulă din galeria Cell Styles (Good, Bad, Neutral, Calculation, Check Cell, Input, Output, Note…, Head… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:208-210 (stilul Title pe A1)  
  _căutat CellStylesGallery / stil: lipsesc; proba: „Cell Styles … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › cellstyles)_
- `excel-a-F135` Face un rând mai înalt / mai scund trăgând de linia de sub numărul rândului (pe telefon: cercul ⇕); cu mai multe rândur… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:130-132 (rândul 1 cel puțin 25 de punc…  
  _căutat antet_rand_margine / inaltime: biblioteca nu are margine de tras la rânduri (proba: 0 ținte antet_rand_margine, 26 antet_coloana_margine) și nici înălțime de rând pusă de mână (INALT…_
- `excel-a-F185` Prima salvare cu un nume care există deja în folder: „The file X.xlsx already exists…” [OK] [Anulare]; Anulare redeschi… — exercițiu: lectii/viii/m1-l03/index.html:113 (teste colegi: lectia3.xlsx al colegului neatins)  
  _aplicatii/excel.js:2742-2753 nu caută niciun fișier existent; biblioteca nu ține fișiere în foldere (grep „exist”, „replace” în excel.js: nimic pentru salvare)_
- `excel-a-F188` Save As cu numele unui fișier care există: „Confirm Save As … Do you want to replace it?” [Yes] [No] — exercițiu: lectii/viii/m1-l03/index.html:150 (teste colegi: lectia3.xlsx al colegului neatins)  
  _biblioteca nu ține fișiere în foldere; grep „Confirm Save As” în excel.js și date/excel.json: nimic_
- `excel-a-F190` Salvare ca CSV: mesajul „does not support workbooks that contain multiple sheets…” [OK] [Cancel]; se salvează doar foai… — exercițiu: lectii/viii/m1-l03/index.html:161 (întrebare cu variante după salvarea CSV)  
  _Save as type ▾ = mesajul central (aplicatii/excel.js:3574); grep „csv” în excel.js: nimic_
- `excel-a-F191` Salvare ca PDF: se face PDF-ul foii active, iar registrul deschis rămâne cel de dinainte — exercițiu: lectii/viii/m1-l03/index.html:288 (teste salvat ext pdf, model sah)  
  _grep „pdf” în excel.js: nimic; tipul fișierului nu se poate alege_
- `excel-a-F197` Deschide un registru salvat (Ctrl+O / Ctrl+F12 / Fișier › Open): fereastra Open cu folderele și lista fișierelor; regis… — exercițiu: lectii/viii/m1-l03/index.html:176 (teste redeschis + deschisDin)  
  _Ctrl+O → pagina Fișier › Open (aplicatii/excel.js:3734, aplicatii/excel.js:3848) cu rânduri „[element de listă, nesalvat]”; Browse pe pagina Open → mesajul central (aplicatii/excel.js:3554…_
- `excel-a-F201` Tastele pe care le ia browserul (Ctrl+N, Ctrl+W, Ctrl+PageUp, Ctrl+PageDown, F12) se apasă din butoane de sub titlu — exercițiu: lectii/viii/m1-l03/index.html:230 („Apasă de șase ori Ctrl+PageDown (butonul de sub titlu…  
  _grep „Ctrl+PageDown”, taste în aplicatii.js / excel.js / panglica.js: nu există butoane pentru taste; aplicatii/excel.js:2456 notează că în Chrome Ctrl+W nu ajunge la pagină_
- `excel-a-F231` testele numite ale atelierului se bifează pe loc doar când formula cu adrese dă rezultatul bun și pe datele schimbate (… — exercițiu: lectii/viii/m1-l07/index.html:224-237 (atelier „bugetul excursiei”, teste cu formule)  
  _Grep „evalueaza”, „calculeaza”, „valoare(” public, „varianta” în aplicatii/excel.js și api_biblioteca.md §5: biblioteca nu dă un calcul al formulei pe alte date (valoare() e internă, :342);…_
- `excel-a-F232` sub testul nebifat apare MOTIVUL (apostrof la început, lipsește =, două semne =, capcanele temei, „fă întâi D4”, număr… — exercițiu: lectii/viii/m1-l07/index.html:230 (motive:true, capcane :235)  
  _Grep „motiv”, „capcan” în aplicatii/excel.js: doar motivFormula (:1594), care spune de ce nu e primită o formulă, nu de ce un test nu trece_

## Cerute de exerciții, făcute doar pe jumătate (PARȚIAL) — 17

- `excel-a-F007` scrie o dată întreagă (27.09.2026, 27/09/2026, 27-09-2026, 2026-09-27) și Excel o recunoaște drept dată — exercițiu: lectii/viii/m1-l05/index.html:129 (B4 data 05.10.2026)  
  _(1) doar forma cu puncte: 27/09/2026, 27-09-2026, 2026-09-27 și data cu oră rămân text; (2) data cu puncte apare ######## în coloana de 64 px (coloana nu se lățește la dată; vezi FMT042) —…_
- `excel-a-F010` scrie un cod cu zerouri în față cu apostrof ('007) și rămâne text „007”, cu triunghiul verde (Number Stored as Text) — exercițiu: lectii/viii/m1-l05/index.html:193 (B2 text 007)  
  _triunghiul verde din colț și sfatul „Number Stored as Text” lipsesc (căutat: triunghi, 1E8C45, Stored as Text, .ap în desen)_
- `excel-a-F015` forma de dată pusă automat rămâne în celulă: 7,5 scris peste 07.mai arată 07.ian — exercițiu: lectii/viii/m1-l05/index.html:176 (B2 numar 9.5, inainte: 9.5 apoi 9,5 → 09.ian)  
  _ziua greșită cu 1 sub 01.03.1900: biblioteca numără zilele de la 30.12.1899 fără 29.02.1900 (excel.js:40-41), deci 7,5 → 06.ian în loc de 07.ian, 8,5 → 07.ian în loc de 08.ian_
- `excel-a-F016` Delete golește doar conținutul: forma de dată rămâne (8.5, Delete, 8,5 → 08.ian) — exercițiu: lectii/viii/m1-l05/index.html:237 (B2 numar 8.5, capcana Delete)  
  _aceeași zi greșită cu 1 (arată 07.ian în loc de 08.ian)_
- `excel-a-F027` lipește din meniu (Paste) sau din Pornire: planșeta lipește, „Paste ▾” deschide lista; Paste e gri cât nu e nimic copiat — exercițiu: lectii/viii/m1-l04/index.html:531 (doarMouse)  
  _Paste ▾ (PasteMenu_Dropdown) și Copy ▾ dau „nu e simulată” (proba probe_excel-a/proba_forma_stergere.json); Paste nu se face gri când nu e nimic copiat (excel.js:1382-1387 nu-l atinge)_
- `excel-a-F110` Pune culoare de umplere cu butonul Fill Color (galben la început, apoi ultima culoare aleasă din paletă) — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:204-206 (fill pe A1:C1)  
  _butonul pune mereu galben: nu ține minte ultima culoare aleasă (paleta nu există în bibliotecă)_
- `excel-a-F121` Îmbină și centrează zona (Merge & Center): cu mai multe valori apare avertismentul real „Merging cells only keeps the u… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:172-174 (imbinat A1:D1 centrat)  
  _fără avertismentul cu OK / Cancel (exercițiul de la :181 întreabă exact de el); dacă stânga-sus e goală, conținutul altei celule nu se mută acolo (se șterge); pe o singură celulă nu centrea…_
- `excel-a-F133` Lățește / îngustează o coloană trăgând de linia din dreapta literei (pe telefon: atingi litera, apoi tragi de cercul ⇔)… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:118-121 (fără #### pe C2:C4, valorile…  
  _se schimbă doar coloana trasă, nu toate coloanele selectate (aplicatii/excel.js:3434: o singură coloană); fără cercul ⇔ pentru deget; bula cu lățimea: neverificată_
- `excel-a-F134` Potrivește singură lățimea coloanei după cel mai lung conținut, cu dublu-clic pe linia din dreapta literei (pe telefon:… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:125-128 (numele din A2:A4 se văd între…  
  _se potrivește doar coloana pe care dai dublu-clic, nu toate coloanele selectate; coloana goală nu revine la lățimea standard (fara_efect)_
- `excel-a-F144` Excel lățește singur o coloană nelățită de mână când scrii o dată sau un număr care nu încape, ori când alegi un format… — exercițiu: tipul t:'excelx' din lectii/viii/m1-l06/index.html:236-238 (Long Date pe B1 și fără ####…  
  _datele tastate și formatele alese nu lățesc coloana_
- `excel-a-F149` Adaugă o foaie nouă cu butonul +: apare imediat după foaia activă și devine activă — exercițiu: lectii/viii/m1-l03/index.html:206 (teste foi Septembrie, Octombrie)  
  _Numele foii noi: vechiul (probat în Excel) folosește un contor care crește în sesiune (după Sheet3 ștearsă vine Sheet4); biblioteca ia numărul foilor + 1, sărind doar numele luate (aplicati…_
- `excel-a-F183` Prima salvare (Ctrl+S pe un registru nesalvat): fereastra „Save this file” cu File name și Choose a Location (Desktop,… — exercițiu: lectii/viii/m1-l03/index.html:103 (teste salvat Documente, model lectia3)  
  _Choose a Location ▾ dă mesajul central (aplicatii/excel.js:3573): locul nu se alege și nu e în stare; nu există fișiere în foldere, deci un test „salvat în Documente” nu are pe ce se spriji…_
- `excel-a-F187` Salvare ca (F12): fereastra Save As cu folderele, lista fișierelor din folder, File name și Save as type — exercițiu: lectii/viii/m1-l03/index.html:139 (teste salvat model robotica)  
  _Lista fișierelor din folder are doar rânduri „[element de listă, nesalvat]”; Desktop și Descărcări lipsesc din arbore; Save as type nu se poate schimba (în poligon clicul dă doar „camp”, ap…_
- `excel-a-F189` După Salvare ca lucrezi în copie (titlul arată numele nou), iar fișierul original rămâne neschimbat — exercițiu: lectii/viii/m1-l03/index.html:139 (teste deschisDin + neschimbat Robotica_8A.xlsx)  
  _Originalul nu există ca fișier separat, deci „a rămas neschimbat” nu se poate verifica._
- `excel-a-F194` Închide un registru modificat: „Save your changes to this file?” [Save] [Don't Save] [Cancel]; Save salvează și închide… — exercițiu: lectii/viii/m1-l03/index.html:176 (teste salvat Robotica_8A cu Noiembrie)  
  _Ce se salvează nu ajunge într-un fișier care poate fi redeschis; testele „fișierul are foaia Noiembrie” / „Note_8A.xlsx are doar foaia Note” nu au pe ce se sprijini._
- `excel-a-F230` exercițiul verifică funcția FOLOSITĂ: rezultatul bun cu altă funcție (sau scris de mână) nu trece („aici se cere funcți… — exercițiu: lectii/viii/m2-l08/index.html:113, :119, :141, :147, :150, :189, :195, :200, :236, :238-2…  
  _verificatorul însuși (și mesajul „rezultatul e bun, dar se cere funcția X”) nu e în bibliotecă; trebuie pus în stratul lecției/motorului_
- `excel-a-F233` exercițiul știe dacă elevul a folosit butonul Σ (gest autosum) sau mânerul de umplere (umple) și le poate cere — exercițiu: lectii/viii/m2-l08/index.html:189, :195, :200, :265 (gest:['autosum'])  
  _legarea acțiunii de test (ținerea minte „a folosit Σ”) e în lecție; în bibliotecă doar evenimentul_

## Necerute de exerciții, lipsă (NU) — 63

- `excel-a-F003` scrie lună.an (6.75) și Excel face din el data iun.75  
  _aplicatii/excel.js:116-126 constanta() are doar zi.lună și zi.lună.an; proba: „6.75” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F004` scrie un număr cu punct de mii (1.250) și Excel îl ia drept 1250, cu separator de mii  
  _aplicatii/excel.js:116-126 fără regulă de mii; proba: „1.250” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F005` scrie o sumă cu „lei” (12 lei) și Excel o ține ca număr cu formatul lei (negativ cu roșu)  
  _aplicatii/excel.js:116-126; proba: „12 lei” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F006` scrie un procent (10%) și Excel îl ține ca 0,1 cu formatul procent  
  _aplicatii/excel.js:116-126 fără %; proba: „10%” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F009` scrie o oră (12:30, 12:30:15) și Excel o ține ca oră  
  _aplicatii/excel.js:116-126 fără ore; proba: „12:30” rămâne text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F013` alte forme de număr recunoscute de Excel: 1,5E3 (științific), 1 1/2 (fracție), (5) = −5, € 5  
  _aplicatii/excel.js:116-126; proba: toate rămân text (probe_excel-a/proba_tipuri.json)_
- `excel-a-F021` pe telefon: butonul „' apostrof drept” pune apostroful drept la începutul barei de formule  
  _căutat în excel.js / aplicatii.js: apostrof, xt-apos, buton sub foaie — nimic_
- `excel-a-F022` Ctrl+Z / Ctrl+Y ajung la foaie oriunde ar fi focusul (după un clic pe butoanele lecției)  
  _aplicatii.js:400-470 ascultă tastele doar în rădăcina aplicației; căutat: document.addEventListener('keydown')_
- `excel-a-F031` Shift+clic pe alt număr de rând / altă literă extinde selecția la mai multe rânduri / coloane  
  _aplicatii/excel.js:3441-3442 s.zone = [q] fără e.shiftKey; proba parte_formatare: A apoi Shift+C dă C:C_
- `excel-a-F035` fereastra Ștergere (Delete…): Deplasare celule la stânga, Rând întreg, Coloană întreagă  
  _aplicatii/excel.js:2907-2908 OK → I.nesimulat_
- `excel-a-F036` butonul Delete din Pornire (pictograma) scoate imediat celulele: rânduri / coloane întregi sau deplasare în sus / la st…  
  _aplicatii/excel.js:2999 CellsDeleteSmart nu e în apasa() → I.nesimulat; proba: „Delete Cells... nu e simulată” (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F038` Golire (Clear ▾) din Pornire › Golire conținut (Clear Contents)  
  _aplicatii/excel.js:2999 ClearMenu → I.nesimulat (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F039` lipirea pe o zonă care e un multiplu al celei copiate repetă copia (A1:A2 copiat pe K1:K4 → de două ori)  
  _aplicatii/excel.js:2099-2119 lipeste() lipește o dată, de la celula activă; proba: N6:N9 → doar N6:N7 (probe_excel-a/proba_tipuri.json)_
- `excel-a-F040` lipirea pe o zonă de altă mărime: Excel nu lipește și spune că zonele nu au aceeași mărime și formă  
  _aplicatii/excel.js:2099-2119 lipește oricum de la celula activă, fără mesaj; proba (probe_excel-a/proba_tipuri.json)_
- `excel-a-F041` Enter după copiere lipește în celula activă și oprește copierea  
  _aplicatii/excel.js:3810 Enter doar mută celula; proba: L6 goală (probe_excel-a/proba_tipuri.json)_
- `excel-a-F044` pe telefon: tragerea cu degetul peste celule selectează o zonă  
  _aplicatii/excel.js:3395-3406 atingerea pe grilă e amânată (ancora = null), deci mișcarea nu extinde; :3527 atingerea scurtă alege celula_
- `excel-a-F046` Ctrl+- șterge: rânduri / coloane întregi direct, altfel fereastra Delete  
  _aplicatii/excel.js:3716-3870 I.la.tasta fără Ctrl+-; proba: nici fereastră, nici schimbare (probe_excel-a/proba_tipuri.json)_
- `excel-a-F047` Shift+Spațiu selectează tot rândul celulei active  
  _aplicatii/excel.js:3716-3870 fără Shift+Spațiu; proba: selecția rămâne B8 (probe_excel-a/proba_tipuri.json)_
- `excel-a-F048` Ctrl+Spațiu selectează toată coloana celulei active  
  _aplicatii/excel.js:3716-3870 fără Ctrl+Spațiu; proba: selecția rămâne B8 (probe_excel-a/proba_tipuri.json)_
- `excel-a-F049` tasta Meniu sau Shift+F10 deschide meniul de clic dreapta al celulei  
  _aplicatii/excel.js:3716-3870; proba: niciun meniu (probe_excel-a/proba_tipuri.json)_
- `excel-a-F054` fiecare foaie își ține zoom-ul ei (Excursie 120 %, Note 100 %)  
  _aplicatii/excel.js:3700 M.zoom e unul pe registru; proba: foaia nouă are tot 120 % (probe_excel-a/proba_forma_stergere.json)_
- `excel-a-F060` pe telefon: tastele Tab, Enter, săgețile și Esc sunt butoane sub foaie (merg și în caseta de nume)  
  _căutat în excel.js / aplicatii.js: taste pe ecran, Tab ⇥ — nimic (doar tastatura telefonului, fără Tab)_
- `excel-a-F106` Alege mărimea fontului din lista Font Size (8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72); rândul creșt…  
  _căutat FontSize / 'Font Size' / fs în aplicatii/excel.js: niciun caz în apasa() (aplicatii/excel.js:2964-2999); proba: „Font Size … aici nu e simulată” (probe_excel-a/formatare/rezultat_pro…_
- `excel-a-F107` Mărește / micșorează fontul cu un pas (A▲ Increase Font Size, A▼ Decrease Font Size)  
  _căutat FontSizeIncrease / FontSizeDecrease: lipsesc din apasa(); proba: mesajul „nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › fontsize_inc)_
- `excel-a-F108` Colorează textul cu butonul Font Color (roșu la început, apoi ultima culoare aleasă)  
  _căutat FontColorPicker / color / culoare_font: lipsesc din apasa() și din starea celulei (aplicatii/excel.js:617-625); proba: „Font Color RGB(255, 0, 0) … nu e simulată” (probe_excel-a/form…_
- `excel-a-F109` Alege culoarea textului din paleta Font Color ▾ (Automatic, culorile temei cu nuanțele lor, Standard Colors)  
  _proba: săgeata dă „Font Color … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › fontcolor_sageata)_
- `excel-a-F111` Alege culoarea de umplere din paleta Fill Color ▾ (culorile temei cu 5 nuanțe, Standard Colors) sau scoate umplerea (No…  
  _proba: săgeata dă „Fill Color … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › fill_sageata); lista.CellFillColorPicker din date/excel.json e folosită doar pentru Tab Color (…_
- `excel-a-F122` Îmbină pe fiecare rând separat (Merge Across)  
  _căutat MergeAcross / Merge Across: lipsește; proba: clicul pe marginea dreaptă a butonului îmbină tot (probe_excel-a/formatare/rezultat_proba.json › merge_sageata)_
- `excel-a-F123` Îmbină celulele fără să centreze (Merge Cells)  
  _căutat MergeCells / Merge Cells: lipsește_
- `excel-a-F126` Pune formatul contabil (Accounting Number Format: lei, minusul la stânga, liniuță la zero)  
  _căutat InternationalCurrency / Accounting: lipsesc; proba: „Accounting Number Format … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › accounting)_
- `excel-a-F128` Pune stilul virgulă (Comma Style: separator de mii, două zecimale)  
  _căutat CommaStyle: lipsește; proba: „Comma Style … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › comma)_
- `excel-a-F130` Scoate o zecimală afișată (Decrease Decimal): 7,5 → 8, valoarea din spate rămâne 7,5  
  _căutat DecimalsDecrease: lipsește; proba: „Decrease Decimal … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › dec_dec)_
- `excel-a-F132` Golește doar formatele zonei (Clear › Clear Formats): valorile rămân, bordurile și îmbinările dispar; Clear All desface…  
  _căutat ClearFormats / ClearMenu / Clear All: lipsesc; proba: „Clear … nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › clear_menu); meniul de clic dreapta are doar Clear Conten…_
- `excel-a-F136` Potrivește singură înălțimea rândului cu dublu-clic pe linia de sub numărul lui  
  _I.la.dublu tratează doar antet_coloana_margine (aplicatii/excel.js:3660-3673)_
- `excel-a-F138` Scrie înălțimea rândului într-o fereastră (Row Height…), din Format sau din clic dreapta pe numărul rândului  
  _fereastra se deschide din clic dreapta (aplicatii/excel.js:3622), dar OK dă „Row Height … nu e simulată” și înălțimea nu se schimbă (probe_excel-a/formatare/rezultat_proba.json › row_height…_
- `excel-a-F139` Potrivește lățimea coloanelor după celulele SELECTATE (Format › AutoFit Column Width)  
  _butonul Format (FormatCellsMenu) dă „nu e simulată” (probe_excel-a/formatare/rezultat_proba.json › format_menu); nu există listă pentru el în date/excel.json_
- `excel-a-F140` Readuce înălțimea automată a rândurilor selectate (Format › AutoFit Row Height)  
  _ca mai sus: meniul Format lipsește_
- `excel-a-F141` Schimbă lățimea standard a tuturor coloanelor nelățite de mână (Format › Default Width…)  
  _căutat Default Width / StandardWidth: lipsește; meniul Format lipsește_
- `excel-a-F146` Clic pe litera unei coloane care atinge o îmbinare selectează toată lățimea îmbinării (A1:D1 îmbinat → clic pe C select…  
  _aplicatii/excel.js:3440-3446: clicul pe antet alege doar coloana / rândul lui, fără să țină cont de îmbinări_
- `excel-a-F151` Pune o foaie nouă ÎNAINTEA foii active cu Shift+F11  
  _grep „F11” în aplicatii/excel.js și aplicatii.js: nimic; în poligon Shift+F11 dă „fara_efect” (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F152` Pune o foaie nouă înaintea celei active din meniul filei: Inserare... › Worksheet › OK  
  _meniul filei are rândul Insert... (date/excel.json › meniu_contextual.fila_foii), dar clicul dă mesajul central „nesimulat” (în poligon: actiune nesimulat @ meniu:Insert...; aplicatii/excel…_
- `excel-a-F158` Nume gol sau nepermis → mesajul „You typed an invalid name for a sheet or chart…”  
  _aplicatii/excel.js:2511-2512: numele „nebun” e ignorat fără niciun mesaj (în poligon: nume gol → fila rămâne, dialog null) (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F159` „History” ca nume de foaie → mesajul „History is a reserved name.”  
  _nicio verificare pentru History în aplicatii/excel.js:2504-2519; în poligon foaia s-a numit „History” (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F161` Ctrl+Z desface redenumirea foii  
  _aplicatii/excel.js:2512 schimbă numele fără schimba() (nu intră în istoric); în poligon Ctrl+Z a desfăcut pasul de DINAINTE (a dispărut și foaia Sheet4 adăugată înainte) (proba: P/probe_exc…_
- `excel-a-F169` Ascunde o foaie (Hide)  
  _în poligon meniu:Hide → „nesimulat”; grep Hide/ascun în excel.js: niciun efect (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F170` Reafișează o foaie ascunsă: Unhide... › alegi foaia › OK  
  _grep „Unhide” în aplicatii/excel.js: nimic (rândul e doar în date/excel.json)_
- `excel-a-F175` Ctrl+Z desface mutarea sau copierea unei foi  
  _aplicatii/excel.js:2278, aplicatii/excel.js:2284 → dupaFoi() aplicatii/excel.js:2231 golește istoricul; în poligon Ctrl+Z după tragere = fara_efect (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F176` Aduce la vedere filele care nu încap: săgețile ‹ › (și derularea singură când tragi fila lângă margine)  
  _săgețile Scroll Left/Right sunt mereu gri: aplicatii/excel.js:1416 aria-disabled true, aplicatii/excel.js:3628 „indisponibil”_
- `excel-a-F177` Meniul filei de la tastatură (tasta Meniu sau Shift+F10) și alegerea filei cu Enter / Spațiu  
  _grep „ContextMenu”, „F10” în aplicatii/excel.js și aplicatii.js: nimic_
- `excel-a-F196` Butonul ✕ din bara de titlu închide registrul (cu aceeași întrebare la modificări)  
  _în poligon bara_titlu:Close → „nesimulat” (proba: P/probe_excel-a/foi/proba_foi*.py)_
- `excel-a-F198` În fereastra Open, „Files of type” filtrează lista (All Excel Files / Text Files / All Files)  
  _nu există fereastra Open în excel.js / date/excel.json › dialoguri_
- `excel-a-F199` Un PDF deschis în Excel arată semne fără sens („%PDF-1.7” în A1)  
  _nu există deschidere de fișiere_
- `excel-a-F203` scrie =A2 x B2 (cu spații) și vede #NAME?, ca în Excel (formula e primită)  
  _probat: biblioteca NU primește formula (rămâne în editare, mesajul general „Excel nu primește formula așa cum e scrisă…”, aplicatii/excel.js:1564, :1630); jetoanele ref, nume, ref → eroarea…_
- `excel-a-F204` scrie =A2 B2 (semnul uitat) și vede #NULL!, cu mesajul „ai uitat semnul dintre A2 și B2”  
  _probat: formula refuzată cu mesajul general (aplicatii/excel.js:1564, :1630); Grep „#NULL”, „NULL!” în aplicatii/excel.js: 0 rezultate_
- `excel-a-F208` scrie =20:4 și vede #SPILL!, cu explicația că Excel ia 20:4 drept rânduri  
  _probat: formula refuzată, mesaj general (rezultat.json › nou.doua_puncte_numere); aplicatii/excel.js:160 — „:” nu e operator în jetoane (zonaDin :25 știe 4:20 doar ca zonă de rânduri, nu și…_
- `excel-a-F209` scrie × sau ÷ în formulă (=A2×B2) și Excel le face * și / (rezultatul se calculează)  
  _probat: =A2×B2 și =A2÷B2 dau #NAME? și formula rămâne cu × / ÷ (rezultat.json › nou.semnul_inmultit, semnul_impartit); Grep „×”, „÷” în aplicatii/excel.js: doar în comentarii_
- `excel-a-F210` scrie o formulă care începe cu + sau - fără = (+A2*B2) și Excel o face formulă (=+A2*B2)  
  _probat: C2 rămâne textul „+A2*B2” (rezultat.json › nou.plus_in_fata); aplicatii/excel.js:1558-1563 — doar textul care începe cu = e formulă, restul trece prin constanta (:116)_
- `excel-a-F212` un text pe care Excel îl ia drept număr („150 lei”, „12 octombrie 2026”) intră în calcul ca număr: =A2*2 dă 300  
  _probat: C2 = #VALUE! (rezultat.json › nou.text_lei); aplicatii/excel.js:116-127 (constanta) nu recunoaște „lei” și nici luna scrisă în litere, deci valoarea rămâne text și :469 dă #VALUE!_
- `excel-a-F213` celula cu cod de eroare (#VALUE!, #DIV/0!, #NAME?…) primește triunghiul verde din colț, cu sfatul „Eroare în formulă”  
  _Grep „triunghi”, „verde”, „Errors”, „indicator” în aplicatii/excel.js: doar triunghiul ferestrelor de avertizare (:337) și colțul Select All (:816); celula de eroare e doar centrată (:1188)_
- `excel-a-F215` Σ sare peste celulele goale de imediat deasupra (B8 sub B7 goală → =SUM(B2:B7)) și, când deasupra sunt doar formule iar…  
  _probat: B8 sub B7 goală → =SUM() (rezultat.json › nou.sigma_B7_goala_B8); aplicatii/excel.js:1822 cere număr chiar deasupra (nr(a.r - 1)), fără salt peste goale și fără regula „doar formule…_
- `excel-a-F216` Σ (Sumă) sub un total făcut cu SUM propune doar totalul (=SUM(B7)) și urcă doar până sub ultimul SUM (B9 sub =MAX și =S…  
  _probat: B8 sub =SUM(B2:B6) → =SUM(B2:B7) = 80 (rezultat.json › nou.sigma_sub_total_SUM); aplicatii/excel.js:1820, :1822 ia orice rezultat număr (și totalul); Grep „SUM(” ca regulă de subtot…_
- `excel-a-F225` =SUM B2:B6 (fără paranteză): la Enter/Tab apare fereastra „We found a typo in your formula…” cu Yes (corectura =SUM(B2:…  
  _probat: formula refuzată cu mesajul general (rezultat.json › nou.sum_fara_paranteza); aplicatii/excel.js:1600-1604 deschide fereastra typo doar pentru o referință lipită de „)” (=SUM(B2:B7)…_
- `excel-a-F227` o formulă care își cuprinde propria celulă (=SUM(B2:B7) în B7): fereastra referinței circulare (OK), apoi celula arată 0  
  _probat: B7 = 40, fără fereastră (rezultat.json › nou.circulara); aplicatii/excel.js:348-349 — ciclul dă 0 doar pentru celula însăși în sumă; Grep „circular” în aplicatii/excel.js și date/ex…_

## Necerute de exerciții, PARȚIAL — 22

- `excel-a-F037` lista Delete ▾ din Pornire: Delete Cells…, Delete Sheet Rows, Delete Sheet Columns  
  _Delete Sheet Rows / Delete Sheet Columns → I.nesimulat; Delete Cells… deschide fereastra, dar OK nu face nimic_
- `excel-a-F042` Esc sau golirea (Delete) opresc copierea (dispare marginea punctată)  
  _Delete (golesteContinut, :1777) nu oprește copierea_
- `excel-a-F056` clicul pe celula ACTIVĂ nu rupe șirul Tab–Enter (drumul de pe telefon); clicul pe altă celulă îl rupe  
  _în modul Gata (Ready) orice clic pe celulă, și pe cea activă, pune M.tabCol = null (:3425): pe telefon (atingi celula, apoi bara) Enter nu mai întoarce la coloana de pornire_
- `excel-a-F071` ghilimelele „ ” într-o formulă: Excel nu le recunoaște (#NAME?), doar pe cele drepte "…"  
  _vechiul dă #NAME? în celulă, cu sfatul despre ghilimelele drepte; biblioteca nu primește formula, fără mesaj despre ghilimele_
- `excel-a-F112` Butonul Borders pune ultima bordură folosită (la început Bottom Border) pe zona selectată  
  _pune mereu Bottom Border; nu ține minte ultima bordură aleasă din listă_
- `excel-a-F124` Desface îmbinarea (Unmerge Cells)  
  _lipsește lista ▾ cu Unmerge Cells; desfacerea merge doar prin al doilea clic pe Merge & Center_
- `excel-a-F137` Scrie lățimea coloanei într-o fereastră (Column Width…), din Pornire › Celule › Format sau din clic dreapta pe litera c…  
  _drumul prin Pornire › Celule › Format nu există (proba: „Format … nu e simulată”, probe_excel-a/formatare/rezultat_proba.json › format_menu); merge doar din clic dreapta_
- `excel-a-F145` Bara de formule arată valoarea din spatele formatului: 7,125 sub 7,13, 12,5% sub 13%, data ca 27.09.2026  
  _sub un procent arată 0,125 în loc de 12,5% (textEditare nu știe de procent)_
- `excel-a-F157` Caracterele : \ / ? * [ ] nu se scriu deloc în numele foii (Ore/2 → Ore2); cel mult 31 de caractere  
  _Semnele se scriu în casetă, iar la Enter toată redenumirea e refuzată pe tăcute (în poligon „Ore/2” lasă fila Sheet1); vechiul nu le lasă să apară și redenumește în Ore2._
- `excel-a-F160` Apostroful de la începutul numelui dispare ('Note → Note); cel de la sfârșit dă mesajul „invalid name”  
  _'Note e refuzat pe tăcute (fila rămâne Sheet1) în loc să devină Note; apostroful final nu dă mesajul._
- `excel-a-F178` Pe telefon: apăsarea lungă pe filă deschide meniul filei  
  _Vechiul are temporizatorul lui de 550 ms pentru atingere; biblioteca se bazează doar pe evenimentul contextmenu al browserului (pe iPhone / Safari nu vine) [neprobat pe telefon]._
- `excel-a-F186` Numele fișierului cu semne interzise (\ / : * ? " < > |) → mesaj sub casetă, fereastra rămâne deschisă  
  _Lipsește mesajul; „AMF1/IF” devine „AMF1IF” fără să afle elevul (comportamentul vechi de dinainte de 01.10.2026)._
- `excel-a-F192` „More options…” / „More locations” din fereastra „Save this file” duc la Salvare ca  
  _„More locations” din Choose a Location ▾ dă mesajul central (aplicatii/excel.js:3573)._
- `excel-a-F200` Meniul Fișier (File) cu Nou, Deschidere, Salvare, Salvare ca, Închidere  
  _Open nu deschide niciun fișier (vezi rândul despre Deschidere)._
- `excel-a-F205` scrie =5x3 și Excel nu o primește; foaia spune că înmulțirea se scrie cu * și ce corectură ar propune Excel (=5*3)  
  _explicația (x → *) și corectura propusă de Excel (=5*3); biblioteca spune doar „Excel nu primește formula așa cum e scrisă… fereastra nu e simulată”_
- `excel-a-F206` scrie o zecimală cu punct într-o formulă (=A2*0.5) și află că pe setări românești se scrie cu virgulă (Excel ar propune…  
  _explicația virgulei zecimale și avertismentul despre corectura greșită propusă de Excel (=A2*05)_
- `excel-a-F207` scrie =A2:B2 (două puncte în loc de /) și vede ce face Excel cu o zonă, cu explicația că „:” nu împarte  
  _explicația „semnul : nu împarte, se scrie /”; rezultatul diferă de vechi (vechiul arată #VALUE!, ca Excel 2016/2019; biblioteca face ca Excel 365)_
- `excel-a-F218` Σ pe o zonă selectată scrie direct rezultatele (fără Enter) sub fiecare coloană (sau în dreapta unui rând, sau în ultim…  
  _selecția nu se extinde peste rezultate (rămâne B2:D3, vechiul/Excel: B2:D4); zona B2:B7 cu B7 goală scrie în B8 =SUM(B2:B7) (vechiul/Excel: B7 =SUM(B2:B6)); zona pe un singur rând B2:D2 scr…_
- `excel-a-F223` Tab în timp ce scrii începutul unei funcții (=SU, =MA, =MI, =AV) completează PRIMA funcție din lista Excel-ului: SUBSTI…  
  _=MA + Tab dă MAX( (vechiul și Excel: MATCH(), fiindcă biblioteca alege doar dintre funcțiile pe care le calculează; lista vizibilă de sub celulă nu există (comentariul de la aplicatii/excel…_
- `excel-a-F224` o funcție care există în Excel dar nu e simulată (MATCH, SUBTOTAL, SUMIFS, SUMPRODUCT, AVERAGEA, MAXA, MINIFS, SEARCH…)…  
  _MATCH, SUBTOTAL, SUMIFS, SUMPRODUCT, SUMSQ, SUMX2MY2, SUMX2PY2, SUMXMY2, AVERAGEA, AVERAGEIFS, MAXA, MAXIFS, MINA, MINIFS, MINUTE, MINVERSE, MIRR, MIDB, SEARCH, ACCRINT dau #NAME? fără expl…_
- `excel-a-F226` =SUM (B2:B6) (spațiu înaintea parantezei): fereastra „We found a typo…”; Yes = =SUM(B2:B6), No = #NAME?  
  _fereastra typo (Yes/No) și ramura No → #NAME?; biblioteca face direct ce ar face Yes_
- `excel-a-F228` zona scrisă invers (=SUM(B6:B2)) devine B2:B6 după Enter  
  _textul formulei nu se întoarce la B2:B6 (bara de formule și stare().formula arată B6:B2)_

## Ce n-am apucat / ce e nesigur

- `jocuri/_motor/tip-excel.js` (foaia de bază: tastarea, selecția cu mouse-ul, Ctrl+C/V, umplerea, butoanele legate ale panglicii) e la excel-b; aici am trecut doar ce adaugă fișierele mele peste ea. `motor.js` nu l-am citit (verificarea exercițiilor am luat-o din câmpurile `verifica` ale paginilor).
- `panglica-excel.json` l-am citit doar ca rezumat (7 file, 200 de butoane); ce buton face ceva hotărăște tip-excel.js (excel-b).
- Exercițiile din m2-l08…m2-l13 le-am legat de funcții doar prin căutarea formulelor (SUM, AVERAGE, MIN, MAX, IF); detaliile lor sunt în partea de formule și la excel-b.
- Neprobate pe dispozitiv real: tastele moarte (apostroful), tragerea și atingerea lungă pe telefon.
- Tasta moartă (US-International) pentru apostrof: biblioteca o primește probabil prin caseta ascunsă, dar n-am probat cu o tastatură reală.
- Data cu puncte (27.09.2026) apare ######## în coloana de 64 px: n-am verificat dacă Excel real lățește coloana la dată (vechiul arăta data întreagă).
- Tragerea și atingerea lungă pe telefon le-am judecat doar din cod (atingerea pe grilă e amânată), fără un telefon real.
- Ghilimelele „ ” în formulă: vechiul dă #NAME?, iar biblioteca nu primește formula; nu știu ce face Excel real.
- Testele numite ale atelierului (m1-l04:600/617, m4-l23:172) sunt ale lecției, nu ale aplicației: lecția nouă le poate face din stare(); le-am trecut la doar_afisate.
- Bula „Width: … (… pixels)” la tragerea coloanei: în bibliotecă n-am verificat dacă apare (M.trageInfo, aplicatii/excel.js:3463).
- Butonul Merge & Center din bibliotecă: clicul pe marginea lui dreaptă îmbină (n-am găsit o parte ▾ separată); poate partea ▾ lipsește din panglica desenată.
- Pentru coordonatorul excel-a (excelx.js): în bibliotecă Shift+clic pe litera altei coloane NU extinde selecția (proba 2: A apoi Shift+C → selecția C:C).
- Funcțiile „Format › …” le-am trecut NU pe drumul din meniul Format; rezultatul (lățimea) se poate obține uneori pe alt drum (clic dreapta, dublu-clic) — exercițiile verifică doar rezultatul.
- excel-a-FOI031 (apăsarea lungă pe telefon): neprobat pe un telefon real; verdictul PARTIAL vine din cod (doar evenimentul contextmenu).
- excel-a-FOI002: numărătoarea foilor noi după Ctrl+Z în Excel real nu e probată nici în vechi (vechiul descrie doar ștergerea).
- Testele vechi pe fișiere (salvat în folder, colegi neatinși, redeschis, neschimbat) presupun un sistem de fișiere în simulator; biblioteca Excel nu are unul — poate există în explorer.js / windows.js (necercetat aici).
- Aspectul filei colorate (activă = dungă, neactivă = plină) și mesajele „Pe românește” de sub mesajele englezești nu sunt funcții; nu le-am trecut.
- Vechiul a fost probat prin JocFoaie.evaluate învelit (vechi.html încarcă motor.js, tip-foaie.js, tip-excel.js, excelx.js, excelx-formule.js, excelx-functii.js), nu prin foaia desenată; conversia × ÷ și +A2*B2 → =+A2*B2…
- Referința circulară în vechi: proba mea a dat „Maximum call stack” (getter-ul meu de probă nu oprește ciclul); comportamentul vechi (fereastra + 0) e luat din cod, excelx-functii.js:283, :298-304.
- Σ pe zonă în vechi (FRM017) e luat din cod (directPeZona, excelx-functii.js:186-202), nejucat în pagină; biblioteca e jucată în poligon.
- FRM006 (=A2:B2): vechiul dă #VALUE! ca Excel 2016/2019, biblioteca varsă ca Excel 365 — care e corect pentru laborator e o decizie, nu o lipsă sigură.
- Umplerea cu formule (referințe relative / absolute, $, #REF!) și F4 sunt în tip-excel.js / tip-foaie.js (shift), nu în excelx-formule/funcții: nu le-am trecut aici (excel-b / excel-a principal). În bibliotecă există: F4…
- Funcțiile de foaie de calcul una câte una (SUM, AVERAGE, MIN, MAX, COUNT…, cu #DIV/0!, #NAME?, #VALUE!, #NUM!) sunt în tip-foaie.js și le face excel-a principal; excelx-functii.js nu le schimbă calculul (doar FRM023 pen…

GATA_PARITATE excel-a total=233 da=113 partial=39 nu=81
