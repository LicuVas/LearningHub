# -*- coding: utf-8 -*-
"""Genereaza wf_rescriere_reparatii.js din probleme_rescriere.json (un agent pe FISIER)."""
import json, io, os
REPO = r"C:\00\Projects\LearningHub"
P = json.load(open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/probleme_rescriere.json"), encoding="utf-8"))

# Doua semnalari nu sunt de reparat aici si le scot, ca sa nu trimit agentul dupa ele:
#  - "toate raspunsurile pe litera a": motorul AMESTECA variantele la fiecare afisare
#    (atomic-learning.js, Fisher-Yates + recalcularea literei), deci pozitia stocata
#    nu se vede la elev. Masurat pe tot situl: b=53,8% din 3403 intrebari - tipar de
#    date, nu defect viu. Nu merita o rescriere care ar introduce defecte noi.
#  - cheile de progres vechi: deja reparate mecanic cu verifica_cheie_vs_fisier.py.
SCOT = ("toate cele 6 raspunsuri corecte sunt", "TOATE cele 6 intrebari din lectie au cheia",
        "raspunsul corect pe pozitia 'a'", "raspunsul corect este varianta A",
        "Identificatorii JS ramasi", "identificatorii de urmarire progres",
        "cheile de urmarire progres/chestionar")

lucru = []
for x in P:
    pastrez = [s for s in x["probleme"] if not any(k in s for k in SCOT)]
    if pastrez:
        lucru.append({"cale": x["fisier"].replace("\\", "/"), "probleme": pastrez})

js = r"""export const meta = {
  name: 'learninghub-reparatii-rescriere',
  description: 'Repara cele __NP__ de probleme de fond gasite de corectori in cele 24 de lectii rescrise',
  phases: [
    { title: 'Repara', detail: '__NF__ fisiere, cate un agent pe fisier' },
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

const LUCRU = __LUCRU__

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
"""

js = (js.replace("__LUCRU__", json.dumps(lucru, ensure_ascii=False, indent=2))
        .replace("__NF__", str(len(lucru)))
        .replace("__NP__", str(sum(len(x["probleme"]) for x in lucru))))
dest = os.path.join(REPO, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_rescriere_reparatii.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print("scris:", dest)
print("fisiere:", len(lucru), "| probleme de reparat:", sum(len(x["probleme"]) for x in lucru),
      "| scoase deliberat:", sum(len(x["probleme"]) for x in P) - sum(len(x["probleme"]) for x in lucru))
for x in lucru:
    print("   %-64s %d" % (x["cale"].split("content/")[-1][:64], len(x["probleme"])))
