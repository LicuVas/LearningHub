# -*- coding: utf-8 -*-
import io, re, json, sys

PATH = r"C:/00/Projects/LearningHub/content/tic/cls8/m4-html-css/lectia1-structura.html"

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

data = json.loads(io.open(r"C:/00/Projects/LearningHub/_campaign/proba_elevi_2026_09_03/dump_after.json", encoding="utf-8").read())
by_idx = {d["idx"]: d for d in data}

targets = [1, 2, 4, 6, 7, 8, 10]

src = io.open(PATH, encoding="utf-8").read()

pattern_tpl = (
    r'(data-qid="atom-{n}-q0">\s*<div class="atom-question-text">\s*)(.*?)'
    r'(\s*</div>\s*<div class="atom-options">\s*<div class="atom-option" data-answer="a">\s*<span class="option-letter">\s*A\s*</span>\s*<span class="option-text">\s*)(.*?)'
    r'(\s*</span>\s*</div>\s*<div class="atom-option" data-answer="b">\s*<span class="option-letter">\s*B\s*</span>\s*<span class="option-text">\s*)(.*?)'
    r'(\s*</span>\s*</div>\s*<div class="atom-option" data-answer="c">\s*<span class="option-letter">\s*C\s*</span>\s*<span class="option-text">\s*)(.*?)'
    r'(\s*</span>\s*</div>\s*</div>\s*<div class="atom-feedback">\s*</div>\s*<div class="atom-hint" style="display: none;">\s*<span class="hint-icon">\s*\U0001F4A1\s*</span>\s*)(.*?)'
    r'(\s*</div>\s*</div>)'
)

total = 0
for n in targets:
    d = by_idx[n]
    q = esc(d["intrebare"])
    a, b, c = [esc(x) for x in d["variante"]]
    hint = esc(d["indiciu"])
    pat = re.compile(pattern_tpl.format(n=n), re.S)
    def repl(m, q=q, a=a, b=b, c=c, hint=hint):
        return m.group(1) + q + m.group(3) + a + m.group(5) + b + m.group(7) + c + m.group(9) + hint + m.group(11)
    new_src, count = pat.subn(repl, src, count=1)
    if count != 1:
        print("MISS atom", n)
        sys.exit(1)
    src = new_src
    total += 1

io.open(PATH, "w", encoding="utf-8").write(src)
print("synced", total, "atoms")
