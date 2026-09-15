"""Scurgerea răspunsului prin lungime (choice): varianta corectă > 1,5 × cea mai lungă greșită și ≥ 15 caractere diferență.
Listează cazurile din toate jocurile pe motor, cu variantele, ca să poată fi reechilibrate."""
import json
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

J = Path(r"C:\00\Projects\LearningHub\jocuri")
strip = lambda s: re.sub(r"<[^>]+>", "", s or "")
out = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    for d in sorted(x for x in J.iterdir() if x.is_dir() and not x.name.startswith("_") and (x / "index.html").exists()):
        if "_motor/motor.js" not in (d / "index.html").read_text(encoding="utf-8"):
            continue
        pg.goto((d / "index.html").as_uri()); pg.wait_for_timeout(250)
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        for li, lv in enumerate(cfg["nivele"], 1):
            for qi, q in enumerate((lv.get("qs") or []) + (lv.get("bazin") or []), 1):
                if q.get("t") != "choice" or len(q.get("o", [])) < 3:
                    continue
                lens = [len(strip(x)) for x in q["o"]]
                c = lens[q["ok"]]; m = max(l for k, l in enumerate(lens) if k != q["ok"])
                if c > 1.5 * m and c - m >= 15:
                    out.append({"joc": d.name, "loc": f"N{li}Î{qi}", "q": strip(q["q"]), "o": q["o"], "ok": q["ok"]})
    b.close()
print(len(out), "cazuri")
for x in out:
    print(f'\n{x["joc"]} {x["loc"]}: {x["q"]}')
    for k, o in enumerate(x["o"]):
        print(f'   {"✔" if k == x["ok"] else " "} {o}')
