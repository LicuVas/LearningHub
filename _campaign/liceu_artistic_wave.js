export const meta = {
  name: 'liceu-artistic-wave',
  description: 'Build the artistic-profile liceu TIC track (cls9-11): scaffold modules+indexes, build Format-C lessons, adversarial verify vs programa, fix. Sonnet.',
  phases: [
    { title: 'Scaffold' },
    { title: 'BuildOrImprove' },
    { title: 'Verify' },
    { title: 'Fix' },
  ],
}

const REPO = 'C:/00/Projects/LearningHub'
const PROFILE = 'artistic'
// Pure-TIC Format-C model lesson (no programming code) + module index model:
const LESSON_TEMPLATE = `${REPO}/content/liceu/mat-info/cls9/m3-tic-baze/lectia1-sisteme-operare.html`
const MODULE_INDEX_TEMPLATE = `${REPO}/content/liceu/mat-info/cls9/m3-tic-baze/index.html`
const CLASS_INDEX_TEMPLATE = `${REPO}/content/liceu/artistic/cls9/index.html` // already arts-styled
const ORACLE_JSON = `${REPO}/content/liceu/_curriculum_data.json` // node "artistic"
const ORACLE_MD = `${REPO}/content/liceu/CURRICULUM_REFERENCE.md`  // section "Artistic [artistic]"

