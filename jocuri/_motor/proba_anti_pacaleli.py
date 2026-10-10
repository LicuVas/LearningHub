"""Proba CLIENTULUI pentru contramăsurile P5, P7, P8 (10.10.2026; teste-elevi\\contracte\\2026-10-10_jurnal_panou_baza_comuna,
pacaleli_si_contramasuri.md, spec_api.md §2): motor.js și prezenta.js ADEVĂRATE, în Chromium, cu ceasul paginii controlat.

    python proba_anti_pacaleli.py              # ultima linie = câte verificări au picat (0 = curat)
    python proba_anti_pacaleli.py --mutanti    # ultima linie = mutanți NEprinși + verificările picate pe codul adevărat

Ce verifică, pe jocul real jocuri/grafica-v (nivelul 1), cu cererile spre /api/ PRINSE local (nimic nu pleacă spre teste-vasile):
  A1 `ap` (id-ul aparatului) pleacă în FIECARE cerere /api/activitate: 32 de semne hex, același pentru toți elevii de pe același
     browser (A, apoi „Schimbă elevul” -> B, apoi „Sunt alt elev”, „Ieși”, reîncărcări), diferit pe alt browser; nu e id-ul
     elevului, nu e amprenta, nu conține numele; e cel din localStorage (lh_aparat), care rămâne după uita / ieși.
  T1 A termină nivelul prima dată răspunzând REPEDE (~0,5 s de la afișarea fiecărei întrebări): nivelul pleacă cu rap = rq = n,
     fără rel                                                                       (control pozitiv)
  T2 B îl termină prima dată ÎNCET (~4,3 s pe întrebare): rap = 0, rq = n             (control negativ: elev cinstit)
  T3 B îl reia („De reluat”, ?pas=q1&nivel=1) repede: întrebările le atinsese deja (qm) -> nimic cronometrat, fără rap/rq
  T4 C (nivel terminat cândva, sertar vechi fără qm) îl reia repede: rap = rq = n, cu rel:1 (panoul nu dă semn pe reluări)
  T5 D răspunde la Î1 și Î2, reîncarcă pagina și reia nivelul repede: Î1, Î2 nu se mai cronometrează (rq = n - 2)
  T6 retrimiterile de la deschiderea paginii (sinc:1) nu poartă niciodată rap/rq
  X  0 erori JS; nicio cerere spre teste-vasile; doar 127.0.0.1
Regula 24: situl e servit LOCAL; fetch și sendBeacon spre /api/ sunt întoarse spre serverul local (ambalaj), restul e abandonat.
"""
import functools
import http.server
import json
import re
import secrets
import sys
import threading
import time
from pathlib import Path
from urllib.parse import parse_qsl, urlsplit

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
MOTOR = MOTOR_DIR / "motor.js"
PREZENTA = LH / "assets" / "js" / "prezenta.js"
JOC = "grafica-v"
LOCALE = ("127.0.0.1", "localhost")
SCOALA, CLASA = "proba", "5 P"
ENC = "Q" * 344   # „numele criptat” al probei: serverul de aici doar prinde cererile, nu-l deschide
AMBALAJ = r"""(()=>{const B='http://127.0.0.1:%d';
 const spre=u=>{try{const x=new URL(String(u),location.href);if(x.pathname.indexOf('/api/')===0)return B+x.pathname+'?t='+Date.now();}catch(e){}return u;};
 const f=window.fetch;window.fetch=function(u,o){return f.call(this,typeof u==='string'?spre(u):u,o);};
 if(navigator.sendBeacon){const b=navigator.sendBeacon.bind(navigator);navigator.sendBeacon=function(u,d){return b(spre(u),d);};}
})();"""

