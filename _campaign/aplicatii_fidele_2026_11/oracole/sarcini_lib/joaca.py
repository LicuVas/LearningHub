"""Jocul exercițiilor simulate (O6, R8) — modulul comun al referinței (construieste.py) și al oracolului (oracol_sarcini.py).

ACELAȘI cod joacă și referința, și reluarea. Ca referința să nu fie „adevărată prin construcție”, ea se verifică și
altfel: a doua rulare completă (oracolul pe situl neschimbat trebuie să dea 0) și bancul de mutanți (verificări
stricate într-o copie a sitului trebuie să dea > 0).

Ce înseamnă „a juca un exercițiu” (logica din jocuri/_motor/test_joc.py, rândurile 313-437, refolosită, nu rescrisă):
  pagina se deschide pe serverul local (127.0.0.1, port liber), toată rețeaua spre altceva e abandonată (regula 24);
  JocMotor.test.toateIntrebarile() + deblocheaza() + cuprinsul; apoi exercițiul se deschide după `cale` din inventar.json:
    nivele.L.pasi.S.incearca / .inca.J  -> clic pe nivel L, JocMotor.test.pas(S), JocMotor.test.exercitiu(0 / J+1)
    nivele.L.atelier / .atelier.inca.J  -> clic pe nivel L, JocMotor.test.atelier(), JocMotor.test.exercitiu(0 / J+1)
    nivele.L.qs.Q / nivele.L.bazin.Q    -> clic pe nivel L, „#go” (la verificare), Î1..ÎQ rezolvate ca în test_joc
                                           (rezolva + Verifică + Mai departe), apoi întrebarea Q
  și se face O ÎNCERCARE, mereu pe o pagină proaspătă (context nou de browser: localStorage gol), ca o încercare să nu
  vadă urmele alteia. Acțiunile (ACTIUNI):
    rezolva = JocMotor.test.rezolva()  (rezolvarea declarată de simulator pentru exercițiul ăsta)          -> „solutie”
    gresit  = JocMotor.test.gresit()   (greșeala tipică declarată de simulator: Q.gresit, Q.tipic & co.)    -> „gresit1”
    gol     = nicio acțiune: elevul apasă Verifică fără să fi făcut nimic („apasă repede”, contract.md)     -> „gresit2”
    partial = rezolvarea FĂRĂ ULTIMUL PAS (elevul se oprește înainte de capăt): lista de pași a exercițiului
              (Q.rezolvare / Q.solutie / Q.sol, cea care e listă de ≥ 2 pași) e scurtată cu unul cât ține
              JocMotor.test.rezolva(), apoi pusă la loc.
    vecin   = rezolvarea EXERCIȚIULUI VECIN (elevul repetă sarcina de dinainte): rezolvarea (Q.rezolvare / solutie / sol /
              verifica) a celui mai apropiat exercițiu de același tip din pagină (întâi cel dinainte), cu altă rezolvare,
              pusă în exercițiul curent cât ține JocMotor.test.rezolva(), apoi pusă la loc.
    alta_varianta = la exercițiile cu variante (Q.o/Q.ok, ≥ 3) sau zone (Q.zone/Q.ok), clic pe ULTIMA variantă/zonă
              greșită (gresit() o ia pe prima); e altă greșeală chiar dacă pagina arată la fel după ea.
    partial / vecin / alta_varianta înlocuiesc o greșeală DOAR unde cea obișnuită nu spune nimic (construieste.py): gresit() lasă
    simulatorul exact ca „gol” (lecția a declarat gresit:[]), gresit() lipsește/aruncă eroare, sau „gol” nu primește
    niciun verdict (simulatoare fără buton Verifică).
  apoi „Verifică” (#chk), dacă pagina nu a dat deja verdictul singură, și se citește verdictul din #fb:
    {"corect": true|false|null (fără verdict), "mesaj": textul din #fb (spații normalizate), "scor": „+10 XP …” sau null}

Determinism: Math.random e înlocuit (în pagină, înainte de orice script) cu un generator cu sămânță fixă; așa amestecările
motorului și ale simulatoarelor ies la fel la fiecare rulare. navigator.sendBeacon e oprit, iar assets/js/prezenta.js și
site-credit.js nu se încarcă deloc (garda_locala.py: sendBeacon la închiderea paginii scăpa de rută și scria pe serverul viu).
"""
import hashlib
import http.server
import json
import os
import re
import socketserver
import threading
import time
from functools import partial
from pathlib import Path
from urllib.parse import urlsplit

