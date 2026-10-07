# Surse — lecția V · M1 · nr. 1

**„Ce facem anul acesta la Informatică și TIC. Criteriile de evaluare și cele trei niveluri”** · tip: organizare + evaluare inițială · unitatea V-E0 („Deschiderea anului. Cum se învață și cum se notează la informatică”, CS.1.1) · cheia `lectie_v_m1_l01` · scrisă 27.09.2026, reparată 28.09.2026 după judecător (`_verificare\judecator.md`), refăcută 29.09.2026 pe regula de notare a profesorului (secțiunea „Regula de notare nouă”), aliniată 01.10.2026 la actele oficiale și la literele ministerului (secțiunea „Alinierea la actele oficiale, 01.10.2026”, imediat mai jos).

E PRIMA oră de informatică a elevilor. Pagina nu presupune nimic. Intro-ul predă cum spui cine ești pe calculatorul COMUN din laborator, iar pașii 2-3 predau cum se folosește o lecție pe pași (butoanele reale ale motorului).

## Alinierea la actele oficiale, 01.10.2026

Cererea profesorului (01.10.2026, `_campaign\isj_aliniere_2026_10_01\contract.md`): „aliniaza si lectiile 1 de la 5, 6 si 7”; „mentioneaza ca explicarea se cere la alte clase mai mici deci ar trebui ca elevul sa fie capabil si aici.. probabil”; „folosim etichetarea/notarea oficiala”. Faptele și formulările: `BRIEF_COMUN.md` §1-§3 (același dosar); modelul: `lectii\viii\m1-l01` (secțiunea „Materialele ISJ” din `surse.md`-ul ei).

Sursele (toate citite pe disc):
- **[MO-A2]** Monitorul Oficial 674 bis/14.08.2026, pag. 14, anexa 2 a OMEC 4.615/2026 (citită ca imagine, `mo_p14.png` din scratchpad-ul campaniei): tabelul „Niveluri de dezvoltare a competențelor”;
- **[MO-A15]** anexa 15, Informatică și TIC V-VIII: `C:\00\AI_0\knowledge\legal_corpus\primary_law\standarde_evaluare_informatica_tic_V-VIII_2026.txt`, clasa a V-a;
- **[ROFUIP]** `knowledge\legal_corpus\primary_law\rofuip_2024.txt`, r. 656, art. 106 alin. (10);
- **[ME]** răspunsul Ministerului Educației și Cercetării din 28.07.2026, citat în `Info_Gimnaziu_2026\SISTEM_EVALUARE.md` r. 32; **[CNCE]** `Classroom_ISJ_2026-2027\_date\text\A_2026-2027\2_CNCE_materiale_suport\Prezentari_generale_CNCE\02_Prezentare_SNE_primar_gimanziu.pptx.txt`, r. 116;
- **[FOAIA-1]** `Info_Gimnaziu_2026\materiale\print\Saptamana1_clasa_V.html` („Evaluare inițială — clasa a V-a”, generată 29.09.2026).

| # | Ce spun actele (citat) | Ce spunea lecția | Ce spune acum (unde) |
|---|---|---|---|
| 1 | [MO-A2]: „A · Avansat”, „B · Consolidat”, „C · De bază”, „D1 · În formare”, „D2 · În dificultate” | părțile lucrării A · De bază 40, B · Consolidat 30, C · Avansat 20, în ordinea A, B, C, peste tot (P6 tabel și exerciții, P7, atelier, Î4, Î5, laborator 4, diploma, meta-descrierea); nivelurile din P5 fără litere | P5: nivelurile cu literele lor („C · De bază”, „B · Consolidat”, „A · Avansat”), „cu literele lor”; P6: „Fiecare lucrare are trei părți, cu literele nivelurilor, în ordinea de pe foaie”: C · De bază 40, B · Consolidat 30, A · Avansat 20. Toate datele convertite: vechiul A ↔ noul C, B rămâne B, scrise C, B, A (ex. Paul „A 25, B 28, C 19” → „C 25, B 28, A 19”; Bianca `a:36,b:26,c:13` → `c:36,b:26,a:13`). Punctele pe nivel sunt aceleași, deci toate punctajele și notele au rămas; s-a schimbat litera părții de lucrat: Paul C, Radu A, Bianca A, Dana C, Emil C (Cristi, Flavia, Gabi: B). Simulatorul: `punctaj = C + B + A + 10`, `undePierdut` = 40 − C, 30 − B, 20 − A; butoanele rândului 4: „C · cu model”, „B · singur”, „A · situație nouă” |
| 2 | [FOAIA-1]: „B = De bază · C = Consolidat · A = Avansat — nivelul pe care îl verifică fiecare cerință” (din `print_engine.py` r. 287) | P7 „Uite cum”: „Pe foaie, litera din bulina unei cerințe (ca în „B (15 p)”) arată nivelul cerinței, nu partea: B = De bază, C = Consolidat, A = Avansat.” | P6 „Uite cum”: „Atenție: pe foaia testului de la prima oră, literele B și C erau inversate. De acum, literele sunt ale ministerului, ca aici.” (formula veche nu mai e scrisă) — **DEPĂȘIT (01.10.2026, după-amiaza): nota era incompletă; textul nou e în „Nota despre literele vechi, refăcută”, mai jos** |
| 3 | [MO-A2] D1: „sprijin educațional constant și individualizat în învățare, care poate avea loc la nivelul clasei”; D2: „sprijin educațional specializat în învățare, care trebuie să aibă loc extern clasei” | P5: „Nivelurile sunt trei”; P7: În formare / În dificultate doar ca nume în tabel | P5: „Ministerul Educației și Cercetării descrie, la tot ce înveți, trei niveluri” + „În total, ministerul numește cinci niveluri: încă două sub De bază (pasul 7).”; P7, sub nume în tabel: „ajutor doar pentru tine, la oră” / „ajutor special, în afara orei”. Exercițiul cu Victor (nota 4) cere acum ajutorul nivelului: „În formare: ajutor doar pentru el, la oră” |
| 4 | [MO-A15] clasa a V-a: toți descriptorii Avansat „independent … în contexte noi”, fără explicație, CU O EXCEPȚIE: CS 2.2 (r. 218-222) „Elevul analizează, independent, situații algoritmice date, pentru a identifica și clasifica datele utilizate de algoritmul corespunzător, **justificând rolul acestora în prelucrare**, în contexte noi”. CS 2.2 se predă în V-U5 „Algoritmi. Gândesc pas cu pas” (`unitati.json`, lecția 26), numită în P4 „Pas cu pas” | P5: Avansat = „…pe care n-ai mai văzut-o și poți explica de ce ai făcut așa”; „Uite cum”: „și explici cum ai socotit”; „altfel”: „îi poți explica fratelui mai mic”; exercițiile cu Radu (P5) și Irina (Î3) „și explică”; why-ul de la „50 de exerciții”: „plus explicația ta”; laborator 3 și 6 | P5: „A · Avansat rezolvi singur, după cerință, o situație pe care n-ai mai văzut-o.” + „Explicația („de ce ai lucrat așa”) lipsește din descrierea lui Avansat, dar la un lucru din „Pas cu pas” ministerul chiar o cere.” Exemplul, „altfel”, exercițiile și laboratorul despart Avansat după situația nouă, fără explicație. Partea A a lucrării cere în continuare „o situație nouă și explicația ta” (P6 tabel, Radu, Î4): **regula profesorului rămâne**, spusă în P6: „Părțile și nota sunt regula profesorului.” |
| 5 | [ME]: „Nu există un document oficial care să stabilească transformarea nivelurilor de performanță în note”; [CNCE]: „Utilizarea SNE în evaluare nu conduce direct la notă” | P7: „La o lucrare, din notă îți afli și nivelul:”, fără a spune a cui e regula | P7: „Niciun document oficial nu leagă nivelul de notă. Regula profesorului tău: la o lucrare, nivelul se citește din notă.” „După regula profesorului” oriunde nota duce la nivel: P7 „Uite cum” (Paul), „altfel” („Profesorul tău a scris pe fiecare cutie două note”), Sara (cerința, indiciul, explicația), Victor (cerința), Î5 Alina (cerința, indiciul, explicația), atelier (intro, rândul 3, testul 3, mesajele, răspunsul arătat, cele 6 explicații, indiciile Danei și ale lui Emil), laborator 5 și 6, diploma, meta-descrierea |
| 6 | [ROFUIP] art. 106 (10): „Elevii vor beneficia pe parcursul unui an școlar de cel puțin un plan individualizat de învățare, elaborat în urma evaluărilor susținute și după interpretarea rezultatelor de către cadrul didactic, care va fi folosit pentru consolidarea cunoștințelor, pentru întreprinderea unor acțiuni de învățare remedială și pentru stimularea beneficiarilor primari capabili de performanțe superioare” | „plan de recuperare”, 10 locuri (P7 text; Victor: cerința are 4 variante cu „plan de recuperare”, indiciul, explicația; Flavia; Gabi „fără plan de recuperare”; laborator 5; simulatorul) | P7: „Fiecare elev primește, pe an, cel puțin un plan individualizat de învățare: pașii lui următori. Sub nota 5, pașii te duc la De bază.” (aceleași cuvinte în laboratorul 5); Victor și Flavia: „pașii planului … individualizat de învățare îl/o duc la De bază”; Gabi (nota 5): fără nicio mențiune (planul îl are oricum); simulatorul, sub 5: „pașii planului individualizat de învățare duc la De bază”. 0 „plan de recuperare” în pagină |
| 7 | numele din ordin: „Ministerul Educației și Cercetării” | lecția nu numea ministerul | P5 (prima propoziție) |

