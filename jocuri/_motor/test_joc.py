"""Poarta mecanică a lecțiilor-joc. Un joc NU e gata până nu trece.

    python jocuri/_motor/test_joc.py <slug>          # ex. excel-viii
    python jocuri/_motor/test_joc.py --toate

Verifică (FAIL = blochează, WARN = de uitat):
  A. Ancora în programă: `unitate` există în Info_Gimnaziu_2026/data/unitati.json la clasa jocului,
     iar fiecare competență din `competente` aparține acelei unități (sursa: planificarea anului).
  B. Structura fiecărei întrebări (indici în interval, variante unice, explicație `why` nevidă...).
  C. Pagina: <!doctype html>, meta viewport, <title>, motor.css + motor.js legate.
  D. Diacritice: cel puțin 15 litere ă/â/î/ș/ț la 1000 de litere (textul românesc obișnuit are ~40-60,
     măsurat în KB la auditul LearningHub; 15 = prag prudent care prinde doar textul scris FĂRĂ diacritice).
  E. Rulare pe telefon emulat (Pixel 7 + iPhone SE, mobile=True): zero erori JS, nimic mai lat decât ecranul,
     fiecare întrebare rezolvată corect primește „Corect”, un răspuns greșit primește „Nu încă”,
     fiecare nivel dă 3 stele la rezolvare din prima, diploma se deschide.
Pragurile de formă (cuvinte pe pagina de citit, număr de niveluri) sunt alegeri de design, deci doar WARN.
"""
import html as htmlmod
import json
import re
import sys
from pathlib import Path

JOCURI = Path(__file__).resolve().parents[1]
UNITATI = Path(r"C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json")
BUILTIN = {"choice", "tf", "order", "classify", "match", "hunt", "pick"}
DIACR = set("ăâîșțĂÂÎȘȚ")


def strip_tags(s):
    return htmlmod.unescape(re.sub(r"<[^>]+>", " ", s or ""))


