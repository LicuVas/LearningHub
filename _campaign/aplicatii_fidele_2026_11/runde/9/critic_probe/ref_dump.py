import json, sys
j=json.load(open('C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_excel.json',encoding='utf-8'))
def tree(n, d=0, out=None, maxd=99):
    extra = {k:n[k] for k in ('id_mso','tasta_acces','bifat','valoare','activ','vizibil','clasa') if k in n}
    out.append('  '*d + f"{n.get('tip')} | {n.get('eticheta')!r} | {n.get('rect_css')} | {extra}")
    if d < maxd:
        for c in n.get('copii',[]): tree(c, d+1, out, maxd)
keys = sys.argv[1:]
for k in keys:
    s = j['suprafete'][k]
    out=[]
    hdr = {kk:s[kk] for kk in s if kk not in ('copii',)}
    hdr = {kk:(v if len(json.dumps(v,ensure_ascii=False))<400 else str(v)[:400]) for kk,v in hdr.items()}
    print('=====', k, json.dumps(hdr, ensure_ascii=False)[:1500])
    tree(s, 0, out)
    print('\n'.join(out))
