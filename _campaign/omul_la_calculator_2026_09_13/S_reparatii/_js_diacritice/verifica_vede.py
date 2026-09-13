# -*- coding: utf-8 -*-
"""Citeste rezultatele H_vede pentru cele 3 lectii: pasi_blocati, pageerror, textele JS cu diacritice."""
import io, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, 'vede_js')
TEXTE = ["Verifică dacă ai înțeles", "Următorul pas", "Răspunde ca să mergi mai departe", "Înapoi",
         "De ce înveți asta (obiectivele lecției)", "Atenție! Răspunsul se blochează",
         "Verifica daca ai inteles", "Urmatorul pas", "Raspunde ca sa"]
CED = "şţŞŢ"
for d in sorted(os.listdir(BASE)):
    p = os.path.join(BASE, d)
    m = json.load(io.open(os.path.join(p, 'masuri.json'), encoding='utf-8'))
    c = json.load(io.open(os.path.join(p, 'consola.json'), encoding='utf-8'))
    items = c if isinstance(c, list) else c.get('mesaje', c.get('messages', []))
    pe = [x for x in items if 'pageerror' in json.dumps(x, ensure_ascii=False)]
    viz = io.open(os.path.join(p, 'innerText_vizibil.txt'), encoding='utf-8').read()
    tot = io.open(os.path.join(p, 'innerText.txt'), encoding='utf-8').read()
    print(f"== {d}: pasi_blocati={m.get('pasi_blocati')} pageerror={len(pe)} sedile_innerText={sum(tot.count(x) for x in CED)}")
    for t in TEXTE:
        print(f"   vizibil={viz.count(t):3d} total={tot.count(t):3d}  {t}")
    if pe:
        print('   ', json.dumps(pe[:3], ensure_ascii=False)[:400])
    print('   masuri keys:', list(m.keys())[:15])
