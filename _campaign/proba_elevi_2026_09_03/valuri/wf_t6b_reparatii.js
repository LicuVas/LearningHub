export const meta = {
  name: 'learninghub-reparatii-rezolvari',
  description: 'Repara cele 13 rezolvari model gasite gresite de corectorii valului t6b',
  phases: [
    { title: 'Repara', detail: '11 fisiere, cate un agent pe fisier' },
    { title: 'Reverifica', detail: 'a disparut chiar defectul semnalat, fara sa strice altceva' },
  ],
}

// Corectorii valului t6b au semnalat 15 probleme in 10 loturi. Doua dintre ele
// (nr. 1 - lectia3-corespondenta preda PowerPoint in locul imbinarii de
// corespondenta; si "enuntul da codul complet la un exercitiu de performanta")
// NU sunt probleme de rezolvare, ci de continut asezat gresit / enunt prost -
// alea intra pe alt drum (punctul 3 din RELUARE.md), nu aici.
// Aici raman 13 defecte reale de rezolvare, in 11 fisiere.
const PIO = 'C:\\00\\Projects\\LearningHub\\tools\\practice_io.py'
const DIGEST = 'C:\\00\\Projects\\LearningHub\\tools\\lesson_digest.py'

const DEFECTE = [
  {
    f: 'content/liceu/umanist/cls10/m2-calcul-tabelar/lectia1-tabel-formule.html',
    idx: [1, 2, 3],
    ce: 'TOATE cele trei rezolvari sunt despre altceva decat cere lectia. Lectia si cerintele sunt despre CALCUL TABELAR (Excel/Calc): tabel cu 4 coloane si salvare .xlsx la ex.1, formulele =SUM(D2:D6) si =AVERAGE(D2:D6) la ex.2, referinta absoluta $ si formatare procentuala la ex.3. Rezolvarile scrise vorbesc in schimb despre procesare de TEXT in Word (Ctrl+B, Ctrl+E, Justified, .docx, Layout>Breaks, Header/Footer, bibliografie). Nu au nicio legatura cu ce s-a cerut. Se rescriu toate trei de la zero, pe calcul tabelar.',
  },
  {
    f: 'content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html',
    idx: [1],
    ce: 'Cerinta cere, pentru fiecare din cele 5 imagini, sa se spuna DACA e raster SAU vectorial, plus formatul. Rezolvarea face asta la a), b), c), d), dar la e) (graficul curbei Arrhenius) sare peste clasificare si da doar formatul ("PNG sau SVG"). Completeaza punctul e) cu clasificarea explicita, la fel ca la celelalte.',
  },
  {
    f: 'content/liceu/tehnologic/cls11/m4-surse-si-cautare/lectia2-tehnici-cautare.html',
    idx: [3],
    ce: 'Exercitiu de nivel PERFORMANTA: rezolvarea se numeste "schita" dar da produsul gata facut - toate cele trei interogari finale sunt scrise verbatim, gata de copiat. Celelalte doua exercitii de performanta din ACELASI modul isi respecta eticheta (lectia1 Ex3 spune explicit "calculeaza tu cifrele finale"). Rescrie ca schita reala: pasii de rafinare si operatorii de folosit, plus criteriile dupa care elevul isi judeca singur interogarea - fara sa scrii interogarile finale de-a gata.',
  },
  {
    f: 'content/liceu/tehnologic/cls11/m7-functii/lectia4-siruri-financiare-utilizator.html',
    idx: [2],
    ce: 'Punctul b): cerinta cere linia de raport exact "Ionescu Radu \u2014 875,40 lei" (cu linie de pauza, em-dash). Formula din rezolvare foloseste " - " (cratima simpla), deci nu reproduce sirul cerut. Corecteaza formula ca sa dea exact caracterul cerut in enunt.',
  },
  {
    f: 'content/liceu/tehnologic/cls11/m8-instrumente-si-studii-de-caz/lectia2-rapoarte.html',
    idx: [2],
    ce: 'EROARE DE FOND. Rezolvarea da =SUMIF(A2:A7,"Ionescu",C2:C7) cu VIRGULA ca separator de argumente. Pe setari regionale romanesti - exact ce presupune tot restul lectiei, care scrie peste tot 3,2 mc / 6,98 / 87,15 lei - separatorul de lista in formule este PUNCT-SI-VIRGULA, fiindca virgula e deja ocupata ca separator zecimal. Un elev care copiaza formula asa primeste eroare. Corecteaza la =SUMIF(A2:A7;"Ionescu";C2:C7) si scoate afirmatia derutanta despre numele functiei, punand in loc, pe scurt, de ce separatorul difera.',
  },
  {
    f: 'content/tic/cls5/extra-siguranta-backup/lectia5-prezentari-design.html',
    idx: [1],
    ce: 'Subpunctul 3 cere explicit "Identifica cel putin 4 greseli" in prezentarea descrisa (5 fonturi diferite, text galben pe fundal alb, 4 animatii pe slide). Rezolvarea numara si corecteaza doar 3. Adauga a patra greseala, ancorata in descrierea din enunt si in ce s-a predat.',
  },
  {
    f: 'content/tic/cls7/m2-word-avansat/lectia4-header-footer.html',
    idx: [2],
    ce: 'EROARE DE MECANICA WORD. Rezolvarea spune sa bifezi "Different First Page" in header-ul SECTIUNII 2 ca sa nu aiba antet coperta. Dar coperta e in sectiunea 1: bifat acolo separa doar prima pagina a sectiunii 2 (adica pagina 2), deci tocmai pagina pe care pasul urmator cere sa apara titlul ar ramane fara antet. Solutia corecta, folosita corect chiar in Exercitiul 3 al aceleiasi lectii: odata ce ai sectiuni separate e suficienta sectiunea noua - antetul sectiunii 1 se lasa gol, Different First Page nici nu e necesar. Rescrie pasii corect.',
  },
  {
    f: 'content/tic/cls7/m2-word-avansat/lectia1-liste.html',
    idx: [2],
    ce: 'Rezolvarea (itemul bonus) spune ca poti personaliza fontul titlurilor de capitol din "Define New Multilevel List -> Font". Butonul acela schimba doar aspectul NUMARULUI din lista (cifrele "1.1."), nu fontul textului titlului. Pentru fontul titlului se modifica stilul (Heading 1) sau se formateaza direct textul. Corecteaza pasul, ca elevul care il incearca sa vada chiar ce i se promite.',
  },
  {
    f: 'content/tic/cls7/m3-algoritmi-schema/lectia7-for.html',
    idx: [3],
    ce: 'EROARE DE FOND. Rezolvarea recomanda "long fact = 1;" ca remediu la depasirea intervalului lui int pentru n>12-13. Pe mediul predat explicit in modul (Code::Blocks + MinGW pe Windows, lectia1), "long" are aceeasi dimensiune ca "int" - 4 octeti - deci NU extinde nimic si nu rezolva depasirea despre care vorbeste chiar rezolvarea. Tipul corect e "long long". Restul rezolvarii (initializarea cu 1, nu cu 0) e corect si se pastreaza.',
  },
  {
    f: 'content/tic/cls7/m3-algoritmi-schema/lectia8-fizica.html',
    idx: [2],
    ce: 'Cerinta cere citirea inaltimii h de la care cade obiectul, dar niciuna dintre formulele cerute (d = 9.8*t*t/2, v = 9.8*t) nu foloseste h - se foloseste doar t. Rezolvarea reproduce fidel inconsistenta: citeste h si apoi h nu mai apare niciodata. NU schimba enuntul. In schimb, rezolvarea trebuie sa spuna deschis elevului ce se intampla: h se citeste dar nu intra in formulele cerute, iar legatura reala dintre ele este h = 9.8*t*t/2 - deci h calculat si h citit ar trebui sa coincida, si asta se poate folosi ca verificare. Asa elevul invata ceva din inconsistenta, in loc sa o copieze.',
  },
  {
    f: 'content/tic/cls7/m5-proiecte-recap/lectia1-proiect-cv.html',
    idx: [2],
    ce: 'GRAV, si e despre datele unui copil. Rezolvarea ii spune elevului de clasa a VII-a sa puna "telefon si email" in coloana stanga a CV-ului. Atomul 5 al ACELEIASI lectii spune explicit contrariul: "La un CV scolar, numarul de telefon nu este necesar si NU se include - un document trimis digital poate fi accesat de persoane necunoscute." Corecteaza rezolvarea ca sa respecte regula predata si sa spuna, scurt, de ce.',
  },
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'inlocuite', 'ce_am_schimbat'],
  properties: {
    fisier: { type: 'string' },
    inlocuite: { type: 'integer' },
    ce_am_schimbat: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['defect_reparat', 'nimic_altceva_stricat', 'explicatie'],
  properties: {
    defect_reparat: { type: 'boolean' },
    nimic_altceva_stricat: { type: 'boolean' },
    explicatie: { type: 'string' },
  },
}

