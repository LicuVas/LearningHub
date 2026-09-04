export const meta = {
  name: 'learninghub-sectiuni-lipsa',
  description: 'Completeaza cele 4 lectii carora le lipsesc exercitiile si/sau recapitularea',
  phases: [
    { title: 'Completeaza', detail: 'un agent pe lectie' },
    { title: 'Verifica', detail: 'poarta mecanica + citire' },
  ],
}

const REPO = 'C:/00/Projects/LearningHub/'
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const PIO = 'C:/00/Projects/LearningHub/tools/practice_io.py'

const LECTII = [
  { cale: 'content/tic/cls5/extra-birotice-cls7/lectia7-audio-video.html',
    lipsa: 'practica si recapitulare',
    sora: 'content/tic/cls5/extra-birotice-cls7/lectia6-proiect.html' },
  { cale: 'content/tic/cls5/extra-birotice-cls7/lectia8-colaborative.html',
    lipsa: 'practica si recapitulare',
    sora: 'content/tic/cls5/extra-birotice-cls7/lectia6-proiect.html' },
  { cale: 'content/tic/cls5/extra-birotice-cls7/lectia9-programare.html',
    lipsa: 'practica si recapitulare',
    sora: 'content/tic/cls5/extra-birotice-cls7/lectia6-proiect.html' },
  { cale: 'content/tic/cls7/m3-algoritmi-schema/lectia9-geografie.html',
    lipsa: 'practica',
    sora: 'content/tic/cls7/m3-algoritmi-schema/lectia8-fizica.html' },
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'adaugat', 'exercitii', 'nota'],
  properties: {
    fisier: { type: 'string' },
    adaugat: { type: 'string' },
    exercitii: { type: 'integer' },
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

phase('Completeaza')
log('Completez ' + LECTII.length + ' lectii carora le lipsesc sectiuni intregi din formatul lectiei.')

const rez = await pipeline(
  LECTII,
  (L) => agent(
    'Esti profesor de T.I.C. O lectie de pe situl scolii e incompleta: ii lipseste ' + L.lipsa + '.\n' +
    'Toate celelalte 506 lectii ale sitului au cinci parti: cadrul, obiectivul, atomii de invatare, ' +
    'EXERCITIILE si RECAPITULAREA. Elevul care ajunge aici nu are ce lucra si nu are ce recapitula.\n\n' +
    'LECTIA DE COMPLETAT: ' + REPO + L.cale + '\n' +
    'LECTIA-SORA (are structura completa, foloseste-o ca tipar exact): ' + REPO + L.sora + '\n\n' +
    'PASUL 1 - citeste AMBELE fisiere. Din lectia-sora ia forma exacta a sectiunilor care lipsesc: ' +
    'numele claselor CSS, ordinea elementelor, unde se aseaza in pagina, ce scripturi le pun in miscare. ' +
    'Din lectia de completat ia SUBIECTUL - ce se preda de fapt in cei 5-6 atomi.\n\n' +
    'PASUL 2 - scrie sectiunile lipsa, cu Edit sau Write, respectand tiparul surorii:\n' +
    '  EXERCITII: trei exercitii, pe trei niveluri - minim, standard, performanta - exact ca la sora. ' +
    'Fiecare cere ceva ce se PREDA in aceasta lectie, nimic peste. Fiecare primeste si o rezolvare model ' +
    'in <details class="practice-solution"><summary>Vezi rezolvarea</summary><div class="practice-solution-body">...</div></details> ' +
    'la finalul exercitiului (la nivelul performanta: doar schita de rezolvare si criteriile, nu produsul de-a gata).\n' +
    '  RECAPITULARE: caseta "Ce ai invatat astazi" cu 5-7 puncte scoase din atomii REALI ai lectiei ' +
    '(nu inventate), plus blocul de trecere la lectia urmatoare, cu legatura corecta catre fisierul care ' +
    'chiar exista in folder (verifica cu ls).\n\n' +
    'REGULI:\n' +
    '1. Romana FARA diacritice, ca in restul sitului.\n' +
    '2. Nu atinge atomii existenti si nu schimba chestionarele.\n' +
    '3. Nu inventa: fiecare punct de recapitulare trebuie sa se regaseasca in continutul lectiei.\n' +
    '4. Daca lectia-sora foloseste un script pe care aceasta lectie nu-l incarca (practice-simple.js, ' +
    'lesson-summary.js), adauga-l cu aceeasi cale relativa, si initializeaza-l ca la sora, ' +
    'cu cheia de progres a ACESTEI lectii (nu a surorii - altfel isi suprascriu progresul).\n\n' +
    'PASUL 3 - verifica-te singur:\n' +
    'python "' + POARTA + '" "' + L.cale + '"\n' +
    'python "' + PIO + '" dump "' + L.cale + '"\n' +
    'Poarta iese cu 0 doar daca lectia e intreaga si legata. Repara ce semnaleaza, apoi ruleaz-o din nou.\n' +
    'Poarta se va plange si de cheia de progres duplicata daca ai copiat-o pe a surorii - e o eroare reala, repar-o.\n\n' +
    'Raporteaza ce ai adaugat, cate exercitii, si orice nu ai putut face.',
    { label: 'completez:' + L.cale.split('/').slice(-1), phase: 'Completeaza', schema: R_SCHEMA }
  ),
  (r, L) => agent(
    'Verifica o lectie scolara careia tocmai i s-au adaugat sectiunile lipsa (' + L.lipsa + ').\n\n' +
    'LECTIA: ' + REPO + L.cale + '\n' +
    'SORA (tiparul corect): ' + REPO + L.sora + '\n\n' +
    'Ruleaza intai poarta mecanica:\n' +
    'python "' + POARTA + '" "' + L.cale + '"\n\n' +
    'Apoi citeste si raspunde la:\n' +
    '1. Exercitiile cer ceva ce se preda CHIAR IN ACEASTA lectie, sau ceva nepredat?\n' +
    '2. Rezolvarile model sunt corecte de fond (pasi care functioneaza, valori reale)?\n' +
    '3. Punctele din recapitulare se regasesc chiar in atomii lectiei, sau sunt inventate?\n' +
    '4. Legatura catre lectia urmatoare duce la un fisier care exista?\n' +
    '5. Cheia de progres e a acestei lectii, nu copiata de la sora?\n\n' +
    'Raporteaza CURAT sau PROBLEME cu lista exacta. Nu semnala stil.',
    { label: 'verif:' + L.cale.split('/').slice(-1), phase: 'Verifica', schema: V_SCHEMA }
  ).then(v => ({ L, r, v }))
)

const bune = rez.filter(Boolean)
const cuProbleme = bune.filter(x => x.v && x.v.verdict === 'PROBLEME')
log('Completate: ' + bune.length + '. Cu probleme ramase: ' + cuProbleme.length + '.')

return {
  completate: bune.length,
  exercitii: bune.reduce((a, x) => a + ((x.r && x.r.exercitii) || 0), 0),
  probleme: cuProbleme.map(x => ({ fisier: x.L.cale, probleme: x.v.probleme })),
  note: bune.filter(x => x.r && x.r.nota && x.r.nota.length > 40).map(x => ({ fisier: x.L.cale, nota: x.r.nota })),
}
