"""Vede lectia cum o vede elevul (fara sa atinga ecranul utilizatorului). Versiunea 2 - 13.09.2026.

python H_vede.py <lectie.html> <folder_iesire> [--latime 1366 --inaltime 768]

v2 (dupa verificarea adversariala E_verificare_adversariala.md):
  - I6: situl e servit prin http://127.0.0.1 (cai /assets/... reale), nu file:// (care inventa resurse lipsa);
  - I7: PARCURGE lectia ca un elev care raspunde corect: captura la fiecare pas + sectiunile de dupa atomi;
  - I8: textul complet marcheaza ce e ASCUNS elevului ([ASCUNS: rezolvare] ...) si comprima spatiile;
  - rezolutia 1366x768 e o IPOTEZA (dotarea laboratorului nu e cunoscuta - B_context_real.md), nu un fapt.

Scrie in folder:
  ecran_prima_vedere.png      primul ecran
  proiector_25.png            primul ecran la 25%, contrast redus (aproximare grosiera a proiectorului)
  pas_NN.png                  cate o captura pe fiecare pas (atom), dupa ce a aparut
  dupa_atomi_NN.png           ecranele de dupa ultimul pas (exercitii, recapitulare)
  innerText_vizibil.txt       textul vazut la deschidere
  innerText.txt               tot textul, cu marcaje [ASCUNS: ...] pentru ce nu se vede fara actiune
  parcurgere.json             pe fiecare pas: cuvinte, intrebari, raspuns dat, s-a deblocat urmatorul?
  consola.json, masuri.json
"""
import argparse
import asyncio
import functools
import http.server
import json
import re
import socket
import threading
from pathlib import Path

from PIL import Image, ImageEnhance
from playwright.async_api import async_playwright

SITE = Path(r"C:\00\Projects\LearningHub")

ap = argparse.ArgumentParser()
ap.add_argument("lectie")
ap.add_argument("iesire")
ap.add_argument("--latime", type=int, default=1366)
ap.add_argument("--inaltime", type=int, default=768)
args = ap.parse_args()

lesson = Path(args.lectie).resolve()
out = Path(args.iesire).resolve()
out.mkdir(parents=True, exist_ok=True)
rel = lesson.relative_to(SITE).as_posix()

JS_TEXT = r"""
() => {
  const clone = document.body.cloneNode(true);
  // marcheaza in ORIGINAL ce e ascuns, apoi copiaza marcajul pe clona prin index
  const orig = [...document.body.querySelectorAll('*')];
  const copy = [...clone.querySelectorAll('*')];
  orig.forEach((el, k) => {
    const c = copy[k]; if (!c) return;
    if (el.tagName === 'DETAILS' && !el.open) c.setAttribute('data-ascuns', 'pliat, se deschide la clic: ' + (((el.querySelector('summary')||{}).innerText)||'').trim().slice(0,60));
    else if (el.classList && el.classList.contains('atom') && !el.offsetParent) c.setAttribute('data-ascuns', 'pas neajuns inca');
    else if (el.classList && (el.classList.contains('atom-hint') || el.classList.contains('atom-feedback'))) c.setAttribute('data-ascuns', 'indiciu/feedback dupa raspuns');
  });
  clone.querySelectorAll('script,style,template,noscript').forEach(n => n.remove());
  // pilot: textContent lipea elemente vecine („Pasul 1 din 110 din 11") -> separator la elementele de bloc/eticheta
  clone.querySelectorAll('div,p,li,h1,h2,h3,h4,h5,h6,button,td,th,tr,section,article,summary,label,span.ux-step-text,span.ux-step-pct,pre,br')
       .forEach(n => { n.insertAdjacentText('beforebegin', '\n'); });
  clone.querySelectorAll('[data-ascuns]').forEach(n => {
    if (n.parentElement && n.parentElement.closest('[data-ascuns]')) return;
    n.insertAdjacentText('afterbegin', '\n[ASCUNS: ' + n.getAttribute('data-ascuns') + ']\n');
    n.insertAdjacentText('beforeend', '\n[/ASCUNS]\n');
  });
  return clone.textContent;
}
"""

