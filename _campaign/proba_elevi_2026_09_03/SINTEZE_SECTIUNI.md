**LearningHub — content/profesional/maistri/an1 (16 lectii: C1 aplicatii software 6, C2 baze de date 6, C3 internet 4)**

**1. Verdict:** se poate preda la clasa cu tine in sala, dar NU e gata pentru studiu individual acasa si NU e gata ca instrument de evaluare (chestionarele se ghicesc, exercitiile n-au rezolvari) — asta explica si nota cea mai mica, cea a inspectorului (6,7 din 10, fata de 7,0-8,0 de la elevi).

**2. Ce trebuie reparat, in ordine:**
1. **Chestionarele se pot rezolva fara sa citesti lectia.** Doua tipare: raspunsul corect e mereu cel mai lung si singurul cu explicatie in paranteza (c1/lectia1-structura-tabelului, Q1 si Q3), iar ceilalti 3 distractori sunt absurzi si se elimina fara nicio cunostinta (c2/lectia1-tipuri-de-date Q1, c2/lectia4-incarcarea-bazei Q4, si — cel mai grav — c2/lectia6-evaluare-c2, adica exact testul final). Reparatie: egalizeaza lungimea celor 4 variante si inlocuieste distractorii absurzi cu greseli reale de incepator ("randul de antet poate lipsi, Access il genereaza singur", "celulele goale primesc automat 0").
2. **Niciunul din cele 18 exercitii ale modulului C1 (3 x 6 lectii) nu are rezolvare** — cautarea dupa "rezolvare"/"solutie" da 0 aparitii in toate fisierele; la fel in C2 (lectia1-tipuri-de-date trece direct de la Exercitiul 3 la recapitulare). Elevul care lucreaza acasa nu are cum sa se verifice. Reparatie: sectiune colapsabila "Vezi rezolvarea" dupa fiecare exercitiu, macar la nivel minim si standard.
3. **Trei date factuale de verificat in C3** (acestea sunt afirmatii pe care le predai ca adevar): c3/lectia1-cautare-documentatie da portalul "AIR/ISPI" ca fiind al BMW, dar ISPI pare a fi portalul Opel/GM Europe — verifica si corecteaza; c3/lectia2-surse-de-incredere citeaza si OUG 140/2021 si Legea 449/2003 ca fiind ambele in vigoare, desi a doua pare abrogata de prima; tot acolo, Ordinul MT 2133/2005 ca act care aproba RNTR-1 trebuie confirmat pe rarom.ro sau in Monitorul Oficial.
4. **Doua conventii diferite pentru aceeasi cota TVA** in acelasi modul: c1/lectia3 tine 21 in G1 si imparte la 100 in formula, c1/lectia6 tine 0,21 in B2 si inmulteste direct. Ambele sunt corecte matematic, dar elevul care trece de la o lectie la alta aplica formula gresita. Alege una singura.
5. **Excel vs LibreOffice/Google Sheets:** lectiile 1, 2, 4, 5 din C1 dau pasii numai cu meniuri Excel (0 aparitii "LibreOffice"/"Sheets"), dar evaluarea finala (lectia6) presupune ca elevul poate lucra si in celelalte. Sau spui de la Lectia 1 ca pasii sunt de Excel si celelalte au denumiri diferite, sau alegi un singur program pentru tot modulul.

**3. Tipare care se repara o data, la sursa (nu lectie cu lectie):**
- Tiparul de chestionar (raspuns corect = cel mai lung / distractori absurzi) apare in C1 si C2, inclusiv in ambele lectii de evaluare finala — merita o regula de scriere a itemilor aplicata peste tot deodata, nu 4 corecturi punctuale.
- Lipsa rezolvarilor e generalizata pe tot anul 1, nu doar la C1 — e o decizie de sablon, deci se rezolva in sablonul de exercitiu.
- Definitia abstracta inaintea exemplului concret (C1/lectia1, Atom 1 si Atom 3): la conceptele noi porneste din atelier si abia apoi numeste termenul.
- Aglomerari de informatie fara sprijin: C3/lectia1 arunca 5 nume de portaluri (ERWIN, ETIS, AIR/ISPI, Dialogys, RMI) fara sa desfaca acronimele si fara sa mai revina la ele; C2/lectia4 Atom 6 baga TRIM, VALUE si Paste Special > Values, nepomenite inainte, in mijlocul unui bloc de text — pe astea muta-le in chenar "Pentru cei curiosi", ca elevul slab sa poata sari peste.
- Mic, dar vizibil imediat: in C1/lectia1 titlul lectiei apare de doua ori (in bara de sus si ca H1 mare cu gradient) inainte de continut.

**4. Ce e bun si nu strici:** structura pe atomi cu obiective declarate ("Vei putea"), atelierul auto ca fir rosu concret (piese, comenzi, cota TVA, garantie), progresia clara competenta -> lectii -> evaluare finala si scenariile de exercitiu ancorate in meseria reala. Elevii dau 7,0-8,0 tocmai pe asta. Reparatiile de mai sus sunt de continut si de itemi, nu de arhitectura — sablonul se pastreaza.

> Done.!.

======================================================================

VERDICT: Nu e gata de folosit la clasa asa cum e — trei module trimit elevul pe o lectie cu alt subiect decat scrie in index, iar asta se vede din primul ecran (mediile: elevi ~6/10, inspector 4,3/10).

CE TREBUIE REPARAT, IN ORDINE:
1. Potrivirea index ↔ lectie (4 locuri, cel mai grav). M1: index promite "Procesorul de text: structura si formatare", dar lectia1-documente-formatare.html e despre HTML; index promite "Imbinare corespondenta" la lectia 3, dar lectia3-corespondenta-aplicatie.html e despre securitate cibernetica; la Competente digitale, cardul lectiei 1 promite "sistemul de calcul si gestionarea fisierelor", iar lectia1-calculator-fisiere.html e despre retele; lectia4-prezentari-internet.html e despre identitate digitala/CV/GDPR, desi index si lectia 6 trimit elevul acolo "pentru prezentari". Reparatie: aliniaza titlul, descrierea si tag-urile de competenta din fiecare index.html cu continutul real, si acopera separat competentele ramase descoperite (formatare in procesor de text, gestionare fisiere, construirea unei prezentari) — nu doar redenumi si gata.
2. Nota interna scapata in text vizibil elevului: lectia3-corespondenta-aplicatie.html, ATOM 6, contine "_curriculum_data.json, liniile 278-284" si "oracolul de referinta". Sterge complet; daca schimbarea de tema trebuie explicata, o propozitie normala.
3. Chestionar rupt: lectia6-proiect-integrator.html, atomul 2 are "correct":"bc", dar motorul (assets/js/atomic-learning.js, linia 254) citeste doar prima litera, deci raspunsul AVERAGE(B2:D2) e mereu marcat gresit desi indiciul spune ca e corect. Pune "correct":"c" sau fa motorul sa accepte orice litera din sir.
4. Doua greseli factuale care se vad la inspectie: lectia5-editare-imagini.html numeste "format A5" un 25,4x16,9 cm (A5 real = 14,8x21 cm) — scoate eticheta; lectia1-imagine-digitala.html pune BMP in lista formatelor "lossless" desi in atomul anterior il numeste necomprimat — scoate BMP din lista.
5. Siguranta si programa: exercitiul 2b din lectia3 (securitate) trimite elevul sa introduca o parola pe un site extern fara sa spuna "foloseste una inventata" — adauga precizarea; iar citarea "OMECI 5099/2009" din lectia1-calculator-fisiere.html trebuie verificata inainte de publicare (o citare gresita de ordin te costa credibilitate la parinti).

