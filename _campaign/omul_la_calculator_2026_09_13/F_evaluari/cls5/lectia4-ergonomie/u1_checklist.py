"""U1 - fac sarcina ca elevul: aplic checklistul de 10 puncte din lectie (pasul 6 din „Incearca singur")
pe cele doua scenarii din Exercitiul 3 (Mihai / Elena), exact cum cere rezolvarea model („comparand fiecare element").
Pentru fiecare punct: DA / NU / NU_SE_POATE_DECIDE din textul scenariului. Scrie u1_checklist_iesire.json.
Textele sunt luate din innerText.txt (nu din memorie)."""
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
T = (L / "innerText.txt").read_text(encoding="utf-8")

i = T.find("📋 Checklist Ergonomie")
bloc = T[i:T.find("SCORUL MEU", i)]
itemi = [x.strip() for x in re.findall(r"□ ([^\n]+)", bloc)]
exA = T[T.find("Scenariul A (Mihai):"):T.find("Scenariul B (Elena):")]
exB = T[T.find("Scenariul B (Elena):"):T.find("Intrebari de analiza:")]


def evalueaza(sc: str) -> list:
    s = sc.lower()
    r = []
    for it in itemi:
        k = it.lower()
        v = "NU_SE_POATE_DECIDE"
        if "50-70 cm" in k:
            m = re.search(r"ecranul la (\d+) cm", s)
            v = ("DA" if 50 <= int(m.group(1)) <= 70 else "NU") if m else v
        elif "nivelul ochilor" in k:
            v = "DA" if "nivelul ochilor" in s else v
        elif "picioarele ating" in k:
            v = "DA" if "picioare pe podea" in s else ("NU" if "picioare sub scaun" in s else v)
        elif "genunchii" in k:
            v = v  # scenariile nu spun nimic despre genunchi
        elif "coatele" in k:
            v = "DA" if "coate la 90" in s else v
        elif "umerii" in k:
            v = v
        elif "spatele" in k:
            v = "DA" if "spate drept" in s else ("NU" if "aplecat" in s else v)
        elif "iluminata" in k:
            v = "DA" if "bine iluminata" in s else ("NU" if "intunecata" in s else v)
        elif "luminozitatea" in k:
            v = v
        elif "pauze" in k:
            m = re.search(r"pauze de \d+ min la fiecare (\d+) min", s)
            v = ("DA" if m and 45 <= int(m.group(1)) <= 60 else v) if m else ("NU" if "fara pauza" in s else v)
        r.append({"punct": it, "valoare": v})
    return r


out = {"itemi_checklist": len(itemi)}
for nume, sc in (("Mihai", exA), ("Elena", exB)):
    ev = evalueaza(sc)
    out[nume] = {
        "scor_DA": sum(1 for x in ev if x["valoare"] == "DA"),
        "NU": sum(1 for x in ev if x["valoare"] == "NU"),
        "nedecidabile": [x["punct"] for x in ev if x["valoare"] == "NU_SE_POATE_DECIDE"],
        "detaliu": ev,
    }
out["afirmatia_rezolvarii"] = re.findall(r"Elena respecta toate criteriile[^,]*,[^)]*\)|Mihai le incalca pe toate", T)
(L / "u1_checklist_iesire.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for n in ("Mihai", "Elena"):
    print(n, "DA:", out[n]["scor_DA"], "NU:", out[n]["NU"], "nedecidabile:", len(out[n]["nedecidabile"]), out[n]["nedecidabile"])
print("itemi:", out["itemi_checklist"], "| rezolvarea spune:", out["afirmatia_rezolvarii"])
