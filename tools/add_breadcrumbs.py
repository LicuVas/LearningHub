"""
Add breadcrumb navigation to all LearningHub HTML pages.
Removes old "Inapoi" style links and adds consistent breadcrumb nav.

Run: python add_breadcrumbs.py
"""

import os
import re
from pathlib import Path

# Base directory
BASE_DIR = Path(r"C:\AI\Projects\LearningHub")
CONTENT_DIR = BASE_DIR / "content" / "tic"

# Grade display names
GRADE_NAMES = {
    'cls5': 'Clasa a V-a',
    'cls6': 'Clasa a VI-a',
    'cls7': 'Clasa a VII-a',
    'cls8': 'Clasa a VIII-a',
    'cls9': 'Clasa a IX-a',
    'cls10': 'Clasa a X-a',
    'cls11': 'Clasa a XI-a',
    'cls12': 'Clasa a XII-a',
}

# Module display names (extracted from actual module names)
MODULE_PATTERNS = {
    'm1-sisteme': 'Modulul 1: Sisteme',
    'm1-prezentari': 'Modulul 1: Prezentari',
    'm1-baze-date': 'Modulul 1: Baze de date',
    'm1-subprograme': 'Modulul 1: Subprograme',
    'm2-birotice': 'Modulul 2: Birotice',
    'm2-scratch': 'Modulul 2: Scratch',
    'm2-multimedia': 'Modulul 2: Multimedia',
    'm2-structuri-date': 'Modulul 2: Structuri date',
    'm3-word': 'Modulul 3: Word',
    'm3-scratch-control': 'Modulul 3: Structuri control',
    'm3-cpp-algorithms': 'Modulul 3: Algoritmi C++',
    'm3-databases': 'Modulul 3: Baze de date',
    'm4-siguranta': 'Modulul 4: Siguranta',
    'm4-comunicare': 'Modulul 4: Comunicare',
    'm4-web': 'Modulul 4: Web',
    'm5-proiect': 'Modulul 5: Proiect',
    'm5-recapitulare': 'Modulul 5: Recapitulare',
}


def get_relative_path_depth(html_path: Path) -> int:
    """Calculate how deep the file is from content/tic"""
    rel = html_path.relative_to(CONTENT_DIR)
    return len(rel.parts) - 1  # -1 for the filename itself


def get_breadcrumb_script_path(html_path: Path) -> str:
    """Get correct relative path to breadcrumb.js"""
    depth = get_relative_path_depth(html_path)

    # From content/tic/cls6/m1-prezentari/lectia1.html -> depth = 2
    # Need: ../../../../assets/js/breadcrumb.js

    # content/tic/cls6/index.html -> depth = 1
    # Need: ../../../assets/js/breadcrumb.js

    # content/tic/cls6/m1-prezentari/index.html -> depth = 2
    # Need: ../../../../assets/js/breadcrumb.js

    ups = "../" * (depth + 2)  # +2 for content/tic
    return f"{ups}assets/js/breadcrumb.js"


def extract_page_info(html_path: Path) -> dict:
    """Extract grade, module, and lesson info from file path"""
    parts = html_path.relative_to(CONTENT_DIR).parts

    info = {
        'grade': None,
        'grade_name': None,
        'module': None,
        'module_name': None,
        'lesson': None,
        'is_index': html_path.name == 'index.html',
    }

    if len(parts) >= 1 and parts[0].startswith('cls'):
        info['grade'] = parts[0]
        info['grade_name'] = GRADE_NAMES.get(parts[0], parts[0])

    if len(parts) >= 2 and parts[1].startswith('m'):
        info['module'] = parts[1]
        info['module_name'] = MODULE_PATTERNS.get(parts[1], parts[1])

    if len(parts) >= 2 and not info['is_index']:
        # Extract lesson name from title tag
        info['lesson'] = parts[-1].replace('.html', '').replace('-', ' ').title()

    return info


def extract_title_from_html(content: str) -> str:
    """Extract the title from HTML content"""
    match = re.search(r'<title>([^|<]+)', content)
    if match:
        return match.group(1).strip()
    return None


