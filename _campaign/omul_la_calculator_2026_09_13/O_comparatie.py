"""Deschide cheia orbirii si aduna cele 4 judecati A/B intr-un tabel -> O_comparatie_AB.md"""
import json
from pathlib import Path

CAMP = Path(__file__).resolve().parent
cheie = json.loads((CAMP.parent / "omul_la_calculator_2026_09_13_CONTROL" / "O_cheie_orb.json").read_text(encoding="utf-8"))
CAMPURI = ["adevarate", "false", "neverificabile", "blocant", "important", "minor", "schimba_ora",
           "unice_adevarate", "unice_adevarate_importante_sau_blocante"]
tot = {"om_la_calculator": dict.fromkeys(CAMPURI, 0), "control_ai_obisnuit": dict.fromkeys(CAMPURI, 0)}
dovedit = {"om_la_calculator": [0, 0], "control_ai_obisnuit": [0, 0]}
randuri = []
for les, k in cheie.items():
    j = json.loads((CAMP / "O_orb" / les / "judecata.json").read_text(encoding="utf-8"))
    for lit in ("X", "Y"):
        src = k[lit]
        r = j["rezumat"][lit]
        for c in CAMPURI:
            try:
                tot[src][c] += int(r.get(c, 0) or 0)
            except (TypeError, ValueError):
                pass
        randuri.append((les, src, r))
    for p in j.get("probleme", []):
        dr = p.get("dovedita_de_raport") or {}
        for lit in ("X", "Y"):
            v = dr.get(lit)
            if v in ("dovedit", "afirmat"):
                dovedit[k[lit]][0 if v == "dovedit" else 1] += 1
    ratate = len(j.get("ce_au_ratat_amandoua") or [])
    randuri.append((les, "ratate_de_amandoua", {"n": ratate}))

md = ["# Comparația oarbă A/B — „om la calculator” vs „AI obișnuit” (4 lecții M1)\n",
      "Judecători: 4 subagenți independenți (unul pe lecție), orbi la sursă (etichete X/Y trase la sorți, indicii de sursă scoase), "
      "fiecare a verificat singur fiecare semnalare pe lecție (recalculare, browser, text brut Microsoft; unul a folosit și Word-ul instalat, invizibil).\n",
      "## Totaluri pe cele 4 lecții\n",
      "| Măsură | Om la calculator | AI obișnuit |", "|:--|--:|--:|"]
for c in CAMPURI:
    md.append(f"| {c.replace('_', ' ')} | {tot['om_la_calculator'][c]} | {tot['control_ai_obisnuit'][c]} |")
for s in tot:
    a = tot[s]["adevarate"]; f = tot[s]["false"]
    tot[s]["precizie"] = round(100 * a / max(a + f, 1), 1)
md.append(f"| **precizie** (adevărate / adevărate+false) | **{tot['om_la_calculator']['precizie']}%** | **{tot['control_ai_obisnuit']['precizie']}%** |")
md.append(f"| afirmații DOVEDITE / doar afirmate (după judecător) | {dovedit['om_la_calculator'][0]} / {dovedit['om_la_calculator'][1]} "
          f"| {dovedit['control_ai_obisnuit'][0]} / {dovedit['control_ai_obisnuit'][1]} |")
md.append("\n## Pe lecție\n")
md.append("| Lecția | Sursa | adevărate | false | schimbă ora | unice importante/blocante |")
md.append("|:--|:--|--:|--:|--:|--:|")
for les, src, r in randuri:
    if src == "ratate_de_amandoua":
        md.append(f"| {les} | *ratate de amândouă* | {r['n']} | | | |")
    else:
        md.append(f"| {les} | {src} | {r.get('adevarate')} | {r.get('false')} | {r.get('schimba_ora')} | {r.get('unice_adevarate_importante_sau_blocante')} |")
(CAMP / "O_comparatie_AB.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print("\n".join(md[4:18]))
