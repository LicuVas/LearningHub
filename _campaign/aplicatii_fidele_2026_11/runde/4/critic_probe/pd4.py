# -*- coding: utf-8 -*-
"""Probe țintite: titlul de pe ecran după „Save your changes…” › Save, apoi Ctrl+O; ce DIV primește focusul la Tab în
ferestre; Ctrl+F12 / Shift+F12; telefonul pe caseta Save as type (atingere pe partea vizibilă a casetei)."""
import json, sys, traceback
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
from pc4_js import JS_TITLU_ECRAN
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
R = {}
ORAR = ['Orarul meu', 'Luni: română, matematică, TIC']


def caz(nume, fn):
    try:
        R[nume] = fn()
    except Exception as e:
        R[nume] = {'EROARE': repr(e), 'tb': traceback.format_exc()[-800:]}


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    def titlu_dupa_save_inchidere():
        deschide(pg, {'paragrafe': ORAR + ['Miercuri: desen'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, 'fereastra:Save'); pg.wait_for_timeout(200)
        a = {'ecran': pg.evaluate(JS_TITLU_ECRAN), 'stare': obs(pg)['titlu'], 'docs': obs(pg)['docs']}
        pg.screenshot(path=OUT + 'titlu_dupa_save_inchidere.png')
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        return {'dupa_save': a, 'in_open': {'ecran': pg.evaluate(JS_TITLU_ECRAN), 'stare': obs(pg)['titlu']}}
    caz('titlu_ecran_dupa_save_si_inchidere', titlu_dupa_save_inchidere)

    def tab_div():
        deschide(pg, {'paragrafe': ['Ana']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Tab'); pg.wait_for_timeout(80)
        info = pg.evaluate("""() => { const a = document.activeElement; const R = document.querySelector('[data-lh-aplicatie="word"]');
            const r = a.getBoundingClientRect(); const cs = getComputedStyle(a);
            return {tag: a.tagName, cls: a.className, tabindex: a.getAttribute('tabindex'), suprafata: a.getAttribute('data-lh-suprafata'),
                    e_radacina: a === R, in_dialog: !!a.closest('.lh-ap-strat-dialog'), rect: [r.x, r.y, r.width, r.height], outline: cs.outlineStyle + ' ' + cs.outlineWidth}; }""")
        return info
    caz('tab_in_save_as_focus', tab_div)

    def f12_variante():
        out = {}
        for k in ('Control+F12', 'Shift+F12'):
            deschide(pg, {'paragrafe': ['Orar']})
            pg.keyboard.press(k); pg.wait_for_timeout(300)
            x = obs(pg)
            out[k] = {'dlg': x['dlg'], 'dialog_salvare': x['dialog_salvare'], 'msg': x['msg'], 'ev': evt(pg)}
        return out
    caz('ctrl_shift_f12', f12_variante)
    ctx.close()

    ctx = context(b, 390, 844, touch=True); pg = pagina(ctx, port)

    def tel_tip():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        r = rect(pg, 'camp:tip_fisier')
        x0 = max(r[0] + 10, 5); x0 = min(x0, 380)
        vizibil = r[0] < 390
        if not vizibil:
            pg.evaluate("t => LH.aplicatii.element('word', t).scrollIntoView({inline: 'start', block: 'nearest'})", 'camp:tip_fisier')
            pg.wait_for_timeout(200)
            r = rect(pg, 'camp:tip_fisier'); x0 = max(r[0] + 10, 5)
        pg.touchscreen.tap(x0, r[1] + r[3] / 2); pg.wait_for_timeout(250)
        a = obs(pg)
        rp = rect(pg, 'meniu:PDF (*.pdf)')
        if rp:
            pg.touchscreen.tap(max(rp[0] + 20, 5), rp[1] + rp[3] / 2); pg.wait_for_timeout(250)
        x = obs(pg)
        pg.screenshot(path=OUT + 'telefon_tip_pdf.png')
        return {'caseta': r, 'lista': a['lista'], 'rand_pdf': rp, 'tip_box': x['tip_box'], 'tip_afisat': x['tip_afisat'], 'ev': evt(pg)[-3:]}
    caz('telefon_save_as_type', tel_tip)
    b.close()
s.shutdown()
salveaza(R, OUT + 'rd4.json')
print(json.dumps(R, ensure_ascii=False, indent=1))
