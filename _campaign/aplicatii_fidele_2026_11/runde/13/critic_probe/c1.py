import json,collections
A='C:/00/Projects/LearningHub_fidel/aplicatii/date/powerpoint.json'
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
d=json.load(open(A,encoding='utf-8')); r=json.load(open(R,encoding='utf-8'))
def walk_d(n,out):
    out.append(n); [walk_d(c,out) for c in n.get('c',[])]
def walk_r(n,out):
    out.append(n); [walk_r(c,out) for c in n.get('copii',[])]
NOI=r['acoperire_r12']['suprafete_adaugate']
for k in NOI:
    a=[];b=[]
    if k not in d['suprafete']: print(k,'LIPSA in date'); continue
    walk_d(d['suprafete'][k],a); walk_r(r['suprafete'][k],b)
    ea=collections.Counter(x.get('e') for x in a); eb=collections.Counter(x.get('eticheta') for x in b)
    ta_a={(x.get('e'),x.get('ta')) for x in a if x.get('ta')}; ta_b={(x.get('eticheta'),x.get('tasta_acces')) for x in b if x.get('tasta_acces')}
    print(f"{k}: noduri {len(a)}/{len(b)} etichete_in_plus {list((ea-eb).keys())[:6]} lipsa {list((eb-ea).keys())[:6]} ta_plus {list(ta_a-ta_b)[:4]} ta_lipsa {list(ta_b-ta_a)[:4]}")
s=json.dumps(d,ensure_ascii=False); print('Claude in date:',s.count('"Claude"'), s.count('Claude'))
ft=d.get('fonturi_toate'); cf=r['acoperire_r12']['fapte']['c_font']['all_fonts']
print('fonturi_toate',len(ft),'c_font.all_fonts',len(cf),'egale',ft==cf)
# toate ta din date vs referinta pe toata harta
ta_r={}; 
for k,v in r['suprafete'].items():
    b=[];walk_r(v,b)
    for x in b:
        if x.get('tasta_acces'): ta_r.setdefault(x.get('eticheta'),set()).add(x['tasta_acces'])
want=['Font','Font Color','Shape Fill','Shape Outline','Background Styles','Start','New Slide','Layout','Shapes','Pictures','Notes','Slide Sorter','Normal','Reading View','Slide Show','From Beginning','From Current Slide','Weight','Blank Presentation','Browse','Format Background...','Design','Insert','Home','View','Animations','Shape Format','This Device...','Arrow: Right','Star: 5 Points','Yellow','Dark Blue','Style 6','After Previous','Animation Pane','Notes Page','Open','New','Close','Save','Save As']
for w in want: print('REF ta',w,sorted(ta_r.get(w,[])))
