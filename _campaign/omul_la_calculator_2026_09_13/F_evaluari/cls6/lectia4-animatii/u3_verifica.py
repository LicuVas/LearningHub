"""U3 + U7 pentru lectia4-animatii. Ruleaza in proces NOU fata de u1_construieste.py.
1) redeschide produs_elev/Animatii_elev.pptx ca ZIP + lxml (nu python-pptx), citeste <p:timing> de pe fiecare diapozitiv,
   calculeaza cronologia secventei principale (regula Microsoft: intarzierea unui After Previous incepe cand se termina precedentul)
   -> 07_redeschis.json
2) a doua cale: numerele din textul lectiei vs ce iese din fisier / din regula Microsoft; textul din PDF-ul LibreOffice vs pptx
3) intrebarile data-quiz: in ce atom stau vs in ce atom e predat termenul (linia din innerText.txt)
-> u3_iesire.json, tipareste un rezumat scurt"""
import json
import re
import zipfile
from pathlib import Path

from lxml import etree

L = Path(__file__).resolve().parent
LESSON = Path("C:/00/Projects/LearningHub/content/tic/cls6/m1-prezentari/lectia4-animatii.html")
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
pptx = L / "produs_elev" / "Animatii_elev.pptx"
out = {}

# ---------- 1) redeschis ----------
z = zipfile.ZipFile(pptx)
slides = sorted([n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)], key=lambda n: int(re.findall(r"\d+", n)[0]))
red = []
for n in slides:
    x = etree.fromstring(z.read(n))
    texte = ["".join(t.text or "" for t in p.iter(A + "t")) for p in x.iter(A + "p")]
    texte = [t for t in texte if t]
    efecte = []
    for c in x.iter(P + "cTn"):
        if c.get("presetClass"):
            tg = c.find(".//" + P + "spTgt")
            pr = tg.find(".//" + P + "pRg") if tg is not None else None
            efecte.append({"clasa": c.get("presetClass"), "presetID": c.get("presetID"), "sub": c.get("presetSubtype"),
                           "start": c.get("nodeType"), "delay_ms": int(c.find(P + "stCondLst/" + P + "cond").get("delay")),
                           "spid": tg.get("spid") if tg is not None else None, "paragraf": pr.get("st") if pr is not None else None,
                           "durata_ms": max(int(b.get("dur")) for b in c.iter(P + "cTn") if b is not c and (b.get("dur") or "").isdigit()),
                           "declansator": None})
    for sq in x.iter(P + "cTn"):
        if sq.get("nodeType") == "interactiveSeq":
            btn = sq.find(P + "stCondLst/" + P + "cond/" + P + "tgtEl/" + P + "spTgt").get("spid")
            for c in sq.iter(P + "cTn"):
                if c.get("presetClass"):
                    for e in efecte:
                        if e["spid"] == c.find(".//" + P + "spTgt").get("spid") and e["declansator"] is None and e["start"] == c.get("nodeType"):
                            e["declansator"] = btn
    # cronologia secventei principale: pe fiecare grup de clic, offset treapta = suma (delay+durata) a treptelor anterioare
    crono = []
    ms = x.find(".//" + P + "cTn[@nodeType='mainSeq']")
    if ms is not None:
        for gi, grp in enumerate(ms.find(P + "childTnLst").findall(P + "par")):
            gc = grp.find(P + "cTn")
            for tr in gc.find(P + "childTnLst").findall(P + "par"):
                off = int(tr.find(P + "cTn/" + P + "stCondLst/" + P + "cond").get("delay"))
                for ep in tr.find(P + "cTn/" + P + "childTnLst").findall(P + "par"):
                    ec = ep.find(P + "cTn")
                    d = int(ec.find(P + "stCondLst/" + P + "cond").get("delay"))
                    pr = ec.find(".//" + P + "pRg")
                    crono.append({"clic": gi + 1 if gc.find(P + "stCondLst/" + P + "cond").get("delay") == "indefinite" else 0,
                                  "clasa": ec.get("presetClass"), "start": ec.get("nodeType"),
                                  "incepe_s": (off + d) / 1000, "paragraf": pr.get("st") if pr is not None else None})
    red.append({"diapozitiv": n, "texte": texte, "nr_animatii": len(efecte), "efecte": efecte, "cronologie": crono,
                "clicuri_necesare": len({c["clic"] for c in crono if c["clic"]})})
