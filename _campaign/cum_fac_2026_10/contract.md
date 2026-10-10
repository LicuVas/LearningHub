# Contract — LearningHub: secțiunea „Cum fac…?” (10.10.2026)

## Cererea (verbatim)
> Pe Learning Hub, cred că ar fi super tare să facem o secțiune nouă despre cum să faci anumite lucruri. în ideea că să avem materialul din lecții modular și să avem un fel de căutare care să permită folosirea unor cuvinte diferite, care să extragă înțelesul din acele cuvinte și din acea expresie folosită de elev și să caute, de exemplu, cum salvez un fișier Excel sau cum închid un document Word sau selectare celule, selectare mai multe celule în Excel. și practic să primească o listă de rezultate cu cele mai relevantă la început și să vadă rapid materialul care să îi permită să lucreze în aplicația reală, să efectueze exact acea sarcină pe care dorește să știe cum să o facă.

## Proba realității
Elevul are Excel (sau Word, PowerPoint, Windows) deschis în laborator sau acasă și nu-și amintește un gest.
Deschide „Cum fac…?” într-o filă alăturată (sau pe telefon), scrie cum vorbește el („cum salvez excelu”,
„selectez mai multe casute”, „inchid wordul”), fără diacritice, poate cu o greșeală. Fără să deruleze,
vede rezultatul bun printre primele 3; deja în listă vede scurtătura și primii pași; deschide fișa și,
urmând LITERAL pașii în aplicația adevărată, face gestul în cel mult 2 minute, fără să mai citească altceva.
Proba se trece ÎNAINTE de orice recenzie: un agent-începător (carte închisă) caută cu vorbele lui și
execută pașii fișei, iar gesturile din Office se verifică în aplicația reală (Excel/Word/PowerPoint pe PC,
pornite invizibil, ca la oracolul Excel din 25.09).

## R — cerințe explicite  (cine verifică · „gata” =)
- R1. Secțiune nouă pe situl live, `/cum-fac/`, cu legătură din pagina principală a hub-ului și din `/lectii/`.
  · verifică: script (curl -A "Mozilla/5.0" pe adresa live + marcaj unic în pagină; grep pe cele două pagini)
  · gata = marcajul apare live și ambele legături duc acolo.
- R2. Materialul e modular și vine din lecții [rescris] (original: „să avem materialul din lecții modular”):
  fiecare FIȘĂ DE GEST (un gest = o fișă) e scoasă dintr-un pas al unei lecții publicate și ține trimiterea la
  lecția + pasul-sursă; fișa nu spune nimic ce lecția nu susține.
  · verifică: script (fiecare fișă are sursă existentă; ancora de text se găsește în lecție) + judecător
    independent (fișă vs. pasul-sursă, pe toate fișele) · gata = 0 fișe fără sursă, 0 contradicții cu lecția.
- R3. Acoperire: orice gest în aplicația reală predat în cele 42 de lecții publicate are fișă.
  · verifică: un agent independent face SEPARAT lista gesturilor din lecții (fără să vadă fișele); scriptul
    compară · gata = ≥ 95% acoperite, restul listate cu motivul.
- R4. Căutarea înțelege cuvinte diferite [rescris] (original: „care să extragă înțelesul din acele cuvinte și
  din acea expresie folosită de elev”): găsește fișa bună când elevul folosește sinonime, alte forme ale
  cuvântului (salvez/salvare/salvat), lipsă de diacritice, greșeli de tastare, numele englezești din meniu,
  cuvinte în orice ordine.
  · verifică: script (motorul de căutare rulat în node pe un SET ASCUNS de ≥ 150 de întrebări scrise de un
    agent independent ca de elevi de 10-14 ani, care NU vede formulările din fișe)
  · gata = fișa corectă în primele 3 la ≥ 90% din întrebări și pe locul 1 la ≥ 75%.
- R5. Exemplele lui trec, pe locul 1: „cum salvez un fișier Excel”, „cum închid un document Word”,
  „selectare celule”, „selectare mai multe celule în Excel” (și aceleași fără diacritice).
  · verifică: script · gata = 8 din 8 pe locul 1.
- R6. Lista are cele mai relevante rezultate la început [rescris] (original: „cele mai relevantă la început”):
  ordonare după scor; la o întrebare din afara materiei („cum fac clătite”, „cum instalez Minecraft”) pagina
  spune că n-a găsit și propune ce există, în loc să dea sigur un rezultat greșit.
  · verifică: script (R4 + ≥ 20 de întrebări din afara materiei, din setul ascuns)
  · gata = ≥ 18 din 20 primesc „n-am găsit” + propuneri.
