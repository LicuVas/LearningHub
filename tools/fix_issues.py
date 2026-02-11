#!/usr/bin/env python3
"""
LearningHub Issue Fixer
========================
Fixes issues identified by audit_lessons.py.
Run audit first, then this.

Fixes:
1. MISSING_JS: Wrong JS/CSS path depth (../../../ vs ../../../../)
2. MODULE_MISMATCH: Badge/breadcrumb text corrections
3. NAV_BROKEN: Fix prev/next navigation links
4. BROKEN_INDEX_LINKS: Fix quiz link names in index files
"""

import os
import re
import json
from pathlib import Path

CONTENT_ROOT = Path(r"C:\AI\Projects\LearningHub\content")
PROJECT_ROOT = Path(r"C:\AI\Projects\LearningHub")
RESULTS_DIR = PROJECT_ROOT / "results"

fixes_applied = []
files_modified = set()


def log_fix(file_path, fix_type, detail):
    fixes_applied.append({
        "file": str(Path(file_path).relative_to(CONTENT_ROOT)),
        "type": fix_type,
        "detail": detail
    })
    files_modified.add(str(file_path))


def fix_js_paths():
    """Fix MISSING_JS: wrong relative path depth for JS/CSS assets."""
    print("\n=== Fix 1: JS/CSS Path Depth ===")

    # Load audit report to find affected files
    report_path = RESULTS_DIR / "audit_report.json"
    with open(report_path, 'r', encoding='utf-8') as f:
        report = json.load(f)

    count = 0
    for rel_path, issues in report['files'].items():
        missing_js = [i for i in issues if 'MISSING_JS' in i or 'MISSING_CSS' in i]
        if not missing_js:
            continue

        file_path = CONTENT_ROOT / rel_path
        if not file_path.exists():
            continue

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Calculate correct path depth
        # File is at content/tic/cls7/module/file.html (4 levels deep from project root)
        # or content/tic/cls8/module/file.html
        # Assets are at [project_root]/assets/
        # So we need to go: file -> module -> cls -> tic -> content -> [root]
        # That's ../../../../.. wait, let me count properly

        # content/tic/cls7/m3-algoritmi-schema/lectia1.html
        # needs to get to: [root]/assets/js/
        # Up 1: m3-algoritmi-schema
        # Up 2: cls7
        # Up 3: tic
        # Up 4: content
        # Then: assets/js/
        # So: ../../../../assets/js/ is correct

        # The broken ones have ../../../assets/js/ (3 levels - wrong)
        # Fix: replace ../../../assets/ with ../../../../assets/ BUT only when it resolves wrong

        for issue in missing_js:
            # Extract the broken path from the issue
            match = re.search(r"'([^']+)'.*resolved: (.+)\)", issue)
            if not match:
                continue

            broken_path = match.group(1)
            resolved = match.group(2)

            # Check if adding one more ../ would fix it
            if '../../../assets/' in broken_path:
                fixed_path = broken_path.replace('../../../assets/', '../../../../assets/')
                # Verify the fixed path resolves correctly
                fixed_resolved = (file_path.parent / fixed_path).resolve()
                if fixed_resolved.exists():
                    content = content.replace(
                        f'"{broken_path}"', f'"{fixed_path}"'
                    ).replace(
                        f"'{broken_path}'", f"'{fixed_path}'"
                    )
                    log_fix(file_path, "MISSING_JS_FIX", f"Fixed path: {broken_path} -> {fixed_path}")
                    count += 1
                else:
                    print(f"  WARNING: Fixed path still doesn't resolve: {fixed_path} -> {fixed_resolved}")

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

    print(f"  Fixed {count} JS/CSS path issues")
    return count


