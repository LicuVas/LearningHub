"""Proba ETICHETEI de evidență peste TEXT (assets/js/prezenta.js, 07.11.2026).

De ce: judecătorul prezentării pe zone (lecția VIII/2, 390 px) a văzut eticheta „Sunt elev — mă înscriu” peste rânduri
din textul lecției: semi-transparentă, literele ei se amestecau cu ale paginii și nu se mai citea nimic. Regula de până
atunci o ferea doar de ce se poate apăsa. Acum se ferește și de text: plină în stânga -> strânsă în stânga -> strânsă în
dreapta, pe primul loc liber; dacă nu e niciunul, strânsă unde e doar text; peste ceva de apăsat, ascunsă (ca înainte).

Cum măsoară (altfel decât codul etichetei): pagina se derulează în pași de 60 px; după fiecare pas (și după ce eticheta
s-a așezat), eticheta e ascunsă o clipă și browserul spune, cu `caretRangeFromPoint`, ce LITERĂ e sub fiecare punct al ei
(o rețea de 4 px); un punct „pe text” = punctul e chiar în dreptunghiul literei. La fel, „de apăsat” = buton, legătură,
câmp, celulă de simulator sub punct.

  python proba_eticheta_text.py [--prezenta <alt prezenta.js, ex. versiunea veche>] [--poze <dosar>]

Ce raportează, pe fiecare ecran (390 px cu atingere, 1280 px) x pagină x stare (vizitator, „Spune cine ești” strânsă):
  T = poziții în care eticheta VIZIBILĂ acoperă litere; L = dintre ele, câte aveau un loc liber (nici text, nici de apăsat)
  în care eticheta ar fi încăput (plină în stânga, strânsă în stânga sau în dreapta); A = poziții în care acoperă ceva de
  apăsat. Ultima linie = L + A însumate (0 = eticheta stă peste text doar când nu are unde altundeva și niciodată peste
  ceva de apăsat).
"""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


# ce e sub dreptunghiul [l,t,r,b] (eticheta ascunsă o clipă): {text: puncte pe litere, apasa: puncte pe ceva de apăsat}
SUB = """([l,t,r,b])=>{const box=document.getElementById('lhp'),v=box.style.visibility;box.style.visibility='hidden';
  const de=e=>!!(e&&e.closest&&e.closest('a,button,input,select,textarea,summary,label,[role=button],[role=link],[role=tab],[tabindex]:not([tabindex="-1"]),td[data-a]'));
  let text=0,apasa=0,tot=0;
  for(let x=l+2;x<=r-2;x+=4)for(let y=t+2;y<=b-2;y+=4){tot++;
    const e=document.elementFromPoint(x,y);if(de(e)){apasa++;continue}
    const c=document.caretRangeFromPoint?document.caretRangeFromPoint(x,y):null;
    if(c&&c.startContainer&&c.startContainer.nodeType===3){const n=c.startContainer,o=c.startOffset;
      for(const [a,z] of [[o,o+1],[o-1,o]]){if(a<0||z>n.length)continue;const rg=document.createRange();rg.setStart(n,a);rg.setEnd(n,z);
        if(!/\\S/.test(rg.toString()))continue;
        const q=rg.getBoundingClientRect();if(x>=q.left&&x<=q.right&&y>=q.top&&y<=q.bottom){text++;break}}}}
  box.style.visibility=v;return {text,apasa,tot}}"""

ETICHETA = """()=>{const box=document.getElementById('lhp');if(!box||!box.firstElementChild)return null;
  const p=box.firstElementChild;if(!p.classList.contains('pill'))return {pill:false};
  const cs=getComputedStyle(box),r=p.getBoundingClientRect();
  return {pill:true,vizibil:!box.classList.contains('ferit')&&cs.opacity!=='0'&&cs.visibility!=='hidden',cls:box.className,r:[r.left,r.top,r.right,r.bottom],
    W:document.documentElement.clientWidth,H:innerHeight}}"""

