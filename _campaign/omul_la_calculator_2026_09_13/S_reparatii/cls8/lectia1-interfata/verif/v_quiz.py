import json, re, subprocess, sys
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding="utf-8")
REL = "content/tic/cls8/m1-excel-fundamente/lectia1-interfata.html"
L = r"C:\00\Projects\LearningHub"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.atoms = []  # [id, quiz, text]
        self.depth = 0
        self.cur = None
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if self.cur is not None and tag == "div":
            self.depth += 1
        if "atom" in (a.get("class") or "").split() and tag == "div":
            self.cur = [a.get("id"), json.loads(a.get("data-quiz") or "[]"), ""]
            self.atoms.append(self.cur)
            self.depth = 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
        if self.cur is not None and tag == "div":
            self.depth -= 1
            if self.depth == 0:
                self.cur = None

    def handle_data(self, d):
        if self.cur is not None and not self.skip:
            self.cur[2] += d


def parse(s):
    p = P()
    p.feed(s)
    return p.atoms


old = subprocess.run(["git", "-C", L, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(L + "\\" + REL, encoding="utf-8").read()
A, B = parse(old), parse(new)
mode = sys.argv[1] if len(sys.argv) > 1 else "quiz"
for (ia, qa, ta), (ib, qb, tb) in zip(A, B):
    if mode == "text":
        print("=====", ib)
        print(re.sub(r"\s+", " ", tb)[:1800])
        continue
    print("=====", ia, "->", ib, "same" if qa == qb else "CHANGED")
    for q in qb:
        opts = q["options"]
        k = "abcd".index(q["correct"])
        others = [len(o) for i, o in enumerate(opts) if i != k]
        ratio = len(opts[k]) / (sum(others) / len(others))
        print("  Q:", q["question"])
        for i, o in enumerate(opts):
            print("   ", "*" if i == k else " ", "abcd"[i], o, len(o))
        print("   hint:", q["hint"], "| ratio %.2f" % ratio)
# where did old questions go
print("\n--- mapare intrebari vechi -> atom nou")
newq = {q["question"]: ib for ib, qs, _ in B for q in qs}
for ia, qs, _ in A:
    for q in qs:
        print(ia, "->", newq.get(q["question"], "DISPARUTA"), "|", q["question"][:70])
