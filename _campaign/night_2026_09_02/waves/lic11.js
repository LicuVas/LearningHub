export const meta = {
  name: 'lh-night-lic11',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul lic11 (19 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Liceu clasa a XI-a (T.I.C., competentele individuale 1 si 2)", "audience": "elevi de clasa a XI-a la liceu tehnologic (protectia mediului, mecanica, silvicultura), o singura ora de T.I.C. pe saptamana", "flavor": "Exemplele se iau din specificul calificarii: masuratori de mediu, evidente silvice, fise de lucru din atelier, documente de firma. Accentul cade pe informatia utila la locul de munca si pe prelucrarea ei in foaia de calcul.", "modules": [{"cls": "cls11", "module": "m3-date-si-informatii", "title": "Date, Informatii si Fluxul Informational", "icon": "🧭", "desc": "Competenta 1: date vs informatii, proces si flux informational, sistem informatic vs informational", "indexPath": "content/liceu/tehnologic/cls11/m3-date-si-informatii/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-date-informatii.html", "topic": "Data, informatia, cunostinta. Cum devine o data informatie (context, prelucrare, destinatar). Procesul informational, cu exemple din firma si din scoala.", "prev": "index.html", "next": "lectia2-flux-informational.html", "idx": 1, "of": 3, "path": "content/liceu/tehnologic/cls11/m3-date-si-informatii/lectia1-date-informatii.html"}, {"file": "lectia2-flux-informational.html", "topic": "Fluxul informational: emitator, canal, receptor, suport. Circuitul unui document intr-o firma (comanda - aviz - factura). Blocaje, redundante si pierderi de informatie in flux.", "prev": "lectia1-date-informatii.html", "next": "lectia3-sistem-informatic.html", "idx": 2, "of": 3, "path": "content/liceu/tehnologic/cls11/m3-date-si-informatii/lectia2-flux-informational.html"}, {"file": "lectia3-sistem-informatic.html", "topic": "Sistem informational fata de sistem informatic: ce contine fiecare si unde se suprapun. Componentele unui sistem informatic (hardware, software, date, proceduri, oameni). Studiu de caz pe calificarea clasei.", "prev": "lectia2-flux-informational.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/liceu/tehnologic/cls11/m3-date-si-informatii/lectia3-sistem-informatic.html"}]}, {"cls": "cls11", "module": "m4-surse-si-cautare", "title": "Surse de Informatie si Cautarea pe Internet", "icon": "🔎", "desc": "Competenta 1: banci de date, baze de date, Internet, Intranet, tehnici si criterii de cautare", "indexPath": "content/liceu/tehnologic/cls11/m4-surse-si-cautare/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-surse-informatie.html", "topic": "Tipuri de surse: banci de date, baze de date, Internet, Intranet, biblioteci digitale, publicatii oficiale. Criterii de alegere si de eficienta - cost, acuratete, actualitate, acoperire.", "prev": "index.html", "next": "lectia2-tehnici-cautare.html", "idx": 1, "of": 3, "path": "content/liceu/tehnologic/cls11/m4-surse-si-cautare/lectia1-surse-informatie.html"}, {"file": "lectia2-tehnici-cautare.html", "topic": "Tehnici de cautare si regasire: cuvinte-cheie, expresie exacta intre ghilimele, operatori de includere si excludere, cautare limitata la un site sau la un tip de fisier, filtre de limba si de localizare. Exercitii de rafinare a interogarii.", "prev": "lectia1-surse-informatie.html", "next": "lectia3-evaluarea-surselor.html", "idx": 2, "of": 3, "path": "content/liceu/tehnologic/cls11/m4-surse-si-cautare/lectia2-tehnici-cautare.html"}, {"file": "lectia3-evaluarea-surselor.html", "topic": "Evaluarea credibilitatii unei surse: autor, institutie, data, referinte, domeniu. Sursa primara fata de preluare, verificarea incrucisata. Ce faci cu raspunsul unui instrument de inteligenta artificiala - punct de plecare, nu sursa.", "prev": "lectia2-tehnici-cautare.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/liceu/tehnologic/cls11/m4-surse-si-cautare/lectia3-evaluarea-surselor.html"}]}, {"cls": "cls11", "module": "m5-organizarea-datelor", "title": "Organizarea Datelor - Tipuri si Structuri", "icon": "🗂", "desc": "Competenta 2: tipuri de date si structuri de organizare", "indexPath": "content/liceu/tehnologic/cls11/m5-organizarea-datelor/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-tipuri-de-date.html", "topic": "Tipuri de date: numerice (intreg, real), text, logice, data si ora, imagine. Cum recunoaste programul tipul si de ce un cod numeric scris cu zerouri in fata nu e un numar. Conversii si capcane in foaia de calcul.", "prev": "index.html", "next": "lectia2-structuri-de-date.html", "idx": 1, "of": 3, "path": "content/liceu/tehnologic/cls11/m5-organizarea-datelor/lectia1-tipuri-de-date.html"}, {"file": "lectia2-structuri-de-date.html", "topic": "Structuri de organizare: variabila, fisier text si fisier binar, foaie de lucru, tabel, baza de date, lista. Ce structura alegi pentru ce fel de problema.", "prev": "lectia1-tipuri-de-date.html", "next": "lectia3-aplicatie-organizare.html", "idx": 2, "of": 3, "path": "content/liceu/tehnologic/cls11/m5-organizarea-datelor/lectia2-structuri-de-date.html"}, {"file": "lectia3-aplicatie-organizare.html", "topic": "Aplicatie: acelasi set de date real de la calificarea clasei, organizat in trei feluri - lista simpla, tabel structurat, baza de date - si ce castigi sau pierzi la fiecare varianta.", "prev": "lectia2-structuri-de-date.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/liceu/tehnologic/cls11/m5-organizarea-datelor/lectia3-aplicatie-organizare.html"}]}, {"cls": "cls11", "module": "m6-prelucrarea-datelor", "title": "Prelucrarea Datelor - Operatori", "icon": "➕", "desc": "Competenta 2: operatori aritmetici, relationali si logici", "indexPath": "content/liceu/tehnologic/cls11/m6-prelucrarea-datelor/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-operatori-aritmetici.html", "topic": "Operatori aritmetici, ordinea operatiilor si rolul parantezelor. Rotunjirea si erorile de rotunjire in foaia de calcul, cu un exemplu unde totalul nu da.", "prev": "index.html", "next": "lectia2-operatori-relationali-logici.html", "idx": 1, "of": 3, "path": "content/liceu/tehnologic/cls11/m6-prelucrarea-datelor/lectia1-operatori-aritmetici.html"}, {"file": "lectia2-operatori-relationali-logici.html", "topic": "Operatori relationali (egal, diferit, mai mic, mai mare) si logici (SI, SAU, NU), cu tabele de adevar. Cum se scriu conditiile in foaia de calcul.", "prev": "lectia1-operatori-aritmetici.html", "next": "lectia3-expresii-compuse.html", "idx": 2, "of": 3, "path": "content/liceu/tehnologic/cls11/m6-prelucrarea-datelor/lectia2-operatori-relationali-logici.html"}, {"file": "lectia3-expresii-compuse.html", "topic": "Expresii compuse: conditii cu mai multe criterii, functie conditionala imbricata fata de conditie cu SI/SAU, evaluarea pas cu pas a unei expresii. Exercitii de depanare a unei formule gresite.", "prev": "lectia2-operatori-relationali-logici.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/liceu/tehnologic/cls11/m6-prelucrarea-datelor/lectia3-expresii-compuse.html"}]}, {"cls": "cls11", "module": "m7-functii", "title": "Functii Predefinite si Functii Utilizator", "icon": "🧮", "desc": "Competenta 2: functii aritmetice, logice, de cautare, financiare, pe siruri, informative si functii definite de utilizator", "indexPath": "content/liceu/tehnologic/cls11/m7-functii/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-functii-aritmetice-statistice.html", "topic": "Functii aritmetice si statistice: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, COUNTIF, SUMIF, ROUND, ABS, MOD. Sintaxa exacta si o eroare tipica pentru fiecare.", "prev": "index.html", "next": "lectia2-functii-logice.html", "idx": 1, "of": 4, "path": "content/liceu/tehnologic/cls11/m7-functii/lectia1-functii-aritmetice-statistice.html"}, {"file": "lectia2-functii-logice.html", "topic": "Functii logice: IF, AND, OR, NOT, IFERROR, IFS. Construirea unei grile de decizie care incadreaza o valoare pe intervale.", "prev": "lectia1-functii-aritmetice-statistice.html", "next": "lectia3-functii-cautare-referinta.html", "idx": 2, "of": 4, "path": "content/liceu/tehnologic/cls11/m7-functii/lectia2-functii-logice.html"}, {"file": "lectia3-functii-cautare-referinta.html", "topic": "Functii de cautare si referinta: VLOOKUP cu potrivire exacta si aproximativa, HLOOKUP, INDEX si MATCH. De ce INDEX cu MATCH rezista cand cineva insereaza o coloana, iar VLOOKUP nu.", "prev": "lectia2-functii-logice.html", "next": "lectia4-siruri-financiare-utilizator.html", "idx": 3, "of": 4, "path": "content/liceu/tehnologic/cls11/m7-functii/lectia3-functii-cautare-referinta.html"}, {"file": "lectia4-siruri-financiare-utilizator.html", "topic": "Functii pe siruri de caractere (LEFT, RIGHT, MID, LEN, TRIM, CONCAT, TEXT), functii informative (ISBLANK, ISNUMBER, ISERROR), notiuni de functii financiare (PMT, FV) si definirea unei functii utilizator simple, cu apelarea ei din foaie.", "prev": "lectia3-functii-cautare-referinta.html", "next": "index.html", "idx": 4, "of": 4, "path": "content/liceu/tehnologic/cls11/m7-functii/lectia4-siruri-financiare-utilizator.html"}]}, {"cls": "cls11", "module": "m8-instrumente-si-studii-de-caz", "title": "Instrumente de Lucru si Studii de Caz", "icon": "🧰", "desc": "Competenta 2: schite, grafice, sabloane, rapoarte simple si complexe, documente reale", "indexPath": "content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/index.html", "gradeName": "Clasa a XI-a", "audienceShort": "T.I.C. Clasa a XI-a", "lessons": [{"file": "lectia1-schite-grafice-sabloane.html", "topic": "Instrumente de lucru: schite si diagrame (organigrama, diagrama de flux), grafice care comunica un rezultat, sabloane de document si de foaie de calcul. Cand refolosesti un sablon si cand il faci tu.", "prev": "index.html", "next": "lectia2-rapoarte.html", "idx": 1, "of": 3, "path": "content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/lectia1-schite-grafice-sabloane.html"}, {"file": "lectia2-rapoarte.html", "topic": "Rapoarte simple si complexe: structura (titlu, sinteza, date, concluzie), tabel pivot pentru sinteza, subtotaluri si grupare. Un raport care se intelege in 30 de secunde.", "prev": "lectia1-schite-grafice-sabloane.html", "next": "lectia3-documente-reale.html", "idx": 2, "of": 3, "path": "content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/lectia2-rapoarte.html"}, {"file": "lectia3-documente-reale.html", "topic": "Documente reale de firma: cerere, oferta, caiet de sarcini, raport de activitate, scrisoare oficiala. Structura obligatorie a fiecaruia si greselile care le fac neserioase. Studiu de caz complet pe specificul calificarii clasei.", "prev": "lectia2-rapoarte.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/lectia3-documente-reale.html"}]}]}

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
