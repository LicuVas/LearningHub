#!/usr/bin/env python3
"""
Migrate Atomic format lessons to Format C (Guided Atomic).

Transformations:
  1. Nav: .nav-link → .nav-btn with simplified structure
  2. FRAME: Wrap goal-section in .lesson-frame, add .learning-outcomes
  3. PRACTICE: .practice-advanced → .practice-section with data-level
  4. REVIEW: Add .review-section with .summary-box and .next-lesson
  5. Cleanup: Remove restart-section, footer, inline <style>, mobile-first.css
  6. Scripts: Fix order (atomic-learning first, user-system last)

Usage:
  python tools/migrate_atomic_to_c.py --single content/tic/cls7/.../file.html
  python tools/migrate_atomic_to_c.py --grade cls7
  python tools/migrate_atomic_to_c.py --all
  Add --dry-run to preview without writing.
"""

import argparse
import io
import json
import os
import re
import sys
from pathlib import Path

# Fix Windows console encoding for Unicode arrows etc.
if sys.stdout.encoding != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

try:
    from bs4 import BeautifulSoup, Comment
except ImportError:
    print("ERROR: beautifulsoup4 required. Run: pip install beautifulsoup4")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
ASSETS_DIR = PROJECT_ROOT / "assets"

# The 6 Format C scripts in correct order
FORMAT_C_SCRIPTS = [
    "atomic-learning.js",
    "practice-simple.js",
    "lesson-summary.js",
    "breadcrumb.js",
    "progress.js",
    "user-system.js",
]

# Files to skip (not lessons)
SKIP_PATTERNS = ["index.html", "quiz", "prezentare", "test-", "backup"]


def is_atomic_lesson(filepath):
    """Check if file is an Atomic format lesson (not 5-Step, not quiz)."""
    name = filepath.name.lower()
    for pat in SKIP_PATTERNS:
        if pat in name:
            return False

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    has_atom = 'class="atom"' in content or "class='atom'" in content
    has_data_quiz = "data-quiz" in content
    has_goto = "goToStep" in content

    return has_atom and has_data_quiz and not has_goto


def compute_depth(filepath):
    """Compute relative path from lesson file to assets directory."""
    file_dir = filepath.parent
    return os.path.relpath(ASSETS_DIR, file_dir).replace("\\", "/")


def derive_lesson_id(filepath):
    """Derive lesson ID from filepath: {grade}-{module}-{filename}."""
    parts = filepath.relative_to(CONTENT_DIR).parts
    # parts = ('cls7', 'm1-word-fundamente', 'lectia1-interfata-word.html')
    grade = parts[0]
    module = parts[1]
    filename = filepath.stem
    return f"{grade}-{module}-{filename}"


def extract_atom_titles(soup):
    """Extract atom titles for generating learning outcomes and summary."""
    titles = []
    for atom in soup.select("#atomic-content .atom"):
        title_el = atom.select_one(".atom-title")
        if title_el:
            # Remove leading number prefix like "1. "
            text = re.sub(r"^\d+\.\s*", "", title_el.get_text(strip=True))
            titles.append(text)
    return titles


def extract_next_lesson_info(soup):
    """Extract next lesson URL and derive teaser text."""
    # Look for forward nav link
    nav_links = soup.select(".nav-bar a")
    for link in nav_links:
        href = link.get("href", "")
        text = link.get_text(strip=True)
        if "urmatoare" in text.lower() or "→" in text or "&#8594;" in text:
            return href, text
        # Also check if it's the second nav link (right side)
        if link != nav_links[0] and href and href != "index.html":
            return href, text

    # Check nav-btn style links
    nav_btns = soup.select(".nav-btn")
    for btn in nav_btns:
        href = btn.get("href", "")
        if href and href != "index.html" and "index" not in href:
            return href, btn.get_text(strip=True)

    return None, None


