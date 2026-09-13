# -*- coding: utf-8 -*-
"""Cuvinte (din literale de sir, fara tag-uri) care NU apar deja in linii.txt - lista unica pentru ochi."""
import os, re, io
HERE = os.path.dirname(os.path.abspath(__file__))
JS = r"C:\00\Projects\LearningHub\assets\js"
src_lib = io.open(os.path.join(HERE, 'extrage.py'), encoding='utf-8').read().split('def main():')[0]
ns = {'__file__': os.path.join(HERE, 'extrage.py')}
exec(compile(src_lib, 'extrage.py', 'exec'), ns)
tokens = ns['tokens']
flag = set()
for l in io.open(os.path.join(HERE, 'linii.txt'), encoding='utf-8'):
    p = l.split(':')
    if len(p) > 2:
        flag.add((p[0], int(p[1])))
words = {}
for f in sorted(os.listdir(JS)):
    if not f.endswith('.js') or f == 'now-data.js':
        continue
    src = io.open(os.path.join(JS, f), encoding='utf-8').read()
    for ln, kind, text in tokens(src):
        if kind == '/':
            continue
        for k, part in enumerate(text.split('\n')):
            if (f, ln + k) in flag:
                continue
            p = re.sub(r"<[^>]*>", " ", part)
            p = re.sub(r"&#?\w+;|\$\{[^}]*\}", " ", p)
            for w in re.findall(r"(?<![\w.#-])[A-Za-z]{3,}(?![\w-])", p):
                words.setdefault(w, f"{f}:{ln + k}")
out = sorted(words.items(), key=lambda x: x[0].lower())
io.open(os.path.join(HERE, 'cuvinte.txt'), 'w', encoding='utf-8').write(" ".join(w for w, _ in out))
io.open(os.path.join(HERE, 'cuvinte_loc.txt'), 'w', encoding='utf-8').write("\n".join(f"{w} {l}" for w, l in out))
print(len(out))
