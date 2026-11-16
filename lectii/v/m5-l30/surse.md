# Lecția 30, clasa a V-a — surse, probe și ce n-am putut verifica (08-09.11.2026, valul A al nopții, cu V/31 și V/32)

**Nu e publicată, nu e în depozit (fără commit).** Autor: V/30 (opus); reparații R1 (09.11.2026, autor proaspăt): `_verificare\registru_j1.md`, secțiunea de mai jos. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l30.md`. Starea: `_proba\stare_autor.md`.

## Programa, planul, activitatea profesorului
- **Plan** (`lectii\plan.json`): nr. 30, M5, „Evaluare sumativă: algoritmi în limbaj natural”, evaluare sumativă, 07.05.2027, `lectii/v/m5-l30/`, cheia `lectie_v_m5_l30`. Unitatea V-U5 „Algoritmi. Gândesc pas cu pas” (CS.2.1-2.3; `Proiectul_unitatii_V-U5.md`), ora a șaptea din 7.
- **Activitatea** (`Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, citată întocmai): „Probă scrisă: analiza datelor unei probleme, scrierea unui algoritm cu secvență și decizie, urmărirea lui pas cu pas pentru date date. Cerințe pe cele trei niveluri.” Resursa: „test de unitate, barem pe niveluri”.
- **Testul unității: l-am căutat și NU există.** `materiale\continut\teste_sumative.json` are doar V-U1; `materiale\print\` are `Test_V-U1` și `Test_BAREM_V-U1`; `instrumente\` n-are test; `STARE.md`: „V-U5 … ☐ de scris”. Deci, ca la V/17 și V/23: probă de antrenament pe regula de notare (ghidul IV.2 §6-7, regula 37, decizia 5 din `contract.md`). Nimic din testul V-U1 nu e copiat.
- **`continuturi`:** textele exacte din `curriculum.json`. Ultimul e lipit acolo de „Medii grafice interactive…” (V-U6), ca la V/29 (poarta cere șirul întreg); lecția evaluează doar „Structura alternativă (decizională)”. **Nu declar** „Noțiunea de algoritm”, „Proprietăți ale algoritmilor”, „Constante și variabile”: sunt doar folosite, fără cerință proprie cu puncte (S7). Cele trei întrebări de la V/25 stau în P6, ca autoverificare.

## Pentru profesor (întrebări, nu le-am ghicit)
1. **Testul și baremul V-U5 nu există încă.** Pagina dă o probă de antrenament cu 7 cerințe: C1 12, C2 14, C3 14 · B1 15, B2 15 · A1 12, A2 8 · + 10. Dacă testul dumneavoastră are altă formă, pagina se potrivește pe el.
2. **Proba e „scrisă”: pe foaie sau la calculator?** Activitatea spune „probă scrisă”; pagina nu hotărăște. Scrierea liberă de pe foaie are o repetiție în laborator (Notepad sau caiet), neverificată automat.
3. **Cum notați scrierea unui algoritm?** Pagina judecă DUPĂ REZULTAT (ce afișează algoritmul pe date), deci primește orice formă bună. Pe foaie, cerințele de formă (de exemplu, numerotarea, „Sfârșit dacă”) le hotărâți dumneavoastră.
4. **„Sfârșit dacă” și decizia fără „altfel”:** lecția 29 le pomenește, nu le exersează. Pagina nu le cere.
5. **Condiții cu „și”, „sau” (A1):** descriptorul Avansat cere „condiții diverse”. Lecția 29 a exersat doar comparații, iar „și / sau” vin de la lecția 27 (doar evaluate). P4 spune o propoziție înainte de probă, iar A1 are la „Recitește” lecția 27. Dacă vi se pare prea mult pentru clasa a V-a, A1 se poate face cu un calcul înainte de decizie.
6. **E lucrarea de modul pentru M5?** Lecția 30 nu e ultima din M5, dar e ultima din V-U5. Pagina nu pomenește regula 80 % + 20 %.
7. **Cum vedeți ce au scris elevii?** Laboratorul șterge fișierul de azi la final (calculatorul comun); algoritmul îl arată pe ecran sau îl copiază în caiet. Dacă vreți să rămână fișierul, e o propoziție.

## Harta probei: item → puncte → simulator → ce cere → de unde (nimic nepredat)
| Item | Puncte | Simulatorul (neatins) | Ce cere | Testele, cu puncte | Unde s-a predat |
|---|---|---|---|---|---|
| C1 | 12 | `date-rol` (V/26) | tabelul de analiză, cu pașii dați | fiecare dată în coloana ei 5 × 2; cele 2 numere 1 + 1, oriunde există casetă (cel cerut, și din numărul LUI de manevră); în „Ce se dă” nu se plătesc a doua oară, dacă celălalt număr e scris | V/26 P2-P3 („Datele de manevră…”) |
| C2 | 14 | `scrie` (al meu), fără cartonașe | ordinea celor 6 pași, cu ↑ ↓ (cel mult 6 mutări) | «cost» după datele lui 5; «rest» după datele lui 5; afișarea după «rest» 4; rezultatul pe 2 seturi: bifă, fără puncte | V/24 („Ordinea pașilor contează”), V/28 P2, P4 |
| C3 | 14 | `urmarire` (V/28) | tabelul de urmărire, 4 rânduri, toate cutiile | citirile 3; calculul 5; valorile duse 3 (pază); afișarea 3 (pază) | V/28 P5 |
| B1 | 15 | `scrie` | algoritm cu secvență și decizie, din cartonașe | citirea 2; decizia cu pași 2; sub 12 ani 3; peste 12 ani 3; exact 12 ani 3; afișarea 2 | V/28 P4, V/29 P2, P5 |
| B2 | 15 | `tabel-urmarire` (V/29) | tabelul cu decizie, un set | citirile 2; calculul 3; condiția 3; traseul 4; afișarea 3 (ultimul rând uitat costă doar afișarea) | V/29 P3-P5 |
| A1 | 12 | `scrie` | situație nouă: condiție cu „și” | citirea 2; decizia cu pași 1; vreme bună + limitele 3; frig 3; cald 3 | V/27 P5, V/29 P2 |
| A2 | 8 | alegere + o propoziție în caiet, obligatorie, fără puncte | de ce e bună condiția cu „și” de la A1 | prima variantă verificată | V/27 P5, V/29 P2 |

Sumele: 12 + 14 + 14 = 40 · 15 + 15 = 30 · 12 + 8 = 20 · + 10 = 100 (`EvalAlgoritmiV.configureaza` avertizează în consolă dacă nu ies; consola e curată).

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Conținut | Pasul | Exersat | Proba | Întrebarea |
|---|---|---|---|---|
| Clasificarea datelor | P3 | P3 Încearcă, Încă | C1 | Î1 |
| Expresii (comparații, „și / sau”, calcule) | P4 (o propoziție), P6 | P5, P6 | C3, B2, A1, A2 | Î3, Î4 |
| Structura secvențială | P4 | — | C2, C3 | Î2 |
| Structura alternativă | P4, P5, P6 | P4, P5, P6 | B1, B2, A1 | Î3, Î4 |
| Nota (lecția 1, reluată) | P2 | P2 | panoul, rezumatul | Î5 |

## Ce presupun lecțiile publicate și ce acopăr (cu bife; `profil.json`)
- [x] V/24 algoritm, pas, executant · [x] V/25 cele trei întrebări (P6, cu trimitere) · [x] V/26 tabelul de analiză (P3, C1) · [x] V/27 comparații, „și / sau” · [x] V/28 forma pașilor, tabelul, robotul, ↑ ↓ ✕ · [x] V/29 decizia, Condiția, traseul · [x] V/1 părțile, nota · [x] V/15, V/28 Notepad · [x] V/9-11 Explorer, Delete.
- „Pentru lecția următoare” de la V/29 (`Se dau 40 pentru «puncte»`; `tabel-urmarire` cu propriul algoritm; „nu are ramura vidă, nici decizii una în alta”): respectat. Datele se scriu ca la V/28-29.
- V/31 nu presupune nimic despre fișierele mele: nu rămâne nimic pe calculator.

## Granița
**Predau:** nimic. **Cer:** doar ce e în hartă. **NU:** Scratch și vocabularul lui, repetiția, decizii una în alta (`_proba\vocabular.txt` → 0). Lecția nu încarcă nimic din Scratch. Singura noutate e GESTUL din pagină: cartonașul „Dacă…” aduce decizia, iar ↑ duce pasul în ramură; e predat la P4, exersat la P4, abia apoi cerut.

## Decizii (luate fără profesor; motivul)
1. **Scrierea se judecă pe rezultat (regula 29).** „Corect” = robotul face toate seturile și afișează ce trebuie. Sunt primite condiția „pe dos” cu ramurile schimbate, „Afișează” în fiecare ramură, două decizii una după alta. **Punctele (R1):** la B1 și A1, pe bucăți, pe robotul „iertat” (intrările sunt puse dinainte, ce nu se poate face se sare), ca o scăpare să coste doar punctele ei; rezultatele se socotesc doar dacă o decizie schimbă chiar rezultatul, adică rezultatul depinde de datele din condiția ei (J2: „mereu −12” ia 6 p și sub decizie, și în ambele ramuri; A1 mereu „Rămânem” ia 3). Tabelul de programe-tip, cu punctele scrise înainte de rulare: `_proba\tabel_programe.js`. Proba: `_proba\enumerare.js` încearcă 194.628 de programe la B1 (și familiile la A1, P4, toate cele 720 de ordini la C2) contra unui oracol scris de mână: **fals primite 0, fals respinse 0**.
2. **Scrierea LIBERĂ NU se notează automat** (variantă respinsă: analizor de text în pagină: nu poate spune sigur ce înseamnă o propoziție de copil). Ea stă în laborator, iar pagina spune cinstit: din cartonașe verifică robotul; în Notepad sau în caiet verifici tu și arăți profesorului (P6, laboratorul).
3. **C/B/A:** C = cu pașii dați (pașii sunt deja scriși: C1 are algoritmul în cuvinte, C2 are pașii, C3 are tabelul); B = singur, situație cunoscută; A = situație nouă + explicație. Descriptorii din `Proiectul_unitatii_V-U5.md`, fără să-i copiez ca barem.
4. **O scăpare se pedepsește o singură dată (ghidul IV.2 §7):** la tabele, fiecare rând se judecă și față de rândul ELEVULUI de deasupra; bifele simulatorului rămân ale lui (arată față de algoritm), iar punctele le spune blocul de sub exercițiu. Probat pe drumuri de copil în `enumerare.js`.
5. **Valorile la C1 (schimbat la R1):** numărul se judecă oriunde există casetă („Ce se cere”, „Pe parcurs”). În „Ce se dă” nu există casetă, deci numărul nu se plătește a doua oară: linia lui e pază: se dă doar împreună cu un lucru făcut și doar dacă celălalt număr e scris (J2: tot în „Ce se dă”, fără niciun număr = 6 p; manevra în „Ce se dă”, fără numere = 8; cu 39 scris = 10). O singură scăpare costă 2 p, nu 3.
6. **Punctele nu ating niciun test pe pornire:** C2 pornește cu pașii amestecați, la 6 mutări de o ordine bună (`_proba\r1_c2start.js`), iar `enumerare.js` confirmă 0 teste trecute pe starea de pornire; „Verifică” pe neatins nu socotește (toate tipurile) și lasă bifele închise (R1); sub jumătate din lucru, „Verifică” întreabă o dată (R1).
7. **Pașii de pe P4 și P5 (gesturile reale, regula 10):** pornești Notepad; scrii primul rând. Laboratorul pleacă de acolo.
8. **Laboratorul = „dacă mai ai timp; altfel, ora viitoare”** (ca V/17): altfel drumul trece de 50 de minute. Gesturile reale din P4 și P5 rămân în oră.
9. **Explicația (schimbat la R1):** A2 e ALEGERE despre condiția de la A1 (răspunsurile scrise care dau puncte nu pot depinde de o listă care nu se termină, ghidul IV.2 §7), iar sub ea, obligatoriu, fără puncte, o propoziție în caiet: „Am ales condiția ... pentru că ...” (ghidul IV.2 §6). Pagina n-o poate verifica: elevul o arată profesorului. Cea din laborator rămâne „Dacă mai ai timp”.
10. **La sfârșitul orei** se șterge doar fișierul de azi, numit: „începe cu numele tău, conține `_algoritm`, poate și o cifră”; lucrările lecțiilor 22, 23, 25 se spun pe nume, ca nu se ating.
11. **Imaginile: 0 fișiere noi.** Legături spre `../m4-l27/img/casa-self-service.webp` și `../m4-l28/img/notepad-fila.webp`, cu atribuirea lor (`SURSE.json` al lecțiilor acelea). Fără `img\` propriu.
12. **Elevul lent (R1):** „Nu termini?”, pliat, la fiecare cerință: treci la cerința următoare, sari la oricare, ceri nota pe ce ai lucrat. Nota = regula 37, cu 0 p la cerințele neverificate (ca o lucrare predată neterminată), iar pagina le numește. Proba rămâne doar în memorie (regula 23), deci data viitoare elevul sare la cerința lui și adună punctele din caiet; variantă respinsă: o casetă pentru punctele din caiet („Punctajul nu se poate păcăli”, ghidul IV.2 §7).
13. **Testele și indiciul sunt ascunse până la prima verificare (R1, ghidul IV.2 §7 și T4):** în probă și la exercițiile pașilor; numele lor nu sunt indicii, iar citirea scade.

## Simulatorul: extensia `lectii\_sim\eval-algoritmi-v.js` (NOUĂ, proprietar: lecția aceasta)
- Global `window.EvalAlgoritmiV`, stil `#ea-css`, clase `ea-`, semnul `eav_proba_golita`. API + reguli în capul fișierului; nu modifică nimic din ce încarcă.
- **Pentru componenta comună (fără să le ating):** (1) `urmarire-decizie.js` și `cutii-variabile.js` își lasă ascultătorii pe `#body` până la următoarea lor desenare; motorul refolosește `#body` la „Încă un exercițiu”, deci, dacă după `tabel-urmarire` vine alt tip, primul clic redesenează tabelul peste exercițiu (găsit la B2 → A1, `_proba\parcurge_r2.txt`). Ocolit în extensie (`curataStrain`, prin mânerele lor `_udClick`, `_cvClick` …); o lecție care amestecă tipurile fără extensia mea are defectul. (2) `SecventaLiniara._intern` nu expune `citesteNr`, deci citesc căsuțele prin `CutiiVariabile.numar` + goluri; judecata tabelului rămâne a lui V/28. (3) Motorul n-are o cale publică de a trece la alt exercițiu din listă: „Treci la …” și „Sari la” folosesc `JocMotor.test.exercitiu(k)`, ca `laInceput`; un `JocMotor.mergiLaExercitiu` ar fi mai curat. (4) După un „Verifică” care nu socotește, bifele simulatoarelor V/26, V/29 se închid prin `st.verificat=false` + `body._draw()`, iar căsuțele V/28 prin scoaterea claselor: un `api.anuleazaVerificarea()` în motor ar fi mai curat.