def fix_module_mismatches():
    """Fix MODULE_MISMATCH: badge/breadcrumb text corrections."""
    print("\n=== Fix 2: Module Name Mismatches ===")

    fixes = {
        # cls8/m4-html-css/index.html: badge says "Modul 2" should say "Modul 4"
        str(CONTENT_ROOT / "tic" / "cls8" / "m4-html-css" / "index.html"): [
            ("MODUL 2", "MODUL 4"),
        ],
        # cls8/m5-proiecte-final/lectia4-evaluare-nationala.html: breadcrumb m4-recapitulare -> m5-proiecte-final
        str(CONTENT_ROOT / "tic" / "cls8" / "m5-proiecte-final" / "lectia4-evaluare-nationala.html"): [
            ("module: 'm4-recapitulare'", "module: 'm5-proiecte-final'"),
            ("moduleName: 'Modulul 4: Recapitulare'", "moduleName: 'Modulul 5: Proiecte Final'"),
        ],
        str(CONTENT_ROOT / "tic" / "cls8" / "m5-proiecte-final" / "lectia5-portofoliu-final.html"): [
            ("module: 'm4-recapitulare'", "module: 'm5-proiecte-final'"),
            ("moduleName: 'Modulul 4: Recapitulare'", "moduleName: 'Modulul 5: Proiecte Final'"),
        ],
        str(CONTENT_ROOT / "tic" / "cls8" / "m5-proiecte-final" / "lectia6-finalizare.html"): [
            ("module: 'm4-recapitulare'", "module: 'm5-proiecte-final'"),
            ("moduleName: 'Modulul 4: Recapitulare'", "moduleName: 'Modulul 5: Proiecte Final'"),
        ],
        # cls8/extra-structuri-date/index.html: breadcrumb m3-algoritmi-siruri -> extra-structuri-date
        str(CONTENT_ROOT / "tic" / "cls8" / "extra-structuri-date" / "index.html"): [
            ("module: 'm3-algoritmi-siruri'", "module: 'extra-structuri-date'"),
            ("moduleName: 'Modulul 3: Algoritmi si Siruri'", "moduleName: 'Extra: Structuri de Date'"),
        ],
    }

    count = 0
    for file_path, replacements in fixes.items():
        fp = Path(file_path)
        if not fp.exists():
            print(f"  SKIP: {fp} not found")
            continue

        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        for old, new in replacements:
            if old in content:
                content = content.replace(old, new)
                log_fix(fp, "MODULE_MISMATCH_FIX", f"'{old}' -> '{new}'")
                count += 1
            else:
                print(f"  WARNING: Could not find '{old}' in {fp.name}")

        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)

    print(f"  Fixed {count} module mismatch issues")
    return count


