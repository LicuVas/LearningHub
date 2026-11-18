# -*- coding: utf-8 -*-
r"""O9 — ORACOLUL DE ASISTARE (cerința R7 din ../contract.md; Etapa 0, 16.11.2026; reparat 17.11.2026 după
../verificare_etapa0.md, reparațiile 2 și 12).

Întrebarea: biblioteca centrală evidențiază elementul cerut și arată indiciul lângă el, prin API-ul din
../api_biblioteca.md §6, fără să facă gestul în locul elevului, și îl arată EXACT la condiția cerută (după 2 greșeli sau
după 30 s fără progres), pe ținta PASULUI CURENT, apoi îl ascunde când elevul face pasul? Numără CAZURILE picate:
7 cazuri pe poligon × 6 aplicații + cazul F (o intrare pe aplicație fără lecții cu biblioteca; altfel una pe fiecare lecție
jucată). Fără bibliotecă pe sit: 8 × 6 = 48.
Pe <rad>/aplicatii/poligon.html (Chrome, rețeaua tăiată în afară de 127.0.0.1 — regula 24), câte o aplicație deschisă din
nou pentru fiecare caz (LH.aplicatii.deschide(app, {loc, focus:true})), ținta T și o țintă greșită W din tabelul TINTE
(înghețat; după convenția de atribute din api_biblioteca.md §3):
  A evidentiaza(T): T marcat (data-lh-evidentiat pe el sau un [data-lh-evidentiere] vizibil peste el), în fereastră,
    centrul lui tot al lui (elementFromPoint), niciun eveniment „lh-aplicatie” și starea aplicației neschimbată;
  B indiciu(T, text): un [data-lh-indiciu] vizibil, cu data-lh-pentru = T și textul dat, în fereastră, la cel mult 48 px
    de T, fără să-i acopere centrul; niciun eveniment, starea neschimbată;
  C asistent(app, {pasi:[{tinta:T, indiciu}], dupaGreseli:2, dupaSecunde:30}): 1 clic ADEVĂRAT pe W -> fără indiciu
    (0,6 s); al 2-lea clic pe W -> indiciul pentru T, lângă T, și T evidențiat (în 1,5 s);
  D același asistent, cu ceasul paginii controlat (Playwright clock): la 28 s fără niciun gest -> fără indiciu;
    la 31 s -> indiciul pentru T;
  E după C, clic ADEVĂRAT pe T (pasul cerut) -> indiciul și evidențierea dispar (în 1 s);
  G asistent cu DOI pași (T1, T2 din TINTE_G): clic adevărat pe T1 (pasul 1 făcut) -> fără indiciu; 1 greșeală (clic
    adevărat într-un loc gol al zonei de lucru) -> fără indiciu; a 2-a greșeală -> indiciul pentru T2 (pasul CURENT),
    lângă T2, T2 evidențiat; T1 nici evidențiat, nici cu indiciu (prinde „indiciul rămâne pe primul pas”);
  H gesturi care NU sunt greșeli (§6.3): rotița mouse-ului ×3 peste zona de lucru și săgeata în jos ×3 -> fără indiciu
    (și evenimentele „rotita” și „sageti” chiar au venit — altfel cazul nu se poate judeca și pică); apoi 1 greșeală
    adevărată (clic pe W) -> tot fără indiciu; a 2-a -> indiciul pentru T (prinde „derularea se numără ca greșeală”);
  F R7: „cel puțin o lecție pe aplicație ascultă evenimentele și arată indiciul după 2 greșeli”. Lecțiile din
    inventar.json cu această aplicație principală al căror HTML pomenește „aplicatii.js” sunt DESCHISE în Chrome (aceeași
    rețea tăiată); o lecție încarcă biblioteca doar dacă window.LH.aplicatii chiar apare. Pe fiecare lecție care încarcă
    biblioteca și pornește asistentul (văzut prin LH.aplicatii.asistent / deschide(…,{asistent}), înfășurate de oracol
    înainte de orice script al paginii): ținta cerută = ținta pasului curent al asistentului pornit de LECȚIE; 1 greșeală
    adevărată (clic într-un loc gol al zonei de lucru) -> fără indiciu; a 2-a -> indiciul pe ținta cerută, lângă ea, ea
    evidențiată. Se numără: 1 dacă nicio lecție a aplicației nu încarcă biblioteca (ca înainte; azi: toate 6); 1 pe
    fiecare lecție jucată care pică; 1 pe lecția care pomenește asistentul în scripturi și nu-l pornește; 1 dacă lecții
    încarcă biblioteca, dar niciuna nu pornește asistentul. Un comentariu în pagină nu mai trece cazul.
Rețeaua (reparația 12): în fiecare context, navigator.sendBeacon întoarce false (nimic nu pleacă la închiderea paginii)
și assets/js/prezenta.js + site-credit.js nu se încarcă (cererea e abandonată), ca în sarcini_lib/joaca.py.
Convenția rădăcinii: LH_RADACINA, LH_IESIRE, LH_PAGINI (= doar aplicațiile acelor pagini; la F, doar acele pagini).
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/oracol_asistare.py [--autotest]
Ieșirea: ultima linie = UN întreg; penultima = calea JSON-ului cu detalii; cod 0 / 1; prăbușire = 2.
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

AICI = Path(__file__).resolve().parent
D = AICI.parent
WT = D.parents[1]
RAD = Path(os.environ.get("LH_RADACINA") or WT).resolve()
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else AICI
DETALII = IESIRE / (Path(__file__).stem + ".json")
PAGINI = [p.strip().replace("\\", "/") for p in os.environ.get("LH_PAGINI", "").split(",") if p.strip()]
INVENTAR = D / "inventar.json"
POLIGON = "aplicatii/poligon.html"
LOCALE = ("127.0.0.1", "localhost")
# fișierele locale care vorbesc cu serverul viu: nu se încarcă (ca sarcini_lib/joaca.py, FARA)
FARA = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")
APLICATII = ["windows", "explorer", "word", "excel", "powerpoint", "paint"]
CAZURI = ["A_evidentiaza", "B_indiciu", "C_dupa_2_greseli", "D_dupa_30_s", "E_progres_ascunde", "G_pasul_2",
          "H_derularea_nu_e_greseala", "F_lectie_asculta"]
TEXT = "Indiciu O9: apasă aici"
# Ținta cerută T și o țintă greșită W, pe aplicație. „prefix:” = primul element vizibil a cărui țintă canonică începe așa
# (al doilea, la W, când T are același prefix). Sursele etichetelor: Office — referinte/uia_{word,excel,powerpoint}.json
# (idMso Bold, Italic în Home › Font); Explorer — „Nou” din bara de comenzi (lectii/_sim/explorer-operatii.js:20, șirurile
# explorerframe); Windows — butonul Start [NEVERIFICAT: fără referință reală până la sesiunea cu omul]; Paint — oricare
# două unelte [NEVERIFICAT: fără referință reală].
TINTE = {
    "word": ("mso:Bold", "mso:Italic"),
    "excel": ("mso:Bold", "mso:Italic"),
    "powerpoint": ("mso:Bold", "mso:Italic"),
    "explorer": ("bara_comenzi:Nou", "lista:"),
    "windows": ("bara_activitati:Start", "desktop:"),
    "paint": ("unealta:", "unealta:"),
}
# Cazul G: pasul 1 (T1) și pasul 2 (T2). Greșelile din G se fac într-un loc GOL al zonei de lucru ([data-lh-zona]):
# clicul cel mai nevinovat în orice aplicație (nu schimbă fila, nu deschide meniuri), deci T2 rămâne pe ecran.
TINTE_G = {
    "word": ("mso:Bold", "mso:Italic"),
    "excel": ("mso:Bold", "mso:Italic"),
    "powerpoint": ("mso:Bold", "mso:Italic"),
    "explorer": ("lista:", "bara_comenzi:Nou"),
    "windows": ("desktop:", "bara_activitati:Start"),
    "paint": ("unealta:", "unealta:"),
}


class Tacut(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript",
                      ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml", ".html": "text/html"}

    def log_message(self, format, *args):
        pass


def server(rad):
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(rad)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, "http://127.0.0.1:%d" % srv.server_address[1]


FARA_BEACON = ("(()=>{const nu=function(){return false};"
               "try{Object.defineProperty(Navigator.prototype,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}"
               "try{Object.defineProperty(navigator,'sendBeacon',{value:nu,configurable:true,writable:true})}catch(e){}})();")
LHA = "window.__LHA=()=>(window.LH&&window.LH.aplicatii)||window.LHAplicatii||null;"   # numele bibliotecii (§1)
CANON = "const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};"
ASCULTA = "(()=>{window.__O9=[];window.addEventListener('lh-aplicatie',e=>{window.__O9.push(e.detail&&{aplicatie:e.detail.aplicatie,gest:e.detail.gest,tinta:e.detail.tinta})})})();"
# Cazul F: ce asistent pornește LECȚIA. Biblioteca își pune obiectul în window.LHAplicatii și window.LH.aplicatii (§1);
# oracolul prinde atribuirea și înfășoară asistent / deschide, ca să vadă pașii ceruți de lecție (nu cei raportați de
# bibliotecă). Înfășurarea nu schimbă nimic din ce face biblioteca.
INREGISTREAZA = r"""(()=>{window.__O9lectie=[];window.__O9infasurat=0;
  const rec=(n,cfg,h,din)=>{try{window.__O9lectie.push({aplicatie:n,din,h,
    pasi:((cfg&&cfg.pasi)||[]).map(p=>({tinta:p&&p.tinta!=null?String(p.tinta):null,are_asteapta:!!(p&&p.asteapta)})),
    dupaGreseli:cfg?cfg.dupaGreseli:undefined,dupaSecunde:cfg?cfg.dupaSecunde:undefined})}catch(e){}};
  const wrap=L=>{if(!L||(typeof L!=='object'&&typeof L!=='function')||L.__o9)return;
    try{Object.defineProperty(L,'__o9',{value:1})}catch(e){}
    const as=L.asistent;if(typeof as==='function'){try{L.asistent=function(n,cfg){const h=as.apply(this,arguments);rec(n,cfg,h,'asistent');return h};
      if(L.asistent!==as)window.__O9infasurat++}catch(e){}}
    const de=L.deschide;if(typeof de==='function'){try{L.deschide=function(n,opt){const r=de.apply(this,arguments);
      if(opt&&opt.asistent)rec(n,opt.asistent,null,'deschide');return r}}catch(e){}}};
  const capcana=(o,k)=>{try{const d=Object.getOwnPropertyDescriptor(o,k);if(d&&!d.configurable)return;let v=d?d.value:undefined;if(v)wrap(v);
    Object.defineProperty(o,k,{configurable:true,enumerable:true,get(){return v},set(x){v=x;wrap(x);if(k==='LH'&&x&&typeof x==='object')capcana(x,'aplicatii')}});
    if(k==='LH'&&v&&typeof v==='object')capcana(v,'aplicatii')}catch(e){}};
  capcana(window,'LHAplicatii');capcana(window,'LH');})();"""


def context_blocat(br, plecate, ceas=False, lectie=False, oprite=None, **kw):
    ctx = br.new_context(**kw)

    def ruta(r):
        u = urlsplit(r.request.url)
        if u.hostname not in LOCALE:
            plecate.append(r.request.url)
            return r.abort()
        if u.path.endswith(FARA):   # prezenta.js / site-credit.js: nu se încarcă (reparația 12)
            if oprite is not None:
                oprite.append(u.path)
            return r.abort()
        return r.continue_()
    ctx.route("**/*", ruta)
    ctx.add_init_script(FARA_BEACON)
    ctx.add_init_script(LHA)
    ctx.add_init_script(ASCULTA)
    if lectie:
        ctx.add_init_script(INREGISTREAZA)
    if ceas:
        ctx.clock.install()
    return ctx


JS_DESCHIDE = """async a=>{const L=window.__LHA();if(!L||typeof L.deschide!=='function')return 'fără LH.aplicatii';
  try{if(L.gata&&L.gata.then)await L.gata;if(window.__O9asist&&window.__O9asist.opreste)try{window.__O9asist.opreste()}catch(e){}
    if(L.ascunde)try{L.ascunde()}catch(e){}
    let loc=document.getElementById('o9-loc');if(loc)loc.remove();loc=document.createElement('div');loc.id='o9-loc';
    loc.style.cssText='width:1100px;margin:8px';document.body.prepend(loc);await L.deschide(a,{loc,focus:true});return ''}
  catch(e){return 'deschide a eșuat: '+(e&&e.message||e)}}"""

# alege T și W (T exact sau „prefix:”), întoarce numele canonice cerute bibliotecii (T așa cum e scris în tabel / prefixul
# rezolvat la primul element) și dreptunghiurile
JS_TINTE = """([a,T,W])=>{const L=window.__LHA(),r=document.querySelector('[data-lh-aplicatie="'+a+'"]');if(!r)return {eroare:'fără [data-lh-aplicatie="'+a+'"]'};""" + CANON + """
  const viz=e=>{const b=e.getBoundingClientRect();if(b.width<2||b.height<2)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'};
  const toate=p=>[...r.querySelectorAll('[data-lh-tinta]')].filter(x=>viz(x)&&canon(x).startsWith(p));
  const exact=t=>{let e=null;try{e=L.element?L.element(a,t):null}catch(x){}if(!e)e=[...r.querySelectorAll('[data-lh-tinta]')].find(x=>canon(x)===t&&viz(x))||null;
    if(!e&&t.startsWith('mso:'))e=[...r.querySelectorAll('[data-lh-id-mso="'+CSS.escape(t.slice(4))+'"]')].find(viz)||null;return e&&viz(e)?e:null};
  let tT=T,eT=null;if(T.endsWith(':')){eT=toate(T)[0]||null;tT=eT?canon(eT):T}else eT=exact(T);
  if(!eT)return {eroare:'ținta cerută „'+T+'” nu e pe ecran'};
  let tW=W,eW=null;if(W.endsWith(':')){eW=toate(W).find(x=>x!==eT&&!eT.contains(x)&&!x.contains(eT))||null;tW=eW?canon(eW):W}else eW=exact(W);
  if(!eW)return {eroare:'ținta greșită „'+W+'” nu e pe ecran'};
  return {T:tT,W:tW}}"""

JS_STARE = """a=>{try{return JSON.stringify(window.__LHA().stare(a))}catch(e){return 'eroare: '+e}}"""

# fotografia asistării pentru ținta T: marcată? indiciul ei? unde? acoperă? în fereastră?
JS_FOTO = """([a,T])=>{const L=window.__LHA(),r=document.querySelector('[data-lh-aplicatie="'+a+'"]');""" + CANON + """
  const viz=e=>{if(!e||!e.isConnected)return false;const b=e.getBoundingClientRect();if(b.width<2||b.height<2)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0.05};
  let E=null;try{E=L.element?L.element(a,T):null}catch(x){}
  if(!E&&r)E=[...r.querySelectorAll('[data-lh-tinta]')].find(x=>canon(x)===T)||(T.startsWith('mso:')?r.querySelector('[data-lh-id-mso="'+CSS.escape(T.slice(4))+'"]'):null);
  const ind=[...document.querySelectorAll('[data-lh-indiciu]')].filter(viz);
  const o={are_tinta:!!E,indicii_vizibile:ind.length,pentru:ind.map(x=>x.getAttribute('data-lh-pentru'))};
  if(!E)return o;
  const b=E.getBoundingClientRect(),vw=innerWidth,vh=innerHeight;
  o.tinta_in_fereastra=b.left>=0&&b.top>=0&&b.right<=vw&&b.bottom<=vh;
  const peste=(x,y)=>{const u=x.getBoundingClientRect();return u.left<=y.left+6&&u.top<=y.top+6&&u.right>=y.right-6&&u.bottom>=y.bottom-6};
  o.evidentiat=E.hasAttribute('data-lh-evidentiat')||[...document.querySelectorAll('[data-lh-evidentiere]')].some(x=>viz(x)&&peste(x,E));
  const cx=b.left+b.width/2,cy=b.top+b.height/2,la=document.elementFromPoint(cx,cy);
  o.centru_liber=!!la&&(la===E||E.contains(la));
  const bi=ind.find(x=>x.getAttribute('data-lh-pentru')===T);
  if(bi){const u=bi.getBoundingClientRect();
    o.indiciu_text=(bi.innerText||bi.textContent||'').trim();
    o.indiciu_distanta=Math.round(Math.max(0,u.left-b.right,b.left-u.right,u.top-b.bottom,b.top-u.bottom));
    o.indiciu_in_fereastra=u.left>=-1&&u.top>=-1&&u.right<=vw+1&&u.bottom<=vh+1;}
  return o}"""

# Locuri GOALE în zona de lucru a aplicației (prima [data-lh-zona] vizibilă): puncte în care elementul de sub mouse ține
# de zona însăși (nu de o țintă din ea); dacă nu există, puncte pe alte ținte din zonă. Niciodată pe țintele din „excl”
# (nici în interiorul lor), nici pe o bulă / evidențiere. Clicul acolo = o greșeală nevinovată (nu schimbă fila, nu
# deschide meniuri); rotița acolo = derulare în document.
JS_PUNCTE_GOALE = """([a,excl,n])=>{const L=window.__LHA(),r=document.querySelector('[data-lh-aplicatie="'+a+'"]');if(!r)return [];""" + CANON + """
  const viz=e=>{const b=e.getBoundingClientRect();if(b.width<4||b.height<4)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'};
  const z=[...r.querySelectorAll('[data-lh-zona]')].filter(viz)[0];if(!z)return [];
  z.scrollIntoView({block:'center',inline:'nearest'});
  const ex=new Set(excl||[]);const exEl=(excl||[]).map(t=>{let e=null;try{e=L&&L.element?L.element(a,t):null}catch(x){}
    if(!e)e=[...r.querySelectorAll('[data-lh-tinta]')].find(x=>canon(x)===t)||(t.startsWith('mso:')?r.querySelector('[data-lh-id-mso="'+CSS.escape(t.slice(4))+'"]'):null);return e}).filter(Boolean);
  const b=z.getBoundingClientRect(),x0=Math.max(b.left,0)+3,x1=Math.min(b.right,innerWidth)-3,y0=Math.max(b.top,0)+3,y1=Math.min(b.bottom,innerHeight)-3;
  const goale=[],alte=[];if(x1<=x0||y1<=y0)return [];
  for(let j=1;j<=9;j++)for(let i=1;i<=13;i++){const x=Math.round(x0+(x1-x0)*i/14),y=Math.round(y0+(y1-y0)*j/10),e=document.elementFromPoint(x,y);
    if(!e||!r.contains(e)||e.closest('[data-lh-indiciu],[data-lh-evidentiere]'))continue;
    if(exEl.some(t=>t===e||t.contains(e)))continue;
    const t=e.closest('[data-lh-tinta]'),c=t&&r.contains(t)?canon(t):'';if(c&&ex.has(c))continue;
    (!c||t===z||!z.contains(t)?goale:alte).push({x,y,tinta:c||null})}
  return goale.concat(alte).slice(0,n||4)}"""

JS_FOCUS_IN = """a=>{const r=document.querySelector('[data-lh-aplicatie="'+a+'"]');if(!r)return false;
  if(!r.contains(document.activeElement))try{r.focus({preventScroll:true})}catch(e){}return r.contains(document.activeElement)}"""


def rect_clic(pg, a, t):
    r = pg.evaluate("""([a,t])=>{const L=window.__LHA(),r=document.querySelector('[data-lh-aplicatie="'+a+'"]');let e=null;""" + CANON + """
      try{e=L.element?L.element(a,t):null}catch(x){}
      if(!e&&r)e=[...r.querySelectorAll('[data-lh-tinta]')].find(x=>canon(x)===t)||(t.startsWith('mso:')?r.querySelector('[data-lh-id-mso="'+CSS.escape(t.slice(4))+'"]'):null);
      if(!e)return null;e.scrollIntoView({block:'center',inline:'nearest'});const b=e.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2}}""", [a, t])
    if not r:
        raise RuntimeError("ținta „%s” nu e pe ecran" % t)
    pg.mouse.click(r["x"], r["y"])


def greseste(pg, a, excl, k):
    """O greșeală adevărată: clic într-un loc gol al zonei de lucru (al k-lea punct găsit, ca două clicuri să nu fie un
    dublu clic)."""
    pts = pg.evaluate(JS_PUNCTE_GOALE, [a, excl, 4])
    if not pts:
        raise RuntimeError("n-am găsit în zona de lucru ([data-lh-zona]) un loc unde să greșesc")
    p = pts[min(k, len(pts) - 1)]
    pg.mouse.click(p["x"], p["y"])
    return p


def bun_indiciu(f, T):
    m = []
    if not f.get("are_tinta"):
        return ["ținta nu e pe ecran"]
    if T not in (f.get("pentru") or []):
        m.append("niciun indiciu vizibil pentru T (vizibile: %s)" % f.get("pentru"))
        return m
    if f.get("indiciu_distanta") is None or f["indiciu_distanta"] > 48:
        m.append("indiciul e la %s px de țintă (> 48)" % f.get("indiciu_distanta"))
    if not f.get("indiciu_in_fereastra"):
        m.append("indiciul iese din fereastră")
    if not f.get("centru_liber"):
        m.append("indiciul/evidențierea acoperă centrul țintei")
    return m


def asteapta_indiciu(pg, a, T, pasi=15):
    """fotografia asistării pentru T, în cel mult pasi × 0,1 s, de îndată ce apare ORICE indiciu"""
    f = {}
    for _ in range(pasi):
        pg.wait_for_timeout(100)
        f = pg.evaluate(JS_FOTO, [a, T])
        if f.get("pentru"):
            break
    return f


def caz_A(pg, a, T, W):
    s0 = pg.evaluate(JS_STARE, a)
    pg.evaluate("window.__O9=[]")
    pg.evaluate("([a,T])=>window.__LHA().evidentiaza(T,{aplicatie:a})", [a, T])
    pg.wait_for_timeout(400)
    f = pg.evaluate(JS_FOTO, [a, T])
    m = []
    if not f.get("evidentiat"):
        m.append("ținta nu e marcată (data-lh-evidentiat / [data-lh-evidentiere])")
    if not f.get("tinta_in_fereastra"):
        m.append("ținta nu e în fereastră după evidențiere")
    if not f.get("centru_liber"):
        m.append("evidențierea acoperă centrul țintei")
    ev = pg.evaluate("window.__O9||[]")
    if ev:
        m.append("evidențierea a emis %d evenimente (a făcut un gest?)" % len(ev))
    if pg.evaluate(JS_STARE, a) != s0:
        m.append("evidențierea a schimbat starea aplicației")
    return m, f


def caz_B(pg, a, T, W):
    s0 = pg.evaluate(JS_STARE, a)
    pg.evaluate("window.__O9=[]")
    pg.evaluate("([a,T,x])=>window.__LHA().indiciu(T,x,{aplicatie:a})", [a, T, TEXT])
    pg.wait_for_timeout(400)
    f = pg.evaluate(JS_FOTO, [a, T])
    m = bun_indiciu(f, T)
    if f.get("indiciu_text") is not None and TEXT not in f["indiciu_text"]:
        m.append("textul indiciului nu e cel dat (%r)" % f["indiciu_text"][:60])
    if pg.evaluate("window.__O9||[]"):
        m.append("indiciul a emis evenimente")
    if pg.evaluate(JS_STARE, a) != s0:
        m.append("indiciul a schimbat starea aplicației")
    return m, f


def porneste_asistent(pg, a, T):
    return porneste_asistent_pasi(pg, a, [{"tinta": T, "indiciu": TEXT}])


def porneste_asistent_pasi(pg, a, pasi):
    return pg.evaluate("""([a,P])=>{try{window.__O9asist=window.__LHA().asistent(a,{pasi:P,dupaGreseli:2,dupaSecunde:30});return ''}
      catch(e){return 'asistent a eșuat: '+(e&&e.message||e)}}""", [a, pasi])


def caz_C(pg, a, T, W):
    err = porneste_asistent(pg, a, T)
    if err:
        return [err], {}
    pg.wait_for_timeout(200)
    rect_clic(pg, a, W)
    pg.wait_for_timeout(600)
    f1 = pg.evaluate(JS_FOTO, [a, T])
    m = []
    if f1.get("indicii_vizibile"):
        m.append("indiciu după O SINGURĂ greșeală (%s)" % f1.get("pentru"))
    rect_clic(pg, a, W)
    f = {}
    for _ in range(15):
        pg.wait_for_timeout(100)
        f = pg.evaluate(JS_FOTO, [a, T])
        if T in (f.get("pentru") or []):
            break
    m += bun_indiciu(f, T)
    if not f.get("evidentiat"):
        m.append("după 2 greșeli ținta nu e evidențiată")
    return m, {"dupa_1": f1, "dupa_2": f}


def caz_E(pg, a, T, W, c_ok):
    if not c_ok:
        return ["nu s-a ajuns la indiciu (cazul C a picat)"], {}
    rect_clic(pg, a, T)
    f = {}
    for _ in range(10):
        pg.wait_for_timeout(100)
        f = pg.evaluate(JS_FOTO, [a, T])
        if not f.get("indicii_vizibile") and not f.get("evidentiat"):
            break
    m = []
    if f.get("indicii_vizibile"):
        m.append("indiciul rămâne după pasul făcut")
    if f.get("evidentiat"):
        m.append("evidențierea rămâne după pasul făcut")
    return m, f


def caz_G(pg, a, T1, T2):
    """asistent de 2 pași: după pasul 1 făcut, indiciul (la 2 greșeli) vine pe ținta pasului 2, nu pe a pasului 1"""
    err = porneste_asistent_pasi(pg, a, [{"tinta": T1, "indiciu": TEXT + " (pasul 1)"}, {"tinta": T2, "indiciu": TEXT + " (pasul 2)"}])
    if err:
        return [err], {}
    pg.wait_for_timeout(200)
    rect_clic(pg, a, T1)                       # pasul 1, făcut corect, cu mouse-ul
    pg.wait_for_timeout(400)
    f0 = pg.evaluate(JS_FOTO, [a, T2])
    m = []
    if f0.get("indicii_vizibile"):
        m.append("indiciu imediat după pasul 1 făcut corect (%s)" % f0.get("pentru"))
    p1 = greseste(pg, a, [T1, T2], 0)
    pg.wait_for_timeout(600)
    f1 = pg.evaluate(JS_FOTO, [a, T2])
    if f1.get("indicii_vizibile"):
        m.append("indiciu după O SINGURĂ greșeală la pasul 2 (%s)" % f1.get("pentru"))
    p2 = greseste(pg, a, [T1, T2], 1)
    f = asteapta_indiciu(pg, a, T2)
    if T1 in (f.get("pentru") or []):
        m.append("indiciul e pe ținta pasului 1 (%s), deși pasul 1 e făcut: trebuia pe %s" % (T1, T2))
    m += ["pasul 2: " + x for x in bun_indiciu(f, T2)]
    if T2 in (f.get("pentru") or []) and not f.get("evidentiat"):
        m.append("după 2 greșeli la pasul 2, ținta pasului 2 nu e evidențiată")
    f_t1 = pg.evaluate(JS_FOTO, [a, T1])
    if f_t1.get("evidentiat"):
        m.append("ținta pasului 1 (deja făcut) e evidențiată")
    return m, {"T1": T1, "T2": T2, "dupa_pasul_1": f0, "greseala_1": p1, "dupa_1": f1, "greseala_2": p2, "dupa_2": f, "T1_dupa_2": f_t1}


def caz_H(pg, a, T, W):
    """rotița ×3 și săgeata în jos ×3 nu sunt greșeli (§6.3): fără indiciu; apoi numărătoarea merge (1 greșeală -> nimic,
    2 -> indiciul)"""
    err = porneste_asistent(pg, a, T)
    if err:
        return [err], {}
    pg.wait_for_timeout(200)
    pg.evaluate("window.__O9=[]")
    pts = pg.evaluate(JS_PUNCTE_GOALE, [a, [T, W], 2])
    if not pts:
        return ["n-am găsit în zona de lucru ([data-lh-zona]) un loc pentru derulare"], {}
    pg.mouse.move(pts[0]["x"], pts[0]["y"])
    for _ in range(3):
        pg.mouse.wheel(0, 120)
        pg.wait_for_timeout(150)
    focus = pg.evaluate(JS_FOCUS_IN, a)
    for _ in range(3):
        pg.keyboard.press("ArrowDown")
        pg.wait_for_timeout(150)
    pg.wait_for_timeout(600)
    f0 = pg.evaluate(JS_FOTO, [a, T])
    ev = pg.evaluate("window.__O9||[]")
    nr = sum(1 for e in ev if e and e.get("aplicatie") == a and e.get("gest") == "rotita")
    ns = sum(1 for e in ev if e and e.get("aplicatie") == a and e.get("gest") == "sageti")
    m = []
    if f0.get("indicii_vizibile"):
        m.append("indiciu după rotiță ×3 și săgeți ×3, fără nicio greșeală (le-a numărat ca greșeli)")
    if not nr:
        m.append("rotița peste zona de lucru n-a emis evenimentul „rotita”: cazul nu se poate judeca")
    if not ns:
        m.append("săgețile n-au emis evenimentul „sageti”%s: cazul nu se poate judeca" % ("" if focus else " (focusul nu e în aplicație)"))
    rect_clic(pg, a, W)
    pg.wait_for_timeout(600)
    f1 = pg.evaluate(JS_FOTO, [a, T])
    if f1.get("indicii_vizibile") and not f0.get("indicii_vizibile"):
        m.append("indiciu după O SINGURĂ greșeală adevărată: derularea/săgețile s-au adunat la greșeli")
    rect_clic(pg, a, W)
    f2 = asteapta_indiciu(pg, a, T)
    m += ["după derulare + 2 greșeli: " + x for x in bun_indiciu(f2, T)]
    return m, {"punct_derulare": pts[0], "evenimente": {"rotita": nr, "sageti": ns, "total": len(ev)},
               "dupa_derulare": f0, "dupa_1": f1, "dupa_2": f2}


def caz_D(br, baza, a, plecate, oprite):
    ctx = context_blocat(br, plecate, ceas=True, oprite=oprite, viewport={"width": 1366, "height": 768})
    pg = ctx.new_page()
    try:
        pg.goto(baza + "/" + POLIGON, wait_until="load", timeout=25000)
        pg.wait_for_function("!!window.__LHA()", timeout=8000)
        err = pg.evaluate(JS_DESCHIDE, a)
        if err:
            return [err], {}
        tw = pg.evaluate(JS_TINTE, [a, *TINTE[a]])
        if tw.get("eroare"):
            return [tw["eroare"]], {}
        T = tw["T"]
        err = porneste_asistent(pg, a, T)
        if err:
            return [err], {}
        pg.clock.run_for(28000)
        f28 = pg.evaluate(JS_FOTO, [a, T])
        pg.clock.run_for(3000)
        f31 = {}
        for _ in range(10):
            pg.wait_for_timeout(100)
            f31 = pg.evaluate(JS_FOTO, [a, T])
            if T in (f31.get("pentru") or []):
                break
        m = []
        if f28.get("indicii_vizibile"):
            m.append("indiciu înainte de 30 s (la 28 s)")
        m += ["la 31 s: " + x for x in bun_indiciu(f31, T)]
        return m, {"la_28s": f28, "la_31s": f31}
    finally:
        ctx.close()


# ---------------- cazul F: lecțiile jucate ----------------
RE_COMENTARIU = re.compile(r"<!--.*?-->", re.S)
RE_SCRIPT = re.compile(r"<script\b[^>]*>(.*?)</script>", re.S | re.I)
RE_CERE_ASISTENT = re.compile(r"\basistent\s*[:(]")
JS_BIB_GATA = "()=>{const L=window.__LHA();return !!(L&&typeof L.deschide==='function')}"
JS_ASISTENT_PORNIT = """a=>(window.__O9lectie||[]).some(x=>x.aplicatie===a&&x.pasi&&x.pasi.length)&&!!document.querySelector('[data-lh-aplicatie="'+a+'"]')"""
JS_LECTIE = """a=>{const L=window.__LHA(),l=(window.__O9lectie||[]);
  const ale=l.filter(x=>x.aplicatie===a&&x.pasi&&x.pasi.length),x=ale[ale.length-1]||null;
  let k=0,dinBib=null;if(x&&x.h&&typeof x.h.pas==='function'){try{dinBib=x.h.pas()}catch(e){}}
  if(typeof dinBib==='number'&&dinBib>=0&&x&&dinBib<x.pasi.length)k=dinBib;
  return {bib:!!(L&&typeof L.deschide==='function'),infasurat:window.__O9infasurat||0,
    asistenti:l.map(y=>({aplicatie:y.aplicatie,din:y.din,pasi:y.pasi,dupaGreseli:y.dupaGreseli,dupaSecunde:y.dupaSecunde})),
    radacina:!!document.querySelector('[data-lh-aplicatie="'+a+'"]'),pas_raportat:dinBib,k,
    tinta:x?x.pasi[k].tinta:null}}"""


def text_pagina(p):
    try:
        return (RAD / p).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def joaca_lectia(br, baza, a, p, plecate, oprite):
    """-> (stare, motive, detalii): stare = 'fara_bib' | 'fara_asistent' | 'jucat'."""
    ctx = context_blocat(br, plecate, lectie=True, oprite=oprite, viewport={"width": 1366, "height": 768})
    pg = ctx.new_page()
    jserr = []
    pg.on("pageerror", lambda e: jserr.append(str(e)[:160]))
    pg.on("dialog", lambda d: d.dismiss())
    try:
        pg.goto(baza + "/" + p, wait_until="load", timeout=25000)
        try:
            pg.wait_for_function(JS_BIB_GATA, timeout=8000)
        except Exception:
            return "fara_bib", [], {"erori_js": jserr[:3]}
        try:
            pg.wait_for_function(JS_ASISTENT_PORNIT, arg=a, timeout=5000)
        except Exception:
            pass
        info = pg.evaluate(JS_LECTIE, a)
        det = {"asistenti": info.get("asistenti"), "tinta_ceruta": info.get("tinta"), "pas_raportat": info.get("pas_raportat"),
               "erori_js": jserr[:3]}
        ale = [x for x in info.get("asistenti") or [] if x.get("aplicatie") == a and x.get("pasi")]
        if not ale:
            if not info.get("infasurat"):
                det["nota"] = "LH.aplicatii.asistent n-a putut fi înfășurat (obiect înghețat / proprietate nescriibilă?)"
            return "fara_asistent", [], det
        m = []
        x = ale[-1]
        if info.get("pas_raportat") not in (None, 0):
            m.append("asistentul lecției e la pasul %s fără niciun gest al elevului" % info.get("pas_raportat"))
        if x.get("dupaGreseli") not in (None, 2):
            m.append("lecția cere indiciul după %s greșeli (R7: după 2)" % x.get("dupaGreseli"))
        T = info.get("tinta")
        if not T:
            return "jucat", m + ["pasul curent al asistentului n-are țintă (doar „asteapta”): indiciul n-are unde apărea"], det
        if not info.get("radacina"):
            return "jucat", m + ["lecția pornește asistentul, dar aplicația „%s” nu e pe pagină" % a], det
        pg.wait_for_timeout(300)
        f0 = pg.evaluate(JS_FOTO, [a, T])
        if not f0.get("are_tinta"):
            return "jucat", m + ["ținta cerută de lecție „%s” nu e pe ecran" % T], dict(det, inainte=f0)
        if f0.get("indicii_vizibile"):
            m.append("indiciu înainte de orice greșeală (%s)" % f0.get("pentru"))
        p1 = greseste(pg, a, [T], 0)
        pg.wait_for_timeout(600)
        f1 = pg.evaluate(JS_FOTO, [a, T])
        if f1.get("indicii_vizibile") and not f0.get("indicii_vizibile"):
            m.append("indiciu după O SINGURĂ greșeală (%s)" % f1.get("pentru"))
        p2 = greseste(pg, a, [T], 1)
        f2 = asteapta_indiciu(pg, a, T)
        m += bun_indiciu(f2, T)
        if T in (f2.get("pentru") or []) and not f2.get("evidentiat"):
            m.append("după 2 greșeli ținta cerută nu e evidențiată")
        det.update(inainte=f0, greseala_1=p1, dupa_1=f1, greseala_2=p2, dupa_2=f2)
        return "jucat", m, det
    except Exception as e:
        return "jucat", ["proba lecției s-a oprit: " + str(e).splitlines()[0][:200]], {"erori_js": jserr[:3]}
    finally:
        ctx.close()


def caz_F(br, baza, a, inv, plecate, oprite):
    """-> listă de (ok, motive, detalii) — câte o intrare numărată."""
    pag = [p["pagina"] for p in inv.get("pagini", []) if p.get("aplicatia_principala") == a and p.get("tip_pagina", "lectie") == "lectie"]
    if PAGINI:
        pag = [p for p in pag if p in PAGINI]
    pag = [p for p in pag if (RAD / p).exists()]
    candidate = [p for p in pag if "aplicatii.js" in text_pagina(p)]
    out, cu_bib, jucate = [], [], []
    for p in candidate:
        stare, m, det = joaca_lectia(br, baza, a, p, plecate, oprite)
        det = dict(det, pagina=p, stare=stare)
        if stare == "fara_bib":
            continue                       # pomenește aplicatii.js, dar biblioteca nu apare: o lecție care NU o încarcă
        cu_bib.append(p)
        if stare == "fara_asistent":
            scripturi = " ".join(RE_SCRIPT.findall(RE_COMENTARIU.sub("", text_pagina(p))))
            if RE_CERE_ASISTENT.search(scripturi):
                out.append((False, ["lecția pomenește asistentul în scripturi, dar nu-l pornește (în 5 s de la încărcare)"], det))
            else:
                out.append((True, [], dict(det, nota=det.get("nota") or "fără asistent (nu se cere pe fiecare lecție)")))
            continue
        jucate.append(p)
        out.append((not m, m, det))
    if not cu_bib:
        out.append((False, ["nicio lecție cu %s (din %d; %d pomenesc aplicatii.js) nu încarcă aplicatii/aplicatii.js"
                            % (a, len(pag), len(candidate))], {"lectii": len(pag), "pomenesc": candidate[:5]}))
    elif not jucate:
        out.append((False, ["%d lecții cu %s încarcă biblioteca, dar niciuna nu pornește asistentul (R7: cel puțin o lecție pe aplicație)"
                            % (len(cu_bib), a)], {"cu_biblioteca": cu_bib[:5]}))
    return out


def apps_din_pagini():
    if not PAGINI:
        return APLICATII
    inv = json.loads(INVENTAR.read_text(encoding="utf-8"))
    s = {p.get("aplicatia_principala") for p in inv.get("pagini", []) if p["pagina"] in PAGINI}
    return [a for a in APLICATII if a in s]


def masoara():
    apps = apps_din_pagini()
    inv = json.loads(INVENTAR.read_text(encoding="utf-8")) if INVENTAR.exists() else {"pagini": []}
    srv, baza = server(RAD)
    plecate, oprite, rez = [], [], []
    from playwright.sync_api import sync_playwright
    try:
        with sync_playwright() as p:
            try:
                br = p.chromium.launch(channel="chrome", args=["--mute-audio"])
            except Exception:
                br = p.chromium.launch(args=["--mute-audio"])
            print("O9 · asistare: %d aplicații × %d cazuri · situl %s · Chrome %s" % (len(apps), len(CAZURI), RAD, br.version), flush=True)
            are_poligon = (RAD / POLIGON).exists()
            are_bib = False
            ctx = context_blocat(br, plecate, oprite=oprite, viewport={"width": 1366, "height": 768})
            pg = ctx.new_page()
            if are_poligon:
                try:
                    pg.goto(baza + "/" + POLIGON, wait_until="load", timeout=25000)
                    pg.wait_for_function("!!(window.__LHA()&&window.__LHA().deschide)", timeout=8000)
                    are_bib = True
                except Exception:
                    are_bib = False
            lipsa = ("pe sit nu există %s" % POLIGON) if not are_poligon else "pagina-poligon nu încarcă biblioteca (window.LH.aplicatii)"

            def noteaza(a, caz, ok, m, det):
                rez.append({"aplicatie": a, "caz": caz, "ok": ok, "motive": m, "detalii": det})
                unde = (" [%s]" % det.get("pagina")) if isinstance(det, dict) and det.get("pagina") else ""
                print(("  ok   " if ok else "  RĂU  ") + "%s · %s%s%s" % (a, caz, unde, "" if ok else ": " + "; ".join(m)[:200]), flush=True)

            for a in apps:
                c_ok = False
                tw = {}
                for caz in CAZURI:
                    if caz == "F_lectie_asculta":
                        try:
                            for ok, m, det in caz_F(br, baza, a, inv, plecate, oprite):
                                noteaza(a, caz, ok, m, det)
                        except Exception as e:
                            noteaza(a, caz, False, ["proba s-a oprit: " + str(e).splitlines()[0][:200]], {})
                        continue
                    m, det = [], {}
                    try:
                        if not are_bib:
                            m = [lipsa]
                        elif caz == "D_dupa_30_s":
                            m, det = caz_D(br, baza, a, plecate, oprite)
                        else:
                            if caz != "E_progres_ascunde":   # E continuă din starea lăsată de C
                                err = pg.evaluate(JS_DESCHIDE, a)
                                if err:
                                    raise RuntimeError(err)
                                pg.wait_for_timeout(150)
                                tw = pg.evaluate(JS_TINTE, [a, *(TINTE_G[a] if caz == "G_pasul_2" else TINTE[a])])
                                if tw.get("eroare"):
                                    raise RuntimeError(tw["eroare"])
                            if caz == "A_evidentiaza":
                                m, det = caz_A(pg, a, tw["T"], tw["W"])
                            elif caz == "B_indiciu":
                                m, det = caz_B(pg, a, tw["T"], tw["W"])
                            elif caz == "C_dupa_2_greseli":
                                m, det = caz_C(pg, a, tw["T"], tw["W"])
                                c_ok = not m
                            elif caz == "E_progres_ascunde":
                                m, det = caz_E(pg, a, tw.get("T"), tw.get("W"), c_ok)
                            elif caz == "G_pasul_2":
                                m, det = caz_G(pg, a, tw["T"], tw["W"])
                            elif caz == "H_derularea_nu_e_greseala":
                                m, det = caz_H(pg, a, tw["T"], tw["W"])
                    except Exception as e:
                        m = ["proba s-a oprit: " + str(e).splitlines()[0][:200]]
                    noteaza(a, caz, not m, m, det)
            ctx.close()
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    return rez, plecate, oprite


def rezuma(rez, plecate, oprite):
    rele = [r for r in rez if not r["ok"]]
    total = len(rele) + (1 if not rez and not PAGINI else 0)
    IESIRE.mkdir(parents=True, exist_ok=True)
    DETALII.write_text(json.dumps({
        "oracol": "O9 oracol_asistare (R7)", "generat": time.strftime("%Y-%m-%d %H:%M:%S"), "radacina": str(RAD),
        "numere": {"cazuri": len(rez), "picate": len(rele), "total": total}, "tinte": TINTE, "tinte_g": TINTE_G,
        "cazuri": rez, "cereri_abandonate": len(plecate), "cereri_locale_oprite": len(oprite)}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Rezultat: %d din %d cazuri de asistare picate" % (len(rele), len(rez)))
    print(str(DETALII))
    print(total)
    return total


# ---------------- --autotest: jucăria curată -> doar F (nicio lecție); greșeli plantate -> mai mult ----------------
MUTANTI = [
    ("indiciul stă departe de țintă", "b.style.top=`${r.bottom-R.top+6}px`;", "b.style.top=`${R.height+400}px`;"),
    ("indiciul acoperă ținta", "b.style.top=`${r.bottom-R.top+6}px`;", "b.style.top=`${r.top-R.top}px`;b.style.left=Math.max(0,r.left-R.left-4)+'px';b.style.minWidth=(r.width+8)+'px';b.style.minHeight=(r.height+8)+'px';"),
    ("indiciul după O singură greșeală", "gres++;if(gres>=(cfg.dupaGreseli||2))arata()", "gres++;if(gres>=1)arata()"),
    ("fără indiciu la 30 s", "timer=setTimeout(arata,(cfg.dupaSecunde||30)*1000)", "timer=0"),
    ("indiciul la 10 s", "timer=setTimeout(arata,(cfg.dupaSecunde||30)*1000)", "timer=setTimeout(arata,10000)"),
    ("evidențierea nu marchează", "e.setAttribute('data-lh-evidentiat','');", "void 0;"),
    ("indiciul rămâne după pasul făcut", "if(bun){L.ascunde();k++;", "if(bun){k++;"),
    ("asistarea face gestul în locul elevului", "return e;/*M:evid-sfarsit*/", "e.click();return e;"),
    ("indiciul rămâne pe ținta primului pas", "const arata=()=>{const p=pas();", "const arata=()=>{const p=cfg.pasi[0];"),
    ("derularea și săgețile se numără ca greșeli", "if(NEGRESELI.has(ev.gest))return;", ""),
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


def prima_lectie(a):
    inv = json.loads(INVENTAR.read_text(encoding="utf-8"))
    return next(p["pagina"] for p in inv["pagini"] if p.get("aplicatia_principala") == a and p.get("tip_pagina", "lectie") == "lectie")


def scrie_lectie(rad, pagina, corp):
    f = rad / pagina
    f.parent.mkdir(parents=True, exist_ok=True)
    sus = "../" * (len(Path(pagina).parts) - 1)
    f.write_text(corp.replace("{SUS}", sus), encoding="utf-8")


def autotest():
    tmp = Path(tempfile.mkdtemp(prefix="lh_o9_"))
    rele = 0
    asteptat = len(APLICATII)   # jucăria n-are lecții: pică doar F, câte unul pe aplicație
    try:
        juc = tmp / "rad"
        (juc / "aplicatii").mkdir(parents=True)
        for x in ("aplicatii.js", "poligon.html"):
            shutil.copy2(AICI / "_jucarie" / x, juc / "aplicatii" / x)
        b0, l0 = ruleaza(juc, tmp / "i0")
        ok0 = b0 == asteptat
        rele += not ok0
        print("  %s  jucăria curată: %s cazuri picate (așteptat %d: doar F, nicio lecție în copie)%s" % ("ok " if ok0 else "RĂU", b0, asteptat,
              "" if ok0 else " — " + " | ".join(x for x in l0 if "RĂU" in x and "F_lectie" not in x)[:700]), flush=True)
        # F pe dos: (1) o lecție Explorer care deschide aplicația și pornește asistentul -> F trece pentru Explorer (jucată:
        # 2 greșeli -> indiciul pe „Nou”); (2) o lecție Word care doar POMENEȘTE biblioteca într-un comentariu -> F tot pică
        # (înainte, căutarea de text o trecea); (3) o lecție Paint care încarcă biblioteca fără asistent -> F tot pică
        # („niciuna nu pornește asistentul”).
        scrie_lectie(juc, prima_lectie("explorer"), '<!doctype html><meta charset="utf-8"><div id="loc"></div>'
                     '<script src="{SUS}aplicatii/aplicatii.js"></script><script>LH.aplicatii.deschide("explorer",{loc:document.getElementById("loc")})'
                     '.then(()=>LH.aplicatii.asistent("explorer",{pasi:[{tinta:"bara_comenzi:Nou",indiciu:"Apasă Nou"}],dupaGreseli:2,dupaSecunde:30}))</script>')
        scrie_lectie(juc, prima_lectie("word"), '<!doctype html><meta charset="utf-8"><!-- <script src="{SUS}aplicatii/aplicatii.js"></script> '
                     'LH.aplicatii.asistent("word",{pasi:[]}) --><p>Lecția veche, fără bibliotecă.</p>')
        scrie_lectie(juc, prima_lectie("paint"), '<!doctype html><meta charset="utf-8"><div id="loc"></div>'
                     '<script src="{SUS}aplicatii/aplicatii.js"></script><script>LH.aplicatii.deschide("paint",{loc:document.getElementById("loc")})</script>')
        b1, l1 = ruleaza(juc, tmp / "i1")
        okf = b1 == asteptat - 1
        rele += not okf
        print("  %s  F: lecția Explorer cu asistent (jucată) + Word doar cu comentariu + Paint fără asistent -> %s (așteptat %d)%s"
              % ("ok " if okf else "RĂU", b1, asteptat - 1, "" if okf else " — " + " | ".join(x for x in l1 if "F_lectie" in x)[:700]), flush=True)
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
            prins = n is not None and b1 is not None and n > b1
            rele += not prins
            print("  %s  mutant „%s”: %s -> %s %s" % ("ok " if prins else "RĂU", nume, b1, n, "PRINS" if prins else "SCĂPAT"), flush=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print("Autotest O9: jucăria + lecțiile-jucărie + %d mutanți; verificări picate / mutanți scăpați: %d" % (len(MUTANTI), rele))
    print("(autotestul nu scrie detalii; copiile temporare au fost șterse)")
    print(rele)
    return rele


def main():
    ap = argparse.ArgumentParser(description="O9: evidențiere + indiciu, la condiția cerută, prin biblioteca centrală")
    ap.add_argument("--autotest", action="store_true")
    a = ap.parse_args()
    if a.autotest:
        return 1 if autotest() else 0
    rez, plecate, oprite = masoara()
    return 1 if rezuma(rez, plecate, oprite) else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except BaseException:
        traceback.print_exc()
        print("PRĂBUȘIRE (nu e un număr de probleme)")
        sys.exit(2)
