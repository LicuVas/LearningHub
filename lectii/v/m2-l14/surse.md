# Lecția 14, clasa a V-a — surse, probe și ce n-am putut verifica (11.10.2026, tura de noapte)

## Programa și planul
- `Info_Gimnaziu_2026\planificari\Calendar_ore_5AM_5M.md`, r. 22: „18.12.2026 | 14 | M2 | Navigarea pe web. Căutarea informațiilor cu motoare de căutare | predare”.
- `Info_Gimnaziu_2026\data\unitati.json`: V-U3 „Internetul ca sursă de documentare”, CS.1.3; lecția 14 cu materiale „teorie, exercitii”. Ora 15 = salvarea + drepturile de autor; ora 16 = „Siguranța pe Internet: pericole, reguli, credibilitatea surselor”; ora 17 = evaluare.
- `Proiectul_unitatii_V-U3.md`: descriptorii De bază / Consolidat / Avansat ai CS.1.3 (navighează, caută, salvează…).
- `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, CS.1.3: conținuturile declarate în pagină, copiate exact: „Serviciul World Wide Web:”, „- navigarea pe Internet;”, „- căutarea informațiilor pe Internet utilizând motoare de căutare;”.
- Activitatea profesorului (`data\activitati_lectii_V_VI.json`, V/14): „Concurs de căutare: aceeași întrebare, trei formulări … (cuvinte-cheie, ghilimele, limbă, filtrare)” → atelierul (trei formulări + „Încă una” în engleză + „Încă una” cu fila Știri) și pasul real (aceleași formulări, plus engleza).

## Granița cu vecinii (deciziile mele)
- **Lecția 13** (scrisă în paralel; citită pe disc la 11.10 noaptea): definește `browser` („se citește „brauzăr””, Edge, Chrome), `adresă web`, `site`, `pagini web`. Lecția 14 reia definiția browserului (cu aceeași pronunție: am schimbat „brauzer” → „brauzăr” ca să nu contrazic lecția 13) și NU presupune bara de adrese.
- **Lecția 15**: salvarea, sursa, drepturile de autor, licențele, căutarea imaginilor cu licență — NU apar aici. Fila „Imagini” a motorului e doar pomenită ca filtru (fără salvare).
- **Credibilitatea surselor**: e la ora 16 (`unitati.json`; jocul documentare-v o are la N6 = lecția 16, `jocuri\ACOPERIRE.md`). La 14 spun doar cum alegi un rezultat: titlul, adresa (pe ce site e pagina), descrierea, Sponsorizat = reclamă.
- **NU se predau**: favoritele, istoricul, descărcările, conturile; operatorul minus (jocul îl are la N3; lecția doar nu-l predă, nu-l contrazice).

## „Caietul”: ce presupun lecțiile publicate și unde e acoperit (bife)
Extras cu `_proba\extrage_caiet.py` → `_proba\caiet_v.txt`.
- [x] clic, mișcarea mouse-ului, litere (presupus, standard) — folosit peste tot.
- [x] lecția 1 — cum lucrezi pe pași, „Încearcă tu”, „Verifică”, bara de jos — „Cum lucrezi”.
- [x] lecția 2 — calculatorul comun; nimic stricat — pasul real: doar file noi, închise la sfârșit; nimic salvat, niciun cont.
- [x] lecția 8 — fereastra și X — P3 „Uite cum”: X pe fereastra browserului închide toate filele, deci și lecția.
- [x] lecția 8 — Paint, sistemul de operare — P2 Încearcă (distractori).
- [x] lecția 9 — Explorer și bara lui de adresă (calea) — P4 „Uite cum”: diferența față de bara de adrese a browserului.
- [x] lecția 9 — Esc — nefolosit (în lecție nu se cere Esc).
- [x] lecția 13 — browser, adresă web, site — „Ai nevoie de”, P2, P4.
- Termeni noi, predați înainte de folosire (T0 al verificării: 0): browser, filă, bara de adrese, Enter, legătură, Înapoi, Înainte, Reîmprospătare, motor de căutare, rezultat, cuvinte-cheie, ghilimele, Shift, AltGr, Ctrl (doar în „Uite cum” la Ctrl+T), Sponsorizat.

## Faptele despre Microsoft Edge — probate în Edge-ul REAL, fără să ating nimic al profesorului
Edge 154/155, Windows 11 în română. Scripturile: `_proba\edge_ascuns_interior.py` (ro / en), `edge_capturi_interior.py`, `edge_ultima_fila_interior.py`; rezultatele: `edge_ascuns_ro.json`, `edge_ascuns_en.json`, `edge_capturi.json`, `edge_ultima_fila.json`; capturile brute în `_proba\edge_capturi\`.
- Rulat DOAR prin `C:\00\AI_0\tools\hidden_desktop.py run --desktop LH_V14`: Edge pornit SUSPENDAT, desktopul citit din PEB înainte de prima instrucțiune, paza la 20 ms pe desktopul „Default” (nicio alarmă în 6 rulări).
- Profil TEMPORAR `_proba\edge_profil_*` (`--user-data-dir`, `--no-first-run`), șters după fiecare rulare (`sterge_profil.py`); NICIODATĂ profilul profesorului. Edge-ul profesorului nu rula (tasklist înainte și după: niciun msedge.exe).
- Rețeaua: `--host-resolver-rules "MAP * ~NOTFOUND, EXCLUDE 127.0.0.1"` (la capturi, și `MAP www.biblioteca-exemplu.ro 127.0.0.1:<port>`): Edge a ajuns doar la serverul meu local cu paginile din `_proba\edge_pagini\`. Căutarea „arici hrana” a rămas la eroarea DNS (nu a plecat spre Bing).
- Oprit DOAR PID-ul meu și urmașii lui (handle-ul procesului ținut deschis, ca PID-ul să nu poată fi refolosit).
- Tastele: trimise ca taste (WM_CHAR / WM_KEYDOWN Enter, Delete, Esc) ferestrei Edge; clicul în bara de adrese = mesaj de mouse; butoanele: UI Automation (Invoke / Select). Shift și Ctrl nu se pot trimite ca mesaje: Ctrl+T e luat din AcceleratorKey și din sfat.
- Ce a ieșit: vezi `afirmatii.json` A05–A26 și `_proba\stare_autor.md` („Fapte probate”). Pe scurt: „Înapoi” / „Reîmprospătare” / „Filă nouă” / „Închideți fila” / „Bara de adrese și de căutare” (EN Back / Refresh / New Tab / Address and search bar); → Înainte apare abia după Înapoi (nume accesibil RO „Redirecționare”); clic în bara de adrese = selectează tot; fila nouă = bara goală, cu cursorul în ea; cuvinte + Enter → `https://www.bing.com/search?q=…`; X cu 2 file = se închide fără întrebare; × pe ultima filă = se închide fereastra.
- Bara de informare a lui Edge despre semnalizatorul `--host-resolver-rules` (nu există la elevi) am închis-o înainte de capturi.

