"""Proba INSTRUMENTĂRII pe nivel (01.10.2026, fișa elevului, R11): ce face elevul pe un nivel ajunge în sertar și nu se
pierde nici la unirea de pe două aparate, nici cât stă „Ești tot X?” pe ecran. Vezi motor.js, „CE FACE ELEVUL PE NIVEL”.

    python proba_instrumentare.py                  # proba + mutanții (ultima linie = probleme + mutanți NEprinși)
    python proba_instrumentare.py --fara-mutanti   # doar proba
    python proba_instrumentare.py --motor F --prezenta F --unire F   # aceeași probă pe alte fișiere (așa rulează mutanții)

Regula 24 (05_STANDARD_LECTIE.md): situl e servit LOCAL (127.0.0.1); în browser tot ce nu e local e abandonat, iar
/api/progres și /api/activitate primesc răspuns din probă (nimic nu pleacă spre teste-vasile.netlify.app). Elevul e
inventat („Proba Ana Fisa”, Forestier X E). Norul (/api/progres) e simulat cu unirea ADEVĂRATĂ (netlify/lib/unire.mjs,
prin node). Jocul: grafica-v (nivelul 1 are 4 pași cu exerciții cu indiciu, atelier și 5 întrebări de verificare).

Scenariul:
  A. aparatul 2 (fără internet): elevul se înscrie, cere 3 indicii pe nivelul 1 (pașii 1-3), nu termină nivelul
  B. aparatul 1: eticheta „Altă școală (nu e în listă)”; se înscrie; nivelul 1: ~12 s de lucru, 2 indicii (pașii 1-2),
     „Știu deja — la verificare” (sare pașii 3-4 și atelierul), o întrebare greșită de 2 ori + „Arată-mi răspunsul”, una
     greșită o dată -> prima încercare 3 din 5; reia nivelul perfect (p1 NU se schimbă); deschide nivelul 2 și iese;
     nivelul 3 (deblocat forțat: interfața îl ține blocat, așa că săritul unui nivel se face doar așa) terminat
  C. aparatul 2 revine online: unirea (din prezenta.js) păstrează tot de pe ambele; aparatul 1 trage și el unirea
  D. aparatul 1, „Ești tot X?”: un indiciu cerut atunci stă în @_tinut, nu la X; „Da” îl ADUNĂ la X
  E. „Ia-o de la capăt”: stelele pleacă, istoricul (p1, indicii, secunde) rămâne
  F. un sertar VECHI (doar stars/xp) se încarcă identic cu motorul de dinainte (commit eab6aa4d) și nu se rescrie
  G. unirea: copia din prezenta.js = cea de pe server pe 600 de perechi, iar unirea din motor.js (save() cu discul) = cea
     din prezenta.js; nivelurile vechi = unirea de dinainte (dedcf554); reguli de mână (maxim / cel mai vechi / reuniune /
     sumă la mutare)
  H. DOUĂ FILE (poarta de lansare, 01.10.2026): fila B termină nivelurile 1-2; fila veche A deschide nivelul 1, îl
     termină, stă ~8 s pe el și se închide -> stelele din B rămân, secundele lui A se adaugă
  I. sertar vechi -> „Ia-o de la capăt” -> nivelul refăcut nu primește p1 (rămâne {fp:1, v:1} până îl reface)
  J. elev anonim pe cheia fără profil, apoi înscris: intrarea întreagă (stele + indicii) trece la el, ca stelele înainte
  K. (informativ, nu se numără) o filă cu motorul VECHI citește un sertar scris de motorul nou
Mutanții (proba trebuie să-i prindă pe toți): M1 unirea de pe server ia minimul la ind/ara/sec; M2 p1 se suprascrie la
reluare; M3 mutarea din @_tinut pierde câmpurile noi; M4 indiciul cerut cât stă întrebarea nu ajunge în @_tinut;
M5 save() fără unire cu discul; M6 noteaza rescrie tot sertarul din memorie; M7 fără fp la „Ia-o de la capăt”;
M8 (10.10.2026) copia din prezenta.js nu ia maximul la re/qm (bara pașilor pe elev: re, qm = maximul, ul = valoarea mai nouă).
Ultima linie = numărul de probleme (+ mutanții scăpați). 0 = bine.
"""
import argparse
import functools
import http.server
import json
import subprocess
import sys
import tempfile
import threading
import time
from pathlib import Path
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8")
MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
AI0 = Path(r"C:\00\AI_0")
MOTOR = MOTOR_DIR / "motor.js"
PREZENTA = LH / "assets" / "js" / "prezenta.js"
UNIRE = AI0 / "projects" / "teste-elevi" / "site" / "netlify" / "lib" / "unire.mjs"
VECHI_LH, VECHI_AI0 = "eab6aa4d1a52a444b11249ad7d999ed9cf21c93e", "dedcf5541321a7f17e04e9996caea4103ce426eb"   # înainte de 01.10.2026
JOC = "grafica-v"
UA = "LearningHub-lectii/1.0 (educational site)"
NUME, COD = "Proba Ana Fisa", "4827"
PORT = 0   # portul îl alege sistemul (mutanții pornesc câte o probă nouă, fiecare cu serverul ei)
LOCALE = ("127.0.0.1", "localhost")

probleme = []


def verifica(c, ce):
    print(("  ok   " if c else "  RĂU  ") + ce, flush=True)
    if not c:
        probleme.append(ce)


