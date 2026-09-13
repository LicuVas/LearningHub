"""U16: extrage din programa (curriculum.json, OMEN 3393/2017 + standardele O. 4.615/2026) tot ce priveste clasa a VI-a si
cuvintele tranzitie / prezentare / expunere / efecte -> u16_programa.txt (sirurile se copiaza exact, cu calea JSON)."""
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
SRC = Path("C:/00/AI_0/data/informatica_gimnaziu/curriculum.json")
d = json.loads(SRC.read_text(encoding="utf-8"))
out = [f"Sursa: {SRC} (chei top: {list(d)})", f"surse declarate: {json.dumps(d.get('surse'), ensure_ascii=False)[:400]}"]
PAT = re.compile(r"susțin|imagin|estetic|ergonom|hyperlink|legătur|proiect|drept|date personale|format", re.I)  # L6: proiect, imagini, sustinere


def walk(x, path):
    if isinstance(x, dict):
        for k, v in x.items():
            walk(v, f"{path}.{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            walk(v, f"{path}[{i}]")
    elif isinstance(x, str) and PAT.search(x):
        out.append(f"{path}: {x}")


clase = d.get("clase")
if isinstance(clase, dict):
    for k, v in clase.items():
        if re.search(r"(^|[^I])VI$|6", str(k)):
            walk(v, f"clase.{k}")
elif isinstance(clase, list):
    for i, v in enumerate(clase):
        if re.search(r"\bVI\b|\b6\b", json.dumps(v, ensure_ascii=False)[:200]):
            walk(v, f"clase[{i}]")
(L / "u16_programa.txt").write_text("\n".join(out), encoding="utf-8")
print(len(out), "randuri")
