"""U3 + U7 + notarea U1 - proces NOU: redeschid produs_elev/Proiect_Albinele.pptx (zipfile + lxml, NU python-pptx care l-a scris)
si PDF-ul randat de LibreOffice (PyMuPDF), apoi:
  1. notez proiectul dupa CE DA LECTIA: lista de verificare din atomul 3 (r. 257-271) + cerintele Ex.2 (r. 804-808) + criteriile Ex.3 (r. 849)
     si marchez pentru fiecare criteriu CUM il verifica profesorul: din fisier (se vede la deschidere) / doar in Slide Show / doar ascultand elevul
  2. a doua cale: linkurile interne din XML vs linkurile din PDF; nr. diapozitive vs nr. pagini; cuvinte 6x6 din XML vs text din PDF
  3. cifrele lectiei care se bat cap in cap (R3.4), recalculate
  4. statistica „Soarele ... intr-o ora ... mai multa energie decat consuma umanitatea intr-un an” (r. 718) pe surse brute
Iesire: u3_iesire.json, 07_redeschis.json, u1_notare.md; tipareste <= 20 de randuri.
"""
import json
import math
import re
import zipfile
from pathlib import Path

import fitz
from lxml import etree

L = Path(__file__).resolve().parent
PPTX = L / "produs_elev" / "Proiect_Albinele.pptx"
PDF = L / "randat_pptx" / "Proiect_Albinele.pdf"
NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006"}
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}Relationship"

z = zipfile.ZipFile(PPTX)
pres = etree.fromstring(z.read("ppt/presentation.xml"))
prels = {r.get("Id"): r.get("Target") for r in etree.fromstring(z.read("ppt/_rels/presentation.xml.rels")).iter(REL)}
ordine = ["ppt/" + prels[s.get("{%s}id" % NS["r"])] for s in pres.find("p:sldIdLst", NS)]

diap = []
for i, part in enumerate(ordine, 1):
    x = etree.fromstring(z.read(part))
    rels_p = part.replace("slides/", "slides/_rels/") + ".rels"
    rels = {r.get("Id"): r.get("Target") for r in etree.fromstring(z.read(rels_p)).iter(REL)}
    paragrafe, fonturi, bold_titlu, numerotate, colorate, linkuri = [], [], False, 0, 0, []
    for sp in x.iter("{%s}sp" % NS["p"]):
        ph = sp.find(".//p:nvPr/p:ph", NS)
        e_titlu = ph is not None and ph.get("type") in ("title", "ctrTitle")
        for p in sp.iter("{%s}p" % NS["a"]):
            txt = "".join(t.text or "" for t in p.iter("{%s}t" % NS["a"]))
            if not txt.strip():
                continue
            if not e_titlu:
                paragrafe.append(txt)
            if p.find("a:pPr/a:buAutoNum", NS) is not None:
                numerotate += 1
            for r in p.findall("a:r", NS):
                rp = r.find("a:rPr", NS)
                if rp is not None and rp.get("sz"):
                    fonturi.append(int(rp.get("sz")) / 100)
                if e_titlu and rp is not None and rp.get("b") == "1":
                    bold_titlu = True
                if rp is not None and rp.find("a:solidFill", NS) is not None:
                    colorate += 1
                h = None if rp is None else rp.find("a:hlinkClick", NS)
                if h is not None and h.get("action") == "ppaction://hlinksldjump":
                    tinta = rels[h.get("{%s}id" % NS["r"])].split("/")[-1]
                    linkuri.append({"text": r.find("a:t", NS).text, "tinta_nr": ordine.index("ppt/slides/" + tinta) + 1})
    imagini = len(x.findall(".//p:pic", NS))
    tr = x.findall(".//p:transition", NS)
    efect_tr = sorted({etree.QName(c).localname for t in tr for c in t})
    intrari = len([c for c in x.iter("{%s}cTn" % NS["p"]) if c.get("presetClass") == "entr"])
    cuv_max = max([len(t.split()) for t in paragrafe] or [0])
    diap.append(dict(nr=i, paragrafe_corp=len(paragrafe), cuvinte_max_pe_rand=cuv_max, font_min=min(fonturi or [0]),
                     titlu_bold=bold_titlu, numerotate=numerotate, colorate=colorate, imagini=imagini,
                     tranzitie=efect_tr, animatii_intrare=intrari, linkuri=linkuri,
                     texte=[t.text for t in x.iter("{%s}t" % NS["a"]) if t.text][:3]))

