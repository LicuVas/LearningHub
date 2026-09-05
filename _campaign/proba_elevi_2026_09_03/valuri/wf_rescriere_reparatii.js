export const meta = {
  name: 'learninghub-reparatii-rescriere',
  description: 'Repara cele 11 de probleme de fond gasite de corectori in cele 24 de lectii rescrise',
  phases: [
    { title: 'Repara', detail: '9 fisiere, cate un agent pe fisier' },
    { title: 'Reverifica', detail: 'a disparut defectul, fara sa strice altceva' },
  ],
}

// Ce NU intra aici, deliberat:
//  - "toate raspunsurile corecte pe litera a": motorul AMESTECA variantele la fiecare
//    afisare (atomic-learning.js: Fisher-Yates + recalcularea literei corecte), deci
//    pozitia stocata nu ajunge la elev. Masurat pe tot situl: b=53,8% din 3403 de
//    intrebari - tipar in date, nu defect viu. O rescriere in masa ar costa defecte
//    noi (masurat 43% la prima runda) pentru zero castig la elev.
//  - cheile de progres ramase de la subiectul vechi: reparate mecanic, separat.
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const REPO = 'C:/00/Projects/LearningHub/'

const LUCRU = [
  {
    "cale": "content/liceu/stiinte/cls10/m1-procesare-text/lectia1-documente-formatare.html",
    "probleme": [
      "Eroare chimică la linia 167: ionul de calciu e scris 'Ca&#8322;&#8314;' (indice 2 + exponent plus = Ca₂⁺) în loc de 'Ca&#178;&#8314;' (Ca²⁺, exponent 2 + exponent plus). Notația corectă pentru sarcina ionică e ambii ca exponent, nu indice+exponent. Exemplul e listat greșit ca ilustrare pentru 'Indice / Subscript ... pentru numarul de atomi', deși '2+' e sarcina electrică (un exponent), nu numărul de atomi de calciu (care e 1) — se contrazice cu propriul exemplu corect de câteva linii mai jos din secțiunea Exponent (SO4 2- scris corect, cu sarcina ca exponent)."
    ]
  },
  {
    "cale": "content/liceu/stiinte/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html",
    "probleme": [
      "Exercitiul 3 (nivel performanta) cere filtrare din 'Editare lista de destinatari' si campul conditional 'Reguli -> Daca...Atunci...Altfel', tehnici care nu apar in niciun atom predat (1-6) al acestei lectii, iar rezolvarea le prezinta direct, fara sa semnaleze ca depasesc ce s-a predat. Etalonul (militar) trateaza acelasi tip de exercitiu dar isi asuma explicit in solutie: 'Atentie: filtrarea ... NU e explicata in lectie'."
    ]
  },
  {
    "cale": "content/liceu/tehnologic/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
    "probleme": [
      "Cifre gresite in cheia de rezolvare: Exercitiul 3, punctul 3 afirma ca fotografia de 4000x3000 px 'ajunge' pentru toata pagina A4 la 300 DPI si 'ramane peste 300 DPI', desi cifrele citate in aceeasi fraza arata un deficit pe inaltime (3000 px disponibili fata de 3508 ceruti). Daca poza acopera toata inaltimea paginii (29,7 cm), densitatea reala este ~257 DPI, sub pragul de 300 DPI stabilit chiar de lectie. Calculul care urmeaza (484 DPI) verifica doar latimea si nu corecteaza deficitul de pe inaltime -- concluzia 'Da, ajunge' isi contrazice propriile date."
    ]
  },
  {
    "cale": "content/liceu/stiinte/cls11/m2-imagini-web/lectia1-imagine-digitala.html",
    "probleme": [
      "FALS (cifră greșită): Exercițiul 1 (Nivel minim), punctul d) — lecția calculează 2480 x 3508 = 8.700.640, apoi 8.700.640/8 = 1.087.580 octeți. Corect: 2480 x 3508 = 8.699.840, deci rezultatul corect e 1.087.480 de octeți (aprox. 1,04 MiB rămâne valabil ca aproximare, dar cifrele exacte din cheia de rezolvare sunt greșite).",
      "Exercițiu care cere conținut nepredat în această lecție: Exercițiul 2 (Nivel standard) instruiește elevul să încadreze fiecare din cele 5 situații în una din 4 cauze explicit enumerate (profunzime de culoare / spatiu de culoare / compresie cu pierderi / compresie fara pierderi) — toate predate în lecție. Punctul e) (logo clar pe site, neclar pe un banner de 2m) are însă rezolvarea oficială bazată pe o a cincea cauză, raster-vs-vectorial ('Nu este o problema de compresie, ci de tip de imagine... foloseste SVG'), concept care NU apare în niciun atom al acestei lecții (a fost predat în lecția de clasa a X-a) și nici nu se încadrează în cele 4 categorii permise de enunț."
    ]
  },
  {
    "cale": "content/liceu/pedagogic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
    "probleme": [
      "Sectiunea depth-box \"Vrei mai mult?\" (grila de consum litri/100km, exemplul cu prag_minim/Name Box) este identica, cuvant cu cuvant, cu cea din etalonul de la profilul Stiinte - nu a fost adaptata la profilul Pedagogic (nu foloseste niciun exemplu din munca de invatator/educator, ca restul lectiei). Nu contine nimic fals, dar la punctul 5 din grila (adaptare vs. copie) e singura portiune ne-adaptata din lectie."
    ]
  },
  {
    "cale": "content/liceu/tehnologic/cls12/m1-competente-digitale/lectia3-calcul-tabelar.html",
    "probleme": [
      "Exercitiul 3 (Nivel performanta, sectiunea 'buletin de control dimensional') cere in rezolvare formula D2: =IF(ABS(C2)<=$G$2;\"admis\";\"rebut\") - foloseste functia ABS, care NU apare nicaieri in cele 6 atomi ai lectiei si nici in lista de functii predate ('SUM, AVERAGE, MIN, MAX, COUNT, COUNTIF si IF' - titlul atomului 3 si obiectivele lectiei enumera explicit doar aceste 7 functii). Lectia chiar arata, la atomul 3, exact acelasi scenariu de toleranta bilaterala (control piesa, +/- 0,05 mm) rezolvat CORECT fara ABS, printr-un IF imbricat cu doua conditii separate (C2>0,05 ... C2<-0,05 ... altfel admis). Exercitiul de nivel maxim insa introduce tacit o functie noua, nepredata, in loc sa refoloseasca modelul (IF imbricat) chiar predat cu doua propozitii mai sus. Un elev care a invatat doar ce e in lectie nu stie ce e ABS() cand ajunge la rezolvare. (Verificat: restul calculelor din toate cele 3 exercitii sunt corecte numeric, iar chestionarele au toate cheile corecte, fara variante-cursa dupa lungime si fara indicii care dau litera raspunsului; subiectul predat e in intregime 'calcul tabelar - proba D', fara resturi din vechiul subiect despre site-uri web; exemplele sunt adaptate autentic profilului tehnologic/auto, nu doar o traducere cuvant-cu-cuvant a variantei stiinte.)"
    ]
  },
  {
    "cale": "content/liceu/umanist/cls12/m1-competente-digitale/lectia5-editare-imagini.html",
    "probleme": [
      "Eroare de plasare UI (atomul 3, pasul 2): textul spune \"fila Home -> grupul Tools -> Select\", dar in Paint instrumentul Select se afla in grupul Image (langa Crop/Resize/Rotate), nu in grupul Tools (Pencil/Fill/Text/Eraser/Color picker/Magnifier). Nu apare formulat asa in nicio alta lectie de pe site - pare introdusa in aceasta rescriere.",
      "De verificat separat (nu specific acestei rescrieri): scurtatura Ctrl+Shift+X pentru Crop in Paint nu e documentata oficial de Microsoft; apare insa identic si in alte 2-3 lectii ale site-ului (stiinte, tehnologic), deci pare o conventie preluata dintr-o sursa comuna, nu o inventie a acestui fisier."
    ]
  },
  {
    "cale": "content/liceu/stiinte/cls12/m1-competente-digitale/lectia5-editare-imagini.html",
    "probleme": [
      "Eroare factuala in Atomul 2 (sectiunea 'Unde se face redimensionarea'): lectia afirma ca fereastra GIMP 'Scalare imagine' (Image > Scale Image) contine campurile 'Rezolutie X / Y' unde se seteaza DPI-ul. In realitate acele campuri de rezolutie apar intr-o fereastra separata, 'Dimensiune de tipar' (Image > Print Size) - Scale Image are doar Latime/Inaltime in pixeli. Un elev care cauta DPI-ul in dialogul indicat de lectie nu il gaseste acolo."
    ]
  },
  {
    "cale": "content/liceu/stiinte/cls9/m1-sisteme-retele/lectia2-retele-internet.html",
    "probleme": [
      "Minor, punctul 4 (exercitii cer ceva nepredat): teoria (atom 4, sectiunea 'Privat vs. public') declara private DOAR adresele care incep cu 192.168. sau 10. — intervalul 172.16.0.0-172.31.255.255 nu e mentionat niciodata in lectie. La Exercitiul 2b insa, rezolvarea afirma despre 172.16.4.9 ca este 'de asemenea adresa privata', desi elevul nu a primit niciunde regula care sa-i permita sa deduca asta din teoria predata in aceasta lectie. Nu e o cifra gresita (172.16.4.9 e intr-adevar privata in realitate), dar e cunostinta folosita in barem fara sa fi fost predata explicit — un elev care se bazeaza strict pe ce scrie lectia n-are cum sa justifice acest raspuns."
    ]
  }
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'reparate', 'nereparate', 'ce_am_schimbat'],
  properties: {
    fisier: { type: 'string' },
    reparate: { type: 'integer' },
    nereparate: { type: 'integer' },
    ce_am_schimbat: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['defecte_reparate', 'nimic_altceva_stricat', 'explicatie'],
  properties: {
    defecte_reparate: { type: 'boolean' },
    nimic_altceva_stricat: { type: 'boolean' },
    explicatie: { type: 'string' },
  },
}

