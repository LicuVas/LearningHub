"""Faza 0 (27.09.2026): afirmatiile „daca faci X, apare Y” din materialele pentru VIII nr. 4
(adresa de celula, selectare, copiere, mutare, stergere), reproduse in Excel-ul REAL.

Reguli: instanta NOUA si INVIZIBILA (DispatchEx), DisplayAlerts=False, registru nou pentru fiecare proba,
inchis FARA salvare, Quit() doar pe instanta mea. Nu ating niciun Excel deschis al utilizatorului.
Constantele se scriu cu FormulaLocal = ca tastate de elev, pe setarile regionale ale acestui PC.
Iesire: excel_real_viii4.json (langa script). Ultima linie tiparita = numarul de afirmatii INFIRMATE.
"""
import json, sys, traceback
from pathlib import Path
import win32com.client
import pywintypes

sys.stdout.reconfigure(encoding="utf-8")
AICI = Path(__file__).resolve().parent
EX = AICI / "_extras"
ERORI = {-2146826281: "#DIV/0!", -2146826246: "#N/A", -2146826259: "#NAME?", -2146826288: "#NULL!",
         -2146826252: "#NUM!", -2146826265: "#REF!", -2146826273: "#VALUE!"}
xlDown, xlShiftUp, xlCellTypeLastCell, xlNumberAsText = -4121, -4162, 11, 3

SURSE = {
    "excel-viii N2": EX / "excel-viii.lectia4.txt",
    "excel-pas-cu-pas-viii N2": EX / "excel-pas-cu-pas-viii.lectia4.txt",
    "excel-pas-cu-pas-viii N5": EX / "excel-pas-cu-pas-viii.lectia4.txt",
    "lectia veche cls8/m1/lectia1-interfata": EX / "vechi_cls8__m1-excel-fundamente__lectia1-interfata.txt",
}

xl = win32com.client.DispatchEx("Excel.Application")
xl.Visible = False
xl.DisplayAlerts = False


def v(c):
    x = c.Value
    if isinstance(x, int) and x in ERORI:
        return ERORI[x]
    if isinstance(x, float) and x.is_integer():
        return int(x)
    return x


def stare(sh, adrese):
    return {a: {"valoare": v(sh.Range(a)), "formula": sh.Range(a).FormulaLocal, "afisat": sh.Range(a).Text} for a in adrese}


def scrie(sh, celule):
    for a, t in celule.items():
        sh.Range(a).FormulaLocal = t


def registru():
    wb = xl.Workbooks.Add()
    sh = wb.Worksheets(1)
    sh.Activate()
    return wb, sh


REZ = []


def proba(id_, candidat, loc, citat, actiune, promis):
    def dec(fn):
        wb = None
        rec = {"id": id_, "candidat": candidat, "loc": loc, "citat": citat, "actiune": actiune, "promis": promis}
        try:
            wb, sh = registru()
            verdict, observat, nota = fn(wb, sh)
            rec.update(verdict=verdict, observat=observat, nota=nota)
        except pywintypes.com_error as e:
            rec.update(verdict="NETESTABIL", observat={"eroare_com": str(e)[:300]},
                       nota="Excel a refuzat operatia prin COM; nu am putut reproduce.")
        except Exception as e:
            rec.update(verdict="NETESTABIL", observat={"eroare": repr(e)[:300]}, nota=traceback.format_exc()[-300:])
        finally:
            if wb is not None:
                try:
                    xl.CutCopyMode = False
                except Exception:
                    pass
                wb.Close(False)
        REZ.append(rec)
        return fn
    return dec


def netestabil(id_, candidat, loc, citat, actiune, promis, de_ce):
    REZ.append({"id": id_, "candidat": candidat, "loc": loc, "citat": citat, "actiune": actiune, "promis": promis,
                "verdict": "NETESTABIL", "observat": None, "nota": de_ce})


C = "excel-viii N2"
# ---------------------------------------------------------------- adresa si zona
@proba("A01", C, "P1 [incearca]", "Câte celule are zona A1:B3?", "numar celulele zonei A1:B3", "6 (cheia lectiei)")
def _(wb, sh):
    n = sh.Range("A1:B3").Count
    return ("CONFIRMAT" if n == 6 else "INFIRMAT"), {"Range(A1:B3).Count": n}, ""

@proba("A02", C, "P1 [text]", "3 coloane × 3 rânduri = 9 celule", "numar celulele zonei B2:D4", "9")
def _(wb, sh):
    n = sh.Range("B2:D4").Count
    return ("CONFIRMAT" if n == 9 else "INFIRMAT"), {"Range(B2:D4).Count": n}, ""

@proba("A03", C, "P1 [inca 1]", "Zona se scrie cu două puncte între colțuri: A1:C2.",
       "scriu in celule =ROWS(A1:C2)*COLUMNS(A1:C2) si variantele gresite din grila, ca formule tastate",
       "A1:C2 e o zona valida (6 celule); celelalte forme nu sunt zone")
