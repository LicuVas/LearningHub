"""ORACOLUL EXCEL (25.09.2026): același set de formule, calculat de Excel-ul ADEVĂRAT (COM, invizibil) și de
simulatorul nostru (jocuri/_motor/tip-foaie.js, prin Node). Orice diferență = simulatorul nu se poartă ca Excel.

  python oracol.py            -> rulează tot, scrie raport.md + rezultate.json lângă el
Ultima linie tipărită: numărul de diferențe (0 = simulatorul dă aceleași rezultate ca Excel pe tot setul).

Excel se deschide într-o instanță SEPARATĂ (DispatchEx), invizibilă, și se închide la final; nu atinge
fereastra Excel a utilizatorului și nici ecranul.
"""
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
SITE = AICI.parents[1]
MOTOR = SITE / "jocuri" / "_motor" / "tip-foaie.js"

# ---------------------------------------------------------------- foaia de date (ca un tabel de clasă)
DATE = {
    "A1": "Elev", "B1": "Nota1", "C1": "Nota2", "D1": "Pret", "E1": "Admis",
    "A2": "Ana", "B2": 8, "C2": 9, "D2": 12.5, "E2": "Da",
    "A3": "Bogdan", "B3": 5, "C3": 4, "D3": 7.25, "E3": "Nu",
    "A4": "Carmen", "B4": 10, "C4": 10, "D4": 0, "E4": "Da",
    "A5": "Dan", "B5": 3, "C5": "", "D5": 19.99, "E5": "nu",
    "A6": "Elena", "B6": 7, "C6": 6.5, "D6": -2, "E6": "",
    "A7": "", "B7": "", "C7": "absent", "D7": 100, "E7": "Da",
    "F2": 0.21, "F3": 1000, "F4": 3, "F5": 0.5,
}

