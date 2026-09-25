"""Oracolul TRAGERII DE COLȚ: formula din D2 e trasă cu AutoFill în Excel-ul adevărat (COM, invizibil) în jos
până la D5 și la dreapta până la G2; formula ajunsă la capăt se compară cu ce dă simulatorul (JocFoaie.shift).
Ultima linie: numărul de diferențe."""
import json
import subprocess
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

AICI = Path(__file__).resolve().parent
MOTOR = AICI.parents[1] / "jocuri" / "_motor" / "tip-foaie.js"
SURSE = ["=B2*C2", "=B2*$F$1", "=B2*F$1", "=B2*$F1", "=$B2*C$1", "=SUM(B2:C2)", "=SUM($B$2:B2)", "=AVERAGE(A1:A3)",
         "=IF(B2>=5,\"admis\",\"respins\")", "=(B2+C2)/2", "=B2&\"-\"&C2", "=COUNTIF($B$2:$B$9,\">=5\")", "=A1+Z1", "=B2*0.19"]


def excel():
    import win32com.client
    xl = win32com.client.DispatchEx("Excel.Application"); xl.Visible = False; xl.DisplayAlerts = False
    out = {}
    try:
        wb = xl.Workbooks.Add(); sh = wb.Worksheets(1)
        for f in SURSE:
            sh.Range("D2:G5").Clear()
            sh.Range("D2").Formula = f
            sh.Range("D2").AutoFill(sh.Range("D2:D5"))
            jos = sh.Range("D5").Formula
            sh.Range("D2").AutoFill(sh.Range("D2:G2"))
            dr = sh.Range("G2").Formula
            out[f] = {"jos": jos, "dreapta": dr}
        wb.Close(False)
    finally:
        xl.Quit()
    return out


NODE = r"""
const fs=require('fs');global.window={};global.JocMotor={expandRange:()=>[]};
eval(fs.readFileSync(process.argv[2],'utf8'));
const surse=JSON.parse(fs.readFileSync(0,'utf8'));const o={};
for(const f of surse)o[f]={jos:window.JocFoaie.shift(f,3,0),dreapta:window.JocFoaie.shift(f,0,3)};
process.stdout.write(JSON.stringify(o));
"""


def simulator():
    js = AICI / "_umplere.js"; js.write_text(NODE, encoding="utf-8")
    r = subprocess.run(["node", str(js), str(MOTOR)], input=json.dumps(SURSE), capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit(r.stderr[:400])
    return json.loads(r.stdout)


def main():
    xl, sim = excel(), simulator()
    dif = 0
    for f in SURSE:
        for k in ("jos", "dreapta"):
            ok = xl[f][k] == sim[f][k]
            dif += not ok
            print(("  ok   " if ok else "  RĂU  ") + "%-34s %-8s Excel: %-34s simulator: %s" % (f, k, xl[f][k], sim[f][k]))
    print(dif)


if __name__ == "__main__":
    main()
