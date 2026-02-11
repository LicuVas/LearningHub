#!/usr/bin/env python3
"""
LearningHub Quality Assurance Agent (LHQA) - Orchestrator
==========================================================
7-pass deep evaluation engine for lesson quality.

Usage:
    python -m tools.lhqa.orchestrator                       # Full audit, all lessons
    python -m tools.lhqa.orchestrator V-M1-L01              # Single lesson
    python -m tools.lhqa.orchestrator --grade V             # All grade 5
    python -m tools.lhqa.orchestrator --module V-M1         # One module
    python -m tools.lhqa.orchestrator --pass 1              # Only structural pass
    python -m tools.lhqa.orchestrator --pass 1,2,5          # Multiple passes
    python -m tools.lhqa.orchestrator --ai                  # Enable AI evaluation (API)
    python -m tools.lhqa.orchestrator --json                # JSON output
    python -m tools.lhqa.orchestrator --save                # Save reports to files
"""

import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')
import os
import argparse
import json
from pathlib import Path
from typing import List, Optional

# Ensure project root is in path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from tools.lhqa.models import LessonReport, PassResult
from tools.lhqa.loader import (
    load_lesson_with_context, discover_all_lessons,
    discover_module_lessons, discover_grade_lessons,
)
from tools.lhqa.ai_eval import AIEvaluator
from tools.lhqa.scoring import (
    generate_report_card, generate_json_report,
    generate_batch_summary, save_report, save_batch_summary,
)
from tools.lhqa.passes import (
    p1_structural, p2_curriculum, p3_content,
    p4_pedagogy, p5_assessment, p6_ux, p7_coherence,
)

ALL_PASSES = {
    1: ("Structural Integrity", p1_structural),
    2: ("Curriculum Alignment", p2_curriculum),
    3: ("Content Quality", p3_content),
    4: ("Pedagogical Design", p4_pedagogy),
    5: ("Assessment Alignment", p5_assessment),
    6: ("User Experience", p6_ux),
    7: ("Cross-Lesson Coherence", p7_coherence),
}


def evaluate_lesson(lesson_code: str, passes: Optional[List[int]] = None,
                    ai_mode: str = "deferred") -> LessonReport:
    """Evaluate a single lesson through selected passes.

    Args:
        lesson_code: Lesson code (e.g., 'V-M1-L01').
        passes: List of pass numbers to run (None = all).
        ai_mode: 'deferred' (save prompts) or 'api' (call LLM).

    Returns:
        LessonReport with all check results.
    """
    ctx = load_lesson_with_context(lesson_code)
    ai = AIEvaluator(mode=ai_mode)

    report = LessonReport(lesson_code=lesson_code)
    if ctx.get("lesson"):
        report.lesson_title = ctx["lesson"].get("meta", {}).get("title_ro", "")

    run_passes = passes or list(ALL_PASSES.keys())

    for pass_num in run_passes:
        if pass_num not in ALL_PASSES:
            continue
        name, module = ALL_PASSES[pass_num]
        try:
            if pass_num in (1, 6):
                # Automated passes - no AI
                result = module.run(ctx)
            elif pass_num == 7:
                # Coherence pass needs module context
                result = module.run(ctx, ai=ai)
            else:
                # AI-assisted passes
                result = module.run(ctx, ai=ai)
            report.passes.append(result)
        except Exception as e:
            error_result = PassResult(pass_number=pass_num, pass_name=name)
            from tools.lhqa.models import CheckResult
            error_result.checks.append(CheckResult(
                check_id=f"{pass_num}.ERR",
                check_name="Pass execution error",
                passed=False,
                details=f"Pass {pass_num} crashed: {e}",
                severity="critical",
            ))
            report.passes.append(error_result)

    # Save pending AI evaluations
    if ai.get_pending_count() > 0:
        ai.save_pending(lesson_code)

    return report


def evaluate_batch(lesson_codes: List[str], passes: Optional[List[int]] = None,
                   ai_mode: str = "deferred") -> List[LessonReport]:
    """Evaluate multiple lessons."""
    reports = []
    total = len(lesson_codes)
    for i, code in enumerate(lesson_codes, 1):
        sys.stderr.write(f"\r  [{i}/{total}] Evaluating {code}...")
        sys.stderr.flush()
        report = evaluate_lesson(code, passes=passes, ai_mode=ai_mode)
        reports.append(report)
    sys.stderr.write(f"\r  [{total}/{total}] Done.{'':20}\n")
    return reports


