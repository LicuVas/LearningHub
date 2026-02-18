#!/usr/bin/env python3
"""
Fix placeholder learning outcomes (v2 pattern).

Replaces repeated "Sa aplici conceptele din aceasta lectie" placeholders
with real, topic-specific learning outcomes from outcomes_v2.json.

Usage:
    python fix_outcomes_v2.py scan        # Find files with this placeholder
    python fix_outcomes_v2.py apply --dry # Preview changes
    python fix_outcomes_v2.py apply       # Apply changes
"""

import sys
import json
import re
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
OUTCOMES_FILE = PROJECT_ROOT / "tools" / "outcomes_v2.json"

PLACEHOLDER = "Sa aplici conceptele din aceasta lectie"


def find_placeholder_files():
    """Find all files with the v2 placeholder pattern."""
    results = []
    for f in sorted(CONTENT_DIR.rglob('*.html')):
        text = f.read_text(encoding='utf-8', errors='replace')
        count = text.count(PLACEHOLDER)
        if count > 0:
            rel = f.relative_to(PROJECT_ROOT).as_posix()
            results.append((rel, count))
    return results


def apply_outcomes(dry_run=False):
    """Replace placeholder outcomes with real ones from JSON."""
    if not OUTCOMES_FILE.exists():
        print(f"ERROR: {OUTCOMES_FILE} not found.")
        return

    with open(OUTCOMES_FILE, 'r', encoding='utf-8') as f:
        outcomes_data = json.load(f)

    modified = 0
    total_replaced = 0

    for rel_path, new_outcomes in outcomes_data.items():
        filepath = PROJECT_ROOT / rel_path
        if not filepath.exists():
            print(f"SKIP (not found): {rel_path}")
            continue

        text = filepath.read_text(encoding='utf-8', errors='replace')
        if PLACEHOLDER not in text:
            print(f"SKIP (no placeholders): {rel_path}")
            continue

        # Find the learning-outcomes <ul> block and replace all placeholder <li> items
        # Pattern: multiple <li>Sa aplici conceptele din aceasta lectie</li> lines
        pattern = re.compile(
            r'(<h3>Dupa aceasta lectie vei putea:</h3>\s*<ul>\s*)'
            r'((?:\s*<li>Sa aplici conceptele din aceasta lectie</li>\s*)+)'
            r'(\s*</ul>)',
            re.DOTALL
        )

        match = pattern.search(text)
        if not match:
            print(f"WARNING: Could not match outcomes block in {rel_path}")
            continue

        # Build new <li> items
        new_li_items = '\n'.join(
            f'                <li>{outcome}</li>'
            for outcome in new_outcomes
        )

        new_block = match.group(1) + '\n' + new_li_items + '\n            ' + match.group(3)
        new_text = text[:match.start()] + new_block + text[match.end():]

        old_count = text.count(PLACEHOLDER)
        new_count = new_text.count(PLACEHOLDER)

        if new_count == 0 and new_text != text:
            modified += 1
            total_replaced += old_count

            if dry_run:
                print(f"  {rel_path}: {old_count} -> {len(new_outcomes)} outcomes")
                for o in new_outcomes[:2]:
                    print(f"    + {o}")
                if len(new_outcomes) > 2:
                    print(f"    + ... ({len(new_outcomes) - 2} more)")
            else:
                filepath.write_text(new_text, encoding='utf-8')
                print(f"OK: {rel_path} ({old_count} -> {len(new_outcomes)} outcomes)")
        else:
            print(f"WARNING: replacement incomplete in {rel_path} ({new_count} still remain)")

    action = "Would modify" if dry_run else "Modified"
    print(f"\n{action} {modified} files")
    print(f"Placeholder outcomes replaced: {total_replaced}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python fix_outcomes_v2.py [scan|apply|apply --dry]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == 'scan':
        files = find_placeholder_files()
        print(f"Files with v2 placeholder outcomes: {len(files)}\n")
        for rel, count in files:
            print(f"  {rel} ({count} placeholders)")
    elif cmd == 'apply':
        dry = '--dry' in sys.argv
        if dry:
            print("=== DRY RUN ===\n")
        apply_outcomes(dry_run=dry)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
