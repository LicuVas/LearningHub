"""Unește părțile inventarului excel-a (baza, formatare, foi, formule) în paritate/excel-a.json + excel-a.md.
Verifică mecanic: fiecare vechi_dovada există în proba_src și nu e un rând de comentariu."""
import json, pathlib, re, collections

AICI = pathlib.Path(__file__).resolve().parent
P = AICI.parent
SRC = P / "proba_src"
PARTI = ["parte_baza", "parte_formatare", "parte_foi", "parte_formule"]

d = {k: json.load(open(AICI / (k + ".json"), encoding="utf-8")) for k in PARTI}

# simulatorul „formatare” din pagină (JocFormatare: jocuri/excel-viii, jocuri/excel-antrenament-viii): aceleași funcții ca FMT
JF = {"excel-a-FMT016": ("centru", "Aliniere la centru"), "excel-a-FMT011": ("borduri", "Borduri"),
      "excel-a-FMT008": ("umplere", "Culoare de umplere"), "excel-a-FMT030": ("sterge", "Fără formatare")}
JF_DOV = {k: "jocuri/excel-viii/index.html:90" for k in ("centru", "borduri", "umplere", "sterge")}
EX_JF = ["t:'formatare' din jocuri/excel-viii/index.html:442, :455 și jocuri/excel-antrenament-viii/index.html:186, :219 "
         "(mulțimea celulelor cu formatarea = exact zona cerută)"]
for fn in d["parte_formatare"]["functii"]:
    if fn["id"] in JF:
        k, et = JF[fn["id"]]
        fn["unde"] = list(fn.get("unde") or []) + ["jocuri/excel-viii (JocFormatare din pagină)", "jocuri/excel-antrenament-viii (JocFormatare din pagină)"]
        fn["vechi_dovada"] = list(fn["vechi_dovada"]) + [JF_DOV[k], "jocuri/excel-antrenament-viii/index.html:93"]
        if k != "sterge":
            fn["exercitii"] = list(fn.get("exercitii") or []) + EX_JF
            fn["ceruta_de_exercitiu"] = True
        fn["nota"] = (fn.get("nota") or "") + f" · și butonul „{et}” din simulatorul formatare al jocurilor (selecția: clic pe un colț, clic pe colțul opus)"

functii, rau = [], []
for k in PARTI:
    for fn in d[k]["functii"]:
        functii.append(fn)
cache = {}
for fn in functii:
    for v in fn["vechi_dovada"]:
        m = re.match(r"^(.+?):(\d+)$", v.split(" ")[0])
        if not m:
            rau.append((fn["id"], v, "fără :linie"))
            continue
        cale, ln = m.group(1), int(m.group(2))
        if cale not in cache:
            fp = SRC / cale
            cache[cale] = fp.read_text(encoding="utf-8").split("\n") if fp.exists() else None
        L = cache[cale]
        if L is None:
            rau.append((fn["id"], v, "fișier lipsă"))
        elif ln < 1 or ln > len(L):
            rau.append((fn["id"], v, "linie inexistentă"))
        elif re.match(r"^\s*(//|/\*|\*)", L[ln - 1]) or not L[ln - 1].strip():
            rau.append((fn["id"], v, "comentariu/gol: " + L[ln - 1].strip()[:60]))

for i, fn in enumerate(functii, start=1):
    fn["nota"] = ((fn.get("nota") or "").strip() + f" [parte: {fn['id']}]").strip()
    fn["id"] = f"excel-a-F{i:03d}"

fis = collections.OrderedDict()
for k in PARTI:
    for x in d[k]["fisiere_citite"]:
        c = x["cale"]
        n = x.get("linii") or 0
        if not n and (SRC / c).exists():
            n = len((SRC / c).read_text(encoding="utf-8").split("\n"))
        fis[c] = max(fis.get(c, 0), n)
OUT = {"aplicatie": "excel", "eticheta": "excel-a",
       "fisiere_citite": [{"cale": c, "linii": n} for c, n in fis.items()],
       "functii": functii,
       "doar_afisate": sum((d[k].get("doar_afisate") or [] for k in PARTI), []),
       "nesigure": sum((d[k].get("nesigure") or [] for k in PARTI), [])}
json.dump(OUT, open(P / "excel-a.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

c = collections.Counter(fn["biblioteca"] for fn in functii)
print("total", len(functii), dict(c), "dovezi rele:", len(rau))
for r in rau:
    print("  RAU", r)
