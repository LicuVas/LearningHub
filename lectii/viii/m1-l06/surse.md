# Surse — VIII / M1 / lecția 6: „Formatarea rândurilor, a coloanelor și a celulelor”

## Programa și planul
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`: VIII-U1 „Calcul tabelar” (CS.1.1, CS.3.1), lecția 6, „Formatarea rândurilor, a coloanelor și a celulelor” (predare).
- `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` (OMEN 3393/2017), conținuturile declarate, copiate exact:
  „Operații de formatare a rândurilor/coloanelor” și „Operații de formatare a celulelor (aliniere conținut, borduri, culori de umplere, stiluri predefinite)”. Fiecare parte are pas + exercițiu + întrebare: rânduri/coloane (P2), aliniere (P3, P4), borduri și culori de umplere (P5), stiluri predefinite (P5, exercițiul Title).
- `Calendar_ore_VIII.md`: 13.10.2026; `lectii/plan.json`: 16.10.2026 (Brauner). Săptămâna 12-16.10: Tupilați, Izvoare, Brauner.
- Ce ȘTIE elevul: `profil.json` (lecțiile 2-5).

## Material refolosit
- `jocuri/excel-viii` nivelul „Formatarea rândurilor, coloanelor și celulelor” și `jocuri/excel-pas-cu-pas-viii` nivelul „Tabelul arată bine: formatarea”: ordinea ideilor (lățime și ####, aliniere, îmbinarea titlului, borduri și umplere, stiluri, formatul numerelor, „formatarea schimbă cum arată, nu ce conține”) și analogia cu rama pozei. NU am refolosit: exemplul cu cota TVA 19% (constantele vin doar din `calibrare/constante_lume.json`; lecția nu folosește TVA), afirmațiile neprobate („toate bordurile… 1.5px”), capturile vechi (le-am refăcut pe registre noi, cu tema actuală).
- Lecția 5 (`lectii/viii/m1-l05`): lista excursiei (Ana 150, Bogdan 75,5, Cristi 120; datele 28.09 / 01.10 / 05.10.2026; codurile '001…). Lecția 6 o formatează — aceeași listă, cu nume întregi.
- Simulatorul comun `lectii/_sim/excelx.js` (proprietar: autorul lecției 5) — NESCHIMBAT. Extensia de formatare: `lectii/_sim/excelx-formatare.js` (autorul acestei lecții).

## Fapte probate în Excel-ul REAL (Microsoft 365, versiunea 16.0 build 20326, interfața în engleză, setări regionale românești: virgulă zecimală, punct pentru mii, date zz.ll.aaaa, moneda „lei”)
Toate probele: instanță NOUĂ (DispatchEx sau EXCEL.EXE /x), invizibilă sau pe un DESKTOP ASCUNS (`C:\00\AI_0\tools\hidden_desktop.py`), fără salvare, închisă doar ea. Butoanele: `CommandBars.ExecuteMso("<idMso>")`, aceeași comandă ca un clic pe buton (idMso din lista oficială Microsoft, `_cercetare/office_comenzi/M365_SAEC/excelcontrols.xlsx`).
| Fișier (`_proba/`) | Ce dovedește |
|---|---|
| `proba_env.json` | Calibri 11, tema Office (culorile), separatorii; ExecuteMso merge pe instanța invizibilă. Lățimea implicită e 8,11 pe acest ecran (scalare 150%), 8,43 la 100% — de aceea lecția nu dă nicio lățime „implicită” în cifre. |
| `proba_comenzi.json` | alinierea (comutatoare; după celula ACTIVĂ; verticala implicită = jos), Wrap Text (rândul crește; nu și la înălțime pusă de mână), Merge & Center / Across / Cells / Unmerge, %, Comma, Accounting, Increase/Decrease Decimal pas cu pas, toate cele 13 borduri (margini comune între vecine), culorile implicite ale butoanelor (galben, roșu), Clear Formats, pragul „####” la fiecare lățime (seriile „latime”), AutoFit, stilurile. |
| `proba_ascuns_lista.json` | lista Number Format aleasă prin UI Automation: codul pus de fiecare element și textul (Number 0,00; Currency #.##0,00 lei; Short Date; Long Date „luni, 5 octombrie 2026”; Percentage 0,00%…), bara de formule. |
| `proba_ascuns_bara_font_imbinare_tastare.json` | tastare adevărată (Excel lățește singur coloana la o dată, la un număr mare, la Accounting; coloana îngustată de mână rămâne cu ####), rândul crește cu fontul (12 → 15,6 pct), avertismentul real la îmbinare (text, OK/Cancel; Cancel nu schimbă nimic; OK păstrează prima valoare; cu o singură valoare nu apare), bara de formule (7,125 sub 7,13; 12,5% sub 13%). |
| `proba_reguli.json` | aldin, încadrare, mărimea fontului și zecimalele se iau după celula ACTIVĂ și se pun pe toată zona; îmbinarea pe o celulă doar o centrează; al doilea clic pe o celulă îmbinată o desface; Unmerge păstrează centrarea. |
| `proba_paleta_stiluri.json` | paleta Theme Colors (10 culori × 6 nuanțe, citite din Excel) și ce pune fiecare stil (Title, Good, Heading 1…). |
| `proba_afirmatii.json` | un singur Ctrl+Z după Merge & Center aduce înapoi valoarea ștearsă; #.##0,00 în coloana de lățime 5 = #####, potrivit = 1.234,50; 150 → 150,0 → 150,00; procentele din exerciții; liniile grilei nu se tipăresc. |
| `fa_fisier.json` | fișierul de descărcat `excursia_clasei.xlsx`, redeschis: datele din C arată ######, numele întregi în valoare. |
Afirmațiile, una câte una, cu dovada: `afirmatii.json`.

## Capturile
Toate din Excel-ul real, pe desktop ascuns, cu PrintWindow (procesul conștient de DPI, altfel meniile ies tăiate), pe registre NOI făcute de Excel (tema actuală; un registru făcut cu openpyxl are tema veche Office 2007 — capturile de probă de acolo n-au fost folosite). Conținut inventat, fără bara de titlu (acolo e inițiala contului). Decupajele și chenarele roșii: `_proba/decupeaza.py`; proveniența fiecărei imagini: `img/SURSE.json`.

## Numele românești ale butoanelor
Office din laborator e în engleză (§6b), deci pe ecran elevul vede numele englezești; în text apar AMBELE. CONFIRMATE în `calibrare/meniuri_ro_en.json`: Pornire (Home), grupurile Font și Număr (Number). **NESIGURE** (din traducerea Microsoft cunoscută și din lecțiile LearningHub, neverificate mecanic): grupul Aliniere (Alignment), grupul Celule (Cells), grupul Stiluri (Styles) — calibrarea dă „Stiluri”/„Stil”; Îmbinare și centrare (Merge & Center), Încadrare text (Wrap Text), Borduri (Borders), Toate bordurile (All Borders), Culoare de umplere (Fill Color), Culoare font (Font Color), Aldin (Bold), Stiluri celule (Cell Styles; alte lecții scriu „Stiluri de celule”), Format număr (Number Format), Mărire zecimale (Increase Decimal), Micșorare zecimale (Decrease Decimal), Stil procent (Percent Style), Aliniere la stânga / Centrare / Aliniere la dreapta, Aliniere sus / Aliniere la mijloc / Aliniere jos, Lățime coloană (Column Width), Potrivire automată (AutoFit Column Width), Înălțime rând (Row Height), Activare editare (Enable Editing), Revocare (Cancel). Numele stilurilor (Title, Good…) le-am lăsat în engleză, cum apar pe ecran.

## Simulatorul de formatare (`lectii/_sim/excelx-formatare.js`)
Ce face și de unde vine fiecare regulă: comentariul din capul fișierului. Oracolul: `_proba/proba_fidelitate.py` compară ce arată simulatorul cu ce a arătat Excel-ul real (lista Number Format, zecimalele pas cu pas, scurtarea numerelor General la fiecare lățime, potrivirea automată, data lungă); ultima linie = nepotrivirile. Proba cu gesturi reale (mouse 1280 px, atingere 390 px, Ctrl+Z, avertismentul): `_proba/proba_gesturi.py`.
Abateri spuse pe ecran (un clic pe ele scrie „e și în Excel, dar foaia din pagină nu-l are”): fereastra Format Cells (Ctrl+1 și săgețile din colțul grupurilor), Format Painter, Orientation, Indent, More Colors, Draw Border, New Cell Style, Hide/Unhide, numele fontului.
Pe telefon (după judecător, G1/M1-M3): foaia se derulează trăgând de literele coloanelor; lățimea / înălțimea se schimbă din mânerul ⇔ / ⇕ care apare pe marginea coloanei / rândului selectat (în Excel pe calculator tragi de linie; spus în nota de telefon); rândurile au cel puțin 32 px (în Excel sunt mai scunde); panglica e mărită, iar grupurile Font, Aliniere și Număr stau pe două rânduri, în ordinea din Excel, cu numele scris sub fiecare buton (spus în nota panglicii: „în Excel îl vezi când ții mouse-ul pe buton”). Numerele rândurilor se derulează odată cu foaia (în Excel rămân pe loc).
Abateri NESPUSE pe ecran, mărunte: textul centrat sau aliniat la dreapta nu trece peste vecini (în Excel trece); potrivirea automată a textului e socotită cu fontul Carlito (aceleași lățimi ca Calibri), deci poate ieși cu o zecime de caracter altfel decât în Excel; în formatul Accounting, spațiile de umplere sunt aproximate; copierea unei celule îmbinate nu duce îmbinarea (excelx copiază formatul celulelor, nu și îmbinările).

## Ce n-am putut verifica
- Gestul de DUBLU-CLIC pe marginea coloanei și TRAGEREA ei cu mouse-ul în Excel-ul real: am probat comenzile lor (Columns.AutoFit, ColumnWidth), nu gestul fizic. Documentația Microsoft le leagă (dublu-clic = AutoFit).
- Vizualizarea protejată (Enable Editing) pentru fișierul descărcat, pe calculatoarele din laborator.
- Cursorul ↔ pe marginea coloanei (nu se prinde în captură, `capturi_lipsa.json`).
- Setările regionale și limba Office din cele trei laboratoare (Tupilați, Izvoare, Brauner) — presupuse ca la lecția 5.

## După judecător (27.09.2026, `_verificare/judecator.md`)
Reparațiile, una câte una, cu dovada: `_verificare/reparatii.md`. Probe noi: `_proba/capturi3_ascuns.py` (Excel real, desktop ascuns: „După” și „titlu îmbinat” fără aldin și fără coduri centrate, rândul înalt singur, 0,036 → 4% cu 3,6% în bara de formule) → `cap/_pozitii3.json`; `_proba/proba_gesturi.py` (41 de probe cu mouse la 1280 px, 22 cu degetul la 390 px, inclusiv atelierul terminat pe telefon și derularea pe litere); `_proba/proba_panglica_ramane.py`; `_proba/diag_derulare.py`, `depanare_atelier_tel*.py` (cum s-au găsit cauzele).

## De știut pentru următorii autori (găsite azi)
- Foaia din motor (`tip-excel.js`) înlocuiește `.gw` și panglica la FIECARE desen și măsoară pagina în mijlocul desenului: fără grijă, derularea laterală a foii și a panglicii se pierde după orice apăsare, iar cu pagina derulată până jos browserul o derulează înapoi (~55 px) și degetul ajunge pe alt rând. Remediul, în extensie: `#xwrap` cu `min-height` = înălțimea de după desen, `scrollLeft` ținut minte și pus la loc (`excelx-formatare.js`, finalul lui `deseneaza`).
- Zona selectată se citește din antetele aprinse (`th.on`), nu din `td.act/td.z`: o celulă ascunsă într-o îmbinare nu are `td`.
- Prin pywin32, `Range.NumberFormat` primește aici codul în forma LOCALĂ (0,00; #.##0,00): „0.00” scris în cod englezesc devine altceva. Citește/scrie `NumberFormatLocal`.
- Două blocuri `DispatchEx` la rând în același script: referințele COM rămase vii după `CoUninitialize` au dus la căderea Python-ului (segfault) și la un Excel rămas pornit. Un singur bloc, sau `del` pe toate obiectele.
- `import pywinauto` în procesul care ține obiecte COM pywin32 le strică („Object is not connected to server”): UI Automation într-un proces separat (`_proba/uia_ajutor.py`).
- Excel pe desktop ascuns respinge apelurile cât e ocupat; pywin32 le arată ca AttributeError — le reîncerci (`Rx` din `capturi_ascuns.py`).
- În emularea Playwright, o tragere cu degetul prin CDP se termină în punctul (0,0), iar Chromium înghite următoarea atingere ca „oprire de fling”; proba pune o atingere neutră între ele (`_proba/depanare_tel.py`).
