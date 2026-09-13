import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls5/m1-sisteme/lectia6-proiect.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.tags = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "data-quiz" in a:
            self.q[a.get("id")] = json.loads(a["data-quiz"])

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
for aid in sorted(set(po.q) | set(pn.q)):
    o, n = po.q.get(aid, []), pn.q.get(aid, [])
    print("=====", aid, len(o), "->", len(n))
    for i, q in enumerate(n):
        opts = q["options"]; k = "abcd".index(q["correct"])
        others = [len(x) for j, x in enumerate(opts) if j != k]
        ratio = len(opts[k]) / (sum(others) / len(others))
        print(f"  Q{i+1}: {q['question'][:90]!r}")
        for j, x in enumerate(opts):
            print(f"     {'*' if j==k else ' '} {'abcd'[j]}) {x} ({len(x)})")
        print(f"     ratio={ratio:.2f} hint={q['hint']!r}")
        same = [qq for qq in o if qq["question"] == q["question"]]
        if same and same[0] != q:
            for f in ("options", "correct", "hint"):
                if same[0][f] != q[f]:
                    print(f"     CHANGED {f}: OLD={same[0][f]!r}")
        elif not same:
            print("     NEW/MOVED here")

# tag balance on new file (simple)
class B(HTMLParser):
    VOID = {"br","img","input","meta","link","hr","source","area","col","wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True); self.st=[]; self.err=[]
    def handle_starttag(self, t, a):
        if t not in self.VOID: self.st.append((t, self.getpos()))
    def handle_endtag(self, t):
        if t in self.VOID: return
        if self.st and self.st[-1][0]==t: self.st.pop()
        else: self.err.append((t, self.getpos(), self.st[-1] if self.st else None))
for name, src in (("old", old), ("new", new)):
    b = B(); b.feed(src)
    print(name, "unbalanced end tags:", len(b.err), "left open:", len(b.st))

txt = re.sub(r"<[^>]+>", " ", new)
for w in ["Canva", "Shut Down", "CORECT!", "Stocarepe", "executar", "Apeasa", "daunaza", "PDF", "Stocare)", "de mai sus"]:
    print(w, [m.start() for m in re.finditer(re.escape(w), new)][:8])
