# -*- coding: utf-8 -*-
"""Proba constructorului 12 (B-powerpoint): gesturi REALE (page.keyboard / page.mouse, Chromium headless, 127.0.0.1, tot restul
abandonat) pe poligonul bibliotecii, pentru GRAV-urile criticului 11 (P1-P5) și MINOR-urile reparate.
    python runde/12/proba_grav.py                 # pe worktree („după”) → runde/12/proba_grav_dupa.json
    python runde/12/proba_grav.py --inainte       # pe aplicatii/ din HEAD (git archive în %TEMP%) → proba_grav_inainte.json
Ultima linie = numărul de verificări picate."""
import json, shutil, subprocess, sys, tarfile, tempfile, io, functools, http.server, threading
from urllib.parse import urlsplit
from pathlib import Path

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI))
from h import Ham, Tacut, WT, st, ev, el, centru  # noqa: E402

R = []


def verif(nume, ok, **det):
    R.append({"nume": nume, "ok": bool(ok), **det})


def deschide(H, cont):
    return H.app('powerpoint', cont)


def taste(pg, *k, pauza=60):
    for x in k:
        pg.keyboard.press(x)
        pg.wait_for_timeout(pauza)


def insigne(pg):
    return pg.evaluate("()=>[...document.querySelectorAll('.lh-ap-keytip')].map(x=>x.textContent)")


def clic(pg, t, buton='left'):
    c = centru(pg, t)
    if not c:
        return False
    pg.mouse.click(c[0], c[1], button=buton)
    pg.wait_for_timeout(120)
    return True


# ---------------------------------------------------------------- P1 tastele de acces
def p1(H):
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["B"]}], "selectie_forma": [1, 1]})
    ev(pg)
    taste(pg, 'Alt')
    i1 = insigne(pg)
    e1 = ev(pg)
    taste(pg, 'h')
    i2 = insigne(pg)
    e2 = ev(pg)
    taste(pg, '1')
    s = st(pg)
    e3 = ev(pg)
    verif("P1 Alt arată literele filelor (H, N, A…)", 'H' in i1 and 'A' in i1, insigne=i1, ev=e1)
    verif("P1 H deschide Home și arată literele comenzilor (1 = Bold)", '1' in i2, insigne=i2[:40], ev=e2)
    verif("P1 Alt, H, 1 = Bold pe titlu, textul rămâne „B”", s['formatare_text'] == {"text": "B", "bold": True, "marime": 60},
          formatare=s['formatare_text'], ev=e3)
    verif("P1 un eveniment tasta_acces pe tastă, niciunul tastare",
          [x['g'] for x in e1 + e2 + e3] == ['tasta_acces'] * 3 and e1[0]['a'] == 'arata_taste_acces',
          ev=e1 + e2 + e3)
    pg.close()
    # Alt, H, F, S = Font Size (focus în casetă, textul neatins)
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["B"]}], "selectie_forma": [1, 1]})
    ev(pg)
    taste(pg, 'Alt', 'h', 'f')
    i_f = insigne(pg)
    taste(pg, 's')
    foc = pg.evaluate("()=>{const a=document.activeElement;const c=a&&a.closest('[data-lh-id-mso]');return [a&&a.tagName,c&&c.getAttribute('data-lh-id-mso'),a&&a.value]}")
    e = ev(pg)
    s = st(pg)
    verif("P1 Alt, H, F, S = focus în Font Size, textul rămâne „B”", foc[1] == 'FontSize' and s['diapozitive'][0]['texte'] == ['B'],
          focus=foc, insigne_dupa_F=i_f, ev=e)
    verif("P1 F = prefix_tasta_acces (nu greșeală)", any(x['a'] == 'prefix_tasta_acces' for x in e), ev=e)
    pg.close()
    # Alt, H, I = New Slide ▾ (lista aspectelor), Esc o închide
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["B"]}], "selectie_forma": [1, 1]})
    ev(pg)
    taste(pg, 'Alt', 'h', 'i')
    lista = pg.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta^=\"meniu:\"]')].map(x=>x.getAttribute('data-lh-tinta')).slice(0,20)")
    s = st(pg)
    e = ev(pg)
    verif("P1 Alt, H, I deschide lista New Slide (Two Content în ea), textul neatins",
          'meniu:Two Content' in lista and s['diapozitive'][0]['texte'] == ['B'], lista=lista, ev=e)
    pg.close()
    # Alt, A, C = Animation Pane
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["B"]}], "selectie_forma": [1, 1]})
    ev(pg)
    taste(pg, 'Alt', 'a', 'c')
    pan = pg.evaluate("()=>!!document.querySelector('.lh-ap-p-panou [data-lh-eticheta=\"Animation Pane\"],.lh-ap-p-panou')")
    s = st(pg)
    e = ev(pg)
    verif("P1 Alt, A, C deschide Animation Pane, textul neatins", pan and s['diapozitive'][0]['texte'] == ['B'], ev=e)
    # Esc urcă: Alt, H, Esc → literele filelor; Esc → ieșire; o literă după = tastare normală
    taste(pg, 'Escape')
    pg.close()
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["B"]}], "selectie_text": [1, 1]})
    ev(pg)
    taste(pg, 'Alt', 'h', 'Escape')
    i_esc = insigne(pg)
    taste(pg, 'Escape')
    i_esc2 = insigne(pg)
    taste(pg, 'x')
    s = st(pg)
    verif("P1 Esc urcă un nivel, al doilea Esc iese; litera de după se scrie", 'H' in i_esc and not i_esc2 and s['diapozitive'][0]['texte'] == ['x'],
          insigne_esc1=i_esc, insigne_esc2=i_esc2, texte=s['diapozitive'][0]['texte'])
    pg.close()


