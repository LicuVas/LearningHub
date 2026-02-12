"""
LearningHub Site Issue Fixer
=============================
Fixes issues found by site_audit.py:
1. Adds practice-gate.js to lessons with ungated practice sections
2. Adds breadcrumb.js to lessons missing it
3. Reports what was changed
"""

import os
import re
from pathlib import Path

SITE_ROOT = Path(r"C:\AI\Projects\LearningHub")
CONTENT_ROOT = SITE_ROOT / "content" / "tic"

changes = []


def get_relative_js_path(html_file, js_filename):
    """Calculate relative path from HTML file to assets/js/"""
    html_dir = os.path.dirname(html_file)
    js_dir = os.path.join(SITE_ROOT, "assets", "js")
    rel = os.path.relpath(js_dir, html_dir).replace("\\", "/")
    return f"{rel}/{js_filename}"


def fix_practice_gate(filepath, content):
    """Add practice-gate.js to files with ungated practice sections"""
    # Only fix if has goToStep AND practice-section AND no practice-gate
    has_gotostep = 'function goToStep' in content
    has_practice = 'class="practice-section"' in content or 'class="practice-area"' in content
    has_gate = 'practice-gate.js' in content

    if not has_gotostep or not has_practice or has_gate:
        return content, False

    # Check if practice section already has display:none (already fixed)
    practice_match = re.search(r'<(?:section|div)[^>]*class="practice-(?:section|area)"[^>]*>', content)
    if practice_match and 'display: none' in practice_match.group(0):
        return content, False

    # Calculate relative path to practice-gate.js
    js_path = get_relative_js_path(filepath, "practice-gate.js")

    # Insert practice-gate.js before </body>
    if '</body>' in content:
        script_tag = f'<script src="{js_path}"></script>\n'
        content = content.replace('</body>', f'{script_tag}</body>')
        changes.append(f"PRACTICE_GATE: Added practice-gate.js to {os.path.relpath(filepath, SITE_ROOT)}")
        return content, True

    return content, False


def fix_breadcrumb(filepath, content):
    """Add breadcrumb.js to files missing it"""
    basename = os.path.basename(filepath)

    # Skip index files for now
    if basename == "index.html":
        return content, False

    has_breadcrumb = 'breadcrumb.js' in content

    if has_breadcrumb:
        return content, False

    # Calculate relative path
    js_path = get_relative_js_path(filepath, "breadcrumb.js")

    # Determine grade and module from path
    parts = filepath.replace("\\", "/").split("/")
    grade = None
    module_id = None
    module_name = None

    for i, p in enumerate(parts):
        if p.startswith("cls"):
            grade = p
        if re.match(r'm\d+-', p) or p.startswith("extra-"):
            module_id = p

    if not grade:
        return content, False

    # Grade display names
    grade_names = {
        'cls5': 'Clasa a V-a',
        'cls6': 'Clasa a VI-a',
        'cls7': 'Clasa a VII-a',
        'cls8': 'Clasa a VIII-a',
    }
    grade_name = grade_names.get(grade, grade)

    # Try to extract module name from the file's title or heading
    title_match = re.search(r'<title>([^|<]+)', content)
    lesson_name = title_match.group(1).strip() if title_match else basename

    # Build breadcrumb init
    breadcrumb_script = f'''<script src="{js_path}"></script>
<script>
    Breadcrumb.init({{
        grade: '{grade}',
        gradeName: '{grade_name}',
        module: '{module_id or ""}',
        moduleName: '{module_id or ""}',
        lesson: '{lesson_name}'
    }});
</script>
'''

    # Insert before </body>
    if '</body>' in content:
        content = content.replace('</body>', f'{breadcrumb_script}</body>')
        changes.append(f"BREADCRUMB: Added breadcrumb.js to {os.path.relpath(filepath, SITE_ROOT)}")
        return content, True

    return content, False


def find_all_lessons():
    """Find all HTML files under content/tic/"""
    lessons = []
    for root, dirs, files in os.walk(CONTENT_ROOT):
        if "quizuri" in root:
            continue
        for f in files:
            if f.endswith(".html"):
                lessons.append(os.path.join(root, f))
    return sorted(lessons)


def main():
    lessons = find_all_lessons()
    fixed_count = 0
    practice_fixed = 0
    breadcrumb_fixed = 0

    print(f"LearningHub Site Fixer")
    print(f"{'=' * 60}")
    print(f"Processing {len(lessons)} HTML files...\n")

    for filepath in lessons:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"ERROR reading {filepath}: {e}")
            continue

        original = content
        modified = False

        # Fix 1: Practice gate
        content, changed = fix_practice_gate(filepath, content)
        if changed:
            modified = True
            practice_fixed += 1

        # Fix 2: Breadcrumb
        content, changed = fix_breadcrumb(filepath, content)
        if changed:
            modified = True
            breadcrumb_fixed += 1

        # Write back if modified
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            fixed_count += 1

    print(f"\n{'=' * 60}")
    print(f"RESULTS")
    print(f"{'=' * 60}")
    print(f"Files processed: {len(lessons)}")
    print(f"Files modified: {fixed_count}")
    print(f"Practice gates added: {practice_fixed}")
    print(f"Breadcrumbs added: {breadcrumb_fixed}")

    print(f"\nChanges made:")
    for c in changes:
        print(f"  {c}")


if __name__ == "__main__":
    main()
