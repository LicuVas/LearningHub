# -*- coding: utf-8 -*-
"""Proba constructorului 14 (T1-T4, punctul 5, MINOR) — gesturi ADEVĂRATE pe poligon (page.keyboard / page.mouse / page.touchscreen),
Chromium headless, tot ce nu e 127.0.0.1/localhost abandonat (h.py). Rulează pe două rădăcini:
  inainte = aplicatii/ din commit-ul de pornire e3300ec9 (git archive într-un dosar din %TEMP%, șters la final),
  dupa    = worktree-ul de acum.
Ieșiri: proba_grav_inainte.json, proba_grav_dupa.json (+ rezumat pe ecran). Ultima linie = numărul de verificări picate pe „dupa”.
Folosire: python proba_grav.py [inainte|dupa|ambele] [filtru_nume]"""
import sys, os, json, subprocess, tempfile, shutil, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *  # Ham, st, ev, el, centru, clic, nesimulat, scrie, foc, kt, men, dlg, S, taste, pas, sir

WT = 'C:/00/Projects/LearningHub_fidel'
PORNIRE = 'e3300ec9'
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [{'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1,
     'fisiere': [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]}
T = ('clic', 'forma:1/1')
B = ('clic', 'margine_forma:1/1')
STEA = [('clic', 'miniatura:2'), ('clic', 'forma:2/2')]
CAZURI = []


def caz(f):
    CAZURI.append(f)
    return f


def prep_do(pg, prep, app='powerpoint'):
    for p in prep:
        if p[0] == 'clic':
            clic(pg, p[1], app=app, dx=p[2] if len(p) > 2 else 0.5, dy=p[3] if len(p) > 3 else 0.5)
        elif p[0] == 'tast':
            taste(pg, *p[1])
        elif p[0] == 'type':
            pg.keyboard.type(p[1]); pg.wait_for_timeout(100)
        elif p[0] == 'wait':
            pg.wait_for_timeout(p[1])


def pasi(pg, chei, app='powerpoint'):
    out = []
    for k in chei:
        if isinstance(k, tuple) and k[0] == 'type':
            pg.keyboard.type(k[1]); pg.wait_for_timeout(120)
            out.append({'type': k[1], 'ev': ev(pg), 'foc': foc(pg)})
        else:
            out.append(pas(pg, k))
    return out


def deschide(H, app='powerpoint', cont=None):
    return H.app(app, C if (cont is None and app == 'powerpoint') else cont)


def in_dialog(p, supr):
    f = p.get('foc') or {}
    return f.get('supr') == supr and f.get('inRoot')


# ------------------------------------------------------------------ T1: ferestrele
@caz
def t1_open(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['Control+o']), ('clic', 'backstage:Browse')]); ev(pg)
    p = pasi(pg, ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Alt+n', ('type', 'Plante_6A_Pop.pptx'), 'Alt+o'])
    s = S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog')
    V = [('tab_ramane_in_fereastra', all(in_dialog(x, 'dialog.FileOpen') for x in p[:4]), [x['foc'] for x in p[:4]]),
         ('tab_emite_tasta_tab', all(x['ev'] and x['ev'][0]['g'] == 'tasta_tab' for x in p[:4]), [x['ev'] for x in p[:4]]),
         ('alt_n_focus_file_name', (p[4]['foc'] or {}).get('tinta') == 'camp:nume_fisier' and p[4]['ev'][:1] and p[4]['ev'][0]['g'] == 'tasta_acces', p[4]),
         ('alt_o_deschide', s['prezentare_activa'] == 'Plante_6A_Pop.pptx' and s['prezentari_deschise'] == 2, s),
         ('alt_o_eveniment', bool(p[6]['ev']) and p[6]['ev'][0]['g'] == 'tasta_acces' and p[6]['ev'][0]['t'] == 'fereastra:Open', p[6]['ev'])]
    return V, {'pasi': p, 'stare': s}


@caz
def t1_open_tab_ciclu(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['Control+o']), ('clic', 'backstage:Browse')]); ev(pg)
    fs, evs = [], []
    for i in range(40):
        x = pas(pg, 'Tab' if i < 30 else 'Shift+Tab', pauza=40)
        fs.append((x['foc'] or {}).get('supr')); evs.append(len(x['ev']))
    V = [('focus_mereu_in_fereastra_40', all(f == 'dialog.FileOpen' for f in fs), fs),
         ('un_eveniment_pe_tab', all(n == 1 for n in evs), evs)]
    return V, {'supr': fs}


