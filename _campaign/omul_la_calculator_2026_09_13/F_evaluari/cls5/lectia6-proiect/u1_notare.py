"""Profesorul noteaza posterul dupa ce da lectia: „Checklist Final (inainte de predare)” - 9 bife, fara puncte.
Proces NOU (U7): redeschide u1_poster.pptx si PDF-ul randat, citeste textul, aplica fiecare bifa.
Pentru fiecare bifa: se poate decide mecanic (numar/cuvant) sau cere judecata? Cate fapte trebuie citite?
Estimeaza timpul pe poster si pe 25-30 de postere (CALCUL, nu cronometrare: ipotezele sunt scrise in iesire).
Scrie u1_notare_iesire.json + 07_redeschis.json; tipareste <= 20 de randuri."""
import json
import re
from pathlib import Path

import fitz
from pptx import Presentation

L = Path(__file__).resolve().parent
prs = Presentation(str(L / "u1_poster.pptx"))
txt = "\n".join(sh.text_frame.text for sl in prs.slides for sh in sl.shapes if sh.has_text_frame)
pdfs = sorted(L.rglob("u1_poster.pdf"))
pdf_txt = fitz.open(str(pdfs[0]))[0].get_text() if pdfs else ""

comp = re.findall(r"^(.+?) - (Input|Output|Intern|Stocare)$", txt, re.M)
io_in = txt.split("INPUT (Intrare):")[1].split("OUTPUT")[0].split()
io_out = txt.split("OUTPUT (Iesire):")[1].split("HARDWARE")[0].split("\n") if "HARDWARE" in txt.split("OUTPUT (Iesire):")[1] else txt.split("OUTPUT (Iesire):")[1].split("\n")
erg = re.findall(r"^\d\. ", txt.split("ERGONOMIE:")[1].split("LABORATOR:")[0], re.M)
lab = re.findall(r"^\d\. ", txt.split("LABORATOR:")[1], re.M)
CORECT = {"Monitor": "Output", "Tastatura": "Input", "Mouse": "Input", "Boxe": "Output", "Imprimanta": "Output"}

bife = [
    {"bifa": "Titlu clar si vizibil", "rezultat": "Calculatorul Meu" in txt, "mecanic": False,
     "de_ce": "„clar si vizibil” nu are prag (marime? contrast?) - judecata", "fapte_de_citit": 1},
    {"bifa": "Minim 8 componente hardware descrise", "rezultat": len(comp) >= 8, "mecanic": True,
     "de_ce": f"numarat: {len(comp)}", "fapte_de_citit": 8},
    {"bifa": "Clasificare Input/Output corecta", "rezultat": all(CORECT.get(n, t) == t for n, t in comp), "mecanic": True,
     "de_ce": "fiecare componenta verificata contra listei din atomul 3; Procesor/RAM/Hard Disk nu sunt nici Input nici Output - lectia le da Tip „Procesor”/„Memorie”", "fapte_de_citit": 8 + 10},
    {"bifa": "Exemple Hardware vs Software", "rezultat": "HARDWARE" in txt and "SOFTWARE" in txt, "mecanic": True,
     "de_ce": "fara numar minim de exemple in bifa (Ex. 2 cere 3 + 3)", "fapte_de_citit": 8},
    {"bifa": "Checklist ergonomie (5 reguli)", "rezultat": len(erg) == 5, "mecanic": True, "de_ce": f"numarat: {len(erg)}", "fapte_de_citit": 5},
    {"bifa": "Reguli de laborator (5 reguli)", "rezultat": len(lab) == 5, "mecanic": True, "de_ce": f"numarat: {len(lab)}", "fapte_de_citit": 5},
    {"bifa": "Toate informatiile sunt corecte", "rezultat": None, "mecanic": False,
     "de_ce": "cere recitirea tuturor faptelor de mai sus; nu spune ce se intampla la 1 greseala din 40", "fapte_de_citit": 0},
    {"bifa": "Layout frumos si organizat", "rezultat": None, "mecanic": False, "de_ce": "gust - fara descriptor", "fapte_de_citit": 0},
    {"bifa": "Salvat in format PDF", "rezultat": bool(pdfs), "mecanic": True,
     "de_ce": "posibil din PowerPoint (Export) / Canva; Paint listeaza PNG, JPEG, BMP, GIF (surse/paint_ro.txt)", "fapte_de_citit": 0},
]
fapte = sum(b["fapte_de_citit"] for b in bife)
IPOTEZE = {"deschidere_fisier_s": 20, "s_pe_fapt": 2.5, "s_pe_bifa_judecata": 20, "s_scriere_nota": 15}
sec = IPOTEZE["deschidere_fisier_s"] + fapte * IPOTEZE["s_pe_fapt"] + sum(1 for b in bife if not b["mecanic"]) * IPOTEZE["s_pe_bifa_judecata"] + IPOTEZE["s_scriere_nota"]
out = {
    "bife": bife,
    "bife_indeplinite_decise": sum(1 for b in bife if b["rezultat"] is True),
    "bife_nedecidabile_fara_judecata": sum(1 for b in bife if not b["mecanic"]),
    "puncte_sau_nota_in_lectie": "nu exista - 9 bife fara punctaj si fara conversie in nota/nivel",
    "fapte_de_citit_pe_poster": fapte,
    "ipoteze_timp": IPOTEZE,
    "min_pe_poster": round(sec / 60, 1),
    "min_25_postere": round(25 * sec / 60), "min_30_postere": round(30 * sec / 60),
}
(L / "u1_notare_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
red = {"proces": "nou (u1_notare.py)", "pptx_diapozitive": len(prs.slides), "pptx_titlu_citit": txt.split("\n")[0],
       "pptx_componente_citite": len(comp), "pdf": str(pdfs[0].relative_to(L)) if pdfs else None,
       "pdf_contine_titlul": "Calculatorul Meu" in pdf_txt, "pdf_contine_Videoproiector": "Videoproiector" in pdf_txt}
(L / "07_redeschis.json").write_text(json.dumps(red, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(red, ensure_ascii=False))
print(json.dumps({k: v for k, v in out.items() if k != "bife"}, ensure_ascii=False))
