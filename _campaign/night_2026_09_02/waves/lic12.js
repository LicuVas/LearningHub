export const meta = {
  name: 'lh-night-lic12',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul lic12 (12 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Liceu clasa a XII-a (T.I.C., competentele individuale 3 si 4)", "audience": "elevi de clasa a XII-a la liceu tehnologic (prelucrarea lemnului, protectia mediului, silvicultura), care dau la bacalaureat proba de evaluare a competentelor digitale", "flavor": "Exemplele sunt site-uri si proiecte reale mici, pe specificul calificarii. Unde subiectul se atinge de proba de competente digitale de la bacalaureat, spune explicit ce se cere acolo.", "modules": [{"cls": "cls12", "module": "m2-web-creare-site", "title": "Crearea Documentelor Web", "icon": "🌐", "desc": "Competenta 3: instrumente, structura sitului, elemente de continut, criterii de calitate, publicare", "indexPath": "content/liceu/tehnologic/cls12/m2-web-creare-site/index.html", "gradeName": "Clasa a XII-a", "audienceShort": "T.I.C. Clasa a XII-a", "lessons": [{"file": "lectia1-instrumente-web.html", "topic": "Instrumente de creare a paginilor web: editor de text simplu, editoare HTML dedicate, salvarea ca pagina web din procesorul de text si din foaia de calcul, editoare de imagini. Ce genereaza fiecare si de ce codul scris de mana e mai curat.", "prev": "index.html", "next": "lectia2-structura-paginii.html", "idx": 1, "of": 5, "path": "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia1-instrumente-web.html"}, {"file": "lectia2-structura-paginii.html", "topic": "Structura unei pagini HTML: declaratia de tip, elementul radacina, zona de antet (titlu, codificare) si corpul paginii; titluri pe niveluri, paragrafe, atribute. Site static fata de site dinamic - ce inseamna concret. Cod HTML real, complet si valid.", "prev": "lectia1-instrumente-web.html", "next": "lectia3-elemente-continut.html", "idx": 2, "of": 5, "path": "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia2-structura-paginii.html"}, {"file": "lectia3-elemente-continut.html", "topic": "Elemente de continut: liste, tabele, imagini cu text alternativ, harti de imagini, sunet si video, butoane si campuri de formular, cadre si de ce nu se mai folosesc. Fiecare cu marcajul HTML corect.", "prev": "lectia2-structura-paginii.html", "next": "lectia4-navigare-linkuri.html", "idx": 3, "of": 5, "path": "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia3-elemente-continut.html"}, {"file": "lectia4-navigare-linkuri.html", "topic": "Ierarhia paginilor si sistemul de legaturi: pagina de start, cai relative fata de cai absolute, meniu de navigare, legaturi interne cu ancore. Harta unui site de 5 pagini si scheletul de fisiere si foldere.", "prev": "lectia3-elemente-continut.html", "next": "lectia5-criterii-publicare.html", "idx": 4, "of": 5, "path": "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia4-navigare-linkuri.html"}, {"file": "lectia5-criterii-publicare.html", "topic": "Criterii de calitate: viteza de incarcare (greutatea imaginilor), raportul text-imagine, lizibilitate (contrast, marime de font), design consecvent, conformitatea cu proiectul. Publicarea sitului si cum ajunge in motoarele de cautare - titlu, descriere, structura titlurilor.", "prev": "lectia4-navigare-linkuri.html", "next": "index.html", "idx": 5, "of": 5, "path": "content/liceu/tehnologic/cls12/m2-web-creare-site/lectia5-criterii-publicare.html"}]}, {"cls": "cls12", "module": "m3-management-proiect", "title": "Managementul Informatizat al Proiectelor", "icon": "📋", "desc": "Competenta 4: notiunea de proiect, echipa, plan, structura pe activitati, traiectorie critica, etape", "indexPath": "content/liceu/tehnologic/cls12/m3-management-proiect/index.html", "gradeName": "Clasa a XII-a", "audienceShort": "T.I.C. Clasa a XII-a", "lessons": [{"file": "lectia1-notiunea-de-proiect.html", "topic": "Ce este un proiect (temporar, unic, cu obiectiv si resurse limitate) si ce nu este. Obiective clare si masurabile. Fazele: initiere, planificare, executie cu monitorizare, evaluare si inchidere.", "prev": "index.html", "next": "lectia2-manager-echipa.html", "idx": 1, "of": 5, "path": "content/liceu/tehnologic/cls12/m3-management-proiect/lectia1-notiunea-de-proiect.html"}, {"file": "lectia2-manager-echipa.html", "topic": "Managerul de proiect si echipa: roluri si responsabilitati, sponsor, beneficiar, parti interesate. Matricea de responsabilitati - cine executa, cine raspunde, cine e consultat, cine e informat.", "prev": "lectia1-notiunea-de-proiect.html", "next": "lectia3-plan-wbs.html", "idx": 2, "of": 5, "path": "content/liceu/tehnologic/cls12/m3-management-proiect/lectia2-manager-echipa.html"}, {"file": "lectia3-plan-wbs.html", "topic": "Planul proiectului si structura pe activitati: descompunerea in pachete de lucru, estimarea duratei si a efortului, dependintele dintre activitati.", "prev": "lectia2-manager-echipa.html", "next": "lectia4-grafic-traiectorie-critica.html", "idx": 3, "of": 5, "path": "content/liceu/tehnologic/cls12/m3-management-proiect/lectia3-plan-wbs.html"}, {"file": "lectia4-grafic-traiectorie-critica.html", "topic": "Graficul de activitati de tip Gantt si traiectoria critica: calculul drumului critic pe un exemplu numeric mic, ce inseamna rezerva de timp si de ce intarzierea unei activitati critice intarzie tot proiectul.", "prev": "lectia3-plan-wbs.html", "next": "lectia5-monitorizare-evaluare.html", "idx": 4, "of": 5, "path": "content/liceu/tehnologic/cls12/m3-management-proiect/lectia4-grafic-traiectorie-critica.html"}, {"file": "lectia5-monitorizare-evaluare.html", "topic": "Initierea (justificare economica, oportunitate) si planificarea (organigrama, alocarea resurselor, cost, dependinte). Monitorizarea: cereri de schimbare, controlul riscului, rapoarte de progres si rapoarte de exceptii. Evaluarea: calitate si raport de final.", "prev": "lectia4-grafic-traiectorie-critica.html", "next": "index.html", "idx": 5, "of": 5, "path": "content/liceu/tehnologic/cls12/m3-management-proiect/lectia5-monitorizare-evaluare.html"}]}, {"cls": "cls12", "module": "m4-instrumente-proiect", "title": "Instrumente Software si Proiect Integrator", "icon": "🛠", "desc": "Competenta 4: componentele proiectului, instrumente software, produs final", "indexPath": "content/liceu/tehnologic/cls12/m4-instrumente-proiect/index.html", "gradeName": "Clasa a XII-a", "audienceShort": "T.I.C. Clasa a XII-a", "lessons": [{"file": "lectia1-instrumente-software.html", "topic": "Instrumente software pentru proiecte: aplicatii de tip Gantt (inclusiv variante gratuite si foaia de calcul folosita ca instrument), tablouri de tip Kanban, sabloane de documente de proiect, diagrame si schite. Ce alegi pentru un proiect mic.", "prev": "index.html", "next": "lectia2-proiect-integrator.html", "idx": 1, "of": 2, "path": "content/liceu/tehnologic/cls12/m4-instrumente-proiect/lectia1-instrumente-software.html"}, {"file": "lectia2-proiect-integrator.html", "topic": "Proiect integrator evaluat: realizezi un mini-site pentru o initiativa reala si il conduci ca proiect - obiectiv, structura pe activitati, grafic, roluri, raport final. Grila de evaluare explicita, cu punctaje.", "prev": "lectia1-instrumente-software.html", "next": "index.html", "idx": 2, "of": 2, "path": "content/liceu/tehnologic/cls12/m4-instrumente-proiect/lectia2-proiect-integrator.html"}]}]}

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
