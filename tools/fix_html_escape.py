#!/usr/bin/env python3
"""
fix_html_escape.py - Fix the "correct answer unclickable" bug
================================================================
Root cause: Quiz files insert option text via ${opt} in innerHTML template
literals. Options containing < or > (menu paths, HTML tags, code) get
interpreted as HTML tags, breaking the DOM. The option div becomes empty
or malformed, making it unclickable.

Fix: Add HTML escaping function and use it when rendering options.

Two patterns to fix:
1. optionsHTML += `<div class="option" onclick="selectAnswer(${i})">${opt}</div>`;
2. q.options.map((opt, i) => `<div class="option" onclick="selectAnswer(${i})">${opt}</div>`)
"""

import os
import re
import sys
import io
import json
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

CONTENT_DIR = Path(r"C:\AI\Projects\LearningHub\content")
RESULTS_DIR = Path(r"C:\AI\Projects\LearningHub\results")

# The escape helper to inject into each file
ESCAPE_HELPER = """
        // HTML-escape to prevent < > from breaking option rendering
        function escHtml(s) {
            return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }
"""


def fix_quiz_file(filepath):
    """Fix a single quiz file's option rendering."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = []

    # Check if already fixed
    if 'escHtml' in content:
        return None, "Already has escHtml - skipping"

    # Pattern 1: optionsHTML += `<div class="option" onclick="selectAnswer(${i})">${opt}</div>`;
    pat1 = r'(optionsHTML\s*\+=\s*`<div class="option" onclick="selectAnswer\(\$\{i\}\)">\$\{opt\}</div>`;)'
    m1 = re.search(pat1, content)

    # Pattern 2: .map((opt, i) => `<div class="option" onclick="selectAnswer(${i})">${opt}</div>`)
    pat2 = r'(`<div class="option" onclick="selectAnswer\(\$\{i\}\)">\$\{opt\}</div>`)'
    # Also: q.options.map((opt, i) =>
    pat2_full = r'(let optionsHTML = q\.options\.map\(\(opt,?\s*i\)\s*=>\s*\n?\s*`<div class="option" onclick="selectAnswer\(\$\{i\}\)">\$\{opt\}</div>`)'

    if m1:
        # Replace ${opt} with ${escHtml(opt)} in pattern 1
        old = m1.group(1)
        new = old.replace('${opt}', '${escHtml(opt)}')
        content = content.replace(old, new)
        changes.append(f"Pattern 1: wrapped opt in escHtml()")
    elif re.search(pat2, content):
        # Replace ${opt} with ${escHtml(opt)} in map pattern
        content = re.sub(
            r'(`<div class="option" onclick="selectAnswer\(\$\{i\}\)">\$\{)opt(\}</div>`)',
            r'\1escHtml(opt)\2',
            content
        )
        changes.append(f"Pattern 2 (map): wrapped opt in escHtml()")
    else:
        # Try generic: any ${opt} inside an option div
        if '${opt}' in content:
            content = content.replace('${opt}', '${escHtml(opt)}')
            changes.append(f"Generic: replaced all ${{opt}} with ${{escHtml(opt)}}")
        else:
            return None, "No ${opt} pattern found"

    # Now inject the escHtml function before showQuestion
    # Find the showQuestion function definition
    sq_match = re.search(r'(function showQuestion\s*\([^)]*\)\s*\{)', content)
    if sq_match:
        # Insert escHtml helper right after the opening brace
        insert_point = sq_match.end()
        content = content[:insert_point] + ESCAPE_HELPER + content[insert_point:]
        changes.append("Injected escHtml() helper in showQuestion()")
    else:
        # Try to find any function that builds options
        # Insert as a standalone function before the first function that uses it
        func_match = re.search(r'(function (showQuestion|displayQuestion|renderQuestion)\s*\()', content)
        if func_match:
            insert_point = func_match.start()
            standalone_helper = """
    // HTML-escape to prevent < > from breaking option rendering
    function escHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

"""
            content = content[:insert_point] + standalone_helper + content[insert_point:]
            changes.append(f"Injected standalone escHtml() before {func_match.group(2)}()")
        else:
            # Last resort: inject at start of script
            script_match = re.search(r'(<script>)', content)
            if script_match:
                insert_point = script_match.end()
                standalone_helper = """
    // HTML-escape to prevent < > from breaking option rendering
    function escHtml(s) {
        return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
"""
                content = content[:insert_point] + standalone_helper + content[insert_point:]
                changes.append("Injected escHtml() at start of <script>")
            else:
                return None, "Could not find injection point for escHtml()"

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return changes, None
    return None, "No changes needed"


def main():
    RESULTS_DIR.mkdir(exist_ok=True)

    # Find all quiz files
    quiz_files = sorted(CONTENT_DIR.rglob("quiz*.html"))
    print(f"Found {len(quiz_files)} quiz files to process")

    fixed = 0
    skipped = 0
    errors = 0
    fix_log = []

    for qf in quiz_files:
        rel = str(qf.relative_to(CONTENT_DIR))
        changes, error = fix_quiz_file(qf)

        if error:
            if "Already has" in error:
                skipped += 1
            elif "No ${opt}" in error:
                skipped += 1
            else:
                errors += 1
                print(f"  ERROR: {rel}: {error}")
            fix_log.append({'file': rel, 'status': 'skipped', 'reason': error})
        elif changes:
            fixed += 1
            print(f"  FIXED: {rel}")
            for c in changes:
                print(f"         {c}")
            fix_log.append({'file': rel, 'status': 'fixed', 'changes': changes})
        else:
            skipped += 1
            fix_log.append({'file': rel, 'status': 'no_change'})

    # Save log
    log_path = RESULTS_DIR / "fix_html_escape_log.json"
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump({
            'summary': {
                'total': len(quiz_files),
                'fixed': fixed,
                'skipped': skipped,
                'errors': errors
            },
            'files': fix_log
        }, f, indent=2, ensure_ascii=False)

    print(f"\nDone!")
    print(f"  Total quiz files: {len(quiz_files)}")
    print(f"  Fixed: {fixed}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Log: {log_path}")


if __name__ == '__main__':
    main()
