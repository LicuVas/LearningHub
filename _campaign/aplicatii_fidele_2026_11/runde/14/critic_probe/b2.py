# -*- coding: utf-8 -*-
"""Criticul 14 · T3 (fontul temei pe ecran) + B (închiderea, fișierele, ferestrele, comenzile gri, forma desenată, Esc)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
FIS = [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1, 'fisiere': FIS}
L08 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Munții Rodnei', 'Ce sunt'], 'fonturi': ['Comic Sans MS', None]},
                       {'aspect': 'Title Only', 'texte': ['Vârful Pietrosul']},
                       {'aspect': 'Title and Content', 'texte': ['Lacurile', 'Lala']}], 'diapozitiv_activ': 2}
R = {}
FONT = r"""(id=>{const e=document.querySelector('[data-lh-aplicatie="powerpoint"] [data-lh-zona] [data-lh-tinta="forma"][data-lh-id="'+id+'"]');if(!e)return null;
  const s=[...e.querySelectorAll('span')].find(x=>x.childNodes.length&&x.textContent.trim())||e.querySelector('.lh-ap-p-text');if(!s)return null;
  const rg=document.createRange();rg.selectNodeContents(s);const w=rg.getBoundingClientRect().width;
  return {font:getComputedStyle(s).fontFamily,w:Math.round(w*10)/10,size:getComputedStyle(s).fontSize,color:getComputedStyle(s).color}})"""
CASETA = "(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');const i=e&&e.querySelector('input');return i?i.value:null})()"
BARA = "(()=>{const t=document.querySelector('[data-lh-aplicatie=\"powerpoint\"] [data-lh-suprafata=\"bara_titlu\"]');return t?t.innerText.split('\\n').filter(Boolean).slice(0,3).join(' | '):null})()"
GRI = r"""(()=>{const o={};for(const t of ['panglica:Home/Font/Bold','panglica:Home/Slides/New Slide','panglica:Home/Clipboard/Paste','meniu_derulant:Home/Font/Font Color','panglica:Home/Font/Font','fila:File','fila:Home','fila:Insert','fila:Design','fila:Transitions']){
  const e=LH.aplicatii.element('powerpoint',t);o[t]=e?(e.getAttribute('aria-disabled')||e.closest('[aria-disabled]')&&e.closest('[aria-disabled]').getAttribute('aria-disabled')||'activ'):'lipsa'}return o})()"""


def fx(nume, f, cont=C, **kw):
    try:
        H2 = kw.get('H') or H
        pg = H2.app('powerpoint', cont)
        R[nume] = f(pg)
        pg.close()
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-700:]}


def evs(pg):
    return [(x['g'], x['a'], x['t'], x['act']) for x in ev(pg)]


def SS(pg):
    s = S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog', 'nume_fisier', 'diapozitive', 'backstage')
    s['bara'] = pg.evaluate(BARA); s['dlg'] = dlg(pg); s['nesim'] = nesimulat(pg)
    return s


with Ham() as H:
    # ---------------- T3
    def t3(pg):
        o = {'fonturi_instalate': pg.evaluate("['Calibri Light','Calibri','Carlito','Aptos'].map(f=>[f,document.fonts.check('20px \"'+f+'\"')])")}
        o['inainte'] = {i: pg.evaluate(FONT, i) for i in ['2/1']}
        clic(pg, 'miniatura:1'); o['d1'] = {i: pg.evaluate(FONT, i) for i in ['1/1', '1/2']}
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/1'); clic(pg, 'margine_forma:2/1'); o['caseta_inainte'] = pg.evaluate(CASETA)
        clic(pg, 'meniu_derulant:Home/Font/Font'); clic(pg, 'meniu:Calibri Light (Headings)'); o['ev'] = evs(pg)
        o['dupa_headings'] = pg.evaluate(FONT, '2/1'); o['caseta_dupa'] = pg.evaluate(CASETA); o['ft'] = S(pg, 'font_text')
        # Arial greșit, apoi Ctrl+Z: caseta și literele revin?
        clic(pg, 'meniu_derulant:Home/Font/Font'); clic(pg, 'meniu:Arial'); o['arial'] = [pg.evaluate(FONT, '2/1'), pg.evaluate(CASETA)]
        taste(pg, 'Control+z'); o['dupa_z'] = [pg.evaluate(FONT, '2/1'), pg.evaluate(CASETA), S(pg, 'font_text', 'selectie_forma')]
        clic(pg, 'forma:2/1'); clic(pg, 'margine_forma:2/1'); o['caseta_dupa_z_realeasa'] = pg.evaluate(CASETA)
        # Calibri Light din All Fonts (nu tema): caseta fără (Headings)
        clic(pg, 'meniu_derulant:Home/Font/Font'); clic(pg, 'meniu:Calibri Light'); o['all_fonts'] = [pg.evaluate(FONT, '2/1'), pg.evaluate(CASETA), S(pg, 'font_text')]
        # miniatura și expunerea: aceleași litere?
        o['mini_font'] = pg.evaluate("(()=>{const m=document.querySelector('[data-lh-tinta=\"miniatura\"][data-lh-id=\"3\"] .lh-ap-p-titlu');return m?getComputedStyle(m).fontFamily:null})()")
        clic(pg, 'miniatura:3'); taste(pg, 'Shift+F5'); pg.wait_for_timeout(300)
        o['expunere_font'] = pg.evaluate("(()=>{const m=[...document.querySelectorAll('[data-lh-aplicatie=\"powerpoint\"] .lh-ap-p-titlu')].filter(x=>x.offsetParent).map(x=>getComputedStyle(x).fontFamily);return m})()")
        taste(pg, 'Escape')
        return o
    fx('t3', t3, cont=L08)

    # ---------------- închiderea: ✕ + Don't Save pe singura prezentare, apoi ✕ din nou; comenzile gri
    def x_dont_save(pg):
        clic(pg, 'forma:1/1'); pg.keyboard.type('Z'); ev(pg)
        clic(pg, 'bara_titlu:Close'); o = {'x1': evs(pg), 'dialog_deschis': SS(pg)}
        clic(pg, "fereastra:Don't Save"); o['dont_save'] = evs(pg); o['dupa'] = SS(pg); o['gri'] = pg.evaluate(GRI)
        clic(pg, 'panglica:Home/Font/Bold'); o['clic_bold'] = [evs(pg), nesimulat(pg)]
        clic(pg, 'panglica:Home/Slides/New Slide'); o['clic_new_slide'] = [evs(pg), nesimulat(pg)]
        taste(pg, 'Control+m'); o['ctrl_m'] = [evs(pg), S(pg, 'prezentari_deschise')]
        taste(pg, 'Control+z'); o['ctrl_z'] = evs(pg)
        clic(pg, 'bara_titlu:Close'); o['x2'] = [evs(pg), SS(pg)]
        return o
    fx('x_dont_save', x_dont_save)

    def file_close(pg):
        clic(pg, 'forma:1/1'); pg.keyboard.type('Z'); ev(pg)
        clic(pg, 'fila:File'); clic(pg, 'backstage:Close'); o = {'ev': evs(pg), 'dlg': SS(pg)}
        clic(pg, 'fereastra:Cancel'); o['cancel'] = [evs(pg), SS(pg)]
        o['foc'] = foc(pg); pg.keyboard.type('Q'); pg.wait_for_timeout(100); o['tastare_dupa_cancel'] = [evs(pg)[-1:], S(pg, 'diapozitive')['diapozitive'][0]]
        return o
    fx('file_close_cancel', file_close)

    def x_cancel_tastare(pg):
        r = centru(pg, 'forma:1/1'); pg.mouse.click(r[0] + 100, r[1]); pg.keyboard.type('Z'); ev(pg)
        taste(pg, 'Control+w'); taste(pg, 'Escape'); o = {'ev': evs(pg)}
        pg.keyboard.type('Q'); pg.wait_for_timeout(100); o['tastare_dupa_esc'] = [evs(pg)[-1:], S(pg, 'diapozitive', 'selectie_text')]
        return o
    fx('ctrl_w_esc_tastare', x_cancel_tastare)

    # ---------------- două prezentări
    def doua(pg):
        o = {}
        taste(pg, 'Control+n'); o['dupa_ctrl_n'] = SS(pg)
        clic(pg, 'forma:1/1'); pg.keyboard.type('Nou'); ev(pg)
        taste(pg, 'Control+w'); o['ctrl_w'] = [evs(pg), SS(pg)['dlg']]
        clic(pg, "fereastra:Don't Save"); o['dupa_dont_save'] = SS(pg)
        taste(pg, 'Control+n'); taste(pg, 'Control+n'); o['trei'] = SS(pg)
        taste(pg, 'Control+w'); o['inchis_p3'] = SS(pg)
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); clic(pg, 'lista:Plante_6A_Pop.pptx'); clic(pg, 'fereastra:Open'); o['open'] = SS(pg)
        clic(pg, 'bara_titlu:Close'); o['x_pe_fisier_nemodificat'] = [evs(pg), SS(pg)]
        return o
    fx('doua_prezentari', doua)

    # ---------------- Save As: nume existent, gol, Esc; File › Save As › Browse › Esc
    def sa_existent(pg):
        taste(pg, 'F12'); ev(pg); i = pg.evaluate("(()=>{const i=document.querySelector('[data-lh-suprafata=\"dialog.FileSaveAs\"] input');return i?i.value:null})()")
        o = {'propus': i, 'lista': pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-suprafata=\"dialog.FileSaveAs\"] [data-lh-tinta^=\"lista:\"]')].map(x=>x.getAttribute('data-lh-tinta')))()")}
        taste(pg, 'Control+a'); pg.keyboard.type('Plante_6A_Pop'); taste(pg, 'Enter'); o['existent'] = [evs(pg), SS(pg)]
        return o
    fx('saveas_existent', sa_existent)

    def sa_gol(pg):
        taste(pg, 'F12'); ev(pg); taste(pg, 'Control+a', 'Delete', 'Enter'); o = {'gol_enter': [evs(pg), SS(pg)]}
        taste(pg, 'Alt+s'); o['gol_alt_s'] = [evs(pg), SS(pg)['dlg']]
        taste(pg, 'Escape'); o['esc'] = [evs(pg), SS(pg), foc(pg)]
        return o
    fx('saveas_gol_esc', sa_gol)

    def sa_backstage(pg):
        clic(pg, 'fila:File'); clic(pg, 'backstage:Save As'); clic(pg, 'backstage:Browse'); o = {'deschis': SS(pg)['dlg']}
        taste(pg, 'Escape'); o['esc'] = [evs(pg), SS(pg)]
        clic(pg, 'fila:File'); clic(pg, 'backstage:Save As'); clic(pg, 'backstage:Browse'); clic(pg, 'fereastra:Cancel'); o['cancel'] = [evs(pg), SS(pg)]
        return o
    fx('saveas_din_backstage_esc', sa_backstage)

    # ---------------- Open cu un nume care nu există; Open › Esc
    def op_lipsa(pg):
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
        pg.keyboard.type('Nimic.pptx'); taste(pg, 'Enter'); o = {'enter': [evs(pg), SS(pg), foc(pg)]}
        clic(pg, 'fereastra:Open'); o['open_clic'] = [evs(pg), SS(pg)['dlg']]
        taste(pg, 'Escape'); o['esc'] = [evs(pg), SS(pg)]
        return o
    fx('open_nume_lipsa', op_lipsa)

    # ---------------- forma desenată greșit: Oval, clic pe diapozitiv, Ctrl+Z; Esc în modul de desen
    def oval(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Illustrations/Shapes'); clic(pg, 'meniu:Oval'); ev(pg)
        r = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','forma:2/1');const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height]})()")
        x, y = r[0] + r[2] * 0.7, r[1] + r[3] + 150
        pg.mouse.click(x, y); pg.wait_for_timeout(150)
        o = {'clic': evs(pg), 'forme': S(pg, 'forme_diapozitiv')['forme_diapozitiv'][1]}
        taste(pg, 'Control+z'); o['z'] = [evs(pg), S(pg, 'forme_diapozitiv')['forme_diapozitiv'][1]]
        clic(pg, 'meniu_derulant:Insert/Illustrations/Shapes'); clic(pg, 'meniu:Oval'); ev(pg); taste(pg, 'Escape'); o['esc_in_desen'] = evs(pg)
        pg.mouse.click(x, y); pg.wait_for_timeout(150); o['clic_dupa_esc'] = [evs(pg), S(pg, 'forme_diapozitiv')['forme_diapozitiv'][1]]
        return o
    fx('oval', oval)
    R['plecate'] = H.plecate; R['erori'] = H.erori
scrie(R, 'b2_out.json')
print('gata')
