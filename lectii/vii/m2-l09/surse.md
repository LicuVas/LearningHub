# Surse — lecția VII · M2 · 9: Document după specificații date: scrisoare, carte de vizită, diplomă, felicitare

Scris de autorul lecției pe 28.09.2026. Standardul: `_campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md`; brieful: `07_BRIEF_AUTOR.md` (inclusiv regula pentru lecțiile de consolidare / mini-proiect).

## Programa și locul în an
- `C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json`: VII-U1 „Tehnoredactare: editorul de texte”, CS.1.1 + CS.3.1, lecția 9 „Document după specificații date: scrisoare, carte de vizită, diplomă, felicitare”, tip „consolidare (mini-proiect)”, materiale `fisa_proiect`, `grila_proiect`.
- `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`, clasa a VII-a, domeniul „Editor de texte”: conținutul copiat exact „Reguli de lucru în realizarea unui document conform unor specificații (dimensiune pagină, dimensiune font, dimensiune imagine, format tabel)”. **De aici „dimensiunea paginii”**: e în conținutul acestei lecții, de aceea pasul 3 predă butonul Size (singura unealtă nouă; brieful spunea „nu predai unelte noi”, dar programa pune mărimea paginii exact aici, iar cartea de vizită nu se poate face altfel fără unelte nepredate).
- Activitățile de învățare din programă (CS.3.1): „realizarea unor documente de tip scrisoare, carte de vizită, diplomă, felicitare etc.” (`instrumente/Descriptori_clasa_VII.md`).
- `Calendar_ore_7_MA.md`: lecția 9 pe 13.11.2026 (M2), între lecția 8 (06.11, reguli de tehnoredactare) și evaluarea sumativă (20.11). La Tupilați, ora simultană: pagina se parcurge fără profesor.

## Documentele profesorului (au prioritate) — ce există și ce NU
| Document | Ce spune despre lecția 9 | Folosit în pagină |
|---|---|---|
| `planificari/Proiectul_unitatii_VII-U1.md` | ora 9 = consolidare (mini-proiect), materiale „fisa_proiect, grila_proiect” | titlul, tipul orei |
| `data/activitati_lectii_VII_VIII.json` | „Mini-proiect: fiecare elev alege un tip de document real de care are nevoie școala și îl realizează după o fișă de specificații. Verificare încrucișată între colegi înainte de predare.” Resurse: „laborator, fișe de specificații, grila de produs” | alegerea între 4 fișe; documente „de care are nevoie școala”; verificarea încrucișată (atelierul + ultimul pas din laborator) |
| `SISTEM_EVALUARE.md` §3 | mini-proiectul/produsul digital = o notă, „pe grilă anunțată dinainte” | grila arătată ÎNAINTE de lucru, în laborator |
| `instrumente/Grila_produs.md` | 5 criterii, fiecare cu 0 – 18 puncte (repere: De bază = 10 p, Consolidat = 14 p, Avansat = 18 p; și între repere; 0 dacă lipsește cu totul) + 10 din oficiu; „Nota = punctaj : 10”; nivelul din notă; „Grila se dă elevilor odată cu tema proiectului” | copiată cuvânt cu cuvânt (constantele GRILA, NIV, REP și textul de deasupra criteriilor); autoevaluarea din laborator calculează punctajul, nota și nivelul după ea (secțiunea „Grila cu puncte”, mai jos) |
| `instrumente/Fisa_criterii_elev_clasa_VII.md` | „să fac documente utile: scrisoare, carte de vizită, diplomă, afiș” | — |

**Ce NU există:** fișele de specificații propriu-zise (`fisa_proiect`) și o grilă separată de proiect (`grila_proiect`) nu sunt scrise nicăieri în `Info_Gimnaziu_2026` (căutat: „carte de vizit”, „felicitar”, „diplom”, „scrisoare”, „specifica”, „fisa_proiect”, „grila”). Deci:
- **fișele de specificații sunt ale autorului lecției** (`_proba/fise.json`, sursă unică pentru pagină și pentru probele în Word). De confirmat de profesor: dacă are alte fișe, se schimbă doar `fise.json` și se rulează `scrie_fise_js.py`, `proba_com.py`, `proba_fisiere_elev.py`, `fa_imagini.py`;
- **nicio notă și niciun punctaj inventat**: punctele, oficiul, nota și nivelul vin din grila profesorului (`Grila_produs.md`) și din `_campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md` §1, §2, §4; pagina arată socoteala, nu dă altă regulă.

