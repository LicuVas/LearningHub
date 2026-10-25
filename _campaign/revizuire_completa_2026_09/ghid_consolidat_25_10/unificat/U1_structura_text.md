# U1 — Structura și textul lecției (fișa unificată, 25.10.2026)

Grupul: **STRUCTURA** (forma lecției, pașii, durata, ordinea, prerechizitele) și **TEXT** (limbaj, „Pe telefon”, mesaje, trimiteri), din cele 11 fișiere `ghid_consolidat_25_10\extrase\`.

**Trimiterile.** `[surse: X:N]` = fișierul de extras X, linia N (acolo stă sursa originală, cu cale și dată). B = `B_jurnal.md`, C1 = `C1_rapoarte.md`, C2 = `C2_planuri.md`, C3 = `C3_cercetare_memorie.md`, D1 = `D1_prompturi.md`, D2 = `D2_prompturi_m3.md`, E_v / E_vi / E_vii / E_viii = notele lecțiilor clasei, E_vii13 = `E_vii_l01_03.md`. V/18 = clasa a V-a, lecția 18. Prima trimitere e cea mai bună; ce trece de 4 e în „Anexa: surse în plus”.

**Numerotarea din `05_STANDARD_LECTIE.md`.** „(regula N)” = regulile 1-10 și 20-27. Punctele 1-19 din „Ce au găsit judecătorii la lecțiile nr. 4” le scriu „(judecătorii nr. N)”, ca să nu se încurce cu regulile 1-10; sursele spun și ele „regula 13/15/19” când e vorba de judecătorii nr. 13/15/19.

## STRUCTURA

### A. Ancora: planul, ordinea, programa

- **S1.** O lecție din plan = o pagină = un nivel pe pași, în `lectii\<clasa>\mM-lNN\` (`mod:'lectie'`, cheia `lectie_<clasa>_mM_lNN`); niciun nivel nu acoperă două lecții, iar identificatorii sunt nume scurte stabile, nu numere de ordine. Lecția terminată se publică imediat, cu insigna „verificat parțial” până trece mașina bancul. [surse: B:11, C2:97, C2:122, C3:12]
- **S2.** Ordinea = `unitati.json` (decizia profesorului) + `Calendar_ore_<clasa>.md` (datele); la liceu `curriculum_liceu.json` și `unitati_liceu.json`; la Tupilați `Calendar_ore_Tupilati.md`, cu două rânduri la ora simultană 6/7. Codul de unitate (V-U1) nu e în `Calendar_ore_*.md`: îl afli după titlul exact, în `Planificare_calendaristica_clasa_X.md`. „Lecția de azi” e un link sigur, pe sit și pe panou. [surse: C2:82, C3:30, C2:65]
- **S3.** Modulele sunt cele 5 bucăți ale anului: M1 = lecțiile 1-7, M2 = 8-15, M3 = 16-21, M4 = 22-29, M5 = 30-36; „unitățile” (6, cuvântul fișei profesorului) nu sunt module. „M1 = 1-9(?)” din C2:163 e infirmat de standard și de dosarele `m2-l08`, `m2-l09`. [surse: E_v:30, C2:163, B:11]
- **S4.** Când calendarele aceleiași clase numără diferit aceeași oră (VII: `7_MA` nr. 17, `VII_A/B` nr. 18; Izvoare cu un număr în plus), pagina urmează `unitati.json` / `Calendar_ore_7_MA.md`, iar diferența se scrie în `surse.md`. [surse: E_vii:308, E_vii:320, E_vii:340, E_vii:357]
- **S5.** `lectii/plan.json` ține pe fiecare lecție: nr, modul, titlu, tip (predare / consolidare / evaluare sumativă), data, cale, cheie, stare (`in_lucru` / `publicat`), insigna. M2 = 06.11–25.12.2026 la V, VI, VII, câte o lecție vinerea. [surse: C2:239]
- **S6.** (deschis) Lecția 15 a M2 cade vineri 25.12.2026, în vacanța de iarnă (23.12.2026–08.01.2027); mutarea sau comasarea o hotărăște profesorul. [surse: C1:19]
- **S7.** Titlul se copiază EXACT din calendar / `unitati.json`, iar `continuturi` cuvânt cu cuvânt din `curriculum.json` (OMEN 3393/2017), fiecare cu cel puțin o sarcină. Ce din rândul programei e al altei lecții nu se declară (se spune unde e); nici conținuturile doar folosite, neverificate. [surse: E_vi:88, C2:97, E_vii13:97, E_vii:308]
- **S8.** Fiecare parte a conținutului e PREDATĂ (pas + exercițiu + întrebare), nu doar declarată; `surse.md` are tabelul conținut → cerință / „Încearcă” / întrebare. [surse: E_viii:131, C2:122, E_vi:252, E_vi:328]
- **S9.** Obiectivul e o propoziție; fiecare verb al lui și fiecare promisiune din `promisiuni.json` are o sarcină de transfer, iar itemii care îl dovedesc sunt informativi (agentul nu-i rezolvă corect fără lecție). [surse: C2:98]
- **S10.** Ora de organizare / evaluare inițială nu are conținut nou: unitatea `-E0`, `continuturi:[]`, fără `recapitulare:true` și fără declarații false (ocoliș); `test_joc.py` are excepție pentru `-E0`. [surse: E_viii:20, E_vii13:22]
- **S11.** (deschis) Recapitularea clasei anterioare n-are conținut în programa clasei, dar poarta (`test_joc.py` r. 95-105) cere unul: VI/17 declară un conținut acoperit PARȚIAL, cu cele reluate în `ancoraText`. Excepția în poartă sau nota „acoperit parțial” o hotărăsc dirijorul și profesorul. [surse: E_vi:267]
- **S12.** Activitatea de învățare din planificarea profesorului se citează în `surse.md` și se pune pe pași, atelier și întrebări; dacă la ora simultană, fără profesor, nu se poate face (ex. „traseu în lanț”), se face în atelier, cu personaje inventate. Ce se amână la lecția vecină se scrie la granițe. [surse: E_vi:224, E_vi:295, E_vii:195, E_viii:197]
- **S13.** Materialul profesorului se ia punct cu punct, iar `surse.md` spune ce NU s-a luat și de ce. Documentele lui au prioritate; ce nu cer ele nu se predă (atributul `border`, `mailto:`, ancorele `#`). [surse: E_viii:66, C2:34, E_viii:291, E_viii:299]
- **S14.** La liceu și la profesional, fiecare pas practic are un exemplu din domeniul clasei (silvicultură, transporturi, farmacie…), cu conținuturi din `curriculum_liceu.json`. [surse: C2:117]
- **S15.** O temă are o singură pagină canonică, iar repetiția se marchează „recapitulare”; două foldere care predau aceeași temă în paralel produc contradicții. [surse: C2:122, C3:32]
- **S16.** Situl vechi (plan): materiile mutate la clasa bună (Word VII → V, web VII → VIII-U2, șiruri → VIII-U3, baze de date → liceu), dublurile topite în niveluri; restul rămâne public cu banda „nerevizuit — lecția din plan e aici”, adresa veche trimite la nivelul nou, iar progresul și diplomele nu se rup. Se aruncă doar `cls8/extra-materiale-suplimentare` (gol). [surse: C2:84]

### B. Forma paginii

