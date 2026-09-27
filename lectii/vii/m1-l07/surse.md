# Surse — lecția VII · M1 · 7: Formatarea imaginii, a tabelului și a paginii

Scris de autorul lecției pe 27.09.2026. Standardul: `_campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md`.

## Programa și locul în an
- `C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json`: VII-U1 „Tehnoredactare: editorul de texte”, CS.1.1 + CS.3.1, lecția 7 „Formatarea imaginii, a tabelului și a paginii” (predare).
- `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`, clasa a VII-a, domeniul „Editor de texte”: conținutul copiat exact „Operaţii de formatare a unui document: text, imagine, tabel, pagină” (lecția 6 a luat textul și paragraful; lecția 7 imaginea, tabelul și pagina). Activitatea de învățare: „formatarea unui document utilizând instrumente dedicate”.
- `Calendar_ore_VII_A.md`: lecția 7 pe 20.10.2026; săptămâna 19–23.10 (Tupilați luni, ora simultană; Izvoare marți; Brauner vineri).

## Caietul (ce știe elevul) — `profil.json`
Lecțiile 2–6 ale clasei, citite întregi: `lectii/vii/m1-l04` (poza pusă din Insert, singură pe rândul ei; tabelul din grilă; rând, coloană, celulă), `m1-l05` (selectare, Delete, Ctrl+Z, Activare editare), `m1-l06` (formatarea schimbă doar cum arată; aldin; aliniere).

## Materialul refolosit din `jocuri/word-obiecte-vii` (nivelurile cu `lectii:[7]`)
- **Luat:** ordinea ideilor (mânerele, colț vs latură; încadrarea; stilul tabelului; lățimea coloanei; orientarea și marginile), analogiile (plastilina/telefonul, piatra din pârâu, foaia de caiet) rescrise, și capturile reale de mai jos.
- **Nu am luat:** `tabel-antet.webp` (greșită, găsită de faza 0); atelierele `pagina` (editor de tabel „simplificat”, nu Word); îmbinarea celulelor și rândul de antet repetat (nu sunt în programa acestei lecții și ar fi încărcat pasul); strategia de calcul „încape tabelul?” (a rămas doar ca exemplu în pasul 5).
- **Comutatorul „Rând antet”** (nepredat în joc, găsit de faza 0): aici bifa **Header Row** e predată în pasul 3 (ce face, unde e), apoi cerută.

## Capturi reale folosite (din `jocuri/word-obiecte-vii/img/`, proveniența în `SURSE.json` de acolo)
`manere-poza.webp` (P1, Î1), `optiuni-aspect.webp` (P2), `proiectare-tabel.webp` (P3), `margini.webp` (P5). Verificate cu ochii: arată exact ce spune textul. `incadrare-text.webp` și `orientare.webp` nu mai sunt în pagină (le înlocuiesc dump-ul și simulatorul), dar confirmă numele din meniuri.

## Imagini noi (`img/`, proveniența în `img/SURSE.json`)
- `cetatea.png` — desen PIL al autorului (poza din simulator și din documentul de lucru).
- `pagina-inainte.webp`, `pagina-dupa.webp`, `incadrare-linie-patrat.webp`, `tabel-stiluri.webp`, `coloana-lata.webp`, `orientare-tabel.webp` — **pagina documentului desenată de Word-ul real** (export PDF prin COM, instanță invizibilă), nu capturi ale panglicii. Documente inventate.
- Documentul de lucru `excursia-cetate.docx` — făcut de Word prin COM; proprietățile (autor, ultimul autor) golite (`_proba/curata_docx.py`, verificat: 0 apariții ale numelui contului; `curata_metadate.py` al dirijorului: 0 fișiere cu nume). Prima coloană a tabelului: 2,8 cm (cât desenează Word; judecătorul J4).

