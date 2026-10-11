# Lecția 10, clasa a VII-a — „Evaluare sumativă: tehnoredactare”: surse, decizii, ce n-am putut verifica (11.10.2026)

Starea și deciziile autorului, cu variantele respinse: `_proba\stare_autor.md`. Numerotarea pașilor = bara motorului: P1 „La ce folosește”, P2 „Cum arată lucrarea și cum se notează”, P3 „Partea C: după pașii dați”, P4 „Partea B: singur, după o fișă”, P5 „Partea A: o situație nouă, cu explicație”, P6 „Înainte să predai: verifică-ți lucrarea”. Atelierul = proba de antrenament (C1, C2, B1, B2, A1, A2). Laboratorul = „Acum la calculatorul din laborator”.

## Programa și planul
- **Titlul exact:** `Info_Gimnaziu_2026\planificari\Calendar_ore_7_MA.md`: „20.11.2026 | 10 | M2 | Evaluare sumativă: tehnoredactare | evaluare sumativă” (la fel în `Calendar_ore_VII_A.md` și `Calendar_ore_VII_B.md`, 17.11.2026). În `data\unitati.json`: VII-U1 = lecțiile 2-10, lecția 10 cu materialele „test_unitate, barem”.
- **Conținuturile** (`continuturi`): toate conținuturile unității VII-U1, copiate întocmai din lecțiile 2-9 (care le-au luat din `curriculum.json`, cu sedilele lor: „Interfaţa”, „Operaţii”); `lectii:[2,…,10]`.
- **Competențele** CS.1.1 și CS.3.1, cu descriptorii De bază / Consolidat / Avansat: `planificari\Proiectul_unitatii_VII-U1.md`.

## Ce a cerut profesorul pentru lecția 10 (documentele lui) și ce am ales
- **Activitatea** (`data\activitati_lectii_VII_VIII.json`, cheia „Evaluare sumativă: tehnoredactare”): „Probă practică: realizarea unui document după specificații (structură, imagine, tabel, formatare, pregătire pentru tipar). Cerințe pe cele trei niveluri.” Resurse: „test practic de unitate, grila de produs”.
- **Ce document se aplică notei și de ce:** structura **C · De bază 40 / B · Consolidat 30 / A · Avansat 20 + 10 din oficiu**, nota = punctaj : 10, nu grila de produs.
  - `SISTEM_EVALUARE.md` §4.1 are titlul „Structura oricărei probe scrise **sau practice**” și dă exact părțile C/B/A; §3 desparte „Evaluare sumativă de unitate … o notă” de „Mini-proiect / produs digital … o notă, pe grilă anunțată dinainte”.
  - `Proiectul_unitatii_VII-U1.md`: ora 9 (mini-proiectul) are „fisa_proiect, grila_proiect”, ora 10 are „test_unitate, barem” (§5 al SISTEM_EVALUARE: „Baremul pe niveluri al fiecărei probe — arată care item ce nivel verifică”).
  - „Cerințe pe cele trei niveluri” din activitate = părțile C/B/A (`REGULA_NOUA.md` §1; fișa clasei, `instrumente\Fisa_criterii_elev_clasa_VII.md` §3).
  - **Grila de produs** (`instrumente\Grila_produs.md`) a fost predată elevilor în lecția 9, la mini-proiect, cu calculatorul ei. Pagina lecției 10 nu o prezintă ca punctaj al lucrării și nici nu o contrazice. **De întrebat profesorul** (dirijorul): la proba practică a lecției 10 se folosește și grila de produs (activitatea o numește ca resursă) sau doar baremul pe C/B/A?
