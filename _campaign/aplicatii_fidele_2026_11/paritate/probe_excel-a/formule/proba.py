"""Proba de paritate excel-a / formule+funcții (21.11.2026): același caz în codul vechi (excelx-formule.js +
excelx-functii.js peste tip-foaie.js, încărcate în vechi.html) și în bibliotecă (aplicatii/poligon.html).
Headless, server local pe 127.0.0.1:8763, orice cerere spre altă gazdă e abandonată. Ieșirea: rezultat.json alături."""
import json, subprocess, sys, time, pathlib
from playwright.sync_api import sync_playwright

ROOT = r"C:/00/Projects/LearningHub_fidel"
PORT = 8763
AICI = pathlib.Path(__file__).parent
BAZA = f"http://127.0.0.1:{PORT}"
VECHI = BAZA + "/_campaign/aplicatii_fidele_2026_11/paritate/probe_excel-a/formule/vechi.html"
NOU = BAZA + "/aplicatii/poligon.html"

# cazuri de evaluare: (nume, celule, formula tastată în celula t)
CAZURI = [
    ("x_intre_adrese", {"A2": 5, "B2": 120}, "C2", "=A2xB2"),
    ("x_cu_spatii", {"A2": 5, "B2": 120}, "C2", "=A2 x B2"),
    ("semn_uitat", {"A2": 5, "B2": 120}, "C2", "=A2 B2"),
    ("x_intre_numere", {}, "C2", "=5x3"),
    ("zecimala_punct", {"A2": 8}, "C2", "=A2*0.5"),
    ("doua_puncte_adrese", {"A2": 20, "B2": 4}, "C2", "=A2:B2"),
    ("doua_puncte_numere", {}, "C2", "=20:4"),
    ("semnul_inmultit", {"A2": 5, "B2": 120}, "C2", "=A2×B2"),
    ("semnul_impartit", {"A2": 60, "B2": 4}, "C2", "=A2÷B2"),
    ("plus_in_fata", {"A2": 5, "B2": 120}, "C2", "+A2*B2"),
    ("apostrof_007", {"A2": "'007"}, "C2", "=A2*2"),
    ("text_lei", {"A2": "150 lei"}, "C2", "=A2*2"),
    ("sum_fara_paranteza", {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B7", "=SUM B2:B6"),
    ("sum_spatiu_paranteza", {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B7", "=SUM (B2:B6)"),
    ("zona_inversa", {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B7", "=SUM(B6:B2)"),
    ("circulara", {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B7", "=SUM(B2:B7)"),
    ("match_doar_nume", {"B2": 9, "B3": 7}, "C2", "=MATCH(7;B2:B3;0)"),
    ("sumifs_doar_nume", {"B2": 9, "B3": 7}, "C2", "=SUMIFS(B2:B3;B2:B3;\">5\")"),
    ("impartire_zero", {"A2": 60}, "C2", "=A2/B2"),
]

# Σ: (nume, celule, selecția, funcția din listă sau None pentru Σ / Alt+=)
SIGMA = [
    ("sigma_sub_note", {"B1": "Nota", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B7", None),
    ("sigma_B4_goala", {"B1": "Nota", "B2": 9, "B3": 7, "B5": 10, "B6": 6}, "B7", None),
    ("sigma_B7_goala_B8", {"B1": "Nota", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B8", None),
    ("sigma_sub_total_SUM", {"B1": "Nota", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": "=SUM(B2:B6)"}, "B8", None),
    ("sigma_rand_stanga", {"A2": "Ana", "B2": 9, "C2": 7, "D2": 8}, "E2", None),
    ("sigma_nimic", {}, "C5", None),
    ("medie_sub_total", {"B1": "Nota", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": "=SUM(B2:B6)"}, "B8", "AVERAGE"),
]
# Σ pe zonă: (nume, celule, zona)
SIGMA_ZONA = [
    ("zona_doua_coloane", {"B2": 9, "B3": 7, "C2": 8, "C3": 10, "D2": 6, "D3": 5}, "B2:D3"),
    ("zona_cu_ultima_goala", {"B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6}, "B2:B7"),
    ("zona_un_rand", {"B2": 9, "C2": 7, "D2": 8}, "B2:D2"),
]

JS_VECHI_EVAL = r"""([cells, t, f]) => {
  const J = window.JocFoaie, T = window.ExcelTipuri;
  const src = Object.assign({}, cells); src[t] = f;
  let rez;
  // ce arată celula (excelx-formule: afisare = rezultatul sau codul de eroare; '⚠' = formula nu e primită)
  try {
    const get = a => { const r = src[a]; if (r == null || r === '') return ''; if (typeof r === 'number') return r;
      if (String(r)[0] === '=') return J.evaluate(String(r), get); return String(r); };
    const s = String(f);
    if (s[0] !== '=') {
      // +A2*B2: excelx-formule.dupaDesen o face formulă (=+A2*B2) dacă e o formulă bună
      let e = null; try { J.evaluate('=' + s, () => 0); } catch (x) { e = x; }
      if (e && e.show === '⚠') rez = {text: s, tip: 'text'};
      else rez = {devine: '=' + s, valoare: J.evaluate('=' + s, get)};
    } else rez = {valoare: J.evaluate(s, get)};
  } catch (e) { rez = {eroare: e.show || '?', mesaj: String(e.message).slice(0, 160)}; }
  return rez; }"""

JS_VECHI_SIGMA = r"""([cells, sel, fn]) => {
  const RAW = {}; Object.entries(cells).forEach(([k, v]) => RAW[k] = typeof v === 'number' ? String(v) : v);
  const m = sel.match(/^([A-Z])(\d+)$/); const c = m[1].charCodeAt(0) - 65, r = +m[2] - 1;
  const z = window.ExcelFunctii.zonaAuto(RAW, c, r, fn || 'SUM');
  return '=' + (fn || 'SUM') + '(' + z + ')'; }"""

JS_VECHI_LISTA = r"""() => { const F = window.JocExcel && window.JocExcel.FUNC; if (!F) return null; const k = Object.keys(F);
  const prima = p => k.find(x => x.startsWith(p)); return {SU: prima('SU'), MA: prima('MA'), MI: prima('MI'), AV: prima('AV'), AVER: prima('AVER')}; }"""

JS_NOU_DESCHIDE = r"""async ([celule, sel]) => {
  try { LH.aplicatii.inchide('excel'); } catch (e) {}
  const loc = document.querySelector('[data-lh-aplicatie-loc]'); loc.innerHTML = '';
  window.__I = await LH.aplicatii.deschide('excel', {loc: '[data-lh-aplicatie-loc]', continut: {celule, selectie: sel}, focus: true});
  window.__I.focus(); return true; }"""

JS_NOU_STARE = r"""(adrese) => { const I = window.__I, s = I.stare(), r = I.radacina; const o = {};
  adrese.forEach(a => { if (s.celule && s.celule[a]) o[a] = s.celule[a]; });
  const linii = (r.innerText || '').split('\n').map(x => x.trim()).filter(x => /formula|typo|circular|Excel nu primește|correct|problem|argument/i.test(x)).slice(0, 4);
  const msg = Array.from(r.querySelectorAll('.lh-ap-mesaj')).map(x => x.textContent.slice(0, 160));
  return {celule: o, selectie: s.selectie, linii, msg}; }"""

JS_NOU_CELULA_HTML = r"""(a) => { const r = window.__I.radacina; const x = r.querySelector('[data-lh-tinta="celula:' + a + '"]');
  return x ? x.outerHTML.slice(0, 400) : null; }"""


def tasteaza(page, text):
    for ch in text:
        if ch in '×÷':
            page.keyboard.insert_text(ch)
        else:
            page.keyboard.type(ch)


def main():
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", ROOT],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.2)
    out = {"vechi": {}, "nou": {}, "erori_consola": {"vechi": [], "nou": []}}
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(headless=True)
            ctx = b.new_context(viewport={"width": 1366, "height": 768})
            ctx.route("**/*", lambda route: route.continue_() if route.request.url.startswith(("http://127.0.0.1", "http://localhost")) else route.abort())
            # ---- vechiul
            pv = ctx.new_page()
            pv.on("pageerror", lambda e: out["erori_consola"]["vechi"].append(str(e)[:200]))
            pv.goto(VECHI); pv.wait_for_timeout(600)
            for nume, cells, t, f in CAZURI:
                out["vechi"][nume] = pv.evaluate(JS_VECHI_EVAL, [cells, t, f])
            for nume, cells, sel, fn in SIGMA:
                out["vechi"][nume] = pv.evaluate(JS_VECHI_SIGMA, [cells, sel, fn])
            out["vechi"]["lista_tab"] = pv.evaluate(JS_VECHI_LISTA)
            # ---- biblioteca
            pn = ctx.new_page()
            pn.on("pageerror", lambda e: out["erori_consola"]["nou"].append(str(e)[:200]))
            pn.goto(NOU); pn.wait_for_timeout(800)
            for nume, cells, t, f in CAZURI:
                pn.evaluate(JS_NOU_DESCHIDE, [cells, t]); pn.wait_for_timeout(150)
                tasteaza(pn, f); pn.keyboard.press("Enter"); pn.wait_for_timeout(200)
                st = pn.evaluate(JS_NOU_STARE, [t, "D2", "C2", "B7", "C3"])
                if nume in ("impartire_zero", "x_intre_adrese"):
                    st["html_" + t] = pn.evaluate(JS_NOU_CELULA_HTML, t)
                out["nou"][nume] = st
            for nume, cells, sel, fn in SIGMA:
                pn.evaluate(JS_NOU_DESCHIDE, [cells, sel]); pn.wait_for_timeout(150)
                if fn is None:
                    pn.keyboard.press("Alt+Equal")
                else:
                    pn.evaluate("""(fn) => { const r = window.__I.radacina; const b = r.querySelector('[data-lh-id-mso="AutoSumMenu_Dropdown"]') ||
                        Array.from(r.querySelectorAll('[data-lh-id-mso="AutoSum"] *')).find(x => /More Options/.test(x.getAttribute('data-lh-eticheta')||''));
                        if (b) b.dispatchEvent(new MouseEvent('click', {bubbles: true})); return !!b; }""", fn)
                    pn.wait_for_timeout(250)
                    ok = pn.evaluate("""() => { const r = window.__I.radacina; const x = Array.from(r.querySelectorAll('[data-lh-eticheta]')).find(e => /^Average$/.test(e.getAttribute('data-lh-eticheta')));
                        if (x) { x.click(); return true; } return false; }""")
                    out["nou"][nume + "_lista_gasita"] = ok
                pn.wait_for_timeout(200)
                st = pn.evaluate(JS_NOU_STARE, [sel])
                pn.keyboard.press("Enter"); pn.wait_for_timeout(150)
                st["dupa_enter"] = pn.evaluate(JS_NOU_STARE, [sel])["celule"]
                out["nou"][nume] = st
            for nume, cells, zona in SIGMA_ZONA:
                pn.evaluate(JS_NOU_DESCHIDE, [cells, zona]); pn.wait_for_timeout(150)
                pn.keyboard.press("Alt+Equal"); pn.wait_for_timeout(200)
                out["nou"][nume] = pn.evaluate(JS_NOU_STARE, ["B4", "C4", "D4", "B7", "B8", "E2", "B3", "C3", "D3"])
            # Tab după =MA / =SU / =MI în bibliotecă
            for pref in ("SU", "MA", "MI", "AV"):
                pn.evaluate(JS_NOU_DESCHIDE, [{}, "C2"]); pn.wait_for_timeout(120)
                tasteaza(pn, "=" + pref); pn.keyboard.press("Tab"); pn.wait_for_timeout(120)
                out["nou"]["tab_" + pref] = pn.evaluate(JS_NOU_STARE, ["C2"])["celule"]
            # Σ în timp ce scrii
            pn.evaluate(JS_NOU_DESCHIDE, [{"B2": 9, "B3": 7}, "B4"]); pn.wait_for_timeout(120)
            tasteaza(pn, "=B2"); pn.keyboard.press("Alt+Equal"); pn.wait_for_timeout(150)
            out["nou"]["sigma_in_scriere"] = pn.evaluate(JS_NOU_STARE, ["B4"])
            b.close()
    finally:
        srv.terminate()
        try: srv.wait(5)
        except Exception: srv.kill()
    (AICI / "rezultat.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print("scris", AICI / "rezultat.json")


if __name__ == "__main__":
    main()
