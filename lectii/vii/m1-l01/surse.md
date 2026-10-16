# Surse — lecția VII · M1 · 1: Ce facem anul acesta. Criteriile de evaluare și cele trei niveluri. Evaluare inițială

Scrisă de autorul lecției pe 27.09.2026. Reparată pe 28.09.2026 de două ori: după judecata 1 (`_verificare/judecator.md`) și după judecata 2 (`_verificare/judecator2.md`), cu completările dirijorului. Reparată pe 29.09.2026 pentru regula de notare. Aliniată pe 01.10.2026 la actele oficiale (secțiunea următoare, care o înlocuiește pe cea din 29.09 acolo unde se contrazic). Standardul: `_campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md`.

## Alinierea la actele oficiale, 01.10.2026

Cererea profesorului (01.10.2026): „aliniaza si lectiile 1 de la 5, 6 si 7”; „mentioneaza ca explicarea se cere la alte clase mai mici deci ar trebui ca elevul sa fie capabil si aici.. probabil”; „folosim etichetarea/notarea oficiala”. Instrucțiunile: `_campaign/isj_aliniere_2026_10_01/BRIEF_COMUN.md` și `contract.md`. Modelul: VIII/1 (`lectii/viii/m1-l01/surse.md`, „Materialele ISJ” și „Literele oficiale”).

**Sursele, citite pe 01.10.2026 (citatele sunt copiate din ele):**
- **[MO-A2]** OMEC 4.615/2026, anexa 2, Monitorul Oficial nr. 674 bis/14.VIII.2026, pag. 14 (citită ca imagine), tabelul „Niveluri de dezvoltare a competențelor”: **„A Avansat”, „B Consolidat”, „C De bază”, „D1 În formare”, „D2 În dificultate”**. D1: „nevoie de sprijin educațional constant și individualizat în învățare, care poate avea loc la nivelul clasei”; D2: „nevoie de sprijin educațional specializat în învățare, care trebuie să aibă loc extern clasei”. Descrierea generală a nivelului Avansat („…generalizându-le, modelându-le și transferându-le în contexte complexe. Ei sunt autonomi în învățare.”) nu cere explicația.
- **[MO-A15]** anexa 15, clasa a VII-a, CS 2.1 („Analizarea enunțului unei probleme simple în vederea rezolvării ei printr-un algoritm”), descriptorul Avansat: „Elevul analizează, independent, enunțuri ale unor probleme, pentru a identifica și clasifica datele utilizate de algoritmul corespunzător, în date de intrare, de ieșire și de manevră, precizând tipurile acestora/variabilelor corespunzătoare **și justificând rolul acestora**, în contexte noi” (`C:\00\AI_0\knowledge\legal_corpus\primary_law\standarde_evaluare_informatica_tic_V-VIII_2026.txt`, r. 855-862). „Justificând” mai apare doar la clasa a V-a, CS 2.2 (r. 221).
- **[ISJ-2]** CNCE, `Classroom_ISJ_2026-2027\_date\text\A_2026-2027\2_CNCE_materiale_suport\Prezentari_generale_CNCE\02_Prezentare_SNE_primar_gimanziu.pptx.txt`: „Cinci niveluri pentru a descrie progresul”; „Utilizarea SNE în evaluare nu conduce direct la notă”.
- **[ME]** răspunsul Ministerului Educației și Cercetării din 28.07.2026, citat în `Info_Gimnaziu_2026/SISTEM_EVALUARE.md` §1: „Nu există un document oficial care să stabilească transformarea nivelurilor de performanță în note”.
- **[ROFUIP]** `C:\00\AI_0\knowledge\legal_corpus\primary_law\rofuip_2024.txt`, art. 106 alin. (10): „Elevii vor beneficia pe parcursul unui an școlar de cel puțin un plan individualizat de învățare, elaborat în urma evaluărilor susținute și după interpretarea rezultatelor de către cadrul didactic…”.
- Foaia testului inițial pe care o au elevii, `Info_Gimnaziu_2026/materiale/print/Saptamana1_clasa_VII.html`, folosește încă inițialele vechi (B pentru De bază, C pentru Consolidat, A pentru Avansat; exercițiile 1-2 marcate B, 3-4 marcate C, 5 marcat A) (generatorul îl schimbă dirijorul, contractul R3).

**Ce am schimbat în `index.html`:**

| Loc | Înainte | Acum | Sursa |
|---|---|---|---|
| P2 „Cele trei niveluri”, textul | „pe trei niveluri”; Avansat: „rezolvi singur o situație nouă și explici de ce”; „Nivelurile vin de la minister” | „Pentru tot ce înveți, Ministerul Educației și Cercetării descrie trei niveluri” + definițiile brief-ului: C · De bază „rezolvi după un model sau după pașii dați, la lucruri pe care le-ai mai făcut”, B · Consolidat „rezolvi singur, la lucruri de felul celor exersate”, A · Avansat „rezolvi singur, după cerință, o situație pe care n-ai mai văzut-o”; „Explicația („de ce”) nu intră în definiție, dar la clasa a VII-a ministerul chiar o cere când analizezi datele unei probleme: să justifici rolul lor.”; „În total, ministerul numește cinci niveluri: încă două sub De bază.” | [MO-A2], [MO-A15], [ISJ-2] |
| P2, „Uite cum”, „Altfel”, „Încearcă”, „Încă” | metoda „E ceva nou și trebuie să explic? Avansat”; bicicleta „îi explici fratelui…”; „link ciudat și explici ce faci”; Ionuț „n-a explicat nimic” | „E o situație nouă, pe care o rezolv singur? Avansat”; „mergi singur pe un drum pe care n-ai mai fost”; „hotărăști singur ce faci”; Ionuț fără explicație (Consolidat pentru că situația nu e nouă) | [MO-A2] |
| P3 „Cum arată o lucrare” | „Partea A, 40 … (De bază)”, „Partea C, 20 … (Avansat)”; „Atenție la litere … literă mică, cu alt rost (inițialele)” | „are trei părți, de la ușor la greu”: **Partea C, 40 (De bază); Partea B, 30 (Consolidat); Partea A, 20: situație nouă și explicație (Avansat)**; „Părțile și explicația de la A sunt regula profesorului tău.”; „Literele: fiecare parte poartă litera nivelului pe care îl verifică, ca la minister. Pe foaia testului de la prima oră, literele B și C erau inversate; de acum se folosesc cele ale ministerului.” (**DEPĂȘIT 01.10.2026, după-amiaza**: incomplet; vezi „Nota despre literele vechi, refăcută + nota 1”, mai jos) | [MO-A2]; decizia profesorului 01.10 |
| P3, „Încă” 1 | „Partea A verifică Avansat, pentru că A vine de la «Avansat»” → Fals (acum ar fi adevărat) | „Partea A e prima pe foaie și are cele mai multe puncte, pentru că A e prima literă din alfabet” → Fals (A = Avansat, 20 p, ultima; 40 p are partea C) | |
| P4 „Din puncte, nota” | „A + B + C + 10”; „Pe scurt” era în P5 | „C + B + A + 10”; **„Pe scurt” mutat aici** (fără „(și pe fișa din caiet)”, ca pasul să rămână sub 110 cuvinte), iar clasificarea „Ce se trece în catalog” trece din P5 în P4 („Încă” 3), cu indiciul „Recitește caseta «Pe scurt» și propoziția despre lucrarea copiată” | regula profesorului (29.09) |
| P5 „Din notă, nivelul” | „Din notă îți afli nivelul…”; „Sub 5 primești și un plan de recuperare” | „Niciun document oficial nu leagă nivelul de notă. Regula profesorului tău: nivelul se citește din notă.” + tabelul; „Ultimele două arată ce sprijin îți trebuie: ajutor doar pentru tine, care se poate da la oră (În formare), sau ajutor special, în afara orei (În dificultate).”; „Fiecare elev primește, pe an, cel puțin un plan individualizat de învățare: pașii lui următori. Sub nota 5, pașii te duc la De bază.”; „Părțile arată ce ai de lucrat.” | [ME], [ISJ-2], [MO-A2], [ROFUIP] |
| „după regula profesorului” | lipsea | P5: „Uite cum”, enunțul și indiciul „Încearcă”, „why” la Ema, indiciul și „why” la Vlad; întrebarea 3: enunț, indiciu și „why”; laboratorul, pasul 3; obiectivul și rezumatul diplomei | [ME], [ISJ-2] |
| „plan de recuperare” (4 locuri) | P5 text, „why” la Ilinca, întrebarea 3 (Denisa), laboratorul pasul 3 | „plan individualizat de învățare” (P5, laborator: „Fiecare elev primește, pe an, cel puțin un plan individualizat de învățare”; Ilinca: „pașii planului ei individualizat de învățare o duc spre De bază”; Denisa: „planul ei individualizat de învățare o duce spre De bază”) | [ROFUIP] |
| Întrebarea 5 | „lângă o cerință din partea B scrie mic «C (15 p)». Ce înseamnă C?” → „Nivelul cerinței: Consolidat” (schema inițialelor) | „Pe foaia lucrării, prima parte e «PARTEA C (40 p)». Ce nivel verifică?” → „De bază: exerciții cu model” | [MO-A2] |
| Etichetele nivelurilor (pasul 2, atelierul, fișa de pornire) | „De bază”, „Consolidat”, „Avansat” | „C · De bază”, „B · Consolidat”, „A · Avansat”; cheile interne `b`/`c`/`a` au rămas (sunt și în fișele salvate ale elevilor) | [MO-A2] |
| Laboratorul, pașii 2-3 („Verifică-te”); diploma; obiectivul; ancora | definițiile vechi; „A + B + C”; „părțile A, B, C”; „anexa 15” | definițiile brief-ului; „C + B + A + 10”; „părțile C, B, A”; „citești nivelul din notă (regula profesorului)”; „anexele 2 și 15” | |

**Conversia punctelor** (vechiul A ↔ noul C, B rămâne; scrise în ordinea C, B, A): Cristi 30/22/10, Ioana 35/25/18, „Uite cum” 31/21/6, Maria 34/25/17, Bianca 35/24/16, Dan 38/28/18, Ema 20/12/18, Radu 25/20/10, Ilinca 15/8/2, Vlad 15/30/20 (de două ori), Irina 38/29/12, Paul 25/28/19, Ștefan 22/14/9, Denisa 10/5/16, Tudor 30/18/7. Aceleași puncte pe aceleași niveluri, deci aceleași punctaje, note și niveluri; s-a schimbat doar litera, iar textele care o numesc spun acum adevărul: „pierdut 9 la C, 9 la B și 14 la A → de lucrat la partea A”; Ema „chiar cu 18 la A”; Vlad „toate punctele la A … e Avansat?” → Fals, și „de lucrat la partea C (25 pierdute)”, cu varianta greșită „La partea A: … îi lipsește Avansatul”; Irina „cu 12 la A”, Denisa „cu 16 la A”.

**Ce NU am schimbat** (decizia profesorului din 29.09.2026): nota = punctaj : 10; punctele pe nivel (De bază 40, Consolidat 30, Avansat 20, oficiu 10); notă → nivel 9-10 / 7-8 / 5-6 / 3-4 / 1-2; cel puțin o notă în fiecare modul; testul inițial nu se notează; atelierul (itemii profesorului).

**Probele, după modificări (rețeaua blocată, regula 24):** `_campaign/isj_aliniere_2026_10_01/oracol_m1l01.py vii/m1-l01` → 0 (înainte: 13); `verifica_regula.py` → 0; `verifica_lectie.py … --fara-t1` → 0; `jocuri/_motor/test_joc.py --dir …/lectii/vii m1-l01` → TRECUT (28 de întrebări; doar „1 niveluri”); scriptul inline trece `node --check`. `_proba/proba_regula_noua.py` trecut pe ordinea C, B, A (`TRIPLET` = „… la C, … la B și … la A”, maximele C 40 / B 30 / A 20; în plus numără orice enunț rămas pe schema veche „… la A, … la B și … la C”) → 0 nepotriviri (16 triplete de puncte recalculate, 13 rezultate din A6 comparate). `_proba/proba_ui_l01.py` (390 px cu atingere + 1280 px) → 0: Vlad „La partea C:”, ce se notează în P4, caseta „Pe scurt” în P4, „plan individualizat de învățare” în P5, întrebarea 5 „De bază: exerciții cu model”. Cifrele exacte: secțiunea „Porțile (01.10.2026)” de la sfârșit.

**Cuvinte:** fiecare pas sub 110 (oracolul numără și semnele izolate); drumul obligatoriu a crescut de la 1.497 la aproximativ 1.575 de cuvinte (`_proba/cuvinte.py` → 1, peste ținta de ~1.500): faptele cerute (definițiile ministerului, explicația la clasa a VII-a, cinci niveluri, a cui e regula, planul pentru fiecare elev, literele) nu încap în aceleași cuvinte. De hotărât de dirijor dacă se taie din altă parte (laboratorul, întrebările), unde n-am umblat.