## Fișele (autorul lecției) — fiecare făcută în Word-ul real
| Fișa | Foaia | Ce cere | Probat |
|---|---|---|---|
| Diploma (concursul de desen, continuarea afișului din lecția 6) | A4 culcată, margini 2 cm | 7 rânduri Georgia (48 / 16 / 28 / 16 cursiv / 14 / 14 / 8 pt), titlul aldin roșu închis, alinieri centrat / stânga / dreapta; poza de 6 cm (5,5–6,5) sub nume, la mijloc; sursa pozei pe ultimul rând | 1 pagină, 29,7 × 21 cm, poza 6,00 × 4,00 |
| Felicitarea (1 Decembrie) | A5 (14,8 × 21), margini 1,5 cm | Comic Sans MS 28 aldin albastru / 16 aldin / 14 cursiv / 14 dreapta / 8 pt; steagul de 8 cm (7,5–8,5) sub titlu | 1 pagină, 14,8 × 21 cm, steagul 8,00 × 5,33 |
| Scrisoarea (invitația la serbarea de iarnă, continuarea anunțului din lecția 6) | A4 în picioare, margini 2 / 2 / 3 / 2 cm | tot textul Times New Roman 12; data la dreapta; „Dragi părinți,” aldin; paragrafele stânga-dreapta, alineat 1,25, spațiere 1,5; tabelul Grid Table 4 - Accent 1 cu Header Row | 1 pagină, 21 × 29,7 cm |
| Cartea de vizită (clubul de lectură, din lecția 3) | 9 × 5 cm, margini 0,5 cm | 4 rânduri Georgia centrate (14 aldin albastru / 9 cursiv / 10 / 10) | 1 pagină, 9,0 × 5,0 cm |

Probele: `_proba/proba_com.py` (documentele făcute de la zero, randările `randari/E_*`) și **`_proba/proba_fisiere_elev.py` pe fișierele DE DESCĂRCAT** (deschise ReadOnly, duse după fișă: 4 × o pagină, mărimile exacte în PDF, fonturile încorporate; 0 probleme). Scrisoarea are un rând gol după tabel (un Enter), ca paragraful următor să nu se lipească de tabel (randarea fără el arăta înghesuit).

**Cartea de vizită 9 × 5 cm, cum se face concret în Word** (probat cu taste, `_proba/ui_hartie.py`): Layout › Size › More Paper Sizes... deschide Page Setup direct pe fila Paper; Width 9, Height 5 → Paper size trece pe Custom size; **OK cu marginile implicite de 2,5 cm dă mesajul „The top/bottom margins are too large for the page height in some sections.”**, iar după OK pe mesaj fereastra rămâne deschisă; fila Margins, 0,5 peste tot, OK → foaia 9 × 5 cu margini 0,5 (fila Margins arată Landscape). De aceea pașii din laborator spun: Width și Height, apoi fila Margins, abia apoi OK. NB: prin COM mesajul nu apare (proprietățile se pun fără verificare).

## Fișierele de descărcat
- `diploma-text.docx`, `felicitare-text.docx`, `scrisoare-text.docx`, `carte-de-vizita-text.docx`: textul fișei, fără formatare (Calibri 11, A4 în picioare, marginile implicite), făcute de Word prin COM (salvate sub `_proba/fisiere/`, copiate aici). Metadatele golite: `curata_metadate.py --curata`, apoi fără `--curata` → 0; căutare în toate părțile arhivelor: 0 apariții ale numelui contului.
- `creioane-colorate.jpg` (Wikimedia Commons, Colouring_pencils.jpg, MichaelMaggs, **CC BY-SA 3.0**, atribuire cerută: o scrie chiar diploma, pe ultimul rând, și e scrisă sub fiecare imagine care o conține) și `steagul-romaniei.png` (Flag_of_Romania.svg, AdiJapan, **domeniu public**). Licențele citite pe pagina fișierului prin API (`_proba/commons_licente.py` → `commons_licente.json`); User-Agent doar „LearningHub-lectii/1.0 (educational site)” (regula 22). Salvate cu 240 dpi, ca să intre în Word la 10,16 cm (mai late decât cere fișa: elevul le micșorează din colț, ca în lecția 7).

## Imaginile din pagină (`img/`, proveniența în `img/SURSE.json`)
- Paginile documentelor, **desenate de Word** (PDF prin COM): `diploma-buna.webp`, `diploma-rea.webp` (aceeași diplomă „după ochi”: foaia în picioare, titlul 36, numele fără aldin, poza deformată — lungită, prea îngustă pentru înălțimea ei —, data centrată), `felicitare-buna.webp`, `scrisoare-buna.webp`, `carte-vizita-buna.webp`. Cele cu poza creioanelor sunt tot CC BY-SA 3.0; sub fiecare, legături spre pagina pozei și spre textul licenței.
- **Capturi din Word-ul real pe desktop ascuns** (PrintWindow; doar decupaje, fără bara de titlu; rama neagră a ferestrei tăiată; chenarele roșii desenate după): `marime-lista.webp` (lista Size), `hartie-9x5.webp` (fila Paper), `mesaj-margini.webp`, `margini-05.webp`, `verifici-font.webp` (casetele Font și de mărime: Georgia / 48, apoi goală la două mărimi), `verifici-poza.webp` (Picture Format › Size: 4 cm / 6 cm). Capturile de fereastră întreagă din `_proba/cap/` au fost șterse (regula 27); rămân decupajele (`cap/decupaj_*.png`).
- Refolosită: `jocuri/word-obiecte-vii/img/margini.webp` (pasul 2), cu proveniența acolo.

