"""U1 — fac exercitiile lectiei 5 (tabele) ca elevul, in .docx (python-docx), A4.
Ex.1 Orar scolar · Ex.2 Tabel comparativ browsere · Ex.3 Formular de inscriere · Provocarea (Convert Text to Table + Merge pe primul rand).
Scrie produs_elev/*.docx si u1_iesire.json; tipareste <= 20 de randuri."""
import json
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT, WD_ROW_HEIGHT_RULE
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, Cm, RGBColor

L = Path(__file__).resolve().parent
P = L / "produs_elev"
P.mkdir(exist_ok=True)
iesire = {}


def doc_a4():
    d = Document()
    s = d.sections[0]
    s.page_width, s.page_height = Mm(210), Mm(297)
    return d


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear"); shd.set(qn("w:color"), "auto"); shd.set(qn("w:fill"), hexcolor)
    tcPr.append(shd)


def look(table, **flags):
    """Table Style Options: firstRow, lastRow, firstColumn, lastColumn, noHBand, noVBand."""
    tblPr = table._tbl.tblPr
    el = tblPr.find(qn("w:tblLook"))
    if el is None:
        el = OxmlElement("w:tblLook"); tblPr.append(el)
    for k, v in flags.items():
        el.set(qn("w:" + k), "1" if v else "0")


def borders(cell, **sides):
    """sides: top/bottom/left/right = (sz_eighths_pt, color) sau None pentru nil."""
    tcPr = cell._tc.get_or_add_tcPr()
    b = tcPr.find(qn("w:tcBorders"))
    if b is None:
        b = OxmlElement("w:tcBorders"); tcPr.append(b)
    for side, val in sides.items():
        e = OxmlElement("w:" + side)
        if val is None:
            e.set(qn("w:val"), "nil")
        else:
            e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(val[0])); e.set(qn("w:color"), val[1])
        b.append(e)


def text(cell, t, bold=False, size=None, color=None, align=WD_ALIGN_PARAGRAPH.CENTER):
    cell.text = ""
    p = cell.paragraphs[0]
    r = p.add_run(t); r.bold = bold
    if size: r.font.size = Pt(size)
    if color: r.font.color.rgb = RGBColor.from_string(color)
    p.alignment = align
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER


# ---------- Ex.1 Orar scolar (6 coloane x 8 randuri) ----------
d = doc_a4()
d.add_paragraph("Orar scolar")
t = d.add_table(rows=8, cols=6)
t.style = "Light Grid Accent 1"   # stil din familia „grid” disponibil in sablonul python-docx (Grid Table 4 nu exista in sablon)
look(t, firstRow=True, firstColumn=True, noHBand=False, noVBand=True)
antet = ["Ora", "Luni", "Marti", "Miercuri", "Joi", "Vineri"]
ore = [f"{h}:00-{h}:50" for h in range(8, 15)]           # 7 ore -> randurile 2-8
materii = ["Matematica", "Romana", "Engleza", "Informatica", "Istorie", "Biologie", "Sport"]
for j, a in enumerate(antet):
    text(t.cell(0, j), a, bold=True, size=12, color="FFFFFF"); shade(t.cell(0, j), "1F3864")  # pasul 9
for i, o in enumerate(ore, start=1):
    text(t.cell(i, 0), o)
    for j in range(1, 6):
        m = materii[(i + j) % len(materii)]
        text(t.cell(i, j), m)
        if m == "Informatica": shade(t.cell(i, j), "C6EFCE")
        if m == "Matematica": shade(t.cell(i, j), "BDD7EE")
t.autofit = False
d.save(P / "Orar_Scolar.docx")
iesire["Ex1"] = {"randuri": len(t.rows), "coloane": len(t.columns), "ore_scrise": len(ore),
                 "incap_7_ore_plus_antet_in_8_randuri": len(ore) + 1 == 8}

# ---------- Ex.2 Browsere (5x5) ----------
d = doc_a4()
d.add_paragraph("Comparatie browsere")
t = d.add_table(rows=5, cols=5)
t.style = "Table Grid"
date = [["Caracteristica", "Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Observatii"],
        ["Viteza", "Rapida", "Foarte rapida", "Rapida", ""],
        ["Consum memorie", "Mare", "Mediu", "Mic", ""],
        ["Extensii disponibile", "Foarte multe", "Multe", "Multe", ""],
        ["Pret", "Gratuit", "Gratuit", "Gratuit", ""]]
culori = {"Rapida": "C6EFCE", "Foarte rapida": "C6EFCE", "Mic": "C6EFCE", "Mediu": "FFEB9C", "Mare": "FFC7CE",
          "Foarte multe": "C6EFCE", "Multe": "FFEB9C", "Gratuit": "C6EFCE"}
for i, rand in enumerate(date):
    for j, v in enumerate(rand):
        text(t.cell(i, j), v, bold=(i == 0 or j == 0))
        if i and j and v in culori: shade(t.cell(i, j), culori[v])
