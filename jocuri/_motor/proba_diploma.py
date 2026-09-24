"""Proba DIPLOMEI din browser (24.09.2026): QR spre telefon + „Trimite-o profesorului”.

  python proba_diploma.py [--baza http://127.0.0.1:8765] [--joc excel-viii] [--fara-trimitere]

Fără --baza pornește un server local pe folderul LearningHub. Joacă „ca un elev” pe un calculator de
laborator (1366 px): deblochează nivelurile, deschide diploma, scrie numele, verifică QR-ul, alege școala și
clasa, apasă Trimite și citește confirmarea. Apoi deschide linkul din QR ca un TELEFON (390 px) și
verifică: diploma e desenată (imagine > 50 KB), numele e pe ea, butoanele există, nimic nu iese din ecran.
Diploma trimisă e ștearsă imediat de pe server (`diplome.py descarca --dir <temp>`), deci nu ajunge
în folderul real al profesorului. Ultima linie = numărul de probleme.
"""
import argparse
import functools
import http.server
import subprocess
import sys
import tempfile
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(__file__).resolve().parents[2]
NUME = "Proba Laborator Diplomă"
probleme = []


def verifica(cond, ce):
    print(("  ok   " if cond else "  RĂU  ") + ce)
    if not cond:
        probleme.append(ce)


def server_local():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(LH))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8765), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8765"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--joc", default="excel-viii")
    ap.add_argument("--fara-trimitere", action="store_true")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        pc = br.new_page(viewport={"width": 1366, "height": 800})
        erori = []
        pc.on("pageerror", lambda e: erori.append(str(e)))
        pc.goto("%s/jocuri/%s/index.html" % (baza, a.joc), wait_until="networkidle")
        pc.evaluate("localStorage.clear()")
        pc.reload(wait_until="networkidle")
        pc.evaluate("JocMotor.test.deblocheaza()")
        pc.reload(wait_until="networkidle")
        pc.click("#dipl")
        pc.wait_for_selector("#d-nume")
        pc.fill("#d-nume", NUME)
        pc.wait_for_function("document.querySelector('#d-qr svg')", timeout=10000)
        link = pc.get_attribute("#d-link", "href")
        verifica(bool(link) and "/jocuri/diploma/#d=" in link, "QR + link spre pagina de telefon")
        verifica(pc.inner_text(".diploma .nm") == NUME, "numele scris apare pe diploma din joc")
        pc.wait_for_function("document.querySelectorAll('#d-scoala option').length>2", timeout=10000)
        verifica(pc.is_disabled("#d-trimite"), "Trimite e oprit până alegi clasa")
        if not a.fara_trimitere:
            pc.select_option("#d-scoala", "forestier")
            pc.select_option("#d-clasa", "X E")
            pc.click("#d-trimite")
            pc.wait_for_function("/Trimis|Nu s-a/.test(document.getElementById('d-stare').textContent)", timeout=20000)
            st = pc.inner_text("#d-stare")
            verifica("Trimisă" in st, "confirmarea: %s" % st)
            verifica(pc.is_disabled("#d-trimite"), "după trimitere butonul nu mai trimite a doua oară")
        pc.screenshot(path=str(Path(tempfile.gettempdir()) / "qa_diploma_laborator.png"), full_page=True)
        # elevul următor, pe același calculator
        pc.reload(wait_until="networkidle")
        verifica(pc.is_visible("#alt-elev") and NUME in pc.inner_text(".alt-elev"), "cuprinsul arată cine a jucat înainte + „Sunt alt elev”")
        pc.click("#alt-elev")
        verifica(pc.input_value("#nume") == NUME, "o singură apăsare NU șterge (cere confirmare)")
        pc.click("#alt-elev")
        verifica(pc.input_value("#nume") == "" and pc.locator("#dipl").count() == 0 and pc.locator("#alt-elev").count() == 0,
                 "a doua apăsare: nume gol, fără diplomă, butonul dispare")
        verifica(pc.evaluate("document.activeElement.id") == "nume", "cursorul stă în câmpul de nume")
        verifica(pc.locator(".lvl:not([disabled])").count() == 1, "doar primul nivel e deschis")
        verifica(not erori, "fără erori JS pe pagina jocului %s" % erori[:2])

        tel = br.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        tel.goto(link, wait_until="networkidle")
        tel.wait_for_function("document.getElementById('dipl').src.startsWith('data:image/png')", timeout=10000)
        marime = tel.evaluate("document.getElementById('dipl').src.length")
        verifica(marime > 50000, "telefonul desenează diploma (%d octeți)" % marime)
        verifica(tel.input_value("#nume") == NUME, "numele din QR ajunge pe telefon")
        verifica(tel.evaluate("document.documentElement.scrollWidth<=innerWidth"), "nimic mai lat decât ecranul telefonului")
        verifica(tel.get_attribute("#save", "download", timeout=3000).startswith("diploma - "), "„Salvează poza” are nume de fișier")
        tel.screenshot(path=str(Path(tempfile.gettempdir()) / "qa_diploma_telefon.png"), full_page=True)
        br.close()

    if not a.fara_trimitere:
        d = tempfile.mkdtemp(prefix="proba_diploma_lab_")
        r = subprocess.run([sys.executable, r"C:\00\AI_0\tools\diplome.py", "descarca", "--dir", d],
                           capture_output=True, text=True, encoding="utf-8")
        png = list(Path(d).rglob("*.png"))
        verifica(r.returncode == 0 and len(png) == 1 and NUME in str(png[0]) and "Clasa X E" in str(png[0]),
                 "profesorul o primește la Forestier\\Clasa X E\\%s (%s)" % (NUME, png[0].relative_to(d) if png else r.stdout[-200:]))
    print(len(probleme))


if __name__ == "__main__":
    main()
