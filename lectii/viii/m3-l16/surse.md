# Lecția 16, clasa a VIII-a — surse, probe și ce n-am putut verifica (19.10.2026)

Numerotarea pașilor e cea din bara motorului: **P1 = „La ce folosește”**, P2-P6 = pașii 1-5 din standard.

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_8A_8M.md` (15.01.2027, lecția 16, M3, predare), `data\unitati.json` (VIII-U2 „Pagini web”, CS.1.2 + CS.3.2, lecția 16 „teorie, exercitii”), `Proiectul_unitatii_VIII-U2.md` (ora 16).
- **Conținutul** (copiat întocmai din `curriculum.json`, clasa a VIII-a): „Operații de editare a elementelor de conținut (paragraf, imagini, tabele, liste, legături): inserare, ștergere, mutare, copiere”. Lecția 16 acoperă **paragraful și imaginile** (inserare, ștergere, mutare, copiere); tabelele și listele sunt la 17, legăturile la 18 — antetul lecției o spune („azi: paragraful și imaginea”).
- **Descriptorul „De bază”** din proiectul unității: „elemente de bază de structură și conținut (corp, paragraf, imagini), prin editare de bază (inserare, ștergere)” — exact ce cer atelierul și laboratorul.
- **`width` / `height`:** documentele profesorului NU le cer (proiectul unității, unitati.json, curriculum.json) → nu le predau (brief).
- `jocuri\web-viii`, nivelul „Paragrafe și imagini”: citit; am păstrat ideile bune (Enter-ul nu contează; `<br>` și `<img>` fără închidere; elementul întreg la mutare; `alt` la imagine lipsă). Nimic copiat: jocul folosește `<h1>` fără schelet și indentare cu 2 spații; aici totul e în scheletul lecției 15, cu Tab-uri.

## Ce presupun cunoscut (din lecțiile publicate) și ce acopăr
| | Din | Folosit în lecția 16 |
|---|---|---|
| ✓ | L14: fișierul .html, browserul îl desenează; `<h1>`…`</h1>`, bara `/` | P2 („Știi deja `<h1>`”), toate codurile |
| ✓ | L14: Notepad, filă nouă, punctul ●, Ctrl+S, Fișier › Salvați ca (Ctrl+Shift+S), Toate fișierele, UTF-8, „există deja” → Nu, Închideți fila | atelier, laborator 2-3, 11 |
| ✓ | L14: Explorer ascunde extensiile cunoscute; coloana Tip; fără coloana Tip, mouse-ul nemișcat pe fișier arată tipul | P5 (Tip „…JPG” → .jpg), atelier, laborator 6 |
| ✓ | clasa a V-a, L10: mutarea unui fișier în Explorer (un clic, Ctrl+X, folderul nou, Ctrl+V) | laborator 6 (fotografia ajunsă în Descărcări) |
| — | **Fișier › Deschideți (Ctrl+O) și fereastra Deschidere NU sunt predate de L14/L15** | le predau eu, în atelier, punctul 1 (reparare J1, punctul C); laborator 2 le reia |
| ✓ | L14: Ctrl+S în Notepad, apoi F5 în browser; F5 în Notepad = ora | atelier 2, laborator 6-7 |
| ✓ | L15: scheletul, meta charset, title, închiderea în ordine inversă, Tab-uri; `lang="ro"` (valoare între ghilimele) | toate codurile; P5 (atributul „ca `lang="ro"`”) |
| ✓ | L15: tastatura „Statele Unite – Internațional”: după `"` apeși Spațiu | laborator 4, mesajul simulatorului |
| ✓ | L4: selectare, Ctrl+C, Ctrl+X, Ctrl+V, ștergere | P4, laborator 8 |
| ✓ | clasa a V-a, L15: clic dreapta pe imagine › Salvați imaginea ca | laborator 1 (cu capturile Edge ale lecției V/15) |

„Pentru lecția următoare” nu există la L14/L15 ca secțiune separată; am citit secțiunile lor despre simulator. **Nimic contrazis:** L15 a folosit text simplu direct în corp (fără `<p>`); P3 spune de ce el iese pe un singur rând. L15 spunea „Browserul iartă multe greșeli” — aici `</br>` și `</img>` sunt tot iertate de browser, iar lecția cere forma corectă (ca L15 cu `</body>`).

## Granița (m3_19_10\granite\viii_l16.md)
Predau: `h2`-`h6` (cu rost: secțiune / parte de secțiune; nu sări niveluri; cifra nu e mărimea), `<p>`, `<br>`, elementul întreg (mut / copiez / șterg un paragraf), `<img src>`, `alt`. NU: liste, tabele (17), `<a>` (18), formatare / culori / CSS / `<b>` (19), publicarea (20), căi spre alte dosare, `width`/`height`. Vecinul VIII/17 presupune `<p>`, `<h1>`, `<h2>` de la mine — de acord; i-am cerut să nu folosească `<h3>`-`<h6>` în exerciții notate fără explicație.

