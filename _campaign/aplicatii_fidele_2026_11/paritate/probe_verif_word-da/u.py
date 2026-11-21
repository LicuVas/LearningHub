# Ajutoare pentru probele word-da: punctul unei litere din paragraful N, clic / tragere cu mouse-ul adevărat
from h import *

JS_LITERA = """([n, k]) => {
  const r0 = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === 'word');
  const el = r0.querySelector('[data-lh-zona] [data-lh-tinta="text"][data-lh-id="' + n + '"]') || r0.querySelector('[data-lh-zona] [data-lh-tinta="text:' + n + '"]');
  if (!el) return null;
  el.scrollIntoView({block: 'nearest'});
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {acceptNode: x => x.parentElement.closest('[aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  let rest = k, nod, ultim = null;
  while ((nod = w.nextNode())) {
    ultim = nod;
    if (rest < nod.length) { const rg = document.createRange(); rg.setStart(nod, rest); rg.setEnd(nod, rest + 1); const r = rg.getBoundingClientRect(); return {x: r.left, x2: r.right, y: r.top + r.height / 2}; }
    rest -= nod.length;
  }
  if (ultim && ultim.length) { const rg = document.createRange(); rg.setStart(ultim, ultim.length - 1); rg.setEnd(ultim, ultim.length); const r = rg.getBoundingClientRect(); return {x: r.right, x2: r.right, y: r.top + r.height / 2, capat: true}; }
  const r = el.getBoundingClientRect(); return {x: r.left + 2, x2: r.left + 2, y: r.top + r.height / 2, gol: true};
}"""


def litera(a, n, k):
    p = a.pg.evaluate(JS_LITERA, [n, k])
    if not p:
        raise RuntimeError('paragraful %d lipsește' % n)
    return p


def punct(a, n, k, mijloc=False):
    """punctul dintre litera k-1 și litera k din paragraful n (mijloc=True: mijlocul literei k)"""
    p = litera(a, n, k)
    return ((p['x'] + p['x2']) / 2 if mijloc else p['x'] + 0.5), p['y']


def clic_la(a, n, k, mijloc=False, de=1, mod=None, asteapta=250):
    x, y = punct(a, n, k, mijloc)
    if mod:
        a.pg.keyboard.down(mod)
    a.pg.mouse.click(x, y, click_count=1)
    if de >= 2:
        a.pg.wait_for_timeout(60); a.pg.mouse.click(x, y)
    if de >= 3:
        a.pg.wait_for_timeout(60); a.pg.mouse.click(x, y)
    if mod:
        a.pg.keyboard.up(mod)
    a.pg.wait_for_timeout(asteapta)


def trage(a, p1, p2, pasi=12, asteapta=300):
    a.pg.mouse.move(*p1); a.pg.mouse.down()
    a.pg.mouse.move(*p2, steps=pasi)
    a.pg.mouse.up(); a.pg.wait_for_timeout(asteapta)


def sel(a):
    return a.stare()['selectie']


def scris_vizibil(a):
    """textul vizibil al paragrafelor din zona de lucru"""
    return a.pg.evaluate("""() => { const r0 = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === 'word');
      return [...r0.querySelectorAll('[data-lh-zona] [data-lh-tinta="text"]')].map(e => e.innerText); }""")


def nesim(a):
    """mesajele „aici nu e simulată” vizibile"""
    return a.pg.evaluate("""() => [...document.querySelectorAll('[data-lh-nesimulat]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-nesimulat') + ' || ' + (e.textContent || '').trim().slice(0, 200))""")


def ruleaza(teste, fisier):
    R = {}
    with sesiune() as (ctx, port, blocate):
        for nume, f in teste:
            try:
                R[nume] = f(ctx, port)
            except Exception as e:
                R[nume] = {'EROARE': repr(e)[:500]}
            print(nume, json.dumps(R[nume], ensure_ascii=False)[:1800])
        R['_blocate'] = blocate
    rezultat(fisier, R)
    return R
