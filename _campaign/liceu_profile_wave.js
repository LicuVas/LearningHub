export const meta = {
  name: 'liceu-profile-wave',
  description: 'Generalized TIC trunchi-comun builder for any liceu profile (cls9-12): scaffold + Format-C lessons + adversarial verify + fix. Sonnet. Driven by args={profile,node,flavor,profileLabel,icon}.',
  phases: [
    { title: 'Scaffold' },
    { title: 'BuildOrImprove' },
    { title: 'Verify' },
    { title: 'Fix' },
  ],
}

// ── args: { profile, node, flavor, profileLabel, icon } ──
let A = args
if (typeof A === 'string') { try { A = JSON.parse(A) } catch (e) { A = {} } }
if (!A || typeof A !== 'object') A = {}
const PROFILE = A.profile        // dir name, e.g. "umanist"
const NODE = A.node || PROFILE   // oracle JSON key
const FLAVOR = A.flavor || 'exemple potrivite profilului'
const LABEL = A.profileLabel || PROFILE
const ICON = A.icon || '📚'
if (!PROFILE) { return { error: 'args.profile required', argsType: typeof args, argsRaw: JSON.stringify(args) } }

const REPO = 'C:/00/Projects/LearningHub'
const LESSON_TEMPLATE = `${REPO}/content/liceu/mat-info/cls9/m3-tic-baze/lectia1-sisteme-operare.html`
const MODULE_INDEX_TEMPLATE = `${REPO}/content/liceu/mat-info/cls9/m3-tic-baze/index.html`
const ORACLE_JSON = `${REPO}/content/liceu/_curriculum_data.json` // node = NODE
const ORACLE_MD = `${REPO}/content/liceu/CURRICULUM_REFERENCE.md`

