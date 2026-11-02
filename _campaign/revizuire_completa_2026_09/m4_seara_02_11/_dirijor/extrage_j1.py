"""Extrage constatarile J1 (opus + sonnet) pe o lectie, intr-un fisier text compact pentru registru."""
import json, sys

lectie = sys.argv[1]  # ex: m4-l28
baza = rf"C:\00\Projects\LearningHub\lectii\v\{lectie}\_verificare"
iesire = rf"C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\m4_seara_02_11\_dirijor\j1_{lectie}.txt"

CHEI_TEXT = ("titlu", "problema", "ce", "descriere", "constatare", "text", "rezumat")
CHEI_REP = ("reparatie", "reparația", "reparatia", "fix", "propunere", "cum_repari")


def scurt(v, n=420):
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    s = " ".join(s.split())
    return s if len(s) <= n else s[:n] + "…"


rows = []
for cine, f in (("O", baza + r"\judecator1.json"), ("S", baza + r"\ab_sonnet\judecator1.json")):
    d = json.load(open(f, encoding="utf-8"))
    rows.append(f"### {cine} = {d.get('judecator')} · grav {d.get('grav')} / major {d.get('major')} / minor {d.get('minor')}")
    for p in d.get("probleme", []):
        if not isinstance(p, dict):
            rows.append(f"- {cine}? {scurt(p)}")
            continue
        pid = p.get("id", "?")
        grav = p.get("gravitate", p.get("grav", p.get("nivel", "?")))
        txt = next((p[k] for k in CHEI_TEXT if k in p), None)
        rep = next((p[k] for k in CHEI_REP if k in p), None)
        unde = p.get("unde", p.get("loc", p.get("pas", "")))
        rows.append(f"- {cine}-{pid} [{grav}] ({scurt(unde, 60)}) {scurt(txt) if txt else scurt({k: v for k, v in p.items() if k not in ('id',)}, 500)}")
        if rep:
            rows.append(f"    REP: {scurt(rep, 380)}")
open(iesire, "w", encoding="utf-8").write("\n".join(rows) + "\n")
print(iesire, len(rows))
