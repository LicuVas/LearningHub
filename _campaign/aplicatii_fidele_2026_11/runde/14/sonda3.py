import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from k import *
from proba_grav import C, T, B, prep_do
JSI = """(()=>{const i=document.querySelector('[data-lh-id-mso="Font"] input');return i?{v:i.value,a:i.selectionStart,b:i.selectionEnd,ro:i.readOnly,foc:document.activeElement===i}:null})()"""
with Ham() as H:
    pg = H.app('powerpoint', C)
    prep_do(pg, [T, B]); ev(pg)
    r = pg.evaluate("""(()=>{const i=document.querySelector('[data-lh-id-mso="Font"] input');const r=i.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()""")
    pg.mouse.click(r[0] + r[2] * 0.4, r[1] + r[3] / 2); pg.wait_for_timeout(150)
    print('dupa clic', pg.evaluate(JSI), ev(pg), men(pg))
    pg.wait_for_timeout(300)
    print('dupa 300', pg.evaluate(JSI))
    pg.keyboard.type('Ari'); pg.wait_for_timeout(100)
    print('dupa Ari', pg.evaluate(JSI), ev(pg)[-1:])