# ---------------------------------------------------------------- formulele (sintaxa englezească, separator „,”)
FORMULE = [
    # aritmetică și ordinea operațiilor
    "=1+2*3", "=(1+2)*3", "=10/4", "=7-10", "=-B2", "=--B2", "=2^3", "=-2^2", "=B2*F2", "=D2*(1+F2)",
    "=10%", "=50%*B2", "=B2%", "=B2/0", "=B2/C5", "=B2+C5", "=B2+C7", "=A2+1", "=B2&C2", "=A2&\" \"&B2",
    "=1/3", "=0.1+0.2", "=D3*4", "=F3*F2", "=B2*C2-D2/F4",
    # comparații și logice
    "=B2>C2", "=B2=8", "=A2=\"ana\"", "=A2<\"Bogdan\"", "=B2<>C2", "=C5=0", "=C5=\"\"", "=E2=\"da\"",
    "=TRUE", "=FALSE", "=TRUE+1", "=AND(B2>5,C2>5)", "=OR(B3>5,C3>5)", "=NOT(B2>5)",
    # SUM / AVERAGE / MIN / MAX / COUNT
    "=SUM(B2:B6)", "=SUM(B2:C6)", "=SUM(C2:C7)", "=SUM(B2,C2,10)", "=SUM(A2:A6)", "=SUM(B7)", "=SUM()",
    "=AVERAGE(B2:B6)", "=AVERAGE(C2:C7)", "=AVERAGE(A2:A6)", "=AVERAGE(B2:C2)", "=AVERAGE(B7:B7)",
    "=MIN(B2:B6)", "=MAX(B2:B6)", "=MIN(C2:C7)", "=MAX(A2:A6)", "=MAX(D2:D7)", "=MIN(D2:D7)",
    "=COUNT(B2:B7)", "=COUNT(C2:C7)", "=COUNT(A1:E7)", "=COUNTA(C2:C7)", "=COUNTA(A2:A7)", "=COUNTA(E2:E7)",
    "=COUNTBLANK(C2:C7)",
    # ROUND și rudele
    "=ROUND(D2*F2,2)", "=ROUND(2.5,0)", "=ROUND(-2.5,0)", "=ROUND(1234.567,-2)", "=ROUND(1/3,3)",
    "=ROUNDUP(1.21,1)", "=ROUNDDOWN(1.29,1)", "=INT(7.9)", "=INT(-7.9)", "=ABS(D6)", "=MOD(10,3)", "=SQRT(16)",
    # IF
    "=IF(B2>=5,\"admis\",\"respins\")", "=IF(B3>=5,\"admis\",\"respins\")", "=IF(B2>9,1)", "=IF(B2,\"da\",\"nu\")",
    "=IF(A2,\"da\",\"nu\")", "=IF(C5,\"da\",\"nu\")", "=IF(B2>=9,\"FB\",IF(B2>=7,\"B\",IF(B2>=5,\"S\",\"I\")))",
    "=IF(E2=\"Da\",D2,0)", "=IF(AND(B2>=5,C2>=5),\"promovat\",\"corigent\")", "=IF(C7>5,1,0)",
    # COUNTIF / SUMIF / AVERAGEIF
    "=COUNTIF(B2:B6,\">=5\")", "=COUNTIF(E2:E7,\"Da\")", "=COUNTIF(E2:E7,\"da\")", "=COUNTIF(B2:B6,8)",
    "=COUNTIF(B2:B6,\"<>8\")", "=COUNTIF(C2:C7,\"\")", "=COUNTIF(E2:E7,\"<>Da\")", "=COUNTIF(A2:A7,\"A*\")",
    "=SUMIF(E2:E7,\"Da\",D2:D7)", "=SUMIF(B2:B6,\">5\")", "=SUMIF(B2:B6,\">5\",C2:C6)",
    "=AVERAGEIF(B2:B6,\">=5\")", "=AVERAGEIF(E2:E7,\"Da\",B2:B7)", "=AVERAGEIF(B2:B6,\">100\")",
    # text (liceu)
    "=LEN(A2)", "=UPPER(A2)", "=LOWER(A3)", "=LEFT(A3,3)", "=CONCATENATE(A2,\"-\",B2)", "=TRIM(\"  a  b \")",
    # erori și sintaxă greșită
    "=SUMA(B2:B6)", "=MEDIE(B2:B6)", "=XYZ(1)", "=B2*", "=(B2+1", "=B2:B6", "=\"text\"*2",
    # procente și bani, ca în exercițiile de VIII
    "=D2*F2", "=D2+D2*F2", "=ROUND(D3*(1+F2),2)", "=B2/SUM(B2:B6)", "=MAX(B2:B6)-MIN(B2:B6)",
    "=SUM(B2:B6)/COUNT(B2:B6)", "=AVERAGE(B2:B6,C2:C6)", "=B2*$F$2", "=SUM($B$2:B4)",
    # SET NEFOLOSIT LA REPARAȚII (control: prinde „potrivirea pe test”)
    "=2+3^2*2", "=(2+3)^2", "=-B2^2", "=2^-1", "=10-2-3", "=100/10/2", "=B2&\"\"", "=\"Nota: \"&B2*2",
    "=A2&B7&\"!\"", "=1&2+3", "=(1&2)+3", "=A2>5", "=\"10\">5", "=E6=\"\"", "=E6=0", "=B7>=0", "=TRUE=1",
    "=AND(TRUE,1)", "=AND(B2:C2)", "=OR(B7,C7)", "=AND(A2:A3)", "=NOT(0)", "=NOT(C5)",
    "=IF(B6>=7,\"B\",\"\")", "=IF(C5=\"\",\"lipsa\",C5)", "=IF(TRUE,1,2)", "=IF(B2>5,IF(C2>8,\"a\",\"b\"),\"c\")",
    "=IF(OR(E3=\"Nu\",B3<5),\"atentie\",\"ok\")", "=IF(E7,\"da\",\"nu\")",
    "=COUNTIF(A2:A7,\"?n?\")", "=COUNTIF(A2:A7,\"*a*\")", "=COUNTIF(D2:D7,\"<0\")", "=COUNTIF(D2:D7,\">=12.5\")",
    "=COUNTIF(C2:C7,\"absent\")", "=SUMIF(A2:A7,\"*n*\",B2:B7)", "=AVERAGEIF(D2:D7,\"<>0\")", "=COUNTIF(E2:E7,\"<>\")",
    "=ROUNDUP(-1.21,1)", "=ROUNDDOWN(-1.29,1)", "=ROUNDUP(12.5,-1)", "=ROUND(0.125,2)", "=ROUND(2.675,2)",
    "=MOD(-10,3)", "=MOD(10,-3)", "=MOD(7.5,2)", "=INT(0.99)", "=ABS(-0)", "=SQRT(2)", "=SQRT(-1)", "=POWER(2,10)",
    "=LEN(\"\")", "=LEN(B2)", "=UPPER(B2)", "=LEFT(A2,10)", "=RIGHT(A3,3)", "=RIGHT(A2,0)", "=MID(A3,2,3)",
    "=CONCATENATE(B2,C2)", "=TRIM(A2)", "=LEFT(A3)", "=COUNTBLANK(A1:E7)", "=MAX(B7:C7)", "=MIN(E2:E7)",
    "=SUM(E2:E7)", "=AVERAGE(D2:D7)", "=COUNT(E2:E7)", "=SUM(B2:B6)*F2", "=ROUND(AVERAGE(B2:C6),2)",
]


