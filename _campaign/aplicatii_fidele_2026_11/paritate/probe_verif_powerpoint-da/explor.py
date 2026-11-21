# Explorarea țintelor PowerPoint din poligon (verificatorul powerpoint-da)
from h import *
with sesiune() as (ctx, port, blocate):
    a = App(ctx, port, 'powerpoint')
    t0 = a.tinte()
    print('START', len(t0)); print(json.dumps(t0, ensure_ascii=False))
    print('STARE', json.dumps(a.stare(), ensure_ascii=False)[:3000])
    for f in ['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'View']:
        if a.exista('fila:' + f):
            a.clic('fila:' + f)
            print('FILA', f, json.dumps([t for t in a.tinte() if t.startswith(('panglica', 'lansator', 'meniu_derulant', 'meniu'))], ensure_ascii=False))
        else:
            print('FILA LIPSA', f)
    a.clic('miniatura:2', asteapta=300)
    b = a.bbox('miniatura:2'); a.pg.mouse.click(b['x'] + b['w']/2, b['y'] + b['h']/2, button='right'); a.pg.wait_for_timeout(300)
    print('CM MINI', json.dumps(a.tinte('meniu:'), ensure_ascii=False))
    print('MESAJE', a.mesaje())
    print('ERORI', a.erori, 'BLOCATE', blocate)
