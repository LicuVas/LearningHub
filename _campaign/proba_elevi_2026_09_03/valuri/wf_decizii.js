export const meta = {
  name: 'learninghub-decizii-05-09',
  description: 'Doua reparatii decise pe 05.09: lectia 4 de clasa a V-a devine introducerea in prezentari, iar tutorialul de publicare primeste chestionare',
  phases: [
    { title: 'Repara', detail: '2 lectii, un agent pe lectie' },
    { title: 'Verifica', detail: 'poarta trece si continutul e ce trebuie' },
  ],
}

// DECIZIILE si de ce (05.09.2026):
//  1. tic/cls5/extra-siguranta-backup/lectia4-prezentari-intro.html preda CYBERBULLYING,
//     desi cartonasul din index promite "Prima mea prezentare - Deschid PowerPoint si
//     creez primul slide", iar lectia 5 preda DESIGN de prezentari peste o introducere
//     care nu exista. Verificat inainte de a decide: cyberbullying-ul se preda DEJA in
//     alte doua lectii de clasa a V-a (m2-grafice-internet/lectia5-siguranta-online, 18
//     mentiuni; extra-siguranta-backup/lectia1-internet-sigur, 14) - deci rescriind
//     lectia 4 nu se pierde competenta, se repara promisiunea. Textul vechi ramane in git.
//  2. tic/cls8/.../tutorial-github-netlify.html are 5 atomi si 3 exercitii, dar ZERO
//     intrebari. E singura lectie de pe sit fara chestionar. Primeste cate o intrebare
//     pe atom si devine lectie intreaga.
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'
const REPO = 'C:/00/Projects/LearningHub/'

const SARCINI = [
  {
    cale: 'content/tic/cls5/extra-siguranta-backup/lectia4-prezentari-intro.html',
    titlu: 'Prima mea prezentare',
    ce: 'Lectia preda acum "Cyberbullying si comportament online", desi cartonasul din index.html-ul modulului promite "Prima mea prezentare - Deschid PowerPoint si creez primul slide", iar lectia urmatoare (lectia5-prezentari-design.html) preda design si animatii de prezentare - adica se sprijina pe o introducere care nu exista. Rescrie lectia ca INTRODUCERE IN PREZENTARI pentru clasa a V-a.\n\n' +
      'CE TREBUIE SA PREDEA: ce este o prezentare si cand se foloseste; fereastra programului (PowerPoint sau Impress) si ce e un slide; adaugarea unui slide nou si alegerea unui aspect (layout); scrierea titlului si a textului in casete; salvarea fisierului si rularea prezentarii (F5 / Slide Show). Nivelul: clasa a V-a, primul contact - pas cu pas, cu ce se vede pe ecran.\n\n' +
      'NU intra aici (se predau in lectia 5): teme, tranzitii, animatii, design avansat. Lectia 4 il aduce pe elev pana la "am un slide cu titlu si text, salvat, care ruleaza".\n\n' +
      'ATENTIE la continutul vechi: cyberbullying-ul NU se pierde din materie - se preda deja in m2-grafice-internet/lectia5-siguranta-online.html si in extra-siguranta-backup/lectia1-internet-sigur.html din aceeasi clasa. Nu incerca sa-l pastrezi in lectia asta.',
  },
  {
    cale: 'content/tic/cls8/extra-materiale-suplimentare/tutorial-github-netlify.html',
    titlu: 'Cum publici un site (chestionare)',
    ce: 'Lectia are 5 atomi buni (doua metode de publicare, Netlify Drop, GitHub Pages, probleme frecvente, resurse) si 3 exercitii, dar ZERO chestionare - e singura lectie de pe sit fara niciunul. Adauga cate UN chestionar la fiecare atom care are continut de verificat.\n\n' +
      'NU rescrie atomii si nu schimba explicatiile - continutul e bun. Adauga doar chestionarele, in forma pe care o citeste motorul: atributul data-quiz pe elementul <div class="atom" ...>, cu o LISTA JSON, plus un container gol <div class="atom-quiz"></div> in interiorul atomului.\n\n' +
      'Vezi forma exacta la o lectie care merge:\n' +
      'grep -o \'<div class="atom" data-quiz=.\\{0,400\\}\' "' + REPO + 'content/tic/cls7/m2-word-avansat/lectia1-liste.html" | head -1',
  },
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'gata', 'nota'],
  properties: { fisier: { type: 'string' }, gata: { type: 'boolean' }, nota: { type: 'string' } },
}

const V_SCHEMA = {
  type: 'object',
  required: ['verdict', 'probleme'],
  properties: {
    verdict: { type: 'string', enum: ['CURAT', 'PROBLEME'] },
    probleme: { type: 'array', items: { type: 'string' } },
  },
}

