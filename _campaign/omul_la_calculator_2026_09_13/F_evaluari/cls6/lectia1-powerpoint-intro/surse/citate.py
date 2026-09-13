"""Copiaza citate EXACTE din textul brut (surse/raw/*.txt, scos din HTML descarcat cu curl), nu din WebFetch.
Fiecare citat = subsirul din pagina care incepe cu fraza-ancora; daca ancora lipseste, scriptul se opreste (exit 1)."""
import re
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"

GRUPURI = {
    "s_file_panglica.txt": [
        ("scurtaturi_ro", "Alt+H pentru a deschide fila Pornire", 60),
        ("scurtaturi_ro", "Deschideți fila Proiectare", 330),
        ("scurtaturi_en", "Open the Design tab", 280),
    ],
    "s_taste.txt": [
        ("scurtaturi_ro", "Inserarea unui diapozitiv nou. Ctrl+M", 200),
        ("scurtaturi_en", "Insert a new slide. Ctrl+M", 190),
    ],
    "s_vizualizari.txt": [
        ("vizualizari_ro", "Vizualizarea Sortare diapozitive Puteți accesa", 170),
        ("vizualizari_ro", "Vizualizarea citire Puteți accesa", 120),
        ("vizualizari_ro", "Accesați cele trei vizualizări principale", 140),
        ("vizualizari_en", "Slide Sorter view You can get to", 160),
        ("vizualizari_en", "Reading view You can get to", 90),
    ],
    "s_diapozitive.txt": [
        ("diapozitive_ro", "Pe fila Pornire , selectați săgeata de lângă Diapozitiv nou", 80),
        ("diapozitive_ro", "faceți clic dreapta pe miniatura diapozitivului pe care doriți să-l dublați", 140),
        ("diapozitive_ro", "Pentru mai multe diapozitive: Apăsați lung tasta Ctrl", 190),
        ("diapozitive_en", "right-click the slide thumbnail that you want to duplicate, and then click Duplicate Slide", 70),
    ],
    "s_pdf.txt": [
        ("pdf_ro", "PowerPoint Selectați fila Fișier . Selectați Export .", 200),
        ("pdf_en", "PowerPoint Select the File tab. Select Export .", 180),
    ],
    "s_tema_imagini.txt": [
        ("baza_ro", "Pe fila Fișier din panglică, selectați Nou", 200),
        ("baza_ro", "Pe fila Inserare , selectați Imagini", 60),
        ("baza_en", "On the File tab of the Ribbon, select New", 180),
    ],
}

rc = 0
for fisier, citate in GRUPURI.items():
    linii = []
    for sursa, ancora, extra in citate:
        t = (RAW / f"{sursa}.txt").read_text(encoding="utf-8")
        url = t.splitlines()[0]
        corp = t.split("\n\n", 1)[1]
        i = corp.find(ancora)
        if i < 0:
            print(f"LIPSA ancora in {sursa}: {ancora}")
            rc = 1
            continue
        linii.append(f"Sursa: {url}\nDescarcat: curl -sL, 13.09.2026 -> surse/raw/{sursa}.html\nCitat exact: \"{corp[i:i + len(ancora) + extra]}\"\n")
    (D / fisier).write_text("\n".join(linii), encoding="utf-8")
    print(fisier, len(linii), "citate")
sys.exit(rc)