**Ce NU s-a schimbat (decizia din 29.09.2026):** nota = punctaj : 10, rotunjită după ultima cifră (la ,5 în favoarea elevului); punctele pe nivel (De bază 40, Consolidat 30, Avansat 20, oficiu 10); tabelul notă → nivel; cel puțin o notă pe modul. Toate numerele exercițiilor sunt aceleași (Tudor 76 → 8, Ilinca 65 → 7, Ioana 74, Maria 68 → 7, Paul 82 → 8, Sara 72 → 7, Radu 83 → 8, Alina 75 → 8, atelierul 85/67/67/82/32/45); le-am refăcut toate prin `_proba\reproba_notare.py`.

**Ce am scurtat ca să rămân sub plafon** (oracolul campaniei numără tot textul pasului, cu legenda pozei; `_proba\cuvinte.py` o scoate):

| Pas | Text înainte → după (oracol; în paranteză fără poză) | „Uite cum” înainte → după | Ce a ieșit / s-a mutat |
|---|---|---|---|
| P1 | 134 (108) → 110 (91) | — | legenda: „Sala de informatică a unei școli din Innsbruck, Austria.” (fără „calculatoarele stau pe mesele de lângă perete”); „să faci chiar un joc”; „aceleași pentru toți. Le știi dinainte”; „Nu se notează” |
| P5 | 86 → 110 | 70 → 71 | „La tot ce înveți, profesorul se uită la ce știi să faci, nu la cât ai scris” și „Ordinea lor e aceasta: …” (lista arată ordinea; exercițiul de ordonare a rămas) |
| P6 | 110 → 110 | 58 → 80 | prima propoziție („Ultima lecție din fiecare unitate e o lucrare” e în P4); capul tabelului „Partea și ce cere” → „Partea” |
| P7 | 110 → 108 | 77 → 68 | „Testul de la început nu se notează” (e în P1 și în explicațiile exercițiilor 3-4 din P7); „Părțile C, B și A îți arată unde ai pierdut puncte, deci ce ai de lucrat” s-a mutat la începutul „Uite cum”; „(bucata anului …)” → „(dintre două vacanțe)” (modulul e definit în P4); nota despre literele foii s-a mutat în P6 |

Drumul obligatoriu (`_proba\drum_cuvinte.py`): 3090 → **3158** (+68: cele cinci niveluri, ajutorul D1/D2, a cui e regula, planul fiecărui elev, nota despre explicație).

**Hotărâri de formulare (de confirmat):** (a) „la un lucru din „Pas cu pas” ministerul chiar o cere” în loc de „la competența 2.2, datele unui algoritm, standardul cere să justifici”: „competență”, „standard”, „algoritm” și „justifici” nu se predau la prima oră (`profil.json`, „nu_stie_si_nu_se_foloseste”); (b) etichetele nivelurilor din P5 poartă litera („C · De bază”), dar butoanele exercițiilor de clasificare din P5 și Î3 au rămas doar cu numele; (c) banda de sus („De bază → Consolidat → Avansat”) a rămas fără litere, ca să încapă pe telefon; (d) CSS: `.niv.c` (chenarul dublu al lui Consolidat) a devenit `.niv.b`, constanta nefolosită `PARTE` a ieșit, `NIV` are cheile C/B/A.

