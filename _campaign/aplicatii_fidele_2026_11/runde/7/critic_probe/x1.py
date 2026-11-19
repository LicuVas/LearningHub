# -*- coding: utf-8 -*-
"""Critic r7: rejudecarea X1-X10 (runda 6) cu gesturi reale pe poligon."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1200])
s = Sesiune()
K = s.page.keyboard
def ev(n=3): return ultimele_ev(s, n)
def pauza(): s.page.wait_for_timeout(650)
def cel(a): return s.ev("a=>LH.aplicatii.stare('excel').celule[a]||null", a)
def dlg(): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-suprafata'))")
TABEL = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII B", "C2": 78, "A3": "Bogdan", "B3": "VIII A", "C3": 95,
         "A4": "Cristi", "B4": "VIII B", "C4": 95, "A5": "Dan", "B5": "VIII A", "C5": 60, "A6": "Elena", "B6": "VIII A", "C6": 88, "A7": "Flavia", "B7": "VIII B", "C7": 60}
try:
    s.deschide()
    # X1
    r = {}
    for a, t in [("A10", "=25/3"), ("A11", "1234567890"), ("A12", "123456789012"), ("A13", "12.03.2026"), ("A14", "=2/3*100"), ("C10", "=10/3*1000000")]:
        pauza(); scrie(s, a, t); v = vezi(s, a); r[a] = {"tastat": t, "stare_text": (cel(a) or {}).get("text"), "ecran": v["text"], "sw_cw": [v["sw"], v["cw"]]}
    r["latimi"] = s.stare().get("latimi_coloane")
    rec("X1", **r)
    s.shot("x1_celule.png", clip={"x": 0, "y": 380, "width": 500, "height": 140})
    # X2
    pauza(); scrie(s, "A16", "Situația notelor la informatică")
    pauza(); scrie(s, "A17", "Situația notelor la informatică"); pauza(); scrie(s, "B17", "x")
    v16 = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A16"] .lh-ap-x-t');const b=e.getBoundingClientRect();return [Math.round(b.width),e.scrollWidth,e.clientWidth]}""")
    v17 = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A17"] .lh-ap-x-t');const b=e.getBoundingClientRect();return [Math.round(b.width),e.scrollWidth,e.clientWidth]}""")
    rec("X2", A16_vecin_gol=v16, A17_vecin_plin=v17)
    s.shot("x2_curgere.png", clip={"x": 0, "y": 540, "width": 400, "height": 60})
    # X3: bara Acces rapid
    q = s.ev("""()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta^="acces_rapid"], [data-lh-aplicatie] [data-lh-tinta="acces_rapid"]')].filter(e=>e.getClientRects().length).map(e=>{const p=e.querySelector('svg path');const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta')||e.getAttribute('aria-label')||e.getAttribute('data-lh-id'),Math.round(b.x),Math.round(b.y),Math.round(b.width),p?p.getAttribute('d').slice(0,40):null]})""")
    rec("X3", butoane=q)
    s.shot("x3_qat.png", clip={"x": 0, "y": 0, "width": 220, "height": 50})
    # X5: AutoSum
    pauza(); clic_cel(s, "B5"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSum"]'); s.page.wait_for_timeout(200)
    ed = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?[e.value,e.selectionStart,e.selectionEnd]:null}")
    furnici = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-clip, [data-lh-aplicatie] .lh-ap-x-propus')].filter(e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0).map(e=>e.className+' '+Math.round(e.getBoundingClientRect().height))")
    s.shot("x5_autosum.png", clip={"x": 0, "y": 170, "width": 500, "height": 200})
    K.type("B2:B3"); s.page.wait_for_timeout(100)
    ed2 = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}")
    K.press("Enter"); s.page.wait_for_timeout(150)
    rec("X5", editare=ed, chenar_punctat=furnici, dupa_scriere=ed2, B5=cel("B5"), ev=ev(2))
    pauza(); clic_cel(s, "C5")
    ok = clic_el(s, '[data-lh-aplicatie] [data-lh-tip="SplitButton"][data-lh-eticheta="AutoSum"] [data-lh-eticheta="More Options"], [data-lh-aplicatie] [data-lh-id-mso="AutoSum"] ~ [data-lh-eticheta="More Options"]')
    s.page.wait_for_timeout(200)
    lista = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-meniu [data-lh-tinta]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta')||e.textContent.trim()).slice(0,10)")
    rec("X5_sageata", gasit=ok, lista=lista, mesaj=mesaj(s), ev=ev(1))
    avg = s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-meniu [data-lh-tinta]')].find(x=>/Average/.test(x.getAttribute('data-lh-eticheta')||x.textContent));if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}")
    if avg:
        s.page.mouse.click(avg[0], avg[1]); s.page.wait_for_timeout(150)
        rec("X5_average", ed=s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}"), ev=ev(1))
        K.press("Enter")
    K.press("Escape"); gol_mesaj(s)
    # X6
    pauza(); scrie(s, "D3", "=DACĂ(B3<9;10;20)"); pauza(); scrie(s, "D4", "=IF(B4<9;10;20)")
    rec("X6", D3=cel("D3"), D4=cel("D4"), ecran_D3=vezi(s, "D3")["text"], ev=ev(2))
    # X7: tragerea liniei dintre C si D, dublu clic intre A si B
    pauza()
    m = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="C"]');const b=e.getBoundingClientRect();return [b.right,b.y+b.height/2]}""")
    cur = s.ev("([x,y])=>getComputedStyle(document.elementFromPoint(x-1,y)).cursor", m)
    s.page.mouse.move(m[0] - 1, m[1]); s.page.mouse.down(); s.page.mouse.move(m[0] + 20, m[1], steps=4); s.page.mouse.move(m[0] + 39, m[1], steps=4); s.page.mouse.up(); s.page.wait_for_timeout(200)
    lat1 = s.stare().get("latimi_coloane"); sel1 = s.stare()["selectie"]; e1 = ev(1)
    pauza(); scrie(s, "A20", "Elevii clasei a VIII-a B")
    pauza(); m2 = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="A"]');const b=e.getBoundingClientRect();return [b.right,b.y+b.height/2]}""")
    s.page.mouse.dblclick(m2[0] - 1, m2[1]); s.page.wait_for_timeout(200)
    rec("X7_latime", cursor_pe_linie=cur, dupa_tragere=lat1, sel_dupa_tragere=sel1, ev_tragere=e1, dupa_dublu_clic=s.stare().get("latimi_coloane"), ev_dublu=ev(1))
    pauza(); clic_cel(s, "B2"); r = {}
    for idm in ["CellFillColorPicker", "PercentStyle", "WrapText"]:
        clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="%s"]' % idm); r[idm] = ev(1)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-meniu-borduri [data-lh-eticheta="All Borders"]')
    r["borders"] = ev(1); r["format_B2"] = (s.stare().get("format_celule") or {}).get("B2"); r["B2"] = cel("B2"); r["mesaj"] = mesaj(s)
    rec("X7_format", **r)
    K.press("Control+z"); K.press("Control+z"); K.press("Control+z"); K.press("Control+z")
    # X8: Ctrl+S pe registru nou
    K.press("Control+n"); s.page.wait_for_timeout(200)
    pauza(); scrie(s, "A1", "proba"); K.press("Control+s"); s.page.wait_for_timeout(300)
    bs = s.ev("()=>{const b=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-backstage');if(!b)return null;return {texte:[...b.querySelectorAll('[data-lh-eticheta]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-tip')+':'+e.getAttribute('data-lh-eticheta')).slice(0,60), inputuri:[...b.querySelectorAll('input')].filter(e=>e.getClientRects().length).map(e=>(e.getAttribute('aria-label')||'')+'='+e.value)}}")
    rec("X8_ctrl_s", stare=s.stare().get("pagina_backstage"), dialog=dlg(), backstage=bs, ev=ev(1))
    s.shot("x8_ctrl_s.png")
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "x1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
