import json,sys
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
print('top',list(j.keys()))
print('dpi',j.get('dpi_factor'),'fer',j.get('fereastra'))
s=j['suprafete']; print(len(s)); print(list(s.keys()))
a=j.get('acoperire_r11'); print(type(a), list(a.keys()) if isinstance(a,dict) else '')
print(json.dumps(a.get('fapte'),ensure_ascii=False,indent=0)[:6000])
print('nedeschise',j.get('nedeschise')); print('erori',json.dumps(j.get('erori'),ensure_ascii=False)[:1500])
