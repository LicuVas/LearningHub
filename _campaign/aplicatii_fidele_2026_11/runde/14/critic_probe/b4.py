# -*- coding: utf-8 -*-
"""Criticul 14 · telefonul 360×740 (atingere): ✕ și ferestrele după derularea la țintă (scrollIntoView), apoi atingerea reală."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *
STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}
VIZ = r"""(sel=>{const d=document.querySelector(sel);if(!d)return null;const W=innerWidth,Hh=innerHeight;const b=d.getBoundingClientRect();
  const bt=[...d.querySelectorAll('[data-lh-tinta^="fereastra:"],[data-lh-tinta^="dialog_salvare:"]')].filter(x=>x.offsetParent).map(x=>{const r=x.getBoundingClientRect();
   const cx=r.x+r.width/2,cy=r.y+r.height/2;const hit=document.elementFromPoint(cx,cy);
   return [x.getAttribute('data-lh-tinta'),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),cx>=0&&cy>=0&&cx<=W&&cy<=Hh,!!hit&&(hit===x||x.contains(hit))]});
  return {rect:[b.x,b.y,b.width,b.height].map(Math.round),vp:[W,Hh],butoane:bt.filter(x=>/Cancel|Save|Open|OK|Don/.test(x[0]))}})"""

R = {}


def evs(pg):
    return [(x['g'], x['a'], x['t'], x['act']) for x in ev(pg)]


def tap(pg, t):
    r = pg.evaluate("""t=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});
      const r=e.getBoundingClientRect();const cx=r.x+r.width/2,cy=r.y+r.height/2;const h=document.elementFromPoint(cx,cy);
      return [cx,cy,Math.round(r.width),Math.round(r.height),!!h&&(h===e||e.contains(h)),innerWidth,document.documentElement.scrollWidth]}""", t)
    if r and 0 <= r[0] <= r[5]:
        pg.touchscreen.tap(r[0], r[1]); pg.wait_for_timeout(250)
    return r


with Ham(viewport=(360, 740), scale=2, mobil=True) as T:
    try:
        pg = T.app('powerpoint', C)
        o = {}
        r = tap(pg, 'forma:1/1'); cdp = pg.context.new_cdp_session(pg); cdp.send('Input.insertText', {'text': 'Z'}); pg.wait_for_timeout(150); ev(pg)
        o['x'] = tap(pg, 'bara_titlu:Close'); o['x_ev'] = evs(pg)
        o['viz'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.save_your_changes_to_this_file"]')
        o['cancel'] = tap(pg, 'fereastra:Cancel'); o['cancel_ev'] = [evs(pg), S(pg, 'prezentari_deschise', 'dialog')]
        o['x2'] = tap(pg, 'bara_titlu:Close'); ev(pg)
        o['dont'] = tap(pg, "fereastra:Don't Save"); o['dont_ev'] = [evs(pg), S(pg, 'prezentari_deschise')]
        o['x3'] = tap(pg, 'bara_titlu:Close'); o['x3_ev'] = [evs(pg), nesimulat(pg)]
        R['tel_inchidere'] = o
        pg.close()
        pg = T.app('powerpoint', C)
        o = {}
        tap(pg, 'forma:1/1'); tap(pg, 'margine_forma:1/1'); ev(pg)
        o['lansator'] = tap(pg, 'lansator:Home/Font'); o['ev'] = evs(pg)
        o['viz_font'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.FontDialogPowerPoint"]')
        o['cancel'] = tap(pg, 'fereastra:Cancel'); o['cancel_ev'] = [evs(pg), dlg(pg)]
        pg.keyboard.press('F12'); pg.wait_for_timeout(200); ev(pg)
        o['viz_saveas'] = pg.evaluate(VIZ, '[data-lh-suprafata="dialog.FileSaveAs"]')
        o['save'] = tap(pg, 'dialog_salvare:Save'); o['save_ev'] = [evs(pg), S(pg, 'nume_fisier')]
        R['tel_ferestre'] = o
        pg.close()
    except Exception:
        R['eroare'] = traceback.format_exc()[-800:]
    R['plecate'] = T.plecate
scrie(R, 'b4_out.json')
print(json.dumps(R, ensure_ascii=False)[:6000])
