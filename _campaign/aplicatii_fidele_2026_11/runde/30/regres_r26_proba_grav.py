# -*- coding: utf-8 -*-
"""Proba rundei 26 (B-windows, unghiul stare_finala_erori): K1-K3 din runde/22/critic.md și drumurile de stare finală din
supliment_B_windows_runda26.md (S1-S6), pe poligon, cu gesturi ADEVĂRATE: page.keyboard, page.mouse, page.touchscreen.tap
(360 și 390 px), CDP Input.insertText / Input.imeSetComposition (textul trimis de o tastatură de telefon / IME).
Headless, rețeaua tăiată în afară de 127.0.0.1 (structura_lib.blocheaza_externe), server pe port liber.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/26/proba_grav.py [--eticheta pornire|final]
Ieșirea: runde/26/probe_iesiri/proba_grav_<eticheta>.json; ultima linie = verificări picate.
"""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
WT = D.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL      # noqa: E402  (doar citit)

IES = AICI / "probe_iesiri"
IES.mkdir(exist_ok=True)
REZ = {"verificari": [], "erori_js": [], "plecate": []}
ASCULTA = "window.__E=[];window.addEventListener('lh-aplicatie',e=>window.__E.push(JSON.parse(JSON.stringify(e.detail))));"
START = '.lh-w-bara [data-lh-id="Start"]'
CASETA_NUME = "Căutați aplicații, setări și documente"
CASETA = '.lh-w-cautare-st'
MESAJ = "(() => [...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.textContent))()"
TEXT_CAUT = "(() => { const t = document.querySelector('.lh-w-tx-caut'); return t ? t.textContent : null; })()"
REZULTATE = "(() => [...document.querySelectorAll('[data-lh-rezultat]')].map(e => e.getAttribute('data-lh-id')))()"
INDICIU = "(() => [...document.querySelectorAll('.lh-ap-indiciu')].filter(e => e.offsetParent).map(e => e.textContent))()"
FOCUS = """(() => { const a = document.activeElement; return a ? {tag: a.tagName, editabil: !!(a.matches && a.matches('input,textarea,[contenteditable=true]')),
  in_radacina: !!a.closest('[data-lh-aplicatie="windows"]'), clasa: a.className || ''} : null; })()"""
# ecranul = starea (unghiul stare_finala_erori): ce spune stare() se vede, ce se vede e în stare()
COERENTA = """(() => { const s = LH.aplicatii.stare('windows'), r = document.querySelector('[data-lh-aplicatie="windows"]'), d = [];
  const startVaz = !!r.querySelector('.lh-w-start');
  if (startVaz !== s.meniu_start_deschis) d.push('Start: stare=' + s.meniu_start_deschis + ' ecran=' + startVaz);
  const fv = [...r.querySelectorAll('.lh-w-fer')].map(e => e.getAttribute('data-lh-eticheta'));
  const fs = s.ferestre.filter(f => f.stare !== 'min').map(f => f.titlu);
  if (fv.slice().sort().join('|') !== fs.slice().sort().join('|')) d.push('ferestre: stare=' + fs + ' ecran=' + fv);
  const act = r.querySelector('.lh-w-fer.lh-w-activa'), sa = s.ferestre.find(f => f.activa);
  if ((act ? act.getAttribute('data-lh-eticheta') : null) !== (sa ? sa.titlu : null)) d.push('activa: stare=' + (sa && sa.titlu) + ' ecran=' + (act && act.getAttribute('data-lh-eticheta')));
  const apps = [...new Set(s.ferestre.map(f => f.aplicatie))];
  apps.forEach(a => { if (!r.querySelector('.lh-w-bara [data-lh-app="' + a + '"]')) d.push('bara fără butonul ' + a); });
  const meniu = r.querySelector('[data-lh-suprafata="meniu_desktop_nou"]') ? 'meniu_desktop_nou' :
    r.querySelector('[data-lh-suprafata="meniu_desktop_clasic"]') ? 'meniu_desktop_clasic' : r.querySelector('[data-lh-suprafata="meniu_desktop"]') ? 'meniu_desktop' : null;
  if (meniu !== s.meniu_deschis) d.push('meniu: stare=' + s.meniu_deschis + ' ecran=' + meniu);
  const pv = [...r.querySelectorAll('.lh-w-desk .lh-w-ico')].map(e => e.getAttribute('data-lh-id'));
  if (pv.slice().sort().join('|') !== s.pictograme_desktop.slice().sort().join('|')) d.push('pictograme: stare=' + s.pictograme_desktop + ' ecran=' + pv);
  return d; })()"""