JS_MASURI = r"""
() => {
  function lum(c){const m=c.match(/\d+(\.\d+)?/g); if(!m) return null;
    const [r,g,b]=m.slice(0,3).map(v=>{v=v/255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4)});
    return 0.2126*r+0.7152*g+0.0722*b;}
  function bgOf(el){while(el){const c=getComputedStyle(el).backgroundColor; if(c && c!=='rgba(0, 0, 0, 0)' && c!=='transparent') return c; el=el.parentElement;} return 'rgb(255,255,255)';}
  const p=[...document.querySelectorAll('p')].find(x=>x.offsetParent && x.innerText.trim().length>60);
  let contrast=null, fg=null, bg=null;
  if(p){fg=getComputedStyle(p).color; bg=bgOf(p); const a=lum(fg), b=lum(bg); if(a!==null&&b!==null){contrast=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);}}
  return {titlu: document.title, h1: (document.querySelector('h1')||{}).innerText || '', lang: document.documentElement.lang,
          atomi: document.querySelectorAll('.atom').length, contrast_paragraf: contrast && +contrast.toFixed(2),
          culoare_text: fg, culoare_fundal: bg};
}
"""

JS_PAS = r"""
() => {
  const atomi = [...document.querySelectorAll('.atom')];
  const k = atomi.findIndex(a => a.offsetParent && !a.classList.contains('ux-step-hidden'));
  if (k < 0) return {k: -1};
  const a = atomi[k];
  const qs = [...a.querySelectorAll('.atom-question')];
  return {k, cuvinte: a.innerText.split(/\s+/).filter(Boolean).length, intrebari: qs.length,
          titlu: ((a.querySelector('h2,h3,.atom-title')||{}).innerText||'').slice(0,120)};
}
"""

JS_RASPUNDE = r"""
() => {
  const atomi = [...document.querySelectorAll('.atom')];
  const a = atomi.find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
  if (!a) return [];
  const rez = [];
  a.querySelectorAll('.atom-question').forEach(q => {
    if (q.querySelector('.atom-option.locked')) return;
    const bun = q.querySelector('.atom-option[data-answer="' + q.dataset.correct + '"]');
    if (bun) { rez.push({intrebare: (q.querySelector('.atom-question-text')||{}).innerText, raspuns: bun.innerText.trim().slice(0,160)}); bun.click(); }
    else rez.push({intrebare: (q.querySelector('.atom-question-text')||{}).innerText, raspuns: null, problema: 'varianta marcata corecta nu exista in pagina'});
  });
  return rez;
}
"""


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


class _Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):  # noqa: A002 - semnatura din biblioteca
        pass


def serve(port):
    handler = functools.partial(_Tacut, directory=str(SITE))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def compact(t: str) -> str:
    t = re.sub(r"[ \t\u00a0]+", " ", t)
    t = re.sub(r"\n\s*\n+", "\n\n", t)
    return t.strip() + "\n"


