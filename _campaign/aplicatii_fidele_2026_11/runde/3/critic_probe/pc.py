# -*- coding: utf-8 -*-
"""Criticul rece, runda 3: butoanele ferestrelor de salvare se pot atinge pe telefon (390 px) și pe laptop 1366x657 la 125 %?"""
import sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe")
from h import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe/"
JS = """sel => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({block: 'center', inline: 'center'});
  const r = e.getBoundingClientRect(); const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
  const h = document.elementFromPoint(cx, cy); const anc = []; let a = e.parentElement;
  while (a) { const cs = getComputedStyle(a); if (/(auto|scroll)/.test(cs.overflowX + cs.overflowY) && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight)) anc.push([a.className, a.scrollWidth, a.clientWidth, a.scrollHeight, a.clientHeight]); a = a.parentElement; }
  return {rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], vw: innerWidth, vh: innerHeight,
          in_ecran: r.x >= 0 && r.y >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, atins: !!h && (h === e || e.contains(h)), lovit: h ? (h.getAttribute('data-lh-tinta') || h.className) : null, derulabile: anc}; }"""
R = {}
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    for nume, (w, hgt, touch, dsf) in {"telefon_390": (390, 800, True, 1), "laptop_125": (1093, 526, False, 1.25)}.items():
        ctx = b.new_context(viewport={"width": w, "height": hgt}, has_touch=touch, is_mobile=touch, device_scale_factor=dsf)
        ctx.route("**/*", doar_local)
        pg = pagina(ctx, port)
        for k, tasta, sup in (("saveas", "F12", "dialog.FileSaveAs"), ("savethis", "Control+s", "dialog.SaveThisFile")):
            deschide(pg, ["Orar"], 0)
            pg.keyboard.press(tasta); pg.wait_for_timeout(300)
            base = '[data-lh-suprafata="' + sup + '"] '
            R[nume + "_" + k + "_Save"] = pg.evaluate(JS, base + '[data-lh-tinta="dialog_salvare:Save"]')
            if k == "saveas":
                R[nume + "_" + k + "_tip"] = pg.evaluate(JS, base + '[data-lh-tip="ComboBox"][data-lh-eticheta="Save as type:"] [data-lh-tip="Button"]')
            # atingerea/clicul real pe Save, acolo unde e acum
            r = R[nume + "_" + k + "_Save"]["rect"]
            x, y = r[0] + r[2] / 2, r[1] + r[3] / 2
            if 0 <= x < w and 0 <= y < hgt:
                (pg.touchscreen.tap if touch else pg.mouse.click)(x, y); pg.wait_for_timeout(250)
            o = obs(pg)
            R[nume + "_" + k + "_dupa_gest"] = {"nume": o["nume"], "dlg": o["dlg"], "ev": o["ev"][-2:]}
            pg.screenshot(path=OUT + nume + "_" + k + ".png")
        ctx.close()
    b.close()
s.shutdown()
salveaza(R, OUT + "rc.json")
for k, v in R.items():
    print(k, v)