# ---------------------------------------------------------------- P3 închiderea și fișierele
def p3(H):
    V = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]}
    for cum in ('ctrl_w', 'x', 'file_close'):
        pg = deschide(H, V)
        ev(pg)
        if cum == 'ctrl_w':
            taste(pg, 'Control+w')
        elif cum == 'x':
            clic(pg, 'bara_titlu:Close')
        else:
            clic(pg, 'fila:File')
            clic(pg, 'backstage:Close')
        s = st(pg)
        foc = pg.evaluate("()=>{const a=document.activeElement;return [a&&a.tagName,a&&a.getAttribute('aria-label'),a&&a.value]}")
        verif("P3 %s pe prezentarea modificată → „Save your changes to this file?” cu cele 4 butoane, focus în File name" % cum,
              s['dialog'] == {"titlu": "", "intrebare": "Save your changes to this file?", "butoane": ["More options…", "Save", "Don't Save", "Cancel"], "apasat": None}
              and (foc[1] or '').startswith('File name') and foc[2] == 'Vulcanii', dialog=s['dialog'], focus=foc, ev=ev(pg))
        clic(pg, 'fereastra:Cancel')
        s = st(pg)
        verif("P3 %s → Cancel: prezentarea rămâne (1 deschisă, textul păstrat), dialog.apasat = Cancel" % cum,
              s['prezentari_deschise'] == 1 and s['diapozitive'][0]['texte'] == ['Vulcanii'] and (s['dialog'] or {}).get('apasat') == 'Cancel'
              and not pg.query_selector('[data-lh-tinta="fereastra:Cancel"]'), stare={k: s[k] for k in ('prezentari_deschise', 'dialog', 'prezentare_activa')})
        pg.close()
    # Don't Save → fără prezentare
    pg = deschide(H, V)
    clic(pg, 'bara_titlu:Close')
    clic(pg, "fereastra:Don't Save")
    s = st(pg)
    titlu = pg.evaluate("()=>{const t=document.querySelector('.lh-ap-x-titlu');return t&&t.textContent}")
    bold = pg.evaluate("()=>{const b=document.querySelector('[data-lh-id-mso=\"Bold\"]');return b&&b.getAttribute('aria-disabled')}")
    ev(pg)
    taste(pg, 'Control+b', 'x')
    s2 = st(pg)
    verif("P3 Don't Save → fără prezentare: prezentare_activa null, 0 deschise, titlul „PowerPoint”, Bold gri",
          s['prezentare_activa'] is None and s['prezentari_deschise'] == 0 and titlu == 'PowerPoint' and bold == 'true' and s2['diapozitive'] == [],
          titlu=titlu, bold_gri=bold, stare={k: s[k] for k in ('prezentare_activa', 'prezentari_deschise', 'dialog')})
    taste(pg, 'Control+n')
    s = st(pg)
    verif("P3 din fereastra goală, Ctrl+N → Presentation2 (1 deschisă)", s['prezentare_activa'] == 'Presentation2' and s['prezentari_deschise'] == 1,
          stare={k: s[k] for k in ('prezentare_activa', 'prezentari_deschise', 'diapozitive')})
    pg.close()
    # Ctrl+N cu prezentare → Presentation2, 2 deschise; Ctrl+W pe cea nouă (nemodificată) → înapoi la Presentation1
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide"}]})
    taste(pg, 'Control+n')
    s = st(pg)
    t1 = pg.evaluate("()=>{const t=document.querySelector('.lh-ap-x-titlu');return t&&t.textContent}")
    verif("P3 Ctrl+N → Presentation2, 2 prezentări (scenariul powerpoint-ctrl-n)", s['prezentare_activa'] == 'Presentation2' and s['prezentari_deschise'] == 2,
          titlu=t1, stare={k: s[k] for k in ('prezentare_activa', 'prezentari_deschise')})
    taste(pg, 'Control+n')
    s = st(pg)
    verif("P3 al doilea Ctrl+N → Presentation3, 3 prezentări", s['prezentare_activa'] == 'Presentation3' and s['prezentari_deschise'] == 3)
    taste(pg, 'Control+w')
    s = st(pg)
    verif("P3 Ctrl+W pe prezentarea nouă nemodificată o închide fără întrebare [presupus R12-2]",
          s['prezentari_deschise'] == 2 and s['dialog'] is None, stare={k: s[k] for k in ('prezentare_activa', 'prezentari_deschise', 'dialog')})
    taste(pg, 'Control+o')
    s = st(pg)
    verif("P3 Ctrl+O → File › Open (backstage.Open)", s['backstage'] == 'Open', backstage=s['backstage'])
    pg.close()
    # Esc în fereastră = Cancel; Save cu numele din casetă salvează și închide
    pg = deschide(H, V)
    taste(pg, 'Control+w')
    taste(pg, 'Escape')
    s = st(pg)
    verif("P3 Esc în „Save your changes” = prezentarea rămâne", s['prezentari_deschise'] == 1 and s['diapozitive'][0]['texte'] == ['Vulcanii'])
    taste(pg, 'Control+w')
    clic(pg, 'fereastra:Save')
    s = st(pg)
    verif("P3 Save în „Save your changes” → salvează și închide", s['prezentari_deschise'] == 0 and (s['dialog'] or {}).get('apasat') == 'Save')
    pg.close()


