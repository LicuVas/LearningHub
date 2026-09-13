import json, re, subprocess, sys
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
PATH = "content/tic/cls6/m1-prezentari/lectia4-animatii.html"
sys.stdout.reconfigure(encoding="utf-8")


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.cur = None
        self.depth = 0
        self.text = {}
        self.void = {"br", "img", "hr", "input", "meta", "link"}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "div" and a.get("id", "").startswith("atom-") and "atom" in a.get("class", ""):
            self.cur = a["id"]
            self.depth = 0
            self.q[self.cur] = json.loads(a.get("data-quiz", "[]"))
            self.text[self.cur] = []
        if self.cur and tag not in self.void:
            self.depth += 1

    def handle_endtag(self, tag):
        if self.cur and tag not in self.void:
            self.depth -= 1
            if self.depth == 0:
                self.cur = None

    def handle_data(self, d):
        if self.cur:
            self.text[self.cur].append(d)


def parse(src):
    p = P()
    p.feed(src)
    return p


old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + PATH], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + PATH.replace("/", "\\"), encoding="utf-8").read()
po, pn = parse(old), parse(new)
for atom in pn.q:
    print("=====", atom)
    txt = " ".join(pn.text[atom])
    for i, q in enumerate(pn.q[atom]):
        opts = q["options"]
        k = ord(q["correct"]) - 97
        lens = [len(o) for o in opts]
        others = [l for j, l in enumerate(lens) if j != k]
        avg = sum(others) / len(others)
        changed = q not in po.q.get(atom, [])
        print(("NOU " if changed else "    ") + q["question"])
        print("   opts", opts, "correct", q["correct"], "=", opts[k], "len", lens[k], "avg_alte", round(avg, 1), "ratio", round(lens[k] / avg, 2))
        print("   hint", q["hint"])
    for kw in ["regula de aur", "2-3", "With Previous", "By Paragraph", "Fade", "Duration", "Motion Paths", "Entrance"]:
        print("   in text:", kw, kw.lower() in txt.lower())
# tag balance
for name, s in (("old", old), ("new", new)):
    for t in ["div", "ul", "ol", "li", "p", "strong", "code", "details"]:
        o = len(re.findall(r"<%s[\s>]" % t, s)); c = len(re.findall(r"</%s>" % t, s))
        if o != c:
            print(name, "dezechilibru", t, o, c)
print("fara diacritice noi (in afara numelor):")
added = re.findall(r"\{\+(.*?)\+\}", open(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls6\lectia4-animatii\diff.txt", encoding="utf-8").read(), re.S)
for a in added:
    for w in re.findall(r"\S*[ăâîșțĂÂÎȘȚ]\S*", a):
        print("  ", w)
