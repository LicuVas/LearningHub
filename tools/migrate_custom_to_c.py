#!/usr/bin/env python3
"""
Migrate custom/PoW format lessons to Format C structure.
Wraps existing content in Format C shell without full rebuild.
For 16 remaining non-standard lesson files.
"""

import os
import sys
import io
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup, Comment

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content"
LOG_FILE = PROJECT_ROOT / "tools" / "migration_log_custom.json"


def compute_depth(filepath):
    """Compute relative path to assets/ from this file."""
    rel = os.path.relpath(PROJECT_ROOT / "assets", os.path.dirname(filepath))
    return rel.replace("\\", "/")


def compute_lesson_id(filepath):
    """Generate lesson ID from file path."""
    rel = os.path.relpath(filepath, CONTENT_DIR / "tic")
    parts = Path(rel).with_suffix("").parts
    return "-".join(parts)


def extract_title(soup):
    """Extract lesson title from various sources."""
    h1 = soup.find('h1')
    if h1:
        return h1.get_text(strip=True)
    title_tag = soup.find('title')
    if title_tag:
        text = title_tag.get_text(strip=True)
        if '|' in text:
            return text.split('|')[0].strip()
        return text
    return "Lectie"


def extract_checkAnswer_quiz(soup):
    """Extract quiz data from checkAnswer(qNum, element, isCorrect) pattern."""
    questions = []
    quiz_divs = soup.select('.quiz-question')
    for div in quiz_divs:
        q_text_el = div.find('p')
        if not q_text_el:
            continue
        q_text = q_text_el.get_text(strip=True)
        # Remove numbering like "1. "
        q_text = re.sub(r'^\d+\.\s*', '', q_text)

        options = []
        correct_idx = 0
        for i, opt in enumerate(div.select('.quiz-option')):
            onclick = opt.get('onclick', '')
            text = opt.get_text(strip=True)
            options.append(text)
            if 'true' in onclick:
                correct_idx = i

        if options:
            correct_letter = chr(97 + correct_idx)  # 0->a, 1->b, etc.
            questions.append({
                'text': q_text,
                'options': options,
                'correct': correct_letter
            })
    return questions


def extract_goal_text(soup):
    """Extract goal/objective text."""
    goal_section = soup.select_one('.section.goal, .goal-section, [class*=goal]')
    if goal_section:
        goal_text = goal_section.find('p', class_='goal-text')
        if goal_text:
            return goal_text.get_text(strip=True).strip('"')
        p = goal_section.find('p')
        if p:
            return p.get_text(strip=True).strip('"')
    return None


def extract_learning_outcomes(soup):
    """Extract learning outcomes from goal section."""
    goal_section = soup.select_one('.section.goal, .goal-section')
    outcomes = []
    if goal_section:
        ul = goal_section.find('ul')
        if ul:
            for li in ul.find_all('li'):
                outcomes.append(li.get_text(strip=True))
    return outcomes


def extract_try_content(soup):
    """Extract TRY section HTML."""
    try_section = soup.select_one('.section.try, .try-section')
    if try_section:
        # Get inner content, skip the header
        header = try_section.select_one('.section-header')
        if header:
            header.decompose()
        return str(try_section)
    return None


def extract_learn_content(soup):
    """Extract LEARN section content for atoms."""
    learn_section = soup.select_one('.section.learn, .learn-section')
    if not learn_section:
        return []

    # Try to split by headings or definition/example blocks
    content_blocks = []
    current_block = {'title': '', 'content': ''}

    for child in learn_section.children:
        if not hasattr(child, 'name') or child.name is None:
            continue  # Skip NavigableString/text nodes
        if child.name in ('h3', 'h4'):
            if current_block['content'].strip():
                content_blocks.append(current_block)
            current_block = {
                'title': child.get_text(strip=True).lstrip('📌🔑💡📚📱🎮🏪 '),
                'content': ''
            }
        elif child.get('class') and 'section-header' in child.get('class', []):
            continue
        else:
            current_block['content'] += str(child)

    if current_block['content'].strip():
        content_blocks.append(current_block)

    return content_blocks


def extract_practice(soup):
    """Extract practice exercises."""
    exercises = []
    # Look for practice/complete sections
    practice = soup.select_one('.section.complete, .practice-section, .section.practice')
    if practice:
        tasks = practice.select('.practice-task, .task, li')
        for i, task in enumerate(tasks[:3]):
            exercises.append(task.get_text(strip=True))
    return exercises


def extract_summary(soup):
    """Extract summary bullets."""
    summary = soup.select_one('.section.summary, .summary-section')
    bullets = []
    if summary:
        for li in summary.select('li'):
            bullets.append(li.get_text(strip=True))
    return bullets


