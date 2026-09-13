"""U3 + U7 — intr-un proces nou:
(a) PDF-urile randate de LibreOffice citite cu PyMuPDF: eticheta (1., a., I., •) si x-ul fiecarui rand de lista;
(b) docx redeschis cu python-docx: pentru fiecare paragraf de lista, numId/ilvl -> numFmt din numbering.xml (a doua cale fata de PDF);
(c) chestionarele: cheia vs indiciul atomului + lungimea variantelor (R1.1).
Iesire: u3_iesire.json + 07_redeschis.json + u9_chestionare_lungimi.json; tipareste <= 20 randuri."""
import html
import json
import re
from pathlib import Path

import fitz
from docx import Document

L = Path(__file__).resolve().parent
P, RD = L / "produs_elev", L / "randat_docx"
LESSON = Path("C:/00/Projects/LearningHub/content/tic/cls7/m1-word-fundamente/lectia4-liste.html")
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def linii_pdf(name):
    out = []
    for pg in fitz.open(str(RD / name)):
        for b in pg.get_text("dict")["blocks"]:
            for ln in b.get("lines", []):
                t = " ".join(s["text"].strip() for s in ln["spans"] if s["text"].strip())
                if t:
                    out.append({"t": t[:45], "x0": round(ln["bbox"][0], 1), "y": round(ln["bbox"][1], 1)})
    return out


def formate_docx(name):
    d = Document(str(P / name))
    num = d.part.numbering_part.element
    absfmt = {}
    for an in num.findall(W + "abstractNum"):
        absfmt[an.get(W + "abstractNumId")] = {lv.get(W + "ilvl"): lv.find(W + "numFmt").get(W + "val") for lv in an.findall(W + "lvl")}
    numabs = {n.get(W + "numId"): n.find(W + "abstractNumId").get(W + "val") for n in num.findall(W + "num")}
    out = []
    for p in d.paragraphs:
        np_ = p._p.find(W + "pPr/" + W + "numPr")
        if np_ is not None:
            nid, il = np_.find(W + "numId").get(W + "val"), np_.find(W + "ilvl").get(W + "val")
            out.append({"text": p.text[:35], "ilvl": int(il), "numFmt": absfmt[numabs[nid]][il]})
    sec = d.sections[0]
    return out, round(sec.page_width.mm), round(sec.page_height.mm)


res = {}
tema = linii_pdf("Tema_Liste.pdf")
res["pdf_tema_ex3_primele"] = [x for x in tema if x["t"].startswith(("I.", "II.", "•", "Respect", "Ascult"))][:8]
res["pdf_ex2_mod_preparare"] = [x for x in tema if re.match(r"^(\d\.|[a-c]\.)", x["t"])][:12]
tab = linii_pdf("Ex3_dupa_rezolvare_Tab.pdf")
res["pdf_ex3_dupa_rezolvare"] = tab[:8]
res["pdf_renumerotare_reala"] = [x["t"] for x in linii_pdf("Renumerotare_lista_reala.pdf")]
res["pdf_renumerotare_manual"] = [x["t"] for x in linii_pdf("Renumerotare_manual.pdf")]
res["pdf_provocare"] = [x["t"] for x in linii_pdf("Provocare_Continue.pdf")]

f_tema, lw, lh = formate_docx("Tema_Liste.docx")
f_tab, _, _ = formate_docx("Ex3_dupa_rezolvare_Tab.docx")
ex3_enunt = [x for x in f_tema if x["text"].startswith(("Respect", "Ascult"))]
ex3_tab = [x for x in f_tab if x["text"].startswith(("Respect", "Ascult"))]
red = {"fisier": "produs_elev/Tema_Liste.docx", "latime_pagina_mm": lw, "inaltime_pagina_mm": lh,
       "paragrafe_de_lista": len(f_tema),
       "ex1_nivel1_nivel2": [x for x in f_tema if x["text"] in ("Fructe", "mere")],
       "ex3_enunt_nivel1_nivel2": ex3_enunt,
       "ex3_dupa_rezolvare_nivel1_nivel2 (Ex3_dupa_rezolvare_Tab.docx)": ex3_tab}
(L / "07_redeschis.json").write_text(json.dumps(red, ensure_ascii=False, indent=1), encoding="utf-8")

# (c) chestionare
src = LESSON.read_text(encoding="utf-8")
qs = []
for m in re.finditer(r"data-quiz='(.*?)'", src, re.S):
    for it in json.loads(html.unescape(m.group(1))):
        lens = [len(o) for o in it["options"]]
        c = it["correct"]
        i = "abc".index(c) if isinstance(c, str) else int(c)
        qs.append({"q": it["question"][:60], "lungimi": lens, "cheie": c, "varianta_cheie": it["options"][i][:60],
                   "indiciu": str(it.get("hint") or it.get("explanation") or "")[:90],
                   "cheia_e_cea_mai_lunga": lens[i] == max(lens) and lens.count(max(lens)) == 1})
(L / "u9_chestionare_lungimi.json").write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
res["chestionare"] = len(qs)
(L / "u3_iesire.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")

print("Ex3 enunt (docx):", [(x["ilvl"], x["numFmt"]) for x in ex3_enunt])
print("Ex3 dupa rezolvare (docx):", [(x["ilvl"], x["numFmt"]) for x in ex3_tab])
print("PDF Ex3 enunt:", [x["t"][:20] for x in res["pdf_tema_ex3_primele"][:4]])
print("PDF Ex3 dupa rezolvare:", [x["t"][:22] for x in tab[1:5]])
print("PDF Ex2:", [x["t"][:18] for x in res["pdf_ex2_mod_preparare"][:9]])
print("renumerotare reala:", res["pdf_renumerotare_reala"], "| manual:", res["pdf_renumerotare_manual"])
print("provocare:", res["pdf_provocare"])
print("chestionare:", len(qs), "cheia cea mai lunga la:", [q["q"][:30] for q in qs if q["cheia_e_cea_mai_lunga"]])