phase('Repara')
log('Repar ' + DEFECTE.reduce((a, d) => a + d.idx.length, 0) + ' rezolvari gresite, in ' + DEFECTE.length + ' fisiere.')

const rez = await pipeline(
  DEFECTE,
  (D) => agent(
    'Esti profesor de Informatica/T.I.C. O rezolvare model publicata pe situl scolar este GRESITA si trebuie inlocuita. Un corector a descris exact defectul.\n\n' +
    'FISIERUL: ' + D.f + '\n' +
    'EXERCITIUL/ELE de reparat: ' + D.idx.join(', ') + '\n\n' +
    'DEFECTUL SEMNALAT:\n' + D.ce + '\n\n' +
    'PASUL 1 - vezi exercitiul si rezolvarea de acum, si ce s-a predat efectiv, INTR-UN SINGUR apel Bash:\n' +
    'python "' + PIO + '" dump "' + D.f + '" && python "' + DIGEST + '" "' + D.f.split('/').slice(0, -1).join('/') + '"\n' +
    'NU citi HTML-ul brut - digestul are tot ce iti trebuie si e mult mai mic.\n\n' +
    'PASUL 2 - judeca defectul inainte sa scrii. Corectorul poate gresi. Daca, dupa ce ai citit cerinta si lectia, defectul NU exista cu adevarat, NU schimba nimic: raporteaza inlocuite=0 si scrie in "ce_am_schimbat" de ce nu era un defect. E un raspuns valid si util.\n\n' +
    'PASUL 3 - daca defectul e real, scrie rezolvarea NOUA, completa. Reguli:\n' +
    '1. Repara EXACT defectul semnalat. Nu rescrie ce era deja bun.\n' +
    '2. Foloseste DOAR ce s-a predat in lectie. Daca cerinta cere ceva nepredat, spune asta explicit in rezolvare.\n' +
    '3. Valorile concrete trebuie sa fie CORECTE: formule care chiar functioneaza pe setari romanesti, scurtaturi de taste reale, cifre care se verifica. Nu inventa.\n' +
    '4. Nivelul conteaza: MINIM si STANDARD primesc rezolvarea completa, pas cu pas, cu raspunsurile concrete. PERFORMANTA primeste o SCHITA (structura, ordinea pasilor, capcanele) plus criteriile de evaluare - elevul bun trebuie sa mai aiba ce face.\n' +
    '5. Romana FARA diacritice. HTML simplu: <p>, <ol>, <li>, <strong>, <code>. NICIODATA <script>, <style>, <body>.\n' +
    '6. Lungime: 400-1200 de caractere per rezolvare.\n\n' +
    'PASUL 4 - scrie un JSON [{"idx": N, "rezolvare": "<p>...</p>"}] si aplica-l cu comanda de INLOCUIRE (nu "apply" - aia sare peste exercitiile care au deja rezolvare):\n' +
    'python "' + PIO + '" replace "' + D.f + '" <calea-json>\n\n' +
    'PASUL 5 - verifica: ruleaza din nou dump si confirma ca rezolvarea noua e acolo, ca exercitiul are o singura rezolvare, si ca textul cerintei a ramas neatins.\n\n' +
    'Raporteaza cate ai inlocuit si, pe scurt, ce ai schimbat fata de varianta gresita.',
    { label: 'repar:' + D.f.split('/').slice(-1), phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, D) => {
    if (!r || !r.inlocuite) return { D, r, verificare: null }
    return agent(
      'Esti corector. Cineva tocmai a inlocuit o rezolvare model gresita dintr-o lectie scolara. Verifica DOUA lucruri, atat.\n\n' +
      'FISIERUL: ' + D.f + '\n' +
      'EXERCITIUL/ELE: ' + D.idx.join(', ') + '\n\n' +
      'DEFECTUL care trebuia reparat:\n' + D.ce + '\n\n' +
      'Citeste starea de acum, intr-un singur apel Bash:\n' +
      'python "' + PIO + '" dump "' + D.f + '" && python "' + DIGEST + '" "' + D.f.split('/').slice(0, -1).join('/') + '"\n' +
      'NU citi HTML-ul brut.\n\n' +
      '1. A DISPARUT defectul descris mai sus? (defect_reparat)\n' +
      '2. S-a stricat altceva? Exercitiul are exact o rezolvare, nu doua lipite? Textul cerintei e neatins? Rezolvarea noua e corecta pe fond si potrivita nivelului (performanta = schita, nu produs gata)? (nimic_altceva_stricat)\n\n' +
      'Nu semnala chestiuni de stil sau de lungime. Explica scurt si concret ce ai vazut.',
      { label: 'reverif:' + D.f.split('/').slice(-1), phase: 'Reverifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ D, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const inl = bune.reduce((a, x) => a + ((x.r && x.r.inlocuite) || 0), 0)
const nereparate = bune.filter(x => x.verificare && (!x.verificare.defect_reparat || !x.verificare.nimic_altceva_stricat))
const nemodificate = bune.filter(x => x.r && !x.r.inlocuite)

log('Rezolvari inlocuite: ' + inl + '. Nemodificate (corectorul gresise): ' + nemodificate.length + '. Ramase cu probleme: ' + nereparate.length + '.')

return {
  fisiere: DEFECTE.length,
  rezolvari_inlocuite: inl,
  nemodificate: nemodificate.map(x => ({ fisier: x.D.f, de_ce: x.r.ce_am_schimbat })),
  ramase_cu_probleme: nereparate.map(x => ({ fisier: x.D.f, ce_zice_corectorul: x.verificare.explicatie })),
  schimbari: bune.filter(x => x.r && x.r.inlocuite).map(x => ({ fisier: x.D.f, ce: x.r.ce_am_schimbat })),
}
