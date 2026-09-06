export const meta = {
  name: 'learninghub-cls9-reparatii',
  description: 'Repara defectele de fond gasite de corectori in materia noua de clasa a IX-a',
  phases: [
    { title: 'Repara', detail: '4 fisiere, un agent pe fisier' },
    { title: 'Reverifica', detail: 'defectul a disparut si nu s-a stricat altceva' },
  ],
}

// Nu intra aici tiparele de chei semnalate la doua lectii (litera 'd' absenta intr-una,
// ciclul b-d-a-c in cealalta): motorul amesteca variantele la fiecare afisare si
// recalculeaza litera corecta, deci pozitia stocata nu ajunge la elev. Pe ansamblul
// celor 29 de lectii noi distributia e oricum buna: a=26,1% b=24,8% c=26,9% d=22,2%.
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const REPO = 'C:/00/Projects/LearningHub/'

const LUCRU = [
  {
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia8-prezentari-baze.html",
    "probleme": [
      "[ESTIMARE, de verificat live in LibreOffice Impress] La atomul 5, sectiunea \"Cum aplici o tema\", lectia afirma ca alegerea coordonatorului se poate face si \"din meniul Diapozitiv -> Schimba diapozitivul coordonator\". Nu am gasit confirmare ca acesta e numele exact al comenzii din interfata Impress (varianta pe care o cunosc cu incredere e dialogul accesibil din meniul Slide, cu alt nume de eticheta, gen \"Model diapozitiv\"/\"Slide Design\"). Functia descrisa exista probabil, dar eticheta exacta a meniului e suspecta de inventare/parafrazare. Inainte de publicare: deschide chiar Impress si verifica textul exact al comenzii, sau elimina fraza si lasa doar ruta prin bara laterala (care e descrisa corect si verificabil)."
    ]
  },
  {
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia1-arhitectura.html",
    "probleme": [
      "FALS/nesigur tehnic (atom 7): scurtatura \"Windows + Pause\" pentru pagina Despre nu functioneaza universal - pe multe instalari Windows 11 recente e dezactivata implicit si necesita o cheie de regiștri (EnabledLegacyWindowsBreakShortcut) ca sa mearga; elevul o poate incerca in laborator si sa nu se intample nimic. Recomandare: scoate linia sau formuleaz-o conditionat.",
      "Exercitiul 2(b) cere sa se noteze si \"sistemul de operare\" (editia/versiunea), dar pasul-cu-pasul din atomul 7 pentru Windows arata explicit doar sectiunea \"Specificatii dispozitiv\" (Procesor, RAM instalata) - nicaieri in corpul lectiei nu se arata unde se citeste editia Windows (sectiunea separata \"Specificatii Windows\" de pe aceeasi pagina Despre), desi rezolvarea presupune ca elevul stie asta. Fix: adauga un rand in pasul 3 al atomului 7 care sa mentioneze si sectiunea Specificatii Windows."
    ]
  },
  {
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia2-procesorul.html",
    "probleme": [
      "EROARE NUMERICA gasita in Exercitiul 3 (nivel performanta), solutia afisata, linia 357: textul spune ca la trecerea de la 4 la 8 nuclee 'castigul de nuclee este de o data si jumatate peste' (pierderea de frecventa fiind 'aproximativ un sfert'). Matematic, 4->8 nuclee inseamna o DUBLARE (crestere de 100%, adica 'o data mai mult' / 'de doua ori'), nu o crestere de 'o data si jumatate' (care ar corespunde fie unui multiplicator de 1,5 -> 6 nuclee, fie unei cresteri de 150% -> 10 nuclee); niciuna din cele doua citiri nu da 8. Concluzia pedagogica (alegerea variantei B) ramane corecta, dar afirmatia cantitativa care o sustine este gresita si ar trebui corectata (de exemplu: 'castigul de nuclee este de patru ori mai mare decat pierderea de frecventa' sau, mai simplu, 'nucleele s-au DUBLAT, in timp ce frecventa a scazut doar cu un sfert')."
    ]
  },
  {
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia6-periferice-intrare.html",
    "probleme": [
      "Linia 181: afirmatia ca optiunea de buton principal (stangaci/dreptaci) la mouse in Ubuntu/GNOME s-ar afla in 'setarile de accesibilitate' pare gresita — in panourile GNOME din Ubuntu 20.04/22.04/24.04, acea optiune (Primary button: Left/Right) sta direct in Settings > Mouse & Touchpad, nu in Universal Access. De verificat pe o instalatie reala si corectat daca e cazul, ca sa nu trimita elevii la un meniu inexistent."
    ]
  }
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'reparate', 'lasate', 'ce_am_schimbat'],
  properties: {
    fisier: { type: 'string' },
    reparate: { type: 'integer' },
    lasate: { type: 'integer' },
    ce_am_schimbat: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['reparat', 'nimic_stricat', 'explicatie'],
  properties: {
    reparat: { type: 'boolean' },
    nimic_stricat: { type: 'boolean' },
    explicatie: { type: 'string' },
  },
}

