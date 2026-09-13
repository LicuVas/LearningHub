"""U3/U5 - a doua cale pe structura lectiei (citire, nu modificare):
 (a) rezolvarea pliata a fiecarui exercitiu vs cerinta lui: termenii din rezolvare apar in cerinta?
 (b) intrebarea fiecarui atom vs continutul atomului: termenul-cheie al intrebarii e predat in atomul ei sau mai tarziu?
 (c) cheia fiecarei intrebari vs indiciul ei (R1.4).
Iesire: u3_iesire.json; tipareste <= 20 de randuri."""
import html
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
SRC = Path(r"C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente\lectia2-date.html")  # copiat din lectia1-interfata, schimbata calea + TERMEN
s = SRC.read_text(encoding="utf-8")


def txt(h: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()


out = {"sursa": str(SRC)}

# (a) exercitii
ex = []
for m in re.finditer(r'<div class="practice-exercise" data-level="(\w+)">(.*?)<details class="practice-solution">.*?'
                     r'<div class="practice-solution-body">(.*?)</div>', s, re.S):
    nivel, cer, rez = m.group(1), txt(m.group(2)), txt(m.group(3))
    # semne distinctive: cuvinte de 5+ litere / formule din rezolvare
    cuv = set(w.lower() for w in re.findall(r"[A-Za-z]{5,}", rez))
    cer_l = cer.lower()
    comune = sorted(w for w in cuv if w in cer_l)
    lipsa = sorted(w for w in cuv if w not in cer_l)
    ex.append({"nivel": nivel, "cerinta_inceput": cer[:160], "rezolvare_inceput": rez[:160],
               "cuvinte_rezolvare": len(cuv), "regasite_in_cerinta": len(comune),
               "procent_regasit": round(100 * len(comune) / max(len(cuv), 1)),
               "exemple_din_rezolvare_absente_din_cerinta": lipsa[:12],
               "formule_in_rezolvare": re.findall(r"=[A-Z(][^ ,;]*", rez)[:5],
               "formule_in_cerinta": re.findall(r"=[A-Z(][^ ,;]*", cer)[:5]})
out["exercitii"] = ex

# (b)+(c) atomi
atomi = []
blocks = re.split(r'<div class="atom" id="atom-', s)[1:]
corp = []
for b in blocks:
    nr = int(re.match(r"(\d+)", b).group(1))
    q = json.loads(html.unescape(re.search(r"data-quiz='(.*?)'>", b, re.S).group(1)))[0]
    titlu = txt(re.search(r'<h3 class="atom-title">(.*?)</h3>', b, re.S).group(1))
    body = txt(b.split("</h3>", 1)[1])
    body = body.split("Verifica daca ai inteles")[0] if "Verifica daca ai inteles" in body else body
    corp.append(body.lower())
    atomi.append({"nr": nr, "titlu": titlu, "intrebare": q["question"], "cheie": q["correct"],
                  "varianta_cheie": q["options"]["abcd".index(q["correct"])], "indiciu": q["hint"][:120]})
# termenul-cheie al intrebarii, ales din intrebare/cheie (fix, scris aici, nu ghicit):
TERMEN = {1: "aliniaza|stanga", 2: "delete", 3: "gridlines|nu se printeaza", 4: "merge", 5: "ctrl + b|ctrl+b",
          6: "percentage", 7: "la stanga"}
for a in atomi:
    alt = TERMEN[a["nr"]].split("|")
    unde = [i + 1 for i, c in enumerate(corp) if any(t in c for t in alt)]
    a["termen"] = TERMEN[a["nr"]]
    a["predat_in_atomii"] = unde
    a["predat_in_atomul_propriu"] = a["nr"] in unde
    a["predat_inainte_sau_acum"] = any(u <= a["nr"] for u in unde)
    a["cheie_citata_in_indiciu"] = any(w.lower() in a["indiciu"].lower() for w in re.findall(r"[A-Za-z0-9+]{3,}", a["varianta_cheie"])[:3])
out["atomi"] = atomi
out["atomi_intrebare_nepredata_in_atomul_propriu"] = [a["nr"] for a in atomi if not a["predat_in_atomul_propriu"]]
out["atomi_intrebare_nepredata_inca"] = [a["nr"] for a in atomi if not a["predat_inainte_sau_acum"]]
(L / "u3_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for e in ex:
    print(e["nivel"], "regasit", e["procent_regasit"], "% | absente:", e["exemple_din_rezolvare_absente_din_cerinta"][:6])
for a in atomi:
    print(a["nr"], a["titlu"][:28], "| termen:", a["termen"], "| predat in:", a["predat_in_atomii"], "| cheie in indiciu:", a["cheie_citata_in_indiciu"])
print("nepredat in atomul propriu:", out["atomi_intrebare_nepredata_in_atomul_propriu"], "| nepredat inca:", out["atomi_intrebare_nepredata_inca"])
