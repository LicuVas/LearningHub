"""Proba I5 din contract: legătura „Exersezi în lecția N … pasul Px” dintr-o fișă „Cum fac…?” deschide pasul acela
pentru un elev FĂRĂ profil (care n-a deschis lecția niciodată), doar pentru citit, fără să scrie nimic.
Server local pe portul 0, rețeaua spre orice altceva decât 127.0.0.1 blocată (regula 24), User-Agent neutru (regula 22).
Rulare: python proba_vezi.py  -> ultima linie = numărul de probleme."""
import functools, http.server, threading, sys, json
from playwright.sync_api import sync_playwright

LH = r'C:\00\Projects\LearningHub'
CAZURI = [  # (lecția, pasul, un fragment din titlul pasului care trebuie să se vadă)
    ('lectii/viii/m1-l03/', 'p2', 'Registru nou'),
    ('lectii/vii/m1-l06/', 'p3', None),
    ('lectii/vi/m1-l03/', 'p4', None),
    ('lectii/v/m2-l09/', 'p2', None),
]


class Linistit(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def server():
    h = functools.partial(Linistit, directory=LH)
    http.server.ThreadingHTTPServer.allow_reuse_address = False
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def main():
    s = server()
    baza = f'http://127.0.0.1:{s.server_address[1]}/'
    titluri = {}
    for cale, pas, _ in CAZURI:   # titlurile pașilor, din digest
        dg = json.load(open(LH + r'\_campaign\cum_fac_2026_10\digest\_index.json', encoding='utf-8'))
        f = next(x['fisier'] for x in dg if x['cale'] == cale)
        d = json.load(open(LH + '\\_campaign\\cum_fac_2026_10\\digest\\' + f, encoding='utf-8'))
        titluri[(cale, pas)] = next(p['titlu'] for p in d['pasi'] if p['id'] == pas)
    probleme = 0
    externe = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for cale, pas, _ in CAZURI + [('lectii/viii/m1-l03/', 'p99', None)]:
            ctx = b.new_context(user_agent='LearningHub-lectii/1.0 (educational site)')
            ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(baza) else (externe.append(r.request.url), r.abort()))
            pg = ctx.new_page()
            erori = []
            pg.on('pageerror', lambda e: erori.append(str(e)))
            pg.goto(baza + cale + '?vezi=' + pas, wait_until='load')
            pg.wait_for_timeout(1500)
            text = pg.inner_text('body')
            url = pg.url
            ls = pg.evaluate('Object.keys(localStorage)')
            if pas == 'p99':   # control: un pas care nu există = încărcare obișnuită, fără bandă de recitire
                ok = 'Recitire' not in text
                print(('  ✓' if ok else '  ✗'), f'{cale}?vezi=p99 (control): încărcare obișnuită, fără „Recitire”')
                probleme += not ok
            else:
                t = titluri[(cale, pas)]
                ok_t = t[:25] in text
                ok_r = 'Recitire' in text
                ok_u = 'vezi=' not in url
                ok_ls = not any(k.startswith('lectie_') for k in ls)
                for ok, ce in ((ok_t, f'se vede pasul {pas.upper()} «{t}»'), (ok_r, 'banda „Recitire” (doar citire)'),
                               (ok_u, 'parametrul a ieșit din adresă'), (ok_ls, f'nimic scris în sertarul lecției (localStorage: {ls})')):
                    print(('  ✓' if ok else '  ✗'), cale, '·', ce)
                    probleme += not ok
            if erori:
                print('  ✗', cale, 'erori JS:', erori[:2]); probleme += 1
            ctx.close()
        b.close()
    s.shutdown()
    print('  info cereri externe încercate (blocate):', len(externe), sorted(set(u.split('/')[2] for u in externe))[:5])
    print(probleme)


if __name__ == '__main__':
    main()
