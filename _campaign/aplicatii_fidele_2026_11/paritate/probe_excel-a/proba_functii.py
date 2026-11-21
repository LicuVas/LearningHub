"""Proba excel-a (3): fiecare funcție de foaie de calcul din motorul vechi (proba_src/jocuri/_motor/tip-foaie.js, evaluate)
față de biblioteca nouă (aplicatii/excel.js), pe ACELEAȘI date. Vechiul: evaluate() chemat direct în pagină (scriptul
vechi injectat, cu un JocMotor.expandRange minim). Noul: formula tastată în celulă (caseta de nume → adresa → text → Enter),
citită din LH.aplicatii.stare('excel'). Headless, rețeaua blocată în afara 127.0.0.1.
Rulare: python proba_functii.py <port>."""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

PORT = sys.argv[1] if len(sys.argv) > 1 else "8764"
URL = f"http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=excel"
OUT = __file__.replace(".py", ".json")
VECHI = pathlib.Path(__file__).resolve().parents[1] / "proba_src" / "jocuri" / "_motor" / "tip-foaie.js"

# datele: poligonul are A1:D4 (Elev, Nota 1, Nota 2, Media / Ana 9 10 / Bogdan 7 8 / Dan 8 6); adăugăm P1:P9
DATE_P = {"P1": "-2,5", "P2": "2,341", "P3": "2,349", "P4": "16", "P5": "-1", "P6": "7", "P7": "3", "P8": "  a   b ", "P9": "10"}
FORMULE = [
    ("SUM", "=SUM(B2:C4)"), ("SUM", "=SUM(B2;C2;5)"), ("SUM", "=SUM(A2:A4)"),
    ("AVERAGE", "=AVERAGE(B2:C4)"), ("AVERAGE", "=AVERAGE(D2:D4)"),
    ("MIN", "=MIN(B2:C4)"), ("MIN", "=MIN(D2:D4)"), ("MAX", "=MAX(B2:C4)"), ("MAX", "=MAX(D2:D4)"),
    ("COUNT", "=COUNT(A1:C4)"), ("COUNTA", "=COUNTA(A1:C4)"), ("COUNTBLANK", "=COUNTBLANK(D2:D4)"),
    ("COUNTIF", "=COUNTIF(B2:C4;\">=8\")"), ("COUNTIF", "=COUNTIF(A2:A4;\"B*\")"), ("COUNTIF", "=COUNTIF(A2:A4;\"ana\")"),
    ("SUMIF", "=SUMIF(B2:B4;\">7\";C2:C4)"), ("SUMIF", "=SUMIF(B2:B4;\">7\")"),
    ("AVERAGEIF", "=AVERAGEIF(B2:B4;\">7\")"), ("AVERAGEIF", "=AVERAGEIF(B2:B4;\">100\")"),
    ("ROUND", "=ROUND(10/3;2)"), ("ROUND", "=ROUND(P1;0)"), ("ROUNDUP", "=ROUNDUP(P2;1)"), ("ROUNDDOWN", "=ROUNDDOWN(P3;1)"),
    ("INT", "=INT(P1)"), ("ABS", "=ABS(P5)"), ("SQRT", "=SQRT(P4)"), ("SQRT", "=SQRT(P5)"),
    ("POWER", "=POWER(2;3)"), ("MOD", "=MOD(P6;P7)"), ("MOD", "=MOD(P6;0)"), ("MOD", "=MOD(-7;3)"),
    ("LEN", "=LEN(A3)"), ("UPPER", "=UPPER(A2)"), ("LOWER", "=LOWER(A3)"), ("TRIM", "=TRIM(P8)"),
    ("LEFT", "=LEFT(A3;3)"), ("LEFT", "=LEFT(A3)"), ("RIGHT", "=RIGHT(A3;2)"), ("MID", "=MID(A3;2;3)"),
    ("CONCATENATE", "=CONCATENATE(A2;\" \";B2)"), ("CONCAT", "=CONCAT(A2;B2)"),
    ("AND", "=AND(B2>5;C2>5)"), ("OR", "=OR(B2>9;C2>9)"), ("NOT", "=NOT(B2>5)"), ("NOT", "=NOT(A2)"),
    ("IF", "=IF(B2>=5;\"admis\";\"respins\")"), ("IF", "=IF(B3>8;1)"), ("IF", "=IF(A2;1;2)"),
    ("#NAME?", "=SUMA(B2:B4)"), ("#NAME?", "=FOO(1)"), ("#DIV/0!", "=B2/0"), ("#VALUE!", "=A2+1"),
    ("operatori", "=2^3"), ("operatori", "=-2^2"), ("operatori", "=10%"), ("operatori", "=A2&\" \"&B2"),
    ("operatori", "=(1&2)+3"), ("operatori", "=B2>B3"), ("operatori", "=B2*C2-B3/2"),
    ("ghilimele", "=LEN(„Ana”)"), ("circular", "=SELF"),
]


