export const meta = {
  name: 'learninghub-rezolvari-model-pe-modul',
  description: 'Scrie rezolvarile model la cele 643 de exercitii ramase - un agent pe MODUL, nu pe lectie',
  phases: [
    { title: 'Scrie', detail: '61 loturi de modul, cate un agent pe lot' },
    { title: 'Verifica', detail: 'rezolvarea chiar rezolva exercitiul si nu contrazice lectia' },
  ],
}

// De ce pe MODUL si nu pe lectie (masurat 04-05.09.2026):
// campania veche deschidea un agent pe fiecare din cele 507 lectii, desi doar 206
// mai au exercitii fara rezolvare. Fiecare agent isi platea o data pornirea si
// descoperirea uneltelor. Grupate pe modul (plafon 18 exercitii / lot, ca sa nu
// creasca prea mult iesirea unui agent) raman 61 de loturi: ~8x mai putini
// agenti pentru aceeasi munca. Lista e inghetata din scanarea discului din
// 05.09.2026; se regenereaza cu scratchpad/chunk.py daca se schimba starea.
const REPO = 'C:\\00\\Projects\\LearningHub\\'
const PIO = REPO + 'tools\\practice_io.py'
const DIGEST = REPO + 'tools\\lesson_digest.py'

const LOTURI_RAW = ['content/liceu/stiinte/cls10/m1-procesare-text|3|lectia1-documente-formatare.html','content/liceu/stiinte/cls10/m2-calcul-tabelar|9|lectia1-tabel-formule.html,lectia2-functii-diagrame.html,lectia3-aplicatie.html','content/liceu/stiinte/cls10/m3-imagini-digitale|6|lectia1-imagine-digitala.html,lectia2-editare-imagini.html','content/liceu/stiinte/cls11/m1-prezentari-multimedia|6|lectia1-prezentare-eficienta.html,lectia2-audio-video.html','content/liceu/stiinte/cls11/m2-imagini-web|6|lectia1-imagine-digitala.html,lectia2-pagini-web.html','content/liceu/stiinte/cls12/m1-competente-digitale|18|lectia1-calculator-fisiere.html,lectia2-procesare-text.html,lectia3-calcul-tabelar.html,lectia4-prezentari-internet.html,lectia5-editare-imagini.html,lectia6-proiect-integrator.html','content/liceu/stiinte/cls9/m1-sisteme-retele|6|lectia1-sisteme-calcul.html,lectia2-retele-internet.html','content/liceu/stiinte/cls9/m2-societate-digitala|9|lectia1-identitate-siguranta.html,lectia2-drepturi-gdpr.html,lectia3-comunicare-ai.html','content/liceu/tehnologic/cls10/m1-procesare-text|9|lectia1-documente-formatare.html,lectia2-stiluri-cuprins.html,lectia3-corespondenta-aplicatie.html','content/liceu/tehnologic/cls10/m2-calcul-tabelar|9|lectia1-tabel-formule.html,lectia2-functii-diagrame.html,lectia3-aplicatie.html','content/liceu/tehnologic/cls10/m3-calcul-tabelar-avansat|12|lectia1-formule-functii.html,lectia2-referinte.html,lectia3-grafice-diagrame.html,lectia4-tiparire-import.html','content/liceu/tehnologic/cls10/m4-baze-de-date|16|lectia1-concepte-tabele.html,lectia2-chei-relatii.html,lectia3-formulare.html,lectia4-interogari-filtre.html,lectia5-rapoarte-aplicatie.html','content/liceu/tehnologic/cls10/m5-prezentari-digitale|13|lectia1-creare-formatare.html,lectia2-obiecte-diagrame.html,lectia3-animatie-tranzitii.html,lectia4-tiparire-aplicatie.html','content/liceu/tehnologic/cls11/m1-prezentari-multimedia|6|lectia1-prezentare-eficienta.html,lectia2-audio-video.html','content/liceu/tehnologic/cls11/m2-imagini-web|6|lectia1-imagine-digitala.html,lectia2-pagini-web.html','content/liceu/tehnologic/cls11/m3-date-si-informatii|9|lectia1-date-informatii.html,lectia2-flux-informational.html,lectia3-sistem-informatic.html','content/liceu/tehnologic/cls11/m4-surse-si-cautare|9|lectia1-surse-informatie.html,lectia2-tehnici-cautare.html,lectia3-evaluarea-surselor.html','content/liceu/tehnologic/cls11/m5-organizarea-datelor|9|lectia1-tipuri-de-date.html,lectia2-structuri-de-date.html,lectia3-aplicatie-organizare.html','content/liceu/tehnologic/cls11/m6-prelucrarea-datelor|9|lectia1-operatori-aritmetici.html,lectia2-operatori-relationali-logici.html,lectia3-expresii-compuse.html','content/liceu/tehnologic/cls11/m7-functii|12|lectia1-functii-aritmetice-statistice.html,lectia2-functii-logice.html,lectia3-functii-cautare-referinta.html,lectia4-siruri-financiare-utilizator.html','content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz|9|lectia1-schite-grafice-sabloane.html,lectia2-rapoarte.html,lectia3-documente-reale.html','content/liceu/tehnologic/cls12/m1-competente-digitale|18|lectia1-calculator-fisiere.html,lectia2-procesare-text.html,lectia3-calcul-tabelar.html,lectia4-prezentari-internet.html,lectia5-editare-imagini.html,lectia6-proiect-integrator.html','content/liceu/tehnologic/cls12/m2-web-creare-site|15|lectia1-instrumente-web.html,lectia2-structura-paginii.html,lectia3-elemente-continut.html,lectia4-navigare-linkuri.html,lectia5-criterii-publicare.html','content/liceu/tehnologic/cls12/m3-management-proiect|15|lectia1-notiunea-de-proiect.html,lectia2-manager-echipa.html,lectia3-plan-wbs.html,lectia4-grafic-traiectorie-critica.html,lectia5-monitorizare-evaluare.html','content/liceu/tehnologic/cls12/m4-instrumente-proiect|6|lectia1-instrumente-software.html,lectia2-proiect-integrator.html','content/liceu/tehnologic/cls9/m1-sisteme-retele|6|lectia1-sisteme-calcul.html,lectia2-retele-internet.html','content/liceu/tehnologic/cls9/m2-societate-digitala|9|lectia1-identitate-siguranta.html,lectia2-drepturi-gdpr.html,lectia3-comunicare-ai.html','content/liceu/umanist/cls10/m1-procesare-text|9|lectia1-documente-formatare.html,lectia2-stiluri-cuprins.html,lectia3-corespondenta-aplicatie.html','content/liceu/umanist/cls10/m2-calcul-tabelar|9|lectia1-tabel-formule.html,lectia2-functii-diagrame.html,lectia3-aplicatie.html','content/liceu/umanist/cls11/m1-prezentari-multimedia|6|lectia1-prezentare-eficienta.html,lectia2-audio-video.html','content/liceu/umanist/cls11/m2-imagini-web|6|lectia1-imagine-digitala.html,lectia2-pagini-web.html','content/liceu/umanist/cls12/m1-competente-digitale|3|lectia1-calculator-fisiere.html','content/tic/cls5/extra-siguranta-backup|18|lectia1-internet-sigur.html,lectia2-parole.html,lectia3-date-personale.html,lectia4-prezentari-intro.html,lectia5-prezentari-design.html,lectia6-proiect.html','content/tic/cls5/extra-siguranta-backup|6|lectia7-backup.html,lectia8-drepturi-autor.html','content/tic/cls7/extra-web|12|lectia2-text-headings.html,lectia4-imagini.html,lectia5-css-intro.html,lectia6-proiect.html','content/tic/cls7/m1-word-fundamente|18|lectia1-interfata-word.html,lectia2-formatare-text.html,lectia3-paragrafe.html,lectia4-liste.html,lectia5-tabele.html,lectia6-evaluare.html','content/tic/cls7/m2-word-avansat|18|lectia1-liste.html,lectia2-stiluri.html,lectia3-sectiuni.html,lectia4-header-footer.html,lectia5-imagini-obiecte.html,lectia6-aplicatie.html','content/tic/cls7/m2-word-avansat|3|lectia7-evaluare.html','content/tic/cls7/m3-algoritmi-schema|17|lectia1-codeblocks.html,lectia10-roboti.html,lectia2-elemente-baza.html,lectia3-structura-liniara.html','content/tic/cls7/m3-algoritmi-schema|15|lectia4-structura-alternativa.html,lectia5-while.html,lectia6-do-while.html','content/tic/cls7/m3-algoritmi-schema|8|lectia7-for.html,lectia8-fizica.html','content/tic/cls7/m4-algoritmi-siruri|16|lectia1-for.html,lectia2-siruri.html,lectia3-parcurgere.html,lectia4-suma-medie.html,lectia5-maxim-minim.html','content/tic/cls7/m4-algoritmi-siruri|3|lectia6-proiect.html','content/tic/cls7/m4-colaborare|12|extra-ghid-practic-colaborare.html,lectia2-google-docs.html,lectia3-canva-padlet.html,lectia4-etica-digitala.html','content/tic/cls7/m5-proiecte-recap|15|lectia-audio-video.html,lectia-colaborative.html,lectia1-proiect-cv.html,lectia2-proiect-prezentare.html,lectia3-proiect-algoritm.html','content/tic/cls7/m5-proiecte-recap|16|lectia4-recapitulare-word.html,lectia5-recapitulare-powerpoint.html,lectia6-recapitulare-algoritmi.html,lectia7-evaluare-practica.html,lectia8-evaluare-teorie.html','content/tic/cls7/m5-proiecte-recap|3|lectia9-rezerva.html','content/tic/cls8/extra-databases|18|lectia1-introducere-bd.html,lectia2-tabele-campuri.html,lectia3-creare-bd-access.html,lectia4-interogari-simple.html,lectia5-sortare-filtrare.html,lectia6-proiect-bd.html','content/tic/cls8/extra-materiale-suplimentare|3|tutorial-github-netlify.html','content/tic/cls8/extra-structuri-date|18|lectia1-tablouri.html,lectia2-parcurgere.html,lectia3-cautare.html,lectia4-maxim-minim.html,lectia5-sortare.html,lectia6-proiect.html','content/tic/cls8/extra-subprograme|18|lectia1-de-ce-functii.html,lectia2-declarare.html,lectia3-parametri.html,lectia4-return.html,lectia5-apelare.html,lectia6-proiect.html','content/tic/cls8/m1-excel-fundamente|18|lectia1-interfata.html,lectia2-date.html,lectia3-formule.html,lectia4-functii.html,lectia5-grafice.html,lectia6-proiect.html','content/tic/cls8/m1-excel-fundamente|3|lectia7-sortare.html','content/tic/cls8/m2-formule-functii|16|lectia1-introducere-formule.html,lectia2-referinte-celule.html,lectia3-functii-baza.html,lectia4-functii-text.html,lectia5-functii-logice.html','content/tic/cls8/m2-formule-functii|6|lectia6-evaluare.html,lectia7-sortare.html','content/tic/cls8/m3-grafice-web|17|lectia1-grafice-tipuri.html,lectia2-creare-formatare.html,lectia3-proiect-excel.html,lectia4-introducere-web.html,lectia5-structura-html.html','content/tic/cls8/m3-grafice-web|3|lectia6-evaluare-m3.html','content/tic/cls8/m4-html-css|17|lectia1-structura.html,lectia2-text-imagini.html,lectia3-linkuri.html,lectia4-css-intro.html,lectia5-layout.html','content/tic/cls8/m4-html-css|12|lectia5b-proiect-sinteza.html,lectia6-publicare.html,lectia7-tabele.html,lectia8-formulare.html','content/tic/cls8/m5-proiecte-final|15|lectia1-recapitulare-algoritmi.html,lectia2-recapitulare-structuri.html,lectia3-recapitulare-bd.html,lectia4-evaluare-nationala.html,lectia5-portofoliu-final.html','content/tic/cls8/m5-proiecte-final|6|lectia6-finalizare.html']

