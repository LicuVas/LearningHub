# -*- coding: utf-8 -*-
r"""O5 — ORACOLUL DE EVENIMENTE (cerința R6 din ../contract.md; Etapa 0, 16.11.2026).

Întrebarea: pentru FIECARE gest din D/suprafete.json (aplicatii.<app>.gesturi[].id = „<app>.<fel>”), făcut cu mouse-ul
și tastatura ADEVĂRATE în aplicația simulată, apare evenimentul standard din ../api_biblioteca.md §4?
Numără gesturile FĂRĂ eveniment valid. Evenimentul e valid dacă, în cele 1,5 s de după gest, pe `window` a sosit un
CustomEvent „lh-aplicatie” cu detail = {aplicatie == <app>, gest == <fel>, actiune: șir nevid, tinta: șir nevid
(la gesturile pe o țintă: exact ținta canonică a elementului apăsat, §3: data-lh-tinta[:data-lh-id]), inainte și dupa: obiecte, ts: număr = Date.now() al
gestului}; la „tastare” în word / excel / powerpoint, dupa trebuie să difere de inainte (tastarea schimbă documentul).
Unde: <rad>/aplicatii/poligon.html (biblioteca, LH.aplicatii); fiecare gest pe o aplicație deschisă din nou
(LH.aplicatii.deschide(app, {loc, focus:true})). Ținta gestului o alege ORACOLUL, după convenția de atribute din
api_biblioteca.md §3 (nu biblioteca): tabelul FELURI de mai jos, înghețat. Biblioteca poate cere doar o pregătire
(LH.aplicatii.demonstratie(app, fel) -> {pregatire:[ținte]}), făcută tot cu clicuri adevărate.
Fără bibliotecă pe sit: fiecare gest se numără (azi: toate); în plus, ca dovadă (nu intră în număr), o probă de FUM pe
câte o pagină veche per aplicație: clic / dublu clic / clic dreapta / o tastă în simulatorul vechi -> câte evenimente
standard au apărut (azi trebuie 0).
Convenția rădăcinii: LH_RADACINA, LH_IESIRE, LH_PAGINI (= doar aplicațiile acelor pagini, după inventar.json).
Rețeaua: ruta abandonează tot ce nu e 127.0.0.1 (regula 24); în plus (reparația 12, 17.11.2026) navigator.sendBeacon
întoarce false și assets/js/prezenta.js + site-credit.js nu se încarcă (ca în sarcini_lib/joaca.py).
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/oracol_evenimente.py [--autotest]
Ieșirea: ultima linie = UN întreg; penultima = calea JSON-ului cu detalii; cod 0 / 1; prăbușire = 2.
"""
import argparse
import functools
import http.server
import json
import os
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

AICI = Path(__file__).resolve().parent
D = AICI.parent
WT = D.parents[1]
RAD = Path(os.environ.get("LH_RADACINA") or WT).resolve()
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else AICI
DETALII = IESIRE / (Path(__file__).stem + ".json")
PAGINI = [p.strip().replace("\\", "/") for p in os.environ.get("LH_PAGINI", "").split(",") if p.strip()]
SUPRAFETE = D / "suprafete.json"
INVENTAR = D / "inventar.json"
POLIGON = "aplicatii/poligon.html"
LOCALE = ("127.0.0.1", "localhost")
SCHIMBA_LA_TASTARE = {"word", "excel", "powerpoint"}

# Felul gestului -> (ce țintă caută oracolul, ce face). Înghețat odată cu oracolul. Țintele, după api_biblioteca.md §3:
#   „fel:<prefix>”  = primul element vizibil a cărui țintă canonică (data-lh-tinta[:data-lh-id]) începe cu <prefix>:
#   „zona”          = primul element vizibil cu data-lh-tinta DIN [data-lh-zona] (altfel zona însăși)
TASTE = {"tasta_delete": "Delete", "tasta_backspace": "Backspace", "tasta_enter": "Enter", "tasta_esc": "Escape",
         "tasta_tab": "Tab", "tasta_home_end": "End", "tasta_pagina": "PageDown", "tasta_windows": "Meta",
         "sageti": "ArrowDown", "alt_sageti": "Alt+ArrowLeft"}
