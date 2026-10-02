"""Proba ȘCOLII RECUNOSCUTE și a CORECTURII făcute de elev (assets/js/prezenta.js + teste-elevi progres.mjs, 02.10.2026).

Contract: C:\\00\\AI_0\\projects\\teste-elevi\\contracte\\2026-10-02_alta_scoala_corectura\\contract.md (R1, R2, R6, R7, R8).
    python proba_corectura.py              -> LearningHub de pe disc, progresul pe progres.mjs REAL (node, magazin în memorie)

A. „Altă școală” cu o școală din listă scrisă de mână (cele 4 texte reale de pe server + 4 variante) -> formularul îi
   alege școala (și clasa, dacă o recunoaște) și NU îl înscrie la „Altă școală”; 4 școli străine rămân „Altă școală”;
   cine alege din nou „Altă școală” după recunoaștere e lăsat acolo.
C. Elevul înscris cu numele greșit: „Mi-am scris greșit…” -> codul greșit nu schimbă nimic (și se numără); codul bun ->
   formularul completat -> „Salvează”: același id, numele nou, progresul rămas pe calculator, mutat online sub amprenta
   nouă (al doilea aparat îl primește cu numele corect), numele vechi nu mai intră; la profesor pleacă același id cu
   numele nou. Numele corect deja pe calculator cu alt cod: refuzat. Elevul fără cod: întâi își alege codul.
   Serverul: refuzurile din redenumeste() (amprentă veche mutată, amprentă nouă mutată de profesor, aceeași amprentă).
Regula 24: tot ce nu e 127.0.0.1 se abandonează; /api/activitate și /api/progres sunt simulate local (nimic pe serverul
viu). Ultima linie = numărul de probleme.
"""
import json
import os
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

from playwright.sync_api import sync_playwright

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = r"C:\00\Projects\LearningHub"
SITE_TESTE = r"C:\00\AI_0\projects\teste-elevi\site\netlify"
TOOLS = r"C:\00\AI_0\tools"
P_SIT, P_NOR = 18821, 18822          # porturi rare, verificate libere (altfel proba ar vorbi cu altcineva)
SIT = "http://127.0.0.1:%d" % P_SIT
NOR = "http://127.0.0.1:%d" % P_NOR
PAGE = SIT + "/lectii/v/m1-l02/"
probleme = []
oprite, erori, activ = [], [], []


def ok(cond, ce, detalii=""):
    print(("  ok   " if cond else "  RĂU  ") + ce + (("  — " + str(detalii)[:300]) if detalii and not cond else ""))
    if not cond:
        probleme.append(ce)


def port_liber(port):
    with socket.socket() as s:
        s.settimeout(0.3)
        if s.connect_ex(("127.0.0.1", port)) == 0:
            sys.exit("Portul %d e ocupat: proba nu pornește (altfel ar vorbi cu alt proces)." % port)


def asteapta_port(port):
    for _ in range(100):
        try:
            socket.create_connection(("127.0.0.1", port), 0.2).close()
            return
        except OSError:
            time.sleep(0.1)
    sys.exit("Serverul de pe %d nu pornește." % port)


