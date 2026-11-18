# -*- coding: utf-8 -*-
"""Regresul (telefon fără dubluri, cuvântul în compunere, bara de titlu după salvare, Enter = Save + asistentul) și
probe în plus: Word fără document (Ctrl+N, File › New, panglica), titlul de pe ecran vs stare, telefonul pe listele noi."""
import json, sys, traceback
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
R = {}
JS_TITLU_ECRAN = """() => { const R = document.querySelector('[data-lh-aplicatie="word"]');
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  return [...R.querySelectorAll('[data-lh-tip="Button"]')].filter(b => vis(b) && /Word/.test(b.innerText)).map(b => b.innerText.trim() + ' | ' + b.getAttribute('data-lh-eticheta')); }"""


def caz(nume, fn):
    try:
        R[nume] = fn()
    except Exception as e:
        R[nume] = {'EROARE': repr(e), 'tb': traceback.format_exc()[-800:]}


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)

    # ---------------- desktop
    ctx = context(b); pg = pagina(ctx, port)

    def r_titlu():
        out = {}
        for cum in ('f12_enter', 'ctrls_clic'):
            deschide(pg, {'paragrafe': ['Poezia mea', 'Toamna vine.']})
            pg.keyboard.press('F12' if cum == 'f12_enter' else 'Control+s'); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type('Marin_Ioana_7B_poezie')
            if cum == 'f12_enter':
                pg.keyboard.press('Enter')
            else:
                r = rect(pg, 'dialog_salvare:Save'); pg.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2)
            imediat = pg.evaluate(JS_TITLU_ECRAN)
            out[cum] = {'ecran_imediat': imediat, 'stare': obs(pg)['titlu'], 'nume': obs(pg)['nume']}
        return out
    caz('reg_titlu_dupa_salvare', r_titlu)

    def r_enter_asistent():
        out = {}
        for g in ('F12', 'Control+s'):
            deschide(pg, {'paragrafe': ['Orar']}, asistent={'pasi': [{'tinta': 'dialog_salvare:Save'}, {'tinta': 'mso:Bold'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            pg.keyboard.press(g); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
            x = obs(pg)
            out[g] = {'pas': x['pas'], 'nume': x['nume'], 'indicii': x['indicii'], 'ev_ultim': evt(pg)[-1]}
        return out
    caz('reg_enter_save_asistent', r_enter_asistent)

    def p_fara_doc():
        deschide(pg, {'paragrafe': ['Ana are mere']})
        pg.keyboard.type(' azi'); pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, "fereastra:Don't Save")
        a = {'titlu_ecran': pg.evaluate(JS_TITLU_ECRAN), 'stare_titlu': obs(pg)['titlu']}
        pg.screenshot(path=OUT + 'fara_document.png')
        golev(pg)
        ct(pg, 'mso:Bold')
        b1 = o_ = obs(pg)
        b1 = {'msg': o_['msg'], 'ev': evt(pg)}
        pg.keyboard.press('Control+n'); pg.wait_for_timeout(150)
        c = {'msg': obs(pg)['msg'], 'docs': obs(pg)['docs'], 'ev': evt(pg)[-1:]}
        ct(pg, 'fila:File'); pg.wait_for_timeout(300)
        d = {'bs': obs(pg)['bs'], 'titlu_ecran': pg.evaluate(JS_TITLU_ECRAN)}
        pg.screenshot(path=OUT + 'fara_document_file.png')
        tinte_bs = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if t.startswith('backstage')]
        bl = [t for t in tinte_bs if 'Blank' in t or 'blank' in t]
        e = None
        if bl:
            ct(pg, bl[0]); pg.wait_for_timeout(200)
            x = obs(pg); e = {'clic': bl[0], 'docs': x['docs'], 'text': x['text'], 'titlu': x['titlu'], 'msg': x['msg'], 'bs': x['bs'], 'ev': evt(pg)[-1:]}
        return {'dupa_dont_save': a, 'clic_bold': b1, 'ctrl_n': c, 'file': d, 'tinte_backstage': tinte_bs[:40], 'blank_document': e}
    caz('p_word_fara_document', p_fara_doc)

    def p_titlu_backstage_dupa_ctrlw():
        deschide(pg, {'paragrafe': ['Orar'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente'})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(200)
        a = {'ecran': pg.evaluate(JS_TITLU_ECRAN), 'stare': obs(pg)['titlu']}
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        return {'fara_doc': a, 'in_open': {'ecran': pg.evaluate(JS_TITLU_ECRAN), 'stare': obs(pg)['titlu']}}
    caz('p_titlu_ecran_vs_stare', p_titlu_backstage_dupa_ctrlw)

    def p_recent_randuri_goale():
        deschide(pg, {'paragrafe': ['Orar'], 'fisiere': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar', 'text': ['A']}],
                      'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]})
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        rows = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-strat-backstage [data-lh-tip="ListItem"]')].filter(x => getComputedStyle(x).display !== 'none' && x.getBoundingClientRect().height > 0).map(x => { const r = x.getBoundingClientRect(); return [x.innerText.trim(), x.getAttribute('data-lh-tinta'), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), (x.__nod || {}).ta || null]; })""")
        goale = [r for r in rows if r[0] == '' and r[1] and 'element de listă' in r[1]]
        out = {'randuri': rows}
        if goale:
            g = goale[0]
            pg.mouse.click(g[2] + g[4] / 2, g[3] + g[5] / 2); pg.wait_for_timeout(200)
            out['clic_rand_gol'] = {'msg': obs(pg)['msg'], 'ev': evt(pg)[-1:]}
        return out
    caz('p_recent_randuri', p_recent_randuri_goale)
    ctx.close()

    # ---------------- telefon (atingere, 390 px)
    ctx = context(b, 390, 844, touch=True); pg = pagina(ctx, port)
    cdp = ctx.new_cdp_session(pg)
    pg.evaluate("""() => { const v = document.createElement('button'); v.id = 'verifica'; v.textContent = 'Verifică';
        v.style.cssText = 'position:fixed;right:4px;bottom:4px;z-index:99999;width:110px;height:44px';
        v.addEventListener('click', () => { window.__citit = LH.aplicatii.stare('word').text; }); document.body.appendChild(v); }""")

    def t_dubluri():
        deschide(pg, {'paragrafe': ['']})
        tap(pg, 'text:1')
        cdp_compune(pg, cdp, ['a', 'an', 'ana'], 'ana')
        cdp_compune(pg, cdp, [], ' ')
        cdp_compune(pg, cdp, ['a', 'ar', 'are'], 'are')
        return {'text': obs(pg)['text'], 'ecran': obs(pg)['ecran']}
    caz('reg_telefon_fara_dubluri', t_dubluri)

    def t_compunere_verifica():
        deschide(pg, {'paragrafe': ['Numele: ']})
        tap(pg, 'text:1')
        cdp_compune(pg, cdp, ['I', 'Io', 'Ion'])
        pg.evaluate("() => { window.__citit = null; }")
        c = centru(pg, '#verifica'); pg.touchscreen.tap(c[0], c[1]); pg.wait_for_timeout(250)
        return {'citit_la_click': pg.evaluate("() => window.__citit"), 'text_dupa': obs(pg)['text']}
    caz('reg_telefon_compunere_verifica', t_compunere_verifica)

    def t_font_lista():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        r = rect(pg, 'meniu_derulant:Home/Font/Font Size')
        vizibil = r is not None and 0 <= r[0] <= 390
        if r and not vizibil:
            pg.evaluate("t => LH.aplicatii.element('word', t).scrollIntoView({inline: 'center', block: 'nearest'})", 'meniu_derulant:Home/Font/Font Size')
            pg.wait_for_timeout(200)
        tap(pg, 'meniu_derulant:Home/Font/Font Size')
        a = obs(pg)
        r20 = rect(pg, 'meniu:20')
        tap(pg, 'meniu:20')
        x = obs(pg)
        pg.screenshot(path=OUT + 'telefon_font_20.png')
        return {'sageata_vizibila_initial': vizibil, 'lista': a['lista'], 'rand20': r20, 'fmt': x['fmt'], 'ev': evt(pg)}
    caz('t_telefon_font_size_lista', t_font_lista)

    def t_tip_lista():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        tap(pg, 'camp:tip_fisier')
        a = obs(pg)
        r = rect(pg, 'meniu:PDF (*.pdf)')
        tap(pg, 'meniu:PDF (*.pdf)')
        x = obs(pg)
        pg.screenshot(path=OUT + 'telefon_tip_pdf.png')
        return {'lista': a['lista'], 'rand_pdf': r, 'tip_box': x['tip_box'], 'tip_afisat': x['tip_afisat'], 'ev': evt(pg)[-2:]}
    caz('t_telefon_save_as_type', t_tip_lista)
    ctx.close()
    b.close()
s.shutdown()
salveaza(R, OUT + 'rc4.json')
print(json.dumps(R, ensure_ascii=False, indent=1)[:15000])
