"""Scrie surse/s_<nume>.txt: URL + citatul EXACT copiat din textul brut (raw/<pagina>.txt). Daca fraza nu e gasita -> EROARE (nu scrie).
(Tiparul: lectia2-slide-uri/surse/citate.py.)"""
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"

CERERI = {
    "s_imagine_dispozitiv": [("imagine_ro", "Pe fila Inserare , în grupul Imagini , selectați Imagini , apoi selectați Acest dispozitiv"),
                             ("imagine_en", "On the Insert tab, in the Images group, select Pictures and then select This Device")],
    "s_imagini_stoc": [("imagine_ro", "selectați Imagini , apoi selectați Imagini de stoc"),
                       ("stoc_ro", "Pe fila Inserare , selectați Imagini , apoi Bancă de imagini"),
                       ("stoc_ro", "Utilizatorii Office 2021 și Office pentru web care nu sunt abonați Microsoft 365 vor avea acces la o porțiune a bibliotecii"),
                       ("stoc_en", "Office 2021 and Office for the web users who are not Microsoft 365 subscribers, will have access to a portion of the library")],
    "s_trunchiere_forma": [("crop_ro", "Pe fila Format imagine , selectați săgeata de lângă Trunchiere . Accesați Trunchiere la formă"),
                           ("crop_en", "On the Picture Format tab, select the arrow next to Crop . Go to Crop to Shape")],
    "s_eliminare_fundal": [("fundalimg_ro", "Pe fila Formatare imagine din panglică, selectați Eliminare fundal"),
                           ("fundalimg_ro", "selectați Format > imagine Eliminare fundal sau Formatare > Eliminare fundal"),
                           ("fundalimg_en", "On the Picture Format tab of the ribbon, select Remove Background")],
    "s_grupare": [("grupare_ro", "Puteți grupa forme, imagini sau alte obiecte (dar nu și casete text)"),
                  ("grupare_en", "You can group shapes, pictures, or other objects (but not text boxes)"),
                  ("scurtaturi_ro", "Grupați obiectele selectate. Ctrl+G"),
                  ("scurtaturi_en", "Group the selected objects. Ctrl+G")],
    "s_aliniere": [("aliniere_ro", "În grupul Aranjare , selectați Aliniere"),
                   ("aliniere_ro", "Aliniere la diapozitiv"),
                   ("aliniere_en", "In the Arrange group, select Align"),
                   ("aliniere_en", "choose Align and select Align to Slide")],
    "s_proportii": [("dimensiune_ro", "Pentru a păstra proporțiile, apăsați și țineți apăsată tasta Shift în timp ce glisați un ghidaj de dimensionare din colț"),
                    ("dimensiune_en", "To maintain the proportions, press and hold Shift while you drag a corner sizing handle"),
                    ("dimensiune_ro", "debifați caseta de selectare Blocare raport aspect")],
    "s_prim_plan": [("scurtaturi_ro", "Aduceți obiectul în prim-plan. Ctrl+Shift+paranteză dreaptă închisă (])"),
                    ("scurtaturi_en", "Bring the object to front. Ctrl+Shift+Right bracket (])")],
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
                   f"Citat exact: \"{t[max(0, i - 60):i + len(fraza) + 60]}\"\n")
    (D / f"{nume}.txt").write_text("\n".join(buc), encoding="utf-8")
    print("scris", nume, len(buc))
