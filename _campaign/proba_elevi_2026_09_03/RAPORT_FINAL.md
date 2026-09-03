RAPORT FINAL DE COMISIE — LearningHub
Baza: 13 rapoarte de sectiune, 739 de semnalari confirmate pe continut + circa 25 pe paginile de navigare. Note ale evaluatorilor: elevi 5,4-8,0; inspector 4,0-6,7.

===========================================================
1. VERDICT
===========================================================
Situl e bun ca structura si prost ca acuratete. Materialul de invatare e coerent si se parcurge usor, dar promisiunile paginilor nu se potrivesc cu ce livreaza fisierele, iar chestionarele nu masoara nimic.

- Elevul slab: poate invata din el la clasa, cu profesorul in sala. Ii dai note de trecere false, pentru ca ghiceste raspunsul dupa lungime.
- Elevul bun: se plictiseste (nicio lectie nu are aprofundare) si, in mat-info si pedagogic, invata lucruri gresite ca fiind corecte.
- Profesorul: il poate folosi maine ca suport de ora, dar NU ca test si NU ca tema de casa (36 din 40 de lectii la sanitar si 18 din 18 exercitii la maistri n-au nicio rezolvare model).
- Inspectorul: il pica. Notele lui (4,0-5,1 pe liceu) vin din conformitatea cu programa: pagini de an care mint despre module si ore, lectii cu alt continut decat titlul, competente promise si nepredate.

Concluzie: nu se pune live ca atare. Se repara blocantele (o zi de lucru), apoi tiparele (majoritatea sunt o singura trecere automata).

===========================================================
2. CE TREBUIE REPARAT INAINTE DE A INTRA ELEVII
===========================================================
Pagini care nu functioneaza
1. tic/cls7 extra-web/lectia5-css-intro.html, liniile 51 si 234 — doua `<style>` scrise ca text neescapat inghit restul paginii; elevul vede doar obiectivele, cei 13 atomi lipsesc. Fix: `&lt;style&gt;` / `&lt;head&gt;`, apoi verifici ca atom-1...atom-13 exista in pagina.
2. tic/cls6 — chestionarele afiseaza raspuns dublat ("[A] BPortocaliu") in 26 din 38 de lectii. Fix: sterge litera din inceputul fiecarui string de optiune (un script), eticheta o pune motorul.
3. tic/cls6 — assets/css/lesson-atomic.css linia 1381: a doua regula .info-box are display:flex si asteapta markup pe care nicio caseta nu-l foloseste; 95 de casete se rup in coloane de un cuvant. Fix: scoate flex din regula globala. O linie.
4. liceu/stiinte/cls11/index.html — HTML rupt (containerul .modules-grid se inchide dupa 2 carduri, primul card Python isi pierde linkul si titlul) si 3 linkuri catre foldere care nu exista pe disc (m2-date-stiintifice, m3-simulari, m4-cybersecurity). Fix: repara containerul, scoate linkurile moarte.

Raspunsuri gresite predate ca fiind corecte
5. liceu/mat-info lectia1-lanturi-cicluri.html, ex. 2b — spune ca K4 are circuit eulerian pentru ca "toate gradele = 3 - par". 3 e impar. Fix: raspunsul e NU, cu justificarea "toate cele 4 noduri au grad 3, impar".
6. liceu/mat-info lectia4-coada-aplicatii.html, Q6 — cheia contrazice codul propriu al lectiei. Fix: pune ordinea din cod (front - pop - procesare) si sterge explicatia falsa din indiciu.
7. liceu/pedagogic lectia1-documente-formatare.html — 3 chei gresite: atom-2 c->b, atom-3 a->c, atom-4 d->b. La atom-4 elevul care stie corect e marcat gresit. Retestezi manual toate 5 intrebarile in browser dupa fix.
8. liceu/militar lectia2-procesare-text.html — Q3, Q4, Q5 au marcajul "corect" pe alta varianta decat cea descrisa de propriul indiciu; muta-l pe (b) la toate trei si inlocuieste optiunea (d) de la Q5 (afirmatie inventata).
9. liceu/stiinte lectia6-proiect-integrator.html, atom 2 — "correct":"bc", dar motorul (assets/js/atomic-learning.js, linia 254) citeste doar prima litera, deci raspunsul corect e mereu marcat gresit. Fix: "correct":"c".
10. liceu/umanist lectia1-calculator-fisiere.html — la intrebarile despre calea Windows, variantele afiseaza backslash DUBLU, exact la itemul care testeaza scrierea caii. Fix cu Edit direct pe fisier (nu regex/heredoc, se strica din nou).

