"""U1 — fac sarcinile evaluarii (lectia 6) ca elevul, in .docx (python-docx), A4.
Ex.1 Document complet (6 elemente) · Ex.2 Auto-evaluare (varianta CERINTA 3x5 si varianta REZOLVARE 3x6)
Ex.3 Referat cu imagine + legenda · Vrei mai mult? (Ctrl+A apoi Ctrl+J pe un document care are deja continut).
Imaginea: o fac eu cu PIL (400x300) — elevul are nevoie de un fisier pe PC, lectia nu spune de unde.
Scrie produs_elev/*.docx si u1_iesire.json; tipareste <= 20 de randuri."""
import copy
import json
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
from docx.shared import Mm, Pt, Cm, RGBColor
from PIL import Image, ImageDraw

L = Path(__file__).resolve().parent
P = L / "produs_elev"
P.mkdir(exist_ok=True)
out = {}

IMG = P / "imagine_scoala_400x300.png"
im = Image.new("RGB", (400, 300), (70, 130, 180))
dr = ImageDraw.Draw(im)
dr.rectangle([100, 120, 300, 280], fill=(230, 220, 200))
dr.polygon([(80, 120), (200, 40), (320, 120)], fill=(160, 60, 50))
im.save(IMG)


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


def titlu(d, text, size, color):
    p = d.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER          # Ctrl+E
    r = p.add_run(text); r.bold = True; r.font.size = Pt(size); r.font.color.rgb = RGBColor(*color)
    return p