## Pentru lecția următoare (V/31, Scratch)
- **Ce rămâne la elev:** tot ce a evaluat V-U5, cu cuvintele lui: „Citește”, „Calculează … și pune rezultatul în cutia”, „Afișează”, „Dacă … atunci … altfel”, traseul, tabelul de urmărire. Pe calculator nimic (fișierul de azi șters). În caiet: traseele și, poate, algoritmul.
- **API:** `EvalAlgoritmiV.scrie` e tipul cartonașelor (lumea cutiilor, cu robot); e legat de V/30 (doar de folosit, nu schimbat). V/31 nu are nevoie de el.

## Durata (metoda judecătorului: `_proba\r1_durata.py` → `_proba\r1_durata.txt`; `durata.py` al autorului nu mai e în vigoare)
Cuvintele se numără pe ce e pe ecran. Copia scriptului lui J1; am schimbat doar rândurile atinse, fiecare cu motivul în fișier: C2 cu 6 mutări și fără robot cerut, P4 cu „Dacă…” adus și fără robot cerut, A2 cu propoziția din caiet (+75 s), tastarea de la P5, „2 cerințe greșite” fără a doua verificare (repararea e facultativă: „Treci la …”).
| Drumul | 110 cuv./min | 80 cuv./min |
|---|---|---|
| Înainte de R1 (J1): fără greșeli / cu 2 cerințe greșite | 54,0 / 56,8 | 65,5 / 68,9 |
| **După R1: fără greșeli / cu 2 cerințe greșite** | **48,0 / 49,9** | **57,1 / 59,5** |
| Plus laboratorul („dacă mai ai timp”) | 59,7 | 70,8 |

