# -*- coding: utf-8 -*-
"""Runda 15: turtește referința Explorer (doar citire) în text, pentru citit pe bucăți."""
import json, sys
from pathlib import Path
D = Path("C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11")
sys.path.insert(0, str(D / "oracole"))
sys.dont_write_bytecode = True
r = json.loads((D / "referinte" / "uia_explorer.json").read_text(encoding="utf-8"))
out = []
out.append("CHEI TOP: " + ", ".join(r.keys()))
S = r.get("suprafete") or {}
for cap, v in S.items():
    out.append(f"\n===== {cap}: chei {list(v.keys()) if isinstance(v, dict) else type(v)}")
    if isinstance(v, dict):
        for k2, v2 in v.items():
            if k2 != "ferestre":
                out.append(f"  {k2}: {json.dumps(v2, ensure_ascii=False)[:600]}")
        for fi, f in enumerate(v.get("ferestre") or []):
            out.append(f"  -- fereastra {fi}: " + json.dumps({k: f[k] for k in f if k != 'arbore'}, ensure_ascii=False)[:400])
            def umbla(n, ad):
                rc = n.get("rect") or n.get("rect_css")
                out.append("    " + "  " * ad + f"{n.get('tip')} | {n.get('nume')!r} | id={n.get('id')!r} | cls={n.get('clasa')!r} | rect={rc} " + ("OFF" if n.get('in_afara_ecranului') else "") + (" act=0" if n.get('activ') is False else "") + " " + json.dumps({k: n[k] for k in n if k not in ('tip','nume','id','clasa','rect','rect_css','copii','in_afara_ecranului','activ')}, ensure_ascii=False)[:200])
                for c in n.get("copii") or []:
                    umbla(c, ad + 1)
            if f.get("arbore"):
                umbla(f["arbore"], 0)
(D / "runde/15/lucru/ref_explorer_brut.txt").write_text("\n".join(out), encoding="utf-8")
import structura_lib as SL
rs = SL.referinte_shell()["explorer"]
o2 = []
for k, c in rs.canon.items():
    o2.append(f"\n===== {k}  <- {rs.surse.get(k)}")
    def u(n, ad):
        o2.append("  " * ad + f"{n.get('tip')} | {n.get('eticheta')!r} | id={n.get('id_mso')!r} | r={n.get('rect_css')} " + ("ASCUNS" if n.get('ascuns') else "") + ("" if n.get('vizibil', True) else " INVIZ") + (" gri" if n.get('activ') is False else ""))
        for x in n.get("copii") or []:
            u(x, ad + 1)
    u(c, 0)
o2.append("\nnecomparate: " + json.dumps(rs.necomparate, ensure_ascii=False))
o2.append("taieturi negasite: " + json.dumps(rs.taieturi_negasite, ensure_ascii=False))
(D / "runde/15/lucru/ref_explorer_canon.txt").write_text("\n".join(o2), encoding="utf-8")
print("ok")