@caz
def t1_open_tab_open_enter(H):
    """Tab până la butonul Open, apoi Enter = Open (numele scris înainte)"""
    pg = deschide(H)
    prep_do(pg, [('tast', ['Control+o']), ('clic', 'backstage:Browse'), ('type', 'Plante_6A_Pop.pptx')]); ev(pg)
    p = []
    for i in range(12):
        x = pas(pg, 'Tab', pauza=40); p.append(x)
        if (x['foc'] or {}).get('tinta') == 'fereastra:Open':
            break
    e = pas(pg, 'Enter')
    s = S(pg, 'prezentare_activa', 'prezentari_deschise')
    V = [('tab_ajunge_la_open', (p[-1]['foc'] or {}).get('tinta') == 'fereastra:Open', [(x['foc'] or {}).get('tinta') for x in p]),
         ('enter_pe_open_deschide', s['prezentare_activa'] == 'Plante_6A_Pop.pptx', {'s': s, 'ev': e['ev']})]
    return V, {}


def save_changes(H, chei):
    pg = deschide(H)
    prep_do(pg, [T, ('type', 'x'), ('tast', ['Control+w'])]); ev(pg)
    p = pasi(pg, chei)
    s = S(pg, 'prezentari_deschise', 'prezentare_activa', 'dialog', 'nume_fisier')
    return pg, p, s


@caz
def t1_save_changes_alt_n(H):
    pg, p, s = save_changes(H, ['Alt+n'])
    V = [('dont_save_inchide', s['prezentari_deschise'] == 0, s),
         ('eveniment_tasta_acces_dont_save', bool(p[0]['ev']) and p[0]['ev'][0]['g'] == 'tasta_acces' and p[0]['ev'][0]['t'] == "fereastra:Don't Save", p[0]['ev'])]
    return V, {'pasi': p}


@caz
def t1_save_changes_alt_s(H):
    pg, p, s = save_changes(H, ['Alt+s'])
    V = [('save_salveaza_si_inchide', s['prezentari_deschise'] == 0 and (s['dialog'] or {}).get('apasat') == 'Save', s),
         ('eveniment_tasta_acces_save', bool(p[0]['ev']) and p[0]['ev'][0]['g'] == 'tasta_acces' and p[0]['ev'][0]['t'] == 'fereastra:Save', p[0]['ev'])]
    return V, {'pasi': p}


@caz
def t1_save_changes_tab(H):
    pg, p, s = save_changes(H, ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab'])
    V = [('tab_ramane_in_fereastra', all(in_dialog(x, 'dialog.save_your_changes_to_this_file') for x in p), [x['foc'] for x in p]),
         ('fereastra_ramane', s['prezentari_deschise'] == 1 and s['dialog'] is not None, s)]
    return V, {'pasi': [(x['foc'] or {}).get('tinta') for x in p]}


@caz
def t1_save_changes_tab_dont_save_enter(H):
    pg = deschide(H)
    prep_do(pg, [T, ('type', 'x'), ('tast', ['Control+w'])]); ev(pg)
    for i in range(10):
        x = pas(pg, 'Tab', pauza=40)
        if (x['foc'] or {}).get('tinta') == "fereastra:Don't Save":
            break
    e = pas(pg, 'Enter')
    s = S(pg, 'prezentari_deschise')
    V = [('tab_la_dont_save_enter_inchide', s['prezentari_deschise'] == 0, {'s': s, 'ev': e['ev']})]
    return V, {}


@caz
def t1_picture(H):
    pg = deschide(H)
    p = pasi(pg, ['Alt', 'n', 'p', 'd', ('type', 'pamant.png'), 'Alt+o'])
    s = S(pg, 'forme_diapozitiv', 'dialog')
    V = [('alt_o_insereaza', s['dialog'] is None and any(f.get('fel') == 'imagine' for f in s['forme_diapozitiv'][0]), s),
         ('eveniment', bool(p[5]['ev']) and p[5]['ev'][0]['g'] == 'tasta_acces' and p[5]['ev'][0]['t'] == 'fereastra:Open', p[5]['ev'])]
    return V, {}


@caz
def t1_picture_tab(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['Alt', 'n', 'p', 'd'])]); ev(pg)
    p = pasi(pg, ['Tab'] * 6 + ['Shift+Tab'] * 3)
    V = [('tab_ramane_in_fereastra', all(in_dialog(x, 'dialog.PictureInsertFromFilePowerPoint') for x in p), [x['foc'] for x in p])]
    return V, {}


