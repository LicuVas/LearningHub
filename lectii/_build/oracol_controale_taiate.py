# -*- coding: utf-8 -*-
"""Oracolul controalelor tăiate (10.11.2026) — LearningHub, lecțiile cu simulator (lectii/<clasa>/<lectie>/index.html).

De ce: la VIII/18 (atelier) meniul Fișier din Notepad-ul simulat era tăiat de fereastră (overflow:hidden): Salvați și
Salvați ca nu se vedeau, pe orice ecran, în 9 lecții, din 06.10. Probele treceau: clicul Playwright pe un buton tăiat
REUȘEȘTE, fiindcă scrollIntoView derulează și containerele overflow:hidden (elevul nu poate). Aici nu se dă niciun clic
de „verificare”: se măsoară ce vede elevul.

Ce numără — comenzile din simulator pe care elevul NU le poate folosi:
  TAIAT     centrul comenzii e în afara unui părinte cu overflow hidden/clip (nu se vede și nu se poate derula până la ea);
  ACOPERIT  după ce derulez DOAR pagina ca centrul să fie în ecran, acolo e alt element (elementFromPoint);
  IN_AFARA  centrul iese din ecran pe orizontală (pagina nu se derulează lateral).
Un părinte cu overflow auto/scroll care chiar se derulează = comanda e accesibilă (elevul derulează), nu se numără;
la ACOPERIT, cutiile care se derulează (panglica, listele) sunt derulate întâi până la comandă, ca de elev.

Unde: pe fiecare simulator al fiecărei lecții, primul exercițiu din pași și primul din atelier (fereastra se repetă în
„încă unul”; locuri(cfg, toate=True) le ia pe toate):
  A) starea de pornire: toate comenzile vizibile din simulator (TAIAT / IN_AFARA; ACOPERIT doar dacă nu e un dialog deschis);
  B) fiecare buton care deschide ceva (aria-haspopup, aria-expanded, data-meniu, data-act=meniu|grup|sub:…, text cu ▾):
     îl apăs, iar comenzile APĂRUTE (meniul, lista, panoul) trebuie să fie toate folosibile; un nivel mai jos (submeniuri) la fel.
     După fiecare buton, exercițiul se redeschide curat.
  C) clic dreapta (din 11.11.2026): PointerEvent('contextmenu', clientX/Y) pe elementFromPoint în 3 puncte spre marginea
     de jos/dreapta a ferestrei simulatorului — mijlocul ultimului rând, dreapta lui, golul de sub el (fără rânduri:
     50%/75%, 97%/75%, 97%/97% din fereastră); comenzile APĂRUTE (meniul contextual) + un nivel de submeniu, ca la B.
     Un punct care nu cade în fereastră se sare. Nu se numără ce a selectat clicul dreapta și acoperă meniul
     (substituentul în editare, mânerele pozei): meniul poate acoperi ce e sub el, ca în Windows (meniulPeste).
     Pe codul vechi al Explorer-ului (meniul așezat după o lățime presupusă de 230 px), v/m2-l10: „Ștergere” TAIAT pe
     toate 3 ecranele; reparat: 0 (11.11.2026). Cele 69 de lecții cu simulatoare care au clic dreapta: ~11 min cu 8 procese.
Nu acoperă: ferestrele de dialog deschise de comenzi (Salvare ca etc.), întrebările din modul test (qs), clicul dreapta
în alte puncte decât cele 3 de la C.
Ecrane: laptop 1366x657 (laboratorul, fereastra browserului pe un ecran 1366x768), același laptop cu zoom Windows 125%
(1093x525 CSS, densitate 1,25) și telefon (Pixel 7). Durata: ~10 min pe toate cele 116 lecții, cu 10 procese.
Proba pe codul vechi: OC_INLOCUIESTE="editorweb.js=C:/…/editorweb_vechi.js" — VIII/18 vechi: 52, reparat: 0 (10.11.2026);
OC_INLOCUIESTE="explorer-operatii.js=C:/…/explorer-operatii_vechi.js" --lectii v/m2-l10 — vechi: 3, reparat: 0 (11.11.2026).
Rețeaua externă e blocată (regula 24): trec doar file:, data:, blob:, 127.0.0.1, localhost. Nu pornește nicio aplicație.

Ieșire: defectele (unice pe ecran + lecție + simulator + buton + comandă + fel), erorile de măsurare, iar pe ULTIMA linie
un singur număr = defecte + erori (o măsurătoare ratată nu trece drept curată).
Folosire:
  python oracol_controale_taiate.py                       # toate lecțiile, 6 procese
  python oracol_controale_taiate.py --lectii viii/m3-l18,v/m3-l18 --procese 1
  python oracol_controale_taiate.py --json raport.json   # și lista completă, pentru agenți
"""
import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