**La 110 încape în 50. La 80 nu încape:** elevul lent are „Nu termini?” (sare, primește nota pe ce a lucrat) și „Când mai sunt 10 minute din oră”. De cronometrat la clasă. S-a tăiat numai citit: repetiții ale simulatorului, testele până la prima verificare, legende, trimiterile „Recitește” (mutate în „Explică altfel” și în rezumat); **niciun gest real scos**. Laboratorul rămâne „dacă mai ai timp; altfel, ora viitoare”.

## Faptele, pe scurt (`afirmatii.json`: 29 — 19 PROBAT, 6 PRELUAT, 2 DOCUMENTAT, 2 DEDUS)
Notepad și Explorer NU s-au pornit (aplicație din Magazin / ecran vizibil): faptele sunt preluate din V/15 și V/28. Niciun Office. Toate valorile din pagină sunt recalculate de `enumerare.js`. Trimiterile la pași: `_proba\proba_trimiteri.py` → 0 (a prins „din 9” la lecția 1, care are 10 pași).

## Nesigur / ce n-am putut verifica
- Laboratorul pe calculatoarele reale (Notepad, „Închideți fila”, Windows 10): `capturi_lipsa.json` L1-L2, moștenit de la V/15, V/28.
- Durata reală la clasă a probei (estimare, nu cronometrare).
- Dacă un copil de 11 ani înțelege singur mutarea prin ramuri cu ↑ (P4): probat doar cu gesturi; agentul-începător n-a rulat (T1, pasul dirijorului).

