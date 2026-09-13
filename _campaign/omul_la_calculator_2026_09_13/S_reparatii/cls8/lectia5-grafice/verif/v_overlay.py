import asyncio, functools, http.server, threading
from pathlib import Path
from playwright.async_api import async_playwright
V = Path(__file__).resolve().parent
ROOT = Path(r"C:\00\Projects\LearningHub")
REL = "content/tic/cls8/m1-excel-fundamente/lectia5-grafice.html"
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
JS = """() => [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e);
  return (s.position==='fixed' && e.getBoundingClientRect().width > 300) || (s.backdropFilter && s.backdropFilter!=='none') || (s.filter && s.filter!=='none'); })
  .map(e => e.tagName + '#' + e.id + '.' + e.className + ' | ' + getComputedStyle(e).position + ' ' + getComputedStyle(e).filter + ' ' + getComputedStyle(e).backdropFilter).slice(0,20)"""
async def main():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8782), functools.partial(Q, directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        br = await p.chromium.launch()
        pg = await br.new_page(viewport={"width": 1366, "height": 768})
        await pg.goto(f"http://127.0.0.1:8782/{REL}")
        await pg.wait_for_timeout(1500)
        print(await pg.evaluate(JS))
        await pg.screenshot(path=str(V / "v_viewport.png"))
        await br.close()
    srv.shutdown()
asyncio.run(main())