def main():
    parser = argparse.ArgumentParser(
        description="LHQA - LearningHub Quality Assurance Agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s V-M1-L01              Single lesson evaluation
  %(prog)s --grade V             All grade 5 lessons
  %(prog)s --module V-M1         All lessons in module
  %(prog)s --pass 1              Only structural checks
  %(prog)s --pass 1,2,5          Multiple passes
  %(prog)s V-M1-L01 --ai        With AI evaluation (needs API key)
  %(prog)s --save                Save reports to files
        """,
    )
    parser.add_argument("lesson", nargs="?", help="Lesson code (e.g., V-M1-L01)")
    parser.add_argument("--grade", help="Evaluate all lessons in a grade (V, VI, VII, VIII)")
    parser.add_argument("--module", help="Evaluate all lessons in a module (e.g., V-M1)")
    parser.add_argument("--pass", dest="passes", help="Comma-separated pass numbers (e.g., 1,2,5)")
    parser.add_argument("--ai", action="store_true", help="Enable AI evaluation via API")
    parser.add_argument("--heuristic", action="store_true", help="Enable heuristic evaluation (no API needed)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--save", action="store_true", help="Save reports to files")
    parser.add_argument("--list", action="store_true", help="List all discoverable lessons")

    args = parser.parse_args()

    # Parse passes
    pass_list = None
    if args.passes:
        try:
            pass_list = [int(p.strip()) for p in args.passes.split(",")]
        except ValueError:
            print("Error: --pass must be comma-separated numbers (e.g., 1,2,5)")
            sys.exit(1)

    ai_mode = "api" if args.ai else ("heuristic" if args.heuristic else "deferred")

    # List mode
    if args.list:
        lessons = discover_all_lessons()
        print(f"Found {len(lessons)} lessons:")
        for l in lessons:
            print(f"  {l}")
        return

    # Determine which lessons to evaluate
    lesson_codes = []
    if args.lesson:
        lesson_codes = [args.lesson]
    elif args.grade:
        lesson_codes = discover_grade_lessons(args.grade)
        if not lesson_codes:
            print(f"No lessons found for grade {args.grade}")
            sys.exit(1)
        print(f"Found {len(lesson_codes)} lessons for grade {args.grade}")
    elif args.module:
        parts = args.module.split("-")
        if len(parts) != 2:
            print("Error: --module format should be like V-M1")
            sys.exit(1)
        grade = parts[0]
        module = int(parts[1].replace("M", ""))
        lesson_codes = discover_module_lessons(grade, module)
        if not lesson_codes:
            print(f"No lessons found for module {args.module}")
            sys.exit(1)
        print(f"Found {len(lesson_codes)} lessons for module {args.module}")
    else:
        lesson_codes = discover_all_lessons()
        if not lesson_codes:
            print("No lessons found. Check content/gimnaziu/ directory.")
            sys.exit(1)
        print(f"Found {len(lesson_codes)} lessons — running full audit")

    # Run evaluation
    if len(lesson_codes) == 1:
        report = evaluate_lesson(lesson_codes[0], passes=pass_list, ai_mode=ai_mode)
        if args.json:
            print(json.dumps(generate_json_report(report), ensure_ascii=False, indent=2))
        else:
            print(generate_report_card(report))
        if args.save:
            paths = save_report(report)
            for p in paths:
                sys.stderr.write(f"  Saved: {p}\n")
    else:
        reports = evaluate_batch(lesson_codes, passes=pass_list, ai_mode=ai_mode)
        if args.json:
            print(json.dumps({
                "total_lessons": len(reports),
                "reports": [generate_json_report(r) for r in reports],
            }, ensure_ascii=False, indent=2))
        else:
            print(generate_batch_summary(reports))
        if args.save:
            path = save_batch_summary(reports)
            sys.stderr.write(f"  Saved summary: {path}\n")
            for r in reports:
                save_report(r)
            sys.stderr.write(f"  Saved {len(reports)} individual reports\n")


if __name__ == "__main__":
    main()
