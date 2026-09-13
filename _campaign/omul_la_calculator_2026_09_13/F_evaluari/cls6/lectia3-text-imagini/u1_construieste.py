"""U1 - fac sarcinile lectiei lectia3-text-imagini ca un elev de a VI-a, cu python-pptx + lxml.
(Tiparul: lectia2-slide-uri/u1_construieste.py.)

Produce in produs_elev/:
  Despre_Mine.pptx          Ex.1 (minim): 5 diapozitive exact pe cerinta + „Reguli obligatorii” (6x6, >=18pt, un font, contrast, >=1 imagine/diapozitiv)
  Incearca_tu.pptx          „Incearca tu”: 1 diapozitiv cu titlu colorat, 3 texte formatate diferit, 2 imagini, o forma (+1 diapozitiv cu notitele „ce a fost greu”)
  Slide_Prost_Bun.pptx      Ex.2 (standard): diapozitivul PROST (20 randuri, 12pt, 3 fonturi, rosu pe portocaliu) si varianta BUNA
  Proiect_Educational.pptx  Ex.3 (performanta): 8 diapozitive; ce se poate in fisier (titlu cu gradient+umbra ca „WordArt”, imagine decupata in cerc,
                            umbra, 3 forme, grup, aliniere+distributie calculata, liste). SmartArt si Remove Background NU se pot face in fisier -> pasi „interfata”.
Imaginile: generate cu PIL (elevul nu are de unde le lua fara internet - vezi 03_jurnal_sarcina.md).
Iesire: u1_iesire.txt
"""
import copy
from pathlib import Path

from lxml import etree
from PIL import Image, ImageDraw
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Pt

L = Path(__file__).resolve().parent
OUT = L / "produs_elev"
IMG = OUT / "imagini"
OUT.mkdir(exist_ok=True)
IMG.mkdir(exist_ok=True)
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
log = []
FONT = "Calibri"


def imagine(nume, culoare, text, w=800, h=600):
    p = IMG / nume
    im = Image.new("RGB", (w, h), culoare)
    d = ImageDraw.Draw(im)
    d.ellipse((w * 0.3, h * 0.2, w * 0.7, h * 0.7), fill="white")
    d.text((30, h - 60), text, fill="white")
    im.save(p)
    return p


def fundal_solid(slide, rgb):
    f = slide.background.fill
    f.solid()
    f.fore_color.rgb = RGBColor.from_string(rgb)


def fundal_gradient(slide, c1, c2):
    f = slide.background.fill
    f.gradient()
    f.gradient_stops[0].color.rgb = RGBColor.from_string(c1)
    f.gradient_stops[1].color.rgb = RGBColor.from_string(c2)


