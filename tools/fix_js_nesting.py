"""Fix JS nesting bug: LearningProgress.init() trapped inside Breadcrumb if-block.

Pattern (broken):
    if (typeof Breadcrumb !== 'undefined') {

    // Initialize Progress
    if (typeof LearningProgress !== 'undefined') {
        LearningProgress.init(...);
    }
        Breadcrumb.init({ ... });
    }

Fixed:
    if (typeof Breadcrumb !== 'undefined') {
        Breadcrumb.init({ ... });
    }

    // Initialize Progress
    if (typeof LearningProgress !== 'undefined') {
        LearningProgress.init(...);
    }
"""
import re
import os
import sys

def fix_js_nesting(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: Breadcrumb if-block with LearningProgress nested inside
    pattern = re.compile(
        r'([ \t]*)// Initialize Breadcrumb\s*\n'
        r'\s*if \(typeof Breadcrumb !== \'undefined\'\) \{\s*\n'
        r'\s*\n'
        r'\s*// Initialize Progress\s*\n'
        r'\s*if \(typeof LearningProgress !== \'undefined\'\) \{\s*\n'
        r'\s*(LearningProgress\.init\([^)]+\);)\s*\n'
        r'\s*\}\s*\n'
        r'\s*(Breadcrumb\.init\(\{[^}]+\}\);)\s*\n'
        r'\s*\}',
        re.DOTALL
    )

    def replacement(m):
        indent = m.group(1)
        lp_init = m.group(2)
        bc_init = m.group(3)
        return (
            f'{indent}// Initialize Breadcrumb\n'
            f'{indent}if (typeof Breadcrumb !== \'undefined\') {{\n'
            f'{indent}    {bc_init}\n'
            f'{indent}}}\n'
            f'\n'
            f'{indent}// Initialize Progress\n'
            f'{indent}if (typeof LearningProgress !== \'undefined\') {{\n'
            f'{indent}    {lp_init}\n'
            f'{indent}}}'
        )

    new_content, count = pattern.subn(replacement, content)

    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'content', 'tic')
    fixed = 0
    failed = []

    for root, dirs, files in os.walk(base):
        for fname in files:
            if fname.endswith('.html'):
                fpath = os.path.join(root, fname)
                try:
                    if fix_js_nesting(fpath):
                        fixed += 1
                        rel = os.path.relpath(fpath, base)
                        print(f'  FIXED: {rel}')
                except Exception as e:
                    failed.append((fpath, str(e)))

    print(f'\nTotal fixed: {fixed} files')
    if failed:
        print(f'Failed: {len(failed)}')
        for f, e in failed:
            print(f'  ERROR: {f}: {e}')

    return 0 if not failed else 1

if __name__ == '__main__':
    sys.exit(main())
