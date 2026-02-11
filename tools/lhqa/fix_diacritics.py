#!/usr/bin/env python3
"""
Romanian Diacritics Restoration for LearningHub
=================================================
Adds proper Romanian diacritics (ă, â, î, ș, ț) to lesson JSON content.
Only modifies string values, never JSON keys.

Usage:
    python -m tools.lhqa.fix_diacritics              # Fix all lessons
    python -m tools.lhqa.fix_diacritics --dry-run     # Preview changes
    python -m tools.lhqa.fix_diacritics V-M1-L05      # Single lesson
"""

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import json
import re
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tools.lhqa.loader import discover_all_lessons, lesson_path, load_lesson

# ============================================================
# WHOLE-WORD replacements (applied with word boundaries)
# Format: "without_diacritics": "with_diacritics"
# ============================================================
WORD_MAP = {
    # --- HIGH FREQUENCY conjunctions/prepositions/particles ---
    "si": "\u0219i",           # și (and) — 3220 occurrences
    "in": "\u00een",           # în (in)  — 2075 occurrences
    "sa": "s\u0103",           # să (subjunctive) — 1617 occurrences
    "daca": "dac\u0103",       # dacă (if) — 657
    "cand": "c\u00e2nd",       # când (when) — 444
    "dupa": "dup\u0103",       # după (after) — 312
    "pana": "p\u00e2n\u0103",  # până (until)
    "inca": "\u00eenc\u0103",  # încă (still)
    "insa": "\u00eens\u0103",  # însă (however)
    "intre": "\u00eentre",     # între (between)
    "inainte": "\u00eenainte", # înainte (before)

    # --- VERBS (common educational) ---
    "inseamna": "\u00eenseamn\u0103",     # înseamnă
    "invata": "\u00eenva\u021b\u0103",     # învață
    "invatam": "\u00eenv\u0103\u021b\u0103m", # învățăm
    "inveti": "\u00eenve\u021bi",          # înveți
    "invatat": "\u00eenv\u0103\u021bat",   # învățat
    "invete": "\u00eenve\u021be",          # învețe
    "intelege": "\u00een\u021belege",      # înțelege
    "intelegi": "\u00een\u021belegi",      # înțelegi
    "intelegem": "\u00een\u021belegem",    # înțelegem
    "inteles": "\u00een\u021beles",        # înțeles
    "incepe": "\u00eencepe",              # începe
    "incepem": "\u00eencepem",            # începem
    "inceput": "\u00eenceput",            # început
    "incerca": "\u00eencerc\u0103",       # încercă
    "inchide": "\u00eenchide",            # închide
    "inchidere": "\u00eenchidere",        # închidere
    "deschisa": "deschis\u0103",          # deschisă
    "deschise": "deschise",               # no change
    "gaseste": "g\u0103se\u0219te",       # găsește
    "gaseasca": "g\u0103seasc\u0103",     # găsească
    "gasesc": "g\u0103sesc",              # găsesc
    "gasesti": "g\u0103se\u0219ti",       # găsești
    "gasit": "g\u0103sit",               # găsit
    "arata": "arat\u0103",               # arată
    "adauga": "adaug\u0103",             # adaugă
    "adaugam": "ad\u0103ug\u0103m",      # adăugăm
    "verifica": "verific\u0103",         # verifică
    "verificam": "verific\u0103m",       # verificăm
    "creeaza": "creeaz\u0103",           # creează
    "reprezinta": "reprezint\u0103",     # reprezintă
    "foloseste": "folose\u0219te",       # folosește
    "folosesti": "folose\u0219ti",       # folosești
    "foloseasca": "foloseasc\u0103",     # folosească
    "reuseste": "reu\u0219e\u0219te",    # reușește
    "reusesti": "reu\u0219e\u0219ti",    # reușești
    "scrie": "scrie",                    # no change
    "stie": "\u0219tie",                 # știe
    "stii": "\u0219tii",                 # știi
    "stim": "\u0219tim",                 # știm
    "stiut": "\u0219tiut",               # știut
    "stiu": "\u0219tiu",                 # știu
    "sterge": "\u0219terge",             # șterge
    "salveaza": "salveaz\u0103",         # salvează
    "lucreaza": "lucreaz\u0103",         # lucrează
    "afiseaza": "afi\u0219eaz\u0103",    # afișează
    "calculeaza": "calculeaz\u0103",     # calculează
    "organizeaza": "organizeaz\u0103",   # organizează
    "utilizeaza": "utilizeaz\u0103",     # utilizează
    "identifica": "identific\u0103",     # identifică
    "aplica": "aplic\u0103",             # aplică
    "rezolva": "rezolv\u0103",           # rezolvă
    "obtine": "ob\u021bine",             # obține
    "exista": "exist\u0103",             # există
    "apasa": "apas\u0103",               # apasă
    "selecteaza": "selecteaz\u0103",     # selectează
    "formateaza": "formateaz\u0103",     # formatează
    "modifica": "modific\u0103",         # modifică
    "configureaza": "configureaz\u0103", # configurează
    "acceseaza": "acceseaz\u0103",       # accesează
    "personalizeaza": "personalizeaz\u0103", # personalizează
    "pozitioneaza": "pozi\u021bioneaz\u0103", # poziționează
    "numeste": "nume\u0219te",           # numește
    "explica": "explic\u0103",           # explică
    "porneste": "porne\u0219te",         # pornește
    "opreste": "opre\u0219te",           # oprește
    "functioenaza": "func\u021bioneaz\u0103", # funcționează
    "functioneaza": "func\u021bioneaz\u0103", # funcționează
    "raspunde": "r\u0103spunde",         # răspunde
    "ramane": "r\u0103m\u00e2ne",        # rămâne
    "completeaza": "completeaz\u0103",   # completează
    "transforma": "transform\u0103",     # transformă
    "compara": "compar\u0103",           # compară
    "masoara": "m\u0103soar\u0103",      # măsoară
    "schimba": "schimb\u0103",           # schimbă

    # --- NOUNS (common educational) ---
    "scoala": "\u0219coal\u0103",        # școală
    "stiinta": "\u0219tiin\u021b\u0103", # știință
    "intrebare": "\u00eentrebare",       # întrebare
    "aplicatie": "aplica\u021bie",       # aplicație
    "aplicatii": "aplica\u021bii",       # aplicații
    "functie": "func\u021bie",           # funcție
    "functii": "func\u021bii",           # funcții
    "lectie": "lec\u021bie",             # lecție
    "lectii": "lec\u021bii",             # lecții
    "prezentare": "prezentare",          # no change
    "operatie": "opera\u021bie",         # operație
    "operatii": "opera\u021bii",         # operații
    "informatie": "informa\u021bie",     # informație
    "informatii": "informa\u021bii",     # informații
    "sectiune": "sec\u021biune",         # secțiune
    "sectiuni": "sec\u021biuni",         # secțiuni
    "conditie": "condi\u021bie",         # condiție
    "conditii": "condi\u021bii",         # condiții
    "instructiune": "instruc\u021biune", # instrucțiune
    "instructiuni": "instruc\u021biuni", # instrucțiuni
    "repetitie": "repeti\u021bie",       # repetiție
    "repetitii": "repeti\u021bii",       # repetiții
    "fisier": "fi\u0219ier",             # fișier
    "fisiere": "fi\u0219iere",           # fișiere
    "fisierul": "fi\u0219ierul",         # fișierul
    "fisierele": "fi\u0219ierele",       # fișierele
    "retea": "re\u021bea",              # rețea
    "pagina": "pagin\u0103",            # pagină (but already without accent in most contexts)
    "tabela": "tabel\u0103",            # tabelă
    "fereastra": "fereastr\u0103",      # fereastră
    "inregistrare": "\u00eenregistrare", # înregistrare
    "proprietati": "propriet\u0103\u021bi", # proprietăți
    "setari": "set\u0103ri",            # setări
    "unitati": "unit\u0103\u021bi",      # unități

    # --- ADJECTIVES ---
    "corecta": "corect\u0103",           # corectă
    "gresita": "gre\u0219it\u0103",      # greșită
    "importanta": "importan\u021b\u0103", # importantă
    "urmatoare": "urm\u0103toare",       # următoare
    "urmatoarele": "urm\u0103toarele",   # următoarele
    "urmatorii": "urm\u0103torii",       # următorii
    "urmatorul": "urm\u0103torul",       # următorul
    "principala": "principal\u0103",     # principală
    "necesara": "necesar\u0103",         # necesară
    "corespunzatoare": "corespunz\u0103toare", # corespunzătoare
    "diferita": "diferit\u0103",         # diferită
    "diferite": "diferite",              # no change
    "separata": "separat\u0103",         # separată
    "simpla": "simpl\u0103",             # simplă
    "completa": "complet\u0103",         # completă
    "instalata": "instalat\u0103",       # instalată

    # --- ADVERBS ---
    "intotdeauna": "\u00eentotdeauna",   # întotdeauna
    "intai": "\u00eent\u00e2i",          # întâi

    # --- COMPOUND FORMS ---
    "intr-o": "\u00eentr-o",             # într-o
    "intr-un": "\u00eentr-un",           # într-un
    "dintr-o": "dintr-o",                # no change
    "dintr-un": "dintr-un",              # no change

    # --- PRONOUNS/DETERMINERS ---
    "aceasta": "aceast\u0103",           # aceasta
    "acesta": "acesta",                  # no change
    "fiecare": "fiecare",                # no change
    "cateva": "c\u00e2teva",             # câteva
    "cati": "c\u00e2\u021bi",            # câți
    "cate": "c\u00e2te",                 # câte

    # --- MISC HIGH FREQUENCY ---
    "adevarata": "adev\u0103rat\u0103",  # adevărată
    "greseli": "gre\u0219eli",           # greșeli
    "greseala": "gre\u0219eal\u0103",    # greșeală
    "abilitati": "abilit\u0103\u021bi",  # abilități
    "activitati": "activit\u0103\u021bi", # activități
    "informatica": "informatic\u0103",   # informatică
    "practica": "practic\u0103",         # practică
    "performanta": "performan\u021b\u0103", # performanță

    # --- ROUND 2: additional common words found in spot-check ---
    # Nouns
    "interfata": "interfa\u021b\u0103",   # interfață
    "legatura": "leg\u0103tura",          # legătura
    "cautari": "c\u0103ut\u0103ri",       # căutări
    "cautare": "c\u0103utare",            # căutare
    "spatii": "spa\u021bii",              # spații
    "spatiu": "spa\u021biu",              # spațiu
    "pozitia": "pozi\u021bia",            # poziția
    "pozitie": "pozi\u021bie",            # poziție
    "dimensiunea": "dimensiunea",         # no change
    "navigatie": "naviga\u021bie",        # navigație
    "tranzitie": "tranzi\u021bie",        # tranziție
    "tranzitii": "tranzi\u021bii",        # tranziții
    "prezentari": "prezent\u0103ri",      # prezentări
    "animatii": "anima\u021bii",          # animații
    "animatie": "anima\u021bie",          # animație
    "tabel": "tabel",                     # no change
    "imagine": "imagine",                 # no change
    "solutie": "solu\u021bie",            # soluție
    "solutii": "solu\u021bii",            # soluții
    "optiune": "op\u021biune",            # opțiune
    "optiuni": "op\u021biuni",            # opțiuni
    "atentie": "aten\u021bie",            # atenție
    "protectie": "protec\u021bie",        # protecție
    "conexiune": "conexiune",             # no change
    "variabila": "variabil\u0103",        # variabilă
    "variabile": "variabile",             # no change
    "constanta": "constant\u0103",        # constantă
    "valoare": "valoare",                 # no change
    "coloane": "coloane",                 # no change
    "coloana": "coloan\u0103",            # coloană
    "randuri": "r\u00e2nduri",            # rânduri
    "rand": "r\u00e2nd",                  # rând

    # Adjectives round 2
    "esentiale": "esen\u021biale",        # esențiale
    "esential": "esen\u021bial",          # esențial
    "esentiala": "esen\u021bial\u0103",   # esențială
    "acelasi": "acela\u0219i",            # același
    "aceeasi": "aceea\u0219i",            # aceeași
    "aceasta": "aceasta",                 # already correct
    "finala": "final\u0103",              # finală
    "initiala": "ini\u021bial\u0103",     # inițială
    "initial": "ini\u021bial",            # inițial
    "optionala": "op\u021bional\u0103",   # opțională
    "optional": "op\u021bional",          # opțional
    "traditionala": "tradi\u021bional\u0103", # tradițională

    # Verbs round 2
    "interactionezi": "interac\u021bionezi", # interacționezi
    "interactioneaza": "interac\u021bioneaz\u0103", # interacționează
    "editeaza": "editeaz\u0103",          # editează
    "insereaza": "insereaz\u0103",        # inserează
    "actualizeaza": "actualizeaz\u0103",  # actualizează
    "redimensioneaza": "redimensioneaz\u0103", # redimensionează
    "inlocuieste": "\u00eenlocuie\u0219te", # înlocuiește
    "indeplineste": "\u00eendepline\u0219te", # îndeplinește
    "imbunatateste": "\u00eembun\u0103t\u0103\u021be\u0219te", # îmbunătățește
    "redenumeste": "redenume\u0219te",    # redenumește
    "muta": "mut\u0103",                  # mută
    "copiaza": "copiaz\u0103",            # copiază
    "lipeste": "lipe\u0219te",            # lipește
    "tasteaza": "tasteaz\u0103",          # tastează
    "apeleaza": "apeleaz\u0103",          # apelează
    "ruleaza": "ruleaz\u0103",            # rulează
    "compileaza": "compileaz\u0103",      # compilează
    "afla": "afl\u0103",                  # află
    "depaseste": "dep\u0103\u0219e\u0219te", # depășește
    "raspund": "r\u0103spund",            # răspund

    # Prepositions/conjunctions round 2
    "pentru": "pentru",                   # no change
    "despre": "despre",                   # no change
    "prin": "prin",                       # no change
    "asupra": "asupra",                   # no change
    "fata": "fa\u021b\u0103",             # față

    # Misc round 2
    "pasii": "pa\u0219ii",               # pașii
    "pasi": "pa\u0219i",                 # pași
    "pas": "pas",                        # no change
    "succesiune": "succesiune",          # no change
}

