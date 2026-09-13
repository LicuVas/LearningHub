"""Cauta fiecare nume de tranzitie/animatie din lectie in TOT textul brut descarcat (surse/raw/*.txt, ro + en).
-> nume_efecte.txt: nume | pagini unde apare (cu 60 de caractere context la prima aparitie)."""
import re
from pathlib import Path

D = Path(__file__).resolve().parent
NUME = ["Push", "Fade", "Wipe", "Cut", "Cube", "Flip", "Zoom", "Rotate", "Morph", "Gallery", "Vortex", "Uncover",
        "Fly In", "Appear", "Grow & Turn", "Applause", "Chime", "Whoosh",
        "Estompare", "Metamorfoză", "Împingere", "Ștergere", "Tăiere", "Cub", "Galerie", "Vârtej", "Rotire"]
out = []
texte = {f.stem: f.read_text(encoding="utf-8") for f in sorted((D / "raw").glob("*.txt")) if not f.stem.endswith(".miez")}
for n in NUME:
    gasit = []
    for pag, t in texte.items():
        m = re.search(r"(?<![A-Za-zăâîșț])" + re.escape(n) + r"(?![A-Za-zăâîșț])", t)
        if m:
            gasit.append(f"{pag}: ...{t[max(0, m.start() - 60):m.end() + 60]}...")
    out.append(f"== {n}: {len(gasit)} pagini")
    out += ["   " + g for g in gasit[:3]]
(D / "nume_efecte.txt").write_text("Surse: " + ", ".join(texte) + "\n" + "\n".join(out), encoding="utf-8")
print("\n".join(l for l in out if l.startswith("==")))