def bifa(gr, nume, ok, dovada=None):
    REZ["verificari"].append({"grav": gr, "nume": nume, "ok": bool(ok), "dovada": dovada})
    print(("  OK   " if ok else "  PICĂ ") + gr + " " + nume + ("" if ok else "  <- " + json.dumps(dovada, ensure_ascii=False)[:300]))


def pagina(br, base, w=1366, h=768, continut=None, telefon=False):
    ctx = br.new_context(viewport={"width": w, "height": h}, has_touch=telefon, is_mobile=telefon)
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: REZ["erori_js"].append(str(e)[:200]))
    pg.on("request", lambda r: REZ["plecate"].append(r.url) if not r.url.startswith(("http://127.0.0.1", "http://localhost", "data:", "blob:")) else None)
    pg.goto(base + "aplicatii/poligon.html", wait_until="load")
    pg.evaluate(ASCULTA)
    pg.evaluate("c => LH.aplicatii.deschide('windows', {focus: true, continut: c})", continut or {})
    pg.wait_for_timeout(300)
    return pg


def st(pg):
    return pg.evaluate("LH.aplicatii.stare('windows')")


def ev(pg):
    return pg.evaluate("window.__E.splice(0)")


def scurt(evs):
    return [(e["gest"], e["actiune"], e["tinta"], e.get("activat")) for e in evs]


def cutie(pg, sel):
    loc = pg.locator(sel)
    return loc.first.bounding_box() if loc.count() else None


def centru(b):
    return (b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)


def clic(pg, sel):
    b = cutie(pg, sel)
    if not b:
        return False
    pg.mouse.click(*centru(b))
    pg.wait_for_timeout(150)
    return True


def atinge(pg, sel):
    b = cutie(pg, sel)
    if not b:
        return False
    pg.touchscreen.tap(*centru(b))
    pg.wait_for_timeout(250)
    return True


def tasteaza(pg, text):
    for ch in text:
        pg.keyboard.press(ch)
        pg.wait_for_timeout(40)
    pg.wait_for_timeout(120)


def coerent(pg, gr, nume):
    d = pg.evaluate(COERENTA)
    bifa(gr, nume + ": ecranul = stare()", not d, d)


def win_litera(pg, l):
    pg.keyboard.down("Meta")
    pg.wait_for_timeout(60)
    pg.keyboard.press(l)
    pg.wait_for_timeout(60)
    pg.keyboard.up("Meta")
    pg.wait_for_timeout(200)