## Faptele — probate, fără să schimb nimic al profesorului
Azi Notepad din Windows 11 și Edge/Chrome reali NU se pornesc (`_zi.md`, `_m3.md`). Comportamentul paginii l-am probat în **Chromium (Playwright, headless)** — motorul de desenare al lui Edge și Chrome — pe fișiere scrise ca de Notepad (UTF-8 fără BOM, CRLF), în dosarele mele din `_proba\`. Lecția scrie „browserul”, nu „Edge” la aceste fapte.

| Fapt (unde e) | Cum | Dovada |
|---|---|---|
| Enter, spațiile în plus și rândurile goale nu contează (P3, P4) | 30 de pagini-mostră | `_proba/proba_browser_l16.json` (enter_spatii, text_fara_p, enter_gol) |
| `<p>` = rând nou + spațiu liber (16 px) (P3) | idem | doua_p |
| `<br>` rupe rândul fără spațiu; `<br/>` la fel; `</br>` = încă un `<br>`; `<br></br>` = rând gol (P3) | idem | br, br_slash, br_inchis, br_br |
| h1-h6 îngroșate, 32/24/18,72/16/13,28/10,72 px; `<h7>` nu e titlu (P2) | idem | titluri, h7 |
| `<img src>` din același dosar se vede; fără extensie, cu .jpeg/.png, cu dosar în față, cu spațiu în nume → lipsă; `LAC.JPG` și `" lac.jpg "` → se văd (Windows) (P5) | idem, `file://` pe Windows 11 | img_* |
| Imagine lipsă: pictograma 16×16 + textul din alt; fără alt doar pictograma; `alt=""` nimic (P6) | idem + capturi | `_capturi/br_img_fara_ext.png`, `br_img_fara_alt_lipsa.png` |
| `</img>` ignorat; atributele lipite (`src="…"alt="…"`) și fără ghilimele merg; ghilimeaua lipsă strică src (P5, P6) | idem | img_inchis, img_lipit_atribute, img_fara_ghilimele, img_ghilimea_lipsa |
| `alt` pe rândul următor (Enter în etichetă) merge (P6, codurile cu `IA()`) | toate cele 37 de coduri ale paginii | `_proba/proba_coduri_l16.json` (0 nepotriviri) |
| Tipul din Explorer: aici `.jpg` = „IrfanView JPG File” (programul de poze); fără alt program, Windows în română scrie „Fișier GIF”, „Fișier WEBP”, „Fișier TXT” → „Fișier JPG” e dedus din tipar (P5) | `SHGetFileInfo` cu `SHGFI_USEFILEATTRIBUTES` (nu atinge fișiere) | `_proba/sonda_texte.json` |
| Chrome (română): „Salvează imaginea ca…”; engleză „Save image as…” (laborator 1) | citit din `ro.pak` / `en-US.pak` 155.0.8059.84 (fișiere, nu pornește nimic) | `_proba/sonda_texte.json` |
| Edge (română): „Salvați imaginea ca” → Salvare ca în Descărcări (laborator 1) | lecția V/15 (Edge 155, desktop ascuns) | `lectii/v/m2-l15/_proba/edge_salvare_ro.json`, capturile refolosite |
| Fereastra comună Deschidere: butonul „Deschidere”, „Nume fișier:” (laborator 2) | `comdlg32.dll.mui` ro-RO, încărcat ca date | `_proba/sonda_comdlg.json` |
| Notepad: Fișier › Deschideți (Ctrl+O); Editare › Decupaţi (Ctrl+X), Copiați (Ctrl+C), Lipiți (Ctrl+V), Ștergeți (Del) (P4, laborator 2, 8) | meniul real, citit de lecția 14 prin UI Automation | `lectii/viii/m2-l14/_proba/notepad_salvare.json` |

Fiecare afirmație „faci X → apare Y”: `afirmatii.json` (A01-A20), cu `probat: true / parțial / false`.

## Numele RO / EN
- Notepad: Fișier › Deschideți (Ctrl+O), Salvați ca (Ctrl+Shift+S), Închideți fila; fereastra Salvare ca: Nume fișier (File name), Toate fișierele (*.*), Codificare (Encoding), Salvare (Save); fereastra Deschidere: Deschidere (Open) — din lecțiile 14-15 și `sonda_comdlg.json`.
- Edge: „Salvați imaginea ca” (lecția V/15); Chrome: „Salvează imaginea ca…” (`ro.pak`).
- `meniuri_ro_en.json` nu are intrări pentru Notepad, Windows sau browser (doar Office).

## Imagini (detaliul în `img\SURSE.json`)
- `panou-valisoara.webp` — „Cheile Valisoarei - Cheile Aiudului (panou informativ).jpg”, E.Coman, **CC0** (licența citită din API-ul Commons, 19.10.2026, User-Agent „LearningHub-lectii/1.0 (educational site)”), miniatura de 960 px micșorată la 800. Fără persoane (doar pictogramele de interdicție de pe panou).
- `bucura.jpg` (640×480, 116 KB, de salvat în laborator) și `imagini-sim.js` (320 px, `data:` pentru simulator) — „Lake Bucura 03.jpg”, Gugalcrom123, **CC0**; aceeași fotografie e deja pe sit la VII/14. Fără persoane.
- `br-titluri.webp`, `br-paragrafe.webp`, `br-imagine.webp`, `br-imagine-lipsa.webp` — paginile lecției desenate de Chromium (`proba_coduri_l16.py --capturi`), 1:1, fără bara browserului; legendele nu spun „Edge”.
- Laboratorul refolosește `lectii/v/m2-l15/img/edge-meniu-imagine.webp` și `edge-salvare-ca.webp` (capturi Edge 155, lecția V/15; legenda spune „cu altă fotografie”).
- Imagine care lipsește: `capturi_lipsa.json`.

## Simulatorul: extensia NOUĂ `lectii\_sim\editorweb-continut.js` (proprietar: lecția VIII/16)
`editorweb.js` (L14) și `editorweb-schelet.js` (L15) **neatinse**. Extensia se încarcă după ele și adaugă:
1. **Fișiere-imagine** în dosare: `start.fisiere.Documente:[{n:'bucura.jpg', imagine:'bucura'}]` (mod notepad sau live), cu sursa înregistrată: `EditorWebContinut.inregistreaza('bucura', {uri:'data:…', latimeReala:640, inaltimeReala:480})`. Explorer le arată ca orice fișier (fără extensie, Tip „Fișier JPG”). Dublu-clic pe o imagine NU o deschide în browser: mesaj „La calculator, dublu-clic o deschide în aplicația de imagini” (A19, neprobat, scris fără numele aplicației).
2. **Pagina simulată arată imaginile din același dosar** cu pagina (numele fără spațiile de la capete, litere mari/mici indiferente, ca pe Windows); altfel imagine lipsă, desenată de Chromium exact ca un fișier lipsă (pictograma + alt). În modul live, sub zona de scris: dosarul paginii, ca în Explorer (nume fără extensie + Tip). O pagină cu `<img>` primește o fereastră de browser mai înaltă (27em), ca fotografia să se vadă.
3. **`window.EditorWebContinut`**: `seVede(S,U,spec)`, `toateSeVad`, `vazute`, `altBun(src)` (de la reparare J1: cel puțin două cuvinte, nu numele fișierului, nu doar „poză/imagine/foto…”), `paragrafe(src)`, `titluri(src,'h2')`, `br(src)`, `ordine(src)` („h1:…|h2:…|p:…|img:…”, pentru teste de mutare), `imagini(src)`, `dosarImagini(S,dosar)`, `sursa(S,U,spec)`; `spec` ca la `EditorWebSchelet.src`.
4. **`EditorWebContinut.cuDiagnostic(teste,{spec,coleg})`** = `EditorWebSchelet.cuDiagnostic` + greșelile cu imagini, spuse întâi: litere ü/ä în eticheta `<img>` (tastatura Internațională; mesajul L15 despre ü vorbea de utf-8), ghilimea lipsă în eticheta `<img>` (și pe două rânduri), `</img>`, `</br>`, `srs`/`scr`, numele din src fără extensie / cu altă extensie / cu dosar în față / inexistent.
5. **`EditorWebContinut.tip`** = tipul pentru motor: `tipuri:{editorweb:EditorWebContinut.tip}`.

