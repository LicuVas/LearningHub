# -*- coding: utf-8 -*-
"""O1 — oracol_central.py (R1 „Un singur loc”). Etapa 0, 16.11.2026.

Numără PAGINILE care desenează interfață de aplicație (Windows, File Explorer, Word, Excel, PowerPoint, Paint) în afara
bibliotecii centrale aplicatii/. O pagină se numără dacă are cel puțin un motiv:
  STATIC (citit din HTML, pe toate paginile lectii/*/*/index.html și jocuri/*/index.html):
    - încarcă un simulator vechi din perimetru (lectii/_sim/{desktop-windows,siguranta-pc,explorer-*,wordobj*,wordfisier,
      wordteh-*,excelx*,registru-foi,simppt*,paint*}.js, jocuri/_motor/{ui-panglica,panglica-*,tip-excel,tip-foaie}.js);
    - își definește simulatorul în pagină (TipWordObiecte, SimPPT, ExcelPlus, JocPPT, JocFormatare, TIP_EXPLORER …);
    - desenează panglica veche sau își construiește fereastra din scriptul paginii;
    - scrie singură atributul data-lh-aplicatie (în HTML sau în script) ori își definește biblioteca / registrul
      rădăcinilor (LH.aplicatii =, LHAplicatii =, radacini) — reparația 8: rădăcina o pune doar biblioteca;
  DOM (randat, doar paginile din inventar.json, la fiecare exercițiu simulat): elemente de interfață de aplicație care NU
    sunt sub o rădăcină [data-lh-aplicatie] ÎNREGISTRATĂ de bibliotecă (LH.aplicatii.radacini(), cu aplicatii/aplicatii.js
    încărcat) — roluri ARIA de aplicație, panglica veche, canvas, orice control interactiv din #body și orice
    [data-lh-aplicatie] neînregistrat (CONVENTIE_ARBORE.md §1, §6); o pagină din inventar care nu se poate randa deloc
    se numără (nu se poate dovedi că e curată).
Gata (R1) = 0. Azi biblioteca nu există, deci toate paginile din perimetru se numără.
Ultima linie: numărul de pagini. Detalii: <iesiri>/oracol_central.json (calea e tipărită mai sus)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import structura_lib as L


def masoara():
    inv_pag = [p["pagina"] for p in L.pagini_inventar()]
    toate = sorted(set(L.pagini_site()) | set(inv_pag))
    statice = {p: L.analiza_statica(p) for p in toate}
    c = L.randare()
    dom = {}
    for p in inv_pag:
        r = c["pagini"].get(p)
        if not (L.radacina() / p).exists():
            continue
        if not r or not r.get("instante"):
            dom[p] = ["pagina nu s-a putut randa: " + "; ".join((r or {}).get("erori", ["lipsește din randare"])[:2])]
            continue
        n = max(i["ui"]["n"] for i in r["instante"])
        if n > 0:
            m = []
            for i in r["instante"]:
                for x in i["ui"]["mostre"]:
                    if x not in m:
                        m.append(x)
            dom[p] = [f"{n} elemente de interfață de aplicație în afara [data-lh-aplicatie], ex.: " + "; ".join(m[:4])]
    pagini = {}
    for p in toate:
        mot = list(statice.get(p) or []) + list(dom.get(p) or [])
        if mot:
            pagini[p] = {"static": statice.get(p) or [], "dom": dom.get(p) or [], "in_inventar": p in inv_pag}
    n = len(pagini)
    det = {"definitie": __doc__.split("\n\n", 1)[1], "pagini_scanate": len(toate), "pagini_inventar": len(inv_pag),
           "biblioteca_exista": L.biblioteca_exista(), "pagini_cu_interfata_in_afara": pagini,
           "cu_motiv_static": sum(1 for v in pagini.values() if v["static"]),
           "cu_motiv_dom": sum(1 for v in pagini.values() if v["dom"]),
           "in_afara_inventarului": sorted(p for p, v in pagini.items() if not v["in_inventar"]),
           "randare": {"generat": c.get("generat"), "secunde": c.get("secunde")}}
    linii = [f"pagini scanate: {len(toate)} (din inventar: {len(inv_pag)}); biblioteca aplicatii/: "
             f"{'da' if det['biblioteca_exista'] else 'nu'}",
             f"pagini cu interfață în afara bibliotecii: {n} (static: {det['cu_motiv_static']}, DOM: {det['cu_motiv_dom']}, "
             f"în afara inventarului: {len(det['in_afara_inventarului'])})"]
    return n, det, linii


if __name__ == "__main__":
    L.ruleaza("oracol_central", masoara)