# ---------- serverul de progres: progres.mjs ADEVĂRAT, cu magazinul în memorie ----------
def porneste_nor(tmp):
    url = lambda p: "file:///" + p.replace("\\", "/")  # noqa: E731
    lib = os.path.join(SITE_TESTE, "lib")
    src = open(os.environ.get("PROBA_PROGRES") or os.path.join(SITE_TESTE, "functions", "progres.mjs"), encoding="utf-8").read()
    src = src.replace('"../lib/store.mjs"', '"./store_fals.mjs"').replace('"../lib/unire.mjs"', '"%s"' % url(os.path.join(lib, "unire.mjs")))
    open(os.path.join(tmp, "progres_copie.mjs"), "w", encoding="utf-8").write(src)
    open(os.path.join(tmp, "store_fals.mjs"), "w", encoding="utf-8").write(
        'export { K, raspuns } from "%s";\n' % url(os.path.join(lib, "store.mjs")) +
        "const M = globalThis.__MEM;\n"
        "export const get = async (k) => (M.has(k) ? JSON.parse(JSON.stringify(M.get(k))) : null);\n"
        "export const set = async (k, v) => { M.set(k, JSON.parse(JSON.stringify(v))); };\n"
        "export const store = () => ({ list: async ({ prefix }) => ({ blobs: [...M.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }) });\n")
    open(os.path.join(tmp, "server.mjs"), "w", encoding="utf-8").write(
        'import http from "node:http";\n'
        "globalThis.__MEM = new Map();\n"
        'const { default: handler } = await import("./progres_copie.mjs");\n'
        "http.createServer(async (req, res) => {\n"
        '  let body = ""; for await (const c of req) body += c;\n'
        '  if (req.url === "/_dump") { res.end(JSON.stringify(Object.fromEntries(globalThis.__MEM))); return; }\n'
        '  if (req.url === "/_set") { const x = JSON.parse(body); globalThis.__MEM.set(x.k, x.v); res.end("{}"); return; }\n'
        '  const r = await handler(new Request("http://x/api/progres", { method: req.method, body: req.method === "POST" ? body : undefined }));\n'
        "  res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(await r.text());\n"
        "}).listen(%d, \"127.0.0.1\");\n" % P_NOR)
    p = subprocess.Popen(["node", os.path.join(tmp, "server.mjs")], cwd=tmp, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    asteapta_port(P_NOR)
    return p


def nor_post(cale, corp):
    req = urllib.request.Request(NOR + cale, data=json.dumps(corp).encode(), method="POST")
    try:
        r = urllib.request.urlopen(req, timeout=10)
        return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def dump():
    return json.loads(urllib.request.urlopen(NOR + "/_dump", timeout=10).read())


# ---------- browserul ----------
def ruta_toate(route):
    u = route.request.url
    if u.startswith(("http://127.0.0.1", "http://localhost", "data:", "blob:")):
        return route.continue_()
    oprite.append(u)
    return route.abort()


def ruta_activ(route):
    try:
        activ.append(json.loads(route.request.post_data or "{}"))
    except ValueError:
        pass
    route.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*", "content-type": "application/json"})


def ruta_nor(route):
    req = urllib.request.Request(NOR + "/api/progres", data=(route.request.post_data or "").encode(), method="POST")
    try:
        r = urllib.request.urlopen(req, timeout=10)
        st, body = r.status, r.read()
    except urllib.error.HTTPError as e:
        st, body = e.code, e.read()
    route.fulfill(status=st, body=body, headers={"access-control-allow-origin": "*", "content-type": "application/json"})


def aparat(br):
    ctx = br.new_context(viewport={"width": 1100, "height": 900})
    ctx.route("**/*", ruta_toate)                 # întâi: tot ce nu e local se abandonează
    ctx.route("**/api/activitate", ruta_activ)    # rutele de după au întâietate
    ctx.route("**/api/progres", ruta_nor)
    if os.environ.get("PROBA_PREZENTA"):          # mutanții: altă copie a scriptului, servită în locul celui de pe disc
        ctx.route("**/assets/js/prezenta.js*", lambda r: r.fulfill(status=200, path=os.environ["PROBA_PREZENTA"],
                                                                     headers={"content-type": "application/javascript"}))
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: erori.append(str(e)))
    pg.goto(PAGE)
    pg.wait_for_timeout(800)
    return ctx, pg


def eu(pg):
    s = pg.evaluate("localStorage.getItem('lh_prezenta')")
    return json.loads(s) if s else {}


def formular(pg):
    pg.mouse.click(5, 5)
    pg.wait_for_timeout(300)
    for sel in ["#lhp-cine", "#lhp-cere", "#lhp-nimeni", "text=Spune cine ești"]:
        if pg.locator(sel).count():
            pg.locator(sel).first.click()
            break
    if pg.locator("#lhp-nou").count():
        pg.click("#lhp-nou")
    pg.wait_for_function("document.querySelector('#lhp-s') && document.querySelector('#lhp-s').options.length > 2", timeout=8000)


