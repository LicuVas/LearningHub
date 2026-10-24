# Lecția 21, clasa a VIII-a — surse, probe și ce n-am putut verifica (24.10.2026, dimineața, tura de noapte 23→24.10; reparată după judecata 1 în aceeași dimineață — vezi ultima secțiune)

Mini-proiectul unității VIII-U2 „Pagini web”. Nu predă nimic nou: cerințele, grila profesorului, un exemplu de pagină bună / mai puțin bună cu grila aplicată, metoda „cerință cu cerință”, verificarea încrucișată, atelierul (cerințele verificate în simulator, bife care NU sunt nota) și proiectul elevului la laborator, fără profesor.

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_8A_8M.md` (19.02.2027, lecția 21, M3, „consolidare (mini-proiect)”; în `Calendar_ore_VIII.md`, 16.02.2027) și `data\unitati.json` (VIII-U2, lecția 21, materiale „fisa_proiect, grila_proiect”). Lecția 21 e ULTIMA a modulului 3; evaluarea sumativă (lecția 22) e în M4 (05.03.2027).
- **Proiectul unității** (`planificari\Proiectul_unitatii_VIII-U2.md`): ora 21, „Mini-proiect: pagină web după specificații date · consolidare (mini-proiect) · fisa_proiect, grila_proiect”; CS.1.2 și CS.3.2, cu descriptorii De bază / Consolidat / Avansat (CS.3.2 Avansat: „organizând materialul digital în funcție de specificațiile date”).
- **Activitatea profesorului** (`data\activitati_lectii_VII_VIII.json`, cheia lecției), întocmai: „Mini-proiect: o pagină reală (prezentarea unui opțional, a unui proiect al clasei) cu structură, imagini cu sursă, tabel sau listă, legături funcționale. Verificare încrucișată între colegi.” Resurse: „laborator, fișa de specificații, grila de produs”. → cerințele 1-6 și 8 vin din ea (structură; imagine cu sursă; tabel sau listă; legături care merg), verificarea încrucișată e pasul 4 și pasul 11 din laborator.
- **Programa (OMEN 3393/2017)**, conținuturile copiate exact din `AI_0\data\informatica_gimnaziu\curriculum.json`: „Operații de editare a elementelor de conținut (paragraf, imagini, tabele, liste, legături): inserare, ștergere, mutare, copiere”, „Operații de formatare la nivel de text, paragraf, fundal”, „Securitate cibernetică”. Fiecare are o întrebare: Î2 (legătura), Î1 (sursa imaginii), Î5 (formatarea), Î4 (securitatea). Structura (cerința 1) e în atelier, nu și în întrebări, deci nu e declarată.
- **Notarea:** `instrumente\Grila_produs.md` (copiată ÎNTOCMAI în P2 „Uite cum”: criteriile, reperele 10 / 14 / 18, „se poate da și între repere, iar 0 dacă lipsește cu totul”, punctajul + 10 din oficiu, nota = punctaj : 10, la ,5 în favoarea elevului, exemplul 14 + 18 + 14 + 10 + 14 + 10 = 80 → nota 8); `SISTEM_EVALUARE.md` §3 („Mini-proiect / produs digital … DA — o notă, pe grilă anunțată dinainte”), §4.5 (80 % + LearningHub la „lucrarea sau proiectul de modul”); `_campaign\notare_punctaj_2026_09_29\REGULA_NOUA.md` §4. `verifica_regula.py` → 0; `oracol_nota_site.py` → 0.

## Pentru profesor (ce lipsește din documente și ce a ales pagina — nimic inventat ca fiind al dumneavoastră)
1. **Fișa de specificații (`fisa_proiect`) nu există** nicăieri în `Info_Gimnaziu_2026` (căutat după nume și după text, în `materiale\`, `livrari\`, `planificari\`). Cele **8 cerințe sunt ale paginii**, construite din activitatea dumneavoastră + lecțiile 14-20: (1) scheletul cu `<title>` și `<h1>`; (2) cel puțin două paragrafe; (3) o fotografie care se vede, cu `alt`; (4) sursa sub ea (autorul și licența); (5) o listă (≥ 3 rânduri) sau un tabel (≥ 2 rânduri); (6) legăturile dus-întors care merg; (7) cel puțin două formatări `style`, ușor de citit; (8) lista de verificare a lecției 20 (șase întrebări). Le confirmați? Pagina spune doar „dacă profesorul dă altă temă, faci tema lui, cu aceleași cerințe”. **Strat 24.10 (reparația după judecata 1):** fiecare cerință spune acum și pagina pe care se cere (prima: 2, 3, 5, 7; amândouă: 1, 4 — sub fiecare fotografie —, 6, 8), iar la (5) tabelul are „cel puțin 3 rânduri și 2 coloane”; forma sursei: „Foto, autorul, licența” (ca la lecția 20).
2. **Tema.** Activitatea dumneavoastră: „prezentarea unui opțional, a unui proiect al clasei”. Pagina propune **„Excursia clasei în Retezat”** (proiectul clasei din paginile lecțiilor 16 și 18), ca proiectul să încapă în 50 de minute: elevul pornește de la paginile lui de atunci. Dacă vreți un opțional, spuneți-o la oră: cerințele rămân aceleași.
3. **Nota modulului 3.** Lecția 21 e ultima din M3 și singura care dă notă în M3. Pagina spune prudent: „Dacă proiectul e nota modulului 3, nota din catalog = (80% din punctaj + punctele de pe LearningHub) : 10, ca la lecția 1.” Confirmați?
4. **Explicația (criteriul 4).** Grila nu spune dacă e scrisă sau orală. Pagina cere trei propoziții în caiet (pasul 12) și spune „profesorul te poate întreba despre ele” — propunerea paginii.
5. **Predarea.** Documentele nu spun unde se predă. Pagina: cele două pagini și fotografia rămân în Documente, cu numele elevului (ca la VIII/12, „Dacă profesorul a spus altfel, faci cum a spus el”); nimic publicat pe Internet.
6. **Ce nu se termină în oră.** Pagina spune: „Ce n-ai terminat din proiect îi spui profesorului: el hotărăște când îl termini.” Ora 22 (evaluarea) e după vacanță.
7. **Verificarea încrucișată fără coleg** (o clasă mică, un elev singur): „Dacă nu ai cu cine, ia tu cerințele pe rând, încă o dată.” Colegul doar spune; fiecare repară în paginile lui (calculatorul comun, regula 23).
8. **Exemplul cu grila** (Irina 84 → 8, Radu 60 → 6) e al paginii, spus pe ecran „E doar un exemplu: nota adevărată o dă profesorul.” **Strat 24.10:** Radu are acum 8 la „Respectarea cerinței” (îi lipsește sursa: sub reperul de 10), deci 48 + 10 = 58 → 6; Irina spune de ce a pus tabelul.
9. **(nou, 24.10) Ce e obligatoriu și atelierul.** Ca să încapă în 50 de minute, pagina spune: obligatoriu = „Încearcă tu” de la „Tema și cele 8 cerințe”, laboratorul și întrebările; celelalte exerciții și atelierele = pentru cine are timp (ca la VIII/18). Dacă vreți atelierul obligatoriu: lecția iese ≈ 54 de minute la 45 de semne pe minut (`_proba\r1_durata.json`).

## Ce presupun cunoscut (lecțiile publicate / pe disc) și ce acopăr
| ✓ | Lecția (pagina, `surse.md` „Pentru lecția următoare”, `afirmatii.json` citite) | Folosit aici |
|---|---|---|
| ✓ | VIII/1: nota = punctaj : 10, oficiul, nivelul din notă, 80 % + LearningHub la proiectul de modul | P2, Î3, „Ai nevoie de” |
| ✓ | VIII/12: grila de produs aplicată (mini-proiectul de calcul tabelar) | P2-P3 (aceeași grilă, aceleași cuvinte) |
| ✓ | VIII/14: Notepad, Salvare ca .html / Toate fișierele / UTF-8 / „există deja” → Nu + cifră, Explorer, Ctrl+S + F5, Ctrl+U, Fișier › Închideți fila | laborator 1, 4, 8, 9, 10, 14 (cuvintele lor) |
| ✓ | VIII/15: scheletul, `<title>`, Tab (pe telefon două spații) | cerința 1, laborator 5 |
| ✓ | VIII/16 (PUBLICATĂ): `<h2>`, `<p>`, `<img src alt>`, Fișier › Deschideți, Salvați ca, `Nume_Prenume_bucura.jpg`, fotografia lipsă | cerințele 2-3, laborator 2, 3, 9 |
| ✓ | VIII/17: `<ul>` / `<li>`, `<table>` | cerința 5, laborator 5 |
| ✓ | VIII/18 (pe disc, reparat): `<a href>` între două pagini din același dosar, `…_lectia18.html` + `…_pagina2.html`, legătura înapoi, ERR_FILE_NOT_FOUND, „compară numele literă cu literă” | cerința 6, P4, laborator 2, 7, 8, 9, Î2 |
| ✓ | VIII/19 (PUBLICATĂ): `style` pe `<h1>` (`color: navy; text-align: center;`) și pe `<body>` (`background-color: lightyellow;`), contrastul (EditorWebStil, prag 3) | cerința 7, P3, laborator 6, Î5 |
| ✓ | VIII/20 (PUBLICATĂ): lista în 6 întrebări, ÎNTOCMAI (`LISTA` din pagina ei, după reparația j1), sursa `<p>Foto: Gugalcrom123, CC0</p>`, întrebarea 6 (numele fișierelor rămân, pentru profesor; redenumirea NU e predată) | cerințele 4 și 8, laborator 5, 10, Î1, Î4 |
| ✓ | a V-a, L15: licența liberă și sursa sub imagine | cerința 4 |
Granița: `m3_noapte_23_10\granite\viii_l21.md`. Nimic cerut din ce n-a fost predat: fără redenumirea fișierelor, `mailto:`, `.css`, `class`, publicare.

## Faptele — probate (nimic din memorie; nimic pe ecranul vizibil)
- **Laboratorul, în Chromium 148 headless** (motorul Edge / Chrome), pe paginile Anei de la sfârșitul laboratorului scrise ca de Notepad (UTF-8 fără BOM, CRLF) lângă fotografie: fila, titlul bleumarin la mijloc (rgb(0, 0, 128), center), fundalul lightyellow (rgb(255, 255, 224)), fotografia încărcată, „Foto: Gugalcrom123, CC0” sub ea, lista cu 3 buline (disc); clic pe „Lacul Bucura” → pagina a doua în ACEEAȘI filă; „Înapoi la Excursia în Retezat” → prima; href-ul vechi (`…_pagina2.html`, fișier lipsă) → pagina de eroare. `_proba\proba_coduri_l21.py` → `proba_coduri_l21.json` (B).
- **Extensia, pe toate codurile lecției și pe paginile reale ale elevului de la lecțiile 16 și 18** (`window.COD_L16 / COD_L18`, citite în `_proba\coduri_vecini.json`): ce îi lipsește paginii de la lecția 18 (sursa, lista, stilul) e exact ce cere laboratorul; plus 14 cazuri de margine (lista după `</body>` nu se numără, tabel cu 1 rând nu, `<li>` gol nu, sursa deasupra fotografiei nu, CC BY-SA da, „de pe Internet” nu, `style` greșit sau pe `<html>` nu se numără, textul legăturii, ținta href, școala / telefonul găsite, numele din src nu). `proba_coduri_l21.json` (A): **48 de verificări, 0 nepotriviri**.
- **Paginile de pornire** (descărcarea din pasul 3) = octet cu octet paginile Anei de la laboratorul lecției 18 (`COD_L18.lab_p1`, `.lab3`), ca de Notepad (C). **Strat 24.10:** a rămas doar `pagina1_de_pornire.html` (= `COD_L18.lab_p1`, recitit 24.10, neschimbat); pagina a doua se face din prima.
- Restul faptelor (Notepad, Salvare ca, Deschideți, Ctrl+U, Închideți fila, „Salvați imaginea ca”, fotografia lipsă, eroarea din Edge) sunt ale lecțiilor 14-20, probate acolo; lecția le folosește cu ACELEAȘI cuvinte. Trimiterile: `afirmatii.json` (A05, A06, A08-A10, A12).

## Numele RO / EN
Aceleași ca la VIII/14-20 (Fișier › Deschideți (Open), Fișier › Salvați ca, Documente (Documents), Descărcări (Downloads), Toate fișierele (*.*), Deschidere (Open), Salvare (Save), Nu (No), Salvați imaginea ca / Salvează imaginea ca…, Fișier › Închideți fila, Nu salvați). Nou: „Anulare (Cancel)” în fereastra Deschidere (pasul 3) — „Anulare” e butonul ferestrelor de fișiere din Windows în română (citit la VIII/14 din resursele ferestrei Salvare ca); fereastra Deschidere a Notepad-ului n-a fost deschisă (nesigur, scris o dată).

## Imagini (`img\SURSE.json`)
- `img\bucura.jpg` — „Lake Bucura 03.jpg”, Gugalcrom123, CC0, Wikimedia Commons; copia octet cu octet a fișierului lecției VIII/16 (sha1 5206c91e…), 640 × 480, 116 KB. În P0 și în pasul 3 al laboratorului (clic dreapta › Salvați imaginea ca, pentru cine n-o mai are).
- `img\imagini-sim.js` — aceeași fotografie, 320 px, ca `data:` pentru pagina simulată (copia fișierului VIII/16, doar variabila numită `IMAGINI_L21`).
Nicio imagine nouă, nimic desenat sau generat.

## Simulatorul: extensia NOUĂ `lectii\_sim\editorweb-proiect.js` (proprietar: VIII/21)
`editorweb.js` (VIII/14), `-schelet` (VIII/15), `-continut` (VIII/16), `-verificare` (VIII/20), `-stil` (VIII/19) **neatinse**; se încarcă înaintea ei. Extensia doar CITEȘTE (nu ascultă taste, nu schimbă desenul): `CERINTE` (textele celor 8 cerințe, aceleași în P1, atelier, laborator și banda de sus), `corp` (DOAR între `<body>` și `</body>`, ca la VIII/16 și VIII/18), `paragrafe` (≥ 3 cuvinte, fără rândul cu sursa și fără textul legăturilor), `sursa` / `sursaBuna` (primul rând „Foto / Sursa / Imagine…” de după fotografie, cu autorul și o licență: CC0, CC BY / BY-SA, domeniu public), `listaSauTabel`, `formatari` (ce aplică browserul: `EditorWebStil.declaratii`, valid), `seCiteste` (`EditorWebStil.lizibil`, regula lecției 19), `legaturi` / `duce` / `tinta` / `textBun` (regulile de nume probate la VIII/18: litere mari/mici, spații la capete, fără ghilimele → merge; fișier lipsă, fără .html, dosar în față → eroare), `sigur` (toate tiparele lecției 20, `fisiere:false`: întrebarea 6), `randare` (desenul pentru „Uite cum”, cu fotografia).
- **De ce fără `editorweb-legaturi.js`:** împreună cu `editorweb-continut.js` rescriu amândouă `srcdoc` (capul lui `-legaturi`: „neprobat, deci nerecomandat”). Mini-proiectul are nevoie de fotografia desenată, deci **în browserul simulat legăturile nu se apasă**; atelierul spune asta pe ecran („testul citește numele din href și caută fișierul în Documente… Le apeși de-adevăratelea la laborator”). Fidelitatea (regula 9): testul primește exact ce primește browserul (probat, A) și respinge ce dă eroare.
- **Mesajele** spun doar ce e sigur adevărat: câte rânduri are lista ACUM, ce scrie în `href` și cum se numește fișierul din Documente, textul care abia se vede; starea (nesalvat, F5 în Notepad, fila colegului) și datele rămase vin întâi, din `EditorWebVerificare.cuDiagnostic`.

### Pentru lecția următoare (VIII/22, evaluarea sumativă)
- Pe calculatorul elevului rămân `Nume_Prenume_8A_lectia21.html` și `Nume_Prenume_8A_lectia21_pagina2.html` (+ fotografia) — proiectul, cu cele 8 cerințe.
- `window.EditorWebProiect` (semnăturile de mai sus) se poate încărca după aceleași 5 fișiere; nu schimbați numele funcțiilor și forma rezultatelor. Ce vă lipsește → extensie cu nume nou.

## Practica și timpul (≤ 50 de minute; estimare, nu măsurare la clasă) — ÎNLOCUIT la reparația din 24.10 (socoteala autorului era făcută pe ~600 de cuvinte; cea nouă, cu metoda judecătorilor VIII/18, e în ultima secțiune)
| Partea | Repede | Încet |
|---|---|---|
| Înscrierea, deschiderea lecției | 1 | 1 |
| P0-P4 citite (~600 de cuvinte + grila) | 5 | 7 |
| „Încearcă” obligatorii (P1 lista, P2 notele, P3 culoarea) | 4 | 6 |
| Atelierul (4 reparații, Ctrl+S, deschiderea, F5) | 5 | 8 |
| Laboratorul (pașii 1-2, 4-12, 14; fără 3 și 13) | 22 | 28 |
| Cele 5 întrebări | 4 | (ora viitoare) |
| **Total** | **41** | **50 fără întrebări** |
De aceea pagina spune: laboratorul (proiectul) începe „cel târziu la jumătatea orei”; cu 10 minute înainte de sfârșit, ultimul pas (predarea și curățenia); întrebările după el sau ora viitoare (Continuă de unde ai rămas); „Încă un exercițiu”, al doilea atelier și pasul 13 sunt pentru cine termină mai repede. Drumul de rezervă (pasul 3: descărcarea, fotografia) adaugă ~3 minute.

## Regulile 22 / 24 / 25 / 27 — calculatorul profesorului
- **Nimic pornit pe ecran:** niciun Notepad, Explorer, Edge, Chrome, Office. Doar Chromium din Playwright (headless, context temporar, închis cu `ctx.close()`) și Python.
- **Regula 24:** toate probele opresc orice cerere care nu merge spre 127.0.0.1 / `file:` (4 cereri oprite = fonturile Google); niciun elev de probă trimis.
- **Regula 22:** nicio cerere spre exterior (imaginile sunt refolosite de pe sit).
- **Regula 21:** lecția nu are fișiere Office; `curata_metadate.py` → 0.
- **Regula 27:** `learninghub_date_personale.py` → 0. Persoanele din exerciții sunt inventate (Ana Popescu, Matei Pop: numele-exemplu ale lecțiilor 14-20; Irina, Radu, Andrei, Ioana: prenume), „Școala Gimnazială nr. 99 din Brașov” e inventată (ca la VIII/20).

## Porțile și probele (rulate ULTIMELE, după ultima schimbare)
- `test_joc.py --dir lectii\viii m3-l21` → **TRECUT** (20 de întrebări jucate; doar „1 niveluri”). `_proba\iesire_test_joc.txt`.
- `verifica_lectie.py index.html --fara-t1` → **ultima linie 0** (S0 TRECUT, S1 0 identice / 0 aproape identice, S2 5/5 aplicare-execuție, T0 0). T0 prinsese întâi un paragraf de 168 de cuvinte (pasul 2 al laboratorului, cu drumul de rezervă) → drumul de rezervă e acum pasul 3; S1 prinsese Î3 cu același enunț ca „Încearcă” din P2 → enunț nou. Avertisment fără verdict: densitatea antetului „Ai nevoie de” (ca la VIII/17, VIII/20). `_proba\iesire_verifica.txt`.
- `_proba\proba_gesturi_l21.py` (1280 px cu mouse și taste reale; 390 px cu atingere și butoanele de taste ale simulatorului): **147 de verificări, 0 picate, 0 erori în consolă**, nicio navigare a lecției. Fiecare „Încearcă” / „Încă un exercițiu” întâi greșit, cu mesajul (lista „2 rânduri … cel puțin 3”, „nicio listă”, alt = numele fișierului, „yellow”, „abia se vede”), apoi corect, cu rândurile scrise ca un elev (cursorul la sfârșitul rândului, Enter, Tab-uri / două spații, literele); atelierul: la pornire bifate doar 1, 2, 3, 7; drumul pe bucăți (nesalvat → „Ctrl+S”; după Ctrl+S → href-ul vechi și numele bun; → școala, cu rândul; → „F5”), apoi toate bifate; atelierul 2; laboratorul (casetele de cod încap la 390 și la 460 px; cele două descărcări aduc octet cu octet paginile de pornire; fotografia din pas se vede); Î1-Î5; diploma. Capturile de telefon `_proba\_tel_*.png` privite (P1, atelierul, laboratorul pe bucăți). Filtrul consolei: „Loading the image … violates … img-src data:” = imaginea paginii SIMULATE (CSP-ul ei), ca la VIII/16, nu o eroare a lecției.
- `_proba\proba_coduri_l21.py` → **48 de verificări, 0 nepotriviri**.
- `verifica_regula.py` → 0; `oracol_nota_site.py` → 0; `learninghub_date_personale.py` → 0; `curata_metadate.py` → 0.

## Ce n-am putut verifica / alegeri de semnalat (nesigur)
1. **Notepad real nepornit** (noaptea / dimineața, ecranul vizibil): unde se deschide al doilea fișier deschis cu Ctrl+O (filă nouă sau fereastră) nu e probat → pasul 7 (legătura din prima pagină) vine ÎNAINTE de pasul 8 (pagina a doua), ca elevul să nu trebuiască să treacă de la o filă la alta; numele paginii a doua se ia din `href`. **Strat 24.10:** pagina a doua se face acum din prima, cu Salvați ca (fila primește numele nou, ca la VIII/18, `afirmatii.json` A15); Ctrl+O pe al doilea fișier rămâne doar pe ramura cifrei (pasul 10) și la „Dacă mai ai timp”, unde lecția nu spune unde se deschide. Fereastra Deschidere a Notepad-ului și butonul ei „Anulare” — neprobate (VIII/14: „fereastră simplificată, NEPROBATĂ”).
2. **Edge real nepornit:** pagina de eroare are în Edge alt titlu decât în Chrome (VIII/18): lecția spune doar „Pagină de eroare (ERR_FILE_NOT_FOUND)?”, ca VIII/18. Desenul paginilor e probat în Chromium.
3. **Dosarul descărcărilor** (Descărcări) = setarea de la început a browserului (ca la VIII/20).
4. **Timpul** — estimare (mai sus), nemăsurat cu elevi.
5. **Tema** („proiect al clasei” = excursia din lecțiile 16 și 18) și **cele 8 cerințe** — ale paginii, până confirmă profesorul („Pentru profesor” 1-2).
6. **Pagina a doua** a elevului (de la lecția 18) repetă paragrafele și fotografia primei pagini (așa a făcut-o laboratorul 18, cu Salvați ca): nu încalcă nicio cerință; „Dacă mai ai timp” (pasul 13) propune două propoziții noi. **Strat 24.10:** pagina a doua e acum copia primei pagini terminate (cu sursa, lista, culorile); „Dacă mai ai timp” e pasul 14.

## Pentru componenta comună (nu sunt ale lecției; nu le-am atins)
- `editorweb-continut.js` + `editorweb-legaturi.js` nu se pot încărca împreună (rescriu amândouă `srcdoc`). O pagină cu fotografie ȘI legături care se apasă (ca proiectul) ar avea nevoie de o împăcare a celor două (de exemplu, `-legaturi` să pornească din desenul lui `-continut`). Până atunci: abaterea spusă pe ecran.
- `editorweb-stil.js` (`calc`): iframe-ul ascuns în care se calculează stilurile primește și `<img src="nume.jpg">`; CSP-ul paginii simulate (img-src data:) îl oprește, iar Chromium 148 scrie în consolă „Loading the image … violates … img-src data:”. Nu strică nimic; o probă care numără erorile de consolă trebuie să-l știe.

## Atenție pentru judecător
- Proiectul elevului = laboratorul (14 pași, dintre care 3 și 13 opționali); atelierul are 9 teste (cele 8 cerințe + „browserul arată pagina salvată acum”). **Strat 24.10:** laboratorul are 15 pași (3 = drumul de rezervă, 14 = „Dacă mai ai timp”); atelierul e „pentru cine are timp”.
- Legăturile din browserul simulat nu se apasă (motivul mai sus) — spus în intro-ul atelierului; testul e pe nume.
- Exemplul Irina / Radu e al paginii (spus pe ecran).
- „Dacă proiectul e nota modulului 3…” — formulare prudentă (lecția 1 a predat regula pentru „lucrarea sau proiectul dintr-un modul”).
- P2 „Uite cum” are ~120 de cuvinte (peste reperul de ~80): e grila profesorului copiată ÎNTOCMAI, pe criterii (o listă, ca să se citească pe telefon), plus exemplul din grilă. N-am scurtat-o, ca să nu schimb textul profesorului.
- Atelierul 2 și Î2 au în Documente și fotografia: fără un fișier-imagine, `editorweb-continut.js` nu arată dosarul sub zona de scris, iar elevul n-ar vedea numele paginii (proba: „dosarul Documente arată…”).
- Drumul de rezervă (pasul 3) folosește paginile Anei; textul cere numele elevului la `src` și `href` (altfel fișierele mai multor elevi s-ar numi la fel, pe calculatorul comun).

## Reparațiile după judecata 1 (24.10.2026)
Registrul, cu fiecare punct al AMBELOR judecăți (opus + sonnet) și dovada lui: `_verificare\registru_j1.md` — 20 de puncte (1 GRAV, 4 MAJOR, 15 MINOR), toate reparate, niciunul respins. Copia dinainte: `_proba\inainte_r1\`. Autor proaspăt; deciziile autorului inițial păstrate (tema, cele 8 cerințe, extensia doar de citire, fără `editorweb-legaturi.js`, legătura din prima pagină ÎNAINTE de pagina a doua, nota 80 % spusă prudent).

**Ce s-a schimbat în pagină**
- **Laboratorul (A, B, C, K, L, N, Q, R):** pasul 2 trimite după un semn mecanic („rândul care începe cu `<img`”; pagina scurtă de la L18 nu-l are, cea completă da — `COD_L18.lab_scurt` / `.lab_p1`); pasul 3 = doar `pagina1_de_pornire.html` + fotografia + `src`-ul tău; pasul 4 deschide pagina și în browser („după fiecare Ctrl+S, F5”); pasul 7 pune `lectia21_` (cu cifra de la pasul 4) în `href`, șterge cifra veche de la L18 și cere numele elevului pe drumul de rezervă; **pasul 8: pagina a doua se face DIN PRIMA, cu Salvați ca** (ca la VIII/18, pasul 4), deci are fotografia cu sursa, lista și culorile; pasul 9: titlurile și `href` fără `_pagina2` (= numele primei pagini, și cu cifră); pasul 10: legăturile, cu ramura cifrei de la pasul 8. `pagina2_de_pornire.html` a fost scoasă.
- **Cerințele (B, E, M):** fiecare spune pagina (prima: 2, 3, 5, 7; amândouă: 1, 4, 6, 8); 4 = „Sub fiecare fotografie, sursa ei: Foto, autorul, licența”; 5 = „o listă (cel puțin 3 rânduri) sau un tabel (cel puțin 3 rânduri și 2 coloane)”. Atelierul verifică 1 și 4 pe amândouă paginile.
- **Durata (D, G):** obligatoriu = „Încearcă tu” de la „Tema și cele 8 cerințe”, laboratorul, întrebările; restul = pentru cine are timp; textele tăiate; P1: „Încearcă” = alt-ul lipsă, „Încă un exercițiu” = lista lipsă (inversate); grila întocmai, ca tabel compact (O).
- **Mesaje și nume (F, H, I, J, P, S, T):** legătura spre site / fotografie / fișier lipsă — mesaj după ținta reală; `./` primit; „Cinci teste”; Elena (P4), Tudor (atelierul 2); verificarea încrucișată „în browser și în cod (Ctrl+U)”; Radu 8 la cerință (48 + 10 = 58 → 6), Irina cu motivul tabelului; „legătura nu se apasă aici” în P1, atelierul 2 și Î2; indiciul listei spune ce lipsește.

**Socoteala duratei, cu metoda judecătorilor VIII/18** (`_proba\r1_durata.py` → `r1_durata.json`; citit 110 cuvinte/min, tastat 30 / 45 / 60 de semne pe minut cu semnele grele socotite dublu, gesturile fixe ale judecătorului VIII/18; valori NOI, alese de mine, de verificat: lista lecției 20 pe două pagini cu Ctrl+U 2 min, verificarea încrucișată în ambele sensuri 4 min, cele trei propoziții în caiet 2 min):

| semne pe minut | lecția obligatorie | marja din 50 | laboratorul începe la min | verificarea încrucișată gata la min | laborator + întrebări | drumul de rezervă (pasul 3) | cu atelierul 1 |
|---|---|---|---|---|---|---|---|
| 30 | 53,0 | −3,0 (supapa) | 9,8 | 44,5 | 43,2 | 57,8 | 60,3 |
| 45 | **47,8** | 2,2 | 9,3 | **39,3** | 38,5 | 52,1 | 54,2 |
| 60 | 45,2 | 4,8 | 9,1 | 36,7 | 36,1 | 49,3 | 51,2 |

Cuvintele citite pe drumul obligatoriu: 2067. De aici pragul de pe ecran („Începe laboratorul cel târziu când mai sunt 40 de minute din oră”) și supapa („Când mai sunt 10 minute: salvează și fă ultimul pas”; ce nu încape — întrebările, restul proiectului — „rămâne pentru ora viitoare”). **Nesigur:** viteza reală a clasei; drumul de rezervă (fără paginile de la L18) trece de 50 la 45 de semne pe minut — acolo întrebările trec, de regulă, la ora viitoare.

**Probele reparației** (după ultima schimbare): `_proba\proba_reparatii.py` → `proba_reparatii_1.txt` / `.json`: **110 verificări, 0 picate**, literele A-T (1280 px cu mouse și taste reale, 390 px cu atingere; rețeaua oprită în afară de 127.0.0.1 / `file:`; `ctx.close()`), plus laboratorul urmat LITERAL pe 4 drumuri de intrare, cu fișiere scrise ca de Notepad, în Chromium (paginile complete de la L18; complete cu cifră la L18 și omonim în Documente la pasul 4; pagina scurtă de la L18; nimic). `_proba\proba_href_punct.py` → 0 (6 ținte de legătură în Chromium). Rerulate: `proba_gesturi_l21.py` → 151 / 0, 0 erori în consolă; `proba_coduri_l21.py` → 52 / 0; `test_joc.py` TRECUT; `verifica_lectie.py --fara-t1` → 0 (S2: 4/5 aplicare-execuție — clasificarea notelor din P2 e socotită acum „recunoaștere” de euristica S2; pragul de 50 % rămâne trecut); `verifica_regula.py` → 0; `oracol_nota_site.py` → 0; `learninghub_date_personale.py` → 0; `activitate.py lista | grep -c "nu e in catalog"` → 0. Captura de telefon a grilei privită (`_proba\_rep_tel_p2_grila.png`).

**Pentru lecția următoare (VIII/22) — API-ul extensiei `editorweb-proiect.js` s-a schimbat (24.10.2026):**
- `CERINTE[i].pagina` NOU: `'prima'` sau `'amândouă'`; textele `ce` / `scurt` ale cerințelor 4, 5, 6, 8 sunt altele.
- `listaSauTabel(src)` întoarce acum `{li, tabel, tr, col, ok}`: `tr` = rândurile `<tr>` cu cel puțin o celulă ale celui mai bun tabel (înainte: doar rândurile cu ≥ 2 celule), `col` = coloanele lui, `tabel` = câte tabele; `ok` = `li ≥ 3` sau (`tr ≥ 3` și `col ≥ 2`) (înainte: `tr ≥ 2`).
- `legaturi()` dă în plus `gasit` (fișierul găsit cu numele din `href`, de orice fel); `tinta()` primește `./nume` și `.\nume` ca `nume`.
- `sursa()` găsește și rândurile care încep cu „Sursă” și „Autor” / „Autorul”.
- Pe calculatorul elevului rămân `Nume_Prenume_8A_lectia21.html` și `Nume_Prenume_8A_lectia21_pagina2.html` (copia primei, cu legătura înapoi) + fotografia; `…_pagina2.html` de la L18 nu mai e folosită.

## Trecerea 3 (24.10.2026)
După judecata 2 (opus, „publicabil”: 0 GRAV, 0 MAJOR, 5 MINOR — `_verificare\judecator2.md`), autor proaspăt; registrul: `_verificare\registru_j1.md`, secțiunea „Trecerea 3”. Copia dinainte: `_proba\inainte_t3\`.
- **U — supapa de la minutul 40:** o singură propoziție, cu aceleași cuvinte în „Cum lucrezi” și în introducerea laboratorului: „Când mai sunt 10 minute din oră, chiar dacă ești la verificarea încrucișată sau la caiet: salvează (Ctrl+S), fă ultimul pas al laboratorului, apoi întrebările. Restul îl termini ora viitoare, cum hotărăște profesorul.” (Înlocuiește supapa din „Socoteala duratei” de mai sus.)
- **V — tabelul gol:** „Tabelul din corp nu are încă niciun rând <tr> cu celule <td>; …”.
- **W — indiciul Î1:** „Ce scrie cerința 4 după cuvântul Foto?”.
- **X — pasul 2:** semnul e rândul cu `<img` ȘI legătura (`href`); lipsește unul → pasul 3 (titlul lui: „…cu fotografia și legătura”). Pagina salvată la L18 fără pasul 3 de acolo merge acum pe drumul paginii de pornire.
- **Y — pasul 7:** „După pagina2 e _ și o cifră (pagina2_2.html)? Șterge-le pe amândouă.”
- Durata nu crește (`_verificare\j2_durata.py`: 53,3 → 53,3; 2139 de cuvinte citite → 2139): compensările sunt scrise în registru.
- **Pentru lecția următoare (VIII/22):** nimic nou — extensia `editorweb-proiect.js` și fișierele rămase pe calculatorul elevului sunt aceleași ca după reparația din 24.10.
- Porțile (după ultima schimbare): `j2_drumuri.py` 0 (10 drumuri), `proba_reparatii.py` 0 (131, A-Y), `proba_gesturi_l21.py` 0 (151, consola 0), `test_joc.py` TRECUT, `verifica_lectie.py --fara-t1` 0, `verifica_regula.py` 0, `oracol_nota_site.py` 0, `learninghub_date_personale.py` 0; ieșirile în `_proba\t3_*.txt`.
