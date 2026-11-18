# -*- coding: utf-8 -*-
"""Înghețarea reperelor (contract, Etapa 0): sha256 pe tot ce MĂSOARĂ, ca o rundă de reparație să nu-și poată muta ținta.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/ingheata.py              # scrie repere.lock
    python .../ingheata.py --verifica           # compară discul cu lacătul; ultima linie = abateri (0 = intact, -1 = lacăt lipsă)
    python .../ingheata.py --arata              # ce s-ar îngheța (nu scrie nimic)
    python .../ingheata.py --acoperire "motiv"  # REîngheață peste un lacăt existent (doar runda marcată `acoperire`)
    python .../ingheata.py --dosar <alt dosar>  # probe pe o copie (implicit: dosarul scriptului)

Ce se îngheață (căi relative la dosarul lucrării D):
  oracole/**            oracolele O1-O9, masoara.py, porti.py, porti_extra/, convențiile, modulele comune
  referinte/**          dump-urile UIA, scenarii_real/, verdicte_vechi.json, surse_microsoft.md, ...
  scenarii/**           scenariile de comportament
  suprafete.json        lista suprafețelor și a gesturilor
  api_biblioteca.md     contractul API al bibliotecii
  inventar.json         intrarea oracolelor (lista paginilor): scoasă o pagină de aici, oracolele n-ar mai vedea-o
  unelte ale buclei     opreste.py, opreste_sim.py, ingheata.py, pregateste_runda.py, mutanti/mutanti.py, mutanti/banca.json
                        (regula de oprire și bancul de mutanți nu se schimbă într-o rundă de reparație)
Nu se îngheață (ieșiri, se schimbă la fiecare rulare): __pycache__/, *.pyc, iar în oracole/: _iesiri/**, *.png, *.jpg,
*.jpeg, *.webm, *.log și <x>.json când există <x>.py în același folder (JSON-ul cu detalii al oracolului, vezi
oracole/CONVENTIE_RADACINA.md). Un fișier NOU apărut în zona înghețată după înghețare = abatere (lacăt rupt).
La înghețare, lipsa unui reper cerut (cele 9 oracole, masoara.py, porti.py, suprafete.json, api_biblioteca.md,
referinte/verdicte_vechi.json, cel puțin un scenariu) OPREȘTE scrierea, dacă nu dai --permite-lipsa (atunci lipsa e scrisă în lacăt).
"""
import argparse
import hashlib
import json
import sys
import time
from pathlib import Path

AICI = Path(__file__).resolve().parent
NUME_LACAT = "repere.lock"
DIRECTOARE = ["oracole", "referinte", "scenarii"]
FISIERE = ["suprafete.json", "api_biblioteca.md", "inventar.json",
           "opreste.py", "opreste_sim.py", "ingheata.py", "pregateste_runda.py", "mutanti/mutanti.py", "mutanti/banca.json"]
ORACOLE = ["oracol_central", "oracol_identic", "oracol_ui", "oracol_comportament", "oracol_evenimente", "oracol_sarcini",
           "oracol_text_ui", "oracol_comenzi_moarte", "oracol_asistare"]
CERUTE = [f"oracole/{o}.py" for o in ORACOLE] + ["oracole/masoara.py", "oracole/porti.py", "suprafete.json", "api_biblioteca.md",
                                                  "referinte/verdicte_vechi.json", "inventar.json"]
EXT_IESIRE = {".png", ".jpg", ".jpeg", ".webm", ".log"}
EXCLUDERI = ["__pycache__/ și *.pyc (oriunde)",
             "oracole/**/_iesiri/**",
             "oracole/**/*.png|*.jpg|*.jpeg|*.webm|*.log",
             "oracole/**/<x>.json când există <x>.py în același folder (detaliile oracolului)"]


def exclus(rel):
    """rel = cale relativă la D, cu /"""
    parti = rel.split("/")
    if "__pycache__" in parti or rel.endswith(".pyc"):
        return True
    if parti[0] != "oracole":
        return False
    if "_iesiri" in parti[1:]:
        return True
    p = Path(rel)
    if p.suffix.lower() in EXT_IESIRE:
        return True
    return False


def exclus_cu_disc(d, rel):
    if exclus(rel):
        return True
    p = Path(rel)
    if p.parts[0] == "oracole" and p.suffix.lower() == ".json" and (d / p.with_suffix(".py")).exists():
        return True
    return False


