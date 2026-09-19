# Lecții-joc LearningHub — doctrina și specificația

> **Document viu.** Îl îmbunătățim după fiecare val de jocuri: ce a mers și ce nu intră în §9, cu data.
> Vederea pentru profesor (rezumat): vaultul Obsidian `Scoala\Lectii-joc — cum le construim.md`.
> Live: https://learninghub-8z6.pages.dev/jocuri/

## 1. Ce este o lecție-joc

Un stil diferit de lecțiile Format C din LearningHub: **o pagină scurtă de citit → întrebări DESPRE ea → nivelul următor**. La final elevul primește o **diplomă** și o **provocare de făcut în aplicația reală**. Scopul nu e să înlocuiască ora, ci să fixeze vocabularul și gesturile unității, jucând.

## 2. Traseul materiei (de unde vine fiecare joc)

Un joc = **o unitate de învățare** din planificarea anului, în ordinea în care se predă.

| Sursa | Ce iei din ea |
|---|---|
| `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json` | unitatea (`id`, `titlu`, `cs`, `ore`) și **titlurile lecțiilor**. Acestea sunt scheletul nivelurilor |
| `C:\00\Projects\Info_Gimnaziu_2026\planificari\Planificare_calendaristica_clasa_<V..VIII>.md` | săptămânile în care se predă unitatea |
| `C:\00\Projects\Info_Gimnaziu_2026\planificari\Proiectul_unitatii_<id>.md` (unde există) + `materiale\` | ce se face concret la clasă, exemplele profesorului |
| `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` | textul competențelor specifice, activitățile de învățare, conținuturile, descriptorii De bază / Consolidat / Avansat (actul oficial: OMEN 3393/2017) |
| `C:\00\Projects\LearningHub\content\tic\cls<5..8>\` | lecțiile existente pe aceeași temă: aceiași termeni, nicio contrazicere |

Harta jocurilor pe an: `jocuri\catalog.js` (generat de `python jocuri\_motor\catalog_build.py`). Nu se editează de mână.

**Centralizarea în LearningHub.** Toate se regenerează, nimic nu se editează de mână.
- **Hub:** cardul „Jocuri TIC” duce la `/jocuri/`.
- **`/jocuri/`:** traseul pe clase, iar fiecare unitate are jocurile ei.
- **Pagina fiecărei clase** (`content\tic\cls5..cls8\index.html`) are blocul „Jocuri TIC” între markerii `JOCURI:START/END`, scris tot de `catalog_build.py`.
- **Fiecare joc** are breadcrumb generat de motor: 🏠 LearningHub › Jocuri TIC › Clasa › Jocul › Nivelul (numele jocului duce înapoi la cuprins).
- **După ce adaugi un joc:** rulezi `catalog_build.py`, și toate cele trei locuri se actualizează.

## 3. Cum construiești un joc (pașii unui agent)

0. Citește acest README întreg + un joc-model (`excel-viii\index.html`).
1. **Ancora:** găsește unitatea în `unitati.json` și competențele ei în `curriculum.json`. Notează titlurile lecțiilor.
2. **Documentare:** citește lecțiile LearningHub ale unității și proiectul unității, dacă există. Adună termenii exacți și greșelile tipice ale elevilor.
3. **Plan:** 5-7 niveluri. De regulă un nivel acoperă 1-2 lecții din unitate, în ordinea lor. Ultimul nivel are `final:true` și e o sarcină integratoare dintr-un context real (exemplele din programă sunt cele mai bune).
4. **Scrie** folderul `jocuri\<slug>\index.html` (slug = `<tema>-<clasa cu cifre romane mici>`, de ex. `prezentari-vi`).
5. **Poarta:** `python jocuri\_motor\test_joc.py <slug>` trebuie să dea `TRECUT`. Repară până trece. Citește și avertismentele.
6. **Raport:** ce ai făcut, pe ce surse, ce fapte despre interfață NU ai putut verifica (§6).

Un agent scrie **doar în folderul jocului lui**. Nu atinge `_motor\`, `index.html`, `catalog.js` sau alte jocuri. Dacă motorul are nevoie de ceva, cere în raport.

## 4. Configurația (tot jocul e date)

```html
<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Misiunea X</title>
<meta name="description" content="…o propoziție…">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…&display=swap">
<link rel="stylesheet" href="../_motor/motor.css">
<style> /* DOAR tema: jetoane + .banda + mici accente, vezi §5 */ </style>
</head>
<body>
<script src="../_motor/motor.js"></script>
<script>
JocMotor.porneste({
  cheie:'joc_prezentari_vi',          // unic, pentru progresul salvat
  titlu:'Misiunea Diapozitiv', marca:'Misiunea <b>Diapozitiv</b>', h1:'…html opțional…',
  clasa:'a VI-a', unitate:'VI-U1', unitateTitlu:'Prezentări digitale',   // exact ca în unitati.json
  competente:['CS.1.1','CS.3.1'], lectii:'2–10',
  intro:'…2-3 propoziții: ce învață și cum se joacă…',
  banda:'…html pentru fâșia de sus, din lumea subiectului…',
  nivele:[ {t:'Titlul nivelului', text:`<p>…</p>`, qs:[ …întrebări… ]}, …, {t:'…', final:true, text:`…`, qs:[…]} ],
  diploma:{titlu:'Designer de prezentări', rezumat:'…ce a parcurs, fără punct final…', aplicatie:'PowerPoint-ul adevărat',
           provocare:['pas 1','pas 2','…salvează ca <code>Nume_Prenume_x.pptx</code>']},
  tipuri:{ /* doar pentru simulatoare, §7 */ }
});
</script>
</body>
</html>
```

### Tipurile de întrebări incluse

| `t` | Câmpuri | Folosește-l când |
|---|---|---|
| `choice` | `q, o:[3-4 variante], ok:indice, why` (variantele se amestecă; `amesteca:false` le lasă fixe) | o singură idee corectă; variantele greșite = confuzii reale |
| `tf` | `q, ok:true/false, why` | un mit sau o regulă des încălcată |
| `order` | `q, items:[pașii în ordinea corectă], why` | o procedură cu ordine **unică** |
| `classify` | `q, cats:[2-4 categorii], items:[[text, indiceCategorie],…], why` | a sorta exemple (intrare/ieșire, sigur/nesigur…) |
| `match` | `q, pairs:[[termen, definiție],…] (3-6), why` | vocabular: termen ↔ rol/definiție |
| `hunt` | `q, src:'text cu [[fragment greșit|explicație]]', spatii:true?, indiciu?, why` | a găsi greșeli într-un text/mesaj/adresă |
| `pick` | `q, cols, rows, ans:'C5' sau 'B2:C4', range:true?, cells:{A1:'…'}?, why` | a alege o celulă/zonă dintr-o grilă |

**Acoperirea declarată (obligatorie, verificată de poartă, 15.09.2026):** fiecare nivel are `lectii:[4,7]` (numerele lecțiilor din unitate, din `unitati.json`) și `continuturi:['textul EXACT din programă', …]` (din `curriculum.json`, domeniile unității din `_motor\unitati_domenii.json`). Declari doar ce e adevărat: pagina de citit predă ȘI cel puțin o întrebare verifică. Harta completă: `python jocuri\_motor\acoperire.py` → `jocuri\ACOPERIRE.md` (❌ = lecție sau conținut neacoperit în unitățile care au jocuri). Jocurile fără motor declară în `<slug>\acoperire.json`.

### Antrenament (stratul 2 al repetiției, decis 15.09.2026)

Pe lângă jocul de învățare, fiecare unitate primește un **joc de antrenament**: fără pagini de citit, cu **întrebări trase la întâmplare dintr-un bazin**. La fiecare reluare elevul primește altele, pe aceleași lucruri. Rațiunea: reamintirea activă și spațierea fixează materia, iar aceleași întrebări rejucate se învață pe de rost.

```js
JocMotor.porneste({ mod:'antrenament', titlu:'Antrenament: Word', unitate:'VII-U1', /* ...restul ca la orice joc... */
  nivele:[
    {t:'De bază', descriptor:'De bază', cate:6, bazin:[ /* ≥12 întrebări noi */ ], lectii:[…], continuturi:[…], text:'<p>opțional: o amintire de 2-3 rânduri</p>'},
    {t:'Consolidat', descriptor:'Consolidat', cate:6, bazin:[…], …},
    {t:'Avansat', descriptor:'Avansat', final:true, cate:5, bazin:[…], …}
  ]})
