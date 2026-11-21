"""Extrage exercițiile de tip excelx din paginile vechi (lecțiile VIII) - rezumat pentru inventarul excel-a."""
import re, sys
P = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/proba_src/"
TIP = sys.argv[1] if len(sys.argv) > 1 else "excelx"
pagini = sys.argv[2:] or ["lectii/viii/m1-l02/index.html", "lectii/viii/m1-l04/index.html",
                          "lectii/viii/m1-l05/index.html", "lectii/viii/m4-l23/index.html"]
RQ = re.compile(r"q:'((?:[^'\\]|\\.)*)'")
RV = re.compile(r"verifica:(\{.*?\})(?=,[a-zA-Z]+:|\})")
for pg in pagini:
    txt = open(P + pg, encoding="utf-8").read()
    lines = txt.split("\n")
    print("=====", pg)
    for i, l in enumerate(lines, 1):
        for m in re.finditer(r"t:'%s'" % re.escape(TIP), l):
            s = l[m.start():m.start() + 4000]
            q = RQ.search(s)
            q = re.sub(r"<[^>]+>", "", q.group(1))[:120] if q else ""
            v = RV.search(s)
            v = v.group(1)[:150] if v else ""
            ex = [k for k in ["doarMouse", "teste:", "inainte:", "o:[", "panglica:false", "foi:", "zoom:", "start:", "gresitLipit"] if k in s[:2500]]
            print(f"{i}: Q={q} | V={v} | {ex}")
