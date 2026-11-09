# Contract — terminarea lecțiilor, pornită în noaptea 08→09.11.2026

**Cererea (verbatim, 08.11.2026, 23:23, prin `/bucla`):** „continua munca la situl learninghub - avem mult credit si putin timp sa il terminam.” — urmată la un minut de „noapte buna”.
(Citire: Vasile doarme, deci contractul e aprobat implicit de cerere și se arată dimineața — ghidul VI.3. `consum.py` la 23:25: 7 zile = 61 % (VERDE), resetare ~11:00 pe 09.11. „A termina” = cele 42 de lecții rămase din `lectii/plan.json`; publicate azi: 101. `/bucla` = aici e chiar lanțul lecției, judecători independenți până la 0 GRAV / 0 MAJOR, oprirea o dă verdictul, nu autorul; la final de tură, T1 peste raport.)

**Proba realității:** elevul deschide lecția pe sit (la Tupilați a VI-a și a VII-a fără profesor; la Dumbrava doar pe telefon), o parcurge singur, exersează în pagină — la VII/VIII scrie și rulează programe C++ chiar în pagină — și face gesturile în aplicația reală din laborator (Scratch, Code::Blocks). Profesorul notează evaluările pe regula C/B/A.

**Cele 42 de lecții, în ordinea de lucru:**
| Val | Ce | Pornește când |
|---|---|---|
| A | V/30 (evaluare), V/31, V/32 + **componenta `cpp-mic.js`** (C++ în pagină) | acum |
| B | V/33, VII/24, VIII/24 | J1 din valul A gata + `cpp-mic.js` LANSEAZA + 7 zile < 75 % |
| C | V/34, VII/25, VIII/25 | J1 din valul B gata + 7 zile < 80 % |
| D | V/35, V/36, VII/26, VIII/26 | după resetare (~11:00, 09.11), sau înainte dacă 7 zile < 78 % |
| E… | VII/27-36, VIII/27-35; VI/27-36 (animația) | după resetare, în valuri de 4-6, cât ține bugetul |

**Ținta nopții (până la ~10:00):** valurile A-C publicate — 9 lecții + componenta. Tot ce nu ajunge are pasul următor scris. Socoteala: ~2,5 puncte / lecție + ~4 componenta ⇒ ~27 de puncte ⇒ 61 % → ~88 %.

| R# | Cerința | Cine verifică | Ce număr înseamnă gata |
|---|---|---|---|
| R1 | Lanțul pe fiecare lecție (ghid I.6): autor opus → J1 pereche → R1 autor proaspăt → J2 opus → … până la 0 GRAV / 0 MAJOR; verdictul final pe opus | judecătorul (`_verificare\judecatorN.md`) | 0 GRAV și 0 MAJOR la ultima judecată opus |
| R2 | Faptele despre aplicații probate sau scrise prudent (`nesigur`). C++: orice „programul X afișează Y / eroarea Z” probat cu `g++`. Code::Blocks doar pe desktopul ascuns. Scratch prin scratch-vm + editorul public doar în Chromium headless | judecătorul | 0 afirmații neprobate scrise ca sigure |
| R3 | Regulile 20-27 (ținte ≥ 32 px, nimic spre exterior, `ctx.close()`, calculatorul neschimbat, „numele există deja”, date personale) | judecătorul + `learninghub_date_personale.py` + `activitate.py lista` | 0 date personale; „nu e în catalog” nu crește față de **3** (start, 08.11, 23:27) |
| R4 | Publicare doar prin `publica_lectie.py`, fișiere numite | scriptul | ultima linie 0; conținut LIVE = fișierul comis; fum 390 + 1280 = 0 |
| R5 | Evaluările și mini-proiectele: cerințe, criterii, grilă DOAR din documentele profesorului; fără test al profesorului = probă de antrenament pe regula de notare | `verifica_regula.py`, `oracol_nota_site.py` + judecătorul | ultima linie 0 |
| R6 | Componentele comune neatinse; doar extensii cu nume nou; `cpp-mic.js` are proprietar unic | `git show --stat` pe fiecare commit | 0 fișiere străine |
| R7 | **`cpp-mic.js` se comportă ca g++ pe programele pe care le pot scrie elevii**: oracol diferențial (programe rulate și cu `g++`, și în simulator) + banca de erori + poartă de lansare INDEPENDENTĂ, care scrie programe noi fără să le vadă pe ale proprietarului | oracolul proprietarului + poarta (`poarta_cpp_mic.md`) | ≥ 200 de programe, 0 diferențe la ieșire; ≥ 30 de erori tipice, linia + clasa identice; verdict LANSEAZA |
| R8 | Nimic pe ecranul vizibil (el doarme, apoi e la școală). Office și Code::Blocks doar pe desktopul ascuns, sub lacăt | judecătorul + dirijorul | 0 ferestre / procese rămase; `curata_mru_office.py` → 0 |
| R9 | Bugetul: rămâne loc pentru dimineața lui de la școală | dirijorul, `consum.py` la fiecare agent terminat | fără autori noi peste 82 %, fără niciun agent nou peste 90 %, până la resetare; 0 opriri de limită |
| R10 | Jurnal + raport de dimineață + fișa de memorie + T1 peste raport | dirijorul | `04_ORCHESTRARE.md` la zi; `stare.py` arată lecțiile publicate sau, la fiecare lipsă, pasul următor |

