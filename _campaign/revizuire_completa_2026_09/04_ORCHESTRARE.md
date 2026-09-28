# Orchestrarea revizuirii — jurnalul dirijorului

**Pornit:** 27.09.2026, 11:50 · **Dirijor:** sesiunea principală Claude (Opus 5.5) · **Planul:** 01_PLAN.md

Regula dirijorului: fiecare agent primește o sarcină închisă, cu fișier de ieșire și probă mecanică. Nimic nu e „gata” până nu trece (1) proba mecanică rulată de dirijor și (2) un verificator independent (alt agent, care n-a scris lucrarea). Agenții de construcție ai mașinii NU văd bancul (dosar separat, poarta de contaminare).

## Valul 1 — fără decizii (pornit 27.09, ~11:55)

| Agent | Model | Ce face | Unde scrie | Proba dirijorului | Verificator |
|---|---|---|---|---|---|
| A. Bancul B0 + B1-B3 | sonnet | copia sitului la 147b684a; lecția din 27.09 înghețată + cele 9 etichete; 54 blocante + 123 majore + 100 minore (sămânță fixă) localizate pe copie; manifest SHA-256 | `C:\00\Projects\LearningHub_banc\` (repo git separat) | `banc_integritate.py` → 0; numărătorile 9/54/123/100 | C. judecător opus pe 50 de etichete (≥45 confirmate) |
| B1. Mutanți L01-L18 | opus | câte un defect ascuns pe fiecare rând de lecție L01-L18, în copii ale unor bucăți curate; cheia separat | `LearningHub_banc\mutanti\partea_1\` | fiecare mutant diferă de original exact în locul din cheie (diff mecanic) | verificator opus: defectul e real și e unul singur |
| B2. Mutanți L19-L36 + capcane | opus | la fel, L19-L36 + cele 8 capcane din plan §8 | `LearningHub_banc\mutanti\partea_2\` | idem | idem |
| D. Calibrare: meniuri RO/EN + constante | sonnet | numele RO ale filelor/comenzilor/funcțiilor Office din panglici și lecții, din 2 surse independente; constante_lume.json (TVA 21% cu sursa) | `revizuire_completa_2026_09\calibrare\` | JSON valid; fiecare intrare CONFIRMAT are 2 URL-uri diferite | verificator sonnet: 20 de intrări alese la întâmplare, re-verificate pe sursă |
| E. Faza 0: lecția nr. 4 | opus | ce există pe sit pentru lecția nr. 4 la V-VIII; uneltele existente rulate; pașii Delete/mutare/copiere rulați în Excel real (COM invizibil) | `revizuire_completa_2026_09\faza0\` | raportul are ultima linie = nr. de probleme grave; comenzile reproduse de dirijor | agenți cititor-începător (haiku) pe nivelurile alese, în Valul 2 |

## Valul 2 — după deciziile lui Vasile (1: Tupilați; 2-3: un conținut + ce văd elevii)
- banda „nu o folosi” pe lecția din 27.09 (publicare pe producție după OK);
- nivelul pentru lecția nr. 4 la fiecare clasă: parcurs de agentul-începător, reparat, „verificat parțial” cel mult; panoul pe săptămână;
- C. judecătorul bancului; controalele curate (25) confirmate.

## Valul 3 — mașina (faza 3a), după ce bancul e sigilat
dosar_dumb.py · valideaza_pas.py · executor în pagină (Playwright) · executor_excel.py (COM) · verif_lectie.py. Constructori opus; nu văd `LearningHub_banc`. Poarta: banc_masina.py cu pragurile deciziei 7.

## DECIZIA LUI VASILE (27.09.2026, ~12:10) — schimbă Valul 2+
„Reluăm siteul de la capăt. Facem primele lecții la gimnaziu — măcar pentru primul modul. Apoi continuăm cu al doilea și tot așa. Tot ce terminăm trebuie pus pe siteul live. Nu așteptăm până la final. Restul secțiunilor — modulul doi încolo — le marchezi ca fiind în lucru. Secțiunea cu jocuri e făcută mai bine, deci o lăsăm disponibilă.” + „accent practic, instrucțiuni clare și ilustrate, practică chiar în pagină; conceptele simplu și pe rând; tot ce cerem să fie făcut să fie mai întâi expus/predat.” + noaptea: „toate resursele necesare și toate permisiunile”.
Consecințe: standardul `05_STANDARD_LECTIE.md`; secțiunea nouă `/lectii/` (o lecție = o pagină = un nivel pe pași); M1 = lecțiile 1-7 din Calendar_ore, pe V-VIII (28 de lecții); ordinea de lucru: nr. 4 (săptămâna asta) → nr. 5 → 1-3 → 6-7; fiecare lecție publicată pe live imediat ce trece verificarea, cu insigna „verificat parțial” până trece mașina bancul. KB: decizie înregistrată.

## Valul 2 (pornit ~12:25)
| Agent | Model | Ce |
|---|---|---|
| Arhitect | opus | `lectii/plan.json` + build + hub + benzi „în lucru” pe paginile vechi de gimnaziu |
| Autori nr. 4 × 4 (V, VI, VII, VIII) | opus | `lectii/<cls>/m1-l04/` după standard |
| Mașina 1 | opus | `_masina/`: dosar_dumb.py, valideaza_pas.py, canar, fixturi proprii |
| Linia de verificare | opus | `verificare_lectii/verifica_lectie.py` (S0 test_joc, S1 identice, S2 practică ≥50%, T0 oracol, T1 plimbare) + arbitru_office.py |
| Judecătorul bancului | opus | 50 de etichete (≥45) |
| Verificatorul calibrării | opus | funcțiile netraduse + 20 aleatoare + NESIGUR |

## Stare (dovezi observate de dirijor)
- **A. Bancul** — `banc_integritate.py` → `MODIFICATE=0 LIPSA=0 IN_PLUS=0` / `0`; etichete: b0 = 9, B1 = 54, B2 = 123, B3 = 100 (LOCALIZAT 210, AMBIGUU 55, NELOCALIZAT 12); commit bancă `6589aa0`. Verificator: judecătorul C (în lucru).
- **E. Faza 0** — raportul are ultima linie `5` (grave: V 0, VI 0, VII 4, VIII 1). Rerulat de dirijor `excel_real_viii4.py` → 46 afirmații, CONFIRMAT 34, INFIRMAT 2, NETESTABIL 10 / ultima linie `2` (reprodus). Word prin COM merge. Tupilați: nicio planificare 2026-2027 în fișiere (termen 02.10, din vault).
- **D. Calibrarea** — `verifica_calibrare.py` → `0`; 141 intrări (127 CONFIRMAT, 13 NESIGUR, 1 NEGASIT). Descoperirea mare: **Excel RO nu traduce funcțiile** (`=SUM(`; `=SUMA(` → `#NAME?`); situl vechi are SUMA/DACĂ în 200+ locuri. Panel independent `verify.py --both`: codex TRUE, gemini TRUE. Verificatorul Opus pe 20 de intrări: în lucru. Standardul, regula 6, corectat. KB: învățătură înregistrată.
- **Bancul, judecata 1** (opus): 42/50 → PICĂ pragul 45. Reparat (opus): b0 10 (+B0-10 SUMA), B1 49, B2 135, B3 100 (LOCALIZAT), 5 respinse scoase în `respinse.json`, AMBIGUU 54/55 rezolvate, 31 dubluri unite; `verifica_citate.py` → 0 (rulat de dirijor). Judecata 2 (opus, eșantion nou 9090): în lucru.
- **Mutanții**: partea 1 = 29 (L01-L18, toate rândurile), partea 2 = 26 (L19-L34 + 8 capcane; L32/L33/L35/L36 neaplicabile, motivat). `verifica_mutanti.py` → 0 și 0 (rulate de dirijor). Niciun mutant nu e prins de poarta veche test_joc.
- **Calibrarea, verificarea independentă** (opus): funcțiile netraduse CONFIRMAT (7 surse noi); DAR 13/20 intrări aveau surse care nu conțin numele; 2 nume greșite (Print Area, AutoSum → „Însumare automată”); fără diacritice pe panglică. Validatorul vechi verifica doar forma. Reparator (opus) cu cache de surse + validator de conținut: în lucru.
- **Arhitectul** (opus): `lectii/` (plan.json 143 lecții, build, hub, benzi pe 371 pagini). Rerulate de dirijor: plan/build/banda/linkuri → 0/0/0/0; diff = +3 rânduri × 371, hub +24, 0 ștergeri. Link jurnal pentru `lectie_*` reparat de dirijor (test Node). `_campaign/` e public (200) — de spus lui Vasile.
- **Motorul, modul lecție** (opus): `mod:'lectie'`; test_joc --toate identic 27/27 în 3 rulări; Playwright 0 erori pe 3 jocuri + 4 lecții; `varianta()` reparat (12/60 → 60/60 variante rezolvabile din textul afișat), `.catch` pe clipboard. Texte diplomă/jurnal/diplome.py (sonnet): jocuri identice, lecții „a terminat lecția N”.
- **Lecțiile nr. 4** (16:31, test_joc TRECUT la toate 4):
  - V: judecător 0 GRAV / 3 MAJOR / 11 MINOR; zone pe fotografii 9/9 corecte; licențe OK → reparare la autor.
  - VI: judecător + arbitru PowerPoint în lucru.
  - VII: judecător 0 GRAV / 5 MAJOR (focus tastare după tabel, notație cu bare, provocarea cere profesorul) ; arbitru Word 20 CONFIRMAT / 0 INFIRMAT / 2 PARTIAL / 5 netestabil → reparare la autor.
  - VIII: judecător **1 GRAV** (butonul Pornire › Ștergere șterge direct în Excel, fără meniu) + 4 MAJOR (tragere pe telefon imposibilă, pași de 200+ cuvinte); arbitru Excel 25 CONFIRMAT / 0 INFIRMAT / 3 PARTIAL / 20 netestabil → reparare la autor.
- **Mașina 1** (opus): dosar_dumb + valideaza_pas + canar/momeală; teste 44/44 (→ 0, rulat de dirijor), 9/9 mutanți proprii prinși; 324 dosare reale fără scurgere; apelul real haiku INVALID din cauza ghilimelelor → decizie: normalizare ghilimele/liniuțe, distanța configurabilă.
- **Atenție la sigilare:** agenții de mutanți și-au lăsat scripturile de construcție în scratchpad-ul sesiunii (`scratchpad\build_mutanti.py`, `scratchpad\p2\`). Rezolvat: 20 de fișiere mutate în `LearningHub_banc\_unelte_constructie\`.

## Seara, 27.09
- **Bancul SIGILAT** (`907bb1d`, integritate 0). Judecata 2: 44/50, după care reparațiile de sistem (R3 pe fiecare întrebare, DE VERIFICAT, unirile, citatele ambigue). Judecata 3: 47/50, după aceeași regulă de numărare fixată dinainte; strict ar fi 42. Regula R5 privind gravitatea a fost aplicată pe tot bancul, iar cele 16 etichete surori ale lui B3-096c au ieșit pentru consecvență. Poarta de contaminare: cu o bucată secretă plantată dă 1, în stare curată dă 0; pragul e de 40 de caractere copiate (decizia dirijorului, motivată în `SIGILARE.md`).
- **Calibrarea** reparată: validatorul verifică acum conținutul (pe cel vechi îl pica 140 din 141 de intrări), cu 115 CONFIRMAT, 25 NESIGUR, 22 de verificări de laborator și pachetul de limbă RO posibil (decizia lui).
- **PUBLICAT** `a24281db` (18:0x): /lectii/, M1 nr. 4 la V/VI/VII/VIII (insigna „verificat parțial”), benzile, hub-ul, motorul în mod lecție (titlul din `aplicatieReala`, diploma, `preventScroll`), jurnalul și diploma. Verificat LIVE, 10/10 marcaje (`scratchpad\dirijor_verifica_live.py`; prima rulare a raportat 10 lipsă din cauza User-Agent-ului Python, iar curl a confirmat publicarea; greșeala e trecută în KB). Panoul: linkurile nr. 4 trimit la /lectii/ (`AI_0\data\panou\lectii.json`, copie `.inainte_lectii_noi`).
- **Starea lecțiilor pentru publicare**:
  - nr. 4: V a doua trecere, 0 GRAV / 0 MAJOR; VI a doua trecere, 0/0; VII a doua trecere, 0/0 (runda 3 pentru telefon făcută, nepublicată); VIII a doua trecere, 0 GRAV / 1 MAJOR pe telefon (runda 3 în lucru).
  - nr. 5: V 0 GRAV / 2 MAJOR (în reparare); VI 0/1 (în reparare); VII la judecată; VIII 1 GRAV (Ctrl+Z după dată) / 3 MAJOR (în reparare).
  - nr. 6: 4 autori pornit ~18:20.
- **Linia de verificare**: trierea a arătat că toate cele 19 semnalări erau alarme false. Calibrarea e în lucru; condiția este să prindă 3 defecte plantate.
- **Mașina**: 57/57 de teste, executorul în pagină și primul FĂCUT real. Au fost găsite 2 probleme reale de telefon pe lecțiile noi, predate autorilor.

## Noaptea 27→28.09 (punct la 22:52)
- **LIVE (12 lecții, fiecare verificată pe live după marcaj):** nr. 4 la V/VI/VII/VIII · nr. 5 la V/VI/VII/VIII · V/6 · VII/6 · VI/7 · VIII/7. Commituri: a24281db, 38c03472, 312d2ec7, 3b31a56f, d514f419, e6914ec8 (motor: lansatoarele panglicii 0/32→32/32), 8e2f975a, fec7e22f (metadate), 0f37473e, 142eea45, 2e9f0038.
- **Lanțul pe lecție s-a dovedit:** fiecare lecție a trecut prin 2-3 treceri de judecător; judecătorii au găsit probleme GRAV reale pe care autorii nu le văzuseră (ex. Ctrl+Z în buclă la date, alinierea care comută în Word, mărimea egală cu macheta pierdută la schimbarea temei, F5 care reîncarcă pagina, „150 lei” #VALUE!).
- **Descoperiri trecute în standard (regulile 13-21) și în KB:** 7.5 = dată pe setări RO; Ctrl+Z nu e „un pas”; tastatura RO; clipboard comun; PowerPoint o singură instanță; taste reale vs FindKey; nume vizibile pe butoane; **metadatele fișierelor de descărcat aveau numele contului Office** (curățat, `verificare_lectii\curata_metadate.py`).
- **În lucru:** VI/6 (judecător trecerea 3), VIII/6 (judecător trecerea 2), V/7 (3 minore), VII/7 (judecător), lecțiile nr. 1 la V/VI/VII/VIII + V/2 (autori), măsurarea mașinii pe mutanți.
- **Decizii pentru Vasile (strânse):** testul lui V-U1 + barem contrazic lecțiile noi (memoria USB = intrare-ieșire vs stocare la lecția 6; 32:2; copia de rezervă; „sistemul de operare” din M2); pachetul de limbă RO pentru Office; lista de 22 de nume de confirmat în laborator; fotografiile din viața reală pentru pașii 0 (capturi_lipsa.json); Tupilați fără planificare.

## Noaptea, punct 2
- **LIVE: 15 lecții** (+ VIII/6 `aee1cdb2`, VI/6, V/7 — verificate live după marcaj). Lipsește din nr. 4-7 doar VII/7 (reparare telefon → judecător trecerea 2).
- **Mașina MĂSURATĂ pe bancul sigilat: prinde 8 din 55 de mutanți** (prag 100%) → NU e gata; lecțiile rămân cu insigna „verificat parțial”, lanțul autor→judecător→arbitru rămâne singura poartă reală. Pe niveluri: S 2/34 · R 3/9 · A 3/9 · J 0/3; capcane 2/8. Cauza ratărilor: 35 „unealtă lipsă” (nicio verificare pentru acel rând din listă), 12 „unealtă oarbă” (verificarea există, dar nu vede defectul); 14 mutanți de neatins pentru că linia verifică un singur nivel pe pagină; ~jumătate din apelurile haiku INVALID. Cost 15,8 USD; limita 429 atinsă 19:33 (resetată 21:30). Dovada: `LearningHub_banc\masurare_2026_09_27\` (commituri bancă 93c1ffc, e5c77e3, 15b74bc, 35662e0). **Constructorului mașinii i se dau DOAR categorii** (rândurile din listă fără unealtă, „un nivel pe pagină”, INVALID haiku), niciodată textul mutanților.
- **Poarta test_joc: excepția E0** (motorul): `continuturi:[]` e permis pe nivelurile din unitățile -E0 sau cu lecții doar „organizare…”; jocurile 27/27 identice; contra-probă VIII/4 fără conținuturi încă pică. Ocolișurile `recapitulare:true` din VII/1 și VIII/1 se scot.
- **Lecțiile nr. 1 — defecte comune găsite de judecători:** evaluarea inițială își pierde rezultatul (întorci ✘ → „Corect! știi de unde pornești”, lista „Recitește” dispare); laboratorul cere rezultatul atelierului pe care nu-l arată; **calculatorul comun: al doilea elev vede ✗-urile primului** (cheia din browser fixă); răspunsuri corecte respinse („8 biți”, „1024 MB”); literele B/C/A de pe foaia testului inițial vs A = De bază; „Coșul de reciclare” ca regulă fără excepții. Trimise la toți autorii/judecătorii nr. 1.
  - VI/1: 2 GRAV / 3 MAJOR / 10 MINOR → reparare. VII/1: 2 GRAV / 6 MAJOR / 11 MINOR → reparare. V/1: 1 GRAV / 4 MAJOR / 11 MINOR → reparare. VIII/1: 2 GRAV / 4 MAJOR / 6 MINOR → reparare.
  - **Motor, legătura „doar recitire”** `jocuri/<slug>/?recitire=N` (comandată): „Recitește” trimitea la niveluri blocate pe profil nou (8 din 9 la VIII/1). Nu scrie nimic în progres.
  - **Panoul „Spune cine ești”** are 3 stări (calculator nou · „Cine lucrează acum?” · „Lucrezi ca X” → „Schimbă elevul”); instrucțiunile lecțiilor le acoperă pe toate (V/1 GRAV: al doilea elev lucra pe numele primului).
- **Decizie nouă pentru Vasile:** generatorul de teste (`Info_Gimnaziu_2026\generator\print_engine.py` r. 286, 296-297) scrie pe TOATE foile „Nota = punctaj : 10” și literele B/C/A; asta contrazice `SISTEM_EVALUARE.md` (regula predată: părți A/B/C, praguri 27/20/14, nota pe nivel). La V: Emil 71 → 7 pe foaie, 9-10 după regulă. Termen practic: lucrarea lecției 7 la V (23.10). Propunere: îl aliniez eu la SISTEM_EVALUARE, după confirmarea lui.
- **Poarta test_joc cu excepția E0**: rerulată de dirijor, `--toate` → 27 TRECUT / 0 PICAT.

## 28.09, noaptea
- **PUBLICAT VII/7** `302660d3` (judecător 3 treceri → 0 GRAV / 0 MAJOR; build/linkuri/plan/metadate 0/0/0/0), LIVE 3/3 marcaje. **Toate nr. 4-7 sunt acum LIVE (16 lecții).**
- **Defect în motor prins de 3 autori** (nu de poartă): comentariul `//` de la `?recitire` înghițise `const b=` în `load()` → elev înscris fără progres = pagină goală. NEPUBLICAT (motor.js modificat, necomis). Reparat de dirijor; proba `verificare_lectii\proba_profil_motor.py`: 18/18 OK + control cu defectul re-injectat PRINS. KB: failure înregistrat.
- **Motorul** (necomis, de publicat împreună cu lecțiile nr. 1): excepția E0 + `?recitire=N` (27/27 identic, Playwright 12 rulări) + reparația din `load()`; în lucru: Enter după Tab în foaia Excel (VIII/4 publicată depinde de el).
- **Lecțiile nr. 1, judecata 2:** VI/1 → 2 GRAV noi (literele părților inversate după ghidarea mea vagă din runda 1 — corectat: părțile A/B/C în ordine ca regula profesorului + o frază despre etichetele de pe foi; rezultat legat de „Ești tot X?” neconfirmat → doar cu `Prezenta.stare()==='activ'`). V/1, VII/1, VIII/1: judecata 2 în lucru.
- **Panoul de prezență**: eticheta strânsă = punct fără nume pe telefon, 29 px pe desktop (regula 20) → agent pe `prezenta.js`.
- **Autori terminați, la judecată:** V/2 (0 GRAV / 5 MAJOR → reparare: ce face copilul dacă profesorul nu e în clasă / fum), V/3, VI/2 (arbitru PowerPoint cu lacăt), VIII/2 (arbitru Excel). În lucru: VI/3, VII/2, VII/3, VIII/3.
- **Scăpare (de spus lui Vasile):** probele unor agenți au încărcat `prezenta.js` cu elevi inventați fără rețea blocată → în panoul de activitate au apărut **„Ana Pop” și „Dan Ene” (8 A, Brauner, 0 min, „nu e în catalog”)**; posibil și „Rusu Ilie” (6 A, 0 min). Regula 24 nouă (probele blochează tot ce nu e 127.0.0.1), anunțată tuturor agenților activi; KB failure. NU am șters nimic: `activitate.py` are doar `sterge --toate` (ar șterge și elevii reali) → decizia lui (ștergere țintită = schimbare pe server).
- **VII/1 judecata 2:** 1 GRAV (înscrierea DUPĂ evaluare → fișă goală, iar refacerea dă „✔ din prima”) + 3 MAJOR (fișa pe numele celui din „Ești tot X?”; ≈2.540 de cuvinte, 6 pași) → reparare: identitatea ÎNAINTE de evaluare, atribuire doar la `Prezenta.stare()==='activ'`, laborator ≤5 pași, drum sub ~1.500 de cuvinte.
- **V/3 judecata 1:** 1 GRAV („curentul electric abia cu calculatoarele electronice” — fals: Hollerith 1890, Z3 1941) + 4 MAJOR (atelierul se câștigă cu regula greșită „are ecran”) → reparare.
- **PUBLICAT VIII/4, corectură** `aa4318a0`: grupul „Clipboard” (nu „Memorie temporară”, traducerea unui sit terț), LIVE verificat (nou 1, vechi 0).
- **Regula 25 (calculatorul profesorului rămâne cum era):** un script VI/3 oprea TOATE procesele POWERPNT la final (acum: doar PID-ul propriu); 60 de intrări de probă în lista „Recent” Word/Excel/PowerPoint ale lui → `verificare_lectii\curata_mru_office.py` (scoate DOAR intrările de sub lectii\…\_proba/_verificare/_campaign/Temp\claude), de rulat `--sterge` la final, cu Office închis. Lacătul PowerPoint: 60 min + `reinnoieste` (expirase în timpul probelor VI/3, 36 s de suprapunere).
- **V/2: judecata 2 → 0 GRAV / 0 MAJOR, publicabil**; trecere scurtă pe minorele de siguranță (fum ÎN SALĂ; ieșirea doar la pericol real) înainte de publicare.
- **VIII/1 judecata 2:** 1 GRAV (`prezenta.js` rescrie la 5 s identitatea peste o înscriere din altă filă — defect LIVE, pe tot situl) → agentul `prezenta.js`; 2 MAJOR de identitate → componenta comună `lectii\_sim\rezultat-elev.js` (în lucru), adoptată apoi de VI/1, VII/1, VIII/1.
- **VIII/2 judecata 1:** 2 GRAV (lanțul Tab-Enter rupt de atingerea celulei active; Enter din caseta Nume ajunge la foaie) + 3 MAJOR (zoom pe foaie) → reparare. **VI/2:** 0 GRAV / 3 MAJOR (Normal în Normal = Schiță) → reparare. **VI/3:** autor gata → judecător. **V/1:** judecata 3 în lucru.
- **PUBLICAT V/2** `c5e6efd1` (judecător 2 treceri → 0/0; minorele de siguranță reparate și citite de dirijor), LIVE 3/3 marcaje + proba de fum `verificare_lectii\fum_live.py` (390/1280, 0 erori, 0 cereri spre teste-vasile). **LIVE: 17 lecții.**
- **Componenta comună `lectii\_sim\rezultat-elev.js`** gata: matrice 11/11 (390+1280, caseta reală, 287 cereri spre teste-vasile oprite), 6/6 mutanți prinși → adoptată acum de VI/1, VII/1, VIII/1.
- **V/1: judecata 3 → 0/0, publicabil**; se publică ODATĂ cu noul `prezenta.js` (paragraful „Pe telefon” descrie eticheta nouă). **V/3: judecata 2 → 0/0**, trecere pe minore. VII/3: autor gata (pasul 0 + 9 pași) → judecător.
- Scăpare suplimentară (VII/1, înainte de regula 24): „Ana Pop” (t_ana) și „Bogdan Ene” (t_bog), „Tupilați” / clasa „VII”, ~12 rulări fără blocare; nu apar în `activitate.py lista`, pot sta pe server.
- **PUBLICAT V/3** `43f35986` (+ V/7: „schimbă date între ele, chiar dacă sunt departe”), LIVE 3/3 + fum 0. **LIVE: 18 lecții.**
- **Fișiere de recuperare Office lăsate de probe** (regula 25, completată): Excel `_j2_copie*` (judecătorul VIII/2) → panoul „Document Recovery” la fiecare Excel nou; Word 17 × `*((Unsaved-*)).asd` din 28.09 (Invitatie/Test/Orarul meu/Primul). MUTATE (nu șterse) în `verificare_lectii\_carantina_recuperare_{excel,word}\`. Neatinse: `Book1((Unsaved-…))` din 23 și 25.09 (anterioare campaniei = ale lui). Regula: `Saved=True` + `Close` înainte de `Quit`, fără `taskkill` pe instanță cu fișiere deschise.
- **Motorul** (necomis): Enter-după-Tab ca în Excel (probat în Excel real; 98 scenarii 0), text tăiat fără „…”, butoane ≥32 px (58 → 0), „Ești tot X?”: diploma fără nume, „Trimite” oprit, „Da, sunt eu” nu mai mută singur, casetă „Ai lucrat TU asta?”; proba de stări 448/448; rețeaua blocată și în `test_joc.py`.

## 28.09, dimineața (08:xx)
- **PUBLICAT VI/2** `6083555d` (judecător 2 treceri → 0/0, arbitru PowerPoint real; .pptx metadate 0), LIVE 3/3 + fum 0. **LIVE: 19 lecții** (M1 nr. 4-7 toate; nr. 2 la V, VI; nr. 3 la V).
- **Regula 26 nouă** (probată în Excel și PowerPoint reale): la PRIMA salvare cu nume existent apare „already exists… replace?” cu OK / Anulare (OK suprascrie fișierul colegului, Enter = Anulare); la Salvare ca apare Confirm Save As Yes / No. VI/3 și VIII/3 predau greșit „No” la prima salvare → reparare.
- **Decizie de conținut Word:** zoomul stă în lecția 3 (vizualizare); selectarea în lecția 5 (publicată); Anulare/Refacere în lecția 2. VII/2 → pasul 0 + 5 pași.
- **Poarta de lansare** (verificator independent) pentru motor + `prezenta.js`: în lucru. După verdict: publicare motor + prezență + V/1 + VIII/2; apoi componenta `rezultat-elev` (runda 2: GRAV A „elevul de dinainte încă activ”, GRAV B „doi neînscriși în aceeași filă”) + VI/1, VII/1, VIII/1.
- **KB:** `page.close()` lasă `sendBeacon` să treacă pe lângă blocarea Playwright (sursa probabilă a elevilor falși din panou); regula 24 se aplică cu `ctx.close()` + gardă în pagină.
- **PUBLICAT VI/3** `26725d1d` (judecător 2 treceri → 0/0 + minorele K1-K4: Enter = Anulare în „already exists”), LIVE 2/2 + fum 0. **LIVE: 20 lecții** (VI: 2-7; V: 2-7; VII: 4-7; VIII: 4-7).
- **Scăpare mică (de spus lui Vasile):** proba autorului VIII/3 a salvat un registru GOL `Ionescu_Maria_8A_lectia3.xlsx` în `OneDrive\Documents` al lui (08:36, Ctrl+S propunea Documents); șters imediat de autor, poate fi în coșul online OneDrive. Proba are acum gardă (salvează doar în `_salvari`, altfel anulează).
- **Dispută de fapt VIII/3:** după Anulare la „already exists” (prima salvare), Excel închide ferestrele (judecătorul) sau redeschide „Save this file” (autorul, cu captură)? → arbitraj în Excel real la judecata 2.
- **LANSARE motor + prezență + V/1 + VIII/2** `f1790874` după POARTA DE LANSARE independentă (verdict LANSEAZA: test_joc 27/27, stări 448/448, 7 probe ale autorilor 0, 294 rulări proprii fără probleme noi față de HEAD, sertarele vechi ale elevilor se încarcă). Sha1 identice cu cele verificate. LIVE: 5/5 marcaje (motor `RECITIRE`, prezenta `sincron`, cele 2 lecții, extensia) + fum 12/12 (inclusiv `?recitire=5` live). **LIVE: 22 lecții.**
  - De urmărit (nu regresii): `sincron()` să emită `prezenta` și când se schimbă doar „intreaba” (două file ale aceluiași joc cât stă „Ești tot X?”); `proba_tinut.py` depășită; caseta „Spune cine ești” acoperă nivelurile din cuprins până la primul gest (veche).
- **VII/2: judecata 2 → 0/0, publicabil** (2 minore cosmetice). Judecătorul a găsit zoomul documentelor noi din Word-ul LUI la 13% (la 08:29 era 100%) — sursa nesigură (o probă a noastră); pus la loc 100% și verificat. Un Word pornit la 10:18 (PID 30812) nu e al agenților — probabil al lui; nu se atinge.
- **PUBLICAT VII/2 + VII/3** `1b53b6ac` (judecători 2-3 treceri → 0/0, arbitru Word real), LIVE 5/5 + fum 4/4. **LIVE: 24 lecții** — V 1-7 · VI 2-7 · VII 2-7 · VIII 2, 4-7. Rămân: VI/1, VII/1, VIII/1 (componenta v2, judecata 4), VIII/3 (reparații mici).
- **„Rusu Ilie” = elev de probă al autorului VI/1** (copie după `drumuri2.py`, 28.09 ~03:00 și ~04:30, închidere cu `page.close()` → `sendBeacon`). Toate cele 3 nume din panou („Ana Pop”, „Dan Ene”, „Rusu Ilie”) sunt de probă.
- **PUBLICAT VIII/3** `a80f1f6c` (judecător 3 treceri → 0/0, arbitru Excel real; numele cu cifră acceptat), LIVE 2/2 + fum 0. **LIVE: 25 lecții** — V 1-7 · VI 2-7 · VII 2-7 · VIII 2-7. Rămân nr. 1 la VI/VII/VIII.
- **VI/1 judecata 4:** 0 GRAV / 1 MAJOR — componenta arăta fișa elevului de dinainte (încă „activ”) fără întrebare → **componenta runda 3** (citire condiționată de confirmare, butonul proprietarului doar după „Da”). VII/1 și VIII/1: judecata 4 în lucru.
- Panoul de activitate verificat din nou: tot doar cele 3 nume de probă (0 min); „Pop Ana 6 A” NU a ajuns.
- **MODULUL 2, valul A pornit (~14:30):** lecțiile 8-9 la V (sistemul de operare; fișiere și directoare), VI (estetică și susținere; mini-proiect prezentare), VII (tehnoredactare; document după specificații), VIII (SUM/MAX/MIN/AVERAGE; IF). Brieful autorului completat cu regulile 24-26 și cu regula pentru mini-proiecte / evaluări (criteriile DOAR din documentele profesorului).
- Judecătorii nr. 1 (VI, VII, VIII) — pe pauză până la componenta v3 finală (sha1).
- **Componenta `rezultat-elev.js` v3 FINALĂ** (sha1 `eb8fdae3…`, verificat pe disc de dirijor): citirea condiționată de confirmarea „Ești X?” în încărcarea curentă; confirmarea expiră după 8 min fără atingeri (pauza dintre ore = 10 min); butonul proprietarului „Sunt X, dar n-am dat-o eu” doar după „Da”; a doua revendicare întrebată separat. Matrice 21/21, mutanți 18/18, proba_intreaba 0, profil 0. → cele 3 lecții nr. 1 folosesc `asteaptaConfirmare(K)` pentru text corect („Pe calculator e fișa lui X… apasă sus «Da»”), apoi judecata 4 reluată pe sha1-ul ăsta.
- 3 autori M2 (VI/9, VIII/9, V/8) blocați de un stream watchdog (600 s fără progres) → reluați din transcript.
- M2: VI/9 (mini-proiect) autor gata → judecător. De decis/de reparat: jocul `prezentari-vi` (6×6, 3-5 min, titlu 32-40) contrazice lecțiile VI/2 și VI/6 publicate — judecătorul arbitrează.

## 28.09, după-amiaza — PAUZĂ cerută de Vasile (16:40)
- Cererea lui: „după ce termini lecțiile începute la fiecare clasă… te oprești și salvezi tot ce e necesar pentru a relua… exact în acest stil”. → Nu se mai pornesc lecții noi; se termină cele începute (VII/1, M2 nr. 8-9).
- **Salvat pentru reluare:** `08_RELUARE.md` (tot), skill `AI_0\.claude\skills\lectii.md` (`/lectii`), `dirijor\stare.py` (starea calculată), uneltele mutate din scratchpad în `dirijor\`, fișa de memorie + MEMORY.md, decizia în KB.
- **Date personale scoase** din ce se publică (39 de fișiere: căi cu numele contului Windows, partea locală a e-mailului) `1b1dc2ac`; poarta privată `AI_0\tools\learninghub_date_personale.py`; regula 27. Istoricul GitHub (public) încă le conține — decizia lui.
- **PUBLICAT:** VI/1 + `rezultat-elev.js` v3 `690d26ed` · VIII/1 `2d38e538` · reparația simulatorului Word `wordobj-formatare.js` (cursorul după tastare; 8 → 0 abateri) `2556430b` · reparația F5 din `simppt-interfata.js` (pagina reîncărcată din note; 2 → 0) `4916eb26`. Toate verificate LIVE + fum.
- **LIVE: 27 lecții** — M1 complet la V, VI, VIII; VII 2-7 (VII/1 = ultima reparație mică). M2 nr. 8-9: la judecători / reparări.