# mutanții: (fișier, ținta, înlocuirea, ce strică). Fiecare TREBUIE prins (măcar o verificare picată).
MUTANTI = [
    ("motor", "if(R.tq&&qn>R.qm0&&!R.punctat[R.qi]&&R.tq[R.qi]==null)", "if(R.tq&&!R.punctat[R.qi]&&R.tq[R.qi]==null)",
     "P5: se cronometrează și întrebările deja atinse (reîncărcare, reluare)"),
    ("motor", "...(primaTerminare&&!terminatInainte?{}:{rel:1})", "", "P5: reluarea pleacă fără rel (panoul i-ar da semn)"),
    ("motor", "rap:tr.filter(x=>x<3000).length", "rap:tr.filter(x=>x<30000).length", "P5: pragul de 30 s în loc de 3 s"),
    ("motor", "if(dt>=350)R.tr[R.qi]=dt", "R.tr[R.qi]=0", "P5: timpul nu se mai măsoară (toate „sub 3 s”)"),
    ("motor", "if(dt>=350)R.tr[R.qi]=dt", "if(dt>=600)R.tr[R.qi]=dt", "P5: pragul dublu-clicului prea mare (600 ms): cel care ghicește la ~0,5 s scapă"),
    ("prezenta", "x.rap = e.rap; x.rq = e.rq; if (e.rel) x.rel = 1;", "", "P5: prezenta.js pierde rap/rq/rel din coadă"),
    ("prezenta", "        ap: aparat(),", "", "P7: ap nu pleacă"),
    ("prezenta", "        ap: aparat(),", "        ap: eu.id,", "P7: ap = id-ul elevului (se schimbă la „Sunt alt elev”)"),
    ("prezenta", "    sterge(K_ID); sterge(K_COADA); sterge(K_JURNAL); sterge(K_TINUT);",
     "    sterge(K_ID); sterge(K_COADA); sterge(K_JURNAL); sterge(K_TINUT); sterge(K_AP);", "P7: lh_aparat șters la „Schimbă elevul”"),
]


class _Sit(http.server.ThreadingHTTPServer):
    allow_reuse_address = False

    def handle_error(self, request, client_address):
        pass


class _Cereri(http.server.SimpleHTTPRequestHandler):
    """LearningHub de pe disc; POST /api/* se PRIND aici (t = ceasul paginii, din ambalaj)."""

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        n = int(self.headers.get("content-length") or 0)
        corp = self.rfile.read(n).decode("utf-8", "replace") if n else ""
        u = urlsplit(self.path)
        self.server.primite.append({"cale": u.path, "t": int(dict(parse_qsl(u.query)).get("t") or 0), "corp": corp})
        r = b'{"ok":true,"sec":0}' if u.path == "/api/activitate" else b'{"ok":true,"date":{}}'
        self.send_response(200)
        self.send_header("content-type", "application/json")
        self.send_header("access-control-allow-origin", "*")
        self.send_header("content-length", str(len(r)))
        self.end_headers()
        self.wfile.write(r)


def cheie_elev(nume):   # ca cheieElev din prezenta.js
    return SCOALA + "|" + CLASA + "|" + " ".join(sorted(re.sub(r"[^a-z0-9]+", " ", nume.lower()).split()))


