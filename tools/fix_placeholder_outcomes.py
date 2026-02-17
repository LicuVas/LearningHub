#!/usr/bin/env python3
"""
Fix placeholder learning outcomes in LearningHub lessons.

Replaces lazy "Sa intelegi si sa aplici: [topic]" with real
Bloom's taxonomy outcomes derived from atom titles + content.

Usage:
    python fix_placeholder_outcomes.py scan          # Find all affected files
    python fix_placeholder_outcomes.py generate      # Generate outcomes -> review.json
    python fix_placeholder_outcomes.py review        # Show generated outcomes for review
    python fix_placeholder_outcomes.py apply         # Apply approved outcomes to HTML files
    python fix_placeholder_outcomes.py apply --dry   # Preview changes without writing
"""

import os
import sys
import json
import re
import io
from pathlib import Path
from bs4 import BeautifulSoup

# Fix console encoding for Romanian characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
REVIEW_FILE = PROJECT_ROOT / "tools" / "outcomes_review.json"

PLACEHOLDER = "Sa intelegi si sa aplici:"

# Bloom's taxonomy verbs by grade band (Romanian)
# Lower grades (cls5-6): Remember, Understand, Apply
# Upper grades (cls7-8): Apply, Analyze, Evaluate, Create
BLOOM_VERBS = {
    "cls5": {
        "identify": "sa identifici",
        "define": "sa definesti",
        "describe": "sa descrii",
        "recognize": "sa recunosti",
        "name": "sa denumesti",
        "explain": "sa explici",
        "demonstrate": "sa demonstrezi",
        "use": "sa folosesti",
        "list": "sa enumeri",
        "give_example": "sa dai exemple de",
    },
    "cls6": {
        "identify": "sa identifici",
        "explain": "sa explici",
        "describe": "sa descrii",
        "compare": "sa compari",
        "demonstrate": "sa demonstrezi",
        "apply": "sa aplici",
        "use": "sa folosesti",
        "classify": "sa clasifici",
        "distinguish": "sa deosebesti",
        "give_example": "sa dai exemple de",
    },
    "cls7": {
        "apply": "sa aplici",
        "analyze": "sa analizezi",
        "compare": "sa compari",
        "classify": "sa clasifici",
        "explain": "sa explici",
        "create": "sa creezi",
        "evaluate": "sa evaluezi",
        "use": "sa utilizezi",
        "implement": "sa implementezi",
        "distinguish": "sa deosebesti",
    },
    "cls8": {
        "apply": "sa aplici",
        "analyze": "sa analizezi",
        "create": "sa creezi",
        "evaluate": "sa evaluezi",
        "implement": "sa implementezi",
        "design": "sa proiectezi",
        "debug": "sa depanezi",
        "optimize": "sa optimizezi",
        "compare": "sa compari",
        "write": "sa scrii",
    },
}

# Keyword -> verb mapping for intelligent matching
KEYWORD_VERB_MAP = {
    # What/definition questions -> identify/define
    "ce este": "define",
    "ce sunt": "define",
    "ce inseamna": "define",
    "definitie": "define",
    "introducere": "identify",
    "prezentare": "describe",
    # How-to/process -> demonstrate/use/apply
    "cum ": "demonstrate",
    "cum se": "demonstrate",
    "crearea": "create",
    "creeaza": "create",
    "creare": "create",
    "construi": "create",
    "realizeaza": "create",
    "scrie": "write",
    "scrierea": "write",
    # Comparison -> compare/distinguish
    "tipuri": "classify",
    "tipurile": "classify",
    "categorii": "classify",
    "diferent": "distinguish",
    "versus": "compare",
    "avantaje": "compare",
    "comparatie": "compare",
    # Structure/analysis -> analyze
    "structur": "analyze",
    "componente": "analyze",
    "element": "analyze",
    "parte": "analyze",
    "proprietat": "analyze",
    # Application/practice -> apply/use
    "utiliz": "use",
    "folosi": "use",
    "aplic": "apply",
    "exemplu": "give_example",
    "exemple": "give_example",
    "practic": "apply",
    # Evaluation -> evaluate
    "alege": "evaluate",
    "selecteaza": "evaluate",
    "corect": "evaluate",
    "verifica": "evaluate",
    # Implementation -> implement
    "programeaza": "implement",
    "codeaza": "implement",
    "algoritm": "implement",
    "cod": "implement",
    "html": "implement",
    "css": "implement",
    "javascript": "implement",
    # Naming/listing -> list/name
    "enumera": "list",
    "lista": "list",
    "numeste": "name",
}