async def main():
    port = free_port()
    srv = serve(port)
    W, H = args.latime, args.inaltime
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": W, "height": H})
        cons = []
        pg.on("console", lambda m: cons.append({"tip": m.type, "text": m.text}) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: cons.append({"tip": "pageerror", "text": str(e)}))
        pg.on("requestfailed", lambda r: cons.append({"tip": "resursa_lipsa", "text": r.url}))
        pg.on("response", lambda r: cons.append({"tip": f"http_{r.status}", "text": r.url}) if r.status >= 400 else None)
        await pg.goto(f"http://127.0.0.1:{port}/{rel}")
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path=str(out / "ecran_prima_vedere.png"))
        vis = await pg.evaluate("document.body.innerText")
        full = compact(await pg.evaluate(JS_TEXT))
        m = await pg.evaluate(JS_MASURI)

        parc = []
        seen = set()
        for n in range(1, 200):
            st = await pg.evaluate(JS_PAS)
            if st["k"] < 0 or st["k"] in seen:
                break
            seen.add(st["k"])
            await pg.evaluate("(() => { const a=[...document.querySelectorAll('.atom')].find(x=>x.offsetParent && !x.classList.contains('ux-step-hidden')); if(a) a.scrollIntoView({block:'start'}); })()")
            await pg.wait_for_timeout(300)
            await pg.screenshot(path=str(out / f"pas_{n:02d}.png"))
            # pilot: la atomii lungi intrebarea era taiata -> si captura atomului INTREG (ce are elevul de parcurs la pasul asta)
            atom = pg.locator(".atom:not(.ux-step-hidden)").first
            if await atom.count() > 0 and await atom.is_visible():
                await atom.screenshot(path=str(out / f"pas_{n:02d}_atom_intreg.png"))
            raspunsuri = await pg.evaluate(JS_RASPUNDE)
            await pg.wait_for_timeout(500)
            nxt = pg.locator(".ux-step-next")
            deblocat = await nxt.count() > 0 and await nxt.first.is_visible() and await nxt.first.is_enabled()
            st.update({"pas": n, "raspunsuri": raspunsuri, "urmatorul_deblocat": bool(deblocat)})
            parc.append(st)
            if not deblocat:
                break
            await nxt.first.click()
            await pg.wait_for_timeout(600)

        # ce vine dupa atomi (exercitii, recapitulare): ecrane succesive
        await pg.evaluate("window.scrollTo(0, 0)")
        total_h = await pg.evaluate("document.body.scrollHeight")
        start = await pg.evaluate(r"""(() => { const a=[...document.querySelectorAll('.atom')].pop();
                 return a ? a.getBoundingClientRect().bottom + window.scrollY : 0; })()""")
        k = 0
        y = max(0, int(start) - 100)
        while y < total_h and k < 12:
            k += 1
            await pg.evaluate(f"window.scrollTo(0, {y})")
            await pg.wait_for_timeout(250)
            await pg.screenshot(path=str(out / f"dupa_atomi_{k:02d}.png"))
            y += H - 80
        await b.close()
    srv.shutdown()

    (out / "innerText_vizibil.txt").write_text(compact(vis), encoding="utf-8")
    (out / "innerText.txt").write_text(full, encoding="utf-8")
    (out / "parcurgere.json").write_text(json.dumps(parc, ensure_ascii=False, indent=1), encoding="utf-8")
    (out / "consola.json").write_text(json.dumps(cons, ensure_ascii=False, indent=1), encoding="utf-8")
    m.update({"rezolutie_ipoteza": f"{W}x{H}", "cuvinte_vizibile_la_deschidere": len(vis.split()),
              "cuvinte_total": len(re.sub(r"\[/?ASCUNS[^\]]*\]", " ", full).split()),
              "pasi_parcursi": len(parc), "pasi_blocati": sum(1 for s in parc if not s["urmatorul_deblocat"]),
              "ecrane_dupa_atomi": k, "linii_innerText": full.count("\n")})
    (out / "masuri.json").write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")
    # APROXIMARE GROSIERA, nu dovada: proiectorul mareste imaginea si o spala (contrast mic, negru ridicat).
    # Nu judeca lizibilitatea de la distanta din fisierul asta; masura utila e contrast_paragraf din masuri.json.
    im = Image.open(out / "ecran_prima_vedere.png").convert("RGB")
    im = ImageEnhance.Contrast(im).enhance(0.6)
    im = Image.blend(im, Image.new("RGB", im.size, (90, 90, 90)), 0.25)
    im.save(out / "proiector_25.png")
    print(json.dumps(m, ensure_ascii=False))
    print("consola:", len(cons), "| pasi:", len(parc))


asyncio.run(main())
