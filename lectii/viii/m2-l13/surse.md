# Lecția 13, clasa a VIII-a — „Evaluare sumativă: calcul tabelar”: surse, hărți, ce n-am putut verifica (06.10.2026, reparare 1)

Starea și deciziile autorului: `_proba\stare_autor.md`. Numerotarea pașilor = bara motorului: P1 „La ce folosește”, P2 „Cum arată lucrarea și cum se notează”, P3 „Partea C”, P4 „Partea B”, P5 „Partea A”, P6 „Înainte să predai”.

## Reparare 1 (după judecata 1: `_verificare\registru_j1.md`, punctele A-S)
| Punct | Ce s-a schimbat | Unde |
|---|---|---|
| A | Testele care ar da răspunsul au, până la prima verificare, un text care spune doar CE se cere (`ceInainte`): A1 „Graficul ia datele potrivite din tabel”, „Tipul graficului se potrivește cu ce vrea dirigintele”, „Pe grafic se vede numărul de voturi al fiecărei mascote”; B1 „Rezultatul e bun și la limită”; C1 „C4 are prețul sucului, ca număr”; C2 „B8 calculează media pe zi, cu AVERAGE”. După prima verificare apar textele adevărate. Laboratorul B1: „Rezultatul trebuie să fie bun pentru fiecare elev, și la limită” (Bogdan e numit doar în „Verifică-te”). | `excelx-test.js`, `index.html` |
| B | Etichetele se cer pe drumul din panglică, cu ambele nume: Proiectare diagramă (Chart Design) › Adăugare element de diagramă (Add Chart Element) › Etichete de date (Data Labels) › un loc din listă (cum le predă lecția 11 acum). Butonul + nu mai apare. | indiciul A1, „Verifică-te” partea A |
| C | Schimbarea elevului din casetă golește și proba GATA (nu doar pe cea începută) și o duce la C1; panoul final se arată numai dacă `RezultatElev.citeste` întoarce chiar proba aceea (același semn) pentru elevul de acum. Cu caseta golită, o probă gata încă neconfirmată devine „a cui?” în componentă (`golesteAlElevuluiDeAcum`, nu se șterge). | `excelx-test.js` |
| D | A1 rămâne transfer cinstit în partea A: priceperea de bază („graficul fără rândul Total”) e exersată în lecția 11, pasul „Inserezi graficul. Graficul ales” (la coloane). Mesajul fals „fără rânduri goale” e înlocuit, pentru zona cu Totalul, cu „Graficul ia și rândul 6, Total: în grafic, Totalul apare ca încă o mascotă, cu 26 de voturi…” (probat în Excel real: felia Total = 26). Întrebarea 5 nu mai cere capcana ca fapt predat: e acum alegerea zonei (antet + valori) și a tipului (radial) pentru părțile unui întreg. | `index.html` (`mesajZona`, Î5), `excelx-test.js` |
| E | „Verifică” pe foaia neatinsă (aceleași texte în celule, niciun grafic nou) nu socotește nimic: „Foaia e la fel ca la început. Punctele nu s-au socotit…”; spus și în intro și în panou. | `excelx-test.js`, intro atelier |
| F | Laboratorul: și 3-4 În formare, 1-2 În dificultate. | pasul „Socotește-ți nota” |
| G | „butonul rotund ▾ (Insert Pie or Doughnut Chart; în foaia din pagină scrie pe el Radială)”, ca lecția 11 („cel rotund”). | indiciul A1 |
| H | „Lucrează fără să te uiți în pașii lecției sau în atelier: aici citești doar cerința părții la care ești.” (registrul rămâne fără foaie de cerințe: n-a mai trebuit atins). | laborator, pasul 2 |
| I | Analogia nouă: ceasul de pe telefon (se schimbă singur) față de ora scrisă pe un bilet. | P3, „altfel” |
| J | Analogia nouă: știi deja să faci clătite și ți se cere doar „Fă clătite pentru patru”: pașii îi alegi tu. | P4, „altfel” |
| K | „Punctele se dau doar dacă ai sortat (foaia nu mai arată ca la început)”. | laborator B2 |
| L | Lista „Unde ai pierdut puncte” se citește din ce e salvat: apare și după reîncărcare, la „Prima ta probă” (pliată). | `excelx-test.js` |
| M | După `JocMotor.test.exercitiu(0)` se verifică dacă C1 e chiar pe ecran; dacă nu, panoul spune „Pagina nu te-a putut duce singură la C1…”, iar până la C1 nu se socotesc puncte. | `excelx-test.js` |
| N | Descărcarea e buton (`btn`, peste 32 px). Pe ecranele cu atingere, numai în paginile care încarcă extensia: celulele, capetele de rând și de coloană, butoanele și câmpurile panglicii au cel puțin 32 px. Legăturile din sursa fotografiei au umplutură până la 32 px. „Suc (cutii)” → „Suc” la C1 (coloana D se vedea tăiată la 390 px). | `excelx-test.js`, `index.html` |
| O | „o probă la fel, cu alte date” (laborator, „Cum lucrezi”, descrierea paginii); „Datele sunt altele decât în atelier, dar părțile sunt aceleași”. | `index.html` |
| P | „în celulele cu rezultat (un total, o medie, un cost) e o formulă…; datele de pornire, ca prețurile și notele, rămân numere scrise de tine”. | P6, lista |
| Q | La B1, fraza comună „Scrie în foaie chiar numărul din regulă” devine „Ca să faci testul la limită, scrie în B2 și în C2 notele 7 și 7: media din D2 devine exact 7. Apoi uită-te ce arată E2.” (rândul celulei greșite). | `index.html` (`mesajLimita`), `excelx-test.js` |
| R | Partea C, pasul 4: 5 puncte aldinul, 5 bordurile. | laborator |
| S | „Ai nevoie de”: fiecare rând, propoziții scurte de 1-4 lucruri. | antet |

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_8A_8M.md`, r. 21: „11.12.2026 | 13 | M2 | Evaluare sumativă: calcul tabelar | evaluare sumativă”. La fel în `data\unitati.json` (VIII-U1 = lecțiile 2-13; lecția 13 cu materialele „test_unitate, barem”).
- **Conținuturile** (`continuturi`): TOATE conținuturile unității VIII-U1, copiate întocmai din lecțiile 2-11 (care le-au luat din `curriculum.json`); `lectii:[2,…,11,13]`. Lecția 12 (mini-proiectul, alt autor, în paralel) nu e declarată și nu e repetată.
- **Descriptorii CS.1.1 și CS.3.1** (Anexa 15, O. 4.615/2026): `planificari\Proiectul_unitatii_VIII-U1.md`.

## Notarea și literele: documentele profesorului au câștigat față de sarcina dată autorului
- Sarcina autorului scria „A 40 + B 30 + C 20”. Documentele profesorului, rescrise pe 01.10.2026, au literele OFICIALE (Anexa 2, O. 4.615/2026): **C = De bază (40 p), B = Consolidat (30 p), A = Avansat (20 p)**, 10 din oficiu, pe foaie în ordinea C → B → A: `SISTEM_EVALUARE.md` §4.1, `instrumente\Fisa_criterii_elev_clasa_VIII.md` §3, `materiale\continut\teste_sumative.json` („_despre”). `REGULA_NOUA.md` §0: „Dacă ceva de aici pare să le contrazică, ele câștigă și scrii asta în `surse.md`.” Pagina folosește deci literele oficiale (confirmat de amândoi judecătorii). Punctele pe niveluri sunt aceleași (40 / 30 / 20), deci nota nu se schimbă.
- Nota = punctaj : 10, rotunjită la cel mai apropiat întreg, la ,5 în favoarea elevului; nivelul se citește din notă (9-10 A · Avansat, 7-8 B · Consolidat, 5-6 C · De bază, 3-4 D1 · În formare, 1-2 D2 · În dificultate): `SISTEM_EVALUARE.md` §4.2-4.3, `REGULA_NOUA.md` §1-2. Exemplul din pagină (P2) e cel canonic din fișă: 25 + 28 + 19 + 10 = 82 → nota 8. Pagina nu spune că regula „s-a schimbat” (`REGULA_NOUA.md` §6).
- Oracolele: `verifica_regula.py` → 0. Cazurile-limită, după reparare (`_proba\proba_note.py`, gesturi reale): zero (fiecare exercițiu greșit la prima verificare) = 10 → nota 1 · D2; perfect = 100 → nota 10; 95 → 9,5 → nota 10 „în favoarea ta”; 85 → 8,5 → nota 9.

## Testul profesorului pentru unitate NU există încă (de știut pentru profesor)
- `materiale\continut\teste_sumative.json` are un singur test, V-U1; `materiale\print\` are doar `Test_V-U1` și baremul lui. Pentru VIII-U1 nu există test, barem sau listă de cerințe.
- Ce am făcut, fără să inventez lucrarea: pagina spune doar ce e sigur din documente (structura C/B/A cu punctele ei, ce înseamnă fiecare nivel, regula notei) și conținutul predat în lecțiile 2-11. Proba de antrenament are itemi noi, scriși de autor; pasul P1 nu promite cum arată foile lucrării. **Nu știu dacă lucrarea se dă pe foaie sau la calculator**: pagina nu afirmă nici una, nici alta.
- **Inferență (de confirmat de profesor):** ce conținut cade la ce parte. Documentele spun că părțile diferă prin ajutor și context, nu prin materie (`SISTEM_EVALUARE.md` §2: „Diferența dintre Consolidat și Avansat este aproape întotdeauna contextul nou”; fișa §2-3). La C ce descriptorul De bază numește („date de tipuri implicite, formule cu operatori aritmetici… formatări de bază, în pași ghidați”) + funcțiile cu model; la B funcțiile, decizia și sortarea „singur, în contexte familiare”; la A un grafic într-o situație nouă cu explicație (descriptorul Avansat: „elemente diverse… conform specificațiilor… în contexte noi”; CS.3.1: „organizând registrul în funcție de cerința dată”).
- Explicația de la partea A: fișa clasei a VIII-a spune că standardele clasei nu o cer explicit, dar „la partea A a lucrării, profesorul cere și explicația, care intră în punctaj”. Punctarea explicației din laborator (8 puncte pentru ambele idei, 4 pentru una) e după modelul baremului V-U1 („Fără justificare, punctajul se acordă pe jumătate”); nu e a unui barem VIII-U1.

## Proba de antrenament (atelierul) — puncte și hartă
Punctele se socotesc la PRIMA apăsare pe „Verifică” pe o foaie lucrată (suma testelor bifate atunci; foaia neatinsă nu se punctează). Total 90 + 10 din oficiu.

| Item | Parte, puncte | Simulatorul (neatins) | Ce cere | Testele (puncte) | Predat în |
|---|---|---|---|---|---|
| C1 | C · De bază, 20 | `excelx-formule.js` (ExcelF) | pe pași: 4,5 cu virgulă, =B2*C2 pe trei rânduri, totalul | tipul 4,5 (5); D2 (5); D3+D4 (5); D5 (5) | L5 „Zecimalele se scriu cu virgulă”; L7 „Prima formulă: semnul = și adresele”; L8 „Copiezi funcția…”, „Patru funcții…” |
| C2 | C · De bază, 20 | `excelx-functii.js` (ExcelFn) | după modelul =SUM(B2:B6): SUM, AVERAGE, MAX, MIN | câte 5, cu funcția cerută | L8 „Patru funcții: SUM, AVERAGE, MAX, MIN” |
| B1 | B · Consolidat, 15 | `excelx-decizie.js` (ExcelD) | singur: media și „calificat” de la media 7 | mediile (5); deciziile (5); limita, media exact 7 (5) | L8; L9 „Condiția pe rezultatul altei formule”, „Situația-problemă…” |
| B2 | B · Consolidat, 15 | `excelx-sortare.js` (ExcelS) | clasa A→Z, apoi punctele descrescător | antetul (3); rânduri întregi (4); clasele (4); punctele în clasă (4) | L10 „Rândul de antet și «My data has headers»”, „Capcana…”, „Sortezi tot tabelul…”, „Mai multe criterii: Add Level” |
| A1 | A · Avansat, 12 | `excelx-grafic.js` (ExcelG) | situație nouă: voturile pentru mascotă, cu rândul Total dedesubt; „ce parte din clasă” | zona fără Total (3); radialul (3); titlul (3); etichetele (3) | L11 „Selectezi datele: antetul și valorile”, exercițiul cu rândul Total din „Inserezi graficul. Graficul ales”, „Tipul potrivit…” („radial… întregul e suma lor”), „Titlul, legenda și etichetele de date” |
| A2 | A · Avansat, 8 | `excelx-test.js` (alegere) | de ce nu intră rândul Total în radial | tot sau nimic | L11 „Tipul potrivit…” („întregul e suma lor”) |

**De ce e A1 un transfer cinstit (punctul D):** lecția 11, în pasul „Inserezi graficul. Graficul ales”, are exercițiul „Graficul de mai jos a luat din greșeală și rândul Total. Șterge-l și fă-l din nou, doar cu clasele” (la coloane). La A1 situația e nouă (radial, ce parte din clasă), iar elevul duce acolo priceperea de bază și regula „întregul e suma feliilor”. Enunțul nu numește tipul și spune „Uită-te atent la tot tabelul”. Mesajul de la Verifică numește greșeala adevărată (Totalul apare ca încă o mascotă, cu 26 de voturi), fără să dea explicația cerută la A2. Capcana nu e cerută ca fapt predat nicăieri: Î5 nu o mai are. Trimiterile depind de lecția 11, care e în reparare (vezi la sfârșit).

## Pașii și întrebările → unde s-a predat
| Loc | Ce cere | Predat în |
|---|---|---|
| P2 Încearcă (foaie) | B6 = suma părților + oficiul, B7 = B6/10 | L1 (nota = punctaj : 10); L7 (formule) |
| P2 Încă 1-2 | 74 → nota 7, Consolidat; 52 → De bază | L1; P2 |
| P3 Încearcă (foaie) · Încă 1-2 | 2,5 și =B2*C2; =SUM(C2:C5) după model; 7.5 → dată | L5, L7, L8 |
| P4 Încearcă (foaie) · Încă 1-2 | media + IF la 9,5; sortare pe 2 criterii; valoarea de testat la limită | L8, L9, L10 |
| P5 Încearcă (foaie) · Încă 1-2 | graficul cu linie pentru o schimbare în timp; ce unealtă pentru ce cerință; explicația liniei | L11; L8-L10; P5 |
| P6 Încearcă (foaie) · Încă 1-2 | =SUMA → =SUM; IF fără ghilimele → cu ghilimele; număr scris de mână; #DIV/0! | L8 („…numele românesc… #NAME?”), L9 („Textul din rezultat…”), L7 („Când apare un cod de eroare”) |
| Î1 (C) | 30 + 24 + 11 + 10 = 75 → nota 8 | L1; P2 |
| Î2 (C) | =B2*C2, 12,5 × 4 | L7 |
| Î3 (B) | IF cu „cel mult 40” (<=) | L9 |
| Î4 (B) | Continue with the current selection desperechează | L10 „Capcana: o singură coloană selectată” |
| Î5 (A) | situație nouă: zona (antet + valori, A1:B4) și tipul (radial) pentru părțile unui întreg | L11 „Selectezi datele: antetul și valorile”, „Tipul potrivit…”; variantă-soră a lui A1, fără capcana Totalului |

Variante-soră, nu copii: S1 din `verifica_lectie.py` → 0 identice, 0 aproape identice.

## Simulatoarele
- Încărcate, NEATINSE: `excelx.js`, `excelx-formule.js`, `excelx-functii.js`, `excelx-decizie.js`, `excelx-sortare.js`, `excelx-grafic.js`, `rezultat-elev.js`, motorul și `prezenta.js`. Fiecare exercițiu folosește tipul lecției care a predat gestul (`tipuri` din pagină).
- **Extensia `lectii\_sim\excelx-test.js`** (proprietar: lecția VIII/13), descrisă în capul fișierului. `ExcelTest.punctat(tip)` învelește orice tip prin interfața lui publică:
  - punctele la prima verificare pe o foaie lucrată (testele bifate × `puncte`), apoi neschimbate (regula 23: prima încercare nu se șterge); „Verifică” pe foaia neatinsă nu socotește nimic;
  - până la prima verificare, bifele testelor și indiciul sunt ascunse, iar testele care ar da răspunsul au textul `ceInainte`;
  - mesajele comune ale foilor, înlocuite pentru exercițiul probei, fără a schimba foile: `mesajZona` (A1, zona cu Totalul) și `mesajLimita` (B1, unde scrii ca să faci testul la limită);
  - panoul probei: punctele pe exerciții, la final punctajul, socoteala notei, nivelul, „Unde ai pierdut puncte și ce recitești” (câmpul `lectia` al fiecărui test); panoul final apare numai dacă `RezultatElev.citeste` întoarce chiar proba aceea pentru elevul de acum;
  - salvarea: o singură dată, când toți cei 6 itemi au puncte, prin `RezultatElev.salveaza('viii-m2-l13-proba', …)`, cu un semn unic; panoul arată prima probă (diagnosticul, cu lista ei de puncte pierdute, și după reîncărcare) și ultima reîncercare;
  - proba începe din nou de la C1: la redeschiderea lui C1 după o probă gata, la „Sunt alt elev / Încep din nou” (`RezultatElev.golesteAlElevuluiDeAcum`) și la schimbarea elevului din caseta `prezenta.js` (proba gata sau începută de cel dinainte).
  - **Dependență de semnalat:** întoarcerea la C1 folosește `JocMotor.test.exercitiu(0)`, cârligul motorului pentru poartă (nu există altă cale publică). După el se verifică dacă C1 e pe ecran; dacă nu, panoul spune adevărul și nu se socotesc puncte până la C1 (`_proba\proba_m.py`, cu cârligul scos: 5 / 5).
  - Stilul: prefixul `xpb-`. Regulile pentru atingere (`@media (pointer:coarse)`) se aplică doar în paginile care încarcă extensia.
- Ce se vede pe ecran dar nu e Excel: panoul probei, ascunderea bifelor până la prima verificare și alegerea A2 (la lucrare explicația se scrie; enunțul A2 o spune).

## Imagini
- Nouă: `img\tabela-scor.webp` — „High Beach Cricket Club scoreboard…”, Acabashi, CC BY-SA 4.0 (citită din API-ul Commons, `img\SURSE.json`), decupată și micșorată, 136 KB; User-Agent neutru (regula 22).
- Refolosite, aceleași fișiere, din lecțiile care au predat: `../m2-l08/img/functii-patru.webp`, `suma-name.webp`; `../m2-l10/img/sort-doua-niveluri.webp`; `../m2-l11/img/radial.webp`; `../m1-l03/img/confirma-inlocuire.webp`.

## Excel real (regula 7) — `afirmatii.json`: 36 de afirmații, 33 probate, 0 nepotriviri
- `_proba\proba_excel.py` → `_proba\proba_excel.json` (autorul inițial): instanță nouă (DispatchEx) și invizibilă, PID notat, registrul deschis dintr-o copie din `_proba\` (ReadOnly, AddToMru=False), formule prin FormulaLocal, nimic salvat. Excel 16.0, „,” zecimală, „;” între argumente.
- `_proba\proba_excel_r1.py` → `_proba\proba_excel_r1.json` (reparare 1): registru NOU, nesalvat (nimic în „Recent”), aceeași instanță proprie și invizibilă; Saved=True + Close(False), Quit, apoi `taskkill` doar pe PID-ul meu, care mai trăia după Quit. Probat: Î5 (A1:B4 › radial: 3 felii numite transport, cazare, masa; titlul Lei), etichetele pe radial (Center: 600, 900, 500 pe felii), A1 (cu rândul Total: 5 felii, Total = 26; fără: 4 felii).
- Probate de la început: toate valorile din „Verifică-te” ale laboratorului și ale exercițiilor din pagină (inclusiv #NAME? la =SUMA și la textul fără ghilimele, #DIV/0!, 04.mai la 4.5, titlurile „Voturi”, „Grade”, „Ore”).
- Capcană a probei inițiale: `Range.Sort` cu argumente numite prin win32com nu a aplicat al doilea criteriu și antetul; proba folosește `Worksheet.Sort` cu două SortFields și Header = xlYes (ce face fereastra Sortare).
- **Neprobate (3):** L06 formatarea (B, Toate bordurile) pe registrul acesta (lecția 6), L09 setările englezești (neprobate și în lecțiile 8-9), L14 banda Enable Editing și Confirm Save As la registrul descărcat (neprobate și în lecțiile 6 și 9).
- **Probat parțial:** drumul din panglică pentru etichete pe un RADIAL. Meniul Add Chart Element › Data Labels e probat prin UI Automation în lecția 11 (A23), la coloane; aici e probat efectul comenzii Center pe radial (SetElement 202), nu și deschiderea meniului.

## Registrul de laborator
- `proba_lectia13.xlsx`: patru foi (Partea C, Partea B1, Partea B2, Partea A), doar date; făcut cu openpyxl (`_proba\fa_registru.py`), fără Office; neatins la reparare; `curata_metadate.py` → 0.

## Porțile autorului (după reparare 1)
- `test_joc.py --dir …\lectii\viii m2-l13` → **TRECUT** (avertismentul „1 niveluri”, așteptat).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT · S1 0 identice · S2 6/6 aplicare/execuție · T0 0).
- `_proba\proba_gesturi.py` (gesturi reale la 390 px cu atingere și la 1280 px; rețeaua blocată în afară de 127.0.0.1; `ctx.close()`) → **142 / 142**, 0 erori în consolă. Noi: foaia neatinsă (E), textele testelor înainte și după (A), mesajul limitei (Q), etichetele din panglică, mesajul pentru Total, indiciul (B, D, G), lista după reîncărcare (L), butonul de descărcare (N), textele laboratorului (F, H, K, O, R).
- `_proba\proba_r23.py` (doi elevi pe același profil, caseta adevărată din `prezenta.js`, 1280 și 390 px; Ana confirmată → „Schimbă elevul” → Dan; Ana neconfirmată după reîncărcare) → **25 / 25**, 0 cereri scăpate.
- `_proba\proba_m.py` (fără cârligul motorului) → 5 / 5 · `_proba\proba_note.py` (cazurile-limită) → 4 / 4.
- `_proba\tinte.py 390` → **0** ținte sub 32 px ale lecției (firul de navigare al motorului e raportat separat) · `_proba\latime.py` → 0 (pagina nu e mai lată decât ecranul; coloanele cu date se văd întregi).

## Ce n-am putut verifica / de semnalat
1. **Testul profesorului lipsește** (mai sus): pagina îl poate contrazice când va apărea; de reverificat atunci.
2. **Lecțiile 10 și 11 nu sunt publicate** (lecția 11 e în reparare chiar acum): trimiterile la pașii lor (câmpul `lectia` al testelor, harta de mai sus, exercițiul cu rândul Total, „cel rotund”, drumul etichetelor) trebuie aliniate dacă se schimbă.
3. Capturile registrului terminat lipsesc (`capturi_lipsa.json`).
4. Laboratorul Tupilați: nu știu dacă au Excel sau altă aplicație de calcul tabelar pe calculatoare; pașii presupun Excel, ca lecțiile 2-11.
5. Calculatorul comun: proba în curs (înainte de al șaselea item) e ținută doar în pagina deschisă; o reîncărcare o pierde (rezultatul salvat rămâne, cu lista lui).
6. **Ținte ale motorului sub 32 px la 390 px** (comune tuturor lecțiilor, nu ale lecției): firul de navigare (🏠 LearningHub 98×23, Lecții 31×23, Clasa a VIII-a 76×23, „Lecția 13” 52×23), marca 185×23, săgeata ▾ 31×26. De dat proprietarului motorului.
7. La 1280 px cu mouse, foaia păstrează celulele de 28 px (ca Excel-ul); regulile de 32 px sunt pentru atingere (`pointer:coarse`). Un laptop cu ecran tactil și mouse ca indicator principal primește mărimea de mouse.

Judecata 2 → reparat: N1 (mesajul de la A1 spune doar „Vulpea a luat cea mai mare felie: 9 voturi din 26.”; motivul rândului Total rămâne numai la A2).