def build_format_c(filepath, soup):
    """Build Format C HTML from extracted content."""
    depth = compute_depth(filepath)
    lesson_id = compute_lesson_id(filepath)
    title = extract_title(soup)
    goal_text = extract_goal_text(soup) or f"Sa inveti despre {title}"
    outcomes = extract_learning_outcomes(soup)
    try_html = extract_try_content(BeautifulSoup(str(soup), 'html.parser'))
    learn_blocks = extract_learn_content(BeautifulSoup(str(soup), 'html.parser'))
    quiz_questions = extract_checkAnswer_quiz(soup)
    exercises = extract_practice(soup)
    summary_bullets = extract_summary(soup)

    # Build learning outcomes HTML
    if not outcomes:
        outcomes = [f"Sa intelegi conceptele din {title}"]

    outcomes_html = "\n".join(f'            <li>{o}</li>' for o in outcomes)

    # Build atoms
    atoms_html = ""
    if learn_blocks:
        for i, block in enumerate(learn_blocks):
            atom_title = block['title'] or f"Concept {i+1}"
            atom_content = block['content']

            # Add quiz if available (round-robin)
            quiz_html = ""
            if quiz_questions:
                q_idx = i % len(quiz_questions)
                q = quiz_questions[q_idx]
                if i < len(quiz_questions):  # Only use each question once
                    options_html = "\n".join(
                        f'                <div class="atom-option">{opt}</div>'
                        for opt in q['options']
                    )
                    quiz_html = f"""
            <div class="atom-quiz" data-qid="atom-{i+1}-q0">
                <div class="atom-question-text">{q['text']}</div>
                <div class="atom-options">
{options_html}
                </div>
                <div class="atom-feedback"></div>
                <div class="atom-quiz-data" style="display:none;">
                    {json.dumps({"correct": q['correct']}, ensure_ascii=False)}
                </div>
            </div>"""

            atoms_html += f"""
        <div class="atom-card" data-atom="{i+1}">
            <div class="atom-header">
                <span class="atom-number">Atom {i+1}</span>
                <h3 class="atom-title">{atom_title}</h3>
            </div>
            <div class="atom-content">
                {atom_content}
            </div>{quiz_html}
        </div>
"""
    else:
        # No learn blocks found - create a single atom with the main content
        main_content = soup.select_one('main, .container, .content')
        if main_content:
            # Strip out known sections
            for sel in ['.section.goal', '.section.try', '.section.test',
                        '.section.complete', '.section.summary', 'header',
                        'footer', 'nav', 'script']:
                for el in main_content.select(sel):
                    el.decompose()
            content_str = ''.join(str(c) for c in main_content.children)
        else:
            content_str = "<p>Continut lectie</p>"

        atoms_html = f"""
        <div class="atom-card" data-atom="1">
            <div class="atom-header">
                <span class="atom-number">Atom 1</span>
                <h3 class="atom-title">{title}</h3>
            </div>
            <div class="atom-content">
                {content_str}
            </div>
        </div>
"""

    # Build TRY section
    try_section = ""
    if try_html:
        try_section = f"""
    <section class="try-section">
        <h2>Incearca!</h2>
        {try_html}
    </section>
"""

    # Build practice
    if not exercises:
        exercises = [
            f"Exercitiu minim: Descrie pe scurt ce ai invatat in aceasta lectie.",
            f"Exercitiu standard: Aplica conceptele din lectie intr-un exemplu practic.",
            f"Exercitiu performanta: Creeaza un proiect care demonstreaza cunostintele dobandite."
        ]

    levels = ['minim', 'standard', 'performanta']
    practice_html = ""
    for i, ex in enumerate(exercises[:3]):
        level = levels[i] if i < 3 else 'standard'
        practice_html += f"""
        <div class="practice-exercise" data-level="{level}">
            <h4>Nivel {level.capitalize()}</h4>
            <p>{ex}</p>
        </div>"""

    # Build summary
    if not summary_bullets:
        summary_bullets = [f"Am invatat despre {title}"]

    summary_html = "\n".join(f'            <li>{b}</li>' for b in summary_bullets)

    # Build nav buttons
    parent_dir = os.path.dirname(filepath)
    siblings = sorted([f for f in os.listdir(parent_dir)
                       if f.startswith('lectia') and f.endswith('.html')])
    current = os.path.basename(filepath)
    idx = siblings.index(current) if current in siblings else -1

    prev_link = siblings[idx - 1] if idx > 0 else "index.html"
    next_link = siblings[idx + 1] if idx < len(siblings) - 1 else "index.html"

    nav_html = f"""    <nav class="lesson-nav">
        <a href="{prev_link}" class="nav-btn">Inapoi</a>
        <a href="{next_link}" class="nav-btn">Inainte</a>
    </nav>"""

    # Determine grade from path
    rel = os.path.relpath(filepath, CONTENT_DIR / "tic")
    grade_part = rel.split(os.sep)[0]

    grade_names = {
        'cls5': 'Clasa a V-a',
        'cls6': 'Clasa a VI-a',
        'cls7': 'Clasa a VII-a',
        'cls8': 'Clasa a VIII-a',
    }
    grade_name = grade_names.get(grade_part, 'Clasa')

    html = f"""<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | {grade_name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{depth}/css/lesson-atomic.css">
    <!-- NO inline <style> blocks. ZERO. -->
</head>
<body>
    <a href="#main-content" class="skip-link">Sari la continut</a>

{nav_html}

    <div id="main-content" class="lesson-container">

    <section class="lesson-frame">
        <h1>{title}</h1>
        <p class="lesson-goal">{goal_text}</p>
        <ul class="learning-outcomes">
{outcomes_html}
        </ul>
    </section>
{try_section}
{atoms_html}
    <section class="practice-section">
        <h2>Practica</h2>{practice_html}
    </section>

    <section class="review-section">
        <h2>Recapitulare</h2>
        <div class="summary-box">
            <h3>Ce am invatat:</h3>
            <ul>
{summary_html}
            </ul>
        </div>
        <div class="next-lesson">
            <a href="{next_link}" class="btn-next">Lectia urmatoare</a>
        </div>
    </section>

    </div>

    <script src="{depth}/js/atomic-learning.js"></script>
    <script src="{depth}/js/practice-simple.js"></script>
    <script src="{depth}/js/lesson-summary.js"></script>
    <script src="{depth}/js/breadcrumb.js"></script>
    <script src="{depth}/js/progress.js"></script>
    <script src="{depth}/js/user-system.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof AtomicLearning !== 'undefined') AtomicLearning.init('{lesson_id}');
            if (typeof PracticeSimple !== 'undefined') PracticeSimple.init('{lesson_id}');
            if (typeof LessonSummary !== 'undefined') LessonSummary.init('{lesson_id}');
        }});
    </script>
</body>
</html>"""

    return html


