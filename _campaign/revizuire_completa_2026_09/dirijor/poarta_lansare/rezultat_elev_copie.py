# -*- coding: utf-8 -*-
"""Proba componentei comune lectii/_sim/rezultat-elev.js (rezultatul unei verificări pe calculatorul COMUN).

Pagina-probă: lectii/_sim/_teste/rezultat-elev-proba.html (trei afirmații, „Verifică”, „Arată răspunsurile”,
„Sunt alt elev / Încep din nou”). prezenta.js vine prin site-credit.js, ca la lecții, și se folosește caseta ADEVĂRATĂ:
formularul „Cine ești?”, „Cine lucrează acum?”, „Nu ești tu? Schimbă elevul”, „Ești tot X?”. Nicio stare pusă de mână;
doar ceasul e simulat (cazurile 4 și 7, ceasul Playwright).

REGULA 24: rețeaua merge DOAR spre 127.0.0.1. Orice altă cerere (prezenta.js -> teste-vasile.netlify.app/api/activitate,
/api/progres, site-credit.js -> /api/vizitatori) e oprită de ctx.route, iar Chromium pornește cu --host-resolver-rules
care nu rezolvă niciun alt nume (a doua plasă). Proba numără cererile oprite și pică dacă vreuna a trecut.

Matricea (fiecare la 1280 px cu mouse și la 390 px cu atingere):
  1 un elev, reîncărcare · 2 doi elevi schimbați prin casetă · 3 înscriere DUPĂ verificare (Da / Nu) ·
  4 „Ești tot X?” fără răspuns, alt elev face verificarea · 5 înscriere în altă filă, întoarcere la fila lecției ·
  6 neînscris A verifică, B se înscrie în aceeași filă · 7 rezultat fără nume mai vechi de 50 de minute ·
  8 „Sunt alt elev” pe elev confirmat și neconfirmat · 9 reîncercare după răspunsuri (diagnosticul rămâne) ·
  10 fără window.Prezenta · 11 390/1280, 0 erori în consolă, butoanele întrebării >= 32 px ·
  12 întrebarea vine singură pe o pagină care nu cheamă componenta (cuprinsul, VIII/1) ·
  13 locul [data-rezultat-elev-intrebare] dispare sau se ascunde la redesenarea atelierului (VI/1) ·
  (trecerea 3 a judecătorilor) 14 GRAV A: elevul de dinainte încă „activ”, altul verifică -> „Ești X?” ·
  15 GRAV A: „Nu e verificarea mea” o mută deoparte · 16 GRAV B + m12: doi neînscriși în aceeași filă -> „Ai dat-o tu?” ·
  17 m9: titlul tăiat la cuvânt întreg · 18 m10: „Sunt alt elev” pentru elevul înscris.
Cazul 5 depinde de reparația din prezenta.js (filele preiau identitatea schimbată în altă filă și emit `prezenta`):
părțile care o așteaptă sunt marcate „[așteaptă prezenta.js]”.

Rulare: python C:/00/Projects/LearningHub/lectii/_sim/_teste/rezultat_elev_proba.py
Ultima linie: numărul de cazuri picate."""
import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(r"C:\00\Projects\LearningHub")
D = Path(__file__).resolve().parent
OUT = D / "rezultat_elev_proba.json"
PORT = 8807
BASE = f"http://127.0.0.1:{PORT}"
PAG = f"{BASE}/lectii/_sim/_teste/rezultat-elev-proba.html"
K = "proba-rezultat-elev"
PREZ = ROOT / "assets/js/prezenta.js"

EXT = []            # cereri spre alt server, oprite
SCAPATE = []        # cereri spre alt server care AU trecut (trebuie să rămână goală)
ERORI = {"1280": [], "390": []}
MASURI = {"1280": {}, "390": {}}

# vizibilitatea filelor ca în browserul adevărat: doar fila din față e „visible” și are focus
VIZ = """window.__vis=true;
Object.defineProperty(document,'visibilityState',{get(){return window.__vis?'visible':'hidden'},configurable:true});
Object.defineProperty(document,'hidden',{get(){return !window.__vis},configurable:true});
document.hasFocus=()=>window.__vis;"""

# L = pe nume (localStorage), LD = scoase de pe nume (deoparte), S = fără nume ale filei (lista, pe cheie), SD = fără nume
# puse deoparte; qtip = felul întrebării ('esti' | 'e-a-ta' | 'ai-dat-o'); rand = rândul „Se salvează pe numele”
ST = """()=>{const el=document.getElementById('rez'),q=document.getElementById('lh-rez-q'),b=document.getElementById('lhp');
const L={},LD={},S={},SD={},J=k=>{try{return JSON.parse(k)}catch(e){return null}};
for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k.startsWith('lh_rez_'))continue;
  if(k.endsWith('@_deoparte'))LD[k]=J(localStorage.getItem(k));else L[k]=J(localStorage.getItem(k))}
for(let i=0;i<sessionStorage.length;i++){const k=sessionStorage.key(i);if(!k.startsWith('lh_rez_'))continue;const v=J(sessionStorage.getItem(k));
  if(k.endsWith('@_deoparte'))SD[k]=v;else if(k.endsWith('@_fila'))S[k]=v&&v.lista?v.lista:(v?[v]:[])}
let id=null;try{id=JSON.parse(localStorage.getItem('lh_prezenta'))}catch(e){}
let api=null;try{api=window.RezultatElev.citeste('proba-rezultat-elev')}catch(e){api='EROARE '+e}
const rd=[...document.querySelectorAll('.lh-rez-rand')].map(x=>x.innerText.replace(/\\s+/g,' ').trim()),alt=document.getElementById('alt');
return {r:JSON.parse(el.getAttribute('data-json')||'null'),stare:el.getAttribute('data-stare'),api,
  text:el.innerText.replace(/\\s+/g,' ').trim(),q:q?q.innerText.replace(/\\s+/g,' ').trim():null,qtip:q?q.getAttribute('data-tip'):null,
  L,LD,S,SD,rand:rd,alt:alt?alt.textContent.trim():null,
  lhp:b?b.innerText.replace(/\\s+/g,' ').trim():'',ev:(window.__proba||{}).evenimente||[],
  pz:typeof window.Prezenta,cine:window.Prezenta&&window.Prezenta.identitate?window.Prezenta.identitate():null,
  pc:id&&id.nume?id.nume:(id&&id.refuz?'(vizitator)':null)}}"""


# ---------------------------------------------------------------- unelte
def ctx_nou(br, tel, ceas=False):
    kw = ({"viewport": {"width": 390, "height": 844}, "has_touch": True, "is_mobile": True, "device_scale_factor": 2}
          if tel else {"viewport": {"width": 1280, "height": 800}})
    c = br.new_context(**kw)
    c.add_init_script(VIZ)
    if ceas:
        c.clock.install()

    def h(route):
        u = route.request.url
        if u.startswith(BASE + "/") or u.startswith(("data:", "blob:")):
            route.continue_()
        else:
            EXT.append(u)
            route.abort()
    c.route("**/*", h)
    c.on("requestfinished", lambda r: SCAPATE.append(r.url) if not r.url.startswith((BASE + "/", "data:", "blob:")) else None)
    return c


