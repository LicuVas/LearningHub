#!/usr/bin/env python3
"""
Fix JS load order across all lesson HTML files.
Issue: lesson-summary.js is loaded BEFORE practice-simple.js in 173/189 lessons.
Fix: Ensure practice-simple.js comes before lesson-summary.js.

Strategy:
1. Find all lectia*.html files
2. Check if lesson-summary.js appears before practice-simple.js
3. If so, restructure the script section:
   - atomic-learning.js (keep position)
   - practice-simple.js (move before lesson-summary.js)
   - lesson-summary.js
   - Single DOMContentLoaded block with all inits in correct order
"""
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE, 'content', 'tic')

def find_lesson_files():
    """Find all lectia*.html files."""
    files = []
    for root, dirs, filenames in os.walk(CONTENT_DIR):
        for f in filenames:
            if f.startswith('lectia') and f.endswith('.html'):
                files.append(os.path.join(root, f))
    return files

def check_js_order(content):
    """Check if lesson-summary.js appears before practice-simple.js."""
    summary_pos = content.find('lesson-summary.js')
    practice_pos = content.find('practice-simple.js')

    if summary_pos == -1 or practice_pos == -1:
        return False  # One or both missing, can't fix

    return summary_pos < practice_pos  # True = wrong order

def fix_js_order(filepath):
    """Fix the JS load order in a single file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if not check_js_order(content):
        return False  # Already correct or not applicable

    # Strategy: Find the script section pattern and restructure it
    # Pattern 1: lesson-summary.js loaded, then DOMContentLoaded with inits, then practice-simple.js loaded, then another DOMContentLoaded

    # Find the lesson ID from AtomicLearning.init or LessonSummary.init call
    lesson_id_match = re.search(r"(?:AtomicLearning|LessonSummary)\.init\(['\"]([^'\"]+)['\"]\)", content)
    if not lesson_id_match:
        return False
    lesson_id = lesson_id_match.group(1)

    # Approach: Find all script tags and DOMContentLoaded blocks in the bottom section
    # Remove the practice-simple.js script tag and its DOMContentLoaded from its current position
    # Insert practice-simple.js before lesson-summary.js
    # Consolidate DOMContentLoaded blocks

    # Find the practice-simple script tag and its init block
    # Pattern: <script src="...practice-simple.js"></script> followed by <script>...PracticeSimple.init...</script>
    practice_block_pattern = re.compile(
        r'\s*<!--\s*Practice\s*System\s*-->\s*\n'
        r'\s*<script\s+src="[^"]*practice-simple\.js"\s*>\s*</script>\s*\n'
        r'\s*<script>\s*\n'
        r'(?:\s*document\.addEventListener\([\'"]DOMContentLoaded[\'"],\s*function\(\)\s*\{\s*\n)?'
        r'(?:\s*if\s*\(typeof\s+PracticeSimple\s*!==\s*[\'"]undefined[\'"]\)\s*\{\s*\n)?'
        r'(?:\s*PracticeSimple\.init\([\'"][^\'"]*[\'"]\);\s*\n)?'
        r'(?:\s*\}\s*\n)?'
        r'(?:\s*\}\);\s*\n)?'
        r'\s*</script>',
        re.MULTILINE
    )

    # Simpler approach: just find and remove the practice block, then insert before lesson-summary
    # Find practice-simple.js script src line
    practice_src_pattern = re.compile(r'<script\s+src="([^"]*practice-simple\.js)"\s*>\s*</script>')
    practice_src_match = practice_src_pattern.search(content)
    if not practice_src_match:
        return False

    practice_src_path = practice_src_match.group(1)

    # Remove everything from "<!-- Practice System -->" to the closing </script> of its init block
    # Be more flexible with the pattern
    practice_full_pattern = re.compile(
        r'(\s*(?:<!--\s*Practice\s*System\s*-->\s*\n)?'
        r'\s*<script\s+src="[^"]*practice-simple\.js"\s*>\s*</script>\s*\n'
        r'\s*<script>[\s\S]*?PracticeSimple[\s\S]*?</script>)',
        re.MULTILINE
    )

    practice_full_match = practice_full_pattern.search(content)
    if not practice_full_match:
        # Try just removing the script src tag (no init block)
        practice_full_pattern = re.compile(
            r'\s*(?:<!--\s*Practice\s*System\s*-->\s*\n)?'
            r'\s*<script\s+src="[^"]*practice-simple\.js"\s*>\s*</script>',
            re.MULTILINE
        )
        practice_full_match = practice_full_pattern.search(content)
        if not practice_full_match:
            return False

    # Remove the practice block from its current position
    content_without_practice = content[:practice_full_match.start()] + content[practice_full_match.end():]

    # Now find lesson-summary.js and insert practice-simple.js before it
    summary_pattern = re.compile(
        r'((?:\s*<!--\s*Lesson\s*Summary\s*System\s*-->\s*\n)?'
        r'\s*<script\s+src="[^"]*lesson-summary\.js"\s*>\s*</script>)',
        re.MULTILINE
    )

    summary_match = summary_pattern.search(content_without_practice)
    if not summary_match:
        return False

    # Build the practice script insert
    practice_insert = f'\n<!-- Practice System -->\n<script src="{practice_src_path}"></script>\n'

    # Insert practice before lesson-summary
    new_content = (
        content_without_practice[:summary_match.start()] +
        practice_insert +
        content_without_practice[summary_match.start():]
    )

    # Now ensure PracticeSimple.init is in the DOMContentLoaded block (before LessonSummary.init)
    # Check if there's already a PracticeSimple.init in the DOMContentLoaded
    if 'PracticeSimple.init' not in new_content.split('practice-simple.js')[0].split('lesson-summary.js')[-1]:
        # Add PracticeSimple.init before LessonSummary.init in DOMContentLoaded
        summary_init_pattern = re.compile(
            r"(\s*)((?://\s*Initialize\s*Lesson\s*Summary\s*\n\s*)?LessonSummary\.init\(['\"][^'\"]*['\"]\);)"
        )
        summary_init_match = summary_init_pattern.search(new_content)
        if summary_init_match:
            indent = summary_init_match.group(1)
            practice_init = f"{indent}// Initialize Practice\n{indent}if (typeof PracticeSimple !== 'undefined') {{\n{indent}    PracticeSimple.init('{lesson_id}');\n{indent}}}\n\n"
            new_content = new_content[:summary_init_match.start()] + practice_init + new_content[summary_init_match.start():]

    # Remove any standalone PracticeSimple.init DOMContentLoaded blocks that are now orphaned
    # (they were tied to the practice script block we removed)
    orphan_pattern = re.compile(
        r'\s*<script>\s*\n'
        r'\s*document\.addEventListener\([\'"]DOMContentLoaded[\'"],\s*function\(\)\s*\{\s*\n'
        r'\s*if\s*\(typeof\s+PracticeSimple\s*!==\s*[\'"]undefined[\'"]\)\s*\{\s*\n'
        r'\s*PracticeSimple\.init\([\'"][^\'"]*[\'"]\);\s*\n'
        r'\s*\}\s*\n'
        r'\s*\}\);\s*\n'
        r'\s*</script>',
        re.MULTILINE
    )
    new_content = orphan_pattern.sub('', new_content)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def main():
    files = find_lesson_files()
    print(f"Found {len(files)} lesson files")

    fixed = 0
    skipped = 0
    errors = []

    for filepath in sorted(files):
        rel = os.path.relpath(filepath, BASE)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if not check_js_order(content):
                skipped += 1
                continue

            if fix_js_order(filepath):
                fixed += 1
                print(f"  FIXED: {rel}")
            else:
                skipped += 1
                print(f"  SKIP:  {rel} (could not parse)")
        except Exception as e:
            errors.append((rel, str(e)))
            print(f"  ERROR: {rel} - {e}")

    print(f"\nResults: {fixed} fixed, {skipped} skipped, {len(errors)} errors")

    if errors:
        print("\nErrors:")
        for path, err in errors:
            print(f"  {path}: {err}")

if __name__ == '__main__':
    main()