```

- **Rundele urmează descriptorii din programă** (`curriculum.json` → competența → `descriptori`): De bază = cu sprijin, pași ghidați, context familiar; Consolidat = independent, mai multe elemente; Avansat = context nou, după specificații. Aceeași structură ca lucrarea de evaluare (A De bază / B Consolidat / C Avansat).
- **Bazinul are cel puțin 2 × `cate` întrebări** (poarta verifică). Motorul trage întâi întrebările nevăzute; când bazinul s-a epuizat, ciclul reîncepe.
- **Întrebările sunt NOI, nu copii din jocul de învățare.** Pasul 0 al agentului: extrage toate întrebările existente ale unității și nu le repeta (lecție din valul-pilot LearningHub, unde 14 din 36 de itemi scriși de agenți dublau itemi existenți).
- **Acoperire:** fiecare rundă declară `lectii` și `continuturi`, iar toate rundele împreună acoperă toate conținuturile unității.
- **Poarta joacă tot bazinul**, nu doar ce iese la tragere, și verifică tragerea reală: o rundă terminată și reluată trebuie să aducă alte întrebări.
- **Fiecare întrebare din bazin are `lectii:[n]`.** Motorul trage echilibrat pe lecții (câte una din fiecare lecție, pe rând), ca o rundă de 6 să nu sară lecții întregi.
- **„Văzut” se scrie abia la finalul rundei.** O rundă deschisă și abandonată nu consumă întrebări.
- **Pasul 0, mecanic:** `python jocuri\_motor\intrebari_unitate.py <UNITATE>` dă toate întrebările existente ale unității, inclusiv din jocurile vechi. La final, `python jocuri\_motor\intrebari_unitate.py <UNITATE> --verifica jocuri\<slug>\index.html` trebuie să dea 0 perechi prea apropiate (asemănare pe cuvinte de conținut ≥ 0,40, fără formulele de enunț).
- **Sursele descărcate (curl) se verifică să nu fie pagini de eroare** („page not found”, 404). Pilotul avea două „surse” care erau de fapt pagini 404.

### Recapitularea amestecată (stratul 3, 15.09.2026)

Câte un joc pe clasă, `jocuri\recapitulare-<clasa>\`, **GENERAT** de `python jocuri\_motor\recapitulare_build.py`. Scriptul e chemat automat de `catalog_build.py`. **Nu se editează de mână și nu copiază întrebări:** la fiecare generare le ia din jocurile de învățare și de antrenament ale clasei, deci o întrebare reparată într-un joc ajunge și în recapitulare.

- **3 runde.** „Amestec ușor” = prima treime din nivelurile jocurilor de învățare + runda De bază a antrenamentelor. „Amestec mediu” = treimea din mijloc + Consolidat. „Amestec greu” = ultima treime, cu nivelul final + Avansat. Fiecare rundă trage 8 întrebări, întâi pe cele nevăzute.
- **Amestecul e garantat.** Fiecare întrebare poartă `grup` = unitatea din care vine, iar motorul trage echilibrat întâi pe unități, apoi pe lecții. Măsurat pe 200 de trageri pe rundă, la clasele VI–VIII: 0 trageri cu o singură unitate. Înainte de `grup` erau 6 din 200 la clasa a VIII-a.
- **Sub fiecare explicație scrie jocul și nivelul de unde vine întrebarea,** ca elevul să știe unde să revină.
- **Intră doar tipurile care merg fără pagina jocului lor:** cele incluse în motor + foaia de calcul. Simulatoarele definite într-un singur joc (diapozitiv, montaj, cod, pagina, formatare) nu intră.
- **Unitatea din configurație e unitatea „Recapitulare” a clasei (`V-R` etc.),** cu toate competențele. Poarta verifică lecțiile și conținuturile pe toată clasa, iar `acoperire.py` nu o socotește la acoperirea unităților, pentru că nu adaugă nimic nou.
- **Pe măsură ce apar jocuri pentru unitățile următoare, recapitularea crește singură** la următoarea rulare a `catalog_build.py`.

`q`, `why`, `text` și `intro` acceptă HTML (`<code>`, `<kbd>`, `<mark>`, `<strong>`). Variantele (`o`, `items`, `pairs`) sunt text simplu.

## 5. Tema: aspectul vine din lumea subiectului

- **Regula:** jocul arată ca unealta sau lumea despre care învață copilul, nu ca un quiz generic. Word = foaie cu riglă, Excel = cap de coloane A B C. Prezentări = benzi de diapozitive. Internet = bara de adresă. Hardware = placă de bază/porturi.
- Jetoanele, definite în `:root` pentru tema luminoasă și redefinite în `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){…}}` și `:root[data-theme="dark"]{…}`: `--desk --paper --paper2 --line --ink --ink2 --accent --accentInk --sel --mark --markInk --ok --okbg --bad --badbg --fd --fb --fm`.
- **Fonturi:** o pereche aleasă pentru subiect (titlu cu caracter + text foarte lizibil + mono), de pe Google Fonts, **cu subset latin-ext** (ș, ț). Evită Inter/Space Grotesk/Roboto ca alegere „sigură”. Nu repeta perechea altui joc.
- `.banda` = fâșia de sus (min. 10px): pune acolo detaliul-semnătură al subiectului, doar CSS/HTML, fără imagini externe.
- Fără emoji ca marcaje de secțiune. Contrast bun în ambele teme.

## 6. Conținutul

- **Pagina de citit:** 60-120 de cuvinte, 3-5 paragrafe scurte, termenii-cheie în `<mark>`, scurtăturile în `<kbd>`. Limbaj de clasa respectivă (la a V-a propoziții mai scurte).
- **Întrebările (4-5 pe nivel)** sunt DESPRE textul tocmai citit. Amestecă cel puțin 3 tipuri în joc. Primul item al unui nivel e bine să fie `choice`/`tf` (poarta testează pe el răspunsul greșit).
- **`why` explică mereu de ce**, nu repetă răspunsul.
- **Distractorii** = greșeli pe care le fac copiii de fapt (Backspace/Delete, copiere/decupare, http/https…).
- **Română cu diacritice** (ș, ț cu virgulă). Ghilimele românești „…”.
- **Fapte despre interfață:** nu inventa nume de butoane, meniuri sau file. Dacă nu ești sigur, formulează prudent și învață-l pe copil să verifice („ține mouse-ul pe buton”). Listează în raport tot ce e NEVERIFICAT. Verificat deja: Excel în română păstrează numele funcțiilor în engleză (SUM, AVERAGE); separatorul din IF e `;` sau `,` după setări.
- **Siguranță online / date personale:** exemple inventate, fără nume reale de elevi, fără linkuri reale spre site-uri dubioase.
- **Nivelul final** folosește un context din programă (activitățile de învățare din `curriculum.json`).

## 7. Simulatoare („fac eu”)

Când unitatea cere un gest, nu doar vocabular, scrie un tip nou în `tipuri`:

```js
tipuri:{ nume:{
  render(Q, body, api){ /* desenezi în body; la verificare: api.checkButton(fn) apoi api.resolve(true|false, mesaj) */ },
  rezolva(Q, body, api){ /* pune răspunsul corect în pagină, pentru poarta automată */ },
  gresit(Q, body, api){ /* pune un răspuns GREȘIT tipic de copil; poarta verifică că e respins */ }
}}
```

`api`: `esc, resolve, giveUp, revealButton, checkButton, feedback, shuffle, done(), attempts(), nav()`. După 2 încercări greșite cheamă `api.revealButton(()=>{…arată soluția…; api.giveUp('…')})`. Modelul complet: `_motor\tip-foaie.js` (Excel). Verificarea trebuie să fie **pe comportament**: o formulă se testează și pe date schimbate, ca să nu treacă una scrisă „de mână”. Un simulator nou, reutilizabil, se mută în `_motor\` doar după ce a mers într-un joc.

## 8. Poarta (`_motor\test_joc.py`)

Blochează:
- ancora în programă (unitatea există la clasa respectivă, competențele sunt ale ei);
- structura întrebărilor;
- `<!doctype html>`, viewport, title, legăturile la motor;
- diacriticele (minim 15 la 1000 de litere);
- pe Pixel 7 + iPhone SE: zero erori JS, nimic mai lat decât ecranul, fiecare întrebare rezolvată corect e acceptată, un răspuns greșit e respins, 3 stele la rezolvare din prima, diploma se deschide.

Doar avertizează: numărul de cuvinte și de niveluri. Poarta a fost verificată și invers (15.09.2026): o copie stricată cu 5 defecte plantate a picat cu toate 5 raportate.

**Poarta NU verifică adevărul faptelor și calitatea pedagogică.** Pentru asta e nevoie de un evaluator independent (alt agent, care n-a scris jocul): face sarcina ca un elev, verifică faptele pe surse, citește ca un copil de 11-14 ani.

## 9. Lecții învățate (straturi datate; nu șterge, adaugă)

**15.09.2026 — primele două jocuri (Word VII, Excel VIII)**
- Bara de sus pe telefon se restrânge la derularea în jos, iar revenirea e **doar manuală** (▾ sau tragere). Tiparul vine din uneltele de repartizare. Capture-ul gestului se pune abia după 10px, altfel butoanele de pe bară nu mai răspund.
- Fără `<meta viewport>`, emularea de telefon așază pagina ca pe desktop. Testele trebuie făcute cu **emulare de dispozitiv**, nu cu fereastră îngustă.
- Fără `<!doctype html>`, pagina intră în modul vechi de compatibilitate. Pe Artifact nu se vedea, fiindcă platforma o adaugă.
- Grila tip Excel trebuie să **încapă la 320px**, altfel coloana în care scrie elevul iese din ecran. Textul se desparte doar între cuvinte.
- Simulatorul de foaie de calcul prinde `=15` scris de mână și `>5` în loc de `>=5` doar pentru că verifică pe **date schimbate** (automat + variante alese, ex. media exact 5).
- Pagina scurtă nu se derulează, deci bara nu are ce restrânge. La testarea barei se lungește pagina artificial.
- Întrebarea `order` cu pași interschimbabili (aldin/centrat) e o capcană; ordinea trebuie să fie unică.
- Artifact-urile claude.ai nu sunt pentru elevi: cer cont și arată bara claude.ai. Casa jocurilor e LearningHub `/jocuri/`.
- Dovada publicării = textul jocului pe pagina live (+ parcurgerea linkurilor), nu codul 200.
- `LearningHub\tools\*.py` aveau rădăcina veche `C:\AI\Projects\LearningHub` (22 de fișiere). Au fost trecute pe `Path(__file__).resolve().parents[1]`; `site_audit.py` scanează din nou (250 de fișiere în loc de 0).
- Pagina hub LearningHub deschide la prima vizită o fereastră „Numele tău”, care blochează clicurile în teste. În teste se citește `href`-ul, nu se dă clic.

**15.09.2026 — motorul comun**
- Jocurile au trecut de la „un fișier de 800 de linii” la **motor comun + configurație**. O îmbunătățire în motor ajunge în toate jocurile. Agenții scriu date, nu cod de joc, deci apar mai puține greșeli.
- Pilot înainte de val: Excel VIII portat pe motor a trecut poarta (58 de întrebări jucate pe 2 telefoane).
- Word VII a rămas încă joc de sine stătător (are editorul și vânătoarea lui). Portarea lui e deschisă (§10).

**15.09.2026 — valul 2: 5 agenți, câte o unitate (V-U1, VI-U1, VI-U2, VII-U2, VIII-U2)**
- Toți 5 au trecut poarta, fără avertismente. Am rulat eu poarta pe fiecare, independent de raportul agentului (`--toate`: 6 jocuri pe motor TRECUT).
- **Folderele temporare trebuie separate pe agent.** Agenții care lucrau în paralel și-au suprascris scripturile de test în folderul temporar comun. De acum fiecare agent primește un folder de lucru al lui (ex. `_campaign\<val>\<slug>\`).
- **Agenții citesc celelalte jocuri care se fac în paralel și își schimbă singuri tema dacă se repetă** (fonturi, accent). Nu era cerut; e bine, dar o listă de „teme luate” în prompt ar evita munca dublă.
- **Simulatoarele verificate pe comportament au ieșit bine** la toți cei care le-au făcut: `diapozitiv` (contrast calculat + mărimi), `montaj` (ordine + tăieri cu toleranță), `cod` (HTML parsat cu DOMParser, previzualizare în iframe sandbox, fără scripturi). Candidați pentru `_motor\` după ce merg la clasă.
- **Agenții au găsit contradicții între surse**, pe care un singur autor nu le-ar fi văzut:
  - regula 20-20-20: „20 de pași” în material vs 6 m în LearningHub;
  - mărimea textului pe diapozitiv: 24–28 vs 18–28;
  - un font vs 2–3 fonturi;
  - stickul USB: intrare-ieșire vs stocare.
  Soluția bună: formulare compatibilă cu ambele surse + contradicția trecută în raport pentru profesor, nu aleasă tacit.
- `hunt`: un fragment lung care se rupe pe două rânduri apărea centrat → `.tk{text-align:left}` pus în motor. Un fragment greșit care conține spații e UN singur buton (intenționat).
- **Evaluatorii independenți au prins ce nu vedeau nici autorii, nici poarta:**
  - un film de 8 GB dat ca „încape” pe un card de 32 GB, deși cardurile formatate FAT32 nu primesc fișiere de peste 4 GB → scenariul a devenit 3,5 GB vs CD de 700 MB;
  - parola „minim 8 caractere” → 15 (DNSC);
  - „Ctrl+N merge în orice aplicație” (în Google Slides nu merge);
  - numele animațiilor diferite de PowerPoint în română;
  - greșeli nemarcate într-un text de vânătoare, care penalizau copilul atent;
  - lipsa acordului părinților la filmarea unui minor.
- **Scurgerea răspunsului prin formă:** în `hunt`, o greșeală de mai multe cuvinte era UN buton lung, iar textul corect era câte un buton pe cuvânt, deci lungimea butonului trăda răspunsul. Reparat în motor: și greșelile se desenează cuvânt cu cuvânt, cu marcare pe grup. Regula generală: **forma unei variante (lungime, poziție, stil) nu are voie să difere între corect și greșit.**
**15.09.2026 — centralizare, „Nivelul X din N”, acoperirea programei**
- **Elevii întrebau câte niveluri sunt** → motorul scrie „Nivelul 3 din 7” peste tot: în bară, pe pagina de citit, la întrebări, în breadcrumb, în cuprins și la final („mai sunt 4 niveluri”). Nu ascunde numărul total.
- **Acoperirea programei devine măsurabilă:** nivelurile declară lecțiile și conținuturile, poarta refuză declarațiile care nu există în programă, iar `acoperire.py` arată golurile. Declarația poate minți („declarat, dar nepredat”), așa că o confirmă auditorul sau evaluatorul independent, nu unealta.
- **Poarta verifica la simulatoare doar că răspunsul corect e acceptat** (semnalat de agentul care a construit al doilea joc de Word). Acum simulatorul declară `gresit()`, iar poarta verifică și respingerea. Control negativ: un simulator care acceptă răspunsul greșit a picat, cu mesaj explicit.
- **O unitate mare poate avea două jocuri** (Word VII: „Tehnoredactor” + „Machetă”). Acoperirea unității se socotește pe toate jocurile ei împreună.
- Poarta NU vede faptele și pedagogia → după poartă urmează un **evaluator independent** pe fiecare joc (protocolul hibrid „omul la calculator”, două treceri), care repară doar greșelile clare și dovedite și raportează restul.

**15.09.2026 (seara) — clasa a XII-a, proba D: Word, Excel, PowerPoint, Access + Simulare**
- **Ancora nu e o programă, ci examenul.** 635 de cerințe din 45 de rezolvări reale au fost sparte în 92 de operații, cu punctele din barem (`data\proba_d\`, `build_unitati.py` → `unitati_xii.json`, cu aceeași formă ca `unitati.json`). Un evaluator independent a verificat 5 variante: 0 cerințe lipsă, 0 inventate, 0 puncte greșite și 5 etichete greșite (corectate în build; `raw\` rămâne neatins).
- **Datele au răsturnat intuiția:** la Excel, formulele aduc puțin (IF 24 p). Punctele mari sunt la formatarea celulelor (123 p), la setarea paginii (98 p) și la formatul numerelor (54 p). Referința absolută `$` nu apare în niciun subiect. **Nivelurile se ordonează după punctele din barem, nu după manual.**
- **Divide et impera la aplicații = drumul prin meniu.** Aproape orice cerință înseamnă: selectezi → ajungi la comandă → alegi opțiunea → scrii valoarea. Pentru asta s-au construit:
  - `tip-traseu.js` (meniuri, cu drumuri alternative prin `ok:[i,j]`);
  - `tip-interogare.js` (grila Access rulată pe tabel, cu rânduri de graniță care prind criteriul „aproape bun”).
- **Lecțiile pilotului Excel, trecute în `_campaign\jocuri_xii_2026_09\BRIEF_CONSTRUCTOR.md`,** au scăzut greșelile valului: Excel a avut 2 care blochează + 9 importante; Word, PowerPoint și Access au avut 0 care blochează și 1–5 importante.
  - Primesc punctaj toate drumurile pe care le acceptă baremul.
  - Pagina de citit nu dă răspunsul din nivelul final.
  - Nu se inventează defalcări de barem.
  - Distractorii sunt comenzi reale.
- **Poziția variantei bune** era pe primul loc la 27 din 54 de pași → `tip-traseu` amestecă butoanele.
- **Indiciile trebuie legate de clicul făcut.** Un indiciu general care numește un distractor apărea la orice clic greșit → `indicii:{i:'...'}` pe fiecare variantă.
- **Simulatorul trebuie să se poarte ca aplicația reală, altfel respinge elevul care are dreptate.**
  - În Access, `D*` devine singur `Like "D*"`.
  - Câmpul gol (Null) nu trece la `<>` sau `Not`.
  - Între câmpuri diferite există și rândul `or`.
- **Numele filelor diferă între versiunile de Office** (Table Tools › Design în 2016, Table Design în 365): categoriile și traseele nu au voie să penalizeze cealaltă versiune.
- **3 evaluatori în paralel s-au blocat fără să scrie nimic.** Cauza: pași lungi de citit PDF-uri și browser, fără nicio scriere. De aceea `BRIEF_EVALUATOR.md` cere: raportul se creează imediat și se completează după fiecare nivel, PDF-urile se citesc pe pagini, browserul rulează cu `timeout`.
- **Pe un site public, un joc în lucru nu are voie să ajungă live pe nevăzute** → `subcompetente-digitale\jocuri\publicate.json` = lista explicită. Motorul rămâne într-un singur loc (LearningHub) și se copiază prin `jocuri_sync.py`. Simularea se regenerează cu `--simulare`.
- **Dovada de final (live, iPhone SE emulat):** 31/31 verificări.
  - Cele 5 jocuri se deschid, iar nivelul 1 dă 3 stele.
  - Răspunsul greșit e respins.
  - Butonul apare pe cele 4 lecții.
  - Simularea amestecă toate 4 aplicațiile, iar a doua tragere are 0 întrebări comune cu prima.

## 10. Deschis / de îmbunătățit

- Portarea Word VII pe motor (editorul → `_motor\tip-editor.js`).
- Profesorul vede scorul doar pe ecranul elevului (fără server). Un formular sau un cod de verificare, dacă se cere.
- Etichetele din aplicațiile în română (Word, Excel, PowerPoint…) de verificat pe calculatoarele din laborator.
- Evaluatorul independent (pedagogie + fapte) ca pas fix după poartă.
- XII: antrenamentele pe aplicații (De bază / Consolidat / Avansat) nu sunt încă făcute. Pagina jocurilor le lasă loc automat (`word-antrenament-xii`…).
- XII: etichetele românești marcate „neverificabil” de evaluatori (ex. „Cu anteriorul”, „Panou animație”, „Vizualizare proiect”) de confirmat pe un Office în română. Până atunci butoanele rămân în engleză.
- `tip-traseu`: drumuri alternative cu număr diferit de pași (clic dreapta sare peste 2 pași) nu se pot declara.
