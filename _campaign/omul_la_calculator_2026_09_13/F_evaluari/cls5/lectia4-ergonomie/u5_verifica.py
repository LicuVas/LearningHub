"""Reproduceri pentru lectia4-ergonomie (cls5). Adaptat din lectia3-software/u5_verifica.py (13.09.2026).
A. Static (innerText.txt = textul randat; HTML doar numarat): „20 de pasi” vs 6 m vs sursa (20 feet);
   ritmul regulii 20-20-20 vs reminder-ele cerute in Exercitiul 2; „salut militar” vs „intinde bratul”;
   „garantate”; cifre fara sursa; cate imagini are lectia de postura; cate sarcini cer telefonul.
B. Playwright (http://127.0.0.1, ca H_vede): elevul GRESESTE la pasul 1 -> ce mesaj vede?
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
SITE = Path(r"C:/00/Projects/LearningHub")
REL = "content/tic/cls5/m1-sisteme/lectia4-ergonomie.html"
T = (L / "innerText.txt").read_text(encoding="utf-8")
H = (SITE / REL).read_text(encoding="utf-8", errors="replace")
CC = (L / "surse" / "ccohs_eye_discomfort.txt").read_text(encoding="utf-8")
out = {"lectia": REL}

# A1: 20 de pasi = 6 m ?
m_cc = re.search(r"At least every 20 minutes, take a 20-second break and look at something 6 metres \(20 feet\) away", CC)
pasi = re.findall(r"20 (?:de )?pasi[^\n]{0,40}", T)
out["A1_20_pasi"] = {
    "in_lectie": pasi,
    "sursa_CCOHS": m_cc.group(0) if m_cc else None,
    "20_feet_in_metri": round(20 * 0.3048, 3),
    "pasul_implicit_din_lectie_m": round(6 / 20, 2),
    "nota": "foot (picior, unitate) = 0,3048 m exact; lectia a tradus feet ca pasi; 20 de pasi ai unui copil nu inseamna 6 m",
}

# A2: ritmul regulii vs reminder-ele din Exercitiul 2
regula = re.findall(r"La fiecare 20 de minute, priveste 20 de secunde", T)
ex2 = T[T.find("Exercitiul 2 (Nivel standard)"):T.find("Exercitiul 3 (Nivel performanta)")]
ore = re.findall(r"\b(\d{2}):00\b", ex2)
ore_unice = sorted(set(int(o) for o in ore))
out["A2_reminder_20_20_20"] = {
    "regula_predata": regula,
    "cerinta_ex2": re.findall(r"Seteaza 3 reminder-e[^\n]*\n?[^\n]*", ex2),
    "ore_din_cerinta_si_rezolvare": ore_unice,
    "interval_minute_intre_reminder": [(b - a) * 60 for a, b in zip(ore_unice, ore_unice[1:])],
    "reminder_necesare_15_19_la_20_min": (19 - 15) * 3 + 1,
}

# A3: cum masori distanta
out["A3_masurare_distanta"] = {
    "pas1": re.findall(r"Intinde bratul complet\. Degetele ar trebui sa atinga ecranul\.", T),
    "indiciu1": re.findall(r"ca si cum ai face salut militar", T),
}

# A4: afirmatii categorice / cifre fara sursa
out["A4_categoric_si_cifre"] = {
    "garantate": re.findall(r"[^\n]*garantate[^\n]*", T),
    "ore_pe_zi": re.findall(r"[^\n]*\d\+? ?(?:-\d )?ore pe zi[^\n]*", T),
    "surse_citate_in_lectie": re.findall(r"(OMS|WHO|OSHA|CCOHS|Academia|studiu|studii|HG 1028)", T),
}

# A5: imagini / telefon
out["A5_imagini_telefon"] = {
    "img_in_html": len(re.findall(r"<img\b", H)),
    "svg_in_html": len(re.findall(r"<svg\b", H)),
    "postura_desenata_cu_emoji": re.findall(r"🧑‍💺|🙇", T),
    "sarcini_cu_telefon": re.findall(r"[^\n]*(?:telefon|Descarca|poza)[^\n]*", T),
}

# A6: unghiuri lectie vs OSHA (arhiva 2026)
OS = (L / "surse" / "osha_positions_arh.txt").read_text(encoding="utf-8")
out["A6_unghiuri"] = {
    "lectie_coate": re.findall(r"Unghi de 90° \(cot\)|Coatele sunt la unghi de 90 de grade", T),
    "lectie_spate": re.findall(r"Unghi de 90-110°|spate drept, lipit de spatar", T),
    "OSHA_coate": re.findall(r"Elbows stay in close to the body and are bent between 90 and 120 degrees", OS),
    "OSHA_spate_inclinat": re.findall(r"recline between 105 and 120 degrees from the thighs", OS)[:1],
}


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
        out["B_variante_gresite_alese"] = await pg.evaluate(JS_GRESIT)
        await pg.wait_for_timeout(700)
        out["B_mesaje_dupa_gresit"] = await pg.evaluate(JS_MESAJE)
        await pg.screenshot(path=str(L / "u5_dupa_raspuns_gresit.png"))
        await b.close()


asyncio.run(main())
(L / "u5_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, "::", json.dumps(v, ensure_ascii=False)[:420])
