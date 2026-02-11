#!/usr/bin/env python3
"""
fix_remaining.py - Fix remaining audit issues:
1. PRACTICE_NO_JS: 12 files missing practice-simple.js script tag
2. MODULE_MISMATCH: cls8/m4-html-css/index.html badge says "Modul 2" should be "Modul 4"
   (cls5/m5-proiect/lectia4 is a false positive - breadcrumb says "Modulul 5" which matches m5)
"""

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

fixes = []

# ============================================================
# FIX 1: Add practice-simple.js to files that have practice
# sections but no practice JS loaded
# ============================================================

practice_files = [
    # liceu files - 5 levels deep: liceu/mat-info/cls9/module/file.html
    "liceu/mat-info/cls9/m1-gandire-comp/lectia1-intro-algoritmi.html",
    "liceu/mat-info/cls9/m1-gandire-comp/lectia2-variabile-tipuri.html",
    "liceu/mat-info/cls9/m1-gandire-comp/lectia3-expresii.html",
    "liceu/mat-info/cls9/m1-gandire-comp/lectia4-intro-python.html",
    "liceu/mat-info/cls9/m1-gandire-comp/lectia5-intro-cpp.html",
    "liceu/mat-info/cls9/m1-gandire-comp/lectia6-evaluare-expresii.html",
    "liceu/mat-info/cls9/m4-etica-digitala/lectia1-siguranta-online.html",
    "liceu/mat-info/cls9/m4-etica-digitala/lectia2-phishing-malware.html",
    "liceu/mat-info/cls9/m4-etica-digitala/lectia3-drepturi-autor.html",
    "liceu/mat-info/cls9/m4-etica-digitala/lectia4-gdpr-confidentialitate.html",
    # tic files - 4 levels deep: tic/cls7/module/file.html
    "tic/cls7/m3-algoritmi-schema/lectia9-geografie.html",
    "tic/cls7/m3-algoritmi-schema/lectia10-roboti.html",
]


def get_practice_js_path(filepath):
    """Determine the correct relative path to practice-simple.js based on depth."""
    rel = Path(filepath).relative_to(CONTENT_DIR)
    depth = len(rel.parts) - 1  # -1 for the filename itself
    prefix = "../" * depth
    return f"{prefix}assets/js/practice-simple.js"


def fix_practice_no_js():
    """Add practice-simple.js script tag to files that need it."""
    count = 0
    for rel_path in practice_files:
        fp = CONTENT_DIR / rel_path
        if not fp.exists():
            print(f"  SKIP: {rel_path} (file not found)")
            continue

        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        if 'practice-simple' in content:
            print(f"  SKIP: {rel_path} (already has practice-simple)")
            continue

        js_path = get_practice_js_path(fp)

        # Check if this file uses practice-system.js instead (newer pattern)
        if 'practice-system.js' in content:
            print(f"  SKIP: {rel_path} (uses practice-system.js instead)")
            continue

        # Find the right insertion point - before </body> or after last <script>
        # Best: insert after the last existing <script src="..."></script> line
        script_pattern = re.compile(r'(\s*<script src="[^"]*"></script>\s*\n)')
        matches = list(script_pattern.finditer(content))

        if matches:
            # Insert after the last script tag
            last_script = matches[-1]
            indent = re.match(r'\s*', last_script.group(1)).group(0)
            insert_text = f'{indent}<script src="{js_path}"></script>\n'
            insert_pos = last_script.end()
            content = content[:insert_pos] + insert_text + content[insert_pos:]
        else:
            # Insert before </body>
            body_close = content.rfind('</body>')
            if body_close >= 0:
                insert_text = f'    <script src="{js_path}"></script>\n'
                content = content[:body_close] + insert_text + content[body_close:]
            else:
                print(f"  ERROR: {rel_path} (no </body> found)")
                continue

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)

        count += 1
        print(f"  FIXED: {rel_path} -> added {js_path}")
        fixes.append({'file': rel_path, 'fix': 'PRACTICE_NO_JS', 'action': f'added {js_path}'})

    return count


# ============================================================
# FIX 2: Module mismatch in cls8/m4-html-css/index.html
# Badge says "Modul 2" but directory is m4
# ============================================================

def fix_module_mismatch():
    """Fix badge text in cls8/m4-html-css/index.html."""
    count = 0

    # Fix 1: cls8/m4-html-css/index.html - badge says "Modulul 2" should be "Modulul 4"
    fp = CONTENT_DIR / "tic/cls8/m4-html-css/index.html"
    if fp.exists():
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        old = 'Clasa a VIII-a • Modulul 2'
        new = 'Clasa a VIII-a • Modulul 4'
        if old in content:
            content = content.replace(old, new)
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f"  FIXED: tic/cls8/m4-html-css/index.html: '{old}' -> '{new}'")
            fixes.append({'file': 'tic/cls8/m4-html-css/index.html', 'fix': 'MODULE_MISMATCH', 'action': f'{old} -> {new}'})
        else:
            print(f"  SKIP: tic/cls8/m4-html-css/index.html (text not found)")
    else:
        print(f"  SKIP: tic/cls8/m4-html-css/index.html (file not found)")

    return count


def main():
    RESULTS_DIR.mkdir(exist_ok=True)
    total = 0

    print("=" * 60)
    print("FIX 1: Practice sections without JS")
    print("=" * 60)
    total += fix_practice_no_js()

    print()
    print("=" * 60)
    print("FIX 2: Module name mismatches")
    print("=" * 60)
    total += fix_module_mismatch()

    # Save log
    log = {'total_fixes': total, 'fixes': fixes}
    log_path = RESULTS_DIR / "fix_remaining_log.json"
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(log, f, indent=2, ensure_ascii=False)

    print(f"\nTotal fixes applied: {total}")
    print(f"Log: {log_path}")


if __name__ == '__main__':
    main()
