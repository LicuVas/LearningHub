"""Proba JURNALULUI NOU („tabloul meu”) și a SEMNALELOR din prezenta.js (10.10.2026; contract
AI_0\\projects\\teste-elevi\\contracte\\2026-10-10_jurnal_panou_baza_comuna, R2-R5 + spec_api.md §1, §2, §6).

    python proba_jurnal_tablou.py              # proba (ultima linie = câte verificări au picat)
    python proba_jurnal_tablou.py --mutanti    # proba + mutanții (ultima linie = mutanți NEprinși + verificări picate)

JURNALUL (jurnal/index.html), pe un telefon de 360 px, cu serverul SIMULAT de probă (route.fulfill, date inventate):
  J1 elev cu 2 aparate (serverul întoarce suma): minutele de azi, ale săptămânii, ale fiecărei lecții și FIECARE pătrățel
     din calendar = cele de pe server (0 diferențe); cererea are {id, h}; 4 stări de lecție (făcută pe aparat, făcută pe
     ALT aparat, începută „P3 din N”, neîncepută); „Continuă: Lecția 3 … · pasul P3” -> ?continua=1; „De reluat” = lista
     exactă așteptată (motiv + legătură la pas); toate legăturile în filă nouă; 360 px fără derulare în lateral;
  J2 lecțiile 1-4 terminate -> „Începe: Lecția 5”; J3 nimic -> „Începe: Lecția 1”;
  J4 clic pe „Continuă” -> FILĂ NOUĂ cu lecția reală, deschisă de motor la P3 (bara, starea motorului, titlul pasului);
  J5 fără rețea -> datele de pe aparat + nota „arăt doar ce e pe telefonul ăsta”; J6 neînscris / vizitator -> 0 cereri.
TRIMITERILE (assets/js/prezenta.js), pe lecția reală, cu ceasul paginii accelerat (page.clock):
  P1 `h` și `acum.pas` (din lh-pas); P2 un singur ev „pas” pe pas (și după reîncărcare); P3 `plecat` „ascuns” la ascundere
  (fără `acum`), apoi un „acum” la revenire; P4 o singură plecare „fara-gesturi” după 120 s fără gest; P5 „ascuns” după
  10 s fără focus; P6 o singură plecare „inchis” la părăsirea paginii; P7 cadența: o oră de lucru continuu = cel mult 13
  cereri /api/activitate.
Regula 24: situl e servit LOCAL; în browser tot ce nu e 127.0.0.1 e abandonat, iar /api/jurnal, /api/activitate și
/api/progres primesc răspunsuri inventate de probă (nicio cerere nu pleacă spre teste-vasile). navigator.sendBeacon e
înlocuit în pagină (ce ar fi trimis se ține în localStorage, ca proba să-l citească). Browserul pornește cu --mute-audio.
"""
import argparse
import datetime as dt
import functools
import http.server
import json
import re
import sys
import tempfile
import threading
import time
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
JURNAL = LH / "jurnal" / "index.html"
PREZENTA = LH / "assets" / "js" / "prezenta.js"
LECTIE = "lectii/v/m1-l03/"
LOCALE = ("127.0.0.1", "localhost")
H = "b" * 64
ID_ANA = "idtablou" + "0" * 16

try:   # ziua în ora României (ca serverul); fără baza de fusuri, ziua calculatorului (care e în România)
    from zoneinfo import ZoneInfo
    def azi_ro(): return dt.datetime.now(ZoneInfo("Europe/Bucharest")).date()
except Exception:
    def azi_ro(): return dt.date.today()

INIT = r"""
(function(){
  // sendBeacon nu trece prin ctx.route: ce ar pleca se ține în localStorage (proba îl citește), nimic nu iese
  var B=window.Blob;function W(p,o){var b=new B(p,o);try{b.__txt=(p||[]).map(String).join('')}catch(e){}return b}W.prototype=B.prototype;window.Blob=W;
  try{navigator.sendBeacon=function(u,b){try{var a=JSON.parse(localStorage.getItem('__proba_beacons')||'[]');a.push({u:String(u),t:(b&&b.__txt)||(typeof b==='string'?b:'')});localStorage.setItem('__proba_beacons',JSON.stringify(a))}catch(e){}return true}}catch(e){}
  Document.prototype.hasFocus=function(){return window.__fokus!==false};
  window.__ascunde=function(){Object.defineProperty(document,'visibilityState',{configurable:true,get:function(){return 'hidden'}});
    Object.defineProperty(document,'hidden',{configurable:true,get:function(){return true}});document.dispatchEvent(new Event('visibilitychange',{bubbles:true}))};
  window.__arata=function(){delete document.visibilityState;delete document.hidden;document.dispatchEvent(new Event('visibilitychange',{bubbles:true}))};
})();
"""

