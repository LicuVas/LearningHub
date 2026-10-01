# -*- coding: utf-8 -*-
"""Oracolul alinierii la actele oficiale (01.10.2026) pentru lecțiile de organizare/notare: lectii/<cls>/<lectie>.
Folosire:  python oracol_m1l01.py v/m1-l01 [vi/m1-l01 ...]      (fără argumente: v, vi, vii, viii m1-l01 + v/m1-l07)
Ultima linie = numărul total de probleme (0 = curat).
Citește configurația dată lui JocMotor.porneste, prin browser, cu situl servit LOCAL și TOATĂ rețeaua externă blocată
(regula 24). Regulile: contract.md din același dosar; modelul = lectii/viii/m1-l01 (publicat eab6aa4d)."""
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
LH = Path(r'C:\00\Projects\LearningHub')
sys.path.insert(0, str(LH / 'lectii' / 'viii' / 'm1-l01' / '_proba'))
from server_local import porneste, blocheaza, BLOCATE  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

LECTII = [a for a in sys.argv[1:] if not a.startswith('-')] or ['v/m1-l01', 'vi/m1-l01', 'vii/m1-l01', 'viii/m1-l01', 'v/m1-l07']
# lecțiile de organizare (m1-l01) explică nivelurile; V/7 e o lucrare: acolo contează doar literele și socotelile
ORGANIZARE = {l for l in LECTII if l.endswith('m1-l01')}

CAPTURA = """Object.defineProperty(window,'JocMotor',{configurable:true,set(v){const o=v.porneste;v.porneste=c=>{window.__CFG=JSON.parse(JSON.stringify(c,(k,x)=>typeof x==='function'?undefined:x));return o.call(v,c)};Object.defineProperty(window,'JocMotor',{value:v,writable:true,configurable:true})},get(){return undefined}})"""


def fara_tag(h):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h or '')).strip()


def toate_textele(x, out):
    if isinstance(x, str):
        out.append(x)
    elif isinstance(x, dict):
        for v in x.values():
            toate_textele(v, out)
    elif isinstance(x, list):
        for v in x:
            toate_textele(v, out)
    return out


def cuvinte(h):
    return len(re.sub(r'<[^>]+>', ' ', h or '').split())


cfgs = {}
baza, srv = porneste()
with sync_playwright() as p:
    b = p.chromium.launch()
    for l in LECTII:
        ctx = b.new_context()
        ctx.route('**/*', blocheaza)
        pg = ctx.new_page()
        pg.add_init_script(CAPTURA)
        pg.goto(f'{baza}/lectii/{l}/')
        pg.wait_for_timeout(900)
        cfgs[l] = pg.evaluate('window.__CFG')
        ctx.close()
    b.close()
srv.shutdown()

