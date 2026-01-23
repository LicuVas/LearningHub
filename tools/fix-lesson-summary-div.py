#!/usr/bin/env python3
"""
Fix missing #lesson-summary div in lessons
"""

import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content" / "tic"

def fix_lesson_summary_div(filepath: Path) -> bool:
    """Add #lesson-summary div if missing."""
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    if 'id="lesson-summary"' in content:
        return False  # Already has it

    # Find the best insertion point
    div_html = '\n    <!-- Lesson Summary & Export -->\n    <div id="lesson-summary" style="display: none;"></div>\n'

    modified = False

    # Strategy 1: Insert before <footer>
    if '<footer>' in content and not modified:
        content = content.replace('<footer>', div_html + '    <footer>')
        modified = True

    # Strategy 2: Insert after </main>
    if '</main>' in content and not modified:
        content = content.replace('</main>', '</main>\n' + div_html)
        modified = True

    # Strategy 3: Insert before </body>
    if '</body>' in content and not modified:
        content = content.replace('</body>', div_html + '</body>')
        modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False


def main():
    fixed = 0
    classes = ['cls5', 'cls6', 'cls7', 'cls8']

    for cls in classes:
        cls_dir = CONTENT_DIR / cls
        if not cls_dir.exists():
            continue

        for lesson_file in cls_dir.rglob('lectia*.html'):
            if fix_lesson_summary_div(lesson_file):
                rel_path = lesson_file.relative_to(CONTENT_DIR)
                print(f"Fixed: {rel_path}")
                fixed += 1

    print(f"\nTotal fixed: {fixed}")


if __name__ == '__main__':
    main()
