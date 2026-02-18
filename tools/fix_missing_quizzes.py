#!/usr/bin/env python3
"""
Add quiz questions to atoms that are missing them.

Reads quiz data from quiz_data.json and adds data-quiz attributes
to <div class="atom" id="atom-N"> elements, or atom-quiz divs for atom-card format.

Usage:
    python fix_missing_quizzes.py scan        # Find atoms without quizzes
    python fix_missing_quizzes.py apply --dry # Preview changes
    python fix_missing_quizzes.py apply       # Apply changes
"""

import sys
import json
import re
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_ROOT = Path(__file__).parent.parent
CONTENT_DIR = PROJECT_ROOT / "content" / "tic"
QUIZ_FILE = PROJECT_ROOT / "tools" / "quiz_data.json"


def find_missing_quizzes():
    """Find all lesson files with atoms but no quizzes."""
    results = []
    for f in sorted(CONTENT_DIR.rglob('lectia*.html')):
        text = f.read_text(encoding='utf-8', errors='replace')
        atoms_card = len(re.findall(r'class="atom-card"', text))
        atoms_plain = len(re.findall(r'<div class="atom"[^-]', text))
        total_atoms = atoms_card + atoms_plain
        quiz_data = len(re.findall(r'data-quiz=', text))
        quiz_div = len(re.findall(r'class="atom-quiz"', text))
        total_quizzes = quiz_data + quiz_div

        if total_atoms > 0 and total_quizzes == 0:
            rel = f.relative_to(PROJECT_ROOT).as_posix()
            fmt = 'atom-card' if atoms_card else 'atom'
            results.append((rel, total_atoms, fmt))
    return results


def apply_quizzes(dry_run=False):
    """Add quiz data to atom elements."""
    if not QUIZ_FILE.exists():
        print(f"ERROR: {QUIZ_FILE} not found.")
        return

    with open(QUIZ_FILE, 'r', encoding='utf-8') as f:
        quiz_data = json.load(f)

    # Skip metadata keys
    quiz_data = {k: v for k, v in quiz_data.items() if not k.startswith('_')}

    modified = 0
    quizzes_added = 0

    for rel_path, atoms_data in quiz_data.items():
        filepath = PROJECT_ROOT / rel_path
        if not filepath.exists():
            print(f"SKIP (not found): {rel_path}")
            continue

        text = filepath.read_text(encoding='utf-8', errors='replace')
        new_text = text
        file_quizzes = 0

        for atom_id, quiz_list in atoms_data.items():
            quiz_json = json.dumps(quiz_list, ensure_ascii=False)
            # Escape single quotes in JSON for HTML attribute
            quiz_json_escaped = quiz_json.replace("'", "&#39;")

            # Try format 1: <div class="atom" id="atom-N">
            atom_num = atom_id.replace('atom-', '')
            pattern = re.compile(
                r'(<div class="atom"\s+)(id="' + re.escape(atom_id) + r'")(>)'
            )
            match = pattern.search(new_text)
            if match:
                replacement = f'{match.group(1)}data-quiz=\'{quiz_json_escaped}\' {match.group(2)}{match.group(3)}'
                new_text = new_text[:match.start()] + replacement + new_text[match.end():]
                file_quizzes += 1
                continue

            # Try format 2: <div class="atom-card" data-atom="N">
            pattern2 = re.compile(
                r'(<div class="atom-card"\s+)(data-atom="' + re.escape(atom_num) + r'")(>)'
            )
            match2 = pattern2.search(new_text)
            if match2:
                # For atom-card, add data-quiz attribute too
                replacement = f'{match2.group(1)}data-quiz=\'{quiz_json_escaped}\' {match2.group(2)}{match2.group(3)}'
                new_text = new_text[:match2.start()] + replacement + new_text[match2.end():]
                file_quizzes += 1
                continue

            print(f"  WARNING: Could not match {atom_id} in {rel_path}")

        if new_text != text:
            modified += 1
            quizzes_added += file_quizzes
            if dry_run:
                print(f"  {rel_path}: +{file_quizzes} quizzes")
            else:
                filepath.write_text(new_text, encoding='utf-8')
                print(f"OK: {rel_path} (+{file_quizzes} quizzes)")

    action = "Would modify" if dry_run else "Modified"
    print(f"\n{action} {modified} files")
    print(f"Quizzes added: {quizzes_added}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python fix_missing_quizzes.py [scan|apply|apply --dry]")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == 'scan':
        files = find_missing_quizzes()
        print(f"Files with atoms but no quizzes: {len(files)}\n")
        for rel, atoms, fmt in files:
            print(f"  {rel} ({atoms} atoms, format: {fmt})")
    elif cmd == 'apply':
        dry = '--dry' in sys.argv
        if dry:
            print("=== DRY RUN ===\n")
        apply_quizzes(dry_run=dry)
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
