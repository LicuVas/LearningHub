#!/usr/bin/env python3
"""
Fix code blocks by adding white-space: pre-wrap; to .code-block CSS class
"""

import os
import re
from pathlib import Path

def fix_code_block_css(file_path):
    """Add white-space: pre-wrap; to .code-block if not present"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if .code-block exists in file
    if '.code-block {' not in content:
        return False, "no .code-block"

    # Check if white-space is already present in .code-block
    code_block_pattern = r'\.code-block \{[^}]*\}'
    match = re.search(code_block_pattern, content)
    if match:
        if 'white-space:' in match.group():
            return False, "already has white-space"

    # Add white-space: pre-wrap; after overflow-x: auto;
    new_content = re.sub(
        r'(\.code-block \{[^}]*overflow-x: auto;)',
        r'\1\n            white-space: pre-wrap;',
        content
    )

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, "updated"

    return False, "no match for overflow-x pattern"

def main():
    base_path = Path(r"C:\AI\Projects\LearningHub")

    # Directories to process
    dirs = ['content', 'hub']

    updated = 0
    skipped = 0
    errors = 0

    for dir_name in dirs:
        dir_path = base_path / dir_name
        if not dir_path.exists():
            continue

        for html_file in dir_path.rglob('*.html'):
            try:
                success, reason = fix_code_block_css(html_file)
                rel_path = html_file.relative_to(base_path)
                if success:
                    print(f"UPDATED: {rel_path}")
                    updated += 1
                else:
                    print(f"SKIP ({reason}): {rel_path}")
                    skipped += 1
            except Exception as e:
                print(f"ERROR: {html_file} - {e}")
                errors += 1

    print(f"\n=== Summary ===")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()
