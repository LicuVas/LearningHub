"""Reproduceri pentru lectia5-reguli (cls5). Adaptat din lectia4-ergonomie/u5_verifica.py (13.09.2026).
A. Static (innerText.txt = textul randat; HTML doar pentru data-quiz): cheia fiecarei intrebari vs varianta;
   scenariul Word „pierzi tot” vs „In lumea reala” vs Microsoft (text brut); apa varsata: ordinea pasilor;
   parola „minim 8” vs NIST SP 800-63B-4 (text brut); cuvinte stricate; „20 de elevi” la un calculator;
   ce norme de securitate apar/lipsesc; Start → Power → Shut down vs Windows ro-ro; cifre de pret fara sursa.
B. Playwright (http://127.0.0.1, ca H_vede): elevul GRESESTE la pasul 1 -> ce mesaj vede?
Scrie u5_iesire.json; tipareste <= 20 de randuri."""
import asyncio
import functools
import html as H
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
REL = "content/tic/cls5/m1-sisteme/lectia5-reguli.html"
T = (L / "innerText.txt").read_text(encoding="utf-8")
SRC = (SITE / REL).read_text(encoding="utf-8", errors="replace")
out = {"lectia": REL}


def rd(n):
    return (S / f"{n}.txt").read_text(encoding="utf-8")


def gaseste(t, pat, n=1):
    return [m.group(0) for m in re.finditer(pat, t)][:n]


# A1: cheile chestionarelor (data-quiz) - varianta cheii si inceputul indiciului
chei = []
for m in re.finditer(r"data-quiz='([^']*)'", SRC):
    for q in json.loads(H.unescape(m.group(1))):
        i = "abcd".index(q["correct"])
        chei.append({"q": q["question"][:70], "cheie": q["correct"], "varianta_cheii": q["options"][i],
                     "indiciu_incepe": q["hint"][:60],
                     "cea_mai_lunga": max(q["options"], key=len) == q["options"][i]})
out["A1_chei"] = chei

# A2: Word dupa pana de curent
CR = rd("crash_ro")
WR = rd("word_recover_ro")
out["A2_word_pana_curent"] = {
    "cheia_lectiei": gaseste(T, r"Voi pierde toata compunerea - nu am salvat"),
    "indiciul_lectiei": gaseste(T, r"Toata munca de 40 de minute dispare!"),
    "aceeasi_lectie_mai_jos": gaseste(T, r"Multe programe moderne \(Word, Google Docs\) au auto-salvare, dar aceasta functioneaza doar cat esti conectat la internet[^\n]*"),
    "microsoft_ro_recuperare": gaseste(WR, r"De obicei, aplicația va recupera automat lucrul următoarea dată când deschideți aplicația în urma unei pene de curent[^.]*\."),
    "microsoft_ro_minute": gaseste(CR, r"dacă fișierul de recuperare este salvat doar la fiecare 15 minute, fișierul recuperat nu va conține ultimele 14 minute de lucru dinainte să apară pana de curent"),
    "microsoft_ro_ctrl_s": gaseste(rd("crash_en"), r"select Save \(or press Ctrl\+S\) often"),
}

# A3: apa varsata - ordinea din rezolvarea Ex. 2
ex2 = T[T.find("Exercitiul 2 (Nivel standard)"):T.find("Exercitiul 3 (Nivel performanta)")]
pasi_apa = re.findall(r"(Opresti imediat calculatorul[^\n]*|Anunti profesorul pe loc[^\n]*|Nu atingi tastatura uda[^\n]*)", ex2)
out["A3_apa_varsata"] = {
    "ordinea_din_rezolvare": pasi_apa,
    "primul_pas_cere_atingerea_PC": bool(pasi_apa) and pasi_apa[0].startswith("Opresti"),
    "lectia_despre_butonul_Power": gaseste(T, r"Sa tii apasat butonul Power pana se stinge \(doar in caz de urgenta extrema!\)"),
    "lectia_mainile_ude": gaseste(T, r"Sa atingi calculatorul cu mainile ude"),
    "legea_319_art23_d": gaseste(rd("legea319"), r"sa comunice imediat angajatorului şi/sau lucrătorilor desemnaţi orice situaţie de muncă despre care au motive întemeiate sa o considere un pericol"),
}

# A4: parola
N = rd("nist_63b")
out["A4_parola"] = {
    "lectia": gaseste(T, r"Minim 8 caractere") + gaseste(T, r"Combina litere mari, litere mici, cifre si simboluri") + gaseste(T, r"Exemplu parola buna: [^\n]*"),
    "nist_lungime": gaseste(N, r"SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length"),
    "nist_compozitie": gaseste(N, r"SHALL NOT impose other composition rules \(e\.g\., requiring mixtures of different character types\) for passwords"),
    "lungimea_exemplului": len("M3uC@1ne!2025"),
}

# A5: cuvinte stricate / greseli
out["A5_cuvinte_stricate"] = {w: gaseste(T, r"[^\n]{0,40}" + re.escape(w) + r"[^\n]{0,30}") for w in
                              ["profesormeaintine", "dosap", "tranjand", "Instaleza", "nu vei stii", "ruinoase"]}

# A6: „20 de elevi” la un calculator
out["A6_20_elevi"] = gaseste(T, r"Daca strici un calculator, 20 de elevi nu vor putea lucra in ora urmatoare\.")

# A7: norme de securitate - ce cuvinte-cheie de instructaj apar in lectie
chei_norme = ["priza", "prelungitor", "cablu deteriorat", "cabluri rupte", "izolat", "scantei", "miros de ars", "fum",
              "incendiu", "evacuare", "iesire", "alergi", "ghiozdan", "curent electric", "electrocut", "carcasa",
              "tehnicianul", "instructaj", "semneaza"]
out["A7_norme_in_lectie"] = {k: len(re.findall(k, T, re.I)) for k in chei_norme}

# A8: oprire - numele din Windows ro-ro
out["A8_oprire_interfata"] = {
    "lectia": gaseste(T, r"Click pe Power → Shut down"),
    "microsoft_ro": gaseste(rd("shutdown_ro"), r"selectați Start și apoi selectați Alimentare > Închidere"),
    "microsoft_en": gaseste(rd("shutdown_en"), r"To shut down, select Start and then select Power > Shut down"),
}

# A9: cifre din lumea reala, fara sursa
out["A9_preturi"] = gaseste(T, r"[^\n]{0,30}\d[\d\-]* lei[^\n]{0,10}", 8)


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
        await pg.evaluate("() => { const b=[...document.querySelectorAll('button,a')].find(x=>/Am incercat/.test(x.innerText)); if(b) b.click(); }")
        await pg.wait_for_timeout(600)
        out["B_variante_gresite_alese"] = await pg.evaluate(JS_GRESIT)
        await pg.wait_for_timeout(700)
        out["B_mesaje_dupa_gresit"] = await pg.evaluate(JS_MESAJE)
        await pg.screenshot(path=str(L / "u5_dupa_raspuns_gresit.png"))
        await b.close()


asyncio.run(main())
(L / "u5_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, "::", json.dumps(v, ensure_ascii=False)[:300])
