# Lecția 36, clasa a V-a — surse, probe și ce n-am putut verifica (09.11.2026, valul D M5)

**Nu e publicată, nu e în depozit (fără commit).** Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l36.md`. Contractul: `m5_noapte_08_11\contract.md`.

## Programa și planul
- **Lecția:** V/36, M5, 18.06.2027, „Recapitulare finală. Unde am ajuns pe cele trei niveluri și ce urmează”, tip „recapitulare + feedback” (`lectii\plan.json`, `Planificare_calendaristica_clasa_V.md` r. 66).
- **Unitatea:** V-R, „Recapitulare finală și feedback de progres”, toate cele 9 competențe (`unitati.json`). Materialul planificat: `fisa_progres` (în `instrumente\` nu există un fișier cu acest nume; am folosit `Portofoliu_elev.md`, secțiunea „FIȘA MEA DE PROGRES” și „LA FINAL DE AN”).
- `recapitulare: true`: poarta verifică lecțiile și conținuturile pe toată clasa (`test_joc.py`, r. 86).
- `continuturi` (S11): V-R n-are conținut propriu, iar poarta cere unul. Declar DOAR ce reia un exercițiu din atelier, câte unul pe unitate, copiate întocmai din `curriculum.json`. Sunt acoperite PARȚIAL (reluare, nu predare); restul stau în `ancoraText`. Excepția în poartă o pot hotărî dirijorul și profesorul.

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
> „Fiecare elev parcurge fișa de niveluri și marchează unde se află la fiecare competență, cu o dovadă din portofoliu. Discuție individuală scurtă cu profesorul; se stabilește un obiectiv pentru anul următor.” Resursa: „portofoliile elevilor, fișa de niveluri”.

| Bucata | Unde |
|---|---|
| parcurge fișa de niveluri, marchează unde se află la fiecare competență | atelier, exercițiul 1 + caiet („Unde am ajuns”) |
| cu o dovadă din portofoliu | P4; laborator, punctele „Scrie ce ai găsit” și „Celelalte rânduri” |
| discuție individuală scurtă cu profesorul | P5; laborator, „Pentru discuție”: se pregătește în caiet; nu cere profesorul |
| se stabilește un obiectiv pentru anul următor | P6; laborator, „Obiectivul tău” (formă, cu un model la înot; textul e al elevului) |

## Harta „predat unde” (exercițiu → ce cere → lecția și pasul; S74, VI.1)
| Exercițiu | Rând | Ce cere | Predat la | Simulatorul (nemodificat) | Conținutul declarat |
|---|---|---|---|---|---|
| Atelier 2 | CS.1.1 | etichete pe 3 dispozitive | V/5, „Metoda: încotro merg datele?” | `fotografie.js`; fotografia și zonele lui V/5, cu mai puține obiecte | Dispozitive de intrare: exemple, rol, mod de utilizare |
| Atelier 3 | CS.1.2 | mută și redenumește | V/10, „Mutarea: Decupare, apoi Lipire”, „Redenumirea: F2 sau Redenumire” | `explorer-operatii.js` | Operații cu fișiere și directoare |
| Atelier 4 | CS.1.3 | alege pagina de încredere (Enciclopedia, nu pagina falsă cu fereastra ei), autorul și data | V/16, „Pot avea încredere? Cine a scris și când” (alt răspuns decât atelierul V/16: acolo muzeul) | `browser-web.js`, `browser-siguranta.js` | Siguranța pe Internet |
| Atelier 5 | CS.3.1 | umple coroana (galben) și acoperișul (portocaliu) | V/21, „Culoare 1, Culoare 2 și paleta”, „Umplere: găleata colorează o zonă închisă” (V/21: casa în culori reci, coroana verde) | `paint.js`, `paint-selectie.js`, `paint-culori.js` | Stiluri de umplere |
| Atelier 6 | CS.2.1-2.3 | tabelul de urmărire cu o decizie (algoritm nou, «minute» ≥ 15, ramura „altfel”) | V/29, „Tabelul de urmărire, completat împreună” | `urmarire-decizie.js` (cu `cutii-variabile.js`, `evaluare-expresii.js`) | Structura alternativă (decizională)Medii grafice interactive - elemente de interfață specifice mediului grafic interactiv |
| Atelier 7 | CS.3.2 | reproduce un traseu pe care V/32 nu-l are (`[[0,0],[50,0],[50,50],[150,50]]`) | V/32, „Traseul dat: îl citești, îl spui, îl construiești” | `scratch.js`, `scratch-interfata.js` (pazaPaleta), `scratch-traseu.js` | Modalități de reprezentare a structurilor secvențiale și alternative prin blocuri grafice |
| P2 Încearcă | toate | rândul fiecărui lucru făcut | V/1 (unitățile), harta din pas | motor (`match`) | — |
| P3 Încearcă | — | literele, pe situații noi | V/1, „Cele trei niveluri” | motor (`classify`) | — |
| Î1-Î5 | — | litere, dovezi, hartă, fișa, discuția | P2-P5 | motor (`choice`) | — |

**Harta din pagină, pe lecții:** CS.1.1 = 2-7, CS.1.2 = 8-12, CS.1.3 = 13-17, CS.3.1 = 18-23: din planificare (unitatea). **Împărțirea din V-U5 și V-U6 e citirea mea:** planificarea pune toate CS.2.x pe toate lecțiile V-U5 și CS.3.2, CS.3.3 pe toate lecțiile V-U6. Am ales după descriptori: CS.2.1 = 24, 25, 29; CS.2.2 = 26, 27, 30; CS.2.3 = 28, 29, 30; CS.3.2 = 31-33; CS.3.3 = 34-35.

## Cuvintele de copil (descriptor → pagină)
Tabelul întreg, 48 de perechi, e în `_proba\proba_date.py`, dicționarul `T`: fraza oficială (căutată în `Descriptori_clasa_V.md`) și cuvintele din pagină. Simplificări conștiente: „cu sprijin, în pași ghidați” → „cu pași sau cu ajutor”; „independent” → „singur”; „contexte familiare” → „la lucruri pe care le-ai mai făcut”; „contexte noi” → „într-o situație nouă”; „condiții de bază (cu operatori relaționali)” → „o condiție simplă (mai mic, mai mare, egal)”; „condiții diverse” → „condiții mai variate”. Ce am lăsat deoparte: „aplicând cunoștințe de bază despre…” rămâne doar la CS.1.1 și CS.1.2, unde e vizibil pentru copil.

## Ce presupune lecția că știe elevul (`profil.json`) — cu bife
✔ V/1: C, B, A, unitățile (pașii numiți). ✔ V/5 metoda. ✔ V/9-10 Explorer, căutarea. ✔ V/16 pagina de încredere. ✔ V/21 Umplere. ✔ V/29 tabelul. ✔ V/32 traseul. **În lucru la scriere** (de verificat de dirijor după publicare): V/33, V/34 (`v_l33.md`, `v_l34.md`), V/35 (`v_l35.md`, citit din nou 12:34): fișierul `<clasa ta>-prenume-joc`, `…-joc-final`, fișa jocului, „Ce spun la prezentare”. Cine n-a făcut o lecție nu e blocat: „Încă n-am lucrat la asta” + lecția de pe rând.

## Decizii (luate fără profesor; motivul)
1. **Literele stau doar în caiet.** Pagina le arată cât ești pe exercițiu, apoi le uită. Respins: păstrarea pe `cheie@profil` (rămâne pe calculatorul comun și în sertarul care se sincronizează cu serverul; regula 27 și brieful o interzic); păstrarea până la închiderea filei (colegul de după ar vedea-o dacă fila rămâne deschisă).
2. **Niciun câmp de scris în fișă.** Dovada, propozițiile și obiectivul se scriu în caiet: nimic tastat, nimic de scăpat, iar la telefon merge la fel.
3. **Am pus un buton care nu e literă: „Încă n-am lucrat la asta”.** Fișa oficială n-are așa ceva, iar pagina spune limpede „Nu e o literă din fișă”. Elevul absent nu e silit să-și pună D2. Pasul lui: lecția de pe rând și „spune-i profesorului”.
4. **Testul fișei judecă doar forma:** ceva ales pe fiecare rând (regula 29). Nu există literă „bună”; nici semn automat de nivel din exerciții. Intro-ul din atelier spune cinstit că „Cum le citești” e un sfat al paginii, nu o regulă a fișei, cu cuvintele din `Descriptori_clasa_V.md` (B: „independent”, „în contexte familiare”; C: „cu sprijin”); A n-are exercițiu (cere o situație nouă). (R1, M.)
5. **P0 + 5, cu fișa în atelier, nu în pași:** activitatea profesorului e scheletul atelierului (I.1). Fișa vine PRIMA în atelier, iar exercițiile din unități după ea: elevul lent ajunge sigur la fișă.
6. **Scratch în laborator e „Dacă mai ai timp”:** deschiderea jocului costă ~2 minute, iar elevul cu telefon sau fără fișier nu pierde nimic. Gestul real obligatoriu e în Explorer (o aplicație deja predată, S74).
7. **Dovada se scrie scurt, „lecția 10”,** nu fraze: 9 rânduri cu fraze nu încap (am măsurat: 56 de minute cu ele, 49 acum).
8. **Numele din hartă** („fișiere și foldere” etc.) sunt scrise de mine, ca etichete scurte; textul fișei stă la fiecare rând al exercițiului 1, întocmai.
9. **Fără sedile:** `oficial` e textul din `Fisa_niveluri_clasa_V.md` cu ş, ţ → ș, ț (T2).
10. **Fără „nivel general” și fără „plan individualizat” în pagină:** coloanele acestea din fișa oficială sunt ale profesorului. Portofoliul are „Nivelul meu general”, „Lucrul de care sunt cel mai mulțumit”, „Ce vreau să învăț mai departe”: cele două din urmă sunt în P5 și P6, cu alte cuvinte; „Nivelul general” nu l-am cerut (nu există regulă pentru el la elev).

## Probe (rezultate; toate pe pagina servită local, rețeaua blocată, `ctx.close()`)
| Proba | Rezultat |
|---|---|
| `test_joc.py --dir lectii\v m5-l36` | TRECUT, 25 de exerciții jucate |
| `verifica_lectie.py … --fara-t1` | ultima linie 0 (S2: 5/6 aplicare) |
| `_proba\parcurge.py` (390 cu atingere, 1280 cu mouse) | 0 probleme, 0 erori; fișa și cele 6 exerciții, greșit și apoi corect; legătură din hartă deschisă |
| `_proba\proba_fisa.py` | 0: cod, stocare, cereri, elev neînscris și elev inventat conectat, colegul de după (alt exercițiu, reîncărcare, plecare, alt elev, `Prezenta.iesi`, Golește); copia stricată e prinsă (3 semnalări) |
| `_proba\proba_date.py` | 0: competențele, literele, 48 de perechi descriptor → cuvinte, „ce urmează”, 34 de lecții pe hartă, 17 dovezi găsite în paginile lor |
| `_proba\proba_diploma.py` | 0 |
| `_proba\durata.py` | 49,2 minute; 0 cuvinte viitoare în afara pasului 6 |
| `learninghub_date_personale.py` | 0 |
| `nume_inventate.py` | 0 |

## Socoteala duratei — refăcută la R1 (09.11.2026) cu metoda judecătorului 1 (`_proba\durata_j1.py` = `_verificare\j1_durata.py`, neschimbat)
Înainte → după: cu exercițiile 2-7, fără descriptori **52,4 → 51,1**; cu exercițiile și toți descriptorii **57,0 → 55,7**; fără exercițiile 2-7: 44,0 → 42,7 și 48,6 → 47,3. Drumul obligatoriu de acum: fișa + cel puțin un exercițiu (al rândului nesigur) = **44,1-48,7 min**; celelalte exerciții „dacă mai ai timp” (rămân toate în pagină, niciun gest tăiat). Laboratorul: 16,5 min, „cam 15 minute” în pagină. Citit tăiat: −138 de cuvinte net (pașii, întrebările, laboratorul, cerințele exercițiilor), după ce reparațiile au adus ~150. **De cronometrat la clasă:** scrisul în caiet și drumul cu toate exercițiile. **Judecata 2 (`_verificare\j2_durata.py`):** 45,4 min la 110 cuv./min (fișa cu rândul de sens al literei apăsate, un exercițiu, jumătate din indicii); 54,4 la 80 cuv./min. Elevul lent, cu supapele paginii („Au trecut 30 de minute din oră? Treci la calculator” și „Când mai sunt 10 minute din oră”), ajunge la laborator pe la minutul 31 și termină întrebările pe la 51,5: peste 50 cu ~1,5 min; întrebările nefăcute le poate face acasă. De cronometrat la clasă.

### Socoteala autorului, la scriere (`_proba\durata.py`, 110 cuv./min, gesturi cu elevul lent, valorile judecătorului V/33; rândurile în `durata.json`) — ÎNLOCUITĂ de cea de sus
**~2.900 de cuvinte pe drumul obligatoriu (26,4 min de citit), numărate cu tot cu explicațiile de după răspuns, + 22,8 min de gesturi = 49,2 min.** La limită: **de cronometrat la clasă** scrisul în caiet (dovezi, propoziții, obiectiv: 8 minute în socoteală). Ce se sare primul: exercițiile 2-7 („Au trecut 30 de minute din oră? Treci la calculator”). Obligatoriu la „Când mai sunt 10 minute din oră”: fișa (cu „încă nu” la rândurile neatinse), propozițiile, obiectivul, întrebările.

## Pentru lecția următoare
Ultima lecție a clasei. Forma pentru VI/36, VII/36, VIII/35: `m5_noapte_08_11\granite\v_l36.md`.

## Pentru componenta comună
- `lectii\_sim\fisa-niveluri.js` e nouă (1.1 după R1); API în capul fișierului și în `fisa-niveluri.GATA.md`. Nimic altceva nu e atins.
- **`urmarire-decizie.js` (proprietarul lui, prin poarta de lansare):** mânerul de clic rămâne pe `#body` după ce exercițiul se schimbă (motorul refolosește `#body`); după tabelul rezolvat, orice `<button>` din exercițiul următor redesenează tabelul peste el (`if (st.gata) { st.msg = esc(NOTA_GATA); draw(); return; }`). Reparația propusă de judecătorul 1 (încercată de el în memorie la 1280 și 390): după `const x = b.dataset.x, S = st.S[st.tab];` se adaugă `if (!x) return;`; mai curat, mânerul se scoate când `#body` nu mai conține tabelul. V/36 ocolește defectul din pagină (`FisaNiveluri.curat`); orice altă lecție cu tabelul în atelier, urmat de alt exercițiu, îl are.
- **Motorul:** nu există „Mergi la exercițiul k” pentru atelier; V/36 folosește `JocMotor.test.exercitiu(k)`, ca `excelx-test.js` și `simppt-proba.js`. Dacă proprietarul motorului adaugă un salt public, `FisaNiveluri.sari` trece pe el. Bifele laboratorului au 20 px la 390 (sonnet, J1-10).
- **`browser-siguranta.js`:** „Muzeul, 3 februarie 2026” e primit drept autor la pagina muzeului (cheia `muzeu*`); la V/36 pagina bună e acum Enciclopedia (`enciclopedi*`, `echipa`), unde numele sitului e chiar autorul.
- `scratch.js` la 390: căsuța de 21,8 px e defectul deja în coadă (contract, „Ce NU intră”); aici un număr se scrie la fel ca la V/32.
- Pagina încarcă 14 fișiere de simulator (~620 KB necomprimat). `parcurge.py` n-a văzut probleme, dar pe un telefon slab (Dumbrava) prima încărcare n-a fost măsurată.

