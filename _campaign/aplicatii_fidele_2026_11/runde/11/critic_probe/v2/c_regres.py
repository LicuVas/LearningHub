# C: regresul Word / Excel: aceleasi gesturi pe aplicatii/ din 174fdb05 (copie in %TEMP%) si pe worktree-ul de acum
import sys, json, os, hashlib; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from pathlib import Path
from h import Ham, WT
from PIL import Image, ImageChops
VECHI = Path(os.environ['TEMP']) / 'critic11_vechi'
OUT = Path(os.environ['TEMP']) / 'critic11_cap'; OUT.mkdir(exist_ok=True)
RECTS = "(a)=>[...document.querySelectorAll('[data-lh-aplicatie='+a+'] [data-lh-tip]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-lh-tip'),e.getAttribute('data-lh-eticheta'),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)].join('|')})"
def stare(pg, a, chei): s = pg.evaluate("a=>LH.aplicatii.stare(a)", a); return {k: s.get(k) for k in chei}
def el(pg, a, t, dx=0.5, dy=0.5, buton='left', n=1):
    r = pg.evaluate("([a,t])=>{const e=LH.aplicatii.element(a,t);if(!e)return null;e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}", [a, t])
    if r: pg.mouse.click(r[0] + r[2] * dx, r[1] + r[3] * dy, button=buton, click_count=n); pg.wait_for_timeout(120)
    return bool(r)
def ruleaza(rad, eticheta):
    R = {}
    with Ham(radacina=rad) as H:
        for a in ['word', 'excel']:
            pg = H.pagina('/aplicatii/poligon.html?aplicatie=' + a); pg.set_default_timeout(15000)
            pg.wait_for_function("a=>document.querySelector('[data-lh-aplicatie='+a+'] [data-lh-tip]')", arg=a); pg.wait_for_timeout(500)
            r = {'rects0': pg.evaluate(RECTS, a)}
            pg.screenshot(path=str(OUT / (eticheta + '_' + a + '_0.png')))
            el(pg, a, 'fila:File'); pg.wait_for_timeout(300)
            r['rects_file'] = pg.evaluate(RECTS, a); pg.screenshot(path=str(OUT / (eticheta + '_' + a + '_file.png')))
            pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
            pg.keyboard.press('F12'); pg.wait_for_timeout(300)
            r['rects_f12'] = pg.evaluate(RECTS, a); pg.screenshot(path=str(OUT / (eticheta + '_' + a + '_f12.png')))
            r['f12_sus'] = pg.evaluate("(()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight/2);const s=e&&e.closest('[data-lh-suprafata]');return s?s.getAttribute('data-lh-suprafata'):null})()")
            pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
            if a == 'word':
                el(pg, a, 'text:1', dx=0.98); pg.keyboard.type(' proba'); pg.wait_for_timeout(100)
                r['w_tast'] = stare(pg, a, ['text'])
                el(pg, a, 'text:1', dx=0.02, n=2); pg.wait_for_timeout(100)
                for k in ['Alt', 'h', '1']: pg.keyboard.press(k); pg.wait_for_timeout(120)
                r['w_keytips'] = stare(pg, a, ['formatare_pe_caractere', 'text'])
                pg.keyboard.press('Control+z'); pg.wait_for_timeout(100); r['w_z'] = stare(pg, a, ['formatare_pe_caractere', 'text'])
                pg.keyboard.press('F12'); pg.wait_for_timeout(300); pg.keyboard.press('Control+a'); pg.keyboard.type('Tema'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
                r['w_saveas'] = stare(pg, a, ['nume_fisier', 'titlu_fereastra'])
            else:
                el(pg, a, 'celula:F2'); pg.keyboard.type('7'); pg.keyboard.press('Enter'); pg.keyboard.type('=1+2'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
                c = pg.evaluate("a=>LH.aplicatii.stare(a).celule", a); r['x_cel'] = {k: c.get(k) for k in ('F2', 'F3')}
                pg.keyboard.press('Control+z'); pg.wait_for_timeout(150)
                c = pg.evaluate("a=>LH.aplicatii.stare(a).celule", a); r['x_z'] = {k: c.get(k) for k in ('F2', 'F3')}
                el(pg, a, 'mso:AutoSumMenu_Dropdown'); pg.wait_for_timeout(200)
                r['x_sigma'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent&&/^meniu/.test(e.getAttribute('data-lh-tinta'))).map(e=>(e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||'')).replace(/^meniu:/,'')).slice(0,12)")
            r['erori'] = list(H.erori)
            R[a] = r
    return R
V = ruleaza(VECHI, 'vechi'); N = ruleaza(WT, 'nou')
rez = {}
for a in ['word', 'excel']:
    for k in V[a]:
        if k.startswith('rects'):
            sv, sn = set(V[a][k]), set(N[a][k])
            rez[a + '.' + k] = {'vechi': len(sv), 'nou': len(sn), 'doar_vechi': sorted(sv - sn)[:5], 'doar_nou': sorted(sn - sv)[:5]}
        else:
            rez[a + '.' + k] = 'LA FEL' if V[a][k] == N[a][k] else {'vechi': V[a][k], 'nou': N[a][k]}
    for s in ['0', 'file', 'f12']:
        iv = Image.open(OUT / ('vechi_%s_%s.png' % (a, s))).convert('RGB'); inn = Image.open(OUT / ('nou_%s_%s.png' % (a, s))).convert('RGB')
        d = ImageChops.difference(iv, inn); rez[a + '.pixeli_' + s] = sum(1 for p in d.getdata() if p != (0, 0, 0))
rez['_valori_nou'] = {a: {k: v for k, v in N[a].items() if not k.startswith('rects')} for a in N}
print(json.dumps(rez, ensure_ascii=False))
