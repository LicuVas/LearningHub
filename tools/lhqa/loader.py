"""Data loader for LHQA - loads lessons, quizzes, curriculum, content map."""

import json
from pathlib import Path
from typing import List, Optional, Dict
from functools import lru_cache

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT_GIMNAZIU = PROJECT_ROOT / "content" / "gimnaziu"
CONTENT_TIC = PROJECT_ROOT / "content" / "tic"

GRADE_DIRS = {"V": "V", "VI": "VI", "VII": "VII", "VIII": "VIII"}
GRADE_NUMS = {"V": "5", "VI": "6", "VII": "7", "VIII": "8"}
NUM_TO_GRADE = {v: k for k, v in GRADE_NUMS.items()}


def _load_json(path: Path) -> Optional[dict]:
    """Safely load a JSON file."""
    if not path.exists():
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@lru_cache(maxsize=1)
def load_curriculum() -> dict:
    """Load curriculum_data.json (official Romanian curriculum)."""
    return _load_json(PROJECT_ROOT / "curriculum_data.json") or {}


@lru_cache(maxsize=1)
def load_content_map() -> dict:
    """Load content_map.json (module-to-path mapping, school calendar)."""
    return _load_json(PROJECT_ROOT / "content_map.json") or {}


@lru_cache(maxsize=1)
def load_concepts_graph() -> dict:
    """Load concepts-graph.json (knowledge graph)."""
    return _load_json(PROJECT_ROOT / "data" / "concepts-graph.json") or {}


@lru_cache(maxsize=1)
def load_worksheet_schema() -> dict:
    """Load data/worksheets/schema.json (worksheet validation schema)."""
    return _load_json(PROJECT_ROOT / "data" / "worksheets" / "schema.json") or {}


def parse_lesson_code(lesson_code: str) -> Optional[Dict[str, str]]:
    """Parse 'V-M1-L01' into {grade: 'V', module: 1, lesson: 1}."""
    parts = lesson_code.split("-")
    if len(parts) != 3:
        return None
    try:
        grade = parts[0]
        module = int(parts[1].replace("M", ""))
        lesson = int(parts[2].replace("L", ""))
        return {"grade": grade, "module": module, "lesson": lesson}
    except (ValueError, IndexError):
        return None


def lesson_path(lesson_code: str) -> Optional[Path]:
    """Get filesystem path for a lesson JSON file."""
    parsed = parse_lesson_code(lesson_code)
    if not parsed:
        return None
    grade_dir = GRADE_DIRS.get(parsed["grade"])
    if not grade_dir:
        return None
    return CONTENT_GIMNAZIU / grade_dir / f"m{parsed['module']}" / f"{lesson_code}.json"


def quiz_path(lesson_code: str) -> Optional[Path]:
    """Get filesystem path for a quiz JSON file."""
    parsed = parse_lesson_code(lesson_code)
    if not parsed:
        return None
    grade_dir = GRADE_DIRS.get(parsed["grade"])
    if not grade_dir:
        return None
    return CONTENT_GIMNAZIU / grade_dir / f"m{parsed['module']}" / f"{lesson_code}.quiz.json"


def load_lesson(lesson_code: str) -> Optional[dict]:
    """Load a lesson JSON by its code (e.g., 'V-M1-L01')."""
    path = lesson_path(lesson_code)
    if not path:
        return None
    return _load_json(path)


def load_quiz(lesson_code: str) -> Optional[dict]:
    """Load a quiz JSON by its lesson code."""
    path = quiz_path(lesson_code)
    if not path:
        return None
    return _load_json(path)


def discover_all_lessons() -> List[str]:
    """Find all lesson JSON files and return their codes, sorted."""
    lessons = []
    if not CONTENT_GIMNAZIU.exists():
        return lessons
    for grade_dir in sorted(CONTENT_GIMNAZIU.iterdir()):
        if not grade_dir.is_dir():
            continue
        for module_dir in sorted(grade_dir.iterdir()):
            if not module_dir.is_dir() or not module_dir.name.startswith("m"):
                continue
            for f in sorted(module_dir.glob("*.json")):
                if f.name.endswith(".quiz.json"):
                    continue
                code = f.stem
                if "-M" in code and "-L" in code:
                    lessons.append(code)
    return lessons


def discover_module_lessons(grade: str, module: int) -> List[str]:
    """Find all lessons in a specific module."""
    prefix = f"{grade}-M{module}-"
    return [l for l in discover_all_lessons() if l.startswith(prefix)]


def discover_grade_lessons(grade: str) -> List[str]:
    """Find all lessons for a specific grade."""
    prefix = f"{grade}-M"
    return [l for l in discover_all_lessons() if l.startswith(prefix)]


def get_module_info(grade: str, module: int) -> dict:
    """Get module metadata from content_map.json."""
    cm = load_content_map()
    grade_num = GRADE_NUMS.get(grade, grade)
    grade_data = cm.get("grades", {}).get(grade_num, {})
    modules = grade_data.get("modules", {})
    mod_key = f"M{module}"
    return modules.get(mod_key, {})


def get_curriculum_for_grade(grade: str) -> dict:
    """Get curriculum data for a specific grade."""
    curr = load_curriculum()
    grade_num = GRADE_NUMS.get(grade, grade)
    return curr.get("grades", {}).get(f"grade_{grade_num}", {})


def load_lesson_with_context(lesson_code: str) -> dict:
    """Load a lesson with all related data for evaluation.

    Returns dict with keys: lesson, quiz, curriculum, content_map,
    module_info, parsed_code, lesson_path, quiz_path.
    """
    parsed = parse_lesson_code(lesson_code)
    lesson = load_lesson(lesson_code)
    quiz = load_quiz(lesson_code)

    return {
        "lesson_code": lesson_code,
        "parsed": parsed,
        "lesson": lesson,
        "quiz": quiz,
        "curriculum": load_curriculum(),
        "content_map": load_content_map(),
        "concepts_graph": load_concepts_graph(),
        "worksheet_schema": load_worksheet_schema(),
        "module_info": get_module_info(parsed["grade"], parsed["module"]) if parsed else {},
        "grade_curriculum": get_curriculum_for_grade(parsed["grade"]) if parsed else {},
        "lesson_path": lesson_path(lesson_code),
        "quiz_path": quiz_path(lesson_code),
    }
