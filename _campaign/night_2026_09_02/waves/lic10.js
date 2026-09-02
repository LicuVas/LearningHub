export const meta = {
  name: 'lh-night-lic10',
  description: 'Construieste lectii Format C (Guided Atomic) pentru clasele reale de liceu/maistri/postliceal ale prof. Gurlan, lotul lic10 (13 lectii). Scaffold -> Build -> Verify -> Fix. Sonnet la executie, Opus la verificare.',
  phases: [
    { title: 'Scaffold', detail: 'Pagini index de modul' },
    { title: 'Build', detail: 'Lectiile propriu-zise' },
    { title: 'Verify', detail: 'Control adversarial pe corectitudine si format' },
    { title: 'Fix', detail: 'Reparatii pe ce a picat' },
  ],
}

const A = {"label": "Liceu clasa a X-a (T.I.C., filiera tehnologica)", "audience": "elevi de clasa a X-a la liceu tehnologic (electric/TEEA, mecanica, prelucrarea lemnului), o singura ora de T.I.C. pe saptamana", "flavor": "Exemplele se iau din atelier si din viata unei firme mici: fise de consum, devize, evidente de materiale, planuri de productie, oferte. Elevii nu sunt informaticieni; obiectivul este sa stie sa faca lucrul respectiv pe calculator, nu sa il descrie.", "modules": [{"cls": "cls10", "module": "m3-calcul-tabelar-avansat", "title": "Calcul Tabelar - Formule, Grafice, Tiparire", "icon": "📈", "desc": "CS 1.3-1.7: functii, referinte, tiparire, diagrame, import de obiecte", "indexPath": "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/index.html", "gradeName": "Clasa a X-a", "audienceShort": "T.I.C. Clasa a X-a", "lessons": [{"file": "lectia1-formule-functii.html", "topic": "CS 1.3. Formule si functii in foaia de calcul: SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF. Sintaxa exacta a fiecarei functii, argumentele ei, si erorile frecvente (impartire la zero, valoare gresita, nume necunoscut) - cum se citesc si cum se repara.", "prev": "index.html", "next": "lectia2-referinte.html", "idx": 1, "of": 4, "path": "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/lectia1-formule-functii.html"}, {"file": "lectia2-referinte.html", "topic": "CS 1.3. Referinte relative, absolute (cu dolar dublu) si mixte. Ce se schimba si ce nu cand copiezi o formula in jos sau lateral. Exemplu: tabel de preturi cu TVA calculat dintr-o singura celula fixa.", "prev": "lectia1-formule-functii.html", "next": "lectia3-grafice-diagrame.html", "idx": 2, "of": 4, "path": "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/lectia2-referinte.html"}, {"file": "lectia3-grafice-diagrame.html", "topic": "CS 1.5-1.6. Grafice si diagrame: alegerea tipului potrivit (coloane, linie, structura radiala), serii de date, etichete, titluri, legenda. Cand un grafic spune adevarul si cand induce in eroare (axa taiata, scara nepotrivita).", "prev": "lectia2-referinte.html", "next": "lectia4-tiparire-import.html", "idx": 3, "of": 4, "path": "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/lectia3-grafice-diagrame.html"}, {"file": "lectia4-tiparire-import.html", "topic": "CS 1.4, 1.7. Pregatirea pentru tiparire: zona de imprimat, cap de tabel repetat pe fiecare pagina, orientare, scalare, antet si subsol. Importul de obiecte in foaia de calcul. Aplicatie practica pe specificul calificarii tehnologice.", "prev": "lectia3-grafice-diagrame.html", "next": "index.html", "idx": 4, "of": 4, "path": "content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat/lectia4-tiparire-import.html"}]}, {"cls": "cls10", "module": "m4-baze-de-date", "title": "Baze de Date (Access)", "icon": "🗄", "desc": "CS 2.1-2.6: tabele, chei, formulare, interogari, filtre, rapoarte", "indexPath": "content/liceu/tehnologic/cls10/m4-baze-de-date/index.html", "gradeName": "Clasa a X-a", "audienceShort": "T.I.C. Clasa a X-a", "lessons": [{"file": "lectia1-concepte-tabele.html", "topic": "CS 2.1-2.2. Ce este o baza de date relationala si de ce nu tii totul intr-o foaie de calcul. Tabel, inregistrare, camp. Tipurile de date din Access (Text scurt, Numar, Data/Ora, Da/Nu, Moneda) si crearea unui tabel in Vizualizare Proiect.", "prev": "index.html", "next": "lectia2-chei-relatii.html", "idx": 1, "of": 5, "path": "content/liceu/tehnologic/cls10/m4-baze-de-date/lectia1-concepte-tabele.html"}, {"file": "lectia2-chei-relatii.html", "topic": "CS 2.2. Cheia primara: ce este, de ce e obligatorie, cum se alege. Indexul si la ce ajuta. Cheia externa si relatia unu-la-mai-multi intre doua tabele, cu integritate referentiala.", "prev": "lectia1-concepte-tabele.html", "next": "lectia3-formulare.html", "idx": 2, "of": 5, "path": "content/liceu/tehnologic/cls10/m4-baze-de-date/lectia2-chei-relatii.html"}, {"file": "lectia3-formulare.html", "topic": "CS 2.3. Formulare: de ce introduci datele prin formular si nu direct in tabel. Expertul de formulare, aranjarea controalelor, formular cu subformular pentru datele legate.", "prev": "lectia2-chei-relatii.html", "next": "lectia4-interogari-filtre.html", "idx": 3, "of": 5, "path": "content/liceu/tehnologic/cls10/m4-baze-de-date/lectia3-formulare.html"}, {"file": "lectia4-interogari-filtre.html", "topic": "CS 2.4. Interogari de selectie simple si cu criterii multiple (SI / SAU), sortare si filtre. Criterii pe text, pe numere si pe date calendaristice. O interogare peste doua tabele legate.", "prev": "lectia3-formulare.html", "next": "lectia5-rapoarte-aplicatie.html", "idx": 4, "of": 5, "path": "content/liceu/tehnologic/cls10/m4-baze-de-date/lectia4-interogari-filtre.html"}, {"file": "lectia5-rapoarte-aplicatie.html", "topic": "CS 2.5-2.6. Rapoarte: expertul de rapoarte, grupare, totaluri, pregatire pentru tiparire. Aplicatie practica integratoare - o mica baza de date pe specificul calificarii, de la tabele pana la raportul tiparit.", "prev": "lectia4-interogari-filtre.html", "next": "index.html", "idx": 5, "of": 5, "path": "content/liceu/tehnologic/cls10/m4-baze-de-date/lectia5-rapoarte-aplicatie.html"}]}, {"cls": "cls10", "module": "m5-prezentari-digitale", "title": "Prezentari Digitale (PowerPoint)", "icon": "🖥", "desc": "CS 3.1-3.11: creare, formatare, obiecte, animatie, tiparire, aplicatie", "indexPath": "content/liceu/tehnologic/cls10/m5-prezentari-digitale/index.html", "gradeName": "Clasa a X-a", "audienceShort": "T.I.C. Clasa a X-a", "lessons": [{"file": "lectia1-creare-formatare.html", "topic": "CS 3.1-3.4. Crearea unei prezentari: diapozitive, aspecte (layout), teme, coordonatorul de diapozitive, formatarea textului. Regula practica pentru cat text incape pe un diapozitiv.", "prev": "index.html", "next": "lectia2-obiecte-diagrame.html", "idx": 1, "of": 4, "path": "content/liceu/tehnologic/cls10/m5-prezentari-digitale/lectia1-creare-formatare.html"}, {"file": "lectia2-obiecte-diagrame.html", "topic": "CS 3.5-3.7. Obiecte grafice si diagrame in prezentare: forme, SmartArt, tabele, grafice, imagini. Aliniere, distribuire si ordinea straturilor.", "prev": "lectia1-creare-formatare.html", "next": "lectia3-animatie-tranzitii.html", "idx": 2, "of": 4, "path": "content/liceu/tehnologic/cls10/m5-prezentari-digitale/lectia2-obiecte-diagrame.html"}, {"file": "lectia3-animatie-tranzitii.html", "topic": "CS 3.8-3.9. Animatii pe obiecte si tranzitii intre diapozitive: tipuri, declansare, durata. Cand animatia ajuta intelegerea si cand distruge prezentarea.", "prev": "lectia2-obiecte-diagrame.html", "next": "lectia4-tiparire-aplicatie.html", "idx": 3, "of": 4, "path": "content/liceu/tehnologic/cls10/m5-prezentari-digitale/lectia3-animatie-tranzitii.html"}, {"file": "lectia4-tiparire-aplicatie.html", "topic": "CS 3.10-3.11. Tiparirea prezentarii (diapozitive, documente distribuite, pagini de note), modul prezentator, si aplicatia practica: o prezentare completa pe specificul calificarii, sustinuta in 5 minute.", "prev": "lectia3-animatie-tranzitii.html", "next": "index.html", "idx": 4, "of": 4, "path": "content/liceu/tehnologic/cls10/m5-prezentari-digitale/lectia4-tiparire-aplicatie.html"}]}]}

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