**Abateri spuse:** imaginea se desenează din copia mică (320 px) la lățimea fișierului real, micșorată cât să încapă (`img{max-width:100%}` din `previewDoc`); în browser, o fotografie mai lată decât fereastra iese din ea. Căile absolute nu sunt simulate. Imaginea lipsă e oprită de CSP-ul paginii simulate: Chromium scrie în consolă „Refused to load the image…” — mesaj al paginii simulate (filtrat în proba mea, NU e o eroare de script).

### Pentru lecția următoare (VIII/17-19)
- Încărcați `editorweb-continut.js` după `editorweb-schelet.js` doar dacă aveți imagini; nu atinge `teste` și nici clasele CSS ale altor extensii (doar `.ewc-*` și `.br-corp.ewc-inalt`). Funcțiile de mai sus și forma `{n, imagine}` nu se schimbă. Ce vă lipsește: extensie nouă a voastră, nu modificări aici.
- `EWC.ordine(src)` e util la testele de mutare (de exemplu un rând de tabel mutat).
- **Schimbat la reparare J1 (19.10.2026):** `altBun(src)` e mai strict — respinge un `alt` dintr-un singur cuvânt („lac”, „bucura”, „Popescu_Ana_bucura”), numele fișierului cu sau fără extensie și textele făcute doar din cuvinte goale („poză”, „o imagine”, „foto”). Numele și forma rezultatului (true/false) au rămas. Dacă la voi un `alt` dintr-un cuvânt e bun, nu folosiți `altBun`.
- Testele de mutare de la mine (P4 și Î3) folosesc ordinea „paragraf gol → text fără etichete → paragraful e în pagină → o singură dată → ordinea”: primul test care pică spune greșeala făcută. Modelul e bun și pentru rândurile de tabel (VIII/17).
  **Schimbat la reparația 2 (19.10.2026, punctul N):** ordinea e acum „perechile de paragraf (`PERECHI_P`, în pagina lecției, nu în extensie) → text fără etichete → paragraful e în pagină → o singură dată → scheletul (`ORD`) → ordinea”. `PERECHI_P` caută pe etichete, nu în DOM (browserul închide singur un `<p>` și face din `</p>` singur un paragraf gol, deci DOM-ul nu mai spune ce a rămas și pe ce rând): `<p>` singur, `</p>` singur, `<p></p>`, text cu `<p>` fără `</p>`, text cu `</p>` fără `<p>`; mesajul le numește pe toate, cu rândul vecin. Pentru rândurile de tabel (`<tr>`, `<td>`) ar trebui aceeași idee, cu etichetele voastre.
- **Atenție la casete de cod pe telefon:** rândul `<img src="…" alt="…">` indentat nu încape la 390 px; am pus `alt` pe rândul următor (P6 explică: Enter în etichetă = spațiu) și `pre.rand` cu `tab-size:2; font-size:.7rem` sub 480 px.

## Regula 25 / 22 / 24 / 27 — calculatorul profesorului
- **Nimic pornit pe ecran:** niciun Notepad, Edge, Chrome, Explorer, Office. Doar Chromium din Playwright, headless, profil temporar, rețeaua blocată (doar `file:` / 127.0.0.1 / `data:`), închidere `ctx.close()`.
- **Doar citire:** `SHGetFileInfo` (tipul fișierelor, fără fișiere reale), `ro.pak`/`en-US.pak` (fișiere), `comdlg32.dll.mui`/`shell32.dll.mui` (încărcate ca date). Nicio cheie de registru scrisă, nicio setare schimbată.
- **Regula 22:** singurele cereri în afară: API-ul Wikimedia Commons și miniaturile, cu User-Agent „LearningHub-lectii/1.0 (educational site)” (două erori 429 la început, reluate după pauză).
- **Regula 24:** sondele pe pagina lecției blochează tot ce nu e 127.0.0.1 (`cereri blocate: 2` = fonturile Google); niciun elev de probă trimis.
- **Regula 27:** nicio cale cu numele contului în fișierele lecției (scripturile folosesc căi relative la `__file__`).
- Fișierele de descărcat: `bucura.jpg` e JPEG făcut cu PIL din miniatura Commons (fără EXIF); nu e fișier Office, deci `curata_metadate.py` nu se aplică.