# ---------------------------------------------------------------- P2 Font Color
def p2(H):
    V = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_text": [1, 1], "forma_citita": [1, 1]}
    pg = deschide(H, V)
    ev(pg)
    clic(pg, 'fila:Home')
    clic(pg, 'meniu_derulant:Home/Font/Font Color')
    pal = pg.evaluate("""()=>{const m=document.querySelector('[data-lh-suprafata="lista.FontColorPicker"]');if(!m)return null;
      const L=[...m.querySelectorAll('[data-lh-tip="ListItem"]')].map(x=>x.getAttribute('data-lh-eticheta'));
      const M2=[...m.querySelectorAll('[data-lh-tip="MenuItem"],[data-lh-tip="Button"]')].map(x=>x.getAttribute('data-lh-eticheta'));
      return {n:L.length,primele:L.slice(0,10),standard:L.slice(-10),altele:M2}}""")
    e1 = ev(pg)
    verif("P2 ▾ deschide paleta din referință: 60 culori de temă + 10 standard, More Colors…, Eyedropper, fără Automatic",
          bool(pal) and pal['n'] == 70 and 'Red' in pal['standard'] and 'More Colors...' in pal['altele'] and 'Eyedropper' in pal['altele']
          and 'Automatic' not in (pal['primele'] + pal['altele']), paleta=pal, ev=e1)
    clic(pg, 'meniu:Red')
    s = st(pg)
    culoare_ecran = pg.evaluate("()=>{const s=document.querySelector('[data-lh-tinta=\"forma\"][data-lh-id=\"1/1\"] .lh-ap-p-par span');return s&&getComputedStyle(s).color}")
    e2 = ev(pg)
    verif("P2 Red → culoare_text #FF0000, ecranul roșu, formatare_text fără culoare (scenariul powerpoint-font-color-titlu)",
          s['culoare_text'] == '#FF0000' and culoare_ecran == 'rgb(255, 0, 0)' and set(s['formatare_text']) == {'text', 'bold', 'marime'},
          culoare=s['culoare_text'], ecran=culoare_ecran, ev=e2)
    taste(pg, 'Control+z')
    s = st(pg)
    verif("P2 Ctrl+Z anulează culoarea", s['culoare_text'] == '#000000', culoare=s['culoare_text'])
    pg.close()
    # mini-bara: clic dreapta pe textul ales → Font Color ▾ → paleta mini-barei
    pg = deschide(H, V)
    c = centru(pg, 'forma:1/1')
    pg.mouse.click(c[0], c[1], button='right')
    pg.wait_for_timeout(150)
    ok_mb = pg.evaluate("""()=>{const sb=[...document.querySelectorAll('.lh-ap-p-meniu [data-lh-tip="SplitButton"]')].find(x=>x.getAttribute('data-lh-eticheta')==='Font Color');
      if(!sb)return null;const mi=sb.querySelector('[data-lh-tip="MenuItem"]');const r=mi.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}""")
    if ok_mb:
        pg.mouse.click(ok_mb[0], ok_mb[1])
        pg.wait_for_timeout(150)
    mb = pg.evaluate("()=>{const m=document.querySelector('[data-lh-suprafata=\"lista.FontColorPicker_minibara\"]');return m?m.querySelectorAll('[data-lh-tip=\"ListItem\"]').length:null}")
    verif("P2 mini-bara: Font Color ▾ deschide lista.FontColorPicker_minibara", mb == 70, randuri=mb)
    if mb:
        clic(pg, 'meniu:Blue')
        s = st(pg)
        verif("P2 mini-bara: Blue se aplică textului", s['culoare_text'] == '#0070C0', culoare=s['culoare_text'])
    pg.close()


# ---------------------------------------------------------------- P4 obiectele de pe diapozitiv
def lista_deschisa(pg, cheie):
    return pg.evaluate("""k=>{const m=document.querySelector('[data-lh-suprafata="'+k+'"]');if(!m)return null;
      return [...m.querySelectorAll('[data-lh-tinta^="meniu:"]')].map(x=>x.getAttribute('data-lh-tinta').slice(6))}""", cheie)


