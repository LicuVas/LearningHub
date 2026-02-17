#!/usr/bin/env python3
"""
Phase 4: Quiz CSS Cleanup Script
Removes inline CSS, mobile-first.css, and footer from quiz files.
Preserves <style> blocks inside <script> tags (JS template literals).
"""

import os
import sys
import io
import re
import json
import argparse
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content"
LOG_FILE = PROJECT_ROOT / "tools" / "migration_log_quiz.json"


def find_quiz_files(grade=None):
    """Find all quiz HTML files in quizuri/ directories."""
    files = []
    search_dir = CONTENT_DIR / "tic"
    if grade:
        search_dir = search_dir / grade

    for root, dirs, filenames in os.walk(search_dir):
        if "quizuri" not in root:
            continue
        for f in sorted(filenames):
            if f.startswith("quiz") and f.endswith(".html"):
                files.append(os.path.join(root, f))
    return files


def cleanup_quiz(filepath, verbose=False, dry_run=False):
    """Clean up a single quiz file. Returns (changes_list, error_or_none)."""
    changes = []

    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Remove inline <style> blocks in <head> (NOT inside <script> tags)
    # Strategy: find <style>...</style> that appear BEFORE the first <script> tag
    head_match = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
    if head_match:
        head_content = head_match.group(1)
        style_blocks = list(re.finditer(r'\s*<style>.*?</style>\s*', head_content, re.DOTALL))
        if style_blocks:
            total_lines = 0
            new_head = head_content
            for block in reversed(style_blocks):
                lines = block.group().count('\n')
                total_lines += lines
                new_head = new_head[:block.start()] + '\n' + new_head[block.end():]
            content = content.replace(head_content, new_head)
            changes.append(f"Removed inline <style> block ({total_lines} lines)")

    # 2. Remove mobile-first.css link
    mobile_pattern = r'\s*<link[^>]*mobile-first\.css[^>]*>\s*'
    if re.search(mobile_pattern, content):
        content = re.sub(mobile_pattern, '\n', content)
        changes.append("Removed mobile-first.css link")

    # 3. Remove mobile.css link (also deprecated)
    mobile2_pattern = r'\s*<link[^>]*href="[^"]*css/mobile\.css"[^>]*>\s*'
    if re.search(mobile2_pattern, content):
        content = re.sub(mobile2_pattern, '\n', content)
        changes.append("Removed mobile.css link")

    # 4. Remove footer
    footer_pattern = r'\s*<footer>.*?</footer>\s*'
    if re.search(footer_pattern, content, re.DOTALL):
        content = re.sub(footer_pattern, '\n', content, flags=re.DOTALL)
        changes.append("Removed footer")

    # 5. Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    if not changes:
        return [], None

    if verbose:
        rel = os.path.relpath(filepath, PROJECT_ROOT)
        print(f"  {'DRY-RUN' if dry_run else 'CLEANUP'}: {rel} ({len(changes)} changes)")
        for c in changes:
            print(f"           {c}")

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return changes, None


def main():
    parser = argparse.ArgumentParser(description="Phase 4: Quiz CSS Cleanup")
    parser.add_argument('--grade', choices=['cls5', 'cls6', 'cls7', 'cls8'],
                        help='Process only this grade')
    parser.add_argument('--all', action='store_true', help='Process all grades')
    parser.add_argument('--single', help='Process a single file')
    parser.add_argument('--dry-run', action='store_true', help='Preview without writing')
    parser.add_argument('--verbose', action='store_true', help='Show details')
    args = parser.parse_args()

    if args.single:
        files = [args.single]
    elif args.grade:
        files = find_quiz_files(args.grade)
    elif args.all:
        files = find_quiz_files()
    else:
        parser.print_help()
        return

    print(f"Processing {len(files)} quiz files...")
    print("=" * 60)

    results = {"migrated": 0, "skipped": 0, "errors": 0}
    log_entries = []

    for filepath in files:
        try:
            changes, error = cleanup_quiz(filepath, args.verbose, args.dry_run)
            if error:
                results["errors"] += 1
                log_entries.append({"file": filepath, "error": str(error)})
            elif changes:
                results["migrated"] += 1
                log_entries.append({
                    "file": os.path.relpath(filepath, PROJECT_ROOT),
                    "changes": changes
                })
            else:
                results["skipped"] += 1
                if args.verbose:
                    rel = os.path.relpath(filepath, PROJECT_ROOT)
                    print(f"  SKIP: {rel} (already clean)")
        except Exception as e:
            results["errors"] += 1
            rel = os.path.relpath(filepath, PROJECT_ROOT)
            print(f"  ERROR: {rel}: {e}")
            log_entries.append({"file": rel, "error": str(e)})

    print("=" * 60)
    print(f"Results: {results['migrated']} cleaned, {results['skipped']} skipped, {results['errors']} errors")

    if not args.dry_run:
        with open(LOG_FILE, 'w', encoding='utf-8') as f:
            json.dump(log_entries, f, indent=2, ensure_ascii=False)
        print(f"Log saved to: {LOG_FILE}")


if __name__ == "__main__":
    main()
