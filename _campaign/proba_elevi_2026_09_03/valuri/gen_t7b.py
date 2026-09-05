# -*- coding: utf-8 -*-
"""Genereaza wf_t7b.js - caseta de aprofundare, un agent pe MODUL (nu pe lectie)."""
import json, io, os
REPO = r"C:\00\Projects\LearningHub"
loturi = json.load(open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/valuri/loturi_t7b.json"), encoding="utf-8"))
raw = ["'" + x["modul"] + "|" + ",".join(os.path.basename(c) for c in x["lectii"]) + "'" for x in loturi]

js = r"""export const meta = {
  name: 'learninghub-aprofundare-pe-modul',
  description: 'Caseta "Vrei mai mult?" la cele 507 lectii care n-au nicio iesire in sus - un agent pe MODUL',
  phases: [
    { title: 'Scrie', detail: '__N__ loturi de modul, cate un agent pe lot' },
    { title: 'Verifica', detail: 'chiar e mai mult decat lectia, si e adevarat' },
  ],
}

// Acelasi castig ca la wf_t6b: un agent pe MODUL, nu pe lectie. wf_t7.js deschidea
// 507 agenti de scriere plus verificarea, in doua rulari. Grupate pe modul, cu
// plafon de 6 lectii pe lot ca digestul sa ramana mic, raman __N__ de loturi.
// Lista se regenereaza cu valuri/scan_t7.py (care se tine de lista CURATATA din
// wf_t7.js - scanarea bruta a discului prindea si pagini care nu-s lectii).
const DIO = 'C:/00/Projects/LearningHub/tools/depth_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'

const LOTURI_RAW = [__RAW__]

const LOTURI = LOTURI_RAW.map((s, i) => {
  const p = s.split('|')
  return { i, modul: p[0], lectii: p[1].split(',').map(f => p[0] + '/' + f) }
})

const R_SCHEMA = {
  type: 'object',
  required: ['modul', 'scrise', 'sarite', 'motive'],
  properties: {
    modul: { type: 'string' },
    scrise: { type: 'integer' },
    sarite: { type: 'integer' },
    motive: { type: 'string' },
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
        required: ['fisier', 'ce_e_gresit'],
        properties: { fisier: { type: 'string' }, ce_e_gresit: { type: 'string' } },
      },
    },
  },
}

phase('Scrie')
log('Scriu caseta de aprofundare la ' + LOTURI.reduce((a, x) => a + x.lectii.length, 0) + ' lectii, in ' + LOTURI.length + ' loturi de modul.')

const rez = await pipeline(
  LOTURI,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. Scrii caseta "Vrei mai mult?" pentru finalul fiecarei lectii dintr-un modul.\n\n' +
    'DE CE: pe tot situl nu exista NICIO lectie cu ceva peste minimul obligatoriu. Elevul bun termina in 10 minute si se plictiseste. Caseta asta e singura lui iesire in sus.\n\n' +
    'MODULUL: ' + L.modul + '\n' +
    'LECTIILE de lucru (' + L.lectii.length + '):\n' + L.lectii.map(c => '  ' + c).join('\n') + '\n\n' +
    'PASUL 1 - citeste O SINGURA DATA continutul modulului:\n' +
    'python "' + DIGEST + '" "' + L.modul + '"\n' +
    'NU citi HTML-ul brut - digestul e mult mai mic si are tot ce iti trebuie.\n\n' +
    'PASUL 2 - vezi structura fiecarei lectii, INTR-UN SINGUR apel Bash:\n' +
    L.lectii.map(c => 'python "' + DIO + '" dump "' + c + '"').join(' && ') + '\n' +
    'Iti da titlul, obiectivul, titlurile atomilor, punctele din recapitulare si daca are deja caseta. Lucrezi DOAR la cele fara caseta.\n\n' +
    'PASUL 3 - pentru FIECARE lectie, scrie 3 elemente, in ordinea asta:\n' +
    '  a) O PROVOCARE practica - ceva de facut, nu de citit. Concreta, verificabila, care porneste de unde s-a oprit lectia. Nu "exerseaza mai mult".\n' +
    '  b) O INTREBARE DE GANDIT - de tipul "de ce", care sa duca la mecanismul din spate, nu la o definitie. Nu ii da raspunsul.\n' +
    '  c) O DESCHIDERE - unde se foloseste asta in lumea reala, sau ce urmeaza dupa lectia asta in materie. Doua-trei propozitii, concret, cu un exemplu real.\n\n' +
    'REGULI DE FOND:\n' +
    '1. Trebuie sa fie MAI MULT decat lectia, nu o repetare cu alte cuvinte. Daca cineva care a citit lectia nu invata nimic nou din caseta, ai gresit.\n' +
    '2. Casetele din acelasi modul trebuie sa fie DIFERITE intre ele. Fiecare lectie are subiectul ei; o provocare care ar merge la fel de bine la oricare dintre lectii inseamna ca n-ai citit lectia.\n' +
    '3. Tot ce afirmi trebuie sa fie ADEVARAT: functii care exista, cifre care se verifica, exemple reale. Nu inventa.\n' +
    '4. LEGATURI: cel mai bine NICIUNA. Unealta REFUZA orice legatura pe care n-o poate dovedi. Daca vrei totusi una: fie catre un fisier care exista chiar in folderul lectiei (verifica intai cu ls), fie catre ro.wikipedia.org / developer.mozilla.org / w3schools.com / docs.python.org / pbinfo.ro / support.microsoft.com. Orice altceva e refuzat.\n' +
    '5. Romana FARA diacritice. HTML simplu: <p>, <ul>, <li>, <strong>, <code>, <a>. NICIODATA <script>, <style>, <iframe>, <form>.\n' +
    '6. Lungime: intre 200 si 1600 de caractere. E o usa, nu inca o lectie.\n\n' +
    'PASUL 4 - cate un JSON pe lectie, in forma {"corp": "<p>...</p><ul><li>...</li></ul>"}, si aplica-le GRUPAT intr-un singur apel Bash:\n' +
    'python "' + DIO + '" apply "<lectia>" <calea-json>\n' +
    'Daca refuza, citeste motivul si corecteaza - nu forta. Foloseste nume de fisiere JSON unice (pot rula si alte sesiuni in paralel).\n\n' +
    'PASUL 5 - confirma, tot intr-un singur apel Bash: dump pe toate lectiile din lot, are_caseta true peste tot.\n\n' +
    'Raporteaza cate ai scris, cate au fost sarite si de ce.',
    { label: 'aprofundare:' + L.modul.split('/').slice(-2).join('/') + '#' + L.i, phase: 'Scrie', model: 'sonnet', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.scrise) return { L, r, verificare: null }
    // Ca la t6b: verificarea e in mare bifat => sonnet, si nu pe toate loturile -
    // doar unde unealta a sarit peste ceva, plus 1 din 4 ca esantion.
    if (!r.sarite && L.i % 4 !== 0) return { L, r, verificare: null }
    return agent(
      'Esti corector. Cineva a scris caseta "Vrei mai mult?" pentru lectiile unui modul. Verifica-le.\n\n' +
      'MODULUL: ' + L.modul + '\n' +
      'LECTIILE: ' + L.lectii.join(', ') + '\n\n' +
      'Citeste, intr-un singur apel Bash:\n' +
      L.lectii.map(c => 'python "' + DIO + '" dump "' + c + '"').join(' && ') + '\n' +
      'si ce s-a predat:\n' +
      'python "' + DIGEST + '" "' + L.modul + '"\n' +
      'NU citi HTML-ul brut.\n\n' +
      'Verifica trei lucruri, in ordinea gravitatii:\n' +
      '1. E chiar MAI MULT decat lectia, sau doar o reformulare a ei? (defectul principal)\n' +
      '2. Are afirmatii FALSE? Functii care nu exista, cifre gresite, exemple inventate.\n' +
      '3. Casetele din modul sunt diferite intre ele, sau se repeta cu alte cuvinte?\n\n' +
      'Nu semnala chestiuni de stil sau de lungime. Raporteaza CURAT sau PROBLEME cu fisier + ce e gresit.',
      { label: 'verif-apr:' + L.modul.split('/').slice(-1) + '#' + L.i, phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const scr = bune.reduce((a, x) => a + ((x.r && x.r.scrise) || 0), 0)
const sar = bune.reduce((a, x) => a + ((x.r && x.r.sarite) || 0), 0)
const cuProbleme = bune.filter(x => x.verificare && x.verificare.verdict === 'PROBLEME')

log('Casete scrise: ' + scr + '. Sarite: ' + sar + '. Loturi cu probleme: ' + cuProbleme.length + '.')

return {
  loturi: LOTURI.length,
  casete_scrise: scr,
  sarite: sar,
  loturi_cu_probleme: cuProbleme.length,
  probleme: cuProbleme.flatMap(x => x.verificare.probleme || []),
  motive: bune.filter(x => x.r && x.r.sarite).map(x => ({ modul: x.L.modul, motive: x.r.motive })).slice(0, 40),
}
"""

js = js.replace("__RAW__", ",".join(raw)).replace("__N__", str(len(loturi)))
dest = os.path.join(REPO, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_t7b.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print("scris:", dest, "|", len(js), "caractere |", len(loturi), "loturi")