def _(wb, sh):
    obs = {}
    for a, f in {"E1": "=ROWS(A1:C2)*COLUMNS(A1:C2)", "E2": "=ROWS(A1-C2)", "E3": "=ROWS(A1+C2)"}.items():
        try:
            sh.Range(a).FormulaLocal = f
            obs[f] = v(sh.Range(a))
        except pywintypes.com_error:
            obs[f] = "REFUZAT (fereastra de eroare)"
    ok = obs["=ROWS(A1:C2)*COLUMNS(A1:C2)"] == 6
    return ("CONFIRMAT" if ok else "INFIRMAT"), obs, "A1;C2 nu l-am tastat: pe setari RO „;” e separatorul de argumente, deci nu e o zona."

# ---------------------------------------------------------------- selectare
netestabil("A04", C, "P2 [text]", "clic pe litera unei coloane selectează toată coloana",
           "clic pe antetul de coloana / de rand", "se selecteaza toata coloana / tot randul",
           "Gest de mouse: prin COM nu se poate da clic in instanta invizibila. Comportament cunoscut, dar nemasurat aici.")

@proba("A05", C, "P2 [text] + [inca 1]", "Celula din care ai pornit rămâne albă: ea e celula activă, iar caseta de nume arată adresa ei.",
       "selectez B2:C4 pornind din B2 (Select), apoi aceeasi zona pornind din C4 (Select + Activate C4); citesc ActiveCell",
       "celula activa = celula de pornire (B2), iar caseta de nume arata B2")
def _(wb, sh):
    sh.Range("B2:C4").Select()
    a1, s1 = xl.ActiveCell.Address, xl.Selection.Address
    sh.Range("B2:C4").Select()
    sh.Range("C4").Activate()
    a2, s2 = xl.ActiveCell.Address, xl.Selection.Address
    ok = a1 == "$B$2" and s1 == "$B$2:$C$4" and a2 == "$C$4" and s2 == "$B$2:$C$4"
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"pornind_din_B2": {"ActiveCell": a1, "Selection": s1},
                                                  "pornind_din_C4": {"ActiveCell": a2, "Selection": s2}}, \
        "Celula activa e confirmata prin COM. Culoarea (alb / colorat) si textul din caseta de nume nu se pot citi prin COM (instanta invizibila)."

netestabil("A19", C, "P2 [text]", "Sau: clic pe primul colț, apoi Shift+clic pe colțul opus.",
           "clic pe B2, Shift+clic pe C4", "se selecteaza B2:C4", "Gest cu tasta Shift: nu se poate trimite unei instante invizibile. Comportament cunoscut, nemasurat aici.")

@proba("A20", C, "P1 [inca 2] + Q2", "Selectează zona B2:C4: apasă pe un colț, apoi pe colțul opus.",
       "echivalentul in Excel al gestului cerut: clic simplu pe B2 (Select), apoi clic simplu pe C4 (Select), FARA Shift",
       "zona B2:C4 selectata (asa functioneaza exercitiul din pagina)")
def _(wb, sh):
    sh.Range("B2").Select()
    sh.Range("C4").Select()
    s = xl.Selection.Address
    return ("CONFIRMAT" if s == "$B$2:$C$4" else "INFIRMAT"), {"Selection_dupa_doua_clicuri": s}, \
        "In exercitiul din pagina gestul merge; in Excel-ul real al doilea clic simplu alege DOAR C4. Simulatorul nu se poarta ca aplicatia (lipseste Shift sau tragerea)."

# ---------------------------------------------------------------- copiere
@proba("A06", C, "P3 [text] + [incearca]", "Copia începe din D1 și ocupă tot D1:E2. Originalul A1:B2 a rămas.",
       "A1:B2 = Elev/Nota/Ana/9; Range(A1:B2).Copy() apoi Paste cu destinatia UNA singura celula, D1",
       "copia ocupa D1:E2; A1:B2 raman neschimbate")
def _(wb, sh):
    scrie(sh, {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": "9"})
    sh.Range("A1:B2").Copy()
    mod_dupa_copy = xl.CutCopyMode
    sh.Paste(sh.Range("D1"))
    st = stare(sh, ["A1", "B1", "A2", "B2", "D1", "E1", "D2", "E2", "F1", "D3"])
    ok = [st[a]["valoare"] for a in ("D1", "E1", "D2", "E2")] == ["Elev", "Nota", "Ana", 9] and \
         [st[a]["valoare"] for a in ("A1", "B1", "A2", "B2")] == ["Elev", "Nota", "Ana", 9] and st["F1"]["valoare"] is None
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st, "CutCopyMode_dupa_Copy": mod_dupa_copy,
                                                  "CutCopyMode_dupa_Paste": xl.CutCopyMode}, \
        "Dupa Ctrl+V marginea punctata ramane (CutCopyMode tot 1): se poate lipi din nou."

@proba("A07", C, "P3 [text]", "Ctrl+C: în jurul lor apare o margine punctată care „se mișcă”",
       "Range.Copy() fara destinatie; citesc Application.CutCopyMode", "starea „copiat” (1 = xlCopy)")
def _(wb, sh):
    scrie(sh, {"B2": "1"})
    sh.Range("B2:D4").Copy()
    m = xl.CutCopyMode
    return ("CONFIRMAT" if m == 1 else "INFIRMAT"), {"CutCopyMode": m}, \
        "Confirmat ca stare (xlCopy=1). Animatia marginii nu se vede prin COM."

netestabil("A08", C, "P3 [text]", "Marginea punctată dispare cu Esc.", "apas Esc dupa Ctrl+C", "marginea dispare",
           "Tasta Esc nu se poate trimite unei instante invizibile; CutCopyMode=False e echivalentul, nu tasta. Vezi si A09: dupa Ctrl+X, Ctrl+V dispare singura.")

# ---------------------------------------------------------------- mutare
@proba("A09", C, "P4 [exemplu]", "Selectezi A1:A2, Ctrl+X, clic pe C1, Ctrl+V.",
       "A1=Ana, A2=Bogdan; Range(A1:A2).Cut(); Paste in C1", "coloana A e goala, numele sunt in C1:C2")
def _(wb, sh):
    scrie(sh, {"A1": "Ana", "A2": "Bogdan"})
    sh.Range("A1:A2").Cut()
    m1 = xl.CutCopyMode
    sh.Paste(sh.Range("C1"))
    st = stare(sh, ["A1", "A2", "C1", "C2"])
    ok = st["A1"]["valoare"] is None and st["A2"]["valoare"] is None and st["C1"]["valoare"] == "Ana" and st["C2"]["valoare"] == "Bogdan"
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st, "CutCopyMode_dupa_Cut": m1, "CutCopyMode_dupa_Paste": xl.CutCopyMode}, \
        "Dupa lipirea unei decupari, starea de copiere se stinge singura (CutCopyMode 0): a doua lipire nu mai e posibila."

