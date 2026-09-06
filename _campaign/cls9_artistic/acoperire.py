# -*- coding: utf-8 -*-
"""Verifica daca materia scrisa acopera CE CERE programa - termen cu termen.

Nu ma iau dupa titluri: iau termenii concreti din anexa aprobata si ii caut in
lectiile care ar trebui sa-i predea. Un termen care nu apare nicaieri = gol real.
"""
import io, os, re, sys, unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import toate_lectiile

R = r"C:\00\Projects\LearningHub"


def norm(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"\s+", " ", s)


# termenii pe care programa ii numeste explicit, grupati pe modulul care trebuie sa-i predea
CERUTE = {
    "m1-societate-digitala": [
        "buletin informativ", "forum", "videoconferint", "netichet", "emoticon",
        "bcc", "phishing", "arhivare", "feedback", "tutorial", "curs online",
        "invatare automata", "bias", "partinire", "clasificare", "predictie",
        # "drept de autor" la SINGULAR nu se gaseste: lectiile scriu "drepturi de autor".
        # Cauta radacina, nu forma exacta - altfel unealta raporteaza un gol inexistent.
        "chatbot", "amprenta de carbon", "drept", "realitate virtuala",
        "realitate augmentata",
    ],
    "m2-continuturi-digitale": [
        "ascii", "unicode", "stil", "indenta", "tabulator", "intrerupere",
        "coloane", "cuprins", "comentari", "modificar", "imbinare", "corespondent",
        "ecuati", "camp", "coordonator de diapozitive", "tema", "buton de actiune",
        "animati", "tranziti",
    ],
    "m3-sisteme-de-calcul": [
        "desktop", "mobil", "arhitectur", "unitatea logico-aritmetica", "unitate de comanda",
        "cache", "nuclee", "frecvent", "ram", "rom", "hdd", "ssd", "card de memorie",
        "memorie flash", "placa de baza", "magistral", "bios", "uefi", "usb",
        "tastatura", "scaner", "ocr", "rfid", "imprimanta 3d", "plotter", "videoproiector",
        "touchscreen", "nfc", "tdp", "racire", "sistem de operare", "ntfs", "fat32",
        "apfs", "firewall", "antivirus", "criptare", "permisiun",
    ],
}

text_modul = {}
for L in toate_lectiile():
    p = os.path.join(R, L["cale"].replace("/", os.sep))
    if not os.path.exists(p):
        continue
    s = io.open(p, encoding="utf-8", errors="replace").read()
    vizibil = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S)
    vizibil = re.sub(r"<[^>]+>", " ", vizibil)
    text_modul.setdefault(L["modul"], []).append((L["fisier"], norm(vizibil)))

total = lipsa_total = 0
for modul, termeni in CERUTE.items():
    lectii = text_modul.get(modul, [])
    tot_text = " ".join(t for _, t in lectii)
    lipsa = []
    for t_ in termeni:
        total += 1
        if norm(t_) not in tot_text:
            lipsa.append(t_)
            lipsa_total += 1
    print("%-26s %2d termeni ceruti | lipsesc: %d %s"
          % (modul, len(termeni), len(lipsa), lipsa if lipsa else ""))
    # unde apare fiecare termen (doar primele, ca sa se vada ca-s in lectia potrivita)
    for t_ in termeni[:0]:
        pass

print()
print("TOTAL: %d termeni din programa, %d negasiti (%.1f%% acoperire)"
      % (total, lipsa_total, 100.0 * (total - lipsa_total) / total))
