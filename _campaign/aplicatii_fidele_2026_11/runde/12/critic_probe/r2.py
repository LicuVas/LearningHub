import json
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
f=j['acoperire_r11']['fapte']
print(list(f.keys()))
d=f['d_efecte']
for k,v in d.items():
    if k=='duration_dupa_enter': v={kk:vv for kk,vv in v.items() if kk!='nod'}
    print('#',k, json.dumps(v,ensure_ascii=False)[:900])
for k in list(f.keys()):
    if k.startswith(('e_','f_','g_','fundal','format')) : print('##',k,json.dumps(f[k],ensure_ascii=False)[:1500])
