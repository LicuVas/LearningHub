export const meta = {
  name: 'lh-night-artistic12',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul artistic12 (9 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Liceu artistic, clasa a XII-a - proba de competente digitale si proiecte", "audience": "elevi de clasa a XII-a la liceu de arte (muzica, arte plastice), care dau la bacalaureat proba de evaluare a competentelor digitale", "flavor": "Exemplele sunt din viata unui artist: partituri si inregistrari, programe de concert, afise, coperte de album, portofoliu online, biografie de artist, bugetul unui eveniment. Foloseste programe GRATUITE acolo unde exista (GIMP, LibreOffice) si spune explicit ca merge la fel si in varianta platita. Elevii sunt buni la altceva decat la calculatoare - explica fara graba, dar fara sa ii tratezi ca pe copii.", "modules": [{"cls": "cls12", "module": "proba-d/d1-calculator-fisiere", "title": "D1: Calculatorul si Fisierele", "icon": "💻", "desc": "Proba D, competenta 1", "indexPath": "content/liceu/artistic/cls12/proba-d/d1-calculator-fisiere/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Sistemul de operare si gestionarea fisierelor asa cum se cere la proba de competente digitale: foldere, cai, copiere/mutare/redenumire, cautare, extensii, arhivare si dezarhivare, capacitate si unitati de masura. Aplicatia fir rosu: organizarea unei biblioteci digitale de partituri si inregistrari (foldere pe compozitor/perioada, denumiri consecvente, arhiva de trimis).", "prev": "../../index.html", "next": "../d2-procesare-text/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d1-calculator-fisiere/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d2-procesare-text", "title": "D2: Procesare Text", "icon": "📄", "desc": "Proba D, competenta 2", "indexPath": "content/liceu/artistic/cls12/proba-d/d2-procesare-text/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Procesorul de text la nivelul cerut de proba D: formatare de caracter si paragraf, liste, tabele, imagini cu incadrarea textului, antet si subsol, numerotarea paginilor, export PDF. Aplicatia: programul unui concert (piese, compozitori, durate) si o biografie de artist de o pagina.", "prev": "../d1-calculator-fisiere/index.html", "next": "../d3-calcul-tabelar/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d2-procesare-text/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d3-calcul-tabelar", "title": "D3: Calcul Tabelar", "icon": "📈", "desc": "Proba D, competenta 3", "indexPath": "content/liceu/artistic/cls12/proba-d/d3-calcul-tabelar/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Foaia de calcul la nivelul probei D: tipuri de date, formule, functiile SUM, AVERAGE, MIN, MAX, COUNT si IF, referinte absolute, sortare si filtrare, diagrame. Aplicatia: bugetul unui eveniment muzical - venituri din bilete, cheltuieli cu sala, sonorizarea si afisele, pragul de rentabilitate.", "prev": "../d2-procesare-text/index.html", "next": "../d4-prezentari/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d3-calcul-tabelar/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d4-prezentari", "title": "D4: Prezentari Multimedia", "icon": "🎞", "desc": "Proba D, competenta 4", "indexPath": "content/liceu/artistic/cls12/proba-d/d4-prezentari/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Prezentarea electronica la nivelul probei D: diapozitive si aspecte, teme, text lizibil, imagini, sunet si video incorporat, tranzitii si animatii cu masura, notele prezentatorului, tiparire. Aplicatia: o prezentare de 5 minute despre instrumentul tau - istorie, constructie, repertoriu, un fragment audio.", "prev": "../d3-calcul-tabelar/index.html", "next": "../d5-internet-comunicare/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d4-prezentari/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d5-internet-comunicare", "title": "D5: Internet si Comunicare", "icon": "🌐", "desc": "Proba D, competenta 5", "indexPath": "content/liceu/artistic/cls12/proba-d/d5-internet-comunicare/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Navigare si cautare eficienta, email profesional cu atasamente, siguranta contului si recunoasterea inselatoriilor, si drepturile de autor pe intelesul unui muzician: ce inseamna o licenta, ce e domeniul public, ce sunt licentele Creative Commons si de ce o inregistrare are doua drepturi separate (compozitia si inregistrarea). Aplicatia: prezenta online corecta pe platformele de muzica.", "prev": "../d4-prezentari/index.html", "next": "../d6-editare-imagini/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d5-internet-comunicare/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d6-editare-imagini", "title": "D6: Editare Imagini", "icon": "🎨", "desc": "Proba D, competenta 6", "indexPath": "content/liceu/artistic/cls12/proba-d/d6-editare-imagini/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Editarea de imagine la nivelul probei D, cu GIMP (gratuit): decupare si redimensionare, rezolutie si DPI, straturi, text, ajustari de luminozitate si contrast, transparenta, export in formatul potrivit (JPG, PNG). Aplicatia: un afis de concert si o coperta de album, pregatite si pentru ecran, si pentru tipar.", "prev": "../d5-internet-comunicare/index.html", "next": "../d7-simulare/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d6-editare-imagini/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proba-d/d7-simulare", "title": "D7: Simulare Proba D", "icon": "⏱", "desc": "Proba D, simulare completa", "indexPath": "content/liceu/artistic/cls12/proba-d/d7-simulare/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Simulare completa de proba practica, in formatul examenului: structura probei, cum e organizat timpul, ce se evalueaza si ce se puncteaza. Un set complet de sarcini care trece prin toate cele sase competente, cu barem explicit si cu greselile care costa cele mai multe puncte.", "prev": "../d6-editare-imagini/index.html", "next": "../../index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proba-d/d7-simulare/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proiecte/p2-expo-virtuala", "title": "P2: Expozitia / Concertul Virtual", "icon": "🎭", "desc": "Proiect de clasa", "indexPath": "content/liceu/artistic/cls12/proiecte/p2-expo-virtuala/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Proiect de clasa: un singur site pe care fiecare elev are propria pagina-scena, cu lucrari, audio, video si biografie artistica. Se lucreaza pe roluri (structura, design, continut, publicare), cu o conventie de fisiere respectata de toti. Include HTML si CSS real, scurt si corect, si pasii de publicare gratuita.", "prev": "../p1-portfolio/index.html", "next": "../p3-album-absolventi/index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proiecte/p2-expo-virtuala/index.html", "assets": "../../../../../../assets"}]}, {"cls": "cls12", "module": "proiecte/p3-album-absolventi", "title": "P3: Albumul Digital de Absolventi", "icon": "📷", "desc": "Proiect de clasa", "indexPath": "content/liceu/artistic/cls12/proiecte/p3-album-absolventi/index.html", "noIndex": true, "gradeName": "Clasa a XII-a", "audienceShort": "Liceu de Arte, Clasa a XII-a", "lessons": [{"file": "index.html", "topic": "Proiect de clasa: albumul de absolvire in format digital - fotografii pregatite corect, mesaje, o linie a timpului cu momentele clasei. Include organizarea materialului, pregatirea imaginilor pentru web, structura paginii si publicarea. Include si partea delicata: acordul colegilor pentru publicarea fotografiilor si ce se face cu cei care nu vor sa apara.", "prev": "../p2-expo-virtuala/index.html", "next": "../../index.html", "idx": 1, "of": 1, "path": "content/liceu/artistic/cls12/proiecte/p3-album-absolventi/index.html", "assets": "../../../../../../assets"}]}]}

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
          <link rel="stylesheet" href="${L.assets}/css/lesson-atomic.css">
          ZERO blocuri <style> inline. ZERO atribute style= pe elemente.
  <body>: skip-link -> div.container -> nav.nav-bar (2 x a.nav-btn)
          -> header.lesson-header (span.lesson-badge "Invatare Atomica" + h1.lesson-title + p.lesson-subtitle)
          -> div.progress-container (bara de progres, identic cu sablonul)
          -> section.lesson-frame  (DE CE contezi: la ce foloseste lectia + lista de rezultate asteptate)
          -> section.try-section   (un carlig REAL din meseria publicului tinta, o intrebare la care elevul incearca sa raspunda inainte sa stie)
          -> main#atomic-content cu 5-7 x div.atom
          -> section.practice-section#practice cu EXACT 3 x div.practice-exercise (data-level="minim" / "standard" / "performanta")
          -> section.review-section (summary-box + #lesson-summary + next-lesson)
  Blocul de scripturi de la final: IDENTIC cu sablonul (aceleasi 6 fisiere .js, aceeasi adancime ${L.assets}/js/...), apoi:
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
const scaffoldJobs = MODULES.filter(M => !M.noIndex).map(M => () => agent(
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
