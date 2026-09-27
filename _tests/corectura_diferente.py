"""corectura_diferente.py — pentru fiecare exercițiu cu text de corectat (start → tinta), ce cuvinte se schimbă (27.09.2026).

De ce: în word-vii N2 ținta era „la muzeu de istorie” (neartculat, nefiresc), deci elevul care scria firesc „muzeul”
primea „greșit”. Aici se listează perechile cuvânt-start → cuvânt-țintă pentru TOATE exercițiile cu `start`+`tinta`
din jocuri, ca să fie citite de un om/agent, și se numără mecanic:
  - cuvinte din enunț („…” între ghilimele) care NU apar în textul de start (enunțul promite o greșeală care nu e acolo);
  - ținte în care un cuvânt corectat nu apare nicăieri în restul enunțului/indiciului (semnal, nu numărat).
Ultima linie: numărul de probleme numărate.
"""
import difflib
import json
import re
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass
RAD = Path(__file__).resolve().parents[1]
J = RAD / "jocuri"

from playwright.sync_api import sync_playwright  # noqa: E402


def exercitii(o, cale=""):
    if isinstance(o, dict):
        if isinstance(o.get("start"), str) and isinstance(o.get("tinta"), str):
            yield cale, o
        for k, v in o.items():
            yield from exercitii(v, f"{cale}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from exercitii(v, f"{cale}[{i}]")


probleme = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for d in sorted(J.iterdir()):
        f = d / "index.html"
        if not f.exists() or "_motor/motor.js" not in f.read_text(encoding="utf-8", errors="replace"):
            continue
        pg.goto(f.as_uri(), timeout=30000)
        try:
            cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        except Exception:  # noqa: BLE001
            continue
        for cale, e in exercitii(cfg.get("nivele")):
            a, t = e["start"].split(), e["tinta"].split()
            sm = difflib.SequenceMatcher(a=a, b=t)
            sch = [(" ".join(a[i1:i2]), " ".join(t[j1:j2])) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
            q = re.sub(r"<[^>]+>", " ", str(e.get("q", "")))
            citate = re.findall(r"„([^”]+)”", q)
            # un cuvânt citat trebuie să fie ori greșeala din start, ori rezultatul din țintă („ca să obții „Vineri””)
            lipsa = [c for c in citate if c not in e["start"] and c not in e["tinta"] and len(c.split()) <= 3]
            print(f"{d.name} {cale[:40]}: {sch}")
            print(f"     enunț: {q[:160]}")
            if lipsa:
                probleme += len(lipsa)
                print(f"  PROBLEMĂ enunțul citează {lipsa}, dar textul de start nu le conține")
    b.close()
print("----")
print(probleme)
