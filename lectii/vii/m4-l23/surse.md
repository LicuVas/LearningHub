# Lecția VII/23 — „Analiza enunțului unei probleme: date de intrare, date de ieșire, operații” (surse, decizii, probe)

**Nu e publicată, nu e în depozit (fără commit).** Autor: agentul VII/23, valul M4, 26.10.2026. Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md` (25.10.2026). Granița: `_campaign\revizuire_completa_2026_09\m4_26_10\granite\vii_l23.md`. Nota de predare: `_proba\stare_autor.md`.

## 1. Ancora

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Info_Gimnaziu_2026\data\unitati.json` (VII-U4, nr. 23) și `planificari\Calendar_ore_7_MA.md` r. 33 („12.03.2027 \| 23 \| M4 \| Analiza enunțului unei probleme: date de intrare, date de ieșire, operații \| predare”) | întocmai |
| Numărul și data | `Calendar_ore_7_MA.md`: nr. 23, 12.03.2027; `Calendar_ore_VII_A.md` / `VII_B.md` r. 40: nr. **24**, 16.03.2027 | pagina urmează `unitati.json` / `7_MA` (ghidul S4); diferența e scrisă aici |
| Unitatea | `unitati.json`: VII-U4 „De la algoritm la program”, CS.1.4, CS.2.1, CS.2.2, CS.3.3; `Proiectul_unitatii_VII-U4.md`: ora 23, predare, materiale „teorie, exercitii” | `competente:['CS.2.1']` (lecția nu ține de mediu / program) |
| Competența | `AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VII-a, CS.2.1 „Analizarea enunțului unei probleme simple în vederea rezolvării ei printr-un algoritm”; activitățile: „identificarea datelor de intrare și ieșire pentru o problemă familiară la una dintre disciplinele studiate/hobby personal”, „identificarea operațiilor necesare pentru rezolvarea problemei prin analiza elementelor structurale”, „identificarea unui algoritm de rezolvare a unei probleme alese” | primele două = pașii 2-6, atelierul, laboratorul; a treia = doar trecerea de la tabel la algoritm (pasul 6, „Uite cum”), restul la lecțiile următoare |
| Descriptorul De bază (CS.2.1) | „…identifica și clasifica datele … în date de intrare și de ieșire, precizând tipurile acestora/variabilelor…” | intrare / ieșire DA; **tipurile NU** (lecția 25, „Date numerice”) — granița din brief |

### Conținutul declarat (deschis, pentru dirijor)
Programa unității VII-U4 are doar conținuturile domeniului „Limbaj de programare” (`acoperire.load_sources()`: mediul, structura, vocabularul, „Date numerice”, „Operații de citire și afișare a datelor”, cele trei structuri). Niciunul nu e „analiza enunțului” (aceasta e o activitate a CS.2.1), dar poarta (`test_joc.py` r. 104) cere cel puțin un conținut. Am declarat `continuturi:['Operații de citire și afișare a datelor']` ca **acoperit PARȚIAL** (precedentul VI/17, ghidul S11), spus și în `ancoraText`: lecția predă ce se citește (datele de intrare) și ce se afișează (datele de ieșire), în enunț și în notația algoritmilor; citirea și afișarea în limbaj rămân la lecția 25. **Întrebare pentru dirijor:** excepție în poartă pentru lecțiile „de analiză” sau nota „acoperit parțial” (ca la VI/17)?

### Conținut → unde se predă și se verifică (S8)
| Ce | Pasul (în bara de jos) | Încearcă | Atelier / laborator | Întrebare |
|---|---|---|---|---|
| problema și enunțul; datele de intrare și de ieșire | „Enunțul: ce primești și ce afli” (2 din 6) | marcare (bicicleta) | atelier (marcarea), laborator (coloanele 2-3) | Î2 |
| operațiile; numărul fix al regulii | „Operațiile…” (3 din 6) | alegere (concursul, 4 puncte) | atelier (operațiile, numerele fixe nemarcate), laborator (coloana 4) | Î1, Î2 |
| exemplul (intrare → ieșire) | „Exemplul…” (4 din 6) | ieșirea calculată (somnul) | atelier (ieșirea) | Î3 |
| restricțiile; număr natural; ≤ ≥ | „Restricțiile…” (5 din 6) | sortare (1 ≤ n ≤ 30) | — | Î4 |
| tabelul analizei; enunțul căruia îi lipsește o dată | „Tabelul analizei…” (6 din 6) | alegere (muzeul) | laborator (tabelul întreg) | Î5 |
| ce se citește / ce se afișează (conținutul declarat, parțial) | 2 din 6 + „Uite cum” din 6 din 6 (Citește / Afișează) | marcarea | atelier | Î2 |

## 2. Granița (S59)
**Predau:** problema de informatică și enunțul; datele de intrare și de ieșire; operațiile (prelucrările); numărul fix al regulii; exemplul calculat de mână; restricțiile ca idee simplă; tabelul analizei; enunțul căruia îi lipsește o dată; trecerea scurtă de la tabel la algoritm, în notația claselor a V-a / a VI-a.
**NU predau:** mediul de programare, editarea, rularea, structura programului (lecția 24); vocabularul limbajului, tipurile de date, citirea / afișarea în limbaj (lecția 25); implementarea structurilor (26-28). Niciun limbaj, niciun mediu numit (decizia dirijorului, `_m4.md` §1; ghidul X.2 nr. 10 — a lui Vasile). Verificat: T0 = 0 la `verifica_lectie.py`; în textul pentru elev nu apar „C++”, „Python”, „Code::Blocks”, „compilare”, „variabilă”, „int”, „cin/cout” (grep; „Python” e doar în comentariul codului, despre oracol). „Program” apare doar ca anunț („Înainte să scrii un program…”), iar `ancoraText` spune că citirea și afișarea în limbaj vin la lecția 25.

### Ce presupun cunoscut (cu bife)
| Presupus | Unde e predat | Acoperit |
|---|---|---|
| Word: document nou, Document necompletat (Blank document) | VII/2-3 (publicate) | ✔ reluat în caseta pasului 2, cu aceleași cuvinte ca VII/3 |
| Word: tabel pe grilă (coloane × rânduri), Tab între celule, după ultima celulă nu mai apeși Tab | VII/4 (publicată) | ✔ casetele pașilor 3 și laboratorul (+ „Ctrl+Z dacă a apărut un rând”, probat) |
| Word: F12, Documente, numele cu clasa, „already exists” → Anulare (Cancel), Ctrl+S, Deschidere › Răsfoire, ✕ | VII/3 (publicată) | ✔ caseta pasului 4 și laboratorul, aceleași cuvinte |
| algoritmi, Citește / Afișează / ← | clasele a V-a și a VI-a (planul nou NU e publicat pentru generația asta; ei au avut jocurile algoritmi-v / -vi) | ✔ predat din nou: datele la pasul 2, notația explicată în pasul 6 („după Citește vin datele de intrare… ← se citește «primește»”) |
| împărțirea cu rest, perimetrul dreptunghiului | matematică (clasele V-VI) | PRESUPUS; exercițiile le folosesc doar în „Încă un exercițiu” / indicii, cu explicația în `why` |
| ≤, ≥ | VI/17 (nu e a lor) | ✔ predate din nou în pasul „Restricțiile…” |

## 3. Decizii (și de ce)
1. **Fără limbaj de programare** (decizia dirijorului). Notația de algoritm apare o singură dată, ca punte, în „Uite cum” din pasul 6, cu toate semnele explicate.
2. **Laboratorul în Word**, nu în Documente Google: Word e deja predat (VII/2-10), nu cere cont, iar la ora simultană (Tupilați) drumul fără profesor e mai scurt. Fișierul poartă clasa (`Numele_Prenumele_<clasa>_analiza`, convenția VII/3, regula 38).
3. **Un exemplu lucrat pe toată lecția** (banii Marei): enunțul colorat → operațiile → exemplul 50/12/5 → restricțiile → tabelul → algoritmul. Încearcă-urile folosesc ALTE probleme (aplicare, T44).
4. **„Număr fix al regulii (constantă)”** în loc de „constantă” singur: elevii de a VII-a nu au lecțiile clasei a V-a pe sit; cuvântul „constantă” e dat în paranteză, ca legătură (DEPĂȘIT 26.10, după judecata 1, reparația C: „constantă” e predat într-o propoziție, la pasul „Operațiile…”: „Un număr fix al regulii se mai numește constantă.”).
5. **Simulator nou** `lectii\_sim\analiza-enunt.js` (proprietar VII/23): orice cuvânt se poate atinge (forma nu trădează datele); un cuvânt dintr-o dată ajunge (DEPĂȘIT 26.10, după judecata 1: o dată se marchează cu toate cuvintele ei — §9); cuvintele discutabile sunt „neutre” (`[n…]`, ex. „între elevi”, „Fiecare elev mai plătește”); numerele fixe se marchează strâns, pe număr („[c1|9 lei]”), ca mesajul „face parte dintr-un număr fix” să fie adevărat. Testele judecă rezultatul (marcajele, setul de operații, numărul), nu ordinea gesturilor.
6. **Răspunsurile scrise** (ieșirea): cifre, unități („33 de lei”), cuvinte („treizeci și trei”), socoteala cu „=” (verificată doar bucata dinaintea ultimului „=”). Probat pe 43 de forme bune și 42 greșite (`oracol_exemple.py`, partea C): 0 bune respinse, 0 greșite primite.
7. **Imaginea „cum arată”** după caseta tabelului: pagina desenată de Word real (PDF prin COM), nu o captură de ecran (ghidul IV.1: permis).

### Variante respinse
- Google Documente la laborator (cont + parolă, drum de rezervă lung).
- Grupe largi pentru numerele fixe („un coș obișnuit aduce 2 puncte”): mesajul ar fi fost fals pe „coș”.
- „Recente (Recent)” în laborator (nume RO NESIGUR, ghidul F7) → doar Deschidere › Răsfoire.
- Exemplul „de exemplu 12” din mesaje (era chiar un răspuns: somnul 21 → 9 = 12) → „125”.
- Setul de date somn 21/9: greșeala tipică (culcare − trezire = 12) dădea aceeași valoare ca răspunsul bun → 21/8 (prins de poartă și de oracol, partea A).

## 4. Materialul existent
- Jocul `jocuri\program-vii` (VII-U4) e scris pentru C++ (Code::Blocks): NU l-am folosit (decizia fără limbaj). Întrebarea lui de la nivelul 1 („prețul unei cărți și numărul de cărți”) am evitat-o ca temă. `_proba\intrebari_existente_vii_u4.txt` (PASUL 0, 41 de itemi) + `_proba\asemanare.py`: 0 perechi ≥ 0,40 față de unitate și de VI/17.
- Activitatea profesorului: `Proiectul_unitatii_VII-U4.md` dă doar „teorie, exercitii” pentru ora 23; nu există fișă sau test pentru ea. Ce face lecția vine din activitățile CS.2.1 (citate mai sus).

## 5. Durata (metoda judecătorului: 110 cuvinte/min + gesturile; `_proba\durata.py`)
Drumul obligatoriu: 2 071 de cuvinte (fără „Explică-mi altfel”, „Încă un exercițiu”, „Dacă mai ai timp” și fără blocurile „Verifică-te”, ca `j2_durata.py`) = 18,8 min; gesturile 26,0 min (detaliate în `durata_out.txt`: marcarea 1,5; ieșirea 1,5; casetele Word 5,5; atelierul 3,5; laboratorul 6,5 + 1,5; întrebările 3; mesajele 1). **Total ≈ 45 min.** Cu estimările mai largi de la prima socoteală (atelier 5, laborator 8) ar fi ≈ 48 min: **de cronometrat la clasă**. Supapa: „Când mai sunt 10 minute din oră, treci la întrebări; tabelul din Word îl termini data viitoare” (în „Cum lucrezi” și în laborator).

- **Strat 26.10.2026 (reparația după judecata 1):** cu metoda judecătorului 1 (`_proba\durata_r1.py` = copia lui `_verificare\j1_durata.py`, schimbate doar gesturile marcării: o dată se marchează acum cu toate cuvintele ei — P2 15 gesturi, atelierul 16,5 atingeri) + textele noi: **≈ 47,3 min** (judecătorul, înainte: 45,5). Sub 50; tot „de cronometrat la clasă”.

## 6. Probele și porțile (toate rulate după ultima schimbare — vezi `stare_autor.md`)
- `test_joc.py --dir lectii\vii m4-l23` → **TRECUT** (26 de întrebări jucate; avertismentul „1 niveluri” e obișnuit la lecții).
- `verifica_lectie.py index.html --fara-t1` → **0** (S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0).
- `_proba\parcurge.py` (390 px cu atingere + 1280 px cu mouse și taste; fiecare exercițiu întâi greșit, apoi corect; Enter în căsuța ieșirii nu verifică) → **0 probleme**, 0 erori în consolă, 3 stele, 0 reîncărcări. Capturile de telefon privite: `telefon_pas1_sim.png`, `telefon_pas3_sim.png`, `telefon_atelier.png`, `telefon_real.png`.
- `_proba\oracol_exemple.py` → **0** nepotriviri (26 de seturi de date + 18 chei / socoteli statice + 85 de forme scrise; mutantul prins; greșeala tipică ≠ răspunsul pe fiecare set).
- `_proba\proba_word.py` (Word real, desktopul ascuns) → **0** (afirmatii W4-W7).
- `_proba\licenta_commons.py` → 0 (licența CC BY-SA 4.0 reverificată, copia identică).
- Regulile verificate pe lecție: 1, 3, 5, 6, 7, 9, 10, 14 (focusul rămâne pe buton: nu există loc de lucru), 15/31 (telefon), 20 (ținte: cuvintele au min-width 32 px), 23 (nimic salvat de simulator), 24, 25, 26, 27, 33, 36, 38.

## 7. Siguranța (regulile 22-27)
- Regula 24: toate probele cu browser servesc situl local (`_proba\server_local.py`), blochează tot ce nu e 127.0.0.1 și se închid cu `ctx.close()`; 2 cereri oprite în total (fonturile Google), 0 spre panou. `activitate.py lista | grep -c "nu e în catalog"`: **0 înainte** (08:22) și **0 după** probe (vezi `stare_autor.md`); ieșirea cu nume nu s-a salvat.
- Regula 25: Word pornit DOAR pe desktopul ascuns (`/x` la `proba_word.py`, `DispatchEx` invizibil la `captura_word.py`), oprit pe PID-ul lui; documentele închise fără salvare; singurul fișier salvat, `_proba\salvari\tabel_antet.pdf`, prin `SaveAs2(AddToRecentFiles=False)`; vederea Word citită la început și pusă la loc prin COM (Print Layout, zoomul de la pornire); 0 fișiere de recuperare noi în `%APPDATA%\Microsoft\Word` și în `UnsavedFiles`; nicio fereastră Salvare ca / Deschidere deschisă (deci nimic în ComDlg32 / BagMRU). Chrome / Edge / aplicații din Magazin: nepornite.
- Regula 22: singura cerere externă = API-ul Commons, cu User-Agent-ul `LearningHub-lectii/1.0 (educational site)`.
- Regula 27: numele din exemple sunt inventate; „Ana Popescu” verificat liber (`lectii\vi\m2-l13\_proba\nume_toate.py`). Prenumele singure (Mara, Andrei, Ioana, Vlad, Dan, Mihai, Radu, Ana) nu identifică pe nimeni.

## 8. Imaginile (`img\SURSE.json`)
- `automat-bilete.webp`: refolosită de la VI/17 (copie identică), CC BY-SA 4.0, Baditastefan, licența reverificată pe 26.10.2026; atribuirea sub imagine. Privită: monedele sus-dreapta, ecranul, tava cu biletul și restul — legenda spune doar ce se vede.
- `word-tabel-antet.webp`: pagina desenată de Word real (PDF), conținut inventat; arată rezultatul casetelor de la pașii 2-3 și NU dă răspunsul niciunui exercițiu (rândurile 2-3 sunt goale).

## 9. Reparațiile după judecata 1 (26.10.2026)
Registrul, cu fiecare punct al AMBELOR judecăți (opus `_verificare\judecator1.md`, sonnet `_verificare\ab_sonnet\judecator1.md`), reunite fără dubluri, gravitatea = cea mai mare: **`_verificare\registru_j1.md`** (15 puncte A-O + 2 întrebări hotărâte de dirijor, P și Q; toate REPARATE, 0 respinse). Proba pe litere: `_proba\proba_reparatii.py` → `_proba\proba_reparatii_N.txt` (ultima linie 0). Formele scrise: `_proba\proba_forme_r1.py` (55 opus + 79 sonnet + 58 ale mele, 0 nepotriviri). Copia dinainte: `_proba\inainte_r1\`.
- **A, H, L (marcarea, simulatorul 1.1):** cuvintele greșite ale unui fel primesc contur roșu, iar mesajul spune ce faci cu ele și, la un cuvânt repetat, al câtelea e și în ce propoziție („al doilea „câți” din enunț, cel din propoziția „Să se afișeze câți kilometri parcurge în total.””); tot enunțul colorat → un mesaj cu numărul cuvintelor și „Ia-o de la capăt”; o dată se marchează cu TOATE cuvintele ei (într-una din aparițiile ei), iar cuvintele care lipsesc primesc contur punctat.
- **B, O (răspunsurile scrise):** împărțirea cu rest ca la școală („23 : 5 = 4 rest 3”, „4 rest 3”, „4 r 3”, „23 : 5 = 4”), socoteala fără „=”, „9 ore (24 - 22 + 7)”, „9, adică 2 + 7”, „9:00”, „45.0”, „9 ore și 0 minute”, numerele cu sute în cuvinte; „nu 9”, „9 sau 10” respinse; la bomboane și la baterie: „în căsuța … scrii câtul, în căsuța … restul”, iar câtul pus în locul restului (sau invers) e spus pe nume.
- **C-K, M, N, P (texte):** „constantă” predată într-o propoziție; „oră întreagă (fără minute)” la Mihai; „cu cât… mai mare” = scădere; fără „la un loc” ca semn al înmulțirii; bateria fără cuvinte care sunt „nu numește o dată” într-o propoziție și dată de intrare în alta; „rest” din algoritm explicat; „Ai nevoie de” cu lecția 2 (Ctrl+Z); numărul natural = 0, 1, 2, 3…; „trei coloane” + coloana „Problema” din Word; W12 probat (OK / Cancel pe drumul F12); antetul: „citirea și afișarea datelor într-un program vin abia la lecția 25”.
- Word nu l-am pornit la reparație (laboratorul nu s-a schimbat ca fapt; W12 = proba judecătorului, `_verificare\j1_word.json`), deci nicio urmă nouă în `Office\Recent`.

**Pentru lecția următoare, ce s-a schimbat (API `analiza-enunt.js` 1.0 → 1.1, compatibil):** aceleași nume de tipuri, teste, clase `ae-`, `ae-stil`. NOU: o dată e „marcată” doar cu toate cuvintele ei (într-una din apariții) — dacă scrieți enunțuri noi, țineți datele scurte (`[i1|prețul caietului]`), pentru că elevul atinge fiecare cuvânt; clasele `ae-gr` (cuvânt greșit, contur roșu) și `ae-lp` (cuvânt lipsă, contur punctat); `numar(text)` întoarce și `rest` (la „c rest r”) și `cat:true` (la „a : b = c” cu rest); opțiunea nouă `catRest:[k_cât, k_rest]` la `exemplu` și la problemele din `analiza`. Granița: `m4_26_10\granite\vii_l23.md` (strat 26.10, cu ora).

## 10. Trecerea scurtă după judecata 2 (26.10.2026, R, S, T — 0 GRAV / 0 MAJOR / 3 MINOR)
Registrul: `_verificare\registru_j1.md`, secțiunea „după judecata 2”. Copia dinainte: `_proba\inainte_t2\`. Simulatorul 1.1 → **1.2**, compatibil (aceleași tipuri, teste, clase, API; `numar` mai poate întoarce câmpul `alte`).
- **R:** împărțirea cu rest scrisă ca explicație („4 (23 : 5)”, „4, adică 23 : 5”, „4 rest 3 (5 x 4 + 3 = 23)”), în cuvinte („câtul 4, restul 3”, „4 și rest 3”) și ca probă („23 = 5 x 4 + 3”) e primită; formele greșite rămân respinse, cu mesaj adevărat. Proba: `_proba\proba_forme_t2.py` (formele ambilor judecători + ale mele, 0 nepotriviri) și `proba_reparatii.py` [R].
- **S:** la mai multe cuvinte greșite, mesajul spune „Primul dintre ele e al doilea „câți” din enunț, cel din propoziția „…”” într-o propoziție a lui (nu „(primul: …, al doilea …)”); conturul roșu rămâne.
- **T:** decizia 4 de mai sus marcată DEPĂȘIT („constantă” e predat într-o propoziție).

## Pentru lecția următoare (VII/24)
- La elev rămâne `Numele_Prenumele_<clasa>_analiza.docx` (Documente sau folderul de pe tablă): titlul + tabelul analizei pentru „Cinema” și „Temperatura”. Lecția 24 poate porni de la una dintre ele („scrii programul pentru problema din rândul 2”).
- Cuvintele predate aici, cu aceleași forme: „date de intrare”, „date de ieșire”, „operații (prelucrări)”, „număr fix al regulii (constantă)”, „exemplu”, „restricții”, „tabelul analizei”.
- **Datele de manevră** (CS.2.1, descriptorul De bază: rezultatele calculate pe drum, ca „a cheltuit 17 lei” la Mara sau „prețul biletului plus sucul” la Cinema): ideea e în lecție („rezultate calculate înainte”, pasul „Tabelul analizei…”), dar fără nume; numele „date de manevră” rămâne lecțiilor 24-25 (hotărârea dirijorului după judecata 1, 26.10.2026).
- Cuvântul „constantă” e predat la pasul „Operațiile…”: „Un număr fix al regulii se mai numește constantă.” (26.10, reparația C).
- Simulatorul `lectii\_sim\analiza-enunt.js` (API în capul fișierului): `AnalizaEnunt.tipuri.{marcheaza, exemplu, analiza}`, `arata(enunt)`, `tabel(rand)`, `numar(text)`, `potriveste(text, n)`; forma enunțului `[i1|…]`, `[e1|…]`, `[c1|…]`, `[n1|…]`. Nu se schimbă: numele tipurilor și ale testelor, prefixul `ae-`, id-ul `ae-stil`, regula „nimic nu se salvează, nimic nu pleacă”. Extensiile au nume nou (`analiza-enunt-<ceva>.js`).

## Pentru profesor
1. Lecția e fără limbaj de programare, până alegeți C++ sau Python (X.2 nr. 10). Ce e acum se potrivește cu oricare.
2. Calendarul VII_A / VII_B o are ca ora 24 (16.03.2027), iar `7_MA` / `unitati.json` ca ora 23 (12.03.2027): lecția urmează `unitati.json`.
3. Expresia „număr fix al regulii (constantă)” e aleasă de lecție; dacă la clasă spuneți doar „constantă”, se schimbă ușor.
4. Tipurile datelor (cerute de descriptorii CS.2.1) sunt lăsate lecției 25 (granița din brief).

## Pentru componenta comună
Nimic schimbat în componentele altora. Observat, neschimbat: pe telefon, pastila „Sunt elev — mă înscriu” (`prezenta.js`) stă peste colțul din stânga-jos al mesajului „Corect!” până la prima derulare (vizibil în `telefon_pas1_sim.png`); nu acoperă butoane.

## Atenție pentru judecător
- `continuturi` declarat PARȚIAL (secțiunea 1) — decizie de structură.
- Marcarea: un singur cuvânt dintr-o dată ajunge (DEPĂȘIT 26.10: acum toate cuvintele datei, §9); cuvintele „neutre” nu sunt nici greșeală, nici punct. Încercați marcaje ciudate (ex. „Costul autocarului” = aceeași dată cu autocarul; „biletul lui la muzeu” = prețul biletului).
- Litera mare automată din celulele Word (W5) e probată doar pe calculatorul de lucru; în laborator setarea poate fi oprită (textul spune doar „e în regulă”).
- „La o fereastră cu Da și Nu: Nu (No)” e NESIGUR (W12) — pus pentru regula 26/36. (26.10, judecata 1: pe drumul F12 fereastra e OK / Cancel, probată de judecător — W12 PROBAT_JUDECATOR; textul rămâne ca formula regulii 36.)
- Durata ≈ 45-48 min, cu gesturi estimate.

## Nesigur
- ~~W12 (fereastra cu Da / Nu)~~ (rezolvat 26.10: OK / Cancel pe drumul F12, proba judecătorului), W5 în laborator, pornirea Word din Start pe calculatoarele școlii (reluată din VII/3).
- Durata reală la clasă (de cronometrat).