- **Nota lucrării de modul:** P2, „Uite cum”, spune doar fraza din lecția VII/1 (pasul „Din lucrare și LearningHub, nota din catalog”): „La lucrarea (sau proiectul) de modul, nota din catalog = (80% din punctajul lucrării + punctele de pe LearningHub) : 10, rotunjită ca nota lucrării.” Nimic în plus (nici dacă lucrarea lecției 10 e chiar „lucrarea de modul” a M2: documentele nu spun).
- **Literele:** cele oficiale (Anexa 2, O. 4.615/2026), C → B → A pe foaie: SISTEM_EVALUARE §4.1, fișa VII §3. Nivelul se citește din notă (§4.3). Exemplele din pagină: 76 → 8 (P2), 75 → 8 la ,5 (P2 Încearcă), 55 → 6 (P2 Încă), 65 → 7 (Î2, „cel puțin 4 la A”). Oracolele: `verifica_regula.py` → 0, `oracol_nota_site.py` → 0.
- **Explicația de la partea A:** fișa VII §2: „La partea A a lucrării, profesorul cere și explicația, care intră în punctaj.” Punctarea explicației din laborator (6 puncte pentru amândouă ideile, 3 pentru una) e după modelul baremului V-U1 („Fără justificare, punctajul se acordă pe jumătate”), ca la lecția VIII/13; nu e a unui barem VII-U1.