## Numele românești (regula 6) — surse Microsoft ro-ro citite pe 27.09.2026
| Engleză (în laborator) | Română scrisă în lecție | Sursa / starea |
|---|---|---|
| Layout Options | Opțiuni aspect | support.microsoft.com/ro-ro/office/bdbbe1fe-c089-4b5c-b85c-43997da64a12 („Încadrarea textului în jurul unei imagini în Word”): „Selectați **Opțiuni aspect**” — CONFIRMAT (o pagină) |
| Picture Format | Format imagine | aceeași pagină + „Modificarea dimensiunii unei imagini…” (ro-ro/word/change-the-size-…): „Format imagine” — CONFIRMAT |
| Wrap Text | Încadrare text | aceeași pagină: „Format imagine … > Încadrare text” — CONFIRMAT |
| In Line with Text / Square / Tight / Top and Bottom / Behind Text / In Front of Text | În linie cu textul / Pătrat / Strâns / Sus și jos / În spatele textului / În fața textului | aceeași pagină, toate șase numite — CONFIRMAT (o pagină Microsoft) |
| Through | „Printre” | NESIGUR: nu apare pe pagina Microsoft; în lecție nu e în text, doar ca subtitlu în meniurile simulatorului, lângă numele englezesc |
| Size / Height / Width | Dimensiune / Înălțime / Lățime | „Modificarea dimensiunii unei imagini…” ro-ro — CONFIRMAT |
| Table Design | Proiectare tabel | ro-ro „Utilizarea unui cititor de ecran pentru a insera un tabel în Word”: „fila **Proiectare tabel**” — CONFIRMAT |
| Header Row | Rând antet | aceeași pagină: „auziți 'Rând antet'” — CONFIRMAT |
| Table Styles | Stiluri de tabel | aceeași pagină: „stilurile de tabel predefinite” — CONFIRMAT |
| Table Layout / Cell Size / AutoFit | Aspect tabel / Dimensiune celulă / Potrivire automată | ro-ro „Redimensionarea unui tabel, a unei coloane sau a unui rând” — CONFIRMAT |
| Layout | Aspect | calibrare `meniuri_ro_en.json`: NESIGUR („Aspect” / „Aspect pagină”); am scris „Aspect”, ca lecțiile anterioare |
| Orientation / Portrait / Landscape | Orientare / Portret / Vedere | ro-ro „Modificarea orientării paginii la vedere sau portret”: „Portret sau Vedere”; butonul apare ca „Orientare aspect” (text tradus automat) — Portret/Vedere CONFIRMAT, „Orientare” probabil |
| Margins / Custom Margins | Margini / Margini particularizate | ro-ro „Modificarea aspectului unui document”: „Margini particularizate” — CONFIRMAT (scris acum și în pasul 5, după judecător J5) |
| Page Setup | Inițializare pagină | NESIGUR: numele grupului din Excel ro-ro („grupul Inițializare pagină”, `calibrare/_cache`); pentru fereastra din Word n-am găsit o pagină Microsoft |
| Narrow | Îngust | pagina Microsoft ro-ro pentru Excel din `calibrare/_cache` („Normal, Lat sau Îngust”) — NESIGUR pentru Word |
| Borders | borduri | termenul, nu butonul (butonul Borders nu e folosit); consecvent cu lecția 6 și jocul |
| Rândurile Table Style Options, clic dreapta (Size and Position…, Table Properties…), View Gridlines | doar în sfaturile simulatorului | NESIGUR, nefolosite în instrucțiuni |

Numele englezești ale butoanelor, filelor, grupurilor și opțiunilor sunt citite din Word-ul instalat (dump UI Automation): `jocuri/_motor/panglica-word.json` (filele fixe) și `_proba/dump_contextual_uia.json` (Picture Format, Table Design, Table Layout, galeriile Wrap Text, Margins, Orientation, Table Styles, AutoFit).

## Ce am probat în Word-ul real (detaliat în `afirmatii.json`, 40 de afirmații)
- 29 CONFIRMATE pe Word (COM + PDF-ul desenat de Word + dump-ul interfeței + capturi reale; A40 confirmată de judecător prin COM), 3 PARȚIAL (A20, A27, A36), 7 NESIGURE (A03, A04, A06, A21, A22, A23, A37: gesturi, caseta Width, Enter în Page Setup), 1 preluată din lecțiile 5–6 (A34, Protected View).
- Poza pusă din panglică are **Lock aspect ratio** bifat; încadrarea (6 feluri) mută textul exact cum spune pasul 2; stilurile de tabel au culorile și liniile din simulator; bifa Header Row; pragul de lățime pentru nume (3,8 cm; figura coloanei refăcută cu lățimile citite din Word: 2,8 -> 4,3 cm); toate cele 105 stiluri ale galeriei, citite din PDF; foaia întoarsă păstrează mărimea pozei și a tabelului și rotește marginile; tabelul de 21 cm iese din foaia în picioare și încape pe cea culcată; pașii provocării duc la pagina promisă (14 promisiuni, 0 greșite).

