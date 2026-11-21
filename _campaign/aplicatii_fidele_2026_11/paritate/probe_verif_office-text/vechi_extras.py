import json, sys, io
P = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate'
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
E = json.load(open(P + '/esantion_office-text.json', encoding='utf-8'))
ctx = int(sys.argv[1]) if len(sys.argv) > 1 else 3
for f in E:
    print('=' * 10, f['id'], '|', f['functie'], '|', f['gest'])
    for d in f['vechi_dovada']:
        path, rng = d.rsplit(':', 1)
        a, _, b = rng.partition('-'); a = int(a); b = int(b or a)
        try:
            L = open(P + '/proba_src/' + path, encoding='utf-8').read().split('\n')
        except Exception as e:
            print('  !!', d, e); continue
        print('--', d)
        for i in range(max(1, a - ctx), min(len(L), b + ctx) + 1):
            print('%5d%s %s' % (i, '>' if a <= i <= b else ' ', L[i - 1][:260]))
