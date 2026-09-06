# -*- coding: utf-8 -*-
"""Genereaza wf_cls9.js: scrie continutul celor 29 de lectii de clasa a IX-a."""
import io, os, json, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import toate_lectiile, MODULE

R = r"C:\00\Projects\LearningHub"
L = list(toate_lectiile())
for x in L:
    x.pop("din", None)

js = r"""export const meta = {
  name: 'learninghub-cls9-artistic',
  description: 'Scrie materia de clasa a IX-a (profil artistic) pe programa aprobata: 29 de lectii in 3 module',
  phases: [
    { title: 'Scrie', detail: '29 de lectii, un agent pe lectie' },
    { title: 'Verifica', detail: 'preda ce cere programa, e adevarat, si nu a ramas nimic din sablon' },
  ],
}

// Materia pentru orele 9A si 9M de la Liceul de Arte "Victor Brauner".
// Programa APROBATA: Anexa 22 la OMEC 6.930/19.12.2025 - T.I.C. clasa a IX-a,
// trunchi comun, toate filierele si profilurile. Se aplica din 2026-2027.
// Textul aprobat (PDF scanat, trecut prin OCR) e pe disc si agentii il citesc:
//   C:/00/AI_0/knowledge/curriculum_liceu/TIC_IX_Anexa22_OMEC6930_2025_ocr.txt
//
// Fisierele EXISTA deja, cu instalatia corecta (cai, chei de progres, navigare)
// generata mecanic de schela.py. Continutul lor e inca al lectiei-sablon si trebuie
// inlocuit integral - de aceea fiecare fisier are un comentariu care incepe cu SCHELA.
const REPO = 'C:/00/Projects/LearningHub/'
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const PROGRAMA = 'C:/00/AI_0/knowledge/curriculum_liceu/TIC_IX_Anexa22_OMEC6930_2025_ocr.txt'
const SABLON = 'C:/00/Projects/LearningHub/content/liceu/artistic/cls9/m1-tic-baze/lectia1-sisteme-calcul.html'

const LECTII = __LECTII__

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'scris', 'atomi', 'intrebari', 'nota'],
  properties: {
    fisier: { type: 'string' },
    scris: { type: 'boolean' },
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

phase('Scrie')
log('Scriu ' + LECTII.length + ' lectii de clasa a IX-a, pe programa aprobata.')

const rez = await pipeline(
  LECTII,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. si scrii o lectie NOUA pentru clasa a IX-a, la un liceu de ARTE.\n\n' +
    'CONTEXTUL: din 2026-2027 clasa a IX-a intra pe programa noua. Fisierul exista deja, cu instalatia corecta (cai, chei de progres, navigare), dar continutul lui e inca al unei lectii-sablon despre componentele sistemului de calcul. Il inlocuiesti INTEGRAL.\n\n' +
    'FISIERUL: ' + REPO + L.cale + '\n' +
    'TITLUL LECTIEI: ' + L.titlu + '\n' +
    'Lectia ' + L.nr + ' din modulul "' + L.modul_titlu + '"\n\n' +
    'CE CERE PROGRAMA, exact (copiat din anexa aprobata):\n' + L.continut + '\n' +
    'Domeniul: ' + L.domeniu + '\n\n' +
    'PASUL 1 - citeste programa si sablonul:\n' +
    'grep -n -A 12 -i "' + L.ancora + '" "' + PROGRAMA + '" | head -60\n' +
    'Programa e text obtinut prin OCR dintr-un PDF scanat: literele pot fi stalcite pe alocuri (de exemplu "hitps" in loc de "https"). Citeste sensul, nu ortografia.\n' +
    'Ca sa vezi FORMA pe care trebuie s-o pastrezi, deschide sablonul: ' + SABLON + '\n\n' +
    'PASUL 2 - scrie lectia. Structura ramane exact cea din fisier:\n' +
    '  - <title> si <h1> sunt DEJA corecte, nu le atinge\n' +
    '  - obiectivul lectiei (goal-section) si lista "Dupa aceasta lectie vei putea" (3-6 puncte, fiecare cu verb de actiune verificabil)\n' +
    '  - sectiunea "Incearca!" (try-section): o provocare scurta de deschidere, inainte de teorie\n' +
    '  - 5-7 ATOMI in <main id="atomic-content">, fiecare cu <div class="atom" id="atom-N" data-quiz=...>, cu antet, continut si <div class="atom-quiz"></div>\n' +
    '  - 3 exercitii pe niveluri (minim / standard / performanta), fiecare cu rezolvare model in <details class="practice-solution"><summary>Vezi rezolvarea</summary><div class="practice-solution-body">...</div></details>\n' +
    '  - caseta de recapitulare "Ce ai invatat astazi"\n\n' +
    'ADAPTEAZA LA LICEUL DE ARTE. Programa e aceeasi pentru toate profilurile, dar exemplele nu: elevii tai sunt la muzica, arte vizuale, coregrafie, arta actorului. Exemplele vin din lumea lor (un afis de concert, un portofoliu de lucrari, o inregistrare, un program de spectacol), nu dintr-un birou de contabilitate. NU transforma lectia intr-una de specialitate: T.I.C. ramane T.I.C.\n\n' +
    'REGULI DE FOND:\n' +
    '1. Tot ce afirmi trebuie sa fie ADEVARAT: meniuri care exista, scurtaturi reale, cifre verificabile. Daca nu poti sustine o afirmatie, scrie varianta prudenta sau las-o afara.\n' +
    '2. Programa spune pe ce se lucreaza: pentru Societate digitala - Google Workspace sau Microsoft Teams; pentru Continuturi digitale - LibreOffice sau Microsoft Office; pentru Sisteme de calcul - Linux (Ubuntu) sau Windows. Da pasii pentru cel putin una si spune unde difera la cealalta.\n' +
    '3. Chestionarele: 4 variante de lungime apropiata (+/-20% fata de medie); varianta corecta NU are voie sa fie cea mai lunga. Distractorii sunt greseli pe care un elev de a IX-a chiar le face. Indiciul explica CONTINUTUL, niciodata litera. Cheia corecta sa NU cada mereu pe aceeasi litera.\n' +
    '4. data-quiz e o LISTA JSON, iar "correct" e o singura litera. Un obiect in loc de lista omoara toata pagina.\n' +
    '5. Exercitiile cer doar ce s-a predat in ACEASTA lectie.\n' +
    '6. Exemplul INAINTE de definitie, in fiecare atom introductiv.\n' +
    '7. Romana FARA diacritice, ca in restul sitului.\n\n' +
    'NU ATINGE: numele fisierului, calea, cheile de progres (AtomicLearning/PracticeSimple/LessonSummary.init), Breadcrumb.init, LearningProgress.init, caile catre scripturi si stiluri, legaturile inainte/inapoi din nav si din caseta finala.\n' +
    'SCOATE comentariul care incepe cu "SCHELA:" - el marcheaza fisierele nescrise inca.\n\n' +
    'PASUL 3 - verifica-te, intr-un singur apel Bash:\n' +
    'python "' + POARTA + '" "' + L.cale + '" && python "' + QIO + '" dump "' + L.cale + '"\n' +
    'Poarta trebuie sa iasa cu OK. Repara ce semnaleaza si ruleaza din nou.\n\n' +
    'Raporteaza cati atomi si cate intrebari ai scris, si orice n-ai putut face.',
    { label: 'cls9:' + L.fisier, phase: 'Scrie', model: 'opus', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.scris) return { L, r, v: null }
    return agent(
      'Esti profesor corector, exigent. O lectie noua de clasa a IX-a tocmai a fost scrisa. Verific-o.\n\n' +
      'LECTIA: ' + REPO + L.cale + '\n' +
      'TITLU: ' + L.titlu + '\n' +
      'CE CEREA PROGRAMA:\n' + L.continut + '\n\n' +
      'Ruleaza intai poarta: python "' + POARTA + '" "' + L.cale + '"\n' +
      'Apoi citeste lectia si raspunde, in ordinea gravitatii:\n' +
      '1. A RAMAS ceva din lectia-sablon (componentele sistemului de calcul, hardware/software, organizarea fisierelor) intr-o lectie care nu e despre asta? Mai exista comentariul "SCHELA:"?\n' +
      '2. Preda ce cere programa, sau doar se apropie? Numeste ce lipseste din lista de mai sus.\n' +
      '3. Contine ceva FALS? Meniuri sau scurtaturi inventate, cifre gresite, afirmatii tehnice care nu se verifica.\n' +
      '4. Chestionarele: cheia e corecta la fiecare intrebare? Varianta corecta e vizibil mai lunga decat celelalte? Indiciul numeste vreo litera? Cad toate cheile pe aceeasi litera?\n' +
      '5. Exercitiile cer ceva ce NU s-a predat in aceasta lectie?\n' +
      '6. Exemplele sunt adaptate unui liceu de ARTE, sau sunt generice de birou?\n\n' +
      'Nu semnala stil sau lungime. Raporteaza CURAT sau PROBLEME cu lista exacta.',
      { label: 'verif-cls9:' + L.fisier, phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, v }))
  }
)

const bune = rez.filter(Boolean)
const scrise = bune.filter(x => x.r && x.r.scris)
const cuProbleme = bune.filter(x => x.v && x.v.verdict === 'PROBLEME')
log('Scrise: ' + scrise.length + ' din ' + LECTII.length + '. Cu probleme: ' + cuProbleme.length + '.')

return {
  planificate: LECTII.length,
  scrise: scrise.length,
  atomi: scrise.reduce((a, x) => a + (x.r.atomi || 0), 0),
  intrebari: scrise.reduce((a, x) => a + (x.r.intrebari || 0), 0),
  nescrise: bune.filter(x => x.r && !x.r.scris).map(x => ({ fisier: x.L.cale, nota: x.r.nota })),
  probleme: cuProbleme.map(x => ({ fisier: x.L.cale, probleme: x.v.probleme })),
  note: scrise.filter(x => x.r.nota && x.r.nota.length > 60).map(x => ({ fisier: x.L.fisier, nota: x.r.nota })),
}
"""