def pagina(c, w):
    pg = c.new_page()
    pg.on("pageerror", lambda e: ERORI[w].append("pageerror: " + str(e)[:200]))

    def con(m):
        if m.type != "error":
            return
        t, loc = m.text, (m.location or {}).get("url", "")
        # cererile spre alt server, oprite de probă, apar în consolă ca „Failed to load resource / ERR_FAILED”
        if ("ERR_FAILED" in t or "ERR_NAME_NOT_RESOLVED" in t or "Failed to load resource" in t) and not loc.startswith(BASE + "/"):
            return
        ERORI[w].append("consolă: " + t[:200] + " @ " + loc)
    pg.on("console", con)
    return pg


def ges(pg, loc, tel):
    loc.scroll_into_view_if_needed(timeout=5000)
    pg.wait_for_timeout(200 if tel else 40)
    (loc.tap(timeout=5000) if tel else loc.click(timeout=5000))
    pg.wait_for_timeout(200)


def vizibil(pg, sel):
    loc = pg.locator(sel)
    return loc.count() > 0 and loc.first.is_visible()


def lhp(pg):
    return pg.evaluate("()=>{const b=document.getElementById('lhp');return b?b.innerText.replace(/\\s+/g,' ').trim():''}")


def st(pg):
    return pg.evaluate(ST)


def asteapta(pg, extra=1300):
    """după încărcare: prezenta.js sosește prin site-credit.js; componenta îl vede în cel mult o secundă"""
    try:
        pg.wait_for_load_state("load", timeout=8000)
    except Exception:
        pass
    try:
        pg.wait_for_function("typeof window.Prezenta==='object'", timeout=6000)
    except Exception:
        pass
    pg.wait_for_timeout(extra)


def jos(pg):
    """eticheta casetei stă jos; o ducem în spațiul rezervat de ea (acolo nu e nimic de apăsat)"""
    pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)")
    pg.wait_for_timeout(1300)


def raspunde(pg, v, tel):
    for i, x in enumerate(v):
        ges(pg, pg.locator(f'#q{i} button[data-v="{1 if x else 0}"]'), tel)


def tip_q(pg):
    return pg.evaluate("()=>{const q=document.getElementById('lh-rez-q');return q&&q.offsetParent!==null||q&&getComputedStyle(q).position==='fixed'?q.getAttribute('data-tip'):null}")


def verifica(pg, tel, esti=True):
    """„Verifică”. Cu un elev înscris, neconfirmat în încărcarea asta, componenta întreabă „Ești X?” (GRAV A):
    esti=True -> elevul de pe scaun chiar e X și răspunde „Da, sunt eu”; esti=False -> lasă întrebarea (cazul o judecă)"""
    ges(pg, pg.locator("#verifica"), tel)
    pg.wait_for_timeout(350)
    if esti and tip_q(pg) == "esti":
        ges(pg, pg.locator("#lh-rez-da"), tel)
        pg.wait_for_timeout(350)


def raspunde_q(pg, tel, da, tip=None, timeout=6000):
    """răspunde la întrebarea componentei (Da / Nu); dacă se dă tipul, întâi îl așteaptă"""
    if tip:
        pg.wait_for_selector(f'#lh-rez-q[data-tip="{tip}"]', state="visible", timeout=timeout)
    ges(pg, pg.locator("#lh-rez-da" if da else "#lh-rez-nu"), tel)
    pg.wait_for_timeout(400)


def dupa_reincarcare(pg):
    pg.wait_for_timeout(2600)
    asteapta(pg)


def inregistreaza(pg, nume, cod, tel):
    """Înscrie elevul prin caseta adevărată, din orice stare a ei (ca judecătorii lecțiilor nr. 1)."""
    pg.wait_for_timeout(500)
    for _ in range(10):
        if vizibil(pg, "#lhp-ok"):
            break
        if vizibil(pg, "#lhp-nu"):            # „Ești tot X?” -> „Nu, sunt alt elev”
            ges(pg, pg.locator("#lhp-nu"), tel)
        elif vizibil(pg, "#lhp-nou"):         # „Cine lucrează acum?” -> „Nu sunt în listă”
            ges(pg, pg.locator("#lhp-nou"), tel)
        elif vizibil(pg, "#lhp-alt"):         # meniul etichetei -> „Nu ești tu? Schimbă elevul”
            ges(pg, pg.locator("#lhp-alt"), tel)
        elif vizibil(pg, "#lhp-pill"):        # eticheta „Profesorul vede activitatea ta · X”
            jos(pg); ges(pg, pg.locator("#lhp-pill"), tel)
        elif vizibil(pg, "#lhp-cine"):        # „Spune cine ești”
            jos(pg); ges(pg, pg.locator("#lhp-cine"), tel)
        elif vizibil(pg, "#lhp-cere"):        # lista strânsă
            jos(pg); ges(pg, pg.locator("#lhp-cere"), tel)
        elif vizibil(pg, "#lhp-elev"):        # vizitatorul
            jos(pg); ges(pg, pg.locator("#lhp-elev"), tel)
        else:
            pg.wait_for_timeout(400)
    if not vizibil(pg, "#lhp-ok"):
        raise RuntimeError("n-am ajuns la formularul casetei: " + lhp(pg)[:160])
    pg.wait_for_function("document.querySelectorAll('#lhp-s option').length>2", timeout=6000)
    v = pg.evaluate("()=>[...document.querySelectorAll('#lhp-s option')].find(o=>/Brauner/.test(o.textContent)).value")
    pg.select_option("#lhp-s", v); pg.wait_for_timeout(200)
    pg.select_option("#lhp-c", "8 A"); pg.wait_for_timeout(100)
    ges(pg, pg.locator("#lhp-n"), tel); pg.keyboard.type(nume, delay=10)
    ges(pg, pg.locator("#lhp-k"), tel); pg.keyboard.type(cod, delay=10)
    ges(pg, pg.locator("#lhp-ok"), tel)
    dupa_reincarcare(pg)


def deschide_lista(pg, tel):
    for _ in range(6):
        if vizibil(pg, "#lhp-lista"):
            return
        if vizibil(pg, "#lhp-alt"):
            ges(pg, pg.locator("#lhp-alt"), tel)
        elif vizibil(pg, "#lhp-nu"):
            ges(pg, pg.locator("#lhp-nu"), tel)
        elif vizibil(pg, "#lhp-pill"):
            jos(pg); ges(pg, pg.locator("#lhp-pill"), tel)
        elif vizibil(pg, "#lhp-cere"):
            jos(pg); ges(pg, pg.locator("#lhp-cere"), tel)
        else:
            pg.wait_for_timeout(400)
    if not vizibil(pg, "#lhp-lista"):
        raise RuntimeError("n-am ajuns la „Cine lucrează acum?”: " + lhp(pg)[:160])


def alege_din_lista(pg, nume, tel):
    deschide_lista(pg, tel)
    ges(pg, pg.locator("#lhp-lista button.el", has_text=nume).first, tel)
    dupa_reincarcare(pg)


def intrebarea(pg, timeout=6000):
    try:
        pg.wait_for_selector("#lh-rez-q", state="visible", timeout=timeout)
        return True
    except Exception:
        return False


def fata(pg_on, pg_off):
    """pg_on vine în față (visible + focus), pg_off trece în spate"""
    for pg, v in ((pg_off, False), (pg_on, True)):
        if pg:
            pg.evaluate(f"()=>{{window.__vis={str(v).lower()};document.dispatchEvent(new Event('visibilitychange'))}}")
    pg_on.bring_to_front()


