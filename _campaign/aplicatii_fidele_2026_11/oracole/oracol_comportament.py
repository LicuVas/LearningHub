# -*- coding: utf-8 -*-
r"""O4 — ORACOLUL DE COMPORTAMENT (cerința R5 din ../contract.md; Etapa 0, 16.11.2026).

Ce numără: fiecare scenariu din D/scenarii/**/*.json e jucat în SIMULATOR, cu mouse și tastatură ADEVĂRATE (Playwright,
Chrome, rețeaua tăiată în afară de 127.0.0.1 — regula 24), iar starea finală se compară, cheie cu cheie (stare_citita),
cu rezultatul aplicației REALE din D/referinte/scenarii_real/<id>.json.
    problemele = diferențele de stare: 1 pe cheie din stare_citita; când valoarea e un obiect (dialog, celule, selectie,
                 continut_fisiere…), 1 pe fiecare câmp al lui care diferă (o a doua greșeală în aceeași fereastră se vede)
               + scenarii pe care simulatorul nu le poate executa (pagina n-are nici biblioteca, nici un adaptor;
                 o țintă nu e pe ecran; un gest nu se poate face) — câte 1 pe fiecare cheie din stare_citita (minimum 1):
                 nimic din ce trebuia citit nu s-a putut citi, deci nu poate cântări mai puțin decât o cheie greșită
               + scenarii FĂRĂ rezultat real probat (lipsă sau mod_probat != true) — 1 pe scenariu, se numără separat
                 (rândul „scenarii fără rezultat real probat” stă înaintea penultimei linii) și NU trec niciodată; dacă
                 simulatorul nici nu le poate juca, se numără ÎN PLUS ca neexecutabile (cheile lor), fiindcă neputința
                 simulatorului nu depinde de referință (17.11.2026)
               + ECRANUL ≠ STAREA (reparația 10 din ../verificare_etapa0.md, 17.11.2026): la cheile „text” (Word) și
                 „celule” (Excel), starea raportată de bibliotecă (L.stare) se compară și cu ce e randat (sim_runner.js
                 › ecran: țintele text:N / celula:<A1> din [data-lh-zona], textul lor vizibil) — 1 pe fiecare paragraf /
                 celulă care diferă, în orice scenariu jucat (și în cele fără rezultat real): un model corect cu un ecran
                 neredesenat nu trece.
Unde se joacă (în ordine; primul care merge):
    1. <rad>/aplicatii/poligon.html cu biblioteca centrală (window.LH.aplicatii) — contractul din ../api_biblioteca.md;
    2. paginile din „lectii” ale scenariului, apoi paginile din inventar.json cu aceeași aplicație principală, pe
       simulatoarele VECHI care au adaptor în sim_runner.js (azi: doar Explorer).
    O pagină cu biblioteca pe care pregătirea pică DOAR pentru că aplicația nu e (încă) în bibliotecă (biblioteca spune
    „„<app>” nu e încă în bibliotecă” și n-a pus nicio rădăcină [data-lh-aplicatie=<app>]) e tratată ca o pagină fără
    motor pentru aplicația aceea: se trece la pagina următoare (runda `acoperire` din 18.11.2026 — înainte, în etapa B,
    biblioteca doar cu Word oprea scenariile Explorer pe poligon, fără să mai ajungă la adaptorul vechi). Orice alt eșec
    de pregătire pe bibliotecă rămâne eșec (neexecutabil), nu se ascunde pe o pagină veche.
Rezultatul simulat al fiecărui scenariu: D/runde/_sim/<id>.json (cu LH_IESIRE: <LH_IESIRE>/_sim/<id>.json), aceeași formă
ca rezultatul real: {id, mod_probat, stare, eroare, cum}. mod_probat = true doar dacă scenariul s-a jucat până la capăt.
Cheile comparate ca MULȚIMI (descrierea scenariilor: „ordonate cu sorted() din Python”): nume_fisiere, in_cos.
Rețeaua (reparația 12): pe lângă ruta care abandonează tot ce nu e 127.0.0.1, navigator.sendBeacon întoarce false și
assets/js/prezenta.js + site-credit.js nu se încarcă (ca în sarcini_lib/joaca.py).
Convenția rădăcinii (CONVENTIE_RADACINA.md): LH_RADACINA = situl măsurat, LH_IESIRE = unde scriu detaliile,
LH_PAGINI = doar scenariile ale căror lecții (sau, fără lecții, aplicație) cad pe acele pagini. Reperele înghețate
(scenarii, referinte, inventar) se citesc MEREU din D, nu din LH_RADACINA.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/oracol_comportament.py
    ... --scenarii <dosar> [--reale <dosar>]     # alt set de scenarii (ex. _exemple_scenarii)
    ... --autotest                               # dovada: prinde greșeli plantate pe copii temporare (vezi la final)
Ieșirea: ultima linie = UN întreg; penultima = calea JSON-ului cu detalii; cod 0 = 0 probleme, 1 = probleme,
2 = prăbușire.
"""
import argparse
import functools
import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import traceback
from pathlib import Path
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8")

AICI = Path(__file__).resolve().parent                     # D/oracole
D = AICI.parent                                            # dosarul lucrării: reperele înghețate
WT = D.parents[1]                                          # worktree-ul
RAD = Path(os.environ.get("LH_RADACINA") or WT).resolve()  # situl măsurat
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else AICI
DETALII = IESIRE / (Path(__file__).stem + ".json")
SIM_DIR = (IESIRE / "_sim") if os.environ.get("LH_IESIRE") else (D / "runde" / "_sim")
PAGINI = [p.strip().replace("\\", "/") for p in os.environ.get("LH_PAGINI", "").split(",") if p.strip()]
RUNNER = AICI / "sim_runner.js"
INVENTAR = D / "inventar.json"
MULTIMI = {"nume_fisiere", "in_cos"}
LOCALE = ("127.0.0.1", "localhost")
# fișierele locale care vorbesc cu serverul viu: nu se încarcă (ca sarcini_lib/joaca.py, FARA)
FARA = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")
FARA_BEACON = ("(()=>{const nu=function(){return false};"
               "try{Object.defineProperty(Navigator.prototype,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}"
               "try{Object.defineProperty(navigator,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}})();")