# ---------------------------------------------------------------- Excel adevărat
ERORI_COM = {-2146826281: "#DIV/0!", -2146826246: "#N/A", -2146826259: "#NAME?", -2146826288: "#NULL!",
             -2146826252: "#NUM!", -2146826265: "#REF!", -2146826273: "#VALUE!"}


def excel_real():
    import win32com.client
    import pywintypes
    xl = win32com.client.DispatchEx("Excel.Application")
    xl.Visible = False
    xl.DisplayAlerts = False
    info = {}
    rez = {}
    try:
        wb = xl.Workbooks.Add()
        sh = wb.Worksheets(1)
        for a, v in DATE.items():
            sh.Range(a).Value = v if v != "" else None
        info["versiune"] = xl.Version
        try:
            info["limba_interfata"] = xl.LanguageSettings.LanguageID(2)   # msoLanguageIDUI
        except Exception:
            info["limba_interfata"] = "?"
        intl = xl.International   # prin COM vine ca listă (indicii Excel pornesc de la 1)
        intl = intl if isinstance(intl, (list, tuple)) else [intl]
        info["separator_lista"] = intl[4] if len(intl) > 4 else "?"     # xlListSeparator = 5
        info["separator_zecimal"] = intl[2] if len(intl) > 2 else "?"   # xlDecimalSeparator = 3
        cel = sh.Range("H1")
        # cum arată pe PC-ul ăsta numele locale (FormulaLocal) și textul erorilor
        cel.Formula = "=SUM(1,2)"; info["SUM_local"] = cel.FormulaLocal
        cel.Formula = "=IF(1>0,1,0)"; info["IF_local"] = cel.FormulaLocal
        cel.Formula = "=1/0"; info["text_eroare_div0"] = cel.Text
        cel.Formula = "=XYZ(1)"; info["text_eroare_nume"] = cel.Text
        cel.Formula = "=TRUE"; info["text_TRUE"] = cel.Text
        for i, f in enumerate(FORMULE):
            try:
                cel.Formula = f
                v = cel.Value
                t = cel.Text
                if isinstance(v, int) and v in ERORI_COM:
                    rez[f] = {"tip": "eroare", "v": ERORI_COM[v], "text": t}
                elif isinstance(v, bool):
                    rez[f] = {"tip": "bool", "v": v, "text": t}
                elif isinstance(v, (int, float)):
                    rez[f] = {"tip": "num", "v": float(v), "text": t}
                elif v is None:
                    rez[f] = {"tip": "num", "v": 0.0, "text": t}
                else:
                    rez[f] = {"tip": "text", "v": str(v), "text": t}
            except pywintypes.com_error:
                rez[f] = {"tip": "refuzat", "v": "Excel refuză formula (greșeală de scriere)"}
        wb.Close(False)
    finally:
        xl.Quit()
    return info, rez