def misca(pg, tel, sec=7):
    """elevul lucrează în filă câteva secunde (derulează / atinge titlul): prezenta.js își face „bătaia” de 5 s"""
    for _ in range(sec):
        if tel:
            pg.locator("#rez").tap(position={"x": 8, "y": 8})
        else:
            pg.mouse.move(300, 200); pg.mouse.wheel(0, 40)
        pg.wait_for_timeout(1000)


def bune(s):
    return s["r"]["rezultat"]["bune"] if s.get("r") else None


def la_fel(s):
    """ce arată pagina (ultima redesenare, după evenimentul rezultat-elev) = ce spune componenta acum"""
    return json.dumps(s["r"], sort_keys=True) == json.dumps(s["api"], sort_keys=True)


def chei_elev(s):
    return sorted(s["L"])


def fara_nume(s):
    """toate verificările fără nume ale filei (din toate cheile), ca listă"""
    return [r for v in s["S"].values() for r in (v or [])]


def deoparte(s, unde="SD"):
    return [x for v in s[unde].values() for x in (v or [])]


def scurt(s):
    return {"arata": s["text"][:110], "q": s["q"], "qtip": s["qtip"], "stare": s["stare"], "pe_pc": s["pc"],
            "L": {k[-14:]: (v["prima"]["r"]["bune"], len(v["re"])) for k, v in s["L"].items()},
            "S": [(r["prima"]["r"]["bune"], len(r["re"]), len(r.get("nu", []))) for r in fara_nume(s)],
            "deoparte": {"L": len(deoparte(s, "LD")), "S": len(deoparte(s, "SD"))}, "rand": s["rand"][:2], "alt": s["alt"]}


# ---------------------------------------------------------------- cazurile
# fiecare întoarce (ok, detalii) sau (ok, detalii, {"dep_ok": bool, "indep_ok": bool}) pentru părțile care
# așteaptă prezenta.js. CORECT = [Adevărat, Fals, Adevărat]; [A,A,A] = 2 din 3; [F,F,F] = 1 din 3; [A,F,A] = 3 din 3.
A3, F3, OK3 = [True, True, True], [False, False, False], [True, False, True]


def caz1(br, tel, w):
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    raspunde(pg, A3, tel); verifica(pg, tel)
    s1 = st(pg)
    pg.reload(); asteapta(pg)
    s2 = st(pg)
    pg.goto(f"{BASE}/lectii/_sim/_teste/rezultat-elev-proba.html?alt=1"); asteapta(pg)
    pg.go_back(); asteapta(pg)
    s3 = st(pg)
    c.close()
    ok = (bune(s1) == 2 and s1["r"]["elev"] == "Test Ana" and not s1["S"]
          and bune(s2) == 2 and s2["r"]["elev"] == "Test Ana" and s2["q"] is None and s2["r"]["reincercari"] == 0
          and bune(s3) == 2 and all(la_fel(x) for x in (s1, s2, s3)))
    return ok, {"dupa_verificare": scurt(s1), "dupa_reincarcare": scurt(s2), "dupa_inapoi": scurt(s3)}


def caz2(br, tel, w):
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    raspunde(pg, A3, tel); verifica(pg, tel)
    s_ana = st(pg)
    inregistreaza(pg, "Test Dan", "2222", tel)          # eticheta -> Schimbă elevul -> Nu sunt în listă -> formular
    s_dan0 = st(pg)
    raspunde(pg, OK3, tel); verifica(pg, tel)
    s_dan = st(pg)
    alege_din_lista(pg, "Test Ana", tel)
    s_ana2 = st(pg)
    alege_din_lista(pg, "Test Dan", tel)
    s_dan2 = st(pg)
    c.close()
    ok = (bune(s_ana) == 2 and s_dan0["r"] is None and s_dan0["q"] is None
          and bune(s_dan) == 3 and s_dan["r"]["elev"] == "Test Dan"
          and bune(s_ana2) == 2 and s_ana2["r"]["elev"] == "Test Ana" and s_ana2["r"]["reincercari"] == 0
          and bune(s_dan2) == 3 and s_dan2["r"]["elev"] == "Test Dan"
          and len(chei_elev(s_dan2)) == 2 and all(la_fel(x) for x in (s_ana, s_dan0, s_dan, s_ana2, s_dan2)))
    return ok, {"ana": scurt(s_ana), "dan_la_inceput": scurt(s_dan0), "dan": scurt(s_dan),
                "ana_iar": scurt(s_ana2), "dan_iar": scurt(s_dan2)}


def caz3(br, tel, w):
    det, oks = {}, []
    for ramura in ("da", "nu"):
        c = ctx_nou(br, tel); pg = pagina(c, w)
        pg.goto(PAG); asteapta(pg)
        raspunde(pg, F3, tel); verifica(pg, tel)
        s0 = st(pg)
        ora = s0["r"]["ora"] if s0["r"] else None
        inregistreaza(pg, "Test Ana", "1111", tel)
        are_q = intrebarea(pg)
        s1 = st(pg)
        if ramura == "da":
            # butoanele întrebării: cel puțin 32 px; întrebarea încape pe ecran; pagina nu se derulează lateral
            MASURI[w]["butoane"] = pg.evaluate("""()=>['lh-rez-da','lh-rez-nu'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();
              return [id,Math.round(r.width),Math.round(r.height)]})""")
            MASURI[w]["intrebare_in_ecran"] = pg.evaluate("""()=>{const r=document.getElementById('lh-rez-q').getBoundingClientRect();
              return r.left>=0&&r.right<=document.documentElement.clientWidth&&r.top>=0}""")
            MASURI[w]["fara_derulare_laterala"] = pg.evaluate("()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth")
            # începutul paginii nu stă sub întrebarea fixă (la derularea de sus, titlul e sub ea, nu acoperit)
            MASURI[w]["titlul_neacoperit"] = pg.evaluate("""()=>{scrollTo(0,0);const q=document.getElementById('lh-rez-q').getBoundingClientRect(),
              h=document.querySelector('h1').getBoundingClientRect();return h.top>=q.bottom}""")
        ok = s0["r"] is not None and s0["r"]["faraNume"] and are_q and s1["q"] and ora and ("Verificarea de la ora " + ora + " e a ta?") in s1["q"] \
            and s1["r"] is None and not chei_elev(s1) and la_fel(s1)
        if are_q:
            ges(pg, pg.locator("#lh-rez-da" if ramura == "da" else "#lh-rez-nu"), tel)
            pg.wait_for_timeout(400)
        s2 = st(pg)
        pg.reload(); asteapta(pg)
        s3 = st(pg)
        if ramura == "da":
            ok = ok and bune(s2) == 1 and s2["r"]["elev"] == "Test Ana" and not s2["S"] and s2["q"] is None \
                and bune(s3) == 1 and s3["q"] is None and la_fel(s2) and la_fel(s3)
        else:
            ok = ok and s2["r"] is None and s2["q"] is None and not chei_elev(s2) and len(s2["S"]) == 1 \
                and s3["r"] is None and s3["q"] is None and la_fel(s2) and la_fel(s3)
        det[ramura] = {"inainte": scurt(s0), "intrebarea": s1["q"], "dupa_raspuns": scurt(s2), "dupa_reincarcare": scurt(s3)}
        oks.append(ok)
        c.close()
    return all(oks), det