AICI = Path(__file__).resolve().parent
D = AICI.parents[1]                                  # _campaign/aplicatii_fidele_2026_11
WT_IMPLICIT = D.parents[1]                           # C:/00/Projects/LearningHub_fidel
INVENTAR = D / "inventar.json"
REFERINTA = D / "referinte" / "verdicte_vechi.json"

LOCALE = {"127.0.0.1", "localhost", "::1"}
# fișiere locale care vorbesc cu serverul viu: nu se încarcă (verdictul nu depinde de ele: motorul merge și fără Prezenta)
FARA = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")

INIT_JS = r"""
(() => {
  // generator cu sămânță fixă (mulberry32): aceleași amestecări la fiecare rulare
  let a = 0x5EED1234 >>> 0;
  Math.random = function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { Object.defineProperty(navigator, 'sendBeacon', { value: () => true, configurable: true }); } catch (e) {}
})();
"""

PLAN_IMPLICIT = {"solutie": "rezolva", "gresit1": "gresit", "gresit2": "gol"}
# Așteptări (ms). Unele simulatoare își termină desenul cu temporizări (ex. excelx-interfata.js: setTimeout(laFoaieStart, 200)):
# acțiunea și „Verifică” vin abia după ele, altfel verdictul ar depinde de cât de încărcat e procesorul.
DUPA_RANDARE = 400
DUPA_ACTIUNE = 250


def radacina(arg=None):
    """Rădăcina sitului: --radacina, altfel LH_RADACINA (convenția băncii de mutanți), altfel worktree-ul."""
    r = arg or os.environ.get("LH_RADACINA") or str(WT_IMPLICIT)
    return Path(r).resolve()


class _Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class _Srv(socketserver.ThreadingTCPServer):
    daemon_threads = True
    request_queue_size = 256          # implicit 5: sub mai multe browsere, Windows refuza conexiuni -> scripturi lipsă

    def handle_error(self, request, client_address):
        pass                          # conexiuni închise de browser la ctx.close(): nu sunt erori ale probei


class Server:
    """Server static pe 127.0.0.1, port liber (0), servind rădăcina dată (câte unul în fiecare proces lucrător)."""

    def __init__(self, rad):
        self.srv = _Srv(("127.0.0.1", 0), partial(_Tacut, directory=str(rad)))
        self.port = self.srv.server_address[1]
        self.th = threading.Thread(target=self.srv.serve_forever, daemon=True)

    def __enter__(self):
        self.th.start()
        return self

    def __exit__(self, *a):
        self.srv.shutdown()
        self.srv.server_close()


def e_local(u):
    if u.startswith(("data:", "blob:")):
        return True
    try:
        return (urlsplit(u).hostname or "").lower() in LOCALE
    except Exception:  # noqa: BLE001
        return False


def ruta_factory(blocate):
    def ruta(r):
        u = r.request.url
        if e_local(u) and not any(urlsplit(u).path.endswith(f) for f in FARA):
            return r.continue_()
        if not e_local(u):
            blocate.append(u[:100])
        return r.abort()
    return ruta


def norm(s):
    return re.sub(r"\s+", " ", (s or "").replace("\u00a0", " ")).strip()


def q160(s):
    """Amprenta enunțului: primele 160 de caractere, spații normalizate; idempotentă (q160(q160(x)) == q160(x))."""
    return norm(s)[:160].strip()