@proba("A10", C, "P4 [inca 1]", "Mută notele din A1:A3 în C1:C3", "A1=Nota, A2=9, A3=7; Cut A1:A3; Paste C1",
       "C1:C3 = Nota/9/7; A1:A3 goale")
def _(wb, sh):
    scrie(sh, {"A1": "Nota", "A2": "9", "A3": "7"})
    sh.Range("A1:A3").Cut(); sh.Paste(sh.Range("C1"))
    st = stare(sh, ["A1", "A2", "A3", "C1", "C2", "C3"])
    ok = [st[a]["valoare"] for a in ("C1", "C2", "C3")] == ["Nota", 9, 7] and all(st[a]["valoare"] is None for a in ("A1", "A2", "A3"))
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

@proba("A11", C, "ATELIER inca 1", "mută tabelul A1:B2 ca să înceapă din C3", "A1:B2 = Produs/Preț/Caiet/5; Cut; Paste C3",
       "C3:D4 are tabelul; A1:B2 goale")
def _(wb, sh):
    scrie(sh, {"A1": "Produs", "B1": "Preț", "A2": "Caiet", "B2": "5"})
    sh.Range("A1:B2").Cut(); sh.Paste(sh.Range("C3"))
    st = stare(sh, ["A1", "B1", "A2", "B2", "C3", "D3", "C4", "D4"])
    ok = [st[a]["valoare"] for a in ("C3", "D3", "C4", "D4")] == ["Produs", "Preț", "Caiet", 5] and \
         all(st[a]["valoare"] is None for a in ("A1", "B1", "A2", "B2"))
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

# ---------------------------------------------------------------- stergere
@proba("A12", C, "P5 [text] + [exemplu]", "Delete golește celulele selectate: conținutul dispare, dar celulele rămân la locul lor, goale. Nimic nu urcă și nimic nu se mută.",
       "C2=greșit, C3=jos, C2 aldin; tasta Delete = ClearContents pe C2", "C2 goala; C3 ramane in C3; nimic nu urca")
