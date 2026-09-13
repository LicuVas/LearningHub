import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls5/m1-sisteme/lectia3-software.html"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.depth_tags = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "data-quiz" in a:
            self.q[a.get("id")] = json.loads(a["data-quiz"])


def load(text):
    p = P(); p.feed(text); return p.q

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
qo, qn = load(old), load(new)
for k in sorted(set(qo) | set(qn)):
    print("==", k, "old", len(qo.get(k, [])), "new", len(qn.get(k, [])))
    for i, q in enumerate(qn.get(k, [])):
        opts = q["options"]
        ci = ord(q["correct"]) - 97
        others = [len(o) for j, o in enumerate(opts) if j != ci]
        ratio = len(opts[ci]) / (sum(others) / len(others))
        match = [ (ok, oi) for ok in qo for oi, oq in enumerate(qo[ok]) if oq["question"] == q["question"]]
        same = None
        if match:
            oq = qo[match[0][0]][match[0][1]]
            same = {f: oq[f] == q[f] for f in ("options", "correct")}
            hint_diff = (oq["hint"], q["hint"]) if oq["hint"] != q["hint"] else "same"
        print(f"  q{i+1}: {q['question'][:70]} | correct={q['correct']} valid={0<=ci<len(opts)} ratio={ratio:.2f} from={match} same={same}")
        print("     hint:", q["hint"])
        print("     hasLetter:", bool(re.search(r"\b(varianta|raspunsul)\s+[abcd]\b", q["hint"], re.I)), "Corect!" in q["hint"])
# tag balance check on changed areas
from collections import Counter
class T(HTMLParser):
    def __init__(self):
        super().__init__(); self.st=[]; self.err=[]
    VOID={"br","img","meta","link","input","hr","source","wbr"}
    def handle_starttag(self, t, a):
        if t not in self.VOID: self.st.append((t,self.getpos()))
    def handle_endtag(self, t):
        if t in self.VOID: return
        if self.st and self.st[-1][0]==t: self.st.pop()
        else:
            self.err.append((t,self.getpos(), self.st[-1] if self.st else None))
            for i in range(len(self.st)-1,-1,-1):
                if self.st[i][0]==t: del self.st[i:]; break
for name, txt in (("old", old), ("new", new)):
    t=T(); t.feed(txt); print(name, "tag errors:", len(t.err), t.err[:5], "unclosed:", t.st[:5])