# ---------------- node: unirea (server + copia din prezenta.js) ----------------
NODE_JS = r"""
import fs from 'fs'; import vm from 'vm'; import { pathToFileURL } from 'url';
const [mod, unireP, prezP, vechiP, vechiPrezP, motorP] = process.argv.slice(2);
const U = await import(pathToFileURL(unireP).href);
const intre = (s, a, b) => { const i = s.indexOf(a), j = s.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error('lipsește blocul ' + a); return s.slice(i, j); };
function copiaPrezenta(p, cuNoi) {
  const s = fs.readFileSync(p, 'utf8'), c = {};
  vm.runInNewContext((cuNoi ? intre(s, '  var NOI = [', '  // la înscriere / alegerea din listă') : '') + intre(s, '  function uneste(a, b) {', '  var Nor = {') +
    '\nthis.P={uneste:uneste' + (cuNoi ? ',nivelMutat:nivelMutat,unesteNivel:unesteNivel' : '') + '};', c);
  return c.P;
}
function copiaMotor(p) {   // unirea din motor.js (save() unește memoria cu discul)
  const s = fs.readFileSync(p, 'utf8'), c = {};
  vm.runInNewContext(intre(s, 'const ordonat=o=>', '/* DOUĂ FILE CU ACELAȘI JOC') + '\nthis.M={uneNivel:uneNivel};', c);
  return c.M;
}
const citeste = () => JSON.parse(fs.readFileSync(0, 'utf8') || '[]');
if (mod === 'cli') { process.stdout.write(JSON.stringify(citeste().map(([a, b]) => U.uneste(a, b)))); process.exit(0); }
const P = copiaPrezenta(prezP, true), V = await import(pathToFileURL(vechiP).href), PV = copiaPrezenta(vechiPrezP, false);
let seed = 12345; const r = (n) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
const T = 1759300000000;
function nivel(fel) {
  if (fel === 0) return { stars: 1 + r(3), xp: r(60) };
  const l = {}; const pune = (k, v) => { if (r(3)) l[k] = v; };
  if (fel === 2 || fel === 3) { l.stars = 1 + r(3); l.xp = r(60); }
  l.v = 1; pune('ind', r(6)); pune('ara', r(3)); pune('sec', r(900)); pune('t0', T + r(1e6)); pune('t1', T + 1e6 + r(1e6));
  pune('ps', [r(5), r(5)]); pune('pn', 4 + r(2)); pune('at', r(2));
  // 10.10.2026, bara pașilor pe elev: re (Aplicația văzută), qm (cea mai mare Î atinsă), ul (ultimul pas afișat)
  pune('re', 1); pune('qm', 1 + r(5)); pune('ul', ['p1', 'p3', 'atelier', 'real', 'q2', 'gata'][r(6)]);
  if (fel === 3 || (fel === 2 && r(2))) l.p1 = { b: r(6), t: 5, c: T + r(1e6) };
  if (fel === 4) { l.ind = 'x'; l.sec = -5; l.ps = [1, 'a', 2.5, -1, 3]; l.p1 = { b: '3' }; l.t0 = 'ieri'; l.qm = 'x'; l.re = -1; }
  return Object.keys(l).sort().reduce((o, k) => (o[k] = l[k], o), {});
}
function sertar(vechi) {
  const lv = {}; for (let i = 0; i < 4; i++) if (r(4)) lv[i] = nivel(vechi ? 0 : r(5));
  return { v: JSON.stringify({ nume: r(2) ? 'Proba Ana' : '', lv }), u: T + r(5) * 1000 };
}
const MO = copiaMotor(motorP);
const iesire = { copii: 0, vechi: 0, vechiPrez: 0, motor: 0, exemple: [], semantic: [] };
for (let k = 0; k < 600; k++) {
  const a = sertar(false), b = sertar(false);
  const x = JSON.stringify(U.uneste(a, b)), y = JSON.stringify(P.uneste(a, b));
  if (x !== y) { iesire.copii++; if (iesire.exemple.length < 3) iesire.exemple.push({ a, b, server: x, prezenta: y }); }
  const la = JSON.parse(a.v).lv, lb = JSON.parse(b.v).lv;
  for (const i in la) if (lb[i] && JSON.stringify(MO.uneNivel(la[i], lb[i])) !== JSON.stringify(P.unesteNivel(la[i], lb[i]))) iesire.motor++;
}
for (let k = 0; k < 300; k++) {
  const a = sertar(true), b = sertar(true);
  if (JSON.stringify(U.uneste(a, b)) !== JSON.stringify(V.uneste(a, b))) iesire.vechi++;
  if (JSON.stringify(P.uneste(a, b)) !== JSON.stringify(PV.uneste(a, b))) iesire.vechiPrez++;
}
const S = (lv, u) => ({ v: JSON.stringify({ nume: 'Proba Ana', lv }), u });
const L = (o) => JSON.parse(o.v).lv;
const caz = (ce, f) => { for (const [n, M] of [['server', U], ['prezenta', P]]) { let ok = false; try { ok = f(M); } catch (e) { ok = false; } if (!ok) iesire.semantic.push(n + ': ' + ce); } };
for (const [ua, ub] of [[1, 2], [2, 1]]) {
  const u = (o) => L(o)[0];
  caz(`ind/ara/sec = maximul (u ${ua}/${ub})`, (M) => { const z = u(M.uneste(S({ 0: { v: 1, ind: 2, ara: 0, sec: 100 } }, ua), S({ 0: { v: 1, ind: 1, ara: 3, sec: 50 } }, ub))); return z.ind === 2 && z.ara === 3 && z.sec === 100; });
  caz(`p1 = cea mai veche (u ${ua}/${ub})`, (M) => u(M.uneste(S({ 0: { stars: 2, xp: 30, p1: { b: 3, t: 5, c: 1000 } } }, ua), S({ 0: { stars: 3, xp: 50, p1: { b: 5, t: 5, c: 2000 } } }, ub))).p1.b === 3);
  caz(`p1 de pe un singur aparat rămâne (u ${ua}/${ub})`, (M) => u(M.uneste(S({ 0: { stars: 3, xp: 50 } }, ua), S({ 0: { v: 1, stars: 2, xp: 30, p1: { b: 3, t: 5, c: 1000 } } }, ub))).p1.b === 3);
  caz(`t0 cel mai vechi, t1 cel mai nou (u ${ua}/${ub})`, (M) => { const z = u(M.uneste(S({ 0: { v: 1, t0: 10, t1: 50 } }, ua), S({ 0: { v: 1, t0: 20, t1: 40 } }, ub))); return z.t0 === 10 && z.t1 === 50; });
  caz(`ps = reuniunea (u ${ua}/${ub})`, (M) => JSON.stringify(u(M.uneste(S({ 0: { v: 1, ps: [0, 1] } }, ua), S({ 0: { v: 1, ps: [1, 2] } }, ub))).ps) === '[0,1,2]');
  caz(`stele max + câmpuri noi de pe celălalt aparat (u ${ua}/${ub})`, (M) => { const z = u(M.uneste(S({ 0: { stars: 2, xp: 30 } }, ua), S({ 0: { v: 1, ind: 1 } }, ub))); return z.stars === 2 && z.xp === 30 && z.ind === 1; });
  caz(`două intrări „văzut” rămân fără stele (u ${ua}/${ub})`, (M) => { const z = u(M.uneste(S({ 0: { v: 1, ind: 1 } }, ua), S({ 0: { v: 1, sec: 5 } }, ub))); return !('stars' in z) && !('xp' in z); });
  caz(`nivel doar pe aparatul rămas în urmă nu se pierde (u ${ua}/${ub})`, (M) => { const z = L(M.uneste(S({ 0: { stars: 1, xp: 9 }, 1: { v: 1, ind: 4 } }, ua), S({ 0: { stars: 2, xp: 20 } }, ub))); return z[1] && z[1].ind === 4; });
  // 10.10.2026, bara pașilor pe elev: re/qm = maximul, ul = de la valoarea mai nouă (u mai mare)
  caz(`re/qm = maximul (u ${ua}/${ub})`, (M) => { const z = u(M.uneste(S({ 0: { v: 1, re: 1, qm: 2 } }, ua), S({ 0: { v: 1, qm: 4 } }, ub))); return z.re === 1 && z.qm === 4; });
  caz(`ul = de la valoarea mai nouă (u ${ua}/${ub})`, (M) => u(M.uneste(S({ 0: { v: 1, ul: 'p3' } }, ua), S({ 0: { v: 1, ul: 'q2' } }, ub))).ul === (ub > ua ? 'q2' : 'p3'));
  caz(`ul de pe un singur aparat rămâne (u ${ua}/${ub})`, (M) => u(M.uneste(S({ 0: { v: 1, ul: 'p3', qm: 1 } }, ua), S({ 0: { v: 1, ps: [0] } }, ub))).ul === 'p3');
}
caz('aceeași valoare de două ori = același text (idempotent)', (M) => { const a = S({ 0: { ara: 1, ind: 2, p1: { b: 3, c: 5, t: 5 }, ps: [0, 1], sec: 40, stars: 3, t0: 1, t1: 2, v: 1, xp: 50 } }, 5); return M.uneste(a, { v: a.v, u: 6 }).v === a.v; });
const mut = (ce, f) => { let ok = false; try { ok = f(P.nivelMutat); } catch (e) { ok = false; } if (!ok) iesire.semantic.push('prezenta mutaJoc: ' + ce); };
mut('ind/ara/sec se ADUNĂ la mutare', (m) => { const z = m({ stars: 3, xp: 40, ind: 2, sec: 100, p1: { b: 3, t: 5, c: 9 } }, { v: 1, ind: 1, ara: 1, sec: 10 }); return z.ind === 3 && z.ara === 1 && z.sec === 110 && z.p1.b === 3 && z.stars === 3; });
mut('p1 nu trece la un nivel terminat fără p1', (m) => !('p1' in m({ stars: 2, xp: 20 }, { v: 1, stars: 3, xp: 50, p1: { b: 5, t: 5, c: 9 } })));
mut('p1 trece la un nivel neterminat', (m) => m({ v: 1, ind: 1 }, { v: 1, stars: 3, xp: 50, p1: { b: 5, t: 5, c: 9 } }).p1.b === 5);
mut('re/qm = maximul la mutare, ul = al muncii mutate', (m) => { const z = m({ v: 1, qm: 3, ul: 'q3' }, { v: 1, qm: 1, re: 1, ul: 'p2' }); return z.qm === 3 && z.re === 1 && z.ul === 'p2'; });
mut('nivel vechi: exact ca înainte',(m) => JSON.stringify(m({ stars: 2, xp: 20 }, { stars: 3, xp: 10 })) === JSON.stringify({ stars: 3, xp: 20 }));
process.stdout.write(JSON.stringify(iesire));
"""