def static_checks(slug, cfg, page_html, fails, warns):
    # C. pagina
    if not page_html.lstrip().lower().startswith("<!doctype html>"):
        fails.append("pagina nu începe cu <!doctype html>")
    for need, what in [('name="viewport"', "meta viewport"), ("<title>", "<title>"),
                       ("_motor/motor.css", "legătura la motor.css"), ("_motor/motor.js", "legătura la motor.js")]:
        if need not in page_html:
            fails.append(f"lipsește {what}")

    # A. ancora în programă
    cls = cfg.get("clasa", "").replace("a ", "").replace("-a", "").strip()
    try:
        un = json.loads(UNITATI.read_text(encoding="utf-8"))["clase"]
        unit = next((u for u in un.get(cls, {}).get("unitati", []) if u["id"] == cfg.get("unitate")), None)
        if not unit:
            fails.append(f"unitatea {cfg.get('unitate')!r} nu există la clasa {cls!r} în unitati.json")
        else:
            extra = [c for c in cfg.get("competente", []) if c not in unit["cs"]]
            if extra:
                fails.append(f"competențele {extra} nu aparțin unității {unit['id']} (are {unit['cs']})")
            if cfg.get("unitateTitlu") and cfg["unitateTitlu"].strip() != unit["titlu"].strip():
                warns.append(f"unitateTitlu diferă de planificare: {unit['titlu']!r}")
    except FileNotFoundError:
        warns.append(f"nu găsesc {UNITATI} - ancora în programă NEVERIFICATĂ")

    # A2. acoperirea declarată: fiecare nivel spune ce lecții și ce conținuturi din programă predă și verifică
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from acoperire import load_sources
        un2, domains, mp, _ = load_sources()
        uid = cfg.get("unitate", "")
        ucls = uid.split("-")[0]
        unit2 = next((u for u in un2.get(ucls, {}).get("unitati", []) if u["id"] == uid), None)
        allowed = {c for d in mp.get(ucls, {}).get(uid, []) for c in domains.get(ucls, {}).get(d, [])}
        nrs = {l["nr"] for l in unit2["lectii"]} if unit2 else set()
        for li, lv in enumerate(cfg.get("nivele", []), 1):
            if not lv.get("lectii"):
                fails.append(f"N{li}: nu declară lectii (numerele lecțiilor din unitate pe care le acoperă)")
            if not lv.get("continuturi"):
                fails.append(f"N{li}: nu declară continuturi (textul exact din programă)")
            for n in lv.get("lectii", []):
                if n not in nrs:
                    fails.append(f"N{li}: lecția {n} nu există în unitatea {uid}")
            for c in lv.get("continuturi", []):
                if c not in allowed:
                    fails.append(f"N{li}: conținutul {c!r} nu e în programa unității {uid}")
    except Exception as e:  # sursele lipsă nu opresc poarta, dar se văd
        warns.append(f"acoperirea NEVERIFICATĂ: {e}")

    # B. structura
    niv = cfg.get("nivele", [])
    if cfg.get("mod") == "antrenament":
        if not (3 <= len(niv) <= 4):
            warns.append(f"antrenament cu {len(niv)} runde (obișnuit 3-4: De bază, Consolidat, Avansat [+ amestecat])")
        if any("bazin" not in l for l in niv):
            fails.append("antrenament: fiecare rundă are nevoie de `bazin` + `cate`")
    elif not (5 <= len(niv) <= 8):
        warns.append(f"{len(niv)} niveluri (obișnuit 5-8)")
    if not any(l.get("final") for l in niv):
        fails.append("niciun nivel nu are final:true (nivelul final integrator)")
    tipuri = BUILTIN | set((cfg.get("tipuri") or {}).keys())
    texts = [cfg.get("intro", ""), json.dumps(cfg.get("diploma", {}), ensure_ascii=False)]
    for li, lv in enumerate(niv, 1):
        words = len(strip_tags(lv.get("text", "")).split())
        if "bazin" not in lv and not (40 <= words <= 170):
            warns.append(f"N{li}: pagina de citit are {words} cuvinte (obișnuit 60-120)")
        texts.append(lv.get("text", ""))
        qs = lv.get("qs", [])
        if "bazin" not in lv and not (3 <= len(qs) <= 6):
            warns.append(f"N{li}: {len(qs)} întrebări (obișnuit 4-5)")
        for qi, q in enumerate(qs, 1):
            tag = f"N{li}Î{qi}"
            t = q.get("t")
            texts.append(q.get("q", "") + " " + q.get("why", ""))
            if t not in tipuri:
                fails.append(f"{tag}: tip necunoscut {t!r}")
                continue
            if not strip_tags(q.get("why", "")).strip():
                fails.append(f"{tag}: lipsește explicația why")
            if t == "choice":
                o = q.get("o", [])
                if len(o) < 3 or len(set(o)) != len(o):
                    fails.append(f"{tag}: choice cere minim 3 variante unice")
                if not isinstance(q.get("ok"), int) or not (0 <= q["ok"] < len(o)):
                    fails.append(f"{tag}: ok în afara variantelor")
                texts.append(" ".join(o))
            elif t == "tf":
                if not isinstance(q.get("ok"), bool):
                    fails.append(f"{tag}: tf cere ok true/false")
            elif t == "order":
                it = q.get("items", [])
                if len(it) < 3 or len(set(it)) != len(it):
                    fails.append(f"{tag}: order cere minim 3 pași unici")
                texts.append(" ".join(it))
            elif t == "classify":
                cats, items = q.get("cats", []), q.get("items", [])
                if len(cats) < 2 or len(items) < 4:
                    fails.append(f"{tag}: classify cere minim 2 categorii și 4 rânduri")
                if any(not (0 <= i[1] < len(cats)) for i in items):
                    fails.append(f"{tag}: classify are un indice de categorie greșit")
                if len({i[1] for i in items}) < len(cats):
                    warns.append(f"{tag}: o categorie nu e folosită de niciun rând")
                texts.append(" ".join(i[0] for i in items))
            elif t == "match":
                p = q.get("pairs", [])
                if len(p) < 3 or len({a for a, _ in p}) != len(p) or len({b for _, b in p}) != len(p):
                    fails.append(f"{tag}: match cere minim 3 perechi cu ambele părți unice")
                texts.append(" ".join(a + " " + b for a, b in p))
            elif t == "hunt":
                if not re.search(r"\[\[.*?\|.+?\]\]", q.get("src", "")):
                    fails.append(f"{tag}: hunt fără nicio greșeală [[text|explicație]]")
                texts.append(q.get("src", ""))
            elif t == "pick":
                a = q.get("ans", "")
                ok = re.fullmatch(r"([A-Z])(\d+)(:([A-Z])(\d+))?", a)
                if not ok or ord(ok.group(1)) - 64 > q.get("cols", 0) or int(ok.group(2)) > q.get("rows", 0):
                    fails.append(f"{tag}: pick ans {a!r} nu e în grilă")
    D = cfg.get("diploma") or {}
    if not D.get("provocare"):
        fails.append("diploma fără provocare în aplicația reală")
    all_text = strip_tags(" ".join(texts))
    letters = [c for c in all_text if c.isalpha()]
    dens = 1000 * sum(c in DIACR for c in letters) / max(1, len(letters))
    if dens < 15:
        fails.append(f"diacritice: {dens:.1f} la 1000 de litere (textul pare scris fără diacritice)")
    return dens