Siguranta si curatenie vizibila
11. liceu/stiinte lectia3-corespondenta-aplicatie.html, exercitiul 2b — trimite elevul sa introduca o parola pe un site extern. Adauga "foloseste o parola inventata, nu una reala".
12. liceu/stiinte lectia3-corespondenta-aplicatie.html, ATOM 6 — nota interna scapata in text vizibil elevului: "_curriculum_data.json, liniile 278-284" si "oracolul de referinta". Sterge.
13. liceu/artistic — sterge intrarea de proba test.html.

Conformitate care se vede la prima inspectie
14. liceu/militar/cls12/index.html — pagina se contrazice singura: eticheta zice "Bac E(d)" (Informatica, cu nota), titlul modulului zice "(proba D)", iar cele 6 lectii sunt integral proba D. Fix: eticheta pe proba D.
15. liceu/militar cls9-cls12 — fiecare pagina afirma "continutul este identic cu Mat-Info intensiv"; in realitate niciun modul de programare nu exista in militar. cls11 promite explicit backtracking, grafuri si cybersecurity, iar lectiile reale sunt design de slide si HTML de baza. Fix: sterge afirmatiile sau scrie continutul.
16. liceu/mat-info cls9-cls12 — modulele M1/M2 au tag "Python + C++" pentru toti elevii, desi pagina-parinte spune ca la non-intensiv "C++ NU se foloseste"; in plus, atomul "EXCLUSIV INTENSIV" nu e filtrat nicaieri, deci un elev de non-intensiv nu ajunge la 100% fara sa raspunda la C++. Fix: comutator de profil sau intrebarile de C++ intr-un chestionar bonus care nu conditioneaza progresul.
17. liceu/tehnologic cls10/m1-procesare-text — modul intreg asezat gresit in programa (procesarea de text e clasa a IX-a; cls. X tehnologic are Excel, Access, PowerPoint). Nu-l lasa live pe cls10 pana nu il muti la cls9 sau il inlocuiesti.

===========================================================
3. TIPARE DE REPARAT LA SURSA
===========================================================
T1. Raspunsul corect e cel mai lung — toate cele 13 sectiuni.
Cifre masurate: cls8 extra-databases 27/36 (75%) si extra-subprograme 21/43, fata de ~30% cat ar da hazardul; tehnologic m5-prezentari 17/24; umanist lectia1-prezentare 5/5 si 7/15 in alte doua lectii; pedagogic 8/11 intr-un modul si 5/6 in altul; militar multimedia 7/10; sanitar ~46 de intrebari pe toate cele 5 module; mat-info in cel putin 8 chestionare.
Reparatie unica: o regula de scriere a itemilor (4 variante de lungime apropiata, toate plauzibile, explicatia trece in indiciu, pozitia corecta amestecata) + un script care refuza publicarea daca varianta corecta e cu peste ~20% mai lunga decat media distractorilor. Pana atunci, notele date pe aceste teste nu masoara nimic.

T2. Distractori absurzi, care se elimina prin reflex — cls5 (cel putin 7 lectii), cls7 (4 module), sanitar (Recycle Bin refolosit in 3 din 6 intrebari la c1 lectia1), maistri (inclusiv in testul final c2/lectia6), tehnologic ("Excel-ul e defect si trebuie reinstalat").
Reparatie unica: aceeasi trecere ca la T1 — inlocuiesti varianta-gluma cu o greseala reala de incepator ("celulele goale primesc automat 0").

