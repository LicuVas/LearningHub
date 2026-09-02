export const meta = {
  name: 'lh-night-sanitar1',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul sanitar1 (17 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Postliceal sanitar, anul I - medicina generala", "audience": "adulti, elevi in anul I la scoala postliceala sanitara, calificarea asistent medical generalist", "flavor": "Exemplele sunt din activitatea medicala: evidenta parametrilor vitali, tratamente, stocuri de materiale sanitare, evidenta pacientilor, documente medicale. Protectia datelor pacientilor apare oriunde e relevanta, nu doar in lectia dedicata. Nu da sfaturi clinice si nu descrie tratamente - lectia e despre calculator, contextul e medical.", "modules": [{"cls": "an1-medicina", "module": "c1-sistem-de-operare", "title": "C1. Sistemul de Operare", "icon": "💻", "desc": "Competenta 1: interfata, organizarea informatiilor, securitate", "indexPath": "content/profesional/sanitar/an1-medicina/c1-sistem-de-operare/index.html", "gradeName": "Postliceal, Anul I", "audienceShort": "Postliceal Sanitar, Anul I", "lessons": [{"file": "lectia1-interfata-windows.html", "topic": "Interfata sistemului de operare: desktop, bara de activitati, ferestre, meniuri, setari. Operatii de baza intr-un cabinet - instalarea unei imprimante, conectarea la retea, gestionarea unui cont de utilizator.", "prev": "index.html", "next": "lectia2-organizarea-informatiilor.html", "idx": 1, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c1-sistem-de-operare/lectia1-interfata-windows.html"}, {"file": "lectia2-organizarea-informatiilor.html", "topic": "Organizarea informatiilor: unitati, foldere, fisiere, extensii, cai. O structura de foldere care nu se pierde, copiere - mutare - redenumire, cautare si cos de reciclare.", "prev": "lectia1-interfata-windows.html", "next": "lectia3-securitate-copii.html", "idx": 2, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c1-sistem-de-operare/lectia2-organizarea-informatiilor.html"}, {"file": "lectia3-securitate-copii.html", "topic": "Securitatea datelor la locul de munca: parola si blocarea statiei, conturi separate, actualizari, antivirus, copie de siguranta. De ce o memorie USB pierduta cu date de pacienti este un incident, nu un ghinion.", "prev": "lectia2-organizarea-informatiilor.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c1-sistem-de-operare/lectia3-securitate-copii.html"}]}, {"cls": "an1-medicina", "module": "c2-word-excel", "title": "C2. Documente si Reprezentari Grafice", "icon": "📊", "desc": "Competenta 2: compara reprezentari in procesorul de texte si in foaia de calcul", "indexPath": "content/profesional/sanitar/an1-medicina/c2-word-excel/index.html", "gradeName": "Postliceal, Anul I", "audienceShort": "Postliceal Sanitar, Anul I", "lessons": [{"file": "lectia1-procesor-texte.html", "topic": "Procesorul de texte pentru documente medicale: referat, scrisoare medicala, proces-verbal, formular de consimtamant informat. Formatare, antet si subsol, tabel simplu, export in PDF pentru trimitere.", "prev": "index.html", "next": "lectia2-calcul-tabelar-structura.html", "idx": 1, "of": 5, "path": "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia1-procesor-texte.html"}, {"file": "lectia2-calcul-tabelar-structura.html", "topic": "Foaia de calcul: structura, tipuri de date, introducerea corecta a valorilor si a datelor calendaristice. Prima evidenta - parametrii vitali ai unui pacient pe o saptamana.", "prev": "lectia1-procesor-texte.html", "next": "lectia3-prelucrarea-informatiilor.html", "idx": 2, "of": 5, "path": "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia2-calcul-tabelar-structura.html"}, {"file": "lectia3-prelucrarea-informatiilor.html", "topic": "Prelucrarea informatiilor: formule si functii (SUM, AVERAGE, MIN, MAX, COUNT, COUNTIF, IF), referinte absolute. Calculul indicelui de masa corporala si al mediilor pe sectie, cu semnalarea valorilor in afara intervalului normal.", "prev": "lectia2-calcul-tabelar-structura.html", "next": "lectia4-reprezentari-grafice.html", "idx": 3, "of": 5, "path": "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia3-prelucrarea-informatiilor.html"}, {"file": "lectia4-reprezentari-grafice.html", "topic": "Reprezentari grafice: evolutia temperaturii sau a tensiunii, structura consumului de materiale. Alegerea tipului de diagrama si citirea corecta. Cum poate un grafic sa induca in eroare - axa taiata, scara nepotrivita.", "prev": "lectia3-prelucrarea-informatiilor.html", "next": "lectia5-word-vs-excel.html", "idx": 4, "of": 5, "path": "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia4-reprezentari-grafice.html"}, {"file": "lectia5-word-vs-excel.html", "topic": "Cand folosesti tabelul din procesorul de texte si cand foaia de calcul: comparatie pe aceleasi date, avantaje si limite, si cum treci datele dintr-o aplicatie in alta fara sa le strici.", "prev": "lectia4-reprezentari-grafice.html", "next": "index.html", "idx": 5, "of": 5, "path": "content/profesional/sanitar/an1-medicina/c2-word-excel/lectia5-word-vs-excel.html"}]}, {"cls": "an1-medicina", "module": "c3-baze-de-date", "title": "C3. Administrarea unei Baze de Date", "icon": "🗄", "desc": "Competenta 3: tipuri si structura, operatii si incarcare, exploatare", "indexPath": "content/profesional/sanitar/an1-medicina/c3-baze-de-date/index.html", "gradeName": "Postliceal, Anul I", "audienceShort": "Postliceal Sanitar, Anul I", "lessons": [{"file": "lectia1-tipuri-structura.html", "topic": "Baza de date fata de foaia de calcul: cand devine necesara. Tabel, inregistrare, camp, cheie primara, tipuri de date. Structura unei evidente de pacienti sau de materiale sanitare.", "prev": "index.html", "next": "lectia2-operatii-incarcare.html", "idx": 1, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c3-baze-de-date/lectia1-tipuri-structura.html"}, {"file": "lectia2-operatii-incarcare.html", "topic": "Operatii pe tabel si incarcarea bazei: formular de introducere, validari, import dintr-o foaie de calcul, corectarea duplicatelor. Doua tabele legate - Pacienti si Consultatii.", "prev": "lectia1-tipuri-structura.html", "next": "lectia3-exploatare.html", "idx": 2, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c3-baze-de-date/lectia2-operatii-incarcare.html"}, {"file": "lectia3-exploatare.html", "topic": "Exploatarea bazei: interogari cu criterii (pacientii dintr-un interval de varsta, materialele cu termen apropiat), sortare si filtrare, raport tiparibil pentru seful de sectie.", "prev": "lectia2-operatii-incarcare.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c3-baze-de-date/lectia3-exploatare.html"}]}, {"cls": "an1-medicina", "module": "c4-internet-si-date", "title": "C4. Comunicarea pe Internet si Protectia Datelor", "icon": "🔐", "desc": "Competenta 4: cautare, transmitere, confidentialitate", "indexPath": "content/profesional/sanitar/an1-medicina/c4-internet-si-date/index.html", "gradeName": "Postliceal, Anul I", "audienceShort": "Postliceal Sanitar, Anul I", "lessons": [{"file": "lectia1-cautare-surse-medicale.html", "topic": "Cautarea informatiei medicale: surse de incredere (institutiile publice de sanatate, agentia medicamentului, ghiduri de practica, baze de date stiintifice) fata de continut comercial si retele sociale. Cum verifici in doi pasi o afirmatie despre un medicament.", "prev": "index.html", "next": "lectia2-transmitere-comunicare.html", "idx": 1, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c4-internet-si-date/lectia1-cautare-surse-medicale.html"}, {"file": "lectia2-transmitere-comunicare.html", "topic": "Transmiterea informatiei: email profesional in mediul medical, atasamente si comprimare, mesagerie de serviciu, consultatie la distanta - reguli de conduita si de forma.", "prev": "lectia1-cautare-surse-medicale.html", "next": "lectia3-protectia-datelor.html", "idx": 2, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c4-internet-si-date/lectia2-transmitere-comunicare.html"}, {"file": "lectia3-protectia-datelor.html", "topic": "Protectia datelor pacientilor: datele de sanatate ca date sensibile in regulamentul general privind protectia datelor, secretul profesional, ce se poate si ce nu se poate trimite pe aplicatii de mesagerie, anonimizarea unui caz pentru prezentare si ce faci daca s-a produs o scurgere de date.", "prev": "lectia2-transmitere-comunicare.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c4-internet-si-date/lectia3-protectia-datelor.html"}]}, {"cls": "an1-medicina", "module": "c5-prezentare", "title": "C5. Structurarea si Prezentarea Informatiei", "icon": "🖥", "desc": "Competenta 5: informatii din surse variate, prezentare, produs final", "indexPath": "content/profesional/sanitar/an1-medicina/c5-prezentare/index.html", "gradeName": "Postliceal, Anul I", "audienceShort": "Postliceal Sanitar, Anul I", "lessons": [{"file": "lectia1-structurarea-informatiei.html", "topic": "Structurarea informatiei din surse variate: plan de lucru, selectie, sinteza, citarea sursei. De la zece pagini citite la zece randuri utile, fara sa pierzi sensul.", "prev": "index.html", "next": "lectia2-prezentare-eficienta.html", "idx": 1, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c5-prezentare/lectia1-structurarea-informatiei.html"}, {"file": "lectia2-prezentare-eficienta.html", "topic": "Realizarea prezentarii: structura (problema, date, concluzie), reguli de lizibilitate, un singur mesaj pe diapozitiv, grafice care sustin afirmatia, notele prezentatorului. Prezentarea de caz in 5 minute.", "prev": "lectia1-structurarea-informatiei.html", "next": "lectia3-produs-final.html", "idx": 2, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c5-prezentare/lectia2-prezentare-eficienta.html"}, {"file": "lectia3-produs-final.html", "topic": "Produs final evaluat: dosar digital complet pe o tema medicala - document, evidenta in foaie de calcul cu grafic, mica baza de date, surse verificate si prezentare - cu grila de evaluare pe cele cinci competente.", "prev": "lectia2-prezentare-eficienta.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/profesional/sanitar/an1-medicina/c5-prezentare/lectia3-produs-final.html"}]}]}

const LABEL = A.label
const AUDIENCE = A.audience
const FLAVOR = A.flavor
const MODULES = A.modules
if (!MODULES.length) { return { error: 'lot gol - nimic de facut', lot: LABEL } }

const REPO = 'C:/00/Projects/LearningHub'
const LESSON_TEMPLATE = `${REPO}/content/liceu/tehnologic/cls9/m1-sisteme-retele/lectia1-sisteme-calcul.html`
const MODULE_INDEX_TEMPLATE = `${REPO}/content/liceu/tehnologic/cls9/m1-sisteme-retele/index.html`
const GATE = `cd ${REPO}/_campaign/night_2026_09_02 && python status.py --pending`

const ALL = []
for (const M of MODULES) for (const L of M.lessons) ALL.push({ M, L })

const BUILD_SCHEMA = { type:'object', required:['file','done'], properties:{
  file:{type:'string'}, done:{type:'boolean'},
  gateOutput:{type:'string', description:'ce a raspuns poarta status.py pentru acest fisier'},
  factsGrounded:{type:'array', items:{type:'string'}},
  honestNotes:{type:'array', items:{type:'string'}} } }
const VERIFY_SCHEMA = { type:'object', required:['file','ok','issues'], properties:{
  file:{type:'string'}, ok:{type:'boolean'}, issues:{type:'array', items:{type:'object',
    required:['axis','severity','detail'], properties:{
      axis:{type:'string', enum:['conformitate-programa','corectitudine-factuala','autonomia-lectiei','cod-html-valid','progresivitate','format-quiz','limbaj-public-tinta']},
      severity:{type:'string', enum:['high','medium','low']}, detail:{type:'string'} }}} } }
const FIX_SCHEMA = { type:'object', required:['file','fixed','remaining'], properties:{
  file:{type:'string'}, fixed:{type:'boolean'}, remaining:{type:'array', items:{type:'string'}} } }

function lessonId(M, L) { return `${M.cls}-${M.module}-${L.file.replace('.html','')}` }

const FORMAT_RULES = (M, L) => `
FISIER DE SCRIS: ${REPO}/${L.path}
SABLON DE FORMAT (citeste-l INTAI si reprodu structura EXACT, inclusiv blocul de scripturi de la final): ${LESSON_TEMPLATE}

FORMAT OBLIGATORIU (Format C "Guided Atomic"), in aceasta ordine:
  <head>: <meta charset>, <meta viewport>, <title>, fontul Inter, apoi
          <link rel="stylesheet" href="../../../../../assets/css/lesson-atomic.css">
          ZERO blocuri <style> inline. ZERO atribute style= pe elemente.
  <body>: skip-link -> div.container -> nav.nav-bar (2 x a.nav-btn)
          -> header.lesson-header (span.lesson-badge "Invatare Atomica" + h1.lesson-title + p.lesson-subtitle)
          -> div.progress-container (bara de progres, identic cu sablonul)
          -> section.lesson-frame  (DE CE contezi: la ce foloseste lectia + lista de rezultate asteptate)
          -> section.try-section   (un carlig REAL din meseria publicului tinta, o intrebare la care elevul incearca sa raspunda inainte sa stie)
          -> main#atomic-content cu 5-7 x div.atom
          -> section.practice-section#practice cu EXACT 3 x div.practice-exercise (data-level="minim" / "standard" / "performanta")
          -> section.review-section (summary-box + #lesson-summary + next-lesson)
  Blocul de scripturi de la final: IDENTIC cu sablonul (aceleasi 6 fisiere .js, aceeasi adancime ../../../../../assets/js/...), apoi:
      AtomicLearning.init('${lessonId(M,L)}');
      PracticeSimple.init('${lessonId(M,L)}');
      LessonSummary.init('${lessonId(M,L)}');
      Breadcrumb.init({ grade: '${M.cls}', gradeName: '${M.gradeName}', module: '${M.module}', moduleName: '${M.title}', lesson: '<titlul lectiei>' });
      LearningProgress.init('${M.cls}', '${M.module}', '${L.file}');
  si la final <script src="/assets/js/site-credit.js" defer></script>

ATOMII: fiecare div.atom are id="atom-N" si un atribut data-quiz='[{...}]' cu JSON VALID (ghilimele simple in HTML, ghilimele duble in JSON),
  un singur obiect in tablou: {"question": "...", "options": ["...","...","...","..."], "correct": "a|b|c|d", "hint": "..."}.
  Raspunsul corect NU trebuie sa fie mereu pe aceeasi pozitie. Hint-ul explica DE CE, nu repeta raspunsul.
  ULTIMUL atom poate fi recapitulativ, fara data-quiz. Minimum 4 atomi cu quiz valid.
  Inauntru: div.atom-header (span.atom-number + h3.atom-title) apoi continutul.

NAVIGARE: butonul inapoi -> href="${L.prev}" ; butonul inainte -> href="${L.next}".

TITLU PAGINA: "<titlul lectiei> | ${M.audienceShort}"

DIACRITICE: scrie FARA diacritice (a, i, s, t simple), exact ca in sablon - restul sitului asa e.
`

const CONTENT_RULES = (M, L) => `
PUBLIC TINTA: ${AUDIENCE}. Scrie pentru ei, nu pentru un manual generic. ${FLAVOR}
MODUL: ${M.title} — ${M.desc}. Lectia ${L.idx} din ${L.of}.
TEMA EXACTA A LECTIEI (acopera TOT ce scrie aici, nu doar prima propozitie):
${L.topic}

LECTIA TREBUIE SA FIE DE SINE STATATOARE. Asta inseamna, concret:
  - cine o deschide fara sa fi vazut lectiile anterioare o poate parcurge singur si termina cu ceva ce stie sa faca;
  - orice termen nou e explicat la prima folosire, in cuvinte simple, o singura data;
  - orice pas dintr-o aplicatie (Excel, Access, PowerPoint, editor HTML) e scris ca succesiune concreta de actiuni pe care le poate urma cineva care sta in fata calculatorului: ce meniu, ce buton, ce se intampla dupa;
  - toate formulele, functiile si fragmentele de cod sunt SCRISE COMPLET si CORECT (nu "..." si nu pseudo-cod), cu sintaxa reala a aplicatiei;
  - contine cel putin un exemplu numeric complet, dus pana la rezultat, pe care cititorul il poate reface;
  - contine cel putin o greseala tipica si cum se recunoaste/repara.

RIGOARE FACTUALA (asta se verifica adversarial dupa tine):
  - fiecare afirmatie despre o aplicatie (nume de meniu, comportament al unei functii, format de fisier) trebuie sa fie ADEVARATA;
  - daca nu esti sigur de o denumire exacta de meniu, descrie actiunea in loc sa inventezi denumirea;
  - nu inventa cifre, standarde, articole de lege sau denumiri de institutii; daca ai nevoie de o cifra, foloseste una din exemplul tau propriu si spune ca e exemplu;
  - fara analogii periculoase (nu indemna la deschiderea carcasei, la interventii electrice, la administrarea de tratamente).

EXERCITIILE DE PRACTICA: 3 bucati, crescator (minim / standard / performanta), fiecare cu enunt concret,
  cu datele de plecare incluse in enunt, si cu raspunsul/rezolvarea in containerul de raspuns, asa cum e in sablon.

ANTI-COLIZIUNE: NU modifica niciun fisier .css sau .js din assets/. Foloseste DOAR clase care exista in lesson-atomic.css.
Scrie fisierul cu Write. La final ruleaza:
    ${GATE}
si spune in gateOutput daca fisierul tau MAI APARE in lista (daca apare, repara si ruleaza din nou pana nu mai apare).
`

// ── Faza 1: paginile de index ale modulelor ─────────────────────────────
phase('Scaffold')
const scaffoldJobs = MODULES.map(M => () => agent(
`Creeaza pagina de index a modulului "${M.title}" (${M.audienceShort}).
FISIER: ${REPO}/${M.indexPath}
SABLON (citeste-l si oglindeste structura, scripturile si adancimea cailor ../../../../../assets): ${MODULE_INDEX_TEMPLATE}
Adapteaza: titlu "${M.icon} ${M.title}", descriere "${M.desc}", clasa/anul "${M.gradeName}", public "${AUDIENCE}".
Listeaza EXACT aceste lectii, in ordine, ca .lesson-card cu href-ul exact:
${M.lessons.map((l,n)=>`  ${n+1}. href="${l.file}" — ${l.topic.split(/[.;(]/)[0].trim()}`).join('\n')}
Butonul inapoi -> href="../index.html".
Scrie FARA diacritice. NU modifica fisiere din assets/. Write. Raporteaza done.`,
  { label:`scaffold:${M.cls}/${M.module}`, phase:'Scaffold', model:'sonnet',
    schema:{type:'object',required:['done'],properties:{done:{type:'boolean'},summary:{type:'string'}}} }))
const scaffolded = await parallel(scaffoldJobs)
log(`[${LABEL}] Index de modul: ${scaffolded.filter(Boolean).filter(s=>s&&s.done).length}/${scaffoldJobs.length}`)

// ── Faza 2+3+4: build -> verify -> fix, in conducta pe lectie ───────────
phase('Build')
const results = await pipeline(
  ALL,
  ({M, L}) => agent(
`Esti profesor de informatica/T.I.C. si scrii o lectie completa, de sine statatoare, pentru situl LearningHub.
${FORMAT_RULES(M, L)}
${CONTENT_RULES(M, L)}`,
    { label:`build:${M.cls}/${M.module}/${L.file}`, phase:'Build', model:'sonnet', schema:BUILD_SCHEMA }),

  (built, { M, L }) => agent(
`Verifica ADVERSARIAL lectia ${REPO}/${L.path}. Cauta ce e GRESIT, nu ce e bine. Citeste fisierul intreg.
Tema pe care trebuia sa o acopere: ${L.topic}
Public tinta: ${AUDIENCE}.
Axe de control:
 - conformitate-programa: acopera TOT ce scrie in tema? Lipseste vreo bucata?
 - corectitudine-factuala: fiecare afirmatie despre aplicatii, functii, formule si formate e adevarata? Formulele sunt sintactic corecte si dau rezultatul afirmat? Verifica exemplele numerice prin calcul.
 - autonomia-lectiei: cineva care nu a citit lectiile anterioare o poate parcurge singur? Exista termeni folositi si neexplicati? Exista pasi "sariti"?
 - cod-html-valid: exista <style> inline sau atribute style=? Sunt toate etichetele inchise? Blocul de scripturi de la final e complet si cu caile corecte?
 - format-quiz: fiecare data-quiz e JSON valid? Raspunsul marcat corect este chiar cel corect? Raspunsurile corecte sunt variate ca pozitie?
 - progresivitate: cele 3 exercitii chiar cresc in dificultate si au raspuns?
 - limbaj-public-tinta: e scris pentru ${AUDIENCE} sau e text de manual generic?
Ruleaza si poarta mecanica: ${GATE}
Raporteaza ok=true DOAR daca nu ai gasit nimic de severitate high sau medium. NU modifica fisierul in aceasta faza.`,
    { label:`verify:${L.file}`, phase:'Verify', model:'opus', schema:VERIFY_SCHEMA })
    .then(v => (v && v.ok) ? { M, L, v, fixed:null } : agent(
`Repara lectia ${REPO}/${L.path}. Probleme raportate de verificator:
${(v && v.issues || []).map(i=>`- [${i.severity}][${i.axis}] ${i.detail}`).join('\n')}
Repara-le pe toate cele de severitate high si medium, pastrand structura Format C si fara sa introduci <style> inline.
La final ruleaza ${GATE} si asigura-te ca ${L.path} NU mai apare in lista. Edit/Write.`,
      { label:`fix:${L.file}`, phase:'Fix', model:'sonnet', schema:FIX_SCHEMA })
      .then(f => ({ M, L, v, fixed:f })))
)

const flat = results.filter(Boolean)
const stillBad = flat.filter(r => r.v && !r.v.ok && (!r.fixed || !r.fixed.fixed))
log(`[${LABEL}] Lectii procesate: ${flat.length}/${ALL.length} | ramase problematice: ${stillBad.length}`)

return {
  lot: LABEL,
  planificate: ALL.length,
  procesate: flat.length,
  reparate: flat.filter(r => r.fixed && r.fixed.fixed).length,
  inca_rosii: stillBad.map(r => ({ file: r.L.path, issues: (r.v.issues||[]).map(i=>`${i.severity}:${i.axis}: ${i.detail}`) })),
}
