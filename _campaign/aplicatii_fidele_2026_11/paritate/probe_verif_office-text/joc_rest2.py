# A patra trecere: Format Background (Solid fill › Color) și lista Font Size în PowerPoint.
from h import *

R = {}


def dif(a, inainte):
    return [t for t in a.tinte() if t not in inainte]


with sesiune() as (ctx, port, blocate):
    a = App(ctx, port, 'powerpoint')
    a.clic('fila:Design'); a.clic('meniu_derulant:Design/Customize/Background Styles'); a.clic('meniu:Format Background...')
    t0 = a.tinte()
    R['panou'] = [t for t in t0 if 'fill' in t.lower() or 'Color' in t or 'Apply' in t][:12]
    sf = [t for t in t0 if t.endswith('Solid fill')]
    if sf:
        a.clic(sf[0])
    t1 = a.tinte()
    col = [t for t in t1 if t.split(':')[-1] in ('Color', 'Fill Color') or t.endswith('/Color')]
    R['col'] = col or [t for t in t1 if 'Color' in t][:8]
    if col:
        a.clic(col[0])
        cul = dif(a, t1)
        R['culori'] = cul[:12]
        o = [t for t in cul if t.endswith('Orange')] or [t for t in cul if 'Orange' in t]
        if o:
            a.clic(o[0])
    R['fundal_d1'] = a.stare()['fundal_diapozitive']
    R['mesaje'] = a.mesaje()
    a.poza('ppt_F100_fundal')

    b = App(ctx, port, 'powerpoint')
    b.clic('margine_forma:1/1', dx=0.5, dy=0.02)
    b.clic('meniu_derulant:Home/Font/Font Size')
    R['font_size_dom'] = b.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] *')].filter(e => e.children.length === 0 && /^(20|28|36|44)$/.test((e.textContent||'').trim()) && e.getBoundingClientRect().width > 0).map(e => { const t = e.closest('[data-lh-tinta]'); return (t ? t.getAttribute('data-lh-tinta') + '|' + t.getAttribute('data-lh-id') : 'fara') + '|' + e.textContent.trim(); }).slice(0, 12)")
    R['ev'] = b.ev()
    ok = b.pg.evaluate("() => { const e = [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] *')].find(e => e.children.length === 0 && (e.textContent||'').trim() === '36' && e.getBoundingClientRect().width > 0 && e.closest('[role=listbox],[role=menu],.lh-ap-meniu,.lh-ap-p-lista-ref,[data-lh-tinta]')); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width/2, r.y + r.height/2]; }")
    R['pct36'] = ok
    if ok:
        b.pg.mouse.click(ok[0], ok[1]); b.pg.wait_for_timeout(250)
    R['titlu_dupa_36'] = b.stare()['formatare_text']
    R['ev36'] = b.ev()
    R['_blocate'] = blocate
for k, v in R.items():
    print(k, json.dumps(v, ensure_ascii=False)[:900])
rezultat('rez_rest2', R)
