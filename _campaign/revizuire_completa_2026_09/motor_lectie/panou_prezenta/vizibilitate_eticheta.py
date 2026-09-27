"""Cât de des se VEDE eticheta „Profesorul vede activitatea ta” după schimbare (27.09.2026): la fiecare poziție de
derulare (pas 40 px), în toți pașii părții 1 + atelier, pe telefon 390x844 și calculator 1280x800, elev înscris.
Numără pozițiile: plină (stânga jos) / buton rotund (dreapta jos) / ascunsă (ar fi stat peste ceva de apăsat)."""
import subprocess, sys, time
from collections import Counter
from playwright.sync_api import sync_playwright
for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass
LH = r"C:\00\Projects\LearningHub"
PORT = 8787
NOW = int(time.time() * 1000)
EU = {"id": "proba00000000000000000000000000ab", "scoala": "brauner", "scoalaNume": "x", "clasa": "VI A", "nume": "Popescu Ana-Maria", "numeEnc": "xx", "ultima": NOW}
JS = """async () => { const b = document.getElementById('lhp'), out = [], H = innerHeight, max = document.documentElement.scrollHeight - H;
  for (let y = 0; y <= max + 39; y += 40) { scrollTo(0, Math.min(y, max)); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    out.push(/ferit/.test(b.className) ? 'ascunsa' : /mini/.test(b.className) ? 'rotunda' : 'plina'); } return out; }"""
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", LH], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
try:
    with sync_playwright() as p:
        br = p.chromium.launch()
        for ecr, w, h, tel in [("telefon 390", 390, 844, True), ("calculator 1280", 1280, 800, False)]:
            for pag in ["/lectii/vi/m1-l04/index.html", "/lectii/viii/m1-l04/index.html", "/jocuri/excel-viii/index.html"]:
                ctx = br.new_context(viewport={"width": w, "height": h}, is_mobile=tel, has_touch=tel)
                pg = ctx.new_page()
                pg.route("**/*", lambda r: r.fulfill(status=200, body="{}") if r.request.method == "POST" else r.continue_())
                pg.goto(f"http://127.0.0.1:{PORT}{pag}", wait_until="networkidle")
                pg.evaluate("e => { localStorage.clear(); localStorage.setItem('lh_prezenta', JSON.stringify(e)); }", EU)
                pg.reload(wait_until="networkidle"); pg.wait_for_timeout(1500)
                c = Counter(pg.evaluate(JS))   # cuprinsul
                pg.evaluate("document.querySelector('.lvl[data-l=\"0\"]').click()"); pg.wait_for_timeout(400)
                n = pg.evaluate("(JocMotor.test.config().nivele[0].pasi || []).length")
                for k in list(range(n)) + ["atelier"]:
                    pg.evaluate("k => k === 'atelier' ? JocMotor.test.atelier() : JocMotor.test.pas(k)", k); pg.wait_for_timeout(350)
                    c.update(pg.evaluate(JS))
                t = sum(c.values())
                print(f"{ecr:16} {pag:32} pozitii {t:4}: plina {c['plina']*100//t:3}% · rotunda {c['rotunda']*100//t:3}% · ascunsa {c['ascunsa']*100//t:3}%")
                ctx.close()
        br.close()
finally:
    srv.terminate()