## Porțile și probele (rulate ULTIMELE, după ultima schimbare)
**Cele mai noi: după reparația 5, rulate 24.10.2026** — secțiunea „Reparația 5 (24.10.2026)” de la sfârșit și registrul (`proba_reparatii.py` 428/0 A-AB, `j5_drumuri.py` 61/0, gesturi 148/148, test_joc TRECUT, verifica 0, date personale 0). Înainte: după reparația 3 (253/253 A-S) și reparația 4 (332/0 A-W), în secțiunile lor.
**După reparare J1 (19.10.2026), rulate din nou pe fișierele de acum:** `test_joc.py` → TRECUT (27 de întrebări; doar „1 niveluri”); `verifica_lectie.py --fara-t1` → ultima linie 0 (S0, S1 0 identice, S2 6/6, T0 0); `_proba/proba_gesturi_l16.py` (atelierul pornește acum cu Notepad gol: deschiderea cu Ctrl+O / Fișier › Deschideți) → **148 de verificări, 0 picate, 0 erori în consolă**; `_proba/proba_reparatii.py` → **96 de verificări, 0 picate, 0 erori, literele A-M** (`_proba/proba_reparatii_2.txt`); `proba_coduri_l16.py` → 0 nepotriviri; `learninghub_date_personale.py` → 0. Numerele de mai jos sunt de la autorul dintâi.
- `test_joc.py --dir lectii\viii m3-l16` → **TRECUT** (27 de întrebări jucate; doar „1 niveluri”). `_proba/iesire_test_joc.txt`
- `verifica_lectie.py … --fara-t1` → **ultima linie 0** (S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0). `_proba/iesire_verifica.txt`
- `_proba/proba_gesturi_l16.py` (gesturi reale; 1280 px mouse + tastatură, 390 px atingere + butoanele de taste): **144 de verificări, 0 picate, 0 erori în consolă** (`_proba/iesire_gesturi.txt`): fiecare „Încearcă” și „Încă un exercițiu” greșit apoi corect, mutarea cu tastele adevărate (Shift+End, Ctrl+X/C, Enter, Ctrl+V), fotografia în pagina simulată doar cu numele exact (și cu BUCURA.JPG), imaginea lipsă (16 px fără alt, > 60 px cu alt), mesajele (extensie, .jpg, </img>, </br>, ü, ghilimea), atelierul pe drumul greșit (salvat peste lecția 15) și pe cel bun (Salvați ca, dublu-clic pe fotografie = mesaj, fără filă nouă), atelierul 2, laboratorul (imaginile încărcate, casetele de cod încap), Î1-Î5, diploma; nimic mai lat decât ecranul; ținte ≥ 32 px în simulator. Capturile de telefon `_proba/_tel_*.png` privite (P5, atelierul, laboratorul).
- `_proba/proba_coduri_l16.py` → 0 nepotriviri pe cele 37 de coduri.
- `_proba/numara_cuvinte.py`: textul pașilor 80-107 cuvinte.
- `learninghub_date_personale.py` → 0.

## Ce n-am putut verifica / alegeri de semnalat
1. **Edge și Chrome reali** n-au fost porniți: desenarea paginii e probată în Chromium (același motor). Pictograma de imagine lipsă din Edge poate arăta puțin altfel; textul spune „o pictogramă mică”.
2. **Notepad real** nu s-a pornit: Ctrl+X/C/V și Fișier › Deschideți sunt din meniul real citit de L14; fereastra Deschidere a Notepad-ului (lista „Documente text (*.txt)” / „Toate fișierele (*.*)”) n-a fost văzută → textul e condițional (A17).
3. **„Fișier JPG”** e dedus din tiparul Windows (A10); pe calculatoarele din laborator tipul poate fi „Fișier JPG”, „JPG File” sau numele unui program de poze — lecția spune „ceva cu JPG”.
4. **Dublu-clic pe fotografie** (aplicația de imagini) — neprobat (A19).
5. **Cititorul de ecran** — documentar (A13).
6. Timpul: 5 pași + atelier + laborator sunt mult pentru 50 de minute. De la reparare J1: în laborator, pașii 1-6 și curățenia (ultimul pas) sunt obligatorii, pașii 7-10 încep cu „Dacă mai ai timp”, iar introducerea spune „Dacă se apropie sfârșitul orei, sari direct la ultimul pas”; „Încă un exercițiu” și atelierul 2 sunt la cerere („Cum lucrezi”).
7. Pas = idee: P3 are două etichete (`<p>` și `<br>`) pentru o singură idee („Enter-ul din Notepad nu contează; arăți tu unde începe bucata”); altfel ar fi fost 6 pași (standardul: 3-5).

## Pentru componenta comună (nu sunt ale lecției; nu le-am atins)
- `editorweb-schelet.js`, `mesajText`: mesajul pentru `=ü` spune „…apoi utf-8” și pentru alte atribute decât meta (de exemplu `alt=Ün`). Extensia mea îl acoperă pe `<img>`; pentru alte etichete (lecțiile 17-19: `border=`, `href=`) mesajul ar fi greșit — de generalizat de proprietar.
- `editorweb.js`, `tipExplorer`: `.html` = „Microsoft Edge HTML Document” fix; pe calculatorul de lucru e acum „Chrome HTML Document” (`sonda_texte.json`). Lecția 14 spune deja „ceva cu HTML”.
- `editorweb.js`, fereastra Deschidere: pornește pe „Documente text (*.txt)” (lista `TIPURI`), ca în Notepad-ul clasic; în Notepad din Windows 11 nevăzut (A17). Lecția mea o spune prudent („dacă pagina ta nu apare în listă…”).
- `editorweb-schelet.js`, `ES.ordine` (reparația 5, de la judecata 5, punctul X): primește conținut după `</body>` / `</html>` și înainte de `<body>` (probat: `_proba/r5_unitar.txt`, `[X-info]` → `[True, True, True]`). Testele de schelet care se bazează doar pe el (al lecției 15, ale lecțiilor VIII/17+) bifează o pagină cu un paragraf după `</body>`. În lecția 16 îl acoperă `NEATINS` (pașii) și `afaraCorp` (atelierul); de reparat de proprietar.

## Reparațiile după judecata 1 (19.10.2026)
Autor proaspăt, după judecata opus (0 GRAV / 4 MAJOR / 8 MINOR) și sonnet (0 / 0 / 5). Registrul cu toate punctele, citatele și reparațiile: **`_verificare/registru_j1.md`** (13 puncte, A-M, toate REPARATE). Proba fiecărei reparații: `_proba/proba_reparatii.py` → `_proba/proba_reparatii_2.txt` (96 de verificări, 0 picate, 0 erori, la 1280 px cu mouse și taste reale și la 390 px cu atingere; plus Chromium pe fișiere locale pentru D, J, M).

