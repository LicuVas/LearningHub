import json,glob,os
D='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11'
for f in sorted(glob.glob(D+'/scenarii/powerpoint/*.json')):
    s=json.load(open(f,encoding='utf-8')); n=os.path.basename(f)[11:-5]
    pas=s.get('pasi',[])
    taste=[p for p in pas if p.get('gest') in ('taste','tasteaza')]
    if not taste: continue
    rp=D+'/referinte/scenarii_real/'+os.path.basename(f)
    r=json.load(open(rp,encoding='utf-8')) if os.path.exists(rp) else {}
    print(n,'| start sel',s.get('start',{}).get('selectie_forma'),s.get('start',{}).get('selectie_text'),s.get('start',{}).get('panou'),'|',json.dumps(taste,ensure_ascii=False)[:200],'| REAL',r.get('mod_probat'),json.dumps(r.get('stare'),ensure_ascii=False)[:250])
