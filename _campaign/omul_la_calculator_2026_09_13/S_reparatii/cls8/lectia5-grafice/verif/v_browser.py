"""Verificator: randeaza lectia NOUA si VECHE (git HEAD) la 1366 si 400 px; masoara schema din atomul 6
(bare, aliniere la baza, depasiri orizontale) si face capturi. Iesire: v_browser.json + capturi in folderul verif."""
import asyncio, functools, http.server, json, subprocess, threading
from pathlib import Path
from playwright.async_api import async_playwright

V = Path(__file__).resolve().parent
ROOT = Path(r"C:\00\Projects\LearningHub")
REL = "content/tic/cls8/m1-excel-fundamente/lectia5-grafice.html"
OLD = "content/tic/cls8/m1-excel-fundamente/_v_old_lectia5.html"

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

JS = """() => {
  const a = document.getElementById('atom-6');
  const vb = a.querySelector('.visual-box');
  const vis = a.querySelector('.chart-visual');
  const r = el => { const b = el.getBoundingClientRect(); return {x:Math.round(b.left), y:Math.round(b.top), w:Math.round(b.width), h:Math.round(b.height), bottom:Math.round(b.bottom), right:Math.round(b.right)}; };
  const inner = vb.children[1];
  const bars = [...vis.querySelectorAll('.chart-bar')].map(r);
  const labels = [...vis.querySelectorAll('.chart-bar-label')].map(e => ({t:e.textContent, ...r(e)}));
  const vals = [...vis.querySelectorAll('.chart-bar-value')].map(e => ({t:e.textContent, ...r(e)}));
  return {
    doc_scrollW: document.documentElement.scrollWidth, viewport: window.innerWidth,
    visualbox: r(vb), visualbox_scroll: [vb.scrollWidth, vb.clientWidth],
    inner: r(inner), inner_scroll: [inner.scrollWidth, inner.clientWidth],
    chart_visual: r(vis), chart_visual_scroll: [vis.scrollWidth, vis.clientWidth],
    bars, labels, vals,
    bars_bottoms: [...new Set(bars.map(b=>b.bottom))],
    legend: [...a.querySelectorAll('span')].filter(s=>s.textContent.includes('LEGENDA')).map(s=>r(s.parentElement.parentElement)),
  };
}"""

async def run(pg, rel, w, tag, out):
    await pg.set_viewport_size({"width": w, "height": 900})
    await pg.goto(f"http://127.0.0.1:8781/{rel}")
    await pg.wait_for_timeout(1200)
    await pg.add_style_tag(content=".atom{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important;overflow:visible!important;filter:none!important}.atom-lock-overlay{display:none!important}")
    await pg.wait_for_timeout(300)
    res = await pg.evaluate(JS)
    await pg.locator("#atom-6 .visual-box").screenshot(path=str(V / f"v_{tag}_{w}.png"))
    out[f"{tag}_{w}"] = res

async def main():
    old = subprocess.run(["git", "-C", str(ROOT), "show", f"HEAD:{REL}"], capture_output=True).stdout
    (ROOT / OLD).write_bytes(old)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8781), functools.partial(Q, directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    out = {}
    msgs = []
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch()
            pg = await br.new_page()
            pg.on("console", lambda m: msgs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
            pg.on("pageerror", lambda e: msgs.append(f"pageerror: {e}"))
            for w in (1366, 400):
                await run(pg, REL, w, "nou", out)
                await run(pg, OLD, w, "vechi", out)
            # tema luminoasa pe versiunea noua
            await pg.set_viewport_size({"width": 1366, "height": 900})
            await pg.goto(f"http://127.0.0.1:8781/{REL}")
            await pg.wait_for_timeout(1000)
            await pg.evaluate("() => { document.documentElement.setAttribute('data-theme','light'); document.body.classList.add('light-mode','light-theme'); }")
            await pg.add_style_tag(content=".atom{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;height:auto!important;overflow:visible!important;filter:none!important}.atom-lock-overlay{display:none!important}")
            await pg.wait_for_timeout(300)
            await pg.locator("#atom-6 .visual-box").screenshot(path=str(V / "v_nou_1366_light.png"))
            await pg.locator("#atom-6 .tip-box").first.screenshot(path=str(V / "v_nou_tip_axa.png"))
            await pg.locator("#atom-8").screenshot(path=str(V / "v_nou_atom8.png"))
            await br.close()
    finally:
        srv.shutdown()
        (ROOT / OLD).unlink(missing_ok=True)
    out["consola"] = msgs
    (V / "v_browser.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    for k, v in out.items():
        if k == "consola":
            print("consola:", v[:10]); continue
        print(k, "doc", v["doc_scrollW"], "/", v["viewport"], "| vb", v["visualbox_scroll"], "| inner", v["inner_scroll"],
              "| vis", v["chart_visual_scroll"], "| bars", [(b["h"]) for b in v["bars"]], "bottoms", v["bars_bottoms"],
              "| labels", [(l["t"], l["x"], l["w"]) for l in v["labels"]], "| legend", v["legend"])

asyncio.run(main())