Ce s-a schimbat în pagină:
- **P4 Încearcă (A):** testele în ordinea „paragraf gol → text fără etichete (citat) → paragraful e în pagină → o singură dată → ordinea”; pe drumul „mutat doar textul” mesajul spune adevărul, iar urmând mesajele elevul ajunge la „Corect!”. Î3 la fel (paragraful gol întâi).
- **P5 (B, L, M):** „Altfel” = biletul pentru colegul de bancă (caută doar pe banca voastră → pe bilet nu scrii unde e; „cu spirală” = extensia); regula din pas spune „în src scrii doar numele, fără dosar: bucura.jpg, nu Documente/bucura.jpg”; `<img>` scris înăuntrul `<p>` e respins (în Chromium, la 1280 px, fotografia stă atunci lângă text, nu sub el: A23).
- **P6 + atelier (E):** `altBun` mai strict (vezi „Pentru lecția următoare”); mesajele spun „câteva cuvinte despre ce se vede, nu „poză” sau numele fișierului”; P6 spune „în câteva cuvinte”.
- **Atelier (C):** pornește cu Notepad gol; punctul 1 predă **Fișier › Deschideți (Open) / Ctrl+O**, fereastra Deschidere, Toate fișierele (*.*), butonul Deschidere; test nou „Pagina de la lecția 15 e deschisă în Notepad” (pe jurnalul simulatorului, `deschis_notepad`). Laboratorul, pasul 2, le reia „ca în atelier”, cu „(Open)”.
- **Laboratorul (D, H, I, J, K):** introducerea spune ce e obligatoriu (pașii 1-6 și curățenia) și „sari direct la ultimul pas”; pasul 1: fotografia de salvat fără legătură în jur, „în pagina lecției, deasupra acestor pași”; pasul 3: „există deja” → Nu + cifră; pasul 6: întâi „e fotografia în Documente?” → Descărcări → mutare cu Ctrl+X / Ctrl+V (clasa a V-a, L10), apoi numele exact și scăparea pentru coloana Tip (L14); pașii 7-10 „Dacă mai ai timp” (experimentul, mutarea, copierea + ștergerea copiei, `<br>`); pasul 11 curățenia, „oricum”.
- **Î2 (F):** mesajul nu mai spune „zilele stau tot într-un singur paragraf” pe drumul cu trei paragrafe.
- **P2 (G):** legenda capturii spune doar ce se vede (fără h5/h6).
- „Ai nevoie de”, `profil.json`: plus clasa a V-a, L10 (mutarea unui fișier); Fișier › Deschideți trece la „nu_stie” (predat aici).
- `afirmatii.json`: A05, A06, A16, A17, A18 actualizate; noi A21 (fotografia mutată din Descărcări), A22 (Tip în caseta mică), A23 (`<img>` în `<p>`).

**Pentru lecția următoare:** API-ul extensiei NU s-a schimbat ca nume sau formă; s-a schimbat doar ce primește `altBun` (mai strict). Granița: `m3_19_10/granite/viii_l16.md`, rândul „Reparare J1”.

**Nesigur, scris prudent (neschimbat la reparația 2):** fereastra Deschidere a Notepad-ului din Windows 11 (A17: lista de tipuri; Notepad din Magazin nu s-a pornit nici azi); meniul Edge pe imaginea fără legătură (dedus din capturile V/15); caseta cu tipul (A22, ca la L14).

## Reparația 2 (19.10.2026)
Autor proaspăt, după judecata 2 (opus: 13/13 puncte din registru ÎNCHISE; noi: N MAJOR, O, P, Q MINOR). Registrul, cu citatele, reparațiile și dovezile: **`_verificare/registru_j1.md`, secțiunea „Reparația 2”**. Copia fișierelor dinainte: `_proba/inainte_r2/`.

Ce s-a schimbat:
- **N, P4 și Î3 (selecțiile imprecise cu mouse-ul):** testul nou `PERECHI_P` e primul: caută pe etichete, cu rândul, `<p>` singur, `</p>` singur, `<p></p>`, text cu `<p>` fără `</p>` și text cu `</p>` fără `<p>`; mesajul le numește pe toate și spune unde („Sub rândul `<h2>Drumul</h2>` a rămas un rând cu doar `</p>`: șterge-l.”). `FARA_LIBER` spune doar ce lipsește; `ORD` stă înaintea testului de ordine. La fel la „Încă un exercițiu” din P4 (ștergere, copiere). Probat: 26 de drumuri × 2 lățimi (`_proba/proba_reparatii.py`, [N]); fiecare mesaj adevărat, urmat întocmai → Corect.
- **O, `altBun`:** respinge și umpluturile („o poză frumoasă”, „foarte frumos”, „nu știu”, „asta e o poza”); alturile bune scurte („Lacul Bucura”, „Lacul Bucura vara”, „un lac”) rămân primite; „Lacul-Bucura” = două cuvinte. 52 de variante: `_proba/r2_altbun_inainte.txt` (15 nepotriviri) → `r2_altbun_dupa.txt` (0).
- **P, P5:** `<img>` scris în `<p>` → mesajul spune că aici, în browserul îngust, pare sub text, că într-o fereastră lată stă lângă text (A23) și de ce exercițiul o vrea după `</p>`.
- **Q, laboratorul:** introducerea spune ce faci cu întrebările dacă sari la ultimul pas: după curățenie sau ora viitoare, cu **Continuă de unde ai rămas** și **La verificare** (A24, probat la 1280 și 390).
- `afirmatii.json`: A23 completată (browserul simulat), A24 nouă.

**Pentru lecția următoare:** API-ul `editorweb-continut.js` NU s-a schimbat ca nume sau formă; `altBun` primește mai puțin (umpluturile). `PERECHI_P`/`bucati` sunt în pagina lecției, nu în extensie. Granița: `m3_19_10/granite/viii_l16.md`, rândul „Reparația 2”.

**Porțile, după reparația 2:** `proba_reparatii.py` 178/178, 0 erori, literele A-Q (`_proba/r2_proba_reparatii_3.txt`) · `proba_gesturi_l16.py` 148/148, 0 erori · `proba_coduri_l16.py` 0 · `test_joc.py` TRECUT (27 de întrebări) · `verifica_lectie.py --fara-t1` → 0 · `learninghub_date_personale.py` → 0. Ieșirile: `_proba/r2_*.txt`.

