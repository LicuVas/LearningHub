export const meta = {
  name: 'learninghub-aprofundare',
  description: 'Adauga caseta "Vrei mai mult?" la lectiile care n-au nicio iesire in sus pentru elevul bun',
  phases: [
    { title: 'Scrie', detail: 'un agent pe lectie' },
    { title: 'Verifica', detail: 'chiar e mai mult, si e corect' },
  ],
}

const REPO = 'C:/00/Projects/LearningHub/'
const DIO = 'C:/00/Projects/LearningHub/tools/depth_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'
const TOATE_RAW = __LISTA__

const TOATE = TOATE_RAW.map((cale, i) => ({ i, cale }))
// Plafon de 1000 de agenti pe rulare, 2 etape pe lectie => doua jumatati disjuncte.
const PARTE = (args && args.parte) || 1
const MIJLOC = Math.ceil(TOATE.length / 2)
const FISIERE = PARTE === 1 ? TOATE.slice(0, MIJLOC) : TOATE.slice(MIJLOC)

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'scris', 'motiv'],
  properties: {
    fisier: { type: 'string' },
    scris: { type: 'boolean' },
    motiv: { type: 'string' },
    rezumat: { type: 'string' },
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

phase('Scrie')
log('Partea ' + PARTE + ': scriu caseta de aprofundare la ' + FISIERE.length + ' lectii din ' + TOATE.length + '.')

const rez = await pipeline(
  FISIERE,
  (f) => agent(
    'Esti profesor de Informatica/T.I.C. Scrii caseta "Vrei mai mult?" pentru finalul unei lectii.\n\n' +
    'DE CE: pe tot situl nu exista NICIO lectie cu ceva peste minimul obligatoriu. Elevul bun termina in 10 minute si se plictiseste. Caseta asta e singura lui iesire in sus.\n\n' +
    'LECTIA: ' + f.cale + '\n\n' +
    'PASUL 1 - vezi ce contine lectia:\n' +
    'python "' + DIO + '" dump "' + f.cale + '"\n' +
    'Iti da titlul, obiectivul, titlurile atomilor si punctele din recapitulare.\n' +
    'Pentru continutul propriu-zis: python "' + DIGEST + '" "' + f.cale.split('/').slice(0, -1).join('/') + '"\n\n' +
    'PASUL 2 - scrie 3 elemente, in ordinea asta:\n' +
    '  a) O PROVOCARE practica - ceva de facut, nu de citit. Concreta, verificabila, care porneste de unde s-a oprit lectia. Nu "exerseaza mai mult".\n' +
    '  b) O INTREBARE DE GANDIT - de tipul "de ce", care sa duca la mecanismul din spate, nu la o definitie. Nu ii da raspunsul.\n' +
    '  c) O DESCHIDERE - unde se foloseste asta in lumea reala, sau ce urmeaza dupa lectia asta in materie. Doua-trei propozitii, concret, cu un exemplu real.\n\n' +
    'REGULI DE FOND:\n' +
    '1. Trebuie sa fie MAI MULT decat lectia, nu o repetare cu alte cuvinte. Daca cineva care a citit lectia nu invata nimic nou din caseta, ai gresit.\n' +
    '2. Tot ce afirmi trebuie sa fie ADEVARAT: functii care exista, cifre care se verifica, exemple reale. Nu inventa.\n' +
    '3. LEGATURI: cel mai bine NICIUNA. Unealta REFUZA orice legatura pe care n-o poate dovedi. Daca vrei totusi una: fie catre un fisier care exista chiar in folderul lectiei (verifica intai cu ls), fie catre ro.wikipedia.org / developer.mozilla.org / w3schools.com / docs.python.org / pbinfo.ro / support.microsoft.com. Orice altceva e refuzat.\n' +
    '4. Romana FARA diacritice. HTML simplu: <p>, <ul>, <li>, <strong>, <code>, <a>. NICIODATA <script>, <style>, <iframe>, <form>.\n' +
    '5. Lungime: intre 200 si 1600 de caractere. E o usa, nu inca o lectie.\n\n' +
    'PASUL 3 - scrie un JSON {"corp": "<p>...</p><ul><li>...</li></ul>"} si aplica-l:\n' +
    'python "' + DIO + '" apply "' + f.cale + '" <calea-json>\n' +
    'Daca refuza, citeste motivul si corecteaza - nu forta.\n\n' +
    'PASUL 4 - confirma cu dump ca are_caseta e true.\n\n' +
    'Raporteaza daca s-a scris, motivul exact daca nu, si un rezumat de o fraza al provocarii.',
    { label: 'aprofundare:' + f.cale.split('/').slice(-2).join('/'), phase: 'Scrie', model: 'sonnet', schema: R_SCHEMA }
  ),
  (r, f) => {
    if (!r || !r.scris) return { f, r, verificare: null }
    return agent(
      'Esti profesor corector, exigent. Cineva a adaugat la finalul unei lectii o caseta "Vrei mai mult?" pentru elevul bun. Verifica-o.\n\n' +
      'LECTIA: ' + REPO + f.cale + '\n' +
      'Citeste lectia si caseta (caut-o dupa class="depth-box").\n\n' +
      'Trei intrebari, in ordinea gravitatii:\n' +
      '1. Contine ceva FALS? Functii care nu exista, cifre gresite, afirmatii inventate despre lumea reala. Asta e singurul lucru grav.\n' +
      '2. Chiar e MAI MULT decat lectia, sau doar repeta cu alte cuvinte ce scrie deja in recapitulare?\n' +
      '3. Intrebarea de gandit isi da singura raspunsul in text?\n\n' +
      'Nu semnala stil, ton sau lungime. Raporteaza CURAT sau PROBLEME cu lista exacta.',
      { label: 'verif:' + f.cale.split('/').slice(-1), phase: 'Verifica', schema: V_SCHEMA }
    ).then(v => ({ f, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const scrise = bune.filter(x => x.r && x.r.scris)
const refuzate = bune.filter(x => x.r && !x.r.scris)
const cuProbleme = bune.filter(x => x.verificare && x.verificare.verdict === 'PROBLEME')

log('Casete scrise: ' + scrise.length + '. Refuzate de unealta: ' + refuzate.length + '. Cu probleme de fond: ' + cuProbleme.length + '.')

return {
  parte: PARTE,
  lectii_planificate: FISIERE.length,
  scrise: scrise.length,
  refuzate: refuzate.map(x => ({ fisier: x.f.cale, motiv: x.r.motiv })),
  cu_probleme: cuProbleme.map(x => ({ fisier: x.f.cale, probleme: x.verificare.probleme })),
}
