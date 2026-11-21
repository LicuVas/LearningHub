# A treia trecere: fundalul și mărimea (PowerPoint), tastele de acces spre Insert Table (Word), tabelul din caseta goală.
from h import *

R = {}


def dif(a, inainte):
    return [t for t in a.tinte() if t not in inainte]


with sesiune() as (ctx, port, blocate):
    # PowerPoint: Design -> Format Background
    a = App(ctx, port, 'powerpoint')
    a.clic('fila:Design')
    R['design'] = [t for t in a.tinte() if 'Design/' in t]
    fb = [t for t in a.tinte() if 'Background' in t]
    R['fb'] = fb
    t0 = a.tinte()
    if fb:
        a.clic(fb[-1])
        R['dupa_fb'] = dif(a, t0)[:30]
        sf = [t for t in a.tinte() if 'Solid fill' in t]
        if sf:
            a.clic(sf[0])
        t1 = a.tinte()
        col = [t for t in a.tinte() if 'Color' in t and ('fereastra' in t or 'meniu_derulant' in t or 'panou' in t)]
        R['col'] = col
        if col:
            a.clic(col[0])
            cul = dif(a, t1)
            R['culori'] = cul[:14]
            o = [t for t in cul if 'Orange' in t] or cul[:1]
            if o:
                a.clic(o[0])
        R['fundal'] = a.stare()['fundal_diapozitive']
        R['mesaje_fb'] = a.mesaje()
    # PowerPoint: Font Size ▾
    b = App(ctx, port, 'powerpoint')
    b.clic('margine_forma:1/1', dx=0.5, dy=0.02)
    t0 = b.tinte()
    b.clic('meniu_derulant:Home/Font/Font Size')
    lst = dif(b, t0)
    R['font_size_lista'] = lst[:25]
    m36 = [t for t in lst if t.endswith(':36')]
    if m36:
        b.clic(m36[0])
    R['titlu_dupa_36'] = b.stare()['formatare_text']
    m20 = None
    b.clic('meniu_derulant:Home/Font/Font Size')
    m20 = [t for t in dif(b, t0) if t.endswith(':20')]
    if m20:
        b.clic(m20[0])
    R['titlu_dupa_20'] = b.stare()['formatare_text']
    # PowerPoint: caseta de conținut goală -> pictogramele
    c = App(ctx, port, 'powerpoint', {'diapozitive': [{'aspect': 'Title and Content', 'texte': ['Tabel', '']}]})
    R['caseta_goala_tinte'] = [t for t in c.tinte() if t.startswith('forma') or t.startswith('margine') or 'Insert' in t][:12]
    R['caseta_goala_pictograme'] = c.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-zona] [aria-label],[data-lh-aplicatie=powerpoint] [data-lh-zona] [data-lh-eticheta]')].map(e => e.getAttribute('aria-label') || e.getAttribute('data-lh-eticheta')).slice(0,15)")
    c.poza('ppt_F015_caseta_goala')
    # Word: tastele de acces Alt, N, T, I
    w = App(ctx, port, 'word', {'paragrafe': ['Orar']})
    w.clic('text:1')
    for k in ('Alt', 'n', 't', 'i'):
        w.taste(k, asteapta=250)
    R['word_alt_n_t_i_ev'] = w.ev()
    R['word_alt_n_t_i_dialog'] = w.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=word] [data-lh-suprafata^=\"dialog.\"]')].map(e => e.getAttribute('data-lh-suprafata'))")
    R['word_mesaje'] = w.mesaje()
    R['_blocate'] = blocate
for k, v in R.items():
    print(k, json.dumps(v, ensure_ascii=False)[:900])
rezultat('rez_rest', R)