def caz4(br, tel, w):
    c = ctx_nou(br, tel, ceas=True); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    raspunde(pg, F3, tel); verifica(pg, tel)                 # Ana: 1 din 3, pe numele ei
    s_ana = st(pg)
    pg.clock.fast_forward(91 * 60000)                        # peste 90 de minute fără activitate
    pg.reload(); asteapta(pg)
    s_q = st(pg)                                             # caseta: „Ești tot Test Ana?” — nimeni nu răspunde
    este_intreaba = vizibil(pg, "#lhp-da") and "Ești tot" in s_q["lhp"]
    raspunde(pg, OK3, tel); verifica(pg, tel)                # Dan face verificarea: 3 din 3
    s_dan = st(pg)
    ana_dupa = [v for k, v in s_dan["L"].items() if not k.endswith("@_fila")]
    inregistreaza(pg, "Test Dan", "2222", tel)               # „Nu, sunt alt elev” -> Nu sunt în listă -> formular
    are_q = intrebarea(pg)
    s_dan_q = st(pg)
    if are_q:
        ges(pg, pg.locator("#lh-rez-da"), tel); pg.wait_for_timeout(400)
    s_dan2 = st(pg)
    alege_din_lista(pg, "Test Ana", tel)
    s_ana2 = st(pg)
    c.close()
    ok = (bune(s_ana) == 1 and este_intreaba and s_q["stare"] == "intreaba" and s_q["r"] is None
          and bune(s_dan) == 3 and s_dan["r"]["faraNume"]
          and len(ana_dupa) == 1 and ana_dupa[0]["prima"]["r"]["bune"] == 1 and len(ana_dupa[0]["re"]) == 0
          and are_q and bune(s_dan2) == 3 and s_dan2["r"]["elev"] == "Test Dan" and s_dan2["r"]["reincercari"] == 0
          and bune(s_ana2) == 1 and s_ana2["r"]["elev"] == "Test Ana" and s_ana2["r"]["reincercari"] == 0
          and all(la_fel(x) for x in (s_ana, s_q, s_dan, s_dan2, s_ana2)))
    return ok, {"ana": scurt(s_ana), "esti_tot": {"caseta": s_q["lhp"][:90], **scurt(s_q)}, "dan_verifica": scurt(s_dan),
                "dan_intrebat": s_dan_q["q"], "dan_dupa_da": scurt(s_dan2), "ana_iar": scurt(s_ana2)}


def caz5(br, tel, w):
    det = {}
    # 5a: neînscris face verificarea în fila lecției T1, se înscrie în fila nouă T2, se întoarce în T1
    c = ctx_nou(br, tel); t1 = pagina(c, w)
    t1.goto(PAG); asteapta(t1)
    raspunde(t1, F3, tel); verifica(t1, tel)
    t2 = pagina(c, w); fata(t2, t1)
    t2.goto(PAG); asteapta(t2)
    s2 = st(t2)                                              # fila nouă pornește goală
    inregistreaza(t2, "Test Ana", "1111", tel)
    s2b = st(t2)
    fata(t1, t2); misca(t1, tel, 6)
    are_q = intrebarea(t1, 2000)
    s1 = st(t1)
    if are_q:
        ges(t1, t1.locator("#lh-rez-da"), tel); t1.wait_for_timeout(500)
    s1b = st(t1)
    fata(t2, t1); t2.wait_for_timeout(1500)
    s2c = st(t2)
    a_dep = are_q and bune(s1b) == 1 and s1b["r"]["elev"] == "Test Ana" and bune(s2c) == 1
    # partea care NU așteaptă prezenta.js: fila nouă goală, fără întrebare acolo, nimic legat fără „Da”
    a_indep = s2["r"] is None and s2b["r"] is None and s2b["q"] is None and not chei_elev(s1) if not are_q else \
        (s2["r"] is None and s2b["r"] is None and s2b["q"] is None and s1["r"] is None)
    # ocolișul de azi: reîncărcarea filei lecției o face să citească elevul din nou
    ocolis = None
    if not are_q:
        fata(t1, t2); t1.reload(); asteapta(t1)
        oq = intrebarea(t1)
        if oq:
            ges(t1, t1.locator("#lh-rez-da"), tel); t1.wait_for_timeout(500)
        so = st(t1)
        ocolis = {"intrebare_dupa_reincarcare": oq, "dupa_da": scurt(so)}
        a_indep = a_indep and oq and bune(so) == 1 and so["r"]["elev"] == "Test Ana"
    det["5a"] = {"t2_la_inceput": scurt(s2), "t2_inscris": scurt(s2b), "t1_la_intoarcere": scurt(s1),
                 "t1_dupa_da": scurt(s1b), "t2_dupa": scurt(s2c), "ocolis_reincarcare": ocolis,
                 "asteapta_prezenta": not a_dep}
    c.close()
    # 5b: Ana înscrisă în T1 cu rezultat; Dan se schimbă în T2; se întoarce în T1 și lucrează
    c = ctx_nou(br, tel); t1 = pagina(c, w)
    t1.goto(PAG); asteapta(t1)
    inregistreaza(t1, "Test Ana", "1111", tel)
    raspunde(t1, A3, tel); verifica(t1, tel)
    t2 = pagina(c, w); fata(t2, t1)
    t2.goto(PAG); asteapta(t2)
    s2 = st(t2)                                              # aceeași elevă în altă filă își vede rezultatul
    inregistreaza(t2, "Test Dan", "2222", tel)
    s2b = st(t2)
    fata(t1, t2); misca(t1, tel, 7)
    s1 = st(t1)
    fata(t2, t1); t2.reload(); asteapta(t2)
    s2c = st(t2)
    b_indep = bune(s2) == 2 and s2b["r"] is None and s2b["pc"] == "Test Dan"
    b_dep = s1["r"] is None and s1["pc"] == "Test Dan" and s2c["pc"] == "Test Dan" and s2c["r"] is None and "Dan T." in s2c["lhp"] \
        and la_fel(s1)
    det["5b"] = {"t2_ana": scurt(s2), "t2_dan": scurt(s2b), "t1_dupa_7s": {**scurt(s1), "cine_in_t1": s1["cine"]},
                 "t2_reincarcata": {**scurt(s2c), "caseta": s2c["lhp"][:80]}, "asteapta_prezenta": not b_dep}
    c.close()
    ok = a_dep and a_indep and b_dep and b_indep
    return ok, det, {"dep_ok": a_dep and b_dep, "indep_ok": a_indep and b_indep}


def caz6(br, tel, w):
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    raspunde(pg, F3, tel); verifica(pg, tel)                 # A, neînscris: 1 din 3
    s_a = st(pg)
    inregistreaza(pg, "Test Dan", "2222", tel)               # B se înscrie în aceeași filă
    are_q = intrebarea(pg)
    s_b = st(pg)                                             # înainte să răspundă: nimic legat de el, nimic arătat
    if are_q:
        ges(pg, pg.locator("#lh-rez-nu"), tel); pg.wait_for_timeout(400)
    s_nu = st(pg)
    raspunde(pg, OK3, tel); verifica(pg, tel)                # B își face verificarea lui: 3 din 3 = PRIMA lui
    s_b2 = st(pg)
    c.close()
    ok = (bune(s_a) == 1 and s_a["r"]["faraNume"] and are_q and s_b["r"] is None and not chei_elev(s_b)
          and s_nu["r"] is None and s_nu["q"] is None and not chei_elev(s_nu)
          and bune(s_b2) == 3 and s_b2["r"]["elev"] == "Test Dan" and s_b2["r"]["reincercari"] == 0
          and all(la_fel(x) for x in (s_a, s_b, s_nu, s_b2)))
    return ok, {"a": scurt(s_a), "b_intrebat": s_b["q"], "b_inainte_de_raspuns": scurt(s_b), "b_dupa_nu": scurt(s_nu),
                "b_verifica": scurt(s_b2)}


