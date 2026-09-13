"""Deschide lectia in Chromium headless (server local), apasa butonul Copiaza si citeste clipboard-ul real."""
import json, subprocess, sys, time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
ROOT = r"C:\00\Projects\LearningHub"
PORT = 8791
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
out = {}
try:
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(permissions=["clipboard-read", "clipboard-write"])
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        url = f"http://127.0.0.1:{PORT}/content/tic/cls8/m1-excel-fundamente/lectia1-interfata.html"
        pg.goto(url, wait_until="load")
        pg.wait_for_timeout(1000)
        pg.evaluate("navigator.clipboard.writeText('GOL')")
        btn = pg.locator(".copyable-block .copy-btn")
        out["nr_butoane"] = btn.count()
        out["vizibil"] = btn.first.is_visible()
        btn.first.scroll_into_view_if_needed()
        btn.first.click()
        pg.wait_for_timeout(500)
        clip = pg.evaluate("navigator.clipboard.readText()")
        out["eticheta_dupa_click"] = btn.first.inner_text()
        out["clipboard_repr"] = repr(clip)
        rows = clip.split("\n")
        out["randuri"] = len(rows)
        out["coloane_pe_rand"] = [len(r.split("\t")) for r in rows]
        out["are_CR"] = "\r" in clip
        out["tabel"] = [r.split("\t") for r in rows]
        out["erori_js"] = errs
        pg.locator(".copyable-block").screenshot(path=ROOT + r"\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia1-interfata\verif\bloc_copiaza.png")
        b.close()
finally:
    srv.terminate()
print(json.dumps(out, ensure_ascii=False, indent=1))