def sha(f):
    h = hashlib.sha256()
    with open(f, "rb") as fh:
        for b in iter(lambda: fh.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


def colecteaza(d):
    """{cale relativă: sha256} pentru tot ce e înghețat acum pe disc"""
    out = {}
    for sub in DIRECTOARE:
        baza = d / sub
        if not baza.exists():
            continue
        for f in sorted(baza.rglob("*")):
            if f.is_file():
                rel = f.relative_to(d).as_posix()
                if not exclus_cu_disc(d, rel):
                    out[rel] = sha(f)
    for rel in FISIERE:
        f = d / rel
        if f.is_file():
            out[rel] = sha(f)
    return dict(sorted(out.items()))


def amprenta(fis):
    return hashlib.sha256("\n".join(f"{k} {v}" for k, v in sorted(fis.items())).encode()).hexdigest()


def lipsuri(d, fis):
    l = [c for c in CERUTE if c not in fis]
    if not any(k.startswith("scenarii/") and k.endswith(".json") for k in fis):
        l.append("scenarii/**/*.json (niciun scenariu)")
    return l


def citeste_lacat(d):
    f = d / NUME_LACAT
    if not f.exists():
        return None
    return json.loads(f.read_text(encoding="utf-8"))


def verifica(d=AICI):
    """Pentru masoara.py: {'stare': 'ok'|'rupt'|'absent', 'abateri': [...], 'creat', 'numar_fisiere'}"""
    lac = citeste_lacat(d)
    if lac is None:
        return {"stare": "absent", "abateri": [], "creat": None, "numar_fisiere": 0}
    acum = colecteaza(d)
    vechi = lac.get("fisiere", {})
    ab = []
    for k, v in vechi.items():
        if k not in acum:
            ab.append({"fel": "LIPSĂ", "cale": k})
        elif acum[k] != v:
            ab.append({"fel": "SCHIMBAT", "cale": k})
    for k in acum:
        if k not in vechi:
            ab.append({"fel": "NOU", "cale": k})
    return {"stare": "ok" if not ab else "rupt", "abateri": ab, "creat": lac.get("creat"), "numar_fisiere": len(vechi),
            "amprenta": lac.get("amprenta_totala")}


def scrie(d, motiv, permite_lipsa, acoperire):
    acum = colecteaza(d)
    l = lipsuri(d, acum)
    vechi = citeste_lacat(d)
    istoric = []
    if vechi is not None:
        if vechi.get("fisiere") == acum:
            print(f"repere.lock e deja la zi ({len(acum)} fișiere, creat {vechi.get('creat')}); nu rescriu.")
            print(d / NUME_LACAT)
            print(0)
            return 0
        if not acoperire:
            v = verifica(d)
            print("Există deja un repere.lock și discul diferă de el. O rundă de reparație NU reîngheață.")
            for a in v["abateri"][:30]:
                print(f"  {a['fel']:8} {a['cale']}")
            print('Doar runda marcată `acoperire` reîngheață: python ingheata.py --acoperire "<motivul>"')
            print(len(v["abateri"]))
            return 1
        istoric = vechi.get("istoric", []) + [{"creat": vechi.get("creat"), "motiv": vechi.get("motiv"),
                                                "amprenta_totala": vechi.get("amprenta_totala"), "numar_fisiere": len(vechi.get("fisiere", {}))}]
    if l and not permite_lipsa:
        print("NU îngheț: lipsesc reperele cerute:")
        for x in l:
            print("  LIPSĂ " + x)
        print("(după ce le scriu agenții lor, rulează din nou; --permite-lipsa îngheață oricum și notează lipsa în lacăt)")
        print(len(l))
        return 1
    lac = {
        "versiune": 1,
        "despre": "Reperele înghețate ale lucrării „Aplicațiile fidele” (contract, Etapa 0). Scris de ingheata.py; verificat de "
                  "ingheata.py --verifica și de oracole/masoara.py la începutul și la sfârșitul fiecărei măsurări. Nu edita de mână.",
        "creat": time.strftime("%Y-%m-%d %H:%M:%S"),
        "motiv": acoperire or motiv,
        "acoperire": bool(acoperire),
        "directoare": DIRECTOARE,
        "fisiere_singure": FISIERE,
        "excluderi": EXCLUDERI,
        "lipsa_permisa": l,
        "numar_fisiere": len(acum),
        "amprenta_totala": amprenta(acum),
        "istoric": istoric,
        "fisiere": acum,
    }
    (d / NUME_LACAT).write_text(json.dumps(lac, ensure_ascii=False, indent=1), encoding="utf-8")
    pe = {}
    for k in acum:
        g = k.split("/")[0] if "/" in k else k
        pe[g] = pe.get(g, 0) + 1
    print(f"repere.lock scris: {len(acum)} fișiere ({', '.join(f'{g} {n}' for g, n in pe.items())}); amprenta {lac['amprenta_totala'][:16]}")
    if l:
        print(f"ATENȚIE: înghețat cu {len(l)} repere lipsă (--permite-lipsa): {', '.join(l)}")
    print(d / NUME_LACAT)
    print(0)
    return 0


def main():
    ap = argparse.ArgumentParser(description="Îngheață / verifică reperele (repere.lock).")
    ap.add_argument("--verifica", action="store_true")
    ap.add_argument("--arata", action="store_true")
    ap.add_argument("--acoperire", metavar="MOTIV", help="reîngheață peste un lacăt existent (runda `acoperire`)")
    ap.add_argument("--motiv", default="Etapa 0: reperele aprobate de verificatorul independent")
    ap.add_argument("--permite-lipsa", action="store_true")
    ap.add_argument("--dosar", help="alt dosar al lucrării (probe pe copii)")
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")
    d = Path(a.dosar).resolve() if a.dosar else AICI
    if a.arata:
        acum = colecteaza(d)
        for k, v in acum.items():
            print(f"{v[:12]}  {k}")
        for x in lipsuri(d, acum):
            print(f"LIPSĂ        {x}")
        print(f"fișiere de înghețat: {len(acum)} · repere cerute lipsă: {len(lipsuri(d, acum))}")
        print(len(lipsuri(d, acum)))
        return 0
    if a.verifica:
        v = verifica(d)
        if v["stare"] == "absent":
            print(f"repere.lock lipsește în {d} — nu e nimic înghețat încă.")
            print("(rulează ingheata.py după verificarea Etapei 0)")
            print(-1)
            return 2
        for x in v["abateri"]:
            print(f"  {x['fel']:8} {x['cale']}")
        print(f"repere.lock creat {v['creat']} · {v['numar_fisiere']} fișiere înghețate · abateri: {len(v['abateri'])}"
              + (" · INTACT" if v["stare"] == "ok" else " · RUPT"))
        print(d / NUME_LACAT)
        print(len(v["abateri"]))
        return 0 if v["stare"] == "ok" else 1
    return scrie(d, a.motiv, a.permite_lipsa, a.acoperire)


if __name__ == "__main__":
    sys.exit(main())
