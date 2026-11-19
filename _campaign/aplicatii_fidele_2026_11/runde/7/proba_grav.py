# -*- coding: utf-8 -*-
"""Runda 7 (B-excel, unghiul gest_tastatura): proba GRAV-urilor criticului 6 (X1-X10), cu GESTURI REALE pe poligonul
bibliotecii (Playwright headless; mouse, tastatură, atingere, tastatura care compune prin CDP).

Rulare:  python proba_grav.py [--iesire <fisier.json>] [--doar X9,X5]
Rădăcina servită: variabila LH_SERVIT (un dosar care conține `aplicatii/`), altfel worktree-ul.
Server 127.0.0.1 pe port liber; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24). Nimic pe ecran.
Ultima linie = numărul de verificări picate."""
import argparse, functools, http.server, json, os, sys, threading
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

AICI = os.path.dirname(os.path.abspath(__file__))
WT = os.path.abspath(os.path.join(AICI, "..", "..", "..", ".."))
RAD = os.environ.get("LH_SERVIT") or WT

REZ = []
def verif(gr, nume, ok, detaliu=None):
    REZ.append({"grav": gr, "verificare": nume, "ok": bool(ok), "detaliu": detaliu})

def server():
    class T(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=RAD))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]

def ruta(r):
    h = urlparse(r.request.url).hostname
    return r.continue_() if h in ("127.0.0.1", "localhost") else r.abort()

CEL = """a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+a+'"]');if(!e)return null;
 const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2,b.width,b.height,b.x,b.y]}"""
AE = "()=>{const a=document.activeElement;return a?a.tagName+'.'+a.className:null}"
MESAJ = "()=>[...document.querySelectorAll('[data-lh-nesimulat]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim().slice(0,200))"

class S:
    def __init__(self, pw, base, w=1366, h=768, mobil=False):
        self.br = pw.chromium.launch(headless=True)
        kw = dict(viewport={"width": w, "height": h})
        if mobil: kw.update(is_mobile=True, has_touch=True, device_scale_factor=2)
        self.ctx = self.br.new_context(**kw)
        self.ctx.route("**/*", ruta)
        self.pg = self.ctx.new_page()
        self.erori = []
        self.pg.on("pageerror", lambda e: self.erori.append(str(e)))
        self.base = base
        self.cdp = self.ctx.new_cdp_session(self.pg)
    def deschide(self, continut=None):
        self.pg.goto(self.base + "/aplicatii/poligon.html" + ("" if continut else "?aplicatie=excel"))
        if continut:
            self.pg.wait_for_function("()=>window.LH&&LH.aplicatii&&LH.aplicatii.deschide")
            self.pg.evaluate("c=>LH.aplicatii.deschide('excel',{loc:document.querySelector('[data-lh-aplicatie-loc]'),continut:c,focus:true})", continut)
        self.pg.wait_for_selector('[data-lh-aplicatie="excel"]', timeout=15000)
        self.pg.wait_for_timeout(500)
    def ev(self, js, arg=None): return self.pg.evaluate(js, arg) if arg is not None else self.pg.evaluate(js)
    def stare(self): return self.ev("()=>LH.aplicatii.stare('excel')")
    def cel(self, a): return (self.stare()["celule"] or {}).get(a)
    def rect(self, a): return self.ev(CEL, a)
    def clic(self, a, **k):
        x = self.rect(a); self.pg.mouse.click(x[0], x[1], **k); self.pg.wait_for_timeout(120)
    def atinge(self, a):
        # elevul derulează cu degetul până vede celula (pe telefon grila e mai mare decât ecranul); apoi o atinge
        self.ev("a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"celula\"][data-lh-id=\"'+a+'\"]');if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", a)
        self.pg.wait_for_timeout(150)
        x = self.rect(a); self.pg.touchscreen.tap(x[0], x[1]); self.pg.wait_for_timeout(300)
    def scrie(self, a, text, tasta="Enter"):
        self.clic(a); self.pg.keyboard.type(text); self.pg.keyboard.press(tasta); self.pg.wait_for_timeout(150)
    def clic_sel(self, sel):
        b = self.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
        if not b: return False
        self.pg.mouse.click(b[0], b[1]); self.pg.wait_for_timeout(200); return True
    def mesaj(self): return self.ev(MESAJ)
    def gata(self): self.ctx.close(); self.br.close()

