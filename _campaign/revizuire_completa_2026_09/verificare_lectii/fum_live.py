# Proba de fum pe situl LIVE după publicare: pagina pornește la 390 px (atingere) și la 1280 px, fără erori JS.
# Blochează TOT ce nu e situl (regula 24: nimic spre teste-vasile). Nu înscrie pe nimeni, nu apasă nimic.
# Folosire: python fum_live.py /lectii/v/m1-l02/ [/lectii/...]      Ultima linie = numărul de pagini cu probleme.
import sys

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
SIT = "https://learninghub-8z6.pages.dev"
cai = [a for a in sys.argv[1:] if a.startswith("/")] or ["/lectii/"]
probleme = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for cale in cai:
        for nume, opt in (("390", dict(p.devices["Pixel 7"])), ("1280", {"viewport": {"width": 1280, "height": 800}})):
            opt = dict(opt)
            opt["user_agent"] = "LearningHub-lectii/1.0 (educational site)"
            ctx = b.new_context(**opt)
            blocate = []
            ctx.route("**/*", lambda r: r.continue_() if r.request.url.startswith(SIT) else (blocate.append(r.request.url.split("?")[0]), r.abort()))
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
            try:
                pg.goto(SIT + cale + ("&" if "?" in cale else "?") + "fum=1", wait_until="load", timeout=60000)
                pg.wait_for_timeout(1500)
                txt = pg.evaluate("document.body.innerText.length")
                lat = pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
            except Exception as e:
                erori.append("încărcare: " + str(e)[:160])
                txt, lat = 0, False
            ok = not erori and txt > 300 and not lat
            probleme += 0 if ok else 1
            spre_tv = sum(1 for u in blocate if "teste-vasile" in u)
            print(f"{'OK      ' if ok else 'PROBLEMĂ'} {cale:28} {nume:>4}px text={txt} mai_lat={lat} erori={erori[:2]} blocate={len(blocate)} (teste-vasile {spre_tv})")
            ctx.close()
    b.close()
print(probleme)