T3. Indexul promite un subiect, fisierul livreaza altul — circa 19 lectii: militar 5, pedagogic 4, stiinte 4, tehnologic 2, cls8 2, umanist 1, mat-info 1.
Reparatie unica: o verificare automata "nume fisier = titlu pagina = card in index = breadcrumb = obiective", rulata inainte de publicare. Atentie: unde competenta ramane nepredata (mail merge la tehnologic, baze de date la umanist cls12, retele la mat-info, procesor de text la pedagogic), redenumirea nu e suficienta — ramane gaura de programa.

T4. Cifrele din paginile de navigare sunt scrise de mana si sunt false — liceu/index.html "380+ lectii" fata de 272 reale; mat-info "~280h" fata de ~540h din propriul tabel; militar "4/3/4/3 module" fata de 2/2/2/1 reale (cifrele sunt cele de la mat-info, copiate); stiinte cls9 "4 module" fata de 2, cls10 "1 lectie" la un modul cu 2; artistic proba D "2 lectii" per modul fata de 1; cls5 tabel de recapitulare cu 6 lectii din 7; stiinte "din 1 lectii" la un modul cu 2.
Reparatie unica: genereaza toate numerele (module, lectii, ore) din ce exista pe disc, nu din text scris de mana.

T5. Exercitii si chestionare care cer materie nepredata — cel putin 15 cazuri: artistic 4 (ul/li, COUNTIF/SUMIF, prezentare-exemplu inexistenta, NTFS), mat-info 2 (inversare in-place, deque monoton), cls7 (SGBD, chei straine, ORDER BY — zero aparitii in cele 6 lectii; plus sablon care cere responsive, JavaScript si Google Fonts, nepredate), maistri, cls8.
Reparatie unica: verificare mecanica — fiecare termen dintr-un exercitiu sau chestionar trebuie sa apara macar o data in corpul unui atom al aceleiasi lectii.

T6. Zero rezolvari model — practic tot situl. Maistri: 0 aparitii ale cuvantului "rezolvare" in cele 18 exercitii ale modulului C1; sanitar: doar 4 din 40 de fisiere contin ceva de tip rezolvare; tehnologic m4-baze-de-date: 0 din 16 exercitii.
Reparatie unica: e o decizie de sablon, nu de lectie — adauga in sablonul de exercitiu un bloc pliabil "Vezi rezolvarea", macar la nivel minim si standard.

T7. Zero aprofundare pentru elevul bun — nicio lectie, in nicio sectiune. De aici vine si anomalia ca elevul bun da uneori nota mai mica decat cel mediu (6,4 fata de 6,2-7,3).
Reparatie unica: o caseta finala de sablon "Vrei mai mult?" cu 1-2 linkuri reale (MDN, tutorial gratuit, anm.ro, ghid ANSPDCP).

T8. Formule Excel inconsecvente — separatorul de argumente (virgula in unele lectii, punct-si-virgula in altele: pedagogic lectia2 vs lectia3, cls8 m2 lectia3 vs lectia4, tehnologic cls10 m2 lectia2); zecimale cu punct intr-o lectie care predase virgula; cota TVA tinuta ca 21 in maistri c1/lectia3 si ca 0,21 in c1/lectia6; functii date doar in engleza dupa ce SUM/AVERAGE primisera si varianta romaneasca (IF, COUNTIF, STDEV — fara DACA, NUMARADACA, ABATERE.STANDARD).
Reparatie unica: o singura conventie declarata la inceputul fiecarui modul de calcul tabelar, aplicata peste tot. Elevul care copiaza exact primeste azi eroare sau #NUME?.

