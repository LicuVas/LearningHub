#!/usr/bin/env python3
"""
Fix Atomic Lessons - Batch repair script
==========================================

Fixes common issues in converted atomic lessons:
1. "trl +" -> "Ctrl +" (missing first letter)
2. Empty quiz options ["", "", ""]
3. Static "Felicitari!" atoms that should appear conditionally
4. Duplicate content atoms
5. Atoms with data-quiz='[]' (empty quizzes)

Usage:
    python fix_atomic_lessons.py --scan          # Scan and report issues
    python fix_atomic_lessons.py --fix           # Fix all issues
    python fix_atomic_lessons.py --fix <file>    # Fix specific file
"""

import os
import re
import sys
import json
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
import html

CONTENT_ROOT = Path(__file__).parent.parent / "content"


def scan_file(filepath: Path) -> dict:
    """Scan a file for common issues."""
    issues = {
        'trl_typo': 0,
        'empty_options': 0,
        'empty_quiz': 0,
        'felicitari_static': 0,
        'duplicate_atoms': 0,
        'details': []
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        issues['error'] = str(e)
        return issues

    # Check for "trl +" typo (not preceded by C, so not Ctrl)
    trl_matches = re.findall(r'(?<![Cc])trl\s*\+', content, re.IGNORECASE)
    issues['trl_typo'] = len(trl_matches)

    # Check for empty options
    empty_opts = re.findall(r'"options":\s*\["",\s*"",\s*""\]', content)
    issues['empty_options'] = len(empty_opts)

    # Check for empty quiz arrays
    empty_quiz = re.findall(r"data-quiz='\[\]'", content)
    issues['empty_quiz'] = len(empty_quiz)

    # Check for static Felicitari atom
    if re.search(r'class="atom-title"[^>]*>Felicitari', content):
        issues['felicitari_static'] = 1

    # Check for duplicate content by parsing
    soup = BeautifulSoup(content, 'html.parser')
    atoms = soup.find_all(class_='atom')

    contents = []
    for atom in atoms:
        content_div = atom.find(class_='atom-content')
        if content_div:
            text = ' '.join(content_div.get_text().split())[:200]  # First 200 chars
            if text in contents and len(text) > 50:
                issues['duplicate_atoms'] += 1
            contents.append(text)

    return issues


def fix_file(filepath: Path, dry_run: bool = False) -> dict:
    """Fix issues in a single file."""
    result = {
        'file': str(filepath),
        'status': 'unchanged',
        'fixes': []
    }

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        result['status'] = 'error'
        result['error'] = str(e)
        return result

    content = original_content

    # Fix 1: "trl +" -> "Ctrl +" (only when NOT preceded by C)
    # Pattern: standalone "trl" not part of "Ctrl"
    trl_pattern = r'(?<![Cc])trl\s*\+\s*([A-Za-z])'
    if re.search(trl_pattern, content, re.IGNORECASE):
        content = re.sub(trl_pattern, r'Ctrl + \1', content, flags=re.IGNORECASE)
        result['fixes'].append('Fixed trl -> Ctrl typos')

    # Also fix in JSON data attributes (standalone trl)
    content = re.sub(r'(?<![Cc])"trl \+ ([A-Za-z])"', r'"Ctrl + \1"', content)
    content = re.sub(r'(?<![Cc])"trl\+([A-Za-z])"', r'"Ctrl+\1"', content)

    # Fix 2: Empty options - need to analyze context and fix
    # For now, mark atoms with empty options for manual review
    # We can try to reconstruct from question context

    # Fix 3: Remove static "Felicitari!" atoms
    soup = BeautifulSoup(content, 'html.parser')
    modified_soup = False

    atoms = soup.find_all(class_='atom')
    atoms_to_remove = []

    for atom in atoms:
        title_el = atom.find(class_='atom-title')
        if title_el and 'Felicitari' in title_el.get_text():
            # Check if it has no quiz
            quiz_data = atom.get('data-quiz', '[]')
            if quiz_data == '[]' or quiz_data == '':
                atoms_to_remove.append(atom)

    for atom in atoms_to_remove:
        atom.decompose()
        modified_soup = True
        result['fixes'].append('Removed static Felicitari atom')

    # Fix 4: Remove duplicate consecutive atoms with same content
    atoms = soup.find_all(class_='atom')
    prev_content = None
    for atom in atoms:
        content_div = atom.find(class_='atom-content')
        if content_div:
            curr_content = ' '.join(content_div.get_text().split())[:200]
            if curr_content == prev_content and len(curr_content) > 50:
                atom.decompose()
                modified_soup = True
                result['fixes'].append('Removed duplicate atom')
            prev_content = curr_content

    # Fix 5: Renumber atoms after removal
    if modified_soup:
        atoms = soup.find_all(class_='atom')
        for i, atom in enumerate(atoms, 1):
            num_el = atom.find(class_='atom-number')
            if num_el:
                num_el.string = str(i)
            # Update id
            atom['id'] = f'atom-{i}'

    if modified_soup:
        content = str(soup)

    # Check if anything changed
    if content != original_content:
        result['status'] = 'fixed'
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

    return result


def fix_empty_options_in_file(filepath: Path) -> dict:
    """
    Attempt to fix empty options by analyzing the question context.
    This is harder and might need manual intervention.
    """
    result = {
        'file': str(filepath),
        'empty_options_found': 0,
        'fixed': 0
    }

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all atoms with empty options
    pattern = r'data-quiz=\'\[\{"question":\s*"([^"]+)",\s*"options":\s*\["",\s*"",\s*""\]'
    matches = re.findall(pattern, content)

    result['empty_options_found'] = len(matches)
    result['questions'] = matches

    return result


def scan_all(content_path: Path = CONTENT_ROOT) -> dict:
    """Scan all HTML files in content directory."""
    results = {
        'total_files': 0,
        'files_with_issues': 0,
        'total_issues': {
            'trl_typo': 0,
            'empty_options': 0,
            'empty_quiz': 0,
            'felicitari_static': 0,
            'duplicate_atoms': 0
        },
        'files': []
    }

    html_files = list(content_path.rglob('*.html'))
    # Filter to only lesson files
    html_files = [f for f in html_files if 'lectia' in f.name or 'quiz' in f.name]

    results['total_files'] = len(html_files)

    for filepath in sorted(html_files):
        issues = scan_file(filepath)

        has_issues = any([
            issues['trl_typo'],
            issues['empty_options'],
            issues['empty_quiz'],
            issues['felicitari_static'],
            issues['duplicate_atoms']
        ])

        if has_issues:
            results['files_with_issues'] += 1
            results['files'].append({
                'path': str(filepath.relative_to(content_path)),
                'issues': issues
            })

            # Aggregate totals
            for key in results['total_issues']:
                results['total_issues'][key] += issues.get(key, 0)

    return results


def fix_all(content_path: Path = CONTENT_ROOT, dry_run: bool = False) -> dict:
    """Fix all HTML files in content directory."""
    results = {
        'total_files': 0,
        'files_fixed': 0,
        'files_unchanged': 0,
        'files_error': 0,
        'details': []
    }

    html_files = list(content_path.rglob('*.html'))
    html_files = [f for f in html_files if 'lectia' in f.name or 'quiz' in f.name]

    results['total_files'] = len(html_files)

    for filepath in sorted(html_files):
        result = fix_file(filepath, dry_run)

        if result['status'] == 'fixed':
            results['files_fixed'] += 1
        elif result['status'] == 'error':
            results['files_error'] += 1
        else:
            results['files_unchanged'] += 1

        if result['fixes'] or result['status'] == 'error':
            results['details'].append(result)

    return results


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Fix atomic lesson issues')
    parser.add_argument('--scan', action='store_true', help='Scan and report issues')
    parser.add_argument('--fix', action='store_true', help='Fix all issues')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be fixed without changing files')
    parser.add_argument('file', nargs='?', help='Specific file to fix')

    args = parser.parse_args()

    if args.scan:
        print("Scanning for issues...")
        print("=" * 60)

        results = scan_all()

        print(f"Total files scanned: {results['total_files']}")
        print(f"Files with issues: {results['files_with_issues']}")
        print()
        print("Issue totals:")
        for issue, count in results['total_issues'].items():
            if count > 0:
                print(f"  - {issue}: {count}")
        print()

        if results['files']:
            print("Files with issues:")
            for f in results['files'][:20]:  # Show first 20
                issues_str = ', '.join([f"{k}:{v}" for k, v in f['issues'].items() if v and k != 'details'])
                print(f"  {f['path']}: {issues_str}")

            if len(results['files']) > 20:
                print(f"  ... and {len(results['files']) - 20} more files")

    elif args.fix:
        if args.file:
            filepath = Path(args.file)
            if not filepath.exists():
                print(f"File not found: {filepath}")
                return

            print(f"Fixing: {filepath}")
            result = fix_file(filepath, args.dry_run)
            print(f"Status: {result['status']}")
            if result['fixes']:
                for fix in result['fixes']:
                    print(f"  - {fix}")
        else:
            action = "Would fix" if args.dry_run else "Fixing"
            print(f"{action} all files...")
            print("=" * 60)

            results = fix_all(dry_run=args.dry_run)

            print(f"Total files: {results['total_files']}")
            print(f"Files fixed: {results['files_fixed']}")
            print(f"Files unchanged: {results['files_unchanged']}")
            print(f"Files with errors: {results['files_error']}")

            if results['details']:
                print()
                print("Details:")
                for detail in results['details'][:30]:
                    if detail['fixes']:
                        fixes = ', '.join(detail['fixes'])
                        print(f"  {Path(detail['file']).name}: {fixes}")

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