def migrate_file(filepath, verbose=False, dry_run=False):
    """Migrate a single custom file to Format C."""
    changes = []

    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # Check if already Format C
    if soup.select('.lesson-frame') and soup.select('.review-section'):
        return [], None

    new_html = build_format_c(filepath, soup)
    changes.append("Rebuilt as Format C")

    # Count what was extracted
    quiz_qs = extract_checkAnswer_quiz(soup)
    learn_blocks = extract_learn_content(BeautifulSoup(content, 'html.parser'))
    if quiz_qs:
        changes.append(f"Extracted {len(quiz_qs)} quiz questions")
    if learn_blocks:
        changes.append(f"Extracted {len(learn_blocks)} content blocks -> atoms")

    if verbose:
        rel = os.path.relpath(filepath, PROJECT_ROOT)
        print(f"  {'DRY-RUN' if dry_run else 'MIGRATE'}: {rel}")
        for c in changes:
            print(f"           {c}")

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)

    return changes, None


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Migrate custom/PoW lessons to Format C")
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--verbose', action='store_true')
    parser.add_argument('--single', help='Single file')
    args = parser.parse_args()

    if args.single:
        files = [args.single]
    else:
        # Find all non-Format-C lesson files
        files = []
        for root, dirs, filenames in os.walk(CONTENT_DIR / "tic"):
            if 'quizuri' in root:
                continue
            for f in sorted(filenames):
                if not f.endswith('.html') or f == 'index.html' or f.startswith('prezentare'):
                    continue
                path = os.path.join(root, f)
                with open(path, encoding='utf-8') as fh:
                    content = fh.read()
                no_comments = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
                if 'lesson-frame' not in no_comments:
                    files.append(path)

    print(f"Processing {len(files)} custom files...")
    print("=" * 60)

    results = {"migrated": 0, "skipped": 0, "errors": 0}
    log_entries = []

    for filepath in files:
        try:
            changes, error = migrate_file(filepath, args.verbose, args.dry_run)
            if error:
                results["errors"] += 1
            elif changes:
                results["migrated"] += 1
                log_entries.append({
                    "file": os.path.relpath(filepath, PROJECT_ROOT),
                    "changes": changes
                })
            else:
                results["skipped"] += 1
        except Exception as e:
            results["errors"] += 1
            rel = os.path.relpath(filepath, PROJECT_ROOT)
            print(f"  ERROR: {rel}: {e}")
            log_entries.append({"file": rel, "error": str(e)})

    print("=" * 60)
    print(f"Results: {results['migrated']} migrated, {results['skipped']} skipped, {results['errors']} errors")

    if not args.dry_run and log_entries:
        with open(LOG_FILE, 'w', encoding='utf-8') as f:
            json.dump(log_entries, f, indent=2, ensure_ascii=False)
        print(f"Log saved to: {LOG_FILE}")


if __name__ == "__main__":
    main()
