export const meta = {
  name: 'lh-night-sanitar2',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul sanitar2 (13 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Postliceal sanitar, anul II - farmacie", "audience": "adulti, elevi in anul II la scoala postliceala sanitara, calificarea asistent medical de farmacie", "flavor": "Exemplele sunt din farmacie: gestiune si stocuri, loturi si termene de valabilitate, adaos comercial si pret cu amanuntul, nomenclator de produse, comenzi catre depozit, retrageri de lot. Nu da sfaturi farmacologice si nu recomanda medicamente - lectia e despre calculator, contextul e farmaceutic.", "modules": [{"cls": "an2-farmacie", "module": "c1-sistem-de-operare", "title": "C1. Sistemul de Operare", "icon": "💻", "desc": "Competenta 1: interfata si organizarea informatiilor in farmacie", "indexPath": "content/profesional/sanitar/an2-farmacie/c1-sistem-de-operare/index.html", "gradeName": "Postliceal, Anul II", "audienceShort": "Postliceal Sanitar, Anul II", "lessons": [{"file": "lectia1-interfata-organizare.html", "topic": "Sistemul de operare in farmacie: interfata, ferestre, imprimanta si cititorul de coduri de bare, conturi de utilizator. Organizarea fisierelor - foldere pe furnizor, pe luna, pe tip de document.", "prev": "index.html", "next": "lectia2-securitate-copii.html", "idx": 1, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c1-sistem-de-operare/lectia1-interfata-organizare.html"}, {"file": "lectia2-securitate-copii.html", "topic": "Securitatea si copiile de siguranta: parole, blocarea statiei, actualizari, antivirus, salvarea gestiunii. De ce o farmacie fara copie de siguranta pierde evidenta, nu doar fisiere.", "prev": "lectia1-interfata-organizare.html", "next": "index.html", "idx": 2, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c1-sistem-de-operare/lectia2-securitate-copii.html"}]}, {"cls": "an2-farmacie", "module": "c2-word-excel", "title": "C2. Documente si Reprezentari Grafice", "icon": "📊", "desc": "Competenta 2: procesor de texte si foaie de calcul in activitatea de farmacie", "indexPath": "content/profesional/sanitar/an2-farmacie/c2-word-excel/index.html", "gradeName": "Postliceal, Anul II", "audienceShort": "Postliceal Sanitar, Anul II", "lessons": [{"file": "lectia1-documente-farmacie.html", "topic": "Documente de farmacie in procesorul de texte: nota de comanda, proces-verbal de receptie, adresa catre furnizor, anunt pentru public. Formatare, antet, tabel, export in PDF.", "prev": "index.html", "next": "lectia2-calcul-tabelar-stocuri.html", "idx": 1, "of": 4, "path": "content/profesional/sanitar/an2-farmacie/c2-word-excel/lectia1-documente-farmacie.html"}, {"file": "lectia2-calcul-tabelar-stocuri.html", "topic": "Foaia de calcul pentru gestiune: structura evidentei de stocuri (denumire, substanta activa, lot, termen de valabilitate, cantitate, pret). Tipuri de date si introducerea corecta a datelor calendaristice.", "prev": "lectia1-documente-farmacie.html", "next": "lectia3-formule-adaos.html", "idx": 2, "of": 4, "path": "content/profesional/sanitar/an2-farmacie/c2-word-excel/lectia2-calcul-tabelar-stocuri.html"}, {"file": "lectia3-formule-adaos.html", "topic": "Formule si functii pentru farmacie: SUM, AVERAGE, COUNTIF, SUMIF, IF. Calculul adaosului comercial si al pretului cu amanuntul, TVA, si semnalarea automata a produselor cu termen de valabilitate sub 90 de zile.", "prev": "lectia2-calcul-tabelar-stocuri.html", "next": "lectia4-grafice.html", "idx": 3, "of": 4, "path": "content/profesional/sanitar/an2-farmacie/c2-word-excel/lectia3-formule-adaos.html"}, {"file": "lectia4-grafice.html", "topic": "Reprezentari grafice: vanzari pe luni, structura stocului pe categorii, produse cu rulaj mic. Alegerea diagramei si citirea ei corecta pentru o decizie de comanda.", "prev": "lectia3-formule-adaos.html", "next": "index.html", "idx": 4, "of": 4, "path": "content/profesional/sanitar/an2-farmacie/c2-word-excel/lectia4-grafice.html"}]}, {"cls": "an2-farmacie", "module": "c3-baze-de-date", "title": "C3. Administrarea unei Baze de Date", "icon": "🗄", "desc": "Competenta 3: nomenclator si gestiune", "indexPath": "content/profesional/sanitar/an2-farmacie/c3-baze-de-date/index.html", "gradeName": "Postliceal, Anul II", "audienceShort": "Postliceal Sanitar, Anul II", "lessons": [{"file": "lectia1-tipuri-structura.html", "topic": "Structura unei baze de date de farmacie: tabelul de produse, tabelul de furnizori, tabelul de intrari. Campuri, tipuri de date, cheie primara.", "prev": "index.html", "next": "lectia2-operatii-incarcare.html", "idx": 1, "of": 3, "path": "content/profesional/sanitar/an2-farmacie/c3-baze-de-date/lectia1-tipuri-structura.html"}, {"file": "lectia2-operatii-incarcare.html", "topic": "Operatii si incarcare: formular de receptie, validari (termen de valabilitate obligatoriu, cantitate pozitiva), import din fisierul furnizorului, curatarea duplicatelor.", "prev": "lectia1-tipuri-structura.html", "next": "lectia3-exploatare.html", "idx": 2, "of": 3, "path": "content/profesional/sanitar/an2-farmacie/c3-baze-de-date/lectia2-operatii-incarcare.html"}, {"file": "lectia3-exploatare.html", "topic": "Exploatarea bazei: interogari utile - produse expirate sau aproape expirate, stoc sub minim, valoarea stocului pe categorie - si raport de gestiune tiparibil.", "prev": "lectia2-operatii-incarcare.html", "next": "index.html", "idx": 3, "of": 3, "path": "content/profesional/sanitar/an2-farmacie/c3-baze-de-date/lectia3-exploatare.html"}]}, {"cls": "an2-farmacie", "module": "c4-internet", "title": "C4. Comunicarea pe Internet", "icon": "🌐", "desc": "Competenta 4: surse oficiale si transmiterea informatiei", "indexPath": "content/profesional/sanitar/an2-farmacie/c4-internet/index.html", "gradeName": "Postliceal, Anul II", "audienceShort": "Postliceal Sanitar, Anul II", "lessons": [{"file": "lectia1-surse-oficiale.html", "topic": "Surse oficiale pentru farmacie: nomenclatorul si prospectele publicate de agentia medicamentului, listele de medicamente compensate, comunicatele de retragere de lot. Cum verifici un prospect si de ce nu iei informatia de pe forum.", "prev": "index.html", "next": "lectia2-transmitere.html", "idx": 1, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c4-internet/lectia1-surse-oficiale.html"}, {"file": "lectia2-transmitere.html", "topic": "Transmiterea informatiei: comanda catre depozit pe email, atasamente si formate, comunicarea unei retrageri de lot in interiorul farmaciei, si regulile de confidentialitate pentru datele pacientilor din retete.", "prev": "lectia1-surse-oficiale.html", "next": "index.html", "idx": 2, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c4-internet/lectia2-transmitere.html"}]}, {"cls": "an2-farmacie", "module": "c5-prezentare", "title": "C5. Structurarea si Prezentarea Informatiei", "icon": "🖥", "desc": "Competenta 5: sinteza din surse variate si produs final", "indexPath": "content/profesional/sanitar/an2-farmacie/c5-prezentare/index.html", "gradeName": "Postliceal, Anul II", "audienceShort": "Postliceal Sanitar, Anul II", "lessons": [{"file": "lectia1-structurare-prezentare.html", "topic": "Structurarea informatiei din surse variate si realizarea prezentarii: plan, selectie, sinteza, citarea sursei, reguli de lizibilitate. Prezentarea unui produs sau a unei atentionari catre echipa, in 5 minute.", "prev": "index.html", "next": "lectia2-produs-final.html", "idx": 1, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c5-prezentare/lectia1-structurare-prezentare.html"}, {"file": "lectia2-produs-final.html", "topic": "Produs final evaluat: dosarul digital al unei gestiuni de farmacie - documente, evidenta cu formule si grafice, mica baza de date, surse oficiale citate si prezentare - cu grila de evaluare pe cele cinci competente.", "prev": "lectia1-structurare-prezentare.html", "next": "index.html", "idx": 2, "of": 2, "path": "content/profesional/sanitar/an2-farmacie/c5-prezentare/lectia2-produs-final.html"}]}]}

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