OPRITE = []   # cererile locale abandonate (prezenta.js, site-credit.js) — doar raportate
LIPSA = "__LIPSA__"


class Tacut(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript",
                      ".mjs": "application/javascript", ".json": "application/json", ".css": "text/css",
                      ".svg": "image/svg+xml", ".html": "text/html"}

    def log_message(self, format, *args):
        pass


class Neexecutabil(Exception):
    pass


def server(rad):
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(rad)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, "http://127.0.0.1:%d" % srv.server_address[1]


def context_blocat(br, plecate, **kw):
    ctx = br.new_context(**kw)

    def ruta(r):
        u = urlsplit(r.request.url)
        if u.hostname not in LOCALE:   # regula 24: nimic nu pleacă din 127.0.0.1
            plecate.append(r.request.url)
            return r.abort()
        if u.path.endswith(FARA):      # prezenta.js / site-credit.js: nu se încarcă (reparația 12)
            OPRITE.append(u.path)
            return r.abort()
        return r.continue_()
    ctx.route("**/*", ruta)
    ctx.add_init_script(FARA_BEACON)   # sendBeacon la închiderea paginii scăpa de rută (jocuri/_motor/garda_locala.py)
    # profilul elevului de probă: paginile lecțiilor nu mai cer înscrierea (nu pleacă nimic: ruta abandonează tot)
    ctx.add_init_script("try{localStorage.setItem('learninghub_active_profile','ProbaO4')}catch(e){}")
    return ctx