## Testul profesorului pentru unitate NU există încă (de știut pentru profesor)
- `materiale\continut\teste_sumative.json` are un singur test, V-U1; `materiale\print\` are doar `Test_V-U1` și baremul lui. Pentru VII-U1 nu există test, barem sau listă de cerințe.
- Pagina nu inventează lucrarea: spune ce e sigur din documente (probă practică, părțile C/B/A cu punctele lor, ce înseamnă fiecare nivel, regula notei) și, pentru fiecare parte, ce **se poate** cere („de exemplu”). Proba din atelier și cea din laborator sunt marcate peste tot ca antrenament („Nu e lucrarea profesorului: e un antrenament”, „E nota pe antrenament. Nota adevărată o dă profesorul, la lucrare.”).
- **Inferență (de confirmat de profesor):** ce cade la ce parte. C = pași dați pe formatare, poză și tabel la locul lor (descriptorul De bază: „elemente de bază de conținut (text, imagini), editare de bază (inserare, ștergere), formatări de bază, în pași ghidați”); B = o fișă de specificații, fără pași, ca la lecția 9 (Consolidat: „independent … mai multe elemente de structură și conținut … contexte familiare”); A = un document nou pregătit pentru tipar după regulile lecției 8, plus explicația (Avansat: „conform specificațiilor, respectând reguli date de tehnoredactare şi estetică a paginii tipărite, în contexte noi”; CS.3.1: „organizând documentul în funcție de cerința dată”).

## Ce cere activitatea și ce s-a predat (nimic cerut nepredat)
| Element din activitate | Predat în | Unde îl exersează lecția 10 |
|---|---|---|
| structură (obiectele, în ordine) | L4 „Trei feluri de obiecte”, „Cursorul și tasta Enter” | C2, laborator C |
| imagine | L4 „Inserezi o imagine din calculator”; L7 „Poza: o selectezi și o mărești din colț”; L9 „Cum verifici în Word” | C2, B1, laborator C și B |
| tabel | L4 „Inserezi un tabel și scrii în celule”; L7 „Tabelul: un stil, dintr-un clic” | C2, B1, Î4, laborator C și B |
| formatare | L6 (aldin, font, mărime, culoare, aliniere, fereastra Paragraph) | C1, B2, laborator C și B |
| pregătire pentru tipar | L7 „Pagina: în picioare sau culcată, și marginile”; L8 „Estetica paginii…”, „Verifici: semnele ¶ și previzualizarea” | B1, A1, Î1, Î5, laborator B și A |

- **Nepredat, deci necerut:** stilurile de titlu (Heading 1 / Titlu 1, galeria Styles de pe Home). Fișa de pregătire a profesorului pentru VII-U1 (`materiale\pregatire\Pregatire_toate.html`, „Formatare cu stiluri vs. aranjare cu spatii si Enter”) le pune în centrul unității, dar lecțiile publicate VII/2-9 nu le predau (0 apariții „Heading”, „Titlu 1”, „Styles” în paginile lor). **Activitatea profesorului (prin fișa de pregătire) cere stilurile, dar lecțiile noi nu le-au predat încă** — de dus la profesor; dacă intră în lucrare, trebuie predate întâi (în lecția 8 sau 9).
- Ideea din fișa de pregătire pe care lecțiile au predat-o („aranjarea cu spații se destramă la prima schimbare”, L8 „Enter și spațiile nu așază textul”) e chiar explicația cerută la A2 și în laborator.

## Proba de antrenament (atelierul) — puncte și hartă
Punctele se socotesc la PRIMA apăsare pe „Verifică” pe un document lucrat (suma testelor bifate atunci; documentul neatins nu se punctează). Total 90 + 10 din oficiu.

| Item | Parte, puncte | Simulatorul (neatins) | Ce cere | Testele (puncte) | Predat în |
|---|---|---|---|---|---|
| C1 | C · De bază, 20 | `wordobj-formatare.js` (wordfmt) | pași dați: titlul aldin, 20 pt, centrat; paragraful stânga-dreapta; ultimul rând la dreapta | 4 × 5 | L6 |
| C2 | C · De bază, 20 | `wordobj.js` (inserare) | pași dați: tabelul 2x3 sub „Ce am plătit:”, completat; poza pe rândul ei, sub paragraf | textul 2, tabelul 3, mărimea 3, celulele 3, poza 2, singură 2, la loc 3, nimic în plus 2 (textul și „nimic în plus” = teste-pază: se dau doar împreună cu un test de lucru, din 11.10) | L4 |
| B1 | B · Consolidat, 15 | `wordobj-pagina.js` (wordpag; cu `wordobj-hartie.js` încărcat, ca la L9) | fișă: Landscape, marginile 2 cm, Grid Table 4 - Accent 1 + Header Row, poza 6 cm nedeformată | foaia 3, marginile 4, tabelul cu Header Row 4, poza 5,5-6,5 cm nedeformată 4 (din 11.10: testele unite, J1-M2) | L7, L9 |
| B2 | B · Consolidat, 15 | wordfmt | fișă: titlul Georgia 24 aldin albastru centrat; paragraful stânga-dreapta, alineat 1,25, spațiere 1,5; ultimul rând cursiv, la dreapta | 3, 2, 2, 2, 2, 2, 1, 1 | L6 |
| A1 | A · Avansat, 12 | `wordobj-tehnoredactare.js` (wordteh) | situație nouă: anunțul bibliotecii pregătit pentru tipar (spațiile de lângă semne, paragraful rupt, titlul și semnătura aduse cu spații, un paragraf în Courier New, 30 de rânduri goale = 2 pagini) | spațiile 3, paragraful 2, titlul 2, fontul 1, semnătura 1, o pagină 2, previzualizarea 1, literele păstrate 0 (pază, din 11.10, J1-M2) | L8 |
| A2 | A · Avansat, 8 | `wordobj-proba.js` (alegere) | de ce titlul se pune la mijloc cu Center, nu cu spații | tot sau nimic | L8 „Enter și spațiile nu așază textul” |

- **Ce nu dă răspunsul înainte de lucru (lecțiile judecătorilor VIII/13):** până la prima verificare bifele și indiciul sunt ascunse; la A1 testele au texte care spun doar CE se verifică („Spațiile de lângă semne”, „Paragrafele”, „Titlul”, „Fonturile”, „Semnătura”, „Pagina”), cele adevărate apar după (`ceInainte`). Mesajele A1 (testele simulatorului, `why`, indiciul) spun ce faci, nu de ce: explicația cerută la A2 nu apare la A1 (probat: `proba_gesturi.py`, „tel A1: mesajul nu dă explicația de la A2”).
- **Pagini în simulatorul wordteh:** A1 are 30 de rânduri goale de 11 pt; simulatorul le pune pe 2 pagini (proba: `proba_gesturi.py`, A1 corect = 12/12, deci „o pagină” bifat după ștergere; cu rândurile lăsate, testul „Pagina” pică). În Word real, 26-30 de rânduri goale de 11 pt după un text scurt împing semnătura pe pagina 2 (`rezultate_word.json`: ex_slaba cu 26 de rânduri goale = 2 pagini; laboratorul cu 30 = 2 pagini).

## Simulatoarele
- Încărcate, NEATINSE: `wordobj.js`, `wordobj-formatare.js`, `wordobj-pagina.js`, `wordobj-hartie.js`, `wordobj-tehnoredactare.js`, `rezultat-elev.js`, motorul și `prezenta.js`.
- **Extensia nouă `lectii\_sim\wordobj-proba.js`** (proprietar: lecția VII/10), pornită din `excelx-test.js` (VIII/13, judecat de 4 ori): `WordProba.punctat(tip)` învelește orice tip Word prin interfața lui publică (render/rezolva/gresit, lista `.wo-teste`/`.wt-teste`, mânerele `body._wp/_wh/_wf/_wo`). Punctele la prima verificare, documentul neatins nesocotit, bifele și indiciul ascunse până la prima verificare, `ceInainte`, panoul probei, salvarea prin `RezultatElev.salveaza('vii-m2-l10-proba', …)`, golirea la schimbarea elevului: ca excelx-test.
  - **Defect găsit și reparat de proba cu gesturi:** motorul refolosește același `#body` la fiecare exercițiu, deci mânerul simulatorului de dinainte (de exemplu `body._wp` de la B1) rămânea pe el, iar B2 cu greșeli era judecat „la fel ca la început” (pe telefon, `_proba\_b2_tel.png`). Acum extensia scoate mânerele vechi înainte de render. (Excel-ul VIII/13 nu are problema: amprenta lui se ia din DOM.)
  - **Dependență de semnalat (ca la VIII/13):** întoarcerea la C1 folosește `JocMotor.test.exercitiu(0)`, cârligul motorului pentru poartă; după el se verifică dacă C1 e chiar pe ecran.
