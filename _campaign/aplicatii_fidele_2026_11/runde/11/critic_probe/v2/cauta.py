import json,sys
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
ts=sys.argv[1].split('|')
def walk(n,path):
    if isinstance(n,dict):
        lab=str(n.get('eticheta'))+' '+str(n.get('id_mso'))
        for t in ts:
            if t.lower() in lab.lower():
                print(path[-60:],'|',n.get('tip'),'|',n.get('eticheta'),'|',n.get('id_mso'),'|',[round(x) for x in n.get('rect_css') or []],'|',{k:v for k,v in n.items() if k in('activ','tasta_acces','valoare','bifat')})
        for k,v in n.items():
            if k=='copii':
                for i,c in enumerate(v): walk(c,path+'/'+str(c.get('eticheta'))[:12])
for k,v in j['suprafete'].items(): walk(v,k)
