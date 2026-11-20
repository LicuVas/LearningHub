# -*- coding: utf-8 -*-
"""Runda 19 (B-explorer, unghiul gest_tastatura) — proba GRAV-urilor din runde/15/critic.md, pe GESTURI REALE.

Secțiuni (toate implicit; una anume: python proba_grav.py e1|e2|tast|regres):
  e1     R12 „nu tace”: 10 comenzi nesimulate din Explorer (cele 9 din critic_probe/a4.py + Enter în dialogul de conflict);
         mesajul central e sub rădăcină, are data-lh-nesimulat + role=status, e PE ECRAN (dreptunghi în pagină, elementul
         din centrul lui e mesajul) la +40 / +400 / +1500 ms; supraviețuiește unei a doua redesenări; dispare după ~5 s.
  e2     I1 telefon (360×740 și 390×844, isMobile + atingere): Nou › Folder → nume scris (Input.insertText și keyboard.type)
         → Enter / atingere în afară; „Redenumire” din bara de comenzi; F2. Plus aceleași drumuri cu mouse-ul la 1366×768.
  tast   unghiul gest_tastatura: săgeți, Enter, Backspace, Alt+←/→/↑, F2, Delete, Shift+Delete, Ctrl+C/X/V/Z/A,
         Ctrl+Shift+N, F4, Ctrl+L, Ctrl+E/F, F5, Esc, Alt+Enter, Ctrl+Shift+C — evenimentul §4 (gest, acțiune, țintă),
         starea, ecranul (rândul ales pe ecran = selecția din stare; caseta cu focus).
  regres mesajul central pe Word / Excel / PowerPoint / Windows: câte 2 gesturi nesimulate (tastatură / mouse real),
         mesajul apare, e pe ecran la +40 / +400 / +1500 / +4000 ms, are data-lh-nesimulat, dispare după ~5 s.
Server pe ("127.0.0.1", 0); tot ce nu e 127.0.0.1/localhost se abandonează (regula 24); headless; nicio dată personală.
Ieșirea: runde/19/probe_iesiri/proba_grav[_<sectiune>].json; ULTIMA LINIE = numărul de verificări picate.
Cu --radacina <dir> se probează altă copie a sitului (ex. %TEMP%/r19_inainte, codul de dinainte de reparație).
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
AICI = Path(__file__).resolve().parent
WT = AICI.parents[3]
OUT = AICI / "probe_iesiri"
OUT.mkdir(exist_ok=True)


class Tacut(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript",
                      ".json": "application/json"}

    def log_message(self, *a):
        pass


REZ, PLECATE, ERORI = [], [], []


def verif(sectiune, nume, ok, detalii=None):
    REZ.append({"sectiune": sectiune, "nume": nume, "ok": bool(ok), "detalii": detalii})
    print(("  ok    " if ok else "  PICAT ") + sectiune + " · " + nume + ("" if ok else "  " + json.dumps(detalii, ensure_ascii=False)[:400]))


MES = """a=>{const R=document.querySelector('[data-lh-aplicatie="'+a+'"]');
 const m=[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')];
 return m.map(x=>{const r=x.getBoundingClientRect();const c=document.elementFromPoint(r.x+r.width/2,r.y+Math.min(r.height/2,8));
  return {t:x.textContent.slice(0,100),et:x.getAttribute('data-lh-nesimulat'),rol:x.getAttribute('role'),subRad:!!(R&&R.contains(x)),
   rect:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],
   inPagina:r.width>0&&r.height>0&&r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,
   deasupra:!!(c&&(c===x||x.contains(c))),vis:getComputedStyle(x).visibility!=='hidden'&&getComputedStyle(x).display!=='none'&&+getComputedStyle(x).opacity>0}})}"""

EV_INIT = """window.__ev=[];window.addEventListener('lh-aplicatie',e=>{const d=e.detail;window.__ev.push({g:d.gest,a:d.actiune,t:d.tinta,act:d.activat||null})});"""


def mesaj_bun(lista):
    return [m for m in lista if m["subRad"] and m["rol"] == "status" and m["inPagina"] and m["deasupra"] and m["vis"]]


class Ham:
    def __init__(self, radacina):
        self.radacina = radacina

    def __enter__(self):
        h = functools.partial(Tacut, directory=str(self.radacina))
        self.srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        self.baza = "http://127.0.0.1:%d" % self.srv.server_address[1]
        self.p = sync_playwright().start()
        self.br = self.p.chromium.launch(headless=True)
        return self

    def __exit__(self, *a):
        try:
            self.br.close()
            self.p.stop()
        finally:
            self.srv.shutdown()

    def ctx(self, w=1366, h=768, mobil=False):
        kw = dict(viewport={"width": w, "height": h})
        if mobil:
            kw.update(is_mobile=True, has_touch=True)
        c = self.br.new_context(**kw)

        def ruta(r):
            if urlsplit(r.request.url).hostname not in ("127.0.0.1", "localhost"):
                PLECATE.append(r.request.url)
                return r.abort()
            return r.continue_()
        c.route("**/*", ruta)
        return c

    def pagina(self, c, aplicatie):
        pg = c.new_page()
        pg.on("pageerror", lambda e: ERORI.append(str(e)[:300]))
        pg.add_init_script(EV_INIT)
        pg.goto(self.baza + "/aplicatii/poligon.html?aplicatie=" + aplicatie, wait_until="load")
        pg.wait_for_function("a=>window.LH&&LH.aplicatii&&LH.aplicatii.stare(a)", arg=aplicatie, timeout=30000)
        pg.wait_for_timeout(500)
        pg.evaluate("window.__ev.length=0")
        return pg


def ev(pg):
    return pg.evaluate("(()=>{const o=window.__ev.slice();window.__ev.length=0;return o})()")


def box(pg, sel):
    return pg.evaluate("s=>{const e=[...document.querySelectorAll(s)].find(x=>x.getClientRects().length);if(!e)return null;"
                       "e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}", sel)


def clic(pg, sel, button="left", n=1, dx=None):
    b = box(pg, sel)
    if not b:
        return False
    x = b[0] + (min(40, b[2] / 2) if dx is None else dx)
    pg.mouse.click(x, b[1] + b[3] / 2, button=button, click_count=n)
    pg.wait_for_timeout(60)
    return True


def atinge(pg, sel, pauza=250):
    b = box(pg, sel)
    if not b:
        return False
    pg.touchscreen.tap(b[0] + min(40, b[2] / 2), b[1] + b[3] / 2)
    pg.wait_for_timeout(pauza)
    return True


def st(pg, a="explorer"):
    return pg.evaluate("a=>LH.aplicatii.stare(a)", a)


RAND = '.lh-ap-e-rand[data-lh-id="%s"] .lh-ap-e-nume'
BARA = '[data-lh-tinta="bara_comenzi"][data-lh-id="%s"]'
MR = '.lh-ap-e-mr[data-lh-id="%s"]'


# ------------------------------------------------------------------------------------------------ E1
def sectiunea_e1(H):
    S = "E1"
    c = H.ctx()
    pg = H.pagina(c, "explorer")

    def proba(nume, gest, lung=False):
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(120)
        ev(pg)
        gest()
        o = {}
        pg.wait_for_timeout(40)
        o["m40"] = pg.evaluate(MES, "explorer")
        pg.wait_for_timeout(360)
        o["m400"] = pg.evaluate(MES, "explorer")
        pg.wait_for_timeout(1100)
        o["m1500"] = pg.evaluate(MES, "explorer")
        o["ev"] = ev(pg)
        nes = [e for e in o["ev"] if e["a"] == "nesimulat"]
        ok = bool(nes) and all(len(mesaj_bun(o[k])) == 1 for k in ("m40", "m400", "m1500"))
        verif(S, nume + " → eveniment 'nesimulat' + mesajul central pe ecran la +40/+400/+1500 ms", ok,
              {"ev": o["ev"][:4], "m40": o["m40"], "m1500": o["m1500"]})
        if lung and ok:
            # o a doua redesenare (clic pe fundalul listei) cât mesajul trăiește: mesajul rămâne
            clic(pg, ".lh-ap-e-lista", dx=600)
            pg.wait_for_timeout(200)
            m = pg.evaluate(MES, "explorer")
            verif(S, nume + " → după o a doua redesenare (clic pe fundal, +1,8 s) mesajul rămâne", len(mesaj_bun(m)) == 1, m)
            pg.wait_for_timeout(3400)   # ~5,4 s de la gest
            clic(pg, ".lh-ap-e-lista", dx=600)   # o redesenare după expirare: mesajul NU reînvie
            pg.wait_for_timeout(300)
            m = pg.evaluate(MES, "explorer")
            verif(S, nume + " → după ~5,7 s mesajul a plecat și o redesenare nu-l readuce", len(m) == 0, m)
            ev(pg)

    proba("1 clic „Mai multe opțiuni” (…)", lambda: clic(pg, BARA % "Mai multe opțiuni", dx=10), lung=True)
    proba("2 clic Minimizare", lambda: clic(pg, '[data-lh-tinta="bara_titlu"][data-lh-id="Minimizare"]', dx=20))
    proba("3 dublu clic tema.docx (Deschideți)", lambda: clic(pg, RAND % "tema.docx", n=2))

    def prop():
        clic(pg, RAND % "tema.docx", button="right")
        pg.wait_for_timeout(200)
        clic(pg, MR % "Proprietăți")
    proba("4 clic dreapta tema › Proprietăți", prop)

    def nou_doc():
        clic(pg, BARA % "Nou", dx=20)
        pg.wait_for_timeout(200)
        clic(pg, MR % "Microsoft Word Document")
    proba("5 Nou › Microsoft Word Document", nou_doc)

    def alt_enter():
        clic(pg, RAND % "tema.docx")
        pg.wait_for_timeout(150)
        pg.keyboard.press("Alt+Enter")
    proba("6 tema + Alt+Enter", alt_enter)
    proba("7 clic „Acest PC” în panou", lambda: clic(pg, '[data-lh-tinta="arbore"][data-lh-id="Acest PC"]'))

    def partajati():
        clic(pg, RAND % "tema.docx")
        pg.wait_for_timeout(150)
        clic(pg, BARA % "Partajați", dx=15)
    proba("8 tema + Partajați", partajati)

    def cos_del():
        clic(pg, RAND % "notite.txt")
        pg.keyboard.press("Delete")
        pg.wait_for_timeout(150)
        clic(pg, ".lh-ap-e-desk-ic", n=2)
        pg.wait_for_timeout(250)
        clic(pg, RAND % "notite.txt")
        pg.wait_for_timeout(150)
        pg.keyboard.press("Delete")
    proba("9 în Coș: notite + Delete", cos_del)
    pg.close()

    pg = H.pagina(c, "explorer")

    def conflict_enter():
        clic(pg, RAND % "tema.docx")
        pg.keyboard.press("Control+c")
        pg.keyboard.press("Control+v")      # copia „tema - Copie.docx” în același folder (explorer_copie_acelasi_folder)
        pg.wait_for_timeout(150)
        clic(pg, '[data-lh-tinta="arbore"][data-lh-id="Teme"]')
        pg.wait_for_timeout(200)
        pg.keyboard.press("Control+v")
        pg.wait_for_timeout(150)
        pg.keyboard.press("Control+v")       # al doilea: „tema.docx” există → dialogul de conflict
        pg.wait_for_timeout(250)
        d = (st(pg) or {}).get("dialog")
        verif("E1", "10a dialogul de conflict e deschis înainte de Enter", bool(d), d)
        pg.keyboard.press("Enter")
    # gestul 10 se măsoară aici, pe o pagină nouă (curată), fără Escape între pași: dialogul se verifică înainte de Enter
    pg.keyboard.press("Escape")
    ev(pg)
    conflict_enter()
    o = {}
    pg.wait_for_timeout(40)
    o["m40"] = pg.evaluate(MES, "explorer")
    pg.wait_for_timeout(360)
    o["m400"] = pg.evaluate(MES, "explorer")
    pg.wait_for_timeout(1100)
    o["m1500"] = pg.evaluate(MES, "explorer")
    o["ev"] = ev(pg)
    nes = [e for e in o["ev"] if e["a"] == "nesimulat"]
    verif(S, "10 dialogul de conflict + Enter (buton nesimulat) → mesajul pe ecran la +40/+400/+1500 ms",
          bool(nes) and all(len(mesaj_bun(o[k])) == 1 for k in ("m40", "m400", "m1500")),
          {"ev": o["ev"][-3:], "m40": o["m40"], "m1500": o["m1500"]})
    pg.close()
    c.close()


# ------------------------------------------------------------------------------------------------ E2
FOC = r"""(()=>{const a=document.activeElement;const i=document.querySelector('.lh-ap-e-ren');
 return {activ:a?(a.tagName+'.'+String(a.className).slice(0,24)):null,caseta:i?{val:i.value,foc:a===i}:null}})()"""


def sectiunea_e2(H):
    S = "E2"
    for (w, h) in ((360, 740), (390, 844)):
        c = H.ctx(w, h, mobil=True)
        fele = ("insertText", "keyboard.type") if w == 360 else ("insertText",)
        for fel in fele:
            for incheiere in ("Enter", "atingere_afara"):
                pg = H.pagina(c, "explorer")
                cdp = c.new_cdp_session(pg)
                atinge(pg, BARA % "Nou")
                atinge(pg, MR % "Folder", pauza=30)
                f30 = pg.evaluate(FOC)
                pg.wait_for_timeout(400)
                f430 = pg.evaluate(FOC)
                if fel == "insertText":
                    cdp.send("Input.insertText", {"text": "Ex Pop Ana"})
                else:
                    pg.keyboard.type("Ex Pop Ana")
                pg.wait_for_timeout(150)
                fs = pg.evaluate(FOC)
                ev(pg)
                if incheiere == "Enter":
                    pg.keyboard.press("Enter")
                else:
                    b = box(pg, ".lh-ap-e-lista")
                    pg.touchscreen.tap(b[0] + 30, b[1] + b[3] - 12)
                pg.wait_for_timeout(300)
                s = st(pg)
                e = ev(pg)
                nume = "%dpx · Nou › Folder · %s · %s" % (w, fel, incheiere)
                verif(S, nume + " → caseta are focusul la +30 și +430 ms", bool(f30["caseta"] and f30["caseta"]["foc"] and f430["caseta"] and f430["caseta"]["foc"]),
                      {"+30": f30, "+430": f430})
                verif(S, nume + " → numele scris e în casetă", bool(fs["caseta"] and fs["caseta"]["val"] == "Ex Pop Ana"), fs)
                verif(S, nume + " → „Ex Pop Ana/” în folder, cale neschimbată, fără „Folder nou/”",
                      "Ex Pop Ana/" in s["nume_fisiere"] and "Folder nou/" not in s["nume_fisiere"] and s["cale_curenta"].endswith("Clasa a V-a/"),
                      {"nume": s["nume_fisiere"], "cale": s["cale_curenta"], "ev": e[:4]})
                ecran = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>r.getAttribute('data-lh-id'))")
                verif(S, nume + " → rândul „Ex Pop Ana” pe ecran", "Ex Pop Ana" in ecran, ecran)
                pg.close()
        # Redenumire din bara de comenzi și F2, pe telefon
        pg = H.pagina(c, "explorer")
        cdp = c.new_cdp_session(pg)
        atinge(pg, RAND % "tema.docx")
        atinge(pg, BARA % "Redenumire", pauza=30)
        pg.wait_for_timeout(400)
        f = pg.evaluate(FOC)
        cdp.send("Input.insertText", {"text": "compunere"})
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(300)
        s = st(pg)
        verif(S, "%dpx · tema › Redenumire (bara) › „compunere” › Enter → compunere.docx" % w,
              "compunere.docx" in s["nume_fisiere"] and "tema.docx" not in s["nume_fisiere"], {"foc+430": f, "nume": s["nume_fisiere"]})
        atinge(pg, RAND % "harta.png")
        ev(pg)
        pg.keyboard.press("F2")
        pg.wait_for_timeout(400)
        f = pg.evaluate(FOC)
        cdp.send("Input.insertText", {"text": "harta mare"})
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(300)
        s = st(pg)
        verif(S, "%dpx · harta › F2 › „harta mare” › Enter → harta mare.png" % w,
              "harta mare.png" in s["nume_fisiere"], {"foc+400": f, "nume": s["nume_fisiere"]})
        # atingerea ÎN casetă (ca să apară tastatura / să muți cursorul) nu șterge ce s-a scris
        atinge(pg, RAND % "Desene")
        atinge(pg, BARA % "Redenumire", pauza=400)
        cdp.send("Input.insertText", {"text": "Desen"})
        pg.wait_for_timeout(100)
        atinge(pg, ".lh-ap-e-ren", pauza=400)
        f = pg.evaluate(FOC)
        cdp.send("Input.insertText", {"text": "e noi"})
        pg.keyboard.press("Enter")
        pg.wait_for_timeout(300)
        s = st(pg)
        verif(S, "%dpx · Desene › Redenumire › „Desen” › atingere în casetă › „e noi” › Enter → textul nu se pierde" % w,
              bool(f["caseta"] and f["caseta"]["foc"] and f["caseta"]["val"] == "Desen") and any("noi" in n and n.endswith("/") for n in s["nume_fisiere"]),
              {"dupa_atingere": f, "nume": s["nume_fisiere"]})
        # Esc anulează pe telefon
        atinge(pg, RAND % "notite.txt")
        atinge(pg, BARA % "Redenumire", pauza=400)
        cdp.send("Input.insertText", {"text": "zzz"})
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(250)
        s = st(pg)
        verif(S, "%dpx · notite › Redenumire › „zzz” › Esc → numele rămâne notite.txt" % w,
              "notite.txt" in s["nume_fisiere"] and not any("zzz" in n for n in s["nume_fisiere"]), s["nume_fisiere"])
        pg.close()
        c.close()
    # regresul cu mouse-ul (laptop): drumul D1 al criticului 15
    c = H.ctx()
    pg = H.pagina(c, "explorer")
    clic(pg, BARA % "Nou", dx=20)
    pg.wait_for_timeout(150)
    clic(pg, MR % "Folder")
    pg.wait_for_timeout(150)
    f = pg.evaluate(FOC)
    pg.keyboard.type("Ex Pop Ana")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, "1366 mouse · Nou › Folder › „Ex Pop Ana” › Enter (caseta are focusul)",
          bool(f["caseta"] and f["caseta"]["foc"]) and "Ex Pop Ana/" in s["nume_fisiere"], {"foc": f, "nume": s["nume_fisiere"]})
    clic(pg, BARA % "Nou", dx=20)
    pg.wait_for_timeout(150)
    clic(pg, MR % "Folder")
    pg.wait_for_timeout(150)
    pg.keyboard.type("Desene vechi")
    clic(pg, ".lh-ap-e-lista", dx=600)
    pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, "1366 mouse · Nou › Folder › „Desene vechi” › clic pe fundal → folderul primește numele",
          "Desene vechi/" in s["nume_fisiere"] and "Folder nou/" not in s["nume_fisiere"], s["nume_fisiere"])
    clic(pg, RAND % "notite.txt")
    pg.keyboard.press("F2")
    pg.wait_for_timeout(150)
    f = pg.evaluate(FOC)
    pg.keyboard.type("lista")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, "1366 mouse · notite › F2 (selectat „notite” fără .txt) › „lista” › Enter → lista.txt",
          bool(f["caseta"] and f["caseta"]["val"] in ("notite", "notite.txt")) and "lista.txt" in s["nume_fisiere"],
          {"foc": f, "nume": s["nume_fisiere"]})
    # clicul ÎN casetă (mutarea cursorului) nu șterge ce s-a scris
    clic(pg, BARA % "Nou", dx=20)
    pg.wait_for_timeout(150)
    clic(pg, MR % "Folder")
    pg.wait_for_timeout(150)
    pg.keyboard.type("Ex")
    clic(pg, ".lh-ap-e-ren", dx=4)
    pg.wait_for_timeout(200)
    f = pg.evaluate(FOC)
    pg.keyboard.press("End")
    pg.keyboard.type(" Ion")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, "1366 mouse · Nou › Folder › „Ex” › clic în casetă › End › „ Ion” › Enter → „Ex Ion/” (textul scris rămâne)",
          bool(f["caseta"] and f["caseta"]["val"] == "Ex" and f["caseta"]["foc"]) and "Ex Ion/" in s["nume_fisiere"],
          {"dupa_clic": f, "nume": s["nume_fisiere"]})
    clic(pg, RAND % "tema.docx")
    clic(pg, BARA % "Redenumire", dx=15)
    pg.wait_for_timeout(150)
    pg.keyboard.type("compunere")
    clic(pg, '[data-lh-tinta="arbore"][data-lh-id="Teme"]')   # clic în altă parte (panoul de navigare) încheie redenumirea
    pg.wait_for_timeout(250)
    pg.keyboard.press("Alt+ArrowLeft")
    pg.wait_for_timeout(250)
    s = st(pg)
    verif(S, "1366 mouse · tema › Redenumire › „compunere” › clic pe „Teme” în panou → compunere.docx (înapoi cu Alt+←)",
          "compunere.docx" in s["nume_fisiere"], {"nume": s["nume_fisiere"], "cale": s["cale_curenta"]})
    pg.close()
    c.close()


# ------------------------------------------------------------------------------------------------ tastatura
SEL_ECRAN = "[...document.querySelectorAll('.lh-ap-e-rand[data-lh-selectat]')].map(r=>r.getAttribute('data-lh-id'))"


def sectiunea_tast(H):
    S = "TAST"
    c = H.ctx()
    pg = H.pagina(c, "explorer")

    def apasa(k, pauza=200):
        ev(pg)
        pg.keyboard.press(k)
        pg.wait_for_timeout(pauza)
        return ev(pg), st(pg)

    def ecran_sel():
        return pg.evaluate(SEL_ECRAN)

    def baza(s):
        return [n.rstrip("/") for n in s["selectie"]]

    clic(pg, RAND % "harta.png")
    s0 = st(pg)
    ordine = s0["ordine_afisata"]
    e, s = apasa("ArrowDown")
    k = ordine.index("harta.png")
    verif(S, "↓ după harta → elementul următor din ordinea afișată; ecranul = starea; gest 'sageti'",
          s["selectie"] == [ordine[k + 1]] and ecran_sel() == baza(s) and e and e[-1]["g"] == "sageti",
          {"ordine": ordine, "sel": s["selectie"], "ecran": ecran_sel(), "ev": e})
    e, s = apasa("ArrowUp")
    verif(S, "↑ → înapoi la harta", s["selectie"] == ["harta.png"] and ecran_sel() == ["harta.png"], {"sel": s["selectie"], "ev": e})
    e, s = apasa("End")
    verif(S, "End → ultimul element", s["selectie"] == [ordine[-1]] and ecran_sel() == baza(s), {"sel": s["selectie"]})
    e, s = apasa("Home")
    verif(S, "Home → primul element", s["selectie"] == [ordine[0]] and ecran_sel() == baza(s), {"sel": s["selectie"]})
    # Enter pe folder = deschidere
    clic(pg, RAND % "Desene")
    e, s = apasa("Enter")
    verif(S, "Enter pe „Desene” → intră în folder; gest 'tasta_enter', acțiune 'navigare'",
          s["cale_curenta"].endswith("Desene/") and any(x["g"] == "tasta_enter" and x["a"] == "navigare" for x in e), {"cale": s["cale_curenta"], "ev": e})
    e, s = apasa("Backspace")
    verif(S, "Backspace → înapoi în Clasa a V-a; gest 'tasta_backspace'",
          s["cale_curenta"].endswith("Clasa a V-a/") and any(x["g"] == "tasta_backspace" for x in e), {"cale": s["cale_curenta"], "ev": e})
    e, s = apasa("Alt+ArrowRight")
    verif(S, "Alt+→ → înainte în Desene; gest 'alt_sageti' (referința: Înainte, scurtătura Alt+Dreapta)",
          s["cale_curenta"].endswith("Desene/") and any(x["g"] == "alt_sageti" and x["a"] == "navigare" for x in e), {"cale": s["cale_curenta"], "ev": e})
    e, s = apasa("Alt+ArrowLeft")
    verif(S, "Alt+← → înapoi (referința: Înapoi, Alt+Stânga)", s["cale_curenta"].endswith("Clasa a V-a/"), {"cale": s["cale_curenta"], "ev": e})
    e, s = apasa("Alt+ArrowUp")
    verif(S, "Alt+↑ → folderul părinte (referința: „Până la …” Alt+Sus)",
          not s["cale_curenta"].endswith("Clasa a V-a/") and any(x["g"] == "alt_sageti" and x["a"] == "navigare" for x in e), {"cale": s["cale_curenta"], "ev": e})
    e, s = apasa("Alt+ArrowLeft")
    # Enter pe fișier = nesimulat cu mesaj
    clic(pg, RAND % "tema.docx")
    e, s = apasa("Enter", 400)
    m = pg.evaluate(MES, "explorer")
    verif(S, "Enter pe tema.docx → „Deschideți” nesimulat, mesajul pe ecran la +400 ms (referința: Deschideți = Enter)",
          any(x["a"] == "nesimulat" for x in e) and len(mesaj_bun(m)) == 1, {"ev": e, "m": m})
    # Alt+Enter = Proprietăți, nu deschidere
    clic(pg, RAND % "Desene")
    e, s = apasa("Alt+Enter", 400)
    m = pg.evaluate(MES, "explorer")
    verif(S, "Alt+Enter pe „Desene” → Proprietăți (referința: meniul de fișier, „Proprietăți” Alt+Enter), NU intră în folder; mesajul „Proprietăți”",
          s["cale_curenta"].endswith("Clasa a V-a/") and any(x["a"] == "nesimulat" for x in e) and any("Proprietăți" in (y["et"] or "") for y in mesaj_bun(m)),
          {"cale": s["cale_curenta"], "ev": e, "m": m})
    if not s["cale_curenta"].endswith("Clasa a V-a/"):   # fără cascadă: înapoi în folderul de lucru
        apasa("Alt+ArrowLeft")
    # Ctrl+Shift+C = Copiere ca o cale
    clic(pg, RAND % "tema.docx")
    e, s = apasa("Control+Shift+c", 400)
    m = pg.evaluate(MES, "explorer")
    verif(S, "Ctrl+Shift+C pe tema → „Copiere ca o cale” (referința: scurtătura din meniul de fișier) — nu tace",
          any(x["g"] == "ctrl_shift_c" and x["a"] == "nesimulat" for x in e) and any("Copiere ca o cale" in (y["et"] or "") for y in mesaj_bun(m)),
          {"ev": e, "m": m})
    # F2 → caseta cu numele fără extensie selectat
    clic(pg, RAND % "tema.docx")
    e, s = apasa("F2")
    f = pg.evaluate("(()=>{const i=document.querySelector('.lh-ap-e-ren');return i?{v:i.value,s:[i.selectionStart,i.selectionEnd],foc:document.activeElement===i}:null})()")
    verif(S, "F2 pe tema.docx → caseta cu focus, selectat „tema” (referința: observat_vizual.f2_pe_tema_docx); gest 'tasta_f2'",
          bool(f and f["foc"] and f["s"] == [0, 4]) and any(x["g"] == "tasta_f2" and x["a"] == "redenumire" for x in e), {"caseta": f, "ev": e})
    e, s = apasa("Escape")
    verif(S, "Esc în casetă → redenumirea anulată, focusul înapoi în aplicație",
          "tema.docx" in s["nume_fisiere"] and not pg.evaluate("!!document.querySelector('.lh-ap-e-ren')") and
          pg.evaluate("document.querySelector('[data-lh-aplicatie=\"explorer\"]').contains(document.activeElement)"), {"ev": e})
    # Ctrl+C / Ctrl+V
    e, s = apasa("Control+c")
    e2, s = apasa("Control+v")
    verif(S, "Ctrl+C, Ctrl+V pe tema → „tema - Copie.docx” (explorer_copie_acelasi_folder); gesturi ctrl_c / ctrl_v",
          "tema - Copie.docx" in s["nume_fisiere"] and any(x["g"] == "ctrl_c" and x["a"] == "copiere" for x in e) and any(x["g"] == "ctrl_v" for x in e2),
          {"nume": s["nume_fisiere"], "ev": e + e2})
    ecran = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>r.getAttribute('data-lh-id'))")
    verif(S, "ecranul arată copia", "tema - Copie.docx" in ecran, ecran)
    e, s = apasa("Control+z")
    verif(S, "Ctrl+Z → copia dispare (referința: meniul de fundal, „Anulare Copiere” Ctrl+Z)",
          "tema - Copie.docx" not in s["nume_fisiere"] and any(x["g"] == "ctrl_z" for x in e), {"nume": s["nume_fisiere"], "ev": e})
    # Ctrl+X / Ctrl+V în Desene
    clic(pg, RAND % "harta.png")
    e, s = apasa("Control+x")
    clic(pg, RAND % "Desene", n=2)
    pg.wait_for_timeout(200)
    e2, s = apasa("Control+v")
    ecran = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>r.getAttribute('data-lh-id'))")
    verif(S, "Ctrl+X pe harta, dublu clic Desene, Ctrl+V → harta pe ecran în Desene, scoasă din Clasa a V-a (nume_fisiere = folderul de lucru)",
          "harta.png" in ecran and "harta.png" not in s["nume_fisiere"] and s["cale_curenta"].endswith("Desene/") and
          any(x["g"] == "ctrl_x" and x["a"] == "decupare" for x in e) and any(x["g"] == "ctrl_v" and x["a"] == "lipire" for x in e2),
          {"nume": s["nume_fisiere"], "ecran": ecran, "cale": s["cale_curenta"], "ev": e + e2})
    e, s = apasa("Alt+ArrowLeft")
    verif(S, "Alt+← → harta nu mai e în Clasa a V-a", "harta.png" not in s["nume_fisiere"], s["nume_fisiere"])
    # Ctrl+A
    e, s = apasa("Control+a")
    verif(S, "Ctrl+A → toate alese, ecranul = starea; gest 'ctrl_a'",
          sorted(s["selectie"]) == sorted(s["ordine_afisata"]) and sorted(ecran_sel()) == sorted(baza(s)) and any(x["g"] == "ctrl_a" for x in e),
          {"sel": s["selectie"], "ecran": ecran_sel()})
    e, s = apasa("Escape")
    # Delete → Coș
    clic(pg, RAND % "notite.txt")
    e, s = apasa("Delete")
    verif(S, "Delete pe notite → în Coș (referința: Ștergere = del); gest 'tasta_delete'",
          s["in_cos"] == ["notite.txt"] and "notite.txt" not in s["nume_fisiere"] and any(x["g"] == "tasta_delete" for x in e), {"s": s["in_cos"], "ev": e})
    e, s = apasa("Control+z")
    verif(S, "Ctrl+Z → notite revine", "notite.txt" in s["nume_fisiere"] and s["in_cos"] == [], {"nume": s["nume_fisiere"], "cos": s["in_cos"]})
    # Shift+Delete → dialogul de ștergere definitivă
    clic(pg, RAND % "notite.txt")
    e, s = apasa("Shift+Delete")
    d = s.get("dialog") or {}
    verif(S, "Shift+Delete → „Ștergere fișier” / „Sigur ștergeți definitiv acest fișier?” / Da, Nu (explorer_stergere_definitiva_*)",
          d.get("titlu") == "Ștergere fișier" and d.get("butoane") == ["Da", "Nu"] and pg.evaluate("!!document.querySelector('.lh-ap-e-dlg')"), d)
    e, s = apasa("Escape")
    verif(S, "Esc în dialog → Nu: notite rămâne", "notite.txt" in s["nume_fisiere"] and not pg.evaluate("!!document.querySelector('.lh-ap-e-dlg')"), s["nume_fisiere"])
    # Ctrl+Shift+N
    e, s = apasa("Control+Shift+n")
    f = pg.evaluate(FOC)
    verif(S, "Ctrl+Shift+N → „Folder nou/” cu caseta de nume cu focus; gest 'ctrl_shift_n'",
          "Folder nou/" in s["nume_fisiere"] and bool(f["caseta"] and f["caseta"]["foc"]) and any(x["g"] == "ctrl_shift_n" for x in e), {"foc": f, "ev": e})
    pg.keyboard.type("Album")
    e, s = apasa("Enter")
    verif(S, "… „Album” + Enter → Album/", "Album/" in s["nume_fisiere"], s["nume_fisiere"])
    # F4, Ctrl+L → bara de adrese
    for k in ("F4", "Control+l"):
        e, s = apasa(k)
        a = pg.evaluate("(()=>{const i=document.querySelector('.lh-ap-e-adr-in');return i?{v:i.value,foc:document.activeElement===i,sel:[i.selectionStart,i.selectionEnd]}:null})()")
        verif(S, k + " → caseta adresei cu focus, textul selectat; acțiune 'editare_adresa'",
              bool(a and a["foc"] and a["sel"] == [0, len(a["v"])]) and any(x["a"] == "editare_adresa" for x in e), {"adr": a, "ev": e})
        apasa("Escape")
    # Ctrl+E, Ctrl+F → căutarea
    for k in ("Control+e", "Control+f"):
        e, s = apasa(k)
        a = pg.evaluate("(()=>{const i=document.querySelector('.lh-ap-e-caut-in');return i?{foc:document.activeElement===i}:null})()")
        verif(S, k + " → caseta Căutați cu focus; acțiune 'cautare'", bool(a and a["foc"]) and any(x["a"] == "cautare" for x in e), {"caut": a, "ev": e})
        apasa("Escape")
    e, s = apasa("F5")
    verif(S, "F5 → reîmprospătare (referința: butonul Reîmprospătare, F5)", any(x["g"] == "tasta_f5" and x["a"] == "reimprospatare" for x in e), e)
    clic(pg, RAND % "tema.docx")
    e, s = apasa("Escape")
    verif(S, "Esc pe listă → nimic ales, ecranul = starea", s["selectie"] == [] and ecran_sel() == [], {"sel": s["selectie"], "ecran": ecran_sel()})
    # evenimentele §4 au toate gest + acțiune + țintă
    pg.close()
    c.close()


# ------------------------------------------------------------------------------------------------ regresul mesajului central
CANDIDATI = {
    "word": [("tasta", "Control+Enter"), ("tasta", "Control+f"), ("tasta", "Control+h")],
    "excel": [("tasta", "Control+e"), ("tasta", "Control+k"), ("tasta", "Control+p")],
    "powerpoint": [("clic", "mso:Undo_Dropdown"), ("tasta", "Control+k"), ("tasta", "Control+f"), ("tasta", "Control+h"), ("tasta", "Control+p")],
    "windows": [("dublu", "desktop"), ("dreapta", "bara"), ("tasta", "Enter"), ("dreapta_icon", "desktop")],
}


def sectiunea_regres(H):
    S = "REGRES"
    for app, cand in CANDIDATI.items():
        c = H.ctx()
        gasite = 0
        for fel, x in cand:
            if gasite >= 2:
                break
            pg = H.pagina(c, app)
            pg.evaluate("a=>{const R=document.querySelector('[data-lh-aplicatie=\"'+a+'\"]');R&&R.focus({preventScroll:true})}", app)
            if app == "word":
                pg.evaluate("()=>{const e=LH.aplicatii.element('word','document');if(e)e.focus&&e.focus()}")
            ev(pg)
            if fel == "tasta":
                if app == "windows":
                    b = pg.evaluate("(()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie=\"windows\"] [data-lh-tinta=\"desktop\"][data-lh-id]')].find(x=>x.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
                    if b:
                        pg.mouse.click(b[0], b[1])
                        pg.wait_for_timeout(100)
                        ev(pg)
                pg.keyboard.press(x)
            elif fel == "clic":
                b = pg.evaluate("([a,t])=>{const e=LH.aplicatii.element(a,t);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", [app, x])
                if not b:
                    pg.close()
                    continue
                pg.mouse.click(b[0], b[1])
            elif fel == "dublu":
                b = pg.evaluate("(()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie=\"windows\"] [data-lh-tinta=\"desktop\"][data-lh-id]')].find(x=>x.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
                if not b:
                    pg.close()
                    continue
                pg.mouse.dblclick(b[0], b[1])
            elif fel == "dreapta_icon":
                b = pg.evaluate("(()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie=\"windows\"] [data-lh-tinta=\"desktop\"][data-lh-id]')].find(x=>x.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
                if not b:
                    pg.close()
                    continue
                pg.mouse.click(b[0], b[1], button="right")
            elif fel == "dreapta":
                b = pg.evaluate("(()=>{const R=document.querySelector('[data-lh-aplicatie=\"windows\"]');const e=R&&R.querySelector('[data-lh-suprafata=\"bara_activitati\"],.lh-w-bara');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width*0.62,r.y+r.height/2]})()")
                if not b:
                    pg.close()
                    continue
                pg.mouse.click(b[0], b[1], button="right")
            o = {}
            pg.wait_for_timeout(40)
            o["m40"] = pg.evaluate(MES, app)
            pg.wait_for_timeout(360)
            o["m400"] = pg.evaluate(MES, app)
            pg.wait_for_timeout(1100)
            o["m1500"] = pg.evaluate(MES, app)
            pg.wait_for_timeout(2500)
            o["m4000"] = pg.evaluate(MES, app)
            o["ev"] = ev(pg)
            if not any(e["a"] == "nesimulat" for e in o["ev"]):
                pg.close()
                continue
            gasite += 1
            pg.wait_for_timeout(1700)
            o["m5700"] = pg.evaluate(MES, app)
            ok = all(len(mesaj_bun(o[k])) == 1 for k in ("m40", "m400", "m1500", "m4000")) and len(o["m5700"]) == 0
            verif(S, "%s · %s %s → mesajul pe ecran la +40/+400/+1500/+4000 ms, data-lh-nesimulat=%r, plecat la +5,7 s" %
                  (app, fel, x, (o["m40"][0]["et"] if o["m40"] else None)), ok, {"m40": o["m40"], "m4000": o["m4000"], "m5700": o["m5700"], "ev": o["ev"][:3]})
            pg.close()
        verif(S, "%s · s-au găsit 2 gesturi nesimulate de probat" % app, gasite >= 2, {"gasite": gasite})
        c.close()


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith("--")]
    rad = WT
    if "--radacina" in sys.argv:
        rad = Path(sys.argv[sys.argv.index("--radacina") + 1])
        arg = [a for a in arg if a != str(rad) and a != sys.argv[sys.argv.index("--radacina") + 1]]
    sect = arg or ["e1", "e2", "tast", "regres"]
    with Ham(rad) as H:
        for s in sect:
            print("== " + s)
            {"e1": sectiunea_e1, "e2": sectiunea_e2, "tast": sectiunea_tast, "regres": sectiunea_regres}[s](H)
    picate = [r for r in REZ if not r["ok"]]
    sufix = "" if sect == ["e1", "e2", "tast", "regres"] else "_" + "_".join(sect)
    if rad != WT:
        sufix += "_inainte"
    pe_sect = {}
    for r in REZ:
        p = pe_sect.setdefault(r["sectiune"], [0, 0])
        p[0] += 1
        p[1] += 0 if r["ok"] else 1
    (OUT / ("proba_grav%s.json" % sufix)).write_text(json.dumps({"radacina": "worktree" if rad == WT else "copie_inainte", "sectiuni": sect,
        "pe_sectiune_total_picate": pe_sect, "verificari": REZ, "plecate": PLECATE, "erori_pagina": ERORI}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("pe secțiune (total, picate):", pe_sect, "· cereri plecate:", len(PLECATE), "· erori de pagină:", len(ERORI))
    for x in ERORI[:5]:
        print("   eroare:", x)
    print(len(picate) + len(ERORI) + len(PLECATE))


if __name__ == "__main__":
    main()
