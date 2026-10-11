p=r'C:/00/Projects/LearningHub/cum-fac/cautare.js'
s=open(p,encoding='utf8').read()
rep=[
(""" *     program, fișele care numesc ALT program trec în spate (× alt_program) și nu pot fi „am găsit” pe locul 1.
 * Ponderile și pragul stau în sensuri.json („reglaj”), ca reglajul să nu atingă codul.""",""" *     program, fișele care numesc ALT program trec în spate (× alt_program) și nu pot fi „am găsit” pe locul 1;
 *     numele programului scris greșit („clipchap”) contează și el.
 * 13. aplicatii.<app>.neacoperite: gesturile acelei aplicații care NU sunt în materie (la audio: tăiat, efecte, export;
 *     la web: imagini, legături, tabele); țin doar când primul rezultat e al aplicației sau întrebarea o numește.
 * 14. articolul: „site-ul”, „slide-urile” se lipesc la loc (= site, slide); cu articol_necunoscut, un cuvânt necunoscut
 *     care e un cuvânt scurt + articol („josul”) se citește fără articol, înainte de corectarea greșelilor.
 * 15. margine_slab: la marginea candidaților (pct. 11), un cuvânt găsit doar în pași / rezultat cântărește atât.
 * Ponderile și pragul stau în sensuri.json („reglaj”), ca reglajul să nu atingă codul."""),
("""  var VERSIUNE = '1.3 (11.10.2026, aplicația audio: Audacity, Clipchamp; aplicatii.<app>.acopera)';""","""  var VERSIUNE = '1.4 (11.10.2026, reglajul nr. 3: aplicatii.<app>.neacoperite, articolul, margine_slab)';"""),
("""    prag_lung: 0.4,
    grup_nume_aplicatie: null
  };""","""    prag_lung: 0.4,
    grup_nume_aplicatie: null,
    articol_necunoscut: false, // „josul” = jos + ul (cuvântul necunoscut, fără articol)
    margine_slab: null,        // null = marginea candidaților socotită pe toate câmpurile la fel (ca înainte)
    pondere_tare: 0            // cât contează la ordonare acoperirea pe câmpurile tari (0 = deloc, ca înainte)
  };"""),
]
for a,b in rep:
    assert a in s, a[:60]
    s=s.replace(a,b)
open(p,'w',encoding='utf8').write(s)
print('ok')
