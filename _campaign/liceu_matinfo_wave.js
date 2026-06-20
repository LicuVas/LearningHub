export const meta = {
  name: 'liceu-matinfo-wave',
  description: 'Per-class mat-info liceu wave: build missing + improve existing lessons; compile/run all code; adversarial verify vs programa; fix',
  phases: [
    { title: 'BuildOrImprove' },
    { title: 'Verify' },
    { title: 'Fix' },
  ],
}

// ─── EDIT THIS to switch class between runs ───
const TARGET_CLASS = 'cls11'
// ──────────────────────────────────────────────

const REPO = 'C:/00/Projects/LearningHub'
const TEMPLATE = `${REPO}/content/liceu/mat-info/cls9/m1-gandire-comp/lectia1-intro-algoritmi.html`
const ORACLE_JSON = `${REPO}/content/liceu/_curriculum_data.json`
const ORACLE_MD = `${REPO}/content/liceu/CURRICULUM_REFERENCE.md`

const ALL = [
  // ===== cls9 (existing m1+m4 -> improve; m2+m3 -> build) =====
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia1-intro-algoritmi.html', exists:true, intensiv:true, topic:'Ce este un algoritm; pseudocod; intrare-prelucrare-iesire'},
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia2-variabile-tipuri.html', exists:true, intensiv:true, topic:'Variabile si tipuri de date (Python si C++)'},
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia3-expresii.html', exists:true, intensiv:true, topic:'Expresii, operatori aritmetici/relationali/logici'},
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia4-intro-python.html', exists:true, intensiv:true, topic:'Introducere in Python: print, input, primul program'},
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia5-intro-cpp.html', exists:true, intensiv:true, topic:'Introducere in C++ (intensiv): structura program, cout/cin'},
  {cls:'cls9', module:'m1-gandire-comp', file:'lectia6-evaluare-expresii.html', exists:true, intensiv:true, topic:'Evaluarea expresiilor, precedenta operatorilor, conversii'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia1-structura-if.html', exists:false, intensiv:true, topic:'Instructiunea de decizie if (simpla) in Python si C++; conditii'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia2-if-else-if.html', exists:false, intensiv:true, topic:'if-else si decizii multiple (if-elif-else / else if); operatori logici'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia3-bucla-for.html', exists:false, intensiv:true, topic:'Bucla for (for cu range in Python, for clasic in C++)'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia4-bucla-while.html', exists:false, intensiv:true, topic:'Bucla while (cat timp) si do-while in C++; conditie de oprire'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia5-algoritmi-simple.html', exists:false, intensiv:true, topic:'Algoritmi simpli: suma/produs, min/max, numarare, divizori, prim simplu'},
  {cls:'cls9', module:'m2-structuri-control', file:'lectia6-probleme-bac.html', exists:false, intensiv:true, topic:'Probleme tip BAC: urmarirea executiei, ce afiseaza programul'},
  {cls:'cls9', module:'m3-tic-baze', file:'lectia1-sisteme-operare.html', exists:false, intensiv:false, topic:'Sisteme de operare: tipuri, functii, GUI/CLI, sisteme de fisiere (NTFS/FAT32/EXT/APFS), gestionare fisiere, securizare (firewall/antivirus/utilizatori/criptare). TIC, fara programare.'},
  {cls:'cls9', module:'m3-tic-baze', file:'lectia2-suite-office.html', exists:false, intensiv:false, topic:'Birotica: documente si prezentari (formatare profesionala, stiluri, imbinare corespondenta, cuprins automat, animatii). LibreOffice/MS Office. AI responsabil. Fara programare.'},
  {cls:'cls9', module:'m3-tic-baze', file:'lectia3-stocare-cloud.html', exists:false, intensiv:false, topic:'Stocare si colaborare in cloud (Google Workspace/MS Teams), partajare resurse, backup. Fara programare.'},
  {cls:'cls9', module:'m3-tic-baze', file:'lectia4-navigare-eficienta.html', exists:false, intensiv:false, topic:'Comunicare digitala (email/chat/forum/videoconferinte/neticheta) + cautare/navigare eficienta + AI responsabil pentru invatare. Fara programare.'},
  {cls:'cls9', module:'m4-etica-digitala', file:'lectia1-siguranta-online.html', exists:true, intensiv:false, topic:'Siguranta online, parole, protectia datelor'},
  {cls:'cls9', module:'m4-etica-digitala', file:'lectia2-phishing-malware.html', exists:true, intensiv:false, topic:'Phishing, malware, recunoastere si protectie'},
  {cls:'cls9', module:'m4-etica-digitala', file:'lectia3-drepturi-autor.html', exists:true, intensiv:false, topic:'Drepturi de autor, licente, utilizare etica a continutului'},
  {cls:'cls9', module:'m4-etica-digitala', file:'lectia4-gdpr-confidentialitate.html', exists:true, intensiv:false, topic:'GDPR, confidentialitate, date personale'},

  // ===== cls10 (all build) =====
  {cls:'cls10', module:'m1-structuri-date', file:'lectia1-vectori-intro.html', exists:false, intensiv:true, topic:'Tablouri unidimensionale (vectori/liste): declarare, indexare, parcurgere (Python list & C++ array)'},
  {cls:'cls10', module:'m1-structuri-date', file:'lectia2-operatii-vectori.html', exists:false, intensiv:true, topic:'Operatii pe vectori: suma, min/max, cautare, inserare/stergere'},
  {cls:'cls10', module:'m1-structuri-date', file:'lectia3-secvente.html', exists:false, intensiv:true, topic:'Subsecvente/secvente cu proprietati date; sume partiale'},
  {cls:'cls10', module:'m1-structuri-date', file:'lectia4-matrice-intro.html', exists:false, intensiv:true, topic:'Tablouri bidimensionale (matrice): declarare, parcurgere pe linii/coloane'},
  {cls:'cls10', module:'m1-structuri-date', file:'lectia5-matrice-operatii.html', exists:false, intensiv:true, topic:'Operatii pe matrice: diagonale, transpusa, adunare/inmultire'},
  {cls:'cls10', module:'m1-structuri-date', file:'lectia6-siruri-caractere.html', exists:false, intensiv:true, topic:'Siruri de caractere: parcurgere, cautare, prelucrare (str Python, string C++)'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia1-sortari.html', exists:false, intensiv:true, topic:'Metode de sortare: selectie, bule, inserare; comparatie'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia2-euclid.html', exists:false, intensiv:true, topic:'Algoritmul lui Euclid (scaderi si impartiri repetate); cmmdc/cmmmc'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia3-numere-prime.html', exists:false, intensiv:true, topic:'Numere prime: verificare eficienta, ciurul lui Eratostene (intensiv)'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia4-factorizare.html', exists:false, intensiv:true, topic:'Descompunerea in factori primi; divizori'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia5-recursivitate-intro.html', exists:false, intensiv:true, topic:'Recursivitate (intensiv): definitie, caz de baza, factorial, Fibonacci'},
  {cls:'cls10', module:'m2-algoritmi-baza', file:'lectia6-recursivitate-aplicatii.html', exists:false, intensiv:true, topic:'Aplicatii recursive: sume, parcurgeri, divide-et-impera simplu'},
  {cls:'cls10', module:'m3-retele-securitate', file:'lectia1-retele-internet.html', exists:false, intensiv:false, topic:'Retele de calculatoare si Internet: tipuri, topologii, componente. TIC.'},
  {cls:'cls10', module:'m3-retele-securitate', file:'lectia2-protocoale.html', exists:false, intensiv:false, topic:'Protocoale (TCP/IP, HTTP/HTTPS, DNS); cum circula datele. TIC.'},
  {cls:'cls10', module:'m3-retele-securitate', file:'lectia3-backup-stocare.html', exists:false, intensiv:false, topic:'Backup, stocare, redundanta, strategii de salvare. TIC.'},
  {cls:'cls10', module:'m3-retele-securitate', file:'lectia4-securitate-avansata.html', exists:false, intensiv:false, topic:'Securitate: criptare, autentificare, bune practici. TIC.'},

  // ===== cls11 (all build) =====
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia1-stiva-intro.html', exists:false, intensiv:true, topic:'Stiva (LIFO): definitie, operatii push/pop/top; implementare cu lista'},
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia2-stiva-aplicatii.html', exists:false, intensiv:true, topic:'Aplicatii stiva: verificare paranteze, evaluare expresii'},
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia3-coada-intro.html', exists:false, intensiv:true, topic:'Coada (FIFO): definitie, enqueue/dequeue; implementare'},
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia4-coada-aplicatii.html', exists:false, intensiv:true, topic:'Aplicatii coada: simulari, procesare in ordine'},
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia5-grafuri-intro.html', exists:false, intensiv:true, topic:'Grafuri: notiuni de baza (noduri, muchii, grad, tipuri)'},
  {cls:'cls11', module:'m1-structuri-avansate', file:'lectia6-reprezentari-graf.html', exists:false, intensiv:true, topic:'Reprezentari graf: matrice de adiacenta, liste de adiacenta'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia1-recursivitate-avansata.html', exists:false, intensiv:true, topic:'Recursivitate avansata: recursivitate multipla, stive de apel'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia2-backtracking-intro.html', exists:false, intensiv:true, topic:'Backtracking: schema generala, conditii de continuare/validare'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia3-permutari.html', exists:false, intensiv:true, topic:'Generarea permutarilor prin backtracking'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia4-aranjamente-combinari.html', exists:false, intensiv:true, topic:'Aranjamente si combinari prin backtracking'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia5-submultimi.html', exists:false, intensiv:true, topic:'Generarea submultimilor (produs cartezian / backtracking)'},
  {cls:'cls11', module:'m2-algoritmi-complecsi', file:'lectia6-backtracking-aplicatii.html', exists:false, intensiv:true, topic:'Aplicatii backtracking: damele, labirint, colorare'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia1-lanturi-cicluri.html', exists:false, intensiv:true, topic:'Lanturi, cicluri, drumuri intr-un graf'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia2-parcurgere-dfs.html', exists:false, intensiv:true, topic:'Parcurgere in adancime (DFS): algoritm, aplicatii'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia3-parcurgere-bfs.html', exists:false, intensiv:true, topic:'Parcurgere in latime (BFS): algoritm, drum minim in graf neponderat'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia4-conexitate.html', exists:false, intensiv:true, topic:'Conexitate, componente conexe'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia5-arbori.html', exists:false, intensiv:true, topic:'Arbori: definitie, proprietati, arbore binar'},
  {cls:'cls11', module:'m3-grafuri', file:'lectia6-aplicatii-grafuri.html', exists:false, intensiv:true, topic:'Aplicatii grafuri: probleme rezolvate'},
  {cls:'cls11', module:'m4-cybersecurity', file:'lectia1-amenintari-avansate.html', exists:false, intensiv:false, topic:'Amenintari cibernetice avansate: tipuri, vectori de atac. Conceptual.'},
  {cls:'cls11', module:'m4-cybersecurity', file:'lectia2-inginerie-sociala.html', exists:false, intensiv:false, topic:'Inginerie sociala: tehnici, recunoastere, aparare. Conceptual.'},
  {cls:'cls11', module:'m4-cybersecurity', file:'lectia3-criptografie-intro.html', exists:false, intensiv:false, topic:'Criptografie: concepte (cheie simetrica/asimetrica, hash); exemple simple (cifrul Cezar)'},
  {cls:'cls11', module:'m4-cybersecurity', file:'lectia4-ai-intro.html', exists:false, intensiv:false, topic:'Introducere in inteligenta artificiala: algoritmi, invatare automata, LLM, tipologii. Conceptual.'},
  {cls:'cls11', module:'m4-cybersecurity', file:'lectia5-ai-etica.html', exists:false, intensiv:false, topic:'Etica AI: bias, reglementari, utilizare responsabila, gandire critica. Conceptual.'},

  // ===== cls12 (all build) =====
  {cls:'cls12', module:'m1-oop', file:'lectia1-subprograme.html', exists:false, intensiv:true, topic:'Subprograme: definitie, antet, corp, apel, parametri, return (Python si C++)'},
  {cls:'cls12', module:'m1-oop', file:'lectia2-parametri.html', exists:false, intensiv:true, topic:'Parametri: transmitere prin valoare/referinta, variabile locale/globale'},
  {cls:'cls12', module:'m1-oop', file:'lectia3-oop-intro.html', exists:false, intensiv:true, topic:'Introducere in POO: clasa, obiect, membri (date+metode), instantiere (Python si C++)'},
  {cls:'cls12', module:'m1-oop', file:'lectia4-fisiere.html', exists:false, intensiv:true, topic:'Fisiere text: deschidere/inchidere/citire/scriere (Python si C++)'},
  {cls:'cls12', module:'m1-oop', file:'lectia5-gui-tkinter.html', exists:false, intensiv:true, topic:'Interfete grafice cu Tkinter (Python): Label, Button, Entry; layout'},
  {cls:'cls12', module:'m1-oop', file:'lectia6-proiect.html', exists:false, intensiv:true, topic:'Proiect integrat: aplicatie cu subprograme + clase + fisiere'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia1-matrice-avansate.html', exists:false, intensiv:true, topic:'Prelucrari avansate pe matrice'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia2-factorial-factorizare.html', exists:false, intensiv:true, topic:'Factorial, factorizare eficienta, exponentiere rapida (intensiv)'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia3-complexitate.html', exists:false, intensiv:true, topic:'Complexitatea algoritmilor: notatia O, comparatie empirica'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia4-cautare-binara.html', exists:false, intensiv:true, topic:'Cautarea binara: conditii, implementare, complexitate O(log n)'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia5-sortari-avansate.html', exists:false, intensiv:true, topic:'Sortari eficiente: quicksort/mergesort (divide et impera)'},
  {cls:'cls12', module:'m2-algoritmi-eficienti', file:'lectia6-optimizari.html', exists:false, intensiv:true, topic:'Tehnici de optimizare; alegerea structurii/algoritmului potrivit'},
  {cls:'cls12', module:'m3-web', file:'lectia1-html-css-review.html', exists:false, intensiv:false, topic:'Recapitulare HTML + CSS: structura pagina, stilizare. TIC/web.'},
  {cls:'cls12', module:'m3-web', file:'lectia2-responsive.html', exists:false, intensiv:false, topic:'Design responsive: media queries, layout flexibil. TIC/web.'},
  {cls:'cls12', module:'m3-web', file:'lectia3-javascript-intro.html', exists:false, intensiv:false, topic:'Introducere in JavaScript: variabile, functii, interactiune DOM. TIC/web.'},
  {cls:'cls12', module:'m3-web', file:'lectia4-proiect-web.html', exists:false, intensiv:false, topic:'Proiect web: pagina interactiva completa. TIC/web.'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia1-expresii-tipuri.html', exists:false, intensiv:true, topic:'BAC recap: expresii, tipuri, operatori, evaluare'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia2-structuri-control.html', exists:false, intensiv:true, topic:'BAC recap: structuri de control (if/for/while), urmarirea executiei'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia3-vectori-matrice.html', exists:false, intensiv:true, topic:'BAC recap: vectori si matrice, probleme tipice'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia4-recursivitate-master.html', exists:false, intensiv:true, topic:'BAC recap: recursivitate, probleme tipice'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia5-backtracking-complet.html', exists:false, intensiv:true, topic:'BAC recap: backtracking, probleme tipice'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia6-grafuri-complet.html', exists:false, intensiv:true, topic:'BAC recap: grafuri (DFS/BFS), probleme tipice'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia7-strategii-examen.html', exists:false, intensiv:true, topic:'Strategii pentru examenul de BAC la informatica: gestionarea timpului, abordare subiecte'},
  {cls:'cls12', module:'m-bac-prep', file:'lectia8-greseli-frecvente.html', exists:false, intensiv:true, topic:'Greseli frecvente la BAC informatica si cum sa le eviti'},
]

const lessons = ALL.filter(l => l.cls === TARGET_CLASS)

const BUILD_SCHEMA = {
  type: 'object', required: ['file','done','codeSnippets','honestNotes'],
  properties: {
    file: { type: 'string' }, done: { type: 'boolean' },
    action: { type: 'string', enum: ['created','improved','kept'] },
    codeSnippets: { type: 'array', items: { type: 'object', properties: { lang:{type:'string'}, ran:{type:'boolean'}, command:{type:'string'}, outputMatchesLesson:{type:'boolean'} } } },
    honestNotes: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' },
  },
}
const VERIFY_SCHEMA = {
  type: 'object', required: ['file','ok','issues'],
  properties: {
    file: { type: 'string' }, ok: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'object', required:['axis','severity','detail'], properties: {
      axis: { type:'string', enum:['conformitate-programa','cod-ruleaza','corectitudine-algoritmica','analogii-progresivitate','format'] },
      severity: { type:'string', enum:['high','medium','low'] }, detail: { type:'string' } } } },
  },
}
const FIX_SCHEMA = { type:'object', required:['file','fixed','remaining'], properties:{ file:{type:'string'}, fixed:{type:'boolean'}, remaining:{type:'array',items:{type:'string'}}, summary:{type:'string'} } }

function path(L){ return `${REPO}/content/liceu/mat-info/${L.cls}/${L.module}/${L.file}` }
function lessonId(L){ return `${L.cls}-${L.module}-${L.file.replace('.html','')}` }

function commonRules(L){
  return `SABLON de format (reprodu structura EXACT): ${TEMPLATE}
ORACOL programa (CE se preda, nivel, terminologie): ${ORACLE_JSON} -> nodul "mat-info" -> anul ${L.cls}. Context: ${ORACLE_MD}
Tema: ${L.topic}
NIVEL: ${L.intensiv ? 'mat-info intensiv permis (C++ + subiecte avansate OK; marcheaza vizibil sectiunile EXCLUSIV intensiv ca atare)' : 'TIC trunchi comun / conceptual: FARA cod de programare daca tema nu cere; concentrare pe concepte'}.
FORMAT obligatoriu (Format C Guided Atomic): <head> cu <link rel="stylesheet" href="../../../../../assets/css/lesson-atomic.css">, ZERO <style> inline. Ordine: nav-bar -> lesson-header(badge "Invatare Atomica" + titlu) -> progress-container -> section.lesson-frame(goal + learning-outcomes) -> section.try-section -> main#atomic-content cu 4-6 .atom (fiecare cu .atom-header[.atom-number+.atom-title] + .atom-content + data-quiz JSON VALID pe div.atom) -> section.practice-section cu 3 .practice-exercise (data-level minim/standard/performanta) -> section.review-section(summary-box + #lesson-summary + next-lesson).
COD: in <pre> cu span-uri .code-comment/.code-keyword/.code-function/.code-string/.code-number (ca lectia4/5 din m1). Python limbaj de baza; C++ doar la nivel intensiv.
SCRIPTURI la final IDENTIC ca sablonul; init cu ID-ul "${lessonId(L)}" (AtomicLearning/PracticeSimple/LessonSummary), Breadcrumb grade='${L.cls}' module='${L.module}', LearningProgress.init('${L.cls}','${L.module}','${L.file}').
nav/next: spre lectia anterioara/urmatoare din modul (vezi ${REPO}/content/liceu/mat-info/${L.cls}/${L.module}/index.html); ultima -> index.html.
RIGOARE STIINTIFICA (criteriu de done): pentru FIECARE fragment de cod, ruleaza-l efectiv -> Python: scrie temp .py si "python <tmp>.py"; C++: "g++ -std=c++17 <tmp>.cpp -o <tmp>.exe && <tmp>.exe". Output-ul afisat in lectie = output REAL observat. Cod care nu ruleaza/compileaza NU ramane in lectie. Sterge temp dupa (NICIODATA glob in tools/).
Complexitatea (O) declarata = cea reala. Afirmatii despre algoritmi adevarate. Progresiv. Quiz: raspuns corect variat (nu mereu aceeasi pozitie).
Analogii SIGURE: nicio analogie nu indeamna la actiuni nesigure (ex: NU "uita-te la piesele din interiorul calculatorului").
ANTI-COLIZIUNE: NU edita NICIUN .css/.js shared. Clasa lipsa -> honestNotes "<clasa> NEDEFINITA". Stil specific -> imposibil fara inline; foloseste clasele existente.`
}

phase('BuildOrImprove')
const results = await pipeline(
  lessons,
  (L) => {
    if (L.exists) {
      return agent(`Esti expert de continut Mat-Info (liceu). EVALUEAZA si IMBUNATATESTE o lectie EXISTENTA: ${path(L)}
${commonRules(L)}
Mai intai citeste lectia existenta si decide: e deja excelenta (riguroasa, completa, cod care ruleaza, format curat) sau are lipsuri?
- Daca e deja excelenta -> action="kept", modificari minime/zero.
- Daca are lipsuri (cod neverificat, continut subtire, format inconsistent, lipsuri fata de programa) -> IMBUNATATESTE-O (action="improved"): completeaza, ruleaza tot codul si pune output real, aliniaza la sablon. Pastreaza ID-urile si linkurile.
Editeaza cu Edit/Write. Raporteaza codeSnippets rulate + honestNotes.`, { label:`improve:${L.module}/${L.file}`, phase:'BuildOrImprove', schema:BUILD_SCHEMA, model:'sonnet' })
    }
    return agent(`Esti constructor de continut Mat-Info (liceu). Construieste O SINGURA lectie completa si riguroasa: ${path(L)}
PERCEIVE intai: citeste sablonul, oracolul (nodul anului ${L.cls}) si index.html al modulului.
${commonRules(L)}
Scrie fisierul cu Write. Raporteaza codeSnippets rulate (lang, comanda, output real = cel din lectie) + honestNotes. action="created".`, { label:`build:${L.module}/${L.file}`, phase:'BuildOrImprove', schema:BUILD_SCHEMA, model:'sonnet' })
  },
  (built, L) => {
    if (!built || !built.done) return { file:L.file, ok:false, issues:[{axis:'format',severity:'high',detail:'build/improve esuat'}], _L:L }
    return agent(`Verificator ADVERSARIAL independent. Incearca sa INVALIDEZI lectia: ${path(L)}
Tema declarata: ${L.topic}. ID asteptat: ${lessonId(L)}. Nivel: ${L.intensiv?'intensiv (C++ OK)':'TIC/conceptual (fara cod daca nu cere tema)'}.
Oracol: ${ORACLE_JSON} (nodul "mat-info" -> anul ${L.cls}) + ${ORACLE_MD}.
Raporteaza DOAR probleme reale (cu citat/linie) pe 5 axe:
 1. conformitate-programa: subiect corect pentru ${L.cls} si nivel? terminologie corecta?
 2. cod-ruleaza: ia FIECARE fragment de cod, ruleaza-l (python / g++ -std=c++17), compara output real cu cel afisat. Diferit/nu ruleaza -> high. Sterge temp dupa.
 3. corectitudine-algoritmica: complexitate (O) corecta? afirmatii despre algoritmi adevarate?
 4. analogii-progresivitate: analogii sigure? progresiv? data-quiz JSON valid si raspuns corect nu mereu pe aceeasi pozitie?
 5. format: Format C complet? lesson-atomic.css linkat, fara <style> inline? ID-uri init + LearningProgress corecte?
ok=true DOAR daca nu exista probleme high/medium.`, { label:`verify:${L.module}/${L.file}`, phase:'Verify', schema:VERIFY_SCHEMA }).then(v => ({...(v||{file:L.file,ok:false,issues:[{axis:'format',severity:'high',detail:'verificator picat'}]}), _L:L }))
  },
  (verdict, L) => {
    if (!verdict) return { file:L.file, fixed:false, remaining:['verdict null'] }
    const real = (verdict.issues||[]).filter(i => i.severity==='high' || i.severity==='medium')
    if (verdict.ok && real.length===0) return { file:L.file, fixed:true, remaining:[], summary:'fara probleme' }
    return agent(`Repara CHIRURGICAL lectia ${path(L)}. Probleme confirmate:
${real.map((i,n)=>`${n+1}. [${i.axis}/${i.severity}] ${i.detail}`).join('\n')}
Reguli: NU edita .css/.js shared. Daca repari cod, RE-RULEAZA-l (python/g++) si pune output real. Pastreaza formatul. Edit/Write. Raporteaza ce ai reparat si ce a ramas.`, { label:`fix:${L.module}/${L.file}`, phase:'Fix', schema:FIX_SCHEMA, model:'sonnet' })
  }
)

return { class: TARGET_CLASS, total: lessons.length, processed: results.filter(Boolean).length, details: results.filter(Boolean) }
