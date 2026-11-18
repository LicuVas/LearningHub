# -*- coding: utf-8 -*-
"""Judecata 2, L02 refăcută: TOATĂ lecția, de la cuprins la diplomă, ca un elev, cu butoanele paginii (fără JocMotor.test):
fiecare „Încearcă”, fiecare „Încă un exercițiu”, atelierul (cu lista testelor: se vede și se bifează pe rând) și „Încă unul”,
pasul din laborator, cele 5 întrebări, diploma. 390 px cu atingere și 1280 px cu mouse + tastatura adevărată.
Regula 24: cererile care nu merg spre 127.0.0.1 sunt oprite. Ieșire: j2_parcurs.json + capturi j2_parcurs_<dev>_*.png.
Ultima linie = numărul de probleme."""
import json
import sys
import traceback
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
from j_comun import server, context, Pagina, FARA  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")
# COPIE (16.11.2026) din C:/00/Projects/LearningHub/lectii/vii/m1-l02/_verificare/j2_parcurs.py (sha256 e16d72be...; _verificare nu e in git).
# Schimbari: (1) situl = LH_RADACINA (prin j_comun.py de alaturi); (2) j2_parcurs.json si capturile merg in LH_IESIRE
# (implicit un folder temporar), nu langa script - oracole/ e inghetat in repere.lock; (3) penultima linie = calea JSON-ului;
# (4) 17.11.2026: sendBeacon oprit si prezenta.js / site-credit.js neincarcate (j_comun.context, ca sarcini_lib/joaca.py);
# eroarea de consola a acestor fisiere abandonate de proba nu se numara (orice alta eroare de consola, da).
import os  # noqa: E402
import tempfile  # noqa: E402
AICI = Path(os.environ["LH_IESIRE"]) if os.environ.get("LH_IESIRE") else Path(tempfile.gettempdir()) / "lh_porti_j2"
AICI.mkdir(parents=True, exist_ok=True)
R = {"pasi": {}, "teste_atelier": {}, "probleme": [], "erori_js": [], "erori_consola": []}
srv, BAZA = server()
URL = BAZA + "/lectii/vii/m1-l02/index.html"


def problema(t):
    R["probleme"].append(t)
    print("PROBLEMĂ", t, flush=True)


