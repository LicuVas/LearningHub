#!/usr/bin/env python3
"""
Quiz File Generator for LearningHub
=====================================
Generates missing .quiz.json files by extracting embedded quiz data
from lesson JSONs and supplementing to reach 4 items per level.

Usage:
    python -m tools.lhqa.generate_quizzes              # Generate all missing
    python -m tools.lhqa.generate_quizzes --dry-run     # Preview without writing
    python -m tools.lhqa.generate_quizzes V-M1-L05      # Single lesson
"""

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

import json
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tools.lhqa.loader import (
    discover_all_lessons, quiz_path, load_lesson, parse_lesson_code,
)

TARGET_PER_LEVEL = 4
ANSWER_STUB = "MODEL_ANSWER_REQUIRED"

# Romanian quotes as variables to avoid encoding issues in f-strings
Q_OPEN = "\u201e"   # lower double quote
Q_CLOSE = "\u201d"  # right double quote


def extract_lesson_content(lesson):
    """Extract usable content from a lesson for quiz generation."""
    meta = lesson.get("meta", {})
    title = meta.get("title_ro", "")
    progression = lesson.get("knowledge_progression", {})
    flow = lesson.get("instructional_flow", {})
    contract = lesson.get("competency_contract", {})
    why = lesson.get("why_this_matters", {})

    terms = []
    lecture = flow.get("micro_lecture_8_10min", {})
    if isinstance(lecture, dict):
        terms.extend(lecture.get("key_terms", []))

    concepts = []
    from_gen = progression.get("from_general_to_specific", [])
    if isinstance(from_gen, list):
        for level_obj in from_gen:
            if isinstance(level_obj, dict):
                concepts.extend(level_obj.get("concepts", []))
            elif isinstance(level_obj, str):
                concepts.append(level_obj)

    i_can = contract.get("i_can_statements", {})
    scenarios = why.get("real_life_scenarios", [])

    misconceptions = []
    for m in progression.get("common_misconceptions", []):
        if isinstance(m, dict):
            misconceptions.append(m.get("misconception", ""))
        elif isinstance(m, str):
            misconceptions.append(m)

    rules = []
    if isinstance(lecture, dict):
        rules.extend(lecture.get("rules_and_checks", []))

    return {
        "title": title,
        "terms": [t for t in terms if t and len(str(t)) > 2],
        "concepts": [str(c) for c in concepts if c and len(str(c)) > 2],
        "i_can_minim": i_can.get("minim", []),
        "i_can_standard": i_can.get("standard", []),
        "i_can_perf": i_can.get("performanta", []),
        "scenarios": [s for s in scenarios if s],
        "misconceptions": [m for m in misconceptions if m],
        "rules": rules,
    }


def _q(text):
    """Wrap text in Romanian quotation marks."""
    return Q_OPEN + text + Q_CLOSE


def generate_minim_items(content, existing_count):
    """Generate supplemental minim-level items."""
    needed = max(0, TARGET_PER_LEVEL - existing_count)
    if needed == 0:
        return []

    title = content["title"]
    terms = content["terms"]
    concepts = content["concepts"]

    templates = [
        {"type": "mcq",
         "prompt": "Care dintre urm\u0103toarele afirma\u021bii despre " + _q(title) + " este corect\u0103?"},
        {"type": "short",
         "prompt": "Define\u0219te pe scurt ce \u00eenseamn\u0103 " + _q(title) + " \u00een 1-2 propozi\u021bii."},
        {"type": "mcq",
         "prompt": "Care dintre urm\u0103toarele este un exemplu corect legat de " + title + "?"},
        {"type": "short",
         "prompt": "Nume\u0219te 2 elemente importante legate de " + title + "."},
    ]

    if len(terms) >= 2:
        templates[1] = {"type": "short",
                        "prompt": "Scrie o defini\u021bie scurt\u0103 pentru termenul " + _q(terms[0]) + "."}
        templates[3] = {"type": "short",
                        "prompt": "Nume\u0219te o leg\u0103tur\u0103 dintre " + _q(terms[0]) + " \u0219i " + _q(terms[1]) + "."}
    elif len(concepts) >= 2:
        templates[1] = {"type": "short",
                        "prompt": "Explic\u0103 pe scurt: " + concepts[0] + "."}
        templates[3] = {"type": "short",
                        "prompt": "Nume\u0219te un exemplu concret pentru: " + concepts[1] + "."}

    items = []
    for t in templates[:needed]:
        items.append({"type": t["type"], "prompt": t["prompt"], "answer_key": ANSWER_STUB})
    return items


def generate_standard_items(content, existing_count):
    """Generate supplemental standard-level items."""
    needed = max(0, TARGET_PER_LEVEL - existing_count)
    if needed == 0:
        return []

    title = content["title"]
    terms = content["terms"]
    concepts = content["concepts"]
    rules = content["rules"]

    templates = [
        {"type": "ordering",
         "prompt": "Pune \u00een ordine pa\u0219ii corec\u021bi pentru o sarcin\u0103 legat\u0103 de " + title + "."},
        {"type": "short",
         "prompt": "Explic\u0103 \u00een 2-3 propozi\u021bii de ce este important s\u0103 respec\u021bi regulile din " + title + "."},
        {"type": "mcq",
         "prompt": "Care variant\u0103 respect\u0103 corect o regul\u0103 de baz\u0103 din " + title + "?"},
        {"type": "compare",
         "prompt": "Compar\u0103 dou\u0103 abord\u0103ri diferite pentru o sarcin\u0103 din " + title + ". Care este mai bun\u0103 \u0219i de ce?"},
    ]

    if len(terms) >= 2:
        templates[1] = {"type": "short",
                        "prompt": "Explic\u0103 diferen\u021ba dintre " + _q(terms[0]) + " \u0219i " + _q(terms[1]) + " \u00een 2-3 propozi\u021bii."}
    elif len(concepts) >= 2:
        templates[1] = {"type": "short",
                        "prompt": "Explic\u0103 diferen\u021ba dintre " + _q(concepts[0]) + " \u0219i " + _q(concepts[1]) + " \u00een 2-3 propozi\u021bii."}

    if rules:
        templates[2] = {"type": "mcq",
                        "prompt": "Care variant\u0103 respect\u0103 regula: " + _q(rules[0]) + "?"}

    items = []
    for t in templates[:needed]:
        items.append({"type": t["type"], "prompt": t["prompt"], "answer_key": ANSWER_STUB})
    return items