def run(slug, fails, warns):
    from playwright.sync_api import sync_playwright
    page_file = JOCURI / slug / "index.html"
    if not page_file.exists():
        return {"slug": slug, "fails": [f"nu există {page_file}"], "warns": []}
    page_html = page_file.read_text(encoding="utf-8")
    url = page_file.as_uri()
    played = 0
    dens = 0.0
    with sync_playwright() as p:
        b = p.chromium.launch()
        cfg = None
        for dev in ["Pixel 7", "iPhone SE"]:
            ctx = b.new_context(**p.devices[dev])
            pg = ctx.new_page()
            pg.set_default_timeout(6000)
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(url)
            pg.wait_for_timeout(300)
            if cfg is None:
                cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
                # antrenament: nivelul are bazin + cate; poarta joacă TOT bazinul (vezi toateIntrebarile mai jos)
                for li0, lv0 in enumerate(cfg.get("nivele", []), 1):
                    if "bazin" in lv0:
                        cate, baz = lv0.get("cate"), lv0["bazin"]
                        if not isinstance(cate, int) or cate < 3:
                            fails.append(f"N{li0}: antrenament fără `cate` (câte întrebări se trag, minim 3)")
                        elif len(baz) < 2 * cate:
                            fails.append(f"N{li0}: bazinul are {len(baz)} întrebări, dar trebuie cel puțin {2 * cate} (de două ori `cate`), ca reluarea să aducă întrebări noi")
                        lv0["qs"] = baz
                dens = static_checks(slug, cfg, page_html, fails, warns)

            def overflow(where):
                w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                if w[0] > w[1] + 1:
                    fails.append(f"{dev} {where}: pagina e mai lată decât ecranul ({w[0]}px > {w[1]}px)")

            overflow("cuprins")
            pg.evaluate("JocMotor.test.toateIntrebarile()")
            pg.evaluate("JocMotor.test.deblocheaza()")
            pg.evaluate("document.getElementById('go-home').click()")
            # răspuns greșit: prima întrebare choice/tf care deschide un nivel (nu se salvează nimic)
            li_w = next((i for i, lv in enumerate(cfg["nivele"]) if lv["qs"] and lv["qs"][0]["t"] in ("choice", "tf")), None)
            if li_w is None:
                warns.append("niciun nivel nu începe cu choice/tf - răspunsul greșit NEtestat")
            else:
                q0 = cfg["nivele"][li_w]["qs"][0]
                wrong = next(k for k in range(len(q0["o"])) if k != q0["ok"]) if q0["t"] == "choice" else (1 if q0["ok"] else 0)
                pg.click(f'.lvl[data-l="{li_w}"]'); pg.click("#go")
                pg.click(f'.opt[data-k="{wrong}"]')
                if not pg.locator("#fb .fb.bad").count():
                    fails.append(f"{dev} N{li_w+1}Î1: răspunsul greșit nu a primit „Nu încă”")
                pg.evaluate("document.getElementById('go-home').click()")
            # simulatoare: și răspunsul GREȘIT trebuie respins (prima întrebare din fiecare tip propriu), fără să salveze nimic
            if dev == "Pixel 7":
                done_types = set()
                for li, lv in enumerate(cfg["nivele"]):
                    for qi, q in enumerate(lv["qs"]):
                        if q["t"] in BUILTIN or q["t"] in done_types:
                            continue
                        done_types.add(q["t"])
                        pg.click(f'.lvl[data-l="{li}"]'); pg.click("#go")
                        for _ in range(qi):
                            pg.evaluate("JocMotor.test.rezolva()")
                            if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                                pg.click("#chk")
                            pg.click("#next")
                        try:
                            has = pg.evaluate("JocMotor.test.gresit()")
                        except Exception as e:
                            fails.append(f"{dev} N{li+1}Î{qi+1}: gresit() a dat eroare: {str(e).splitlines()[0][:140]}")
                            has = None
                        if has is False:
                            warns.append(f"simulatorul {q['t']!r} nu are gresit() - răspunsul greșit NEtestat de poartă")
                        elif has:
                            if pg.locator("#chk").count():
                                pg.click("#chk")
                            if not pg.locator("#fb .fb.bad").count():
                                fails.append(f"{dev} N{li+1}Î{qi+1}: simulatorul {q['t']!r} a ACCEPTAT răspunsul greșit din gresit()")
                        pg.evaluate("document.getElementById('go-home').click()")
            for li, lv in enumerate(cfg["nivele"]):
                pg.click(f'.lvl[data-l="{li}"]')
                pg.click("#go")
                for qi, q in enumerate(lv["qs"]):
                    tag = f"{dev} N{li+1}Î{qi+1}"
                    overflow(tag)
                    try:
                        ok = pg.evaluate("JocMotor.test.rezolva()")
                    except Exception as e:
                        fails.append(f"{tag}: rezolvarea automată a dat eroare: {str(e).splitlines()[0][:160]}")
                        break
                    if not ok:
                        fails.append(f"{tag}: tipul {q['t']!r} nu are rezolvare automată (rezolva)")
                        break
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                    if not pg.locator("#fb .fb.ok").count():
                        fb = pg.locator("#fb").inner_text()[:160] if pg.locator("#fb").count() else ""
                        fails.append(f"{tag}: răspunsul corect nu a fost acceptat. Mesaj: {fb!r}")
                        break
                    played += 1
                    pg.click("#next")
                else:
                    stars = pg.locator(".end-stars").get_attribute("aria-label") or ""
                    if not stars.startswith("3 "):
                        fails.append(f"{dev} N{li+1}: rezolvat din prima, dar dă {stars!r}")
                    if li < len(cfg["nivele"]) - 1:
                        pg.click("#toc")
                    else:
                        pg.click("#dp")
                        if cfg["diploma"]["titlu"] not in pg.locator(".diploma").inner_text():
                            fails.append(f"{dev}: diploma nu arată titlul")
                        overflow("diplomă")
                    continue
                pg.evaluate("document.getElementById('go-home').click()")
            if errs:
                fails.append(f"{dev}: erori JS: {errs[:3]}")
            ctx.close()
        # antrenament: tragerea reală (fără toateIntrebarile). O rundă TERMINATĂ, reluată, trebuie să aducă alte întrebări.
        if cfg and cfg.get("mod") == "antrenament":
            ctx = b.new_context(**p.devices["Pixel 7"])
            pg = ctx.new_page()
            pg.set_default_timeout(6000)
            pg.goto(url); pg.wait_for_timeout(300)
            pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")
            lv0 = cfg["nivele"][0]
            draws = []
            for _ in range(2):
                pg.click('.lvl[data-l="0"]')
                draws.append(pg.evaluate("JocMotor.test.config().nivele[0].qs.map(q=>q.q)"))
                pg.click("#go")
                for _q in draws[-1]:
                    pg.evaluate("JocMotor.test.rezolva()")
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                    pg.click("#next")
                pg.evaluate("document.getElementById('go-home').click()")
            common = set(draws[0]) & set(draws[1])
            if len(lv0.get("bazin", [])) >= 2 * len(draws[0]) and common:
                fails.append(f"antrenament N1: a doua tragere după o rundă terminată repetă {len(common)} întrebări (trebuia să aducă altele)")
            ctx.close()
        b.close()
    return {"slug": slug, "fails": fails, "warns": warns, "intrebari_jucate": played, "diacritice_la_1000": round(dens, 1)}


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(__doc__); sys.exit(2)
    slugs = [d.name for d in JOCURI.iterdir() if d.is_dir() and not d.name.startswith("_") and (d / "index.html").exists()] if args[0] == "--toate" else args
    bad = 0
    for s in slugs:
        page = (JOCURI / s / "index.html")
        if page.exists() and "_motor/motor.js" not in page.read_text(encoding="utf-8"):
            print(f"[SARIT] {s}: nu folosește motorul (joc vechi, de sine stătător)")
            continue
        fails, warns = [], []
        try:
            r = run(s, fails, warns)
        except Exception as e:  # o pagină stricată nu are voie să ascundă raportul: păstrăm ce s-a găsit până aici
            fails.append(f"poarta s-a oprit: {str(e).splitlines()[0][:200]}")
            r = {"slug": s, "fails": fails, "warns": warns}
        status = "TRECUT" if not r["fails"] else "PICAT"
        bad += bool(r["fails"])
        print(f"[{status}] {s} · întrebări jucate: {r.get('intrebari_jucate')} · diacritice/1000: {r.get('diacritice_la_1000')}")
        for f in r["fails"]:
            print("   FAIL", f)
        for w in r["warns"]:
            print("   warn", w)
    sys.exit(1 if bad else 0)