## Simulatoarele
- `lectii/_sim/wordobj-formatare.js` (`wordfmt`, nemodificat): P2 încă 1, P4, atelierul, întrebarea 4. Panglica simulată arată fontul și mărimea rândului selectat; la două mărimi caseta de mărime e goală, ca Word-ul.
- `lectii/_sim/wordobj-pagina.js` (`wordpag`, nemodificat): P4 încă 1 (steagul; pagina spune că e o foaie A4, doar pentru poză), atelierul încă 1.
- **`lectii/_sim/wordobj-hartie.js` — fișier NOU, al acestei lecții (după judecătorul 1)**, încărcat doar de pagina asta:
  1. tipul `wordhartie`: fila Layout cu Margins / Orientation / Size ca butoane mari **cu numele scris** (grupul Page Setup lățit, ca numele să încapă), lista Size (primele 10 mărimi din Word-ul instalat, cu „lista vine de la imprimantă”), More Paper Sizes..., fereastra Page Setup cu filele Margins și Paper (Paper size, Width, Height, previzualizarea), mesajele exacte ale lui Word („This is not a valid measurement.”, sus/jos, stânga/dreapta), cu o traducere sub ele. Un clic în casetă nu selectează ce scrie (ca în Word): „9” fără ștergere dă „21 cm9” și mesajul. Folosit în P2 (foaia diplomei), P3 (cartea de vizită, A5), întrebarea 2;
  2. în `wordpag`: numele Margins / Orientation / Size scrise sub pictograme (8 px, la pozițiile din Word), iar Size deschide lista adevărată cu mesajul „în exercițiul acesta foaia rămâne A4…”, nu „în lecția asta nu-l folosim”;
  3. în `wordfmt`, pe telefon: sub panglică, butoanele „Caseta Font ▾” și „Caseta de mărime (Font Size) ▾”, de cel puțin 44 px, care deschid meniurile casetelor din panglică (acolo casetele au 14 px); elementele meniurilor, cel puțin 36 px.
  Faptele simulatorului: `afirmatii.json` A01-A06, A24-A28 (Word-ul real). Abateri spuse pe ecran: fila Layout a ferestrei, Mirrored, Columns, Breaks nu sunt în simulator. Pragul de refuz al marginilor prea mari: sub 0,05 cm de text (Word primește 0,1 cm și refuză 0, măsurat de judecătorul 2).
- **Atelierul e pe cartea de vizită, nu pe diplomă:** pe telefon, `wordfmt` desenează literele la mărimea lor pe o pagină îngustă, iar „DIPLOMĂ” de 36-48 pt se rupea pe două rânduri. Testele atelierului sunt pe rânduri („literele ca în fișă” / „alinierea ca în fișă”), ca bifele să nu spună singure ce e greșit.
- În `wordfmt`, o tragere care începe în selecția veche nu face o selecție nouă (în Word ar începe mutarea textului); atelierul spune „Înainte de o selecție nouă, dă un clic în afara celei vechi.”

## Numele românești (regula 6)
În pașii din laborator și în lista „Unde o vezi”, fiecare nume are acum ambele forme, „română (engleză)”, ca „Pornire (Home)”.

| Engleză (laborator) | Română scrisă în lecție | Sursa / starea |
|---|---|---|
| Home / Font / Paragraph / Align Left, Center, Align Right, Justify / Font Color, Standard Colors | Pornire / Font / Paragraf / la stânga, centrat, la dreapta, stânga-dreapta | preluate din lecția 6 (surse Microsoft ro-ro acolo) |
| Layout | Aspect | NESIGUR („Aspect” sau „Aspect pagină”): `calibrare/de_confirmat_in_laborator.md`, rândul 2 |
| Orientation / Portrait / Landscape / Margins / Custom Margins... | Orientare / Portret / Vedere / Margini / Margini particularizate | lecția 7; „Margini particularizate” reconfirmat pe support.microsoft.com/ro-ro, „Crearea unei broșuri sau a unei cărți în Word” (28.09) |
| Page Setup | Inițializare pagină | CONFIRMAT (aceeași pagină Microsoft ro-ro: „fereastra Inițializare pagină”) |
| Paper (fila) | Hârtie | CONFIRMAT (aceeași pagină: „fila Hârtie”) |
| Size (butonul de pe fila Layout) | Dimensiune | NESIGUR: de confirmat în laborator, rândul 23 |
| More Paper Sizes... | explicat: „mai multe mărimi de hârtie” | NESIGUR: rândul 24 („Mai multe dimensiuni de hârtie...”?) |
| Width / Height (fila Paper) | explicate: lățimea / înălțimea | NESIGUR: rândul 25 |
| Custom size / Paper size | explicate: „mărime aleasă de tine” / „mărimea hârtiei” | NESIGUR: rândul 26 |
| Top / Bottom / Left / Right | explicate: sus / jos / stânga / dreapta | ca în lecția 7 |
| Picture Format / Size (grupul) | Format imagine / Dimensiune | lecția 7 (CONFIRMAT acolo) |
| Table Design / Table Styles / Header Row | Proiectare tabel / Stiluri de tabel / Rând antet | lecția 7 (CONFIRMAT acolo) |

