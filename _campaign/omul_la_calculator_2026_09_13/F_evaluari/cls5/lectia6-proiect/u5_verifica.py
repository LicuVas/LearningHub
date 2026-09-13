"""Reproduceri pentru lectia6-proiect (cls5). Adaptat din lectia5-reguli/u5_verifica.py (13.09.2026).
A. Static: suma fazelor; „criteriilor de mai sus” vs barem cu puncte; clasele poster-* fara CSS in assets/css;
   PDF vs formatele Paint (Microsoft, text brut); Canva „gratuit” vs cont + acord parental (text brut);
   Start → Power → Shut Down vs Windows ro-ro; cheile chestionarelor; unde se salveaza raspunsurile (JS); cuvinte stricate.
B. Playwright (http://127.0.0.1): stilul real al exemplului de poster; elevul GRESESTE la pasul 1 -> ce mesaj vede?
Scrie u5_iesire.json; tipareste <= 20 de randuri."""
import asyncio
import functools
import http.server
import json
import re
import socket
import threading
from pathlib import Path

from playwright.async_api import async_playwright

L = Path(__file__).resolve().parent
S = L / "surse"
SITE = Path(r"C:/00/Projects/LearningHub")
REL = "content/tic/cls5/m1-sisteme/lectia6-proiect.html"
T = (L / "innerText.txt").read_text(encoding="utf-8")
SRC = (SITE / REL).read_text(encoding="utf-8", errors="replace")
out = {"lectia": REL}

# A1: fazele exercitiului 1
faze = [int(x) for x in re.findall(r"FAZA \d - [A-Za-z]+ \((\d+) min\)", T)]
out["A1_faze_min"] = {"faze": faze, "total": sum(faze), "ora": 50}

# A2: barem
out["A2_barem"] = {
    "fraza": re.search(r"[^\n]*criteriilor de mai sus[^\n]*", T).group(0).strip(),
    "aparitii_barem_punct_nota_in_html": {w: len(re.findall(w, SRC, re.I)) for w in ["barem", r"\bpuncte?\b", r"\bnota\b", "criterii", "grila"]},
    "bife_checklist_final": len(re.findall(r'<input type="checkbox"/>', SRC)),
}

# A3: clasele poster-* au CSS?
clase = sorted(set(re.findall(r'class="(poster[^"]*)"', SRC)))
css = {p.name: p.read_text(encoding="utf-8", errors="replace") for p in (SITE / "assets" / "css").glob("*.css")}
out["A3_css_poster"] = {c: [n for n, t in css.items() if "." + c in t] for c in clase}
out["A3_style_inline_in_lectie"] = len(re.findall(r"<style", SRC))

# A4: PDF vs Paint; Canva
cit = json.loads((S / "citate.json").read_text(encoding="utf-8"))
out["A4_pdf_cerut"] = re.findall(r"[^\n]*PDF[^\n]*", T)
out["A4_paint_formate_ro"] = cit["paint_ro"]["gasit"]
out["A4_canva_lectie"] = re.search(r"[^\n]*Canva\.com \(gratuit\)[^\n]*", T).group(0).strip()
out["A4_canva_sursa"] = cit["canva_about_edu"]["gasit"]

# A5: oprirea
ro = (S / "shutdown_ro.txt").read_text(encoding="utf-8")
out["A5_oprire_lectie"] = sorted(set(re.findall(r"Start → (?:Power → )?Shut Down", T)))
out["A5_oprire_ro"] = re.search(r"selectați Start și apoi selectați [^.]*\.", ro).group(0)

# A6: cheile chestionarelor
chei = []
for m in re.finditer(r"data-quiz='([^']*)'", SRC):
    for q in json.loads(m.group(1)):
        k = "abcd".index(q["correct"])
        chei.append({"q": q["question"][:60], "cheie": q["options"][k][:70], "indiciu": q["hint"][:90]})
out["A6_chei"] = chei

# A7: unde se salveaza raspunsurile scrise
js = (SITE / "assets/js/practice-simple.js").read_text(encoding="utf-8", errors="replace")
out["A7_salvare_js"] = {"localStorage": len(re.findall(r"localStorage\.(?:set|get)Item", js)),
                        "fetch_sau_server": len(re.findall(r"fetch\(|XMLHttpRequest", js))}
out["A7_lectia_spune_unde_salvezi_fisierul"] = re.findall(r"[^\n]*(?:Documente|Desktop|stick|folder|retea|e-mail|email|Classroom)[^\n]*", T)

# A8: cuvinte stricate si tip gresit
out["A8_stricate"] = [w for w in ["executar ", "Stocarepe", "informatiile invatat", "daunaza", "Apeasa"] if w in T]
out["A8_procesor_tip"] = re.search(r"Procesor \(CPU\)[^\n]*\n\nProcesor", T) is not None


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def serve():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Q, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return port


JS_STIL = r"""() => {
 const g = document.querySelector('.poster-grid'), t = document.querySelector('.poster-title-example');
 if (!g) return null;
 const cg = getComputedStyle(g), ct = getComputedStyle(t);
 return {grid_display: cg.display, titlu_font_size: ct.fontSize, titlu_font_weight: ct.fontWeight,
         inaltime_exemplu_px: Math.round(document.querySelector('.poster-example').getBoundingClientRect().height)};
}"""
JS_GRESIT = r"""() => {
 const a = [...document.querySelectorAll('.atom')].find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
 const r = [];
 if (!a) return r;
 a.querySelectorAll('.atom-question').forEach(q => {
   const g = [...q.querySelectorAll('.atom-option')].find(o => o.dataset.answer !== q.dataset.correct);
   if (g) { r.push(g.innerText.trim()); g.click(); }
 });
 return r;
}"""
JS_MESAJE = r"""() => {
 const a = [...document.querySelectorAll('.atom')].find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
 return a ? a.innerText.split('\n').map(s => s.trim()).filter(s => /Corect|Incorect|Gresit|Greșit|Perfect|Excelent|Exact/i.test(s)) : [];
}"""


async def main():
    port = serve()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await (await b.new_context(viewport={"width": 1366, "height": 768})).new_page()
        await pg.goto(f"http://127.0.0.1:{port}/{REL}")
        await pg.wait_for_timeout(1200)
        await pg.evaluate("() => { const b=[...document.querySelectorAll('button,a')].find(x=>/Am incercat/.test(x.innerText)); if(b) b.click(); }")
        await pg.wait_for_timeout(600)
        out["B_stil_exemplu_poster"] = await pg.evaluate(JS_STIL)
        out["B_variante_gresite_alese"] = await pg.evaluate(JS_GRESIT)
        await pg.wait_for_timeout(700)
        out["B_mesaje_dupa_gresit"] = await pg.evaluate(JS_MESAJE)
        await pg.screenshot(path=str(L / "u5_dupa_raspuns_gresit.png"))
        await b.close()


asyncio.run(main())
(L / "u5_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, "::", json.dumps(v, ensure_ascii=False)[:230])
