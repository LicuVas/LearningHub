import json,sys
P='C:/00/Projects/LearningHub/cum-fac/_sursa/termeni.json'
g=json.load(open(P,encoding='utf8'))
def find(t,ap=None):
    r=[e for e in g if e['t']==t and (ap is None or e['aplicatii']==ap)]
    assert len(r)==1,(t,len(r)); return r[0]
for t in ['aspect','zona de lucru','zona de notificare','zona albă']:
    idx=[i for i,x in enumerate(g) if x['t']==t]; print(t,idx); del g[idx[-1]]
e=find('aspect (layout)'); e['aplicatii']=[]; e['d']='felul în care sunt așezate lucrurile pe un diapozitiv sau pe o pagină: substituenții, poza lângă text, pagina ca la imprimantă'
e=find('zonă'); e['aplicatii']=[]; e['d']='o parte a ecranului, a ferestrei sau a foii (zona de lucru, zona de notificare, zona albă); în Excel, un dreptunghi de celule, scris cu două colțuri opuse și două puncte: A1:B3'
e=find('formă'); e['t']='formă (desen gata făcut)'
e=[x for x in g if x['t']=='etichete de date'][-1]; e['t']='etichetă (în grafic)'
e=find('punctul ● de pe filă'); e['forme']=[]
e=find('margini'); e['t']='marginile paginii'; e['forme']=['marginile','marginilor']
json.dump(g,open(P,'w',encoding='utf8',newline='\r\n'),ensure_ascii=False,indent=1)
raw=open(P,'rb').read()
print(len(g),raw.count(b'\r\n'),raw.count(b'\n'))
