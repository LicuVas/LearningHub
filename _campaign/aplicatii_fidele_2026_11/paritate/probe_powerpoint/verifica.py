# Verifică powerpoint.json: fiecare cale:linie din vechi_dovada (relativ la proba_src) există și nu e comentariu / gol;
# primul număr din biblioteca_dovada există în aplicatii/powerpoint.js.
import json, os, re
P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = 'C:/00/Projects/LearningHub_fidel/'
d = json.load(open(os.path.join(P, 'powerpoint.json'), encoding='utf-8'))
cache = {}
def linii(c):
    if c not in cache: cache[c] = open(c, encoding='utf-8').read().split('\n')
    return cache[c]
rele = 0
for x in d['functii']:
    for v in x['vechi_dovada']:
        cale, nr = v.rsplit(':', 1); a = int(nr.split('-')[0])
        L = linii(os.path.join(P, 'proba_src', cale))
        t = L[a - 1].strip() if a <= len(L) else ''
        if not t or t.startswith(('/*', '//', '*')):
            rele += 1; print('VECHI', x['id'], v, repr(t[:60]))
    m = re.match(r'(aplicatii/[\w/.]+\.js):(\d+)', x['biblioteca_dovada'])
    if m:
        L = linii(R + m.group(1)); a = int(m.group(2)); t = L[a - 1].strip() if a <= len(L) else ''
        if not t or t.startswith(('/*', '//', '*')): rele += 1; print('NOU', x['id'], m.group(0), repr(t[:60]))
    elif x['biblioteca'] != 'NU': rele += 1; print('FARA LINIE', x['id'])
for g in d['doar_afisate']:
    cale, nr = g['dovada'].rsplit(':', 1); L = linii(os.path.join(P, 'proba_src', cale)); t = L[int(nr) - 1].strip()
    if not t or t.startswith(('/*', '//')): rele += 1; print('DOAR', g['dovada'], repr(t[:60]))
print(rele)