INDICATOR = {"clic_fila": "fila:", "fila_file": "fila:File", "clic_comanda_panglica": "panglica:", "lansator_grup": "lansator:",
             "meniu_derulant": "meniu_derulant:", "acces_rapid": "acces_rapid:", "zoom": "zoom", "umplere_tragere": "maner_umplere"}


def fel_actiune(fel):
    """-> (tipul țintei, acțiunea, parametru)."""
    if fel in INDICATOR:
        return INDICATOR[fel], ("trage_jos" if fel == "umplere_tragere" else "clic"), None
    if fel in ("clic_dreapta", "dublu_clic", "shift_clic", "ctrl_clic", "selectie", "tragere", "rotita", "tastare"):
        return "zona", fel, None
    if fel in TASTE:
        return "zona", "tasta", TASTE[fel]
    if fel.startswith("tasta_f") and fel[7:].isdigit():
        return "zona", "tasta", "F" + fel[7:]
    if fel.startswith("ctrl_shift_") and len(fel) == 12:
        return "zona", "tasta", "Control+Shift+" + fel[-1].upper()
    if fel.startswith("ctrl_") and len(fel) == 6:
        return "zona", "tasta", "Control+" + fel[-1]
    return None, None, None


class Tacut(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript",
                      ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".html": "text/html"}

    def log_message(self, format, *args):
        pass


def server(rad):
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(rad)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, "http://127.0.0.1:%d" % srv.server_address[1]


LHA = "window.__LHA=()=>(window.LH&&window.LH.aplicatii)||window.LHAplicatii||null;"   # numele bibliotecii (§1)
ASCULTA = """(()=>{window.__O5=[];window.addEventListener('lh-aplicatie',e=>{try{const d=e.detail;
  window.__O5.push({d:JSON.parse(JSON.stringify(d===undefined?null:d,(k,v)=>v===undefined?'__nedefinit__':v)),acum:Date.now(),
    are_inainte:!!d&&('inainte' in d)&&d.inainte!==undefined,are_dupa:!!d&&('dupa' in d)&&d.dupa!==undefined})}
  catch(x){window.__O5.push({d:null,eroare:String(x),acum:Date.now()})}})})();"""


FARA = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")   # vorbesc cu serverul viu: nu se încarcă (ca joaca.py)
FARA_BEACON = ("(()=>{const nu=function(){return false};"
               "try{Object.defineProperty(Navigator.prototype,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}"
               "try{Object.defineProperty(navigator,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}})();")
OPRITE = []   # cererile locale abandonate (prezenta.js, site-credit.js) — doar raportate


def context_blocat(br, plecate, **kw):
    """regula 24 + reparația 12 din ../verificare_etapa0.md: tot ce nu e 127.0.0.1 se abandonează; sendBeacon întoarce
    false (la închiderea paginii scăpa de rută — jocuri/_motor/garda_locala.py); prezenta.js / site-credit.js nu se încarcă"""
    ctx = br.new_context(**kw)

    def ruta(r):
        u = urlsplit(r.request.url)
        if u.hostname not in LOCALE:
            plecate.append(r.request.url)
            return r.abort()
        if u.path.endswith(FARA):
            OPRITE.append(u.path)
            return r.abort()
        return r.continue_()
    ctx.route("**/*", ruta)
    ctx.add_init_script(FARA_BEACON)
    ctx.add_init_script(LHA)
    ctx.add_init_script(ASCULTA)
    ctx.add_init_script("try{localStorage.setItem('learninghub_active_profile','ProbaO5')}catch(e){}")
    return ctx


def gesturi(apps_permise):
    s = json.loads(SUPRAFETE.read_text(encoding="utf-8"))
    out = []
    for app, v in s["aplicatii"].items():
        if apps_permise is not None and app not in apps_permise:
            continue
        for g in v.get("gesturi", []):
            out.append((app, g["id"].split(".", 1)[1], g["id"]))
    return out


