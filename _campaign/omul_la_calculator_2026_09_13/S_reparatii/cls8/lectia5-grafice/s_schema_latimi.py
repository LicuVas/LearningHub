"""Schema „Anatomia” (atom 6) la 1366 px si la 400 px (emulare telefon): depasire, bare, legenda vizibila."""
import asyncio
import functools
import http.server
import json
import threading
from pathlib import Path

from playwright.async_api import async_playwright

L = Path(__file__).resolve().parent
ROOT = Path(r"C:\00\Projects\LearningHub")
REL = "content/tic/cls8/m1-excel-fundamente/lectia5-grafice.html"


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


JS = """() => {
  const a = document.getElementById('atom-6');
  const box = a.querySelector('.visual-box');
  const inner = box.children[1];
  const br = inner.getBoundingClientRect();
  const r = el => { const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right), Math.round(b.width), Math.round(b.height)]; };
  const leg = [...inner.querySelectorAll('span')].find(s => s.textContent.includes('LEGENDA'));
  const bars = [...inner.querySelectorAll('.chart-bar')];
  const scroller = inner.querySelector('.chart-visual').parentElement;
  return {
    inner_scroll_client: [inner.scrollWidth, inner.clientWidth],
    chart_scroll_client: [scroller.scrollWidth, scroller.clientWidth],
    doc_scroll_client: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
    inner_rect: r(inner),
    legenda_rect: r(leg),
    legenda_in_chenar: leg.getBoundingClientRect().left >= br.left && leg.getBoundingClientRect().right <= br.right,
    bare: bars.map(b => [getComputedStyle(b).height, r(b)]),
    bare_in_chenar: bars.every(b => b.getBoundingClientRect().right <= br.right && b.getBoundingClientRect().left >= br.left),
  };
}"""


async def main():
    h = functools.partial(Tacut, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8781), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    out = {}
    async with async_playwright() as p:
        br = await p.chromium.launch()
        for nume, ctxargs in (("1366", {"viewport": {"width": 1366, "height": 768}}),
                              ("400", {"viewport": {"width": 400, "height": 800}, "is_mobile": True, "has_touch": True, "device_scale_factor": 2})):
            ctx = await br.new_context(**ctxargs)
            pg = await ctx.new_page()
            await pg.goto(f"http://127.0.0.1:8781/{REL}")
            await pg.wait_for_timeout(1200)
            await pg.add_style_tag(content=".atom{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important;overflow:visible!important;filter:none!important} .atom *{filter:none!important}")
            await pg.wait_for_timeout(300)
            out[nume] = await pg.evaluate(JS)
            await pg.locator("#atom-6 .visual-box").screenshot(path=str(L / f"s_schema_{nume}.png"))
            await ctx.close()
        await br.close()
    srv.shutdown()
    txt = json.dumps(out, ensure_ascii=False, indent=1)
    (L / "s_schema_latimi.txt").write_text(txt, encoding="utf-8")
    print(txt)


asyncio.run(main())
