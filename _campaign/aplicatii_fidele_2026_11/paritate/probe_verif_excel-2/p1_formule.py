"""Joc: tipuri de date și formule (F069 F005 F012 F097 F078 F088 F066 F210 F206 F062 F224 F213)."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
CEL = {'A1': 'Elev', 'B1': 'N1', 'C1': 'N2', 'A2': 'Ana', 'B2': 9, 'C2': 10, 'A3': 'Bogdan', 'B3': 7, 'C3': 8, 'D2': 1, 'D4': 2}
cazuri = [
 ('F069', 'E2', '=A2+1'),
 ('F097', 'E3', '=CONCATENATE(A2;" ";B2)'),
 ('F078', 'E4', '=COUNTBLANK(D2:D4)'),
 ('F088', 'E5', '=POWER(2;3)'),
 ('F066a', 'E6', '=B2>B3'),
 ('F066b', 'E7', '="a"<1'),
 ('F066c', 'E8', '=TRUE>"z"'),
 ('F066d', 'E9', '=B2<=B3'),
 ('F066e', 'E10', '=B2<>B3'),
 ('F066f', 'E11', '=A2="ana"'),
 ('F210', 'E12', '+B2*C2'),
 ('F210b', 'E13', '-B2+C2'),
 ('F005', 'F2', '12 lei'),
 ('F005b', 'F3', '-5 lei'),
 ('F005c', 'F4', '1250,5 lei'),
 ('F012', 'F5', 'TRUE'),
 ('F012b', 'F6', 'false'),
 ('F066g', 'F7', '=B2>=9'),
]
with H() as h:
    h.deschide(CEL, 'E2')
    for nume, a, txt in cazuri:
        h.clic('celula:' + a)
        h.scrie(txt); h.taste('Enter'); time.sleep(0.2)
        s = h.stare()
        print(nume, a, repr(txt), '->', json.dumps(s['celule'].get(a), ensure_ascii=False), '| fmt', json.dumps((s.get('format_celule') or {}).get(a), ensure_ascii=False),
              '| ecran', json.dumps(h.ecran(a), ensure_ascii=False)[:260], '| mesaj', s.get('fereastra_mesaj'), h.mesaje()[:1], '| ev', h.evenimente(1))
    # F213: triunghiul de pe celula cu eroare (E2 = #VALUE!) — DOM-ul celulei + titlu/tooltip
    for a in ['E2']:
        print('F213 DOM', h.ev("a=>{const e=LH.aplicatii.element('excel','celula:'+a);return {html:e.outerHTML.slice(0,600),title:e.title, kids:[...e.querySelectorAll('*')].map(x=>x.className+'|'+(x.getAttribute('title')||'')+'|'+(x.getAttribute('aria-label')||''))}}", a))
    # cauta orice element cu 'tri' / 'eroare' in clasa sub grila
    print('F213 tri', h.ev("[...document.querySelectorAll('[data-lh-aplicatie] *')].filter(x=>/tri|eroare|err|indicator/i.test(x.className&&x.className.baseVal===undefined?x.className:'')).slice(0,10).map(x=>x.className+' @'+(x.closest('[data-lh-tinta]')||{}).getAttribute?.('data-lh-id'))"))
    print('erori', h.erori)
