#!/usr/bin/env python3
"""
Add evidence-system.js to all LearningHub lesson files.

This script searches for all lesson HTML files and adds the evidence-system.js
script tag before progress.js (which depends on it).

Usage:
    python add_evidence_script.py [--dry-run]
"""

import os
import re
import sys
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent.parent

# Content directory where lessons are stored
CONTENT_DIR = BASE_DIR / "content"

# The script tag to add
EVIDENCE_SCRIPT = '<script src="../../assets/js/evidence-system.js"></script>'

# Pattern to find progress.js script tag
PROGRESS_SCRIPT_PATTERN = r'(<script\s+src="[^"]*progress\.js"[^>]*></script>)'

def find_lesson_files():
    """Find all lesson HTML files in the content directory."""
    lesson_files = []

    if not CONTENT_DIR.exists():
        print(f"Error: Content directory not found: {CONTENT_DIR}")
        return lesson_files

    for html_file in CONTENT_DIR.rglob("lectia*.html"):
        lesson_files.append(html_file)

    return sorted(lesson_files)

def needs_evidence_script(content):
    """Check if the file needs the evidence script added."""
    # Already has evidence-system.js
    if "evidence-system.js" in content:
        return False

    # Has progress.js (we add before it)
    if "progress.js" in content:
        return True

    return False

def add_evidence_script(content):
    """Add the evidence-system.js script tag before progress.js."""
    # Find progress.js and add evidence-system.js before it
    new_content = re.sub(
        PROGRESS_SCRIPT_PATTERN,
        EVIDENCE_SCRIPT + r'\n    \1',
        content
    )
    return new_content

def process_file(file_path, dry_run=False):
    """Process a single lesson file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if not needs_evidence_script(content):
            return "skipped"

        new_content = add_evidence_script(content)

        if new_content == content:
            return "no_change"

        if dry_run:
            return "would_update"

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return "updated"

    except Exception as e:
        print(f"  Error: {e}")
        return "error"

def main():
    dry_run = "--dry-run" in sys.argv

    print("=" * 60)
    print("LearningHub - Add Evidence System Script")
    print("=" * 60)

    if dry_run:
        print("\n[DRY RUN MODE - No changes will be made]\n")

    lesson_files = find_lesson_files()

    if not lesson_files:
        print("No lesson files found!")
        return

    print(f"Found {len(lesson_files)} lesson files\n")

    stats = {
        "updated": 0,
        "skipped": 0,
        "error": 0,
        "would_update": 0,
        "no_change": 0
    }

    for file_path in lesson_files:
        rel_path = file_path.relative_to(BASE_DIR)
        result = process_file(file_path, dry_run)
        stats[result] += 1

        if result == "updated":
            print(f"  [UPDATED] {rel_path}")
        elif result == "would_update":
            print(f"  [WOULD UPDATE] {rel_path}")
        elif result == "error":
            print(f"  [ERROR] {rel_path}")
        # Don't print skipped files to reduce noise

    print("\n" + "=" * 60)
    print("Summary:")
    print(f"  Total files: {len(lesson_files)}")

    if dry_run:
        print(f"  Would update: {stats['would_update']}")
    else:
        print(f"  Updated: {stats['updated']}")

    print(f"  Skipped (already has script): {stats['skipped']}")
    print(f"  No progress.js found: {stats['no_change']}")
    print(f"  Errors: {stats['error']}")
    print("=" * 60)

    if dry_run and stats['would_update'] > 0:
        print("\nRun without --dry-run to apply changes.")

if __name__ == "__main__":
    main()
