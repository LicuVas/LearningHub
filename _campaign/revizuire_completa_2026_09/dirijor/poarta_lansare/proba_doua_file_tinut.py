"""Două file ale ACELUIAȘI joc cât stă „Ești tot X?”: fila B lucrează (ținut deoparte), fila A răspunde
„Da, sunt eu” -> „Nu, a lucrat altcineva”. Apoi fila B salvează ceva (numele pentru diplomă / încă un nivel).
Întrebarea: ajunge munca ținută deoparte a „altcuiva” în sertarul lui X? Rețeaua închisă. Ultima linie = probleme."""
import functools, http.server, json, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")
LH = Path(r"C:\00\Projects\LearningHub")


class T(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=str(LH)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
GARDA = """(() => { const ext = u => { try { const x = new URL(String(u), location.href); return /^https?:$/.test(x.protocol) && !['127.0.0.1','localhost'].includes(x.hostname); } catch (e) { return false; } };
 if (navigator.sendBeacon) { const sb = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = (u, d) => ext(u) ? true : sb(u, d); }
 const f = window.fetch.bind(window); window.fetch = (u, o) => { const s = (typeof u === 'string' || u instanceof URL) ? String(u) : (u && u.url) || '';
 return ext(s) ? Promise.resolve(new Response('{}', {status: 200})) : f(u, o); }; })();"""
probleme = []


def V(c, ce):
    print(("  ok   " if c else "  RĂU  ") + ce, flush=True)
    if not c:
        probleme.append(ce)


JOC = f"{BASE}/jocuri/web-viii/index.html"
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 900}, service_workers="block")
    ctx.add_init_script(GARDA)
    ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or r.request.url.startswith(("data:", "blob:")))
              else r.fulfill(status=200, body="{}" if r.request.method == "POST" else "", content_type="text/plain"))
    A = ctx.new_page(); er = []
    A.on("pageerror", lambda e: er.append(str(e)[:200]))
    A.goto(JOC, wait_until="load")
    ch = A.evaluate("JocMotor.test.config().cheie")
    A.evaluate("k => {localStorage.clear(); localStorage.setItem('learninghub_active_profile', 'e_x');"
               "localStorage.setItem('lh_sertare', JSON.stringify({'x|y|ana pop': 'e_x'}));"
               "localStorage.setItem('lh_prezenta', JSON.stringify({id: 'x1', scoala: 'x', clasa: 'y', nume: 'Pop Ana', numeEnc: 'ENC', ultima: Date.now(), intreaba: true}));"
               "localStorage.setItem(k + '@e_x', JSON.stringify({nume: 'Pop Ana', lv: {0: {stars: 3, xp: 40}}}))}", ch)
    A.reload(wait_until="load"); A.wait_for_timeout(800)
    Bp = ctx.new_page(); Bp.on("pageerror", lambda e: er.append("B " + str(e)[:200]))
    Bp.goto(JOC, wait_until="load"); Bp.wait_for_timeout(800)
    V(Bp.locator("#lhp-da").count() == 1 and A.locator("#lhp-da").count() == 1, "ambele file întreabă „Ești tot Pop Ana?”")
    # fila B: „altcineva” termină niveluri cât stă întrebarea (deblocheaza = save() al motorului, ca la final de nivel)
    Bp.bring_to_front()
    Bp.evaluate("JocMotor.test.deblocheaza()"); Bp.wait_for_timeout(200)
    x = json.loads(A.evaluate("k => localStorage.getItem(k + '@e_x')", ch))
    t = json.loads(A.evaluate("k => localStorage.getItem(k + '@_tinut') || '{}'", ch))
    V(sorted(x["lv"]) == ["0"] and len(t.get("lv", {})) >= 3, f"cât stă întrebarea: X are {sorted(x['lv'])}, deoparte {sorted(t.get('lv', {}))}")
    # fila A răspunde: „Da, sunt eu” -> „Nu, a lucrat altcineva”
    A.bring_to_front()
    A.click("#lhp-da"); A.wait_for_timeout(300)
    if A.locator("#lhp-nu2").count():
        A.click("#lhp-nu2")
    A.wait_for_timeout(700)
    x = json.loads(A.evaluate("k => localStorage.getItem(k + '@e_x')", ch))
    V(sorted(x["lv"]) == ["0"], f"după „Nu, a lucrat altcineva” (fila A): X are {sorted(x['lv'])}")
    # fila B, care n-a răspuns: ce vede și ce scrie mai departe
    Bp.bring_to_front(); Bp.wait_for_timeout(1200)
    vede = Bp.evaluate("Array.from(document.querySelectorAll('.lvl')).map(b => b.querySelectorAll('.s .on').length)")
    print("  fila B, cuprinsul (stele pe nivel):", vede, "| eticheta:", Bp.evaluate("(document.getElementById('lhp')||{}).innerText||''")[:60])
    Bp.fill("#nume", "Pop Ana"); Bp.wait_for_timeout(300)   # un gest oarecare care salvează
    x = json.loads(A.evaluate("k => localStorage.getItem(k + '@e_x')", ch))
    V(sorted(x["lv"]) == ["0"], f"după o salvare în fila B: X are {sorted(x['lv'])} (altceva decât ['0'] = munca altcuiva pe numele lui X)")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()
    b.close()
srv.shutdown()
print(len(probleme))