def caseta(slide, x, y, w, h, randuri, size=24, bold=False, color="000000", font=FONT, lista=None):
    """Insert -> Text Box. lista: None | 'bullet' | 'numar'"""
    tb = slide.shapes.add_textbox(Emu(x), Emu(y), Emu(w), Emu(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, r in enumerate(randuri):
        par = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = par.add_run()
        run.text = r
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.name = font
        run.font.color.rgb = RGBColor.from_string(color)
        if lista:
            pPr = par._p.get_or_add_pPr()
            pPr.set("marL", "457200")
            pPr.set("indent", "-457200")
            if lista == "bullet":
                bf = etree.SubElement(pPr, A + "buFont")
                bf.set("typeface", "Arial")
                etree.SubElement(pPr, A + "buChar").set("char", "•")
            else:
                etree.SubElement(pPr, A + "buFont").set("typeface", "+mj-lt")
                etree.SubElement(pPr, A + "buAutoNum").set("type", "arabicPeriod")
    return tb


def umbra(shape_el_spPr):
    eff = etree.SubElement(shape_el_spPr, A + "effectLst")
    sh = etree.SubElement(eff, A + "outerShdw", blurRad="50800", dist="38100", dir="2700000", algn="tl", rotWithShape="0")
    clr = etree.SubElement(sh, A + "prstClr", val="black")
    etree.SubElement(clr, A + "alpha", val="40000")


W, H = 12192000, 6858000  # 16:9, ca PowerPoint 2013+
LAT = [OUT / "x"]


def prezentare():
    p = Presentation()
    p.slide_width, p.slide_height = W, H
    return p


def gol(p):
    return p.slides.add_slide(p.slide_layouts[6])  # Blank


# ---------------- Ex.1 Despre mine ----------------
p = prezentare()
im_cop = imagine("coperta.png", (40, 90, 160), "coperta")
# Slide 1 Coperta: titlu Bold + minim 40pt + culoare, o imagine, fundal colorat
s = gol(p)
fundal_solid(s, "FFF7E0")
caseta(s, 600000, 500000, 11000000, 1200000, ["Despre mine - Andrei"], size=44, bold=True, color="1F3A93")
s.shapes.add_picture(str(im_cop), Emu(3800000), Emu(2000000), height=Emu(4200000))
# Slide 2 Despre mine: lista cu bullets (hobby-uri) + imagini mici langa fiecare hobby + titlu bold
s = gol(p)
fundal_solid(s, "FFFFFF")
caseta(s, 600000, 300000, 11000000, 1000000, ["Hobby-urile mele"], size=40, bold=True, color="1F3A93")
hobby = ["Fotbal cu prietenii", "Desenez benzi desenate", "Citesc povesti SF", "Construiesc cu Lego"]
caseta(s, 1700000, 1500000, 7000000, 4500000, hobby, size=28, color="000000", lista="bullet")
for i, h in enumerate(hobby):
    s.shapes.add_picture(str(imagine(f"hobby{i}.png", (30 + 50 * i, 120, 80), h, 300, 300)), Emu(600000), Emu(1500000 + i * 1100000), height=Emu(900000))
# Slide 3 Familie: nume, fiecare Bold + culoare diferita  (FICTIVE - vezi conflictul cu nota „Siguranta online”)
s = gol(p)
fundal_solid(s, "FFFFFF")
caseta(s, 600000, 300000, 11000000, 1000000, ["Familia mea"], size=40, bold=True, color="1F3A93")
tb = caseta(s, 600000, 1500000, 6500000, 4000000, ["Mama: Ana", "Tata: Mihai", "Sora: Ioana"], size=32, bold=True, color="C0392B")
for par, c in zip(tb.text_frame.paragraphs, ["C0392B", "1E8449", "7D3C98"]):
    par.runs[0].font.color.rgb = RGBColor.from_string(c)
s.shapes.add_picture(str(imagine("familie.png", (120, 60, 40), "familie")), Emu(7600000), Emu(1600000), height=Emu(3600000))
# Slide 4 Obiective: lista numerotata 3-5
s = gol(p)
fundal_solid(s, "FFFFFF")
caseta(s, 600000, 300000, 11000000, 1000000, ["Obiectivele mele"], size=40, bold=True, color="1F3A93")
caseta(s, 600000, 1500000, 7000000, 4500000, ["Nota 10 la matematica", "Invat sa inot", "Citesc 12 carti", "Castig turneul de sah"], size=28, color="000000", lista="numar")
s.shapes.add_picture(str(imagine("obiective.png", (20, 110, 60), "obiective")), Emu(8000000), Emu(1600000), height=Emu(3000000))
# Slide 5 Contact fictiv: forme decorative + email/telefon inventate, fundal gradient
s = gol(p)
fundal_gradient(s, "DCEBFF", "FFFFFF")
caseta(s, 600000, 300000, 11000000, 1000000, ["Contact (inventat)"], size=40, bold=True, color="1F3A93")
for i, (forma, txt) in enumerate([(MSO_SHAPE.ROUNDED_RECTANGLE, "elev@scoala.ro"), (MSO_SHAPE.OVAL, "0700-000-000")]):
    sh = s.shapes.add_shape(forma, Emu(800000 + i * 5200000), Emu(2000000), Emu(4600000), Emu(1600000))
    sh.fill.solid()
    sh.fill.fore_color.rgb = RGBColor.from_string(["1F3A93", "E67E22"][i])
    sh.text_frame.text = txt
    sh.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
    sh.text_frame.paragraphs[0].runs[0].font.color.rgb = RGBColor.from_string("FFFFFF")
    sh.text_frame.paragraphs[0].runs[0].font.name = FONT
s.shapes.add_picture(str(imagine("contact.png", (90, 90, 90), "plic")), Emu(5000000), Emu(4000000), height=Emu(2200000))
p.save(OUT / "Despre_Mine.pptx")
log.append("Despre_Mine.pptx: 5 diapozitive")

# ---------------- Incearca tu ----------------
p = prezentare()
s = gol(p)
caseta(s, 500000, 300000, 11000000, 1000000, ["Pisicile - animalul meu preferat"], size=40, bold=True, color="8E44AD")
caseta(s, 500000, 1400000, 5500000, 800000, ["Sunt jucause"], size=28, bold=True, color="000000")
tb = caseta(s, 500000, 2300000, 5500000, 800000, ["Dorm 16 ore pe zi"], size=24, color="1E8449")
tb.text_frame.paragraphs[0].runs[0].font.italic = True
tb = caseta(s, 500000, 3200000, 5500000, 800000, ["Torc cand sunt fericite"], size=24, color="C0392B")
tb.text_frame.paragraphs[0].runs[0].font.underline = True
s.shapes.add_picture(str(imagine("pisica1.png", (200, 120, 50), "pisica 1")), Emu(6500000), Emu(1400000), height=Emu(2400000))
s.shapes.add_picture(str(imagine("pisica2.png", (60, 60, 60), "pisica 2")), Emu(6500000), Emu(4000000), height=Emu(2400000))
sh = s.shapes.add_shape(MSO_SHAPE.OVAL, Emu(900000), Emu(4400000), Emu(1600000), Emu(1600000))
sh.fill.solid()
sh.fill.fore_color.rgb = RGBColor.from_string("F4D03F")
s = gol(p)
caseta(s, 500000, 300000, 11000000, 4000000, ["Usor: titlul colorat", "Greu: de unde iau imagini?", "Nu am stiut: forma rotunda perfecta"], size=28, color="000000", lista="bullet")
p.save(OUT / "Incearca_tu.pptx")
log.append("Incearca_tu.pptx: 2 diapozitive")

# ---------------- Ex.2 Slide prost -> bun ----------------
p = prezentare()
s = gol(p)
fundal_solid(s, "F39C12")
rows = [f"Randul {i+1}: text lung copiat din carte despre ciclul apei in natura" for i in range(20)]
tb = caseta(s, 300000, 200000, 8000000, 6400000, rows, size=12, color="E74C3C", font="Times New Roman")
for i, par in enumerate(tb.text_frame.paragraphs):
    par.runs[0].font.name = ["Times New Roman", "Comic Sans MS", "Arial"][i % 3]
s.shapes.add_picture(str(imagine("mica.png", (0, 90, 200), "apa", 120, 90)), Emu(10800000), Emu(5900000), height=Emu(700000))
s = gol(p)
fundal_solid(s, "FFFFFF")
caseta(s, 500000, 300000, 11000000, 1000000, ["Ciclul apei"], size=40, bold=True, color="000000")
caseta(s, 500000, 1500000, 5500000, 4000000, ["Apa se evapora", "Norii se formeaza", "Ploua pe pamant", "Apa ajunge in rauri"], size=24, color="000000", lista="bullet")
s.shapes.add_picture(str(imagine("ciclu.png", (0, 90, 200), "ciclul apei", 1600, 1200)), Emu(6200000), Emu(1300000), height=Emu(4600000))
p.save(OUT / "Slide_Prost_Bun.pptx")
log.append("Slide_Prost_Bun.pptx: 2 diapozitive")

# ---------------- Ex.3 Proiect educational (partial: ce se poate in fisier) ----------------
p = prezentare()
subiect = ["Delfinul", "Cuprins", "Infatisare", "Habitat", "Hrana", "Comportament", "Etapele vietii", "Multumesc!"]
imgs = [imagine(f"delfin{i}.png", (10, 60 + 20 * i, 120), f"delfin {i}", 1920, 1080) for i in range(6)]
for i, t in enumerate(subiect):
    s = gol(p)
    fundal_solid(s, "FFFFFF")
    tb = caseta(s, 500000, 300000, 11000000, 1300000, [t], size=60 if i == 0 else 40, bold=True, color="1F3A93")
    if i == 0:  # „WordArt”: umplere gradient albastru->violet + umbra exterioara, in XML
        rPr = tb.text_frame.paragraphs[0].runs[0]._r.get_or_add_rPr()
        for x in rPr.findall(A + "solidFill"):
            rPr.remove(x)
        g = etree.Element(A + "gradFill")
        gs = etree.SubElement(g, A + "gsLst")
        for pos, c in (("0", "2E86DE"), ("100000", "8E44AD")):
            e = etree.SubElement(gs, A + "gs", pos=pos)
            etree.SubElement(e, A + "srgbClr", val=c)
        rPr.insert(0, g)
        umbra(rPr)
        pic = s.shapes.add_picture(str(imgs[0]), Emu(3600000), Emu(1900000), height=Emu(4500000))
    if i == 1:
        caseta(s, 600000, 1500000, 8000000, 4500000, subiect[2:7], size=28, lista="numar")
    if i in (2, 3):
        pic = s.shapes.add_picture(str(imgs[i]), Emu(6500000), Emu(1600000), height=Emu(4000000))
        caseta(s, 600000, 1600000, 5500000, 4000000, ["Corp lung si neted", "Respira aer"] if i == 2 else ["Mari si oceane calde"], size=28, lista="bullet")
        if i == 2:  # decupare in cerc: Crop to Shape -> Oval (geometria imaginii) + umbra (Picture Effects)
            spPr = pic._element.spPr
            spPr.remove(spPr.find(A + "prstGeom"))
            pg = etree.SubElement(spPr, A + "prstGeom", prst="ellipse")
            etree.SubElement(pg, A + "avLst")
            umbra(spPr)
    if i == 4:  # 3 forme, aliniate la mijloc si distribuite pe orizontala, apoi grupate
        grp = s.shapes.add_group_shape()
        w, h = 2400000, 1600000
        gap = (W - 3 * w) // 4
        for k, (forma, txt) in enumerate([(MSO_SHAPE.OVAL, "Pesti"), (MSO_SHAPE.RECTANGLE, "Calamari"), (MSO_SHAPE.RIGHT_ARROW, "Creveti")]):
            sh = grp.shapes.add_shape(forma, Emu(gap + k * (w + gap)), Emu((H - h) // 2), Emu(w), Emu(h))
            sh.text_frame.text = txt
            sh.text_frame.paragraphs[0].runs[0].font.size = Pt(24)
    if i == 5:
        pic = s.shapes.add_picture(str(imgs[5]), Emu(6500000), Emu(1600000), height=Emu(4000000))
        caseta(s, 600000, 1600000, 5500000, 4000000, ["Traiesc in grupuri", "Comunica prin sunete"], size=28, lista="bullet")
    if i == 6:
        caseta(s, 600000, 1600000, 11000000, 4000000, ["[SmartArt Process: NU se poate crea in fisier cu python-pptx - pas interfata]"], size=20, color="7F7F7F")
    if i == 7:
        s.shapes.add_picture(str(imgs[1]), Emu(3600000), Emu(1900000), height=Emu(4500000))
p.save(OUT / "Proiect_Educational.pptx")
log.append("Proiect_Educational.pptx: 8 diapozitive (fara SmartArt / Remove Background - interfata)")
(L / "u1_iesire.txt").write_text("\n".join(log), encoding="utf-8")
print("\n".join(log))
