import json, subprocess, re
from html.parser import HTMLParser

REPO = r"C:\00\Projects\LearningHub"
REL = "content/tic/cls7/m1-word-fundamente/lectia2-formatare-text.html"


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.quizzes = {}
        self.stack = []
        self.rendered = {}  # qid -> {"q":..., "opts":{}, "hint":...}
        self.cur = None
        self.field = None
        self.buf = []
        self.depth = 0
        self.tags = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.append(tag)
        if "data-quiz" in a:
            self.quizzes[a.get("id")] = json.loads(a["data-quiz"])
        if "data-qid" in a:
            self.cur = a["data-qid"]
            self.rendered[self.cur] = {"q": "", "opts": {}, "hint": ""}
        cls = a.get("class", "")
        if self.cur:
            if "atom-question-text" in cls:
                self.field = ("q", None); self.buf = []; self.depth = len(self.tags)
            elif "atom-option" in cls and "data-answer" in a:
                self.optkey = a["data-answer"]
            elif "option-text" in cls:
                self.field = ("o", self.optkey); self.buf = []; self.depth = len(self.tags)
            elif "hint" in cls and "icon" not in cls:
                self.field = ("h", None); self.buf = []; self.depth = len(self.tags)

    def handle_endtag(self, tag):
        if self.field and len(self.tags) == self.depth:
            txt = " ".join("".join(self.buf).split())
            k, o = self.field
            if k == "q": self.rendered[self.cur]["q"] = txt
            elif k == "o": self.rendered[self.cur]["opts"][o] = txt
            else: self.rendered[self.cur]["hint"] = txt.replace("💡", "").strip()
            self.field = None
        if self.tags:
            self.tags.pop()

    def handle_data(self, d):
        if self.field:
            self.buf.append(d)


def parse(src):
    p = P(); p.feed(src); return p


old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + REL], capture_output=True).stdout.decode("utf-8")
new = open(REPO + "\\" + REL.replace("/", "\\"), encoding="utf-8").read()
po, pn = parse(old), parse(new)
out = []
for aid in sorted(set(po.quizzes) | set(pn.quizzes)):
    o, n = po.quizzes.get(aid), pn.quizzes.get(aid)
    if o != n:
        out.append(f"== {aid} SCHIMBAT\nOLD {json.dumps(o, ensure_ascii=False)}\nNEW {json.dumps(n, ensure_ascii=False)}")
        for q in n:
            ci = ord(q["correct"]) - 97
            L = [len(x) for x in q["options"]]
            others = [l for i, l in enumerate(L) if i != ci]
            out.append(f"   lungimi {L} corecta={L[ci]} media_altele={sum(others)/len(others):.1f} raport={L[ci]/(sum(others)/len(others)):.2f}")
        qid = aid + "-q0"
        r = pn.rendered.get(qid)
        q = n[0]
        opts = {chr(97 + i): x for i, x in enumerate(q["options"])}
        out.append(f"   randat_vs_json: q={r['q']==q['question']} opts={r['opts']==opts} hint={r['hint']==q['hint']}")
        if r["opts"] != opts: out.append(f"   RANDAT {r}")
# nesting sanity
out.append(f"quizuri vechi={len(po.quizzes)} noi={len(pn.quizzes)}")
open(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\cls7\lectia2-formatare-text\verif\v_quiz.txt", "w", encoding="utf-8").write("\n".join(out))
print("\n".join(out))
