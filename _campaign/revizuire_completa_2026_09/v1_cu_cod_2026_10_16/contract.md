# Contract — Lecția V/1 refăcută: intrarea pe numele tău, cu codul  (16.10.2026)

## Cererea (verbatim)
> lectia https://learninghub-8z6.pages.dev/lectii/v/m1-l01/ trebuie refacuta - acum avem si cod

## Ce e acum (măsurat pe disc, 16.10.2026, 09:50)
- Lecția `lectii\v\m1-l01\index.html`, publicată ultima dată pe 07.10 (`9c87c14e`). Codul apare într-un singur rând
  din introducere: „scrie numele și prenumele ca în catalog și un cod de 4 cifre, notat în caiet”.
- Pasul „Cine lucrează acum?: apasă pe numele tău” NU spune că urmează codul. De la 30.09, `assets\js\prezenta.js`
  cere codul la fiecare intrare din listă („Salut, X! … cu un cod de 4 cifre” → Intră).
- Lecția nu pomenește deloc: „Mi-am uitat codul” → „Trimite cererea” → „Cererea a ajuns la profesor.”;
  5 coduri greșite = 30 de secunde de pauză; „Ieși (deconectare)” → „Data viitoare îți cer codul.”; „Jurnalul meu”;
  „Progresul tău stă doar pe calculatorul ăsta.” + „Păstrează-l online”; „Mi-am scris greșit numele, clasa sau
  școala”; „Scoate-mă din lista calculatorului”; continuarea acasă sau pe telefon cu același nume și același cod.
- Poza `img\casete-cine-lucreaza.webp` arată casetele de dinainte de cod.
- Aceeași lipsă și la celelalte lecții 1: „cod de 4 cifre” apare de 0 ori în VI/1, de 0 ori în VII/1 și o dată în VIII/1.

## Proba realității
Ce face elevul de a V-a (10-11 ani) cu lecția: o deschide în laborator, pe un calculator comun, fără profesor lângă
el, și urmează pașii literal, apoi:
1. își alege un cod, îl scrie în caiet și intră pe numele lui;
2. iese („Ieși (deconectare)”) și intră din nou din listă, cu codul;
3. acasă sau pe telefon scrie același nume, aceeași clasă și același cod, și vede ce a lucrat la școală;
4. dacă și-a uitat codul, știe ce să apese și ce urmează.

Greșelile reale de până acum (din fișa evidenței activității), pe care lecția trebuie să le prevină:
- doi elevi care și-au schimbat codul în timpul orei (13.10);
- nume scris greșit sau altă clasă aleasă, de unde ies două înscrieri pentru același elev (13.10 și 15.10);
- intrarea pe numele altui elev de pe calculatorul comun.

Elevii de a V-a au trecut deja de lecția 1 (11.09). Deci lecția trebuie să meargă și pentru cine ESTE deja înscris:
fără cod, cu un cod sau cu două coduri.

## R — cerințe explicite  (cine verifică · „gata” =)
- R1. Codul are pasul lui în lecție (nu un rând în introducere): „Uite cum” + „Încearcă” de aplicare.
  Pasul acoperă cele 6 situații: (a) prima înscriere: alegi codul, îl scrii în caiet, nu-l spui nimănui;
  (b) intrarea din „Cine lucrează acum?” cu codul; (c) ieșirea și întoarcerea; (d) același nume și același cod
  acasă sau pe telefon, cu progresul de la școală; (e) „Mi-am uitat codul”, cu ce face profesorul după;
  (f) ai lucrat până acum fără cod: „Păstrează-l online”.
  · verifică: judecător independent (opus) + un cititor-începător (`/plimbare`, profil de clasa a V-a)
  · gata = toate cele 6 situații prezente și rezolvate de cititor din pagină, cu citat; 0 BLOCAJ.
- R2. Fiecare nume de buton sau de mesaj din lecție există, literă cu literă, în `prezenta.js` / `motor.js` de azi.
  · verifică: script (numele dintre „…” din lecție, căutate în cele două fișiere) + judecător
  · gata = 0 nume negăsite.