- **Pe telefon, în `wordpag` (simulatorul lecției 7, neschimbat):** la mărimea de pornire a foii (23 %), mânerele de 32 px ale liniilor dintre coloane (`.wp-cb`) acoperă celulele înguste: o atingere pe celulă apucă linia, nu pune cursorul (probat: `_proba\depanare_celula.py`, la fel în lecția 7). Lecția 7 spune deja „pagina o mărești cu butonul + de sub ea”; atelierul lecției 10 o spune la B1. **De dat proprietarului `wordobj-pagina.js`:** atingerea pe o celulă să aibă întâietate față de mânerul liniei când foaia e mică.

## Imagini
- Nouă: `img\croitor.webp` — „Tailor´s shop - Werkstatt 2.jpg”, Wolfgang Sauber, CC BY-SA 3.0 (citită din API-ul Commons, `img\SURSE.json`), micșorată, 89 KB; User-Agent neutru (regula 22).
- Desenate de Word-ul real (PDF prin COM, nu capturi de ecran): `img\ex-buna.webp`, `img\ex-slaba.webp`, `img\lab-buna.webp` (poza din ele: Colouring_pencils.jpg, MichaelMaggs, CC BY-SA 3.0, ca în lecția 9).
- Refolosite, aceleași fișiere: `../m2-l09/img/verifici-font.webp`, `../m2-l09/img/verifici-poza.webp`, `../m1-l07/img/cetatea.png` (poza din Word-ul simulat), `../m2-l09/creioane-colorate.jpg` (descărcarea pentru laborator).