def citeste_json(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


# ---------------- gesturile (adevărate) ----------------
NUME_TASTE = {"ctrl": "Control", "control": "Control", "alt": "Alt", "shift": "Shift", "win": "Meta", "windows": "Meta",
              "esc": "Escape", "escape": "Escape", "del": "Delete", "delete": "Delete", "enter": "Enter",
              "backspace": "Backspace", "tab": "Tab", "space": " ", "spatiu": " ", "home": "Home", "end": "End",
              "pageup": "PageUp", "pagedown": "PageDown", "sus": "ArrowUp", "jos": "ArrowDown", "stanga": "ArrowLeft",
              "dreapta": "ArrowRight", "up": "ArrowUp", "down": "ArrowDown", "left": "ArrowLeft", "right": "ArrowRight",
              "insert": "Insert", "meniu": "ContextMenu"}


def combinatie(t):
    """„Ctrl+C” -> „Control+c”; „Shift+Delete”; „Ctrl+Shift+N” -> „Control+Shift+N”; „F2”."""
    parti = [x.strip() for x in str(t).replace(" ", "").split("+") if x.strip()] if str(t) != "+" else ["+"]
    shift = any(p.lower() == "shift" for p in parti)
    out = []
    for p in parti:
        lo = p.lower()
        if lo in NUME_TASTE:
            out.append(NUME_TASTE[lo])
        elif len(p) == 1:
            out.append(p.upper() if shift else p.lower())
        elif lo.startswith("f") and lo[1:].isdigit():
            out.append("F" + lo[1:])
        else:
            out.append(p)
    return "+".join(out)


def element(pg, t):
    h = pg.evaluate_handle("t=>window.LHSimRunner.element(t)", t)
    e = h.as_element()
    if e is None:
        raise Neexecutabil("ținta „%s” nu e pe ecran" % t)
    return e


def apasa(e, **kw):
    if not e.is_enabled():   # un buton gri: în aplicația reală, clicul pe el nu face nimic — îl fac la fel, cu mouse-ul
        kw["force"] = True
    e.click(timeout=5000, **kw)


def mijloc(e):
    b = e.bounding_box()
    if not b:
        raise Neexecutabil("elementul nu are dreptunghi pe ecran")
    return b["x"] + b["width"] / 2, b["y"] + b["height"] / 2, b


def zona_vizibila(pg):
    pg.evaluate("()=>{const z=document.querySelector('#lh-sim-runner [data-lh-zona]')||document.getElementById('lh-sim-runner');"
                "if(z)z.scrollIntoView({block:'center',inline:'nearest'})}")


def punct(pg, t):
    """Punctul în care se face gestul: centrul elementului țintei sau, la țintele de TEXT (text:/pozitie:), punctul din
    dreptunghiul cuvântului (capătul cerut) — dat de biblioteca (LH.aplicatii.dreptunghi) sau căutat în textul randat.
    Țintele de text: cuvant:<cuvânt>#<apariția>[@stanga|dreapta|mijloc], pozitie:<k> (api_biblioteca.md §7.2)."""
    if t.startswith(("cuvant:", "pozitie:")):
        zona_vizibila(pg)
        r = pg.evaluate("t=>window.LHSimRunner.dreptunghi(t)", t)
        if not r:
            raise Neexecutabil("ținta de text „%s” nu e în document" % t)
        cap = r.get("capat") or "mijloc"
        x = r["x"] + (1 if cap == "stanga" else (r["w"] - 1) if cap == "dreapta" else r["w"] / 2)
        return x, r["y"] + r["h"] / 2, None
    e = element(pg, t)
    e.scroll_into_view_if_needed(timeout=5000)
    x, y, _ = mijloc(e)
    return x, y, e


def trage_intre(pg, a, b):
    (x0, y0), (x1, y1) = a, b
    pg.mouse.move(x0, y0)
    pg.mouse.down()
    for k in range(1, 11):
        pg.mouse.move(x0 + (x1 - x0) * k / 10, y0 + (y1 - y0) * k / 10)
    pg.mouse.up()


def tinta(pg, o, app):
    t = pg.evaluate("([o,a])=>window.LHSimRunner.tintaObiect(o,a)", [o, app])
    if not t:
        raise Neexecutabil("nu pot face o țintă din %s" % json.dumps(o, ensure_ascii=False))
    return t


def ajunge(pg, t):
    """Pregătirea fără de care ținta nu se vede (Explorer: intri întâi în folderul ei) — gesturi reale, pas cu pas."""
    for _ in range(7):
        plan = pg.evaluate("t=>window.LHSimRunner.drum(t)", t)
        if plan.get("gata"):
            return plan["finala"]
        if plan.get("eroare"):
            raise Neexecutabil(plan["eroare"])
        ep = element(pg, plan["tinta"])
        if plan["gest"] == "dublu_clic":
            ep.dblclick(timeout=5000)
        else:
            apasa(ep)
        pg.wait_for_timeout(150)
    raise Neexecutabil("ținta „%s” nu se vede nici după 7 pași de navigare" % t)


def camp_text(pg, valoare):
    """Câmpul „nume fișier” al ferestrelor Save As / Insert Picture (ținta camp:nume_fisier, api_biblioteca.md §7.3)."""
    e = element(pg, "camp:nume_fisier")
    apasa(e)
    pg.keyboard.press("Control+a")
    pg.keyboard.type(str(valoare), delay=10)
    pg.keyboard.press("Enter")


def executa(pg, pas, app):
    g = pas.get("gest")
    rep = max(1, int(pas.get("repeta") or 1))
    mods = [NUME_TASTE.get(str(m).lower(), m) for m in (pas.get("taste_tinute") or pas.get("modificatori") or [])]
    if g == "taste":
        for _ in range(rep):
            pg.keyboard.press(combinatie(pas.get("taste")))
            pg.wait_for_timeout(60)
        return
    if g == "tasteaza":
        pg.keyboard.type(str(pas.get("text", "")), delay=12)
        return
    if g == "trage":
        if pas.get("ce") in ("patratelul_de_umplere", "maner_umplere"):
            sursa, dest = str(pas.get("sursa", "")), str(pas.get("destinatie", ""))
            a = sursa.split(":")
            if len(a) == 2 and a[0] != a[1]:
                trage_intre(pg, punct(pg, "celula:" + a[0])[:2], punct(pg, "celula:" + a[1])[:2])
            elif a[0]:
                apasa(element(pg, "celula:" + a[0]))
            pg.wait_for_timeout(120)
            trage_intre(pg, punct(pg, "maner_umplere")[:2], punct(pg, "celula:" + dest.split(":")[-1])[:2])
            return
        if isinstance(pas.get("forma"), list):
            x0, y0, _ = punct(pg, "forma:" + "/".join(str(v) for v in pas["forma"]))
            cu = pas.get("cu") or [0, 0]
            f = pg.evaluate("()=>{const L=(window.LH&&LH.aplicatii)||window.LHAplicatii;try{return L&&L.pxPePunct?+L.pxPePunct('%s')||1:1}catch(e){return 1}}" % app)
            trage_intre(pg, (x0, y0), (x0 + cu[0] * f, y0 + cu[1] * f))
            return
        de = pas.get("de_la", pas.get("sursa", pas.get("tinta")))
        la = pas.get("la", pas.get("destinatie", pas.get("spre", pas.get("catre"))))
        if de is None or la is None:
            raise Neexecutabil("„trage” fără capete (de_la/la, sursa/destinatie)")
        ta, tb = tinta(pg, de, app), tinta(pg, la, app)
        trage_intre(pg, punct(pg, ajunge(pg, ta))[:2], punct(pg, ajunge(pg, tb))[:2])
        return
    if g == "selecteaza":
        if isinstance(pas.get("de_la"), (int, dict, str)) and pas.get("pana_la") is not None:
            ta, tb = tinta(pg, pas["de_la"], app), tinta(pg, pas["pana_la"], app)
            trage_intre(pg, punct(pg, ta)[:2], punct(pg, tb)[:2])
            return
        t = pg.evaluate("([p,a])=>window.LHSimRunner.tintaPas(p,a)", [pas, app])
        if not t:
            raise Neexecutabil("„selecteaza” fără țintă")
        x, y, e = punct(pg, ajunge(pg, t))
        if e is not None:
            b = e.bounding_box()
            trage_intre(pg, (b["x"] + 2, y), (b["x"] + b["width"] - 2, y))
        else:
            pg.mouse.dblclick(x, y)
        return
    if g not in ("clic", "dublu_clic", "triplu_clic", "clic_dreapta", "comanda_panglica", "meniu"):
        raise Neexecutabil("gest necunoscut în formatul scenariilor: %s" % g)
    if g == "comanda_panglica" and pas.get("fila") and (pas.get("id_mso") or pas.get("mso")):
        h = pg.evaluate_handle("t=>window.LHSimRunner.element(t)", "mso:" + str(pas["fila"])).as_element()
        if h is not None:   # fila (sau File/Backstage) întâi, ca în aplicația reală; dacă nu e pe ecran, comanda se caută direct
            apasa(h)
            pg.wait_for_timeout(150)
    t = pg.evaluate("([p,a])=>window.LHSimRunner.tintaPas(p,a)", [pas, app])
    if not t:
        raise Neexecutabil("pasul n-are țintă: %s" % json.dumps(pas, ensure_ascii=False))
    t = ajunge(pg, t)
    clicuri = {"dublu_clic": 2, "triplu_clic": 3}.get(g, 1)
    buton = "right" if g == "clic_dreapta" else "left"
    if t.startswith(("cuvant:", "pozitie:")):
        x, y, _ = punct(pg, t)
        for m in mods:
            pg.keyboard.down(m)
        pg.mouse.click(x, y, click_count=clicuri, button=buton)
        for m in mods:
            pg.keyboard.up(m)
    else:
        e = element(pg, t)
        if clicuri == 2:
            e.dblclick(timeout=5000, modifiers=mods or None)
        elif clicuri == 3:
            e.click(click_count=3, timeout=5000, modifiers=mods or None)
        elif buton == "right":
            e.click(button="right", timeout=5000, modifiers=mods or None)
        else:
            apasa(e, modifiers=mods or None)
    if g == "comanda_panglica":   # ce se alege după comandă: element din galerie/meniu, tabelul RxC, numele fișierului
        pg.wait_for_timeout(150)
        if pas.get("element"):
            apasa(element(pg, "meniu:" + str(pas["element"])))
        elif pas.get("randuri") and pas.get("coloane"):
            apasa(element(pg, "meniu:%sx%s Table" % (pas["coloane"], pas["randuri"])))
        if pas.get("nume") or pas.get("fisier"):
            pg.wait_for_timeout(150)
            camp_text(pg, pas.get("nume") or pas.get("fisier"))


# ---------------- paginile pe care se poate juca un scenariu ----------------
def pagini_candidate(scen, inv):
    out = []
    if (RAD / "aplicatii" / "poligon.html").exists():
        out.append("aplicatii/poligon.html")
    for l in scen.get("lectii") or []:
        out.append("lectii/%s/index.html" % str(l).strip("/"))
    for p in inv.get("pagini", []):
        if p.get("aplicatia_principala") == scen.get("aplicatie"):
            out.append(p["pagina"])
    vazute, bune = set(), []
    for p in out:
        if p not in vazute and (RAD / p).exists():
            vazute.add(p)
            bune.append(p)
    return bune


def in_pagini(scen, inv):
    if not PAGINI:
        return True
    lec = ["lectii/%s/index.html" % str(l).strip("/") for l in scen.get("lectii") or []]
    if lec:
        return any(p in PAGINI for p in lec)
    return any(p.get("aplicatia_principala") == scen.get("aplicatie") and p["pagina"] in PAGINI for p in inv.get("pagini", []))


def deschide(pg, baza, pagina):
    pg.goto(baza + "/" + pagina, wait_until="load", timeout=25000)
    try:
        pg.wait_for_function("!!(window.LH&&window.LH.aplicatii)||!!window.LHAplicatii||!!window.JocMotor", timeout=6000)
    except Exception:
        pass
    pg.add_script_tag(path=str(RUNNER))


def lipseste_din_biblioteca(pg, app, eroare):
    """True doar dacă pregătirea pe bibliotecă a picat pentru că aplicația NU e (încă) în ea: fraza bibliotecii
    (aplicatii/aplicatii.js › incarcaApp: „„<app>” nu e încă în bibliotecă”) pentru EXACT aplicația scenariului, și nicio
    rădăcină [data-lh-aplicatie=<app>] pusă în pagină (biblioteca n-a început s-o deschidă). Altă frază, altă aplicație
    sau o rădăcină începută = aplicația e în bibliotecă și pică: rămâne eșec. Dacă biblioteca își schimbă fraza, trecerea
    se oprește și scenariile ies neexecutabile (numărul crește, nu se ascunde nimic)."""
    if not re.search(r"[„“\"']%s[”“\"'] nu e încă în bibliotecă" % re.escape(str(app)), str(eroare or "")):
        return False
    return not pg.evaluate("a=>[...document.querySelectorAll('[data-lh-aplicatie]')]"
                           ".some(e=>e.getAttribute('data-lh-aplicatie')===a)", app)


def joaca(br, baza, scen, inv, plecate, cache_motor):
    """Întoarce (rezultat_sim, pagina, motor, eroare)."""
    app = scen.get("aplicatie")
    chei = scen.get("stare_citita") or []
    erori, fara_motor = [], []
    for pagina in pagini_candidate(scen, inv):
        if cache_motor.get((pagina, app)) is None and (pagina, app) in cache_motor:
            fara_motor.append(pagina)   # deja încercată: nici biblioteca, nici un adaptor pentru aplicație
            continue
        ctx = context_blocat(br, plecate, viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        jserr = []
        pg.on("pageerror", lambda e: jserr.append(str(e)))
        try:
            deschide(pg, baza, pagina)
            m = pg.evaluate("a=>window.LHSimRunner.motor(a)", app)
            cache_motor[(pagina, app)] = m
            if not m:
                erori.append("%s: fără motor pentru %s" % (pagina, app))
                continue
            r = pg.evaluate("s=>window.LHSimRunner.pregateste(s)", scen)
            if not r.get("ok"):
                if m == "biblioteca" and lipseste_din_biblioteca(pg, app, r.get("eroare")):
                    # ca și cum biblioteca n-ar exista pentru aplicația asta: pagina nu are motor pentru ea -> următoarea
                    cache_motor[(pagina, app)] = None
                    erori.append("%s: %s" % (pagina, r.get("eroare", "?")))
                    continue
                return None, pagina, m, "neexecutabil: " + r.get("eroare", "?")
            pg.wait_for_timeout(150)
            for i, pas in enumerate(scen.get("pasi") or []):
                try:
                    executa(pg, pas, app)
                except Neexecutabil as e:
                    return None, pagina, m, "neexecutabil la pasul %d (%s): %s" % (i + 1, pas.get("gest"), e)
                except Exception as e:
                    return None, pagina, m, "neexecutabil la pasul %d (%s): %s" % (i + 1, pas.get("gest"), str(e).splitlines()[0][:200])
                pg.wait_for_timeout(150)
            st = pg.evaluate("c=>window.LHSimRunner.stare(c)", chei)
            ec = pg.evaluate("c=>window.LHSimRunner.ecran?window.LHSimRunner.ecran(c):{}", chei)   # ce e randat (text/celule)
            cum = r.get("cum") or m
            if jserr:
                cum += "; erori JS: " + " | ".join(jserr[:2])[:300]
            return {"stare": st, "ecran": ec or {}, "cum": cum}, pagina, m, None
        except Exception as e:
            erori.append("%s: %s" % (pagina, str(e).splitlines()[0][:200]))
        finally:
            ctx.close()
    if fara_motor and not erori:
        return None, None, None, ("neexecutabil: pe cele %d pagini candidate (%s…) nu e nici biblioteca cu „%s” (aplicatii/poligon.html), "
                                  "nici un simulator vechi cu adaptor pentru „%s”" % (len(fara_motor), fara_motor[0], app, app))
    return None, None, None, "neexecutabil: " + ("; ".join(erori[:3]) if erori else "nicio pagină candidată pe disc")


def normal(k, v):
    if v == LIPSA:
        return LIPSA
    if k in MULTIMI and isinstance(v, list):
        return sorted(v)
    return v


def diferente(k, a, b):
    """Diferențele dintre valoarea simulată a și cea reală b ale cheii k: o cheie cu valoare obiect se compară câmp cu câmp
    (câmpurile lipsă de o parte = diferite); altfel o singură comparație."""
    a, b = normal(k, a), normal(k, b)
    if a == b:
        return []
    if isinstance(a, dict) or isinstance(b, dict):
        da, db = (a if isinstance(a, dict) else {}), (b if isinstance(b, dict) else {})
        out = [{"cheie": "%s.%s" % (k, c), "simulator": da.get(c, LIPSA), "real": db.get(c, LIPSA)}
               for c in sorted(set(da) | set(db), key=str) if da.get(c, LIPSA) != db.get(c, LIPSA)]
        return out or [{"cheie": k, "simulator": a, "real": b}]
    return [{"cheie": k, "simulator": a, "real": b}]


def scurt(v):
    s = json.dumps(v, ensure_ascii=False)
    return s if len(s) <= 160 else s[:157] + "..."


# ---------------- ecranul ≠ starea (reparația 10) ----------------
def norm_ecran(s, pre=False):
    """textul cum îl poate vedea elevul: fără caracterele de lățime 0; spațiul neîntreruptibil = spațiu; fără white-space
    „pre*” pe element, spațiile succesive se văd ca unul și cele de la capete nu se văd"""
    s = str(s).replace("​", "").replace("﻿", "").replace(" ", " ")
    return s if pre else re.sub(r"[ \t\r\n\f]+", " ", s).strip()


def paragrafe_stare(v):
    """`text` din stare (§5: lista paragrafelor); un șir e despărțit la capetele de rând (o formă greșită se vede deja la
    compararea cu realul — aici contează doar dacă ecranul arată același text)"""
    if isinstance(v, str):
        return re.split(r"\r\n|\r|\n", v)
    if isinstance(v, list):
        return [x if isinstance(x, str) else json.dumps(x, ensure_ascii=False) for x in v]
    return None


def dif_ecran_text(st, ec):
    par = paragrafe_stare(st)
    if par is None:
        return []
    ep = ec.get("paragrafe") or []
    out = []
    for i in range(max(len(par), len(ep))):
        a = par[i] if i < len(par) else LIPSA
        b = ep[i].get("t", "") if i < len(ep) else LIPSA
        pre = bool(ep[i].get("pre")) if i < len(ep) else False
        if norm_ecran("" if a == LIPSA else a, pre) != norm_ecran("" if b == LIPSA else b, pre):
            out.append({"cheie": "ecran.text[%d]" % (i + 1), "stare": a, "ecran": b})
    return out


def afisat(v):
    """variantele de text afișat ale unei celule din stare: `text` (§5) dacă există, altfel valoarea (cu virgulă sau punct
    zecimal, TRUE/FALSE)"""
    if isinstance(v, dict):
        if v.get("text") is not None:
            return [str(v["text"])]
        v = v.get("valoare")
    if v is None or v == LIPSA:
        return [""]
    if isinstance(v, bool):
        return ["TRUE" if v else "FALSE", "ADEVĂRAT" if v else "FALS"]
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    s = str(v)
    return [s, s.replace(".", ",")]


def cheie_celula(a):
    m = re.match(r"([A-Z]+)(\d+)$", a)
    return (int(m.group(2)), len(m.group(1)), m.group(1)) if m else (0, 0, a)


def dif_ecran_celule(st, ec):
    if not isinstance(st, dict):
        return []
    ce = {str(k).upper(): v for k, v in (ec.get("celule") or {}).items()}
    sn = {str(k).replace("$", "").upper(): v for k, v in st.items()}
    out = []
    for a in sorted(set(sn) | {k for k, t in ce.items() if norm_ecran(t)}, key=cheie_celula):
        var = {norm_ecran(x) for x in afisat(sn.get(a))}
        if a not in ce:
            if var != {""}:
                out.append({"cheie": "ecran.celule.%s" % a, "stare": sn.get(a), "ecran": LIPSA})
        elif norm_ecran(ce[a]) not in var:
            out.append({"cheie": "ecran.celule.%s" % a, "stare": sn.get(a, LIPSA), "ecran": ce[a]})
    return out


def diferente_ecran(chei, stare, ecran):
    """1 pe fiecare paragraf / celulă în care starea raportată (L.stare) nu e ce se vede pe ecran"""
    out = []
    if "text" in chei and isinstance(ecran.get("text"), dict):
        out += dif_ecran_text(stare.get("text", LIPSA), ecran["text"])
    if "celule" in chei and isinstance(ecran.get("celule"), dict):
        out += dif_ecran_celule(stare.get("celule", LIPSA), ecran["celule"])
    return out


def masoara(dosar_scen, dosar_reale):
    inv = citeste_json(INVENTAR) if INVENTAR.exists() else {"pagini": []}
    fisiere = sorted(Path(dosar_scen).glob("**/*.json"))
    srv, baza = server(RAD)
    plecate, rez, cache_motor = [], [], {}
    from playwright.sync_api import sync_playwright
    try:
        with sync_playwright() as p:
            try:
                br = p.chromium.launch(channel="chrome", args=["--mute-audio"])
            except Exception:
                br = p.chromium.launch(args=["--mute-audio"])
            print("O4 · comportament: %d scenarii din %s · situl %s · Chrome %s" % (len(fisiere), dosar_scen, RAD, br.version), flush=True)
            for f in fisiere:
                r = {"fisier": str(f), "id": f.stem}
                try:
                    scen = citeste_json(f)
                except Exception as e:
                    r.update(verdict="neexecutabil", eroare="scenariu ilizibil: %s" % e)
                    rez.append(r)
                    print("  RĂU  %s: scenariu ilizibil" % f.name, flush=True)
                    continue
                sid = scen.get("id") or f.stem
                r.update(id=sid, aplicatie=scen.get("aplicatie"), mod=scen.get("mod"))
                if not in_pagini(scen, inv):
                    r.update(verdict="sarit", eroare="în afara LH_PAGINI")
                    rez.append(r)
                    continue
                chei = scen.get("stare_citita") or []
                real_f = Path(dosar_reale) / (sid + ".json")
                real = citeste_json(real_f) if real_f.exists() else None
                t0 = time.time()
                sim, pagina, motor, err = joaca(br, baza, scen, inv, plecate, cache_motor)
                r.update(pagina=pagina, motor=motor, secunde=round(time.time() - t0, 1))
                SIM_DIR.mkdir(parents=True, exist_ok=True)
                iesire_sim = {"id": sid, "mod_probat": sim is not None,
                              "stare": ({k: (None if v == LIPSA else v) for k, v in sim["stare"].items()} if sim else {}),
                              "eroare": err, "cum": (sim["cum"] if sim else "simulator: nejucat") + (" · pagina " + pagina if pagina else "")}
                (SIM_DIR / (sid + ".json")).write_text(json.dumps(iesire_sim, ensure_ascii=False, indent=1), encoding="utf-8")
                dif_ec = diferente_ecran(chei, sim["stare"], sim.get("ecran") or {}) if sim else []
                if dif_ec:
                    r["ecran"] = dif_ec
                    for d in dif_ec:
                        print("  RĂU  %s: pe ECRAN nu e ce spune starea, la „%s” — stare %s / ecran %s"
                              % (sid, d["cheie"], scurt(d["stare"]), scurt(d["ecran"])), flush=True)
                if not real or real.get("mod_probat") is not True:
                    r.update(verdict="fara_real", eroare=("rezultatul real lipsește: " + str(real_f)) if not real else
                             "rezultatul real are mod_probat=%r (%s)" % (real.get("mod_probat"), real.get("eroare") or real.get("nota")))
                    print("  RĂU  %s: fără rezultat real probat" % sid, flush=True)
                    if sim is None:   # și simulatorul nu-l poate juca: alt defect, al simulatorului — se numără și el
                        r.update(neexecutabil=err, pondere=max(1, len(chei)))
                        print("  RĂU  %s: %s" % (sid, err[:220]), flush=True)
                elif sim is None:
                    r.update(verdict="neexecutabil", eroare=err, pondere=max(1, len(chei)))
                    print("  RĂU  %s: %s" % (sid, err[:220]), flush=True)
                else:
                    dif = []
                    for k in chei:
                        dif += diferente(k, sim["stare"].get(k, LIPSA), (real.get("stare") or {}).get(k, LIPSA))
                    r.update(verdict="ok" if not dif else "diferente", diferente=dif)
                    if dif:
                        for d in dif:
                            print("  RĂU  %s: „%s” diferă — simulator %s / real %s" % (sid, d["cheie"], scurt(d["simulator"]), scurt(d["real"])), flush=True)
                    elif not dif_ec:
                        print("  ok   %s (%s)" % (sid, motor), flush=True)
                rez.append(r)
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    return rez, plecate


def rezuma(rez, plecate, dosar_scen):
    nd = sum(len(r.get("diferente", [])) for r in rez if r.get("verdict") == "diferente")
    # neexecutabile: verdictul „neexecutabil” + scenariile fără rezultat real probat pe care simulatorul nici nu le poate
    # juca (17.11.2026: înainte, lipsa realului ascundea neputința simulatorului — 2 scenarii Excel trecute pe
    # mod_probat=false ar fi COBORÂT numărul cu 4)
    nx = [r for r in rez if r.get("verdict") == "neexecutabil" or (r.get("verdict") == "fara_real" and r.get("neexecutabil"))]
    ne = len(nx)
    nep = sum(r.get("pondere", 1) for r in nx)
    nf = sum(1 for r in rez if r.get("verdict") == "fara_real")
    nec = sum(len(r.get("ecran", [])) for r in rez)   # ecranul ≠ starea raportată (text / celule), în orice scenariu jucat
    jucate = [r for r in rez if r.get("verdict") != "sarit"]
    gol = 1 if not jucate and not PAGINI else 0   # niciun scenariu = nimic dovedit, nu „0 probleme”
    total = nd + nep + nf + nec + gol   # cererile spre afară sunt abandonate de rută (regula 24): se raportează, nu se numără
    IESIRE.mkdir(parents=True, exist_ok=True)
    DETALII.write_text(json.dumps({
        "oracol": "O4 oracol_comportament (R5)", "generat": time.strftime("%Y-%m-%d %H:%M:%S"), "radacina": str(RAD),
        "scenarii_din": str(dosar_scen), "rezultate_simulate": str(SIM_DIR),
        "numere": {"diferente": nd, "neexecutabile_scenarii": ne, "neexecutabile_chei": nep, "fara_real_probat": nf,
                   "ecran_diferit_de_stare": nec, "fara_scenarii": gol,
                   "cereri_plecate_din_127": len(plecate), "cereri_locale_oprite": len(OPRITE), "total": total},
        "scenarii": rez, "cereri_plecate": plecate[:50]}, ensure_ascii=False, indent=1), encoding="utf-8")
    ok = sum(1 for r in rez if r.get("verdict") == "ok" and not r.get("ecran"))
    print("Rezultat: %d/%d scenarii la fel ca aplicația reală; %d diferențe (în %d scenarii); %d scenarii neexecutabile în simulator (= %d chei necitite); "
          "%d diferențe ecran ≠ stare (în %d scenarii)%s"
          % (ok, len(jucate), nd, sum(1 for r in rez if r.get("verdict") == "diferente"), ne, nep, nec,
             sum(1 for r in rez if r.get("ecran")), "; NICIUN scenariu" if gol else ""))
    if plecate:
        print("  info %d cereri spre afară (ex. fonturi) abandonate de rută, niciuna plecată (regula 24)" % len(plecate))
    if OPRITE:
        print("  info %d cereri locale către prezenta.js / site-credit.js abandonate (nu vorbesc cu serverul viu)" % len(OPRITE))
    print("scenarii fără rezultat real probat (mod_probat=true): %d" % nf)
    print(str(DETALII))
    print(total)
    return total


# ---------------- --autotest: dovada pe copii temporare ----------------
MUTANTI_VECHI = [   # (nume, fișierul din simulatoarele VECHI, textul exact, înlocuirea) — greșeli de reparator grăbit
    ("copia se numește „- Copiere”", "lectii/_sim/explorer-operatii.js", "let n=b+' - Copie'+e,i=2;", "let n=b+' - Copiere'+e,i=2;"),
    ("al doilea folder nou nu primește (2)", "lectii/_sim/explorer-operatii.js", "let n=b+e,i=2;while(exista(M,d+n+(folder?'/':'')))n=b+' ('+(i++)+')'+e;return n;",
     "let n=b+e,i=2;return n;"),
    ("Shift+Delete nu mai întreabă", "lectii/_sim/explorer-operatii.js", "if(definitiv||peStick(M,p)){", "if(peStick(M,p)){"),
    ("„Se omite” înlocuiește", "lectii/_sim/explorer-operatii.js", "else if(k==='omite')mesaj(", "else if(k==='omite')inlocuieste(s,d),mesaj("),
    ("restaurarea lasă fișierul și în Coș", "lectii/_sim/explorer-operatii.js", "s.cos.splice(k,1);s.rest.add(e.orig);", "s.rest.add(e.orig);"),
    ("butonul ferestrei de conflict redenumit", "lectii/_sim/explorer-operatii.js", "Se omite acest fișier</button>", "Omite fișierul</button>"),
    ("titlul ferestrei de conflict schimbat", "lectii/_sim/explorer-operatii.js", "${tit('Înlocuire sau omitere fișiere')}", "${tit('Înlocuire fișiere')}"),
]
MUTANTI_JUCARIE = [
    ("jucăria: copia se numește „- Copy”", "aplicatii/aplicatii.js", "let x=b+' - Copie'+e,i=2;", "let x=b+' - Copy'+e,i=2;"),
    ("jucăria: Lipirea peste un nume existent nu mai întreabă", "aplicatii/aplicatii.js", "if(M.F.has(d+n)){dialog(", "if(false){dialog("),
]
# Ecranul ≠ starea (reparația 10): modelul se schimbă la tastare, dar ecranul NU se redesenează — stare() spune adevărul,
# elevul vede altceva. Doar comparația cu ecranul îi prinde.
MUTANTI_ECRAN = [
    ("jucăria Word: tastarea schimbă modelul fără redesenare", "aplicatii/aplicatii.js",
     "I.M.paragrafe[I.M.paragrafe.length-1]+=e.key;I.ultimaActiune='scriere';I.desen()}",
     "I.M.paragrafe[I.M.paragrafe.length-1]+=e.key;I.ultimaActiune='scriere'}"),
    ("jucăria Excel: tastarea schimbă celula fără redesenare", "aplicatii/aplicatii.js",
     "I.M.cel[I.M.act]=(I.M.cel[I.M.act]||'')+e.key;I.ultimaActiune='scriere';I.desen()}",
     "I.M.cel[I.M.act]=(I.M.cel[I.M.act]||'')+e.key;I.ultimaActiune='scriere'}"),
]
# Două scenarii-jucărie pentru proba ecranului. „Realul” lor e starea jucăriei CURATE, citită la o primă rulare (aici
# se probează DOAR comparația stare/ecran, nu fidelitatea), deci linia de bază trebuie 0 oricum ar arăta jucăria.
SCEN_ECRAN = {
    "o4ecran-word": {"id": "o4ecran-word", "aplicatie": "word", "mod": "gest_real", "start": {"paragrafe": ["Ana are mere."]},
                     "pasi": [{"gest": "tasteaza", "text": "x"}], "stare_citita": ["text"]},
    "o4ecran-excel": {"id": "o4ecran-excel", "aplicatie": "excel", "mod": "gest_real", "start": {},
                      "pasi": [{"gest": "clic", "celula": "B2"}, {"gest": "tasteaza", "text": "9"}], "stare_citita": ["celule"]},
}


def ruleaza_copie(rad, iesire, extra_env=None, args=()):
    env = dict(os.environ, LH_RADACINA=str(rad), LH_IESIRE=str(iesire), PYTHONDONTWRITEBYTECODE="1")
    env.pop("LH_PAGINI", None)
    env.update(extra_env or {})
    p = subprocess.run([sys.executable, str(Path(__file__).resolve()), *args], capture_output=True, text=True,
                       encoding="utf-8", errors="replace", env=env, timeout=1800)
    linii = [x for x in p.stdout.splitlines() if x.strip()]
    try:
        return int(linii[-1]), p.returncode, linii
    except Exception:
        return None, p.returncode, linii + p.stderr.splitlines()[-5:]


def pagini_explorer():
    inv = citeste_json(INVENTAR)
    return ",".join(p["pagina"] for p in inv.get("pagini", []) if "explorer" in (p.get("aplicatii") or []) or p.get("aplicatia_principala") == "explorer")


def autotest():
    """Pe scenariile Explorer (singurele cu adaptor pe simulatoarele vechi): copia nemutată a simulatoarelor vechi dă >0
    (diferențele lor reale); fiecare greșeală plantată în ea urcă numărul; jucăria (biblioteca falsă care respectă
    contractul) dă 0; greșelile plantate în jucărie urcă numărul."""
    tmp = Path(tempfile.mkdtemp(prefix="lh_o4_"))
    neprinse, linii_rap = 0, []
    ex = {"LH_PAGINI": pagini_explorer()}
    try:
        vechi = tmp / "vechi"
        for sub in ("lectii/_sim", "lectii/v", "jocuri/_motor"):
            shutil.copytree(RAD / sub, vechi / sub, ignore=shutil.ignore_patterns("_proba", "_verificare", "*.png", "*.jpg", "*.webm"))
        b0, c0, l0 = ruleaza_copie(vechi, tmp / "i0", ex)
        print("  copia nemutată (simulatoarele vechi), scenariile Explorer: %s probleme (cod %s)" % (b0, c0), flush=True)
        if b0 is None:
            print("\n".join(l0[-8:]))
            raise RuntimeError("oracolul n-a dat un număr pe copia nemutată")
        for k, (nume, rel, din, in_) in enumerate(MUTANTI_VECHI):
            f = vechi / rel
            txt = f.read_text(encoding="utf-8")
            if txt.count(din) != 1:
                print("  RĂU  mutantul „%s”: textul apare de %d ori" % (nume, txt.count(din)))
                neprinse += 1
                continue
            f.write_text(txt.replace(din, in_), encoding="utf-8")
            try:
                n, c, _ = ruleaza_copie(vechi, tmp / ("m%d" % k), ex)
            finally:
                f.write_text(txt, encoding="utf-8")
            prins = n is not None and n > b0
            neprinse += not prins
            linii_rap.append((nume, b0, n))
            print("  %s  mutant „%s”: %s -> %s %s" % ("ok " if prins else "RĂU", nume, b0, n, "PRINS" if prins else "SCĂPAT"), flush=True)
        # biblioteca-jucărie: drumul „biblioteca” al rulatorului merge și dă mai puțin decât simulatoarele vechi
        juc = tmp / "jucarie"
        (juc / "aplicatii").mkdir(parents=True)
        for x in ("aplicatii.js", "poligon.html"):
            shutil.copy2(AICI / "_jucarie" / x, juc / "aplicatii" / x)
        bj, cj, lj = ruleaza_copie(juc, tmp / "j0", ex)
        okj = bj == 0
        print("  %s  biblioteca-jucărie (contractul api_biblioteca.md), scenariile Explorer: %s probleme (așteptat 0)%s"
              % ("ok " if okj else "RĂU", bj, "" if okj else " — " + " | ".join(x for x in lj if "RĂU" in x)[:600]), flush=True)
        neprinse += not okj
        for k, (nume, rel, din, in_) in enumerate(MUTANTI_JUCARIE):
            f = juc / rel
            txt = f.read_text(encoding="utf-8")
            if txt.count(din) != 1:
                print("  RĂU  mutantul „%s”: textul apare de %d ori" % (nume, txt.count(din)))
                neprinse += 1
                continue
            f.write_text(txt.replace(din, in_), encoding="utf-8")
            try:
                n, c, _ = ruleaza_copie(juc, tmp / ("mj%d" % k), ex)
            finally:
                f.write_text(txt, encoding="utf-8")
            prins = n is not None and bj is not None and n > bj
            neprinse += not prins
            print("  %s  mutant „%s”: %s -> %s %s" % ("ok " if prins else "RĂU", nume, bj, n, "PRINS" if prins else "SCĂPAT"), flush=True)
        # ecranul ≠ starea: jucăria curată pe cele 2 scenarii-jucărie -> 0; modelul schimbat fără redesenare -> > 0
        sc, re_ = tmp / "ecran_scenarii", tmp / "ecran_reale"
        sc.mkdir()
        re_.mkdir()
        for sid, scen in SCEN_ECRAN.items():
            (sc / (sid + ".json")).write_text(json.dumps(scen, ensure_ascii=False), encoding="utf-8")
        arg = ("--scenarii", str(sc), "--reale", str(re_))
        ruleaza_copie(juc, tmp / "e_cal", None, arg)   # calibrarea: starea jucăriei curate devine „realul” scenariilor-jucărie
        for sid in SCEN_ECRAN:
            f_sim = tmp / "e_cal" / "_sim" / (sid + ".json")
            st = citeste_json(f_sim).get("stare") if f_sim.exists() else None
            if st:
                (re_ / (sid + ".json")).write_text(json.dumps({"id": sid, "mod_probat": True, "stare": st, "eroare": None,
                                                               "cum": "scenariu-jucărie al autotestului O4 (starea jucăriei curate)"},
                                                              ensure_ascii=False), encoding="utf-8")
        be, ce, le = ruleaza_copie(juc, tmp / "e0", None, arg)
        oke = be == 0
        neprinse += not oke
        print("  %s  ecranul = starea pe jucăria curată (2 scenarii-jucărie, Word + Excel): %s probleme (așteptat 0)%s"
              % ("ok " if oke else "RĂU", be, "" if oke else " — " + " | ".join(x for x in le if "RĂU" in x)[:600]), flush=True)
        for k, (nume, rel, din, in_) in enumerate(MUTANTI_ECRAN):
            f = juc / rel
            txt = f.read_text(encoding="utf-8")
            if txt.count(din) != 1:
                print("  RĂU  mutantul „%s”: textul apare de %d ori" % (nume, txt.count(din)))
                neprinse += 1
                continue
            f.write_text(txt.replace(din, in_), encoding="utf-8")
            try:
                n, c, ln = ruleaza_copie(juc, tmp / ("me%d" % k), None, arg)
            finally:
                f.write_text(txt, encoding="utf-8")
            prins = n is not None and be is not None and n > be and any("pe ECRAN" in x for x in ln)
            neprinse += not prins
            print("  %s  mutant „%s”: %s -> %s %s" % ("ok " if prins else "RĂU", nume, be, n, "PRINS" if prins else "SCĂPAT"), flush=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print("Autotest O4: %d mutanți pe simulatoarele vechi + %d pe jucărie + %d ecran≠stare; neprinși / verificări picate: %d"
          % (len(MUTANTI_VECHI), len(MUTANTI_JUCARIE), len(MUTANTI_ECRAN), neprinse))
    print("(autotestul nu scrie detalii; copiile temporare au fost șterse)")
    print(neprinse)
    return neprinse


def main():
    ap = argparse.ArgumentParser(description="O4: scenariile jucate în simulator vs. aplicația reală")
    ap.add_argument("--scenarii", default=str(D / "scenarii"))
    ap.add_argument("--reale", default=str(D / "referinte" / "scenarii_real"))
    ap.add_argument("--autotest", action="store_true")
    a = ap.parse_args()
    if a.autotest:
        return 1 if autotest() else 0
    rez, plecate = masoara(a.scenarii, a.reale)
    return 1 if rezuma(rez, plecate, a.scenarii) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except BaseException:
        traceback.print_exc()
        print("PRĂBUȘIRE (nu e un număr de probleme)")
        sys.exit(2)
