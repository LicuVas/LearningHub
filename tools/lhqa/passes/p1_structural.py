"""Pass 1: Structural Integrity - 13 automated checks.

Validates JSON schema, file existence, naming conventions, prerequisites.
100% automated - no AI needed.
"""

import json
import re
from pathlib import Path
from typing import List

from ..models import CheckResult, PassResult
from .. import loader

PASS_NUMBER = 1
PASS_NAME = "Structural Integrity"

REQUIRED_LESSON_KEYS = [
    "meta", "why_this_matters", "competency_contract",
    "knowledge_progression", "instructional_flow",
]

REQUIRED_META_KEYS = [
    "grade", "module_index", "lesson_code", "title_ro", "duration_minutes",
]

REQUIRED_QUIZ_KEYS = [
    "schema_version", "lesson_code", "items_minim", "items_standard", "items_performanta",
]

ROMANIAN_DIACRITICS = set("ăâîșțĂÂÎȘȚ")


def run(ctx: dict) -> PassResult:
    """Run all 13 structural integrity checks."""
    result = PassResult(pass_number=PASS_NUMBER, pass_name=PASS_NAME)
    lesson = ctx.get("lesson")
    quiz = ctx.get("quiz")
    parsed = ctx.get("parsed")
    lesson_code = ctx.get("lesson_code", "")
    lpath = ctx.get("lesson_path")
    qpath = ctx.get("quiz_path")

    # 1.1 JSON valid & parseable
    result.checks.append(_check_1_1(lesson, lpath))

    # 1.2 All schema fields present
    result.checks.append(_check_1_2(lesson))

    # 1.3 lesson_code matches filename
    result.checks.append(_check_1_3(lesson, lesson_code))

    # 1.4 grade field matches directory
    result.checks.append(_check_1_4(lesson, lpath))

    # 1.5 module_index matches directory
    result.checks.append(_check_1_5(lesson, lpath))

    # 1.6 duration_minutes is reasonable
    result.checks.append(_check_1_6(lesson))

    # 1.7 All prerequisites reference existing lessons
    result.checks.append(_check_1_7(lesson))

    # 1.8 Quiz file exists alongside lesson
    result.checks.append(_check_1_8(qpath))

    # 1.9 Quiz lesson_code matches lesson lesson_code
    result.checks.append(_check_1_9(lesson, quiz))

    # 1.10 All 3 levels present in quiz
    result.checks.append(_check_1_10(quiz))

    # 1.11 No MODEL_ANSWER_REQUIRED stubs
    result.checks.append(_check_1_11(quiz))

    # 1.12 Required meta keys present
    result.checks.append(_check_1_12(lesson))

    # 1.13 Romanian diacritics present
    result.checks.append(_check_1_13(lesson))

    return result


def _check_1_1(lesson: dict, lpath: Path) -> CheckResult:
    """JSON valid & parseable."""
    if lesson is None:
        return CheckResult(
            check_id="1.1", check_name="JSON valid & parseable",
            passed=False, details=f"File not found or invalid JSON: {lpath}",
            severity="critical", fix_suggestion="Verify file exists and contains valid JSON",
        )
    return CheckResult(
        check_id="1.1", check_name="JSON valid & parseable",
        passed=True, details="JSON parsed successfully",
    )


def _check_1_2(lesson: dict) -> CheckResult:
    """All required top-level schema fields present."""
    if not lesson:
        return CheckResult(
            check_id="1.2", check_name="Schema fields present",
            passed=False, details="No lesson data to check",
            severity="critical",
        )
    missing = [k for k in REQUIRED_LESSON_KEYS if k not in lesson]
    if missing:
        return CheckResult(
            check_id="1.2", check_name="Schema fields present",
            passed=False, details=f"Missing keys: {', '.join(missing)}",
            severity="critical",
            fix_suggestion=f"Add missing keys: {', '.join(missing)}",
        )
    return CheckResult(
        check_id="1.2", check_name="Schema fields present",
        passed=True, details=f"All {len(REQUIRED_LESSON_KEYS)} required keys present",
    )


def _check_1_3(lesson: dict, lesson_code: str) -> CheckResult:
    """lesson_code in JSON matches filename."""
    if not lesson:
        return CheckResult(
            check_id="1.3", check_name="lesson_code matches filename",
            passed=False, details="No lesson data", severity="critical",
        )
    meta_code = lesson.get("meta", {}).get("lesson_code", "")
    if meta_code != lesson_code:
        return CheckResult(
            check_id="1.3", check_name="lesson_code matches filename",
            passed=False,
            details=f"meta.lesson_code='{meta_code}' != filename='{lesson_code}'",
            severity="major",
            fix_suggestion=f"Change meta.lesson_code to '{lesson_code}'",
        )
    return CheckResult(
        check_id="1.3", check_name="lesson_code matches filename",
        passed=True, details=f"lesson_code='{meta_code}' matches filename",
    )


