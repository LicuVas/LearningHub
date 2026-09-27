"""Proba „ca elevul” pentru sarcinile de COPIERE / MUTARE din Excel: variantele se rezolvă DIN TEXTUL AFIȘAT.

De ce (27.09.2026, defect LIVE în excel-viii, nivelul 2): „Exersează pe variante” schimba numele și notele din foaie
(Ana -> Bianca), dar verifica.valori aștepta tot „Ana”: o copiere corectă era respinsă cu „În E2 trebuie scris „Ana””.
proba_exersare.py nu putea prinde asta: rezolvă variantele cu JocExcel.rezolvaPractica(), adică din chiar verificarea.
Aici elevul CITEȘTE textul variantei („Copiază tabelul B2:C3 începând din E2”), selectează cu mouse-ul (clic + Shift+clic),
apasă Ctrl+C, dă clic pe destinație, Ctrl+V (Ctrl+X la mutare) și apasă „Verifică varianta”. Trebuie acceptată.
Mai numără erorile din consolă (un clipboard refuzat nu are voie să scape ca „Uncaught (in promise)”).

Sarcinile se găsesc singure: orice sarcină `excel` (întrebare, „Încearcă tu”, „Încă un exercițiu”, atelier) al cărei text
spune „Copiază/Mută … <b>X:Y</b> … <b>Z</b>”.
    python proba_varianta_copiere.py [--joc excel-viii] [--n 12]
Ultima linie = numărul de probleme."""
import argparse
import functools
import http.server
import re
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]
probleme = []
RE_SARCINA = re.compile(r"\b(Copiază|Mută|copiază|mută)\b.*?\b([A-Z]{1,2}\d{1,3})(?::([A-Z]{1,2}\d{1,3}))?\b.*?(?:începând din|în|la|din)\s+([A-Z]{1,2}\d{1,3})\b", re.S)
RE_GOLESTE = re.compile(r"\b[gG]olește\b[^.]*?\b([A-Z]{1,2}\d{1,3})(?::([A-Z]{1,2}\d{1,3}))?\b")


def pasi_din_text(text):
    """Pașii elevului, în ordinea din text: ('copiaza'|'muta', c1, c2, dest) și ('goleste', c1, c2)."""
    out = []
    for m in RE_SARCINA.finditer(text):
        out.append((m.start(), ("muta" if m.group(1).lower() == "mută" else "copiaza", m.group(2), m.group(3) or m.group(2), m.group(4))))
    for m in RE_GOLESTE.finditer(text):
        out.append((m.start(), ("goleste", m.group(1), m.group(2) or m.group(1))))
    return [p for _, p in sorted(out)]


