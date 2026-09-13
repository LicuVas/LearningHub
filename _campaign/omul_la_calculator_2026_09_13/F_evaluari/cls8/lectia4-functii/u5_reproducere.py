"""U5 - reproducerea semnalarilor, pe fisierele recalculate de LibreOffice + citatele cautate in innerText.txt.
A) adresele notelor: lectia pune B2:B9 = 7,9,5,10,8,6,4,9, apoi spune ca 10 e in B4 si 4 e in B7 (in foaie: B5 si B8).
B) Function Wizard / Home -> Number: numele din lectie cautate in textul brut Microsoft (surse/*.txt).
C) zecimale cu punct (7.25, 20.71) vs ce afiseaza randarea ro-RO.
Iesire: u5_reproducere.txt; tipareste <= 20 de randuri."""
import html
import json
import re
from pathlib import Path

import openpyxl

L = Path(__file__).resolve().parent
txt = re.sub(r"\s+", " ", (L / "innerText.txt").read_text(encoding="utf-8"))
v = openpyxl.load_workbook(L / "recalculat" / "incearca_note.xlsx", data_only=True)
a = openpyxl.load_workbook(L / "recalculat" / "atomi_note.xlsx", data_only=True)
out = []


def cit(fr):
    return f"  citat in innerText.txt: [{fr}] -> {'GASIT' if fr in txt else 'LIPSESTE'}"


out.append("A) Adresele notelor in foaia construita dupa lectie (Incearca, B2:B9 = 7,9,5,10,8,6,4,9)")
ws = v["Incearca"]
out.append("  " + ", ".join(f"B{r}={ws[f'B{r}'].value}" for r in range(2, 10)))
out.append(f"  MATCH: nota 10 pe randul {ws['G2'].value}, nota 4 pe randul {ws['G4'].value}")
out.append(cit("Schimba nota din B4 din 10 in 3."))
out.append(f"  Pas 6 luat literal (B4 -> 3): MIN={v['Pas6_B4_3']['E2'].value}, MAX={v['Pas6_B4_3']['E3'].value}, AVERAGE={v['Pas6_B4_3']['E4'].value}"
           f" | daca schimba nota 10 (B5 -> 3): MIN={v['Pas6_nota10_3']['E2'].value}, MAX={v['Pas6_nota10_3']['E3'].value}, AVERAGE={v['Pas6_nota10_3']['E4'].value}")
out.append(cit("Schimbam B7 din 4 in 10."))
out.append(cit("Acum cel mai mic e 5, nu mai e 4"))
out.append(cit("Ramane 10 (aveam deja un 10 in B4)"))
s7, s8 = a["Atom8_B7_la_10"], a["Atom8_nota4_la_10"]
out.append(f"  Atom 8 luat literal (B7 -> 10; in B7 era 6, nu 4): MIN={s7['E1'].value}, AVERAGE={s7['E3'].value}"
           f" | lectia spune MIN=5, AVERAGE=8, ce da doar B8 -> 10: MIN={s8['E1'].value}, AVERAGE={s8['E3'].value}")
out.append("")
out.append("B) Numele din lectie contra textului brut Microsoft")
for fis, fr in (("surse/fx_en.txt", "Function Wizard"), ("surse/fx_ro.txt", "Inserare funcție"), ("surse/zecimale_ro.txt", "Mărire zecimală"),
                ("surse/zecimale_en.txt", "Increase Decimal")):
    t = (L / fis).read_text(encoding="utf-8")
    m = re.search(r"\[" + re.escape(fr) + r"\] aparitii: (\d+)", t)
    out.append(f"  {fis}: [{fr}] aparitii = {m.group(1) if m else 'necautat'}")
out.append(cit("Function Wizard - Ghidul tau pas cu pas"))
out.append(cit("Rotunjeste mediile la 2 zecimale (Home -> Number -> creste/scade zecimale)."))
out.append("")
out.append("C) Zecimale: lectia scrie cu punct, randarea LibreOffice pe ro-RO afiseaza")
j = json.loads((L / "07_redeschis.json").read_text(encoding="utf-8"))["text_afisat_in_pdf_LibreOffice"]
out.append(f"  ex2_meteo.pdf contine '20,71429': {'20,71429' in j.get('ex2_meteo.pdf', '')} | '20.71': {'20.71' in j.get('ex2_meteo.pdf', '')}")
out.append(f"  incearca_note.pdf contine '7,25': {'7,25' in j.get('incearca_note.pdf', '')}")
out.append(cit("Temperaturi: =MIN(B2:B8)=15, =MAX(B2:B8)=28, =AVERAGE(B2:B8)=20.71 (145/7)."))
(L / "u5_reproducere.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(x[:230] for x in out[:22]))