// ── Lesson plan: TIC trunchi comun (1h/sapt, IX-XII) + PCI flavour for Arte Vizuale ──
// Every lesson is TIC/conceptual-practical. NO programming algorithms. cls11 web shows real HTML/CSS.
const MODULES = [
  // ===== cls9 — Bazele digitale + societate digitala + introducere in grafica =====
  { cls:'cls9', module:'m1-tic-baze', title:'TIC — Bazele Digitale', icon:'💻', emoji:true,
    desc:'Sisteme de calcul, organizare fisiere, navigare web, societate digitala',
    lessons:[
      {file:'lectia1-sisteme-calcul.html', topic:'Componentele sistemului de calcul (hardware/software), sistemul de operare, interfata grafica, organizarea fisierelor si folderelor (denumire, structura, extensii). Fara analogii care indeamna la deschiderea carcasei.'},
      {file:'lectia2-navigare-cautare.html', topic:'Navigare web, motoare de cautare, cautare eficienta si evaluarea critica a surselor, documentare responsabila (inclusiv folosirea responsabila a instrumentelor AI).'},
      {file:'lectia3-societate-digitala.html', topic:'Societate digitala: identitate si siguranta online, parole, drepturi de autor si licente (cu accent pe Creative Commons, util artistilor), neticheta, protectia datelor personale (GDPR pe intelesul elevului).'},
    ]},
  { cls:'cls9', module:'m2-intro-grafica', title:'Introducere in Grafica Digitala', icon:'🎨', emoji:true,
    desc:'Imagine raster vs vectorial, rezolutie, modele de culoare, formate',
    lessons:[
      {file:'lectia1-imagine-raster-vector.html', topic:'Imaginea digitala: raster vs vectorial, pixelul, rezolutia si DPI; cand se foloseste fiecare tip (foto vs logo). Concept, fara software specific obligatoriu.'},
      {file:'lectia2-culoare-formate.html', topic:'Culoarea digitala: modelele RGB, CMYK si HSB, paleta si profilul de culoare; formate de fisier imagine (JPG, PNG, GIF, SVG, WEBP) si compresia cu/fara pierderi — cand alegi fiecare format.'},
    ]},

  // ===== cls10 — Birotica pentru artisti + calcul tabelar + editare imagine raster (PCI) =====
  { cls:'cls10', module:'m1-procesare-text', title:'Procesare de Text', icon:'📝', emoji:true,
    desc:'Documente profesionale, stiluri, CV de artist si fisa de portofoliu',
    lessons:[
      {file:'lectia1-documente-formatare.html', topic:'Procesorul de text: structura unui document, formatarea caracterelor si paragrafelor, liste, aliniere, spatiere — un document curat si lizibil.'},
      {file:'lectia2-stiluri-sabloane.html', topic:'Stiluri, cuprins automat, sabloane si sectiuni; obtinerea unui document profesional consecvent fara formatare manuala repetata.'},
      {file:'lectia3-cv-portofoliu.html', topic:'Aplicatie practica: realizarea unui CV de artist si a unei fise de portofoliu; export PDF; notiuni de imbinare corespondenta (scrisori catre galerii/clienti).'},
    ]},
  { cls:'cls10', module:'m2-calcul-tabelar', title:'Calcul Tabelar', icon:'📊', emoji:true,
    desc:'Foi de calcul, formule, diagrame, evidenta lucrarilor si buget',
    lessons:[
      {file:'lectia1-tabel-formule.html', topic:'Foaia de calcul: celule, randuri si coloane, tipuri de date, introducerea datelor, formule de baza (suma, medie, referinte de celule).'},
      {file:'lectia2-functii-diagrame.html', topic:'Functii utile, formatare conditionala, sortare/filtrare si crearea de diagrame/grafice pentru a vizualiza date.'},
      {file:'lectia3-evidenta-buget.html', topic:'Aplicatie practica: evidenta lucrarilor unui artist si un buget de materiale pentru un proiect artistic (cantitati, preturi, total).'},
    ]},
  { cls:'cls10', module:'m3-editare-imagine', title:'Editare Imagine (Raster)', icon:'🖼️', emoji:true,
    desc:'PCI: editor raster, straturi, ajustari, export pentru web si print',
    lessons:[
      {file:'lectia1-editor-straturi.html', topic:'Editor de imagine raster (GIMP / Photopea — gratuite): interfata, conceptul de straturi (layers), selectii. Notiuni transferabile la Photoshop.'},
      {file:'lectia2-ajustari-corectii.html', topic:'Ajustari de imagine: luminozitate, contrast, saturatie, niveluri (levels); corectii de baza si retus neformat-distructiv prin straturi de ajustare.'},
      {file:'lectia3-export-pregatire.html', topic:'Decupare (crop), redimensionare pastrand calitatea, si export pregatit pentru web (compresie, dimensiuni) vs print (rezolutie, CMYK).'},
    ]},

  // ===== cls11 — Grafica vectoriala (PCI) + prezentari/audio-video + pagini web =====
  { cls:'cls11', module:'m1-grafica-vectoriala', title:'Grafica Vectoriala', icon:'✒️', emoji:true,
    desc:'PCI: cai si forme, text si compozitie, logo si afis',
    lessons:[
      {file:'lectia1-cai-forme.html', topic:'Editor vectorial (Inkscape — gratuit): forme de baza, cai (paths) si noduri, umpleri si contururi; de ce vectorul se scaleaza fara pierdere.'},
      {file:'lectia2-text-compozitie.html', topic:'Text vectorial, aliniere si distributie, straturi si grupare, principii de compozitie si notiuni de tipografie.'},
      {file:'lectia3-logo-afis.html', topic:'Proiect: realizarea unui logo / afis pentru un eveniment artistic; export SVG (editabil) si PNG (publicare).'},
    ]},
  { cls:'cls11', module:'m2-prezentari-multimedia', title:'Prezentari & Multimedia', icon:'🎬', emoji:true,
    desc:'Prezentari electronice eficiente; notiuni si editare audio-video',
    lessons:[
      {file:'lectia1-prezentare-eficienta.html', topic:'Prezentari electronice: structura unei prezentari, design de slide, reguli de lizibilitate (contrast, font, cantitate de text), animatii folosite cu masura.'},
      {file:'lectia2-audio-video.html', topic:'Continut audio-video: notiuni (rezolutie, fps, formate uzuale), montaj video de baza (taiere, tranzitii, titrare/subtitrare) cu un editor accesibil.'},
    ]},
  { cls:'cls11', module:'m3-web-portofoliu', title:'Pagini Web & Portofoliu Online', icon:'🌐', emoji:true,
    desc:'HTML/CSS de baza si o pagina de portofoliu pentru artist',
    lessons:[
      {file:'lectia1-html-css-baza.html', topic:'Pagina web: structura HTML (titluri, paragrafe, imagini, link-uri) si stilizare CSS de baza (culori, fonturi, spatiere). Arata cod HTML/CSS real, scurt, corect.'},
      {file:'lectia2-portofoliu-online.html', topic:'Proiect: o pagina de portofoliu online pentru artist — galerie de imagini, descriere, sectiune de contact. Cod HTML/CSS real, corect si simplu.'},
    ]},
]

