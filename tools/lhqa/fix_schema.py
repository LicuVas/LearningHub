#!/usr/bin/env python3
"""
Schema Field Fixer for LearningHub
====================================
Adds missing required fields (competency_contract, knowledge_progression)
to lesson JSONs by deriving them from existing content.

Usage:
    python -m tools.lhqa.fix_schema              # Fix all lessons
    python -m tools.lhqa.fix_schema --dry-run     # Preview changes
    python -m tools.lhqa.fix_schema V-M1-L05      # Single lesson
"""

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import json
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tools.lhqa.loader import discover_all_lessons, lesson_path

REQUIRED_KEYS = [
    "meta", "why_this_matters", "competency_contract",
    "knowledge_progression", "instructional_flow",
]


def generate_competency_contract(lesson):
    """Generate competency_contract from existing lesson data."""
    title = lesson.get("meta", {}).get("title_ro", "")
    competencies = lesson.get("competencies", {})

    # official_specific_competencies from competencies.specific
    official = []
    for c in competencies.get("specific", []):
        if isinstance(c, dict):
            official.append({"id": c.get("id", ""), "text_ro": c.get("text_ro", "")})

    # Generate i_can_statements from lesson content
    concepts = []
    prog = lesson.get("knowledge_progression", {})
    for lvl in prog.get("levels", []):
        if isinstance(lvl, dict):
            concepts.extend([str(c) for c in lvl.get("concepts", []) if c])
    for lvl in prog.get("from_general_to_specific", []):
        if isinstance(lvl, dict):
            concepts.extend([str(c) for c in lvl.get("concepts", []) if c])

    # Build i_can statements from concepts and competencies
    minim = []
    standard = []
    performanta = []

    if concepts:
        # Minim: basic understanding
        minim.append("Pot explica pe scurt ce este " + title + ".")
        if len(concepts) >= 1:
            minim.append("Pot identifica: " + concepts[0][:80] + ".")

        # Standard: application
        standard.append("Pot aplica cunostintele despre " + title + " in situatii practice.")
        if len(concepts) >= 2:
            standard.append("Pot explica legatura dintre " +
                            concepts[0][:50] + " si " + concepts[1][:50] + ".")

        # Performanta: analysis and creation
        performanta.append("Pot analiza si rezolva probleme complexe legate de " + title + ".")
        if len(concepts) >= 3:
            performanta.append("Pot crea solutii originale folosind " +
                               concepts[2][:60] + ".")
    else:
        # Fallback when no concepts available
        minim = [
            "Pot identifica elementele de baza din " + title + ".",
            "Pot executa o sarcina simpla legata de " + title + ".",
        ]
        standard = [
            "Pot aplica regulile din " + title + " in situatii noi.",
            "Pot explica de ce sunt importante conceptele din " + title + ".",
        ]
        performanta = [
            "Pot analiza probleme complexe legate de " + title + ".",
            "Pot crea solutii originale folosind cunostintele din " + title + ".",
        ]

    return {
        "official_specific_competencies": official,
        "i_can_statements": {
            "minim": minim,
            "standard": standard,
            "performanta": performanta,
        },
    }


def generate_knowledge_progression(lesson):
    """Generate knowledge_progression from existing lesson data."""
    title = lesson.get("meta", {}).get("title_ro", "")

    # Try to extract from other fields
    competencies = lesson.get("competencies", {})
    comp_texts = []
    for c in competencies.get("specific", []):
        if isinstance(c, dict):
            comp_texts.append(c.get("text_ro", ""))

    purpose = lesson.get("why_this_matters", {}).get("purpose", "")

    # Build basic progression
    general_concepts = []
    intermediate_concepts = []

    if purpose:
        general_concepts.append(purpose[:120])
    else:
        general_concepts.append("Concepte de baza din " + title)

    for ct in comp_texts[:2]:
        if ct:
            intermediate_concepts.append(ct[:100])

    if not intermediate_concepts:
        intermediate_concepts.append("Aplicarea practica a " + title)

    return {
        "levels": [
            {"level": "general", "concepts": general_concepts},
            {"level": "intermediate", "concepts": intermediate_concepts},
        ]
    }


def fix_lesson(lesson):
    """Add missing required fields to a lesson. Returns list of fields added."""
    added = []

    if "competency_contract" not in lesson:
        lesson["competency_contract"] = generate_competency_contract(lesson)
        added.append("competency_contract")

    if "knowledge_progression" not in lesson:
        lesson["knowledge_progression"] = generate_knowledge_progression(lesson)
        added.append("knowledge_progression")

    return added


def main():
    parser = argparse.ArgumentParser(description="Fix missing schema fields in lesson JSONs")
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

    for code in codes:
        lp = lesson_path(code)
        if not lp or not lp.exists():
            print("  [ERROR] Cannot find " + code)
            errors += 1
            continue

        with open(lp, "r", encoding="utf-8") as f:
            lesson = json.load(f)

        # Check if any fields are missing
        missing = [k for k in REQUIRED_KEYS if k not in lesson]
        if not missing:
            skipped += 1
            continue

        added = fix_lesson(lesson)

        if args.dry_run:
            print("  [DRY] " + code + ": would add " + ", ".join(added))
        else:
            with open(lp, "w", encoding="utf-8") as f:
                json.dump(lesson, f, ensure_ascii=False, indent=2)
            print("  [OK] " + code + ": added " + ", ".join(added))
        fixed += 1

    print()
    print("Summary: " + str(fixed) + " files fixed, " +
          str(skipped) + " skipped (complete), " + str(errors) + " errors")


if __name__ == "__main__":
    main()
