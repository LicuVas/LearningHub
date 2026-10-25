# Partea I — Esențialul (o citește oricine, la fiecare lecție)

## I.1 Ce vrea Vasile și pentru cine sunt lecțiile

**Cu vorbele lui (27.09.2026):** „Reluăm siteul de la capăt… Tot ce terminăm trebuie pus pe siteul live. Nu așteptăm până la final.” · „Totul trebuie să aibă **accent practic** și să fie **instrucțiuni clare și ilustrate**, plus **posibilitatea de practică chiar în pagina respectivă**. Conceptele se prezintă **simplu și pe rând**. **Tot ce cerem să fie făcut să fie mai întâi expus/predat.**”

**08.10.2026:** „ideea este că acest LearningHub îi pregătește pe elevi pentru aplicațiile adevărate - deci trebuie să le dăm și taste reale - de la cele mai mici - deschide un registru de lucru, salvează-l, închide-l, selectează o celulă - astfel încât elevul să aibă contact cu aplicația reală de multe ori - și să îi crească încrederea progresiv și natural - fără efort.” (regula 10) · bara de jos: „meniul lecțiilor parcurse să aibă pentru fiecare dintre ei - clickabile itemurile pe care le-au parcurs și neclickabile cele pe care nu le-au parcurs încă. Astfel la o privire în meniul de jos elevul să știe clar unde a rămas data trecută - dar trebuie să se reflecte per elev - progresul fiecăruia”.

**01.10:** „îmi place foarte mult ideea cu bifele automate… simulăm cât mai realist aplicația și cerem niște acțiuni concrete și urmărim ce s-a făcut și dacă s-a făcut… plus acele variante la fiecare cerință.” · **12.10:** fereastra mică („Merge foarte bine! Bravo!”). · **20.10:** „și la Dumbrava lucrăm tot pe telefoanele elevilor. Deci trebuie să fie ceva mobile friendly.” · „pentru începători… să aibă atât pașii mici, clari, efectivi, cât și rezultatul.” · **28.09:** „input foarte specific în prompt… totul să devină cuantificabil, măsurabil, verificabil.” (de aici: fiecare val pornește cu un contract măsurabil).

**Cine folosește lecțiile (proba realității):**
- Elevi de gimnaziu V-VIII, la școlile lui (Brauner, Izvoare, Tupilați, Dumbrava). **La Tupilați, a VI-a și a VII-a au oră simultană**: lecția se parcurge FĂRĂ profesor, inclusiv laboratorul. **La Dumbrava, elevii lucrează DOAR pe telefoane** (20.10): orice lecție trebuie să meargă cu degetul, la 390 px.
- Calculatorul din laborator e **comun** (mai mulți elevi pe zi, pe același scaun) — regula 23.
- Clasa a V-a pornește de la zero (știe să citească, să miște mouse-ul, să facă clic, să tasteze litere).
- Elevul parcurge lecția **singur**, în ianuarie-februarie la M3 etc.; profesorul notează evaluările pe regula de notare (IV.2).