def p4(H):
    # Layout ▾ → Two Content (diapozitivul 2)
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]}, {"aspect": "Title and Content", "texte": ["Steaua noastră"]}], "diapozitiv_activ": 2})
    clic(pg, 'fila:Home')
    e = el(pg, 'mso:SlideLayoutGallery')
    b = e.bounding_box() if e else None
    if b:
        pg.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
        pg.wait_for_timeout(150)
    rand = lista_deschisa(pg, 'lista.SlideLayoutGallery')
    verif("P4 Layout ▾ = cele 9 aspecte din referință, în ordine", rand == ["Title Slide", "Title and Content", "Section Header", "Two Content", "Comparison",
                                                                            "Title Only", "Blank", "Content with Caption", "Picture with Caption"], randuri=rand)
    clic(pg, 'meniu:Two Content')
    s = st(pg)
    verif("P4 Layout › Two Content: diapozitivul 2 = Two Content, 3 forme, titlul păstrat", s['diapozitive'][1] == {"aspect": "Two Content", "texte": ["Steaua noastră"], "forme": 3},
          dia=s['diapozitive'])
    pg.close()
    # New Slide ▾ → Two Content
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]}]})
    clic(pg, 'meniu_derulant:Home/Slides/New Slide')
    rand = lista_deschisa(pg, 'lista.SlideNewGallery') or []
    clic(pg, 'meniu:Two Content')
    s = st(pg)
    verif("P4 New Slide ▾ › Two Content: diapozitiv nou Two Content cu 3 forme (+ Duplicate / Outline / Reuse în listă)",
          s['diapozitive'] == [{"aspect": "Title Slide", "texte": ["Soarele"], "forme": 2}, {"aspect": "Two Content", "texte": [], "forme": 3}]
          and 'Duplicate Selected Slides' in rand, dia=s['diapozitive'], randuri=rand)
    pg.close()
    # Insert › Pictures ▾ › This Device... → Insert Picture → nume + Enter
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    clic(pg, 'fila:Insert')
    e = el(pg, 'mso:FlyoutAnchorInsertPictures')
    if e:
        b = e.bounding_box(); pg.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2); pg.wait_for_timeout(150)
    rand = lista_deschisa(pg, 'lista.FlyoutAnchorInsertPictures')
    clic(pg, 'meniu:This Device...')
    dlg = st(pg)['dialog']
    foc = pg.evaluate("()=>{const a=document.activeElement;return a&&a.closest('[data-lh-tinta]')&&a.closest('[data-lh-tinta]').getAttribute('data-lh-tinta')}")
    pg.keyboard.type('vulcan.png', delay=10)
    taste(pg, 'Enter')
    s = st(pg)
    verif("P4 Pictures ▾ (This Device…, Stock Images…, Online Pictures…) › This Device… › Insert Picture › nume + Enter = imagine pe diapozitiv",
          rand == ['This Device...', 'Stock Images...', 'Online Pictures...'] and dlg == {"titlu": "Insert Picture"} and foc == 'camp:nume_fisier'
          and s['diapozitive'][0]['forme'] == 3 and s['forme_diapozitiv'][0][-1]['fel'] == 'imagine', randuri=rand, dialog=dlg, focus=foc, forme=s['forme_diapozitiv'])
    pg.close()
    # Insert › Shapes ▾ › Arrow: Right, clic pe diapozitiv
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Only", "texte": ["Ziua și noaptea"]}]})
    clic(pg, 'fila:Insert')
    e = el(pg, 'mso:ShapesInsertGallery')
    if e:
        b = e.bounding_box(); pg.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2); pg.wait_for_timeout(150)
    rand = lista_deschisa(pg, 'lista.ShapesInsertGallery') or []
    clic(pg, 'meniu:Arrow: Right')
    sl = pg.evaluate("()=>{const r=document.querySelector('.lh-ap-p-slide').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height*0.62]}")
    pg.mouse.click(sl[0], sl[1])
    pg.wait_for_timeout(150)
    s = st(pg)
    evs = ev(pg)
    verif("P4 Shapes ▾ (195 de rânduri din referință) › Arrow: Right + clic pe diapozitiv = forma „Arrow: Right”",
          len(rand) >= 190 and s['forme_diapozitiv'][0] == [{"fel": "substituent", "text": "Ziua și noaptea"}, {"fel": "forma", "forma": "Arrow: Right", "text": ""}],
          randuri=len(rand), forme=s['forme_diapozitiv'], ultimul_ev=evs[-1:] if evs else None)
    taste(pg, 'Control+z')
    verif("P4 Ctrl+Z scoate forma", st(pg)['diapozitive'][0]['forme'] == 1)
    pg.close()
    # Insert › Table ▾ din referință: 3x2 Table și Insert Table...
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Only", "texte": ["T"]}]})
    clic(pg, 'fila:Insert')
    e = el(pg, 'mso:TableInsertGallery')
    if e:
        b = e.bounding_box(); pg.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2); pg.wait_for_timeout(150)
    rand = lista_deschisa(pg, 'lista.TableInsertGallery') or []
    clic(pg, 'meniu:Insert Table...')
    dlg = st(pg)['dialog']
    verif("P4 Table ▾ din referință (grila + Insert Table... / Draw Table / Excel Spreadsheet) → Insert Table... deschide fereastra",
          '3x2 Table' in rand and 'Insert Table...' in rand and 'Draw Table' in rand and dlg == {"titlu": "Insert Table"}, randuri=len(rand), dialog=dlg)
    pg.close()
    # Ctrl+C / Ctrl+V pe caseta aleasă ca obiect
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele", "O stea"]}, {"aspect": "Title Only", "texte": ["Planetele"]}],
                      "diapozitiv_activ": 1, "selectie_forma": [1, 2]})
    ev(pg)
    taste(pg, 'Control+c')
    e1 = ev(pg)
    clic(pg, 'miniatura:2')
    taste(pg, 'Control+v')
    s = st(pg)
    verif("P4 Ctrl+C pe caseta-obiect nu tace; Ctrl+V pe diapozitivul 2 = casetă de text în același loc",
          e1 and e1[0]['a'] == 'copiere' and s['forme_diapozitiv'][1] == [{"fel": "substituent", "text": "Planetele"}, {"fel": "caseta_text", "text": "O stea"}]
          and s['pozitii_forme'][1][1] == [120, 284, 720, 130], ev=e1, forme=s['forme_diapozitiv'], poz=s['pozitii_forme'])
    pg.close()