def asteapta_inscris(pg, nume):
    pg.wait_for_function("n=>{try{return JSON.parse(localStorage.getItem('lh_prezenta')).nume===n}catch(e){return false}}", arg=nume, timeout=12000)
    pg.wait_for_timeout(1500)                     # progresul (trage / impinge) și reîncărcarea, dacă e
    pg.wait_for_load_state()


def inscrie(pg, sc, cl, nume, cod):
    formular(pg)
    pg.select_option("#lhp-s", sc)
    pg.select_option("#lhp-c", cl)
    pg.fill("#lhp-n", nume)
    pg.fill("#lhp-k", cod)
    pg.click("#lhp-ok")
    asteapta_inscris(pg, nume)


def deschide_corectura(pg):
    pg.wait_for_selector("#lhp-pill", timeout=8000)
    pg.click("#lhp-pill")
    pg.wait_for_selector("#lhp-corect", timeout=5000)
    pg.click("#lhp-corect")


# ---------- A ----------
RECUNOSCUTE = [   # (numele școlii, localitatea, clasa scrisă) -> (școala, clasa aleasă de formular; "" = n-o ghicește)
    ("Victor Brauner", "Neamt", "5 AM", "brauner", "5 AM"),                                               # real: Zegrea
    ("Liceul de artă Victor Brauner", "Piatra-Neamț Gheorghe Asaki numărul 2", "a-5-a AM", "brauner", "5 AM"),  # real: Miron
    ("Școala gimnazială Nr 2 izvoare", "Dumbrava roșie jud neamt", "Clasa a VI a", "dumbrava", "VI"),    # real: Sava
    ("Școala Gimnazială Nr 1", "Izvoare", "a IV -a", "dumbrava", ""),                                    # real: Nicorescu
    ("LICEUL DE ARTE BRAUNER", "Piatra Neamt", "9 m", "brauner", "9 M"),
    ("scoala izvoare", "neamt", "8", "dumbrava", "VIII"),
    ("Școala Gimnazială Tupilați", "Tupilați, Neamț", "a VII-a", "tupilati", "VII"),
    ("Scoala Tibucani", "Tibucani", "6", "tibucani", "VI"),
]
STRAINE = [
    ("Școala Gimnazială Nr. 3", "Piatra Neamț", "a VI-a B"),
    ("Liceul de Artă", "Iași", "a 9-a A"),
    ("Colegiul Național Petru Rareș", "Piatra Neamț", "IX B"),
    ("Școala Gimnazială Dumbrava", "Dumbrava, Iași", "V"),
]


def scrie_alta(pg, sc_txt, loc, cl, nume="Proba Corectura", cod="1234"):
    formular(pg)
    pg.select_option("#lhp-s", "alta")
    pg.fill("#lhp-as", sc_txt)
    pg.fill("#lhp-al", loc)
    pg.fill("#lhp-ac", cl)
    pg.fill("#lhp-n", nume)
    pg.fill("#lhp-k", cod)
    pg.click("#lhp-ok")
    pg.wait_for_timeout(700)