def rulez(br, dev):
    tel = dev == "tel"
    ctx = context(br, tel, R)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: R["erori_js"].append(f"{dev}: {e}"))
    # 17.11.2026: eroarea de încărcare a fișierelor abandonate DE PROBĂ (j_comun.FARA: prezenta.js, site-credit.js — nu
    # vorbesc cu serverul viu) nu e o eroare a lecției; orice altă eroare de consolă de pe 127.0.0.1 se numără ca înainte
    pg.on("console", lambda m: m.type == "error" and "127.0.0.1" in ((m.location or {}).get("url") or "127.0.0.1")
          and not ((m.location or {}).get("url") or "").split("?")[0].endswith(FARA)
          and R["erori_consola"].append(f"{dev}: {m.text[:160]}"))
    pg.goto(URL); pg.wait_for_timeout(900)
    P = Pagina(pg, tel, R, dev)
    if pg.get_by_text("Nu, doar vizitez").count():
        P.apasa(pg.get_by_text("Nu, doar vizitez"))
    P.apasa(pg.locator('.lvl[data-l="0"]'))

    def urm():
        P.apasa(pg.locator("#pas-next")); P.w(450)

    def inca():
        P.apasa(pg.locator("button", has_text="Încă un exercițiu")); P.w(450)

    def teste():
        return pg.evaluate("[...document.querySelectorAll('#body .wu-teste li')].filter(l=>l.offsetParent).map(l=>(l.classList.contains('ok')?'✔ ':'○ ')+l.innerText.trim().replace(/\\s+/g,' ').slice(0,60))")

    def ok(nume, cere_teste=False):
        t_inainte = teste()
        fb = P.verifica()
        R["pasi"][f"{dev} {nume}"] = fb[:160]
        if "Corect" not in fb:
            problema(f"{dev} {nume}: {fb[:220]} | doc={P.doc()}")
        if cere_teste and not t_inainte:
            problema(f"{dev} {nume}: lista testelor nu se vede")
        lat = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        if lat[0] > lat[1] + 1:
            problema(f"{dev} {nume}: pagina mai lată decât ecranul {lat}")

    def alege(text, nume):
        P.apasa(pg.locator("#body .opt", has_text=text)); P.w(250)
        fb = P.fb()
        R["pasi"][f"{dev} {nume}"] = fb[:160]
        if "Corect" not in fb:
            problema(f"{dev} {nume}: {fb[:200]}")

    def rb(sel):
        P.buton(f".wu-rb {sel}")

    def la_capat(b):
        t = P.doc()[b]; P.la(*P.car(b, len(t) - 1, "dr"))

    def gol(b):
        g = pg.locator(f'#body .wo-doc .wo-p[data-b="{b}"]').bounding_box(); P.la(g["x"] + 30, g["y"] + g["height"] / 2)

    R["pasi"][f"{dev} P0"] = pg.locator("#app h2").first.inner_text()[:40]; urm()
    # P1
    P.apasa(pg.locator("#body .wu-cw")); ok("P1 bara de stare", True)
    inca()
    if tel:
        for _ in range(8):
            P.buton('[data-wu="jos"]')
    else:
        pg.locator("#body .wo-pag").hover(); pg.mouse.wheel(0, 900); P.w(400)
    n = len(P.doc()) - 1; P.la(*P.car(n, len(P.doc()[n]) - 1, "dr")); ok("P1 încă 1: derulare + clic după Sfârșit.", True)
    inca(); alege("Ești pe pagina 2; documentul are 3 pagini", "P1 încă 2")
    urm()
    # P2
    rb('[data-wu="lans"][data-id="FontDialog"]'); ok("P2 lansatorul Font", True)
    inca(); rb('[data-tab="TabView"]'); rb('[data-wu="rigla"]'); ok("P2 încă 1: View › Ruler", True)
    inca(); alege("Panglica arată butoanele filei Inserare", "P2 încă 2")
    urm()
    # P3
    P.la(*P.car(0, 4, "st")); P.scrie("are "); ok("P3 „are ”")
    inca(); P.la(*P.car(0, 0, "st")); P.k("dr", len(P.doc()[0])); ok("P3 încă 1: → până după punct", True)
    inca(); alege("Rămâne pe loc; se mută abia la clic", "P3 încă 2")
    urm()
    # P4 (focus:true: pe calculator tastezi direct, fără clic)
    if tel:
        pg.locator("#body .wo-doc").evaluate("e=>e.scrollIntoView({block:'center'})"); P.w(300)
        bb = pg.locator("#body .wo-doc .wo-p").first.bounding_box(); P.la(bb["x"] + 20, bb["y"] + bb["height"] / 2)
        P.scrie("Titlu")
    else:
        R["pasi"][f"{dev} P4 focus la început"] = P.activ()
        pg.keyboard.type("Titlu", delay=25); P.w(150)
    # 13.11.2026: Word-ul din laborator (Word 2007) anulează câte o literă: „Titlu”, Enter, „Text”, 2 × Ctrl+Z = „Titlu” + „Te”
    # (pe telefon P4 n-are butoanele Ctrl+Z / Ctrl+Y: anularea se învață la P5; acolo e proba de telefon, la „încă 1”)
    if not tel:
      P.k("enter"); P.scrie("Text"); P.k("z", 2); d = P.doc(); R["pasi"][f"{dev} P4 Titlu/Text 2×Ctrl+Z"] = d
      if d != ["Titlu", "Te"]:
          problema(f"{dev} P4: „Titlu”, Enter, „Text”, 2 × Ctrl+Z a dat {d}, nu ['Titlu', 'Te']")
      P.k("y", 2); d = P.doc()
      if d != ["Titlu", "Text"]:
          problema(f"{dev} P4: după 2 × Ctrl+Y a rămas {d}, nu ['Titlu', 'Text']")
    P.apasa(pg.locator('#body [data-k="reset"]')); P.w(300)
    if P.doc() != [""]:
        problema(f"{dev} P4: „Ia-o de la capăt” a lăsat {P.doc()}")
    gol(0); P.scrie("Planul de luni")
    P.k("enter"); P.scrie("Mergem la film.")
    if not tel:
        P.k("z", 3); d = P.doc(); R["pasi"][f"{dev} P4 exemplul 3×Ctrl+Z"] = d
        if d != ["Planul de luni", "Mergem la fi"]:
            problema(f"{dev} P4: exemplul din teorie, 3 × Ctrl+Z a dat {d}, nu ['Planul de luni', 'Mergem la fi']")
        P.k("y", 3)
    rb('[data-wu="pil"]'); ok("P4 Enter + ¶", True)
    inca(); rb('[data-wu="pil"]'); gol(1); ok("P4 încă 1: ¶ + rândul gol", True)
    inca(); alege("Tastezi mai departe; Word trece singur pe rândul următor", "P4 încă 2")
    urm()
    # P5
    t = P.doc()[0]; i = t.index("tt"); P.la(*P.car(0, i, "dr")); P.k("bs"); P.k("z"); P.k("y"); ok("P5 ⌫, Ctrl+Z, Ctrl+Y", True)
    inca()
    if tel:
        # proba de telefon a scenariului „Titlu/Text”: Enter, „Text”, 2 × Ctrl+Z (butonul) = „Te”; apoi de la capăt
        start = P.doc()[0]; la_capat(0); P.k("enter"); P.scrie("Text"); P.k("z", 2); d = P.doc()
        R["pasi"][f"{dev} P5 încă 1 Text 2×Ctrl+Z"] = d
        if d != [start, "Te"]:
            problema(f"{dev} P5 încă 1: Enter, „Text”, 2 × Ctrl+Z a dat {d}, nu [{start!r}, 'Te']")
        P.k("z", 3); d = P.doc(); R["pasi"][f"{dev} P5 încă 1 încă 3×Ctrl+Z"] = d
        if d != [start]:
            problema(f"{dev} P5 încă 1: după încă 3 × Ctrl+Z ({d}) trebuia să rămână doar {start!r}")
        la_capat(0); P.scrie(" Vino la noi!")
    else:
        R["pasi"][f"{dev} P5 încă 1 focus"] = P.activ()
        pg.keyboard.type(" Vino la noi!", delay=25); P.w(150)
    a = P.doc()[0]; P.k("z"); b = P.doc()[0]; P.k("y"); c = P.doc()[0]
    R["pasi"][f"{dev} P5 încă 1 stări"] = [a, b, c]
    if not (a.endswith("Vino la noi!") and b == a[:-1] and c == a):
        problema(f"{dev} P5 încă 1: Ctrl+Z trebuia să scoată doar „!” și Ctrl+Y să-l aducă: {[a, b, c]}")
    ok("P5 încă 1: tastare, Ctrl+Z, Ctrl+Y", True)
    inca(); rb('[data-wu="pil"]'); gol(1); P.k("bs"); ok("P5 încă 2: rândul gol cu ⌫", True)
    inca(); alege("cure", "P5 încă 3")
    inca(); alege("Aduce înapoi „c”: scrie iar „abc”", "P5 încă 4")
    urm()
    # ATELIER
    R["teste_atelier"][f"{dev} 0 la început"] = teste()
    rb('[data-wu="pil"]'); R["teste_atelier"][f"{dev} 1 după ¶"] = teste()
    gol(1); P.k("bs")
    t = P.doc()[2]; i = t.index("țț"); P.la(*P.car(2, i, "dr")); P.k("bs")
    t = P.doc()[1]; i = t.index("joi"); P.la(*P.car(1, i + 2, "dr")); P.k("bs", 3); P.scrie("vineri")
    la_capat(2); P.scrie(" Vino la noi!")
    R["teste_atelier"][f"{dev} 2 la final"] = teste()
    ok("atelier: anunțul bibliotecii", True)
    pg.screenshot(path=str(AICI / f"j2_parcurs_{dev}_atelier.png"))
    inca(); rb('[data-wu="pil"]')
    t = P.doc()[0]; i = t.index("  "); P.la(*P.car(0, i, "dr")); P.k("del")
    t = P.doc()[0]; i = t.index("ss"); P.la(*P.car(0, i, "dr")); P.k("bs")
    t = P.doc()[1]; i = t.index("13"); P.la(*P.car(1, i + 1, "dr")); P.k("bs"); P.scrie("4")
    ok("atelier încă unul: afișul concursului", True)
    # laboratorul
    P.apasa(pg.locator("button", has_text="Acum la calculatorul din laborator")); P.w(500)
    lab = pg.locator("#app").inner_text()
    R["pasi"][f"{dev} laborator"] = lab[:160]
    if "Planul de luni" not in lab:
        problema(f"{dev}: pasul din laborator nu arată pașii")
    pg.screenshot(path=str(AICI / f"j2_parcurs_{dev}_laborator.png"), full_page=True)
    P.apasa(pg.locator("button", has_text="La verificare")); P.w(500)
    alege("Săgeata mică ↘ din colțul grupului Paragraf", "Î1")
    P.apasa(pg.locator("#next")); P.w(300)
    rb('[data-wu="pil"]'); t = P.doc()[0]; i = t.index("  "); P.la(*P.car(0, i, "dr")); P.k("bs"); ok("Î2 spațiul în plus", True)
    P.apasa(pg.locator("#next")); P.w(300)
    alege("bacă", "Î3")
    P.apasa(pg.locator("#next")); P.w(300)
    if tel:
        la_capat(0); P.scrie(" Adu o minge.")
    else:
        pg.keyboard.type(" Adu o minge.", delay=25); P.w(150)
    a = P.doc()[0]; P.k("z"); b = P.doc()[0]; P.k("y"); c = P.doc()[0]
    R["pasi"][f"{dev} Î4 stări"] = [a, b, c]
    if not (a.endswith("Adu o minge.") and b == a[:-1] and c == a):
        problema(f"{dev} Î4: Ctrl+Z trebuia să scoată doar punctul și Ctrl+Y să-l aducă: {[a, b, c]}")
    ok("Î4 tastare, Ctrl+Z, Ctrl+Y", True)
    R["pasi"][f"{dev} Î4 text"] = P.doc()[0]
    P.apasa(pg.locator("#next")); P.w(300)
    alege("„Titlu” și, dedesubt, „Te”", "Î5")
    P.apasa(pg.locator("#next")); P.w(800)
    b = pg.locator("button", has_text="Vezi diploma")
    if b.count():
        P.apasa(b); P.w(800)
    fin = pg.locator("body").inner_text()
    R["pasi"][f"{dev} diploma"] = fin[:700]
    if "Cunoscător al ferestrei Word" not in fin:
        problema(f"{dev}: diploma nu apare")
    pg.screenshot(path=str(AICI / f"j2_parcurs_{dev}_diploma.png"))
    ctx.close()


with sync_playwright() as p:
    br = p.chromium.launch()
    for dev in ("tel", "pc"):
        try:
            rulez(br, dev)
        except Exception:  # noqa: BLE001
            problema(f"{dev} EXCEPȚIE: " + traceback.format_exc()[-900:])
    br.close()
for x in R["erori_js"] + R["erori_consola"]:
    problema("consolă: " + x[:200])
R["cereri_externe_oprite"] = sorted(set(u[:60] for u in R.pop("cereri_oprite", [])))
R["cereri_locale_oprite"] = sorted(set(u.split("//", 1)[-1].split("/", 1)[-1][:80] for u in R.pop("cereri_locale_oprite", [])))
(AICI / "j2_parcurs.json").write_text(json.dumps(R, ensure_ascii=False, indent=1), encoding="utf-8")
print(AICI / "j2_parcurs.json")
print(len(R["probleme"]))
sys.exit(1 if R["probleme"] else 0)