**Unde am ezitat:** (1) propoziția CNCE „Nivelurile diferă prin cât ajutor ai, cât de nouă e situația și cât de variat e ce faci” n-am pus-o: pasul 2 ar fi trecut de 110, iar în „Uite cum” ar fi urcat drumul obligatoriu cu încă 18 cuvinte. (2) La clasa a VII-a explicația e cerută chiar de standardul clasei (CS 2.1), deci n-am mai scris „la clase mai mici… probabil”; clasa a V-a (CS 2.2) n-am pomenit-o, din lipsă de loc. (3) „În formare” e descris ca ajutor „care se poate da la oră” (anexa 2: „care poate avea loc la nivelul clasei”), nu „care se dă la oră”.

### Nota despre literele vechi, refăcută + nota 1 (01.10.2026, după-amiaza; bucla de critici, sarcinile G1 și G2)

**G1.** Paragraful „Literele” spunea doar „Pe foaia testului de la prima oră, literele B și C erau inversate”. Foile date la prima oră (Info_Gimnaziu_2026, `git show c706158:materiale/print/Saptamana1_clasa_VII.html`) au însă pagina „Cum se transformă în notă” (a 2-a, se lipește în caiet): „A · ca la clasă, cu model · 40”, „B · singur, situație cunoscută · 30”, „C · situație nouă + explicație · 20”; testul (pagina a 3-a): „B = De bază · C = Consolidat · A = Avansat”. Lecția publicată până pe 01.10 (`HEAD` `eab6aa4d`) chiar învăța: „„Partea A” e partea de bază, nu „A de la Avansat””. Deci la părți s-au schimbat între ele A și C, la test B și C; nota veche îi lăsa elevului impresia că partea A a rămas la fel.

**G2.** ROFUIP art. 106 alin. (9) (`rofuip_2024.txt` r. 656) vorbește doar de fraudă; lucrarea nepredată nu apare în regulament. „Lucrarea nepredată = nota 1” e regula profesorului (`SISTEM_EVALUARE.md` §4.2; grila lui din 06.09.2026: „1 la lucrare nepredată sau fraudă”; `REGULA_NOUA.md` §1). Pagina o spunea fără autor; acum o atribuie, ca lecțiile 1 V, VI, VIII, fișele de criterii (§6) și `SISTEM_EVALUARE.md`.

| Unde | Înainte | Acum |
|---|---|---|
| P3 text, paragraful „Literele” | „Literele: fiecare parte poartă litera nivelului pe care îl verifică, ca la minister. Pe foaia testului de la prima oră, literele B și C erau inversate; de acum se folosesc cele ale ministerului.” | „Literele sunt ale ministerului. Pe fișa din caiet și în lecție, până pe 1 octombrie, partea A era cea cu model (40 p), iar C cea cu situația nouă (20 p). Pe testul de la început, B și C erau inversate.” („fiecare parte poartă litera nivelului” a ieșit ca să încapă nota; lista de deasupra o arată: „Partea C, 40 de puncte: cu model (De bază)” …; indiciul de la „Încă” 1 trimite tot la „paragraful «Literele»”) |
| P4 text | „Copiatul sau lucrarea nepredată: nota 1.” | „Copiatul: nota 1; după regula profesorului, și lucrarea nepredată.” |

Cuvinte (oracolul, rețeaua oprită): P3 101 → **109**, P4 106 → **109**; drumul obligatoriu crește cu ~11 cuvinte (cât permite decizia „drumul poate crește puțin, cât fiecare pas rămâne ≤110”). Fișierele de dinainte: `C:\00\_bucla_backups\2026-10-01_G1G2_notare\LearningHub\lectii\vii\m1-l01\` (în afara depozitului). `afirmatii.json`: A6 și „actualizat”; `profil.json`: lucrarea (pasul 3) și nota (pasul 4).

## Regula de notare nouă (29.09.2026)
Decizia profesorului din 29.09.2026: **nota = punctaj : 10**, **nivelul se citește din notă**, **cel puțin o notă pe modul (cel puțin 5 pe an)**. Sursele, în ordinea priorității: `Info_Gimnaziu_2026/SISTEM_EVALUARE.md` §3-4 și `instrumente/Fisa_criterii_elev_clasa_VII.md` §4-5 (deja rescrise), apoi `_campaign/notare_punctaj_2026_09_29/REGULA_NOUA.md` §1-3. Lecția nu spune că regula s-a schimbat și nu pomenește regula veche.

Ce am schimbat și unde (`index.html`):
- **Pasul 4, „Din puncte, nota”** (înainte „Din puncte, nivelul”): punctajul = A + B + C + 10 din oficiu; nota = punctaj : 10; rotunjirea la cel mai apropiat număr întreg, la ,5 exact în sus, în favoarea elevului (82 → 8, 68 → 7, 85 → 9); copiatul sau lucrarea nepredată: nota 1 (REGULA_NOUA §1, SISTEM_EVALUARE §4.2). „Uite cum”: 31 + 21 + 6 + 10 = 68 → 7 (exemplul din SISTEM_EVALUARE §4.4). „Altfel”: virgula pusă înaintea ultimei cifre, apoi rotunjirea. „Încearcă”: Maria 34 / 25 / 17 → 86 → 9, cu capcanele „tăiat, nu rotunjit” (8), „fără oficiu” (7), „nerotunjit” (8,6), „punctajul în loc de notă” (86). „Încă un exercițiu”: Bianca 35 / 24 / 16 → 85 → 9 (capcana: 8, rotunjit în jos sau fără oficiu); Sorin, 74 de puncte → nota 7, deci „nota 8, în favoarea elevului” e fals.
- **Pasul 5, „Din notă, nivelul”** (înainte „Din nivel, nota”): 9 sau 10 Avansat, 7 sau 8 Consolidat, 5 sau 6 De bază, 3 sau 4 În formare, 1 sau 2 În dificultate; sub 5, plan de recuperare; părțile A, B, C arată unde ai pierdut puncte, deci ce ai de lucrat (SISTEM_EVALUARE §4.2-4.3, fișa §4). „Uite cum”: același elev, nota 7, Consolidat, a pierdut 9 / 9 / 14, deci are de lucrat la C (ca feedbackul din SISTEM_EVALUARE §4.4). „Încearcă”: Dan 94 → 9 Avansat, Ema 60 → 6 De bază (cu 18 la C: capcana „nivelul după partea C”), Radu 65 → 7 Consolidat (rotunjit în jos ar fi 6, De bază), Ilinca 35 → 4 În formare. „Încă un exercițiu”: **Vlad (15 la A, 30 la B, 20 la C)**: „Vlad e Avansat” → Fals, 75 → 8, Consolidat; apoi „la ce are de lucrat” → partea A (a pierdut 40 − 15 = 25 de puncte), ca elevul cu 25 / 28 / 19 din SISTEM_EVALUARE §4.4; variantele greșite au și ele socoteala lor, fiecare cu o greșeală tipică (40 luat ca maxim la B; nivelul care „lipsește” luat drept parte; „nota e bună, deci nimic”); apoi ce se notează (testul de început nu; lucrarea, proiectul făcut la oră și lucrarea copiată, cu nota 1, da).
- **„Pe scurt”** (pasul 5): „primești cel puțin o notă în fiecare modul, deci cel puțin 5 pe an, din lucrări sau din proiecte făcute la oră. O singură medie anuală, la ,50 rotunjită în sus. Testul de la început nu se notează.” (fișa §5-6, REGULA_NOUA §3). Fără împărțire pe lucrări / produse / portofoliu. Propoziția „pe foaie poate scrie alt calcul” a ieșit: foile și regula spun acum același lucru.
- **Întrebarea 3**: Irina 89 → 9 Avansat (cu 12 la C), Paul 82 → 8 Consolidat, Ștefan 55 → 6 De bază (,5 în sus), Denisa 41 → 4 În formare (cu 16 la C). **Întrebarea 4**: Tudor 30 / 18 / 7 → 65 → 7 (capcanele: 6 = ,5 rotunjit în jos sau fără oficiu; 6,5; 65; 5).
- **Laboratorul, pasul 3**: „Scrie cum afli nota din puncte și nivelul din notă”, cu „Verifică-te” pe regula de mai sus. Ceilalți pași ai laboratorului, atelierul și identitatea elevului: neatinse.
- **Obiectivul, rezumatul diplomei**: „transformi punctele unei lucrări în notă, citești nivelul din notă”.
- **Legenda pozei din pasul 0**: „cerințele fiecărei centuri se știu dinainte” (a ieșit „centurile se iau una după alta”, care sugera urcarea pe trepte ca regulă de nivel).
- Literele mici B / C / A de lângă cerințe (pasul 3, întrebarea 5) au rămas: arată nivelul cerinței, nu nota. **Depășit 01.10.2026:** lecția folosește literele anexei 2 (A = Avansat, B = Consolidat, C = De bază), iar litera părții e litera nivelului; vezi secțiunea de sus.

`afirmatii.json` → A6: lista nouă de rezultate, probată de `_proba/proba_regula_noua.py` (→ 0): scriptul ia configurația din pagină (rețeaua blocată), citește punctele din enunțuri, le recalculează cu regula din REGULA_NOUA §1-2 scrisă în script (fără să citească cheile) și compară cu cheia fiecărui exercițiu, cu numerele din explicații și cu lista din A6. Proba probei: cu cheia lui Tudor schimbată în 6, scriptul dă 1 („Î4: cheia 6, calculat nota 7”); pagina a fost pusă la loc și comparată octet cu octet. Vechea probă A6 din `proba_afirmatii.py` e scoasă. `profil.json`: rândurile pașilor 4-5 și „Pe scurt” pe regula nouă, plus „modulul” la ce știe elevul.

Drumul obligatoriu: **1.492 de cuvinte** (înainte 1.498; `_proba/cuvinte.py` → 0). Pasul 4 are 70 de cuvinte, pasul 5 are 100. După reparațiile de mai jos: vezi „Porțile (29.09.2026)”.

### Reparațiile după judecata pe regula de notare (`_verificare/judecator_notare.md`: 0 GRAV, 0 MAJOR, 6 MINOR)
- **m1, rotunjirea nu era verificată în „Încearcă”:** Maria e acum 34 / 25 / 17 → 86 → 8,6 → **9** (tăiat ar da 8; capcana „8” spune „nu tai virgula”). Radu e acum 25 / 20 / 10 → 65 → 6,5 → **7, Consolidat** (rotunjit în jos: 6, De bază). Explicațiile, capcanele și A6 din `afirmatii.json` sunt refăcute. `proba_regula_noua.py` cere acum ca rotunjirea să conteze la pașii 4 și 5.
- **m2, „nota 8” respins și exemplul „72”:** în tipul `numar` al lecției (nu în motor), un cuvânt înaintea numărului e primit („nota 9” → 9), iar la eticheta „Nota” mesajul e „Scrie nota doar cu cifre (de exemplu 10)”. Am ales 10, nu 7: 7 e răspunsul întrebării 4, iar 10 nu e nici răspunsul, nici capcana vreunui exercițiu cu nota.
- **m3, introducerea:** „Afli ce faci la TIC anul acesta, cum iei nota și ce sunt cele trei niveluri, apoi …” (fără legătura nivel → notă).
- **m4, „din oficiu”:** pasul 3, „Plus 10 puncte din oficiu (le primești oricum): în total, 100.”
- **m5, Vlad:** variante paralele, fiecare cu socoteala ei: „La partea A: a pierdut 40 − 15 = 25 de puncte” (bună), „La partea B: are 30 din 40, deci a pierdut 10” (maximul greșit), „La partea C: nota 8 e Consolidat, deci îi lipsește Avansatul” (nivelul luat drept parte), „La nimic: 15 + 30 + 20 + 10 = 75, nota 8, e bine”. Proba cere ca nicio variantă greșită să nu numească partea A și ca toate să aibă cifre.
- **m6, `surse.md`:** rândurile din „Forma, după judecata 2” sunt la zi. `_proba/oracol_surse.py` aplică tiparele oracolului (importate din `verifica_regula.py`) pe `surse.md` → 0.

## Programa și locul în an
- `C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json`: VII-E0 „Deschiderea anului. Cum se învață și cum se notează”, CS.1.1, o oră: lecția 1 (organizare + evaluare inițială), materialele `fisa_criterii` și `test_initial`.
- `planificari/Proiectul_unitatii_VII-E0.md`: aceeași oră, cu CS.1.1 și descriptorii ei.
- Calendar: `Calendar_ore_7_MA.md` (Brauner, 11.09.2026), `Calendar_ore_VII_A.md` și `Calendar_ore_VII_B.md` (Izvoare, 08.09.2026). **Pentru Tupilați nu există Calendar_ore.**
- Programa nu are conținut pentru ora de organizare. De aceea nivelul are `continuturi:[]` (excepția `-E0` din `test_joc.py`), fără nicio ocolire.

## Forma, după judecata 2 (decizia dirijorului)
- **Pasul 0 și 5 pași:** unitățile anului, cele trei niveluri, lucrarea, nota din puncte, nivelul din notă. Pasul 6 de odinioară („Câte note iei și regulile”) e acum rezumatul „Pe scurt” din pasul 5 (conținutul lui, din 29.09: vezi secțiunea de sus). Rezumatul trimite la fișa de criterii din caiet.
- **Laboratorul are 5 pași:** titlul în caiet, nivelurile, nota din puncte și nivelul din notă, copierea fișei de pornire, recitirea (cel mult trei legături, doar de citit).
- **„Cine dă evaluarea?” stă la ÎNCEPUTUL atelierului**, nu în laborator. Caseta din pagină citește starea din `prezenta.js` (`Prezenta.stare()`: `activ` / `intreaba` / altfel) și spune ce face elevul înainte să răspundă:
  - dacă lucrează ca altcineva: „Nu ești tu? Schimbă elevul”;
  - dacă e întrebat „Ești tot …?”: „Da, sunt eu” / „Nu, sunt alt elev”;
  - dacă nu e înscris: „Spune cine ești” / „Cine lucrează acum?”.

  Numele e scurtat ca în caseta de jos („Ana P.”). Tot acolo scrie că **caseta de jos se ascunde când ar acoperi un buton** (`prezenta.js`, `fereste()`: „mini ferit”) și că reapare dacă derulezi până la capătul paginii. Probat pe telefon: în laborator caseta era ascunsă peste o legătură, iar la capătul paginii se poate apăsa.
- **Drumul obligatoriu are 1.498 de cuvinte** (≈ 12 minute de citit, la 120 de cuvinte pe minut; judecata 2 măsurase ≈ 2.540). Numărătoarea e făcută cu `_proba/cuvinte.py`.
  - Intră: intro, „cum”, textul pașilor cu legenda pozei, „Uite cum” (e afișat din oficiu), „Încearcă” (enunț + variante), atelierul (intro, caseta „Cine dă evaluarea?” în forma pentru elevul neînscris, exercițiile), laboratorul (fără „Verifică-te”), cele 5 întrebări.
  - Nu intră: „Altfel”, „Încă un exercițiu”, indiciile, explicațiile de după răspuns, proba de a V-a, etichetele testelor, fișa de pornire.

## Ce am luat din documentele profesorului (au prioritate)
| În lecție | Sursa |
|---|---|
| Pasul 1: cele patru unități, în ordine | `unitati.json` VII-U1…U4; `Fisa_criterii_elev_clasa_VII.md` §1 |
| Pasul 2: cele trei niveluri; „diferența e aproape mereu situația nouă” | Fișa §2; `Saptamana1_clasa_VII.html`; `SISTEM_EVALUARE.md` §2; standardele (Ordinul 4.615/2026, anexa 15) |
| Pasul 3: părțile A 40 / B 30 / C 20 + 10 din oficiu; literele mici B / C / A de lângă cerințe. **01.10.2026:** părțile C 40 / B 30 / A 20 (literele anexei 2), fără literele mici | Fișa §3; `SISTEM_EVALUARE.md` §4.1; foile `Test_V-U1.html` și `Saptamana1_clasa_VII.html`; din 01.10, OMEC 4.615/2026 anexa 2 |
| Pasul 4 (29.09): nota = punctaj : 10, rotunjirea (la ,5 în sus), copiatul / nepredată = nota 1. **01.10.2026:** și „Pe scurt” (mutat din pasul 5) | Fișa §4, §6; `SISTEM_EVALUARE.md` §4.2, §4.4 |
| Pasul 5 (29.09): nivelul din notă; plan de recuperare sub 5; părțile arată ce ai de lucrat; „Pe scurt” (cel puțin o notă pe modul, cel puțin 5 pe an). **01.10.2026:** regula notă → nivel e a profesorului; D1/D2 cu sprijinul lor; „plan individualizat de învățare” pentru fiecare elev | `SISTEM_EVALUARE.md` §1, §3, §4.2-4.4; Fișa §4-6; din 01.10, anexa 2, ROFUIP art. 106 alin. (10) |
| Atelierul: evaluarea inițială | `materiale/continut/teste_initiale.json` → `teste.VII` (ca pe foaia `Saptamana1_clasa_VII.html`) |

## Evaluarea inițială: cum am făcut-o corectabilă de elev (fără să schimb ce verifică)
Itemii și cheile sunt ale profesorului. Formele deschise le-am făcut alegeri sau răspunsuri scurte:
1. **A/F (De bază):** aceleași 5 afirmații și aceeași cheie.
2. **Completează (De bază):** aceleași 3 goluri. Primesc și răspunsuri fără diacritice și „slide-uri”.
3. **Suma 1…10 (Consolidat):** algoritmul se construiește din linii, cu capcane (s ← 1, s ← s + 1, pentru … 5). **Am adăugat** întrebarea „ce număr scrie la final” (55), care nu e pe foaie.
4. **Prezentarea de 5 minute (Consolidat):** primesc orice număr de la 5 la 8, ca în cheie, iar alegerile sunt primul diapozitiv, încheierea și ideile scurte.
5. **E-mailul „Ai câștigat un telefon!” (Avansat):** bifezi ce faci (4 bune, 3 greșeli tipice), apoi alegi motivul. Variantele greșite sunt credibile.
- **Proba din clasa a V-a** („Încă un exercițiu”) **NU e a profesorului.** E făcută după planul clasei a V-a și după jocurile de pe sit, iar **nivelurile ei le-am pus eu**.
- **Fișa de pornire** reține ce a trecut elevul de la prima apăsare pe „Verifică”, ce are de recitit (legături „doar recitire”) și ce **nu** a verificat proba. Nu dă nici nivel, nici notă.

## Reparațiile după judecata 2 (1 GRAV, 3 MAJOR, 3 MINOR) și după mesajele dirijorului
| Ce | Unde |
|---|---|
| **REGULA 24.** Toate probele merg pe `http://127.0.0.1:<port>` și trec printr-un singur context de browser, cu `ctx.route("**/*", … r.continue_() if "127.0.0.1"/"localhost" … else r.abort())`. Cererile oprite se numără (`raport_retea()`). Scripturile de depanare care încărcaseră elevi falși fără blocare sunt șterse. | `_proba/_gesturi.py` (`blocheaza_retea`, `context_nou`); toate `proba_*.py`, `cuvinte.py`, `jocuri_v_vi.py` |
| **GRAV (partea mea).** Identitatea se cere acum la ÎNCEPUTUL evaluării: caseta „Cine dă evaluarea?” e sus în atelier. Pasul din laborator nu mai cere înscrierea după evaluare. | `cineHtml()`, `umpleCine()`, `TipEval.render`; `LABORATOR` |
| **GRAV (restul) + MAJOR 1** („al cui e rezultatul”). Codul meu de fișă și de identitate e **scos** și înlocuit cu componenta comună `lectii/_sim/rezultat-elev.js`, fără logică paralelă. Cheile sunt `vii-m1-l01-initiala` și `vii-m1-l01-proba-v`, iar `RezultatElev.salveaza()` se cheamă la prima apăsare pe „Verifică” a fiecărei evaluări. Fișa se desenează din `citeste()` la evenimentul `rezultat-elev`. Butonul „Începe o fișă nouă (sunt alt elev)” e `golesteAlElevuluiDeAcum()`, iar caseta „Cine dă evaluarea?” folosește `cine()`. Verificările se anunță componentei de la încărcare, ca întrebarea „Verificarea de la ora hh:mm e a ta?” să apară imediat după reîncărcarea de la înscriere. Probat pe ambele drumuri ale judecății 2 (mai jos). | `<script src="../../_sim/rezultat-elev.js">`; `fisaHtml()`, `cineHtml()`, `TipEval.verifica()` |
| **MAJOR 2.** 5 pași după pasul 0; laboratorul are 5 pași; drumul obligatoriu, 1.498 de cuvinte. Întrebarea 5 (media anuală, fără exercițiu acum) e înlocuită de o variantă-soră a exercițiului cu literele: „lângă o cerință din partea B scrie mic «C (15 p)». Ce înseamnă C?” | pașii 1-5; `LABORATOR`; întrebarea 5 |
| **MAJOR 3.** Rețeaua blocată în probe (vezi regula 24). | `_proba/` |
| **m1.** „În dificultate: 2 dacă ai lucrat, 1 dacă n-ai predat sau ai copiat” (totalul nu alege aici) | pasul 5; „Verifică-te” din laborator |
| **m2.** Numele scurtat e „Ana P.” (prenumele + inițiala numelui), ca `scurt()` din `prezenta.js`. Probele folosesc nume ca în catalog („Pop Ana”). | `scurtNume()`; `_proba/proba_caseta.py` |
| **m3.** Legăturile din teste și din fișă au culoarea temei. Contrastul măsurat (`_proba/proba_intunecat.py`): cel puțin 6,68:1 în tema întunecată și 5,53:1 în cea luminoasă. | CSS `.ei-fisa a, .ei-teste a, .ei-mesaj a` |