def parte_a(br):
    print("A. Școala scrisă de mână care e în listă")
    for sc_txt, loc, cl, sc, cl_ast in RECUNOSCUTE:
        ctx, pg = aparat(br)
        try:
            scrie_alta(pg, sc_txt, loc, cl)
            ales_s, ales_c = pg.input_value("#lhp-s"), pg.input_value("#lhp-c")
            msg = pg.text_content("#lhp-e") or ""
            ok(not eu(pg) and ales_s == sc and ales_c == cl_ast and "Școala ta e în listă" in msg,
               "R1 %r / %r / %r -> nu se înscrie încă; școala %s, clasa %r aleasă, mesajul spune" % (sc_txt, loc, cl, sc, cl_ast),
               (eu(pg), ales_s, ales_c, msg))
            if not cl_ast:
                pg.click("#lhp-ok")
                pg.wait_for_timeout(500)
                ok(not eu(pg) and "Alege școala și clasa" in (pg.text_content("#lhp-e") or ""),
                   "R1 clasa nerecunoscută (%r): nu ghicește, cere clasa" % cl)
                pg.select_option("#lhp-c", "VI")
                cl_ast = "VI"
            pg.click("#lhp-ok")
            asteapta_inscris(pg, "Proba Corectura")
            e = eu(pg)
            ok(e.get("scoala") == sc and e.get("clasa") == cl_ast and not e.get("scoalaText"),
               "R1 a doua apăsare pe „Gata” -> înscris la %s · %s (nu la „Altă școală”)" % (sc, cl_ast), e)
        finally:
            ctx.close()
    for sc_txt, loc, cl in STRAINE:
        ctx, pg = aparat(br)
        try:
            scrie_alta(pg, sc_txt, loc, cl)
            asteapta_inscris(pg, "Proba Corectura")
            e = eu(pg)
            ok(e.get("scoala") == "alta" and (e.get("scoalaText") or "").startswith(sc_txt),
               "R2 %r (%s) rămâne la „Altă școală”" % (sc_txt, loc), e)
        finally:
            ctx.close()
    ctx, pg = aparat(br)   # insistă: e chiar din altă școală, deși a scris „Brauner” (ex. alt liceu cu același nume)
    try:
        scrie_alta(pg, "Victor Brauner", "Neamt", "5 AM")
        pg.select_option("#lhp-s", "alta")
        pg.click("#lhp-ok")
        asteapta_inscris(pg, "Proba Corectura")
        ok(eu(pg).get("scoala") == "alta", "R2 cine alege din nou „Altă școală” după recunoaștere rămâne acolo", eu(pg))
    finally:
        ctx.close()


# ---------- C ----------
GRESIT, CORECT, COD = "Zegrea Serafma", "Zegrea Serafima", "2468"


def nume_activ(enc):
    sys.path.insert(0, TOOLS)
    import diplome
    return diplome.deschide_nume(diplome.cheie_privata(), enc)


