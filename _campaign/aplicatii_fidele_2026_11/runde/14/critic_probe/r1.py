# -*- coding: utf-8 -*-
import json
R='C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/'
j=json.load(open(R+'uia_powerpoint.json',encoding='utf-8'))
f11=j['acoperire_r11']['fapte']; f12=j['acoperire_r12']['fapte']
for k in ('b_ctrl_w','b_file_close','b_x','b_dont_save','b_ctrl_n_din_fereastra_goala','b_ctrl_n_cu_prezentare','b_ctrl_o'):
    print('R11',k, json.dumps(f11[k],ensure_ascii=False)[:1800]); print()
for k in ('b_enter_in_save_your_changes','b_ctrl_o_browse','b_blank_presentation'):
    print('R12',k, json.dumps(f12[k],ensure_ascii=False)[:2500]); print()
print('R11 cum', json.dumps(j['acoperire_r11'].get('cum'),ensure_ascii=False)[:800])
