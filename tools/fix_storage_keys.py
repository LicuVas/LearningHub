#!/usr/bin/env python3
"""Fix localStorage keys and downloadProgress filenames that use wrong module names."""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
import re
import glob
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content" / "tic"

def fix_file(filepath):
    """Fix storage keys in a single file."""
    rel = Path(filepath).relative_to(CONTENT_DIR)
    parts = list(rel.parts)
    grade = parts[0]      # cls5
    module = parts[1]     # extra-birotice-cls7
    fname = parts[2].replace('.html', '')  # lectia1-documente
    correct_id = f'{grade}-{module}-{fname}'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    # Pattern: find any string like 'cls5-WRONG-lectiaX-name' and replace WRONG with correct module
    # These appear in: localStorage.removeItem('prefix-cls5-wrong-lectia...')
    # and: downloadProgress('cls5-wrong-lectia...-progres.json')

    # Build regex: grade + some wrong module + filename
    # The filename part starts with 'lectia'
    escaped_grade = re.escape(grade)
    escaped_fname = re.escape(fname)

    # Match: grade-anything-filename where "anything" is not the correct module
    pattern = re.compile(
        escaped_grade + r'-([a-z0-9][-a-z0-9]*)-' + escaped_fname
    )

    fixes = 0
    def replace_match(m):
        nonlocal fixes
        found_module = m.group(1)
        if found_module != module:
            fixes += 1
            return f'{grade}-{module}-{fname}'
        return m.group(0)

    content = pattern.sub(replace_match, content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return fixes
    return 0


def main():
    print("Fixing localStorage/downloadProgress keys")
    print("=" * 50)

    lesson_files = sorted(glob.glob(str(CONTENT_DIR / '**' / 'lectia*.html'), recursive=True))

    total_fixes = 0
    fixed_files = 0

    for filepath in lesson_files:
        fixes = fix_file(filepath)
        if fixes > 0:
            rel = str(Path(filepath).relative_to(CONTENT_DIR)).replace('\\', '/')
            fixed_files += 1
            total_fixes += fixes
            print(f"  FIXED: {rel} ({fixes} keys)")

    print(f"\n{'=' * 50}")
    print(f"Files fixed: {fixed_files}")
    print(f"Total key replacements: {total_fixes}")


if __name__ == '__main__':
    main()