def generate_learning_outcomes(atom_titles):
    """Generate learning outcome bullets from atom titles."""
    outcomes = []
    for title in atom_titles[:5]:  # Max 5 outcomes
        # Convert title to outcome format
        outcome = f"Sa intelegi si sa aplici: {title}"
        outcomes.append(outcome)
    return outcomes


def generate_summary_bullets(atom_titles):
    """Generate summary bullets from atom titles."""
    bullets = []
    for title in atom_titles:
        bullets.append(title)
    return bullets


def get_breadcrumb_info(filepath):
    """Derive breadcrumb init info from filepath."""
    parts = filepath.relative_to(CONTENT_DIR).parts
    grade = parts[0]  # cls7
    module = parts[1]  # m1-word-fundamente

    grade_names = {
        "cls5": "Clasa a V-a",
        "cls6": "Clasa a VI-a",
        "cls7": "Clasa a VII-a",
        "cls8": "Clasa a VIII-a",
    }

    # Generate module display name from folder
    module_display = module.replace("-", " ").title()
    # Capitalize M prefix properly
    module_display = re.sub(r"^M(\d+)", r"M\1", module_display)

    return {
        "grade": grade,
        "gradeName": grade_names.get(grade, grade),
        "module": module,
        "moduleName": module_display,
    }


def is_already_format_c(soup):
    """Check if lesson is already Format C compliant."""
    has_frame = bool(soup.select(".lesson-frame"))
    has_review = bool(soup.select(".review-section"))
    has_practice_levels = bool(soup.select("[data-level]"))
    return has_frame and has_review and has_practice_levels


def migrate_nav(soup):
    """Convert nav-link to nav-btn format."""
    changes = []
    nav = soup.select_one(".nav-bar")
    if not nav:
        return changes

    links = nav.find_all("a")
    for link in links:
        old_class = link.get("class", [])
        href = link.get("href", "")
        text = link.get_text(strip=True)

        if "nav-link" in old_class:
            link["class"] = ["nav-btn"]
            # Simplify content
            if "inapoi" in text.lower() or "←" in text or "&#8592;" in text:
                link.string = ""
                link.append("\u2190 Modulul")
                link["title"] = "Inapoi la modul"
            elif "urmatoare" in text.lower() or "→" in text or "&#8594;" in text:
                link.string = ""
                link.append("Urmatoarea \u2192")
                link["title"] = "Lectia urmatoare"
            changes.append(f"Nav: .nav-link → .nav-btn for '{href}'")

    return changes


def migrate_frame(soup):
    """Wrap goal-section in .lesson-frame and add learning outcomes."""
    changes = []
    goal = soup.select_one(".goal-section")
    if not goal:
        return changes

    # Check if already wrapped
    if goal.parent and "lesson-frame" in goal.parent.get("class", []):
        return changes

    atom_titles = extract_atom_titles(soup)
    outcomes = generate_learning_outcomes(atom_titles)

    # Create frame section
    frame = soup.new_tag("section")
    frame["class"] = ["lesson-frame"]

    # Move goal into frame
    goal.insert_before(frame)
    frame.append(goal.extract())

    # Add learning outcomes
    if outcomes:
        outcomes_div = soup.new_tag("div")
        outcomes_div["class"] = ["learning-outcomes"]

        h3 = soup.new_tag("h3")
        h3.string = "Dupa aceasta lectie vei putea:"
        outcomes_div.append(h3)

        ul = soup.new_tag("ul")
        for outcome in outcomes:
            li = soup.new_tag("li")
            li.string = outcome
            ul.append(li)
        outcomes_div.append(ul)

        frame.append(outcomes_div)
        changes.append(f"FRAME: Wrapped goal-section, added {len(outcomes)} learning outcomes")

    return changes