# Ancora de cautare in textul programei. ATENTIE: textul e cu diacritice, iar prima
# varianta a ancorelor era fara ("Birotica", "Comunicare si colaborare digitala") -
# grep intorcea ZERO potriviri la doua module din trei, deci agentul ar fi primit un
# rezultat gol si ar fi scris din capul lui. Verificat pe fisier inainte de a fixa.
ANCORE = {
    "m1-societate-digitala": "colaborare digital",
    "m2-continuturi-digitale": "Birotic",
    "m3-sisteme-de-calcul": "Sisteme de calcul",
}
# ancore mai fine, pe subiectul fiecarei lectii, unde exista un cuvant-cheie propriu
FINE = {
    "lectia6-ia-ce-este": "inteligen", "lectia7-ia-date-bias": "inteligen",
    "lectia8-modele-generative": "generative", "lectia9-ia-responsabila": "inteligen",
    "lectia10-tehnologii-emergente": "emergente",
    "lectia8-prezentari-baze": "Prezent", "lectia9-prezentari-interactive": "Prezent",
    "lectia9-sistemul-de-operare": "software", "lectia10-fisiere-securitate": "software",
}
for x in L:
    baza = os.path.splitext(x["fisier"])[0]
    x["ancora"] = FINE.get(baza, ANCORE[x["modul"]])

js = js.replace("__LECTII__", json.dumps(L, ensure_ascii=False, indent=2))
dest = os.path.join(R, "_campaign", "cls9_artistic", "wf_cls9.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print("scris:", dest, "|", len(js), "caractere |", len(L), "lectii")
