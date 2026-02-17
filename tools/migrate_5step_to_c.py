#!/usr/bin/env python3
"""
Migrate 5-Step format lessons to Format C (Guided Atomic).

5-Step structure: GOAL > TRY > LEARN > TEST > COMPLETE
Format C:         FRAME > TRY > ATOMS > PRACTICE > REVIEW

Transformations:
  1. GOAL section → FRAME (goal + pain comparison + learning outcomes)
  2. TRY section  → TRY (keep challenge content, restyle)
  3. LEARN cards  → ATOMS (each .concept-card becomes one atom)
  4. TEST quizzes → Distributed into atoms as data-quiz attributes
  5. COMPLETE     → REVIEW (summary + grade + next lesson)
  6. PRACTICE     → PRACTICE with data-level attributes
  7. Remove ALL inline CSS, fix scripts, fix nav

Usage:
  python tools/migrate_5step_to_c.py --single content/tic/cls5/.../file.html
  python tools/migrate_5step_to_c.py --grade cls5
  python tools/migrate_5step_to_c.py --all
  Add --dry-run to preview without writing.
"""

import argparse
import io
import json
import os
import re
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    from bs4 import BeautifulSoup, Comment, NavigableString, Tag
except ImportError:
    print("ERROR: beautifulsoup4 required. Run: pip install beautifulsoup4")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
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
    "cls5": "Clasa a V-a",
    "cls6": "Clasa a VI-a",
    "cls7": "Clasa a VII-a",
    "cls8": "Clasa a VIII-a",
}


def is_5step_lesson(filepath):
    """Check if file is a 5-Step format lesson."""
    name = filepath.name.lower()
    for pat in SKIP_PATTERNS:
        if pat in name:
            return False
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    has_goto = "goToStep" in content
    has_sections = 'id="goal"' in content or 'id="learn"' in content
    # Exclude files already converted to atomic
    has_atom = 'class="atom"' in content and "data-quiz" in content
    return has_goto and has_sections and not has_atom


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


def extract_quiz_questions(soup):
    """
    Parse quiz questions from 5-Step TEST section.
    Returns list of: {question, options: [{text, correct, explanation}], hint}
    """
    questions = []
    test_section = soup.select_one("#test")
    if not test_section:
        return questions

    # Group options by question ID
    q_map = {}
    for option_el in test_section.select(".option"):
        onclick = option_el.get("onclick", "")
        # Parse: selectOption(this, 'q1', true, 'explanation text')
        match = re.search(
            r"selectOption\(this,\s*['\"](\w+)['\"],\s*(true|false),\s*['\"](.+?)['\"]\s*\)",
            onclick,
            re.DOTALL,
        )
        if not match:
            # Try alternate pattern with escaped quotes
            match = re.search(
                r"selectOption\(this,\s*['\"](\w+)['\"],\s*(true|false),\s*(.+?)\s*\)",
                onclick,
            )
        if not match:
            continue

        qid = match.group(1)
        is_correct = match.group(2) == "true"
        explanation = match.group(3).strip("'\"")
        # Clean emoji prefixes from explanations
        explanation = re.sub(r"^[✅❌⚠️]\s*", "", explanation)
        # Clean option text (remove "A) " prefix)
        opt_text = option_el.get_text(strip=True)
        opt_text = re.sub(r"^[A-Z]\)\s*", "", opt_text)

        if qid not in q_map:
            q_map[qid] = {"options": [], "question_text": ""}

        q_map[qid]["options"].append({
            "text": opt_text,
            "correct": is_correct,
            "explanation": explanation,
        })

    # Find question text for each question
    for q_el in test_section.select(".quiz-question"):
        qid = q_el.get("id", "")
        if not qid:
            # Try to find from child options
            first_opt = q_el.select_one(".option")
            if first_opt:
                onclick = first_opt.get("onclick", "")
                m = re.search(r"['\"](\w+)['\"]", onclick)
                if m:
                    qid = m.group(1)

        q_text_el = q_el.select_one(".question-text")
        if q_text_el and qid in q_map:
            q_map[qid]["question_text"] = q_text_el.get_text(strip=True)

    # Convert to ordered list
    for qid in sorted(q_map.keys()):
        q = q_map[qid]
        if not q["options"]:
            continue

        # Find correct answer index
        correct_idx = 0
        hint = ""
        options_text = []
        for i, opt in enumerate(q["options"]):
            options_text.append(opt["text"])
            if opt["correct"]:
                correct_idx = i
                hint = opt["explanation"]

        # If no correct explanation found, use first incorrect one as hint
        if not hint:
            for opt in q["options"]:
                if not opt["correct"] and opt["explanation"]:
                    hint = opt["explanation"]
                    break

        correct_letter = chr(97 + correct_idx)  # a, b, c, d

        questions.append({
            "question": q["question_text"],
            "options": options_text,
            "correct": correct_letter,
            "hint": hint or "Gandeste-te la lectie.",
        })

    return questions