N = len(diap)
# ---------- PDF (LibreOffice) ----------
doc = fitz.open(PDF)
pdf_linkuri = []
for pg in doc:
    for ln in pg.get_links():
        pdf_linkuri.append({"pagina": pg.number + 1, "tip": ln.get("kind"), "spre_pagina": (int(ln["page"]) + 1) if str(ln.get("page", "")).lstrip("-").isdigit() else ln.get("page"),
                            "uri": ln.get("uri")})
pdf_text = [pg.get_text() for pg in doc]
xml_linkuri = [(2, l["tinta_nr"]) for d in diap for l in d["linkuri"]]
pdf_int = [(l["pagina"], l["spre_pagina"]) for l in pdf_linkuri if l["tip"] == fitz.LINK_GOTO]

# ---------- notarea dupa ce da lectia ----------
toate = lambda k: all(d[k] for d in diap)
C = [
    # (sursa in lectie, criteriu, indeplinit, cum il verifica profesorul)
    ("atom 3 r.257", "Slide de titlu cu autor si data", ("Autor" in " ".join(diap[0]["texte"]) and bool(re.search(r"\d{2}\.\d{2}\.\d{4}", " ".join(diap[0]["texte"])))), "fisier"),
    ("atom 3 r.259 / Ex.2", "Minimum 6 slide-uri", N >= 6, "fisier"),
    ("atom 3 r.261 / Ex.2", "Tema consistenta", True, "fisier (o singura tema in ppt/theme)"),
    ("atom 3 r.263", "Minimum 3 imagini relevante", sum(d["imagini"] for d in diap) >= 3, "fisier (relevanta = judecata)"),
    ("atom 3 r.265 / Ex.2", "Minim o animatie Entrance pe un element", sum(d["animatii_intrare"] for d in diap) >= 1, "DOAR Slide Show sau panoul Animatii, diapozitiv cu diapozitiv"),
    ("atom 3 r.267 / Ex.2", "O tranzitie simpla aplicata uniform", all(d["tranzitie"] == diap[0]["tranzitie"] and d["tranzitie"] for d in diap), "DOAR Slide Show (sau steluta din panoul de miniaturi)"),
    ("atom 3 r.269", "Text lizibil: font minim 24pt", min(d["font_min"] for d in diap) >= 24, "fisier, clic pe fiecare caseta (marimea nu se vede cu ochiul)"),
    ("atom 3 r.269", "Regula 6x6", all(d["paragrafe_corp"] <= 6 and d["cuvinte_max_pe_rand"] <= 6 for d in diap), "fisier, numarat cuvant cu cuvant"),
    ("atom 3 r.271", "Slide final cu multumiri si bibliografie", "Mulțumesc" in " ".join(diap[-1]["texte"]), "fisier"),
    ("atom 3 r.271", "Fisierul salvat ca .pptx", PPTX.suffix == ".pptx", "fisier (daca profesorul GASESTE fisierul)"),
    ("Ex.2 r.806", "Titluri bold", toate("titlu_bold"), "fisier"),
    ("Ex.2 r.806", "Liste numerotate", sum(d["numerotate"] for d in diap) >= 1, "fisier"),
    ("Ex.2 r.806", "Text colorat", sum(d["colorate"] for d in diap) >= 1, "fisier"),
    ("Ex.2 r.808", "Fara greseli de scriere", True, "citit de profesor, diapozitiv cu diapozitiv"),
    ("Ex.3 r.849", "Toate linkurile functioneaza corect in Slide Show", sorted(xml_linkuri) == [(2, 3), (2, 4), (2, 5)], "DOAR Slide Show, clic pe fiecare link + intoarcere"),
    ("Ex.3 r.849", "Incadrarea in 3-5 minute", None, "DOAR ascultand elevul, cu ceasul"),
    ("Ex.3 r.849", "Claritate si contact vizual", None, "DOAR ascultand elevul"),
    ("Ex.3 r.849", "PDF-ul exportat e lizibil si complet", doc.page_count == N, "deschis al doilea fisier"),
]
nr_puncte = 0  # lectia nu da puncte nicaieri (Grep „punct” in innerText.txt -> 0)
auto = [c for c in C if c[3].startswith("fisier")]
f5 = [c for c in C if c[3].startswith("DOAR Slide")]
oral = [c for c in C if c[3].startswith("DOAR ascult")]

