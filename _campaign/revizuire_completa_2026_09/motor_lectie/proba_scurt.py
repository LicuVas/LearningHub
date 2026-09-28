"""Proba câmpului `aplicatieReala.scurt` (fila scurtă) fără să atingă paginile lecțiilor:
pe lecția V/4 (are `titlu`, nu are `scurt`) se pune la rulare scurt:'Laborator' în configurație și se verifică fila;
apoi se scoate `titlu` și se verifică întoarcerea la textele implicite. Ultima linie = numărul de probleme."""
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

LH = Path(r"C:\00\Projects\LearningHub")
PORT = 8767
probleme = []
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(LH)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 390, "height": 844})
        pg.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())   # REGULA 24: nicio cerere în afara serverului local (nici elevi falși în panoul profesorului)
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.on("console", lambda m: erori.append(m.text) if m.type == "error" and "net::ERR_FAILED" not in m.text else None)
        pg.goto(f"http://127.0.0.1:{PORT}/lectii/v/m1-l04/index.html", wait_until="networkidle")
        cfg_ar = "(()=>{const c=JocMotor.test.config();return c.nivele[0].aplicatieReala||c.aplicatieReala})()"

        def pas_real():
            pg.evaluate("document.getElementById('go-home').click()")
            pg.evaluate("document.querySelector('.lvl[data-l=\"0\"]').click()")
            pg.evaluate("JocMotor.test.real()")
            return pg.evaluate("""()=>({fila:document.querySelector('.tabs .now').innerText.trim(),
              h2:document.querySelector('#app h2').innerText.trim(),crumb:document.querySelector('#crumbs').innerText.split('›').pop().trim(),
              hud:document.querySelector('#hud').innerText})""")
        pg.evaluate(cfg_ar + ".scurt='Laborator'")
        a = pas_real()
        print("cu titlu + scurt:", a)
        if a["fila"] != "Laborator" or a["h2"] != "Acum la calculatorul din laborator" or a["crumb"] != a["h2"]:
            probleme.append(f"scurt/titlu: {a}")
        pg.evaluate("JocMotor.test.atelier()")
        fila_atelier = pg.evaluate("[...document.querySelectorAll('.tabs [data-pas=\"real\"]')].map(x=>[x.innerText,x.title])")
        print("fila ca buton (din atelier):", fila_atelier)
        if fila_atelier != [["Laborator", "Acum la calculatorul din laborator"]]:
            probleme.append(f"fila din atelier: {fila_atelier}")
        pg.evaluate(cfg_ar + ".titlu='';" + cfg_ar + ".scurt=''")
        b2 = pas_real()
        print("fără titlu:", b2)
        if b2["fila"] != "Aplicația" or b2["h2"] != "Acum în aplicația adevărată" or b2["crumb"] != "În aplicația adevărată":
            probleme.append(f"implicit: {b2}")
        # în JOCURI fraza de pe diplomă rămâne exact cea veche
        pg.goto(f"http://127.0.0.1:{PORT}/jocuri/excel-viii/index.html", wait_until="networkidle")
        pg.evaluate("JocMotor.test.deblocheaza();document.getElementById('go-home').click()")
        pg.evaluate("document.getElementById('dipl').click()")
        hj = pg.evaluate("[...document.querySelectorAll('#app p.hint')].map(h=>h.innerText.trim())")
        print("diploma în joc (excel-viii):", [h for h in hj if "profesorului" in h or "singur" in h])
        if "Arată-i profesorului diploma, apoi fă asta pe bune:" not in hj or any("verifică-i singur" in h for h in hj):
            probleme.append(f"fraza din diploma jocului s-a schimbat: {hj}")
        # și obiectivul din primul pas: în JOC rămâne „La finalul nivelului:”
        pg.evaluate("document.getElementById('go-home').click()")
        li = pg.evaluate("JocMotor.test.config().nivele.findIndex(L=>L.pasi&&L.obiectiv)")
        pg.evaluate("l=>document.querySelector('.lvl[data-l=\"'+l+'\"]').click()", li)
        ob = pg.evaluate("(()=>{const b=document.querySelector('.obiectiv b');return b?b.innerText.trim():null})()")
        print("obiectivul în joc (excel-viii, nivelul %d):" % (li + 1), ob)
        if ob != "La finalul nivelului:":
            probleme.append(f"obiectivul din joc: {ob!r}")
        if erori:
            probleme.append(f"erori: {erori[:3]}")
        b.close()
finally:
    srv.terminate()
for x in probleme:
    print("PROBLEMĂ", x)
print(len(probleme))