R = Path(__file__).resolve().parents[2]          # C:\00\Projects\LearningHub
LECTII = R / "lectii"
CLASE = ("v", "vi", "vii", "viii")
BUILTIN = {"choice", "tf", "order", "classify", "match", "hunt", "pick"}
ECRANE = {"laptop": {"viewport": {"width": 1366, "height": 657}},
          "zoom125": {"viewport": {"width": 1093, "height": 525}, "device_scale_factor": 1.25},   # laptopul cu zoom Windows 125%
          "telefon": None}

JS_LIB = r"""
window.__oc = (function(){
  const root = () => document.getElementById('body');
  const SEL_CTRL = 'button,[role=menuitem],[role=menuitemradio],[role=menuitemcheckbox],[role=option],[role=button],[role=tab],a[href],input:not([type=hidden]),select,textarea,[data-act],[data-cmd]';
  const SEL_TRIG = '[aria-haspopup],[aria-expanded],[data-meniu],[data-act="meniu"],[data-act^="sub:"],[data-act="grup"],[data-act="pop"],[data-act="popup"],[data-act="drop"]';
  function vizibil(e){
    if(e.closest('[aria-hidden="true"],[hidden],[inert]')) return false;
    if(e.disabled) return false;
    /* conținutul unui <details> închis are cutii, dar nu se desenează (content-visibility): nu e o comandă de folosit acum */
    if(e.checkVisibility&&!e.checkVisibility({contentVisibilityAuto:true,opacityProperty:true,visibilityProperty:true})) return false;
    for(let d=e.closest('details');d;d=d.parentElement&&d.parentElement.closest('details')){ if(!d.open&&!(e.closest('summary')&&e.closest('summary').parentElement===d)) return false; }
    const cs=getComputedStyle(e); if(cs.visibility==='hidden'||cs.display==='none'||parseFloat(cs.opacity)===0) return false;
    const r=e.getBoundingClientRect(); return r.width>3&&r.height>3;
  }
  function eticheta(e){
    let t=(e.getAttribute('aria-label')||e.getAttribute('title')||e.textContent||e.value||e.getAttribute('placeholder')||'').replace(/\s+/g,' ').trim();
    if(!t) t='<'+e.tagName.toLowerCase()+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:'')+'>';
    return t.slice(0,48);
  }
  function semn(e){
    const d=[...e.attributes].filter(a=>a.name.startsWith('data-')||a.name==='aria-label'||a.name==='role').map(a=>a.name+'='+a.value).join('|');
    return e.tagName+'|'+eticheta(e)+'|'+d;
  }
  function controale(){
    const r=root(); if(!r) return [];
    return [...r.querySelectorAll(SEL_CTRL)].filter(vizibil);
  }
  function descrie(a){return a.tagName.toLowerCase()+(a.className&&typeof a.className==='string'?'.'+a.className.trim().split(/\s+/).join('.'):'')}
  /* TAIAT: centrul în afara unui părinte cu overflow hidden/clip; un părinte care se derulează = accesibil */
  function taiat(e){
    const r=e.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
    for(let a=e.parentElement;a&&a!==document.body&&a!==document.documentElement;a=a.parentElement){
      const cs=getComputedStyle(a),ar=a.getBoundingClientRect();
      const inY=cy>=ar.top+1&&cy<=ar.bottom-1, inX=cx>=ar.left+1&&cx<=ar.right-1;
      const oy=cs.overflowY, ox=cs.overflowX;
      if(!inY&&(oy==='hidden'||oy==='clip')) return descrie(a)+' (overflow-y:'+oy+', '+Math.round(ar.height)+' px)';
      if(!inX&&(ox==='hidden'||ox==='clip')) return descrie(a)+' (overflow-x:'+ox+', '+Math.round(ar.width)+' px)';
      if(!inY&&(oy==='auto'||oy==='scroll')){ if(a.scrollHeight>a.clientHeight+1) return null; return descrie(a)+' (overflow-y:'+oy+' fără derulare)'; }
      if(!inX&&(ox==='auto'||ox==='scroll')){ if(a.scrollWidth>a.clientWidth+1) return null; return descrie(a)+' (overflow-x:'+ox+' fără derulare)'; }
    }
    return null;
  }
  /* ACOPERIT / IN_AFARA: derulez DOAR pagina, apoi elementFromPoint pe centru */
  function lovit(e){
    /* întâi derulez cutiile care chiar se derulează (panglica Word/Excel, listele), ca elevul; taiat() a dat null, deci
       nicio cutie overflow:hidden/clip nu taie comanda — scrollIntoView nu ascunde aici nimic */
    try{e.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})}catch(x){e.scrollIntoView(false)}
    let r=e.getBoundingClientRect();
    const tinta=window.scrollY+r.top+r.height/2-innerHeight/2;
    window.scrollTo({left:window.scrollX,top:Math.max(0,tinta),behavior:'instant'});
    r=e.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    if(cx<0||cx>innerWidth) return {fel:'IN_AFARA',cine:'x='+Math.round(cx)+' din '+innerWidth};
    if(cy<0||cy>innerHeight) return {fel:'IN_AFARA',cine:'y='+Math.round(cy)+' din '+innerHeight+' (pagina nu mai coboară)'};
    const h=document.elementFromPoint(cx,cy);
    if(!h) return {fel:'IN_AFARA',cine:'nimic la centru'};
    if(h===e||e.contains(h)) return null;
    if(h.closest&&(h.closest('label')&&h.closest('label').contains(e))) return null;
    return {fel:'ACOPERIT',el:h,cine:descrie(h)+(h.textContent?' „'+h.textContent.replace(/\s+/g,' ').trim().slice(0,30)+'”':'')};
  }
  /* la C: clicul dreapta selectează și ce e sub el (substituentul intră în editare, apar mânerele pozei), iar meniul
     contextual le acoperă — ca în Windows, nu e defect (meniul poate acoperi ce e sub el). Adevărat când h (cel care
     acoperă) e o comandă APĂRUTĂ, într-o cutie position:absolute/fixed (meniul) care NU conține și comanda acoperită;
     două comenzi din același meniu care se suprapun rămân defect. */
  function meniulPeste(h,e,noi){
    if(!noi||!h||!noi.some(n=>n===h||n.contains(h))) return false;
    for(let a=h;a&&a!==document.body;a=a.parentElement){const p=getComputedStyle(a).position; if(p==='absolute'||p==='fixed') return !a.contains(e);}
    return false;
  }
  function dialogDeschis(){const r=root();return !!(r&&r.querySelector('[role=dialog],[role=alertdialog]'))}
  /* C) clic dreapta (11.11.2026). Fereastra simulatorului = cel mai mare descendent din #body cu overflow hidden/clip
     (peste 200x120 px; altfel #body). „Ultimul rând” = cel mai de jos element vizibil din fereastră, cu text, care se
     repetă (are un frate cu aceeași etichetă și clasă), înalt de 12-72 px și lat de cel puțin 30% din fereastră, dintr-o
     listă cu rânduri late (vezi ultimulRand); la egalitate de înălțime, cel mai lat (rândul, nu celula). */
  function fereastra(){
    const b=root(); if(!b) return null; let best=null,ba=0;
    for(const e of b.querySelectorAll('*')){const cs=getComputedStyle(e); if(!/hidden|clip/.test(cs.overflow+cs.overflowX+cs.overflowY)) continue;
      const r=e.getBoundingClientRect(),a=r.width*r.height; if(r.width>200&&r.height>120&&a>ba){ba=a;best=e}}
    return best||b;
  }
  function ultimulRand(w){
    /* rândurile se grupează după părinte; rămân listele cu rândurile cele mai late (cel puțin 90% din cea mai lată:
       conținutul ferestrei, nu panoul de navigare din stânga) și dintre ele câștigă rândul cel mai de jos (pe telefon
       panourile stau unul sub altul, la aceeași lățime) */
    const r=w.getBoundingClientRect(),sus=Math.max(r.top,0),jos=Math.min(r.bottom,innerHeight),gr=new Map();
    for(const e of w.querySelectorAll('*')){
      const q=e.getBoundingClientRect();
      if(q.height<12||q.height>72||q.width<r.width*0.3||q.top<sus-1||q.bottom>jos+1) continue;
      const p=e.parentElement,cl=e.getAttribute('class');
      if(!p||![...p.children].some(f=>f!==e&&f.tagName===e.tagName&&f.getAttribute('class')===cl)) continue;
      if(!(e.textContent||'').trim()) continue;
      const h=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2); if(!h||!(h===e||e.contains(h))) continue;
      const g=gr.get(p)||{lat:0,e:null,q:null}; g.lat=Math.max(g.lat,q.width);
      if(!g.q||q.bottom>g.q.bottom+1||(Math.abs(q.bottom-g.q.bottom)<=1&&q.width>g.q.width)){g.e=e;g.q=q}
      gr.set(p,g);
    }
    const max=Math.max(0,...[...gr.values()].map(g=>g.lat)); let best=null;
    for(const g of gr.values()) if(g.lat>=max*0.9&&(!best||g.q.bottom>best.q.bottom)) best=g;
    return best&&best.e;
  }
  /* punctul k (0 = mijlocul ultimului rând, 1 = dreapta lui, 2 = golul de sub el) după ce derulez DOAR pagina, ca
     partea de jos a ferestrei să fie în ecran; fără rând: 50%/75%, 97%/75%, 97%/97% din fereastră.
     null = punctul nu cade în fereastra simulatorului */
  function punctCtx(k){
    const w=fereastra(); if(!w) return null;
    let r=w.getBoundingClientRect();
    window.scrollTo({left:window.scrollX,top:Math.max(0,window.scrollY+r.bottom-innerHeight*0.8),behavior:'instant'});
    r=w.getBoundingClientRect();
    const rd=ultimulRand(w),q=rd&&rd.getBoundingClientRect(); let x,y,cum;
    if(q){const cy=q.top+q.height/2,gol=Math.min(r.bottom,innerHeight)-q.bottom;
      if(k===0){x=q.left+q.width/2;y=cy;cum='ultimul rând'}
      else if(k===1){x=q.right-6;y=cy;cum='dreapta ultimului rând'}
      else{x=q.right-6;y=gol>16?q.bottom+Math.min(24,gol/2):r.bottom-4;cum='golul de jos'}}
    else{const f=[[0.5,0.75],[0.97,0.75],[0.97,0.97]][k];x=r.left+r.width*f[0];y=r.top+r.height*f[1];cum=Math.round(f[0]*100)+'%/'+Math.round(f[1]*100)+'% din fereastră'}
    x=Math.max(1,Math.min(x,innerWidth-2)); y=Math.max(1,Math.min(y,innerHeight-2));
    const h=document.elementFromPoint(x,y);
    return h&&w.contains(h)?{x,y,cum}:null;
  }
  function verifica(lista,cuAcoperit,noi){
    const out=[];
    for(const e of lista){
      if(!e.isConnected||!vizibil(e)) continue;
      const t=taiat(e);
      if(t){out.push({fel:'TAIAT',ctrl:eticheta(e),cine:t});continue}
      if(cuAcoperit){const l=lovit(e); if(l&&!meniulPeste(l.el,e,noi)) out.push({fel:l.fel,ctrl:eticheta(e),cine:l.cine});}
      else{const r=e.getBoundingClientRect(),cx=r.left+r.width/2; if(cx<0||cx>innerWidth) out.push({fel:'IN_AFARA',ctrl:eticheta(e),cine:'x='+Math.round(cx)+' din '+innerWidth});}
    }
    return out;
  }
  return {
    baza(){ const r=root(); if(!r) return {err:'fără #body'}; return {defecte:verifica(controale(),!dialogDeschis())}; },
    declansatori(){ return [...(root()||document).querySelectorAll(SEL_TRIG)].filter(vizibil).filter(e=>!e.closest('[role=dialog],[role=alertdialog]'))
       .concat(controale().filter(e=>/[▾▼]\s*$/.test(e.textContent||'')&&!e.matches(SEL_TRIG))).map(e=>({et:eticheta(e),semn:semn(e)})); },
    inainte(){ window.__ocInainte=new Set(controale().map(semn)); },
    apasa(sn){ const e=[...(root()||document).querySelectorAll(SEL_CTRL+','+SEL_TRIG)].find(x=>semn(x)===sn&&vizibil(x)); if(!e) return false;
       const o={bubbles:true,cancelable:true,composed:true};
       try{e.dispatchEvent(new PointerEvent('pointerdown',o));e.dispatchEvent(new MouseEvent('mousedown',o));e.dispatchEvent(new PointerEvent('pointerup',o));e.dispatchEvent(new MouseEvent('mouseup',o));}catch(x){}
       e.click(); return true; },
    /* ctx=true doar la pasul C (clic dreapta): vezi meniulPeste */
    aparute(ctx){ const v=window.__ocInainte||new Set(); const noi=controale().filter(e=>!v.has(semn(e)));
       return {n:noi.length,defecte:verifica(noi,true,ctx?noi:null),sub:noi.filter(e=>e.matches(SEL_TRIG)).map(e=>({et:eticheta(e),semn:semn(e)}))}; },
    punctCtx,
    /* clic dreapta: PointerEvent('contextmenu') cu clientX/Y pe elementul de la punct (elementFromPoint), ca de la mouse */
    dreapta(x,y){ const h=document.elementFromPoint(x,y); if(!h) return false;
       const o={bubbles:true,cancelable:true,composed:true,clientX:x,clientY:y,button:2,buttons:2,pointerType:'mouse',view:window};
       let ev; try{ev=new PointerEvent('contextmenu',o)}catch(er){ev=new MouseEvent('contextmenu',o)}
       h.dispatchEvent(ev); return true; },
  };
})();
"""


