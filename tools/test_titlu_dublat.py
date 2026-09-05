# -*- coding: utf-8 -*-
"""Control pentru repara_titlu_dublat.py: taie titlul repetat, si NIMIC altceva."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from repara_titlu_dublat import repara

CAP = '<div class="depth-box">\n            <h3>Vrei mai mult?</h3>\n            '
T = []
def t(n, v): T.append((n, bool(v)))

# 1. cazul real: <p><strong>Vrei mai mult?</strong></p> imediat dupa titlu
a = CAP + '<p><strong>Vrei mai mult?</strong></p><p>Provocare: fa ceva.</p>\n        </div>'
b, k = repara(a)
t("taie <p><strong>...</strong></p> repetat", k == 1 and "Provocare" in b and b.count("Vrei mai mult?") == 1)

# 2. varianta cu <h3> propriu in corp
a = CAP + '<h3>Vrei mai mult?</h3><p>Provocare: fa ceva.</p>\n        </div>'
b, k = repara(a)
t("taie si un <h3> repetat", k == 1 and b.count("Vrei mai mult?") == 1 and "Provocare" in b)

# 2b. titlul ca INCEPUT de paragraf, urmat de continut real: se taie DOAR eticheta
a = CAP + '<p><strong>Vrei mai mult?</strong> Deschide Setari si vezi ce procesor ai.</p>\n        </div>'
b, k = repara(a)
t("taie eticheta de la inceputul paragrafului, pastreaza textul",
  k == 1 and b.count("Vrei mai mult?") == 1 and "Deschide Setari si vezi ce procesor ai." in b)
t("nu lasa <p> gol sau <strong> orfan dupa taiere",
  "<p></p>" not in b and "<strong>" not in b.split("</h3>")[1])

# 3. NEGATIV: caseta corecta ramane neatinsa
a = CAP + '<p>Provocare: fa ceva.</p>\n        </div>'
b, k = repara(a)
t("NEGATIV: caseta fara titlu repetat ramane neatinsa", k == 0 and b == a)

# 4. NEGATIV: "Vrei mai mult?" ca parte dintr-o fraza NU se taie
a = CAP + '<p>Provocare: intreaba-te singur "Vrei mai mult?" si cauta mai departe.</p>\n        </div>'
b, k = repara(a)
t("NEGATIV: expresia dintr-o fraza nu se taie", k == 0 and b == a)

# 5. NEGATIV: al doilea titlu care apare MAI TARZIU in corp nu se taie
a = CAP + '<p>Provocare: fa ceva.</p><p><strong>Vrei mai mult?</strong></p>\n        </div>'
b, k = repara(a)
t("NEGATIV: al doilea titlu de mai tarziu nu se taie", k == 0 and b == a)

# 6. pagina fara caseta
a = "<p>o pagina oarecare</p>"
b, k = repara(a)
t("NEGATIV: pagina fara caseta ramane neatinsa", k == 0 and b == a)

# 7. taie o singura data, nu in bucla
a = CAP + '<p><strong>Vrei mai mult?</strong></p><p><strong>Vrei mai mult?</strong></p><p>x</p>\n        </div>'
b, k = repara(a)
t("taie un singur titlu pe trecere (idempotent, nu lacom)", k == 1 and b.count("Vrei mai mult?") == 2)

for n, v in T:
    print(("  PASS  " if v else "  FAIL  ") + n)
bune = sum(v for _, v in T)
print("VERDICT: %s %d/%d" % ("PASS" if bune == len(T) else "FAIL", bune, len(T)))
sys.exit(0 if bune == len(T) else 1)