def migrate_practice(soup):
    """Convert practice-advanced to practice-section with data-level."""
    changes = []
    practice = soup.select_one(".practice-advanced")
    if not practice:
        # Check if already migrated
        practice = soup.select_one(".practice-section")
        if practice and practice.select("[data-level]"):
            return changes  # Already done
        if not practice:
            return changes

    # Change class
    if "practice-advanced" in practice.get("class", []):
        practice["class"] = ["practice-section"]
        practice["id"] = "practice"
        changes.append("PRACTICE: .practice-advanced → .practice-section")

    # Remove practice-advanced-header
    header = practice.select_one(".practice-advanced-header")
    if header:
        header.decompose()
        changes.append("PRACTICE: Removed practice-advanced-header")

    # Add h2 if missing
    if not practice.select_one("h2"):
        h2 = soup.new_tag("h2")
        h2.string = "Exercitii practice"
        practice.insert(0, h2)

    # Add data-level to exercises
    exercises = practice.select(".practice-exercise")
    levels = ["minim", "standard", "performanta"]
    for i, ex in enumerate(exercises):
        if not ex.get("data-level"):
            level = levels[min(i, len(levels) - 1)]
            ex["data-level"] = level

            # Update heading to include level
            h_tag = ex.select_one("h3, h4")
            if h_tag:
                old_text = h_tag.get_text(strip=True)
                # Remove emoji prefixes
                clean_text = re.sub(r"^[^\w]*", "", old_text)
                # Remove existing exercise number prefix
                clean_text = re.sub(
                    r"^Exercitiul\s*\d+\s*[:.]?\s*", "", clean_text
                )
                level_names = {
                    "minim": "Nivel minim",
                    "standard": "Nivel standard",
                    "performanta": "Nivel performanta",
                }
                h_tag.string = (
                    f"Exercitiul {i + 1} ({level_names[level]}) - {clean_text}"
                )
                h_tag.name = "h3"  # Normalize to h3

            changes.append(f"PRACTICE: Exercise {i + 1} → data-level='{level}'")

    # Remove data-type attributes
    for ex in exercises:
        if ex.get("data-type"):
            del ex["data-type"]

    return changes


def migrate_review(soup, filepath):
    """Add REVIEW section with summary and next lesson."""
    changes = []

    # Check if already has review
    if soup.select_one(".review-section"):
        return changes

    atom_titles = extract_atom_titles(soup)
    summary_bullets = generate_summary_bullets(atom_titles)
    next_href, _ = extract_next_lesson_info(soup)

    # Build review section
    review = soup.new_tag("section")
    review["class"] = ["review-section"]

    # Summary box
    summary_box = soup.new_tag("div")
    summary_box["class"] = ["summary-box"]

    h2 = soup.new_tag("h2")
    h2.string = "Ce ai invatat astazi"
    summary_box.append(h2)

    ul = soup.new_tag("ul")
    for bullet in summary_bullets:
        li = soup.new_tag("li")
        li.string = bullet
        ul.append(li)
    summary_box.append(ul)
    review.append(summary_box)

    # Move lesson-summary div into review
    lesson_summary = soup.select_one("#lesson-summary")
    if lesson_summary:
        review.append(lesson_summary.extract())

    # Next lesson teaser
    if next_href:
        next_div = soup.new_tag("div")
        next_div["class"] = ["next-lesson"]

        h3 = soup.new_tag("h3")
        h3.string = "Urmatoarea lectie"
        next_div.append(h3)

        p = soup.new_tag("p")
        p.string = "Continua cu lectia urmatoare pentru a aprofunda cunostintele."
        next_div.append(p)

        a = soup.new_tag("a", href=next_href)
        a["class"] = ["btn-next"]
        a.string = "Continua \u2192"
        next_div.append(a)

        review.append(next_div)

    # Insert review into .container
    container = soup.select_one(".container")
    if container:
        container.append(review)
        changes.append(
            f"REVIEW: Added summary ({len(summary_bullets)} bullets) + next lesson"
        )

    return changes