def local(route):
    u = route.request.url
    return route.continue_() if u.startswith(f"http://127.0.0.1:{PORT}/") else route.abort()


def main():
    rez = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1400, "height": 900})
        ctx.route("**/*", local)
        pg = ctx.new_page()
        pg.goto(URL)
        pg.wait_for_function("() => window.LH && LH.aplicatii && LH.aplicatii.stare('excel')", timeout=20000)
        pg.wait_for_timeout(800)
        # motorul vechi, doar evaluate (+ expandRange minim, pe rânduri)
        pg.add_script_tag(content="window.JocMotor={expandRange:(a,b)=>{const p=x=>{const m=x.match(/^([A-Z]+)(\\d+)$/);return{c:m[1].charCodeAt(0)-65,r:+m[2]}};const A=p(a),B=p(b),o=[];for(let r=Math.min(A.r,B.r);r<=Math.max(A.r,B.r);r++)for(let c=Math.min(A.c,B.c);c<=Math.max(A.c,B.c);c++)o.push(String.fromCharCode(65+c)+r);return o}};")
        pg.add_script_tag(content=VECHI.read_text(encoding="utf-8"))

        def xy(t):
            return pg.evaluate("t => { const e = LH.aplicatii.element('excel', t); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }", t)

        def la(adresa):
            q = xy("camp:Name Box")
            pg.mouse.click(q[0], q[1]); pg.wait_for_timeout(40)
            pg.keyboard.press("Control+a"); pg.keyboard.type(adresa); pg.keyboard.press("Enter"); pg.wait_for_timeout(40)

        def scrie(adresa, text):
            la(adresa)
            pg.keyboard.type(text); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
            # o formulă neprimită lasă o fereastră / editarea: închidem
            s = pg.evaluate("() => LH.aplicatii.stare('excel')")
            info = {"dialog": s.get("dialog"), "mesaj": s.get("fereastra_mesaj"), "in_editare": s.get("ramane_in_editare")}
            if s.get("dialog") or s.get("ramane_in_editare"):
                pg.keyboard.press("Escape"); pg.wait_for_timeout(40); pg.keyboard.press("Escape"); pg.wait_for_timeout(40)
            return info

        for a, v in DATE_P.items():
            scrie(a, v)
        stare = pg.evaluate("() => LH.aplicatii.stare('excel').celule")
        date_vechi = {}
        for a, c in stare.items():
            if c.get("formula"):
                continue
            date_vechi[a] = c["valoare"]
        for i, (fn, f) in enumerate(FORMULE, start=1):
            a = f"R{i}"
            if f == "=SELF":
                f = "=" + a
            info = scrie(a, f)
            c = pg.evaluate("a => LH.aplicatii.stare('excel').celule[a] || null", a)
            vechi = pg.evaluate("""([f, d, a]) => { const get = x => (x in d ? d[x] : ''); try { const v = JocFoaie.evaluate(f, x => x === a ? (()=>{throw Object.assign(new Error('circular'),{show:'0'})})() : get(x)); return {valoare: v}; } catch (e) { return {eroare: e.show || '⚠', mesaj: e.message}; } }""", [f, date_vechi, a])
            rez.append({"functie": fn, "formula": f, "celula": a, "vechi": vechi, "nou": c, "nou_info": info})
        b.close()
    json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("scris", OUT, len(rez))


if __name__ == "__main__":
    main()
