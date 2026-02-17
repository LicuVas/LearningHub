#!/usr/bin/env python3
"""
Phase 5: Clean remaining HTML files (index, presentations, unmigrated lessons).
Removes: inline CSS in <head>, mobile-first.css, mobile.css, footer tags.
"""

import os
import sys
import io
import re
import json
import argparse
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content"


def find_files():
    """Find all HTML files that still need cleanup."""
    files = []
    for root, dirs, filenames in os.walk(CONTENT_DIR):
        if "quizuri" in root:
            continue  # Already cleaned in Phase 4
        for f in sorted(filenames):
            if not f.endswith(".html"):
                continue
            path = os.path.join(root, f)
            with open(path, encoding='utf-8') as fh:
                content = fh.read()
            needs_work = False
            head = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
            if head and '<style>' in head.group(1):
                needs_work = True
            if 'mobile-first.css' in content:
                needs_work = True
            if re.search(r'^\s*<footer>', content, re.MULTILINE):
                needs_work = True
            if needs_work:
                files.append(path)
    return files


def cleanup_file(filepath, verbose=False, dry_run=False):
    """Clean a single file. Returns list of changes."""
    changes = []

    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    # 1. Remove inline <style> in <head>
    head_match = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
    if head_match:
        head_content = head_match.group(1)
        style_blocks = list(re.finditer(r'\s*<style>.*?</style>\s*', head_content, re.DOTALL))
        if style_blocks:
            total_lines = sum(b.group().count('\n') for b in style_blocks)
            new_head = head_content
            for block in reversed(style_blocks):
                new_head = new_head[:block.start()] + '\n' + new_head[block.end():]
            content = content.replace(head_content, new_head)
            changes.append(f"Removed inline CSS ({total_lines} lines)")

    # 2. Remove mobile-first.css
    pattern = r'\s*<link[^>]*mobile-first\.css[^>]*>\s*'
    if re.search(pattern, content):
        content = re.sub(pattern, '\n', content)
        changes.append("Removed mobile-first.css")

    # 3. Remove mobile.css
    pattern2 = r'\s*<link[^>]*href="[^"]*css/mobile\.css"[^>]*>\s*'
    if re.search(pattern2, content):
        content = re.sub(pattern2, '\n', content)
        changes.append("Removed mobile.css")

    # 4. Remove footer
    footer_pattern = r'\s*<footer>.*?</footer>\s*'
    if re.search(footer_pattern, content, re.DOTALL):
        content = re.sub(footer_pattern, '\n', content, flags=re.DOTALL)
        changes.append("Removed footer")

    # 5. Clean blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if changes:
        rel = os.path.relpath(filepath, PROJECT_ROOT)
        if verbose:
            print(f"  {'DRY-RUN' if dry_run else 'CLEAN'}: {rel} ({len(changes)} changes)")
            for c in changes:
                print(f"           {c}")
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

    return changes


def main():
    parser = argparse.ArgumentParser(description="Phase 5: Clean remaining HTML files")
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--verbose', action='store_true')
    args = parser.parse_args()

    files = find_files()
    print(f"Found {len(files)} files needing cleanup...")
    print("=" * 60)

    cleaned = 0
    for filepath in files:
        changes = cleanup_file(filepath, args.verbose, args.dry_run)
        if changes:
            cleaned += 1

    print("=" * 60)
    print(f"Results: {cleaned} files cleaned")


if __name__ == "__main__":
    main()
