"""Joc: F206 (zecimala cu punct), F062 (ghilimele românești), F224 (funcții nesimulate), F215 (Σ), F043 (Backspace pe zonă), F092 (Ctrl+săgeți/Home/End)."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
def tasta_uni(h, ch):
    # tastă adevărată (CDP Input.dispatchKeyEvent = eveniment de încredere), ca de pe tastatura românească
    if not hasattr(h, 'cdp'): h.cdp = h.ctx.new_cdp_session(h.pg)
    h.cdp.send('Input.dispatchKeyEvent', {'type': 'keyDown', 'key': ch, 'text': ch, 'unmodifiedText': ch})
    h.cdp.send('Input.dispatchKeyEvent', {'type': 'keyUp', 'key': ch})
    time.sleep(0.05)
def arata(h, nume, a):
    s = h.stare()
    print(nume, a, '->', json.dumps(s['celule'].get(a), ensure_ascii=False), '| mesaj_fereastra', json.dumps(s.get('fereastra_mesaj'), ensure_ascii=False)[:300],
          '| dialog', json.dumps(s.get('dialog'), ensure_ascii=False)[:200], '| in_editare', s.get('ramane_in_editare'), '| central', h.mesaje()[:2], '| ev', h.evenimente(2))
with H() as h:
    CEL = {'A1': 'Elev', 'B1': 'N1', 'A2': 'Ana', 'B2': 9, 'B3': 7, 'B4': 8, 'C2': 1, 'C3': 2, 'C4': 3}
    # F206
    h.deschide(CEL, 'E2'); h.clic('celula:E2'); h.scrie('=B2*0.5'); h.taste('Enter'); time.sleep(0.3); arata(h, 'F206', 'E2')
    h.taste('Escape'); h.taste('Escape'); time.sleep(0.2)
    # F062: ghilimelele românești, tastate cu keyboard.press pe caracter
    h.deschide(CEL, 'E3'); h.clic('celula:E3'); h.scrie('=IF(B2>=5;'); tasta_uni(h,'„'); h.scrie('promovat'); tasta_uni(h,'”'); h.scrie(';"x")')
    print('F062 text in editare:', h.ev("(()=>{const i=document.querySelector('[data-lh-aplicatie] input, [data-lh-aplicatie] textarea');return i?i.value:null})()"), h.ev("(()=>{const b=LH.aplicatii.element('excel','bara_formule');return b?b.innerText:null})()"))
    h.taste('Enter'); time.sleep(0.3); arata(h, 'F062', 'E3')
    h.taste('Escape'); h.taste('Escape'); time.sleep(0.2)
    # F224: funcții care există în Excel
    fn = {'MATCH': '=MATCH(7;B2:B4;0)', 'SUBTOTAL': '=SUBTOTAL(9;B2:B4)', 'SUMIFS': '=SUMIFS(B2:B4;C2:C4;">1")', 'SUMPRODUCT': '=SUMPRODUCT(B2:B4;C2:C4)',
          'AVERAGEA': '=AVERAGEA(B2:B4)', 'MAXA': '=MAXA(B2:B4)', 'MINIFS': '=MINIFS(B2:B4;C2:C4;">1")', 'SEARCH': '=SEARCH("n";A2)', 'SUBSTITUTE': '=SUBSTITUTE(A2;"n";"m")', 'SUMSQ': '=SUMSQ(2;3)'}
    h.deschide(CEL, 'F1')
    for i, (k, f) in enumerate(fn.items()):
        a = 'F%d' % (i + 1)
        h.clic('celula:' + a); h.scrie(f); h.taste('Enter'); time.sleep(0.25); arata(h, 'F224-' + k, a)
        if h.stare().get('ramane_in_editare'): h.taste('Escape'); h.taste('Escape')
    # F224 cu Tab din autocompletare: =MA + Tab
    h.clic('celula:G1'); h.scrie('=MA'); time.sleep(0.3)
    print('F224 lista autocompletare:', h.ev("[...document.querySelectorAll('[data-lh-aplicatie] [role=listbox] *, [data-lh-aplicatie] .lh-ap-x-ac *')].map(x=>x.textContent).slice(0,8)"))
    h.taste('Tab'); h.scrie('7;B2:B4;0)'); h.taste('Enter'); time.sleep(0.3); arata(h, 'F224-tab', 'G1')
    h.taste('Escape'); h.taste('Escape')
    # F215: Σ pe B8 cu B7 goală (B2:B6 numere)
    h.deschide({'A1': 'Elev', 'B1': 'Nota', 'B2': 9, 'B3': 7, 'B4': 8, 'B5': 10, 'B6': 6}, 'B8')
    h.clic('celula:B8'); h.clic('panglica:Home/Editing/AutoSum'); time.sleep(0.3)
    s = h.stare(); print('F215a B8 dupa Σ: edit/formula', json.dumps(s['celule'].get('B8'), ensure_ascii=False), 'bara:', h.ev("(()=>{const i=document.querySelector('[data-lh-aplicatie] input, [data-lh-aplicatie] textarea');return i?i.value:null})()"), h.ev("(()=>{const b=LH.aplicatii.element('excel','bara_formule');return b?b.innerText:null})()"))
    h.taste('Enter'); time.sleep(0.2); print('F215a B8 dupa Enter', json.dumps(h.stare()['celule'].get('B8'), ensure_ascii=False))
    # F215b: deasupra doar formule, în stânga numere -> alege stânga
    h.deschide({'A3': 5, 'B3': 6, 'C1': '=A1+B1', 'C2': '=A2+B2'}, 'C3')
    h.clic('celula:C3'); h.clic('panglica:Home/Editing/AutoSum'); time.sleep(0.3)
    print('F215b C3 bara:', h.ev("(()=>{const b=LH.aplicatii.element('excel','bara_formule');return b?b.innerText:null})()"))
    h.taste('Enter'); time.sleep(0.2); print('F215b C3 dupa Enter', json.dumps(h.stare()['celule'].get('C3'), ensure_ascii=False))
    # F043: Backspace pe zona K6:K7
    h.deschide({'K6': 'aaa', 'K7': 'bbb'}, 'K6')
    h.clic('celula:K6'); h.pg.keyboard.down('Shift'); h.clic('celula:K7'); h.pg.keyboard.up('Shift')
    print('F043 selectie inainte', h.stare()['selectie'])
    h.taste('Backspace'); time.sleep(0.2)
    s = h.stare(); print('F043 dupa Backspace: in_editare', s.get('ramane_in_editare'), 'sel', s['selectie'], 'K6', s['celule'].get('K6'), 'K7', s['celule'].get('K7'), 'ev', h.evenimente(1))
    h.scrie('x'); h.taste('Enter'); time.sleep(0.2)
    s = h.stare(); print('F043 dupa x+Enter: sel', s['selectie'], 'K6', s['celule'].get('K6'), 'K7', s['celule'].get('K7'))
    # F092: Ctrl+săgeți, Ctrl+Home, Ctrl+End, Home
    h.deschide({'B2': 1, 'B3': 2, 'B4': 3, 'C2': 4, 'D2': 5, 'F6': 'z', 'A9': 'q'}, 'B2')
    h.clic('celula:B2')
    def pas(k):
        h.taste(k); time.sleep(0.15); return h.stare()['selectie']['activa']
    print('F092 Ctrl+Down din B2:', pas('Control+ArrowDown'))
    print('F092 Ctrl+Down din B4 (spre gol, fără date mai jos):', pas('Control+ArrowDown'))
    print('F092 Ctrl+Home:', pas('Control+Home'))
    h.clic('celula:B2'); print('F092 Ctrl+Right din B2:', pas('Control+ArrowRight'))
    print('F092 Ctrl+End:', pas('Control+End'))
    h.clic('celula:D4'); print('F092 Home din D4:', pas('Home'))
    print('erori', h.erori)
