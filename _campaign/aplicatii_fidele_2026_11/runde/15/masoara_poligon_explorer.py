# -*- coding: utf-8 -*-
"""Runda 15 — diagnostic de interfață pentru File Explorer pe pagina-poligon: cât ar număra O3 pe suprafețele `explorer.*`
dacă o lecție ar desena Explorer exact ca poligonul. NU e oracol (O3 măsoară lecțiile din inventar.json, care în etapa B
nu încarcă biblioteca). Folosește DOAR codul înghețat (oracole/arbore_randat.js, structura_lib.py: aceeași extragere,
plasa deschideSuprafata prin _deschide_shell, aceeași comparație cu referinte_shell(), punctele din oracol_ui.puncte),
ca aplicatii/_unelte/masoara_poligon.py la Office. Rețeaua: server pe ("127.0.0.1", 0), tot ce nu e local se abandonează.
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/15/masoara_poligon_explorer.py [--latime 1366]
Ultima linie = punctele totale; penultima = calea JSON-ului cu detalii (runde/15/probe_iesiri/poligon_explorer.json).
"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
sys.stdout.reconfigure(encoding="utf-8")
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
WT = D.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL   # noqa: E402  (doar citit)
import oracol_ui as OUI      # noqa: E402

# conținutul de probă = cel din poligon.html › P.explorer (un folder de clasa a V-a)
CONTINUT = {"folder": "Clasa a V-a", "arbore": ["Desene/", "Proiect/", "Proiect/plan.txt", "harta.png", "notite.txt", "tema.docx"],
            "foldere_alaturate": [{"folder": "Teme", "arbore": ["compunere.docx"]}]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--latime", type=int, default=1366)
    a = ap.parse_args()
    app = "explorer"
    ref_o, rs = SL.referinte()[app], SL.referinte_shell()[app]
    js = SL.JS_EXTRACTOR.read_text(encoding="utf-8")
    srv, base = SL.porneste_server(WT)
    from playwright.sync_api import sync_playwright
    rez = {"erori": []}
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": a.latime, "height": 768})
        SL.blocheaza_externe(ctx)
        pg = ctx.new_page()
        erori_js = []
        pg.on("pageerror", lambda e: erori_js.append(str(e)))

        def mergi(_nav=None):
            pg.goto(base + "aplicatii/poligon.html", wait_until="load")
            pg.evaluate("c => LH.aplicatii.deschide('explorer', {continut: c, focus: true})", CONTINUT)
            pg.wait_for_timeout(300)
            pg.evaluate(js)

        def extrage(o):
            return pg.evaluate("o => __LHO.extrage(o)", o)
        mergi()
        o = {"app": app, "refTabs": ref_o.file_brut}
        ex = extrage(o)
        sup = dict(ex["suprafete"])
        inst = {"id": "poligon", "nav": None, "tip": "poligon", "aplicatie": app}
        plasa = SL._deschide_shell(pg, js, inst, o, sup, rez, mergi, extrage)
        rez["erori_js"] = erori_js[:5]
        br.close()
    srv.shutdown()
    canon = SL._canon_inst(app, sup)
    total, pe_sup, pe_fel = 0, {}, Counter()
    for k, refc in rs.canon.items():
        d = set(SL.chei_diferente(k, SL.compara(k, refc, canon.get(k), detaliat=True) if k in canon else SL.compara(k, refc, None)))
        for x in d:
            pe_fel[x.split("|")[2]] += 1
        pct, ncmd = OUI.puncte(d)
        pe_sup[k] = {"puncte": pct, "desenata": k in canon, "unitati_referinta": SL.nr_unitati(refc), "mostre": sorted(d)[:40]}
        total += pct
    det = {"aplicatie": app, "latime": a.latime, "plasa": plasa, "total": total, "pe_fel": dict(pe_fel.most_common()),
           "pe_suprafata": dict(sorted(pe_sup.items(), key=lambda kv: -kv[1]["puncte"])), "erori": rez["erori"][:20],
           "erori_js": rez.get("erori_js"), "suprafete_in_plus": sorted(set(canon) - set(rs.canon))}
    f = AICI / "probe_iesiri" / "poligon_explorer.json"
    f.write_text(json.dumps(det, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, v in det["pe_suprafata"].items():
        print(f"  {v['puncte']:5d}  {k}{'' if v['desenata'] else '  (nedesenată)'}  / {v['unitati_referinta']} comenzi în referință")
    print("pe fel:", ", ".join(f"{k}={v}" for k, v in pe_fel.most_common(10)))
    print("erori:", len(rez["erori"]), "; erori JS:", len(rez.get("erori_js") or []))
    print(f)
    print(total)


if __name__ == "__main__":
    main()
