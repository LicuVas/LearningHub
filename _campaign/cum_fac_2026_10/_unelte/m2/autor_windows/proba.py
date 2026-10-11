import json, re
F = r'C:/00/Projects/LearningHub/cum-fac/_sursa/fise_m2_windows.json'
C = r'C:/00/Projects/LearningHub/cum-fac/_teste/catalog_titluri.json'
fise = json.load(open(F, encoding='utf-8'))
cat = {x['id'] for x in json.load(open(C, encoding='utf-8'))}
diacr = re.compile(r'[ăâîșțşţĂÂÎȘȚ]')
prob = 0
from collections import Counter
per = Counter()
for x in fise:
    per[(x['clasa'], x['lectia'])] += 1
    if x['id'] in cat:
        print('DUBLURA cu catalogul:', x['id']); prob += 1
    if len(x['titlu']) > 70:
        print('titlu lung', x['id'], len(x['titlu'])); prob += 1
    for f in x['formulari']:
        if diacr.search(f):
            print('diacritice in formulare', x['id'], f); prob += 1
    if len(set(x['formulari'])) != len(x['formulari']):
        print('formulari repetate', x['id']); prob += 1
    for r in x['inrudite']:
        if r == x['id']:
            print('se trimite la sine', x['id']); prob += 1
print(dict(per))
print('fise', len(fise))
print(prob)
