# -*- coding: utf-8 -*-
"""Partea A: cele 4 GRAV din runda 3 (GRAV 3, N4 partea Font/Save as type, A1, A2), cu gesturi reale (mouse / tastatură)."""
import json, sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
R = {}


def rect(pg, tinta):
    return pg.evaluate("t => { const e = LH.aplicatii.element('word', t); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", tinta)


def ct(pg, tinta, dx=0.5, dy=0.5):
    r = rect(pg, tinta)
    if not r:
        return 'LIPSA ' + tinta
    pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy)
    pg.wait_for_timeout(200)
    return r


JS_GEOM_FS = """() => { const l = document.querySelector('.lh-ap-lista-ref'); const c = document.querySelector('[data-lh-id-mso="FontSize"]'); if (!l) return null;
  const a = l.getBoundingClientRect(), k = c.getBoundingClientRect(), R = document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();
  return {lista: [a.x - R.x, a.y - R.y, a.width, a.height], caseta: [k.x - R.x, k.y - R.y, k.width, k.height],
          randuri: [...l.querySelectorAll('[data-lh-tip="ListItem"]')].map(x => x.textContent.trim() + '@' + x.getAttribute('data-lh-tinta') + ':' + (x.getAttribute('data-lh-id') || ''))}; }"""

JS_GEOM_TIP = """() => { const l = document.querySelector('.lh-ap-lista-ref'); const c = document.querySelector('[data-lh-tinta="camp:tip_fisier"]');
  const d = document.querySelector('.lh-ap-strat-dialog [data-lh-suprafata="dialog.FileSaveAs"]'); if (!l) return null;
  const a = l.getBoundingClientRect(), k = c.getBoundingClientRect(), D = d.getBoundingClientRect();
  return {lista_fata_de_fereastra: [a.x - D.x, a.y - D.y, a.width, a.height], caseta_fata_de_fereastra: [k.x - D.x, k.y - D.y, k.width, k.height],
          fereastra: [D.x, D.y, D.width, D.height], randuri: [...l.querySelectorAll('[data-lh-tip="ListItem"]')].map(x => x.textContent.trim())}; }"""

JS_VIZ_TIP = """() => { const c = document.querySelector('[data-lh-tinta="camp:tip_fisier"]');
  return [...c.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; })
    .map(e => e.tagName === 'INPUT' ? 'input=' + e.value : (e.children.length ? null : e.textContent)).filter(Boolean); }"""

JS_A2 = """() => { const d = document.querySelector('.lh-ap-strat-dialog [data-lh-suprafata="dialog.FileSaveAs"]'); const D = d.getBoundingClientRect();
  const q = t => { const e = LH.aplicatii.element('word', t); if (!e) return null; const r = e.getBoundingClientRect(); return {text: e.innerText.trim(), r: [Math.round(r.x - D.x), Math.round(r.y - D.y), Math.round(r.width), Math.round(r.height)]}; };
  return {documente: q('fereastra:Documente'), nume: q('fereastra:Nume'), data: q('fereastra:Data modificării'), tip: q('fereastra:Tip'), dim: q('fereastra:Dimensiune'),
          arbore: ['Acasă', 'Galerie', 'Acest PC', 'Rețea'].map(x => q('arbore:' + x)), are_Documente: /Documente/.test(d.innerText)}; }"""

