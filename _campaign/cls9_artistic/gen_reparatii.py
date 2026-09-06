# -*- coding: utf-8 -*-
"""Genereaza wf_cls9_reparatii.js din probleme.json - doar defectele DE FOND."""
import io, os, json, re, sys

R = r"C:\00\Projects\LearningHub"
PB = json.load(io.open(os.path.join(R, "_campaign", "cls9_artistic", "probleme.json"), encoding="utf-8"))

# Ce NU intra in val, deliberat:
#  - tiparele de chei (litera 'd' absenta, ciclul b-d-a-c): motorul amesteca variantele
#    la fiecare afisare (atomic-learning.js, Fisher-Yates + recalcularea literei), deci
#    pozitia stocata nu ajunge la elev. Masurat pe cele 29 de lectii noi: a=26,1%,
#    b=24,8%, c=26,9%, d=22,2% - echilibru bun pe ansamblu.
#  - randurile care incep cu "Poarta"/"Acoperire"/"Exercitiile" etc.: sunt CONFIRMARI
#    scrise de corector, nu probleme.
SCOT_CHEI = r"[Dd]istributia cheilor|tipar ciclic|litera 'd' NU|pozitia raspunsului corect|reechilibrarea"
E_CONFIRMARE = r"^(Poarta|Acoperire|Chestionare: cheile|Exercitiile \(|Exemplele sunt)"

lucru = {}
for x in PB:
    for s in x["probleme"]:
        if re.search(SCOT_CHEI, s) or re.match(E_CONFIRMARE, s):
            continue
        lucru.setdefault(x["fisier"].replace("\\", "/"), []).append(s)

LUCRU = [{"cale": k, "probleme": v} for k, v in lucru.items()]

js = r"""export const meta = {
  name: 'learninghub-cls9-reparatii',
  description: 'Repara defectele de fond gasite de corectori in materia noua de clasa a IX-a',
  phases: [
    { title: 'Repara', detail: '__NF__ fisiere, un agent pe fisier' },
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

const LUCRU = __LUCRU__

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
"""

js = js.replace("__LUCRU__", json.dumps(LUCRU, ensure_ascii=False, indent=2)).replace("__NF__", str(len(LUCRU)))
dest = os.path.join(R, "_campaign", "cls9_artistic", "wf_cls9_reparatii.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print("scris:", dest)
print("fisiere de reparat:", len(LUCRU), "| defecte:", sum(len(x["probleme"]) for x in LUCRU))
for x in LUCRU:
    print("   %-44s %d" % (x["cale"].split("/")[-1], len(x["probleme"])))