# Remove no-change entries
WORD_MAP = {k: v for k, v in WORD_MAP.items() if k != v}


def _build_regex():
    """Build compiled regex for word-level replacement."""
    # Sort by length descending so longer matches take priority
    words = sorted(WORD_MAP.keys(), key=len, reverse=True)
    # Escape and join with word boundaries
    pattern = r'\b(' + '|'.join(re.escape(w) for w in words) + r')\b'
    return re.compile(pattern, re.IGNORECASE)

WORD_RE = _build_regex()


def _replace_match(match):
    """Replace a matched word, preserving case."""
    word = match.group(0)
    lower = word.lower()
    if lower not in WORD_MAP:
        return word
    replacement = WORD_MAP[lower]
    # Preserve original casing
    if word[0].isupper() and word[1:].islower():
        # Title case
        return replacement[0].upper() + replacement[1:]
    elif word.isupper():
        # ALL CAPS
        return replacement.upper()
    return replacement


def fix_string(text):
    """Apply diacritics to a single string."""
    return WORD_RE.sub(_replace_match, text)


def walk_and_fix(obj):
    """Recursively walk JSON and fix all string values (not keys)."""
    if isinstance(obj, str):
        return fix_string(obj)
    elif isinstance(obj, list):
        return [walk_and_fix(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: walk_and_fix(value) for key, value in obj.items()}
    return obj


def count_diacritics(text):
    """Count Romanian diacritical characters."""
    return sum(1 for c in text if c in '\u0103\u0102\u00e2\u00c2\u00ee\u00ce\u0219\u0218\u021b\u021a')


def main():
    parser = argparse.ArgumentParser(description="Fix Romanian diacritics in lesson JSONs")
    parser.add_argument("lesson", nargs="?", help="Single lesson code")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    args = parser.parse_args()

    if args.lesson:
        codes = [args.lesson]
    else:
        codes = discover_all_lessons()

    fixed = 0
    skipped = 0
    errors = 0
    total_diacritics_added = 0

    for code in codes:
        lp = lesson_path(code)
        if not lp or not lp.exists():
            print("  [ERROR] Cannot find " + code)
            errors += 1
            continue

        with open(lp, "r", encoding="utf-8") as f:
            original_text = f.read()

        before_count = count_diacritics(original_text)

        lesson = json.loads(original_text)
        fixed_lesson = walk_and_fix(lesson)
        fixed_text = json.dumps(fixed_lesson, ensure_ascii=False, indent=2)

        after_count = count_diacritics(fixed_text)
        added = after_count - before_count

        if added == 0:
            skipped += 1
            continue

        total_diacritics_added += added

        if args.dry_run:
            print("  [DRY] " + code + ": would add " + str(added) +
                  " diacritics (" + str(before_count) + " -> " + str(after_count) + ")")
        else:
            with open(lp, "w", encoding="utf-8") as f:
                f.write(fixed_text)
            print("  [OK] " + code + ": +" + str(added) +
                  " diacritics (" + str(before_count) + " -> " + str(after_count) + ")")
        fixed += 1

    print()
    print("Summary: " + str(fixed) + " files fixed, " +
          str(total_diacritics_added) + " diacritics added, " +
          str(skipped) + " skipped, " + str(errors) + " errors")


if __name__ == "__main__":
    main()