Reparațiile după judecata 1 (Coșul, literele, numerele primite cu bunăvoință, variantele credibile, `?recitire=N`, „Proba nu a verificat” și celelalte) rămân. Lista lor e în `_verificare/judecator.md`.

## Regula 24: ce rulări ale mele au putut trimite cereri spre teste-vasile.netlify.app
Rulările de mai jos au încărcat `prezenta.js` cu elevi falși, **fără blocare**. Au mers pe `file://` sau pe `http://127.0.0.1`, deci cererile spre `teste-vasile.netlify.app/api/activitate` au putut pleca:
- `proba_doi_elevi.py`, scenariul B, pe 27.09, în jurul orei 23:44, apoi pe 28.09 în jurul orelor 00:00-00:25 (cam 5 rulări). Elevii: **„Ana Pop”** (id `t_ana`, numeEnc `x`) și **„Bogdan Ene”** (id `t_bog`, numeEnc `y`), școala „Tupilați”, clasa „VII”. La prima rulare, identitatea era „Ești tot…?” (`ultima: 0`), iar în starea asta `prezenta.js` nu trimite activitatea.
- `depanare_inscris.py` (șters), 2 rulări pe 27.09, în jurul orei 23:57: **„Ana Pop”** (id `t_ana`, numeEnc `x`), „Tupilați”, „VII”.
- `proba_caseta.py`, cam 5 rulări pe 28.09, între 00:05 și 00:25: **„Ana Pop”** (id `t_ana`, numeEnc `enc_t_ana`) și **„Bogdan Ene”** (id `t_bog`, numeEnc `enc_t_bog`), școala `tup` („Școala Tupilați”), clasa „VII”.
- Numele nu pleacă în clar, ci doar `numeEnc`, iar ale mele nu erau criptate cu cheia diplomelor. **`activitate.py lista` (28.09) nu are nicio intrare la Tupilați sau la clasa a VII-a.** „Ana Pop” și „Dan Ene” de la Brauner, 8 A, nu vin din rulările mele: altă școală, altă clasă, iar „Dan” nu l-am folosit niciodată.
- Cu blocarea pusă, probele încearcă în continuare să trimită, dar nimic nu pleacă. La ultima rulare (după componenta comună), `proba_doi_elevi.py` a încercat 4 cereri spre teste-vasile, iar `proba_caseta.py` 23. Toate au fost oprite.

## Reparațiile după judecata 3 (1 GRAV în componentă, 5 MINOR în lecție)
- **GRAV** (doi elevi neînscriși în aceeași filă): l-a reparat dirijorul în `rezultat-elev.js` v2, fără schimbare de API. Lecția n-are logică proprie. Am probat-o în `proba_doi_elevi.py`, cazul D: Ana (vizitator) greșește, pagina se reîncarcă în aceeași filă, iar Bogdan e întrebat „Ai dat-o tu pe cea de la ora …?”. La „Nu”, evaluarea lui e prima lui încercare (5 × ✔, fără „Ai refăcut”).
- **m1:** în starea „vizitator”, caseta „Cine dă evaluarea?” numește eticheta de jos: „Sunt elev — mă înscriu” (`cineHtml()`).
- **m2:** „Pe scurt” spune din nou „Testul de început nu se notează.”, pentru că indiciul trimite acolo (pasul 5). Ca să rămână drumul obligatoriu la 1.498 de cuvinte, am scurtat altundeva: întrebarea 2 și propoziția despre caseta ascunsă.
- **m3:** „Ana P.” fără al doilea punct (`cuPunct()`), iar „de 1 ori” a devenit „o dată” (`oriText()`: „o dată”, „de 2 ori”, „de 20 de ori”).
- **m4:** diploma nu mai spune „cum se face media anuală”.
- **m5** (Bogdan ignoră avertismentul): îl acoperă componenta v2 prin „Ești X?” la prima salvare pe un nume. Textele lecției nu contrazic asta. Caseta de sus spune pe cine arată caseta de jos. Fișa fără nume spune că întrebarea vine după înscriere. Fișa care așteaptă „Ești X?” (`deConfirmat`) spune că se scrie pe nume abia după răspuns.
- **Probele:** se închid doar cu `ctx.close()` (`_gesturi.inchide()`). Nicio probă nu mai cheamă `page.close()`.

