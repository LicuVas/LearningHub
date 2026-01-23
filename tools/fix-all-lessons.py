#!/usr/bin/env python3
"""
LearningHub Lesson Fixer
=========================
Fixes all identified issues in lesson files.
"""

import os
import re
from pathlib import Path

CONTENT_DIR = Path(__file__).parent.parent / "content" / "tic"

class LessonFixer:
    def __init__(self):
        self.fixed_count = 0
        self.fix_details = []

    def count_quiz_questions(self, content: str) -> int:
        """Count actual quiz questions in the lesson."""
        matches = re.findall(r'onclick="checkAnswer\((\d+),', content)
        if matches:
            return len(set(matches))
        feedbacks = re.findall(r'id="feedback(\d+)"', content)
        if feedbacks:
            return len(set(feedbacks))
        return 0

    def get_lesson_id(self, filepath: Path) -> str:
        """Generate lesson ID from file path."""
        rel_path = filepath.relative_to(CONTENT_DIR)
        parts = list(rel_path.parts)
        parts[-1] = parts[-1].replace('.html', '')
        return '-'.join(parts)

    def get_relative_path_prefix(self, filepath: Path) -> str:
        """Get the relative path prefix for assets (e.g., ../../../../)."""
        rel_path = filepath.relative_to(CONTENT_DIR)
        depth = len(rel_path.parts) - 1  # -1 for the file itself
        return '../' * (depth + 1)

    def fix_lesson(self, filepath: Path) -> list:
        """Fix all issues in a lesson file."""
        fixes_applied = []

        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        original_content = content
        lesson_id = self.get_lesson_id(filepath)
        prefix = self.get_relative_path_prefix(filepath)

        # Check what exists
        has_quiz_bridge = 'quiz-bridge.js' in content
        has_quiz_bridge_init = 'QuizBridge.init' in content
        has_lesson_summary = 'lesson-summary.js' in content
        has_lesson_summary_init = 'LessonSummary.init' in content
        has_lesson_summary_div = 'id="lesson-summary"' in content
        has_practice_simple = 'practice-simple.js' in content
        has_practice_simple_init = 'PracticeSimple.init' in content
        has_practice_section = 'practice-advanced' in content or 'practice-exercise' in content
        has_inline_check_answer = re.search(r'function\s+checkAnswer\s*\(', content) is not None
        has_ready_state = 'document.readyState' in content
        actual_questions = self.count_quiz_questions(content)

        # Fix 1: Add #lesson-summary div if missing
        if not has_lesson_summary_div and '</main>' in content:
            div_html = '''
    <!-- Lesson Summary & Export -->
    <div id="lesson-summary" style="display: none;"></div>
'''
            content = content.replace('</main>', f'</main>\n{div_html}')
            fixes_applied.append('Added #lesson-summary div')

        # Fix 2: Add practice-simple.js if needed
        if has_practice_section and not has_practice_simple:
            # Find a good insertion point (before </body> or after other scripts)
            script_tag = f'    <script src="{prefix}assets/js/practice-simple.js"></script>\n'

            if 'LearningProgress.init' in content:
                # Insert before LearningProgress.init script
                pattern = r'(<script>\s*\n\s*LearningProgress\.init)'
                content = re.sub(pattern, script_tag + r'\1', content)
                fixes_applied.append('Added practice-simple.js')

        # Fix 3: Add PracticeSimple.init if needed
        if has_practice_section and not has_practice_simple_init:
            init_script = f'''    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            if (typeof PracticeSimple !== 'undefined') {{
                PracticeSimple.init('{lesson_id}');
            }}
        }});
    </script>
'''
            if 'LearningProgress.init' in content:
                pattern = r'(<script>\s*\n\s*LearningProgress\.init)'
                content = re.sub(pattern, init_script + r'\1', content)
                fixes_applied.append('Added PracticeSimple.init()')

        # Fix 4: Add lesson-summary.js if missing
        if not has_lesson_summary:
            script_tag = f'    <!-- Lesson Summary System -->\n    <script src="{prefix}assets/js/lesson-summary.js"></script>\n'

            if '</head>' in content:
                # Try to add near other scripts at the end
                if '</body>' in content:
                    # Find insertion point - before breadcrumb.js or </body>
                    if 'breadcrumb.js' in content:
                        content = content.replace(
                            '<!-- Breadcrumb Navigation -->',
                            script_tag + '    <!-- Breadcrumb Navigation -->'
                        )
                    else:
                        content = content.replace('</body>', script_tag + '</body>')
                    fixes_applied.append('Added lesson-summary.js')

        # Fix 5: Add LessonSummary.init if missing
        if not has_lesson_summary_init:
            init_script = f'''    <script>
        if (typeof LessonSummary !== 'undefined') {{
            LessonSummary.init('{lesson_id}');
        }}
    </script>
'''
            if '</body>' in content:
                content = content.replace('</body>', init_script + '</body>')
                fixes_applied.append('Added LessonSummary.init()')

        # Fix 6: Add quiz-bridge.js if has inline checkAnswer
        if has_inline_check_answer and actual_questions > 0 and not has_quiz_bridge:
            script_tag = f'    <!-- Quiz Bridge -->\n    <script src="{prefix}assets/js/quiz-bridge.js"></script>\n'

            if 'lesson-summary.js' in content:
                content = content.replace(
                    '<!-- Lesson Summary System -->',
                    '<!-- Quiz Bridge -->\n' + f'    <script src="{prefix}assets/js/quiz-bridge.js"></script>\n    <!-- Lesson Summary System -->'
                )
            elif '</body>' in content:
                content = content.replace('</body>', script_tag + '</body>')
            fixes_applied.append('Added quiz-bridge.js')

        # Fix 7: Add QuizBridge.init with correct totalQuestions and readyState
        if has_inline_check_answer and actual_questions > 0:
            # Check if init exists and needs fixing
            init_match = re.search(r'QuizBridge\.init\([^)]+\)', content)

            if init_match:
                # Fix existing init - update totalQuestions and add readyState
                old_init_block = re.search(
                    r'<script>\s*(?:document\.addEventListener\([\'"]DOMContentLoaded[\'"],\s*function\(\)\s*\{)?\s*QuizBridge\.init\([^)]+\);?\s*(?:\}\);?)?\s*</script>',
                    content,
                    re.DOTALL
                )

                if old_init_block:
                    new_init = f'''<script>
        if (document.readyState === 'loading') {{
            document.addEventListener('DOMContentLoaded', function() {{
                QuizBridge.init('{lesson_id}', {{ totalQuestions: {actual_questions} }});
            }});
        }} else {{
            QuizBridge.init('{lesson_id}', {{ totalQuestions: {actual_questions} }});
        }}
    </script>'''
                    content = content.replace(old_init_block.group(0), new_init)
                    fixes_applied.append(f'Fixed QuizBridge.init (totalQuestions={actual_questions}, added readyState)')

            elif not has_quiz_bridge_init:
                # Add new init
                init_script = f'''    <script>
        if (document.readyState === 'loading') {{
            document.addEventListener('DOMContentLoaded', function() {{
                QuizBridge.init('{lesson_id}', {{ totalQuestions: {actual_questions} }});
            }});
        }} else {{
            QuizBridge.init('{lesson_id}', {{ totalQuestions: {actual_questions} }});
        }}
    </script>
'''
                # Insert after quiz-bridge.js
                if 'quiz-bridge.js' in content:
                    content = re.sub(
                        r'(<script src="[^"]*quiz-bridge\.js"></script>)',
                        r'\1\n' + init_script,
                        content
                    )
                    fixes_applied.append(f'Added QuizBridge.init (totalQuestions={actual_questions})')

        # Save if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            self.fixed_count += 1
            self.fix_details.append((filepath, fixes_applied))

        return fixes_applied

    def fix_all(self):
        """Fix all lessons in all classes."""
        classes = ['cls5', 'cls6', 'cls7', 'cls8']

        for cls in classes:
            cls_dir = CONTENT_DIR / cls
            if not cls_dir.exists():
                continue

            print(f"\n=== Processing {cls.upper()} ===")

            for module_dir in sorted(cls_dir.iterdir()):
                if not module_dir.is_dir():
                    continue

                for lesson_file in sorted(module_dir.glob('lectia*.html')):
                    fixes = self.fix_lesson(lesson_file)
                    if fixes:
                        rel_path = lesson_file.relative_to(CONTENT_DIR)
                        print(f"  Fixed: {rel_path}")
                        for fix in fixes:
                            print(f"    - {fix}")

        print(f"\n=== SUMMARY ===")
        print(f"Total files fixed: {self.fixed_count}")


def main():
    fixer = LessonFixer()
    fixer.fix_all()


if __name__ == '__main__':
    main()
