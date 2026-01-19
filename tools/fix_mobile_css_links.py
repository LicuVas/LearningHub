#!/usr/bin/env python3
"""
Fix mobile CSS links - remove duplicates and broken links, add correct mobile-first.css
"""

import os
import re
from pathlib import Path

def calculate_relative_path(file_path, base_path):
    """Calculate relative path to assets/css/ from file location"""
    rel_path = file_path.relative_to(base_path)
    parts = list(rel_path.parts)

    # Count how many directories deep we are
    depth = len(parts) - 1  # -1 for the filename itself

    if depth == 0:
        return 'assets/css/'
    else:
        return '../' * depth + 'assets/css/'

def fix_html_file(file_path, base_path):
    """Fix CSS links in a single HTML file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    changes = []

    # 1. Remove all broken/duplicate mobile-first.css links
    broken_patterns = [
        r'<link rel="stylesheet" href="[^"]*mobile-first\.css[^"]*">\n?\s*',
        r'<link rel="stylesheet" href="<link[^>]*>[^"]*">\n?\s*',
    ]
    for pattern in broken_patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, '', content)
            changes.append('Removed broken/duplicate CSS links')

    # 2. Calculate correct relative path
    css_base = calculate_relative_path(file_path, base_path)

    # 3. Fix mobile.css link if broken
    content = re.sub(
        r'<link rel="stylesheet" href="[^"]*mobile\.css[^"]*">',
        f'<link rel="stylesheet" href="{css_base}mobile.css">',
        content
    )

    # 4. Add mobile-first.css after mobile.css (if mobile.css exists and mobile-first.css doesn't)
    if 'mobile.css' in content and 'mobile-first.css' not in content:
        content = re.sub(
            r'(<link rel="stylesheet" href="[^"]*mobile\.css">)',
            rf'\1\n    <link rel="stylesheet" href="{css_base}mobile-first.css">',
            content
        )
        changes.append(f'Added mobile-first.css ({css_base}mobile-first.css)')

    # 5. Add mobile.css and mobile-first.css if neither exists (after </style> or before </head>)
    if 'mobile.css' not in content:
        # Try to add before </head>
        if '</head>' in content:
            css_links = f'''    <link rel="stylesheet" href="{css_base}mobile.css">
    <link rel="stylesheet" href="{css_base}mobile-first.css">
'''
            content = content.replace('</head>', css_links + '</head>')
            changes.append(f'Added mobile.css and mobile-first.css')

    # 6. Add skip-to-content link if missing
    if '<a href="#main-content"' not in content and '<body' in content:
        content = re.sub(
            r'(<body[^>]*>)',
            r'\1\n    <a href="#main-content" class="skip-link">Sari la continut</a>',
            content
        )
        changes.append('Added skip-to-content link')

    # 7. Add id="main-content" if missing
    if 'id="main-content"' not in content:
        # Try to find the main container div
        patterns = [
            (r'(<div class="container")', r'<div id="main-content" class="container"'),
            (r'(<main[^>]*)(>)', r'\1 id="main-content"\2'),
            (r'(<div class="loading-container")', r'<div id="main-content" class="loading-container"'),
        ]
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                changes.append('Added id="main-content"')
                break

    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes

    return False, ['No changes needed']

def main():
    base_path = Path(r"C:\AI\Projects\LearningHub")

    # Process all HTML files
    html_files = list(base_path.rglob('*.html'))

    # Filter out backup directories
    html_files = [f for f in html_files if '.pow-migration-backup' not in str(f)]

    updated = 0
    skipped = 0
    errors = 0

    for html_file in html_files:
        try:
            success, changes = fix_html_file(html_file, base_path)
            rel_path = html_file.relative_to(base_path)
            if success:
                print(f"FIXED: {rel_path}")
                for change in changes:
                    print(f"  - {change}")
                updated += 1
            else:
                # Only show skipped if verbose
                skipped += 1
        except Exception as e:
            print(f"ERROR: {html_file} - {e}")
            errors += 1

    print(f"\n=== Summary ===")
    print(f"Fixed: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()
