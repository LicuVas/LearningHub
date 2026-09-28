# Lista „Recent” din Word / Excel / PowerPoint ale profesorului: listează (fără --sterge) sau scoate (cu --sterge)
# DOAR intrările lăsate de probele campaniei (căi sub LearningHub\lectii\...\_proba sau \_verificare, sau în Temp\claude).
# Nu atinge nicio altă intrare. Cu --sterge: rulează doar cu aplicațiile ÎNCHISE (altfel le rescriu la ieșire).
# Ultima linie = numărul de intrări găsite (după --sterge: numărul scoase).
import subprocess
import sys
import winreg

sys.stdout.reconfigure(encoding="utf-8")
APLICATII = {"Word": "WINWORD.EXE", "Excel": "EXCEL.EXE", "PowerPoint": "POWERPNT.EXE"}
MARCI = ("\\lectii\\", "\\_campaign\\", "\\temp\\claude\\", "learninghub_banc")


def e_de_proba(v):
    s = str(v).lower()
    return any(m in s for m in MARCI) and ("\\_proba" in s or "\\_verificare" in s or "\\temp\\claude\\" in s
                                             or "\\_campaign\\" in s or "learninghub_banc" in s)


def ruleaza(exe):
    r = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {exe}", "/NH"], capture_output=True, text=True)
    return exe.upper() in r.stdout.upper()


sterge = "--sterge" in sys.argv
gasite = 0
for app, exe in APLICATII.items():
    if sterge and ruleaza(exe):
        print(f"{app}: rulează acum ({exe}) — NU șterg (l-ar rescrie la ieșire)")
        continue
    base = rf"Software\Microsoft\Office\16.0\{app}\User MRU"
    try:
        h = winreg.OpenKey(winreg.HKEY_CURRENT_USER, base)
    except OSError:
        continue
    i = 0
    while True:
        try:
            sub = winreg.EnumKey(h, i)
        except OSError:
            break
        i += 1
        for kind in ("File MRU", "Place MRU"):
            cale = base + "\\" + sub + "\\" + kind
            try:
                k = winreg.OpenKey(winreg.HKEY_CURRENT_USER, cale, 0, winreg.KEY_READ | winreg.KEY_SET_VALUE)
            except OSError:
                continue
            vals, j = [], 0
            while True:
                try:
                    vals.append(winreg.EnumValue(k, j))
                except OSError:
                    break
                j += 1
            for n, v, _t in vals:
                if e_de_proba(v):
                    gasite += 1
                    coada = str(v).split("*")[-1][-90:]
                    print(f"{app} · {kind} · {n}: …{coada}")
                    if sterge:
                        winreg.DeleteValue(k, n)
print(("scoase: " if sterge else "găsite: ") + str(gasite))
print(gasite)
