import json,glob,os
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
for n in ['note','ctrl-o-browse','font-titlu','animatie-start','shape-fill','background-styles','slide-sorter','slide-sorter-normal','stea-ctrl-c-v','blank-presentation','tragere-forma','ctrl-c-v-caseta','imagine-two-content']:
    s=json.load(open(f'{D}/scenarii/powerpoint/powerpoint-{n}.json',encoding='utf-8'))
    print('\n##',n,'| mod',s.get('mod'),'| start',json.dumps(s.get('start'),ensure_ascii=False)[:400])
    print(' pasi',json.dumps(s.get('pasi'),ensure_ascii=False)[:700])
    print(' citit',s.get('stare_citita'))
    try:
        r=json.load(open(f'{D}/referinte/scenarii_real/powerpoint-{n}.json',encoding='utf-8'))
        print(' REAL',r.get('mod_probat'),json.dumps(r.get('stare'),ensure_ascii=False)[:600],'| err',str(r.get('eroare'))[:200])
    except Exception as e: print(' REAL ERR',e)
