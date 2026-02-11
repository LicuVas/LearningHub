#!/usr/bin/env python3
"""
LearningHub Auto-Fixer
=======================
Fixes all automatable issues across lesson files:
1. JS load order (atomic-learning → quiz-bridge → practice-simple → lesson-summary)
2. Missing lesson-summary div
3. Wrong lesson-summary div ID
4. Missing practice-simple.js / lesson-summary.js script tags
5. Missing PracticeSimple.init() / LessonSummary.init() calls
6. Truncated files detection

Run: python tools/auto_fixer.py [--dry-run]
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import re
import json
import glob
import argparse
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content" / "tic"

# Correct JS load order (relative to assets/js/)
CORRECT_ORDER = [
    'atomic-learning.js',
    'quiz-bridge.js',
    'practice-simple.js',
    'lesson-summary.js',
]

# Extended scripts that come after the core 4
EXTENDED_SCRIPTS = [
    'breadcrumb.js',
    'progress.js',
    'rpg-system.js',
    'proficiency-system.js',
    'user-system.js',
]


class LessonFixer:
    def __init__(self, filepath, dry_run=False):
        self.filepath = Path(filepath)
        self.dry_run = dry_run
        self.fixes = []
        self.warnings = []
        with open(filepath, 'r', encoding='utf-8') as f:
            self.content = f.read()
        self.original = self.content
        self.lines = self.content.split('\n')

    def _rel_path(self):
        try:
            return str(self.filepath.relative_to(CONTENT_DIR))
        except ValueError:
            return str(self.filepath)

    def _get_assets_prefix(self):
        """Determine the relative path prefix to assets/js/ from this file.
        Must account for content/tic/ being 2 levels below root."""
        # Better approach: extract from existing script tags in the file
        import re as _re
        m = _re.search(r'src="([^"]*assets/js/)', self.original)
        if m:
            return m.group(1)
        # Fallback: calculate from path (content/tic/ = 2 extra levels)
        rel = self.filepath.relative_to(CONTENT_DIR)
        depth = len(rel.parts) - 1  # subtract filename
        return '../' * (depth + 2) + 'assets/js/'

    def _extract_lesson_id(self):
        """Extract lesson ID from existing init calls or construct from path."""
        m = re.search(r"(?:PracticeSimple|LessonSummary)\.init\(['\"]([^'\"]+)['\"]\)", self.content)
        if m:
            return m.group(1)
        # Construct from path: cls5/m1-sisteme/lectia1-hardware.html -> cls5-m1-sisteme-lectia1-hardware
        rel = self.filepath.relative_to(CONTENT_DIR)
        parts = list(rel.parts)
        name = parts[-1].replace('.html', '')
        return '-'.join(parts[:-1] + [name])

    def check_truncated(self):
        """Check if file is truncated (no closing </html> tag)."""
        if '</html>' not in self.content.lower():
            self.warnings.append('TRUNCATED: No closing </html> tag - file is incomplete')
            return True
        return False

    def fix_js_order(self):
        """Fix the order of core JS script tags."""
        # Find all script tags with src containing assets/js/
        script_pattern = re.compile(r'(\s*<script\s+src="[^"]*assets/js/([^"]+)"\s*>\s*</script>)')

        # Collect all script tag positions and their JS filenames
        script_tags = []
        for match in script_pattern.finditer(self.content):
            full_tag = match.group(1)
            js_file = match.group(2)
            start = match.start()
            end = match.end()
            script_tags.append({
                'full_tag': full_tag,
                'js_file': js_file,
                'start': start,
                'end': end,
            })

        if not script_tags:
            return

        # Check if core scripts exist and are in wrong order
        core_files = [t for t in script_tags if t['js_file'] in CORRECT_ORDER]
        if len(core_files) < 2:
            return  # Not enough core scripts to reorder

        core_order = [t['js_file'] for t in core_files]
        expected = [f for f in CORRECT_ORDER if f in core_order]

        if core_order == expected:
            return  # Already in correct order

        # Need to fix: replace the script block
        # Find the region containing all script tags (first to last)
        all_starts = [t['start'] for t in script_tags]
        all_ends = [t['end'] for t in script_tags]

        # Get the prefix for this file
        prefix = self._get_assets_prefix()

        # Build the new script block in correct order
        indent = '    '
        # Detect actual indent from first script tag
        first_line = script_tags[0]['full_tag']
        indent_match = re.match(r'^(\s*)', first_line)
        if indent_match:
            indent = indent_match.group(1)
        if not indent or indent == '\n':
            indent = '    '

        # Reorder: core scripts first in correct order, then extended scripts in existing order
        core_set = set(CORRECT_ORDER)
        extended = [t for t in script_tags if t['js_file'] not in core_set]

        new_lines = []
        for js in CORRECT_ORDER:
            if js in core_order:
                new_lines.append(f'{indent}<script src="{prefix}{js}"></script>')
        for t in extended:
            # Preserve extended scripts in their original relative order
            # but extract just the filename and rebuild with correct prefix
            js_path = t['full_tag'].strip()
            new_lines.append(f'{indent}{js_path.strip()}' if prefix in js_path else js_path)

        # Replace the entire block from first script to last script
        # But be careful: there might be non-script lines between them
        # Better approach: replace each script tag individually by reordering

        # Simpler approach: find the contiguous block of script tags and replace
        # Find lines with script tags
        content_lines = self.content.split('\n')
        script_line_indices = []
        for i, line in enumerate(content_lines):
            if re.search(r'<script\s+src="[^"]*assets/js/', line):
                script_line_indices.append(i)

        if not script_line_indices:
            return

        # Check if they're contiguous or near-contiguous (allow blank lines between)
        first_idx = script_line_indices[0]
        last_idx = script_line_indices[-1]

        # Extract the block
        block_lines = content_lines[first_idx:last_idx + 1]

        # Separate script lines from non-script lines in the block
        non_script_lines = []
        script_map = {}
        for line in block_lines:
            m = re.search(r'assets/js/([^"]+)"', line)
            if m:
                script_map[m.group(1)] = line
            else:
                if line.strip():  # Keep non-empty non-script lines
                    non_script_lines.append(line)

        # Build new block
        new_block = []
        # Add core scripts in correct order
        for js in CORRECT_ORDER:
            if js in script_map:
                # Rebuild with correct path
                new_block.append(f'{indent}<script src="{prefix}{js}"></script>')
            elif js in ('practice-simple.js', 'lesson-summary.js'):
                # Add missing core script
                new_block.append(f'{indent}<script src="{prefix}{js}"></script>')
                self.fixes.append(f'ADDED_MISSING_SCRIPT: {js}')

        # Add extended scripts
        for js in EXTENDED_SCRIPTS:
            if js in script_map:
                new_block.append(f'{indent}<script src="{prefix}{js}"></script>')

        # Add any other scripts not in our lists
        known = set(CORRECT_ORDER) | set(EXTENDED_SCRIPTS)
        for js, line in script_map.items():
            if js not in known:
                # Preserve pow/ and other subdirectory scripts
                new_block.append(line)

        # Add non-script lines back
        for line in non_script_lines:
            new_block.append(line)

        # Replace in content
        old_block = '\n'.join(content_lines[first_idx:last_idx + 1])
        new_block_str = '\n'.join(new_block)

        if old_block != new_block_str:
            content_lines[first_idx:last_idx + 1] = new_block
            self.content = '\n'.join(content_lines)
            self.fixes.append(f'FIXED_JS_ORDER: Reordered {len(script_map)} script tags')

    def fix_lesson_summary_div(self):
        """Ensure lesson-summary div exists with correct ID."""
        # Check for wrong ID
        if 'id="lesson-summary-container"' in self.content:
            self.content = self.content.replace(
                'id="lesson-summary-container"',
                'id="lesson-summary" style="display: none;"'
            )
            self.fixes.append('FIXED_DIV_ID: lesson-summary-container → lesson-summary')
            return

        # Check if correct div exists
        if 'id="lesson-summary"' in self.content:
            return

        # Need to add it - place before script tags or before </body>
        # Find the best insertion point
        lines = self.content.split('\n')
        insert_idx = None

        # Look for first <script src=...assets/js/> line
        for i, line in enumerate(lines):
            if re.search(r'<script\s+src="[^"]*assets/js/', line):
                insert_idx = i
                break

        if insert_idx is None:
            # Look for </body>
            for i, line in enumerate(lines):
                if '</body>' in line.lower():
                    insert_idx = i
                    break

        if insert_idx is not None:
            indent = '    '
            lines.insert(insert_idx, f'{indent}<div id="lesson-summary" style="display: none;"></div>')
            lines.insert(insert_idx, '')
            self.content = '\n'.join(lines)
            self.fixes.append('ADDED_LESSON_SUMMARY_DIV')

    def fix_missing_scripts(self):
        """Add missing practice-simple.js and lesson-summary.js if other core scripts exist."""
        has_atomic = 'atomic-learning.js' in self.content
        has_quiz_bridge = 'quiz-bridge.js' in self.content
        has_practice = 'practice-simple.js' in self.content
        has_summary = 'lesson-summary.js' in self.content

        if not (has_atomic or has_quiz_bridge):
            return  # Not using the standard template

        prefix = self._get_assets_prefix()

        if not has_practice and (has_atomic or has_quiz_bridge):
            # Find where to insert (after quiz-bridge or atomic-learning)
            lines = self.content.split('\n')
            insert_after = None
            for i, line in enumerate(lines):
                if 'quiz-bridge.js' in line:
                    insert_after = i
                elif 'atomic-learning.js' in line and insert_after is None:
                    insert_after = i
            if insert_after is not None:
                indent = '    '
                lines.insert(insert_after + 1, f'{indent}<script src="{prefix}practice-simple.js"></script>')
                self.content = '\n'.join(lines)
                self.fixes.append('ADDED_PRACTICE_SIMPLE_JS')

        if not has_summary and (has_atomic or has_quiz_bridge):
            lines = self.content.split('\n')
            insert_after = None
            for i, line in enumerate(lines):
                if 'practice-simple.js' in line:
                    insert_after = i
                elif 'quiz-bridge.js' in line:
                    insert_after = i
            if insert_after is not None:
                indent = '    '
                lines.insert(insert_after + 1, f'{indent}<script src="{prefix}lesson-summary.js"></script>')
                self.content = '\n'.join(lines)
                self.fixes.append('ADDED_LESSON_SUMMARY_JS')

    def fix_missing_init(self):
        """Add missing PracticeSimple.init() and LessonSummary.init() calls."""
        has_practice_init = 'PracticeSimple.init(' in self.content
        has_summary_init = 'LessonSummary.init(' in self.content
        has_practice_js = 'practice-simple.js' in self.content
        has_summary_js = 'lesson-summary.js' in self.content

        lesson_id = self._extract_lesson_id()

        if has_practice_js and not has_practice_init:
            # Find the DOMContentLoaded or inline script block to add init
            # Look for existing init block pattern
            lines = self.content.split('\n')
            # Find </script> before </body> or a DOMContentLoaded block
            insert_point = None
            for i, line in enumerate(lines):
                if 'DOMContentLoaded' in line or 'document.addEventListener' in line:
                    # Find the end of this script block and add before closing
                    for j in range(i+1, min(i+200, len(lines))):
                        if '});' in lines[j] or 'LessonSummary.init' in lines[j]:
                            insert_point = j
                            break
                    break

            if insert_point:
                indent = '            '
                init_code = f"""{indent}// Initialize PracticeSimple
{indent}if (typeof PracticeSimple !== 'undefined') {{
{indent}    PracticeSimple.init('{lesson_id}');
{indent}}}"""
                lines.insert(insert_point, init_code)
                self.content = '\n'.join(lines)
                self.fixes.append(f'ADDED_PRACTICE_INIT: {lesson_id}')

        if has_summary_js and not has_summary_init:
            lines = self.content.split('\n')
            insert_point = None
            for i, line in enumerate(lines):
                if 'PracticeSimple.init' in line:
                    # Add after PracticeSimple init block
                    for j in range(i, min(i+10, len(lines))):
                        if '}' in lines[j] and 'PracticeSimple' not in lines[j+1:j+3]:
                            insert_point = j + 1
                            break
                    break
                if 'DOMContentLoaded' in line:
                    for j in range(i+1, min(i+200, len(lines))):
                        if '});' in lines[j]:
                            insert_point = j
                            break
                    break

            if insert_point:
                indent = '            '
                init_code = f"""
{indent}// Initialize LessonSummary
{indent}if (typeof LessonSummary !== 'undefined') {{
{indent}    LessonSummary.init('{lesson_id}');
{indent}}}"""
                lines.insert(insert_point, init_code)
                self.content = '\n'.join(lines)
                self.fixes.append(f'ADDED_SUMMARY_INIT: {lesson_id}')

    def fix_nav_links(self):
        """Fix navigation links that point too many levels up."""
        # Fix ../../../../../index.html (5 levels) -> should be ../../../../index.html or similar
        # Calculate correct depth
        rel = self.filepath.relative_to(CONTENT_DIR)
        depth = len(rel.parts) - 1  # e.g. cls5/m1-sisteme/lectia1.html = depth 2
        correct_prefix = '../' * depth

        # Find nav links that go to index.html with wrong depth
        pattern = re.compile(r'href="((?:\.\./)+)index\.html"')

        def fix_link(match):
            current_prefix = match.group(1)
            current_depth = current_prefix.count('../')
            if current_depth != depth:
                self.fixes.append(f'FIXED_NAV_LINK: {current_prefix}index.html → {correct_prefix}index.html')
                return f'href="{correct_prefix}index.html"'
            return match.group(0)

        self.content = pattern.sub(fix_link, self.content)

    def save(self):
        """Save if content changed."""
        if self.content != self.original:
            if not self.dry_run:
                with open(self.filepath, 'w', encoding='utf-8') as f:
                    f.write(self.content)
            return True
        return False

    def run_all(self):
        """Run all fixes in order."""
        truncated = self.check_truncated()
        if truncated:
            return  # Don't try to fix truncated files

        self.fix_js_order()
        self.fix_lesson_summary_div()
        self.fix_missing_scripts()
        self.fix_missing_init()
        self.fix_nav_links()


def main():
    parser = argparse.ArgumentParser(description='LearningHub Auto-Fixer')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be fixed without changing files')
    args = parser.parse_args()

    # Find all lesson files
    lesson_files = sorted(glob.glob(str(CONTENT_DIR / '**' / 'lectia*.html'), recursive=True))

    print(f"LearningHub Auto-Fixer {'(DRY RUN)' if args.dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"Scanning {len(lesson_files)} lesson files...\n")

    total_fixes = 0
    total_warnings = 0
    fixed_files = 0
    warned_files = 0
    fix_summary = defaultdict(int)
    warning_summary = defaultdict(int)
    all_results = []

    for filepath in lesson_files:
        fixer = LessonFixer(filepath, dry_run=args.dry_run)
        fixer.run_all()
        changed = fixer.save()

        rel = fixer._rel_path()

        if fixer.fixes or fixer.warnings:
            result = {
                'file': rel,
                'fixes': fixer.fixes,
                'warnings': fixer.warnings,
                'changed': changed,
            }
            all_results.append(result)

            if fixer.fixes:
                fixed_files += 1
                print(f"  FIXED: {rel}")
                for fix in fixer.fixes:
                    code = fix.split(':')[0]
                    fix_summary[code] += 1
                    total_fixes += 1
                    print(f"    - {fix}")

            if fixer.warnings:
                warned_files += 1
                print(f"  WARNING: {rel}")
                for warn in fixer.warnings:
                    code = warn.split(':')[0]
                    warning_summary[code] += 1
                    total_warnings += 1
                    print(f"    ! {warn}")

    print(f"\n{'=' * 60}")
    print(f"RESULTS {'(DRY RUN - no files changed)' if args.dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"Files scanned:  {len(lesson_files)}")
    print(f"Files fixed:    {fixed_files}")
    print(f"Files warned:   {warned_files}")
    print(f"Total fixes:    {total_fixes}")
    print(f"Total warnings: {total_warnings}")

    if fix_summary:
        print(f"\nFix breakdown:")
        for code, count in sorted(fix_summary.items(), key=lambda x: -x[1]):
            print(f"  {code}: {count}")

    if warning_summary:
        print(f"\nWarning breakdown:")
        for code, count in sorted(warning_summary.items(), key=lambda x: -x[1]):
            print(f"  {code}: {count}")

    # Save detailed results
    report_path = BASE_DIR / 'tools' / 'autofix_report.json'
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'dry_run': args.dry_run,
            'files_scanned': len(lesson_files),
            'files_fixed': fixed_files,
            'total_fixes': total_fixes,
            'fix_summary': dict(fix_summary),
            'warning_summary': dict(warning_summary),
            'details': all_results,
        }, f, indent=2, ensure_ascii=False)
    print(f"\nDetailed report: {report_path}")


if __name__ == '__main__':
    main()
