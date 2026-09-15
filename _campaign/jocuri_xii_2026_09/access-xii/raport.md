# Evaluare independentă — `access-xii` (Access pentru proba D)

> Evaluator adversarial, 15.09.2026. N-am scris jocul și nu l-am modificat.
> Joc: `C:\00\AI_0\projects\subcompetente-digitale\jocuri\access-xii\index.html` (motor: `_motor\motor.js`, `tip-traseu.js`, `tip-interogare.js`).

## Surse verificate
- **Fișele B și baremele PDF** (pdfplumber, fără filigran): 2019 v1 (fișă + barem), 2024 v2 (fișă + barem), 2024 v3, 2022 v7, 2017 v7 (fără barem pe disc), 2017 v5, 2017 model, 2016 v4, 2016 v14, 2015 v3, 2014 v5, 2013 v7, 2013 v10, 2018 v3, 2018 v4 (fără barem pe disc), 2023 model.
- **Bazele de date originale** `comp_a.accdb` din `examen.zip`, citite cu ODBC (pyodbc, driver Access): tabelele comp_t și rezultatul lui comp_q pentru 2019 v1, 2024 v2, 2022 v7, 2017 v7, 2017 v5, 2013 v7, 2014 v5.
- **Rezolvările** `content\rezolvari\` 2019-varianta1, 2017-varianta7, 2024-varianta2, 2014-varianta5.
- **Grilele de interogare** rulate în Node prin `JocInterogare.run`, cu aceeași logică de verificare ca `problems()` din `tip-interogare.js` (coloane, număr, set, ordine, rânduri `variante`). Scriptul: `scratchpad\acc\test_q.js`.
- **HARTA.md** (Access, 366 p) și `operatii.json`.

## Poarta
`test_joc.py --dir … access-xii` → **[TRECUT]**: 80 de întrebări jucate, 57,2 diacritice la 1000 de litere.

## Paginile de citit (cuvinte)
N1 93 · N2 96 · N3 110 · N4 118 · N5 94 · N6 103 · N7 98 · N8 102 — toate în 60–120. Top 10 din HARTA.md (A_raport … A_citire_proprietate) este acoperit, în ordinea punctelor.

## Teste pe grilele de interogare (accept/resping)
| întrebare | grilă încercată | rezultat motor | corect? |
|---|---|---|---|
| N3·Î2 (după 2013 v7) | greșit: `<=15` | RESPINS (4 vs 3) | da |
| N3·Î2 | greșit: lucrări publicate cu Show bifat | RESPINS coloane | da |
| N3·Î2 | echivalent: `<=14` (câmp Integer) / `Not >=15` / `Between 0 And 14` | ACCEPTAT | da |
| N3·Î3 (după 2017 v5) | greșit: Compozitor pe prima poziție | RESPINS | da |
| N3·Î3 | greșit: Partea vizibilă | RESPINS | da |
| N3·Î3 | echivalent: Partea ștearsă din grilă | ACCEPTAT | da |
| N3·Î3 | echivalent la examen: Partea vizibilă pe prima poziție, audiții ascuns | RESPINS | da în joc (enunțul fixează câmpul), vezi constatarea |
| N5·Î2 (2017 v7) | greșit: `>=1969` | RESPINS (3 vs 2) | da |
| N5·Î2 | greșit: criteriul pe Pagina | RESPINS | da |
| N5·Î2 | echivalent: `>=1970` (Integer) / `Not <=1969` | ACCEPTAT | da |
| N5·Î2 | **cerința reală: toate câmpurile, `>1969`** | **RESPINS coloane** | **nu** |
| N5·Î3 (după 2014 v5) | greșit: `>=10` | RESPINS (7 vs 5) | da |
| N5·Î3 | greșit: Sort Descending / sort pe Număr | RESPINS ordine | da |
| N5·Î3 | **echivalent: `>=11` (câmpul e Integer în comp_a original)** | **RESPINS variante (rândul inventat 10.5)** | **nu** |
| N5·Î3 | **echivalent: Ascending pe Exercițiu + sort secundar pe Număr** | **RESPINS ordine** | **nu** (motor) |
| N7·Î2 (2024 v2) | greșit: `>1900 And <1960` | RESPINS (variante de graniță) | da |
| N7·Î2 | greșit: `>=1900 Or <=1960` | RESPINS (9 vs 2) | da |
| N7·Î2 | greșit: Between pe Sfârșit de mandat, ascuns | RESPINS | da |
| N7·Î2 | echivalent: `>=1900 And <=1960` / `>1899 And <1961` / `between … and …` | ACCEPTAT | da |
| N7·Î3 (2022 v7) | greșit: `Like "*D*"` | RESPINS (3 vs 2) | da |
| N7·Î3 | greșit: `Like "Dinastia"` | RESPINS | da |
| N7·Î3 | greșit: `"D*"` fără Like | EROARE cu indiciu „merg doar cu Like” | da |
| N7·Î3 | echivalent: `Like "d*"` / `>="D" And <"E"` | ACCEPTAT | da |
| N7·Î3 | **echivalent: `D*` (Access îl transformă singur în `Like "D*"`)** | **EROARE „Nu înțeleg valoarea”** | **nu** (motor) |
| N7·Î4 (Texas/Virginia) | greșit: `"Texas" And "Virginia"` / doar `"Texas"` | RESPINS | da |
| N7·Î4 | echivalent: `In ("Texas","Virginia")` / `Texas Or Virginia` fără ghilimele | ACCEPTAT | da |
| N7·Î4 | **echivalent: rândul `or` (Texas pe Criteria, Virginia pe or)** | **imposibil în grilă** (motor) | **nu** |
| N8·Î1 (2019 v1) | greșit: `>=160` | RESPINS (variante) | da |
| N8·Î1 | greșit: Descending / fără sortare / sort pe Regiune | RESPINS ordine | da |
| N8·Î1 | echivalent: `Not <=160` / `>160,0` | ACCEPTAT | da |
| N8·Î1 | echivalent discutabil: numai Populația afișată („să preia numai numerele”) | RESPINS coloane | enunțul jocului cere explicit ambele coloane: acceptabil |
| N8·Î1 | **neechivalent: `>=160.1` (câmp Double)** | **ACCEPTAT** | **nu** |

## Constatări

| nivel·întrebare | problemă | dovadă (sursă) | reparație exactă (text de înlocuit) | gravitate |
|---|---|---|---|---|
| N5·Î2 (interogare, 2017 v7) | **Cerința reală e schimbată, dar e prezentată ca „Cerința”.** Fișa cere 5.b: „Creați o interogare cu numele comp_q, care să preia din tabela comp_t **toate înregistrările** care au în al doilea câmp valori strict mai mari decât 1969” (5p). Rezolvarea site-ului pune **toate câmpurile** în grilă. Jocul cere doar Autor și An și respinge grila cu toate câmpurile („Coloanele afișate sunt …”). Elevul care a învățat din rezolvare e penalizat. | `files\cd-2017\varianta7-2017\D_Competente_digitale_2017_fisa_B_var_07_LRO.pdf` pct. 5.b; `content\rezolvari\2017-varianta7.html` („Trage toate campurile in grila”); test Node: „toate câmpurile, >1969” → RESPINS coloane | În `q`: `Cerința (BAC 2017, varianta 7, 5 puncte): interogarea comp_q preia din comp_t <strong>toate înregistrările</strong> care au în al doilea câmp valori <strong>strict mai mari decât 1969</strong>. Pune toate câmpurile în grilă, apasă Run, apoi Verifică.`; `ref:[{camp:'Autor',arata:true},{camp:'An',arata:true,criteriu:'>1969'},{camp:'Pagina',arata:true},{camp:'Titlul',arata:true}],coloane:5` | important |
| N5·Î3 (interogare, după 2014 v5) | **Echivalentul legitim `>=11` e respins.** Rândul inventat din `variante` are 10.5 exersări, dar câmpul „Număr de exersări” e **Integer** în comp_a original, deci 10.5 nu poate exista. Pe câmpul real `>=11` ≡ `>10`. Rândul nici nu e necesar: tabelul are deja două valori de 10, care prind `>=10`. | ODBC: `comp_t` 2014 v5 → `('Număr de exersări','INTEGER',10)`; test Node: `>=11` → „RESPINS variante (granita)” | Șterge linia `variante:[[['Exercițiul de probă',10.5,8,'Pop A.']]],` | important |
| N5·Î3 | Sortarea secundară (Ascending pe Exercițiu + Descending pe Număr) e respinsă ca „ordinea nu”, deși ordinea alfabetică cerută e respectată. Cauza e în motor (compară și ordinea între egale: „Exercițiul gamei (b)” 20/25). | test Node → „RESPINS ordine” | Vezi secțiunea motorului (D6). În joc, până atunci, în `why` adaugă: `Nu pune sortare și pe al doilea câmp: cerința nu o cere.` | minor |
| N5·Î3 | „După BAC 2014, varianta 5”: cerința reală (5.b, 3p) e doar sortarea alfabetică; comp_q original are **deja** criteriul >10 (rezultatul lui: 15, 20, 30, 15, 25). Jocul îl pune pe elev să scrie criteriul. Eticheta „După” e onestă, deci doar de semnalat. | ODBC: `comp_q` 2014 v5; fișa B 2014 v5 pct. 5.b | În `q`, după `ordonate alfabetic după Exercițiu</strong>`: ` (la examen criteriul era deja în comp_q; se cerea doar sortarea)` | minor |
| N7·Î2 (interogare, 2024 v2) | **Enunțul dă răspunsul și nu e textul real.** Jocul scrie „Cerința … criteriul `Between 1900 And 1960`”. Fișa spune „valorile … sunt cuprinse în intervalul [1900,1960]”. Baremul punctează tocmai traducerea: câte 1p limita inferioară, limita superioară, „condiție dublă/operator adecvat”. Elevul doar copiază operatorul. | `files\cd-2024\v2-2024\…fisa_B_var_02_LRO.pdf` pct. 5.a; `…bar_02_LRO.pdf` pct. 5.a | `q:'Cerința (BAC 2024, varianta 2, 5 puncte): un criteriu de selecție pe al doilea câmp al interogării comp_q, astfel încât să preia doar înregistrările cu valori <strong>cuprinse în intervalul [1900,1960]</strong>. Interogarea afișează Locul nașterii și Început de mandat.'` | important |
| N7·Î2, N7·Î4 (tabelul T2024_2) | Tabelul are 9 rânduri; comp_t original are **10**: lipsește `['Massachusetts',1825,1829,'John Quincy Adams']`. Rezultatele nu se schimbă, dar jocul afirmă „tabelele sunt cele din fișierele comp_a originale”. | ODBC: `comp_t` 2024 v2 (10 rânduri) | În `T2024_2`, după `['Virginia',1817,1825,'James Monroe']` adaugă `,['Massachusetts',1825,1829,'John Quincy Adams']` | minor |
| N7·Î3 (interogare, 2022 v7) | **Enunțul dă răspunsul.** „Cerința … criteriul `Like "D*"`”, dar fișa spune „valorile din câmpul respectiv încep cu litera D”. Baremul dă 2p pe „expresie de selecție”. | `files\cd-2022\varianta7-2022\…fisa_B_var_07_LRO.pdf` pct. 5.a; barem 5.a | `q:'Cerința (BAC 2022, varianta 7, 5 puncte): un criteriu de selecție pe primul câmp al interogării comp_q, astfel încât să preia doar înregistrările în care valorile din acest câmp <strong>încep cu litera D</strong>. Interogarea afișează Eveniment și An1.'` | important |
| N7·Î3 | Elevul care scrie `D*` (Access completează singur `Like "D*"`) primește eroarea „Nu înțeleg valoarea «D*»”. Defect de motor (D3). | test Node | Vezi D3 | important |
| N7·Î5 (choice, rândul or) | Jocul predă rândul `or` (N7 text și Î5), dar grila simulatorului nu are rândul `or`: nu se poate exersa. Defect de motor (D5). | `tip-interogare.js` rândurile grilei: Field, Table, Sort, Show, Criteria | Vezi D5 | minor |
| N3·Î3 (interogare, după 2017 v5) | Fișa (5.b) cere „vizibil doar **unul dintre** câmpurile numerice” + câmpul numeric rămas pe prima poziție; baremul acceptă oricare. Jocul fixează Număr de audiții (spus explicit, deci corect în joc). În plus, comp_q original are un criteriu (3 înregistrări: Schubert, Brahms, Berlioz), iar jocul rulează fără el. | fișa B 2017 v5 pct. 5.b; barem 5.b („vizibilitate câmp, ordine câmpuri”); ODBC `comp_q` 2017 v5 | În `why`, la final: ` La examen puteai păstra oricare dintre cele două câmpuri numerice.` | minor |
| N8·Î1 (interogare, 2019 v1) | Criteriul neechivalent `>=160.1` e **acceptat**: câmpul Populația e Double (valori ca 161.1), iar singurul rând de graniță are exact 160. | ODBC: `('Populația','DOUBLE',53)`; test Node → ACCEPTAT | `variante:[[['Regiune de graniță',160,20,'Manual2']],[['Regiune de graniță 2',160.05,20,'Manual2']]]` | minor |
| N8·Î1 | Grila de referință face exact ce cere 5.a: criteriu `>160` și Ascending pe al doilea câmp al tabelei (Populația). comp_q original afișează Regiunea geografică și Populația, fără criteriu și fără sortare. Enunțul spune explicit „păstrează ambele coloane”. | ODBC `comp_q` 2019 v1; fișa B pct. 5.a; `2019-varianta1.html` | — (verificat) | — |
| N8·text | **Pagina de citit dezvăluie răspunsurile la N8·Î3 și N8·Î5**: „a) 5 puncte, dar numai 3 dacă doar unul dintre parametri … b) 2 puncte pentru crearea raportului și câte 1 punct pentru nume, câmpuri și grupare”. Întrebările cer exact „câte puncte primești”. | `index.html` linia 276 vs liniile 285, 295 | Înlocuiește paragraful cu: `<p>Punctele sunt cele din baremul oficial: 5 puncte pentru interogare și 5 pentru raport. Baremul dă punctaje parțiale; le afli în întrebări.</p>` | important |
| N8·Î2 (tf, `>=160`) | Explicația prezintă ca sigur că `>=160` pierde puncte chiar dacă rezultatul e identic. Baremul spune doar „numere preluate … conform cerinței”; e o interpretare (probabilă: evaluatorul deschide Design View), nu text de barem. | barem 2019 v1 pct. 5.a | În `why`: `Fals. Evaluatorul deschide interogarea în Design View și vede criteriul. „Strict mai mari” înseamnă &gt;160; cu &gt;=160, o regiune cu exact 160 ar intra în rezultat, deci criteriul nu e cel cerut.` | minor |
| N2·Î4 (traseu, 2018 v4) | Enunțul presupune că formularul comp_f există deja („în formularul comp_f”). Fișa cere **crearea** lui comp_f pentru tabela **comp_nou**, cu A de la tastatură și B din lista primului câmp al lui comp_t. Punctele 5p sunt corecte; barem 2018 v4 nu e pe disc. | `files\cd-2018\varianta4-2018\…fisa_B_var_04_LRO.pdf` pct. 5.a (folderul nu are barem) | `q:'Cerința (BAC 2018, varianta 4, 5 puncte), a doua parte: ai creat cu Form Wizard formularul <code>comp_f</code> pe tabela comp_nou. Câmpul B trebuie să-și ia valorile dintr-o listă cu primul câmp al tabelei comp_t.'` | minor |
| Citări prin sondaj | **Verificate, corecte:** 2015 v3 (comp_sort, descrescător după al doilea câmp, 3p), 2016 v4 (Check Box Valid 3p; Required 3p), 2016 v14 (al treilea câmp în comp_q, 3p), 2013 v10 (validare strict pozitive 3p; comp_ord câmpuri text 3p), 2024 v3 (comp_nou A text 30, B dată, 5p), 2018 v3 (comp_nr valori distincte + număr, 5p), 2023 model (C1, C2 tip implicit), 2017 model (comp_r pe comp_q, „vedere (Landscape)”, 5p — confirmă și eticheta românească „Vedere”). | fișele B și baremele din `files\cd-*` | — | — |
| Telefon (N8·Î1, 320 px) | La 320 px grila interogării are 513 px lățime într-o cutie de 250 px: se vede o singură coloană, iar criteriul din coloana 2 apare tăiat („>=”). Pagina nu scapă din ecran (scrollWidth = 320), niciun buton ieșit, 0 erori JS; grila se derulează pe orizontală. Nivelul final jucat cu o grilă greșită (`>=160`): respinsă cu indiciul „valori de la graniță”, nivelul terminat 4/5 din prima (la fel la 375 px). | Playwright 320×568 și 375×568; capturi `n8_interogare_gresita_iphonese.png`, `n8_final_nivel_iphonese.png` | În `tip-interogare.js` (CSS): `.qd table.qg th{…white-space:nowrap…}` → adaugă `@media (max-width:400px){.qd table.qg th:first-child{white-space:normal;max-width:4.5em}.qd table.qg select,.qd table.qg input[type=text]{min-width:5em}}` | minor |
| Dubluri (N3·Î2, N5·Î2, N5·Î3, N8·Î1, N8·Î2) | Aceeași capcană „strict / inclusiv la graniță” e testată de 5 ori, cu explicații aproape identice. Nu sunt dubluri propriu-zise (tabele diferite), dar ocupă loc în dauna citirii (A_citire_proprietate: 38% din variante, o singură întrebare). | `HARTA.md` rândul A_citire_proprietate; `index.html` liniile 157, 208, 213, 283, 284 | În N7, înlocuiește N7·Î4 (Texas/Virginia) cu o citire: `{t:'choice',q:'Cerința (BAC 2013, varianta 10, 1 punct): „Scrieţi pe foaia de examen numele interogării (query) din baza de date.” Unde te uiți?',o:['În panoul din stânga, la grupul Queries','În Design View al lui comp_t','În foaia de date a lui comp_t','În Report Wizard, la Tables/Queries'],ok:0,why:'Panoul din stânga arată numele interogării, aici comp_q. Report Wizard le arată și el, dar pe calea lungă.'}` | minor |
| Ghicit după formă | Nu am găsit variante bune mai lungi sistematic; variantele se amestecă (`shuffle` în `motor.js`). Adevărat/fals: 2 A, 3 F. | `motor.js` liniile 201, 212 | — | — |
| N8 (text, Î3, Î5) | **Verificat, corect.** Cerințele 5.a/5.b (text copiat fidel) și punctele (5p; „Se acordă numai 3p. dacă un singur parametru (numere preluate, ordine vizualizare) este conform cerinței”; b: 2p creare + câte 1p nume/câmpuri/grupare) corespund baremului de pe disc. Calculele 3p și 4p sunt corecte. | `files\cd-2019\varianta1-2019\D_Competente_digitale_2019_fisa_B_var_01_LRO.pdf` pct. 5; `..._bar_01_LRO.pdf` p.2 (pdfplumber) | — | — |

## Defecte ale simulatorului tip-interogare (motorul, nu jocul)
Fișierul: `C:\00\AI_0\projects\subcompetente-digitale\jocuri\_motor\tip-interogare.js`. Toate dovezile sunt rulate în Node pe `JocInterogare.run` / `parse` (scripturile `scratchpad\acc\test_q.js` și o probă separată), nu doar citite. Afectează toate jocurile care folosesc simulatorul.

| # | defect | dovadă (rulat) | reparație exactă | gravitate |
|---|---|---|---|---|
| D1 | **`Not Between a And b` dă rezultat greșit, fără eroare.** `splitKw(s,'and')` se aplică fiindcă textul nu *începe* cu Between; se rupe în „Not Between 1” și „9”, iar „Between 1” e luat drept text. | `Not Between 1 And 9` pe Nr = 5, Null, 15 → `[]` (corect în Access: rândul cu 15) | În `parse`: `if(!/^between\b/i.test(s))` → `if(!/^(not\s+)?between\b/i.test(s)&&!/\bbetween\s+\S+\s+and\s/i.test(s))`, și înainte de `if((m=s.match(/^not\s+(.+)$/i)))` adaugă `if((m=s.match(/^not\s+between\s+(.+?)\s+and\s+(.+)$/i))){const a=lit(m[1]),b=lit(m[2]);return v=>v!=null&&v!==''&&!(cmp(v,'>=',a)&&cmp(v,'<=',b))}` | important |
| D2 | **Between combinat cu And în aceeași celulă** (`>=5 And Between 1 And 20`) e rupt greșit → `[]`. | → `[]` (corect: 5 și 15) | Același test din D1: nu împărți după And când celula conține `between x and y`; sau tokenizează Between înainte de `splitKw` | minor |
| D3 | **`D*` fără ghilimele și fără Like dă eroare.** În Access, criteriul `D*` scris în grilă devine singur `Like "D*"`; motorul spune „Nu înțeleg valoarea «D*»”. | N7·Î3: `D*` → EROARE | Înainte de `const x=lit(s)` (ultima linie din `parse`): `if(/[*?]/.test(s)&&!/^["“„]/.test(s))return v=>like(v,s);` | important |
| D4 | **Null la criteriile de text negative.** În Access, `<>"Iasi"` și `Not "Ana"` exclud câmpurile goale (Null). Motorul le include, pentru că `String(v??'')` face din Null un text gol. La numere (`<>1960`) Null e exclus corect. | `<>"12"` pe Txt cu Null → include rândul Null; `Not "Ana"` → include Bob (Null) | În `cmp`, prima linie: `if(v===null||v===undefined||v==='')return false;` și la `not`: `return v=>v!=null&&v!==''&&!f(v)` | important |
| D5 | **Nu există rândul `or`.** Grila are doar Field, Table, Sort, Show, Criteria. Condiția „câmpul 2 SAU câmpul 3” (BAC 2022 model, 5p) nu se poate construi; două coloane cu criterii se leagă mereu cu And. | N7·Î4: Texas pe Criteria + Virginia pe altă coloană → 0 rânduri | Adaugă rândul `or` (`g.sau`) în `draw` și în `run`: `rows=tabel.randuri.filter(r=>filt.every(x=>x.f(r[x.i]))||(sau.length&&sau.every(x=>x.f(r[x.i]))))` | important |
| D6 | **Ordinea între înregistrările egale e comparată strict.** Dacă referința sortează după un câmp cu valori repetate, o sortare secundară (legitimă) e respinsă „ordinea nu”. | N5·Î3: Ascending pe Exercițiu + Descending pe Număr → RESPINS ordine | În `problems()`, la `exp.sortat`, compară doar cheile de sortare din `ref`: `const key=R=>R.rows.map(r=>JSON.stringify(sortCols.map(i=>r[i])))` în loc de rândurile întregi | minor |
| D7 | **Număr pe câmp text / text pe câmp numeric nu se convertesc.** Access convertește `12` la „12” pe un câmp text și `"1969"` la 1969 pe un câmp numeric. Motorul întoarce `[]` în primul caz și compară lexical în al doilea (`>"1969"` lasă să treacă 210). | `12` pe Txt → `[]`; `>"1969"` pe An → include 210 | În `cmp`: `if(typeof x==='number'&&typeof v==='string'&&v.trim()!==''&&!isNaN(+v))v=+v; if(typeof x==='string'&&typeof v==='number'&&x.trim()!==''&&!isNaN(+x))x=+x;` | minor |
| D8 | **Datele `#…#` se compară ca text.** `lit` scoate diezii și întoarce șirul; `>#1/1/2020#` compară lexical („2019-12-01” > „1/1/2020”). Niciun joc Access actual nu are câmp dată, deci nu apare încă. | `>#1/1/2020#` → include 2019-12-01 | În `lit`: `if(/^#.*#$/.test(s)){const d=Date.parse(s.slice(1,-1));if(!isNaN(d))return d}` și celulele de tip dată stocate ca număr (ms) | minor |
| D9 | **Sortarea cu Null:** Access pune Null primul la Ascending; motorul îl pune ultimul. | `sort asc` pe Nr cu Null → Null ultimul | În comparatorul de sortare: `if(x==null&&y!=null)return g.sort==='asc'?-1:1; if(y==null&&x!=null)return g.sort==='asc'?1:-1;` | minor |
| D10 | **Lipsesc funcțiile punctate la examen:** rândul Total (Group By/Count, A_interogare_totaluri), câmpul calculat (`Produs: [Camp2]*[Camp3]`, A_camp_calculat, 2018 v11), câmpul `*`. Jocurile le acoperă doar prin trasee. | `run` citește doar `camp/arata/sort/criteriu` | Documentează limita în antet: `Nu simulează: rândul or, Total, câmpuri calculate, *.` (sau implementează ulterior) | minor |
| D11 | **Rândurile `variante` nu știu tipul câmpului.** Motorul acceptă rânduri imposibile (10.5 într-un Integer), care resping echivalente legitime. | N5·Î3 `>=11` respins | În antet, la `variante`: `// rândurile de graniță respectă tipul câmpului din comp_a (Integer: fără zecimale)`; opțional `tabel.tipuri` și o verificare în `problems()` | minor |

## Rezumat pe gravitate
| | blochează | important | minor |
|---|---|---|---|
| jocul `access-xii` | 0 | 5 | 10 |
| motorul `tip-interogare` | 0 | 4 (D1, D3, D4, D5) | 7 |

(N7·Î3 „D*” e numărat la motor, D3.)

## Verdict
**Publicabil după reparații: DA.** Nivelul final se potrivește cu fișa și baremul 2019 v1 (există pe disc). Grilele de referință dau ce cere examenul. Înainte de publicare trebuie reparate cele 5 constatări importante din joc: N5·Î2 (cerința reală 2017 v7 respinsă), N5·Î3 (rândul 10.5 care respinge `>=11`), N7·Î2 și N7·Î3 (enunțurile dau operatorul punctat), textul N8 (dezvăluie punctajele întrebate). Defectele motorului D1, D3, D4, D5 se repară separat, pentru toate jocurile.