@caz
def t1_saveas(H):
    pg = deschide(H)
    p = pasi(pg, ['F12', 'Alt+n', ('type', 'Vulcanii'), 'Alt+s'])
    s = S(pg, 'nume_fisier', 'dialog', 'prezentare_activa')
    V = [('alt_n_focus', (p[1]['foc'] or {}).get('tinta') == 'camp:nume_fisier', p[1]),
         ('alt_s_salveaza', s['nume_fisier'] == 'Vulcanii.pptx' and s['dialog'] is None, s),
         ('eveniment', bool(p[3]['ev']) and p[3]['ev'][0]['g'] == 'tasta_acces' and p[3]['ev'][0]['t'] == 'dialog_salvare:Save', p[3]['ev'])]
    return V, {}


@caz
def t1_saveas_tab(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['F12'])]); ev(pg)
    p = pasi(pg, ['Tab'] * 8)
    V = [('tab_ramane_in_fereastra', all(in_dialog(x, 'dialog.FileSaveAs') for x in p), [x['foc'] for x in p])]
    return V, {}


@caz
def t1_font(H):
    pg = deschide(H)
    prep_do(pg, [T, B, ('clic', 'lansator:Home/Font'), ('wait', 120)]); ev(pg)
    f0 = foc(pg)
    p = pasi(pg, ['Alt+s', ('type', '40'), 'Enter'])
    s = S(pg, 'formatare_text', 'dialog')
    V = [('focus_la_deschidere_in_camp', (f0 or {}).get('supr') == 'dialog.FontDialogPowerPoint' and (f0 or {}).get('tag') == 'INPUT', f0),
         ('alt_s_focus_size', (p[0]['foc'] or {}).get('supr') == 'dialog.FontDialogPowerPoint' and (p[0]['foc'] or {}).get('tag') == 'INPUT', p[0]),
         ('size_40_aplicat', (s['formatare_text'] or {}).get('marime') == 40 and s['dialog'] is None, s)]
    return V, {'f0': f0}


@caz
def t1_font_tab(H):
    pg = deschide(H)
    prep_do(pg, [T, B, ('clic', 'lansator:Home/Font'), ('wait', 120)]); ev(pg)
    p = pasi(pg, ['Tab'] * 10 + ['Shift+Tab'] * 4)
    V = [('tab_ramane_in_fereastra', all(in_dialog(x, 'dialog.FontDialogPowerPoint') for x in p), [x['foc'] for x in p])]
    return V, {}


@caz
def t1_paragraph(H):
    pg = deschide(H)
    prep_do(pg, [T, B, ('clic', 'lansator:Home/Paragraph'), ('wait', 120)]); ev(pg)
    f0 = foc(pg)
    p = pasi(pg, ['Alt+g', 'Tab', 'Tab', 'Escape'])
    V = [('focus_la_deschidere_in_camp', (f0 or {}).get('supr') == 'dialog.PowerPointParagraphDialog', f0),
         ('alt_g_alignment', 'Alignment' in json.dumps(p[0]['foc'] or {}, ensure_ascii=False) and p[0]['ev'][:1] and p[0]['ev'][0]['g'] == 'tasta_acces', p[0]),
         ('tab_ramane', all(in_dialog(x, 'dialog.PowerPointParagraphDialog') for x in p[1:3]), [x['foc'] for x in p[1:3]]),
         ('esc_inchide', not p[3]['dlg'], p[3]['dlg'])]
    return V, {}