## Motorul de căutare — probat pe Bing real, în Chromium headless, fără cont
`_proba\sonda_motoare.py`, `sonda_motoare2.py`, `sonda_motoare3.py` → `.json` + `_proba\motoare\*.png`. Context nou (temporar), locale ro-RO, User-Agent obișnuit de Edge (fără nicio dată personală; cu „HeadlessChrome” Bing dădea rezultate fără legătură). Căutări neutre: „iezi capra trei”, „capra cu trei iezi”, „arici hrană”, o propoziție lungă despre arici.
- Ghilimelele drepte: `"iezi capra trei"` → 0 rezultate web; fără ghilimele → 9-10/10 despre „Capra cu trei iezi”. Ghilimelele românești `„…”` → ca fără ghilimele (Bing nu le ia drept ghilimele). Ghilimelele englezești `“…”` → 0, ca cele drepte.
- Surse oficiale (`_proba\surse_web.py` → `surse_web.json`, User-Agent neutru):
  - Bing, „Advanced search options”: https://support.microsoft.com/en-us/topic/advanced-search-options-b92e25f1-0085-4271-bdf9-14aaea720930 — „" " Finds the exact words in a phrase”.
  - Google, „Rafinează căutările pe Google”: https://support.google.com/websearch/answer/2466433?hl=ro — „Pentru a căuta o potrivire exactă pentru un cuvânt sau o expresie: introdu un cuvânt sau o expresie între ghilimele “””.