## Reparația 3 (19.10.2026)
Autor proaspăt, după judecata 3 (opus: N, P, Q ÎNCHISE; O rămas DESCHIS; noi: R MAJOR, S MINOR). Doar R, O, S. Registrul, cu citatele, reparațiile și dovezile: **`_verificare/registru_j1.md`, secțiunea „Reparația 3”**. Copia fișierelor dinainte: `_proba/inainte_r3/`.

Ce s-a schimbat:
- **R, P4 și Î3 (selecțiile care TAIE o etichetă):** `bucati()` caută întâi resturile de etichetă („<”, „<p”, „</”, „</p”, „p>”, „/p>”, „>”, „<p/p>”); mesajul le spune primele, cu rândul și locul („… la început, a rămas o bucată de etichetă: `p>`. Șterge-o.”), apoi celelalte bucăți, socotite pe sursa fără resturi. Titlul tăiat la capăt de rând (`</h2`): „scrie `>` după ea”. La ștergere s-a adăugat testul de text fără etichete; la copiere, „Copiază (Ctrl+C, nu Ctrl+X)” apare doar când jos chiar nu mai e paragraful.
- **O, `altBun`:** respinge și „cea mai tare poză”, „wow ce frumos”, „o pozică frumușică” (diminutivele), „IMG 2034” (cuvintele cu cifre nu se socotesc), „poză de vacanță”, „fără titlu”; alturile bune scurte rămân primite.
- **S, P5:** mesajul spune ce se vede după locul real al lui `<img>` în `<p>`: deasupra textului (la început), rupe textul (între cuvinte), un paragraf fără text (singură în `<p>`), sub text, lipită (după text, mesajul de la P). A23 completată.

**Pentru lecția următoare:** API-ul `editorweb-continut.js` NU s-a schimbat ca nume sau formă; `altBun` primește mai puțin (umpluturile de mai sus și cuvintele cu cifre). `bucati`/`resturi`/`PERECHI_P`/`COPIA_SUS` stau în pagina lecției, nu în extensie.

**Limită știută (nu e în R):** la ștergere, dacă elevul șterge doar o parte din text („Text de probă” și rămâne „, de șters.”), mesajul e „Șterge doar paragraful de probă.” (neschimbat). Resturile din alte etichete decât `p` și `h1`-`h6` nu sunt căutate (exercițiile P4 și Î3 nu au altele).

**Probele și porțile, după reparația 3** (agentul din 19.10 a scris codul, dar a murit înainte de probe și registru; rulate din nou la terminare, noaptea 23→24.10.2026, pe fișierele neschimbate de la 19.10; detaliul pe puncte: registrul, „Reparația 3”):
- `_proba/proba_reparatii.py` → **253 de verificări, 0 picate, 0 erori, literele A-S**: [R] 24 de drumuri × 2 lățimi (1280 taste reale, 390 atingere), [O] 23, [S] 16 (`_proba/r3_proba_reparatii_3.txt`).
- Probele judecătorului: `_verificare/j3_n.py mijloc` → 20 de drumuri, 0 picate (la J3: 20 picate); `j3_n.py` → 50, 0 picate; `j3_opq.py` → 64, 0 picate (la J3: 8) — `_proba/r3_j3_n_mijloc.txt`, `r3_j3_n.txt`, `r3_j3_opq.txt`.
- `altBun`: `_proba/r3_altbun.py` (nou) → 96 de variante (52 ale reparației 2 + 30 ale judecătorului 3, cu cele 6 care treceau + 14 noi), 0 nepotriviri (`_proba/r3_altbun.txt`).
- `proba_gesturi_l16.py` → 148/148, 0 erori (`r3_gesturi.txt`; rulată în paralel cu alte probe a dat o dată 1 picat — imaginile laboratorului neîncărcate în 500 ms, sub sarcină: `r3_gesturi_paralel.txt`) · `proba_coduri_l16.py` → 0 nepotriviri (37 de coduri) · `test_joc.py` → TRECUT (27 de întrebări) · `verifica_lectie.py --fara-t1` → ultima linie 0 · `learninghub_date_personale.py` → 0. Ieșirile: `_proba/r3_*.txt`.
- CRLF: `index.html` 544/544, `editorweb-continut.js` 279/279. `editorweb.js`, `editorweb-schelet.js`, `editorweb-tabele.js`, motorul: neatinse (`git diff` gol).

## Reparația 4 (24.10.2026)
Autor proaspăt, după judecata 4 (opus: R ÎNCHIS; O, S DESCHISE; noi: T, U, W MAJOR, V MINOR). Registrul, cu citatele, reparațiile și dovezile: **`_verificare/registru_j1.md`, secțiunea „Reparația 4”**. Copia fișierelor dinainte: `_proba/inainte_r4/`.

**Decizia dirijorului: structural, nu cazuri noi.** Principiul stă în capul codului din `index.html`: un mesaj de verificare spune numai ce e sigur adevărat; când nu poate fi sigur, spune mai puțin (ce rând s-a schimbat) și cum te întorci (Ctrl+Z până revine, sau „Ia de la capăt”; pe telefon doar butonul).

