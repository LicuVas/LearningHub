"""
Add enhanced quiz system to all LearningHub lesson pages.
Adds quiz.js and initializes Quiz system to override default checkAnswers.

Run: python add_quiz_enhancements.py
"""

import os
import re
from pathlib import Path

# Base directory
BASE_DIR = Path(r"C:\AI\Projects\LearningHub")
CONTENT_DIR = BASE_DIR / "content" / "tic"


def get_quiz_script_path(html_path: Path) -> str:
    """Get correct relative path to quiz.js based on file location"""
    rel = html_path.relative_to(CONTENT_DIR)
    depth = len(rel.parts) - 1  # -1 for the filename itself

    # content/tic/cls6/m1-prezentari/lectia1.html -> depth = 2
    # Need: ../../../../assets/js/quiz.js
    ups = "../" * (depth + 2)  # +2 for content/tic
    return f"{ups}assets/js/quiz.js"


def has_quiz(content: str) -> bool:
    """Check if file contains quiz questions"""
    return 'quiz-question' in content and 'data-correct=' in content


def count_questions(content: str) -> int:
    """Count number of quiz questions"""
    return content.count('quiz-question')


def get_passing_score(total: int) -> int:
    """Calculate passing score (typically 75% rounded)"""
    if total <= 3:
        return total - 1  # Allow 1 wrong
    elif total <= 5:
        return total - 1  # 4/5 or 3/4
    else:
        return int(total * 0.75)  # 75% for larger quizzes


def create_quiz_init_script(script_path: str, total_questions: int) -> str:
    """Create the Quiz initialization script block"""
    passing = get_passing_score(total_questions)

    return f'''
    <!-- Enhanced Quiz System -->
    <script src="{script_path}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            Quiz.init({{
                passingScore: {passing},
                totalQuestions: {total_questions},
                explanations: {{}}  // Can be populated with question-specific explanations
            }});
        }});
    </script>'''


def add_quiz_to_file(html_path: Path, dry_run: bool = False) -> bool:
    """Add quiz enhancements to a single HTML file"""
    try:
        content = html_path.read_text(encoding='utf-8')

        # Skip if no quiz
        if not has_quiz(content):
            return False

        # Skip if already has quiz.js
        if 'quiz.js' in content:
            print(f"  [SKIP] Already has quiz.js: {html_path.name}")
            return False

        # Count questions
        total = count_questions(content)

        # Get script path
        script_path = get_quiz_script_path(html_path)

        # Create quiz script
        quiz_script = create_quiz_init_script(script_path, total)

        # Find where to insert (before </body>)
        if '</body>' in content:
            content = content.replace('</body>', quiz_script + '\n</body>')
        else:
            content += quiz_script

        if dry_run:
            print(f"  [DRY] Would add quiz ({total} questions): {html_path.name}")
        else:
            html_path.write_text(content, encoding='utf-8')
            print(f"  [OK] Added quiz ({total} questions): {html_path.name}")

        return True

    except Exception as e:
        print(f"  [ERR] Failed {html_path.name}: {e}")
        return False


def process_all_files(dry_run: bool = False):
    """Process all HTML files in content/tic directory"""
    print(f"Adding quiz enhancements to LearningHub...")
    print(f"Base: {CONTENT_DIR}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print("-" * 50)

    updated = 0
    skipped = 0
    no_quiz = 0

    # Find all HTML files (only lesson files, not index)
    for html_path in CONTENT_DIR.rglob("*.html"):
        # Skip index files
        if html_path.name == 'index.html':
            continue

        result = add_quiz_to_file(html_path, dry_run)
        if result:
            updated += 1
        elif result is False:
            # Check why skipped
            content = html_path.read_text(encoding='utf-8')
            if not has_quiz(content):
                no_quiz += 1
            else:
                skipped += 1

    print("-" * 50)
    print(f"Summary: {updated} updated, {skipped} already had quiz.js, {no_quiz} without quizzes")


if __name__ == "__main__":
    import sys

    dry_run = "--dry" in sys.argv
    process_all_files(dry_run=dry_run)
