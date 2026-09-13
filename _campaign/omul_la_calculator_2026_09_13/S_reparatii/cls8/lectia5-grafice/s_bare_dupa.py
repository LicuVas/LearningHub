"""U5 - reproducere: in atomul 6 („Anatomia unui grafic Column”) barele au inaltime 0 px pe ecran.
Serveste LearningHub prin http (ca H_vede), deschide lectia la 1366x768, face atomul 6 vizibil si masoara
getBoundingClientRect pentru .chart-bar, .chart-bar-group si .chart-visual. Iesire: s_bare_dupa.txt (<= 20 randuri tiparite)."""
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


def serve(port=8779):
    h = functools.partial(Tacut, directory=str(ROOT))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


JS = """() => {
  const a = document.getElementById('atom-6');
  a.style.display = 'block'; a.classList.add('active'); a.hidden = false;
  a.scrollIntoView();
  const r = el => { const b = el.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; };
  const vis = a.querySelector('.chart-visual');
  return {
    atom_inaltime: r(a)[1],
    chart_visual: r(vis),
    grupuri: [...vis.querySelectorAll('.chart-bar-group')].map(r),
    bare: [...vis.querySelectorAll('.chart-bar')].map(b => ({stil_inline: b.getAttribute('style').match(/height: [^;]+/)[0],
                                                          calculat: getComputedStyle(b).height, dreptunghi: r(b)})),
  };
}"""


async def main():
    srv = serve()
    async with async_playwright() as p:
        br = await p.chromium.launch()
        pg = await br.new_page(viewport={"width": 1366, "height": 768})
        await pg.goto(f"http://127.0.0.1:8779/{REL}")
        await pg.wait_for_timeout(1200)
        await pg.add_style_tag(content=".atom{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important;overflow:visible!important}")
        await pg.wait_for_timeout(300)
        res = await pg.evaluate(JS)
        await pg.locator("#atom-6 .chart-visual").screenshot(path=str(L / "s_bare_dupa.png"))
        # captura vizuala = pas_06_atom_intreg.png (H_vede, dupa parcurgere)
        await br.close()
    srv.shutdown()
    txt = json.dumps(res, ensure_ascii=False, indent=1)
    (L / "s_bare_dupa.txt").write_text(txt, encoding="utf-8")
    print(txt[:1500])


asyncio.run(main())