// Canonical TIC trunchi-comun plan (1h/sapt, cls IX-XII). Flavoured per profile via FLAVOR.
const MODULES = [
  { cls:'cls9', module:'m1-sisteme-retele', title:'Sisteme de Calcul & Retele', icon:'💻',
    desc:'Componente, sistem de operare, fisiere, retele si internet',
    lessons:[
      {file:'lectia1-sisteme-calcul.html', topic:'Componentele sistemului de calcul (hardware/software), sistemul de operare, interfata grafica, organizarea fisierelor si folderelor. Fara analogii care indeamna la deschiderea carcasei.'},
      {file:'lectia2-retele-internet.html', topic:'Retele de calculatoare si Internet: tipuri, componente, cum circula datele (concept, fara configurari avansate); servicii uzuale.'},
    ]},
  { cls:'cls9', module:'m2-societate-digitala', title:'Societate Digitala', icon:'🛡️',
    desc:'Identitate, siguranta, drepturi de autor, GDPR, comunicare responsabila',
    lessons:[
      {file:'lectia1-identitate-siguranta.html', topic:'Identitate digitala, parole sigure, siguranta online, recunoasterea amenintarilor de baza (phishing, malware).'},
      {file:'lectia2-drepturi-gdpr.html', topic:'Drepturi de autor si licente (inclusiv Creative Commons), protectia datelor personale (GDPR pe intelesul elevului), utilizarea etica a continutului.'},
      {file:'lectia3-comunicare-ai.html', topic:'Comunicare digitala (email/chat/videoconferinte), neticheta, si utilizarea responsabila a instrumentelor AI pentru invatare si documentare.'},
    ]},
  { cls:'cls10', module:'m1-procesare-text', title:'Procesare de Text', icon:'📝',
    desc:'Documente profesionale, stiluri, corespondenta',
    lessons:[
      {file:'lectia1-documente-formatare.html', topic:'Procesorul de text: structura document, formatarea caracterelor si paragrafelor, liste, aliniere — un document curat si lizibil.'},
      {file:'lectia2-stiluri-cuprins.html', topic:'Stiluri, cuprins automat, sectiuni si sabloane; document profesional consecvent fara formatare manuala repetata.'},
      {file:'lectia3-corespondenta-aplicatie.html', topic:`Imbinare corespondenta si aplicatie practica relevanta profilului (${FLAVOR}); export PDF.`},
    ]},
  { cls:'cls10', module:'m2-calcul-tabelar', title:'Calcul Tabelar', icon:'📊',
    desc:'Foi de calcul, formule, functii, diagrame',
    lessons:[
      {file:'lectia1-tabel-formule.html', topic:'Foaia de calcul: celule, randuri/coloane, tipuri de date, formule de baza (suma, medie, referinte).'},
      {file:'lectia2-functii-diagrame.html', topic:'Functii utile, sortare/filtrare, formatare conditionala, crearea de diagrame pentru vizualizarea datelor.'},
      {file:'lectia3-aplicatie.html', topic:`Aplicatie practica de calcul tabelar relevanta profilului (${FLAVOR}).`},
    ]},
  { cls:'cls11', module:'m1-prezentari-multimedia', title:'Prezentari & Multimedia', icon:'🎬',
    desc:'Prezentari eficiente, audio-video',
    lessons:[
      {file:'lectia1-prezentare-eficienta.html', topic:'Prezentari electronice: structura, design de slide, reguli de lizibilitate (contrast, font, cantitate de text), animatii cu masura.'},
      {file:'lectia2-audio-video.html', topic:'Continut audio-video: notiuni (rezolutie, fps, formate), montaj video de baza (taiere, tranzitii, titrare).'},
    ]},
  { cls:'cls11', module:'m2-imagini-web', title:'Imagini & Pagini Web', icon:'🌐',
    desc:'Imagine digitala, formate, HTML/CSS de baza',
    lessons:[
      {file:'lectia1-imagine-digitala.html', topic:'Imaginea digitala: raster vs vectorial, rezolutie/DPI, modele de culoare (RGB/CMYK), formate (JPG/PNG/SVG) si compresie.'},
      {file:'lectia2-pagini-web.html', topic:'Pagina web: structura HTML (titluri, paragrafe, imagini, link-uri) si stilizare CSS de baza. Cod HTML/CSS real, scurt si corect.'},
    ]},
  { cls:'cls12', module:'m1-competente-digitale', title:'Competente Digitale (proba D)', icon:'🎓',
    desc:'Recapitulare integrata pentru competente digitale + proiect',
    lessons:[
      {file:'lectia1-calculator-fisiere.html', topic:'Competente digitale — sistemul de calcul si gestionarea fisierelor: operatii esentiale pentru proba practica.'},
      {file:'lectia2-procesare-text.html', topic:'Competente digitale — procesare de text: sarcini tip proba D (formatare, tabele, imagini, antet/subsol).'},
      {file:'lectia3-calcul-tabelar.html', topic:'Competente digitale — calcul tabelar: sarcini tip proba D (formule, functii, diagrame, sortare/filtrare).'},
      {file:'lectia4-prezentari-internet.html', topic:'Competente digitale — prezentari electronice si internet/comunicare: sarcini tip proba D.'},
      {file:'lectia5-editare-imagini.html', topic:'Competente digitale — editare de imagini de baza: ajustari, decupare, export, conform cerintelor practice.'},
      {file:'lectia6-proiect-integrator.html', topic:`Proiect integrator de competente digitale, relevant profilului (${FLAVOR}): combina text, calcul tabelar, prezentare si imagini.`},
    ]},
]

const ALL = []
for (const M of MODULES) {
  M.lessons.forEach((L, i) => {
    const prev = i === 0 ? '../index.html' : M.lessons[i-1].file
    const next = i === M.lessons.length-1 ? '../index.html' : M.lessons[i+1].file
    ALL.push({ cls:M.cls, module:M.module, moduleTitle:M.title, file:L.file, topic:L.topic, prev, next, idx:i+1, of:M.lessons.length })
  })
}

const BUILD_SCHEMA = { type:'object', required:['file','done','honestNotes'], properties:{
  file:{type:'string'}, done:{type:'boolean'}, action:{type:'string', enum:['created','improved','kept']},
  factsGrounded:{type:'array', items:{type:'string'}}, honestNotes:{type:'array', items:{type:'string'}}, summary:{type:'string'} } }
const VERIFY_SCHEMA = { type:'object', required:['file','ok','issues'], properties:{
  file:{type:'string'}, ok:{type:'boolean'}, issues:{type:'array', items:{type:'object', required:['axis','severity','detail'], properties:{
    axis:{type:'string', enum:['conformitate-programa','corectitudine-factuala','cod-html-valid','analogii-siguranta','progresivitate','format-quiz']},
    severity:{type:'string', enum:['high','medium','low']}, detail:{type:'string'} }}} } }
const FIX_SCHEMA = { type:'object', required:['file','fixed','remaining'], properties:{ file:{type:'string'}, fixed:{type:'boolean'}, remaining:{type:'array', items:{type:'string'}}, summary:{type:'string'} } }

