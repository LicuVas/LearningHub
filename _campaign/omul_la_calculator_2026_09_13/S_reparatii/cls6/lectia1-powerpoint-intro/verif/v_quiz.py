import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
L = r"C:\00\Projects\LearningHub"
P = "content/tic/cls6/m1-prezentari/lectia1-powerpoint-intro.html"

class Q(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []; self.atom = None; self.text = {}; self.depth = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("class") == "atom" and a.get("id"):
            self.atom = a["id"]; self.text[self.atom] = []
        if "data-quiz" in a:
            self.q.append((a.get("id"), json.loads(a["data-quiz"])))
    def handle_data(self, d):
        if self.atom: self.text[self.atom].append(d)

old = subprocess.run(["git", "-C", L, "show", "HEAD:" + P], capture_output=True).stdout.decode("utf-8")
new = open(L + "\\" + P.replace("/", "\\"), encoding="utf-8").read()
po, pn = Q(), Q(); po.feed(old); pn.feed(new)
oldq = {}
for aid, qs in po.q:
    for i, q in enumerate(qs): oldq[q["question"]] = (aid, i + 1)
for aid, qs in pn.q:
    for i, q in enumerate(qs):
        src = oldq.get(q["question"], "NOU")
        opts = q["options"]; k = "abcd".index(q["correct"])
        lc = len(opts[k]); others = [len(o) for j, o in enumerate(opts) if j != k]
        ratio = lc / (sum(others) / len(others))
        hint_letter = bool(re.search(r"\b(varianta|raspunsul)\s+[abcd]\b", q["hint"], re.I))
        print(f"{aid} Q{i+1} [din {src}] corect={q['correct']}:{opts[k]!r} raport_lung={ratio:.2f} litera_in_hint={hint_letter}")
        print("   Q:", q["question"]); print("   O:", opts); print("   H:", q["hint"])
# atom texts for answerability
for aid in pn.text:
    t = re.sub(r"\s+", " ", "".join(pn.text[aid]))
    for kw in ["Office", "Word", "Excel", "Ribbon", "note", "Slide Sorter", "Sortare", "F5", "ESC", "Esc", "Ctrl+M", "Ctrl", "Inserare", "Ctrl+S", "pptx"]:
        c = t.count(kw)
        if c: print(aid, kw, c, end=" | ")
    print()
