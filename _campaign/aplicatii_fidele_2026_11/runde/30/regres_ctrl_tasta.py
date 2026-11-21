# -*- coding: utf-8 -*-
"""Regresul schimbărilor comune ale rundei 30 din aplicatii.js (gestTasta: N2 + A26-2; pointerdown: A23-1 P1; deschideSuprafata: P2;
I.emite: extra): Ctrl + tastă (și Meta + tastă) pe Word, Excel, PowerPoint, Explorer dau EXACT aceleași evenimente (gest, acțiune,
țintă, activat) și aceeași stare finală înainte și după, plus un clic și un clic dreapta în zona de lucru (pointerdown, P1).

Înainte / după se joacă pe DOUĂ copii ale aceluiași instantaneu al dosarului aplicatii/ (luate în aceeași clipă, ca schimbările
celorlalte benzi din worktree să nu încurce comparația): A = aplicatii.js de acum; B = aplicatii.js de acum cu cele 4 zone ale rundei
30 puse înapoi exact ca în runde/30/inainte/aplicatii.js. Copiile stau în dosarul dat prin LH_AB (în afara worktree-ului).

    LH_AB=<dosar temporar> python .../runde/30/regres_ctrl_tasta.py
Ieșirea: runde/30/probe_iesiri/regres_ctrl_tasta.json; ultima linie = aplicații Office / Explorer cu diferențe (Windows nu se numără:
acolo diferența e voită).
"""
import json
import os
import shutil
import sys
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
WT = D.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL      # noqa: E402

AB = Path(os.environ["LH_AB"])
TASTE = ["Control+b", "Control+i", "Control+u", "Control+e", "Control+z", "Control+y", "Control+a", "Control+c", "Control+x",
         "Control+v", "Control+f", "Control+Shift+n", "Control+n", "Control+s", "Control+1", "Control+Space", "Control+Period",
         "Escape", "Escape", "Meta+b", "Meta+e", "Meta+c", "Meta+d", "Meta+Space", "Meta+1", "Meta+Period", "Meta+Tab", "Meta+ArrowUp",
         "Meta+Comma", "Meta", "Escape", "Tab", "F2", "Delete"]
APPS = ["word", "excel", "powerpoint", "explorer", "windows"]
ASCULTA = "window.__E=[];window.addEventListener('lh-aplicatie',e=>window.__E.push(JSON.parse(JSON.stringify(e.detail))));"
# zona -> (început, sfârșit exclusiv) în ambele fișiere; B primește textul din inainte/
ZONE = [("        I.emite = (gest", "        I.nesimulat = (eticheta"),
        ("  L.deschideSuprafata = function", "    const I = nume && INST[nume];\n    if (!I || !I.deschideSuprafata)"),
        ("  const MAC = /Mac|iPhone", "  L._gestTasta = gestTasta;"),
        ("    r.addEventListener('pointerdown', e => {", "      /* încheierea compunerii (laAtingere")]


def zona(s, a, b):
    i = s.index(a)
    return i, s.index(b, i)


def pregateste():
    if AB.exists():
        shutil.rmtree(AB)
    for x in ("A", "B"):
        shutil.copytree(WT / "aplicatii", AB / x / "aplicatii", ignore=shutil.ignore_patterns("_unelte", "__pycache__"))
    f = AB / "B" / "aplicatii" / "aplicatii.js"
    s = f.read_text(encoding="utf-8")
    vechi = (AICI / "inainte" / "aplicatii.js").read_text(encoding="utf-8")
    for a, b in ZONE:
        i, j = zona(s, a, b)
        vi, vj = zona(vechi, a, b)
        s = s[:i] + vechi[vi:vj] + s[j:]
    f.write_text(s, encoding="utf-8", newline="")
    a_ = (AB / "A" / "aplicatii" / "aplicatii.js").read_text(encoding="utf-8")
    return {"A_runda30": a_.count("runda 30"), "B_runda30": s.count("runda 30"),
            "B_zone_ca_inainte": all(s[slice(*zona(s, a, b))] == vechi[slice(*zona(vechi, a, b))] for a, b in ZONE),
            "A_fata_de_B_doar_zonele": len(a_) != len(s)}


def joaca(br, base, app):
    ctx = br.new_context(viewport={"width": 1366, "height": 768})
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    err = []
    pg.on("pageerror", lambda e: err.append(str(e)[:160]))
    pg.goto(base + "aplicatii/poligon.html", wait_until="load")
    pg.evaluate(ASCULTA)
    pg.evaluate("a => LH.aplicatii.deschide(a, {focus: true})", app)
    pg.wait_for_timeout(400)
    pg.evaluate("window.__E.splice(0)")
    out = []
    for t in TASTE:
        pg.keyboard.press(t)
        pg.wait_for_timeout(120)
        e = pg.evaluate("window.__E.splice(0)")
        out.append([t, [[x["aplicatie"], x["gest"], x["actiune"], x["tinta"], x.get("activat")] for x in e]])
    # P1: un clic și un clic dreapta în mijlocul rădăcinii (fără montare, ramura nouă nu rulează)
    b = pg.evaluate("a => { const r = document.querySelector('[data-lh-aplicatie=\"' + a + '\"]').getBoundingClientRect(); return [r.x + r.width * 0.5, r.y + r.height * 0.55]; }", app)
    for buton in ("left", "right"):
        pg.mouse.click(b[0], b[1], button=buton)
        pg.wait_for_timeout(150)
        e = pg.evaluate("window.__E.splice(0)")
        out.append(["mouse_" + buton, [[x["aplicatie"], x["gest"], x["actiune"], x["tinta"], x.get("activat")] for x in e]])
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(100)
        pg.evaluate("window.__E.splice(0)")
    stare = pg.evaluate("a => LH.aplicatii.stare(a)", app)
    ctx.close()
    return {"taste": out, "stare": json.dumps(stare, ensure_ascii=False, sort_keys=True), "erori": err}


def main():
    info = pregateste()
    from playwright.sync_api import sync_playwright
    rez = {"copii": info, "aplicatii": {}}
    with sync_playwright() as p:
        br = p.chromium.launch()
        for x in ("A", "B"):
            srv, base = SL.porneste_server(AB / x)
            for app in APPS:
                rez["aplicatii"].setdefault(app, {})[x] = joaca(br, base, app)
            srv.shutdown()
        br.close()
    dif = 0
    for app in APPS:
        a, b = rez["aplicatii"][app]["A"], rez["aplicatii"][app]["B"]
        d = [[ta[0], ta[1], tb[1]] for ta, tb in zip(a["taste"], b["taste"]) if ta[1] != tb[1]]
        same_st = a["stare"] == b["stare"]
        nev = sum(len(t[1]) for t in a["taste"])
        rez["aplicatii"][app]["diferente"] = d
        rez["aplicatii"][app]["stare_la_fel"] = same_st
        print("%-11s evenimente %3d  gesturi cu alte evenimente: %d  stare finală la fel: %s  erori JS: %d/%d%s" % (
            app, nev, len(d), same_st, len(a["erori"]), len(b["erori"]),
            "" if not d else "  " + "; ".join("%s: înainte %s, după %s" % (x[0], x[2], x[1]) for x in d)[:700]))
        if app != "windows" and (d or not same_st or a["erori"] or b["erori"]):
            dif += 1
    (AICI / "probe_iesiri" / "regres_ctrl_tasta.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print("copii: " + json.dumps(info, ensure_ascii=False))
    print(dif)


if __name__ == "__main__":
    main()
