"""Aduna punctajele hibridului v3 (P_hibrid/*/punctaj.json) -> P_rezultat_hibrid.md

Recall PONDERAT pe numarul de probleme (nu media fractiilor): se reconstituie numaratorul din fractie x numitor,
unde numitorii (total / importante+blocante / schimba ora) se numara din lista `potriviri`.
"""
import json
from pathlib import Path

CAMP = Path(__file__).resolve().parent
SURSE = {"hibrid": ["hibrid"], "v2": ["v2", "v2_Y", "v2_X"], "control": ["control", "control_X", "control_Y"]}
agg = {s: {"total": 0.0, "imp": 0.0, "ora": 0.0} for s in SURSE}
den = {"total": 0, "imp": 0, "ora": 0}
false_h = noi_h = 0
rows = []
for f in sorted((CAMP / "P_hibrid").glob("*/punctaj.json")):
    p = json.loads(f.read_text(encoding="utf-8"))
    pot = p.get("potriviri") or []
    n_tot = len(pot)
    n_imp = sum(1 for x in pot if str(x.get("gravitate", "")).lower() in ("important", "blocant"))
    n_ora = sum(1 for x in pot if str(x.get("schimba_ora", "")).lower() in ("da", "true"))
    den["total"] += n_tot; den["imp"] += n_imp; den["ora"] += n_ora
    rec = p.get("recall") or {}
    linie = [f.parent.name, n_tot, n_imp, n_ora]
    for s, keys in SURSE.items():
        r = next((rec[k] for k in keys if k in rec), {})
        t, i, o = float(r.get("total", 0) or 0), float(r.get("imp_blocant", 0) or 0), float(r.get("schimba_ora", 0) or 0)
        agg[s]["total"] += t * n_tot; agg[s]["imp"] += i * n_imp; agg[s]["ora"] += o * n_ora
        linie.append(f"{t:.2f} / {i:.2f} / {o:.2f}")
    false_h += int(p.get("hibrid_false", 0) or 0); noi_h += int(p.get("hibrid_adevarate_noi", 0) or 0)
    rows.append(linie)

def pct(s, k):
    return f"{100 * agg[s][k] / max(den[k], 1):.0f}%"

md = ["# Hibridul v3 punctat pe adevărul judecătorilor (4 lecții)\n",
      f"Adevăr de referință: {den['total']} probleme reale (verificate de judecători), dintre care {den['imp']} importante/blocante și {den['ora']} care schimbă ora.\n",
      "| Cât din adevăr prinde (ponderat) | Toate | Importante + blocante | Care schimbă ora | False |",
      "|:--|--:|--:|--:|--:|",
      f"| **Hibrid v3** (citesc tot, apoi fac) | {pct('hibrid','total')} | **{pct('hibrid','imp')}** | **{pct('hibrid','ora')}** | {false_h} (+{noi_h} adevărate noi) |",
      f"| Om la calculator v2 (doar fac) | {pct('v2','total')} | {pct('v2','imp')} | {pct('v2','ora')} | 0 |",
      f"| AI obișnuit (doar citesc) | {pct('control','total')} | {pct('control','imp')} | {pct('control','ora')} | 4 |",
      "\n> Falsele pentru v2 și control vin din judecăți (`O_comparatie_AB.md`); pentru hibrid, din punctatori. Punctatorii NU erau orbi (știau care e hibridul) — risc de părtinire declarat.\n",
      "## Pe lecție (total / importante / schimbă ora)\n",
      "| Lecția | adevăr | imp | ora | hibrid | v2 | control |", "|:--|--:|--:|--:|:--|:--|:--|"]
for r in rows:
    md.append("| " + " | ".join(str(x) for x in r) + " |")
(CAMP / "P_rezultat_hibrid.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print("\n".join(md[:8]))
print("\n".join(md[10:]))
