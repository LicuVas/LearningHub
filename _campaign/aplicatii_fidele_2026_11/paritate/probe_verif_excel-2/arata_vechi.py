import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
P = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate'
es = json.load(open(P + '/esantion_excel-2.json', encoding='utf-8'))
ids = sys.argv[1:]
for f in es:
    if ids and f['id'] not in ids: continue
    print('=' * 20, f['id'], '|', f['functie'])
    for d in f['vechi_dovada']:
        path, ln = d.rsplit(':', 1); ln = int(ln)
        try:
            lines = open(P + '/proba_src/' + path, encoding='utf-8').read().split('\n')
        except Exception as e:
            print('ERR', d, e); continue
        print('--', d)
        for i in range(max(0, ln - 4), min(len(lines), ln + 4)):
            s = lines[i]
            if len(s) > 400: s = s[:400] + '…'
            print(('>' if i == ln - 1 else ' '), i + 1, s)
