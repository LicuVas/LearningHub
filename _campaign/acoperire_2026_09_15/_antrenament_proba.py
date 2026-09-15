"""Proba motorului de antrenament: un joc temporar zz-antrenament (3 runde, bazin 6, cate 3).
Verifică: (1) două reluări ale aceleiași runde aduc întrebări DIFERITE; (2) a treia reluare reia ciclul; (3) poarta îl acceptă;
(4) un bazin prea mic (5 < 2×3) e respins de poartă. Folderul temporar se șterge la final."""
import json
import shutil
import subprocess
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

J = Path(r"C:\00\Projects\LearningHub\jocuri")
sys.path.insert(0, str(J / "_motor"))
from acoperire import load_sources  # noqa: E402

un, domains, mp, _ = load_sources()
cont = domains["VII"]["Editor de texte"]
D = J / "zz-antrenament"


def pagina(bazin_n):
    runde = []
    for r, (nume, fin) in enumerate([("De bază", False), ("Consolidat", False), ("Avansat", True)]):
        bazin = [{"t": "tf", "q": f"Runda {r + 1}, întrebarea {k + 1}: afirmația de probă e adevărată.", "ok": True,
                  "why": "Întrebare de probă pentru motor; răspunsul corect este „Adevărat”."} for k in range(bazin_n)]
        runde.append({"t": nume, "final": fin, "text": "", "cate": 3, "bazin": bazin, "lectii": [2], "continuturi": [cont[0]]})
    cfg = {"cheie": "zz_antrenament_proba", "mod": "antrenament", "titlu": "Proba de antrenament", "clasa": "a VII-a",
           "unitate": "VII-U1", "unitateTitlu": "Tehnoredactare: editorul de texte", "competente": ["CS.1.1"],
           "intro": "Joc temporar de probă pentru motor, cu întrebări trase la întâmplare și diacritice: ă î â ș ț.",
           "nivele": runde, "diploma": {"titlu": "Probă", "rezumat": "runde de probă", "aplicatie": "Word",
                                        "provocare": ["Nimic de făcut: e o probă pentru motor, ștearsă după verificare."]}}
    return ("<!doctype html>\n<html lang=\"ro\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
            "<title>Proba de antrenament</title>\n<link rel=\"stylesheet\" href=\"../_motor/motor.css\">\n</head>\n<body>\n"
            "<script src=\"../_motor/motor.js\"></script>\n<script>\nJocMotor.porneste(" + json.dumps(cfg, ensure_ascii=False) + ");\n</script>\n</body>\n</html>\n")


try:
    D.mkdir(exist_ok=True)
    (D / "index.html").write_text(pagina(6), encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_context(**p.devices["iPhone SE"]).new_page()
        pg.goto((D / "index.html").as_uri()); pg.wait_for_timeout(300)
        draws = []
        for _ in range(3):
            pg.evaluate("document.getElementById('go-home').click()")
            pg.click('.lvl[data-l="0"]')
            draws.append(pg.evaluate("JocMotor.test.config().nivele[0].qs.map(q=>q.q.split('întrebarea ')[1])"))
        print("tragerea 1:", draws[0], "| tragerea 2:", draws[1], "| tragerea 3:", draws[2])
        print("1 și 2 fără întrebări comune:", not set(draws[0]) & set(draws[1]))
        print("eticheta:", pg.evaluate("document.querySelector('.eyebrow').innerText"), "|", pg.evaluate("document.querySelector('.lede').innerText")[:80])
        b.close()
    ok = subprocess.run([sys.executable, str(J / "_motor" / "test_joc.py"), "zz-antrenament"], capture_output=True, text=True, encoding="utf-8")
    print("poarta, bazin 6:", ok.stdout.strip().splitlines()[:4])
    (D / "index.html").write_text(pagina(5), encoding="utf-8")
    bad = subprocess.run([sys.executable, str(J / "_motor" / "test_joc.py"), "zz-antrenament"], capture_output=True, text=True, encoding="utf-8")
    print("poarta, bazin 5:", [l for l in bad.stdout.splitlines() if "bazinul" in l or "PICAT" in l or "TRECUT" in l][:3])
finally:
    shutil.rmtree(D, ignore_errors=True)
    print("folder temporar șters:", not D.exists())
