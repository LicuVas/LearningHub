"""Tipareste un digest (sau doar unii pasi): python digest.py vii_m2-l11 [p6 real ...]"""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
D = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/digest/'
d = json.load(open(D + sys.argv[1] + '.json', encoding='utf-8'))
vrut = sys.argv[2:]
print('#', d['clasa'], d['nr'], d['titlu'], '|', d['cale'])
for p in d['pasi']:
    if vrut and p['id'] not in vrut:
        continue
    print('=' * 60)
    print(p['id'], '|', p['titlu'])
    print('TEXT:', p['text'])
    print('UITE CUM:', p['uite_cum'])
    print('ALTFEL:', p['altfel'])
    print('INCEARCA:', json.dumps(p['incearca'], ensure_ascii=False))
    for c in p['capturi']:
        print('CAPTURA:', json.dumps(c, ensure_ascii=False))
if not vrut or 'real' in vrut:
    a = d['aplicatie_reala']
    print('=' * 60)
    print('REAL |', a.get('aplicatie'), '|', a.get('titlu'))
    for i, x in enumerate(a.get('pasi', []), 1):
        print('  R%d: %s' % (i, x))
    for k in a:
        if k not in ('aplicatie', 'titlu', 'pasi'):
            print(k + ':', json.dumps(a[k], ensure_ascii=False))