Numele englezești sunt citite din Word-ul instalat (UI Automation): `jocuri/_motor/panglica-word.json` și `_proba/ui_ascuns.json`. Mesajele lui Word: capturile din `_proba/cap/` (h_mesaj_A_ok_0.png, w_M_ok_0.png) și proba judecătorului (j9_word3.json).

## Caietul (ce știe elevul) — `profil.json`
Lecțiile 2-7 ale clasei, citite (textele pașilor și pașii din aplicația reală). **Lecția 8** („Reguli de tehnoredactare și estetică a paginii tipărite”) se scrie în paralel, de alt autor: pagina o numește doar ca „regulile unei pagini îngrijite” și nu folosește niciun termen din ea.

## Afirmațiile (`afirmatii.json`, 30)
21 CONFIRMATE în Word-ul real (COM, PDF, UI Automation, taste și clicuri ca mesaje pe desktop ascuns) sau în pagină, 2 PARȚIALE (A09 culoarea de pe butonul Font Color, A14 poza prin fereastra Insert Picture), 7 PRELUATE (lecțiile 3, 5, 6, 7 și probele judecătorului 1: A25 „21 cm9”, A28 „0.5”, A29 Center aprins cu poza). NESIGURE pentru laborator: lista Size (A01, vine de la imprimantă), fonturile (A16), setările regionale (A17).

## După judecătorul 1 (28.09, `_verificare/judecator.md`: 0 GRAV, 6 MAJOR, 10 MINOR)
| # | Problema | Reparația | Locul |
|---|---|---|---|
| M1 | „scrie la Width 9” luat literal dă „21 cm9” | „clic în casetă, șterge tot ce scrie acolo (Backspace și Delete, și „cm”), apoi 9”; la fel Height și marginile; ce faci la „This is not a valid measurement.” | pasul 3 (text, „Uite cum”, Încearcă), laborator pașii 3-4, lista „Unde o vezi”; probat în Word-ul real (`_proba/word_literal.py` → `word_literal.json`, C: 9 × 5, margini 0,5, fără mesaj) |
| M2 | Size în simulator: „în lecția asta nu-l folosim” | simulatorul nou `wordhartie` (Size merge: lista, More Paper Sizes..., fila Paper); în `wordpag`, Size deschide lista cu mesajul exercițiului | `lectii/_sim/wordobj-hartie.js`; P2, P3 (+ încă 1), întrebarea 2 |
| M3 | numai numele englezești în laborator și în „Unde o vezi” | „Aspect (Layout)”, „Orientare (Orientation)”, „Dimensiune (Size)”, „Format imagine (Picture Format)”, „Proiectare tabel (Table Design)”, „Rând antet (Header Row)”, „Paragraf (Paragraph)”, fila „Hârtie (Paper)”…; nesigurele → `calibrare/de_confirmat_in_laborator.md` (23-26) | `PASI`, `specs()` |
| M4 | diploma: „Mai sus, alege fișa”, dar acolo nu e nimic | pe diplomă, deasupra „Pașii, încă o dată”, apar acum fișele, descărcările, lista și grila (aceeași componentă ca în laborator) | observatorul `.real-recap` din `index.html` (motorul folosește pentru diplomă tot `aplicatieReala.pasi`, nu `diploma.provocare`) |
| M5 | Margins / Orientation / Size fără nume vizibil | nume scrise sub pictograme, și în `wordpag`, și în `wordhartie` | `wordobj-hartie.js` |
| M6 | casetele Font și de mărime de 14 px pe telefon | butoane mari (≥ 44 px) sub panglică, care deschid meniurile casetelor | `wordobj-hartie.js` (doar pe ecran tactil) |
| m | „diploma unui coleg” (atelierul e pe cartea de vizită) | „cartea de vizită a unui coleg” | `cum` |
| m | grila fără parantezele profesorului | „De bază (cu sprijin, model)”, „Consolidat (independent)”, „Avansat (context nou, justificat)” | `NIV` |
| m | „Textul fișei…” 26-28 px | 44 px | CSS `.fl-fisa details>summary` |
| m | CC BY-SA fără legături | pagina pozei + textul licenței, în fișă și sub imagini | `CR_CREIOANE`, `CREDIT`, fișa din laborator |
| m | Align Left pe un rând deja la stânga | laboratorul, pasul 5: „nu mai apăsa la stânga…” | `PASI[4]` |
| m | „dublu-clic pe el în Descărcări” pe calculatorul comun | „din lista de descărcări a browserului: cel de sus e al tău”; „nu apăsa Ctrl+S până nu salvezi o dată cu F12” | `PASI[1]` |
| m | simulatorul primește „1.5” și tace la valori greșite | `wordhartie` (P2, întrebarea 2) face ca Word-ul: virgula, „This is not a valid measurement.”; textul spune „șterge tot și scrie” | `wordobj-hartie.js` |
| m | ordinea din pasul 5 ≠ laborator | textul întâi, apoi foaia | pasul 5 |
| m | „nedeformată” și „la mijloc” fără valoare de citit | „caseta de sus = două treimi din lățime (6 → 4 cm)”; „Center aprins = la mijloc” | `specs()`, rândul „Poza” |
| m | „poza turtită” în diploma rea | „poza deformată (lungită)” | pasul 0 (alt), `img/SURSE.json` |

