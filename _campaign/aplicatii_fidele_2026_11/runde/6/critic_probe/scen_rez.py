import json,glob,os
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/'
for f in sorted(glob.glob(D+'referinte/scenarii_real/excel-*.json')):
    j=json.load(open(f,encoding='utf-8'))
    s=j.get('stare') or {}
    cel=s.get('celule',{})
    sc=json.load(open(D+'scenarii/excel/'+os.path.basename(f),encoding='utf-8')) if os.path.exists(D+'scenarii/excel/'+os.path.basename(f)) else {}
    pasi=sc.get('pasi')
    print(os.path.basename(f)[:-5],'| pasi=',json.dumps(pasi,ensure_ascii=False)[:300])
    print('   celule=',json.dumps(cel,ensure_ascii=False)[:400],'| sel=',s.get('selectie'),'| fmt=',json.dumps(s.get('format_celule'),ensure_ascii=False)[:200], '| alte=',[k for k in s if k not in ('celule','selectie','format_celule')], {k:s[k] for k in s if k not in ('celule','selectie','format_celule')})
