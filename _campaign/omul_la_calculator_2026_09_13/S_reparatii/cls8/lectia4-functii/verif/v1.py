import json, re, subprocess, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls8/m1-excel-fundamente/lectia4-functii.html"
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.q = []; s.stack = []; s.err = []
    def handle_starttag(s, t, a):
        d = dict(a)
        if "data-quiz" in d:
            s.q.append((d.get("id"), json.loads(d["data-quiz"])))
        if t not in ("br", "img", "input", "meta", "link", "hr"):
            s.stack.append(t)
    def handle_endtag(s, t):
        if t in s.stack:
            while s.stack and s.stack[-1] != t:
                s.err.append("neinchis " + s.stack.pop())
            s.stack.pop()
        else:
            s.err.append("inchidere fara deschidere " + t + " @" + str(s.getpos()))

for name, src in (("VECHI", old), ("NOU", new)):
    p = P(); p.feed(src)
    print("=====", name, "erori html:", p.err[:10], "stack rest:", p.stack[-5:])
    for aid, qs in p.q:
        for q in qs:
            lens = [len(o) for o in q["options"]]
            ci = "abcd".index(q["correct"])
            others = [l for i, l in enumerate(lens) if i != ci]
            print(aid, "|", q["question"], "|", q["options"], "| key", q["correct"], "| lens", lens,
                  "ratio %.2f" % (lens[ci] / (sum(others) / len(others))), "| hint:", q["hint"])

# formule cu virgula/punct-virgula ramase in text nou
txt = re.sub(r"<[^>]+>", "", new)
import html as h
txt = h.unescape(txt)
print("===== formule cu mai multe argumente in NOU")
for m in re.finditer(r"=[A-Z]+\([^)]*[,;][^)]*\)", txt):
    ln = txt[:m.start()].count("\n") + 1
    print(ln, m.group(0))
print("===== zecimale cu punct in NOU (text)")
for m in re.finditer(r"\b\d+\.\d+\b", txt):
    ln = txt[:m.start()].count("\n") + 1
    print(ln, txt[max(0, m.start()-40):m.end()+20].replace("\n", " "))
print("===== diacritice in NOU vs VECHI")
dia = re.compile(r"[ăâîșțşţĂÂÎȘȚ]")
print("vechi", len(dia.findall(re.sub(r"<script.*?</script>|<style.*?</style>", "", old, flags=re.S))),
      "nou", len(dia.findall(re.sub(r"<script.*?</script>|<style.*?</style>", "", new, flags=re.S))))
for m in dia.finditer(new):
    print("  ", new[max(0, m.start()-30):m.end()+10].replace("\n", " "))
print("caseta count", new.count("Calculatorul tau poate fi setat diferit"))