phase('Repara')
log('Repar ' + LUCRU.reduce((a, x) => a + x.probleme.length, 0) + ' probleme de fond, in ' + LUCRU.length + ' fisiere.')

const rez = await pipeline(
  LUCRU,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. O lectie tocmai rescrisa are defecte de FOND gasite de un corector. Le repari, punctual.\n\n' +
    'LECTIA: ' + REPO + L.cale + '\n\n' +
    'DEFECTELE SEMNALATE (' + L.probleme.length + '):\n' +
    L.probleme.map((s, i) => (i + 1) + '. ' + s).join('\n\n') + '\n\n' +
    'PASUL 1 - citeste lectia pe scurt si vezi exact locurile semnalate:\n' +
    'python "' + DIGEST + '" "' + L.cale.split('/').slice(0, -1).join('/') + '"\n' +
    'NU citi HTML-ul brut intreg - deschide doar bucatile de care ai nevoie (grep pe fraza semnalata, apoi citeste in jurul ei).\n\n' +
    'PASUL 2 - judeca fiecare defect INAINTE sa scrii. Corectorul poate gresi. Daca unul nu exista cu adevarat, nu-l "repara": numara-l la nereparate si spune de ce.\n\n' +
    'PASUL 3 - repara-le, cu Edit pe bucata exacta, nu rescriind lectia:\n' +
    '1. CIFRE si CALCULE: verifica tu socoteala inainte de a o scrie. Daca o concluzie isi contrazice propriile cifre, corecteaza concluzia, nu cifrele - sau invers, dupa cum e adevarul.\n' +
    '2. EXERCITII care cer ceva NEPREDAT: doua ieșiri corecte, alege-o pe cea mai buna pentru lectia asta - fie aduci pasul in lectie (daca e mic si tine de subiect), fie rezolvarea spune DESCHIS "pasul asta cere X, care nu apare in lectie". A doua e mereu acceptabila; sa te prefaci ca s-a predat, nu.\n' +
    '3. AFIRMATII despre interfata (unde sta un buton, ce scurtatura are): daca nu poti sustine afirmatia, scrie varianta prudenta (numeste fila, nu grupul exact) sau scoate-o. Nu inventa o alta afirmatie tare in loc.\n' +
    '4. CONTINUT COPIAT dintr-un alt profil: rescrie exemplele pentru profilul ' + L.cale.split('/')[2] + ', pastrand ideea.\n\n' +
    'NU ATINGE: numele fisierului, calea, cheile de progres, caile catre scripturi, legaturile inainte/inapoi.\n' +
    'Romana FARA diacritice, ca in restul sitului.\n\n' +
    'PASUL 4 - verifica-te, intr-un singur apel Bash:\n' +
    'python "' + POARTA + '" "' + L.cale + '" && python "' + QIO + '" dump "' + L.cale + '"\n\n' +
    'Raporteaza cate ai reparat, cate ai lasat (si de ce), si pe scurt ce ai schimbat.',
    { label: 'repar-fond:' + L.cale.split('/').slice(-1), phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.reparate) return { L, r, verificare: null }
    return agent(
      'Esti corector. Cineva tocmai a reparat defecte de fond intr-o lectie scolara. Verifica DOUA lucruri.\n\n' +
      'LECTIA: ' + REPO + L.cale + '\n\n' +
      'DEFECTELE care trebuiau reparate:\n' +
      L.probleme.map((s, i) => (i + 1) + '. ' + s).join('\n\n') + '\n\n' +
      'Ruleaza intai poarta: python "' + POARTA + '" "' + L.cale + '"\n' +
      'Apoi citeste locurile semnalate (grep pe fraza, apoi in jurul ei). NU citi HTML-ul brut intreg.\n\n' +
      '1. AU DISPARUT defectele? La cele de calcul, REFA tu socoteala - nu te lua dupa ce scrie in text. (defecte_reparate)\n' +
      '2. S-a stricat altceva? A ramas lectia coerenta, cu chestionarele care se parseaza si exercitiile care cer doar ce s-a predat? (nimic_altceva_stricat)\n\n' +
      'Nu semnala stil sau lungime. Explica scurt si concret ce ai vazut.',
      { label: 'reverif-fond:' + L.cale.split('/').slice(-1), phase: 'Reverifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const rep = bune.reduce((a, x) => a + ((x.r && x.r.reparate) || 0), 0)
const lasate = bune.reduce((a, x) => a + ((x.r && x.r.nereparate) || 0), 0)
const ramase = bune.filter(x => x.verificare && (!x.verificare.defecte_reparate || !x.verificare.nimic_altceva_stricat))

log('Reparate: ' + rep + '. Lasate (corectorul gresise): ' + lasate + '. Ramase cu probleme: ' + ramase.length + '.')

return {
  fisiere: LUCRU.length,
  reparate: rep,
  lasate: lasate,
  ramase_cu_probleme: ramase.map(x => ({ fisier: x.L.cale, ce_zice_corectorul: x.verificare.explicatie })),
  schimbari: bune.filter(x => x.r && x.r.reparate).map(x => ({ fisier: x.L.cale, ce: x.r.ce_am_schimbat })),
}
