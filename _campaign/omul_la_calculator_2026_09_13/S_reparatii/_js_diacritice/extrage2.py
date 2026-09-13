# -*- coding: utf-8 -*-
"""Linii sursa cu text natural in literale de sir (candidati pentru diacritice). -> linii.txt"""
import os, re, io, sys, importlib.util
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('ex', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extrage_lib.py'))

JS = r"C:\00\Projects\LearningHub\assets\js"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "linii.txt")

src_lib = io.open(os.path.join(HERE, 'extrage.py'), encoding='utf-8').read().split('def main():')[0]
ns = {'__file__': os.path.join(HERE, 'extrage.py')}
exec(compile(src_lib, 'extrage.py', 'exec'), ns)
tokens, WORDS = ns['tokens'], ns['WORDS']

fd = io.open(r"C:\00\Projects\LearningHub\tools\lhqa\fix_diacritics.py", encoding='utf-8').read()
m = re.search(r"WORD_MAP = \{(.*?)\n\}", fd, re.S)
WM = set(re.findall(r'"([a-zA-Z]+)"\s*:', m.group(1)))
ALLW = {w.lower() for w in WM} | WORDS

NAT = re.compile(r"[A-Za-z]{2,}[ ,.!?:]+[A-Za-z]{2,}")
CSS = re.compile(r"^\s*[-a-z]+\s*:\s*[^;]*;\s*$|^\s*[.#@a-z][-\w .#:>,\[\]=\"()*]*\{\s*$|^\s*\}\s*$")

res = []
for f in sorted(os.listdir(JS)):
    if not f.endswith('.js') or f == 'now-data.js':
        continue
    src = io.open(os.path.join(JS, f), encoding='utf-8').read()
    lines = src.split('\n')
    flagged = {}
    for ln, kind, text in tokens(src):
        if kind == '/':
            continue
        for k, part in enumerate(text.split('\n')):
            p = re.sub(r"<[^>]*>", " ", part)
            p = re.sub(r"&#?\w+;", " ", p)
            if CSS.match(part):
                continue
            ws = [w.lower() for w in re.findall(r"[A-Za-z]+", p)]
            if NAT.search(p) or any(w in ALLW for w in ws):
                flagged[ln + k] = True
    for ln in sorted(flagged):
        L = lines[ln - 1]
        if 'console.' in L:
            continue
        res.append(f"{f}:{ln}: {L.strip()[:300]}")
io.open(OUT, 'w', encoding='utf-8').write("\n".join(res) + "\n")
print(len(res), '->', OUT)
