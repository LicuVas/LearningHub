# Unelte comune pentru probele verificatorului excel-1 (21.11.2026).
# Pornește un server local pe 127.0.0.1, deschide poligonul headless, taie orice cerere care nu e locală.
import json, socket, subprocess, sys, time, contextlib
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

RADACINA = r'C:/00/Projects/LearningHub_fidel'


def port_liber(de_la=8871):
    for p in range(de_la, de_la + 60):
        s = socket.socket()
        try:
            s.bind(('127.0.0.1', p)); s.close(); return p
        except OSError:
            pass
    raise SystemExit('niciun port liber')


@contextlib.contextmanager
def poligon():
    port = port_liber()
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1', '--directory', RADACINA],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.0)
    pw = sync_playwright().start()
    br = pw.chromium.launch(headless=True)
    try:
        ctx = br.new_context(viewport={'width': 1366, 'height': 768}, locale='ro-RO')

        def filtru(route):
            h = urlparse(route.request.url).hostname or ''
            if h in ('127.0.0.1', 'localhost'):
                route.continue_()
            else:
                route.abort()
        ctx.route('**/*', filtru)
        pg = ctx.new_page()
        pg.goto(f'http://127.0.0.1:{port}/aplicatii/poligon.html')
        pg.wait_for_function('window.LH && LH.aplicatii && LH.aplicatii.gata')
        pg.evaluate('LH.aplicatii.gata')
        yield pg
    finally:
        br.close(); pw.stop(); srv.terminate(); srv.wait(5)


def deschide(pg, continut):
    pg.evaluate("""c => LH.aplicatii.deschide('excel', {continut: c, focus: true, scenariu: true}).then(() => true)""", continut)
    pg.wait_for_timeout(300)


def stare(pg):
    return pg.evaluate("LH.aplicatii.stare('excel')")


def el(pg, tinta):
    """centrul elementului țintă canonic, sau None"""
    return pg.evaluate("""t => { const e = LH.aplicatii.element('excel', t); if (!e) return null; e.scrollIntoView({block:'nearest', inline:'nearest'});
        const r = e.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2, w: r.width, h: r.height}; }""", tinta)


def clic(pg, tinta, dublu=False, dreapta=False):
    p = el(pg, tinta)
    if not p:
        raise RuntimeError('nu găsesc ținta ' + tinta)
    if dublu:
        pg.mouse.dblclick(p['x'], p['y'])
    else:
        pg.mouse.click(p['x'], p['y'], button='right' if dreapta else 'left')
    pg.wait_for_timeout(250)
    return p


def ev(pg, n=5):
    return pg.evaluate(f"(window.__lhAplicatieEv || []).slice(-{n}).map(e => ({{gest: e.gest, actiune: e.actiune, tinta: e.tinta}}))")


def tinte(pg, filtru=''):
    return pg.evaluate("f => LH.aplicatii.tinte('excel').filter(t => t.indexOf(f) >= 0)", filtru)


def text_celula(pg, a):
    return pg.evaluate("""a => { const e = LH.aplicatii.element('excel', 'celula:' + a); if (!e) return null;
        const cs = getComputedStyle(e); return {text: e.innerText, align: cs.textAlign, just: cs.justifyContent, html: e.innerHTML.slice(0, 400)}; }""", a)


def mesaj_central(pg):
    return pg.evaluate("""() => [...document.querySelectorAll('[data-lh-nesimulat]')].map(x => x.getAttribute('data-lh-nesimulat') + ' | ' + x.textContent.trim()).slice(-3)""")


def scrie(pg, rez, cheie, val):
    rez[cheie] = val
    print(cheie, '=>', json.dumps(val, ensure_ascii=False)[:600])
