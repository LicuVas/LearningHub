#!/usr/bin/env python3
"""
Apply real practice exercises to LearningHub lessons that have placeholders.

Reads exercise content from practice_exercises.json and replaces
<!-- MANUAL_REVIEW: Add exercise content --> placeholders in HTML files.

Usage:
    python fix_practice_exercises.py scan        # Find files with placeholder exercises
    python fix_practice_exercises.py apply --dry # Preview changes
    python fix_practice_exercises.py apply       # Apply changes to files
"""

import os
import sys
import json
import re
import io
from pathlib import Path

# Fix console encoding for Romanian characters
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
EXERCISES_FILE = PROJECT_ROOT / "tools" / "practice_exercises.json"

PLACEHOLDER = '<!-- MANUAL_REVIEW: Add exercise content -->'
LEVELS = ['minim', 'standard', 'performanta']


def find_placeholder_files():
    """Find all lesson files with placeholder practice exercises."""
    results = []
    for f in sorted(CONTENT_DIR.rglob('lectia*.html')):
        text = f.read_text(encoding='utf-8', errors='replace')
        if PLACEHOLDER in text:
            count = text.count(PLACEHOLDER)
            rel = f.relative_to(PROJECT_ROOT).as_posix()
            results.append((rel, count))
    return results


def generate_exercise_html(exercise_data):
    """Generate HTML for a single exercise from JSON data."""
    title = exercise_data['title']
    intro = exercise_data['intro']
    tasks = exercise_data['tasks']

    lines = []
    lines.append(f'<p><strong>Cerinta:</strong> {intro}</p>')
    lines.append('<ol>')
    for task in tasks:
        lines.append(f'<li>{task}</li>')
    lines.append('</ol>')

    return '\n'.join(lines)


def apply_exercises(dry_run=False):
    """Replace placeholder exercises with real content."""
    if not EXERCISES_FILE.exists():
        print(f"ERROR: {EXERCISES_FILE} not found. Create it first.")
        return

    with open(EXERCISES_FILE, 'r', encoding='utf-8') as f:
        exercises = json.load(f)

    modified = 0
    replacements = 0

    for rel_path, ex_data in exercises.items():
        filepath = PROJECT_ROOT / rel_path
        if not filepath.exists():
            print(f"SKIP (not found): {rel_path}")
            continue

        text = filepath.read_text(encoding='utf-8', errors='replace')
        if PLACEHOLDER not in text:
            print(f"SKIP (no placeholders): {rel_path}")
            continue

        new_text = text
        for level in LEVELS:
            if level not in ex_data:
                continue

            exercise = ex_data[level]
            exercise_html = generate_exercise_html(exercise)
            title = exercise['title']

            # Pattern: find the practice-exercise div for this level,
            # replace the h3 title and the placeholder paragraph
            # Old: <h3>Exercitiul N (Nivel X)</h3>\n            <p><!-- MANUAL_REVIEW: Add exercise content --></p>
            # New: <h3>Title from JSON</h3>\n            exercise_html

            # Replace the h3 for this level
            level_label = {'minim': 'minim', 'standard': 'standard', 'performanta': 'performanta'}[level]
            level_num = {'minim': '1', 'standard': '2', 'performanta': '3'}[level]

            # Find and replace the h3 + placeholder for this level
            old_h3_pattern = (
                f'<h3>Exercitiul {level_num} \\(Nivel {level_label}\\)</h3>'
                f'\\s*<p>{re.escape(PLACEHOLDER)}</p>'
            )
            new_content = f'<h3>{title}</h3>\n            {exercise_html}'

            new_text_replaced = re.sub(old_h3_pattern, new_content, new_text)
            if new_text_replaced != new_text:
                replacements += 1
                new_text = new_text_replaced
            else:
                print(f"  WARNING: Could not match {level} in {rel_path}")

        if new_text != text:
            modified += 1
            if dry_run:
                # Show a preview
                for level in LEVELS:
                    if level in ex_data:
                        print(f"  + [{level}] {ex_data[level]['title']}")
            else:
                filepath.write_text(new_text, encoding='utf-8')
                print(f"OK: {rel_path} ({sum(1 for l in LEVELS if l in ex_data)} exercises)")

    action = "Would modify" if dry_run else "Modified"
    print(f"\n{action} {modified} files")
    print(f"Exercises replaced: {replacements}")


def cmd_scan():
    """List files with placeholder exercises."""
    files = find_placeholder_files()
    print(f"Files with placeholder exercises: {len(files)}\n")
    for rel, count in files:
        print(f"  {rel} ({count} placeholders)")


def cmd_apply(dry_run=False):
    """Apply exercises from JSON."""
    if dry_run:
        print("=== DRY RUN (no files modified) ===\n")
    apply_exercises(dry_run=dry_run)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python fix_practice_exercises.py [scan|apply|apply --dry]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == 'scan':
        cmd_scan()
    elif cmd == 'apply':
        dry = '--dry' in sys.argv
        cmd_apply(dry_run=dry)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