# proba pe codul vechi: OC_INLOCUIESTE="editorweb.js=C:/cale/editorweb_vechi.js;paint.js=…" servește fișierul dat în locul simulatorului
INLOC = dict(x.split("=", 1) for x in os.environ.get("OC_INLOCUIESTE", "").split(";") if "=" in x)


def ruta(r):
    u = r.request.url
    for nume, cale in INLOC.items():
        if u.endswith("/_sim/" + nume):
            return r.fulfill(path=cale, content_type="application/javascript")
    if u.startswith(("file:", "data:", "blob:")) or "127.0.0.1" in u or "localhost" in u:
        return r.continue_()
    return r.abort()


def lectii_cu_sim():
    out = []
    for c in CLASE:
        for d in sorted((LECTII / c).glob("*/index.html")):
            if d.parent.name.startswith("_"):
                continue
            t = d.read_text(encoding="utf-8", errors="replace")
            # 11.11.2026 (T1, P2): orice lecție cu motor — unele își iau simulatorul din jocuri/_motor (panglica Word/PowerPoint,
            # foaia Excel: vi/m1-l04, vii/m1-l04, viii/m1-l04), nu din lectii/_sim; locuri() ia oricum doar exercițiile cu simulator
            if "JocMotor.porneste" in t:
                out.append(f"{c}/{d.parent.name}")
    # lecțiile-joc din jocuri/ care încarcă panglica sau un simulator (ex. jocuri/word-vii, jocuri/prezentari-vi)
    for d in sorted((R / "jocuri").glob("*/index.html")):
        if d.parent.name.startswith("_"):
            continue
        t = d.read_text(encoding="utf-8", errors="replace")
        if "JocMotor.porneste" in t and ("ui-panglica" in t or "/_sim/" in t):
            out.append(f"jocuri/{d.parent.name}")
    return out