- R3. Pozele noi sunt capturi ale casetelor ADEVĂRATE de azi (cu cod), cu nume inventate, nu desene.
  · verifică: scriptul de captură din `_proba\`, rulat pe `prezenta.js` de azi + judecătorul compară poza cu pagina
  · gata = poza veche înlocuită; 0 diferențe de text între poză și caseta reală.
- R4. Exersarea în pagină (un atelier care imită caseta cu cod) NU atinge înscrierea adevărată.
  · verifică: probă cu rețeaua blocată + cheile `lh_*` din localStorage citite înainte și după
  · gata = 0 chei `lh_elevi_pc` / `lh_coduri` / sertare schimbate de atelier; 0 cereri spre server.
- R5. „Acum la calculatorul din laborator”, fără profesor: elevul intră pe numele lui cu codul, iese, intră din nou
  cu codul și își scrie codul în caiet; calculatorul comun rămâne pentru următorul elev („Nu ești tu? Schimbă
  elevul” / „Ieși (deconectare)”).
  · verifică: judecător (pașii urmați literal în browser, la 1280 px și la 390 px cu atingere)
  · gata = pașii duc la „Profesorul vede activitatea ta” și înapoi, fără ajutor.
- R6. Restul lecției rămâne corect: unitățile anului, cele trei niveluri, lucrarea, nota (80% lucrarea + 20% situl).
  · verifică: oracolele existente: `_campaign\notare_punctaj_2026_09_29\verifica_regula.py`,
    `_campaign\isj_aliniere_2026_10_01\oracol_m1l01.py`, `_campaign\nota_site_2026_10_07\oracol_nota_site.py`
  · gata = fiecare dă 0, ca înainte.
- R7. 0 GRAV / 0 MAJOR de la un judecător independent, pe ultima trecere.
  · verifică: `_verificare\judecatorN.md` (ultima linie = numărul de GRAV) · gata = 0 și 0.
- R8. Publicat și verificat pe situl viu.
  · verifică: `dirijor\publica_lectie.py v/m1-l01` · gata = ultima linie 0 (conținutul LIVE = fișierul comis;
    `fum_live.py`: 0 erori la 390 și 1280, 0 cereri spre teste-vasile).
- R9. Probele nu lasă urme la profesor și nu publică date personale (regulile 24 și 27).
  · verifică: `python C:\00\AI_0\tools\activitate.py lista` (fără elevi de probă noi) +
    `python C:\00\AI_0\tools\learninghub_date_personale.py` · gata = 0 elevi de probă noi; ultima linie 0.
- R-pur. Faptele schimbate în timpul lucrului trec prin `fapte.py corecteaza`.
  · verifică: `python C:\00\AI_0\tools\fapte.py verifica --lucrare <acest dosar>` · gata = ultima linie 0.
  Varianta finală o scrie o singură mână (autorul). Semnalările `cititor_pachet.py`, dacă îl rulez, sunt reparate
  sau trecute la NESIGUR.

## I — cerințe implicite
- I1. Componentele comune (`prezenta.js`, `motor.js`, `rezultat-elev.js`) NU se schimbă în lucrarea asta. Dacă
  lecția cere o schimbare acolo, o scriu în raport; schimbarea trece doar prin poarta de lansare.
  — implicat de: `/lectii` „Nu negocia”.
- I2. Lecția nu promite ce sistemul nu garantează. De exemplu, munca de dinainte de cod apare pe alt aparat doar
  prin „bilet”, doar pentru elevii din catalog și nu la „Altă școală”. Ce nu e probat se scrie prudent și intră în
  `nesigur`.
  — implicat de: „acum avem și cod” (codul e nou, are limite).
- I3. Codul e secretul elevului și nu se spune colegilor. Lecția spune DE CE, simplu: cine îți știe numele și codul
  poate lucra pe numele tău. [corectat 16.10, fapte.json `cod_ascuns`] În caseta reală cifrele se văd cât le scrii la
  „Cine ești?” și la „Păstrează progresul online”; ascunse sunt doar la „Salut, X!”, „Mi-am uitat codul” și corectură.
  Lecția nu promite ascunderea; caseta de exersare face la fel ca cea reală.
  — implicat de: calculatorul comun, regula 23.
- I4. Lecția încape în ora de 50 de minute: pasul nou înlocuiește bucata din introducere, nu se adaugă peste ea.
  — implicat de: plafonul de pași din `05_STANDARD_LECTIE.md`.
- I5. Nimic cerut înainte de a fi arătat; propoziții scurte; diacritice; termen nou explicat la prima folosire.
  — implicat de: cuvintele lui din 27.09 + `decizii-implicite.md`.
- I6. Probele nu pornesc Chrome/Edge reali (regula din 12.10); folosesc browserul Playwright, cu rețeaua blocată.
  — implicat de: `luni_12_10\prompturi\_zi.md`.

## Cititorul-țintă
ȘTIE: să citească, să miște mouse-ul, să facă clic, să atingă pe telefon; numele școlii și al clasei lui.
NU ȘTIE: ce e un cod sau o parolă pe un site; că lista „Cine lucrează acum?” e a calculatorului, nu a clasei;
că progresul trece pe alt aparat doar cu același nume și același cod; ce face profesorul cu „Mi-am uitat codul”.
CUM SE POARTĂ: apasă primul buton mare pe care îl vede; alege alt cod pe telefon dacă nu i se spune clar;
se grăbește spre lecție și sare peste întrebarea „Ești tot …?”.

## Glosar de sensuri
- „refăcută” = lecția primește un pas întreg despre intrarea cu cod (Uite cum + Încearcă + atelier + laborator) și
  o poză nouă; restul lecției se schimbă numai unde contrazice codul sau trimite la el. [presupus — întrebarea 1]
- „cod” = numărul de 4 cifre ales de elev la înscriere, cerut la fiecare intrare pe numele lui (nu codul clasei
  de la teste, nu cod de programare). [presupus, din `prezenta.js` §6]
- „gata” = R1-R9 + R-pur îndeplinite și lecția servită pe situl viu identică cu fișierul comis.

## Întrebări pentru tine (cu ce fac dacă nu răspunzi)
1. „Refăcută” înseamnă partea cu intrarea și codul, sau toată lecția scrisă din nou? → implicit: partea cu codul
   devine un pas întreg, cu exersare și poză nouă; restul (unități, niveluri, notare) rămâne, fiindcă a trecut
   judecătorii și e aliniat la regula 80/20 din 14.10.
2. VI/1, VII/1, VIII/1 au aceeași lipsă. Le fac și pe ele? → implicit: acum doar V/1; după ce trece judecătorii,
   același pas se copiază la celelalte trei, într-un al doilea val, dacă spui da.
3. La laborator, elevul își face codul ADEVĂRAT și intră pe numele lui (apare la tine în panou, ca activitate
   reală). E bine așa? → implicit: da.

## Decizii luate (după aprobare, 16.10.2026, ~10:05, răspunsurile lui)
- Întrebarea 1: **partea cu codul** devine un pas întreg; restul lecției rămâne (cum era implicitul).
- Întrebarea 2: **toate patru deodată** — V/1, VI/1, VII/1, VIII/1 în paralel. Contractul se aplică fiecăreia:
  R1-R9 + R-pur pe fiecare lecție; la R6, oracolele de notare rulează pe toate patru.
  Pasul nou și exersarea sunt la fel în fond la toate patru clasele (aceeași casetă), cu tonul potrivit vârstei.
  Atelierul are UN singur proprietar (o extensie nouă în `lectii\_sim\`), folosită de toate patru lecțiile.
- Întrebarea 3: **da, cod adevărat** la „Acum la calculatorul din laborator”.
- (dirijorul, ~10:37) **Locul pasului nou: imediat după „La ce folosește” (pasul 2 pe ecran), la toate patru.**
  De ce: caseta apare la deschiderea paginii, iar regula lui e „tot ce cerem să fie făcut să fie mai întâi predat”;
  cu pasul la final elevul parcurge 7 pași poate neconectat. Costul acceptat: la elevii cu lecția 1 începută (nu
  terminată) după 10.10, bara pașilor arată pașii văzuți cu unul mai devreme. VIII/1 îl pusese ca P8 → se mută.
- (dirijorul, ~10:42, după etapa 1 a VII/1) **DOI pași, la toate patru, pe forma VII/1:** P2 „pe numele tău, cu codul
  tău” = situațiile a, b, c (la școală: prima dată, din listă, plecarea); P3 = d, e, f (acasă/pe telefon, cod uitat,
  lucrat fără cod). Fiecare cu „Încearcă” pe caseta de exersare. De ce: șase situații într-un pas trec de plafonul
  standardului (110 cuvinte text / 85 „Uite cum”) sau se înghesuie; un concept pe pas. Costul: bara pașilor se mută
  cu doi la elevii cu lecția 1 neterminată (stelele și lecția terminată rămân). I4 (50 de minute) — măsurat la judecată.