T9. Cifre care se bat cap in cap in aceeasi lectie — marginile 2 / 2,5 / 2,54 cm si indentarea 1,25 vs 1,27 cm (cls5), titlu 32-44 pt vs 36-44 pt (pedagogic), font 18 pt vs 24 pt si "2 animatii" vs "3 animatii" in aceeasi lectie (cls6), A5 dat ca 25,4x16,9 cm (stiinte).
Reparatie: o trecere de coerenta pe valorile numerice, modul cu modul.

T10. Definitia abstracta inaintea exemplului — in aproape toti atomii introductivi din artistic, pedagogic, umanist, sanitar, cls6, maistri. Reparatie: inverseaza macar la primul atom din fiecare lectie (analogie/scenariu, apoi termenul). Conteaza direct pentru nota elevului slab.

T11. Termeni folositi inainte de a fi definiti — "complexitate amortizata", "stiva de apeluri" (mat-info), bitrate, gamut, curbe Bezier (umanist), SGBD, "cititor de ecran", "Insert Edit" (cls7), 5 acronime de portaluri auto nedesfacute (maistri C3). Regula de redactare: primul cuvant nou primeste paranteza explicativa.

T12. Metadata de clasa scrisa de mana si gresita — 58 de fisiere din pachetul "extra" al clasei a V-a spun `gradeName: 'Clasa a V-a'` desi citeaza competente de clasa a VII-a; lectii din folderul cls11 (umanist) spun de doua ori "Cls. X". Reparatie: genereaza clasa din calea modulului.

T13. Tema vizuala — caseta de raspuns din "Incearca singur!" e alba pe fundal intunecat in artistic, stiinte, umanist si sanitar. E in foaia de stil comuna, deci un fix.

T14. Greseli de tastare si text corupt — "folOSim", "se indagheaza", "estompar", "protejeza" (cls5); "nemcomprimat", "lucrar de laborator", "microscoopelor" (stiinte); "insearata", "structura radiala" in loc de "diagrama circulara" (tehnologic); litere chirilice in cls6 m2/lectia6 ("culeги ciuperci", de doua ori). Plus cuvinte lipite in chestionarele cls8 ("Ce este obaza de date?") — cauza e la sursa: scriptul care face data-quiz inlocuieste tag-urile inline cu sir gol in loc de spatiu. Repara scriptul si regenereaza, nu corecta manual.

T15. Note administrative afisate elevului — notele de conformitate cu programa sunt puse ca prim continut vizibil (tehnologic m1 lectia1), inaintea obiectivului; un indiciu spune "raspunsul asteptat de spec" (pedagogic). Muta-le la subsol sau sterge-le.

T16. Informatii invechite si afirmatii de verificat — Windows Movie Maker (oprit din 2017), Calibri dat ca font implicit modern (e Aptos din 2023), Wikipedia data pe MySQL (a trecut pe MariaDB), Ctrl+Shift+L in Access, recursivitatea plasata in clasa a XI-a, citarea "OMECI 5099/2009" din stiinte, portalul AIR/ISPI atribuit BMW (pare Opel/GM), Legea 449/2003 data ca in vigoare alaturi de OUG 140/2021 (pare abrogata), Ordinul MT 2133/2005 pe RNTR-1. Toate sunt afirmatii predate ca adevar — verificate intr-o singura sesiune, cu sursa notata in fisier.

