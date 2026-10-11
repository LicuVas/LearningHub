import json, sys, re, unicodedata
B = 'C:/00/Projects/LearningHub/cum-fac/_sursa/'
D = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/formulari/'
fise = []
for f in ('fise_m2_windows', 'fise_m2_audio_evaluari'):
    fise += json.load(open(B + f + '.json', encoding='utf-8'))
ids = [x['id'] for x in fise]
ex = {x['id']: x.get('formulari', []) for x in fise}
data = {}
for p in ('parte_windows_a', 'parte_audio_b'):
    data.update(json.load(open(D + p + '.json', encoding='utf-8')))
comp = json.load(open(D + 'parte_completari.json', encoding='utf-8'))

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\W+', ' ', s).strip()

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\W+', ' ', s).strip()

# curatare: scoate coliziunile cu existentele si dublurile, completeaza pana la 25
for i in ids:
    en = {norm(x) for x in ex[i]}
    seen = set(); out = []
    for x in data[i] + comp.get(i, []):
        n = norm(x)
        if n in en or n in seen: continue
        seen.add(n); out.append(x)
    data[i] = out[:25]

bad = 0
if set(ids) != set(data):
    print('ID diferite', set(ids) ^ set(data)); bad += 1
for i in ids:
    L = data.get(i, [])
    n = [norm(x) for x in L]
    if len(L) != 25: print(i, 'count', len(L)); bad += 1
    if len(set(n)) != len(n):
        print(i, 'dubluri interne', [x for x in set(n) if n.count(x) > 1]); bad += 1
    en = {norm(x) for x in ex[i]}
    for x in L:
        if norm(x) in en: print(i, 'identic cu existent', x); bad += 1
if '--scrie' in sys.argv and bad == 0:
    out = {i: data[i] for i in ids}
    json.dump(out, open(B + 'formulari_extra_m2.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ids', len(ids), 'total', sum(len(v) for v in data.values()), 'probleme', bad)
sys.exit(1 if bad else 0)
