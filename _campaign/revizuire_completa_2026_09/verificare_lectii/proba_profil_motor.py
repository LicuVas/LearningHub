# Proba dirijorului: elev înscris (profil activ) FĂRĂ progres salvat pe profil -> pagina pornește, 0 erori.
# Acoperă defectul din motor.js load() (comentariul care a înghițit `const b=...`, 28.09 00:00).
# Control: același drum cu defectul re-injectat în motor.js TREBUIE să dea PROBLEMĂ (altfel proba e oarbă).
import http.server
import socketserver
import sys
import threading
from functools import partial
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
RAD = r"C:\00\Projects\LearningHub"
PAGINI = ["jocuri/excel-viii/", "jocuri/word-vii/", "jocuri/calculator-v/", "lectii/viii/m1-l04/", "lectii/v/m1-l01/",
          "lectii/vi/m1-l01/", "lectii/vii/m1-l01/", "lectii/viii/m1-l01/", "jocuri/excel-viii/?recitire=5"]
MOTOR = Path(RAD, "jocuri", "_motor", "motor.js").read_text(encoding="utf-8")
BUN = "doar citește\n    const b=citesteJoc(C.cheie);"
assert BUN in MOTOR, "reparația nu e pe disc"
DEFECT = MOTOR.replace(BUN, "doar citeșteconst b=citesteJoc(C.cheie);")


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = socketserver.TCPServer(("127.0.0.1", 0), partial(Tacut, directory=RAD))
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()


def ruleaza(b, pg, cu_profil, defect):
    ctx = b.new_context(user_agent="LearningHub-lectii/1.0 (educational site)")

    def ruta(r):
        u = r.request.url
        if "127.0.0.1" not in u:
            return r.abort()
        if defect and u.split("?")[0].endswith("/_motor/motor.js"):
            return r.fulfill(status=200, content_type="application/javascript", body=DEFECT)
        return r.continue_()

    ctx.route("**/*", ruta)
    page = ctx.new_page()
    erori = []
    page.on("pageerror", lambda e: erori.append(str(e)))
    page.goto(f"http://127.0.0.1:{port}/{pg}")
    if cu_profil:
        page.evaluate("localStorage.setItem('learninghub_active_profile','p_test_elev');"
                      "localStorage.setItem('lh_prezenta',JSON.stringify({nume:'Elev Test'}))")
        page.reload()
    page.wait_for_timeout(900)
    txt = page.evaluate("document.body.innerText.length")
    ctx.close()
    return erori, txt


probleme = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for cu_profil in (True, False):
        for pg in PAGINI:
            erori, txt = ruleaza(b, pg, cu_profil, False)
            ok = not erori and txt > 200
            probleme += 0 if ok else 1
            print(f"{'OK      ' if ok else 'PROBLEMĂ'} {'profil_fara_progres' if cu_profil else 'fara_profil':20} {pg:34} text={txt} erori={erori[:2]}")
    erori, txt = ruleaza(b, "jocuri/excel-viii/", True, True)
    prins = bool(erori)
    print(f"CONTROL defect re-injectat: {'PRINS' if prins else 'NEPRINS (proba e oarbă)'} erori={erori[:1]}")
    probleme += 0 if prins else 1
    b.close()
srv.shutdown()
print(probleme)