def apps_din_pagini():
    if not PAGINI:
        return None
    inv = json.loads(INVENTAR.read_text(encoding="utf-8"))
    return {p.get("aplicatia_principala") for p in inv.get("pagini", []) if p["pagina"] in PAGINI}


GASESTE = """([app,fel,excl])=>{
  const r=document.querySelector('[data-lh-aplicatie="'+app+'"]');if(!r)return null;
  const viz=e=>{const b=e.getBoundingClientRect();if(b.width<2||b.height<2)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'};
  const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};
  const toate=b=>[...b.querySelectorAll('[data-lh-tinta]')].filter(viz);
  const FILE=x=>{const c=canon(x),m=x.getAttribute('data-lh-id-mso');return c==='fila:File'||c==='fila_file'||m==='FileTabButton'||m==='FileTab'};
  let e=null;
  if(fel==='zona'){const z=[...r.querySelectorAll('[data-lh-zona]')].find(viz);if(!z)return null;
    const it=toate(z).filter(x=>x!==z&&!(excl||[]).includes(canon(x)));
    e=it[0]||(z.hasAttribute('data-lh-tinta')?z:null);}
  else if(fel==='fila:File')e=[...r.querySelectorAll('[data-lh-tinta],[data-lh-id-mso]')].find(x=>viz(x)&&FILE(x));
  else if(fel.endsWith(':'))e=toate(r).find(x=>canon(x).startsWith(fel)&&!FILE(x)&&x.getAttribute('aria-selected')!=='true'&&!(excl||[]).includes(canon(x)));
  else e=toate(r).find(x=>canon(x)===fel);
  if(!e)return null;
  e.scrollIntoView({block:'center',inline:'nearest'});
  const b=e.getBoundingClientRect();
  return {tinta:e.hasAttribute('data-lh-tinta')?canon(e):('mso:'+e.getAttribute('data-lh-id-mso')),x:b.left+b.width/2,y:b.top+b.height/2,w:b.width,h:b.height};
}"""


def deschide_app(pg, app):
    return pg.evaluate("""async a=>{const L=window.__LHA();if(!L||typeof L.deschide!=='function')return 'fără LH.aplicatii';
      try{if(L.gata&&L.gata.then)await L.gata;let loc=document.getElementById('o5-loc');if(loc)loc.remove();
        loc=document.createElement('div');loc.id='o5-loc';loc.style.cssText='width:1100px;margin:8px';document.body.prepend(loc);
        await L.deschide(a,{loc,focus:true});return ''}catch(e){return 'deschide a eșuat: '+(e&&e.message||e)}}""", app)


def gaseste(pg, app, fel, excl=None):
    return pg.evaluate(GASESTE, [app, fel, excl or []])


def clic_tinta(pg, app, t, dublu=False):
    r = pg.evaluate("""([a,t])=>{const L=window.__LHA();let e=null;try{e=L.element?L.element(a,t):null}catch(x){}
      const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};
      if(!e){const r=document.querySelector('[data-lh-aplicatie="'+a+'"]');e=r&&[...r.querySelectorAll('[data-lh-tinta]')].find(x=>canon(x)===t)}
      if(!e)return null;e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}}""", [app, t])
    if not r:
        raise RuntimeError("pregătirea cere ținta „%s”, care nu e pe ecran" % t)
    if dublu:
        pg.mouse.dblclick(r["x"], r["y"])
    else:
        pg.mouse.click(r["x"], r["y"])
    pg.wait_for_timeout(150)


