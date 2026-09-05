# -*- coding: utf-8 -*-
"""Genereaza wf_obiective.js: lectiile care n-au sectiunea de OBIECTIV.

Poarta cere <section class="goal-section">. Cele semnalate n-o au deloc (una are
continutul de obiectiv, dar intr-un info-box, nu in sectiunea asteptata).
Obiectivul nu se poate scrie mecanic: se citeste lectia si se spune ce va putea
FACE elevul dupa ea. Deci: agent, dar unul ieftin - e extragere, nu curriculum nou.
"""
import io, os, re, sys, json, subprocess

R = r"C:\00\Projects\LearningHub"
G = os.path.join(R, "tools", "verifica_lectie.py")

# aflu lista LIVE, nu dintr-un json vechi
tinte = []
for dp, _, fns in os.walk(os.path.join(R, "content")):
    if ".backup" in dp.lower():
        continue
    for f in sorted(fns):
        if not f.endswith(".html") or f == "index.html":
            continue
        p = os.path.join(dp, f)
        src = io.open(p, encoding="utf-8", errors="replace").read()
        if 'class="lesson-frame"' not in src:
            continue          # nu e lectie in format C
        if 'class="goal-section"' in src:
            continue
        tinte.append(os.path.relpath(p, R).replace(os.sep, "/"))

print("lectii fara sectiunea de obiectiv:", len(tinte))
for x in tinte:
    print("   ", x)

js = r"""export const meta = {
  name: 'learninghub-obiective-lipsa',
  description: 'Scrie sectiunea de OBIECTIV la cele __N__ de lectii care n-o au',
  phases: [
    { title: 'Scrie', detail: '__N__ lectii, un agent pe lectie' },
  ],
}

// De ce un agent si nu o unealta: obiectivul spune ce va putea FACE elevul dupa
// lectie. Asta se citeste din continut, nu se genereaza dintr-un sablon. Dar e
// extragere si reformulare, nu curriculum nou => sonnet.
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const DIGEST = 'C:/00/Projects/LearningHub/tools/lesson_digest.py'
const REPO = 'C:/00/Projects/LearningHub/'

const LECTII = __LECTII__

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'scris', 'nota'],
  properties: {
    fisier: { type: 'string' },
    scris: { type: 'boolean' },
    nota: { type: 'string' },
  },
}

phase('Scrie')
log('Scriu sectiunea de obiectiv la ' + LECTII.length + ' lectii.')

const rez = await parallel(LECTII.map((cale) => () => agent(
  'Esti profesor de Informatica/T.I.C. O lectie de pe situl scolii nu are sectiunea de OBIECTIV - elevul deschide lectia fara sa stie ce va sti sa faca la final. O scrii.\n\n' +
  'LECTIA: ' + REPO + cale + '\n\n' +
  'PASUL 1 - citeste ce preda lectia:\n' +
  'python "' + DIGEST + '" "' + cale.split('/').slice(0, -1).join('/') + '"\n' +
  'Daca lectia nu apare in digest (numele nu incepe cu "lectia"), citeste doar fisierul ei.\n' +
  'Uita-te la titlurile atomilor, la exercitii si la caseta de recapitulare: acolo scrie, de fapt, ce invata elevul.\n\n' +
  'PASUL 2 - vezi cum arata sectiunea la o lectie care o ARE, ca sa folosesti aceeasi forma:\n' +
  'grep -A 20 \'class="goal-section"\' "' + REPO + 'content/tic/cls7/m2-word-avansat/lectia1-liste.html"\n\n' +
  'PASUL 3 - scrie sectiunea si INSEREAZ-O in fisier, imediat DUPA </section> care inchide <section class="lesson-frame"> (adica intre partea de intro si atomi). Foloseste Edit, nu rescrie fisierul.\n' +
  'Forma:\n' +
  '  <section class="goal-section">\n' +
  '   <h2>Obiectivul lectiei</h2>\n' +
  '   <p>Dupa aceasta lectie vei putea:</p>\n' +
  '   <ul><li>Sa ...</li>...</ul>\n' +
  '  </section>\n\n' +
  'REGULI:\n' +
  '1. Intre 3 si 6 puncte, fiecare incepand cu un VERB de actiune ("Sa creezi...", "Sa recunosti...", "Sa explici..."). Nu "Sa intelegi" - nu se poate verifica.\n' +
  '2. Fiecare punct trebuie sa corespunda unui lucru CHIAR PREDAT in lectie. Nu promite ce nu se livreaza - e defectul pe care il repari, nu unul nou.\n' +
  '3. Daca lectia are deja o lista de tip "Ce vei invata" in alta parte (de exemplu intr-un info-box), FOLOSESTE-O ca sursa si spune in nota ca ai gasit-o - nu inventa alta si nu o lasa dublata: muta continutul in sectiunea noua si scoate caseta veche daca ramane redundanta.\n' +
  '4. Romana FARA diacritice, ca in restul sitului.\n' +
  '5. NU atinge: numele fisierului, cheile de progres, caile catre scripturi, legaturile, atomii, exercitiile.\n\n' +
  'PASUL 4 - verifica:\n' +
  'python "' + POARTA + '" "' + cale + '"\n' +
  'Nu trebuie sa mai zica "lipseste sectiunea: obiectiv". Daca semnaleaza altceva, raporteaza - nu repara alt defect.\n\n' +
  'Raporteaza daca ai scris si o nota scurta: de unde ai luat obiectivele si ce a mai ramas semnalat de poarta.',
  { label: 'obiectiv:' + cale.split('/').slice(-1), phase: 'Scrie', model: 'sonnet', schema: R_SCHEMA }
)))

const bune = rez.filter(Boolean)
const scrise = bune.filter(x => x && x.scris)
log('Obiective scrise: ' + scrise.length + ' din ' + LECTII.length + '.')

return {
  planificate: LECTII.length,
  scrise: scrise.length,
  nescrise: bune.filter(x => x && !x.scris).map(x => ({ fisier: x.fisier, nota: x.nota })),
  note: scrise.filter(x => x.nota && x.nota.length > 40).map(x => ({ fisier: x.fisier, nota: x.nota })),
}
"""

js = js.replace("__LECTII__", json.dumps(tinte, ensure_ascii=False, indent=2)).replace("__N__", str(len(tinte)))
dest = os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "wf_obiective.js")
io.open(dest, "w", encoding="utf-8", newline="\n").write(js)
print()
print("scris:", dest)