**Implicite (I#):**
- I1. Decizia de limbaj se vede PRIMA în raport, cu ce costă dacă o schimbă.
- I2. Un elev de la Dumbrava poate face toată lecția C++ pe telefon: tastatura telefonului nu are la îndemână `{ } ; < > " [ ]`, deci simulatorul are butoane pentru ele.
- I3. Elevul nu e obligat să aibă Code::Blocks: dacă lipsește din laborator, lecția merge în pagină până la capăt (regula 32).
- I4. Lecțiile VII/24+ se sprijină pe VII/23 și pe pseudocodul lecțiilor publicate, iar la a VIII-a nu presupun că elevii au făcut C++ anul trecut (anul ăsta n-au făcut): VIII/24 spune tot ce-i trebuie ca să scrie primul program cu șir.

**Cititorul-țintă:** V: 11 ani, algoritmi în limbaj natural (V/24-29), n-a văzut Scratch. VII: 13 ani, algoritmi + Scratch la nivel de lecțiile VI, n-a scris niciodată cod textual. VIII: 14 ani, HTML (VIII M3) și pseudocod (VII/23, VIII/23); n-a scris C++.

**Glosar (ca să înțelegem la fel):** „terminat” = publicat live, cu judecată finală 0/0, nu „scris”. „C++” = subsetul din `cpp-mic.js`: un singur `main`, tipuri numerice + `bool` + `char`, tablouri cu o dimensiune, `cin`/`cout`, `if`, `while`, `do-while`, `for`. „Șir” (VIII) = tablou unidimensional, ca în programă.

**Deciziile dirijorului (le poate schimba Vasile; intră primele în raport):**
1. **C++ cu Code::Blocks la VII și VIII** (de la VII/24 și VIII/24). A așteptat decizia lui în două rapoarte, el cere acum terminarea și doarme. Dovezile: fișa lui de olimpiadă (`Olimpiade…\20 - Informatica — regulamentul și proba (gimnaziu).md`: „Limbajul: numai C sau C++”, „Python și Pascal nu sunt acceptate”, „Un elev care învață Python la clasă trebuie să treacă la C++”, mediul = Code::Blocks); antrenamentul lui de a VII-a e „in C++” (`Info_Gimnaziu_2026\materiale\antrenament\clasa_VII.md`); VIII/1 pomenește deja C++; Code::Blocks e instalat pe calculatorul lui pentru capturi. Dacă alege altfel: `cpp-mic.js` și lecțiile deja scrise se refac (aproximativ 2,5 puncte / lecție).
2. **În pagină, un simulator C++ propriu** (`cpp-mic.js`), fără server și fără compilator pe net: merge pe telefon, nu trimite nimic în afară, iar comportamentul e verificat contra `g++`.
3. **V/31-35 = Scratch 3 online, fără cont, `.sb3` pe calculator** — la fel ca VI/18-26 (decizia veche).
4. **VI/27+ NU se pornește în noaptea asta**: bugetul nopții nu ajunge oricum, iar el poate răspunde dimineața. Întrebarea intră în raport, cu implicitul: Scratch pentru VI/27-32 și 34-35 (se potrivește activităților lui: cadre, proprietăți, temporizare, sunet, tastatură), iar VI/33 (modele 3D) rămâne de hotărât separat. Dacă nu răspunde până ajungem la VI, merg pe implicit.
5. **V/30**: dacă testul unității V-U5 nu există în documentele lui → probă de antrenament pe regula de notare, cu întrebarea „Pentru profesor” în `surse.md` (ca la V/17, V/23, VI/26).

**Ce NU intră:** jocurile, panoul de activitate, lecțiile publicate (doar citite), motorul, `prezenta.js`, `rezultat-elev.js`. Defectul `scratch.js` la 390 px (căsuța de 21,8 px) e în coadă, ca reparație separată, cu poartă, dacă bugetul permite; altfel rămâne notat.
