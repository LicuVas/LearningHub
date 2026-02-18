#!/usr/bin/env python3
"""
Migrate cls9 (Liceu) 5-Step format lessons to Format C (Guided Atomic).

cls9 Structure: GOAL > TRY > LEARN > TEST > COMPLETE (with section-* IDs)
Format C:       FRAME > TRY > ATOMS > PRACTICE > REVIEW

Differences from TIC 5-step migration:
  - Section IDs use 'section-' prefix (section-goal vs goal)
  - Quiz uses data-question/data-answer + correctAnswers JS array
  - Content path: content/liceu/mat-info/cls9/
  - Depth: 5 levels to assets/
  - Grade name: Clasa a IX-a

Usage:
  python tools/migrate_cls9_to_c.py --scan               # Find cls9 lesson files
  python tools/migrate_cls9_to_c.py --all --dry-run       # Preview migration
  python tools/migrate_cls9_to_c.py --all                 # Migrate all
  python tools/migrate_cls9_to_c.py --single path/file.html
"""

import argparse
import io
import json
import os
import re
import sys
from pathlib import Path

if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    from bs4 import BeautifulSoup, NavigableString, Tag
except ImportError:
    print("ERROR: beautifulsoup4 required. Run: pip install beautifulsoup4")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "liceu" / "mat-info"
ASSETS_DIR = PROJECT_ROOT / "assets"

FORMAT_C_SCRIPTS = [
    "atomic-learning.js",
    "practice-simple.js",
    "lesson-summary.js",
    "breadcrumb.js",
    "progress.js",
    "user-system.js",
]

SKIP_PATTERNS = ["index.html", "quiz", "prezentare", "test-", "backup"]

GRADE_NAMES = {
    "cls9": "Clasa a IX-a",
    "cls10": "Clasa a X-a",
    "cls11": "Clasa a XI-a",
    "cls12": "Clasa a XII-a",
}


def is_cls9_lesson(filepath):
    """Check if file is a cls9 5-step format lesson."""
    name = filepath.name.lower()
    for pat in SKIP_PATTERNS:
        if pat in name:
            return False
    content = filepath.read_text(encoding="utf-8", errors="replace")
    has_goto = "goToStep" in content
    has_sections = 'id="section-goal"' in content or 'id="section-learn"' in content
    already_converted = 'class="atom"' in content and "data-quiz" in content and 'lesson-atomic.css' in content
    return has_goto and has_sections and not already_converted


def compute_depth(filepath):
    file_dir = filepath.parent
    return os.path.relpath(ASSETS_DIR, file_dir).replace("\\", "/")


def derive_lesson_id(filepath):
    parts = filepath.relative_to(CONTENT_DIR).parts
    grade = parts[0]
    module = parts[1]
    filename = filepath.stem
    return f"{grade}-{module}-{filename}"


def get_breadcrumb_info(filepath):
    parts = filepath.relative_to(CONTENT_DIR).parts
    grade = parts[0]
    module = parts[1]
    module_display = module.replace("-", " ").title()
    module_display = re.sub(r"^M(\d+)", r"M\1", module_display)
    return {
        "grade": grade,
        "gradeName": GRADE_NAMES.get(grade, grade),
        "module": module,
        "moduleName": module_display,
    }


def extract_concept_cards(soup):
    """Extract content from LEARN section concept cards."""
    cards = []
    learn_section = soup.select_one("#section-learn")
    if not learn_section:
        return cards

    for card in learn_section.select(".concept-card"):
        # Get title from concept-name
        title_el = card.select_one(".concept-name")
        title = title_el.get_text(strip=True) if title_el else "Continut"
        # Remove emoji prefix
        title = re.sub(r"^[^\w\s]*\s*", "", title).strip()

        # Get all content after the concept-name
        content_parts = []
        for child in card.children:
            if isinstance(child, Tag):
                # Skip the concept-name (title)
                if "concept-name" in (child.get("class") or []):
                    continue
                # Skip inline-practice elements (will be handled separately)
                if "inline-practice" in (child.get("class") or []):
                    continue
                # Clean inline styles
                html_str = str(child)
                html_str = re.sub(r'\s*style="[^"]*"', '', html_str)
                content_parts.append(html_str)
            elif isinstance(child, NavigableString) and child.strip():
                content_parts.append(f"<p>{child.strip()}</p>")

        cards.append({
            "title": title,
            "content_html": "\n                ".join(content_parts),
        })

    return cards