## Componenta `rezultat-elev.js` v3 (finală: sha1 `eb8fdae3…`, cu `prezenta.js` `b098ce99`)
- **Unde `citeste(K)` e `null`**, lecția întreabă întâi `asteaptaConfirmare(K)`. Dacă fișa lui X e pe calculator, dar așteaptă „Ești X?”, scrie „Pe calculator e fișa lui {elev}, de la ora {ora}. Dacă ești {elev}, apasă sus «Da» ca s-o vezi.” și nu „Fișa de pornire e goală… rezolvă evaluarea”, care l-ar trimite pe elev să refacă evaluarea. Asta se aplică în fișa din atelier și în cea din laborator (`fisaHtml()`). Diploma nu desenează fișa.
- **Locul întrebărilor componentei:** `<div data-rezultat-elev-intrebare>` stă sus în atelier, deasupra casetei „Cine dă evaluarea?”, și în laborator, deasupra fișei. Întrebarea apare lângă fișă și nu acoperă exercițiile. Pe celelalte pagini (de exemplu, cuprinsul) stă sus, fixă, cum o pune componenta.
- **Probele noi, în `proba_caseta.py`, pe caseta reală:**
  - **Drumul 4:** Ana răspunde „Da” la „Ești Pop Ana?”. Urmează 8 minute și 30 de secunde fără nicio atingere, pe ceasul simulat (`context.clock`). Fișa spune „Pe calculator e fișa lui Pop Ana … apasă sus «Da»”, nu „goală”. După „Da”, se vede din nou.
  - **Drumul 5**, cele două „Da” la rând: Ana, neînscrisă, greșește, iar în aceeași filă Bogdan răspunde „Da” la „Ești Ene Bogdan?”. A doua întrebare e „Ai deja verificarea … Și cea de la ora … e tot a ta?”, cu „Nu” primul. La „Nu”, fișa lui are 5 × ✔.
  - `proba_doi_elevi.py`, cazul B: la o încărcare nouă, fișa Anei așteaptă „Da”, apoi se vede.

## Judecata 4 (0 GRAV, 0 MAJOR, 1 MINOR): unde apare „Ești X?” după „Verifică”
- **Înainte** (`_proba/proba_intrebare_loc.py inainte`): locul întrebării era la începutul atelierului. După „Verifică”, întrebarea stătea la **−4.198 px** pe telefon (390 px) și la −3.257 px pe calculator (1280 px), adică deasupra ferestrei. Mesajul de sub buton nu pomenea de ea. Mai mult: după „Verifică”, conținutul de deasupra crește (indiciul se deschide, apar mesajele „Recitește”), așa că și butonul, și mesajul ies din ecran.
- **După** (`proba_intrebare_loc.py dupa`):
  - locul întrebării e **sub teste, deasupra fișei**;
  - când `salveaza()` întoarce `deConfirmat`, pagina aduce întrebarea în fereastră (`scrollIntoView`, centrat);
  - mesajul de sub „Verifică” spune „Răspunde întâi la întrebarea «Ești …?», de sub teste: fără «Da», fișa nu se scrie pe numele tău.”

  Întrebarea stă la 309-535 px pe telefon (fereastra are 844) și la 315-484 px pe calculator (fereastra are 800). Testele cu ✗ se văd chiar deasupra ei. Rețeaua a fost blocată, iar pagina s-a închis doar cu `ctx.close()`.

## Contradicții și goluri (pentru profesor; nu le-am rezolvat din imaginație)
1. **Literele.** „PARTEA A” e partea de bază, dar litera mică „A” de lângă o cerință înseamnă Avansat. Lecția le explică pe amândouă. Generatorul de teste nu l-am atins. **REZOLVAT 01.10.2026:** profesorul a ales literele oficiale (anexa 2): partea C = De bază, B = Consolidat, A = Avansat; lecția le folosește și spune că pe foaia de la prima oră B și C erau inversate. Generatoarele și foile le schimbă dirijorul (contractul R3), nu eu. **01.10.2026, după-amiaza:** nota spune acum și ce era la părți (pe fișa din caiet și în lecție, partea A era cea cu model, 40 p, iar C cea cu situația nouă, 20 p); vezi secțiunea „Nota despre literele vechi, refăcută + nota 1”.
2. **„Nota = punctaj : 10”** e pe toate foile. Lecția spunea: „pe foaie poate scrie alt calcul; regula clasei e aceasta”. **REZOLVAT 29.09.2026:** profesorul a hotărât că nota = punctaj : 10; foile și lecția spun acum același lucru, iar propoziția a ieșit din lecție.
10. **Portofoliul (29.09.2026).** `SISTEM_EVALUARE.md` §3 are încă în tabel „Portofoliul elevului — DA, o notă”, dar fișa clasei a VII-a §5 și REGULA_NOUA §3 spun că nota vine „dintr-o lucrare … sau dintr-un proiect făcut la oră”. Lecția urmează fișa (ce lipește elevul în caiet) și nu pomenește portofoliul. De confirmat de profesor.
3. **„Animații”** apare în `teste_initiale.json → verifica`, dar niciun item nu e despre animații. Fișa o spune la „Proba nu a verificat”.
4. **CC nu e predat în jocul `internet-vi`.** Explicația e în fișa de pornire.
5. **„5–8 diapozitive pentru 5 minute”** e regula profesorului, nepredată în niciun joc.
6. **Ultimul diapozitiv:** cheia spune „concluzie / mulțumiri”, iar `prezentari-vi` pune la final „sursele”. Întrebarea e „Cu ce închei prezentarea?”, fără „sursele” printre variante.
7. **Exercițiul 5 (Avansat)** seamănă mult cu `internet-vi`, nivelul 6.
8. **Atelierul are chiar itemii testului de pe foaie.** Dacă pagina ajunge la elevi înaintea foii, diagnosticul se strică.
9. Presupun că elevii de a VII-a au făcut în V-VI aceeași programă (OMEN 3393/2017).

## Materialul refolosit din jocuri
- Termenii evaluării sunt verificați ca predați în jocurile de a V-a și a VI-a (`_proba/cauta_termeni.py`, `jocuri_v_vi.json`).
- Cele 20 de legături `?recitire=N` deschid nivelul promis (`_proba/proba_recitire.py` → 0), pe motorul de pe disc, reparat de dirijor.

## Imaginea
`img/centuri.webp` (850 × 754, 42,6 KB): „File:Obi-gokyū.jpg”, chris 論, CC BY-SA 3.0, doar convertită în WebP. Proveniența e în `img/SURSE.json`.

## Ce n-am putut verifica
- CC, într-o aplicație de e-mail reală (A4 e documentată, nu probată).
- Formularul de înscriere trimis până la capăt („Gata”) cere serverul, iar rețeaua e blocată. Schimbarea elevului din listă e probată pe caseta adevărată.
- Componenta `rezultat-elev.js` n-am modificat-o și nici n-am rulat proba ei (`rezultat_elev_proba.py`), fiindcă e a dirijorului. Am probat-o prin lecție: `proba_caseta.py` și `proba_doi_elevi.py`.

## Porțile (28.09.2026, după judecata 2)
- `test_joc.py --dir …/lectii/vii m1-l01` → **TRECUT** (28 de întrebări jucate; doar avertismentul așteptat, „1 niveluri”).
- `verifica_lectie.py … --fara-t1` → S0, S1, S2, T0 TRECUT (S1: 0 identice, 0 aproape identice; S2: 6 din 6); **ultima linie: 0**.
- Probele, toate cu rețeaua blocată, la 390 px cu atingere și la 1280 px, 0 probleme și 0 erori în consolă: `proba_ui_l01.py`, `proba_recitire.py` (20 / 20), `proba_afirmatii.py`, `proba_intunecat.py` (contrast ≥ 4,5:1), plus:
  - `proba_doi_elevi.py`: altă filă, refacere, fișă nouă, înscriși, „Ești tot…?”;
  - `proba_caseta.py`, pe caseta adevărată: „Schimbă elevul”, apoi drumurile judecății 2. Drumul 1: neînscris → înscriere → „Da, e a mea” → fișa lui, iar refacerea nu dă ✔. Drumul 2: „Ești tot Pop Ana?” fără răspuns → nimic pe Ana → „Nu, sunt alt elev” → Bogdan → „Da”.
- Capturile de telefon privite: `_proba_telefon_fisa_dupa_inscriere.png` (după „Da, e a mea”: 2 × ✗, „Bogdan E.” în caseta de jos) și `_proba_telefon_fisa_bogdan.png`.
- Drumul obligatoriu: 1.498 de cuvinte; 5 pași după pasul 0; laboratorul, 5 pași (`cuvinte.py` → 0).
- Capturile privite: `_proba_telefon.png` și `_proba/_intunecat_tel_fisa.png`.

## Porțile (29.09.2026, după regula de notare nouă)
- `verifica_regula.py` (oracolul lucrării) → 0 urme în `vii/m1-l01` (înainte: 24).
- `test_joc.py --dir …/lectii/vii m1-l01` → **TRECUT** (28 de întrebări jucate; doar „1 niveluri”). Prima rulare a picat: clasificarea „ce se notează” avea 3 rânduri, motorul cere 4; am adăugat „o lucrare copiată” (se notează, cu 1), predată în pasul 4.
- `verifica_lectie.py … --fara-t1` → S0, S1 (0 identice), S2 (6 din 6 aplicare/execuție), T0 TRECUT; **ultima linie: 0**.
- `proba_ui_l01.py` → 0 (rețeaua blocată, închis doar prin `ctx.close()`, 390 px cu atingere + 1280 px): pasul 4 cu 7 (capcana oficiului), 8,2 (nerotunjit), „nota opt”, apoi 8; Bianca 8 → 9; Sorin „Fals”; pasul 5 cu Ema pusă la Avansat (respins), apoi corect; Vlad „Fals”, Vlad „partea A”; ce se notează, întâi greșit, apoi corect; întrebarea 3; întrebarea 4 cu 6 (respins), apoi 7. Capturile privite: `_proba/_tel_pas4_nota.png`, `_proba/_tel_pas5_nivel.png` (scăderile din „Uite cum” nu se mai rup pe două rânduri).
- `proba_regula_noua.py` → 0; `proba_afirmatii.py` → 0; `proba_intunecat.py` → 0; `cuvinte.py` → 0 (1.492 de cuvinte).
- **Reluate după reparațiile m1-m6 (judecata pe regula de notare):** `verifica_regula.py` → 0 (tot situl); `oracol_surse.py` → 0; `test_joc.py` TRECUT; `verifica_lectie.py --fara-t1` → 0; `proba_regula_noua.py` → 0 (cu verificările noi: rotunjirea contează la pașii 4-5, variantele lui Vlad); `proba_afirmatii.py` → 0; `proba_intunecat.py` → 0; `learninghub_date_personale.py` → 0. `proba_ui_l01.py` → 0, cu rețeaua blocată, la 390 px cu atingere și la 1280 px. Maria: 8 („nu tai virgula”), 7, 8,6, „nota opt” („Scrie nota doar cu cifre (de exemplu 10)”, fără 72), apoi „nota 9”, primit. Pasul 5: Radu rotunjit în jos (De bază) e respins. Vlad: „La partea A:”. Drumul obligatoriu: **1.497 de cuvinte** (m3 +2, m4 +3; plafonul e 1.500).

## Porțile (01.10.2026, după alinierea la actele oficiale; rețeaua blocată, regula 24)
- `_campaign/isj_aliniere_2026_10_01/oracol_m1l01.py vii/m1-l01` → **0** (înainte: 13 — schema veche de litere de 7 ori, „cinci niveluri”, „plan de recuperare”, planul pentru fiecare elev, „Niciun document oficial…”, regula profesorului).
- `notare_punctaj_2026_09_29/verifica_regula.py` → 0; `_proba/oracol_surse.py` → 0; `verifica_lectie.py … --fara-t1` → S0, S1, S2, T0 TRECUT, ultima linie 0; `jocuri/_motor/test_joc.py --dir …/lectii/vii m1-l01` → TRECUT (28 de întrebări, doar „1 niveluri”); scriptul inline → `node --check` fără erori; `afirmatii.json`, `profil.json` → JSON valid.
- `_proba/proba_regula_noua.py` → 0. Proba probei (`scratchpad/vii_l01_mutant.py`): Tudor întors pe ordinea veche → 2 nepotriviri („schema veche”, A6 fără Tudor); varianta bună a lui Vlad pusă pe „partea A” → 1; pagina pusă la loc și comparată octet cu octet (sha1 egal).
- `_proba/proba_ui_l01.py` → 0 (390 px cu atingere + 1280 px, 0 erori în consolă); `_proba/proba_afirmatii.py` → 0; `_proba/proba_intunecat.py` → 0. Captura privită: `_proba/_tel_pas5_nivel.png` (P5 cu „Niciun document oficial…”, D1/D2, planul individualizat, „Uite cum” cu C / B / A).
- Cuvinte pe pas, numărate ca oracolul (tokenuri; semnele izolate intră): P2 108, P3 101, P4 106, P5 102; „Uite cum”: 27, 0, 33, 34. Cu `_proba/cuvinte.py` (doar cuvintele): 99, 98, 97, 96. **Drumul obligatoriu: 1.575** (era 1.497; `cuvinte.py` → 1, peste ținta de ~1.500).
- `tools/learninghub_date_personale.py` → 1, dar fișierul semnalat e `_campaign/isj_aliniere_2026_10_01/BRIEF_COMUN.md` (calea scratchpad-ului), nu un fișier al lecției.

## Nota cu munca pe LearningHub, 07.10.2026

