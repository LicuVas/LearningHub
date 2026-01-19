#!/usr/bin/env python3
"""
Upgrade HTML files to mobile-first standards
- Add mobile-first.css link
- Add skip-to-content link
- Add id="main-content" to main content area
- Add loading="lazy" to images
"""

import os
import re
from pathlib import Path

def upgrade_html_file(file_path):
    """Upgrade a single HTML file with mobile-first improvements"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changes = []
    original_content = content

    # 1. Add mobile-first.css after mobile.css
    if 'mobile-first.css' not in content and 'mobile.css' in content:
        content = re.sub(
            r'(<link[^>]*mobile\.css[^>]*>)',
            r'\1\n    <link rel="stylesheet" href="\g<0>/../mobile-first.css">',
            content
        )
        # Fix the path based on depth
        depth = str(file_path).count('content') + str(file_path).count('hub')
        if 'content/tic/cls' in str(file_path):
            # Calculate relative path depth
            rel_parts = str(file_path).replace('\\', '/').split('/')
            try:
                content_idx = rel_parts.index('content')
                depth = len(rel_parts) - content_idx - 1  # -1 for file name
                dots = '../' * depth
                css_path = f'{dots}assets/css/mobile-first.css'
            except:
                css_path = '../../../../assets/css/mobile-first.css'
        elif 'hub/' in str(file_path):
            rel_parts = str(file_path).replace('\\', '/').split('/')
            try:
                hub_idx = rel_parts.index('hub')
                depth = len(rel_parts) - hub_idx - 1
                dots = '../' * depth
                css_path = f'{dots}assets/css/mobile-first.css'
            except:
                css_path = '../assets/css/mobile-first.css'
        else:
            css_path = 'assets/css/mobile-first.css'

        # Replace the broken attempt with correct one
        content = re.sub(
            r'<link rel="stylesheet" href="[^"]*mobile-first\.css">',
            '',
            content
        )
        content = re.sub(
            r'(<link[^>]*mobile\.css[^>]*>)',
            rf'\1\n    <link rel="stylesheet" href="{css_path}">',
            content
        )
        changes.append('Added mobile-first.css')

    # 2. Add skip-to-content link after <body> if not present
    if '<a href="#main-content"' not in content and '<body' in content:
        content = re.sub(
            r'(<body[^>]*>)',
            r'\1\n    <a href="#main-content" class="skip-link">Sari la continut</a>',
            content
        )
        changes.append('Added skip-to-content link')

    # 3. Add id="main-content" to first .container or main content div
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

    # 4. Add loading="lazy" to images that don't have it
    def add_lazy_loading(match):
        img_tag = match.group(0)
        if 'loading=' in img_tag:
            return img_tag
        # Insert loading="lazy" before >
        return img_tag[:-1] + ' loading="lazy">'

    img_pattern = r'<img[^>]+>'
    new_content = re.sub(img_pattern, add_lazy_loading, content)
    if new_content != content:
        content = new_content
        changes.append('Added lazy loading to images')

    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes

    return False, ['No changes needed']

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
                success, changes = upgrade_html_file(html_file)
                rel_path = html_file.relative_to(base_path)
                if success:
                    print(f"UPDATED: {rel_path}")
                    for change in changes:
                        print(f"  - {change}")
                    updated += 1
                else:
                    print(f"SKIP: {rel_path}")
                    skipped += 1
            except Exception as e:
                print(f"ERROR: {html_file} - {e}")
                errors += 1

    # Also update index.html
    index_file = base_path / 'index.html'
    if index_file.exists():
        try:
            success, changes = upgrade_html_file(index_file)
            if success:
                print(f"UPDATED: index.html")
                for change in changes:
                    print(f"  - {change}")
                updated += 1
        except Exception as e:
            print(f"ERROR: index.html - {e}")
            errors += 1

    print(f"\n=== Summary ===")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()
