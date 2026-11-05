"""Proba pentru scor_partial.py: fiecare fișă din 05.11.2026 trimite testele bifate prin Prezenta.nota, și fără final.

Fără server real: pagina se servește local, iar window.Prezenta e înlocuit ÎNAINTE de pagină cu un înregistrator
(prezenta.js iese singur când găsește window.Prezenta), deci nu pleacă nimic spre evidența elevilor; orice cerere
în afara lui 127.0.0.1 e oprită. Pe fiecare fișă: bifăm „lacom” variante (radio / checkbox / select) până crește
contorul paginii, apoi cerem ca ULTIMA notă trimisă să aibă exact contorul paginii (N din M) și nota 1 + 9·N/M.

    python proba_scor_partial.py          # ultima linie = câte fișe au picat (0 = toate bune)
"""
import functools
import http.server
import re
import threading

from playwright.sync_api import sync_playwright

LH = r"C:\00\Projects\LearningHub"
PORT = 8793
FISE = {   # slug -> cum citesc contorul paginii (text cu „N din M”, sau N separat + M din alt loc)
    "xi-c": "#pastila", "xi-d": "#pastila", "xii-c": "#cnt", "x-e": "x", "x-b": "x", "maistri-i-f": "#pasi-tot",
}
INIT = """window.__note=[];window.__ev=[];
window.Prezenta={nota:function(s){window.__note.push(JSON.parse(JSON.stringify(s)))},
                 eveniment:function(e){window.__ev.push(JSON.parse(JSON.stringify(e)))}};"""

CONTOR_JS = """(sel)=>{
  // X E / X B: contorul afișat „N din M bifate” (M = testele care intră în socoteală; „Extindere” e în afara lor)
  if(sel==='x'){ var m0=document.querySelector('#teste .contor').textContent.match(/(\\d+)\\s*din\\s*(\\d+)/);
    return m0?[parseInt(m0[1],10),parseInt(m0[2],10)]:null; }
  var el=document.querySelector(sel); var m=el.textContent.match(/teste[^0-9]*(\\d+)\\s*din\\s*(\\d+)/i) || el.textContent.match(/(\\d+)\\s*din\\s*(\\d+)/);
  return m?[parseInt(m[1],10),parseInt(m[2],10)]:null; }"""

LACOM_JS = """(sel)=>{
  const contor=()=>{ if(sel==='x') return parseInt(document.querySelector('#nr-ok').textContent,10);
    const el=document.querySelector(sel); const m=el.textContent.match(/teste[^0-9]*(\\d+)\\s*din/i)||el.textContent.match(/(\\d+)\\s*din/); return m?+m[1]:0; };
  const fire=el=>{ el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); };
  let best=contor(), pasi=0;
  const grupe={}; document.querySelectorAll('input[type=radio]').forEach(r=>{ (grupe[r.name]=grupe[r.name]||[]).push(r); });
  for(const k in grupe){ let bun=null, b0=contor();
    for(const r of grupe[k]){ r.checked=true; fire(r); pasi++; const c=contor(); if(c>b0){ b0=c; bun=r; } }
    if(bun){ bun.checked=true; fire(bun); } }
  document.querySelectorAll('input[type=checkbox]').forEach(c=>{ const a=contor(); c.checked=!c.checked; fire(c); pasi++; if(contor()<a){ c.checked=!c.checked; fire(c); } });
  document.querySelectorAll('select').forEach(s=>{ let b0=contor(), bi=s.selectedIndex;
    for(let i=0;i<s.options.length;i++){ s.selectedIndex=i; fire(s); pasi++; const c=contor(); if(c>b0){ b0=c; bi=i; } }
    s.selectedIndex=bi; fire(s); });
  return {inainte:best, dupa:contor(), pasi:pasi}; }"""


def main():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=LH)
    h.log_message = lambda *a, **k: None
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    picate = 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        for slug, sel in FISE.items():
            ctx = br.new_context()
            ctx.route(re.compile(r"^(?!http://127\.0\.0\.1:%d/).*" % PORT), lambda r: r.abort())
            ctx.add_init_script(INIT)
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)))
            pg.goto("http://127.0.0.1:%d/fise-lucru/2026-11-05/%s/" % (PORT, slug))
            pg.wait_for_timeout(2000)   # trece și de load + 1500 ms (scorAcum)
            note0 = pg.evaluate("window.__note.length")
            r = pg.evaluate(LACOM_JS, sel)
            pg.wait_for_timeout(300)
            note = pg.evaluate("window.__note")
            c = pg.evaluate(CONTOR_JS, sel)
            ultima = note[-1] if note else None
            n, m = (c or [None, None])
            asteptat = max(1, min(10, round(1 + 9 * n / m))) if n and m else None
            ok = not erori and note0 == 0 and n and n > 0 and ultima and ultima["atomicCorrect"] == n \
                and ultima["atomicTotal"] == m and ultima["grade"] == asteptat and n < m
            # n < m: proba cere un scor PARȚIAL (fișă neterminată), exact cazul cerut
            print("%-12s contor %s din %s · note trimise %d (la deschidere %d) · ultima %s · erori JS %d -> %s"
                  % (slug, n, m, len(note), note0, ultima and "%s/%s nota %s" % (ultima["atomicCorrect"], ultima["atomicTotal"], ultima["grade"]),
                     len(erori), "BUN" if ok else "PICAT"))
            for e in erori[:3]:
                print("     eroare JS:", e[:200])
            if not ok:
                picate += 1
            ctx.close()
        br.close()
    srv.shutdown()
    print(picate)


if __name__ == "__main__":
    main()