**Ce am schimbat în pagină** (brieful `_campaign/nota_site_2026_10_07/BRIEF.md`):
- **Pasul 4 „Din puncte, nota”** (pe bară P5): calculul notei lucrării a rămas; s-a adăugat „La lucrarea de modul contează și munca pe LearningHub: pasul următor.” Ca să rămână sub 110 cuvinte: „Aduni punctele părților și cele 10 din oficiu: C + B + A + 10. Rezultatul e punctajul, cel mult 100.” → „Aduni părțile și cele 10 din oficiu: C + B + A + 10 = punctajul.” („în total, 100” e spus la pasul 3); „82 : 10 = 8,2 devine 8” → „8,2 devine 8” („altfel” arată „82 devine 8,2”); „deci nota 9” → „nota 9”; „număr întreg” → „întreg”.
- **Pasul 5 nou, „Din lucrare și LearningHub, nota din catalog”** (pe bară P6; 102 cuvinte, „Uite cum” 77): nota din catalog = (80% din punctajul lucrării + punctele de pe LearningHub) : 10, cu cele 20 de puncte și părțile lor, minutele, anunțul, calea fără calculator acasă, absența motivată, nota 1.
- „Din notă, nivelul” e acum pasul 6; „Uite cum” al lui spunea „Elevul din pasul trecut” (adică 68 de puncte, de la „Din puncte, nota”): acum „Elevul din pasul „Din puncte, nota””. Diploma are regula nouă.

**Exercițiile pasului nou, cu socoteala** (fiecare verificată cu `python AI_0/tools/nota_site.py <punctaj> <puncte_site>`):
| Unde | Caz | Socoteala | Nota |
|---|---|---|---|
| Uite cum | Ana: 100 p, nimic | (80 + 2) : 10 = 8,2 | 8 |
| Uite cum | Bogdan: 60 p, tot | 80% din 60 = 48; (48 + 20) : 10 = 6,8 | 7 |
| Încearcă | Mihai: 95 p, 8 | (76 + 8) : 10 = 8,4 | 8 |
| Încearcă | Oana: 50 p, 20 | (40 + 20) : 10 = 6 | 6 |
| Încearcă | Luca: 60 p, nimic | (48 + 2) : 10 = 5 | 5 |
| Încearcă | Sonia: 30 p, 20 | (24 + 20) : 10 = 4,4 | 4 |
| Încă 1 (număr) | Paula: 80 p, 11 | (64 + 11) : 10 = 7,5, la ,5 în sus | 8 |
Doar din lucrare, cei patru de la „Încearcă” ar fi avut 10, 5, 6 și 3. Capcanele de la Paula: 9 (tot punctajul lucrării), 7 (rotunjit în jos), 7,5 și 75. Încă 2-3: minutele (A/F), absența motivată (alegere).

**Citatul din regulă** (SISTEM_EVALUARE §4.5; tabelul părților e pus pe rânduri, tăieturile sunt marcate cu […]):

> **Nota trecută în catalog la lucrarea (sau proiectul) de modul**
> = rotunjit((0,8 × punctajul lucrării + punctele de pe LearningHub) : 10), la ,5 în favoarea elevului.
> Punctajul lucrării e cel de la §4.1–4.2 (din 100, cu cele 10 din oficiu); punctele de pe site sunt din 20:
> din oficiu (le are oricine) 2 p · **C** · De bază: ce s-a dat clasei în perioadă, **terminat** […] — 8 p × terminate ÷ date ·
> **B** · Consolidat: terminat **fără ajutor**: fără „Arată-mi răspunsul”, cel puțin 2 din 3 bune din **prima** încercare — 6 p × fără ajutor ÷ date ·
> **A** · Avansat: **în plus**: jocurile de antrenament și ce marchez „pentru nota mare” în lista clasei, câte 1–2 p — cel mult 4 p · Total 20 p.
>
> - **De la anunț:** ce s-a dat înainte de ora la care am anunțat regula clasei nu intră în socoteală; dacă elevul l-a făcut totuși, i se adaugă, fără să treacă de punctajul întreg al părții (doar în favoarea lui).
> - **Minutele nu intră în notă.** […]
> - **Echitate:** lucrul la oră, la calculatorul școlii, sau pe foaie, recunoscut de mine, dă aceleași puncte […]; lecția din ziua unei absențe motivate nu intră în socoteală […].
> - **Copiatul și lucrarea nepredată rămân nota 1** (§4.2), fără partea de site.
>
> **Exemple:** 100 p la lucrare + 2 p pe site (nimic făcut) → (80 + 2) : 10 = 8,2 → **8** · 60 p + 20 p (tot) → (48 + 20) : 10 = 6,8 → **7** · 60 p + 2 p → 5,0 → **5** · 55 p + 2 p → 4,6 → **5** · 50 p + 2 p → 4,2 → **4**.

(`Info_Gimnaziu_2026/SISTEM_EVALUARE.md` §4.5; regula în cod: `AI_0/tools/nota_site.py`, proba `nota_site.py proba` → 0; fișa din caiet: `instrumente/Fisa_criterii_elev_clasa_VII.md`, „Munca mea pe LearningHub”.)

**Nesigur / de hotărât de profesor:**
- Ce notă dă **nivelul** (pasul „Din notă, nivelul”): pagina îl citește în continuare din nota lucrării (punctaj : 10), cum o fac toate exercițiile de acolo. §4.5 nu spune dacă nivelul se citește din nota lucrării sau din nota din catalog; n-am scris nicio regulă nouă.
- „Vrei mai mult” (din §4.5) nu apare în lecție: în lecțiile de gimnaziu nu există o secțiune cu numele ăsta; partea de 4 puncte e spusă „pentru jocurile (făcute) în plus”. *(07.10.2026, mai târziu: §4.5 a fost corectat la fel — A = jocurile de antrenament și ce marchează profesorul „pentru nota mare”; citatul de mai sus e cel de acum.)*
- Motorul (`jocuri/_motor/motor.js`, neatins) scrie deasupra fiecărei casete „Încearcă tu · fără puncte, doar exersezi”. Exercițiul singur nu dă puncte, dar „Arată-mi răspunsul” se numără acum la partea de 6 puncte; de hotărât de dirijor dacă eticheta motorului se schimbă.
- Regula se anunță la clasă abia după etapa 5 a contractului (jurnalul cu punctele); pagina spune doar „de la ora în care o anunță profesorul”, fără dată.
- Jumătățile de lecție, perioada dintre lucrări și cazul „nicio lecție dată pe site” (§4.5) nu sunt în pagină: nu erau în lista din brief, iar pasul are deja 100+ cuvinte.

**Porțile (07.10.2026, după schimbare; rețeaua externă oprită la probele cu browser, regula 24):**
- `_campaign/nota_site_2026_10_07/oracol_nota_site.py` → 0 (pornise de la 8, câte 2 pe lecție);
- `_campaign/notare_punctaj_2026_09_29/verifica_regula.py` → 0;
- `_campaign/isj_aliniere_2026_10_01/oracol_m1l01.py vii/m1-l01` → 0;
- `verifica_lectie.py … --fara-t1` → S0, S1, S2 (6/7), T0 TRECUT, ultima linie 0;
- `jocuri/_motor/test_joc.py --dir …/lectii/vii m1-l01` → TRECUT (32 de întrebări jucate; avertismentul „1 niveluri” e cel obișnuit);
- proba în browser a pasului nou (Chromium, situl servit local, ctx.route care oprește tot ce nu e 127.0.0.1, ctx.close(); 1280 px cu mouse și 390 px cu atingere): trimiterea duce prin „Pasul următor” la pasul nou, eticheta lui pe bară e P6, „Arată-mi răspunsul” nu apare după o greșeală și apare după două, răspunsul bun e primit, 0 erori în consolă → 0 probleme. Scriptul probei a stat în afara depozitului (cerința lucrării: doar cele patru fișiere ale lecției).

## Codul de intrare, 16.10.2026 (etapa 1)

Lucrarea: `_campaign/revizuire_completa_2026_09/v1_cu_cod_2026_10_16/` (contract.md, prompturi/_comun.md). Decizia lui Vasile: se reface **partea cu codul**; restul lecției rămâne. Copia de dinainte: `_proba/inainte_2026_10_16/`. Faptele: `assets/js/prezenta.js` de azi (sha1 `8e852437…`), doar citit.

**Ce am schimbat în pagină**
- **Doi pași noi, după pasul 0** (pe bară P2 și P3): „Pe numele tău, cu codul tău” și „Acasă, pe telefon, cu codul uitat”. Fiecare are text, „Uite cum”, „Încearcă” și „Încă un exercițiu”; primul are și „altfel” (cifrul lacătului de la bicicletă).
- **Caseta „Cine dă evaluarea?”** (începutul atelierului): fiecare variantă spune acum „intră pe numele tău, cu codul tău”. Elevul neconectat e trimis la pașii 2 și 3, iar eticheta „Nu e nimeni conectat” e numită printre casete. „Nu ești înscris” a devenit „Nu ești conectat”: după „Ieși” elevul e înscris, dar neconectat.
- **Laboratorul are 10 pași** (erau 5): verifici numele de pe etichetă; scrii codul pe ultima pagină a caietului; „Ieși (deconectare)”; intri din nou din listă, cu codul adevărat; la sfârșit, după întrebări, „Ieși (deconectare)” pentru următorul elev. Cei 5 pași vechi au rămas neschimbați.
- `cum` (cuprinsul): o propoziție spune că pașii 2 și 3 arată intrarea. Obiectivul și diploma pomenesc intrarea și ieșirea.
- `afirmatii.json`: locurile vechi sunt spuse acum cu NUMELE pașilor, nu cu numărul (s-au mutat cu doi). Sunt noi A10-A17 (`_proba/afirmatii_cod.py`).

**De ce doi pași, nu unul.** Cele 6 situații (R1 a-f), plus greșelile de prevenit, nu încap într-un pas: textul are cel mult 110 cuvinte, „Uite cum” cel mult ~80 (oracolul `oracol_m1l01.py` le numără). Standardul cere „un pas = o idee”, iar regula 6 a judecătorilor spune: un pas cu 5 idei se împarte. Am pus ideile așa: pasul A = intrarea la școală (a, b, c, colegul); pasul B = în altă parte și când ceva nu merge (d, e, f).

**De ce imediat după pasul 0, nu înaintea atelierului.** Caseta de jos apare de la prima încărcare a paginii, iar elevul de a VII-a „apasă primul buton mare” (cititorul-țintă). Dacă pașii cu codul vin primii, elevul intră de-adevăratelea pe numele lui chiar după exersare („Acum, de-adevăratelea…”, la pasul 3; regula 10: gestul real, cât e proaspăt). Așa, tot restul lecției se scrie pe numele lui. Varianta respinsă, pașii la sfârșit, nu muta numerele pașilor vechi pe bară. Prețul variantei alese: la elevii care au început lecția înainte de 16.10, pașii văzuți (`ps`, după poziție) se mută cu doi. Ce afectează: bara arată ca văzuți alți pași, iar „Continuă de unde ai rămas” poate duce cu doi pași mai devreme. Nu se pierde nimic: stelele și lecția terminată rămân.

**Introducerea veche.** VII/1 nu avea introducerea „Întâi, spune cine ești…” cu cele 4 casete (aceea e la V/1). Rolul ei îl avea caseta „Cine dă evaluarea?”. Aceasta a rămas, fiindcă arată starea elevului, dar acum doar trimite la pași. Nu mai predă intrarea.

**Situațiile R1, unde sunt**
| | Situația | Unde |
|---|---|---|
| a | prima înscriere: alegi codul, îl scrii în caiet, nu-l spui | P2: text („Prima dată…”, „nu-l spui nimănui, îl scrii doar în caiet”), Uite cum (Sorina, „cifrele se văd”), altfel; Încearcă (azi: ordinea; după componentă: caseta `inscriere`) |
| b | intrarea din „Cine lucrează acum?” cu codul | P2: text („La fiecare oră…”), Uite cum, Încearcă; laboratorul |
| c | ieșirea și întoarcerea | P2: text („Pleci?…”), Uite cum; laboratorul (Ieși → Intră) |
| d | același nume, clasă, cod acasă / pe telefon | P3: text, Uite cum (Sorina pe telefon, „Continuă de unde ai rămas”), Încă un exercițiu („Sorina Vlaicu”) |
| e | „Mi-am uitat codul” + ce face profesorul | P3: text („La ora următoare spune-i profesorului…”, „După ce te deblochează…”), Încearcă |
| f | ai lucrat fără cod: „Păstrează-l online” | P3: text, Uite cum (Matei, din listă: „Alege-ți codul (4 cifre)”), Încă un exercițiu (Cezar) |
| — | codul schimbat / nume scris altfel / altă clasă (a doua înscriere) | P3: text („Alt cod, altă clasă sau alt nume fac o a doua înscriere”), Încă un exercițiu (ordinea cuvintelor nu contează) |
| — | intrarea pe numele colegului | P2: text (ultimele propoziții) + Încă un exercițiu (Radu); caseta „Cine dă evaluarea?”; laboratorul, pasul 2 |

