# Surse — lecția VIII / M2 / nr. 11: „Grafice: tipuri de grafice și serii de date”

## Ancora în programă și în documentele profesorului
- **Plan:** `Info_Gimnaziu_2026/planificari/Calendar_ore_8A_8M.md` (27.11.2026, săpt. 11, M2, predare) și `Calendar_ore_VIII.md` (Izvoare, 24.11.2026); `data/unitati.json` (VIII-U1 „Calcul tabelar”, lecția 11, materiale: teorie, exerciții); `lectii/plan.json` (cheia `lectie_viii_m2_l11`). Titlul paginii e exact cel din plan.
- **Programa (OMEN 3393/2017):** CS.1.1, CS.3.1; conținuturile copiate exact din `AI_0/data/informatica_gimnaziu/curriculum.json`: „Grafice: tipuri de grafice”, „Serii de date”. Activitatea de învățare din CS.3.1: „alegerea unor tipuri de grafice adecvate în funcție de auditoriu și de tematică” → P4, atelierul, Î1.
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, lecția 11): „Aceleași date reprezentate cu trei tipuri de grafic; elevii aleg tipul potrivit și argumentează. Se corectează un grafic înșelător pregătit de profesor.” → P4 (tipurile, schimbarea tipului pe aceleași date), atelierul (alegi tipul), capcana anilor (un grafic greșit care se corectează) și legenda capturii `ani-corect.webp` (axa care nu pornește de la 0). Graficul înșelător al profesorului rămâne activitatea lui de la clasă: pagina nu-l copiază.
- **Izvoare (Calendar_ore_VIII.md):** ora 12 (mini-proiectul) se comasează acolo cu ora 11 („conținutul trece la ora anterioară + temă acasă”). Pagina NU dă mini-proiectul (granița din brief); de știut pentru lecția 12.
- **Granițe:** lecția 10 (sortarea, alt autor, în paralel) — nu predau și nu folosesc sortarea; lecțiile 8-9 (funcții, IF) — nu le repet, tabelele mele au doar valori; lecția 12 (mini-proiectul) — nu îl dau. Nu predau: stiluri/teme de diagramă, axe secundare, diagrame combinate, tabele pivot, minidiagrame (în simulator sunt cenușii, cu „nu le folosim azi”).
- **Cuvintele:** programa zice „grafic”, Excel în română „diagramă” (Microsoft ro-ro: „Diagrame recomandate”, „Titlu diagramă”, „Proiectare diagramă”). Spus o dată, la P1: „În Excel graficul se numește diagramă (în engleză, chart). Noi îi spunem grafic… pe butoane vei citi Diagramă sau Chart.” Apoi peste tot „grafic” în text și numele exacte pe butoane.

## Ce presupun lecțiile publicate 1-9 și ce folosesc din ele (bifat = folosit)
| Lecția | Ce a predat | Folosit aici |
|---|---|---|
| 1 Organizare, evaluare inițială | criteriile, nivelurile | [ ] |
| 2 Interfața, structura registrului | aplicație de calcul tabelar, registru, foaie | [x] |
| | panglica: file și grupuri; fila Inserare (Insert) cu grupul Charts (captura `panglica-insert.webp`) | [x] P3, P4 |
| | celula, adresa, celula activă, bara de formule | [x] (bara de formule: titlul în simulator, laboratorul) |
| | caseta de nume, filele foilor, bara de stare, zoom | [ ] |
| 3 Operații cu registrul și foile | deschiderea unui registru | [x] laborator |
| | Salvare ca (F12) cu numele tău; Confirm Save As → No + cifră (regula 26) | [x] laborator 10 |
| | foi noi, redenumire, mutare, copiere | [ ] |
| 4 Adresa, selectare, copiere, mutare, ștergere | zona trasă, Shift+clic, zona A1:B6, tragerea cu degetul | [x] P2 |
| | Delete golește celula | [x] P5 (golești A1), atelierul 2, Î4 |
| | Ctrl+Z | [ ] în text (în simulator merge și pe grafic) |
| | copierea, mutarea | [ ] |
| 5 Tipuri de date | numărul la dreapta, textul la stânga | [x] P5 (anii-numere vs anii-text) |
| | apostroful face din număr text (cu AltGr pe tastatura RO) | [x] P5 Uite cum, ajutorul Î4 |
| | data calendaristică, virgula zecimală, „7.5” devine dată | [ ] |
| 6 Formatare | lățime, înălțime, aliniere, stiluri predefinite | [ ] |
| 7 Formule cu operatori | „Schimbi un număr, rezultatul se schimbă singur” (recalcularea) | [x] „Ai nevoie de”; P6: graficul legat de tabel |
| | formule, operatori, #NAME? | [ ] |
| 8 Funcții SUM/MAX/MIN/AVERAGE | funcțiile, argumentul, mânerul de umplere | [ ] (granița) |
| 9 IF, situația-problemă | condiția, IF, testul la limită | [ ] (granița) |
Contradicții cu lecțiile publicate: n-am găsit. Lecția 2 numește fila „Inserare (Insert)” și arată grupul Charts (fără nume românesc); aici „Diagrame (Charts)”, ca jocul `excel-viii` (nivelul 8) și ca Microsoft ro-ro („În fila Inserare, în grupul Diagrame”, `_proba/_ms/04.txt`).