def caz7(br, tel, w):
    c = ctx_nou(br, tel, ceas=True); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    raspunde(pg, A3, tel); verifica(pg, tel)                 # neînscris: 2 din 3
    s0 = st(pg)
    pg.clock.fast_forward(49 * 60000); pg.wait_for_timeout(1600)
    s49 = st(pg)
    pg.clock.fast_forward(2 * 60000); pg.wait_for_timeout(1600)
    s51 = st(pg)
    pg.reload(); asteapta(pg)
    s51r = st(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    are_q = intrebarea(pg, 2500)
    s_ana = st(pg)
    c.close()
    ok = (bune(s0) == 2 and bune(s49) == 2 and s51["r"] is None and "expirat" in s51["ev"] and not s51["S"]
          and s51r["r"] is None and not are_q and s_ana["r"] is None and not chei_elev(s_ana)
          and all(la_fel(x) for x in (s0, s49, s51, s51r, s_ana)))
    return ok, {"la_0": scurt(s0), "la_49_min": scurt(s49), "la_51_min": {**scurt(s51), "evenimente": s51["ev"][-3:]},
                "reincarcat": scurt(s51r), "ana_inscrisa": {"intrebare": are_q, **scurt(s_ana)}}


def caz8(br, tel, w):
    det = {}
    # 8a: elev confirmat -> Prezenta.alege(); rezultatul lui rămâne al lui
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    raspunde(pg, A3, tel); verifica(pg, tel)
    s0 = st(pg)
    ges(pg, pg.locator("#alt"), tel); pg.wait_for_timeout(1300)
    s1 = st(pg)
    lista = vizibil(pg, "#lhp-lista")
    alege_din_lista(pg, "Test Ana", tel)
    s2 = st(pg)
    ok_a = (bune(s0) == 2 and lista and "Cine lucrează acum" in s1["lhp"] and s1["r"] is None
            and len(chei_elev(s1)) == 1 and bune(s2) == 2 and s2["r"]["elev"] == "Test Ana" and all(la_fel(x) for x in (s0, s1, s2)))
    det["confirmat"] = {"inainte": scurt(s0), "dupa_buton": {**scurt(s1), "caseta": s1["lhp"][:60]}, "ana_se_alege": scurt(s2)}
    c.close()
    # 8b: neconfirmat -> verificarea nu se mai arată, dar NU se șterge: următorul e întrebat „Ai dat-o tu?”;
    #     „Nu” o mută deoparte (trecerea 3: „Începe o fișă nouă” își golea și propria încercare)
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    raspunde(pg, A3, tel); verifica(pg, tel)
    s0 = st(pg)
    ges(pg, pg.locator("#alt"), tel); pg.wait_for_timeout(700)
    s1 = st(pg)
    if s1["qtip"] == "ai-dat-o":
        raspunde_q(pg, tel, False)
    s2 = st(pg)
    pg.reload(); asteapta(pg)
    s3 = st(pg)
    ok_b = (bune(s0) == 2 and s0["r"]["faraNume"] and s1["r"] is None and s1["qtip"] == "ai-dat-o" and len(fara_nume(s1)) == 1
            and "golit" in s1["ev"] and s2["r"] is None and not s2["S"] and len(deoparte(s2)) == 1
            and s3["r"] is None and s3["q"] is None and all(la_fel(x) for x in (s0, s1, s2, s3)))
    det["neconfirmat"] = {"inainte": scurt(s0), "dupa_buton": scurt(s1), "dupa_nu": scurt(s2), "reincarcat": scurt(s3)}
    c.close()
    return ok_a and ok_b, det


def caz9(br, tel, w):
    det, oks = {}, []
    for ramura in ("cu_nume", "fara_nume"):
        c = ctx_nou(br, tel); pg = pagina(c, w)
        pg.goto(PAG); asteapta(pg)
        if ramura == "cu_nume":
            inregistreaza(pg, "Test Ana", "1111", tel)
        raspunde(pg, F3, tel); verifica(pg, tel)             # prima: 1 din 3
        s0 = st(pg)
        ges(pg, pg.locator("#arata"), tel)                   # vede răspunsurile
        raspunde(pg, OK3, tel); verifica(pg, tel)            # reîncercare: 3 din 3
        s1 = st(pg)
        pg.reload(); asteapta(pg)
        if ramura == "fara_nume":                            # altă încărcare: „Ai dat-o tu pe cea de la ora …?” -> Da
            raspunde_q(pg, tel, True, "ai-dat-o")
        s2 = st(pg)
        ok = (bune(s0) == 1 and bune(s1) == 1 and s1["r"]["reincercare"]["bune"] == 3 and s1["r"]["reincercari"] == 1
              and bune(s2) == 1 and s2["r"]["reincercare"]["bune"] == 3 and "Reîncercare: 3 din 3" in s2["text"]
              and (s2["r"]["elev"] == "Test Ana") == (ramura == "cu_nume") and all(la_fel(x) for x in (s0, s1, s2)))
        det[ramura] = {"prima": scurt(s0), "dupa_reincercare": scurt(s1), "reincarcat": scurt(s2)}
        oks.append(ok)
        c.close()
    return all(oks), det


def caz10(br, tel, w):
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG + "?fara=1"); pg.wait_for_timeout(1500)
    s0 = st(pg)
    raspunde(pg, A3, tel); verifica(pg, tel)
    s1 = st(pg)
    pg.reload(); pg.wait_for_timeout(1200)
    s2a = st(pg)                                             # altă încărcare: nu se arată până la „Ai dat-o tu?”
    raspunde_q(pg, tel, True, "ai-dat-o")
    s2 = st(pg)
    t2 = pagina(c, w); fata(t2, pg); t2.goto(PAG + "?fara=1"); t2.wait_for_timeout(1200)
    s3 = st(t2)
    fata(pg, t2)
    ges(pg, pg.locator("#alt"), tel); pg.wait_for_timeout(500)
    raspunde_q(pg, tel, False, "ai-dat-o")
    s4 = st(pg)
    c.close()
    ok = (s0["pz"] == "undefined" and s0["stare"] == "fara-prezenta" and s0["r"] is None
          and bune(s1) == 2 and s1["r"]["faraNume"] and s2a["r"] is None and s2a["qtip"] == "ai-dat-o"
          and bune(s2) == 2 and s3["r"] is None and s3["q"] is None
          and s4["r"] is None and not s4["S"] and len(deoparte(s4)) == 1 and all(la_fel(x) for x in (s0, s1, s2a, s2, s3, s4)))
    return ok, {"la_inceput": scurt(s0), "verificat": scurt(s1), "reincarcat": scurt(s2), "fila_noua": scurt(s3),
                "sunt_alt_elev": scurt(s4)}


