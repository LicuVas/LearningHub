# -*- coding: utf-8 -*-
"""B · KeyTips: fiecare șir pe o instanță proaspătă; după fiecare tastă: insignele, lista, focusul, evenimentele."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [{'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}
SEL = ('font_text', 'culoare_text', 'umplere_forme', 'fundal_diapozitive', 'vedere', 'prezentari_deschise', 'prezentare_activa',
       'diapozitiv_activ', 'selectie_forma', 'panou', 'expunere', 'dialog', 'backstage', 'formatare_text', 'note_diapozitive', 'pornire_animatii')


def texte(pg):
    return [d.get('texte') for d in S(pg)['diapozitive']]


def prep_do(pg, prep):
    for p in prep:
        if p[0] == 'clic':
            clic(pg, p[1], dx=p[2] if len(p) > 2 else 0.5, dy=p[3] if len(p) > 3 else 0.5)
        elif p[0] == 'tast':
            taste(pg, *p[1])
        elif p[0] == 'type':
            pg.keyboard.type(p[1]); pg.wait_for_timeout(80)
        elif p[0] == 'js':
            pg.evaluate(p[1]); pg.wait_for_timeout(80)


def rul(H, prep, chei, dupa=None, cont=None):
    pg = H.app('powerpoint', cont or C)
    try:
        prep_do(pg, prep)
        ev(pg)
        out = {'pasi': sir(pg, chei)}
        for d in (dupa or []):
            if d[0] == 'type':
                pg.keyboard.type(d[1]); pg.wait_for_timeout(120)
                out.setdefault('dupa', []).append({'type': d[1], 'ev': ev(pg), 'foc': foc(pg)})
            else:
                out.setdefault('dupa', []).append(pas(pg, d[1]))
        s = S(pg)
        out['stare'] = {k: s.get(k) for k in SEL}
        out['texte'] = texte(pg)
        out['erori'] = list(H.erori)
    except Exception:
        out = {'eroare': traceback.format_exc()[-600:]}
    pg.close()
    return out


def arata(R, fis):
    linii = []
    for k, v in R.items():
        if k == 'plecate':
            linii.append('plecate %s' % v); continue
        if 'eroare' in v:
            linii.append('%s EROARE %s' % (k, v['eroare'][-300:])); continue
        linii.append('\n## ' + k)
        for p in v['pasi'] + v.get('dupa', []):
            f = p.get('foc') or {}
            linii.append('   %s | kt %s | men %s | foc %s %s %s | ev %s | dlg %s | nes %s' % (
                p.get('k', p.get('type')), (','.join(p.get('kt') or []))[:70], p.get('men'), f.get('tinta'), f.get('tag'), f.get('val'),
                [(e['g'], e['a'], e['t'], e['act']) for e in p.get('ev', [])], p.get('dlg'), p.get('nesim')))
        linii.append('   STARE %s | texte %s | err %s' % (json.dumps({a: b for a, b in v['stare'].items() if b not in (None, [], '')}, ensure_ascii=False)[:600], v['texte'], v['erori'][-2:]))
    open(os.path.join(os.path.dirname(__file__), fis), 'w', encoding='utf-8').write('\n'.join(linii))


if __name__ == '__main__':
    R = {}
    T = ('clic', 'forma:1/1')
    B = ('clic', 'margine_forma:1/1')
    STEA = [('clic', 'miniatura:2'), ('clic', 'forma:2/2')]
    with Ham() as H:
        R['font_kt'] = rul(H, [T, B], ['Alt', 'h', 'f', 'f'], [('type', 'Arial'), ('k', 'Enter')])
        R['font_kt_altjos'] = rul(H, [T, B], ['Alt', 'h', 'f', 'f', 'Alt+ArrowDown', 'ArrowDown', 'ArrowDown', 'Enter'])
        R['fontcolor_kt'] = rul(H, [T, B], ['Alt', 'h', 'f', 'c', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'Enter'])
        R['fontcolor_kt_esc'] = rul(H, [T, B], ['Alt', 'h', 'f', 'c', 'Escape', 'Escape', 'Escape', 'Escape'], [('type', 'x')])
        R['esc_nivele'] = rul(H, [T], ['Alt', 'h', 'f', 'Escape', 'Escape', 'Escape', 'Escape'], [('type', 'x')])
        R['gresit'] = rul(H, [T], ['Alt', 'h', 'q', 'z', '8', 'j', 'Escape', 'Escape'], [('type', 'y')])
        R['gresit_alt'] = rul(H, [T], ['Alt', 'x', 'v'], [('type', 'w')])
        R['shapefill_home'] = rul(H, STEA, ['Alt', 'h', 's', 'f', 'ArrowDown', 'Enter'])
        R['shapefill_ctx'] = rul(H, STEA, ['Alt', 'j', 'd', 's', 'f', 'h', 'Escape', 'Escape'])
        R['outline_weight'] = rul(H, STEA, ['Alt', 'j', 'd', 's', 'o', 'w', 'ArrowDown', 'ArrowDown', 'Enter'])
        R['bgstyles'] = rul(H, [], ['Alt', 'g', 'b', 'ArrowDown', 'ArrowDown', 'Escape', 'Escape', 'Escape'])
        R['bgstyles_B'] = rul(H, [], ['Alt', 'g', 'b', 'b'])
        R['bgstyles_enter'] = rul(H, [], ['Alt', 'g', 'b'] + ['ArrowRight'] * 6 + ['Enter'])
        R['newslide'] = rul(H, [], ['Alt', 'h', 'i', 'ArrowDown', 'ArrowDown', 'Enter'])
        R['newslide_d'] = rul(H, [('clic', 'miniatura:1')], ['Alt', 'h', 'i', 'd'])
        R['layout'] = rul(H, [], ['Alt', 'h', 'l', 'ArrowRight', 'Enter'])
        R['shapes'] = rul(H, [], ['Alt', 'n', 's', 'h', 'ArrowDown', 'ArrowDown', 'Enter'])
        R['pictures'] = rul(H, [], ['Alt', 'n', 'p', 'd'])
        R['notes_view'] = rul(H, [], ['Alt', 'w', 'p', 'n'])
        R['sorter'] = rul(H, [], ['Alt', 'w', 'i'], [('k', 'Alt'), ('k', 'w'), ('k', 'l')])
        R['reading'] = rul(H, [], ['Alt', 'w', 'd', 'Escape'])
        R['notespage'] = rul(H, [], ['Alt', 'w', 't'])
        R['slideshow_b'] = rul(H, [('clic', 'miniatura:2')], ['Alt', 's', 'b'], [('k', 'Escape'), ('k', 'Alt'), ('k', 's'), ('k', 'c')])
        R['blank'] = rul(H, [], ['Alt', 'f', 'n', 'l', '1'])
        R['browse'] = rul(H, [], ['Alt', 'f', 'o', 'o'])
        R['start_kt'] = rul(H, [T, B, ('clic', 'fila:Animations'), ('clic', 'meniu:Fade')], ['Alt', 'a', 't'], [('k', 'ArrowDown'), ('k', 'Enter')])
        R['plecate'] = H.plecate
    scrie(R, 'b1_out.json')
    arata(R, 'b1_out.txt')