def _check_1_4(lesson: dict, lpath: Path) -> CheckResult:
    """grade field matches directory path."""
    if not lesson or not lpath:
        return CheckResult(
            check_id="1.4", check_name="Grade matches directory",
            passed=False, details="No lesson data or path", severity="major",
        )
    meta_grade = lesson.get("meta", {}).get("grade", "")
    path_str = str(lpath)
    # Path should contain /{grade}/ directory
    expected_dir = loader.GRADE_DIRS.get(meta_grade, meta_grade)
    if f"/{expected_dir}/" not in path_str.replace("\\", "/"):
        return CheckResult(
            check_id="1.4", check_name="Grade matches directory",
            passed=False,
            details=f"meta.grade='{meta_grade}' but path doesn't contain '/{expected_dir}/'",
            severity="major",
            fix_suggestion=f"Move file to correct grade directory or fix meta.grade",
        )
    return CheckResult(
        check_id="1.4", check_name="Grade matches directory",
        passed=True, details=f"Grade '{meta_grade}' matches directory path",
    )


def _check_1_5(lesson: dict, lpath: Path) -> CheckResult:
    """module_index matches directory."""
    if not lesson or not lpath:
        return CheckResult(
            check_id="1.5", check_name="Module matches directory",
            passed=False, details="No lesson data or path", severity="major",
        )
    meta_mod = lesson.get("meta", {}).get("module_index")
    if meta_mod is None:
        return CheckResult(
            check_id="1.5", check_name="Module matches directory",
            passed=False, details="meta.module_index is missing",
            severity="major", fix_suggestion="Add module_index to meta",
        )
    path_str = str(lpath).replace("\\", "/")
    expected_dir = f"/m{meta_mod}/"
    if expected_dir not in path_str:
        return CheckResult(
            check_id="1.5", check_name="Module matches directory",
            passed=False,
            details=f"meta.module_index={meta_mod} but path doesn't contain '{expected_dir}'",
            severity="major",
        )
    return CheckResult(
        check_id="1.5", check_name="Module matches directory",
        passed=True, details=f"Module index {meta_mod} matches directory",
    )


def _check_1_6(lesson: dict) -> CheckResult:
    """duration_minutes is set and reasonable (40-90)."""
    if not lesson:
        return CheckResult(
            check_id="1.6", check_name="Duration reasonable",
            passed=False, details="No lesson data", severity="minor",
        )
    duration = lesson.get("meta", {}).get("duration_minutes")
    if duration is None:
        return CheckResult(
            check_id="1.6", check_name="Duration reasonable",
            passed=False, details="duration_minutes not set",
            severity="minor", fix_suggestion="Set duration_minutes (typically 50)",
        )
    if not (40 <= duration <= 90):
        return CheckResult(
            check_id="1.6", check_name="Duration reasonable",
            passed=False, details=f"duration_minutes={duration}, outside 40-90 range",
            severity="minor",
            fix_suggestion="Standard lesson is 50 minutes",
        )
    return CheckResult(
        check_id="1.6", check_name="Duration reasonable",
        passed=True, details=f"Duration: {duration} minutes",
    )


def _check_1_7(lesson: dict) -> CheckResult:
    """All prerequisites reference existing lesson files."""
    if not lesson:
        return CheckResult(
            check_id="1.7", check_name="Prerequisites exist",
            passed=False, details="No lesson data", severity="major",
        )
    prereqs = lesson.get("meta", {}).get("prerequisites", [])
    if not prereqs:
        return CheckResult(
            check_id="1.7", check_name="Prerequisites exist",
            passed=True, details="No prerequisites declared (OK for first lesson)",
        )
    missing = []
    for prereq in prereqs:
        # prereq might be a string code or a dict with a code field
        code = prereq if isinstance(prereq, str) else prereq.get("lesson_code", prereq.get("code", ""))
        if code:
            path = loader.lesson_path(code)
            if path and not path.exists():
                missing.append(code)
    if missing:
        return CheckResult(
            check_id="1.7", check_name="Prerequisites exist",
            passed=False, details=f"Missing prerequisite lessons: {', '.join(missing)}",
            severity="major",
            fix_suggestion="Create missing lesson files or fix prerequisite references",
        )
    return CheckResult(
        check_id="1.7", check_name="Prerequisites exist",
        passed=True, details=f"All {len(prereqs)} prerequisites exist",
    )


def _check_1_8(qpath: Path) -> CheckResult:
    """Quiz file exists alongside lesson."""
    if not qpath:
        return CheckResult(
            check_id="1.8", check_name="Quiz file exists",
            passed=False, details="Could not determine quiz path",
            severity="critical",
        )
    if not qpath.exists():
        return CheckResult(
            check_id="1.8", check_name="Quiz file exists",
            passed=False, details=f"Quiz file not found: {qpath.name}",
            severity="critical",
            fix_suggestion=f"Create {qpath.name} alongside the lesson file",
        )
    return CheckResult(
        check_id="1.8", check_name="Quiz file exists",
        passed=True, details=f"Quiz file found: {qpath.name}",
    )


