# Asamblează ghidul consolidat 00_GHID_LECTII.md din părțile dirijorului (parti\) și fișele unificate (unificat\U1-U7).
# Ultima linie = numărul de probleme (secțiuni așteptate care lipsesc).
import re
from pathlib import Path

G = Path(__file__).resolve().parent.parent          # ghid_consolidat_25_10
CAMP = G.parent                                      # revizuire_completa_2026_09
P, U = G / "parti", G / "unificat"
probleme = []


def citeste(p):
    return p.read_text(encoding="utf-8").replace("\r\n", "\n")


def sectiuni(text):
    """intro (fără titlul #) + lista (titlu, corp) pe niveluri ##"""
    linii = text.split("\n")
    if linii and linii[0].startswith("# "):
        linii = linii[1:]
    intro, sec, cur = [], [], None
    for l in linii:
        if l.startswith("## "):
            cur = [l[3:].strip(), []]
            sec.append(cur)
        elif cur is None:
            intro.append(l)
        else:
            cur[1].append(l)
    return "\n".join(intro).strip(), [(t, "\n".join(c).strip()) for t, c in sec]


def fisa(nume):
    f = next(U.glob(nume + "_*.md"))
    return sectiuni(citeste(f))


depasite, anexa_surse = [], ""


def parte(titlu_parte, nume_fisa, harta, pastreaza_intro=False, doar=None):
    global anexa_surse
    intro, sec = fisa(nume_fisa)
    iesire = [f"# {titlu_parte}", ""]
    if pastreaza_intro and intro:
        iesire += [intro, ""]
    vazute = set()
    for t, corp in sec:
        cheie = next((k for k in harta if t.upper().startswith(k)), None)
        if t.startswith("Depășite"):
            depasite.append((titlu_parte.split(" — ")[0], corp))
            continue
        if t.startswith("Numărătoare"):
            continue
        if t.startswith("Anexa"):
            anexa_surse += f"### {titlu_parte.split(' — ')[0]}: {t}\n\n{corp}\n\n"
            continue
        if cheie is None:
            probleme.append(f"{nume_fisa}: secțiune necunoscută „{t}”")
            continue
        if doar is not None and cheie not in doar:
            continue
        vazute.add(cheie)
        iesire += [f"## {harta[cheie]}", "", corp, ""]
    for k in harta:
        if (doar is None or k in doar) and k not in vazute:
            probleme.append(f"{nume_fisa}: lipsește secțiunea {k}")
    return "\n".join(iesire).strip() + "\n"


CONTR = "CONTRADIC"
bucati = [citeste(P / "0_antet.md"), citeste(P / "I_esential.md")]
bucati.append(parte("Partea II — Structura lecției și scrisul", "U1",
                    {"STRUCTURA": "II.1 Structura", "TEXT": "II.2 Textul",
                     CONTR: "II.3 Contradicții găsite la unificare (hotărârile: Partea X)"}))
bucati.append(parte("Partea III — Simulatoarele, testele, telefonul", "U2",
                    {"SIMULATOR": "III.1 Simulatorul", "TEST": "III.2 Testele și mesajele",
                     "TELEFON": "III.3 Telefonul",
                     CONTR: "III.4 Contradicții găsite la unificare (hotărârile: Partea X)"}))
bucati.append(parte("Partea IV — Imaginile și evaluarea", "U7",
                    {"IMAGINI": "IV.1 Imaginile", "EVALUARE": "IV.2 Evaluarea și notarea",
                     CONTR: "IV.3 Contradicții găsite la unificare (hotărârile: Partea X)"}))
bucati.append(parte("Partea V — Siguranța datelor, publicarea, componentele comune", "U4",
                    {"SIGURANTA_DATE": "V.1 Siguranța datelor și a calculatorului profesorului",
                     "PUBLICARE": "V.2 Publicarea", "COMPONENTE": "V.3 Componentele comune",
                     CONTR: "V.4 Contradicții găsite la unificare (hotărârile: Partea X)"}))
