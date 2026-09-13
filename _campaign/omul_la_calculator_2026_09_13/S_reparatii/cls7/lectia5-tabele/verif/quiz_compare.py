import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
PATH = "content/tic/cls7/m1-word-fundamente/lectia5-tabele.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.depth = []
        self.tags = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'data-quiz' in a:
            self.q[a.get('id')] = json.loads(a['data-quiz'])
    def handle_endtag(self, tag):
        pass

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + PATH], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + PATH.replace("/", "\\"), encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
print("atoms old", len(po.q), "new", len(pn.q))
for k in pn.q:
    for i, (a, b) in enumerate(zip(po.q.get(k, []), pn.q[k])):
        L = [len(o) for o in b["options"]]
        ci = "abc".index(b["correct"])
        others = [l for j, l in enumerate(L) if j != ci]
        ratio = L[ci] / (sum(others) / len(others))
        flag = "" if a == b else "  CHANGED"
        print(k, b["correct"], L, "ratio=%.2f" % ratio, flag)
        if a != b:
            print("  OLD:", json.dumps(a, ensure_ascii=False))
            print("  NEW:", json.dumps(b, ensure_ascii=False))

# tag balance check on changed text: count some tags
for t in ["p", "strong", "div", "br", "details", "summary", "a"]:
    oc = len(re.findall(r"<%s[\s>/]" % t, old)), len(re.findall(r"</%s>" % t, old))
    nc = len(re.findall(r"<%s[\s>/]" % t, new)), len(re.findall(r"</%s>" % t, new))
    print(t, "old open/close", oc, "new", nc)
# ids unchanged
print("ids same:", re.findall(r'id="([^"]+)"', old) == re.findall(r'id="([^"]+)"', new))
print("title same:", re.findall(r"<title>.*?</title>", old, re.S) == re.findall(r"<title>.*?</title>", new, re.S))
print("scripts same:", re.findall(r"<script.*?</script>", old, re.S) == re.findall(r"<script.*?</script>", new, re.S))
print("style same:", re.findall(r"<style.*?</style>", old, re.S) == re.findall(r"<style.*?</style>", new, re.S))
# new diacritics outside glossary names
import difflib
ow = re.findall(r"\S+", old); nw = re.findall(r"\S+", new)
sm = difflib.SequenceMatcher(None, ow, nw, autojunk=False)
added = []
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op in ("insert", "replace"):
        added += nw[j1:j2]
dia = sorted(set(w for w in added if re.search(r"[ăâîșşțţĂÂÎȘŞȚŢ]", w)))
print("added words with diacritics:", dia)
