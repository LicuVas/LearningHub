# -*- coding: utf-8 -*-
import json,re,sys
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/'
j=json.load(open(R+'uia_powerpoint.json',encoding='utf-8'))
pat=re.compile(sys.argv[1],re.I)
hits=[]
def walk(x,path):
    if isinstance(x,dict):
        for k,v in x.items(): walk(v,path+'/'+str(k))
    elif isinstance(x,list):
        for i,v in enumerate(x): walk(v,path+'['+str(i)+']')
    elif isinstance(x,str) and pat.search(x): hits.append((path,x[:160]))
walk(j,'')
for p,s in hits[:int(sys.argv[2]) if len(sys.argv)>2 else 30]: print(p,'=>',s)
print('total',len(hits))