**Faptele, probate pe caseta adevărată** (`_proba/proba_cod_vii.py` → 0, `_proba/proba_laborator_cod.py` → 0; ambele la 1280 px cu mouse și la 390 px cu atingere; Chromium din Playwright, headless; serverul FALS local `pin_deconectare/probe/server/server_local.mjs` cu `izolare.mjs`; rețeaua spre afară oprită; închidere doar cu `ctx.close()`; nume și coduri inventate; 0 coduri în cererile spre serverul fals; 0 cereri trecute spre altă adresă). Textele exacte sunt în `_proba/proba_cod_vii.json`:
- formularul „Cine ești?” are „Codul tău secret, 4 cifre (scrie-l în caiet)”; **cifrele se văd** la tastare (câmpul n-are `class="cod"`). În fereastra „Salut, …!” sunt ascunse (`-webkit-text-security: disc`). La fel se văd și în „Păstrează progresul online”;
- „Ieși (deconectare)” → „Ai ieșit, Vlaicu Sorina. Data viitoare îți cer codul.” + „Intră” / „Bine” → eticheta „Nu e nimeni conectat · Intră”. Pagina NU se reîncarcă: lecția rămâne pe pas;
- după „Intră”, din listă sau din formular, pagina pornește din nou, cu „Continuă de unde ai rămas: P3” sau „…: Laboratorul”;
- coduri greșite: „Cod greșit. Mai încearcă.”, apoi la al 3-lea „Mai ai două încercări…”, la al 4-lea „Mai ai o încercare…”, la al 5-lea „Ai greșit codul de 5 ori la rând. Mai încearcă peste … secunde.” și butonul „Așteaptă … s”. După 30 s, codul bun intră;
- „Mi-am uitat codul” → „Codul nou (4 cifre)”, „Scrie-l încă o dată”, „Trimite cererea” → „Cererea a ajuns la profesor. …”. Înainte de deblocare, codul nou primește „Profesorul nu te-a deblocat încă. …”. După deblocare (API-ul de administrator al serverului fals), codul nou intră, iar cel vechi primește „Cod greșit.”. Panoul (`AI_0/projects/teste-elevi/site/public/activitate.html`, citit): „Deblochează doar după ce ți-a spus el, la oră, că e cererea lui.”;
- alt aparat: același nume, clasă și cod aduc progresul lecției; la fel numele în altă ordine, cu majuscule, cu diacritice. Alt cod, clasa VIII sau „Vlaicu Sorina Maria” fac altă înscriere, fără progres (d1-d7). Regula vine din `amprenta()`;
- fără cod: meniul are „Progresul tău stă doar pe calculatorul ăsta. …” + „Păstrează-l online” → „Păstrează” → „☁ Progresul tău se păstrează online…”. Din listă: „Salut, Dobre Matei! (VII) De acum, fiecare elev intră… Alege-ți codul (4 cifre)” + „Scrie-l încă o dată”, fără „Mi-am uitat codul”;
- „Nu ești tu? Schimbă elevul” deschide lista „Cine lucrează acum?”.

**R2 (proba mea, până la proba comună):** `_proba/r2_nume_cod.py` → 0. Sunt 66 de nume dintre „…”, din pașii cu codul, din caseta „Cine dă evaluarea?” și din pașii noi ai laboratorului. Fiecare se află literă cu literă în `prezenta.js` sau în `motor.js`, iar „…” din „Ești tot …?” ține locul numelui. Mutantul („Ieși (deconectează-te)”) e prins: 1. În pași nu am pus între „…” numele elevilor din exemple și nici titlurile pașilor.

**Cât durează (I4).** Drumul obligatoriu (`_proba/cuvinte.py`, care numără și „Uite cum”) are acum 2.464 de cuvinte, adică ≈ 21 de minute de citit la 120 de cuvinte pe minut. Înainte erau ≈ 1.850, estimat ca diferența celor adăugate: +468 în cei doi pași, ~+110 în laborator, +20 în cuprins, +5 în caseta atelierului. În VII/1 nu exista o introducere pe care pasul nou să o înlocuiască. Laboratorul nou are 235 de cuvinte (era ~290 înainte să-l strâng). Restul lecției nu l-am scurtat, fiindcă nu e al lucrării acesteia. **NESIGUR** dacă încape în 50 de minute. Hotărăște dirijorul sau Vasile.

**Pentru componenta comună / pentru dirijor** (nu am schimbat nimic din ele):
1. `prezenta.js`: în formularul „Cine ești?” (`#lhp-k`) și în „Păstrează progresul online” (`#lhp-k`), codul se vede la tastare. În „Salut, …!” e ascuns. Contractul (I3) spunea atunci că e ascuns peste tot; dirijorul l-a corectat pe 16.10 (`fapte.json`, `cod_ascuns`). Lecția nu spune că e ascuns. Spune „cifrele se văd, deci se uită să nu stea nimeni lângă ea”.
2. `pin_deconectare/probe/server/server_local.mjs` schimbă în `diplome-date.js` doar `server`, nu și `api`, iar `api` are Worker-ul `lh-api` de la 11.10. Deci, sub `matrice_prezenta.py`, prezenta.js trimite spre lh-api: cererea e oprită de rută, iar serverul fals nu primește nimic. Prima mea rulare a avut 0 cereri la serverul fals. Probele mele mută și `api` pe serverul fals (`rescrie_diplome()` în `proba_cod_vii.py`).
3. `prezenta.js`: „Mai târziu” din listă face elevul „vizitator” pe 30 de zile (`eu = {refuz}`). După aceea, eticheta „Sunt elev — mă înscriu” duce la formular, nu la listă. Lecția nu recomandă „Mai târziu”.

**Componenta comună `intrare-cod.js`.** La 10:30, capul fișierului exista (API: `start`, `elev`, `cod`, `colegi`, `pe`, `tinta`, `deblocat`), dar `intrare-cod.GATA.md` nu. Scenariile mele sunt scrise deja în forma API-ului (`SCENARII_COD` din pagină: `inscriere`, `lista`, `coleg`, `uitat`, `faraCod`, `telefon`), dar NU sunt legate de motor. Până atunci, „Încearcă” din pașii 2-3 sunt o ordonare și o alegere (recunoaștere), marcate `/* ASTEPT intrare-cod */`. Pozele casetelor adevărate (`FIG_COD_INTRA`, `FIG_COD_ALTFEL`) sunt goale, marcate `/* ASTEPT captura */`.

**Nesigur (I2)**
- Progresul adus pe alt aparat, cererea „Mi-am uitat codul” ajunsă la profesor și deblocarea le-am probat doar pe serverul FALS local, cu funcțiile din `teste-elevi/site/netlify/functions`, nu pe Worker-ul `lh-api` de azi. Lecția le spune prudent: „îți vine ce ai lucrat la școală” doar cu același nume, clasă și cod.
- Munca de dinainte de cod, făcută pe ALT calculator decât cel de pe care elevul apasă „Păstrează-l online”: lecția nu promite că vine (biletul e doar pentru elevii din catalog, nu și la „Altă școală”).
- „Pe ultima pagină a caietului de TIC” e alegerea mea. Documentele profesorului spun doar „scrie-l în caiet”.
- Închiderea filei nu deconectează (exercițiul cu Radu): citit în `pin_deconectare/PREDARE.md` §1, nu probat de mine.

**Porțile, etapa 1 (16.10.2026):**
- `test_joc.py` → TRECUT: 38 de întrebări, doar „1 niveluri”. Avertismentul „varianta corectă e vizibil mai lungă” l-am reparat;
- `verifica_lectie.py … --fara-t1` → 0. T0 a prins de 3 ori „rând” (lecția 4) și o dată „LearningHub” înainte de pasul lui; le-am reformulat;
- `oracol_m1l01.py vii/m1-l01` → 0 (o rulare a dat 1, „P2: text 111”: am scos două cuvinte). Cu `cuvinte.py`: P2 text 109, Uite cum 78; P3 text 106, Uite cum 80;
- `verifica_regula.py` → 0; `oracol_nota_site.py vii` → 0;
- `r2_nume_cod.py` → 0 (mutantul prins);
- proba comună `lectii/_sim/_teste/intrare_cod_texte.py --lectie vii/m1-l01` → 0. Deocamdată verifică doar laboratorul și cuprinsul, fiindcă pașii cu codul n-au încă `t:'intrare-cod'`. Am trecut ca excepții (`_proba/intrare_cod_exceptii.json`) „De recitit” și „Proba nu a verificat”: sunt titluri din fișa lecției, nu butoane ale casetei;
- `proba_cod_vii.py` → 0, `proba_laborator_cod.py` → 0;
- `captura_pasi_cod.py` → 0: P2 și P3 la 390 și 1280 px, nimic mai lat decât ecranul, 0 erori. Am privit capturile `_proba/_tel_p2_cod.png` și `_tel_p3_cod.png`;
- `learninghub_date_personale.py` → 0;
- `activitate.py lista`: niciun elev de probă (Vlaicu, Dobre, Lazăr, Toma), fiindcă nicio cerere n-a plecat.

## Codul de intrare, 16.10.2026 (etapa 2: caseta de exersare și pozele)

Am terminat ce lăsase etapa 1 (`_proba/stare_autor.md`). API-ul casetei: `lectii/_sim/intrare-cod.GATA.md` și capul lui `lectii/_sim/intrare-cod.js` (sha1 `c8c6b4ae…`), citite înainte; fiecare câmp folosit (`start`, `elev`, `cod`, `colegi`, `pe`, `tinta`, `deblocat`) există și face ce scrie. N-am atins `intrare-cod.js`, unealta de capturi, proba de texte, `prezenta.js`, `motor.js`, `rezultat-elev.js`.

**Ce am schimbat în pagină**
- `<script src="../../_sim/intrare-cod.js">` după motor și `tipuri:{…,'intrare-cod':SimIntrareCod.intrare}`. Comentariile `/* ASTEPT … */` au ieșit.
- **Pasul „Pe numele tău, cu codul tău”.** „Încearcă” = caseta de exersare, `SCENARII_COD.inscriere` (pornește de la calculator nou; ținta: intrat → ieșit → intrat din listă, cu același cod). `gresit()` al casetei = a doua înscriere, cu altă clasă → „Nu încă” (greșeala reală din 13.10 și 15.10). „Încă un exercițiu”: lista (codul din caiet), colegul rămas conectat (Radu), ordinea pașilor (recunoașterea din etapa 1, mutată aici), adevărat/fals (codul nu-l spui). **A ieșit** alegerea „Radu e pe etichetă, ce faci?”: e exact situația exercițiului cu colegul, iar cu ea a ieșit și singura promisiune neprobată de mine („închiderea filei nu-l scoate pe Radu”).
- **Pasul „Acasă, pe telefon, cu codul uitat”.** „Încearcă” = `SCENARII_COD.uitat`, acum cu `deblocat:true` și ținta cerere → intrat: elevul cere codul nou, iar după deblocare (exersarea face ce face profesorul în panou și spune „În exersare, profesorul te-a deblocat…”) intră cu codul NOU. Așa situația (e) e exersată întreagă, cu ce urmează după profesor. `gresit()` = a doua înscriere → „Nu încă”. „Încă un exercițiu”: fără cod („Păstrează-l online”), acasă (același nume, clasă, cod), adevărat/fals (Sorina Vlaicu), alegerea cu Cezar. **A ieșit** alegerea „Bianca și-a uitat codul, ce face?”: aceeași situație ca exercițiul.
- Cerința înscrierii a pierdut „Exersezi aici, nu în caseta de jos.” (caseta are rândul ei: „Exersare: caseta de jos, ca pe calculator. Aici nu se salvează nimic și nu pleacă nimic la profesor.”) și „scrie-l în caiet” (caietul exercițiului arată singur codul ales). Indiciul exercițiului cu codul uitat spune și drumul de după cerere („Am înțeles”, numele, codul nou, „Intră”).
- **Pozele (R3).** `img/casete-cod.webp`, lângă „Uite cum” din primul pas: 1 „Cine ești?” completat (cifrele codului SE VĂD), 2 lista „Cine lucrează acum?”, 3 „Salut, Vlaicu Sorina! (VII)” cu „Codul tău (4 cifre)”, 4 meniul cu „Ieși (deconectare)” și „Nu ești tu? Schimbă elevul”. `img/casete-cod-altfel.webp`, în al doilea pas: 1 „Mi-am uitat codul” (Vlaicu Sorina), 2 meniul lui Dobre Matei, care n-a avut cod („Progresul tău stă doar pe calculatorul ăsta.” + „Păstrează-l online”). Comanda: `python C:/00/Projects/LearningHub/lectii/v/m1-l01/_proba/captura_casete_cod.py --clasa VII --scoala tupilati --clasa-exacta VII --elev "Vlaicu Sorina" --coleg "Toma Radu" --coleg2 "Dobre Matei" --montaj "cine-esti-completat,lista,salut,meniu" --iesire …/lectii/vii/m1-l01/img --texte …/_proba/casete_cod_VII.json` → 0 probleme, 0 cereri spre afară (textele în `_proba/casete_cod_VII.json`, nu lângă unealtă: acolo e dosarul lecției V/1). **De ce al doilea montaj e făcut de mine:** unealta face un singur montaj pe rulare și cu un singur elev; meniul „fără cod” din rularea cu Sorina ar fi arătat-o pe Sorina fără cod, adică în contradicție cu exemplul ei, în care intră acasă cu codul. Am rulat unealta a doua oară cu `--elev "Dobre Matei" --doar meniu-fara-cod --fara-surse` (în `_proba/capturi_matei/`) și am pus cele două capturi una sub alta, cu același desen ca unealta (`_proba/monta_altfel.py` → 0; rândul lui în `img/SURSE.json`). Cele 20 de poze nefolosite și rândurile lor: șterse. Montajele sunt înalte (2431 și 1253 px): pe calculator le-am limitat la 560 px lățime (o regulă CSS în pagina lecției), ca textul din poză să se citească fără să umple ecranul; pe telefon încap în lățime. Le-am privit pe amândouă, singure și în pagină (`_proba/_tel_p2_cod.png`, `_tel_p3_cod.png`), și le-am comparat cu textul de lângă ele.
- **„Uite cum”, scurtat (I4).** Primul pas: 62 de cuvinte + legenda, cu trimiteri (1)-(4) la poză; au ieșit „Data viitoare îți cer codul.” și „Nu e nimeni conectat” (le arată caseta de exersare, la ieșire și la intrarea din nou, și laboratorul). Al doilea pas: 62 + legenda; a ieșit fraza despre Matei și „Alege-ți codul (4 cifre)” din listă (caseta adevărată o explică singură, pe ecran: poza din `_proba/capturi_matei` nu e folosită). Poza vine înaintea frazei „Acum, de-adevăratelea…”, ca gestul real să fie ultimul lucru citit. Oracolul (`oracol_m1l01.py`, ≤85 cu tot cu legenda) → 0.
- **Trimiterile, pe numele pașilor.** Caseta „Cine dă evaluarea?” (neconectat): „ca la pasul <i>Pe numele tău, cu codul tău</i>” (era „ca la pașii 2 și 3”). Cuprinsul: „cum intri pe numele tău, înveți chiar la început” (era „pașii 2 și 3 îți arată…”). Titlurile stau în `<i>`, nu între „…”, ca proba de texte (R2) să nu le ia drept butoane.
- `afirmatii.json`: A12, A13, A15, A16 cu locurile noi; A13 fără promisiunea despre închiderea filei; **A18** (exersarea nu salvează și nu trimite nimic, R4) și **A19** (pozele = caseta adevărată de azi, R3). `capturi_lipsa.json`: spune de pozele noi.

