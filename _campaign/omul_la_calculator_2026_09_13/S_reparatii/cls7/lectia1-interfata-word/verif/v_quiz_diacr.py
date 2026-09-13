import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\00\Projects\LearningHub"
CALE = "content/tic/cls7/m1-word-fundamente/lectia1-interfata-word.html"
old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + CALE], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + CALE.replace("/", "\\"), encoding="utf-8").read()

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
    def handle_endtag(self, tag):
        pass

def quizzes(s):
    p = P(); p.feed(s); return p.q

qo, qn = quizzes(old), quizzes(new)
print("atomi quiz old/new", len(qo), len(qn))
for k in qn:
    a, b = qo.get(k), qn[k]
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            print("==", k, i)
            print(" OLD", json.dumps(x, ensure_ascii=False))
            print(" NEW", json.dumps(y, ensure_ascii=False))
        L = [len(o) for o in y["options"]]
        ci = "abcd".index(y["correct"])
        rest = [l for j, l in enumerate(L) if j != ci]
        ratio = L[ci] / (sum(rest) / len(rest))
        flag = " <-- LUNGA" if ratio > 1.2 else ""
        if re.search(r"\b(varianta|raspunsul)\s+[abc]\b", y["hint"], re.I):
            flag += " <-- HINT LITERA"
        print(f"  {k} corect={y['correct']} lung={L} ratio={ratio:.2f}{flag}")

# HTML quiz vs data-quiz coerenta: optiunile vizibile
blocks = re.findall(r'data-qid="(atom-\d+)-q0">(.*?)</div>\s*</div>\s*</div>', new, re.S)
for qid, body in blocks:
    vis = [re.sub(r"<[^>]+>", "", t) for t in re.findall(r'class="option-text">(.*?)</span>', body, re.S)]
    import html as H
    vis = [H.unescape(v).strip() for v in vis]
    dq = [o for o in qn[qid][0]["options"]]
    qt = H.unescape(re.search(r'atom-question-text">(.*?)</div>', body, re.S).group(1)).strip()
    hint = re.search(r'atom-hint.*?</span>(.*?)</div>', body, re.S)
    hint = H.unescape(hint.group(1)).strip() if hint else None
    ok = vis == dq and qt == qn[qid][0]["question"] and hint == qn[qid][0]["hint"]
    if not ok:
        print("NEPOTRIVIRE HTML vs data-quiz", qid, vis, dq, qt == qn[qid][0]["question"], hint, "|", qn[qid][0]["hint"])
print("coerenta html/data-quiz verificata pe", len(blocks))

# diacritice adaugate: randuri noi cu diacritice
DI = set("ăâîșțşţĂÂÎȘȚ")
def cuv(s):
    return re.findall(r"[\wăâîșțşţĂÂÎȘȚ]+", s)
wo = {}
for w in cuv(old):
    if DI & set(w): wo[w] = wo.get(w, 0) + 1
wn = {}
for w in cuv(new):
    if DI & set(w): wn[w] = wn.get(w, 0) + 1
print("cuvinte cu diacritice NOI (numar new - old):")
for w in sorted(wn):
    d = wn[w] - wo.get(w, 0)
    if d > 0: print("  ", w, d)

# etichete: echilibru div/p/strong/li/details
for t in ["div", "p", "strong", "li", "ol", "details", "em", "code", "span", "ul"]:
    o1 = len(re.findall(r"<%s[\s>]" % t, new)); c1 = len(re.findall(r"</%s>" % t, new))
    o0 = len(re.findall(r"<%s[\s>]" % t, old)); c0 = len(re.findall(r"</%s>" % t, old))
    if (o1 - c1) != (o0 - c0): print("DEZECHILIBRU", t, o0, c0, o1, c1)
print("echilibru etichete verificat")
# cuvinte lipite: litera mica urmata de Majuscula fara spatiu in text nou, sau ')' urmat de litera
txt = re.sub(r"<[^>]+>", " ", new)
for m in re.finditer(r"[a-z][A-Z][a-z]{2,}|\)[A-Za-z]|[a-z]\((?!s\))", txt):
    ctx = txt[max(0, m.start()-30):m.end()+30].replace("\n", " ")
    if ctx not in txt.replace(new, ""):
        pass
lip_n = set(re.findall(r"\S*(?:[a-z][A-Z][a-z]{2,}|\)[A-Za-z])\S*", re.sub(r"<[^>]+>", " ", new)))
lip_o = set(re.findall(r"\S*(?:[a-z][A-Z][a-z]{2,}|\)[A-Za-z])\S*", re.sub(r"<[^>]+>", " ", old)))
print("posibile lipiri noi:", sorted(lip_n - lip_o))
# glosar: Fișier etc. termeni RO noi
for t in ["Proiectare tabel", "Aspect tabel", "Imagine", "imagini online", "Stiluri", "Salvați o copie", "Fișier", "riglă", "Borduri și umbrire"]:
    print("apare", t, new.count(t))
