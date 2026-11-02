# Lecția 29, clasa a V-a — surse, probe și ce n-am putut verifica (02.11.2026, valul de seară M4, cu V/28)

**Nu e publicată, nu e în depozit (fără commit).** Autor: V/29 (opus), pornit 19:53, deodată cu V/28. Granița: `_campaign\revizuire_completa_2026_09\m4_seara_02_11\granite\v_l29.md`.

## Programa și planul
- **Plan** (`lectii\plan.json`): nr. 29, M4, „Structura alternativă (decizia). Urmăresc algoritmul pas cu pas”, **predare + consolidare**, 23.04.2027, `lectii/v/m4-l29/`, cheia `lectie_v_m4_l29`. Unitatea V-U5 „Algoritmi. Gândesc pas cu pas” (CS.2.1-2.3; `unitati.json`), lecția a șasea din cele 7.
- **CS.2.3** (`Proiectul_unitatii_V-U5.md`): „Descrierea în limbaj natural a unor algoritmi cu ajutorul secvențelor de operații și a deciziilor”; descriptorii: Consolidat — „urmărind pas cu pas secvențe de operații și decizii cu condiții de bază (cu operatori relaționali)”; Avansat — „decizii cu condiții diverse … în contexte noi”. Lecția: condiții cu `≥`, `<`, `≤` (de bază) și, la întrebări și „Încă un exercițiu”, raționament invers (din traseu → ce știi despre date: Avansat).
- **Activitatea profesorului** (`Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, citată întocmai): „Tabel de urmărire completat împreună pentru un algoritm cu decizie, apoi individual pentru alte două seturi de date de intrare. Se compară traseele obținute.” Resursa: „fișă cu tabel de urmărire, exemple cu date diferite”. În lecție: **împreună** = P3 („Uite cum”: biletul la muzeu, 11 ani / 20 lei, cu explicația fiecărui rând); **individual, alte două seturi** = atelierul (același algoritm; 14/15 → ramura „altfel”, 8/10 → ramura „atunci”); **se compară traseele** = P4 (ce e traseul, cum compari) + „Compară traseele” din atelier (test separat) + laboratorul (punctul 4).
- **Conținutul declarat** (`continuturi`): textul EXACT din `curriculum.json` — vezi „Contradicții găsite”, punctul 1.

## Notația — de unde și ce variante există (manualele de clasa a V-a; textul brut în `lectii\v\m4-l25\_proba\manual\*.txt`, strâns de V/25; căutarea mea: `_proba\manual_decizie.py` → `manual_decizie_out.txt`, citatele în `_proba\manual_citate.txt`)
| | Forma | „Sfârșit dacă” | Ramura fără „altfel” | Lecția |
|---|---|---|---|---|
| Art Klett | „Dacă <condiție C> Atunci <secvență A> Altfel <secvență B>” (r. 4819); semaforul (r. 3369) | nu | „caz particular”, „lipsește ramura Altfel” | |
| Corint | „dacă (…) atunci … altfel … sfârșit dacă”, liniile numerotate (r. 3152-3156) | da | da (primul exemplu) | |
| CD Press | „Dacă…, atunci…, altfel…” (r. 3204) | — | „Dacă…, atunci” | |
| Intuitext | „Dacă condiție atunci Instrucțiuni1 Altfel Instrucțiuni2 Sfârșit dacă” (r. 4147-4154); „scriu „Promovat”” | da | „altfel nu se execută” (r. 4210) | |
| Sigma | „DACĂ condiție ATUNCI … ALTFEL …”, „ramuri diferite” (r. 3977-3994) | nu | „caz particular” | |
| Litera | „Structura decizională, numită și alternativă” (r. 3518), Scratch | — | — | |
| **Testul inițial al profesorului** (`teste_initiale.json`) | „Dacă a > b atunci afișez a, altfel afișez b.” | — | — | |
| **Lecția** | `Dacă condiție atunci` / ramura mai la dreapta / `altfel` / ramura mai la dreapta; pași numerotați „Pasul N.” | **nu** (sfârșitul = primul pas de pe marginea stângă, ca VI/17 și jocul `algoritmi-v`) | **nu apare** | | **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**
- **Pașii** (citire / calcul pus în cutie / afișare): forma din granița V/28, întocmai („Citește «x».”, „Calculează … și pune rezultatul în cutia «x».”, „Pune 5 în cutia «x».”, „Afișează «x».”). Nou aici: „Afișează „text”.” (Intuitext „scriu „Promovat””, jocul `algoritmi-v` „afișează „Promovat””), spus la P2.
- **Cutiile**: cuvintele lecțiilor 26-28 («vârsta», «bani»), fără litere (a, b) și fără „←”.

## Contradicții găsite (pentru profesor / pentru componenta comună)
1. **`curriculum.json` lipește două conținuturi**: „Structura alternativă (decizională)Medii grafice interactive - elemente de interfață specifice mediului grafic interactiv” (fără spațiu, al doilea e de la V-U6). Poarta `test_joc.py` cere textul exact, deci `continuturi` are șirul lipit (ca jocul `jocuri\algoritmi-v`); lecția acoperă DOAR „Structura alternativă (decizională)”. De reparat în `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` (nu e al meu).
2. **„Sfârșit dacă”**: Corint și Intuitext îl scriu, Art Klett și Sigma nu. Lecția nu-l scrie (ca VI/17 și jocul clasei); dacă profesorul preferă forma cu „Sfârșit dacă”, se adaugă un rând în `algoritmHtml` (fără număr). **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**
3. **Ramura fără „altfel”**: toate manualele o au (caz particular). Lecția n-o predă (decizia autorului, din plafonul de 50 de minute); niciun exercițiu nu o folosește. **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**

## Granița (scrisă 19:57, completată 20:20 — `m4_seara_02_11\granite\v_l29.md`)
- **Predau:** decizia (condiția, cele două ramuri), tabelul de urmărire cu coloana Condiția pe date diferite, traseul și compararea traseelor; consolidare: secvența + decizia în același algoritm (P5).
- **NU predau:** repetiția, Scratch (31), evaluarea sumativă (30); nu redefinesc structura secvențială (P5 doar o numește, cu trimitere la lecția 28). Vocabularul repetiției nu apare (`_proba\vocabular.py` → 0).
- **Presupun de la V/28** (NEPUBLICATĂ la scriere; doar ce scrie granița ei): numele „structura secvențială (liniară)”, pașii Citește / Calculează … și pune rezultatul în cutia / Pune … în cutia / Afișează, tabelul de urmărire (Pasul | cutiile | Se afișează; „–” = goală; un rând pe pas făcut; valorile DUPĂ pas). **Diferență:** în simulatorul meu valorile neschimbate se completează singure (gri), la V/28 elevul le scrie pe toate — scris în graniță pentru dirijor.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Conținut | Unde se predă | Unde se exersează | Întrebarea |
|---|---|---|---|
| decizia, structura alternativă (decizională) | P1 | — (fără acțiuni) | Î1 (indirect) |
| condiția, ramurile „atunci” / „altfel”, o singură ramură | P2 | P2 Încearcă (40), Încă (50) | Î1, Î2 |
| tabelul de urmărire cu Condiția | P3 (împreună: biletul 11/20) | P3 Încearcă (nivel 40), Încă (50); atelierul | Î4 |
| traseul, compararea traseelor | P4 | P4 Încearcă (80), Încă (1, 2, 4, 5 → < 50); atelierul („Compară traseele”); laboratorul 4 | Î3, Î5 |
| secvență + decizie (consolidare) | P5 | P5 Încearcă (15/3), Încă (10/3); atelierul | Î3, Î4 |

## Ce presupune lecția că știe elevul (cu bife; `profil.json`)
- [x] algoritm, pas, executant (V/24, publicată) · [x] date de intrare / ieșire, cutia cu etichetă, „–” = goală (V/26) · [x] comparațiile `= ≠ < > ≤ ≥`, adevărat / fals, valorile de ACUM din cutii (V/27, P4) · [ ] **structura secvențială, Citește / Calculează / Afișează, tabelul de urmărire (V/28 — NEPUBLICATĂ: de reverificat după publicare)** · [x] Explorer, dosarul galben, Acest PC, Disc local (C:), GB (V/9, V/6) · [x] scăderea, înmulțirea, compararea numerelor (matematică, PRESUPUS).
- Ce presupun despre mine lecțiile următoare publicate: niciuna nu e publicată (V/30, evaluarea sumativă: „scrierea unui algoritm cu secvență și decizie, urmărirea lui pas cu pas pentru date date” — activitati_lectii_V_VI.json; lecția le pregătește pe amândouă).

## Decizii (luate fără profesor; motivul)
1. **Forma deciziei fără „Sfârșit dacă” și fără ramura vidă** — cum spune tabelul „Notația”; mai puține cuvinte noi, ca VI/17 (clasa le regăsește la a VI-a).
2. **Fiecare rând numerotat e un pas; „altfel” fără număr** — traseul se citește din coloana Pasul (1, 2, 4, 5), iar compararea traseelor devine concretă („diferă la rândul 3”).
3. **Valorile neschimbate se completează singure** în simulator (vezi Granița); pagina o spune la P3.
4. **Atelierul = același algoritm ca „împreună”** (activitatea profesorului spune „alte două seturi de date”), iar cele două seturi afișează același rest (5) pe drumuri diferite: compararea traseelor nu se poate face uitându-te doar la rezultat.
5. **Laboratorul = Explorer, doar citire** (S83: nimic schimbat pe calculatorul comun): datele de intrare sunt adevărate (GB liberi pe C:), executantul e elevul („Afișează” = scrie în caiet). Al doilea set e „gândit”, fără al doilea tabel (durata).
6. **Pragul 100 GB**: pe calculatorul de lucru, C: are 108 GB liberi (Shell.Application); în laborator poate ieși oricare ramură — de aceea punctul 4 îi dă elevului numărul care merge pe CEALALTĂ ramură (40 sau 150).

## Faptele, pe scurt (detaliul în `afirmatii.json`: 19 afirmații — 10 PROBAT, 6 DOCUMENTAT, 1 DEDUS, 1 PRESUPUS (V/28), 1 NESIGUR)
- Explorer NU s-a deschis pe ecran. „Acest PC”, „Disc local (C:)”, coloana „Spațiu liber” citite prin Shell.Application fără fereastră; „%1 liber din %2” citit din `C:\Windows\System32\ro-RO\propsys.dll.mui` (ca fișier); captura reală e cea din lecția 9 (`_proba\sonda_liber_din.py` → `sonda_liber_din.json`).
- Toate traseele, valorile și afișările din pagină: oracolul independent din `_proba\sim_logica.js` (tabele scrise de mână) + echivalențe pe toate valorile (P4, Î5).

## Simulatorul: extensia `lectii\_sim\urmarire-decizie.js` (NOUĂ, proprietar: lecția aceasta; numele liber la 19:56 în `lectii\_sim\` și în granița V/28, care folosește `secventa-liniara.js`)
- Global `window.UrmarireDecizie`, `1.0 (02.11.2026)`; încarcă nemodificate (înainte, în pagină) `cutii-variabile.js` și `evaluare-expresii.js`; 0 stocare, 0 cereri; `#ud-css`, clasele `ud-`.
- Tipul `tabel-urmarire`: `{alg, seturi:[{intrari}], compara?:{q, o, ok}, teste?, gresit?:{s, cum:'ambele'|'opus'}, ajutor, why}`; testele implicite pe set: `valori`, `conditie`, `traseu`, `afis` (+ `compara`). Elevul atinge numărul pasului (orice număr, ca pe hârtie), apoi răspunde (valoarea pusă în cutie / adevărat-fals / ce se afișează); „Înapoi un rând”, „Ia-o de la capăt”; filele „Setul 1/2”. Mesajul principal = primul rând greșit, de ce, și de câte ori „Înapoi un rând”.
- Funcții: `numeroteaza`, `textPas`, `ruleaza(A, intrari)`, `algoritmHtml(A, {titlu})`, `tabelHtml(A, intrari, {titlu, explica, traseu:false})`, `traseuText`; eveniment `urmarire-decizie`.
- **Nu se schimbă:** numele tipului și ale testelor, forma lui `A` / `P`, coloanele, prefixul `ud-`, „nimic nu se salvează, nimic nu pleacă”.

## Pentru lecția următoare (V/30, evaluarea sumativă: „algoritmi în limbaj natural”) și pentru oricine încarcă `urmarire-decizie.js`
- **Ce rămâne la elev:** decizia „Dacă … atunci … altfel …” cu ramurile mai la dreapta; condiția cu valorile de acum; tabelul de urmărire cu coloana Condiția; traseul și compararea traseelor. Pe calculatorul din laborator: nimic (doar a citit în Acest PC). În caiet: tabelul cu «liber» (dacă a ajuns la laborator).
- **API:** proba de antrenament a V/30 poate folosi `tabel-urmarire` cu propriul algoritm (`{alg, seturi}`) și `tabelHtml` pentru „cum arată o lucrare bună”; nu are ramura vidă, nici „Sfârșit dacă”, nici decizii una în alta — o lecție care le vrea scrie `urmarire-decizie-<ceva>.js`.
- **Versiunea 1.1 (02.11.2026):** la „Compară traseele” variantele se amestecă la fiecare desenare (probele aleg după `data-k`); în exerciții cutia goală are căsuța goală, „–” doar în `tabelHtml`. Detalii: „Reparațiile după judecata 1”.
- **Datele de intrare (T2, 02.11.2026):** se scriu ca la V/28: „Se dau 40 pentru «puncte»” (simulatorul: „Se dau (datele de intrare): 40 pentru «puncte».”); „=” doar în condiții, unde întreabă „sunt egale?” (V/27). O evaluare care dă date le scrie la fel.

## Pentru componenta comună
- Nu ating motorul, `prezenta.js`, `rezultat-elev.js`, `evaluare-expresii.js`, `cutii-variabile.js`, `secventa-liniara.js` (doar le încarc pe primele două, nemodificate).
- `curriculum.json`: conținutul lipit (Contradicții, punctul 1).

## Durata (`_proba\durata.py` → `durata_out.txt`)
**48,3 min la 80 cuv./min; 41,3 min la 110 cuv./min** (regula 30 / glosarul I.9: sub 50). **La 80 cuv./min e în banda 48-50: de cronometrat la clasă** (ghidul S45). Metoda: 9 s pe gest, 20 s pe verificare, 40 de semne tastate/min, 15 s de socoteală pe fiecare rând al tabelului; laboratorul: 30 s Explorer + 30 s pe rând scris de mână (4 rânduri) + 60 s al doilea traseu și propoziția. Cele mai lungi: atelierul (~9 min: 2 seturi × 5 rânduri + compararea) și laboratorul (~8 min). Ce se taie primul: „Încă un exercițiu” e deja opțional; în laborator, „Dacă mai ai timp”. Istoric: 48,8 (prima) → 46,7 (laboratorul cu un singur tabel în caiet) → 48,3 (algoritmul afișat în P4 și în Î3-Î5, ca întrebările să nu ceară numerele pașilor din memorie — reparația r1 de mai jos; se citește repede, elevul l-a mai văzut). Cuvintele pe pas (`_proba\cuvinte_pas.py`, înainte de r1): P1 79 · P2 70 + Uite cum 59 · P3 101 + 147 · P4 58 + 100 · P5 60 + 82 (Uite cum numără și algoritmul și celulele tabelelor; proza din „Uite cum” P3 ≈ 45 de cuvinte).
**Acum (după T2, metoda judecătorului 2):** 42,7 min la 110 cuv./min, 49,8 la 80 (2087 de cuvinte + 23,8 min de gesturi) — „Trecerea după judecata 2”, mai jos.

## Nesigur / de semnalat profesorului
- Vederea „Acest PC” din laborator (cu bare și „… liber din …”) și câți GB liberi au calculatoarele: NESIGUR (`capturi_lipsa.json` L1-L2). Ieșirea scrisă (după R1 și T2): „Nu găsești discul C: sau nu scrie nimic sub el? Lucrează cu 198 pentru «liber», din poză.”
- V/28 e nepublicată: termenii și forma presupuse după granița ei (reverificat la 20:20, „API FINAL” al ei).

## Pentru profesor
1. **„Sfârșit dacă” și ramura fără „altfel”** — după manualul clasei; lecția nu le are (vezi „Notația”). **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**
2. **„Se compară traseele”** — în pagină, compararea e o alegere (motivul ales), iar în laborator o propoziție scrisă în caiet; la clasă (nu la ora simultană) se poate cere spusă cu voce tare.
3. **Pragul de 100 GB** din laborator: dacă toate calculatoarele au peste 100 GB liberi, toți ajung pe ramura „atunci”; punctul 4 le dă oricum numărul pentru cealaltă ramură.

## Regula 25 (calculatorul profesorului) și regula 22
- Nimic pornit pe ecranul vizibil: Explorer, Paint, Calculator, Chrome / Edge reali NU s-au pornit. Sonda Explorer = Shell.Application (fără fereastră) + citirea unui fișier `.mui`. Niciun Office. Nicio oprire de proces după nume.
- Probele cu browser: Chromium-ul din Playwright, headless, pagina servită local (`_proba\server_local.py`), tot ce nu e 127.0.0.1 blocat, închidere cu `ctx.close()`. `activitate.py lista | grep -c "nu e în catalog"`: **2 înainte, 2 după** (cei 2 elevi reali de azi, din contract; doar numărul, `_proba\activitate_*.txt`).

## Atenție pentru judecător
1. **V/28 nepublicată:** forma pașilor, tabelul și numele „structura secvențială” presupuse după granița ei; după publicarea V/28, de comparat P3/P5 și „Ai nevoie de” cu pagina ei reală.
2. **Valorile duse automat** în tabel (diferența față de V/28) — decizie scrisă în graniță; dacă dirijorul vrea forma V/28, schimbarea e în `draw` (celulele devin căsuțe), nu în lecție. **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**
3. **Regula 29:** testele judecă tabelul (traseul, valorile, condiția, afișarea), nu ordinea gesturilor; ordinea rândurilor = traseul, chiar ce se predă. Elevul poate alege orice pas (ca pe hârtie); greșelile merg mai departe în cutii.
4. **Uite cum P3 = 147 de cuvinte** cu algoritmul și celulele tabelului (proza ≈ 45): e „împreună” din activitatea profesorului; n-am tăiat explicațiile rândurilor.
5. **Durata la limită** (48,3 la 80 cuv./min, 41,3 la 110): de cronometrat la clasă.
6. **La 360 px** tabelele cu 3 cutii (6 coloane) depășesc cu 6-17 px și se derulează în caseta lor, cu indiciul „Pe un ecran îngust, trage tabelul spre stânga…” (afișat sub 380 px); la 390 încap toate (`_proba\latime_tabel.py`). **[R1 02.11: schimbat — vezi „Reparațiile după judecata 1 (02.11.2026)”]**
7. **Laboratorul** depinde de un număr pe care nu-l știm (GB liberi în laborator); ramura e oricare, iar punctul 4 o acoperă pe cealaltă.
8. Fotografia P1 = copia identică a celei din VI/21 / VI/23 (CC0); captura Acest PC = copia identică din V/9.

## Porțile și probele (ieșirile în `_proba\`; rulate ULTIMELE, pe versiunea finală, de `_proba\final.sh` → `final_rezumat.txt`; sha1 ale paginii și ale celor 3 simulatoare aceleași la început și la sfârșit)
| Proba | Rezultat | Ieșirea |
|---|---|---|
| `node _proba\sim_logica.js` (oracol independent pe 17 seturi, mutanți pe fiecare rând + mesajul urmat literal, 43 de forme de text, 40 de numere, echivalențele P4 / Î5, 160 de seturi aleatoare) | **0** (209 verificări) | `final_sim_logica.txt` |
| `test_joc.py --dir lectii/v m4-l29` | **TRECUT** (19 întrebări jucate; doar „1 niveluri”, obișnuit) | `final_test_joc.txt` |
| `verifica_lectie.py index.html --fara-t1` | **0** (S0, S1, S2 4/5, T0 0) — prima rulare: T0 = 2 („decizională” nedefinit; „Traseul” folosit în tabelul P3 înainte de P4) → reparate | `final_verifica.txt` |
| `_proba\parcurge.py final` — 390 px (Pixel 7, atingeri) și 1280 px (mouse + taste, Enter în căsuță): la fiecare tabel întâi greșeala tipică (pașii AMBELOR ramuri) → respinsă; mesajul urmat ÎNTOCMAI („Înapoi un rând” de câte ori spune, apoi rândurile bune) → „Corect”, toate testele bifate; atelierul cu o comparare greșită întâi; 5 întrebări; 3 stele | **0 probleme**; 0 erori de pagină, 0 mesaje de consolă; ținte ≥ 32 px; nimic mai lat decât ecranul; cereri oprite 2, spre panou 0 | `parcurge_final.txt`, `final_parcurge_run.txt`, capturile `telefon_*.png` (privite: P5 tabelul, atelierul greșit, laboratorul) |
| `_proba\latime_tabel.py` (360 și 390) | la 390 toate încap; la 360, 3 tabele de 6 coloane depășesc cu 6-17 px (derulare în casetă, cu indiciu) | `final_latime.txt` |
| `_proba\vocabular.py` (granița) | **0** | `final_vocabular.txt` |
| `learninghub_date_personale.py` (regula 27) | **0** | `final_date_personale.txt` |
| `activitate.py lista \| grep -c "nu e în catalog"` (regula 24) | **2 înainte, 2 după** (în fiecare rulare) | `activitate_*.txt` (doar numărul) |
- Nicio descărcare în lecție → `curata_metadate.py` nu se aplică. Niciun Office, nimic pe ecranul vizibil.

## Reparațiile autorului după prima rulare finală (02.11.2026, 20:25; copia dinainte: `_proba\inainte_r1\index.html`; scriptul `_proba\r1_editari.py`)
- P4 (Încearcă și Încă un exercițiu) și Î3, Î4, Î5 numeau pașii unui algoritm din alt pas („traseul 1, 2, 3, 5”) fără să-l arate: acum algoritmul e afișat în enunț.
- Laboratorul: punctul 2 spunea „ca în poza de mai jos”, dar în pasul „Acum la calculator” poza era în intro, DEASUPRA listei: poza stă acum în punctul 2, sub text.
- Probele finale rulate din nou după reparații (tabelul de mai sus = a doua rulare).

## Reparațiile după judecata 1 (02.11.2026)
**Reparator (R1, autor proaspăt), 21:04-21:45.** Registrul (deciziile dirijorului + reparația, locul, starea și proba fiecărui punct): `_verificare\registru_j1.md` — 12 puncte (A-H de la opus, S1-S9 de la sonnet, fără dubluri): **11 REPARATE, 1 RESPINS** (S6, decizia dirijorului: proza din „Uite cum” e sub ~80 de cuvinte — P2 31, P3 21, P4 26, P5 39). Copia dinainte: `_proba\inainte_r1\j1_reparare\` (pagina, simulatorul 1.0, fișierele de lângă, imaginea veche). `_proba\inainte_r1\index.html` e copia autorului de la 20:25 (nu e a mea).

**Ce s-a schimbat în pagină**
- **A (MAJOR)** — P2 spune acum, într-un paragraf „atentie”, fără exercițiu: „În unele manuale, decizia se încheie cu rândul „Sfârșit dacă”. Unele decizii n-au „altfel”: dacă condiția e falsă, din decizie nu se face nimic. Azi, fiecare decizie are ambele ramuri.” Temeiul: Intuitext r. 4147-4154 și Corint r. 3152-3156 („Sfârșit dacă” în formă); Art Klett r. 3348-3372 („Dacă nu este îndeplinită condiția, nu se execută nicio acțiune.”, „Există cazuri în care există doar o ramură a structurii, lipsește ramura Altfel.”); Sigma r. 3977-3994 („cazuri particulare … atunci când lipsește a doua ramură, ALTFEL”) — `_proba\manual_citate.txt`. Straturile vechi din „Notația”, „Contradicții” 2-3 și „Pentru profesor” 1 („lecția nu le are”) sunt marcate „[R1 … schimbat]”.
- **D** „„altfel” nu e un pas: n-are număr și nu apare în tabel.” (P2) · **G** „Azi citești decizii” (P1) · **H** „Fiecare rând e un pas făcut” (P3) + două „→” din ajutoare (P3, Î1) și „Afișează =” din laborator, scrise în cuvinte · **S2** „traseu” nu mai apare înainte de P4 · **S3** „două drumuri (ramuri)” în P1; obiectivul fără „ramură”.
- **F** — P3, o singură regulă: „În tabel e ce are fiecare cutie DUPĂ pas; cutia încă goală are căsuța goală („–” în tabelul gata făcut). … În exerciții, ce nu schimbă pasul (valoarea din rândul de deasupra) e scris deja, cu gri înclinat; tu scrii doar ce pune pasul.” Diferența față de V/28 (valorile neschimbate completate singure) RĂMÂNE, decizia dirijorului. Regula căsuței goale = pagina reală V/28 (recitită 21:35, după reparația ei: „căsuța rămâne goală”, „„–”: cutie încă goală”; granița `v_l28.md` „SCHIMBAT 21:32” spune că regula nu s-a schimbat).
- **C** — imaginea `img\acest-pc-liber.webp`: copia capturii din lecția 9 + chenar roșu #E4002B pe „198 GB liber” (`_proba\r1_marcaj_198.py`: 0 pixeli schimbați în text); legenda spune că cifrele roșii mari arată totalul, nu cât e liber. În laborator, legendă scurtă.
- **E** — laboratorul, punctul 2: discul cu (C:) la sfârșitul numelui (de exemplu Windows (C:)); numărul dinaintea cuvântului „liber” (sau „liberi”); „Scrie TB în loc de GB? Sunt mult peste 100 GB: lucrează cu «liber» = 1000.”; „Nu găsești discul C: sau nu scrie nimic sub el? Lucrează cu «liber» = 198”. NESIGUR (nu se sprijină niciun exercițiu pe ele): forma din Windows 10 („liberi din”?) și numele discului din laborator — `afirmatii.json` A21-A22, `capturi_lipsa.json` L3.
- **B** — atelierul, „Compară traseele”: fiecare variantă are motivul ei, 80-92 de caractere; ordinea o amestecă simulatorul.
- **Durata** (nu crește): metoda opus (`_proba\j1\j1_durata.py`, copia neschimbată) **42,7 min la 110 cuv./min, 49,8 la 80** (era 42,7 / 49,9; 2087 de cuvinte, era 2088); metoda sonnet 33,9 / 41,5. Ce am adăugat (A, D, E, B) l-am scos din: textul P3 (114 → 103 cuvinte), legenda capturii (scurtă în laborator), introducerea laboratorului („Când mai sunt 10 minute…” — o spun „Cum lucrezi” și ultimul punct), atelier („apoi răspunzi sub tabel”). **De cronometrat la clasă** (49,8 la 80 e în banda 48-50).

**Simulatorul `lectii\_sim\urmarire-decizie.js` 1.0 → 1.1 (API NESCHIMBAT; granița `v_l29.md`, „SCHIMBAT 21:19”)** — pentru lecția următoare (V/30) și oricine îl încarcă:
- Aceleași funcții, același tip `tabel-urmarire`, aceeași formă a lui `A` / `P`, aceleași teste (`k`), coloane, prefix `ud-`, `#ud-css`, eveniment. Adăugire compatibilă: `compara.amesteca:false` (ordinea scrisă).
- „Compară traseele”: variantele AMESTECATE o dată pe desenare; `data-k` = indicele din `compara.o` (probele aleg după `data-k`, nu după poziție).
- Tabelul de completat: cutia încă goală = căsuță GOALĂ (ca V/28); `tabelHtml` (gata făcut) păstrează „–”. Valorile duse: #636D5D / #8F9C89 + înclinat (contrast 5,42 / 5,73).
- ≤ 420 px: text .8rem, celule fără spațiu lateral, tabelul din exercițiu pe toată caseta → la 390 încap tabelele de 6 coloane; la 360 se derulează în casetă, cu indiciu.

**Probele (pe versiunea finală; rezumatul `_proba\r1_final_rezumat.txt`, sha1 ale paginii și simulatoarelor aceleași la început și la sfârșit)**
| Proba | Rezultat | Ieșirea |
|---|---|---|
| `_proba\proba_reparatii.py` (NOU: câte o verificare pe punct, [litera], 390 cu atingeri + 1280 cu mouse și taste, rețea blocată, `ctx.close()`; + mutantul B pe 1.0 + 360 + V/28 de pe disc) | **0** (89 de verificări; mutantul 1.0 PICĂ) | `proba_reparatii_2.txt` |
| copia `j1_drumuri.py` (opus; o singură linie schimbată: ieșirile în `_proba\j1\`) | **0** (31 de drumuri pe fiecare lățime) | `j1\j1_drumuri_out.txt` |
| copia `j1_durata.py` / `j1_forme.js` / `j1_citate.py` | 42,7 / 49,8 · 1 (forma inventată „scrie Nivel trecut”, ca la judecător) · 7 (citatele reparate nu mai sunt; „O decizie se scrie așa:” rămâne) | `j1\` |
| copiile probelor sonnet (identice, `_proba\ab_sonnet\`) | durata 33,9 / 41,5; `joaca.py` alege „primul buton” la „Compară” → după B nimerește la întâmplare (o dată a nimerit varianta bună la pasul „greșit” → „lipsește Verifică”); `latime.py` se oprește ca la judecător (așteaptă `#body`) | `ab_sonnet\*.txt` |
| `sim_logica.js` · `vocabular.py` (permite „Sfârșit dacă” DOAR în paragraful din P2) | **0** (209) · **0** | `r1_sim_logica.txt`, `r1_vocabular.txt` |
| `parcurge.py r1` (390 + 1280, greșeala tipică întâi, mesajul urmat întocmai, 3 stele) | **0**; consola goală | `parcurge_r1.txt` |
| `latime_tabel.py` | 390: toate încap; 360: 3 tabele de 6 coloane în casetă, cu indiciu | `r1_latime.txt` |
| `test_joc.py` · `verifica_lectie.py --fara-t1` · `learninghub_date_personale.py` | **TRECUT** · **0** · **0** | `r1_test_joc.txt`, `r1_verifica.txt`, `r1_date_personale.txt` |
| `activitate.py lista \| grep -c "nu e în catalog"` | **2 → 2** (doar numărul) | `r1_activitate_*.txt` |
- Nimic pe ecranul vizibil: Explorer, Paint, Calculator, Chrome / Edge reali nu s-au pornit; Chromium headless, pagina servită local, tot ce nu e 127.0.0.1 oprit. Nicio oprire de proces după nume.

**Pentru judecata 2:** (1) P2 „atentie” — e destul de scurt și adevărat? (2) culoarea gri + înclinat pe telefon (`_proba\telefon_atelier_gresit.png`); antetele tabelului la 390 sunt strânse (celule fără spațiu lateral). (3) V/28 rămâne NEPUBLICATĂ: termenii, pașii și coloanele comparate cu pagina ei de pe disc (21:35), de reverificat după publicare. (4) Durata 49,8 la 80 cuv./min — de cronometrat.

## Trecerea după judecata 2 (02.11.2026, seara)
**T2 (autor proaspăt), după judecata 2 (0 GRAV / 0 MAJOR / 3 MINOR).** Registrul: `_verificare\registru_j1.md`, „Trecerea după judecata 2” — I, J, K REPARATE, 0 respinse; copia dinainte `_proba\inainte_t2\`.
- **I** — datele de intrare se scriu ca la V/28: în simulator „Se dau (datele de intrare): 40 pentru «puncte».” (era „Datele de intrare: «puncte» = 40.”), în pagină „Cu 65 pentru «puncte»:”, „primește 40 pentru «puncte»”, „cu 15 pentru «bani» și 3 pentru «caiete»”, „lucrează cu 1000 pentru «liber»” (21 de locuri). „=” rămâne doar în condiții / lista comparațiilor (V/27: „=” întreabă „sunt egale?”). Simulatorul rămâne **1.1**: doar texte, API și teste neschimbate (granița: „SCHIMBAT 22:48”).
- **J** — P2, caseta „Acum”: „Sub discul cu (C:) la sfârșitul numelui (de obicei Disc local (C:)), primul număr arată câți GB sunt liberi (poza de mai jos). Scrie TB? Atunci sunt peste 100 GB.”
- **K** — „Pentru lecția următoare”: rândul „Versiunea 1.1 (02.11.2026)…” după „API:”.
- **Durata, socotită din nou cu metoda judecătorului 2** (`_proba\j2\j2_durata.py`, copia neschimbată; elevul lent, gesturile lui): **2087 de cuvinte + 23,8 min de gesturi = 42,7 min la 110 cuv./min, 49,8 la 80** (înainte de T2: 2087 → 42,7 / 49,8; după prima trecere 2102 → 50,0 la 80). Ce au adăugat I, J și textul nou din tabelele simulatorului (P3, P4) am scos din laborator, din „Uite cum” P2, din titlurile tabelelor de la P4 și din cerința atelierului, fără să scot o regulă, un pas sau o ieșire (lista: registrul). La 80 cuv./min rămâne **sub 50, dar la limită** (49,8): de cronometrat la clasă cu elevul lent.
- Probele: `proba_reparatii.py` (toate punctele + [I] [J] [K]) **0 (121 verificări OK)** (`proba_reparatii_t2a.txt`; mutantul B pe 1.0 PICĂ; mutantul I — pagina + simulatorul dinainte — e PRINS) · `sim_logica` **0 (209 OK)** · `vocabular` **0** · `parcurge.py` **0** (390 cu atingeri + 1280, 3 stele, consola goală; `parcurge_t2.txt`) · `latime_tabel.py`: la 390 toate tabelele încap, la 360 cele 3 tabele de 6 coloane se derulează în casetă, cu indiciu (identic cu R1) · copia `j1_drumuri.py` **0** infidelități · copia `j2_proba.py` (o linie: ieșirile în `_proba\j2\`) **1** · `j1_forme.js` 1 (forma inventată „scrie Nivel trecut”, ca la J1/J2) · `j2_citate.py` 4 citate negăsite (C, E + S9, I în pagină, I în simulator) — I de două ori și E = textul înlocuit de I; C = legenda din P2, scurtată pentru durată (spune în continuare chenarul roșu, 198 GB liberi, „totalul, nu cât e liber”: [C] OK) · `test_joc` **TRECUT** (un avertisment: 1 nivel, ca la R1) · `verifica_lectie --fara-t1` **0** · date personale **0** · terminațiile (bytes, `t2_terminatii.py`) **0** probleme · activitate **2 → 2** (doar numărul). Copia `j2_proba.py` raportează: „[E] textul reparației nu e în pagină” — proba judecătorului caută, la E, textul VECHI „«liber» = 1000” / „«liber» = 198”, pe care I l-a înlocuit (la cererea aceluiași judecător); ieșirile E sunt în pagină în forma nouă (`proba_reparatii` [E] OK, la 390 și 1280).