function lpath(L){ return `${REPO}/content/liceu/${PROFILE}/${L.cls}/${L.module}/${L.file}` }
function lessonId(L){ return `${L.cls}-${L.module}-${L.file.replace('.html','')}` }

function lessonRules(L){
  return `SABLON DE FORMAT (reprodu structura EXACT; lectie TIC fara cod de programare): ${LESSON_TEMPLATE}
ORACOL programa: ${ORACLE_JSON} -> nodul "${NODE}"; context: ${ORACLE_MD}.
PROFIL: ${LABEL}. TIC = trunchi comun, 1h/sapt, competente digitale generale. FARA algoritmi/programare (exceptie: lectiile web arata HTML/CSS real, scurt, corect).
FLAVOR (teseaza exemple specifice profilului, natural, nu fortat): ${FLAVOR}.
Tema: ${L.topic}
Modul: ${L.moduleTitle} — lectia ${L.idx}/${L.of}.
FORMAT obligatoriu (Format C "Guided Atomic"): <head> cu <link rel="stylesheet" href="../../../../../assets/css/lesson-atomic.css">, ZERO <style> inline. Ordine: skip-link -> nav -> lesson-header(badge "Invatare Atomica" + titlu) -> progress -> section.lesson-frame(goal + learning-outcomes) -> section.try-section(carlig real, ${LABEL}) -> main#atomic-content cu 4-6 div.atom (fiecare .atom-header[.atom-number+.atom-title] + continut + data-quiz JSON VALID; ultimul atom poate fi recapitulativ fara quiz) -> section.practice-section cu 3 .practice-exercise (data-level minim/standard/performanta) -> section.review-section(summary-box + #lesson-summary + next-lesson).
SCRIPTURI la final IDENTIC ca sablonul; init ID "${lessonId(L)}" (AtomicLearning.init), Breadcrumb.init grade='${L.cls}' module='${L.module}', LearningProgress.init('${L.cls}','${L.module}','${L.file}').
NAVIGARE: inapoi -> "${L.prev}"; inainte -> "${L.next}".
RIGOARE (done): fiecare afirmatie factuala (formate, culoare, DPI, pasi in programe, ce face un format/functie) CORECTA — verifica fata de oracol/cunostinte de incredere; raporteaza in factsGrounded. HTML/CSS afisat = sintactic valid si produce ce descrii. Quiz: JSON valid, raspuns corect variat (nu mereu aceeasi pozitie), hint util.
ANALOGII SIGURE: nimic nesigur (ex: NU "deschide carcasa"). ANTI-COLIZIUNE: NU edita .css/.js shared; foloseste DOAR clase din lesson-atomic.css; fara <style> inline.`
}

