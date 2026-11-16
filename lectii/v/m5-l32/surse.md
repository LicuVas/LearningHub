# Lecția 32, clasa a V-a — surse, probe și ce n-am putut verifica (08-09.11.2026, valul A M5, cu V/30 și V/31 în paralel)

**Nu e publicată, nu e în depozit (fără commit).** Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l32.md`. Starea autorului: `_proba\stare_autor.md`.

## Programa și planul
- `lectii\plan.json` / `Calendar_ore`: lecția 32, „Implementez structura secvențială cu blocuri grafice”, predare, 21.05.2027; unitatea V-U6 „Din algoritm în joc: mediul grafic interactiv (Scratch)” (`Proiectul_unitatii_V-U6.md`).
- CS.3.2 „Implementarea unui algoritm care conţine structura secvenţială şi/sau alternativă într-un mediu grafic interactiv”, descriptorul De bază: „implementează, cu sprijin, algoritmi dați în limbaj natural, care prelucrează date cu operații succesive, plasând blocuri adecvate”. Activitatea din programă: „crea aplicații cu structura secvențială prin operații de mișcare, sunete, vizualizare text etc.”: lecția ia partea „mișcare” (activitatea profesorului o cere).
- Conținutul declarat, textul EXACT din `curriculum.json`: „Modalități de reprezentare a structurilor secvențiale și alternative prin blocuri grafice”. **Doar partea secvențială** e aici; structura alternativă e la V/33 (spus în `ancoraText`).

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
„Reproducerea unui traseu dat al personajului, folosind numai blocuri de mișcare. Varianta avansată: același traseu cu mai puține blocuri.” Resursa: „laborator, fișă cu traseul de reprodus”.
- Traseul dat: scena simulatorului cu traseul desenat (P4, atelierul), iar în laborator „fișa” (același desen, în punctul 3).
- „Numai blocuri de mișcare”: paletele exercițiilor de traseu au doar Mișcare + blocul galben (fără „spune”, cum avea VI/19).
- Varianta avansată: P5 + primul „Încă un exercițiu” de la atelier. Fără repetiție: unirea mișcărilor consecutive și a rotirilor cu aceeași săgeată.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Ce predă | Unde | Exersat (obligatoriu) | Întrebarea |
|---|---|---|---|
| pașii în cuvinte devin blocuri, aceeași ordine | P1 | Încearcă P1 + atelier | Î1 |
| mergi / rotește-te, numărul din bloc, x și y | P1 | Încearcă P1 | Î2, Î4 |
| ordinea contează; mutarea unui bloc | P2 | Încearcă P2 | Î2 |
| startul în program, al doilea steag | P3 | Încearcă P3 + atelier | Î3 |
| traseul dat, dreapta / stânga pisicii | P4 | Încearcă P4 + atelier | Î4 |
| mai puține blocuri, Șterge blocul | P5 | Încearcă P5 | Î5 |

## Ce presupune lecția că știe elevul (`profil.json`) — cu bife
- [x] structura secvențială, pași numerotați, executantul — V/28 (publicată), „Structura secvențială (liniară)”.
- [x] Ctrl+Z — V/19 (publicată), „Forme gata făcute; Ctrl+Z dacă n-a ieșit”.
- [x] Explorer: Descărcări, F2, Delete, fără golirea Coșului — V/9-11; browserul, Descărcări — V/14-15.
- [ ] **De verificat de dirijor după ce apare V/31** (scrisă deodată cu mine; R1 a citit pagina ei de la 05:43 și granița până la „SCHIMBAT 05:43”): paleta, zona de cod, scena, pisica, Sprite1, steagul, Stop; tragi și lipești; un bloc lăsat deoparte nu pornește la steag; x crește la fiecare steag; adresa `scratch.mit.edu/projects/editor`; Settings › Language, derulezi până la litera R, Română; salvarea, numele `5A-Ana`, Descărcări, ștergerea; `pazaPaleta` din `scratch-interfata.js` (1.2 la ultimele probe). Dacă V/31 se schimbă, se schimbă P1 (caseta 1) și laboratorul (punctele 1, 7, 8, 9).
- Ce predau în plus, pentru că V/31 mi le lasă (granița ei): schimbarea numărului din bloc, rotirea, „mergi la x y”, readusul la start, y și Direcția.

## Decizii (luate fără profesor; motivul)
1. **Traseele stau în x ≥ 0, y ≥ 0** (din mijloc, spre dreapta-sus). Numerele cu minus nu s-au predat la a V-a. Consecință: la laborator, y cu minus e chiar semnul greșelii ↻/↺; la mesaje, valorile cu minus apar doar dacă elevul a greșit, și sunt adevărate.
2. **Pătrățele de 50 de pași pe scenă** (doar în pagină): copilul citește câți pași are o bucată, fără să primească programul. În fișa din laborator la fel. Scratch-ul adevărat n-are pătrățele: lecția o spune. Decorul „Xy-grid” din Scratch nu e folosit (nu e cerut, n-ar aduce decât un gest).
3. **Testele (regula 29):** lipit · pleacă de la start (programul rulat din alt loc și cu altă direcție face același drum) · trece prin puncte, în ordine · nu iese de pe linie · se oprește la capăt · [cel mult N blocuri] · steag. Nu contează CE blocuri: „mergi la” pe fiecare colț, „orientează-te” în loc de rotiri, ↻ 270 în loc de ↺ 90 sunt primite. Toleranța = 0,5 (numerele se scriu, nu se trag).
4. **„Numai blocuri de mișcare”, deci fără „spune Colț!”.** Fiindcă blocurile sunt instantanee, drumul nu se vede în Scratch: la laborator proba e „bloc cu bloc” (x, y după primul „mergi”, apoi la capăt). Respins: „glisează” (nepredat, schimbă tema).
5. **Fișierul laboratorului:** `<clasa ta>-<prenume>-traseu.sb3` (regula de nume din V/31, cu sufix; în pagină, `5A-Ana-traseu`), în Descărcări, șters la sfârșitul orei (calculatorul e comun; la fel V/31). V/33 pornește dintr-un proiect nou. Numele `Traseu_…` din prompturile de judecată e vechi: nu mai e nicăieri în lecție.
6. **Pe telefon, Scratch-ul adevărat nu se cere** (nu e probat pe telefon real; ghidul VIII I): „sari peste; lucrezi în pagină”.
7. **Un singur tip nou (`traseu`), într-o extensie** (`lectii\_sim\scratch-traseu.js`), peste `scratch.js` nemodificat; `SimScratch.tipuri.scratch` rămâne cel care randează.
8. **Imaginea P0:** indicator de traseu de pe Commons (CC BY 4.0, licența citită pe pagina fișierului, `_proba\commons_pagina_licenta.txt`), decupat fără oameni. Respinse: harta de orientare (mânecă militară, traseul nu se vede), panouri stradale. Textul polonez de pe indicator e spus prin legendă doar ca „la munte”.

## Probe (rezultate)
| Proba | Ce arată | Rezultat |
|---|---|---|
| `_proba\live_v32.py` → `live_v32.json` | fapte despre mișcare în editorul viu: traseu, 3 ordini, 3 steaguri cu/fără start, doar „mergi la”, 4 margini, instantaneu, unire | 0 eșecuri |
| `_proba\live_lectie.py` → `live_lectie.json` | 32 de programe din pagină (soluții, greșeli, stive, laborator): simulator vs Scratch viu, x, y, Direcția | 0 diferențe |
| `_proba\live_lab.py`, `live_lab2.py` | drumul LITERAL din casete + laborator, cu mouse-ul, în editorul viu | `live_lab.py`: casetele și capătul corecte; ultima linie 3, pentru că sonda lua din paletă blocul după indice, iar ordinea din paletă se schimbă (a tras alt bloc la „Nu iese?”). `live_lab2.py` reface partea aceea, după pictograma rotirii: 0 |
| `_proba\live_sub_palarie.py` | fereastra de lipire sub blocul galben | până la +4 px față de marginea de jos = chiar sub el; de la +8 px = sub blocul următor (de aici „peste marginea de jos”) |
| `_proba\proba_praguri.py` → `praguri.json` | 20 de programe bune, 27 rele, 6 de unire; oracol separat, în Python; plus CARE test pică primul, pe 8 programe | 0 nepotriviri |
| `_proba\proba_mutanti.py` → `mutanti.json` | 8 mutanți pe `scratch-traseu.js`, cu control | control 0; 8 din 8 prinși (prima rulare a lăsat 3: a adus un caz nou, „ajunge la C și se întoarce pe linie”, și verificarea primului test picat) |
| `_proba\proba_urma.py` | linia portocalie: steag, al doilea steag, program schimbat, Pas cu pas, clic pe program; stratul nu fură atingerile; 390 și 1280 | 0 probleme (a prins: ultimul punct lipsea la Pas cu pas; reparat) |
| `_proba\proba_telefon_camp.py` | câmpul de număr, cu degetul, la 390 | se deschide din prima, grilă ±8 px 25/25; numărul rămâne după Enter și după o atingere în altă parte |
| `_proba\parcurge.py 390`, `parcurge.py 1280` | toată lecția, atingere la 390, mouse la 1280, fiecare exercițiu greșit, apoi corect, până la diplomă | `parcurge_log_390.txt`, `parcurge_log_1280.txt`: 0 probleme, 3 stele, 0 erori de consolă. O dată, sub încărcare, „Target crashed” la autor, la 1280: nerepetat în nicio rulare de atunci (autor, doi judecători, R1). Căderile de la sonnet, la 390: limita lui de timp; vezi „Reparațiile după judecata 1” |
| `_proba\proba_r1.py 390`, `proba_r1.py 1280` | o verificare pe fiecare punct din registru, cu gesturi reale; cu `--inainte`, aceeași probă pe copia dinainte | `proba_r1_390.txt`, `proba_r1_1280.txt`; pe copia dinainte, `proba_r1_390_inainte.txt`, `proba_r1_1280_inainte.txt`; cifrele, în `_verificare\registru_j1.md` |
| `_proba\live_r1.py` → `live_r1.json` | faptele noi, în editorul viu: unirea + Șterge blocul (x 200, y 100), cercul de la direcție, numerele cu minus, lista de limbi | 0 |
| `_proba\vocabular.py` | cuvintele vecinilor; plafon pe pas; durata | `vocabular.json`: 0 |

## Socoteala duratei (`_proba\vocabular.py`, 110 cuv./min, cu elevul lent la gesturi)
Citit ≈ 16,0 min · gesturi la „Încearcă” 6,4 · atelier 4,3 · laborator 5,8 · casete 2,9 · o greșeală cu mesajul pe fiecare exercițiu 6,0 · întrebări 3,2 ⇒ **≈ 45 de minute**, de cronometrat la clasă (gesturile sunt estimate pentru elevul lent, nu cronometrate). „Încă un exercițiu” și „Dacă mai ai timp” sunt deoparte.
Metoda judecătorului (`_proba\r1_durata.py`, copia lui `j1_e_durata.py`): înainte de R1, 2.199 de cuvinte, **40,3 min la 110 cuv./min, 47,8 la 80**; după R1, cifrele de la „Reparațiile după judecata 1”.

## Pentru lecția următoare (V/33 „Implementez structura alternativă. Evenimente și coliziuni”)
- **Ce rămâne la elev:** nimic pe calculator (fișierul de azi se șterge). V/33 pornește dintr-un proiect nou. În caiet nu cere nimic.
- **Ce știe de la mine:** un pas = un bloc; „mergi N pași”, „rotește-te ↺ / ↻ N grade”, „mergi la x 0 y: 0”, „orientează-te în direcția 90”; schimbă numărul din bloc; x, y, Direcția sub scenă; „peste marginea de jos” intră între blocuri; „Șterge blocul”; Ctrl+Z.
- **Extensia:** `lectii\_sim\scratch-traseu.js` 1.1 (`ScratchTraseu`): se poate încărca nemodificată (tipul `traseu`, `teste`, `final`, `minus`, `judeca`, `drum`, `desen`). Nu am pus în ea nimic despre decizii. API-ul e în capul fișierului și în graniță. Ce NU schimbă nimeni: forma lui `Q`, clasele `st-*`.
- **Nu presupune:** repetiția, decizia, evenimente altele decât steagul.

## Pentru componenta comună (`lectii\_sim\scratch.js`, proprietar VI/18; nu am atins-o)
- **Fără „Anulează” pe telefon:** un program tras cu degetul peste paletă se pierde; în simulator nu e niciun buton de refacere (măsurat la V/32, J2). De văzut un buton vizibil, pe toate lecțiile care încarcă fișierul.
- **Căsuța numerelor la 390 px:** ce se VEDE are 21,8 px înălțime; zona de atingere e invizibil mărită (34,9 px, 25/25 la ±8 px): lecția nu se blochează. Caseta deschisă are 66 × 16 px, cu font de 12 px. Pe iPhone, un câmp cu font sub 16 px face Safari să mărească pagina (ghidul F2): **neprobat pe telefon real**; reparația propusă: `font-size:16px` pe `input` sub `@media (pointer:coarse)`, cu probă pe toate lecțiile care încarcă fișierul.
- **Fereastra de lipire diferă:** în Scratch-ul viu, un bloc lăsat la ≥ 8 px sub marginea de jos a pălăriei ajunge sub blocul următor; în simulator intră chiar sub pălărie. Lecția nu se bizuie pe diferență (spune „peste marginea de jos”, care merge în ambele, probat).

- **Zona de cod îngustă la 390 (133 px):** „mergi la x … y: …” are 155 px, iar câmpul y rămâne tăiat. Extensia derulează singură zona, doar pe exercițiile cu tipul `traseu`; o zonă mai lată sau un semn vizibil de derulare ar folosi tuturor lecțiilor care încarcă `scratch.js`.
- **Paleta tăiată la 390:** rotirile se deosebesc doar după pictogramă; V/32 o spune la indiciu (primul „rotește-te” e ↻).
- **După „Corect!”, un program stricat și „Rulează testele”** lasă mesajul „Corect!” pe ecran, iar bifele sunt golite (observația judecătorului, nesocotită; exercițiul e deja trecut). De văzut la proprietarul tipului `scratch` și al motorului.
- **Judecata 1, caseta numărului (T):** caseta deschisă, cu font de 12 px, e măsurată și de cei doi judecători; pe iPhone rămâne neprobată.

## Contradicții găsite
- VI/18 scrie „lasă-l chiar sub „mergi la x 0 y: 0”: intră între cele două”; măsurătoarea de azi arată că „chiar sub” nu e sigur în Scratch-ul viu (fereastra: până la +4 px). VI/18 e publicată, nu o ating. **Pentru dirijor:** propoziția din VI/18 poate fi aliniată.

## Reparațiile după judecata 1 (09.11.2026)
Registrul: `_verificare\registru_j1.md` (25 de puncte + o observație). Copia dinainte: `_proba\inainte_r1\`. Schimbările se refac oricând din copie: `_proba\r1_aplica_ext.py`, `_proba\r1_aplica_pagina.py`.
- **Steagul apăsat înainte de reparare (B).** Am ales: testul de la coadă judecă SCENA („Steag apăsat, pisica la capăt”), iar la P1 și P2, unde startul nu e încă predat, există butonul „Pune pisica în mijloc (doar aici)”. Mesajul spune unde stă pisica și numește butonul. Respins: repunerea automată a pisicii la steag sau la schimbarea programului (ar contrazice Scratch-ul adevărat și P3, regula 9); doar o frază în enunț (testul ar fi dat tot „Corect!” cu pisica pe lângă linie).
- **Câmpul y la 390 (D).** Cât „mergi la” are alte numere decât startul, zona de cod se derulează singură, cât să i se vadă câmpurile; cu numerele bune revine la stânga, ca să se vadă începuturile blocurilor (dacă totul încape, nu se mișcă; nimic cât degetul e pe ecran sau caseta e deschisă). Cu numerele bune, y rămâne tăiat, dar nu mai e nimic de scris acolo; fraza din pagină e pentru derularea de mână: de pe un loc gol, nu de pe bloc. Respinse: derularea tot timpul (a ascuns etichetele; `parcurge.py` a dat 42 de probleme: lăsa blocurile peste paletă); paleta deasupra zonei de cod (tragerea ar porni vertical, tocmai gestul care nu ia blocul).
- **Paza din paletă (E).** `scratch-interfata.js` (V/31; 1.2 la ultimele probe) doar încărcat; `pazaPaleta(inst)` chemat de tipul `traseu`, dacă există. **Depinde de ordinea publicării:** V/31, cu extensia ei, înaintea lui V/32.
- **Căderile de la judecătorul sonnet (U): limita lui de timp, nu pagina.** Comanda lui, la ambele rulări: `timeout -k 15 500 python -I e_parcurge.py 390`. Parcurgerea la 390, singură, pe versiunea dinainte: **528 s, 0 probleme, 3 stele, 0 erori**, cel mai mare proces 199 MB, toate la un loc 708 MB (`_proba\r1_sonda_inainte.csv`). Tăiată cu `timeout` (45, 70, 78, 86, 94 s; `_proba\r1_repro_timeout.txt`, `_proba\r1_repro_rez.txt`): de 5 ori din 5, același fel de mesaj ca al lui („…: Connection closed while reading from the driver”), urmat de aceleași linii de la coadă. „Input.dispatchTouchEvent: Internal error” (a doua lui rulare) nu l-am reprodus întocmai; aceeași comandă, oprită tot după 500 s. Pe versiunea finală: 477 s, 0 probleme. O rulare din timpul reparației, cu mai mulți agenți pe calculator, a ținut 826 s, tot fără nicio cădere. **Proba are nevoie de o limită de cel puțin 1200 s.**
- **Pentru probe (de știut):** `pg.screenshot(full_page=True)` face `(pointer:coarse)` false în Chromium-ul emulat (`_proba\r1_coarse.py`), iar `parcurge.py` face astfel de capturi de la primul pas. Deci, după prima captură, parcurgerea la 390 nu mai vede regulile `@media (pointer:coarse)` din `scratch.js`; proba care le vede: `proba_r1.py`, `proba_telefon_camp.py` (fără full_page).
- **Durata (metoda judecătorului):** 2.190 de cuvinte, **40,3 min la 110 cuv./min, 47,7 la 80** (înainte: 2.199, 40,3 și 47,8). Am tăiat din citit, nu din gesturi: P0, antetul, câteva fraze repetate din enunțuri, un rând din fiecare casetă.

## Pentru profesor
- Fișa cu traseul: în pagină e desenul din laborator (2 pătrățele spre dreapta, 2 în sus). Dacă la clasă dați altă fișă, punctele „x 100, y 0” și „x 100, y 100” se schimbă.
- Fișierul de azi se șterge la sfârșitul orei (calculatorul e comun). Dacă vreți să-l vedeți sau să-l păstrați pentru V/33, spuneți-le elevilor și ștergeți ultimul punct.
- În pagină, pătrățelele sunt de 50 de pași: alegerea lecției, nu cerința programei.

## Reguli verificate pe lecție
1, 2 (plafoane: `vocabular.py`), 3, 4, 5 (6/6 aplicare), 7 (`afirmatii.json`), 9 (32 de programe vs Scratch viu), 10 (casete P1-P3 + laborator), 20, 24 (rețeaua blocată, `ctx.close()`), 25 (nimic pe ecran; Chromium headless, profil temporar), 26 („Nu” sau „Anulare” la „există deja”), 27, 28, 29 (`proba_praguri.py`), 30, 31, 32, 33, 34, 38.
