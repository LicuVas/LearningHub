# -*- coding: utf-8 -*-
"""Control pentru converteste_atomi_vechi.py.

Ce trebuie sa dovedeasca: dupa conversie motorul CHIAR poate citi chestionarul
(clasa .atom + data-quiz care se parseaza), variantele raman in ordinea lor si
litera corecta arata spre aceeasi varianta ca inainte. Si, la fel de important:
un bloc caruia ii lipseste ceva se SARE, nu se stalceste.
"""
import io, os, sys, json, re, html as _html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from converteste_atomi_vechi import converteste

T = []
def t(n, v): T.append((n, bool(v)))

VECHI = '''<div class="atoms">
<div class="atom-card" data-atom="1">
    <div class="atom-header"><h3 class="atom-title">Definitia</h3></div>
    <div class="atom-content"><p>O baza de date e o colectie organizata.</p></div>
    <div class="atom-quiz" data-qid="atom-1-q0">
        <div class="atom-question-text">Ce este o baza de date?</div>
        <div class="atom-options">
        <div class="atom-option">Un program de desenat</div>
        <div class="atom-option">O colectie organizata de informatii</div>
        <div class="atom-option">Un joc video</div>
        <div class="atom-option">Un fisier text simplu</div>
        </div>
        <div class="atom-feedback"></div>
        <div class="atom-quiz-data" style="display:none;">
            {"correct": "b"}
        </div>
    </div>
</div>
</div>'''

nou, n, sar = converteste(VECHI)
t("converteste atomul", n == 1 and not sar)
t("clasa e acum .atom (ce cauta motorul)", 'class="atom"' in nou and 'class="atom-card"' not in nou)
t("atomul are identificator", re.search(r'id="atom-1"', nou))

m = re.search(r'data-quiz="([^"]*)"', nou)
t("exista atributul data-quiz", m)
date = json.loads(_html.unescape(m.group(1))) if m else None
t("data-quiz e o LISTA (obiectul omoara pagina)", isinstance(date, list) and len(date) == 1)
q = date[0] if date else {}
t("intrebarea e pastrata", q.get("question") == "Ce este o baza de date?")
t("cele 4 variante sunt pastrate, in ordine",
  q.get("options") == ["Un program de desenat", "O colectie organizata de informatii",
                       "Un joc video", "Un fisier text simplu"])
t("litera corecta arata spre ACEEASI varianta ca inainte",
  q.get("correct") == "b" and q["options"][ord(q["correct"]) - 97] == "O colectie organizata de informatii")
t("containerul de chestionar e golit (motorul isi scrie singur continutul)",
  '<div class="atom-quiz"></div>' in nou)
t("continutul lectiei e neatins", "O baza de date e o colectie organizata." in nou and "Definitia" in nou)
t("nu mai raman resturi din formatul vechi",
  "atom-quiz-data" not in nou and "atom-question-text" not in nou and 'class="atom-option"' not in nou)

# --- NEGATIV: ce trebuie SARIT, nu stalcit ---
fara_litera = VECHI.replace('{"correct": "b"}', '{"correct": "z"}')
nou2, n2, sar2 = converteste(fara_litera)
t("NEGATIV: litera care nu are varianta => sarit, fisier neatins", n2 == 0 and nou2 == fara_litera and len(sar2) == 1)

rupt = VECHI.replace('<div class="atom-quiz-data" style="display:none;">\n            {"correct": "b"}\n        </div>', '')
nou3, n3, sar3 = converteste(rupt)
t("NEGATIV: fara litera corecta => sarit, fisier neatins", n3 == 0 and nou3 == rupt and len(sar3) == 1)

nimic = "<p>o pagina fara atomi vechi</p>"
nou4, n4, sar4 = converteste(nimic)
t("NEGATIV: pagina fara atom-card ramane neatinsa", n4 == 0 and nou4 == nimic and not sar4)

# atom de continut, fara chestionar: se redenumeste, dar nu primeste data-quiz
doar_continut = '<div class="atom-card" data-atom="3"><div class="atom-content"><p>doar text</p></div></div>'
nou5, n5, sar5 = converteste(doar_continut)
t("atomul fara chestionar se redenumeste, fara data-quiz",
  n5 == 1 and 'class="atom"' in nou5 and "data-quiz" not in nou5 and "doar text" in nou5)

for n_, v in T:
    print(("  PASS  " if v else "  FAIL  ") + n_)
b = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if b == len(T) else "FAIL", b, len(T)))
sys.exit(0 if b == len(T) else 1)