- Google headless: blocat („sorry”) la unele căutări → nicio afirmație despre Google în afară de „e un motor de căutare”.
- Filele Bing RO: Toate, Mod De Inteligență Artificială, Imagini, Videoclipuri, Hărți, Știri, Cumpărături. Reclamele: „Sponsorizat”.

## Tastatura (ghilimelele drepte)
- `_proba\sonda_tastatura.py`, `sonda_legatura.py` (doar citire: aranjamentele DEJA încărcate în sesiune, `GetKeyboardLayoutList` + `VkKeyScanExW`): Romanian (Standard) — tasta de lângă Enter scrie ț / Ț (cu Shift); `"` = Shift + AltGr + aceeași tastă; `„` = tasta de sub Esc. United States-International — `"` = Shift + tasta de lângă Enter, dar e TASTĂ MOARTĂ (vezi „Nesigur”).
- Aceeași regulă ca în lecția VIII/15 (cum-fac `web-ghilimele`): „[Shift] + tasta de lângă [Enter] (pe tastatura românească, [Shift] + [AltGr] + aceeași tastă)”.

## Legătura (cursorul mână)
- `_proba\sonda_legatura.py`: o legătură fără niciun stil, în Chromium 148 (motorul lui Edge): cursor `pointer` (mâna), culoare `rgb(0,0,238)`, subliniată; textul obișnuit: cursor `auto`.

## Lecțiile și jocurile folosite
- `lectii\v\m2-l09\index.html` (modelul: structură, `fig`, schema, pasul din laborator), `lectii\v\m2-l13\index.html` (definițiile lecției 13).
- `jocuri\documentare-v` N2 „Navighez pe web” și N3 „Caut ca un detectiv” (ACOPERIRE: 14 = N2, N3, N7): am refolosit ideile (browserul de probă, metoda cuvintelor-cheie, ghilimelele, reclamele), dar simulatorul e scris din nou, după Edge-ul real. Neconcordanțe ale jocului cu Edge-ul probat, de știut: butonul „Reîncarcă” (în Edge: „Reîmprospătare”), butonul „Enter” lipit de bară (Edge n-are), săgeata → mereu vizibilă (în Edge apare doar după Înapoi), exemplul „somnoroase păsărele” cu un cântec în altă ordine (inventat, neprobat pe un motor real). Nu am atins jocul.
- `cum-fac\_sursa\fise_windows_web.json`: aceeași formă pentru gesturile din laborator (filă nouă cu +, adresa `learninghub-8z6.pages.dev/lectii/<clasa>/` + Enter, ca la VIII/1).

## Imagini (detaliul în `img\SURSE.json`)
- 5 capturi Edge (română, desktopul ascuns, pagini de probă servite local sub numele inventat www.biblioteca-exemplu.ro) și 2 capturi Bing (headless) — decupate și micșorate de `_proba\fa_imagini.py`; chenarele roșii sunt puse de noi. Pe capturile Edge, lângă adresă scrie „Nesigur” (pagina de probă nu e https) — legenda o spune.
- Pasul 0: „Copyright Card Catalog Drawer.jpg”, Michael Holley (Swtpc6800), Wikimedia Commons, **domeniu public** (citit pe pagina fișierului prin API, `_proba\commons_descarca.json`), micșorată la 800 px (93,5 KB).

