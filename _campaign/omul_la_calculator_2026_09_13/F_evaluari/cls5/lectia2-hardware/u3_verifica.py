"""U3 (a doua cale) + U16: scrie u3_iesire.json.
1. Rezolvarea Exercitiului 2 (clasificarea a 6 dispozitive) vs listele din pasul 4 al lectiei.
2. Raspunsurile mele de elev (u1_raspunsuri_elev.json) vs aceleasi liste.
3. Diacritice la 1000 de litere (aceeasi formula ca poarta) + numarul de ş/ţ cu sedila vs ș/ț cu virgula.
4. Cuvinte in engleza folosite ca eticheta de categorie (INPUT/OUTPUT) vs termenii programei (intrare/iesire).
"""
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
T = (L / "innerText.txt").read_text(encoding="utf-8")
out = {}

i = T.find("4. Tipuri de Dispozitive")
seg = T[i:T.find("5. Placa Video (GPU)", i)]
blocuri = {
    "INTRARE": seg[seg.find("Dispozitive de INTRARE (Input)", 600):seg.find("Dispozitive de IESIRE (Output)", 600)],
    "IESIRE": seg[seg.find("Dispozitive de IESIRE (Output)", 600):seg.find("Dispozitive de INTRARE-IESIRE (Input-Output)", 900)],
    "INTRARE-IESIRE": seg[seg.find("Dispozitive de INTRARE-IESIRE (Input-Output)", 900):seg.find("Dispozitive de STOCARE", 1200)],
    "STOCARE": seg[seg.find("Dispozitive de STOCARE", 1200):seg.find("Trucul Magic")],
}


def categoria_din_lectie(nume):
    g = [k for k, v in blocuri.items() if re.search(re.escape(nume), v, re.I)]
    return g


rez2 = T[T.find("3. Clasificare: tastatura"):]
rez2 = rez2[:rez2.find("[/ASCUNS]")]
cheie = {"tastatura": "Tastatura", "monitor": "Monitor", "imprimanta multifunctionala": "Imprimanta multifunctionala",
         "stick USB": "Stick USB", "casti cu microfon": "Casti cu microfon", "scanner": "Scanner"}
rand = []
for k, nume in cheie.items():
    m = re.search(re.escape(k) + r" = ([A-Z\-]+)", rez2)
    rand.append({"dispozitiv": k, "rezolvarea_ex2": m.group(1) if m else None, "pasul4": categoria_din_lectie(nume)})
out["ex2_vs_pasul4"] = rand
out["ex2_potriviri"] = sum(1 for r in rand if r["rezolvarea_ex2"] in r["pasul4"])

u1 = json.loads((L / "u1_raspunsuri_elev.json").read_text(encoding="utf-8"))
clas = [x for x in u1 if x.get("clasificare")]
elev = []
for x in clas:
    for disp, cat in x["clasificare"].items():
        elev.append({"dispozitiv": disp, "elev": cat, "lectia": categoria_din_lectie(disp)})
out["elev_vs_pasul4"] = elev

t = re.sub(r"\[/?ASCUNS[^\]]*\]", " ", T)
lit = len(re.findall(r"[A-Za-zăâîșțşţĂÂÎȘȚŞŢ]", t))
dia = len(re.findall(r"[ăâîșțşţĂÂÎȘȚŞŢ]", t))
out["diacritice_la_1000"] = round(1000 * dia / max(lit, 1), 1)
out["virgula_sț"] = len(re.findall(r"[șțȘȚ]", t))
out["sedila_şţ"] = len(re.findall(r"[şţŞŢ]", t))
out["exemple_cu_diacritice"] = sorted(set(re.findall(r"\S*[ăâîșțşţĂÂÎȘȚŞŢ]\S*", t)))[:20]
out["INPUT_OUTPUT_majuscule"] = len(re.findall(r"\bINPUT|\bOUTPUT", T))
out["intrare_iesire_cuvinte"] = len(re.findall(r"\bintrare|\biesire", T, re.I))
(L / "u3_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("ex2 potriviri:", out["ex2_potriviri"], "/", len(rand))
print("elev:", [(e["dispozitiv"], e["elev"], e["lectia"]) for e in elev])
print("diacritice:", out["diacritice_la_1000"], out["virgula_sț"], out["sedila_şţ"], out["exemple_cu_diacritice"])
print("INPUT/OUTPUT:", out["INPUT_OUTPUT_majuscule"], "intrare/iesire:", out["intrare_iesire_cuvinte"])
