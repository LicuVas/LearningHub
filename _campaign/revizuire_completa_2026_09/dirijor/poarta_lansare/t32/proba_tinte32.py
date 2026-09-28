"""Proba țintelor de atingere ≥ 32 px (regula 20) în componentele COMUNE, 28.09.2026.

Ce măsoară, la 390 px cu atingere și la 1280 px, în fiecare pas, în atelier și la prima întrebare de verificare:
  - „Am nevoie de un indiciu” (motor.js, .ajutor > button) și orice buton .btn.sm al motorului;
  - „Mărește fotografia” (lectii/_sim/fotografie.js, .foto-zoom) și butoanele din simulatorul de fotografii;
  - „Verifică-te” (details.verif > summary) oriunde apare;
  - butoanele din wordobj-formatare.js (.wo-jos .btn).
Pentru fiecare: lățime și înălțime ≥ 32 px, iar centrul lui îl lovește pe el (nu e acoperit). Plus SUPRAPUNERI: perechi
de ținte vizibile (butoane, legături, summary) ale căror dreptunghiuri se intersectează, numărate pe fiecare ecran —
proba „dupa” trebuie să nu aibă suprapuneri NOI față de „inainte”.
    python proba_tinte32.py inainte|dupa     -> tinte32_<eticheta>.json
    python proba_tinte32.py compara          -> ultima linie: probleme (ținte < 32 px în „dupa” + suprapuneri noi)
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(r"C:\00\Projects\LearningHub")
OUT = Path(__file__).resolve().parent
PORT = 8783
BASE = f"http://127.0.0.1:{PORT}"
DISP = {"390-atingere": {"viewport": {"width": 390, "height": 844}, "has_touch": True, "is_mobile": True, "device_scale_factor": 2},
        "1280": {"viewport": {"width": 1280, "height": 900}}}
PAGINI = ["lectii/v/m1-l02/index.html", "lectii/v/m1-l03/index.html", "lectii/v/m1-l04/index.html", "lectii/v/m1-l05/index.html",
          "lectii/vii/m1-l06/index.html", "jocuri/excel-viii/index.html"]
SEL = ".ajutor > button, #app .btn.sm, .foto-zoom, [class^='foto'] button, details.verif > summary, .wo-jos .btn"
MASOARA = """sel=>{const vede=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
  const nume=e=>(e.innerText||e.getAttribute('aria-label')||e.className||e.tagName).trim().replace(/\\s+/g,' ').slice(0,40);
  const tinte=[...document.querySelectorAll(sel)].filter(vede).map(e=>{e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect(),
      h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {n:nume(e),w:Math.round(r.width*10)/10,h:Math.round(r.height*10)/10,acoperit:!(h&&(h===e||e.contains(h)))}});
  const toate=[...document.querySelectorAll('#app button, #app a[href], #app summary, #app input, #app select')].filter(vede);
  let supr=0;const L=[];
  for(let i=0;i<toate.length;i++){const a=toate[i].getBoundingClientRect();for(let j=i+1;j<toate.length;j++){const x=toate[j];
    if(toate[i].contains(x)||x.contains(toate[i]))continue;const b=x.getBoundingClientRect();
    if(a.left<b.right-0.5&&b.left<a.right-0.5&&a.top<b.bottom-0.5&&b.top<a.bottom-0.5){supr++;if(L.length<6)L.push(nume(toate[i])+' × '+nume(x))}}}
  return {tinte,supr,L}}"""


def ecrane(pg):
    """(nume, funcție) pentru fiecare ecran de măsurat: pașii, atelierul, prima întrebare (cu indiciul)"""
    L = pg.evaluate("(()=>{const L=JocMotor.test.config().nivele[0];return {pasi:(L.pasi||[]).length,atelier:!!L.atelier}})()")
    out = [(f"P{k+1}", lambda k=k: pg.evaluate(f"JocMotor.test.pas({k})")) for k in range(L["pasi"])]
    if L["atelier"]:
        out.append(("atelier", lambda: pg.evaluate("JocMotor.test.atelier()")))
    if pg.evaluate("JocMotor.test.config().mod==='lectie'"):   # „Acum în aplicația adevărată” (acolo stau „Verifică-te”)
        out.append(("real", lambda: pg.evaluate("JocMotor.test.real()")))
    out.append(("Î1", lambda: pg.evaluate("(()=>{document.getElementById('go-home').click();document.querySelector('.lvl[data-l=\"0\"]').click();"
                                          "const g=document.getElementById('go');if(g)g.click()})()")))
    return out


def masoara(eticheta):
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(LH)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    rez = {}
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            for disp in DISP:
                for cale in PAGINI:
                    if not (LH / cale).exists():
                        continue
                    ctx = b.new_context(**DISP[disp])
                    ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())   # REGULA 24
                    if eticheta == "inainte":   # CSS-ul de dinainte, servit din copiile păstrate aici
                        # handler cu UN parametru (cu doi, Playwright pune cererea în al doilea și servirea eșuează)
                        def servire(copie, css):
                            corp = (OUT / copie).read_text(encoding="utf-8")
                            return lambda r: r.fulfill(status=200, body=corp, headers={"content-type": "text/css; charset=utf-8" if css else "application/javascript; charset=utf-8"})
                        for nume, copie in (("jocuri/_motor/motor.css", "motor.css.inainte_tinte"), ("lectii/_sim/fotografie.js", "fotografie.js.inainte_tinte")):
                            if (OUT / copie).exists():
                                ctx.route(f"**/{nume}*", servire(copie, nume.endswith(".css")))
                    pg = ctx.new_page()
                    erori = []
                    pg.on("pageerror", lambda e: erori.append(str(e)[:160]))
                    pg.on("console", lambda m: erori.append(m.text[:160]) if m.type == "error" and "Failed to load resource" not in m.text else None)
                    # „domcontentloaded” + așteptare: o resursă externă oprită (regula 24) poate întârzia „load”
                    pg.goto(f"{BASE}/{cale}", wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(800)
                    pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
                    pg.reload(wait_until="domcontentloaded", timeout=60000); pg.wait_for_timeout(1200)
                    pg.evaluate("document.querySelector('.lvl[data-l=\"0\"]').click()")
                    for nume, fa in ecrane(pg):
                        try:
                            fa(); pg.wait_for_timeout(250)
                            # deschide indiciul? nu: se măsoară butonul „Am nevoie de un indiciu” așa cum îl vede elevul
                            m = pg.evaluate(MASOARA, SEL)
                        except Exception as e:
                            m = {"eroare": str(e)[:150]}
                        rez[f"{cale}@{disp}@{nume}"] = m
                    rez[f"{cale}@{disp}@erori"] = erori
                    ctx.close()
            b.close()
    finally:
        srv.terminate()
    (OUT / f"tinte32_{eticheta}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    mici = sorted({(k.split("@")[0].split("/")[1] + "/" + k.split("@")[0].split("/")[2], k.split("@")[1], t["n"], t["w"], t["h"])
                   for k, v in rez.items() if isinstance(v, dict) for t in v.get("tinte", []) if t["w"] < 32 or t["h"] < 32})
    for x in mici:
        print("SUB 32 px:", x)
    print(f"{eticheta}: {len(mici)} ținte sub 32 px (unice pe pagină/dispozitiv/nume)")
    print(len(mici))


def compara():
    a = json.loads((OUT / "tinte32_inainte.json").read_text(encoding="utf-8"))
    d = json.loads((OUT / "tinte32_dupa.json").read_text(encoding="utf-8"))
    probleme = []
    for k, v in d.items():
        if k.endswith("@erori"):
            if v:
                probleme.append(f"{k}: {v[:2]}")
            continue
        if "eroare" in v:
            probleme.append(f"{k}: {v['eroare']}"); continue
        for t in v["tinte"]:
            if t["w"] < 32 or t["h"] < 32:
                probleme.append(f"{k}: „{t['n']}” are {t['w']}x{t['h']} px")
            if t["acoperit"]:
                probleme.append(f"{k}: „{t['n']}” e acoperit (centrul lui lovește alt element)")
        s0 = a.get(k, {}).get("supr", 0)
        if v["supr"] > s0:
            probleme.append(f"{k}: suprapuneri {s0} -> {v['supr']}: {v['L'][:3]}")
    for x in probleme:
        print("PROBLEMĂ", x)
    print(f"{len(d)} ecrane comparate")
    print(len(probleme))


if __name__ == "__main__":
    if sys.argv[1] == "compara":
        compara()
    else:
        masoara(sys.argv[1])
