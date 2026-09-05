export const meta = {
  name: 'learninghub-sloturi-gresite-matinfo',
  description: 'Rescrie cele 24 de lectii care predau alt subiect decat slotul lor de programa',
  phases: [
    { title: 'Rescrie', detail: '24 de lectii, un agent pe lectie, cu profiluri-etalon ca reper' },
    { title: 'Verifica', detail: 'chiar preda subiectul cerut, si e corect' },
  ],
}

const REPO = 'C:/00/Projects/LearningHub/'
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'
const LECTII = [{"cale": "content/liceu/mat-info/cls12/m2-algoritmi-eficienti/lectia1-matrice-avansate.html", "acum": "Algoritmi de clasificare in Machine Learning (k-NN, arbore de decizie, sklearn, matrice de confuzie)", "trebuie": "Operatii avansate cu matrice, nivel bacalaureat: inmultirea matricelor, parcurgere in spirala, zone speciale, bordare", "etaloane": ["content/liceu/mat-info/cls12/m2-algoritmi-eficienti/lectia2-factorial-factorizare.html", "content/liceu/mat-info/cls12/m2-algoritmi-eficienti/lectia3-complexitate.html"], "majoritate": "cartonasul din index.html-ul modulului promite exact 'Operatii avansate matrice / Bac / Inmultire matrice, spirala, zona speciala, bordare'; surorile din modul (lectia2 factorizare, lectia3 complexitate) sunt toate pe algoritmica de bac, nu pe ML", "atentie": "Subiect de BACALAUREAT care nu se preda nicaieri in profilul mat-info. Continutul actual (ML) e bun in sine, dar e in afara programei clasei a XII-a - de pastrat separat daca se doreste, nu de aruncat. NU exista profil-frate: etaloanele dau FORMA si adancimea de bac a modulului, nu subiectul. Subiectul vine din cartonasul index.html.", "prioritate": "MARE - competenta de bacalaureat lipsa"}, {"cale": "content/liceu/mat-info/cls12/m3-web/lectia1-html-css-review.html", "acum": "Baze de date relationale si SQL (SELECT, JOIN, normalizare 1NF-3NF)", "trebuie": "HTML/CSS recapitulare: structura paginii, selectori, box model, layout", "etaloane": ["content/liceu/mat-info/cls12/m3-web/lectia2-responsive.html", "content/liceu/mat-info/cls12/m3-web/lectia3-javascript-intro.html"], "majoritate": "cartonasul din index.html promite 'HTML/CSS Recapitulare - Structura pagini, selectori, box model, layout'; lectia2 (design responsive) si lectia3 (JavaScript) presupun recapitularea asta ca fiind facuta", "atentie": "Fara ea, modulul de web incepe direct cu design responsive, peste o recapitulare care nu s-a facut. Continutul SQL actual e bun in sine si nu se preda in alt loc - de pastrat separat. NU exista un profil-frate cu aceasta lectie facuta corect (mat-info e unic): etaloanele de mai sus dau FORMA si adancimea modulului, nu subiectul. Subiectul vine din cartonasul index.html si din ce presupun lectiile 2-4.", "prioritate": "MARE - lectia pe care se sprijina restul modulului"}]


const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'rescris', 'subiect', 'atomi', 'intrebari', 'nota'],
  properties: {
    fisier: { type: 'string' },
    rescris: { type: 'boolean' },
    subiect: { type: 'string' },
    atomi: { type: 'integer' },
    intrebari: { type: 'integer' },
    nota: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['verdict', 'probleme'],
  properties: {
    verdict: { type: 'string', enum: ['CURAT', 'PROBLEME'] },
    probleme: { type: 'array', items: { type: 'string' } },
  },
}

phase('Rescrie')
log('Rescriu ' + LECTII.length + ' lectii asezate gresit. Dovada vine din celelalte profiluri, nu dintr-o parere.')

