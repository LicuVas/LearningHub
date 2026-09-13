import json, re, subprocess, sys
from html.parser import HTMLParser
from collections import Counter

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls8/m1-excel-fundamente/lectia3-formule.html"
sys.stdout.reconfigure(encoding="utf-8")

old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()

class P(HTMLParser):
    VOID = {"br","img","hr","input","meta","link","source","area","col","wbr"}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = {}; self.c = Counter(); self.text = []
    def handle_starttag(self, t, a):
        d = dict(a)
        if t not in self.VOID: self.c[t] += 1
        if "data-quiz" in d: self.q[d.get("id")] = json.loads(d["data-quiz"])
    def handle_endtag(self, t):
        if t not in self.VOID: self.c[t] -= 1
    def handle_data(self, x): self.text.append(x)

po, pn = P(), P()
po.feed(old); pn.feed(new)
print("tag balance old:", {k:v for k,v in po.c.items() if v})
print("tag balance new:", {k:v for k,v in pn.c.items() if v})
for aid in pn.q:
    o, n = po.q.get(aid), pn.q[aid]
    if o == n: print(aid, "UNCHANGED"); continue
    for i, qq in enumerate(n):
        opts = qq["options"]; k = ord(qq["correct"]) - 97
        corr = opts[k]; rest = [len(x) for j, x in enumerate(opts) if j != k]
        ratio = len(corr) / (sum(rest) / len(rest))
        letter = re.search(r"\b(varianta|raspunsul)\s+[a-d]\b|\b[a-d]\)", qq["hint"], re.I)
        print(f"--- {aid} q{i} key={qq['correct']} valid={0<=k<len(opts)} ratio_len={ratio:.2f} letter_in_hint={bool(letter)}")
        print("  Q:", qq["question"]); print("  O:", opts); print("  H:", qq["hint"])
        if o: print("  OLD Q:", o[i]["question"] if i < len(o) else None)

# diacritics in added text
diff = open(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls8\lectia3-formule\diff.txt", encoding="utf-8").read()
added = " ".join(re.findall(r"\{\+(.*?)\+\}", diff, re.S))
print("diacritice in adaugiri:", set(re.findall(r"[ăâîșțşţĂÂÎȘȚ]", added)))
# glued words in visible text
t = re.sub(r"\s+", " ", " ".join(pn.text))
print("lipite (litera=litera / cifra+litera suspecte):", re.findall(r"[a-z]=[A-Z0-9]|[a-z]{3}=[a-z]", t)[:10])
print("drag handle ramas:", new.lower().count("drag handle"), "| Corect!/Exact!:", len(re.findall(r"Corect!|Exact!", new)))

# independent numbers
m = {"Ana": (9,8,10), "Ion": (7,6,8), "Maria": (10,10,9)}
tot = {k: sum(v) for k, v in m.items()}
print("misiune totals", tot, "SUM", sum(tot.values()), "medii", {k: round(v/3, 6) for k, v in tot.items()})
ex1 = {"Ana": (8,7,9,6), "Ion": (10,9,8,10), "Maria": (6,7,5,8), "Radu": (9,9,10,9), "Elena": (7,8,6,7)}
print("ex1", {k: (sum(v), sum(v)/4) for k, v in ex1.items()})
B = {1: 28, 2: "Pret/elev", 3: 45, 4: 120, 5: 35, 6: 15, 7: 20}
fara = {}
for r in range(3, 8):
    a, b = B[r], B[r-2]
    fara[r] = "#VALUE!" if isinstance(b, str) else a*b
print("ex2 fara $", fara, "cu $", {r: B[r]*28 for r in range(3, 8)}, sum(B[r]*28 for r in range(3, 8)), sum(B[r]*25 for r in range(3, 8)))
tva = {1: 0.21, 2: 5, 3: 3, 4: 8}
print("tva fara $: C3", tva[3]*tva[2], "C4", tva[4]*tva[3])
print("ordine", 10-3+2, 10-(3+2), 20-8/2, (20-8)/2, 9+7+8/3, (9+7+8)/3, 12/4)