// Flatten lessons with nav context
const ALL = []
for (const M of MODULES) {
  M.lessons.forEach((L, i) => {
    const prev = i === 0 ? '../index.html' : M.lessons[i-1].file
    const next = i === M.lessons.length-1 ? '../index.html' : M.lessons[i+1].file
    ALL.push({ cls:M.cls, module:M.module, moduleTitle:M.title, file:L.file, topic:L.topic, prev, next, idx:i+1, of:M.lessons.length })
  })
}

const BUILD_SCHEMA = {
  type:'object', required:['file','done','honestNotes'],
  properties:{
    file:{type:'string'}, done:{type:'boolean'}, action:{type:'string', enum:['created','improved','kept']},
    factsGrounded:{type:'array', items:{type:'string'}},
    codeRan:{type:'array', items:{type:'object', properties:{lang:{type:'string'}, ran:{type:'boolean'}, note:{type:'string'}}}},
    honestNotes:{type:'array', items:{type:'string'}}, summary:{type:'string'},
  },
}
const VERIFY_SCHEMA = {
  type:'object', required:['file','ok','issues'],
  properties:{
    file:{type:'string'}, ok:{type:'boolean'},
    issues:{type:'array', items:{type:'object', required:['axis','severity','detail'], properties:{
      axis:{type:'string', enum:['conformitate-programa','corectitudine-factuala','cod-html-valid','analogii-siguranta','progresivitate','format-quiz']},
      severity:{type:'string', enum:['high','medium','low']}, detail:{type:'string'} }}},
  },
}
const FIX_SCHEMA = { type:'object', required:['file','fixed','remaining'], properties:{ file:{type:'string'}, fixed:{type:'boolean'}, remaining:{type:'array', items:{type:'string'}}, summary:{type:'string'} } }

function lpath(L){ return `${REPO}/content/liceu/${PROFILE}/${L.cls}/${L.module}/${L.file}` }
function lessonId(L){ return `${L.cls}-${L.module}-${L.file.replace('.html','')}` }

function lessonRules(L){
  return `SABLON DE FORMAT (reprodu structura EXACT, e o lectie TIC fara cod de programare): ${LESSON_TEMPLATE}
ORACOL programa (CE se preda, nivel, terminologie): ${ORACLE_JSON} -> nodul "artistic"; context: ${ORACLE_MD} sectiunea "Artistic".
PROFIL: artistic (filiera vocationala). TIC = trunchi comun, 1h/sapt. NIVEL: competente digitale generale + relevanta pentru artisti (PCI: prelucrarea imaginii). FARA algoritmi/programare (exceptie: lectiile web arata HTML/CSS real, scurt si corect).
Tema: ${L.topic}
Modul: ${L.moduleTitle} — lectia ${L.idx}/${L.of}.
FORMAT obligatoriu (Format C "Guided Atomic"): <head> cu <link rel="stylesheet" href="../../../../../assets/css/lesson-atomic.css">, ZERO <style> inline. Ordine: skip-link -> nav -> lesson-header(badge "Invatare Atomica" + titlu) -> progress -> section.lesson-frame(goal + learning-outcomes) -> section.try-section(carlig real din viata unui elev de la Arte) -> main#atomic-content cu 4-6 div.atom (fiecare cu .atom-header[.atom-number+.atom-title] + continut + data-quiz JSON VALID pe div.atom; ultimul atom poate fi recapitulativ fara quiz, ca in sablon) -> section.practice-section cu 3 .practice-exercise (data-level minim/standard/performanta) -> section.review-section(summary-box + #lesson-summary + next-lesson).
SCRIPTURI la final IDENTIC ca sablonul; init cu ID "${lessonId(L)}" (AtomicLearning.init), Breadcrumb.init grade='${L.cls}' module='${L.module}', LearningProgress.init('${L.cls}','${L.module}','${L.file}').
NAVIGARE: butonul inapoi -> "${L.prev}"; butonul inainte -> "${L.next}".
RIGOARE (criteriu de done): fiecare afirmatie factuala (formate, modele de culoare, DPI, pasi intr-un program, ce face un format) trebuie sa fie CORECTA — verific-o fata de oracol / cunostinte de incredere; raporteaza-le in factsGrounded. Pentru lectiile cu HTML/CSS: codul afisat trebuie sa fie sintactic valid si sa produca exact ce descrii (scrie un fisier .html temp si verifica vizual/structural daca poti; raporteaza in codeRan). Cod care nu e valid NU ramane.
QUIZ: JSON valid pe data-quiz; raspunsul corect variat (nu mereu aceeasi pozitie); hint util.
ANALOGII SIGURE: nicio analogie nu indeamna la actiuni nesigure (ex: NU "deschide carcasa/uita-te in interiorul calculatorului"). Ton potrivit unui elev de liceu de arte: exemple din pictura, design, expozitii, portofoliu.
ANTI-COLIZIUNE: NU edita NICIUN .css/.js shared. Foloseste DOAR clasele existente din lesson-atomic.css (vezi sablonul). Stil specific imposibil fara inline -> renunta la el, nu adauga <style>.`
}

