import json
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
A='C:/00/Projects/LearningHub_fidel/aplicatii/date/powerpoint.json'
r=json.load(open(R,encoding='utf-8')); d=json.load(open(A,encoding='utf-8'))
def cauta(n,eti,cale,out,kc='copii',ke='eticheta',kt='tip'):
    c=cale+[f"{n.get(kt)}:{n.get(ke)}"]
    if n.get(ke) in eti: out.append((' > '.join(c[-4:]), n.get('tasta_acces') or n.get('ta'), n.get('rect_css') or n.get('r')))
    for x in n.get(kc,[]): cauta(x,eti,c,out,kc,ke,kt)
E={'Background Styles','Shape Format','Variants','Customize','Format Background','Shape Fill','Shape Outline'}
for k in ['panglica.TabDesign','file_panglicii','panglica_context.Ctx_ShapeFormat','panglica.TabHome']:
    o=[];cauta(r['suprafete'][k],E,[],o); print('REF',k); [print('   ',x) for x in o]
    if k in d['suprafete']:
        o=[];cauta(d['suprafete'][k],E,[],o,'c','e','t'); print('DATE',k); [print('   ',x) for x in o]
print('date file:',json.dumps(d.get('file'),ensure_ascii=False)[:400]); print('date context:',json.dumps(d.get('context'),ensure_ascii=False)[:400])