# ---------------------------------------------------------------- P5 efectele
def p5(H):
    # Duration: Fade = 0,7; scris „0,5” + Enter; Apply To All copiază
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1})
    clic(pg, 'fila:Transitions')
    clic(pg, 'meniu_derulant:Transitions/Transition to This Slide/Fade') if el(pg, 'meniu_derulant:Transitions/Transition to This Slide/Fade') else clic(pg, 'meniu:Fade')
    d1 = st(pg)['durata_tranzitie']
    vis = pg.evaluate("()=>{const i=document.querySelector('[data-lh-id-mso=\"TransitionDuration\"] input');return i&&[i.value,i.readOnly]}")
    clic(pg, 'mso:TransitionDuration')
    pg.keyboard.press('Control+a')
    pg.keyboard.type('0,5')
    taste(pg, 'Enter')
    d2 = st(pg)['durata_tranzitie']
    clic(pg, 'mso:SlideTransitionApplyToAll')
    d3 = st(pg)['durata_tranzitie']
    verif("P5 Duration: Fade = 0,7 („00,70” pe ecran, caseta activă); „0,5” + Enter; Apply To All copiază pe toate",
          d1 == [0.7, 2] and vis == ['00,70', False] and d2 == [0.5, 2] and d3 == [0.5, 0.5], d1=d1, ecran=vis, d2=d2, d3=d3)
    pg.close()
    # Animation Pane: rândurile alese, Move Up / Move Down
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}], "selectie_forma": [1, 1]})
    clic(pg, 'fila:Animations')
    clic(pg, 'meniu:Fade')
    clic(pg, 'margine_forma:1/2')
    clic(pg, 'meniu:Fly In')
    clic(pg, 'mso:AnimationCustom')
    gri = lambda: pg.evaluate("()=>['Move Up','Move Down'].map(e=>{const b=document.querySelector('.lh-ap-p-panou [data-lh-eticheta=\"'+e+'\"]');return b&&b.getAttribute('aria-disabled')==='true'})")
    randuri = pg.evaluate("()=>[...document.querySelectorAll('.lh-ap-p-anim-rand')].map(r=>[r.getAttribute('data-lh-eticheta'),r.hasAttribute('data-lh-selectat'),r.getAttribute('aria-hidden')])")
    g2 = gri()
    rr = pg.evaluate("()=>{const r=document.querySelectorAll('.lh-ap-p-anim-rand')[0].getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    pg.mouse.click(rr[0], rr[1]); pg.wait_for_timeout(120)
    g1 = gri()
    rr = pg.evaluate("()=>{const r=document.querySelectorAll('.lh-ap-p-anim-rand')[1].getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    pg.mouse.click(rr[0], rr[1]); pg.wait_for_timeout(120)
    clic(pg, 'fereastra:Move Up')
    s = st(pg)
    verif("P5 Animation Pane: rânduri cu numele din referință, alegibile; rândul 2: Move Up activ, Move Down gri; rândul 1: invers; Move Up → [2, 1]",
          randuri and randuri[0][0] == 'On Click\nEntrance\nFade : Title 1: Vulcanii ' and randuri[1][1] and randuri[0][2] is None
          and g2 == [False, True] and g1 == [True, False] and s['ordine_animatii'] == [2, 1],
          randuri=randuri, gri_rand2=g2, gri_rand1=g1, ordine=s['ordine_animatii'])
    taste(pg, 'Control+z')
    verif("P5 Ctrl+Z întoarce ordinea", st(pg)['ordine_animatii'] == [1, 2])
    pg.close()
    # Format Background: Solid fill › Color ▾ (cu Automatic) › Light Blue › Apply to All
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1})
    clic(pg, 'diapozitiv', buton='right')
    clic(pg, 'meniu:Format Background...')
    clic(pg, 'fereastra:Solid fill')
    clic(pg, 'fereastra:Color')
    rand = lista_deschisa(pg, 'lista.FormatBackground_Color') or []
    clic(pg, 'meniu:Light Blue')
    s1 = st(pg)['fundal_diapozitive']
    ecran = pg.evaluate("()=>getComputedStyle(document.querySelector('.lh-ap-p-fundal')).backgroundColor")
    clic(pg, 'fereastra:Apply to All')
    s2 = st(pg)['fundal_diapozitive']
    verif("P5 Format Background: Solid fill › Color ▾ (are Automatic) › Light Blue pe diapozitivul activ (ecranul albastru) › Apply to All = toate #00B0F0",
          'Automatic' in rand and s1[0] == {"tip": "solid", "culoare": "#00B0F0"} and s1[1]['culoare'] == '#FFFFFF' and ecran == 'rgb(0, 176, 240)'
          and s2 == [{"tip": "solid", "culoare": "#00B0F0"}] * 2, s1=s1, s2=s2, ecran=ecran, automatic='Automatic' in rand)
    pg.close()


