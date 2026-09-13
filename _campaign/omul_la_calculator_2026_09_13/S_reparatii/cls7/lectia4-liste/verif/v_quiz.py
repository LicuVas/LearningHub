import subprocess, json, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls7/m1-word-fundamente/lectia4-liste.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []
        self.stack = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q.append((d.get("data-qid"), json.loads(d["data-quiz"])))

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
print("quiz blocks old/new:", len(po.q), len(pn.q))
same = True
for (a, qa), (b, qb) in zip(po.q, pn.q):
    if a != b or qa != qb:
        same = False
        print("DIFF", a, b)
print("quizzes identical:", same)
# dump all quizzes for context checks
for qid, qs in pn.q:
    for it in qs:
        print(qid, "|", it["question"], "|", it["options"], "|", it["correct"], "|", it.get("hint"))
# tag balance check on new vs old for p/strong/div
for t in ["p", "strong", "div", "li", "ol", "details"]:
    o1 = len(re.findall(r"<%s[\s>]" % t, old)); c1 = len(re.findall(r"</%s>" % t, old))
    o2 = len(re.findall(r"<%s[\s>]" % t, new)); c2 = len(re.findall(r"</%s>" % t, new))
    print(t, "old", o1, c1, "new", o2, c2)
# glued words / diacritics added
import unicodedata
dia = set("ăâîșțĂÂÎȘȚşţŞŢ")
for i, line in enumerate(new.splitlines(), 1):
    if any(ch in dia for ch in line):
        print("DIA", i, line.strip()[:200])