## Fapte probate în Excel-ul REAL (Microsoft 365, build 20326, interfața în engleză, setări regionale românești: `,` zecimală, `;` între părți)
Instanță NOUĂ (`EXCEL.EXE /x` pe un desktop ascuns, `hidden_desktop.py`), obiectul COM luat din fereastra ACELEI instanțe (verificat pe PID), fără salvare, `Saved=True` + `Close(False)` + `Quit`, apoi `taskkill /PID` DOAR pe PID-ul meu (notat în fiecare JSON: 18292, 7648, 14872, 17208, 14332, 5644). Panglica apăsată prin UI Automation (`_proba/uia_grafic.py`, proces separat), titlul și valorile tastate literă cu literă (WM_CHAR + Enter), graficele citite prin COM, capturi PrintWindow. Registrul de laborator: o COPIE deschisă `ReadOnly`, `AddToMru=False`, ștearsă la final. Nicio setare a Excel-ului schimbată.

| Fișier | Ce arată |
|---|---|
| `_proba/proba_grafic_orientare.json` | seriile/categoriile pe 9 tabele; anii-numere, A1 gol, anii cu apostrof (tastați); selecții fără antet / fără nume / o celulă / rând gol; titlul și legenda implicite la coloane, bare, linie, radial, pe o serie și pe două |
| `_proba/proba_grafic_panglica_elemente_schimbare_comutare_tip_capturi.json` | inserarea DIN PANGLICĂ (UIA) la toate cele 4 tipuri = AddChart2; fila Chart Design după inserare; titlul tastat; etichetele; valoarea schimbată; Switch Row/Column apăsat de 2 ori; schimbarea tipului; capturile |
| `_proba/proba_grafic_orientare2_meniu_laborator.json` | regula dimensiunilor (pe partea de DATE: 4×3 fără coloană de nume → rânduri); anii în antet cu A1 gol; comutarea pe o singură serie; radialul fără antet; titlul tău la schimbarea tipului pe două serii; legenda/titlul repornite; celula goală departe de date |
| `_proba/proba_grafic_meniu_laborator.json`, `proba_grafic_laborator.json` | meniul Add Chart Element (fotografiat: `cap/meniu_*.png`); pașii din laborator pe copia `biblioteca_lectia11.xlsx` (inserare UIA, titlu, etichete, C5 = 30, tip, comutare ×2, înapoi la Line) |
| `_proba/proba_grafic_final.json` | graficul făcut cu anii-numere NU se repară când golești A1 după; refăcut, da; linia (martie-iulie) și punctul din mai care urcă la 21 |

Ce s-a aflat (toate în `afirmatii.json`, cu rezultatul citit din JSON de `_proba/gen_afirmatii.py`):
- O singură coloană de valori: titlul = antetul (și urmează antetul dacă îl schimbi), fără legendă. Mai multe serii: „Chart Title”, legenda jos. Radial: titlul = numele primei serii, legenda jos (categoriile); radialul desenează doar prima serie.
- Seriile: partea de DATE (fără antet și fără coloana de nume) cu mai multe rânduri decât coloane → coloanele sunt serii; altfel (și la egalitate) rândurile. Microsoft ro-ro spune același lucru („Excel plasează numărul cel mai mare pe axa orizontală… număr egal… rândurile”, `_proba/_ms/01.txt`).
- Etichetele: prima coloană e de nume dacă e toată text; primul rând e antet dacă e tot text; dacă celula din colț e GOALĂ, amândouă sunt etichete. De aici capcana anilor: anii-numere sub „Anul” devin o serie (coloane de 2000, jos 1, 2, 3, 4); comutarea NU repară; A1 gol sau anii cu apostrof repară, dar doar la un grafic făcut DIN NOU.
- Titlul ales și tastat înlocuiește tot titlul și rămâne la schimbarea antetului, a tipului și la comutare. Titlul debifat și repornit revine „Chart Title”; legenda repornită (HasLegend) vine în dreapta.
- Schimbi o valoare → coloana/punctul și eticheta se schimbă singure; ștergi o valoare → dispare.
- Bara pune primul nume JOS. Linia (Line) nu are marcaje; etichetele ei stau în dreapta punctelor. Pentru valori apropiate (120-140), axa pornește de la 110.
- După inserarea din panglică graficul e ales și se deschide fila Chart Design (captura `panglica_coloana.png`).