## Reparațiile după judecata 1 (09.11.2026)
Registrul, cu fiecare punct, locul și proba: `_verificare\registru_j1.md`. Probele: `_proba\proba_reparatii.py` (o verificare pe literă, 390 cu atingere + 1280; `--inainte-r1` = pe `_proba\inainte_r1\`), `_proba\tabel_programe.js`, `_proba\enumerare.js`, copiile oracolelor judecătorilor. API: `eval-algoritmi-v.js` 1.1 adaugă `testeAscunse`, testele `citire`, `decizia`, `rez`, `afisrez`; V/31 și V/32 nu-l încarcă. Durata: mai sus.

## Reparațiile după judecata 2 (09.11.2026)
Șase puncte MINOR, cu reparația exactă: `_verificare\registru_j2.md` (X, Y, Z, AA, AB, AC). Extensia e acum 1.2, cu același API. **X:** la nota pe ce a lucrat, în caiet merg punctele fără oficiu („Cele 10 din oficiu se pun o singură dată”); înainte, 34 + 45 dădea 79 în loc de 69. **Y:** o decizie care nu decide nu mai ia punctele rezultatelor (B1 mereu −12 ia 6, A1 mereu „Rămânem” ia 3). **Z:** C1 fără niciun număr aflat ia 6. **AA:** la C1, manevra stă prima în listă, ca mesajul să trimită la pasul unde e greșeala. **AB:** „Nu termini?” spune și ce faci când mai sunt 10 minute. **AC:** propoziția de împăcare, pe două propoziții scurte. Probele: `_proba\proba_reparatii.py` (`--inainte` = pe `_proba\inainte_t2\`), `_proba\tabel_programe.js`, `_proba\enumerare.js`. Durata nu s-a schimbat.

## Regula 25 (calculatorul profesorului) și regula 22
Nimic pornit pe ecranul vizibil; niciun Office; nicio oprire de proces după nume. Probele: Chromium din Playwright, headless, pagină locală (`_proba\server_local.py`), tot ce nu e 127.0.0.1 blocat, închidere cu `ctx.close()`. `activitate.py lista | grep -c "nu e în catalog"`: **3 înainte (08.11, 23:35), 0 după (09.11, după miezul nopții)**: nu a crescut; doar numărul, nicio ieșire cu nume salvată. R1: 0 înainte (09.11, 01:52), 0 după (09.11, 03:42).

## Atenție pentru judecător
1. **Punctele și bifele pot spune lucruri diferite la tabele și la C1:** bifele simulatoarelor sunt față de răspunsul bun, punctele și față de rândul elevului (decizia 4). Blocul de sub exercițiu spune punctele și propoziția care le împacă. La `scrie`, bifele = punctele.
2. **„și / sau” în A1:** V/29 a spus „Condiția e o comparație”. P4 anunță extinderea (Pentru profesor 5).
3. **Mutarea prin ramuri cu ↑** e singura noutate: e gest de interfață, nu idee.
4. **Decizia 5** (C1: o scăpare costă 2 p; în „Ce se dă”, numărul e pază).
5. **Durata la 80 cuv./min** (57,1-59,5 fără laborator): nu încape; supapele sunt „Nu termini?” și „Când mai sunt 10 minute”.
6. **B1 cu „≤” ia 12/15:** greșește doar la exact 12 ani (`_proba\tabel_programe.js`).
7. **Mesajele testelor** spun ce trebuia afișat sau ce trebuia să ajungă în cutie: testul nu dă algoritmul; după prima verificare punctele sunt deja socotite. La testele rubricii mesajul e la condițional („ar ajunge”), pentru că robotul iertat nu e robotul adevărat.