total = 0
for l in LECTII:
    cfg = cfgs.get(l)
    probleme = []

    def cere(cond, mesaj):
        if not cond:
            probleme.append(mesaj)

    if not cfg:
        print(f'== {l}: configurația NU s-a putut citi')
        total += 1
        continue
    brut = ' '.join(toate_textele(cfg, []))
    txt = fara_tag(brut)
    html = (LH / 'lectii' / l / 'index.html').read_text(encoding='utf-8')
    head = html.split('<script', 1)[0]

    # --- literele oficiale (anexa 2): A = Avansat, B = Consolidat, C = De bază ---
    for rau, de_ce in [
        (r'\bB\s*=\s*De bază', 'schema veche „B = De bază” (oficial: C = De bază)'),
        (r'\bC\s*=\s*Consolidat', 'schema veche „C = Consolidat” (oficial: B = Consolidat)'),
        (r'\bA\s*=\s*De bază', 'schema veche „A = De bază” (oficial: A = Avansat)'),
        (r'\bC\s*=\s*Avansat', 'schema veche „C = Avansat” (oficial: A = Avansat)'),
        (r'\bA\s*·\s*De bază', 'schema veche „A · De bază” (oficial: C · De bază)'),
        (r'\bC\s*·\s*Avansat', 'schema veche „C · Avansat” (oficial: A · Avansat)'),
        (r'\bB\s*·\s*De bază|\bC\s*·\s*Consolidat', 'schema inițialelor „B · De bază / C · Consolidat” (oficial: C · De bază, B · Consolidat)'),
        (r'[Pp]artea A\W{0,12}(?:,|:)?\s*40', 'partea A cu 40 de puncte (oficial: A = Avansat, 20 p)'),
        (r'[Pp]artea C\W{0,12}(?:,|:)?\s*20', 'partea C cu 20 de puncte (oficial: C = De bază, 40 p)'),
        (r'\bA (\d+)(?: din 40)?, B (\d+)(?: din 30)?,? (?:și )?C (\d+)', 'punctaje în ordinea veche „A …, B …, C …” (oficial: C, B, A)'),
    ]:
        for m in re.finditer(rau, txt):
            probleme.append(f'{de_ce}: „…{txt[max(0, m.start() - 40):m.end() + 30]}…”')
    # punctaje imposibile pe schema oficială: A ≤ 20, B ≤ 30, C ≤ 40
    for lit, maxim in (('A', 20), ('B', 30), ('C', 40)):
        for m in re.finditer(rf'\b{lit} (\d+)(?= din| ?[,.;)]| și)', txt):
            if int(m.group(1)) > maxim:
                probleme.append(f'partea {lit} cu {m.group(1)} puncte (maxim {maxim} pe schema oficială): „…{txt[max(0, m.start() - 30):m.end() + 20]}…”')
    cere(not re.search(r'\bB\s*=\s*De bază', head), '<head> (meta) cu schema veche de litere')

    if l in ORGANIZARE:
        # --- cele cinci niveluri (anexa 2) ---
        cere('tot trei' not in txt, 'scrie „tot trei” (anexa 2: cinci niveluri)')
        cere('cinci niveluri' in txt, 'nu spune că ministerul numește cinci niveluri')
        cere('În formare' in txt and 'În dificultate' in txt, 'lipsesc numele D1/D2 (În formare, În dificultate)')
        # --- plan individualizat (ROFUIP art. 106 alin. 10) ---
        cere('plan de recuperare' not in txt, '„plan de recuperare” (actele: plan individualizat de învățare)')
        cere('plan individualizat de învățare' in txt, 'lipsește „plan individualizat de învățare”')
        cere(re.search(r'Fiecare elev primește, pe an, cel puțin un plan individualizat', txt), 'planul nu e spus ca fiind al fiecărui elev')
        # --- a cui e regula notă → nivel ---
        cere('Niciun document oficial nu leagă nivelul de notă' in txt, 'lipsește „Niciun document oficial nu leagă nivelul de notă”')
        cere(re.search(r'[Rr]egula profesorului', txt), 'regula notă → nivel nu e atribuită profesorului')
        cere(not re.search(r'Ministerul Educației(?! și Cercetării)', txt), '„Ministerul Educației” fără „și Cercetării”')
        # --- Avansat: definiția ministerului fără „explică de ce” ---
        for rau in ('poți explica de ce ai făcut așa', 'și explic de ce'):
            cere(rau not in txt, f'Avansat definit cu explicația: „{rau}”')
        # --- regula profesorului rămâne ---
        cere('punctaj : 10' in txt, 'a dispărut „punctaj : 10”')
        # --- cuvinte pe pas ---
        for i, s in enumerate(cfg['nivele'][0]['pasi'], 1):
            n, u = cuvinte(s.get('text')), cuvinte(s.get('exemplu'))
            cere(n <= 110, f'P{i} „{s["t"][:30]}”: text {n} cuvinte (> 110)')
            cere(u <= 85, f'P{i} „{s["t"][:30]}”: „Uite cum” {u} cuvinte (> ~80)')

    total += len(probleme)
    print(f'== {l}: {len(probleme)} probleme')
    for p_ in probleme:
        print('   PROBLEMA:', p_)

print(f'cereri externe oprite: {len(BLOCATE)}')
print(f'lecții verificate: {len(LECTII)}; probleme în total: {total}')
print(total)