## Nume românești (doar din Microsoft ro-ro; Office de pe acest calculator are numai engleza)
Paginile descărcate o dată, cu User-Agent-ul sitului (regula 22): `_proba/ms_ro.py` → `_proba/_ms/` (index.json + textul), citatele în `_proba/_ms/citate.json`.
| Engleză (probat în Excel) | Română | Sursa (citat) | Stare |
|---|---|---|---|
| Insert | Inserare | calibrare `meniuri_ro_en.json` | CONFIRMAT |
| Charts (grupul) | Diagrame | „În fila Inserare, în grupul Diagrame” (_ms/04) | CONFIRMAT (o pagină) |
| Recommended Charts | Diagrame recomandate | „Selectați Inserați > diagrame recomandate”; „Caracteristica Diagrame recomandate” (_ms/00, 07) | CONFIRMAT |
| Clustered Column | Coloană grupată | „Tipuri de diagrame coloană Coloană grupată” (_ms/00, 07) | CONFIRMAT |
| Insert Column or Bar Chart | (butonul) „Inserați o diagramă coloană sau cu bare” | _ms/12 (traducere automată evidentă) | NESIGUR → în lecție doar engleza + descrierea pictogramei |
| Insert Line or Area Chart, Insert Pie or Doughnut Chart, Clustered Bar, Line, Pie | — | negăsite ca etichete exacte („Inserare diagramă cu structură radială sau Diagramă inelară”, _ms/08, pare tradusă automat) | NESIGUR → engleza + „(bare grupate)”, „(linie)”, „(radială)” ca explicații |
| Chart Design (fila) | Proiectare diagramă | „Faceți clic pe fila Proiectare diagramă” (_ms/00, 04) | CONFIRMAT |
| Switch Row/Column | Comutare rând/coloană | „On the Chart Design tab, in the Data group, select Switch Row/Column (Comutare rând/coloană)” (_ms/01, 00, 05) | CONFIRMAT |
| Data (grupul) | Date | același citat (_ms/01) | CONFIRMAT |
| Change Chart Type | Modificare tip diagramă | „Pe fila Proiect, în grupul Tip, faceți clic pe Modificare tip diagramă” (_ms/02, 07) | CONFIRMAT |
| Type (grupul) | Tip | același citat | CONFIRMAT |
| Add Chart Element | Adăugare element de diagramă | „Faceți clic pe Adăugare element de diagramă” (_ms/00, 10) | CONFIRMAT |
| Chart Layouts (grupul) | Aspecte de diagrame | „în grupul Aspecte de diagrame, selectați Adăugare element de diagramă” (_ms/10) | CONFIRMAT (o pagină) |
| Chart Elements (butonul +) | Elemente diagramă | „Selectați Elemente diagramă lângă diagramă. Bifați caseta de selectare Legendă” (_ms/11, 04) | CONFIRMAT |
| Chart Title | Titlu diagramă | „În caseta text Titlu diagramă care apare în diagramă, tastați textul dorit” (_ms/04, 00) | CONFIRMAT |
| Legend | Legendă | _ms/04, 11 | CONFIRMAT |
| Data Labels | Etichete de date | „selectați Etichete de date” (_ms/04, 10) | CONFIRMAT |
| None / Outside End | Fără / Capăt exterior | „alegeți Etichete de date, apoi selectați Fără” (_ms/10); „selectați Capăt exterior” (_ms/05) | CONFIRMAT |
| All Charts (fila ferestrei) | Toate diagramele | „selectați fila Toate diagramele” (_ms/00) | CONFIRMAT |
| Select Data, Move Chart | Selectare date, Mutare diagramă | _ms/04, 09 | CONFIRMAT (doar butoane cenușii în simulator) |
| Above Chart, Centered Overlay, Center, Inside End, Inside Base, Data Callout, Right, Top, Left, Bottom; la Data Labels: Left, Right, Above, Below, Best Fit; categoriile Column/Line/Pie/Bar din fereastra Change Chart Type | — | negăsite | NESIGUR → doar engleza (numele englezești citite pe captura meniului real, `cap/meniu_*.png`; cele din fereastră NEPROBATE) |
| Enable Editing | Activare editare | preluat din lecțiile VIII/6 și VIII/9 | NESIGUR (numit întâi în engleză) |