def _check_1_9(lesson: dict, quiz: dict) -> CheckResult:
    """Quiz lesson_code matches lesson lesson_code."""
    if not lesson or not quiz:
        return CheckResult(
            check_id="1.9", check_name="Quiz code matches lesson",
            passed=False if not quiz else True,
            details="Missing lesson or quiz data",
            severity="major",
        )
    lesson_code = lesson.get("meta", {}).get("lesson_code", "")
    quiz_code = quiz.get("lesson_code", "")
    if lesson_code != quiz_code:
        return CheckResult(
            check_id="1.9", check_name="Quiz code matches lesson",
            passed=False,
            details=f"Lesson code='{lesson_code}' != quiz code='{quiz_code}'",
            severity="major",
            fix_suggestion=f"Fix quiz lesson_code to '{lesson_code}'",
        )
    return CheckResult(
        check_id="1.9", check_name="Quiz code matches lesson",
        passed=True, details=f"Both use code '{lesson_code}'",
    )


def _check_1_10(quiz: dict) -> CheckResult:
    """All 3 difficulty levels present and non-empty in quiz."""
    if not quiz:
        return CheckResult(
            check_id="1.10", check_name="All 3 quiz levels present",
            passed=False, details="No quiz data",
            severity="critical",
        )
    levels = {
        "items_minim": quiz.get("items_minim", []),
        "items_standard": quiz.get("items_standard", []),
        "items_performanta": quiz.get("items_performanta", []),
    }
    empty = [k for k, v in levels.items() if not v]
    if empty:
        return CheckResult(
            check_id="1.10", check_name="All 3 quiz levels present",
            passed=False, details=f"Empty or missing levels: {', '.join(empty)}",
            severity="critical",
            fix_suggestion="Add quiz items for all three levels",
        )
    counts = {k: len(v) for k, v in levels.items()}
    return CheckResult(
        check_id="1.10", check_name="All 3 quiz levels present",
        passed=True,
        details=f"minim={counts['items_minim']}, standard={counts['items_standard']}, performanta={counts['items_performanta']}",
    )


def _check_1_11(quiz: dict) -> CheckResult:
    """No MODEL_ANSWER_REQUIRED stubs remaining in quiz."""
    if not quiz:
        return CheckResult(
            check_id="1.11", check_name="No answer stubs",
            passed=False, details="No quiz data", severity="critical",
        )
    quiz_str = json.dumps(quiz, ensure_ascii=False)
    stub_count = quiz_str.count("MODEL_ANSWER_REQUIRED")
    if stub_count > 0:
        return CheckResult(
            check_id="1.11", check_name="No answer stubs",
            passed=False,
            details=f"Found {stub_count} MODEL_ANSWER_REQUIRED placeholders",
            severity="critical",
            fix_suggestion="Replace all MODEL_ANSWER_REQUIRED with actual model answers",
        )
    # Also check for other common stubs
    other_stubs = ["TODO", "TBD", "FIXME", "PLACEHOLDER", "INSERT_ANSWER"]
    found_other = []
    for stub in other_stubs:
        if stub in quiz_str.upper():
            found_other.append(stub)
    if found_other:
        return CheckResult(
            check_id="1.11", check_name="No answer stubs",
            passed=False,
            details=f"Found placeholder markers: {', '.join(found_other)}",
            severity="major",
            fix_suggestion="Replace all placeholder text with actual content",
        )
    return CheckResult(
        check_id="1.11", check_name="No answer stubs",
        passed=True, details="No placeholder stubs found",
    )


def _check_1_12(lesson: dict) -> CheckResult:
    """Required meta keys all present."""
    if not lesson:
        return CheckResult(
            check_id="1.12", check_name="Required meta keys",
            passed=False, details="No lesson data", severity="critical",
        )
    meta = lesson.get("meta", {})
    missing = [k for k in REQUIRED_META_KEYS if k not in meta]
    if missing:
        return CheckResult(
            check_id="1.12", check_name="Required meta keys",
            passed=False, details=f"Missing meta keys: {', '.join(missing)}",
            severity="critical",
            fix_suggestion=f"Add missing keys to meta: {', '.join(missing)}",
        )
    return CheckResult(
        check_id="1.12", check_name="Required meta keys",
        passed=True, details=f"All {len(REQUIRED_META_KEYS)} required meta keys present",
    )


def _check_1_13(lesson: dict) -> CheckResult:
    """Romanian diacritics present (content is in Romanian, not stripped)."""
    if not lesson:
        return CheckResult(
            check_id="1.13", check_name="Romanian diacritics present",
            passed=False, details="No lesson data", severity="minor",
        )
    lesson_str = json.dumps(lesson, ensure_ascii=False)
    found = [c for c in ROMANIAN_DIACRITICS if c in lesson_str]
    if not found:
        return CheckResult(
            check_id="1.13", check_name="Romanian diacritics present",
            passed=False,
            details="No Romanian diacritics (ă, â, î, ș, ț) found in lesson content",
            severity="minor",
            fix_suggestion="Content should use proper Romanian diacritics",
        )
    return CheckResult(
        check_id="1.13", check_name="Romanian diacritics present",
        passed=True, details=f"Found diacritics: {', '.join(sorted(found))}",
    )
