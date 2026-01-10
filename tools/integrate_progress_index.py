"""
Integrate progress.js into module index HTML files
"""
import os
import re
from pathlib import Path

BASE_DIR = Path(r"C:\AI\Projects\LearningHub\content\tic")

def get_module_info(filepath):
    """Extract grade and module from file path"""
    parts = filepath.parts
    for i, part in enumerate(parts):
        if part.startswith('cls'):
            grade = part
            if i + 1 < len(parts):
                module = parts[i + 1]
                if module.startswith('m'):
                    return grade, module
    return None, None

def count_lessons(filepath):
    """Count lesson files in the same directory"""
    parent = filepath.parent
    lessons = list(parent.glob("lectia*.html"))
    return len(lessons)

def calculate_relative_path(filepath):
    """Calculate relative path to assets/js/progress.js"""
    rel_parts = filepath.relative_to(BASE_DIR).parts
    depth = len(rel_parts) - 1
    return "../" * depth + "../../assets/js/progress.js"

def integrate_progress_index(filepath):
    """Add progress.js integration to a module index file"""
    grade, module = get_module_info(filepath)
    if not grade or not module:
        print(f"  Skipping {filepath}: couldn't parse info")
        return False

    total_lessons = count_lessons(filepath)
    if total_lessons == 0:
        total_lessons = 6  # Default

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already integrated
    if 'LearningProgress.updateModuleProgress' in content:
        print(f"  Already integrated: {filepath.name} ({grade}/{module})")
        return False

    script_path = calculate_relative_path(filepath)

    # Integration script
    integration_script = f'''
    <!-- Progress Tracking -->
    <script src="{script_path}"></script>
    <script>
        // Update module progress on page load
        document.addEventListener('DOMContentLoaded', function() {{
            LearningProgress.updateModuleProgress('{grade}', '{module}', {total_lessons});
        }});
    </script>
'''

    # Replace the placeholder script or add before </body>
    if '// Future: Track progress' in content:
        # Replace placeholder script
        content = re.sub(
            r'<script>\s*// Future: Track progress.*?</script>',
            integration_script.strip(),
            content,
            flags=re.DOTALL
        )
    elif '</body>' in content:
        content = content.replace('</body>', integration_script + '</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  Integrated: {filepath.name} -> {grade}/{module} ({total_lessons} lessons)")
    return True

def main():
    """Process all module index files"""
    print("Integrating progress.js into module index files...\n")

    # Find all index.html files in module folders (m1-*, m2-*, etc.)
    index_files = []
    for grade_dir in BASE_DIR.iterdir():
        if grade_dir.is_dir() and grade_dir.name.startswith('cls'):
            for module_dir in grade_dir.iterdir():
                if module_dir.is_dir() and module_dir.name.startswith('m'):
                    index_file = module_dir / 'index.html'
                    if index_file.exists():
                        index_files.append(index_file)

    print(f"Found {len(index_files)} module index files\n")

    integrated = 0
    skipped = 0

    for filepath in sorted(index_files):
        if integrate_progress_index(filepath):
            integrated += 1
        else:
            skipped += 1

    print(f"\nDone! Integrated: {integrated}, Skipped: {skipped}")

if __name__ == "__main__":
    main()
