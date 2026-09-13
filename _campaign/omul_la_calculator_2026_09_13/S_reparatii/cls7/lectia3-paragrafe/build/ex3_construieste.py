"""Ex.3 lectia3-paragrafe: construieste documentul colegului (2 si 3 Enter-uri goale) si varianta corectata
(Spacing After 10 pt), plus o varianta 'ca inainte' cu Spacing After calculat. Setari implicite Word 365:
Calibri 11, interlinie 1.15, 8 pt dupa paragraf."""
import json
import subprocess
import sys
from pathlib import Path

import pdfplumber
from docx import Document
from docx.shared import Pt

D = Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia3-paragrafe\build")
H = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\H_randeaza.py"
TXT = ("Paragraful {n} are cateva propozitii despre excursia clasei. Am plecat dimineata cu autocarul si am vizitat "
       "muzeul. Ghidul ne-a aratat obiecte vechi si ne-a povestit despre istoria orasului.")


def doc():
    d = Document()
    st = d.styles["Normal"]
    st.font.name, st.font.size = "Calibri", Pt(11)
    pf = st.paragraph_format
    pf.line_spacing, pf.space_after, pf.space_before = 1.15, Pt(8), Pt(0)
    return d


def build(name, goale, after):
    d = doc()
    for n in range(1, 6):
        p = d.add_paragraph(TXT.format(n=n))
        if after is not None:
            p.paragraph_format.space_after = Pt(after)
        if n < 5:
            for _ in range(goale):
                d.add_paragraph("")
    d.save(D / f"{name}.docx")
    subprocess.run([sys.executable, H, "pdf", str(D / f"{name}.docx"), str(D)], check=True, capture_output=True)
    pdf = next(D.rglob(f"{name}.pdf"))
    with pdfplumber.open(pdf) as P:
        pg = P.pages[0]
        lines = sorted({round(w["top"], 1): w["bottom"] for w in pg.extract_words()}.items())
    tops = [t for t, _ in lines]
    starts = [tops[0]] + [tops[i] for i in range(1, len(tops)) if tops[i] - tops[i - 1] > 20]
    ends = []
    for s in starts[1:]:
        prev = [b for t, b in lines if t < s]
        ends.append(max(prev))
    gaps = [round(s - e, 1) for s, e in zip(starts[1:], ends)]
    return {"doc": name, "randuri_text": len(lines), "inceputuri_paragraf": len(starts),
            "spatiu_alb_intre_paragrafe_pt": gaps, "inaltime_ocupata_pt": round(lines[-1][1] - lines[0][0], 1)}


out = [build("coleg_2enter", 2, None), build("coleg_3enter", 3, None), build("corectat_after10", 0, 10)]
g2 = out[0]["spatiu_alb_intre_paragrafe_pt"][0]
g3 = out[1]["spatiu_alb_intre_paragrafe_pt"][0]
g10 = out[2]["spatiu_alb_intre_paragrafe_pt"][0]
extra = g10 - 10  # ce adauga fontul peste Spacing After (spatiul de sub litere)
out.append(build("ca_inainte_2enter", 0, round(g2 - extra)))
out.append(build("ca_inainte_3enter", 0, round(g3 - extra)))
(D / "ex3_iesire.json").write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
print(json.dumps(out, indent=1, ensure_ascii=False))
