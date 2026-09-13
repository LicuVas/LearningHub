"""Poarta valului de diacritice (13.09.2026).

python D_poarta_diacritice.py <fisier_nou.html> <referinta.html>
python D_poarta_diacritice.py --git <cale relativa la LearningHub>     (referinta = versiunea din HEAD)

Garantia: daca scoti diacriticele din fisierul nou, iese EXACT referinta (octet cu octet).
Deci s-au putut adauga doar diacritice - nimic altceva nu s-a mutat, sters sau reformulat, nici in chestionare, nici in cod.
In plus:
  - fara ş/ţ cu SEDILA (se folosesc ș/ț cu virgula);
  - fara diacritice in <title>, in <script>, <style>, si in atributele id/class/href/src/data-atom-id;
  - densitatea in textul vizibil >= 25 la 1.000 de litere (text romanesc normal: 40-60).
Exit 0 = trece. La picare, tipareste primele locuri unde fisierul difera de referinta.
"""
import re
import subprocess
import sys
from pathlib import Path

SITE = Path(r"C:\00\Projects\LearningHub")
HARTA = str.maketrans({"ă": "a", "â": "a", "î": "i", "ș": "s", "ț": "t", "Ă": "A", "Â": "A", "Î": "I", "Ș": "S", "Ț": "T",
                       "ş": "s", "ţ": "t", "Ş": "S", "Ţ": "T"})
DIA = "ăâîșțĂÂÎȘȚ"


def main():
    if sys.argv[1] == "--git":
        rel = sys.argv[2].replace("\\", "/")
        new = (SITE / rel).read_text(encoding="utf-8")
        ref = subprocess.run(["git", "-C", str(SITE), "show", f"HEAD:{rel}"], capture_output=True, text=True, encoding="utf-8").stdout
    else:
        new = Path(sys.argv[1]).read_text(encoding="utf-8")
        ref = Path(sys.argv[2]).read_text(encoding="utf-8")
    errs = []
    fara = new.translate(HARTA)
    if fara != ref.translate(HARTA):
        # arata unde
        a, b = fara, ref.translate(HARTA)
        i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
        linie = a.count("\n", 0, i) + 1
        errs.append(f"fisierul difera de referinta si in ALTCEVA decat diacritice (prima diferenta la linia {linie}):\n"
                    f"    nou : {a[max(0, i-60):i+60]!r}\n    ref : {b[max(0, i-60):i+60]!r}\n"
                    f"    lungimi fara diacritice: nou {len(a)} / ref {len(b)}")
    if re.search("[şţŞŢ]", new):
        errs.append(f"s-au folosit ş/ţ cu sedila de {len(re.findall('[şţŞŢ]', new))} ori (se cer ș/ț cu virgula)")
    t_new = re.search(r"<title>(.*?)</title>", new, re.S)
    t_ref = re.search(r"<title>(.*?)</title>", ref, re.S)
    if t_new and t_ref and t_new.group(1) != t_ref.group(1):
        errs.append("<title> s-a schimbat (spec: titlurile raman fara diacritice)")
    for bloc in re.findall(r"(?s)<(?:script|style)[^>]*>.*?</(?:script|style)>", new):
        if re.search(f"[{DIA}]", bloc) and bloc.translate(HARTA) != bloc and bloc not in ref:
            errs.append("diacritice adaugate intr-un <script> sau <style>")
            break
    cod_ref = set(re.findall(r"(?s)<(?:code|pre|kbd)[^>]*>.*?</(?:code|pre|kbd)>", ref))
    for bloc in re.findall(r"(?s)<(?:code|pre|kbd)[^>]*>.*?</(?:code|pre|kbd)>", new):
        if bloc not in cod_ref and re.search(f"[{DIA}]", bloc):
            errs.append(f"diacritice adaugate intr-un bloc de cod (nume de fisier/formula): {bloc[:70]!r}")
            break
    for m in re.finditer(r'\b(id|class|href|src|data-atom-id)="([^"]*)"', new):
        if re.search(f"[{DIA}]", m.group(2)):
            errs.append(f"diacritice in atributul {m.group(1)}: {m.group(2)[:60]!r}")
            break
    vizibil = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", new)
    vizibil = re.sub(r"<[^>]+>", " ", vizibil)
    lit = len(re.findall(r"[A-Za-zăâîșțĂÂÎȘȚ]", vizibil))
    dia = len(re.findall(f"[{DIA}]", vizibil))
    dens = 1000 * dia / max(lit, 1)
    if dens < 25:
        errs.append(f"prea putine diacritice in textul vizibil: {dens:.1f} la 1.000 de litere (minim 25)")
    print(f"diacritice: {dens:.1f} la 1.000 de litere in textul vizibil")
    for e in errs:
        print("PICA: " + e)
    print("OK" if not errs else f"{len(errs)} probleme")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