def generate_performanta_items(content, existing_count):
    """Generate supplemental performanta-level items."""
    needed = max(0, TARGET_PER_LEVEL - existing_count)
    if needed == 0:
        return []

    title = content["title"]
    scenarios = content["scenarios"]
    misconceptions = content["misconceptions"]

    # Build scenario prompt
    if scenarios:
        scenario_prompt = "Scenariu: " + scenarios[0] + " Explic\u0103 pas cu pas ce ai face \u0219i de ce."
    else:
        scenario_prompt = "Scenariu: Trebuie s\u0103 aplici cuno\u0219tin\u021bele despre " + title + " \u00eentr-o situa\u021bie real\u0103. Ce ai face \u0219i de ce?"

    # Build debug prompt
    if misconceptions:
        debug_prompt = "G\u0103se\u0219te gre\u0219eala \u00een urm\u0103toarea afirma\u021bie: " + _q(misconceptions[0]) + ". Explic\u0103 de ce este gre\u0219it \u0219i care este varianta corect\u0103."
    else:
        debug_prompt = "Un coleg a f\u0103cut o gre\u0219eal\u0103 tipic\u0103 legat\u0103 de " + title + ". Identific\u0103 problema \u0219i propune solu\u021bia corect\u0103."

    templates = [
        {"type": "scenario", "prompt": scenario_prompt},
        {"type": "debug", "prompt": debug_prompt},
        {"type": "create",
         "prompt": "Creeaz\u0103 un mini-ghid (3-5 pa\u0219i) despre " + title + " pentru un coleg care nu \u0219tie nimic despre subiect."},
        {"type": "explain",
         "prompt": "Argumenteaz\u0103 \u00een 4-5 propozi\u021bii de ce este important " + title + " \u00een via\u021ba de zi cu zi."},
    ]

    items = []
    for t in templates[:needed]:
        items.append({"type": t["type"], "prompt": t["prompt"], "answer_key": ANSWER_STUB})
    return items


def generate_quiz(lesson_code, lesson):
    """Generate a complete quiz JSON for a lesson."""
    parsed = parse_lesson_code(lesson_code)
    meta = lesson.get("meta", {})

    # Start with embedded quiz data
    embedded = lesson.get("assessment", {}).get("quick_quiz", {})
    items_m = list(embedded.get("items_minim", []))
    items_s = list(embedded.get("items_standard", []))
    items_p = list(embedded.get("items_performanta", []))

    # Extract lesson content for supplemental generation
    content = extract_lesson_content(lesson)

    # Supplement each level to reach TARGET_PER_LEVEL
    items_m.extend(generate_minim_items(content, len(items_m)))
    items_s.extend(generate_standard_items(content, len(items_s)))
    items_p.extend(generate_performanta_items(content, len(items_p)))

    return {
        "schema_version": "1.0.0",
        "lesson_code": lesson_code,
        "grade": meta.get("grade", parsed["grade"] if parsed else ""),
        "module_index": meta.get("module_index", parsed["module"] if parsed else 0),
        "items_minim": items_m,
        "items_standard": items_s,
        "items_performanta": items_p,
    }


def main():
    parser = argparse.ArgumentParser(description="Generate missing quiz files")
    parser.add_argument("lesson", nargs="?", help="Single lesson code")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    parser.add_argument("--force", action="store_true", help="Overwrite existing quiz files")
    args = parser.parse_args()

    if args.lesson:
        codes = [args.lesson]
    else:
        codes = discover_all_lessons()

    generated = 0
    skipped = 0
    errors = 0

    for code in codes:
        qp = quiz_path(code)
        if not qp:
            print(f"  [ERROR] Cannot determine quiz path for {code}")
            errors += 1
            continue

        if qp.exists() and not args.force:
            skipped += 1
            continue

        lesson = load_lesson(code)
        if not lesson:
            print(f"  [ERROR] Cannot load lesson {code}")
            errors += 1
            continue

        quiz = generate_quiz(code, lesson)
        total_items = len(quiz["items_minim"]) + len(quiz["items_standard"]) + len(quiz["items_performanta"])

        if args.dry_run:
            print(f"  [DRY] {code}: would generate {qp.name} ({total_items} items: "
                  f"m={len(quiz['items_minim'])}, s={len(quiz['items_standard'])}, p={len(quiz['items_performanta'])})")
        else:
            qp.parent.mkdir(parents=True, exist_ok=True)
            with open(qp, "w", encoding="utf-8") as f:
                json.dump(quiz, f, ensure_ascii=False, indent=2)
            print(f"  [OK] {code}: {qp.name} ({total_items} items)")
        generated += 1

    print(f"\nSummary: {generated} generated, {skipped} skipped (exist), {errors} errors")


if __name__ == "__main__":
    main()
