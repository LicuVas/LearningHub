"""Extrage data-quiz din HEAD si din fisierul curent (HTMLParser convert_charrefs) si le compara pe atomi."""
import json, subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(r"C:\00\Projects\LearningHub")
REL = "content/tic/cls8/m1-excel-fundamente/lectia5-grafice.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q[d.get("id")] = json.loads(d["data-quiz"])

def get(text):
    p = P(); p.feed(text); return p.q

old = get(subprocess.run(["git", "-C", str(ROOT), "show", f"HEAD:{REL}"], capture_output=True).stdout.decode("utf-8"))
new = get((ROOT / REL).read_text(encoding="utf-8"))
out = []
for k in new:
    if old.get(k) != new[k]:
        out.append({"atom": k, "vechi": old.get(k), "nou": new[k]})
for k in old:
    if k not in new:
        out.append({"atom": k, "sters": old[k]})
for k, qs in new.items():
    for q in qs:
        opts = q["options"]; letters = [o[0] for o in opts]
        assert q["correct"] in letters, (k, q["correct"])
        ci = letters.index(q["correct"])
        oth = [len(o) for i, o in enumerate(opts) if i != ci]
        ratio = len(opts[ci]) / (sum(oth) / len(oth))
        named = any(f"{l})" in q["hint"] or f" {l} " in q["hint"] for l in letters)
        print(k, "corect", q["correct"], "raport_lungime %.2f" % ratio, "indiciu_numeste_litera", named)
print(json.dumps(out, ensure_ascii=False, indent=1))