const LOTURI = LOTURI_RAW.map((s, i) => {
  const p = s.split('|')
  return { i, modul: p[0], n: +p[1], lectii: p[2].split(',').map(f => p[0] + '/' + f) }
})

const R_SCHEMA = {
  type: 'object',
  required: ['modul', 'inserate', 'sarite', 'nota'],
  properties: {
    modul: { type: 'string' },
    inserate: { type: 'integer' },
    sarite: { type: 'integer' },
    nota: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['verdict', 'probleme'],
  properties: {
    verdict: { type: 'string', enum: ['CURAT', 'PROBLEME'] },
    probleme: {
      type: 'array',
      items: {
        type: 'object',
        required: ['fisier', 'exercitiu', 'ce_e_gresit'],
        properties: {
          fisier: { type: 'string' },
          exercitiu: { type: 'string' },
          ce_e_gresit: { type: 'string' },
        },
      },
    },
  },
}

phase('Scrie')
log('Scriu rezolvari model pentru ' + LOTURI.reduce((a, x) => a + x.n, 0) + ' exercitii, in ' + LOTURI.length + ' loturi de modul.')

const rez = await pipeline(
  LOTURI,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. si scrii REZOLVARILE MODEL pentru exercitiile unui MODUL scolar. Fara ele, elevul nu poate lucra acasa - nu are cu ce sa se compare.\n\n' +
    'MODULUL: ' + L.modul + '\n' +
    'LECTIILE de lucru (' + L.lectii.length + ', cu ' + L.n + ' exercitii fara rezolvare in total):\n' +
    L.lectii.map(c => '  ' + c).join('\n') + '\n\n' +
    'PASUL 1 - citeste O SINGURA DATA continutul modulului, ca rezolvarile sa foloseasca exact ce s-a predat:\n' +
    'python "' + DIGEST + '" "' + L.modul + '"\n' +
    'NU citi HTML-ul brut - digestul e de 8x mai mic si contine tot ce iti trebuie. Daca o lectie din lista nu apare in digest (numele ei nu incepe cu "lectia"), citeste doar acel fisier direct.\n\n' +
    'PASUL 2 - vezi exercitiile tuturor lectiilor din lot, INTR-UN SINGUR apel Bash:\n' +
    L.lectii.map(c => 'python "' + PIO + '" dump "' + c + '"').join(' && ') + '\n' +
    'Iti da, per exercitiu: idx, nivel (minim/standard/performanta), titlu, textul cerintei, si daca are deja rezolvare. Lucrezi DOAR la cele cu are_rezolvare fals.\n\n' +
    'PASUL 3 - scrie rezolvarea pentru fiecare exercitiu care NU are una.\n' +
    'Cum arata o rezolvare buna:\n' +
    '- MINIM si STANDARD: rezolvarea completa, pas cu pas, cu raspunsurile concrete. Elevul trebuie sa poata verifica singur ce a facut. Daca cerinta are subpuncte, raspunde la fiecare.\n' +
    '- PERFORMANTA: NU da produsul de-a gata. Da o SCHITA de rezolvare (structura, ordinea pasilor, capcanele) plus criteriile dupa care se evalueaza. Elevul bun trebuie sa mai aiba ce face.\n' +
    'Reguli:\n' +
    '1. Foloseste DOAR ce s-a predat in lectie. Daca cerinta cere ceva nepredat, spune asta explicit in rezolvare ("pasul asta cere X, care nu apare in lectie") - e o informatie utila, nu o rusine.\n' +
    '2. Valorile concrete trebuie sa fie CORECTE: formule care chiar functioneaza, scurtaturi de taste reale, cifre care se verifica. Nu inventa.\n' +
    '3. Romana FARA diacritice. HTML simplu: <p>, <ol>, <li>, <strong>, <code>. NICIODATA <script>, <style>, <body>.\n' +
    '4. Lungime: 400-1200 de caractere per rezolvare. E un model de raspuns, nu o a doua lectie.\n' +
    '5. Rezolvarile din acelasi modul nu se repeta cuvant cu cuvant - fiecare exercitiu are cerinta lui.\n\n' +
    'PASUL 4 - cate un fisier JSON pe lectie, in forma:\n' +
    '[{"idx": 1, "rezolvare": "<p>...</p><ol><li>...</li></ol>"}, {"idx": 2, "rezolvare": "..."}]\n' +
    'si aplica-le, GRUPAT intr-un singur apel Bash:\n' +
    'python "' + PIO + '" apply "<lectia>" <calea-json>\n' +
    'Unealta sare singura peste rezolvarile prea scurte, peste cele cu taguri interzise sau neinchise, si peste exercitiile care au deja rezolvare. Daca sare peste ceva, citeste motivul si corecteaza.\n\n' +
    'PASUL 5 - verifica, tot intr-un singur apel Bash: ruleaza din nou dump pe toate lectiile din lot si confirma ca are_rezolvare e true peste tot.\n\n' +
    'Raporteaza cate ai inserat in total pe lot, cate a sarit unealta, si o nota scurta despre exercitiile la care rezolvarea a fost grea sau imposibila si de ce.',
    { label: 'rezolvari:' + L.modul.split('/').slice(-2).join('/') + '#' + L.i, phase: 'Scrie', model: 'sonnet', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.inserate) return { L, r, verificare: null }
    // Verificarea e in mare bifat, nu judecata => sonnet. Si nu pe toate loturile:
    // doar unde unealta a sarit peste ceva (semn ca ceva n-a mers) plus 1 din 4 ca
    // esantion, ca sa prindem si problemele tacute.
    if (!r.sarite && L.i % 4 !== 0) return { L, r, verificare: null }
    return agent(
      'Esti profesor corector. Cineva a scris rezolvarile model pentru exercitiile unui modul scolar. Verifica-le.\n\n' +
      'MODULUL: ' + L.modul + '\n' +
      'LECTIILE: ' + L.lectii.join(', ') + '\n\n' +
      'Citeste exercitiile si rezolvarile, intr-un singur apel Bash:\n' +
      L.lectii.map(c => 'python "' + PIO + '" dump "' + c + '"').join(' && ') + '\n' +
      'si continutul predat:\n' +
      'python "' + DIGEST + '" "' + L.modul + '"\n' +
      'NU citi HTML-ul brut.\n\n' +
      'Verifica trei lucruri, in ordinea gravitatii:\n' +
      '1. Rezolvarea REZOLVA cerinta? Raspunde la ce s-a cerut, sau vorbeste pe langa?\n' +
      '2. Are erori de FOND? Formule care nu functioneaza, scurtaturi de taste inventate, cifre gresite, functii care nu exista.\n' +
      '3. La nivelul PERFORMANTA, da produsul de-a gata in loc de schita? (Ar fi gresit - elevul bun trebuie sa mai aiba ce face.)\n\n' +
      'Nu semnala chestiuni de stil sau de lungime. Raporteaza CURAT sau PROBLEME cu lista exacta (fisier + exercitiu + ce e gresit).',
      { label: 'verif:' + L.modul.split('/').slice(-1) + '#' + L.i, phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const ins = bune.reduce((a, x) => a + ((x.r && x.r.inserate) || 0), 0)
const sar = bune.reduce((a, x) => a + ((x.r && x.r.sarite) || 0), 0)
const cuProbleme = bune.filter(x => x.verificare && x.verificare.verdict === 'PROBLEME')
const probleme = cuProbleme.flatMap(x => (x.verificare.probleme || []))

log('Rezolvari scrise: ' + ins + '. Sarite de unealta: ' + sar + '. Loturi cu probleme de fond: ' + cuProbleme.length + '.')

return {
  loturi_planificate: LOTURI.length,
  loturi_procesate: bune.length,
  rezolvari_scrise: ins,
  sarite: sar,
  loturi_cu_probleme: cuProbleme.length,
  probleme: probleme,
  note: bune.filter(x => x.r && x.r.nota && x.r.nota.length > 60).slice(0, 40).map(x => ({ modul: x.L.modul, nota: x.r.nota })),
}
