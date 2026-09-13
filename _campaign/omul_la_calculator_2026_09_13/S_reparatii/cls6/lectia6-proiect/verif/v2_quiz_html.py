import json, subprocess, re
from html.parser import HTMLParser
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls6/m1-prezentari/lectia6-proiect.html"
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")

VOID = {"br", "img", "hr", "input", "meta", "link", "source", "area", "base", "col", "embed", "param", "track", "wbr"}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.quiz = {}
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.quiz[d.get("id", "?")] = json.loads(d["data-quiz"])
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.quiz[d.get("id", "?")] = json.loads(d["data-quiz"])
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                if i != len(self.stack) - 1:
                    self.errors.append(("unclosed", self.stack[i + 1:], "before </%s> at %s" % (tag, self.getpos())))
                del self.stack[i:]
                return
        self.errors.append(("stray </%s>" % tag, self.getpos()))

res = {}
for name, src in (("old", old), ("new", new)):
    p = P(); p.feed(src); p.close()
    res[name] = p
    print(name, "quizzes:", len(p.quiz), "tag errors:", len(p.errors), "left open:", [t for t, _ in p.stack][:10])
    for e in p.errors[:10]:
        print("   ", e)

for aid in res["new"].quiz:
    qo = res["old"].quiz.get(aid, [])
    qn = res["new"].quiz[aid]
    for i, q in enumerate(qn):
        o = qo[i] if i < len(qo) else None
        if o != q:
            print("\n== CHANGED", aid, "q", i + 1)
            print(" OLD:", json.dumps(o, ensure_ascii=False))
            print(" NEW:", json.dumps(q, ensure_ascii=False))
        ops = q["options"]; k = "abcd".index(q["correct"])
        others = [len(x) for j, x in enumerate(ops) if j != k]
        ratio = len(ops[k]) / (sum(others) / len(others))
        flag = " <-- LONG" if ratio > 1.2 else ""
        letter_in_hint = re.search(r"\b(varianta|raspunsul)\s+[a-d]\b", q["hint"], re.I)
        print("  %s q%d key=%s len=%d avg_others=%.1f ratio=%.2f%s hint_letter=%s" % (aid, i + 1, q["correct"], len(ops[k]), sum(others) / len(others), ratio, flag, bool(letter_in_hint)))

# new diacritics in visible text of changed lines, outside glossary names
GLOSS = ["Plasare în acest document", "Se aplică tuturor", "Se aplică pentru toate", "Normală", "Tranziții", "Animații", "Fișier"]
diff = subprocess.run(["git", "-C", REPO, "diff", "-U0", "HEAD", "--", REL], capture_output=True).stdout.decode("utf-8")
for line in diff.splitlines():
    if line.startswith("+") and not line.startswith("+++"):
        s = line
        for g in GLOSS:
            s = s.replace(g, "")
        found = re.findall(r"\w*[ăâîșțşţĂÂÎȘȚ]\w*", s)
        if found:
            print("DIACRITIC outside glossary:", found)
# glued words check
for m in re.finditer(r"[a-z]{2,}[A-Z][a-z]+", re.sub(r"<[^>]+>", " ", new)):
    pass
print("done")
