# -*- coding: utf-8 -*-
"""Criticul rece, runda 3 — partea A: cele 5 GRAV din runda 2 + regresul GRAV 1 (gesturi reale pe poligon)."""
import sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe")
from h import *

OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe/"
R = {}
SA = '[data-lh-suprafata="dialog.FileSaveAs"]'
ST = '[data-lh-suprafata="dialog.SaveThisFile"]'


def clic(pg, sel):
    c = centru(pg, sel)
    if not c:
        return None
    pg.mouse.click(c[0], c[1])
    pg.wait_for_timeout(120)
    return c


def scrie_nume(pg, nume):
    pg.keyboard.press("Control+A")
    pg.keyboard.type(nume, delay=15)


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    cdp = ctx.new_cdp_session(pg)

    # ---------- GRAV 1 (regres): telefonul nu dublează literele
    deschide(pg, [""], 0)
    cdp_compune(pg, cdp, ["a", "an", "ana"], "ana"); cdp.send("Input.insertText", {"text": " "}); pg.wait_for_timeout(40)
    cdp_compune(pg, cdp, ["a", "ar", "are"], "are"); pg.wait_for_timeout(150)
    R["g1a"] = obs(pg)
    deschide(pg, [""], 0)
    cdp_compune(pg, cdp, ["a", "an", "anq", "an", "ana"], "ana"); cdp.send("Input.insertText", {"text": " "})
    cdp_compune(pg, cdp, ["a", "ar", "arw"], "are"); cdp.send("Input.insertText", {"text": " "})
    cdp_compune(pg, cdp, ["m", "me", "mer", "mere", "mere."], "mere."); cdp.send("Input.insertText", {"text": " "})
    cdp_compune(pg, cdp, ["e", "el"], "el"); cdp.send("Input.insertText", {"text": " "}); pg.wait_for_timeout(150)
    R["g1b"] = obs(pg)

    # ---------- GRAV 3: caseta Font Size
    FS = '[data-lh-id-mso="FontSize"]'
    for prof in (None, "word2007"):
        k = prof or "word365"
        deschide(pg, ["Ana are mere"], 4, 7, profil=prof)
        clic(pg, '[data-lh-tinta="meniu_derulant:Home/Font/Font Size"]'); pg.wait_for_timeout(200)
        o = obs(pg)
        o["meniu"] = pg.evaluate("() => [...document.querySelectorAll('.lh-ap-meniu [role=menuitem]')].map(x => x.textContent.trim())")
        R["g3b_sageata_" + k] = o
        # drumul elevului „alege 20”: clic în casetă, 20, Enter
        deschide(pg, ["Atelierul de pictura", "In fiecare joi"], 0, 20, profil=prof)
        clic(pg, FS + ' input')
        R["g3f_dupa_clic_" + k] = pg.evaluate("s => { const i = document.querySelector(s); return [i.value, i.selectionStart, i.selectionEnd, document.activeElement === i]; }", FS + ' input')
        pg.keyboard.type("20", delay=30); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
        o = obs(pg); o["caseta"] = pg.evaluate("s => document.querySelector(s).value", FS + ' input')
        R["g3f_clic_20_enter_" + k] = o
        # Alt+↓ în casetă
        deschide(pg, ["Ana are mere"], 4, 7, profil=prof)
        clic(pg, FS + ' input'); pg.keyboard.press("Alt+ArrowDown"); pg.wait_for_timeout(150)
        R["g3_altjos_" + k] = obs(pg)
        # Ctrl+A + 14 + Enter (trecuse în runda 2)
        deschide(pg, ["Ana are mere"], 4, 7, profil=prof)
        clic(pg, FS + ' input'); pg.keyboard.press("Control+A"); pg.keyboard.type("14"); pg.keyboard.press("Enter"); pg.wait_for_timeout(150)
        R["g3a_ctrla_14_" + k] = obs(pg)

    # ---------- N1: bara de titlu după salvare, pe 4 drumuri
    NUME = "Marin_Ioana_7B_poezie"
    def titlu_acum():
        return pg.evaluate("""() => [...document.querySelectorAll('[data-lh-suprafata="bara_titlu"] [data-lh-tip="Button"]')].filter(b => / - /.test(b.textContent)).map(b => { const t = b.querySelector('.lh-ap-text') || b; const r = b.getBoundingClientRect(); return [b.textContent.trim(), Math.round(r.width), t.scrollWidth, t.clientWidth, getComputedStyle(t).textOverflow, getComputedStyle(t).overflow]; })""")
    for drum in ("f12_enter", "f12_clic", "ctrls_enter", "ctrls_clic"):
        deschide(pg, ["Poezia mea", "Toamna vine."], 0)
        pg.keyboard.press("F12" if drum.startswith("f12") else "Control+s"); pg.wait_for_timeout(200)
        scrie_nume(pg, NUME)
        if drum.endswith("enter"):
            pg.keyboard.press("Enter")
        else:
            clic(pg, (SA if drum.startswith("f12") else ST) + ' [data-lh-tinta="dialog_salvare:Save"]')
        t0 = titlu_acum()
        pg.wait_for_timeout(300)
        o = obs(pg); o["titlu_imediat"] = t0; o["titlu_detaliu"] = titlu_acum()
        R["n1_" + drum] = o
    pg.screenshot(path=OUT + "n1_titlu.png", clip={"x": 0, "y": 0, "width": 700, "height": 50})

    # ---------- N2: Enter în File name = Save, văzut de asistent
    AS = {"pasi": [{"tinta": "dialog_salvare:Save", "indiciu": "Apasă Save"}, {"tinta": "mso:Bold", "indiciu": "Apasă B"}], "dupaGreseli": 2, "dupaSecunde": 30}
    for drum in ("f12", "ctrls"):
        deschide(pg, ["Orar", "Luni: romana"], 0, asistent=AS)
        pg.keyboard.press("F12" if drum == "f12" else "Control+s"); pg.wait_for_timeout(200)
        scrie_nume(pg, "Popescu_Ana_7A_orar"); pg.keyboard.press("Enter"); pg.wait_for_timeout(200)
        o = obs(pg)
        R["n2_" + drum] = o
    # Enter cu numele gol
    deschide(pg, ["Orar"], 0, asistent=AS)
    pg.keyboard.press("F12"); pg.wait_for_timeout(200); pg.keyboard.press("Control+A"); pg.keyboard.press("Delete"); pg.keyboard.press("Enter"); pg.wait_for_timeout(200)
    R["n2_nume_gol"] = obs(pg)

    # ---------- N4: drumurile lecției m1-l03
    deschide(pg, ["Orar", "Miercuri: desen"], 0)
    pg.keyboard.press("Control+w"); pg.wait_for_timeout(200); R["n4_ctrlw"] = obs(pg)
    deschide(pg, ["Orar", "Miercuri: desen"], 0)
    clic(pg, '[data-lh-suprafata="bara_titlu"] [data-lh-eticheta="Close"]'); pg.wait_for_timeout(200); R["n4_x"] = obs(pg)
    deschide(pg, ["Orar"], 0)
    pg.keyboard.press("Control+o"); pg.wait_for_timeout(300)
    o = obs(pg)
    o["open_vizibil"] = pg.evaluate("""() => { const p = document.querySelector('.lh-ap-strat-backstage'); if (!p) return null;
        return [...p.querySelectorAll('[data-lh-tip]')].filter(x => { const r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.x >= 0 && r.y >= 0 && r.x < 1366; })
          .map(x => [x.getAttribute('data-lh-tip'), (x.getAttribute('data-lh-eticheta') || '').slice(0, 50), (x.innerText || '').trim().slice(0, 40)]).filter(z => /ListItem|Button|Hyperlink|Text|DataItem/.test(z[0])).slice(0, 70); }""")
    R["n4_ctrlo"] = o
    pg.screenshot(path=OUT + "n4_ctrlo.png")
    # Save as type ▾ → PDF
    deschide(pg, ["Orar", "Marti: sport"], 0)
    pg.keyboard.press("F12"); pg.wait_for_timeout(200)
    sag = SA + ' [data-lh-tip="ComboBox"][data-lh-eticheta="Save as type:"] [data-lh-tip="Button"]'
    clic(pg, sag); pg.wait_for_timeout(200)
    o = obs(pg)
    o["meniu"] = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-meniu [role=menuitem]')].map(x => { const r = x.getBoundingClientRect(); return [x.textContent.trim(), x.getAttribute('data-lh-tinta'), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })""")
    o["combo"] = pg.evaluate("""s => { const c = document.querySelector(s); const r = c.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }""", SA + ' [data-lh-tip="ComboBox"][data-lh-eticheta="Save as type:"]')
    o["dialog"] = pg.evaluate("""s => { const c = document.querySelector(s); const r = c.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }""", SA)
    R["n4_tip_lista"] = o
    pg.screenshot(path=OUT + "n4_tip_lista.png")
    pdf = pg.evaluate("() => { const x = [...document.querySelectorAll('.lh-ap-meniu [role=menuitem]')].find(x => /PDF/.test(x.textContent)); if (!x) return null; const r = x.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }")
    if pdf:
        pg.mouse.click(pdf[0], pdf[1]); pg.wait_for_timeout(200)
    o = obs(pg)
    o["combo_text_vizibil"] = pg.evaluate("""s => { const c = document.querySelector(s); return [c.innerText, [...c.querySelectorAll('input')].map(i => i.value), [...c.querySelectorAll('*')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => { const r = e.getBoundingClientRect(); return [e.textContent.trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), getComputedStyle(e).visibility, getComputedStyle(e).display]; })]; }""", SA + ' [data-lh-tip="ComboBox"][data-lh-eticheta="Save as type:"]')
    R["n4_dupa_pdf"] = o
    pg.screenshot(path=OUT + "n4_dupa_pdf.png", clip={"x": 0, "y": 370, "width": 980, "height": 80})
    clic(pg, SA + ' [data-lh-tinta="dialog_salvare:Save"]'); pg.wait_for_timeout(200)
    R["n4_pdf_salvat"] = obs(pg)
    # cuvântul „Documente” pe ecran în Save As
    deschide(pg, ["Orar"], 0)
    pg.keyboard.press("F12"); pg.wait_for_timeout(200)
    R["n4_documente_pe_ecran"] = pg.evaluate("""s => { const d = document.querySelector(s); return { innerText_are_Documente: /Document(e|s)/.test(d.innerText), noduri: [...d.querySelectorAll('[data-lh-eticheta*="Document"]')].map(x => { const r = x.getBoundingClientRect(); return [x.getAttribute('data-lh-tip'), x.getAttribute('data-lh-eticheta'), (x.innerText || '').trim(), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }) }; }""", SA)
    clic(pg, SA + ' [data-lh-tip="SplitButton"][data-lh-eticheta="Documente"]'); pg.wait_for_timeout(200)
    R["n4_clic_documente_adresa"] = obs(pg)
    # cheile stării; documentul pornit cu nume (start-ul exercițiilor 2 și 3)
    deschide(pg, ["Orar"], 0, extra={"nume": "Popescu_Ana_7A_orar", "folder": "doc", "salvat": True, "nume_fisier": "Popescu_Ana_7A_orar.docx"})
    R["n4_chei_stare"] = pg.evaluate("() => Object.keys(LH.aplicatii.stare('word'))")
    o = obs(pg)
    pg.keyboard.press("Control+s"); pg.wait_for_timeout(200)
    o2 = obs(pg)
    R["n4_doc_cu_nume"] = {"inainte": o, "dupa_ctrls": o2}
    b.close()

    # ---------- N3: telefonul, cuvântul în compunere (context touch, 390 px)
    b = p.chromium.launch(headless=True)
    ctx = context(b, 390, 800, touch=True); pg = pagina(ctx, port)
    cdp = ctx.new_cdp_session(pg)
    pg.evaluate("""() => { const v = document.createElement('button'); v.id = 'verifica'; v.textContent = 'Verifică';
        v.style.cssText = 'position:fixed;left:10px;bottom:10px;width:160px;height:48px;z-index:99999';
        v.addEventListener('click', () => { window.__laClic = LH.aplicatii.stare('word').text.slice(); });
        document.body.appendChild(v); }""")

    def tap_sel(sel):
        c = centru(pg, sel)
        pg.touchscreen.tap(c[0], c[1]); pg.wait_for_timeout(30)
        return c
    # (a) ultimul cuvânt, fără spațiu, apoi atingere pe „Verifică”
    deschide(pg, ["Numele: "], 8)
    cdp_compune(pg, cdp, ["I", "Io", "Ion"])
    tap_sel("#verifica")
    a_clic = pg.evaluate("window.__laClic")
    pg.wait_for_timeout(400)
    o = obs(pg); o["la_click"] = a_clic
    R["n3a_verifica"] = o
    # (a2) același lucru de două ori la rând (a doua compunere după prima atingere)
    cdp_compune(pg, cdp, [" ", " P", " Po", " Pop"])
    tap_sel("#verifica")
    a2 = pg.evaluate("window.__laClic"); pg.wait_for_timeout(300)
    o = obs(pg); o["la_click"] = a2
    R["n3a2_a_doua_oara"] = o
    # (b) compunere „mere” la capătul rândului 1, atingere în rândul 2
    deschide(pg, ["Ana are ", "Doi"], 8)
    cdp_compune(pg, cdp, ["m", "me", "mer", "mere"])
    c2 = pg.evaluate("""() => { const p = document.querySelectorAll('[data-lh-zona] [data-lh-tinta="text"]')[1]; const r = p.getBoundingClientRect(); return [r.x + 30, r.y + r.height / 2]; }""")
    pg.touchscreen.tap(c2[0], c2[1]); pg.wait_for_timeout(300)
    o = obs(pg); o["sel"] = pg.evaluate("LH.aplicatii.stare('word').selectie")
    R["n3b_atingere_rand2"] = o
    cdp.send("Input.insertText", {"text": "X"}); pg.wait_for_timeout(200)
    o = obs(pg); o["sel"] = pg.evaluate("LH.aplicatii.stare('word').selectie")
    R["n3b_apoi_X"] = o
    # (b2) compunerea continuă după atingere: încă un cuvânt compus în rândul 2
    cdp_compune(pg, cdp, ["p", "pe", "pere"], "pere"); pg.wait_for_timeout(200)
    R["n3b2_compunere_dupa"] = obs(pg)
    # (c) atingere pe B (aldin) în timpul compunerii
    deschide(pg, ["Ana are "], 8)
    cdp_compune(pg, cdp, ["m", "me", "mere"])
    bold = pg.evaluate("""() => { const e = [...document.querySelectorAll('[data-lh-id-mso="Bold"]')].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }""")
    if bold:
        pg.touchscreen.tap(bold[0], bold[1]); pg.wait_for_timeout(300)
    R["n3c_atingere_bold"] = obs(pg)
    # (d) GRAV 1 pe context touch
    deschide(pg, [""], 0)
    cdp_compune(pg, cdp, ["a", "an", "ana"], "ana"); cdp.send("Input.insertText", {"text": " "})
    cdp_compune(pg, cdp, ["a", "ar", "are"], "are"); pg.wait_for_timeout(150)
    R["g1_touch"] = obs(pg)
    b.close()
s.shutdown()
salveaza(R, OUT + "ra.json")
for k, v in R.items():
    if isinstance(v, dict):
        print(k, {x: v.get(x) for x in ("text", "titlu", "titlu_imediat", "nume", "folder", "msg", "pas", "la_click", "caseta", "meniu", "backstage", "dlg") if x in v})
        print("   ev:", v.get("ev", [])[-6:])
    else:
        print(k, v)
