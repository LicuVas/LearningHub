"""Reproduceri pentru lectia2-hardware (cls5). Scrie u5_iesire.json; tipareste un rezumat scurt.
A. Static (HTML): imagini reale vs „imaginile de mai jos”; PSU explicat in pasul 1?; cheile chestionarelor vs indiciu;
   lungimea variantei corecte (R1.1); suprapunerea cu lectia1 (dispozitive de intrare/iesire).
B. Playwright (http://127.0.0.1, ca H_vede): elevul GRESESTE la pasul 1 -> poate continua / reincerca?
C. Playwright: raspuns scris la Exercitiul 1 + Salveaza -> reincarcare; alt profil de browser.
"""
import asyncio
import functools
import html
import http.server
import json
import re
import socket
import threading
from pathlib import Path

from playwright.async_api import async_playwright

L = Path(__file__).resolve().parent
SITE = Path(r"C:/00/Projects/LearningHub")
REL = "content/tic/cls5/m1-sisteme/lectia2-hardware.html"
SRC = (SITE / REL).read_text(encoding="utf-8")
L1TXT = (L.parent / "lectia1-calculator" / "innerText.txt").read_text(encoding="utf-8")
L2TXT = (L / "innerText.txt").read_text(encoding="utf-8")
TEXT = "tastatura, mouse, microfon; monitor, boxe; ecran tactil; stick-ul pastreaza, RAM-ul se sterge"

out = {"lectia": REL}

# ---------- A. static ----------
out["A_img_in_html"] = len(re.findall(r"<img\b", SRC))
out["A_svg_in_html"] = len(re.findall(r"<svg\b", SRC))
out["A_fraza_imaginile_de_mai_jos"] = "imaginile de mai jos" in SRC
atomi = re.split(r'<div class="atom" id="atom-', SRC)[1:]
atom_txt = {}
for a in atomi:
    k = a.split('"', 1)[0]
    body = a.split("'>", 1)[1] if "'>" in a[:4000] else a
    t = re.sub(r"<[^>]+>", " ", body)
    atom_txt[k] = re.sub(r"\s+", " ", html.unescape(t))
out["A_psu_mentiuni_per_atom_in_continut_fara_quiz"] = {
    k: len(re.findall(r"PSU|sursa de alimentare|Sursa de Alimentare", v)) for k, v in atom_txt.items()}
out["A_titlu_atom1"] = re.search(r'id="atom-1".*?<h3 class="atom-title">(.*?)</h3>', SRC, re.S).group(1)

quiz = []
for m in re.finditer(r"data-quiz='(.*?)'>", SRC, re.S):
    for q in json.loads(m.group(1)):
        idx = "abcd".index(q["correct"])
        cor = q["options"][idx]
        lens = [len(o) for o in q["options"]]
        quiz.append({"intrebare": q["question"], "corect": cor,
                     "corect_apare_in_indiciu": cor.split(" (")[0].lower() in q["hint"].lower(),
                     "corect_e_cea_mai_lunga": len(cor) == max(lens) and lens.count(max(lens)) == 1})
out["A_chestionare"] = quiz


def dispozitive(t):
    names = ["Tastatura", "Mouse", "Microfon", "Camera Web", "Scanner", "Monitor", "Boxe", "Imprimanta",
             "Proiector", "Ecran tactil", "Casti cu microfon", "Imprimanta multifunctionala", "Joystick", "Webcam"]
    return sorted({n for n in names if re.search(r"\b" + re.escape(n), t, re.I)})


i1 = L1TXT.find("4. Dispozitive de Intrare si Iesire")
seg1 = L1TXT[i1:i1 + 6000]
i2 = L2TXT.find("4. Tipuri de Dispozitive")
seg2 = L2TXT[i2:L2TXT.find("5. Placa Video (GPU)", i2)]
d1, d2 = dispozitive(seg1), dispozitive(seg2)
out["A_suprapunere"] = {"lectia1_pas4": d1, "lectia2_pas4": d2, "comune": sorted(set(d1) & set(d2)),
                        "doar_in_lectia2": sorted(set(d2) - set(d1))}


