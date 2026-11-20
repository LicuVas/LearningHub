import json,sys
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
j=json.load(open(D+'/referinte/uia_powerpoint.json',encoding='utf-8'))
S=j['suprafete']
noi=['lista.FontColorPicker','lista.FontColorPicker_minibara','dialog.save_your_changes_to_this_file','lista.FlyoutAnchorInsertPictures','lista.ShapesInsertGallery','lista.TableInsertGallery','lista.SlideNewGallery','lista.SlideLayoutGallery','panou.AnimationCustom#doua_animatii','panou.LaunchFormatBackground#Solid fill','lista.FormatBackground_Color']
def walk(n,d,out):
    out.append((d,n.get('tip'),n.get('eticheta'),n.get('rect_css'),n.get('activ'),n.get('tasta_acces'),n.get('valoare'),n.get('implicit'),n.get('focus'),n.get('bifat')))
    for c in n.get('copii',[]) or []: walk(c,d+1,out)
for k in noi:
    s=S[k]; out=[]
    if isinstance(s,dict) and 'copii' in s: roots=[s]
    elif isinstance(s,dict) and 'noduri' in s: roots=s['noduri']
    elif isinstance(s,list): roots=s
    else: roots=[s]
    print('=====',k, type(s).__name__, list(s.keys())[:12] if isinstance(s,dict) else len(s))
    for r in roots: walk(r,0,out)
    li=[o for o in out if o[1]=='ListItem']
    print(' noduri',len(out),'ListItem',len(li))
    for o in out:
        if o[1]=='ListItem' and len(li)>20: continue
        print('  '*o[0],o[1:])
    if len(li)>20:
        xs=[o[3] for o in li if o[3]]
        print(' LI first',li[:3],'last',li[-2:])
        if xs: print(' LI extents x',min(r[0] for r in xs),max(r[0]+r[2] for r in xs),'y',min(r[1] for r in xs),max(r[1]+r[3] for r in xs),'sizes',sorted(set((r[2],r[3]) for r in xs))[:6])
