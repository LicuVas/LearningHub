"""Scrie surse/s_<nume>.txt: URL + citatul EXACT copiat din textul brut (raw/<pagina>.txt). Daca fraza nu e gasita -> EROARE (nu scrie)."""
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"

CERERI = {
    "s_diapozitiv_nou": [("diapozitive_ro", "selectați săgeata de lângă Diapozitiv nou"), ("diapozitive_en", "select the arrow by New Slide")],
    "s_dublare": [("diapozitive_ro", "apoi faceți clic pe Dublare diapozitiv"), ("diapozitive_en", "and then click Duplicate Slide"),
                  ("scurtaturi_ro", "Faceți o copie a diapozitivului selectat. Ctrl+Shift+D"), ("scurtaturi_ro", "Dublați obiectele selectate. Ctrl+D"),
                  ("scurtaturi_en", "Make a copy of the selected slide. Ctrl+Shift+D"), ("scurtaturi_en", "Duplicate selected objects. Ctrl+D")],
    "s_panou_miniaturi": [("diapozitive_ro", "Faceți clic dreapta pe diapozitiv în panoul de miniaturi din stânga"),
                          ("diapozitive_en", "Right-click the slide in the thumbnail pane on the left"),
                          ("scurtaturi_ro", "Selectați toate diapozitivele din vizualizarea Sortare diapozitive sau din panoul de miniaturi")],
    "s_fundal": [("fundal_ro", "selectați fila Proiectare . În extremitatea dreaptă, selectați Formatare fundal"),
                 ("fundal_ro", "Sub Umplere , selectați Umplere solidă , Umplere gradient sau Umplere model"),
                 ("fundal_en", "Under Fill , select Solid fill , Gradient fill , or Pattern fill"),
                 ("fundal_en", "at the bottom of the pane, select Apply to All")],
    "s_coordonator": [("master2_ro", "pe fila Coordonator de diapozitive , selectați Închidere vizualizare coordonator"),
                      ("master2_en", "on the Slide Master tab, select Close Master View"),
                      ("master_en", "To open Slide Master view, on the View tab, select Slide Master")],
    "s_antet_subsol": [("numere_ro", "Pe fila Inserare , selectați Antet și subsol . Pe fila Diapozitiv , bifați caseta Subsol"),
                       ("numere_en", "On the Insert tab, select Header & Footer . On the Slide tab, check the Footer box")],
    "s_aspecte": [("aspecte_ro", "cum ar fi diapozitivul Titlu și diapozitivul Titlu și conținut"),
                  ("layout_ro", "Selectați Aspect de diapozitiv de pornire >"),
                  ("layout_en", "Select Home > Slide Layout"),
                  ("layout_en", "a side-by-side Comparison layout, and a Picture-with-Caption layout")],
    "s_teme": [("master_ro", "prima este tema Bază , iar a doua este tema Integrală"),
               ("master_en", "first the Basis theme and then the Integral theme")],
}

for nume, lista in CERERI.items():
    buc = []
    for pag, fraza in lista:
        t = (RAW / f"{pag}.txt").read_text(encoding="utf-8")
        url = t.splitlines()[0]
        if fraza not in t:
            raise SystemExit(f"EROARE: '{fraza}' nu e in {pag}")
        i = t.find(fraza)
        buc.append(f"Sursa: {url}\nDescarcat: curl -sL -A Mozilla/5.0, 13.09.2026 -> surse/raw/{pag}.html (text brut: raw/{pag}.txt)\n"
                   f"Citat exact: \"{t[max(0, i-60):i+len(fraza)+60]}\"\n")
    (D / f"{nume}.txt").write_text("\n".join(buc), encoding="utf-8")
    print("ok", nume)