# ------------------------------------------------------------------ X9: telefonul + tastatura care compune
def x9(pw, base):
    s = S(pw, base, 375, 667, mobil=True); s.deschide()
    s.atinge("D3")
    ae = s.ev(AE)
    verif("X9", "telefon: după atingerea lui D3 focusul e în caseta de intrare", "TEXTAREA" in (ae or ""), ae)
    s.cdp.send("Input.insertText", {"text": "7,5"}); s.pg.wait_for_timeout(200)
    c = s.cel("D3")
    verif("X9", "telefon: insertText „7,5” ajunge în D3 (în editare)", bool(c and c.get("valoare") == "7,5"), c)
    s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(200)
    c = s.cel("D3")
    verif("X9", "telefon: Enter primește 7,5 în D3", bool(c and c.get("valoare") == 7.5 and c.get("text") == "7,5"), c)
    s.atinge("D4")
    s.cdp.send("Input.imeSetComposition", {"text": "Ana", "selectionStart": 3, "selectionEnd": 3}); s.pg.wait_for_timeout(150)
    s.cdp.send("Input.insertText", {"text": "Ana"}); s.pg.wait_for_timeout(150)
    s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(200)
    c = s.cel("D4")
    verif("X9", "telefon: compunerea „Ana” ajunge în D4", bool(c and c.get("valoare") == "Ana"), c)
    r = s.rect("D3")
    verif("X9", "telefon: celula are cel puțin 32 px pentru atingere (api §I1 regula 4)", bool(r and r[3] >= 32 and r[2] >= 32), r and [round(r[2], 1), round(r[3], 1)])
    verif("X9", "telefon: fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()
    s = S(pw, base); s.deschide()
    r = s.rect("D3")
    verif("X9", "calculator: celula rămâne 64×19 (referința: uia_excel.json › zona_document)", bool(r and round(r[2]) == 64 and round(r[3]) == 19), r and [r[2], r[3]])
    s.clic("A6"); ae = s.ev(AE)
    verif("X9", "calculator: după clic focusul e în caseta de intrare", "TEXTAREA" in (ae or ""), ae)
    s.cdp.send("Input.insertText", {"text": "Mădălina"}); s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    c = s.cel("A6")
    verif("X9", "calculator: „Mădălina” trimis ca insertText ajunge în A6", bool(c and c.get("valoare") == "Mădălina"), c)
    s.clic("A7")
    s.cdp.send("Input.imeSetComposition", {"text": "ș", "selectionStart": 1, "selectionEnd": 1})
    s.cdp.send("Input.insertText", {"text": "ș"}); s.pg.keyboard.type("i"); s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    c = s.cel("A7")
    verif("X9", "calculator: „ș” compus + „i” = „și” în A7", bool(c and c.get("valoare") == "și"), c)
    sel = s.ev("()=>String(window.getSelection())")
    s.pg.mouse.move(*s.rect("A2")[:2]); s.pg.mouse.down(); s.pg.mouse.move(*s.rect("C4")[:2], steps=6); s.pg.mouse.up(); s.pg.wait_for_timeout(150)
    sel = s.ev("()=>String(window.getSelection())")
    verif("X9", "calculator: tragerea peste celule nu mai lasă selecția albastră a browserului", sel == "", sel[:60])
    verif("X9", "calculator: fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X5: AutoSum cu zona propusă aleasă
NOTE = {"celule": {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": 9, "A3": "Bogdan", "B3": 7, "A4": "Dan", "B4": 8, "A5": "Ioana", "B5": 10, "A6": "Mihai", "B6": 6, "B7": 5}, "selectie": "B8"}
def autosum(s):
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="AutoSum"]')
def x5(pw, base):
    s = S(pw, base); s.deschide(NOTE)
    autosum(s)
    c = s.cel("B8")
    verif("X5", "Σ pe B8: =SUM(B2:B7) în editare", bool(c and c.get("editare") and c.get("valoare") == "=SUM(B2:B7)"), c)
    ales = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed-sel');return e?e.textContent:null}")
    verif("X5", "Σ: zona propusă „B2:B7” e ALEASĂ în celulă", ales == "B2:B7", ales)
    pr = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-propus');if(!e||!e.getClientRects().length)return null;const b=e.getBoundingClientRect(),s=getComputedStyle(e);return [Math.round(b.width),Math.round(b.height),s.borderTopStyle]}")
    verif("X5", "Σ: zona propusă B2:B7 e încadrată punctat (1 coloană × 6 rânduri)", bool(pr and pr[2] == "dashed" and abs(pr[0] - 64) <= 3 and abs(pr[1] - 6 * 19) <= 3), pr)
    s.pg.keyboard.type("B2:B6"); s.pg.wait_for_timeout(100)
    c = s.cel("B8")
    verif("X5", "Σ: „B2:B6” scris PESTE zona propusă → =SUM(B2:B6)", bool(c and c.get("valoare") == "=SUM(B2:B6)"), c)
    s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    c = s.cel("B8"); st = s.stare()
    verif("X5", "Σ + B2:B6 + Enter → B8 = 40, formula =SUM(B2:B6), nu mai e în editare", bool(c and c.get("valoare") == 40 and c.get("formula") == "=SUM(B2:B6)" and not st["ramane_in_editare"]), c)
    # Σ apoi tragere peste B2:B4 (gestul din lecție: „selectezi cu mouse-ul zona”)
    s.clic("B9"); autosum(s)
    s.pg.mouse.move(*s.rect("B2")[:2]); s.pg.mouse.down(); s.pg.mouse.move(*s.rect("B4")[:2], steps=6); s.pg.mouse.up(); s.pg.wait_for_timeout(150)
    c = s.cel("B9")
    verif("X5", "Σ apoi tragere B2→B4: zona înlocuiește propunerea → =SUM(B2:B4)", bool(c and c.get("valoare") == "=SUM(B2:B4)"), c)
    s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    c = s.cel("B9")
    verif("X5", "… Enter → 24", bool(c and c.get("valoare") == 24), c)
    # Σ + Enter direct = propunerea (scenarii_real/excel-autosum-buton)
    s.clic("C8"); s.pg.keyboard.type("1"); s.pg.keyboard.press("Enter")
    s.clic("B10"); autosum(s); s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    c = s.cel("B10")
    verif("X5", "Σ + Enter direct: propunerea e primită (fără blocaj)", bool(c and c.get("formula") and not s.stare()["ramane_in_editare"]), c)
    verif("X5", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X6: funcție necunoscută → #NAME?, nicio blocare tăcută
def x6(pw, base):
    s = S(pw, base); s.deschide()
    s.scrie("D3", "=DACĂ(B3<9;10;20)")
    c = s.cel("D3"); st = s.stare()
    verif("X6", "=DACĂ(B3<9;10;20) + Enter → D3 arată #NAME? (com_r6b.json › D3)", bool(c and c.get("text") == "#NAME?" and not st["ramane_in_editare"]), c)
    verif("X6", "… formula rămâne =DACĂ(…) (FormulaLocal real: =DACĂ(B3<9;10;20))", bool(c and (c.get("formula") or "").upper().startswith("=DACĂ(")), c)
    verif("X6", "… selecția trece la D4 (Enter mută în jos)", st["selectie"]["activa"] == "D4", st["selectie"])
    s.scrie("D4", "=dacă(B3<9;10;20)")
    c = s.cel("D4")
    verif("X6", "=dacă(…) → formula cu majuscule =DACĂ(…), #NAME? (com_r6b.json › D5)", bool(c and c.get("text") == "#NAME?" and (c.get("formula") or "").startswith("=DACĂ(")), c)
    s.scrie("D5", "=IF(B3<9;10;20)")
    c = s.cel("D5")
    verif("X6", "după #NAME?, =IF(B3<9;10;20) în D5 dă 10 (nimic blocat)", bool(c and c.get("valoare") == 10), c)
    s.clic("D6"); s.pg.keyboard.type("=SUM(B2:B4)B2"); s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(150)
    m = s.mesaj()
    verif("X6", "formula respinsă de Excel (com_r6b.json › D4) → mesaj vizibil, nu blocare tăcută", bool(m), m)
    s.pg.keyboard.press("Escape"); s.pg.wait_for_timeout(100)
    verif("X6", "… Esc iese din editare", not s.stare()["ramane_in_editare"])
    verif("X6", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X1: numerele nu se taie (Range.Text din com_r6.json)
VEZI = """a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+a+'"]');if(!e)return null;
 const t=e.querySelector('.lh-ap-x-t');if(!t)return {text:''};const b=e.getBoundingClientRect(),tb=t.getBoundingClientRect();
 return {text:t.textContent,sw:t.scrollWidth,cw:t.clientWidth,cel:Math.round(b.width),dr:Math.round(tb.right-b.right)}}"""
def vede(s, a):
    v = s.ev(VEZI, a)
    return v
def netaiat(v):   # textul întreg se vede: nu e tăiat în span și nu iese din celulă
    return bool(v) and v.get("sw", 0) <= v.get("cw", 0) + 1 and v.get("dr", 0) <= 1
def x1(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": 1234567890, "A2": 123456789012, "A3": "12.03.2026", "A4": "=25/3", "A5": "=2/3*100", "A6": "=1/3",
                           "A7": "=123456789*1000", "A8": "-3,25", "C2": 75.5, "C3": "12.03.2026", "C4": "=25/3", "C5": 1234},
                "latimi": {"C": 30.67}, "selectie": "E1"})
    asteptat = {"A1": "1,23E+09", "A2": "1,23E+11", "A3": "########", "A4": "8,333333", "A5": "66,66667", "A6": "0,333333",
                "A7": "1,23E+11", "A8": "-3,25", "C2": "76", "C3": "###", "C4": "8,3", "C5": "###"}
    st = s.stare()["celule"]
    for a, t in asteptat.items():
        c = st.get(a) or {}; v = vede(s, a)
        verif("X1", "%s: Excel real arată „%s” (com_r6.json) — stare și ecran, fără cifră tăiată" % (a, t),
              c.get("text") == t and v and v["text"] == t and netaiat(v), {"stare": c.get("text"), "ecran": v})
    # numărul TASTAT lățește coloana (scenarii_real/excel-zero-in-fata: „741234567” întreg)
    s.scrie("E1", "741234567")
    c = s.cel("E1"); v = vede(s, "E1")
    verif("X1", "741234567 tastat: se vede întreg (coloana se lățește), ca în excel-zero-in-fata", bool(c and c.get("text") == "741234567" and v["text"] == "741234567" and netaiat(v)), {"stare": c, "ecran": v})
    s.scrie("F1", "=25/3")
    v = vede(s, "F1")
    verif("X1", "=25/3 tastat ca formulă: „8,333333”, coloana nu se lățește (com_r6.json › A10)", bool(v and v["text"] == "8,333333" and v["cel"] == 64), v)
    verif("X1", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X2: textul lung trece peste vecinele goale
def x2(pw, base):
    s = S(pw, base)
    T = "Situația notelor la informatică"
    s.deschide({"celule": {"A1": T, "A3": T, "B3": "x", "A5": "Elevii clasei a VIII-a B"}, "selectie": "C7"})
    v = vede(s, "A1")
    verif("X2", "A1 (B1:F1 goale): textul întreg se vede peste vecine (com_r6_pdf: E2 trece peste F2, G2)", bool(v and v["text"] == T and v["sw"] <= v["cw"] + 1 and v["dr"] > 60), v)
    v = vede(s, "A3")
    verif("X2", "A3 (B3 plin): textul se oprește la marginea celulei (com_r6_pdf: E3 „Situatia no”)", bool(v and v["dr"] <= 1), v)
    v = vede(s, "A5")
    verif("X2", "A5: „Elevii clasei a VIII-a B” trece peste B5 (com_r6_pdf: A14)", bool(v and v["sw"] <= v["cw"] + 1 and v["dr"] > 0), v)
    verif("X2", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X7: lățimea coloanei (m1-l06:79, :111, :118)
ANT = """c=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="'+c+'"]');const b=e.getBoundingClientRect();return [b.right,b.top+b.height/2,b.width]}"""
def x7(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Situația notelor la informatică", "A2": "Ana", "B1": "Nota", "B2": 9, "C1": "Media", "C2": 9}, "selectie": "E5"})
    x, y, _ = s.ev(ANT, "C")
    sub = s.ev("([x,y])=>{const e=document.elementFromPoint(x,y);return [e.getAttribute('data-lh-tinta'),getComputedStyle(e).cursor]}", [x, y])
    verif("X7", "pe linia dintre C și D cursorul e săgeata dublă ↔ (col-resize)", sub == ["antet_coloana_margine", "col-resize"], sub)
    s.pg.mouse.move(x, y); s.pg.mouse.down(); s.pg.mouse.move(x + 20, y, steps=4); s.pg.mouse.move(x + 40, y, steps=4); s.pg.mouse.up(); s.pg.wait_for_timeout(200)
    st = s.stare()
    verif("X7", "tragerea liniei C|D cu +40 px: C are 104 px", (st.get("latimi_coloane") or {}).get("C") == 104, st.get("latimi_coloane"))
    verif("X7", "… și NU se selectează coloana D (selecția rămâne E5)", st["selectie"]["zona"] == "E5", st["selectie"])
    s.pg.keyboard.press("Control+z"); s.pg.wait_for_timeout(150)
    st = s.stare()
    verif("X7", "Ctrl+Z întoarce lățimea lui C", (st.get("latimi_coloane") or {}).get("C", 64) == 64, st.get("latimi_coloane"))
    x, y, _ = s.ev(ANT, "A")
    s.pg.mouse.dblclick(x, y); s.pg.wait_for_timeout(200)
    st = s.stare(); w = (st.get("latimi_coloane") or {}).get("A")
    v = vede(s, "A1")
    verif("X7", "dublu clic pe linia A|B: A se potrivește după „Situația notelor la informatică” (textul încape în A)", bool(w and w > 150 and v["sw"] <= v["cw"] + 1 and v["dr"] <= 1), {"A": w, "ecran": v})
    verif("X7", "… selecția nu se schimbă", st["selectie"]["zona"] == "E5", st["selectie"])
    # clic dreapta pe antetul C › Column Width… › 20 › Enter
    xc, yc, wc = s.ev(ANT, "C")
    s.pg.mouse.click(xc - wc / 2, yc, button="right"); s.pg.wait_for_timeout(250)
    ok = s.clic_sel('[data-lh-aplicatie] [data-lh-eticheta="Column Width..."]')
    camp = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"camp:latime_coloana\"] input');return e?[e.value,document.activeElement===e]:null}")
    verif("X7", "Column Width…: câmpul arată lățimea (8,11 la 64 px, ca uia_excel.json › dialog.ColumnWidth) și are focusul", bool(ok and camp and camp[0] == "8,11" and camp[1]), camp)
    s.pg.keyboard.type("20"); s.pg.keyboard.press("Enter"); s.pg.wait_for_timeout(200)
    st = s.stare()
    verif("X7", "… „20” + Enter: C = 150 px, fereastra închisă, fără mesaj", (st.get("latimi_coloane") or {}).get("C") == 150 and not st.get("dialog") and not s.mesaj(), {"lat": st.get("latimi_coloane"), "dialog": st.get("dialog"), "mesaj": s.mesaj()})
    verif("X7", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

PROBE = {"X9": x9, "X5": x5, "X6": x6, "X1": x1, "X2": x2, "X7": x7}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=os.path.join(AICI, "proba_grav.json"))
    ap.add_argument("--doar", default="")
    a = ap.parse_args()
    doar = [x.strip() for x in a.doar.split(",") if x.strip()] or list(PROBE)
    srv, base = server()
    with sync_playwright() as pw:
        for k in doar:
            try: PROBE[k](pw, base)
            except Exception as e: verif(k, "proba a căzut", False, repr(e)[:300])
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    json.dump({"radacina": "LH_SERVIT" if os.environ.get("LH_SERVIT") else "worktree", "verificari": REZ, "picate": len(picate)},
              open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in REZ: print(("ok   " if r["ok"] else "PICAT") + " " + r["grav"] + " " + r["verificare"] + ("" if r["ok"] else "  ← " + json.dumps(r["detaliu"], ensure_ascii=False)[:160]))
    print(len(picate))

if __name__ == "__main__":
    main()
