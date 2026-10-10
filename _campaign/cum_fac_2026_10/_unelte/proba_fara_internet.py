"""Proba I4 din contract: după ce pagina /cum-fac/ s-a încărcat, căutarea și deschiderea fișelor merg FĂRĂ internet
(ca în laboratorul unde rețeaua cade în timpul orei). Pe situl viu; după încărcare, contextul browserului trece offline.
Nu se testează reîncărcarea paginii fără rețea (ar cere un service worker, nefăcut deliberat).
Rulare: python proba_fara_internet.py -> ultima linie = numărul de probleme."""
from playwright.sync_api import sync_playwright

B = 'https://learninghub-8z6.pages.dev'
CAUTARI = [('cum salvez un fisier excel', 'excel-salvare-prima-data'), ('cum inchid un document word', 'word-inchidere-document'),
           ('selectare mai multe celule in excel', 'excel-selectare-zona'), ('cum pun tranzitie la slide', None)]


def main():
    prob = 0
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(user_agent='LearningHub-lectii/1.0 (educational site)')
        ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(B) else r.abort())
        pg = ctx.new_page()
        pg.goto(B + '/cum-fac/', wait_until='load')
        pg.wait_for_selector('#q')
        ctx.set_offline(True)
        print('  info: pagina încărcată, apoi rețeaua TĂIATĂ')
        for q, asteptat in CAUTARI:
            pg.fill('#q', '')
            pg.type('#q', q, delay=10)
            pg.wait_for_timeout(250)
            prim = pg.get_attribute('#r0', 'data-id') if pg.query_selector('#r0') else ''
            ok = bool(prim) and (asteptat is None or prim == asteptat)
            print(('  ✓' if ok else '  ✗'), f'fără internet: „{q}” → locul 1: {prim or "(nimic)"}'); prob += not ok
        pg.click('#r0')
        pg.wait_for_timeout(400)
        ok = pg.query_selector('#exersezi') is not None and pg.query_selector('article') is not None
        print(('  ✓' if ok else '  ✗'), 'fără internet: fișa se deschide (pași + legătura spre lecție)'); prob += not ok
        ctx.close(); b.close()
    print(prob)


if __name__ == '__main__':
    main()
