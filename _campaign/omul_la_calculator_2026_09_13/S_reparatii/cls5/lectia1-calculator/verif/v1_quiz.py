import json, subprocess, re, sys
from html.parser import HTMLParser
sys.stdout.reconfigure(encoding='utf-8')
REL = 'content/tic/cls5/m1-sisteme/lectia1-calculator.html'
REPO = r'C:\00\Projects\LearningHub'
old = subprocess.run(['git', '-C', REPO, 'show', 'HEAD:' + REL], capture_output=True).stdout.decode('utf-8')
new = open(REPO + '\\' + REL.replace('/', '\\'), encoding='utf-8').read()

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.q = {}; s.depth = 0; s.stack = []
        s.text = []; s.in_script = False
    def handle_starttag(s, t, a):
        a = dict(a)
        if t in ('script', 'style'): s.in_script = True
        if 'data-quiz' in a:
            s.q[a.get('id')] = json.loads(a['data-quiz'])
    def handle_endtag(s, t):
        if t in ('script', 'style'): s.in_script = False
    def handle_data(s, d):
        if not s.in_script: s.text.append(d)

po, pn = P(), P()
po.feed(old); pn.feed(new)
for k in pn.q:
    o, n = po.q.get(k), pn.q[k]
    if o != n:
        print('==', k)
        for i, (a, b) in enumerate(zip(o, n)):
            if a != b:
                print(' OLD', i, json.dumps(a, ensure_ascii=False))
                print(' NEW', i, json.dumps(b, ensure_ascii=False))
for k, qs in pn.q.items():
    for i, q in enumerate(qs):
        L = [len(x) for x in q['options']]
        ci = 'abc'.index(q['correct'])
        others = [l for j, l in enumerate(L) if j != ci]
        ratio = L[ci] / (sum(others) / len(others))
        flag = ' LONG' if ratio > 1.2 else ''
        print(k, i, q['correct'], L, round(ratio, 2), flag)
txt = ''.join(pn.text)
print('backslash-quote in visible text:', [m.start() for m in re.finditer(r'\\"', txt)])
for m in re.finditer(r'\\"', txt):
    print('  ...', txt[m.start()-60:m.start()+60].replace('\n', ' '))
print('backslash-quote in raw new outside data-quiz:')
raw = re.sub(r"data-quiz='[^']*'", '', new)
for m in re.finditer(r'\\"', raw):
    print('  ...', raw[m.start()-60:m.start()+40].replace('\n', ' '))
