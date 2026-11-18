import json, sys
d = json.load(open('C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json', encoding='utf-8'))
S = d['suprafete']
def tree(n, ind=0, out=None):
    keys = {k: v for k, v in n.items() if k not in ('c',)}
    s = '  ' * ind + ' '.join(f'{k}={json.dumps(v, ensure_ascii=False)}' for k, v in keys.items())
    out.append(s)
    for c in n.get('c', []) or []:
        tree(c, ind + 1, out)
    return out
for k in sys.argv[1:]:
    if k.startswith('@'):
        p = k[1:].split('.')
        x = d
        for q in p: x = x[q]
        print(json.dumps(x, ensure_ascii=False, indent=1)[:12000])
        continue
    print('=====', k)
    print('\n'.join(tree(S[k], 0, [])))
