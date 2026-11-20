# -*- coding: utf-8 -*-
"""B · ferestrele, scurtăturile pe obiecte / miniaturi, vederile, notele, F5 — taste adevărate (page.keyboard)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *
from b1 import rul, arata, C

FIS = [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]
CF = dict(C, fisiere=FIS)
T = ('clic', 'forma:1/1')
B = ('clic', 'margine_forma:1/1')
STEA = [('clic', 'miniatura:2'), ('clic', 'forma:2/2')]
R = {}
with Ham() as H:
    # ---- ferestrele
    R['open_mouse_browse'] = rul(H, [('tast', ['Control+o']), ('clic', 'backstage:Browse')], ['Tab', 'Tab', 'Shift+Tab', 'Alt+n'], [('type', 'Plante_6A_Pop.pptx'), ('k', 'Alt+o')], cont=CF)
    R['open_enter_gol'] = rul(H, [('tast', ['Control+o']), ('clic', 'backstage:Browse')], ['Enter', 'Escape', 'Escape'], cont=CF)
    R['open_nume_enter'] = rul(H, [('tast', ['Control+o']), ('clic', 'backstage:Browse')], [], [('type', 'Plante_6A_Pop.pptx'), ('k', 'Enter')], cont=CF)
    R['open_tab_lista'] = rul(H, [('tast', ['Control+o']), ('clic', 'backstage:Browse')], ['Shift+Tab', 'ArrowDown', 'Enter'], cont=CF)
    R['save_changes_tab'] = rul(H, [T, ('type', 'x'), ('tast', ['Control+w'])], ['Tab', 'Tab', 'Tab', 'Tab', 'Escape'])
    R['save_changes_altn'] = rul(H, [T, ('type', 'x'), ('tast', ['Control+w'])], ['Alt+n'])
    R['save_changes_alts'] = rul(H, [T, ('type', 'x'), ('tast', ['Control+w'])], ['Alt+s'])
    R['picture'] = rul(H, [], ['Alt', 'n', 'p', 'd'], [('type', 'pamant.png'), ('k', 'Alt+o')])
    R['picture_esc'] = rul(H, [], ['Alt', 'n', 'p', 'd', 'Escape'])
    R['font_dlg'] = rul(H, [T, B, ('clic', 'lansator:Home/Font')], ['Alt+s'], [('type', '40'), ('k', 'Tab'), ('k', 'Enter')])
    R['font_dlg_esc'] = rul(H, [T, B, ('clic', 'lansator:Home/Font')], ['Tab', 'Tab', 'Escape'])
    R['para_dlg'] = rul(H, [T, B, ('clic', 'lansator:Home/Paragraph')], ['Alt+g', 'Tab', 'Enter'])
    R['saveas_f12'] = rul(H, [], ['F12', 'Alt+n'], [('type', 'Vulcanii'), ('k', 'Alt+s')])
    R['ctrl_s_nou'] = rul(H, [], ['Control+s'])
    # ---- scurtăturile pe obiecte și miniaturi
    R['stea_c_v'] = rul(H, STEA, ['Control+c'], [('k', 'Control+z')], cont=None)
    R['stea_cv_mini3'] = rul(H, STEA + [('tast', ['Control+c']), ('clic', 'miniatura:3')], ['Control+v', 'Control+z', 'Control+y'])
    R['stea_x_v'] = rul(H, STEA, ['Control+x'], [('k', 'Control+z')])
    R['stea_delete'] = rul(H, STEA, ['Delete', 'Control+z', 'Control+y'])
    R['stea_tastare'] = rul(H, STEA, ['a', 'b'])
    R['stea_tab'] = rul(H, STEA, ['Tab', 'Tab'])
    R['stea_ctrl_a'] = rul(H, STEA, ['Control+a'])
    R['stea_ctrl_d'] = rul(H, STEA, ['Control+d'])
    R['stea_sageti'] = rul(H, STEA, ['ArrowRight', 'ArrowDown'])
    R['caseta_obiect_tastare'] = rul(H, [T, B], ['F', 'o'])
    R['caseta_obiect_delete'] = rul(H, [T, B], ['Delete', 'Control+z'])
    R['caseta_obiect_cv'] = rul(H, [T, B, ('tast', ['Control+c']), ('clic', 'miniatura:2')], ['Control+v'])
    R['text_esc_tab'] = rul(H, [T], ['Escape', 'Tab', 'Tab', 'Escape'])
    R['text_ctrl_a'] = rul(H, [T], ['Control+a'], [('type', 'Z')])
    R['mini_c_v'] = rul(H, [('clic', 'miniatura:2')], ['Control+c', 'Control+v', 'Control+x', 'Delete', 'Control+z', 'Control+d', 'Control+m', 'Control+a'])
    # ---- prezentarea, vederile, notele
    R['ctrl_n_w'] = rul(H, [], ['Control+n', 'Control+w'])
    R['f5_din_2'] = rul(H, [('clic', 'miniatura:2')], ['F5', 'ArrowRight', 'ArrowLeft', 'Escape', 'Shift+F5', 'Space', 'Backspace', 'Escape', 'Alt+F5', 'Escape'])
    R['sorter_taste'] = rul(H, [('clic', 'bara_stare:Slide Sorter'), ('clic', 'miniatura:1')], ['ArrowRight', 'ArrowRight', 'Delete', 'Control+z', 'Control+c', 'Control+v', 'Home', 'End', 'Enter'])
    R['note_taste'] = rul(H, [('clic', 'zona_note')], ['A', 'b', 'Enter', 'c', 'Backspace', 'ArrowLeft', 'Delete', 'Control+z', 'Control+z', 'Escape'])
    R['note_dupa_esc'] = rul(H, [('clic', 'zona_note'), ('type', 'ab'), ('tast', ['Escape'])], ['x', 'Delete'])
    R['plecate'] = H.plecate
scrie(R, 'b2_out.json')
arata(R, 'b2_out.txt')
