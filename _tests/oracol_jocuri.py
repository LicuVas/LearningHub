"""Oracolul JOCURILOR pe pași (26.09.2026), pentru /bucla: numără problemele MECANIC, repede (~2-3 min).

  A. fiecare joc de învățare (nu antrenament, nu recapitulare, nu jocurile vechi fără motor):
       - nivelurile fără `pasi` (neconvertite la „de la novice la expert”)          -> 1 / nivel
       - verificările STATICE ale porții test_joc.py (structură, „nepredat în verificare”, diacritice…) -> 1 / FAIL
  B. proba_sertare.py (lista „Cine lucrează acum?” + progresul pe alt calculator), nor simulat
Poarta completă (joacă fiecare exercițiu pe 2 telefoane, test_joc.py --toate) e lentă și se rulează la final.
Ultimele trei rânduri sunt pline; ultimul e DOAR numărul total.
"""
import re
import subprocess
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

R = Path(__file__).resolve().parents[1]
J = R / "jocuri"
sys.path.insert(0, str(J / "_motor"))
import test_joc  # noqa: E402

total, linii = 0, []
jocuri = sorted(d.name for d in J.iterdir() if (d / "index.html").exists() and not d.name.startswith("_")
                and "_motor/motor.js" in (d / "index.html").read_text(encoding="utf-8", errors="replace"))
from playwright.sync_api import sync_playwright  # noqa: E402
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for slug in jocuri:
        f = J / slug / "index.html"
        html = f.read_text(encoding="utf-8")
        try:
            pg.goto(f.as_uri(), timeout=30000)
            pg.wait_for_function("window.JocMotor&&JocMotor.test.config()", timeout=15000)
            cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
            cfg["_ext"] = pg.evaluate("JocMotor.test.tipuri?JocMotor.test.tipuri():[]")
        except Exception as e:
            linii.append(f"{slug}: nu s-a încărcat ({str(e).splitlines()[0][:80]})"); total += 1; continue
        if cfg.get("mod") == "antrenament" or cfg.get("recapitulare"):
            continue
        for lv in cfg.get("nivele", []):
            if "bazin" in lv:
                lv["qs"] = lv["bazin"]
        fails, warns = [], []
        test_joc.static_checks(slug, cfg, html, fails, warns)
        fara = sum(1 for lv in cfg.get("nivele", []) if not lv.get("pasi"))
        n = len(fails) + fara
        total += n
        if n:
            linii.append(f"{slug}: {fara} niveluri fără pași, {len(fails)} FAIL static" + (f" — {fails[0][:90]}" if fails else ""))
    b.close()
for l in linii[:40]:
    print("  " + l)
try:
    pr = subprocess.run([sys.executable, str(J / "_motor" / "proba_sertare.py")], capture_output=True, timeout=600,
                        encoding="utf-8", errors="replace")
    rand = [x for x in (pr.stdout or "").strip().splitlines() if x.strip()]
    n = int(rand[-1]) if rand and re.fullmatch(r"-?\d+", rand[-1].strip()) else 1
except Exception:
    n = 1
print(f"B proba_sertare: {n}")
total += n
print(f"A jocuri de invatare verificate: {len(jocuri)}")
print(f"TOTAL probleme: {total}")
print(total)