look(t, firstRow=True, firstColumn=True, noHBand=True, noVBand=False)   # Header Row, First Column, Banded Columns
# pasul 7: „Imbina celulele din randul de sus al coloanei Observatii” — pe randul de sus coloana are O SINGURA celula.
# Singura imbinare posibila care lasa loc de „nota generala”: vertical, randurile 2-5 ale coloanei Observatii.
m = t.cell(1, 4).merge(t.cell(4, 4)); text(m, "Nota generala: toate sunt gratuite")
# pasul 9: coloana 1 = 3,5 cm, coloanele 2-5 egale (Distribute Columns) pe latimea ramasa (A4 - margini 2*2,54 = 15,92 cm)
rest = (15.92 - 3.5) / 4
for i in range(5):
    for j in range(5):
        t.cell(i, j).width = Cm(3.5) if j == 0 else Cm(rest)
d.save(P / "Comparatie_Browsere.docx")
iesire["Ex2"] = {"pas7_celule_in_randul_de_sus_al_coloanei_Observatii": 1, "imbinare_facuta": "verticala r2-r5, col 5",
                 "latime_col2_5_cm": round(rest, 2)}

# ---------- Ex.3 Formular de inscriere (4x8) ----------
d = doc_a4()
t = d.add_table(rows=8, cols=4)
t.style = "Table Grid"
t.alignment = WD_TABLE_ALIGNMENT.CENTER
m = t.cell(0, 0).merge(t.cell(0, 3)); text(m, "FORMULAR DE INSCRIERE", bold=True, size=16, color="FFFFFF"); shade(m, "1F3864")
for r, et in ((1, "Nume:"), (2, "Prenume:"), (3, "Data nasterii:")):
    a = t.cell(r, 0).merge(t.cell(r, 1)); text(a, et, bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT)
    b = t.cell(r, 2).merge(t.cell(r, 3)); text(b, "", align=WD_ALIGN_PARAGRAPH.LEFT)
    borders(b, bottom=(4, "808080"))
text(t.cell(4, 0), "Clasa:", bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT); borders(t.cell(4, 1), bottom=(4, "808080"))
text(t.cell(4, 2), "Scoala:", bold=True, align=WD_ALIGN_PARAGRAPH.RIGHT); borders(t.cell(4, 3), bottom=(4, "808080"))
m6 = t.cell(5, 0).merge(t.cell(5, 3)); text(m6, "Informatii suplimentare:", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT)
m7 = t.cell(6, 0).merge(t.cell(6, 3)); text(m7, "")
t.rows[6].height = Cm(3); t.rows[6].height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST
a = t.cell(7, 0).merge(t.cell(7, 1)); text(a, "Data:", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT)
b = t.cell(7, 2).merge(t.cell(7, 3)); text(b, "Semnatura:", bold=True, align=WD_ALIGN_PARAGRAPH.LEFT)
# pasii 10-11: chenar exterior 2pt (sz=16 optimi de pt), interior eliminat
tblPr = t._tbl.tblPr
tb = OxmlElement("w:tblBorders")
for side in ("top", "left", "bottom", "right"):
    e = OxmlElement("w:" + side); e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "16"); e.set(qn("w:color"), "000000"); tb.append(e)
for side in ("insideH", "insideV"):
    e = OxmlElement("w:" + side); e.set(qn("w:val"), "nil"); tb.append(e)
old = tblPr.find(qn("w:tblBorders"))
if old is not None: tblPr.remove(old)
tblPr.append(tb)
d.save(P / "Formular_Inscriere.docx")
iesire["Ex3"] = {"celule_unice_pe_rand": [len({id(c._tc) for c in row.cells}) for row in t.rows]}

# ---------- Provocarea: 5 randuri „Nume, Nota, Absente” -> Convert Text to Table (Commas) -> Merge pe primul rand ----------
linii = ["Popescu Ion, 8, 2", "Ionescu Ana, 10, 0", "Marin Dan, 7, 5", "Stan Elena, 9, 1", "Radu Mihai, 6, 3"]
# etapa 1 a provocarii: cele 5 randuri scrise ca text (inainte de conversie) — asa le vede elevul, cu ¶ la final
d0 = doc_a4()
for ln in linii:
    d0.add_paragraph(ln)
d0.save(P / "Provocare_1_text_inainte.docx")
d = doc_a4()
t = d.add_table(rows=5, cols=3); t.style = "Table Grid"
for i, ln in enumerate(linii):
    for j, v in enumerate(ln.split(",")):          # separatorul Commas: spatiul de dupa virgula ramane in celula
        t.cell(i, j).text = v
inainte = [c.text for c in t.rows[0].cells]
m = t.cell(0, 0).merge(t.cell(0, 2))               # „imbina primul rand intr-o singura celula”
dupa_paragrafe = [p.text for p in m.paragraphs]
m.add_paragraph("Situatia elevilor")               # „scrie acolo un titlu”
d.save(P / "Provocare_Conversie.docx")
iesire["Provocare"] = {"rand1_inainte_de_merge": inainte, "celula_imbinata_contine": dupa_paragrafe + ["Situatia elevilor"],
                       "elevi_ramasi_pe_randuri_separate": len(t.rows) - 1, "elevi_scrisi": len(linii),
                       "spatiu_initial_in_celula_nota": inainte[1].startswith(" ")}

(L / "u1_iesire.json").write_text(json.dumps(iesire, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(iesire, ensure_ascii=False)[:1500])
