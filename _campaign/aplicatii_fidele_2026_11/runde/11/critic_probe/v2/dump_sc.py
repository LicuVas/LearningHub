import json,glob,os
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
for f in sorted(glob.glob(D+'/scenarii/powerpoint/*.json')):
    s=json.load(open(f,encoding='utf-8')); i=s['id']
    print('##',i,'|',s.get('mod'))
    print(' start:',json.dumps(s.get('start'),ensure_ascii=False))
    print(' pasi:',json.dumps(s.get('pasi'),ensure_ascii=False))
    print(' citit:',s.get('stare_citita'))
    r=D+'/referinte/scenarii_real/'+i+'.json'
    if os.path.exists(r):
        R=json.load(open(r,encoding='utf-8'))
        print(' REAL:',json.dumps({k:R.get(k) for k in ('stare','eroare','cum','mod_probat')},ensure_ascii=False)[:900])
    else: print(' REAL: lipsa')
