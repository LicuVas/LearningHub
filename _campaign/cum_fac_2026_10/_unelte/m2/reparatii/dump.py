import json, sys, os
BASE = r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/digest/'
OUT = r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reparatii/'
for name in sys.argv[1:]:
    d = json.load(open(BASE + name + '.json', encoding='utf-8'))
    L = []
    L.append(f"# {d['clasa']} L{d['nr']} {d['titlu']} | cale={d['cale']}")
    L.append(f"obiectiv: {d['obiectiv']}")
    for p in d['pasi']:
        L.append(f"\n## {p['id']} — {p['titlu']}")
        L.append(f"TEXT: {p['text']}")
        if p.get('uite_cum'): L.append(f"UITE_CUM: {p['uite_cum']}")
        if p.get('altfel'): L.append(f"ALTFEL: {p['altfel']}")
        for i, inc in enumerate(p.get('incearca', [])):
            L.append(f"INCEARCA[{i}]: {json.dumps(inc, ensure_ascii=False)}")
        for c in p.get('capturi', []):
            L.append(f"CAPTURA: {json.dumps(c, ensure_ascii=False)}")
    ar = d.get('aplicatie_reala') or {}
    L.append(f"\n## REAL — {ar.get('titlu')} ({ar.get('aplicatie')})")
    for i, s in enumerate(ar.get('pasi', [])):
        L.append(f"R{i+1}: {s}")
    for k, v in ar.items():
        if k not in ('pasi', 'titlu', 'aplicatie'):
            L.append(f"REAL.{k}: {json.dumps(v, ensure_ascii=False)}")
    L.append(f"\n## INTREBARI: {json.dumps(d.get('intrebari'), ensure_ascii=False)[:1500]}")
    open(OUT + name + '.txt', 'w', encoding='utf-8').write('\n'.join(L))
    print(name, len('\n'.join(L)))
