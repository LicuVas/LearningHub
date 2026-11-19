"""Criticul rece, runda 5: extrage din referinta inghetata doar cheile cerute (fara sa incarce uia_word.json in context)."""
import json, sys, glob, os
D = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
d = json.load(open(D + '/referinte/uia_word.json', encoding='utf-8'))
s = d.get('suprafete', {})
cmd = sys.argv[1] if len(sys.argv) > 1 else 'chei'


def arbore(n, ad=0, out=None, maxad=12):
    if out is None:
        out = []
    if not isinstance(n, dict):
        return out
    extra = {k: v for k, v in n.items() if k not in ('c',)}
    out.append('  ' * ad + json.dumps(extra, ensure_ascii=False))
    if ad < maxad:
        for c in n.get('c', []) or []:
            arbore(c, ad + 1, out, maxad)
    return out


if cmd == 'chei':
    print('top', list(d.keys()))
    print('n suprafete', len(s))
    print([k for k in s if k.startswith(('dialog', 'backstage', 'lista'))])
    a = d.get('acoperire_r3')
    if isinstance(a, dict):
        print('acoperire_r3', list(a.keys()))
        if 'fapte' in a:
            print('fapte', list(a['fapte'].keys()))
elif cmd == 'sup':
    for k in sys.argv[2:]:
        print('=====', k)
        print('\n'.join(arbore(s.get(k))))
elif cmd == 'fapt':
    a = d['acoperire_r3']['fapte']
    for k in sys.argv[2:]:
        print('=====', k)
        print(json.dumps(a.get(k), ensure_ascii=False, indent=1))
elif cmd == 'cauta':
    txt = json.dumps(d, ensure_ascii=False)
    for w in sys.argv[2:]:
        i = 0
        n = 0
        while True:
            i = txt.find(w, i)
            if i < 0 or n > 8:
                break
            print(w, '@', i, ':', txt[max(0, i - 160):i + 160].replace('\n', ' '))
            i += len(w)
            n += 1
        print(w, 'total', txt.count(w))
elif cmd == 'acop':
    a = d['acoperire_r3']
    print(json.dumps({k: v for k, v in a.items() if k != 'fapte'}, ensure_ascii=False, indent=1)[:4000])