## După judecătorul 2 (29.09, `_verificare/judecator2.md`: 0 GRAV, 0 MAJOR, 4 MINOR — publicabilă)
Faptele de Word sunt cele măsurate de judecător (`_verificare/j9b_word.json`, `j9c_word.json`, `j9d_word.json`); Word nu a mai fost pornit.
| # | Problema | Reparația | Locul |
|---|---|---|---|
| 1 | după OK pe „This is not a valid measurement.”, simulatorul punea cursorul la capăt („9” → „21 cm99”); Word selectează tot textul casetei | la închiderea mesajului, caseta greșită primește focusul cu TOT textul selectat; traducerea de sub mesaj și laboratorul, pasul 4: „Word selectează tot ce scrie în caseta greșită, deci scrii direct numărul” | `lectii/_sim/wordobj-hartie.js` (`inchideMesaj`, `drawDlg`); `PASI[3]` |
| 2 | fișa scrisorii cere un rând gol după tabel, iar lecția 8 predă „niciun rând gol făcut cu Enter” | excepția spusă: sub fișa scrisorii, „singura excepție de la regula din lecția 8: după un tabel, Word lipește rândul următor de tabel, iar spațiul potrivit se face cu o setare de spațiere pe care n-ai învățat-o încă”; textul fișei și lista de bifat o spun și ele. Fișierul de descărcat rămâne neschimbat (metadate 0, o pagină, fără bară galbenă, verificate de judecător). Lipirea rândului de tabel am văzut-o pe prima randare Word a scrisorii, fără rândul gol (`_proba/proba_com.py`, 28.09; randarea a fost apoi suprascrisă) | `labHtml()` (EXC), `textFisa()`, `specs()` rândul „Tabelul” |
| 3 | pragul marginilor: simulatorul refuza 2,3 și 2,45 cm sus/jos pe 5 cm, Word le primește | pragul: sub 0,05 cm de text (Word: 0,1 cm primit, 0 refuzat) | `wordobj-hartie.js` (`PRAG_TEXT`) |
| 4 | în pași, „Layout (Aspect)” sau doar engleza | peste tot „Aspect (Layout)”, „Orientare (Orientation)”, „Vedere (Landscape)”, „Margini (Margins)”, „Margini particularizate (Custom Margins...)”, „Dimensiune (Size)”, „Hârtie (Paper)”, „Format imagine (Picture Format)”, „Proiectare tabel (Table Design)”, în text, „Uite cum”, legende, exerciții, indicii și întrebări (textele alternative ale capturilor au rămas cu numele de pe ecran) | pașii 2-5, atelierul încă 1, întrebările 2 și 5 |

