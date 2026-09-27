"""Proba săgeții mici ↘ din colțul grupurilor de pe panglică („dialog launcher”, ui-panglica.js).

De ce (27.09.2026, semnalat de autorul lecției VII/6): numele grupului (.pg-nume) stătea PESTE săgeată și îi lua
clicul. Aici, pe panglica Word, Excel și PowerPoint, la calculator (1280 px, mouse) și pe telefon (Pixel 7, atingere):
  - fiecare săgeată e adusă în vedere, iar clicul / atingerea REALĂ pe ea ajunge la butonul ei;
  - pe telefon, zona de atingere a săgeții are cel puțin 32 x 32 px;
  - niciun alt buton din grupurile acelea nu pierde clicul: centrul lui încă îl lovește pe el.
    python proba_lansator.py [--ui-panglica <fișier>]   (--ui-panglica = servește altă versiune, ex. cea dinainte)
Ultima linie = numărul de probleme."""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]
PAGINI = [("Excel", "jocuri/excel-viii/index.html"), ("PowerPoint", "jocuri/prezentari-vi/index.html"),
          ("Word", "jocuri/word-vii/index.html"), ("Word (lecția VII/4)", "lectii/vii/m1-l04/index.html")]
probleme = []


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


GASESTE = """()=>{const C=JocMotor.test.config(),out=[];C.nivele.forEach((L,li)=>{if(!L.pasi)return;
  if(L.atelier)out.push([li,'atelier',0]);L.pasi.forEach((P,si)=>{const n=[P.incearca].concat(P.inca||[]).filter(Boolean).length;for(let k=0;k<n;k++)out.push([li,'p'+si,k])})});return out}"""
