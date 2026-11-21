"""Joc: F198 — fereastra Open și lista „Files of type”: Ctrl+O, apoi Browse / Open din Backstage."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
J = lambda x: json.dumps(x, ensure_ascii=False)
JS_VIZ = """re=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta')+(x.getAttribute('data-lh-id')?':'+x.getAttribute('data-lh-id'):'')).filter(t=>new RegExp(re).test(t))"""
with H() as h:
    h.deschide({'A1': 'x'}, 'A1'); h.clic('celula:A1'); h.taste('Control+o'); time.sleep(0.5)
    s = h.stare(); print('dupa Ctrl+O: pagina', s.get('pagina_backstage'), h.evenimente(1))
    bk = h.ev(JS_VIZ, '^backstage|Browse|Open|This PC')
    print('tinte backstage:', bk[:40])
    for t in [x for x in bk if 'Browse' in x][:1]:
        h.clic(t); time.sleep(0.4); s = h.stare(); print('dupa', t, '-> dialog', J(s.get('dialog')), h.evenimente(1), h.mesaje()[:1])
    print('Files of type pe ecran:', h.ev("document.body.innerText.includes('Files of type')"), '| All Excel Files:', h.ev("document.body.innerText.includes('All Excel Files')"))
    print('erori', h.erori)