def parte_c(br):
    print("C. Corectura făcută de elev")
    ctx1, pg = aparat(br)
    inscrie(pg, "brauner", "5 AM", GRESIT, COD)
    e0 = eu(pg)
    prof = pg.evaluate("localStorage.getItem('learninghub_active_profile')")
    cheie = "joc_proba-corectura@" + prof
    pg.evaluate("([k])=>localStorage.setItem(k, JSON.stringify({nume:'Proba',lv:{0:{stars:3,xp:10},1:{stars:2,xp:5}}}))", [cheie])
    ok(e0.get("h") and e0.get("id") and prof, "C0 înscris cu numele greșit, cu cod, cu profil", e0)

    # R6: codul greșit nu schimbă nimic și se numără
    deschide_corectura(pg)
    pg.wait_for_selector("#lhp-pc", timeout=5000)
    pg.fill("#lhp-pc", "1111")
    pg.click("#lhp-ok")
    pg.wait_for_timeout(500)
    g = json.loads(pg.evaluate("localStorage.getItem('lh_cod_gresit')") or "{}")
    ok("Cod greșit" in (pg.text_content("#lhp-e") or "") and eu(pg) == e0 and g.get("n") == 1 and not pg.locator("#lhp-n").count(),
       "R6 cod greșit: mesaj, nimic schimbat, greșeala numărată, fără formular", (pg.text_content("#lhp-e"), g))
    # R6: codul bun -> formularul completat cu ce scrisese
    pg.fill("#lhp-pc", COD)
    pg.click("#lhp-ok")
    pg.wait_for_function("()=>document.querySelector('#lhp-n') && document.querySelector('#lhp-n').value.length>0", timeout=8000)
    ok(pg.input_value("#lhp-s") == "brauner" and pg.input_value("#lhp-c") == "5 AM" and pg.input_value("#lhp-n") == GRESIT
       and not pg.locator("#lhp-k").count() and pg.evaluate("localStorage.getItem('lh_cod_gresit')") is None,
       "R6 cod bun: formularul de corectură, completat (Brauner · 5 AM · numele greșit), fără câmp de cod, greșelile șterse")
    # „Salvează” fără nicio schimbare
    pg.click("#lhp-ok")
    pg.wait_for_timeout(400)
    ok("N-ai schimbat nimic" in (pg.text_content("#lhp-e") or ""), "R6 fără schimbare: spune, nu trimite nimic")
    n_activ = len(activ)
    pg.fill("#lhp-n", CORECT)
    pg.click("#lhp-ok")
    pg.wait_for_selector("#lhp-bine2", timeout=15000)
    e1 = eu(pg)
    ok(e1.get("nume") == CORECT and e1.get("id") == e0["id"] and e1.get("h") and e1["h"] != e0["h"] and e1.get("clasa") == "5 AM",
       "R7 după „Salvează”: același id, numele corect, amprentă nouă", e1)
    stele = pg.evaluate("([k])=>{const p=localStorage.getItem('learninghub_active_profile');return [p, localStorage.getItem(k)]}", [cheie])
    ok(stele[0] == prof and stele[1] and '"stars":3' in stele[1], "R7 progresul de pe calculator e tot acolo, pe același profil", stele)
    lista = json.loads(pg.evaluate("localStorage.getItem('lh_elevi_pc')") or "[]")
    ok([x["nume"] for x in lista] == [CORECT], "R7 lista calculatorului: doar numele corect", [x.get("nume") for x in lista])
    d = dump()
    nou, vechi = d.get("progres/" + e1["h"]) or {}, d.get("progres/" + e0["h"]) or {}
    v = ((nou.get("date") or {}).get("joc_proba-corectura@~P") or {}).get("v") or ""
    ok('"stars":3' in v and e0["id"] in (nou.get("ids") or []), "R7 online: progresul e sub amprenta nouă, legat de id", list((nou.get("date") or {}).keys()))
    ok(vechi.get("mutatIn") == e1["h"] and vechi.get("corectat") is True, "R7 online: amprenta veche e mutată, cu corectat", vechi)
    pg.wait_for_timeout(800)
    trimise = [x for x in activ[n_activ:] if x.get("id") == e0["id"]]
    ok(trimise and nume_activ(trimise[-1]["numeEnc"]) == CORECT and trimise[-1].get("clasa") == "5 AM" and trimise[-1].get("scoala") == "brauner",
       "R8 la profesor pleacă ACEEAȘI înregistrare (același id) cu numele corect", trimise[-1:] and {k: trimise[-1].get(k) for k in ("id", "scoala", "clasa")})
    pg.click("#lhp-bine2")

    # R7: alt aparat, numele corect + același cod -> își găsește progresul
    ctx2, pg2 = aparat(br)
    inscrie(pg2, "brauner", "5 AM", CORECT, COD)
    v2 = pg2.evaluate("()=>{const p=localStorage.getItem('learninghub_active_profile');return localStorage.getItem('joc_proba-corectura@'+p)}")
    ok(v2 and '"stars":3' in v2, "R7 al doilea aparat, numele corect + același cod: progresul a venit", v2)
    # R7: al treilea aparat, numele VECHI + codul -> nu mai intră, cu motivul
    ctx3, pg3 = aparat(br)
    formular(pg3)
    pg3.select_option("#lhp-s", "brauner")
    pg3.select_option("#lhp-c", "5 AM")
    pg3.fill("#lhp-n", GRESIT)
    pg3.fill("#lhp-k", COD)
    pg3.click("#lhp-ok")
    pg3.wait_for_timeout(2000)
    ok(not eu(pg3) and "au fost corectate" in (pg3.text_content("#lhp-e") or ""), "R7 numele vechi + codul: nu mai intră, spune că s-a corectat",
       pg3.text_content("#lhp-e"))
    # pe primul aparat, dacă ar fi rămas cineva pe numele vechi: iese cu mesajul de corectură (Nor.trage pe amprenta mutată)
    st, j = nor_post("/api/progres", {"op": "citeste", "h": e0["h"]})
    ok(j.get("mutat") is True and j.get("corectat") is True, "R7 serverul spune despre amprenta veche: mutat + corectat", j)
    st, j = nor_post("/api/progres", {"op": "stare", "h": "e" * 64})
    ok(list(j.keys()) == ["ok", "cerere", "mutat"] and j["mutat"] is False, "I1 „stare” pe o amprentă oarecare: exact răspunsul de dinainte", j)
    for c in (ctx3, ctx2):
        c.close()

    # numele corect e deja pe calculator, cu alt cod -> refuzat
    ctx4, pg4 = aparat(br)
    inscrie(pg4, "brauner", "5 AM", "Pop Ana", "1357")
    pg4.click("#lhp-pill")
    pg4.wait_for_selector("#lhp-alt", timeout=5000)
    pg4.click("#lhp-alt")
    pg4.wait_for_selector("#lhp-nou", timeout=5000)
    pg4.click("#lhp-nou")
    pg4.wait_for_function("document.querySelector('#lhp-s') && document.querySelector('#lhp-s').options.length > 2", timeout=8000)
    pg4.select_option("#lhp-s", "brauner")
    pg4.select_option("#lhp-c", "5 AM")
    pg4.fill("#lhp-n", "Ionescu Dan")
    pg4.fill("#lhp-k", "9999")
    pg4.click("#lhp-ok")
    asteapta_inscris(pg4, "Ionescu Dan")
    e4 = eu(pg4)
    deschide_corectura(pg4)
    pg4.fill("#lhp-pc", "9999")
    pg4.click("#lhp-ok")
    pg4.wait_for_function("()=>document.querySelector('#lhp-n') && document.querySelector('#lhp-n').value.length>0", timeout=8000)
    pg4.fill("#lhp-n", "Pop Ana")
    pg4.click("#lhp-ok")
    pg4.wait_for_timeout(1500)
    ok("e deja Pop Ana, cu alt cod" in (pg4.text_content("#lhp-e") or "") and eu(pg4) == e4,
       "GRAV-1 corectura în numele unui coleg de pe calculator (alt cod): refuzată, nimic schimbat", pg4.text_content("#lhp-e"))
    # A în corectură: „Altă școală” cu „Brauner” scris -> îi alege școala
    pg4.select_option("#lhp-s", "alta")
    pg4.fill("#lhp-as", "Victor Brauner")
    pg4.fill("#lhp-al", "Neamt")
    pg4.fill("#lhp-ac", "5 AM")
    pg4.fill("#lhp-n", "Ionescu Dan Mihai")
    pg4.click("#lhp-ok")
    pg4.wait_for_timeout(500)
    ok(pg4.input_value("#lhp-s") == "brauner" and "Școala ta e în listă" in (pg4.text_content("#lhp-e") or ""),
       "R1 și în corectură: „Altă școală” + „Brauner” -> școala din listă")
    ctx4.close()

    # elevul fără cod (de dinainte de coduri): întâi își alege codul
    ctx5, pg5 = aparat(br)
    inscrie(pg5, "brauner", "5 AM", "Farachod Ion", "4321")
    pg5.evaluate("()=>{const e=JSON.parse(localStorage.getItem('lh_prezenta'));delete e.h;localStorage.setItem('lh_prezenta',JSON.stringify(e))}")
    pg5.reload()
    pg5.wait_for_timeout(800)
    deschide_corectura(pg5)
    pg5.wait_for_timeout(300)
    ok("Întâi alege-ți un cod" in (pg5.inner_text("body") or "") and not pg5.locator("#lhp-pc").count(),
       "R6 elevul fără cod: întâi își alege codul (nimic nu se corectează fără cod)")
    ctx5.close()
    ctx1.close()