class Nod:
    def __init__(self, unire, prezenta, motor):
        self.dir = Path(tempfile.mkdtemp(prefix="proba_instr_"))
        self.js = self.dir / "unire_proba.mjs"
        self.js.write_text(NODE_JS, encoding="utf-8")
        self.unire, self.prezenta, self.motor = str(unire), str(prezenta), str(motor)
        self.vechi = self.dir / "unire_vechi.mjs"
        self.vechi.write_bytes(subprocess.run(["git", "-C", str(AI0), "show", VECHI_AI0 + ":projects/teste-elevi/site/netlify/lib/unire.mjs"],
                                              capture_output=True, check=True).stdout)
        self.vechi_prez = self.dir / "prezenta_vechi.js"
        self.vechi_prez.write_bytes(subprocess.run(["git", "-C", str(LH), "show", VECHI_LH + ":assets/js/prezenta.js"], capture_output=True, check=True).stdout)
        self.vechi_motor = self.dir / "motor_vechi.js"
        self.vechi_motor.write_bytes(subprocess.run(["git", "-C", str(LH), "show", VECHI_LH + ":jocuri/_motor/motor.js"], capture_output=True, check=True).stdout)

    def run(self, mod, intrare=None):
        r = subprocess.run(["node", str(self.js), mod, self.unire, self.prezenta, str(self.vechi), str(self.vechi_prez), self.motor],
                           input=json.dumps(intrare) if intrare is not None else "", capture_output=True, text=True, encoding="utf-8", timeout=120)
        if r.returncode:
            raise RuntimeError("node: " + (r.stderr or "")[-400:])
        return json.loads(r.stdout)


# ---------------- situl local + norul simulat ----------------
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


NOR = {}          # amprentă -> {cheie: {v, u}}
ONLINE = {}       # aparat -> are internet
ABANDONATE = []   # ce a încercat să iasă din calculator (și a fost oprit)