def parse_cale(cale):
    """'nivele.0.pasi.2.inca.1' -> ('pas', L, S, k) ; atelier -> ('atelier', L, None, k) ; qs/bazin -> ('q', L, None, Q)."""
    p = cale.split(".")
    if p[0] != "nivele":
        raise ValueError("cale necunoscută: " + cale)
    L = int(p[1])
    if p[2] == "pasi":
        S = int(p[3])
        k = 0 if p[4] == "incearca" else int(p[5]) + 1
        return ("pas", L, S, k)
    if p[2] == "atelier":
        k = 0 if len(p) == 3 else int(p[4]) + 1
        return ("atelier", L, None, k)
    if p[2] in ("qs", "bazin"):
        return ("q", L, None, int(p[3]))
    raise ValueError("cale necunoscută: " + cale)


JS_Q_LA_CALE = """(cale) => { let o = JocMotor.test.config(); for (const k of cale.split('.')) { if (o == null) return null; o = o[k]; }
  return o ? {t: o.t, q: String(o.q || '')} : null; }"""
JS_TOATE = """() => { const C = JocMotor.test.config(), out = [];
  (C.nivele || []).forEach((L, li) => {
    (L.pasi || []).forEach((P, si) => { if (P.incearca) out.push([`nivele.${li}.pasi.${si}.incearca`, P.incearca.q]);
      (P.inca || []).forEach((e, j) => { if (e) out.push([`nivele.${li}.pasi.${si}.inca.${j}`, e.q]); }); });
    if (L.atelier) { out.push([`nivele.${li}.atelier`, L.atelier.q]);
      (L.atelier.inca || []).forEach((e, j) => { if (e) out.push([`nivele.${li}.atelier.inca.${j}`, e.q]); }); }
    if (L.bazin) L.bazin.forEach((e, j) => out.push([`nivele.${li}.bazin.${j}`, e.q]));
    else (L.qs || []).forEach((e, j) => out.push([`nivele.${li}.qs.${j}`, e.q]));
  }); return out.map(([c, q]) => [c, String(q || '')]); }"""
JS_AMPRENTA = """() => { const b = document.getElementById('body'); if (!b) return null;
  const c = b.cloneNode(true); c.querySelectorAll('script').forEach(x => x.remove());
  const v = []; b.querySelectorAll('input,textarea,select').forEach(x => v.push(x.type === 'checkbox' || x.type === 'radio' ? (x.checked ? '1' : '0') : x.value));
  return c.innerHTML + '\\u0001' + v.join('\\u0002'); }"""
JS_VERDICT = """() => { const f = document.querySelector('#fb .fb'); if (!f) return null;
  return {cls: f.className, text: f.innerText}; }"""
JS_CHK = """() => { const fb = document.querySelector('#fb .fb'); const c = document.getElementById('chk');
  if (fb) return 'deja'; if (!c) return 'fara_buton'; if (c.disabled) return 'buton_dezactivat'; c.click(); return 'apasat'; }"""
JS_PARTIAL = """(cale) => { let o = JocMotor.test.config(); for (const k of cale.split('.')) { if (o == null) return false; o = o[k]; }
  if (!o) return false;
  for (const f of ['rezolvare', 'solutie', 'sol']) { const v = o[f];
    if (Array.isArray(v) && v.length >= 2) { o[f] = v.slice(0, -1);
      try { return JocMotor.test.rezolva() ? (f + ':' + v.length) : false; } finally { o[f] = v; } } }
  return false; }"""