LOCUL = """()=>{const b=document.getElementById('lh-rez-q');if(!b)return {unde:null};const r=b.getBoundingClientRect();
  return {unde:!b.isConnected?'scoasa':b.parentElement.hasAttribute('data-rezultat-elev-intrebare')?'loc':b.parentElement.tagName,
    vizibila:r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight,fixa:getComputedStyle(b).position==='fixed',pad:document.body.style.paddingTop}}"""


def caz12(br, tel, w):
    """(VIII/1) întrebarea vine și pe o pagină care NU cheamă componenta (cuprinsul), după înscrierea făcută acolo"""
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    raspunde(pg, F3, tel); verifica(pg, tel)                 # neînscris, pe pagina verificării: 1 din 3
    s0 = st(pg)
    pg.goto(PAG + "?tacut=1"); asteapta(pg)                  # „cuprinsul”: nu cheamă RezultatElev deloc
    inregistreaza(pg, "Test Ana", "1111", tel)
    are_q = intrebarea(pg)
    q = pg.locator("#lh-rez-q").inner_text().replace("\n", " ") if are_q else None
    if are_q:
        ges(pg, pg.locator("#lh-rez-da"), tel); pg.wait_for_timeout(400)
    dupa = pg.evaluate("()=>({api:RezultatElev.citeste('proba-rezultat-elev'),q:!!document.getElementById('lh-rez-q'),"
                       "S:Object.keys(sessionStorage).filter(k=>k.startsWith('lh_rez_'))})")
    pg.goto(PAG); asteapta(pg)
    s2 = st(pg)
    c.close()
    ok = (bune(s0) == 1 and s0["r"]["faraNume"] and are_q and q and "Verificarea de la ora " + s0["r"]["ora"] + " e a ta?" in q
          and "pe pagina „Proba rezultat-elev”" in q and dupa["api"] and dupa["api"]["rezultat"]["bune"] == 1
          and dupa["api"]["elev"] == "Test Ana" and not dupa["q"] and not dupa["S"]
          and bune(s2) == 1 and s2["r"]["elev"] == "Test Ana" and s2["q"] is None and la_fel(s2))
    return ok, {"verificare": scurt(s0), "intrebarea_pe_cuprins": q, "dupa_da_pe_cuprins": dupa, "pagina_verificarii": scurt(s2)}


def caz13(br, tel, w):
    """(VI/1) locul întrebării dispare sau se ascunde când atelierul se redesenează: întrebarea nu dispare"""
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG + "?loc=1"); asteapta(pg)
    raspunde(pg, F3, tel); verifica(pg, tel)
    inregistreaza(pg, "Test Ana", "1111", tel)
    are_q = intrebarea(pg)
    pasi = {"la_incarcare": pg.evaluate(LOCUL)}
    for nume, sel, asteptat in (("redesenat", "#redeseneaza", "loc"), ("fara_loc", "#faraloc", "BODY"),
                                ("loc_nou", "#redeseneaza", "loc"), ("atelier_ascuns", "#ascunde", "BODY"),
                                ("atelier_aratat", "#ascunde", "loc")):
        ges(pg, pg.locator(sel), tel); pg.wait_for_timeout(500)
        pasi[nume] = {**pg.evaluate(LOCUL), "asteptat": asteptat}
        if nume == "fara_loc":   # întrebarea fixă nu pornește o buclă de scrieri (MutationObserver-ul ei)
            pasi[nume]["mutatii_2s"] = pg.evaluate("""()=>new Promise(ok=>{let n=0;const o=new MutationObserver(r=>n+=r.length);
              o.observe(document.body,{attributes:true,childList:true,subtree:true});setTimeout(()=>{o.disconnect();ok(n)},2000)})""")
    if are_q:
        ges(pg, pg.locator("#lh-rez-da"), tel); pg.wait_for_timeout(500)
    s = st(pg)
    c.close()
    ok = (are_q and pasi["la_incarcare"]["unde"] == "loc" and pasi["la_incarcare"]["vizibila"]
          and all(v["unde"] == v["asteptat"] and v["vizibila"] and (v["fixa"] == (v["asteptat"] == "BODY"))
                  for k, v in pasi.items() if k != "la_incarcare")
          and pasi["fara_loc"].get("mutatii_2s", 99) <= 6
          and bune(s) == 1 and s["r"]["elev"] == "Test Ana" and s["q"] is None
          and pg is not None and la_fel(s))
    return ok, {"pasi": pasi, "dupa_da": scurt(s)}


def caz14(br, tel, w):
    """GRAV A (VI/1): Ana e încă „activă” (sub 90 de minute), Dan nu vede eticheta și face verificarea.
    Prima salvare pe un nume din încărcarea asta întreabă „Ești Test Ana?”; până atunci nimic nu se scrie pe Ana."""
    det, oks = {}, []
    for ramura in ("dan_nu", "ana_da"):
        c = ctx_nou(br, tel); pg = pagina(c, w)
        pg.goto(PAG); asteapta(pg)
        inregistreaza(pg, "Test Ana", "1111", tel)           # Ana s-a înscris (pagina s-a reîncărcat), apoi a plecat
        s0 = st(pg)
        if ramura == "dan_nu":
            raspunde(pg, OK3, tel); verifica(pg, tel, esti=False)     # Dan: 3 din 3
            s1 = st(pg)
            are = s1["qtip"] == "esti" and "Verificarea se scrie pe numele Test Ana. Ești Test Ana?" in (s1["q"] or "")
            if are:
                raspunde_q(pg, tel, False)                            # „Nu, sunt alt elev” -> lista
            pg.wait_for_timeout(600)
            s2 = st(pg)
            lista = vizibil(pg, "#lhp-lista") and "Cine lucrează acum" in s2["lhp"]
            inregistreaza(pg, "Test Dan", "2222", tel)               # „Nu sunt în listă” -> formular -> reîncărcare
            q3 = intrebarea(pg) and tip_q(pg) == "e-a-ta"
            if q3:
                raspunde_q(pg, tel, True)
            s3 = st(pg)
            alege_din_lista(pg, "Test Ana", tel)
            s4 = st(pg)
            ok = (s0["r"] is None and any("Se salvează pe numele: Test Ana" in x for x in s0["rand"])
                  and are and bune(s1) == 3 and s1["r"]["faraNume"] and s1["r"]["deConfirmat"] and not chei_elev(s1)
                  and lista and bune(s2) == 3 and s2["r"]["faraNume"] and not chei_elev(s2)
                  and q3 and bune(s3) == 3 and s3["r"]["elev"] == "Test Dan" and len(chei_elev(s3)) == 1
                  and s4["r"] is None and all(la_fel(x) for x in (s0, s1, s2, s3, s4)))
            det[ramura] = {"ana_inscrisa": scurt(s0), "dan_verifica": scurt(s1), "dupa_nu": {**scurt(s2), "lista": lista},
                           "dan_inscris": scurt(s3), "ana_iar": scurt(s4)}
        else:
            raspunde(pg, F3, tel); verifica(pg, tel, esti=False)
            s1 = st(pg)
            are = s1["qtip"] == "esti"
            if are:
                raspunde_q(pg, tel, True)                             # „Da, sunt eu”
            s2 = st(pg)
            raspunde(pg, OK3, tel); verifica(pg, tel, esti=False)     # a doua, în aceeași încărcare: fără întrebare
            s3 = st(pg)
            ok = (are and not chei_elev(s1) and bune(s2) == 1 and s2["r"]["elev"] == "Test Ana" and s3["q"] is None
                  and bune(s3) == 1 and s3["r"]["reincercare"]["bune"] == 3 and all(la_fel(x) for x in (s1, s2, s3)))
            det[ramura] = {"ana_verifica": scurt(s1), "dupa_da": scurt(s2), "a_doua": scurt(s3)}
        oks.append(ok)
        c.close()
    return all(oks), det


