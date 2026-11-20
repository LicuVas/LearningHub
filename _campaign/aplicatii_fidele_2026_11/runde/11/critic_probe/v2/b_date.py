import json, re
W = 'C:/00/Projects/LearningHub_fidel/'
D = W + '_campaign/aplicatii_fidele_2026_11/'
ref = json.load(open(D + 'referinte/uia_powerpoint.json', encoding='utf-8'))['suprafete']
dat = json.load(open(W + 'aplicatii/date/powerpoint.json', encoding='utf-8'))
print('chei date:', list(dat.keys()))
sup = dat.get('suprafete', {})
print('suprafete date:', len(sup), 'ref:', len(ref), 'lipsa in date:', sorted(set(ref) - set(sup)), 'in plus:', sorted(set(sup) - set(ref)))
# toate etichetele din referinta
E = set()
def wr(n):
    if isinstance(n, dict):
        for k in ('eticheta', 'valoare'):
            if isinstance(n.get(k), str): E.add(n[k])
        for c in n.get('copii') or []: wr(c)
for v in ref.values(): wr(v)
# etichetele din date (cheia 'e' sau 'eticheta')
F = []
def wd(n, cale):
    if isinstance(n, dict):
        for k in ('e', 'eticheta', 'et'):
            v = n.get(k)
            if isinstance(v, str) and v and v not in E: F.append((cale[-50:], k, v))
        for k, v in n.items():
            if isinstance(v, (dict, list)): wd(v, cale + '/' + k)
    elif isinstance(n, list):
        for i, x in enumerate(n): wd(x, cale + '[' + str(i) + ']')
wd(dat, '')
print('etichete din date care NU sunt in referinta:', len(F)); [print('  ', f) for f in F[:15]]
# Claude
s = json.dumps(dat, ensure_ascii=False)
print('apare "Claude":', len(re.findall(r'"Claude', s)))
# filele afisate in date
def kids(n): return n.get('c') or n.get('copii') or []
fp = sup.get('file_panglicii')
def flat(n, d=0, out=None):
    out = [] if out is None else out
    if isinstance(n, dict):
        out.append((d, n.get('t') or n.get('tip'), n.get('e') or n.get('eticheta'), n.get('id') or n.get('id_mso')))
        for c in kids(n): flat(c, d + 1, out)
    return out
print('file_panglicii date:', [x[2] for x in flat(fp) if x[1] == 'TabItem'])
rf = ref['file_panglicii']
def flatr(n, d=0, out=None):
    out = [] if out is None else out
    out.append((d, n.get('tip'), n.get('eticheta'), n.get('id_mso')))
    for c in n.get('copii') or []: flatr(c, d + 1, out)
    return out
print('file_panglicii ref :', [x[2] for x in flatr(rf) if x[1] == 'TabItem'])
for t in ['TabHome', 'TabInsert', 'TabDesign', 'TabTransitions', 'TabAnimations']:
    gd = [x[2] for x in flat(sup['panglica.' + t]) if x[1] == 'Group']
    gr = [x[2] for x in flatr(ref['panglica.' + t]) if x[1] == 'Group']
    print(t, 'grupuri egale:', gd == gr, gd if gd != gr else len(gd))
    if gd != gr: print('   ref:', gr)
print('acces_rapid date:', [x[2] for x in flat(sup['acces_rapid']) if x[1] in ('Button', 'SplitButton')])
print('bara_stare date:', [x[2] for x in flat(sup['bara_stare'])][:20])
print('bara_stare ref :', [x[2] for x in flatr(ref['bara_stare'])][:20])