## Porțile autorului (după reparații)
- `test_joc.py --dir lectii/vii m2-l09` → **TRECUT** (27 de întrebări jucate pe Pixel 7 + iPhone SE, cu `wordhartie` rezolvat și respins la greșeală; avertismentul așteptat „1 niveluri”).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT, S1 0 identice, S2 6/6, T0 0).
- `_proba/proba_ui.py` → **0** și `_proba/proba_ui2.py` → **0** (Playwright, gesturi reale; toate cererile în afară de file: oprite — doar fontul Google a încercat să plece; `ctx.close()`). `proba_ui2` pe 390 px cu atingere și 1280 px cu mouse și taste: numele de pe butoanele mari (≥ 7 px înălțime, vizibile), drumul literal greșit („21 cm9” → mesajul la fila Margins), OK prea devreme → mesajul sus/jos, fereastra rămasă deschisă, Landscape în fila Margins, drumul bun (clic, Delete/Backspace, 9, 5, 0,5 × 4, OK) → foaia 9 × 5, A5 din listă + 1,5, Size în `wordpag`, butoanele mari pe telefon (≥ 120 × 44 px) și meniul de mărime (≥ 32 px), nivelurile cu paranteze, legăturile spre sursă și licență, „Textul fișei” ≥ 44 px, numele românești din pași, verificarea până la diplomă și fișele de pe diplomă.
- Capturile de telefon privite (luminos și întunecat): `_proba/t2_*.png`, `_proba/t3_*.png`.
- Cuvinte pe pas: textul 71-91, „Uite cum” ≤ 69.
- După judecătorul 2: `proba_ui2.py` probează și caseta selectată după mesaj („9” scris direct dă „9”) și marginile 2,45 + 2,45 pe 9 × 5 (primite, fără mesaj); pe telefon, nicio captură `full_page` (strică emularea atingerii).

## Grila cu puncte (29.09.2026)
**Sursa:** `C:/00/Projects/Info_Gimnaziu_2026/instrumente/Grila_produs.md` (documentul profesorului, are prioritate) + `_campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md` §1 (rotunjirea), §2 (nivelul din notă), §4 (grila de proiect). La fiecare criteriu: 0 – 18 puncte, repere De bază 10 p, Consolidat 14 p, Avansat 18 p (și între repere; 0 dacă lipsește cu totul); punctajul = criteriile 1-5 + 10 din oficiu (cel mult 100); nota = punctaj : 10, la cel mai apropiat întreg, la ,5 în favoarea elevului; nivelul se citește din notă.

| Ce | Locul |
|---|---|
| textul de deasupra criteriilor, copiat din `Grila_produs.md` (rândurile 5-7, cu exemplul 14 + 18 + 14 + 10 + 14 + 10 = 80 → nota 8); o propoziție despre oficiu („le primești din start, ca la lucrare”); nivelul din notă | `labHtml()`, blocul „Grila profesorului” |
| capetele de coloană cu puncte: „De bază (cu sprijin, model) · 10 p”, „Consolidat (independent) · 14 p”, „Avansat (context nou, justificat) · 18 p”; criteriile neschimbate, cuvânt cu cuvânt | `NIV`, `REP`, `GRILA` |
| autoevaluarea: la fiecare criteriu, „Lipsește · 0 p / De bază · 10 p / Consolidat · 14 p / Avansat · 18 p”; caseta de sub criterii scrie rândul de punctaj al grilei (Punctaj … + 10 din oficiu = … · Nota (punctaj : 10) · Nivelul (din notă …)), adunarea, împărțirea, rotunjirea și criteriul (sau criteriile, la egalitate) cu cel mai mult de câștigat până la 18 p; când toate au același punctaj, o frază scurtă. Sub „Acum documentul tău”: „Aici alegi reperul cel mai apropiat. Profesorul poate da și puncte între repere, ca la Mara.” O atingere schimbă doar butoanele și caseta, nu tot laboratorul | `ALEG`, `notaDin`, `nivelDin`, `calculGrila()`, `puneGrila()` |
| două exerciții înainte de autoevaluare, „Ce notă și ce nivel are documentul…?”: Radu 18, 14, 18, 10, 18 → 88 → 8,8 → nota 9, Avansat (alt set și alt rezultat decât exemplul grilei, fără ,5); Mara 12, 16, 14, 11, 12 (între repere) → 75 → 7,5 → nota 8, Consolidat. Fiecare variantă greșită e o singură greșeală: fără oficiu, doar primele 4 criterii, ia în seamă un singur criteriu, nivelul citit greșit din notă (la Radu), rotunjit în jos (la Mara). Varianta aleasă se colorează: verde dacă e corectă, roșie dacă e greșită | `EX` (între `/*EX:START*/` și `/*EX:END*/`), `exHtml()`, `exRez()`, `puneEx()`; CSS `.fl-var button.ok / .bad` |
| laboratorul, pasul 10 (verificarea încrucișată): „unde crezi că ești la fiecare criteriu: pagina adună punctele, cu 10 din oficiu, și îți arată nota (punctaj : 10) și nivelul” | `PASI[9]` |
| „Sunt alt elev” golește și exercițiile; nimic nu se păstrează în browser (regula 23) | handlerul de clic, `LAB.ex` |

