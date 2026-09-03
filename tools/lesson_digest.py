# -*- coding: utf-8 -*-
"""Scoate SUBSTANTA unei lectii (sau a unui lot de lectii) intr-o forma compacta,
ca sa poata fi judecata fara a cara HTML brut.

Uz:
    python tools/lesson_digest.py <folder-modul> [--from N] [--to M]
    python tools/lesson_digest.py content/tic/cls7/m1-word-fundamente --from 0 --to 6

Scoate, per lectie: titlul, obiectivul, ce va sti elevul, titlurile si textul atomilor,
chestionarele (intrebare + variante + raspuns corect + indiciu), exercitiile,
si cifrele structurale (marime, atomi, chestionare AFISABILE sau nu, exercitii, navigare).
"""
import os, re, sys, json, html
from html.parser import HTMLParser

ROOT = r"C:\00\Projects\LearningHub"


class QuizGrab(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.q = []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k == "data-quiz" and v:
                self.q.append(v)


def visible(s):
    s = re.sub(r"<script.*?</script>|<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<br\s*/?>|</p>|</li>|</h[1-6]>|</div>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n\s*\n+", "\n", s)
    return s.strip()


def grab(s, pattern, limit=None, flags=re.S):
    out = [re.sub(r"\s+", " ", visible(m)).strip() for m in re.findall(pattern, s, flags)]
    out = [o for o in out if o]
    return out[:limit] if limit else out


def digest(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    name = os.path.basename(path)
    L = []
    title = grab(s, r'class="lesson-title"[^>]*>(.*?)</h1>', 1)
    sub = grab(s, r'class="lesson-subtitle"[^>]*>(.*?)</p>', 1)
    L.append("### %s" % name)
    L.append("TITLU: %s" % (title[0] if title else "(fara)"))
    if sub:
        L.append("SUBTITLU: %s" % sub[0][:200])

    # cifre structurale
    n_atoms = len(re.findall(r'class="atom(?:\s[^"]*)?"', s))
    n_qdata = s.count("data-quiz=")
    n_qbox = len(re.findall(r'class="[^"]*\batom-quiz\b', s))
    n_ex = len(re.findall(r"practice-exercise", s, re.I))
    txt = visible(s)
    L.append("CIFRE: %d KB text vizibil | %d atomi | %d chestionare scrise | %d containere (0 = NU SE AFISEAZA) | %d exercitii"
             % (len(txt) // 1024, n_atoms, n_qdata, n_qbox, n_ex))

    # cadru
    for label, pat in [("OBIECTIV", r'class="[^"]*(?:goal|obiectiv|frame-goal)[^"]*"[^>]*>(.*?)</div>'),
                       ("VEI PUTEA", r'class="[^"]*(?:outcomes|objectives)[^"]*"[^>]*>(.*?)</(?:ul|div)>')]:
        g = grab(s, pat, 1)
        if g:
            L.append("%s: %s" % (label, g[0][:420]))

    # atomi: titlu + continut
    titles = grab(s, r'class="atom-title"[^>]*>(.*?)</h3>')
    bodies = grab(s, r'class="atom-content"[^>]*>(.*?)(?=<div class="atom"|</section>|$)')
    for i, t in enumerate(titles):
        body = bodies[i][:900] if i < len(bodies) else ""
        L.append("  ATOM %d — %s" % (i + 1, t))
        if body:
            L.append("     %s" % body)

    # chestionare
    p = QuizGrab()
    try:
        p.feed(s)
    except Exception:
        pass
    for i, raw in enumerate(p.q, 1):
        try:
            data = json.loads(raw)
        except Exception:
            L.append("  CHESTIONAR %d: !! JSON STRICAT !!" % i)
            continue
        if isinstance(data, dict):
            data = [data]
        for q in data:
            if not isinstance(q, dict):
                continue
            opts = q.get("options") or []
            c = q.get("correct")
            idx = ord(str(c).lower()) - 97 if isinstance(c, str) and len(c) == 1 else -1
            L.append("  Q%d: %s" % (i, re.sub(r"\s+", " ", str(q.get("question", "")))[:260]))
            for j, o in enumerate(opts):
                mark = " <== CORECT" if j == idx else ""
                L.append("      %s) %s%s" % ("abcd"[j] if j < 4 else j, str(o)[:150], mark))
            h = str(q.get("hint", ""))
            if h:
                L.append("      indiciu: %s" % re.sub(r"\s+", " ", h)[:220])

    # exercitii
    ex = grab(s, r'class="practice-exercise"[^>]*>(.*?)(?=<div class="practice-exercise"|</section>)', 6)
    for i, e in enumerate(ex, 1):
        L.append("  EXERCITIU %d: %s" % (i, e[:300]))

    return "\n".join(L)


if __name__ == "__main__":
    d = sys.argv[1].replace("/", os.sep)
    full = d if os.path.isabs(d) else os.path.join(ROOT, d)
    a, b = 0, 999
    if "--from" in sys.argv:
        a = int(sys.argv[sys.argv.index("--from") + 1])
    if "--to" in sys.argv:
        b = int(sys.argv[sys.argv.index("--to") + 1])
    files = sorted(f for f in os.listdir(full) if re.match(r"lectia", f) and f.endswith(".html"))
    print("## MODUL: %s   (%d lectii, se arata %d..%d)" % (sys.argv[1], len(files), a, min(b, len(files))))
    idx = os.path.join(full, "index.html")
    if os.path.exists(idx):
        it = visible(open(idx, encoding="utf-8", errors="replace").read())
        print("## PAGINA DE MODUL (index): %s" % re.sub(r"\s+", " ", it)[:700])
    for f in files[a:b]:
        print("")
        print(digest(os.path.join(full, f)))
