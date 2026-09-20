"""Oracolul ilustrațiilor (README §6b): câte lucruri din lecțiile-joc NU sunt încă arătate cu imagini corecte.

    python jocuri/_motor/ilustratii.py            # detalii + pe ULTIMA linie un singur număr (totalul problemelor)
    python jocuri/_motor/ilustratii.py --json     # lista completă, pentru agenți

Numără (fiecare = 1 problemă):
  NEILUSTRAT  nivel cu pagină de citit (joc de învățare) fără nicio <img> în `text` și fără renunțare motivată
              (`ilustratie:'fără imagine: <motiv de cel puțin 25 de caractere>'` pe nivel)
  RUPTA       <img> din text/întrebări/explicații al cărei fișier nu există
  CALE        src care nu are forma ../<slug>/img/<fișier> (altfel se rupe în recapitulare, care preia întrebările)
  ALT         <img> fără alt sau cu alt sub 12 caractere
  MARE        fișier imagine peste 200 KB
  SURSA       imagine fără rând în <folder>/SURSE.json (scris de captura.py)
  EXTERNA     imagine de pe alt site (http/https/data:)
Recapitulările (generate) și antrenamentele (fără pagini de citit) nu intră la NEILUSTRAT, dar imaginile lor se verifică.
"""
import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

JOCURI = Path(__file__).resolve().parents[1]
IMG = re.compile(r"<img\b[^>]*>", re.I)
ATTR = lambda tag, a: (re.search(rf'\b{a}\s*=\s*"([^"]*)"', tag) or re.search(rf"\b{a}\s*=\s*'([^']*)'", tag) or [None, None])[1]
PRAG_KB = 200


def config(pg, page):
    pg.goto(page.as_uri()); pg.wait_for_timeout(250)
    src = page.read_text(encoding="utf-8")
    ser = "(k,v)=>typeof v==='function'?'[fn]':v"
    if "_motor/motor.js" in src:
        return pg.evaluate(f"JSON.parse(JSON.stringify(JocMotor.test.config(),{ser}))")
    m = re.search(r"const LEVELS=(\[.*?\n\]);", src, re.S)  # joc vechi (word-vii)
    lv = pg.evaluate(f"src=>JSON.parse(JSON.stringify((0,eval)('('+src+')'),{ser}))", m.group(1)) if m else []
    return {"nivele": lv}


AFISATE = {"text", "q", "why"}  # câmpurile randate ca HTML; soluțiile/mesajele simulatorului de cod NU (acolo <img> e exemplu de cod)


def html_uri(lv):
    """șirurile randate ca HTML ale nivelului și ale întrebărilor lui (qs + bazin)"""
    for k in AFISATE:
        if isinstance(lv.get(k), str):
            yield lv[k]
    for q in (lv.get("qs") or []) + (lv.get("bazin") or []):
        if isinstance(q, dict):
            for k in AFISATE:
                if isinstance(q.get(k), str):
                    yield q[k]


def main():
    probleme, renuntari = [], []
    surse_cache = {}
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        for d in sorted(x for x in JOCURI.iterdir() if x.is_dir() and not x.name.startswith("_") and (x / "index.html").exists()):
            cfg = config(pg, d / "index.html")
            invatare = not cfg.get("recapitulare") and cfg.get("mod") != "antrenament" and not d.name.startswith("recapitulare")
            for i, lv in enumerate(cfg.get("nivele") or [], 1):
                loc = f"{d.name} N{i} „{re.sub(r'<[^>]+>', '', str(lv.get('t', '')))[:40]}”"
                text = lv.get("text") or ""
                if invatare and text.strip() and not IMG.search(text):
                    motiv = str(lv.get("ilustratie") or "")
                    if motiv.lower().startswith("fără imagine") and len(motiv) >= len("fără imagine: ") + 25:
                        renuntari.append(f"{loc}: {motiv}")
                    else:
                        probleme.append(("NEILUSTRAT", loc, "pagina de citit n-are nicio imagine"))
                vazute = set()
                for s in html_uri(lv):
                    for tag in IMG.findall(s):
                        srcv = ATTR(tag, "src") or ""
                        if srcv in vazute:
                            continue
                        vazute.add(srcv)
                        alt = ATTR(tag, "alt")
                        if re.match(r"(https?:|data:|//)", srcv, re.I):
                            probleme.append(("EXTERNA", loc, srcv[:80])); continue
                        f = (d / srcv).resolve()
                        if not re.fullmatch(r"\.\./[a-z0-9-]+/img/[^/]+", srcv):
                            probleme.append(("CALE", loc, srcv))
                        if not f.exists():
                            probleme.append(("RUPTA", loc, srcv)); continue
                        if not alt or len(alt.strip()) < 12:
                            probleme.append(("ALT", loc, f"{srcv} alt={alt!r}"))
                        if f.stat().st_size > PRAG_KB * 1024:
                            probleme.append(("MARE", loc, f"{srcv} {f.stat().st_size // 1024} KB"))
                        sj = f.parent / "SURSE.json"
                        if sj not in surse_cache:
                            try:
                                surse_cache[sj] = {r.get("fisier") for r in json.loads(sj.read_text(encoding="utf-8"))}
                            except Exception:
                                surse_cache[sj] = set()
                        if f.name not in surse_cache[sj]:
                            probleme.append(("SURSA", loc, srcv))
        b.close()
    if "--json" in sys.argv:
        print(json.dumps({"probleme": [dict(tip=a, unde=b_, detaliu=c) for a, b_, c in probleme], "renuntari": renuntari},
                         ensure_ascii=False, indent=1))
    else:
        tipuri = {}
        for t, loc, det in probleme:
            tipuri[t] = tipuri.get(t, 0) + 1
            print(f"{t:10} {loc}  — {det}")
        print(f"renunțări motivate: {len(renuntari)}")
        for r in renuntari:
            print(f"  ~ {r}")
        print("pe tipuri: " + (", ".join(f"{k} {v}" for k, v in sorted(tipuri.items())) or "niciuna"))
    print(len(probleme))
    if "--strict" in sys.argv and probleme:  # pentru contractul jocuri-ilustratii-zero (exit 1 = au reapărut goluri)
        sys.exit(1)


if __name__ == "__main__":
    main()