## Simulatorul `lectii\_sim\browser-web.js` (NOU, proprietar: lecția aceasta)
- Tipuri: `browser` (`SimBrowserWeb`) și `cautare` (`TipCautare`). Documentația e în capul fișierului (ce e adevărat, abaterile spuse pe ecran, câmpurile, testele, operațiile).
- Motorul simulat, probat fără browser: `node _proba\test_motor_sim.js` → ultima linie 0 (13 căutări + 15 verificări de căutare, cu așteptările scrise înainte).
- Abateri de la Edge, spuse elevului pe ecran: un browser mic, cu site-uri inventate; Ctrl+T / Ctrl+W lucrează pe browserul adevărat (în pagină se folosesc + și ×); pe telefon, butonul „Enter ↵” lângă bară. Ctrl+R / F5 / Alt+← / Alt+→ sunt prinse de simulator (proba la 1280: lecția nu s-a reîncărcat).

## Pentru lecția următoare (V/15: salvarea textului și a imaginilor, sursa, licențele)
- Folosește `BrowserWeb.creeaza({site:{…pagini noi…}, extensii:[ext]})` → un tip nou (de ex. `browserSalvare`), într-o extensie NOUĂ `lectii\_sim\browser-salvare.js` (nu modifica `browser-web.js`).
  - `ext.pagina(html, ctx)` — adaugă în pagină ce-ți trebuie (de ex. butonul „Clic dreapta pe imagine” / meniul „Salvați imaginea ca…”).
  - `ext.actiune(act, v, ctx)` — tratează `data-act`-urile tale; `ctx.go(a)`, `ctx.draw()`, `ctx.msg(text)`, `ctx.S` (starea), `ctx.Q`.
  - `ext.verifica(c, ctx)` — teste noi (k-ul tău, de ex. `salvat`); `ext.op(op, ctx)` — operații noi în `sol`/`gresit`; `ext.panou(ctx)` — un panou sub fereastră („Fișierele tale”).
  - Evenimentul `browser-web` (detail `{tip:'nav'|'cautare'|'fila'|'inchide'|'inapoi'|'inainte'|'reimprospatare', adresa, q, fila}`).
- Paginile inventate au deja `poza` (desen SVG simplu: arici, lup, urs, capră, Marte) — pentru salvarea imaginilor adaugi `autor` / `licenta` în paginile tale noi (prin `site`), nu în `BrowserWeb.SITE` (e înghețat).
- NU schimba: numele butoanelor și sfaturile (Edge probat), regula ghilimelelor (drepte și “ ” = expresie exactă; „ ” = nu), aspectul unui rezultat, faptul că → apare doar după ←, paginile existente (lecția 14 se sprijină pe textele lor) și fila lecției (`start:'lectie'`).
- **Schimbări de comportament în `browser-web.js` după judecata 1 (11.10.2026, 01:30–01:50, autorul proaspăt al lecției 14).** API-ul NU s-a schimbat (`creeaza`, evenimentul `browser-web`, numele butoanelor, regula ghilimelelor, aspectul unui rezultat, paginile din `SITE`):
- **Judecata 2, 11.10.2026 02:30 (m2):** butonul „Scrie "” apăsat când bara de adrese nu e activă selectează întâi tot textul din bară (ca la primul clic în ea), apoi pune ghilimeaua; când bara e activă, pune ghilimeaua la cursor. API și nume neschimbate.
  - butonul „Scrie "” nu mai ia focusul (`mousedown` fără efect) și un semn citit în `focusin` oprește selectarea întregii bare când focusul vine de la el (G1: ghilimeaua nu mai ștergea tot ce era scris);
  - `TipCautare`: Enter verifică la RIDICAREA tastei (keydown doar notează), ca ghilimeaua unei taste moarte (US-International: `"` + Enter) să ajungă în casetă înainte de verificare;
  - testul „cautare” are opțiunea nouă `faraGhilimele:true` (căutarea trebuie să fie fără expresie între ghilimele) și mesaj propriu pentru `""` lipite;
  - umplutura (`UMPLUTURA`) are în plus „si”, „despre”, „te” și se caută doar în AFARA ghilimelelor (o expresie exactă ca „Ion și Maria” nu mai e respinsă);
  - bara de adrese: o pagină cunoscută se deschide întâi (orice terminație); un cuvânt cu punct fără terminație de site cunoscută (`TLD`: ro, com, org, net, eu, dev, de, md, info, edu, gov, io, app, uk, fr, it, es, hu, us, ca, biz, tv, me, co) = căutare, ca în Edge („lup.html”); adresa greșită rămâne întreagă în bară (`'eroare:'+adresa`, mesajul și titlul filei arată doar site-ul); `…/index.html` = aceeași pagină (`norm`); Esc în bară pune adresa filei la loc.
  - Dacă paginile tale au o terminație de site din afara listei, le găsește oricum (pagina cunoscută are prioritate); o adresă NECUNOSCUTĂ cu altă terminație ar merge la căutare — adaug-o în `TLD`.