# ---------------------------------------------------------------- K1: tasta Windows + E / D
def k1(br, base):
    for eticheta, cont in (("desktop gol", {}), ("cu o fereastră Explorer", {"ferestre": [{"aplicatie": "explorer", "titlu": "Acasă", "activa": True}]})):
        pg = pagina(br, base, continut=cont)
        ev(pg)
        win_litera(pg, "e")
        e = ev(pg)
        g = [x["gest"] for x in e]
        bifa("K1", "%s: Windows + E emite gestul win_e" % eticheta, "win_e" in g, scurt(e))
        bifa("K1", "%s: Windows + E NU mai emite ctrl_e" % eticheta, "ctrl_e" not in g, scurt(e))
        bifa("K1", "%s: după Windows + E, Start e închis" % eticheta, not st(pg)["meniu_start_deschis"], st(pg)["meniu_start_deschis"])
        m = pg.evaluate(MESAJ)
        bifa("K1", "%s: Windows + E dă mesajul central (nu tace)" % eticheta, any("Windows + E" in x for x in m), m)
        coerent(pg, "K1", "%s, după Windows + E" % eticheta)
        pg.context.close()
    pg = pagina(br, base, continut={"ferestre": [{"aplicatie": "explorer", "titlu": "Acasă", "activa": True}]})
    ev(pg)
    win_litera(pg, "d")
    e = ev(pg)
    g = [x["gest"] for x in e]
    bifa("K1", "Windows + D emite win_d, nu ctrl_d", "win_d" in g and "ctrl_d" not in g, scurt(e))
    bifa("K1", "după Windows + D, Start e închis", not st(pg)["meniu_start_deschis"], st(pg)["meniu_start_deschis"])
    m = pg.evaluate(MESAJ)
    bifa("K1", "Windows + D nu tace (mesajul central)", any("Windows + D" in x for x in m), m)
    coerent(pg, "K1", "după Windows + D")
    # tasta Windows singură: deschide și închide Start (regres)
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(150)
    a = st(pg)["meniu_start_deschis"]
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(150)
    b = st(pg)["meniu_start_deschis"]
    e = ev(pg)
    bifa("K1", "tasta Windows singură deschide Start, a doua apăsare îl închide", a and not b, [a, b, scurt(e)])
    # Ctrl + E rămâne ctrl_e
    pg.keyboard.press("Control+e")
    pg.wait_for_timeout(150)
    e = ev(pg)
    bifa("K1", "Ctrl + E pe Windows rămâne ctrl_e", [x["gest"] for x in e] == ["ctrl_e"], scurt(e))
    pg.context.close()


# ---------------------------------------------------------------- K2: asistentul pe drumul cu tastatura
def k2(br, base):
    def asist(drum, nume):
        pg = pagina(br, base)
        pg.evaluate("""() => { window.__as = LH.aplicatii.asistent('windows', {pasi: [{tinta: 'bara_activitati:Start', indiciu: 'Deschide Start'},
          {tinta: 'start:Paint', indiciu: 'Alege Paint'}], dupaGreseli: 2, dupaSecunde: 30}); }""")
        pg.wait_for_timeout(150)
        ev(pg)
        pasi = []
        for n, fn in drum(pg):
            fn()
            pg.wait_for_timeout(200)
            pasi.append([n, pg.evaluate("window.__as.pas()"), pg.evaluate(INDICIU)])
        e = ev(pg)
        pg.context.close()
        return pasi, e

    def tastatura(pg):
        return [("Win", lambda: pg.keyboard.press("Meta")), ("p", lambda: pg.keyboard.press("p")), ("a", lambda: pg.keyboard.press("a")),
                ("i", lambda: pg.keyboard.press("i")), ("Enter", lambda: pg.keyboard.press("Enter"))]

    def mouse(pg):
        return [("clic Start", lambda: clic(pg, START)), ("p", lambda: pg.keyboard.press("p")), ("a", lambda: pg.keyboard.press("a")),
                ("i", lambda: pg.keyboard.press("i")), ("clic Paint", lambda: clic(pg, '[data-lh-rezultat="0"]'))]

    pasi, e = asist(tastatura, "tastatura")
    bifa("K2", "drumul cu tastatura (Windows, „pai”, Enter): asistentul ajunge la pas() = 2", pasi[-1][1] == 2, pasi)
    bifa("K2", "drumul cu tastatura: niciun indiciu la final", not pasi[-1][2], pasi[-1])
    bifa("K2", "după tasta Windows (Start deschis) indiciul nu mai stă pe „Deschide Start”",
         not any("Deschide Start" in " ".join(p[2]) for p in pasi[1:]), pasi)
    w = [x for x in e if x["gest"] == "tasta_windows"]
    bifa("K2", "tasta Windows care deschide Start: activat = bara_activitati:Start", w and w[0].get("activat") == "bara_activitati:Start", scurt(w))
    en = [x for x in e if x["gest"] == "tasta_enter"]
    bifa("K2", "Enter din căutare care pornește Paint: activat = start:Paint, ținta = caseta",
         en and en[-1].get("activat") == "start:Paint" and en[-1]["tinta"] == "start:" + CASETA_NUME and en[-1]["actiune"] == "pornire_aplicatie", scurt(en))
    pasi, e = asist(mouse, "mouse")
    bifa("K2", "drumul cu mouse-ul (regres): pas() = 2", pasi[-1][1] == 2, pasi)


