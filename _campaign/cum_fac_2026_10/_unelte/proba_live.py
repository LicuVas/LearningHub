"""Proba pe SITUL VIU (R1 din contract): pagina /cum-fac/ răspunde la exemplele profesorului cu fișa bună pe locul 1,
legătura din hub duce acolo, legătura „Exersezi…” deschide pasul lecției doar pentru citit, 0 cereri în afara sitului.
Tot ce nu e learninghub-8z6.pages.dev e blocat (regula 24: nicio cerere spre teste-vasile), User-Agent neutru (regula 22).
Rulare: python proba_live.py -> ultima linie = numărul de probleme."""
import json
from urllib.parse import quote
from playwright.sync_api import sync_playwright

B = 'https://learninghub-8z6.pages.dev'
EX = json.load(open(r'C:\00\Projects\LearningHub\cum-fac\_teste\exemplele_profesorului.json', encoding='utf-8'))


def main():
    prob = 0
    externe = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(user_agent='LearningHub-lectii/1.0 (educational site)', viewport={'width': 1366, 'height': 768})
        ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(B) else (externe.append(r.request.url + '  <=  ' + (r.request.frame.url if r.request.frame else '?')), r.abort()))
        pg = ctx.new_page()
        erori = []
        pg.on('pageerror', lambda e: erori.append(str(e)))
        # 1. din hub spre /cum-fac/
        pg.goto(B + '/hub/', wait_until='load')
        a = pg.query_selector('a.lh-cumfac')
        if not a:
            print('  ✗ hub: lipsește intrarea „Cum fac…?”'); prob += 1
        else:
            # la prima vizită, hub-ul arată fereastra lui de profil („Numele tău”) peste pagină: urmăm adresa legăturii
            href = a.get_attribute('href')
            pg.goto(pg.url.rsplit('/', 1)[0] + '/' + href, wait_until='load')
            ok = '/cum-fac/' in pg.url and pg.query_selector('#q') is not None
            print(('  ✓' if ok else '  ✗'), 'hub → clic pe „Cum fac…?” →', pg.url); prob += not ok
        # 2. exemplele profesorului, tastate ca un elev
        for x in EX:
            pg.goto(B + '/cum-fac/', wait_until='load')
            pg.fill('#q', '')
            pg.type('#q', x['q'], delay=15)
            pg.wait_for_timeout(300)
            prim = pg.get_attribute('#r0', 'data-id') if pg.query_selector('#r0') else ''
            ok = prim in x['accept']
            print(('  ✓' if ok else '  ✗'), f'„{x["q"]}” → locul 1: {prim}'); prob += not ok
        # 3. „Exersezi…” din fișa primului exemplu deschide pasul doar pentru citit
        pg.goto(B + '/cum-fac/?q=' + quote('cum salvez un fisier excel') + '#excel-salvare-prima-data', wait_until='load')
        pg.wait_for_timeout(800)
        ex = pg.query_selector('#exersezi')
        if not ex:
            print('  ✗ fișa nu are legătura „Exersezi…”'); prob += 1
        else:
            href = ex.get_attribute('href')
            ex.click(); pg.wait_for_load_state('load'); pg.wait_for_timeout(1500)
            t = pg.inner_text('body')
            ok = 'Registru nou' in t and 'Recitire' in t
            print(('  ✓' if ok else '  ✗'), f'„Exersezi…” ({href}) → pasul P2 „Registru nou…”, în recitire'); prob += not ok
        if erori:
            print('  ✗ erori JS:', erori[:3]); prob += 1
        ctx.close(); b.close()
    for u in externe: print('  info blocat:', u[:160])
    gazde = sorted(set(u.split('/')[2] for u in externe))
    print('  info cereri în afara sitului (blocate):', len(externe), gazde)
    if any('teste-vasile' in u.split('  <=  ')[0] and '/cum-fac/' in u.split('  <=  ')[1] for u in externe):
        print('  ✗ pagina /cum-fac/ a încercat să trimită spre teste-vasile'); prob += 1
    print(prob)


if __name__ == '__main__':
    main()
