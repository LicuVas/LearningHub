# -*- coding: utf-8 -*-
import json,sys
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/'
j=json.load(open(R+'uia_powerpoint.json',encoding='utf-8'))
print('top', list(j.keys()))
for k in ('acoperire_r11','acoperire_r12'):
    a=j.get(k,{})
    print(k, list(a.keys()))
    f=a.get('fapte',{})
    for kk,v in f.items():
        print('  F', kk, (json.dumps(v,ensure_ascii=False)[:260]))
    n=a.get('NEVERIFICAT',{})
    print('  NEVERIF', json.dumps(n,ensure_ascii=False)[:3000])
print('suprafete', [k for k in j.get('suprafete',{}).keys()][:200])
