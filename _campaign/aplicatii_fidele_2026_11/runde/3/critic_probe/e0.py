import sys, json
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe")
from h import *
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    deschide(pg, ["Ana are mere"], 4, 7)
    print(pg.evaluate("""() => { const e = document.querySelector('[data-lh-id-mso="FontSize"]'); return e.outerHTML.slice(0, 1500); }"""))
    print(pg.evaluate("""() => { const e = document.querySelector('[data-lh-suprafata="bara_titlu"]'); return e.outerHTML.slice(0, 1800); }"""))
    pg.keyboard.press("F12"); pg.wait_for_timeout(300)
    pg.screenshot(path=r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe/saveas_1366.png")
    print(pg.evaluate("""() => { const d = document.querySelector('[data-lh-suprafata="dialog.FileSaveAs"]'); const R = d.getBoundingClientRect();
      return [...d.querySelectorAll('[data-lh-tip]')].map(x => { const r = x.getBoundingClientRect(); return [x.getAttribute('data-lh-tip'), (x.getAttribute('data-lh-eticheta')||'').slice(0,40), x.getAttribute('data-lh-tinta'), Math.round(r.x-R.x), Math.round(r.y-R.y), Math.round(r.width), Math.round(r.height), (x.innerText||'').trim().slice(0,30)]; }).filter(z => /ComboBox|Button|Edit|Text|Tree|List|TitleBar|Hyperlink|SplitButton|ToolBar/.test(z[0])).slice(0, 80); }"""))
    b.close()
s.shutdown()