def locuri(cfg, toate=False):
    """(eticheta, cum se deschide, tipul simulatorului): pe fiecare simulator al lecției, primul exercițiu din pași și
    primul din atelier (aceeași fereastră se repetă în „încă unul”; toate=True le ia pe toate)"""
    L = locuri_toate(cfg)
    if toate:
        return L
    vazut, out = set(), []
    for loc, cum, t in L:
        k = (t, cum[0])
        if k not in vazut:
            vazut.add(k)
            out.append((loc, cum, t))
    return out


def locuri_toate(cfg):
    L = []
    for li, lv in enumerate(cfg.get("nivele") or []):
        for si, pas in enumerate(lv.get("pasi") or []):
            for ei, q in enumerate([e for e in [pas.get("incearca")] + list(pas.get("inca") or []) if e]):
                if isinstance(q, dict) and q.get("t") and q["t"] not in BUILTIN:
                    L.append((f"N{li+1}P{si+1}E{ei+1}", ("pas", li, si, ei), q["t"]))
        at = lv.get("atelier")
        if at:
            for ei, q in enumerate([at] + list(at.get("inca") or [])):
                if isinstance(q, dict) and q.get("t") and q["t"] not in BUILTIN:
                    L.append((f"N{li+1}A{'' if ei == 0 else 'E' + str(ei + 1)}", ("atelier", li, None, ei), q["t"]))
    return L


