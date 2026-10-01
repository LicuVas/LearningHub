# -*- coding: utf-8 -*-
"""Oracolul literelor oficiale în pachetul profesorului (C:\\00\\Projects\\Info_Gimnaziu_2026), 01.10.2026.
Numără: urmele schemelor vechi (A = De bază / B = De bază / plan de recuperare / „nivelul se ia cumulativ”) în
documente, generatoare, date și materialele tipărite; testele sumative care nu au C 40 / B 30 / A 20; fișele de criterii
fără cele cinci niveluri, fără „Niciun document oficial…” sau fără nota despre explicație. Ultima linie = total."""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
P = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r'C:\00\Projects\Info_Gimnaziu_2026')
FIS = [P / 'SISTEM_EVALUARE.md', P / 'PROMPT_PRODUCTIE_LECTII.md']
for d, pat in ((P / 'instrumente', '*.md'), (P / 'materiale' / 'print', '*.html'), (P / 'materiale' / 'continut', '*.json'), (P / 'generator', '*.py')):
    FIS += sorted(d.glob(pat))
VECHI = [
    (r'\bB\s*=\s*De bază', 'B = De bază'), (r'\bC\s*=\s*Consolidat', 'C = Consolidat'),
    (r'\bA\s*=\s*De bază', 'A = De bază'), (r'\bC\s*=\s*Avansat', 'C = Avansat'),
    (r'\bA\s*·\s*De bază', 'A · De bază'), (r'\bC\s*·\s*Avansat', 'C · Avansat'),
    (r'plan de recuperare', 'plan de recuperare'), (r'se ia cumulativ', 'nivelul cumulativ'),
    (r'[Pp]artea A\W{0,10}(?:=|:|,)?\s*(?:nivel\w*\s*)?De bază', 'partea A = De bază'),
]
probleme = []
for f in FIS:
    if f.name.endswith('.bak') or '.bak_' in f.name:
        continue
    t = f.read_text(encoding='utf-8', errors='replace')
    for rau, nume in VECHI:
        for m in re.finditer(rau, t):
            # nota istorică din SISTEM_EVALUARE (datată 01.10.2026) poate cita schema veche doar dacă spune „înainte”
            ctx = t[max(0, m.start() - 200):m.end()]
            if f.name == 'SISTEM_EVALUARE.md' and re.search(r'înainte|până la 01\.10|vechi', ctx):
                continue
            probleme.append(f'{f.relative_to(P)}: „{nume}”')

# testele sumative: C 40 / B 30 / A 20
ts = json.loads((P / 'materiale' / 'continut' / 'teste_sumative.json').read_text(encoding='utf-8'))
teste = ts.get('teste', ts) if isinstance(ts, dict) else {}
for tid, t in (teste.items() if isinstance(teste, dict) else []):
    if not isinstance(t, dict) or 'exercitii' not in t:
        continue
    pe = {}
    for e in t['exercitii']:
        pe[e['nivel']] = pe.get(e['nivel'], 0) + e['puncte']
    if pe != {'C': 40, 'B': 30, 'A': 20}:
        probleme.append(f'teste_sumative {tid}: puncte pe nivel {pe} (trebuie C 40 / B 30 / A 20)')

# fișele de criterii
for cls in ('V', 'VI', 'VII', 'VIII'):
    f = P / 'instrumente' / f'Fisa_criterii_elev_clasa_{cls}.md'
    t = f.read_text(encoding='utf-8')
    for cere, nume in (('În formare', 'D1 În formare'), ('În dificultate', 'D2 În dificultate'),
                       ('Niciun document oficial', '„Niciun document oficial…”'), ('plan individualizat de învățare', 'plan individualizat'),
                       ('C · De bază', 'C · De bază'), ('B · Consolidat', 'B · Consolidat'), ('A · Avansat', 'A · Avansat')):
        if cere not in t:
            probleme.append(f'Fisa_criterii {cls}: lipsește {nume}')
    if not re.search(r'expli', t):
        probleme.append(f'Fisa_criterii {cls}: lipsește nota despre explicație')
    if 'pot explica de ce am făcut așa' in t:
        probleme.append(f'Fisa_criterii {cls}: explicația e încă în definiția Avansat')

for p_ in probleme:
    print('PROBLEMA:', p_)
print(f'fișiere citite: {len(FIS)}; probleme: {len(probleme)}')
print(len(probleme))