def create_breadcrumb_init_script(info: dict, script_path: str) -> str:
    """Create the breadcrumb initialization script block"""

    config_parts = []

    if info['grade']:
        config_parts.append(f"        grade: '{info['grade']}'")
        config_parts.append(f"        gradeName: '{info['grade_name']}'")

    if info['module']:
        config_parts.append(f"        module: '{info['module']}'")
        config_parts.append(f"        moduleName: '{info['module_name']}'")

    if info['lesson'] and not info['is_index']:
        config_parts.append(f"        lesson: '{info['lesson']}'")

    config = ',\n'.join(config_parts)

    return f'''
    <!-- Breadcrumb Navigation -->
    <script src="{script_path}"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            Breadcrumb.init({{
{config}
            }});
        }});
    </script>'''


def remove_old_nav(content: str) -> str:
    """Remove old back navigation elements"""
    # Remove nav-back class links
    content = re.sub(
        r'<a[^>]+class="nav-back"[^>]*>.*?</a>\s*',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # Remove standalone back links with arrow
    content = re.sub(
        r'<a[^>]+href="[^"]*"[^>]*>\s*[←←]\s*(Inapoi|Înapoi)[^<]*</a>\s*',
        '',
        content,
        flags=re.IGNORECASE
    )

    # Remove nav-bar div if it only contained the back link
    content = re.sub(
        r'<nav[^>]+class="nav-bar"[^>]*>\s*<span[^>]*>[^<]*</span>\s*</nav>\s*',
        '',
        content,
        flags=re.IGNORECASE
    )

    # Remove empty nav-bar
    content = re.sub(
        r'<nav[^>]+class="nav-bar"[^>]*>\s*</nav>\s*',
        '',
        content,
        flags=re.IGNORECASE
    )

    return content


def add_breadcrumb_to_file(html_path: Path, dry_run: bool = False) -> bool:
    """Add breadcrumb navigation to a single HTML file"""
    try:
        content = html_path.read_text(encoding='utf-8')

        # Skip if already has breadcrumb
        if 'breadcrumb.js' in content:
            print(f"  [SKIP] Already has breadcrumb: {html_path.name}")
            return False

        # Extract page info
        info = extract_page_info(html_path)

        # Skip if we can't determine grade
        if not info['grade']:
            print(f"  [SKIP] Can't determine grade: {html_path.name}")
            return False

        # Get title from HTML
        title = extract_title_from_html(content)
        if title and info['lesson']:
            info['lesson'] = title.split(':')[0] if ':' in title else title

        # Remove old navigation
        content = remove_old_nav(content)

        # Get script path
        script_path = get_breadcrumb_script_path(html_path)

        # Create breadcrumb script
        breadcrumb_script = create_breadcrumb_init_script(info, script_path)

        # Find where to insert (before </body>)
        if '</body>' in content:
            content = content.replace('</body>', breadcrumb_script + '\n</body>')
        else:
            content += breadcrumb_script

        if dry_run:
            print(f"  [DRY] Would update: {html_path.name}")
        else:
            html_path.write_text(content, encoding='utf-8')
            print(f"  [OK] Updated: {html_path.name}")

        return True

    except Exception as e:
        print(f"  [ERR] Failed {html_path.name}: {e}")
        return False


def process_all_files(dry_run: bool = False):
    """Process all HTML files in content/tic directory"""
    print(f"Processing LearningHub content...")
    print(f"Base: {CONTENT_DIR}")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print("-" * 50)

    updated = 0
    skipped = 0
    errors = 0

    # Find all HTML files
    for html_path in CONTENT_DIR.rglob("*.html"):
        # Skip the root index
        if html_path == CONTENT_DIR / "index.html":
            continue

        result = add_breadcrumb_to_file(html_path, dry_run)
        if result:
            updated += 1
        elif result is False:
            skipped += 1
        else:
            errors += 1

    print("-" * 50)
    print(f"Summary: {updated} updated, {skipped} skipped, {errors} errors")


if __name__ == "__main__":
    import sys

    dry_run = "--dry" in sys.argv
    process_all_files(dry_run=dry_run)
