import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls7/m1-word-fundamente/lectia6-evaluare.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []; self.stack = []; self.errors = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q.append((d.get("id") or d.get("data-atom-id"), d["data-quiz"]))

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
print("quizzes old/new", len(po.q), len(pn.q))
for (ia, a), (ib, b) in zip(po.q, pn.q):
    ja, jb = json.loads(a), json.loads(b)
    if ja != jb:
        print("DIFF", ia, ib)
        for x, y in zip(ja, jb):
            for k in x:
                if x[k] != y.get(k):
                    print("  ", k, "\n   OLD:", x[k], "\n   NEW:", y.get(k))
    for it in jb:
        L = [len(o) for o in it["options"]]
        ci = "abcd".index(it["correct"])
        others = [l for i, l in enumerate(L) if i != ci]
        if L[ci] > 1.2 * (sum(others) / len(others)):
            print("LONG CORRECT", ib, it["question"][:60], L)
        if re.search(r"\b(varianta|raspunsul)\s+[abc]\b", it.get("hint", ""), re.I):
            print("HINT NAMES LETTER", ib)
# ctrl+a / calibri / font mentions in all quizzes
for i, b in pn.q:
    for it in json.loads(b):
        s = json.dumps(it, ensure_ascii=False)
        if re.search(r"Ctrl\+A|Calibri|Aptos|implicit|Square|legend", s, re.I):
            print("MENTION", i, s)

# tag balance (non-void) on new vs old
VOID = {"br", "img", "meta", "link", "input", "hr", "source", "area", "base", "col", "embed", "wbr"}
def bal(t):
    c = {}
    for m in re.finditer(r"<(/?)([a-zA-Z0-9]+)[^>]*?(/?)>", re.sub(r"<script.*?</script>", "", t, flags=re.S)):
        tag = m.group(2).lower()
        if tag in VOID or m.group(3):
            continue
        c[tag] = c.get(tag, 0) + (-1 if m.group(1) else 1)
    return {k: v for k, v in c.items() if v}
print("balance old", bal(old)); print("balance new", bal(new))
# diacritics
dia = "ăâîșțşţĂÂÎȘȚ"
print("diacritics old/new", sum(old.count(c) for c in dia), sum(new.count(c) for c in dia))
for m in re.finditer(r"[^\n]{0,30}[" + dia + r"][^\n]{0,30}", new):
    if m.group(0) not in old:
        print("  DIA:", m.group(0))
