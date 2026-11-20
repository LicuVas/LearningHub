import json,sys
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
j=json.load(open(R,encoding='utf-8'))
print('TOP',list(j.keys()))
print('dpi',j.get('dpi_factor'),'fer',j.get('fereastra'))
print('SUPR',list(j['suprafete'].keys()))
a=j['acoperire_r12']; print('R12 keys',list(a.keys()))
f=a['fezte'] if 'fezte' in a else a.get('fapte',{})
for k,v in f.items():
    s=json.dumps(v,ensure_ascii=False)
    print('\n##',k,len(s)); print(s[:3000])
print('\nNEVERIF',json.dumps(a.get('NEVERIFICAT'),ensure_ascii=False)[:3000])
