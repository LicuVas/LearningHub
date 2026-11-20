# -*- coding: utf-8 -*-
import json
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/'
j=json.load(open(R+'uia_powerpoint.json',encoding='utf-8'))
S=j['suprafete']
def noduri(n,out):
    if isinstance(n,dict):
        if n.get('tasta_acces'): out.append((n.get('tip'),n.get('eticheta'),n.get('tasta_acces')))
        for k,v in n.items():
            if isinstance(v,(dict,list)): noduri(v,out)
    elif isinstance(n,list):
        for x in n: noduri(x,out)
    return out
for k in ['panglica_context.Ctx_ShapeFormat','panglica_context.Ctx_PictureFormat','panglica_context.Ctx_TableDesign','panglica_context.Ctx_TableLayout']:
    o=noduri(S[k],[]); print(k,[x for x in o if x[0] in ('Group','TabItem')][:6])
for k in ['lista.ShapeFillColorPicker','lista.OutlineColorPicker','lista.OutlineColorPicker#Weight']:
    print(k,noduri(S[k],[])[:14])
for k in [x for x in S if x.startswith('dialog.')]:
    print(k,[(a,b,c) for a,b,c in noduri(S[k],[])][:14])
la=j['acoperire_r12']['fapte']['b_ctrl_o_browse']['la_deschidere']
print('campuri', [(c.get('tip'),c.get('eticheta')) for c in la.get('campuri',[])][:14])
