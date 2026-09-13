"""Reproduceri pentru lectia3-software (cls5). Adaptat din lectia2-hardware/u5_verifica.py (13.09.2026).
A. Static (innerText.txt, text randat): antivirusul in pasul 3 vs rezolvarea Exercitiului 2; cate categorii
   cere Exercitiul 2 vs cate preda pasul 3; calea C:\\Documente; „Ctrl+Z anuleaza orice greseala” vs Shift+Delete;
   versiunile de sisteme de operare scrise in tabel.
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
REL = "content/tic/cls5/m1-sisteme/lectia3-software.html"
T = (L / "innerText.txt").read_text(encoding="utf-8")
out = {"lectia": REL}


def felie(start, stop):
    i = T.find(start)
    j = T.find(stop, i + 1)
    return T[i:j] if i >= 0 and j > i else ""


pas3 = felie("Tipuri de Software\n\n📦", "Verifica daca ai inteles")
sistem = felie("1️⃣ Software de Sistem", "2️⃣ Software Aplicativ")
utilitar = felie("3️⃣ Software Utilitar", "💭 Analogie")
rez2 = felie("1. Clasificare:", "2. Pastrare + backup")
ex2 = felie("Exercitiul 2 (Nivel standard)", "[ASCUNS")
out["A_antivirus"] = {
    "pas3_categorii_numite": re.findall(r"trei categorii mari", pas3),
    "antivirus_in_lista_Software_de_Sistem_pas3": "Antivirus" in sistem or "antivirus" in sistem,
    "antivirus_in_lista_Software_Utilitar_pas3": "Antivirus" in utilitar,
    "Exercitiul2_categorii_cerute": re.findall(r'"software de [a-z]+"', ex2),
    "rezolvarea_Ex2_pune_antivirus_la": "sistem" if re.search(r"Software de sistem:[^\n]*antivirus", rez2) else "altceva",
}
out["A_cale"] = {"cale_in_lectie": re.findall(r"C:\\Documente\\[^\s]+", T),
                 "Users_sau_Documents_in_cale": bool(re.search(r"C:\\Users", T))}
out["A_ctrl_z"] = {"afirmatie": re.findall(r"Ctrl\+Z anuleaza orice greseala!?", T),
                   "shift_delete_fara_recuperare": re.findall(r"Shift \+ Delete[^\n]{0,90}", T)[:2]}
tabel = felie("💻 Sistem de Operare", "💡 Sfat")
out["A_versiuni_in_tabel"] = re.findall(r"(Windows 1[01]|macOS [A-Z][a-z]+|Android \d+|iOS \d+|iPadOS \d+)", tabel)


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
 a.querySelectorAll('.atom-question').forEach(q => {
   const g = [...q.querySelectorAll('.atom-option')].find(o => o.dataset.answer !== q.dataset.correct);
   if (g) { r.push(g.innerText.trim()); g.click(); }
 });
 return r;
}"""
JS_MESAJE = r"""() => {
 const a = [...document.querySelectorAll('.atom')].find(x => x.offsetParent && !x.classList.contains('ux-step-hidden'));
 return a ? a.innerText.split('\n').map(s => s.trim()).filter(s => /Corect|Incorect|Gresit|Greșit/i.test(s)) : [];
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
    print(k, "::", json.dumps(v, ensure_ascii=False)[:300])