## Word real (regula 7) — `afirmatii.json`: 30 de afirmații (11.10.2026), 17 probate, 13 preluate (probate în lecțiile 2-9, cu id-ul lor), 0 nepotriviri
- `_proba\proba_word.py` → `_proba\rezultate_word.json`: Word 16.0.20326, instanță nouă (DispatchEx) și invizibilă, PID notat și oprit doar el, vederea și zoomul puse la loc (`wordcom.py`, din lecția 9), salvări doar sub `_proba\` cu `AddToRecentFiles=False`, fiecare document `Saved=True` + `Close(False)` înainte de `Quit`. Nicio tastă, nimic pe ecran. `tasklist` după rulare: niciun WINWORD.
- Probat: documentul nou (A4, portret, 2,5 cm, Calibri 11); foaia culcată 29,7 × 21; stilul „Grid Table 4 - Accent 1” există; tabelul pus la capătul unui paragraf cu text e urmat de un paragraf gol; poza pe paragraful nou de după Enter ia alinierea paragrafului de deasupra (stânga-dreapta); documentul de laborator are 2 pagini la început, 2 după C, 2 după C+B și 1 după A (din PDF-ul desenat de Word); lucrarea bună / slabă: 1 / 2 pagini.
- **Capcane ale probei, de știut:** (1) `Document.ComputeStatistics(2)` (pagini) pe instanța invizibilă a dat 1 pagină pentru un document pe care PDF-ul îl are pe 2 — numărul de pagini se ia din PDF; (2) `InlineShapes.AddPicture` pune poza FĂRĂ blocarea proporțiilor (`LockAspectRatio` False), iar `Width` singur nu schimbă înălțimea: proba pune ambele (6 × 4 cm). Din panglică, Word pune blocarea (lecția 7), deci elevul obține 6 × 4 din colț sau din caseta Width (lecția 9, captura).
- Preluate (gesturi și ferestre care nu se probează prin COM): Protected View (VII/3 A31), Ctrl+W și întrebarea de salvare (VII/3 A23, A26), Ctrl+O și Recent (VII/3 A28, A29, A44), „already exists” la F12 (VII/3 A14, VII/8 A17), Ctrl+P și „1 of 2” (VII/8 A11, A14), spațiile tastate rămân și titlul adus cu spații fuge (VII/8 A1, A7), zoomul (VII/3 A36), casetele aprinse (VII/9 A07), fereastra Page Setup și Cancel (VII/9 A11), stilul tabelului (VII/7 A17, A18).

## Documentul de descărcat
- `proba-lectia10.docx`: făcut în Word-ul real (`_proba\proba_word.py`, scrie_lab), 37 de paragrafe (titlul, textul cu greșelile părții A, 30 de rânduri goale, semnătura adusă cu spații). `curata_metadate.py --curata` (a curățat doar fișierul acesta; celelalte fișiere ale altor lecții erau deja „ok”), apoi fără `--curata` → 0; `scoate_bara_docx.py` → „rămas False” (fără bara „removePersonalInformation”). Autorul și ultima modificare: goale (python-docx).

## Porțile autorului
- `test_joc.py --dir …\lectii\vii m2-l10` → **TRECUT**, 31 de întrebări jucate (avertismentul „1 niveluri”, așteptat).
- `verifica_lectie.py … --fara-t1` → **0** (S0 TRECUT · S1 0 identice, 0 aproape identice · S2 6/6 aplicare/execuție · T0 0).
- `_proba\proba_gesturi.py` (gesturi reale: 1280 px cu mouse și taste, 390 px cu atingere prin CDP; rețeaua blocată în afara 127.0.0.1; `ctx.close()`) → **68 / 68**, 0 erori în consolă. Calculator: proba întreagă fără greșeli = 100, nota 10 (cu un „Verifică” pe documentul neatins, nesocotit). Telefon: cu greșeli alese = C1 16, C2 20, B1 13, B2 11, A1 3, A2 0 = 73 → nota 7, B · Consolidat; „unde ai pierdut puncte” cu lecția de recitit; „Sunt alt elev / Încep din nou” → C1. Plus Încearcă de la P2-P5, laboratorul (descărcările există, imaginea se încarcă, ținte ≥ 32 px), nimic mai lat decât ecranul.
- `_proba\proba_r23.py` (doi elevi pe același calculator, caseta adevărată din `prezenta.js`, 1280 și 390 px) → **25 / 25**, 0 cereri scăpate.
- `_proba\numara_cuvinte.py` → 0 pași peste plafon (text ≤ 110, „Uite cum” ≤ 80).
- `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `C:/00/AI_0/tools/learninghub_date_personale.py` → 0.

