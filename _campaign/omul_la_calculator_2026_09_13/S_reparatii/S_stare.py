"""Starea reparatiei M1: pe fiecare din cele 25 de lectii - reparata? verificata? verdict? defecte?"""
import json
from pathlib import Path

S = Path(__file__).resolve().parent
LECTII = {
    "cls5": ["lectia1-calculator", "lectia2-hardware", "lectia3-software", "lectia4-ergonomie", "lectia5-reguli", "lectia6-proiect"],
    "cls6": ["lectia1-powerpoint-intro", "lectia2-slide-uri", "lectia3-text-imagini", "lectia4-animatii", "lectia5-tranzitii", "lectia6-proiect"],
    "cls7": ["lectia1-interfata-word", "lectia2-formatare-text", "lectia3-paragrafe", "lectia4-liste", "lectia5-tabele", "lectia6-evaluare"],
    "cls8": ["lectia1-interfata", "lectia2-date", "lectia3-formule", "lectia4-functii", "lectia5-grafice", "lectia6-proiect", "lectia7-sortare"],
}
n_rep = n_ver = 0
for cls, ls in LECTII.items():
    for les in ls:
        d = S / cls / les
        rep = (d / "raport.json").is_file()
        v = d / "verificare.json"
        verdict, defecte = "-", ""
        if v.is_file():
            try:
                j = json.loads(v.read_text(encoding="utf-8"))
                verdict = j.get("verdict", "?")
                g = [x.get("gravitate") for x in j.get("defecte") or []]
                defecte = f"blocant {g.count('blocant')} · important {g.count('important')} · minor {g.count('minor')}"
            except Exception as e:  # noqa: BLE001
                verdict = f"ilizibil ({e})"
        n_rep += rep
        n_ver += v.is_file()
        print(f"{cls}/{les:28} reparata={'da' if rep else 'nu':2}  verdict={verdict:24} {defecte}")
print(f"\nreparate {n_rep}/25 · verificate {n_ver}/25")