(L / "07_redeschis.json").write_text(json.dumps({"fisier": "produs_elev/Animatii_elev.pptx", "citit_cu": "zipfile + lxml, proces nou",
                                                 "diapozitive": red}, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------- 2) a doua cale ----------
it = (L / "innerText.txt").read_text(encoding="utf-8")
rows = []
d2 = red[1]
rows.append({"ce": "Ex.1 minim: cate animatii pe UN diapozitiv vs regula de aur din aceeasi lectie",
             "cale1": "07_redeschis.json: animatiile recitite din XML-ul diapozitivului 2 construit exact pe cerinta Ex.1",
             "val1": d2["nr_animatii"], "cale2": "textul lectiei (atomul 1 si atomul 4): „maximum 2-3 animatii pe slide”",
             "val2": "2-3" if "maximum 2-3 animatii pe slide" in it else "NEGASIT"})
# exemplul din atomul 4: Titlu 1s (On Click) -> Imagine After Previous delay 0.5 dur 0.75 -> Text After Previous dur 1
total = 1 + 0.5 + 0.75 + 1
rows.append({"ce": "Atomul 4, exemplul de secventa: durata totala dupa primul clic",
             "cale1": "textul lectiei: „Total: 3.25 secunde automata dupa primul click!”",
             "val1": 3.25 if "Total: 3.25 secunde" in it else "NEGASIT",
             "cale2": "regula Microsoft (surse/s_durata_intarziere.txt: intarzierea incepe cand se termina precedentul) aplicata pe duratele din exemplu: 1 + 0,5 + 0,75 + 1",
             "val2": total})
d3 = red[2]
starts = [c["incepe_s"] for c in d3["cronologie"]]
rows.append({"ce": "Ex.2: la ce distanta apar punctele 2-5 (Fly In, After Previous, Delay 0.5s)",
             "cale1": "rezolvarea din lectie: „punctele 2-5 apar automat, la 0.5 secunde distanta unul de altul”",
             "val1": "0.5 s" if "la 0.5 secunde distanta unul de altul" in it else "NEGASIT",
             "cale2": f"cronologia recitita din XML (durata implicita 1 s luata din lectie, atomul 4; regula Microsoft pentru Delay): inceputuri {starts}",
             "val2": f"{starts[1] - starts[0]:.1f} s intre inceputuri (0,5 s pauza dupa ce s-a terminat precedentul)"})
try:
    import fitz
    pdf = fitz.open(str(L / "randat_pptx" / "Animatii_elev.pdf"))
    ptext = [pg.get_text() for pg in pdf]
    rows.append({"ce": "Continutul diapozitivului 2 (Ex.1) - pptx vs randarea LibreOffice",
                 "cale1": "07_redeschis.json (XML pptx)", "val1": " | ".join(d2["texte"]),
                 "cale2": "randat_pptx/Animatii_elev.pdf pagina 2 (PyMuPDF get_text)", "val2": " | ".join(t.strip() for t in ptext[1].splitlines() if t.strip())})
except Exception as e:  # noqa: BLE001
    rows.append({"ce": "pdf", "cale1": "pdf", "val1": "eroare", "cale2": "-", "val2": str(e)})
(L / "04_a_doua_cale.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------- 3) intrebari vs atomul care preda ----------
src = LESSON.read_text(encoding="utf-8")
lines = it.splitlines()
atom_start = {int(m.group(1)): i + 1 for i, l in enumerate(lines) for m in [re.fullmatch(r"(\d)\. Continut", l.strip())] if m}
ex_start = next(i + 1 for i, l in enumerate(lines) if l.strip() == "Exercitii practice")


def atom_of(line):
    k = 0
    for a, s in sorted(atom_start.items()):
        if line >= s:
            k = a
    return k if line < ex_start else "Ex"


PREDARE = {  # intrebare (inceput) -> fraza care PREDA termenul (nu intrebarea, nu indiciul „Corect!”)
    "Ce tip de animatie folosesti pentru ca un obiect sa APARA": "un text care apare cu Entrance",
    "Ce inseamna optiunea": "Porneste simultan cu animatia anterioara",
    "Ce categorie de animatii folosesti pentru a misca": "Scop: Misca obiectul de-a lungul unui traseu",
    "Pentru ce tip de animatie este util": "By Paragraph: Fiecare paragraf apare pe rand",
    "Unde gasesti toate animatiile": "Animation Pane este un panou lateral care arata toate animatiile",
    "Ce categorie de animatii folosesti pentru a EVIDENTIA": "Scop: Atrage atentia asupra unui obiect deja vizibil",
    "Care este regula de aur": "Regula de aur: maximum 2-3 animatii pe slide",
    "Ce parametru controleaza cat timp": "Cat de mult timp dureaza animatia de la inceput la sfarsit",
    "Ce face animatia": "Fade: Apare treptat din invizibil",
    "Care este durata recomandata": "Tine-le scurte si dinamice (0.5-1.5s)",
}
quiz = []
for m in re.finditer(r'id="atom-(\d)" data-quiz=\'(.*?)\'>', src):
    for q in json.loads(m.group(2)):
        key = next(k for k in PREDARE if q["question"].startswith(k))
        ln = next(i + 1 for i, l in enumerate(lines) if PREDARE[key] in l)
        ta = atom_of(ln)
        quiz.append({"atom_intrebare": int(m.group(1)), "intrebare": q["question"], "predat_la_linia": ln, "atom_predare": ta,
                     "relatie": "propriu" if ta == int(m.group(1)) else ("INAINTE de predare" if ta > int(m.group(1)) else "inapoi")})
cuv = lambda a, b: len(" ".join(re.sub(r"\[/?ASCUNS[^\]]*\]", " ", l) for l in lines[a - 1:b]).split())  # noqa: E731
rez = {"quiz": quiz,
       "quiz_rezumat": {r: sum(1 for q in quiz if q["relatie"] == r) for r in ("propriu", "INAINTE de predare", "inapoi")},
       "cuvinte": {"pana_la_Ex1": cuv(1, ex_start), "Ex1": cuv(ex_start, 701), "Ex2": cuv(702, 742), "Ex3": cuv(743, 791),
                   "incearca_tu": cuv(50, 104), "tot": cuv(1, len(lines))},
       "atom_start": atom_start, "ex_start": ex_start}
(L / "u3_iesire.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
summary = [f"diap {i + 1}: {r['nr_animatii']} animatii, clicuri {r['clicuri_necesare']}" for i, r in enumerate(red)]
summary += [f"U3 {r['ce'][:60]}: {r['val1']} vs {str(r['val2'])[:70]}" for r in rows]
summary += [f"quiz: {rez['quiz_rezumat']}", f"cuvinte: {rez['cuvinte']}"]
(L / "u3_rulare.txt").write_text("\n".join(summary), encoding="utf-8")
print("\n".join(summary))