def extract_quiz_questions(soup, raw_text):
    """
    Parse quiz questions from cls9 TEST section.
    Uses data-question/data-answer attributes + correctAnswers JS array.
    """
    questions = []

    test_section = soup.select_one("#section-test")
    if not test_section:
        return questions

    # Parse correctAnswers from script
    correct_match = re.search(
        r"correctAnswers\s*=\s*\[([^\]]+)\]",
        raw_text
    )
    correct_answers = []
    if correct_match:
        correct_answers = re.findall(r"'([a-d])'", correct_match.group(1))

    # Parse explanations from script (if present)
    explanations = {}
    exp_match = re.search(
        r"explanations\s*=\s*\{([^}]+)\}",
        raw_text,
        re.DOTALL
    )
    if exp_match:
        for m in re.finditer(r"(\d+)\s*:\s*'([^']+)'", exp_match.group(1)):
            explanations[int(m.group(1))] = m.group(2)

    # Extract question elements
    for q_el in test_section.select(".quiz-question"):
        q_idx = int(q_el.get("data-question", "0"))

        # Get question text
        h4 = q_el.select_one("h4")
        q_text = h4.get_text(strip=True) if h4 else ""
        # Remove "1. " prefix
        q_text = re.sub(r"^\d+\.\s*", "", q_text)

        # Get options
        options = []
        for opt in q_el.select(".quiz-option"):
            opt_text = opt.get_text(strip=True)
            # Remove "a) " prefix
            opt_text = re.sub(r"^[a-d]\)\s*", "", opt_text)
            options.append(opt_text)

        # Get correct answer
        correct_letter = correct_answers[q_idx] if q_idx < len(correct_answers) else "a"

        # Get explanation/hint
        hint = explanations.get(q_idx, "Reciteste sectiunea din lectie.")

        questions.append({
            "question": q_text,
            "options": options,
            "correct": correct_letter,
            "hint": hint,
        })

    return questions


def extract_goal_info(soup):
    """Extract goal text and title from section-goal."""
    goal = soup.select_one("#section-goal")
    if not goal:
        return "", ""

    title_el = goal.select_one(".goal-title")
    title = title_el.get_text(strip=True) if title_el else ""

    desc_el = goal.select_one(".goal-desc")
    desc = desc_el.get_text(strip=True) if desc_el else ""

    return title, desc


def extract_try_content(soup):
    """Extract TRY section content, cleaning inline styles."""
    try_section = soup.select_one("#section-try .try-section")
    if not try_section:
        return None

    # Get the challenge content
    content_parts = []
    for child in try_section.children:
        if isinstance(child, Tag):
            # Skip navigation buttons
            if "nav-buttons" in (child.get("class") or []):
                continue
            # Skip try-header (we'll add our own)
            if "try-header" in (child.get("class") or []):
                continue
            html_str = str(child)
            # Clean inline styles
            html_str = re.sub(r'\s*style="[^"]*"', '', html_str)
            content_parts.append(html_str)

    return "\n            ".join(content_parts) if content_parts else None


def extract_summary_bullets(soup):
    """Extract summary from COMPLETE section."""
    complete = soup.select_one("#section-complete")
    if not complete:
        return []

    bullets = []
    for li in complete.select("li"):
        text = li.get_text(strip=True)
        if text:
            bullets.append(text)
    return bullets


def extract_practice_exercises(soup):
    """Extract practice exercises from practice-advanced section."""
    exercises = []
    practice = soup.select_one(".practice-advanced")
    if not practice:
        return exercises

    for ex in practice.select(".practice-exercise"):
        title_el = ex.select_one("h4")
        title = title_el.get_text(strip=True) if title_el else ""
        # Clean title: remove "Exercitiu N: " prefix
        title = re.sub(r"^Exercitiu?\s*\d+\s*[:.]?\s*", "", title)

        # Get content (description text, not interactive elements)
        desc_el = ex.select_one("p")
        desc = desc_el.get_text(strip=True) if desc_el else ""

        exercises.append({"title": title, "description": desc})

    return exercises


def extract_next_lesson(soup):
    """Find next lesson URL from navigation or complete section."""
    # Check next-btn link in complete section
    next_link = soup.select_one(".next-btn")
    if next_link and next_link.get("href"):
        return next_link["href"]

    # Check nav-bar
    for a in soup.select(".nav-bar a, .nav-buttons a"):
        href = a.get("href", "")
        text = a.get_text(strip=True).lower()
        if "urmatoare" in text or "next" in text:
            return href

    return None


