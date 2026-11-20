import sys, json
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/15")
import proba_explorer as P
from playwright.sync_api import sync_playwright
srv, base = P.server()
with sync_playwright() as p:
    br = p.chromium.launch(); ctx = br.new_context(viewport={"width": 1366, "height": 768}); ctx.route("**/*", P.ruta)
    pg = ctx.new_page(); err = []; pg.on("pageerror", lambda e: err.append(str(e)))
    pg.goto(base + "aplicatii/poligon.html?aplicatie=explorer", wait_until="load"); pg.wait_for_timeout(500)
    b = pg.evaluate("()=>{const e=LH.aplicatii.element('explorer','bara_comenzi:Nou');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    pg.mouse.click(b[0], b[1]); pg.wait_for_timeout(300)
    print(pg.evaluate("()=>{const m=document.querySelector('.lh-ap-e-mw');const e=LH.aplicatii.element('explorer','meniu:Folder');const x=document.querySelector('[data-lh-id=\"Folder\"]');return {mw:m&&m.getAttribute('style'),mr:m&&JSON.stringify(m.getBoundingClientRect()),el:!!e,x:x&&JSON.stringify(x.getBoundingClientRect()),ev:(window.__lhAplicatieEv||[]).slice(-2).map(d=>d.gest+'/'+d.actiune+'/'+d.tinta)}}"))
    print(err[:3])
    br.close()
srv.shutdown()
