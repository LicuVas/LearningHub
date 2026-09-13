import re, html, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")
F = r"C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente\lectia6-proiect.html"
def norm(t):
    t = html.unescape(re.sub(r"<[^>]+>", " ", t)); return re.sub(r"\s+", " ", t).strip().lower()
new = norm(open(F, encoding="utf-8").read())
old = norm(subprocess.run(["git", "-C", r"C:\00\Projects\LearningHub", "show", "HEAD:content/tic/cls8/m1-excel-fundamente/lectia6-proiect.html"], capture_output=True).stdout.decode("utf-8"))
for name, src, keys in (("OLD", old, ["g4: =average", "popescu ion 7.50", "countif(g4", "merge & center", "page layout →", "tab-ul insert", "catalog_clasa8", "catalog_complet_numeletau.xlsx"]),
                        ("NEW", new, ["countif(g4", "structura: =if", "îmbinare", "aspect pagină (page layout) →", "column chart (in", "fila inserare (insert) → sectiunea", "clasa_nume_catalog", "clasa_nume_catalogcomplet"])):
    print("----", name)
    for k in keys:
        m = re.search(re.escape(k), src)
        print(k, "=>", src[max(0, m.start() - 30):m.start() + 160] if m else None)