## Ce n-am putut verifica / de semnalat
1. **Testul profesorului lipsește** (mai sus): pagina îl poate contrazice când va apărea; de reverificat atunci, mai ales ce intră la fiecare parte.
2. **Grila de produs la lecția 10?** (mai sus) — întrebare pentru profesor.
3. **Stilurile de titlu** (fișa de pregătire VII-U1) nepredate în lecțiile 2-9 — întrebare pentru profesor.
4. Capturile previzualizării pe documentul de laborator lipsesc (`capturi_lipsa.json`); numărul de pagini e probat din PDF.
5. Laboratorul Tupilați: nu știu ce versiune de Word au calculatoarele; pașii presupun Word ca lecțiile 2-9 (numele în engleză și în română).
6. Abaterea `wordpag` pe telefon (celula sub mânerul liniei, la foaia mică) — de dat proprietarului lecției 7.

## Pentru lecția următoare
- VII/11 („Interfața unei aplicații de prelucrare audio / audio-video”) nu folosește simulatoarele Word. O lecție de evaluare pe Word (de exemplu, recapitularea) poate folosi `lectii\_sim\wordobj-proba.js`: `WordProba.configureaza({cheie:'<cheia ei>', oficiu:10, parti:{C,B,A}, itemi:[…]})` și `tipuri:{x:WordProba.punctat(TipWordFormat|TipWordObiecte|TipWordPagina|TipWordTehno), y:WordProba.punctat(WordProba.alegere)}`; pe exercițiu `proba:'C1'`, puncte pe `verif[i].puncte` (sau `punctaj:[…]` la `wordobj` cu `cere`), `lectia`, `ceInainte`. Nu are voie să schimbe numele claselor `.wpb-*`, regulile 1-5 din capul fișierului sau cheia `vii-m2-l10-proba`.

## Reparațiile după judecata 1 (11.10.2026, autorul proaspăt) — registrul: `_verificare\registru_j1.md`
- **Documentul de descărcat se deschidea în Aspect web 105 %** (J1-M1): s-a născut într-un Word lăsat în Web Layout de altă probă. Proba `_proba\vedere_experiment.py`: la un document DESCHIS, Word păstrează la salvare vederea din fișier (comutarea ferestrei nu o schimbă); un document NOU ia vederea ferestrei lui. Refăcut cu `_proba\refa_docx_vedere.py`: document nou, fereastra pe Print Layout 100 % ÎNAINTE de text, cele 37 de paragrafe luate din fișierul vechi (identice, pagina identică); `settings.xml` fără `w:view`, `zoom 100`; metadate 0, fără `removePersonalInformation`.
- **Word-ul acestui calculator, la mine (01:55-02:30):** documentele noi pornesc în Print Layout (3), dar cu **zoom 390 %** (PageFit 0). Așa l-am găsit la prima pornire și așa l-am lăsat (regula 25). Starea profesorului e 100 %: de pus la loc de dirijor, prin Word, când nu mai rulează alte probe.
- **Puncte numai pentru lucru** (J1-M2): `wordobj-proba.js` are acum `paza:true` (testele „n-ai stricat” se dau doar împreună cu un test de lucru trecut) și teste de 0 puncte (doar bifă). Probat la 1280 și 390 (`proba_gesturi.py`, „fără lucru”): C2 doar un Enter = 0, B1 doar foaia culcată = 3.
- **A1 înainte de prima verificare** (S-M1): un singur rând general (`ceInainteUnul`), nu categoriile greșelilor.
- **Celula din wordpag pe telefon** (J1-M3): sfatul „de două ori +” stă acum în B1 și în Î4 (cerință + indiciu). Rămâne de dat proprietarului lecției 7: la foaia mică, atingerea pe celulă să aibă întâietate față de linie.