**Situațiile R1, unde sunt (după etapa 2)**
| | Situația | Unde |
|---|---|---|
| a | prima înscriere: alegi codul, îl scrii în caiet, nu-l spui | pasul „Pe numele tău, cu codul tău”: text, „Uite cum” (Sorina; cifrele se văd) + poza 1, altfel; **Încearcă** (caseta de exersare: înscrierea); Încă (adevărat/fals); laboratorul (codul pe ultima pagină a caietului) |
| b | intrarea din „Cine lucrează acum?” cu codul | același pas: text, „Uite cum” + pozele 2-3, **Încearcă** (intrarea din nou, din listă), Încă (lista; ordinea); laboratorul, pasul cu „Intră” |
| c | ieșirea și întoarcerea | același pas: text, „Uite cum” + poza 4, altfel, **Încearcă** (ieșire + intrare din nou); laboratorul (Ieși → Intră; Ieși la plecare) |
| d | același nume, clasă, cod acasă / pe telefon | pasul „Acasă, pe telefon, cu codul uitat”: text, „Uite cum” (Sorina pe telefon), Încă (caseta: acasă; adevărat/fals „Sorina Vlaicu”) |
| e | „Mi-am uitat codul” + ce face profesorul | același pas: text, poza 1, **Încearcă** (caseta: cererea, apoi intrarea cu codul nou după deblocare) |
| f | ai lucrat fără cod: „Păstrează-l online” | același pas: text, poza 2 (Matei), Încă (caseta: fără cod; alegerea cu Cezar) |
| — | a doua înscriere (alt cod / alt nume / altă clasă) | același pas: text; Încă (acasă; „Sorina Vlaicu”); `gresit()` la ambele „Încearcă” |
| — | intrarea pe numele colegului | primul pas: text + poza 4 + Încă (caseta: Radu rămas conectat); caseta „Cine dă evaluarea?”; laboratorul, pasul cu eticheta |

**Cât durează (I4) — măsurat ce se poate, estimat restul.** `_proba/cuvinte.py`: drumul obligatoriu are acum **2.378 de cuvinte** (etapa 1: 2.464; −86, din „Uite cum” și din cerința înscrierii). `_proba/timp_i4.py` socotește ora cu ipoteze scrise în capul lui (citit 150 / 100 de cuvinte pe minut; gesturile din caseta de exersare numărate pe drumul din `gesturi_e2.py`: 24; atelierul 17 părți; laboratorul 4 pași de scris, 1 cu legături, 5 cu caseta de jos; 5 întrebări): **elev rapid ≈ 40 de minute, elev lent ≈ 76**. Partea cu codul (cei doi pași, exersarea, cei 5 pași de laborator, intrarea adevărată) cere ≈ 9-16 minute din acestea; fără ea, același calcul dă ≈ 31 / ≈ 60 de minute, deci și înainte de cod elevul lent nu termina în 50 de minute. **NESIGUR (I4):** încape pentru un elev care citește repede; pentru unul lent, nu. Ce aș scurta, dacă hotărăște dirijorul sau Vasile (nu e partea cu codul, deci nu l-am atins): pașii de laborator în care elevul scrie în caiet (4 × 1,5-3 minute) sau atelierul (17 părți). Partea cu codul n-o mai pot strânge fără să pierd o situație din R1 sau un gest din R5.

**Probele și porțile, etapa 2 (16.10.2026)** — toate cu Chromium din Playwright, headless, rețeaua spre afară oprită, închidere doar cu `ctx.close()`, nume inventate:
- proba comună de texte `lectii/_sim/_teste/intrare_cod_texte.py --lectie vii/m1-l01` → **0** (pașii cu codul P2, P3 găsiți singuri; 55 de bucăți dintre „…” căutate, 0 negăsite, 2 excepții vechi; 5 „atenții” pentru îngroșări ca „Ți-ai uitat codul?”, care nu sunt nume de butoane); `--mutant` → 0 scăpați;
- `_proba/gesturi_e2.py` → **0**: gesturi reale de la cuprins până la „TERMINATĂ”, la 390 px cu atingere și la 1280 px, pe caseta de jos ADEVĂRATĂ (serverul FALS local, `api` și `server` pe 127.0.0.1): ambele exerciții cu cod (întâi „Verifică” gol → „Nu încă”, apoi drumul → „Corect”), cele 4 „Încă” cu cod, intrarea adevărată („Continuă de unde ai rămas: P3”), pașii vechi, atelierul (greșit, reparat, proba de a V-a), laboratorul literal (fișa, legătura în filă nouă, „Ieși (deconectare)” → „Data viitoare îți cer codul.”, lecția rămâne pe pas, „Intră” din listă cu codul → „Continuă de unde ai rămas: Laboratorul”), cele 5 întrebări, „Ieși” la plecare; 0 erori în consolă, nimic mai lat decât ecranul, 0 cereri trecute spre afară (8 oprite: fonturile);
- **R4 (izolarea), în aceeași probă:** 14 ferestre de gesturi în caseta de exersare (7 pe dimensiune; 3 dintre ele cu un elev ADEVĂRAT conectat în caseta de jos): **0 accese din `intrare-cod.js`** la localStorage / sessionStorage / cookie / rețea / `window.Prezenta`, **0 chei de identitate schimbate** (`lh_elevi_pc`, `lh_coduri`, `lh_sertare`, `lh_cod_gresit`, `lh_prezenta_iesit`, identitatea din `lh_prezenta`), **0 cereri** plecate în ferestre; elevul adevărat rămâne conectat. Proba probei: `gesturi_e2.py --mutant 1280` (o copie a casetei care citește `lh_elevi_pc` și trimite o cerere la fiecare clic) → PRINS (24 de accese, 12 cereri);
- probele etapei 1, rulate din nou pe pagina de acum: `proba_cod_vii.py` → 0, `proba_laborator_cod.py` → 0; `captura_pasi_cod.py` → 0 (capturile `_tel_p2_cod.png`, `_tel_p3_cod.png`, `_pc_p2_cod.png` privite);
- `test_joc.py` → TRECUT (42 de întrebări; doar „1 niveluri”); `verifica_lectie.py … --fara-t1` → 0 (S2: aplicare/execuție 7 din 9); `oracol_m1l01.py vii/m1-l01` → 0; `verifica_regula.py` → 0; `oracol_nota_site.py` → 0;
- `learninghub_date_personale.py` → 0; `activitate.py lista`: niciunul dintre numele de probă (Vlaicu Sorina, Lazăr Bianca, Dobre Matei, Toma Radu, Pavel Irina) în panou. Ieșirea listei NU am păstrat-o în `_proba/` (are numele elevilor adevărați).

**Pentru componenta comună / pentru dirijor** (n-am schimbat nimic din ele):
1. Unealta de capturi: un montaj pe rulare, cu numele fix `casete-cod.webp`, și stările „fără cod” doar pe `--elev`. Pentru o lecție în care elevul din exemple ARE cod, meniul „fără cod” trebuie luat din altă rulare și montat de mână. Cerere: `--montaj-fisier <nume>` și o opțiune ca stările „fără cod” să fie pe `--coleg2`.
2. `pin_deconectare/probe/matrice_prezenta.py`: `completeaza()` / `inscrie()` au `clasa=CL` ca valoare implicită, legată la încărcarea modulului („8 A”), deci schimbarea lui `M.CL` nu ajunge acolo. Fără clasa dată explicit, înscrierea pe altă școală se blochează (30 s, `select_option`). Am dat-o explicit.
3. În caseta de exersare, eticheta stă în chenarul casetei (nu jos pe ecran), iar indiciile spun „eticheta de jos”. Rândul „Exersare: caseta de jos, ca pe calculator…” le leagă; pe telefon, în probă, n-a încurcat drumul.

## Reparația după judecătorul cod1 și registrul comun (16.10.2026)

Judecat: `index.html` sha1 `bf97cd0e…` (`_verificare/judecator_cod1.md`: 0 GRAV, 3 MAJOR, 6 MINOR) + `REGISTRU_COMUN.md` C1-C23 (de la V/1, VI/1, VIII/1 și cititorii-începători de pe V/1). Copia de dinainte: `_proba/inainte_reparare_2026_10_16/`. N-am atins `intrare-cod.js`, unealta de capturi, proba textelor, `prezenta.js`, `motor.js`, `rezultat-elev.js`. Drumurile noi le-am probat întâi pe caseta ADEVĂRATĂ (`_proba/proba_reparare.py` → `proba_reparare.json`; 1280 cu mouse + 390 cu atingere; serverul FALS local din `pin_deconectare/probe/server`, cu `api` și `server` pe 127.0.0.1; rețeaua spre afară oprită; închidere doar cu `ctx.close()`; nume și coduri inventate) și abia apoi le-am scris.

**Ce am reparat (punct → reparație → loc)**