## Ce NU am putut verifica (de confirmat în laborator)
1. **Gesturile** (A03, A04, A21–A23): colțul păstrează forma fără Shift (documentația Microsoft vorbește de Shift, generic); latura turtește; linia dintre coloane lățește una și o îngustează pe vecina ei cu tot atât; linia din dreapta schimbă doar ultima coloană.
2. Numele și locul butonului **More** al galeriei Table Styles (A20) și fereastra **Page Setup** cu câmpurile Top/Bottom/Left/Right (A27).
3. **Normal = 2,5 cm** doar dacă Word-ul din laborator măsoară în cm (pe acest PC: da, Options.MeasurementUnit = cm); cu inci, 2,54 cm (A26).
4. Numele românești marcate NESIGUR mai sus.

## Porțile autorului
- `python jocuri/_motor/test_joc.py --dir lectii/vii m1-l07` → **TRECUT** (27 de întrebări jucate pe Pixel 7 + iPhone SE, diacritice 74,9/1000; avertismentul așteptat „1 niveluri”).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0). Avertismentul T0 „densitate fără verdict @ antet” (antetul are sub 10 propoziții) nu blochează; nu sunt semnalări de arătat false.
- `_proba/proba_ui_l07.py` (Playwright, gesturi reale: 390 px cu atingere + 1280 px mouse/tastatură) → **0 probleme, 0 erori în consolă**. Proba a găsit și s-au reparat în simulator: focusul care fugea pe `<body>` după clicul pe poză (Delete/Ctrl+Z nu mergeau), „corectarea atingerii” din Chrome care trimitea tragerea mânerului de latură pe butonul Layout Options, panoul Layout Options tăiat de marginea foii, o eroare în consolă la caseta Width.
- `_proba/proba_logica_sim.js` → 0 (15 exerciții `wordpag`: rezolvarea trece, greșeala tipică pică, documentul de start nu trece).

## După judecător (27.09.2026, `_verificare/judecator.md`, reparațiile în `_verificare/reparatii.md`)
- J1: nume vizibile pe telefon în Layout Options și în galeria Table Styles; Tight ≠ Through; galeria are acum toate cele 105 stiluri, pe rândurile din Word, cu culorile citite din PDF (`_proba/stiluri_tabel.json`, 0 erori).
- J2: zone de atins de cel puțin 32 px pe telefon, măsurate cu elementFromPoint (`_proba/proba_ui_l07.json`, „zona …”); pagina se mărește singură când atingi o poză mică.
- J3–J7: Enter în Page Setup = OK; figura coloanei și documentul de lucru cu prima coloană de 2,8 cm (cât desenează Word); „Margini particularizate”, „Inițializare pagină”; pasul 6 din Word-ul adevărat cu clic pe fila Picture Format; portarul în loc de căpitan.
- J8 (fotografia fișei pe avizier): nefăcută, cere o fotografie la școală (capturi_lipsa.json C5).
- Regula 22 (dirijor, 27.09): nicio cerere spre servicii externe cu numele profesorului. În lucrul la lecție au plecat spre exterior doar: căutări și citiri de pagini Microsoft ro-ro (fără nume) și descărcarea icoanelor Fluent de pe unpkg (User-Agent-ul implicit al Python-ului, fără nume).

## După trecerea 2 a judecătorului (28.09.2026, `_verificare/judecator2.md`)
- K1: pe telefon, selecția se schimbă la atingere (nu la apăsare), deci defilarea nu deselectează poza; Layout Options e adus în ecran după mărirea automată și după tragerea mânerului; panoul se deschide deasupra butonului dacă dedesubt nu e loc; mesajul despre ↔ rămâne până la următoarea selecție; atelierul spune ce faci dacă nu vezi butonul.
- K2: în simulator, coloana nu e mai îngustă decât cel mai lung cuvânt + marginile celulei, iar cuvintele nu se rup (ca Word: A40).
- K3: „dală” înlocuit cu „model” (explicat la prima folosire: „un pătrățel cu un tabel mic desenat pe el”).
- K4: butoanele de zoom 32 × 32 px. K5 (= J8, fotografia): tot nefăcut.