def _(wb, sh):
    scrie(sh, {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": "9", "C2": "greșit", "C3": "jos"})
    sh.Range("C2").Font.Bold = True
    sh.Range("C2").ClearContents()
    st = stare(sh, ["C2", "C3", "B2"])
    ok = st["C2"]["valoare"] is None and st["C3"]["valoare"] == "jos" and st["B2"]["valoare"] == 9
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st, "C2_ramane_aldin": sh.Range("C2").Font.Bold}, \
        "Delete goleste doar continutul; formatul (aldinul) ramane in celula — lectia nu spune asta, dar nici nu contrazice."

@proba("A13", C, "Q5", "Alegi B3 și apeși Delete. Nota din B4 rămâne tot în B4, iar B3 rămâne goală.",
       "B3=5, B4=10; ClearContents B3", "B3 goala, B4=10")
def _(wb, sh):
    scrie(sh, {"B3": "5", "B4": "10"})
    sh.Range("B3").ClearContents()
    st = stare(sh, ["B3", "B4"])
    ok = st["B3"]["valoare"] is None and st["B4"]["valoare"] == 10
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

@proba("A14", C, "ATELIER inca 2", "golește toate notele lui Bogdan, B3:C3, dintr-o dată",
       "B3=5, C3=7; ClearContents pe zona B3:C3", "B3 si C3 goale")
def _(wb, sh):
    scrie(sh, {"A3": "Bogdan", "B3": "5", "C3": "7", "B4": "10"})
    sh.Range("B3:C3").ClearContents()
    st = stare(sh, ["A3", "B3", "C3", "B4"])
    ok = st["B3"]["valoare"] is None and st["C3"]["valoare"] is None and st["A3"]["valoare"] == "Bogdan" and st["B4"]["valoare"] == 10
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

@proba("A15", C, "P5 [text] + Q6", "Ctrl+Z anulează ultima operație.",
       "ClearContents prin COM, apoi Application.Undo()", "continutul revine")
def _(wb, sh):
    scrie(sh, {"A1": "Ana"})
    sh.Range("A1").ClearContents()
    try:
        xl.Undo()
        dupa = v(sh.Range("A1"))
        if dupa == "Ana":
            return "CONFIRMAT", {"A1_dupa_Undo": dupa}, \
                "Application.Undo (= Ctrl+Z) a adus inapoi continutul sters. „De mai multe ori ca sa mergi mai inapoi” NU e probat aici (COM tine doar ultima operatie)."
        return "NETESTABIL", {"A1_dupa_Undo": dupa}, \
            "Operatiile facute prin COM nu intra in lista de anulare a interfetei; un rezultat negativ aici NU infirma Ctrl+Z."
    except pywintypes.com_error as e:
        return "NETESTABIL", {"Undo": "refuzat: " + str(e)[:160]}, \
            "Operatiile facute prin COM nu intra in lista de anulare; Ctrl+Z nu se poate proba astfel."

netestabil("A16", C, "P5 [text]", "Același lucru face butonul Anulare (Undo), cu săgeata întoarsă ↶.",
           "caut butonul Anulare (Undo)", "butonul exista, cu sageata intoarsa",
           "Office de pe acest PC e in engleza: numele RO „Anulare” e netestabil aici; butonul Undo nu se poate vedea prin COM.")

@proba("A17", C, "Q1", "Vrei aceeași listă de nume și pe foaia a doua, dar să rămână și pe prima.",
       "Foaia 1: A1:A3 = Ana/Bogdan/Cristi; Copy; Paste pe foaia 2 in A1", "lista e pe ambele foi")
def _(wb, sh):
    while wb.Worksheets.Count < 2:
        wb.Worksheets.Add(After=wb.Worksheets(wb.Worksheets.Count))
    sh = wb.Worksheets(1); sh2 = wb.Worksheets(2)
    scrie(sh, {"A1": "Ana", "A2": "Bogdan", "A3": "Cristi"})
    sh.Range("A1:A3").Copy(sh2.Range("A1"))
    a = [v(sh.Range(x)) for x in ("A1", "A2", "A3")]
    b = [v(sh2.Range(x)) for x in ("A1", "A2", "A3")]
    ok = a == b == ["Ana", "Bogdan", "Cristi"]
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"foaia1": a, "foaia2": b}, ""

@proba("A18", C, "ATELIER", "Copia a ocupat A5:B7, originalul a rămas, iar D1 e goală.",
       "A1:B3 = Elev/Nota/Ana/9/Bogdan/7, D1=de șters; Copy A1:B3, Paste A5; ClearContents D1", "A5:B7 = copia; A1:B3 intacte; D1 goala")
