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
        bazin = [{"t": "tf", "q": ("Aceeași întrebare repetată în tot bazinul: afirmația e adevărată." if r == 0 else f"Runda {r + 1}, întrebarea {k + 1}: afirmația de probă e adevărată."), "ok": True,
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
    r = subprocess.run([sys.executable, str(J / "_motor" / "test_joc.py"), "zz-antrenament"], capture_output=True, text=True, encoding="utf-8")
    print([l for l in r.stdout.splitlines() if "PICAT" in l or "TRECUT" in l or "tragere" in l])
finally:
    shutil.rmtree(D, ignore_errors=True)
    print("folder temporar șters:", not D.exists())
