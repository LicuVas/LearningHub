"""Proba TRAGERII cu mouse-ul în foaia Excel simulată (tip-excel.js): selecția = exact zona trasă.

De ce (27.09.2026, găsit de autorul lecției VIII/4): la începutul unei trageri, `gw().focus()` fără
`{preventScroll:true}` derula pagina (~18 px) ca să aducă foaia în vedere, iar celula de sub mouse se schimba:
elevul trăgea B1→D3 și primea altă zonă. Aici foaia se pune pe rând în poziții în care e tăiată de marginea
ecranului (sus sau jos), elevul „ochește” celulele ÎNAINTE să apese, trage cu mouse-ul adevărat (Playwright),
iar zona selectată (antetele de rând/coloană aprinse) trebuie să fie exact cea ochită. Se mai măsoară saltul paginii.
    python proba_tragere.py [--joc excel-viii] [--nivel 2]
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
probleme = []


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


ZONA = """()=>{const w=document.querySelector('#body .gw');if(!w)return null;
  const cs=[...w.querySelectorAll('thead th.on')].map(x=>x.innerText.trim()),rs=[...w.querySelectorAll('tbody th.on')].map(x=>x.innerText.trim());
  if(!cs.length||!rs.length)return null;const a=cs[0]+rs[0],b=cs[cs.length-1]+rs[rs.length-1];return a===b?a:a+':'+b}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--joc", default="excel-viii")
    ap.add_argument("--nivel", type=int, default=2)
    ap.add_argument("--tip-excel", help="servește ALT tip-excel.js (ex. versiunea dinainte de reparație), fără să-l pui pe disc")
    ap.add_argument("--capat", action="store_true", help="doar cazul „pagina derulată până la capăt” (vezi README §10)")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8776), functools.partial(Tacut, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    from playwright.sync_api import sync_playwright
    trageri = 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        for lat, inalt in ((1280, 720), (390, 844)):
            ctx = br.new_context(viewport={"width": lat, "height": inalt})
            ctx.route("**/api/**", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
            if a.tip_excel:
                ctx.route("**/_motor/tip-excel.js*", lambda r: r.fulfill(status=200, body=Path(a.tip_excel).read_text(encoding="utf-8"),
                                                                         headers={"content-type": "application/javascript; charset=utf-8"}))
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
            pg.goto("http://127.0.0.1:8776/jocuri/%s/index.html" % a.joc, wait_until="load")
            pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
            pg.reload(wait_until="load")
            pg.evaluate("JocMotor.test.deblocheaza();document.getElementById('go-home').click()")
            li = a.nivel - 1
            # primul pas al nivelului al cărui „Încearcă tu” e o foaie Excel (nu variante de răspuns)
            si = pg.evaluate("""li=>{const L=JocMotor.test.config().nivele[li];return (L.pasi||[]).findIndex(P=>P.incearca&&P.incearca.t==='excel'&&!Array.isArray(P.incearca.o))}""", li)
            if si < 0:
                probleme.append("nivelul %d nu are un „Încearcă tu” cu foaie Excel" % a.nivel)
                break
            pg.click('.lvl[data-l="%d"]' % li)
            pg.evaluate("JocMotor.test.pas(%d)" % si)
            pg.wait_for_timeout(300)
            celule = pg.evaluate("[...document.querySelectorAll('#body .gw td[data-a]')].map(t=>t.dataset.a)")
            cols = sorted({c[0] for c in celule})
            if not a.capat:   # loc de derulare sub pagină, ca foaia să poată fi dusă la marginea de SUS a ecranului
                pg.evaluate("document.body.style.paddingBottom=(innerHeight*2)+'px'")
            # foaia tăiată SUS (antetul ei deasupra ecranului) și JOS (ultimele rânduri sub marginea de jos);
            # --capat: pagina derulată până la capăt (fără loc sub ea), foaia unde ajunge
            pozitii = ["capat"] if a.capat else [-12, -18, -26, "jos-6", "jos-14", "jos-30"]
            for sus in pozitii:
                pg.evaluate("document.activeElement&&document.activeElement.blur&&document.activeElement.blur()")
                pg.evaluate("""s=>{const w=document.querySelector('#body .gw'),r=w.getBoundingClientRect();
                  if(s==='capat'){window.scrollTo(0,document.documentElement.scrollHeight);return}
                  const tinta=typeof s==='number'?s:innerHeight-r.height+Number(String(s).split('-')[1]);window.scrollBy(0,r.top-tinta)}""", sus)
                pg.wait_for_timeout(80)
                # rândurile ale căror celule se văd întregi acum: elevul trage doar între ce vede
                # „se vede” = în ecran ȘI neacoperită (bara de sus a jocului e lipită sus și acoperă ce trece pe sub ea)
                vaz = pg.evaluate("""h=>{const eu=(t,x,y)=>{const e=document.elementFromPoint(x,y);return !!e&&e.closest('td[data-a]')===t};
                  return [...new Set([...document.querySelectorAll('#body .gw td[data-a]')].filter(t=>{const r=t.getBoundingClientRect(),x=r.x+r.width/2;
                    return r.top>=0&&r.bottom<=h&&eu(t,x,r.top+2)&&eu(t,x,r.bottom-2)}).map(t=>+t.dataset.a.slice(1)))].sort((x,y)=>x-y)}""", inalt)
                if len(vaz) < 2:
                    continue
                perechi = [(cols[0] + str(vaz[0]), cols[-1] + str(vaz[-1])), (cols[-1] + str(vaz[-1]), cols[0] + str(vaz[0])),
                           (cols[1] + str(vaz[0]), cols[-2] + str(vaz[-1]))]
                for start, final in perechi:
                    pg.evaluate("document.activeElement&&document.activeElement.blur&&document.activeElement.blur()")
                    pg.evaluate("""s=>{const w=document.querySelector('#body .gw'),r=w.getBoundingClientRect();
                      if(s==='capat'){window.scrollTo(0,document.documentElement.scrollHeight);return}
                      const tinta=typeof s==='number'?s:innerHeight-r.height+Number(String(s).split('-')[1]);window.scrollBy(0,r.top-tinta)}""", sus)
                    pg.wait_for_timeout(80)
                    # elevul ochește celulele ÎNAINTE să apese
                    cA = pg.evaluate("a=>{const r=document.querySelector('#body td[data-a=\"'+a+'\"]').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.top,r.bottom]}", start)
                    cB = pg.evaluate("a=>{const r=document.querySelector('#body td[data-a=\"'+a+'\"]').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.top,r.bottom]}", final)
                    if min(cA[2], cB[2]) < 0 or max(cA[3], cB[3]) > inalt:   # o celulă ochită nu e vizibilă: poziția nu se poate juca
                        continue
                    y0 = pg.evaluate("scrollY")
                    pg.mouse.move(cA[0], cA[1])
                    pg.mouse.down()
                    salt = pg.evaluate("scrollY") - y0
                    for k in range(1, 9):
                        pg.mouse.move(cA[0] + (cB[0] - cA[0]) * k / 8, cA[1] + (cB[1] - cA[1]) * k / 8)
                    pg.mouse.up()
                    pg.wait_for_timeout(60)
                    z = pg.evaluate(ZONA)
                    ast = "%s:%s" % (min(start[0], final[0]) + str(min(int(start[1:]), int(final[1:]))), max(start[0], final[0]) + str(max(int(start[1:]), int(final[1:]))))
                    trageri += 1
                    ok = z == ast and salt == 0
                    if not ok:
                        probleme.append("%dpx, foaia la %s: tras %s→%s, selectat %s (trebuia %s), pagina a sărit %d px" % (lat, sus, start, final, z, ast, salt))
                        print("  RĂU  " + probleme[-1])
            if erori:
                probleme.append("%dpx: erori JavaScript: %s" % (lat, erori[:2]))
            ctx.close()
        br.close()
    srv.shutdown()
    print("Trageri cu mouse-ul în %s, nivelul %d: %d (foaia tăiată sus sau jos, 1280 și 390 px)" % (a.joc, a.nivel, trageri))
    print("Rezultat: " + ("TOATE OK" if not probleme else "%d probleme" % len(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
