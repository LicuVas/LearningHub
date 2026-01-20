#!/usr/bin/env python3
"""
Lesson Upgrade Tool for LearningHub
====================================

Upgrades existing lessons to include:
- lesson-summary.js for grading (1-10 system)
- JSON export with SHA-256 checksum
- Download progress button

Does NOT convert to atomic format (that requires manual content restructuring).

Usage:
    python upgrade_lessons.py --all                    # Upgrade all lessons
    python upgrade_lessons.py --folder cls5/m1-sisteme # Upgrade specific folder
    python upgrade_lessons.py --file lectia1.html     # Upgrade single file
    python upgrade_lessons.py --dry-run --all         # Preview changes
"""

import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime

CONTENT_ROOT = Path(__file__).parent.parent / "content" / "tic"

# Files to skip (already atomic or special)
SKIP_PATTERNS = [
    '*-atomic.html',
    'index.html',
    'quiz*.html',
]

# Injection points
LESSON_SUMMARY_SCRIPT = '''
    <!-- Lesson Summary System (Grading + Export) -->
    <script src="../../../../assets/js/lesson-summary.js"></script>'''

LESSON_SUMMARY_INIT_TEMPLATE = '''
        // Initialize Lesson Summary for grading
        if (typeof LessonSummary !== 'undefined') {{
            LessonSummary.init('{lesson_id}');
        }}'''

DOWNLOAD_BUTTON = '''
        <!-- Lesson Summary & Export -->
        <div id="lesson-summary" style="display: none;"></div>

        <section class="section-card" style="margin-top: 2rem; text-align: center;">
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                Dupa ce termini lectia, poti descarca progresul pentru profesor.
            </p>
            <button onclick="downloadLessonProgress()" class="btn btn-primary" style="background: var(--accent-blue);">
                &#128190; Descarca progresul (JSON)
            </button>
        </section>'''

DOWNLOAD_FUNCTION_TEMPLATE = '''
        function downloadLessonProgress() {{
            if (typeof LessonSummary !== 'undefined') {{
                LessonSummary.downloadProgress('{lesson_id}-progres.json');
            }} else {{
                alert('Sistemul de export nu este disponibil.');
            }}
        }}'''


def should_skip(filepath: Path) -> bool:
    """Check if file should be skipped."""
    name = filepath.name
    for pattern in SKIP_PATTERNS:
        if pattern.startswith('*'):
            if name.endswith(pattern[1:]):
                return True
        elif name == pattern:
            return True
    return False


def extract_lesson_id(filepath: Path) -> str:
    """Generate lesson ID from filepath."""
    # Example: content/tic/cls5/m1-sisteme/lectia1.html -> cls5-m1-sisteme-lectia1
    parts = filepath.parts
    try:
        cls_idx = next(i for i, p in enumerate(parts) if p.startswith('cls'))
        cls = parts[cls_idx]
        module = parts[cls_idx + 1]
        lesson = filepath.stem
        return f"{cls}-{module}-{lesson}"
    except (StopIteration, IndexError):
        return filepath.stem


def is_already_upgraded(content: str) -> bool:
    """Check if lesson already has the upgrade."""
    return 'lesson-summary.js' in content or 'LessonSummary.init' in content


