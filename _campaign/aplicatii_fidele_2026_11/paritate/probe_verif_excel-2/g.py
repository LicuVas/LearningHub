import sys, re, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
f = sys.argv[1]; pats = sys.argv[2:]
lines = open(f, encoding='utf-8').read().split('\n')
for p in pats:
    rx = re.compile(p)
    print('### ', p)
    n = 0
    for i, s in enumerate(lines):
        for m in rx.finditer(s):
            a = max(0, m.start() - 110); b = min(len(s), m.end() + 140)
            print(f'{i+1}: …{s[a:b]}…'); n += 1
            if n > 12: break
        if n > 12: break