**Ce e o lecție aici:** o lecție din plan = O pagină = UN nivel pe pași pe motorul jocurilor (`jocuri/_motor/motor.js`, `mod:'lectie'`), publicată live imediat ce trece judecătorii. Planul: `lectii/plan.json` (din `Calendar_ore_*.md` Brauner; M1 = lecțiile 1-7, M2 = 8-15, M3 = 16-21…). Documentele profesorului (`C:\00\Projects\Info_Gimnaziu_2026\`: `unitati.json`, `Calendar_ore_*.md`, `Proiectul_unitatii_*.md`, `activitati_lectii_*.json`, `SISTEM_EVALUARE.md`, `instrumente\Grila_produs.md`) au **prioritate** asupra oricărei alte surse; activitatea din `activitati_lectii_*.json` e scheletul atelierului și al laboratorului.

## I.2 Forma lecției

- **Calea:** `lectii\<v|vi|vii|viii>\m<M>-l<NN>\index.html`; motorul relativ (`../../../jocuri/_motor/motor.css|js`); cheia `lectie_<clasa>_m<M>_l<NN>`; extensii de simulator în `lectii\_sim\` (`<script src="../../_sim/<nume>.js">`).
- **Ordinea din pagină:** antet (titlul exact din `Calendar_ore`; `continuturi` din programă, cu diacritice corecte; `obiectiv` = o propoziție; „Ai nevoie de”: lecțiile anterioare) → **P0 „La ce folosește”** (fără acțiuni, o imagine din viața reală) → **pașii** (la lecțiile noi P0 + cel mult 5; un pas = o idee) cu „Uite cum” + „Încearcă” de APLICARE → **atelierul** în simulator (teste numite care se bifează) → **„Acum la calculatorul din laborator”** (`aplicatieReala`, fără profesor; motorul pune singur bifele și fereastra mică) → **5 întrebări** (variante-soră ale exercițiilor, niciodată identice) → diploma + „Ce am învățat”.
- **Fișierele de lângă pagină:** `afirmatii.json` (fiecare fapt + cum a fost probat), `profil.json` (ce presupune că știe elevul, cu lecția de unde vine), `capturi_lipsa.json`, `surse.md` (programa, activitatea profesorului citată exact, decizii, ce n-ai putut verifica, straturi datate), `img\` + `img\SURSE.json`. Scripturile: `_proba\` (autor), `_verificare\` (judecător) — excluse din publicare.
- **Durata:** drumul obligatoriu ≤ 50 de minute după metoda judecătorului (II.1 D, X); ce nu încape devine „Dacă mai ai timp” (cu pragul de timp spus în text). Lecțiile 1 ale fiecărei clase sunt mai lungi (deschis, IX).
- **Tipuri:** predare · consolidare · mini-proiect (ghidează, nu predă nimic nou; cerințele și grila DOAR din documentele profesorului) · evaluare sumativă (pregătește elevul, nu copiază testul; fără testul profesorului = probă de antrenament C/B/A pe regula de notare) — II.1 G, IV.2.

## I.3 Regulile lecției (1-19) — fiecare se verifică

Cine verifică: S = script · A = agent-începător (citește ca elevul) · R = aplicația reală · J = judecător. Numerele 1-10 și 11-19 sunt cele din vechiul `05_STANDARD_LECTIE.md` (11-19 erau acolo „Ce au găsit judecătorii” nr. 11-19, citate în surse tot ca „regula N”).

1. **Nimic cerut înainte de a fi predat** (S, A). Orice termen, tastă, buton, simbol sau meniu dintr-o instrucțiune, exercițiu, indiciu, variantă de răspuns sau întrebare e explicat înainte: într-un pas anterior sau într-o lecție din „Ai nevoie de”. Vocabularul lecțiilor următoare nu apare nici în variante.
2. **Un pas = o idee** (J). Textul pasului 30-110 cuvinte, „Uite cum” cel mult ~80 (+ legenda pozei); propoziții scurte; concept nou: întâi „ce este” și „la ce folosește”, apoi „cum se face”. Un pas cu mai multe idei se împarte.
3. **Instrucțiuni executabile literal** (A, R): UNDE, CE EXACT, CU CE confirmi („În A2 scrie doar numărul 5 și apasă Enter.”). Fără notații („A1 = …”, „Lucru | Preț”): propoziții. Cine face exact ce scrie obține exact ce promite lecția.
4. **Ilustrat la fiecare acțiune** (S, J): captură reală din aplicația pe care o numește SAU simulator în pagină. Captura arată exact ce spune textul, în momentul acela, și NU dă răspunsul exercițiului de sub ea. Ce lipsește → `capturi_lipsa.json`; niciodată imagine-substitut.
5. **Practică în pagină, mai ales aplicare** (S, A): după fiecare pas un „Încearcă”; cel puțin jumătate din „Încearcă” + atelier sunt de APLICARE sau EXECUȚIE în simulator; recunoașterea doar pentru vocabular; întrebările = variante-soră, nu copii.
6. **Office în română ȘI în engleză** (S, R): „Pornire (Home)”, „Inserare (Insert)”; numele RO din `calibrare\meniuri_ro_en.json`, cele nesigure în `surse.md`; diacritice corecte (ș, ț cu virgulă). Funcțiile Excel se scriu `=SUM(…)`, `=AVERAGE(…)` (calibrarea 27.09; o contradicție deschisă, de probat în laborator — X); separatorul `;`/`,` vine din setările regionale Windows.
7. **Adevărat în aplicația reală** (R): orice „dacă faci X, apare Y” (și în indicii și chei) stă în `afirmatii.json` cu cum a fost probat; ce nu se poate proba se scrie prudent și e `nesigur`/`PRESUPUS`; niciun exercițiu nu se sprijină pe o presupunere.
8. **Fără contradicții și fără date vechi** (A, J, S): un obiect are un singur rol; „foaie nouă / document nou” când începi de la capăt; constantele doar din `calibrare\constante_lume.json`.
9. **Fidelitatea simulatorului**: nu acceptă ce aplicația respinge și nu respinge ce aplicația acceptă — la FIECARE gest pe care elevul îl poate încerca, nu doar pe drumul lecției.
10. **Gesturi reale, mici și dese, în aplicația adevărată** (J, A): orice gest predat în pagină se face și în aplicația reală cât e proaspăt; lecțiile următoare reiau gesturile învățate (deschizi, lucrezi, salvezi, închizi).
11. **Excel pe setări românești** — virgula e zecimală; „7.5” devine DATĂ (07.mai) și forma rămâne; „12 lei” e număr; data zz.ll.aaaa; nimic de felul ăsta din memorie: probat în Excel real (detalii VIII).
12. **Scripturile tale stau în dosarul lecției** (`_proba\`, `_verificare\`), nu în scratchpad-ul comun (acolo agenții își suprascriu fișierele — s-a întâmplat și pe 25.10). Fiecare agent are fișierele lui de lucru.
13. **Ctrl+Z nu e mereu „un pas înapoi”** (Excel după o dată greșită; Word Ctrl+X/Ctrl+V = două Ctrl+Z): orice „apasă Ctrl+Z până…” se probează pe drumul greșit tipic al unui copil.
14. **După „Verifică”, focusul se întoarce la locul lucrului** (foaie, document, zonă de cod), ca tastele cerute de mesaj să meargă; unde nu există loc de lucru (casete de cod), rămâne pe buton.
15. **Tastatura românească diferă** („ț” lângă Enter, apostroful cere AltGr); pe telefon nu există Ctrl/Shift/Enter ca taste: lecția spune butonul de pe ecran.
16. **O regulă predată nu are excepții nespuse** („are litere, deci e text” e fals pentru „12 octombrie 2026”).
17. **Clipboardul e comun tuturor proceselor**: înainte de o probă cu lipire, verifici ce e în el.
18. **Word ajustează singur spațiile, dar nu mereu** („ora 8.Aduceți”): lecția spune elevului să verifice.
19. **Probele de aplicație**: PowerPoint rulează o singură dată pe PC (verifici, lacătul `lacat_office.py`); tastele se probează ca taste reale (nu `FindKey().Execute()`); „ce ai pus tu rămâne” se probează la schimbarea temei.

**Lecțiile judecătorilor de la lecțiile nr. 4 (J1-J10)** — fostele „Ce au găsit judecătorii” nr. 1-10: J1 simulatorul fidel la fiecare gest (ex. Excel: pictograma Ștergere șterge direct, doar ▾ deschide meniul; Backspace pe zonă golește doar celula activă; Word: focusul rămâne în document după tabel) · J2 pe telefon orice gest cerut se poate face (tragerea selectează; Shift+clic → pagina spune ce faci în loc) · J3 nicio notație în locul cuvintelor · J4 provocarea din laborator nu cere profesorul (fișierele se dau ca descărcare; fără gesturi care depind de mărimea pozei) · J5 analogiile nu răstoarnă sensul pentru un copil român („rândul de la geam” = coloană în Excel) · J6 un pas ≤ 110 cuvinte, „Uite cum” ≤ ~80 · J7 „Altfel” spune exact ce spune pasul · J8 siguranța în laborator (nimic sub masă, lângă prize sau cabluri) · J9 vocabularul lecțiilor următoare nu apare nici în variante · J10 exemplele care arată un rezultat pe ecran se verifică în aplicația reală („2 + 3” în Calculator arată 5 abia după „=”).

## I.4 Regulile de siguranță (20-27) — nenegociabile

20. **Ținte de atins ≥ 32 px** și orice buton pe care textul îl numește are nume vizibil (pe telefon nu există „treci cu mouse-ul”).
21. **Fișierele de descărcat (.docx/.pptx/.xlsx) fără nume de persoane în metadate**: după orice salvare prin COM, `verificare_lectii\curata_metadate.py --curata`, apoi fără `--curata` → 0; NU `RemovePersonalInformation=True` (bara galbenă; `scoate_bara_docx.py`).
22. **Nicio dată a profesorului spre servicii externe** (User-Agent doar `LearningHub-lectii/1.0 (educational site)`; nimic în antete sau parametri).
23. **Calculatorul din laborator e comun**: ce păstrează pagina e al elevului de pe scaun ACUM (legat de „Cine ești” / `rezultat-elev.js`, sau buton „Sunt alt elev / Încep din nou”); prima încercare rămâne diagnosticul; răspunsurile scrise se acceptă în toate formele corecte (fără diacritice, cu unitate, cu articol).
24. **Probele nu trimit elevi falși în panoul profesorului**: orice browser care încarcă o pagină a sitului blochează TOT ce nu e 127.0.0.1/localhost și se închide DOAR cu `ctx.close()`; după probe, `python C:/00/AI_0/tools/activitate.py lista | grep -c "nu e în catalog"` — **cu î** (fără î dă mereu 0) — același număr ca înainte; ieșirea cu nume NU se salvează niciodată în fișiere, doar numărul.
25. **Calculatorul profesorului rămâne cum era**: doar PID-ul tău (niciodată toate procesele unei aplicații, niciodată oprire după NUME); Office: instanță nouă invizibilă, `Saved=True` + `Close` înainte de `Quit`, `AddToMru=False`/`AddToRecentFiles=False`, setările (Word: vederea și zoomul) puse la loc prin COM, nu prin registru; registrul Explorer (BagMRU/Bags) copiat în memorie și pus la loc; salvezi doar în dosarul tău din `_proba\`. **Nu porni Chrome sau Edge reali, nici aplicații din Magazin (Paint, Calculator, Clipchamp, Securitate Windows, Notepad nou)** — se deschid pe ecranul vizibil; faptele lor vin din documentație și capturi, marcate `nesigur` (regula mai nouă, 10-23.10, bate textul din 28.09). Nimic pe ecranul vizibil al profesorului; Office pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`). Dirijorul rulează la final `curata_mru_office.py --sterge`.
26. **„Numele există deja” nu arată la fel peste tot**: la PRIMA salvare (Ctrl+S) „… already exists. Do you want to replace…?” cu OK / Anulare (OK înlocuiește fișierul colegului!); la Salvare ca „Confirm Save As” cu Yes / No; în browser/Google alte ferestre. Lecția arată fereastra EXACTĂ pe fiecare drum; în laborator, la fiecare salvare elevul apasă **„Nu (sau Anulare)”** și adaugă prenumele sau o cifră.
27. **Nicio dată personală în ce se publică** (situl și depozitul GitHub sunt publice): fără căi cu numele contului Windows (`C:\Users\<utilizator>\…`), fără e-mailul/telefonul profesorului, fără nume de elevi; numele din exemple sunt inventate și nu se potrivesc cu elevi reali. Poarta: `python C:/00/AI_0/tools/learninghub_date_personale.py` → 0 — scanează TOT depozitul, inclusiv dosarele de lucru neurmărite: curăță ieșirile probelor înainte de publicare.

