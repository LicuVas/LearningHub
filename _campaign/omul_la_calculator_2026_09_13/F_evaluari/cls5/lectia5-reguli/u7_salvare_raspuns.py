# Copiat din lectia3-software/u7_salvare_raspuns.py (ea insasi din lectia1), adaptat la lectia5-reguli, copiat din lectia4-ergonomie (13.09.2026)
"""U7 + anexa.unde_se_salveaza_fisierul: unde ajunge „Salveaza raspunsul" si il mai gaseste elevul?
Pasul 1: elevul A scrie la Exercitiul 1, apasa Salveaza, reincarca pagina -> raspunsul e acolo?
Pasul 2: alt profil de browser (alt PC / sesiune curatata / alt cont Windows) -> raspunsul mai e?
Situl e servit prin http://127.0.0.1 (ca H_vede), nu file://."""
import asyncio
import functools
import http.server
import json
import socket
import threading
from pathlib import Path

from playwright.async_api import async_playwright

L = Path(__file__).resolve().parent
SITE = Path(r"C:/00/Projects/LearningHub")
REL = "content/tic/cls5/m1-sisteme/lectia5-reguli.html"
TEXT = "1. Nu bem apa la calculator, nu mancam, nu tragem de cabluri, anuntam profesorul, salvam cu Ctrl+S. 2. Apa strica tastatura. 3. Pornesc, astept, ma loghez; salvez, inchid, Start, Shut down."


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Q, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return port


async def main():
    port = serve()
    url = f"http://127.0.0.1:{port}/{REL}"
    out = {"url": REL}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1366, "height": 768})
        pg = await ctx.new_page()
        await pg.goto(url)
        await pg.wait_for_timeout(1200)
        out["sectiunea_exercitii_vizibila_la_deschidere"] = await pg.locator("#practice").is_visible()
        ex = pg.locator(".practice-exercise").first
        ta = ex.locator("textarea").first
        out["textarea_gasit"] = await ta.count() > 0
        out["buton_gasit"] = await ex.locator(".ps-save-btn").count() > 0
        # exercitiile sunt ascunse pana la finalul pasilor: scriem prin DOM, cu evenimentele reale
        await pg.evaluate("""(t) => { const ex = document.querySelector('.practice-exercise');
            const ta = ex.querySelector('textarea'); ta.value = t; ta.dispatchEvent(new Event('input'));
            ex.querySelector('.ps-save-btn').click(); }""", TEXT)
        await pg.wait_for_timeout(500)
        keys = await pg.evaluate("Object.keys(localStorage)")
        out["chei_localStorage"] = keys
        await pg.reload()
        await pg.wait_for_timeout(1200)
        out["dupa_reincarcare_acelasi_browser"] = await pg.evaluate("document.querySelector('.practice-exercise textarea').value")
        ctx2 = await b.new_context(viewport={"width": 1366, "height": 768})
        pg2 = await ctx2.new_page()
        await pg2.goto(url)
        await pg2.wait_for_timeout(1200)
        out["alt_profil_browser"] = await pg2.evaluate("document.querySelector('.practice-exercise textarea').value")
        await b.close()
    out["concluzie"] = ("raspunsul ramane doar in localStorage-ul acelui browser, pe acel PC"
                        if out["dupa_reincarcare_acelasi_browser"] == TEXT and out["alt_profil_browser"] == ""
                        else "vezi valorile")
    (L / "u7_salvare_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False)[:900])


asyncio.run(main())
