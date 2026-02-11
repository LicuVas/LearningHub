#!/usr/bin/env python3
"""Fix escaped quotes in onclick attributes that break HTML parsing.

Problem: onclick="selectOption(this, 'q5', true, '...\"text\"...')"
The \" is a JavaScript escape but NOT valid HTML. Browser sees " as ending the attribute.
Fix: Replace \" with &quot; inside onclick attributes.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import os
import re
import glob
from pathlib import Path

BASE = Path(__file__).parent.parent / "content" / "tic"


def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content

    # Fix escaped quotes inside onclick attributes
    def fix_onclick(m):
        attr_content = m.group(1)
        if '\\"' not in attr_content:
            return m.group(0)
        fixed = attr_content.replace('\\"', '&quot;')
        return 'onclick="' + fixed + '"'

    content = re.sub(r'onclick="((?:[^"\\]|\\.)*)"', fix_onclick, content)

    if content != original:
        fixes = original.count('\\"') - content.count('\\"')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return fixes
    return 0


def main():
    print("Fixing escaped quotes in onclick attributes")
    print("=" * 50)

    files = sorted(glob.glob(str(BASE / '**' / '*.html'), recursive=True))
    total_fixes = 0
    fixed_files = 0

    for filepath in files:
        fixes = fix_file(filepath)
        if fixes > 0:
            rel = str(Path(filepath).relative_to(BASE)).replace('\\', '/')
            fixed_files += 1
            total_fixes += fixes
            print(f"  FIXED: {rel} ({fixes} escaped quotes)")

    print(f"\n{'=' * 50}")
    print(f"Files fixed: {fixed_files}")
    print(f"Total escaped quotes fixed: {total_fixes}")


if __name__ == '__main__':
    main()