@caz
def t1_alt_litera_fara_potrivire(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['F12'])]); ev(pg)
    p = pasi(pg, ['Alt+q'])
    V = [('un_eveniment_fara_efect', len(p[0]['ev']) == 1 and p[0]['ev'][0]['g'] == 'tasta_acces' and p[0]['ev'][0]['a'] == 'fara_efect', p[0]['ev'])]
    return V, {}


# Word și Excel: aceleași ferestre trebuie să meargă ca înainte (evenimentele se compară inainte/dupa în rezumat)
@caz
def t1_word_saveas(H):
    pg = deschide(H, 'word', {})
    p = pasi(pg, ['F12', 'Tab', 'Alt+n', ('type', 'Tema'), 'Alt+s'], app='word')
    s = S(pg, 'nume_fisier', app='word')
    V = [('word_salveaza', s['nume_fisier'] in ('Tema.docx', 'Tema'), s)]
    return V, {'ev': [x['ev'] for x in p]}


@caz
def t1_excel_saveas(H):
    pg = deschide(H, 'excel', {})
    p = pasi(pg, ['F12', 'Alt+n', ('type', 'Tema'), 'Alt+s'], app='excel')
    s = S(pg, 'nume_fisier', app='excel')
    V = [('excel_salveaza', 'Tema' in str(s.get('nume_fisier')), s)]
    return V, {'ev': [x['ev'] for x in p]}


# ------------------------------------------------------------------ T3: fontul temei pe ecran (m2-l08)
L08 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Munții Rodnei', 'Ce sunt'], 'fonturi': ['Comic Sans MS', None]},
                       {'aspect': 'Title Slide', 'texte': ['Fără font', 'Subtitlul']},
                       {'aspect': 'Title and Content', 'texte': ['Titlul trei', 'Rândul unu']}], 'diapozitiv_activ': 2}
JS_FONT = """(()=>{const fam=x=>getComputedStyle(x).fontFamily;const o={};
  const lit=r=>{const s=[...r.querySelectorAll('span')].filter(x=>[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));return s.length?s[0]:r};
  document.querySelectorAll('.lh-ap-p-slide [data-lh-tinta="forma"] .lh-ap-p-text').forEach(r=>{const f=r.closest('[data-lh-tinta]');const s=lit(r);
    o['slide forma:'+f.getAttribute('data-lh-id')]={fam:fam(s),w:Math.round(s.getBoundingClientRect().width*10)/10,text:s.textContent.slice(0,20)}});
  document.querySelectorAll('.lh-ap-p-mini .lh-ap-p-text').forEach((r,i)=>{const s=lit(r);o['mini '+i+(r.classList.contains('lh-ap-p-titlu')?' titlu':'')]={fam:fam(s)}});
  return o})()"""


def prima(fam):
    return (fam or '').split(',')[0].strip().strip('"\'')


