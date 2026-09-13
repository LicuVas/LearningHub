"""U1 - fac exercitiile 1 si 3 ca elevul, cu python-docx (A4). Ce se face doar in program (QAT, Ctrl+F1,
Outline) e pas 'interfata' in 03_pasi.json. Iesirea -> u1_iesire.txt."""
from pathlib import Path
from docx import Document
from docx.shared import Mm

L = Path(__file__).resolve().parent
OUT = L / "produs_elev"
OUT.mkdir(exist_ok=True)
log = []


def a4(doc):
    for s in doc.sections:
        s.page_width = Mm(210)
        s.page_height = Mm(297)


# ---- Exercitiul 1: titlul scris (lectia NU cere stil, doar "Scrie titlul"), 3 butoane din grupul Font
d1 = Document()
a4(d1)
d1.add_paragraph("Fisa mea de observatie - Interfata Word")
d1.add_paragraph("Bold - face textul mai gros, ca sa se vada cuvintele importante.")
d1.add_paragraph("Italic - inclina literele textului selectat.")
d1.add_paragraph("Underline - trage o linie sub textul selectat.")
f1 = OUT / "Exercitiu1_Interfata.docx"
d1.save(f1)
log.append(f"Ex1 salvat: {f1.name} ({f1.stat().st_size} octeti)")

# ---- Exercitiul 3, pasul 1: 5-6 propozitii "Ce am invatat despre Word"
prop = [
    "Word este un procesor de texte.",
    "Fereastra are bara de titlu, panglica, zona de lucru si bara de stare.",
    "Panglica are file, iar fiecare fila are grupuri de comenzi.",
    "Cu Ctrl+S salvez documentul, iar cu Ctrl+Z anulez ultima actiune.",
    "Pot salva documentul si ca PDF, ca sa il deschida oricine.",
]
d3 = Document()
a4(d3)
for p in prop:
    d3.add_paragraph(p)
f3 = OUT / "Tema_Word.docx"
d3.save(f3)
log.append(f"Ex3.1 salvat: {f3.name}, {len(prop)} propozitii")

# ---- Exercitiul 3, pasul 3: al doilea document, textul copiat (Ctrl+A, Ctrl+C, Ctrl+V),
# "adauga doua titluri cu stilul Heading 1 si un subtitlu cu Heading 2".
# Lectia NU spune UNDE pun titlurile; aleg ce ar face un elev: un titlu sus, un subtitlu, al doilea titlu la jumatate.
src = Document(f3)
text_copiat = [p.text for p in src.paragraphs]
d4 = Document()
a4(d4)
d4.add_paragraph("Ce am invatat despre Word", style="Heading 1")
d4.add_paragraph("Fereastra programului", style="Heading 2")
for t in text_copiat[:3]:
    d4.add_paragraph(t)
d4.add_paragraph("Salvarea documentului", style="Heading 1")
for t in text_copiat[3:]:
    d4.add_paragraph(t)
d4.add_paragraph("Print Layout arata pagina asa cum iese la imprimanta; Outline arata doar structura "
                 "titlurilor, pe niveluri. Folosesc Print Layout cand scriu si Outline cand mut capitolele.")
f4 = OUT / "Tema_Word_Structurata.docx"
d4.save(f4)
log.append(f"Ex3.3 salvat: {f4.name}")

# ---- Exercitiul 3, pasul 2: notita cu comenzile QAT (lectia accepta "noteaza comenzile alese")
nota = OUT / "Nota_QAT.txt"
nota.write_text("Comenzi adaugate in bara de acces rapid:\n1. Save As - ca sa fac copia PDF repede.\n"
                "2. Spelling & Grammar - ca sa verific greselile.\n3. Print Preview - ca sa vad pagina inainte de tipar.\n",
                encoding="utf-8")
log.append(f"Ex3.2 notita: {nota.name}, {len(nota.read_text(encoding='utf-8'))} caractere")

# ---- Exercitiul 2: raspunsurile scrise ale elevului in caseta "Raspunsul tau"
ex2 = OUT / "Ex2_raspuns_caseta.txt"
ex2.write_text("Am adaugat Quick Print, Spelling and Grammar si Print Preview, ca sa nu le mai caut prin file. "
               "Cu bara sub Ribbon butoanele sunt mai aproape de text. Cu Ctrl+F1 raman doar numele filelor si am mai mult loc; "
               "apas iar Ctrl+F1 ca sa revina.", encoding="utf-8")
log.append(f"Ex2 raspuns caseta: {len(ex2.read_text(encoding='utf-8'))} caractere")

(L / "u1_iesire.txt").write_text("\n".join(log) + "\n", encoding="utf-8")
print("\n".join(log))
