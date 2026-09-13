# -*- coding: utf-8 -*-
"""POARTA: pentru fiecare assets/js/*.js schimbat fata de HEAD:
 1) HEAD si fisierul nou, dupa maparea ăâîșțĂÂÎȘȚ -> aaistAAIST, sunt IDENTICE octet cu octet;
 2) zero ş/ţ/Ş/Ţ (sedila) in fisierul nou;
 3) node --check exit 0.
Exit 0 doar daca toate trec."""
import subprocess, io, os, sys
REPO = r"C:\00\Projects\LearningHub"
MAP = str.maketrans("ăâîșțĂÂÎȘȚ", "aaistAAIST")
CED = "\u015f\u0163\u015e\u0162"

out = subprocess.run(["git", "-C", REPO, "diff", "--name-only", "--", "assets/js"], capture_output=True, text=True)
files = [x for x in out.stdout.split() if x.endswith('.js')]
if not files:
    print("niciun fisier schimbat"); sys.exit(1)
fail = 0
for rel in files:
    # core.autocrlf=true: blobul din HEAD are LF, copia de lucru CRLF. --filters da forma de checkout
    # (aceeasi ca `git show HEAD:<f>` + conversia EOL a git), deci comparatia ramane octet cu octet.
    head = subprocess.run(["git", "-C", REPO, "cat-file", "--filters", "HEAD:" + rel], capture_output=True).stdout
    raw = subprocess.run(["git", "-C", REPO, "show", "HEAD:" + rel], capture_output=True).stdout
    if raw.replace(b'\r\n', b'\n') != head.replace(b'\r\n', b'\n'):
        print(f"FAIL {rel}: --filters difera de git show dincolo de EOL"); fail += 1; continue
    new = open(os.path.join(REPO, rel.replace('/', os.sep)), 'rb').read()
    hs = head.decode('utf-8').translate(MAP).encode('utf-8')
    ns = new.decode('utf-8').translate(MAP).encode('utf-8')
    same = hs == ns
    ced = sum(new.decode('utf-8').count(c) for c in CED)
    nc = subprocess.run(["node", "--check", os.path.join(REPO, rel.replace('/', os.sep))], capture_output=True, text=True)
    ok = same and ced == 0 and nc.returncode == 0
    detail = ""
    if not same:
        hl, nl = hs.split(b'\n'), ns.split(b'\n')
        for i, (a, b) in enumerate(zip(hl, nl), 1):
            if a != b:
                detail = f" prima diferenta la linia {i}: {a[:120]!r} vs {b[:120]!r}"; break
        else:
            detail = f" nr. linii {len(hl)} vs {len(nl)}"
    print(f"{'OK  ' if ok else 'FAIL'} {rel}: identic_dupa_mapare={same} sedile={ced} node_check={nc.returncode}{detail} {nc.stderr.strip()[:200]}")
    fail += not ok
print(f"POARTA: {len(files) - fail}/{len(files)} fisiere trec")
sys.exit(1 if fail else 0)
