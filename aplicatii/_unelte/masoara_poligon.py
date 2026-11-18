# -*- coding: utf-8 -*-
"""Diagnostic de interfață pe pagina-poligon: cât ar număra O3 (oracol_ui.py) pentru o aplicație a bibliotecii, dacă o
lecție ar desena-o exact ca poligonul. NU e un oracol și nu ține locul lui O3 (O3 măsoară lecțiile din inventar.json):
folosește DOAR codul înghețat al oracolelor (oracole/arbore_randat.js, structura_lib.py: aceeași extragere, aceleași
gesturi — file, File/Backstage, dialogurile prin lansatorul din referință, meniurile de clic dreapta, plasa
deschideSuprafata — și aceeași comparație cu referința reală, cu punctele din oracol_ui.puncte).

    python C:/00/Projects/LearningHub_fidel/aplicatii/_unelte/masoara_poligon.py [--aplicatie word] [--radacina <sit>]
                                                                              [--iesire <dosar>] [--latime 1366]
Ultima linie = punctele totale (ca O3, doar pentru aplicația cerută); penultima = calea JSON-ului cu detalii.
Rețeaua: server pe ("127.0.0.1", 0); tot ce nu e 127.0.0.1/localhost se abandonează (regula 24).
"""
import argparse
import json
import os
import sys
import tempfile
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
WT = AICI.parents[1]
D = WT / "_campaign" / "aplicatii_fidele_2026_11"
if not D.exists():
    WT = Path("C:/00/Projects/LearningHub_fidel")
    D = WT / "_campaign" / "aplicatii_fidele_2026_11"
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL          # noqa: E402  (doar citit: codul înghețat al oracolelor)
import oracol_ui as OUI             # noqa: E402


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--aplicatie", default="word")
    ap.add_argument("--radacina", default=str(WT))
    ap.add_argument("--iesire", default=str(Path(tempfile.gettempdir()) / "lh_masoara_poligon"))
    ap.add_argument("--latime", type=int, default=1366)
    a = ap.parse_args()
    app = a.aplicatie
    R = Path(a.radacina).resolve()
    out = Path(a.iesire)
    out.mkdir(parents=True, exist_ok=True)
    ref = SL.referinte()[app]
    js = SL.JS_EXTRACTOR.read_text(encoding="utf-8")
    srv, base = SL.porneste_server(R)
    from playwright.sync_api import sync_playwright
    rez = {"erori": []}
    with sync_playwright() as p:
        try:
            br = p.chromium.launch(channel="chrome")
        except Exception:
            br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": a.latime, "height": 768})
        SL.blocheaza_externe(ctx)
        pg = ctx.new_page()
        erori_js = []
        pg.on("pageerror", lambda e: erori_js.append(str(e)))

        def mergi(_nav=None):
            pg.goto(base + "aplicatii/poligon.html", wait_until="load")
            pg.evaluate("a => LH.aplicatii.deschide(a, {focus: true})", app)
            pg.wait_for_timeout(250)
            pg.evaluate(js)

        def extrage(o):
            return pg.evaluate("o => __LHO.extrage(o)", o)
        mergi()
        o = {"app": app, "refTabs": ref.file_brut}
        ex = extrage(o)
        sup = dict(ex["suprafete"])
        for t in pg.evaluate("o => __LHO.file(o)", o):
            SL._apasa_fila(pg, js, o, t["i"])
            for k, v in extrage(o)["suprafete"].items():
                if k.startswith("panglica"):
                    sup.setdefault(k, v)
        inst = {"id": "poligon", "nav": None, "tip": "poligon"}
        SL._deschide_restul(pg, js, inst, o, ref, sup, rez, mergi, extrage)
        rez["erori_js"] = erori_js[:5]
        rez["mod"] = ex["mod"]
        br.close()
    srv.shutdown()
    canon = SL._canon_inst(app, sup)
    total, pe_sup, pe_fel = 0, {}, Counter()
    for k, refc in ref.canon.items():
        if k in canon:
            d = set(SL.chei_diferente(k, SL.compara(k, refc, canon[k], detaliat=True)))
        else:
            d = set(SL.chei_diferente(k, SL.compara(k, refc, None)))
        for x in d:
            pe_fel[x.split("|")[2]] += 1
        pct, ncmd = OUI.puncte(d)
        pe_sup[k] = {"puncte": pct, "desenata": k in canon, "unitati_referinta": SL.nr_unitati(refc), "mostre": sorted(d)[:40]}
        total += pct
    det = {"aplicatie": app, "latime": a.latime, "total": total, "pe_fel": dict(pe_fel.most_common()),
           "pe_suprafata": dict(sorted(pe_sup.items(), key=lambda kv: -kv[1]["puncte"])), "erori": rez["erori"][:20],
           "erori_js": rez.get("erori_js"), "mod": rez.get("mod"), "suprafete_in_plus": sorted(set(canon) - set(ref.canon))}
    f = out / f"poligon_{app}.json"
    f.write_text(json.dumps(det, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, v in list(det["pe_suprafata"].items())[:15]:
        print(f"  {v['puncte']:5d}  {k}{'' if v['desenata'] else '  (nedesenată)'}")
    print("pe fel:", ", ".join(f"{k}={v}" for k, v in pe_fel.most_common(10)))
    print("erori:", len(rez["erori"]), "; erori JS:", len(rez.get("erori_js") or []))
    print(f)
    print(total)


if __name__ == "__main__":
    main()
