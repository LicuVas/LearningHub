"""
Integrate progress.js into all lesson HTML files
"""
import os
import re
from pathlib import Path

BASE_DIR = Path(r"C:\AI\Projects\LearningHub\content\tic")

def get_lesson_info(filepath):
    """Extract grade, module, and lesson ID from file path"""
    parts = filepath.parts
    # Find cls folder
    for i, part in enumerate(parts):
        if part.startswith('cls'):
            grade = part  # e.g., 'cls5'
            if i + 1 < len(parts):
                module = parts[i + 1]  # e.g., 'm3-word'
                filename = filepath.stem  # e.g., 'lectia1-primul-document'
                # Extract lesson number
                match = re.match(r'lectia(\d+)', filename)
                if match:
                    lesson_id = f"lectia{match.group(1)}"
                    return grade, module, lesson_id
    return None, None, None

def calculate_relative_path(filepath):
    """Calculate relative path to assets/js/progress.js"""
    # Count depth from content/tic
    rel_parts = filepath.relative_to(BASE_DIR).parts
    # Typically: cls5/m1-sisteme/lectia1.html = 3 levels
    depth = len(rel_parts) - 1  # -1 for the file itself
    return "../" * depth + "../../assets/js/progress.js"

def integrate_progress(filepath):
    """Add progress.js integration to a lesson file"""
    grade, module, lesson_id = get_lesson_info(filepath)
    if not all([grade, module, lesson_id]):
        print(f"  Skipping {filepath.name}: couldn't parse info")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already integrated
    if 'LearningProgress.init' in content:
        print(f"  Already integrated: {filepath.name}")
        return False

    # Calculate relative path for script src
    script_path = calculate_relative_path(filepath)

    # Integration script block
    integration_script = f'''
    <!-- Progress Tracking -->
    <script src="{script_path}"></script>
    <script>
        LearningProgress.init('{grade}', '{module}', '{lesson_id}');

        // Auto-mark complete when reaching completion section
        const originalGoToStep = goToStep;
        goToStep = function(step) {{
            originalGoToStep(step);
            if (step === 'complete') {{
                LearningProgress.markComplete();
            }}
        }};
    </script>
'''

    # Find insertion point - before </body>
    if '</body>' in content:
        content = content.replace('</body>', integration_script + '</body>')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"  Integrated: {filepath.name} -> {grade}/{module}/{lesson_id}")
        return True
    else:
        print(f"  Skipping {filepath.name}: no </body> tag found")
        return False

def main():
    """Process all lesson files"""
    print("Integrating progress.js into lesson files...\n")

    lesson_files = list(BASE_DIR.rglob("lectia*.html"))
    print(f"Found {len(lesson_files)} lesson files\n")

    integrated = 0
    skipped = 0

    for filepath in sorted(lesson_files):
        if integrate_progress(filepath):
            integrated += 1
        else:
            skipped += 1

    print(f"\nDone! Integrated: {integrated}, Skipped: {skipped}")

if __name__ == "__main__":
    main()
