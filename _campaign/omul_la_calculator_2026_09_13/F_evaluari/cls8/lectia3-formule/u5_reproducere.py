"""U5 - reproducerea semnalarilor pe fisier: citatul din innerText.txt langa valoarea calculata de LibreOffice (recalculat/)
si langa sursa primara descarcata (surse/). Iesire: u5_reproducere.txt; tipareste <= 20 de randuri."""
from pathlib import Path

import openpyxl

L = Path(__file__).resolve().parent
txt = (L / "innerText.txt").read_text(encoding="utf-8")


def rec(fis, foaie, cel):
    return openpyxl.load_workbook(L / "recalculat" / fis, data_only=True)[foaie][cel].value


def are(fraza):
    return f"{fraza!r} in innerText.txt: {fraza in txt}"


linii = [
    "[cls8-l3-01] Indiciul „Blocat la pasul 5”",
    "  " + are("Rezultatul ar trebui sa fie 78 (27 + 21 + 29)."),
    f"  LibreOffice incearca_catalog.xlsx Catalog!E5 (=SUM(E2:E4)) = {rec('incearca_catalog.xlsx', 'Catalog', 'E5')}",
    f"  LibreOffice Catalog!H2 (=E2+E3+E4) = {rec('incearca_catalog.xlsx', 'Catalog', 'H2')} | Python 27+21+29 = {27 + 21 + 29}",
    f"  Tabelul din atomul 6 al aceleiasi lectii: Total general 77 -> {are('Total general: 27+21+29 = 77')}",
    "  VERDICT: rosu - indiciul spune 78, Excel/LibreOffice si lectia insasi dau 77.",
    "",
    "[cls8-l3-02] Rezolvarea Ex. 2, varianta fara $",
    "  " + are("adica celule goale"),
    f"  LibreOffice ex2_excursie.xlsx Fara_dolar!C4 (=B4*B2) = {rec('ex2_excursie.xlsx', 'Fara_dolar', 'C4')}  (B2 = 'Pret/elev')",
    f"  LibreOffice Fara_dolar!C5 (=B5*B3) = {rec('ex2_excursie.xlsx', 'Fara_dolar', 'C5')}  (35 x 45, gresit fara semn de eroare)",
    "  VERDICT: rosu - nu sunt celule goale: o eroare + numere gresite care arata a raspuns bun.",
    "",
    "[cls8-l3-03] Cota TVA din atomul 7",
    "  " + are("Ai in celula B1 cota de TVA (19%)."),
    "  Sursa: surse/tva_L141_2025.txt - Legea 141/2025, art. 291 (1): nivelul cotei standard „este 21%”, aplicabil de la 1 august 2025.",
    f"  LibreOffice atomi_verificari.xlsx TVA!C5 (19%) = {rec('atomi_verificari.xlsx', 'TVA', 'C5')} | TVA21!C5 (21%) = {rec('atomi_verificari.xlsx', 'TVA21', 'C5')}",
]
(L / "u5_reproducere.txt").write_text("\n".join(linii), encoding="utf-8")
print("\n".join(linii)[:2000])