GRUPURI = "()=>[...document.querySelectorAll('.pg .pg-grup')].map((g,i)=>g.querySelector('.pg-lans')?i:-1).filter(i=>i>=0)"
MASOARA = """i=>{const g=document.querySelectorAll('.pg .pg-grup')[i],l=g.querySelector('.pg-lans'),b=l.closest('.pg-b');
  b.scrollIntoView({block:'center',inline:'nearest'});   // ca elevul: derulează panglica până vede săgeata
  const r=l.getBoundingClientRect(),rb=b.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
  const e=document.elementFromPoint(x,y);window.__lans=b;window.__lovit=null;
  // celelalte butoane din grup, doar cele al căror centru se vede acum (în ecran și în porțiunea vizibilă a panglicii)
  const bz=g.closest('.pg-banda').getBoundingClientRect();
  const alte=[...g.querySelectorAll('.pg-b')].filter(o=>o!==b&&o.offsetParent!==null).map(o=>{const q=o.getBoundingClientRect(),cx=q.x+q.width/2,cy=q.y+q.height/2;
    if(cx<Math.max(0,bz.left)||cy<Math.max(0,bz.top)||cx>Math.min(innerWidth,bz.right)||cy>Math.min(innerHeight,bz.bottom))return null;
    // doar butoanele pe care le acoperă SĂGEATA (zona ei mărită); suprapunerile vechi dintre alte butoane nu țin de ea
    const h=document.elementFromPoint(cx,cy);return h&&h.closest&&h.closest('.pg-b')===b?(o.getAttribute('aria-label')||o.getAttribute('title')||'?'):null}).filter(Boolean);
  return {grup:g.getAttribute('aria-label'),x,y,lovit:e?String(e.className||e.tagName):null,eu:!!(e&&e.closest&&e.closest('.pg-b')===b),w:rb.width,h:rb.height,alte}}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ui-panglica")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8781), functools.partial(Tacut, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    from playwright.sync_api import sync_playwright
    sageti = 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        for disp, cfg in (("calculator", {"viewport": {"width": 1280, "height": 800}}), ("telefon", p.devices["Pixel 7"])):
            for app, cale in PAGINI:
                if not (SITE / cale).exists():
                    continue
                ctx = br.new_context(**cfg)
                ctx.route("**/api/**", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
                if a.ui_panglica:
                    ctx.route("**/_motor/ui-panglica.js*", lambda r: r.fulfill(status=200, body=Path(a.ui_panglica).read_text(encoding="utf-8"),
                                                                               headers={"content-type": "application/javascript; charset=utf-8"}))
                # ținta se ia la PRIMUL eveniment (pointerdown): unele simulatoare redesenează panglica înainte de click
                ctx.add_init_script("document.addEventListener('pointerdown',e=>{if(window.__lovit===null)window.__lovit=e.target&&e.target.closest?e.target.closest('.pg-b'):false},true)")
                pg = ctx.new_page()
                erori = []
                pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
                pg.goto("http://127.0.0.1:8781/" + cale, wait_until="load")
                pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
                pg.reload(wait_until="load")
                pg.evaluate("JocMotor.test.deblocheaza();document.getElementById('go-home').click()")
                gasit = None
                for li, unde, k in pg.evaluate(GASESTE):   # primul loc (atelier / exercițiu) cu panglică reală și săgeți
                    pg.evaluate("document.getElementById('go-home').click()")
                    pg.evaluate("l=>document.querySelector('.lvl[data-l=\"'+l+'\"]').click()", li)
                    if unde == "atelier":
                        pg.evaluate("JocMotor.test.atelier()")
                    else:
                        pg.evaluate("JocMotor.test.pas(%d)" % int(unde[1:])); pg.evaluate("JocMotor.test.exercitiu(%d)" % k)
                    pg.wait_for_timeout(700)
                    if pg.evaluate(GRUPURI):
                        gasit = (li, unde, k)
                        break
                tag = "%s %s" % (app, disp)
                if not gasit:
                    probleme.append("%s: nicio panglică cu săgeți ↘ găsită" % tag); print("  RĂU  " + probleme[-1]); ctx.close(); continue
                grupuri = pg.evaluate(GRUPURI)
                for i in grupuri:
                    pg.evaluate(MASOARA, i)          # derulează până la săgeată; pe telefon bara de sus se strânge după derulare
                    pg.wait_for_timeout(350)
                    m = pg.evaluate(MASOARA, i)      # abia acum, cu pagina oprită, elevul ochește
                    sageti += 1
                    if disp == "telefon":
                        pg.touchscreen.tap(m["x"], m["y"])
                    else:
                        pg.mouse.click(m["x"], m["y"])
                    ajuns = pg.evaluate("!!window.__lovit&&window.__lovit===window.__lans")
                    if not ajuns:
                        m["lovit_real"] = pg.evaluate("window.__lovit===null?'niciun pointerdown':window.__lovit?(window.__lovit.getAttribute('aria-label')||window.__lovit.className):'în afara panglicii'")
                        m["lovit_real"] += " · punct %s,%s · acum săgeata e la %s" % (round(m["x"]), round(m["y"]), pg.evaluate(
                            "i=>{const r=document.querySelectorAll('.pg .pg-grup')[i].querySelector('.pg-lans').getBoundingClientRect();return [Math.round(r.x+r.width/2),Math.round(r.y+r.height/2),innerWidth,innerHeight,document.activeElement&&document.activeElement.tagName]}", i))
                    rele = []
                    if not m["eu"]:
                        rele.append("clicul pe săgeată lovește %r" % m["lovit"])
                    if not ajuns:
                        rele.append("clicul REAL nu ajunge la săgeată (ajunge la: %s)" % m.get("lovit_real"))
                    if disp == "telefon" and (m["w"] < 32 or m["h"] < 32):
                        rele.append("zona de atingere %dx%d px (trebuie ≥ 32)" % (m["w"], m["h"]))
                    if m["alte"]:
                        rele.append("butoane care nu mai primesc clicul: %s" % m["alte"])
                    if rele:
                        probleme.append("%s, grupul %s: %s" % (tag, m["grup"], "; ".join(rele))); print("  RĂU  " + probleme[-1])
                    pg.keyboard.press("Escape")
                print("%s: %d săgeți verificate (nivelul %d, %s)" % (tag, len(grupuri), gasit[0] + 1, gasit[1]))
                if erori:
                    probleme.append("%s: erori JavaScript: %s" % (tag, erori[:2]))
                ctx.close()
        br.close()
    srv.shutdown()
    print("Săgeți ↘ verificate: %d (Word, Excel, PowerPoint; calculator și telefon)" % sageti)
    print("Rezultat: " + ("TOATE OK" if not probleme else "%d probleme" % len(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
