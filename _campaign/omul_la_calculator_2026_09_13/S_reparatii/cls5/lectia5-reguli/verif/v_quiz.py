import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls5/m1-sisteme/lectia5-reguli.html"

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

VOID = {"br", "img", "hr", "meta", "link", "input", "source", "wbr", "area", "col", "base", "embed", "param", "track"}

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
        if tag not in VOID:
            self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q[d.get("id")] = json.loads(d["data-quiz"])
    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                if i != len(self.stack) - 1:
                    self.errs.append(("neinchise inainte de </%s>" % tag, self.stack[i + 1:], self.getpos()))
                del self.stack[i:]
                return
        self.errs.append(("inchidere fara deschidere", tag, self.getpos()))

po, pn = P(), P()
po.feed(old); pn.feed(new)
print("HTML nou: erori", len(pn.errs), pn.errs[:5], "ramase", pn.stack[-5:])
print("HTML vechi: erori", len(po.errs), "ramase", po.stack[-5:])
for aid in sorted(set(po.q) | set(pn.q)):
    qo, qn = po.q.get(aid, []), pn.q.get(aid, [])
    for i in range(max(len(qo), len(qn))):
        a = qo[i] if i < len(qo) else None
        b = qn[i] if i < len(qn) else None
        if a == b:
            continue
        print("\n==", aid, "q", i + 1)
        for k in ("question", "options", "correct", "hint"):
            if (a or {}).get(k) != (b or {}).get(k):
                print("  VECHI", k, ":", (a or {}).get(k))
                print("  NOU  ", k, ":", (b or {}).get(k))
        if b:
            opts = b["options"]
            idx = ord(b["correct"]) - 97
            c = len(opts[idx]); others = [len(o) for j, o in enumerate(opts) if j != idx]
            m = sum(others) / len(others)
            print("  lungime corecta %d, media altora %.1f, raport %.2f" % (c, m, c / m))
            if re.search(r"\b(varianta|raspunsul)\s+[a-d]\b", b["hint"], re.I):
                print("  !! indiciul numeste litera")
# cuvinte lipite / diacritice noi
plain_new = re.sub(r"<[^>]+>", " ", new)
for w in ["Corect!", "Perfect!", "Exact!", "M3uC", "Test_Organizare", "Reguli_Laborator", "tranjand", "dosap", "profesormeaintine", "20 de elevi"]:
    print(w, new.count(w))
dia_old = len(re.findall(r"[ăâîșțşţĂÂÎȘȚ]", old)); dia_new = len(re.findall(r"[ăâîșțşţĂÂÎȘȚ]", new))
print("diacritice vechi", dia_old, "noi", dia_new)
for m in re.finditer(r"\S*[ăâîșțşţĂÂÎȘȚ]\S*", new):
    print("  diac:", m.group(0))