## Simulatorul: `lectii/_sim/excelx-grafic.js` (nou, proprietar: autorul lecției VIII/11)
Extensie a foii `excelx.js` (nu o modifică; nu atinge motorul sau extensiile altor lecții). Panglica proprie (Inserare › Diagrame cu cele 3 butoane cu listă; Proiectare diagramă cu Adăugare element de diagramă, Comutare rând/coloană, Modificare tip diagramă), graficul desenat SVG, butonul + cu cele trei bife, fereastra Modificare tip diagramă, titlul scris în „bara de formule” a graficului, mutare și mărire cu mouse-ul și cu degetul, Delete și Ctrl+Z pe graficul ales, testele numite bifate pe loc. Regulile de mai sus (seriile, etichetele, titlul, legenda, radialul, bara jos-sus, axa de la 110, graficul vechi care nu se repară) sunt cele probate. Structura graficului (antet, coloană de nume) se fixează la inserare, ca în Excel: valorile și numele se schimbă pe loc, seriile nu.
**Abateri spuse pe ecran:** graficul apare SUB foaie, nu peste ea; o inserare făcută cu graficul vechi NEALES înlocuiește graficul (mesaj: „În Excel ai avea acum două grafice…”; cu graficul ales, ca în Excel, doar îi schimbă tipul); Diagrame recomandate, variantele 3-D/stratificate, Selectare date, celelalte elemente din meniu: cenușii, cu „nu le folosim azi”; pe telefon tasta Delete e butonul „⌫ Delete” de sub grafic, spus în textul de sub zonă și în P3. Sub graficul ales scrie „Ales acum: …” (ce parte e aleasă), un ajutor al simulatorului.
**Abateri nespuse (mici), după reparare:** tras din zona de desen, graficul nu se mișcă (în Excel se mută zona de desen în interiorul graficului); locul cursorului la al doilea clic pe titlu e aproximat după locul clicului; etichetele lungi de jos se rotesc la 45° când nu încap (Excel le rotește și el, după loc); lista Data Labels la bare e cea de la coloane (a barelor NEPROBATĂ); culoarea și numele „SeriesN” ale seriilor rămase după ștergerea unei serii urmează poziția (NEPROBAT); comutarea după ștergerea unei serii scoate și categoria ei (NEPROBAT); panoul Format Chart Title e mic, lângă grafic (în Excel stă în dreapta ferestrei) și se închide când alegi altă parte (în Excel rămâne și trece la Format Chart Area, apoi la Format Shape după un clic pe o celulă: `_proba/r4_excel.json › D3`). Până la reparare: tragerea din mijloc muta tot graficul, axa era 0-150, etichetele se tăiau, Data Labels avea la orice tip lista de la coloane, Delete ștergea mereu tot graficul — toate reparate (vezi „Reparare 1”).

## Probele paginii
- `test_joc.py --dir lectii/viii m2-l11` → **TRECUT** (32 de întrebări jucate; avertismentul „1 niveluri” e cel așteptat). Avertismentul „varianta corectă e mai lungă” (Î3) reparat.
- `verifica_lectie.py … --fara-t1` → S0 TRECUT, S1 0 identice, S2 6/6, **T0 1 = alarmă falsă**: extragerea în .md scrie înaintea fiecărei legende de poză eticheta ei proprie „Legenda imaginii:” (vezi `verificare_lectii/viii-m2-l11/t0/51_lectia.md`, prima poză, P1), iar oracolul o ia drept folosirea termenului „legendă” (al graficului) înainte de definiție. În textul lecției, „legendă” apare abia la P5, unde e definit („Fiecare serie are culoarea ei, iar legenda, caseta de sub grafic, spune a cui e fiecare culoare”). Confirmat de ambii judecători; după reparare, aceeași și singură alarmă (`_proba/r1_verifica.txt`). Ultima linie a porții: 1 (doar această alarmă).
- `_proba/proba_gesturi.py` (Playwright, gesturi reale: 1280 px mouse + tastatură, 390 px atingere, tragerile cu degetul prin CDP; rețeaua blocată în afară de 127.0.0.1, închidere cu `ctx.close()`): **89 de verificări, 0 picate, 0 erori în consolă**; cereri blocate: doar fontul Google. Pe telefon, golirea celulei se face ca un elev (bara de formule, șters, ↵). Capturile de telefon (`_tel_p3.png`, `_tel_p4_radial.png`, `_tel_p6.png`, `_tel_atelier.png`, `_tel_lab.png`, `_tel_final.png`) le-am privit; după ele: textul de sub zonă scos din zonă, panoul + deschis sub grafic pe telefon.
- **De știut la probă (Chromium emulat):** o atingere care urmează unei trageri prin CDP își pierde uneori clicul (fără nicio schimbare în pagină între apăsare și ridicare), și pe P2, unde lucrează doar foaia `excelx.js`, fără extensia mea (`_proba/depanare_tel3.py`: 1 din 6). Proba repetă atunci atingerea o dată și o numără („atingeri fără clic, repetate”: 0-5 pe rulare). NEPROBAT pe un telefon real.
- Cuvinte pe pas (`_proba/numara_cuvinte.py`), după reparare (`_proba/r1_cuvinte.txt`): textul 88-110, „Uite cum” ≤ 68 (fără legendele pozelor); ultima linie 0.
- Reparații ale simulatorului găsite de probe (`_proba/patch_sim2..5.py`): panglica și zona se rescriu doar când se schimbă ceva; etichetele liniei în dreapta; axa de la 110; pictograme desenate (fără emoji); textul pentru telefon (regula 15).

