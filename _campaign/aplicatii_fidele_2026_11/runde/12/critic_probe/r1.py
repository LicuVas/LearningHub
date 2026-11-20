import json
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
a=j['acoperire_r11']; f=a['fapte']
for k,v in f.items():
    if k in('randuri.lista.FontColorPicker',): continue
    if k=='a_font_color':
        print(k,'keys',list(v.keys()),'culoare_titlu',v.get('culoare_titlu_com_la_pornire'));continue
    s=json.dumps(v,ensure_ascii=False)
    print('##',k,len(s)); print(s[:1200])
print('NEVERIFICAT',json.dumps(a.get('NEVERIFICAT'),ensure_ascii=False)[:2500])
print('cum',json.dumps(a.get('cum'),ensure_ascii=False)[:800])
