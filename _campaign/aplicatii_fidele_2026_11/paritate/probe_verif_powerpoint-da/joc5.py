# Jocul verificatorului powerpoint-da, partea 5: înlocuirea efectului din galerie păstrează locul în Animation Pane? (F052)
from comun import *


@test('F052_inlocuire_loc')
def f052b(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:2'); a.clic('fila:Animations')
    a.clic('margine_forma:2/1'); a.clic('meniu:Fade')
    a.clic('margine_forma:2/2'); a.clic('meniu:Fly In')
    r = {'inainte': [a.stare()['ordine_animatii'], a.stare()['pornire_animatii'][1]]}
    a.clic('margine_forma:2/1')
    a.clic('panglica:Animations/Timing/Start') if a.exista('panglica:Animations/Timing/Start') else None
    if a.exista('meniu:After Previous'):
        a.clic('meniu:After Previous')
    r['dupa_start'] = [a.stare()['ordine_animatii'], a.stare()['pornire_animatii'][1]]
    a.clic('margine_forma:2/1'); a.clic('meniu:Wipe')
    r['titlu_inlocuit_cu_wipe'] = [a.stare()['ordine_animatii'], a.stare()['pornire_animatii'][1], a.stare()['animatie_galerie']]
    a.clic('panglica:Animations/Advanced Animation/Animation Pane')
    r['randuri_panou'] = [t for t in a.tinte('fereastra:') if 'Click' in t or 'Previous' in t]
    return r


if __name__ == '__main__':
    ruleaza('rez5')