**Probele (01.10.2026, toate cu rețeaua externă oprită, regula 24):**
- `python …\isj_aliniere_2026_10_01\oracol_m1l01.py v/m1-l01` → **0** (erau 20); `notare_punctaj_2026_09_29\verifica_regula.py` → **0**; `verifica_lectie.py index.html --fara-t1` → **0** (S0-S2, T0 trecute; T1 nerulat).
- `_proba\reproba_notare.py`, rescris pe schema C/B/A (tuplurile în ordinea de pe foaie, `MAXIM = {C: 40, B: 30, A: 20}`) și cu verificări noi: „plan de recuperare” absent, „partea X” ↔ nivelul ei din anexa 2, „la X din N” cu maximul bun, nicio cerință/exemplu în ordinea veche A, B, C, ajutorul D1/D2 la Victor, planul spus doar sub 5, „regula profesorului” în explicațiile atelierului, „la X: N (are M din T)” și la Radu → **931 de verificări, 0 probleme**. `_proba\mutanti_notare.py`: cei 12 mutanți vechi mutați pe textul nou + 7 noi (schema veche întoarsă la Bianca, Radu, Paul, laborator, în simulator; Flavia fără plan; „plan de recuperare” înapoi) → **19 din 19 prinși**.
- `_proba\parcurge.py` (gesturi reale, 390 px atingere și 1280 px mouse) → **0**; capturile P5, P6, P7 și atelierul la 390 px privite: etichetele cu literă, tabelul cu ajutorul D1/D2 și foaia simulatorului (C, B, A) încap. Scriptul din pagină: `node --check` trecut.
- Copia de dinainte: `_proba\inainte_2026_10_01\` (index.html, afirmatii.json, profil.json, surse.md, reproba_notare.py, mutanti_notare.py).
- `afirmatii.json`: A03, A11, A13-A20, A23 refăcute (triplurile de puncte în ordinea C/B/A); `profil.json`: ce face pagina, ce predă (nivelurile cu litere, lucrarea C/B/A, regula profesorului, ajutorul D1/D2, planul), ce NU folosește (standard, competență, algoritm, justifici), legătura cu lecția 7.

**Nesigur (01.10.2026):**
- „De acum, literele sunt ale ministerului” pe foi depinde de generatoare: la 01.10 `print_engine.py` r. 287 avea încă „B = De bază · C = Consolidat · A = Avansat”. Le schimbă dirijorul (contract R3), nu lecția.
- Lecția 7 (`lectii\v\m1-l07`) avea încă, la 01.10, schema veche (5 × „A · De bază”, 5 × „C · Avansat”); se aliniază în aceeași campanie. Acordul din secțiunea 5 („Acord cu lecția 7”) e de reverificat după alinierea ei.
- Fișa din caiet (`Fisa_criterii_elev_clasa_V.md`) se rescrie în paralel (contract R2); definițiile din P5 urmează `BRIEF_COMUN.md` §3, nu le-am comparat cu fișa nouă.
- Bucla de critici și repromptarea T1 nu le-am rulat eu (le pornește dirijorul).

### Nota despre literele vechi, refăcută + nota 1 (01.10.2026, după-amiaza; bucla de critici, sarcinile G1 și G2)

**G1 — nota istorică.** Nota de mai sus spunea doar că pe foaia testului B și C erau inversate. Foaia de la prima oră avea însă și pagina „Cum se transformă în notă” (lipită în caiet), cu **alte litere la părți**: `git show c706158:materiale/print/Saptamana1_clasa_V.html` (Info_Gimnaziu_2026), pagina a 2-a: „A · ca la clasă, cu model · 40”, „B · singur, situație cunoscută · 30”, „C · situație nouă + explicație · 20”; pagina a 3-a (testul): „B = De bază · C = Consolidat · A = Avansat — nivelul pe care îl verifică fiecare cerință”. Lecția publicată până pe 01.10 (LearningHub `HEAD` = `eab6aa4d`) avea și ea „Partea A · De bază” 40, „Partea C · Avansat” 20. Deci la părți s-au schimbat între ele A și C, la test B și C.

| Unde | Înainte | Acum |
|---|---|---|
| P6 „Uite cum” | „Atenție: pe foaia testului de la prima oră, literele B și C erau inversate. De acum, literele sunt ale ministerului, ca aici.” | „Atenție: pe fișa din caiet și în lecție, până pe 1 octombrie, partea A era cea cu model (40 p), iar C cea cu situația nouă (20 p). Pe testul de la început, B și C erau inversate.” („De acum, literele sunt ale ministerului” a ieșit: P5 spune deja „Ministerul Educației și Cercetării descrie … trei niveluri, cu literele lor”) |
| P6 „Uite cum” | „La jumătate (85 : 10 = 8,5), rotunjirea e în favoarea ta: nota 9.” | scos, ca nota să încapă (82 de cuvinte; cu el ar fi fost 96). Cazul de la jumătate rămâne în textul pasului („85 → 8 + 1 = 9”), în „altfel” („fix la mijloc, ca la 85 … 9”) și în explicația exercițiului Ilincăi („La jumătate (65 : 10 = 6,5), rotunjirea e în favoarea elevului”) |

**G2 — nota 1.** ROFUIP art. 106 alin. (9) (`rofuip_2024.txt` r. 656): „Pentru frauda constatată la evaluările scrise … se acordă nota 1”; despre lucrarea nepredată regulamentul nu spune nimic. Regula „lucrarea nepredată = nota 1” e a profesorului (`SISTEM_EVALUARE.md` §4.2, din 06.09.2026 în grila lui: „1 la lucrare nepredată sau fraudă”; `REGULA_NOUA.md` §1, 29.09.2026). De acum lecțiile 1 V-VIII, fișele de criterii și `SISTEM_EVALUARE.md` spun același lucru: copiatul = nota 1 (regulamentul), lucrarea nepredată = nota 1 (regula profesorului).

| Unde | Înainte | Acum |
|---|---|---|
| P7 text | „Copiatul înseamnă nota 1.” | „Copiatul: nota 1; după regula profesorului, și lucrarea nepredată.” |
| P7 text | „Regula profesorului tău: la o lucrare, nivelul se citește din notă.” | „Regula profesorului tău: nivelul se citește din notă.” (ca pasul să rămână la 110 cuvinte; `SISTEM_EVALUARE.md` §4.3 nu restrânge regula la lucrări) |

Cuvinte (oracolul, rețeaua oprită): P6 text 110, „Uite cum” 80 → **82**; P7 text 108 → **110**. Fișierele de dinainte: `C:\00\_bucla_backups\2026-10-01_G1G2_notare\LearningHub\lectii\v\m1-l01\` (în afara depozitului). `afirmatii.json`: A14, A16, A17, A18; `profil.json`: lucrarea, nivelul din notă și nota 1, „65 : 10 = 6,5”.

## Regula de notare nouă (29.09.2026)

Hotărârea profesorului, 29.09.2026: **nota = punctaj : 10**, **nivelul se citește din notă**, **cel puțin o notă pe modul** (cel puțin 5 pe an). Sursa unică pentru agenți: `_campaign\notare_punctaj_2026_09_29\REGULA_NOUA.md`. Documentele profesorului, deja rescrise, au prioritate: `Info_Gimnaziu_2026\SISTEM_EVALUARE.md` §3-4 și `instrumente\Fisa_criterii_elev_clasa_V.md` §4-6; nu contrazic REGULA_NOUA în nimic din ce predă lecția. Lecția nu spune că regula s-a schimbat și nu o pomenește pe cea de dinainte: elevii n-au încă fișa în caiet.

Au rămas la fel: numărul de pași (pasul 0 + 6), forma („Uite cum” / „Încearcă tu” / „Explică-mi altfel” / „Încă un exercițiu”), intro-ul cu „cine lucrează”, pașii 1-4, atelierul (tot simulatorul „lucrare”, tot 6 lucrări) și laboratorul (tot 8 pași). S-a schimbat doar ce ține de notare:

| Loc | Ce predă acum |
|---|---|
| P6 „Lucrarea: trei părți și nota ta” | tabelul A 40 / B 30 / C 20 / oficiu 10, fără coloana de praguri; „**Nota = punctaj : 10.** Punctajul e A + B + C + 10 din oficiu”; rotunjirea după ultima cifră (0-4: numărul de zeci; 5-9: numărul de zeci plus 1): 82 → 8, 85 → 8 + 1 = 9. „Uite cum”: Maria, 31 + 21 + 6 + 10 = 68 → 7 (exemplul din SISTEM §4.4) și „la jumătate” (85 : 10 = 8,5 → 9). „Altfel”: metrul de croitorie. „Încearcă”: Tudor 30/18/18 → 76 → 8. Încă un exercițiu: Ilinca 28/19/8 → 65 → 7 (la jumătate); cerințele pe părți, totalul Ioanei și oficiul au rămas. |
| P7 „Din notă afli nivelul” | tabelul notă → nivel (9-10 Avansat, 7-8 Consolidat, 5-6 De bază, 3-4 În formare, 1-2 În dificultate); plan de recuperare sub nota 5; „Părțile A, B și C îți arată unde ai pierdut puncte, deci ce ai de lucrat”; „Primești cel puțin o notă în fiecare modul (bucata anului dintre două vacanțe), deci cel puțin 5 pe an. Testul de la început nu se notează. Copiatul la lucrare înseamnă nota 1.” „Uite cum”: Paul 25/28/19 → 82 → 8, Consolidat, de lucrat la A (exemplul canonic); litera din bulina foilor. „Încearcă”: Sara 22/24/16 → 72 → 7 → Consolidat. Încă un exercițiu: Victor (nota 4 → În formare, cu plan), Radu 38/27/8 (83 → 8, de lucrat la C), testul de la început, câte note. |
| P5 „Cele trei niveluri” | „ca trei trepte” și „Urci pe rând” au ieșit, ca să nu sune a regulă de nivel: „Ordinea lor e aceasta: De bază, Consolidat, Avansat.” Exercițiul de ordonare: „de la primul la ultimul”. |
| Atelier „Atelier: afli nota și nivelul din lucrare” | simulatorul are 4 rânduri și 4 teste: punctajul (4 variante crescătoare, mereu și cea fără oficiu; locul celei bune diferă), nota (butoanele 1-10), nivelul, partea cu cele mai multe puncte pierdute. Lucrările: Bianca 36/26/13 → 85 → 9, Avansat (C); Cristi 29/12/16 → 67 → 7 (B); Dana 15/25/17 → 67 → 7 (A); Emil 26/27/19 → 82 → 8, Consolidat (A); Flavia 14/2/6 → 32 → 3, În formare + plan (B); Gabi 20/5/10 → 45 → 5, De bază (B). Cristi și Dana: același punctaj, aceeași notă, altă parte de lucrat. Greșelile tipice din `gresit`: uită oficiul, rotunjește în jos la jumătate, rotunjește mereu în sus, ia nivelul după partea C. |
| Laborator | pasul 4: părțile, oficiul și „Nota = punctaj : 10, rotunjit după ultima cifră (82 de puncte → nota 8; 85 → 9)”; pasul 5: ce nivel se citește din fiecare notă și planul sub nota 5. |
| Î5 | Alina 33/17/15 → 75 → nota 8, Consolidat (variantele greșite: 7 = în jos la jumătate; 6 și De bază = fără oficiu; Avansat = după partea C). |
| intro, „Cum lucrezi”, obiectivul, descrierea, diploma | „cum se află nota și nivelul”; diploma: părțile, nota = punctaj : 10, nivelul din notă, ce arată părțile. |
| `afirmatii.json` | A03, A11, A13-A20 refăcute; socotelile au forma „Nume a/b/c → punctaj → nota N → nivel → partea”, ca scriptul să le refacă. |
| `profil.json` | presupune zecile și unitățile (nu fracțiile zecimale); predă nota din punctaj, nivelul din notă, câte note. |

### Reparațiile după judecătorul notării (29.09.2026, `_verificare\judecator_notare.md`: 0 GRAV, 0 MAJOR, 4 MINOR)

| Nr. | Ce era | Ce am făcut | Unde |
|---|---|---|---|
| N1 MINOR | „Dana a pierdut cele mai multe puncte la A (25 din 40)”: aceeași paranteză înseamnă în P7 cât ARE elevul | Peste tot aceeași formă: întâi cât a pierdut, apoi cât are pe foaie. Dana: „la A: 25 (are 15 din 40)”; Bianca „la C: 7 (are 13 din 20)”; Cristi „la B: 18 (are 12 din 30)”; Emil „la A: 14 (are 26 din 40)”; Flavia „la B: 28 (are 2 din 30)”; Gabi „la B: 25 (are 5 din 30)”; Radu (P7, încă un exercițiu 2): „(are 38 din 40) … (are 27 din 30) … (are 8 din 20)”. Paul (P7, „Uite cum”) avea deja forma asta | atelier, explicațiile celor 6 lucrări; P7 încă un exercițiu 2 |
| N2 MINOR | „de la 5 la 9, nota crește cu 1”, fără „față de ce” | „de la 5 la 9, nota e numărul de zeci plus 1 (85 → 8 + 1 = 9)”. La fel în mesajul rândului 2 din atelier și în explicațiile care spuneau „crește cu 1”: Tudor (7 + 1 = 8), Ilinca (6 + 1 = 7), Bianca (8 + 1 = 9), Gabi (4 + 1 = 5), Î5 Alina (7 + 1 = 8). Ca P6 să rămână sub plafon, din prima propoziție a ieșit „pe foaie sau la calculator” | P6 text; simulatorul (mesajul rândului 2); P6 încearcă + încă un exercițiu 1; atelier; Î5 |
| N3 MINOR | proiectele nu mai apăreau ca sursă de note (fișa §5) | P7: „Nota vine dintr-o lucrare sau dintr-un proiect făcut la oră.”, după „…deci cel puțin 5 pe an.”; explicația de la încă un exercițiu 4: „cel puțin o notă în fiecare modul, dintr-o lucrare sau dintr-un proiect” | P7 text; P7 încă un exercițiu 4 |
| N4 MINOR | „nivelul se citește din notă” fără „la o lucrare”, deși P5, Î3 și „De unde pleci?” cer un nivel fără notă | P7 începe cu „La o lucrare, din notă îți afli și nivelul:”. Laborator, pasul 6: „La o lucrare, nivelul vine din notă; aici îl alegi după descrierile scrise la pasul 3.” Judecătorul propunea „de la pasul 5”; în laborator, pasul 5 e chiar tabelul notă → nivel, așa că am trimis la pasul 3, unde elevul tocmai a scris cele trei descrieri. P5 și Î3 au rămas cum erau: cer nivelul după descrieri, iar P7 spune acum că nivelul din notă e la lucrare | P7 text; laborator pasul 6 |

Cuvintele pe pașii atinși (`_proba\cuvinte.py`, plafonul: text 30-110, „Uite cum” ~80): **P6 text 110** (era 108), „Uite cum” 58; **P7 text 110** (era 97), „Uite cum” 77. Ambele la plafon, niciunul peste. Drumul obligatoriu: vezi rândul de mai jos.

**Rotunjirea „după ultima cifră” (hotărâre de autor).** La prima oră, elevul de a V-a nu are încă fracțiile zecimale. Pentru un punctaj întreg, „ultima cifră 0-4 → numărul de zeci; 5-9 → numărul de zeci plus 1” dă exact „cel mai apropiat întreg, la ,5 în favoarea elevului” (REGULA_NOUA §1: 85 → 9, 84 → 8, 76 → 8, 75 → 8, 74 → 7; probat în `_proba\reproba_notare.py`). „8,5” și „6,5” apar doar ca „la jumătate”, ca să lege regula de cuvintele fișei („la ,5 rotunjirea e în favoarea mea”).

**Contradicția J04 e rezolvată.** Rândul „Nota = punctaj : 10” de pe foile generate de `print_engine.py` (r. 296-297) e acum chiar regula clasei (SISTEM §4.2). Propoziția care îl explica a ieșit din „Uite cum” al P7. A rămas explicația literei din bulină (B / C / A = nivelul cerinței, r. 286), care e încă pe foi.

**Probele (29.09.2026):**
- Oracolul `python C:/00/Projects/LearningHub/_campaign/notare_punctaj_2026_09_29/verifica_regula.py`: **0 urme** în `v/m1-l01` (erau 21: 15 în index.html, 3 în afirmatii.json, 3 în profil.json).
- `_proba\reproba_notare.py`: regula scrisă din REGULA_NOUA §1-2, independent de codul paginii (Python, `ROUND_HALF_UP`). Citește numerele din configurația reală a paginii (exerciții, exemple, atelier, laborator, întrebări) și le reface. Le compară cu varianta bună, cu variantele greșite (să fie chiar greșite), cu explicația, cu `raspunsCorect()`/`variantePunctaj()` din pagină, cu tabelul din P7 și cu cele 14 rezultate promise din `afirmatii.json`: **507 verificări, 0 probleme** (după reparațiile N1-N4). `_proba\mutanti_notare.py`: 12 greșeli puse pe rând într-o copie (rotunjire în jos, nivel după C, fără oficiu, tabel greșit, număr schimbat, forma ambiguă „25 din 40”, „are” greșit, „crește cu 1”…) → **12 din 12 prinse**.
- `test_joc.py` → **TRECUT** (39 de întrebări jucate; doar avertismentul așteptat „1 niveluri”). `verifica_lectie.py … --fara-t1` → **ultima linie 0** (S2: aplicare/execuție 5 din 7 pe „Încearcă” + atelier, ca înainte). Încercarea din P7 (Sara) apare ca „recunoaștere” pentru că răspunsul „Consolidat” e scris în tabel, deși cere socoteala 22 + 24 + 16 + 10 = 72 → 7.
- `_proba\parcurge.py`, cu gesturi reale la 390 px (Pixel 7, atingere) și la 1280 px (mouse), cu rețeaua oprită (paza, regula 24) și închidere prin `ctx.close()`: fiecare exercițiu întâi greșit, apoi bun; atelierul pe 6 lucrări, 4 din 4 teste bifate; laboratorul; verificarea până la diplomă. **0 probleme, 0 erori în consolă, 0 cereri spre teste-vasile.** Capturile de telefon P6, P7 și atelierul după o greșeală, privite: tabelele încap; cele 10 butoane de notă trec pe două rânduri.
- Cuvinte: pe drumul obligatoriu (`_proba\drum_cuvinte.py`: intro, „Cum lucrezi”, la fiecare pas textul, „Uite cum” și „Încearcă”, atelierul, laboratorul, cele 5 întrebări) **3090 înainte, 3065 după rescriere, 3090 după reparațiile N1-N4** (am scurtat intro-ul atelierului, fraza nouă din laborator și explicațiile lui Tudor și Sarei, ca să nu treacă de valoarea de dinainte). M5 dădea „~1900”, numărat altfel (fără exerciții, spune judecătorul notării); pe aceeași măsură, înainte și după, drumul nu a crescut. Textul pașilor ≤ 110 cuvinte (P6: 110, P7: 110), „Uite cum” ≤ 80 (P7: 77) (`_proba\cuvinte.py` → 0).
- Copia de dinainte: `_proba\inainte_2026_09_29\` (index.html, afirmatii.json, profil.json, surse.md).

## 0. Reparațiile după judecător (28.09.2026), fiecare cu locul ei

| Nr. | Ce era | Ce am făcut | Unde |
|---|---|---|---|
| **J01 GRAV** | „scrie-ți numele … dacă nu e scris deja”: al doilea elev lucra pe numele primului | Paragraful „Întâi, spune cine ești”: te uiți deasupra căsuței „Numele tău” și jos pe ecran, apoi o listă cu cele 4 casete posibile și ce apeși la fiecare. Urmează „Gata?”: verifici că jos e numele TĂU, căsuța „Numele tău” și „Ia-o de la capăt” dacă lecția apare terminată de altul. „Când pleci”: eticheta de jos → „Nu ești tu? Schimbă elevul”. Probat cu doi (apoi trei) elevi pe același calculator: `_proba\doi_elevi.py` → 27 de verificări, 0 probleme | intro (cuprinsul), `intro:` în configurație |
| **J02 MAJOR** | caseta descrisă doar pentru calculatorul nou; codul de 4 cifre lipsea; „Mai târziu” îl scotea din evidență | Toate cele 4 stări (calculator nou / „Sunt elev — mă înscriu”; lista „Cine lucrează acum?” + „Nu sunt în listă”; „Lucrezi ca …” / „Pe calculatorul ăsta a lucrat …” + „Alege-te din listă”; „Ești tot …?”), codul de 4 cifre scris în caiet; „Mai târziu” nu mai e recomandat. Poza `img\casete-cine-lucreaza.webp` le arată, numerotate | intro |
| **J03 MAJOR** | „șase părți” vs cele cinci „module” ale paginii clasei, cu alte margini | „Părți” → **„unități”** (cuvântul fișei profesorului și al lecției 7). „Uite cum” al pasului 4: „Unitățile nu sunt modulele … cinci module, bucățile anului școlar dintre vacanțe … Modulul 2 are lecțiile 8–15 … Lucrările vin la sfârșitul unităților”; „Altfel”: manualul cu șase capitole și anul tăiat de vacanțe | P4 (text, „Uite cum”, „Altfel”, exercițiile), Î2, P6 |
| **J04 MAJOR** | foile generate de `print_engine.py` scriu „Nota = punctaj : 10” și literele B/C/A | Generatorul NEatins; în P7, „Uite cum”, o notă despre foi și despre literele B/C/A. **29.09.2026: rezolvat** — rândul de pe foi e acum regula clasei; a rămas doar litera din bulină (secțiunea „Regula de notare nouă”) | P7 |
| **J05 MAJOR** | pasul 2 avea ~12 idei | Împărțit: P2 „Caseta «Încearcă tu»” (cum răspunzi) și P3 „Butoanele lecției și bara de jos”, cu exerciții pentru bară (P3, pe bara de jos; tragerea pe telefon) | P2, P3 |
| J06 | 3 butoane ale motorului la 31 px | `.btn.sm{min-height:34px}` în stilul paginii (motorul NEatins); măsurat 34,0 px la 412 și 1280 px | `<style>` |
| J07 | „Explică-mi altfel” lipsea la pașii 1, 3, 5 | Fiecare dintre cei 7 pași are acum `altfel` | toți pașii |
| J08 | „După fiecare, un exercițiu” fals la pasul 1 | „Citești 7 pași scurți. După fiecare, în afară de primul, faci un exercițiu mic, fără puncte.” | `cum:` |
| J09 | „din stânga … din dreapta”, fals pe telefon | „Apasă întâi un rând din lista «Apasă întâi aici…», apoi perechea lui din lista «…apoi perechea».” | P4, „Încearcă tu” |
| J10 | pe telefon, „Laborator” nu se vede pe bară | P3: „Pe telefon, bara nu încape pe ecran: trage-o cu degetul spre stânga ca să vezi restul”, cu poza `img\bara-telefon.webp` (înainte / după tragere) și un exercițiu; laboratorul, pasul 7, spune la fel. Probat cu o tragere reală cu degetul (`_proba\captura_bara.py`) | P3, laborator pasul 7 |
| J11 | „nota lui” la Bianca, Dana, Flavia | mesajul folosește genitivul: „nota Biancăi / Danei / Flaviei / lui Cristi” | simulatorul `lucrare` |
| J12 | „de jos în sus” ambiguu | „unul sub altul, începând cu primul: De bază, apoi Consolidat, apoi Avansat” | laborator pasul 3 |
| J13 | fișa din caiet n-avea nivelul → nota | pas nou în laborator (5), cu „Verifică-te”. Din 29.09.2026: pasul 4 cere părțile și cum se află nota, pasul 5 nivelul citit din fiecare notă | laborator pașii 4-5 |
| J14 | tabla înmulțirii dată drept „model” | „doamna îți arată pe tablă cum se face 7 × 8, pas cu pas, iar tu faci la fel 6 × 8” | P5 „Uite cum” |
| J15 | ordonarea și „Golește” nepredate | P2: al patrulea fel de a răspunde, „pui în ordine: apeși bucățile pe rând; Golește le ia de la capăt”; categoria „Golește” în exercițiu și un exercițiu de ordonare chiar la P2 | P2 |
| J16 | pasul 6 avea două proceduri | P6 și P7, câte o procedură. Din 29.09.2026: P6 „Lucrarea: trei părți și nota ta” (nota din punctaj) și P7 „Din notă afli nivelul” (nivelul, planul, ce arată părțile, câte note); Î5 cere nota și nivelul | P6, P7, Î5 |

Regula 23 (calculatorul comun): pagina nu păstrează nimic în browser în afară de progresul motorului, care e deja pe sertarul elevului ales în „Spune cine ești”; „De unde pleci?” se scrie în caiet. Verificările nu spun „știi” pe baza răspunsurilor corectate după ce le-ai văzut. Nu există răspunsuri scrise de mână.

**Nr. de pași:** standardul cere pasul 0 + 3-5 pași; lecția are pasul 0 + 6 (J05 și J16 au cerut împărțirea a doi pași). E prima oră: jumătate din pași predau chiar pagina.

## 0b. Reparațiile după judecata a doua (28.09.2026, `_verificare\judecator2.md`)

| Nr. | Ce era | Ce am făcut | Unde |
|---|---|---|---|
| **K01 MAJOR** | cât stă „Ești tot X?”, diploma și cuprinsul arată numele lui X (partea de motor o repară dirijorul) | Chenar separat, după lista casetelor și ÎNAINTE de „Apoi începe”: „**Dacă jos scrie «Ești tot …?», răspunde ÎNTÂI.** Nu începe lecția până nu ai răspuns. Dacă nu e numele tău, apasă **Nu, sunt alt elev**.” | intro, `p.atentie` |
| M1 | pe telefon eticheta de jos se ascundea chiar în capul paginii (sub poza-legătură); pagina nu spunea unde e | (1) Poza cu cele 4 casete trece DUPĂ listă: la 412 px eticheta se vede acum în tot primul ecran (y 0-480) și e ascunsă doar cât poza e sub ea (y 600-960); la 390 px, ascunsă la y 840-1200 (`_proba\masoara_eticheta.py`). (2) Paragraf „Pe telefon”: se strânge într-o etichetă mică jos în stânga; când sub ea e o poză sau un buton, se face buton rotund (jos în stânga sau în dreapta) ori se ascunde; „Nu o vezi? Derulează puțin mai jos și reapare.” (cele patru moduri din `prezenta.js`: plină / rotundă în stânga / rotundă în dreapta / ascunsă) | intro |
| M2 | o propoziție despre total, în P6 | reformulată pe 28.09 (și după judecata a treia, N2). **29.09.2026: propoziția nu mai există**; P6 predă nota din tot punctajul | P6 |
| M3 | „A = Avansat” lângă cerințe, imediat după „partea A · De bază” | Paragraf separat în „Uite cum” pentru litera din bulina de lângă o cerință (ca în „B (15 p)”): arată nivelul cerinței, nu partea lucrării (judecata a treia, N1: pe foaie litera e MARE, într-o bulină; așa e pe Test_V-U1: „1. PARTEA A. … B (15 p)”). Din 29.09.2026: „**Pe foaie**, litera din bulina unei cerințe (ca în „B (15 p)”) arată nivelul cerinței, nu partea: B = De bază, C = Consolidat, A = Avansat.” | P7 „Uite cum” |
| M4 | „șase unități”, dar banda de sus scria „unitatea V-E0” | Banda (`ancoraText`): „lecția 1, ora de deschidere a anului, «Cum se învață și cum se notează la informatică» (în plan: V-E0; …)” — fără cuvântul „unitatea”. P4 „Uite cum”: „Lecția de azi și lecția 36 stau deoparte: prima deschide anul, a doua îl încheie, cu unde ai ajuns.” | banda de sus, P4 |
| M5 | ~1900 de cuvinte, prea mult pentru ora 1 alături de testul pe foaie | Cei 7 pași rămân. Pașii 7 și 8 din laborator (bara lecției; comparația cu colegul) încep cu „**Dacă mai ai timp (opțional):**”. Dacă pagina se face în ora 1 sau ca recitire după ea, hotărăște profesorul | laborator pașii 7-8 |

## 1. Documentele profesorului (au prioritate) și ce am luat din fiecare

| Document | Ce am luat |
|---|---|
| `Info_Gimnaziu_2026\instrumente\Fisa_criterii_elev_clasa_V.md` (fișa lipită în caiet) | nivelurile (§2), părțile lucrării (§3), nota = punctaj : 10 și nivelul din notă, cu exemplele 82 → 8 și 85 → 9 (§4), cel puțin o notă în fiecare modul, „unitate” (§5), testul de la început nu se notează, copiatul = nota 1, plan de recuperare (§6), „Ce trebuie să știu să fac anul acesta” (§1) (fișa rescrisă pe 29.09.2026) |
| `Info_Gimnaziu_2026\SISTEM_EVALUARE.md` | §1 („Anul are cinci module”), §2 (contextul nou), §3 (evaluarea inițială nu se notează; cel puțin o notă în fiecare modul), §4.1-4.4 (structura A/B/C, nota = punctaj : 10, nivelul din notă, exemplul A 31 / B 21 / C 6 → 68 → nota 7, refolosit ca „Maria”, și A 25 / B 28 / C 19 → 82 → nota 8, refolosit ca „Paul”) (rescris pe 29.09.2026) |
| `Info_Gimnaziu_2026\materiale\print\Saptamana1_clasa_V.html` | „De reținut” (situația nouă, nu cantitatea; „de la prima oră, nu după lucrare”) |
| `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_V-E0.md`, `materiale\continut\teste_initiale.json` | ora 1 = organizare + evaluare inițială (fisa_criterii, test_initial); ce verifică testul inițial |
| `Info_Gimnaziu_2026\data\unitati.json`, `planificari\Calendar_ore_5AM_5M.md` | cele șase unități și lecțiile lor; lucrările la 7, 12, 17, 23, 30, 35 (23 și 35 pe produs digital); 36 = unde ai ajuns |
| `LearningHub\lectii\plan.json`, `lectii\v\index.html` | cele cinci module ale paginii clasei: M1 1-7, M2 8-15, M3 16-21, M4 22-29, M5 30-36, cu vacanțele între ele (J03) |
| `LearningHub\assets\js\prezenta.js`, `jocuri\_motor\motor.js` (`cineLucreaza`) | casetele „cine lucrează” și butoanele lor, citite în cod și probate cu gesturi (J01-J02) |
| vaultul `C:\ObsidianVaults\Scoala\` | `20 - Predare\Informatica\Gimnaziu 2026-2027\00_START…md` r. 95 și 126 (fișa lipită în caiet + testul inițial la prima oră); `Standarde 2026-2027\Informatica_TIC_Clasa_a_Va.md` (descriptorii) |

Numele scurte ale unităților sunt ale mele (ca să nu folosesc cuvintele lecțiilor următoare):

| În pagină | Unitatea (unitati.json) | Lecțiile |
|---|---|---|
| Calculatorul, în siguranță | V-U1 Sisteme de calcul. Lucrez corect și în siguranță | 2–7 |
| Ordine în calculator | V-U2 Sistemul de operare. Ordinea în fișierele mele | 8–12 |
| Informații de pe internet | V-U3 Internetul ca sursă de documentare | 13–17 |
| Desene pe calculator | V-U4 Editoare grafice. Fac materiale digitale | 18–23 |
| Pas cu pas | V-U5 Algoritmi. Gândesc pas cu pas | 24–30 |
| Primul tău joc | V-U6 Din algoritm în joc: mediul grafic interactiv (Scratch) | 31–35 |

Lecția 7 numește unitatea „Sisteme de calcul” (cuvânt predat la lecția 3). Cele două nume le leagă „lecțiile 2–7”, iar ambele lecții spun acum „unitate”.

## 2. Harta pas → sursă

| Pas | Ce predă | Sursa |
|---|---|---|
| intro | cine lucrează: 4 casete + verificarea numelui + „Schimbă elevul” la plecare | prezenta.js, motor.js; `_proba\doi_elevi.py` |
| P1 La ce folosește | o oră pe săptămână; TIC; criteriile de evaluare; testul de la început nu se notează | unitati.json; fișa §6; SISTEM §3 |
| P2 Caseta „Încearcă tu” | butonul; cele patru feluri de a răspunde; „Verifică”, „Golește”; „Corect” / „Nu încă”; indiciul; după două greșeli | motor.js (TIPURI.*, ajutorButon, resolvePractice, revealButton) + `_proba\parcurge.py` |
| P3 Butoanele lecției și bara de jos | Pasul următor/anterior, Explică-mi altfel, Încă un exercițiu, Știu deja; bara, tragerea pe telefon | motor.js (learnPage, tabsFor, shell) + `_proba\captura_bara.py` |
| P4 Șase unități | unitățile, lecțiile, la ce folosesc; ultima lecție = lucrarea; lecția 36; unități ≠ module | unitati.json; Calendar; fișa §1; plan.json |
| P5 Cele trei niveluri | De bază / Consolidat / Avansat; situația nouă | fișa §2; Saptamana1; SISTEM §2 |
| P6 Lucrarea: trei părți și nota ta | A 40, B 30, C 20, oficiu 10; nota = punctaj : 10; rotunjirea după ultima cifră, la jumătate în favoarea elevului | fișa §3-§4; SISTEM §4.1-4.2, §4.4; REGULA_NOUA §1 |
| P7 Din notă afli nivelul | nivelul din notă; plan de recuperare sub 5; părțile = unde ai pierdut puncte; cel puțin o notă pe modul; testul de la început; copiatul; litera din bulină | fișa §4-§6; SISTEM §3, §4.2-4.4; REGULA_NOUA §2-3; print_engine.py r. 286 |
| Atelier „lucrare” | pe 6 lucrări inventate: punctajul, nota, nivelul, partea de lucrat; 4 teste bifate | SISTEM §4.2-4.4 (`raspunsCorect()` din pagină, refăcut independent de `_proba\reproba_notare.py`) |
| Laborator | fișa ta de criterii în caiet (nivelurile; părțile și nota din punctaj; nivelul din notă), „De unde pleci?”, bara lecției, colegul de bancă | cele de mai sus |

## 3. Contradicții și lipsuri în documentele profesorului (nu le-am ales în tăcere)

1. **REZOLVAT pe 29.09.2026 (J04): foile generate și regula clasei.** `Info_Gimnaziu_2026\generator\print_engine.py` scrie pe ORICE pagină de test sau de exerciții:
   - r. 286: „B = De bază · C = Consolidat · A = Avansat — nivelul pe care îl verifică fiecare cerință”;
   - r. 296-297: „Punctaj: … p + 10 p din oficiu = … p · Nota = punctaj : 10”.

   Le-am găsit în **18 fișiere** din `materiale\print\`: caietele și cheile M1 ale tuturor claselor (`Caiet_clasa_V_M1.html` de 5 ori), foile primei ore (`Saptamana1_*`, și testul inițial, care „nu se notează”) și **lucrarea lecției 7**, `Test_V-U1.html`. Pe 28.09, „Nota = punctaj : 10” contrazicea regula clasei. **Din 29.09.2026 e chiar regula clasei** (SISTEM_EVALUARE §4.2, fișa §4), deci contradicția nu mai există, iar lecția nu mai spune nimic despre acest rând. Rămân literele de nivel B/C/A, care răstoarnă literele părților lucrării (A = De bază); în Test_V-U1, pe același rând, „PARTEA A … Scrie A sau F … B”. Lecția le explică în P7 („Pe foaie, litera din bulina unei cerințe…”). **Generatorul NU l-am atins.**
2. **Punctajul testului inițial nu are forma 40/30/20** (De bază 40, Consolidat 35, Avansat 15), deși teste_initiale.json spune că structura e „aceeași ca la lucrările de peste an”. Nu contează la notare, pentru că testul nu se notează.
3. **Nu mai e o întrebare (29.09.2026):** fișa nu mai împarte notele pe feluri; spune „cel puțin o notă în fiecare modul” și că nota vine dintr-o lucrare sau dintr-un proiect făcut la oră. Pagina spune la fel.
4. **Nu mai e o întrebare (29.09.2026):** nota vine direct din punctaj (: 10), deci nu mai e nimic de ales între două note.
5. **Greșeală de tipar în fișă:** §2 scrie „pașii daţi” cu ţ cu sedilă; foaia tipărită are „dați”.
6. **„8/11 septembrie”** (SISTEM §3) vs Calendar (Brauner: 11.09). Pagina nu dă date.

## 4. Hotărâri de autor (de confirmat)

- **„Fără note pe pagină”** = pagina nu notează elevul (stele și XP la verificare, „nu note”). Atelierul îl pune în locul profesorului, pe lucrări INVENTATE, ca să aplice regula din fișa lipită în caiet.
- **Testul inițial nu e copiat:** cerințele lui folosesc, prin natura lor, cuvinte nepredate (regula 1); se dă la clasă, pe foaie. Pagina îl descrie și adaugă în laborator „De unde pleci?”, o autoevaluare fără notă.
- **„internet”** e singurul cuvânt din lecțiile următoare păstrat, într-o propoziție care anunță („vei învăța”).
- **„unitate”** în loc de „parte” (J03): e cuvântul fișei („evaluările de la finalul fiecărei unități”) și al lecției 7. „Temă” (propunerea judecătorului) ar fi încurcat tema pentru acasă, pe care pagina o pomenește de două ori.
- **Stil:** `.btn.sm{min-height:34px}` repară în pagină o problemă a motorului (J06); dirijorul poate să o mute în `motor.css`.
- **Tema:** caietul de informatică (pătrățele, marginea roșie); Kalam, Andika, Victor Mono (latin-ext).
- **Simulatorul „lucrare”** stă în pagină (`tipuri:{lucrare:SimLucrare}`); n-am atins `lectii\_sim\`.

## 5. Acord cu lecția 7 (`lectii\v\m1-l07\index.html`)

| Lecția 7 | Lecția 1 |
|---|---|
| „A · De bază rezolvi cu un model sau cu pașii dați” | „De bază rezolvi dacă ai un model sau pașii dați, la lucruri pe care le-ai mai făcut” (fișa) |
| „B · Consolidat rezolvi singur, lucruri de felul celor exersate” | „Consolidat rezolvi singur lucruri de felul celor exersate” |
| „C · Avansat rezolvi singur o situație nouă și explici de ce” | „Avansat rezolvi singur o situație pe care n-ai mai văzut-o și poți explica de ce ai făcut așa” |
| „evaluarea sumativă a unității «Sisteme de calcul»”, „lucrarea … pentru care primești o notă”; „Pagina nu dă note” | „Ultima lecție din fiecare unitate e o lucrare, cu notă”; stele și XP, nu note |
| „Ai nevoie de: lecția 1 — cele trei niveluri” | lecția 1 le predă |

Nicio contrazicere.

## 6. Imagini (toate sub 150 KB; proveniența în `img\SURSE.json`)

- `laborator-scoala.webp` — Wikimedia Commons, File:Brgapp-edv-klasse.jpg, Patrik Fimml, CC BY 2.5, verificată prin API cu `LearningHub-lectii/1.0 (educational site)`. 36 KB.
- `casete-cine-lucreaza.webp` — cele 4 stări, capturate de `_proba\doi_elevi.py` (nume inventate), montate de `_proba\montaj_casete.py`. 45 KB.
- `caseta-incearca.webp` — caseta de la P2, înainte și după o greșeală, fără rândurile exercițiului (`_proba\captura_incearca.py` + `montaj_incearca.py`), refăcută pe 28.09. 72 KB.
- `bara-telefon.webp` — bara pe Pixel 7, înainte și după o tragere reală cu degetul (`_proba\captura_bara.py`). 13 KB.

## 7. Porțile și probele (28.09.2026, după judecata a doua; cele din 29.09.2026 sunt în secțiunea „Regula de notare nouă”)

- `test_joc.py --dir …\lectii\v m1-l01` → **TRECUT** (37 de întrebări jucate pe Pixel 7 + iPhone SE; doar avertismentul așteptat „1 niveluri”). Unitatea -E0 e scutită de `continuturi` în poartă (dirijorul, 27.09); pagina declară cinstit `continuturi:[]`.
- `verifica_lectie.py … --fara-t1` → S0, S1, S2 (aplicare/execuție 5 din 7 pe „Încearcă” + atelier), T0 (0) TRECUT; **ultima linie 0**. P3 și P7 apar ca „recunoaștere”: P3 e vocabularul butoanelor (regula 5 o permite); P7, vezi rularea din 29.09 în secțiunea „Regula de notare nouă”.
- `_proba\parcurge.py`: gesturi reale la 390 px (Pixel 7, atingere) și 1280 px (mouse); la fiecare exercițiu întâi greșit, apoi corect; atelierul pe 6 lucrări; laboratorul (P5 → Laborator pe bară, „Verifică-te”); verificarea până la final. **0 probleme, 0 erori în consolă.** Capturile de telefon, privite: cuprinsul cu cele 4 casete, P3 cu bara, P6 și P7 cu tabelele (la iPhone SE tabelul lucrării avea o coloană tăiată: l-am refăcut pe 3 coloane).
- `_proba\doi_elevi.py` (J01/J02, regula 23), reluat pe 28.09 cu motor.js DE PE DISC (fără nicio reparație în memorie): server local, toate cererile care nu merg spre 127.0.0.1 OPRITE (fonturile vin din copia locală). Calculatorul 1: Ana se înscrie (1), termină lecția; Mihai vine: „Lucrezi ca Pop Ana” (3) → lista (2) → „Nu sunt în listă” → înscris, căsuța și progresul lui; după 90 de minute: „Ești tot Ionescu Mihai?” (4) → „Nu, sunt alt elev” → Ana își alege numele și își regăsește lecția terminată; la plecare, „Schimbă elevul” → lista cu ambele nume. Calculatorul 2: Radu apasă „Nu, doar vizitez” și își scrie numele; Dan vede „Pe calculatorul ăsta a lucrat Ene Radu” (3') → „Alege-te din listă sau înscrie-te” → formularul → căsuța și lecția îi sunt ale lui. **26 de verificări, 0 probleme.**
- Defectul din motor găsit pe 28.09 la 00:00 (`motor.js` r. 39: comentariul înghițise `const b=…`, iar după orice înscriere pagina se reîncărca goală) e reparat de dirijor; proba de mai sus confirmă (`doi_elevi.json`: „defectul de la r. 39” = False).
- `_proba\masoara_eticheta.py` (M1): unde e eticheta de jos la fiecare 120 px de derulare, la 412, 390 și 1280 px.
- **Regula 24 — cereri spre teste-vasile.** `_proba\proba_beacon.py`: ruta Playwright prinde și beacon-urile (`sendBeacon` apare ca „ping” și e oprit; 0 cereri scăpate spre un server de ascultare local). Toate probele mele cu elevi înscriși (`doi_elevi.py` de patru ori, `depanare_inscriere.py`, o depanare pe portul 8766) au rulat cu ruta care OPREȘTE tot ce nu merge spre 127.0.0.1: cererile spre `teste-vasile.netlify.app/api/activitate` și `/api/progres` au fost oprite, niciuna n-a plecat. Numele folosite: Pop Ana, Ionescu Mihai, Mocanu Dan (înscriși; școala Tupilați, clasa V) și Ene Radu (vizitator, neînscris). Probele pe fișierul local (`parcurge.py`, capturile, `proba_prezenta.py`) n-au înscris pe nimeni, iar `prezenta.js` trimite doar pentru un elev înscris; de azi au și ele paza (`_proba\paza.py`): la ultima rulare, 0 cereri spre teste-vasile. Singurele cereri externe care au plecat din probele mele de dinainte de regula 24 sunt spre Google Fonts (fișierele de font, fără date).
- `_proba\cuvinte.py`: textul pașilor are 91-110 cuvinte, „Uite cum” ≤ 79.
- Ținte de atingere: butoanele mici ale motorului 34 px, simulatorul ≥ 40 px, „Verifică-te” 44 px, bara 34 px.
- `curata_metadate.py`: lecția nu are fișiere Office de descărcat.

## 8. Nesigur

- (29.09.2026) Rotunjirea predată „după ultima cifră” e hotărârea mea, pentru elevii fără fracții zecimale; dă aceleași note ca fișa, dar cuvintele diferă de ale fișei („cel mai apropiat întreg”). De confirmat de profesor.
- (29.09.2026) „Unde a pierdut cele mai multe puncte” se socotește în puncte (40 − A, 30 − B, 20 − C), ca în cuvintele din SISTEM §4.4 („La partea C ai pierdut cele mai multe puncte”). Profesorul ar putea judeca și în procente (C are doar 20 de puncte). Ca pagina să nu depindă de alegere, toate lucrările ei (Paul, Radu, cele 6 din atelier) dau aceeași parte în ambele feluri; `_proba\reproba_notare.py` verifică asta. Prima variantă a atelierului avea 3 lucrări la care procentele dădeau altă parte (Dana, Flavia, Gabi): le-am schimbat numerele. (01.10.2026: cu literele oficiale, aceleași socoteli se scriu 40 − C, 30 − B, 20 − A; partea mică, de 20 de puncte, e acum A.)

- Profilul elevului (citește, mouse, clic, taste, tragere pe telefon) e presupus; de confirmat de profesor.
- Pe situl viu, cu serverul de progres, după înscriere caseta poate aduce progresul de pe alt aparat (cu același nume și cod). Probat doar fără server (cererile oprite).
- Lecția e scrisă după ora din 11.09: la Brauner e recitire.
- 27.09: o cerere spre API-ul Wikimedia Commons (prima căutare de fotografii, înainte de regula 22) a avut în User-Agent numele de utilizator al profesorului. De atunci, doar `LearningHub-lectii/1.0 (educational site)`; scripturile din `_proba\` nu trimit nimic spre servicii externe.

## 9. Nota cu munca pe LearningHub, 07.10.2026

**Ce am schimbat în pagină** (brieful `_campaign/nota_site_2026_10_07/BRIEF.md`):
- **P6 „Lucrarea: trei părți și nota ta”**: calculul notei lucrării a rămas (punctaj : 10, rotunjit după ultima cifră); s-a adăugat trimiterea „La lucrarea de modul contează și munca ta pe LearningHub: pasul următor.” Ca textul să rămână sub 110 cuvinte, rotunjirea e spusă într-o singură propoziție: „nota e numărul de zeci, plus 1 dacă ultima cifră e de la 5 la 9 (85 → 9)” — aceeași regulă ca înainte; exemplul „82 → 8” a ieșit din text (rămân Maria 68 → 7 în „Uite cum” și 85 în „altfel”).
- **P7 nou, „Munca ta pe LearningHub intră în notă”** (106 cuvinte; „Uite cum” 78): fără procente (la clasa a V-a nu s-au învățat): „lucrarea, socotită din 80 de puncte în loc de 100: din fiecare 10 puncte păstrezi 8” + cel mult 20 de puncte de pe LearningHub, cu cele patru părți; „Arată-mi răspunsul” e explicat pe loc („butonul de după două greșeli”); rotunjirea, „ca la pasul 6”. Toate punctajele lucrărilor din exemple și exerciții sunt zeci întregi, ca socoteala să se facă cu tabla înmulțirii (× 8).
- Vechiul P7 („Din notă afli nivelul”) e acum **P8**: trimiterile „(pasul 7)” din P5 și din atelier au devenit „(pasul 8)”; „Cum lucrezi”: 8 pași; „La final știi” și diploma pomenesc nota din catalog cu munca pe situl acesta.
- **P2 și „Cum lucrezi”**: „un exercițiu mic, fără puncte” → „fără note”, iar explicația „nu dau note și nici puncte” → „nu dau note” (de acum, felul în care lucrezi la exerciții se numără la punctele de pe LearningHub; o notă singur tot nu dau).

**Exercițiile pasului nou, cu socoteala** (fiecare verificată cu `python AI_0/tools/nota_site.py <punctaj> <puncte_site>`):
| Unde | Caz | Socoteala | Nota |
|---|---|---|---|
| Uite cum | Ana: 100 p, nimic pe LearningHub | 80 + 2 = 82 | 8 |
| Uite cum | Bogdan: 60 p, tot | 6 × 8 = 48; 48 + 20 = 68 | 7 |
| Încearcă | Mara: 90 p, 12 | 72 + 12 = 84 | 8 |
| Încearcă | Luca: 70 p, 9 | 56 + 9 = 65 (ultima cifră 5) | 7 |
| Încearcă | Sorin: 50 p, nimic | 40 + 2 = 42 | 4 |
| Încearcă | Irina: 40 p, tot | 32 + 20 = 52 (fără LearningHub: 34 → 3) | 5 |
| Încă 1 | Ioana: 90 p, nimic | 72 + 2 = 74 (nota lucrării ar fi 9) | 7 |
Încă 2-4: minutele nu contează (A/F), fără calculator acasă: la oră sau pe foaie (alegere), absența motivată (A/F).

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

(`Info_Gimnaziu_2026/SISTEM_EVALUARE.md` §4.5; regula în cod: `AI_0/tools/nota_site.py`, proba `nota_site.py proba` → 0; fișa din caiet: `instrumente/Fisa_criterii_elev_clasa_V.md`, „Munca mea pe LearningHub”.)

**Nesigur / de hotărât de profesor:**
- Ce notă dă **nivelul** (pasul „Din notă afli nivelul”): pagina îl citește în continuare din nota lucrării (punctaj : 10), cum o fac toate exercițiile de acolo. §4.5 nu spune dacă nivelul se citește din nota lucrării sau din nota din catalog; n-am scris nicio regulă nouă.
- „Vrei mai mult” (din §4.5) nu apare în lecție: în lecțiile de gimnaziu nu există o secțiune cu numele ăsta; partea de 4 puncte e spusă „pentru jocurile (făcute) în plus”. *(07.10.2026, mai târziu: §4.5 a fost corectat la fel — A = jocurile de antrenament și ce marchează profesorul „pentru nota mare”; citatul de mai sus e cel de acum.)*
- Motorul (`jocuri/_motor/motor.js`, neatins) scrie deasupra fiecărei casete „Încearcă tu · fără puncte, doar exersezi”. Exercițiul singur nu dă puncte, dar „Arată-mi răspunsul” se numără acum la partea de 6 puncte; de hotărât de dirijor dacă eticheta motorului se schimbă.
- Regula se anunță la clasă abia după etapa 5 a contractului (jurnalul cu punctele); pagina spune doar „de la ora în care o anunță profesorul”, fără dată.
- Jumătățile de lecție, perioada dintre lucrări și cazul „nicio lecție dată pe site” (§4.5) nu sunt în pagină: nu erau în lista din brief, iar pasul are deja 100+ cuvinte.

**Porțile (07.10.2026, după schimbare; rețeaua externă oprită la probele cu browser, regula 24):**
- `_campaign/nota_site_2026_10_07/oracol_nota_site.py` → 0 (pornise de la 8, câte 2 pe lecție);
- `_campaign/notare_punctaj_2026_09_29/verifica_regula.py` → 0;
- `_campaign/isj_aliniere_2026_10_01/oracol_m1l01.py v/m1-l01` → 0;
- `verifica_lectie.py … --fara-t1` → S0, S1, S2 (5/8), T0 TRECUT, ultima linie 0;
- `jocuri/_motor/test_joc.py --dir …/lectii/v m1-l01` → TRECUT (44 de întrebări jucate; avertismentul „1 niveluri” e cel obișnuit);
- proba în browser a pasului nou (Chromium, situl servit local, ctx.route care oprește tot ce nu e 127.0.0.1, ctx.close(); 1280 px cu mouse și 390 px cu atingere): trimiterea duce prin „Pasul următor” la pasul nou, eticheta lui pe bară e P7, „Arată-mi răspunsul” nu apare după o greșeală și apare după două, răspunsul bun e primit, 0 erori în consolă → 0 probleme. Scriptul probei a stat în afara depozitului (cerința lucrării: doar cele patru fișiere ale lecției).