def _(wb, sh):
    scrie(sh, {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": "9", "A3": "Bogdan", "B3": "7", "D1": "de șters"})
    sh.Range("A1:B3").Copy(); sh.Paste(sh.Range("A5")); xl.CutCopyMode = False
    sh.Range("D1").ClearContents()
    st = stare(sh, ["A1", "B3", "A5", "B5", "A6", "B6", "A7", "B7", "D1"])
    ok = [st[a]["valoare"] for a in ("A5", "B5", "A6", "B6", "A7", "B7")] == ["Elev", "Nota", "Ana", 9, "Bogdan", 7] \
        and st["A1"]["valoare"] == "Elev" and st["B3"]["valoare"] == 7 and st["D1"]["valoare"] is None
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

# ---------------------------------------------------------------- pas-cu-pas N2
C = "excel-pas-cu-pas-viii N2"
@proba("B01", C, "P1 [text]", "Enter pune ce ai scris și te duce în jos;",
       "citesc setarea „dupa Enter, muta selectia” (MoveAfterReturn / MoveAfterReturnDirection)", "in jos (xlDown)")
def _(wb, sh):
    m, d = xl.MoveAfterReturn, xl.MoveAfterReturnDirection
    return ("CONFIRMAT" if (m and d == xlDown) else "INFIRMAT"), {"MoveAfterReturn": m, "MoveAfterReturnDirection": d}, \
        "Confirmat pe setarea implicita a acestui PC; pe alt PC setarea se poate schimba din Options."

netestabil("B02", C, "P1 [text]", "Tab pune ce ai scris și te duce la dreapta;", "tastez si apas Tab / Esc / sageti",
           "Tab la dreapta, Esc renunta", "Tastele nu se pot trimite unei instante invizibile.")
netestabil("B14", C, "P1 [exemplu]", "Scrii Elev în A1, apeși Tab, scrii Nota, apeși Enter. Rezultatul:",
           "Elev, Tab, Nota, Enter", "celula activa ajunge in A2 (captura arata A2)",
           "Tastele nu se pot trimite unei instante invizibile. De stiut: Excel intoarce Enter-ul in coloana de unde a pornit sirul de Tab-uri (A2), deci regula „Enter te duce in jos” din acelasi pas e o simplificare.")
netestabil("B03", C, "P1 [text]", "Jos, bara de stare arată Introducere (Enter): Excel așteaptă să termini.",
           "incep sa tastez intr-o celula", "bara de stare arata Introducere (Enter)",
           "Modul barei de stare nu se citeste prin COM; numele RO „Introducere” e netestabil pe Office EN.")

@proba("B04", C, "P2 [text] + [incearca]", "numeric (număr): stă la dreapta în celulă și se poate folosi în calcule;",
       "tastez 9, Ana, VIII A, 125 (aliniere General); citesc tipul valorii si alinierea", "9 si 125 numere (dreapta); Ana, VIII A text (stanga)")
def _(wb, sh):
    scrie(sh, {"A1": "9", "A2": "Ana", "A3": "VIII A", "A4": "125", "B1": "=A1+A4"})
    tip = {a: type(sh.Range(a).Value).__name__ for a in ("A1", "A2", "A3", "A4")}
    al = sh.Range("A1").HorizontalAlignment
    ok = tip == {"A1": "float", "A2": "str", "A3": "str", "A4": "float"} and v(sh.Range("B1")) == 134 and al == 1
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"tipuri": tip, "=A1+A4": v(sh.Range("B1")), "HorizontalAlignment(1=General)": al}, \
        "Tipul e masurat; pozitia dreapta/stanga decurge din alinierea General (regula Excel), nu e masurata pe ecran."

@proba("B05", C, "P2 [text]", "dată calendaristică: stă tot la dreapta, pentru că pentru Excel o dată e tot un număr.",
       "tastez 07.05.2026 (setari RO); citesc Value2", "Excel pastreaza un numar (numarul de serie al datei)")
def _(wb, sh):
    scrie(sh, {"A1": "07.05.2026"})
    v2 = sh.Range("A1").Value2
    return ("CONFIRMAT" if isinstance(v2, float) else "INFIRMAT"), {"Value2": v2, "afisat": sh.Range("A1").Text,
                                                                     "NumberFormatLocal": sh.Range("A1").NumberFormatLocal}, \
        "„########” = coloana prea ingusta pentru data intreaga; scrisa prin COM coloana nu se latete singura (tastata de mana, Excel o latete de obicei). Alinierea la dreapta nu e masurata pe ecran."

@proba("B06", C, "P2 [text]", "Un număr care stă la stânga e, de fapt, text și nu intră corect în calcule.",
       "B5 = '250 (numar pastrat ca text); calculez =SUM(B5), =B5*2, =B5+1", "textul nu intra corect in calcule")
def _(wb, sh):
    scrie(sh, {"B5": "'250", "C1": "=SUM(B5)", "C2": "=B5*2", "C3": "=B5+1", "C4": "=AVERAGE(B5:B6)", "B6": "10"})
    obs = {"tip_B5": type(sh.Range("B5").Value).__name__, "=SUM(B5)": v(sh.Range("C1")), "=B5*2": v(sh.Range("C2")),
           "=B5+1": v(sh.Range("C3")), "=AVERAGE(B5:B6) cu B6=10": v(sh.Range("C4"))}
    ok = obs["=SUM(B5)"] == 0
    return ("CONFIRMAT" if ok else "INFIRMAT"), obs, \
        "NUANTA: SUM si AVERAGE il ignora in tacere (rezultat gresit, fara eroare), dar operatorii + si * il transforma in numar (=B5*2 da 500). „Nu intra corect” e adevarat la functii, nu la operatori."

@proba("B07", C, "P2 imagine tipuri-date.webp (alt)", "250 văzut ca text stă la stânga cu un triunghi verde în colț",
       "B5 = '250; citesc Errors(xlNumberAsText) si optiunea de verificare", "Excel marcheaza celula (triunghiul verde)")
def _(wb, sh):
    scrie(sh, {"B5": "'250"})
    e = sh.Range("B5").Errors(xlNumberAsText).Value
    opt = xl.ErrorCheckingOptions.NumberAsText
    return ("CONFIRMAT" if (e and opt) else "INFIRMAT"), {"Errors(NumberAsText)": e, "ErrorCheckingOptions.NumberAsText": opt}, \
        "Triunghiul insusi (desenul) nu se vede prin COM; semnalarea care il produce e confirmata."

@proba("B08", C, "P3 [text]", "Pe calculatoarele cu setări românești, zecimalele se scriu cu virgulă: 7,5. Excel îl înțelege ca număr și îl pune la dreapta.",
       "tastez 7,5 (setari RO ale acestui PC)", "numarul 7,5")
def _(wb, sh):
    scrie(sh, {"B2": "7,5"})
    x = sh.Range("B2").Value
    return ("CONFIRMAT" if x == 7.5 else "INFIRMAT"), {"valoare": x, "tip": type(x).__name__, "afisat": sh.Range("B2").Text}, ""

@proba("B09", C, "P3 [text] + [exemplu] + [inca 1] + Q1", "Excel transformă 7.5 într-o dată: în celulă apare 07.mai.",
       "tastez 7.5 (setari RO ale acestui PC)", "o data calendaristica (7 mai), afisata 07.mai")
def _(wb, sh):
    scrie(sh, {"B3": "7.5"})
    x, t = sh.Range("B3").Value2, sh.Range("B3").Text
    e_data = isinstance(x, float) and x > 40000
    verdict = "CONFIRMAT" if (e_data and t == "07.mai") else ("INFIRMAT" if not e_data else "INFIRMAT")
    nota = "" if verdict == "CONFIRMAT" else ("Excel a facut o data, dar o AFISEAZA altfel decat promite lectia." if e_data else "Excel NU a facut o data.")
    return verdict, {"Value2": x, "tip": type(x).__name__, "afisat": t, "NumberFormat": sh.Range("B3").NumberFormat,
                     "NumberFormatLocal": sh.Range("B3").NumberFormatLocal}, nota

netestabil("B10", C, "P3 [text]", "Pe calculatoarele cu setări în engleză e invers: zecimalele se scriu cu punct.",
           "tastez 7.5 pe setari EN", "numarul 7.5", "Setarile regionale ale acestui PC sunt romanesti; nu le schimb (ar atinge tot Windows-ul utilizatorului).")

@proba("B11", C, "P4 [text]", "Scrii peste: alegi celula și tastezi. Ce era acolo dispare, rămâne ce ai scris acum.",
       "B3=3, apoi tastez 8 in B3", "B3 = 8")
def _(wb, sh):
    scrie(sh, {"B3": "3"}); scrie(sh, {"B3": "8"})
    return ("CONFIRMAT" if v(sh.Range("B3")) == 8 else "INFIRMAT"), {"B3": v(sh.Range("B3"))}, ""

netestabil("B12", C, "P4 [text]", "Modifici doar o parte: apeși F2 (sau dublu-clic pe celulă). Bara de stare arată Editare (Edit)",
           "apas F2", "modul Editare", "Tastele si bara de stare nu se pot citi prin COM; numele RO „Editare” netestabil pe Office EN.")

@proba("B13", C, "Q5", "Un spațiu ar lăsa în celulă un caracter invizibil.",
       "tastez un spatiu in C3; =COUNTA(C3), =ISBLANK(C3), =LEN(C3)", "celula nu e goala (are un caracter)")
def _(wb, sh):
    sh.Range("C3").Value = " "
    scrie(sh, {"D1": "=COUNTA(C3)", "D2": "=ISBLANK(C3)", "D3": "=LEN(C3)"})
    obs = {"COUNTA": v(sh.Range("D1")), "ISBLANK": v(sh.Range("D2")), "LEN": v(sh.Range("D3")), "afisat_C3": repr(sh.Range("C3").Text)}
    ok = obs["COUNTA"] == 1 and obs["ISBLANK"] is False and obs["LEN"] == 1
    return ("CONFIRMAT" if ok else "INFIRMAT"), obs, ""

# ---------------------------------------------------------------- pas-cu-pas N5 (formule: lectia 7)
C = "excel-pas-cu-pas-viii N5"
TAB = {"A1": "Produs", "B1": "Preț", "C1": "Bucăți", "D1": "Total", "A2": "Caiet", "B2": "4", "C2": "3", "A3": "Pix", "B3": "2",
       "C3": "5", "A4": "Riglă", "B4": "6", "C4": "2", "A5": "Gumă", "B5": "1", "C5": "4", "D2": "=B2*C2"}

@proba("C01", C, "P1 [text]", "Celula aleasă are în colțul din dreapta-jos un pătrățel verde. Se numește mâner de umplere (fill handle).",
       "citesc optiunea „Enable fill handle and cell drag-and-drop” (CellDragAndDrop)", "manerul exista (optiunea pornita)")
def _(wb, sh):
    x = xl.CellDragAndDrop
    return ("CONFIRMAT" if x else "INFIRMAT"), {"CellDragAndDrop": x}, "Culoarea si forma patratelului nu se vad prin COM; confirmat doar ca optiune pornita."

@proba("C02", C, "P1 [text] + P2 [text] + Q1", "=B2*C2 din D2 devine =B3*C3 în D3, =B4*C4 în D4 și tot așa.",
       "tabelul lectiei; D2 = =B2*C2; AutoFill D2 -> D2:D5 (= tragerea manerului)", "D3 =B3*C3, D4 =B4*C4, D5 =B5*C5")
def _(wb, sh):
    scrie(sh, TAB)
    sh.Range("D2").AutoFill(sh.Range("D2:D5"))
    st = stare(sh, ["D2", "D3", "D4", "D5"])
    ok = [st[a]["formula"] for a in ("D3", "D4", "D5")] == ["=B3*C3", "=B4*C4", "=B5*C5"]
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

@proba("C03", C, "P3 [text] + [incearca] + Q5", "apeși Ctrl+D (D de la Down, „în jos”).",
       "selectez D2:D5 si FillDown (= Ctrl+D)", "formula din D2 copiata in D3:D5, cu adresele mutate")
def _(wb, sh):
    scrie(sh, TAB)
    sh.Range("D2:D5").FillDown()
    st = stare(sh, ["D3", "D4", "D5"])
    ok = [st[a]["formula"] for a in ("D3", "D4", "D5")] == ["=B3*C3", "=B4*C4", "=B5*C5"]
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

@proba("C04", C, "P3 [text]", "Poți folosi și copierea obișnuită: Ctrl+C pe formulă, apoi Ctrl+V în altă celulă. Și aici adresele se mută.",
       "Copy D2, Paste in D4 si in F2", "adresele se muta cu aceeasi distanta")
def _(wb, sh):
    scrie(sh, TAB)
    sh.Range("D2").Copy(); sh.Paste(sh.Range("D4")); sh.Paste(sh.Range("F2")); xl.CutCopyMode = False
    st = stare(sh, ["D4", "F2"])
    ok = st["D4"]["formula"] == "=B4*C4" and st["F2"]["formula"] == "=D2*E2"
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, "Lipita la dreapta (F2), formula devine =D2*E2 — adresele se muta si pe coloane."

@proba("C05", C, "ATELIER", "Apoi verifică pe D6, în bara fx, că formula folosește rândul 6.",
       "tabelul atelierului; D2 = =(B2+C2)/2; AutoFill D2 -> D2:D6", "D6 = =(B6+C6)/2")
def _(wb, sh):
    scrie(sh, {"B2": "8", "C2": "9", "B3": "5", "C3": "6", "B4": "10", "C4": "9", "B5": "7", "C5": "4", "B6": "6", "C6": "8", "D2": "=(B2+C2)/2"})
    sh.Range("D2").AutoFill(sh.Range("D2:D6"))
    st = stare(sh, ["D2", "D3", "D4", "D5", "D6"])
    ok = st["D6"]["formula"] == "=(B6+C6)/2"
    return ("CONFIRMAT" if ok else "INFIRMAT"), {"celule": st}, ""

netestabil("C06", C, "P1 [text]", "Îl apuci cu mouse-ul (cursorul devine o cruciuliță neagră) și tragi în jos.",
           "apuc manerul", "cursorul devine cruce neagra", "Forma cursorului nu se poate observa prin COM.")

# ---------------------------------------------------------------- lectia veche (tinta panoului pt. nr. 3 SI nr. 4)
C = "lectia veche cls8/m1/lectia1-interfata"
@proba("D01", C, "Celula, Rândul și Coloana", "Excel are peste 16.000 de coloane (exact 16.384)!",
       "numar coloanele si randurile foii", "16.384 coloane; 1.048.576 randuri")
def _(wb, sh):
    c, r = sh.Columns.Count, sh.Rows.Count
    return ("CONFIRMAT" if (c == 16384 and r == 1048576) else "INFIRMAT"), {"coloane": c, "randuri": r}, ""

@proba("D02", C, "Interval / Exercițiul 2 rezolvare", "A1:E10 are 5 coloane (A-E) x 10 rânduri = 50 de celule.",
       "numar A1:E10 si A1:C3", "50 si 9")
def _(wb, sh):
    a, b = sh.Range("A1:E10").Count, sh.Range("A1:C3").Count
    return ("CONFIRMAT" if (a == 50 and b == 9) else "INFIRMAT"), {"A1:E10": a, "A1:C3": b}, ""

@proba("D03", C, "Exercițiul 1, rezolvare pas 4", "Verifică singur: apasă Ctrl+End — ajungi tot pe C4, colțul dreapta-jos al tabelului.",
       "tabelul A1:C4 al exercitiului; citesc ultima celula folosita (= tinta lui Ctrl+End)", "C4")
def _(wb, sh):
    scrie(sh, {"A1": "Nume", "B1": "Nota Matematică", "C1": "Nota Română", "A2": "Ion", "B2": "8", "C2": "9",
               "A3": "Ana", "B3": "10", "C3": "7", "A4": "Mihai", "B4": "6", "C4": "8"})
    x = sh.Cells.SpecialCells(xlCellTypeLastCell).Address
    return ("CONFIRMAT" if x == "$C$4" else "INFIRMAT"), {"ultima_celula": x}, ""

@proba("D04", C, "Exercițiul 2, verificarea", "Pe foaia Navigare, Ctrl+End te duce pe M25: acolo e singurul text din foaie, iar selecția A1:E10 nu contează.",
       "scriu in M25, selectez A1:E10; citesc ultima celula folosita", "M25")
def _(wb, sh):
    scrie(sh, {"M25": "Am ajuns aici!"})
    sh.Range("A1:E10").Select()
    x = sh.Cells.SpecialCells(xlCellTypeLastCell).Address
    return ("CONFIRMAT" if x == "$M$25" else "INFIRMAT"), {"ultima_celula": x}, ""

@proba("D05", C, "Scurtături", "Ctrl + End = sari la ultima celulă cu date",
       "scriu in A1:C4 si in Z100, apoi golesc Z100 cu Delete; citesc ultima celula folosita", "ultima celula CU DATE = C4")
def _(wb, sh):
    scrie(sh, {"A1": "x", "C4": "8", "Z100": "greșeală"})
    sh.Range("Z100").ClearContents()
    x = sh.Cells.SpecialCells(xlCellTypeLastCell).Address
    return ("CONFIRMAT" if x == "$C$4" else "INFIRMAT"), {"ultima_celula_dupa_golirea_Z100": x}, \
        "Ctrl+End merge la ultima celula FOLOSITA, nu la ultima cu date: dupa ce golesti o celula departata, tot acolo te duce (pana la salvare/redeschidere)."

@proba("D06", C, "Exercițiul 2", "Redenumește Sheet1 (în Excel în română: Foaie1) în \"Navigare\".",
       "registru nou; citesc numele primei foi", "Sheet1 (EN) / Foaie1 (RO)")
def _(wb, sh):
    n = sh.Name
    return ("CONFIRMAT" if n == "Sheet1" else "INFIRMAT"), {"nume_foaie_EN": n}, "Doar numele EN e confirmat; „Foaie1” (RO) e netestabil pe acest Office."

# ---------------------------------------------------------------- fapte pentru lectie (nu afirmatii ale materialelor)
F = "FAPT (ce ar trebui sa stie lectia; nu e afirmatie a materialelor)"
@proba("X01", F, "-", "", "E1 = =A1*2, A1 = 5; mut (Cut/Paste) A1 in C1", "?")
def _(wb, sh):
    scrie(sh, {"A1": "5", "E1": "=A1*2"})
    sh.Range("A1").Cut(); sh.Paste(sh.Range("C1"))
    return "FAPT", {"E1": stare(sh, ["E1"])["E1"]}, "La MUTARE, formulele care trimiteau la celula o urmeaza (=C1*2)."

@proba("X02", F, "-", "", "E1 = =A1*2, A1 = 5; copiez A1 in C1", "?")
def _(wb, sh):
    scrie(sh, {"A1": "5", "E1": "=A1*2"})
    sh.Range("A1").Copy(sh.Range("C1"))
    return "FAPT", {"E1": stare(sh, ["E1"])["E1"]}, "La COPIERE, formulele raman legate de original."

@proba("X03", F, "-", "", "E1 = =A1*2, A1 = 5; Delete pe A1", "?")
def _(wb, sh):
    scrie(sh, {"A1": "5", "E1": "=A1*2"})
    sh.Range("A1").ClearContents()
    return "FAPT", {"E1": stare(sh, ["E1"])["E1"]}, "Dupa Delete, formula ramane si da 0 (celula goala = 0), fara eroare."

@proba("X04", F, "-", "", "A1..A4 = 1..4, C1 = =A2*10, C2 = =A4; sterg RANDUL 2 (EntireRow.Delete)", "?")
def _(wb, sh):
    scrie(sh, {"A1": "1", "A2": "2", "A3": "3", "A4": "4", "C1": "=A2*10", "C3": "=A4"})
    sh.Rows(2).EntireRow.Delete()
    return "FAPT", {"celule": stare(sh, ["A1", "A2", "A3", "C1", "C2"])}, \
        "Stergerea RANDULUI: randurile de dedesubt urca; formula care trimitea la randul sters da #REF!; cea spre A4 devine =A3."

@proba("X05", F, "-", "", "A1=1, B1=2, C1=3, E1 = =B1+C1; sterg COLOANA B (EntireColumn.Delete)", "?")
def _(wb, sh):
    scrie(sh, {"A1": "1", "B1": "2", "C1": "3", "E1": "=B1+C1"})
    sh.Columns(2).EntireColumn.Delete()
    return "FAPT", {"celule": stare(sh, ["A1", "B1", "C1", "D1"])}, "Stergerea COLOANEI: coloanele din dreapta se muta la stanga; formula cu B1 da #REF!."

@proba("X06", F, "-", "", "A1..A3 = 1..3; Delete celule cu mutare in sus (Range(A1).Delete xlShiftUp = Stergere celule, nu tasta Delete)", "?")
def _(wb, sh):
    scrie(sh, {"A1": "1", "A2": "2", "A3": "3"})
    sh.Range("A1").Delete(xlShiftUp)
    return "FAPT", {"celule": stare(sh, ["A1", "A2", "A3"])}, "Comanda „Ștergere celule” (Delete Cells) MUTA celulele in sus — spre deosebire de tasta Delete."

@proba("X07", F, "-", "", "A1=Ana; C1=vechi; Copy A1 si Paste peste C1 ocupata", "?")
def _(wb, sh):
    scrie(sh, {"A1": "Ana", "C1": "vechi"})
    sh.Range("A1").Copy(); sh.Paste(sh.Range("C1")); xl.CutCopyMode = False
    return "FAPT", {"C1": v(sh.Range("C1"))}, "Lipirea peste celule pline le inlocuieste (cu DisplayAlerts oprit nu pot spune daca Excel ar fi intrebat; la Ctrl+V nu intreaba)."


def verifica_citate():
    lipsa = []
    txt = {k: p.read_text(encoding="utf-8") for k, p in SURSE.items()}
    for r in REZ:
        if not r["citat"] or r["candidat"] not in txt:
            continue
        if r["citat"] not in txt[r["candidat"]]:
            lipsa.append(r["id"])
    return lipsa


try:
    intl = xl.International
    mediu = {"excel_versiune": xl.Version, "limba_interfata_LCID": xl.LanguageSettings.LanguageID(2),
             "separator_zecimal": intl[2], "separator_lista": intl[4], "separator_data": intl[16],
             "instanta": "DispatchEx noua, Visible=False, DisplayAlerts=False; registru nou pe proba, inchis fara salvare"}
finally:
    xl.Quit()

lipsa = verifica_citate()
num = {k: sum(1 for r in REZ if r["verdict"] == k) for k in ("CONFIRMAT", "INFIRMAT", "NETESTABIL", "FAPT")}
afirmatii = [r for r in REZ if r["verdict"] != "FAPT"]
out = {"generat": "2026-09-27", "script": str(Path(__file__).name), "mediu": mediu,
       "numar": {"afirmatii": len(afirmatii), **num}, "citate_negasite_in_sursa": lipsa, "probe": REZ}
(AICI / "excel_real_viii4.json").write_text(json.dumps(out, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
print(json.dumps(mediu, ensure_ascii=False))
for r in REZ:
    print(f"{r['id']} {r['verdict']:10} {r['candidat'][:26]:26} {json.dumps(r['observat'], ensure_ascii=False, default=str)[:170]}")
print("citate negasite:", lipsa)
print("afirmatii:", len(afirmatii), num)
print(num["INFIRMAT"])
