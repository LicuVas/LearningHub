# -*- coding: utf-8 -*-
"""Criticul 14 · B: „ecranul = starea” după drumurile cu greșeli (culoarea, fundalul, pozițiile, durata, ordinea animațiilor),
cu Ctrl+Z la fiecare; drumul m1-l07 (Fade, Apply To All, Start), m2-l10 (Arrow: Right)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B', 'Rând']}], 'diapozitiv_activ': 1}
R = {}
ECR = r"""(()=>{const r=document.querySelector('[data-lh-aplicatie="powerpoint"]');const z=r.querySelector('[data-lh-zona]');
 const f1=z&&z.querySelector('[data-lh-tinta="forma"]');let bg=null,el=f1,dia=null;while(el&&el!==r){const c=getComputedStyle(el);if(c.backgroundColor!=='rgba(0, 0, 0, 0)'||c.backgroundImage!=='none'){bg=c.backgroundColor;dia=el;break}el=el.parentElement}
 const db=dia?dia.getBoundingClientRect():null;
 const forme=z?[...z.querySelectorAll('[data-lh-tinta="forma"]')].filter(x=>x.offsetParent).map(x=>{const b=x.getBoundingClientRect();const k=db?960/db.width:1;
   const s=[...x.querySelectorAll('span')].find(y=>y.childNodes.length&&y.textContent.trim());
   return [x.getAttribute('data-lh-id'),[b.x-db.x,b.y-db.y,b.width,b.height].map(v=>Math.round(v*k)),s?getComputedStyle(s).color:null]}):[];
 const mini=[...r.querySelectorAll('[data-lh-tinta="miniatura"]')].filter(x=>x.offsetParent).map(x=>{let e=x.querySelector('*');let c=null;for(const y of x.querySelectorAll('*')){const s=getComputedStyle(y);if(s.backgroundColor!=='rgba(0, 0, 0, 0)'){c=s.backgroundColor;break}}return c});
 const dur=r.querySelector('[data-lh-tinta="panglica"][data-lh-id$="Duration"] input, [data-lh-eticheta="Duration"] input');
 const pan=[...r.querySelectorAll('[data-lh-suprafata^="panou.AnimationCustom"] [data-lh-tip="ListItem"]')].filter(x=>x.offsetParent).map(x=>x.innerText.replace(/\s+/g,' ').trim().slice(0,40));
 return {fundal:bg,forme,mini_fundal:mini,durata:dur?dur.value:null,panou_anim:pan}})()"""


def fx(nume, f, cont=C):
    try:
        pg = H.app('powerpoint', cont)
        R[nume] = f(pg)
        pg.close()
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-700:]}


def E(pg):
    return pg.evaluate(ECR)


def evs(pg):
    return [(x['g'], x['a'], x['t']) for x in ev(pg)]


with Ham() as H:
    def culoare(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'meniu_derulant:Home/Font/Font Color'); clic(pg, 'meniu:Dark Blue')
        o = {'ev': evs(pg)[-1:], 'st': S(pg, 'culoare_text'), 'ecran': E(pg)['forme'][:1]}
        taste(pg, 'Control+z'); o['z'] = [S(pg, 'culoare_text'), E(pg)['forme'][:1]]
        return o
    fx('culoare_dark_blue', culoare)

    def fundal(pg):
        clic(pg, 'fila:Design'); clic(pg, 'meniu_derulant:Design/Customize/Background Styles'); clic(pg, 'meniu:Style 6')
        o = {'st': S(pg, 'fundal_diapozitive'), 'ecran': {k: E(pg)[k] for k in ('fundal', 'mini_fundal')}}
        taste(pg, 'Control+z'); o['z'] = [S(pg, 'fundal_diapozitive'), {k: E(pg)[k] for k in ('fundal', 'mini_fundal')}]
        return o
    fx('fundal_style6', fundal)

    def pozitii(pg):
        clic(pg, 'miniatura:2'); e = E(pg)
        return {'st': S(pg, 'pozitii_forme')['pozitii_forme'][1], 'ecran': e['forme']}
    fx('pozitii', pozitii)

    def tranzitii(pg):
        clic(pg, 'fila:Transitions'); clic(pg, 'meniu:Fade'); o = {'fade': [S(pg, 'durata_tranzitie', 'tranzitie_galerie'), E(pg)['durata']]}
        clic(pg, 'panglica:Transitions/Timing/Apply To All'); o['apply'] = [evs(pg)[-1:], S(pg, 'durata_tranzitie', 'diapozitive')]
        taste(pg, 'Control+z'); o['z'] = [evs(pg), S(pg, 'durata_tranzitie', 'diapozitive'), E(pg)['durata']]
        taste(pg, 'Control+z'); o['z2'] = [evs(pg), S(pg, 'durata_tranzitie', 'tranzitie_galerie'), E(pg)['durata']]
        clic(pg, 'meniu:Push'); o['push'] = [S(pg, 'durata_tranzitie', 'tranzitie_galerie'), E(pg)['durata']]
        return o
    fx('tranzitii_fade_apply_push', tranzitii)

    def anim(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/1'); clic(pg, 'margine_forma:2/1'); clic(pg, 'fila:Animations'); clic(pg, 'meniu:Fade')
        clic(pg, 'forma:2/2'); clic(pg, 'meniu:Fly In'); clic(pg, 'panglica:Animations/Advanced Animation/Animation Pane'); pg.wait_for_timeout(200)
        o = {'st': S(pg, 'ordine_animatii', 'pornire_animatii'), 'panou': E(pg)['panou_anim']}
        clic(pg, 'forma:2/2'); clic(pg, 'panglica:Animations/Timing/Start'); clic(pg, 'meniu:With Previous')
        o['with_prev'] = [S(pg, 'pornire_animatii'), E(pg)['panou_anim']]
        taste(pg, 'Control+z'); o['z'] = [S(pg, 'pornire_animatii', 'ordine_animatii'), E(pg)['panou_anim']]
        taste(pg, 'Control+z'); o['z2'] = [S(pg, 'pornire_animatii', 'ordine_animatii'), E(pg)['panou_anim']]
        o['nes'] = nesimulat(pg)
        return o
    fx('animatii', anim)

    def sageata(pg):
        clic(pg, 'miniatura:3'); clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Illustrations/Shapes'); clic(pg, 'meniu:Arrow: Right')
        r = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','forma:3/2');const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height]})()")
        pg.mouse.click(r[0] + r[2] * 0.5, r[1] + r[3] * 0.5); pg.wait_for_timeout(150)
        o = {'ev': evs(pg)[-1:], 'forme': S(pg, 'forme_diapozitiv')['forme_diapozitiv'][2]}
        taste(pg, 'Escape'); taste(pg, 'Control+z'); o['z'] = S(pg, 'forme_diapozitiv')['forme_diapozitiv'][2]
        return o
    fx('m2l10_arrow_right', sageata)
    R['plecate'] = H.plecate; R['erori'] = H.erori
scrie(R, 'b5_out.json')
print('gata')
