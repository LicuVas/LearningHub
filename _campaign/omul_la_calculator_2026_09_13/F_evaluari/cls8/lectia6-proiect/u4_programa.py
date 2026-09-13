"""Extrage din curriculum.json tot ce contine 'tabelar' + vecinii (continuturile programei OMEN 3393/2017, cls VIII)."""
import json, pathlib
src = pathlib.Path("C:/00/AI_0/data/informatica_gimnaziu/curriculum.json")
out = pathlib.Path(__file__).with_name("u4_programa_iesire.txt")
d = json.loads(src.read_text(encoding="utf-8"))
lines = []

def walk(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            walk(v, path + "/" + str(k))
    elif isinstance(o, list):
        s = json.dumps(o, ensure_ascii=False)
        if "tabelar" in s and len(s) < 4000:
            lines.append(path + " :: " + s)
        else:
            for i, v in enumerate(o):
                walk(v, path + f"[{i}]")
    elif isinstance(o, str) and ("tabelar" in o.lower() or "sortar" in o.lower() or "grafice" in o.lower()):
        lines.append(path + " :: " + o)

walk(d)
out.write_text("\n".join(lines), encoding="utf-8")
print(len(lines), "linii ->", out)
for l in lines[:20]:
    print(l[:300])