def cleanup_restart(soup):
    """Remove restart-section (replaced by REVIEW)."""
    changes = []
    restart = soup.select_one(".restart-section")
    if restart:
        restart.decompose()
        changes.append("CLEANUP: Removed restart-section")
    return changes


def cleanup_footer(soup):
    """Remove footer (replaced by REVIEW)."""
    changes = []
    footer = soup.select_one("footer")
    if footer:
        footer.decompose()
        changes.append("CLEANUP: Removed footer")
    return changes


def cleanup_inline_css(soup):
    """Remove all inline <style> blocks."""
    changes = []
    styles = soup.find_all("style")
    for style in styles:
        line_count = len(style.string.splitlines()) if style.string else 0
        style.decompose()
        changes.append(f"CLEANUP: Removed inline <style> block ({line_count} lines)")
    return changes


def cleanup_mobile_css(soup):
    """Remove mobile-first.css link (styles now in lesson-atomic.css)."""
    changes = []
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href", "")
        if "mobile-first" in href or "mobile.css" in href:
            link.decompose()
            changes.append(f"CLEANUP: Removed {href}")
    return changes


def fix_scripts(soup, filepath):
    """Fix script order and includes to match Format C spec."""
    changes = []
    depth = compute_depth(filepath)
    lesson_id = derive_lesson_id(filepath)
    bc_info = get_breadcrumb_info(filepath)

    # Remove all existing script tags
    old_scripts = []
    for script in soup.find_all("script"):
        src = script.get("src", "")
        if src:
            old_scripts.append(src.split("/")[-1])
        script.decompose()

    # Add scripts in correct order before </body>
    body = soup.find("body")
    if not body:
        return changes

    # Add comment
    comment = Comment(" ═══════════════ SCRIPTS ═══════════════ ")
    body.append(comment)

    for script_name in FORMAT_C_SCRIPTS:
        script = soup.new_tag("script", src=f"{depth}/js/{script_name}")
        body.append(script)

    # Add init script
    init_script = soup.new_tag("script")
    lesson_title = ""
    title_el = soup.select_one(".lesson-title")
    if title_el:
        lesson_title = title_el.get_text(strip=True)

    init_script.string = f"""
    document.addEventListener('DOMContentLoaded', function() {{
        AtomicLearning.init('{lesson_id}');
        PracticeSimple.init('{lesson_id}');
        LessonSummary.init('{lesson_id}');
        Breadcrumb.init({{
            grade: '{bc_info["grade"]}',
            gradeName: '{bc_info["gradeName"]}',
            module: '{bc_info["module"]}',
            moduleName: '{bc_info["moduleName"]}',
            lesson: '{lesson_title}'
        }});
        LearningProgress.init('{bc_info["grade"]}', '{bc_info["module"]}', '{filepath.stem}.html');
    }});
"""
    body.append(init_script)

    changes.append(f"SCRIPTS: Fixed order, lesson_id='{lesson_id}'")
    return changes


def fix_css_link(soup, filepath):
    """Ensure lesson-atomic.css is linked with correct depth."""
    changes = []
    depth = compute_depth(filepath)
    correct_href = f"{depth}/css/lesson-atomic.css"

    # Find existing atomic CSS link
    found = False
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href", "")
        if "lesson-atomic" in href:
            if href != correct_href:
                link["href"] = correct_href
                changes.append(f"CSS: Fixed depth {href} → {correct_href}")
            found = True
            break

    if not found:
        # Add it after the Google Fonts link
        head = soup.find("head")
        if head:
            css_link = soup.new_tag("link", rel="stylesheet", href=correct_href)
            head.append(css_link)
            changes.append(f"CSS: Added lesson-atomic.css link")

    # Add zero-inline-CSS comment if missing
    head = soup.find("head")
    if head:
        has_comment = any(
            isinstance(c, Comment) and "inline" in c.lower()
            for c in head.children
            if isinstance(c, Comment)
        )
        if not has_comment:
            comment = Comment(" NO inline <style> blocks. ZERO. ")
            head.append(comment)

    return changes