# mutanții: (fișier, nume, din, cu); fiecare strică o cerință; partea probei care atinge fișierul trebuie să pice
MUTANTI = [
    ("prezenta", "M1 fără amprenta h", "h: eu.h || null,   // amprenta progresului", "h: null,   //"),
    ("prezenta", "M2 fără acum.pas", "if (ps) unde.pas = ps;", ""),
    ("prezenta", "M3 la ascundere tot acum:null (fără plecat)", "if (motiv) { unde.motiv = motiv; o.plecat = unde; } else o.acum = unde;", "o.acum = motiv ? null : unde;"),
    ("prezenta", "M4 fără „fara-gesturi”", "if (s === 'activ') pleaca('fara-gesturi', false);", ""),
    ("prezenta", "M5 ev „pas” la fiecare atingere", "if (al[k]) return;\n", ""),
    ("prezenta", "M6 cadența veche (3 minute)", "TRIMITE_LA = 300000", "TRIMITE_LA = 180000"),
    ("prezenta", "M7 fără plecarea la 10 s fără focus", "if (document.visibilityState === 'visible' && !document.hasFocus()) pleaca('ascuns', false);", ""),
    ("jurnal", "M8 jurnalul ignoră serverul", "if(SRV&&SRV_ID===e.id){", "if(false){"),
    ("jurnal", "M9 „Continuă” fără ?continua=1", "esc(urm.url+'?continua=1')", "esc(urm.url)"),
    ("jurnal", "M10 legăturile în aceeași filă", "var NOU=' target=\"_blank\" rel=\"noopener\"';", "var NOU='';"),
    ("jurnal", "M11 prima încercare: 60% intră la reluat", "(+p1.b||0)/p1.t<0.6", "(+p1.b||0)/p1.t<=0.6"),
    ("jurnal", "M12 cere serverul și pentru vizitator / neînscris", "if(!eElev(e)||stareEu(e)!=='activ')return;", "if(!e)e={id:'x'};"),
]


def iso(z, ora="10:00:00"):
    return "%sT%s.000Z" % (z, ora)


