import json,sys,os; sys.path.insert(0,os.path.dirname(__file__))
from k import *
from b1 import C
with Ham() as H:
    pg=H.app('powerpoint',C)
    clic(pg,'miniatura:2'); clic(pg,'forma:2/2')
    print('file vizibile',pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-tinta^=\"fila:\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta')+(x.__nod&&x.__nod.ta?'['+x.__nod.ta+']':'')))()"))
    ev(pg); print('Alt',pas(pg,'Alt')['kt'])
    taste(pg,'Escape'); 
    r=sir(pg,['Alt','h','s','o','w','Escape','Escape','Escape']); print('H S O W',[(x['k'],x['kt'][:8],x['men'],[(e['a'],e['t']) for e in x['ev']]) for x in r])
    clic(pg,'fila:Shape Format'); ev(pg)
    r=sir(pg,['Alt','j','d','s','o','w']); print('dupa clic pe Shape Format',[(x['k'],x['kt'][:10],x['men'],[(e['a'],e['t']) for e in x['ev']]) for x in r])
    pg2=H.app('powerpoint',{'diapozitive':[{'aspect':'Title Slide'},{'aspect':'Two Content','texte':['Fotbalul']}],'diapozitiv_activ':1})
    print('substituenti goi pe ecran',pg2.evaluate("(()=>[...document.querySelectorAll('.lh-ap-p-zona [data-lh-tinta=\"forma\"]')].map(x=>x.getAttribute('data-lh-id')+':'+JSON.stringify(x.innerText)))()"))
    clic(pg2,'miniatura:2'); clic(pg2,'forma:2/1'); clic(pg2,'margine_forma:2/1'); pg2.keyboard.type('Baschetul'); pg2.wait_for_timeout(150)
    print('m2-l09 chenar + tastare',S(pg2,'diapozitive')['diapozitive'][1]['texte'])
    print('erori',H.erori,H.plecate)
