"""U1 - fac sarcinile lectiei lectia1-powerpoint-intro ca un elev de a VI-a, cu python-pptx.

Produce in produs_elev/:
  Prima_mea_explorare.pptx         (Incearca tu: scrie ceva in slide + salveaza)
  Despre_Nume_Prenume.pptx         (Ex.1: 5 slide-uri, 2 layout-uri, 3 imagini, note la 2 slide-uri)
  Ex2_pozitii_rezolvare.pptx       (Ex.2 citit ca in rezolvare: pozitii, stergere dintr-o data)
  Ex2_numere.pptx                  (Ex.2 citit ad litteram: "slide-ul 5" = cel cu numarul 5, "pare" = numere pare)
  Scoala_mea.pptx                  (Ex.3: 8 slide-uri, 4 layout-uri, note la fiecare)
  CumFacSandvis.pptx               (Ex.4: 4 slide-uri)
Iesire: u1_iesire.txt
"""
import copy
from pathlib import Path

from PIL import Image, ImageDraw
from pptx import Presentation
from pptx.util import Inches

L = Path(__file__).resolve().parent
OUT = L / "produs_elev"
IMG = OUT / "imagini"
OUT.mkdir(exist_ok=True)
IMG.mkdir(exist_ok=True)
log = []

# layout-urile sablonului implicit (acelasi nume ca in PowerPoint en-us)
TITLE, CONTENT, TWO, TITLE_ONLY = 0, 1, 3, 5


def imagine(nume, culoare, text):
    p = IMG / nume
    im = Image.new("RGB", (640, 480), culoare)
    ImageDraw.Draw(im).text((40, 220), text, fill="white")
    im.save(p)
    return p


def slide(prs, layout, titlu, corp=None, nota=None):
    s = prs.slides.add_slide(prs.slide_layouts[layout])
    s.shapes.title.text = titlu
    if corp is not None:
        ph = [p for p in s.placeholders if p.placeholder_format.idx != 0]
        if ph:
            tf = ph[0].text_frame
            linii = corp if isinstance(corp, list) else [corp]
            tf.text = linii[0]
            for ln in linii[1:]:
                tf.add_paragraph().text = ln
    if nota:
        s.notes_slide.notes_text_frame.text = nota
    return s


def text_slide(s):
    return " | ".join(sh.text_frame.text for sh in s.shapes if sh.has_text_frame and sh.text_frame.text)


# ---------- Incearca tu ----------
prs = Presentation()
s = prs.slides.add_slide(prs.slide_layouts[TITLE])
s.shapes.title.text = "Prima mea explorare"
prs.save(OUT / "Prima_mea_explorare.pptx")
log.append(f"Incearca tu: {len(prs.slides)} slide, titlu='{s.shapes.title.text}'")

# ---------- Ex.1 ----------
prs = Presentation()
i1 = imagine("hobby_fotbal.png", (30, 120, 60), "hobby: fotbal")
i2 = imagine("visul_meu_medic.png", (40, 60, 160), "visul meu: medic")
i3 = imagine("visul_meu_spital.png", (160, 40, 60), "spital")
s1 = slide(prs, TITLE, "Ana Popescu", "Clasa a VI-a · Hobby: fotbal", nota="Ma prezint si spun de ce imi place fotbalul.")
s1.shapes.add_picture(str(i1), Inches(7), Inches(0.3), width=Inches(2.5))
slide(prs, CONTENT, "Lucruri despre mine", ["Culoarea preferata: albastru", "Sport: fotbal", "Materia preferata: informatica"],
      nota="Spun pe scurt, fara sa citesc de pe ecran.")
slide(prs, CONTENT, "Ce imi place sa fac", ["Fotbal", "Desen", "Jocuri de logica"])
s4 = slide(prs, TITLE_ONLY, "Visul meu")
s4.shapes.add_picture(str(i2), Inches(0.8), Inches(2), width=Inches(4))
s4.shapes.add_picture(str(i3), Inches(5.2), Inches(2), width=Inches(4))
slide(prs, TITLE, "Multumesc!", "Intrebari?")
prs.save(OUT / "Despre_Nume_Prenume.pptx")
lay = {sl.slide_layout.name for sl in prs.slides}
pics = sum(1 for sl in prs.slides for sh in sl.shapes if sh.shape_type == 13)
note = sum(1 for sl in prs.slides if sl.has_notes_slide and sl.notes_slide.notes_text_frame.text.strip())
log.append(f"Ex.1: slide-uri={len(prs.slides)} layout-uri={sorted(lay)} imagini={pics} slide-uri cu note={note}")
log.append("Ex.1: tema (Design -> Themes) NU se poate aplica din python-pptx -> pas interfata")


# ---------- Ex.2 ----------
def numere(prs):
    return [prs.slides[i].shapes.title.text for i in range(len(prs.slides))]


def reordoneaza(prs, ordine_noua_idx):
    lst = prs.slides._sldIdLst
    ids = list(lst)
    for el in ids:
        lst.remove(el)
    for i in ordine_noua_idx:
        lst.append(ids[i])


def dubleaza(prs, poz):  # poz 1-based; copia se pune imediat dupa (ca Duplicate Slide)
    src = prs.slides[poz - 1]
    nou = prs.slides.add_slide(src.slide_layout)
    for sh in list(nou.shapes):
        sh._element.getparent().remove(sh._element)
    for sh in src.shapes:
        nou.shapes._spTree.insert_element_before(copy.deepcopy(sh._element), "p:extLst")
    lst = prs.slides._sldIdLst
    el = list(lst)[-1]
    lst.remove(el)
    lst.insert(poz, el)