# ---------------------------------------------------------------- bucata 6: MINOR din runde/11/critic.md §6 (constructorul 2)
REF_VIZUAL = '552ac0c5'   # predarea constructorului 1 = „înainte” de bucata 6, pentru comparația „ce se vede”
UIA = Path('C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json')
MAS = """(()=>{const rad=document.querySelector('[data-lh-aplicatie=powerpoint]');const W=innerWidth,Hh=innerHeight;
 return [...rad.querySelectorAll('[data-lh-tip=Button],[data-lh-tip=SplitButton],[data-lh-tip=MenuItem],[data-lh-tip=TabItem],[data-lh-tinta]')].filter(e=>{
  if(!e.offsetParent)return false;const r=e.getBoundingClientRect();return r.width>0&&r.right>0&&r.left<W&&r.bottom>0&&r.top<Hh&&(r.width<32||r.height<32)})
  .map(e=>{const r=e.getBoundingClientRect();return (e.getAttribute('data-lh-tinta')||'')+' | '+(e.getAttribute('data-lh-eticheta')||'')+' '+Math.round(r.width)+'x'+Math.round(r.height)})})()"""
# zona EFECTIVĂ a unui element: câți pixeli la rând, pe orizontala și pe verticala prin centrul (văzut), îl ating (elementFromPoint)
EFECTIV = """([sel, cx, cy])=>{const e=document.querySelector(sel);if(!e)return null;const al=(x,y)=>{const t=document.elementFromPoint(x,y);return !!t&&(t===e||e.contains(t))};
 if(cx==null){const g=(e.querySelector('svg')||e).getBoundingClientRect();cx=g.x+g.width/2;cy=g.y+g.height/2}
 let a=0,b=0,c=0,d=0;while(a<60&&al(cx-a-1,cy))a++;while(b<60&&al(cx+b+1,cy))b++;while(c<60&&al(cx,cy-c-1))c++;while(d<60&&al(cx,cy+d+1))d++;
 return al(cx,cy)?[a+b+1,c+d+1]:[0,0]}"""


def arhiva(ref):
    tmp = Path(tempfile.mkdtemp(prefix='lh_r12_' + ref + '_'))
    arh = subprocess.run(['git', '-C', str(WT), 'archive', ref, 'aplicatii'], capture_output=True, check=True).stdout
    tarfile.open(fileobj=io.BytesIO(arh)).extractall(tmp)
    return tmp


C_TEL = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Muntii de foc"]}, {"aspect": "Title and Content", "texte": ["Ce sunt"]}]}