JS_VECIN = """(cale) => { const C = JocMotor.test.config();
  const get = c => { let o = C; for (const k of c.split('.')) { if (o == null) return null; o = o[k]; } return o; };
  const Q = get(cale); if (!Q) return false;
  const F = ['rezolvare', 'solutie', 'sol', 'verifica'].find(f => Q[f] != null && typeof Q[f] === 'object'); if (!F) return false;
  const toate = []; (C.nivele || []).forEach((L, li) => {
    (L.pasi || []).forEach((P, si) => { if (P.incearca) toate.push([`nivele.${li}.pasi.${si}.incearca`, P.incearca]);
      (P.inca || []).forEach((e, j) => { if (e) toate.push([`nivele.${li}.pasi.${si}.inca.${j}`, e]); }); });
    if (L.atelier) { toate.push([`nivele.${li}.atelier`, L.atelier]);
      (L.atelier.inca || []).forEach((e, j) => { if (e) toate.push([`nivele.${li}.atelier.inca.${j}`, e]); }); }
    (L.bazin || L.qs || []).forEach((e, j) => toate.push([`nivele.${li}.${L.bazin ? 'bazin' : 'qs'}.${j}`, e])); });
  const eu = JSON.stringify(Q[F]), idx = toate.findIndex(x => x[1] === Q);
  const cand = toate.map((x, i) => [x, i]).filter(([x]) => x[1] !== Q && x[1].t === Q.t && x[1][F] != null && typeof x[1][F] === 'object' && JSON.stringify(x[1][F]) !== eu);
  const ant = cand.filter(([, i]) => i < idx), urm = cand.filter(([, i]) => i > idx);
  const v = ant.length ? ant[ant.length - 1][0] : urm.length ? urm[0][0] : null; if (!v) return false;
  const orig = Q[F]; Q[F] = v[1][F];
  try { return JocMotor.test.rezolva() ? (F + '|' + v[0]) : false; } finally { Q[F] = orig; } }"""
JS_ALTA_VARIANTA = """(cale) => { let Q = JocMotor.test.config(); for (const k of cale.split('.')) { if (Q == null) return false; Q = Q[k]; }
  if (!Q) return false;
  if (Array.isArray(Q.o) && typeof Q.ok === 'number' && Q.o.length >= 3) {          // variante (tip-excel, registru, probe)
    const g = Q.o.map((_, k) => k).filter(k => k !== Q.ok), w = g[g.length - 1];
    const b = document.querySelector(`#body .opt[data-k="${w}"]`); if (!b) return false; b.click(); return 'varianta ' + w; }
  if (Array.isArray(Q.zone) && typeof Q.ok === 'string') {                          // zone pe o captură (simppt-interfata `zona`)
    const g = Q.zone.map(z => z.z).filter(z => z !== Q.ok); if (g.length < 2) return false; const w = g[g.length - 1];
    const b = document.querySelector(`#body .spz-nr[data-z="${w}"]`); if (!b) return false; b.click(); return 'zona ' + w; }
  return false; }"""

ACTIUNI = {
    "rezolva": "JocMotor.test.rezolva()  # rezolvarea declarată de simulator",
    "gresit": "JocMotor.test.gresit()  # greșeala tipică declarată de simulator (Q.gresit, Q.tipic & co.)",
    "gol": "(nicio acțiune)  # elevul apasă Verifică fără să fi făcut nimic",
    "partial": "rezolvarea fără ultimul pas  # Q.{camp} scurtat cu un pas cât ține JocMotor.test.rezolva(), apoi pus la loc",
    "vecin": "rezolvarea exercițiului vecin  # elevul repetă sarcina de dinainte: Q.{camp} luat de la {vecin} "
             "(cel mai apropiat exercițiu de același tip, cu altă rezolvare) cât ține JocMotor.test.rezolva(), apoi pus la loc",
    "alta_varianta": "clic pe {w} (ultima variantă/zonă greșită; gresit() o alege pe prima)",
}


def deschide(pg, url):
    pg.goto(url, timeout=30000, wait_until="load")
    pg.wait_for_function("window.JocMotor && JocMotor.test && JocMotor.test.config()", timeout=20000)
    pg.evaluate("JocMotor.test.toateIntrebarile(); JocMotor.test.deblocheaza(); document.getElementById('go-home').click()")


def click_js(pg, sel):
    ok = pg.evaluate("(s) => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }", sel)
    if not ok:
        raise RuntimeError(f"lipsește {sel}")