## Contradicții găsite
- `Descriptori_clasa_V.md`: la CS.3.1 (De bază) și CS.3.3 (Avansat) textul oficial are lipite bucăți din standard („realizării unor materiale digitale copiere, mutare…”, „Medii grafice interactive…”). Am tradus doar descriptorul. Vine așa din extragerea din ordin; de verificat de profesor pe PDF.
- `unitati.json` numește materialul `fisa_progres`, care nu există ca fișier (vezi sus).
- „Plan individualizat” e o coloană din fișa oficială. Pagina nu o reia: e a profesorului.

## Pentru profesor
1. **Mapa de portofoliu:** ați dat-o elevilor? Nicio lecție a clasei n-o pomenește. Pagina scrie: „Ai primit de la profesor o mapă? Acolo e. N-ai? Caietul e portofoliul tău, dacă profesorul nu vă spune altfel.”
2. **Foile lucrărilor** rămân la elevi? Pagina scrie „dacă le ai”.
3. **Calculatoarele din laborator se curăță** înainte de iunie? Dacă da, „fișierele pot dispărea” devine „au dispărut”, iar caietul e singura dovadă. Pagina merge și așa.
4. **Ce se întâmplă cu fișierele elevilor la sfârșit de an?** Pagina spune „Azi nu ștergi nimic… până vă spune profesorul ce faceți cu fișierele”.
5. **Discuția:** la o clasă mare, 2-3 minute pe elev nu încap într-o oră. Pagina nu promite că ajungeți la toți: „Nu ajunge azi? Îi arăți caietul când îți spune el”.
6. **Prezentarea jocului** (dacă rămâne pentru ora 36, `lectii\v\m5-l35\surse.md`, „Pentru profesor” 3): lecția nu are loc pentru ea; cere o decizie.
7. **Harta pe lecții** la V-U5 și V-U6 e citirea mea (vezi sus).
8. **„Încă n-am lucrat la asta”** nu e pe fișa oficială: e al paginii. Îl scoateți ușor (o proprietate în date), dar atunci elevul absent alege D1 sau D2.
9. **Regula semnelor** („singur = semn pentru B, cu indiciu = semn pentru C”) e a paginii, doar pentru elev.