phase('Repara')
log('Repar ' + LUCRU.reduce((a, x) => a + x.probleme.length, 0) + ' defecte de fond, in ' + LUCRU.length + ' lectii.')

const rez = await pipeline(
  LUCRU,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. O lectie NOUA de clasa a IX-a are defecte de fond gasite de un corector. Le repari punctual, cu Edit pe bucata exacta - NU rescrii lectia.\n\n' +
    'LECTIA: ' + REPO + L.cale + '\n\n' +
    'DEFECTELE SEMNALATE (' + L.probleme.length + '):\n' +
    L.probleme.map((s, i) => (i + 1) + '. ' + s).join('\n\n') + '\n\n' +
    'PASUL 1 - gaseste locurile: grep pe fraza semnalata, apoi citeste in jurul ei. NU citi tot HTML-ul.\n\n' +
    'PASUL 2 - judeca fiecare defect INAINTE sa scrii. Corectorul poate gresi. Daca unul nu exista, nu-l "repara": numara-l la lasate si spune de ce.\n\n' +
    'PASUL 3 - repara:\n' +
    '1. CIFRE si CALCULE: refa tu socoteala inainte de a scrie. Daca o afirmatie cantitativa nu se verifica, corecteaza afirmatia, nu concluzia - sau invers, dupa cum e adevarul.\n' +
    '2. AFIRMATII despre interfata (unde sta un buton, ce scurtatura merge): daca nu poti sustine afirmatia cu certitudine, ai trei iesiri corecte, in ordinea preferintei: (a) scrie ruta pe care o stii sigur si scoate-o pe cea nesigura; (b) formuleaza conditionat, spunand explicit ca depinde de versiune sau de setari; (c) scoate afirmatia. NU inlocui o afirmatie nesigura cu alta la fel de nesigura.\n' +
    '3. EXERCITIU care cere ceva NEARATAT in lectie: fie adaugi in atom pasul lipsa (daca e mic si tine de subiect), fie schimbi cerinta ca sa ceara doar ce s-a aratat. Sa te prefaci ca s-a predat, nu.\n\n' +
    'NU ATINGE: numele fisierului, calea, cheile de progres, Breadcrumb/LearningProgress, caile catre scripturi, legaturile de navigare, si nici ordinea variantelor din chestionare.\n' +
    'Romana FARA diacritice, ca in restul sitului.\n\n' +
    'PASUL 4 - verifica-te, intr-un singur apel Bash:\n' +
    'python "' + POARTA + '" "' + L.cale + '" && python "' + QIO + '" dump "' + L.cale + '"\n\n' +
    'Raporteaza cate ai reparat, cate ai lasat (si de ce), si ce ai schimbat.',
    { label: 'rep-cls9:' + L.cale.split('/').slice(-1), phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.reparate) return { L, r, v: null }
    return agent(
      'Esti corector. O lectie de clasa a IX-a tocmai a fost reparata. Verifica DOUA lucruri.\n\n' +
      'LECTIA: ' + REPO + L.cale + '\n\n' +
      'DEFECTELE care trebuiau reparate:\n' +
      L.probleme.map((s, i) => (i + 1) + '. ' + s).join('\n\n') + '\n\n' +
      'Ruleaza intai: python "' + POARTA + '" "' + L.cale + '"\n' +
      'Apoi citeste locurile semnalate.\n\n' +
      '1. AU DISPARUT defectele? La cele de calcul, REFA tu socoteala. La cele despre interfata, verifica daca formularea noua e sustinuta sau macar prudenta. (reparat)\n' +
      '2. S-a stricat altceva? Lectia e coerenta, chestionarele se parseaza, exercitiile cer doar ce s-a predat? (nimic_stricat)\n\n' +
      'Nu semnala stil sau lungime, si nu semnala ordinea literelor din chestionare. Explica scurt.',
      { label: 'rever-cls9:' + L.cale.split('/').slice(-1), phase: 'Reverifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, v }))
  }
)

const bune = rez.filter(Boolean)
const rep = bune.reduce((a, x) => a + ((x.r && x.r.reparate) || 0), 0)
const lasate = bune.reduce((a, x) => a + ((x.r && x.r.lasate) || 0), 0)
const ramase = bune.filter(x => x.v && (!x.v.reparat || !x.v.nimic_stricat))
log('Reparate: ' + rep + '. Lasate: ' + lasate + '. Ramase cu probleme: ' + ramase.length + '.')

return {
  fisiere: LUCRU.length,
  reparate: rep,
  lasate: lasate,
  ramase: ramase.map(x => ({ fisier: x.L.cale, ce_zice: x.v.explicatie })),
  schimbari: bune.filter(x => x.r && x.r.reparate).map(x => ({ fisier: x.L.cale, ce: x.r.ce_am_schimbat })),
}
