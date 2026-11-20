# -*- coding: utf-8 -*-
import json,glob,os
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/'
for n in ['ctrl-w-modificat','ctrl-n','ctrl-z-diapozitiv-nou','delete-diapozitiv','salvare-ca','ctrl-o-browse','blank-presentation','font-titlu','note','tastare-titlu']:
    s=json.load(open(D+'scenarii/powerpoint/powerpoint-'+n+'.json',encoding='utf-8'))
    r=json.load(open(D+'referinte/scenarii_real/powerpoint-'+n+'.json',encoding='utf-8'))
    pasi=s.get('pasi') or s.get('gesturi')
    print('==',n,'| pasi:',json.dumps(pasi,ensure_ascii=False)[:500])
    print('  citita:',s.get('stare_citita'))
    st=r.get('stare',r)
    print('  real:',json.dumps({k:st.get(k) for k in (s.get('stare_citita') or [])},ensure_ascii=False)[:700])
