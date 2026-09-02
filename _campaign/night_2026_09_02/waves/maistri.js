export const meta = {
  name: 'lh-night-maistri',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul maistri (16 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Scoala de maistri, an I - Maistru electromecanic auto (Utilizarea tehnicii de calcul)", "audience": "adulti, elevi in anul I la scoala de maistri, calificarea maistru electromecanic auto; multi lucreaza deja in atelier si vor sa foloseasca imediat ce invata", "flavor": "Fiecare exemplu vine din atelierul auto: devize de reparatie, consumuri, evidenta pieselor si a furnizorilor, fise de constatare, cataloage si scheme electrice, coduri de eroare de diagnoza. Vorbeste cu ei ca oameni care au meseria in maini, dar nu au lucrat mult pe calculator. Fara limbaj scolaresc si fara infantilizare.", "modules": [{"cls": "an1", "module": "c1-aplicatii-software", "title": "C1. Aplicatii Software Uzuale", "icon": "🧾", "desc": "Competenta 1: structura tabelului, formatare, prelucrarea informatiilor, diagrame, inserare de obiecte", "indexPath": "content/profesional/maistri/an1/c1-aplicatii-software/index.html", "gradeName": "Maistri, anul I", "audienceShort": "Scoala de Maistri, Anul I", "lessons": [{"file": "lectia1-structura-tabelului.html", "topic": "Foaia de calcul: registru, foaie, celula, rand, coloana, domeniu. Tipuri de date si introducerea corecta a numerelor, a datelor calendaristice si a textului. Prima evidenta de atelier: consumul de piese pe luna.", "prev": "index.html", "next": "lectia2-formatare.html", "idx": 1, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia1-structura-tabelului.html"}, {"file": "lectia2-formatare.html", "topic": "Formatarea tabelului: format de numar (moneda, procent, zecimale), imbinarea celulelor, borduri, latimi, inghetarea capului de tabel, formatare conditionata pentru stocuri sub minim.", "prev": "lectia1-structura-tabelului.html", "next": "lectia3-prelucrarea-informatiilor.html", "idx": 2, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia2-formatare.html"}, {"file": "lectia3-prelucrarea-informatiilor.html", "topic": "Prelucrarea informatiilor: formule si functii (SUM, AVERAGE, MIN, MAX, COUNT, IF), referinte relative si absolute. Deviz de reparatie calculat automat - manopera, piese, TVA, total.", "prev": "lectia2-formatare.html", "next": "lectia4-diagrame.html", "idx": 3, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia3-prelucrarea-informatiilor.html"}, {"file": "lectia4-diagrame.html", "topic": "Diagrame: tipul potrivit pentru datele din atelier (evolutia consumului, structura costurilor), serii, etichete, titlu, legenda. Cum se citeste corect un grafic de defecte pe cauze.", "prev": "lectia3-prelucrarea-informatiilor.html", "next": "lectia5-inserare-obiecte.html", "idx": 4, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia4-diagrame.html"}, {"file": "lectia5-inserare-obiecte.html", "topic": "Inserarea de obiecte: imagini (schema electrica, poza piesei), forme si sageti de adnotare, legaturi catre fisiere, obiecte din alte aplicatii. Fisa de constatare cu poze.", "prev": "lectia4-diagrame.html", "next": "lectia6-evaluare-c1.html", "idx": 5, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia5-inserare-obiecte.html"}, {"file": "lectia6-evaluare-c1.html", "topic": "Aplicatie evaluata pentru competenta 1: registrul de atelier complet - evidenta interventiilor, deviz automat, diagrama de costuri, fisa cu poze - cu fisa de evaluare cu DA si NU din curriculum.", "prev": "lectia5-inserare-obiecte.html", "next": "index.html", "idx": 6, "of": 6, "path": "content/profesional/maistri/an1/c1-aplicatii-software/lectia6-evaluare-c1.html"}]}, {"cls": "an1", "module": "c2-baze-de-date", "title": "C2. Baze de Date cu Aplicatii Specifice", "icon": "🗄", "desc": "Competenta 2: tipuri de date, structura bazei, operatii pe tabel, incarcare, exploatare", "indexPath": "content/profesional/maistri/an1/c2-baze-de-date/index.html", "gradeName": "Maistri, anul I", "audienceShort": "Scoala de Maistri, Anul I", "lessons": [{"file": "lectia1-tipuri-de-date.html", "topic": "De ce o baza de date si nu inca o foaie de calcul. Tipurile de date dintr-o baza (text, numeric, data, logic, moneda) si alegerea corecta pentru fiecare camp al unei evidente de piese auto.", "prev": "index.html", "next": "lectia2-structura-bazei.html", "idx": 1, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia1-tipuri-de-date.html"}, {"file": "lectia2-structura-bazei.html", "topic": "Structura bazei: tabel, inregistrare, camp, cheie primara, index. Doua tabele legate - Autovehicule si Interventii - si relatia dintre ele.", "prev": "lectia1-tipuri-de-date.html", "next": "lectia3-operatii-pe-tabel.html", "idx": 2, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia2-structura-bazei.html"}, {"file": "lectia3-operatii-pe-tabel.html", "topic": "Operatii pe tabel: adaugare, modificare, stergere, sortare, filtrare. Formular de introducere a datelor si validari care impiedica erorile de tastare.", "prev": "lectia2-structura-bazei.html", "next": "lectia4-incarcarea-bazei.html", "idx": 3, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia3-operatii-pe-tabel.html"}, {"file": "lectia4-incarcarea-bazei.html", "topic": "Incarcarea bazei: introducerea manuala prin formular, importul dintr-o foaie de calcul existenta, curatarea duplicatelor si a formatelor gresite.", "prev": "lectia3-operatii-pe-tabel.html", "next": "lectia5-exploatarea-bazei.html", "idx": 4, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia4-incarcarea-bazei.html"}, {"file": "lectia5-exploatarea-bazei.html", "topic": "Exploatarea bazei: interogari cu criterii (piese sub stoc minim, interventiile unui autovehicul, costuri pe perioada), interogare peste doua tabele si raport tiparibil.", "prev": "lectia4-incarcarea-bazei.html", "next": "lectia6-evaluare-c2.html", "idx": 5, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia5-exploatarea-bazei.html"}, {"file": "lectia6-evaluare-c2.html", "topic": "Aplicatie evaluata pentru competenta 2: baza de date a atelierului, de la structura pana la raportul lunar de interventii, cu fisa de evaluare cu DA si NU.", "prev": "lectia5-exploatarea-bazei.html", "next": "index.html", "idx": 6, "of": 6, "path": "content/profesional/maistri/an1/c2-baze-de-date/lectia6-evaluare-c2.html"}]}, {"cls": "an1", "module": "c3-internet", "title": "C3. Comunicarea pe Internet", "icon": "🌐", "desc": "Competenta 3: cautarea, transmiterea si schimbul de informatii", "indexPath": "content/profesional/maistri/an1/c3-internet/index.html", "gradeName": "Maistri, anul I", "audienceShort": "Scoala de Maistri, Anul I", "lessons": [{"file": "lectia1-cautare-documentatie.html", "topic": "Cautarea documentatiei tehnice: cataloage de piese, scheme electrice, fise tehnice, coduri de eroare de diagnoza. Operatori de cautare si cum ajungi la sursa producatorului, nu la o copie de pe forum.", "prev": "index.html", "next": "lectia2-surse-de-incredere.html", "idx": 1, "of": 4, "path": "content/profesional/maistri/an1/c3-internet/lectia1-cautare-documentatie.html"}, {"file": "lectia2-surse-de-incredere.html", "topic": "Surse de incredere in domeniul auto: documentatia producatorului, reglementarile tehnice si cerintele de inspectie, bazele de date de piese. Cum recunosti o informatie tehnica gresita si ce costa la o reparatie.", "prev": "lectia1-cautare-documentatie.html", "next": "lectia3-transmitere-schimb.html", "idx": 2, "of": 4, "path": "content/profesional/maistri/an1/c3-internet/lectia2-surse-de-incredere.html"}, {"file": "lectia3-transmitere-schimb.html", "topic": "Transmiterea si schimbul de informatii: email profesional cu atasamente, comprimarea fisierelor mari, spatiu de stocare in cloud pentru documentatia atelierului, semnatura si formule de adresare.", "prev": "lectia2-surse-de-incredere.html", "next": "lectia4-evaluare-c3.html", "idx": 3, "of": 4, "path": "content/profesional/maistri/an1/c3-internet/lectia3-transmitere-schimb.html"}, {"file": "lectia4-evaluare-c3.html", "topic": "Aplicatie evaluata pentru competenta 3: gasesti documentatia pentru o defectiune data, o organizezi si o transmiti corect unui coleg si unui client; fisa de evaluare cu DA si NU.", "prev": "lectia3-transmitere-schimb.html", "next": "index.html", "idx": 4, "of": 4, "path": "content/profesional/maistri/an1/c3-internet/lectia4-evaluare-c3.html"}]}]}

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