- R7. „Să vadă rapid materialul” [rescris]: rezultatele apar în timp ce scrie (sub 100 ms pe întrebare); primul
  rezultat se vede fără derulare pe ecran de laborator (1366×768) și pe telefon (390×844); în listă se văd deja
  aplicația, scurtătura și primii pași; fișa se deschide în aceeași pagină, fără încărcare nouă.
  · verifică: probă de browser (Playwright, rețeaua blocată — regula 24) · gata = timpii măsurați sub 100 ms,
    capturile arată primul rezultat deasupra marginii de jos, la ambele mărimi.
- R8. Pașii fișei permit lucrul în aplicația reală [rescris] (original: „să îi permită să lucreze în aplicația
  reală, să efectueze exact acea sarcină”): pași executabili literal (UNDE, CE EXACT, CU CE confirmi), cu
  numele din panglică în română ȘI în engleză, scurtătura de taste, captura reală din lecție unde există.
  · verifică: agent-începător (carte închisă) urmează literal pașii pe ≥ 30 de fișe alese la întâmplare +
    aplicația reală (afirmațiile „faci X → apare Y” trecute în `afirmatii.json` și rulate în Office)
  · gata = 0 blocaje grave la agent; 0 afirmații false în aplicația reală.

## I — cerințe implicite
- I1. Româna cu diacritice corecte (ș, ț cu virgulă) în fișe; căutarea primește și text fără diacritice —
  implicat de: sit educațional românesc + „formularea elevului”.
- I2. Office în română și în engleză; numele funcțiilor Excel NU se traduc (`=SUM`, nu `=SUMA`) — implicat de:
  regula 6 din `05_STANDARD_LECTIE.md`; numele RO din `calibrare\meniuri_ro_en.json`.
- I3. Nimic nu pleacă de pe calculatorul elevului: căutarea rulează în pagină, nicio întrebare nu e trimisă
  nicăieri (elevi minori) — implicat de: [[project_baza_elevi]] (elevii MINORI = local). Verifică: proba de
  browser numără cererile externe în timpul căutării · gata = 0.
- I4. Merge pe telefon și pe PC-ul de laborator, și fără internet după prima încărcare; mod întunecat; zone de
  atins ≥ 32 px — implicat de: regula 20 + tipul produsului.
- I5. Fără fundături: din fișă, „Exersează în lecția X” deschide pasul-sursă chiar și pentru un elev care n-a
  deschis lecția niciodată (azi `?pas=` deschide doar pașii deja atinși — de verificat, poate trebuie o mică
  schimbare în `motor.js`, cu poarta de lansare); „Înapoi” păstrează căutarea — implicat de: navigare fără
  fundături. Verifică: probă de browser cu profil gol · gata = pasul cerut e cel afișat.
- I6. Termenii de specialitate din fișă sunt explicați pe loc (un rând sau o legătură spre fișa termenului):
  un elev de a V-a poate deschide o fișă de Excel — implicat de: regula 1 (nimic cerut înainte de a fi predat).
  Verifică: agent-începător · gata = 0 BLOCAJ pe termen neexplicat.
- I7. Când nu găsește: mesaj scurt + 3 propuneri apropiate + răsfoire pe aplicații (Excel, Word, PowerPoint,
  Windows, Pagini web) — implicat de: „ce vede cititorul când greșește”.
- I8. Ține pasul cu lecțiile: fișele se construiesc cu un script din lecții; dacă textul unui pas-sursă se
  schimbă, fișa e semnalată; contract nou în `selfcheck.py` — implicat de: „modular” + regula contractelor
  (ce agreăm să meargă nu rămâne în uitare).
- I9. Probele cu browser blochează tot ce nu e local (regula 24); User-Agent neutru (regula 22); fără date
  personale în ce se publică (regula 27).
- I10. Pagina veche „Vreau să fac…” (`hub/by-goal/`, proiecte pe teme) rămâne neatinsă; secțiunea nouă e alt
  lucru (gesturi, nu proiecte) — implicat de: „secțiune nouă”.