def caz15(br, tel, w):
    """GRAV A, repararea: proprietarul are „Nu e verificarea mea”; a doua apăsare o MUTĂ deoparte, nu o șterge"""
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    raspunde(pg, F3, tel); verifica(pg, tel)                 # scrisă pe Ana (a spus „Da, sunt eu”)
    s0 = st(pg)
    b = pg.locator(".lh-rez-rand [data-lh-rez-nu-e]").first
    are = b.count() > 0 and b.is_visible()
    if are:
        bb = b.bounding_box()
        MASURI[w]["buton_nu_e"] = [round(bb["width"]), round(bb["height"])]
        ges(pg, b, tel); pg.wait_for_timeout(300)
    s1 = st(pg)                                              # prima apăsare: doar „Sigur?”
    if are:
        ges(pg, pg.locator(".lh-rez-rand [data-lh-rez-nu-e]").first, tel); pg.wait_for_timeout(500)
    s2 = st(pg)
    pg.reload(); asteapta(pg)
    s3 = st(pg)
    c.close()
    ld = deoparte(s2, "LD")
    ok = (bune(s0) == 1 and s0["r"]["elev"] == "Test Ana" and are and any("Nu e verificarea mea" in x for x in s0["rand"])
          and bune(s1) == 1 and len(chei_elev(s1)) == 1 and any("Sigur?" in x for x in s1["rand"])
          and s2["r"] is None and not chei_elev(s2) and len(ld) == 1 and ld[0]["rec"]["prima"]["r"]["bune"] == 1
          and "deoparte" in s2["ev"] and s3["r"] is None and s3["q"] is None and all(la_fel(x) for x in (s0, s1, s2, s3)))
    return ok, {"pe_ana": scurt(s0), "prima_apasare": scurt(s1), "a_doua": scurt(s2), "reincarcat": scurt(s3)}


def caz16(br, tel, w):
    """GRAV B (VII/1) + m12: Ana, neînscrisă, dă evaluarea (1 din 3); în aceeași filă, altă încărcare, vine Bogdan.
    Fișa Anei nu i se arată și evaluarea lui NU devine reîncercarea ei; întâi „Ai dat-o tu pe cea de la ora …?”."""
    det, oks = {}, []
    for ramura in ("bogdan_nu", "ana_da"):
        c = ctx_nou(br, tel); pg = pagina(c, w)
        pg.goto(PAG); asteapta(pg)
        raspunde(pg, F3, tel); verifica(pg, tel)             # Ana: 1 din 3, fără nume
        s0 = st(pg)
        ora0 = s0["r"]["ora"] if s0["r"] else "?"
        pg.reload(); asteapta(pg)                            # altă încărcare a paginii
        s1 = st(pg)
        m12 = s1["r"] is None and s1["qtip"] == "ai-dat-o" and ("Ai dat-o tu pe cea de la ora " + ora0 + "?") in (s1["q"] or "")
        if ramura == "bogdan_nu":
            raspunde(pg, OK3, tel); verifica(pg, tel)        # Bogdan nu răspunde întâi: 3 din 3
            s2 = st(pg)
            raspunde_q(pg, tel, False, "ai-dat-o")           # „Nu, nu e a mea” -> a Anei deoparte
            s3 = st(pg)
            inregistreaza(pg, "Test Dan", "2222", tel)
            q4 = intrebarea(pg) and tip_q(pg) == "e-a-ta"
            if q4:
                raspunde_q(pg, tel, True)
            s4 = st(pg)
            ok = (m12 and bune(s2) == 3 and s2["r"]["reincercari"] == 0 and len(fara_nume(s2)) == 2
                  and bune(s3) == 3 and s3["r"]["reincercari"] == 0 and len(fara_nume(s3)) == 1 and len(deoparte(s3)) == 1
                  and deoparte(s3)[0]["rec"]["prima"]["r"]["bune"] == 1
                  and q4 and bune(s4) == 3 and s4["r"]["elev"] == "Test Dan" and s4["r"]["reincercari"] == 0
                  and all(la_fel(x) for x in (s0, s1, s2, s3, s4)))
            det[ramura] = {"ana": scurt(s0), "bogdan_la_incarcare": scurt(s1), "bogdan_verifica": scurt(s2),
                           "dupa_nu": scurt(s3), "bogdan_inscris": scurt(s4)}
        else:
            raspunde_q(pg, tel, True, "ai-dat-o")            # e chiar Ana: „Da” -> o vede și continuă
            s2 = st(pg)
            raspunde(pg, OK3, tel); verifica(pg, tel)        # în aceeași încărcare: reîncercare
            s3 = st(pg)
            ges(pg, pg.locator("#alt"), tel); pg.wait_for_timeout(600)   # „Începe o fișă nouă”: nu șterge nimic
            s4 = st(pg)
            raspunde_q(pg, tel, True, "ai-dat-o")
            s5 = st(pg)
            ok = (m12 and bune(s2) == 1 and bune(s3) == 1 and s3["r"]["reincercare"]["bune"] == 3
                  and s4["r"] is None and s4["qtip"] == "ai-dat-o" and len(fara_nume(s4)) == 1
                  and bune(s5) == 1 and s5["r"]["reincercare"]["bune"] == 3 and all(la_fel(x) for x in (s1, s2, s3, s4, s5)))
            det[ramura] = {"la_incarcare": scurt(s1), "dupa_da": scurt(s2), "reincercare": scurt(s3),
                           "fisa_noua": scurt(s4), "da_iar": scurt(s5)}
        oks.append(ok)
        c.close()
    return all(oks), det


TITLU_LUNG = "Lecția 1 · Evaluarea inițială a clasei a VI-a: ce știu despre calculator, fișiere și algoritmi (atelierul de început)"


