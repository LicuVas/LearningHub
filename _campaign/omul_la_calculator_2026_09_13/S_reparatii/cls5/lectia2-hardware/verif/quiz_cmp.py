import json, subprocess, sys
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls5/m1-sisteme/lectia2-hardware.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
        self.stack = []
        self.bad = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q[d.get("id")] = json.loads(d["data-quiz"])

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = P(), P()
po.feed(old); pn.feed(new)
for aid in sorted(set(po.q) | set(pn.q)):
    o = po.q.get(aid, []); n = pn.q.get(aid, [])
    print("==", aid, "old", len(o), "new", len(n))
    for i, q in enumerate(n):
        opts = q["options"]; k = ord(q["correct"]) - 97
        corr = opts[k]; others = [len(x) for j, x in enumerate(opts) if j != k]
        avg = sum(others) / len(others)
        print(f"  Q{i}: {q['question']}")
        for j, x in enumerate(opts):
            print(f"     {'*' if j==k else ' '} {chr(97+j)}) {x} [{len(x)}]")
        print(f"     ratio={len(corr)/avg:.2f} hint_has_letter={any(s in q['hint'] for s in ['(a)','(b)','(c)','(d)',' a)',' b)',' c)',' d)','varianta'])}")
        print(f"     hint: {q['hint']}")
        oldmatch = [x for x in sum(po.q.values(), []) if x["question"] == q["question"]]
        if oldmatch:
            om = oldmatch[0]
            print("     same_options:", om["options"] == opts, "same_key:", om["correct"] == q["correct"])
# html balance quick check on changed tags
import re
for name, txt in (("old", old), ("new", new)):
    cnt = {t: (len(re.findall(r"<%s[\s>]" % t, txt)), len(re.findall(r"</%s>" % t, txt))) for t in ["div", "p", "li", "td", "tr", "ol", "strong", "small", "details", "em", "h3"]}
    print(name, cnt)
print("diacritics new-only:", sorted(set(c for c in new if c in "ăâîșțĂÂÎȘȚşţ") - set(c for c in old if c in "ăâîșțĂÂÎȘȚşţ")))
print("count diacr old/new:", sum(c in "ăâîșțĂÂÎȘȚşţ" for c in old), sum(c in "ăâîșțĂÂÎȘȚşţ" for c in new))