def detect_grade(filepath):
    """Extract grade from file path."""
    path_str = str(filepath)
    for g in ["cls5", "cls6", "cls7", "cls8"]:
        if g in path_str:
            return g
    return "cls7"  # default


def pick_verb(atom_title, grade, atom_index=0, total_atoms=5):
    """Pick the best Bloom's verb for an atom title based on keywords + position."""
    title_lower = atom_title.lower().strip()
    verbs = BLOOM_VERBS.get(grade, BLOOM_VERBS["cls7"])

    # Try keyword matching first
    for keyword, verb_key in KEYWORD_VERB_MAP.items():
        if keyword in title_lower:
            if verb_key in verbs:
                return verbs[verb_key], verb_key
            break

    # Position-based verb selection (avoids "sa explici" everywhere)
    position_ratio = atom_index / max(total_atoms - 1, 1)
    if position_ratio < 0.3:
        # Early atoms: definitional
        for key in ["identify", "define", "describe", "recognize"]:
            if key in verbs:
                return verbs[key], key
    elif position_ratio < 0.7:
        # Middle atoms: understanding/application
        for key in ["demonstrate", "use", "apply", "describe"]:
            if key in verbs:
                return verbs[key], key
    else:
        # Late atoms: higher order
        for key in ["apply", "create", "use", "implement"]:
            if key in verbs:
                return verbs[key], key

    return verbs.get("explain", "sa explici"), "explain"


# Proper nouns to preserve casing for
PRESERVE_CASE = [
    "Microsoft Word", "PowerPoint", "Excel", "Windows", "Google",
    "Chrome", "Firefox", "Internet", "HTML", "CSS", "JavaScript",
    "Python", "C++", "Word", "Paint", "Scratch", "LibreOffice",
    "Bold", "Italic", "Underline", "GDPR", "USB", "RAM", "ROM",
    "CPU", "SSD", "HDD", "PDF", "JPG", "PNG", "GIF", "Wi-Fi",
    "Bluetooth", "YouTube", "Gmail", "Docs", "Slides", "Sheets",
    "Phishing", "Malware", "Spam", "VPN", "IP", "URL", "HTTP",
    "HTTPS", "FTP", "SQL", "PHP", "XML", "JSON", "API", "GPU",
    "BIOS", "OS", "iOS", "Android", "Linux", "macOS", "Photoshop",
    "GIMP", "Audacity", "OBS", "Canva", "TikTok", "Facebook",
    "Instagram", "WhatsApp", "Arduino", "Raspberry Pi",
]


def smart_lower(text):
    """Lowercase text but preserve known proper nouns."""
    result = text.lower()
    for proper in PRESERVE_CASE:
        # Replace lowercase version with proper case
        result = re.sub(re.escape(proper.lower()), proper, result, flags=re.IGNORECASE)
    return result


# Romanian imperative verbs that indicate action atom titles
IMPERATIVE_VERBS = {
    "scrie": "sa scrii",
    "creeaza": "sa creezi",
    "deseneaza": "sa desenezi",
    "salveaza": "sa salvezi",
    "deschide": "sa deschizi",
    "inchide": "sa inchizi",
    "alege": "sa alegi",
    "selecteaza": "sa selectezi",
    "formateaza": "sa formatezi",
    "insereaza": "sa inserezi",
    "copiaza": "sa copiezi",
    "sterge": "sa stergi",
    "muta": "sa muti",
    "ruleaza": "sa rulezi",
    "testeaza": "sa testezi",
    "verifica": "sa verifici",
    "experimenteaza": "sa experimentezi",
    "personalizeaza": "sa personalizezi",
    "organizeaza": "sa organizezi",
    "completeaza": "sa completezi",
    "conecteaza": "sa conectezi",
    "instaleaza": "sa instalezi",
    "configureaza": "sa configurezi",
    "adauga": "sa adaugi",
    "modifica": "sa modifici",
    "planifica": "sa planifici",
    "recunoaste": "sa recunosti",
    "identifica": "sa identifici",
    "cere": "sa ceri",
    "protejeaza": "sa protejezi",
    "descopera": "sa descoperi",
    "analizeaza": "sa analizezi",
    "compara": "sa compari",
    "exploreaza": "sa explorezi",
    "rezolva": "sa rezolvi",
    "construieste": "sa construiesti",
    "transforma": "sa transformi",
    "grupeaza": "sa grupezi",
    "sorteaza": "sa sortezi",
    "filtreaza": "sa filtrezi",
    "calculeaza": "sa calculezi",
    "deseneaza": "sa desenezi",
    "aplica": "sa aplici",
    "foloseste": "sa folosesti",
}