# mărimea etichetei în cele două forme (măsurată o dată, ca în pagină)
FORME = """()=>{const box=document.getElementById('lhp'),p=box.firstElementChild,c0=box.className;
  box.className='';const q=p.getBoundingClientRect();box.className='mini';const m=p.getBoundingClientRect();box.className=c0;
  return {w:q.width,h:q.height,mw:Math.max(32,m.width),mh:Math.max(32,m.height),B:box.getBoundingClientRect().bottom}}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prezenta", help="servește ALT assets/js/prezenta.js (ex. versiunea dinainte), fără să-l pui pe disc")
    ap.add_argument("--poze", help="dosar pentru o poză la cea mai rea poziție (opțional)")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = "http://127.0.0.1:%d" % srv.server_address[1]
    PAGINI = [("VIII/2 pasul 3 (panglica)", "/lectii/viii/m1-l02/", ("Interfața aplicației", 2)),
              ("VIII/2 pasul 2 (zone)", "/lectii/viii/m1-l02/", ("Interfața aplicației", 1)),
              ("VIII/4 pasul 1", "/lectii/viii/m1-l04/", None),
              ("joc excel-viii", "/jocuri/excel-viii/index.html", None)]
    rez, suma, totP = [], 0, [0]
    with sync_playwright() as p:
        br = p.chromium.launch()
        for ecr, vp, tel in (("390", {"width": 390, "height": 844}, True), ("1280", {"width": 1280, "height": 800}, False)):
            for stare in ("vizitator", "spune"):
                for nume, cale, intra in PAGINI:
                    ctx = br.new_context(viewport=vp, reduced_motion="reduce", **({"is_mobile": True, "has_touch": True, "device_scale_factor": 2} if tel else {}))
                    ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())
                    ctx.route("**/api/**", lambda r: r.fulfill(status=200, body="{}", headers={"access-control-allow-origin": "*"}))
                    if a.prezenta:
                        ctx.route("**/assets/js/prezenta.js*", lambda r: r.fulfill(status=200, body=Path(a.prezenta).read_text(encoding="utf-8"),
                                                                                   headers={"content-type": "application/javascript; charset=utf-8"}))
                    pg = ctx.new_page()
                    erori = []
                    pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
                    pg.goto(baza + cale, wait_until="load")
                    if stare == "vizitator":
                        pg.evaluate("localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
                        pg.reload(wait_until="load")
                    pg.wait_for_timeout(500)
                    pg.mouse.wheel(0, 1); pg.wait_for_timeout(300)   # primul gest: întrebarea se strânge în etichetă
                    if intra:
                        b = pg.locator("button", has_text=intra[0])
                        if b.count():
                            b.first.click(); pg.wait_for_timeout(400)
                            for _ in range(intra[1]):
                                pg.locator("#pas-next").click(); pg.wait_for_timeout(450)
                    pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(350)
                    if not (pg.evaluate(ETICHETA) or {}).get("pill"):
                        rez.append((ecr, nume, stare, None)); ctx.close(); continue
                    f = pg.evaluate(FORME)
                    inalt = pg.evaluate("document.documentElement.scrollHeight")
                    T = L = A = n = P = 0
                    rau = None
                    for y in range(0, max(1, inalt - vp["height"]) + 60, 60):
                        pg.evaluate("y=>window.scrollTo(0,y)", y)
                        pg.wait_for_timeout(330)   # eticheta se așază după ce se oprește derularea (~220 ms)
                        e = pg.evaluate(ETICHETA)
                        if not e or not e.get("pill"):
                            continue
                        n += 1
                        if not e["vizibil"]:
                            continue
                        s = pg.evaluate(SUB, e["r"])
                        if s["apasa"]:
                            A += 1
                        if s["text"]:
                            T += 1
                            P += s["text"]
                            W, B = e["W"], f["B"]
                            locuri = [[12, B - f["h"], 12 + f["w"], B], [12, B - f["mh"], 12 + f["mw"], B], [W - 8 - f["mw"], B - f["mh"], W - 8, B]]
                            if any((lambda q: q["text"] == 0 and q["apasa"] == 0)(pg.evaluate(SUB, l)) for l in locuri):
                                L += 1
                                if rau is None:
                                    rau = y
                    if rau is not None and a.poze:
                        pg.evaluate("y=>window.scrollTo(0,y)", rau); pg.wait_for_timeout(330)
                        Path(a.poze).mkdir(parents=True, exist_ok=True)
                        pg.screenshot(path=str(Path(a.poze) / ("%s_%s_%s.png" % (ecr, stare, nume.replace("/", "-").replace(" ", "_")))))
                    rez.append((ecr, nume, stare, (n, T, L, A, P, len(erori))))
                    suma += L + A + len(erori)
                    totP[0] += P
                    print("%4s %-26s %-9s poziții %3d · peste text %3d (avea loc liber: %d; puncte pe litere: %d) · peste ceva de apăsat %d · erori JS %d"
                          % (ecr, nume, stare, n, T, L, P, A, len(erori)), flush=True)
                    ctx.close()
        br.close()
    srv.shutdown()
    print("Total puncte pe litere acoperite (rețea de 4 px, toate pozițiile): %d" % totP[0])
    print(suma)
    return 1 if suma else 0


if __name__ == "__main__":
    sys.exit(main())
