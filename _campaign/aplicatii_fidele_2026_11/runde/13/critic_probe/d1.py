# -*- coding: utf-8 -*-
"""D: regresul Word si Excel. aplicatii/ din 7ab108fe (git archive intr-un dosar din %TEMP%) fata de worktree-ul de acum:
dreptunghiurile [data-lh-tip], capturile (pornire, File/Backstage, telefon 360), apoi gesturi scurte si starea."""
import io, json, os, shutil, subprocess, sys, tarfile, tempfile
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/13/critic_probe')
from h import Ham, st, ev, clic, centru
from PIL import Image, ImageChops
WT = 'C:/00/Projects/LearningHub_fidel'
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/13/critic_probe/'
TMP = tempfile.mkdtemp(prefix='lh_critic13_')
VECHI = os.path.join(TMP, 'vechi')
os.makedirs(VECHI)
tar = subprocess.run(['git', '-C', WT, 'archive', '--format=tar', '7ab108fe', 'aplicatii'], capture_output=True, check=True).stdout
tarfile.open(fileobj=io.BytesIO(tar)).extractall(VECHI)
RECT = """(()=>[...document.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-lh-tip'),e.getAttribute('data-lh-eticheta'),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}))()"""


def deschide(H, app):
    pg = H.pagina('/aplicatii/poligon.html?aplicatie=' + app)
    pg.wait_for_function('window.LH && LH.aplicatii && LH.aplicatii.gata')
    pg.wait_for_timeout(900)
    pg.evaluate("window.__m=(window.__lhAplicatieEv||[]).length")
    return pg


def capturi(H, eticheta, app, mobil):
    o = {}
    pg = deschide(H, app)
    o['pornire'] = pg.evaluate(RECT); pg.screenshot(path=os.path.join(TMP, '%s_%s_pornire.png' % (eticheta, app)))
    if not mobil:
        clic(pg, 'fila:File', app) or clic(pg, 'mso:FileTabButton', app); pg.wait_for_timeout(400)
        o['file'] = pg.evaluate(RECT); pg.screenshot(path=os.path.join(TMP, '%s_%s_file.png' % (eticheta, app)))
        pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
        pg.keyboard.press('F12'); pg.wait_for_timeout(500)
        o['f12'] = pg.evaluate(RECT); pg.screenshot(path=os.path.join(TMP, '%s_%s_f12.png' % (eticheta, app)))
    pg.close()
    return o


def gesturi_word(H):
    pg = deschide(H, 'word'); o = {}
    c = centru(pg, 'text:1', 'word'); pg.mouse.click(c[0], c[1]); pg.keyboard.press('End'); pg.keyboard.type(' proba'); pg.wait_for_timeout(150)
    o['tastare'] = st(pg, 'word').get('text')
    w = pg.evaluate("(()=>{const r=LH.aplicatii.dreptunghi&&LH.aplicatii.dreptunghi('word','cuvant:proba#1');return r})()")
    if w:
        R = pg.evaluate("(()=>{const r=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [r.x,r.y]})()")
        pg.mouse.dblclick(R[0] + w['x'] + w['width'] / 2, R[1] + w['y'] + w['height'] / 2); pg.wait_for_timeout(150)
    for kk in ['Alt', 'h', '1']:
        pg.keyboard.press(kk); pg.wait_for_timeout(150)
    s = st(pg, 'word'); o['kt_bold'] = [x for x in (s.get('formatare_pe_caractere') or []) if x.get('bold')]
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(150); o['ctrl_z'] = st(pg, 'word').get('formatare_pe_caractere')
    pg.keyboard.press('F12'); pg.wait_for_timeout(400); pg.keyboard.press('Control+a'); pg.keyboard.type('Tema'); pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
    s = st(pg, 'word'); o['save_as'] = [s.get('nume_fisier'), s.get('titlu_fereastra')]
    o['ev'] = [(e['g'], e['a']) for e in ev(pg)]
    pg.close(); return o


