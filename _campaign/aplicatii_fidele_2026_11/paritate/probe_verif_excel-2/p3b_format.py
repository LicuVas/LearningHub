"""Joc: Format ▾ (F137 a doua cale) — ce deschide butonul și ce rânduri are."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
J = lambda x: json.dumps(x, ensure_ascii=False)
with H() as h:
    h.deschide({'A1': 'x'}, 'C2'); h.clic('celula:C2')
    h.clic('meniu_derulant:Home/Cells/Format'); time.sleep(0.4)
    print('ev', h.evenimente(2), 'central', h.mesaje()[:1])
    print('vizibile noi', h.ev("""[...document.querySelectorAll('[data-lh-aplicatie] [role=menu] [data-lh-eticheta], [data-lh-aplicatie] .lh-ap-x-meniu [data-lh-eticheta]')].filter(x=>x.offsetParent).map(x=>(x.getAttribute('data-lh-tinta')||'-')+'|'+x.getAttribute('data-lh-eticheta')).slice(0,40)"""))
    items = h.ev("""[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(x=>x.offsetParent && /Column Width|Row Height|AutoFit/.test(x.getAttribute('data-lh-eticheta')||x.getAttribute('data-lh-id')||'')).map(x=>x.getAttribute('data-lh-tinta')+'|'+x.getAttribute('data-lh-id')+'|'+x.getAttribute('data-lh-eticheta'))""")
    print('items CW', items)
    cw = h.ev("""(()=>{const x=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-eticheta]')].find(x=>x.offsetParent && /^Column Width/.test(x.getAttribute('data-lh-eticheta')));if(!x)return null;const r=x.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,t:x.getAttribute('data-lh-tinta')}})()""")
    print('cw', cw)
    if cw:
        h.pg.mouse.click(cw['x'], cw['y']); time.sleep(0.4)
        print('dupa clic', J(h.stare().get('dialog')), h.evenimente(1))
        h.pg.keyboard.press('Control+A'); h.scrie('5'); h.taste('Enter'); time.sleep(0.3)
        print('latimi', J(h.stare().get('latimi_coloane')))
        # AutoFit Column Width din același meniu
        h.deschide({'C2': 'Text lung lung lung lung lung'}, 'C2'); h.clic('celula:C2'); h.clic('meniu_derulant:Home/Cells/Format'); time.sleep(0.4)
        af = h.ev("""(()=>{const x=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-eticheta]')].find(x=>x.offsetParent && /^AutoFit Column Width/.test(x.getAttribute('data-lh-eticheta')));if(!x)return null;const r=x.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()""")
        if af: h.pg.mouse.click(af['x'], af['y']); time.sleep(0.3); print('AutoFit Column Width:', J(h.stare().get('latimi_coloane')), h.evenimente(1), h.mesaje()[:1])
    # 300 pe dialogul din clic dreapta
    h.deschide({'A1': 'x'}, 'A1'); h.clic('antet_coloana:B', dreapta=True); time.sleep(0.3); h.clic('meniu:Column Width...'); time.sleep(0.3)
    h.pg.keyboard.press('Control+A'); h.scrie('300'); h.taste('Enter'); time.sleep(0.3)
    s = h.stare(); print('300:', J(s.get('fereastra_mesaj')), J(s.get('dialog')), h.mesaje()[:1], J(s.get('latimi_coloane')))
    print('erori', h.erori)