def extract_concept_cards(soup):
    """Extract content from LEARN section concept cards."""
    cards = []
    learn_section = soup.select_one("#learn")
    if not learn_section:
        return cards

    for card in learn_section.select(".concept-card"):
        title_el = card.select_one("h3")
        title = title_el.get_text(strip=True) if title_el else "Continut"
        # Remove emoji from title
        title = re.sub(r"^[^\w\s]*\s*", "", title).strip()

        # Get all content after the title
        content_parts = []
        for child in card.children:
            if isinstance(child, Tag) and child.name == "h3":
                continue
            if isinstance(child, Tag):
                content_parts.append(str(child))
            elif isinstance(child, NavigableString) and child.strip():
                content_parts.append(f"<p>{child.strip()}</p>")

        cards.append({
            "title": title,
            "content_html": "\n".join(content_parts),
        })

    return cards


def extract_pain_comparison(soup):
    """Extract pain comparison from GOAL section."""
    goal = soup.select_one("#goal")
    if not goal:
        return None

    pain_section = goal.select_one(".pain-comparison, .pain-scenario")
    if not pain_section:
        return None

    before = pain_section.select_one(".pain-before")
    after = pain_section.select_one(".pain-after")
    if not before or not after:
        return None

    before_items = [li.get_text(strip=True) for li in before.select("li, .pain-text")]
    after_items = [li.get_text(strip=True) for li in after.select("li, .pain-text")]

    # If no list items, try paragraphs
    if not before_items:
        before_items = [p.get_text(strip=True) for p in before.select("p") if p.get_text(strip=True)]
    if not after_items:
        after_items = [p.get_text(strip=True) for p in after.select("p") if p.get_text(strip=True)]

    return {"before": before_items[:3], "after": after_items[:3]}


def extract_goal_text(soup):
    """Extract goal statement from GOAL section."""
    goal = soup.select_one("#goal")
    if not goal:
        return ""

    # Look for goal text in various locations
    for selector in [".goal-text", ".goal-section p", "h2 + p", "p"]:
        el = goal.select_one(selector)
        if el:
            text = el.get_text(strip=True)
            if len(text) > 20:  # Skip short labels
                return text

    return ""


def extract_try_content(soup):
    """Extract TRY section content."""
    try_section = soup.select_one("#try")
    if not try_section:
        return None

    # Get challenge content, skip navigation buttons
    content_parts = []
    for child in try_section.children:
        if isinstance(child, Tag):
            if child.name == "button" or "step-nav" in child.get("class", []):
                continue
            # Skip h2 headings that are just "Pasul 2: ..."
            if child.name == "h2" and "pasul" in child.get_text(strip=True).lower():
                continue
            content_parts.append(str(child))

    return "\n".join(content_parts) if content_parts else None


def extract_summary(soup):
    """Extract summary from COMPLETE section."""
    complete = soup.select_one("#complete")
    if not complete:
        return []

    summary_box = complete.select_one(".summary-box")
    if summary_box:
        return [li.get_text(strip=True) for li in summary_box.select("li")]

    return []


def extract_practice_exercises(soup):
    """Extract practice exercises."""
    exercises = []
    # Try various containers
    practice = soup.select_one(".practice-section, #practice, .practice-advanced")
    if not practice:
        return exercises

    for ex in practice.select(".practice-exercise"):
        title_el = ex.select_one("h3, h4")
        title = title_el.get_text(strip=True) if title_el else ""
        # Get content after title
        content_parts = []
        for child in ex.children:
            if isinstance(child, Tag) and child.name in ("h3", "h4"):
                continue
            if isinstance(child, Tag):
                # Skip hint toggles
                if "practice-hint" in " ".join(child.get("class", [])):
                    continue
                content_parts.append(str(child))
        exercises.append({"title": title, "content_html": "\n".join(content_parts)})

    return exercises


