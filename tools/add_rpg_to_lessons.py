#!/usr/bin/env python3
"""
Script to add RPG system integration to all lesson HTML files.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(r"C:\AI\Projects\LearningHub\content\tic")

def get_lesson_info(filepath):
    """Extract grade and module from file path."""
    parts = filepath.parts
    # Find cls5, cls6, cls7, cls8
    grade = None
    module = None
    lesson = None

    for i, part in enumerate(parts):
        if part.startswith('cls'):
            grade = part
            if i + 1 < len(parts) and parts[i+1].startswith('m'):
                module = parts[i+1]

    # Extract lesson number from filename
    filename = filepath.name
    match = re.search(r'lectia(\d+)', filename)
    if match:
        lesson = f"lectia{match.group(1)}"

    return grade, module, lesson

def already_has_rpg(content):
    """Check if file already has RPG integration."""
    return 'rpg-system.js' in content

def find_insertion_point(content):
    """Find where to insert RPG script - after progress.js script."""
    # Look for progress.js script
    progress_pattern = r'(<script src="[^"]*progress\.js"></script>)'
    match = re.search(progress_pattern, content)
    if match:
        return match.end(), 'after_progress'

    # Alternative: look for <!-- Progress Tracking -->
    progress_comment = '<!-- Progress Tracking -->'
    idx = content.find(progress_comment)
    if idx != -1:
        # Find the closing </script> after this
        script_end = content.find('</script>', idx)
        if script_end != -1:
            return script_end + len('</script>'), 'after_progress_section'

    # Fallback: before </body>
    body_end = content.rfind('</body>')
    if body_end != -1:
        return body_end, 'before_body'

    return None, None

def generate_rpg_snippet(grade, module, total_questions=4):
    """Generate RPG integration snippet."""
    return f'''
    <!-- RPG System -->
    <script src="../../../../assets/js/rpg-system.js"></script>
    <script>
        RPG.init('{grade}', '{module}');
        // Hook quiz checking to RPG system
        if (typeof checkAllAnswers !== 'undefined') {{
            const originalCheckAllAnswers = checkAllAnswers;
            checkAllAnswers = function() {{
                originalCheckAllAnswers();
                if (typeof correctCount !== 'undefined' && correctCount >= {total_questions - 1}) {{
                    RPG.onQuizPass(correctCount, {total_questions}, correctCount === {total_questions});
                }}
            }};
        }}
    </script>
'''

def process_lesson(filepath):
    """Process a single lesson file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if already_has_rpg(content):
        return False, "Already has RPG"

    grade, module, lesson = get_lesson_info(filepath)
    if not grade or not module:
        return False, f"Could not determine grade/module: {grade}/{module}"

    insertion_point, method = find_insertion_point(content)
    if insertion_point is None:
        return False, "Could not find insertion point"

    # Count quiz questions to determine total
    question_count = content.count('class="quiz-option"')
    total_questions = max(4, question_count // 4)  # Assume 4 options per question

    rpg_snippet = generate_rpg_snippet(grade, module, min(total_questions, 5))

    new_content = content[:insertion_point] + rpg_snippet + content[insertion_point:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True, f"Added RPG ({method})"

def main():
    """Process all lesson files."""
    lesson_files = list(BASE_DIR.rglob("lectia*.html"))

    print(f"Found {len(lesson_files)} lesson files")
    print("=" * 60)

    updated = 0
    skipped = 0
    errors = 0

    for filepath in sorted(lesson_files):
        rel_path = filepath.relative_to(BASE_DIR)
        success, message = process_lesson(filepath)

        if success:
            print(f"[OK] {rel_path}: {message}")
            updated += 1
        elif "Already has RPG" in message:
            print(f"[SKIP] {rel_path}: {message}")
            skipped += 1
        else:
            print(f"[ERR] {rel_path}: {message}")
            errors += 1

    print("=" * 60)
    print(f"Summary: {updated} updated, {skipped} skipped, {errors} errors")

if __name__ == "__main__":
    main()