def ruleaza(motor_txt=None, prezenta_txt=None, tacut=False):
    probleme = []

    def ok(c, ce, det=None):
        if not tacut:
            print(("  ok   " if c else "  RĂU  ") + ce + ("" if c or det is None else "  -> " + str(det)[:300]), flush=True)
        if not c:
            probleme.append(ce)

    srv = _Sit(("127.0.0.1", 0), functools.partial(_Cereri, directory=str(LH)))
    srv.primite = []
    port = srv.server_address[1]
    baza = "http://127.0.0.1:%d" % port
    url = baza + "/jocuri/%s/index.html" % JOC
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    externe, erori = [], []

    def garda(r):
        s = urlsplit(r.request.url)
        if s.scheme in ("data", "blob"):
            return r.continue_()
        if s.hostname not in LOCALE:
            externe.append(r.request.url[:120])
            return r.abort()
        if s.path == "/__gol":
            return r.fulfill(status=200, body="<!doctype html><title>gol</title>", headers={"content-type": "text/html"})
        if motor_txt is not None and s.path.endswith("/jocuri/_motor/motor.js"):
            return r.fulfill(status=200, body=motor_txt, headers={"content-type": "application/javascript; charset=utf-8"})
        if prezenta_txt is not None and s.path.endswith("/assets/js/prezenta.js"):
            return r.fulfill(status=200, body=prezenta_txt, headers={"content-type": "application/javascript; charset=utf-8"})
        return r.continue_()

    ids = {}
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--mute-audio"])

            def context():
                ctx = br.new_context(viewport={"width": 1280, "height": 900})
                ctx.route("**/*", garda)
                ctx.add_init_script(AMBALAJ % port)
                pg = ctx.new_page()
                pg.set_default_timeout(15000)
                pg.on("pageerror", lambda e: erori.append(str(e)))
                pg.clock.install()
                return ctx, pg

            ctx, pg = context()   # cheia jocului (C.cheie), dintr-o deschidere fără elev
            pg.goto(url, wait_until="load")
            pg.wait_for_function("window.JocMotor&&JocMotor.test.config()", timeout=20000)
            cheie = pg.evaluate("JocMotor.test.config().cheie")
            n = pg.evaluate("JocMotor.test.config().nivele[0].qs.length")
            ctx.close()
            del srv.primite[:]

            def eu(pg, nume, sertar, curata=False):
                """identitatea elevului pe browserul ăsta (ca după înscriere / „Cine lucrează acum?”), cu sertarul lui"""
                id_ = secrets.token_hex(16)
                ids[nume] = id_
                prof = "e_anti_" + nume.split()[0].lower()
                pg.goto(baza + "/__gol")
                pg.evaluate("""([c,o,curata])=>{if(curata)localStorage.clear();
                    const s=JSON.parse(localStorage.getItem('lh_sertare')||'{}');s[o.ce]=o.prof;
                    localStorage.setItem('lh_sertare',JSON.stringify(s));localStorage.setItem('learninghub_active_profile',o.prof);
                    localStorage.setItem('lh_prezenta',JSON.stringify(o.eu));localStorage.setItem(c+'@'+o.prof,JSON.stringify(o.sertar));}""",
                            [cheie, {"ce": cheie_elev(nume), "prof": prof, "sertar": sertar,
                                     "eu": {"id": id_, "scoala": SCOALA, "scoalaNume": "Școala de probă", "clasa": CLASA, "nume": nume,
                                            "numeEnc": ENC, "ultima": int(time.time() * 1000)}}, curata])

            def deschide(pg, q=""):
                pg.goto(url + q, wait_until="load")
                pg.wait_for_function("window.JocMotor&&document.getElementById('app')&&document.getElementById('app').children.length>0", timeout=20000)
                pg.clock.run_for(1500)
                pg.wait_for_timeout(300)

            def la_intrebari(pg):
                pg.click('.lvl[data-l="0"]')
                pg.clock.run_for(300)
                pg.click("#go")
                pg.clock.run_for(300)

            def raspunde(pg, pas_ms, cate=None, ultima_fara_next=False):
                """răspunde corect la întrebările rămase; pas_ms = cât stă pe fiecare întrebare înainte de răspuns (ceasul paginii)"""
                s = pg.evaluate("JocMotor.test.stare()") or {}
                tot = n - (s.get("qi") or 0) if cate is None else cate
                for i in range(tot):
                    pg.clock.run_for(pas_ms)
                    pg.evaluate("JocMotor.test.rezolva()")
                    pg.clock.run_for(100)
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                        pg.clock.run_for(100)
                    if ultima_fara_next and i == tot - 1:
                        break
                    pg.click("#next")
                    pg.clock.run_for(200)
                pg.wait_for_timeout(300)

            def pleaca(pg):   # pleacă de pe pagină: coada rămasă pleacă (sendBeacon, întors spre serverul local)
                pg.goto(baza + "/__gol")
                pg.wait_for_timeout(700)

            ap_ls = lambda pg: pg.evaluate("()=>{try{return JSON.parse(localStorage.getItem('lh_aparat'))}catch(e){return null}}")  # noqa: E731

            # ---- browserul 1: A repede, „Schimbă elevul”, B încet, B reia, „Sunt alt elev”, „Ieși” ----
            ctx, pg = context()
            eu(pg, "Albu Ana", {"nume": "Albu Ana", "lv": {}}, curata=True)
            deschide(pg)
            la_intrebari(pg)
            raspunde(pg, 200)   # ~0,5 s de la afișare la răspuns
            st_a = pg.evaluate("JocMotor.test.stare()") or {}
            ap1 = ap_ls(pg)
            pg.evaluate("Prezenta.uita()")   # „Schimbă elevul” (Nu ești tu?)
            pg.wait_for_timeout(400)
            ap_dupa_uita = ap_ls(pg)
            eu(pg, "Bratu Bogdan", {"nume": "Bratu Bogdan", "lv": {}})
            deschide(pg)
            la_intrebari(pg)
            raspunde(pg, 4000)   # ~4,3 s pe întrebare
            st_b = pg.evaluate("JocMotor.test.stare()") or {}
            pleaca(pg)
            deschide(pg, "?pas=q1&nivel=1")   # „De reluat”: reia nivelul terminat, repede
            raspunde(pg, 200)
            st_b2 = pg.evaluate("JocMotor.test.stare()") or {}
            pg.evaluate("Prezenta.intreaba()")   # „Sunt alt elev” din lecție
            pg.wait_for_timeout(300)
            ap_dupa_intreaba = ap_ls(pg)
            pg.evaluate("Prezenta.iesi()")
            pg.wait_for_timeout(300)
            ap_dupa_iesi = ap_ls(pg)
            pleaca(pg)
            ctx.close()

            # ---- browserul 2: C (nivel terminat cândva, sertar vechi fără qm) reia repede; D reîncarcă la mijloc ----
            ctx, pg = context()
            eu(pg, "Cozma Carmen", {"nume": "Cozma Carmen", "lv": {"0": {"stars": 1, "xp": 10, "p1": {"b": 2, "t": n, "c": int(time.time() * 1000) - 3 * 864e5}}}}, curata=True)
            deschide(pg, "?pas=q1&nivel=1")
            raspunde(pg, 200)
            st_c = pg.evaluate("JocMotor.test.stare()") or {}
            pleaca(pg)
            ap2 = ap_ls(pg)
            eu(pg, "Dima Dan", {"nume": "Dima Dan", "lv": {}})
            deschide(pg)
            la_intrebari(pg)
            raspunde(pg, 4000, cate=2, ultima_fara_next=True)   # Î1, Î2 răspunse; Î3 încă neafișată
            pg.reload(wait_until="load")
            pg.wait_for_function("window.JocMotor&&document.querySelector('.toc')", timeout=20000)
            pg.clock.run_for(1500)
            la_intrebari(pg)
            raspunde(pg, 200)
            st_d = pg.evaluate("JocMotor.test.stare()") or {}
            pleaca(pg)
            ctx.close()
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()

    # ---- ce a plecat spre /api/activitate, pe elev ----
    nume_de = {v: k for k, v in ids.items()}
    cereri = {}
    for x in srv.primite:
        if x["cale"] != "/api/activitate":
            continue
        try:
            b = json.loads(x["corp"])
        except Exception:
            continue
        cereri.setdefault(nume_de.get(b.get("id"), "?"), []).append(b)
    A, B, C, D = "Albu Ana", "Bratu Bogdan", "Cozma Carmen", "Dima Dan"
    toate = [b for l in cereri.values() for b in l]
    niv = lambda nume: [e for b in cereri.get(nume, []) for e in (b.get("ev") or []) if e.get("tip") == "nivel" and not e.get("sinc")]  # noqa: E731
    forma = lambda l: [(e.get("nivel"), e.get("rap"), e.get("rq"), e.get("rel")) for e in l]  # noqa: E731

    titlu = (lambda s: None) if tacut else print
    titlu("-- A1: id-ul aparatului (ap)")
    aps = {k: {b.get("ap") for b in l} for k, l in cereri.items()}
    ok(all(k in cereri for k in (A, B, C, D)), "fiecare elev a trimis cereri /api/activitate", {k: len(v) for k, v in cereri.items()})
    ok(toate and all(isinstance(b.get("ap"), str) and re.fullmatch(r"[a-f0-9]{32}", b["ap"]) for b in toate),
       "ap în FIECARE cerere: 32 de semne hex", [b.get("ap") for b in toate][:6])
    ok(aps.get(A) == aps.get(B) == {ap1} and ap1 and ap_dupa_uita == ap1 == ap_dupa_intreaba == ap_dupa_iesi,
       "același ap pe browserul 1 pentru A și B (după „Schimbă elevul”, „Sunt alt elev”, „Ieși”, reîncărcări) = lh_aparat",
       {"A": aps.get(A), "B": aps.get(B), "ls": [ap1, ap_dupa_uita, ap_dupa_intreaba, ap_dupa_iesi]})
    ok(aps.get(C) == aps.get(D) == {ap2} and ap2 and ap2 != ap1, "browserul 2: alt ap (același pentru C și D)", {"C": aps.get(C), "D": aps.get(D), "ap1": ap1})
    ok(all(b.get("ap") != b.get("id") and b.get("ap") != b.get("h") and "albu" not in b.get("ap", "").lower() for b in toate),
       "ap nu e id-ul elevului, nici amprenta, nu conține numele")

    titlu("-- T: cronometrul pe întrebare (rap / rq / rel)")
    ok(st_a.get("phase") == "end" and forma(niv(A)) == [(1, n, n, None)],
       "T1 A, prima terminare, ~0,5 s pe întrebare: rap = rq = %d, fără rel" % n, (st_a, forma(niv(A))))
    nb = niv(B)
    ok(st_b.get("phase") == "end" and nb and forma(nb[:1]) == [(1, 0, n, None)],
       "T2 B, prima terminare, ~4,3 s pe întrebare: rap = 0, rq = %d (elev cinstit)" % n, (st_b, forma(nb)))
    ok(st_b2.get("phase") == "end" and len(nb) == 2 and forma(nb[1:]) == [(1, None, None, None)],
       "T3 B reia repede nivelul terminat (?pas=q1): întrebările atinse deja nu se cronometrează (fără rap/rq)", (st_b2, forma(nb)))
    ok(st_c.get("phase") == "end" and forma(niv(C)) == [(1, n, n, 1)],
       "T4 C reia repede un nivel terminat cândva (sertar vechi, fără qm): rap = rq = %d, rel:1" % n, (st_c, forma(niv(C))))
    ok(st_d.get("phase") == "end" and forma(niv(D)) == [(1, n - 2, n - 2, None)],
       "T5 D: Î1, Î2 răspunse, reîncărcare, apoi totul repede: doar cele %d neatinse se cronometrează (rap = rq = %d)" % (n - 2, n - 2),
       (st_d, forma(niv(D))))
    sinc = [e for b in toate for e in (b.get("ev") or []) if e.get("sinc")]
    ok(sinc and all("rap" not in e and "rq" not in e and "rel" not in e for e in sinc),
       "T6 retrimiterile de la deschidere (sinc:1, %d) nu poartă rap/rq/rel" % len(sinc), sinc[:3])

    titlu("-- X")
    ok(not erori, "0 erori JS", erori[:3])
    ok(not [u for u in externe if "teste-vasile" in u], "nicio cerere spre teste-vasile (alte externe abandonate: %d)" % len(externe),
       [u for u in externe if "teste-vasile" in u][:3])
    return probleme