def build_format_c(filepath, soup, raw_text):
    """Build Format C HTML from extracted cls9 content."""
    depth = compute_depth(filepath)
    lesson_id = derive_lesson_id(filepath)
    bc_info = get_breadcrumb_info(filepath)

    # Extract all content
    lesson_title, goal_desc = extract_goal_info(soup)
    try_content = extract_try_content(soup)
    concept_cards = extract_concept_cards(soup)
    quiz_questions = extract_quiz_questions(soup, raw_text)
    practice_exercises = extract_practice_exercises(soup)
    summary_bullets = extract_summary_bullets(soup)
    next_href = extract_next_lesson(soup)

    # Page title from <title> tag
    title_el = soup.select_one("title")
    page_title = title_el.get_text(strip=True).split("|")[0].strip() if title_el else lesson_title

    # Generate learning outcomes from concept cards
    outcomes = []
    for card in concept_cards[:5]:
        outcomes.append(f"Sa intelegi si sa aplici: {card['title']}")

    # If no summary, generate from concept cards
    if not summary_bullets and concept_cards:
        summary_bullets = [card["title"] for card in concept_cards]

    # Distribute quiz questions across atoms (round-robin)
    atom_quizzes = {}
    if concept_cards:
        for i, q in enumerate(quiz_questions):
            atom_idx = i % len(concept_cards)
            if atom_idx not in atom_quizzes:
                atom_quizzes[atom_idx] = []
            atom_quizzes[atom_idx].append(q)

    # Build HTML
    lines = []
    lines.append('<!DOCTYPE html>')
    lines.append('<html lang="ro">')
    lines.append('<head>')
    lines.append('<meta charset="utf-8">')
    lines.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
    lines.append(f'<title>{page_title} | {bc_info["gradeName"]} Mat-Info</title>')
    lines.append('<link rel="preconnect" href="https://fonts.googleapis.com">')
    lines.append('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">')
    lines.append(f'<link rel="stylesheet" href="{depth}/css/lesson-atomic.css">')
    lines.append('<!-- NO inline <style> blocks. ZERO. -->')
    lines.append('</head>')
    lines.append('<body>')
    lines.append('<div class="container">')
    lines.append('')

    # NAV
    lines.append('    <!-- NAV BAR -->')
    lines.append('    <nav class="nav-bar">')
    lines.append('        <a href="index.html" class="nav-btn" title="Inapoi la modul">&#8592; Modulul</a>')
    if next_href:
        lines.append(f'        <a href="{next_href}" class="nav-btn" title="Lectia urmatoare">Urmatoarea &#8594;</a>')
    lines.append('    </nav>')
    lines.append('')

    # HEADER
    lines.append('    <!-- HEADER -->')
    lines.append('    <header class="lesson-header">')
    lines.append('        <span class="lesson-badge">Invatare Atomica</span>')
    lines.append(f'        <h1 class="lesson-title">{lesson_title}</h1>')
    lines.append('    </header>')
    lines.append('')

    # PROGRESS
    lines.append('    <!-- PROGRESS BAR -->')
    lines.append('    <div class="progress-container">')
    lines.append('        <span class="progress-label">Progres lectie:</span>')
    lines.append('        <div class="progress-bar-wrapper">')
    lines.append('            <div class="progress-bar-fill" id="progress-fill"></div>')
    lines.append('        </div>')
    lines.append('        <span class="progress-percent" id="progress-percent">0%</span>')
    lines.append('    </div>')
    lines.append('')

    # FRAME
    lines.append('    <!-- ═══════════════ FRAME SECTION ═══════════════ -->')
    lines.append('    <section class="lesson-frame">')
    lines.append('        <div class="goal-section">')
    lines.append('            <div class="goal-header">')
    lines.append('                <span class="goal-icon">&#127919;</span>')
    lines.append('                <h2 class="goal-title">Obiectivul lectiei</h2>')
    lines.append('            </div>')
    if goal_desc:
        lines.append(f'            <p class="goal-text">{goal_desc}</p>')
    lines.append('        </div>')

    if outcomes:
        lines.append('        <div class="learning-outcomes">')
        lines.append('            <h3>Dupa aceasta lectie vei putea:</h3>')
        lines.append('            <ul>')
        for o in outcomes:
            lines.append(f'                <li>{o}</li>')
        lines.append('            </ul>')
        lines.append('        </div>')
    lines.append('    </section>')
    lines.append('')

    # TRY
    if try_content and len(try_content.strip()) > 30:
        lines.append('    <!-- ═══════════════ TRY SECTION ═══════════════ -->')
        lines.append('    <section class="try-section">')
        lines.append('        <h2>Incearca singur!</h2>')
        lines.append('        <div class="try-challenge">')
        lines.append(f'            {try_content}')
        lines.append('        </div>')
        lines.append('    </section>')
        lines.append('')

    # ATOMS
    lines.append('    <!-- ═══════════════ ATOMS ═══════════════ -->')
    lines.append('    <main id="atomic-content">')
    lines.append('')

    for i, card in enumerate(concept_cards):
        atom_num = i + 1
        atom_id = f"atom-{atom_num}"

        # Build data-quiz attribute
        quiz_attr = ""
        if i in atom_quizzes:
            quiz_data = atom_quizzes[i]
            quiz_json = json.dumps(quiz_data, ensure_ascii=False)
            quiz_json = quiz_json.replace("'", "&#39;")
            quiz_attr = f" data-quiz='{quiz_json}'"

        lines.append(f'        <div class="atom" id="{atom_id}"{quiz_attr}>')
        lines.append(f'            <div class="atom-header">')
        lines.append(f'                <div class="atom-number">{atom_num}</div>')
        lines.append(f'                <h3 class="atom-title">{atom_num}. {card["title"]}</h3>')
        lines.append(f'            </div>')
        lines.append(f'            <div class="atom-content">')
        lines.append(f'                {card["content_html"]}')
        lines.append(f'            </div>')
        lines.append(f'        </div>')
        lines.append('')

    lines.append('    </main>')
    lines.append('')

    # PRACTICE
    levels = ["minim", "standard", "performanta"]
    level_names = {"minim": "Nivel minim", "standard": "Nivel standard", "performanta": "Nivel performanta"}

    lines.append('    <!-- ═══════════════ PRACTICE ═══════════════ -->')
    lines.append('    <section class="practice-section" id="practice">')
    lines.append('        <h2>Exercitii practice</h2>')

    if practice_exercises:
        for i, ex in enumerate(practice_exercises):
            level = levels[min(i, len(levels) - 1)]
            lines.append(f'        <div class="practice-exercise" data-level="{level}">')
            lines.append(f'            <h3>Exercitiul {i + 1} ({level_names[level]}){" - " + ex["title"] if ex["title"] else ""}</h3>')
            if ex["description"]:
                lines.append(f'            <p>{ex["description"]}</p>')
            lines.append(f'        </div>')
    else:
        for i, level in enumerate(levels):
            lines.append(f'        <div class="practice-exercise" data-level="{level}">')
            lines.append(f'            <h3>Exercitiul {i + 1} ({level_names[level]})</h3>')
            lines.append(f'            <p><!-- MANUAL_REVIEW: Add exercise content --></p>')
            lines.append(f'        </div>')

    lines.append('    </section>')
    lines.append('')

    # REVIEW
    lines.append('    <!-- ═══════════════ REVIEW ═══════════════ -->')
    lines.append('    <section class="review-section">')
    lines.append('        <div class="summary-box">')
    lines.append('            <h2>Ce ai invatat astazi</h2>')
    lines.append('            <ul>')
    for bullet in summary_bullets:
        lines.append(f'                <li>{bullet}</li>')
    lines.append('            </ul>')
    lines.append('        </div>')
    lines.append('')
    lines.append('        <div id="lesson-summary" style="display: none;"></div>')
    lines.append('')
    if next_href:
        lines.append('        <div class="next-lesson">')
        lines.append('            <h3>Urmatoarea lectie</h3>')
        lines.append('            <p>Continua cu lectia urmatoare pentru a aprofunda cunostintele.</p>')
        lines.append(f'            <a href="{next_href}" class="btn-next">Continua &#8594;</a>')
        lines.append('        </div>')
    lines.append('    </section>')
    lines.append('')
    lines.append('</div>')
    lines.append('')

    # SCRIPTS
    lines.append('<!-- ═══════════════ SCRIPTS ═══════════════ -->')
    for script_name in FORMAT_C_SCRIPTS:
        lines.append(f'<script src="{depth}/js/{script_name}"></script>')

    lines.append('<script>')
    lines.append("    document.addEventListener('DOMContentLoaded', function() {")
    lines.append(f"        AtomicLearning.init('{lesson_id}');")
    lines.append(f"        PracticeSimple.init('{lesson_id}');")
    lines.append(f"        LessonSummary.init('{lesson_id}');")
    lines.append(f"        Breadcrumb.init({{")
    lines.append(f"            grade: '{bc_info['grade']}',")
    lines.append(f"            gradeName: '{bc_info['gradeName']}',")
    lines.append(f"            module: '{bc_info['module']}',")
    lines.append(f"            moduleName: '{bc_info['moduleName']}',")
    lines.append(f"            lesson: '{lesson_title}'")
    lines.append(f"        }});")
    lines.append(f"        LearningProgress.init('{bc_info['grade']}', '{bc_info['module']}', '{filepath.stem}.html');")
    lines.append('    });')
    lines.append('</script>')
    lines.append('</body>')
    lines.append('</html>')

    return "\n".join(lines)