def masoara_lectie(p, b, lec, ecran, defecte, erori):
    a = dict(p.devices["Pixel 7"]) if ECRANE[ecran] is None else dict(ECRANE[ecran])
    ctx = b.new_context(**a)
    ctx.route("**/*", ruta)
    pg = ctx.new_page()
    pg.set_default_timeout(8000)
    jserr = []
    pg.on("pageerror", lambda e: jserr.append(str(e).splitlines()[0][:160]))
    url = ((R / lec) if lec.startswith("jocuri/") else (LECTII / lec)).joinpath("index.html").as_uri()
    nloc = 0

    def deschide(cum):
        fel, li, si, ei = cum
        pg.evaluate("document.getElementById('go-home')&&document.getElementById('go-home').click()")
        pg.click(f'.lvl[data-l="{li}"]')
        if fel == "pas":
            pg.evaluate(f"JocMotor.test.pas({si})")
        else:
            pg.evaluate("JocMotor.test.atelier()")
        pg.evaluate(f"JocMotor.test.exercitiu({ei})")
        pg.wait_for_timeout(120)
        pg.add_script_tag(content=JS_LIB) if not pg.evaluate("!!window.__oc") else None

    def adauga(ctxt, t, loc, trig, d):
        cheie = f"{ecran} | {lec} {loc} [{t}] | {d['fel']} | {('„' + trig + '” → ') if trig else ''}„{d['ctrl']}”"
        if cheie not in defecte:
            defecte[cheie] = d["cine"]

    try:
        pg.goto(url)
        pg.wait_for_timeout(500)
        for bid in ("#lhp-viz", "#lhp-x"):
            if pg.locator(bid).count() and pg.locator(bid).first.is_visible():
                pg.locator(bid).first.click()
        pg.evaluate("JocMotor.test.deblocheaza()")
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        pg.add_script_tag(content=JS_LIB)
        for loc, cum, t in locuri(cfg):
            nloc += 1
            try:
                deschide(cum)
                r = pg.evaluate("__oc.baza()")
                for d in r.get("defecte", []):
                    adauga(ecran, t, loc, None, d)
                trig = pg.evaluate("__oc.declansatori()")[:30]
                for tg in trig:
                    deschide(cum)
                    pg.evaluate("__oc.inainte()")
                    if not pg.evaluate("s=>__oc.apasa(s)", tg["semn"]):
                        continue
                    pg.wait_for_timeout(150)
                    ap = pg.evaluate("__oc.aparute()")
                    for d in ap["defecte"]:
                        adauga(ecran, t, loc, tg["et"], d)
                    for sb in ap["sub"][:8]:
                        pg.evaluate("__oc.inainte()")
                        if pg.evaluate("s=>__oc.apasa(s)", sb["semn"]):
                            pg.wait_for_timeout(150)
                            for d in pg.evaluate("__oc.aparute()")["defecte"]:
                                adauga(ecran, t, loc, tg["et"] + " › " + sb["et"], d)
                        deschide(cum)
                        pg.evaluate("__oc.inainte()")
                        pg.evaluate("s=>__oc.apasa(s)", tg["semn"])
                        pg.wait_for_timeout(120)
                # C) clic dreapta spre marginea de jos/dreapta a ferestrei: ultimul rând, dreapta lui, golul de jos;
                #    comenzile apărute (meniul contextual) + un nivel de submeniu, exact ca la pasul B
                for k in range(3):
                    deschide(cum)
                    pt = pg.evaluate(f"__oc.punctCtx({k})")
                    if not pt:
                        continue
                    pg.evaluate("__oc.inainte()")
                    if not pg.evaluate("p=>__oc.dreapta(p.x,p.y)", pt):
                        continue
                    pg.wait_for_timeout(150)
                    ap = pg.evaluate("__oc.aparute(true)")
                    if not ap["n"]:
                        continue
                    for d in ap["defecte"]:
                        adauga(ecran, t, loc, "clic dreapta", dict(d, cine=f"{d['cine']} (clic dreapta pe {pt['cum']})"))
                    for sb in ap["sub"][:8]:
                        pg.evaluate("__oc.inainte()")
                        if pg.evaluate("s=>__oc.apasa(s)", sb["semn"]):
                            pg.wait_for_timeout(150)
                            for d in pg.evaluate("__oc.aparute(true)")["defecte"]:
                                adauga(ecran, t, loc, "clic dreapta › " + sb["et"], dict(d, cine=f"{d['cine']} (clic dreapta pe {pt['cum']})"))
                        deschide(cum)
                        pt2 = pg.evaluate(f"__oc.punctCtx({k})")
                        pg.evaluate("__oc.inainte()")
                        if pt2:
                            pg.evaluate("p=>__oc.dreapta(p.x,p.y)", pt2)
                        pg.wait_for_timeout(120)
            except Exception as e:
                erori.append(f"{ecran} | {lec} {loc} [{t}] | {str(e).splitlines()[0][:160]}")
    except Exception as e:
        erori.append(f"{ecran} | {lec} | pagina: {str(e).splitlines()[0][:160]}")
    for e in jserr[:3]:
        erori.append(f"{ecran} | {lec} | eroare JS: {e}")
    ctx.close()
    return nloc


