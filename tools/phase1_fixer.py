#!/usr/bin/env python3
"""
LearningHub Phase 1 Enhanced Fixer
====================================
Fixes all automatable issues discovered by CTO inspection (42% pass rate):

1. NAV LINKS: Fix both prev/next pointing to index.html (35 files)
2. MISSING SCRIPTS: Add breadcrumb.js, progress.js, user-system.js, quiz-bridge.js (62-76 files)
3. MODULE IDs: Fix QuizBridge/PracticeSimple/LessonSummary/Breadcrumb init IDs (50 files)
4. UNDEFINED FUNCTIONS: Add checkSynthesis/checkScenario definitions (24 files)
5. MISSING INIT CALLS: Add Breadcrumb.init, LearningProgress.init where missing

Run: python tools/phase1_fixer.py [--dry-run]
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

# Correct full script set (in order)
FULL_SCRIPT_SET = [
    'quiz-bridge.js',
    'practice-simple.js',
    'lesson-summary.js',
    'breadcrumb.js',
    'progress.js',
    'user-system.js',
]

# Alternative: Atomic Learning template uses atomic-learning.js instead of quiz-bridge.js
ATOMIC_SCRIPT_SET = [
    'atomic-learning.js',
    'quiz-bridge.js',
    'practice-simple.js',
    'lesson-summary.js',
    'breadcrumb.js',
    'progress.js',
    'user-system.js',
]

# Module name mappings for Breadcrumb display
MODULE_DISPLAY_NAMES = {}  # Will be populated from index.html files

# checkSynthesis function definition
CHECK_SYNTHESIS_JS = """
    function checkSynthesis(btn, correctAnswer) {
        const exercise = btn.closest('.practice-exercise') || btn.parentElement;
        const radios = exercise.querySelectorAll('input[type="radio"]');
        let selected = null;
        radios.forEach(r => { if (r.checked) selected = r.value; });
        if (!selected) { alert('Selecteaza un raspuns!'); return; }
        const explanation = exercise.querySelector('.synthesis-explanation');
        if (selected === correctAnswer) {
            btn.style.background = '#22c55e';
            btn.textContent = 'Corect! \\u2714';
        } else {
            btn.style.background = '#ef4444';
            btn.textContent = 'Gresit. Raspuns corect: ' + correctAnswer;
        }
        btn.disabled = true;
        if (explanation) explanation.classList.remove('hidden');
    }"""

CHECK_SCENARIO_JS = """
    function checkScenario(btn, correctAnswer) {
        const exercise = btn.closest('.practice-exercise') || btn.closest('.scenario-exercise') || btn.parentElement;
        const radios = exercise.querySelectorAll('input[type="radio"]');
        let selected = null;
        radios.forEach(r => { if (r.checked) selected = r.value; });
        if (!selected) { alert('Selecteaza un raspuns!'); return; }
        const explanation = exercise.querySelector('.scenario-explanation') || exercise.querySelector('.synthesis-explanation');
        if (selected === correctAnswer) {
            btn.style.background = '#22c55e';
            btn.textContent = 'Corect! \\u2714';
        } else {
            btn.style.background = '#ef4444';
            btn.textContent = 'Gresit. Raspuns corect: ' + correctAnswer;
        }
        btn.disabled = true;
        if (explanation) explanation.classList.remove('hidden');
    }"""


class Phase1Fixer:
    def __init__(self, filepath, dry_run=False):
        self.filepath = Path(filepath)
        self.dry_run = dry_run
        self.fixes = []
        self.warnings = []
        with open(filepath, 'r', encoding='utf-8') as f:
            self.content = f.read()
        self.original = self.content

    def _rel_path(self):
        try:
            return str(self.filepath.relative_to(CONTENT_DIR)).replace('\\', '/')
        except ValueError:
            return str(self.filepath)

    def _path_parts(self):
        """Get (grade, module, filename_no_ext) from path."""
        rel = self.filepath.relative_to(CONTENT_DIR)
        parts = list(rel.parts)
        grade = parts[0]
        module = parts[1]
        fname = parts[2].replace('.html', '')
        return grade, module, fname

    def _get_assets_prefix(self):
        """Get the relative path to assets/js/ using os.path.relpath (KB lesson: never manual depth)."""
        assets_dir = BASE_DIR / "assets" / "js"
        file_dir = self.filepath.parent
        rel = os.path.relpath(assets_dir, file_dir).replace('\\', '/')
        return rel + '/'

    def _get_correct_id(self):
        """Build correct lesson ID from path: grade-module-filename."""
        grade, module, fname = self._path_parts()
        return f'{grade}-{module}-{fname}'

    def _get_module_lessons(self):
        """Get sorted list of lesson files in this module directory."""
        module_dir = self.filepath.parent
        lessons = sorted([
            f.name for f in module_dir.iterdir()
            if f.name.startswith('lectia') and f.name.endswith('.html')
        ])
        return lessons

    # ===================== FIX 1: NAV LINKS =====================
    def fix_nav_links(self):
        """Fix both-to-index nav links by determining actual prev/next lessons."""
        nav_match = re.search(r'(<nav class="nav-bar">)(.*?)(</nav>)', self.content, re.DOTALL)
        if not nav_match:
            return

        nav_html = nav_match.group(2)
        links = re.findall(r'href="([^"]+)"', nav_html)

        # Only fix if BOTH links point to index.html
        index_count = sum(1 for l in links if l == 'index.html')
        if index_count < 2:
            return

        # Determine prev/next from directory listing
        lessons = self._get_module_lessons()
        current = self.filepath.name
        if current not in lessons:
            self.warnings.append(f'NAV: Current file {current} not in lesson list')
            return

        idx = lessons.index(current)
        prev_href = lessons[idx - 1] if idx > 0 else 'index.html'
        next_href = lessons[idx + 1] if idx < len(lessons) - 1 else 'index.html'

        # Replace the nav block
        new_nav = f'''<nav class="nav-bar">
            <a href="{prev_href}" class="nav-link">
                <span>&#8592;</span> Lectia anterioara
            </a>
            <a href="{next_href}" class="nav-link">
                Lectia urmatoare <span>&#8594;</span>
            </a>
        </nav>'''

        old_nav = nav_match.group(0)
        self.content = self.content.replace(old_nav, new_nav, 1)
        self.fixes.append(f'NAV_LINKS: prev={prev_href}, next={next_href}')

    # ===================== FIX 2: MISSING SCRIPTS =====================
    def fix_missing_scripts(self):
        """Add missing scripts from the standard set."""
        if 'assets/js/' not in self.content:
            return  # No scripts at all - skip (probably a non-standard file)

        prefix = self._get_assets_prefix()
        is_atomic = 'atomic-learning.js' in self.content
        has_quiz_bridge = 'quiz-bridge.js' in self.content

        # Determine which scripts should be present
        required = ['practice-simple.js', 'lesson-summary.js', 'breadcrumb.js', 'progress.js', 'user-system.js']
        if not is_atomic and not has_quiz_bridge:
            # Has other scripts but neither atomic nor quiz-bridge - add quiz-bridge
            required.insert(0, 'quiz-bridge.js')

        missing = [s for s in required if s not in self.content]
        if not missing:
            return

        # Find the last script tag with assets/js/
        lines = self.content.split('\n')
        last_script_idx = None
        for i, line in enumerate(lines):
            if 'assets/js/' in line and '<script' in line:
                last_script_idx = i

        if last_script_idx is None:
            return

        # Detect indent from existing script tag
        indent_match = re.match(r'^(\s*)', lines[last_script_idx])
        indent = indent_match.group(1) if indent_match else '    '

        # Insert missing scripts after the last existing one, in correct order
        # But we need to insert them in the right position relative to existing ones
        # Strategy: rebuild the entire script block in correct order
        existing_scripts = []
        script_line_indices = []
        for i, line in enumerate(lines):
            m = re.search(r'assets/js/([^"]+)"', line)
            if m and '<script' in line:
                existing_scripts.append(m.group(1))
                script_line_indices.append(i)

        # Determine correct order based on template type
        if is_atomic:
            order = ATOMIC_SCRIPT_SET
        else:
            order = FULL_SCRIPT_SET

        # Build the complete set of scripts that should exist
        all_scripts = set(existing_scripts) | set(missing)

        # Find insertion point: after the last script tag
        insert_after = script_line_indices[-1] if script_line_indices else None
        if insert_after is None:
            return

        # Only add truly missing scripts (don't reorder existing ones - too risky)
        new_lines = []
        for script in order:
            if script in missing:
                new_lines.append(f'{indent}<script src="{prefix}{script}"></script>')

        if new_lines:
            # Insert after the last existing script tag
            for j, new_line in enumerate(new_lines):
                lines.insert(insert_after + 1 + j, new_line)
            self.content = '\n'.join(lines)
            self.fixes.append(f'ADDED_SCRIPTS: {", ".join(missing)}')

    # ===================== FIX 3: MODULE IDs =====================
    def fix_module_ids(self):
        """Fix module ID mismatches in all init calls."""
        correct_id = self._get_correct_id()
        grade, module, fname = self._path_parts()

        # Find and fix QuizBridge.init ID
        patterns = [
            (r"(QuizBridge\.init\(['\"])([^'\"]+)(['\"])", 'QuizBridge'),
            (r"(PracticeSimple\.init\(['\"])([^'\"]+)(['\"])", 'PracticeSimple'),
            (r"(LessonSummary\.init\(['\"])([^'\"]+)(['\"])", 'LessonSummary'),
            (r"(AtomicLearning\.init\(['\"])([^'\"]+)(['\"])", 'AtomicLearning'),
        ]

        for pattern, name in patterns:
            m = re.search(pattern, self.content)
            if m:
                current_id = m.group(2)
                if current_id != correct_id:
                    old = m.group(0)
                    new = m.group(1) + correct_id + m.group(3)
                    self.content = self.content.replace(old, new, 1)
                    self.fixes.append(f'FIXED_ID_{name}: {current_id} -> {correct_id}')

        # Fix Breadcrumb.init module parameter
        bc_match = re.search(r"(Breadcrumb\.init\(\{[^}]*module:\s*['\"])([^'\"]+)(['\"])", self.content, re.DOTALL)
        if bc_match:
            current_module = bc_match.group(2)
            if current_module != module:
                old = bc_match.group(0)
                new = bc_match.group(1) + module + bc_match.group(3)
                self.content = self.content.replace(old, new, 1)
                self.fixes.append(f'FIXED_BREADCRUMB_MODULE: {current_module} -> {module}')

        # Fix LearningProgress.init module parameter
        lp_match = re.search(r"(LearningProgress\.init\(['\"][^'\"]+['\"],\s*['\"])([^'\"]+)(['\"])", self.content)
        if lp_match:
            current_module = lp_match.group(2)
            if current_module != module:
                old = lp_match.group(0)
                new = lp_match.group(1) + module + lp_match.group(3)
                self.content = self.content.replace(old, new, 1)
                self.fixes.append(f'FIXED_PROGRESS_MODULE: {current_module} -> {module}')

    # ===================== FIX 4: UNDEFINED FUNCTIONS =====================
    def fix_undefined_functions(self):
        """Add checkSynthesis/checkScenario function definitions where used but not defined."""
        needs_synthesis = 'checkSynthesis(' in self.content and 'function checkSynthesis' not in self.content
        needs_scenario = 'checkScenario(' in self.content and 'function checkScenario' not in self.content

        if not needs_synthesis and not needs_scenario:
            return

        # Find the <script> tag that contains DOMContentLoaded or the first inline script
        # Insert the function definitions at the start of that script block
        lines = self.content.split('\n')

        # Find a good insertion point: look for <script> tag (not src=) before DOMContentLoaded
        insert_idx = None
        for i, line in enumerate(lines):
            if '<script>' in line and 'src=' not in line:
                insert_idx = i + 1
                break

        if insert_idx is None:
            # No inline script found - add one before </body>
            for i, line in enumerate(lines):
                if '</body>' in line.lower():
                    insert_idx = i
                    lines.insert(insert_idx, '    <script>')
                    insert_idx += 1
                    # We'll close it after adding functions
                    lines.insert(insert_idx + (1 if needs_synthesis else 0) + (1 if needs_scenario else 0), '    </script>')
                    break

        if insert_idx is None:
            self.warnings.append('UNDEFINED_FN: Could not find insertion point')
            return

        added = []
        if needs_synthesis:
            lines.insert(insert_idx, CHECK_SYNTHESIS_JS)
            insert_idx += 1
            added.append('checkSynthesis')

        if needs_scenario:
            lines.insert(insert_idx, CHECK_SCENARIO_JS)
            added.append('checkScenario')

        self.content = '\n'.join(lines)
        self.fixes.append(f'ADDED_FUNCTIONS: {", ".join(added)}')

    # ===================== FIX 5: MISSING INIT CALLS =====================
    def fix_missing_inits(self):
        """Add missing Breadcrumb.init and LearningProgress.init calls."""
        grade, module, fname = self._path_parts()
        correct_id = self._get_correct_id()

        # Extract lesson display name from filename
        lesson_num_match = re.match(r'lectia(\d+)', fname)
        lesson_num = lesson_num_match.group(1) if lesson_num_match else '1'

        has_breadcrumb_js = 'breadcrumb.js' in self.content
        has_breadcrumb_init = 'Breadcrumb.init' in self.content
        has_progress_js = 'progress.js' in self.content
        has_progress_init = 'LearningProgress.init' in self.content

        if has_breadcrumb_js and not has_breadcrumb_init:
            # Find insertion point in DOMContentLoaded block
            lines = self.content.split('\n')
            for i, line in enumerate(lines):
                if '});' in line and i > 10:
                    # Check if this is the end of DOMContentLoaded
                    # Look backwards for context
                    context = '\n'.join(lines[max(0, i-5):i])
                    if 'init(' in context or 'DOMContentLoaded' in '\n'.join(lines[max(0, i-50):i]):
                        # Determine grade display name
                        grade_names = {
                            'cls5': 'Clasa a V-a', 'cls6': 'Clasa a VI-a',
                            'cls7': 'Clasa a VII-a', 'cls8': 'Clasa a VIII-a'
                        }
                        grade_name = grade_names.get(grade, grade)
                        module_name = module.replace('-', ' ').title()

                        init_code = f"""
            // Initialize Breadcrumb
            if (typeof Breadcrumb !== 'undefined') {{
                Breadcrumb.init({{ grade: '{grade}', gradeName: '{grade_name}', module: '{module}', moduleName: '{module_name}', lesson: 'Lectia {lesson_num}' }});
            }}"""
                        lines.insert(i, init_code)
                        self.content = '\n'.join(lines)
                        self.fixes.append(f'ADDED_BREADCRUMB_INIT')
                        break

        if has_progress_js and not has_progress_init:
            lines = self.content.split('\n')
            for i, line in enumerate(lines):
                if '});' in line and i > 10:
                    context = '\n'.join(lines[max(0, i-5):i])
                    if 'init(' in context or 'DOMContentLoaded' in '\n'.join(lines[max(0, i-50):i]):
                        init_code = f"""
            // Initialize Progress
            if (typeof LearningProgress !== 'undefined') {{
                LearningProgress.init('{grade}', '{module}', '{fname}');
            }}"""
                        lines.insert(i, init_code)
                        self.content = '\n'.join(lines)
                        self.fixes.append(f'ADDED_PROGRESS_INIT')
                        break

    def save(self):
        """Save if content changed."""
        if self.content != self.original:
            if not self.dry_run:
                with open(self.filepath, 'w', encoding='utf-8') as f:
                    f.write(self.content)
            return True
        return False

    def run_all(self):
        """Run all Phase 1 fixes."""
        # Check for truncated files first
        if '</html>' not in self.content.lower():
            self.warnings.append('TRUNCATED: No closing </html>')
            return

        self.fix_nav_links()
        self.fix_missing_scripts()
        self.fix_module_ids()
        self.fix_undefined_functions()
        self.fix_missing_inits()


def main():
    parser = argparse.ArgumentParser(description='LearningHub Phase 1 Fixer')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes')
    args = parser.parse_args()

    lesson_files = sorted(glob.glob(str(CONTENT_DIR / '**' / 'lectia*.html'), recursive=True))

    print(f"LearningHub Phase 1 Fixer {'(DRY RUN)' if args.dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"Scanning {len(lesson_files)} lesson files...\n")

    total_fixes = 0
    total_warnings = 0
    fixed_files = 0
    fix_summary = defaultdict(int)
    all_results = []

    for filepath in lesson_files:
        fixer = Phase1Fixer(filepath, dry_run=args.dry_run)
        fixer.run_all()
        changed = fixer.save()

        rel = fixer._rel_path()

        if fixer.fixes or fixer.warnings:
            result = {'file': rel, 'fixes': fixer.fixes, 'warnings': fixer.warnings, 'changed': changed}
            all_results.append(result)

            if fixer.fixes:
                fixed_files += 1
                print(f"  FIXED: {rel}")
                for fix in fixer.fixes:
                    code = fix.split(':')[0]
                    fix_summary[code] += 1
                    total_fixes += 1
                    print(f"    + {fix}")

            if fixer.warnings:
                for warn in fixer.warnings:
                    total_warnings += 1
                    print(f"  WARN: {rel} - {warn}")

    print(f"\n{'=' * 60}")
    print(f"RESULTS {'(DRY RUN)' if args.dry_run else ''}")
    print(f"{'=' * 60}")
    print(f"Files scanned:  {len(lesson_files)}")
    print(f"Files fixed:    {fixed_files}")
    print(f"Total fixes:    {total_fixes}")
    print(f"Total warnings: {total_warnings}")

    if fix_summary:
        print(f"\nFix breakdown:")
        for code, count in sorted(fix_summary.items(), key=lambda x: -x[1]):
            print(f"  {code}: {count}")

    # Save report
    report_path = BASE_DIR / 'tools' / 'phase1_report.json'
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'dry_run': args.dry_run,
            'files_scanned': len(lesson_files),
            'files_fixed': fixed_files,
            'total_fixes': total_fixes,
            'fix_summary': dict(fix_summary),
            'details': all_results,
        }, f, indent=2, ensure_ascii=False)
    print(f"\nReport: {report_path}")


if __name__ == '__main__':
    main()
