# -*- coding: utf-8 -*-
"""Criticul 14 · B: Alt singur într-o fereastră (insignele panglicii peste fereastra modală?), asistentul pe Tab / Alt+literă în
ferestre, caseta Font (clic, nume greșit, Esc), apoi telefonul (360×740) și fereastra mică (1093×526 css la 125 %)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
FIS = [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1, 'fisiere': FIS}
R = {}
CASETA = "(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');const i=e&&e.querySelector('input');return i?i.value:null})()"
VIZ = r"""(sel=>{const d=document.querySelector(sel);if(!d)return null;const W=innerWidth,Hh=innerHeight;const b=d.getBoundingClientRect();
  const bt=[...d.querySelectorAll('[data-lh-tinta^="fereastra:"],[data-lh-tinta^="dialog_salvare:"]')].filter(x=>x.offsetParent).map(x=>{const r=x.getBoundingClientRect();
   const cx=r.x+r.width/2,cy=r.y+r.height/2;const hit=document.elementFromPoint(cx,cy);
   return [x.getAttribute('data-lh-tinta'),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),cx>=0&&cy>=0&&cx<=W&&cy<=Hh,!!hit&&(hit===x||x.contains(hit))]});
  return {rect:[b.x,b.y,b.width,b.height].map(Math.round),vp:[W,Hh],butoane:bt.filter(x=>/Cancel|Save|Open|OK|Don/.test(x[0]))}})"""


def fx(nume, f, cont=C, H2=None):
    try:
        pg = (H2 or H).app('powerpoint', cont)
        R[nume] = f(pg)
        pg.close()
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-700:]}


def evs(pg):
    return [(x['g'], x['a'], x['t'], x['act']) for x in ev(pg)]


with Ham() as H:
    def alt_in_dialog(pg):
        taste(pg, 'F12'); ev(pg)
        o = {'alt': [], }
        pg.keyboard.press('Alt'); pg.wait_for_timeout(120); o['alt'] = [evs(pg), kt(pg)[:8], foc(pg)]
        pg.keyboard.press('h'); pg.wait_for_timeout(120); o['h'] = [evs(pg), kt(pg)[:8], dlg(pg), S(pg, 'dialog')]
        pg.keyboard.press('Escape'); pg.wait_for_timeout(120); o['esc'] = [evs(pg), kt(pg)[:8], dlg(pg)]
        pg.keyboard.press('Escape'); pg.wait_for_timeout(120); o['esc2'] = [evs(pg), kt(pg)[:8], dlg(pg)]
        return o
    fx('alt_singur_in_save_as', alt_in_dialog)

    def alt_in_font(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'lansator:Home/Font'); pg.wait_for_timeout(150); ev(pg)
        pg.keyboard.press('Alt'); pg.wait_for_timeout(120); o = {'alt': [evs(pg), kt(pg)[:8]]}
        pg.keyboard.press('n'); pg.wait_for_timeout(120); o['n'] = [evs(pg), kt(pg)[:8], dlg(pg), S(pg, 'diapozitive', 'formatare_text')]
        return o
    fx('alt_singur_in_font', alt_in_font)

    # asistentul: pasul = Cancel din „Save your changes”; elevul ajunge la el cu Tab (navigare)
    def asis_tab(pg):
        clic(pg, 'forma:1/1'); pg.keyboard.type('Z'); taste(pg, 'Control+w'); ev(pg)
        pg.evaluate("t=>{window.__as=LH.aplicatii.asistent('powerpoint',{pasi:[{tinta:t,indiciu:'Aici'}],dupaGreseli:2,dupaSecunde:600})}", 'fereastra:Cancel')
        o = {}
        for i in range(6):
            pg.keyboard.press('Tab'); pg.wait_for_timeout(100)
            o['tab%d' % (i + 1)] = [evs(pg), (foc(pg) or {}).get('tinta'), pg.evaluate("document.querySelectorAll('[data-lh-indiciu]').length")]
        pg.keyboard.press('Enter'); pg.wait_for_timeout(120); o['enter'] = [evs(pg), S(pg, 'prezentari_deschise', 'dialog')['dialog']]
        return o
    fx('asistent_tab_spre_cancel', asis_tab)

    def asis_alt(pg):
        taste(pg, 'F12'); ev(pg)
        pg.evaluate("t=>{window.__as=LH.aplicatii.asistent('powerpoint',{pasi:[{tinta:t,indiciu:'Aici'}],dupaGreseli:2,dupaSecunde:600})}", 'dialog_salvare:Save')
        o = {}
        for k in ['Alt+n', 'Control+a']:
            pg.keyboard.press(k); pg.wait_for_timeout(100)
        pg.keyboard.type('Vulcanii'); pg.wait_for_timeout(120)
        o['inainte_de_save'] = [[(e[0], e[1]) for e in evs(pg)][:4], pg.evaluate("document.querySelectorAll('[data-lh-indiciu]').length")]
        pg.keyboard.press('Alt+s'); pg.wait_for_timeout(120); o['alt_s'] = [evs(pg), S(pg, 'nume_fisier')]
        return o
    fx('asistent_alt_n_tastare', asis_alt)

    # caseta Font: clic în text alege tot; nume greșit + Enter; Esc
    def caseta(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); ev(pg)
        el_ = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');const i=e.querySelector('input');const r=i.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
        pg.mouse.click(el_[0] + el_[2] * 0.4, el_[1] + el_[3] / 2); pg.wait_for_timeout(150)
        o = {'clic': [evs(pg), pg.evaluate("(()=>{const a=document.activeElement;return [a.tagName,a.value,a.selectionStart,a.selectionEnd]})()"), men(pg), S(pg, 'caseta_activa')]}
        pg.keyboard.type('Arail'); pg.wait_for_timeout(120); o['tastat'] = [pg.evaluate(CASETA), S(pg, 'caseta_activa', 'diapozitive')]
        ev(pg); pg.keyboard.press('Enter'); pg.wait_for_timeout(150); o['enter'] = [evs(pg), pg.evaluate(CASETA), S(pg, 'font_text', 'caseta_activa'), men(pg)]
        # Esc după un nume tastat: revine la fontul de acum?
        pg.mouse.click(el_[0] + el_[2] * 0.4, el_[1] + el_[3] / 2); pg.wait_for_timeout(150); pg.keyboard.type('Com'); ev(pg)
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150); o['esc'] = [evs(pg), pg.evaluate(CASETA), S(pg, 'font_text', 'caseta_activa'), men(pg), foc(pg)]
        pg.keyboard.press('Control+z'); pg.wait_for_timeout(150); o['z'] = [evs(pg), S(pg, 'font_text')]
        return o
    fx('caseta_font', caseta)

    # literele cu lista Font deschisă din ▾ (critic 13 §6)
    def lista_litere(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'meniu_derulant:Home/Font/Font'); ev(pg)
        pg.keyboard.type('ar'); pg.wait_for_timeout(120)
        o = {'litere': [evs(pg), S(pg, 'diapozitive')['diapozitive'][0], men(pg)]}
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100); pg.keyboard.type('q'); pg.wait_for_timeout(100)
        o['dupa_esc'] = [evs(pg), S(pg, 'diapozitive')['diapozitive'][0]]
        return o
    fx('lista_font_litere', lista_litere)
    R['plecate'] = list(H.plecate)

# ---------------- telefonul 360×740, atingere
with Ham(viewport=(360, 740), scale=2, mobil=True) as T:
    def tel(pg):
        o = {}
        def tap(t):
            r = centru(pg, t)
            if not r:
                return None
            pg.touchscreen.tap(r[0], r[1]); pg.wait_for_timeout(200)
            return [round(r[0]), round(r[1])]
        o['tap_note'] = tap('zona_note')
        cdp = pg.context.new_cdp_session(pg)
        cdp.send('Input.insertText', {'text': 'Greșit'}); pg.wait_for_timeout(200)
        o['note'] = [evs(pg)[-2:], S(pg, 'note_diapozitive')['note_diapozitive']]
        o['undo_rect'] = centru(pg, 'acces_rapid:Undo')
        o['tap_undo'] = tap('acces_rapid:Undo'); o['dupa_undo'] = [evs(pg), S(pg, 'note_diapozitive')['note_diapozitive']]
        # închiderea: ✕ → fereastra „Save your changes” pe telefon
        o['tap_x'] = tap('bara_titlu:Close'); o['x_ev'] = evs(pg)
        o['viz_save_changes'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.save_your_changes_to_this_file"]')
        o['tap_cancel'] = tap('fereastra:Cancel'); o['cancel'] = [evs(pg), S(pg, 'prezentari_deschise', 'dialog')]
        # miniatura 2 → Delete (tastatura fizică / CDP) → Undo atins
        tap('miniatura:2'); pg.keyboard.press('Delete'); pg.wait_for_timeout(150); o['del'] = [evs(pg)[-1:], len(S(pg, 'diapozitive')['diapozitive'])]
        tap('acces_rapid:Undo'); o['undo_del'] = [evs(pg)[-1:], len(S(pg, 'diapozitive')['diapozitive'])]
        # fereastra Font pe telefon
        tap('forma:1/1'); tap('margine_forma:1/1')
        o['lansator_font'] = tap('lansator:Home/Font'); o['viz_font'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.FontDialogPowerPoint"]')
        o['tap_cancel_font'] = tap('fereastra:Cancel'); o['dupa_font'] = [evs(pg)[-1:], dlg(pg)]
        o['nesim'] = nesimulat(pg)
        return o
    fx('telefon_360', tel, H2=T)
    R['plecate_tel'] = list(T.plecate)

# ---------------- fereastra mică 1093×526 css, 125 %
with Ham(viewport=(1093, 526), scale=1.25) as M:
    def mica(pg):
        o = {}
        clic(pg, 'forma:1/1'); pg.keyboard.type('Z'); taste(pg, 'Control+w'); ev(pg)
        o['save_changes'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.save_your_changes_to_this_file"]')
        taste(pg, 'Alt+n'); o['alt_n'] = [evs(pg), S(pg, 'prezentari_deschise')]
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
        o['open'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.FileOpen"]')
        o['documente'] = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-suprafata=\"dialog.FileOpen\"] [data-lh-eticheta=\"Documente\"]');if(!e)return null;const r=e.getBoundingClientRect();return [e.innerText,Math.round(r.x),Math.round(r.y),Math.round(r.width),getComputedStyle(e).overflow]})()")
        taste(pg, 'Escape', 'Escape'); ev(pg)
        taste(pg, 'Control+n'); clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'lansator:Home/Font'); pg.wait_for_timeout(150); ev(pg)
        o['font'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.FontDialogPowerPoint"]')
        return o
    fx('mica', mica, H2=M)
    R['plecate_mica'] = list(M.plecate)
scrie(R, 'b3_out.json')
print('gata')