def mergi_la(pg, cale):
    """Deschide exercițiul de la `cale`. Întoarce descrierea pașilor de navigare (pentru `pasi`)."""
    fel, L, S, k = parse_cale(cale)
    click_js(pg, f'.lvl[data-l="{L}"]')
    if fel == "pas":
        pg.evaluate(f"JocMotor.test.pas({S})")
        pg.evaluate(f"JocMotor.test.exercitiu({k})")
        return [f"nivelul {L + 1}", f"JocMotor.test.pas({S})", f"JocMotor.test.exercitiu({k})"]
    if fel == "atelier":
        pg.evaluate("JocMotor.test.atelier()")
        pg.evaluate(f"JocMotor.test.exercitiu({k})")
        return [f"nivelul {L + 1}", "JocMotor.test.atelier()", f"JocMotor.test.exercitiu({k})"]
    # întrebare de verificare: ca în test_joc.py (403-424), Î1..ÎQ rezolvate la rând
    click_js(pg, "#go")
    for qi in range(k):
        pg.wait_for_timeout(DUPA_RANDARE)
        st = pg.evaluate("JocMotor.test.stare()")
        if not st or st.get("qi") != qi:
            raise RuntimeError(f"drumul spre Î{k + 1}: eram la {st} în loc de Î{qi + 1}")
        if not pg.evaluate("JocMotor.test.rezolva()"):
            raise RuntimeError(f"drumul spre Î{k + 1}: Î{qi + 1} nu are rezolvare automată")
        pg.wait_for_timeout(DUPA_ACTIUNE)
        pg.evaluate(JS_CHK)
        try:
            pg.wait_for_selector("#fb .fb.ok", timeout=4000)
        except Exception:  # noqa: BLE001
            v = pg.evaluate(JS_VERDICT)
            raise RuntimeError(f"drumul spre Î{k + 1}: Î{qi + 1} rezolvată nu e acceptată ({norm((v or {}).get('text'))[:80]!r})")
        click_js(pg, "#next")
    st = pg.evaluate("JocMotor.test.stare()")
    if not st or st.get("qi") != k or st.get("mode") != "test":
        raise RuntimeError(f"nu am ajuns la Î{k + 1}: {st}")
    return [f"nivelul {L + 1}", "#go (la verificare)", f"Î1..Î{k} rezolvate (rezolva + Verifică + Mai departe)" if k else "Î1"]


def citeste_verdict(pg, asteapta_ms):
    """Așteaptă verdictul în #fb; întoarce {corect, mesaj, scor}."""
    try:
        pg.wait_for_selector("#fb .fb", timeout=asteapta_ms)
    except Exception:  # noqa: BLE001
        pass
    pg.wait_for_timeout(120)   # unele simulatoare rescriu #fb imediat după primul verdict
    v = pg.evaluate(JS_VERDICT)
    if not v:
        return {"corect": None, "mesaj": "", "scor": None}
    cls = v["cls"].split()
    corect = True if "ok" in cls else False if "bad" in cls else None
    txt = norm(v["text"])
    m = re.search(r"\+\d+ XP(?: \([^)]*\))?", txt)
    return {"corect": corect, "mesaj": txt, "scor": m.group(0) if m else None}


def gaseste(pg, cale, q_asteptat):
    """Exercițiul din referință, în pagina de acum: la aceeași cale dacă enunțul (q) e același; altfel singurul exercițiu
    cu același enunț (mutat în altă parte a configurației); altfel None (= dispărut)."""
    q = pg.evaluate(JS_Q_LA_CALE, cale)
    if q_asteptat is None:
        return cale, q, None
    if q and q160(q["q"]) == q160(q_asteptat):
        return cale, q, None
    gasite = [c for c, qq in pg.evaluate(JS_TOATE) if q160(qq) == q160(q_asteptat)]
    if len(gasite) == 1:
        return gasite[0], pg.evaluate(JS_Q_LA_CALE, gasite[0]), f"mutat de la {cale} la {gasite[0]}"
    return None, None, ("enunțul nu mai există în pagină" if not gasite else f"enunțul apare de {len(gasite)} ori: {gasite[:4]}")