def parte_server():
    print("Server: refuzurile din redenumeste()")
    a, b, c = "a" * 64, "b" * 64, "c" * 64
    st, j = nor_post("/api/progres", {"op": "redenumeste", "h": a, "la": a})
    ok(st == 400, "aceeași amprentă -> 400", (st, j))
    nor_post("/_set", {"k": "progres/" + a, "v": {"date": {}, "prima": "2026-10-01T00:00:00Z", "mutatIn": b, "mutat": "x"}})
    st, j = nor_post("/api/progres", {"op": "redenumeste", "h": a, "la": c})
    ok(st == 409 and j.get("motiv") == "mutat", "amprenta veche deja mutată (cod scos) -> 409 mutat", (st, j))
    d1, d2 = "d" * 64, "f" * 64
    nor_post("/_set", {"k": "progres/" + d2, "v": {"date": {}, "prima": "2026-10-01T00:00:00Z", "mutatIn": "9" * 64, "mutat": "x"}})
    st, j = nor_post("/api/progres", {"op": "redenumeste", "h": d1, "la": d2})
    ok(st == 409 and j.get("motiv") == "alt-cod", "amprenta nouă mutată de PROFESOR (deblocare) -> 409 alt-cod", (st, j))
    # înapoi la un nume corectat mai devreme: voie (corectura elevului se poate întoarce), cu unirea pe niveluri
    lv = lambda s: json.dumps({"nume": "x", "lv": {"0": {"stars": s}}})  # noqa: E731
    e1, e2 = "1" * 64, "2" * 64
    nor_post("/_set", {"k": "progres/" + e1, "v": {"date": {"joc_x@~P": {"v": lv(1), "u": 5}}, "prima": "2026-10-01T00:00:00Z",
                                                   "mutatIn": e2, "mutat": "x", "corectat": True}})
    nor_post("/_set", {"k": "progres/" + e2, "v": {"date": {"joc_x@~P": {"v": lv(3), "u": 1}}, "prima": "2026-10-01T00:00:00Z"}})
    st, j = nor_post("/api/progres", {"op": "redenumeste", "h": e2, "la": e1, "id": "abcdefghij0123456789"})
    d = dump()
    ok(st == 200 and '"stars":3' in d["progres/" + e1]["date"]["joc_x@~P"]["v"] and "mutatIn" not in d["progres/" + e1]
       and d["progres/" + e2].get("mutatIn") == e1 and "progres-id/abcdefghij0123456789/" + e1 in d,
       "întoarcerea la numele de dinainte: voie; nivelul ia maximul (3 stele); legat de id", (st, j))


def main():
    port_liber(P_SIT)
    port_liber(P_NOR)
    tmp = tempfile.mkdtemp(prefix="proba_corectura_")
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(P_SIT), "--bind", "127.0.0.1"], cwd=ROOT,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    nor = None
    try:
        nor = porneste_nor(tmp)
        asteapta_port(P_SIT)
        with sync_playwright() as p:
            br = p.chromium.launch()
            try:
                parte_a(br)
                parte_c(br)
            except Exception as ex:
                ok(False, "proba din browser s-a oprit", str(ex).split("\n")[0][:300])
            br.close()
        parte_server()
    finally:
        srv.terminate()
        if nor:
            nor.terminate()
        shutil.rmtree(tmp, ignore_errors=True)
    ok(not erori, "0 erori JS în pagini", erori[:3])
    ok(not [u for u in oprite if "/api/" in u], "nicio cerere spre /api/ în afară de cele simulate local", [u for u in oprite if "/api/" in u][:3])
    print("(cereri externe abandonate: %d)" % len(oprite))
    print(len(probleme))
    sys.exit(1 if probleme else 0)   # pentru contractul selfcheck „corectura-elev-alta-scoala” (exit0)


if __name__ == "__main__":
    main()