def pregateste(br, aparat, nod, motor, prezenta, **kw):
    ctx = br.new_context(user_agent=UA, **kw)

    def garda(r):
        u = r.request.url
        if u.startswith(("data:", "blob:")) or urlsplit(u).hostname in LOCALE:
            return r.continue_()
        ABANDONATE.append(u[:90])
        return r.abort()

    def activitate(r):
        r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*", "content-type": "application/json"})

    def progres(r):
        if not ONLINE.get(aparat, True):
            return r.abort()
        b = json.loads(r.request.post_data or "{}")
        pe = NOR.setdefault(b.get("h", ""), {})
        op = b.get("op")
        if op == "scrie":
            chei = [(k, {"v": x.get("v"), "u": x.get("u", 0)}) for k, x in (b.get("date") or {}).items() if isinstance(x, dict)]
            for (k, _), dupa in zip(chei, nod.run("cli", [[pe.get(k), x] for k, x in chei])):
                pe[k] = dupa
            corp = {"ok": True, "date": pe}
        elif op == "stare":
            corp = {"ok": True, "cerere": None, "mutat": False}
        else:
            corp = {"ok": True, "date": pe}
        r.fulfill(status=200, body=json.dumps(corp), headers={"access-control-allow-origin": "*", "content-type": "application/json"})

    ctx.route("**/*", garda)
    ctx.route("**/api/activitate", activitate)
    ctx.route("**/api/progres", progres)
    ctx.route("**/jocuri/_motor/motor.js", lambda r: r.fulfill(path=str(motor), content_type="application/javascript"))
    ctx.route("**/assets/js/prezenta.js", lambda r: r.fulfill(path=str(prezenta), content_type="application/javascript"))
    pg = ctx.new_page()
    erori = []
    pg.on("pageerror", lambda e: erori.append(str(e)))
    return ctx, pg, erori


def deschide(pg, url):
    pg.goto(url, wait_until="load")
    pg.wait_for_function("window.JocMotor&&document.querySelector('.toc')", timeout=15000)


def inscrie(pg, nume=NUME):
    pg.wait_for_selector("#lhp-cine", timeout=15000)
    pg.click("#lhp-cine")
    pg.wait_for_function("document.querySelectorAll('#lhp-s option').length>2", timeout=15000)
    et = pg.evaluate("(document.querySelector('#lhp-s option[value=\"alta\"]')||{}).textContent||''")
    pg.select_option("#lhp-s", "forestier")
    pg.select_option("#lhp-c", "X E")
    pg.fill("#lhp-n", nume)
    pg.fill("#lhp-k", COD)
    with pg.expect_navigation(timeout=30000):
        pg.click("#lhp-ok")
    pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')&&window.JocMotor&&document.querySelector('.toc')", timeout=20000)
    return et


def cheie(pg, suf=None):
    return pg.evaluate("s=>JocMotor.test.config().cheie+'@'+(s||localStorage.getItem('learninghub_active_profile'))", suf)


def sertar(pg, k=None):
    pg.evaluate("JocMotor.test.scurge()")
    return pg.evaluate("k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}", k or cheie(pg)) or {}


def niv(s, i):
    return ((s or {}).get("lv") or {}).get(str(i)) or {}


def stare(pg):
    return pg.evaluate("(()=>{const s=JocMotor.test.stare(),Q=JocMotor.test.config().nivele[s.li].qs[s.qi];"
                       "return {qi:s.qi,t:Q.t,ok:Q.ok,n:(Q.o||[]).length,np:(Q.pairs||[]).length,"
                       "it:(Q.items||[]).map(x=>Array.isArray(x)?x[1]:0),nc:(Q.cats||[]).length}})()")


def gresit(pg):
    q = stare(pg)
    t = q["t"]
    if t == "choice":
        pg.click('#body .opt[data-k="%d"]' % next(k for k in range(q["n"]) if k != q["ok"]))
    elif t == "tf":
        pg.click('#body .opt[data-k="%d"]' % (1 if q["ok"] else 0))
    elif t == "match":
        for k in range(q["np"]):
            pg.click('#body [data-l="%d"]' % k)
            pg.click('#body [data-r="%d"]' % ((k + 1) % q["np"]))
        pg.click("#chk")
    elif t == "classify":
        for k, c in enumerate(q["it"]):
            pg.click('#body .cls-row[data-k="%d"] button[data-c="%d"]' % (k, (c + 1) % q["nc"]))
        pg.click("#chk")
    elif t == "order":
        for k in reversed(range(len(q["it"]))):
            pg.click('#body .pool .opt[data-k="%d"]' % k)
        pg.click("#chk")
    else:
        raise RuntimeError("tip fără răspuns greșit în probă: " + t)


def corect(pg):
    pg.evaluate("JocMotor.test.rezolva()")
    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
        pg.click("#chk")


def verificare_perfecta(pg, li):
    for _ in range(pg.evaluate("JocMotor.test.config().nivele[%d].qs.length" % li)):
        corect(pg)
        pg.click("#next")


def lucreaza(pg, sec):
    pg.bring_to_front()
    for i in range(int(sec / 1.5)):
        pg.mouse.move(300 + (i % 7) * 30, 200 + (i % 5) * 20)
        pg.wait_for_timeout(1500)


def asteapta(pg, cond, timp=20):
    """cu pg.wait_for_timeout (nu time.sleep): Playwright sincron răspunde la cereri (norul simulat) doar în apelurile lui"""
    t = time.time() + timp
    while time.time() < t:
        if cond():
            return True
        pg.wait_for_timeout(400)
    return False


def proba(motor, prezenta, unire):
    nod = Nod(unire, prezenta, motor)
    print("G. unirea (node: server %s, copia din %s)" % (Path(unire).name, Path(prezenta).name))
    g = nod.run("verifica")
    verifica(g["copii"] == 0, "copia din prezenta.js = unirea de pe server pe 600 de perechi (diferențe: %d %s)" % (g["copii"], json.dumps(g["exemple"][:1], ensure_ascii=False)[:300]))
    verifica(g["vechi"] == 0, "sertare vechi (doar stars/xp): unirea de pe server = cea de dinainte (diferențe: %d)" % g["vechi"])
    verifica(g["motor"] == 0, "unirea din motor.js (save() cu discul) = unesteNivel din prezenta.js, nivel cu nivel (diferențe: %d)" % g["motor"])
    verifica(g["vechiPrez"] == 0, "sertare vechi: unirea din prezenta.js = cea de dinainte (diferențe: %d)" % g["vechiPrez"])
    verifica(not g["semantic"], "regulile de unire (maxim, cel mai vechi, reuniune, sumă la mutare): %s" % (g["semantic"] or "toate"))

    h = functools.partial(H, directory=str(LH))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), h)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = "http://127.0.0.1:%d/jocuri/%s/index.html" % (port, JOC)
    from playwright.sync_api import sync_playwright
    try:
        with sync_playwright() as p:
            br = p.chromium.launch()
            ruleaza(br, url, nod, motor, prezenta)
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()