def proba_gest(pg, app, fel):
    """Întoarce (ok, motiv, ținta, evenimente_văzute)."""
    tip, act, param = fel_actiune(fel)
    if tip is None:
        return False, "fel de gest necunoscut oracolului: " + fel, None, []
    err = deschide_app(pg, app)
    if err:
        return False, err, None, []
    pg.wait_for_timeout(120)
    demo = pg.evaluate("([a,f])=>{try{const L=window.__LHA();return L.demonstratie?L.demonstratie(a,f):null}catch(e){return null}}", [app, fel]) or {}
    pregatire = demo.get("pregatire") or []
    for t in pregatire:   # pregătirea cerută de bibliotecă (§4.4): clicuri adevărate; {gest:'dublu_clic', tinta} = dublu clic
        if isinstance(t, dict):
            clic_tinta(pg, app, t.get("tinta"), dublu=t.get("gest") == "dublu_clic")
        else:
            clic_tinta(pg, app, t)
    T = gaseste(pg, app, tip)
    if not T:
        return False, "nicio țintă „%s” vizibilă în aplicație (api_biblioteca.md §3)" % tip, None, []
    # pregătirea standard (doar fără pregătirea bibliotecii): focusul / alegerea elementului în zona de lucru, cu un clic
    # adevărat; evenimentele ei nu contează
    if pregatire:
        pass
    elif tip == "zona" and act in ("tasta", "tastare", "clic_dreapta", "shift_clic", "ctrl_clic", "rotita", "tragere"):
        pg.mouse.click(T["x"], T["y"])
        pg.wait_for_timeout(150)
    elif tip == "maner_umplere":
        Z = gaseste(pg, app, "zona")
        if Z:
            pg.mouse.click(Z["x"], Z["y"])
            pg.wait_for_timeout(150)
        T = gaseste(pg, app, tip)
        if not T:
            return False, "pătrățelul de umplere (maner_umplere) nu apare după alegerea unei celule", None, []
    T = gaseste(pg, app, tip) or T
    url0 = pg.url
    pg.evaluate("window.__O5=[]")
    t0 = pg.evaluate("Date.now()")
    x, y = T["x"], T["y"]
    if act == "clic":
        pg.mouse.click(x, y)
    elif act == "dublu_clic":
        pg.mouse.dblclick(x, y)
    elif act == "clic_dreapta":
        pg.mouse.click(x, y, button="right")
    elif act in ("shift_clic", "ctrl_clic"):
        m = "Shift" if act == "shift_clic" else "Control"
        pg.keyboard.down(m)
        pg.mouse.click(x, y)
        pg.keyboard.up(m)
    elif act in ("selectie", "tragere"):
        x0 = x - min(T["w"] / 2 - 2, 20) if act == "selectie" else x
        x1, y1 = (x + min(T["w"] / 2 - 2, 20), y) if act == "selectie" else (x + 80, y + 40)
        pg.mouse.move(x0, y)
        pg.mouse.down()
        for k in range(1, 11):
            pg.mouse.move(x0 + (x1 - x0) * k / 10, y + (y1 - y) * k / 10)
        pg.mouse.up()
    elif act == "trage_jos":
        pg.mouse.move(x, y)
        pg.mouse.down()
        for k in range(1, 11):
            pg.mouse.move(x, y + 6 * k)
        pg.mouse.up()
    elif act == "rotita":
        pg.mouse.move(x, y)
        pg.mouse.wheel(0, 120)
    elif act == "tastare":
        pg.keyboard.type("ab", delay=20)
    elif act == "tasta":
        pg.keyboard.press(param)
    pg.wait_for_timeout(1500)
    if pg.url != url0:
        return False, "gestul a plecat de pe pagină (%s)" % pg.url, T["tinta"], []
    ev = pg.evaluate("window.__O5||[]")
    motive = []
    for e in ev:
        d = e.get("d") or {}
        r = []
        if d.get("aplicatie") != app:
            r.append("aplicatie=%r" % d.get("aplicatie"))
        if d.get("gest") != fel:
            r.append("gest=%r" % d.get("gest"))
        if not isinstance(d.get("actiune"), str) or not d.get("actiune"):
            r.append("fără actiune")
        if not isinstance(d.get("tinta"), str) or not d.get("tinta"):
            r.append("fără tinta")
        elif tip != "zona" or act not in ("tasta", "tastare"):
            if d.get("tinta") != T["tinta"]:
                r.append("tinta=%r, nu %r" % (d.get("tinta"), T["tinta"]))
        if not e.get("are_inainte") or not isinstance(d.get("inainte"), dict):
            r.append("fără inainte (obiect)")
        if not e.get("are_dupa") or not isinstance(d.get("dupa"), dict):
            r.append("fără dupa (obiect)")
        if not isinstance(d.get("ts"), (int, float)) or abs(d["ts"] - t0) > 5000:
            r.append("ts=%r" % d.get("ts"))
        if fel == "tastare" and app in SCHIMBA_LA_TASTARE and json.dumps(d.get("inainte"), sort_keys=True) == json.dumps(d.get("dupa"), sort_keys=True):
            r.append("tastarea n-a schimbat starea (inainte == dupa)")
        if not r:
            return True, "", T["tinta"], ev[:3]
        motive.append("; ".join(r))
    if not ev:
        return False, "niciun eveniment „lh-aplicatie” în 1,5 s", T["tinta"], []
    return False, "%d evenimente, niciunul valid: %s" % (len(ev), motive[0][:200]), T["tinta"], ev[:3]


