"""U7 + U3 — proces NOU: redeschid docx-urile, citesc valori; a doua cale = PDF randat de LibreOffice (PyMuPDF);
cheile grilelor (data-quiz din HTML) vs sursa Microsoft pe text brut; R1.1 lungimi variante.
Scrie 07_redeschis.json, u3_iesire.json, u9_chestionare_lungimi.json; tipareste <= 20 de randuri."""
import html
import json
import re
from pathlib import Path

import docx
import fitz
from docx.oxml.ns import qn

L = Path(__file__).resolve().parent
P = L / "produs_elev"
HT = Path(r"C:\00\Projects\LearningHub\content\tic\cls7\m1-word-fundamente\lectia6-evaluare.html")
R = L / "surse" / "raw"

# ---- U7: redeschid ----
d = docx.Document(str(P / "Ex1_Document_complet.docx"))
p0 = d.paragraphs[0]
p1 = d.paragraphs[1]
body = d.element.body
red = {
    "fisier": "produs_elev/Ex1_Document_complet.docx",
    "titlu_text": p0.text, "titlu_aliniere": str(p0.alignment), "titlu_bold": p0.runs[0].bold,
    "titlu_marime_pt": p0.runs[0].font.size.pt,
    "paragraf_aliniere": str(p1.alignment), "first_line_indent_cm": round(p1.paragraph_format.first_line_indent.cm, 2),
    "interlinie": p1.paragraph_format.line_spacing,
    "gridSpan_in_tabel": len(body.findall(".//" + qn("w:gridSpan"))),
    "shd_fill_antet": [s.get(qn("w:fill")) for s in body.findall(".//" + qn("w:shd"))][:3],
    "wrapSquare": len(body.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}wrapSquare")),
    "pagina_mm": [round(d.sections[0].page_width.mm), round(d.sections[0].page_height.mm)],
}
r3 = docx.Document(str(P / "Referat_M1_Performanta.docx"))
red["referat_stil_tabel"] = r3.tables[0].style.name
red["referat_legenda"] = [p.text for p in r3.paragraphs if p.text.startswith("Figura")]
for n in ("Ex2_cerinta_3x5", "Ex2_rezolvare_3x6"):
    red[n + "_randuri"] = len(docx.Document(str(P / f"{n}.docx")).tables[0].rows)
(L / "07_redeschis.json").write_text(json.dumps(red, ensure_ascii=False, indent=1), encoding="utf-8")

# ---- U3 a doua cale: PDF randat ----
u3 = []
doc = fitz.open(str(L / "randat_docx" / "Referat_M1_Performanta.pdf"))
pg = doc[0]
leg = pg.search_for("Figura 1")
imgs = [pg.get_image_bbox(i) for i in pg.get_images(full=True)]
if leg and imgs:
    lb, ib = leg[0], imgs[0]
    u3.append({"ce": "Ex.3: legenda 'dedesubt' cand imaginea are Wrap Text Square",
               "cale1": "cerinta lectiei (text): legenda scrisa dedesubt ca paragraf centrat",
               "val1": "legenda sub imagine",
               "cale2": "PDF randat LibreOffice, coordonate PyMuPDF (pt)",
               "val2": f"legenda y0={lb.y0:.0f} x0={lb.x0:.0f}; imagine y0={ib.y0:.0f}..y1={ib.y1:.0f} x0={ib.x0:.0f} -> "
                       + ("LANGA imagine (in dreptunghiul ei vertical)" if ib.y0 <= lb.y0 <= ib.y1 else "sub imagine")})
doc1 = fitz.open(str(L / "randat_docx" / "Ex1_Document_complet.pdf"))
t1 = doc1[0].get_text()
u3.append({"ce": "Ex.1: produsul conține cele 6 elemente (conținut, nu aspect)",
           "cale1": "python-docx redeschis (07_redeschis.json)",
           "val1": f"titlu {red['titlu_aliniere']}, FLI {red['first_line_indent_cm']} cm, interlinie {red['interlinie']}, gridSpan {red['gridSpan_in_tabel']}, wrapSquare {red['wrapSquare']}",
           "cale2": "textul PDF randat de LibreOffice",
           "val2": "; ".join(f"{k}={'da' if k in t1 else 'nu'}" for k in ("Școala mea", "Biblioteca", "Salvez documentul", "Excursie (toată ziua)"))})

# ---- chei grile vs surse ----
src = HT.read_text(encoding="utf-8")
quizzes = [json.loads(html.unescape(m)) for m in re.findall(r"data-quiz='([^']*)'", src)]
lung = []
for i, qz in enumerate(quizzes, 1):
    for q in qz:
        opts = q["options"]; k = "abc".index(q["correct"])
        lens = [len(o) for o in opts]
        lung.append({"atom": i, "intrebare": q["question"], "cheie": q["correct"], "varianta_corecta": opts[k],
                     "lungimi": lens, "corecta_e_cea_mai_lunga": lens[k] == max(lens) and lens.count(max(lens)) == 1})
(L / "u9_chestionare_lungimi.json").write_text(json.dumps(lung, ensure_ascii=False, indent=1), encoding="utf-8")


def gaseste(fis, fraza):
    t = (R / fis).read_text(encoding="utf-8", errors="replace").splitlines()
    return [f"r.{i+1}: {x.strip()}" for i, x in enumerate(t) if fraza.lower() in x.lower()][:2]


u3.append({"ce": "Ctrl+A: atomul 5 („in tabel selecteaza tot tabelul”) vs atomul 7 („selecteaza tot textul din document”)",
           "cale1": "textul lecției, două atomi",
           "val1": "doua comportamente diferite pentru aceeasi tasta",
           "cale2": "Microsoft ro-ro, keyboard shortcuts (text brut, surse/raw/shortcuts_ro-ro.txt)",
           "val2": " | ".join(gaseste("shortcuts_ro-ro.txt", "Selectați tot conținutul documentului"))})
u3.append({"ce": "Cheia atomului 10: imaginea „ai invatat-o in Modulul 1”",
           "cale1": "cheia grilei (data-quiz)", "val1": [q for q in lung if q["atom"] == 11][0]["varianta_corecta"],
           "cale2": "grep in lectiile 1-5 (u1_predat_vs_cerut.txt)",
           "val2": "Wrap Text 0/0/0/0/0, Crop 0/0/0/0/0, Picture Styles 0; Pictures doar numit in lectia1 (lista butoanelor Insert)"})
u3.append({"ce": "Ctrl+Spatiu (atomii 2 si 7)", "cale1": "lectia: sterge formatarea manuala",
           "val1": "sterge formatarea manuala", "cale2": "Microsoft ro-ro text brut",
           "val2": " | ".join(gaseste("shortcuts_ro-ro.txt", "Eliminarea formatării manuale a caracterelor"))})
(L / "04_a_doua_cale.json").write_text(json.dumps(u3, ensure_ascii=False, indent=1), encoding="utf-8")
(L / "u3_iesire.json").write_text(json.dumps(u3, ensure_ascii=False, indent=1), encoding="utf-8")

print(json.dumps(red, ensure_ascii=False)[:600])
for r in u3:
    print("-", r["ce"][:60], "=>", str(r["val2"])[:150])
print("grile:", len(lung), "corecta cea mai lunga:", sum(x["corecta_e_cea_mai_lunga"] for x in lung))
