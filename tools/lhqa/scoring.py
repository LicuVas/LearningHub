"""Scoring engine and report card generation for LHQA."""

import json
from datetime import datetime
from pathlib import Path
from typing import List

from .models import CheckResult, PassResult, LessonReport, ModuleReport

REPORTS_DIR = Path(__file__).resolve().parent / "reports"

VERDICT_SYMBOLS = {
    "CERTIFIED": "[PASS]",
    "PARTIAL_PASS": "[PARTIAL]",
    "NEEDS_WORK": "[WARN]",
    "FAILED": "[FAIL]",
    "UNKNOWN": "[????]",
}

SEVERITY_SYMBOLS = {
    "critical": "[!!]",
    "major": "[!]",
    "minor": "[.]",
}


def generate_report_card(report: LessonReport) -> str:
    """Generate a text report card for a single lesson."""
    lines = []
    v = report.verdict
    sym = VERDICT_SYMBOLS.get(v, "[??]")

    lines.append(f"{'='*60}")
    lines.append(f"  LHQA REPORT CARD: {report.lesson_code}")
    if report.lesson_title:
        lines.append(f"  {report.lesson_title}")
    lines.append(f"  Verdict: {sym} {v}")
    lines.append(f"  Checks: {report.total_passed}/{report.total_checks} passed"
                 f" ({report.total_failed} failed, {report.total_pending} pending AI)")
    lines.append(f"  Timestamp: {report.timestamp}")
    lines.append(f"{'='*60}")
    lines.append("")

    for p in report.passes:
        passed, evaluated, pending = p.score
        if p.all_passed:
            status = "[PASS]"
        elif p.failed_checks:
            status = "[FAIL]"
        elif pending > 0:
            status = "[....]"
        else:
            status = "[OK]"

        lines.append(f"  Pass {p.pass_number}: {p.pass_name}  {status}  {p.score_str}")

        # Show failures and pending
        for c in p.failed_checks:
            sev = SEVERITY_SYMBOLS.get(c.severity, "")
            lines.append(f"    {sev} {c.check_id} {c.check_name}: FAIL")
            lines.append(f"        {c.details}")
            if c.fix_suggestion:
                lines.append(f"        Fix: {c.fix_suggestion}")

        for c in p.pending_checks:
            lines.append(f"    [AI] {c.check_id} {c.check_name}: pending AI evaluation")

        lines.append("")

    # Summary
    lines.append(f"{'-'*60}")
    if report.total_failed > 0:
        lines.append("  FAILURES:")
        for p in report.passes:
            for c in p.failed_checks:
                lines.append(f"    {c.check_id} {c.check_name} ({c.severity})")
        lines.append("")

    if report.total_pending > 0:
        lines.append(f"  {report.total_pending} checks require AI evaluation.")
        lines.append(f"  Run with --ai flag or process pending evaluations manually.")
        lines.append("")

    lines.append(f"  VERDICT: {sym} {v}")
    lines.append(f"{'='*60}")

    return "\n".join(lines)


def generate_json_report(report: LessonReport) -> dict:
    """Generate a JSON report for a single lesson."""
    return {
        "lesson_code": report.lesson_code,
        "lesson_title": report.lesson_title,
        "verdict": report.verdict,
        "timestamp": report.timestamp,
        "summary": {
            "total_checks": report.total_checks,
            "passed": report.total_passed,
            "failed": report.total_failed,
            "pending_ai": report.total_pending,
        },
        "passes": [
            {
                "pass_number": p.pass_number,
                "pass_name": p.pass_name,
                "score": f"{p.score[0]}/{p.score[1]}",
                "pending": p.score[2],
                "checks": [
                    {
                        "check_id": c.check_id,
                        "check_name": c.check_name,
                        "passed": c.passed,
                        "severity": c.severity,
                        "details": c.details,
                        "fix_suggestion": c.fix_suggestion,
                    }
                    for c in p.checks
                ],
            }
            for p in report.passes
        ],
    }


def generate_batch_summary(reports: List[LessonReport]) -> str:
    """Generate a summary of multiple lesson reports."""
    lines = []
    lines.append(f"{'='*70}")
    lines.append(f"  LHQA BATCH SUMMARY — {len(reports)} lessons evaluated")
    lines.append(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"{'='*70}")
    lines.append("")

    # Count verdicts
    verdicts = {}
    for r in reports:
        v = r.verdict
        verdicts[v] = verdicts.get(v, 0) + 1

    lines.append("  VERDICTS:")
    for v in ["CERTIFIED", "PARTIAL_PASS", "NEEDS_WORK", "FAILED", "UNKNOWN"]:
        count = verdicts.get(v, 0)
        if count > 0:
            lines.append(f"    {VERDICT_SYMBOLS.get(v, '??')} {v}: {count}")
    lines.append("")

    # Totals
    total_checks = sum(r.total_checks for r in reports)
    total_passed = sum(r.total_passed for r in reports)
    total_failed = sum(r.total_failed for r in reports)
    total_pending = sum(r.total_pending for r in reports)

    lines.append(f"  TOTAL CHECKS: {total_checks}")
    lines.append(f"    Passed:  {total_passed}")
    lines.append(f"    Failed:  {total_failed}")
    lines.append(f"    Pending: {total_pending}")
    lines.append("")

    # Most common failures
    failure_counts = {}
    for r in reports:
        for p in r.passes:
            for c in p.failed_checks:
                key = f"{c.check_id} {c.check_name}"
                failure_counts[key] = failure_counts.get(key, 0) + 1

    if failure_counts:
        lines.append("  TOP FAILURES:")
        sorted_failures = sorted(failure_counts.items(), key=lambda x: -x[1])
        for check, count in sorted_failures[:10]:
            lines.append(f"    {count:3d}x  {check}")
        lines.append("")

    # Per-lesson status
    lines.append("  PER-LESSON:")
    for r in sorted(reports, key=lambda x: x.lesson_code):
        sym = VERDICT_SYMBOLS.get(r.verdict, "??")
        lines.append(f"    {sym} {r.lesson_code}: {r.total_passed}/{r.total_checks} "
                     f"({r.total_failed} fail, {r.total_pending} pending)")
    lines.append("")
    lines.append(f"{'='*70}")

    return "\n".join(lines)


def save_report(report: LessonReport, format: str = "both") -> List[Path]:
    """Save a lesson report to files.

    Args:
        report: The lesson report.
        format: "text", "json", or "both".

    Returns:
        List of saved file paths.
    """
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    saved = []

    if format in ("text", "both"):
        text_path = REPORTS_DIR / f"{report.lesson_code}_report.txt"
        with open(text_path, "w", encoding="utf-8") as f:
            f.write(generate_report_card(report))
        saved.append(text_path)

    if format in ("json", "both"):
        json_path = REPORTS_DIR / f"{report.lesson_code}_report.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(generate_json_report(report), f, ensure_ascii=False, indent=2)
        saved.append(json_path)

    return saved


def save_batch_summary(reports: List[LessonReport]) -> Path:
    """Save batch summary report."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = REPORTS_DIR / f"batch_summary_{ts}.txt"
    with open(path, "w", encoding="utf-8") as f:
        f.write(generate_batch_summary(reports))

    # Also save JSON
    json_path = REPORTS_DIR / f"batch_summary_{ts}.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "timestamp": ts,
            "total_lessons": len(reports),
            "reports": [generate_json_report(r) for r in reports],
        }, f, ensure_ascii=False, indent=2)

    return path