# ---------------------------------------------------------------- K3: caseta din Start pe telefon (și textul fără keydown pe PC)
def k3(br, base):
    for w, h in ((360, 740), (390, 844)):
        pg = pagina(br, base, w, h, telefon=True)
        atinge(pg, START)
        fara = pg.evaluate("[...document.querySelectorAll('.lh-w-start [data-lh-id]')].filter(e => e.offsetParent).map(e => e.getAttribute('data-lh-id')).filter(n => /^Paint/.test(n))")
        bifa("K3b", "telefon %d: Paint se găsește în Start fără tastare" % w, bool(fara), fara)
        ev(pg)
        atinge(pg, CASETA)
        f = pg.evaluate(FOCUS)
        e = ev(pg)
        bifa("K3", "telefon %d: atingerea pe casetă pune focusul într-un câmp editabil al bibliotecii (tastatura ecranului apare)" % w,
             bool(f and f["editabil"] and f["in_radacina"]), [f, scurt(e)])
        fs = pg.evaluate("(() => { const a = document.activeElement; return a && a.matches('input,textarea') ? parseFloat(getComputedStyle(a).fontSize) : null; })()")
        bifa("K3", "telefon %d: câmpul are font ≥ 16 px (fără zoom la focus)" % w, fs is not None and fs >= 16, fs)
        c = pg.context.new_cdp_session(pg)
        c.send("Input.imeSetComposition", {"text": "pa", "selectionStart": 2, "selectionEnd": 2})
        pg.wait_for_timeout(150)
        c.send("Input.insertText", {"text": "pai"})
        pg.wait_for_timeout(300)
        e = ev(pg)
        tx = pg.evaluate(TEXT_CAUT)
        rz = pg.evaluate(REZULTATE)
        bifa("K3", "telefon %d: textul tastaturii ecranului („pai”) ajunge în casetă" % w, tx == "pai", [tx, scurt(e)])
        bifa("K3", "telefon %d: textul emite tastare cu ținta casetei" % w,
             any(x["gest"] == "tastare" and x["tinta"] == "start:" + CASETA_NUME for x in e), scurt(e))
        bifa("K3", "telefon %d: rezultatele arată Paint" % w, "Paint" in rz, rz)
        atinge(pg, '[data-lh-rezultat][data-lh-id="Paint"]')
        s = st(pg)
        e = ev(pg)
        bifa("K3", "telefon %d: atingerea pe Paint pornește fereastra Paint" % w, any(f["aplicatie"] == "paint" for f in s["ferestre"]) and not s["meniu_start_deschis"], [s["ferestre"], scurt(e)])
        f = pg.evaluate(FOCUS)
        bifa("K3", "telefon %d: după pornire focusul iese din casetă (tastatura ecranului se închide)" % w, not (f and f["editabil"]), f)
        lat = pg.evaluate("document.documentElement.scrollWidth")
        bifa("K3", "telefon %d: pagina nu se lățește" % w, lat <= w, lat)
        coerent(pg, "K3", "telefon %d, după Paint" % w)
        pg.context.close()
    # PC: textul venit fără keydown (IME, dictare) cu Start deschis din tasta Windows
    pg = pagina(br, base)
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(150)
    ev(pg)
    c = pg.context.new_cdp_session(pg)
    c.send("Input.insertText", {"text": "pai"})
    pg.wait_for_timeout(250)
    e = ev(pg)
    tx = pg.evaluate(TEXT_CAUT)
    bifa("K3", "PC: textul fără keydown (insertText „pai”) ajunge în căutare", tx == "pai" and any(x["gest"] == "tastare" for x in e), [tx, scurt(e)])
    # PC: clic pe casetă, apoi tastare fizică: un singur eveniment pe literă, ținta casetei
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(100)
    clic(pg, START)
    clic(pg, CASETA)
    ev(pg)
    tasteaza(pg, "pai")
    e = ev(pg)
    tx = pg.evaluate(TEXT_CAUT)
    bifa("K3", "PC: clic pe casetă + tastare fizică „pai” = 3 evenimente tastare, textul o singură dată",
         tx == "pai" and [x["gest"] for x in e] == ["tastare"] * 3 and all(x["tinta"] == "start:" + CASETA_NUME for x in e), [tx, scurt(e)])
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    e = ev(pg)
    bifa("K3", "PC: Enter din casetă pornește Paint (activat start:Paint)", any(x.get("activat") == "start:Paint" for x in e) and any(f["aplicatie"] == "paint" for f in st(pg)["ferestre"]), scurt(e))
    pg.context.close()


