import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
import h
from playwright.sync_api import sync_playwright
srv, base = h.server()
pw = sync_playwright().start()
br = pw.chromium.launch(headless=True, ignore_default_args=["--hide-scrollbars"])
ctx = br.new_context(viewport={"width":1366,"height":768}); ctx.route("**/*", h.ruta)
pg = ctx.new_page(); pg.goto(base+"/aplicatii/poligon.html?aplicatie=excel"); pg.wait_for_selector('[data-lh-aplicatie="excel"]'); pg.wait_for_timeout(800)
print(pg.evaluate("""()=>{const c=document.querySelector('.lh-ap-x-corp');const b=c.getBoundingClientRect();return {rect:[b.x,b.y,b.width,b.height],ow:c.offsetWidth,cw:c.clientWidth,oh:c.offsetHeight,ch:c.clientHeight}}"""))
pg.screenshot(path=h.P+"x_cu_derulare.png")
ctx.close(); br.close(); pw.stop(); srv.shutdown()
