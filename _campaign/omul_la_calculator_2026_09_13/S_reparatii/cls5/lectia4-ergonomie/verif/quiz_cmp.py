import json, subprocess, sys, re
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls5/m1-sisteme/lectia4-ergonomie.html"

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "data-quiz" in a:
            self.q[a.get("id")] = json.loads(a["data-quiz"])

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
for name, src in (("OLD", old), ("NEW", new)):
    p = P(); p.feed(src)
    print("=====", name)
    for k, qs in p.q.items():
        for q in qs:
            opts = q["options"]; ci = ord(q["correct"]) - 97
            others = [len(o) for i, o in enumerate(opts) if i != ci]
            avg = sum(others) / len(others)
            print(k, "|", q["question"])
            for i, o in enumerate(opts):
                print("   ", chr(97 + i), ("*" if i == ci else " "), len(o), o)
            print("    hint:", q["hint"])
            print("    corect/medie = %d/%.1f ratio %.2f %s" % (len(opts[ci]), avg, len(opts[ci]) / avg, "PESTE 20%" if len(opts[ci]) > 1.2 * avg else "ok"))
            if re.search(r"\b[abcd]\)|varianta [abcd]\b|litera", q["hint"], re.I):
                print("    !! hint numeste litera?")

# grep resturi
for pat in ["pasi", "90°", "Perfect!", "Corect!", "Excelent!", "Exact!", "reminder", "4-6", "8+", "salut", "garantat", "departen", "Pasul 1", "Indiciu", "tabel", "ergon", "nomos", "45-60", "Postura Corecta", "120"]:
    hits = [ (i+1, l.strip()[:160]) for i, l in enumerate(new.splitlines()) if pat.lower() in l.lower()]
    print("GREP", repr(pat), len(hits))
    for h in hits[:8]:
        print("   ", h)