## Atenție pentru judecător
`atentie_judecator` din răspunsul final. Pe scurt: S11 (`continuturi`), „Uite cum” din P2 are harta (87 de cuvinte cu tot cu numere), fișa e `practice` (nu are „Arată-mi răspunsul”, nu există răspuns), două fapte cu „dacă” (mapa, lucrările).

## Reguli verificate pe lecție
1 (`durata.py`, viitor: 0), 2 (plafoane), 3, 5, 7 (`afirmatii.json`), 8, 10 (Explorer, caiet), 15, 20, 23 și 27 (`proba_fisa.py`), 24, 25, 26 (nu se salvează nimic), 28, 29, 30 (49,2 min), 31, 32, 33, 35, 38. Neaplicabile: 6, 11, 13, 18, 19, 21 (nu are fișiere de descărcat).
## Reparațiile după judecata 1 (09.11.2026, R1, autor proaspăt)
Registrul: `_verificare\registru_j1.md` — 20 de puncte (2 GRAV, 4 MAJOR, 14 MINOR, după unirea celor două judecăți), **20 reparate, 0 respinse**. Copia dinainte: `_proba\inainte_r1\` (pagina, `afirmatii.json`, `surse.md`, `profil.json`, `capturi_lipsa.json`, componenta, `proba_fisa.py`, `durata.py`).
- **Pagina:** `tipuri: FisaNiveluri.curat({…})` (A); „Sari la exercițiul” în intro-ul atelierului și în laborator (B); laboratorul cu numele fișierelor și calculatorul din caiet (V/22, V/34-35) și cu „Ce înseamnă codurile” (D, E); exercițiile 4-7 schimbate în variante-soră adevărate (K, Q); „Cum le citești” ca sfat al paginii, cu cuvintele descriptorilor (M); citit tăiat, exercițiile 2-7 pe priorități (F); G, J, L, N, O, R, S.
- **Componenta `fisa-niveluri.js` 1.0 → 1.1** (doar adăugiri): `curat`, `sari`, `coduri`, eticheta '' la `harta`/`lectii`, `Q.gata`, fără „Corect!” la fișă, focus pe „Încă un exercițiu”, mânerele nu mai aruncă erori (C, H, I). Granița: „SCHIMBAT 20:35” + capcanele A-C. Predarea: `lectii\_sim\fisa-niveluri.GATA.md`.
- **Probele:** `_proba\proba_reparatii.py` (drumul elevului cu butoanele paginii, fără `JocMotor.test` pe drum, 390 cu atingere + 1280): nou 0 / 0 / 0; pe versiunea veche pică 9 + 11 + 12 verificări. `_proba\proba_fisa.py` (rândurile din date) 0; `_proba\proba_date.py` 0; durata: `_proba\durata_j1.py` (secțiunea de sus).
- **Pentru judecătorul 2:** saltul folosește cârligul porții (`JocMotor.test.exercitiu`), fiindcă motorul n-are altă cale; drumul cu toate exercițiile și toți descriptorii rămâne 55,7 min (obligatoriul 44,1-48,7); căutarea în Explorer după numele din caiet n-a fost probată (Explorer nu se pornește).
