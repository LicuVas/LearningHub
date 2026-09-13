"""U2: posterul „Regulile de aur ale laboratorului” incape intr-un ecran (ca sa-l prinda Print Screen)?
Masoara inaltimea blocului in Chromium headless la 1366x768 (ipoteza de rezolutie) si face captura blocului.
Scrie u2_poster_iesire.json + u2_poster.png."""
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
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await (await b.new_context(viewport={"width": 1366, "height": 768})).new_page()
        await pg.goto(f"http://127.0.0.1:{port}/{REL}")
        await pg.wait_for_timeout(1200)
        # arata toti pasii (doar pentru masurare; elevul ajunge aici dupa 10 raspunsuri corecte)
        await pg.add_style_tag(content=".ux-step-hidden{display:block!important}")
        info = await pg.evaluate("""() => {
          const box = document.querySelector('.rules-poster');
          const r = box.getBoundingClientRect();
          box.scrollIntoView();
          return {tag: box.tagName, cls: box.className, inaltime_px: Math.round(r.height), latime_px: Math.round(r.width)};
        }""")
        out.update(info)
        out["inaltime_ecran_px"] = 768
        out["incape_intr_un_ecran"] = info["inaltime_px"] <= 768 - 56  # minus bara de navigare fixa a sitului
        await pg.wait_for_timeout(400)
        await pg.screenshot(path=str(L / "u2_poster.png"))
        await b.close()
    (L / "u2_poster_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False))


asyncio.run(main())
