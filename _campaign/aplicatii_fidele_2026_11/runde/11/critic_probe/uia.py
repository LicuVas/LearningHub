"""Tipareste o suprafata din uia_powerpoint.json, aplatizata (adancime, tip, eticheta, id_mso, rect_css, activ)."""
import json, sys
D = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j = json.load(open(D + '/referinte/uia_powerpoint.json', encoding='utf-8'))
s = j['suprafete']
maxd = int(sys.argv[2]) if len(sys.argv) > 2 else 99
filt = sys.argv[3] if len(sys.argv) > 3 else None

def r(x):
    return [round(v) for v in x] if isinstance(x, list) else x

def walk(n, d=0):
    if d > maxd:
        return
    extra = {k: v for k, v in n.items() if k not in ('copii', 'tip', 'eticheta', 'rect_css', 'rect_brut', 'clasa', 'id_mso')}
    line = '  ' * d + f"{n.get('tip')} | {n.get('eticheta')!r} | mso={n.get('id_mso')} | {r(n.get('rect_css'))}"
    ex = {k: v for k, v in extra.items() if not isinstance(v, (dict, list)) or k in ('valoare',)}
    if ex:
        line += ' | ' + json.dumps(ex, ensure_ascii=False)[:160]
    if not filt or filt.lower() in line.lower():
        print(line)
    for c in n.get('copii', []) or []:
        walk(c, d + 1)

for key in sys.argv[1].split(','):
    print('=====', key)
    n = s[key]
    print({k: v for k, v in n.items() if k not in ('copii',)})
    walk(n)
