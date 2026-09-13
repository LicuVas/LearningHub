"""ctx.py <file_index 0-3> word1 word2 ... -> prints every context (tag-stripped) of each NEW word in the file."""
import sys, re, html
REPO = "C:/00/Projects/LearningHub/"
FILES = [
    "content/tic/cls6/m1-prezentari/lectia5-tranzitii.html",
    "content/tic/cls8/m1-excel-fundamente/lectia7-sortare.html",
    "content/tic/cls5/m1-sisteme/lectia1-calculator.html",
    "content/tic/cls7/m1-word-fundamente/lectia5-tabele.html",
]
sys.stdout.reconfigure(encoding="utf-8")
lines = open(REPO + FILES[int(sys.argv[1])], encoding="utf-8").read().splitlines()
for w in sys.argv[2:]:
    pat = re.compile(r"(?<![\wăâîșț])" + re.escape(w) + r"(?![\wăâîșț])")
    for i, l in enumerate(lines, 1):
        t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", l)))
        for m in pat.finditer(t):
            print(f"[{w}] L{i}: …{t[max(0, m.start()-55):m.end()+45]}…")
