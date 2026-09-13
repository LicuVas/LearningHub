import json, subprocess, statistics
from html.parser import HTMLParser

REL = "content/tic/cls8/m1-excel-fundamente/lectia2-date.html"
ROOT = r"C:\00\Projects\LearningHub"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "data-quiz" in d:
            self.q[d.get("id")] = json.loads(d["data-quiz"])


def load(text):
    p = P()
    p.feed(text)
    return p.q


old = subprocess.run(["git", "-C", ROOT, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(ROOT + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
qo, qn = load(old), load(new)
for k in sorted(set(qo) | set(qn)):
    for tag, q in (("OLD", qo.get(k)), ("NEW", qn.get(k))):
        if not q:
            print(k, tag, None)
            continue
        for it in q:
            opts = it["options"]
            ci = ord(it["correct"]) - 97
            others = [len(o) for i, o in enumerate(opts) if i != ci]
            ratio = len(opts[ci]) / statistics.mean(others)
            print(k, tag, "Q:", it["question"])
            for i, o in enumerate(opts):
                print("   ", chr(97 + i), ("*" if i == ci else " "), o)
            print("    key", it["correct"], "ratio %.2f" % ratio, "| hint:", it["hint"][:160])
    print("-" * 60)
