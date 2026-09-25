"""Teste pentru ghid: (1) lectiile gresite dau mesaj clar, (2) Inapoi/Inainte in Excel-ul real.
Ultima linie = nr. de probleme.   python test_ghid.py [--fara-excel]"""
import sys
import tempfile
from pathlib import Path

import lectie as L

probleme = []


def verifica(cond, text):
    print(("OK   " if cond else "PROB ") + text)
    if not cond:
        probleme.append(text)


# ---------------- 1. lectii gresite
GRESITE = {
    "fara pasi": ("titlu: x\n", "listă „pasi”"),
    "conditie necunoscuta": ("titlu: x\npasi:\n  - {titlu: a, text: b, tinta: A1, gata: {verde: A1}}\n", "„verde” nu există"),
    "fila necunoscuta": ("titlu: x\npasi:\n  - {titlu: a, text: b, tinta: {buton: Bold, fila: Acasa}, gata: {aldin: A1}}\n",
                         "fila „Acasa” necunoscută"),
    "tinta gresita": ("titlu: x\npasi:\n  - {titlu: a, text: b, tinta: Z, gata: {aldin: A1}}\n", "„tinta” trebuie"),
    "lipsa gata": ("titlu: x\npasi:\n  - {titlu: a, text: b, tinta: A1}\n", "lipsește „gata”"),
    "actiune necunoscuta": ("titlu: x\npasi:\n  - {titlu: a, text: b, tinta: A1, gata: {aldin: A1}, proba: {zboara: A1}}\n",
                            "„zboara” nu există"),
    "yaml stricat": ("titlu: [x\n", "nu se poate citi"),
}
with tempfile.TemporaryDirectory() as d:
    for nume, (text, asteptat) in GRESITE.items():
        f = Path(d) / "lectie.yaml"
        f.write_text(text, encoding="utf-8")
        try:
            L.incarca(f)
            verifica(False, f"{nume}: a fost ACCEPTATĂ")
        except L.LectieGresita as e:
            verifica(asteptat in str(e), f"{nume}: mesaj clar ({e})")

for f in L.lectii(Path(__file__).parent / "lectii"):
    try:
        lec = L.incarca(f)
        verifica(all(p["proba"] for p in lec["pasi"]), f"{f.name}: se încarcă, toți pașii au „proba”")
    except L.LectieGresita as e:
        verifica(False, f"{f.name}: {e}")

# ---------------- 2. Inapoi / Inainte in Excel
if "--fara-excel" not in sys.argv:
    import ghid_excel as g

    lec = L.incarca(Path(__file__).parent / "lectii" / "01_note_suma_media.yaml")
    xl = g.porneste_excel(lec)
    ghid = g.Ghid(xl, lec)
    ws = xl.ActiveSheet

    def pasul1():
        lec["pasi"][0]["proba"](ws, xl)
        ghid.root.after(1200, pasul2)

    def pasul2():
        verifica(ghid.i == 1, f"după pasul 1 ghidul e la pasul 2 (e la {ghid.i + 1})")
        ghid.inapoi()
        ghid.root.after(1200, pasul3)

    def pasul3():
        verifica(ghid.i == 0, "„‹ Înapoi” arată pasul 1")
        verifica(ghid.i == 0 and "deja făcut" in ghid.balon.stare.cget("text"), "pasul 1 revăzut: „Pas deja făcut”")
        verifica(ghid.balon.b_inainte.winfo_ismapped(), "butonul „Înainte ›” e vizibil")
        verifica(not ghid.balon.b_sari.winfo_ismapped(), "„Sari pasul” e ascuns pe un pas revăzut")
        ghid.inainte()
        ghid.root.after(900, pasul4)

    def pasul4():
        verifica(ghid.i == 1, "„Înainte ›” revine la pasul 2 (nu sare mai departe)")
        verifica(ghid.balon.b_sari.winfo_ismapped(), "pe pasul curent se vede „Sari pasul”")
        lec["pasi"][1]["proba"](ws, xl)
        ghid.root.after(1200, pasul5)

    def pasul5():
        verifica(ghid.i == 2, "pasul 2 făcut -> pasul 3 (ghidul merge mai departe normal)")
        xl.ActiveWorkbook.Saved = True
        xl.Quit()
        ghid.inchide()

    ghid.root.after(2500, pasul1)
    ghid.ruleaza()

print(len(probleme))
