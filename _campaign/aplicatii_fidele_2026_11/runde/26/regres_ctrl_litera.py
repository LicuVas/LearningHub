# -*- coding: utf-8 -*-
"""Regresul schimbării comune din aplicatii.js › gestTasta (runda 26, K1): Ctrl + literă (și Meta + literă) pe Word, Excel, PowerPoint,
Explorer dau EXACT aceleași evenimente (gest, acțiune, țintă, activat) și aceeași stare finală înainte și după schimbare.

Înainte / după se joacă pe DOUĂ copii ale aceluiași instantaneu al dosarului aplicatii/ (luate în aceeași clipă, ca schimbările
celorlalte benzi din worktree să nu încurce comparația): A = aplicatii.js de acum, B = aplicatii.js de acum fără blocul rundei 26.
Copiile stau în dosarul dat prin LH_AB (în afara worktree-ului); ieșirea nu conține căi.

    LH_AB=<dosar temporar> python .../runde/26/regres_ctrl_litera.py
Ieșirea: runde/26/probe_iesiri/regres_ctrl_litera.json; ultima linie = aplicații cu diferențe (Windows nu se numără: acolo diferența e voită).
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
BLOC_INCEPUT = "  /* runda 26 (critic 22, K1): tasta Windows + literă"
TASTE = ["Control+b", "Control+i", "Control+u", "Control+e", "Control+z", "Control+y", "Control+a", "Control+c", "Control+x",
         "Control+v", "Control+f", "Control+Shift+n", "Control+n", "Control+s", "Escape", "Escape", "Meta+b", "Meta+e", "Meta+c", "Meta+d"]
APPS = ["word", "excel", "powerpoint", "explorer", "windows"]
ASCULTA = "window.__E=[];window.addEventListener('lh-aplicatie',e=>window.__E.push(JSON.parse(JSON.stringify(e.detail))));"


def pregateste():
    if AB.exists():
        shutil.rmtree(AB)
    for x in ("A", "B"):
        shutil.copytree(WT / "aplicatii", AB / x / "aplicatii", ignore=shutil.ignore_patterns("_unelte", "__pycache__"))
    f = AB / "B" / "aplicatii" / "aplicatii.js"
    s = f.read_text(encoding="utf-8")
    i = s.index(BLOC_INCEPUT)
    j = s.index("  function gestTasta(e) {", i)
    s = s[:i] + s[j:]
    k = s.index("    if (e.metaKey && !e.ctrlKey && !e.altKey && k !== 'Meta' && !MAC) {")
    m = s.index("    if (/^Arrow/.test(k))", k)
    s = s[:k] + s[m:]
    f.write_text(s, encoding="utf-8", newline="")
    a = (AB / "A" / "aplicatii" / "aplicatii.js").read_text(encoding="utf-8")
    b = (AB / "B" / "aplicatii" / "aplicatii.js").read_text(encoding="utf-8")
    vechi = (D / "runde" / "26" / "inainte" / "aplicatii.js").read_text(encoding="utf-8")
    return {"A_are_blocul": BLOC_INCEPUT in a, "B_are_blocul": BLOC_INCEPUT in b, "linii_A": a.count("\n"), "linii_B": b.count("\n"),
            "B_gestTasta_ca_inainte": _gest(b) == _gest(vechi)}


def _gest(s):
    i = s.index("  function gestTasta(e) {")
    return s[i:s.index("  L._gestTasta = gestTasta;", i)]


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
        out.append([t, [[x["gest"], x["actiune"], x["tinta"], x.get("activat")] for x in e]])
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
        print("%-11s evenimente %3d  taste cu alte evenimente: %d  stare finală la fel: %s  erori JS: %d/%d%s" % (
            app, nev, len(d), same_st, len(a["erori"]), len(b["erori"]),
            "" if not d else "  " + "; ".join("%s: înainte %s, după %s" % (x[0], x[2], x[1]) for x in d)[:400]))
        if app != "windows" and (d or not same_st or a["erori"] or b["erori"]):
            dif += 1
    (AICI / "probe_iesiri" / "regres_ctrl_litera.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print("copii: " + json.dumps(info, ensure_ascii=False))
    print(dif)


if __name__ == "__main__":
    main()