TIPARE (se repara o data, la sursa, nu lectie cu lectie):
- Raspunsul corect e cel mai lung sau distractorii sunt absurzi — cel putin 6 intrebari (prezentare atom-2 si atom-5, audio-video atom-1/2/4/5, lectia4 Q6). Regula generala: distractori de lungime comparabila, gresiti plauzibil, nu comici.
- Titlul din index difera de h1-ul paginii chiar si cand tema e aceeasi (prezentari). Ar trebui generat dintr-un singur loc.
- Functii Excel date doar in engleza dupa ce SUM/AVERAGE au primit si varianta RO: IF, COUNTIF, STDEV → adauga DACA, NUMARDACA, ABATERE.STANDARD (altfel elevul pe Office in romana ia #NUME?), plus mentiunea ca STDEV.S e forma actuala.
- Greseli de tastare in acelasi grup de lectii: "nemcomprimat", "lucrar de laborator", "prism invers", "microscoopelor", "publicata web" — o trecere de corectura pe modulul de imagine si audio-video.
- Contorul de progres hardcodat: index.html cu "din 1 lectii" si totalLessons = 1 la un modul cu 2 lectii — genereaza numarul din cate carduri exista pe pagina.
- Nicio lectie nu are "ce urmeaza" pentru elevul care termina repede (VLOOKUP, pivot, tutoriale externe) — o casuta scurta la final, aceeasi peste tot.

CE E BUN SI NU STRICI: structura pe atomi mici cu "context stiintific" din laborator (chimie, microscopie) e legatura reala cu profilul stiinte si merita pastrata; exercitiile pe niveluri (baza/standard) si proiectul integrator din lectia 6 sunt bine gandite; tema dark e consecventa (singura exceptie: caseta "Incearca singur!" din lectia1-tabel-formule.html, care are fundal alb — stilizeaz-o inchis).

Una dintre cele 49 de semnalari e goala ("a: p | dovada: d") — zgomot, ignoreaz-o.

> Done.!.

======================================================================

VERDICT: NU e gata de folosit ca atare la clasa a X-a - are doua defecte care se vad din prima ora (modul asezat gresit in programa si o lectie care preda cu totul altceva decat scrie in titlu); restul modulelor merg folosite acum, cu mici corecturi.

CE TREBUIE REPARAT, IN ORDINE:
1. cls10/m1-procesare-text (tot modulul) - lectia1 admite singura ca procesarea de text e materie de clasa a IX-a, iar programa reala a cls. X tehnologic (OMECI 5099/2009) are doar Excel, Access si PowerPoint. Muta modulul la cls9 tehnologic sau inlocuieste-l cu materia reala de cls. X. Pana atunci nu-l lasa live pe cls10.
2. cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html - fisierul se cheama "corespondenta", index-ul promite imbinare de corespondenta (mail merge), dar lectia e integral despre PowerPoint, adica materia altui modul. Scrie lectia reala de mail merge, altfel obiectivul "sa realizezi imbinari de corespondenta" din index.html ramane nepredat in toate cele 3 lectii si 9 exercitii.
3. cls10/m2-calcul-tabelar/lectia3-aplicatie.html - cota TVA e pusa in B1, dar randul 1 e unit prin Merge pe A1:G1, deci B1 nu exista separat si formula =F11*$B$1 nu are ce citi. Muta cota pe randul 2-3 (sau I1) si actualizeaza toate referirile din atom si din exercitii.
4. cls11/m1-prezentari-multimedia - index.html trece "Notiuni audio-video" la competente Profil Tehnologic, dar chiar codul lectiei2 recunoaste, intr-un comentariu invizibil elevului, ca programa tehnologic nu contine audio-video. Scoate competenta din index sau pune eticheta "optional, in afara programei" pe pagina vizibila - altfel un inspector crede ca e materie obligatorie evaluabila.
5. cls10/m2-calcul-tabelar/lectia2-functii-diagrame.html - lectia stabileste separatorul ";" pentru setari romanesti, dar scrie zecimalele cu punct: =IF(D2<0.05; ...) si =IF(B2>500; B2*0.9; B2). Treci pe virgula, consecvent cu =E8*0,19 din lectia1.

TIPARE CARE SE REPETA (se repara o data, la sursa - in generatorul de chestionare/sabloane, nu lectie cu lectie):
- Raspunsul corect e sistematic cel mai lung: 17 din 24 de intrebari la m5-prezentari, toate Q1 din m4-baze-de-date, 4 din 6 la cls11 lectia1. Elevul ghiceste fara sa citeasca. Regula pentru generator: distractori de lungime comparabila si plauzibili, fara variante-gluma ("Excel-ul e defect si trebuie reinstalat").
- Zero rezolvari model: la m4-baze-de-date niciunul din cele 16 exercitii nu are raspuns la care elevul sa se raporteze acasa. Adauga macar la exercitiul minim din fiecare lectie un bloc pliabil "Vezi rezolvarea".
- Zero "mergi mai departe": nicio lectie n-are extindere pentru elevul bun (de aici si nota 6,4 de la evaluatorul-elev bun). O casuta scurta la final de lectie rezolva.
- Notele de conformitate cu programa sunt puse ca prim continut vizibil elevului (m1 lectia1), inaintea obiectivului. Muta-le la subsol sau in zona administrativa - sunt pentru profesor si inspector, nu pentru elev.
- Marunte, de trecut intr-o singura tura: eticheta "Aplicatii practice de profil" e in afara div-ului competencies-list in cls10/m1/index.html; VLOOKUP e promis in descrierea m2 dar nu apare in nicio lectie; "insearata" in loc de "inserata" (m5 lectia2); "uneste" scris cu diacritice intr-un text fara diacritice (m3 lectia3); "structura radiala" in loc de termenul din manuale, "diagrama circulara".

CE E BUN SI NU STRICI: structura pe atomi mici cu obiectiv, analogie si exemplu numeric complet functioneaza (calculul de cronometrare la animatii, exemplele de factura si de TVA); intrarea concreta prin "Provocare" la inceput de lectie e buna; exercitiile sunt pe trei niveluri si legate de profil tehnologic; intrebarile Q5-Q6 din m4-baze-de-date au deja distractori reali (integritate referentiala) - foloseste-le ca model cand rescrii restul; notele de conformitate cu programa exista si sunt corecte ca fond, doar prost plasate.

======================================================================

VERDICT: nu e gata. Se poate folosi la clasa cu supraveghere, dar NU se poate arata unui inspector si o lectie trebuie oprita pana la reparare (nota inspector 5.0 fata de 6.3-7.1 de la elevi = problema nu e lizibilitatea, ci corectitudinea si conformitatea cu programa).

CE TREBUIE REPARAT, IN ORDINE:
1. BLOCANT - lectia1-calculator-fisiere.html (cls. XII, competente digitale): la doua intrebari despre calea Windows, variantele afiseaza elevului backslash DUBLU (`C:\\Documente\\...`), exact la intrebarea care testeaza scrierea corecta a caii. Reparatie: in campul `options` din JSON, un singur backslash de escape (`\\`) per backslash real - cu Edit direct pe fisier, nu prin regex/heredoc (altfel se strica din nou).
2. MAJOR programa - modulul M1 cls. XII: lipseste complet domeniul "Baze de date" din cele 7 ale Probei D (OMEN 4923/2013), desi propria pagina de cercetare a sitului il listeaza. Reparatie: o lectie noua (tabele, campuri/inregistrari, interogare simpla) sau macar un atom in lectia 6; daca domeniul chiar nu se testeaza, scrie asta vizibil in modul.
3. MAJOR structura - lectia2-procesare-text.html: e anuntata "Procesare de text" (Word), dar contine integral HTML/pagini web; cuvantul "Word" nu apare deloc. Reparatie: redenumeste lectia la continutul real SI adauga o lectie dedicata Word (stiluri, tabele, corectura, imagini in text).
4. MAJOR chestionare - lectia1-prezentare-eficienta.html (5 din 5 intrebari), lectia2-stiluri-cuprins.html + lectia3-corespondenta-aplicatie.html (7 din 15): raspunsul corect e mereu varianta cea mai lunga si explicativa; elevul ghiceste fara sa fi citit. Reparatie: distractori de aceeasi lungime cu raspunsul corect (modelul bun exista deja in lectia2 de la prezentari, Q2-Q4).
5. MAJOR erori de fapt: lectia3-corespondenta - tabelul MLA arata "Prenume Nume" dar exemplul de dedesubt e "Rebreanu, Liviu" (corect e exemplul, corecteaza tabelul); lectia1-tabel-formule - avertizeaza ca minusul face numarul text, apoi da "-5" ca exemplu valid de numar (scoate "-" din avertisment).

TIPARE CARE SE REPETA (se repara o data, la sursa, nu lectie cu lectie):
- Generatorul de chestionare produce raspuns corect mai lung decat distractorii - e in 3 lectii din 2 module diferite. Fixeaza regula in sablon: toate cele 4 variante, lungime apropiata.
- Ordinea "definitie abstracta intai, exemplu concret la final" in aproape toti atomii (imagine-digitala, pagini-web, tabel-formule). La 1-2 atomi cheie pe lectie, inverseaza - asta ridica direct nota elevului slab.
- Termeni tehnici folositi fara definitie la prima aparitie: bitrate, gamut, curbe Bezier. Regula de redactare: primul cuvant nou = paranteza explicativa.
- Metadata clasei e scrisa de mana si greseste: lectia1-imagine-digitala (in folderul cls11) spune de doua ori "Cls. X"; lectia2 din acelasi modul nu are deloc nota curriculara si are alt badge. Genereaza clasa din calea/metadata modulului, nu hardcodat.
- Nicio lectie nu are sectiune de aprofundare pentru elevul bun (nota lui, 6.4, e sub a elevului mediu - se plictiseste). Adauga o caseta finala "pentru cei curiosi" cu 2-3 resurse reale.
- CSS: campul de raspuns din "Incearca singur!" e alb pe tema intunecata, iar caseta "Nota curriculara" se rupe vizual in coloane ca un tabel - ambele sunt in foaia de stil comuna, nu in continut.

CE E BUN SI NU SE STRICA: structura atomica constanta (6-7 atomi + 3 exercitii pe niveluri) e clara si elevii o urmeaza; exemplele sunt ancorate real in umanist (catalog de opere literare, referat de istorie, recensaminte), nu generice; indiciile de la chestionar explica, nu doar confirma; lectia2 de la prezentari are deja distractori echilibrati - foloseste-o ca model cand rescrii celelalte chestionare.

======================================================================

**Sectiunea content/tic/cls7 (10 module, verificat pe disc la `C:\00\Projects\LearningHub\content\tic\cls7`)**

1. **Verdict: NU e gata de dat elevilor asa cum e** - o lectie nu se vede deloc in browser si doua quiz-uri testeaza materie care nu se preda nicaieri; restul e utilizabil dupa reparatii punctuale.

2. **Ce trebuie reparat, in ordine:**
   - **BLOCANT** - `extra-web\lectia5-css-intro.html`: doua `<style>` scrise ca text nescapat (liniile **51** si **234**, confirmat cu grep) deschid un element real care inghite tot restul paginii; elevul vede doar obiectivele, iar cei 13 atomi, 6 chestionare si 3 exercitii sunt invizibili. Fix: `&lt;style&gt;` / `&lt;head&gt;` in ambele locuri, apoi reverificare cu un parser ca atom-1...atom-13 exista in pagina.
   - **MAJOR** - `extra-baze-date\index.html`: Quiz 4 (chei straine, relatii 1:1/1:N/N:N) si Quiz 5 (SELECT/WHERE/ORDER BY) testeaza ce nu se preda - am verificat: "straina" si "ORDER BY" au **zero aparitii** in toate cele 6 lectii. Fix: scoate cele doua quiz-uri de pe pagina modulului pana exista lectiile care le predau.
   - **MAJOR** - `extra-proiect-web\lectia2-pagina-principala.html` si `lectia3-pagini-multiple.html`: `<header>` e explicat ca unul din cele 4 tag-uri semantice, dar codul model nu-l foloseste (`<nav>` direct in `<body>`). Fix: pune `<header>` in jurul `<nav>` in ambele exemple.
   - **MAJOR** - `extra-multimedia\lectia2-taiere-lipire.html`: "Insert Edit" e in titlu si obiectiv, dar apare prima data explicat abia in indiciul intrebarii 5. Fix: redenumeste peste tot in "Ripple Delete vs Normal Delete".
   - **MAJOR** - `extra-baze-date\lectia3-campuri.html`: optiunea corecta contine literal "singurul tip corect", deci se raspunde fara sa fi citit. Fix: scurteaz-o la "Text", cat celelalte trei.

3. **Tipare care se repeta - astea se repara o data, la sursa:**
   - **Chestionarele nu masoara nimic.** In cel putin 4 module raspunsul corect e vizibil cel mai lung si mai tehnic, iar distractorii sunt absurzi ("Un joc video", "Fac documentul mai lung"). Asta explica de ce elevul slab si cel mediu au aceeasi nota (6.2) - quiz-ul nu-i separa. Regula unica: 4 optiuni de lungime apropiata, distractori = greseli reale de incepator, nu glume.
   - **Termeni ceruti inainte de a fi predati**: SGBD, "cititor de ecran", "Insert Edit", "public tinta", chei straine. Regula: orice termen dintr-un chestionar sau exercitiu trebuie sa apara intai in corpul unui atom.
   - **Sablon de exercitiu copiat identic** in lectiile 2-5 din `extra-proiect-web`, care cere design responsive, JavaScript si font Google - niciunul predat. Se editeaza sablonul, nu cele 4 lectii.
   - **Denumiri inconsistente**: `images/` in lectia 3 vs `imagini/` in lectia 6 (confirmat: 3 vs 2 aparitii). Unifica pe `images/`.
   - **Exercitii care cer materie de mai tarziu**: `extra-baze-date\lectia2` cere "doua tabele legate", dar cheia primara vine abia in lectia 4.

4. **Ce e bun si nu se atinge:** structura atom -> chestionar -> exercitiu pe 3 niveluri e consecventa in tot setul si functioneaza; ancorarea la programa OMEN 3393/2017 exista in majoritatea lectiilor (doar de completat unde lipseste, ex. `extra-multimedia\lectia5-proiect.html`); analogiile de deschidere si limbajul sunt potrivite pentru clasa a 7-a; modulele Word (m1, m2) si cele de algoritmi n-au nimic blocant - le lipseste doar calibrarea chestionarelor.

Nota mica a inspectorului (4.8) vine din punctele 2 si 3, nu din continutul propriu-zis: materia predata e corecta, dar promisiunile modulului si evaluarea nu se potrivesc cu ea.

======================================================================

VERDICT: sectiunea se poate preda MAINE la clasa, cu profesorul in sala, dar NU e buna pentru studiu individual acasa si NU e buna de notat cu ea (chestionarele se pot ghici); note medii 6,8 / 7,7 / 7,1 si 6,0 de la inspector.

CE TREBUIE REPARAT, in ordine:
1. [major, toate cele 5 module] Raspunsul corect e sistematic cel mai lung din cele 4 variante - c1 lectia1 (5 din 6 intrebari) si lectia3 (4 din 5), c3 toate 3 lectiile (12 din 18), c4 (19 intrebari), c5 (8 din 18), c2 Q3/Q6. Reparatie unica: muta explicatia lunga din varianta corecta in campul "indiciu" si adu toti distractorii la aceeasi lungime; regula: nicio optiune nu se identifica dupa lungime.
2. [major, tot modulul] Din 40 de fisiere de lectie, doar 4 contin ceva de tip raspuns/rezolvare - exercitiile practice (inclusiv cele de nivel performanta, cu calcule) n-au model de rezolvare nicaieri. Adauga la fiecare exercitiu o casuta pliabila "Vezi un model de rezolvare", ca la indiciile de chestionar.
3. [factual, de corectat acum] c1 lectia3 exercitiul 3: "4,2 GB (adica 4.300 MB)" - scrie 4.200 MB sau spune explicit ca folosesti 1 GB = 1024 MB (lectia foloseste conventia zecimala la MB/s). c2 lectia2 atom1: .xlsx e formatul Excel; LibreOffice Calc salveaza implicit .ods. c4 lectia2 atom2: Base64 creste fisierul cu 33% teoretic, 37% doar cu separatorii MIME. c4 lectia1 atom3: pune articolul exact din Legea 95/2006, altfel afirmatia nu e verificabila.
4. [obiective predate dar netestate] c3 lectia2 atom 7 (doua tabele legate, Cod_Pacient) e singurul atom fara chestionar, desi e obiectivul declarat #6. c2 lectia4 preda "bara orizontala" dar niciun chestionar si niciun exercitiu n-o cere. c4 lectia3 atom6 preda cele 72 de ore de notificare ANSPDCP, dar intrebarea cere doar "primul pas". Adauga cate o intrebare la fiecare din cele trei.
5. [distractori] "Recycle Bin" e refolosit ca varianta-gluma in 3 din cele 6 intrebari ale c1 lectia1; la c2 Q3 toti distractorii incep cu "Doar..."; la c5 lectia1 Q1, 3 din 4 sunt absurzi. Se elimina prin reflex, nu prin cunostinte - inlocuieste-i cu greseli plauzibile.

TIPARE (se repara o data, in sablon, nu lectie cu lectie):
- lungimea variantei corecte - toate cele 5 module, e aceeasi greseala de generare a chestionarelor;
- lipsa raspunsului model la exercitii - toate lectiile;
- lipsa oricarei resurse de aprofundare sau link extern (anm.ro/Nomenclator, ghid ANSPDCP, ghid de citare) - recapitularile trimit doar la lectia urmatoare;
- atomi supraincarcati fara pauza - c3 lectia2 atom3 are 799 de cuvinte cu 3 proprietati diferite, c4 lectia1 atom6 are 5 subteme; se taie in doi atomi cu chestionar la mijloc;
- "Rezumat vizual al relatiilor" e text cu + si sageti, nu schema - in toate cele 3 lectii c1: fie ii spui simplu "Rezumat", fie faci schema;
- definitia inaintea exemplului la conceptele abstracte (RGPD, secret profesional) - la elevul slab, inverseaza: intai scenariul din cabinet, apoi termenul.
- marunt: la c5 lectia1, caseta de scris raspuns e alba pe pagina intunecata - pare element neterminat.

CE E BUN SI NU SE ATINGE: structura obiectiv - continut - chestionar - exercitiu e identica pe toate cele 40 de lectii, deci elevul stie mereu unde e; exemplele sunt reale din cabinet/farmacie (consimtamant, evidenta pacientilor, retete, RGPD), nu generice; 30 din 40 de lectii au chestionar cu raspuns marcat SI indiciu; termenii tehnici sunt tradusi la prima aparitie (singura scapare: "indexate", c2 lectia2); exercitiile sunt pe trei niveluri, inclusiv performanta.

> Done.!.

======================================================================

STARE: content/tic/cls6 (5 module, 38 lectii) — note medii 6.2 / 7.3 / 7.2, inspector 5.0; 36 semnalari confirmate.

1. VERDICT: nu e gata de folosit ca atare — continutul e solid, dar doua defecte de afisare lovesc TOATE lectiile si se vad din primul minut la clasa; dupa cele 3 reparatii de mai jos devine utilizabil.

2. CE TREBUIE REPARAT, in ordine:
   a) Chestionarele afiseaza raspunsuri dublate ("[A] BPortocaliu"). Cauza: in "options" litera e lipita in text, iar motorul (assets/js/atomic-learning.js, l.280 shuffle + l.294 eticheta generata) pune peste ea propria litera dupa amestecare. AMPLOARE REALA, verificata acum: 26 din 38 de lectii, nu 4 — m1 (toate 6), m2 (5), m3 (4), m4 (5), m5 (6). Reparatie: sterge litera din inceputul fiecarui string de optiune; eticheta ramane treaba motorului.
   b) Casetele albastre ("Nota pentru inceput", "Ancora programa") se rup in coloane de cate un cuvant. Cauza: a doua regula .info-box din assets/css/lesson-atomic.css (l.1381) pune display:flex si asteapta .info-box-icon + .info-box-content — VERIFICAT: in tot cls6 sunt 95 de casete si ZERO folosesc acel markup. Reparatie la sursa: scoate flex din regula globala (sau muta-l pe o clasa .info-box--icon) — o singura linie de CSS repara toate cele 95.
   c) m2-animatii-scratch/lectia6-bucle.html: text corupt cu litere chirilice ("culeги ciuperci", de doua ori). Inlocuieste г si и cu g si i.
   d) Greseli factuale de predat gresit: lectia2-miscare (directia implicita a unui sprite nou in Scratch e 90, nu 0; si Scratch afiseaza -90, nu 270) si lectia4-bucla-repeta (Python NU are "for (i=1; i<=N; i++)" — scoate Python din enumerare sau adauga "for i in range(1, N+1):").
   e) m4-comunicare: 14 din 27 de atomi au titlu placeholder "N. Continut" in loc de subiectul real (care exista deja in concept-title) — copiaza concept-title in atom-title.