@caz
def t3_font_tema(H):
    pg = deschide(H, cont=L08)
    a = pg.evaluate(JS_FONT)
    titlu = a.get('slide forma:2/1') or {}
    corp = a.get('slide forma:2/2') or {}
    minis = {k: prima(v['fam']) for k, v in a.items() if k.startswith('mini')}
    s0 = S(pg, 'font_text')
    prep_do(pg, [('clic', 'forma:2/1'), ('clic', 'margine_forma:2/1'), ('clic', 'meniu_derulant:Home/Font/Font'), ('clic', 'meniu:Calibri Light (Headings)'), ('wait', 150)])
    b = pg.evaluate(JS_FONT)
    t2 = b.get('slide forma:2/1') or {}
    s1 = S(pg, 'font_text')
    # titlul cu Comic Sans reparat cu Calibri Light (Headings) = același font ca titlurile rămase în fontul temei
    prep_do(pg, [('clic', 'miniatura:1'), ('clic', 'forma:1/1'), ('clic', 'margine_forma:1/1'), ('clic', 'meniu_derulant:Home/Font/Font'), ('clic', 'meniu:Calibri Light (Headings)'), ('wait', 150)])
    c = pg.evaluate(JS_FONT)
    V = [('titlu_tema_calibri_light', prima(titlu.get('fam')) == 'Calibri Light', titlu),
         ('corp_tema_calibri', prima(corp.get('fam')) == 'Calibri', corp),
         ('miniaturi_fontul_temei', all((v in ('Calibri Light', 'Comic Sans MS')) if 'titlu' in k else (v in ('Calibri', 'Comic Sans MS')) for k, v in minis.items()) and any('titlu' in k for k in minis), minis),
         ('caseta_spune_calibri_light', s0.get('font_text') == 'Calibri Light' or s1.get('font_text') == 'Calibri Light', {'s0': s0, 's1': s1}),
         ('alegerea_nu_schimba_literele', titlu.get('fam') == t2.get('fam') and titlu.get('w') == t2.get('w'), {'inainte': titlu, 'dupa': t2}),
         ('titlul_reparat_ca_tema', (c.get('slide forma:1/1') or {}).get('fam') == titlu.get('fam'), {'reparat': c.get('slide forma:1/1'), 'tema': titlu})]
    return V, {'a': a, 'b': b}


# ------------------------------------------------------------------ T2: fila Shape Format din taste (m1-l06:177)
def text_stea(pg):
    fd = S(pg, 'forme_diapozitiv')['forme_diapozitiv']
    return fd[1][1].get('text') if len(fd) > 1 and len(fd[1]) > 1 else None


