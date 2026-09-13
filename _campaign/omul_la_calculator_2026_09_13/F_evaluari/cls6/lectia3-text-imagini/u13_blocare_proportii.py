"""U13 / a doua cale pentru afirmatia lectiei „imaginile isi pastreaza singure proportiile la tragerea de colt (PowerPoint 2013+)”.
Microsoft Support (surse/raw/dimensiune_en.txt) spune: „press and hold Shift while you drag a corner sizing handle”.
Explicatia alternativa: PowerPoint bifeaza implicit „Lock aspect ratio” (Blocare raport aspect) pentru imagini, adica
XML-ul <a:picLocks noChangeAspect="1"/> pe fiecare p:pic. Observatia care le deosebeste: in fisiere .pptx salvate de
PowerPoint (app.xml = Microsoft Office PowerPoint), cate imagini au noChangeAspect="1"?
Se citesc DOAR atribute XML si numele aplicatiei (nu textul documentelor, care sunt ale altor oameni). Iesire: u13_iesire.json."""
import json
import re
import subprocess
import zipfile
from pathlib import Path

L = Path(__file__).resolve().parent
lista = subprocess.run(["es.exe", "-n", "300", "ext:pptx"], capture_output=True, text=True).stdout.splitlines()
rez = {"fisiere_verificate": 0, "fisiere_powerpoint": 0, "imagini": 0, "imagini_cu_noChangeAspect": 0,
       "pe_versiune_app": {}}
for p in lista:
    try:
        z = zipfile.ZipFile(p)
        app = z.read("docProps/app.xml").decode("utf-8", "replace") if "docProps/app.xml" in z.namelist() else ""
    except Exception:  # noqa: BLE001
        continue
    rez["fisiere_verificate"] += 1
    m = re.search(r"<Application>(.*?)</Application>", app)
    v = re.search(r"<AppVersion>(.*?)</AppVersion>", app)
    if not m or "PowerPoint" not in m.group(1):
        continue
    rez["fisiere_powerpoint"] += 1
    ver = v.group(1) if v else "?"
    st = rez["pe_versiune_app"].setdefault(ver, {"imagini": 0, "cu_blocare": 0})
    for n in z.namelist():
        if not re.match(r"ppt/slides/slide\d+\.xml$", n):
            continue
        x = z.read(n).decode("utf-8", "replace")
        for pic in re.findall(r"<p:pic>.*?</p:pic>", x, re.S):
            rez["imagini"] += 1
            st["imagini"] += 1
            if re.search(r'noChangeAspect="1"', pic):
                rez["imagini_cu_noChangeAspect"] += 1
                st["cu_blocare"] += 1
    if rez["fisiere_powerpoint"] >= 60:
        break
(L / "u13_iesire.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
print({k: rez[k] for k in ("fisiere_verificate", "fisiere_powerpoint", "imagini", "imagini_cu_noChangeAspect")})
print(sorted(rez["pe_versiune_app"].items())[:12])
