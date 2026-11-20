# -*- coding: utf-8 -*-
"""Proba 2: starea finală după gesturi și după greșeli (anulare, ștergeri, ferestre, mărimi greșite, salvare, expunere)."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru

C2 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                      {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti de foc']}], 'diapozitiv_activ': 1}
R = {}


def scurt(s):
    return {k: s.get(k) for k in ('diapozitive', 'diapozitiv_activ', 'panou', 'selectie_text', 'selectie_forma', 'modificat', 'formatare_text',
                                  'formatare_pe_caractere', 'nume_fisier', 'dialog', 'backstage', 'expunere', 'tema', 'tranzitie_galerie', 'animatie_galerie')}


with Ham() as H:
    # A. tastare, Ctrl+Z, apoi tastare din nou (selecția revine?)
    pg = H.app('powerpoint', C2)
    clic(pg, 'forma:2/1') if False else None
    clic(pg, 'miniatura:2'); clic(pg, 'forma:2/1')
    pg.keyboard.press('End'); pg.keyboard.type(' mari', delay=10)
    a1 = scurt(st(pg))
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(50)
    a2 = scurt(st(pg))
    pg.keyboard.type('X', delay=10)
    a3 = scurt(st(pg))
    pg.keyboard.press('Control+y'); pg.wait_for_timeout(50)
    a4 = scurt(st(pg))
    R['A_undo_tastare'] = {'dupa_tastare': a1['diapozitive'][1], 'sel1': a1['selectie_text'], 'dupa_ctrlz': a2['diapozitive'][1], 'sel2': a2['selectie_text'],
                           'zona_tinta_ev': ev(pg), 'dupa_X': a3['diapozitive'][1], 'sel3': a3['selectie_text'], 'dupa_ctrly': a4['diapozitive'][1], 'mod': a4['modificat']}
    pg.close()

    # A2. tastare două cuvinte cu clic intre ele? doar tastare continuă cu Enter: câte unități
    pg = H.app('powerpoint', C2)
    clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); pg.keyboard.press('End')
    pg.keyboard.type(' si lava', delay=10); pg.keyboard.press('Enter'); pg.keyboard.type('Rand nou', delay=10)
    b0 = st(pg)['diapozitive'][1]['texte']
    pg.keyboard.press('Control+z'); b1 = st(pg)['diapozitive'][1]['texte']
    pg.keyboard.press('Control+z'); b2 = st(pg)['diapozitive'][1]['texte']
    R['A2_unitati_anulare'] = [b0, b1, b2]
    pg.close()

    # B. ștergerea tuturor diapozitivelor, apoi New Slide / Ctrl+M / tema / tranziție
    pg = H.app('powerpoint', C2)
    clic(pg, 'miniatura:1'); pg.keyboard.press('Delete'); pg.keyboard.press('Delete'); pg.wait_for_timeout(50)
    b = scurt(st(pg))
    ecr = pg.evaluate("(()=>{const r=document.querySelector('[data-lh-aplicatie=powerpoint]');return {ind:(r.querySelector('[data-lh-eticheta^=\"View Indicator\"]')||{}).textContent,mini:r.querySelectorAll('[data-lh-tinta=miniatura]').length,forme:r.querySelectorAll('[data-lh-tinta=forma]').length}})()")
    e0 = ev(pg)
    pg.keyboard.press('Control+m'); pg.wait_for_timeout(50)
    b2 = scurt(st(pg))
    ecr2 = pg.evaluate("(()=>{const r=document.querySelector('[data-lh-aplicatie=powerpoint]');return {ind:(r.querySelector('[data-lh-eticheta^=\"View Indicator\"]')||{}).textContent,mini:r.querySelectorAll('[data-lh-tinta=miniatura]').length,forme:r.querySelectorAll('[data-lh-tinta=forma]').length}})()")
    pg.keyboard.press('Control+m'); pg.wait_for_timeout(50)
    b3 = scurt(st(pg))
    R['B_sterge_tot'] = {'dupa_2xDelete': [b['diapozitive'], b['diapozitiv_activ']], 'ecran': ecr, 'ev': e0, 'dupa_ctrlm': [b2['diapozitive'], b2['diapozitiv_activ']], 'ecran2': ecr2,
                         'dupa_ctrlm2': [len(b3['diapozitive']), b3['diapozitiv_activ']], 'ev2': ev(pg), 'erori': list(H.erori)}
    pg.close()
    # B2. zero diapozitive, apoi Transitions > Fade și Design > tema
    pg = H.app('powerpoint', C2)
    clic(pg, 'miniatura:1'); pg.keyboard.press('Delete'); pg.keyboard.press('Delete')
    clic(pg, 'mso:TabTransitions'); clic(pg, 'meniu:Fade')
    e1 = ev(pg)
    R['B2_zero_tranzitie'] = {'ev': e1, 'stare': scurt(st(pg)) if True else None, 'erori': list(H.erori)}
    pg.close()

    # C. Esc în editare: forma aleasă, apoi deselectare; Delete pe forma aleasă ca obiect
    pg = H.app('powerpoint', C2)
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); c1 = scurt(st(pg))
    pg.keyboard.type('Nou', delay=10); c2 = scurt(st(pg))
    R['C_tastare_pe_obiect'] = {'dupa_esc': [c1['selectie_forma'], c1['selectie_text']], 'dupa_tastare': c2['diapozitive'][0], 'ev': ev(pg)}
    pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.keyboard.press('Escape')
    c3 = scurt(st(pg)); pg.keyboard.type('Z', delay=10); c4 = scurt(st(pg))
    R['C_tastare_fara_caseta'] = {'sel': [c3['selectie_forma'], c3['selectie_text']], 'dupa': c4['diapozitive'][0], 'ev': ev(pg)}
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); pg.keyboard.press('Delete')
    c5 = scurt(st(pg))
    R['C_delete_obiect'] = {'dia1': c5['diapozitive'][0], 'ev': ev(pg)}
    pg.close()

    # D. Font Size: caseta din Home cu 0, 5000, abc, 12,5 ; Increase pe text parțial
    pg = H.app('powerpoint', C2)
    rez = []
    for v in ['0', '5000', 'abc', '12,5', '4000']:
        clic(pg, 'forma:1/1'); pg.keyboard.press('Escape')
        inp = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-id-mso=FontSize] input');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,e.value]})()")
        pg.mouse.click(inp[0], inp[1]); pg.keyboard.type(v, delay=10); pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
        s = st(pg)
        val = pg.evaluate("document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-id-mso=FontSize] input').value")
        rez.append({'scris': v, 'inainte_caseta': inp[2], 'marime': s['formatare_text']['marime'], 'caseta_dupa': val, 'ev': ev(pg)[-1:], 'nes': nesimulat(pg)})
    R['D_font_size'] = rez
    pg.close()

    # E. Fereastra Font: clic dreapta pe text > Font... ; Size 5000 / 0 / abc + OK ; Cancel ; Esc ; ×
    pg = H.app('powerpoint', C2)
    rez = []
    for v, cum in [('20', 'OK'), ('30', 'Cancel'), ('40', 'Esc'), ('0', 'OK'), ('5000', 'OK'), ('abc', 'Enter'), ('44', 'Enter')]:
        clic(pg, 'forma:1/1'); pg.keyboard.press('Escape')
        clic(pg, 'forma:1/1', button='right'); clic(pg, 'meniu:Font...')
        dl = pg.evaluate("(()=>{const d=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"dialog.FontDialogPowerPoint\"]');if(!d)return null;const i=d.querySelector('[data-lh-eticheta=Size] input');const r=i.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,i.value]})()")
        if not dl:
            rez.append({'v': v, 'err': 'fara fereastra', 'ev': ev(pg)}); continue
        pg.mouse.click(dl[0], dl[1]); pg.keyboard.press('Control+a'); pg.keyboard.type(v, delay=10)
        if cum == 'OK':
            clic(pg, 'fereastra:OK')
        elif cum == 'Cancel':
            clic(pg, 'fereastra:Cancel')
        elif cum == 'Esc':
            pg.keyboard.press('Escape')
        else:
            pg.keyboard.press('Enter')
        pg.wait_for_timeout(50)
        s = st(pg)
        rez.append({'v': v, 'cum': cum, 'size_initial': dl[2], 'marime': s['formatare_text']['marime'], 'dialog': s['dialog'], 'mod': s['modificat'], 'ev': ev(pg)[-1:]})
        if s['dialog']:
            pg.keyboard.press('Escape')
    R['E_font_dialog'] = rez
    pg.close()

    # F. Insert Table: 0, 100, abc coloane
    pg = H.app('powerpoint', C2)
    rez = []
    for k, r_ in [('0', '2'), ('100', '2'), ('abc', '2'), ('3', '2')]:
        clic(pg, 'mso:TabInsert'); clic(pg, 'mso:TableInsertGallery'); ok = clic(pg, 'meniu:Insert Table...')
        d = pg.evaluate("(()=>{const d=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"dialog.TableInsertDialog\"]');if(!d)return null;return [...d.querySelectorAll('input')].map(i=>{const r=i.getBoundingClientRect();return [i.closest('[data-lh-eticheta]').getAttribute('data-lh-eticheta'),r.x+r.width/2,r.y+r.height/2,i.value]})})()")
        if not d:
            rez.append({'k': k, 'err': 'fara fereastra', 'ok': ok, 'ev': ev(pg)}); continue
        for et, x, y, val in d:
            if et == 'Number of columns':
                pg.mouse.click(x, y); pg.keyboard.press('Control+a'); pg.keyboard.type(k)
            if et == 'Number of rows':
                pg.mouse.click(x, y); pg.keyboard.press('Control+a'); pg.keyboard.type(r_)
        clic(pg, 'fereastra:OK'); pg.wait_for_timeout(50)
        s = st(pg)
        rez.append({'k': k, 'init': [x[3] for x in d], 'forme_dia1': s['diapozitive'][0]['forme'], 'dialog': s['dialog'], 'ev': ev(pg)[-1:], 'nes': nesimulat(pg)})
        if s['dialog']:
            pg.keyboard.press('Escape')
    R['F_insert_table'] = rez
    pg.close()

    # G. Save As: F12, nume, Enter; titlul; Ctrl+S pe prezentare nouă; modificat
    pg = H.app('powerpoint', C2)
    g0 = st(pg)['modificat']
    pg.keyboard.press('Control+s'); pg.wait_for_timeout(80)
    g1 = scurt(st(pg)); e1 = ev(pg)
    pg.keyboard.press('Escape'); g2 = scurt(st(pg))
    clic(pg, 'forma:1/1'); pg.keyboard.type('!', delay=10)
    pg.keyboard.press('F12'); pg.wait_for_timeout(80)
    fn = pg.evaluate("(()=>{const i=document.querySelector('[data-lh-aplicatie=powerpoint] input[aria-label^=\"File name\"]');return i?[i.value,document.activeElement===i]:null})()")
    pg.keyboard.type('Vulcanii', delay=10); pg.keyboard.press('Enter'); pg.wait_for_timeout(80)
    g3 = scurt(st(pg)); e3 = ev(pg)
    titlu = pg.evaluate("(()=>{const t=document.querySelector('[data-lh-aplicatie=powerpoint] .lh-ap-x-titlu');return t?t.textContent:null})()")
    clic(pg, 'forma:1/1'); pg.keyboard.type('?', delay=10); g4 = st(pg)['modificat']
    pg.keyboard.press('Control+s'); g5 = scurt(st(pg))
    pg.keyboard.press('Control+z'); g6 = st(pg)['modificat']
    R['G_salvare'] = {'mod_pornire': g0, 'ctrls_nou': [g1['backstage'], g1['dialog'], g1['modificat']], 'ev_ctrls': e1, 'esc': [g2['backstage']],
                      'f12_camp': fn, 'dupa_saveas': [g3['nume_fisier'], g3['modificat'], g3['dialog']], 'ev_saveas': e3, 'titlu': titlu,
                      'mod_dupa_edit': g4, 'ctrls_cu_nume': [g5['modificat'], g5['backstage']], 'mod_dupa_ctrlz_dupa_salvare': g6}
    pg.close()

    # H. F5 / Shift+F5 / Esc și From Beginning; Esc pe ce diapozitiv rămâi
    pg = H.app('powerpoint', C2)
    clic(pg, 'miniatura:2')
    pg.keyboard.press('F5'); h1 = st(pg)['expunere']
    pg.keyboard.press('ArrowRight'); h2 = st(pg)['expunere']
    pg.keyboard.press('Escape'); h3 = scurt(st(pg))
    pg.keyboard.press('Shift+F5'); h4 = st(pg)['expunere']; pg.keyboard.press('Escape')
    R['H_expunere'] = {'f5': h1, 'dupa_dreapta': h2, 'dupa_esc': [h3['expunere'], h3['diapozitiv_activ']], 'shift_f5_de_pe_2': h4, 'ev': ev(pg)}
    pg.close()

    # I. Bold pe bucată, cursor în cuvânt, Ctrl+B, apoi Ctrl+Z: revin bucățile și selecția?
    pg = H.app('powerpoint', C2)
    clic(pg, 'forma:1/2'); pg.keyboard.press('Home')
    for _ in range(3):
        pg.keyboard.press('Shift+ArrowRight')
    pg.keyboard.press('Control+b'); i1 = scurt(st(pg))
    pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight')
    pg.keyboard.press('Control+i'); i2 = scurt(st(pg))
    pg.keyboard.press('Control+z'); i3 = scurt(st(pg))
    pg.keyboard.press('Control+z'); i4 = scurt(st(pg))
    R['I_bucati'] = {'bold_3': [i1['formatare_pe_caractere'], i1['selectie_text']], 'italic_cursor_in_cuvant': [i2['formatare_pe_caractere'], i2['selectie_text']],
                     'ctrlz1': [i3['formatare_pe_caractere'], i3['selectie_text'], i3['selectie_forma']], 'ctrlz2': [i4['formatare_pe_caractere'], i4['modificat']], 'ev': ev(pg)}
    pg.close()
    R['erori'] = H.erori
    R['plecate'] = H.plecate
scrie(R, 'p2_stare.json')
print('gata')
