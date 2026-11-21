# A doua trecere Word: evenimentele din window.__lhAplicatieEv, plus testele care au cerut alte ținte.
from h import *
import importlib.util
spec = importlib.util.spec_from_file_location('jw', OUT + '/joc_word.py')
R = {}


def clic_css(a, sel, i=0, dx=0.5, dy=0.5, asteapta=250):
    b = a.pg.evaluate("([s,i]) => { const e = document.querySelectorAll(s)[i]; if (!e) return null; e.scrollIntoView({block:'nearest'}); const r = e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }", [sel, i])
    if not b:
        raise RuntimeError('css lipsă: ' + sel)
    a.pg.mouse.click(b['x'] + b['w'] * dx, b['y'] + b['h'] * dy); a.pg.wait_for_timeout(asteapta)


def umple(a, eticheta_re, valoare):
    ok = a.pg.evaluate("""([re]) => { const r = new RegExp(re); const e = [...document.querySelectorAll('[data-lh-aplicatie] input')].find(x => x.getBoundingClientRect().width > 0 && r.test(x.getAttribute('aria-label') || (x.closest('[data-lh-eticheta]')||{getAttribute(){return ''}}).getAttribute('data-lh-eticheta') || ''));
      if (!e) return false; e.focus(); e.select(); return true; }""", [eticheta_re])
    if ok:
        a.pg.keyboard.press('Control+A'); a.pg.keyboard.type(str(valoare)); a.pg.wait_for_timeout(150)
    return ok


def test(nume):
    def dec(f):
        def g(ctx, port):
            try:
                R[nume] = f(ctx, port)
            except Exception as e:
                R[nume] = {'EROARE': repr(e)[:400]}
            print(nume, json.dumps(R[nume], ensure_ascii=False)[:1800])
        return g
    return dec


@test('word-F049_insert_table_dialog')
def t49(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar']})
    a.clic('fila:Insert'); a.clic('mso:TableInsertGallery')
    meniu = a.tinte('meniu:')
    it = [t for t in meniu if 'Insert Table' in t]
    out = {'meniu_fara_grila': [t for t in meniu if ' Table' not in t or 'Insert' in t][:12], 'nr_grila': len([t for t in meniu if t.endswith(' Table') and 'x' in t])}
    if it:
        a.clic(it[0])
        out['campuri'] = a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie] input')].filter(e => e.getBoundingClientRect().width > 0).map(e => (e.getAttribute('aria-label')||'') + '=' + e.value)")
        out['umplut'] = [umple(a, 'Number of columns', 4), umple(a, 'Number of rows', 3)]
        a.clic('fereastra:OK')
    out['tabele'] = a.stare()['tabele']; out['mesaje'] = a.mesaje(); out['ev'] = a.ev()[-3:]
    return out


@test('word-F045_show_hide')
def t45(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere', 'Doi']})
    e = a.pg.evaluate("() => { const e = LH.aplicatii.element('word','panglica:Home/Paragraph/Show All'); return e && {mso: e.getAttribute('data-lh-id-mso'), et: e.getAttribute('data-lh-eticheta'), pressed: e.getAttribute('aria-pressed')} }")
    a.clic('panglica:Home/Paragraph/Show All')
    on = a.pg.evaluate("() => { const r = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie')==='word'); const z = r.querySelector('[data-lh-zona]'); return {clasa: r.classList.contains('lh-ap-semne'), semne_vizibile: (z.innerText.match(/¶|·/g)||[]).length} }")
    a.poza('word_F045_dupa_clic')
    return {'buton': e, 'dupa_clic': on, 'ev': a.ev(), 'mesaje': a.mesaje(), 'scurtatura': (a.taste('Control+Shift+8'), a.ev(), a.mesaje())[1:]}


@test('word-F037_ctrl_space')
def t37(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere']})
    a.clic('text:1'); a.taste('Control+a', 'Control+b')
    a.ev()
    a.taste('Control+Space')
    return {'dupa_ctrl_space': a.stare()['formatare_pe_caractere'], 'text': a.stare()['text'], 'ev': a.ev(), 'mesaje': a.mesaje()}


@test('word-F050_delete_celula')
def t50(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar'], 'tabel': {'randuri': 1, 'coloane': 2, 'celule': [['Luni', 'Marti']]}})
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="0"]')
    a.taste('Home', 'Delete')
    return {'tabele': a.stare()['tabele'], 'ev': a.ev()[-2:]}


@test('word-F052_enter_celula')
def t52(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar'], 'tabel': {'randuri': 1, 'coloane': 2, 'celule': [['Luni', 'Marti']]}})
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="0"]')
    a.ev(); a.taste('End', 'Enter')
    return {'tabele': a.stare()['tabele'], 'ev': a.ev(), 'mesaje': a.mesaje()}


@test('word-F063_imagine')
def t63(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Poza:']})
    a.clic('fila:Insert')
    ins = [t for t in a.tinte() if '/Illustrations/' in t]
    out = {'ilustratii': ins}
    pic = [t for t in ins if 'Pictures' in t]
    if pic:
        a.clic(pic[0])
        m = a.tinte('meniu:'); out['meniu'] = m[:10]
        dev = [t for t in m if 'This Device' in t or 'Device' in t]
        if dev:
            a.clic(dev[0])
            out['lista'] = a.tinte('lista:')[:8]
            lst = a.tinte('lista:')
            if lst:
                a.clic(lst[0])
            else:
                umple(a, 'File name', 'vulcan.png')
            ins_b = [t for t in a.tinte() if t.endswith(':Insert') or 'Insert' == t.split(':')[-1]]
            if ins_b:
                a.clic(ins_b[0])
            else:
                a.taste('Enter')
    out['imagini'] = a.stare()['imagini']
    if a.exista('imagine:1'):
        a.clic('imagine:1')
        out['dupa_clic_pe_imagine'] = a.pg.evaluate("() => { const r = document.querySelector('[data-lh-aplicatie=word]'); const i = r.querySelector('[data-lh-tinta=imagine]'); const b = i.getBoundingClientRect(); return {wh: [b.width, b.height], manere: r.querySelectorAll('[class*=maner],[class*=handle],[data-lh-tinta*=maner]').length, file: [...r.querySelectorAll('[data-lh-tinta=fila]')].map(x=>x.getAttribute('data-lh-id')).slice(-2)}; }")
        a.poza('word_F063_imagine_aleasa')
    out['mesaje'] = a.mesaje()
    return out


@test('word-F103_zone')
def t103(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    out = {}
    for t, dx, dy in [('bara_titlu:Document1  -  Word', 0.3, 0.5), ('panglica:Home/Font/Bold', 0.5, 0.5), ('document', 0.5, 0.9), ('bara_derulare:Line down', 0.5, 0.5), ('bara_stare:Page Number', 0.5, 0.5)]:
        try:
            a.clic(t, dx, dy); out[t] = [(e['gest'], e['actiune'], e['tinta']) for e in a.ev()]
        except Exception as e:
            out[t] = repr(e)[:120]
    a.clic('fila:View'); a.ev()
    a.clic('panglica:View/Show/Ruler'); out['view_ruler'] = [a.ev(), a.mesaje()]
    return out


with sesiune() as (ctx, port, blocate):
    for f in [t49, t45, t37, t50, t52, t63, t103]:
        f(ctx, port)
    R['_blocate'] = blocate
rezultat('rez_word2', R)
