# -*- coding: utf-8 -*-
"""Criticul 14 · B (stare_finala_erori): greșeala tipică a elevului, apoi Ctrl+Z / Ctrl+Y. Starea după anulare = starea dinainte?
Ecranul = starea (miniaturile, textele, culoarea, fontul, fundalul, nota, caseta Font)? Gesturi adevărate, 1366×768."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}
VOLATIL = {'selectie_text', 'selectie_forma', 'caseta_activa', 'formatare_text', 'formatare_pe_caractere', 'paragrafe_text',
           'culoare_text', 'font_text', 'diapozitiv_activ', 'panou', 'modificat', 'dialog', 'backstage'}
R = {}

ECRAN = r"""(()=>{const r=document.querySelector('[data-lh-aplicatie="powerpoint"]');const vis=x=>x&&x.offsetParent!==null;
 const mini=[...r.querySelectorAll('[data-lh-tinta="miniatura"]')].filter(vis).map(x=>x.innerText.replace(/\s+/g,' ').trim());
 const zona=r.querySelector('[data-lh-zona]');
 const forme=zona?[...zona.querySelectorAll('[data-lh-tinta="forma"]')].filter(vis).map(x=>[x.getAttribute('data-lh-id'),x.innerText.replace(/\s+/g,' ').trim()]):[];
 const t=zona&&zona.querySelector('[data-lh-tinta="forma"] .lh-ap-p-text');
 let span=t&&[...t.querySelectorAll('span')].find(s=>s.childNodes.length&&s.textContent.trim());
 const cs=span?getComputedStyle(span):(t?getComputedStyle(t):null);
 let w=null;if(span){const rg=document.createRange();rg.selectNodeContents(span);w=Math.round(rg.getBoundingClientRect().width*10)/10;}
 const dia=LH.aplicatii.element('powerpoint','diapozitiv');
 const fbg=dia?getComputedStyle(dia).backgroundColor:null;
 const fi=(LH.aplicatii.element('powerpoint','mso:Font')||{querySelector:()=>null}).querySelector('input');
 const nota=r.querySelector('[data-lh-tinta="zona_note"]');
 const titlu=(r.querySelector('[data-lh-suprafata="bara_titlu"]')||{}).innerText;
 return {mini,forme,titlu_culoare:cs&&cs.color,titlu_font:cs&&cs.fontFamily,titlu_w:w,fundal:fbg,caseta_font:fi?fi.value:null,
   nota:nota&&vis(nota)?nota.innerText.trim():null,bara_titlu:titlu&&titlu.split('\n')[0],
   nesim:[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].filter(vis).length}})()"""


def ecran(pg):
    return pg.evaluate(ECRAN)


def dif(a, b):
    return sorted(k for k in set(a) | set(b) if k not in VOLATIL and a.get(k) != b.get(k))


def caz(nume, greseala, cont=C, fara_y=False, pregatire=None):
    try:
        pg = H.app('powerpoint', cont)
        if pregatire:
            pregatire(pg)
        s0 = st(pg); e0 = ecran(pg); ev(pg)
        greseala(pg)
        s1 = st(pg); e1 = ecran(pg); g_ev = [(x['g'], x['a'], x['t']) for x in ev(pg)]
        pg.keyboard.press('Control+z'); pg.wait_for_timeout(200)
        s2 = st(pg); e2 = ecran(pg); z_ev = [(x['g'], x['a']) for x in ev(pg)]
        o = {'greseala_ev': g_ev[-4:], 'schimbat_de_greseala': dif(s0, s1), 'ctrl_z_ev': z_ev,
             'dupa_z_diferit_de_inainte': dif(s0, s2),
             'ecran_dupa_z_diferit': {k: [e0[k], e2[k]] for k in e0 if e0[k] != e2[k]}}
        if o['dupa_z_diferit_de_inainte']:
            o['detalii_z'] = {k: [s0.get(k), s2.get(k)] for k in o['dupa_z_diferit_de_inainte']}
            # al doilea Ctrl+Z
            pg.keyboard.press('Control+z'); pg.wait_for_timeout(200)
            s2b = st(pg); o['dupa_z2_diferit'] = dif(s0, s2b); o['z2_ev'] = [(x['g'], x['a']) for x in ev(pg)]
            pg.keyboard.press('Control+y'); pg.wait_for_timeout(200); ev(pg)
        if not fara_y:
            pg.keyboard.press('Control+y'); pg.wait_for_timeout(200)
            s3 = st(pg); e3 = ecran(pg)
            o['ctrl_y_ev'] = [(x['g'], x['a']) for x in ev(pg)]
            o['dupa_y_diferit_de_greseala'] = dif(s1, s3)
            o['ecran_dupa_y_diferit_de_greseala'] = {k: [e1[k], e3[k]] for k in e1 if e1[k] != e3[k]}
        o['sel'] = {k: [s0.get(k), s2.get(k)] for k in ('selectie_forma', 'selectie_text', 'diapozitiv_activ', 'font_text', 'culoare_text')}
        o['e0'] = e0
        R[nume] = o
        pg.close()
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-700:]}


def chenar_titlu(pg):
    clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1')


with Ham() as H:
    caz('font_color_red', lambda pg: (chenar_titlu(pg), clic(pg, 'meniu_derulant:Home/Font/Font Color'), clic(pg, 'meniu:Red')))
    caz('font_arial', lambda pg: (chenar_titlu(pg), clic(pg, 'meniu_derulant:Home/Font/Font'), clic(pg, 'meniu:Arial')))
    caz('font_calibri_light_all_fonts', lambda pg: (chenar_titlu(pg), clic(pg, 'meniu_derulant:Home/Font/Font'), clic(pg, 'meniu:Calibri Light')))
    caz('tranzitie_push', lambda pg: (clic(pg, 'fila:Transitions'), clic(pg, 'meniu:Push')))
    caz('animatie_fly_in', lambda pg: (chenar_titlu(pg), clic(pg, 'fila:Animations'), clic(pg, 'meniu:Fly In')))
    caz('aspect_two_content', lambda pg: (clic(pg, 'miniatura:3'), clic(pg, 'meniu_derulant:Home/Slides/Layout'), clic(pg, 'meniu:Two Content')))
    caz('fundal_style6', lambda pg: (clic(pg, 'fila:Design'), clic(pg, 'meniu_derulant:Design/Customize/Background Styles'), clic(pg, 'meniu:Style 6')))
    caz('shape_fill_red', lambda pg: (clic(pg, 'miniatura:2'), clic(pg, 'forma:2/2'), clic(pg, 'meniu_derulant:Home/Drawing/Shape Fill'), clic(pg, 'meniu:Red')))

    def oval(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Illustrations/Shapes'); clic(pg, 'meniu:Oval')
        r = centru(pg, 'diapozitiv'); pg.mouse.click(r[0] + 150, r[1] + 60); pg.wait_for_timeout(150)
    caz('forma_oval', oval)

    def sterge_dia(pg):
        clic(pg, 'miniatura:2'); taste(pg, 'Delete')
    caz('sterge_diapozitiv_2', sterge_dia)

    def sterge_stea(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); taste(pg, 'Delete')
    caz('sterge_stea', sterge_stea)

    def dubla(pg):
        clic(pg, 'miniatura:2'); taste(pg, 'Control+d')
    caz('ctrl_d_miniatura', dubla)

    def nota(pg):
        clic(pg, 'zona_note'); pg.keyboard.type('Gresit aici'); pg.wait_for_timeout(150)
    caz('nota_gresita', nota)

    def titlu_tastat(pg):
        r = centru(pg, 'forma:1/1'); pg.mouse.click(r[0] + 120, r[1]); pg.wait_for_timeout(100); pg.keyboard.type('abc'); pg.wait_for_timeout(100)
    caz('titlu_tastat', titlu_tastat)

    def new_slide(pg):
        clic(pg, 'panglica:Home/Slides/New Slide')
    caz('new_slide', new_slide)

    def marime(pg):
        chenar_titlu(pg); clic(pg, 'panglica:Home/Font/Increase Font Size')
    caz('increase_font', marime)
    R['plecate'] = H.plecate; R['erori'] = H.erori
scrie(R, 'b1_out.json')
print('gata')
