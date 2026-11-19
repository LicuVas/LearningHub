# -*- coding: utf-8 -*-
"""Recunoastere: tintele ferestrei Open (Ctrl+F12) si ale Save As cu foldere din continut; ce arata pe ecran."""
from h5 import *

s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    def r_open():
        deschide(pg, {'paragrafe': ['Ana'], 'fisiere': [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA]})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(400)
        t = [x for x in pg.evaluate("() => LH.aplicatii.tinte('word')") if not x.startswith(('panglica', 'fila', 'lansator', 'meniu_derulant', 'acces_rapid', 'zoom', 'bara_stare', 'text'))]
        pg.screenshot(path=OUT + 'e5_open.png')
        return {'tinte': t, 'dlg': dlg(pg), 'ev': evt(pg), 'stare': scurt(pg)}
    caz('open_ctrl_f12', r_open)

    def r_saveas():
        deschide(pg, {'paragrafe': ['Ana'], 'fisiere': [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(400)
        t = [x for x in pg.evaluate("() => LH.aplicatii.tinte('word')") if x.startswith(('arbore', 'lista', 'fereastra', 'camp', 'dialog_salvare'))]
        pg.screenshot(path=OUT + 'e5_saveas.png')
        return {'tinte': t, 'dlg': dlg(pg)}
    caz('saveas_f12', r_saveas)
    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 're5.json')
print(json.dumps(R, ensure_ascii=False, indent=1)[:9000])