class Proba:
    def __init__(self, br, baza, jurnal_txt=None, prezenta_txt=None, tacut=False):
        self.br, self.baza, self.tacut = br, baza, tacut
        self.jurnal_txt, self.prezenta_txt = jurnal_txt, prezenta_txt
        self.probleme, self.externe, self.erori = [], [], []
        self.jurnal_cereri, self.activ, self.progres = [], [], 0
        self.mod_jurnal, self.raspuns_jurnal = "server", {"ok": True, "aparate": 0}

    def verifica(self, c, ce, det=""):
        if not self.tacut:
            print(("  ok   " if c else "  RĂU  ") + ce + (("  — " + str(det)[:400]) if det and not c else ""), flush=True)
        if not c:
            self.probleme.append(ce)

    # ---- rețeaua: doar 127.0.0.1; serverul e simulat aici ----
    def ruta(self, r):
        u = r.request.url
        s = urlsplit(u)
        if s.scheme in ("data", "blob"):
            return r.continue_()
        cors = {"access-control-allow-origin": "*", "content-type": "application/json"}
        if s.hostname not in LOCALE:
            if s.hostname == "teste-vasile.netlify.app" and s.path == "/api/jurnal":
                self.jurnal_cereri.append(r.request.post_data or "")
                if self.mod_jurnal == "offline":
                    return r.abort()
                return r.fulfill(status=200, headers=cors, body=json.dumps(self.raspuns_jurnal))
            if s.hostname == "teste-vasile.netlify.app" and s.path == "/api/activitate":
                self.activ.append(r.request.post_data or "")
                return r.fulfill(status=200, headers=cors, body='{"ok":true,"sec":0}')
            if s.hostname == "teste-vasile.netlify.app" and s.path == "/api/progres":
                self.progres += 1
                return r.fulfill(status=200, headers=cors, body='{"ok":true}')
            self.externe.append(u)
            return r.abort()
        if s.path == "/__gol":
            return r.fulfill(status=200, body="<!doctype html><title>gol</title>", headers={"content-type": "text/html"})
        if self.jurnal_txt is not None and s.path in ("/jurnal/", "/jurnal/index.html"):
            return r.fulfill(status=200, body=self.jurnal_txt, headers={"content-type": "text/html; charset=utf-8"})
        if self.prezenta_txt is not None and s.path.endswith("/assets/js/prezenta.js"):
            return r.fulfill(status=200, body=self.prezenta_txt, headers={"content-type": "application/javascript; charset=utf-8"})
        return r.continue_()

    def context(self, **kw):
        ctx = self.br.new_context(**kw)
        ctx.route("**/*", self.ruta)
        ctx.add_init_script(INIT)
        ctx.on("page", lambda p: p.on("pageerror", lambda e: self.erori.append(str(e))))
        return ctx

    def pune(self, pg, ls):
        pg.goto(self.baza + "/__gol")
        pg.evaluate("o=>{localStorage.clear();for(const k in o)if(o[k]!=null)localStorage.setItem(k,typeof o[k]==='string'?o[k]:JSON.stringify(o[k]))}", ls)

    def ruleaza(self, parti=("J", "P")):
        try:
            self.plan = json.loads((LH / "lectii" / "plan.json").read_text(encoding="utf-8"))
            self.lv5 = [l for m in self.plan["clase"]["v"]["module"] for l in m["lectii"] if l["stare"] == "publicat"]
            self.titlu = {l["nr"]: l["titlu"] for l in self.lv5}
            if "J" in parti:
                self._jurnal()
            if "P" in parti:
                self._prezenta()
        except Exception as e:
            self.verifica(False, "proba s-a oprit: " + str(e).splitlines()[0][:220])
        self.verifica(not self.erori, "0 erori JS", self.erori[:3])
        return self.probleme

    # =========================== JURNALUL ===========================
    def config_lectie(self, ctx):
        pg = ctx.new_page()
        self.pune(pg, {"learninghub_active_profile": "e_cfg"})
        pg.goto(self.baza + "/" + LECTIE)
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
        cfg = pg.evaluate("(()=>{const n=JocMotor.test.config().nivele[0];return {pn:n.pasi.length,q:n.qs.length,t3:n.pasi[2].t}})()")
        pg.close()
        return cfg

    def eu(self, **x):
        return dict({"id": ID_ANA, "nume": "Tablou Ana", "clasa": "5 AM", "scoala": "brauner", "scoalaNume": "Școala (probă)",
                     "numeEnc": "x", "h": H, "ultima": int(time.time() * 1000)}, **x)

    def asteapta(self, pg, sursa="server", text=None, sel="#corp"):
        try:
            pg.wait_for_function("([s,t,q])=>document.body.dataset.sursa===s&&document.getElementById('lectii')&&(!t||(document.querySelector(q)||{innerText:''}).innerText.includes(t))",
                                 arg=[sursa, text, sel], timeout=15000)
            pg.wait_for_timeout(250)
            return True
        except Exception:
            return False

    def _jurnal(self):
        ctx = self.context(viewport={"width": 360, "height": 780}, device_scale_factor=2, is_mobile=True, has_touch=True)
        cfg = self.config_lectie(ctx)
        PN, Q = cfg["pn"], cfg["q"]
        azi = azi_ro()
        z = lambda n: (azi - dt.timedelta(days=n)).isoformat()
        T = int(time.time() * 1000)
        # ---- J1: două aparate; serverul întoarce SUMA, aparatul ăsta are doar partea lui (mai mică)
        zile = {z(0): 1500, z(1): 2400, z(3): 700, z(9): 4000, z(30): 120, z(70): 999}
        srv = {"ok": True, "aparate": 2, "zile": zile, "ore": {},
               "pagini": {"/lectii/v/m1-l01/": {"t": "L1", "s": 900, "n": 3, "u": iso(z(3))},
                          "/lectii/v/m1-l03/": {"t": "L3", "s": 640, "n": 2, "u": iso(z(0), "08:00:00")},
                          "/vechi/lectia-x/": {"t": "Lecția veche X", "s": 300, "n": 1, "u": iso(z(9))}},
               "jocuri": {"lectie_v_m1_l04": {"titlu": "Lecția 4", "nivele": {"1": 3}, "din": 1, "u": iso(z(1)), "gata": iso(z(1))},
                          "calculator-v": {"titlu": "Misiunea Tehnician", "nivele": {"1": 3, "2": 2}, "din": 4, "u": iso(z(2))}},
               "note": {"/vechi/lectia-x/": {"t": "Lecția veche X", "nota": 5, "maxim": 5, "incercari": 1, "u": iso(z(9))},
                        "/vechi/lectia-y/": {"t": "Lecția veche Y", "nota": 7, "maxim": 7, "incercari": 1, "u": iso(z(9))}},
               "ev": [], "ultima": iso(z(0)), "plecat": {"p": "/lectii/v/m1-l03/", "t": "L3", "cand": iso(z(0)), "motiv": "ascuns", "pas": {"pas": "p3", "eticheta": "P3"}}}
        sertar = {
            "lectie_v_m1_l01@e_ana": {"nume": "", "lv": {"0": {"stars": 3, "v": 1, "p1": {"b": 2, "t": 5, "c": 1}, "t1": T - 3 * 864e5}}},
            "lectie_v_m1_l02@e_ana": {"nume": "", "lv": {"0": {"stars": 2, "v": 1, "ps": [0, 2, 3], "pn": 4, "at": 0, "t1": T - 2 * 864e5}}},
            "lectie_v_m1_l03@e_ana": {"nume": "", "lv": {"0": {"v": 1, "ps": [0, 2], "pn": PN, "t0": T - 7200000, "t1": T - 3600000}}},
            "joc_calculator_v@e_ana": {"nume": "", "lv": {"0": {"stars": 3, "p1": {"b": 3, "t": 5, "c": 1}}, "1": {"stars": 2, "p1": {"b": 1, "t": 4, "c": 2}}}},
        }
        ls = dict(sertar, **{"lh_prezenta": self.eu(), "learninghub_active_profile": "e_ana",
                             "lh_prezenta_jurnal": {"id": ID_ANA, "zile": {z(0): 300}, "pagini": {"/lectii/v/m1-l03/": {"t": "L3", "s": 120, "u": T}}, "jocuri": {}}})
        pg = ctx.new_page()
        self.mod_jurnal, self.raspuns_jurnal = "server", srv
        self.pune(pg, ls)
        n0 = len(self.jurnal_cereri)
        pg.goto(self.baza + "/jurnal/")
        gata = self.asteapta(pg, "server", "Misiunea Tehnician, nivelul 2", "#de-reluat")
        self.verifica(gata, "J1 jurnalul s-a desenat din datele serverului (cu jocurile recunoscute)")
        corpuri = [json.loads(x) for x in self.jurnal_cereri[n0:]]
        self.verifica(len(corpuri) >= 1 and all(c == {"id": ID_ANA, "h": H} for c in corpuri), "J1 cererea /api/jurnal = {id, h} ale elevului", corpuri[:2])
        # minutele = serverul (nu aparatul ăsta: 300 s azi)
        sec = lambda s: int(pg.get_attribute(s, "data-sec") or -1)
        luni = azi - dt.timedelta(days=azi.weekday())
        sapt = sum(v for k, v in zile.items() if luni.isoformat() <= k <= azi.isoformat())
        self.verifica(sec("#azi") == 1500 and "25 min" in pg.inner_text("#azi"), "J1 azi = 1.500 s de pe server (aparatul ăsta are 300)", (sec("#azi"), pg.inner_text("#azi")))
        self.verifica(sec("#sapt") == sapt, "J1 săptămâna asta = suma de pe server (%d s)" % sapt, sec("#sapt"))
        cal = pg.evaluate("[...document.querySelectorAll('#cal i[data-zi]')].map(i=>[i.dataset.zi,+i.dataset.sec,i.className])")
        start = luni - dt.timedelta(days=56)
        astept = [(start + dt.timedelta(days=k)).isoformat() for k in range((azi - start).days + 1)]
        nuanta = lambda s: 0 if s <= 0 else 1 if s < 600 else 2 if s < 1800 else 3 if s < 3600 else 4
        dif = [c for c in cal if c[1] != zile.get(c[0], 0) or ("n%d" % nuanta(c[1])) not in c[2].split()]
        self.verifica(sorted(c[0] for c in cal) == astept and not dif, "J1 calendarul: %d pătrățele (de luni, acum 8 săptămâni, până azi), 0 diferențe față de server" % len(astept),
                      (len(cal), len(astept), dif[:3]))
        self.verifica("de pe 2 aparate" in pg.inner_text("#cine"), "J1 „de pe 2 aparate”", pg.inner_text("#cine"))
        # stările lecțiilor
        rand = lambda nr: pg.evaluate("k=>{const r=document.querySelector('#lectii li[data-cheie=\"'+k+'\"]');return r?{s:r.dataset.stare,sec:+r.dataset.sec,t:r.innerText,a:r.querySelector('a').getAttribute('href')}:null}", "lectie_v_m1_l%02d" % nr)
        r1, r3, r4, r5 = rand(1), rand(3), rand(4), rand(5)
        st = [(r1 or {}).get("s"), (r4 or {}).get("s"), (r3 or {}).get("s"), (r5 or {}).get("s")]
        self.verifica(st == ["gata", "gata", "inc", "nu"], "J1 4/4 stări: L1 făcută (aparat), L4 făcută (ALT aparat), L3 începută, L5 neîncepută", st)
        self.verifica(r1 and r1["sec"] == 900 and "15 min" in r1["t"] and "★ 3" in r1["t"] and r3 and r3["sec"] == 640,
                      "J1 minutele lecțiilor = serverul (L1 900 s, L3 640 s), stelele L1", (r1, r3))
        self.verifica(r3 and "P3 din %d" % PN in r3["t"] and r3["a"] == "../lectii/v/m1-l03/?continua=1", "J1 L3: „P3 din %d”, legătura ?continua=1" % PN, r3)
        self.verifica(r1 and r1["a"] == "../lectii/v/m1-l01/" and r5 and r5["a"] == "../lectii/v/m1-l05/", "J1 „Reia” L1 / „Începe” L5 la începutul lecției", (r1, r5))
        # Continuă
        ce = pg.inner_text("#continua")
        a = pg.get_attribute("#continua-link", "href")
        self.verifica(("Continuă: Lecția 3 — %s · pasul P3" % self.titlu[3]) in ce and a == "../lectii/v/m1-l03/?continua=1",
                      "J1 Continuă (lecție începută): „Continuă: Lecția 3 … · pasul P3” -> ?continua=1", (ce, a))
        # De reluat: lista exactă
        rel = pg.evaluate("[...document.querySelectorAll('#reluat li')].map(l=>[l.querySelector('.tt').firstChild.textContent,l.querySelector('.meta').textContent,l.querySelector('a').getAttribute('href')])")
        t = self.titlu
        astept_rel = [
            ["Lecția 1 — " + t[1], "la prima încercare 2 din 5", "../lectii/v/m1-l01/?pas=q1"],
            ["Lecția 2 — " + t[2], "ai sărit P2", "../lectii/v/m1-l02/?pas=p2"],
            ["Lecția 2 — " + t[2], "ai sărit Atelierul", "../lectii/v/m1-l02/?pas=atelier"],
            ["Lecția 3 — " + t[3], "ai sărit P2", "../lectii/v/m1-l03/?pas=p1"],
            ["Misiunea Tehnician, nivelul 2", "la prima încercare 1 din 4", "../jocuri/calculator-v/?pas=q1&nivel=2"],
            ["Lecția veche X", "nota 5", "/vechi/lectia-x/"],
        ]
        self.verifica(rel == astept_rel, "J1 „De reluat” = lista exactă (6: prima încercare < 60%, pași și atelier săriți, nota < 7; NU 3 din 5, NU nota 7)",
                      "\n         are:     %s\n         trebuia: %s" % (rel, astept_rel))
        # filă nouă: toate legăturile spre lecții / jocuri / pagini
        leg = pg.evaluate("[...document.querySelectorAll('#continua a,#lectii-mele a,#de-reluat a,#jocurile-mele a,#unde a')].map(a=>[a.getAttribute('href'),a.target,a.rel])")
        rau = [x for x in leg if x[1] != "_blank" or "noopener" not in x[2]]
        self.verifica(len(leg) >= 15 and not rau, "J1 %d legături, toate în filă nouă (target=_blank, rel=noopener)" % len(leg), rau[:3])
        w = pg.evaluate("""()=>{const W=document.documentElement.clientWidth;let rau=[];
            for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(r.width&&r.right>W+1)rau.push(e.tagName+'.'+e.className+' '+Math.round(r.right))}
            return {W,sw:document.documentElement.scrollWidth,rau:rau.slice(0,5)}}""")
        self.verifica(w["W"] == 360 and w["sw"] <= w["W"] and not w["rau"], "J1 360 px: nimic mai lat decât ecranul, fără derulare în lateral", w)
        txt = pg.inner_text("main")
        self.verifica(not re.search(r"clasament|locul \d|primul din clasă", txt.split("Ce vede profesorul")[0], re.I), "J1 fără clasament / comparații cu colegii")
        if not self.tacut:   # captura pentru ochi (în afara depozitului)
            try:
                pg.screenshot(path=str(Path(tempfile.gettempdir()) / "jurnal_tablou_360.png"), full_page=True)
            except Exception:
                pass

        # ---- J4: clic pe „Continuă” -> filă nouă, lecția reală, deschisă la P3
        with ctx.expect_page(timeout=10000) as nou:
            pg.click("#continua-link")
        p2 = nou.value
        try:
            p2.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.stare()&&window.__lhPas", timeout=15000)
            p2.wait_for_timeout(300)
            info = p2.evaluate("({st:JocMotor.test.stare(),pas:window.__lhPas.pas,now:(document.querySelector('.tabs [aria-current=step]')||{}).textContent,txt:(document.querySelector('.foaie')||{innerText:''}).innerText,url:location.pathname})")
            t3 = re.sub(r"<[^>]+>", "", cfg["t3"]).strip()[:25]
            self.verifica(info["url"] == "/" + LECTIE and info["st"]["phase"] == "learn" and info["st"]["si"] == 2 and info["pas"] == "p3" and info["now"] == "P3" and t3 in info["txt"],
                          "J4 clic pe „Continuă” -> filă nouă cu %s, la P3 (bara: P3, motorul: pasul 3, titlul „%s…” pe ecran)" % (LECTIE, t3), {k: info[k] for k in ("url", "st", "pas", "now")})
        except Exception as e:
            self.verifica(False, "J4 fila nouă nu a ajuns la pas: " + str(e).splitlines()[0][:150])
        p2.close()

        # ---- J2: lecțiile 1-4 terminate -> lecția 5; J3: nimic -> lecția 1
        gol = {"ok": True, "aparate": 1, "zile": {}, "ore": {}, "pagini": {}, "jocuri": {}, "note": {}, "ev": [], "ultima": None, "plecat": None}
        for caz, sert, nr, ce_ in (("J2 lecțiile 1-4 terminate", {"lectie_v_m1_l%02d@e_ana" % i: {"nume": "", "lv": {"0": {"stars": 3, "v": 1}}} for i in range(1, 5)}, 5, "Începe"),
                                   ("J3 nimic început", {}, 1, "Începe")):
            self.raspuns_jurnal = gol
            self.pune(pg, dict(sert, **{"lh_prezenta": self.eu(), "learninghub_active_profile": "e_ana"}))
            pg.goto(self.baza + "/jurnal/")
            self.asteapta(pg, "server")
            ce = pg.inner_text("#continua")
            a = pg.get_attribute("#continua-link", "href")
            self.verifica(("%s: Lecția %d — %s" % (ce_, nr, self.titlu[nr])) in ce and a == "../lectii/v/m1-l%02d/" % nr,
                          "%s -> „%s: Lecția %d”, la începutul ei" % (caz, ce_, nr), (ce, a))

        # ---- J5: fără rețea -> doar aparatul, cu nota
        self.mod_jurnal = "offline"
        self.pune(pg, ls)
        pg.goto(self.baza + "/jurnal/")
        self.asteapta(pg, "local")
        self.verifica(pg.evaluate("document.body.dataset.sursa") == "local" and "arăt doar ce e pe telefonul ăsta" in pg.inner_text("#sursa") and sec("#azi") == 300,
                      "J5 fără rețea: datele de pe aparat (azi 300 s) + nota „arăt doar ce e pe telefonul ăsta”", (pg.inner_text("#sursa"), sec("#azi")))
        self.mod_jurnal = "server"

        # ---- J6: neînscris și vizitator -> 0 cereri
        for caz, eu in (("neînscris", None), ("vizitator („Nu, doar vizitez”)", {"refuz": int(time.time() * 1000)})):
            n0 = len(self.jurnal_cereri)
            self.pune(pg, {"lh_prezenta": eu})
            pg.goto(self.baza + "/jurnal/")
            pg.wait_for_timeout(1500)
            self.verifica(len(self.jurnal_cereri) == n0 and "Mă înscriu" in pg.inner_text("#corp"), "J6 %s: 0 cereri spre server, fără jurnal" % caz, len(self.jurnal_cereri) - n0)
        ctx.close()

    # =========================== TRIMITERILE (prezenta.js) ===========================
    def corpuri(self, pg, de_la=0):
        """toate cererile /api/activitate (fetch, prin route) + ce ar fi plecat cu sendBeacon (din localStorage)"""
        b = pg.evaluate("JSON.parse(localStorage.getItem('__proba_beacons')||'[]')")
        f = [json.loads(x) for x in self.activ[de_la:]]
        return f, [json.loads(x["t"]) for x in b if x["u"].endswith("/api/activitate")]

    def gest(self, pg):
        pg.evaluate("dispatchEvent(new Event('scroll'))")

    def lucreaza(self, pg, ms, pas=20000, cu_gest=True):
        while ms > 0:
            if cu_gest:
                self.gest(pg)
            pg.clock.run_for(min(pas, ms))
            ms -= pas
            pg.wait_for_timeout(15)   # răspunsurile simulate (fetch) ajung în pagină

    def deschide(self, pg, q=""):
        pg.clock.resume()
        pg.goto(self.baza + "/" + LECTIE + q)
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&window.Prezenta&&window.__lhPas", timeout=20000)
        pg.wait_for_timeout(400)
        pg.clock.pause_at(pg.evaluate("Date.now()") / 1000 + 1)   # în Python, un număr = SECUNDE (nu ms)

    def _prezenta(self):
        ctx = self.context(viewport={"width": 1280, "height": 900})
        pg = ctx.new_page()
        self.pune(pg, {"lh_prezenta": self.eu(id="idtrimite" + "0" * 15), "learninghub_active_profile": "e_pp"})
        pg.clock.install()
        a0 = len(self.activ)
        self.deschide(pg, "?pas=p1")
        pg.evaluate("JocMotor.test.pas(1)")   # P2
        pg.evaluate("JocMotor.test.pas(0)")   # înapoi la P1 (revenire: nu se mai trimite)
        pg.evaluate("JocMotor.test.pas(1)")   # iar P2
        self.lucreaza(pg, 36000, 5000)        # 30 s lucrate pe pagină -> prima trimitere
        f, _ = self.corpuri(pg, a0)
        c = f[0] if f else {}
        ac = c.get("acum") or {}
        self.verifica(c.get("h") == H, "P1 trimiterea are h = amprenta elevului", c.get("h"))
        self.verifica(ac.get("p") == "/" + LECTIE and (ac.get("pas") or {}).get("pas") == "p2" and (ac.get("pas") or {}).get("cheie") == "lectie_v_m1_l03"
                      and (ac.get("pas") or {}).get("eticheta") == "P2" and (ac.get("pas") or {}).get("nivel") == 0 and "plecat" not in c,
                      "P1 acum = {p: /%s, pas: {cheie, nivel 0, pas p2, eticheta P2}} după lh-pas" % LECTIE, ac)

        # P3: ascunderea -> plecat „ascuns” (beacon), fără acum; revenirea după peste un minut -> un „acum”
        pg.evaluate("__ascunde()")
        _, b = self.corpuri(pg)
        pl = b[-1] if b else {}
        self.verifica(len(b) == 1 and (pl.get("plecat") or {}).get("motiv") == "ascuns" and (pl.get("plecat") or {}).get("p") == "/" + LECTIE
                      and ((pl.get("plecat") or {}).get("pas") or {}).get("pas") == "p2" and "acum" not in pl and pl.get("h") == H,
                      "P3 la ascundere: plecat {p, pas P2, motiv „ascuns”}, fără acum", pl)
        n = len(self.activ)
        self.lucreaza(pg, 70000, 10000, cu_gest=False)
        pg.evaluate("__arata()")
        self.lucreaza(pg, 6000, 6000)
        f, _ = self.corpuri(pg, n)
        self.verifica(len(f) == 1 and f[0].get("acum") and not f[0].get("plecat"), "P3 la revenire (după 70 s): un singur „acum”", f)

        # P4: 120 s fără gest -> O plecare „fara-gesturi”; încă 2 minute -> nimic; primul gest -> „acum”
        n = len(self.activ)
        self.lucreaza(pg, 130000, 10000, cu_gest=False)
        self.lucreaza(pg, 120000, 10000, cu_gest=False)
        f, _ = self.corpuri(pg, n)
        fg = [x for x in f if (x.get("plecat") or {}).get("motiv") == "fara-gesturi"]
        self.verifica(len(f) == 1 and len(fg) == 1 and ((fg[0]["plecat"].get("pas") or {}).get("pas") == "p2") and "acum" not in fg[0],
                      "P4 după 120 s fără gest: o singură plecare „fara-gesturi” (cu pasul), nimic altceva în 4 minute", f)
        n = len(self.activ)
        self.lucreaza(pg, 6000, 6000)
        f, _ = self.corpuri(pg, n)
        self.verifica(len(f) == 1 and f[0].get("acum"), "P4 la primul gest: lucrul reia, un „acum”", f)

        # P5: fereastra fără focus 10 s (elevul e în Excel) -> plecat „ascuns”
        n = len(self.activ)
        pg.evaluate("window.__fokus=false;dispatchEvent(new Event('blur'))")
        self.lucreaza(pg, 11000, 11000, cu_gest=False)
        f, _ = self.corpuri(pg, n)
        self.verifica(len(f) == 1 and (f[0].get("plecat") or {}).get("motiv") == "ascuns", "P5 10 s fără focus: plecat „ascuns”", f)
        pg.evaluate("window.__fokus=true;dispatchEvent(new Event('focus'))")
        self.lucreaza(pg, 70000, 10000)

        # P6: părăsirea paginii (reîncărcare) -> O plecare „inchis”; P2: după reîncărcare, P2 nu mai trimite ev „pas”
        nb = len(self.corpuri(pg)[1])
        self.deschide(pg, "?pas=p2")
        _, b = self.corpuri(pg)
        mot = [(x.get("plecat") or {}).get("motiv") for x in b[nb:]]
        self.verifica(mot == ["inchis"], "P6 la părăsirea paginii: o singură plecare, „inchis”", mot)
        self.verifica(pg.evaluate("window.__lhPas.pas") == "p2", "P2 după reîncărcare, ?pas=p2 deschide P2")
        pg.evaluate("__ascunde()")
        f, b = self.corpuri(pg, a0)
        ev = [e for x in f + b for e in (x.get("ev") or []) if e.get("tip") == "pas"]
        cnt = {}
        for e in ev:
            cnt[e.get("pas")] = cnt.get(e.get("pas"), 0) + 1
        bun = all(e.get("cheie") == "lectie_v_m1_l03" and e.get("nivel") == 0 and e.get("p") == "/" + LECTIE and e.get("cand") for e in ev)
        self.verifica(cnt == {"p1": 1, "p2": 1} and bun, "P2 un singur ev „pas” pe pas (P1, P2; revenirile și reîncărcarea nu mai trimit), cu cheie/nivel/p/cand", cnt)
        pg.clock.resume()
        pg.close()

        # P7: cadența — o oră de lucru continuu (un gest la 20 s) = câte cereri /api/activitate?
        pg = ctx.new_page()
        self.pune(pg, {"lh_prezenta": self.eu(id="idcadenta" + "0" * 15), "learninghub_active_profile": "e_cad"})
        pg.clock.install()
        self.deschide(pg)
        n, pr0 = len(self.activ), self.progres
        self.lucreaza(pg, 3600000, 20000)
        f, b = self.corpuri(pg, n)
        self.cadenta = len(f) + len(b)
        self.verifica(1 <= self.cadenta <= 13 and all(x.get("acum") for x in f), "P7 o oră de lucru continuu: %d cereri /api/activitate (țintă ≤ 13; progresul /api/progres separat: %d)"
                      % (self.cadenta, self.progres - pr0), [list(x.keys()) for x in f][:3])
        pg.clock.resume()
        ctx.close()


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mutanti", action="store_true")
    a = ap.parse_args()
    srv = Server(("127.0.0.1", 0), functools.partial(Tacut, directory=str(LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = "http://127.0.0.1:%d" % srv.server_address[1]
    externe = []
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--mute-audio"])
            print("Proba jurnalului și a trimiterilor (%s)" % baza)
            P = Proba(br, baza)
            prob = P.ruleaza()
            externe += P.externe
            scapati = 0
            if a.mutanti:
                txt = {"jurnal": JURNAL.read_text(encoding="utf-8"), "prezenta": PREZENTA.read_text(encoding="utf-8")}
                print("Mutanții (fiecare = partea probei care atinge fișierul, pe o copie stricată)")
                for fis, nume, din, in_ in MUTANTI:
                    if txt[fis].count(din) != 1:
                        print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt[fis].count(din)))
                        scapati += 1
                        continue
                    m = txt[fis].replace(din, in_)
                    M = Proba(br, baza, jurnal_txt=m if fis == "jurnal" else None, prezenta_txt=m if fis == "prezenta" else None, tacut=True)
                    pm = M.ruleaza(("J",) if fis == "jurnal" else ("P",))
                    externe += M.externe
                    prins = bool([x for x in pm if not x.startswith("proba s-a oprit")])
                    print(("  ok   " if prins else "  RĂU  ") + "%s: %s (%s)" % (nume, "prins" if prins else "SCĂPAT", ("; ".join(pm[:2]) or "nicio verificare picată")[:200].replace("\n", " ")), flush=True)
                    scapati += not prins
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    print("cereri externe abandonate în browser (în afară de cele 3 adrese simulate): %d%s" % (len(externe), (" — " + "; ".join(sorted(set(externe))[:4])) if externe else ""))
    if a.mutanti:
        print("Rezultat: %d verificări picate pe fișierele adevărate; mutanți neprinși: %d din %d" % (len(prob), scapati, len(MUTANTI)))
        print(scapati + len(prob))
    else:
        print("Rezultat: " + ("TOATE OK" if not prob else "; ".join(x.split("\n")[0] for x in prob)[:600]))
        print(len(prob))


if __name__ == "__main__":
    main()