- Fapte probate pe care le poți refolosi: Edge în română — vezi mai sus și `_proba\edge_*.json`; × pe fila lecției + Ctrl+Shift+T = fila revine (`_proba\edge_redeschide_fila.json`). Salvarea în Edge („Salvare ca”, Ctrl+S, clic dreapta pe imagine) NU am probat-o (nu era a lecției 14).

## Poarta și probele
- **Rulate din nou după reparațiile judecății 1 (11.10.2026, ~01:55):** `test_joc` TRECUT (doar „1 niveluri”); `verifica_lectie --fara-t1` → 0 (S0, S1, S2 7/9, T0 TRECUT); `parcurge.py` → 0 probleme, 3 stele, 0 erori la 390 (atingere) și la 1280 — cu ghilimelele scrise CU butonul „Scrie "” în bara de adrese (P8 capra, atelierul F3) și în casetă (390), tasta moartă emulată la 1280 (Enter jos, `"`, Enter sus), „lup.html” = căutare, adresa greșită își păstrează calea, `…/index.html`, Esc; `test_motor_sim.js` → 0 (44 de așteptări); `learninghub_date_personale.py` → 0; `activitate.py lista` „nu e in catalog” → 0.
- `test_joc.py --dir lectii/v m2-l14` → **TRECUT** (doar avertismentul așteptat „1 niveluri”), `_proba\test_joc_out.txt`.
- `verifica_lectie.py … --fara-t1` → ultima linie **0** (S0 TRECUT, S1 0 identice, S2 aplicare/execuție 7/9, T0 0), `_proba\verifica_out.txt`.
- `_proba\parcurge.py` (gesturi reale, rețeaua blocată, `ctx.close()`): 390 px cu atingere (Pixel 7) și 1280 px cu mouse + tastatură; fiecare exercițiu întâi greșit, apoi „Ia-o de la capăt” și corect; atelierul + 2 variante; pasul real; 5 întrebări; finalul: **0 probleme, 0 erori în consolă, 3 stele** la ambele lățimi; nimic mai lat decât ecranul; ținte ≥ 32 px; butonul + se vede fără derularea filelor; clicul în bara din pagină selectează tot; Ctrl+R / F5 / Alt+← nu reîncarcă lecția. Capturile de telefon `_proba\telefon_*.png` — privite (pe telefon: filele se strâng, + rămâne lipit în dreapta; adresele din casetele „Acum în browserul tău” nu se mai rup la cratimă).
- Numărul de cuvinte pe pas (`_proba\numara_cuvinte.js`): textul de predat 58–86 de cuvinte; cu legenda și caseta „Acum în browserul tău” (regula 10) 91–141.

## După judecata 1 (11.10.2026, autorul proaspăt) — reparațiile și probele noi
Registrul complet (literele A–V, cine a găsit, citatul, reparația): `_verificare\registru_j1.md`.
- **Ctrl+Shift+T după × pe fila lecției** — Edge real, desktopul ascuns `LH_V14R`, profil temporar `_proba\edge_profil_rf` (șters), rețeaua doar spre serverul meu local: `_proba\edge_redeschide_fila_interior.py` → `_proba\edge_redeschide_fila.json`: file la pornire [Biblioteca de probă]; după + [Biblioteca, Filă nouă]; după × pe prima [Filă nouă]; după Ctrl+Shift+T [Biblioteca de probă, Filă nouă]. Tastele ca la lecția 13 (Ctrl și Shift în starea tastaturii firului, T ca tastă). Oprit doar PID-ul meu; niciun msedge.exe rămas.
- **Tasta moartă** (US-International, aranjamentul implicit al calculatorului de lucru): datele judecătorului 1 (`_verificare\j1_tastatura.json`, ToUnicodeEx, fără schimbarea tastaturii): `"` + consoană = `"l`; + spațiu = doar `"` (spațiul se pierde); + Enter = `"` și Enter; + `"` = `""`; + a/u = ä/ü. Lecția spune acum ce vede elevul și ce face (P8 „Uite cum”, pasul real r. 5). Ordinea evenimentelor în Chromium cu tastatura reală NU am probat-o (ar cere schimbarea tastaturii profesorului); simulatorul e făcut să meargă în ambele ordini (Enter verificat la ridicare; parcurge.py emulează „Enter jos, ghilimeaua, Enter sus”).
- **Fără diacritice pe Bing** — `_proba\bing_fara_diacritice.py` (headless, context temporar, fără cont): prima căutare a dat rezultate fără legătură (Bing headless), următoarele „Un ultim pas” (verificare anti-robot) → neconcludent. Lecția spune „de obicei merge și așa”; simulatorul le acceptă (probat).

