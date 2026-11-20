import json
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
j=json.load(open(R,encoding='utf-8'))
f=j['acoperire_r12']['fapte']
b=f['b_ctrl_o_browse']
print('b_ctrl_o_browse keys',list(b.keys()))
ld=b['la_deschidere']; print('la_deschidere keys',list(ld.keys())); print('focus',ld.get('focus')); 
print('campuri',json.dumps(ld.get('campuri'),ensure_ascii=False)[:1500])
for k in b:
    if k not in ('la_deschidere','browse'): print(k, json.dumps(b[k],ensure_ascii=False)[:800])
for k in ['c_shape_fill_outline','c_background_styles','c_note','c_vederi','d_durate','e_imagine_two_content']:
    v=f.get(k); s=json.dumps(v,ensure_ascii=False)
    print('\n##',k,len(s)); print(s[:1800])
print('\nNEVERIF',json.dumps(j['acoperire_r12'].get('NEVERIFICAT'),ensure_ascii=False)[:3000])
print('\nadaugate',j['acoperire_r12'].get('suprafete_adaugate'))
