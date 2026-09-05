# -*- coding: utf-8 -*-
"""Genereaza wf_t7b_reparatii.js din defecte_t7b.json (un agent pe DEFECT,
nu pe fisier: acelasi defect sta in 1-5 profiluri-frate, iar corectura e aceeasi)."""
import json, io, os
REPO = r"C:\00\Projects\LearningHub"
D = json.load(open(os.path.join(REPO, "_campaign/proba_elevi_2026_09_03/valuri/defecte_t7b.json"), encoding="utf-8"))
D = [x for x in D if x["fisiere"]]

js = r"""export const meta = {
  name: 'learninghub-reparatii-aprofundare',
  description: 'Repara cele __NC__ de casete "Vrei mai mult?" gasite gresite de corectorii valului t7b',
  phases: [
    { title: 'Repara', detail: '__ND__ defecte distincte, cate un agent pe defect' },
    { title: 'Reverifica', detail: 'a disparut defectul, in TOATE profilurile-frate' },
  ],
}

// Un agent pe DEFECT, nu pe fisier: lectiile de pe profiluri diferite sunt copii,
// deci acelasi defect sta in 1-5 fisiere si corectura e aceeasi munca de gandit,
// facuta o data. Lista vine din valuri/extinde_t7.py, care cauta fiecare defect
// dupa o expresie distinctiva din CASETA (nu din lectie).
const DIO = 'C:/00/Projects/LearningHub/tools/depth_io.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'

const DEFECTE = __DEFECTE__

const R_SCHEMA = {
  type: 'object',
  required: ['inlocuite', 'ce_am_schimbat'],
  properties: {
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
log('Repar ' + DEFECTE.reduce((a, d) => a + d.fisiere.length, 0) + ' casete, in ' + DEFECTE.length + ' defecte distincte.')

const rez = await pipeline(
  DEFECTE,
  (D) => agent(
    'Esti profesor de Informatica/T.I.C. Caseta "Vrei mai mult?" de la finalul unei lectii este GRESITA. Un corector a descris exact defectul. O rescrii.\n\n' +
    'DEFECTUL SEMNALAT:\n' + D.ce + '\n\n' +
    'FISIERELE cu acelasi defect (' + D.fisiere.length + ' - sunt copii pe profiluri diferite):\n' +
    D.fisiere.map(f => '  ' + f).join('\n') + '\n\n' +
    'PASUL 1 - citeste caseta de acum si ce s-a predat, INTR-UN SINGUR apel Bash:\n' +
    'python "' + DIO + '" dump "' + D.fisiere[0] + '" && python "' + DIGEST + '" "' + D.fisiere[0].split('/').slice(0, -1).join('/') + '"\n' +
    'NU citi HTML-ul brut. Ca sa vezi TEXTUL casetei de acum (dump nu ti-l da), citeste doar bucata din jurul lui class="depth-box" din primul fisier.\n\n' +
    'PASUL 2 - judeca defectul inainte sa scrii. Corectorul poate gresi. Daca, dupa ce ai citit lectia, defectul NU exista cu adevarat, NU schimba nimic: raporteaza inlocuite=0 si scrie de ce nu era un defect. E un raspuns valid si util.\n\n' +
    'PASUL 3 - daca e real, scrie caseta NOUA. Structura ramane aceeasi:\n' +
    '  a) O PROVOCARE practica - ceva de facut, nu de citit. Concreta, verificabila, care porneste de unde s-a oprit lectia.\n' +
    '  b) O INTREBARE DE GANDIT - de tipul "de ce", care duce la mecanism, nu la o definitie. Fara raspuns.\n' +
    '  c) O DESCHIDERE - unde se foloseste in lumea reala, sau ce urmeaza in materie. Concret, cu un exemplu real.\n' +
    'Reguli:\n' +
    '1. Repara EXACT defectul semnalat. Daca doar un paragraf era gresit, pastreaza fondul celorlalte doua - le poti reformula, dar nu le arunca daca erau bune.\n' +
    '2. Daca defectul era "nu e mai mult decat lectia": caseta noua trebuie sa aduca un fapt, o unealta sau un mecanism care NU apare in corpul lectiei. Verifica in digest ca nu e deja acolo.\n' +
    '3. Daca defectul era o afirmatie FALSA: nu o inlocui cu alta afirmatie tare pe care n-o poti sustine. Mai bine ceva mai modest si adevarat.\n' +
    '4. Romana FARA diacritice. HTML simplu: <p>, <ul>, <li>, <strong>, <code>. LEGATURI: cel mai bine NICIUNA - unealta refuza orice legatura nedovedita.\n' +
    '5. Lungime: intre 200 si 1600 de caractere.\n\n' +
    'PASUL 4 - scrie UN SINGUR JSON {"corp": "<p>...</p>"} (acelasi text pentru toate fisierele, sunt copii) si aplica-l pe fiecare cu comanda de INLOCUIRE, grupat intr-un singur apel Bash:\n' +
    D.fisiere.map(f => 'python "' + DIO + '" replace "' + f + '" <calea-json>').join(' && ') + '\n' +
    'Foloseste un nume de fisier JSON unic (pot rula si alte sesiuni in paralel). Unealta scoate caseta veche DOAR daca textul nou trece toate garzile - daca refuza, citeste motivul si corecteaza, nu forta.\n\n' +
    'PASUL 5 - confirma cu dump pe toate fisierele ca are_caseta e true, si verifica intr-unul din ele ca textul nou e chiar acolo.\n\n' +
    'Raporteaza cate ai inlocuit si ce ai schimbat fata de varianta gresita.',
    { label: 'repar-apr:#' + D.idx, phase: 'Repara', model: 'opus', schema: R_SCHEMA }
  ),
  (r, D) => {
    if (!r || !r.inlocuite) return { D, r, verificare: null }
    return agent(
      'Esti corector. Cineva tocmai a rescris o caseta "Vrei mai mult?" care era gresita, in ' + D.fisiere.length + ' fisiere (copii pe profiluri diferite). Verifica DOUA lucruri.\n\n' +
      'DEFECTUL care trebuia reparat:\n' + D.ce + '\n\n' +
      'FISIERELE:\n' + D.fisiere.map(f => '  ' + f).join('\n') + '\n\n' +
      'Citeste, intr-un singur apel Bash:\n' +
      'python "' + DIO + '" dump "' + D.fisiere[0] + '" && python "' + DIGEST + '" "' + D.fisiere[0].split('/').slice(0, -1).join('/') + '"\n' +
      'plus bucata din jurul lui class="depth-box" din fiecare fisier, ca sa vezi textul de acum. NU citi HTML-ul brut intreg.\n\n' +
      '1. A DISPARUT defectul descris? Si caseta noua chiar aduce ceva peste lectie, fara afirmatii false? (defect_reparat)\n' +
      '2. S-a stricat altceva? Fiecare fisier are exact o caseta? Toate fisierele au primit acelasi text nou (nu doar primul)? (nimic_altceva_stricat)\n\n' +
      'Nu semnala chestiuni de stil sau de lungime. Explica scurt si concret.',
      { label: 'reverif-apr:#' + D.idx, phase: 'Reverifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ D, r, verificare: v }))
  }
)

const bune = rez.filter(Boolean)
const inl = bune.reduce((a, x) => a + ((x.r && x.r.inlocuite) || 0), 0)
const nereparate = bune.filter(x => x.verificare && (!x.verificare.defect_reparat || !x.verificare.nimic_altceva_stricat))
const nemodificate = bune.filter(x => x.r && !x.r.inlocuite)

log('Casete inlocuite: ' + inl + '. Nemodificate (corectorul gresise): ' + nemodificate.length + '. Ramase cu probleme: ' + nereparate.length + '.')

return {
  defecte: DEFECTE.length,
  casete_inlocuite: inl,
  nemodificate: nemodificate.map(x => ({ idx: x.D.idx, de_ce: x.r.ce_am_schimbat })),
  ramase_cu_probleme: nereparate.map(x => ({ idx: x.D.idx, ce_zice_corectorul: x.verificare.explicatie })),
  schimbari: bune.filter(x => x.r && x.r.inlocuite).map(x => ({ idx: x.D.idx, fisiere: x.D.fisiere.length, ce: x.r.ce_am_schimbat })),
}
"""

payload = json.dumps([{"idx": x["idx"], "ce": x["ce"], "fisiere": x["fisiere"]} for x in D],
                     ensure_ascii=False, indent=2)
js = (js.replace("__DEFECTE__", payload)
        .replace("__ND__", str(len(D)))
        .replace("__NC__", str(sum(len(x["fisiere"]) for x in D))))
dest = os.path.join(REPO, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_t7b_reparatii.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print("scris:", dest, "|", len(js), "caractere |", len(D), "defecte |",
      sum(len(x["fisiere"]) for x in D), "casete")