s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    # ---------- GRAV 3: Font Size, ▾ + rândul 20 (mouse)
    for prof in ('word365', 'word2007'):
        deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}}, profil=prof)
        ct(pg, 'meniu_derulant:Home/Font/Font Size')
        o1 = obs(pg)
        lr = pg.evaluate(JS_GEOM_FS)
        ct(pg, 'meniu:20')
        R['g3_sageata_20_' + prof] = {'lista_deschisa': o1['lista'], 'focus_cu_lista': o1['focus'], 'geom': lr, 'dupa': obs(pg)}
    pg.screenshot(path=OUT + 'g3_dupa20.png')
    # drumul lecției m2-l10:152: trage peste titlu, B, 20 din listă, Center
    deschide(pg, {"paragrafe": ["Atelierul de pictură", "În fiecare joi pictăm."]})
    r1 = rect(pg, 'text:1')
    pg.mouse.move(r1[0] + 2, r1[1] + r1[3] / 2); pg.mouse.down()
    pg.mouse.move(r1[0] + 60, r1[1] + r1[3] / 2, steps=5); pg.mouse.move(r1[0] + r1[2] - 2, r1[1] + r1[3] / 2, steps=8); pg.mouse.up()
    pg.wait_for_timeout(200)
    sel = obs(pg)['sel']
    ct(pg, 'mso:Bold'); ct(pg, 'meniu_derulant:Home/Font/Font Size'); ct(pg, 'meniu:20'); ct(pg, 'mso:AlignCenter')
    o = obs(pg)
    R['g3_lectie_m2l10_152'] = {'selectie_dupa_tragere': sel, 'fmt': o['fmt'], 'font_box': o['font_box'],
                                'aliniere': pg.evaluate("() => LH.aplicatii.stare('word').aliniere_paragrafe"), 'ev': o['ev']}
    # „a doua casetă a grupului Font”, 16 (m2-l10:238/242)
    deschide(pg, {"paragrafe": ["Clubul de șah", "Joi."], "selectie": {"de_la": 0, "pana_la": 13}})
    ct(pg, 'meniu_derulant:Home/Font/Font Size'); ct(pg, 'meniu:16')
    R['g3_16'] = obs(pg)['fmt']
    # clic în casetă, scrie 20, Enter (începătorul care nu știe Ctrl+A)
    for prof in ('word365', 'word2007'):
        deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}}, profil=prof)
        ct(pg, 'panglica:Home/Font/Font Size', 0.3, 0.5)
        dupa_clic = pg.evaluate("() => { const i = document.querySelector('[data-lh-id-mso=\"FontSize\"] input'); return [i.value, i.selectionStart, i.selectionEnd, document.activeElement === i]; }")
        pg.keyboard.type('20'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
        o = obs(pg)
        R['g3_clic_20_enter_' + prof] = {'dupa_clic': dupa_clic, 'fmt': o['fmt'], 'font_box': o['font_box'], 'focus': o['focus'], 'ev': o['ev'][-4:]}

    # ---------- A1: Save as type după PDF (mouse)
    deschide(pg, {"paragrafe": ["Orar", "Marti: sport"], "cursor": 0})
    pg.keyboard.press('F12'); pg.wait_for_timeout(300)
    ct(pg, 'camp:tip_fisier')
    o1 = obs(pg)
    lg = pg.evaluate(JS_GEOM_TIP)
    ct(pg, 'meniu:PDF (*.pdf)')
    o2 = obs(pg)
    viz = pg.evaluate(JS_VIZ_TIP)
    pg.screenshot(path=OUT + 'a1_dupa_pdf.png')
    ct(pg, 'camp:nume_fisier'); pg.keyboard.press('Control+a'); pg.keyboard.type('Orar'); ct(pg, 'dialog_salvare:Save')
    o3 = obs(pg)
    R['a1_mouse'] = {'lista': o1['lista'], 'geom': lg, 'dupa_pdf': {k: o2[k] for k in ('tip_afisat', 'tip_box', 'dialog_salvare', 'ev')},
                     'vizibil_in_caseta': viz, 'dupa_save': {k: o3[k] for k in ('salvate', 'nume', 'tip_afisat', 'titlu', 'fisiere', 'ev')}}

    # ---------- A2: textele ferestrei Save As
    deschide(pg, {"paragrafe": ["Orar"], "cursor": 0})
    pg.keyboard.press('F12'); pg.wait_for_timeout(300)
    R['a2_texte'] = pg.evaluate(JS_A2)
    pg.screenshot(path=OUT + 'a2_saveas.png')
    ct(pg, 'arbore:Acest PC'); R['a2_clic_acest_pc'] = obs(pg)['msg']
    ct(pg, 'fereastra:Documente'); R['a2_clic_documente'] = obs(pg)['msg']
    b.close()
s.shutdown()
salveaza(R, OUT + 'ra4.json')
print(json.dumps(R, ensure_ascii=False, indent=1))
