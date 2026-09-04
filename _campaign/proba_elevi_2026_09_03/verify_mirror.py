# -*- coding: utf-8 -*-
import re, json, html as _html, io

path = r"C:/00/Projects/LearningHub/content/tic/cls7/m5-proiecte-recap/lectia2-proiect-prezentare.html"
src = io.open(path, encoding="utf-8").read()

ATTR = re.compile(r"data-quiz=([\"'])(.*?)\1(?=[\s>])", re.S)
quizzes = []
for m in ATTR.finditer(src):
    d = json.loads(_html.unescape(m.group(2)))
    quizzes.extend(d if isinstance(d, list) else [d])

# extract mirror blocks: each atom-quiz div's option-text spans and hint text
BLOCK = re.compile(r'<div class="atom-quiz"[^>]*>(.*?)<div class="atom-hint"[^>]*>(.*?)</div>\s*</div>', re.S)
blocks = BLOCK.findall(src)
OPT = re.compile(r'<span class="option-text">(.*?)</span>', re.S)
HINT = re.compile(r'<span class="hint-icon">[^<]*</span>\s*(.*)', re.S)

print("n quizzes:", len(quizzes), "n blocks:", len(blocks))
for i, (q, (optblock, hintblock)) in enumerate(zip(quizzes, blocks), 1):
    opts_mirror = [_html.unescape(x.strip()) for x in OPT.findall(optblock)]
    hint_m = HINT.search(hintblock)
    hint_mirror = _html.unescape(hint_m.group(1).strip()) if hint_m else None
    opts_data = [str(x) for x in q.get("options", [])]
    hint_data = str(q.get("hint", ""))
    ok = True
    if opts_mirror != opts_data:
        ok = False
        print(f"idx {i} OPTIONS MISMATCH")
        print("  data:  ", opts_data)
        print("  mirror:", opts_mirror)
    if hint_mirror != hint_data:
        ok = False
        print(f"idx {i} HINT MISMATCH")
        print("  data:  ", hint_data)
        print("  mirror:", hint_mirror)
    if ok:
        print(f"idx {i} OK")