3. TIPARE (se repara o data, la sursa, nu lectie cu lectie):
   - litera lipita in optiuni: 26 fisiere, acelasi generator — un script de curatare rezolva tot;
   - .info-box: o regula CSS strica 95 de casete;
   - cifre care se bat cap in cap intre lectii: font 18pt (l3) vs 24pt (l6), animatii 1-2 (atom) vs 2-3 (chestionar in aceeasi lectie), Slide Master "nu se evalueaza la standard" dar exercitiul standard il cere, index/lectia1 spun ca prezentarile si algoritmii repetitivi NU se testeaza, dar sunt testati in l6 si l4 — alege o singura cifra/formulare si aplic-o peste tot;
   - chestionare cu 3 variante in loc de 4 (m1 l2 x2, m4 l6) si raspunsul corect mereu cel mai lung — se ghiceste dupa forma;
   - "Definitie" inainte de analogie la primul atom; inverseaza macar la primul atom din fiecare lectie (conteaza pentru elevul slab);
   - intrebari plasate inaintea atomului care preda faptul (m5 l2 si l5) — muta intrebarea la atomul corect.

4. CE E BUN SI NU SE STRICA: structura pe atomi (definitie-analogie-exemplu-chestionar) e coerenta si usor de parcurs; ancorarea in programa cu coduri de competenta; nivelurile minim/standard/performanta la exercitii; m1-lectia3 face corect avertizarea de aprofundare — pastrati-o ca model; m4-lectia1 si lectia5 au titluri descriptive de atomi — model pentru rest.

