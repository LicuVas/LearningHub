# -*- coding: utf-8 -*-
"""B, completare: acelasi fisier deschis a doua oara (NEmodificat) — documente_deschise si Ctrl+W la capatul atelierului
m1-l03:262-290 (verificarea docuri:0). Iesirea: rd5.json."""
from h5 import *


def dublu(pg, tinta):
    r = rect(pg, tinta)
    if not r:
        return 'LIPSA ' + tinta
    pg.mouse.dblclick(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(300)
    return r


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    def deja_deschis_nemodificat():
        fis = [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}]
        deschide(pg, {'paragrafe': [''], 'fisiere': fis})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(200)
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Descărcări'); dublu(pg, 'lista:club-lectura.docx')
        a = scurt(pg)
        # elevul crede ca nu s-a deschis si o deschide iar, la fel
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Descărcări'); dublu(pg, 'lista:club-lectura.docx')
        x = scurt(pg)
        pg.keyboard.press('Control+End'); pg.keyboard.type(' Pop Mihai')
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Documente'); ct(pg, 'camp:nume_fisier'); pg.keyboard.press('Control+a'); pg.keyboard.type('Pop_Mihai_7A_club'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        y = scurt(pg)
        return {'prima_deschidere': {k: a[k] for k in ('docs', 'titlu', 'nume')}, 'a_doua_deschidere': {k: x[k] for k in ('docs', 'titlu', 'nume', 'msg')},
                'dupa_save_si_ctrl_w': {k: y[k] for k in ('docs', 'titlu', 'text', 'nume', 'dlg')}, 'ev': evt(pg)[-4:]}
    caz('deja_deschis_nemodificat', deja_deschis_nemodificat)
    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 'rd5.json')
print(json.dumps(R, ensure_ascii=False, indent=1)[:3000])
