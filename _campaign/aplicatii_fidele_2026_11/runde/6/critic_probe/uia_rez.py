import json,sys
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_excel.json'
j=json.load(open(D,encoding='utf-8'))
print({k:j[k] for k in ['versiune','dpi_factor','dpi','fereastra','fereastra_brut','nota_rect'] if k in j})
print(sorted(j['suprafete'].keys()))
def walk(n,d=0,maxd=99,out=None):
    s='  '*d+f"{n.get('tip')} '{n.get('eticheta')}' id={n.get('id_mso')} rect={n.get('rect_css')} "+' '.join(f"{k}={n[k]}" for k in ['activ','bifat','valoare','vizibil','tasta_acces','scurtatura','clasa'] if k in n)
    print(s)
    if d<maxd:
        for c in n.get('copii',[]): walk(c,d+1,maxd)
for k in sys.argv[1:]:
    parts=k.split('@'); key=parts[0]; md=int(parts[1]) if len(parts)>1 else 99
    n=j['suprafete'][key]
    print('=====',key, {kk:v for kk,v in n.items() if kk not in ('copii',)} if 'tip' not in n else '')
    walk(n,0,md)
