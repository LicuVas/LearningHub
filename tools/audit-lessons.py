#!/usr/bin/env python3
"""
LearningHub Lesson Auditor
===========================
Scans all lessons and checks for common issues.

Checks:
1. quiz-bridge.js inclusion and init
2. lesson-summary.js inclusion and init
3. practice-simple.js inclusion and init
4. Correct totalQuestions value
5. readyState check for initialization
6. #lesson-summary div exists
7. Script load order
"""

import os
import re
from pathlib import Path
from collections import defaultdict

CONTENT_DIR = Path(__file__).parent.parent / "content" / "tic"

class LessonAuditor:
    def __init__(self):
        self.issues = defaultdict(list)
        self.stats = {
            'total_lessons': 0,
            'lessons_with_issues': 0,
            'issues_by_type': defaultdict(int)
        }

    def count_quiz_questions(self, content: str) -> int:
        """Count actual quiz questions in the lesson."""
        # Pattern: onclick="checkAnswer(N, ..." where N is unique
        matches = re.findall(r'onclick="checkAnswer\((\d+),', content)
        if matches:
            return len(set(matches))

        # Alternative: count .quiz-question divs
        quiz_questions = len(re.findall(r'class="quiz-question"', content))
        if quiz_questions > 0:
            return quiz_questions

        # Alternative: count feedback divs
        feedbacks = re.findall(r'id="feedback(\d+)"', content)
        if feedbacks:
            return len(set(feedbacks))

        return 0

    def get_init_total_questions(self, content: str) -> int:
        """Get totalQuestions value from QuizBridge.init()."""
        match = re.search(r'QuizBridge\.init\([^,]+,\s*\{\s*totalQuestions:\s*(\d+)', content)
        if match:
            return int(match.group(1))
        return None

    def audit_lesson(self, filepath: Path) -> dict:
        """Audit a single lesson file."""
        issues = []

        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Check 1: quiz-bridge.js inclusion
        has_quiz_bridge = 'quiz-bridge.js' in content
        has_quiz_bridge_init = 'QuizBridge.init' in content

        # Check 2: lesson-summary.js inclusion
        has_lesson_summary = 'lesson-summary.js' in content
        has_lesson_summary_init = 'LessonSummary.init' in content

        # Check 3: practice-simple.js inclusion
        has_practice_simple = 'practice-simple.js' in content
        has_practice_simple_init = 'PracticeSimple.init' in content
        has_practice_section = 'practice-advanced' in content or 'practice-exercise' in content

        # Check 4: Quiz questions count
        actual_questions = self.count_quiz_questions(content)
        init_questions = self.get_init_total_questions(content)

        # Check 5: readyState check
        has_ready_state_check = 'document.readyState' in content

        # Check 6: #lesson-summary div
        has_lesson_summary_div = 'id="lesson-summary"' in content

        # Check 7: Inline checkAnswer function
        has_inline_check_answer = re.search(r'function\s+checkAnswer\s*\(', content) is not None

        # Generate issues
        if has_inline_check_answer and actual_questions > 0:
            if not has_quiz_bridge:
                issues.append(('MISSING_QUIZ_BRIDGE_JS', 'quiz-bridge.js not included'))
                self.stats['issues_by_type']['MISSING_QUIZ_BRIDGE_JS'] += 1

            if not has_quiz_bridge_init:
                issues.append(('MISSING_QUIZ_BRIDGE_INIT', 'QuizBridge.init() not called'))
                self.stats['issues_by_type']['MISSING_QUIZ_BRIDGE_INIT'] += 1

            if init_questions is not None and init_questions != actual_questions:
                issues.append(('WRONG_TOTAL_QUESTIONS', f'totalQuestions={init_questions} but actual={actual_questions}'))
                self.stats['issues_by_type']['WRONG_TOTAL_QUESTIONS'] += 1

            if has_quiz_bridge_init and not has_ready_state_check:
                issues.append(('MISSING_READY_STATE', 'No readyState check for QuizBridge.init'))
                self.stats['issues_by_type']['MISSING_READY_STATE'] += 1

        if not has_lesson_summary:
            issues.append(('MISSING_LESSON_SUMMARY_JS', 'lesson-summary.js not included'))
            self.stats['issues_by_type']['MISSING_LESSON_SUMMARY_JS'] += 1

        if not has_lesson_summary_init:
            issues.append(('MISSING_LESSON_SUMMARY_INIT', 'LessonSummary.init() not called'))
            self.stats['issues_by_type']['MISSING_LESSON_SUMMARY_INIT'] += 1

        if has_lesson_summary_init and not has_lesson_summary_div:
            issues.append(('MISSING_LESSON_SUMMARY_DIV', 'No #lesson-summary div for grade display'))
            self.stats['issues_by_type']['MISSING_LESSON_SUMMARY_DIV'] += 1

        if has_practice_section:
            if not has_practice_simple:
                issues.append(('MISSING_PRACTICE_SIMPLE_JS', 'practice-simple.js not included'))
                self.stats['issues_by_type']['MISSING_PRACTICE_SIMPLE_JS'] += 1

            if not has_practice_simple_init:
                issues.append(('MISSING_PRACTICE_SIMPLE_INIT', 'PracticeSimple.init() not called'))
                self.stats['issues_by_type']['MISSING_PRACTICE_SIMPLE_INIT'] += 1

        return {
            'filepath': filepath,
            'issues': issues,
            'actual_questions': actual_questions,
            'init_questions': init_questions,
            'has_quiz': has_inline_check_answer and actual_questions > 0,
            'has_practice': has_practice_section
        }

    def audit_all(self):
        """Audit all lessons in all classes."""
        classes = ['cls5', 'cls6', 'cls7', 'cls8']

        results = {}

        for cls in classes:
            cls_dir = CONTENT_DIR / cls
            if not cls_dir.exists():
                continue

            results[cls] = {}

            # Find all modules
            for module_dir in sorted(cls_dir.iterdir()):
                if not module_dir.is_dir():
                    continue

                module_name = module_dir.name
                results[cls][module_name] = []

                # Find all lesson files
                for lesson_file in sorted(module_dir.glob('lectia*.html')):
                    self.stats['total_lessons'] += 1

                    audit_result = self.audit_lesson(lesson_file)
                    results[cls][module_name].append(audit_result)

                    if audit_result['issues']:
                        self.stats['lessons_with_issues'] += 1
                        rel_path = lesson_file.relative_to(CONTENT_DIR)
                        self.issues[str(rel_path)] = audit_result['issues']

        return results

    def print_report(self, results):
        """Print audit report."""
        print("=" * 70)
        print("LEARNINGHUB LESSON AUDIT REPORT")
        print("=" * 70)

        for cls in sorted(results.keys()):
            print(f"\n### {cls.upper()} ###")

            for module in sorted(results[cls].keys()):
                lessons = results[cls][module]
                issues_in_module = sum(1 for l in lessons if l['issues'])

                if issues_in_module > 0:
                    print(f"\n  {module}: {issues_in_module}/{len(lessons)} lessons with issues")

                    for lesson in lessons:
                        if lesson['issues']:
                            fname = lesson['filepath'].name
                            print(f"    - {fname}")
                            for issue_type, issue_desc in lesson['issues']:
                                print(f"        [{issue_type}] {issue_desc}")

        print("\n" + "=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Total lessons scanned: {self.stats['total_lessons']}")
        print(f"Lessons with issues: {self.stats['lessons_with_issues']}")
        print(f"\nIssues by type:")
        for issue_type, count in sorted(self.stats['issues_by_type'].items(), key=lambda x: -x[1]):
            print(f"  {issue_type}: {count}")


def main():
    auditor = LessonAuditor()
    results = auditor.audit_all()
    auditor.print_report(results)


if __name__ == '__main__':
    main()
