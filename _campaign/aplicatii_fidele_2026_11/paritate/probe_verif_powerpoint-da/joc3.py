# Jocurile verificatorului powerpoint-da, partea 3: mărimea, fundalul, tranzițiile, animațiile
from comun import *


def fmt(a):
    return [x['marime'] for x in a.stare()['formatare_pe_caractere']]


@test('F031_marime_pas')
def f031(ctx, port):
    a = pp(ctx, port); a.clic('margine_forma:1/1'); r = [fmt(a)]
    for b in ['Increase', 'Increase', 'Decrease', 'Decrease', 'Decrease']:
        a.clic('panglica:Home/Font/' + b + ' Font Size'); r.append([b, fmt(a)])
    a.clic('margine_forma:1/2'); r.append(['subtitlu', fmt(a)])
    for k in ['Control+BracketRight', 'Control+Shift+Period', 'Control+BracketLeft']:
        try:
            a.taste(k); r.append([k, fmt(a)])
        except Exception as e:
            r.append([k, repr(e)[:80]])
    b = pp(ctx, port, {'diapozitive': [{'aspect': 'Blank', 'texte': [], 'forme': [{'fel': 'caseta_text', 'text': 'Mic', 'pozitie': [100, 100, 200, 50]}]}]})
    b.clic('margine_forma:1/1'); x = [fmt(b)]
    for _ in range(4):
        b.clic('panglica:Home/Font/Increase Font Size'); x.append(fmt(b))
    r.append(['caseta_18', x])
    return r


@test('F040_F041_F042_fundal')
def fundal(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('miniatura:2'); a.clic('fila:Design'); a.clic('meniu_derulant:Design/Customize/Background Styles'); a.clic('meniu:Format Background...')
    a.clic('fereastra:Solid fill'); r['dupa_solid'] = a.stare()['fundal_diapozitive']
    a.clic('fereastra:Color'); l = a.tinte('meniu:'); r['nr_culori'] = len(l); r['are_grupuri'] = [any('Accent' in t for t in l), 'meniu:Light Green' in l]
    a.clic('meniu:Light Green')
    r['dupa_culoare'] = a.stare()['fundal_diapozitive']
    a.clic('fereastra:Color'); a.clic('meniu:Gold, Accent 4') if a.exista('meniu:Gold, Accent 4') else None
    r['dupa_culoare_tema'] = a.stare()['fundal_diapozitive']
    a.clic('fereastra:Apply to All'); r['dupa_apply_all'] = a.stare()['fundal_diapozitive']
    r['mesaje'] = a.mesaje()
    a.poza('F041_fundal')
    b = pp(ctx, port); rclic(b, 'miniatura:3'); b.clic('meniu:Format Background...')
    b.clic('fereastra:Color'); b.clic('meniu:Yellow'); r['clic_dreapta_apoi_galben'] = b.stare()['fundal_diapozitive']
    return r


def tranz(a):
    out = []
    for i in range(1, len(a.stare()['diapozitive']) + 1):
        a.clic('miniatura:%d' % i); out.append(a.stare()['tranzitie_galerie'])
    return out


MINI = "() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tinta=miniatura]')].map(e => { const p = e.parentElement; return (p.innerText||'').replace(/\\s+/g,' ').trim() + ' | svg:' + p.querySelectorAll('svg').length + ' | ' + [...p.querySelectorAll('[class]')].map(x => x.className.baseVal === undefined ? x.className : '').filter(c => /stea|star|tranz|anim/i.test(c)).join(','); })"


@test('F046_F050_tranzitii')
def f046(ctx, port):
    a = pp(ctx, port); r = {'mini_inainte': a.pg.evaluate(MINI)}
    a.clic('miniatura:2'); a.clic('fila:Transitions'); a.clic('meniu:Fade')
    r['dupa_fade_pe_2'] = [a.stare()['tranzitie_galerie'], a.stare()['durata_tranzitie'], a.pg.evaluate(MINI)]
    a.poza('F046_stea')
    r['tranz_pe_fiecare'] = tranz(a)
    a.clic('miniatura:2')
    a.clic('panglica:Transitions/Timing/More'); r['durata_dupa_more'] = a.stare()['durata_tranzitie']
    a.clic('panglica:Transitions/Timing/Apply To All')
    r['dupa_apply_all'] = [a.stare()['durata_tranzitie'], tranz(a), a.pg.evaluate(MINI)]
    a.clic('miniatura:1'); a.clic('meniu:None'); r['none_pe_1'] = [tranz(a), a.pg.evaluate(MINI)]
    r['mesaje'] = a.mesaje()
    return r


ANIMNR = "() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-zona] *')].filter(e => e.children.length === 0 && /^\\d$/.test((e.textContent||'').trim()) && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().width < 40).map(e => e.textContent.trim())"


@test('F052_F054_animatii')
def f052(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:2'); a.clic('fila:Animations')
    r = {'fara_obiect_fly_in': None}
    a.clic('meniu:Fly In'); r['fara_obiect_fly_in'] = [a.stare()['ordine_animatii'], a.mesaje()]
    a.clic('margine_forma:2/2'); a.clic('meniu:Fly In')
    r['fly_in'] = [a.stare()['ordine_animatii'], a.stare()['animatie_galerie'], a.pg.evaluate(ANIMNR)]
    a.clic('meniu:Fade')
    r['apoi_fade'] = [a.stare()['ordine_animatii'], a.stare()['animatie_galerie'], a.pg.evaluate(ANIMNR)]
    a.clic('margine_forma:2/1'); a.clic('meniu:Wipe')
    r['titlu_wipe'] = [a.stare()['ordine_animatii'], a.pg.evaluate(ANIMNR)]
    a.clic('margine_forma:2/2'); a.clic('meniu:None')
    r['none_pe_continut'] = [a.stare()['ordine_animatii'], a.stare()['animatie_galerie'], a.pg.evaluate(ANIMNR)]
    a.clic('margine_forma:2/2'); a.clic('meniu:None')
    r['none_fara_animatie'] = [a.stare()['ordine_animatii'], a.mesaje()]
    # Add Animation: al doilea efect pe același obiect, apoi None le scoate pe toate
    a.clic('margine_forma:2/1'); a.clic('meniu_derulant:Animations/Advanced Animation/Add Animation')
    if a.exista('meniu:Pulse'):
        a.clic('meniu:Pulse')
    r['titlu_doua_efecte'] = a.stare()['ordine_animatii']
    a.clic('meniu:None'); r['titlu_none_toate'] = a.stare()['ordine_animatii']
    return r


@test('F058_animation_pane')
def f058(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:2'); a.clic('fila:Animations')
    a.clic('margine_forma:2/1'); a.clic('meniu:Fade')
    a.clic('margine_forma:2/2'); a.clic('meniu:Fly In')
    t0 = set(a.tinte())
    a.clic('panglica:Animations/Advanced Animation/Animation Pane')
    noi = [t for t in a.tinte() if t not in t0]
    r = {'tinte_noi_panou': noi[:30]}
    a.poza('F058_panou')
    a.clic('diapozitiv', dx=0.02, dy=0.98)
    r['dupa_clic_gol'] = [a.stare()['selectie_forma'], a.stare()['animatie_galerie']]
    rand = [t for t in noi if 'Fade' in t or 'Title' in t]
    if rand:
        a.clic(rand[0])
        r['clic_rand'] = [rand[0], a.stare()['selectie_forma'], a.stare()['animatie_galerie'], selectate(a)]
    r['mesaje'] = a.mesaje()
    return r


if __name__ == '__main__':
    ruleaza('rez3')
