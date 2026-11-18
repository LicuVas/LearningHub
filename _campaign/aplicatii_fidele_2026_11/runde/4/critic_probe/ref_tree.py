import json, sys
d = json.load(open('C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json', encoding='utf-8'))
S = d['suprafete']
def tree(n, ind, out, maxd):
    if ind > maxd: return
    parts = [n.get('tip', ''), json.dumps(n.get('eticheta', ''), ensure_ascii=False), str([int(x) for x in n.get('rect_css', [])])]
    for k in ('tasta_acces', 'valoare', 'activ', 'focus', 'implicit', 'clasa'):
        if k in n and k != 'clasa': parts.append(f'{k}={json.dumps(n[k], ensure_ascii=False)}')
    out.append('  ' * ind + ' '.join(parts))
    for c in n.get('copii', []) or []:
        tree(c, ind + 1, out, maxd)
    return out
maxd = 99
for k in sys.argv[1:]:
    if k.startswith('-d'): maxd = int(k[2:]); continue
    n = S[k]
    print('=====', k, {kk: vv for kk, vv in n.items() if kk not in ('copii', 'rect_brut', 'rect_css', 'tip', 'eticheta', 'clasa', 'butoane_ordine')})
    print('\n'.join(tree(n, 0, [], maxd)))
