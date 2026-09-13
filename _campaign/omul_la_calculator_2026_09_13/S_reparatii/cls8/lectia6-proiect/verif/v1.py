import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls8/m1-excel-fundamente/lectia6-proiect.html"
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

class P(HTMLParser):
    VOID = {"br", "img", "input", "meta", "link", "hr", "source", "wbr"}
    def __init__(s):
        super().__init__(convert_charrefs=True); s.quiz = []; s.stack = []; s.err = []; s.inblock = False; s.block = ""
    def handle_starttag(s, t, a):
        d = dict(a)
        if "data-quiz" in d: s.quiz.append(json.loads(d["data-quiz"]))
        if t not in s.VOID: s.stack.append((t, s.getpos()))
        if t == "div" and d.get("class") == "code-block": s.inblock = True
    def handle_endtag(s, t):
        if t in s.VOID: return
        if s.stack and s.stack[-1][0] == t: s.stack.pop()
        else: s.err.append((t, s.getpos(), s.stack[-1] if s.stack else None))
        if t == "div": s.inblock = False
    def handle_data(s, d):
        if s.inblock and not s.block: s.block = d

po, pn = P(), P()
po.feed(old); pn.feed(new)
print("quiz old==new:", po.quiz == pn.quiz, len(po.quiz), len(pn.quiz))
print("tag errors old/new:", len(po.err), len(pn.err), pn.err[:5], "unclosed new:", [x for x in pn.stack][:5], "old:", po.stack[:5])

# data block: rebuild numbers, compare numerically to old
def rows(b, dec):
    out = []
    for ln in b.strip().splitlines()[1:]:
        parts = ln.split("\t")
        out.append([float(x.replace(dec, ".")) for x in parts[2:6]])
    return out
ro, rn = rows(po.block, "."), rows(pn.block, ",")
print("block numeric identical:", ro == rn, len(rn))
means_subj = [round(sum(r[i] for r in rn) / 10, 3) for i in range(4)]
means_st = [round(sum(r) / 4, 3) for r in rn]
print("subject means:", means_subj, "min/max ratio", min(means_subj) / max(means_subj))
print("student means:", means_st, "count>=7:", sum(m >= 7 for m in means_st))
# correct option length rule for all quizzes (info only)
for q in pn.quiz:
    for it in q:
        k = "abcd".index(it["correct"]); opts = it["options"]
        oth = [len(o) for i, o in enumerate(opts) if i != k]
        if len(opts[k]) > 1.2 * sum(oth) / len(oth): print("LONG correct:", it["question"][:60])
# new diacritics outside glossary names
dia = re.compile("[ăâîșțĂÂÎȘȚşţ]")
ol = set(old.splitlines())
for i, ln in enumerate(new.splitlines(), 1):
    if ln not in ol and dia.search(ln):
        words = sorted(set(w for w in re.findall(r"\w+", ln) if dia.search(w)))
        print("diacritics line", i, words)