Ce s-a schimbat:
- **T, U, V, W — testul nou `NEATINS`, PRIMUL în P4 (mutare, ștergere, copiere), P5 și Î3:** restul paginii (titlurile, celelalte paragrafe, scheletul, `<body>`, `</body>`) trebuie să fie cum era la început, comparat pe etichete și texte (spațiile și Tab-urile nu contează). Mesajul numește rândul („Ai schimbat și rândul `<h2>Drumul</h2>`.”, „Ai șters și rândul `<h2>Lacul Bucura</h2>`.”, „Rândul `</body>` apare acum de două ori…”, „Rândul … nu mai e la locul lui.”), apoi drumul înapoi și ce face din nou.
- **Butonul „Ia de la capăt”** lângă Verifică, la aceste exerciții: pune sursa de început a exercițiului. Îl pune lecția (`TIP_L16` în jurul lui `EditorWebContinut.tip`), nu simulatorul.
- **Testele zonei rămân** (resturi, `PERECHI_P`, `FARA_LIBER`, ordinea, `COPIA_SUS`, `IMG_SUB_P`), dar o bucată de text care nu e textul întreg al unui paragraf de la început nu mai primește „scrie `<p>` înainte de el”: doar ce e sigur + drumul înapoi. Ultimul test (`DIFERIT`) spune numai ce e în plus / lipsește / apare de prea multe ori față de rezolvare. U: testul „Celelalte două paragrafe au rămas” a plecat (dădea Corect cu titlul șters). `resturi` cunoaște și bucățile de titlu („2>”, „h2>”, „/h2>”, „<h”, „</h”) din copii.
- **P5:** + `PERECHI_P` (Enter în `</p>` rupea eticheta și `<img>` dispărea într-un comentariu) și mesaje pentru fotografia pusă deasupra paragrafului / de mai multe ori.
- **O:** regula POZITIVĂ `altLac` în `index.html` (P6, atelier, Î5): textul alternativ trece de `EWC.altBun` ȘI are un cuvânt din ce se vede în fotografia reală (lac, Bucura, munte / munți, apă, cer, nori, stânci, pietre, iarbă, plante, licheni, vârfuri, peisaj, Retezat…; fără brazi / pădure, care nu se văd). Mesajul: „În `alt="…"` scrie ce se vede în fotografie, în câteva cuvinte (ex. „Lacul Bucura între munți”).”
- **S:** mesajele pentru `<img>` la începutul paragrafului și între cuvinte spun și „(într-o fereastră lată, fotografia poate sta chiar pe același rând cu textul)” — probat în Chromium la 1280 (A25).
- Afirmații noi: A25 (fereastra lată), A26 (Ctrl+Z și butonul, în zona de scris a simulatorului).

**Pentru lecția următoare (VIII/17-20):** API-ul `lectii/_sim/editorweb-continut.js` NU s-a schimbat deloc (fișierul e neatins la reparația 4: `altBun` primește ce primea). `NEATINS`, `DIFERIT`, `altLac`, butonul „Ia de la capăt” și `TIP_L16` stau în pagina lecției 16; cine vrea aceeași regulă o copiază în pagina lui (sau o cere ca extensie nouă).

**Probele și porțile, după reparația 4** (rulate ULTIMELE, pe rând, după ultima schimbare din `index.html`; ieșirile în `_proba/r4_*.txt`):
- `_proba/proba_reparatii.py` (complet) → **332 de verificări, 0 picate, 0 erori în consolă, literele A-W** (`r4_proba_reparatii_toate.txt`); doar reparația 4 (`… r4`) → 79/79 (`r4_proba_reparatii_dev2.txt`): [T] 32, [U] 10, [V] 10, [W] 8 — drumurile J4 (M10, M11, D06, D07, Q05, D08, C06, Q07) + **20 de selecții imprecise noi** (P4 mutare N01-N06, ștergere N07-N10, copiere N11-N14, P5 N15-N17, Î3 N18-N20), fiecare la 1280 (taste reale, Ctrl+Z ca tastă) și la 390 (atingere, butonul): mesajul adevărat (judecat de `r4_adevar`, pe sursa de început), urmat întocmai → sursa de început → refăcut → Corect, sau direct Corect (N04, N10, N18 din prima; N06, N11, N14, N15, N17 pe mesajele zonei, în 2 verificări), cu sfârșitul curat (o dată `</body>`, nicio bucată de etichetă, ordinea = rezolvarea, butonul dispărut); [O] altLac pe 5 seturi + tastat în P6; [S] mesajele + Chromium 1280.
- Probele judecătorilor: `_verificare/j4_r.py` → **72 de drumuri, 0 picate** (la J4: 16 picate) · `j3_n.py mijloc` → 20/0 · `j3_n.py` → 50/0 (`r4_j4_r.txt`, `r4_j3_n_mijloc.txt`, `r4_j3_n.txt`).
- `_proba/r4_altbun.py` → 176 de rânduri (52 + 96 + 18 J4 + 10 noi), 0 nepotriviri (`r4_altbun.txt`).
- `proba_gesturi_l16.py` (singură) → 148/148, 0 erori · `proba_coduri_l16.py` → 37 de coduri, 0 nepotriviri · `r4_captura.py` → capturile `_proba/r4_tel_p4_capat.png` (privită: mesajul și cele două butoane, „Verifică” și „Ia de la capăt”, încap la 390 px, fără derulare laterală) și `r4_lat_p4_capat.png`, 0 erori.
- `test_joc.py --dir …/lectii/viii m3-l16` → TRECUT (27 de întrebări) · `verifica_lectie.py … --fara-t1` → S0, S1, S2, T0 TRECUT, ultima linie 0 · `learninghub_date_personale.py` → 0.
- CRLF: `index.html` 660/660. `editorweb-continut.js`, `editorweb.js`, `editorweb-schelet.js`, `editorweb-tabele.js`, motorul: neatinse (`cmp` cu copia, `git status` gol). Fără commit, fără publicare.

**Nesigur / de știut:** (1) Pe telefon, capetele selecției le pun cu `setSelectionRange` (ca J2-J4); butonul „Ia de la capăt” e atins de-adevăratelea. (2) Ctrl+Z e probat în zona de scris a simulatorului (textarea în Chromium), nu în Notepad-ul adevărat — mesajele lui sunt doar în pagină. (3) „Limita știută” de la reparația 3 („Șterge doar paragraful de probă.” la ștergerea parțială) nu mai există: o bucată rămasă e „doar o bucată de text” + drumul înapoi, iar testul vechi a plecat. (4) Pe drumul cu o bucată de text, elevul face 2 verificări (mesajul, apoi Corect după ce o ia de la capăt); înainte făcea 3, cu un paragraf greșit pe drum.

## Reparația 5 (24.10.2026)
Autor proaspăt, după judecata 5 (opus: T, U, W, V, O, S ÎNCHISE; noi: X, Y MAJOR; Z, AA, AB, AC MINOR). Registrul, cu citatele, reparațiile și dovezile: **`_verificare/registru_j1.md`, secțiunea „Reparația 5”**. Copia fișierelor dinainte: `_proba/inainte_r5/`.