Fisiere-cheie: C:\00\Projects\LearningHub\assets\css\lesson-atomic.css (l.1381), C:\00\Projects\LearningHub\assets\js\atomic-learning.js (l.280-295), C:\00\Projects\LearningHub\content\tic\cls6\

======================================================================

**LearningHub — content/tic/cls5 — sinteza pentru profesor**

**1. Verdict:** se poate preda maine la clasa pe modulele de baza (m1-m5), DAR modulele "extra" (Word cls7, Birotice cls7) nu sunt gata: trei lectii n-au niciun exercitiu si tot pachetul e etichetat gresit ca fiind clasa a V-a. Note evaluatori 6,3 / 7,0 / 6,4 si inspector 5,0 — cel mai slab punctaj e la conformitatea cu programa, nu la explicatii.

**2. De reparat, in ordine:**
1. **Lectiile 7, 8, 9 din `extra-birotice-cls7` (audio-video, colaborative, programare) au 0 exercitii** (verificat pe disc: grep "exercise" = 0, fata de 3-4 la lectiile 1-5). Competentele afisate cer "elaborare/construire/implementare", deci elevul nu are unde aplica. Adauga minim 1 exercitiu practic per lectie (l7: clip 20-30 sec cu generic si Fade; l9: program care citeste doua numere si afiseaza suma).
2. **Eticheta de clasa e gresita in tot pachetul extra.** Verificat: 58 de fisiere spun `gradeName: 'Clasa a V-a'`, doar 6 spun a VII-a. Elevul vede literal "Clasa a V-a | Extra Birotice Cls7", desi textul citeaza competenta VII-1.1 din OMEN 3393/2017. Pune `gradeName` si `<title>` pe "Clasa a VII-a" in cele 9 lectii din birotice si in cele din word, sau marcheaza clar modulul ca BONUS avansat.
3. **Fisier orfan: `extra-word-cls7/lectia6-proiect.html`** — confirmat, nu e legat din `index.html` (navigarea merge lectia5 → lectia6-tehnoredactare → lectia7-proiect). E continut mort, aproape identic cu lectia7. Muta-l in arhiva, in afara folderului publicat.
4. **Tabelul de recapitulare din `lectia7-proiect.html` numara 6 lectii in loc de 7** si sare complet peste lectia6-tehnoredactare. Rescrie cu 7 randuri.
5. **Cifre care se bat cap in cap si deruteaza elevul la teza:** marginile (2-2,5 cm / 2,5 cm / 2,54 cm in aceeasi lectie), indentarea (1,25 cm in lectia2 vs 1,27 cm in lectia4), marimea titlului de referat (16-18pt in lectia6 vs 24-28pt in lectia7). Alege o valoare si pune-o peste tot.

