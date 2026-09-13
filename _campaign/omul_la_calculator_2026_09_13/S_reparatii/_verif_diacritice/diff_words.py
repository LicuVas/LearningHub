import subprocess, re, html
from collections import OrderedDict, Counter, defaultdict

REPO = "C:/00/Projects/LearningHub"
OUTDIR = r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\S_reparatii\_verif_diacritice"
FILES = [
    "content/tic/cls6/m1-prezentari/lectia5-tranzitii.html",
    "content/tic/cls8/m1-excel-fundamente/lectia7-sortare.html",
    "content/tic/cls5/m1-sisteme/lectia1-calculator.html",
    "content/tic/cls7/m1-word-fundamente/lectia5-tabele.html",
]
WORD = re.compile(r"[A-Za-zăâîșțĂÂÎȘȚşţŞŢ]+")
STRIP = str.maketrans("ăâîșțĂÂÎȘȚşţŞŢ", "aaistAAISTstST")
AMB_OLD = set("ca sa cat fata mana pana e a sau".split())
ASCII_CAND = re.compile(r"\b(si|sa|daca|fara|pana|cand|dupa|poti|esti|apasa|intr|dintr|printr|inca|asa|catre|urmator\w*|urmatoare\w*|atat|stii|invat\w*|incep\w*|inseamna|intai|acelasi|aceeasi|putin|faca|lectie|intrebar\w*|raspuns\w*|exercitii|functii|informatii|aplicatii|tastatura|atentie|asemanator\w*|numarul|numere|diferenta|cauta|gaseste|incearca|ramane|puteti|faceti|stie|obisnuit\w*|urmeaza|pasi|pasul|ultima|sterge|adauga|selecteaza|salveaza|foloseste|folosesti|dispozitive|cati|cate|intotdeauna|niciodata|fiecarui|fiecarei|lucreaza|intelege|intelegi|vazut|apasat)\b")


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s))


def visible(txt):
    v = re.sub(r"<(code|pre|script|style|title|kbd)\b.*?</\1>", lambda m: "\n" * m.group().count("\n"), txt, flags=re.S | re.I)
    v = re.sub(r"<[^>]+>", lambda m: "\n" * m.group().count("\n") if "\n" in m.group() else " ", v)
    return html.unescape(v)


news = {f: open(REPO + "/" + f, encoding="utf-8").read() for f in FILES}
corpus = Counter(w for t in news.values() for w in WORD.findall(t))

out = []
for f in FILES:
    old = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + f], capture_output=True).stdout.decode("utf-8").splitlines()
    new = news[f].splitlines()
    out.append("\n" + "=" * 90 + f"\n{f}  old_lines={len(old)} new_lines={len(new)}")
    pairs = OrderedDict()
    total = 0
    for i, (a, b) in enumerate(zip(old, new)):
        if a == b:
            continue
        wa = [m.group() for m in WORD.finditer(a)]
        wb = [(m.group(), m.start()) for m in WORD.finditer(b)]
        if len(wa) != len(wb):
            out.append(f"  !! line {i+1}: word count mismatch {len(wa)} vs {len(wb)}")
        for x, (y, pos) in zip(wa, wb):
            if x != y:
                total += 1
                ctxline = re.sub(r"\s+", " ", strip_tags(b[max(0, pos - 150):pos + 150]))
                k = ctxline.find(y)
                ctx = ctxline[max(0, k - 40):k + 40] if k >= 0 else ctxline[:80]
                pairs.setdefault((x, y), []).append((i + 1, ctx))
    out.append(f"  TOTAL changed words: {total}; distinct pairs: {len(pairs)}")
    # old ascii forms mapped to >1 new forms
    by_old = defaultdict(set)
    for x, y in pairs:
        by_old[x.lower()].add(y.lower())

    def ambiguous(x, y):
        xl, yl = x.lower(), y.lower()
        if xl in AMB_OLD:
            return True
        if len(by_old[xl]) > 1:
            return True
        if yl.endswith("ă"):
            art = y[:-1] + "a"
            if corpus.get(art) or corpus.get(art.capitalize()) or corpus.get(x):
                return True  # articulated form exists as a word in corpus
        if yl == "în" or yl.startswith("într"):
            return False
        return False

    clear = []
    inctx = []
    out.append("  -- AMBIGUOUS pairs (all contexts) --")
    for (x, y), lst in sorted(pairs.items(), key=lambda kv: kv[0][1].lower()):
        if ambiguous(x, y):
            out.append(f"  {x} -> {y}  x{len(lst)}")
            for ln, c in lst:
                out.append(f"      L{ln}: …{c}…")
        else:
            clear.append(f"{x}>{y}({len(lst)})")
            if y.lower() == "în":
                inctx += lst
    out.append("  -- in->în contexts (English 'in' check) --")
    for ln, c in inctx:
        k = c.find("în")
        out.append(f"      L{ln}: {c[max(0,k-25):k+25]}")
    out.append("  -- CLEAR pairs --")
    for j in range(0, len(clear), 7):
        out.append("   " + "  ".join(clear[j:j + 7]))
    out.append("  -- remaining ASCII candidates (visible text) --")
    changed_old = set(x for x, _ in pairs) - AMB_OLD
    for ln, line in enumerate(visible(news[f]).splitlines(), 1):
        hits = {m.start(): m.group() for m in ASCII_CAND.finditer(line)}
        for w in WORD.finditer(line):
            if w.group() in changed_old:
                hits[w.start()] = w.group()
        for st, g in sorted(hits.items()):
            c = re.sub(r"\s+", " ", line[max(0, st - 40):st + 40])
            out.append(f"      L{ln}: [{g}] …{c}…")

    # generic: ascii visible words whose diacritic twin exists somewhere in the 4 lessons
    twins = defaultdict(set)
    for w in corpus:
        s = w.translate(STRIP)
        if s != w:
            twins[s].add(w)
    SKIP = {"in", "In", "ca", "sa", "a", "e", "tasta", "celula", "pagina", "Tranzitii", "Automata"}
    out.append("  -- ascii words with a diacritic twin in corpus (possible misses) --")
    cnt = Counter(); ex = {}
    for ln, line in enumerate(visible(news[f]).splitlines(), 1):
        for m in WORD.finditer(line):
            g = m.group()
            if g in twins and g not in SKIP:
                cnt[g] += 1
                ex.setdefault(g, []).append(f"L{ln}: …{re.sub(r'\s+', ' ', line[max(0, m.start()-45):m.end()+35])}…")
    for g, n in cnt.most_common():
        out.append(f"   [{g}] x{n} twins={sorted(twins[g])}")
        for e in ex[g][:4]:
            out.append(f"      {e}")

open(OUTDIR + r"\report.txt", "w", encoding="utf-8").write("\n".join(out))
print("ok")
