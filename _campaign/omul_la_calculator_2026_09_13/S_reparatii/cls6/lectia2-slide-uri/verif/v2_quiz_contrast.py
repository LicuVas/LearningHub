import json, subprocess, sys, re, io
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls6/m1-prezentari/lectia2-slide-uri.html"
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = io.open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.q = {}; s.stack = []; s.errs = []; s.levels = []
    def handle_starttag(s, tag, a):
        d = dict(a)
        if "data-quiz" in d:
            s.q[d.get("id")] = json.loads(d["data-quiz"])
        if d.get("class") == "practice-exercise":
            s.levels.append(d.get("data-level"))
        if tag not in ("br", "img", "meta", "link", "input", "hr", "source", "wbr"):
            s.stack.append((tag, s.getpos()))
    def handle_startendtag(s, tag, a):
        pass
    def handle_endtag(s, tag):
        if s.stack and s.stack[-1][0] == tag:
            s.stack.pop(); return
        # find
        for i in range(len(s.stack) - 1, -1, -1):
            if s.stack[i][0] == tag:
                s.errs.append(("unclosed", s.stack[i + 1:], s.getpos())); del s.stack[i:]; return
        s.errs.append(("stray end", tag, s.getpos()))

def parse(t):
    p = P(); p.feed(t); return p
po, pn = parse(old), parse(new)
print("tags open at end old/new:", len(po.stack), len(pn.stack), [x[0] for x in pn.stack][:10])
print("errs old:", len(po.errs), "new:", len(pn.errs))
for e in pn.errs[:10]: print("  NEW ERR", e)
print("levels old:", po.levels, "new:", pn.levels)
L = "abcdefgh"
for name, p in (("OLD", po), ("NEW", pn)):
    n = 0
    print("=====", name)
    for aid, qs in p.q.items():
        for q in qs:
            n += 1
            opts = q["options"]; ci = L.index(q["correct"])
            others = [len(o) for i, o in enumerate(opts) if i != ci]
            ratio = len(opts[ci]) / (sum(others) / len(others))
            hint_letter = bool(re.search(r"\b(varianta|raspunsul|litera)\s*[a-d]\b", q["hint"], re.I)) or bool(re.search(r"\(([a-d])\)", q["hint"]))
            print(f"{aid} | {q['question']}\n   opts={opts}\n   correct={q['correct']} -> {opts[ci]!r} ratio={ratio:.2f} hint_letter={hint_letter}\n   hint={q['hint']}")
    print("total", n)

def lum(h):
    h = h.lstrip("#"); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def cr(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True); return (la + 0.05) / (lb + 0.05)
for a, b in [("#dbeafe", "#1e3a8a"), ("#000000", "#dbeafe"), ("#000000", "#1e3a8a"), ("#ffffff", "#1e3a8a"), ("#ffffff", "#dbeafe"), ("#60a5fa", "#3b82f6")]:
    print(f"contrast {a} vs {b} = {cr(a, b):.2f}:1")
# worst point in the middle of the gradient (linear sRGB interpolation, as PowerPoint renders roughly)
def mix(a, b, t):
    a = a.lstrip("#"); b = b.lstrip("#")
    return "#" + "".join(f"{round(int(a[i:i+2],16)*(1-t)+int(b[i:i+2],16)*t):02x}" for i in (0, 2, 4))
for t in (0.25, 0.5, 0.75):
    m = mix("#dbeafe", "#1e3a8a", t)
    print(f"t={t} {m}: negru {cr('#000000', m):.2f}  alb {cr('#ffffff', m):.2f}")