# ---------------------------------------------------------------- unghiul stare_finala_erori: drumurile lecțiilor
def stari(br, base):
    pg = pagina(br, base)
    # S1: Start deschis, apoi Esc / clic în afară
    clic(pg, START)
    ev(pg)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(150)
    e = ev(pg)
    bifa("S1", "Start + Esc: Start închis, evenimentul inchide_start", not st(pg)["meniu_start_deschis"] and any(x["actiune"] == "inchide_start" for x in e), scurt(e))
    coerent(pg, "S1", "Start + Esc")
    clic(pg, START)
    ev(pg)
    pg.mouse.click(30, 300)
    pg.wait_for_timeout(150)
    e = ev(pg)
    bifa("S1", "Start + clic în afară: Start închis, evenimentul inchide_start", not st(pg)["meniu_start_deschis"] and any(x["actiune"] == "inchide_start" for x in e), scurt(e))
    coerent(pg, "S1", "Start + clic în afară")
    # S2: text greșit, apoi Backspace până la gol (de la tastatură și din casetă)
    for drum in ("tasta Windows", "clic pe casetă"):
        if drum == "tasta Windows":
            pg.keyboard.press("Meta")
        else:
            clic(pg, START)
            clic(pg, CASETA)
        pg.wait_for_timeout(120)
        ev(pg)
        tasteaza(pg, "xqz")
        m = pg.evaluate(MESAJ)
        e = ev(pg)
        bifa("S2", "%s, „xqz”: fără rezultate și mesajul căutării, nu tăcere" % drum, not pg.evaluate(REZULTATE) and any("căutarea" in x for x in m), [m, scurt(e)[-1:]])
        for _ in range(3):
            pg.keyboard.press("Backspace")
            pg.wait_for_timeout(60)
        pg.wait_for_timeout(120)
        e = ev(pg)
        tx = pg.evaluate(TEXT_CAUT)
        dale = pg.evaluate("document.querySelectorAll('.lh-w-start .lh-w-dala').length")
        bifa("S2", "%s, Backspace ×3: caseta goală, dalele înapoi, Start rămâne deschis" % drum,
             not tx and dale > 0 and st(pg)["meniu_start_deschis"] and [x["gest"] for x in e] == ["tasta_backspace"] * 3, [tx, dale, scurt(e)])
        pg.keyboard.press("Backspace")
        pg.wait_for_timeout(120)
        e = ev(pg)
        bifa("S2", "%s, încă un Backspace pe caseta goală: Start rămâne deschis, un eveniment" % drum, st(pg)["meniu_start_deschis"] and len(e) == 1, scurt(e))
        coerent(pg, "S2", drum + ", după Backspace")
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(120)
        bifa("S2", "%s, Esc: Start închis" % drum, not st(pg)["meniu_start_deschis"], st(pg)["meniu_start_deschis"])
    pg.context.close()

    # S3: aplicație pornită din căutare, minimizată, readusă din bară, maximizată, închisă
    pg = pagina(br, base)
    pg.keyboard.press("Meta")
    tasteaza(pg, "pai")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    s = st(pg)
    bifa("S3", "Paint pornit din căutare: fereastră activă, Start închis", [f["aplicatie"] for f in s["ferestre"] if f["activa"]] == ["paint"] and not s["meniu_start_deschis"], s["ferestre"])
    coerent(pg, "S3", "Paint pornit")
    ev(pg)
    clic(pg, '.lh-w-fer[data-lh-id="paint"] [data-lh-tinta="bara_titlu"][data-lh-id="Minimizare"]')
    s = st(pg)
    e = ev(pg)
    bifa("S3", "Minimizare: fereastra stare=min, butonul rămâne în bară", s["ferestre"][0]["stare"] == "min" and any(x["actiune"] == "minimizare" for x in e), [s["ferestre"], scurt(e)])
    coerent(pg, "S3", "după Minimizare")
    clic(pg, '.lh-w-bara [data-lh-app="paint"]')
    s = st(pg)
    e = ev(pg)
    bifa("S3", "clic pe butonul din bară: fereastra revine activă", s["ferestre"][0]["stare"] == "normal" and s["ferestre"][0]["activa"] and any(x["actiune"] == "restaurare" for x in e), [s["ferestre"], scurt(e)])
    coerent(pg, "S3", "după readucere")
    clic(pg, '.lh-w-fer[data-lh-id="paint"] [data-lh-tinta="bara_titlu"][data-lh-id="Maximizare"]')
    s = st(pg)
    e = ev(pg)
    r = pg.evaluate("(() => { const f = document.querySelector('.lh-w-fer[data-lh-id=\"paint\"]'), b = document.querySelector('.lh-w-bara'), o = document.querySelector('[data-lh-aplicatie=\"windows\"]').getBoundingClientRect(); const a = f.getBoundingClientRect(), c = b.getBoundingClientRect(); return [Math.round(a.left - o.left), Math.round(a.top - o.top), Math.round(a.right - o.right), Math.round(a.bottom - c.top)]; })()")
    bifa("S3", "Maximizare: stare=max și fereastra acoperă ecranul până la bară (±1 px)", s["ferestre"][0]["stare"] == "max" and all(abs(x) <= 1 for x in r), [s["ferestre"], r, scurt(e)])
    coerent(pg, "S3", "după Maximizare")
    clic(pg, '.lh-w-fer[data-lh-id="paint"] [data-lh-tinta="bara_titlu"][data-lh-id="Închidere"]')
    s = st(pg)
    e = ev(pg)
    bp = pg.evaluate("document.querySelectorAll('.lh-w-bara [data-lh-app=\"paint\"]').length")
    bifa("S3", "Închidere: nicio fereastră, butonul Paint pleacă din bară", not s["ferestre"] and bp == 0 and any(x["actiune"] == "inchidere_fereastra" for x in e), [s["ferestre"], bp, scurt(e)])
    coerent(pg, "S3", "după Închidere")
    pg.context.close()

    # S4: meniul desktopului cu Esc la jumătate; S5: Nou › Folder, apoi Esc / nume gol
    pg = pagina(br, base)
    pg.mouse.click(700, 300, button="right")
    pg.wait_for_timeout(150)
    clic(pg, '[data-lh-suprafata="meniu_desktop"] [data-lh-id="Nou"]')
    ev(pg)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(120)
    s1 = st(pg)["meniu_deschis"]
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(120)
    s2 = st(pg)["meniu_deschis"]
    e = ev(pg)
    bifa("S4", "meniul desktopului › Nou, Esc, Esc: întâi submeniul, apoi meniul", s1 == "meniu_desktop" and s2 is None and [x["actiune"] for x in e] == ["inchide_submeniu", "inchide_meniu"], [s1, s2, scurt(e)])
    coerent(pg, "S4", "după Esc, Esc")
    p0 = st(pg)["pictograme_desktop"]
    for drum, (mx, my) in (("Esc", (700, 300)), ("nume gol + Enter", (1000, 420))):
        pg.mouse.click(mx, my, button="right")
        pg.wait_for_timeout(150)
        clic(pg, '[data-lh-suprafata="meniu_desktop"] [data-lh-id="Nou"]')
        clic(pg, '[data-lh-suprafata="meniu_desktop_nou"] [data-lh-id="Folder"]')
        pg.wait_for_timeout(150)
        nou = st(pg)["redenumire"]
        ev(pg)
        if drum == "Esc":
            pg.keyboard.press("Escape")
        else:
            pg.keyboard.press("Control+a")
            pg.keyboard.press("Delete")
            pg.keyboard.press("Enter")
        pg.wait_for_timeout(200)
        s = st(pg)
        e = ev(pg)
        bifa("S5", "Nou › Folder, %s: folderul rămâne cu numele implicit „%s”, redenumirea s-a încheiat" % (drum, nou),
             nou and nou in s["pictograme_desktop"] and s["redenumire"] is None and len(s["pictograme_desktop"]) == len(p0) + (1 if drum == "Esc" else 2),
             [nou, s["pictograme_desktop"], s["redenumire"], scurt(e)])
        bifa("S5", "Nou › Folder, %s: evenimentul încheie redenumirea" % drum, any(x["actiune"] in ("anulare_redenumire", "redenumire") for x in e), scurt(e))
        coerent(pg, "S5", "după Nou › Folder, " + drum)
    pg.context.close()

    # S7: cu Start deschis tastele sunt ale casetei: Delete / F2 / Enter nu ating pictograma selectată din spate
    pg = pagina(br, base, continut={"pictograme": ["Teme"]})
    clic(pg, '.lh-w-desk [data-lh-id="Teme"]')
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    ev(pg)
    for t in ("Delete", "F2", "Enter"):
        pg.keyboard.press(t)
        pg.wait_for_timeout(100)
    s = st(pg)
    e = ev(pg)
    bifa("S7", "Start deschis, pictograma „Teme” selectată dedesubt: Delete / F2 / Enter n-o șterg, n-o redenumesc, n-o deschid",
         "Teme" in s["pictograme_desktop"] and s["redenumire"] is None and s["meniu_start_deschis"] and not pg.evaluate(MESAJ), [s["pictograme_desktop"], s["redenumire"], scurt(e)])
    bifa("S7", "… și fiecare tastă are evenimentul ei, cu ținta casetei", len(e) == 3 and all(x["tinta"] == "start:" + CASETA_NUME for x in e), scurt(e))
    coerent(pg, "S7", "după Delete / F2 / Enter cu Start deschis")
    pg.context.close()

    # S6: două ferestre, închiderea celei din spate
    pg = pagina(br, base, continut={"ferestre": [{"aplicatie": "explorer", "titlu": "Documente", "x": 60, "y": 30},
                                                  {"aplicatie": "explorer", "titlu": "Imagini", "x": 420, "y": 240, "activa": True}]})
    ev(pg)
    clic(pg, '.lh-w-fer[data-lh-eticheta="Documente"] [data-lh-tinta="bara_titlu"][data-lh-id="Închidere"]')
    s = st(pg)
    e = ev(pg)
    bifa("S6", "două ferestre, închid fereastra din spate: rămâne cea din față, activă",
         [f["titlu"] for f in s["ferestre"]] == ["Imagini"] and s["ferestre"][0]["activa"] and any(x["actiune"] == "inchidere_fereastra" for x in e), [s["ferestre"], scurt(e)])
    coerent(pg, "S6", "după închiderea ferestrei din spate")
    pg.context.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eticheta", default="final")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    srv, base = SL.porneste_server(WT)
    with sync_playwright() as p:
        br = p.chromium.launch()
        for nume, fn in (("K1", k1), ("K2", k2), ("K3", k3), ("S", stari)):
            print(nume)
            try:
                fn(br, base)
            except Exception as e:
                bifa(nume, "proba a mers până la capăt", False, str(e)[:300])
        br.close()
    srv.shutdown()
    bifa("-", "nicio eroare JS", not REZ["erori_js"], REZ["erori_js"][:3])
    bifa("-", "nicio cerere în afara 127.0.0.1", not REZ["plecate"], REZ["plecate"][:3])
    pic = {}
    for v in REZ["verificari"]:
        pic.setdefault(v["grav"], [0, 0])
        pic[v["grav"]][0] += 1
        pic[v["grav"]][1] += 0 if v["ok"] else 1
    picate = sum(1 for v in REZ["verificari"] if not v["ok"])
    REZ["rezumat"] = {"verificari": len(REZ["verificari"]), "picate": picate, "pe_grav": pic}
    f = IES / ("proba_grav_%s.json" % a.eticheta)
    f.write_text(json.dumps(REZ, ensure_ascii=False, indent=1), encoding="utf-8")
    print("pe GRAV (verificări, picate): " + ", ".join("%s=%s" % kv for kv in pic.items()))
    print(f.name)
    print(picate)


if __name__ == "__main__":
    main()
