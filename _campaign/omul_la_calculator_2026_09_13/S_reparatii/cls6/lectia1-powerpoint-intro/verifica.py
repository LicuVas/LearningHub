import html
import json
import re
from pathlib import Path

F = Path(r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia1-powerpoint-intro.html")
G = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\GLOSAR_UI.md")
src = F.read_text(encoding="utf-8")
glosar = G.read_text(encoding="utf-8")


def txt(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s)))


atomi = re.findall(r"<div class=\"atom\" id=\"(atom-\d)\" data-quiz='(.*?)'>(.*?)<div class=\"atom-quiz\">", src, re.S)
# termenul-cheie al fiecarei intrebari -> trebuie sa apara in textul atomului curent sau al celor dinainte
chei = {"slide": "slide-uri", "pachet": "Microsoft Office", "instrumentele de editare": "Ribbon", "note": "Notes Pane",
        "miniaturi si a le reordona": "Slide Sorter", "tasta porneste": "ESC", "RAPID": "Ctrl + M",
        "insera imagini": "Inserare (Insert)", "extensie": ".pptx", "salveaza prezentarea": "Ctrl + S"}
vazut = txt(src.split("<main id=\"atomic-content\">")[0]) if False else ""
for aid, q, corp in atomi:
    vazut += " " + txt(corp)
    for x in json.loads(q):
        k = next(k for k in chei if k in x["question"])
        print(aid, "|", x["question"][:60], "| cheie", repr(chei[k]), "predat pana aici:", chei[k] in vazut,
              "| in atomul curent:", chei[k] in txt(corp), "| corect:", x["options"][ord(x["correct"]) - 97])

for ro in ["fila Pornire", "fila Inserare", "fila Proiectare", "fila Tranziții", "fila Animații", "fila Expunere diapozitive",
           "fila Fișier", "Diapozitiv nou", "Ștergere diapozitiv", "Dublare diapozitiv", "Normală", "Sortare diapozitive",
           "vizualizarea de citire", "Creare document PDF/XPS", "Salvare cu tipul", "Salvare ca", "Formatare fundal",
           "| Titlu |", "Titlu și conținut", "Acest dispozitiv", "Inserare > Imagini", "fila Proiectare (teme)", "Aspect (Layout)"]:
    print("glosar:", ro, ro in glosar)

t = txt(src)
for vechi in ["Prima_mea_explorare", "Despre_Nume_Prenume", "CumFacSandvis", "5 slide-uri de continut", "Duplica slide-ul 5",
              "Sterge toate slide-urile pare", "nu a fost explicata", "Desktop sau Documents", "Background Styles"]:
    print("vechi ramas:", vechi, vechi in t)
print("Ex3: 1 + 6 + 1 =", 1 + 6 + 1)