| Punct | Reparația | Unde |
|---|---|---|
| M1 / C10 (MAJOR) | Cerința spune „În chenarul de exersare de mai jos (nu în caseta din colțul ecranului)”; indiciile spun „eticheta din exersare” (cum scriu acum și mesajele casetei comune, sha1 `dda2f252…`); exercițiile „lista”, „colegul”, „codul uitat” și „acasă” spun „în chenarul de exersare”; „Acum, de-adevăratelea”: „în caseta din colțul ecranului (nu în exersare)”. Rândul casetei e acum „Exersare: o copie a casetei de jos. Nu e caseta adevărată…” (proprietarul). | P2 Încearcă (`SCENARII_COD.inscriere`: q, ajutor), `lista`, `coleg`, `uitat`, `faraCod` (ajutor), `telefon` (q); P3 Uite cum |
| M2 / C18 (MAJOR) | „După ce te deblochează (îți primește codul nou), intri cu el și ai tot ce ai lucrat.”; „fără progresul tău” → „a doua înscriere, goală” (nu mai stă lângă „alege un cod nou” ca amenințare). | P3 text |
| M3 / C2 (MAJOR, I4) | (1) Laboratorul: nivelurile și regula notei, un singur pas de scris (erau doi). (2) Legăturile din „De recitit”: una obligatorie, celelalte „dacă ai timp”. (3) Fraza cu cele 5 coduri greșite a ieșit din „Uite cum” (în locul ei: codul greșit o dată, m2). (4) Situația (d) devine temă de acasă, făcută de-adevăratelea. Elevul lent tot nu încape: „nereparate”, decide Vasile. | laboratorul, pașii 3, 5, 9; P2 Uite cum |
| m1 / C16 | „eticheta” are explicația la prima folosire: „(bara din colțul de jos, cu numele tău)”; în „Uite cum”: „apasă „Intră” pe etichetă, apoi pe numele ei din listă”. | P2 text, P2 Uite cum |
| m2 / C15 / C4 | „Cod greșit? Îl scrie din nou; dacă nu-l mai știe, tot acolo e „Mi-am uitat codul”.” (la școală); acasă: „(acasă: la „Spune cine ești”, după nume)”. | P2 Uite cum; P3 text |
| m3 / C6 | Semnul de acasă: „Pe cuprins vede stelele sau „Continuă de unde ai rămas”.”; în explicația exercițiului „acasă”: „Pe site, semnul e pe cuprinsul lecției…”. Mesajul „☁ A venit progresul…” nu mai e în caseta comună (`dda2f252`). | P3 Uite cum; `SCENARII_COD.telefon` why |
| m4 / C17 / C13 | „Acasă, cu caietul, Sorina se înscrie.”; „cu internet”; laborator: „caietul îl iei și acasă”. | P3 text și Uite cum; laboratorul, pasul 6 |
| m5 / C8 | Cerința exersării: „În exersare, profesorul o deblochează imediat; pe site, abia după ce vorbește cu el.”; „La ora următoare spune-i…” → „Spune-i profesorului că cererea e a ta.” (și „acum, dacă e în sală, sau la ora următoare”, în explicație); laboratorul: drumul pentru cine nu poate intra. | `SCENARII_COD.uitat` (q, why); P3 text; laboratorul, pasul 2 |
| m6 / C7 | Ieșirea, după întrebări: în explicația ultimei întrebări („Gata cu întrebările: când pleci, apasă eticheta, apoi „Ieși (deconectare)”.”) și în textul diplomei („La plecare: eticheta din colțul de jos, apoi „Ieși (deconectare)””), nu doar în „Pașii, încă o dată”. Un rând pe ecranul de final: cerere spre motor. | `qs[4].why`; `diploma.rezumat`; laboratorul, pasul 9 |
| C1 (GRAV la VI) / C20 | Verificarea etichetei, o dată, pe cuprins, ÎNAINTEA lecției: „Are numele altui elev? Apasă pe ea, apoi „Ieși (deconectare)” și „Bine”.” Unde mai poate apărea (atelierul, laboratorul), lecția spune ce face după reîncărcare: „Continuă de unde ai rămas”, iar dacă nu apare, butonul lecției, „Pasul următor →” și „La atelier →”; în laborator: atelierul din nou (fișa e goală). | `cum`; caseta „Cine dă evaluarea?” (`REVINO`); laboratorul, pasul 2 |
| C3 | „6402: e doar codul exercițiului (pe al tău îl alegi tu, altul).”, o dată, la primul exercițiu cu cod dat. | `SCENARII_COD.lista` (q) |
| C5 | „revino la fila „Atelier”” a ieșit (pentru elevul tocmai intrat, fila e stinsă); în loc: `REVINO`. | caseta „Cine dă evaluarea?” |
| C9 | „Ai deja două coduri? Tot așa: la deblocare, ce ai lucrat online pe numele tău, la clasa ta, trece sub codul nou.” (citit în `admin.mjs` „cerere-deblocheaza”: hVechi + toate amprentele grupate de panou pe școală, clasă, nume). | `SCENARII_COD.uitat` why |
| C11 | Nu se aplică (doar V/1 are poza barei). | — |
| C12 | „Fără cod încă? Îl alegi, de două ori.” (la intrarea adevărată, elevul din listă fără cod primește „Alege-ți codul (4 cifre)” + „Scrie-l încă o dată”). | P3 Uite cum („Acum, de-adevăratelea”) |
| C14 | Deja acoperit: poza 1 (formularul completat) + textul („alegi școala și clasa, scrii numele întreg, ca în catalog, și codul, apoi „Gata””). | P2 |
| C19 | „cod”: definit în P2 (titlul îl pomenește doar); „etichetă”: explicată (m1); „deconectare”: „Pleci?…” + „altfel” (lacătul); „deblochează”: „(îți primește codul nou)”; „online”, „progres”: în citatele casetei, cuvinte știute la 12-13 ani (judecătorul VII: fără blocaj); „lista calculatorului”: P3. | P2, P3 |
| C21 (MAJOR la VIII) | „Nimic? A greșit clasa: eticheta, „Mi-am scris greșit numele, clasa sau școala”. A greșit codul: „Mi-am uitat codul”, cu codul din caiet, și spune profesorului.”; în explicația exercițiului „acasă”, drumul codului greșit; un „Încă un exercițiu” NOU pe caseta de exersare, `SCENARII_COD.clasaGresita` (API-ul casetei: `start:'eticheta'` + `scris:{clasa:'VIII'}`, ținta „corectat”): Bianca, înscrisă din greșeală la VIII, se repară singură cu „Mi-am scris greșit numele, clasa sau școala” → codul → VII → „Salvează”. Probat ÎNAINTE, pe caseta adevărată: vezi mai jos. | P3 Uite cum; `SCENARII_COD.telefon` why; `SCENARII_COD.clasaGresita` (P3, Încă 3) |
| C22 (MAJOR la VIII) | „Nu-ți mai știi codul? Nu ieși: sari pașii 7 și 8 și spune-i profesorului.” | laboratorul, pasul 6 |
| C23 | Laboratorul nu mai cere „Profesorul vede activitatea ta”, ci numele de pe etichetă „(scurtat, ca Sorina V.)”. | laboratorul, pasul 2 |

**Probat pe caseta adevărată, înainte de a scrie** (`proba_reparare.py`, 1280 + 390, ultima linie 0 la rularea de bază; textele exacte în `proba_reparare.json`):
- C1, la început: Toma Radu rămas conectat → eticheta → „Ieși (deconectare)” → „Ai ieșit, Toma Radu. Data viitoare îți cer codul.” → „Bine” → pașii, neconectat (profilul `_neinscris`) → la P3 intrarea adevărată, din listă cu codul ei SAU „Nu sunt în listă” + formular: pagina pornește din nou cu „Continuă de unde ai rămas: P3” (`c1_iesi`, `c1_iesi_nou`).
- C1, la mijloc: după „Nu ești tu? Schimbă elevul” + numele ei + codul, pagina pornește pe cuprins FĂRĂ „Continuă” (`c1_mijloc`); butonul lecției + „Pasul următor →” duc înapoi (2 apăsări până la P3); de la butonul lecției până la laborator: 8 × „Pasul următor →”, „La atelier →”, butonul atelierului, fără să rezolvi nimic (`c1_drum_rapid`, 10 apăsări). „Ieși” + încă un pas + „Intră” păstrează locul („Continuă de unde ai rămas: P4”, `c1_mijloc_iesi_tarziu`), dar „Ieși” + „Intră” imediat, nu (`c1_mijloc_iesi_imediat`, 1280). De aceea, în laborator (unde bifele stau în `sessionStorage` și nu salvează progresul, `motor.js` `puneBifa`), lecția spune drumul înapoi, nu „Ieși”.
- C21, codul greșit acasă: primit fără niciun mesaj (eticheta „Profesorul vede activitatea ta · Sorina V.”, lecția „începe →”, fără „Continuă”); „Scoate-mă din lista calculatorului” + codul bun → refuzat: „Pe calculatorul ăsta, Vlaicu Sorina intră cu alt cod. Cod greșit. Mai încearcă. Dacă ți-ai uitat codul, apasă „Mi-am uitat codul”.” (deci NU e drumul, cum presupunea registrul); „Mi-am uitat codul” din formular, cu codul din caiet → „Cererea a ajuns la profesor.” → deblocarea (API-ul de administrator al serverului fals) → codul bun intră, cu progresul de la școală și „Continuă de unde ai rămas: P3”.
- C21, clasa greșită acasă (același cod): „Mi-am scris greșit numele, clasa sau școala” → codul → „Mai departe” → clasa VII → „Salvează” → „Gata, Vlaicu Sorina! Acum ești la VII · … Progresul tău a venit cu tine. …” → „Bine” → „Continuă de unde ai rămas: P3”. Fără profesor.
- Rețeaua: 24 de cereri oprite (fonturi), 0 trecute; 0 coduri în cererile spre serverul fals.

**Variante respinse**
- „Copiază în caiet caseta Pe scurt” (judecătorul, M3/2): caseta „Pe scurt” are doar numărul de note și media anuală, nu nivelurile și regula notei; copiată, ar fi pierdut tocmai ce verifică R6 (oracolul cere „Fiecare elev primește, pe an, cel puțin un plan individualizat”, care stă în „Verifică-te”). Am unit cei doi pași, cu aceeași „Verifică-te”.
- Legăturile din „De recitit” mutate acasă (M3/1): fișa cu legăturile stă doar pe calculatorul pe care s-a lucrat atelierul (`rezultat-elev.js`, `lh_rez_…` în `localStorage`); acasă lista n-ar fi acolo. Tema de acasă e situația (d), de-adevăratelea (stelele lecției pe alt aparat).
- La început „Schimbă elevul” (ca la VI/1, G1): merge și el (pagina pornește pe cuprins, nu se pierde nimic), dar cere lista și codul înainte să le predea lecția. „Ieși” + „Bine” nu cere nimic nou, iar intrarea de-adevăratelea rămâne la P3, după ce elevul a învățat-o.

**Cât durează (I4), după reparare** (`_proba/timp_i4.py`, ipotezele în capul lui; ESTIMARE, nu măsurătoare): drumul obligatoriu 2.525 de cuvinte (era 2.378: +~150 din C1, C8, C21, C22, C7 și M1, −11 din fraza cu 5 coduri). Elev rapid ≈ 40 de minute; lent ≈ 74 cu ipotezele mele, ≈ 82 cu ale judecătorului (85 de cuvinte pe minut, o reîncercare la exercițiile cu cod, +2 minute pentru poze și casetă); înainte: 40 / 76, respectiv ≈ 85. Tăieturile câștigă ≈ 2-4 minute, iar punctele noi din registru costă ≈ 1-2 minute de citit. **NEREPARAT (decide Vasile):** elevul lent nu termină în 50 de minute. Ce s-ar mai putea: lecția continuă ora următoare, cu „Continuă de unde ai rămas”; sau atelierul (17 părți, ≈ 13 minute la cel lent) se împarte.

**Pentru componenta comună** (n-am schimbat nimic din ele):
1. `intrare-cod.js` (proprietar V/1): FĂCUT de proprietar în timpul reparării (sha1 `dda2f252…`): rândul „Exersare: o copie a casetei de jos. Nu e caseta adevărată…”, mesajele cu „eticheta din exersare”, fără „☁ A venit progresul…”, colegul trimis la „Nu ești tu? Schimbă elevul”. Lecția e aliniată la ele; porțile (texte, izolare, gesturi) rulate din nou pe versiunea asta.
2. `motor.js` (prin poarta de lansare): un rând pe ecranul „LECȚIA 1 · TERMINATĂ” cu ieșirea de pe calculatorul comun (C7); după „Nu ești tu? Schimbă elevul” în mijlocul unei lecții, locul (pasul) păstrat pentru elevul care intră (C1).
3. `prezenta.js`: acasă, codul greșit e primit fără niciun semn (C21): dacă pe server nu e nimic sub amprentă, dar numele și clasa există, un rând „N-am găsit nimic pe codul ăsta. Ai scris codul din caiet?” ar preveni a doua înscriere.

**Nesigur (I2)**
- Drumurile C21 și deblocarea sunt probate pe serverul FALS (funcțiile din `teste-elevi/site/netlify/functions`), nu pe Worker-ul `lh-api` de azi.
- Două coduri (C9): unirea la deblocare e citită în `admin.mjs` (gruparea panoului pe școală, clasă, nume), nu probată cap-coadă cu panoul; o înscriere cu altă clasă nu e în aceeași grupare (de aceea „la clasa ta”).
- Elevul care nu poate intra la laborator și lucrează mai departe: ce face atunci nu se scrie pe numele lui (merge la „neînscris”, `prezenta.js`); lecția îi cere să spună profesorului.

**Porțile, după reparare (16.10.2026; caseta comună `intrare-cod.js` sha1 `dda2f252…`, `prezenta.js` `8e852437…`)** — ieșirile în `_proba/*_reparare*.txt`:
- `test_joc.py` → TRECUT (43 de întrebări; doar „1 niveluri”); `verifica_lectie.py … --fara-t1` → 0 (S0, S1, S2, T0 TRECUT; T0 prinsese „rând” și „în formular”≈„În formare”: reformulate);
- R6: `verifica_regula.py` → 0, `oracol_m1l01.py vii/m1-l01` → 0 (P2 text 107, „Uite cum” ≤ 85 cu legenda; P3 text 109, „Uite cum” ≤ 85), `oracol_nota_site.py` → 0;
- R2: `intrare_cod_texte.py --lectie vii/m1-l01` → 0 (65 de bucăți dintre „…”, 2 excepții vechi), `--mutant` → 13 din 13 prinși; `_proba/r2_nume_cod.py` → 0 (53 de nume);
- R4 (izolarea), în `gesturi_e2.py`: 16 ferestre de exersare (cu noul „Încă” al clasei greșite), 0 accese din `intrare-cod.js`, 0 chei `lh_*` schimbate, 0 cereri;
- gesturi reale până la „TERMINATĂ” și diplomă, 390 cu atingere + 1280 → 0 (eticheta adevărată vizibilă la paragraful „Acum, de-adevăratelea”, ieșirea după ultima întrebare și pe diplomă, „Ieși” la plecare); capturile de telefon `_proba/_tel_e2_p2_exersare.png`, `_tel_e2_p3_dupa.png`, `_tel_e2_diploma.png` privite;
- `_proba/proba_reparare.py` (faptele de mai sus), rularea finală 1280 + 390 → 0; rețeaua: 60 de cereri oprite (fonturi), 0 trecute;
- `learninghub_date_personale.py` → 0; `activitate.py lista`: niciun nume de probă (Vlaicu Sorina, Toma Radu, Lazăr Bianca, Dobre Matei, Pavel Irina). Ieșirea listei NU e păstrată (are numele elevilor adevărați).
