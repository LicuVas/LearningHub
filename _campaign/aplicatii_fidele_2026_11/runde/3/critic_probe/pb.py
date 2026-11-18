# -*- coding: utf-8 -*-
"""Criticul rece, runda 3 — partea B (aspect): poziții, mărimi și text pe ecran, comparate cu uia_word.json."""
import sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe")
from h import *

OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe/"
REF = json.load(open(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json", encoding="utf-8"))
R = {}


def ref_noduri(cheie, tipuri):
    rez = []
    def m(n):
        r = n.get("rect_css")
        if n.get("tip") in tipuri and r and r[2] > 0 and r[0] > -500 and not n.get("eticheta", "").startswith("["):
            rez.append([n.get("tip"), n.get("eticheta"), r])
        for c in n.get("copii", []):
            m(c)
    m(REF["suprafete"][cheie])
    return rez


JS_SIM = """([sel, baza]) => { const s = document.querySelector(sel); if (!s) return null; const B = document.querySelector(baza || sel).getBoundingClientRect();
  return [...s.querySelectorAll('[data-lh-tip]')].map(x => { const r = x.getBoundingClientRect(); const t = x.querySelector('.lh-ap-text') || x;
    return [x.getAttribute('data-lh-tip'), x.getAttribute('data-lh-eticheta'), [Math.round(r.x - B.x), Math.round(r.y - B.y), Math.round(r.width), Math.round(r.height)],
            (x.innerText || '').trim().slice(0, 40), getComputedStyle(t).fontSize]; }); }"""

s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    # 1. Backstage › Open contra referinței (coordonate față de fereastră)
    deschide(pg, ["Orar"], 0)
    pg.keyboard.press("Control+o"); pg.wait_for_timeout(300)
    sim = pg.evaluate(JS_SIM, ['.lh-ap-strat-backstage', '[data-lh-aplicatie="word"]'])
    ref = ref_noduri("backstage.Open", {"Text", "Button", "TabItem", "ListItem", "Hyperlink", "Group", "List"})
    simd = {}
    for t, e, r, txt, fs in sim or []:
        simd.setdefault((t, e), []).append((r, txt, fs))
    R["open_ref_vs_sim"] = [[t, e, rr, simd.get((t, e), [None])[0]] for t, e, rr in ref][:60]
    # clic pe Browse și pe primul rând din Recent
    br = pg.evaluate("() => { const x = [...document.querySelectorAll('.lh-ap-strat-backstage [data-lh-eticheta=\"Browse\"]')].find(e => e.getBoundingClientRect().width > 0); if (!x) return null; const r = x.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }")
    if br:
        pg.mouse.click(br[0], br[1]); pg.wait_for_timeout(300)
    R["open_browse"] = obs(pg)
    pg.screenshot(path=OUT + "open_browse.png")
    pg.keyboard.press("Escape"); pg.keyboard.press("Escape"); pg.wait_for_timeout(100)
    deschide(pg, ["Orar"], 0)
    pg.keyboard.press("Control+o"); pg.wait_for_timeout(300)
    rec = pg.evaluate("() => { const x = [...document.querySelectorAll('.lh-ap-strat-backstage [data-lh-tip=\"ListItem\"]')].filter(e => /^\\[/.test(e.getAttribute('data-lh-eticheta') || '') && e.getBoundingClientRect().width > 0)[0]; if (!x) return null; const r = x.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, r.width, r.height, x.innerText]; }")
    R["open_recent_primul"] = rec
    if rec:
        pg.mouse.click(rec[0], rec[1]); pg.wait_for_timeout(300)
    R["open_recent_clic"] = obs(pg)

    # 2. Save As contra referinței (coordonate față de colțul dialogului; referința: colțul = [-27, -3])
    deschide(pg, ["Orar"], 0)
    pg.keyboard.press("F12"); pg.wait_for_timeout(300)
    sim = pg.evaluate(JS_SIM, ['[data-lh-suprafata="dialog.FileSaveAs"]', None])
    o = REF["suprafete"]["dialog.FileSaveAs"]["rect_css"]
    ref = ref_noduri("dialog.FileSaveAs", {"SplitButton", "Button", "Text", "ComboBox", "Edit", "MenuItem", "CheckBox"})
    simd = {}
    for t, e, r, txt, fs in sim or []:
        simd.setdefault((t, e), []).append((r, txt, fs))
    rows = []
    for t, e, rr in ref:
        rel = [round(rr[0] - o[0]), round(rr[1] - o[1]), round(rr[2]), round(rr[3])]
        sm = simd.get((t, e), [None])[0]
        rows.append([t, e, rel, sm])
    R["saveas_ref_vs_sim"] = rows

    # 3. „Save this file” — captură
    deschide(pg, ["Poezia mea"], 0)
    pg.keyboard.press("Control+s"); pg.wait_for_timeout(300)
    pg.screenshot(path=OUT + "save_this_file.png")
    R["save_this_file"] = pg.evaluate(JS_SIM, ['[data-lh-suprafata="dialog.SaveThisFile"]', None])

    # 4. mesajul central (▾ Font Size) — captură și dreptunghi
    deschide(pg, ["Ana are mere"], 4, 7)
    c = centru(pg, '[data-lh-tinta="meniu_derulant:Home/Font/Font Size"]'); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(200)
    R["mesaj"] = pg.evaluate("() => [...document.querySelectorAll('[data-lh-nesimulat]')].map(m => { const r = m.getBoundingClientRect(); return [m.textContent.trim(), m.getAttribute('role'), Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })")
    pg.screenshot(path=OUT + "mesaj_fontsize.png")
    b.close()

    # 5. telefonul (390 px): Save As și Save this file încap?
    b = p.chromium.launch(headless=True)
    ctx = context(b, 390, 800, touch=True); pg = pagina(ctx, port)
    for k, tasta, sup in (("saveas_390", "F12", "dialog.FileSaveAs"), ("savethis_390", "Control+s", "dialog.SaveThisFile")):
        deschide(pg, ["Orar"], 0)
        pg.keyboard.press(tasta); pg.wait_for_timeout(300)
        R[k] = pg.evaluate("""s => { const d = document.querySelector('[data-lh-suprafata="' + s + '"]'); const R = document.querySelector('[data-lh-aplicatie="word"]').getBoundingClientRect(); const r = d.getBoundingClientRect();
            const sv = d.querySelector('[data-lh-tinta="dialog_salvare:Save"]').getBoundingClientRect();
            return {dialog: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], radacina: [Math.round(R.x), Math.round(R.y), Math.round(R.width), Math.round(R.height)], save: [Math.round(sv.x), Math.round(sv.y), Math.round(sv.width), Math.round(sv.height)], vw: innerWidth, scrollW: document.documentElement.scrollWidth}; }""", sup)
        pg.screenshot(path=OUT + k + ".png")
    b.close()
s.shutdown()
salveaza(R, OUT + "rb.json")
for k, v in R.items():
    print("==", k)
    if isinstance(v, list):
        for x in v[:60]:
            print("  ", x)
    else:
        print("  ", v if not isinstance(v, dict) or "ev" not in v else {z: v.get(z) for z in ("msg", "backstage", "dlg", "ev", "nume")})