phase('Repara')
log('Aplic cele doua decizii, pe ' + SARCINI.length + ' lectii.')

const rez = await pipeline(
  SARCINI,
  (S) => agent(
    'Esti profesor de Informatica/T.I.C. Repari o lectie de pe situl scolii.\n\n' +
    'LECTIA: ' + REPO + S.cale + '\n' +
    'CE TREBUIE FACUT:\n' + S.ce + '\n\n' +
    'PASUL 1 - citeste lectia si vecinele ei:\n' +
    'python "' + DIGEST + '" "' + S.cale.split('/').slice(0, -1).join('/') + '"\n' +
    'Uita-te si la cartonasul din index.html-ul modulului: ce i se promite elevului.\n\n' +
    'PASUL 2 - scrie, pastrand FORMA exacta a lectiei (clase CSS, structura atomilor, sectiuni).\n' +
    'Reguli:\n' +
    '1. Chestionarele: 4 variante de lungime apropiata (+/-20% fata de medie); varianta corecta NU are voie sa fie cea mai lunga. Distractorii sunt greseli pe care un elev chiar le face. Indiciul explica CONTINUTUL, niciodata litera - motorul amesteca variantele la fiecare afisare.\n' +
    '2. Cheia corecta sa NU cada mereu pe aceeasi litera in toata lectia.\n' +
    '3. data-quiz e o LISTA JSON, iar "correct" e o singura litera. Un obiect in loc de lista omoara toata pagina.\n' +
    '4. Tot ce afirmi trebuie sa fie ADEVARAT: meniuri care exista, scurtaturi reale (F5 chiar porneste prezentarea), pasi care se pot urma.\n' +
    '5. Exercitiile cer doar ce s-a predat in ACEASTA lectie, si fiecare are rezolvare model in <details class="practice-solution"><summary>Vezi rezolvarea</summary><div class="practice-solution-body">...</div></details>.\n' +
    '6. Romana FARA diacritice, ca in restul sitului.\n\n' +
    'NU ATINGE: numele fisierului, calea, caile catre scripturi, legaturile inainte/inapoi.\n' +
    'Cheia de progres: daca ai schimbat SUBIECTUL lectiei, actualizeaz-o ca sa numeasca subiectul nou (progresul vechi e pe alta lectie, nu trebuie pastrat). Daca ai adaugat doar chestionare, LAS-O cum e.\n\n' +
    'PASUL 3 - verifica-te, intr-un singur apel Bash:\n' +
    'python "' + POARTA + '" "' + S.cale + '" && python "' + QIO + '" dump "' + S.cale + '"\n' +
    'Poarta trebuie sa iasa cu OK. Repara ce semnaleaza si ruleaza din nou.\n\n' +
    'Raporteaza ce ai facut si orice n-ai putut face.',
    { label: 'decizie:' + S.cale.split('/').slice(-1), phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, S) => {
    if (!r || !r.gata) return { S, r, v: null }
    return agent(
      'Esti profesor corector. O lectie tocmai a fost reparata. Verifica.\n\n' +
      'LECTIA: ' + REPO + S.cale + '\n' +
      'CE TREBUIA FACUT:\n' + S.ce + '\n\n' +
      'Ruleaza intai: python "' + POARTA + '" "' + S.cale + '" && python "' + QIO + '" dump "' + S.cale + '"\n' +
      'Apoi verifica, in ordinea gravitatii:\n' +
      '1. Preda ACUM ce trebuia? A ramas ceva din subiectul vechi?\n' +
      '2. Contine ceva FALS? Meniuri sau scurtaturi care nu exista, pasi care nu functioneaza.\n' +
      '3. Chestionarele: cheia e corecta la fiecare intrebare? Varianta corecta e vizibil mai lunga? Indiciul numeste vreo litera? Cheile cad toate pe aceeasi litera?\n' +
      '4. Exercitiile cer ceva NEpredat in aceasta lectie?\n\n' +
      'Nu semnala stil sau lungime. Raporteaza CURAT sau PROBLEME cu lista exacta.',
      { label: 'verif-decizie:' + S.cale.split('/').slice(-1), phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ S, r, v }))
  }
)

const bune = rez.filter(Boolean)
const gata = bune.filter(x => x.r && x.r.gata)
const cuProbleme = bune.filter(x => x.v && x.v.verdict === 'PROBLEME')
log('Gata: ' + gata.length + ' din ' + SARCINI.length + '. Cu probleme: ' + cuProbleme.length + '.')

return {
  planificate: SARCINI.length,
  gata: gata.length,
  probleme: cuProbleme.map(x => ({ fisier: x.S.cale, probleme: x.v.probleme })),
  note: bune.map(x => ({ fisier: x.S.cale, nota: x.r ? x.r.nota : '(fara raport)' })),
}
