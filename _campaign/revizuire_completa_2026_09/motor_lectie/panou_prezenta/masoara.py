"""Măsoară cât acoperă panoul de prezență (#lhp, assets/js/prezenta.js) din lecțiile-motor (27.09.2026).

  python masoara.py <eticheta>      # ex. INAINTE / DUPA -> masurat_<eticheta>.json + capturi <eticheta>_*.png

Pentru fiecare ecran (telefon 390x844 cu atingere, calculator 1280x800), pagină (lecțiile VI/4, VIII/4, jocul excel-viii)
și stare a elevului (necunoscut = prima vizită, vizitator = „Sunt elev — mă înscriu”, activ = înscris):
  1. la încărcare: înălțimea panoului;
  2. elevul intră în lecție (partea 1, pasul 2: simulatorul + „Verifică”) și face primul gest ca un om (derulează cu rotița);
  3. S1 „derulează până vede Verifică”: Verifică adus la marginea de jos a ecranului; ce nimerește un clic în mijlocul lui;
  4. S2 derulare pas cu pas (40 px) prin toată pagina: la câte poziții Verifică e în ecran, dar clicul pe el nimerește panoul;
     câte puncte din exercițiu (grilă 24 px, simulatorul + butoanele) nimeresc panoul, însumat pe toate pozițiile.
Trimiterile spre server (POST) sunt oprite și răspunse local cu {} — nimic nu ajunge pe serverul viu; se numără.
Ultima linie = numărul de combinații (ecran x pagină x stare) în care, DUPĂ primul gest al elevului, un clic pe „Verifică”
sau pe ceva de apăsat din exercițiu (buton, legătură, câmp, celulă) nimerește panoul.
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(r"C:\00\Projects\LearningHub")
AICI = Path(__file__).resolve().parent
ET = sys.argv[1] if len(sys.argv) > 1 else "X"
# INAINTE = versiunea veche, servită din copia prezenta.js.inainte (fișierul din site nu se atinge)
VECHI = (AICI / "prezenta.js.inainte").read_text(encoding="utf-8") if ET.startswith("INAINTE") else None
PORT = 8783
PAGINI = ["/lectii/vi/m1-l04/index.html", "/lectii/viii/m1-l04/index.html", "/jocuri/excel-viii/index.html"]
ECRANE = [("tel", 390, 844, True), ("pc", 1280, 800, False)]
NOW = int(time.time() * 1000)
STARI = {
    "necunoscut": {},
    "vizitator": {"lh_prezenta": {"refuz": NOW}},
    "activ": {"lh_prezenta": {"id": "proba00000000000000000000000000ab", "scoala": "brauner", "scoalaNume": "Școala de probă",
                              "clasa": "VI A", "nume": "Popescu Ana-Maria", "numeEnc": "xx", "ultima": NOW}},
}

JS_RECT = """() => { const b = document.getElementById('lhp'); if (!b || !b.firstElementChild) return null;
  const r = b.firstElementChild.getBoundingClientRect(); const s = getComputedStyle(b);
  if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return null;
  return {x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
          txt: b.innerText.replace(/\\s+/g, ' ').slice(0, 70)}; }"""

JS_S1 = """async () => { const c = document.getElementById('chk'); if (!c) return null;
  c.scrollIntoView({block: 'end'});
  // clicul vine după ce ecranul s-a desenat (un om apasă la zeci de ms după derulare): două cadre
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const r = c.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const e = document.elementFromPoint(x, y), b = document.getElementById('lhp');
  return {chk: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
          nimereste: !e ? 'nimic' : (b && b.contains(e)) ? 'PANOUL' : (e === c || c.contains(e)) ? 'Verifica' : e.tagName + '.' + e.className}; }"""

JS_S2 = """async () => {
  const c = document.getElementById('chk'), ex = c && c.closest('.incearca, section, .foaie'), b = document.getElementById('lhp');
  if (!c || !ex) return null;
  const H = innerHeight, W = innerWidth, max = document.documentElement.scrollHeight - H;
  let pozChk = 0, chkAcoperit = 0, puncte = 0, puncteLovite = 0, maxPx = 0, clicabile = 0;
  const pe = (el) => b && b.contains(el);
  // oracol simplu, pe etichete HTML (nu pe euristica din prezenta.js): sub panou e ceva de apăsat?
  const deApasat = (x, y) => { const l = document.elementsFromPoint(x, y).filter(e => !pe(e));
    return !!(l[0] && l[0].closest('button,a[href],input,select,textarea,[contenteditable=""],[contenteditable=true],[role=button],[role=gridcell],td')); };
  for (let y = 0; y <= max + 39; y += 40) {
    scrollTo(0, Math.min(y, max)); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const r = c.getBoundingClientRect();
    if (r.top >= 0 && r.bottom <= H) { pozChk++; const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (pe(e)) chkAcoperit++; }
    const q = ex.getBoundingClientRect(), y0 = Math.max(0, q.top), y1 = Math.min(H, q.bottom);
    let aici = 0;
    for (let yy = y0 + 6; yy < y1; yy += 24) for (let xx = Math.max(0, q.left) + 6; xx < Math.min(W, q.right); xx += 24) {
      puncte++; const e = document.elementFromPoint(xx, yy); if (pe(e)) { puncteLovite++; aici++; if (deApasat(xx, yy)) clicabile++; } }
    maxPx = Math.max(maxPx, aici);
  }
  scrollTo(0, 0);
  return {pozitii_verifica_in_ecran: pozChk, pozitii_verifica_acoperit: chkAcoperit,
          puncte_exercitiu: puncte, puncte_exercitiu_pe_panou: puncteLovite, din_care_peste_ceva_de_apasat: clicabile,
          max_puncte_acoperite_intr_o_pozitie: maxPx}; }"""

# S0: primul clic al elevului pe exercițiu, chiar în locul acoperit de panou (înainte de orice alt gest)
JS_S0 = """() => { const b = document.getElementById('lhp'), c = document.getElementById('chk'), ex = c && c.closest('.incearca, section, .foaie');
  if (!b || !ex) return null; ex.scrollIntoView({block: 'start'});
  const q = b.getBoundingClientRect(), r = ex.getBoundingClientRect();
  for (let y = q.top + 8; y < Math.min(q.bottom, r.bottom); y += 12) for (let x = Math.max(q.left, r.left) + 8; x < Math.min(q.right, r.right); x += 12) {
    const e = document.elementFromPoint(x, y); if (e && b.contains(e) && !e.closest('button,a,input,select,label')) return [Math.round(x), Math.round(y)]; }
  return null; }"""


def main():
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(LH)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    rez, rele = [], 0
    try:
        with sync_playwright() as p:
            br = p.chromium.launch()
            for ecr, w, h, tel in ECRANE:
                for pag in PAGINI:
                    for st, ls in STARI.items():
                        ctx = br.new_context(viewport={"width": w, "height": h}, is_mobile=tel, has_touch=tel,
                                             device_scale_factor=1)
                        pg = ctx.new_page()
                        erori, posturi = [], []
                        pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)))
                        pg.on("console", lambda m: erori.append(m.text) if m.type == "error" else None)

                        def ruta(r):
                            if r.request.method == "POST":
                                posturi.append(r.request.url.split("/api/")[-1])
                                return r.fulfill(status=200, content_type="application/json", body="{}")
                            if VECHI and r.request.url.split("?")[0].endswith("/assets/js/prezenta.js"):
                                return r.fulfill(status=200, content_type="application/javascript", body=VECHI)
                            return r.continue_()
                        pg.route("**/*", ruta)
                        url = f"http://127.0.0.1:{PORT}{pag}"
                        pg.goto(url, wait_until="networkidle")
                        pg.evaluate("ls => { localStorage.clear(); for (const k in ls) localStorage.setItem(k, JSON.stringify(ls[k])); }", ls)
                        pg.reload(wait_until="networkidle")
                        pg.wait_for_timeout(700)
                        if st == "activ":   # prezenta.js poate reîncărca o dată pagina (sertarul elevului)
                            pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(700)
                        la_incarcare = pg.evaluate(JS_RECT)
                        nume = f"{ET}_{ecr}_{pag.split('/')[2]}_{st}"
                        if pag.startswith("/lectii/vi/") or pag.startswith("/jocuri"):
                            pg.screenshot(path=str(AICI / f"{nume}_1incarcare.png"))
                        # elevul intră în lecție: partea 1, pasul 2 (simulatorul + Verifică)
                        pg.evaluate("document.querySelector('.lvl[data-l=\"0\"]').click()")
                        pg.wait_for_timeout(400)
                        pg.evaluate("document.getElementById('pas-next') && document.getElementById('pas-next').click()")
                        pg.wait_for_timeout(500)
                        s0 = None
                        pct = pg.evaluate(JS_S0) if st == "necunoscut" else None
                        if pct:   # clicul lui nimerește panoul (nu un buton din el): ce se întâmplă cu panoul?
                            pg.wait_for_timeout(200)
                            (pg.touchscreen.tap if tel else pg.mouse.click)(pct[0], pct[1])
                            pg.wait_for_timeout(400)
                            s0 = {"punct": pct, "panou_dupa_clic": pg.evaluate(JS_RECT)}
                        # primul gest ca un om: derulează puțin cu rotița, apoi înapoi
                        pg.mouse.move(w / 2, 150)
                        pg.mouse.wheel(0, 120); pg.wait_for_timeout(300)
                        pg.mouse.wheel(0, -120); pg.wait_for_timeout(500)
                        dupa_gest = pg.evaluate(JS_RECT)
                        s1 = pg.evaluate(JS_S1)
                        pg.wait_for_timeout(300)
                        if pag.startswith("/lectii/vi/") or pag.startswith("/jocuri"):
                            pg.screenshot(path=str(AICI / f"{nume}_2verifica.png"))
                        s2 = pg.evaluate(JS_S2)
                        # TOȚI pașii părții 1 + atelierul: fiecare ecran cu „Verifică” (acolo stau simulatoarele PowerPoint/Excel)
                        toti = {"ecrane_cu_verifica": [], "S1_pe_panou": 0, "verifica_acoperit": 0, "puncte": 0, "puncte_pe_panou": 0, "de_apasat_pe_panou": 0}
                        n_pasi = pg.evaluate("(() => { const l = JocMotor.test.config().nivele[0]; return (l.pasi || []).length; })()")
                        for k in list(range(n_pasi)) + ["atelier"]:
                            pg.evaluate("k => k === 'atelier' ? JocMotor.test.atelier() : JocMotor.test.pas(k)", k)
                            pg.wait_for_timeout(450)
                            a = pg.evaluate(JS_S1)
                            if not a:
                                continue
                            if k == "atelier" and (pag.startswith("/lectii/vi/") or pag.startswith("/jocuri")):
                                pg.wait_for_timeout(300); pg.screenshot(path=str(AICI / f"{nume}_3atelier.png"))
                            b2 = pg.evaluate(JS_S2) or {}
                            toti["ecrane_cu_verifica"].append(k)
                            toti["S1_pe_panou"] += a["nimereste"] == "PANOUL"
                            toti["verifica_acoperit"] += b2.get("pozitii_verifica_acoperit", 0)
                            toti["puncte"] += b2.get("puncte_exercitiu", 0)
                            toti["puncte_pe_panou"] += b2.get("puncte_exercitiu_pe_panou", 0)
                            toti["de_apasat_pe_panou"] += b2.get("din_care_peste_ceva_de_apasat", 0)
                        r = {"ecran": ecr, "pagina": pag, "stare": st, "panou_la_incarcare": la_incarcare,
                             "S0_clic_pe_panou": s0, "panou_dupa_primul_gest": dupa_gest, "S1_verifica_jos": s1, "S2_derulare": s2,
                             "S3_toti_pasii": toti, "posturi": posturi, "erori_consola": erori}
                        rez.append(r)
                        rau = (s1 and s1["nimereste"] == "PANOUL") or (s2 and (s2["pozitii_verifica_acoperit"] or s2["din_care_peste_ceva_de_apasat"])) \
                            or toti["S1_pe_panou"] or toti["verifica_acoperit"] or toti["de_apasat_pe_panou"]
                        rele += 1 if rau else 0
                        print(f"{ecr:3} {pag:32} {st:10} incarcare h={la_incarcare and la_incarcare['h']} "
                              f"dupa_gest h={dupa_gest and dupa_gest['h']} [{dupa_gest and dupa_gest['txt'][:28]}] "
                              f"S1={s1 and s1['nimereste']} S2 chk {s2 and s2['pozitii_verifica_acoperit']}/{s2 and s2['pozitii_verifica_in_ecran']} "
                              f"sim {s2 and s2['puncte_exercitiu_pe_panou']}/{s2 and s2['puncte_exercitiu']} "
                              f"(de apasat {s2 and s2['din_care_peste_ceva_de_apasat']}) "
                              f"S0={s0 and (s0['panou_dupa_clic'] or {}).get('h')} erori={len(erori)}\n"
                              f"      S3 toti pasii {toti['ecrane_cu_verifica']}: S1 pe panou {toti['S1_pe_panou']}, Verifica acoperit {toti['verifica_acoperit']}, "
                              f"exercitiu pe panou {toti['puncte_pe_panou']}/{toti['puncte']} (de apasat {toti['de_apasat_pe_panou']})")
                        ctx.close()
            br.close()
    finally:
        srv.terminate()
    (AICI / f"masurat_{ET}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print("erori consola total:", sum(len(r["erori_consola"]) for r in rez))
    print(rele)


if __name__ == "__main__":
    main()
