import json, sys
D = r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_excel.json'
d = json.load(open(D, encoding='utf-8'))
S = d['suprafete']
def keys(n):
    return [k for k in n.keys()]
def walk(n, dep=0, out=None, maxd=99):
    if out is None: out = []
    if isinstance(n, dict):
        nm = n.get('eticheta','')
        tp = n.get('tip') or n.get('type') or ''
        extra = {k: n[k] for k in n if k not in ('eticheta','tip','copii','rect_brut','clasa') and not isinstance(n[k], (list, dict))}
        out.append('  '*dep + f"{tp} '{nm}' " + json.dumps(extra, ensure_ascii=False))
        for c in n.get('copii', n.get('children', [])) or []:
            if dep < maxd: walk(c, dep+1, out, maxd)
    return out
if __name__ == '__main__':
    k = sys.argv[1]
    s = S[k]
    if isinstance(s, dict):
        print('KEYS', [x for x in s.keys()])
        for kk, vv in s.items():
            if not isinstance(vv, (dict, list)): print(kk, '=', repr(vv)[:300])
        root = s.get('arbore') or s.get('radacina') or s
        print('\n'.join(walk(root, maxd=int(sys.argv[2]) if len(sys.argv) > 2 else 99)))