const rez = await pipeline(
  LECTII,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. si repari o lectie de pe situl scolii care preda ALT SUBIECT decat ii cere slotul.\n\n' +
    'CE S-A INTAMPLAT: lectiile au fost generate pe loturi, cu numele fisierelor fixate inainte de continut. ' +
    'Agentul care a scris aceasta lectie n-a stiut ce predau vecinele ei si a scris altceva. ' +
    'Lectia, citita singura, e buna - dar nu e lectia care trebuia sa fie aici.\n\n' +
    'FISIERUL: ' + REPO + L.cale + '\n' +
    'PREDA ACUM   : ' + L.acum + '\n' +
    'TREBUIE SA PREDEA: ' + L.trebuie + '\n' +
    'DOVADA       : ' + L.majoritate + '\n' +
    (L.atentie ? 'DE STIUT     : ' + L.atentie + '\n' : '') +
    (L.prioritate ? 'PRIORITATE   : ' + L.prioritate + '\n' : '') +
    '\nPROFILURI-ETALON (aceeasi lectie, facuta corect in alte profiluri - citeste-le INTAI):\n' +
    L.etaloane.map(e => '  ' + REPO + e).join('\n') + '\n\n' +
    'PASUL 1 - citeste etaloanele si fisierul de reparat.\n' +
    'Pentru continut pe scurt: python "' + DIGEST + '" "<folderul lectiei>"\n' +
    'Din etaloane iei: ce subiecte intra in lectie, cat de adanc se merge, ce tip de exercitii se dau.\n' +
    'Din fisierul de reparat iei: forma exacta (clase CSS, structura atomilor, scripturi, cheia de progres, ' +
    'firimiturile de navigare, legaturile inainte/inapoi).\n\n' +
    'PASUL 2 - citeste si cartonasul din index.html-ul modulului: ce i se promite elevului.\n' +
    'Daca cartonasul promite altceva decat "' + L.trebuie + '", spune-mi in nota - nu-l schimba singur.\n\n' +
    'PASUL 3 - rescrie continutul pedagogic al lectiei:\n' +
    '  - titlul paginii (<title>), <h1>, obiectivul si competentele vizate\n' +
    '  - cei 5-6 atomi de invatare, cu chestionarul fiecaruia\n' +
    '  - exercitiile pe trei niveluri (minim / standard / performanta), fiecare cu rezolvare model in\n' +
    '    <details class="practice-solution"><summary>Vezi rezolvarea</summary><div class="practice-solution-body">...</div></details>\n' +
    '  - caseta de recapitulare "Ce ai invatat astazi"\n' +
    '  - numele lectiei din configurarea firimiturilor (Breadcrumb.init)\n\n' +
    'NU ATINGE, sub nicio forma:\n' +
    '  - numele fisierului, calea, cheia de progres din AtomicLearning/PracticeSimple/LessonSummary.init\n' +
    '  - caile catre scripturi si stiluri (au adancime relativa exacta)\n' +
    '  - legaturile inainte/inapoi catre lectiile vecine\n\n' +
    'ADAPTEAZA LA PROFIL. Etalonul iti da subiectul si adancimea, nu exemplele: profilul ' + L.cale.split('/')[2] +
    ' cere exemple din lumea lui. Nu copia exemplele etalonului cuvant cu cuvant.\n\n' +
    'REGULI DE FOND:\n' +
    '1. Tot ce afirmi trebuie sa fie ADEVARAT: functii care exista, scurtaturi reale, cifre verificabile.\n' +
    '2. Chestionarele: 4 variante de lungime apropiata (±20% fata de medie) - varianta corecta NU are voie ' +
    'sa fie cea mai lunga, altfel se ghiceste. Distractorii sunt greseli pe care un elev chiar le face, ' +
    'nu absurditati. Indiciul explica CONTINUTUL, niciodata litera (motorul amesteca variantele la fiecare afisare).\n' +
    '3. Exercitiile cer doar ce s-a predat in ACEASTA lectie.\n' +
    '4. Exemplul INAINTE de definitie, in fiecare atom introductiv.\n' +
    '5. Romana FARA diacritice, ca in restul sitului.\n' +
    '6. data-quiz e o LISTA JSON, iar "correct" e o singura litera. Un obiect in loc de lista omoara toata pagina.\n\n' +
    'PASUL 4 - verifica-te:\n' +
    'python "' + POARTA + '" "' + L.cale + '"      (iese cu 0 doar daca lectia e intreaga si legata)\n' +
    'python "' + QIO + '" dump "' + L.cale + '"    (arata fiecare intrebare, cheia si lungimile)\n' +
    'Repara ce semnaleaza si ruleaza din nou.\n\n' +
    'Raporteaza: subiectul nou, cati atomi, cate intrebari, si orice nu ai putut face.',
    { label: 'rescriu:' + L.cale.split('/').slice(2, 3) + '/' + L.cale.split('/').slice(-1), phase: 'Rescrie', model: 'opus', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.rescris) return { L, r, v: null }
    return agent(
      'Esti profesor corector, exigent. O lectie tocmai a fost rescrisa fiindca preda alt subiect decat ii cerea slotul.\n\n' +
      'LECTIA: ' + REPO + L.cale + '\n' +
      'TREBUIA SA PREDEA: ' + L.trebuie + '\n' +
      'ETALON (aceeasi lectie, alt profil): ' + REPO + L.etaloane[0] + '\n\n' +
      'Ruleaza intai poarta mecanica: python "' + POARTA + '" "' + L.cale + '"\n\n' +
      'Apoi citeste si raspunde, in ordinea gravitatii:\n' +
      '1. Preda ACUM subiectul cerut, sau a ramas ceva din subiectul vechi ("' + L.acum + '")?\n' +
      '2. Contine ceva FALS? Functii inexistente, scurtaturi inventate, cifre gresite.\n' +
      '3. Chestionarele: cheia e corecta la fiecare intrebare? Varianta corecta e vizibil mai lunga decat celelalte ' +
      '(atunci se ghiceste)? Indiciul numeste vreo litera?\n' +
      '4. Exercitiile cer ceva ce NU s-a predat in aceasta lectie?\n' +
      '5. E o copie a etalonului cu alte cuvinte, sau e adaptata profilului?\n\n' +
      'Nu semnala stil sau lungime. Raporteaza CURAT sau PROBLEME cu lista exacta.',
      { label: 'verif:' + L.cale.split('/').slice(-1), phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, v }))
  }
)

const bune = rez.filter(Boolean)
const rescrise = bune.filter(x => x.r && x.r.rescris)
const cuProbleme = bune.filter(x => x.v && x.v.verdict === 'PROBLEME')
log('Rescrise: ' + rescrise.length + ' din ' + LECTII.length + '. Cu probleme ramase: ' + cuProbleme.length + '.')

return {
  planificate: LECTII.length,
  rescrise: rescrise.length,
  nerescrise: bune.filter(x => x.r && !x.r.rescris).map(x => ({ fisier: x.L.cale, nota: x.r.nota })),
  probleme: cuProbleme.map(x => ({ fisier: x.L.cale, probleme: x.v.probleme })),
  note: rescrise.filter(x => x.r.nota && x.r.nota.length > 50).map(x => ({ fisier: x.L.cale, nota: x.r.nota })),
}