class Tel:
    """telefonul (360 × 740, atingeri, scale 2) în ACELAȘI Chromium headless al hamului (un al doilea sync_playwright nu merge),
    cu serverul lui static pe 127.0.0.1 (port liber) pentru rădăcina dată și aceeași rută: tot ce nu e 127.0.0.1/localhost abandonat"""
    def __init__(self, H, radacina):
        self.H, self.radacina = H, radacina

    def __enter__(self):
        self.srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Tacut, directory=str(self.radacina)))
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        self.baza = 'http://127.0.0.1:%d' % self.srv.server_address[1]
        self.ctx = self.H.br.new_context(viewport={'width': 360, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True)

        def ruta(r):
            if urlsplit(r.request.url).hostname not in ('127.0.0.1', 'localhost'):
                self.H.plecate.append(r.request.url)
                return r.abort()
            return r.continue_()
        self.ctx.route('**/*', ruta)
        return self

    def __exit__(self, *a):
        try:
            self.ctx.close()
        finally:
            self.srv.shutdown()

    def app(self, continut):
        pg = self.ctx.new_page()
        pg.on('pageerror', lambda e: self.H.erori.append(str(e)[:300]))
        pg.goto(self.baza + '/aplicatii/poligon.html', wait_until='load')
        pg.wait_for_function('window.LH && LH.aplicatii && LH.aplicatii.gata')
        pg.evaluate("([a,c])=>LH.aplicatii.deschide(a,{continut:c,focus:true}).then(()=>{window.__m=(window.__lhAplicatieEv||[]).length})",
                    ['powerpoint', continut])
        pg.wait_for_timeout(300)
        return pg


def tap(pg, x, y):
    pg.touchscreen.tap(x, y)
    pg.wait_for_timeout(150)


def poze_telefon(H, rad):
    """capturile „ce se vede” la 360 px: pornirea, titlul atins (chenarul punctat), lansatorul Font adus în vedere, insignele Alt, H"""
    out = []
    with Tel(H, rad) as T:
        pg = T.app(C_TEL)
        snap = lambda: out.append(pg.screenshot(animations='disabled', caret='hide'))
        snap()
        c = centru(pg, 'forma:1/1'); tap(pg, c[0], c[1]); snap()
        pg.evaluate("()=>{const e=LH.aplicatii.element('powerpoint','lansator:Home/Font');e.querySelector('svg').scrollIntoView({inline:'center',block:'nearest'})}"); pg.wait_for_timeout(100); snap()
        taste(pg, 'Escape'); taste(pg, 'Alt', 'h'); snap()
    return out


def p6(H):
    # M1 · modificat după Ctrl+Z / Ctrl+Y făcute după salvare (critic 11 §6: a2 „z_dupa_save”)
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "nume_fisier": "vulcani.pptx", "selectie_text": [1, 1]})
    m = lambda: st(pg)['modificat']
    pg.keyboard.type('X'); pg.wait_for_timeout(80)
    m0 = m(); taste(pg, 'Control+s'); m1 = m()
    taste(pg, 'Control+z'); m2 = m(); t2 = st(pg)['diapozitive'][0]['texte']
    taste(pg, 'Control+s'); m3 = m()
    taste(pg, 'Control+y'); m4 = m(); t4 = st(pg)['diapozitive'][0]['texte']
    verif("MINOR modificat: scris → true · Ctrl+S → false · Ctrl+Z → true · Ctrl+S → false · Ctrl+Y → true",
          [m0, m1, m2, m3, m4] == [True, False, True, False, True] and t2 == ['Vulcanii'] and t4 == ['X'], sir=[m0, m1, m2, m3, m4], texte=[t2, t4])
    pg.close()
    # M2 · diapozitiv_activ null cu 0 diapozitive (critic 11 §6: a1 „del_ultim_stare”)
    pg = deschide(H, {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}], "panou": "miniaturi"})
    clic(pg, 'miniatura:1'); taste(pg, 'Delete')
    s = st(pg)
    verif("MINOR diapozitiv_activ: Delete pe ultimul diapozitiv → diapozitive [] și diapozitiv_activ null",
          s['diapozitive'] == [] and s['diapozitiv_activ'] is None, diapozitive=s['diapozitive'], diapozitiv_activ=s['diapozitiv_activ'])
    taste(pg, 'Control+z')
    s = st(pg)
    verif("MINOR diapozitiv_activ: Ctrl+Z readuce diapozitivul → diapozitiv_activ 1", len(s['diapozitive']) == 1 and s['diapozitiv_activ'] == 1,
          diapozitiv_activ=s['diapozitiv_activ'])
    pg.close()
    # M3 · Font style / Underline style / Alignment: premisa lui „lăsate” = referința n-are valorile lor (prin Python, pe chei)
    S = json.loads(UIA.read_text(encoding='utf-8'))['suprafete']

    def combo(cheie, et):
        st_ = [S[cheie]]
        while st_:
            n = st_.pop()
            if n.get('tip') == 'ComboBox' and n.get('eticheta') == et:
                return n
            st_.extend(n.get('copii') or [])
    cb = {et: combo(k, et) for k, et in [('dialog.FontDialogPowerPoint', 'Font style'), ('dialog.FontDialogPowerPoint', 'Underline style'),
                                         ('dialog.PowerPointParagraphDialog', 'Alignment')]}
    fara = {et: (n or {}).get('valoare') for et, n in cb.items()
            if n and not any(c.get('tip') in ('Edit', 'ListItem', 'List') for c in n.get('copii') or [])}
    verif("MINOR Font style / Underline style / Alignment: referința are câmpurile DOAR cu valoarea de acum (fără Edit, fără listă ▾) → lăsate, R12-9",
          len(fara) == 3, valori=fara)
    # M4 · telefon 360 px: zonele de atins ≥ 32 px, cu ATINGERI reale (touchscreen.tap)
    with Tel(H, H.radacina) as T:
        pg = T.app(C_TEL)
        c1 = centru(pg, 'forma:1/1'); tap(pg, c1[0], c1[1])
        s1 = st(pg)['selectie_text']
        mici = pg.evaluate(MAS)
        ppt = [x for x in mici if x.startswith(('margine_forma', 'diapozitiv', 'lansator'))]
        verif("MINOR telefon 360: nicio zonă de atins PowerPoint sub 32 px (lansatoare, chenarul casetei alese, colțul gol); rămân doar cele comune cu Word/Excel",
              not ppt and s1 and s1['forma'] == 1, mici=mici)
        sus = pg.evaluate("()=>{const r=LH.aplicatii.element('powerpoint','forma:1/1').getBoundingClientRect();return [r.x+r.width/2,r.y]}")
        ef_sus = pg.evaluate(EFECTIV, ['[data-lh-selectat] > .lh-ap-p-m-sus', sus[0], sus[1] - 8])
        ef_st = pg.evaluate(EFECTIV, ['[data-lh-selectat] > .lh-ap-p-m-st', None, None])
        tap(pg, sus[0], sus[1] - 14)
        s2 = st(pg)['selectie_forma']
        verif("MINOR telefon 360: chenarul titlului ales se atinge pe 32 px (efectiv, elementFromPoint); atingerea la 14 px DEASUPRA titlului îl alege ca obiect",
              ef_sus and ef_sus[1] >= 32 and ef_st and ef_st[0] >= 32 and s2 == [1, 1], efectiv_sus=ef_sus, efectiv_stanga=ef_st, selectie_forma=s2)
        tap(pg, c1[0], c1[1])
        c2 = centru(pg, 'forma:1/2'); tap(pg, c2[0], c2[1])
        s3 = st(pg)['selectie_text']
        tap(pg, c1[0], c1[1])
        s4 = st(pg)['selectie_text']
        verif("MINOR telefon 360: chenarul lărgit nu fură textul vecinului — titlul ales → atingerea subtitlului îl editează; subtitlul ales → atingerea titlului",
              s3 and s3['forma'] == 2 and s4 and s4['forma'] == 1, subtitlu=s3, titlu=s4)
        ef = {}
        for t in ['lansator:Home/Clipboard', 'lansator:Home/Paragraph', 'lansator:Home/Drawing', 'lansator:Home/Font']:   # Font ultimul: rămâne în vedere
            pg.evaluate("t=>LH.aplicatii.element('powerpoint',t).querySelector('svg').scrollIntoView({inline:'center',block:'nearest'})", t)
            pg.wait_for_timeout(100)
            ef[t] = pg.evaluate(EFECTIV, ['[data-lh-tinta="' + t + '"]', None, None])
        g = pg.evaluate("()=>{const r=LH.aplicatii.element('powerpoint','lansator:Home/Font').querySelector('svg').getBoundingClientRect();return [r.x,r.y,r.width]}")
        k = g[2] / 12   # zoom-ul telefonului: pictograma de 12 px
        tap(pg, g[0] - 2 * k - 3, g[1] - 2 * k - 3)   # 3 px în afara vechiului 21 × 21 (sus-stânga)
        dlg = st(pg)['dialog']
        verif("MINOR telefon 360: lansatoarele Font și Clipboard = zonă efectivă ≥ 32 × 32 (Paragraph / Drawing: cât încape sub butonul de deasupra); atingerea la 3 px în afara vechiului 21 × 21 deschide fereastra Font",
              all(ef[t] and min(ef[t]) >= 32 for t in ('lansator:Home/Font', 'lansator:Home/Clipboard')) and isinstance(dlg, dict) and dlg.get('titlu') == 'Font',
              efectiv=ef, dialog=dlg)
        pg.close()
    # M5 · „fără să schimbi ce se vede”: capturile la 360 px, predarea constructorului 1 (REF_VIZUAL) față de rădăcina probei
    if H.radacina == WT:
        tmp = arhiva(REF_VIZUAL)
        try:
            a, b = poze_telefon(H, tmp), poze_telefon(H, WT)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        same = [x == y for x, y in zip(a, b)]
        verif("MINOR telefon 360: ce se vede e la fel ca la " + REF_VIZUAL + " (pornirea, titlul ales, lansatorul Font în vedere, insignele Alt, H)",
              len(same) == 4 and all(same), identice=same)