## Nesigur / de semnalat profesorului
- Ghilimelele pe US-International în browserul real (nu doar ToUnicodeEx): sfatul „apasă bara de spațiu după ghilimeaua de la sfârșit” e de confirmat pe un calculator din laborator. Ce face Bing cu `"lupul cenușiu"hrană` (spațiul înghițit) n-am putut vedea (verificare anti-robot).
- Căutarea fără diacritice pe Bing/Google real: „de obicei merge” — neprobat azi (verificare anti-robot).
- „Pe calculatoarele cu Windows e, de obicei, Microsoft Edge”: n-am găsit o frază oficială Microsoft că Edge e preinstalat pe orice Windows; probat doar pe calculatorul de lucru (Windows 11). De aceea „de obicei”.
- Ce browser au calculatoarele din laborator (pe bara de activități a calculatorului de lucru e Chrome, nu Edge). Lecția merge cu orice browser; pasul real spune că alt motor decât Bing e în regulă.
- Aranjamentul tastaturii din laborator. Dacă e **United States-International** (cum e pe calculatorul de lucru, lângă Romanian Standard), `"` e tastă moartă: urmat de o vocală scrie ä, ë, ü… De aceea am ales expresii care încep cu o consoană și sunt urmate de un spațiu și un cuvânt: atelierul și laboratorul cu `"lupul cenușiu" hrană` (la început era „ursul brun” — u → ü: schimbat), `"capra cu trei iezi" poveste`, `"Micul prinț"`, `"Somnoroase păsărele"`. Nu am probat ce face tasta moartă urmată de Enter (ghilimeaua de la sfârșitul unei căutări fără cuvânt după ea). De probat pe un calculator din laborator.
- Forma exactă a filelor Bing și a rezultatelor se schimbă des (Bing își schimbă pagina); lecția nu promite rezultate anume, doar le cere elevilor să numere câte titluri răspund.
- Sfatul săgeții → în Edge-ul românesc are numele accesibil „Redirecționare” (o traducere stângace a lui „Forward”); sfatul vizibil spune „Faceți clic pentru a merge înainte…”. Lecția îi spune „Înainte”.
- Pe telefon nu am probat Edge-ul real (doar pagina, la 390 px).