def mutanti():
    adev = {"motor": MOTOR.read_text(encoding="utf-8"), "prezenta": PREZENTA.read_text(encoding="utf-8")}
    neprinsi = 0
    for fel, vechi, nou, ce in MUTANTI:
        src = adev[fel]
        if src.count(vechi) != 1:
            print("  NEPRINS (ținta apare de %d ori în %s): %s" % (src.count(vechi), fel, ce))
            neprinsi += 1
            continue
        mut = src.replace(vechi, nou)
        try:
            pr = ruleaza(motor_txt=mut if fel == "motor" else None, prezenta_txt=mut if fel == "prezenta" else None, tacut=True)
        except Exception as e:
            print("  NEPRINS (rularea a crăpat: %s): %s" % (str(e).splitlines()[0][:120], ce))
            neprinsi += 1
            continue
        print(("  prins   (%d picate): " % len(pr) if pr else "  NEPRINS: ") + ce, flush=True)
        neprinsi += 0 if pr else 1
    print("Mutanți: %d, prinși: %d" % (len(MUTANTI), len(MUTANTI) - neprinsi))
    return neprinsi


def main():
    print("== proba anti-păcăleli, clientul (motor.js + prezenta.js adevărate)")
    pr = ruleaza()
    print("Picate: %d" % len(pr))
    if "--mutanti" in sys.argv:
        n = mutanti()
        print(n + len(pr))
    else:
        print(len(pr))


if __name__ == "__main__":
    main()