def gesturi_excel(H):
    pg = deschide(H, 'excel'); o = {}
    clic(pg, 'celula:F2', 'excel'); pg.keyboard.type('7'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
    clic(pg, 'celula:F3', 'excel'); pg.keyboard.type('=1+2'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
    s = st(pg, 'excel')['celule']; o['celule'] = {k: s.get(k) for k in ['F2', 'F3']}
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(150); s = st(pg, 'excel')['celule']; o['ctrl_z'] = {k: s.get(k) for k in ['F2', 'F3']}
    r = pg.evaluate("""(()=>{const e=[...document.querySelectorAll('[data-lh-id-mso^="AutoSum"] [data-lh-tip="MenuItem"],[data-lh-id-mso^="AutoSum"][data-lh-tip="MenuItem"]')].find(x=>x.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()""")
    if r:
        pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(250)
    o['sigma'] = [r is not None, pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=\"meniu\"]')].filter(x=>x.getClientRects().length).map(x=>x.getAttribute('data-lh-id')).slice(0,8)")]
    o['ev'] = [(e['g'], e['a']) for e in ev(pg)]
    pg.close(); return o


rez = {'tmp': '%TEMP%/' + os.path.basename(TMP)}
for et, rad in [('vechi', VECHI), ('nou', WT)]:
    rez[et] = {}
    with Ham(radacina=rad) as H:
        for app in ['word', 'excel']:
            rez[et][app] = capturi(H, et, app, False)
        rez[et]['g_word'] = gesturi_word(H)
        rez[et]['g_excel'] = gesturi_excel(H)
        rez[et]['erori'] = H.erori; rez[et]['plecate'] = H.plecate
    with Ham(radacina=rad, viewport=(360, 740), scale=2, mobil=True) as H:
        for app in ['word', 'excel']:
            rez[et][app + '_tel'] = capturi(H, et + '_tel', app, True)
cmp = {}
for app in ['word', 'excel']:
    for faza in ['pornire', 'file', 'f12']:
        a, b = rez['vechi'][app].get(faza), rez['nou'][app].get(faza)
        px = None
        try:
            i1 = Image.open(os.path.join(TMP, 'vechi_%s_%s.png' % (app, faza))).convert('RGB'); i2 = Image.open(os.path.join(TMP, 'nou_%s_%s.png' % (app, faza))).convert('RGB')
            d = ImageChops.difference(i1, i2); px = sum(1 for p in d.getdata() if p != (0, 0, 0))
        except Exception as e:
            px = str(e)[:80]
        cmp['%s_%s' % (app, faza)] = {'n': [len(a or []), len(b or [])], 'rect_identice': a == b, 'pixeli_diferiti': px}
    a, b = rez['vechi'][app + '_tel']['pornire'], rez['nou'][app + '_tel']['pornire']
    i1 = Image.open(os.path.join(TMP, 'vechi_tel_%s_pornire.png' % app)).convert('RGB'); i2 = Image.open(os.path.join(TMP, 'nou_tel_%s_pornire.png' % app)).convert('RGB')
    d = ImageChops.difference(i1, i2)
    cmp['%s_tel' % app] = {'n': [len(a), len(b)], 'rect_identice': a == b, 'pixeli_diferiti': sum(1 for p in d.getdata() if p != (0, 0, 0))}
for g in ['g_word', 'g_excel']:
    cmp[g] = {'identic': rez['vechi'][g] == rez['nou'][g], 'nou': rez['nou'][g]}
cmp['erori'] = [rez['vechi']['erori'], rez['nou']['erori']]; cmp['plecate'] = [rez['vechi']['plecate'], rez['nou']['plecate']]
shutil.rmtree(TMP, ignore_errors=True)
cmp['tmp_sters'] = not os.path.exists(TMP)
json.dump(cmp, open(OUT + 'd1_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(cmp, ensure_ascii=False)[:3000])
