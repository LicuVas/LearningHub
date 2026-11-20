import json
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json'
r=json.load(open(R,encoding='utf-8'))
def walk_r(n,out,depth=0):
    out.append(n); [walk_r(c,out) for c in n.get('copii',[])]
for k,v in r['suprafete'].items():
    if not (k.startswith('dialog.') ): continue
    b=[];walk_r(v,b)
    acc=[(x.get('tip'),x.get('eticheta'),x.get('tasta_acces')) for x in b if x.get('tasta_acces')]
    foc=[(x.get('tip'),x.get('eticheta')) for x in b if x.get('focus') or x.get('are_focus')]
    impl=[(x.get('tip'),x.get('eticheta')) for x in b if x.get('implicit')]
    print('##',k,'| rect',v.get('rect_css'),'\n acc',acc[:30],'\n focus',foc,'impl',impl, '| chei nod', sorted({kk for x in b for kk in x.keys()}))