def extract_next_lesson_href(soup):
    """Find the next lesson URL from navigation."""
    for a in soup.select("a"):
        href = a.get("href", "")
        text = a.get_text(strip=True).lower()
        onclick = a.get("onclick", "").lower()
        if ("urmatoare" in text or "next" in text or "→" in text or
                "urmatoare" in onclick):
            return href
        # Check if it's a lectia link that's "next"
    # Fallback: check step navigation or buttons
    for btn in soup.select("button, a"):
        onclick = btn.get("onclick", "")
        if "location" in onclick and "lectia" in onclick:
            m = re.search(r"location\s*=\s*['\"](.+?)['\"]", onclick)
            if m:
                return m.group(1)
    return None


def build_format_c(filepath, soup):
    """Build a new Format C HTML document from extracted 5-Step content."""
    depth = compute_depth(filepath)
    lesson_id = derive_lesson_id(filepath)
    bc_info = get_breadcrumb_info(filepath)

    # Extract all content
    title_el = soup.select_one("title")
    title_text = title_el.get_text(strip=True) if title_el else filepath.stem
    # Clean title
    page_title = title_text.split("|")[0].strip()

    header_title = soup.select_one(".lesson-title, h1")
    lesson_title = header_title.get_text(strip=True) if header_title else page_title

    subtitle_el = soup.select_one(".lesson-subtitle, .subtitle")
    subtitle = subtitle_el.get_text(strip=True) if subtitle_el else ""

    badge_el = soup.select_one(".lesson-badge, .badge")
    badge = badge_el.get_text(strip=True) if badge_el else "Invatare Atomica"

    goal_text = extract_goal_text(soup)
    pain = extract_pain_comparison(soup)
    try_content = extract_try_content(soup)
    concept_cards = extract_concept_cards(soup)
    quiz_questions = extract_quiz_questions(soup)
    practice_exercises = extract_practice_exercises(soup)
    summary_bullets = extract_summary(soup)
    next_href = extract_next_lesson_href(soup)

    # If no summary, generate from concept cards
    if not summary_bullets and concept_cards:
        summary_bullets = [card["title"] for card in concept_cards]

    # Generate learning outcomes from concept cards
    outcomes = []
    for card in concept_cards[:5]:
        outcomes.append(f"Sa intelegi si sa aplici: {card['title']}")

    # Distribute quiz questions across atoms
    # Strategy: round-robin if more Qs than atoms, 1:1 if equal
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
    lines.append(f'<title>{page_title} | TIC {bc_info["gradeName"]}</title>')
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
    lines.append(f'        <span class="lesson-badge">{badge}</span>')
    lines.append(f'        <h1 class="lesson-title">{lesson_title}</h1>')
    if subtitle:
        lines.append(f'        <p class="lesson-subtitle">{subtitle}</p>')
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
    if goal_text:
        lines.append(f'            <p class="goal-text">{goal_text}</p>')
    lines.append('        </div>')

    if pain and (pain["before"] or pain["after"]):
        lines.append('        <div class="pain-comparison" data-show-pain="true">')
        lines.append('            <div class="pain-card bad">')
        lines.append('                <h3>FARA aceasta lectie</h3>')
        lines.append('                <ul>')
        for item in pain["before"]:
            lines.append(f'                    <li>{item}</li>')
        lines.append('                </ul>')
        lines.append('            </div>')
        lines.append('            <div class="pain-card good">')
        lines.append('                <h3>CU aceasta lectie</h3>')
        lines.append('                <ul>')
        for item in pain["after"]:
            lines.append(f'                    <li>{item}</li>')
        lines.append('                </ul>')
        lines.append('            </div>')
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

    # TRY (optional)
    if try_content and len(try_content.strip()) > 50:
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

        # Build data-quiz if we have questions for this atom
        quiz_json = ""
        if i in atom_quizzes:
            quiz_data = []
            for q in atom_quizzes[i]:
                quiz_data.append({
                    "question": q["question"],
                    "options": q["options"],
                    "correct": q["correct"],
                    "hint": q["hint"],
                })
            quiz_json = json.dumps(quiz_data, ensure_ascii=False)
            # Escape single quotes for HTML attribute
            quiz_json = quiz_json.replace("'", "&#39;")

        if quiz_json:
            lines.append(f"        <div class=\"atom\" id=\"{atom_id}\" data-quiz='{quiz_json}'>")
        else:
            lines.append(f'        <div class="atom" id="{atom_id}">')

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
            clean_title = re.sub(r"^[^\w]*", "", ex["title"])
            clean_title = re.sub(r"^Exercitiul\s*\d+\s*[:.]?\s*", "", clean_title)
            lines.append(f'        <div class="practice-exercise" data-level="{level}">')
            lines.append(f'            <h3>Exercitiul {i + 1} ({level_names[level]}) - {clean_title}</h3>')
            lines.append(f'            {ex["content_html"]}')
            lines.append(f'        </div>')
    else:
        # Generate placeholder exercises
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
    lines.append('    document.addEventListener(\'DOMContentLoaded\', function() {')
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
    """Migrate a 5-Step file to Format C. Returns (changes, errors, warnings)."""
    changes = []
    errors = []
    warnings = []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            original = f.read()

        soup = BeautifulSoup(original, "html.parser")

        # Extract stats for reporting
        concept_cards = extract_concept_cards(soup)
        quiz_questions = extract_quiz_questions(soup)
        practice_exercises = extract_practice_exercises(soup)
        pain = extract_pain_comparison(soup)
        summary = extract_summary(soup)
        try_content = extract_try_content(soup)

        # Count inline CSS lines
        inline_css_lines = 0
        for style in soup.find_all("style"):
            if style.string:
                inline_css_lines += len(style.string.splitlines())

        changes.append(f"Extracted: {len(concept_cards)} concepts → atoms, {len(quiz_questions)} quiz Qs, {len(practice_exercises)} exercises")
        changes.append(f"Removed: {inline_css_lines} lines inline CSS")
        if pain:
            changes.append("Preserved: pain comparison (FARA/CU)")
        if try_content:
            changes.append("Preserved: TRY section")
        if summary:
            changes.append(f"Preserved: {len(summary)} summary bullets")

        # Warnings for content gaps
        if not concept_cards:
            warnings.append("WARNING: No concept cards found in LEARN section")
        if not quiz_questions:
            warnings.append("WARNING: No quiz questions extracted from TEST section")
        if len(quiz_questions) > len(concept_cards) * 2 and concept_cards:
            warnings.append(f"WARNING: Many quiz Qs ({len(quiz_questions)}) for {len(concept_cards)} atoms - some atoms will have 3+ questions")
        if not practice_exercises:
            warnings.append("WARNING: No practice exercises found - placeholders inserted")

        # Build new HTML
        new_html = build_format_c(filepath, soup)

        if not dry_run:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_html)

    except Exception as e:
        errors.append(f"ERROR: {e}")

    return changes, errors, warnings


