# -*- coding: utf-8 -*-
"""Un defect semnalat intr-un profil exista, de regula, in toate profilurile-frate:
lectiile sunt copii. Caut fiecare defect dupa o expresie distinctiva si intorc
TOATE fisierele care il contin, ca reparatia sa nu prinda 1 din 5."""
import os, io, json, re, sys
sys.path.insert(0, r"C:\00\Projects\LearningHub\tools")
import depth_io as D
R = r"C:\00\Projects\LearningHub"

# (indice problema, expresie distinctiva din CASETA, eticheta scurta)
ANCORE = [
    (0,  "H.265",                          "YouTube nu foloseste H.265 la livrare (VP9/AV1)"),
    (1,  "Monitorul Oficial",               "pretentie institutionala fara sursa"),
    (2,  None,                              "caseta repeta Atomul 2 (referinte absolute)"),
    (3,  "distructiv",                      "crop 'ramane distructiv' in Photoshop/GIMP - fals"),
    (6,  None,                              "caseta reface exemplul din Atomul 5 (axa taiata)"),
    (7,  None,                              "'Mai departe' repeta Atomul 3 (SCADA/ERP)"),
    (8,  None,                              "'Deschidere' repeta Atomul 4 (export Word)"),
    (9,  "spatiu neseparabil",                "caseta e din ALT subiect (tehnoredactare pe lectia de identitate digitala)"),
    (10, None,                              "cauzalitate falsa intre doua fapte corecte"),
    (11, "Biblioteci",                      "afirmatie despre bibliotecile digitale"),
    (12, "Evidenta.C:C",                    "sintaxa LibreOffice (punct) intr-un modul Excel - da eroare"),
    (13, None,                         "acelasi 'nou' (COUNTIF) in doua lectii ale modulului"),
    (14, None,                              "Provocarea repeta exemplul din lectie"),
    (15, None,                              "Provocarea repeta exemplul din lectie"),
    (16, None,                              "caseta reformuleaza Atomul 7"),
    (17, None,                              "caseta reformuleaza doua fapte deja predate"),
    (18, None,                              "afirmatie despre AI de tip patrulare"),
    (19, None,                              "'identic in motoare profesionale' - afirmatie tare"),
    (20, None,                              "cele 10 paragrafe repeta lectiile 1-6 ale modulului"),
    (21, None,                              "Provocarea repeta Exercitiul 3 din aceeasi lectie"),
    (22, "DA NUME unei versiuni",               "Provocarea repeta Exercitiul 2 si 3"),
]

probleme = json.load(io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "probleme_t7b.json"), encoding="utf-8"))

def caseta(p):
    """Doar textul casetei, nu toata pagina - altfel gasesc ancora in lectie."""
    s = io.open(p, encoding="utf-8", errors="replace").read()
    i = s.find('class="depth-box"')
    return s[i:i + 6000] if i >= 0 else ""

toate = []
for root, _, files in os.walk(os.path.join(R, "content")):
    for f in files:
        if f.endswith(".html"):
            toate.append(os.path.join(root, f))

lucru = []
for idx, ancora, eticheta in ANCORE:
    pb = probleme[idx]
    baza = pb["fisier"].replace("\\", "/")
    nume = os.path.basename(baza)
    if ancora:
        gasite = sorted(p for p in toate if ancora in caseta(p))
    else:
        # fara ancora textuala: iau toate fisierele cu ACELASI nume, sub acelasi modul
        modul = os.path.basename(os.path.dirname(baza)) if "/" in baza else None
        gasite = sorted(p for p in toate
                        if os.path.basename(p) == nume
                        and (modul is None or os.path.basename(os.path.dirname(p)) == modul))
    rel = [os.path.relpath(p, R).replace("\\", "/") for p in gasite]
    lucru.append({"idx": idx, "eticheta": eticheta, "ce": pb["ce_e_gresit"], "fisiere": rel})
    print("%2d  %2d fisiere  %s" % (idx, len(rel), eticheta[:70]))
    if len(rel) == 0:
        print("      !! nu am gasit niciun fisier - ancora:", ancora, "| raportat:", baza)

n = sum(len(x["fisiere"]) for x in lucru)
print("\nTOTAL de reparat: %d casete, in %d defecte distincte" % (n, len(lucru)))
io.open(os.path.join(R, "_campaign", "proba_elevi_2026_09_03", "valuri", "defecte_t7b.json"),
        "w", encoding="utf-8").write(json.dumps(lucru, ensure_ascii=False, indent=1))