bucati.append(parte("Partea VI — Procesul: autorul, judecătorul, dirijorul, bugetul", "U5",
                    {"PROCES_AUTOR": "VI.1 Autorul", "PROCES_JUDECATOR": "VI.2 Judecătorul",
                     "PROCES_DIRIJOR": "VI.3 Dirijorul", "BUGET": "VI.4 Bugetul (consum, modele, context, durata)",
                     CONTR: "VI.5 Contradicții găsite la unificare (hotărârile: Partea X)"}))
H6 = {"DECIZIE_VASILE": "IX.1 Deciziile lui Vasile (cu vorbele lui) și cele luate fără el",
      "DESCHIS": "IX.2 Probleme deschise", "IDEE": "IX.3 Idei de viitor",
      "OPERARE": "VII.1 Operarea", CONTR: "IX.4 Contradicții găsite la unificare (hotărârile: Partea X)"}
bucati.append(parte("Partea VII — Operarea: tura lungă, procese, Windows, Git Bash", "U6", H6, doar={"OPERARE"}))
bucati.append(parte("Partea VIII — Aplicațiile reale: faptele probate, pe aplicație", "U3",
                    {"APLICATIE_REALA": "VIII.1 Faptele, pe aplicație (A-W)",
                     CONTR: "VIII.2 Contradicții găsite la unificare (hotărârile: Partea X)"},
                    pastreaza_intro=True))
# depășitele din U6 se adună o singură dată (la partea IX)
dep_inainte = len(depasite)
bucati.append(parte("Partea IX — Deciziile lui Vasile, probleme deschise, idei", "U6", H6,
                    doar={"DECIZIE_VASILE", "DESCHIS", "IDEE", CONTR}))
# U6 a fost citit de două ori: păstrăm o singură copie a „Depășite” din U6
u6 = [d for d in depasite if d[0].startswith("Partea VII")]
depasite = [d for d in depasite if not d[0].startswith("Partea VII")]
x = citeste(P / "X_hotarari.md")
for vechi, nou in (("**K", "**II-K"), ("**3.", "**III-"), ("**5.", "**V-"), ("**6.", "**VI-"), ("**7.", "**IV-")):
    x = x.replace(vechi, nou)
bucati.append(x)
anexe = citeste(P / "Z_anexe_AB.md").strip() + "\n\n## Anexa C — Ce nu mai e valabil (depășite, văzute la unificare)\n\n"
for titlu, corp in depasite:
    nume = titlu.replace("Partea IX", "Partea VII și IX")
    anexe += f"### {nume}\n\n{corp}\n\n"
anexe += "## Anexa D — Surse în plus (peste cele 4 trimiteri din regulă)\n\n" + (anexa_surse or "(niciuna)\n\n")
e = P / "Z_anexa_E.md"
anexe += (citeste(e).strip() if e.exists() else "## Anexa E — Verificarea ghidului\n\n(de completat)") + "\n\n"
anexe += citeste(P / "Z_anexa_F.md").strip() + "\n"
bucati.append(anexe)

text = "\n\n".join(b.strip() for b in bucati) + "\n"
# niciun titlu „## …” din fișe nu trebuie să rămână cu numele categoriei brute
for cat in ("## STRUCTURA", "## TEXT", "## SIMULATOR", "## TEST", "## TELEFON", "## APLICATIE_REALA",
            "## SIGURANTA_DATE", "## PUBLICARE", "## COMPONENTE", "## PROCES_", "## BUGET", "## DECIZIE", "## DESCHIS",
            "## IDEE", "## OPERARE"):
    if re.search("^" + re.escape(cat) + r"\b", text, re.M):
        probleme.append(f"a rămas titlul brut {cat}")
iesire = CAMP / "00_GHID_LECTII.md"
iesire.write_text(text, encoding="utf-8")
print(f"scris {iesire} — {len(text)} caractere, {text.count(chr(10))} rânduri, {len(re.findall(r'^# ', text, re.M))} părți")
for p_ in probleme:
    print("PROBLEMĂ:", p_)
print(len(probleme))
