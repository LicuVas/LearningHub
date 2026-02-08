#!/usr/bin/env python3
"""
LearningHub Comprehensive Site Audit
=====================================
Phase 1: Structural scan across ALL files
Phase 3: Scoring system integrity checks
Phase 4: Technical functionality validation
Phase 5: Gap analysis + coverage matrix

Run: python tools/audit_full.py
Output: tools/audit_report.json + console summary
"""
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import re
import json
from pathlib import Path
from collections import defaultdict, Counter
from datetime import datetime

BASE_DIR = Path(__file__).parent.parent
CONTENT_DIR = BASE_DIR / "content" / "tic"
ASSETS_DIR = BASE_DIR / "assets"
JS_DIR = ASSETS_DIR / "js"

# ============================================================
# LOAD CONTENT MAP (source of truth)
# ============================================================
def load_content_map():
    cm_path = BASE_DIR / "content_map.json"
    with open(cm_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# ============================================================
# PHASE 1: STRUCTURAL SCAN
# ============================================================
class StructuralAuditor:
    def __init__(self, content_map):
        self.cm = content_map
        self.issues = []  # (severity, grade, module, file, code, description)
        self.stats = {
            'total_lessons': 0,
            'total_quizzes': 0,
            'total_modules': 0,
            'lessons_per_grade': {},
            'modules_per_grade': {},
        }

    def add_issue(self, severity, grade, module, file, code, desc):
        self.issues.append({
            'severity': severity,
            'grade': grade,
            'module': module,
            'file': file,
            'code': code,
            'description': desc
        })

    def check_content_paths_exist(self):
        """1.1a: Every content_path in content_map points to existing folder"""
        for grade, gdata in self.cm['grades'].items():
            cls_dir = CONTENT_DIR / f"cls{grade}"
            for mod_id, mdata in gdata['modules'].items():
                paths = mdata.get('content_paths', [])
                for cp in paths:
                    folder = cls_dir / cp
                    if not folder.exists():
                        self.add_issue('P1', grade, mod_id, str(folder),
                                       'MISSING_CONTENT_FOLDER',
                                       f"content_path '{cp}' does not exist on disk")
                if not paths:
                    self.add_issue('P1', grade, mod_id, '',
                                   'EMPTY_CONTENT_PATHS',
                                   f"Module has no content_paths defined (no content)")

    def check_lesson_counts(self):
        """1.1b: Lesson count per module vs topic count in planificari"""
        for grade, gdata in self.cm['grades'].items():
            cls_dir = CONTENT_DIR / f"cls{grade}"
            for mod_id, mdata in gdata['modules'].items():
                expected = len(mdata.get('topics', []))
                paths = mdata.get('content_paths', [])
                actual_lessons = []
                for cp in paths:
                    folder = cls_dir / cp
                    if folder.exists():
                        actual_lessons.extend(list(folder.glob('lectia*.html')))
                actual = len(actual_lessons)
                # Note: some modules share folders, so we skip those
                # Only flag significant mismatches (delta > 2)
                if paths and actual > 0 and abs(actual - expected) > 2:
                    self.add_issue('P2', grade, mod_id, '',
                                   'LESSON_COUNT_MISMATCH',
                                   f"Expected ~{expected} topics, found {actual} lesson files (delta={actual-expected})")

    def check_module_indexes(self):
        """1.1c: Each module folder has index.html"""
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                idx = folder / "index.html"
                if not idx.exists():
                    self.add_issue('P2', grade, folder.name, str(folder),
                                   'MISSING_INDEX_HTML',
                                   f"No index.html in module folder")

    def check_lesson_naming(self):
        """1.1d: Lesson naming conventions and sequence gaps"""
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                lessons = sorted(folder.glob('lectia*.html'))
                if not lessons:
                    continue

                # Extract lesson numbers
                numbers = []
                duplicates = defaultdict(list)
                for lf in lessons:
                    m = re.match(r'lectia(\d+)', lf.name)
                    if m:
                        num = int(m.group(1))
                        numbers.append(num)
                        duplicates[num].append(lf.name)

                # Check for duplicates (same number, different slug)
                for num, files in duplicates.items():
                    if len(files) > 1:
                        self.add_issue('P2', grade, folder.name, ', '.join(files),
                                       'DUPLICATE_LESSON_NUMBER',
                                       f"Lesson number {num} has multiple files: {files}")

                # Check for sequence gaps
                if numbers:
                    unique_nums = sorted(set(numbers))
                    expected_range = list(range(unique_nums[0], unique_nums[-1] + 1))
                    missing = set(expected_range) - set(unique_nums)
                    if missing:
                        self.add_issue('P3', grade, folder.name, '',
                                       'SEQUENCE_GAP',
                                       f"Missing lesson numbers: {sorted(missing)}")

    def check_lesson_content(self):
        """1.1e-m: Check each lesson HTML for content quality markers"""
        placeholder_patterns = [
            r'\bTODO\b', r'\bPLACEHOLDER\b', r'\bLorem ipsum\b',
            r'\bTBD\b', r'\bMODEL_ANSWER_REQUIRED\b', r'\bXXX\b',
            r'\bFIXME\b', r'\bHACK\b'
        ]
        placeholder_re = re.compile('|'.join(placeholder_patterns), re.IGNORECASE)

        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                for lf in sorted(folder.glob('lectia*.html')):
                    self.stats['total_lessons'] += 1
                    try:
                        content = lf.read_text(encoding='utf-8', errors='replace')
                    except Exception as e:
                        self.add_issue('P1', grade, folder.name, lf.name,
                                       'READ_ERROR', str(e))
                        continue

                    rel = lf.relative_to(CONTENT_DIR)

                    # Atom content sections
                    has_atom_content = bool(re.search(r'class="[^"]*atom-content[^"]*"', content) or
                                           re.search(r'class="[^"]*atom-theory[^"]*"', content) or
                                           re.search(r'<section[^>]*class="[^"]*atom[^"]*"', content))

                    # Quiz sections
                    has_quiz = bool(re.search(r'class="[^"]*atom-quiz[^"]*"', content) or
                                   re.search(r'data-quiz', content) or
                                   re.search(r'class="[^"]*quiz-question[^"]*"', content) or
                                   re.search(r'checkAnswer\(', content))

                    # Empty quiz data
                    has_empty_quiz = bool(re.search(r"data-quiz='\s*\[\s*\]'", content) or
                                         re.search(r'data-quiz="\s*\[\s*\]"', content))

                    # Mobile viewport
                    has_viewport = 'viewport' in content.lower()

                    # Placeholder text
                    placeholders = placeholder_re.findall(content)

                    # CSS/JS references
                    broken_refs = self._check_asset_refs(content, lf)

                    # Internal links
                    broken_links = self._check_internal_links(content, lf)

                    # JS checks (from existing audit)
                    js_issues = self._check_js_integration(content, lf)

                    # Report issues
                    if not has_atom_content and not re.search(r'<h[1-3]', content):
                        self.add_issue('P2', grade, folder.name, lf.name,
                                       'NO_THEORY_CONTENT',
                                       'No .atom-content sections and no headings found')

                    if not has_quiz:
                        self.add_issue('P2', grade, folder.name, lf.name,
                                       'NO_QUIZ_CONTENT',
                                       'No quiz questions found (no atom-quiz, data-quiz, or checkAnswer)')

                    if has_empty_quiz:
                        self.add_issue('P1', grade, folder.name, lf.name,
                                       'EMPTY_QUIZ_DATA',
                                       "data-quiz='[]' - quiz declared but no questions")

                    if not has_viewport:
                        self.add_issue('P3', grade, folder.name, lf.name,
                                       'NO_VIEWPORT_META',
                                       'Missing mobile viewport meta tag')

                    if placeholders:
                        unique_ph = list(set(placeholders))
                        self.add_issue('P2', grade, folder.name, lf.name,
                                       'PLACEHOLDER_TEXT',
                                       f"Found placeholder text: {unique_ph[:5]}")

                    for ref_issue in broken_refs:
                        self.add_issue('P2', grade, folder.name, lf.name,
                                       'BROKEN_ASSET_REF', ref_issue)

                    for link_issue in broken_links:
                        self.add_issue('P2', grade, folder.name, lf.name,
                                       'BROKEN_INTERNAL_LINK', link_issue)

                    for js_issue in js_issues:
                        self.add_issue(js_issue[0], grade, folder.name, lf.name,
                                       js_issue[1], js_issue[2])

        # Count lessons per grade
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            count = 0
            mod_count = 0
            for folder in cls_dir.iterdir():
                if folder.is_dir():
                    mod_count += 1
                    count += len(list(folder.glob('lectia*.html')))
            self.stats['lessons_per_grade'][grade] = count
            self.stats['modules_per_grade'][grade] = mod_count
            self.stats['total_modules'] += mod_count

    def _check_asset_refs(self, content, filepath):
        """Check CSS and JS references resolve to existing files"""
        issues = []
        # Find src and href attributes pointing to local files
        refs = re.findall(r'(?:src|href)="([^"]*\.(?:js|css))"', content)
        for ref in refs:
            if ref.startswith('http') or ref.startswith('//'):
                continue  # External resources
            # Resolve relative path
            if ref.startswith('/'):
                resolved = BASE_DIR / ref.lstrip('/')
            else:
                resolved = filepath.parent / ref
            try:
                resolved = resolved.resolve()
            except Exception:
                pass
            if not resolved.exists():
                # Check common patterns - might be relative to project root
                alt_resolved = BASE_DIR / ref
                if not alt_resolved.exists():
                    issues.append(f"Asset not found: {ref}")
        return issues[:5]  # Limit to avoid spam

    def _check_internal_links(self, content, filepath):
        """Check internal href links resolve to existing files"""
        issues = []
        # Find href to html files
        hrefs = re.findall(r'href="([^"]*\.html)"', content)
        for href in hrefs:
            if href.startswith('http') or href.startswith('//') or href.startswith('#'):
                continue
            if href.startswith('/'):
                resolved = BASE_DIR / href.lstrip('/')
            else:
                resolved = filepath.parent / href
            try:
                resolved = resolved.resolve()
            except Exception:
                pass
            if not resolved.exists():
                issues.append(f"Broken link: {href}")
        return issues[:5]

    def _check_js_integration(self, content, filepath):
        """Check JS script integration (quiz-bridge, lesson-summary, etc.)"""
        issues = []

        has_quiz_bridge = 'quiz-bridge.js' in content
        has_quiz_bridge_init = 'QuizBridge.init' in content
        has_lesson_summary = 'lesson-summary.js' in content
        has_lesson_summary_init = 'LessonSummary.init' in content
        has_lesson_summary_div = 'id="lesson-summary"' in content
        has_practice_simple = 'practice-simple.js' in content
        has_practice_section = 'practice-advanced' in content or 'practice-exercise' in content
        has_inline_check_answer = bool(re.search(r'function\s+checkAnswer\s*\(', content))

        # Count quiz questions
        matches = re.findall(r'onclick="checkAnswer\((\d+),', content)
        actual_questions = len(set(matches)) if matches else 0
        if actual_questions == 0:
            quiz_divs = len(re.findall(r'class="quiz-question"', content))
            actual_questions = quiz_divs

        init_match = re.search(r'QuizBridge\.init\([^,]+,\s*\{\s*totalQuestions:\s*(\d+)', content)
        init_questions = int(init_match.group(1)) if init_match else None

        if has_inline_check_answer and actual_questions > 0:
            if not has_quiz_bridge:
                issues.append(('P1', 'MISSING_QUIZ_BRIDGE_JS',
                              'Has quiz questions but quiz-bridge.js not included'))
            if not has_quiz_bridge_init:
                issues.append(('P1', 'MISSING_QUIZ_BRIDGE_INIT',
                              'QuizBridge.init() not called'))
            if init_questions is not None and init_questions != actual_questions:
                issues.append(('P0', 'WRONG_TOTAL_QUESTIONS',
                              f'totalQuestions={init_questions} but actual={actual_questions}'))

        if not has_lesson_summary:
            issues.append(('P2', 'MISSING_LESSON_SUMMARY_JS',
                          'lesson-summary.js not included'))
        if not has_lesson_summary_init:
            issues.append(('P2', 'MISSING_LESSON_SUMMARY_INIT',
                          'LessonSummary.init() not called'))
        if has_lesson_summary_init and not has_lesson_summary_div:
            issues.append(('P1', 'MISSING_LESSON_SUMMARY_DIV',
                          'No #lesson-summary div for grade display'))

        if has_practice_section and not has_practice_simple:
            issues.append(('P2', 'MISSING_PRACTICE_JS',
                          'Has practice section but practice-simple.js not included'))

        return issues

    def check_quiz_files(self):
        """Check standalone quiz files in quizuri/ folders"""
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                quiz_dir = folder / "quizuri"
                if quiz_dir.exists():
                    quizzes = list(quiz_dir.glob('quiz*.html'))
                    self.stats['total_quizzes'] += len(quizzes)
                    for qf in quizzes:
                        try:
                            content = qf.read_text(encoding='utf-8', errors='replace')
                        except Exception:
                            continue
                        if len(content) < 200:
                            self.add_issue('P1', grade, folder.name, qf.name,
                                           'EMPTY_QUIZ_FILE',
                                           'Quiz file is nearly empty (<200 chars)')

    def run_all(self):
        print("[Phase 1] Running structural scan...")
        self.check_content_paths_exist()
        self.check_lesson_counts()
        self.check_module_indexes()
        self.check_lesson_naming()
        self.check_lesson_content()
        self.check_quiz_files()
        print(f"  Found {len(self.issues)} structural issues")
        return self.issues


# ============================================================
# PHASE 3: SCORING SYSTEM INTEGRITY
# ============================================================
class ScoringAuditor:
    def __init__(self):
        self.issues = []

    def add_issue(self, severity, file, code, desc):
        self.issues.append({
            'severity': severity,
            'grade': '-',
            'module': '-',
            'file': file,
            'code': code,
            'description': desc
        })

    def check_lesson_summary(self):
        """3.1: Grading formula verification"""
        ls_path = JS_DIR / "lesson-summary.js"
        if not ls_path.exists():
            self.add_issue('P0', 'lesson-summary.js', 'FILE_MISSING',
                          'lesson-summary.js not found!')
            return

        content = ls_path.read_text(encoding='utf-8', errors='replace')

        # Check for calculateFinalScore or similar
        has_calc = bool(re.search(r'calculateFinalScore|calcul.*Score|finalScore|calculateGrade', content, re.IGNORECASE))
        if not has_calc:
            # Check for scoring formula in any form
            has_formula = bool(re.search(r'score.*=.*\d.*\*', content))
            if not has_formula:
                self.add_issue('P2', 'lesson-summary.js', 'NO_SCORE_FORMULA',
                              'No recognizable grading formula found')

        # Check for 0/0 division protection
        has_div_zero_check = bool(re.search(r'(?:total|count|length)\s*(?:===?|!==?)\s*0|(?:\/.*(?:\|\||&&))', content))
        if not has_div_zero_check:
            # Check for any division
            has_division = bool(re.search(r'\b\w+\s*/\s*\w+', content))
            if has_division:
                self.add_issue('P1', 'lesson-summary.js', 'POTENTIAL_DIV_ZERO',
                              'Has division but no explicit zero-check protection found')

        # Check for min/max clamping
        has_clamp = bool(re.search(r'Math\.min|Math\.max|Math\.clamp|clamp', content))
        if not has_clamp:
            self.add_issue('P2', 'lesson-summary.js', 'NO_SCORE_CLAMP',
                          'No Math.min/max clamping for score bounds')

        # Check SHA-256 / checksum
        has_sha = bool(re.search(r'sha.*256|SHA.*256|crypto|checksum|digest|hash', content, re.IGNORECASE))
        if has_sha:
            # Verify checksum covers required fields
            has_lesson_id = bool(re.search(r'lessonId|lesson_id|lesson.*Id', content))
            has_timestamp = bool(re.search(r'timestamp|date|time', content, re.IGNORECASE))
            if not has_lesson_id:
                self.add_issue('P1', 'lesson-summary.js', 'CHECKSUM_NO_LESSON_ID',
                              'SHA-256 checksum may not include lessonId')
            if not has_timestamp:
                self.add_issue('P2', 'lesson-summary.js', 'CHECKSUM_NO_TIMESTAMP',
                              'SHA-256 checksum may not include timestamp')

            # Verify checksum validated on read
            has_verify = bool(re.search(r'verify.*checksum|validate.*hash|check.*integrity', content, re.IGNORECASE))
            if not has_verify:
                self.add_issue('P2', 'lesson-summary.js', 'NO_CHECKSUM_VERIFICATION',
                              'SHA-256 generated but no explicit verification on read found')
        else:
            self.add_issue('P2', 'lesson-summary.js', 'NO_ANTI_CHEAT',
                          'No SHA-256/crypto anti-cheat system found')

    def check_rpg_system(self):
        """3.2: RPG XP verification"""
        rpg_path = JS_DIR / "rpg-system.js"
        if not rpg_path.exists():
            self.add_issue('P2', 'rpg-system.js', 'FILE_MISSING',
                          'rpg-system.js not found')
            return

        content = rpg_path.read_text(encoding='utf-8', errors='replace')

        # Check XP rewards exist
        has_xp_rewards = bool(re.search(r'XP_REWARDS|xpRewards|xp.*reward', content, re.IGNORECASE))
        if not has_xp_rewards:
            self.add_issue('P2', 'rpg-system.js', 'NO_XP_REWARDS',
                          'No XP_REWARDS constants found')

        # Check level thresholds
        has_levels = bool(re.search(r'level.*threshold|LEVELS|levelUp|xp.*level', content, re.IGNORECASE))
        if not has_levels:
            self.add_issue('P2', 'rpg-system.js', 'NO_LEVEL_THRESHOLDS',
                          'No level threshold system found')

        # Check proficiency multipliers
        has_multipliers = bool(re.search(r'multiplier|minim|standard|performanta|0\.5|1\.0|1\.5', content, re.IGNORECASE))
        if not has_multipliers:
            self.add_issue('P2', 'rpg-system.js', 'NO_PROFICIENCY_MULTIPLIERS',
                          'No proficiency multiplier system found')

    def check_proficiency_system(self):
        """3.4: Proficiency gating verification"""
        prof_path = JS_DIR / "proficiency-system.js"
        if not prof_path.exists():
            self.add_issue('P2', 'proficiency-system.js', 'FILE_MISSING',
                          'proficiency-system.js not found')
            return

        content = prof_path.read_text(encoding='utf-8', errors='replace')

        # Check pass thresholds
        has_thresholds = bool(re.search(r'50|66|80|threshold|passRate|pass.*rate', content, re.IGNORECASE))
        if not has_thresholds:
            self.add_issue('P1', 'proficiency-system.js', 'NO_PASS_THRESHOLDS',
                          'No pass threshold values found (expected 50%, 66%, 80%)')

        # Check level filtering
        has_filtering = bool(re.search(r'filter|difficulty|level.*filter', content, re.IGNORECASE))
        if not has_filtering:
            self.add_issue('P2', 'proficiency-system.js', 'NO_LEVEL_FILTERING',
                          'No quiz item filtering by proficiency level found')

    def run_all(self):
        print("[Phase 3] Running scoring system audit...")
        self.check_lesson_summary()
        self.check_rpg_system()
        self.check_proficiency_system()
        print(f"  Found {len(self.issues)} scoring issues")
        return self.issues


# ============================================================
# PHASE 4: TECHNICAL FUNCTIONALITY
# ============================================================
class TechnicalAuditor:
    def __init__(self):
        self.issues = []

    def add_issue(self, severity, grade, module, file, code, desc):
        self.issues.append({
            'severity': severity,
            'grade': grade,
            'module': module,
            'file': file,
            'code': code,
            'description': desc
        })

    def check_js_load_order(self):
        """4.1: JS loading order in lessons"""
        # Expected order: atomic-learning -> quiz-bridge -> practice-simple -> lesson-summary
        required_order = [
            'atomic-learning.js',
            'quiz-bridge.js',
            'practice-simple.js',
            'lesson-summary.js'
        ]

        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                for lf in sorted(folder.glob('lectia*.html')):
                    try:
                        content = lf.read_text(encoding='utf-8', errors='replace')
                    except Exception:
                        continue

                    # Find positions of JS files
                    positions = {}
                    for js in required_order:
                        match = re.search(re.escape(js), content)
                        if match:
                            positions[js] = match.start()

                    # Check order
                    found_scripts = [(pos, name) for name, pos in positions.items()]
                    found_scripts.sort()
                    ordered_names = [name for _, name in found_scripts]

                    # Verify relative order of found scripts
                    for i in range(len(ordered_names)):
                        for j in range(i + 1, len(ordered_names)):
                            idx_i = required_order.index(ordered_names[i]) if ordered_names[i] in required_order else -1
                            idx_j = required_order.index(ordered_names[j]) if ordered_names[j] in required_order else -1
                            if idx_i > idx_j and idx_i >= 0 and idx_j >= 0:
                                self.add_issue('P1', grade, folder.name, lf.name,
                                               'WRONG_JS_ORDER',
                                               f'{ordered_names[i]} loaded before {ordered_names[j]}')

    def check_nav_links(self):
        """4.2: Navigation prev/next links"""
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                lessons = sorted(folder.glob('lectia*.html'))
                for lf in lessons:
                    try:
                        content = lf.read_text(encoding='utf-8', errors='replace')
                    except Exception:
                        continue

                    # Check for prev/next that all point to index
                    prev_links = re.findall(r'class="[^"]*prev[^"]*"[^>]*href="([^"]*)"', content)
                    next_links = re.findall(r'class="[^"]*next[^"]*"[^>]*href="([^"]*)"', content)

                    # Also check href patterns near prev/next text
                    prev_links += re.findall(r'href="([^"]*)"[^>]*class="[^"]*prev[^"]*"', content)
                    next_links += re.findall(r'href="([^"]*)"[^>]*class="[^"]*next[^"]*"', content)

                    all_nav = prev_links + next_links
                    if len(all_nav) >= 2:
                        all_same = all(l == all_nav[0] for l in all_nav)
                        if all_same and 'index' in all_nav[0]:
                            self.add_issue('P2', grade, folder.name, lf.name,
                                           'ALL_NAV_TO_INDEX',
                                           'All prev/next links point to index.html')

    def run_all(self):
        print("[Phase 4] Running technical checks...")
        self.check_js_load_order()
        self.check_nav_links()
        print(f"  Found {len(self.issues)} technical issues")
        return self.issues


# ============================================================
# PHASE 5: GAP ANALYSIS + COVERAGE MATRIX
# ============================================================
class CoverageAuditor:
    def __init__(self, content_map):
        self.cm = content_map
        self.issues = []
        self.coverage = {}  # grade -> module -> {expected, actual, coverage%, topics}

    def add_issue(self, severity, grade, module, file, code, desc):
        self.issues.append({
            'severity': severity,
            'grade': grade,
            'module': module,
            'file': file,
            'code': code,
            'description': desc
        })

    def build_coverage_matrix(self):
        """5.1: Match planificari topics to lesson files"""
        for grade, gdata in self.cm['grades'].items():
            self.coverage[grade] = {}
            cls_dir = CONTENT_DIR / f"cls{grade}"

            for mod_id, mdata in gdata['modules'].items():
                topics = mdata.get('topics', [])
                paths = mdata.get('content_paths', [])

                # Gather all lessons from content_paths
                lesson_files = []
                lesson_titles = []
                for cp in paths:
                    folder = cls_dir / cp
                    if folder.exists():
                        for lf in sorted(folder.glob('lectia*.html')):
                            lesson_files.append(lf)
                            try:
                                content = lf.read_text(encoding='utf-8', errors='replace')
                                # Extract title from <h1> or <title>
                                title_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
                                if not title_match:
                                    title_match = re.search(r'<title>(.*?)</title>', content)
                                title = title_match.group(1) if title_match else lf.stem
                                # Strip HTML tags from title
                                title = re.sub(r'<[^>]+>', '', title).strip()
                                lesson_titles.append(title)
                            except Exception:
                                lesson_titles.append(lf.stem)

                # Match topics to lessons (keyword-based)
                topic_coverage = []
                for topic in topics:
                    keywords = self._extract_keywords(topic)
                    matched = False
                    match_lesson = None
                    for i, title in enumerate(lesson_titles):
                        title_lower = title.lower()
                        fname_lower = lesson_files[i].stem.lower() if i < len(lesson_files) else ''
                        # Check if any keyword matches title or filename
                        matches = sum(1 for kw in keywords if kw in title_lower or kw in fname_lower)
                        if matches >= 1:
                            matched = True
                            match_lesson = lesson_files[i].name if i < len(lesson_files) else None
                            break
                    topic_coverage.append({
                        'topic': topic,
                        'status': 'COVERED' if matched else 'MISSING',
                        'matched_file': match_lesson
                    })

                covered = sum(1 for tc in topic_coverage if tc['status'] == 'COVERED')
                total = len(topics)
                pct = (covered / total * 100) if total > 0 else 0

                self.coverage[grade][mod_id] = {
                    'unit_name': mdata.get('unit_name', ''),
                    'expected_topics': total,
                    'actual_lessons': len(lesson_files),
                    'covered_topics': covered,
                    'coverage_pct': round(pct, 1),
                    'topics': topic_coverage
                }

                if total > 0 and pct < 50:
                    self.add_issue('P1', grade, mod_id, '',
                                   'LOW_COVERAGE',
                                   f"Only {pct:.0f}% topic coverage ({covered}/{total})")

    def _extract_keywords(self, topic):
        """Extract meaningful keywords from a topic string"""
        # Remove common Romanian words
        stopwords = {'si', 'de', 'in', 'la', 'cu', 'pe', 'din', 'un', 'o', 'ale', 'al',
                     'sau', 'pentru', 'prin', 'care', 'este', 'sunt', 'nu', 'ca', 'mai'}
        words = re.findall(r'\w+', topic.lower())
        keywords = [w for w in words if w not in stopwords and len(w) > 2]
        return keywords

    def check_extra_folders(self):
        """5.2: Extra folder audit"""
        # Collect all referenced content_paths
        referenced = set()
        for grade, gdata in self.cm['grades'].items():
            for mod_id, mdata in gdata['modules'].items():
                for cp in mdata.get('content_paths', []):
                    referenced.add(f"cls{grade}/{cp}")

        # Find all actual folders
        for grade in ['5', '6', '7', '8']:
            cls_dir = CONTENT_DIR / f"cls{grade}"
            if not cls_dir.exists():
                continue
            for folder in sorted(cls_dir.iterdir()):
                if not folder.is_dir():
                    continue
                rel = f"cls{grade}/{folder.name}"
                if rel not in referenced:
                    # Check if it has any lesson content
                    lessons = list(folder.glob('lectia*.html'))
                    if lessons:
                        self.add_issue('P3', grade, folder.name, '',
                                       'UNREFERENCED_FOLDER',
                                       f"Folder with {len(lessons)} lessons not in content_map.json")

    def run_all(self):
        print("[Phase 5] Running gap analysis...")
        self.build_coverage_matrix()
        self.check_extra_folders()
        print(f"  Found {len(self.issues)} coverage issues")
        return self.issues, self.coverage


# ============================================================
# REPORT GENERATION
# ============================================================
def generate_report(structural_issues, scoring_issues, technical_issues,
                    coverage_issues, coverage_matrix, structural_stats):
    """Phase 6: Generate comprehensive report"""
    all_issues = structural_issues + scoring_issues + technical_issues + coverage_issues

    # Count by severity
    severity_counts = Counter(i['severity'] for i in all_issues)

    # Count by code
    code_counts = Counter(i['code'] for i in all_issues)

    # Build summary
    report = {
        'timestamp': datetime.now().isoformat(),
        'summary': {
            'total_issues': len(all_issues),
            'by_severity': dict(severity_counts),
            'p0_critical': severity_counts.get('P0', 0),
            'p1_high': severity_counts.get('P1', 0),
            'p2_medium': severity_counts.get('P2', 0),
            'p3_low': severity_counts.get('P3', 0),
        },
        'stats': structural_stats,
        'by_code': dict(code_counts.most_common(30)),
        'coverage_matrix': coverage_matrix,
        'all_issues': all_issues
    }

    # Save JSON report
    report_path = BASE_DIR / "tools" / "audit_report.json"
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    # Print console summary
    print("\n" + "=" * 70)
    print("LEARNINGHUB COMPREHENSIVE AUDIT REPORT")
    print("=" * 70)
    print(f"Date: {report['timestamp']}")
    print(f"\nTotal lessons scanned: {structural_stats.get('total_lessons', 0)}")
    print(f"Total quizzes scanned: {structural_stats.get('total_quizzes', 0)}")
    print(f"Total modules: {structural_stats.get('total_modules', 0)}")

    print(f"\nLessons per grade:")
    for g, count in sorted(structural_stats.get('lessons_per_grade', {}).items()):
        print(f"  cls{g}: {count} lessons, {structural_stats['modules_per_grade'].get(g, 0)} module folders")

    print(f"\n{'='*70}")
    print("ISSUE SUMMARY")
    print(f"{'='*70}")
    print(f"  P0 CRITICAL: {severity_counts.get('P0', 0)}")
    print(f"  P1 HIGH:     {severity_counts.get('P1', 0)}")
    print(f"  P2 MEDIUM:   {severity_counts.get('P2', 0)}")
    print(f"  P3 LOW:      {severity_counts.get('P3', 0)}")
    print(f"  TOTAL:       {len(all_issues)}")

    print(f"\nTop issue types:")
    for code, count in code_counts.most_common(15):
        print(f"  {code}: {count}")

    # P0 and P1 details
    critical = [i for i in all_issues if i['severity'] in ('P0', 'P1')]
    if critical:
        print(f"\n{'='*70}")
        print("P0/P1 CRITICAL + HIGH ISSUES (must fix)")
        print(f"{'='*70}")
        for i in critical:
            loc = f"cls{i['grade']}/{i['module']}/{i['file']}" if i['grade'] != '-' else i['file']
            print(f"  [{i['severity']}] {i['code']}: {loc}")
            print(f"        {i['description']}")

    # Coverage matrix
    print(f"\n{'='*70}")
    print("COVERAGE MATRIX (planificari topic coverage)")
    print(f"{'='*70}")
    print(f"{'Grade':<6} {'Module':<6} {'Unit':<40} {'Topics':<8} {'Covered':<8} {'%':>5}")
    print("-" * 75)
    for grade in sorted(coverage_matrix.keys()):
        for mod_id in sorted(coverage_matrix[grade].keys()):
            m = coverage_matrix[grade][mod_id]
            unit = m['unit_name'][:38]
            pct = m['coverage_pct']
            flag = ' !!!' if pct < 50 else ' !' if pct < 80 else ''
            print(f"cls{grade:<3} {mod_id:<6} {unit:<40} {m['expected_topics']:<8} {m['covered_topics']:<8} {pct:>4.0f}%{flag}")

    # Missing topics detail
    print(f"\n{'='*70}")
    print("MISSING TOPICS (not matched to any lesson)")
    print(f"{'='*70}")
    for grade in sorted(coverage_matrix.keys()):
        for mod_id in sorted(coverage_matrix[grade].keys()):
            m = coverage_matrix[grade][mod_id]
            missing = [t for t in m['topics'] if t['status'] == 'MISSING']
            if missing:
                print(f"\n  cls{grade} {mod_id} - {m['unit_name']}:")
                for t in missing:
                    print(f"    - {t['topic']}")

    print(f"\n{'='*70}")
    print(f"Full report saved to: {report_path}")
    print(f"{'='*70}")

    return report


# ============================================================
# MAIN
# ============================================================
def main():
    print("LearningHub Comprehensive Audit")
    print("================================\n")

    cm = load_content_map()

    # Phase 1: Structural
    struct = StructuralAuditor(cm)
    struct_issues = struct.run_all()

    # Phase 3: Scoring
    scoring = ScoringAuditor()
    scoring_issues = scoring.run_all()

    # Phase 4: Technical
    tech = TechnicalAuditor()
    tech_issues = tech.run_all()

    # Phase 5: Coverage
    coverage = CoverageAuditor(cm)
    coverage_issues, coverage_matrix = coverage.run_all()

    # Phase 6: Report
    report = generate_report(
        struct_issues, scoring_issues, tech_issues,
        coverage_issues, coverage_matrix, struct.stats
    )

    # Return code based on P0 count
    p0_count = report['summary']['p0_critical']
    if p0_count > 0:
        print(f"\n!!! {p0_count} CRITICAL (P0) ISSUES FOUND !!!")
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
