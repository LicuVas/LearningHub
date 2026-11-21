import re,sys,io
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
P='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/proba_src/'
pages=['lectii/viii/m1-l04/index.html','lectii/viii/m2-l09/index.html','lectii/viii/m2-l10/index.html','lectii/viii/m2-l11/index.html','lectii/viii/m2-l12/index.html','lectii/viii/m2-l13/index.html','jocuri/excel-viii/index.html','jocuri/excel-pas-cu-pas-viii/index.html','jocuri/_fixtura-excel/index.html','jocuri/excel-antrenament-viii/index.html']
pats={'sortat':r"sortat:\{",'ordonat':r"ordonat:\[",'intregi':r"intregi:true",'antetT':r"antet:true",'grafic':r"grafic:\{",'start':r"start:\{zona",'etichete':r"etichete:(true|false)",'legenda':r"legenda:(true|false)",'titlu':r"titlu:'",'oSerie':r"oSerie:",'serii':r"serii:\[",'categorii':r"categorii:\[",'latimeMin':r"latimeMin:",'tipLine':r"tip:'line'",'tipPie':r"tip:'pie'",'tipBar':r"tip:'bar'",'tipCol':r"tip:'column'",'formule':r"formule:\{",'functii':r"functii:\{",'variante':r"variante:\[",'teste':r"teste:\[",'doarMouse':r"doarMouse:true",'gol':r"gol:\[",'fara':r"fara:\[",'format':r"format:\{",'imbinat':r"imbinat:'",'gest':r"gest:\[",'umplut':r"umplut:\{",'targets':r"targets:\{",'proba':r"proba:'",'alegere':r"t:'alegere'",'IF':r"=IF\(",'dlg2niv':r"sortare-dlg"}
for pg in pages:
  try: L=open(P+pg,encoding='utf-8').read().split('\n')
  except Exception as e: print(pg,'LIPSA');continue
  out=[]
  for k,p in pats.items():
    hits=[i+1 for i,l in enumerate(L) if re.search(p,l)]
    if hits: out.append(f"{k}:{len(hits)}@{','.join(map(str,hits[:4]))}")
  print(pg,'|',' '.join(out))