// ── Phase 1: Scaffold module index.html for each module + update cls10/cls11 class indexes ──
phase('Scaffold')
const scaffoldJobs = []
for (const M of MODULES) {
  scaffoldJobs.push(() => agent(`Creeaza index.html pentru modulul "${M.title}" al profilului artistic.
Fisier de creat: ${REPO}/content/liceu/${PROFILE}/${M.cls}/${M.module}/index.html
SABLON (mirror exact structura + scripturi + adancimea cailor "../../../../../assets"): ${MODULE_INDEX_TEMPLATE}
Adapteaza: titlu/icon "${M.icon} ${M.title}", descriere "${M.desc}", clasa ${M.cls}, profil Artistic.
Listeaza EXACT aceste lectii ca .lesson-card, in ordine, cu numar si titlu derivat din nume:
${M.lessons.map((l,n)=>`  ${n+1}. href="${l.file}" — ${l.topic.split(/[.;]/)[0]}`).join('\n')}
nav-back -> "../index.html". NU edita fisiere shared (.css/.js). Scrie cu Write. Raporteaza done + summary.`,
    { label:`scaffold:${M.cls}/${M.module}`, phase:'Scaffold', schema:{type:'object',required:['done'],properties:{done:{type:'boolean'},summary:{type:'string'}}}, model:'sonnet' }))
}
// Update class index for cls10 + cls11 (cls9 already lists its 2 modules correctly).
for (const cls of ['cls10','cls11']) {
  const mods = MODULES.filter(m => m.cls === cls)
  scaffoldJobs.push(() => agent(`Actualizeaza pagina de clasa: ${REPO}/content/liceu/${PROFILE}/${cls}/index.html
Pastreaza stilul existent (sablon de referinta arts-styled: ${CLASS_INDEX_TEMPLATE}). Inlocuieste .modules-grid astfel incat sa contina EXACT aceste module-card-uri, in ordine:
${mods.map((m,n)=>`  M${n+1} href="${m.module}/index.html" — "${m.title}" (${m.lessons.length} lectii) — ${m.desc}`).join('\n')}
Actualizeaza si statisticile din progress-section: numar module = ${mods.length}, numar lectii = ${mods.reduce((s,m)=>s+m.lessons.length,0)}.
NU edita .css/.js shared. Edit/Write. Raporteaza done.`,
    { label:`classindex:${cls}`, phase:'Scaffold', schema:{type:'object',required:['done'],properties:{done:{type:'boolean'},summary:{type:'string'}}}, model:'sonnet' }))
}
const scaffolded = await parallel(scaffoldJobs)
log(`Scaffold: ${scaffolded.filter(Boolean).filter(s=>s.done).length}/${scaffoldJobs.length} module/class indexes created`)