def o_incercare(browser, base, pagina, cale, actiune, q_asteptat=None):
    """O încercare pe o pagină proaspătă. Întoarce dict cu pasi, verdict, amprenta, erori (sau nejucabil + motiv, sau
    disparut + motiv când q_asteptat e dat și exercițiul cu enunțul ăsta nu mai e în pagină)."""
    blocate, erori = [], []
    ctx = browser.new_context(viewport={"width": 1366, "height": 768}, locale="ro-RO", timezone_id="Europe/Bucharest")
    ctx.add_init_script(INIT_JS)
    ctx.route("**/*", ruta_factory(blocate))
    pg = ctx.new_page()
    pg.set_default_timeout(8000)
    pg.on("pageerror", lambda e: erori.append(norm(str(e))[:160]))
    pg.on("dialog", lambda d: d.dismiss())
    try:
        deschide(pg, f"{base}/{pagina}")
        cale, q, nota = gaseste(pg, cale, q_asteptat)
        if cale is None:
            return {"disparut": nota, "erori": erori[:3]}
        if not q:
            return {"nejucabil": "exercițiul nu există la calea asta în configurația paginii", "erori": erori[:3]}
        nav = mergi_la(pg, cale)
        pg.wait_for_timeout(DUPA_RANDARE)
        st = pg.evaluate("JocMotor.test.stare()") or {}
        pasi = [f"deschide {pagina}", *nav]
        if actiune == "rezolva":
            if not pg.evaluate("JocMotor.test.rezolva()"):
                return {"nejucabil": "simulatorul nu are rezolva()", "tip": q["t"], "erori": erori[:3]}
            pasi.append(ACTIUNI["rezolva"])
        elif actiune == "gresit":
            if not pg.evaluate("JocMotor.test.gresit()"):
                return {"nejucabil": "simulatorul nu are gresit()", "tip": q["t"], "erori": erori[:3]}
            pasi.append(ACTIUNI["gresit"])
        elif actiune == "gol":
            pasi.append(ACTIUNI["gol"])
        elif actiune == "partial":
            camp = pg.evaluate(JS_PARTIAL, cale)
            if not camp:
                return {"nejucabil": "exercițiul nu are o listă de pași de rezolvare (rezolvare/solutie/sol, ≥ 2 pași)",
                        "tip": q["t"], "erori": erori[:3]}
            f, n = camp.split(":")
            pasi.append(ACTIUNI["partial"].replace("{camp}", f) + f" ({int(n) - 1} din {n} pași)")
        elif actiune == "vecin":
            camp = pg.evaluate(JS_VECIN, cale)
            if not camp:
                return {"nejucabil": "niciun exercițiu vecin de același tip cu altă rezolvare (rezolvare/solutie/sol/verifica)",
                        "tip": q["t"], "erori": erori[:3]}
            f, v = camp.split("|")
            pasi.append(ACTIUNI["vecin"].replace("{camp}", f).replace("{vecin}", v))
        elif actiune == "alta_varianta":
            w = pg.evaluate(JS_ALTA_VARIANTA, cale)
            if not w:
                return {"nejucabil": "exercițiul nu are ≥ 2 variante/zone greșite (o/ok, zone/ok)", "tip": q["t"], "erori": erori[:3]}
            pasi.append(ACTIUNI["alta_varianta"].replace("{w}", w))
        else:
            raise ValueError("acțiune necunoscută: " + actiune)
        pg.wait_for_timeout(DUPA_ACTIUNE)
        amprenta = pg.evaluate(JS_AMPRENTA)
        chk = pg.evaluate(JS_CHK)
        pasi.append({"apasat": "clic pe Verifică (#chk)", "deja": "(verdictul a venit fără Verifică)",
                     "fara_buton": "(nu există buton Verifică)", "buton_dezactivat": "(Verifică e dezactivat)"}[chk])
        v = citeste_verdict(pg, 4000 if chk in ("apasat", "deja") else 800)
        return {"tip": q["t"], "q": q160(q["q"]), "cale_jucata": cale, "nota": nota, "mod": st.get("mode"),
                "actiune": actiune, "pasi": pasi, "verdict": v,
                "amprenta": hashlib.sha1((amprenta or "").encode("utf-8")).hexdigest()[:16] if amprenta is not None else None,
                "erori": erori[:3], "retea_blocata": len(blocate)}
    except Exception as e:  # noqa: BLE001
        return {"nejucabil": "eroare la joc: " + norm(str(e).splitlines()[0] if str(e) else repr(e))[:220], "erori": erori[:3]}
    finally:
        try:
            ctx.close()
        except Exception:  # noqa: BLE001
            pass