def lucreaza(lectii, out_json):
    from playwright.sync_api import sync_playwright
    defecte, erori, nloc_tot = {}, [], [0]
    with sync_playwright() as p:
        b = p.chromium.launch()
        for lec in lectii:
            for ecran in ECRANE:
                nloc_tot[0] += masoara_lectie(p, b, lec, ecran, defecte, erori) or 0
        b.close()
    Path(out_json).write_text(json.dumps({"defecte": defecte, "erori": erori, "locuri": nloc_tot[0]}, ensure_ascii=False), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lectii", help="listă cu virgulă, ex. viii/m3-l18,v/m3-l18 (implicit: toate cu simulator)")
    ap.add_argument("--procese", type=int, default=6)
    ap.add_argument("--json", help="scrie aici lista completă (defecte + erori)")
    ap.add_argument("--ecrane", help="doar aceste ecrane, cu virgulă (laptop,zoom125,telefon); implicit toate")
    ap.add_argument("--_bucata", help=argparse.SUPPRESS)
    ap.add_argument("--_iesire", help=argparse.SUPPRESS)
    a = ap.parse_args()
    if a.ecrane:
        os.environ["OC_ECRANE"] = a.ecrane
    if os.environ.get("OC_ECRANE"):
        for k in [k for k in ECRANE if k not in os.environ["OC_ECRANE"].split(",")]:
            del ECRANE[k]
    if a._bucata:
        lucreaza(a._bucata.split(","), a._iesire)
        return
    if a.lectii and a.lectii.startswith("@"):          # @fisier.txt = lista din fișier (lecțiile oracolului din buclă)
        a.lectii = Path(a.lectii[1:]).read_text(encoding="utf-8").strip()
    lectii = a.lectii.split(",") if a.lectii else lectii_cu_sim()
    n = max(1, min(a.procese, len(lectii)))
    bucati = [lectii[i::n] for i in range(n)]
    tmp = Path(tempfile.mkdtemp(prefix="oracol_taiate_"))
    t0 = time.time()
    procs = []
    for i, bc in enumerate(bucati):
        o = tmp / f"b{i}.json"
        procs.append((subprocess.Popen([sys.executable, __file__, "--_bucata", ",".join(bc), "--_iesire", str(o)],
                                       stdout=subprocess.DEVNULL, stderr=subprocess.PIPE), o, bc))
    defecte, erori, nloc = {}, [], 0
    for pr, o, bc in procs:
        _, err = pr.communicate()
        if o.exists():
            d = json.loads(o.read_text(encoding="utf-8"))
            defecte.update(d["defecte"])
            erori.extend(d["erori"])
            nloc += d.get("locuri", 0)
        else:
            erori.append(f"procesul pentru {len(bc)} lecții a căzut: {err.decode('utf-8', 'replace').strip().splitlines()[-1:]}")
    print(f"Lecții măsurate: {len(lectii)} · exerciții cu simulator măsurate (pe ecran): {nloc} · ecrane: {', '.join(ECRANE)} · {time.time() - t0:.0f} s")
    for k in sorted(defecte):
        print(f"[DEFECT] {k} — {defecte[k]}")
    for e in erori:
        print(f"[EROARE] {e}")
    if a.json:
        Path(a.json).write_text(json.dumps({"defecte": defecte, "erori": erori, "locuri": nloc}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"defecte: {len(defecte)} · erori de măsurare: {len(erori)}")
    print(f"total (defecte + erori): {len(defecte) + len(erori)}")
    print(len(defecte) + len(erori))


if __name__ == "__main__":
    main()