def migrate_file(filepath, dry_run=False):
    """Run all migrations on a single file. Returns (changes, errors)."""
    changes = []
    errors = []

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            original = f.read()

        soup = BeautifulSoup(original, "html.parser")

        # Skip if already Format C
        if is_already_format_c(soup):
            return ["SKIP: Already Format C compliant"], []

        # Run migrations in order
        changes.extend(migrate_nav(soup))
        changes.extend(migrate_frame(soup))
        changes.extend(migrate_practice(soup))
        changes.extend(cleanup_restart(soup))
        changes.extend(cleanup_footer(soup))
        changes.extend(cleanup_inline_css(soup))
        changes.extend(cleanup_mobile_css(soup))
        changes.extend(migrate_review(soup, filepath))
        changes.extend(fix_css_link(soup, filepath))
        changes.extend(fix_scripts(soup, filepath))

        if not changes:
            return ["SKIP: No changes needed"], []

        # Write result
        if not dry_run:
            result = soup.prettify()
            # Fix prettify quirks: remove excessive blank lines
            result = re.sub(r"\n{3,}", "\n\n", result)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(result)

    except Exception as e:
        errors.append(f"ERROR: {e}")

    return changes, errors


def find_atomic_files(grade=None):
    """Find all Atomic format lesson files, optionally filtered by grade."""
    files = []
    search_dir = CONTENT_DIR / grade if grade else CONTENT_DIR

    if not search_dir.exists():
        print(f"ERROR: Directory not found: {search_dir}")
        return files

    for html_file in sorted(search_dir.rglob("*.html")):
        if is_atomic_lesson(html_file):
            files.append(html_file)

    return files


def main():
    parser = argparse.ArgumentParser(description="Migrate Atomic lessons to Format C")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--single", type=str, help="Migrate a single file")
    group.add_argument("--grade", type=str, help="Migrate all Atomic files in a grade (cls5/cls6/cls7/cls8)")
    group.add_argument("--all", action="store_true", help="Migrate all Atomic files")
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
        files = find_atomic_files(args.grade)
    else:
        files = find_atomic_files()

    if not files:
        print("No Atomic format files found to migrate.")
        sys.exit(0)

    print(f"{'[DRY RUN] ' if args.dry_run else ''}Migrating {len(files)} Atomic files to Format C...")
    print("=" * 60)

    results = {"migrated": 0, "skipped": 0, "errors": 0}
    log_entries = []

    for filepath in files:
        rel_path = filepath.relative_to(PROJECT_ROOT)
        changes, errors = migrate_file(filepath, dry_run=args.dry_run)

        if errors:
            results["errors"] += 1
            print(f"  ERROR: {rel_path}")
            for e in errors:
                print(f"         {e}")
        elif changes and changes[0].startswith("SKIP"):
            results["skipped"] += 1
            if args.verbose:
                print(f"  SKIP:  {rel_path} ({changes[0]})")
        else:
            results["migrated"] += 1
            print(f"  {'WOULD ' if args.dry_run else ''}MIGRATE: {rel_path} ({len(changes)} changes)")
            if args.verbose:
                for c in changes:
                    print(f"           {c}")

        log_entries.append({
            "file": str(rel_path),
            "changes": changes,
            "errors": errors,
        })

    print("=" * 60)
    print(f"Results: {results['migrated']} migrated, {results['skipped']} skipped, {results['errors']} errors")

    if not args.dry_run and results["migrated"] > 0:
        # Save migration log
        log_path = PROJECT_ROOT / "tools" / "migration_log_atomic.json"
        with open(log_path, "w", encoding="utf-8") as f:
            json.dump(log_entries, f, indent=2, ensure_ascii=False)
        print(f"Log saved to: {log_path}")


if __name__ == "__main__":
    main()