def joaca_lot(args):
    """Lucrătorul (proces separat, cu serverul și browserul lui).
    args = (radacina, pagina, [(id, cale, q_asteptat|None, {nume: actiune})]) -> (pagina, {id: {nume: rezultat}}, secunde).
    Cu q_asteptat (oracolul), exercițiul e căutat după enunț, vezi gaseste()."""
    rad, pagina, exercitii = args
    from playwright.sync_api import sync_playwright
    out = {}
    t0 = time.time()
    with Server(rad) as srv, sync_playwright() as p:
        b = p.chromium.launch()
        base = f"http://127.0.0.1:{srv.port}"
        try:
            for eid, cale, qa, plan in exercitii:
                out[eid] = {"cale": cale}
                for nume, actiune in plan.items():
                    r = o_incercare(b, base, pagina, cale, actiune, qa)
                    if "nejucabil" in r and r["nejucabil"].startswith("eroare la joc"):
                        r2 = o_incercare(b, base, pagina, cale, actiune, qa)   # o singură reluare (infrastructură)
                        r2["reluat"] = r["nejucabil"][:160]
                        r = r2
                    out[eid][nume] = r
        finally:
            b.close()
    return pagina, out, round(time.time() - t0, 1)


def exercitii_inventar(filtru=None):
    """[(pagina, tip_pagina, aplicatie, [(id, cale, tip)])] din inventar.json (exercițiile simulate ale fiecărei pagini)."""
    inv = json.loads(INVENTAR.read_text(encoding="utf-8"))
    rez = []
    for p in inv["pagini"]:
        if filtru and not any(f in p["pagina"] for f in filtru):
            continue
        rez.append((p["pagina"], p["tip_pagina"], p["aplicatia_principala"], [(e["id"], e["cale"], e["tip"]) for e in p["exercitii"]]))
    return inv, rez


def ruleaza(rad, sarcini, lucratori=8, marime=12, jurnal=None):
    """sarcini = [(pagina, [(id, cale, q_asteptat|None, {nume: actiune})])]. Joacă tot în paralel (procese separate, fiecare
    cu serverul și browserul lui; loturi de ≤ marime exerciții, cele mai mari întâi) -> {pagina: {id: {nume: rezultat}}}."""
    from concurrent.futures import ProcessPoolExecutor, as_completed
    # loturi după COST, nu după număr: o întrebare de verificare ÎQ se joacă după Î1..ÎQ-1 rezolvate (recapitulare-viii are
    # ÎQ până la 47), deci costă ~1 + 0,3·Q încărcări; un lot are cel mult cât `marime` exerciții obișnuite (3 încercări)
    def cost(e):
        try:
            fel, _L, _S, k = parse_cale(e[1])
        except ValueError:
            k, fel = 0, "pas"
        return len(e[3]) * (1 + (0.3 * k if fel == "q" else 0))
    prag = 3 * marime
    L = []
    for pagina, ex in sarcini:
        lot, c = [], 0.0
        for e in ex:
            if lot and c + cost(e) > prag:
                L.append((str(rad), pagina, lot))
                lot, c = [], 0.0
            lot.append(e)
            c += cost(e)
        if lot:
            L.append((str(rad), pagina, lot))
    L.sort(key=lambda x: -sum(cost(e) for e in x[2]))
    rez = {}
    if not L:
        return rez
    with ProcessPoolExecutor(max_workers=max(1, min(lucratori, len(L)))) as ex:
        fut = [ex.submit(joaca_lot, a) for a in L]
        for i, f in enumerate(as_completed(fut), 1):
            pagina, out, dt = f.result()
            rez.setdefault(pagina, {}).update(out)
            if jurnal:
                jurnal(f"[{i}/{len(L)}] {pagina}: {len(out)} exerciții în {dt}s")
    return rez
