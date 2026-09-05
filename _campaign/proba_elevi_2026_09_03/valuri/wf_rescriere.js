export const meta = {
  name: 'learninghub-sloturi-gresite',
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
const LECTII = [{"cale": "content/liceu/pedagogic/cls10/m1-procesare-text/lectia1-documente-formatare.html", "acum": "Foaia de calcul Excel: structura si formatare", "trebuie": "Procesorul de text: structura documentului si formatare (caracter, paragraf, pagina)", "etaloane": ["content/liceu/militar/cls10/m1-procesare-text/lectia1-documente-formatare.html", "content/liceu/umanist/cls10/m1-procesare-text/lectia1-documente-formatare.html"], "majoritate": "4 din 6 profiluri", "atentie": "Excel se preda deja la m2-calcul-tabelar in acelasi profil - continutul actual e duplicat"}, {"cale": "content/liceu/stiinte/cls10/m1-procesare-text/lectia1-documente-formatare.html", "acum": "Pagini web: HTML si structura de baza", "trebuie": "Procesorul de text: structura documentului si formatare (caracter, paragraf, pagina)", "etaloane": ["content/liceu/militar/cls10/m1-procesare-text/lectia1-documente-formatare.html", "content/liceu/umanist/cls10/m1-procesare-text/lectia1-documente-formatare.html"], "majoritate": "4 din 6 profiluri"}, {"cale": "content/liceu/stiinte/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html", "acum": "Securitate cibernetica si navigare avansata pe web", "trebuie": "Imbinarea corespondentei (Mail Merge) si aplicatie practica", "etaloane": ["content/liceu/militar/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html", "content/liceu/pedagogic/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/tehnologic/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html", "acum": "Prezentari profesionale cu PowerPoint", "trebuie": "Imbinarea corespondentei (Mail Merge) si aplicatie practica", "etaloane": ["content/liceu/militar/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html", "content/liceu/pedagogic/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/militar/cls11/m1-prezentari-multimedia/lectia1-prezentare-eficienta.html", "acum": "Fluxuri de productie multimedia", "trebuie": "Prezentari electronice: structura, design de slide, reguli de lizibilitate", "etaloane": ["content/liceu/umanist/cls11/m1-prezentari-multimedia/lectia1-prezentare-eficienta.html", "content/liceu/pedagogic/cls11/m1-prezentari-multimedia/lectia1-prezentare-eficienta.html"], "majoritate": "4 din 5 profiluri"}, {"cale": "content/liceu/militar/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "acum": "Prelucrari audio si audio-video", "trebuie": "Imaginea digitala: raster vs vectorial, rezolutie/DPI, modele de culoare, formate", "etaloane": ["content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html"], "majoritate": "numele fisierului + cartonasul; audio-video se preda deja la m1/lectia2 in acelasi profil"}, {"cale": "content/liceu/pedagogic/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "acum": "Tehnici de documentare asistata de calculator", "trebuie": "Imaginea digitala: raster vs vectorial, rezolutie/DPI, modele de culoare, formate", "etaloane": ["content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html"], "majoritate": "numele fisierului + cartonasul; acelasi titlu apare de trei ori in profilul pedagogic"}, {"cale": "content/liceu/tehnologic/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "acum": "Date si informatii", "trebuie": "Imaginea digitala: raster vs vectorial, rezolutie/DPI, modele de culoare, formate", "etaloane": ["content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html"], "majoritate": "numele fisierului + cartonasul"}, {"cale": "content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "acum": "Imaginea digitala - dar e o copie 97,5% a lectiei de clasa a X-a din acelasi profil", "trebuie": "Imaginea digitala la nivel de clasa a XI-a: ce ADAUGA fata de lectia de a X-a (content/liceu/stiinte/cls10/m3-imagini-digitale/lectia1-imagine-digitala.html) - profunzime de culoare, spatii de culoare, compresie cu si fara pierderi, alegerea formatului dupa destinatie", "etaloane": ["content/liceu/umanist/cls11/m2-imagini-web/lectia1-imagine-digitala.html", "content/liceu/stiinte/cls10/m3-imagini-digitale/lectia1-imagine-digitala.html"], "majoritate": "duplicat masurat: 97,5% asemanare fisier la fisier cu lectia de a X-a"}, {"cale": "content/liceu/militar/cls11/m2-imagini-web/lectia2-pagini-web.html", "acum": "Prelucrarea imaginilor digitale: instrumente si tehnici", "trebuie": "Pagina web: structura HTML si stilizare CSS de baza", "etaloane": ["content/liceu/pedagogic/cls11/m2-imagini-web/lectia2-pagini-web.html", "content/liceu/tehnologic/cls11/m2-imagini-web/lectia2-pagini-web.html"], "majoritate": "4 din 5 profiluri"}, {"cale": "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "acum": "Tehnici de documentare asistata de calculator", "trebuie": "Sistemul de calcul si gestionarea fisierelor - sarcini tip proba practica de bacalaureat", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "content/liceu/umanist/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html"], "majoritate": "2 din 5 + cartonasul; titlul actual apare de trei ori in profilul pedagogic"}, {"cale": "content/liceu/stiinte/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "acum": "Retele de calculatoare si comunicare digitala", "trebuie": "Sistemul de calcul si gestionarea fisierelor - sarcini tip proba practica de bacalaureat", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "content/liceu/umanist/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html"], "majoritate": "2 din 5 + cartonasul"}, {"cale": "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "acum": "Structura unui site web si HTML de baza", "trebuie": "Sistemul de calcul si gestionarea fisierelor - sarcini tip proba practica de bacalaureat", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html", "content/liceu/umanist/cls12/m1-competente-digitale/lectia1-calculator-fisiere.html"], "majoritate": "2 din 5 + cartonasul"}, {"cale": "content/liceu/militar/cls12/m1-competente-digitale/lectia2-procesare-text.html", "acum": "Design UI/UX si ergonomie digitala", "trebuie": "Procesare de text - sarcini tip proba D (bacalaureat)", "etaloane": ["content/liceu/pedagogic/cls12/m1-competente-digitale/lectia2-procesare-text.html", "content/liceu/stiinte/cls12/m1-competente-digitale/lectia2-procesare-text.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/umanist/cls12/m1-competente-digitale/lectia2-procesare-text.html", "acum": "Documente hipermedia - proiectare si editor web", "trebuie": "Procesare de text - sarcini tip proba D (bacalaureat)", "etaloane": ["content/liceu/pedagogic/cls12/m1-competente-digitale/lectia2-procesare-text.html", "content/liceu/stiinte/cls12/m1-competente-digitale/lectia2-procesare-text.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html", "acum": "Tehnici de documentare asistata de calculator", "trebuie": "Calcul tabelar - sarcini tip proba D (bacalaureat)", "etaloane": ["content/liceu/stiinte/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html", "content/liceu/umanist/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html", "acum": "Instrumente si structura unui site web", "trebuie": "Calcul tabelar - sarcini tip proba D (bacalaureat)", "etaloane": ["content/liceu/stiinte/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html", "content/liceu/umanist/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html"], "majoritate": "3 din 5 profiluri", "prioritate": "MAXIMA - competenta de bacalaureat care nu se preda nicaieri in acest profil"}, {"cale": "content/liceu/stiinte/cls12/m1-competente-digitale/lectia4-prezentari-internet.html", "acum": "Participare civica si profesionala in spatiul digital", "trebuie": "Prezentari electronice si internet / comunicare - sarcini tip proba D", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia4-prezentari-internet.html", "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia4-prezentari-internet.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia4-prezentari-internet.html", "acum": "Site web si Management de proiect", "trebuie": "Prezentari electronice si internet / comunicare - sarcini tip proba D", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia4-prezentari-internet.html", "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia4-prezentari-internet.html"], "majoritate": "3 din 5 profiluri"}, {"cale": "content/liceu/umanist/cls12/m1-competente-digitale/lectia5-editare-imagini.html", "acum": "Inserarea obiectelor hipermedia in pagini web", "trebuie": "Editare de imagini de baza - sarcini tip proba D", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia5-editare-imagini.html", "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia5-editare-imagini.html"], "majoritate": "4 din 5 profiluri"}, {"cale": "content/liceu/stiinte/cls12/m1-competente-digitale/lectia5-editare-imagini.html", "acum": "Editare de imagini de baza - dar e copie a lectiei de clasa a X-a din acelasi profil", "trebuie": "Editare de imagini la nivel de bacalaureat: aceleasi operatii, dar pe sarcini tip proba D (dimensiuni cerute, format cerut, text pe imagine, salvare cu nume dat)", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia5-editare-imagini.html", "content/liceu/stiinte/cls10/m3-imagini-digitale/lectia2-editare-imagini.html"], "majoritate": "duplicat: titlu 100% si atomi 100% cu lectia de a X-a"}, {"cale": "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia6-proiect-integrator.html", "acum": "Proiect integrator: site web si managementul proiectului", "trebuie": "Proiect integrator de competente digitale - foloseste TOATE cele cinci competente predate in modul (fisiere, text, calcul tabelar, prezentari/internet, imagini), nu doar site web", "etaloane": ["content/liceu/militar/cls12/m1-competente-digitale/lectia6-proiect-integrator.html", "content/liceu/stiinte/cls12/m1-competente-digitale/lectia6-proiect-integrator.html"], "majoritate": "4 din 5 profiluri"}, {"cale": "content/liceu/stiinte/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "acum": "Componenta software: sisteme de operare si aplicatii (dubleaza lectia 1 a aceluiasi modul)", "trebuie": "Retele de calculatoare si Internet: tipuri (LAN/MAN/WAN), componente, cum circula datele (pachete, protocoale, adrese IP), servicii Internet si securitate online", "etaloane": ["content/liceu/tehnologic/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "content/liceu/umanist/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "content/liceu/pedagogic/cls9/m1-sisteme-retele/lectia2-retele-internet.html"], "majoritate": "3 din 5 profiluri (tehnologic, umanist, pedagogic) predau chiar retele la acest slot; in plus, continutul actual dubleaza ATOM 5 din lectia1 a aceluiasi modul"}, {"cale": "content/liceu/militar/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "acum": "Comunicare si colaborare digitala (e-mail, neticheta, retele sociale)", "trebuie": "Retele de calculatoare si Internet: tipuri (LAN/MAN/WAN), componente, cum circula datele (pachete, protocoale, adrese IP), servicii Internet si securitate online", "etaloane": ["content/liceu/tehnologic/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "content/liceu/umanist/cls9/m1-sisteme-retele/lectia2-retele-internet.html", "content/liceu/pedagogic/cls9/m1-sisteme-retele/lectia2-retele-internet.html"], "majoritate": "3 din 5 profiluri (tehnologic, umanist, pedagogic) predau chiar retele la acest slot; cartonasul din index.html promite 'Retele de calculatoare si Internet'"}]


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