**3. Tipare care se repara o data, la sursa (nu lectie cu lectie):**
- **Distractori absurzi la grile** — apare in cel putin 7 lectii ("Word nu poate lucra cu imagini", "Tabele nu au nicio utilitate", "O cutie cu butoane colorate"). Elevul ghiceste prin eliminare fara sa fi citit. Trece o data prin toate chestionarele si inlocuieste varianta absurda cu o confuzie plauzibila.
- **Doua casete care repeta acelasi lucru la inceputul fiecarei lectii** ("Ce vei sti sa faci" + "Dupa aceasta lectie vei putea") — e in sablon, se scoate din sablon, nu din 6 fisiere.
- **Greseli de tastare** ramase peste tot: "folOSim", "se indagheaza" (corect: se indenteaza), "estompar", "protejeza". Trecere de corectura pe tot folderul.
- **Informatii invechite**: Windows Movie Maker (oprit din 2017), Calibri "font implicit modern" (e Aptos din 2023).

**4. Ce e bun si nu se strica:** structura pe atomi cu chestionar dupa fiecare, si cele trei niveluri de exercitiu (minim / standard / performanta) la lectiile 1-5 — asta functioneaza si e exact ce lipseste la 7-8-9; extinde sablonul acolo, nu-l reinventa. Modulele de baza m1-m5 n-au niciun fisier orfan si sunt corect legate in navigare.