def find_5step_files(grade=None):
    """Find all 5-Step format lesson files."""
    files = []
    search_dir = CONTENT_DIR / grade if grade else CONTENT_DIR
    if not search_dir.exists():
        print(f"ERROR: Directory not found: {search_dir}")
        return files
    for html_file in sorted(search_dir.rglob("*.html")):
        if is_5step_lesson(html_file):
            files.append(html_file)
    return files


def main():
    parser = argparse.ArgumentParser(description="Migrate 5-Step lessons to Format C")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--single", type=str, help="Migrate a single file")
    group.add_argument("--grade", type=str, help="Migrate all 5-Step files in a grade")
    group.add_argument("--all", action="store_true", help="Migrate all 5-Step files")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing")
    parser.add_argument("--verbose", action="store_true", help="Show detailed changes per file")

    args = parser.parse_args()

    if args.single:
        filepath = Path(args.single)
        if not filepath.is_absolute():
            filepath = PROJECT_ROOT / filepath
        if not filepath.exists():
            print(f"ERROR: File not found: {filepath}")
            sys.exit(1)
        files = [filepath]
    elif args.grade:
        files = find_5step_files(args.grade)
    else:
        files = find_5step_files()

    if not files:
        print("No 5-Step format files found to migrate.")
        sys.exit(0)

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Migrating {len(files)} 5-Step files to Format C...")
    print("=" * 60)

    results = {"migrated": 0, "errors": 0, "warnings": 0}
    log_entries = []

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
            if warnings:
                results["warnings"] += len(warnings)
            print(f"  {'WOULD ' if args.dry_run else ''}MIGRATE: {rel_path}")
            if args.verbose:
                for c in changes:
                    print(f"           {c}")
                for w in warnings:
                    print(f"           {w}")

        log_entries.append({
            "file": str(rel_path),
            "changes": changes,
            "errors": errors,
            "warnings": warnings,
        })

    print("=" * 60)
    print(f"Results: {results['migrated']} migrated, {results['errors']} errors, {results['warnings']} warnings")

    if not args.dry_run and results["migrated"] > 0:
        log_path = PROJECT_ROOT / "tools" / "migration_log_5step.json"
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(log_entries, f, indent=2, ensure_ascii=False)
        print(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
