#!/usr/bin/env python3
"""
Fix Empty Atoms - Remove or enhance atoms with empty quizzes
============================================================

This script handles atoms that have data-quiz='[]':
1. If atom content is minimal/placeholder -> Remove the atom
2. If atom content is substantial -> Keep and flag for review

Usage:
    python fix_empty_atoms.py --scan           # Scan and show what would be done
    python fix_empty_atoms.py --fix            # Fix all files
    python fix_empty_atoms.py --fix <file>     # Fix specific file
"""

import os
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

CONTENT_ROOT = Path(__file__).parent.parent / "content"

# Placeholder content patterns that indicate atom should be removed
PLACEHOLDER_PATTERNS = [
    r'^informatiile importante$',
    r'^concept \d+$',
    r'^retine$',
    r'^dupa ce termini',
    r'^hai sa descoperim',
    r'^felicitari',
    r'^rezumat$',
    r'^$',  # Empty
]

MIN_CONTENT_LENGTH = 50  # Minimum chars for substantial content


def is_placeholder_content(text: str) -> bool:
    """Check if content is just a placeholder."""
    text_clean = ' '.join(text.lower().split())

    if len(text_clean) < MIN_CONTENT_LENGTH:
        return True

    for pattern in PLACEHOLDER_PATTERNS:
        if re.match(pattern, text_clean, re.IGNORECASE):
            return True

    return False


def analyze_file(filepath: Path) -> dict:
    """Analyze a file for empty quiz atoms."""
    result = {
        'file': str(filepath),
        'total_atoms': 0,
        'empty_quiz_atoms': 0,
        'atoms_to_remove': [],
        'atoms_to_review': []
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        result['error'] = str(e)
        return result

    soup = BeautifulSoup(content, 'html.parser')
    atoms = soup.find_all(class_='atom')

    result['total_atoms'] = len(atoms)

    for atom in atoms:
        quiz_data = atom.get('data-quiz', '')

        # Check if empty quiz
        if quiz_data == '[]' or quiz_data == '':
            result['empty_quiz_atoms'] += 1

            # Get atom content
            content_div = atom.find(class_='atom-content')
            atom_text = ''
            if content_div:
                atom_text = ' '.join(content_div.get_text().split())

            title_el = atom.find(class_='atom-title')
            atom_title = title_el.get_text() if title_el else 'Unknown'

            atom_id = atom.get('id', 'unknown')

            if is_placeholder_content(atom_text):
                result['atoms_to_remove'].append({
                    'id': atom_id,
                    'title': atom_title,
                    'content_preview': atom_text[:100]
                })
            else:
                result['atoms_to_review'].append({
                    'id': atom_id,
                    'title': atom_title,
                    'content_preview': atom_text[:200]
                })

    return result


def fix_file(filepath: Path, dry_run: bool = False) -> dict:
    """Fix a file by removing placeholder atoms."""
    result = {
        'file': str(filepath),
        'status': 'unchanged',
        'atoms_removed': 0,
        'atoms_kept': 0
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        result['status'] = 'error'
        result['error'] = str(e)
        return result

    soup = BeautifulSoup(content, 'html.parser')
    atoms = soup.find_all(class_='atom')

    atoms_to_remove = []

    for atom in atoms:
        quiz_data = atom.get('data-quiz', '')

        if quiz_data == '[]' or quiz_data == '':
            content_div = atom.find(class_='atom-content')
            atom_text = ''
            if content_div:
                atom_text = ' '.join(content_div.get_text().split())

            if is_placeholder_content(atom_text):
                atoms_to_remove.append(atom)
            else:
                result['atoms_kept'] += 1

    if not atoms_to_remove:
        return result

    # Remove placeholder atoms
    for atom in atoms_to_remove:
        atom.decompose()
        result['atoms_removed'] += 1

    # Renumber remaining atoms
    remaining_atoms = soup.find_all(class_='atom')
    for i, atom in enumerate(remaining_atoms, 1):
        num_el = atom.find(class_='atom-number')
        if num_el:
            num_el.string = str(i)
        atom['id'] = f'atom-{i}'

    result['status'] = 'fixed'

    if not dry_run:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))

    return result


def scan_all():
    """Scan all files for analysis."""
    html_files = list(CONTENT_ROOT.rglob('*.html'))
    html_files = [f for f in html_files if 'lectia' in f.name]

    total_to_remove = 0
    total_to_review = 0
    files_needing_work = []

    for filepath in sorted(html_files):
        analysis = analyze_file(filepath)

        if analysis.get('atoms_to_remove') or analysis.get('atoms_to_review'):
            files_needing_work.append(analysis)
            total_to_remove += len(analysis.get('atoms_to_remove', []))
            total_to_review += len(analysis.get('atoms_to_review', []))

    print(f"Files needing work: {len(files_needing_work)}")
    print(f"Atoms to remove (placeholder): {total_to_remove}")
    print(f"Atoms to review (have content): {total_to_review}")
    print()

    for analysis in files_needing_work:
        rel_path = Path(analysis['file']).relative_to(CONTENT_ROOT)
        print(f"\n{rel_path}:")

        if analysis.get('atoms_to_remove'):
            print(f"  Remove ({len(analysis['atoms_to_remove'])}):")
            for atom in analysis['atoms_to_remove']:
                print(f"    - {atom['id']}: {atom['title'][:30]}")

        if analysis.get('atoms_to_review'):
            print(f"  Review ({len(analysis['atoms_to_review'])}):")
            for atom in analysis['atoms_to_review']:
                # Remove emojis/special chars for console output
                title = atom['title'][:30].encode('ascii', 'ignore').decode()
                preview = atom['content_preview'][:50].encode('ascii', 'ignore').decode()
                print(f"    - {atom['id']}: {title} - {preview}...")


def fix_all(dry_run: bool = False):
    """Fix all files."""
    html_files = list(CONTENT_ROOT.rglob('*.html'))
    html_files = [f for f in html_files if 'lectia' in f.name]

    fixed = 0
    unchanged = 0

    for filepath in sorted(html_files):
        result = fix_file(filepath, dry_run)

        if result['status'] == 'fixed':
            fixed += 1
            rel_path = Path(result['file']).relative_to(CONTENT_ROOT)
            print(f"Fixed: {rel_path} - removed {result['atoms_removed']} atoms")
        else:
            unchanged += 1

    print()
    print(f"Fixed: {fixed}, Unchanged: {unchanged}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Fix empty atoms')
    parser.add_argument('--scan', action='store_true', help='Scan and analyze')
    parser.add_argument('--fix', action='store_true', help='Fix files')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done')
    parser.add_argument('file', nargs='?', help='Specific file')

    args = parser.parse_args()

    if args.scan:
        scan_all()
    elif args.fix:
        if args.file:
            result = fix_file(Path(args.file), args.dry_run)
            print(f"Status: {result['status']}")
            if result['atoms_removed']:
                print(f"Atoms removed: {result['atoms_removed']}")
        else:
            fix_all(args.dry_run)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