def fix_nav_links():
    """Fix NAV_BROKEN: navigation links between lessons."""
    print("\n=== Fix 3: Navigation Links ===")

    # Map of files with broken nav links and their fixes
    # We need to find what the correct filename is for each broken link
    nav_fixes = {}

    # cls5/m5-proiect/lectia4-organizare.html: links to lectia3-continut.html (doesn't exist)
    # Check what file IS there
    m5_dir = CONTENT_ROOT / "tic" / "cls5" / "m5-proiect"
    if m5_dir.exists():
        existing = [f.name for f in m5_dir.glob("lectia3*.html")]
        if existing:
            nav_fixes[str(m5_dir / "lectia4-organizare.html")] = [
                ("lectia3-continut.html", existing[0])
            ]

    # cls5/m5-proiect/lectia5-prezentare.html: links to lectia6-autoevaluare.html
    existing6 = [f.name for f in m5_dir.glob("lectia6*.html")] if m5_dir.exists() else []
    if existing6:
        nav_fixes[str(m5_dir / "lectia5-prezentare.html")] = [
            ("lectia6-autoevaluare.html", existing6[0])
        ]

    # cls5/m5-proiect/lectia6-evaluare.html: links to lectia5-finalizare.html
    existing5 = [f.name for f in m5_dir.glob("lectia5*.html")] if m5_dir.exists() else []
    if existing5:
        nav_fixes[str(m5_dir / "lectia6-evaluare.html")] = [
            ("lectia5-finalizare.html", existing5[0])
        ]

    # cls6/m1-prezentari/lectia1-powerpoint-intro.html: links to lectia2-slide-design.html
    m1_prez = CONTENT_ROOT / "tic" / "cls6" / "m1-prezentari"
    if m1_prez.exists():
        existing2 = [f.name for f in m1_prez.glob("lectia2*.html")]
        if existing2:
            nav_fixes[str(m1_prez / "lectia1-powerpoint-intro.html")] = [
                ("lectia2-slide-design.html", existing2[0])
            ]

    # cls6/m1-prezentari/lectia2-slide-uri.html: links to lectia1-introducere.html and lectia3-formatare-text.html
    existing1 = [f.name for f in m1_prez.glob("lectia1*.html")] if m1_prez.exists() else []
    existing3 = [f.name for f in m1_prez.glob("lectia3*.html")] if m1_prez.exists() else []
    if existing1 or existing3:
        fixes = []
        if existing1:
            fixes.append(("lectia1-introducere.html", existing1[0]))
        if existing3:
            fixes.append(("lectia3-formatare-text.html", existing3[0]))
        nav_fixes[str(m1_prez / "lectia2-slide-uri.html")] = fixes

    # cls6/m1-prezentari/lectia3-text-imagini.html: lectia2-slide-layout.html and lectia4-multimedia.html
    existing2b = [f.name for f in m1_prez.glob("lectia2*.html")] if m1_prez.exists() else []
    existing4 = [f.name for f in m1_prez.glob("lectia4*.html")] if m1_prez.exists() else []
    if existing2b or existing4:
        fixes = []
        if existing2b:
            fixes.append(("lectia2-slide-layout.html", existing2b[0]))
        if existing4:
            fixes.append(("lectia4-multimedia.html", existing4[0]))
        nav_fixes[str(m1_prez / "lectia3-text-imagini.html")] = fixes

    # cls6/m1-prezentari/lectia4-animatii.html: lectia3-obiecte-text.html
    if existing3:
        nav_fixes[str(m1_prez / "lectia4-animatii.html")] = [
            ("lectia3-obiecte-text.html", existing3[0])
        ]

    # cls6/m2-animatii-scratch/lectia3-evenimente.html: lectia2-sunete-animatii.html
    m2_scratch = CONTENT_ROOT / "tic" / "cls6" / "m2-animatii-scratch"
    if m2_scratch.exists():
        existing2c = [f.name for f in m2_scratch.glob("lectia2*.html")]
        if existing2c:
            nav_fixes[str(m2_scratch / "lectia3-evenimente.html")] = [
                ("lectia2-sunete-animatii.html", existing2c[0])
            ]

    # cls8/extra-structuri-date/lectia2-parcurgere.html: lectia3-algoritmi.html
    sd_dir = CONTENT_ROOT / "tic" / "cls8" / "extra-structuri-date"
    if sd_dir.exists():
        existing3d = [f.name for f in sd_dir.glob("lectia3*.html")]
        if existing3d:
            nav_fixes[str(sd_dir / "lectia2-parcurgere.html")] = [
                ("lectia3-algoritmi.html", existing3d[0])
            ]

    count = 0
    for file_path, replacements in nav_fixes.items():
        fp = Path(file_path)
        if not fp.exists():
            print(f"  SKIP: {fp.name} not found")
            continue

        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        for old_link, new_link in replacements:
            if old_link in content:
                content = content.replace(old_link, new_link)
                log_fix(fp, "NAV_FIX", f"'{old_link}' -> '{new_link}'")
                count += 1
                print(f"  Fixed: {fp.name}: {old_link} -> {new_link}")
            else:
                print(f"  WARNING: '{old_link}' not found in {fp.name}")

        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)

    print(f"  Fixed {count} navigation link issues")
    return count