phase('Scaffold')
const scaffoldJobs = []
for (const M of MODULES) {
  scaffoldJobs.push(() => agent(`Creeaza index.html pentru modulul "${M.title}" al profilului ${LABEL}.
Fisier: ${REPO}/content/liceu/${PROFILE}/${M.cls}/${M.module}/index.html
SABLON (mirror structura + scripturi + adancime "../../../../../assets"): ${MODULE_INDEX_TEMPLATE}
Adapteaza: titlu/icon "${M.icon} ${M.title}", descriere "${M.desc}", clasa ${M.cls}, profil ${LABEL}.
Listeaza EXACT aceste lectii ca .lesson-card, in ordine:
${M.lessons.map((l,n)=>`  ${n+1}. href="${l.file}" — ${l.topic.split(/[.;(]/)[0]}`).join('\n')}
nav-back -> "../index.html". NU edita fisiere shared. Write. Raporteaza done.`,
    { label:`scaffold:${M.cls}/${M.module}`, phase:'Scaffold', schema:{type:'object',required:['done'],properties:{done:{type:'boolean'},summary:{type:'string'}}}, model:'sonnet' }))
}
for (const cls of ['cls9','cls10','cls11','cls12']) {
  const mods = MODULES.filter(m => m.cls === cls)
  scaffoldJobs.push(() => agent(`Actualizeaza pagina de clasa: ${REPO}/content/liceu/${PROFILE}/${cls}/index.html
Pastreaza stilul/tema de culoare EXISTENTE ale acestei pagini (nu copia alt profil). Inlocuieste .modules-grid sa contina EXACT aceste module-card, in ordine:
${mods.map((m,n)=>`  M${n+1} href="${m.module}/index.html" — "${m.title}" (${m.lessons.length} lectii) — ${m.desc}`).join('\n')}
Actualizeaza progress-section: module=${mods.length}, lectii=${mods.reduce((s,m)=>s+m.lessons.length,0)}.
NU edita .css/.js shared. Edit/Write. Raporteaza done.`,
    { label:`classindex:${cls}`, phase:'Scaffold', schema:{type:'object',required:['done'],properties:{done:{type:'boolean'},summary:{type:'string'}}}, model:'sonnet' }))
}
const scaffolded = await parallel(scaffoldJobs)
log(`[${PROFILE}] Scaffold: ${scaffolded.filter(Boolean).filter(s=>s.done).length}/${scaffoldJobs.length}`)

phase('BuildOrImprove')
const results = await pipeline(
  ALL,
  (L) => agent(`Esti constructor de continut TIC (profil ${LABEL}). Construieste O SINGURA lectie completa si riguroasa: ${lpath(L)}
PERCEIVE intai: citeste sablonul, nodul "${NODE}" din oracol, si index.html al modulului.
${lessonRules(L)}
Scrie cu Write. action="created". Raporteaza factsGrounded + honestNotes.`,
    { label:`build:${L.cls}/${L.module}/${L.file}`, phase:'BuildOrImprove', schema:BUILD_SCHEMA, model:'sonnet' }),
  (built, L) => {
    if (!built || !built.done) return { file:L.file, ok:false, issues:[{axis:'format-quiz',severity:'high',detail:'build esuat'}], _L:L }
    return agent(`Verificator ADVERSARIAL independent. Incearca sa INVALIDEZI lectia TIC (profil ${LABEL}): ${lpath(L)}
Tema: ${L.topic}. ID asteptat: ${lessonId(L)}. Nivel: TIC trunchi comun (fara algoritmi; web=HTML/CSS).
Oracol: ${ORACLE_JSON} (nodul "${NODE}") + ${ORACLE_MD}. Probleme reale (cu citat/linie) pe axe:
 1 conformitate-programa (potrivit profilului si nivelului TIC, nu prea avansat)
 2 corectitudine-factuala (formate/culoare/DPI/pasi corecte)
 3 cod-html-valid (daca exista HTML/CSS, valid si produce ce descrie; testeaza temp .html, sterge dupa)
 4 analogii-siguranta (nimic nesigur)
 5 progresivitate (logic, potrivit)
 6 format-quiz (Format C complet, css linkat fara <style> inline, data-quiz JSON valid cu raspuns nu mereu pe aceeasi pozitie, init+LearningProgress+nav prev/next "${L.prev}"/"${L.next}" corecte)
ok=true DOAR fara probleme high/medium.`,
      { label:`verify:${L.cls}/${L.module}/${L.file}`, phase:'Verify', schema:VERIFY_SCHEMA, model:'sonnet' })
      .then(v => ({ ...(v || {file:L.file, ok:false, issues:[{axis:'format-quiz',severity:'high',detail:'verificator picat'}]}), _L:L }))
  },
  (verdict, L) => {
    if (!verdict) return { file:L.file, fixed:false, remaining:['verdict null'] }
    const real = (verdict.issues||[]).filter(i => i.severity==='high' || i.severity==='medium')
    if (verdict.ok && real.length===0) return { file:L.file, fixed:true, remaining:[], summary:'fara probleme' }
    return agent(`Repara CHIRURGICAL lectia ${lpath(L)}. Probleme confirmate:
${real.map((i,n)=>`${n+1}. [${i.axis}/${i.severity}] ${i.detail}`).join('\n')}
NU edita .css/.js shared. Pastreaza Format C, ID-uri, nav prev/next. Edit/Write. Raporteaza.`,
      { label:`fix:${L.cls}/${L.module}/${L.file}`, phase:'Fix', schema:FIX_SCHEMA, model:'sonnet' })
  }
)

const fin = results.filter(Boolean)
return {
  profile: PROFILE, node: NODE, totalLessons: ALL.length,
  scaffolds: scaffolded.filter(Boolean).filter(s=>s.done).length,
  clean: fin.filter(r=>r.summary==='fara probleme').length,
  fixed: fin.filter(r=>r.fixed).length,
  unresolved: fin.filter(r=>r.fixed===false).map(r=>({file:r.file, remaining:r.remaining})),
}
