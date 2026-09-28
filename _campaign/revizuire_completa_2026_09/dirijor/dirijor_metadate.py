# Caută în fișierele Office de descărcat din /lectii/ metadate cu nume de persoane (autor, ultima modificare, companie).
# Folosire: python dirijor_metadate.py [--curata]   (fără --curata doar raportează)
import re
import shutil
import sys
import zipfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
RAD = Path(r"C:/00/Projects/LearningHub/lectii")
CAMPURI = ("dc:creator", "cp:lastModifiedBy", "Company", "Manager", "dc:title", "cp:keywords", "dc:description")
curata = "--curata" in sys.argv
probleme = 0
for f in sorted(list(RAD.rglob("*.docx")) + list(RAD.rglob("*.pptx")) + list(RAD.rglob("*.xlsx"))):
    if any(p in ("_proba", "_verificare") for p in f.parts):
        continue
    with zipfile.ZipFile(f) as z:
        gasit = {}
        for nume in ("docProps/core.xml", "docProps/app.xml"):
            if nume in z.namelist():
                x = z.read(nume).decode("utf-8", "replace")
                for c in CAMPURI:
                    m = re.search(r"<%s[^>]*>([^<]*)</%s>" % (re.escape(c), re.escape(c)), x)
                    if m and m.group(1).strip():
                        gasit[c] = m.group(1).strip()
    rel = f.relative_to(RAD)
    if gasit.get("dc:creator") or gasit.get("cp:lastModifiedBy") or gasit.get("Company") or gasit.get("Manager"):
        probleme += 1
        print(f"NUME ÎN METADATE: {rel} -> {gasit}")
        if curata:
            tmp = f.with_suffix(f.suffix + ".tmp")
            with zipfile.ZipFile(f) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
                for it in zin.infolist():
                    data = zin.read(it.filename)
                    if it.filename in ("docProps/core.xml", "docProps/app.xml"):
                        s = data.decode("utf-8")
                        for c in ("dc:creator", "cp:lastModifiedBy", "Company", "Manager"):
                            s = re.sub(r"(<%s[^>]*>)[^<]*(</%s>)" % (re.escape(c), re.escape(c)), r"\1\2", s)
                        data = s.encode("utf-8")
                    zout.writestr(it, data)
            shutil.move(str(tmp), str(f))
            print(f"  curățat: {rel}")
    else:
        print(f"ok: {rel} {gasit}")
print(f"fișiere cu nume în metadate: {probleme}")
print(probleme)
