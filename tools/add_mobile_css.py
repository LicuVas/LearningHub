#!/usr/bin/env python3
"""Add mobile.css link to all HTML files in LearningHub."""

import os
import re
from pathlib import Path

def get_relative_path(html_path, css_path):
    """Calculate relative path from HTML file to CSS file."""
    html_dir = os.path.dirname(html_path)
    return os.path.relpath(css_path, html_dir).replace('\\', '/')

def add_mobile_css_to_file(html_path, css_path):
    """Add mobile CSS link to a single HTML file."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if mobile.css is already linked
    if 'mobile.css' in content:
        return False, "Already has mobile.css"

    # Calculate relative path
    rel_path = get_relative_path(html_path, css_path)
    css_link = f'    <link rel="stylesheet" href="{rel_path}">\n'

    # Find the closing </head> tag and insert before it
    if '</head>' in content:
        # Insert the link right before </head>
        new_content = content.replace('</head>', css_link + '</head>')

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, f"Added: {rel_path}"
    else:
        return False, "No </head> tag found"

def main():
    base_dir = Path(r'C:\AI\Projects\LearningHub')
    css_path = base_dir / 'assets' / 'css' / 'mobile.css'

    # Find all HTML files
    html_files = list(base_dir.rglob('*.html'))

    # Skip files in .git, sync, and tools directories
    skip_dirs = ['.git', 'sync', 'tools']
    html_files = [f for f in html_files if not any(d in str(f) for d in skip_dirs)]

    print(f"Found {len(html_files)} HTML files to process")
    print("-" * 50)

    updated = 0
    skipped = 0
    errors = 0

    for html_file in sorted(html_files):
        try:
            success, message = add_mobile_css_to_file(str(html_file), str(css_path))
            rel_file = html_file.relative_to(base_dir)

            if success:
                print(f"[OK] {rel_file}")
                updated += 1
            else:
                if "Already has" in message:
                    skipped += 1
                else:
                    print(f"[ERR] {rel_file}: {message}")
                    errors += 1
        except Exception as e:
            print(f"[ERR] {html_file}: {e}")
            errors += 1

    print("-" * 50)
    print(f"Updated: {updated}")
    print(f"Skipped (already has mobile.css): {skipped}")
    print(f"Errors: {errors}")

if __name__ == '__main__':
    main()
