import json
A='C:/00/Projects/LearningHub_fidel/aplicatii/date/powerpoint.json'
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
d=json.load(open(A,encoding='utf-8')); r=json.load(open(R,encoding='utf-8'))
print('date keys',list(d.keys())[:30])
sup=d.get('suprafete') or d.get('s')
print(type(sup), list(sup.keys())[:5] if isinstance(sup,dict) else len(sup))
k0=list(sup.keys())[0]; print(k0, json.dumps(sup[k0],ensure_ascii=False)[:600])
# reference node format
rs=r['suprafete']['lista.Font']; print('REF lista.Font', json.dumps(rs,ensure_ascii=False)[:800])
