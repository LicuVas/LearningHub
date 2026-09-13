"""Aduna cele 25 de evaluari (F_evaluari/*/*/log.json) intr-o masuratoare.

python N_agregare.py  ->  N_agregare.md + N_semnalari.csv

Raspunde, cu cifre: din ce verificare „umana" (U1..U17, anexa) vin semnalarile, pe ce rol, cat de grave,
cate NU le-ar fi prins un audit pe text (auto-declarat de evaluator - se valideaza separat la comparatia A/B),
si ce verificari au ramas NESIGURE (= intrebari pentru Vasile).
"""
import collections
import csv
import json
from pathlib import Path

CAMP = Path(__file__).resolve().parent
rows = []
nesigure = collections.Counter()
intrebari = []
timp = []
for log in sorted((CAMP / "F_evaluari").glob("*/*/log.json")):
    d = json.loads(log.read_text(encoding="utf-8"))
    cls, les = log.parent.parent.name, log.parent.name
    for cid, c in (d.get("checks") or {}).items():
        if c.get("status") != "FACUT":
            nesigure[cid] += 1
    for k, a in (d.get("anexa") or {}).items():
        if a.get("status") == "INTREBARE_VASILE":
            intrebari.append((cls, les, k, a.get("intrebare", "")))
    for f in d.get("findings") or []:
        rows.append({"clasa": cls, "lectia": les, "id": f.get("id"), "rol": f.get("rol"), "check": f.get("check"),
                     "gravitate": f.get("gravitate"), "necunoscut": f.get("depinde_de_necunoscut"),
                     "prindea_text": f.get("prindea_auditul_pe_text"), "ce": (f.get("ce_vede_omul") or "")[:200]})
    timp.append((cls, les, (d.get("timp_estimat_minute") or {}).get("verdict")))

with (CAMP / "N_semnalari.csv").open("w", encoding="utf-8", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()) if rows else ["clasa"])
    w.writeheader()
    w.writerows(rows)


def tab(counter, titlu):
    out = [f"| {titlu} | semnalări | blocant | important | minor | NU le prindea textul |", "|:--|--:|--:|--:|--:|--:|"]
    for key, n in counter.most_common():
        sub = [r for r in rows if r[titlu_camp[titlu]] == key]
        out.append(f"| {key} | {n} | {sum(r['gravitate']=='blocant' for r in sub)} | {sum(r['gravitate']=='important' for r in sub)} "
                   f"| {sum(r['gravitate']=='minor' for r in sub)} | {sum(r['prindea_text']=='nu' for r in sub)} |")
    return "\n".join(out)


titlu_camp = {"Verificarea": "check", "Rolul": "rol", "Clasa": "clasa"}
md = [f"# Agregarea evaluărilor „omul la calculator” — M1\n",
      f"Lecții evaluate: **{len(timp)}** · semnalări: **{len(rows)}** · "
      f"blocante: **{sum(r['gravitate']=='blocant' for r in rows)}** · "
      f"„un audit pe text NU le-ar fi prins” (declarat de evaluator): **{sum(r['prindea_text']=='nu' for r in rows)}** "
      f"({100*sum(r['prindea_text']=='nu' for r in rows)//max(len(rows),1)}%) · "
      f"depind de un fapt necunoscut despre sală: **{sum(bool(r['necunoscut']) for r in rows)}**\n",
      "> Coloana „NU le prindea textul” e **auto-declarată** de evaluator. Validarea independentă e comparația A/B (`O_comparatie_AB.md`).\n",
      "## Pe clase", tab(collections.Counter(r["clasa"] for r in rows), "Clasa"),
      "\n## Pe verificare (de unde vin semnalările)", tab(collections.Counter(r["check"] for r in rows), "Verificarea"),
      "\n## Pe rol", tab(collections.Counter(r["rol"] for r in rows), "Rolul"),
      "\n## Timpul (calculat de poartă)",
      f"Nu încape în 50 de minute: **{sum(v=='nu incape' for _,_,v in timp)} din {len(timp)}** lecții.",
      "\n## Verificări rămase nesigure (nu se pot face fără sala reală)",
      ", ".join(f"{k}: {n}" for k, n in nesigure.most_common()) or "—",
      f"\n## Întrebări pentru Vasile (din anexe): {len(intrebari)}",
      "Grupate pe temă (prima formulare găsită):"]
seen = {}
for cls, les, k, q in intrebari:
    seen.setdefault(k, (cls, les, q))
for k, (cls, les, q) in seen.items():
    md.append(f"- **{k}** ({sum(1 for x in intrebari if x[2]==k)} lecții) — ex. {cls}/{les}: {q[:220]}")
(CAMP / "N_agregare.md").write_text("\n".join(md) + "\n", encoding="utf-8")
print("\n".join(md[:3]))