## Imagini (`img/SURSE.json`)
- 13 capturi reale din Excel (desktop ascuns, PrintWindow, doar decupate, fără bara de titlu): `selectie`, `lista-coloana`, `coloana`, `bara`, `linie`, `radial`, `doua-serii`, `comutat`, `ani-gresit`, `ani-corect`, `meniu-elemente`, `elemente`, `laborator-gata` (5-33 KB). `comutat.webp` refăcută la reparare (`_proba/r1_excel.py` → `cap/r1_comutat.png`, `r1_imagine.py`): după comutare, cu titlul pus de Excel, „Chart Title”, ca în poza dinainte.
- P1: `grafic-cuburi.webp` — „Barchart math classroom 001.jpg”, **jimmiehomeschoolmom, CC BY 2.0**, Wikimedia Commons (licența citită pe pagina fișierului: `{{Cc-by-2.0}}` + FlickreviewR passed, `_proba/commons_licenta.txt`); doar convertită în .webp, 800 × 493, 14 KB. Fără persoane. Descărcată cu User-Agent-ul `LearningHub-lectii/1.0 (educational site)`.
- Refolosită: `../m1-l03/img/confirma-inlocuire.webp` (Confirm Save As, lecția VIII/3).

## Registrul de descărcat
`biblioteca_lectia11.xlsx` — `_proba/fa_registru.py` (openpyxl, date inventate: Luna, 8A, 8B, septembrie-decembrie); `curata_metadate.py --curata`, apoi fără `--curata` → ultima linie 0. Pașii din laborator probați pe o copie (A28, A29, A15, A24 în `afirmatii.json`). Culorile seriilor în acest registru (albastru, roșu) sunt cele ale temei openpyxl; un registru nou din Excel are alte culori — textul lecției nu numește culori.