**Principiul reparației 4 e EXTINS, nu schimbat** (scris în capul codului din `index.html`): un mesaj spune numai ce e sigur adevărat — acum și (1) la capetele scheletului: NEATINS cere ca înainte de `<body>` și după `</body>` să fie doar scheletul de început; (2) la toate mesajele vechi: niciunul nu mai spune ce taste a apăsat sau ce a făcut elevul („l-ai copiat (Ctrl+C)”, „l-ai decupat (Ctrl+X)”, „ai luat doar textul”), doar starea paginii; (3) la calculator, un singur drum înapoi: „Ctrl+Z … până pagina e iar cum era la început”.

Ce s-a schimbat:
- **X:** `NEATINS` (P4 mutare / ștergere / copiere, P5, Î3) verifică și capetele scheletului. Mesajul: „Sub rândul `</body>`, în afara corpului paginii, a ajuns `<p>Apa era rece și limpede.</p>`. Chiar dacă browserul îl arată la sfârșitul paginii, locul lui în cod e greșit: tot ce se vede în pagină se scrie între `<body>` și `</body>`. Mută-l mai sus, înainte de `</body>`, acolo unde îl cere exercițiul. Altfel, ca să pornești din nou curat, …”. Rândul numit e cel de deasupra bucății („Sub rândul `</html>`”, „Sub rândul `</head>`”) sau cel pe care stă lipită („Pe rândul `</body><p>…`”). Fapt nou, probat în Chromium (A27): browserul mută singur în corp ce stă după `</body>` / `</html>` (ultimul) sau înainte de `<body>` (primul) — de aceea testele pe DOM nu vedeau greșeala, iar mesajul NU spune „nu se vede”.
- **Y:** testul „Paragraful despre apă apare o singură dată (mutat, nu copiat)” a plecat; dublura o spune `DIFERIT`: „Paragraful „Apa era rece și limpede.” apare de două ori, dar în pagina cerută apare o dată. Păstrează-l pe cel care stă imediat sub `<h2>Lacul Bucura</h2>` și șterge-l pe celălalt, întreg, de la `<p>` până după `</p>`. Altfel, ca să pornești din nou curat, …” (merge și la Î3, cu `<h2>Bilete</h2>`). Copierea: „Jos nu mai e paragraful „Pagina clasei a VIII-a A”, iar exercițiul îl vrea și sus, imediat sub `<h1>`, și jos, după `<p>Am urcat trei ore pe munte.</p>`. Copiază paragraful de sus…”. Rescrise pe stare și: `FARA_LIBER`, why-urile de la P4 (3) și Î3, două mesaje din atelier, laboratorul (pașii 2 și 6).
- **Z:** `CAPAT_INAPOI` și `NEATINS`, la 1280: „Apasă Ctrl+Z de câte ori trebuie, până pagina e iar cum era la început, sau butonul Ia de la capăt…”. A26 la zi.
- **AA:** `resturi` numește întreagă bucata care începe un nume de etichetă: „`</bo`”, „`</b`”, „`</body`” (fără `>`), „`<im`” (`NUME_ET`).
- **AB:** `VEDE` (în `altLac`) + iezer, tău, pajiște, alpin, mal, luciu, oglinda, apelor, grohotiș, vegetație, versant, lacustru, glaciare; mesajul de respingere fără „cuvinte la întâmplare”.
- **AC (proba judecătorilor):** `_verificare/j3_n.py`, bloc „ADĂUGAT la reparația 5” (detaliat în registru).
- **`ce`-uri redenumite** (același sens): `COPIA_SUS` („Copia stă imediat sub <h1>, iar paragraful „Pagina clasei a VIII-a A” a rămas și jos, la sfârșit”) și `DIFERIT` la Î3 („Ordinea: „Program”, paragraful despre program, „Bilete”, paragraful despre bilet, o singură dată”). Motivul: antetul „Testul care nu trece încă: Paragraful …” era citit de judecătorul de adevăr din `j5_drumuri.py` ca o propoziție de judecat („?”). `NEATINS`: „Restul paginii e cum era (titlurile, celelalte paragrafe, scheletul), iar tot ce se vede stă între <body> și </body>”.

- **Atelierul (tot X):** testul de schelet al atelierului cere acum și „tot ce se vede stă între <body> și </body>” (`afaraCorp`, în pagina lecției): o pagină salvată cu un paragraf după `</html>` primește „În afara lui <body>…</body> a ajuns `<p>…</p>`. Chiar dacă browserul îl arată, locul lui în cod e greșit…”.
- **AA, încă un loc:** `PERECHI_P` are `faraDiagnostic:true` — pentru o copie care a luat „</body” fără „>”, diagnosticul lecției 15 („După </body trebuie semnul >”) înlocuia mesajul lecției și, urmat, făcea al doilea `</body>`.

**Pentru componenta comună:** `ES.ordine` primește conținut în afara corpului — notat mai sus, în secțiunea „Pentru componenta comună”; nereparat (componenta e a VIII/15, publicată).

**Pentru lecția următoare (VIII/17-20):** API-ul `lectii/_sim/editorweb-continut.js` NU s-a schimbat (fișierul e neatins la reparația 5; `cmp` cu `_proba/inainte_r5/`). `NEATINS` (cu capetele scheletului), `DIFERIT`, `altLac`, `resturi` și butonul „Ia de la capăt” stau în pagina lecției 16.

**Probele și porțile, după reparația 5:** în registru, secțiunea „Reparația 5”, ultimul paragraf (`proba_reparatii.py` 428/0 A-AB; `j5_drumuri.py` 61/0; `j5_bloc.py` 34/0; `j4_r.py` 72/0; `j3_n.py` 50/0 și `mijloc` 20/0; `j5_extra.py` 39 OK + 2 = excepția harness-ului judecătorului în [S], ca la el; gesturi 148/148; coduri 0; test_joc TRECUT; verifica 0; date personale 0).

**Nesigur / de știut (reparația 5):** (1) Pe telefon, capetele selecției le pun cu `setSelectionRange` (ca J2-J5). (2) Ctrl+Z e probat în zona de scris a simulatorului, nu în Notepad-ul adevărat. (3) Faptul „browserul mută în corp ce stă după `</body>`” e probat în Chromium (motorul lui Edge și Chrome); Edge real n-a fost pornit (regula nopții). (4) Mesajul X e lung (≈ 90 de cuvinte cu drumul înapoi); la 390 px încape cu butoanele sub el (captura privită).

