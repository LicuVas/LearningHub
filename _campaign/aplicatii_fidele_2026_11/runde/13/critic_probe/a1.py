# -*- coding: utf-8 -*-
"""A · cele 6 GRAV vechi (P3, P4, A1, A2, A4) cu mouse-ul, la 1366×768; A3 în a3.py."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

R = {}
FIS = [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]},
       {'nume': 'Plante_6A_Ion.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante Ion']}]}]
STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
L05 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Sistemul solar']},
                       {'aspect': 'Title Only', 'texte': ['Cuprins'], 'forme': [STAR]},
                       {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                       {'aspect': 'Title Only', 'texte': ['Planetele'], 'forme': [{'fel': 'forma', 'forma': 'Arrow: Right', 'pozitie': [290, 210, 180, 110]}]},
                       {'aspect': 'Title Only', 'texte': ['Ce reținem']}], 'diapozitiv_activ': 3}
L09 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Planetele']},
                       {'aspect': 'Two Content', 'texte': ['Pământul', 'A treia planetă'], 'forme': [{'fel': 'imagine', 'fisier': 'pamant.png', 'pozitie': [486, 163, 408, 304]}]}],
       'diapozitiv_activ': 2}
L08 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Munții Rodnei'], 'fonturi': ['Comic Sans MS']}], 'diapozitiv_activ': 1}
L06 = {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Ursul'], 'forme': [STAR, {'fel': 'forma', 'forma': 'Rectangle', 'pozitie': [520, 190, 160, 130]}]},
                       {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}


def fx(pg, nume, f):
    try:
        R[nume] = f(pg)
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-500:]}


def vis_text(pg, sel):
    return pg.evaluate("""s=>[...document.querySelectorAll(s)].filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean)""", sel)


with Ham() as H:
    # ---- P3
    def p3a(pg):
        clic(pg, 'fila:File'); clic(pg, 'backstage:New'); ev(pg)
        ok = clic(pg, 'backstage:Blank Presentation')
        return {'clic': ok, 'ev': ev(pg), 'st': S(pg, 'prezentare_activa', 'prezentari_deschise', 'backstage', 'diapozitive'), 'nes': nesimulat(pg)}
    fx(H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide'}], 'fisiere': FIS}), 'P3_blank_mouse', p3a)

    def p3b(pg):
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
        info = pg.evaluate("""(()=>{const d=document.querySelector('[data-lh-suprafata="dialog.FileOpen"]');if(!d)return null;
          const li=[...d.querySelectorAll('[data-lh-tinta^="lista:"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta'));
          const t=d.innerText; return {lista:li, are_documente:/Documente/.test(t), titlu:t.slice(0,60).replace(/\\n/g,' / ')}})()""")
        c1 = clic(pg, 'lista:Plante_6A_Pop.pptx'); e1 = ev(pg)
        val = pg.evaluate("(()=>{const i=document.querySelector('[data-lh-tinta=\"camp:nume_fisier\"] input');return i?i.value:null})()")
        c2 = clic(pg, 'fereastra:Open'); e2 = ev(pg)
        return {'dialog': info, 'clic_fisier': c1, 'ev1': e1, 'camp': val, 'clic_open': c2, 'ev2': e2,
                'st': S(pg, 'prezentare_activa', 'prezentari_deschise', 'diapozitive'), 'nes': nesimulat(pg)}
    fx(H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide'}], 'fisiere': FIS}), 'P3_open_mouse', p3b)

    def p3c(pg):
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
        r = centru(pg, 'lista:Plante_6A_Pop.pptx')
        if r: pg.mouse.dblclick(r[0], r[1]); pg.wait_for_timeout(150)
        return {'ev': ev(pg), 'st': S(pg, 'prezentare_activa', 'prezentari_deschise')}
    fx(H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide'}], 'fisiere': FIS}), 'P3_open_dublu', p3c)

    # ---- P4 (m1-l05, m2-l09, m2-l08, start)
    def p4a(pg):
        out = {'start': S(pg, 'forme_diapozitiv', 'pozitii_forme', 'diapozitiv_activ')}
        clic(pg, 'miniatura:3'); clic(pg, 'forma:3/2'); out['dupa_clic_stea'] = S(pg, 'selectie_forma', 'selectie_text'); out['ev_clic'] = ev(pg)
        out['ecran_ales'] = pg.evaluate("(()=>[...document.querySelectorAll('.lh-ap-p-zona [data-lh-selectat]')].map(x=>x.className))()")
        taste(pg, 'Control+c'); clic(pg, 'miniatura:4'); taste(pg, 'Control+v'); clic(pg, 'miniatura:5'); taste(pg, 'Control+v')
        out['ev_cv'] = ev(pg)
        s = S(pg, 'forme_diapozitiv', 'pozitii_forme')
        out['forme_4_5'] = [s['forme_diapozitiv'][3], s['forme_diapozitiv'][4]]; out['poz_4_5'] = [s['pozitii_forme'][3], s['pozitii_forme'][4]]
        out['forme_3'] = s['forme_diapozitiv'][2]
        # Ctrl+X: Cuprins → Soarele
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); taste(pg, 'Control+x'); clic(pg, 'miniatura:3'); taste(pg, 'Control+v')
        s = S(pg, 'forme_diapozitiv'); out['dupa_x_v_2_3'] = [len(s['forme_diapozitiv'][1]), [f.get('forma') for f in s['forme_diapozitiv'][2]]]
        # săgeata de pe Planetele → Delete
        clic(pg, 'miniatura:4'); clic(pg, 'forma:4/2'); out['sel_sageata'] = S(pg, 'selectie_forma')['selectie_forma']; taste(pg, 'Delete')
        out['dupa_delete_sageata'] = [f.get('forma') for f in S(pg, 'forme_diapozitiv')['forme_diapozitiv'][3]]
        # clic pe colțul dreptunghiului stelei (în afara desenului) = nimic (a_forma_clic.stea_pe_chenar...)
        clic(pg, 'miniatura:5'); ev(pg)
        clic(pg, 'forma:5/2', dx=0.03, dy=0.97); out['colt_stea'] = {'ev': ev(pg), 'sel': S(pg, 'selectie_forma')['selectie_forma']}
        out['nes'] = nesimulat(pg)
        return out
    fx(H.app('powerpoint', L05), 'P4_m1l05', p4a)

    def p4b(pg):
        out = {'start': S(pg, 'forme_diapozitiv', 'pozitii_forme')}
        clic(pg, 'forma:2/3'); out['sel'] = S(pg, 'selectie_forma')['selectie_forma']; out['ev'] = ev(pg)
        taste(pg, 'Delete'); out['dupa'] = S(pg, 'forme_diapozitiv')['forme_diapozitiv'][1]; out['ev2'] = ev(pg)
        out['img_ecran'] = pg.evaluate("(()=>document.querySelectorAll('.lh-ap-p-zona [data-lh-tinta=\"forma\"]').length)()")
        return out
    fx(H.app('powerpoint', L09), 'P4_m2l09_imagine', p4b)

    def p4c(pg):
        out = {'start': S(pg, 'font_text')}
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1')
        out['caseta_font'] = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');const i=e&&e.querySelector('input');return i?i.value:null})()")
        clic(pg, 'meniu_derulant:Home/Font/Font'); out['lista'] = men(pg)
        clic(pg, 'meniu:Calibri Light (Headings)'); out['ev'] = ev(pg)
        out['dupa'] = S(pg, 'font_text')
        out['caseta_dupa'] = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');const i=e&&e.querySelector('input');return i?i.value:null})()")
        out['ecran_font'] = pg.evaluate("(()=>{const e=document.querySelector('.lh-ap-p-zona [data-lh-tinta=\"forma\"][data-lh-id=\"1/1\"]');const t=e&&[...e.querySelectorAll('*')].find(x=>x.childNodes.length&&x.textContent.trim()==='Munții Rodnei');return t?getComputedStyle(t).fontFamily:(e?getComputedStyle(e).fontFamily:null)})()")
        return out
    fx(H.app('powerpoint', L08), 'P4_m2l08_font', p4c)

    # ---- A1 Shapes
    def a1(pg):
        clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Illustrations/Shapes')
        return pg.evaluate("""(()=>{const m=document.querySelector('[data-lh-suprafata="lista.ShapesInsertGallery"]');if(!m)return null;const b=m.getBoundingClientRect();
          const g=[...m.querySelectorAll('[data-lh-tip="Group"]')].map(x=>[x.getAttribute('data-lh-eticheta'),(x.innerText||'').split('\\n')[0].trim()]);
          const it=[...m.querySelectorAll('[data-lh-tip="ListItem"]')];
          const desen=new Set(it.map(x=>{const s=x.querySelector('svg');return s?s.innerHTML:''}));
          const fara_title=it.filter(x=>!x.getAttribute('title')).length;
          const ar=it.find(x=>x.getAttribute('data-lh-eticheta')==='Arrow: Right');
          const ab=it.filter(x=>/^Action Button/.test(x.getAttribute('data-lh-eticheta'))).map(x=>{const r=x.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]});
          return {rect:[b.x,b.y,b.width,b.height].map(Math.round),grupuri:g,n:it.length,desene_distincte:desen.size,fara_title,
            arrow_title:ar&&ar.getAttribute('title'),arrow_grup:ar&&ar.closest('[data-lh-tip="Group"]')&&ar.closest('[data-lh-tip="Group"]').getAttribute('data-lh-eticheta'),
            action_buttons:ab.slice(0,3),action_n:ab.length}})()""")
    fx(H.app('powerpoint', L05), 'A1_shapes', a1)

    # ---- A2 paletele
    def a2(pg):
        out = {}
        def pal(cheie):
            return pg.evaluate("""k=>{const m=document.querySelector('[data-lh-suprafata="'+k+'"]');if(!m)return null;
              const g=[...m.querySelectorAll('[data-lh-tip="Group"]')].map(x=>[x.getAttribute('data-lh-eticheta'),(x.innerText||'').split('\\n')[0].trim()]).filter(x=>x[0]&&x[0].trim());
              const it=[...m.querySelectorAll('[data-lh-tip="ListItem"]')];return {grupuri:g,n:it.length,fara_title:it.filter(x=>!x.getAttribute('title')).length,
              dark_blue:(it.find(x=>x.getAttribute('data-lh-eticheta')==='Dark Blue')||{}).title||null}}""", cheie)
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1')
        clic(pg, 'meniu_derulant:Home/Font/Font Color'); out['FontColor'] = pal('lista.FontColorPicker'); clic(pg, 'meniu:Dark Blue'); out['dupa_dark_blue'] = S(pg, 'culoare_text')
        clic(pg, 'miniatura:3'); clic(pg, 'forma:3/2')
        clic(pg, 'fila:Home'); clic(pg, 'meniu_derulant:Home/Drawing/Shape Fill'); out['ShapeFill'] = pal('lista.ShapeFillColorPicker'); clic(pg, 'meniu:Yellow')
        clic(pg, 'meniu_derulant:Home/Drawing/Shape Outline'); out['Outline'] = pal('lista.OutlineColorPicker'); clic(pg, 'meniu:Orange')
        out['st'] = S(pg, 'umplere_forme'); out['nes'] = nesimulat(pg); out['ev'] = [(e['g'], e['a'], e['t']) for e in ev(pg)]
        return out
    fx(H.app('powerpoint', L05), 'A2_palete', a2)

    # ---- A4 comenzile de pe drum, cu mouse-ul
    def a4(pg):
        out = {}
        out['note_vizibila'] = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-tinta=\"zona_note\"]');return e?[e.offsetParent!==null,e.innerText]:null})()")
        clic(pg, 'zona_note'); pg.keyboard.type('Spun ceva.'); out['note'] = S(pg, 'note_diapozitive')['note_diapozitive']
        clic(pg, 'fila:View'); ev(pg); clic(pg, 'panglica:View/Show/Notes'); out['view_notes'] = [ev(pg), pg.evaluate("(()=>{const e=document.querySelector('[data-lh-tinta=\"zona_note\"]');return e?e.offsetParent!==null:null})()")]
        clic(pg, 'bara_stare:Notes'); out['bara_notes'] = [ev(pg), pg.evaluate("(()=>{const e=document.querySelector('[data-lh-tinta=\"zona_note\"]');return e?e.offsetParent!==null:null})()")]
        for v in ['Slide Sorter', 'Normal', 'Reading View', 'Slide Show']:
            clic(pg, 'bara_stare:' + v); out['bara_' + v] = [[(e['g'], e['a']) for e in ev(pg)], S(pg, 'vedere')['vedere']]
            if v in ('Reading View', 'Slide Show'): taste(pg, 'Escape'); ev(pg)
        clic(pg, 'miniatura:1'); clic(pg, 'fila:Design'); clic(pg, 'meniu_derulant:Design/Customize/Background Styles'); out['bg_lista'] = men(pg)
        clic(pg, 'meniu:Style 6'); out['bg'] = S(pg, 'fundal_diapozitive')['fundal_diapozitive'][:2]
        clic(pg, 'meniu_derulant:Design/Customize/Background Styles'); clic(pg, 'meniu:Format Background...'); out['bg_fb'] = [(e['g'], e['a'], e['t']) for e in ev(pg)][-1:]
        clic(pg, 'miniatura:1'); clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'fila:Animations'); clic(pg, 'meniu:Fade')
        clic(pg, 'panglica:Animations/Timing/Start'); out['start_lista'] = men(pg); clic(pg, 'meniu:After Previous'); out['start'] = S(pg, 'pornire_animatii')['pornire_animatii']
        clic(pg, 'miniatura:3'); clic(pg, 'forma:3/2'); clic(pg, 'fila:Home'); clic(pg, 'meniu_derulant:Home/Drawing/Shape Outline')
        r = centru(pg, 'meniu:Weight'); out['weight_rect'] = r
        if r: pg.mouse.move(r[0], r[1]); pg.wait_for_timeout(250); clic(pg, 'meniu:Weight')
        out['weight_lista'] = men(pg); ok = clic(pg, 'meniu:3 pt'); out['weight_ok'] = ok
        out['nes'] = nesimulat(pg); out['erori'] = list(H.erori)
        return out
    fx(H.app('powerpoint', L05), 'A4_drum', a4)
    R['plecate'] = H.plecate
scrie(R, 'a1_out.json')
print(json.dumps(R, ensure_ascii=False)[:200])