## NESIGUR (ce n-am putut proba)
- Panoul butonului + (bifele): nu e vizibil pentru UI Automation și nu apare pe desktopul ascuns; efectul bifei e probat prin COM (SetElement). De la reparare, laboratorul și ajutoarele dau drumul din panglică (probat); butonul + e doar pomenit, ca variantă. (Mutarea, mărirea, clicul pe o celulă și fereastra Modificare tip diagramă au fost probate între timp de judecători și la reparare, cu clicuri de mouse trimise ferestrei: `j1_plus.json`, `arbitru_dialog_coloana.json`, `r1_excel*.json`.)
- Ce scrie Excel-ul ROMÂNESC în graficul cu mai multe serii („Titlu diagramă”, după Microsoft) și la seriile fără nume („Series1” în engleză; „Seria1”?): neprobat pe un Office în română.
- Poziția legendei când bifezi Legendă în panoul + (simulatorul o pune în dreapta, ca HasLegend prin COM).
- Banda galbenă Enable Editing; numele „Column” din stânga ferestrei Change Chart Type; aranjamentul tastaturilor din școli (apostroful cu AltGr pe RO Standard, din lecția 5).
- Urme în lista „Recent”: deschiderea cu `/x` a lăsat `_proba\_gol_l11.xlsx` (și dosarul `_proba\`). Le scoate dirijorul la final cu `curata_mru_office.py --sterge` (cere Office închis; alți autori lucrau în paralel cu Excel).
- Probele reparării (r1_excel*.py) n-au deschis niciun fișier (registru nou, `Workbooks.Add`), deci n-au lăsat urme în Recent; `IgnoreRemoteRequests` pus la loc (`True` → `False`); dosarul de recuperare al Excel-ului neschimbat (`_proba/r1_recuperare_inainte.txt`); PID-urile mele: 5656, 23056, ieșite singure după `Quit`.

## Reparare 1 (06.10.2026, autorul 2, după `_verificare/registru_j1.md`, punctele A-P)
Faptele noi sunt probate în Excel REAL, instanță nouă (`DispatchEx`) pe desktopul ascuns, doar PID-ul meu, clicuri de mouse și taste reale trimise ferestrei foii (metoda judecătorului 1): `_proba/r1_excel.py` → `r1_excel.json`, `_proba/r1_excel2.py` → `r1_excel2.json`. Restul: din probele judecătorilor (`_verificare/j1_*.json`, `_verificare/ab_sonnet/arbitru_*.json`).

| # | Ce am schimbat | Unde | Dovada |
|---|---|---|---|
| A | Cu graficul ales, un buton din Inserare îi schimbă tipul (un singur grafic, fără mesaj); mesajul „două grafice” rămâne doar cu graficul neales, cu „alegi cu un clic pe marginea lui albă și apeși Delete”. Spus în P4 („Te-ai răzgândit?”). | simulator (`insereaza`); P4 Uite cum | `j1_insert_ales.json` |
| B | Laboratorul, pasul 6: drumul din panglică, Proiectare diagramă › Adăugare element de diagramă › Etichete de date › Right. P6 dă panglica ca drum principal; butonul + doar „mai repede”. | `PROVOCARE[5]`; P6 | `j1_submeniu.json`, `r1_excel.json › eticheta_implicita` |
| C | P6: „Locurile depind de tip: la coloane, Capăt exterior (Outside End); la linie, Right”. Simulatorul: lista Data Labels după tip; bifa pune locul implicit al tipului; la schimbarea tipului, locul se potrivește. | P6; simulator (`ETP`, `ETI`, `etPentru`) | `j1_submeniu.json`; `r1_excel.json › eticheta_implicita` (coloane Outside End, linie Right, radial Best Fit, bare Outside End; coloane→linie Right) |
| D | P5 descărcat: capcana anilor mutată la P2 („Drept nume ia doar textul”), lângă „doar numerele → 1, 2, 3, 4, 5”, cu o întrebare de aplicare; nota despre axa de la 110 scoasă; regula spune explicit „și la număr egal, fiecare rând”; exercițiu nou 3 × 3 (note, materiile ca serii) înaintea lui Î2. Plafonul de 5 pași (după „La ce folosește”) e păstrat, de aceea nu am împărțit pasul. Legenda rămâne definită la P5, pentru că exercițiile lui o citesc. | P2, P5 | `r1_excel2.json › tabele_noi › note_column` |
| E | P3 predă „îl alegi din nou cu un clic pe marginea lui albă… îl ștergi cu Delete” și „Atenție la clic” (coloanele → doar seria, titlul → doar titlul), înaintea oricărui exercițiu cu ștergere; exercițiu nou „șterge-l și fă-l din nou” (rândul Total). Toate ajutoarele: „alege graficul cu un clic pe marginea lui albă, apoi Delete”. Simulatorul: clicul alege partea de sub mouse/deget, Delete șterge doar partea aleasă; pe telefon, butonul Delete. | P3; ajutoarele P4-P5, atelier 2; simulator (`parteDin`, `sterge`) | `r1_excel.json › delete_dupa_clic`, `r1_excel2.json › runda2`, `arbitru_delete.json` |
| F | Coloane/rânduri întregi selectate → doar partea folosită a foii (A:D → A1:D5). | simulator (`intregi`) | `arbitru_zone.json` |
| G | Graficul se mută doar tras de marginea albă (sau mărit de un cerculeț); tras din zona de desen nu se mișcă, doar o alege. | simulator (pointerdown) | `j1_plus.json › 6_tragere_*` |
| H | Axa: regula Excel (0 sau min-(max-min)/2 la valori apropiate; max + 5%; pasul 1-2-5 cu cel mult 10 intervale, la bare 7) → 110…145 din 5 în 5. | simulator (`scala`) | `j1_fapte_rezumat.txt` (24 de grafice) + `r1_excel2.json` (7 grafice, cu 3 de bare): toate se potrivesc |
| I | Etichetele lungi de jos se rotesc la 45° când nu încap, nu se mai taie. | simulator (`desenSVG`) | probă la 390 px (`r1_gesturi.log`) |
| J | `comutat.webp` refăcută cu „Chart Title”; legenda pozei: „Titlul nu se schimbă”. | `img/comutat.webp`, P5 | `r1_excel.json › captura` |
| K | „Un singur clic pe titlu” în P6, în laborator și în ajutoare; „Două clicuri pe titlu pun cursorul în text…: clic pe o celulă și reiei cu un singur clic”. Simulatorul: al doilea clic intră în text (ce scrii se adaugă, Enter = rând nou, Esc lasă textul), clicul pe o celulă păstrează textul. | P6, laborator 5; simulator (`alegeTitlu`) | `r1_excel.json › titlu_clicuri`, `r1_excel2.json › titlu_reparat_cu_un_clic` |
| L | Titlul are cel puțin 34 px; în întrebările cu grafic, pe telefon: ↶ ↷, „Copiază tabelul” și celulele cel puțin 32 px (CSS doar sub `.xg-host.xg-tel`, fără să ating `excelx.js`); butonul Delete 34 px. | simulator (CSS) | `r1_gesturi.log` › „L: țintele…” |
| M | „Etichete” rămâne doar pentru etichetele de date: la P2 „numele de pe marginea de jos”, la P5 categoriile = „numele de pe marginea de jos”. | P2, P5 | — |
| N | „La bare stau în stânga, iar la radial sunt feliile.” | P5 | `bara.webp`, `radial.webp` |
| O | Atelierul: 4 clase × 3 zile (Clasa, miercuri, joi, vineri): după inserare seriile sunt zilele, deci testul „fiecare clasă e o serie” cere Comutare rând/coloană. | atelier | `r1_excel2.json › tabele_noi › targ_line` |
| P | P3 = o idee („graficul ales”: inserarea, alegerea de margine, apoi muți / mărești / ștergi), cu capturi reale pentru inserare și pentru graficul ales; gesturile le face simulatorul (regula 4). | P3 | `capturi_lipsa.json` |
| J4-M1 (N2) | Reparația 4: dublu-clicul rapid pe titlu lasă titlul doar ales și deschide panoul Format Chart Title (▾ Title Options, Text Options, ✕). ✕ îl închide, iar titlul rămâne ales. Scrisul + Enter înlocuiește tot titlul, Delete îl șterge (și cu panoul deschis). Două clicuri rare pun tot cursorul în text. Pe telefon, două atingeri repezi deschid și ele panoul. Textul P6 rămâne (era adevărat). | simulator (`deschideFormat`, `alegeTitlu` cu `ev.detail`, `dblclick`, `.xg-fmt`) | Excel: `_proba/r4_excel.json › D1-D3`, `r4_excel2.json › D4`, `r4_excel4.json › D6` (clic real pe ✕), capturile `_proba/_r4_excel_panou.png`, `_r4_excel_dupa_x.png`; simulator: `_proba/r4_probe.py`, `r4_probe_inainte.txt` (4 picate la N2; a cincea era o verificare prea strictă a scriptului, pe locul cursorului, abatere deja scrisă, corectată) → `r4_probe_dupa.txt` (0), capturi `_r4_pc_panou.png`, `_r4_tel_panou.png` |
| J4-M2 | Reparația 4: mesajul „Graficul mai are rândul Total” apare doar când zona graficului cuprinde rândul 5 (A1:B5, A2:B5). La A2:B4 și A1:B3 vine mesajul comun, cu zona cerută A1:B4. `mesajZona` poate fi acum `{rand,text}`; textul simplu merge ca înainte. | `index.html` r.154 (`mesajZona:{rand:5,text:…}`); simulator (`verifica`) | `r4_probe_*` (TOT): înainte 4 picate (A2:B4 și A1:B3, la 1280 și la 390 px), după 0; A1:B4 → Corect |
| J4-M3 | Reparația 4: la calculator, un clic pe titlu + Delete șterge titlul (caseta titlului e goală, deci Delete șterge partea aleasă). Cu text scris, Delete rămâne în casetă. Ctrl+Z readuce titlul. | simulator (`keydown` pe caseta titlului) | Excel: `_verificare/j4_excel.json › T`, `r4_excel.json › D1`; simulator: `r4_probe_*` (DEL, P3 și P6): înainte 2 picate, după 0 |
| J4-M4 | Reparația 4: Ctrl+Z (și ↶ pe telefon) readuce graficul șters, ales de margine. Anularea e una pentru foaie și grafic: desface ultimul pas, oriunde a fost (o celulă scrisă după ștergere se anulează întâi, apoi revine graficul; Ctrl+Z pe grafic după o mutare nu mai anulează și foaia). ↶ e aprins cât graficul are ce anula. | simulator (`leagaAnulareaG`, `salveaza` cu foaia, `poateAnula`, `butonAnulare`) | Excel: `r4_excel.json › Z2` (Ctrl+Z ca tastă → 1 grafic, ChartArea ales), `_verificare/j4_excel.json › Z`; simulator: `r4_probe_*` (Z, UND): înainte 6 picate, după 0; `r4_l12_anulare.py` (proiectul VIII/12, anularea foii neatinsă) |

Reparația 4 (06.10.2026, autor proaspăt), pe scurt. sha1: `lectii/_sim/excelx-grafic.js` 27578425…231dc → 55df9cc0…a67b1; `index.html` dfb79df6…c7a1d → 71eeb1d3…f8041. Regresia, pe simulatorul final, cu gesturi (1280 px mouse și taste, 390 px atingere): `_proba/r4_sweep.py` (copia lui `j4_sweep.py`, cu cele două greșeli de script reparate ca în `j4_dbg.py` și o pagină proaspătă pentru fiecare întrebare) dă 40 din 40 (VIII/11 30, VIII/12 8, VIII/13 2); A1 de la VIII/13 (`r4_l13_a1*.py`) 15 din 15; 0 erori în consolă. Porțile: `test_joc` TRECUT la m2-l11 (34), m2-l12 (27), m2-l13 (31); `verifica_lectie --fara-t1` ultima linie 0 la toate trei. Excel: 4 instanțe proprii pe desktopuri ascunse, fiecare închisă cu Quit și ieșită singură; nimic deschis sau salvat; dosarul de recuperare neschimbat. În `r4_excel3`, butonul UIA „Close” era ✕ al ferestrei Excel: a închis registrul nou, nesalvat, fără salvare.

Abaterea găsită la probă: comanda Undo după ștergerea unei serii aduce seria înapoi, dar scoate „Chart Title” (`r1_excel2.json › serie_Delete_apoi_Undo`, probat cu `Application.Undo`, nu cu tastele Ctrl+Z). Simulatorul face la fel; pagina nu mai sfătuiește Ctrl+Z după o ștergere greșită, ci „șterge-l și fă-l din nou”.

Simulatorul reparat a stat întâi în `_proba/excelx-grafic_lucru.js` (lecțiile VIII/12 și VIII/13 încărcau `lectii/_sim/excelx-grafic.js` în timpul judecății lor), probat pe `_proba/lucru/index.html` și pe copii de probă ale lecțiilor 12 și 13 (`_proba/reg12/`, `_proba/reg13/`): `test_joc` TRECUT pe toate trei; `_proba/r1_gesturi.py`: 104 verificări, 0 picate, 0 erori.

După semnalul dirijorului, copia de lucru a înlocuit `lectii/_sim/excelx-grafic.js` (paginile de probă au fost șterse; se refac cu `_proba/r1_pagina_lucru.py`, `_proba/r1_regresie_pagini.py`). Porțile pe pagina adevărată: `test_joc` m2-l11 TRECUT, regresia `test_joc` pe m2-l12 și m2-l13 TRECUT; `verifica_lectie --fara-t1` → 1 (aceeași alarmă falsă T0); `_proba/r1_gesturi.py lectie` → 104 verificări, 0 picate, 0 erori în consolă (`_proba/r1_final_gesturi.log`).

Judecata 2 → reparat: N1 (focusul se dă mereu la pointerdown, Delete/Ctrl+Z merg după un nou clic pe marginea graficului ales), I (etichetele lungi de jos se rup pe două rânduri, întregi; rotire doar dacă un cuvânt nu încape), N2 (textul despre două clicuri rare / dublu-clic și panoul Format Chart Title), N3 (cu o serie aleasă, butonul din Inserare dă mesaj și nu schimbă nimic), N4 (după ștergerea unei serii din două, titlul implicit devine numele seriei rămase), N5 („din pasul „Selectezi datele””), N6 (radialul fără legendă: explicația spune să pornești Legenda), mesajul de la exercițiul cu rândul Total (spune greșeala reală, prin câmpul nou `mesajZona`).
- Judecata 2 → reparat (N6, 06.10 ~03:40, dirijor): explicația radialului de la P4 nu mai folosește „legendă” înainte de definiție și nu mai trimite la butonul + (neprobat); poarta T0 a prins-o la publicare.
