# Probă headless în biblioteca nouă: câteva verdicte NU / DA din inventarul Word (control pozitiv: Bold).
import sys, json, subprocess, socket, time
from playwright.sync_api import sync_playwright
RAD = 'C:/00/Projects/LearningHub_fidel'
s = socket.socket(); s.bind(('127.0.0.1', 0)); PORT = s.getsockname()[1]; s.close()
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1', '--directory', RAD],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
rez = {}
try:
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={'width': 1366, 'height': 768})
        ctx.route('**/*', lambda r: r.continue_() if ('127.0.0.1' in r.request.url or 'localhost' in r.request.url) else r.abort())
        pg = ctx.new_page()
        pg.goto(f'http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=word', wait_until='load')
        pg.wait_for_timeout(1500)
        pg.evaluate("""async () => { const d = document.createElement('div'); d.id = 'tw'; d.style.cssText = 'width:1366px;height:700px';
            document.body.prepend(d);
            window.__I = await LH.aplicatii.deschide('word', {loc: '#tw', continut: {paragrafe: ['Ana are mere.'], selectie: {de_la: 0, pana_la: 3}}}); }""")
        pg.wait_for_timeout(800)
        st = lambda: pg.evaluate("() => window.__I.stare()")
        def mesaj():
            return pg.evaluate("() => [...document.querySelectorAll('#tw [data-lh-nesimulat]:not([data-lh-tip])')].map(x => x.getAttribute('data-lh-nesimulat')).join(' | ')")
        def apasa(idm):
            el = pg.locator(f'#tw [data-lh-id-mso="{idm}"]').first
            if el.count() == 0: return 'lipseste din panglica'
            el.click(); pg.wait_for_timeout(300)
            return 'apasat'
        rez['Bold'] = apasa('Bold'); rez['Bold_formatare'] = st()['formatare_pe_caractere'][:2]
        rez['ParagraphMarks'] = apasa('ParagraphMarks'); rez['ParagraphMarks_semne'] = pg.evaluate("() => !!document.querySelector('#tw .lh-ap-semne, #tw.lh-ap-semne')"); rez['ParagraphMarks_mesaj'] = mesaj()
        rez['FontColorPicker'] = apasa('FontColorPicker'); rez['FontColorPicker_mesaj'] = mesaj()
        rez['IndentIncreaseWord'] = apasa('IndentIncreaseWord'); rez['IndentIncreaseWord_mesaj'] = mesaj()
        rez['stare_chei'] = sorted(st().keys())
        b.close()
finally:
    srv.terminate()
print(json.dumps(rez, ensure_ascii=False, indent=0))