def paragraf(d, text, font=None):
    p = d.add_paragraph(text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY          # Ctrl+J
    pf = p.paragraph_format
    pf.first_line_indent = Cm(1.25)                  # First Line Indent (Paragraph)
    pf.line_spacing = 1.5                            # Ctrl+5
    if font:
        for r in p.runs:
            r.font.name = font
    return p


def lista(d, elemente, stil):
    for niv, t in elemente:
        d.add_paragraph(t, style=stil if niv == 1 else stil + " 2")   # Tab = nivelul 2


def tabel(d, rows, cols, date, style="Table Grid"):
    t = d.add_table(rows=rows, cols=cols)
    t.style = style
    for i, rand in enumerate(date):
        for j, v in enumerate(rand):
            if j < cols and v is not None:
                t.cell(i, j).text = v
    for c in t.rows[0].cells:
        for r in c.paragraphs[0].runs:
            r.bold = True
        shade(c, "FFD966")
    return t


def imagine_square(d, latime_cm):
    """Insert > Pictures > This Device, tras de colt (proportional), Wrap Text: Square (anchor + wrapSquare)."""
    d.add_picture(str(IMG), width=Cm(latime_cm))     # doar latimea -> inaltimea proportionala
    p = d.paragraphs[-1]
    inline = p._p.xpath(".//wp:inline")[0]
    ext = inline.find(qn("wp:extent"))
    cx, cy = ext.get("cx"), ext.get("cy")
    anchor = parse_xml(
        f'<wp:anchor {nsdecls("wp", "a", "pic", "r")} distT="0" distB="0" distL="114300" distR="114300" simplePos="0" '
        f'relativeHeight="251658240" behindDoc="0" locked="0" layoutInCell="1" allowOverlap="1">'
        f'<wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="column"><wp:align>right</wp:align></wp:positionH>'
        f'<wp:positionV relativeFrom="paragraph"><wp:posOffset>0</wp:posOffset></wp:positionV>'
        f'<wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:wrapSquare wrapText="bothSides"/>'
        f'</wp:anchor>')
    for tag in ("wp:docPr", "wp:cNvGraphicFramePr", "a:graphic"):
        el = inline.find(qn(tag))
        if el is not None:
            anchor.append(copy.deepcopy(el))
    inline.getparent().replace(inline, anchor)
    return int(cx), int(cy)


# ---------- Ex.1 ----------
d = doc_a4()
titlu(d, "Școala mea", 20, (31, 78, 121))
paragraf(d, "Învăț la o școală din Piatra Neamț. În fiecare zi am șase ore și o pauză mare. "
            "Îmi place ora de TIC, pentru că lucrăm la calculator.")
lista(d, [(1, "Laboratorul de informatică"), (1, "Biblioteca"), (2, "Sala de lectură"), (1, "Sala de sport"),
          (1, "Curtea școlii")], "List Bullet")
lista(d, [(1, "Pornesc calculatorul."), (1, "Deschid Word."), (1, "Salvez documentul cu Ctrl+S.")], "List Number")
t = tabel(d, 4, 3, [["Zi", "Materie", "Ora"], ["Luni", "Română", "8:00"], ["Marți", "TIC", "9:00"], ["Miercuri", None, None]])
m = t.cell(3, 1).merge(t.cell(3, 2)); m.text = "Excursie (toată ziua)"
cx, cy = imagine_square(d, 5)
d.add_paragraph("Textul curge în jurul imaginii, care stă la dreapta, cu încadrare Pătrat (Square).")
d.save(P / "Ex1_Document_complet.docx")
out["ex1"] = {"extent_cx": cx, "extent_cy": cy, "raport_extent": round(cx / cy, 4), "raport_original": round(400 / 300, 4)}

# ---------- Ex.2: cerinta spune 3 coloane si 5 randuri; rezolvarea spune 3x6 ----------
lectii = [["Lecția 1 - Interfața Word", "Ribbon, bara de acces rapid, bara de stare.", "5"],
          ["Lecția 2 - Formatare text", "Bold, Italic, fonturi, Format Painter.", "4"],
          ["Lecția 3 - Paragrafe", "Aliniere, indentare, spațiere.", "4"],
          ["Lecția 4 - Liste", "Marcatori, numerotare, niveluri cu Tab.", "5"],
          ["Lecția 5 - Tabele", "Inserare, Shading, Merge Cells.", "3"]]
antet = ["Lecția", "Ce am învățat", "Nota mea"]
for nume, rows in (("Ex2_cerinta_3x5", 5), ("Ex2_rezolvare_3x6", 6)):
    d = doc_a4()
    titlu(d, "Auto-evaluare", 16, (0, 0, 0))
    date = [antet] + lectii
    t = tabel(d, rows, 3, date[:rows])
    paragraf(d, "Cea mai ușoară lecție a fost cea despre liste. Cea mai grea a fost cea despre tabele. "
                "Vreau să exersez mai mult îmbinarea celulelor.", font="Georgia")
    d.save(P / f"{nume}.docx")
    out[nume] = {"randuri": len(t.rows), "lectii_incapute": len(t.rows) - 1}

# ---------- Ex.3 ----------
d = doc_a4()
titlu(d, "Sportul meu preferat: baschetul", 24, (192, 0, 0))
for _ in range(2):
    paragraf(d, "Baschetul se joacă în două echipe de câte cinci jucători. Scopul este să arunci mingea în coș. "
                "Un meci are patru reprize. Eu joc baschet de doi ani la clubul școlii.")
lista(d, [(1, "Minge"), (2, "mărimea 7"), (1, "Adidași"), (1, "Tricou")], "List Bullet")
lista(d, [(1, "Încălzirea"), (2, "alergare ușoară"), (1, "Pasele"), (1, "Aruncările la coș")], "List Number")
t = tabel(d, 5, 4, [["Echipa", "Meciuri", "Victorii", "Puncte"], ["A", "10", "7", "14"], ["B", "10", "5", "10"],
                    ["C", "10", "3", "6"], ["Total", None, None, None]], style="Light Grid Accent 1")
m = t.cell(4, 1).merge(t.cell(4, 3)); m.text = "30 de meciuri"
imagine_square(d, 6)
leg = d.add_paragraph(); leg.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = leg.add_run("Figura 1. Terenul de baschet"); r.italic = True
d.save(P / "Referat_M1_Performanta.docx")

# ---------- Vrei mai mult: Ctrl+A apoi Ctrl+J pe documentul Ex.1 deja scris ----------
d = Document(P / "Ex1_Document_complet.docx")
d.add_paragraph("Paragraful nou de 5-6 propoziții, scris la sfârșitul documentului. A doua. A treia. A patra. A cincea.")
for p in d.paragraphs:                                 # Ctrl+A = tot conținutul documentului, apoi Ctrl+J
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
d.save(P / "Provocare_CtrlA_CtrlJ.docx")
out["provocare"] = {"titlu_ramas_centrat": d.paragraphs[0].alignment == WD_ALIGN_PARAGRAPH.CENTER}

(L / "u1_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for k, v in out.items():
    print(k, v)
