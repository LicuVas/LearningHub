# Prima privire: starea Word în poligon, țintele, evenimentele unei tastări
from h import *
with sesiune() as (ctx, port, blocate):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere.', 'Doi']})
    s = a.stare()
    print(json.dumps({k: s[k] for k in s if k not in ('formatare_pe_caractere',)}, ensure_ascii=False)[:2500])
    t = a.tinte()
    print(len(t), [x for x in t if not x.startswith('panglica:')][:120])
    print([x for x in t if x.startswith('panglica:Home')][:80])
    print('blocate', blocate, 'erori', a.erori)
