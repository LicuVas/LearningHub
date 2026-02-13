#!/usr/bin/env python3
"""
extract_css.py - Extract common inline CSS from LearningHub lesson files
into shared external stylesheets.

Walks all HTML files in content/tic/, detects format (5-step, atomic, quiz),
replaces inline <style> blocks with <link> tags to shared CSS files,
and keeps any unique per-lesson CSS in a small remaining <style> block.

Usage:
    python tools/extract_css.py              # Dry run (preview changes)
    python tools/extract_css.py --apply      # Apply changes to files
    python tools/extract_css.py --apply --verbose  # Apply with details
"""

import os
import re
import sys
import argparse
from pathlib import Path


# Project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
CSS_DIR = PROJECT_ROOT / "assets" / "css"

# Shared CSS files
CSS_FILES = {
    "5step": "lesson-5step.css",
    "atomic": "lesson-atomic.css",
    "quiz": "quiz-gamified.css",
}


def load_canonical_css(css_file_path):
    """Load a canonical CSS file and parse it into normalized rule blocks."""
    with open(css_file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return parse_css_to_rules(content)


def parse_css_to_rules(css_text):
    """Parse CSS text into a set of normalized rule blocks for comparison.

    Returns a set of normalized (whitespace-collapsed) rule strings.
    Each rule includes its selector and body, and @media blocks are kept whole.
    """
    rules = set()
    blocks = split_css_blocks(css_text)
    for block in blocks:
        normalized = normalize_css(block)
        if normalized:
            rules.add(normalized)
    return rules


def split_css_blocks(css_text):
    """Split CSS text into top-level blocks (rules and @media queries).

    Handles nested braces for @media, @keyframes, etc.
    """
    blocks = []
    depth = 0
    current = []
    in_comment = False
    i = 0

    while i < len(css_text):
        c = css_text[i]

        # Handle comments
        if not in_comment and i + 1 < len(css_text) and css_text[i:i+2] == '/*':
            in_comment = True
            current.append(c)
            i += 1
            continue

        if in_comment and i + 1 < len(css_text) and css_text[i:i+2] == '*/':
            in_comment = False
            current.append(c)
            i += 1
            current.append(css_text[i])
            i += 1
            continue

        if in_comment:
            current.append(c)
            i += 1
            continue

        if c == '{':
            depth += 1
            current.append(c)
        elif c == '}':
            depth -= 1
            current.append(c)
            if depth == 0:
                block = ''.join(current).strip()
                if block:
                    blocks.append(block)
                current = []
        else:
            current.append(c)

        i += 1

    # Any remaining content (shouldn't happen in well-formed CSS)
    remaining = ''.join(current).strip()
    if remaining:
        blocks.append(remaining)

    return blocks


def normalize_css(css_text):
    """Normalize CSS whitespace for comparison purposes."""
    # Remove comments
    text = re.sub(r'/\*.*?\*/', '', css_text, flags=re.DOTALL)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def detect_format(html_content, file_path):
    """Detect which format a lesson file uses.

    Returns: '5step', 'atomic', 'quiz', or None (for index/other files)
    """
    # Extract the style block
    m = re.search(r'<style>(.*?)</style>', html_content, re.DOTALL)
    if not m:
        return None

    css = m.group(1)
    path_str = str(file_path)
    filename = os.path.basename(path_str).lower()

    # Quiz detection: in quizuri folder or filename contains 'quiz'
    if 'quizuri' in path_str or filename.startswith('quiz'):
        return 'quiz'

    # 5-step detection: has progress-steps or GOAL SECTION comment
    if '.progress-steps' in css or 'GOAL SECTION' in css:
        return '5step'

    # Atomic detection: has .atom class
    if '.atom' in css or 'atom-' in css:
        return 'atomic'

    # Index/navigation pages - skip
    if filename == 'index.html':
        return None

    return None


def compute_relative_path(html_file_path, css_dir):
    """Compute relative path from an HTML file to the CSS directory."""
    html_dir = Path(html_file_path).parent
    try:
        rel = os.path.relpath(css_dir, html_dir)
        # Normalize to forward slashes for HTML
        return rel.replace('\\', '/')
    except ValueError:
        # Different drives on Windows
        return None


def find_unique_css(inline_css, canonical_rules):
    """Find CSS rules in inline_css that are NOT in the canonical set.

    Returns the unique CSS as a string, or empty string if all rules are common.
    """
    inline_blocks = split_css_blocks(inline_css)
    unique_blocks = []

    for block in inline_blocks:
        normalized = normalize_css(block)
        if not normalized:
            continue
        if normalized not in canonical_rules:
            unique_blocks.append(block)

    if not unique_blocks:
        return ""

    return "\n\n".join(unique_blocks)


def process_file(html_path, canonical_css, dry_run=True, verbose=False):
    """Process a single HTML file.

    Returns a dict with processing results.
    """
    result = {
        'path': str(html_path),
        'format': None,
        'action': 'skipped',
        'original_css_lines': 0,
        'remaining_css_lines': 0,
        'lines_saved': 0,
        'error': None,
    }

    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        result['error'] = str(e)
        return result

    # Check if already has a link to our shared CSS
    for css_file in CSS_FILES.values():
        if css_file in content:
            result['action'] = 'already_converted'
            return result

    # Detect format
    fmt = detect_format(content, html_path)
    result['format'] = fmt

    if fmt is None:
        return result

    # Extract inline CSS
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if not style_match:
        return result

    inline_css = style_match.group(1)
    original_lines = len(inline_css.strip().split('\n'))
    result['original_css_lines'] = original_lines

    # Get canonical rules for this format
    canon_rules = canonical_css[fmt]

    # Find unique CSS
    unique_css = find_unique_css(inline_css, canon_rules)
    remaining_lines = len(unique_css.strip().split('\n')) if unique_css.strip() else 0
    result['remaining_css_lines'] = remaining_lines
    result['lines_saved'] = original_lines - remaining_lines

    # Compute relative path to CSS directory
    rel_path = compute_relative_path(html_path, CSS_DIR)
    if rel_path is None:
        result['error'] = 'Cannot compute relative path'
        return result

    css_filename = CSS_FILES[fmt]
    link_tag = f'<link rel="stylesheet" href="{rel_path}/{css_filename}">'

    # Build replacement
    if unique_css.strip():
        # Keep unique CSS in a small style block
        replacement = f'{link_tag}\n    <style>\n        /* Lesson-specific styles */\n{unique_css}\n    </style>'
    else:
        replacement = link_tag

    # Replace in content: replace the <style>...</style> block
    # We need to replace the full <style>...</style> with our link + optional small style
    new_content = content[:style_match.start()] + replacement + content[style_match.end():]

    # But wait - we matched inside the <style> tags. We need to match the tags too.
    # Re-do: match the full <style>...</style> including tags
    full_style_match = re.search(r'<style>.*?</style>', content, re.DOTALL)
    if not full_style_match:
        result['error'] = 'Could not match full style block'
        return result

    new_content = content[:full_style_match.start()] + replacement + content[full_style_match.end():]

    result['action'] = 'would_convert' if dry_run else 'converted'

    if not dry_run:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    if verbose:
        print(f"  [{fmt}] {os.path.relpath(html_path, CONTENT_DIR)}")
        print(f"    CSS: {original_lines} -> {remaining_lines} lines ({result['lines_saved']} saved)")
        print(f"    Link: {link_tag}")
        if unique_css.strip():
            # Show first few unique selectors
            unique_sels = re.findall(r'([^{]+)\{', unique_css)
            if unique_sels:
                print(f"    Unique rules kept: {len(unique_sels)}")
                for sel in unique_sels[:3]:
                    print(f"      - {sel.strip()[:60]}")
                if len(unique_sels) > 3:
                    print(f"      ... and {len(unique_sels) - 3} more")

    return result


def main():
    parser = argparse.ArgumentParser(description='Extract common CSS from LearningHub lesson files')
    parser.add_argument('--apply', action='store_true', help='Apply changes (default: dry run)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Show detailed output')
    args = parser.parse_args()

    dry_run = not args.apply

    if dry_run:
        print("=" * 60)
        print("DRY RUN - No files will be modified")
        print("Run with --apply to make changes")
        print("=" * 60)
    else:
        print("=" * 60)
        print("APPLYING CHANGES - Files will be modified")
        print("=" * 60)

    print()

    # Verify CSS files exist
    for fmt, css_file in CSS_FILES.items():
        css_path = CSS_DIR / css_file
        if not css_path.exists():
            print(f"ERROR: Shared CSS file not found: {css_path}")
            sys.exit(1)
        print(f"Loaded {fmt} CSS: {css_path} ({sum(1 for _ in open(css_path))} lines)")

    print()

    # Load canonical CSS rules
    canonical_css = {}
    for fmt, css_file in CSS_FILES.items():
        css_path = CSS_DIR / css_file
        canonical_css[fmt] = load_canonical_css(css_path)
        print(f"  {fmt}: {len(canonical_css[fmt])} unique rule blocks")

    print()

    # Walk all HTML files
    results = {
        'skipped': 0,
        'already_converted': 0,
        'converted': 0,
        'would_convert': 0,
        'errors': 0,
        'by_format': {'5step': 0, 'atomic': 0, 'quiz': 0},
        'total_lines_saved': 0,
        'total_original_lines': 0,
    }

    html_files = []
    for root, dirs, files in os.walk(CONTENT_DIR):
        for f in sorted(files):
            if f.endswith('.html'):
                html_files.append(Path(root) / f)

    print(f"Found {len(html_files)} HTML files to process")
    print()

    for html_path in html_files:
        result = process_file(html_path, canonical_css, dry_run=dry_run, verbose=args.verbose)

        if result['error']:
            results['errors'] += 1
            if args.verbose:
                print(f"  ERROR: {html_path}: {result['error']}")
        elif result['action'] == 'skipped':
            results['skipped'] += 1
        elif result['action'] == 'already_converted':
            results['already_converted'] += 1
        elif result['action'] in ('converted', 'would_convert'):
            action_key = result['action']
            results[action_key] += 1
            if result['format']:
                results['by_format'][result['format']] += 1
            results['total_lines_saved'] += result['lines_saved']
            results['total_original_lines'] += result['original_css_lines']

    # Summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)

    action_word = "Would convert" if dry_run else "Converted"
    action_key = "would_convert" if dry_run else "converted"

    print(f"  Total HTML files scanned: {len(html_files)}")
    print(f"  {action_word}: {results[action_key]}")
    print(f"    - 5-step lessons: {results['by_format']['5step']}")
    print(f"    - Atomic lessons: {results['by_format']['atomic']}")
    print(f"    - Quiz files: {results['by_format']['quiz']}")
    print(f"  Already converted: {results['already_converted']}")
    print(f"  Skipped (index/other): {results['skipped']}")
    print(f"  Errors: {results['errors']}")
    print()
    print(f"  Total inline CSS lines: {results['total_original_lines']}")
    print(f"  Lines saved: {results['total_lines_saved']}")
    if results['total_original_lines'] > 0:
        pct = (results['total_lines_saved'] / results['total_original_lines']) * 100
        print(f"  Reduction: {pct:.1f}%")

    print()
    if dry_run:
        print("To apply changes, run: python tools/extract_css.py --apply")


if __name__ == '__main__':
    main()
