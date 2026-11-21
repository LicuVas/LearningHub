from h import *
with sesiune() as (ctx, port, blocate):
    for app in ('word', 'powerpoint'):
        a = App(ctx, port, app)
        t = a.tinte()
        print(app, len(t))
        print(' | '.join(x for x in t if not x.startswith('panglica:') or 'Home/' in x)[:3000])
        print('STARE', json.dumps(a.stare(), ensure_ascii=False)[:1500])
        print('ERORI', a.erori)
    print('BLOCATE', blocate)
