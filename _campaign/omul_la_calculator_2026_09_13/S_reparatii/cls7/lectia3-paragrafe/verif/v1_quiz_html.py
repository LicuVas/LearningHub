import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls7/m1-word-fundamente/lectia3-paragrafe.html"


class P(HTMLParser):
    VOID = {"br", "img", "meta", "link", "input", "hr", "source", "area", "base", "col", "embed", "param", "track", "wbr"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.quiz = []
        self.stack = []
        self.errors = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.quiz.append(d["data-quiz"])
        if tag not in self.VOID:
            self.stack.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self.stack and self.stack[-1][0] == tag:
            self.stack.pop()
        else:
            self.errors.append((tag, self.getpos(), self.stack[-1] if self.stack else None))
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break


old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL, encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
print("quiz blocks old/new:", len(po.quiz), len(pn.quiz))
same = [json.loads(a) == json.loads(b) for a, b in zip(po.quiz, pn.quiz)]
print("quiz identical per block:", same)
print("tag errors old:", len(po.errors), "new:", len(pn.errors), pn.errors[:5])
print("unclosed at end old/new:", [t for t, _ in po.stack][:10], [t for t, _ in pn.stack][:10])
# glued words / double spaces in new text near changes
for m in re.finditer(r"[a-z]\)[A-Za-z]|\.\.\.\)|\)\)\)|  \(|\( ", new):
    s = new[max(0, m.start() - 40): m.end() + 40].replace("\n", " ")
    print("SUSPECT:", s)
# diacritics count old vs new
dia = "ăâîșțĂÂÎȘȚşţ"
print("diacritics old/new:", sum(old.count(c) for c in dia), sum(new.count(c) for c in dia))
