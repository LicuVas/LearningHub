import subprocess, json, re
from html.parser import HTMLParser
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls6/m1-prezentari/lectia5-tranzitii.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}; self.stack = []; self.text = {}; self.cur = None; self.depth = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "div" and a.get("class") == "atom" and a.get("id"):
            self.cur = a["id"]; self.depth = 0; self.text[self.cur] = []
            if "data-quiz" in a:
                self.q[self.cur] = a["data-quiz"]
        if self.cur and tag == "div":
            self.depth += 1
    def handle_endtag(self, tag):
        if self.cur and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.cur = None
    def handle_data(self, d):
        if self.cur:
            self.text[self.cur].append(d)

def load(src):
    p = P(); p.feed(src); return p

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = load(old), load(new)
for name, p in (("VECHI", po), ("NOU", pn)):
    print("=====", name)
    for aid, raw in p.q.items():
        try:
            qs = json.loads(raw)
        except Exception as e:
            print(aid, "JSON INVALID", e, raw[:200]); continue
        for i, q in enumerate(qs):
            opts = q["options"]; k = "abcd".index(q["correct"])
            lens = [len(o) for o in opts]; other = [l for j, l in enumerate(lens) if j != k]
            ratio = lens[k] / (sum(other) / len(other))
            print(f"{aid} q{i+1}: {q['question']} | corect={q['correct']}={opts[k]!r} | lung {lens} raport={ratio:.2f} | hint={q['hint']!r}")
            print("     optiuni:", opts)
# ordinea atomilor si texte pentru verificarea "raspuns din pas sau dinainte"
ids = list(pn.text.keys())
full = {a: re.sub(r"\s+", " ", "".join(pn.text[a])) for a in ids}
print("atomi:", ids, [len(full[a]) for a in ids])
checks = {
 "atom-1": ["singura tranzitie", "O singura", "slide-uri"],
 "atom-2": ["Push", "SUBTIL", "profesionale", "impinge"],
 "atom-3": ["1-1.5", "Se aplică tuturor", "DEFAULT"],
 "atom-4": ["copii", "casual", "La clic de mouse", "doar cand faci click"],
 "atom-5": ["Shift", "F5"],
}
for a, terms in checks.items():
    for t in terms:
        i = full[a].find(t)
        print(a, repr(t), "->", i, full[a][max(0, i-120): i+160] if i >= 0 else "")
# HTML well-formedness: compare counts of div open/close in new vs old
for name, s in (("VECHI", old), ("NOU", new)):
    print(name, "div", len(re.findall(r"<div\b", s)), len(re.findall(r"</div>", s)),
          "li", len(re.findall(r"<li\b", s)), len(re.findall(r"</li>", s)),
          "strong", len(re.findall(r"<strong\b", s)), len(re.findall(r"</strong>", s)),
          "p", len(re.findall(r"<p\b", s)), len(re.findall(r"</p>", s)),
          "code", len(re.findall(r"<code\b", s)), len(re.findall(r"</code>", s)))
# cuvinte lipite / diacritice noi in afara glosarului
diac = set("ăâîșțĂÂÎȘȚşţ")
oldlines = set(old.splitlines())
for ln in new.splitlines():
    if ln not in oldlines and any(c in diac for c in ln):
        words = sorted(set(w for w in re.findall(r"[\wăâîșțşţĂÂÎȘȚ]+", ln) if any(c in diac for c in w)))
        print("DIAC:", words)
