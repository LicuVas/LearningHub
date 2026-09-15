"""Toate întrebările existente ale unei unități (din toate jocurile ei), ca un joc nou să NU le repete.

    python jocuri/_motor/intrebari_unitate.py VII-U1 > intrebari.json
    python jocuri/_motor/intrebari_unitate.py VII-U1 --verifica jocuri/word-antrenament-vii/index.html

Cu --verifica: compară enunțurile jocului dat cu cele existente (asemănare pe cuvinte de conținut, fără formulele
de enunț de tipul „Leagă… de ce face”, „Pune pașii în ordine”) și listează perechile prea apropiate (prag 0,40).
"""
import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

JOCURI = Path(__file__).resolve().parents[1]
FORMULE = ["leagă", "fiecare", "de ce face", "pune pașii în ordine", "care variantă", "ce faci", "apasă pe", "adevărat sau fals",
           "în ce ordine", "alege", "care dintre", "ce este", "ce înseamnă"]
STOP = set("și sau un o în la pe cu de din ce care să nu e este sunt al ai ale lui ei a le mai cel cea dacă când că fi ca iar prin pentru după".split())


def cuvinte(text):
    t = re.sub(r"<[^>]+>", " ", text or "").lower()
    for f in FORMULE:
        t = t.replace(f, " ")
    return {w for w in re.findall(r"[a-zăâîșț0-9]+", t) if len(w) > 2 and w not in STOP}


def intrebari_din_pagina(pg, page):
    pg.goto(page.as_uri()); pg.wait_for_timeout(300)
    src = page.read_text(encoding="utf-8")
    if "_motor/motor.js" in src:
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        unit = cfg.get("unitate")
        levels = cfg.get("nivele", [])
    else:  # joc vechi: nivelurile sunt în const LEVELS
        # LEVELS e local într-o funcție, nu global: se citește literalul din sursă și se evaluează separat
        m_lv = re.search(r"const LEVELS=(\[.*?\n\]);", src, re.S)
        levels = pg.evaluate("src=>JSON.parse(JSON.stringify((0,eval)('('+src+')'),(k,v)=>typeof v==='function'?'[fn]':v))", m_lv.group(1)) if m_lv else []
        side = page.parent / "acoperire.json"
        unit = None
        m = re.search(r"#clasa-([IVX]+)", src)
        if side.exists() and m:
            unit = {"VII": "VII-U1"}.get(m.group(1))  # singurul joc vechi azi: word-vii
    out = []
    for li, lv in enumerate(levels, 1):
        for q in (lv.get("qs") or []) + (lv.get("bazin") or []):
            ans = q.get("o", [None])[q["ok"]] if q.get("t") == "choice" and isinstance(q.get("ok"), int) and q.get("o") else q.get("ok")
            out.append({"joc": page.parent.name, "nivel": li, "tip": q.get("t"), "q": re.sub(r"<[^>]+>", "", q.get("q", "")), "raspuns": ans})
    return unit, out


def main():
    unit = sys.argv[1]
    verif = sys.argv[sys.argv.index("--verifica") + 1] if "--verifica" in sys.argv else None
    toate, noi = [], []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        for d in sorted(x for x in JOCURI.iterdir() if x.is_dir() and not x.name.startswith("_") and (x / "index.html").exists()):
            if verif and (d / "index.html").resolve() == Path(verif).resolve():
                _, noi = intrebari_din_pagina(pg, d / "index.html")
                continue
            u, qs = intrebari_din_pagina(pg, d / "index.html")
            if u == unit:
                toate += qs
        b.close()
    if not verif:
        print(json.dumps(toate, ensure_ascii=False, indent=1))
        return
    perechi = []
    for n in noi:
        wn = cuvinte(n["q"])
        for e in toate:
            we = cuvinte(e["q"])
            if wn and we:
                s = len(wn & we) / len(wn | we)
                if s >= 0.40:
                    perechi.append((round(s, 2), n["q"][:90], f'{e["joc"]} N{e["nivel"]}: {e["q"][:90]}'))
    print(f"existente în {unit}: {len(toate)} · în jocul verificat: {len(noi)} · perechi prea apropiate (≥0,40): {len(perechi)}")
    for s, a, b2 in sorted(perechi, reverse=True)[:30]:
        print(f"  {s} | NOU: {a}\n        | EXISTĂ: {b2}")
    sys.exit(1 if perechi else 0)


if __name__ == "__main__":
    main()
