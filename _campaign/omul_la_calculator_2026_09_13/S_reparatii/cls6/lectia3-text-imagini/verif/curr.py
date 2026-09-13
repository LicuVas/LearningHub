import json, re
S = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia3-text-imagini\verif"
t = open(S + r"\atom_text.txt", encoding="utf-8").read()
for m in re.finditer(r"Shift \+ Cerc.{0,200}", t):
    print("ATOM6:", m.group(0))
d = json.load(open(r"C:\00\AI_0\data\informatica_gimnaziu\curriculum.json", encoding="utf-8"))
print(type(d), list(d.keys())[:20] if isinstance(d, dict) else len(d))


def walk(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from walk(v, path + "/" + str(k))
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from walk(v, path + "[%d]" % i)
    else:
        yield path, o


for p, v in walk(d):
    if isinstance(v, str) and re.search(r"(?i)forme predefinite|casete? (de )?text|prezent", v):
        print(p, "=>", v[:400])