def verifica(cond, ce):
    if not cond:
        print("  RĂU  " + ce)
        probleme.append(ce)
    return cond


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def sarcini_din_config(pg):
    """[(nivel, unde, k, text)]: unde = 'q' (verificare), 'p<si>' (pas), 'atelier'; k = indexul exercițiului."""
    return pg.evaluate("""()=>{const out=[],C=JocMotor.test.config();const ex=Q=>Q&&Q.t==='excel'&&!Array.isArray(Q.o);
      C.nivele.forEach((L,li)=>{(L.pasi||[]).forEach((P,si)=>[P.incearca].concat(P.inca||[]).filter(Boolean).forEach((Q,k)=>{if(ex(Q))out.push([li,'p'+si,k,Q.q])}));
        if(L.atelier)[L.atelier].concat(L.atelier.inca||[]).forEach((Q,k)=>{if(ex(Q))out.push([li,'atelier',k,Q.q])});
        (L.qs||[]).forEach((Q,qi)=>{if(ex(Q))out.push([li,'q',qi,Q.q])})});return out}""")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--joc", default="excel-viii")
    ap.add_argument("--n", type=int, default=12)
    ap.add_argument("--tip-excel", help="servește ALT tip-excel.js (un candidat de reparație), fără să-l pui pe disc în _motor")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8775), functools.partial(Tacut, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = "http://127.0.0.1:8775"
    from playwright.sync_api import sync_playwright
    rezolvate = 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 1280, "height": 900})
        ctx.route("**/api/**", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
        if a.tip_excel:
            ctx.route("**/_motor/tip-excel.js*", lambda r: r.fulfill(status=200, body=Path(a.tip_excel).read_text(encoding="utf-8"),
                                                                     headers={"content-type": "application/javascript; charset=utf-8"}))
        pg = ctx.new_page()
        pg.set_default_timeout(8000)
        erori = []
        pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)[:160]))
        pg.on("console", lambda m: erori.append("console: " + m.text[:160]) if m.type == "error" else None)
        pg.goto("%s/jocuri/%s/index.html" % (baza, a.joc), wait_until="load")
        pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
        pg.reload(wait_until="load")
        pg.evaluate("JocMotor.test.deblocheaza()")
        toate = [s for s in sarcini_din_config(pg) if pasi_din_text(re.sub(r"<[^>]+>", "", s[3]))]
        for li, unde, k, qtext in toate:
            et = "N%d %s E%d" % (li + 1, unde, k + 1)
            pg.evaluate("document.getElementById('go-home').click()")
            pg.click('.lvl[data-l="%d"]' % li)
            if unde.startswith("p"):
                pg.evaluate("JocMotor.test.pas(%d)" % int(unde[1:])); pg.evaluate("JocMotor.test.exercitiu(%d)" % k)
            elif unde == "atelier":
                pg.evaluate("JocMotor.test.atelier()"); pg.evaluate("JocMotor.test.exercitiu(%d)" % k)
            else:
                pg.click("#go")
                for _ in range(k):
                    pg.evaluate("JocMotor.test.rezolva()")
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                    pg.click("#next")
            pg.evaluate("JocMotor.test.rezolva()")
            if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                pg.click("#chk")
            if not verifica(pg.locator("[data-exs]").count() == 1, "%s: după rezolvare lipsește „Exersează pe variante”" % et):
                continue
            pg.click("[data-exs]")
            for v in range(a.n):
                if v:
                    pg.click("[data-exa]")
                text = pg.inner_text(".xl-ex .q")
                pasi = pasi_din_text(text)
                if not verifica(bool(pasi), "%s v%d: nu pot citi sarcina din text: %r" % (et, v + 1, text)):
                    break
                cel = lambda ad: pg.locator("#xexb td[data-a='%s']" % ad)
                adrese = [x for ps in pasi for x in ps[1:]]
                if not verifica(all(cel(x).count() == 1 for x in adrese), "%s v%d: celulele din text (%s) nu sunt în foaie" % (et, v + 1, adrese)):
                    break
                for ps in pasi:   # ca elevul: clic, Shift+clic pe colțul opus, apoi tastele
                    cel(ps[1]).click()
                    if ps[2] != ps[1]:
                        cel(ps[2]).click(modifiers=["Shift"])
                    if ps[0] == "goleste":
                        pg.keyboard.press("Delete")
                        continue
                    pg.keyboard.press("Control+x" if ps[0] == "muta" else "Control+c")
                    cel(ps[3]).click()
                    pg.keyboard.press("Control+v")
                pg.click("[data-exv]")
                ok = pg.locator(".xl-ex .fb.ok").count() == 1
                if verifica(ok, "%s v%d: textul cere %s, făcut cu mouse-ul și tastele, dar e RESPINS: %s" % (
                        et, v + 1, pasi, pg.inner_text("#xexf")[:160])):
                    rezolvate += 1
                else:
                    pg.evaluate("JocExcel.rezolvaPractica()"); pg.click("[data-exv]")
            pg.click("[data-exg]")
        verifica(len(toate) > 0, "nicio sarcină de copiere/mutare găsită în %s (proba n-a verificat nimic)" % a.joc)
        verifica(not erori, "erori în consolă: %d, ex. %s" % (len(erori), erori[:2]))
        br.close()
    srv.shutdown()
    print("Sarcini de copiere/mutare în %s: %d · variante rezolvate DIN TEXT și acceptate: %d din %d" % (a.joc, len(toate), rezolvate, len(toate) * a.n))
    print("Rezultat: " + ("TOATE OK" if not probleme else "%d probleme" % len(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