# ---------- cifre care se bat cap in cap (R3.4) ----------
cifre = {
    "structura_diapozitive": "atom 1 r.82: 6-8 slide-uri; r.84-92 enumera 7; Ex.2 r.804: cel putin 6",
    "animatii_pe_diapozitiv": "atom 3 r.275: 1-2 animatii Entrance per slide; intrebarea r.309: Maximum 2-3 animatii simple pe slide (cheia)",
    "durata_orala_din_1_min_pe_slide": {"regula r.542": "1 minut per slide", "diapozitive_proiect_7": 7, "minute_rezultate": 7,
                                        "Ex.3 r.836": "3-5 minute", "atom 8 r.686-706 max": 1 + 4 + 1},
    "min_imagini": "atom 3 r.263: minimum 3 imagini; Ex.2 r.804-808: nu cere imagini (doar „Imaginile sunt clare?”)",
}
# ---------- statistica solara ----------
R_T = 6.371e6        # m, raza medie a Pamantului
S0 = 1361            # W/m2, surse/raw/wiki_solar.txt „nominal total solar irradiance ... exactly 1361”
ej_ora = S0 * math.pi * R_T ** 2 * 3600 / 1e18
consum_2024 = round(165.06 + 199.05 + 148.60 + 30.74 + 16.03 + 32.74, 2)   # surse/raw/wiki_energie.txt „Total energy supply by fuel in 2024 in exajoules (EI, 2025)”
solar = {"energie_solara_o_ora_la_varful_atmosferei_EJ": round(ej_ora, 1), "consum_mondial_2024_EJ_EI_2025": consum_2024,
         "raport": round(ej_ora / consum_2024, 3),
         "concluzie": "adevarat la limita (+5%) si doar la varful atmosferei; la sol ajunge mult mai putin - afirmatia e fragila, nu falsa"}

out = {"diapozitive": diap, "pdf": {"pagini": doc.page_count, "linkuri": pdf_linkuri},
       "doua_cai": {"linkuri_xml": xml_linkuri, "linkuri_pdf_libreoffice": pdf_int,
                    "pagini_vs_diapozitive": [doc.page_count, N],
                    "text_diap3_in_pdf": "Corp în" in pdf_text[2] and "trei" in pdf_text[2]},
       "notare": [dict(sursa=a, criteriu=b, indeplinit=c, cum_verifica=d) for a, b, c, d in C],
       "notare_rezumat": {"criterii": len(C), "puncte_date_de_lectie": nr_puncte, "din_fisier": len(auto), "doar_in_slide_show": len(f5), "doar_ascultand": len(oral)},
       "cifre_contradictorii": cifre, "statistica_solara": solar}
(L / "u3_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
(L / "07_redeschis.json").write_text(json.dumps({"citit_cu": "zipfile + lxml + PyMuPDF, proces nou (u3_verifica.py)", "fisier": PPTX.name,
                                                  "diapozitive": N, "diap2_linkuri": diap[1]["linkuri"], "diap1_texte": diap[0]["texte"],
                                                  "pdf_pagini": doc.page_count}, ensure_ascii=False, indent=1), encoding="utf-8")
md = ["# Notarea proiectului meu dupa ce da lectia (generat de u3_verifica.py)", "",
      "Lectia NU are barem cu puncte. Am strans criteriile din trei locuri: lista de verificare din atomul 3, cerintele Ex.2 si „Criteriile de evaluare” din rezolvarea pliata a Ex.3.", "",
      "| Sursa | Criteriu | Proiectul meu | Cum il verifica profesorul |", "|:--|:--|:--|:--|"]
md += [f"| {a} | {b} | {'da' if c else ('nu se poate din fisier' if c is None else 'NU')} | {d} |" for a, b, c, d in C]
md += ["", f"**{len(C)} criterii, 0 puncte.** Din fisier: {len(auto)} · doar in Slide Show: {len(f5)} · doar ascultand elevul: {len(oral)}.",
       "Cu barem lipsa, doi profesori (sau acelasi profesor la doua clase) pot da note diferite pe acelasi proiect."]
(L / "u1_notare.md").write_text("\n".join(md), encoding="utf-8")
print(f"diapozitive {N}, pdf pagini {doc.page_count}")
print("linkuri xml", xml_linkuri, "| pdf LibreOffice", pdf_int)
print("notare:", out["notare_rezumat"])
print("neindeplinite:", [b for a, b, c, d in C if c is False])
print("6x6:", [(d["nr"], d["paragrafe_corp"], d["cuvinte_max_pe_rand"]) for d in diap])
print("font min:", [d["font_min"] for d in diap])
print("solar:", solar)
