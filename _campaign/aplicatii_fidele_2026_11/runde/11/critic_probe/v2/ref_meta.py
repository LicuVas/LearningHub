import json
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
print('chei top:',[k for k in j if k!='suprafete'])
for k in ('dpi_factor','fereastra','acces_rapid_implicit'):
    print(k,':',json.dumps(j.get(k),ensure_ascii=False)[:400])
print('nedeschise:',json.dumps(j.get('nedeschise'),ensure_ascii=False)[:2500])
print('erori:',json.dumps(j.get('erori'),ensure_ascii=False)[:1500])
for k,v in j['suprafete'].items():
    print(' S',k,{kk:(vv if not isinstance(vv,(list,dict)) else '..') for kk,vv in v.items() if kk not in('copii',)} )
