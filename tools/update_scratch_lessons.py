"""
Update remaining Scratch lessons to use the scratch-blocks.css system
with bilingual support (Romanian/English)
"""
import re
from pathlib import Path

# Lessons that need updating (m2-scratch module)
lessons_to_update = [
    "lectia4-variabile.html",
    "lectia5-conditii.html",
    "lectia6-bucle.html",
    "lectia1-interfata.html"
]

m2_path = Path(r"C:\AI\Projects\LearningHub\content\tic\cls6\m2-scratch")

def add_scratch_css(content):
    """Add scratch-blocks.css link if not present"""
    if "scratch-blocks.css" not in content:
        # Add after the Inter font link
        content = content.replace(
            'rel="stylesheet">\n    <style>',
            'rel="stylesheet">\n    <!-- Authentic Scratch Blocks -->\n    <link rel="stylesheet" href="../../../../assets/css/scratch-blocks.css">\n    <style>'
        )
    return content

def add_scratch_js(content):
    """Add scratch-blocks.js script if not present"""
    if "scratch-blocks.js" not in content:
        # Add before progress tracking scripts
        content = content.replace(
            '<!-- Progress Tracking -->',
            '<!-- Scratch Blocks Language Toggle -->\n    <script src="../../../../assets/js/scratch-blocks.js"></script>\n\n    <!-- Progress Tracking -->'
        )
    return content

def process_file(filepath):
    """Process a single lesson file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add CSS and JS
    content = add_scratch_css(content)
    content = add_scratch_js(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated: {filepath.name}")

def main():
    for lesson in lessons_to_update:
        filepath = m2_path / lesson
        if filepath.exists():
            process_file(filepath)
        else:
            print(f"Not found: {lesson}")

    print("\nDone! Note: Block replacements should be done manually for accuracy.")

if __name__ == "__main__":
    main()
