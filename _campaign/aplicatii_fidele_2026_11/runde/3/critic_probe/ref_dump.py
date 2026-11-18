import json, sys
d = json.load(open(r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json', encoding='utf-8'))
def tree(n, dep=0, maxd=9, filt=None):
    s = '  '*dep + f"{n.get('tip')} {n.get('eticheta')!r} r={n.get('rect_css')}"
    for k in ('id_mso','id_win32','valoare','tasta_acces','scurtatura','activ','vizibil','bifat'):
        if k in n: s += f" {k}={n[k]!r}"
    print(s[:230])
    if dep < maxd:
        for c in n.get('copii', []): tree(c, dep+1, maxd)
for key in sys.argv[1:]:
    print('=====', key)
    tree(d['suprafete'][key])