## I.5 Regulile adăugate din practica campaniei (28-38)

Fiecare a venit dintr-o greșeală reală prinsă de judecători sau din cererea lui Vasile; sursele sunt în părțile II-VI.

28. **Mesajul spune numai ce e sigur adevărat** și, urmat întocmai, scoate elevul din greșeală — niciodată buclă. Primul test care pică numește greșeala făcută. (II.2 D, III.2)
29. **Testul judecă rezultatul (starea finală), nu drumul elevului** — un rezultat bun ajuns pe alt drum se primește. Excepție: când ordinea e chiar ce se predă (ex. scanezi înainte să deschizi). *Propusă ca regulă de standard pe 24.10; aplicată deja în M3; aștept decizia lui Vasile* (IX). (III.2)
30. **Durata ≤ 50 de minute** pe drumul obligatoriu, socotită după metoda judecătorului (110 cuvinte/min + gesturile cronometrate; glosarul I.9); lecțiile la limită (48-50 de minute) se notează „de cronometrat la clasă”. (II.1 D, X.1 K2)
31. **Telefonul e egal cu calculatorul**: fiecare exercițiu se face cu degetul la 390 px (ținte ≥ 32 px, nimic tăiat, nicio derulare orizontală); unde gestul diferă, textul spune „Pe telefon: …”; o lecție folosită pe telefoane nu se publică cu o componentă nereparată pentru telefon. (III.3)
32. **Laboratorul merge fără profesor și fără cont**: „Acum la calculatorul din laborator” are ieșiri pentru „n-am cont / nu știu parola / nu merge” (aceiași pași în atelierul din pagină, apoi spui profesorului); nu schimbă nimic pe calculatorul comun; se iese din cont și nu se salvează parola în browser. (II.1 H)
33. **Granițele cu lecțiile vecine**: lecția nu predă ce e al vecinei numite și nu cere ce n-a predat; trimiterile spre alt pas se fac pe NUMELE pasului (și numărul din bara de jos, P1 = „La ce folosește”). (II.1 F, II.2 G)
34. **Imaginea nu dă răspunsul exercițiului** și vine din aplicația pe care o numește; capturi reale, Wikimedia Commons cu licența verificată și atribuire, sub ~150 KB; nimic generat de AI. (IV.1)
35. **Documentele profesorului au prioritate; la evaluări nimic inventat** (cerințe, criterii, punctaj, grilă — întocmai). Fără ele: probă de antrenament pe regula de notare, cu întrebarea „Pentru profesor” în `surse.md`. (IV.2)
36. **Aceeași formulare peste tot pentru lucrurile sensibile**: parola („o știi doar tu și părinții tăi”, 11.10), drepturile de autor (regula unică din 12.10), unitățile de măsură (1024), „numele există deja” → „Nu (sau Anulare)”. (IX.1)
37. **Regula de notare e una**: nota lucrării = punctaj : 10 (C = De bază 40 p + B = Consolidat 30 p + A = Avansat 20 p + 10 din oficiu), rotunjită la întreg, ,5 în favoarea elevului; nivelul se citește din notă (9-10 Avansat · 7-8 Consolidat · 5-6 De bază · 3-4 În formare · 1-2 În dificultate). La lucrarea de modul, nota din catalog = rotunjit((0,8 × punctajul lucrării + punctele de pe LearningHub, din 20) : 10). Lecția o predă fără s-o compare cu cea veche. (IV.2)
38. **Pași mici ȘI rezultatul**: pentru începători, pașii mici, clari, efectivi și cum arată rezultatul (20.10); numele fișierului poartă clasa elevului (`<clasa ta>`), nu o clasă fixă (01.10). (II.1 G, II.2)