// ── Phases 2-4: per-lesson pipeline Build -> Verify -> Fix (no barrier) ──
phase('BuildOrImprove')
const results = await pipeline(
  ALL,
  (L) => agent(`Esti constructor de continut TIC pentru liceul de arte (profil artistic). Construieste O SINGURA lectie completa si riguroasa: ${lpath(L)}
PERCEIVE intai: citeste sablonul de lectie, nodul "artistic" din oracol, si index.html al modulului (${REPO}/content/liceu/${PROFILE}/${L.cls}/${L.module}/index.html).
${lessonRules(L)}
Scrie fisierul cu Write. action="created". Raporteaza factsGrounded + (daca e cazul) codeRan + honestNotes.`,
    { label:`build:${L.cls}/${L.module}/${L.file}`, phase:'BuildOrImprove', schema:BUILD_SCHEMA, model:'sonnet' }),
  (built, L) => {
    if (!built || !built.done) return { file:L.file, ok:false, issues:[{axis:'format-quiz',severity:'high',detail:'build esuat'}], _L:L }
    return agent(`Verificator ADVERSARIAL independent. Incearca sa INVALIDEZI lectia TIC (profil artistic): ${lpath(L)}
Tema declarata: ${L.topic}. ID asteptat: ${lessonId(L)}. Nivel: TIC trunchi comun (fara algoritmi; web = HTML/CSS).
Oracol: ${ORACLE_JSON} (nodul "artistic") + ${ORACLE_MD}.
Raporteaza DOAR probleme reale (cu citat/linie) pe axe:
 1. conformitate-programa: subiect potrivit profilului artistic si nivelului TIC? terminologie corecta? nu cumva e prea avansat/algoritmic?
 2. corectitudine-factuala: afirmatii despre formate, culoare (RGB/CMYK/HSB), DPI, pasi in programe — toate corecte? (verifica punctele dubioase)
 3. cod-html-valid: daca exista HTML/CSS afisat, e valid si produce ce se descrie? (testeaza scriind temp .html daca e nevoie; sterge dupa)
 4. analogii-siguranta: nicio analogie nesigura (ex: deschiderea carcasei)?
 5. progresivitate: construieste logic, potrivit unui elev de arte?
 6. format-quiz: Format C complet? lesson-atomic.css linkat, fara <style> inline? data-quiz JSON valid, raspuns corect nu mereu pe aceeasi pozitie? ID-uri init + LearningProgress + nav prev/next ("${L.prev}"/"${L.next}") corecte?
ok=true DOAR daca nu exista probleme high/medium.`,
      { label:`verify:${L.cls}/${L.module}/${L.file}`, phase:'Verify', schema:VERIFY_SCHEMA, model:'sonnet' })
      .then(v => ({ ...(v || {file:L.file, ok:false, issues:[{axis:'format-quiz',severity:'high',detail:'verificator picat'}]}), _L:L }))
  },
  (verdict, L) => {
    if (!verdict) return { file:L.file, fixed:false, remaining:['verdict null'] }
    const real = (verdict.issues||[]).filter(i => i.severity==='high' || i.severity==='medium')
    if (verdict.ok && real.length===0) return { file:L.file, fixed:true, remaining:[], summary:'fara probleme' }
    return agent(`Repara CHIRURGICAL lectia ${lpath(L)}. Probleme confirmate:
${real.map((i,n)=>`${n+1}. [${i.axis}/${i.severity}] ${i.detail}`).join('\n')}
Reguli: NU edita .css/.js shared. Daca repari HTML/CSS afisat, re-valideaza-l. Pastreaza Format C, ID-urile si nav prev/next. Edit/Write. Raporteaza ce ai reparat si ce a ramas.`,
      { label:`fix:${L.cls}/${L.module}/${L.file}`, phase:'Fix', schema:FIX_SCHEMA, model:'sonnet' })
  }
)

const done = results.filter(Boolean)
return {
  profile: PROFILE,
  totalLessons: ALL.length,
  scaffolds: scaffolded.filter(Boolean).filter(s=>s.done).length,
  cleanFirstPass: done.filter(r=>r.summary==='fara probleme').length,
  fixed: done.filter(r=>r.fixed).length,
  unresolved: done.filter(r=>r.fixed===false).map(r=>({file:r.file, remaining:r.remaining})),
  details: done,
}
