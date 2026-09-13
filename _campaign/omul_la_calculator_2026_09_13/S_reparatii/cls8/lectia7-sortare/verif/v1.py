import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls8/m1-excel-fundamente/lectia7-sortare.html"
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.stack = []
        self.errs = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q[d.get("id")] = json.loads(d["data-quiz"])

def quizzes(s):
    p = P(); p.feed(s); return p.q

qo, qn = quizzes(old), quizzes(new)
for k in qn:
    if qo.get(k) != qn[k]:
        for a, b in zip(qo.get(k, []), qn[k]):
            print("==", k)
            print(" OLD", json.dumps(a, ensure_ascii=False))
            print(" NEW", json.dumps(b, ensure_ascii=False))
            opts = b["options"]; ci = ord(b["correct"]) - 97
            others = [len(o) for i, o in enumerate(opts) if i != ci]
            print(" len correct", len(opts[ci]), "avg others", sum(others) / len(others), "ratio", len(opts[ci]) / (sum(others) / len(others)))
            print(" hint names letter?", bool(re.search(r"\b(varianta|raspunsul)\s+[a-d]\b", b["hint"], re.I)))

# tag balance on new file (simple)
class B(HTMLParser):
    VOID = {"br", "img", "meta", "link", "input", "hr", "source", "area", "base", "col", "embed", "param", "track", "wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True); self.st = []; self.err = []
    def handle_starttag(self, t, a):
        if t not in self.VOID: self.st.append((t, self.getpos()))
    def handle_endtag(self, t):
        if t in self.VOID: return
        if self.st and self.st[-1][0] == t: self.st.pop()
        else:
            self.err.append((t, self.getpos(), self.st[-1] if self.st else None))
            for i in range(len(self.st) - 1, -1, -1):
                if self.st[i][0] == t: del self.st[i:]; break
for name, s in (("old", old), ("new", new)):
    b = B(); b.feed(s); print(name, "tag errors", len(b.err), b.err[:5], "unclosed", len(b.st))

# data model
names = ["Maria", "Andrei", "Elena", "Bogdan", "Carla", "Dan"]
notes = [8, 6, 9, 5, 7, 10]
cls = ["8A", "8B", "8A", "8B", "8A", "8B"]
rows = list(zip(names, notes, cls))
print("two-level:", sorted(rows, key=lambda r: (r[2], -r[1])))
# bonus without undo: after step2 A-Z on names, step3 Z-A on notes
st = sorted(zip(names, notes), key=lambda r: r[0]); st = sorted(st, key=lambda r: -r[1])
print("after step3:", st)
# partial sort only column B
for d, lab in ((False, "asc"), (True, "desc")):
    nb = sorted(notes, reverse=d)
    same = [n for n, o, x in zip(names, notes, nb) if o == x]
    print("partial", lab, list(zip(names, nb)), "unchanged rows:", same, "sum", sum(nb))
# insertion check
print("A-Z names:", sorted(names))