def caz17(br, tel, w):
    """m9: titlul lecției în întrebare se taie la un cuvânt întreg, cu „…”"""
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG + "?titlu=lung"); asteapta(pg)
    raspunde(pg, F3, tel); verifica(pg, tel)
    pg.goto(PAG + "?tacut=1"); asteapta(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    are = intrebarea(pg)
    q = pg.locator("#lh-rez-q").inner_text().replace("\n", " ") if are else ""
    c.close()
    tail = q.split("pe pagina „", 1)[1].split("”", 1)[0] if "pe pagina „" in q else ""
    baza = tail[:-1] if tail.endswith("…") else None
    ok = bool(are and baza and TITLU_LUNG.startswith(baza) and len(baza) < len(TITLU_LUNG)
              and TITLU_LUNG[len(baza)] in " ,.:;(" and not baza.endswith(" "))
    return ok, {"titlu_in_intrebare": tail, "urmatorul_caracter": TITLU_LUNG[len(baza)] if baza else None}


def caz18(br, tel, w):
    """m10: pentru elevul înscris, butonul paginii se cheamă doar „Sunt alt elev” (nu promite „Încep din nou”)"""
    c = ctx_nou(br, tel); pg = pagina(c, w)
    pg.goto(PAG); asteapta(pg)
    s0 = st(pg)
    inregistreaza(pg, "Test Ana", "1111", tel)
    s1 = st(pg)
    pg.goto(PAG + "?fara=1"); pg.wait_for_timeout(1500)
    s2 = st(pg)
    c.close()
    ok = (s0["alt"] == "Sunt alt elev / Încep din nou" and s1["alt"] == "Sunt alt elev" and s2["alt"] == "Sunt alt elev / Încep din nou")
    return ok, {"neinscris": s0["alt"], "inscris": s1["alt"], "fara_prezenta": s2["alt"], "rand_inscris": s1["rand"][:1]}


CAZURI = [
    (1, "un elev, reîncărcare (și Înapoi)", caz1),
    (2, "doi elevi care se schimbă prin casetă", caz2),
    (3, "înscriere DUPĂ verificare: revendicare Da și Nu", caz3),
    (4, "„Ești tot X?” fără răspuns, alt elev face verificarea", caz4),
    (5, "înscriere în altă filă, întoarcere la fila lecției", caz5),
    (6, "neînscris A verifică, B se înscrie în aceeași filă", caz6),
    (7, "rezultat fără nume mai vechi de 50 de minute (ceas simulat)", caz7),
    (8, "„Sunt alt elev” pe elev confirmat și neconfirmat", caz8),
    (9, "reîncercare după ce a văzut răspunsurile (diagnosticul rămâne)", caz9),
    (10, "fără window.Prezenta", caz10),
    (12, "întrebarea vine singură pe o pagină care nu cheamă componenta (cuprinsul)", caz12),
    (13, "locul întrebării dispare / se ascunde la redesenarea atelierului", caz13),
    (14, "GRAV A: elevul de dinainte încă activ, altul verifică („Ești X?”, Nu / Da)", caz14),
    (15, "GRAV A: „Nu e verificarea mea” (două apăsări) o mută deoparte", caz15),
    (16, "GRAV B + m12: doi neînscriși în aceeași filă („Ai dat-o tu?”, Nu / Da, fișă nouă)", caz16),
    (17, "m9: titlul în întrebare, tăiat la cuvânt întreg cu „…”", caz17),
    (18, "m10: „Sunt alt elev” pentru elevul înscris", caz18),
]


# python rezultat_elev_proba.py 3 5  -> doar cazurile 3 și 5 (la dezvoltare); fără argumente: toate
ALESE = [x for x in CAZURI if not sys.argv[1:] or str(x[0]) in sys.argv[1:]]


def main():
    prez = PREZ.read_bytes()
    info_prez = {"sha1": hashlib.sha1(prez).hexdigest()[:12], "modificat": time.strftime("%d.%m.%Y %H:%M", time.localtime(PREZ.stat().st_mtime)),
                 "asculta_storage": b"'storage'" in prez or b'"storage"' in prez}
    print("prezenta.js:", json.dumps(info_prez, ensure_ascii=False), flush=True)
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(ROOT)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    rez = {}
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--host-resolver-rules=MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"])
            for nr, nume, f in ALESE:
                rez[nr] = {"nume": nume, "vp": {}}
                for tel in (False, True):
                    w = "390" if tel else "1280"
                    t0 = time.time()
                    try:
                        out = f(br, tel, w)
                    except Exception as e:
                        out = (False, {"exceptie": str(e)[:400]})
                    ok, det = out[0], out[1]
                    dep = out[2] if len(out) > 2 else None
                    rez[nr]["vp"][w] = {"ok": bool(ok), "dep": dep, "detalii": det, "sec": round(time.time() - t0, 1)}
                    eticheta = "OK   " if ok else ("AȘTEAPTĂ" if dep and dep["indep_ok"] and not dep["dep_ok"] else "PICAT")
                    print(f"  {eticheta} caz {nr} @{w}: {json.dumps(det, ensure_ascii=False)[:1400]}", flush=True)
            br.close()
    finally:
        srv.terminate()
    # cazul 11: ecranele, consola, butoanele
    d11 = {}
    ok11 = True
    for w in ("1280", "390"):
        m = MASURI[w]
        but = m.get("butoane") or []
        bnu = m.get("buton_nu_e")
        bok = len(but) == 2 and all(x[1] >= 32 and x[2] >= 32 for x in but) and (bnu is None or (bnu[0] >= 32 and bnu[1] >= 32))
        if any(x[0] == 15 for x in ALESE):   # „Nu e verificarea mea” măsurat în cazul 15
            bok = bok and bnu is not None
        vok = m.get("intrebare_in_ecran") is True and m.get("fara_derulare_laterala") is True and m.get("titlul_neacoperit") is True
        eok = not ERORI[w]
        d11[w] = {"erori": ERORI[w][:8], "butoane": but, "buton_nu_e": bnu, "intrebarea_in_ecran": m.get("intrebare_in_ecran"),
                  "fara_derulare_laterala": m.get("fara_derulare_laterala"), "titlul_neacoperit": m.get("titlul_neacoperit")}
        ok11 = ok11 and bok and vok and eok
    rez[11] = {"nume": "390 px cu atingere și 1280 px, 0 erori în consolă", "ok": ok11, "detalii": d11}
    retea_ok = not SCAPATE
    rez["retea"] = {"oprite": len(EXT), "gazde": sorted({u.split("/")[2] for u in EXT if "://" in u}), "trecute": SCAPATE[:5]}

    print("\nMATRICEA (1280 mouse · 390 atingere)")
    picate, asteapta_p = 0, 0
    for nr, nume, _ in ALESE:
        vp = rez[nr]["vp"]
        ok = all(v["ok"] for v in vp.values())
        doar_dep = not ok and all(v["ok"] or (v["dep"] and v["dep"]["indep_ok"] and not v["dep"]["dep_ok"]) for v in vp.values())
        rez[nr]["ok"] = ok
        rez[nr]["asteapta_prezenta"] = doar_dep
        verdict = "TRECUT" if ok else ("PICAT [așteaptă prezenta.js]" if doar_dep else "PICAT")
        picate += 0 if ok else 1
        asteapta_p += 1 if doar_dep else 0
        print(f"  {nr:>2}. {verdict:<30} {nume}  (1280: {'da' if vp['1280']['ok'] else 'nu'} · 390: {'da' if vp['390']['ok'] else 'nu'})")
    print(f"  11. {'TRECUT' if ok11 else 'PICAT':<30} {rez[11]['nume']}  {json.dumps(d11, ensure_ascii=False)[:600]}")
    picate += 0 if ok11 else 1
    print(f"  rețeaua: {len(EXT)} cereri spre alt server OPRITE ({', '.join(rez['retea']['gazde'])}); trecute: {len(SCAPATE)}")
    if not retea_ok:
        picate += 1
        print("  PICAT: au trecut cereri spre alt server:", SCAPATE[:5])
    rez["prezenta_js"] = info_prez
    rez["picate"] = picate
    rez["din_care_asteapta_prezenta"] = asteapta_p
    OUT.write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"picate: {picate}, din care așteaptă reparația din prezenta.js: {asteapta_p}")
    print(picate)


if __name__ == "__main__":
    main()