def generate_outcome(atom_title, grade, atom_index, total_atoms):
    """Generate a proper learning outcome from an atom title."""
    title_clean = atom_title.strip().rstrip("?!.")

    # Check if title starts with an imperative verb
    first_word = title_clean.split()[0].lower() if title_clean.split() else ""
    if first_word in IMPERATIVE_VERBS:
        rest = title_clean[len(first_word):].strip()
        rest = smart_lower(rest)
        return f"{IMPERATIVE_VERBS[first_word]} {rest}"

    verb_ro, verb_key = pick_verb(atom_title, grade, atom_index, total_atoms)

    # If title is a question "Ce este X?" -> "sa definesti ce este X"
    if title_clean.lower().startswith(("ce ", "cum ", "cand ", "unde ", "de ce ", "care ")):
        return f"{verb_ro} {smart_lower(title_clean)}"

    # Noun phrase: remove leading "Primele/Prima/Primul"
    topic = title_clean
    for prefix in ["Primele ", "Prima ", "Primul "]:
        if topic.startswith(prefix):
            topic = topic[len(prefix):]
            break

    return f"{verb_ro} {smart_lower(topic)}"


def parse_file(filepath):
    """Parse an HTML file and extract placeholder outcomes + atom info."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if PLACEHOLDER not in content:
        return None

    soup = BeautifulSoup(content, "html.parser")
    grade = detect_grade(filepath)

    # Find placeholder outcomes
    outcomes_section = None
    for h3 in soup.find_all("h3"):
        if "Dupa aceasta lectie" in (h3.get_text() or ""):
            outcomes_section = h3.find_next("ul")
            break

    if not outcomes_section:
        # Try finding by class
        outcomes_section = soup.find(class_="learning-outcomes")
        if outcomes_section and outcomes_section.name == "div":
            outcomes_section = outcomes_section.find("ul")

    if not outcomes_section:
        return None

    placeholders = []
    for li in outcomes_section.find_all("li"):
        text = li.get_text().strip()
        if PLACEHOLDER in text:
            topic = text.replace(PLACEHOLDER, "").strip()
            placeholders.append(topic)

    # Extract atom titles and concept names
    atoms = []
    concept_names = []
    for atom_div in soup.find_all("div", class_="atom"):
        title_el = atom_div.find(class_="atom-title")
        title_text = title_el.get_text().strip() if title_el else ""
        atoms.append(title_text)

        # Extract concept-name as fallback for placeholder titles
        concept_el = atom_div.find(class_="concept-name")
        concept_text = concept_el.get_text().strip() if concept_el else ""
        concept_names.append(concept_text)

    # Detect if atom titles are placeholders ("1. Continut", "2. Continut", etc.)
    has_placeholder_titles = all(
        re.match(r"^\d+\.\s*Continut$", t) or t == "Continut"
        for t in atoms if t
    ) if atoms else False

    # Build real topic list: prefer concept names when titles are placeholders
    real_topics = []
    if has_placeholder_titles and concept_names:
        real_topics = list(concept_names)  # copy — don't mutate original
    else:
        real_topics = list(atoms)  # copy

    # If outcomes are "Continut" placeholders, use real topics from atoms
    resolved_placeholders = []
    for topic in placeholders:
        if topic.strip() == "Continut" and real_topics:
            # Pop first available real topic
            resolved_placeholders.append(real_topics.pop(0) if real_topics else topic)
        else:
            resolved_placeholders.append(topic)

    # Generate new outcomes
    total = len(resolved_placeholders)
    new_outcomes = []
    for i, topic in enumerate(resolved_placeholders):
        if not topic or topic == "Continut":
            new_outcomes.append(f"sa aplici conceptele din aceasta lectie")
        else:
            outcome = generate_outcome(topic, grade, i, total)
            new_outcomes.append(outcome)

    # Also track atom title fixes needed
    atom_title_fixes = []
    if has_placeholder_titles:
        for i, (old_title, concept) in enumerate(zip(atoms, concept_names)):
            if concept and re.match(r"^\d+\.\s*Continut$", old_title):
                atom_title_fixes.append({
                    "old": old_title,
                    "new": concept,
                })

    result = {
        "file": str(filepath.relative_to(PROJECT_ROOT)),
        "grade": grade,
        "atom_count": len(atoms),
        "atoms": atoms,
        "concept_names": concept_names,
        "has_placeholder_titles": has_placeholder_titles,
        "old_outcomes": [f"{PLACEHOLDER} {t}" for t in placeholders],
        "new_outcomes": new_outcomes,
    }
    if atom_title_fixes:
        result["atom_title_fixes"] = atom_title_fixes

    return result


def cmd_scan():
    """Scan and report all affected files."""
    files = sorted(CONTENT_DIR.rglob("*.html"))
    affected = []
    for f in files:
        try:
            with open(f, "r", encoding="utf-8") as fh:
                if PLACEHOLDER in fh.read():
                    affected.append(str(f.relative_to(PROJECT_ROOT)))
        except Exception:
            pass

    print(f"Found {len(affected)} files with placeholder outcomes:\n")
    by_grade = {}
    for path in affected:
        for g in ["cls5", "cls6", "cls7", "cls8"]:
            if g in path:
                by_grade.setdefault(g, []).append(path)
                break

    for grade in sorted(by_grade):
        print(f"  {grade}: {len(by_grade[grade])} files")

    print(f"\nTotal: {len(affected)}")
    return affected


def cmd_generate():
    """Generate new outcomes for all affected files."""
    files = sorted(CONTENT_DIR.rglob("*.html"))
    results = []
    errors = []

    for f in files:
        try:
            result = parse_file(f)
            if result:
                results.append(result)
        except Exception as e:
            errors.append({"file": str(f), "error": str(e)})

    output = {
        "total_files": len(results),
        "total_outcomes": sum(len(r["new_outcomes"]) for r in results),
        "errors": errors,
        "files": results,
    }

    with open(REVIEW_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Generated outcomes for {len(results)} files")
    print(f"Total outcomes: {output['total_outcomes']}")
    if errors:
        print(f"Errors: {len(errors)}")
    print(f"\nReview file: {REVIEW_FILE}")
    print("Run: python fix_placeholder_outcomes.py review")


def cmd_review():
    """Display generated outcomes for review."""
    if not REVIEW_FILE.exists():
        print("No review file. Run 'generate' first.")
        return

    with open(REVIEW_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"=== OUTCOMES REVIEW ({data['total_files']} files, {data['total_outcomes']} outcomes) ===\n")

    for entry in data["files"][:10]:  # Show first 10 for review
        print(f"--- {entry['file']} ({entry['grade']}) ---")
        for old, new in zip(entry["old_outcomes"], entry["new_outcomes"]):
            old_short = old.replace(PLACEHOLDER, "").strip()
            print(f"  OLD: {PLACEHOLDER} {old_short}")
            print(f"  NEW: {new}")
            print()

    if data["total_files"] > 10:
        print(f"... and {data['total_files'] - 10} more files.")
        print(f"Full review: {REVIEW_FILE}")


def cmd_apply(dry_run=False):
    """Apply approved outcomes to HTML files."""
    if not REVIEW_FILE.exists():
        print("No review file. Run 'generate' first.")
        return

    with open(REVIEW_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    modified = 0
    for entry in data["files"]:
        filepath = PROJECT_ROOT / entry["file"]
        if not filepath.exists():
            print(f"SKIP (missing): {entry['file']}")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        changed = False

        # Fix learning outcomes
        for old_text, new_text in zip(entry["old_outcomes"], entry["new_outcomes"]):
            old_li_text = old_text.strip()
            new_capitalized = new_text[0].upper() + new_text[1:] if new_text else new_text

            if old_li_text in content:
                content = content.replace(old_li_text, new_capitalized, 1)
                changed = True

        # Fix placeholder atom titles ("1. Continut" -> real concept name)
        for fix in entry.get("atom_title_fixes", []):
            old_title = fix["old"]
            new_title = fix["new"]
            # Match the exact h3 content
            if old_title in content:
                content = content.replace(old_title, new_title, 1)
                changed = True

        if changed:
            modified += 1
            if dry_run:
                print(f"WOULD MODIFY: {entry['file']}")
                for old, new in zip(entry["old_outcomes"], entry["new_outcomes"]):
                    new_cap = new[0].upper() + new[1:] if new else new
                    print(f"  - {old[:60]}...")
                    print(f"  + {new_cap}")
                for fix in entry.get("atom_title_fixes", []):
                    print(f"  TITLE: {fix['old']} -> {fix['new']}")
            else:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)

    titles_fixed = sum(len(e.get("atom_title_fixes", [])) for e in data["files"])
    action = "Would modify" if dry_run else "Modified"
    print(f"\n{action} {modified}/{data['total_files']} files")
    print(f"Outcome replacements: {data['total_outcomes']}")
    print(f"Atom title fixes: {titles_fixed}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    cmd = sys.argv[1]
    if cmd == "scan":
        cmd_scan()
    elif cmd == "generate":
        cmd_generate()
    elif cmd == "review":
        cmd_review()
    elif cmd == "apply":
        dry = "--dry" in sys.argv
        cmd_apply(dry_run=dry)
    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