**De ce așa:**
- Exercițiile de notare stau în laborator, nu în pași: grila se predă abia acolo, după atelier. Pașii 0-5, atelierul și cele 5 întrebări (despre document) au rămas neschimbate.
- `Grila_produs.md` scrie în rândul de punctaj doar 9-10 / 7-8 / 5-6. Autoevaluarea poate coborî sub 5 (minimul e 10 p → nota 1), așa că pagina spune și 3-4 În formare, 1-2 În dificultate, cu plan de recuperare (REGULA_NOUA.md §2, la fel ca `Fisa_criterii_elev_clasa_VII.md` §4).
- În autoevaluare se aleg doar reperele (0 / 10 / 14 / 18), deci suma e mereu pară și ,5 nu poate ieși acolo. Pagina îi spune elevului că acolo alege reperul cel mai apropiat, iar profesorul poate da și între repere, ca la Mara. Rotunjirea la ,5 se exersează la Mara (75 → 8).
- `afirmatii.json` A31-A34: socotelile, cu câmpul `calcul` (criteriile, punctajul, nota, nivelul, criteriile cu cel mai mult de câștigat). `profil.json`: grila cu puncte la „se predă aici”; oficiul și nota din punctaj, din lecția 1 a clasei, la „știe”.

**Probe (29.09.2026):**
- `_proba/proba_grila_calc.py` → **0**: regula scrisă din nou din REGULA_NOUA.md, fără codul paginii (autotest pe exemplele de acolo: 85 → 9, 84 → 8, 76 → 8, 75 → 8, 74 → 7; toate De bază 60 → 6, toate Consolidat 80 → 8, toate Avansat 100 → 10); grila din pagină = `Grila_produs.md` cuvânt cu cuvânt; 13 socoteli din pagină; cele 2 exerciții (răspunsul și fiecare greșeală); cele 4 afirmații.
- `_proba/proba_grila_mutanti.py` → **0** neprinși din 21 (exemplul grilei, fiecare variantă și nivelul ei, Radu cu punctele exemplului, explicația care descrie o regulă, enunțul fără nivel, un reper, un criteriu, rândul de punctaj, rotunjirea, afirmațiile).
- `_proba/proba_grila_ui.py` → **0**: gesturi reale la 390 px cu atingere și 1280 px cu mouse; rețeaua oprită în afară de fișierele locale (s-a încercat doar fontul Google), închidere cu `ctx.close()`. Cele 9 cazuri din A34 pe ambele ecrane; exercițiile, cu FIECARE variantă greșită (✘, explicația, butonul roșu) și cea corectă (✔, butonul verde); saltul cu „Textul fișei” deschis (4 atingeri în grilă și la exerciții: 0 px, caseta rămâne deschisă); alegerea parțială, „Sunt alt elev”, ținte ≥ 32 px, fără depășire pe lățime, fără erori, nimic în localStorage. Capturile privite: `_proba/g_tel_exercitii.png`, `_proba/g_tel_calcul.png`, `_proba/g_pc_calcul.png`.
- `_proba/proba_grila_ui_mutanti.py` → **0** neprinși din 2: redesenarea întregului laborator la atingere (prinsă: 403 → 120 px, caseta închisă) și butonul ales fără culoare (prins). Copia de probă stă lângă `index.html` doar cât rulează și se șterge.
- Regresie: `_proba/proba_ui.py` → **0** (partea de laborator adusă la grila cu puncte: 18 + 14 + 18 + 10 + 14 = 74, + 10 = 84 → nota 8, Consolidat) și `_proba/proba_ui2.py` → **0**.
- `test_joc.py --dir lectii/vii m2-l09` → **TRECUT** (27 de întrebări; avertismentul așteptat „1 niveluri”); `verifica_lectie.py … --fara-t1` → **0**; `_campaign/notare_punctaj_2026_09_29/verifica_regula.py` → 0 urme în acest dosar.
- Word nu a fost pornit: nicio afirmație despre Word nu s-a schimbat. `lectii/_sim/` (inclusiv `wordobj-hartie.js` și `wordobj-pagina.js`) neatins.

