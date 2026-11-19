# -*- coding: utf-8 -*-
"""Critic r10: extrage din referinta inghetata doar cheile de care am nevoie (pe chei, nu tot fisierul)."""
import json, sys
D = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/"
j = json.load(open(D + "referinte/uia_excel.json", encoding="utf-8"))
s = j["suprafete"]
def plat(n, ad=0, out=None, maxad=4):
    if out is None: out = []
    if not isinstance(n, dict): return out
    out.append("  " * ad + "%s | %s | %s | %s" % (n.get("tip"), n.get("eticheta"), n.get("rect_css"), {k: v for k, v in n.items() if k not in ("tip", "eticheta", "rect_css", "copii", "rect_brut", "clasa")}))
    if ad < maxad:
        for x in n.get("copii", []) or []: plat(x, ad + 1, out, maxad)
    return out
cheie = sys.argv[1]
if cheie == "fapte":
    for k in sys.argv[2:]: print(k, json.dumps(j["acoperire_r7"]["fapte"].get(k), ensure_ascii=False, indent=0)[:3000])
elif cheie == "meta":
    print({k: j[k] for k in ("versiune", "versiune_com_build", "dpi_factor", "fereastra", "nota_rect")})
else:
    n = s[cheie]
    print("\n".join(plat(n, maxad=int(sys.argv[2]) if len(sys.argv) > 2 else 4)))