SECTIUNI = [p1, p3, p2, p4, p5, p6]


def main():
    # --inainte = pornirea rundei (32fe7fb1, înaintea constructorului 1; până la predare era HEAD); --ref <sha> = altă rădăcină
    # (ex. 552ac0c5, predarea constructorului 1 = „înainte” de bucata 6) → proba_grav_<sha>.json; --doar p6 = doar unele secțiuni
    ref = sys.argv[sys.argv.index('--ref') + 1] if '--ref' in sys.argv else ('32fe7fb1' if '--inainte' in sys.argv else None)
    inainte = ref is not None
    doar = sys.argv[sys.argv.index('--doar') + 1].split(',') if '--doar' in sys.argv else None
    rad = WT
    tmp = None
    if inainte:
        tmp = arhiva(ref)
        rad = tmp
    try:
        with Ham(radacina=rad) as H:
            for f in SECTIUNI:
                if doar and f.__name__ not in doar:
                    continue
                try:
                    f(H)
                except Exception as e:
                    verif(f.__name__ + " (excepție)", False, eroare=str(e).splitlines()[0][:300])
            erori, plecate = H.erori, H.plecate
    finally:
        if tmp:
            shutil.rmtree(tmp, ignore_errors=True)
    picate = [x['nume'] for x in R if not x['ok']]
    nume = ('proba_grav_inainte' if ref == '32fe7fb1' else 'proba_grav_' + ref) if inainte else 'proba_grav_dupa'
    out = AICI / ((nume + '_' + '_'.join(doar) if doar else nume) + '.json')
    out.write_text(json.dumps({"radacina": (ref + " (git archive în %TEMP%)") if inainte else "worktree", "verificari": R, "picate": picate,
                               "erori_pagina": erori[:20], "cereri_plecate": plecate[:20]}, ensure_ascii=False, indent=1), encoding='utf-8')
    for x in R:
        print(('OK  ' if x['ok'] else 'PICĂ') + ' ' + x['nume'])
    print('erori pagina:', len(erori), '· cereri plecate:', len(plecate))
    print(len(picate))


if __name__ == '__main__':
    main()
