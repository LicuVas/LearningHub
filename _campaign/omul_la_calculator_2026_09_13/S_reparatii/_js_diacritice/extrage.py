# -*- coding: utf-8 -*-
"""Extrage literalele de sir din assets/js/*.js care contin cuvinte romanesti fara diacritice.
Iesire: candidati.txt (fisier:linie | tip | text)."""
import os, re, sys, io

JS = r"C:\00\Projects\LearningHub\assets\js"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "candidati.txt")

# forme ASCII care in romana au (aproape mereu) diacritice, sau ambigue de decis
WORDS = set("""
sa si ca in inca daca inteles intelege intelegi inveti invata invatat invatare lectia lectiei lectii lectie
raspuns raspunsul raspunsuri raspunde raspunsurile raspunsului urmator urmatorul urmatoarea urmatoare inapoi copiaza copiat
felicitari atentie incorect corect gresit incearca incercare incercari intrebare intrebarea intrebari intrebarii
pasi pasii toti toate aceasta acesta asta ai esti fii poti trebuie verifica verificare selecteaza alege apasa
blocheaza deblocat blocat continua inceput incepe incepi ramas progres nivel puncte punctaj scor
completeaza completat terminat felicitari bravo exercitiu exercitii exercitiul practica sarcina sarcini
obiectivele obiective obiectiv notiuni notiune baza siguranta aplicatii retine retineti
mai tau ta tale tai dupa pana fara intre catre fata fiecare niciun nicio
""".split())

DIAC = re.compile("[\u0103\u00e2\u00ee\u0219\u021b\u0102\u00c2\u00ce\u0218\u021a\u015f\u0163\u015e\u0162]")
WORD = re.compile(r"[A-Za-z]+")

def tokens(src):
    """yield (line, kind, text) for string literals. kind in ' \" `"""
    i, n, line = 0, len(src), 1
    prev_sig = ''  # last significant non-space char, for regex detection
    tpl_stack = []  # brace depth stack for template ${}
    depth = 0
    while i < n:
        c = src[i]
        if c == '\n':
            line += 1; i += 1; continue
        if c in ' \t\r':
            i += 1; continue
        if c == '/' and i + 1 < n and src[i+1] == '/':
            j = src.find('\n', i); i = n if j < 0 else j; continue
        if c == '/' and i + 1 < n and src[i+1] == '*':
            j = src.find('*/', i + 2); j = n if j < 0 else j + 2
            line += src.count('\n', i, j); i = j; continue
        if c in '\'"':
            j = i + 1; start_line = line
            while j < n and src[j] != c:
                if src[j] == '\\': j += 1
                elif src[j] == '\n': line += 1
                j += 1
            yield (start_line, c, src[i+1:j]); i = j + 1; prev_sig = 'a'; continue
        if c == '`' or (c == '}' and tpl_stack and tpl_stack[-1] == depth):
            if c == '}':
                tpl_stack.pop()
            j = i + 1; start_line = line
            while j < n and src[j] != '`' and not (src[j] == '$' and j + 1 < n and src[j+1] == '{'):
                if src[j] == '\\': j += 1
                elif src[j] == '\n': line += 1
                j += 1
            yield (start_line, '`', src[i+1:j])
            if j < n and src[j] == '$':
                tpl_stack.append(depth); i = j + 2
                prev_sig = '('
            else:
                i = j + 1; prev_sig = 'a'
            continue
        if c == '/' and prev_sig in '(,=:[!&|?{};+-*%<>~^' :
            j = i + 1; incls = False
            while j < n and src[j] != '\n':
                if src[j] == '\\': j += 2; continue
                if src[j] == '[': incls = True
                elif src[j] == ']': incls = False
                elif src[j] == '/' and not incls: break
                j += 1
            yield (line, '/', src[i+1:j]); i = j + 1; prev_sig = 'a'; continue
        if c == '{': depth += 1
        elif c == '}': depth -= 1
        if c.isalnum() or c in '_$':
            j = i
            while j < n and (src[j].isalnum() or src[j] in '_$'): j += 1
            w = src[i:j]
            prev_sig = '(' if w in ('return', 'typeof', 'case', 'in', 'of', 'else', 'do') else 'a'
            i = j; continue
        prev_sig = c if c not in ')]' else 'a'
        i += 1

def main():
    out = []
    for f in sorted(os.listdir(JS)):
        if not f.endswith('.js'): continue
        src = io.open(os.path.join(JS, f), encoding='utf-8').read()
        for ln, kind, text in tokens(src):
            ws = [w.lower() for w in WORD.findall(text)]
            hits = [w for w in ws if w in WORDS]
            if hits or (DIAC.search(text) and kind != '/'):
                out.append(f"{f}:{ln} |{kind}| {text[:220]}")
    io.open(OUT, 'w', encoding='utf-8').write("\n".join(out) + "\n")
    rest = [l for l in out if not l.startswith('now-data')]
    base = os.path.dirname(OUT)
    fara = [l for l in rest if not DIAC.search(l)]
    io.open(os.path.join(base, 'cand_fara.txt'), 'w', encoding='utf-8').write("\n".join(fara) + "\n")
    io.open(os.path.join(base, 'cand_cu.txt'), 'w', encoding='utf-8').write("\n".join(l for l in rest if DIAC.search(l)) + "\n")
    print('fara diacritice (fara now-data):', len(fara))
    print(len(out), "candidati ->", OUT)

main()
