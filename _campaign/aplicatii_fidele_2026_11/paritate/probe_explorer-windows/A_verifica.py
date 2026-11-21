# Verificarea mecanica a parte_A.json: JSON valid, campurile cerute, si fiecare dovada (veche / din biblioteca / exercitiu)
# indica o linie existenta care nu e comentariu. Ultima linie tiparita = numarul de probleme.
import json, os, re, sys
AICI = os.path.dirname(os.path.abspath(__file__))
PS = os.path.join(AICI, '..', 'proba_src')
RAD = os.path.normpath(os.path.join(AICI, '..', '..', '..', '..'))   # LearningHub_fidel
d = json.load(open(os.path.join(AICI, 'parte_A.json'), encoding='utf-8'))
CAMPURI = ['id', 'aplicatie', 'cheie', 'functie', 'grup', 'gest', 'vechi_dovada', 'unde', 'ceruta_de_exercitiu', 'exercitii', 'biblioteca', 'biblioteca_dovada', 'lipsa', 'nota']
cache = {}
def linii(cale):
    if cale not in cache:
        cache[cale] = open(cale, encoding='utf-8').read().split('\n')
    return cache[cale]
prob = []
def e_comentariu(t):
    s = t.strip()
    return not s or s.startswith('//') or s.startswith('/*') or s.startswith('*') or s.startswith('<!--')
def verif(baza, rel, n, unde):
    cale = os.path.join(baza, rel)
    if not os.path.isfile(cale):
        prob.append(f'{unde}: fisier lipsa {rel}'); return
    L = linii(cale)
    if n < 1 or n > len(L):
        prob.append(f'{unde}: {rel}:{n} peste {len(L)} linii'); return
    if e_comentariu(L[n - 1]):
        prob.append(f'{unde}: {rel}:{n} e comentariu / gol: {L[n-1][:80]!r}')
REF_BIB = re.compile(r'(aplicatii/(?:date/)?[\w]+\.(?:js|json)):(\d+)')
REF_VECHI = re.compile(r'^((?:lectii|jocuri)/[\w./-]+):(\d+)')
for x in d['functii']:
    u = x.get('id')
    for k in CAMPURI:
        if k not in x: prob.append(f'{u}: lipseste campul {k}')
    if x['biblioteca'] not in ('DA', 'PARTIAL', 'NU'): prob.append(f'{u}: biblioteca={x["biblioteca"]}')
    if x['biblioteca'] == 'PARTIAL' and not x['lipsa']: prob.append(f'{u}: PARTIAL fara lipsa')
    if x['ceruta_de_exercitiu'] != bool(x['exercitii']): prob.append(f'{u}: ceruta_de_exercitiu nu se potriveste cu exercitii')
    if x['aplicatie'] not in ('explorer', 'windows'): prob.append(f'{u}: aplicatie {x["aplicatie"]}')
    for v in x['vechi_dovada']:
        m = REF_VECHI.match(v)
        if not m: prob.append(f'{u}: vechi_dovada fara forma cale:linie {v}'); continue
        verif(PS, m.group(1), int(m.group(2)), u)
    refs = REF_BIB.findall(x['biblioteca_dovada'])
    if not refs: prob.append(f'{u}: biblioteca_dovada fara nicio referinta aplicatii/…:linie')
    for rel, n in refs:
        verif(RAD, rel, int(n), u + ' (bib)')
    for e in x['exercitii']:
        m = REF_VECHI.match(e)
        if not m: prob.append(f'{u}: exercitiu fara cale:linie {e}'); continue
        verif(PS, m.group(1), int(m.group(2)), u + ' (ex)')
for g in d['doar_afisate']:
    m = REF_VECHI.match(g['dovada'])
    if not m: prob.append(f'doar_afisate fara cale:linie {g["dovada"]}'); continue
    verif(PS, m.group(1), int(m.group(2)), 'doar_afisate')
ids = [x['id'] for x in d['functii']]
if len(set(ids)) != len(ids): prob.append('id-uri duplicate')
for p in prob: print(p)
print(len(d['functii']), 'functii;', sum(len(x['vechi_dovada']) for x in d['functii']), 'dovezi vechi verificate')
print(len(prob))