def upgrade_lesson(filepath: Path, dry_run: bool = False) -> dict:
    """
    Upgrade a single lesson file.
    Returns dict with status and details.
    """
    result = {
        'file': str(filepath),
        'status': 'skipped',
        'reason': None,
        'changes': []
    }

    if should_skip(filepath):
        result['reason'] = 'Matches skip pattern'
        return result

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        result['status'] = 'error'
        result['reason'] = str(e)
        return result

    if is_already_upgraded(content):
        result['reason'] = 'Already upgraded'
        return result

    # Check if it's a valid lesson file (supports multiple formats)
    is_valid_lesson = (
        '<section class="section-card">' in content or  # Format 1
        ('.section {' in content and 'goal-section' in content) or  # Format 2 (step-based)
        ('class="section"' in content) or  # Format 3
        ('quiz-option' in content)  # Has quiz = is a lesson
    )

    if not is_valid_lesson:
        result['reason'] = 'Not a standard lesson file'
        return result

    lesson_id = extract_lesson_id(filepath)
    modified = content
    changes = []

    # 1. Add lesson-summary.js script before </head> or before closing body scripts
    if 'lesson-summary.js' not in modified:
        # Find a good injection point - before user-system.js or before </body>
        if '<!-- User System -->' in modified:
            modified = modified.replace(
                '<!-- User System -->',
                LESSON_SUMMARY_SCRIPT + '\n\n    <!-- User System -->'
            )
            changes.append('Added lesson-summary.js script')
        elif '</body>' in modified:
            modified = modified.replace(
                '</body>',
                LESSON_SUMMARY_SCRIPT + '\n</body>'
            )
            changes.append('Added lesson-summary.js script')

    # 2. Add download button and summary container before bottom navigation
    if 'downloadLessonProgress' not in modified:
        # Find the bottom navigation div
        nav_pattern = r'(<!-- Navigation Bottom -->.*?</div>)'
        nav_match = re.search(nav_pattern, modified, re.DOTALL)

        if nav_match:
            modified = modified.replace(
                nav_match.group(0),
                DOWNLOAD_BUTTON + '\n\n        ' + nav_match.group(0)
            )
            changes.append('Added download button and summary container')
        else:
            # Try to find before footer
            if '<footer>' in modified:
                modified = modified.replace(
                    '<footer>',
                    DOWNLOAD_BUTTON + '\n    </div>\n\n    <footer>'
                )
                changes.append('Added download button before footer')

    # 3. Add LessonSummary.init() call
    if 'LessonSummary.init' not in modified:
        init_code = LESSON_SUMMARY_INIT_TEMPLATE.format(lesson_id=lesson_id)
        download_func = DOWNLOAD_FUNCTION_TEMPLATE.format(lesson_id=lesson_id)

        # Find the last </script> before </body> and inject there
        # Or find existing init scripts
        if 'LearningProgress.init' in modified:
            # Add after LearningProgress.init
            pattern = r"(LearningProgress\.init\([^)]+\);)"
            modified = re.sub(
                pattern,
                r'\1' + init_code,
                modified
            )
            changes.append('Added LessonSummary.init()')
        elif '</script>' in modified:
            # Add before the last </script>
            last_script_pos = modified.rfind('</script>')
            if last_script_pos > 0:
                modified = modified[:last_script_pos] + init_code + '\n    ' + modified[last_script_pos:]
                changes.append('Added LessonSummary.init()')

        # Add download function
        if 'function downloadLessonProgress' not in modified:
            # Find a script block to add to
            if '</script>\n</body>' in modified:
                modified = modified.replace(
                    '</script>\n</body>',
                    download_func + '\n    </script>\n</body>'
                )
                changes.append('Added downloadLessonProgress function')
            elif '</script>\n    \n</body>' in modified:
                modified = modified.replace(
                    '</script>\n    \n</body>',
                    download_func + '\n    </script>\n    \n</body>'
                )
                changes.append('Added downloadLessonProgress function')

    if not changes:
        result['reason'] = 'No changes needed or injection points not found'
        return result

    result['status'] = 'upgraded' if not dry_run else 'would_upgrade'
    result['changes'] = changes
    result['lesson_id'] = lesson_id

    if not dry_run:
        # Backup original
        backup_path = filepath.with_suffix('.html.bak')
        if not backup_path.exists():
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)

        # Write modified
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)

    return result


def find_lessons(folder: Path = None) -> list:
    """Find all lesson HTML files."""
    if folder:
        search_path = CONTENT_ROOT / folder
    else:
        search_path = CONTENT_ROOT

    if not search_path.exists():
        print(f"Error: Path not found: {search_path}")
        return []

    lessons = []
    for html_file in search_path.rglob('lectia*.html'):
        if not should_skip(html_file):
            lessons.append(html_file)

    return sorted(lessons)


def main():
    parser = argparse.ArgumentParser(description='Upgrade lessons with grading system')
    parser.add_argument('--all', action='store_true', help='Upgrade all lessons')
    parser.add_argument('--folder', type=str, help='Upgrade specific folder (e.g., cls5/m1-sisteme)')
    parser.add_argument('--file', type=str, help='Upgrade single file')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')

    args = parser.parse_args()

    if not (args.all or args.folder or args.file):
        parser.print_help()
        return

    print(f"LearningHub Lesson Upgrade Tool")
    print(f"{'DRY RUN - No files will be modified' if args.dry_run else 'LIVE RUN - Files will be modified'}")
    print("=" * 50)

    if args.file:
        lessons = [Path(args.file)]
    elif args.folder:
        lessons = find_lessons(Path(args.folder))
    else:
        lessons = find_lessons()

    print(f"Found {len(lessons)} lesson files to process\n")

    stats = {'upgraded': 0, 'skipped': 0, 'error': 0}

    for lesson in lessons:
        result = upgrade_lesson(lesson, dry_run=args.dry_run)

        if result['status'] in ('upgraded', 'would_upgrade'):
            stats['upgraded'] += 1
            print(f"[{'WOULD ' if args.dry_run else ''}UPGRADE] {result['file']}")
            if args.verbose:
                for change in result['changes']:
                    print(f"    + {change}")
        elif result['status'] == 'error':
            stats['error'] += 1
            print(f"[ERROR] {result['file']}: {result['reason']}")
        else:
            stats['skipped'] += 1
            if args.verbose:
                print(f"[SKIP] {result['file']}: {result['reason']}")

    print("\n" + "=" * 50)
    print(f"Summary:")
    print(f"  Upgraded: {stats['upgraded']}")
    print(f"  Skipped:  {stats['skipped']}")
    print(f"  Errors:   {stats['error']}")

    if args.dry_run and stats['upgraded'] > 0:
        print(f"\nRun without --dry-run to apply changes.")


if __name__ == '__main__':
    main()