## I.6 Lanțul pe fiecare lecție (asta a produs calitatea — nu scurta)

1. **Contract** al valului (`/contract`): cererea verbatim, proba realității, R# cu cine verifică și ce număr înseamnă gata. Granițele dintre lecțiile vecine în fișiere de graniță.
2. **Autor** (opus, proaspăt, în fundal; brieful `07_BRIEF_AUTOR.md` + Partea VI.1): probează faptele în aplicația reală, scrie pagina pe secțiuni, trece porțile lui (`test_joc.py` TRECUT, `verifica_lectie.py --fara-t1` → 0, Playwright 390 cu atingere + 1280 → 0 erori), ține `_proba\stare_autor.md` la zi. Nu atinge alte lecții, motorul sau componentele altora; nu publică.
3. **Judecata 1 în pereche** (opus + sonnet, independenți; brieful `06_BRIEF_JUDECATOR.md` + VI.2): încearcă să RESPINGĂ lecția, cu dovezi (citat ≥ 12 caractere, gesturi reale la 390 și 1280, aplicația reală ca arbitru). GRAV = elevul se blochează / învață fals / nu poate face ce i se cere; MAJOR = îl încurcă serios.
4. **Reparare** cu autor PROASPĂT (după ~200k de context nu se mai continuă același agent): registrul punctelor (`_verificare\registru_jN.md`), fiecare cu reparația, locul și proba; copia dinainte în `_proba\inainte_rN\`.
5. **Judecata N+1** (opus, proaspăt): întâi punctele deschise din registru, cu dovadă, apoi o baleiere scurtă; un punct închis se redeschide doar cu dovadă nouă. Se repetă până la **0 GRAV / 0 MAJOR**; apoi TOATE minorele se repară înainte de publicare (o trecere scurtă la un autor proaspăt; fără judecată nouă dacă sunt doar texte, pe care dirijorul le citește în pagină).
6. **Publicare** doar prin `dirijor\publica_lectie.py` (V.2), apoi **verificare LIVE** (conținutul servit = fișierul comis, marcaje, fum 390 + 1280).
7. **Componentele comune** (motorul, `lectii\_sim\*.js`, `prezenta.js`, `rezultat-elev.js`): proprietar unic; ceilalți scriu extensii cu nume nou; o schimbare trece prin **poarta de lansare** (agent independent, LANSEAZA / NU_LANSA, regresie pe toate paginile care încarcă fișierul) și se comite SEPARAT, înaintea lecției care o folosește. (V.3)
8. **Jurnal** (`04_ORCHESTRARE.md`), **raport** pentru Vasile (FĂCUT / NEFĂCUT / NESIGUR, limbaj simplu, deciziile luate singur listate primele), fișa de memorie, `curata_mru_office.py --sterge`.

Cifre de reper: o lecție = 1-2 ore de autor + 20-40 min pe judecată, 2-6 judecăți; 6-10 agenți deodată (cu ochii pe procesor și pe `tools\consum.py`); orele scrise lui Vasile se citesc din ceas, nu se ghicesc.

## I.7 Ce nu faci niciodată

- Nu publici fără 0 GRAV / 0 MAJOR de la un judecător independent pe opus; nu pui verificări și commit în aceeași comandă înlănțuită.
- Nu faci `git add -A` (alte sesiuni lucrează în același depozit) și nu comiți `cum-fac/`, `_campaign/cum_fac_2026_10/`, `curriculum/school_year_2026_2027.json`, `_backup_local/`.
- Nu modifici o componentă comună odată cu o lecție și nu atingi simulatorul altui proprietar.
- Nu scrii fapte despre aplicații din memorie; nu promiți ce nu s-a probat.
- Nu pornești Chrome/Edge reali, aplicații din Magazin sau ceva pe ecranul vizibil; nu oprești procese după nume; nu lași urme în „Recent”, registru, OneDrive, fișiere de recuperare.
- Nu lași o probă să atingă situl viu sau panoul profesorului; nu salvezi lista din panoul de activitate.
- Nu pui în ce se publică numele contului Windows, e-mailul, telefonul profesorului sau nume de elevi.
- Nu copiezi testul profesorului în pagină și nu inventezi barem.
- Nu folosești în pagină notații în loc de propoziții, termeni nepredați sau imagini care dau răspunsul.
- Nu lași un mesaj care trimite elevul în buclă.

## I.8 Unde găsești restul

| Partea | Ce e acolo | Cine o citește |
|---|---|---|
| II | Structura lecției și scrisul (pașii, durata, sfârșitul orei, prerechizitele, tipurile; limbajul, mesajele, „Pe telefon”, trimiterile, identitatea elevului) | autor, judecător |
| III | Simulatoarele, testele (oracole, mesaje, „rezultat, nu drum”), telefonul | autor, judecător, poarta componentelor |
| IV | Imaginile (capturi, Commons, licențe, mărimi) și evaluarea (notarea, grila, probe de antrenament, mini-proiecte) | autor, judecător |
| V | Siguranța datelor (21-27 pe larg), publicarea (`publica_lectie.py` și capcanele), componentele comune (inventarul celor 76 de fișiere, legături ascunse, defecte deschise) | toți; V.2-V.3 dirijorul și proprietarii |
| VI | Procesul: autorul, judecătorul, dirijorul, bugetul | după rol |
| VII | Operarea: tura lungă (paza, catastiful, ceasul), procese, Windows, Git Bash | dirijorul |
| VIII | Aplicațiile reale — faptele probate, pe aplicație (Excel, Word, PowerPoint, Paint, Scratch, Audacity, Clipchamp, Google, Gmail, browserul, HTML, Windows, Explorer, tastatura, telefonul) | autorul și judecătorul: secțiunile comune A-D + secțiunea aplicației din lecție |
| IX | Deciziile lui Vasile (cu vorbele lui), problemele deschise, ideile | dirijorul; autorul pentru clasa lui |
| X | Hotărârile consolidării (contradicțiile rezolvate) și ce așteaptă decizia lui Vasile | dirijorul |
| Anexe | A harta numerelor vechi · B legenda trimiterilor `[surse: …]` · C regulile depășite · D surse în plus · F reluarea, publicarea de mână, uneltele, modelele de prompt · E verificarea ghidului | la nevoie; F dirijorul |

## I.9 Cuvinte folosite în ghid (glosar scurt)

- **Dirijorul** = sesiunea principală care orchestrează agenții și publică; **autor** / **judecător** / **reparator** = agenți separați; **poarta de lansare** = verificatorul independent al unei componente comune (verdict LANSEAZA / NU_LANSA).
- **GRAV** = elevul se blochează, învață ceva fals sau nu poate face ce i se cere · **MAJOR** = îl încurcă serios · **MINOR** = restul. **Judecata în pereche** = prima judecată făcută de doi judecători independenți (opus + sonnet). **Registrul** = lista punctelor GRAV/MAJOR/MINOR cu starea lor (`_verificare\registru_jN.md`).
- **Metoda judecătorului** (durata) = cuvintele drumului obligatoriu citite cu 110 cuvinte/min + timpul gesturilor cronometrate în simulator și în laborator (`j2_durata.py`).
- **C / B / A** = părțile unei lucrări: C = De bază (40 p), B = Consolidat (30 p), A = Avansat (20 p), plus 10 din oficiu.
- **Lecțiile nr. 4** = primele lecții refăcute (27.09), unde judecătorii au găsit lista J1-J10 și regulile 11-19.
- **Proba de fum** (`fum_live.py`) = pagina publicată deschisă pe sit la 390 și 1280 px: 0 erori, 0 cereri spre panoul profesorului.
- **COM** = felul în care un script pornește și comandă Word/Excel/PowerPoint fără să le arate; **desktopul ascuns** = un ecran invizibil pe care rulează probele, ca să nu apară nimic în fața profesorului.
- **`ctx.close()`** = închiderea întregului browser de probă (oprește și trimiterile ascunse; `page.close()` nu ajunge). **BagMRU / Bags** = cheile din registrul Windows în care Explorer ține cum arată fiecare folder vizitat.
- **Componentă comună** = un fișier folosit de mai multe lecții (motorul, `lectii\_sim\*.js`, `prezenta.js`, `rezultat-elev.js`); **extensie** = fișier nou al unei lecții, care adaugă la o componentă fără s-o schimbe.

**Cum găsești o secțiune fără să citești tot:** `grep -n "^# Partea\|^## \|^### " C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/00_GHID_LECTII.md`, apoi `Read` cu `offset`/`limit`. Trimiterile `[surse: X:N]` duc la extrasul X, linia N, din `ghid_consolidat_25_10\extrase\`, unde stă sursa originală (fișier:linie, dată) — legenda în Anexa B.
