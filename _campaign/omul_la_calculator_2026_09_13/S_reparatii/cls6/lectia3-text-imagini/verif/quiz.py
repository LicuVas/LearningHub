import json, re, sys
from html.parser import HTMLParser

S = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia3-text-imagini"
NEW = r"C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia3-text-imagini.html"
OLD = S + r"\verif\vechi.html"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.quizzes = {}
        self.text = {}
        self.cur = None
        self.depth = 0
        self.stack = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if tag == "div" and "atom" in (a.get("class") or "").split() and a.get("id", "").startswith("atom-"):
            self.cur = a["id"]
            self.depth = 0
            self.text[self.cur] = []
            if "data-quiz" in a:
                self.quizzes[self.cur] = json.loads(a["data-quiz"])
        if self.cur and tag == "div":
            self.depth += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
        if self.cur and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.cur = None

    def handle_data(self, d):
        if self.cur and not self.skip:
            self.text[self.cur].append(d)


def load(path):
    p = P()
    p.feed(open(path, encoding="utf-8").read())
    return p


o, n = load(OLD), load(NEW)
out = []
key = lambda q: q["question"]
oldq = {key(q): (a, q) for a, qs in o.quizzes.items() for q in qs}
for a in sorted(n.quizzes, key=lambda x: int(x.split("-")[1])):
    for q in n.quizzes[a]:
        src = oldq.get(key(q))
        status = "NEMODIFICAT" if src and src[0] == a and src[1] == q else ("MUTAT din " + src[0] if src else "NOU")
        if src and src[1] != q:
            status += " (text schimbat)"
        opts = q["options"]
        ci = ord(q["correct"]) - 97
        lens = [len(x) for x in opts]
        others = [l for i, l in enumerate(lens) if i != ci]
        ratio = lens[ci] / (sum(others) / len(others))
        out.append(f"[{a}] {status}\n  Q: {q['question']}\n  " + "\n  ".join(f"{chr(97+i)}) {x}" for i, x in enumerate(opts))
                   + f"\n  corect={q['correct']} ({opts[ci] if 0 <= ci < len(opts) else 'INVALID'}) raport_lungime={ratio:.2f}\n  hint: {q['hint']}")
        if src and src[1] != q:
            out.append("  VECHI: " + json.dumps(src[1], ensure_ascii=False))
out.append("\nnr intrebari vechi=%d nou=%d" % (sum(map(len, o.quizzes.values())), sum(map(len, n.quizzes.values()))))
open(S + r"\verif\quiz_cmp.txt", "w", encoding="utf-8").write("\n".join(out))
with open(S + r"\verif\atom_text.txt", "w", encoding="utf-8") as f:
    for a, t in n.text.items():
        f.write("===== " + a + "\n" + re.sub(r"\s+", " ", " ".join(t)) + "\n")
print("ok")