- **S17.** Ordinea paginii: antet (titlu, `continuturi`, `obiectiv`, „Ai nevoie de”) → P0 „La ce folosește” (fără acțiuni, o imagine din viața reală) → 3-5 pași → atelier cu teste numite → „Acum în aplicația adevărată” (`aplicatieReala`, înainte de întrebări) → 5 întrebări → „Ce am învățat”. Pagina de citit se generează din același conținut, ca să nu se contrazică. [surse: C2:78, C3:13, E_v:102, C2:65]
- **S18.** Livrabile: `index.html`, `afirmatii.json`, `profil.json`, `capturi_lipsa.json`, `surse.md` și, la nevoie, `img\`. [surse: C2:58]
- **S19.** Fiecare pas de conținut are text (o idee, cu imagine reală sau simulator), „Uite cum”, „Explică-mi altfel”, „Încearcă” și, la cerere, „Încă un exercițiu”; capcanele tipice intră ca variante greșite puse special, iar clasificarea vine după calcul. (înlocuiește: „altfel” doar la pașii grei, C3:14, 27.09) [surse: E_viii:23, E_v:28, C3:14]
- **S20.** În pas: explicație → „Uite cum” → „Încearcă”, nicio sarcină înaintea explicației ei; caseta „Acum la calculator” vine după „Uite cum”, ca elevul să vadă întâi capturile. [surse: C2:101, E_v:311]
- **S21.** Toate „Încearcă” sunt de aplicare sau în simulator (regula 5); ce doar se numește se spune pe față („azi doar le recunoști”), iar figura, simulatorul și textul folosesc aceleași numere. [surse: E_vi:104]
- **S22.** În pași, indiciul apare singur după prima greșeală și „Arată-mi răspunsul” după a doua, fără puncte pierdute; la verificarea finală indiciul costă (7 XP în loc de 10, fără steaua „din prima”). „Știu deja — la verificare” e pentru cine nu vrea să recitească. [surse: C3:22, C3:21]
- **S23.** P0 predă cuvintele-imagine ale lecției (priză, cablu, ștecăr, mufe, cu fotografii), iar P1 doar regulile; toate lecțiile încep cu „La ce folosește”. [surse: E_v:64, C2:247, C2:122]
- **S24.** Cuprinsul nu repetă „La final știi” (obiectivul îl arată motorul), „Ce am învățat” din atelier nu repetă diploma, iar „Cum lucrezi” spune adevărul despre lecție. [surse: E_v:311, D2:19, E_v:29]
- **S25.** Diploma spune doar ce a făcut ORICE elev ajuns acolo: întâi cerința profesorului, apoi, separat, ce a exersat în pagină; „a aflat cum”, nu „a pus”, când exercițiul a fost doar în simulator. [surse: D2:39, E_viii:223, E_vii:147]
- **S26.** Bara de jos e a fiecărui elev: se apasă doar ce a atins el (salvat pe `cheie@profil`, unit între aparate), Î-urile pornesc blocate, `?pas=` / `?continua=1` duc la pasul atins; proba e `proba_bara_pasi.py` → 0. (înlocuiește: „pașii se pot deschide oricând”, 08.10.2026) [surse: C3:19, C3:20]
- **S27.** Pe „Acum în aplicația adevărată” motorul pune singur bifele și butonul „⧉ Ține pașii deasupra, cât lucrezi” (Chrome/Edge 116+; pe telefon nimic); autorul nu scrie „bifează” și face fiecare pas lizibil singur. [surse: C3:23]
- **S28.** „Cine ești” se stabilește la începutul atelierului, în fila lecției; laboratorul doar verifică numele (altfel fila lecției rescria schimbarea, la 5 s). [surse: E_viii:27]
- **S29.** (deschis) Motorul numără „La ce folosește” ca P1, deci „pasul 2” din text e P3 în bară; dacă se schimbă numerotarea peste tot e întrebare pentru Vasile, iar până atunci trimiterile urmează T51. [surse: C1:15, E_viii:44, E_v:311]

### C. Pașii

- **S30.** Plafonul e P0 + 3-5 pași, o idee pe pas (regula 2). Peste plafon doar cu „motiv bun” scris (ce pași rămân, ce se pierde dacă tai), iar judecătorul decide; în M3 lecțiile au fost aduse la P0 + cel mult 5 (V/18: de la P0 + 9). [surse: D1:41, D2:16, C1:7, B:161]
- **S31.** O idee nouă = pas nou, nu pas mai lung: pasul cu 4-12 idei sau cu două proceduri se împarte. Două idei strâns legate le separi sau lași una doar „numită”, fără să treci de P0 + 5. [surse: D2:25, E_v:28, E_viii:317, E_vii:98]
- **S32.** Concept nou: întâi „ce este” și „la ce folosește”, apoi „cum se face” (regula 2); un singur lucru nou pe exercițiu, cel mult 2 termeni noi pe pas (numărați de script), iar atelierul nu cere mai mult decât s-a exersat. [surse: C2:100, C2:65]
- **S33.** Textul pasului are 30-110 cuvinte, cu legenda numărată, iar „Uite cum” ~80 (oracolul lecțiilor 1 lasă 85) (regula 2, judecătorii nr. 6). Poarta `test_joc.py` avertizează abia la 150 de cuvinte pe pas și la ~163 pe punct de laborator, deci plafonul de 110 îl ții tu. [surse: E_vi:10, E_v:8, E_viii:22, E_v:63]
- **S34.** Casetele „Acum la calculator” umflă numărătoarea poartei (162-191 de cuvinte pe pas): e MINOR acceptat, iar plafonul de 110 se măsoară pe textul de predat. [surse: B:176, E_vii:147, E_v:295]
- **S35.** Ce nu încape se MUTĂ în alt pas; un concept fără loc primește pas nou, iar la comasare detaliile trec în „Uite cum”, cu exercițiile lor ca „Încă un exercițiu”. Ce nu încape fără să încarce lecția nu se predă. [surse: E_vi:10, E_viii:211, E_viii:105, E_viii:195]
- **S36.** Drumul obligatoriu (tot ce citește elevul obișnuit) se numără cu script (`cuvinte.py --max N`, `j_numara.js`, `numara_cuvinte.py`), cu ramurile opționale deoparte. O reparație îl scade: ce adaugi plătești tăind repetiții, iar depășirea se raportează, nu se ascunde. [surse: E_vi:9, E_vii13:78, E_vii13:21, E_vii13:114]
- **S37.** Un atom = un ecran (pe situl vechi, după 12.09.2026: primul pas la mediana de 214 cuvinte, drumul până la treabă 1560 → 362 px); la VII/1 ținta drumului obligatoriu e ~1.500 de cuvinte. [surse: C3:18, E_vii13:21]

### D. Durata (50 de minute)

- **S38.** Obligatoriul încape în ≤ 50 de minute pentru copilul obișnuit. Socoteala o refaci independent, „după metoda judecătorilor” (citit + tastat + gesturi + mesajele de la greșeală), și o scrii în `surse.md`; ce nu încape devine „Dacă mai ai timp” sau „ora viitoare”, spus pe pagină. [surse: D2:17, C1:8, D2:18, D1:42]
- **S39.** Ritmurile folosite (nu e unul singur, vezi K2): 80 cuv./min la a V-a (și 9 s pe gest în Paint), 100 (V/16), 110 la a VII-a, 110-120 (V/12, V/15), 45 de semne tastate/min la HTML. Unelte: `j2_durata.py`, `numara_cuvinte_j2.py`, `r1_numara.py`, `r1_masuratori.py`. [surse: D2:18, B:220, E_v:311, E_v:330]
- **S40.** Tai fără să pierzi lecția: „Încearcă”-urile în plus devin „Încă un exercițiu”, gestul repetat rămâne o dată, ies explicațiile duble, „altfel”-urile lungi, legendele lungi, „La final știi”, iar caietul primește cuvinte-cheie (157 → 37). Gesturile reale mici NU se scot: compari cu `index.inainte_j*.html`. [surse: D2:19, E_v:231, C2:292, B:188]
- **S41.** La consolidare, laboratorul cere doar gestul NOU. Când activitatea principală e laboratorul, pagina e o pregătire scurtă și spune de unde reiei („Data viitoare reiei laboratorul de la partea C”). [surse: C1:9, E_v:243]
- **S42.** Opționalul se marchează „Dacă mai ai timp (opțional):” (`li.mai-ai-timp` / `span.mai-ai-timp`), se socotește deoparte și se sare primul; un atelier lung poate fi „pentru cine are timp” (VIII/18: dacă mai sunt ≥ 35 de minute). „Cum lucrezi” spune ce e obligatoriu. [surse: E_v:380, C1:11, C1:10, E_viii:258]
- **S43.** Laboratorul se reduce la ce încape (VIII/17: ~5,5 min de tastat, lista = „dacă mai ai timp”), iar unul estimat la ~45 de minute se reverifică; proiectul notat se termină înainte de minutul 40. [surse: B:162, B:220, D1:42, B:267]
- **S44.** Un material de oră umple TOATĂ ora: ≥ 45 min, ≥ 60 de decizii cu explicație, ≥ 3 mecanici, fiecare obiectiv din planificarea LUI, progres vizibil, verificat la toate clasele zilei. [surse: C3:26]
- **S45.** (deschis) VII/19, VII/20, V/20, V/21, VIII/21 sunt la limită (~49,3-50,2 min, marja 0-0,4) și se cronometrează la clasă. Lecțiile 1 au ~2.500-3.250 de cuvinte (V/1 ≈ 70 min): elevul lent nu termină (I4 NESIGUR). [surse: B:267, C1:10, C3:31, E_v:31]

### E. Sfârșitul orei

- **S46.** Supapa se spune „Când mai sunt 10 minute din oră”, cu drum clar („Sună în 10 minute? Treci la întrebări; verificarea încrucișată și caietul le termini ora viitoare”), la fel în „Cum lucrezi” și în laborator. Ordinea întrebări / laborator e fixă în motor, deci textul spune când sari la întrebări. (înlocuiește: „Dacă se apropie sfârșitul orei”, 19.10) [surse: D2:21, B:162, D2:24, B:189]
- **S47.** Curățenia nu stă la capătul unei liste neterminate: „Cum lucrezi” spune de la început unde sari, iar punctul e marcat „La sfârșitul orei (chiar dacă n-ai terminat)”, cu numărul pasului, și repetat în laborator. [surse: D2:20, E_v:362, E_v:395, B:161]
- **S48.** Laboratorul cu cont care nu mai încape: „Dacă mai sunt mai puțin de 10 minute, NU te mai conecta azi; faci laboratorul data viitoare”, cu un rând de durată în „Pentru profesor”. [surse: D2:23, B:189]
- **S49.** Cu contul deschis, ieșirea vine prima: „Sună de pauză? Întâi Profil → Deconectează-te.”, iar laboratorul trimite direct la pasul ieșirii din cont. [surse: E_vii:333, E_vi:243]
- **S50.** Clopoțelul în mijlocul unei probe: o propoziție în intro, „proba se reia data viitoare de la început; punctele se dau la prima verificare a fiecărei cerințe”. [surse: D2:22]
- **S51.** Întâi „Termină nivelul”, apoi „Ieși (deconectare)”: motorul salvează terminarea doar la „Termină nivelul” (`motor.js` r. 942), iar cine iese întâi își pune stelele pe profilul anonim. „Ieși” e ultimul lucru, vizibil, iar laboratorul nu închide fereastra lecției înainte de întrebări. [surse: C3:25, C2:293, C1:17, E_vi:15]
- **S52.** După o oră întreruptă: „deschizi proiectul și continui de unde ai rămas”, verificând ce e deja pus, nu reluând pașii de la început. Fiecare drum de rezervă se spune până la capăt. [surse: D2:32, E_viii:286, E_vii:309]

### F. Prerechizite și granițe

- **S53.** Nimic cerut înainte de a fi predat (regula 1), și contează ORDINEA: prima sarcină nu folosește un simbol sau termen explicat mai jos („=”, referință, %). Fiecare pas se sprijină doar pe cei dinainte, iar primul nivel presupune zero cunoștințe. [surse: C3:16, C2:19, C3:15, D2:41]
- **S54.** „Predat” = în lecția curentă sau în lecțiile și modulele de dinainte; ce ține de lecțiile următoare nu se cere. Înainte să alegi un material, verifici ce lecție predă fiecare concept (un nivel pe formule nu poate fi lecția 4). [surse: C3:17, C2:34, C2:222]
- **S55.** Ce cer obligatoriu întrebările a fost predat ȘI exersat obligatoriu, nu doar în „Încă un exercițiu”. În evaluare, „nepredat, deci necerut”: tabel activitate → lecția care o predă → unde se exersează. [surse: D2:26, E_vii:179, C2:122]
- **S56.** „Ai nevoie de” trimite doar la lecții anterioare, cu legături care merg, în rânduri scurte (1-4 lucruri); primul pas pornește de la profilul ȘTIE, iar zonele și butoanele au același nume în toată seria. [surse: C2:99, E_viii:230, E_vi:77]
- **S57.** Tabelul „Ce presupun lecțiile publicate și ce folosesc” vine din `profil.json`; invers, lecția verifică ce presupun despre ea lecțiile următoare publicate („Presupus | Unde | Acoperit”). [surse: E_viii:216, E_viii:67]
- **S58.** Harta prerechizitelor o face `oracol_novice.py --harta` (nu de mână; se schimbă `prereq` / `glosar`): „Introduce”, „Presupune”, „Drumul înapoi” și blocul „Ce trebuie să știi”. [surse: C2:378]
- **S59.** Fiecare lecție își scrie GRANIȚA în `surse.md`: ce predă și ce NU, rezervat vecinei. Cuvântul unei lecții următoare nu apare înainte, nici în variante (judecătorii nr. 9), iar ce nu predai nu e nici numit; în simulator, butonul altei lecții spune „o înveți în lecția N”. [surse: C1:13, D1:53, D2:36, E_viii:65]
- **S60.** Ce lasă lecția anterioară „pentru lecția următoare” nu se preia automat: hotărăști după programă și titlu, iar decizia finală e a profesorului. Mutarea unui punct de graniță se scrie, cu motivul, doar când nu încape în plafon. [surse: E_vi:115, D1:54, E_vi:104, E_vii:260]
- **S61.** Un gest acceptat de aplicație, dar nepredat, merge în simulator (regula 9) fără să fie predat sau cerut (Shift + clic, Ctrl+A la V/11); tragerea fișierelor nu se predă, iar simulatorul spune de ce. Ce e în plus stă în pliabile („Vrei să știi mai mult?”). [surse: E_v:218, E_v:198, E_v:199]
- **S62.** Fără generalizări pe care le vor contrazice lecțiile următoare (judecătorii nr. 16): „Repetiția de azi spune de câte ori…”, nu „O repetiție spune de câte ori”. [surse: D2:37, E_vi:296]
- **S63.** Lecția următoare extinde simulatorul celei dinainte (extensie cu nume nou) și citește lecția reală, nu titlul; de aceea lecțiile se scriu în valuri, după dependențe. [surse: C1:14]
- **S64.** Pasul real nu cere ce lecția nu poate arăta: la V/6 e observat + aplicare în caiet, nu „deschide Acest PC” (Explorer e materia M2, captura lipsea). [surse: E_v:129]

### G. Tipurile de lecție

- **S65.** Lecția 1, la toate clasele: după „La ce folosește”, DOI pași cu codul (16.10.2026). P2 = la școală, pe numele tău: prima dată, intrarea din „Cine lucrează acum?”, plecarea („Ieși (deconectare)”, „Nu ești tu? Schimbă elevul”); P3 = acasă / telefon cu același cod, „Mi-am uitat codul”, „Păstrează-l online” — exersați pe `lectii\_sim\intrare-cod.js`, înlocuind introducerea veche. (înlocuiește: P0 + 5 pași la VII/1, 28.09) [surse: D1:44, C2:194, C3:24, B:132]
- **S66.** Pasul cu codul acoperă cele 6 situații cu numele REALE ale butoanelor din `prezenta.js` și greșelile reale: codul schimbat în timpul orei, numele scris altfel sau altă clasă (a doua înscriere), intrarea pe numele colegului. [surse: D1:59]
- **S67.** În laboratorul lecției 1, ieșirea și reintrarea vin după pașii cu lista de la atelier (regula 23), iar ramurile sărite de elevul obișnuit primesc trimiteri scurte, nu pași noi. La VII/1, cine nu-și știe codul: „sari pașii 7 și 8 și spune-i profesorului”. [surse: E_viii:45, E_vii13:69, E_viii:40]
- **S68.** Consolidarea nu predă nimic nou (cel mult un gest nou, justificat în `surse.md`), n-are note și trimite exact la pasul unde s-a predat fiecare lucru, verificat cu `verifica_trimiteri.py`; merge fără profesor. [surse: D1:45, E_vi:159, E_v:218]
- **S69.** Evaluarea sumativă nu predă și nu afirmă nimic nou: pregătește proba (tipul cerințelor, lucrarea bună, autoverificarea C/B/A) cu o probă de ANTRENAMENT marcată ca atare; testul profesorului nu se inventează. Atelierul de antrenament n-are puncte („Din prima ai îndeplinit N din M cerințe” + unde recitești). [surse: D1:46, E_vi:172, C1:18, E_vi:252]
- **S70.** Evaluarea cere doar ce s-a predat, cu aceleași cuvinte și butoane; `surse.md` are tabelul „Sarcina → lecția și pasul”, parcurs de judecător pe paginile publicate. Variantele-soră sunt permise, copiile nu. [surse: D2:34, E_v:346, E_vi:172]
- **S71.** Mini-proiectul nu predă nimic nou: trimite la lecția care a predat fiecare gest, cu aceleași cuvinte (`afirmatii.json` numește afirmația-sursă), încape în 50 de minute și are drum de rezervă. Cerințele și punctajul vin DOAR din documentele profesorului (`Grila_produs.md`, `Proiectul_unitatii_*.md`, `SISTEM_EVALUARE.md`, `REGULA_NOUA.md`). [surse: D2:33, E_vii:291, C1:12]
- **S72.** (deschis) Fără fișa profesorului (VIII/21), lecția notată are temă și cerințe proprii, iar întrebările pentru el stau în `surse.md`, „Pentru profesor”; grila de produs se folosește întocmai. [surse: B:252, C1:20]
- **S73.** Fiecare drum de intrare (pagina completă, „pagina scurtă” de rezervă, nimic) duce la un produs care poate îndeplini toate cerințele. [surse: D2:30, E_viii:337]
- **S74.** Recapitularea activează și aplică: fiecare pas pornește de la o problemă, cu cuvintele profesorului, fără să pomenească aplicația lecției următoare; laboratorul folosește o aplicație deja predată. [surse: D2:35, C2:353, E_vi:270]
- **S75.** Lecția fără aplicație își face laboratorul într-un editor simplu deja cunoscut (Notepad) și se judecă față de lecția următoare, ca să nu-i „fure” materia. [surse: B:171, E_vi:270]
- **S76.** „Verifică-te singur” de la lecția 1 nu înlocuiește evaluarea inițială de pe foaie: fără puncte, variante-soră cu alegere, prima verificare păstrată (regula 23). [surse: E_viii:21]
- **S77.** Fișa pentru începători are două piese: pașii mici cu comanda exactă și „Cum arată rezolvat” pe fiecare sarcină. Materialul „pregătire pentru <examen>” pornește de la harta examenului și are cerințe CA LA EXAMEN, cu barem 1p/parametru. [surse: C3:27, C3:28]
- **S78.** Nu ascunde ce nu ești sigur că poți arăta înapoi: pe situl vechi, un script ascundea exercițiile și niciun elev nu le-a văzut (531/531), fără nicio eroare. [surse: C3:29]

### H. Atelierul, aplicația reală, laboratorul

- **S79.** „Acum la calculatorul din laborator” e aplicarea fără profesor, de pe scaun, fără cabluri și prize, cu „Verifică-te” (≥ 44 px). Spune ce deschizi, drumul RO și EN, ce vezi, cum salvezi; o aplicație alternativă („Google Sheets sau Excel”) se probează și ea, altfel e NESIGUR. [surse: C2:115, E_v:86, E_v:102]
- **S80.** Gesturile reale mici (regula 10) se fac chiar în pagină: după „Încearcă”, caseta „Acum, dacă ești la calculatorul din laborator: …” cere gestul de o secundă, în aceeași fereastră lăsată deschisă. Laboratorul le pune apoi cap la cap, în ordinea în care cresc, iar casetele pot construi produsul lui. [surse: E_v:199, E_vi:183, E_vii:231, E_v:380]
- **S81.** Laboratorul nu reface casetele: verifică, completează ce lipsește („l-ai pus la pași? nu mai pune altul”) și face o singură dată pasul final; cine a sărit casetele are drumul scris. [surse: E_vii:276, E_v:380, E_v:418]
- **S82.** Pe calculatorul comun elevul lucrează doar în `Documente\Ex Nume Prenume` (cu spații, fără `_`, ca să nu ceară Shift la a V-a) și lasă totul cum a găsit (regulile 23 și 25): la final șterge folderul (în Coș) și NU golește Coșul. [surse: E_v:197, D1:116, E_v:219]
- **S83.** Laboratorul fără profesor nu schimbă nimic permanent și nu cere descărcări: lucrează pe ce are orice Windows (`C:\Windows\Media`, `C:\Windows\Web\Screen`), cu ieșire pentru ce lipsește; fără clic dreapta, ștergeri, oprire, parole. Dacă ecranul cere parolă, elevul scrie pașii în cuvinte. [surse: E_v:171, E_v:219, E_v:190]
- **S84.** Fiecare laborator are drum de rezervă scris pas cu pas, chiar în laborator: fără cont, fără fișierul de data trecută, fără internet → atelierul din pagină sau varianta scurtă („Nu ai fișierul? Fă direct programul scurt”), iar cine n-are cont îi spune profesorului. [surse: D2:31, D1:116, E_vii:260, E_vii:276]
- **S85.** Lecțiile cu fișiere se leagă prin numele lăsat pe calculator (`Nume_Prenume_8A_lectia18.html`, `Pisica_<clasa>_<numele>.sb3` …): laboratorul pornește din fișierul de data trecută și salvează CU NUME NOU, iar cine n-are fișierul face varianta scurtă. [surse: C2:364, E_vi:301, E_vi:319, E_vi:337]
- **S86.** Laboratorul are puncte scurte, cu titluri îngroșate, căsuță de bifat și „Vezi:”, spune cât durează și unde sari la final; o singură regulă despre profesor (îl chemi doar la o fereastră necunoscută), iar atelierul nu-l repetă. [surse: E_v:199, E_vi:243]
- **S87.** Laboratorul trimite după un semn pe care elevul îl vede („rândul care începe cu `<img`”; lipsește → pasul 3), iar ordinea punctelor ocolește ce nu se știe sigur (legătura din prima pagină înaintea paginii a doua). [surse: E_viii:337, C2:364]
- **S88.** În browser, laboratorul închide FILA, nu fereastra (X pe fereastră închide și lecția); pasul real deschide doar file noi, fără nimic salvat și fără cont. [surse: E_vi:215, E_v:296]
- **S89.** La o fereastră necunoscută într-un cont, elevul ridică mâna și nu pleacă de la calculator (nu „închide fila”: contul poate fi deschis), iar cât așteaptă face întrebările; adresa se scrie întâi în caiet. [surse: E_vi:215, E_vi:260]
- **S90.** Un exercițiu nu e copia altuia din lecție (întrebările sunt variante-soră, regula 5), iar exercițiile lecției vecine nu se repetă. [surse: D2:27, E_viii:65, E_vi:331]
- **S91.** Lucrul în echipă cere echipa la calculatoare în aceeași oră (la Tupilați, a VII-a e singură: colegii din clasă); dacă lipsește un coleg, elevul lucrează în atelier. [surse: E_vii:363]

## TEXT

### A. Cititorul și limbajul

- **T1.** Cititorul de la a V-a (10-11 ani) știe să citească, să dea clic, să atingă pe telefon, numele școlii și al clasei, dar nu știe ce e un cod pe un site și nici că „Cine lucrează acum?” e lista calculatorului. Apasă primul buton mare (și cel de a VII-a), se grăbește, sare peste „Ești tot …?” și NU citește scrisul mărunt. [surse: C2:198, E_vii13:66, C2:299]
- **T2.** Propoziții scurte, cu diacritice: cel puțin 15 la 1.000 de litere (textul obișnuit are 40-60), măsurat mecanic, cu norma luată din afara documentului. În pagină doar ș/ț cu virgulă; sedila din surse nu se copiază. [surse: C2:116, C3:36, E_viii:17]
- **T3.** O instrucțiune = o acțiune; pașii practici stau separați vizual, nu în proză („Primul… Al doilea…”). [surse: C2:101, C3:37]
- **T4.** Instrucțiunea se execută literal (regula 3; judecătorii nr. 3): „În A2 scrie doar numărul 5, fără cuvinte, și apasă Enter.”, niciodată „A1 = Cantitate: 5” (dă #VALUE!). Arată și forma greșită (Greșit / Bine), cu un exercițiu-soră. [surse: C2:12, C2:79, E_viii:135]
- **T5.** Scrie gestul real, probat, nu pe cel intuitiv: „scrii numărul la Orizontal” făcut literal dă „10050”, deci întâi „apeși Backspace până se golește caseta”. Cifrele din instrucțiune vin din probă (Pensule, Dimensiune 40: 16/16 în `proba_gaura.py`). [surse: D2:52, E_v:397, E_v:419]
- **T6.** Regula se dă verificabil pentru un copil („cel mult patru rânduri scurte”, nu „puține cuvinte”), cu excepțiile spuse (judecătorii nr. 16). Excepția se scrie strâns și se verifică în ambele sensuri („punctul fără spațiu doar ÎN INTERIORUL unui număr, al unei date, al unei ore…”; `proba_reguli.js` → 0), iar excepția de la regula altei lecții se spune o dată, unde apare. [surse: E_vi:78, E_vii:133, E_vii:160, E_v:266]
- **T7.** Termenul nou se explică la prima folosire, în cuvinte de copil, de obicei în paranteză: „modul (bucată de an între vacanțe)”, „progresul (ce ai lucrat)”, „te deblochează (îți primește codul nou)”. Cuvântul unei lecții viitoare apare doar într-o propoziție care anunță („vei învăța”). [surse: E_vi:11, C2:300, E_v:19, E_vii13:58]
- **T8.** Poarta T0 prinde termenii folosiți înainte de definiție („cod”, „modul”, „LearningHub”, „fereastră”, „procesorul”, „Shift”) și oprește publicarea. Repari definind pe loc („o poză adusă așa o numim **imagine importată**”) sau reformulând („tăiată pe margini”); termenul nou intră în `<mark>`, iar un nume deja pomenit se îngroașă. [surse: C1:29, E_viii:19, C2:210, E_v:398]
- **T9.** Procentele se spun și în cuvinte („80%, adică 8 puncte din fiecare 10”). Pronunțiile scrise pentru copii („uai-fai”, „brauzăr”, „i-meil”) sunt aproximări și rămân aceleași în toate lecțiile. [surse: E_vi:11, E_v:265, E_v:97, E_v:283]
- **T10.** Cuvântul cu două sensuri se lămurește („Atenție la cuvânt”): „Aspect” = doar Layout; „filă” = numai fila browserului; „legătură” = link, deci nu „legătura cu site-ul e sigură”; „pot să-l ating?” → „e o piesă, un obiect”. [surse: E_vi:105, E_viii:18, E_v:326, C2:211]
- **T11.** Fără ambiguități de loc sau ordine: „din stânga … din dreapta” e fals pe telefon („întâi un rând din lista X, apoi perechea lui din lista Y”), „fereastra de deasupra” → „fereastra în care lucrezi”. Problema-exemplu se reformulează până are un singur sens. [surse: E_v:27, E_v:170, E_vi:269]
- **T12.** Când programa și aplicația numesc diferit același lucru, lecția o spune o dată: „În Excel graficul se numește diagramă (în engleză, chart)”; „panoramare” = Zoom în Paint; dosarele = etichetele din Gmail. Diferențele care țin de profesor („editor dedicat”) i se semnalează lui. [surse: E_viii:196, E_v:395, E_vi:238, E_viii:241]
- **T13.** Forme corecte: „alineat” (DOOM), „Repară-o”, „nu are încă niciun rând”, „o dată” / „de 2 ori” (`oriText()`), „codul său”; numele scurt e „Ana P.” (prenume + inițiala, ca `scurt()` din `prezenta.js`). [surse: E_vii:111, D2:54, E_vii13:40, B:139]
- **T14.** Mesajele care numesc oameni au genitivul corect („nota Biancăi”, „lui [nume]”, generat din câmpul `dat`) și formulare neutră („hotărăște autorul”, nu „fără să hotărască el”); genitivul se verifică și în etichete. [surse: D2:47, E_v:26, B:259]
- **T15.** Analogia se verifică din perspectiva unui copil român (judecătorii nr. 5) și nu răstoarnă sensul (MAJOR): „Ctrl+Z dă timpul înapoi cu un pas”, nu „e ca o gumă”; panoul din gară, nu „etajele blocului”. „Altfel” spune exact ce spune pasul (judecătorii nr. 7), iar simplificările conștiente se trec în `surse.md`. [surse: D2:38, B:163, E_v:169, E_v:97]
- **T16.** Nicio notație în locul cuvintelor (judecătorii nr. 3): fără „Lucru | Preț”; o scurtătură scrisă lipit („Ctrl+X”) doar dacă tastele s-au predat, altfel în cuvinte („Ctrl + clic”). Rândurile îngroșate („Prima dată pe un calculator:”) sunt titluri, nu butoane. [surse: E_v:232, E_vii:98, E_viii:48]
- **T17.** Locul se spune față de ce se vede („lasă-l chiar sub «mergi la x 0 y: 0»: intră între cele două”), ordinea gesturilor explicit („întâi limba, apoi X”), iar indiciul numără cum numără elevul. [surse: E_vi:289, E_vi:318]

### B. Adevărul textului

- **T18.** Nicio afirmație dedusă scrisă ca fapt: faptul nesigur se scrie prudent chiar în pagină („de obicei”, „dacă apare”), și în „De ce”-uri, iar în `afirmatii.json` e etichetat (probat / doc. Microsoft / dedus / nesigur). Când există un semn concret, îl numești („apare «Continuă de unde ai rămas»”) plus ce faci când nu apare; nicio sarcină obligatorie nu stă pe un fapt presupus fără drum de rezervă. [surse: D2:48, C1:25, D1:79, E_vi:12]
- **T19.** Reparația e „cea mai simplă care e adevărată față de aplicațiile reale”, cu dovada (`proba_*`), iar ce nu s-a putut proba se scrie ca atare. Propunerea judecătorului se reprobă VIU înainte de aplicare și poate fi respinsă cu motiv; corecturile mici dovedite le face dirijorul, fără judecător nou. [surse: E_viii:271, B:284, B:144, B:139]
- **T20.** Constantele din lume vin doar din `calibrare\constante_lume.json`, cu valoare, dată și sursă primară (regula 8): TVA 21% și 11% din 01.08.2025 (Legea 141/2025, Codul fiscal art. 291, reverificat de `lege.py` la 90 de zile). TVA intră abia în lecția cu procente. (deschis: două lecții de liceu, `cls10/m2-calcul-tabelar` 1 și 3, aveau încă 19%) [surse: C2:112, C3:45, C2:145, C2:18]
- **T21.** Faptele de informatică au sursă (manual, programa, documentația Microsoft, standard), iar convențiile școlare (1 KB = 1024 B) au nota „convenția manualului”. În lecție intră doar numerele documentate, iar pragurile se calculează cu formula (contrastul cu WCAG, ca în simulator); în aplicația reală criteriul se dă în cuvinte („până se citește de departe”). [surse: C2:112, E_vi:105, E_vii:259, E_vi:153]
- **T22.** Faptele istorice se verifică pe sursă („curentul electric abia cu calculatoarele electronice” era fals: Hollerith 1890, Z3 1941), iar atelierul nu se câștigă cu o regulă greșită („are ecran”). [surse: B:45, E_v:80]
- **T23.** Legile se recitesc în forma consolidată la data lucrului, iar faptele juridice le verifică judecătorul opus (sonnet nu le-a prins); legătura faptă → articol se verifică (art. 360 CP = doar accesul fără drept). Lecția spune „Legea pedepsește fapta” și nu amenință elevul (sub 14 ani nu răspunde penal). [surse: C1:31, B:202, B:224, E_vii:375]
- **T24.** Afirmațiile de siguranță stau pe surse oficiale citate exact; când sursele se contrazic, contradicția se spune în pagină („dicționarul (DEX) îi dă doar sensul rău”) sau se alege o formulare care le împacă. Fără sursă oficială sigură nu se afirmă vârste și nici „niciun serviciu nu-ți cere niciodată parola”. [surse: E_vi:199, E_vii:377, E_v:266]
- **T25.** Citatele vin din textul brut al paginii: WebFetch NU e sursă (a inventat meniuri Word). Atribuirea din manual se ia de pe imaginea paginii, anexa cu PDF stricat se citește ca imagine, iar un act citat în antet trebuie folosit și în conținut. [surse: C3:46, C3:47, C3:50, C3:49]
- **T26.** Nu atribui ministerului o cerință pe care actul n-o are: „justificând” apare doar la a V-a și a VII-a, deci la VI și VIII lecția spune „probabil ți se cere și acum”. [surse: E_viii:15, E_vi:44, C3:50]
- **T27.** Nu promite ce nu e: nici „de la zero” fals, nici o „protecție” care nu protejează (`=IF(B2=0, 0, …)` fără „/” nu apără de #DIV/0!). Textul unui buton nu minte prin condiție lipsă („← te duce la pagina de dinainte” e fals dacă pagina a doua e deschisă direct). [surse: C3:48, C2:15, C3:43, D2:53]
- **T28.** Fără contradicții în lecție (regula 8): cifrele se potrivesc, o celulă are un singur rol, textul nu contrazice indiciile, iar numerotarea din pași și din atelier e aceeași. Un item de test care contrazice definiția de pe sit se lasă deoparte. [surse: C3:42, C2:14, E_viii:17, E_vii13:41]
- **T29.** Între lecții, aceeași regulă se spune la fel (CC0 diferit la V/15 și VII/15 = GRAV) și cu aceleași cuvinte („contul TĂU”, „nu-ți face cont nou”, „ca la lecția 18”). Vecinii copiază din fișierul de pe disc, nu din memorie, și notează versiunea (commit-ul) pe care s-au aliniat. [surse: C1:30, D2:57, D2:58, E_vii:274]
- **T30.** Când se schimbă o componentă comună (`prezenta.js` cere codul de la 30.09), textele și pozele lecțiilor vechi se revizuiesc. Instrucțiunile acoperă toate cele 3 stări ale panoului „Spune cine ești” (V/1 GRAV: al doilea elev lucra pe numele primului). [surse: B:128, B:36]
- **T31.** Numele de butoane și mesajele citate există LITERĂ CU LITERĂ în `prezenta.js` / `motor.js` de azi, iar pozele sunt capturi ale casetelor adevărate, cu nume inventate (0 diferențe). Mesajul compus în cod se citează scurt („Cod greșit.”), ca proba să-l găsească; același cod-exemplu în text și în poze. [surse: C2:190, E_viii:48, E_vi:13, E_viii:26]
- **T32.** Legenda și `why` spun doar ce se vede în poză, fără să jignească („colegii citesc în loc să asculte”), fără formatări care țin de altă lecție și fără să sugereze o regulă falsă („cerințele fiecărei centuri se știu dinainte”). [surse: E_v:62, E_vii:99, E_vi:153, E_vii13:43]
- **T33.** O regulă pusă de lecție se spune ca regulă a lecției, cu sursa ei, și se schimbă dacă profesorul vrea alta (ex. textul stă pe ecran cât să fie citit de două ori: secunde ≥ cuvinte × 2 : 3). [surse: E_vii:273]

### C. Numele din aplicații (RO + EN)

- **T34.** Orice filă, grup sau comandă are ambele nume: „Pornire (Home)”, „Diapozitiv nou (New Slide)” (regula 6), pentru că Office e în engleză, Windows în română, iar telefonul profesorului în engleză; perechea EN lipsă e MAJOR. Perechea se dă o dată pe pas („Gmail-ul tău e în engleză? Numele sunt cele din paranteze.”). [surse: C3:40, C1:33, C2:223, E_vi:214]
- **T35.** Alegi numele pe care îl poți dovedi („Deconectează-te” vs „Deconectați-vă”), din `calibrare\meniuri_ro_en.json` sau din paginile Microsoft ro-ro; cele nesigure merg în `calibrare/de_confirmat_in_laborator.md`. Fără sursă RO rămâne numele englez + o explicație („Save this file (în română: Salvați acest fișier)”), fără traducere inventată. [surse: D2:49, E_vii13:105, E_vi:90, E_vii:161]
- **T36.** Butonul fără text se numește după desen, cu aceeași formulare peste tot (patru pătrățele = Sortare diapozitive), și după formă și loc; pe telefon nu există „ține mouse-ul pe buton” (regula 20), iar pe calculator „îi apare numele” e doar parțial adevărat. [surse: E_vi:78, E_v:395, E_v:398]
- **T37.** Numele de butoane rămân literă cu literă cele de pe ecran, explicate în cuvinte de copil; numele HTML nu se traduc, dar se spune de unde vin („unordered list”, „list item”). [surse: D1:60, E_viii:293]

### D. Mesajele

- **T38.** Mesajul simulatorului spune numai ce e sigur adevărat; când nu poate fi sigur, spune mai puțin și cum te întorci, iar urmat întocmai duce la „Corect”, fără buclă. Un mesaj care sugerează ceva fals e MAJOR („Ai greșit adresa? Mesajul nu ajunge” e fals dacă adresa există), iar un indiciu care promite un gest trebuie să fie adevărat în simulator. [surse: D2:45, C1:24, C1:27, E_vi:226]
- **T39.** Mesajul spune starea paginii, nu tastele („Paragraful „…” apare de două ori. … șterge una dintre copii”, nu „l-ai copiat (Ctrl+C)”). Numește perechea sau cauza și citează codul elevului („„soare” și „soarece” seamănă prea mult”), iar mesajul aplicației reale („Introduceți un număr valid.”) primește explicația. [surse: D2:46, C1:26, E_v:397]
- **T40.** Mesajul nu dă răspunsul: cel de limită nu numește semnul, indiciul nu numește litera (motorul amestecă variantele), numele testelor (`ce`, vizibile înainte de rulare) nu-l conțin, iar imaginea pasului nu arată răspunsul exercițiului de sub ea. [surse: E_viii:166, C3:38, E_vi:331, B:284]
- **T41.** Răspunsul corect nu se recunoaște după formă: varianta corectă era cea mai lungă în 79,3% din întrebări (așteptat ~25%), redusă la 32,8% lungind distractorii. [surse: C3:39, E_v:62]
- **T42.** Răspunsurile scrise se primesc în toate formele corecte (fără diacritice, calculul scris altfel, fără Enter), dar testul cere ce cere exercițiul (funcția SUM, nu `=B2+B3+…`), iar după „Corect!” foaia rămâne vie. Un `alt` bun are măcar două cuvinte și nu e nume de fișier, umplutură sau „poză”. [surse: E_viii:167, B:185, E_viii:168, C2:362]
- **T43.** Butonul „Copiază” copiază doar ce se lipește, fără comentarii (`span.cmt`). [surse: C3:44]

### E. Exerciții, granițe, neprevăzut

- **T44.** Exemplul din „Uite cum” e altul decât cel din „Încearcă”, ca exercițiul să fie aplicare (regula 5): formula nu e scrisă nicăieri („Pe rândul 3: 4 caiete a câte 7 lei. Calculează în C3.”), un pas de predicție întreabă înainte, iar valorile prea ghicite se schimbă. [surse: E_vii:259, C2:80, E_viii:129]
- **T45.** Granițele se păzesc și în text: cuvântul unei lecții viitoare nu apare nici în variante, nici în mesajele simulatorului comun (la V/1-3 „dispozitiv” → „obiect”, prin `fotografie-obiecte.js`), iar ce urmează se pomenește cel mult o dată („Data viitoare…”). Ce nu e predat nu e cerut, iar exemplele nu declanșează mesaje despre ce n-a fost predat. [surse: E_v:79, E_v:110, E_vii:380, E_viii:270]
- **T46.** Spune ce faci când ecranul nu arată ce promite pasul („Dacă ecranul e negru, mișcă puțin mouse-ul”; dacă nu vezi butonul; dacă o fereastră nu apare; pe Windows 10, marcat neprobat). În laboratoarele neobișnuite, ieșirea e ceva de notat, nu un gest („scrie «scaun fără spătar»”; elevul nu pune nimic sub masă). [surse: E_v:60, E_vii:230, E_viii:270, E_v:170]

### F. „Pe telefon”

- **T47.** Pe telefon nu există Ctrl, Shift, Enter, Tab (judecătorii nr. 15): mesajele nu trimit la ele, sfatul se scrie „Pe telefon: …” acolo unde e adevărat, iar în mesaje „↶ (Ctrl+Z)”. În loc de Tab, spații; „(pe telefon, atinge-o de două ori, repede)”. [surse: C1:28, E_v:419, E_viii:270, E_vii13:81]
- **T48.** Fiecare casetă „Acum în browserul tău adevărat” are „Pe telefon: sari peste; pașii tăi sunt la laborator.” și blocul pliat „Lucrezi pe telefonul tău?”; gesturile doar de calculator (Ctrl+Shift+N, „dublu clic”, „cerculețul din dreapta sus”) se spun doar pentru calculator. [surse: D2:59, C1:34]
- **T49.** Sfatul de telefon se scrie doar probat pe telefonul real (cel neprobat pe Android nu s-a pus), iar locul simbolurilor se spune general, fiindcă Gboard și iPhone diferă („alege steluța * și bara / dintre simboluri”). Sfatul dovedit greșit se corectează după probă. [surse: C1:34, E_viii:136, C1:28]
- **T50.** Pe telefon ținta se arată cu repere din imagine, nu „la un deget sub margine” (degetul e mai lat decât fâșia bună, ~37 px); pe material, „+” în loc de tragere și „Mărește” înainte de bucățile mici. [surse: E_v:397, E_vii:245, E_vii:260, E_v:295]

### G. Trimiterile

- **T51.** Între pași trimiți pe numele pasului, în `<i>`, plus numărul ca pe ecran: „de la pasul «Programul lung devine scurt» (pasul 3 din 6)”, la fel în laborator și pe diplomă. Niciodată un număr care se poate confunda și niciodată „(P3 în bara de jos)”. (înlocuiește: în laborator numele fără număr, 19.10) [surse: D2:28, B:283, E_vi:318, E_vii13:41]
- **T52.** La renumerotare actualizezi „N pași”, trimiterile, comentariile, `surse.md`, `afirmatii.json`, `capturi_lipsa.json`, `profil.json`; secțiunile vechi din `surse.md` rămân istoric, cu numerele de atunci. [surse: E_v:29, E_vii:292, E_vi:159, E_viii:40]
- **T53.** `?vezi=pK` deschide un pas al altei lecții doar de citit, fără să schimbe progresul, și se verifică mecanic (`verifica_trimiteri.py`, `proba_vezi.py`) la fiecare renumerotare. Lecția în reparație nu primește legătură, iar ce trebuie predat (o fereastră nouă) se predă în lecția însăși, nu prin pliabilul alteia. [surse: C1:16, E_v:244, E_vi:172, E_v:346]
- **T54.** O trimitere nu duce la ceva încă inaccesibil: scrii ce face elevul ACUM, iar un titlu din fereastra mică nu trimite la ce nu e în ea; trimiterile din laborator se verifică mecanic în probă. [surse: D2:29, D2:60, E_vii:309]
- **T55.** „Recitește” are `target="_blank"`, pasul cu filă nouă spune să te întorci la fila lecției, iar laboratorul spune „Apasă butonul «Atelier» din bara de sus a lecției”. [surse: E_viii:18]
- **T56.** Ce faci după o greșeală se scrie ca drum de întoarcere literal, cu butoanele exacte („… apasă „Continuă de unde ai rămas”. Nu apare? „Lecția 1”, apoi „Pasul următor”…”). [surse: E_vi:14]

### H. Tastele și ferestrele

- **T57.** Caseta cu o scurtătură spune ÎNTÂI fereastra („Clic în Notepad…”, apoi Ctrl+S), altfel scurtătura lucrează pe pagina lecției (Ctrl+S salvează pagina web, Delete a golit pânza): MAJOR. [surse: D2:40, E_vi:269]
- **T58.** Tastele unui simbol cerut se spun în același pas (regula 1), iar o tastă nouă se explică pe loc („Ctrl jos în stânga, Shift deasupra lui”; liniuța de jos = Shift + tasta cu minus). Condiția cu text se spune în pas („C2="da" întreabă dacă în C2 scrie da”). [surse: E_viii:166, E_v:265, E_vi:90]
- **T59.** Tastatura (judecătorii nr. 15): pe Română (Standard) „ț” e lângă Enter și apostroful cere AltGr; pe US-International ghilimeaua e tastă moartă, deci HTML-ul folosește ghilimele drepte, iar fără `<meta charset>` diacriticele ies stricate. Textele de tastat evită diacriticele și AltGr, iar când le cer dau ieșirea („Dacă nu-ți ies, scrie fără ele”). [surse: E_vii13:81, C1:35, E_viii:293, C1:36]
- **T60.** Numele de fișiere și foldere sunt fără diacritice (`forme`, `calde`, „Solutia 1”). [surse: E_v:382, E_v:419, E_v:219]
- **T61.** Excel pe setări românești (judecătorii nr. 11): setările regionale se explică, iar proba lor vine prima în Excel-ul real; zecimalele (8,5; 7,5) sunt probate pe setări RO, iar referințele zecimale se scriu `3,5`. Separatorul se spune o dată: „Pe unele calculatoare scrii ; între argumente, pe altele , — îți dăm mereu ambele forme.” (regula 6) [surse: E_viii:129, E_viii:135, E_viii:167, C2:79]
- **T62.** Un gest deja predat se cere în forma lecției care l-a predat, nu a unui joc vechi: Paint = „pai” + clic (ca la lecția 8); filă nouă cu +, adresa + Enter (ca la VIII/1); deconectarea cu cuvintele lecției 18 („Profil (cerculețul din dreapta sus) → Deconectează-te (Sign out)”). [surse: E_v:364, E_v:296, C2:359]

### I. Exemple, nume, profesorul

- **T63.** Numele de fișier se copiază de la lecțiile anterioare și nu fixează clasa (`Pisica_<clasa ta>_<numele tău>.sb3`; „în locul lui 8A scrii clasa ta”); în laborator nu stă niciun nume de copiat, iar testul numelui primește mai multe prenume. La fiecare salvare: „dacă există deja: Anulare (Cancel) și o cifră” (regula 26). [surse: D2:55, E_vii13:115, C3:41, E_vii:220]
- **T64.** Numele elevului din fișier se păstrează, pentru profesor: pagina de laborator NU se publică, iar redenumirea nu se predă. [surse: D2:56, C2:345]
- **T65.** Exemplele sunt inventate și pagina o spune (`…-exemplu.ro`, `@exemplu.test`, 0700 000 000, „Orarul unei clase inventate”); un nume inventat care coincide cu un elev real din catalog nu se scrie, iar aplicațiile de mesagerie, streaming sau jocuri nu se numesc. [surse: E_v:266, E_viii:322, C1:32, E_v:26]
- **T66.** Capcanele nu se refolosesc cuvânt cu cuvânt dintr-o lecție anterioară, iar ferestrele false desenate în HTML spun că sunt „desenate de noi”. [surse: E_v:327]
- **T67.** Codul din exemplu se spune o dată „e codul din exercițiu; al tău îl alegi tu”, iar în exerciții „inventat acum (nu codul tău adevărat)”; codul-exemplu tastat de 4-5 ori se reduce la o dată. [surse: E_vi:13, C2:292, E_vii13:59, E_viii:47]
- **T68.** „Spune-i profesorului” (nu „la ora următoare”: poate fi în sală). Ce lasă activitatea la alegerea lui se scrie „Dacă profesorul nu vă spune altfel, …”, cu întrebarea în „Pentru profesor”; pagina nu inventează nici nota, nici regula de predare („Cum îi dai filmul profesorului îți spune el.”). [surse: E_viii:46, D2:51, E_vii:307, C1:32]
- **T69.** Evaluarea din pagină e „probă de antrenament” (C 40 / B 30 / A 20 + 10), iar nota adevărată o dă profesorul („Lecția 16 e lucrarea” se scoate). Nota de modul se spune doar cu fraza din lecția 1: „nota din catalog = (80% din punctajul lucrării + punctele de pe LearningHub) : 10, rotunjită ca nota lucrării”. [surse: D2:50, E_vii:180, C1:18, E_vii:307]
- **T70.** Notația aleasă de lecție (`%` pentru rest, „pentru … sfârșit pentru”) se explică înainte de folosire și se declară în „Pentru profesor”; o notație respinsă („mod”) e respinsă peste tot. [surse: B:185, B:261]

### J. Identitatea: „Cine ești”, codul, contul

- **T71.** Glosar pentru 11-14 ani, fără termeni tehnici: „deconectare = ieși de pe numele tău”, „te deblochează = profesorul îți primește codul nou”, „online = păstrat pe internet, nu doar pe calculatorul ăsta”, „eticheta = bara din colțul de jos, cu numele tău”, explicate înainte de folosire. [surse: C2:182, C2:300, E_vii13:58]
- **T72.** Codul e secretul elevului („cine îți știe numele și codul poate lucra pe numele tău”), dar lecția nu promite ce sistemul nu garantează: cifrele se văd cât le scrii („să nu stea nimeni lângă tine”). „Scrie-l acum, pe ultima pagină a caietului de TIC: îți trebuie și acasă.” [surse: C2:192, E_viii:47]
- **T73.** Lecția prevede drumul celui care nu poate intra („trimite cererea, spune-i profesorului acum”), iar elevul deja conectat care nu-și știe codul nu e pus să iasă („Dacă nu-l știi, nu ieși”). Esențialul stă în textul pasului, nu în paranteze, iar formulele care sună a amenințare se schimbă („a doua înscriere, goală”). (deschis: P2/P3 la plafonul de 110 → pas nou sau plafon mai mare, decizia lui Vasile) [surse: C2:294, C2:299, E_vii13:59]
- **T74.** Mesajele sistemului se citează cum sunt pe ecran: „Ai ieșit, [nume]. Data viitoare îți cer codul.”, „Cod greșit. Mai încearcă.” (după 5 greșeli, 30 s de așteptare), „Cererea a ajuns la profesor…”, „Nu pot verifica acum codul: nu merge internetul…”. (deschis, MINOR: codul bun cu progres neurcat primește „Cod greșit”) [surse: C2:272, C2:420, E_viii:47]
- **T75.** Nu promite locul sau textul etichetei: se mută (`fereste()`) și, strânsă, arată doar numele scurt; laboratorul cere numele de pe ea, nu „Profesorul vede activitatea ta”. [surse: E_viii:46, E_vii13:69]
- **T76.** Mesajele despre „cine ești” depind de întrebare (`data-tip`): cât timp sus e o întrebare fără răspuns, laboratorul nu spune „nu e păstrată… fă verificarea”. [surse: E_viii:26]
- **T77.** Contul se spune la fel în toate lecțiile („contul TĂU”, „Nu-ți face cont”), iar lecția nu presupune lecțiile altei clase. Parola uitată: „Nu-ți faci alt cont. Îi spui profesorului…”; la întrebarea browserului despre parolă refuzi (✕, „Nu acum”); contul altcuiva: „Închide cu ✕, spune-i profesorului și lucrează în pagină.” [surse: E_vii:326, E_vi:214, E_vii:297, C2:359]

### K. Rapoartele

- **T78.** Raportul către Vasile are cuvinte simple și trei liste: FĂCUT (cu dovadă văzută), NEFĂCUT (cu ce-l deblochează), NESIGUR, fără „tur de onoare”; ce e doar pentru profesor stă în `surse.md`, „Pentru profesor”, nu în lecție. [surse: C1:37, E_vi:214, D2:51]

## Contradicții

- **K1. Câți pași.** „Un pas = o idee” bate „3-5”: lecții M1-M2 publicate cu P0 + 6…8 (E_v:190, E_v:199, E_vi:77, E_vi:138, E_vii:98), „max 7” (C2:100), 8-9 „peste plafon, motivat” (C1:7). Față de „fără să depășești P0 + 5” (D2:25, D2:16, B:161, 19-24.10). Data dă câștig lui P0 + 5 la lecțiile noi; pentru cele publicate cu mai mulți pași nu s-a hotărât nimic.
- **K2. Ritmul pentru durată.** 80 / 100 / 110 / 110-120 / 120 cuv./min și 45 de semne/min, iar „ritmul judecătorului diferă de al autorului” (B:247, D2:18, E_v:330, E_vii13:21); aceeași lecție: 49,5 min pe metoda j2, 52,6 pe J3 (B:267). Deschis până la cronometrarea la clasă.
- **K3. Pragurile supapei.** „sub 20 min, întrebările vin întâi” (B:189), „Când mai sunt 10 minute” (D2:21, D2:23), „cel puțin 35 de minute” pentru atelierul opțional (C1:11): decizii diferite, fără prag comun ales.
- **K4. „De obicei”.** E_vi:12 (16.10): „nu «de obicei», ci semnul concret”; D2:48 (24.10), E_vii:230, E_v:419: faptul nesigur se scrie „de obicei”. Citirea din T18: semn concret când există, „de obicei” când faptul e doar presupus.
- **K5. Întrebările înaintea laboratorului?** D2:24: „dacă motorul o permite, ca la lecțiile publicate”; standardul, E_v:102, E_vi:15: Aplicația vine înaintea întrebărilor. Lămurit de B:162 („ordinea întrebări/laborator fixă în motor”): textul spune când sari la întrebări (S46).
- **K6. Sedila din programă.** E_vii13:93, E_vii:308 copiază `continuturi` „literal, inclusiv ţ cu sedila din programă” (E_vi:252: „întocmai”, cu spațiul lipsă). E_viii:17: „Nu copia ortografia greșită din surse (ţ cu sedilă); în pagină doar ș/ț cu virgulă” (și regula 6). Nehotărât, dacă `continuturi` se vede în antet.
- **K7. Diacritice în ce tastează elevul.** E_vii13:81 (28.09): textele de tastat „nu au diacritice, apostrof sau AltGr”; E_viii:293 (19.10) le cere, cu ieșirea „Dacă nu-ți ies, scrie fără ele”. T59 le împacă, dar regula nu e hotărâtă.
- **K8. Formula parolei.** „N-o spui nimănui, nici prietenilor buni. O pot ști doar părinții tăi.” (E_vi:199) vs „o știi doar tu și părinții tăi” (E_v:328, D2:57). D2:57 cere o singură formulare, fără să spună care.
- **K9. Clasa în numele fișierului.** VIII/4-6 fără clasă, VIII/3 și VIII/7 cu clasa (E_viii:104, deschis, la dirijor); regula cea mai nouă (D2:55, 24.10) pune clasa ca loc de completat.
- **K10. „Uite cum”: 80 sau 85.** ~80 (standardul; E_viii:22) vs 85 (oracolul lecțiilor 1: E_vi:10, D1:43, C2:194). Diferență mică.
- **K11. Vocativul.** VI/15 predă „Bună ziua, doamnă dirigintă,”, VI/14 scrie încă „doamna dirigintă” (E_vi:242: „de dus la VI/14”).
- **K12. Lecțiile 1 și ora.** ~2.500-3.250 de cuvinte, V/1 ≈ 70 min, publicate așa (C3:31, E_v:31), față de „≤ 50 de minute” (D2:17, C1:8). Deschis (I4).
- **K13. Ținta de minute.** V/16: „rămâne ~2-3 minute peste 45” (E_v:330), adică ținta 45; în rest ținta e 50 (D2:17, C1:8, B:247).
- **K14. Formula notei.** „nota = punctaj : 10” (C2:163, contractele M2-M3) vs „(80% din punctajul lucrării + punctele de pe LearningHub) : 10” (E_vii:180). Poate fi aceeași regulă scrisă scurt; de lămurit în fișa EVALUARE / DECIZIE_VASILE.
- **K15. Modulele.** „M1 = lecțiile 1-9(?)”, „M2 = 10-15” (C2:163) vs M1 = 1-7, M2 = 8-15 (standard, E_v:30). Lămurit de dosarele de pe disc (S3).

## Depășite

- C3:20 — „pașii se pot deschide ORICÂND, în orice ordine” → bara per elev (08.10, făcută 10.10.2026) (S26).
- C3:14 — „«altfel» DOAR la pașii grei” → „Explică-mi altfel” la fiecare pas de conținut (E_v:28, 28.09) (S19).
- C3:32 — descrierea sitului vechi (foldere paralele, 57 de lecții la clasa greșită) → `/lectii/`; lecția de proces rămâne în S15.
- C2:227 — materialul recomandat pe clasă la lecția 4 (faza 0, jocurile vechi) — istoric.
- E_vii13:22 — VII/1 cu „pasul 0 + 5 pași” → doi pași cu codul (16.10) și pasul notei (07.10) (S65).
- E_vii:179 — stilurile de titlu „nepredate în VII/2-9” → adăugate în VII/8, pasul 4 (12.10); regula rămâne (S55).
- D2:20, E_viii:286 — „Dacă se apropie sfârșitul orei” → „Când mai sunt 10 minute din oră” (D2:21, 24.10) (S46).
- E_vii:292 — în laborator „pasul «Scenariul» al lecției”, fără număr → numele + „(pasul N din M)” (D2:28, B:283) (T51).
- E_v:346 — „`lectii\v\m2-l12` încă are p6/p7 — de reparat” → reparat la V/12 (C1:16) (T53).
- C2:163 — „M1 = lecțiile 1-9(?)” → M1 = 1-7, M2 = 8-15 (S3).
- C3:18, C3:29 — cifrele privesc situl vechi, reparat 12.09.2026; principiile rămân (S37, S78).
- B:11 — ordinea de lucru la M1 „nr. 4 → nr. 5 → 1-3 → 6-7” (27.09) — istoric; restul punctului e în S1.

## Numărătoare

| | STRUCTURA | TEXT |
|---|---|---|
| Puncte citite | 232 (B 13, C1 14, C2 24, C3 21, D1 10, D2 26, E_v 32, E_vi 30, E_vii 25, E_vii13 11, E_viii 26) | 194 (B 16, C1 14, C2 27, C3 15, D1 2, D2 16, E_v 26, E_vi 20, E_vii 27, E_vii13 9, E_viii 22) |
| Dubluri exacte între ele | 8: E_vii:10-11 = E_vi:9-10 (notele VI/1 copiate în `E_vii.md`, „## m1-l01”); E_vi:50-52 și E_vii:51-53 = E_viii:65-67 (lecția VIII/2, scrisă cu prescurtarea „@L02”) | 6: E_vii:12-16, E_vii:45 = E_vi:11-15, E_vi:44 (notele VI/1 copiate în `E_vii.md`) |
| Reguli unificate scrise | 91 (S1-S91) | 78 (T1-T78) |

Contradicții: 15 (K1-K15). Depășite: 12. Etichete greșite de tipar pentru STRUCTURA / TEXT: niciuna (singurul `[EXT]`, în `E_v.md` linia 402, e un argument de cod dintr-un punct SIMULATOR). Proba de acoperire (script pe toate trimiterile din fișă): toate cele 426 de puncte sunt citate cel puțin o dată, iar nicio trimitere nu arată spre o linie care nu e punct STRUCTURA / TEXT.

## Anexa: surse în plus (peste cele 4 din regulă)

- **S7:** E_vi:77, E_vii13:93, E_vii:320, E_vii:340, E_vii:357, E_vii:374, E_vii:104, E_vi:252
- **S12:** E_vi:311, E_vi:328, E_vii:216, E_viii:291, E_viii:299, E_vi:211
- **S13:** B:173, E_vi:51, E_vii:52, E_vi:104
- **S30:** B:183, E_vi:138, E_v:362, E_v:380, E_vii13:77, E_vii13:114
- **S31:** E_vii13:47, E_v:63, E_vi:138, E_viii:286, E_v:264, E_vi:186, E_v:190, E_v:199
- **S33:** E_vi:159, D1:43, E_vii13:21, E_vii13:47, C2:194, E_viii:329, E_viii:195, E_vii:11
- **S36:** E_viii:22, E_vii:10
- **S39:** B:247, E_v:362, E_v:243, E_v:231, E_v:418
- **S40:** E_vi:159
- **S42:** E_v:31, E_viii:271, E_viii:286, E_vii13:69, B:162
- **S43:** E_viii:329
- **S45:** B:247, E_vii13:66
- **S47:** E_v:418, E_v:199
- **S51:** E_vii13:69, E_vii:16
- **S57:** E_vi:52, E_vii:53
- **S59:** B:55, E_v:263, E_v:312, E_v:363, E_v:417, E_v:283, E_vi:186, E_vi:211, E_vi:295, E_vi:311, E_vi:328, E_vii13:77, E_vii13:79, E_vii13:100, E_vii:104, E_vii:195, E_vii:216, E_vii:284, E_vii:374, E_viii:197, E_viii:241, E_vi:50, E_vii:51
- **S60:** E_vii:276
- **S65:** D1:43, C2:199, E_vii13:47, E_viii:40, E_vii13:22
- **S69:** C1:12, E_v:346
- **S80:** E_vi:284, E_v:395, E_vii:147, E_vi:215
- **S82:** E_v:312
- **S84:** E_vii:309
- **S85:** E_viii:317, E_vii:284
- **S86:** E_vii:388, E_viii:329
- **T6:** E_v:328
- **T7:** E_vii:12, C1:29, D2:41, E_v:265
- **T8:** E_v:169, E_v:382, E_vi:284, E_v:419
- **T15:** C2:211, E_vii:125, E_v:382, E_vii:245
- **T18:** E_v:85, B:261, E_vii:230, E_v:419, E_viii:271, E_vii:13
- **T21:** E_vii:275
- **T26:** E_vii:45
- **T29:** E_v:328, E_vi:242, B:224, E_vii:326, E_vi:214, E_vi:226, C2:359
- **T40:** E_viii:240
- **T46:** E_vii:125, E_vii:99, E_viii:258
- **T51:** B:159, E_vi:148, E_viii:44, E_v:311, E_vii:292
- **T56:** E_vii:15
- **T63:** E_viii:104, E_vi:90, E_vii:245, E_viii:317
- **T65:** C2:345, E_viii:293, E_vii:220
- **T67:** E_vii:14