### După judecătorul notării (29.09, `_verificare/judecator_notare.md`: 0 GRAV, 0 MAJOR, 6 MINOR)
| # | Problema | Reparația | Locul |
|---|---|---|---|
| N1 | varianta cu un singur criteriu avea altă formă („pentru că…”), iar explicația ei descria o regulă | toate variantele au aceeași formă, „… → nota N, Nivel”; greșeala tipică rămâne („10 puncte la criteriul 4 → nota 6, De bază”), cu explicația „Nota vine din toate punctele adunate, cu cele 10 din oficiu: adună toate cele 5 criterii.”; enunțul cere și nivelul, iar la Radu e și varianta cu nivelul citit greșit | `EX`; `afirmatii.json` A32, A33 |
| N2 | Radu avea punctele exemplului din grilă, deci răspunsul era scris deasupra | Radu: 18, 14, 18, 10, 18 → 88 → nota 9, Avansat (alt set, alt rezultat, fără ,5); proba verifică să nu repete exemplul | `EX`; `proba_grila_calc.py` |
| N3 | autoevaluarea are doar reperele, deși textul spune „și între repere” | „Aici alegi reperul cel mai apropiat. Profesorul poate da și puncte între repere, ca la Mara.” | `labHtml()`, sub „Acum documentul tău” |
| N4 | o atingere în grilă sau la exerciții redesena tot laboratorul: „Textul fișei” se închidea, pagina sărea 576 px (telefon) / 490 px (calculator) | atingerea schimbă doar `aria-pressed`, culoarea, caseta de calcul și rândul de rezultat, în ambele copii (laborator și diplomă); măsurat: 0 px, caseta rămâne deschisă | `puneGrila()`, `puneEx()`, handlerul de clic |
| N5 | varianta aleasă avea aceeași culoare, corectă sau greșită | clasa `ok` / `bad` pe butonul ales: verde / roșu din temă (`--ok`/`--okbg`, `--bad`/`--badbg`), ca la întrebările motorului | CSS-ul lecției, `exHtml()`, `puneEx()` |
| N6 | la egalitate pe toate criteriile, o frază de 53 de cuvinte | „La toate criteriile mai ai câte 8 p până la 18 p. Alege unul și citește ce cere coloana următoare.”; la 2-4 criterii, virgule și „și” doar înaintea ultimului | `calculGrila()`, `insir()` |

## Calculatorul profesorului (regulile 22, 24-27)
- Word: doar instanțe NOI (DispatchEx invizibil, sau /x pe desktop ascuns); PID-ul notat; închidere cu Saved=True + Close(False) + Quit; `taskkill` doar pe PID-ul nostru (de 3 ori, pe instanța /x blocată de o fereastră modală, cu documentul neschimbat; niciun fișier de recuperare; lacătele `~$` din `_proba/fisiere/` șterse). Procesele Word ale altora n-au fost atinse. Salvări doar sub `_proba/`.
- **Lista „Recent” a Word-ului:** probele din prima rundă (15:36-16:36) au deschis documentele prin linia de comandă și au lăsat intrări de probă ale acestei lecții; le scoate dirijorul cu `curata_mru_office.py --sterge`, cu Office închis (regula 27: aici nu le enumăr). Probele de după judecător pornesc Word cu documentul gol și nesalvat (`/x /q /w`): lista Recent a avut același număr de intrări înainte și după.
- **Regula 27 pe ieșirile mele:** în `_proba/ui_ascuns.json` intrase, din panglică, numele contului (elementul MeControl); `_proba/curata_iesiri.py` l-a scos și a șters capturile de fereastră întreagă; verificarea pe tot dosarul lecției: 0.
- **Vederea documentelor noi din Word (dirijorul, 28.09 seara):** la ~20:08, documentele noi se deschideau în Web Layout, 200 %. Ieșirile mele NU notau vederea și zoomul, deci nu pot arăta ce tastă a făcut-o. Ce au trimis rulările `word_literal` (20:03-20:10) spre Word: clicuri-mesaj și Delete / Backspace / cifre / virgulă în casetele ferestrei Page Setup, Enter pe ferestrele de mesaj, Invoke pe butoanele OK / Cancel, Size › A5 prin UI Automation; nicio tastă spre documentul propriu-zis. În plus, la sfârșit, scriptul punea la loc în registru valorile Word\Data / Word\Options schimbate în timpul rulării (valorile de dinainte de pornirea lui): dacă între timp alt Word le schimbase, le-a suprascris — o cauză posibilă. **Pus la loc** (`_proba/word_vedere.py`, 20:36-20:37): instanța 1 (nouă, desktop ascuns) a citit Web Layout 200 %, a pus Print Layout 100 %, a închis documentul fără salvare, Quit; instanța 2, curată, a citit **Print Layout (3), 100 %**. De acum încolo, `wordcom.py` și `word_literal.py` citesc vederea și zoomul la început și le pun la loc înainte de Quit, iar `word_literal.py` nu mai scrie nimic în registru.
- Nicio cerere cu datele profesorului spre exterior: doar API-ul Commons și căutări/citiri pe support.microsoft.com, fără nume.

## Ce NU am putut verifica (de confirmat în laborator)
1. Lista Size de pe calculatoarele din laborator (A5 în listă?) și numele românești NESIGURE de mai sus (rândurile 2 și 23-26 din `calibrare/de_confirmat_in_laborator.md`).
2. Fereastra Insert Picture pentru pozele descărcate (mărimea de intrare, A14).
3. Protected View pe fișierele descărcate din pagină (A21, preluată).
4. Pragul exact la care Word refuză marginile prea mari, între 0 și 0,1 cm de text (simulatorul: sub 0,05 cm).
5. Dacă profesorul are propriile fișe de specificații: atunci fișele de aici se înlocuiesc din `_proba/fise.json`. (Grila de proiect cu punctaj există: `Grila_produs.md`, secțiunea „Grila cu puncte”.)