FUM = """async ()=>{const out={atelier:false,evenimente:0,motiv:''};
  try{const L=document.querySelector('.lvl[data-l="0"]');if(L)L.click();await new Promise(r=>setTimeout(r,300));
    if(window.JocMotor&&JocMotor.test&&JocMotor.test.atelier){try{JocMotor.test.atelier();out.atelier=true}catch(e){out.motiv='atelier: '+e}}
  }catch(e){out.motiv=String(e)}
  await new Promise(r=>setTimeout(r,400));
  const b=document.getElementById('body');if(!b){out.motiv=out.motiv||'fără #body';return out}
  b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();out.x=r.left+Math.min(r.width/2,300);out.y=r.top+Math.min(r.height/2,150);return out}"""


def fum(br, baza, inv, apps, plecate):
    """Pagini vechi: gesturi reale în simulatorul vechi, câte evenimente standard apar (dovadă pentru linia de bază)."""
    out = {}
    for app in sorted(apps):
        pag = next((p["pagina"] for p in inv.get("pagini", []) if p.get("aplicatia_principala") == app and (RAD / p["pagina"]).exists()), None)
        if not pag:
            out[app] = {"pagina": None, "motiv": "nicio pagină cu această aplicație pe disc"}
            continue
        ctx = context_blocat(br, plecate, viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        try:
            pg.goto(baza + "/" + pag, wait_until="load", timeout=25000)
            pg.wait_for_timeout(500)
            r = pg.evaluate(FUM)
            if r.get("x") is not None:
                pg.evaluate("window.__O5=[]")
                pg.mouse.click(r["x"], r["y"])
                pg.mouse.dblclick(r["x"], r["y"])
                pg.mouse.click(r["x"], r["y"], button="right")
                pg.keyboard.press("Escape")
                pg.keyboard.press("a")
                pg.keyboard.press("Control+z")
                pg.wait_for_timeout(800)
                r["evenimente"] = len(pg.evaluate("window.__O5||[]"))
            out[app] = {"pagina": pag, **r, "biblioteca": pg.evaluate("!!window.__LHA()")}
        except Exception as e:
            out[app] = {"pagina": pag, "motiv": str(e).splitlines()[0][:200]}
        finally:
            ctx.close()
    return out


def masoara():
    apps = apps_din_pagini()
    G = gesturi(apps)
    inv = json.loads(INVENTAR.read_text(encoding="utf-8")) if INVENTAR.exists() else {"pagini": []}
    srv, baza = server(RAD)
    plecate, rez, fumul = [], [], {}
    from playwright.sync_api import sync_playwright
    try:
        with sync_playwright() as p:
            try:
                br = p.chromium.launch(channel="chrome", args=["--mute-audio"])
            except Exception:
                br = p.chromium.launch(args=["--mute-audio"])
            print("O5 · evenimente: %d gesturi din suprafete.json · situl %s · Chrome %s" % (len(G), RAD, br.version), flush=True)
            are_poligon = (RAD / POLIGON).exists()
            ctx = context_blocat(br, plecate, viewport={"width": 1366, "height": 768})
            pg = ctx.new_page()
            jserr = []
            pg.on("pageerror", lambda e: jserr.append(str(e)))
            are_bib = False
            if are_poligon:
                pg.goto(baza + "/" + POLIGON, wait_until="load", timeout=25000)
                try:
                    pg.wait_for_function("!!window.__LHA()", timeout=8000)
                    are_bib = True
                except Exception:
                    are_bib = False
            motiv_lipsa = ("pe sit nu există %s" % POLIGON) if not are_poligon else "pagina-poligon nu încarcă biblioteca (window.LH.aplicatii)"
            for app, fel, gid in G:
                if not are_bib:
                    rez.append({"gest": gid, "ok": False, "motiv": motiv_lipsa})
                    continue
                try:
                    ok, motiv, tinta, ev = proba_gest(pg, app, fel)
                except Exception as e:
                    ok, motiv, tinta, ev = False, "proba s-a oprit: " + str(e).splitlines()[0][:200], None, []
                    try:
                        pg.goto(baza + "/" + POLIGON, wait_until="load", timeout=25000)
                        pg.wait_for_function("!!window.__LHA()", timeout=8000)
                    except Exception:
                        pass
                if pg.url.split("?")[0] != (baza + "/" + POLIGON):
                    pg.goto(baza + "/" + POLIGON, wait_until="load", timeout=25000)
                rez.append({"gest": gid, "ok": ok, "motiv": motiv, "tinta": tinta, "evenimente": ev})
                print(("  ok   " if ok else "  RĂU  ") + gid + ("" if ok else ": " + motiv[:180]), flush=True)
            ctx.close()
            if not are_bib:
                print("  RĂU  toate cele %d gesturi: %s" % (len(G), motiv_lipsa), flush=True)
                fumul = fum(br, baza, inv, {a for a, _, _ in G}, plecate)
                for a, f in fumul.items():
                    print("  info fum %s: %s -> %s evenimente standard după clic/dublu clic/clic dreapta/taste în simulatorul vechi%s"
                          % (a, f.get("pagina"), f.get("evenimente", "?"), (" (" + f["motiv"] + ")") if f.get("motiv") else ""), flush=True)
            br.close()
            if jserr:
                print("  info erori JS pe poligon: %d (prima: %s)" % (len(jserr), jserr[0][:160]))
    finally:
        srv.shutdown()
        srv.server_close()
    return rez, fumul, plecate


def rezuma(rez, fumul, plecate):
    rele = [r for r in rez if not r["ok"]]
    total = len(rele) + (1 if not rez and not PAGINI else 0)
    IESIRE.mkdir(parents=True, exist_ok=True)
    DETALII.write_text(json.dumps({
        "oracol": "O5 oracol_evenimente (R6)", "generat": time.strftime("%Y-%m-%d %H:%M:%S"), "radacina": str(RAD),
        "numere": {"gesturi": len(rez), "fara_eveniment_valid": len(rele), "total": total},
        "pe_aplicatie": {a: sum(1 for r in rele if r["gest"].startswith(a + ".")) for a in sorted({r["gest"].split(".")[0] for r in rez})},
        "gesturi": rez, "fum_pagini_vechi": fumul, "cereri_abandonate": len(plecate), "cereri_locale_oprite": len(OPRITE)},
        ensure_ascii=False, indent=1), encoding="utf-8")
    print("Rezultat: %d din %d gesturi fără eveniment standard valid" % (len(rele), len(rez)))
    print(str(DETALII))
    print(total)
    return total


# ---------------- --autotest: jucăria (biblioteca falsă) curată -> 0; greșeli plantate în ea -> număr mai mare ----------------
MUTANTI = [
    ("Delete nu mai emite eveniment", "Delete:'tasta_delete',", "Delete:null,"),
    ("evenimentul pierde „inainte”", "tinta:tinta||I.zonaTinta,inainte,dupa:", "tinta:tinta||I.zonaTinta,dupa:"),
    ("scurtăturile Ctrl se numesc „ctrl+x”", "return (c?'ctrl_':'')+", "return (c?'ctrl+':'')+"),
    ("Paint nu emite nimic", "if(I.app==='__niciuna__')return;", "if(I.app==='paint')return;"),
    ("Excel se prezintă drept „foaie”", "const d={aplicatie:I.app,actiune,", "const d={aplicatie:I.app==='excel'?'foaie':I.app,actiune,"),
    ("clicul pe panglică raportează ținta zonei", "const g=gestClic(t,e);if(I.clic)I.clic(t,e,g);emite(I,g,I.ultimaActiune||'clic',t,ina)",
     "const g=gestClic(t,e);if(I.clic)I.clic(t,e,g);emite(I,g,I.ultimaActiune||'clic',I.zonaTinta,ina)"),
    ("tastarea în Word nu schimbă documentul", "if(g==='tastare'){I.M.paragrafe[I.M.paragrafe.length-1]+=e.key;", "if(g==='tastare'){void 0;"),
]


def ruleaza(rad, iesire):
    env = dict(os.environ, LH_RADACINA=str(rad), LH_IESIRE=str(iesire), PYTHONDONTWRITEBYTECODE="1")
    env.pop("LH_PAGINI", None)
    p = subprocess.run([sys.executable, str(Path(__file__).resolve())], capture_output=True, text=True, encoding="utf-8",
                       errors="replace", env=env, timeout=1800)
    l = [x for x in p.stdout.splitlines() if x.strip()]
    try:
        return int(l[-1]), l
    except Exception:
        return None, l + p.stderr.splitlines()[-5:]


def autotest():
    tmp = Path(tempfile.mkdtemp(prefix="lh_o5_"))
    rele = 0
    try:
        juc = tmp / "rad"
        (juc / "aplicatii").mkdir(parents=True)
        for x in ("aplicatii.js", "poligon.html"):
            shutil.copy2(AICI / "_jucarie" / x, juc / "aplicatii" / x)
        b0, l0 = ruleaza(juc, tmp / "i0")
        ok0 = b0 == 0
        rele += not ok0
        print("  %s  jucăria curată (respectă §4): %s gesturi fără eveniment%s" % ("ok " if ok0 else "RĂU", b0,
              "" if ok0 else " — " + " | ".join(x for x in l0 if "RĂU" in x)[:600]), flush=True)
        f = juc / "aplicatii" / "aplicatii.js"
        txt = f.read_text(encoding="utf-8")
        for k, (nume, din, in_) in enumerate(MUTANTI):
            if txt.count(din) != 1:
                print("  RĂU  mutantul „%s”: textul apare de %d ori" % (nume, txt.count(din)))
                rele += 1
                continue
            f.write_text(txt.replace(din, in_), encoding="utf-8")
            try:
                n, _ = ruleaza(juc, tmp / ("m%d" % k))
            finally:
                f.write_text(txt, encoding="utf-8")
            prins = n is not None and b0 is not None and n > b0
            rele += not prins
            print("  %s  mutant „%s”: %s -> %s %s" % ("ok " if prins else "RĂU", nume, b0, n, "PRINS" if prins else "SCĂPAT"), flush=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print("Autotest O5: jucăria curată + %d mutanți; verificări picate / mutanți scăpați: %d" % (len(MUTANTI), rele))
    print("(autotestul nu scrie detalii; copiile temporare au fost șterse)")
    print(rele)
    return rele


def main():
    ap = argparse.ArgumentParser(description="O5: fiecare gest din suprafete.json emite evenimentul standard?")
    ap.add_argument("--autotest", action="store_true")
    a = ap.parse_args()
    if a.autotest:
        return 1 if autotest() else 0
    rez, fumul, plecate = masoara()
    return 1 if rezuma(rez, fumul, plecate) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except BaseException:
        traceback.print_exc()
        print("PRĂBUȘIRE (nu e un număr de probleme)")
        sys.exit(2)
