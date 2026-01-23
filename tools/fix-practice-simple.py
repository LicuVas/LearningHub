#!/usr/bin/env python3
"""
Fix Practice Simple - Add practice-simple.js to all lesson files
================================================================
Adds PracticeSimple initialization to HTML files that have
practice-advanced or practice-exercise sections but lack the script.
"""

import os
import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content" / "tic"
PRACTICE_SCRIPT = '../../../../assets/js/practice-simple.js'

def get_lesson_id(file_path: Path) -> str:
    """Generate lesson ID from file path."""
    # e.g., cls5/m1-sisteme/lectia1-calculator.html -> cls5-m1-sisteme-lectia1-calculator
    rel_path = file_path.relative_to(CONTENT_DIR)
    parts = list(rel_path.parts)
    # Remove .html extension from last part
    parts[-1] = parts[-1].replace('.html', '')
    return '-'.join(parts)

def has_practice_section(content: str) -> bool:
    """Check if file has practice-advanced or practice-exercise sections."""
    return 'practice-advanced' in content or 'practice-exercise' in content

def has_practice_simple(content: str) -> bool:
    """Check if practice-simple.js is already included."""
    return 'practice-simple.js' in content

def find_insertion_point(content: str) -> tuple:
    """
    Find the best insertion point for the practice-simple script.
    Returns (pattern_to_find, replacement) or (None, None) if not found.
    """
    # Pattern 1: After RPG system script block (most common)
    patterns = [
        # After RPG.init block, before LearningProgress.init
        (r'(    </script>\n    <script>\n        LearningProgress\.init\([^)]+\);)',
         lambda m, lid: f'''    </script>
    <!-- Practice System -->
    <script src="{PRACTICE_SCRIPT}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof PracticeSimple !== 'undefined') {{
                PracticeSimple.init('{lid}');
            }}
        }});
    </script>
    <script>
        LearningProgress.init{m.group(1).split('LearningProgress.init')[1]}'''),

        # Before </body> tag (fallback)
        (r'(</body>)',
         lambda m, lid: f'''    <!-- Practice System -->
    <script src="{PRACTICE_SCRIPT}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof PracticeSimple !== 'undefined') {{
                PracticeSimple.init('{lid}');
            }}
        }});
    </script>
</body>'''),
    ]

    return patterns

def fix_file(file_path: Path, dry_run: bool = False) -> bool:
    """
    Add practice-simple.js to a single file.
    Returns True if file was modified.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if no practice section
    if not has_practice_section(content):
        return False

    # Skip if already has practice-simple
    if has_practice_simple(content):
        return False

    lesson_id = get_lesson_id(file_path)

    # Try to find LearningProgress.init pattern
    lp_match = re.search(r'LearningProgress\.init\([^)]+\);', content)

    if lp_match:
        # Insert before LearningProgress.init block
        # Find the <script> tag that contains it
        script_start = content.rfind('<script>', 0, lp_match.start())

        insertion = f'''<!-- Practice System -->
    <script src="{PRACTICE_SCRIPT}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof PracticeSimple !== 'undefined') {{
                PracticeSimple.init('{lesson_id}');
            }}
        }});
    </script>
    '''

        new_content = content[:script_start] + insertion + content[script_start:]
    else:
        # Fallback: insert before </body>
        insertion = f'''
    <!-- Practice System -->
    <script src="{PRACTICE_SCRIPT}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof PracticeSimple !== 'undefined') {{
                PracticeSimple.init('{lesson_id}');
            }}
        }});
    </script>
'''
        new_content = content.replace('</body>', insertion + '</body>')

    if dry_run:
        print(f"  Would fix: {file_path.relative_to(CONTENT_DIR)}")
        return True

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  Fixed: {file_path.relative_to(CONTENT_DIR)}")
    return True

def main():
    """Main function to fix all lesson files."""
    classes = ['cls5', 'cls6', 'cls8']  # cls7 already fixed

    total_fixed = 0
    total_skipped = 0

    for cls in classes:
        cls_dir = CONTENT_DIR / cls
        if not cls_dir.exists():
            print(f"Skipping {cls}: directory not found")
            continue

        print(f"\n=== Processing {cls.upper()} ===")

        # Find all HTML files (excluding index.html)
        html_files = list(cls_dir.rglob('lectia*.html'))

        for html_file in sorted(html_files):
            try:
                if fix_file(html_file):
                    total_fixed += 1
                else:
                    total_skipped += 1
            except Exception as e:
                print(f"  Error processing {html_file}: {e}")

    print(f"\n=== Summary ===")
    print(f"Fixed: {total_fixed} files")
    print(f"Skipped (no practice or already has script): {total_skipped} files")

if __name__ == '__main__':
    main()