# ---------- B + C. playwright ----------
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


JS_STARE = r"""() => {
 const a = [...document.querySelectorAll('.atom')].find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
 const nxt = document.querySelector('.ux-step-next');
 return {atom: a ? a.id : null,
  optiuni_blocate: a ? a.querySelectorAll('.atom-option.locked').length : 0,
  optiuni_total: a ? a.querySelectorAll('.atom-option').length : 0,
  buton_urmator_vizibil: !!(nxt && nxt.offsetParent), buton_urmator_activ: !!(nxt && !nxt.disabled),
  buton_urmator_text: nxt ? nxt.innerText.trim() : null,
  butoane_reincearca: a ? [...a.querySelectorAll('button')].map(b => b.innerText.trim()).filter(Boolean) : [],
  mesaje: a ? [...a.querySelectorAll('.atom-hint, .atom-feedback, .quiz-feedback')].filter(e=>e.offsetParent).map(e => e.innerText.trim().slice(0,160)) : []};
}"""

JS_GRESIT = r"""() => {
 const a = [...document.querySelectorAll('.atom')].find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
 const r = [];
 a.querySelectorAll('.atom-question').forEach(q => {
   const gresit = [...q.querySelectorAll('.atom-option')].find(o => o.dataset.answer !== q.dataset.correct);
   if (gresit) { r.push(gresit.innerText.trim()); gresit.click(); }
 });
 return r;
}"""


async def main():
    port = serve()
    url = f"http://127.0.0.1:{port}/{REL}"
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1366, "height": 768})
        pg = await ctx.new_page()
        await pg.goto(url)
        await pg.wait_for_timeout(1200)
        out["B_inainte"] = await pg.evaluate(JS_STARE)
        out["B_variante_gresite_alese"] = await pg.evaluate(JS_GRESIT)
        await pg.wait_for_timeout(700)
        out["B_dupa_gresit"] = await pg.evaluate(JS_STARE)
        await pg.screenshot(path=str(L / "u5_dupa_raspuns_gresit.png"))
        await pg.reload()
        await pg.wait_for_timeout(1200)
        out["B_dupa_reincarcare"] = await pg.evaluate(JS_STARE)

        await pg.evaluate("""(t) => { const ex = document.querySelector('.practice-exercise');
            const ta = ex.querySelector('textarea'); ta.value = t; ta.dispatchEvent(new Event('input'));
            ex.querySelector('.ps-save-btn').click(); }""", TEXT)
        await pg.wait_for_timeout(500)
        out["C_chei_localStorage"] = await pg.evaluate("Object.keys(localStorage)")
        await pg.reload()
        await pg.wait_for_timeout(1200)
        out["C_dupa_reincarcare"] = await pg.evaluate("document.querySelector('.practice-exercise textarea').value")
        out["C_exercitii_vizibile_la_deschidere"] = await pg.locator("#practice").is_visible()
        ctx2 = await b.new_context(viewport={"width": 1366, "height": 768})
        pg2 = await ctx2.new_page()
        await pg2.goto(url)
        await pg2.wait_for_timeout(1200)
        out["C_alt_profil"] = await pg2.evaluate("document.querySelector('.practice-exercise textarea').value")
        await b.close()


asyncio.run(main())
(L / "u5_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("img:", out["A_img_in_html"], "| psu:", out["A_psu_mentiuni_per_atom_in_continut_fara_quiz"])
print("quiz cea mai lunga:", [q["corect"] for q in quiz if q["corect_e_cea_mai_lunga"]],
      "| indiciu nu contine cheia:", [q["corect"] for q in quiz if not q["corect_apare_in_indiciu"]])
print("suprapunere:", out["A_suprapunere"])
print("B dupa gresit:", out["B_dupa_gresit"])
print("B dupa reincarcare:", out["B_dupa_reincarcare"])
print("C:", out["C_dupa_reincarcare"] == TEXT, repr(out["C_alt_profil"]))