def fix_index_quiz_links():
    """Fix broken quiz links in index files where quiz filenames don't match."""
    print("\n=== Fix 4: Index Quiz Links ===")

    count = 0

    # For each index with broken quiz links, find the actual quiz files
    index_fixes = {
        "tic/cls7/extra-baze-date/index.html": {
            "quizuri/quiz3-campuri.html": "quizuri/quiz3-tipuri.html",
            "quizuri/quiz4-chei.html": None,  # Check if exists
            "quizuri/quiz5-access.html": None,
        },
        "tic/cls8/extra-structuri-date/index.html": {
            "quizuri/quiz2-parcurgere.html": "quizuri/quiz2-declarare.html",
            "quizuri/quiz3-cautare.html": "quizuri/quiz3-parcurgere.html",
            "quizuri/quiz4-maxmin.html": "quizuri/quiz4-cautare.html",
        },
        "tic/cls8/m4-html-css/index.html": {
            "quizuri/quiz1-structura.html": "quizuri/quiz1-html-avansat.html",
            "quizuri/quiz2-text-imagini.html": "quizuri/quiz2-formulare.html",
            "quizuri/quiz3-linkuri.html": "quizuri/quiz3-css-avansat.html",
            "quizuri/quiz4-css.html": "quizuri/quiz4-layout.html",
            "quizuri/quiz5-layout.html": "quizuri/quiz5-responsive.html",
        },
        "tic/cls8/m5-proiecte-final/index.html": {
            "quizuri/quiz1-recapitulare-algoritmi.html": "quizuri/quiz1-algoritmi.html",
            "quizuri/quiz2-recapitulare-structuri.html": "quizuri/quiz2-structuri.html",
            "quizuri/quiz3-recapitulare-bd.html": "quizuri/quiz3-bd.html",
            "quizuri/quiz4-evaluare-nationala.html": "quizuri/quiz4-web.html",
            "quizuri/quiz5-evaluare-finala.html": "quizuri/quiz5-evaluare.html",
        },
    }

    for rel_index, link_map in index_fixes.items():
        fp = CONTENT_ROOT / rel_index
        if not fp.exists():
            print(f"  SKIP: {fp} not found")
            continue

        # Verify actual quiz files exist
        quiz_dir = fp.parent / "quizuri"
        actual_quizzes = set()
        if quiz_dir.exists():
            actual_quizzes = {f"quizuri/{f.name}" for f in quiz_dir.glob("*.html")}

        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        for broken_link, suggested_fix in link_map.items():
            if suggested_fix and suggested_fix in actual_quizzes:
                fix = suggested_fix
            elif suggested_fix is None:
                # Try to find a matching quiz
                quiz_num = re.search(r'quiz(\d+)', broken_link)
                if quiz_num:
                    matches = [q for q in actual_quizzes if f"quiz{quiz_num.group(1)}" in q]
                    fix = matches[0] if matches else None
                else:
                    fix = None
            else:
                fix = suggested_fix

            if fix and broken_link in content:
                content = content.replace(broken_link, fix)
                log_fix(fp, "INDEX_LINK_FIX", f"'{broken_link}' -> '{fix}'")
                count += 1
                print(f"  Fixed: {fp.name}: {broken_link} -> {fix}")

        if content != original:
            with open(fp, 'w', encoding='utf-8') as f:
                f.write(content)

    print(f"  Fixed {count} index quiz link issues")
    return count


def fix_content_index_ref():
    """Fix references to ../../../index.html (content/index.html doesn't exist)."""
    print("\n=== Fix 5: Root Index References ===")

    count = 0
    # Find files referencing content/index.html
    for root, dirs, files in os.walk(CONTENT_ROOT):
        for fname in files:
            if not fname.endswith('.html'):
                continue
            fp = Path(root) / fname
            with open(fp, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check for the known broken root index pattern
            # ../../../index.html should be ../../../../index.html or just index.html of the parent
            if '../../../index.html' in content:
                resolved = (fp.parent / '../../../index.html').resolve()
                if not resolved.exists():
                    # Try one more level
                    correct_path = '../../../../index.html'
                    correct_resolved = (fp.parent / correct_path).resolve()
                    if correct_resolved.exists():
                        content = content.replace('../../../index.html', correct_path)
                        with open(fp, 'w', encoding='utf-8') as f:
                            f.write(content)
                        log_fix(fp, "ROOT_INDEX_FIX", f"../../../index.html -> {correct_path}")
                        count += 1

    print(f"  Fixed {count} root index references")
    return count


def main():
    print("LearningHub Issue Fixer")
    print("=" * 50)

    total = 0
    total += fix_js_paths()
    total += fix_module_mismatches()
    total += fix_nav_links()
    total += fix_index_quiz_links()
    total += fix_content_index_ref()

    print(f"\n{'='*50}")
    print(f"TOTAL FIXES: {total}")
    print(f"FILES MODIFIED: {len(files_modified)}")

    # Save fix log
    fix_log_path = RESULTS_DIR / "fix_log.json"
    with open(fix_log_path, 'w', encoding='utf-8') as f:
        json.dump({
            "total_fixes": total,
            "files_modified": len(files_modified),
            "fixes": fixes_applied
        }, f, indent=2, ensure_ascii=False)

    print(f"\nFix log saved to: {fix_log_path}")
    print(f"\nRun audit_lessons.py again to verify remaining issues.")


if __name__ == '__main__':
    main()
