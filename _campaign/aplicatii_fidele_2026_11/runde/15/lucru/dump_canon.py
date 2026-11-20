# -*- coding: utf-8 -*-
import sys, json
sys.dont_write_bytecode = True
D = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11"
sys.path.insert(0, D + "/oracole")
import structura_lib as SL
rs = SL.referinte_shell()["explorer"]
o = []
for k, c in rs.canon.items():
    o.append(f"\n===== {k} rect={c.get('rect')} <- {rs.surse.get(k)}  unitati={SL.nr_unitati(c)}")
    for g in c.get("grupuri") or []:
        o.append(f"  [grup {g.get('raw')!r} rect={g.get('rect')}]")
        for u in g.get("u") or []:
            o.append(f"     {u.get('tip'):10s} {u.get('raw')!r:45s} id={u.get('id')!r} r={u.get('rect')} {'GRI' if u.get('activ') is False else ''} {'ASCUNS' if u.get('ascuns') else ''} {'' if u.get('vizibil', True) else 'INVIZ'}")
open(D + "/runde/15/lucru/ref_explorer_canon.txt", "w", encoding="utf-8").write("\n".join(o))
print(len(o))