@caz
def t2_jd_insigne(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    p = pasi(pg, ['Alt', 'j', 'd'])
    V = [('JD_pe_ecran_dupa_alt', 'JD' in p[0]['kt'], p[0]['kt']),
         ('J_prefix', bool(p[1]['ev']) and p[1]['ev'][0]['a'] == 'prefix_tasta_acces' and 'D' in ''.join(p[1]['kt']), p[1]),
         ('D_deschide_fila', bool(p[2]['ev']) and p[2]['ev'][0]['g'] == 'tasta_acces' and p[2]['ev'][0]['t'] == 'fila:Shape Format' and 'SF' in p[2]['kt'] and 'SO' in p[2]['kt'], p[2])]
    return V, {'pasi': p}


@caz
def t2_jd_sf_so(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    p = pasi(pg, ['Alt', 'j', 'd', 's', 'f'])
    m1 = p[4]['men']
    pg2 = deschide(H)
    prep_do(pg2, STEA); ev(pg2)
    q = pasi(pg2, ['Alt', 'j', 'd', 's', 'o'])
    m2 = q[4]['men']
    V = [('JD_SF_shape_fill', (m1 or {}).get('supr') == 'lista.ShapeFillColorPicker', p[4]),
         ('JD_SO_shape_outline', (m2 or {}).get('supr') == 'lista.OutlineColorPicker', q[4]),
         ('insignele_listei_din_referinta', 'W' in q[4]['kt'] and 'M' in q[4]['kt'], q[4]['kt'])]
    return V, {}


@caz
def t2_jd_so_w(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    t0 = text_stea(pg)
    p = pasi(pg, ['Alt', 'j', 'd', 's', 'o', 'w', 'x', 'q'])
    t1 = text_stea(pg)
    V = [('W_deschide_weight', (p[5]['men'] or {}).get('supr') == 'lista.OutlineColorPicker#Weight', p[5]),
         ('literele_nu_intra_in_stea', t1 == t0, {'inainte': t0, 'dupa': t1}),
         ('niciun_eveniment_scriere', not any(e['a'] == 'scriere' for x in p for e in x['ev']), [x['ev'] for x in p[5:]])]
    return V, {}


@caz
def t2_h_so_w(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    t0 = text_stea(pg)
    p = pasi(pg, ['Alt', 'h', 's', 'o', 'w', 'a'])
    t1 = text_stea(pg)
    V = [('lista_deschisa', (p[3]['men'] or {}).get('supr') == 'lista.OutlineColorPicker', p[3]),
         ('W_nu_scrie_in_stea', t1 == t0 and not any(e['a'] == 'scriere' for x in p for e in x['ev']), {'inainte': t0, 'dupa': t1, 'ev': [x['ev'] for x in p[4:]]})]
    return V, {}


@caz
def t2_weight_3pt(H):
    """drumul m1-l06 pe taste: Alt, J D, S O, W, apoi ↓ până la 3 pt și Enter"""
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    pasi(pg, ['Alt', 'j', 'd', 's', 'o', 'w'])
    r = None
    for i in range(16):
        x = pas(pg, 'ArrowDown', pauza=40)
        if (x['men'] or {}).get('tasta') == '3 pt':
            r = pas(pg, 'Enter')
            break
    s = S(pg)
    cont = json.dumps({k: v for k, v in s.items() if 'contur' in k or 'linie' in k}, ensure_ascii=False)
    ok = r is not None and any(e['a'] == 'contur_forma' and e.get('act') == 'meniu:3 pt' for e in r['ev'])
    V = [('3pt_ales', ok, {'cont': cont[:300], 'r': r})]
    return V, {}


# ------------------------------------------------------------------ T4: Esc în modul tastelor de acces = tasta_esc (api:172)
def t4_app(H, app, cont, chei):
    pg = deschide(H, app, cont)
    if app == 'powerpoint':
        prep_do(pg, [T])
    else:
        pg.mouse.click(600, 450); pg.wait_for_timeout(100)
    ev(pg)
    p = pasi(pg, chei, app=app)
    return pg, p


def t4_verif(p, i_esc, i_alt2):
    esc = [e for i in i_esc for e in p[i]['ev']]
    alt2 = [e for i in i_alt2 for e in p[i]['ev']]
    return [('esc_tasta_esc', bool(esc) and all(e['g'] == 'tasta_esc' and e['a'] == 'iesire_taste_acces' for e in esc), esc),
            ('alt_a_doua_oara_tasta_acces', bool(alt2) and all(e['g'] == 'tasta_acces' and e['a'] == 'iesire_taste_acces' for e in alt2), alt2)]


@caz
def t4_powerpoint(H):
    pg, p = t4_app(H, 'powerpoint', None, ['Alt', 'h', 'f', 'Escape', 'Escape', 'Escape', 'Alt', 'Alt'])
    # Alt, H (Home deja activă = navigare), F (prefix), Esc (urcă la file), Esc (iese); al treilea Esc e un Esc obișnuit (caseta)
    V = t4_verif(p, [3, 4], [7])
    V.append(('insignele_dispar', not p[4]['kt'] and not p[7]['kt'], [p[4]['kt'], p[7]['kt']]))
    return V, {'pasi': [[(e['g'], e['a']) for e in x['ev']] for x in p]}


@caz
def t4_word(H):
    pg, p = t4_app(H, 'word', {}, ['Alt', 'h', 'Escape', 'Escape', 'Alt', 'Alt'])
    return t4_verif(p, [2, 3], [5]), {'pasi': [[(e['g'], e['a'], e['t']) for e in x['ev']] for x in p]}


@caz
def t4_excel(H):
    pg, p = t4_app(H, 'excel', {}, ['Alt', 'h', 'Escape', 'Escape', 'Alt', 'Alt'])
    return t4_verif(p, [2, 3], [5]), {'pasi': [[(e['g'], e['a'], e['t']) for e in x['ev']] for x in p]}


def cu_asistent(pg, tinta, app='powerpoint'):
    pg.evaluate("([a,t])=>{window.__as=LH.aplicatii.asistent(a,{pasi:[{tinta:t,indiciu:'Aici'}],dupaGreseli:2,dupaSecunde:600})}", [app, tinta])
    pg.wait_for_timeout(50)


def indicii(pg):
    return pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-indiciu]')].length)()")


@caz
def t4_asistent_esc(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    cu_asistent(pg, 'meniu:Yellow')
    p = pasi(pg, ['Alt', 'Escape', 'Alt', 'h', 'Escape', 'Escape'])
    n = indicii(pg)
    V = [('esc_nu_e_greseala', n == 0, {'indicii': n, 'ev': [[(e['g'], e['a']) for e in x['ev']] for x in p]})]
    return V, {}


# ------------------------------------------------------------------ punctul 5 (critic 13 §6-§7)
@caz
def p5_asistent_alt_h_s_f(H):
    pg = deschide(H)
    prep_do(pg, STEA); ev(pg)
    cu_asistent(pg, 'meniu:Yellow')
    p = pasi(pg, ['Alt', 'h', 's', 'f'])
    n = indicii(pg)
    V = [('H_pe_home_activa_e_navigare', bool(p[1]['ev']) and p[1]['ev'][0]['a'] == 'prefix_tasta_acces', p[1]['ev']),
         ('fara_indiciu_la_lista_buna', n == 0, {'indicii': n, 'ev': [[(e['g'], e['a']) for e in x['ev']] for x in p]})]
    return V, {}


@caz
def p5_lista_font_mouse_litere(H):
    pg = deschide(H)
    prep_do(pg, [T]); ev(pg)
    t0 = S(pg, 'diapozitive')['diapozitive'][0]
    prep_do(pg, [('clic', 'meniu_derulant:Home/Font/Font')])
    m = men(pg)
    p = pasi(pg, [('type', 'arial'), 'Backspace'])
    t1 = S(pg, 'diapozitive')['diapozitive'][0]
    V = [('lista_deschisa', (m or {}).get('supr') == 'lista.Font', m),
         ('literele_nu_intra_in_titlu', t0 == t1, {'inainte': t0, 'dupa': t1, 'ev': [x['ev'] for x in p]})]
    return V, {}


@caz
def p5_lista_shapes_mouse_litere(H):
    pg = deschide(H)
    prep_do(pg, STEA + [('clic', 'meniu_derulant:Home/Drawing/Shape Fill')]); ev(pg)
    t0 = text_stea(pg)
    p = pasi(pg, [('type', 'ab')])
    V = [('literele_nu_intra_in_stea', text_stea(pg) == t0, {'t0': t0, 't1': text_stea(pg), 'ev': p[0]['ev'], 'men': men(pg)})]
    return V, {}


@caz
def p5_caseta_font_clic(H):
    pg = deschide(H)
    prep_do(pg, [T, B]); ev(pg)
    r = pg.evaluate("""(()=>{const i=document.querySelector('[data-lh-id-mso="Font"] input');const r=i.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()""")
    pg.mouse.click(r[0] + r[2] * 0.4, r[1] + r[3] / 2); pg.wait_for_timeout(150)
    ev(pg)
    p = pasi(pg, [('type', 'Arial')])
    v = pg.evaluate("(()=>{const i=document.querySelector('[data-lh-id-mso=\"Font\"] input');return i?i.value:null})()")
    q = pas(pg, 'Enter')
    s = S(pg, 'font_text')
    V = [('clicul_alege_tot', v == 'Arial', v),
         ('nume_enter_aplica', s['font_text'] == 'Arial', {'s': s, 'ev': q['ev']}),
         ('tastare_dupa_diferit', all(e['dif'] for e in p[0]['ev'] if e['g'] == 'tastare') and any(e['g'] == 'tastare' for e in p[0]['ev']), p[0]['ev'])]
    return V, {}


@caz
def p5_tastare_file_name(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['F12'])]); ev(pg)
    p = pasi(pg, [('type', 'ab')])
    V = [('tastare_dupa_diferit', bool(p[0]['ev']) and all(e['dif'] for e in p[0]['ev'] if e['g'] == 'tastare'), p[0]['ev'])]
    return V, {}


@caz
def p5_click_to_add_notes(H):
    pg = deschide(H)
    t = pg.evaluate("(()=>document.querySelector('[data-lh-aplicatie]').innerText.includes('Click to add notes'))()")
    V = [('fara_text_din_memorie', not t, t)]
    return V, {}


@caz
def p5_open_documente(H):
    pg = deschide(H)
    prep_do(pg, [('tast', ['Control+o']), ('clic', 'backstage:Browse')])
    a = pg.evaluate("""(()=>{const d=document.querySelector('[data-lh-suprafata="dialog.FileOpen"]');return [...d.querySelectorAll('[data-lh-eticheta="Documente"]')].filter(x=>x.offsetParent&&x.innerText.trim()==='Documente').map(x=>{const r=x.getBoundingClientRect();return [x.getAttribute('data-lh-tip'),Math.round(r.x),Math.round(r.y),Math.round(r.width)]})})()""")
    V = [('adresa_documente', len(a) == 1 and a[0][0] == 'SplitButton', a)]
    return V, {}


def ruleaza_tel(radacina, filtru=None):
    """telefonul (360 × 740, atingere): tastarea în note, prin „input” (CDP Input.insertText) — ținta zona_note"""
    R = {}
    if filtru and filtru not in 'p5_telefon_note':
        return R
    with Ham(radacina=radacina, viewport=(360, 740), mobil=True) as H:
        try:
            pg = H.app('powerpoint', C)
            z = centru(pg, 'zona_note')
            pg.touchscreen.tap(z[0], z[1]); pg.wait_for_timeout(200); ev(pg)
            pg.keyboard.insert_text('Ăla e cal'); pg.wait_for_timeout(200)
            e = ev(pg)
            s = S(pg, 'note_diapozitive')
            V = [('note_scrise', (s['note_diapozitive'] or [''])[0] == 'Ăla e cal', s),
                 ('tinta_zona_note', bool(e) and all(x['t'] == 'zona_note' for x in e if x['g'] == 'tastare'), e)]
            R['p5_telefon_note'] = {'verificari': [{'nume': n, 'ok': bool(o), 'detalii': d if not o else None} for n, o, d in V], 'extra': {}}
        except Exception:
            R['p5_telefon_note'] = {'eroare': traceback.format_exc()[-800:]}
        R['_erori_pagina_tel'] = list(H.erori)
        R['_plecate_tel'] = list(H.plecate)
    return R


def ruleaza(radacina, filtru=None):
    R = {}
    with Ham(radacina=radacina) as H:
        for f in CAZURI:
            if filtru and filtru not in f.__name__:
                continue
            try:
                V, extra = f(H)
                R[f.__name__] = {'verificari': [{'nume': n, 'ok': bool(o), 'detalii': d if not o else None} for n, o, d in V], 'extra': extra}
            except Exception:
                R[f.__name__] = {'eroare': traceback.format_exc()[-800:]}
            for pg in list(H.ctx.pages):
                pg.close()
        R['_erori_pagina'] = list(H.erori)
        R['_plecate'] = list(H.plecate)
    R.update(ruleaza_tel(radacina, filtru))
    return R


def numara(R):
    pic = []
    for k, v in R.items():
        if k.startswith('_'):
            continue
        if 'eroare' in v:
            pic.append(k + ' (eroare)')
            continue
        pic += [k + '.' + x['nume'] for x in v['verificari'] if not x['ok']]
    return pic


if __name__ == '__main__':
    mod = sys.argv[1] if len(sys.argv) > 1 else 'ambele'
    filtru = sys.argv[2] if len(sys.argv) > 2 else None
    suf = ('_' + filtru) if filtru else ''
    pic_dupa = []
    if mod in ('inainte', 'ambele'):
        tmp = tempfile.mkdtemp(prefix='lh_r14_')
        try:
            arh = subprocess.run(['git', '-C', WT, 'archive', PORNIRE, 'aplicatii'], capture_output=True, check=True).stdout
            subprocess.run(['tar', '-x', '-C', tmp], input=arh, check=True)
            R = ruleaza(tmp, filtru)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        R['_tmp_sters'] = not os.path.exists(tmp)
        scrie(R, 'proba_grav_inainte%s.json' % suf)
        print('INAINTE picate:', len(numara(R)), numara(R))
    if mod in ('dupa', 'ambele'):
        R = ruleaza(WT, filtru)
        scrie(R, 'proba_grav_dupa%s.json' % suf)
        pic_dupa = numara(R)
        print('DUPA picate:', len(pic_dupa), pic_dupa)
        print('erori pagina:', R['_erori_pagina'][:5], 'plecate:', R['_plecate'][:5])
    print(len(pic_dupa))