# ---------------------------------------------------------------- simulatorul nostru (Node)
NODE = r"""
const fs=require('fs');global.window={};
function expandRange(a,b){const pa=a.match(/^([A-Z])(\d+)$/),pb=(b||a).match(/^([A-Z])(\d+)$/),out=[];
  const c1=Math.min(pa[1].charCodeAt(0),pb[1].charCodeAt(0)),c2=Math.max(pa[1].charCodeAt(0),pb[1].charCodeAt(0));
  const r1=Math.min(+pa[2],+pb[2]),r2=Math.max(+pa[2],+pb[2]);
  for(let c=c1;c<=c2;c++)for(let r=r1;r<=r2;r++)out.push(String.fromCharCode(c)+r);return out}
global.JocMotor={expandRange};
eval(fs.readFileSync(process.argv[2],'utf8'));
const inp=JSON.parse(fs.readFileSync(0,'utf8'));const get=a=>a in inp.date?inp.date[a]:'';const out={};
for(const f of inp.formule){try{const v=window.JocFoaie.evaluate(f,get);
  out[f]=typeof v==='boolean'?{tip:'bool',v}:typeof v==='number'?{tip:'num',v}:{tip:'text',v:String(v)}}
  catch(e){out[f]={tip:'eroare',v:e.show||'#EROARE',mesaj:e.message}}}
process.stdout.write(JSON.stringify(out));
"""


def simulator():
    js = AICI / "_ruleaza_motor.js"
    js.write_text(NODE, encoding="utf-8")
    r = subprocess.run(["node", str(js), str(MOTOR)], input=json.dumps({"date": DATE, "formule": FORMULE}),
                       capture_output=True, text=True, encoding="utf-8")
    if r.returncode:
        sys.exit("Motorul nu a rulat: " + r.stderr[:500])
    return json.loads(r.stdout)


# ---------------------------------------------------------------- comparația
ECHIV_ERORI = {"#VALOARE": "#VALUE!", "#NUME?": "#NAME?"}


def la_fel(x, s):
    if x["tip"] == "refuzat":
        return s["tip"] == "eroare"          # Excel nici nu primește formula; e bine dacă și noi o respingem
    if x["tip"] == "eroare":
        return s["tip"] == "eroare" and ECHIV_ERORI.get(s["v"], s["v"]) == x["v"]
    if x["tip"] != s["tip"]:
        return False
    if x["tip"] == "num":
        return abs(x["v"] - s["v"]) < 1e-9 * max(1, abs(x["v"]))
    return x["v"] == s["v"]


def arata(r):
    if r["tip"] == "eroare":
        return r["v"] + (" — " + r["mesaj"] if r.get("mesaj") else "")
    if r["tip"] == "num":
        v = r["v"]
        return str(int(v)) if float(v).is_integer() else repr(round(v, 10))
    return repr(r["v"])


def main():
    info, xl = excel_real()
    sim = simulator()
    dif = [f for f in FORMULE if not la_fel(xl[f], sim[f])]
    (AICI / "rezultate.json").write_text(json.dumps({"info": info, "excel": xl, "simulator": sim, "diferente": dif},
                                                    ensure_ascii=False, indent=1), encoding="utf-8")
    L = ["# Oracolul Excel — simulatorul (tip-foaie.js) față de Excel-ul adevărat", "",
         "Excel: versiunea %s · limba interfeței %s · separator de listă „%s” · zecimale „%s”" % (
             info["versiune"], info["limba_interfata"], info["separator_lista"], info["separator_zecimal"]),
         "Pe acest PC: SUM se scrie `%s`, IF `%s`; eroarea de împărțire apare `%s`, funcția necunoscută `%s`, TRUE apare `%s`." % (
             info["SUM_local"], info["IF_local"], info["text_eroare_div0"], info["text_eroare_nume"], info["text_TRUE"]),
         "", "**%d formule, %d la fel, %d diferite.**" % (len(FORMULE), len(FORMULE) - len(dif), len(dif)), "",
         "| Formula | Excel | Simulatorul nostru |", "|---|---|---|"]
    for f in dif:
        L.append("| `%s` | %s | %s |" % (f.replace("|", "\\|"), arata(xl[f]).replace("|", "\\|"), arata(sim[f]).replace("|", "\\|")))
    (AICI / "raport.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print("\n".join(L[:6]))
    print("Raport:", AICI / "raport.md")
    print(len(dif))


if __name__ == "__main__":
    main()
