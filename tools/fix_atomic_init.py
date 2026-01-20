#!/usr/bin/env python3
"""
Fix Atomic Learning HTML initialization in converted lessons.
Removes duplicate initAtom calls - init() handles everything.
"""

import os
import re
from pathlib import Path

CONTENT_ROOT = Path(__file__).parent.parent / "content" / "tic"

def fix_html_file(filepath: Path) -> bool:
    """Fix initialization in a single HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    # Check if file has the problematic pattern
    if 'AtomicLearning.initAtom(atomEl.id' not in content:
        return False

    # Remove the duplicate initialization loop
    old_pattern = r'''            // Initialize all atoms
            document\.querySelectorAll\('\.atom\[data-quiz\]'\)\.forEach\(function\(atomEl\) \{
                var quizData = JSON\.parse\(atomEl\.dataset\.quiz \|\| '\[\]'\);
                if \(quizData\.length > 0\) \{
                    AtomicLearning\.initAtom\(atomEl\.id, quizData\);
                \}
            \}\);'''

    new_content = re.sub(old_pattern, '', content, flags=re.MULTILINE)

    # Also try alternative pattern with different indentation
    old_pattern2 = r'''        // Initialize all atoms
        document\.querySelectorAll\('\.atom\[data-quiz\]'\)\.forEach\(function\(atomEl\) \{
            var quizData = JSON\.parse\(atomEl\.dataset\.quiz \|\| '\[\]'\);
            if \(quizData\.length > 0\) \{
                AtomicLearning\.initAtom\(atomEl\.id, quizData\);
            \}
        \}\);'''

    new_content = re.sub(old_pattern2, '', new_content, flags=re.MULTILINE)

    # Simple string replacement as fallback
    if 'AtomicLearning.initAtom(atomEl.id' in new_content:
        # Find and remove the block
        lines = new_content.split('\n')
        new_lines = []
        skip_until_close = 0
        for line in lines:
            if '// Initialize all atoms' in line:
                skip_until_close = 2  # Skip this and next lines until we see });
                continue
            if skip_until_close > 0:
                if '});' in line:
                    skip_until_close -= 1
                continue
            new_lines.append(line)
        new_content = '\n'.join(new_lines)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    fixed = 0
    for html_file in CONTENT_ROOT.rglob('*.html'):
        if fix_html_file(html_file):
            print(f"Fixed: {html_file}")
            fixed += 1
    print(f"\nTotal fixed: {fixed}")

if __name__ == '__main__':
    main()