def sterge_poz(prs, poz):  # 1-based
    lst = prs.slides._sldIdLst
    el = list(lst)[poz - 1]
    prs.part.drop_rel(el.rId)
    lst.remove(el)


def ex2_baza():
    prs = Presentation()
    for n in range(1, 9):
        s = prs.slides.add_slide(prs.slide_layouts[TITLE_ONLY])
        s.shapes.title.text = str(n)
    reordoneaza(prs, list(range(7, -1, -1)))
    return prs


# A: cum spune rezolvarea (pozitii; stergere dintr-o data, cu selectie multipla)
prs = ex2_baza()
dupa_inversare = numere(prs)
dubleaza(prs, 5)
dupa_dublare_A = numere(prs)
for poz in sorted([2, 4, 6, 8], reverse=True):  # selectie multipla = toate deodata; echivalent cu stergerea de la coada
    sterge_poz(prs, poz)
for sl in prs.slides:  # "schimba layout-ul la slide-urile ramase" -> Title and Content (in fisier doar citim layout-ul)
    pass
prs.save(OUT / "Ex2_pozitii_rezolvare.pptx")
log.append(f"Ex.2 dupa inversare: {dupa_inversare}")
log.append(f"Ex.2 A (rezolvarea: pozitia 5, pozitiile pare deodata): dupa dublare {dupa_dublare_A} -> final {numere(prs)} ({len(prs.slides)} slide-uri)")

# B: ad litteram (slide-ul cu numarul 5; slide-urile cu numere pare)
prs = ex2_baza()
poz5 = numere(prs).index("5") + 1
dubleaza(prs, poz5)
dupa_dublare_B = numere(prs)
for poz in sorted([i + 1 for i, t in enumerate(numere(prs)) if int(t) % 2 == 0], reverse=True):
    sterge_poz(prs, poz)
prs.save(OUT / "Ex2_numere.pptx")
log.append(f"Ex.2 B (numarul 5; numerele pare): dupa dublare {dupa_dublare_B} -> final {numere(prs)} ({len(prs.slides)} slide-uri)")

# C: elevul care sterge pe rand pozitiile 2, 4, 6, 8 (pozitiile se muta dupa fiecare stergere)
prs = ex2_baza()
dubleaza(prs, 5)
pasi_c = []
for poz in [2, 4, 6, 8]:
    if poz > len(prs.slides):
        pasi_c.append(f"pozitia {poz} NU EXISTA (sunt {len(prs.slides)} slide-uri)")
        break
    sterge_poz(prs, poz)
    pasi_c.append(f"sters poz {poz} -> {numere(prs)}")
log.append("Ex.2 C (sterge pe rand): " + " ; ".join(pasi_c))

# ---------- Ex.3 ----------
prs = Presentation()
continut = [
    (TITLE, "Scoala mea", "Liceul de Arte - clasa a VI-a", "Salut clasa si spun despre ce vorbesc."),
    (CONTENT, "Cladirea", ["Doua corpuri", "Curte interioara"], "Descriu pe scurt cladirea."),
    (TWO, "Salile", ["Laboratorul de TIC"], "Arat cele doua tipuri de sali."),
    (CONTENT, "Profesorii", ["Diriginta", "Profesorii de specialitate"], "Nu dau nume de persoane fara acord."),
    (TITLE_ONLY, "O zi la scoala", None, "Povestesc o zi obisnuita."),
    (CONTENT, "Activitati", ["Cercul de desen", "Concursuri"], "Spun ce activitati imi plac."),
    (TWO, "Ce imi place / ce as schimba", ["Imi place: atelierul"], "Compar doua lucruri."),
    (TITLE, "Concluzie", "Imi place scoala mea", "Multumesc si intreb daca sunt intrebari."),
]
for lay_i, t, c, n in continut:
    slide(prs, lay_i, t, c, n)
prs.save(OUT / "Scoala_mea.pptx")
lay3 = {sl.slide_layout.name for sl in prs.slides}
note3 = sum(1 for sl in prs.slides if sl.notes_slide.notes_text_frame.text.strip())
log.append(f"Ex.3: slide-uri={len(prs.slides)} layout-uri distincte={len(lay3)} {sorted(lay3)} note={note3}/8; PDF prin H_randeaza.py")

# ---------- Ex.4 ----------
prs = Presentation()
i4 = imagine("sandvis.png", (180, 120, 40), "sandvis")
s = slide(prs, TITLE, "Cum sa faci un sandvis", "Ana Popescu")
s.shapes.add_picture(str(i4), Inches(7), Inches(0.3), width=Inches(2.5))
slide(prs, CONTENT, "Materiale necesare", ["Paine", "Unt", "Cascaval", "Rosii"])
slide(prs, CONTENT, "Pasii", ["1. Tai painea", "2. Ung cu unt", "3. Pun cascavalul si rosiile"])
slide(prs, CONTENT, "Rezultat final", ["Sandvisul e gata", "Sfat bonus: spala-te pe maini inainte"])
prs.save(OUT / "CumFacSandvis.pptx")
log.append(f"Ex.4: slide-uri={len(prs.slides)}")

(L / "u1_iesire.txt").write_text("\n".join(log) + "\n", encoding="utf-8")
print("\n".join(log[:20]))