## Cititorul-țintă   [presupus]
ȘTIE: să citească românește; mouse, tastatură sau ecran tactil; numele aplicației pe care o are deschisă
(„Excel”, „Word”, „PowerPoint”) sau măcar ce face în ea („tabel”, „prezentare”, „referat”).
NU ȘTIE: neapărat termenii (registru, celulă, panglică, filă, diapozitiv); unde e o comandă în meniu;
diferența Salvare / Salvare ca; scurtăturile.
CUM SE POARTĂ: scrie 2-5 cuvinte, fără diacritice, uneori greșit („salvz”, „excelu”), uneori englezește
(„save as”), uneori descriind efectul („cum fac literele mai mari”, „cum scap de linia roșie”); citește doar
primul rezultat; nu derulează mult; are aplicația deschisă alături și vrea pașii ACUM.

## Glosar de sensuri
- „secțiune nouă” = pagina `/cum-fac/` pe situl live, cu legături din hub și din `/lectii/`.
- „cum să faci anumite lucruri” = un GEST într-o aplicație reală (Excel, Word, PowerPoint, Windows/Explorer,
  editorul de pagini web), care se face în cel mult 2 minute.
- „material modular” = fișă de gest mică, de sine stătătoare, scoasă dintr-un pas de lecție, cu trimitere la
  sursă; o fișă = un gest. [presupus: lecțiile NU se refac din fișe — vezi întrebarea 1]
- „extrage înțelesul” = găsește după sens: sinonime, forme ale cuvântului, fără diacritice, greșeli de
  tastare, nume englezești, descrierea efectului; măsurat pe setul ascuns (R4). [presupus: fără model AI —
  vezi întrebarea 2]
- „cele mai relevante la început” = ordonare după scor; măsurat cu locul 1 / primele 3 (R4, R6).
- „să vadă rapid” = în listă se văd deja scurtătura și primii pași; fișa se deschide pe loc (R7).
- „aplicația reală” = Excel, Word, PowerPoint din Office (RO sau EN) și Windows 10/11, ca în laborator.

## Întrebări de client (cu implicitul luat dacă nu primesc răspuns)
1. „Modular” înseamnă (a) fișe scoase din lecții, legate de pasul-sursă și semnalate automat când lecția se
   schimbă, sau (b) și lecțiile refăcute din aceleași blocuri (refacere mare a celor 42 de lecții)?
   → implicit: (a); (b) rămâne decizie separată.
2. Căutarea „după înțeles”: (a) în pagină, cu un dicționar de sensuri (merge fără internet, nu trimite nimic,
   răspunde pe loc) sau (b) un model AI descărcat în browser (30-100 MB pe fiecare calculator)?
   → implicit: (a); trec la (b) doar dacă (a) nu atinge pragurile din R4.
3. Ce intră acum: doar gesturile din cele 42 de lecții publicate (V-VIII), sau și gesturi încă nepredate
   (Excel avansat, liceu)? → implicit: doar cele 42; fișele cresc odată cu lecțiile publicate.
4. Pe fișă, și un „Încearcă aici” cu simulatorul din lecție? → implicit: nu acum; fișa trimite la pasul
   lecției unde se exersează (I5).
5. Să păstrăm (fără nume) întrebările care n-au găsit nimic, ca să îmbogățim dicționarul?
   → implicit: NU (elevi minori, nimic nu pleacă de pe calculator); îmbogățim din setul de test și din ce
   observi tu la oră.

## Durata și costul (estimare înainte de pornire)
[ESTIMARE] 6-8 ore, ~12-16 agenți, în valuri: (1) lista gesturilor + fișele, pe aplicații, ~2 h; (2) motorul
de căutare + pagina, ~1,5 h, în paralel cu (1); (3) setul ascuns + reglajul căutării, ~1-1,5 h;
(4) judecata fișelor + agentul-începător + aplicația reală, ~1,5-2 h; (5) publicarea + probele live, ~30 min.
Publicarea singur e verificată acum: `push_ready.py --repo C:\00\Projects\LearningHub` → „POT PUBLICA SINGUR”.

## Decizii luate (după aprobare)
- 10.10.2026 21:51 — profesorul: „aprob, porneste”. Toate cele 5 întrebări rămân pe implicit:
  1 = (a) fișe scoase din lecții, legate de sursă, semnalate la schimbare; 2 = (a) dicționar de sensuri în
  pagină, fără model AI (model doar dacă R4 pică); 3 = doar cele 42 de lecții publicate; 4 = fără „Încearcă
  aici” pe fișă; 5 = NU se păstrează întrebările elevilor.