def migrate_file(filepath, dry_run=False):
    """Migrate a cls9 file to Format C. Returns (changes, errors, warnings)."""
    changes = []
    errors = []
    warnings = []

    try:
        raw_text = filepath.read_text(encoding="utf-8", errors="replace")
        soup = BeautifulSoup(raw_text, "html.parser")

        concept_cards = extract_concept_cards(soup)
        quiz_questions = extract_quiz_questions(soup, raw_text)
        practice_exercises = extract_practice_exercises(soup)
        summary = extract_summary_bullets(soup)
        try_content = extract_try_content(soup)

        # Count inline styles
        inline_style_count = raw_text.count('style="')

        changes.append(f"{len(concept_cards)} concepts -> atoms, {len(quiz_questions)} quiz Qs, {len(practice_exercises)} exercises")
        changes.append(f"Removed: {inline_style_count} inline style attributes")
        if try_content:
            changes.append("Preserved: TRY section")
        if summary:
            changes.append(f"Preserved: {len(summary)} summary bullets")

        if not concept_cards:
            warnings.append("No concept cards found in LEARN section")
        if not quiz_questions:
            warnings.append("No quiz questions extracted from TEST section")
        if not practice_exercises:
            warnings.append("No practice exercises - placeholders inserted")

        new_html = build_format_c(filepath, soup, raw_text)

        if not dry_run:
            filepath.write_text(new_html, encoding="utf-8")

    except Exception as e:
        errors.append(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

    return changes, errors, warnings


def find_cls9_files(grade=None):
    """Find all cls9 lesson files."""
    files = []
    search_dir = CONTENT_DIR / (grade or "cls9")
    if not search_dir.exists():
        print(f"ERROR: Directory not found: {search_dir}")
        return files
    for html_file in sorted(search_dir.rglob("*.html")):
        if is_cls9_lesson(html_file):
            files.append(html_file)
    return files


def main():
    parser = argparse.ArgumentParser(description="Migrate cls9 lessons to Format C")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--single", type=str, help="Migrate a single file")
    group.add_argument("--all", action="store_true", help="Migrate all cls9 files")
    group.add_argument("--scan", action="store_true", help="List files to migrate")
    parser.add_argument("--dry-run", action="store_true", help="Preview without writing")
    parser.add_argument("--verbose", action="store_true", help="Show detailed changes")

    args = parser.parse_args()

    if args.scan:
        files = find_cls9_files()
        print(f"cls9 lesson files to migrate: {len(files)}\n")
        for f in files:
            print(f"  {f.relative_to(PROJECT_ROOT)}")
        return

    if args.single:
        filepath = Path(args.single)
        if not filepath.is_absolute():
            filepath = PROJECT_ROOT / filepath
        if not filepath.exists():
            print(f"ERROR: File not found: {filepath}")
            sys.exit(1)
        files = [filepath]
    else:
        files = find_cls9_files()

    if not files:
        print("No cls9 lesson files found to migrate.")
        sys.exit(0)

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Migrating {len(files)} cls9 files to Format C...")
    print("=" * 60)

    results = {"migrated": 0, "errors": 0, "warnings": 0}

    for filepath in files:
        rel_path = filepath.relative_to(PROJECT_ROOT)
        changes, errors, warnings = migrate_file(filepath, dry_run=args.dry_run)

        if errors:
            results["errors"] += 1
            print(f"  ERROR: {rel_path}")
            for e in errors:
                print(f"         {e}")
        else:
            results["migrated"] += 1
            results["warnings"] += len(warnings)
            print(f"  {'WOULD ' if args.dry_run else ''}MIGRATE: {rel_path}")
            if args.verbose or warnings:
                for c in changes:
                    print(f"           {c}")
                for w in warnings:
                    print(f"           WARNING: {w}")

    print("=" * 60)
    print(f"Results: {results['migrated']} migrated, {results['errors']} errors, {results['warnings']} warnings")


if __name__ == "__main__":
    main()