===========================================================
4. PE SECTIUNI (nota generala si singurul lucru cel mai important)
===========================================================
- tic/cls5 (69 semnalari, inspector 5,0) — modulele de baza m1-m5 sunt bune; pachetul "extra cls7" e etichetat clasa a V-a in 58 de fisiere si 3 lectii n-au niciun exercitiu.
- tic/cls6 (36, inspector 5,0) — continut solid stricat de afisare: o linie de CSS si un script de curatare a literelor repara 95 de casete si 26 din 38 de lectii.
- tic/cls7 (75, inspector 4,8) — o lectie e complet invizibila in browser; doua quiz-uri de pe pagina de modul testeaza materie care nu se preda in niciuna din cele 6 lectii.
- tic/cls8 (53) — invatarea e cea mai curata din tot situl, evaluarea e cea mai stricata: 27 din 36 de intrebari cu raspunsul corect vizibil cel mai lung.
- liceu/artistic (47, inspector 5,8) — se predau tastele rapide din Photoshop ca fiind ale GIMP, in 3 locuri; se rezolva cu un tabel pe doua coloane.
- liceu/mat-info (98, inspector 5,1) — doua raspunsuri gresite predate (K4 eulerian si ordinea la coada) intr-o sectiune altfel de calitate; restul e erata de 30 de minute.
- liceu/militar (40) — 5 lectii livreaza alt subiect decat anunta, iar paginile de an sunt copiate de la mat-info si promit programare care nu exista nicaieri.
- liceu/pedagogic (47, inspector 4,0 — cea mai slaba) — 4 lectii sunt copii lipite din alt modul; nota scade pe masura ce evaluatorul se pricepe, semnul clasic de continut care pare bun pana il verifici.
- liceu/stiinte (49, inspector 4,3) — pagina clasei a XI-a e rupta in HTML si trimite catre 3 foldere care nu exista.
- liceu/tehnologic (112, cel mai mare volum) — un modul intreg sta pe clasa a X-a, unde programa oficiala nu-l are; restul modulelor se pot folosi acum.
- liceu/umanist (44, inspector 5,0) — caile Windows sunt afisate cu backslash dublu exact la intrebarea care testeaza scrierea caii.
- profesional/maistri (16, inspector 6,7 — cea mai bine notata) — zero rezolvari model la 18 exercitii: nu se poate invata acasa.
- profesional/sanitar (53, inspector 6,0) — continutul de cabinet e real si valoros, dar chestionarele se ghicesc in toate cele 5 module, inclusiv la evaluarea finala.

===========================================================
5. CE E BUN SI NU SE ATINGE
===========================================================
- Arhitectura pe atomi mici (obiectiv - continut - chestionar - exercitiu), identica pe toate sectiunile. Elevul stie mereu unde e. Nu se reinventeaza; se completeaza acolo unde lipseste (cls5 lectiile 7-9).
- Exercitiile pe trei niveluri (minim / standard / performanta) — gandite corect si consecvent aplicate.
- Ancorarea in profil, care nu suna artificial: atelierul auto la maistri, cabinetul si farmacia la sanitar, laboratorul de chimie si microscopia la stiinte, catalogul de opere literare si referatul de istorie la umanist, factura si TVA la tehnologic, contextul militar la militar.
- Indiciile care explica rationamentul, nu doar confirma litera (30 din 40 de lectii la sanitar au raspuns marcat SI indiciu).
- Ancorarea la programa cu coduri de competenta (OMEN 3393/2017, OMECI 5099/2009) — exista si e corecta ca fond, doar prost plasata.
- Separarea Python / C++ cu exemple rulabile la mat-info, si exercitiile ancorate in tipuri reale de subiecte de examen.
- Modele bune de chestionar care exista deja in sit si trebuie folosite ca sablon cand rescrii restul: pedagogic lectia2-pagini-web Q3-Q4, umanist lectia2 de la prezentari Q2-Q4, tehnologic m4-baze-de-date Q5-Q6 (distractori reali, pe integritate referentiala), maistri regula separatorului de argumente din lectia2-functii-diagrame.
- Navigatia si urmarirea progresului functioneaza; modulele de baza n-au fisiere orfane (o singura exceptie: extra-word-cls7/lectia6-proiect.html, de mutat in arhiva).
- Tema vizuala inchisa e consecventa (singura exceptie: caseta de raspuns alba, T13).

Ordinea de lucru recomandata: sectiunea 2 azi (o zi), apoi T1+T2 si T6+T7 in aceeasi trecere prin generatorul de chestionare si sablonul de exercitiu, apoi T3+T4 cu verificarea automata pusa in publicare. Dupa aceste trei valuri, situl trece de inspectie si se poate folosi pentru notare.