def ruleaza(br, url, nod, motor, prezenta):
    ONLINE["d2"] = False
    c2, p2, e2 = pregateste(br, "d2", nod, motor, prezenta, viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    c1, p1, e1 = pregateste(br, "d1", nod, motor, prezenta, viewport={"width": 1366, "height": 860})

    print("A. aparatul 2, fără internet: 3 indicii pe nivelul 1, neterminat")
    deschide(p2, url); p2.evaluate("localStorage.clear()"); deschide(p2, url)
    inscrie(p2)
    p2.click('.lvl[data-l="0"]')
    for k in range(3):
        p2.click(".ajutor button")
        if k < 2:
            p2.click("#pas-next")
    p2.evaluate("document.getElementById('go-home').click()")
    s2 = sertar(p2); a = niv(s2, 0)
    verifica(a.get("ind") == 3 and a.get("ps") == [0, 1, 2] and not a.get("stars") and a.get("v") == 1, "aparatul 2: nivelul 1 văzut, 3 indicii, pașii 1-3 (%s)" % a)

    print("B. aparatul 1: înscrierea, nivelul 1 cu indicii, greșeli și „Arată-mi”, nivelul 2 sărit, nivelul 3")
    deschide(p1, url); p1.evaluate("localStorage.clear()"); deschide(p1, url)
    et = inscrie(p1)
    verifica(et.strip() == "Altă școală (nu e în listă)", "eticheta din înscriere: „%s”" % et.strip())
    p1.click('.lvl[data-l="0"]')
    lucreaza(p1, 12)
    p1.click(".ajutor button")
    p1.click("#pas-next")
    p1.click(".ajutor button")
    p1.click("#go")   # „Știu deja — la verificare”: pașii 3-4 și atelierul rămân nedeschiși
    qs = p1.evaluate("JocMotor.test.config().nivele[0].qs.map(q=>q.t)")
    q_ara = next((i for i, t in enumerate(qs) if t in ("match", "classify", "order")), None)
    q_una = next((i for i, t in enumerate(qs) if i != q_ara and t in ("choice", "tf", "match", "classify", "order")), None)
    verifica(len(qs) == 5 and q_ara is not None and q_una is not None, "nivelul 1: 5 întrebări, una cu „Arată-mi” (%s), una de greșit o dată (%s): %s" % (q_ara, q_una, qs))
    for i in range(len(qs)):
        if i == q_ara:
            gresit(p1); gresit(p1)
            p1.click("#reveal")
        elif i == q_una:
            gresit(p1); corect(p1)
        else:
            corect(p1)
        p1.click("#next")
    s1 = sertar(p1); a = niv(s1, 0)
    verifica(a.get("ind") == 2, "nivelul 1: ind = 2 (%s)" % a.get("ind"))
    verifica(a.get("ara") == 1, "nivelul 1: ara = 1 (%s)" % a.get("ara"))
    verifica((a.get("p1") or {}).get("b") == 3 and (a.get("p1") or {}).get("t") == 5, "nivelul 1: prima încercare 3 din 5 (%s)" % a.get("p1"))
    verifica((a.get("sec") or 0) > 0, "nivelul 1: secunde lucrate > 0 (%s)" % a.get("sec"))
    verifica(a.get("ps") == [0, 1] and a.get("pn") == 4 and a.get("at") == 0, "nivelul 1: pașii văzuți [0,1] din 4, atelier nedeschis (%s, %s, %s)" % (a.get("ps"), a.get("pn"), a.get("at")))
    verifica(0 < (a.get("t0") or 0) <= (a.get("t1") or 0) and (a.get("stars") or 0) >= 1, "nivelul 1: t0 <= t1, terminat (%s)" % a)
    verifica(list(a.keys()) == sorted(a.keys()), "nivelul 1: cheile în ordine alfabetică (%s)" % list(a.keys()))
    p1_inainte = dict(a.get("p1") or {})
    p1.click("#again")   # reia nivelul, perfect
    p1.click("#go")
    verificare_perfecta(p1, 0)
    a = niv(sertar(p1), 0)
    verifica(a.get("p1") == p1_inainte and a.get("stars") == 3, "reluarea perfectă: p1 rămâne %s (acum %s), stele 3 (%s)" % (p1_inainte, a.get("p1"), a.get("stars")))
    p1.click("#toc")
    p1.click('.lvl[data-l="1"]')
    p1.click("#pas-prev")   # din pasul 1 înapoi la cuprins: nivelul 2 văzut, neterminat
    r1 = p1.evaluate("[...document.querySelectorAll('.lvl')].map(b=>b.querySelector('.s').textContent.trim())")
    verifica(r1[1].startswith("începe") and r1[2] == "blocat", "cuprinsul: nivelul 2 „începe →”, nivelul 3 blocat (%s)" % r1[:3])
    p1.evaluate("document.querySelector('.lvl[data-l=\"2\"]').disabled=false")
    p1.click('.lvl[data-l="2"]')
    p1.click("#go")
    verificare_perfecta(p1, 2)
    p1.click("#toc")
    s1 = sertar(p1)
    b, c3, d = niv(s1, 1), niv(s1, 2), niv(s1, 3)
    verifica(b.get("v") == 1 and not b.get("stars") and "p1" not in b, "nivelul 2: văzut, neterminat (%s)" % b)
    verifica((c3.get("stars") or 0) >= 1 and (c3.get("p1") or {}).get("b") == 5, "nivelul 3: terminat, prima încercare 5 din 5 (%s)" % c3)
    verifica(not d, "nivelul 4: neatins (%s)" % d)
    txt, nn = p1.inner_text("#cine-lucreaza"), p1.evaluate("JocMotor.test.config().nivele.length")
    verifica("2 din %d niveluri făcute" % nn in txt, "pe ecran: „2 din %d niveluri făcute” (%s)" % (nn, txt.strip()[:120]))
    k1 = cheie(p1)
    gk = k1.replace(p1.evaluate("localStorage.getItem('learninghub_active_profile')"), "~P")
    verifica(asteapta(p1, lambda: any(niv(json.loads(x[gk]["v"]), 0).get("ara") == 1 for x in NOR.values() if gk in x)), "norul simulat a primit nivelul 1 de la aparatul 1")

    print("C. aparatul 2 revine online: unirea păstrează tot de pe ambele aparate")
    ONLINE["d2"] = True
    t0_d2 = niv(s2, 0).get("t0")
    deschide(p2, url)
    ok = asteapta(p2, lambda: niv(sertar(p2), 0).get("stars") == 3, 25)
    a = niv(sertar(p2), 0)
    verifica(ok and a.get("ind") == 3 and a.get("ara") == 1 and (a.get("p1") or {}).get("b") == 3, "aparatul 2 după unire: ind = max(3, 2), ara 1, p1 3 din 5, stele 3 (%s)" % a)
    verifica(a.get("ps") == [0, 1, 2] and a.get("t0") == t0_d2 and (a.get("sec") or 0) >= (niv(s1, 0).get("sec") or 0), "aparatul 2: pașii = reuniunea, t0 = cel mai vechi, secundele = maximul (%s)" % a)
    verifica(niv(sertar(p2), 1).get("v") == 1 and (niv(sertar(p2), 2).get("stars") or 0) >= 1, "aparatul 2: nivelul 2 văzut și nivelul 3 făcut, de pe aparatul 1")
    verifica(asteapta(p2, lambda: any(niv(json.loads(x[gk]["v"]), 0).get("ps") == [0, 1, 2] for x in NOR.values() if gk in x)), "norul are unirea împinsă de aparatul 2")
    p1.evaluate("(()=>{const m=JSON.parse(localStorage.getItem('lh_nor')||'{}');m.tras=0;localStorage.setItem('lh_nor',JSON.stringify(m))})()")
    deschide(p1, url)
    ok = asteapta(p1, lambda: niv(sertar(p1), 0).get("ps") == [0, 1, 2], 25)
    a = niv(sertar(p1), 0)
    verifica(ok and a.get("ind") == 3 and a.get("p1") == p1_inainte, "aparatul 1 trage unirea: pașii [0,1,2], ind 3, p1 neschimbat (%s)" % a)

    print("D. „Ești tot X?”: indiciul cerut atunci stă deoparte; „Da” îl adună la X")
    ind0 = niv(sertar(p1), 0).get("ind")
    p1.evaluate("(()=>{const e=JSON.parse(localStorage.getItem('lh_prezenta'));e.ultima=Date.now()-2*3600e3;localStorage.setItem('lh_prezenta',JSON.stringify(e))})()")
    deschide(p1, url)
    p1.wait_for_selector("#lhp-da", timeout=10000)
    p1.click('.lvl[data-l="0"]')
    p1.click(".ajutor button")
    a, t = niv(sertar(p1, k1), 0), niv(sertar(p1, cheie(p1, "_tinut")), 0)
    verifica(a.get("ind") == ind0, "cât stă întrebarea, sertarul lui X nu primește indiciul (%s, era %s)" % (a.get("ind"), ind0))
    verifica(t.get("ind") == 1, "indiciul stă în @_tinut (%s)" % t)
    p1.evaluate("document.getElementById('go-home').click()")
    p1.click("#lhp-da")
    try:
        p1.wait_for_selector("#lhp-da2", timeout=1500)
        p1.click("#lhp-da2")
    except Exception:
        pass
    p1.wait_for_timeout(600)
    a = niv(sertar(p1, k1), 0)
    verifica(a.get("ind") == (ind0 or 0) + 1 and a.get("p1") == p1_inainte, "„Da”: X are acum %s indicii (era %s), p1 neschimbat" % (a.get("ind"), ind0))
    verifica(p1.evaluate("k=>localStorage.getItem(k)", cheie(p1, "_tinut")) is None, "@_tinut golit după „Da”")

    print("E. „Ia-o de la capăt”: stelele pleacă, istoricul rămâne")
    p1.click("#reset"); p1.click("#reset")
    s1 = sertar(p1)
    a = niv(s1, 0)
    verifica(not any((x or {}).get("stars") for x in (s1.get("lv") or {}).values()), "nicio stea în sertar după „Ia-o de la capăt”")
    verifica(a.get("p1") == p1_inainte and a.get("ind") == (ind0 or 0) + 1 and (a.get("sec") or 0) > 0 and a.get("v") == 1, "istoricul nivelului 1 rămâne (%s)" % a)
    r1 = p1.evaluate("[...document.querySelectorAll('.lvl')].map(b=>b.querySelector('.s').textContent.trim())")
    verifica(r1[0].startswith("începe") and r1[1] == "blocat" and not p1.locator("#reset").count(), "cuprinsul arată ca la început (%s)" % r1)

    print("F. un sertar VECHI (doar stars/xp) se încarcă identic cu motorul de dinainte")
    vechi = json.dumps({"nume": "Proba Vechi", "lv": {"0": {"stars": 2, "xp": 40}, "1": {"stars": 3, "xp": 52}}}, ensure_ascii=False)
    poze = []
    for m in (nod.vechi_motor, motor):
        c3x, p3, e3 = pregateste(br, "d3", nod, m, prezenta, viewport={"width": 1366, "height": 860})
        deschide(p3, url)
        k0 = p3.evaluate("JocMotor.test.config().cheie")
        p3.evaluate("([k,v])=>{localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}));localStorage.setItem(k,v)}", [k0, vechi])
        deschide(p3, url)
        p3.wait_for_timeout(800)
        poze.append(p3.evaluate("k=>({toc:document.querySelector('.toc').innerHTML,hud:document.getElementById('hud').innerText,"
                                "cine:document.getElementById('cine-lucreaza').innerHTML,reset:!!document.getElementById('reset'),"
                                "dipl:!!document.getElementById('dipl'),disc:localStorage.getItem(k)})", k0))
        verifica(not e3, "fără erori JS (%s motor)" % ("vechiul" if m == nod.vechi_motor else "noul"))
        c3x.close()
    verifica(poze[0] == poze[1], "același cuprins, aceeași bară, același „cine lucrează” ca motorul de dinainte")
    verifica(poze[1]["disc"] == vechi, "sertarul vechi nu e rescris la încărcare")

    verifica(not e1 and not e2, "fără erori JS (%s)" % (e1 + e2)[:3])
    c1.close(); c2.close()
    doua_file(br, url, nod, motor, prezenta)
    vechi_reluat(br, url, nod, motor, prezenta)
    anonim_inscris(br, url, nod, motor, prezenta)
    motor_vechi_citeste(br, url, nod, motor, prezenta)
    spre_server = [u for u in ABANDONATE if "teste-vasile" in u and "/api/progres" not in u and "/api/activitate" not in u]
    print("  (abandonate în browser: %d, dintre care spre teste-vasile: %d)" % (len(ABANDONATE), len(spre_server)))


def citeste(pg, k):
    return pg.evaluate("k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch(e){return {}}}", k) or {}


def stele(pg, k):
    return {i: x.get("stars") for i, x in (citeste(pg, k).get("lv") or {}).items() if (x or {}).get("stars")}


def randuri(pg):
    return pg.evaluate("[...document.querySelectorAll('.lvl .s')].map(x=>x.textContent.trim())")


def joaca(pg, li):
    pg.click('.lvl[data-l="%d"]' % li)
    if pg.locator("#go").count():
        pg.click("#go")
    verificare_perfecta(pg, li)
    pg.click("#toc")


def vizitator(pg, url, extra=None):
    """pagina curată, cu „Nu, doar vizitez” deja ales (elev anonim, cheia fără profil); extra = {cheie: valoare}"""
    deschide(pg, url)
    k = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("([k,v])=>{localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}));if(v)localStorage.setItem(k,v)}", [k, extra])
    deschide(pg, url)
    return k


def doua_file(br, url, nod, motor, prezenta):
    """poarta de lansare, 01.10.2026: fila veche (S vechi în memorie) nu are voie să șteargă ce s-a terminat în altă filă"""
    print("H. două file cu același joc: fila veche nu șterge ce s-a făcut în cealaltă")
    ctx, A, eA = pregateste(br, "d4", nod, motor, prezenta, viewport={"width": 1280, "height": 800})
    k = vizitator(A, url)
    A.wait_for_timeout(300)
    B = ctx.new_page()
    eB = []
    B.on("pageerror", lambda e: eB.append(str(e)))
    deschide(B, url)
    joaca(B, 0)
    joaca(B, 1)
    verifica(stele(B, k) == {"0": 3, "1": 3}, "fila B a terminat nivelurile 1 și 2 (%s)" % stele(B, k))
    A.bring_to_front()
    A.click('.lvl[data-l="0"]')
    A.evaluate("document.getElementById('go-home').click()")
    verifica(stele(B, k) == {"0": 3, "1": 3}, "fila veche deschide nivelul 1 și iese: stelele din fila B rămân (%s)" % stele(B, k))
    verifica(randuri(A)[0] == "★★★", "fila veche arată acum nivelul 1 terminat în fila B (%s)" % randuri(A)[:2])
    A.click('.lvl[data-l="0"]')
    A.click("#go")
    verificare_perfecta(A, 0)
    verifica(stele(B, k) == {"0": 3, "1": 3}, "fila veche TERMINĂ nivelul 1: nivelul 2 din fila B rămâne (%s)" % stele(B, k))
    sec0 = (niv(citeste(B, k), 0).get("sec") or 0)
    A.click("#again")
    lucreaza(A, 8)
    A.close(run_before_unload=True)
    B.wait_for_timeout(500)
    s = citeste(B, k)
    verifica(stele(B, k) == {"0": 3, "1": 3} and (niv(s, 0).get("sec") or 0) > sec0, "fila veche, ~8 s pe nivel, apoi închisă: stelele rămân, secundele s-au adăugat (%s -> %s)" % (sec0, niv(s, 0).get("sec")))
    deschide(B, url)
    r = randuri(B)
    verifica(r[:3] == ["★★★", "★★★", "începe →"], "fila B, reîncărcată: %s" % r[:3])
    verifica(not eA and not eB, "fără erori JS (%s)" % (eA + eB)[:2])
    ctx.close()


def vechi_reluat(br, url, nod, motor, prezenta):
    print("I. sertar vechi -> „Ia-o de la capăt” -> refăcut: nu primește p1 (nu e o primă încercare)")
    ctx, pg, er = pregateste(br, "d5", nod, motor, prezenta, viewport={"width": 1280, "height": 800})
    k = vizitator(pg, url, json.dumps({"nume": "Proba Vechi", "lv": {"0": {"stars": 2, "xp": 40}, "1": {"stars": 3, "xp": 52}}}))
    pg.click("#reset")
    pg.click("#reset")
    s = citeste(pg, k)
    verifica(niv(s, 0) == {"fp": 1, "v": 1} and niv(s, 1) == {"fp": 1, "v": 1}, "după „Ia-o de la capăt”: {fp:1, v:1} (%s)" % s.get("lv"))
    r = randuri(pg)
    verifica(r[0].startswith("începe") and r[1] == "blocat", "pe ecran ca înainte: %s" % r[:2])
    joaca(pg, 0)
    a = niv(citeste(pg, k), 0)
    verifica(a.get("stars") == 3 and "p1" not in a, "nivelul refăcut: 3 stele, fără p1 (%s)" % a)
    verifica(not er, "fără erori JS (%s)" % er[:2])
    ctx.close()


def anonim_inscris(br, url, nod, motor, prezenta):
    print("J. elev anonim (cheia fără profil), apoi înscris: indiciile se mută odată cu stelele, ca înainte")
    ctx, pg, er = pregateste(br, "d6", nod, motor, prezenta, viewport={"width": 1366, "height": 860})
    deschide(pg, url)
    pg.evaluate("localStorage.clear()")
    deschide(pg, url)
    k = pg.evaluate("JocMotor.test.config().cheie")
    pg.click('.lvl[data-l="0"]')
    pg.click(".ajutor button")
    pg.click("#go")
    verificare_perfecta(pg, 0)
    pg.click("#toc")
    anon = niv(citeste(pg, k), 0)
    verifica(anon.get("stars") == 3 and anon.get("ind") == 1, "anonim: nivelul 1 cu 3 stele și 1 indiciu pe cheia fără profil (%s)" % anon)
    inscrie(pg, "Proba Dan Fisa")   # alt elev decât A-E (norul simulat e comun)
    s = citeste(pg, cheie(pg))
    verifica(niv(s, 0) == anon and pg.evaluate("k=>localStorage.getItem(k)", k) is None,
             "după înscriere: intrarea întreagă (stele + indicii) e în sertarul celui înscris, cheia veche golită (%s)" % niv(s, 0))
    verifica(not er, "fără erori JS (%s)" % er[:2])
    ctx.close()


def motor_vechi_citeste(br, url, nod, motor, prezenta):
    """informativ (nu se numără): o filă deschisă de dinainte de publicare are motorul VECHI în memorie"""
    print("K. (informativ) motorul vechi citește un sertar scris de motorul nou")
    ctx, pg, er = pregateste(br, "d7", nod, nod.vechi_motor, prezenta, viewport={"width": 1366, "height": 860})
    nou = {"nume": "", "lv": {"0": {"at": 0, "ind": 2, "p1": {"b": 3, "t": 5, "c": 1}, "pn": 4, "ps": [0, 1], "sec": 30, "stars": 2, "t0": 1, "t1": 2, "v": 1, "xp": 36},
                              "1": {"at": 0, "pn": 4, "ps": [0], "t0": 3, "t1": 4, "v": 1}}}
    k = vizitator(pg, url, json.dumps(nou))
    print("  info motor vechi, nivelul 2 doar văzut: cuprins %s · %s" % (randuri(pg)[:3], pg.inner_text("#cine-lucreaza").strip().replace("\n", " ")[:90]))
    joaca(pg, 1)
    print("  info motor vechi termină nivelul 2 (era doar văzut): pe disc %s" % niv(citeste(pg, k), 1))
    ctx.route("**/jocuri/_motor/motor.js", lambda r: r.fulfill(path=str(motor), content_type="application/javascript"))
    deschide(pg, url)
    print("  info după reîncărcare cu motorul nou: cuprins %s" % randuri(pg)[:3])
    ctx.close()


# ---------------- mutanții ----------------
MUTANTI = [
    ("M1 unirea de pe server ia minimul la ind/ara/sec", "unire", "o[k] = Math.max(numar(p[k]), numar(l[k]));", "o[k] = Math.min(numar(p[k]), numar(l[k]));"),
    ("M2 p1 se suprascrie la reluare", "motor", "if(!l.p1&&(deoparte||(!terminatInainte&&!l.fp)))l.p1=", "if(true)l.p1="),
    ("M3 mutarea din @_tinut pierde câmpurile noi", "prezenta", "if (!areNoi(a, b)) return Object.assign({}, b, {", "if (true) return Object.assign({}, b, {"),
    ("M4 indiciul cerut cât stă întrebarea nu ajunge în @_tinut", "motor", "if(inAsteptare()){scrieIn(C.cheie+'@_tinut',i,fn,t,true);", "if(false){scrieIn(C.cheie+'@_tinut',i,fn,t,true);"),
    ("M5 save() fără unire cu discul", "motor", "if(d&&d.lv&&typeof d.lv==='object'){const lv=", "if(false){const lv="),
    ("M6 noteaza rescrie tot sertarul din memorie", "motor", "const e=scrieIn(SK,i,fn,t);",
     "const e=(()=>{const l=Object.assign({},S.lv[i]);if(!puneNota(l,fn,t))return null;S.lv[i]=ordonat(l);localStorage.setItem(SK,JSON.stringify(S));return S.lv[i]})();"),
    ("M7 reluarea unui nivel vechi după „Ia-o de la capăt” primește p1", "motor", "if(era&&!p1Bun(l.p1))l.fp=1;", ""),
    # 10.10.2026, bara pașilor pe elev: copia din prezenta.js uită re/qm (iau valoarea de pe un singur aparat)
    ("M8 prezenta.js nu ia maximul la re/qm", "prezenta", "['pn', 'at', 'v', 'fp', 're', 'qm'].forEach(", "['pn', 'at', 'v', 'fp'].forEach("),
]


def mutanti():
    d = Path(tempfile.mkdtemp(prefix="mutanti_instr_"))
    surse = {"motor": MOTOR, "prezenta": PREZENTA, "unire": UNIRE}
    scapati = 0
    for nume, unde, din, in_ in MUTANTI:
        txt = surse[unde].read_text(encoding="utf-8")
        if txt.count(din) != 1:
            print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt.count(din)))
            scapati += 1
            continue
        f = d / (nume.split()[0] + "_" + surse[unde].name)
        f.write_text(txt.replace(din, in_), encoding="utf-8")
        args = {"motor": str(MOTOR), "prezenta": str(PREZENTA), "unire": str(UNIRE)}
        args[unde] = str(f)
        r = subprocess.run([sys.executable, str(Path(__file__).resolve()), "--motor", args["motor"], "--prezenta", args["prezenta"], "--unire", args["unire"]],
                           capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=1200)
        linii = [x for x in (r.stdout or "").splitlines() if x.strip()]
        ultima = linii[-1].strip() if linii else ""
        # prins = cel puțin o verificare adevărată a picat (nu doar „proba s-a oprit”: o probă care crapă nu dovedește nimic)
        rau = [x.strip() for x in linii if x.strip().startswith("RĂU") and "proba s-a oprit" not in x]
        prins = ultima.isdigit() and int(ultima) > 0 and bool(rau)
        rau = rau[:2] or [x.strip() for x in linii if "proba s-a oprit" in x][:1]
        print(("  ok   " if prins else "  RĂU  ") + "%s: %s (%s)" % (nume, "prins" if prins else "SCĂPAT", ("; ".join(rau) or ultima or (r.stderr or "")[-160:])[:220]), flush=True)
        scapati += not prins
    return scapati


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--motor", default=str(MOTOR))
    ap.add_argument("--prezenta", default=str(PREZENTA))
    ap.add_argument("--unire", default=str(UNIRE))
    ap.add_argument("--fara-mutanti", action="store_true")
    a = ap.parse_args()
    sub = (a.motor, a.prezenta, a.unire) != (str(MOTOR), str(PREZENTA), str(UNIRE))
    try:
        proba(a.motor, a.prezenta, a.unire)
    except Exception as e:
        probleme.append("proba s-a oprit: " + str(e).splitlines()[0][:200])
        print("  RĂU  proba s-a oprit: " + str(e).splitlines()[0][:200])
    total = len(probleme)
    if not sub and not a.fara_mutanti:
        print("Mutanții (fiecare = proba întreagă pe o copie stricată)")
        total += mutanti()
    print("Rezultat: " + ("TOATE OK" if not total else "; ".join(probleme) or "mutanți scăpați"))
    print(total)


if __name__ == "__main__":
    main()