Fisiere: `C:\00\Projects\LearningHub\content\tic\cls5\` (raportul detaliat existent: `CLS5_AUDIT_REPORT.md`).

> Done.!.

======================================================================

VERDICT: nu e gata de dat pe mana elevilor asa cum e; doua lectii predau raspunsuri gresite si trebuie oprite azi, restul sectiunii e utilizabil la clasa dupa o erata de 30 de minute. Notele evaluatorilor (6.4-6.6 la elevi, 5.1 la inspector) spun acelasi lucru: continutul se poate parcurge, dar nu rezista la o verificare stricta.

DE REPARAT, IN ORDINE:
1. lectia1-lanturi-cicluri.html, Exercitiul 2 (b): indiciul zice "toate grade = 3 - par" si concluzioneaza ca K4 are circuit eulerian. 3 e impar, deci raspunsul corect e NU. Contrazice direct teorema Euler predata in atomul 4 al aceleiasi lectii si e exact genul de greseala care costa la BAC. Schimba raspunsul in NU, cu justificarea "toate cele 4 noduri au grad 3, impar".
2. lectia4-coada-aplicatii.html, intrebarea Q6: codul lectiei face front() - pop() - procesare, dar chestionarul declara corecta ordinea front() - procesare - pop() si sustine ca pop() inainte de procesare "pierde" valoarea (fals, valoarea e deja intr-o variabila). Corecteaza raspunsul la varianta din cod si sterge explicatia falsa din indiciu.
3. index.html + lectia1-retele-internet.html: indexul promite "Cum functioneaza internetul - IP, DNS, routere, pachete", fisierul livreaza securitate cibernetica si GDPR. Nicaieri in modul nu se preda cum circula un pachet. Pe termen scurt: schimba titlul si descrierea din index ca sa spuna adevarul; pe termen lung: scrie lectia de retele care lipseste.
4. Atomul marcat "EXCLUSIV INTENSIV" (ultimul din fiecare lectie, C++) e doar o eticheta text: nu exista niciun filtru, iar chestionarul si bara de progres il includ, deci un elev de la neintensiv nu ajunge la 100% fara sa raspunda la intrebari de C++. Ori scoate acele intrebari intr-un chestionar bonus care nu conditioneaza progresul, ori pune un comutator de profil.
5. Exercitii care cer tehnici nepredate: inversarea in-place (lectia1-vectori) si maximul pe fereastra glisanta cu deque monoton (lectia4-coada) cer metode care apar doar in hint. Adauga cate un exemplu scurt in atomi sau coboara cerinta.

TIPARE (se repara o data, la sursa, nu lectie cu lectie):
- Raspunsul corect e sistematic cel mai lung si mai detaliat din cele 4 variante - aparut in cel putin 8 chestionare, din module diferite. Elevul ghiceste dupa forma, nu dupa continut. Regula pentru viitor: toate cele 4 optiuni la lungime comparabila, explicatia se muta in hint.
- Jargon folosit inainte de a fi definit: "complexitate amortizata", "stiva de apeluri". Se rezolva cu o propozitie de definitie la prima aparitie.
- Continut duplicat intre lectii (parole si phishing in lectia1 si lectia4; aceeasi nota introductiva C++ repetata de 6 ori) - plictiseste elevul care parcurge modulul in ordine.
- Nicio lectie nu are model de raspuns partial la exercitiile de "nivel performanta" si niciuna nu are sectiune de aprofundare pentru cine termina repede.

CE E BUN SI NU SE ATINGE: structura de 6 atomi + chestionar + 3 exercitii gradate e coerenta si se parcurge usor; separarea Python / C++ cu exemple rulabile e valoroasa; exercitiile sunt ancorate in tipuri de subiecte de examen; erorile de fond sunt putine si concentrate (2 blocante din 98 de semnalari), restul sunt slabiciuni de formulare.

> Done.!.

======================================================================

VERDICT: Nu e gata de folosit la clasa. Cinci lectii predau cu totul altceva decat anunta indexul, iar un chestionar are trei raspunsuri corecte marcate gresit — asa cum e acum, ii invata pe elevi lucruri false si ii lasa nepregatiti la teza.

CE TREBUIE REPARAT, IN ORDINE:
1. lectia2-procesare-text.html — Q3, Q4 si Q5 au bifat ca „corect" varianta gresita; la toate trei, indiciul afisat descrie de fapt varianta (b). Muta marcajul CORECT pe (b) la Q3, Q4 si Q5 (la Q5 inlocuieste si optiunea (d), e o afirmatie inventata). E singura reparatie de 10 minute care opreste raul imediat.
2. Cinci lectii cu continut deturnat: lectia1-imagine-digitala.html (livreaza audio-video), lectia2-pagini-web.html (livreaza GIMP), lectia2-procesare-text.html (livreaza UI/UX), lectia2-retele-internet.html (livreaza comunicare digitala/phishing), lectia1-prezentare-eficienta.html (livreaza montaj video). Pana la rescriere, decide pentru fiecare: ori scrii continutul promis, ori corectezi titlul+cardul din index si obiectivele, ca elevul sa nu invete dupa o promisiune goala.
3. Materie care nu se preda nicaieri, desi e ceruta: HTML/CSS, raster vs vectorial si RGB/CMYK/HSL, tipuri de retea (LAN/WAN, IP, router, switch), design de slide (font, culoare, lizibilitate), procesare de text pentru proba D. Sunt goluri de programa, nu detalii de forma.
4. Chestionarele se pot ghici fara sa stii lectia: in modulul Word/stiluri si in modulul multimedia (7 din 10 intrebari) raspunsul corect e vizibil cel mai lung. Adu toate variantele la lungime apropiata sau scrie 1-2 distractori la fel de detaliati.
5. Greseli mici de continut de reparat la trecere: sintaxa IF cu paranteze patrate in lectia2-functii-diagrame.html (trebuie ghilimele), SUM vs SUMA folosite inconsecvent intre lectia 3 si lectia 6, exemplul „i5 cu 10 nuclee".

TIPARE CARE SE REPARA O DATA, LA SURSA (nu lectie cu lectie):
- Raspunsul corect e cel mai lung: apare in toate modulele verificate. Pune o regula la generarea chestionarelor (variante egale ca lungime) si o verificare automata inainte de publicare.
- Indexul promite un subiect, fisierul livreaza altul: 5 cazuri. Adauga o verificare automata care cere ca fiecare obiectiv de pe pagina de modul sa apara macar o data in lectia corespunzatoare.
- Marcajul „corect" nu se potriveste cu indiciul propriu: verificare automata indiciu-vs-raspuns, e exact tiparul de la punctul 1.
- Distractori din alta categorie decat intrebarea (WAV la un export video, „margini de pagina" la o intrebare despre formatarea caracterului) — se pot elimina fara sa stii nimic.
- Nicio lectie nu are „mergi mai departe" cu 1-2 linkuri externe; se adauga o data, in sablonul de lectie.

CE E BUN SI NU TREBUIE STRICAT: structura pe atomi scurti + chestionar + exercitii pe trei niveluri e solida si consecventa; exemplele in context militar sunt potrivite si nu suna artificial; lectia despre calcul tabelar (functii/diagrame) si cea despre prelucrarea imaginilor sunt real predate, cu formula DPI explicita si exemple rezolvate; navigatia si urmarirea progresului functioneaza. Reparatiile de mai sus se pot face fara sa atingi aceste parti.

======================================================================

VERDICT: NU e gata de folosit la clasa - din 4 module, 4 lectii predau cu totul altceva decat promite titlul lor, iar 3 chestionare au cheia de raspuns gresita; notele scad pe masura ce evaluatorul se pricepe (elev slab 6.0, elev bun 5.4, inspector 4.0), semn clasic de continut care pare bun pana il verifici.

DE REPARAT, in ordine:
1. lectia1-documente-formatare.html (modul "Procesare de Text") - lectia e integral despre Excel, copiata din alt modul. Se scrie o lectie reala de procesor de text (structura document, formatare caracter/paragraf, liste, aliniere), asa cum promite index.html.
2. Cheile de raspuns din aceeasi lectie: atom-2 "c" -> "b", atom-3 "a" -> "c", atom-4 "d" -> "b". La atom-4 elevul care stie corect ca Freeze Panes fixeaza antetul e marcat GRESIT, iar cel care invata "doar ce scrie" memoreaza ca Sort & Filter fixeaza antetul - fals inaintea unei teze. Dupa fix, se retesteaza manual toate 5 intrebarile in browser.
3. lectia1-imagine-digitala.html (modul "Imagini & Pagini Web") - nimic despre raster/vector, DPI, RGB/CMYK; e integral Word (stiluri, cuprins, note de subsol), pana si breadcrumb-ul zice "M2 Tehnici de documentare". Ori se scrie lectia de imagine digitala, ori se redenumeste modulul si indexul.
4. lectia3-calcul-tabelar.html - nu preda calcul tabelar, repeta aproape identic lectia1 (acelasi titlu). Se rescrie cu celule, formule SUM/AVERAGE, referinte, tabele, grafice.
5. lectia1-calculator-fisiere.html - nu preda sistem de calcul si gestionarea fisierelor (foldere, tipuri de fisiere, arhivare, cautare), ci tot documentare Word/Access. Se rescrie; continutul actual nu se mai duplica.

TIPARE (se repara o data, la sursa, nu lectie cu lectie):
- Lectii lipite din alt modul: titlul fisierului, titlul din index si breadcrumb-ul se contrazic in 4 locuri. O trecere unica "nume fisier = titlu = index = breadcrumb" pe tot liceul/pedagogic prinde tot.
- "Raspunsul corect = varianta cea mai lunga" apare in cel putin 3 module (8 din 11 intrebari intr-unul, 5 din 6 in altul). Chestionarul poate fi trecut ghicind dupa lungime. Se echilibreaza distractorii ca lungime si detaliu.
- Definitia abstracta inaintea exemplului, in fiecare atom introductiv - se inverseaza: analogie/exemplu, apoi definitia.
- Cifre care se bat cap in cap in aceeasi lectie (titlu 32-44 pt vs 36-44 pt; distanta 4-8 m vs 5-6 m) si separator de argumente virgula in lectia3 desi lectia2 preda explicit punct-si-virgula pe Excel romanesc - formulele copiate exact dau eroare.
- Instructiuni doar pentru Word, fara nota pentru Google Docs/LibreOffice - elevul fara Word acasa nu poate face exercitiul 1.

CE E BUN SI NU SE STRICA: lectia2-pagini-web (exemplu complet functional HTML+CSS, model real pentru exercitiu; Q3 si Q4 au variante echilibrate - acesta e sablonul pentru rescrierea celorlalte chestionare); lectia2-functii-diagrame, care preda explicit regula separatorului; numerotarea atomilor din lectia1/lectia2 la calcul tabelar (de extins si la lectia3); indiciile care explica rationamentul, nu doar litera - cu exceptia celui care spune "raspunsul asteptat de spec", care trebuie sters.

======================================================================

VERDICT: Sectiunea nu e gata de notare — se poate preda cu supraveghere, dar chestionarele NU se pot folosi la evaluare (raspunsul corect se ghiceste din forma) si 4 exercitii cer lucruri nepredate. Inspectorul a dat 5.8, cel mai mic scor, exact pe zonele de mai jos.

DE REPARAT, IN ORDINE:
1. Chestionarele care se ghicesc fara sa stii materia (major). lectia1-documente-formatare: la 6 intrebari (L1 Q7, L2 Q1/Q4/Q5, L3 Q3/Q5) varianta corecta e cea mai lunga. Reparatie: scurteaza varianta corecta sau lungeste distractorii la lungime comparabila.
2. Exercitii imposibil de rezolvat cu ce s-a predat (major). lectia1-html-css-baza ex.2 cere ul+li, nepredate in cei 6 atomi — adauga un exemplu ul/li in Atomul 4 sau muta cerinta in lectia 2. lectia3-evidenta-buget: COUNTIF/SUMIF apar direct in recapitulare, nepredate — treci pe NUMARADACA/SUMDACA cu ';'. lectia1-prezentare-eficienta ex.3 cere o prezentare gresita care nu exista — ataseaza-o sau descrie-o slide cu slide. lectia1-sisteme-calcul ex.1: inlocuieste NTFS cu un termen din atomi.
3. Taste rapide gresite pentru GIMP (major). lectia1-editor-straturi da setul Photoshop ca fiind comun (B/M/L/V) si trimite la bagheta magica cu W (in GIMP e U); lectia3-export-pregatire da Crop = C (in GIMP e Clone; Crop = Shift+C). Reparatie: tabel pe doua coloane, Photopea/Photoshop vs GIMP, in toate cele 3 locuri.
4. Greseala de fapt pe Google Sheets. lectia1-tabel-formule: limita de 10 milioane de celule e per FISIER, nu per foaie — inlocuieste formularea.
5. Curatenie si incadrare. Sterge intrarea de proba test.html; verifica in O.M.E.C. 4350/2025 daca modulul din cls10 e programa de clasa IX sau X (subtitlul se bate cu folderul) si la fel pentru prezentari la TIC XI artistic.

TIPARE (repara o data, la sursa, nu lectie cu lectie):
- "Corect = cel mai lung raspuns" apare in 4 module diferite; plus raspunsuri corecte grupate pe litera b (Q2-Q4 la navigare-cautare) si distractori absurzi (traducere automata la sabloane). Fa o singura regula de scriere a itemilor: 4 variante de lungime egala, toate plauzibile, pozitia corecta amestecata — si treci tot modulul prin ea.
- Exercitiu care cere ce nu s-a predat: 4 cazuri. Inainte de publicare, verifica mecanic ca fiecare termen din exercitiu apare in atomii lectiei.
- Notatii si celule inconsistente in acelasi modul: « » vs << >> la imbinare, I1 vs J1 la reducere. Alege o forma si aplic-o peste tot.
- Persoana gramaticala amestecata in aceeasi fraza ("Imaginati-va... alegi", "Creaza... dati") — tot pe persoana a II-a singular.
- Zero resurse de aprofundare in 4 lectii; adauga o casuta "Vrei mai mult?" cu 1-2 linkuri (MDN, tutorial gratuit) ca sablon reutilizabil.

CE E BUN SI NU SE ATINGE: structura pe atomi cu recapitulare, exercitiile pe 3 niveluri (minim/standard/performanta), terminologia romaneasca a functiilor cu ';' din modulul de calcul tabelar, legaturile intre module (trimiterea la PCI — doar formuleaz-o conditionat, "daca ai facut PCI"), si tema vizuala inchisa (singura exceptie: caseta de raspuns alba din "Incearca singur", de stilizat pe fundal inchis).

> Done.!.

======================================================================

VERDICT: sectiunea se poate preda la clasa asa cum e (continutul de invatare e solid), DAR nu se poate folosi ca evaluare pana nu se repara chestionarele - un elev le poate trece ghicind, fara sa stie materia.

CE TREBUIE REPARAT, IN ORDINE:
1. Raspunsul corect e cea mai lunga varianta - la extra-databases 27 din 36 intrebari (75%), la extra-subprograme 21 din 43 (49%), fata de ~30% cat ar fi hazardul. Reparatie: rescrie distractorii la aceeasi lungime si acelasi nivel de detaliu ca raspunsul corect (sau scurteaza raspunsul corect). Pana atunci, notele de la aceste teste nu masoara nimic.
2. Cardurile din index promit alta lectie decat cea reala. m1-excel-fundamente/index.html linia 385 zice "PROIECT FINAL: Buget Personal", dar lectia6-proiect.html e "Catalogul Scolar Complet". La fel m2-formule-functii/index.html liniile 363-369 promit "Gestiunea bugetului personal", iar lectia6-evaluare.html e test de evaluare. Reparatie: sincronizeaza titlul si descrierea cardului cu titlul real al paginii.
3. Greseala factuala in extra-databases/lectia4-interogari-simple.html: tabelul cu Like "???a" da ca exemplu "Ana", care are 3 litere, nu 4 - contrazice regula predata cu doua randuri mai sus. Reparatie: scoate Ana, pune "Anca" si "Vera".
4. Cuvinte lipite in enunturile de chestionar ("Ce este obaza de date?", "Ai formula=SUM(C2:C6)/5in celula F9", "instructiuneareturnintr-o functie"). Reparatie la sursa: in scriptul care face data-quiz din HTML, inlocuieste tag-urile inline (code/strong/em) cu un SPATIU, nu cu sir gol, apoi normalizeaza spatiile duble si regenereaza toate chestionarele.
5. Separator de argumente inconsistent in m2: lectia3 preda "=SUM(A1:A5, C1:C5)" cu virgula, lectia4 "=CONCATENATE(A2;\" \";B2)" cu punct-si-virgula. Elevul care copiaza exact primeste eroare in Excel romanesc. Reparatie: alege un singur separator si adauga o nota in lectia1 ca difera dupa limba programului.

TIPARE (se repara O DATA, la sursa, nu lectie cu lectie):
- Generatorul de chestionare produce ambele defecte de mai sus (lungimea si lipirea) in toate modulele - o singura trecere programatica peste toate cele ~48 de pagini rezolva tot.
- Blocul "Urmatoarea lectie" e text sablon reciclat: pe ultima lectie a modulului promite continuare si duce la index (extra-subprograme/lectia6-proiect.html), iar in m1/lectia7-sortare.html trimite la o lectie marcata "IN CURAND".
- Cinci afirmatii marcate DE VERIFICAT, toate de acelasi tip (detaliu tehnic dat din memorie): Ctrl+Shift+L in Access, Wikipedia pe MySQL (a trecut pe MariaDB), "www.scoala-mea.ro" numit domeniu, recursivitatea plasata in clasa a XI-a. Verifica-le pe toate intr-o singura sesiune.
- Access se cere in 4 lectii fara nicio alternativa gratuita mentionata. O caseta de 2 randuri (LibreOffice Base sau laboratorul scolii) in lectia3 acopera tot modulul.

CE E BUN SI NU SE ATINGE: impartirea pe atomi cu cod "copiaza si ruleaza", exercitiile pe 3 niveluri, casetele de nota curriculara si GDPR, hint-ul explicativ dupa fiecare raspuns (lipseste doar la m2/lectia4-functii-text.html - de adaugat acolo, dupa modelul celorlalte).